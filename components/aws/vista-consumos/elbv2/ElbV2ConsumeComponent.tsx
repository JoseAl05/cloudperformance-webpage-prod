'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { ElbV2ConsumeChartsComponent } from '@/components/aws/vista-consumos/elbv2/graficos/ElbV2ConsumeChartsComponent';
import { ElbV2ConsumeCardsComponent } from '@/components/aws/vista-consumos/elbv2/info/ElbV2ConsumeCardsComponent';
import { ElbV2ConsumeTable } from '@/components/aws/vista-consumos/elbv2/table/ElbV2ConsumeTable';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { LoadbalancerV2CardsSummary, LoadbalancerV2Metrics, LoadbalancerV2MetricsSummary } from '@/interfaces/vista-consumos/elbV2ConsumeViewInterfaces';
import { AlertCircle, ChartBar, Clock, Info } from 'lucide-react';
import useSWR from 'swr';

interface ElbV2ConsumeComponentProps {
    startDate: Date;
    endDate: Date;
    region: string;
    elbV2: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0
const isNullish = (v: unknown) => v === null || v === undefined

export const ElbV2ConsumeComponent = ({ startDate, endDate, region, elbV2 }: ElbV2ConsumeComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const elbv2Metrics = useSWR(
        elbV2 ? `/api/aws/bridge/loadbalancersv2/load_balancersv2_metrics?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&elb_arn=${elbV2}` : null,
        fetcher
    )

    const elbv2MetricsSummary = useSWR(
        elbV2 ? `/api/aws/bridge/loadbalancersv2/load_balancersv2_usage_summary?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&elb_arn=${elbV2}` : null,
        fetcher
    )

    const elbv2CardsMetrics = useSWR(
        elbV2 ? `/api/aws/bridge/loadbalancersv2/cards/metrics_summary?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&elb_arn=${elbV2}` : null,
        fetcher
    )

    const anyLoading =
        elbv2Metrics.isLoading ||
        elbv2MetricsSummary.isLoading ||
        elbv2CardsMetrics.isLoading;



    const anyError =
        !!elbv2Metrics.error ||
        !!elbv2MetricsSummary.error ||
        !!elbv2CardsMetrics.error;

    const elbv2MetricsData: LoadbalancerV2Metrics[] | null =
        isNonEmptyArray<LoadbalancerV2Metrics>(elbv2Metrics.data) ? elbv2Metrics.data : null;

    const elbv2MetricsSummaryData: LoadbalancerV2MetricsSummary[] | null =
        isNonEmptyArray<LoadbalancerV2MetricsSummary>(elbv2MetricsSummary.data) ? elbv2MetricsSummary.data : null;

    const elbv2CardsData: LoadbalancerV2CardsSummary[] | null =
        isNonEmptyArray<LoadbalancerV2CardsSummary>(elbv2CardsMetrics.data) ? elbv2CardsMetrics.data : null;


    const hasData = !!elbv2MetricsData && elbv2MetricsData.length > 0;
    const hasSummaryData = (!!elbv2MetricsSummaryData && elbv2MetricsSummaryData.length > 0) || (!!elbv2CardsData && elbv2CardsData.length > 0);

    if (!elbV2) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ningún loadbalancer.</div>
            </div>
        )
    }

    if (anyLoading) {
        return <LoaderComponent />
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
    const noneHasData = !hasData && !hasSummaryData;

    if (noneHasData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos métricas ni información del/los loadbalancer/s en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }
    return (
        <>
            <div className='w-full min-w-0 px-4 py-6'>
                <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                    <ElbV2ConsumeCardsComponent
                        data={elbv2CardsData}
                    />
                </div>
                <div className="flex items-center gap-3 my-5">
                    <ChartBar className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Métricas</h1>
                </div>
                <ElbV2ConsumeChartsComponent
                    data={elbv2MetricsData}
                />
                <div className="flex items-center gap-3 my-10">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Detalle Loadbalancers</h1>
                </div>
                <ElbV2ConsumeTable
                    data={elbv2MetricsSummaryData}
                />
            </div>
        </>
    )
}