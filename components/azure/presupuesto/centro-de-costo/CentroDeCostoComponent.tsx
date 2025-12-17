"use client";

import { useState } from "react";
import { mutate } from "swr";
import { Search, TicketsIcon, AlertCircle, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
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
import { CentroDeCostoTableComponent } from "@/components/azure/presupuesto/centro-de-costo/table/CentroDeCostoTableComponent";
import { CentroDeCostoFormComponent, CentroCosto } from "@/components/azure/presupuesto/centro-de-costo/form/CentroDeCostoFormComponent";
import { SessionGate } from "@/components/general_presupuesto/session/SesionGate";

interface CentroDeCostoComponentProps {
  cloud: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const CentroDeCostoComponent = ({ cloud }: CentroDeCostoComponentProps) => {
    const cloudTypeMap: Record<string, string> = {
    AWS: "aws",
    AZURE: "azure",
  };
  const cloudType = cloud ? cloudTypeMap[cloud] ?? undefined : undefined;

  // --- Estados
  const [editingCentro, setEditingCentro] = useState<CentroCosto | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [centroToDelete, setCentroToDelete] = useState<number | string | null>(null);
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
            <p className="text-lg font-semibold">No se encontraron resultados</p>
            <p className="text-sm text-gray-400 mt-1">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- Acciones
  const handleEdit = (centro: CentroCosto) => {
    setEditingCentro(centro);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setEditingCentro(null);
    setShowForm(false);
  };

  const handleFormSubmit = async (data: CentroCosto) => {
    try {
      const isEditing = !!editingCentro;
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `/api/presupuesto/bridge/${cloudType}/centro-costo/${data.id_centro_costo}`
        : `/api/presupuesto/bridge/${cloudType}/centro-costo`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(await res.text());
      
      mutate(`/api/presupuesto/bridge/${cloudType}/centro-costo`);
      handleFormClose();
      
      // Mostrar mensaje de éxito
      setSuccessMessage(isEditing 
        ? "Centro de costo actualizado exitosamente" 
        : "Centro de costo creado exitosamente"
      );
      setSuccessDialogOpen(true);
    } catch (err) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "Error al guardar el centro de costo");
      setErrorDialogOpen(true);
    }
  };

  const handleDeleteClick = (id: number | string) => {
    setCentroToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!centroToDelete) return;
    
    try {
      const res = await fetch(
        `/api/presupuesto/bridge/${cloudType}/centro-costo/${centroToDelete}`,
        { method: "DELETE" }
      );
      
      if (!res.ok) throw new Error("Error al eliminar el centro de costo");
      
      mutate(`/api/presupuesto/bridge/${cloudType}/centro-costo`);
      setDeleteDialogOpen(false);
      setCentroToDelete(null);
      
      // Mostrar mensaje de éxito
      setSuccessMessage("Centro de costo eliminado exitosamente");
      setSuccessDialogOpen(true);
    } catch (err) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "Error al eliminar el centro de costo");
      setErrorDialogOpen(true);
      setDeleteDialogOpen(false);
      setCentroToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCentroToDelete(null);
  };

  // --- Render
  return (
    <SessionGate>
      <div className="w-full min-w-0 space-y-6 p-6">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <TicketsIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Centros de costo {cloud}
                </h1>
                {/* <p className="text-gray-500 dark:text-gray-400">
                  Administración de centros de costo 🏷️
                </p> */}
              </div>
            </div>
            <Button
              onClick={() => {
                setEditingCentro(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-green-600 cursor-pointer hover:bg-green-700 text-white"
            >
              + Nuevo Centro
            </Button>
          </div>
        </div>

        <CentroDeCostoTableComponent
          cloud={cloudType}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        {/* --- MODAL FORMULARIO --- */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {editingCentro ? `Editar Centro de Costo ${cloud}` : `Nuevo Centro de Costo ${cloud}`}
              </DialogTitle>
              <DialogDescription>
                Complete los campos para {editingCentro ? "actualizar" : "crear"} el centro de costo.
              </DialogDescription>
            </DialogHeader>

            <CentroDeCostoFormComponent
              initialData={editingCentro ?? undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleFormClose}
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
                    ¿Eliminar centro de costo?
                  </AlertDialogTitle>
                </div>
              </div>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                Esta acción no se puede deshacer. El centro de costo será eliminado permanentemente del sistema.
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