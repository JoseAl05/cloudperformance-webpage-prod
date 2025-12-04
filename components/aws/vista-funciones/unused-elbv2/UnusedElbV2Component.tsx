'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { UnusedElbV2CardsComponent } from '@/components/aws/vista-funciones/unused-elbv2/info/UnusedElbV2CardsComponent';
import { UnusedElbV2Table } from '@/components/aws/vista-funciones/unused-elbv2/table/UnusedElbV2Table';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { UnusedElbV2 } from '@/interfaces/vista-unused-resources/unusedElbV2Interfaces';
import { AlertCircle, Clock, Info } from 'lucide-react';
import useSWR from 'swr';

interface UnusedElbV2ComponentProps {
    startDate: Date;
    endDate: Date;
    region: string;
    unusedElbV2: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0
const isNullish = (v: unknown) => v === null || v === undefined

export const UnusedElbV2Component = ({ startDate, endDate, region, unusedElbV2 }: UnusedElbV2ComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const allUnusedElbV2 = useSWR(
        unusedElbV2 ? `/api/aws/bridge/loadbalancersv2/get_unused_load_balancersv2?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&elb_arn=${unusedElbV2}` : null,
        fetcher
    )

    const anyLoading =
        allUnusedElbV2.isLoading


    const anyError =
        !!allUnusedElbV2.error

    const allUnusedElbV2Data: UnusedElbV2[] | null =
        isNonEmptyArray<UnusedElbV2>(allUnusedElbV2.data) ? allUnusedElbV2.data : null;

    const hasUnusedData = !!allUnusedElbV2Data && allUnusedElbV2Data.length > 0;

    if (!unusedElbV2) {
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
    const noneHasData = !hasUnusedData;

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

    const mainData = allUnusedElbV2Data ? allUnusedElbV2Data[0] : null;
    const detailsList = mainData ? mainData.details : [];
    const globalMetrics = mainData ? mainData.diagnosis.metrics_summary : undefined;

    return (
        <>
            <div className='w-full min-w-0 px-4 py-6'>
                <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                    <UnusedElbV2CardsComponent
                        data={allUnusedElbV2Data}
                    />
                </div>
                <div className="flex items-center gap-3 my-10">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Detalle Loadbalancers no utilizados</h1>
                </div>
                <UnusedElbV2Table
                    data={detailsList}
                    globalMetrics={globalMetrics}
                    dateFrom={startDateFormatted}
                    dateTo={endDateFormatted}
                />
            </div>
        </>
    )
}