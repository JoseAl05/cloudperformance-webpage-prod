'use client'

import { useMemo, useState } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    Tag, 
    Plus, 
    Info, 
    Server, 
    Cloud, 
    Laptop, 
    X, 
    Loader2, 
    PencilLine 
} from 'lucide-react';
import { mutate } from 'swr';
import { ServiceGroup } from '@/components/gcp/vista-tags/TaggedResourcesComponent'

export interface FlattenedResource {
    service: string;
    sub_service: string;
    id_resource: string;
    resourceId: string;
    project_id: string;
    project_name: string;
    region: string;
    hasTags: boolean;
    tags_raw: Record<string, string> | null | "SIN TAGS";
    local_keys: string[];
    status: string;
}

interface TagsDataTableProps {
    data: ServiceGroup[];
    startDate?: string;
    endDate?: string;
}

export const TagsDataTable = ({ data }: TagsDataTableProps) => {

    const [selectedResource, setSelectedResource] = useState<FlattenedResource | null>(null);
    const [tagKey, setTagKey] = useState('');
    const [tagValue, setTagValue] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // 1. Aplanamos la data y capturamos local_keys del backend
    const flattenedData = useMemo(() => {
        const flat: FlattenedResource[] = [];
        data.forEach(grupo => {
            const resources = grupo.resources || [];
            resources.forEach(res => {
                const hasTags = res.tags !== "SIN TAGS";
                flat.push({
                    service: grupo.service,
                    sub_service: res.sub_service || "n/a",
                    id_resource: res.id_resource || "n/a",
                    resourceId: res.resource,
                    project_id: res.project_id || "n/a",
                    project_name: res.project_name || "Sin Nombre",
                    region: res.region || "global",
                    hasTags: hasTags,
                    tags_raw: hasTags ? res.tags : null,
                    local_keys: res.local_keys || [],
                    status: hasTags ? 'TAGEADO' : 'HUÉRFANO'
                });
            });
        });
        return flat;
    }, [data]);

    // --- ACCIÓN: ELIMINAR TAG LOCAL ---
    const handleDeleteTag = async (resourceId: string, keyToDelete: string) => {
        if (!confirm(`¿Estás seguro de eliminar el tag local "${keyToDelete}"?`)) return;
        
        setIsProcessing(true);
        try {
            const response = await fetch('/api/gcp/bridge/mantenedor-tags/gcp/local/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resource_id: resourceId, tag_key: keyToDelete })
            });

            if (!response.ok) throw new Error('Error al eliminar');
            
            // Refrescar SWR
            mutate((key) => typeof key === 'string' && key.includes('/api/gcp/bridge/mantenedor-tags/gcp/get_resource_tags'));
        } catch (error) {
            alert("No se pudo eliminar el tag local");
        } finally {
            setIsProcessing(false);
        }
    };


// --- ACCIÓN: GUARDAR O EDITAR ---
    const handleSaveTag = async () => {
        // Ahora validamos que existan los campos de proyecto y región en el recurso seleccionado
        if (!selectedResource || !tagKey || !tagValue) return;
        
        setIsProcessing(true);

        const payload = {
            resource_id: selectedResource.resourceId,
            id: selectedResource.id_resource,
            provider: 'gcp',
            service: selectedResource.service,
            sub_service: selectedResource.sub_service || "n/a",
            project_id: selectedResource.project_id,
            project_name: selectedResource.project_name,
            region: selectedResource.region || 'global', 
            tags: { [tagKey.trim()]: tagValue.trim() }
        };

        try {
            const response = await fetch('/api/gcp/bridge/mantenedor-tags/gcp/local/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorBody = await response.json();
                console.error("Error backend:", errorBody);
                throw new Error('Error al guardar');
            }

            // Limpiar y cerrar
            setSelectedResource(null);
            setTagKey('');
            setTagValue('');
            
            mutate((key) => typeof key === 'string' && key.includes('/api/gcp/bridge/mantenedor-tags/gcp/get_resource_tags'));
        } catch (error) {
            alert("Error al procesar la solicitud local. Revisa que el backend soporte los nuevos campos de Proyecto.");
        } finally {
            setIsProcessing(false);
        }
    };

    // --- ACCIÓN: CARGAR DATOS PARA EDITAR ---
    const handleEditClick = (resource: FlattenedResource, key: string, value: string) => {
        setSelectedResource(resource);
        setTagKey(key);
        setTagValue(value);
    };

    // 2. Definición de Columnas
    const columns = useMemo<ColumnDef<typeof flattenedData[0]>[]>(() => [
        {
            accessorKey: "service",
            header: "Servicio GCP",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-gray-700">{row.original.service}</span>
                    <span className="text-[9px] text-gray-400 font-mono">{row.original.sub_service}</span>
                </div>
            )
        },
        {
            accessorKey: "resourceId",
            header: "Instancia / Recurso",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-gray-700">{row.original.resourceId}</span>
                    <span className="text-[9px] text-gray-400 font-mono">{row.original.id_resource}</span>
                </div>
            )
        },
        {
        accessorKey: "project_name",
        header: "Proyecto",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-[11px] font-medium text-gray-700">{row.original.project_name}</span>
                <span className="text-[9px] text-gray-400 font-mono">{row.original.project_id}</span>
            </div>
        )
        },
        {
            accessorKey: "region",
            header: "Región",
            cell: (info) => <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600 border border-gray-200">{info.getValue() as string}</span>
        },
        {
            accessorKey: "tags_raw",
            header: "Etiquetas",
            cell: ({ row }) => {
                const tags = row.original.tags_raw;
                const localKeys = row.original.local_keys;
                if (!tags) return <span className="text-xs text-gray-400 italic">Sin tags</span>;
                
                return (
                    <div className="flex flex-wrap gap-1.5 max-w-[450px]">
                        {Object.entries(tags).map(([k, v]) => {
                            const isLocal = localKeys.includes(k);
                            return (
                                <div key={k} className={`inline-flex items-center rounded border text-[10px] shadow-sm overflow-hidden ${isLocal ? 'border-purple-200' : 'border-blue-200'}`}>
                                    <span className={`px-1.5 py-0.5 font-medium border-r flex items-center gap-1 ${isLocal ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                        {isLocal ? <Laptop className="h-3 w-3" /> : <Cloud className="h-3 w-3" />}
                                        {k}
                                    </span>
                                    <span className="bg-white text-gray-600 px-1.5 py-0.5 flex items-center gap-2">
                                        {v as string}
                                        {isLocal && (
                                            <div className="flex items-center gap-1.5 ml-1 border-l pl-1.5 border-gray-100">
                                                {/* EDITAR */}
                                                <button 
                                                    onClick={() => handleEditClick(row.original, k, v as string)}
                                                    className="text-indigo-500 hover:text-indigo-700 transition-colors"
                                                    title="Editar"
                                                >
                                                    <PencilLine className="h-3 w-3" />
                                                </button>
                                                {/* ELIMINAR */}
                                                <button 
                                                    onClick={() => handleDeleteTag(row.original.resourceId, k)} 
                                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        )}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                );
            }
        },
        {
            id: "acciones",
            header: "Acción",
            cell: ({ row }) => (
                <button
                    onClick={() => setSelectedResource(row.original)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all shadow-sm"
                >
                    <Plus className="h-3 w-3" /> Tag Local
                </button>
            )
        }
    ], []);

    return (
        <>
            <Card className="shadow-sm border-gray-200">
                <CardHeader className="border-b bg-gray-50/50 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2 text-gray-800 font-bold">
                            <Server className="h-5 w-5 text-indigo-600" /> Detalle de Inventario y Etiquetas
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">Gestión local de FinOps para recursos de Google Cloud</p>
                    </div>
                    <div className="flex gap-3 text-[10px] font-bold uppercase tracking-widest bg-white p-2 rounded-lg border shadow-sm">
                        <span className="flex items-center gap-1 text-blue-600"><Cloud className="h-3 w-3" /> Nube</span>
                        <span className="flex items-center gap-1 text-purple-600"><Laptop className="h-3 w-3" /> Local</span>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <DataTableGrouping
                        columns={columns}
                        data={flattenedData}
                        filterColumn="resourceId"
                        filterPlaceholder="Buscar por ID de recurso..."
                        enableGrouping={true}
                        groupByColumn="service"
                        pageSizeItems={10}
                    />
                </CardContent>
            </Card>

            {/* MODAL PARA AGREGAR / EDITAR */}
            {selectedResource && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-4 border-b bg-gray-50 flex justify-between items-center border-gray-100">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Tag className="h-4 w-4 text-indigo-500" /> 
                                {tagKey ? 'Editar Tag Local' : 'Nuevo Tag Local'}
                            </h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="text-[10px] bg-gray-50 p-2.5 rounded font-mono text-gray-500 break-all border border-gray-200">
                                <span className="font-bold text-indigo-600 mr-2">RECURSO:</span> 
                                {selectedResource.resourceId}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Etiqueta (Key)</label>
                                    <input 
                                        type="text" 
                                        placeholder="ej. owner" 
                                        value={tagKey} 
                                        onChange={e => setTagKey(e.target.value)} 
                                        className="w-full border border-gray-200 p-2.5 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-gray-800 transition-all" 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Valor (Value)</label>
                                    <input 
                                        type="text" 
                                        placeholder="ej. cloudperformance" 
                                        value={tagValue} 
                                        onChange={e => setTagValue(e.target.value)} 
                                        className="w-full border border-gray-200 p-2.5 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-gray-800 transition-all" 
                                    />
                                </div>
                            </div>

                            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex gap-2">
                                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-amber-700 leading-relaxed">
                                    Nota: Si la llave ya existe, el valor se actualizará. Los cambios son locales y no afectan la consola de Google Cloud.
                                </p>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                            <button 
                                onClick={() => {
                                    setSelectedResource(null);
                                    setTagKey('');
                                    setTagValue('');
                                }} 
                                className="px-4 py-2 text-xs font-bold border border-gray-300 rounded-md hover:bg-white text-gray-600 transition-all active:scale-95"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleSaveTag} 
                                disabled={isProcessing || !tagKey || !tagValue} 
                                className="px-5 py-2 text-xs font-bold bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 shadow-md shadow-indigo-200 active:scale-95 transition-all"
                            >
                                {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Tag className="h-3.5 w-3.5" />}
                                {isProcessing ? 'Procesando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};