'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Database, HardDrive, FileText, MessageSquare, Table as TableIcon, Server } from 'lucide-react';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';
import { bytesToGB } from '@/lib/bytesToMbs';
import { IntraCloudStorage, IntraCloudStorageData, IntraCloudStorageMetrics } from '@/interfaces/vista-intracloud/storage/intraCloudStorageInterfaces';

interface IntraCloudAzureStorageChartComponentProps {
    data?: IntraCloudStorage[];
}

const formatServiceTitle = (serviceType: string) => {
    return serviceType.replace(/_/g, ' ').replace('Service', '').trim();
};

const getServiceIcon = (serviceType: string) => {
    const type = serviceType.toLowerCase();
    if (type.includes('blob')) return <Database className="w-5 h-5 text-blue-500" />;
    if (type.includes('file')) return <FileText className="w-5 h-5 text-green-500" />;
    if (type.includes('queue')) return <MessageSquare className="w-5 h-5 text-orange-500" />;
    if (type.includes('table')) return <TableIcon className="w-5 h-5 text-purple-500" />;
    if (type.includes('account')) return <HardDrive className="w-5 h-5 text-indigo-500" />;
    return <Server className="w-5 h-5 text-slate-500" />;
};

const SingleMetricChart = ({ serviceType, metricName, data }: { serviceType: string; metricName: string; data: IntraCloudStorage[] }) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';
    const chartRef = useRef<HTMLDivElement>(null);

    const seriesData = useMemo(() => {
        return data.map((tenant, index) => {
            const serviceMetrics: IntraCloudStorageMetrics[] = tenant.storage_data[serviceType as keyof IntraCloudStorageData] || [];

            const metricData = serviceMetrics
                .filter((m) => m.metric_name === metricName)
                .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                .map((m) => {
                    let metricValue = m.value;
                    const nameLower = m.metric_name.toLowerCase();

                    if (
                        nameLower.includes("bytes") ||
                        nameLower.includes("capacity") ||
                        nameLower.includes("usage") ||
                        nameLower.includes("ingress") ||
                        nameLower.includes("egress")
                    ) {
                        metricValue = bytesToGB(m.value);
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
    }, [data, serviceType, metricName]);

    const option = useMemo(() => {
        const base = makeBaseOptions({
            legend: data.map((t, index) => `Tenant ${index + 1}`),
            useUTC: true,
            showToolbox: true,
            metricType: 'default',
        });

        const nameLower = metricName.toLowerCase();
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

        if (nameLower.includes('percent') || nameLower.includes('percentage')) {
            yAxisName = `${metricName} (%)`;
            axisLabelFormatter = (value: number) => `${value}%`;
            tooltipFormatter = (v: number | null) => {
                if (v == null) return '-';
                return `${Number(v).toFixed(2)}%`;
            };
        } else if (
            nameLower.includes("bytes") ||
            nameLower.includes("capacity") ||
            nameLower.includes("usage") ||
            nameLower.includes("ingress") ||
            nameLower.includes("egress")
        ) {
            yAxisName = `${metricName} (GB)`;
            axisLabelFormatter = (value: number) => `${value.toFixed(1)} GB`;
            tooltipFormatter = (v: number | null) => {
                if (v == null) return '-';
                return `${Number(v).toFixed(2)} GB`;
            };
        } else if (nameLower.includes('latency')) {
            yAxisName = `${metricName} (ms)`;
            axisLabelFormatter = (value: number) => `${value.toFixed(1)} ms`;
            tooltipFormatter = (v: number | null) => {
                if (v == null) return '-';
                return `${Number(v).toFixed(2)} ms`;
            };
        }

        const chartOptions = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: [],
            extraOption: {
                grid: { left: 60, right: 30, top: 50, bottom: 60, containLabel: true },
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
        <Card className="w-full h-full shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">
                    {metricName}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-start gap-2 mb-4">
                    <Info className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <p className="text-[10px] text-muted-foreground">
                        Comparativa de {data.length} tenants
                    </p>
                </div>
                {isEmpty ? (
                    <div className="w-full h-[250px] flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                        <span className="text-muted-foreground text-xs italic">Sin datos</span>
                    </div>
                ) : (
                    <div ref={chartRef} className="w-full h-[250px]" />
                )}
            </CardContent>
        </Card>
    );
};

export const IntraCloudAzureStorageChartComponent = ({ data }: IntraCloudAzureStorageChartComponentProps) => {
    const groupedCharts = useMemo(() => {
        if (!data) return {};

        const groups: Record<string, Set<string>> = {};

        data.forEach(tenant => {
            if (!tenant.storage_data) return;

            Object.entries(tenant.storage_data).forEach(([serviceType, metrics]) => {
                if (!groups[serviceType]) {
                    groups[serviceType] = new Set();
                }
                metrics.forEach(metric => {
                    groups[serviceType].add(metric.metric_name);
                });
            });
        });

        return groups;
    }, [data]);

    const sortedServiceTypes = useMemo(() => {
        return Object.keys(groupedCharts).sort((a, b) => {
            if (a === 'Storage_Account') return -1;
            if (b === 'Storage_Account') return 1;
            return a.localeCompare(b);
        });
    }, [groupedCharts]);

    if (!data || data.length === 0) {
        return <div className="text-muted-foreground text-sm">No hay datos de almacenamiento para graficar.</div>;
    }

    return (
        <div className="w-full space-y-8">
            {sortedServiceTypes.map((serviceType) => {
                const metrics = Array.from(groupedCharts[serviceType]).sort();

                if (metrics.length === 0) return null;

                return (
                    <div key={serviceType} className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                            <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md">
                                {getServiceIcon(serviceType)}
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                {formatServiceTitle(serviceType)}
                            </h3>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                                {metrics.length} métricas
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                            {metrics.map((metricName) => (
                                <SingleMetricChart
                                    key={`${serviceType}-${metricName}`}
                                    serviceType={serviceType}
                                    metricName={metricName}
                                    data={data}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};