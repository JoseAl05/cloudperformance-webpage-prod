'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface Ec2ResourceConsumeViewUsageCreditsComponentProps {
    data: { timestamp: string; sync_time: string; region: string; CpuCreditUsageValue: number; CpuCreditBalanceValue: number }[] | null;
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

const tooltipFormatter = (params: unknown) => {
    const date = new Date(params[0].value[0]).toUTCString();
    return (
        `${date}<br/>` +
        params.map((p: unknown) => `${p.marker} ${p.seriesName}: ${p.value[1]} Créditos<br/>`).join('')
    );
};

export const Ec2ResourceConsumeViewUsageCreditsComponent = ({ data }: Ec2ResourceConsumeViewUsageCreditsComponentProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    const { creditsUsageMetric, creditsBalanceMetric, yMaxRounded } = useMemo(() => {
        const creditsUsageData = data?.filter(item => item.CpuCreditUsageValue) || [];
        creditsUsageData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const creditsUsageMetric: [string, number][] = creditsUsageData.map(item => [item.timestamp, +item.CpuCreditUsageValue.toFixed(2)]);

        const creditsBalanceData = data?.filter(item => item.CpuCreditBalanceValue) || [];
        creditsBalanceData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const creditsBalanceMetric: [string, number][] = creditsBalanceData.map(item => [item.timestamp, +item.CpuCreditBalanceValue.toFixed(2)]);

        const maxCreditsValue = creditsBalanceData.length ? Math.max(...creditsBalanceData.map(item => item.CpuCreditBalanceValue)) : 0;
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
                <CardTitle>Uso de Créditos de CPU</CardTitle>
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
