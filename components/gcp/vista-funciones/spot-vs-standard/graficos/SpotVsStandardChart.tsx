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

interface VM {
    sync_time: { $date: string };
    tipo_vm: string;
}

interface SpotVsStandardChartProps {
    data: VM[] | null;
}

export const SpotVsStandardChart = ({ data }: SpotVsStandardChartProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);
    const safeData = Array.isArray(data) ? data : [];

    const { totalSeries, standardSeries, spotSeries } = useMemo(() => {
        // Agrupar por fecha
        const groupedByDate = safeData.reduce((acc, vm) => {
            const date = new Date(vm.sync_time.$date).toISOString().split('T')[0];
            
            if (!acc[date]) {
                acc[date] = { total: 0, standard: 0, spot: 0 };
            }
            
            acc[date].total++;
            
            if (vm.tipo_vm === 'STANDARD') {
                acc[date].standard++;
            } else if (vm.tipo_vm === 'SPOT' || vm.tipo_vm === 'PREEMPTIBLE') {
                acc[date].spot++;
            }
            
            return acc;
        }, {} as Record<string, { total: number; standard: number; spot: number }>);

        // Convertir a arrays ordenados
        const dates = Object.keys(groupedByDate).sort();
        
        const totalSeries: [string, number][] = dates.map(date => [
            new Date(date).toISOString(),
            groupedByDate[date].total
        ]);

        const standardSeries: [string, number][] = dates.map(date => [
            new Date(date).toISOString(),
            groupedByDate[date].standard
        ]);

        const spotSeries: [string, number][] = dates.map(date => [
            new Date(date).toISOString(),
            groupedByDate[date].spot
        ]);

        return { totalSeries, standardSeries, spotSeries };
    }, [safeData]);

    const option = useMemo(() => {
        const base = makeBaseOptions({
            legend: ['Total VMs', 'Standard', 'Spot/Preemptible'],
            unitLabel: 'VMs',
            useUTC: true,
            showToolbox: true,
            metricType: 'count',
        });

        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: [
                {
                    kind: 'line',
                    name: 'Total VMs',
                    data: totalSeries,
                    smooth: true,
                    extra: { color: '#64748b', lineStyle: { width: 3 } }
                },
                {
                    kind: 'line',
                    name: 'Standard',
                    data: standardSeries,
                    smooth: true,
                    extra: { color: '#3b82f6' }
                },
                {
                    kind: 'line',
                    name: 'Spot/Preemptible',
                    data: spotSeries,
                    smooth: true,
                    extra: { color: '#a855f7' }
                },
            ],
            extraOption: {
                xAxis: { axisLabel: { rotate: 30 } },
                yAxis: { min: 0 },
                grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
            },
        });

        return deepMerge(base, lines);
    }, [totalSeries, standardSeries, spotSeries]);

    const isEmpty = safeData.length === 0;

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Evolución Spot vs Standard VMs</CardTitle>
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
                            No hay métricas de VMs disponibles.
                        </p>
                    </div>
                ) : (
                    <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
                )}
            </CardContent>
        </Card>
    );
};