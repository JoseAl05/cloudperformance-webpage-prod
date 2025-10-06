'use client'

import { SpotVsRegularVm } from '@/interfaces/vista-spot-vs-regular-vm/spotVsRegularVmInterfaces';
import { useTheme } from 'next-themes';
import {
    makeBaseOptions,
    makeLineSeries,
    deepMerge,
    useECharts,
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

    const metrics = useMemo(() => {
        if (!data || data.length === 0) {
            return { totalVMs: null, totalSpot: null, spotPercentage: null, totalVmsSeries: null, totalSpotSeries:null }
        }

        const last = data[data.length - 1]
        const totalVMs = last.total_instancias || 0
        const totalSpot = last.total_spot || 0
        const spotPercentage = totalVMs > 0 ? ((totalSpot / totalVMs) * 100).toFixed(2) : null

        const totalVmsSeries =
            data
                .sort((a,b) => new Date(a.sync_time).getTime() - new Date(b.sync_time).getTime())
                .map(s => [s.sync_time,s.total_instancias]);

        const totalSpotSeries =
            data
                .sort((a,b) => new Date(a.sync_time).getTime() - new Date(b.sync_time).getTime())
                .map(s => [s.sync_time,s.total_spot]);

        return { totalVMs, totalSpot, spotPercentage, totalVmsSeries, totalSpotSeries }
    }, [data])

    const option = useMemo(() => {
        const base = makeBaseOptions({
            // title,
            legend: ['Total VMs', 'Total Spot VMs'],
            unitLabel: 'Instancias',
            // yMax: yMaxRounded,
            useUTC: true,
            showToolbox: true,
        });

        const series = [
            makeLineSeries('Total VMs', metrics.totalVmsSeries),
            makeLineSeries('Total Spot VMs', metrics.totalSpotSeries)
        ];

        return deepMerge(base, {
            series
        });
    }, [isDark, data]);

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