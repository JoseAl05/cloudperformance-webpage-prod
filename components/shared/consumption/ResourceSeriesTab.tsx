'use client'

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { Activity } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataStateComponent } from '@/components/shared/DataStateComponent';
import { ConsumptionCharts } from '@/components/shared/consumption/ConsumptionCharts';
import { fetcher } from '@/lib/fetcher';
import { consumptionUrl, getResourceValue, metricKey } from '@/lib/consumption';
import type { MetricDefinition, QueryParams } from '@/lib/consumption';
import type { ConsumptionResource, ResourceSeriesResponse, SeriesGranularity, SeriesMetric } from '@/interfaces/consumption';
import type { ConsumptionViewConfig, DetailSeriesDef } from '@/components/shared/consumption/types';

const GRANULARITY_LABEL: Record<SeriesGranularity, string> = { hour: 'por hora', day: 'por día' };
const NO_SERVICE = 'Sin servicio';

const toDefinition = ({ metric, unit }: SeriesMetric): MetricDefinition => {
    if (unit === '%') return { label: metric, format: 'percent' };
    if (unit === 'B') return { label: metric, format: 'bytes' };
    if (!unit) return { label: metric, format: 'count' };
    return { label: metric, format: 'number', unit };
};

interface ResourceSeriesTabProps {
    resource: ConsumptionResource;
    config: ConsumptionViewConfig;
    series: DetailSeriesDef;
    params: QueryParams;
}

export const ResourceSeriesTab = ({ resource, config, series, params }: ResourceSeriesTabProps) => {
    const ip = getResourceValue(resource, series.ipPath);
    const resourceIp = typeof ip === 'string' && ip ? ip : null;
    const url = resourceIp
        ? consumptionUrl(config.cloud, config.resource, series.action, { ...params, resource_ip: resourceIp })
        : null;
    const { data, error, isLoading } = useSWR<ResourceSeriesResponse>(url, fetcher, { revalidateOnFocus: false });
    const [selected, setSelected] = useState<string | null>(null);

    const metrics = useMemo(() => data?.metrics ?? [], [data]);
    const serviceOf = useMemo(() => new Map(metrics.map((m) => [m.metric, m.service ?? NO_SERVICE])), [metrics]);
    const services = useMemo(() => {
        const counts = new Map<string, number>();
        serviceOf.forEach((service) => counts.set(service, (counts.get(service) ?? 0) + 1));
        return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
    }, [serviceOf]);
    const names = services.map((s) => s.name);
    const active = selected && names.includes(selected)
        ? selected
        : (names.find((name) => /cpu/i.test(name)) ?? names[0] ?? null);

    const overrides = useMemo(
        () => Object.fromEntries(metrics.map((m) => [metricKey(m.metric), toDefinition(m)])),
        [metrics]
    );
    const points = useMemo(
        () => (data?.points ?? []).filter((p) => serviceOf.get(p.metric) === active),
        [data, serviceOf, active]
    );

    if (!resourceIp) {
        return (
            <ScrollArea className="flex-1">
                <div className="p-6">
                    <p className="text-sm text-muted-foreground text-center py-8">
                        Este recurso no tiene un host de monitoreo asociado, por lo que no hay series de tiempo disponibles.
                    </p>
                </div>
            </ScrollArea>
        );
    }

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
                <DataStateComponent
                    isLoading={isLoading}
                    error={error}
                    isEmpty={services.length === 0}
                    emptyDescription="No hay chequeos de monitoreo para este recurso en el período seleccionado."
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <h4 className="text-sm font-semibold flex items-center gap-2">
                                <Activity className="h-4 w-4 text-slate-500" /> Chequeos de monitoreo ({metrics.length})
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                                Host {resourceIp} · valores agregados {data ? GRANULARITY_LABEL[data.granularity] : ''}
                            </p>
                        </div>
                        <Select value={active ?? undefined} onValueChange={setSelected}>
                            <SelectTrigger className="w-full md:w-80">
                                <SelectValue placeholder="Servicio" />
                            </SelectTrigger>
                            <SelectContent>
                                {services.map((service) => (
                                    <SelectItem key={service.name} value={service.name}>
                                        {service.name} ({service.count})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <ConsumptionCharts data={points} metricOverrides={overrides} />
                </DataStateComponent>
            </div>
        </ScrollArea>
    );
};
