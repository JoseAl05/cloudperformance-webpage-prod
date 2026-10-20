'use client'

import { useMemo } from 'react';
import { Activity, Briefcase, Cpu, Database, HardDrive, MemoryStick, Moon, Network, TrendingDown, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatValue, metricKey } from '@/lib/consumption';
import type { MetricDefinition } from '@/lib/consumption';
import { findSummary, getWorkingHoursMetric, sortMetrics } from '@/lib/workingHours';
import type { ScheduleType, WorkingHoursSummaryItem } from '@/interfaces/workingHours';
import type { WorkingHoursViewConfig } from '@/components/shared/working-hours/types';

const metricIcon = (name: string): LucideIcon => {
    const key = metricKey(name);
    if (key.includes('cpu')) return Cpu;
    if (key.includes('memory')) return MemoryStick;
    if (key.includes('connection') || key.includes('queries') || key.includes('transactions')) return Database;
    if (key.includes('network')) return Network;
    if (key.includes('iops') || key.includes('storage') || key.includes('disk') || key.includes('bytes') || key.includes('ops')) return HardDrive;
    return Activity;
};

const STYLES: Record<ScheduleType, { label: string; icon: LucideIcon; text: string; subtext: string; badge: string }> = {
    business_hours: {
        label: 'Hábil',
        icon: Briefcase,
        text: 'text-blue-900 dark:text-blue-200',
        subtext: 'text-blue-600 dark:text-blue-400',
        badge: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    },
    non_business_hours: {
        label: 'No Hábil',
        icon: Moon,
        text: 'text-amber-900 dark:text-amber-200',
        subtext: 'text-amber-600 dark:text-amber-400',
        badge: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
    },
};

const ScheduleColumn = ({ item, schedule, definition }: { item?: WorkingHoursSummaryItem; schedule: ScheduleType; definition: MetricDefinition }) => {
    const style = STYLES[schedule];
    const Icon = style.icon;
    const fmt = (value: number | null | undefined) => formatValue(value, definition.format, definition.unit);

    return (
        <div className="flex flex-col p-4 h-full">
            <div className="flex items-center justify-between mb-3">
                <div className={cn('flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase border', style.badge)}>
                    <Icon className="w-3 h-3" />
                    <span>{style.label}</span>
                </div>
            </div>
            {!item ? (
                <p className="text-xs text-muted-foreground opacity-60">Sin datos</p>
            ) : (
                <div className="mt-auto">
                    <div className="flex items-baseline gap-1.5 mb-1">
                        <span className={cn('text-xl font-bold tabular-nums', style.text)}>{fmt(item.avg_value)}</span>
                        <span className="text-xs font-medium text-muted-foreground">prom.</span>
                    </div>
                    <div className="flex flex-col gap-1 pt-2 mt-1 border-t border-slate-200/60 dark:border-slate-800">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <TrendingUp className="w-3 h-3 text-red-500" /> Máx: <strong className={style.subtext}>{fmt(item.max_value)}</strong>
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <TrendingDown className="w-3 h-3 text-blue-500" /> Mín: <strong className={style.subtext}>{fmt(item.min_value)}</strong>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export const WorkingHoursCards = ({ data, config }: { data: WorkingHoursSummaryItem[]; config: WorkingHoursViewConfig }) => {
    const metrics = useMemo(() => sortMetrics(data.map((item) => item.metric)), [data]);
    if (metrics.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {metrics.map((metric) => {
                const definition = getWorkingHoursMetric(metric, config.metricOverrides);
                const Icon = metricIcon(metric);
                return (
                    <Card key={metric} className="border shadow-sm hover:shadow-md transition-shadow">
                        <div className="border-b px-4 py-3 flex items-center gap-2">
                            <Icon className="w-4 h-4 text-slate-500" />
                            <h3 className="font-semibold text-sm truncate" title={metric}>{definition.label}</h3>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-800">
                            <ScheduleColumn item={findSummary(data, metric, 'business_hours')} schedule="business_hours" definition={definition} />
                            <ScheduleColumn item={findSummary(data, metric, 'non_business_hours')} schedule="non_business_hours" definition={definition} />
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};
