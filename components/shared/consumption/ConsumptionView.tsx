'use client'

import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { consumptionUrl, QueryParams } from '@/lib/consumption';
import { DataStateComponent } from '@/components/shared/DataStateComponent';
import { ConsumptionCards } from '@/components/shared/consumption/ConsumptionCards';
import { ConsumptionCharts } from '@/components/shared/consumption/ConsumptionCharts';
import { ConsumptionTable } from '@/components/shared/consumption/ConsumptionTable';
import type { ConsumptionInfoResponse, EfficiencyResponse, MetricPoint } from '@/interfaces/consumption';
import type { ConsumptionViewConfig } from '@/components/shared/consumption/types';

const SWR_OPTIONS = { revalidateOnFocus: false };

const fetchAll = (urls: string[]): Promise<MetricPoint[]> =>
    Promise.all(urls.map((url) => fetcher(url) as Promise<MetricPoint[]>)).then((parts) => parts.flat());

interface ConsumptionViewProps {
    config: ConsumptionViewConfig;
    /** Parámetros de la API ya traducidos desde los filtros de la vista. */
    params: QueryParams;
    /** Falso mientras falta un filtro obligatorio (instancia, suscripción, proyecto...). */
    enabled: boolean;
    disabledText: string;
}

/**
 * Vista estándar de Consumo / Eficiencia: tarjetas de resumen y eficiencia, un gráfico por métrica y la tabla de
 * recursos con su detalle. Igual para AWS, Azure y GCP; lo propio de cada recurso vive en `config`.
 */
export const ConsumptionView = ({ config, params, enabled, disabledText }: ConsumptionViewProps) => {
    const { cloud, resource } = config;

    const info = useSWR<ConsumptionInfoResponse>(enabled ? consumptionUrl(cloud, resource, 'info', params) : null, fetcher, SWR_OPTIONS);
    const efficiency = useSWR<EfficiencyResponse>(
        enabled && config.hasEfficiency ? consumptionUrl(cloud, resource, 'efficiency', params) : null, fetcher, SWR_OPTIONS);
    const metricsUrls = config.metricsEndpoints.map((action) => consumptionUrl(cloud, resource, action, params));
    const metrics = useSWR<MetricPoint[]>(enabled && metricsUrls.length > 0 ? metricsUrls : null, fetchAll, SWR_OPTIONS);

    if (!enabled) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">{disabledText}</div>
            </div>
        );
    }

    const resources = info.data?.resources ?? [];
    const points = metrics.data ?? [];
    const hasEfficiency = (efficiency.data?.metrics_detail.length ?? 0) > 0;

    return (
        <DataStateComponent
            isLoading={info.isLoading || efficiency.isLoading || metrics.isLoading}
            error={info.error || efficiency.error || metrics.error}
            isEmpty={resources.length === 0 && points.length === 0 && !hasEfficiency}
            emptyDescription={config.emptyText}
        >
            <div className="space-y-6 mt-6 px-4 w-full min-w-0">
                <ConsumptionCards config={config} summary={info.data?.summary} efficiency={efficiency.data} />
                {points.length > 0 && (
                    <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                        <ConsumptionCharts data={points} />
                    </div>
                )}
                <ConsumptionTable resources={resources} config={config} />
            </div>
        </DataStateComponent>
    );
};
