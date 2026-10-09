// "use client";

// import { useState } from "react";
// import { mutate } from "swr";
// import { Search, TicketsIcon, AlertCircle, Trash2, CheckCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription
// } from "@/components/ui/dialog";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { CentroDeCostoTableComponent } from "@/components/azure/presupuesto/centro-de-costo/table/CentroDeCostoTableComponent";
// import { CentroDeCostoFormComponent, CentroCosto } from "@/components/azure/presupuesto/centro-de-costo/form/CentroDeCostoFormComponent";
// import { SessionGate } from "@/components/general_presupuesto/session/SesionGate";

// interface CentroDeCostoComponentProps {
//   cloud: string;
// }

// const fetcher = (url: string) => fetch(url).then((r) => r.json());

// export const CentroDeCostoComponentV2 = () => {

//   const cloudType = "azure";

//   // --- Estados
//   const [editingCentro, setEditingCentro] = useState<CentroCosto | null>(null);
//   const [showForm, setShowForm] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [centroToDelete, setCentroToDelete] = useState<number | string | null>(null);
//   const [errorDialogOpen, setErrorDialogOpen] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successDialogOpen, setSuccessDialogOpen] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");

//   if (!cloudType) {
//     return (
//       <div className="bg-white dark:bg-gray-900 rounded-xl py-16 text-center">
//         <div className="flex flex-col items-center justify-center space-y-3">
//           <Search className="w-12 h-12 text-gray-300 dark:text-gray-600" />
//           <div>
//             <p className="text-lg font-semibold">No se encontraron resultados</p>
//             <p className="text-sm text-gray-400 mt-1">
//               Intenta con otros términos de búsqueda
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // --- Acciones
//   const handleEdit = (centro: CentroCosto) => {
//     setEditingCentro(centro);
//     setShowForm(true);
//   };

//   const handleFormClose = () => {
//     setEditingCentro(null);
//     setShowForm(false);
//   };

//   const handleFormSubmit = async (data: CentroCosto) => {
//     try {
//       const isEditing = !!editingCentro;
//       const method = isEditing ? "PUT" : "POST";
//       const url = isEditing
//         ? `/api/presupuesto/bridge/${cloudType}/centro-costo/${data.id_centro_costo}`
//         : `/api/presupuesto/bridge/${cloudType}/centro-costo`;

//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       if (!res.ok) throw new Error(await res.text());

//       mutate(`/api/presupuesto/bridge/${cloudType}/centro-costo`);
//       handleFormClose();

//       // Mostrar mensaje de éxito
//       setSuccessMessage(isEditing
//         ? "Centro de costo actualizado exitosamente"
//         : "Centro de costo creado exitosamente"
//       );
//       setSuccessDialogOpen(true);
//     } catch (err) {
//       console.error(err);
//       setErrorMessage(err instanceof Error ? err.message : "Error al guardar el centro de costo");
//       setErrorDialogOpen(true);
//     }
//   };

//   const handleDeleteClick = (id: number | string) => {
//     setCentroToDelete(id);
//     setDeleteDialogOpen(true);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!centroToDelete) return;

//     try {
//       const res = await fetch(
//         `/api/presupuesto/bridge/${cloudType}/centro-costo/${centroToDelete}`,
//         { method: "DELETE" }
//       );

//       if (!res.ok) throw new Error("Error al eliminar el centro de costo");

//       mutate(`/api/presupuesto/bridge/${cloudType}/centro-costo`);
//       setDeleteDialogOpen(false);
//       setCentroToDelete(null);

//       // Mostrar mensaje de éxito
//       setSuccessMessage("Centro de costo eliminado exitosamente");
//       setSuccessDialogOpen(true);
//     } catch (err) {
//       console.error(err);
//       setErrorMessage(err instanceof Error ? err.message : "Error al eliminar el centro de costo");
//       setErrorDialogOpen(true);
//       setDeleteDialogOpen(false);
//       setCentroToDelete(null);
//     }
//   };

//   const handleDeleteCancel = () => {
//     setDeleteDialogOpen(false);
//     setCentroToDelete(null);
//   };

//   // --- Render
//   return (
//     <SessionGate>
//       <div className="w-full min-w-0 space-y-6 p-6">
//         <div className="mb-8">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
//                 <TicketsIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//                   Centros de costo {cloudType}
//                 </h1>
//                 {/* <p className="text-gray-500 dark:text-gray-400">
//                   Administración de centros de costo 🏷️
//                 </p> */}
//               </div>
//             </div>
//             <Button
//               onClick={() => {
//                 setEditingCentro(null);
//                 setShowForm(true);
//               }}
//               className="flex items-center gap-2 bg-green-600 cursor-pointer hover:bg-green-700 text-white"
//             >
//               + Nuevo Centro
//             </Button>
//           </div>
//         </div>

//         <CentroDeCostoTableComponent
//           cloud={cloudType}
//           onEdit={handleEdit}
//           onDelete={handleDeleteClick}
//         />

//         {/* --- MODAL FORMULARIO --- */}
//         <Dialog open={showForm} onOpenChange={setShowForm}>
//           <DialogContent className="max-w-3xl">
//             <DialogHeader>
//               <DialogTitle>
//                 {editingCentro ? `Editar Centro de Costo ${cloudType}` : `Nuevo Centro de Costo ${cloudType}`}
//               </DialogTitle>
//               <DialogDescription>
//                 Complete los campos para {editingCentro ? "actualizar" : "crear"} el centro de costo.
//               </DialogDescription>
//             </DialogHeader>

//             <CentroDeCostoFormComponent
//               initialData={editingCentro ?? undefined}
//               onSubmit={handleFormSubmit}
//               onCancel={handleFormClose}
//             />
//           </DialogContent>
//         </Dialog>

//         {/* --- DIALOG CONFIRMACIÓN DE ELIMINACIÓN --- */}
//         <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//           <AlertDialogContent className="bg-white dark:bg-gray-800">
//             <AlertDialogHeader>
//               <div className="flex items-center gap-3">
//                 <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
//                   <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
//                 </div>
//                 <div>
//                   <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
//                     ¿Eliminar centro de costo?
//                   </AlertDialogTitle>
//                 </div>
//               </div>
//               <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
//                 Esta acción no se puede deshacer. El centro de costo será eliminado permanentemente del sistema.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel
//                 onClick={handleDeleteCancel}
//                 className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
//               >
//                 Cancelar
//               </AlertDialogCancel>
//               <AlertDialogAction
//                 onClick={handleDeleteConfirm}
//                 className="bg-red-600 hover:bg-red-700 text-white"
//               >
//                 Eliminar
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>

//         {/* --- DIALOG ERROR --- */}
//         <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
//           <AlertDialogContent className="bg-white dark:bg-gray-800">
//             <AlertDialogHeader>
//               <div className="flex items-center gap-3">
//                 <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
//                   <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
//                 </div>
//                 <div>
//                   <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
//                     Error
//                   </AlertDialogTitle>
//                 </div>
//               </div>
//               <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
//                 {errorMessage}
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogAction
//                 onClick={() => setErrorDialogOpen(false)}
//                 className="bg-red-600 hover:bg-red-700 text-white"
//               >
//                 Entendido
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>

//         {/* --- DIALOG ÉXITO --- */}
//         <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
//           <AlertDialogContent className="bg-white dark:bg-gray-800">
//             <AlertDialogHeader>
//               <div className="flex items-center gap-3">
//                 <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
//                   <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
//                 </div>
//                 <div>
//                   <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
//                     ¡Éxito!
//                   </AlertDialogTitle>
//                 </div>
//               </div>
//               <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
//                 {successMessage}
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogAction
//                 onClick={() => setSuccessDialogOpen(false)}
//                 className="bg-green-600 hover:bg-green-700 text-white"
//               >
//                 Aceptar
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </div>
//     </SessionGate>
//   );
// };

"use client";

import { useState } from "react";
import { mutate } from "swr";
import { Search, TicketsIcon, AlertCircle, Trash2, CheckCircle, CloudDownload, Loader2 } from "lucide-react";
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

export const CentroDeCostoComponentV2 = () => {
  const cloudType = "azure";

  // --- Estados Originales ---
  const [editingCentro, setEditingCentro] = useState<CentroCosto | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [centroToDelete, setCentroToDelete] = useState<number | string | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // --- Nuevos Estados (Importación Dinámica) ---
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [isImportLoading, setIsImportLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  // Nomenclaturas por defecto
  const [importKeys, setImportKeys] = useState("CentroCosto, CostCenter"); 
  const [hasScanned, setHasScanned] = useState(false); // Controla el paso 1 vs paso 2
  
  const [importSearchTerm, setImportSearchTerm] = useState("");
  const [selectedImportIds, setSelectedImportIds] = useState<string[]>([]);
  const [cloudTags, setCloudTags] = useState<{ id: string; nombre: string }[]>([]);

  if (!cloudType) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl py-16 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <Search className="w-12 h-12 text-gray-300 dark:text-gray-600" />
          <div>
            <p className="text-lg font-semibold">No se encontraron resultados</p>
            <p className="text-sm text-gray-400 mt-1">Intenta con otros términos de búsqueda</p>
          </div>
        </div>
      </div>
    );
  }

  // --- Acciones Originales ---
  const handleEdit = (centro: CentroCosto) => {
    // Sanitizamos los datos para que React no falle con inputs en "null"
    const sanitizedCentro = {
      ...centro,
      responsable_centro: centro.responsable_centro ?? "",
      localizacion: centro.localizacion ?? "",
      tags: centro.tags ?? []
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
        : `/api/presupuesto/bridge/${cloudType}/centro-costo`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(await res.text());

      mutate(`/api/presupuesto/bridge/${cloudType}/centro-costo`);
      handleFormClose();

      setSuccessMessage(
        isEditing ? "Centro de costo actualizado exitosamente" : "Centro de costo creado exitosamente"
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
      const res = await fetch(`/api/presupuesto/bridge/${cloudType}/centro-costo/${centroToDelete}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar el centro de costo");

      mutate(`/api/presupuesto/bridge/${cloudType}/centro-costo`);
      setDeleteDialogOpen(false);
      setCentroToDelete(null);

      setSuccessMessage("Centro de costo eliminado exitosamente");
      setSuccessDialogOpen(true);
    } catch (err) {
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

  // --- INTEGRACIÓN: ESCANEAR TAGS DINÁMICAMENTE ---
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
        resource_type: "billing",
        cost_center_keys: importKeys,
      });

      const response = await fetch(
        `/api/presupuesto/bridge/${cloudType}/obtener-centro-costo?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Error al consultar los recursos en la nube");
      }

      const data = await response.json();
      setCloudTags(data);
      setHasScanned(true);
    } catch (err) {
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

  // --- INTEGRACIÓN: GUARDADO MASIVO ---
  const handleImportSubmit = async () => {
    setIsImporting(true);
    try {
      const response = await fetch(
        `/api/presupuesto/bridge/${cloudType}/centro-costo/importar-masivo`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombres: selectedImportIds }),
        }
      );

      if (!response.ok) throw new Error("Ocurrió un error durante la importación masiva");

      const result = await response.json();
      
      mutate(`/api/presupuesto/bridge/${cloudType}/centro-costo`);
      setShowImportDialog(false);
      
      setSuccessMessage(
        `${result.mensaje}.\nImportados: ${result.estadisticas.importados_exitosamente}\nOmitidos (ya existían): ${result.estadisticas.omitidos_por_duplicidad_o_error}`
      );
      setSuccessDialogOpen(true);
      
    } catch (err) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "Error al importar");
      setErrorDialogOpen(true);
    } finally {
      setIsImporting(false);
    }
  };

  // --- Render ---
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
                  Centros de costo {cloudType}
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

        {/* --- MODAL FORMULARIO --- */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {editingCentro ? `Editar Centro de Costo ${cloudType}` : `Nuevo Centro de Costo ${cloudType}`}
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

        {/* --- MODAL DE IMPORTACIÓN CLOUD DINÁMICO --- */}
        <Dialog open={showImportDialog} onOpenChange={(open) => !isImporting && setShowImportDialog(open)}>
          <DialogContent className="max-w-2xl bg-white dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <CloudDownload className="w-5 h-5 text-blue-600" />
                Importar Centros de Costo
              </DialogTitle>
              <DialogDescription>
                Define las nomenclaturas de tags que usas en {cloudType} para encontrar tus centros de costo.
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
                                Encontrado en recursos de {cloudType}
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