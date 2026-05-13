'use client';

import { useMemo, useRef } from 'react';
import { createChartOption, makeBaseOptions, useECharts, deepMerge } from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';
import { Loader2 } from 'lucide-react';
import { CloudBillingItem } from '@/lib/CloudBillingItem'; 
import { CloudProvider } from '@/hooks/useMultiTenantSelection';

interface MultiCloudServiceBarProps {
    azureData: CloudBillingItem[];
    awsData: CloudBillingItem[];
    gcpData: CloudBillingItem[];
    selectedClouds: CloudProvider[] | string[];
    isLoading?: boolean;
}

export const MultiCloudServiceBarChartComponent = ({
    azureData,
    awsData,
    gcpData,
    selectedClouds,
    isLoading = false
}: MultiCloudServiceBarProps) => {
    const { theme, resolvedTheme } = useTheme();
    const isDark = (resolvedTheme || theme) === 'dark';
    const chartRef = useRef<HTMLDivElement>(null);

    const serviceData = useMemo(() => {
        if (isLoading) return { names: [], azure: [], aws: [], gcp: [] };

        const topN = 100; 
        const serviceMap = new Map<string, { azure: number, aws: number, gcp: number, total: number }>();

        const getServiceName = (item: CloudBillingItem, provider: 'azure' | 'aws' | 'gcp') => {
            if (provider === 'azure') {
                return item.meter_category || item.product || item.service_name || 'Otros AZURE';
            }
            if (provider === 'aws') {
                return item.SERVICE || item.service || 'Otros AWS';
            }
            if (provider === 'gcp') {
                return item.service || item.service_description || 'Otros GCP';
            }
            return `Otros ${provider.toUpperCase()}`;
        };

        const processData = (data: CloudBillingItem[], provider: 'azure' | 'aws' | 'gcp', costField: keyof CloudBillingItem) => {
            if (!Array.isArray(data)) return;
            data.forEach(item => {
                const name = getServiceName(item, provider);
                const cost = Number(item[costField]) || 0;
                
                if (cost > 0) {
                    const entry = serviceMap.get(name) || { azure: 0, aws: 0, gcp: 0, total: 0 };
                    entry[provider] += cost;
                    entry.total += cost;
                    serviceMap.set(name, entry);
                }
            });
        };

        if (selectedClouds.includes('azure')) processData(azureData, 'azure', 'cost_in_usd');
        if (selectedClouds.includes('aws')) processData(awsData, 'aws', 'unblendedcost');
        if (selectedClouds.includes('gcp')) processData(gcpData, 'gcp', 'cost_net_usd');

        const sortedServices = Array.from(serviceMap.entries()).sort((a, b) => b[1].total - a[1].total);

        const topServices = sortedServices.slice(0, topN);
        const otherServices = sortedServices.slice(topN);

        if (otherServices.length > 0) {
            const otrosAzure = otherServices.reduce((sum, s) => sum + s[1].azure, 0);
            const otrosAws = otherServices.reduce((sum, s) => sum + s[1].aws, 0);
            const otrosGcp = otherServices.reduce((sum, s) => sum + s[1].gcp, 0);
            const otrosTotal = otherServices.reduce((sum, s) => sum + s[1].total, 0);

            topServices.push(['Otros Servicios Agrupados', { azure: otrosAzure, aws: otrosAws, gcp: otrosGcp, total: otrosTotal }]);
        }

        topServices.reverse();

        return {
            names: topServices.map(s => s[0]),
            azure: topServices.map(s => s[1].azure),
            aws: topServices.map(s => s[1].aws),
            gcp: topServices.map(s => s[1].gcp),
        };
    }, [azureData, awsData, gcpData, selectedClouds, isLoading]);

    const option = useMemo(() => {
        if (serviceData.names.length === 0) return {};

        const base = makeBaseOptions({
            legend: [],
            unitLabel: '$',
            showToolbox: true,
        });

        const seriesConfig = [];
        const legendData = [];

        if (selectedClouds.includes('azure')) {
            legendData.push('Azure');
            seriesConfig.push({
                name: 'Azure',
                kind: 'bar',
                data: serviceData.azure,
                extra: {
                    type: 'bar',
                    stack: 'total',
                    barMaxWidth: 20, 
                    itemStyle: { color: '#008ad7', borderRadius: [0, 2, 2, 0] },
                    emphasis: { focus: 'series' }
                }
            });
        }

        if (selectedClouds.includes('aws')) {
            legendData.push('AWS');
            seriesConfig.push({
                name: 'AWS',
                kind: 'bar',
                data: serviceData.aws,
                extra: {
                    type: 'bar',
                    stack: 'total',
                    barMaxWidth: 20,
                    itemStyle: { color: '#ff9900', borderRadius: [0, 2, 2, 0] },
                    emphasis: { focus: 'series' }
                }
            });
        }

        if (selectedClouds.includes('gcp')) {
            legendData.push('GCP');
            seriesConfig.push({
                name: 'GCP',
                kind: 'bar',
                data: serviceData.gcp,
                extra: {
                    type: 'bar',
                    stack: 'total',
                    barMaxWidth: 20,
                    itemStyle: { color: '#ea4335', borderRadius: [0, 2, 2, 0] },
                    emphasis: { focus: 'series' }
                }
            });
        }

        const barOption = createChartOption({
            kind: 'bar',
            xAxisType: 'value',
            legend: true,
            legendOption: {
                data: legendData,
                top: 0, 
            },
            tooltip: true,
            series: seriesConfig,
            extraOption: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    valueFormatter: (value: number) => '$' + value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                },
                dataZoom: [
                    {
                        type: 'slider',
                        yAxisIndex: 0,
                        right: 15,
                        width: 15,
                        start: 0,
                        end: 100,
                        showDetail: false
                    },
                    {
                        type: 'inside',
                        yAxisIndex: 0,
                        zoomOnMouseWheel: true,
                        moveOnMouseMove: true
                    }
                ],
                grid: { left: '2%', right: '6%', bottom: '5%', top: '12%', containLabel: true },
                xAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: (value: number) => {
                            if (value >= 1_000_000) return '$' + (value / 1_000_000).toFixed(1) + 'M';
                            if (value >= 1_000) return '$' + (value / 1_000).toFixed(0) + 'K';
                            return '$' + value;
                        },
                        color: '#666',
                        fontSize: 10,
                    },
                    splitLine: { lineStyle: { color: isDark ? '#333' : '#eee', type: 'dashed' } },
                },
                yAxis: {
                    type: 'category',
                    data: serviceData.names,
                    axisLabel: {
                        width: 200, 
                        overflow: 'truncate',
                        color: isDark ? '#ccc' : '#444',
                        fontSize: 11,
                    },
                    axisTick: { show: false },
                    axisLine: { lineStyle: { color: isDark ? '#444' : '#ddd' } },
                }
            }
        });

        return deepMerge(base, barOption);
    }, [isDark, serviceData, selectedClouds]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    if (isLoading) {
        return (
            <div className="w-full h-[400px] flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-900/50 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                <p className="text-sm text-muted-foreground">Calculando desglose de servicios...</p>
            </div>
        );
    }

    if (serviceData.names.length === 0) {
        return (
            <div className="w-full h-[200px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">No hay datos de servicios disponibles.</p>
            </div>
        );
    }

    return <div ref={chartRef} className="w-full h-[500px]" />;
};