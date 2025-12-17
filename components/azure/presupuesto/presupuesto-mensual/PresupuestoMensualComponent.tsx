"use client";

import { useState } from "react";
import { mutate } from "swr";
import {
  Search,
  Trash2,
  AlertCircle,
  CheckCircle,
  Calendar,
} from "lucide-react";
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
import { PresupuestoMensualTableComponent } from "@/components/azure/presupuesto/presupuesto-mensual/table/PresupuestoMensualTableComponent";
import {
  PresupuestoMensualFormComponent,
  PresupuestoMensual,
} from "@/components/azure/presupuesto/presupuesto-mensual/form/PresupuestoMensualFormComponent";
import { SessionGate } from "@/components/general_presupuesto/session/SesionGate";

interface PresupuestoMensualComponentProps {
  cloud: string;
}

export const PresupuestoMensualComponent = ({
  cloud,
}: PresupuestoMensualComponentProps) => {

  // --- Mapeo Cloud
  const cloudTypeMap: Record<string, string> = {
    AWS: "aws",
    AZURE: "azure",
  };
  const cloudType = cloudTypeMap[cloud] ?? cloud;

  // --- Estados
  const [editingItem, setEditingItem] = useState<PresupuestoMensual | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | string | null>(null);
  const [alert, setAlert] = useState<{
    type: "error" | "success" | null;
    message: string;
  }>({ type: null, message: "" });

  if (!cloud)
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

  // --- Handlers
  const handleOpenForm = (item?: PresupuestoMensual) => {
    setEditingItem(item || null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingItem(null);
    setShowForm(false);
  };

  const handleSubmit = async (data: PresupuestoMensual) => {
    try {
      const isEditing = Boolean(editingItem);
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `/api/presupuesto/bridge/${cloudType}/presupuesto/mensual/${data.id_presupuesto_mensual}`
        : `/api/presupuesto/bridge/${cloudType}/presupuesto/anual/${data.id_presupuesto_anual}/mensual`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(await res.text());

      mutate(`/api/presupuesto/bridge/${cloudType}/presupuesto/mensual/all`);
      handleCloseForm();

      setAlert({
        type: "success",
        message: isEditing
          ? "Presupuesto mensual actualizado correctamente"
          : "Presupuesto mensual creado correctamente",
      });
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Error al guardar el presupuesto mensual",
      });
    }
  };

  const handleDelete = (id: number | string) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      const res = await fetch(
        `/api/presupuesto/bridge/${cloudType}/presupuesto/mensual/${confirmDeleteId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Error al eliminar el presupuesto mensual");

      // mutate(`/api/presupuesto/bridge/${cloudType}/presupuesto/mensual/all`);
      mutate(`/api/presupuesto/bridge/${cloud}/presupuesto/anual`);
      setConfirmDeleteId(null);
      setAlert({
        type: "success",
        message: "Presupuesto mensual eliminado correctamente",
      });
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Error al eliminar el presupuesto mensual",
      });
    }
  };

  // --- Render
  return (
    <SessionGate>
      <div className="w-full min-w-0 space-y-6 p-6">
        {/* Header */}
        {/* <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <TicketsIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Presupuesto Mensual {cloud}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
                  Gestión de presupuestos mensuales 📊
            </p>
          </div>

          <Button
            onClick={() => handleOpenForm()}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            + Nuevo Presupuesto
          </Button>
        </div> */}
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Presupuestos Mensual {cloud}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Gestión de presupuestos mensuales 📊
                </p>
              </div>
            </div>
            <Button
              onClick={() => handleOpenForm()}
              // onClick={() => {
              //   setEditingPresupuesto(null);
              //   setShowForm(true);
              // }}
              className="flex items-center gap-2 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white"
            >
              + Nuevo Presupuesto
            </Button>
          </div>
        </div>

        {/* Tabla */}
        <PresupuestoMensualTableComponent
          cloud={cloudType}
          onEdit={handleOpenForm}
          onDelete={handleDelete}
        />

        {/* Formulario Modal */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="!max-w-none w-[35vw] ">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-gray-100">
                {editingItem
                  ? `Editar Presupuesto Mensual (${cloud})`
                  : `Nuevo Presupuesto Mensual (${cloud})`}
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Completa los campos para {editingItem ? " actualizar" : " crear"} un presupuesto mensual.
              </DialogDescription>
            </DialogHeader>

            <PresupuestoMensualFormComponent
              initialData={editingItem ?? undefined}
              onSubmit={handleSubmit}
              onCancel={handleCloseForm}
              cloud={cloudType}
            />
          </DialogContent>
        </Dialog>

        {/* Confirmación de eliminación */}
        <AlertDialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
          <AlertDialogContent className="bg-white dark:bg-gray-800">
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
                  ¿Eliminar presupuesto mensual?
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Diálogo de alerta (éxito / error) */}
        <AlertDialog open={!!alert.type} onOpenChange={() => setAlert({ type: null, message: "" })}>
          <AlertDialogContent className="bg-white dark:bg-gray-800">
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    alert.type === "success"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}
                >
                  {alert.type === "success" ? (
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
                  {alert.type === "success" ? "¡Éxito!" : "Error"}
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                {alert.message}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => setAlert({ type: null, message: "" })}
                className={`${
                  alert.type === "success"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } text-white`}
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
