'use client';

import { useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { compactNumber, formatValue, getMetricDefinition } from '@/lib/consumption';
import type { MetricPoint } from '@/interfaces/consumption';

const MetricChart = ({ metric, points }: { metric: string; points: MetricPoint[] }) => {
    const { theme, resolvedTheme } = useTheme();
    const isDark = (resolvedTheme || theme) === 'dark';
    const chartRef = useRef<HTMLDivElement>(null);
    const definition = getMetricDefinition(metric);

    const option = useMemo(() => {
        const sorted = [...points].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
        const series = (key: 'avg_value' | 'max_value' | 'min_value') =>
            sorted.map((p) => [p.timestamp, p[key]] as [string, number | null]);

        const isPercent = definition.format === 'percent';
        const formatAxis = (value: number) => {
            if (isPercent) return `${value.toFixed(0)}%`;
            if (definition.format === 'count' || definition.format === 'number') return compactNumber(value);
            return formatValue(value, definition.format, definition.unit);
        };

        const base = makeBaseOptions({
            legend: ['Promedio', 'Máximo', 'Mínimo'],
            unitLabel: definition.unit ?? '',
            useUTC: true,
            showToolbox: true,
            metricType: isPercent ? 'percent' : 'default',
        });
        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: [
                { kind: 'line', name: 'Promedio', data: series('avg_value'), smooth: true, extra: { color: '#36A2EB' } },
                { kind: 'line', name: 'Máximo', data: series('max_value'), smooth: true, extra: { color: '#FF6384' } },
                { kind: 'line', name: 'Mínimo', data: series('min_value'), smooth: true, extra: { color: '#28e995' } },
            ],
            extraOption: {
                tooltip: {
                    trigger: 'axis',
                    valueFormatter: (v: unknown) => formatValue(v === null || v === undefined ? null : Number(v), definition.format, definition.unit),
                },
                yAxis: {
                    name: definition.unit ? `${definition.label} (${definition.unit})` : definition.label,
                    nameTextStyle: { align: 'left' },
                    min: isPercent ? 0 : undefined,
                    max: isPercent ? 100 : undefined,
                    axisLabel: { formatter: formatAxis },
                },
                xAxis: { axisLabel: { rotate: 30 } },
                grid: { left: 50, right: 20, top: 56, bottom: 64, containLabel: true },
            },
        });
        return deepMerge(base, lines);
    }, [points, definition]);

    useECharts(chartRef as React.RefObject<HTMLDivElement>, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{definition.label}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        Las marcas de tiempo (Timestamps) están en formato <strong>UTC</strong>.
                    </p>
                </div>
                <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
            </CardContent>
        </Card>
    );
};

/** Un gráfico por métrica (las series llegan mezcladas y se agrupan por `metric`). */
export const ConsumptionCharts = ({ data }: { data: MetricPoint[] }) => {
    const grouped = useMemo(() => {
        const groups: Record<string, MetricPoint[]> = {};
        data.forEach((point) => {
            (groups[point.metric] ??= []).push(point);
        });
        return groups;
    }, [data]);

    const metrics = Object.keys(grouped).sort();
    if (metrics.length === 0) return null;

    return (
        <div className="flex flex-col gap-6 w-full min-w-0">
            {metrics.map((metric) => (
                <MetricChart key={metric} metric={metric} points={grouped[metric]} />
            ))}
        </div>
    );
};
