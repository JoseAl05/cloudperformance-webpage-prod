'use client'

import { LoaderComponent } from '@/components/general/LoaderComponent'
import useSWR from 'swr'
import { MessageCard } from '../../cards/MessageCards'
import { AlertCircle, ChartBar, Info } from 'lucide-react'
import { ConsumeViewRdsPgCpuMetrics, ConsumeViewRdsPgCreditsMetrics, ConsumeViewRdsPgDbConnectionsMetrics, RdsConsumeViewInstance } from '@/interfaces/vista-consumos/rdsPgConsumeViewInterfaces'
import { RdsInfoConsumeViewComponent } from './info/RdsInfoConsumeViewComponent'

interface RdsPgInstancesConsumeComponentProps {
    startDate: Date
    endDate: Date
    instance: string
    region: string
}

const fetcher = (url: string) =>
    fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json())

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0
const isNullish = (v: unknown) => v === null || v === undefined

export const RdsPgInstancesConsumeComponent = ({ startDate, endDate, instance, region }: RdsPgInstancesConsumeComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const rdsPgCpuMetrics = useSWR(
        instance
            ? `${process.env.NEXT_PUBLIC_API_URL}/db/consumo_rds_postgresql/cpu_usage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}`
            : null,
        fetcher
    );
    const rdsPgCreditsMetrics = useSWR(
        instance
            ? `${process.env.NEXT_PUBLIC_API_URL}/db/consumo_rds_postgresql/credits_usage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}`
            : null,
        fetcher
    );
    const rdsPgDbConnectionsMetrics = useSWR(
        instance
            ? `${process.env.NEXT_PUBLIC_API_URL}/db/consumo_rds_postgresql/db_connections?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}`
            : null,
        fetcher
    );
    const rdsPgInfo = useSWR(
        instance
            ? `${process.env.NEXT_PUBLIC_API_URL}/db/consumo_rds_postgresql/info?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}`
            : null,
        fetcher
    );
    const rdsPgGlobalCreditsEfficiency = useSWR(
        instance
            ? `${process.env.NEXT_PUBLIC_API_URL}/db/consumo_rds_postgresql/global_credits_efficiency?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}`
            : null,
        fetcher
    );

    const anyLoading =
        rdsPgCpuMetrics.isLoading ||
        rdsPgCreditsMetrics.isLoading ||
        rdsPgDbConnectionsMetrics.isLoading ||
        rdsPgGlobalCreditsEfficiency.isLoading ||
        rdsPgInfo.isLoading

    const anyError =
        !!rdsPgCpuMetrics.error ||
        !!rdsPgCreditsMetrics.error ||
        !!rdsPgDbConnectionsMetrics.error ||
        !!rdsPgGlobalCreditsEfficiency.error ||
        !!rdsPgInfo.error

    const cpuMetricsData: ConsumeViewRdsPgCpuMetrics[] | null =
        isNonEmptyArray<ConsumeViewRdsPgCpuMetrics>(rdsPgCpuMetrics.data) ? rdsPgCpuMetrics.data : null;

    const creditsMetricsData: ConsumeViewRdsPgCreditsMetrics[] | null =
        isNonEmptyArray<ConsumeViewRdsPgCreditsMetrics>(rdsPgCreditsMetrics.data) ? rdsPgCreditsMetrics.data : null;

    const dbConnectionsMetricsData: ConsumeViewRdsPgDbConnectionsMetrics[] | null =
        isNonEmptyArray<ConsumeViewRdsPgDbConnectionsMetrics>(rdsPgDbConnectionsMetrics.data) ? rdsPgDbConnectionsMetrics.data : null;

    const infoData: RdsConsumeViewInstance[] | null =
        isNonEmptyArray<RdsConsumeViewInstance>(rdsPgInfo.data) ? rdsPgInfo.data : null

    const globalEfficiencyData: unknown = isNullish(rdsPgGlobalCreditsEfficiency.data)
        ? null
        : rdsPgGlobalCreditsEfficiency.data

    const hasCpuData = !!cpuMetricsData && cpuMetricsData.length > 0;
    const hasCreditsData = !!creditsMetricsData && creditsMetricsData.length > 0;
    const hasDbConnectionsData = !!dbConnectionsMetricsData && dbConnectionsMetricsData.length > 0;

    if (anyLoading) {
        return (
            <LoaderComponent />
        )
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

    const noneHasData = !hasCpuData && !hasCreditsData && !hasDbConnectionsData;

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
        <div className="w-full min-w-0 px-4 py-6">
            <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                <RdsInfoConsumeViewComponent
                    cpuData={cpuMetricsData}
                    creditsData={creditsMetricsData}
                    infoData={infoData}
                    creditsGlobalEfficiency={globalEfficiencyData}
                />
            </div>

            <div className="flex flex-col gap-5 mt-10">
                <div className="flex items-center gap-3 my-5">
                    <ChartBar className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Métricas de la Instancia</h1>
                </div>

                {/* <Ec2ResourceConsumeViewUsageCreditsComponent data={creditsMetricsData} />
                <Ec2ResourceConsumeViewUsageCpuComponent data={cpuMetricsData} /> */}
            </div>

            {/* <Ec2ConsumeViewInstanceTable
                data={infoData}
                startDate={startDate}
                endDate={endDate}
                instance={instance}
                enableGrouping
            /> */}
        </div>
    )
}