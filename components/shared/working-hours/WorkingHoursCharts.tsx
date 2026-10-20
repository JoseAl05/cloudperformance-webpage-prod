'use client';

import { useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useECharts } from '@/lib/echartsGlobalConfig';
import { compactNumber, formatValue } from '@/lib/consumption';
import type { MetricDefinition } from '@/lib/consumption';
import { formatSantiagoTime, getWorkingHoursMetric, SCHEDULE_LABELS, sortMetrics } from '@/lib/workingHours';
import type { WorkingHoursPoint } from '@/interfaces/workingHours';
import type { WorkingHoursViewConfig } from '@/components/shared/working-hours/types';

const BUSINESS_COLOR = '#2563eb';
const NON_BUSINESS_COLOR = '#dc2626';

interface TooltipParam {
    axisValue?: number | string;
    seriesName?: string;
    color?: string;
    value?: [string, number | null];
}

const average = (values: number[]) => (values.length > 0 ? values.reduce((sum, v) => sum + v, 0) / values.length : null);

const MetricChart = ({ metric, points, definition }: { metric: string; points: WorkingHoursPoint[]; definition: MetricDefinition }) => {
    const { theme, resolvedTheme } = useTheme();
    const isDark = (resolvedTheme || theme) === 'dark';
    const chartRef = useRef<HTMLDivElement>(null);

    const { business, nonBusiness, businessAvg, nonBusinessAvg } = useMemo(() => {
        const sorted = [...points].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
        const businessSeries: [string, number | null][] = [];
        const nonBusinessSeries: [string, number | null][] = [];
        const businessValues: number[] = [];
        const nonBusinessValues: number[] = [];
        sorted.forEach((p) => {
            const isBusiness = p.schedule_type === 'business_hours';
            businessSeries.push([p.timestamp, isBusiness ? p.value : null]);
            nonBusinessSeries.push([p.timestamp, isBusiness ? null : p.value]);
            if (p.value !== null) (isBusiness ? businessValues : nonBusinessValues).push(p.value);
        });
        return {
            business: businessSeries,
            nonBusiness: nonBusinessSeries,
            businessAvg: average(businessValues),
            nonBusinessAvg: average(nonBusinessValues),
        };
    }, [points]);

    const option = useMemo(() => {
        const fmt = (v: number | null) => formatValue(v, definition.format, definition.unit);
        const isPercent = definition.format === 'percent';
        const line = (name: string, color: string, symbol: string, data: [string, number | null][]) => ({
            name,
            type: 'line' as const,
            showSymbol: true,
            symbol,
            symbolSize: 6,
            connectNulls: false,
            lineStyle: { width: 2.5, color },
            itemStyle: { color, borderColor: '#fff', borderWidth: 1 },
            areaStyle: { opacity: 0.12, color },
            data,
        });
        return {
            grid: { left: 50, right: 30, top: 60, bottom: 60, containLabel: true },
            legend: { show: true, top: 0 },
            tooltip: {
                trigger: 'axis' as const,
                formatter: (raw: unknown) => {
                    const params = (Array.isArray(raw) ? raw : [raw]) as TooltipParam[];
                    const rows = params
                        .filter((p) => p.value && p.value[1] !== null && p.value[1] !== undefined)
                        .map((p) => `<div style="display:flex;align-items:center;gap:6px;font-size:12px">
                                <span style="display:inline-block;border-radius:10px;width:10px;height:10px;background-color:${p.color};"></span>
                                <span>${p.seriesName}:</span><strong>${fmt(p.value ? p.value[1] : null)}</strong></div>`);
                    if (rows.length === 0) return '';
                    const when = params[0]?.axisValue !== undefined ? formatSantiagoTime(params[0].axisValue) : '';
                    return `<div style="font-size:12px;font-weight:600;margin-bottom:4px">${when}</div>${rows.join('')}`;
                },
            },
            xAxis: {
                type: 'time' as const,
                axisLabel: { formatter: (value: number) => formatSantiagoTime(value), hideOverlap: true },
            },
            yAxis: {
                type: 'value' as const,
                name: definition.unit ? `${definition.label} (${definition.unit})` : definition.label,
                nameTextStyle: { align: 'left' as const },
                min: isPercent ? 0 : undefined,
                axisLabel: {
                    formatter: (value: number) =>
                        isPercent ? `${value.toFixed(0)}%` : definition.format === 'count' || definition.format === 'number' ? compactNumber(value) : fmt(value),
                },
                splitLine: { show: true, lineStyle: { type: 'dashed' as const, opacity: 0.5 } },
            },
            dataZoom: [{ type: 'inside' as const, start: 0, end: 100 }, { type: 'slider' as const, bottom: 0, height: 20 }],
            series: [
                line(SCHEDULE_LABELS.business_hours, BUSINESS_COLOR, 'circle', business),
                line(SCHEDULE_LABELS.non_business_hours, NON_BUSINESS_COLOR, 'diamond', nonBusiness),
            ],
        };
    }, [business, nonBusiness, definition]);

    useECharts(chartRef as React.RefObject<HTMLDivElement>, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <Card className="w-full h-full shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium uppercase tracking-wide" title={metric}>{definition.label}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BUSINESS_COLOR }} />
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{SCHEDULE_LABELS.business_hours}</span>
                        </div>
                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{formatValue(businessAvg, definition.format, definition.unit)}</div>
                        <span className="text-[10px] text-muted-foreground">Promedio</span>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 rotate-45" style={{ backgroundColor: NON_BUSINESS_COLOR }} />
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{SCHEDULE_LABELS.non_business_hours}</span>
                        </div>
                        <div className="text-sm font-bold text-red-600 dark:text-red-400">{formatValue(nonBusinessAvg, definition.format, definition.unit)}</div>
                        <span className="text-[10px] text-muted-foreground">Promedio</span>
                    </div>
                </div>
                <div ref={chartRef} className="w-full h-[300px]" />
            </CardContent>
        </Card>
    );
};

export const WorkingHoursCharts = ({ data, config }: { data: WorkingHoursPoint[]; config: WorkingHoursViewConfig }) => {
    const grouped = useMemo(() => {
        const groups: Record<string, WorkingHoursPoint[]> = {};
        data.forEach((point) => {
            (groups[point.metric] ??= []).push(point);
        });
        return groups;
    }, [data]);

    const metrics = sortMetrics(Object.keys(grouped));
    if (metrics.length === 0) return null;

    return (
        <div className="space-y-4 w-full min-w-0">
            <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                    Horario hábil: lunes a viernes de 08:00 a 18:00, hora de <strong>Santiago de Chile</strong> (las horas del gráfico están en esa zona).
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                {metrics.map((metric) => (
                    <MetricChart key={metric} metric={metric} points={grouped[metric]} definition={getWorkingHoursMetric(metric, config.metricOverrides)} />
                ))}
            </div>
        </div>
    );
};
