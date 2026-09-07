'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent';
import { AlertCircle, ChartBar, DollarSign, Info } from 'lucide-react';
import useSWR from 'swr';
import { ComputeEngineMetricsCardsComponent } from '@/components/gcp/vista-recursos/compute-engine/info/ComputeEngineMetricsCardsComponent';
import { ComputeEngineChartComponent } from '@/components/gcp/vista-recursos/compute-engine/grafico/ComputeEngineChartComponent';
import { AzurePostgresBillingTableComponent } from '@/components/azure/vista-recursos-postgresql/table/AzurePostgresBillingTableComponent';
import { AzurePostgresInfoComponent, AzurePostgresData } from './AzurePostgresInfoComponent';
import { ComputeEngineBilling, ComputeEngineMetrics } from '@/interfaces/vista-compute-engine/cEInterfaces';

interface AzurePostgresResourceComponentProps {
    startDate: Date;
    endDate: Date;
    selectedInstanceV2: string;
    subscription?: string;
}

const fetcher = (url: string) => fetch(url).then(r => r.json());
const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0;

export const AzurePostgresResourceComponent = ({ startDate, endDate, selectedInstanceV2 }: AzurePostgresResourceComponentProps) => {

    const startDateFormatted = startDate.toISOString().slice(0, 19);
    const endDateFormatted = endDate.toISOString().slice(0, 19);
    
    const shouldFetch = selectedInstanceV2 && selectedInstanceV2 !== 'all_instances';

    const postgresInfo = useSWR(
        shouldFetch ? `/api/azure/bridge/azure/recursos/db/azure-postgres-info?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance=${selectedInstanceV2}` : null,
        fetcher
    );

    const postgresMetrics = useSWR(
        shouldFetch ? `/api/azure/bridge/azure/recursos/db/azure-postgres-metrics?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance=${selectedInstanceV2}` : null,
        fetcher
    );

    const postgresBilling = useSWR(
        shouldFetch ? `/api/azure/bridge/azure/recursos/db/azure-postgres-billing?date_from=${startDateFormatted}&date_to=${endDateFormatted}&instance=${selectedInstanceV2}` : null,
        fetcher
    );

    const anyLoading = postgresInfo.isLoading || postgresMetrics.isLoading || postgresBilling.isLoading;
    const anyError = !!postgresInfo.error || !!postgresMetrics.error || !!postgresBilling.error;

    const infoData = isNonEmptyArray<AzurePostgresData>(postgresInfo.data) ? postgresInfo.data : null;
    const metricsData = isNonEmptyArray<ComputeEngineMetrics>(postgresMetrics.data) ? postgresMetrics.data : null;
    const billingData = isNonEmptyArray<ComputeEngineBilling>(postgresBilling.data) ? postgresBilling.data : null;

    if (!shouldFetch) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">
                    Selecciona una base de datos PostgreSQL en los filtros para ver su detalle.
                </div>
            </div>
        );
    }

    if (anyLoading) return <LoaderComponent />;

    if (anyError) {
        return (
            <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
                <MessageCard icon={AlertCircle} title="Error de conexión" description="No se pudieron cargar los datos de PostgreSQL." tone="error" />
            </div>
        );
    }

    if (!infoData && !metricsData && !billingData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard icon={Info} title="Sin datos" description="No hay métricas para esta base de datos en el rango seleccionado." tone="warn" />
            </div>
        );
    }

    return (
        <div className='w-full min-w-0 px-4 py-6'>
            <div className='flex flex-col xl:flex-row gap-8 min-w-0'>
                <div className='w-full xl:max-w-sm min-w-0'>
                    <AzurePostgresInfoComponent data={infoData} />
                </div>
                <div className='flex-1 space-y-6 min-w-0 overflow-hidden'>
                    <ComputeEngineMetricsCardsComponent data={metricsData || []} />
                </div>
            </div>
            <div className='flex flex-col gap-5 mt-10'>
                <div className="flex items-center gap-3 my-5">
                    <ChartBar className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Evolución de Rendimiento</h1>
                </div>
                <ComputeEngineChartComponent data={metricsData || []} />
            </div>
            <div className='flex flex-col gap-5 mt-10'>
                <div className="flex items-center gap-3 my-10">
                    <DollarSign className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-foreground">Desglose de Costos (PostgreSQL)</h1>
                </div>
                <AzurePostgresBillingTableComponent data={billingData || []} />
            </div>
        </div>
    );
}