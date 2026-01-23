'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';
import { InstanceGroupsMetrics } from '@/interfaces/vista-instance-group/iGInterfaces';


interface InstanceGroupChartComponentProps {
    data: InstanceGroupsMetrics[];
}

const SingleMetricChart = ({ metric }: { metric: InstanceGroupsMetrics }) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';
    const chartRef = useRef<HTMLDivElement>(null);

    const seriesData = useMemo(() => {
        const metricName = metric.metric_name;

        const processedData = metric.metric_data
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .map((m) => {
                return [m.timestamp, m.metric_value];
            });

        return [{
            name: metricName,
            type: 'line',
            smooth: true,
            showSymbol: false,
            data: processedData,
        }];
    }, [metric]);

    const option = useMemo(() => {
        const metricName = metric.metric_name;

        const base = makeBaseOptions({
            legend: [metricName],
            useUTC: true,
            showToolbox: true,
            metricType: 'default',
        });

        let yAxisName = metricName;

        // Base formatter for generic large numbers (K, M, B for Billion)
        const formatGeneric = (value: number) => {
            if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
            return value.toFixed(1);
        };

        // Formatter for Bytes (KB, MB, GB)
        const formatBytes = (value: number) => {
            if (value === 0) return '0 B/s';
            const k = 1024;
            const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];
            const i = Math.floor(Math.log(value) / Math.log(k));
            return parseFloat((value / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        };

        let axisLabelFormatter = formatGeneric;
        let tooltipFormatter = (v: number | null) => {
            if (v == null) return '-';
            return Number(v).toLocaleString('en-US', { maximumFractionDigits: 2 });
        };

        // Logic based on metric name patterns from JSON
        if (metricName.includes('cpu_utilization') || metricName.includes('percent')) {
            yAxisName = `${metricName} (%)`;
            axisLabelFormatter = (value: number) => `${value.toFixed(1)}%`;
            tooltipFormatter = (v: number | null) => v != null ? `${Number(v).toFixed(2)}%` : '-';
        }
        else if (metricName.includes('throughput')) {
            yAxisName = `${metricName}`; // Unit is dynamic in label
            axisLabelFormatter = formatBytes;
            tooltipFormatter = (v: number | null) => v != null ? formatBytes(Number(v)) : '-';
        }
        else if (metricName.includes('iops')) {
            yAxisName = `${metricName} (IOPS)`;
            axisLabelFormatter = (value: number) => `${formatGeneric(value)} IOPS`;
            tooltipFormatter = (v: number | null) => v != null ? `${Number(v).toFixed(2)} IOPS` : '-';
        }
        else if (metricName.includes('pps')) {
            yAxisName = `${metricName} (PPS)`;
            axisLabelFormatter = (value: number) => `${formatGeneric(value)} PPS`;
            tooltipFormatter = (v: number | null) => v != null ? `${Number(v).toFixed(2)} PPS` : '-';
        }
        else if (metricName.includes('uptime')) {
            yAxisName = `${metricName} (s)`;
            axisLabelFormatter = (value: number) => `${value}s`;
            tooltipFormatter = (v: number | null) => v != null ? `${Number(v).toFixed(0)}s` : '-';
        }

        const chartOptions = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: [],
            extraOption: {
                grid: { left: 30, right: 30, top: 50, bottom: 60, containLabel: true },
            },
        });

        const specificOptions = {
            tooltip: {
                trigger: 'axis',
                valueFormatter: tooltipFormatter,
            },
            yAxis: {
                name: yAxisName,
                nameTextStyle: {
                    align: 'left',
                    padding: [0, 0, 0, 0]
                },
                axisLabel: {
                    formatter: axisLabelFormatter
                }
            },
            series: seriesData
        };

        return deepMerge(base, deepMerge(chartOptions, specificOptions));
    }, [isDark, seriesData, metric]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    const isEmpty = seriesData.every(s => s.data.length === 0);

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle>{metric.metric_name.toUpperCase()}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-start gap-2 mb-4">
                    <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <p className="text-[10px] text-muted-foreground">
                        Mostrando datos para la métrica <strong>{metric.metric_name}</strong>.
                        {/* Promedio: <strong>{metric.avg_value.toFixed(2)}</strong> */}
                    </p>
                </div>
                {isEmpty ? (
                    <div className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                        <span className="text-gray-400">No hay datos disponibles para esta métrica</span>
                    </div>
                ) : (
                    <div ref={chartRef} className="w-full h-[300px]" />
                )}
            </CardContent>
        </Card>
    );
};

export const InstanceGroupChartComponent = ({ data }: InstanceGroupChartComponentProps) => {

    const sortedMetrics = useMemo(() => {
        if (!data) return [];
        return [...data].sort((a, b) => {
            const nameA = a.metric_name.toLowerCase();
            const nameB = b.metric_name.toLowerCase();

            const isCpuA = nameA.includes('cpu');
            const isCpuB = nameB.includes('cpu');

            if (isCpuA && !isCpuB) return -1;
            if (!isCpuA && isCpuB) return 1;

            return nameA.localeCompare(nameB);
        });
    }, [data]);

    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            {sortedMetrics.map((metricItem) => (
                <SingleMetricChart
                    key={metricItem.metric_name}
                    metric={metricItem}
                />
            ))}
        </div>
    );
};