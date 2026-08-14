'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent';
import { AlertCircle, Clock, Info } from 'lucide-react';
import useSWR from 'swr';

// Reutilizamos los componentes visuales de GCP
import { WorkingNonWorkingHoursChartComponent } from '@/components/gcp/vista-funciones/consumo-horario-habil-no-habil/grafico/WorkingNonWorkingHoursChartComponent';
import { WorkingNonWorkingHoursCardsComponent } from '@/components/gcp/vista-funciones/consumo-horario-habil-no-habil/info/WorkingNonWorkingHoursCardsComponent';
import { WorkingNonWorkingHoursTableComponent } from '@/components/gcp/vista-funciones/consumo-horario-habil-no-habil/table/WorkingNonWorkingHoursTableComponent';

import { WorkingNonWorkingHoursUsage, WorkingNonWorkingHoursUsageSummary, WorkingNonWorkingHoursUsageSummaryByResource } from '@/interfaces/vista-consumo-horario-habil-no-habil/workingNonWorkingHoursInterfaces';

interface AzureNodosWorkingNonWorkingHoursProps {
    startDate: Date;
    endDate: Date;
    subscription: string;
    region: string;
    selectedTagKey: string;
    selectedTagValue: string;
    selectedResourceGroup: string;
    selectedInstanceV2: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());
const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0;

export const AzureNodosWorkingNonWorkingHoursComponent = ({ 
    startDate, endDate, subscription, region, 
    selectedTagKey, selectedTagValue, selectedResourceGroup, selectedInstanceV2 
}: AzureNodosWorkingNonWorkingHoursProps) => {

    const startDateFormatted = startDate.toISOString().slice(0, 19);
    const endDateFormatted = endDate.toISOString().slice(0, 19);

    const buildParams = () => {
        const params = new URLSearchParams({
            date_from: startDateFormatted,
            date_to: endDateFormatted,
        });

        if (subscription && subscription !== 'all_subscriptions') params.append('subscription_id', subscription);
        if (region && region !== 'all_regions') params.append('location', region);
        if (selectedResourceGroup && selectedResourceGroup !== 'all_resource_groups') params.append('resource_group', selectedResourceGroup);
        if (selectedInstanceV2 && selectedInstanceV2 !== 'all_instances') params.append('vm_name', selectedInstanceV2);
        
        if (selectedTagKey && selectedTagKey !== 'allKeys' && selectedTagKey !== 'null') {
            params.append('tagKey', selectedTagKey);
            if (selectedTagValue && selectedTagValue !== 'allValues' && selectedTagValue !== 'null') {
                params.append('tagValue', selectedTagValue);
            }
        }
        return params.toString();
    };

    const queryString = buildParams();
    const shouldFetch = !!subscription;

    // Llamadas a los endpoints específicos de Nodos AKS de Azure
    const { data: usageDataRaw, error: usageError, isLoading: usageLoading } = useSWR(
        shouldFetch ? `/api/azure/bridge/azure/consumo/working_hours_usage_nodos?${queryString}` : null, fetcher, { revalidateOnFocus: false }
    );

    const { data: summaryDataRaw, error: summaryError, isLoading: summaryLoading } = useSWR(
        shouldFetch ? `/api/azure/bridge/azure/consumo/working_hours_usage_summary_nodos?${queryString}` : null, fetcher, { revalidateOnFocus: false }
    );

    const { data: tableDataRaw, error: tableError, isLoading: tableLoading } = useSWR(
        shouldFetch ? `/api/azure/bridge/azure/consumo/working_hours_usage_by_resource_nodos?${queryString}` : null, fetcher, { revalidateOnFocus: false }
    );

    const anyLoading = usageLoading || summaryLoading || tableLoading;
    const anyError = usageError || summaryError || tableError;

    const workingNonWorkingUsageData: WorkingNonWorkingHoursUsage[] | null = isNonEmptyArray(usageDataRaw) ? usageDataRaw : null;
    const workingNonWorkingUsageSummaryData: WorkingNonWorkingHoursUsageSummary[] | null = isNonEmptyArray(summaryDataRaw) ? summaryDataRaw : null;
    const workingNonWorkingUsageSummaryByResourceData: WorkingNonWorkingHoursUsageSummaryByResource[] | null = isNonEmptyArray(tableDataRaw) ? tableDataRaw : null;

    const hasData = !!workingNonWorkingUsageData || !!workingNonWorkingUsageSummaryData || !!workingNonWorkingUsageSummaryByResourceData;

    if (!subscription) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ninguna suscripción.</div>
            </div>
        )
    }

    if (anyLoading) return <LoaderComponent />

    if (anyError) {
        return (
            <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
                <MessageCard icon={AlertCircle} title="Error al cargar datos" description="Ocurrió un problema al obtener la información de nodos AKS." tone="error" />
            </div>
        )
    }

    if (!hasData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard icon={Info} title="Sin datos para mostrar" description="No encontramos métricas de nodos en el rango seleccionado." tone="warn" />
            </div>
        )
    }

    return (
        <div className='w-full min-w-0 px-4 py-6'>
            {/* 1. Tarjetas KPI */}
            <div className="flex-1 space-y-6 min-w-0">
                <WorkingNonWorkingHoursCardsComponent data={workingNonWorkingUsageSummaryData || []} />
            </div>

            {/* 2. Gráfico */}
            <div className="flex items-center gap-3 my-10">
                <Clock className="h-8 w-8 text-indigo-500" />
                <h1 className="text-3xl font-bold text-foreground">Métricas Nodos AKS Azure horario hábil vs no hábil.</h1>
            </div>
            <WorkingNonWorkingHoursChartComponent data={workingNonWorkingUsageData || []} />

            {/* 3. Tabla Desglosada */}
            <div className="flex items-center gap-3 my-10">
                <Clock className="h-8 w-8 text-indigo-500" />
                <h1 className="text-3xl font-bold text-foreground">Detalle Nodos AKS Azure horario hábil vs no hábil.</h1>
            </div>
            <WorkingNonWorkingHoursTableComponent data={workingNonWorkingUsageSummaryByResourceData || []} />
        </div>
    )
}