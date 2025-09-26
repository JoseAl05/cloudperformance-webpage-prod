'use client'

import useSWR from 'swr';
import { Ec2ResourceViewUsageCpuComponent } from './graficos/Ec2ResourceViewUsageCpuComponent';
import { Ec2ResourceViewUsageCreditsComponent } from './graficos/Ec2ResourceViewUsageCreditsComponent';
import { Ec2ResourceViewUsageNetworkComponent } from './graficos/Ec2ResourceViewUsageNetworkComponent';
import { Ec2ResourceViewInfoComponent } from './info/Ec2ResourceViewInfoComponent';
import { AlertCircle, ChartBar, Clock, Info, Loader2 } from 'lucide-react';
import { MainEc2ResourceViewMetricsSummaryComponent } from './graficos/MainEc2ResourceViewMetricsSummaryComponent';
import { Ec2EventsTableComponent } from './events/Ec2EventsTable';
import { Ec2InstanceSummary } from '@/interfaces/vista-ec2/ec2ResourceViewInterfaces';
import { Ec2ResourceViewMetricsApiResponse } from '@/interfaces/vista-ec2/ec2MetricsResourceViewInterfaces';
import { Ec2ResourceViewEventsResponse } from '@/interfaces/vista-ec2/ec2EventsResourceViewInterfaces';
import { MessageCard } from '../../cards/MessageCards';
import { LoaderComponent } from '@/components/general/LoaderComponent';

interface InstanceEc2CpuMetricsComponentProps {
    startDate: Date,
    endDate: Date,
    instance: string
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0
const isNullish = (v: unknown) => v === null || v === undefined

export const InstanceEc2CpuMetricsComponent = ({ startDate, endDate, instance }: InstanceEc2CpuMetricsComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const ec2Metrics = useSWR(
        instance ? `/api/bridge/vm/instancias-ec2-metrics?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource=${instance}` : null,
        fetcher
    )

    const ec2Info = useSWR(
        instance ? `/api/bridge/vm/instancias-ec2?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance_id=${instance}` : null,
        fetcher
    )

    const ec2Events = useSWR(
        instance ? `/api/bridge/vm/instancias-ec2-events?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource=${instance}` : null,
        fetcher
    )

    const anyLoading =
        ec2Metrics.isLoading ||
        ec2Info.isLoading ||
        ec2Events.isLoading

    const anyError =
        !!ec2Metrics.error ||
        !!ec2Info.error ||
        !!ec2Events.error

    const metricsData: Ec2ResourceViewMetricsApiResponse | null =
        !isNullish<Ec2ResourceViewMetricsApiResponse>(ec2Metrics.data) ? ec2Metrics.data : null;

    const infoData: Ec2InstanceSummary[] | null =
        isNonEmptyArray<Ec2ConsumneViewInstance>(ec2Info.data) ? ec2Info.data : null;

    const eventsData: Ec2ResourceViewEventsResponse[] | null =
        isNonEmptyArray<Ec2ResourceViewEventsResponse>(ec2Events.data) ? ec2Events.data : null;

    const hasMetricsData = !!metricsData && metricsData.metrics_data.length > 0
    const hasEventsData = !!eventsData && eventsData.length > 0
    const hasInfoData = !!infoData && infoData.length > 0

    if (anyLoading) {
        return <LoaderComponent />
    }

    if (!instance) {
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

    const noneHasData = !hasMetricsData && !hasEventsData && !hasInfoData
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
    return (
        <>
            <div className='w-full min-w-0 px-4 py-6'>
                <div className='flex flex-col xl:flex-row gap-8 min-w-0'>
                    <div className='w-full xl:max-w-sm min-w-0'>
                        <Ec2ResourceViewInfoComponent data={infoData} />
                    </div>
                    <div className='flex-1 space-y-6 min-w-0 overflow-hidden'>
                        <MainEc2ResourceViewMetricsSummaryComponent data={metricsData} />
                    </div>
                    {/* {
                        hasInfoData && (
                            <div className='w-full xl:max-w-sm min-w-0'>
                                <Ec2ResourceViewInfoComponent data={infoData} />
                            </div>
                        )
                    }
                    {
                        hasMetricsData && (
                            <div className='flex-1 space-y-6 min-w-0 overflow-hidden'>
                                <MainEc2ResourceViewMetricsSummaryComponent data={metricsData} />
                            </div>
                        )
                    } */}
                </div>
                <div className='flex flex-col gap-5 mt-10'>
                    <div className="flex items-center gap-3 my-5">
                        <ChartBar className="h-8 w-8 text-blue-500" />
                        <h1 className="text-3xl font-bold text-foreground">Métricas de la Instancia</h1>
                    </div>
                    <Ec2ResourceViewUsageCreditsComponent
                        data={metricsData}
                    />
                    <Ec2ResourceViewUsageCpuComponent
                        data={metricsData}
                    />
                    <Ec2ResourceViewUsageNetworkComponent
                        data={metricsData}
                    />
                    {/* {
                        hasMetricsData && (
                            <>
                                <Ec2ResourceViewUsageCreditsComponent
                                    data={metricsData}
                                />
                                <Ec2ResourceViewUsageCpuComponent
                                    data={metricsData}
                                />
                                <Ec2ResourceViewUsageNetworkComponent
                                    data={metricsData}
                                />
                            </>
                        )
                    } */}
                </div>
                <div className="flex items-center gap-3 my-10">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Eventos de la Instancia</h1>
                </div>
                <Ec2EventsTableComponent
                    data={eventsData}
                    startDate={startDate}
                    endDate={endDate}
                    instance={instance}
                />
                {/* {
                    hasEventsData && (
                        <Ec2EventsTableComponent
                            data={eventsData}
                            startDate={startDate}
                            endDate={endDate}
                            instance={instance}
                        />
                    )
                } */}
            </div>
        </>
    )
}
