'use client'

import { fetcher } from '@/lib/fetcher';
import { MessageCard } from '@/components/aws/cards/MessageCards';
import { GkeChartComponent } from '@/components/gcp/vista-recursos/clusters-gke/grafico/GkeChartComponent';
import { GkeInfoComponent } from '@/components/gcp/vista-recursos/clusters-gke/info/GkeInfoComponent';
import { GkeMetricsCardComponent } from '@/components/gcp/vista-recursos/clusters-gke/info/GkeMetricsCardComponent';
import { GkeBillingComponent } from '@/components/gcp/vista-recursos/clusters-gke/table/GkeBillingComponent';
import { GkeNodesTableComponent } from '@/components/gcp/vista-recursos/clusters-gke/table/GkeNodesTableComponent';
import { DataStateComponent } from '@/components/shared/DataStateComponent';
import { ClusterGkeInfo, ClusterGkeInstances, ClusterGkeMetrics } from '@/interfaces/vista-gke/gkeInterfaces';
import { ChartBar, Computer, DollarSign, Info } from 'lucide-react';
import useSWR from 'swr';

interface GkeComponentProps {
    startDate: Date
    endDate: Date
    resourceId: string
}

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const GkeComponent = ({
    startDate,
    endDate,
    resourceId
}: GkeComponentProps) => {
    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const gkeInfo = useSWR(
        resourceId ? `/api/gcp/bridge/gcp/gke_clusters/gcp_gke_cluster?date_from=${startDateFormatted}&date_to=${endDateFormatted}&cluster_gke=${resourceId}` : null,
        fetcher
    )

    const gkeInstances = useSWR(
        resourceId ? `/api/gcp/bridge/gcp/gke_clusters/all_gke_instances?date_from=${startDateFormatted}&date_to=${endDateFormatted}&cluster_gke=${resourceId}` : null,
        fetcher
    )

    const anyLoading =
        gkeInfo.isLoading ||
        gkeInstances.isLoading

    const anyError = gkeInfo.error || gkeInstances.error


    const infoData: ClusterGkeInfo[] | null =
        isNonEmptyArray<ClusterGkeInfo>(gkeInfo.data) ? gkeInfo.data : null;

    const instancesData: ClusterGkeInstances[] | null =
        isNonEmptyArray<ClusterGkeInstances>(gkeInstances.data) ? gkeInstances.data : null;

    const hasInfoData = !!infoData && infoData.length > 0;
    const hasInstancesData = !!instancesData && instancesData.length > 0;

    if (!resourceId) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ningun cluster.</div>
            </div>
        )
    }

    const noneHasData = !hasInfoData && !hasInstancesData;

    const nodes = instancesData ?? [];
    const instancesNamesList = nodes.map(instance => instance.resource_name);
    const instancesIdsList = nodes.map(instance => instance.resource_id);

    const noDataCard = (description: string) => (
        <MessageCard
            icon={Info}
            title="Sin datos para mostrar"
            description={description}
            tone="warn"
        />
    );

    return (
        <DataStateComponent
            isLoading={anyLoading}
            error={anyError}
            isEmpty={noneHasData}
            emptyDescription="No encontramos métricas ni información de la instancia en el rango seleccionado."
        >
            <div className='w-full min-w-0 px-4 py-6'>
                <div className='flex flex-col xl:flex-row gap-8 min-w-0'>
                    <div className='w-full xl:max-w-sm min-w-0'>
                        {hasInfoData
                            ? <GkeInfoComponent data={infoData} />
                            : noDataCard('No encontramos información del cluster en el rango seleccionado.')}
                    </div>
                    {hasInstancesData && (
                        <div className='flex-1 space-y-6 min-w-0 overflow-hidden'>
                            <GkeMetricsCardComponent
                                instances={instancesNamesList}
                                startDate={startDateFormatted}
                                endDate={endDateFormatted}
                            />
                        </div>
                    )}
                </div>
                <div className='flex flex-col gap-5 mt-10'>
                    <div className="flex items-center gap-3 my-0">
                        <Computer className="h-8 w-8 text-blue-500" />
                        <h1 className="text-3xl font-bold text-foreground">Nodos</h1>
                    </div>
                    {hasInstancesData
                        ? <GkeNodesTableComponent data={nodes} />
                        : noDataCard('El cluster no tiene nodos registrados en el rango seleccionado.')}
                </div>
                {hasInstancesData && (
                    <>
                        <div className='flex flex-col gap-5 mt-10'>
                            <div className="flex items-center gap-3 my-5">
                                <ChartBar className="h-8 w-8 text-blue-500" />
                                <h1 className="text-3xl font-bold text-foreground">Métricas nodos del Cluster</h1>
                            </div>
                            <GkeChartComponent
                                instances={instancesNamesList}
                                startDate={startDateFormatted}
                                endDate={endDateFormatted}
                            />
                        </div>
                        <div className='flex flex-col gap-5 mt-10'>
                            <div className="flex items-center gap-3 my-10">
                                <DollarSign className="h-8 w-8 text-blue-500" />
                                <h1 className="text-3xl font-bold text-foreground">Facturación Nodos</h1>
                            </div>
                            <GkeBillingComponent
                                instances={instancesIdsList}
                                startDate={startDateFormatted}
                                endDate={endDateFormatted}
                            />
                        </div>
                    </>
                )}
            </div>
        </DataStateComponent>
    )
}
