'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { NatGatewaysConsumeChartsComponent } from '@/components/aws/vista-consumos/nat-gateways/graficos/NatGatewaysConsumeChartsComponent';
import { NatGatewaysConsumeCardsComponent } from '@/components/aws/vista-consumos/nat-gateways/info/NatGatewaysConsumeCardsComponent';
import { NatGatewaysConsumeTable } from '@/components/aws/vista-consumos/nat-gateways/table/NatGatewaysConsumeTable';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { NatGatewayCardsSummary, NatGatewayConsumeGlobalEfficiency, NatGatewayConsumeInfo, NatGatewayConsumeMetrics } from '@/interfaces/vista-consumos/natGwConsumeViewInterfaces';
import { AlertCircle, ChartBar, Clock, Info } from 'lucide-react';
import useSWR from 'swr';
import { is } from 'zod/v4/locales';

interface NatGatewaysConsumeComponentProps {
    startDate: Date;
    endDate: Date;
    region: string;
    instance: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0;
const isNullish = (v: unknown) => v === null || v === undefined

export const NatGatewaysConsumeComponent = ({ startDate, endDate, region, instance }: NatGatewaysConsumeComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const natGwMetrics = useSWR(
        instance ? `/api/aws/bridge/nat_gateways/consumo_nat_gateways?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}` : null,
        fetcher
    );

    const natGwInfo = useSWR(
        instance ? `/api/aws/bridge/nat_gateways/info?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resource=${instance}` : null,
        fetcher
    );

    const natGwGlobalEfficiency = useSWR(
        instance ? `/api/aws/bridge/nat_gateways/global_efficiency?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource=${instance}` : null,
        fetcher
    );

    const anyLoading = natGwMetrics.isLoading || natGwInfo.isLoading || natGwGlobalEfficiency.isLoading;
    const anyError = !!natGwMetrics.error || !!natGwInfo.error || !!natGwGlobalEfficiency.error;

    const natGwMetricsData: NatGatewayConsumeMetrics[] | null = isNonEmptyArray<NatGatewayConsumeMetrics[]>(natGwMetrics.data) ? natGwMetrics.data : null;
    const natGwInfoData: NatGatewayConsumeInfo | null = isNullish(natGwInfo.data) ? null : natGwInfo.data;
    const globalEfficiencyData: NatGatewayConsumeGlobalEfficiency | null = isNullish(natGwGlobalEfficiency.data) ? null : natGwGlobalEfficiency.data;

    const hasData = !!natGwMetricsData || !!natGwInfoData || !!globalEfficiencyData;

    if (!instance) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ningún NAT Gateway.</div>
            </div>
        );
    }

    if (anyLoading) return <LoaderComponent />;

    if (anyError) {
        return (
            <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
                <MessageCard
                    icon={AlertCircle}
                    title="Error al cargar datos"
                    description="Ocurrió un problema al obtener la información desde la API."
                    tone="error"
                />
            </div>
        );
    }

    if (!hasData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos métricas en el rango seleccionado."
                    tone="warn"
                />
            </div>
        );
    }

    return (
        <div className='w-full min-w-0 px-4 py-6'>
            <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                <NatGatewaysConsumeCardsComponent
                    summary={natGwInfoData?.resumen}
                    instancias={natGwInfoData?.nat_gateways}
                    efficiency={globalEfficiencyData}
                    isLoading={natGwInfo.isLoading}
                />
            </div>
            <div className="flex items-center gap-3 my-5">
                <ChartBar className="h-8 w-8 text-blue-500" />
                <h1 className="text-3xl font-bold text-foreground">Métricas</h1>
            </div>
            <NatGatewaysConsumeChartsComponent data={natGwMetricsData || []} />
            <div className="flex items-center gap-3 my-10">
                <Clock className="h-8 w-8 text-blue-500" />
                <h1 className="text-3xl font-bold text-foreground">Detalle Nat Gateways</h1>
            </div>
            <NatGatewaysConsumeTable data={natGwInfoData?.nat_gateways} />
        </div>
    );
}