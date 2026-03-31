'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { CloudSqlChartComponent } from '@/components/gcp/vista-recursos/cloudsql/grafico/CloudSqlChartComponent';
import { CloudSqlInfoComponent } from '@/components/gcp/vista-recursos/cloudsql/info/CloudSqlInfoComponent';
import { CloudSqlMetricsCardComponent } from '@/components/gcp/vista-recursos/cloudsql/info/CloudSqlMetricsCardComponent';
import { CloudSqlBillingTableComponent } from '@/components/gcp/vista-recursos/cloudsql/table/CloudSqlBillingTableComponent';
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent';
import { CloudSqlBilling, CloudSqlInfo, CloudSqlMetrics } from '@/interfaces/vista-cloudsql/cSqlInterfaces';
import { AlertCircle, ChartBar, DollarSign, Info } from 'lucide-react';
import useSWR from 'swr';

interface CloudSqlComponentProps {
    startDate: Date;
    endDate: Date;
    resourceId: string;
    dbEngine: string;
    tagKey: string;
    tagValue: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const CloudSqlComponent = ({
    startDate,
    endDate,
    resourceId,
    tagKey,    
    tagValue   
}: CloudSqlComponentProps) => {

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const params = new URLSearchParams();
    
    if (startDateFormatted) params.append('date_from', startDateFormatted);
    if (endDateFormatted) params.append('date_to', endDateFormatted);
    
    params.append('instance', resourceId || 'all');

    if (tagKey) params.append('tagKey', tagKey);
    if (tagValue) params.append('tagValue', tagValue);

    const queryString = params.toString();

    const shouldFetch = !!resourceId || (!!tagKey && tagKey !== 'allKeys');

    const cSqlMetrics = useSWR(
        shouldFetch ? `/api/gcp/bridge/gcp/instancias_cloud_sql/gcp-cloudsql-instances_metrics?${queryString}` : null,
        fetcher
    )

    const cSqlInfo = useSWR(
        shouldFetch ? `/api/gcp/bridge/gcp/instancias_cloud_sql/gcp-cloudsql-instances?${queryString}` : null,
        fetcher
    )

    const cSqlBilling = useSWR(
        shouldFetch ? `/api/gcp/bridge/gcp/instancias_cloud_sql/gcp-cloudsql-instances_billing?${queryString}` : null,
        fetcher
    )

    const anyLoading =
        cSqlMetrics.isLoading ||
        cSqlInfo.isLoading ||
        cSqlBilling.isLoading

    const anyError =
        !!cSqlMetrics.error ||
        !!cSqlInfo.error ||
        !!cSqlBilling.error

    const metricsData: CloudSqlMetrics[] | null =
        isNonEmptyArray<CloudSqlMetrics>(cSqlMetrics.data) ? cSqlMetrics.data : null;

    const infoData: CloudSqlInfo[] | null =
        isNonEmptyArray<CloudSqlInfo>(cSqlInfo.data) ? cSqlInfo.data : null;

    const billingData: CloudSqlBilling[] | null =
        isNonEmptyArray<CloudSqlBilling>(cSqlBilling.data) ? cSqlBilling.data : null;

    const hasMetricsData = !!metricsData && metricsData.length > 0
    const hasInfoData = !!infoData && infoData.length > 0
    const hasBillingData = !!billingData && billingData.length > 0

    if (!resourceId && (!tagKey || tagKey === 'allKeys')) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado ninguna instancia.</div>
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

    const noneHasData = !hasMetricsData && !hasInfoData && !hasBillingData;
    if (noneHasData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos métricas ni información de la instancia con los filtros seleccionados."
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
                        <CloudSqlInfoComponent
                            data={infoData}
                        />
                    </div>
                    <div className='flex-1 space-y-6 min-w-0 overflow-hidden'>
                        <CloudSqlMetricsCardComponent
                            data={metricsData}
                        />
                    </div>
                </div>
                <div className='flex flex-col gap-5 mt-10'>
                    <div className="flex items-center gap-3 my-5">
                        <ChartBar className="h-8 w-8 text-blue-500" />
                        <h1 className="text-3xl font-bold text-foreground">Métricas de la Instancia</h1>
                    </div>
                    <CloudSqlChartComponent
                        data={metricsData}
                    />
                </div>
                <div className='flex flex-col gap-5 mt-10'>
                    <div className="flex items-center gap-3 my-10">
                        <DollarSign className="h-8 w-8 text-blue-500" />
                        <h1 className="text-3xl font-bold text-foreground">Facturación de la Instancia</h1>
                    </div>
                    <CloudSqlBillingTableComponent
                        data={billingData}
                    />
                </div>
            </div>
        </>
    )
}