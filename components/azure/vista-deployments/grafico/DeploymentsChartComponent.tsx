'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { Info } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useMemo, useRef } from 'react';

interface DeploymentsChartComponentProps {
    data: unknown[];
    title: string;
}

export const DeploymentsChartComponent = ({ data, title }: DeploymentsChartComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const safeData = Array.isArray(data) ? data : [];

    const { dates, values } = useMemo(() => {
        const sortedData = [...data].sort((a, b) => a.date.localeCompare(b.date));
        const dates = sortedData.map(item => item.date);
        const values = sortedData.map(item => item.unique_deployments);

        return { dates, values }
    }, [data]);

    const option = useMemo(() => {
        const base = makeBaseOptions({
            unitLabel: 'Deployments',
            useUTC: true,
            showToolbox: true,
            metricType: 'default'
        });
        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            tooltip: true,
            series: [
                {
                    name: 'Deployments',
                    kind: 'line',
                    smooth: true,
                    data: values
                }
            ],
            extraOption: {
                tooltip: {
                    valueFormatter(value) {
                        return `Deployments: ${value}`
                    },
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: dates,
                },
                yAxis: { min: 0 },
                grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
            },
        });

        return deepMerge(base, lines);
    }, [dates, values]);

    const isEmpty = data.length === 0;

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
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
                        <p className="text-sm text-muted-foreground">No hay métricas disponibles.</p>
                    </div>
                ) : (
                    <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
                )}
            </CardContent>
        </Card>
    )
}