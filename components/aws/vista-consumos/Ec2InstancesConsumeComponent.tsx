'use client'

import useSWR from 'swr';
import { ChartBar } from 'lucide-react';
import { Ec2ResourceConsumeViewUsageCpuComponent } from './graficos/Ec2ResourceConsumeViewUsageCpuComponent';
import { Ec2ResourceConsumeViewUsageCreditsComponent } from './graficos/Ec2ResourceConsumeViewUsageCreditsComponent';
import { Ec2InfoConsumeViewComponent } from './info/Ec2InfoConsumeViewComponent';
import { Ec2ConsumeViewInstanceTable } from './table/Ec2ConsumeViewInstanceTable';

interface Ec2InstancesConsumeComponentProps {
    startDate: Date,
    endDate: Date,
    instance: string,
    region: string
}

const fetcher = (url: string) =>
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())

export const Ec2InstancesConsumeComponent = ({ startDate, endDate, instance, region }: Ec2InstancesConsumeComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const ec2CpuMetrics = useSWR(
        instance ? `${process.env.NEXT_PUBLIC_API_URL}/vm/consumo_ec2/cpu_usage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}` : null,
        fetcher
    )
    const ec2CreditsMetrics = useSWR(
        instance ? `${process.env.NEXT_PUBLIC_API_URL}/vm/consumo_ec2/credits_usage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}` : null,
        fetcher
    )
    const ec2Info = useSWR(
        instance ? `${process.env.NEXT_PUBLIC_API_URL}/vm/consumo_ec2/info?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}` : null,
        fetcher
    )
    const ec2GlobalCreditsEfficiency = useSWR(
        instance ? `${process.env.NEXT_PUBLIC_API_URL}/vm/consumo_ec2/global_credits_efficiency?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}` : null,
        fetcher
    )

    if (ec2CpuMetrics.isLoading) {
        return (
            <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                <span className="ml-3">Cargando Métricas...</span>
            </div>
        );
    }
    if (ec2CpuMetrics.error) return <div>Error al cargar datos</div>
    // if (ec2Info.isLoading) {
    //     return (
    //         <div className="flex justify-center items-center p-12">
    //             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    //             <span className="ml-3">Cargando información de Instancia...</span>
    //         </div>
    //     );
    // }
    // if (ec2Info.error) return <div>Error al cargar datos</div>
    // if (ec2Events.isLoading) {
    //     return (
    //         <div className="flex justify-center items-center p-12">
    //             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    //             <span className="ml-3">Cargando eventos...</span>
    //         </div>
    //     );
    // }
    // if (ec2Events.error) return <div>Error al cargar datos</div>

    if (!instance) {
        return (
            <div className='max-w-7xl mx-auto px-6 py-8'>
                <div className='text-center text-gray-500 text-lg font-medium'>
                    No se ha seleccionado ninguna instancia.
                </div>
            </div>
        );
    }
    const cpuMetricsData: ConsumeViewEc2CpuMetrics[] | null = ec2CpuMetrics.data;
    const creditsMetricsData: ConsumeViewEc2CreditsMetrics[] | null = ec2CreditsMetrics.data;
    const infoData: Ec2ConsumneViewInstance[] | null = ec2Info.data
    const globalEfficiencyData: unknown = ec2GlobalCreditsEfficiency.data;

    if (!cpuMetricsData || cpuMetricsData.length === 0) {
        return (
            <div className='w-full min-w-0 px-4 py-6'>
                <div className='flex flex-col xl:flex-row gap-8 min-w-0'>
                    <div className='w-full xl:max-w-sm min-w-0'>
                        {/* <Ec2ResourceViewInfoComponent data={infoData} /> */}
                    </div>
                    <div className='text-center text-gray-500 text-lg font-medium'>
                        No hay métricas disponibles para esta instancia en el rango seleccionado.
                    </div>
                </div>
            </div>
        );
    }
    if (!creditsMetricsData || creditsMetricsData.length === 0) {
        return (
            <div className='w-full min-w-0 px-4 py-6'>
                <div className='flex flex-col xl:flex-row gap-8 min-w-0'>
                    <div className='w-full xl:max-w-sm min-w-0'>
                        {/* <Ec2ResourceViewInfoComponent data={infoData} /> */}
                    </div>
                    <div className='text-center text-gray-500 text-lg font-medium'>
                        No hay métricas disponibles para esta instancia en el rango seleccionado.
                    </div>
                </div>
            </div>
        );
    }
    if (!infoData || infoData.length === 0) {
        return (
            <div className='w-full min-w-0 px-4 py-6'>
                <div className='flex flex-col xl:flex-row gap-8 min-w-0'>
                    <div className='w-full xl:max-w-sm min-w-0'>
                        {/* <Ec2ResourceViewInfoComponent data={infoData} /> */}
                    </div>
                    <div className='text-center text-gray-500 text-lg font-medium'>
                        No hay métricas disponibles para esta instancia en el rango seleccionado.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className='w-full min-w-0 px-4 py-6'>
                {/* <div className='flex flex-col xl:flex-row gap-8 min-w-0'>
                    <div className='w-full xl:max-w-sm min-w-0'>
                        <Ec2ResourceViewInfoComponent data={infoData} />
                    </div>

                    <div className='flex-1 space-y-6 min-w-0 overflow-hidden'>
                        <MainEc2ResourceViewMetricsSummaryComponent data={metricsData} />
                    </div>
                </div> */}
                <div className='flex-1 space-y-6 min-w-0 overflow-hidden'>
                    <Ec2InfoConsumeViewComponent
                        cpuData={cpuMetricsData}
                        creditsData={creditsMetricsData}
                        infoData={infoData}
                        creditsGlobalEfficiency={globalEfficiencyData}
                    />
                </div>
                <div className='flex flex-col gap-5 mt-10'>
                    <div className="flex items-center gap-3 my-5">
                        <ChartBar className="h-8 w-8 text-blue-500" />
                        <h1 className="text-3xl font-bold text-foreground">Métricas de la Instancia</h1>
                    </div>
                    <Ec2ResourceConsumeViewUsageCreditsComponent
                        data={creditsMetricsData}
                    />
                    <Ec2ResourceConsumeViewUsageCpuComponent
                        data={cpuMetricsData}
                    />
                    {/* <Ec2ResourceViewUsageCpuComponent
                        data={metricsData}
                    />
                    <Ec2ResourceViewUsageNetworkComponent
                        data={metricsData}
                    /> */}
                </div>
                <Ec2ConsumeViewInstanceTable
                    data={infoData}
                    startDate={startDate}
                    endDate={endDate}
                    instance={instance}
                    enableGrouping
                />
            </div>
        </>
    )
}
