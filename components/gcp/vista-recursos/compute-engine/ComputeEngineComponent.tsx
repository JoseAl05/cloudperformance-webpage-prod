// 'use client'

// import { MessageCard } from '@/components/aws/cards/MessageCards';
// import { LoaderComponent } from '@/components/general_gcp/LoaderComponent';
// import { ChartBar, Clock } from 'lucide-react';

// const fetcher = (url: string) =>
//     fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
//         .then(r => r.json());

// const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0
// const isNullish = (v: unknown) => v === null || v === undefined

// export const ComputeEngineComponente = () => {
//     const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
//     const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

//     const ec2Metrics = useSWR(
//         instance ? `/api/aws/bridge/vm/instancias-ec2-metrics?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource=${instance}` : null,
//         fetcher
//     )

//     const ec2Info = useSWR(
//         instance ? `/api/aws/bridge/vm/instancias-ec2?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance_id=${instance}` : null,
//         fetcher
//     )

//     const ec2Events = useSWR(
//         instance ? `/api/aws/bridge/vm/instancias-ec2-events?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource=${instance}` : null,
//         fetcher
//     )

//     const anyLoading =
//         ec2Metrics.isLoading ||
//         ec2Info.isLoading ||
//         ec2Events.isLoading

//     const anyError =
//         !!ec2Metrics.error ||
//         !!ec2Info.error ||
//         !!ec2Events.error

//     const metricsData: Ec2ResourceViewMetricsApiResponse | null =
//         !isNullish<Ec2ResourceViewMetricsApiResponse>(ec2Metrics.data) ? ec2Metrics.data : null;

//     const infoData: Ec2InstanceSummary[] | null =
//         isNonEmptyArray<Ec2ConsumneViewInstance>(ec2Info.data) ? ec2Info.data : null;

//     const eventsData: Ec2ResourceViewEventsResponse[] | null =
//         isNonEmptyArray<Ec2ResourceViewEventsResponse>(ec2Events.data) ? ec2Events.data : null;

//     const hasMetricsData = !!metricsData && metricsData.metrics_data.length > 0
//     const hasEventsData = !!eventsData && eventsData.length > 0
//     const hasInfoData = !!infoData && infoData.length > 0

//     if (anyLoading) {
//         return <LoaderComponent />
//     }

//     if (!instance) {
//         return (
//             <div className="max-w-7xl mx-auto px-6 py-8">
//                 <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ninguna instancia.</div>
//             </div>
//         )
//     }

//     if (anyError) {
//         return (
//             <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
//                 <MessageCard
//                     icon={AlertCircle}
//                     title="Error al cargar datos"
//                     description="Ocurrió un problema al obtener la información desde la API. Intenta nuevamente o ajusta el rango de fechas."
//                     tone="error"
//                 />
//             </div>
//         )
//     }

//     const noneHasData = !hasMetricsData && !hasEventsData && !hasInfoData
//     if (noneHasData) {
//         return (
//             <div className="w-full min-w-0 px-4 py-6">
//                 <MessageCard
//                     icon={Info}
//                     title="Sin datos para mostrar"
//                     description="No encontramos métricas ni información de la instancia en el rango seleccionado."
//                     tone="warn"
//                 />
//             </div>
//         )
//     }
//     return (
//         <>
// <div className='w-full min-w-0 px-4 py-6'>
//     <div className='flex flex-col xl:flex-row gap-8 min-w-0'>
//         <div className='w-full xl:max-w-sm min-w-0'>
//             {/* <Ec2ResourceViewInfoComponent data={infoData} /> */}
//         </div>
//         <div className='flex-1 space-y-6 min-w-0 overflow-hidden'>
//             {/* <MainEc2ResourceViewMetricsSummaryComponent data={metricsData} /> */}
//         </div>
//     </div>
//     <div className='flex flex-col gap-5 mt-10'>
//         <div className="flex items-center gap-3 my-5">
//             <ChartBar className="h-8 w-8 text-blue-500" />
//             <h1 className="text-3xl font-bold text-foreground">Métricas de la Instancia</h1>
//         </div>
//         {/* <Ec2ResourceViewUsageCreditsComponent
//             data={metricsData}
//         />
//         <Ec2ResourceViewUsageCpuComponent
//             data={metricsData}
//         />
//         <Ec2ResourceViewUsageNetworkComponent
//             data={metricsData}
//         /> */}
//     </div>
//     <div className="flex items-center gap-3 my-10">
//         <Clock className="h-8 w-8 text-blue-500" />
//         <h1 className="text-3xl font-bold text-foreground">Eventos de la Instancia</h1>
//     </div>
//     {/* <Ec2EventsTableComponent
//         data={eventsData}
//         startDate={startDate}
//         endDate={endDate}
//         instance={instance}
//     /> */}
// </div>
//         </>
//     )
// }
'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { ComputeEngineInfoComponent } from '@/components/gcp/vista-recursos/compute-engine/info/ComputeEngineInfoComponent';
import { ComputeEngineMetricsCardsComponent } from '@/components/gcp/vista-recursos/compute-engine/info/ComputeEngineMetricsCardsComponent';
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent';
import { ComputeEngineInfoResponse, ComputeEngineMetrics } from '@/interfaces/vista-compute-engine/cEInterfaces';
import { AlertCircle, ChartBar, Clock, Info } from 'lucide-react';
import useSWR from 'swr';

interface ComputeEngineComponentProps {
    startDate: Date
    endDate: Date
    resourceId: string
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const ComputeEngineComponente = ({
    startDate,
    endDate,
    resourceId

}: ComputeEngineComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const cEMetrics = useSWR(
        resourceId ? `/api/gcp/bridge/gcp/instancias_compute_engine/gcp-compute-instances_metrics?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance=${resourceId}` : null,
        fetcher
    )

    const cEInfo = useSWR(
        resourceId ? `/api/gcp/bridge/gcp/instancias_compute_engine/gcp-compute-instances?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance=${resourceId}` : null,
        fetcher
    )

    const anyLoading =
        cEMetrics.isLoading ||
        cEInfo.isLoading

    const anyError =
        !!cEMetrics.error ||
        !!cEInfo.error

    const metricsData: ComputeEngineMetrics[] | null =
        isNonEmptyArray<ComputeEngineMetrics>(cEMetrics.data) ? cEMetrics.data : null;

    const infoData: ComputeEngineInfoResponse[] | null =
        isNonEmptyArray<ComputeEngineInfoResponse>(cEInfo.data) ? cEInfo.data : null;

    const hasMetricsData = !!metricsData && metricsData.length > 0
    const hasInfoData = !!infoData && infoData.length > 0

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

    const noneHasData = !hasMetricsData && !hasInfoData
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

    console.log(metricsData);

    return (
        <>
            <div className='w-full min-w-0 px-4 py-6'>
                <div className='flex flex-col xl:flex-row gap-8 min-w-0'>
                    <div className='w-full xl:max-w-sm min-w-0'>
                        <ComputeEngineInfoComponent data={infoData} />
                    </div>
                    <div className='flex-1 space-y-6 min-w-0 overflow-hidden'>
                        <ComputeEngineMetricsCardsComponent data={metricsData}/>
                    </div>
                </div>
                <div className='flex flex-col gap-5 mt-10'>
                    <div className="flex items-center gap-3 my-5">
                        <ChartBar className="h-8 w-8 text-blue-500" />
                        <h1 className="text-3xl font-bold text-foreground">Métricas de la Instancia</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3 my-10">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Eventos de la Instancia</h1>
                </div>
            </div>
        </>
    )
}