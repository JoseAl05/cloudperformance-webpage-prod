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
} from "@/components/ui/select";
import {
    createChartOption,
    deepMerge,
    makeBaseOptions,
    useECharts,
} from '@/lib/echartsGlobalConfig';

interface Bucket {
    name: string;
    object_count: number;
    tamano_gb: number;
}

interface TopStorageBucketsChartProps {
    data: Bucket[];
    type: 'objects' | 'size';
}

export const TopStorageBucketsChart = ({ data, type }: TopStorageBucketsChartProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);
    const [topN, setTopN] = useState<string>('10');

    const config = useMemo(() => {
        if (type === 'objects') {
            return {
                title: 'Top Buckets por Número de Objetos',
                valueKey: 'object_count' as keyof Bucket,
                unit: 'objetos',
                color: '#3b82f6'
            };
        } else {
            return {
                title: 'Top Buckets por Tamaño',
                valueKey: 'tamano_gb' as keyof Bucket,
                unit: 'GB',
                color: '#10b981'
            };
        }
    }, [type]);

    const chartData = useMemo(() => {
        if (!data || data.length === 0) return { names: [], values: [] };

        // Ordenar por valor descendente
        const sorted = [...data].sort((a, b) => 
            (b[config.valueKey] as number) - (a[config.valueKey] as number)
        );

        // Tomar solo top N
        const limit = parseInt(topN);
        const top = sorted.slice(0, limit);

        // Invertir para que el mayor esté arriba
        const names = top.map(b => b.name).reverse();
        const values = top.map(b => b[config.valueKey] as number).reverse();

        return { names, values };
    }, [data, config.valueKey, topN]);

    const option = useMemo(() => {
        const base = makeBaseOptions({
            legend: [],
            unitLabel: config.unit,
            useUTC: false,
            showToolbox: false,
            metricType: type === 'size' ? 'size' : 'count',
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
                        barMaxWidth: 40
                    }
                }
            ],
            extraOption: {
                grid: { 
                    left: 150, 
                    right: 40, 
                    top: 20, 
                    bottom: 40, 
                    containLabel: true 
                },
                yAxis: {
                    type: 'category',
                    data: chartData.names,
                    axisLabel: {
                        fontSize: 11,
                        overflow: 'truncate',
                        width: 130
                    }
                },
                xAxis: {
                    type: 'value',
                    name: config.unit,
                    nameLocation: 'middle',
                    nameGap: 30
                }
            },
        });

        return deepMerge(base, barChart);
    }, [chartData, config, type]);

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
                            No hay datos de buckets disponibles.
                        </p>
                    </div>
                ) : (
                    <div ref={chartRef} className="w-full h-[400px]" />
                )}
            </CardContent>
        </Card>
    );
};