'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { ConsumeAppGwChartsComponent } from '@/components/azure/vista-consumo-apps-gateway/graficos/ConsumeAppGwChartsComponent';
import { ConsumoAppGwCardsComponent } from '@/components/azure/vista-consumo-apps-gateway/info/ConsumoAppGwCardsComponent';
import { ConsumoAppGwTable } from '@/components/azure/vista-consumo-apps-gateway/table/ConsumoAppGwTable';
import { LoaderComponent } from '@/components/general/LoaderComponent';
import { ConsumeViewAppGwApiResponse, ConsumeViewAppGwSummaryApiResponse } from '@/interfaces/vista-consumos/appGwConsumeViewInterface';
import { AlertCircle, BarChart3, ChartBar, Clock, Info, Layers } from 'lucide-react'; // Añadido icono Layers
import useSWR from 'swr';

interface ConsumoAppGwComponentProps {
    startDate: Date;
    endDate: Date;
    selectedAppg: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const ConsumoAppGwComponent = ({ startDate, endDate, selectedAppg }: ConsumoAppGwComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const consumeAppGMetrics = useSWR(
        selectedAppg ? `/api/azure/bridge/azure/apps_gateway/apps_gateway_metrics?date_from=${startDateFormatted}&date_to=${endDateFormatted}&appg=${selectedAppg}` : null,
        fetcher
    )
    const appgConsumeSummary = useSWR(
        selectedAppg ? `/api/azure/bridge/azure/apps_gateway/apps_gateway_usage_summary?date_from=${startDateFormatted}&date_to=${endDateFormatted}&appg=${selectedAppg}` : null,
        fetcher
    )

    const anyLoading = consumeAppGMetrics.isLoading || appgConsumeSummary.isLoading
    const anyError = !!consumeAppGMetrics.error || !!appgConsumeSummary.error;

    const metricsData: ConsumeViewAppGwApiResponse[] | null =
        isNonEmptyArray<ConsumeViewAppGwApiResponse[]>(consumeAppGMetrics.data) ? consumeAppGMetrics.data : null;
    const summaryData: ConsumeViewAppGwSummaryApiResponse[] | null =
        isNonEmptyArray<ConsumeViewAppGwSummaryApiResponse[]>(appgConsumeSummary.data) ? appgConsumeSummary.data : null;

    const hasAnyData = !!metricsData || !!summaryData;

    if (anyLoading) return <LoaderComponent />

    if (!selectedAppg) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ningún Application Gateway.</div>
            </div>
        )
    }

    if (anyError) {
        return (
            <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
                <MessageCard
                    icon={AlertCircle}
                    title="Error al cargar datos"
                    description="Ocurrió un problema al obtener la información consolidada. Intenta nuevamente."
                    tone="error"
                />
            </div>
        )
    }

    if (!hasAnyData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos métricas en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }

    return (
        <div className="w-full min-w-0 px-4 py-6">
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 my-5">
                    <Layers className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Resumen estado Application Gateway</h1>
                </div>
                <ConsumoAppGwCardsComponent data={metricsData} />
                <div className="flex items-center gap-3 my-5">
                    <ChartBar className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Métricas</h1>
                </div>
                <ConsumeAppGwChartsComponent data={metricsData} />
                <div className="flex items-center gap-3 my-5">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Detalle Applications Gateway</h1>
                </div>
                <ConsumoAppGwTable
                    data={summaryData}
                />
            </div>
        </div >
    )
}