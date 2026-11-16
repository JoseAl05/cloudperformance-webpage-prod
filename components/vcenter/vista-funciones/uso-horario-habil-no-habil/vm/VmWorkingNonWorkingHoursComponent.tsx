'use client'

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { Check, ChevronsUpDown, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DataStateComponent } from '@/components/shared/DataStateComponent';
import { WorkingHoursView } from '@/components/shared/working-hours/WorkingHoursView';
import { VCENTER_VM_WH } from '@/components/shared/working-hours/workingHoursConfigs';
import { fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';
import { definitionFromUnit, metricKey, toApiDate } from '@/lib/consumption';
import { workingHoursUrl } from '@/lib/workingHours';
import type { WorkingHoursFamily } from '@/interfaces/workingHours';
import type { WorkingHoursViewConfig } from '@/components/shared/working-hours/types';

const DEFAULT_FAMILY = 'Uso de CPU';

const groupByCategory = (families: WorkingHoursFamily[]): [string, WorkingHoursFamily[]][] => {
    const groups = new Map<string, WorkingHoursFamily[]>();
    families.forEach((family) => groups.set(family.category, [...(groups.get(family.category) ?? []), family]));
    return Array.from(groups.entries());
};

interface VmWorkingNonWorkingHoursComponentProps {
    startDate?: Date;
    endDate?: Date;
    resourceIp?: string;
}

export const VmWorkingNonWorkingHoursComponent = ({ startDate, endDate, resourceIp }: VmWorkingNonWorkingHoursComponentProps) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const enabled = !!startDate && !!endDate;

    const params = useMemo(() => ({
        date_from: startDate ? toApiDate(startDate) : undefined,
        date_to: endDate ? toApiDate(endDate) : undefined,
        resource_ip: resourceIp && resourceIp !== 'all' ? resourceIp : undefined,
    }), [startDate, endDate, resourceIp]);

    const families = useSWR<WorkingHoursFamily[]>(
        enabled ? workingHoursUrl('vcenter', 'vm', 'families', params) : null,
        fetcher,
        { revalidateOnFocus: false }
    );
    const list = useMemo(() => families.data ?? [], [families.data]);
    const groups = useMemo(() => groupByCategory(list), [list]);
    const active = list.find((f) => f.family === selected) ?? list.find((f) => f.family === DEFAULT_FAMILY) ?? list[0] ?? null;

    const config = useMemo<WorkingHoursViewConfig>(() => ({
        ...VCENTER_VM_WH,
        metricOverrides: Object.fromEntries((active?.metrics ?? []).map((m) => [metricKey(m.metric), definitionFromUnit(m.metric, m.unit)])),
    }), [active]);

    if (!enabled) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se ha seleccionado un período.</div>
            </div>
        );
    }

    return (
        <DataStateComponent
            isLoading={families.isLoading}
            error={families.error}
            isEmpty={list.length === 0}
            emptyDescription="No encontramos lecturas de monitoreo de las máquinas virtuales seleccionadas en el período."
        >
            <div className="px-4 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                        <Layers className="h-4 w-4 text-slate-500" /> Familia de métricas
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                        {active ? `${active.metrics.length} métricas en ${active.category} › ${active.family}; tarjetas, gráficos y columnas de la tabla muestran solo esta familia.` : ''}
                    </p>
                </div>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full md:w-80 justify-between bg-transparent hover:bg-accent"
                        >
                            <span className="truncate text-left">
                                {active ? (
                                    <>
                                        <span className="text-muted-foreground">{active.category} · </span>
                                        {active.family}
                                    </>
                                ) : 'Seleccionar familia...'}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="end">
                        <Command>
                            <CommandInput placeholder="Buscar familia..." />
                            <CommandList>
                                <CommandEmpty>No se encontró la familia.</CommandEmpty>
                                {groups.map(([category, items]) => (
                                    <CommandGroup key={category} heading={category}>
                                        {items.map((f) => (
                                            <CommandItem
                                                key={f.family}
                                                value={`${f.category} ${f.family}`}
                                                onSelect={() => {
                                                    setSelected(f.family);
                                                    setOpen(false);
                                                }}
                                            >
                                                <Check className={cn('mr-2 h-4 w-4', active?.family === f.family ? 'opacity-100' : 'opacity-0')} />
                                                <span className="truncate">{f.family}</span>
                                                <span className="ml-auto pl-2 text-xs text-muted-foreground">{f.metrics.length}</span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                ))}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            {active && (
                <WorkingHoursView
                    config={config}
                    params={{ ...params, family: active.family }}
                    enabled
                    disabledText=""
                />
            )}
        </DataStateComponent>
    );
};
