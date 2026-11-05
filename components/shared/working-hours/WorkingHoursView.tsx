'use client'

import useSWR from 'swr';
import { Clock } from 'lucide-react';
import { fetcher } from '@/lib/fetcher';
import type { QueryParams } from '@/lib/consumption';
import { workingHoursUrl } from '@/lib/workingHours';
import { DataStateComponent } from '@/components/shared/DataStateComponent';
import { WorkingHoursCards } from '@/components/shared/working-hours/WorkingHoursCards';
import { WorkingHoursCharts } from '@/components/shared/working-hours/WorkingHoursCharts';
import { WorkingHoursTable } from '@/components/shared/working-hours/WorkingHoursTable';
import type { WorkingHoursPoint, WorkingHoursResource, WorkingHoursSummaryItem } from '@/interfaces/workingHours';
import type { WorkingHoursViewConfig } from '@/components/shared/working-hours/types';

const SWR_OPTIONS = { revalidateOnFocus: false };

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-3 mt-10 mb-6">
        <Clock className="h-8 w-8 text-blue-500" />
        <h2 className="text-3xl font-bold text-foreground">{children}</h2>
    </div>
);

interface WorkingHoursViewProps {
    config: WorkingHoursViewConfig;
    params: QueryParams;
    enabled: boolean;
    disabledText: string;
}

export const WorkingHoursView = ({ config, params, enabled, disabledText }: WorkingHoursViewProps) => {
    const { cloud, resource } = config;

    const usage = useSWR<WorkingHoursPoint[]>(enabled ? workingHoursUrl(cloud, resource, 'usage', params) : null, fetcher, SWR_OPTIONS);
    const summary = useSWR<WorkingHoursSummaryItem[]>(enabled ? workingHoursUrl(cloud, resource, 'summary', params) : null, fetcher, SWR_OPTIONS);
    const resources = useSWR<WorkingHoursResource[]>(enabled ? workingHoursUrl(cloud, resource, 'resources', params) : null, fetcher, SWR_OPTIONS);

    if (!enabled) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">{disabledText}</div>
            </div>
        );
    }

    const points = usage.data ?? [];
    const items = summary.data ?? [];
    const rows = resources.data ?? [];

    return (
        <DataStateComponent
            isLoading={usage.isLoading || summary.isLoading || resources.isLoading}
            error={usage.error || summary.error || resources.error}
            isEmpty={points.length === 0 && items.length === 0 && rows.length === 0}
            emptyDescription={config.emptyText}
        >
            <div className="w-full min-w-0 px-4 py-6">
                <WorkingHoursCards data={items} config={config} />
                {points.length > 0 && (
                    <>
                        <SectionTitle>Métricas {config.serviceName} horario hábil vs no hábil</SectionTitle>
                        <WorkingHoursCharts data={points} config={config} />
                    </>
                )}
                {rows.length > 0 && (
                    <>
                        <SectionTitle>Detalle {config.serviceName} horario hábil vs no hábil</SectionTitle>
                        <WorkingHoursTable resources={rows} config={config} />
                    </>
                )}
            </div>
        </DataStateComponent>
    );
};
