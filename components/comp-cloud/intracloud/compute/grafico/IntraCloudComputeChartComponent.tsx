'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';
import { bytesToGB } from '@/lib/bytesToMbs';

interface ComputeMetric {
    avg_value: number;
    timestamp: string;
    metric_name: string;
}

interface TenantComputeData {
    tenant_id: string;
    compute_data: ComputeMetric[];
}

interface IntraCloudComputeChartComponentProps {
    data: TenantComputeData[];
}

const SingleMetricChart = ({ metricName, data }: { metricName: string; data: TenantComputeData[] }) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';
    const chartRef = useRef<HTMLDivElement>(null);

    const seriesData = useMemo(() => {
        return data.map((tenant, index) => {
            const metricData = tenant.compute_data
                .filter((m) => m.metric_name === metricName)
                .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                .map((m) => {
                    let metricValue = 0;
                    if (m.metric_name.includes("Available Memory") || m.metric_name.includes("Storage Used")) {
                        metricValue = bytesToGB(m.avg_value);
                    } else {
                        metricValue = m.avg_value;
                    }

                    return [m.timestamp, metricValue];
                });

            return {
                name: `Tenant ${index + 1}`,
                type: 'line',
                smooth: true,
                showSymbol: false,
                data: metricData,
            };
        });
    }, [data, metricName]);

    const option = useMemo(() => {
        const base = makeBaseOptions({
            legend: data.map((t,index) => `Tenant ${index + 1}`),
            useUTC: true,
            showToolbox: true,
            metricType: 'default',
        });

        let yAxisName = metricName;
        let axisLabelFormatter = (value: number) => {
            if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
            return value.toFixed(1);
        };
        let tooltipFormatter = (v: number | null) => {
            if (v == null) return '-';
            const n = Number(v);
            if (Number.isNaN(n)) return String(v);
            return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
        };

        if (metricName.includes('Percent') || metricName.includes('Percentage')) {
            yAxisName = `${metricName} (%)`;
            axisLabelFormatter = (value: number) => `${value}%`;
            tooltipFormatter = (v: number | null) => {
                if (v == null) return '-';
                return `${Number(v).toFixed(2)}%`;
            };
        } else if (metricName.includes('Available Memory') || metricName.includes('Storage Used')) {
            yAxisName = `${metricName} (GB)`;
            axisLabelFormatter = (value: number) => `${value.toFixed(1)} GB`;
            tooltipFormatter = (v: number | null) => {
                if (v == null) return '-';
                return `${Number(v).toFixed(2)} GB`;
            };
        } else if (metricName.includes('IOPS')) {
            yAxisName = `${metricName} (IOPS)`;
            axisLabelFormatter = (value: number) => `${value.toFixed(1)} (IOPS)`;
            tooltipFormatter = (v: number | null) => {
                if (v == null) return '-';
                return `${Number(v).toFixed(2)} (IOPS)`;
            };
        }

        const chartOptions = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: [],
            extraOption: {
                grid: { left: 50, right: 30, top: 50, bottom: 60, containLabel: true },
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
    }, [isDark, seriesData, data, metricName]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    const isEmpty = seriesData.every(s => s.data.length === 0);

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle>{metricName}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-start gap-2 mb-4">
                    <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <p className="text-[10px] text-muted-foreground">
                        Comparando <strong>{data.length}</strong> tenants para la métrica <strong>{metricName}</strong>.
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

export const IntraCloudComputeChartComponent = ({ data }: IntraCloudComputeChartComponentProps) => {
    const uniqueMetrics = useMemo(() => {
        const metrics = new Set<string>();
        data.forEach(tenant => {
            tenant.compute_data.forEach(metric => {
                metrics.add(metric.metric_name);
            });
        });
        return Array.from(metrics).sort();
    }, [data]);

    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            {uniqueMetrics.map(metricName => (
                <SingleMetricChart
                    key={metricName}
                    metricName={metricName}
                    data={data}
                />
            ))}
        </div>
    );
};