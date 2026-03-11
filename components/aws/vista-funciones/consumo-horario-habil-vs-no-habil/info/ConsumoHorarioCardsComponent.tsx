'use client'

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import {
    TrendingUp,
    Cpu,
    Activity,
    Server,
    HardDrive,
    Briefcase,
    Moon,
    Network, // Nuevo icono para red
    ArrowUpRight,
    ArrowDownLeft,
    TrendingDown,
    MemoryStick,
    Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkingNonWorkingHoursUsageSummary } from '@/interfaces/vista-consumo-horario-habil-no-habil/workingNonWorkingHoursInterfaces';

interface ConsumoHorarioCardsComponentProps {
    data: WorkingNonWorkingHoursUsageSummary[];
}

const formatDynamicUnit = (value: number, baseUnit: string) => {
    if (baseUnit !== 'B/s') {
        return {
            value: value.toFixed(1),
            unit: baseUnit
        };
    }

    if (value === 0) return { value: "0", unit: "B/s" };

    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];

    const i = Math.floor(Math.log(value) / Math.log(k));

    const safeIndex = Math.min(i, sizes.length - 1);

    const scaledValue = value / Math.pow(k, safeIndex);

    return {
        value: scaledValue.toFixed(1),
        unit: sizes[safeIndex]
    };
};

const getMetricConfig = (metricName: string) => {
    const lowerName = metricName.toLowerCase();

    if (lowerName.includes('cpuutilization')) return { icon: Cpu, unit: '%' };
    if (lowerName.includes('freeablememory')) return { icon: MemoryStick, unit: 'B/s' };
    if (lowerName.includes('credit')) return { icon: Cpu, unit: 'Créditos' };
    if (lowerName.includes('iops')) return { icon: HardDrive, unit: 'IOPS' };

    if (lowerName.includes('networkin') || lowerName.includes('networkout')) return { icon: Activity, unit: 'B/s' };

    if (lowerName.includes('gb')) return { icon: HardDrive, unit: 'GB' };
    if (lowerName.includes('freestorage')) return { icon: HardDrive, unit: 'B/s' };

    if (lowerName.includes('memory') || lowerName.includes('ram')) return { icon: Server, unit: '%' };
    if (lowerName.includes('transactions')) return { icon: Activity, unit: 'Transacciones' };

    if (lowerName.includes('databaseconnections')) return { icon: Database, unit: 'Conexiones' };

    return { icon: Activity, unit: '' };
};

const MetricColumn = ({
    item,
    type,
    baseUnit
}: {
    item?: WorkingNonWorkingHoursUsageSummary,
    type: 'working' | 'non-working',
    baseUnit: string
}) => {
    const isWorking = type === 'working';

    const styles = isWorking ? {
        bg: "",
        border: "border-blue-100",
        text: "text-blue-900",
        subtext: "text-blue-600",
        icon: Briefcase,
        iconColor: "text-blue-500",
        badge: "bg-blue-100 text-blue-700 border-blue-200"
    } : {
        bg: "",
        border: "border-amber-100",
        text: "text-amber-900",
        subtext: "text-amber-600",
        icon: Moon,
        iconColor: "text-amber-500",
        badge: "bg-amber-100 text-amber-700 border-amber-200"
    };

    const { icon: Icon } = styles;

    if (!item) {
        return (
            <div className={`flex flex-col items-center justify-center p-4 h-full ${styles.bg} opacity-50`}>
                <p className="text-xs text-muted-foreground">Sin datos</p>
            </div>
        );
    }

    const avgFormatted = formatDynamicUnit(item.average, baseUnit);
    const maxFormatted = formatDynamicUnit(item.max, baseUnit);
    const minFormatted = formatDynamicUnit(item.min, baseUnit);


    return (
        <div className={cn("flex flex-col p-4 h-full transition-colors hover:bg-opacity-70", styles.bg)}>
            <div className="flex items-center justify-between mb-3">
                <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase border", styles.badge)}>
                    <Icon className="w-3 h-3" />
                    <span>{isWorking ? "Hábil" : "No Hábil"}</span>
                </div>
            </div>

            <div className="mt-auto">
                <div className="flex items-baseline gap-1.5 mb-1">
                    <span className={cn("text-2xl font-bold tabular-nums", styles.text)}>
                        {avgFormatted.value}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">{avgFormatted.unit} avg</span>
                </div>

                <div className="flex flex-col gap-1.5 pt-2 mt-1 border-t border-slate-200/60">
                    <TrendingUp className="w-3 h-3 text-red-500" />
                    <span className="text-xs text-muted-foreground">
                        Max: <strong className={styles.subtext}>{maxFormatted.value} {maxFormatted.unit}</strong>
                    </span>
                    <TrendingDown className="w-3 h-3 text-blue-500" />
                    <span className="text-xs text-muted-foreground">
                        Min: <strong className={styles.subtext}>{minFormatted.value} {minFormatted.unit}</strong>
                    </span>
                </div>
            </div>
        </div>
    );
};

export const ConsumoHorarioCardsComponent = ({ data }: ConsumoHorarioCardsComponentProps) => {

    const processedMetrics = useMemo(() => {
        if (!data || data.length === 0) return [];

        const groupedByMetric: Record<string, { working?: WorkingNonWorkingHoursUsageSummary, nonWorking?: WorkingNonWorkingHoursUsageSummary }> = {};

        data.forEach(item => {
            if (!groupedByMetric[item.metric]) {
                groupedByMetric[item.metric] = {};
            }

            const isWorking = item.schedule_type.toLowerCase().includes('business_hours') && !item.schedule_type.toLowerCase().includes('non_business_hours');

            if (isWorking) {
                groupedByMetric[item.metric].working = item;
            } else {
                groupedByMetric[item.metric].nonWorking = item;
            }
        });

        return Object.entries(groupedByMetric).map(([metricName, values]) => ({
            metricName,
            ...values
        }));
    }, [data]);

    if (!processedMetrics.length) {
        return (
            <div className="p-6 border border-dashed rounded-lg text-center text-muted-foreground">
                No hay datos disponibles.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {processedMetrics.map((group) => {
                const { icon: MetricIcon, unit } = getMetricConfig(group.metricName);
                const humanName = group.metricName.replace(/_/g, ' ');

                return (
                    <Card key={group.metricName} className="border shadow-sm hover:shadow-md transition-shadow">
                        <div className="border-b px-4 py-3 flex items-center gap-2">
                            <div className="p-1.5 rounded">
                                <MetricIcon className="w-4 h-4" />
                            </div>
                            <h3 className="font-semibold text-sm capitalize truncate" title={humanName}>
                                {humanName}
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 h-full divide-x divide-slate-100">
                            <MetricColumn item={group.working} type="working" baseUnit={unit} />
                            <MetricColumn item={group.nonWorking} type="non-working" baseUnit={unit} />
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};