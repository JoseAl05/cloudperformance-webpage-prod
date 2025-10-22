'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UnusedVmSeries } from '@/interfaces/vista-unused-resources/unusedVmInterfaces'
import { UnusedVmssSeries } from '@/interfaces/vista-unused-resources/unusedVmssInterface';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { Info } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useMemo, useRef } from 'react';

interface UnusedCreditsRemainingMetricsComponentProps {
    data: UnusedVmSeries[] | UnusedVmssSeries[];
}

type SeriesTuple = [string, number];

const toSeriesPairs = (arr: UnusedVmSeries[] | UnusedVmssSeries[]): SeriesTuple[] => {
    return [...(arr ?? [])]
        .filter(it => typeof it.metric_value === 'number' && !!it.timestamp)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map(it => [it.timestamp, it.metric_value] as SeriesTuple);
}

export const UnusedCreditsRemainingMetricsComponent = ({ data }: UnusedCreditsRemainingMetricsComponentProps) => {

    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);
    const {
        remainingPairs, consumedPairs, anyData
    } = useMemo(() => {
        const remaining = (data ?? []).filter(s => s.name === 'CPU Credits Remaining');
        const consumed = (data ?? []).filter(s => s.name === 'CPU Credits Consumed');

        const remainingPairs = toSeriesPairs(remaining);
        const consumedPairs = toSeriesPairs(consumed);

        return {
            remainingPairs,
            consumedPairs,
            anyData: remainingPairs.length > 0 || consumedPairs.length > 0
        };
    }, [data])

    const option = useMemo(() => {
        const base = makeBaseOptions({
            legend: ['Créditos Disponibles', 'Créditos Consumidos'],
            unitLabel: 'créditos',
            useUTC: true,
            showToolbox: true,
            metricType: 'count',
        });
        const series = [
            {
                kind: 'line',
                name: 'Créditos Disponibles',
                data: remainingPairs,
                smooth: true,
            },
            {
                kind: 'line',
                name: 'Créditos Consumidos',
                data: consumedPairs,
                smooth: true,
            }
        ];
        const factoryOption = createChartOption({
            kind: 'line' as ChartKind,
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: series,
        });



        return deepMerge(base, factoryOption);
    }, [isDark, remainingPairs, consumedPairs]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Créditos (Disponibles vs Consumidos)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        Las marcas de tiempo están en <strong>UTC</strong>.
                    </p>
                </div>

                {!anyData ? (
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