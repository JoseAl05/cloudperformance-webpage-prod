'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';


interface ResourceInfraUsedViewUsageCreditsComponentProps {
    data: {
        creditMetrics: { MetricId: string; Timestamp: string; AvgValue: number }[];
    } | null;
}

export const ResourceInfraUsedViewUsageCreditsComponent = ({ data }: ResourceInfraUsedViewUsageCreditsComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const { creditsUsageMetric, creditsBalanceMetric, yMaxRounded } = useMemo(() => {
        const creditsUsageData = data?.creditMetrics.filter(
            item => item.MetricId === 'cpucreditusage_average'
        ) || [];
        creditsUsageData.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());
        const creditsUsageMetric: [string, number][] = creditsUsageData.map(item => [
            item.Timestamp,
            +item.AvgValue.toFixed(2),
        ]);

        const creditsBalanceData = data?.creditMetrics.filter(
            item => item.MetricId === 'cpucreditbalance_average'
        ) || [];
        creditsBalanceData.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());
        const creditsBalanceMetric: [string, number][] = creditsBalanceData.map(item => [
            item.Timestamp,
            +item.AvgValue.toFixed(2),
        ]);

        const maxCreditsValue = Math.max(
            creditsUsageData.length ? Math.max(...creditsUsageData.map(item => item.AvgValue)) : 0,
            creditsBalanceData.length ? Math.max(...creditsBalanceData.map(item => item.AvgValue)) : 0
        );

        const yMaxRaw = Math.ceil(maxCreditsValue * 1.5);
        const factor = 100;
        const yMaxRounded = Math.max(10, Math.floor(yMaxRaw / factor) * factor);

        return { creditsUsageMetric, creditsBalanceMetric, yMaxRounded };
    }, [data]);


    const option = useMemo(() => {
        const base = makeBaseOptions({
            legend: ['Uso de Créditos', 'Créditos Disponibles'],
            unitLabel: 'Créditos',
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
                    name: 'Uso de Créditos',
                    data: creditsUsageMetric,
                    smooth: true,
                    extra: {
                        color: '#28e995'
                    }
                },
                {
                    kind: 'line',
                    name: 'Créditos Disponibles',
                    data: creditsBalanceMetric,
                    smooth: true,
                    extra: {
                        color: '#FF6384'
                    }
                },
            ],
            extraOption: {
                tooltip: {
                    valueFormatter(value) {
                        return `${value} Créditos`;
                    }
                },
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    axisLabel: {
                        fontSize: 11,
                        formatter: (value: number) => {
                            const date = new Date(value);
                            return `${date.getUTCDate()}/${date.getUTCMonth() + 1} ${date.getUTCHours()}:00`;
                        },
                        showMaxLabel: true,
                        showMinLabel: true,
                    },
                },
                yAxis: { min: 0 },
                grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
            },
        });

        return deepMerge(base, lines);
    }, [creditsBalanceMetric, creditsUsageMetric]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Consumo y Balance de Créditos</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        Las marcas de tiempo (Timestamps) están en formato <strong>UTC</strong>.
                    </p>
                </div>
                <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
            </CardContent>
        </Card>
    );
};
