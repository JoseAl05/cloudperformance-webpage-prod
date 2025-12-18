"use client";

import { useState } from "react";
import { mutate } from "swr";
import { Calendar, Search, AlertCircle, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PresupuestoAnualTableComponent } from "@/components/azure/presupuesto/presupuesto-anual/table/PresupuestoAnualTableComponent";
import { PresupuestoAnualFormComponent, PresupuestoAnual } from "@/components/azure/presupuesto/presupuesto-anual/form/PresupuestoAnualFormComponent";
import { SessionGate } from "@/components/general_presupuesto/session/SesionGate";

interface PresupuestoAnualComponentProps {
  cloud: string;
}

export const PresupuestoAnualComponent = ({ cloud }: PresupuestoAnualComponentProps) => {
  const cloudTypeMap: Record<string, string> = {
    AWS: "aws",
    AZURE: "azure",
  };
  const cloudType = cloud ? cloudTypeMap[cloud] ?? undefined : undefined;

  // --- Estados
  const [editingPresupuesto, setEditingPresupuesto] = useState<PresupuestoAnual | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [presupuestoToDelete, setPresupuestoToDelete] = useState<number | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  if (!cloud) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl py-16 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <Search className="w-12 h-12 text-gray-300 dark:text-gray-600" />
          <div>
            <p className="text-lg font-semibold dark:text-gray-100">No se encontraron resultados</p>
            <p className="text-sm text-gray-400 mt-1">
              Selecciona un proveedor cloud
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- Acciones
  const handleEdit = (presupuesto: PresupuestoAnual) => {
    setEditingPresupuesto(presupuesto);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setEditingPresupuesto(null);
    setShowForm(false);
  };

  const handleFormSubmit = async (data: PresupuestoAnual) => {
    try {
      const isEditing = !!editingPresupuesto;
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `/api/presupuesto/bridge/${cloudType}/presupuesto/anual/${data.id_presupuesto_anual}`
        : `/api/presupuesto/bridge/${cloudType}/presupuesto/anual`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Error al guardar el presupuesto");
      }
      
      // Revalidar los datos de la tabla
      mutate(`/api/presupuesto/bridge/${cloudType}/presupuesto/anual`);
      handleFormClose();
      
      // Mostrar mensaje de éxito
      setSuccessMessage(isEditing 
        ? "Presupuesto anual actualizado exitosamente" 
        : "Presupuesto anual creado exitosamente"
      );
      setSuccessDialogOpen(true);
    } catch (err) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "Error al guardar el presupuesto anual");
      setErrorDialogOpen(true);
    }
  };

  const handleDeleteClick = (id: number) => {
    setPresupuestoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!presupuestoToDelete) return;
    
    try {
      const res = await fetch(
        `/api/presupuesto/bridge/${cloudType}/presupuesto/anual/${presupuestoToDelete}`,
        { method: "DELETE" }
      );
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Error al eliminar el presupuesto");
      }
      
      // Revalidar los datos de la tabla
      mutate(`/api/presupuesto/bridge/${cloudType}/presupuesto/anual`);
      setDeleteDialogOpen(false);
      setPresupuestoToDelete(null);
      
      // Mostrar mensaje de éxito
      setSuccessMessage("Presupuesto anual eliminado exitosamente");
      setSuccessDialogOpen(true);
    } catch (err) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "Error al eliminar el presupuesto anual");
      setErrorDialogOpen(true);
      setDeleteDialogOpen(false);
      setPresupuestoToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPresupuestoToDelete(null);
  };

  // --- Render
  return (
    <SessionGate>
      <div className="w-full min-w-0 space-y-6 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Presupuestos Anuales {cloud}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Gestión de presupuestos anuales y mensuales 📊
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                setEditingPresupuesto(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white"
            >
              + Nuevo Presupuesto
            </Button>
          </div>
        </div>

        {/* Tabla de presupuestos */}
        <PresupuestoAnualTableComponent
          cloud={cloudType}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        {/* --- MODAL FORMULARIO --- */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="!max-w-none w-[70vw] h-[90vh] overflow-y-auto p-8 rounded-2xl shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-gray-100">
                {editingPresupuesto ? `Editar Presupuesto Anual ${cloud}` : `Nuevo Presupuesto Anual ${cloud}`}
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Complete los campos para {editingPresupuesto ? "actualizar" : "crear"} el presupuesto anual.
                {editingPresupuesto ? " Puede agregar o modificar el desglose mensual." : ""}
              </DialogDescription>
            </DialogHeader>
            <PresupuestoAnualFormComponent
              initialData={editingPresupuesto ?? undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleFormClose}
              cloud={cloudType}
            />
          </DialogContent>
        </Dialog>

        {/* --- DIALOG CONFIRMACIÓN DE ELIMINACIÓN --- */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-white dark:bg-gray-800">
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
                    ¿Eliminar presupuesto anual?
                  </AlertDialogTitle>
                </div>
              </div>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                Esta acción no se puede deshacer. El presupuesto anual y todos sus datos mensuales asociados serán eliminados permanentemente del sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                onClick={handleDeleteCancel}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* --- DIALOG ERROR --- */}
        <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
          <AlertDialogContent className="bg-white dark:bg-gray-800">
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
                    Error
                  </AlertDialogTitle>
                </div>
              </div>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                {errorMessage}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction 
                onClick={() => setErrorDialogOpen(false)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Entendido
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* --- DIALOG ÉXITO --- */}
        <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
          <AlertDialogContent className="bg-white dark:bg-gray-800">
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
                    ¡Éxito!
                  </AlertDialogTitle>
                </div>
              </div>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                {successMessage}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction 
                onClick={() => setSuccessDialogOpen(false)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Aceptar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SessionGate>
  );
};