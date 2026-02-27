'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import {
    createChartOption,
    deepMerge,
    makeBaseOptions,
    useECharts,
} from '@/lib/echartsGlobalConfig';

interface TendenciaItem {
    fecha: string;
    total_used_gb: number;
    total_unused_gb: number;
}

interface TopFilestoreSubUtilizadoTendenciaChartProps {
    data: TendenciaItem[];
    metric: 'total_used_gb' | 'total_unused_gb';
    title: string;
    yAxisLabel: string;
}

export const TopFilestoreSubUtilizadoTendenciaChart = ({
    data,
    metric,
    title,
    yAxisLabel,
}: TopFilestoreSubUtilizadoTendenciaChartProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const color = metric === 'total_used_gb' ? '#3b82f6' : '#f97316';

    const chartData = useMemo(() => {
        if (!data || data.length === 0) return { dates: [], values: [] };

        const sorted = [...data].sort(
            (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );

        return {
            dates: sorted.map(d => d.fecha),
            values: sorted.map(d => d[metric]),
        };
    }, [data, metric]);

    const option = useMemo(() => {
        const base = makeBaseOptions({
            legend: [],
            unitLabel: 'GB',
            useUTC: false,
            showToolbox: false,
            metricType: 'size',
        });

        const lineChart = createChartOption({
            kind: 'line',
            xAxisType: 'category',
            legend: false,
            tooltip: true,
            series: [
                {
                    kind: 'line',
                    name: yAxisLabel,
                    data: chartData.values,
                    extra: {
                        color,
                        smooth: true,
                        areaStyle: { opacity: 0.15 },
                    },
                },
            ],
            extraOption: {
                grid: { left: 60, right: 30, top: 20, bottom: 40 },
                xAxis: {
                    type: 'category',
                    data: chartData.dates,
                    axisLabel: { fontSize: 11 },
                },
                yAxis: {
                    type: 'value',
                    name: 'GB',
                    nameLocation: 'middle',
                    nameGap: 45,
                },
            },
        });

        return deepMerge(base, lineChart);
    }, [chartData, color, yAxisLabel]);

    const isEmpty = !data || data.length === 0;

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {isEmpty ? (
                    <div className="w-full h-[300px] flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                            No hay datos de tendencia disponibles.
                        </p>
                    </div>
                ) : (
                    <div ref={chartRef} className="w-full h-[300px]" />
                )}
            </CardContent>
        </Card>
    );
};