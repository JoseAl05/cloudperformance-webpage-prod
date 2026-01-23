'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { InstanceGroupChartComponent } from '@/components/gcp/vista-recursos/instance-groups/grafico/InstanceGroupChartComponent';
import { InstanceGroupsInfoComponent } from '@/components/gcp/vista-recursos/instance-groups/info/InstanceGroupsInfoComponent';
import { InstanceGroupsMetricsCardsComponent } from '@/components/gcp/vista-recursos/instance-groups/info/InstanceGroupsMetricsCardsComponent';
import { InstanceGroupsBillingComponent } from '@/components/gcp/vista-recursos/instance-groups/table/InstanceGroupsBillingComponent';
import { InstanceGroupsInstancesTableComponent } from '@/components/gcp/vista-recursos/instance-groups/table/InstanceGroupsInstancesTableComponent';
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent';
import { InstanceGroupInfo, InstanceGroupsInstances, InstanceGroupsMetrics } from '@/interfaces/vista-instance-group/iGInterfaces';
import { AlertCircle, ChartBar, DollarSign, Info } from 'lucide-react';
import useSWR from 'swr';

interface InstanceGroupsComponentProps {
    startDate: Date
    endDate: Date
    resourceId: string
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const InstanceGroupsComponent = ({
    startDate,
    endDate,
    resourceId
}: InstanceGroupsComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const iGMetrics = useSWR(
        resourceId ? `/api/gcp/bridge/gcp/instance_groups/gcp_instance_group_metrics?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance_group=${resourceId}` : null,
        fetcher
    )

    const iGInfo = useSWR(
        resourceId ? `/api/gcp/bridge/gcp/instance_groups/gcp_instance_groups?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance_group=${resourceId}` : null,
        fetcher
    )

    const iGInstances = useSWR(
        resourceId ? `/api/gcp/bridge/gcp/instance_groups/all_instances_instance_groups?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance_group=${resourceId}` : null,
        fetcher
    )

    // const cEBilling = useSWR(
    //     resourceId ? `/api/gcp/bridge/gcp/instancias_compute_engine/gcp-compute-instances_billing?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance=${resourceId}` : null,
    //     fetcher
    // )

    const anyLoading =
        iGInfo.isLoading ||
        iGMetrics.isLoading ||
        iGInstances.isLoading



    const anyError =
        !!iGInfo.error ||
        !!iGMetrics.error ||
        !!iGInstances.error


    const metricsData: InstanceGroupsMetrics[] | null =
        isNonEmptyArray<InstanceGroupsMetrics>(iGMetrics.data) ? iGMetrics.data : null;

    const infoData: InstanceGroupInfo[] | null =
        isNonEmptyArray<InstanceGroupInfo>(iGInfo.data) ? iGInfo.data : null;

    const instancesData: InstanceGroupsInstances[] | null =
        isNonEmptyArray<InstanceGroupsInstances>(iGInstances.data) ? iGInstances.data : null;



    const hasInfoData = !!infoData && infoData.length > 0;
    const hasMetricsData = !!metricsData && metricsData.length > 0;
    const hasInstancesData = !!instancesData && instancesData.length > 0;


    if (anyLoading) {
        return <LoaderComponent />
    }

    if (!resourceId) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ninguna instancia.</div>
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

    const instancesList = instancesData.map(instance => instance.resource_id);

    return (
        <>
            <div className='w-full min-w-0 px-4 py-6'>
                <div className='flex flex-col xl:flex-row gap-8 min-w-0'>
                    <div className='w-full xl:max-w-sm min-w-0'>
                        <InstanceGroupsInfoComponent
                            data={infoData}
                        />
                    </div>
                    <div className='flex-1 space-y-6 min-w-0 overflow-hidden'>
                        <InstanceGroupsMetricsCardsComponent
                            data={metricsData}
                        />
                    </div>
                </div>
                <div className='flex flex-col gap-5 mt-10'>
                    <div className="flex items-center gap-3 my-5">
                        <ChartBar className="h-8 w-8 text-blue-500" />
                        <h1 className="text-3xl font-bold text-foreground">Métricas de la Instancia</h1>
                    </div>
                    <InstanceGroupChartComponent
                        data={metricsData}
                    />
                </div>
                <div className='flex flex-col gap-5 mt-10'>
                    <div className="flex items-center gap-3 my-0">
                        <DollarSign className="h-8 w-8 text-blue-500" />
                        <h1 className="text-3xl font-bold text-foreground">Instancias del Instance Group</h1>
                    </div>
                    <InstanceGroupsInstancesTableComponent
                        data={instancesData}
                    />
                </div>
                <div className='flex flex-col gap-5 mt-10'>
                    <div className="flex items-center gap-3 my-10">
                        <DollarSign className="h-8 w-8 text-blue-500" />
                        <h1 className="text-3xl font-bold text-foreground">Facturación del Instance Group</h1>
                    </div>
                    <InstanceGroupsBillingComponent
                        instances={instancesList}
                        startDate={startDateFormatted}
                        endDate={endDateFormatted}
                    />
                </div>
            </div>
        </>
    )
}