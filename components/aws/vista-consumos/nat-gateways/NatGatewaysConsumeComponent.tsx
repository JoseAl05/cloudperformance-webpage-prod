'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { NatGatewaysConsumeChartsComponent } from '@/components/aws/vista-consumos/nat-gateways/graficos/NatGatewaysConsumeChartsComponent';
import { UnusedNatGatewaysCardsComponent } from '@/components/aws/vista-funciones/unused-nat-gateways/info/UnusedNatGatewaysCardsComponent';
import { UnusedNatGatewaysTable } from '@/components/aws/vista-funciones/unused-nat-gateways/table/UnusedNatGatewaysTable';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { NatGatewayMetrics } from '@/interfaces/vista-consumos/natGwConsumeViewInterfaces';
import { UnusedNatGatewaysMetrics } from '@/interfaces/vista-unused-resources/unusedNatGwMetricsInterfaces';
import { AlertCircle, ChartBar, Clock, Info } from 'lucide-react';
import useSWR from 'swr';

interface NatGatewaysConsumeComponentProps {
    startDate: Date;
    endDate: Date;
    region: string;
    natGateway: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0
const isNullish = (v: unknown) => v === null || v === undefined

export const NatGatewaysConsumeComponent = ({ startDate, endDate, region, natGateway }: NatGatewaysConsumeComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const natGwMetrics = useSWR(
        natGateway ? `/api/aws/bridge/nat_gateways/nat_gateways_metrics?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&nat_gw_id=${natGateway}` : null,
        fetcher
    )

    const anyLoading =
        natGwMetrics.isLoading;


    const anyError =
        !!natGwMetrics.error;


    const natGwMetricsData: NatGatewayMetrics[] | null =
        isNonEmptyArray<NatGatewayMetrics>(natGwMetrics.data) ? natGwMetrics.data : null;

    const hasData = !!natGwMetricsData && natGwMetricsData.length > 0;

    if (!natGateway) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ningún nat gateway.</div>
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
    const noneHasData = !hasData;

    if (noneHasData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos métricas ni información del/los nat gateway/s en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }
    return (
        <>
            <div className='w-full min-w-0 px-4 py-6'>
                <div className="flex-1 space-y-6 min-w-0 overflow-hidden">

                </div>
                <div className="flex items-center gap-3 my-5">
                    <ChartBar className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Métricas</h1>
                </div>
                <NatGatewaysConsumeChartsComponent
                    data={natGwMetricsData}
                />
                <div className="flex items-center gap-3 my-10">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Detalle Nat Gateways</h1>
                </div>

            </div>
        </>
    )
}