'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { GkeChartComponent } from '@/components/gcp/vista-recursos/clusters-gke/grafico/GkeChartComponent';
import { GkeInfoComponent } from '@/components/gcp/vista-recursos/clusters-gke/info/GkeInfoComponent';
import { GkeMetricsCardComponent } from '@/components/gcp/vista-recursos/clusters-gke/info/GkeMetricsCardComponent';
import { GkeBillingComponent } from '@/components/gcp/vista-recursos/clusters-gke/table/GkeBillingComponent';
import { GkeNodesTableComponent } from '@/components/gcp/vista-recursos/clusters-gke/table/GkeNodesTableComponent';
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent';
import { ClusterGkeInfo, ClusterGkeInstances, ClusterGkeMetrics } from '@/interfaces/vista-gke/gkeInterfaces';
import { AlertCircle, ChartBar, Computer, DollarSign, Info } from 'lucide-react';
import useSWR from 'swr';

interface GkeComponentProps {
    startDate: Date
    endDate: Date
    resourceId: string
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

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

    const anyError =
        !!gkeInfo.error ||
        !!gkeInstances.error


    const infoData: ClusterGkeInfo[] | null =
        isNonEmptyArray<ClusterGkeInfo>(gkeInfo.data) ? gkeInfo.data : null;

    const instancesData: ClusterGkeInstances[] | null =
        isNonEmptyArray<ClusterGkeInstances>(gkeInstances.data) ? gkeInstances.data : null;

    const hasInfoData = !!infoData && infoData.length > 0;
    const hasInstancesData = !!instancesData && instancesData.length > 0;

    if (anyLoading) {
        return <LoaderComponent />
    }

    if (!resourceId) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ningun cluster.</div>
            </div>
        )
    }

    if (anyError) {
        return (
            <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
                <MessageCard
                    icon={AlertCircle}
                    title="Error al cargar datos"
                    description="Ocurrió un problema al obtener la información desde la API. Intenta nuevamente o ajusta el rango de fechas."
                    tone="error"
                />
            </div>
        )
    }

    const noneHasData = !hasInfoData && !hasMetricsData && !hasInstancesData;

    if (noneHasData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos métricas ni información de la instancia en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }

    const instancesNamesList = instancesData.map(instance => instance.resource_name);
    const instancesIdsList = instancesData.map(instance => instance.resource_id);

    return (
        <>
            <div className='w-full min-w-0 px-4 py-6'>
                <div className='flex flex-col xl:flex-row gap-8 min-w-0'>
                    <div className='w-full xl:max-w-sm min-w-0'>
                        <GkeInfoComponent
                            data={infoData}
                        />
                    </div>
                    <div className='flex-1 space-y-6 min-w-0 overflow-hidden'>
                        <GkeMetricsCardComponent
                            instances={instancesNamesList}
                            startDate={startDateFormatted}
                            endDate={endDateFormatted}
                        />
                    </div>
                </div>
                <div className='flex flex-col gap-5 mt-10'>
                    <div className="flex items-center gap-3 my-0">
                        <Computer className="h-8 w-8 text-blue-500" />
                        <h1 className="text-3xl font-bold text-foreground">Nodos</h1>
                    </div>
                    <GkeNodesTableComponent
                        data={instancesData}
                    />
                </div>
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
            </div>
        </>
    )
}