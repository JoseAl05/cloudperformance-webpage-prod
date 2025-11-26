'use client'

import { MessageCard } from '@/components/aws/cards/MessageCards';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { TrafficManagerDataApiResponse, TrafficManagerDataHistory } from '@/interfaces/vista-traffic-manager/trafficManagerInterfaces';
import { AlertCircle, Clock, Info, Layers } from 'lucide-react';
import useSWR from 'swr';
import { RecursosTrafficManagerCardsComponent } from '@/components/azure/vista-recursos-tm/info/RecursosTrafficManagerCardsComponent';
import { RecursosTrafficManagerTable } from '@/components/azure/vista-recursos-tm/table/RecursosTrafficManagerTable';
import { TmAvgQueriesReturnedApiResponse } from '@/interfaces/vista-traffic-manager/trafficManagerAvgQueriesReturnedInterfaces';

interface RecursosTrafficManagerComponentProps {
    startDate: Date;
    endDate: Date;
    selectedTm: string;
    subscription: string;
    region: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

export const RecursosTrafficManagerComponent = ({ startDate, endDate, selectedTm, subscription, region }: RecursosTrafficManagerComponentProps) => {

    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const tmDataApiResponse = useSWR(
        selectedTm ? `/api/azure/bridge/azure/traffic_managers/traffic_manager_data?date_from=${startDateFormatted}&date_to=${endDateFormatted}&location=${region}&subscription_id=${subscription}&tm_profile=${selectedTm}` : null,
        fetcher
    )
    const tmAvgQueriesReturnedApiResponse = useSWR(
        selectedTm ? `/api/azure/bridge/azure/traffic_managers/avg_query_returned_by_profile?date_from=${startDateFormatted}&date_to=${endDateFormatted}&location=${region}&tm_profile=${selectedTm}` : null,
        fetcher
    )

    const tmData: TrafficManagerDataApiResponse[] | null =
        isNonEmptyArray<TrafficManagerDataApiResponse>(tmDataApiResponse.data) ? tmDataApiResponse.data : null;
    const metricsMap = new Map<string, number>();
    if (isNonEmptyArray<TmAvgQueriesReturnedApiResponse>(tmAvgQueriesReturnedApiResponse.data)) {
        tmAvgQueriesReturnedApiResponse.data.forEach(m => {
            metricsMap.set(m.sync_time, m.avg_queries_returned);
        });
    }

    const anyLoading = tmDataApiResponse.isLoading || tmAvgQueriesReturnedApiResponse.isLoading;
    const anyError = !!tmDataApiResponse.error || !!tmAvgQueriesReturnedApiResponse.error;
    const hasTmData = !!tmData && tmData.length > 0;
    // const hasTmAvgQueriesReturnedData = !!tmAvgQueriesReturned && tmAvgQueriesReturned.length > 0;
    // const anyData = hasTmData || hasTmAvgQueriesReturnedData;


    const hasSelectedTmData = !!selectedTm && selectedTm.length > 0;

    if (anyLoading) return <LoaderComponent />

    if (!hasSelectedTmData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Traffic Manager no seleccionado"
                    description="Seleccione un traffic manager para ver su análisis de costos y uso."
                    tone="info"
                />
            </div>
        )
    }

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
        )
    }

    if (!hasTmData) {
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

    const selectedProfileData = tmData[0];
    const rawHistory = selectedProfileData.history || [];

    const enrichedHistory: TrafficManagerDataHistory[] = rawHistory.map(record => {
        const metricValue = metricsMap.get(record._cq_sync_time);
        return {
            ...record,
            avg_queries_returned: metricValue !== undefined ? metricValue : null
        };
    });

    const latestRecord = enrichedHistory.reduce((prev, current) => {
        return (new Date(prev._cq_sync_time) > new Date(current._cq_sync_time)) ? prev : current
    }, enrichedHistory[0]);

    if (!latestRecord) return null;

    return (
        <div className='w-full min-w-0 px-4 py-6 space-y-8'>
            <div className="flex items-center gap-3 border-b pb-4">
                <Layers className="h-8 w-8 text-blue-600" />
                <div>
                    <h1 className="text-2xl font-bold text-foreground">{selectedProfileData.tm_name}</h1>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        {selectedProfileData.resource_group} • {selectedProfileData.location}
                    </p>
                    {/* <h1 className="text-2xl font-bold text-foreground">
                        {selectedProfileData.tm_name}
                    </h1>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        Grupo de recursos: {selectedProfileData.resource_group} • {selectedProfileData.location}
                    </p> */}
                </div>
            </div>
            <section>
                <RecursosTrafficManagerCardsComponent latestData={latestRecord} />
            </section>
            <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <h2 className="text-xl font-semibold text-foreground">Historial de Configuraciones</h2>
                </div>
                <RecursosTrafficManagerTable historyData={enrichedHistory} />
            </section>
        </div>
    )
}