'use client';

import { useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    createChartOption,
    deepMerge,
    makeBaseOptions,
    useECharts,
} from '@/lib/echartsGlobalConfig';

interface FilestoreItem {
    name: string;
    desperdicio_gb: number;
    costo_desperdiciado: number;
    tier: string;
    recomendacion: string;
}

interface TopFilestoreSubUtilizadoChartProps {
    data: FilestoreItem[];
    type: 'desperdicio_gb' | 'costo_desperdiciado';
}

export const TopFilestoreSubUtilizadoChart = ({ data, type }: TopFilestoreSubUtilizadoChartProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);
    const [topN, setTopN] = useState<string>('10');

    const config = useMemo(() => {
        if (type === 'desperdicio_gb') {
            return {
                title: 'Top Filestore por GB Desperdiciado',
                valueKey: 'desperdicio_gb' as keyof FilestoreItem,
                unit: 'GB',
                color: '#f97316', // naranja — desperdicio
                metricType: 'size' as const,
            };
        } else {
            return {
                title: 'Top Filestore por Costo Desperdiciado',
                valueKey: 'costo_desperdiciado' as keyof FilestoreItem,
                unit: 'USD',
                color: '#ef4444', // rojo — costo
                metricType: 'currency' as const,
            };
        }
    }, [type]);

    const chartData = useMemo(() => {
        if (!data || data.length === 0) return { names: [], values: [] };

        const sorted = [...data].sort(
            (a, b) => (b[config.valueKey] as number) - (a[config.valueKey] as number)
        );

        const limit = parseInt(topN);
        const top = sorted.slice(0, limit).reverse(); // invertir: mayor arriba

        return {
            names: top.map(item => item.name),
            values: top.map(item => item[config.valueKey] as number),
        };
    }, [data, config.valueKey, topN]);

    const option = useMemo(() => {
        const base = makeBaseOptions({
            legend: [],
            unitLabel: config.unit,
            useUTC: false,
            showToolbox: false,
            metricType: config.metricType,
        });

        const barChart = createChartOption({
            kind: 'bar',
            xAxisType: 'value',
            legend: false,
            tooltip: true,
            series: [
                {
                    kind: 'bar',
                    name: config.title,
                    data: chartData.values,
                    extra: {
                        color: config.color,
                        barMaxWidth: 40,
                    },
                },
            ],
            extraOption: {
                grid: {
                    left: 150,
                    right: 40,
                    top: 20,
                    bottom: 40,
                    containLabel: true,
                },
                yAxis: {
                    type: 'category',
                    data: chartData.names,
                    axisLabel: {
                        fontSize: 11,
                        overflow: 'truncate',
                        width: 130,
                    },
                },
                xAxis: {
                    type: 'value',
                    name: config.unit,
                    nameLocation: 'middle',
                    nameGap: 30,
                },
            },
        });

        return deepMerge(base, barChart);
    }, [chartData, config]);

    const isEmpty = !data || data.length === 0;

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">{config.title}</CardTitle>
                <Select value={topN} onValueChange={setTopN}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="3">Top 3</SelectItem>
                        <SelectItem value="5">Top 5</SelectItem>
                        <SelectItem value="10">Top 10</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                {isEmpty ? (
                    <div className="w-full h-[300px] flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                            No hay datos disponibles.
                        </p>
                    </div>
                ) : (
                    <div ref={chartRef} className="w-full h-[400px]" />
                )}
            </CardContent>
        </Card>
    );
};