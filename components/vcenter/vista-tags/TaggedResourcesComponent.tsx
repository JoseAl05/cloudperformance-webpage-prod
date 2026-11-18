'use client';

import useSWR from 'swr';
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    CircleDollarSign,
    Info,
    LayoutGrid,
    ServerOff,
    Tags,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent';
import { MessageCard } from '@/components/aws/cards/MessageCards';
import { fetcher } from '@/lib/fetcher';
import { toApiDate } from '@/lib/consumption';
import { TagsDataTableVCenter } from './table/TagsDataTable';

export type VCenterTagValue = string | string[];

export interface VCenterResourceItem {
    resource_id: string;
    resource_name: string;
    instance_uuid?: string | null;
    bios_uuid?: string | null;
    guest_hostname?: string | null;
    power_state?: string | null;
    guest_os?: string | null;
    num_cpu?: number | null;
    memory_mb?: number | null;
    host_moref?: string | null;
    resource_pool_moref?: string | null;
    sync_time?: string | null;
    tags?: Record<string, VCenterTagValue> | 'SIN TAGS' | null;
    cost_center_ids?: number[];
}

export interface VCenterServiceGroup {
    service: string;
    resources: VCenterResourceItem[];
}

interface ApiResponseWrapper {
    data?: VCenterServiceGroup[];
    items?: VCenterServiceGroup[];
    results?: VCenterServiceGroup[];
    detail?: unknown;
    message?: unknown;
}

interface TagsAnalysisProps {
    startDate?: Date;
    endDate?: Date;
}

const responseMessage = (response: ApiResponseWrapper): string => {
    const value = response.detail ?? response.message;
    if (typeof value === 'string') return value;
    if (value == null) return '';
    try {
        return JSON.stringify(value);
    } catch {
        return 'La API respondió con un formato no esperado.';
    }
};

export const TagsAnalysisComponentVCenter = ({ startDate, endDate }: TagsAnalysisProps) => {
    const endpointUrl = startDate && endDate
        ? `/api/vcenter/bridge/mantenedor-tags/vcenter/get_resource_tags?${new URLSearchParams({
            date_from: toApiDate(startDate),
            date_to: toApiDate(endDate),
        }).toString()}`
        : null;

    const { data, isLoading, error } = useSWR<unknown>(endpointUrl, fetcher, {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
    });

    if (!startDate || !endDate) {
        return (
            <MessageCard
                icon={Info}
                title='Selecciona un período'
                description='Define las fechas de inicio y término para consultar el inventario de vCenter.'
                tone='info'
            />
        );
    }

    if (isLoading) return <LoaderComponent size='large' />;

    if (error || !data) {
        return (
            <div className='w-full min-w-0 px-4 py-10'>
                <MessageCard
                    icon={AlertCircle}
                    title='Error al cargar inventario'
                    description='No fue posible consultar las máquinas virtuales y sus etiquetas locales.'
                    tone='error'
                />
            </div>
        );
    }

    let groups: VCenterServiceGroup[] = [];
    let apiMessage = '';

    if (Array.isArray(data)) {
        groups = data as VCenterServiceGroup[];
    } else if (typeof data === 'object') {
        const response = data as ApiResponseWrapper;
        groups = response.data ?? response.items ?? response.results ?? [];
        apiMessage = responseMessage(response);
    }

    if (groups.length === 0) {
        return (
            <div className='w-full min-w-0 px-4 py-6'>
                <MessageCard
                    icon={Info}
                    title={apiMessage ? 'Aviso del servidor' : 'Sin recursos'}
                    description={apiMessage || 'No se detectaron máquinas virtuales en el rango de fechas seleccionado.'}
                    tone={apiMessage ? 'warn' : 'info'}
                />
            </div>
        );
    }

    const resources = groups.flatMap((group) => group.resources ?? []);
    const totalResources = resources.length;
    const taggedResources = resources.filter((resource) => (
        resource.tags !== 'SIN TAGS'
        && resource.tags != null
        && Object.keys(resource.tags).length > 0
    )).length;
    const untaggedResources = totalResources - taggedResources;
    const resourcesWithCostCenter = resources.filter(
        (resource) => (resource.cost_center_ids?.length ?? 0) > 0
    ).length;
    const coverage = totalResources > 0 ? Math.round((taggedResources / totalResources) * 100) : 0;
    const isOptimal = coverage >= 90;
    const isWarning = coverage >= 50 && coverage < 90;

    return (
        <div className='relative w-full min-w-0 space-y-6 px-4 py-6'>
            <div className='mb-6 flex items-center gap-3'>
                <Tags className='h-7 w-7 text-blue-600' />
                <h2 className='text-2xl font-bold tracking-tight sm:text-3xl'>
                    Cobertura de Etiquetas Locales
                </h2>
            </div>

            <div className={`flex w-full flex-col items-start gap-4 rounded-xl border-l-4 p-4 shadow-sm sm:flex-row sm:items-center ${
                isOptimal
                    ? 'border-green-500 bg-green-50'
                    : isWarning
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-red-500 bg-red-50'
            }`}>
                <div className={`shrink-0 rounded-full p-2.5 ${
                    isOptimal
                        ? 'bg-green-100 text-green-600'
                        : isWarning
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-red-100 text-red-600'
                }`}>
                    {isOptimal
                        ? <CheckCircle2 className='h-6 w-6' />
                        : <AlertTriangle className='h-6 w-6' />}
                </div>
                <div className='flex-1'>
                    <h3 className={`text-base font-bold sm:text-lg ${
                        isOptimal
                            ? 'text-green-800'
                            : isWarning
                                ? 'text-yellow-800'
                                : 'text-red-800'
                    }`}>
                        Estado: {isOptimal ? 'Excelente' : isWarning ? 'Requiere atención' : 'Crítico'}
                    </h3>
                    <p className='mt-1 text-sm leading-relaxed text-gray-700'>
                        {untaggedResources === 0
                            ? 'Todas las máquinas virtuales del período tienen al menos una etiqueta local.'
                            : `La cobertura actual es de ${coverage}%. Hay ${untaggedResources} máquinas virtuales sin etiquetas locales.`}
                    </p>
                </div>
            </div>

            <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                <MetricCard
                    title='Total Recursos'
                    value={totalResources}
                    icon={LayoutGrid}
                    borderClass='border-l-gray-500'
                    iconClass='text-gray-500'
                />
                <MetricCard
                    title='Con Tags Locales'
                    value={taggedResources}
                    icon={Tags}
                    borderClass='border-l-blue-500'
                    iconClass='text-blue-600'
                />
                <MetricCard
                    title='Sin Tags'
                    value={untaggedResources}
                    icon={ServerOff}
                    borderClass={untaggedResources > 0 ? 'border-l-red-500' : 'border-l-green-500'}
                    iconClass={untaggedResources > 0 ? 'text-red-500' : 'text-green-600'}
                    valueClass={untaggedResources > 0 ? 'text-red-600' : 'text-green-700'}
                />
                <MetricCard
                    title='Con Centro de Costo'
                    value={resourcesWithCostCenter}
                    icon={CircleDollarSign}
                    borderClass='border-l-green-600'
                    iconClass='text-green-600'
                />
            </div>

            <TagsDataTableVCenter data={groups} />
        </div>
    );
};

interface MetricCardProps {
    title: string;
    value: number;
    icon: React.ElementType;
    borderClass: string;
    iconClass: string;
    valueClass?: string;
}

const MetricCard = ({
    title,
    value,
    icon: Icon,
    borderClass,
    iconClass,
    valueClass = 'text-gray-800',
}: MetricCardProps) => (
    <Card className={`flex w-full flex-col justify-between border-l-4 shadow-sm ${borderClass}`}>
        <CardContent className='p-4 sm:p-5'>
            <div className='mb-3 flex items-start justify-between'>
                <p className='text-xs font-semibold uppercase tracking-wide text-gray-500 sm:text-sm'>{title}</p>
                <Icon className={`h-5 w-5 opacity-80 ${iconClass}`} />
            </div>
            <p className={`truncate text-2xl font-bold sm:text-3xl ${valueClass}`}>{value}</p>
        </CardContent>
    </Card>
);
