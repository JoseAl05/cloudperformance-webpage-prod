'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Info } from 'lucide-react';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';
import { ClusterGkeMetrics } from '@/interfaces/vista-gke/gkeInterfaces';
import useSWR from 'swr';
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent';
import { MessageCard } from '@/components/aws/cards/MessageCards';

interface GkeChartComponentProps {
    instances: string[];
    startDate: string;
    endDate: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0

const SingleMetricChart = ({ metric }: { metric: ClusterGkeMetrics }) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';
    const chartRef = useRef<HTMLDivElement>(null);

    const seriesData = useMemo(() => {
        const groups: Record<string, [string, number][]> = {};

        metric.metric_data.forEach((item) => {
            if (!groups[item.resource_name]) {
                groups[item.resource_name] = [];
            }
            groups[item.resource_name].push([item.timestamp, item.metric_value]);
        });

        return Object.entries(groups).map(([resourceName, dataPoints]) => ({
            name: resourceName,
            type: 'line',
            smooth: true,
            showSymbol: false,
            data: dataPoints.sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()),
        }));
    }, [metric]);

    const option = useMemo(() => {
        const metricName = metric.metric_name;
        const resourceNames = seriesData.map(s => s.name);

        const base = makeBaseOptions({
            legend: resourceNames,
            useUTC: true,
            showToolbox: true,
            metricType: 'default'
        });

        const formatGeneric = (value: number) => {
            if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
            return value.toFixed(1);
        };

        const formatBytes = (value: number) => {
            if (value === 0) return '0 B/s';
            const k = 1024;
            const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];
            const i = Math.floor(Math.log(value) / Math.log(k));
            return parseFloat((value / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        };

        let axisLabelFormatter = formatGeneric;
        let tooltipFormatter = (v: unknown) => v != null ? Number(v).toLocaleString() : '-';

        if (metricName.includes('cpu_utilization') || metricName.includes('percent')) {
            axisLabelFormatter = (value: number) => `${value.toFixed(1)}%`;
            tooltipFormatter = (v: unknown) => v != null ? `${Number(v).toFixed(2)}%` : '-';
        } else if (metricName.includes('throughput')) {
            axisLabelFormatter = formatBytes;
            tooltipFormatter = (v: unknown) => v != null ? formatBytes(Number(v)) : '-';
        }

        const chartOptions = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: [],
            extraOption: {
                grid: { left: 20, right: 30, top: 70, bottom: 50, containLabel: true },
                legend: {
                    type: 'scroll',
                    top: 0
                }
            },
        });

        const specificOptions = {
            tooltip: {
                trigger: 'axis',
                valueFormatter: tooltipFormatter,
            },
            yAxis: {
                name: metricName,
                axisLabel: { formatter: axisLabelFormatter }
            },
            series: seriesData
        };

        return deepMerge(base, deepMerge(chartOptions, specificOptions));
    }, [seriesData, metric]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <Card className="w-full h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">{metric.metric_name.toUpperCase()}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 mb-2">
                    <Info className="w-3 h-3 text-blue-500" />
                    <p className="text-[10px] text-muted-foreground">
                        {seriesData.length} recursos reportando datos.
                    </p>
                </div>
                <div ref={chartRef} className="w-full h-[350px]" />
            </CardContent>
        </Card>
    );
};

export const GkeChartComponent = ({ instances, startDate, endDate }: GkeChartComponentProps) => {

    const gkeMetrics = useSWR(
        instances ? `/api/gcp/bridge/gcp/gke_clusters/gcp_gke_cluster_metrics?date_from=${startDate}&date_to=${endDate}&nodes=${instances.join(',')}` : null,
        fetcher
    )

    const anyLoading =
        gkeMetrics.isLoading

    const anyError =
        !!gkeMetrics.error

    const metricsData: ClusterGkeMetrics[] | null =
        isNonEmptyArray<ClusterGkeMetrics>(gkeMetrics.data) ? gkeMetrics.data : null;

    const hasMetricsData = !!metricsData && metricsData.length > 0;

    const sortedMetrics = useMemo(() => {
        if (!metricsData) return [];
        return [...metricsData].sort((a, b) => a.metric_name.localeCompare(b.metric_name));
    }, [metricsData]);

    if (anyLoading) {
        return <LoaderComponent />
    }

    if (!sortedMetrics) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">No se obtuvieron datos.</div>
            </div>
        )
    }

    if (anyError) {
        return (
            <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
                <MessageCard
                    icon={AlertCircle}
                    title="Error al cargar datos"
                    description="Ocurrió un problema al obtener la información desde la API. Intenta nuevamente o ajusta el rango de fechas."
                    tone="error"
                />
            </div>
        )
    }

    const noneHasData = !hasMetricsData

    if (noneHasData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos métricas ni información de la instancia en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }



    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            {sortedMetrics.map((metricItem) => (
                <SingleMetricChart
                    key={metricItem.metric_name}
                    metric={metricItem}
                />
            ))}
        </div>
    );
};