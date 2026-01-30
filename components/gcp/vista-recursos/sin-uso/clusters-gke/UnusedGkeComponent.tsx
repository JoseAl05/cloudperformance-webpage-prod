'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { UnusedCeCardsComponent } from '@/components/gcp/vista-recursos/sin-uso/compute-engine/info/UnusedCeCardsComponent';
import { UnusedCeTableComponent } from '@/components/gcp/vista-recursos/sin-uso/compute-engine/table/UnusedCeTableComponent';
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent';
import { UnusedCeCardsMetricSummary, UnusedCeTableData } from '@/interfaces/vista-unused-resources/unusedComputeEngineInterfaces';
import { AlertCircle, Clock, Info } from 'lucide-react';
import useSWR from 'swr';

interface UnusedGkeComponentProps {
    startDate: Date;
    endDate: Date;
    resourceId: string;
    regions: string;
    projects: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const UnusedGkeComponent = ({ startDate, endDate, regions, projects, resourceId }: UnusedGkeComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const allUnusedGkeCeTable = useSWR(
        resourceId ? `/api/gcp/bridge/gcp/recursos_sin_uso/get_gke_ce_table_data?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${regions}&resource=${resourceId}&project_id=${projects}` : null,
        fetcher
    )
    const allUnusedGkeCeCards = useSWR(
        resourceId ? `/api/gcp/bridge/gcp/recursos_sin_uso/cards_gke_nodes_metrics_summary?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${regions}&resource=${resourceId}&project_id=${projects}` : null,
        fetcher
    )

    const unusedCeTableData: UnusedCeTableData[] | null =
        isNonEmptyArray<UnusedCeTableData>(allUnusedGkeCeTable.data) ? allUnusedGkeCeTable.data : null;

    const unusedCeCardsData: UnusedCeCardsMetricSummary[] | null =
        isNonEmptyArray<UnusedCeCardsMetricSummary>(allUnusedGkeCeCards.data) ? allUnusedGkeCeCards.data : null;

    const hasUnusedData = !!unusedCeTableData || !!unusedCeCardsData;

    const anyLoading =
        allUnusedGkeCeCards.isLoading ||
        allUnusedGkeCeTable.isLoading


    const anyError =
        !!allUnusedGkeCeCards.error ||
        !!allUnusedGkeCeTable.error

    if (!resourceId) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ningúna instancia.</div>
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

    if (!hasUnusedData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos instancias EC2 infrautilizadas en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }
    const instanceCount = unusedCeTableData?.length;
    const totalUsdUnusedInstances = unusedCeTableData.reduce((acc, curr) => acc + curr.billing.total_cost_usd, 0)

    return (
        <>
            <div className='w-full min-w-0 px-4 py-6'>
                <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                    <UnusedCeCardsComponent
                        data={unusedCeCardsData}
                        instanceCount={instanceCount}
                        totalUsdUnusedInstances={totalUsdUnusedInstances}
                    />
                </div>

                <div className="flex items-center gap-3 my-10">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Detalle instancias de Instance Groups infrautilizadas</h1>
                </div>
                <UnusedCeTableComponent
                    data={unusedCeTableData}
                />
            </div>
        </>
    )
}