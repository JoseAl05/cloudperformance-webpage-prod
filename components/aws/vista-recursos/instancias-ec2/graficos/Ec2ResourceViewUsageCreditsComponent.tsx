'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface ResourceViewUsageCreditsComponentProps {
    data: {
        metrics_data: { MetricLabel: string; Timestamp: string; Value: number }[];
    } | null;
}

const sliderConfig = [
    {
        type: 'slider',
        xAxisIndex: 0,
        bottom: 20,
        height: 20,
        handleSize: '100%',
        start: 0,
        end: 100
    },
    {
        type: 'inside',
        start: 0,
        end: 100,
        filterMode: 'filter'
    },
];

const tooltipFormatter = (params: unknown[]) => {
    if (!params.length) return '';
    const date = new Date(params[0].value[0]).toUTCString();
    return (
        `${date}<br/>` +
        params
            .map(p => `${p.marker} ${p.seriesName}: ${p.value[1]} Créditos<br/>`)
            .join('')
    );
};

export const Ec2ResourceViewUsageCreditsComponent = ({ data }: ResourceViewUsageCreditsComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const { creditsUsageMetric, creditsBalanceMetric, yMaxRounded } = useMemo(() => {
        const creditsUsageData = data?.metrics_data.filter(
            item => item.MetricLabel === 'Uso de Créditos CPU (Promedio)'
        ) || [];
        creditsUsageData.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());
        const creditsUsageMetric: [string, number][] = creditsUsageData.map(item => [
            item.Timestamp,
            +item.Value.toFixed(2),
        ]);

        const creditsBalanceData = data?.metrics_data.filter(
            item => item.MetricLabel === 'Créditos de CPU Disponibles (Promedio)'
        ) || [];
        creditsBalanceData.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());
        const creditsBalanceMetric: [string, number][] = creditsBalanceData.map(item => [
            item.Timestamp,
            +item.Value.toFixed(2),
        ]);

        const maxCreditsValue = Math.max(
            creditsUsageData.length ? Math.max(...creditsUsageData.map(item => item.Value)) : 0,
            creditsBalanceData.length ? Math.max(...creditsBalanceData.map(item => item.Value)) : 0
        );

        const yMaxRaw = Math.ceil(maxCreditsValue * 1.5);
        const factor = 100;
        const yMaxRounded = Math.max(10, Math.floor(yMaxRaw / factor) * factor);

        return { creditsUsageMetric, creditsBalanceMetric, yMaxRounded };
    }, [data]);

    const getThemeColors = useCallback(() => {
        if (isDark) {
            return {
                background: 'transparent',
                textColor: '#e4e4e7',
                gridColor: '#3f3f46',
                usageColor: '#60a5fa',
                usageAreaColor: 'rgba(96, 165, 250, 0.2)',
                balanceColor: '#f87171',
                balanceAreaColor: 'rgba(248, 113, 113, 0.2)',
            };
        } else {
            return {
                background: 'transparent',
                textColor: '#3f3f46',
                gridColor: '#e4e4e7',
                usageColor: '#2563eb',
                usageAreaColor: 'rgba(37, 99, 235, 0.2)',
                balanceColor: '#dc2626',
                balanceAreaColor: 'rgba(220, 38, 38, 0.2)',
            };
        }
    }, [isDark]);

    const handleResize = useCallback(() => {
        chartInstance.current?.resize();
    }, []);

    const createSeries = useCallback(
        (name: string, data: [string, number][], color: string, areaColor?: string) => ({
            name,
            type: 'line',
            data,
            smooth: true,
            lineStyle: { color, width: 2 },
            itemStyle: {
                color,
                borderColor: isDark ? '#18181b' : '#ffffff',
                borderWidth: 2,
            },
            emphasis: { focus: 'series' },
            ...(areaColor && { areaStyle: { color: areaColor } }),
        }),
        [isDark]
    );

    useEffect(() => {
        if (!chartRef.current) return;

        const colors = getThemeColors();

        const optionsCpuCreditsMetrics: echarts.EChartsOption = {
            backgroundColor: colors.background,
            dataZoom: sliderConfig.map(config => ({
                ...config,
                textStyle: { color: colors.textColor },
                borderColor: colors.gridColor,
                fillerColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                handleStyle: {
                    color: colors.textColor,
                    borderColor: colors.gridColor,
                },
            })),
            tooltip: {
                trigger: 'axis',
                formatter: tooltipFormatter,
                backgroundColor: isDark ? '#27272a' : '#ffffff',
                borderColor: colors.gridColor,
                textStyle: { color: colors.textColor },
            },
            legend: {
                data: ['Uso de Créditos', 'Créditos Disponibles'],
                top: 10,
                left: 'center',
                textStyle: { color: colors.textColor },
            },
            grid: {
                left: 50,
                right: 30,
                top: 60,
                bottom: 60,
                containLabel: true,
                borderColor: colors.gridColor,
            },
            xAxis: {
                type: 'time',
                axisLabel: {
                    formatter: (value: number) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:00`;
                    },
                    color: colors.textColor,
                },
                axisLine: { lineStyle: { color: colors.gridColor } },
                axisTick: { lineStyle: { color: colors.gridColor } },
                splitLine: {
                    show: true,
                    lineStyle: { color: colors.gridColor, opacity: 0.3 },
                },
            },
            yAxis: {
                type: 'value',
                max: yMaxRounded,
                axisLabel: {
                    formatter: (val: number) => `${val} Créditos`,
                    color: colors.textColor,
                },
                axisLine: { lineStyle: { color: colors.gridColor } },
                axisTick: { lineStyle: { color: colors.gridColor } },
                splitLine: {
                    lineStyle: { color: colors.gridColor, opacity: 0.3 },
                },
            },
            series: [
                createSeries('Uso de Créditos', creditsUsageMetric, colors.usageColor, colors.usageAreaColor),
                createSeries('Créditos Disponibles', creditsBalanceMetric, colors.balanceColor, colors.balanceAreaColor),
            ],
            animation: true,
        };

        if (chartInstance.current) {
            chartInstance.current.setOption(optionsCpuCreditsMetrics, true);
        } else {
            chartInstance.current = echarts.init(chartRef.current);
            chartInstance.current.setOption(optionsCpuCreditsMetrics);

            resizeObserverRef.current = new ResizeObserver(handleResize);
            resizeObserverRef.current.observe(chartRef.current);
            window.addEventListener('resize', handleResize);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            resizeObserverRef.current?.disconnect();
            chartInstance.current?.dispose();
            chartInstance.current = null;
        };
    }, [creditsUsageMetric, creditsBalanceMetric, yMaxRounded, handleResize, isDark, getThemeColors, createSeries]);

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
