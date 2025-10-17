'use client'

import { Card, CardContent } from '@/components/ui/card';
import { SpotVsRegularVm } from '@/interfaces/vista-spot-vs-regular-vm/spotVsRegularVmInterfaces';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { BarChart3 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useMemo, useRef } from 'react';

interface SpotVsVmChartComponentProps {
    data: SpotVsRegularVm[];
}

export const SpotVsVmChartComponent = ({ data }: SpotVsVmChartComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const metrics = useMemo(() => {
        if (!data || data.length === 0) {
            return { totalVMs: null, totalSpot: null, spotPercentage: null }
        }

        const last = data[data.length - 1] // último registro
        const totalVMs = last.total_instancias || 0
        const totalSpot = last.total_spot || 0
        const spotPercentage = totalVMs > 0 ? ((totalSpot / totalVMs) * 100).toFixed(2) : null

        return { totalVMs, totalSpot, spotPercentage }
    }, [data])

    const option = useMemo(() => {
        const times = data.map((item: unknown) => item.sync_time)
        const totalInstancias = data.map((item: unknown) => item.total_instancias)
        const totalSpot = data.map((item: unknown) => item.total_spot)
        const base = makeBaseOptions({
            legend: ['Total Instancias EC2', 'Total Instancias Spot'],
            legendPos: 'top',
            unitLabel: 'Instancias',
            useUTC: true,
            showToolbox: true,
            metricType: 'default',
        });

        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: [
                {
                    name: 'Total Instancias EC2',
                    kind: 'line',
                    smooth: true,
                    data: totalInstancias,
                    extra: {
                        symbol: 'circle',
                        symbolSize: 6
                    }
                },
                {
                    name: 'Total Instancias Spot',
                    kind: 'line',
                    smooth: true,
                    data: totalSpot,
                    extra: {
                        symbol: 'circle',
                        symbolSize: 6
                    }
                }
            ],
            extraOption: {
                xAxis: {
                    type: 'category',
                    data: times.map((t: string) => {
                        const d = new Date(t)
                        return `${d.getUTCDate()}/${d.getUTCMonth() + 1}`
                    }),
                    axisLabel: { rotate: 45 }
                },
                yAxis: { min: 0 },
                grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
            },
        });

        return deepMerge(base, lines);
    }, [data]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');
    return (
        <Card className="shadow-lg rounded-2xl">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">SPOT Virtual vs Máquinas Virtuales</h2>
                    <BarChart3 className="h-6 w-6 text-blue-500" />
                </div>
                <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>
            </CardContent>
        </Card>
    )
}