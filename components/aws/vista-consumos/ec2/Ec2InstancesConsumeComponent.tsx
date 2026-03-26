'use client'

import useSWR from 'swr'
import { ChartBar, AlertCircle, Info, Clock } from 'lucide-react'
import { MessageCard } from '@/components/aws/cards/MessageCards';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent'
import { ConsumeViewEc2GlobalEfficiency, ConsumeViewEc2Info, ConsumeViewEc2Metrics } from '@/interfaces/vista-consumos/ec2ConsumeViewInterfaces'
import { Ec2InstancesConsumeChartComponent } from '@/components/aws/vista-consumos/ec2/graficos/Ec2InstancesConsumeChartComponent'
import { Ec2ConsumeViewCardsComponent } from '@/components/aws/vista-consumos/ec2/info/Ec2ConsumeViewCardsComponent'
import { Ec2InstancesConsumeTableComponent } from '@/components/aws/vista-consumos/ec2/table/Ec2InstancesConsumeTableComponent'

interface Ec2InstancesConsumeComponentProps {
    startDate: Date
    endDate: Date
    instance: string
    region: string
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0
const isNullish = (v: unknown) => v === null || v === undefined

export const Ec2InstancesConsumeComponent = ({
    startDate,
    endDate,
    instance,
    region,
}: Ec2InstancesConsumeComponentProps) => {
    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

    const ec2Metrics = useSWR(
        instance
            ? `/api/aws/bridge/vm/consumo_ec2?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}`
            : null,
        fetcher
    )
    const ec2Info = useSWR(
        instance
            ? `/api/aws/bridge/vm/ec2/info?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}`
            : null,
        fetcher
    )
    const ec2GlobalEfficiency = useSWR(
        instance
            ? `/api/aws/bridge/vm/ec2/global_efficiency?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}`
            : null,
        fetcher
    )

    // const ec2NetworkMetrics = useSWR(
    //     instance
    //         ? `/api/aws/bridge/vm/consumo_ec2/network?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}`
    //         : null,
    //     fetcher
    // )

    const anyLoading =
        ec2Metrics.isLoading ||
        ec2Info.isLoading ||
        ec2GlobalEfficiency.isLoading

    const anyError =
        !!ec2Metrics.error ||
        !!ec2Info.error ||
        !!ec2GlobalEfficiency.error

    const metricsData: ConsumeViewEc2Metrics[] | null =
        isNonEmptyArray<ConsumeViewEc2Metrics>(ec2Metrics.data) ? ec2Metrics.data : null

    const infoData: ConsumeViewEc2Info = isNullish(ec2Info.data)
        ? null
        : ec2Info.data

    const globalEfficiencyData: ConsumeViewEc2GlobalEfficiency = isNullish(ec2GlobalEfficiency.data)
        ? null
        : ec2GlobalEfficiency.data

    // const networkMetricsData: ConsumeViewEc2NetworkMetrics[] | null =
    //     isNonEmptyArray<ConsumeViewEc2NetworkMetrics>(ec2NetworkMetrics.data) ? ec2NetworkMetrics.data : null

    const hasMetricsData = !!metricsData && metricsData.length > 0
    const hasInfoData = !!infoData && infoData.length > 0
    const hasEfficiencyData = !!globalEfficiencyData

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

    const noneHasData = !hasMetricsData && !hasInfoData && !hasEfficiencyData
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
        <div className="space-y-6 mt-6 px-4">
            <Ec2ConsumeViewCardsComponent
                summary={infoData?.resumen}
                instancias={infoData?.instancias}
                efficiency={globalEfficiencyData}
                isLoading={ec2Info.isLoading}
            />
            <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                <Ec2InstancesConsumeChartComponent
                    data={metricsData}
                />
            </div>
            <Ec2InstancesConsumeTableComponent
                data={infoData?.instancias || []}
            />
        </div>
    )
}
