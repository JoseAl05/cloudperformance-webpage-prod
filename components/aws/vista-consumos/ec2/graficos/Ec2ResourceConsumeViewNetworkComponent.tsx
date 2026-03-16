'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';
import { ConsumeViewEc2NetworkMetrics } from '@/interfaces/vista-consumos/ec2ConsumeViewInterfaces';

interface Ec2ResourceConsumeViewNetworkComponentProps {
    data: ConsumeViewEc2NetworkMetrics[] | null;
}

const formatBytes = (value: number): string => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)} MB/s`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(2)} KB/s`;
    return `${value.toFixed(2)} B/s`;
};

export const Ec2ResourceConsumeViewNetworkComponent = ({ data }: Ec2ResourceConsumeViewNetworkComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const inChartRef = useRef<HTMLDivElement>(null);
    const outChartRef = useRef<HTMLDivElement>(null);

    const safeData = Array.isArray(data) ? data : [];

    const { avgInData, maxInData, avgOutData, maxOutData } = useMemo(() => {
        const sorted = [...safeData].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        const avgInData: [string, number][] = sorted
            .filter(item => item.avg_network_in != null)
            .map(item => [item.timestamp, item.avg_network_in!]);

        const maxInData: [string, number][] = sorted
            .filter(item => item.max_network_in != null)
            .map(item => [item.timestamp, item.max_network_in!]);

        const avgOutData: [string, number][] = sorted
            .filter(item => item.avg_network_out != null)
            .map(item => [item.timestamp, item.avg_network_out!]);

        const maxOutData: [string, number][] = sorted
            .filter(item => item.max_network_out != null)
            .map(item => [item.timestamp, item.max_network_out!]);

        return { avgInData, maxInData, avgOutData, maxOutData };
    }, [data]);

    const optionIn = useMemo(() => {
        const base = makeBaseOptions({
            legend: ['Promedio', 'Máximo'],
            unitLabel: 'Bytes/s',
            useUTC: true,
            showToolbox: true,
            metricType: 'default'
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
                    data: avgInData,
                    smooth: true,
                    extra: { color: '#36A2EB' }
                },
                {
                    kind: 'line',
                    name: 'Máximo',
                    data: maxInData,
                    smooth: true,
                    extra: { color: '#FF6384' }
                },
            ],
            extraOption: {
                xAxis: { axisLabel: { rotate: 30 } },
                yAxis: {
                    min: 0,
                    axisLabel: {
                        formatter: (value: number) => formatBytes(value)
                    }
                },
                tooltip: {
                    formatter: (params: unknown) => {
                        if (!Array.isArray(params)) return '';
                        return params.map((p: unknown) =>
                            `${p.marker}${p.seriesName}: <b>${formatBytes(p.value[1])}</b>`
                        ).join('<br/>');
                    }
                },
                grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
            },
        });
        return deepMerge(base, lines);
    }, [isDark, avgInData, maxInData]);

    const optionOut = useMemo(() => {
        const base = makeBaseOptions({
            legend: ['Promedio', 'Máximo'],
            unitLabel: 'Bytes/s',
            useUTC: true,
            showToolbox: true,
            metricType: 'default'
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
                    data: avgOutData,
                    smooth: true,
                    extra: { color: '#28e995' }
                },
                {
                    kind: 'line',
                    name: 'Máximo',
                    data: maxOutData,
                    smooth: true,
                    extra: { color: '#FF9F40' }
                },
            ],
            extraOption: {
                xAxis: { axisLabel: { rotate: 30 } },
                yAxis: {
                    min: 0,
                    axisLabel: {
                        formatter: (value: number) => formatBytes(value)
                    }
                },
                tooltip: {
                    formatter: (params: unknown) => {
                        if (!Array.isArray(params)) return '';
                        return params.map((p: unknown) =>
                            `${p.marker}${p.seriesName}: <b>${formatBytes(p.value[1])}</b>`
                        ).join('<br/>');
                    }
                },
                grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
            },
        });
        return deepMerge(base, lines);
    }, [isDark, avgOutData, maxOutData]);

    useECharts(inChartRef, optionIn, [optionIn], isDark ? 'cp-dark' : 'cp-light');
    useECharts(outChartRef, optionOut, [optionOut], isDark ? 'cp-dark' : 'cp-light');

    const isEmpty = safeData.length === 0;

    return (
        <div className="grid grid-cols-1 gap-4">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Red Entrante (NetworkIn)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">
                            Timestamps en formato <strong>UTC</strong>. Valores en Bytes/s.
                        </p>
                    </div>
                    {isEmpty ? (
                        <div className="w-full h-[200px] flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">No hay métricas de red disponibles.</p>
                        </div>
                    ) : (
                        <div ref={inChartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
                    )}
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Red Saliente (NetworkOut)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">
                            Timestamps en formato <strong>UTC</strong>. Valores en Bytes/s.
                        </p>
                    </div>
                    {isEmpty ? (
                        <div className="w-full h-[200px] flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">No hay métricas de red disponibles.</p>
                        </div>
                    ) : (
                        <div ref={outChartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};