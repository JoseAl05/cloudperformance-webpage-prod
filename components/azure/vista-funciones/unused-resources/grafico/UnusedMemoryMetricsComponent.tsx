'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UnusedVmSeries } from '@/interfaces/vista-unused-resources/unusedVmInterfaces'
import { UnusedVmssSeries } from '@/interfaces/vista-unused-resources/unusedVmssInterface';
import { createChartOption, deepMerge, makeBaseOptions, makeLineSeries, useECharts } from '@/lib/echartsGlobalConfig';
import { Info } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useMemo, useRef } from 'react';

interface UnusedMemoryMetricsComponentProps {
    data: UnusedVmSeries[] | UnusedVmssSeries[];
}

type SeriesTuple = [string, number];

const toNumber = (v: unknown): number => {
    if (typeof v === 'number') return v;
    if (typeof v === 'string') {
        const cleaned = v.replace(/[\s,]/g, '').trim();
        const n = Number(cleaned);
        return Number.isFinite(n) ? n : NaN;
    }
    return NaN;
};

const toSeriesPairs = (arr: UnusedVmSeries[] | UnusedVmssSeries[] | undefined, asInt = false): SeriesTuple[] => {
    return (arr ?? [])
        .filter(it => !!it.timestamp)
        .map(it => {
            const n = toNumber(it.metric_value);
            if (!Number.isFinite(n)) return null;
            const value = asInt ? Math.trunc(n) : n;
            return [it.timestamp, value] as SeriesTuple;
        })
        .filter((x): x is SeriesTuple => x !== null)
        .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
};

export const UnusedMemoryMetricsComponent = ({ data }: UnusedMemoryMetricsComponentProps) => {

    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const {
        memoryMetrics, anyData
    } = useMemo(() => {

        const memoryMetrics = toSeriesPairs(data ?? []);

        return {
            memoryMetrics,
            anyData: memoryMetrics.length > 0
        }
    }, [data])

    const option = useMemo(() => {
        const base = makeBaseOptions({
            legend: ['Memoria Disponible'],
            unitLabel: 'GB',
            useUTC: true,
            showToolbox: true,
            metricType: 'gb'
        });

        const series = [
            {
                kind: 'line',
                name: 'Memoria Disponible',
                data: memoryMetrics,
                smooth: true,
            },
        ];

        const factoryOption = createChartOption({
            kind: 'line' as ChartKind,
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: series,
        });

        return deepMerge(base, factoryOption);
    }, [isDark, data]);
    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Memoria Disponible</CardTitle>
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