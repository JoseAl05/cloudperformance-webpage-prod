'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResourceViewUsageCreditsComponentProps {
    data: {
        metrics_data: { MetricLabel: string; Timestamp: string; Value: number }[];
    } | null;
}

const sliderConfig = {
    type: 'slider',
    xAxisIndex: 0,
    bottom: 20,
    height: 20,
    handleSize: '100%',
    start: 0,
    end: 100
};

const tooltipFormatter = (params: unknown) => {
    const date = new Date(params[0].value[0]).toUTCString();
    return (
        `${date}<br/>` +
        params.map((p: unknown) => `${p.marker} ${p.seriesName}: ${p.value[1]} Créditos<br/>`).join('')
    );
};

export const Ec2ResourceViewUsageCreditsComponent = ({ data }: ResourceViewUsageCreditsComponentProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    const { creditsUsageMetric, creditsBalanceMetric, yMaxRounded } = useMemo(() => {
        const creditsUsageData = data?.metrics_data.filter(item => item.MetricLabel === 'Uso de Créditos CPU (Promedio)') || [];
        creditsUsageData.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());
        const creditsUsageMetric: [string, number][] = creditsUsageData.map(item => [item.Timestamp, +item.Value.toFixed(2)]);

        const creditsBalanceData = data?.metrics_data.filter(item => item.MetricLabel === 'Créditos de CPU Disponibles (Promedio)') || [];
        creditsBalanceData.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());
        const creditsBalanceMetric: [string, number][] = creditsBalanceData.map(item => [item.Timestamp, +item.Value.toFixed(2)]);

        const maxCreditsValue = creditsBalanceData.length ? Math.max(...creditsBalanceData.map(item => item.Value)) : 0;
        const yMaxRaw = Math.ceil(maxCreditsValue * 1.5);
        const factor = 100;
        const yMaxRounded = Math.floor(yMaxRaw / factor) * factor;

        return { creditsUsageMetric, creditsBalanceMetric, yMaxRounded };
    }, [data]);

    const handleResize = useCallback(() => {
        chartInstance.current?.resize();
    }, []);

    useEffect(() => {
        if (!chartRef.current) return;

        const optionsCpuCreditsMetrics: echarts.EChartsOption = {
            dataZoom: sliderConfig,
            tooltip: { trigger: 'axis', formatter: tooltipFormatter },
            legend: { data: ['Uso de Créditos', 'Créditos Disponibles'], top: 10, left: 'center' },
            grid: { left: 50, right: 30, top: 60, bottom: 60, containLabel: true },
            toolbox: { feature: { saveAsImage: {} } },
            xAxis: {
                type: 'time',
                axisLabel: {
                    formatter: (value: number) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:00`;
                    }
                }
            },
            yAxis: {
                type: 'value',
                max: yMaxRounded,
                axisLabel: { formatter: (val: number) => `${val} Créditos` }
            },
            series: [
                createSeries('Uso de Créditos', creditsUsageMetric, '#36A2EB', 'rgba(54, 162, 235, 0.3)'),
                createSeries('Créditos Disponibles', creditsBalanceMetric, '#e60000', 'rgba(235, 0, 0, 0.3)')
            ],
            animation: true
        };

        chartInstance.current = echarts.init(chartRef.current);
        chartInstance.current.setOption(optionsCpuCreditsMetrics);

        resizeObserverRef.current = new ResizeObserver(handleResize);
        resizeObserverRef.current.observe(chartRef.current);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            resizeObserverRef.current?.disconnect();
            chartInstance.current?.dispose();
        };
    }, [creditsUsageMetric, creditsBalanceMetric, yMaxRounded, handleResize]);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Consumo y Balance de Créditos</CardTitle>
            </CardHeader>
            <CardContent>
                <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
            </CardContent>
        </Card>
    );
};

const createSeries = (name: string, data: [string, number][], color: string, areaColor?: string) => ({
    name,
    type: 'line',
    data,
    smooth: true,
    lineStyle: { color },
    itemStyle: { color, borderColor: '#fff', borderWidth: 1 },
    emphasis: { focus: 'series' },
    ...(areaColor && { areaStyle: { color: areaColor } })
});
