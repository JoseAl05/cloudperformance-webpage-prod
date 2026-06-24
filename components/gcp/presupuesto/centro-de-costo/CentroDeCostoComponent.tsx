"use client";

import { useState } from "react";
import { mutate } from "swr";
import { 
  Search, 
  TicketsIcon, 
  AlertCircle, 
  Trash2, 
  CheckCircle, 
  CloudDownload, 
  Loader2 
} from "lucide-react";
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
import { CentroDeCostoTableComponent, CentroCosto } from "@/components/gcp/presupuesto/centro-de-costo/table/CentroDeCostoTableComponent";
import { CentroDeCostoFormComponent } from "@/components/gcp/presupuesto/centro-de-costo/form/CentroDeCostoFormComponent";
import { SessionGate } from "@/components/general_presupuesto/session/SesionGate";

interface CloudTag {
  id: string;
  nombre: string;
}

export const CentroDeCostoComponent = () => {
  const cloudType = "gcp";

  const [editingCentro, setEditingCentro] = useState<CentroCosto | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [centroToDelete, setCentroToDelete] = useState<number | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successDialogOpen, setSuccessDialogOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [showImportDialog, setShowImportDialog] = useState<boolean>(false);
  const [isImportLoading, setIsImportLoading] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  
  const [importKeys, setImportKeys] = useState<string>("CentroCosto, CostCenter"); 
  const [hasScanned, setHasScanned] = useState<boolean>(false); 
  const [importSearchTerm, setImportSearchTerm] = useState<string>("");
  const [selectedImportIds, setSelectedImportIds] = useState<string[]>([]);
  const [cloudTags, setCloudTags] = useState<CloudTag[]>([]);

  const handleEdit = (centro: CentroCosto) => {
    const sanitizedCentro: CentroCosto = {
      ...centro,
      responsable_centro: centro.responsable_centro ?? "",
      localizacion: centro.localizacion ?? "",
    };
    setEditingCentro(sanitizedCentro);
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
        : `/api/presupuesto/bridge/${cloudType}/centro-costo/`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMsg = "Error inesperado en el servidor";
        
        try {
          const errorJson = JSON.parse(errorText);
          let extracted = errorJson.detail || errorJson.message || errorJson.error;
          
          if (Array.isArray(extracted)) {
            errorMsg = extracted.map((e: { msg: string }) => e.msg).join(", ");
          } else if (typeof extracted === "string") {
            if (extracted.startsWith('{') && extracted.includes('detail')) {
              try {
                extracted = JSON.parse(extracted).detail;
              } catch 
            }
            errorMsg = extracted;
          } else if (extracted) {
            errorMsg = JSON.stringify(extracted);
          } else {
            errorMsg = errorText;
          }
        } catch {
          errorMsg = errorText || `Error HTTP: ${res.status}`;
        }
        
        throw new Error(errorMsg);
      }

      mutate(`/api/presupuesto/bridge/${cloudType}/centro-costo`);
      handleFormClose();

      setSuccessMessage(
        isEditing ? "Centro de costo actualizado exitosamente" : "Centro de costo creado exitosamente"
      );
      setSuccessDialogOpen(true);
    } catch (err: unknown) {
      let cleanMessage = err instanceof Error ? err.message : "Error al guardar el centro de costo";
      
      try {
        if (cleanMessage.startsWith('{') && cleanMessage.includes('detail')) {
          cleanMessage = JSON.parse(cleanMessage).detail || cleanMessage;
        }
      } catch {

      }

      setErrorMessage(cleanMessage);
      setErrorDialogOpen(true);
    }
  };

  const handleDeleteClick = (id: number) => {
    setCentroToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (centroToDelete === null) return;
    try {
      const res = await fetch(`/api/presupuesto/bridge/${cloudType}/centro-costo/${centroToDelete}`, { 
        method: "DELETE" 
      });
      
      if (!res.ok) {
        throw new Error("Error al eliminar el centro de costo");
      }

      mutate(`/api/presupuesto/bridge/${cloudType}/centro-costo`);
      setDeleteDialogOpen(false);
      setCentroToDelete(null);

      setSuccessMessage("Centro de costo eliminado exitosamente");
      setSuccessDialogOpen(true);
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "Error al eliminar");
      setErrorDialogOpen(true);
      setDeleteDialogOpen(false);
      setCentroToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCentroToDelete(null);
  };

  const handleOpenImport = () => {
    setShowImportDialog(true);
    setHasScanned(false);
    setImportKeys("CentroCosto, CostCenter");
    setCloudTags([]);
    setImportSearchTerm("");
    setSelectedImportIds([]);
  };

  const handleScanCloud = async () => {
    if (!importKeys.trim()) return;
    
    setIsImportLoading(true);
    setImportSearchTerm("");
    setSelectedImportIds([]);
    setCloudTags([]);

    try {
      const params = new URLSearchParams({
        collection: "azure_consumption_billing_account_modern_usage_details",
        tag_column_name: "tags",
        cost_center_keys: importKeys,
      });

      const response = await fetch(
        `/api/presupuesto/bridge/${cloudType}/gcp/obtener-centro-costo?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Error al consultar los recursos en la nube");
      }

      const data: CloudTag[] = await response.json();
      setCloudTags(data);
      setHasScanned(true);
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "Error de conexión con la nube");
      setShowImportDialog(false);
      setErrorDialogOpen(true);
    } finally {
      setIsImportLoading(false);
    }
  };

  const filteredTags = cloudTags.filter((tag) =>
    tag.nombre.toLowerCase().includes(importSearchTerm.toLowerCase())
  );

  const handleToggleImportSelection = (id: string) => {
    setSelectedImportIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllImports = () => {
    if (selectedImportIds.length === filteredTags.length) {
      setSelectedImportIds([]);
    } else {
      setSelectedImportIds(filteredTags.map((tag) => tag.id));
    }
  };

  const handleImportSubmit = async () => {
    setIsImporting(true);
    try {
      const response = await fetch(
        `/api/${cloudType}/gcp/centro-costo/importar-masivo`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombres: selectedImportIds }),
        }
      );

      if (!response.ok) {
        throw new Error("Ocurrió un error durante la importación masiva");
      }

      const result = await response.json();
      
      mutate(`/api/presupuesto/bridge/${cloudType}/centro-costo`);
      setShowImportDialog(false);
      
      setSuccessMessage(
        `${result.mensaje}.\nImportados: ${result.estadisticas?.importados_exitosamente ?? 0}\nOmitidos (ya existían): ${result.estadisticas?.omitidos_por_duplicidad_o_error ?? 0}`
      );
      setSuccessDialogOpen(true);
      
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "Error al importar");
      setErrorDialogOpen(true);
    } finally {
      setIsImporting(false);
    }
  };

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
                  Centros de costo {cloudType.toUpperCase()}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleOpenImport}
                variant="outline"
                className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950"
              >
                <CloudDownload className="w-4 h-4" />
                Importar desde la nube
              </Button>

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
        </div>

        <CentroDeCostoTableComponent
          cloud={cloudType}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {editingCentro ? `Editar Centro de Costo ${cloudType.toUpperCase()}` : `Nuevo Centro de Costo ${cloudType.toUpperCase()}`}
              </DialogTitle>
              <DialogDescription>
                Complete los campos para {editingCentro ? "actualizar" : "crear"} el centro de costo.
              </DialogDescription>
            </DialogHeader>

            <CentroDeCostoFormComponent
              initialData={editingCentro ? { ...editingCentro, id_centro_costo: String(editingCentro.id_centro_costo) } : undefined}
              onSubmit={(data) => handleFormSubmit({ ...data, id_centro_costo: Number(data.id_centro_costo) })}
              onCancel={handleFormClose}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={showImportDialog} onOpenChange={(open) => !isImporting && setShowImportDialog(open)}>
          <DialogContent className="max-w-2xl bg-white dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <CloudDownload className="w-5 h-5 text-blue-600" />
                Importar Centros de Costo
              </DialogTitle>
              <DialogDescription>
                Define las nomenclaturas de tags que usas en {cloudType.toUpperCase()} para encontrar tus centros de costo.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Llaves de Tags (separadas por coma)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                    value={importKeys}
                    onChange={(e) => setImportKeys(e.target.value)}
                    placeholder="Ej: CentroCosto, CostCenter, CC"
                    disabled={isImportLoading || isImporting}
                  />
                  <Button
                    onClick={handleScanCloud}
                    disabled={!importKeys.trim() || isImportLoading || isImporting}
                    className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                  >
                    {isImportLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4 mr-2" />
                    )}
                    Escanear Nube
                  </Button>
                </div>
              </div>

              {hasScanned && (
                <div className="pt-4 border-t dark:border-gray-800 space-y-4 mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Filtrar resultados por nombre..."
                      className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                      value={importSearchTerm}
                      onChange={(e) => setImportSearchTerm(e.target.value)}
                      disabled={isImporting}
                    />
                  </div>

                  <div className="border rounded-md dark:border-gray-700 overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b dark:border-gray-700 flex items-center justify-between">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                          checked={filteredTags.length > 0 && selectedImportIds.length === filteredTags.length}
                          onChange={handleSelectAllImports}
                          disabled={isImporting}
                        />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Seleccionar todos ({filteredTags.length})
                        </span>
                      </label>
                      <span className="text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 px-2.5 py-1 rounded-full">
                        {selectedImportIds.length} seleccionados
                      </span>
                    </div>

                    <div className="max-h-64 overflow-y-auto p-2 space-y-1 bg-white dark:bg-gray-900">
                      {filteredTags.length === 0 ? (
                        <p className="text-center text-sm text-gray-500 py-8">
                          No se encontraron centros de costo asociados a esas llaves.
                        </p>
                      ) : (
                        filteredTags.map((tag) => (
                          <label
                            key={tag.id}
                            className={`flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 ${isImporting ? 'opacity-50 pointer-events-none' : ''}`}
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                              checked={selectedImportIds.includes(tag.id)}
                              onChange={() => handleToggleImportSelection(tag.id)}
                              disabled={isImporting}
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Tag: {tag.nombre}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Encontrado en recursos de {cloudType.toUpperCase()}
                              </span>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={`flex justify-end gap-3 pt-4 ${hasScanned ? 'border-t dark:border-gray-800 mt-2' : ''}`}>
              <Button
                variant="outline"
                onClick={() => setShowImportDialog(false)}
                className="dark:border-gray-600 dark:text-gray-300"
                disabled={isImportLoading || isImporting}
              >
                Cancelar
              </Button>
              {hasScanned && (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white min-w-[180px]"
                  onClick={handleImportSubmit}
                  disabled={selectedImportIds.length === 0 || isImportLoading || isImporting}
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    "Agregar Seleccionados"
                  )}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

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
              <AlertDialogDescription className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
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