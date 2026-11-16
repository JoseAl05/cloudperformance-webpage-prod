'use client'

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { Activity, Check, ChevronsUpDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DataStateComponent } from '@/components/shared/DataStateComponent';
import { ConsumptionCharts } from '@/components/shared/consumption/ConsumptionCharts';
import { fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';
import { consumptionUrl, definitionFromUnit, getResourceValue, metricKey } from '@/lib/consumption';
import type { QueryParams } from '@/lib/consumption';
import type { ConsumptionResource, ResourceSeriesResponse, SeriesMetric } from '@/interfaces/consumption';
import type { ConsumptionViewConfig, DetailSeriesDef } from '@/components/shared/consumption/types';

const NO_SERVICE = 'Sin servicio';
const SWR_OPTIONS = { revalidateOnFocus: false };

const defaultMetric = (metrics: SeriesMetric[]): string | null =>
    (metrics.find((m) => /^cpu usage percent$/i.test(m.metric))
        ?? metrics.find((m) => /cpu/i.test(m.service ?? m.metric))
        ?? metrics[0])?.metric ?? null;

interface ResourceSeriesTabProps {
    resource: ConsumptionResource;
    config: ConsumptionViewConfig;
    series: DetailSeriesDef;
    params: QueryParams;
}

export const ResourceSeriesTab = ({ resource, config, series, params }: ResourceSeriesTabProps) => {
    const ip = getResourceValue(resource, series.ipPath);
    const resourceIp = typeof ip === 'string' && ip ? ip : null;
    const [selected, setSelected] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const metricsUrl = resourceIp
        ? consumptionUrl(config.cloud, config.resource, series.metricsAction, { ...params, resource_ip: resourceIp })
        : null;
    const metricsList = useSWR<SeriesMetric[]>(metricsUrl, fetcher, SWR_OPTIONS);
    const metrics = useMemo(() => metricsList.data ?? [], [metricsList.data]);
    const active = selected && metrics.some((m) => m.metric === selected) ? selected : defaultMetric(metrics);

    const seriesUrl = resourceIp && active
        ? consumptionUrl(config.cloud, config.resource, series.action, { ...params, resource_ip: resourceIp, metric: active })
        : null;
    const readings = useSWR<ResourceSeriesResponse>(seriesUrl, fetcher, SWR_OPTIONS);
    const points = readings.data?.points ?? [];

    const groups = useMemo(() => {
        const byService = new Map<string, SeriesMetric[]>();
        metrics.forEach((m) => {
            const service = m.service ?? NO_SERVICE;
            byService.set(service, [...(byService.get(service) ?? []), m]);
        });
        return Array.from(byService.entries());
    }, [metrics]);
    const overrides = useMemo(
        () => Object.fromEntries(metrics.map((m) => [metricKey(m.metric), definitionFromUnit(m.metric, m.unit)])),
        [metrics]
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
                    isLoading={metricsList.isLoading}
                    error={metricsList.error}
                    isEmpty={metrics.length === 0}
                    emptyDescription="No hay chequeos de monitoreo para este recurso en el período seleccionado."
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <h4 className="text-sm font-semibold flex items-center gap-2">
                                <Activity className="h-4 w-4 text-slate-500" /> Chequeos de monitoreo ({metrics.length})
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                                Host {resourceIp}
                                {readings.data ? ` · ${points.length.toLocaleString('es-CL')} lecturas en el período` : ''}
                            </p>
                        </div>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full md:w-96 justify-between bg-transparent hover:bg-accent"
                                >
                                    <span className="truncate text-left">{active ?? 'Seleccionar métrica...'}</span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="end">
                                <Command>
                                    <CommandInput placeholder="Buscar métrica..." />
                                    <CommandList>
                                        <CommandEmpty>No se encontró la métrica.</CommandEmpty>
                                        {groups.map(([service, items]) => (
                                            <CommandGroup key={service} heading={service}>
                                                {items.map((m) => (
                                                    <CommandItem
                                                        key={m.metric}
                                                        value={`${m.metric} ${service}`}
                                                        onSelect={() => {
                                                            setSelected(m.metric);
                                                            setOpen(false);
                                                        }}
                                                    >
                                                        <Check className={cn('mr-2 h-4 w-4', active === m.metric ? 'opacity-100' : 'opacity-0')} />
                                                        <span className="truncate">{m.metric}</span>
                                                        {m.unit && <span className="ml-auto pl-2 text-xs text-muted-foreground">{m.unit}</span>}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        ))}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <DataStateComponent
                        isLoading={readings.isLoading}
                        error={readings.error}
                        isEmpty={points.length === 0}
                        emptyDescription="No hay lecturas de esta métrica en el período seleccionado."
                    >
                        <ConsumptionCharts data={points} metricOverrides={overrides} />
                    </DataStateComponent>
                </DataStateComponent>
            </div>
        </ScrollArea>
    );
};
