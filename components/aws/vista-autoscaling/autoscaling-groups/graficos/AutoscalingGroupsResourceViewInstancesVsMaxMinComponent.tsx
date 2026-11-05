'use client';

import { useMemo, useRef } from 'react';
import {
    createChartOption,
    deepMerge,
    makeBaseOptions,
    useECharts
} from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface MetricPoint {
    Resource: string;
    Timestamp: string;
    Value: number;
    sync_time: { $date: string };
    MetricLabelFormatted: string;
}

interface AutoscalingGroupsInstancesVsMaxMinChartProps {
    data: MetricPoint[];
    title?: string;
    height?: string;
}

const TARGET_METRICS = [
    'Capacidad Deseada (Promedio)',
    'Tamaño Máximo del Grupo (Promedio)',
    'Tamaño Mínimo del Grupo (Promedio)',
] as const;

export const AutoscalingGroupsResourceViewInstancesVsMaxMinComponent = ({
    data,
    title = 'Cantidad Instancias configuradas vs Máximo y Mínimo deseado',
    height = '300px',
}: AutoscalingGroupsInstancesVsMaxMinChartProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const metrics = useMemo(() => {
        const desiredCapacity =
            data
                .filter(d => d.MetricLabelFormatted === "Capacidad Deseada (Promedio)")
                .sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime())
                .map(d => [d.Timestamp, d.Value])
        const maxGroupSize =
            data
                .filter(d => d.MetricLabelFormatted === "Tamaño Máximo del Grupo (Promedio)")
                .sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime())
                .map(d => [d.Timestamp, d.Value])
        const minGroupSize =
            data
                .filter(d => d.MetricLabelFormatted === "Tamaño Mínimo del Grupo (Promedio)")
                .sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime())
                .map(d => [d.Timestamp, d.Value])

        return { desiredCapacity, maxGroupSize, minGroupSize }
    }, [data])

    const option = useMemo(() => {
        const base = makeBaseOptions({
            legend: TARGET_METRICS,
            unitLabel: 'Instancias',
            useUTC: true,
            showToolbox: true,
            metricType: 'count'
        });

        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: [
                {
                    kind: 'line',
                    name: 'Capacidad Deseada (Promedio)',
                    data: metrics.desiredCapacity,
                    smooth: true,
                },
                {
                    kind: 'line',
                    name: 'Tamaño Máximo del Grupo (Promedio)',
                    data: metrics.maxGroupSize,
                    smooth: true,
                },
                {
                    kind: 'line',
                    name: 'Tamaño Mínimo del Grupo (Promedio)',
                    data: metrics.minGroupSize,
                    smooth: true,
                }
            ],
            extraOption: {
                xAxis: { axisLabel: { rotate: 30 } },
                yAxis: { min: 0 },
                grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
            },
        });

        return deepMerge(base, lines);
    }, [isDark, data]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Configuración vs Límites</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        Las marcas de tiempo están en <strong>UTC</strong>.
                    </p>
                </div>

                {!data ? (
                    <div className="text-center text-gray-500 py-6">
                        No hay datos de capacidad disponibles.
                    </div>
                ) : (
                    <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
                )}
            </CardContent>
        </Card>
    )
};
