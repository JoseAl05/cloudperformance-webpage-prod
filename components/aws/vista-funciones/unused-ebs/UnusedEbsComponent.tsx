'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { UnusedEbsCardsComponent } from '@/components/aws/vista-funciones/unused-ebs/info/UnusedEbsCardsComponent';
import { UnusedEbsTableComponent } from '@/components/aws/vista-funciones/unused-ebs/table/UnusedEbsTableComponent';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { UnusedEbsCardsMetricSummary, UnusedEbsTableData } from '@/interfaces/vista-unused-resources/unusedEbsResourcesInterfaces';
import { AlertCircle, Clock, Info } from 'lucide-react';
import useSWR from 'swr';

interface UnusedEbsComponentProps {
    startDate: Date;
    endDate: Date;
    instance: string;
    region: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const UnusedEbsComponent = ({ startDate, endDate, instance, region }: UnusedEbsComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const allUnusedEbsTable = useSWR(
        instance ? `/api/aws/bridge/unused/ebs/get_ebs_table_data?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&volume_id=${instance}` : null,
        fetcher
    )
    const allUnusedEbsCards = useSWR(
        instance ? `/api/aws/bridge/unused/ebs/cards_metrics_summary?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&volume_id=${instance}` : null,
        fetcher
    )

    const unusedEbsTableData: UnusedEbsTableData[] | null =
        isNonEmptyArray<UnusedEbsTableData>(allUnusedEbsTable.data) ? allUnusedEbsTable.data : null;

    const unusedEbsCardsData: UnusedEbsCardsMetricSummary[] | null =
        isNonEmptyArray<UnusedEbsCardsMetricSummary>(allUnusedEbsCards.data) ? allUnusedEbsCards.data : null;

    const hasUnusedData = !!unusedEbsTableData || !!unusedEbsCardsData;

    const anyLoading =
        allUnusedEbsTable.isLoading ||
        allUnusedEbsCards.isLoading;

    const anyError =
        !!allUnusedEbsTable.error ||
        !!allUnusedEbsCards.error;

    if (!instance) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ningún volúmen EBS.</div>
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
                    description="No encontramos volúmenes EBS no utilizados en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }

    const volumeCount = unusedEbsTableData?.length;
    const totalUsdUnusedVolumes = unusedEbsTableData.reduce((acc, curr) => acc + curr.billing.total_cost_usd, 0);

    return (
        <>
            <div className='w-full min-w-0 px-4 py-6'>
                <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                    <UnusedEbsCardsComponent
                        data={unusedEbsCardsData}
                        volumeCount={volumeCount}
                        totalUsdUnusedVolumes={totalUsdUnusedVolumes}
                    />
                </div>

                <div className="flex items-center gap-3 my-10">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Detalle Volúmenes EBS No Utilizados</h1>
                </div>
                <UnusedEbsTableComponent
                    data={unusedEbsTableData}
                />
            </div>
        </>
    )
}