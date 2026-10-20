'use client'

import { useCallback } from 'react';
import useSWR from 'swr';
import { BarChart3, Clock } from 'lucide-react';
import { fetcher } from '@/lib/fetcher';
import type { QueryParams } from '@/lib/consumption';
import { unusedUrl } from '@/lib/unused';
import { DataStateComponent } from '@/components/shared/DataStateComponent';
import { ConsumptionCharts } from '@/components/shared/consumption/ConsumptionCharts';
import { UnusedCards } from '@/components/shared/unused/UnusedCards';
import { UnusedTable } from '@/components/shared/unused/UnusedTable';
import type { UnusedMetricSummary, UnusedResource, UnusedSeriesPoint } from '@/interfaces/unused';
import type { UnusedViewConfig } from '@/components/shared/unused/types';

const SWR_OPTIONS = { revalidateOnFocus: false };

const SectionTitle = ({ icon: Icon, children }: { icon: typeof Clock; children: React.ReactNode }) => (
    <div className="flex items-center gap-3 mt-10 mb-6">
        <Icon className="h-8 w-8 text-blue-500" />
        <h2 className="text-3xl font-bold text-foreground">{children}</h2>
    </div>
);

interface UnusedViewProps {
    config: UnusedViewConfig;
    params: QueryParams;
    enabled: boolean;
    disabledText: string;
}

export const UnusedView = ({ config, params, enabled, disabledText }: UnusedViewProps) => {
    const { cloud, resource } = config;

    const summary = useSWR<UnusedMetricSummary[]>(
        enabled && !config.summaryFromResources ? unusedUrl(cloud, resource, 'summary', params) : null, fetcher, SWR_OPTIONS);
    const resources = useSWR<UnusedResource[]>(enabled ? unusedUrl(cloud, resource, 'resources', params) : null, fetcher, SWR_OPTIONS);
    const series = useSWR<UnusedSeriesPoint[]>(
        enabled && config.hasSeries ? unusedUrl(cloud, resource, 'series', params) : null, fetcher, SWR_OPTIONS);

    const associatedUrl = useCallback(
        (resourceId: string) => unusedUrl(cloud, resource, 'associated', { date_from: params.date_from, date_to: params.date_to, resource: resourceId }),
        [cloud, resource, params.date_from, params.date_to]
    );

    if (!enabled) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">{disabledText}</div>
            </div>
        );
    }

    const rows = resources.data ?? [];
    const cards = summary.data ?? [];
    const points = series.data ?? [];

    return (
        <DataStateComponent
            isLoading={summary.isLoading || resources.isLoading || series.isLoading}
            error={summary.error || resources.error || series.error}
            isEmpty={rows.length === 0 && cards.length === 0}
            emptyDescription={config.emptyText}
        >
            <div className="w-full min-w-0 px-4 py-6">
                <div className="flex-1 space-y-6 min-w-0 overflow-hidden">
                    <UnusedCards config={config} summary={cards} resources={rows} />
                </div>
                {points.length > 0 && (
                    <>
                        <SectionTitle icon={BarChart3}>Métricas {config.serviceName}</SectionTitle>
                        <ConsumptionCharts data={points} metricOverrides={config.metricOverrides} />
                    </>
                )}
                {rows.length > 0 && (
                    <>
                        <SectionTitle icon={Clock}>Detalle {config.serviceName}</SectionTitle>
                        <UnusedTable resources={rows} config={config} associatedUrl={config.hasAssociated ? associatedUrl : undefined} />
                    </>
                )}
            </div>
        </DataStateComponent>
    );
};
