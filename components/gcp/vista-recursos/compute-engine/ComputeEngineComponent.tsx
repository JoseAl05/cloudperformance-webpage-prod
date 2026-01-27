'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { ComputeEngineChartComponent } from '@/components/gcp/vista-recursos/compute-engine/grafico/ComputeEngineChartComponent';
import { ComputeEngineInfoComponent } from '@/components/gcp/vista-recursos/compute-engine/info/ComputeEngineInfoComponent';
import { ComputeEngineMetricsCardsComponent } from '@/components/gcp/vista-recursos/compute-engine/info/ComputeEngineMetricsCardsComponent';
import { ComputeEngineBillingTableComponent } from '@/components/gcp/vista-recursos/compute-engine/table/ComputeEngineBillingTableComponent';
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent';
import { ComputeEngineBilling, ComputeEngineInfoResponse, ComputeEngineMetrics } from '@/interfaces/vista-compute-engine/cEInterfaces';
import { AlertCircle, ChartBar, DollarSign, Info } from 'lucide-react';
import { useState } from 'react';
import useSWR from 'swr';

interface ComputeEngineComponentProps {
    startDate: Date
    endDate: Date
    resourceId: string
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const ComputeEngineComponent = ({
    startDate,
    endDate,
    resourceId

}: ComputeEngineComponentProps) => {

    const [currency, setCurrency] = useState<string>("original");

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const cEMetrics = useSWR(
        resourceId ? `/api/gcp/bridge/gcp/instancias_compute_engine/gcp-compute-instances_metrics?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance=${resourceId}` : null,
        fetcher
    )

    const cEInfo = useSWR(
        resourceId ? `/api/gcp/bridge/gcp/instancias_compute_engine/gcp-compute-instances?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance=${resourceId}` : null,
        fetcher
    )

    const cEBilling = useSWR(
        resourceId ? `/api/gcp/bridge/gcp/instancias_compute_engine/gcp-compute-instances_billing?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance=${resourceId}` : null,
        fetcher
    )

    const anyLoading =
        cEMetrics.isLoading ||
        cEInfo.isLoading ||
        cEBilling.isLoading


    const anyError =
        !!cEMetrics.error ||
        !!cEInfo.error ||
        !!cEBilling.error


    const metricsData: ComputeEngineMetrics[] | null =
        isNonEmptyArray<ComputeEngineMetrics>(cEMetrics.data) ? cEMetrics.data : null;

    const infoData: ComputeEngineInfoResponse[] | null =
        isNonEmptyArray<ComputeEngineInfoResponse>(cEInfo.data) ? cEInfo.data : null;

    const billingData: ComputeEngineBilling[] | null =
        isNonEmptyArray<ComputeEngineBilling>(cEBilling.data) ? cEBilling.data : null;

    const hasMetricsData = !!metricsData && metricsData.length > 0
    const hasInfoData = !!infoData && infoData.length > 0
    const hasBillingData = !!billingData && billingData.length > 0


    if (anyLoading) {
        return <LoaderComponent />
    }

    if (!resourceId) {
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

    const noneHasData = !hasMetricsData && !hasInfoData && !hasBillingData;
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
        <>
            <div className='w-full min-w-0 px-4 py-6'>
                <div className='flex flex-col xl:flex-row gap-8 min-w-0'>
                    <div className='w-full xl:max-w-sm min-w-0'>
                        <ComputeEngineInfoComponent data={infoData} />
                    </div>
                    <div className='flex-1 space-y-6 min-w-0 overflow-hidden'>
                        <ComputeEngineMetricsCardsComponent data={metricsData} />
                    </div>
                </div>
                <div className='flex flex-col gap-5 mt-10'>
                    <div className="flex items-center gap-3 my-5">
                        <ChartBar className="h-8 w-8 text-blue-500" />
                        <h1 className="text-3xl font-bold text-foreground">Métricas de la Instancia</h1>
                    </div>
                    <ComputeEngineChartComponent
                        data={metricsData}
                    />
                </div>
                <div className='flex flex-col gap-5 mt-10'>
                    <div className="flex items-center gap-3 my-10">
                        <DollarSign className="h-8 w-8 text-blue-500" />
                        <h1 className="text-3xl font-bold text-foreground">Facturación de la Instancia</h1>
                    </div>
                    <ComputeEngineBillingTableComponent
                        data={billingData}
                    />
                </div>
            </div>
        </>
    )
}