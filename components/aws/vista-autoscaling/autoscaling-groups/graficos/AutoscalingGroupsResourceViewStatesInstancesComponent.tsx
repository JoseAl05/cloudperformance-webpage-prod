'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { useTheme } from 'next-themes';
import { deepMerge, makeBaseOptions, makeLineSeries, useECharts } from '@/lib/echartsGlobalConfig';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface MetricPoint {
    Resource: string;
    Timestamp: string;
    Value: number;
    sync_time: { $date: string };
    MetricLabelFormatted: string;
}

interface AutoscalingGroupsStatesChartProps {
    data: MetricPoint[];
    title?: string;
    height?: string;
}

const MAX_METRICS = [
    'Instancias en Espera (Máximo)',
    'Instancias en Servicio (Máximo)',
    'Instancias Totales (Máximo)',
    'Instancias Pendientes (Máximo)'
]

export const AutoscalingGroupsResourceViewStatesInstancesComponent = ({
    data,
    title = 'Estados Instancias Autoscaling Group',
    height = '300px'
}: AutoscalingGroupsStatesChartProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const metrics = useMemo(() => {
        const maxInstancesWaiting =
            data
                .filter(d => d.MetricLabelFormatted === 'Instancias en Espera (Máximo)')
                .sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime())
                .map(d => [d.Timestamp, d.Value])
        const maxInstancesOnService =
            data
                .filter(d => d.MetricLabelFormatted === 'Instancias en Servicio (Máximo)')
                .sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime())
                .map(d => [d.Timestamp, d.Value])
        const maxInstancesTotal =
            data
                .filter(d => d.MetricLabelFormatted === 'Instancias Totales (Máximo)')
                .sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime())
                .map(d => [d.Timestamp, d.Value])
        const maxInstancesPending =
            data
                .filter(d => d.MetricLabelFormatted === 'Instancias Pendientes (Máximo)')
                .sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime())
                .map(d => [d.Timestamp, d.Value])

        return { maxInstancesWaiting, maxInstancesOnService, maxInstancesTotal, maxInstancesPending }
    }, [data]);

    const option = useMemo(() => {
        const base = makeBaseOptions({
            legend: MAX_METRICS,
            unitLabel: 'Instancias',
            useUTC: true,
            showToolbox: true,
            metricType: 'count'
        });

        const series = [
            makeLineSeries('Instancias en Espera (Máximo)', metrics.maxInstancesWaiting),
            makeLineSeries('Instancias en Servicio (Máximo)', metrics.maxInstancesOnService),
            makeLineSeries('Instancias Totales (Máximo)', metrics.maxInstancesTotal),
            makeLineSeries('Instancias Pendientes (Máximo)', metrics.maxInstancesPending)
        ];

        return deepMerge(base, {
            series
        });
    }, [isDark, data]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');


    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Estados Instancias</CardTitle>
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