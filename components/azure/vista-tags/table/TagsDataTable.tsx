'use client'

import { useMemo, useState } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag, Plus, Info, Server, Cloud, Laptop, X, Loader2, PencilLine } from 'lucide-react';
import { mutate } from 'swr';
import { ServiceGroupAzure } from '@/components/azure/vista-tags/TaggedResourcesComponent';

export interface FlattenedResource {
    service: string;
    sub_service: string;
    id_resource: string;
    resourceId: string;
    subscription_guid: string;
    subscription_name: string;
    region: string;
    hasTags: boolean;
    tags_raw: Record<string, string> | null | "SIN TAGS";
    local_keys: string[];
    status: string;
}

interface TagsDataTableProps {
    data: ServiceGroupAzure[];
}

export const TagsDataTableAzure = ({ data }: TagsDataTableProps) => {

    const [selectedResource, setSelectedResource] = useState<FlattenedResource | null>(null);
    const [tagKey, setTagKey] = useState('');
    const [tagValue, setTagValue] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const flattenedData = useMemo(() => {
        const flat: FlattenedResource[] = [];
        data.forEach(grupo => {
            const resources = grupo.resources || [];
            resources.forEach(res => {
                const hasTags = res.tags !== "SIN TAGS";
                flat.push({
                    service: grupo.service,
                    sub_service: res.sub_service || "n/a",
                    id_resource: res.id_resource, 
                    resourceId: res.resource,
                    subscription_guid: res.subscription_guid || "n/a",
                    subscription_name: res.subscription_name || "Sin Nombre",
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

    const handleDeleteTag = async (resourceId: string, keyToDelete: string) => {
        if (!confirm(`¿Estás seguro de eliminar el tag local "${keyToDelete}"?`)) return;
        setIsProcessing(true);
        try {
            const response = await fetch('/api/azure/bridge/mantenedor-tags/azure/local/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resource_id: resourceId, tag_key: keyToDelete })
            });
            if (!response.ok) throw new Error('Error al eliminar');
            mutate((key) => typeof key === 'string' && key.includes('/api/azure/bridge/mantenedor-tags/azure/get_resource_tags'));
        } catch (error) {
            alert("No se pudo eliminar el tag local");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSaveTag = async () => {
        if (!selectedResource || !tagKey || !tagValue) return;
        setIsProcessing(true);
        const payload = {
            resource_id: selectedResource.resourceId,
            id: selectedResource.id_resource,
            provider: 'azure',
            service: selectedResource.service,
            sub_service: selectedResource.sub_service,
            subscription_guid: selectedResource.subscription_guid,
            subscription_name: selectedResource.subscription_name,
            region: selectedResource.region || 'global',
            tags: { [tagKey.trim()]: tagValue.trim() }
        };
        try {
            const response = await fetch('/api/azure/bridge/mantenedor-tags/azure/local/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Error al guardar');
            setSelectedResource(null); setTagKey(''); setTagValue('');
            mutate((key) => typeof key === 'string' && key.includes('/api/azure/bridge/mantenedor-tags/azure/get_resource_tags'));
        } catch (error) {
            alert("Error al procesar la solicitud local.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleEditClick = (resource: FlattenedResource, key: string, value: string) => {
        setSelectedResource(resource); setTagKey(key); setTagValue(value);
    };

    const columns = useMemo<ColumnDef<typeof flattenedData[0]>[]>(() => [
        {
            accessorKey: "service",
            header: "Servicio Azure",
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
            accessorKey: "subscription_name",
            header: "Suscripción",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-gray-700">{row.original.subscription_name}</span>
                    <span className="text-[9px] text-gray-400 font-mono">{row.original.subscription_guid}</span>
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
                                <div key={k} className={`inline-flex items-center rounded border text-[10px] shadow-sm overflow-hidden ${isLocal ? 'border-purple-200' : 'border-[#0078D4]/30'}`}>
                                    <span className={`px-1.5 py-0.5 font-medium border-r flex items-center gap-1 ${isLocal ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-[#0078D4]/10 text-[#0078D4] border-[#0078D4]/30'}`}>
                                        {isLocal ? <Laptop className="h-3 w-3" /> : <Cloud className="h-3 w-3" />}
                                        {k}
                                    </span>
                                    <span className="bg-white text-gray-600 px-1.5 py-0.5 flex items-center gap-2">
                                        {v as string}
                                        {isLocal && (
                                            <div className="flex items-center gap-1.5 ml-1 border-l pl-1.5 border-gray-100">
                                                <button onClick={() => handleEditClick(row.original, k, v as string)} className="text-indigo-500 hover:text-indigo-700 transition-colors">
                                                    <PencilLine className="h-3 w-3" />
                                                </button>
                                                <button onClick={() => handleDeleteTag(row.original.resourceId, k)} className="text-gray-400 hover:text-red-600 transition-colors">
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-[#0078D4]/30 bg-[#0078D4]/10 text-[#0078D4] hover:bg-[#0078D4]/20 transition-all shadow-sm"
                >
                    <Plus className="h-3 w-3" /> Tag Local
                </button>
            )
        }
    ], []);

    return (
        <>
            <Card className="shadow-sm border-gray-200">
                {/* ESTÁNDAR GCP: HEADER CON LEYENDA */}
                <CardHeader className="border-b bg-gray-50/50 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2 text-gray-800 font-bold">
                            <Server className="h-5 w-5 text-[#0078D4]" /> Detalle de Inventario y Etiquetas
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">Gestión local de FinOps para recursos de Microsoft Azure</p>
                    </div>
                    <div className="flex gap-3 text-[10px] font-bold uppercase tracking-widest bg-white p-2 rounded-lg border shadow-sm">
                        <span className="flex items-center gap-1 text-[#0078D4]"><Cloud className="h-3 w-3" /> Nube</span>
                        <span className="flex items-center gap-1 text-purple-600"><Laptop className="h-3 w-3" /> Local</span>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <DataTableGrouping columns={columns} data={flattenedData} filterColumn="resourceId" filterPlaceholder="Buscar por ID de recurso..." enableGrouping={true} groupByColumn="service" pageSizeItems={10} />
                </CardContent>
            </Card>

            {selectedResource && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-4 border-b bg-gray-50 flex justify-between items-center border-gray-100">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Tag className="h-4 w-4 text-[#0078D4]" /> 
                                {tagKey ? 'Editar Tag Local' : 'Nuevo Tag Local'}
                            </h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="text-[10px] bg-gray-50 p-2.5 rounded font-mono text-gray-500 break-all border border-gray-200">
                                <span className="font-bold text-[#0078D4] mr-2">RECURSO:</span> 
                                {selectedResource.resourceId}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Etiqueta (Key)</label>
                                    <input type="text" placeholder="ej. owner" value={tagKey} onChange={e => setTagKey(e.target.value)} className="w-full border border-gray-200 p-2.5 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#0078D4]/30 focus:border-[#0078D4] text-gray-800 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Valor (Value)</label>
                                    <input type="text" placeholder="ej. cloudperformance" value={tagValue} onChange={e => setTagValue(e.target.value)} className="w-full border border-gray-200 p-2.5 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#0078D4]/30 focus:border-[#0078D4] text-gray-800 transition-all" />
                                </div>
                            </div>

                            {/* ESTÁNDAR GCP: NOTA ÁMBAR */}
                            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex gap-2">
                                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-amber-700 leading-relaxed">
                                    Nota: Si la llave ya existe, el valor se actualizará. Los cambios son locales y no afectan la consola de Azure.
                                </p>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                            <button onClick={() => { setSelectedResource(null); setTagKey(''); setTagValue(''); }} className="px-4 py-2 text-xs font-bold border border-gray-300 rounded-md hover:bg-white text-gray-600 transition-all active:scale-95">
                                Cancelar
                            </button>
                            <button onClick={handleSaveTag} disabled={isProcessing || !tagKey || !tagValue} className="px-5 py-2 text-xs font-bold bg-[#0078D4] text-white rounded-md hover:bg-[#005A9E] disabled:opacity-50 flex items-center gap-2 shadow-md active:scale-95 transition-all">
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