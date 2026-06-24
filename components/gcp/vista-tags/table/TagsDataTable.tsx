'use client'

import { useMemo, useState, useEffect } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag, Plus, Info, Server, Cloud, Laptop, X, Loader2, PencilLine, DollarSign, CheckSquare, AlertTriangle } from 'lucide-react';
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
    tags_raw: Record<string, string | string[]> | null; 
    local_keys: string[];
    status: string;
}

interface CostCenter {
    id: number;
    nombre: string;
    responsable: string;
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

    const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]); 
    const [isCCModalOpen, setIsCCModalOpen] = useState(false);
    const [ccTargetIds, setCcTargetIds] = useState<string[]>([]); 
    const [selectedCCs, setSelectedCCs] = useState<number[]>([]); 
    const [isAssigningCC, setIsAssigningCC] = useState(false);
    
    const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
    const [isLoadingCCs, setIsLoadingCCs] = useState(false);

    const flattenedData = useMemo(() => {
        const flat: FlattenedResource[] = [];
        data.forEach(grupo => {
            const resources = grupo.resources || [];
            resources.forEach(res => {
                const hasTags = res.tags !== "SIN TAGS" && res.tags !== null;
                
                flat.push({
                    service: grupo.service,
                    sub_service: res.sub_service || "n/a",
                    id_resource: res.id_resource || "n/a",
                    resourceId: res.resource,
                    project_id: res.project_id || "n/a",
                    project_name: res.project_name || "Sin Nombre",
                    region: res.region || "global",
                    hasTags: hasTags,
                    tags_raw: hasTags ? (res.tags as Record<string, string | string[]>) : null,
                    local_keys: res.local_keys || [],
                    status: hasTags ? 'TAGEADO' : 'HUÉRFANO'
                });
            });
        });
        return flat;
    }, [data]);

    useEffect(() => {
        let isMounted = true;

        if (isCCModalOpen && costCenters.length === 0) {
            setIsLoadingCCs(true);
            fetch('/api/gcp/bridge/mantenedor-tags/gcp/local/cost-centers')
                .then(res => res.json())
                .then(responseData => {
                    if (isMounted && responseData.status === 'success' && responseData.data) {
                        setCostCenters(responseData.data);
                    }
                })
                .catch(err => console.error("Error al obtener centros de costo GCP:", err))
                .finally(() => {
                    if (isMounted) setIsLoadingCCs(false);
                });
        }

        return () => {
            isMounted = false;
        };
    }, [isCCModalOpen, costCenters.length]);

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
            mutate((key) => typeof key === 'string' && key.includes('/api/gcp/bridge/mantenedor-tags/gcp/get_resource_tags'));
        } catch (error) {
            alert("No se pudo eliminar el tag local");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSaveTag = async () => {
        if (!selectedResource || !tagKey || !tagValue) return;
        
        if (tagKey.trim().toLowerCase() === 'centro_costo') {
            alert("Para asignar o modificar un centro de costo, por favor utilice el botón verde '$ Asignar CC'.");
            return;
        }

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
            if (!response.ok) throw new Error('Error al guardar');
            setSelectedResource(null); setTagKey(''); setTagValue('');
            mutate((key) => typeof key === 'string' && key.includes('/api/gcp/bridge/mantenedor-tags/gcp/get_resource_tags'));
        } catch (error) {
            alert("Error al procesar la solicitud local.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSaveCostCenter = async () => {
        if (selectedCCs.length === 0 || ccTargetIds.length === 0) return;
        setIsAssigningCC(true);
        
        const targetCCs = costCenters.filter(cc => selectedCCs.includes(cc.id));
        const costCenterNames = targetCCs.map(cc => cc.nombre); 

        const targetResources = flattenedData.filter(r => ccTargetIds.includes(r.resourceId));

        const payload = {
            cost_center_ids: selectedCCs,
            cost_center_names: costCenterNames,
            resources: targetResources.map(r => ({
                resource_id: r.resourceId,
                id: r.id_resource,
                service: r.service,
                sub_service: r.sub_service || "n/a",
                project_id: r.project_id,
                project_name: r.project_name,
                region: r.region || "global"
            }))
        };

        try {
            const response = await fetch('/api/gcp/bridge/mantenedor-tags/gcp/local/assign-bulk-cc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Error en el servidor');
            }

            setIsCCModalOpen(false);
            setSelectedCCs([]); 
            setCcTargetIds([]);
            setSelectedRowIds([]); 
            
            mutate((key) => typeof key === 'string' && key.includes('/api/gcp/bridge/mantenedor-tags/gcp/get_resource_tags'));
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            alert(`Error al vincular el presupuesto: ${errorMessage}`);
        } finally {
            setIsAssigningCC(false);
        }
    };

    const handleEditClick = (resource: FlattenedResource, key: string, value: string) => {
        setSelectedResource(resource); setTagKey(key); setTagValue(value);
    };

    const toggleCCSelection = (id: number) => {
        setSelectedCCs(prev => 
            prev.includes(id) ? prev.filter(ccId => ccId !== id) : [...prev, id]
        );
    };

    const columns = useMemo<ColumnDef<typeof flattenedData[0]>[]>(() => [
        {
            id: "select",
            header: () => (
                <div className="px-2">
                    <input
                        type="checkbox"
                        aria-label="Seleccionar todos los recursos"
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 w-4 h-4 cursor-pointer"
                        onChange={(e) => {
                            if (e.target.checked) setSelectedRowIds(flattenedData.map(r => r.resourceId));
                            else setSelectedRowIds([]);
                        }}
                        checked={selectedRowIds.length > 0 && selectedRowIds.length === flattenedData.length}
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="px-2">
                    <input
                        type="checkbox"
                        aria-label={`Seleccionar recurso ${row.original.resourceId}`}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 w-4 h-4 cursor-pointer"
                        checked={selectedRowIds.includes(row.original.resourceId)}
                        onChange={(e) => {
                            const id = row.original.resourceId;
                            setSelectedRowIds(prev =>
                                e.target.checked ? [...prev, id] : prev.filter(x => x !== id)
                            );
                        }}
                    />
                </div>
            )
        },
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
                        {Object.entries(tags).flatMap(([k, v]) => {
                            const isLocal = localKeys.includes(k);
                            const isCC = k === 'centro_costo';
                            
                            const values = Array.isArray(v) ? v : [v];
                            
                            return values.map((val, idx) => (
                                <div key={`${k}-${idx}`} className={`inline-flex items-center rounded border text-[10px] shadow-sm overflow-hidden ${isLocal ? (isCC ? 'border-green-200' : 'border-purple-200') : 'border-blue-200'}`}>
                                    <span className={`px-1.5 py-0.5 font-medium border-r flex items-center gap-1 ${isLocal ? (isCC ? 'bg-green-50 text-green-700 border-green-200' : 'bg-purple-50 text-purple-700 border-purple-200') : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                        {isLocal ? (isCC ? <DollarSign className="h-3 w-3" /> : <Laptop className="h-3 w-3" />) : <Cloud className="h-3 w-3" />}
                                        {k}
                                    </span>
                                    <span className="bg-white text-gray-600 px-1.5 py-0.5 flex items-center gap-2">
                                        {val}
                                        {isLocal && (
                                            <div className="flex items-center gap-1.5 ml-1 border-l pl-1.5 border-gray-100">
                                                <button 
                                                    onClick={() => {
                                                        if (isCC) {
                                                            setCcTargetIds([row.original.resourceId]);
                                                            setIsCCModalOpen(true);
                                                        } else {
                                                            handleEditClick(row.original, k, val);
                                                        }
                                                    }} 
                                                    className="text-indigo-500 hover:text-indigo-700 transition-colors"
                                                    title={isCC ? 'Modificar Presupuestos Asignados' : 'Editar Tag Local'}
                                                >
                                                    <PencilLine className="h-3 w-3" />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        if (isCC && values.length > 1) {
                                                            alert("Atención: Esto eliminará TODOS los centros de costo asignados a este recurso. Si deseas quitar solo uno, usa el botón de editar (lápiz) y desmárcalo en la lista.");
                                                        }
                                                        handleDeleteTag(row.original.resourceId, k);
                                                    }} 
                                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        )}
                                    </span>
                                </div>
                            ));
                        })}
                    </div>
                );
            }
        },
        {
            id: "acciones",
            header: "Acción",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            setCcTargetIds([row.original.resourceId]);
                            setIsCCModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold rounded-md border border-green-600/30 bg-green-50 text-green-700 hover:bg-green-100 transition-all shadow-sm"
                    >
                        <DollarSign className="h-3.5 w-3.5" /> Asignar CC
                    </button>
                    <button
                        onClick={() => setSelectedResource(row.original)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all shadow-sm"
                    >
                        <Plus className="h-3 w-3" /> Tag Local
                    </button>
                </div>
            )
        }
    ], [flattenedData, selectedRowIds]);

    return (
        <div className="relative">
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
                        <span className="flex items-center gap-1 text-green-600"><DollarSign className="h-3 w-3" /> Finanzas</span>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 pb-16">
                    <DataTableGrouping columns={columns} data={flattenedData} filterColumn="resourceId" filterPlaceholder="Buscar por ID de recurso..." enableGrouping={true} groupByColumn="service" pageSizeItems={10} />
                </CardContent>
            </Card>

            {selectedRowIds.length > 0 && (
                <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-40 bg-white border border-gray-200 px-6 py-3 rounded-full flex items-center gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.15)] animate-in slide-in-from-bottom-8 duration-300">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <span className="bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold">
                            {selectedRowIds.length}
                        </span>
                        recursos seleccionados
                    </span>
                    <button
                        onClick={() => {
                            setCcTargetIds(selectedRowIds);
                            setIsCCModalOpen(true);
                        }}
                        className="bg-green-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-green-700 flex items-center gap-2 shadow-md transition-all active:scale-95"
                    >
                        <CheckSquare className="h-4 w-4" /> Asignación Masiva
                    </button>
                    <button onClick={() => setSelectedRowIds([])} className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors">
                        Cancelar
                    </button>
                </div>
            )}

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
                                    <input type="text" placeholder="ej. owner" value={tagKey} onChange={e => setTagKey(e.target.value)} className="w-full border border-gray-200 p-2.5 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-gray-800 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Valor (Value)</label>
                                    <input type="text" placeholder="ej. cloudperformance" value={tagValue} onChange={e => setTagValue(e.target.value)} className="w-full border border-gray-200 p-2.5 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-gray-800 transition-all" />
                                </div>
                            </div>
                            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex gap-2">
                                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-amber-700 leading-relaxed">
                                    Nota: Si la llave ya existe, el valor se actualizará. Los cambios son locales y no afectan la consola de GCP.
                                </p>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                            <button onClick={() => { setSelectedResource(null); setTagKey(''); setTagValue(''); }} className="px-4 py-2 text-xs font-bold border border-gray-300 rounded-md hover:bg-white text-gray-600 transition-all active:scale-95">
                                Cancelar
                            </button>
                            <button onClick={handleSaveTag} disabled={isProcessing || !tagKey || !tagValue} className="px-5 py-2 text-xs font-bold bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 shadow-md shadow-indigo-200 active:scale-95 transition-all">
                                {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Tag className="h-3.5 w-3.5" />}
                                {isProcessing ? 'Procesando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isCCModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-4 border-b bg-green-50 flex justify-between items-center border-green-100">
                            <h3 className="font-bold text-green-800 flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-green-600" /> 
                                Vincular Presupuesto(s) GCP
                            </h3>
                            <button onClick={() => { setIsCCModalOpen(false); setCcTargetIds([]); setSelectedCCs([]); }} className="text-green-600/50 hover:text-green-800 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="p-5 space-y-4">
                            <p className="text-sm text-gray-600">
                                Asignando a <strong className="text-gray-900">{ccTargetIds.length} recurso(s) de GCP</strong>.
                            </p>
                            
                            {isLoadingCCs ? (
                                <div className="flex items-center gap-2 p-3 text-sm text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                                    <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                                    Cargando catálogo de presupuestos...
                                </div>
                            ) : 

                            costCenters.length === 0 ? (
                                <div className="bg-amber-50 p-5 rounded-lg border border-amber-200 flex flex-col items-center text-center gap-3">
                                    <AlertTriangle className="h-8 w-8 text-amber-500" />
                                    <div>
                                        <h4 className="font-bold text-amber-800 text-sm mb-1">No tienes centros de costo creados</h4>
                                        <p className="text-xs text-amber-700 leading-relaxed">
                                            Para poder asociar un centro de costo debes crearlo desde el <strong>módulo de presupuesto</strong>.
                                        </p>
                                    </div>
                                </div>
                            ) : 

                            (
                                <>
                                    <p className="text-xs text-gray-500 mb-1">Selecciona los centros de costo que financiarán este recurso:</p>
                                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-inner max-h-48 overflow-y-auto">
                                        {costCenters.map(cc => (
                                            <label key={cc.id} className="flex items-center gap-3 p-3 hover:bg-green-50/50 border-b border-gray-100 last:border-0 cursor-pointer transition-colors">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedCCs.includes(cc.id)}
                                                    onChange={() => toggleCCSelection(cc.id)}
                                                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-800">{cc.nombre}</span>
                                                    <span className="text-[10px] text-gray-500">ID: {cc.id} • Resp: {cc.responsable}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex gap-2">
                                        <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                                        <p className="text-[10px] text-blue-800 leading-relaxed">
                                            Esta asignación actualizará el reporte financiero en base a los IDs contables.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="p-4 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                            {costCenters.length > 0 ? (
                                <span className="text-xs font-medium text-gray-500">
                                    {selectedCCs.length} seleccionado(s)
                                </span>
                            ) : <span></span>}
                            
                            <div className="flex gap-3">
                                <button onClick={() => { setIsCCModalOpen(false); setCcTargetIds([]); setSelectedCCs([]); }} className="px-4 py-2 text-xs font-bold border border-gray-300 rounded-md hover:bg-white text-gray-600 transition-all active:scale-95">
                                    {costCenters.length === 0 ? 'Entendido' : 'Cancelar'}
                                </button>
                                
                                {costCenters.length > 0 && (
                                    <button 
                                        onClick={handleSaveCostCenter} 
                                        disabled={isAssigningCC || selectedCCs.length === 0 || isLoadingCCs} 
                                        className="px-5 py-2 text-xs font-bold bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 shadow-md active:scale-95 transition-all"
                                    >
                                        {isAssigningCC ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <DollarSign className="h-3.5 w-3.5" />}
                                        {isAssigningCC ? 'Guardando...' : 'Aplicar'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};