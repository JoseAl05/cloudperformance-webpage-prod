'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
    createChartOption,
    deepMerge,
    makeBaseOptions,
    useECharts,
} from '@/lib/echartsGlobalConfig';

interface MemoryDataPoint {
    date: string;
    timestamp: { $date: string };
    avg_value: number;
    max_value: number;
    min_value: number;
}

interface CloudSQLMemoryChartProps {
    data: MemoryDataPoint[] | null;
}

export const CloudSQLMemoryChart = ({ data }: CloudSQLMemoryChartProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);
    const safeData = Array.isArray(data) ? data : [];

    const { avgMetric, maxMetric, minMetric } = useMemo(() => {
        const sortedData = [...safeData].sort(
            (a, b) => new Date(a.timestamp.$date).getTime() - new Date(b.timestamp.$date).getTime()
        );

        const avgMetric: [string, number][] = sortedData.map(item => [
            item.timestamp.$date,
            +item.avg_value.toFixed(2)
        ]);

        const maxMetric: [string, number][] = sortedData.map(item => [
            item.timestamp.$date,
            +item.max_value.toFixed(2)
        ]);

        const minMetric: [string, number][] = sortedData.map(item => [
            item.timestamp.$date,
            +item.min_value.toFixed(2)
        ]);

        return { avgMetric, maxMetric, minMetric };
    }, [safeData]);

    const option = useMemo(() => {
        const base = makeBaseOptions({
            legend: ['Promedio', 'Máximo', 'Mínimo'],
            unitLabel: '%',
            useUTC: true,
            showToolbox: true,
            metricType: 'percent',
        });

        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: [
                {
                    kind: 'line',
                    name: 'Promedio',
                    data: avgMetric,
                    smooth: true,
                    extra: { color: '#36A2EB' }
                },
                {
                    kind: 'line',
                    name: 'Máximo',
                    data: maxMetric,
                    smooth: true,
                    extra: { color: '#FF6384' }
                },
                {
                    kind: 'line',
                    name: 'Mínimo',
                    data: minMetric,
                    smooth: true,
                    extra: { color: '#28e995' }
                },
            ],
            extraOption: {
                xAxis: { axisLabel: { rotate: 30 } },
                yAxis: { min: 0, max: 100 },
                grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
            },
        });

        return deepMerge(base, lines);
    }, [avgMetric, maxMetric, minMetric]);

    const isEmpty = safeData.length === 0;

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Utilización de Memoria</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        Las marcas de tiempo (Timestamps) están en formato <strong>UTC</strong>.
                    </p>
                </div>
                {isEmpty ? (
                    <div className="w-full h-[200px] flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                            No hay métricas de memoria disponibles.
                        </p>
                    </div>
                ) : (
                    <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
                )}
            </CardContent>
        </Card>
    );
};