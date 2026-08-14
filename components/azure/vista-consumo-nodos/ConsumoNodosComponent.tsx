'use client'

import React from 'react';
import useSWR from 'swr';
import { AlertCircle, Info } from 'lucide-react';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { MessageCard } from '@/components/azure/cards/MessageCards';
import { AzureVmConsumeCardsComponent } from '@/components/azure/vista-consumo-vm/info/AzureVmConsumeCardsComponent';
import { AzureVmConsumeChartComponent } from '@/components/azure/vista-consumo-vm/graficos/AzureVmConsumeChartComponent';
import { AzureVmConsumeTableComponent } from '@/components/azure/vista-consumo-vm/table/AzureVmConsumeTableComponent';

interface AzureNodosMetricsProps {
    startDate: Date;
    endDate: Date;
    subscription: string;
    region: string;
    selectedTagKey: string;
    selectedTagValue: string;
    selectedResourceGroup: string;
    selectedInstanceV2: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const AzureNodeMetricsComponent = ({
    startDate,
    endDate,
    subscription,
    region,
    selectedTagKey,
    selectedTagValue,
    selectedResourceGroup,
    selectedInstanceV2
}: AzureNodosMetricsProps) => {

    const startDateFormatted = startDate.toISOString().slice(0, 19);
    const endDateFormatted = endDate.toISOString().slice(0, 19);

    const buildParams = () => {
        const params = new URLSearchParams({
            date_from: startDateFormatted,
            date_to: endDateFormatted,
        });

        if (subscription && subscription !== 'all_subscriptions') params.append('subscription_id', subscription);
        if (region && region !== 'all_regions') params.append('location', region);
        if (selectedResourceGroup && selectedResourceGroup !== 'all_resource_groups') params.append('resource_group', selectedResourceGroup);
        if (selectedInstanceV2 && selectedInstanceV2 !== 'all_instances') params.append('vm_name', selectedInstanceV2);
        
        if (selectedTagKey && selectedTagKey !== 'allKeys' && selectedTagKey !== 'null') {
            params.append('nombre_tag', selectedTagKey);
            if (selectedTagValue && selectedTagValue !== 'allValues' && selectedTagValue !== 'null') {
                params.append('valor_tag', selectedTagValue);
            }
        }
        return params.toString();
    };

    const queryString = buildParams();
    const shouldFetch = !!subscription;

    const { data: infoData, error: infoError, isLoading: infoLoading } = useSWR(
        shouldFetch ? `/api/azure/bridge/azure/consumo/consumo-nodos/info?${queryString}` : null, fetcher, { revalidateOnFocus: false }
    );

    const { data: efficiencyData, error: efficiencyError, isLoading: efficiencyLoading } = useSWR(
        shouldFetch ? `/api/azure/bridge/azure/consumo/consumo-nodos/global_efficiency?${queryString}` : null, fetcher, { revalidateOnFocus: false }
    );

    const { data: metricsData, error: metricsError, isLoading: metricsLoading } = useSWR(
        shouldFetch ? `/api/azure/bridge/azure/consumo/consumo-nodos/metricas_tendencia?${queryString}` : null, fetcher, { revalidateOnFocus: false }
    );

    const anyLoading = infoLoading || efficiencyLoading || metricsLoading;
    const anyError = infoError || efficiencyError || metricsError;

    if (!subscription) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">
                    No se ha seleccionado ninguna suscripción.
                </div>
            </div>
        );
    }

    if (anyLoading) {
        return <LoaderComponent />;
    }

    if (anyError) {
        return (
            <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
                <MessageCard icon={AlertCircle} title="Error al cargar datos" description="No se pudieron obtener las métricas de Nodos AKS." tone="error" />
            </div>
        );
    }

    if (!infoData || !infoData.instancias || infoData.instancias.length === 0) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard icon={Info} title="Sin Nodos AKS" description="No se encontraron nodos para los filtros seleccionados." tone="warn" />
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6 px-4 w-full min-w-0">
            <AzureVmConsumeCardsComponent 
                summary={infoData?.resumen}
                instancias={infoData?.instancias || []}
                efficiency={efficiencyData}
                isLoading={anyLoading}
            />

            <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                <AzureVmConsumeChartComponent data={metricsData} />
            </div>

            <AzureVmConsumeTableComponent data={infoData?.instancias || []} />
        </div>
    );
};