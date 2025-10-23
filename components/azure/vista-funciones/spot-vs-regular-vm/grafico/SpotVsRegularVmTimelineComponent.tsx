'use client'

import { SpotVsRegularVm } from '@/interfaces/vista-spot-vs-regular-vm/spotVsRegularVmInterfaces';
import { useTheme } from 'next-themes';
import {
    makeBaseOptions,
    deepMerge,
    useECharts,
    createChartOption,
} from '@/lib/echartsGlobalConfig';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useMemo, useRef } from 'react';

interface SpotVsRegularVmTimelineComponentProps {
    data: SpotVsRegularVm[];
}

export const SpotVsRegularVmTimelineComponent = ({ data }: SpotVsRegularVmTimelineComponentProps) => {

    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const { series } = useMemo(() => {
        if (!data || data.length === 0) {
            return { series: null }
        }
        const totalVmsSeries =
            data
                .sort((a, b) => new Date(a.sync_time).getTime() - new Date(b.sync_time).getTime())
                .map(s => [s.sync_time, s.total_instancias]);

        const totalSpotSeries =
            data
                .sort((a, b) => new Date(a.sync_time).getTime() - new Date(b.sync_time).getTime())
                .map(s => [s.sync_time, s.total_spot]);

        const series = [
            {
                name: 'Total VMs',
                kind: 'line',
                smooth: true,
                data: totalVmsSeries
            },
            {
                name: 'Total Spot VMs',
                kind: 'line',
                smooth: true,
                data: totalSpotSeries
            }
        ]

        return { series }
    }, [data])

    const option = useMemo(() => {
        const base = makeBaseOptions({
            legend: ['Total VMs', 'Total Spot VMs'],
            unitLabel: 'Instancias',
            useUTC: true,
            showToolbox: true,
            metricType: 'default'
        });

        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            series: series,
            extraOption: {
                tooltip: {
                    valueFormatter(value) {
                        return `${value} Instancias`
                    },
                },
                xAxis: { axisLabel: { rotate: 30 } },
                yAxis: { min: 0 },
                grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
            },
        })

        return deepMerge(base, lines);
    }, [series]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Spot vs Regular VMs</CardTitle>
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
}