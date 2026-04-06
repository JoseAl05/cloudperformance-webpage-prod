'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { UnusedNatGatewaysCardsComponent } from '@/components/aws/vista-funciones/unused-nat-gateways/info/UnusedNatGatewaysCardsComponent';
import { UnusedNatGatewaysTable } from '@/components/aws/vista-funciones/unused-nat-gateways/table/UnusedNatGatewaysTable';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { AsociatedResourcesNatGw } from '@/interfaces/vista-unused-resources/asociatedNatGwResourcesInterfaces';
import { UnusedNatGateways } from '@/interfaces/vista-unused-resources/unusedNatGatewaysInterfaces';
import { UnusedNatGatewaysMetrics } from '@/interfaces/vista-unused-resources/unusedNatGwMetricsInterfaces';
import { AlertCircle, ChartBar, Clock, Info, Wallet } from 'lucide-react';
import useSWR from 'swr';

interface UnusedNatGatewaysComponentProps {
    startDate: Date;
    endDate: Date;
    region: string;
    unusedNatGateway: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0
const isNullish = (v: unknown) => v === null || v === undefined

export const UnusedNatGatewaysComponent = ({ startDate, endDate, region, unusedNatGateway }: UnusedNatGatewaysComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const unusedNatGw = useSWR(
        unusedNatGateway ? `/api/aws/bridge/nat_gateways/get_unused_nat_gateways?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&nat_gw_id=${unusedNatGateway}` : null,
        fetcher
    )


    const anyLoading =
        unusedNatGw.isLoading


    const anyError =
        !!unusedNatGw.error

    const unusedNatGwData: UnusedNatGateways[] | null =
        isNonEmptyArray<UnusedNatGateways>(unusedNatGw.data) ? unusedNatGw.data : null;

    const hasUnusedData = !!unusedNatGwData && unusedNatGwData.length > 0;

    if (!unusedNatGateway) {
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
    const noneHasData = !hasUnusedData;

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
    console.log(unusedNatGwData)
    return (
        <>
            <div className='w-full min-w-0 px-4 py-6'>
                <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                    <UnusedNatGatewaysCardsComponent
                        data={unusedNatGwData}
                    />
                </div>
                <div className="flex items-center gap-3 my-10">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Detalle Nat Gateways no utilizados</h1>
                </div>
                <UnusedNatGatewaysTable
                    data={unusedNatGwData}
                    dateFrom={startDateFormatted}
                    dateTo={endDateFormatted}
                />
            </div>
        </>
    )
}