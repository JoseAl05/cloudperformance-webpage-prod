'use client'

import useSWR from 'swr';
import { AlertCircle, ChartBar, Clock, Info } from 'lucide-react';
import { Ec2ResourceConsumeViewUsageCpuComponent } from '@/components/aws/vista-consumos/ec2/graficos/Ec2ResourceConsumeViewUsageCpuComponent';
import { Ec2ResourceConsumeViewUsageCreditsComponent } from '@/components/aws/vista-consumos/ec2/graficos/Ec2ResourceConsumeViewUsageCreditsComponent';
import { Ec2InfoConsumeViewComponent } from '@/components/aws/vista-consumos/ec2/info/Ec2InfoConsumeViewComponent';
import { Ec2ConsumeViewInstanceTable } from '@/components/aws/vista-consumos/ec2/table/Ec2ConsumeViewInstanceTable';
import { MessageCard } from '@/components/aws/cards/MessageCards';
import { LoaderComponent } from '@/components/general/LoaderComponent';

interface AsgConsumeComponentProps {
    startDate: Date,
    endDate: Date,
    instance: string,
    region: string
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0
const isNullish = (v: unknown) => v === null || v === undefined

export const AsgConsumeComponent = ({ startDate, endDate, instance, region }: AsgConsumeComponentProps) => {
    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const canFetch = !!instance

    const ec2CpuMetrics = useSWR(
        canFetch ? `/api/bridge/vm/consumo_ec2/cpu_usage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${encodeURIComponent(instance)}` : null,
        fetcher
    )
    const ec2CreditsMetrics = useSWR(
        canFetch ? `/api/bridge/vm/consumo_ec2/credits_usage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${encodeURIComponent(instance)}` : null,
        fetcher
    )
    const ec2Info = useSWR(
        canFetch ? `/api/bridge/vm/consumo_ec2/info?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${encodeURIComponent(instance)}` : null,
        fetcher
    )
    const ec2GlobalCreditsEfficiency = useSWR(
        canFetch ? `/api/bridge/vm/consumo_ec2/global_credits_efficiency?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${encodeURIComponent(instance)}` : null,
        fetcher
    )

    const anyLoading =
        ec2CpuMetrics.isLoading ||
        ec2CreditsMetrics.isLoading ||
        ec2Info.isLoading ||
        ec2GlobalCreditsEfficiency.isLoading

    const anyError =
        !!ec2CpuMetrics.error ||
        !!ec2CreditsMetrics.error ||
        !!ec2Info.error ||
        !!ec2GlobalCreditsEfficiency.error

    const cpuMetricsData: ConsumeViewEc2CpuMetrics[] | null =
        isNonEmptyArray<ConsumeViewEc2CpuMetrics>(ec2CpuMetrics.data) ? ec2CpuMetrics.data : null

    const creditsMetricsData: ConsumeViewEc2CreditsMetrics[] | null =
        isNonEmptyArray<ConsumeViewEc2CreditsMetrics>(ec2CreditsMetrics.data) ? ec2CreditsMetrics.data : null

    const infoData: Ec2ConsumneViewInstance[] | null =
        isNonEmptyArray<Ec2ConsumneViewInstance>(ec2Info.data) ? ec2Info.data : null

    const globalEfficiencyData: unknown = isNullish(ec2GlobalCreditsEfficiency.data)
        ? null
        : ec2GlobalCreditsEfficiency.data

    const hasCpuData = !!cpuMetricsData && cpuMetricsData.length > 0
    const hasCreditsData = !!creditsMetricsData && creditsMetricsData.length > 0
    const hasInfoData = !!infoData && infoData.length > 0

    if (!canFetch) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <div className="text-center text-gray-500 text-lg font-medium">
                    No hay datos para los filtros actuales. Ajusta región/tags/ASG/instancia.
                </div>
            </div>
        )
    }
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

    const noneHasData = !hasCpuData && !hasCreditsData && !hasInfoData
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
                <Ec2InfoConsumeViewComponent
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

                <Ec2ResourceConsumeViewUsageCreditsComponent data={creditsMetricsData} />
                <Ec2ResourceConsumeViewUsageCpuComponent data={cpuMetricsData} />
            </div>
            <div className="flex flex-col gap-5 mt-10">
                <div className="flex items-center gap-3 my-5">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Detalle Instancias</h1>
                </div>
                <Ec2ConsumeViewInstanceTable
                    data={infoData}
                    startDate={startDate}
                    endDate={endDate}
                    instance={instance}
                    enableGrouping
                />
            </div>
        </div>
    )
}
