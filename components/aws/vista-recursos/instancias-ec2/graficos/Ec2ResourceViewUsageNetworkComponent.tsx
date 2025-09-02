'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { bytesToMB } from '@/lib/bytesToMbs';
import { Info } from 'lucide-react';

interface MetricData {
    MetricLabel: string;
    Timestamp: string;
    Value: number;
}

interface ResourceViewUsageNetworkComponentProps {
    data: { metrics_data: MetricData[] } | null;
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
        params.map((p: unknown) => `${p.marker} ${p.seriesName}: ${p.value[1]} MB/s<br/>`).join('')
    );
};

export const Ec2ResourceViewUsageNetworkComponent = ({ data }: ResourceViewUsageNetworkComponentProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    const { networkInMetric, networkOutMetric } = useMemo(() => {
        const networkInData = data?.metrics_data.filter(item => item.MetricLabel === 'Entrada de Red (Promedio)') || [];
        networkInData.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());
        const networkInMetric: [string, number][] = networkInData.map(item => [item.Timestamp, bytesToMB(item.Value)]);

        const networkOutData = data?.metrics_data.filter(item => item.MetricLabel === 'Salida de Red (Promedio)') || [];
        networkOutData.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());
        const networkOutMetric: [string, number][] = networkOutData.map(item => [item.Timestamp, bytesToMB(item.Value)]);

        return { networkInMetric, networkOutMetric };
    }, [data]);

    const handleResize = useCallback(() => {
        chartInstance.current?.resize();
    }, []);

    useEffect(() => {
        if (!chartRef.current) return;

        const optionsNetworkMetrics: echarts.EChartsOption = {
            dataZoom: sliderConfig,
            tooltip: { trigger: 'axis', formatter: tooltipFormatter },
            legend: { data: ['Entrada de Red', 'Salida de Red'], top: 10, left: 'center' },
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
                scale: true,
                axisLabel: { formatter: (val: number) => `${val} MB/s` }
            },
            series: [
                createSeries('Entrada de Red', networkInMetric, '#36A2EB', 'rgba(54, 162, 235, 0.3)'),
                createSeries('Salida de Red', networkOutMetric, '#e60000', 'rgba(235, 0, 0, 0.3)')
            ],
            animation: true
        };

        chartInstance.current = echarts.init(chartRef.current);
        chartInstance.current.setOption(optionsNetworkMetrics);

        resizeObserverRef.current = new ResizeObserver(handleResize);
        resizeObserverRef.current.observe(chartRef.current);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            resizeObserverRef.current?.disconnect();
            chartInstance.current?.dispose();
        };
    }, [networkInMetric, networkOutMetric, handleResize]);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Entrada y Salida de Red</CardTitle>
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
