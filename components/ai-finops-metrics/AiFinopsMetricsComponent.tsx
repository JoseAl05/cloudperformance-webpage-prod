'use client'

import { DetailedMetricsAnalysis } from '@/components/ai-finops-metrics/details/DetailedMetricsAnalysis';
import { GeneralStatus } from '@/components/ai-finops-metrics/general-status/GeneralStatus';
import { AnalyzedMetricsSummary } from '@/components/ai-finops-metrics/summary/AnalyzedMetricsSummary';
import { FinancialSummary } from '@/components/ai-finops-metrics/summary/FinancialSummary';
import { TechnicalSummary } from '@/components/ai-finops-metrics/summary/TechnicalSummary';
import { MessageCard } from '@/components/aws/cards/MessageCards';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { AiFinopsMetrics } from '@/interfaces/ai-finops-metrics/aiFinopsMetricsInterfaces'
import { AlertCircle, AtomIcon, Book, DollarSign, Info, ToolCase } from 'lucide-react';
import useSWR from 'swr';

interface AiFinopsMetricsComponentProps {
    startDate: Date;
    endDate: Date;
    cloud: string;
}


const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const AiFinopsMetricsComponent = ({ startDate, endDate, cloud }: AiFinopsMetricsComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    let url = '';

    switch (cloud) {
        case 'aws':
            url = '/api/aws/bridge/finops_metrics/get_finops_metrics';
            break;
        case 'azure':
            url = '/api/azure/bridge/azure/finops_metrics/get_finops_metrics';
            break;
        case 'gcp':
            url = '/api/gcp/bridge/gcp/finops_metrics/get_finops_metrics'
            break;
        default:
            break;
    }

    const allFinopsMetrics = useSWR(
        (startDateFormatted && endDateFormatted) ? `${url}?date_from=${startDateFormatted}&date_to=${endDateFormatted}` : null,
        fetcher
    )

    const finopsMetricsData: AiFinopsMetrics[] | null =
        isNonEmptyArray<AiFinopsMetrics>(allFinopsMetrics.data) ? allFinopsMetrics.data : null;

    const hasFinopsMetricsData = !!finopsMetricsData;

    const anyLoading =
        allFinopsMetrics.isLoading;


    const anyError =
        !!allFinopsMetrics.error;


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

    if (!hasFinopsMetricsData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos recomendaciones en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }

    const reportData = finopsMetricsData[0];

    return (
        <div className="w-full min-w-0 px-4 py-6">
            <div className="flex items-center gap-3 mb-6">
                <DollarSign className="h-7 w-7 text-blue-500" />
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Metricas FinOps</h1>
            </div>
            {/* SECCIÓN 1: RESUMEN FINANCIERO */}
            <div className='flex flex-col gap-5'>

                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Book className="h-6 w-6 text-blue-500" />
                        <h2 className="text-2xl font-semibold tracking-tight">Resumen Financiero</h2>
                    </div>
                    <FinancialSummary data={reportData} />
                </section>

                {/* SECCIÓN 2: RESUMEN TÉCNICO */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <ToolCase className="h-6 w-6 text-blue-500" />
                        <h2 className="text-2xl font-semibold tracking-tight">Resumen Técnico</h2>
                    </div>
                    <TechnicalSummary data={reportData} />
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <ToolCase className="h-6 w-6 text-blue-500" />
                        <h2 className="text-2xl font-semibold tracking-tight">Status General</h2>
                    </div>
                    <GeneralStatus data={reportData} />
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <AtomIcon className="h-6 w-6 text-blue-500" />
                        <h2 className="text-2xl font-semibold tracking-tight">Resumen Métricas Analizadas</h2>
                    </div>
                    <AnalyzedMetricsSummary data={reportData} />
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <AtomIcon className="h-6 w-6 text-blue-500" />
                        <h2 className="text-2xl font-semibold tracking-tight">Detalle Métricas Analizadas</h2>
                    </div>
                    <DetailedMetricsAnalysis data={reportData} />
                </section>
            </div>
        </div>
    )
}