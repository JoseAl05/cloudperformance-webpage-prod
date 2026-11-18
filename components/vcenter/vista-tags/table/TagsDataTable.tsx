'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { mutate } from 'swr';
import {
    CheckSquare,
    CircleDollarSign,
    Cpu,
    HardDrive,
    Laptop,
    Loader2,
    PencilLine,
    Plus,
    Server,
    Tag,
    X,
} from 'lucide-react';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FetchError, fetchJson } from '@/lib/fetcher';
import type {
    VCenterServiceGroup,
    VCenterTagValue,
} from '@/components/vcenter/vista-tags/TaggedResourcesComponent';

const API_BASE = '/api/vcenter/bridge/mantenedor-tags/vcenter';
const RESOURCE_QUERY_PREFIX = `${API_BASE}/get_resource_tags`;

interface CostCenter {
    id: number;
    nombre: string;
    responsable?: string;
}

interface CostCenterResponse {
    status?: string;
    data?: CostCenter[];
}

interface FlattenedResource {
    service: string;
    resourceId: string;
    resourceName: string;
    search: string;
    instanceUuid?: string | null;
    guestHostname?: string | null;
    powerState?: string | null;
    guestOs?: string | null;
    numCpu?: number | null;
    memoryMb?: number | null;
    tags: Record<string, VCenterTagValue>;
    costCenterIds: number[];
}

interface TagsDataTableProps {
    data: VCenterServiceGroup[];
}

const errorMessage = (error: unknown, fallback: string): string => {
    if (error instanceof FetchError) {
        if (typeof error.detail === 'string' && error.detail) return error.detail;
        return error.message;
    }
    if (error instanceof Error && error.message) return error.message;
    return fallback;
};

const normalizedTags = (
    tags: Record<string, VCenterTagValue> | 'SIN TAGS' | null | undefined
): Record<string, VCenterTagValue> => (
    tags && tags !== 'SIN TAGS' ? tags : {}
);

const memoryInGb = (memoryMb?: number | null): string => {
    if (memoryMb == null || !Number.isFinite(memoryMb)) return '—';
    return `${(memoryMb / 1024).toLocaleString('es-CL', { maximumFractionDigits: 1 })} GB`;
};

export const TagsDataTableVCenter = ({ data }: TagsDataTableProps) => {
    const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

    const [selectedResource, setSelectedResource] = useState<FlattenedResource | null>(null);
    const [tagKey, setTagKey] = useState('');
    const [tagValue, setTagValue] = useState('');
    const [isEditingTag, setIsEditingTag] = useState(false);
    const [isProcessingTag, setIsProcessingTag] = useState(false);
    const [tagError, setTagError] = useState('');

    const [isCostCenterModalOpen, setIsCostCenterModalOpen] = useState(false);
    const [costCenterTargetIds, setCostCenterTargetIds] = useState<string[]>([]);
    const [selectedCostCenterIds, setSelectedCostCenterIds] = useState<number[]>([]);
    const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
    const [isLoadingCostCenters, setIsLoadingCostCenters] = useState(false);
    const [isAssigningCostCenters, setIsAssigningCostCenters] = useState(false);
    const [costCenterError, setCostCenterError] = useState('');

    const flattenedData = useMemo<FlattenedResource[]>(() => data.flatMap((group) => (
        (group.resources ?? []).map((resource) => ({
            service: group.service,
            resourceId: resource.resource_id,
            resourceName: resource.resource_name || resource.resource_id,
            search: [resource.resource_name, resource.resource_id, resource.guest_hostname]
                .filter(Boolean)
                .join(' '),
            instanceUuid: resource.instance_uuid,
            guestHostname: resource.guest_hostname,
            powerState: resource.power_state,
            guestOs: resource.guest_os,
            numCpu: resource.num_cpu,
            memoryMb: resource.memory_mb,
            tags: normalizedTags(resource.tags),
            costCenterIds: [...new Set(resource.cost_center_ids ?? [])].sort((a, b) => a - b),
        }))
    )), [data]);

    useEffect(() => {
        if (!isCostCenterModalOpen || costCenters.length > 0) return;

        let active = true;
        setIsLoadingCostCenters(true);
        setCostCenterError('');

        fetchJson<CostCenterResponse>(`${API_BASE}/local/cost-centers`)
            .then((response) => {
                if (!active) return;
                if (response.status !== 'success' || !Array.isArray(response.data)) {
                    throw new Error('La API no entregó una lista válida de centros de costo.');
                }
                setCostCenters(response.data);
            })
            .catch((error: unknown) => {
                if (active) {
                    setCostCenterError(errorMessage(error, 'No fue posible cargar los centros de costo.'));
                }
            })
            .finally(() => {
                if (active) setIsLoadingCostCenters(false);
            });

        return () => {
            active = false;
        };
    }, [costCenters.length, isCostCenterModalOpen]);

    const revalidateResources = async () => {
        await mutate(
            (key) => typeof key === 'string' && key.startsWith(RESOURCE_QUERY_PREFIX)
        );
    };

    const closeTagModal = () => {
        if (isProcessingTag) return;
        setSelectedResource(null);
        setTagKey('');
        setTagValue('');
        setIsEditingTag(false);
        setTagError('');
    };

    const openNewTagModal = (resource: FlattenedResource) => {
        setSelectedResource(resource);
        setTagKey('');
        setTagValue('');
        setIsEditingTag(false);
        setTagError('');
    };

    const openEditTagModal = (resource: FlattenedResource, key: string, value: string) => {
        setSelectedResource(resource);
        setTagKey(key);
        setTagValue(value);
        setIsEditingTag(true);
        setTagError('');
    };

    const saveTag = async () => {
        const key = tagKey.trim();
        const value = tagValue.trim();
        if (!selectedResource || !key || !value) {
            setTagError('La clave y el valor son obligatorios.');
            return;
        }
        if (key.toLocaleLowerCase() === 'centro_costo') {
            setTagError('Los centros de costo deben administrarse desde la opción Asignar CC.');
            return;
        }

        setIsProcessingTag(true);
        setTagError('');
        try {
            await fetchJson(`${API_BASE}/local/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resource_id: selectedResource.resourceId,
                    tags: { [key]: value },
                }),
            });
            await revalidateResources();
            setSelectedResource(null);
            setTagKey('');
            setTagValue('');
            setIsEditingTag(false);
        } catch (error) {
            setTagError(errorMessage(error, 'No fue posible guardar la etiqueta local.'));
        } finally {
            setIsProcessingTag(false);
        }
    };

    const deleteTag = async (resourceId: string, key: string) => {
        const isCostCenter = key.toLocaleLowerCase() === 'centro_costo';
        const warning = isCostCenter
            ? 'Esta acción quitará todos los centros de costo asociados al recurso. ¿Deseas continuar?'
            : `¿Deseas eliminar la etiqueta local "${key}"?`;
        if (!window.confirm(warning)) return;

        setIsProcessingTag(true);
        try {
            await fetchJson(`${API_BASE}/local/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resource_id: resourceId, tag_key: key }),
            });
            await revalidateResources();
        } catch (error) {
            window.alert(errorMessage(error, 'No fue posible eliminar la etiqueta local.'));
        } finally {
            setIsProcessingTag(false);
        }
    };

    const openCostCenterModal = (resourceIds: string[]) => {
        const uniqueIds = [...new Set(resourceIds)];
        const targets = flattenedData.filter((resource) => uniqueIds.includes(resource.resourceId));
        const initialSelection = targets.length === 1 ? targets[0].costCenterIds : [];

        setCostCenterTargetIds(uniqueIds);
        setSelectedCostCenterIds(initialSelection);
        setCostCenterError('');
        setIsCostCenterModalOpen(true);
    };

    const closeCostCenterModal = () => {
        if (isAssigningCostCenters) return;
        setIsCostCenterModalOpen(false);
        setCostCenterTargetIds([]);
        setSelectedCostCenterIds([]);
        setCostCenterError('');
    };

    const toggleCostCenter = (id: number) => {
        setSelectedCostCenterIds((current) => (
            current.includes(id)
                ? current.filter((costCenterId) => costCenterId !== id)
                : [...current, id]
        ));
    };

    const saveCostCenters = async () => {
        if (costCenterTargetIds.length === 0) return;
        if (
            selectedCostCenterIds.length === 0
            && !window.confirm('No seleccionaste centros de costo. Esto quitará las asociaciones actuales. ¿Deseas continuar?')
        ) return;

        setIsAssigningCostCenters(true);
        setCostCenterError('');
        try {
            await fetchJson(`${API_BASE}/local/assign-bulk-cc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cost_center_ids: selectedCostCenterIds,
                    resources: costCenterTargetIds.map((resourceId) => ({ resource_id: resourceId })),
                }),
            });
            await revalidateResources();
            setIsCostCenterModalOpen(false);
            setCostCenterTargetIds([]);
            setSelectedCostCenterIds([]);
            setSelectedRowIds([]);
        } catch (error) {
            setCostCenterError(errorMessage(error, 'No fue posible asociar los centros de costo.'));
        } finally {
            setIsAssigningCostCenters(false);
        }
    };

    const columns: ColumnDef<FlattenedResource>[] = [
        {
            id: 'select',
            header: () => (
                <input
                    type='checkbox'
                    aria-label='Seleccionar todos los recursos'
                    className='h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-600'
                    checked={flattenedData.length > 0 && selectedRowIds.length === flattenedData.length}
                    onChange={(event) => setSelectedRowIds(
                        event.target.checked ? flattenedData.map((resource) => resource.resourceId) : []
                    )}
                />
            ),
            cell: ({ row }) => (
                <input
                    type='checkbox'
                    aria-label={`Seleccionar recurso ${row.original.resourceName}`}
                    className='h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-600'
                    checked={selectedRowIds.includes(row.original.resourceId)}
                    onChange={(event) => setSelectedRowIds((current) => (
                        event.target.checked
                            ? [...new Set([...current, row.original.resourceId])]
                            : current.filter((id) => id !== row.original.resourceId)
                    ))}
                />
            ),
        },
        {
            accessorKey: 'service',
            header: 'Tipo de recurso',
            cell: ({ row }) => (
                <span className='text-xs font-medium text-gray-700'>{row.original.service}</span>
            ),
        },
        {
            accessorKey: 'search',
            header: 'Máquina virtual',
            cell: ({ row }) => (
                <div className='flex min-w-[190px] flex-col'>
                    <span className='text-xs font-semibold text-gray-800'>{row.original.resourceName}</span>
                    <span className='font-mono text-[10px] text-gray-400'>{row.original.resourceId}</span>
                </div>
            ),
        },
        {
            accessorKey: 'guestHostname',
            header: 'Host / UUID',
            cell: ({ row }) => (
                <div className='flex min-w-[170px] flex-col'>
                    <span className='text-xs text-gray-700'>{row.original.guestHostname || 'Sin hostname'}</span>
                    <span className='max-w-[190px] truncate font-mono text-[9px] text-gray-400'>
                        {row.original.instanceUuid || 'Sin UUID'}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'powerState',
            header: 'Estado',
            cell: ({ row }) => {
                const isOn = row.original.powerState === 'poweredOn';
                return (
                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                        isOn ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                        {row.original.powerState || 'Desconocido'}
                    </span>
                );
            },
        },
        {
            id: 'capacity',
            header: 'Capacidad',
            cell: ({ row }) => (
                <div className='flex min-w-[105px] flex-col gap-1 text-[10px] text-gray-600'>
                    <span className='flex items-center gap-1'>
                        <Cpu className='h-3 w-3 text-blue-500' /> {row.original.numCpu ?? '—'} vCPU
                    </span>
                    <span className='flex items-center gap-1'>
                        <HardDrive className='h-3 w-3 text-blue-500' /> {memoryInGb(row.original.memoryMb)}
                    </span>
                </div>
            ),
        },
        {
            id: 'tags',
            header: 'Etiquetas locales',
            cell: ({ row }) => {
                const entries = Object.entries(row.original.tags);
                if (entries.length === 0) {
                    return <span className='text-xs italic text-gray-400'>Sin tags</span>;
                }

                return (
                    <div className='flex max-w-[470px] flex-wrap gap-1.5'>
                        {entries.map(([key, rawValue]) => {
                            const isCostCenter = key.toLocaleLowerCase() === 'centro_costo';
                            const displayValue = Array.isArray(rawValue) ? rawValue.join(', ') : rawValue;
                            return (
                                <div
                                    key={key}
                                    className={`inline-flex overflow-hidden rounded border text-[10px] shadow-sm ${
                                        isCostCenter ? 'border-green-200' : 'border-purple-200'
                                    }`}
                                >
                                    <span className={`flex items-center gap-1 border-r px-1.5 py-0.5 font-medium ${
                                        isCostCenter
                                            ? 'border-green-200 bg-green-50 text-green-700'
                                            : 'border-purple-200 bg-purple-50 text-purple-700'
                                    }`}>
                                        {isCostCenter
                                            ? <CircleDollarSign className='h-3 w-3' />
                                            : <Laptop className='h-3 w-3' />}
                                        {key}
                                    </span>
                                    <span className='flex items-center gap-2 bg-white px-1.5 py-0.5 text-gray-600'>
                                        <span className='max-w-[180px] truncate' title={displayValue}>{displayValue}</span>
                                        <span className='ml-1 flex items-center gap-1 border-l border-gray-100 pl-1.5'>
                                            <button
                                                type='button'
                                                title={isCostCenter ? 'Modificar centros de costo' : 'Editar tag local'}
                                                className='text-indigo-500 transition-colors hover:text-indigo-700'
                                                onClick={() => {
                                                    if (isCostCenter) {
                                                        openCostCenterModal([row.original.resourceId]);
                                                    } else {
                                                        openEditTagModal(row.original, key, displayValue);
                                                    }
                                                }}
                                            >
                                                <PencilLine className='h-3 w-3' />
                                            </button>
                                            <button
                                                type='button'
                                                title='Eliminar'
                                                className='text-gray-400 transition-colors hover:text-red-600'
                                                disabled={isProcessingTag}
                                                onClick={() => deleteTag(row.original.resourceId, key)}
                                            >
                                                <X className='h-3.5 w-3.5' />
                                            </button>
                                        </span>
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => (
                <div className='flex min-w-[220px] items-center gap-2'>
                    <button
                        type='button'
                        className='inline-flex items-center gap-1 rounded-md border border-green-600/30 bg-green-50 px-2.5 py-1.5 text-[11px] font-bold text-green-700 shadow-sm transition-colors hover:bg-green-100'
                        onClick={() => openCostCenterModal([row.original.resourceId])}
                    >
                        <CircleDollarSign className='h-3.5 w-3.5' /> Asignar CC
                    </button>
                    <button
                        type='button'
                        className='inline-flex items-center gap-1 rounded-md border border-blue-600/30 bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-700 shadow-sm transition-colors hover:bg-blue-100'
                        onClick={() => openNewTagModal(row.original)}
                    >
                        <Plus className='h-3.5 w-3.5' /> Tag local
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className='relative w-full'>
            <Card className='border-gray-200 shadow-sm'>
                <CardHeader className='flex flex-row items-center justify-between border-b bg-gray-50/50'>
                    <div>
                        <CardTitle className='flex items-center gap-2 text-lg font-bold text-gray-800'>
                            <Server className='h-5 w-5 text-blue-600' /> Inventario y Etiquetas vCenter
                        </CardTitle>
                        <p className='mt-1 text-xs text-muted-foreground'>
                            Gestión local de etiquetas y centros de costo para máquinas virtuales.
                        </p>
                    </div>
                    <div className='hidden gap-3 rounded-lg border bg-white p-2 text-[10px] font-bold uppercase tracking-widest shadow-sm sm:flex'>
                        <span className='flex items-center gap-1 text-purple-600'>
                            <Laptop className='h-3 w-3' /> Local
                        </span>
                        <span className='flex items-center gap-1 text-green-600'>
                            <CircleDollarSign className='h-3 w-3' /> Finanzas
                        </span>
                    </div>
                </CardHeader>
                <CardContent className='pb-16 pt-6'>
                    <DataTableGrouping
                        columns={columns}
                        data={flattenedData}
                        filterColumn='search'
                        filterPlaceholder='Buscar por nombre, MoRef o hostname...'
                        enableGrouping
                        groupByColumn='service'
                        pageSizeItems={10}
                    />
                </CardContent>
            </Card>

            {selectedRowIds.length > 0 && (
                <div className='fixed bottom-10 left-1/2 z-40 flex -translate-x-1/2 items-center gap-5 rounded-full border border-gray-200 bg-white px-6 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.15)]'>
                    <span className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                        <span className='rounded-full bg-blue-50 px-2.5 py-0.5 font-bold text-blue-700'>
                            {selectedRowIds.length}
                        </span>
                        recursos seleccionados
                    </span>
                    <Button
                        size='sm'
                        className='rounded-full bg-green-600 hover:bg-green-700'
                        onClick={() => openCostCenterModal(selectedRowIds)}
                    >
                        <CheckSquare className='mr-2 h-4 w-4' /> Asignación masiva
                    </Button>
                    <button
                        type='button'
                        className='text-sm font-medium text-gray-400 hover:text-gray-600'
                        onClick={() => setSelectedRowIds([])}
                    >
                        Cancelar
                    </button>
                </div>
            )}

            {selectedResource && (
                <div
                    className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm'
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeTagModal();
                    }}
                >
                    <div className='w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl'>
                        <div className='flex items-center justify-between border-b bg-gray-50 p-4'>
                            <h3 className='flex items-center gap-2 font-bold text-gray-800'>
                                <Tag className='h-4 w-4 text-blue-600' />
                                {isEditingTag ? 'Editar Tag Local' : 'Nuevo Tag Local'}
                            </h3>
                            <button type='button' onClick={closeTagModal} disabled={isProcessingTag}>
                                <X className='h-5 w-5 text-gray-400 hover:text-gray-700' />
                            </button>
                        </div>
                        <div className='space-y-4 p-5'>
                            <div className='break-all rounded border bg-gray-50 p-2.5 font-mono text-[10px] text-gray-500'>
                                <span className='mr-2 font-bold text-blue-600'>RECURSO:</span>
                                {selectedResource.resourceName} ({selectedResource.resourceId})
                            </div>
                            <div className='space-y-1.5'>
                                <label className='text-sm font-medium text-gray-700' htmlFor='vcenter-tag-key'>Clave</label>
                                <Input
                                    id='vcenter-tag-key'
                                    value={tagKey}
                                    onChange={(event) => setTagKey(event.target.value)}
                                    disabled={isEditingTag || isProcessingTag}
                                    maxLength={128}
                                    placeholder='Ej: ambiente'
                                />
                            </div>
                            <div className='space-y-1.5'>
                                <label className='text-sm font-medium text-gray-700' htmlFor='vcenter-tag-value'>Valor</label>
                                <Input
                                    id='vcenter-tag-value'
                                    value={tagValue}
                                    onChange={(event) => setTagValue(event.target.value)}
                                    disabled={isProcessingTag}
                                    maxLength={512}
                                    placeholder='Ej: producción'
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') saveTag();
                                    }}
                                />
                            </div>
                            {tagError && <p className='text-sm text-red-600'>{tagError}</p>}
                        </div>
                        <div className='flex justify-end gap-2 border-t bg-gray-50 p-4'>
                            <Button variant='outline' onClick={closeTagModal} disabled={isProcessingTag}>Cancelar</Button>
                            <Button onClick={saveTag} disabled={isProcessingTag || !tagKey.trim() || !tagValue.trim()}>
                                {isProcessingTag && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                                Guardar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {isCostCenterModalOpen && (
                <div
                    className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm'
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeCostCenterModal();
                    }}
                >
                    <div className='w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl'>
                        <div className='flex items-center justify-between border-b bg-gray-50 p-4'>
                            <h3 className='flex items-center gap-2 font-bold text-gray-800'>
                                <CircleDollarSign className='h-5 w-5 text-green-600' />
                                Asociar Centros de Costo
                            </h3>
                            <button type='button' onClick={closeCostCenterModal} disabled={isAssigningCostCenters}>
                                <X className='h-5 w-5 text-gray-400 hover:text-gray-700' />
                            </button>
                        </div>
                        <div className='space-y-4 p-5'>
                            <div className='rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800'>
                                La selección reemplazará la asociación actual de {costCenterTargetIds.length}{' '}
                                {costCenterTargetIds.length === 1 ? 'recurso' : 'recursos'}.
                            </div>

                            {isLoadingCostCenters ? (
                                <div className='flex items-center justify-center gap-2 py-10 text-sm text-gray-500'>
                                    <Loader2 className='h-5 w-5 animate-spin' /> Cargando centros de costo...
                                </div>
                            ) : costCenters.length > 0 ? (
                                <div className='max-h-72 space-y-2 overflow-y-auto pr-1'>
                                    {costCenters.map((costCenter) => (
                                        <label
                                            key={costCenter.id}
                                            className='flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-50'
                                        >
                                            <input
                                                type='checkbox'
                                                className='mt-0.5 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600'
                                                checked={selectedCostCenterIds.includes(costCenter.id)}
                                                onChange={() => toggleCostCenter(costCenter.id)}
                                                disabled={isAssigningCostCenters}
                                            />
                                            <span className='min-w-0 flex-1'>
                                                <span className='block text-sm font-semibold text-gray-800'>{costCenter.nombre}</span>
                                                <span className='block text-xs text-gray-500'>
                                                    ID {costCenter.id}
                                                    {costCenter.responsable ? ` · ${costCenter.responsable}` : ''}
                                                </span>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            ) : !costCenterError ? (
                                <p className='py-6 text-center text-sm text-gray-500'>
                                    No hay centros de costo vCenter disponibles.
                                </p>
                            ) : null}

                            {costCenterError && <p className='text-sm text-red-600'>{costCenterError}</p>}
                        </div>
                        <div className='flex items-center justify-between border-t bg-gray-50 p-4'>
                            <span className='text-xs text-gray-500'>
                                {selectedCostCenterIds.length} seleccionados
                            </span>
                            <div className='flex gap-2'>
                                <Button variant='outline' onClick={closeCostCenterModal} disabled={isAssigningCostCenters}>
                                    Cancelar
                                </Button>
                                <Button
                                    className='bg-green-600 hover:bg-green-700'
                                    onClick={saveCostCenters}
                                    disabled={isAssigningCostCenters || isLoadingCostCenters || costCenterTargetIds.length === 0}
                                >
                                    {isAssigningCostCenters && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                                    Guardar asociación
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
