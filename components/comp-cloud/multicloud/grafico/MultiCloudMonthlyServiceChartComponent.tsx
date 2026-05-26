'use client';

import * as echarts from 'echarts';
import { useMemo, useRef } from 'react';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { CloudBillingItem } from '@/lib/CloudBillingItem';
import { CloudProvider } from '@/hooks/useMultiTenantSelection';


interface MultiCloudMonthlyServiceProps {
    azureData: CloudBillingItem[];
    awsData: CloudBillingItem[];
    gcpData: CloudBillingItem[];
    selectedClouds: CloudProvider[] | string[];
    isLoading: boolean;
    startDate: Date;
    endDate: Date;
    dateMode: string;
    selectedMonths: string[];
}

const CATEGORY_COLORS: Record<string, string> = {
    'Cómputo': '#10b981',
    'Bases de Datos': '#3b82f6',
    'Almacenamiento': '#f59e0b',
    'Networking': '#8b5cf6',
    'Otros': '#64748b'
};

const normalizeCategory = (item: CloudBillingItem, provider: 'azure' | 'aws' | 'gcp') => {
    let rawName = '';

    if (provider === 'azure') {
        rawName = item.meter_category || item.product || item.service_name || '';
    } else if (provider === 'aws') {
        rawName = item.SERVICE || item.service || '';
    } else if (provider === 'gcp') {
        rawName = item.service || item.service_description || '';
    }

    const lower = rawName.toLowerCase();

    const computeServices = [
        'compute', 'virtual machine', 'ec2', 'lambda', 'functions',
        'kubernetes', 'aks', 'eks', 'gke', 'ecs', 'fargate',
        'app service', 'cloud run', 'lightsail', 'batch', 'beanstalk', 'engine'
    ];

    const databaseServices = [
        'database', 'sql', 'rds', 'dynamodb', 'cosmos db',
        'elasticache', 'bigquery', 'spanner', 'firestore', 'aurora',
        'redshift', 'redis', 'opensearch', 'mariadb', 'postgres'
    ];

    const storageServices = [
        'storage', 's3', 'blob', 'file system', 'efs', 'ebs',
        'backup', 'ecr', 'glacier', 'persistent disk', 'filestore', 'archive'
    ];

    const networkServices = [
        'network', 'vpc', 'route 53', 'dns', 'load balanc',
        'gateway', 'cloudfront', 'traffic manager', 'bandwidth',
        'expressroute', 'direct connect', 'interconnect', 'cdn', 'front door', 'vpn'
    ];

    if (computeServices.some(kw => lower.includes(kw))) return 'Cómputo';
    if (databaseServices.some(kw => lower.includes(kw))) return 'Bases de Datos';
    if (storageServices.some(kw => lower.includes(kw))) return 'Almacenamiento';
    if (networkServices.some(kw => lower.includes(kw))) return 'Networking';

    return 'Otros';
};

const formatMonthName = (yyyyMm: string) => {
    const [y, m] = yyyyMm.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, 1));
    const str = new Intl.DateTimeFormat('es-CL', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);
    return str.charAt(0).toUpperCase() + str.slice(1);
};

type MonthlyDataMap = Record<string, Record<'azure' | 'aws' | 'gcp', Record<string, number>>>;

export const MultiCloudMonthlyServiceChartComponent = ({
    azureData, awsData, gcpData, selectedClouds, isLoading, startDate, endDate, dateMode, selectedMonths
}: MultiCloudMonthlyServiceProps) => {
    const { theme, resolvedTheme } = useTheme();
    const isDark = (resolvedTheme || theme) === 'dark';
    const chartRef = useRef<HTMLDivElement>(null);

    const monthList = useMemo(() => {
        if (dateMode === 'multi-month' && selectedMonths && selectedMonths.length > 0) return [...selectedMonths].sort();
        const months = [];
        const current = dateMode === 'monthly' ? new Date(startDate.getFullYear(), 0, 1) : new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        while (current <= end) {
            months.push(`${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`);
            current.setMonth(current.getMonth() + 1);
        }
        return months;
    }, [startDate, endDate, dateMode, selectedMonths]);

    const chartData = useMemo(() => {
        if (isLoading) return { dates: [], dataMap: {} as MonthlyDataMap };

        const dataMap: MonthlyDataMap = {};
        monthList.forEach(m => {
            dataMap[m] = { azure: {}, aws: {}, gcp: {} };
            Object.keys(CATEGORY_COLORS).forEach(cat => {
                dataMap[m].azure[cat] = 0; dataMap[m].aws[cat] = 0; dataMap[m].gcp[cat] = 0;
            });
        });

        const processProviderData = (data: CloudBillingItem[], provider: 'azure' | 'aws' | 'gcp', costField: keyof CloudBillingItem) => {
            if (!Array.isArray(data)) return;
            data.forEach(item => {
                const dateVal = item.date || item.start_date || item.usage_date || item.usage_start_time || item.day;
                if (!dateVal) return;

                let monthStr = '';
                if (typeof dateVal === 'string') {
                    if (dateVal.includes('/')) {
                        const parts = dateVal.split('/');
                        monthStr = `${parts[2]}-${String(parts[1]).padStart(2, '0')}`;
                    } else {
                        monthStr = dateVal.split('T')[0].substring(0, 7);
                    }
                } else {
                    monthStr = new Date(dateVal as number | Date).toISOString().substring(0, 7);
                }

                if (dataMap[monthStr]) {
                    const category = normalizeCategory(item, provider);
                    const cost = Number(item[costField]) || 0;
                    dataMap[monthStr][provider][category] += cost;
                }
            });
        };

        if (selectedClouds.includes('azure')) processProviderData(azureData, 'azure', 'cost_in_usd');
        if (selectedClouds.includes('aws')) processProviderData(awsData, 'aws', 'unblendedcost');
        if (selectedClouds.includes('gcp')) processProviderData(gcpData, 'gcp', 'cost_net_usd');

        return { dates: monthList, dataMap };
    }, [azureData, awsData, gcpData, isLoading, selectedClouds, monthList]);

    const option = useMemo(() => {
        if (chartData.dates.length === 0) return {};

        const base = makeBaseOptions({
            legend: { show: true, selectedMode: 'multiple' },
            unitLabel: '$',
            showToolbox: true
        });

        const seriesConfig: Record<string, unknown>[] = [];

        selectedClouds.forEach(provider => {
            const providerKey = provider as 'azure' | 'aws' | 'gcp';

            const providerTotals = chartData.dates.map(month => {
                return Object.keys(CATEGORY_COLORS).reduce((sum, cat) => sum + chartData.dataMap[month][providerKey][cat], 0);
            });

            Object.keys(CATEGORY_COLORS).forEach(category => {
                const dataPoints = chartData.dates.map(month => chartData.dataMap[month][providerKey][category]);

                seriesConfig.push({
                    name: category,
                    kind: 'bar',
                    data: dataPoints,
                    extra: {
                        type: 'bar',
                        stack: providerKey,
                        barMaxWidth: 45,
                        itemStyle: { color: CATEGORY_COLORS[category] },
                        label: { show: false },
                        emphasis: { focus: 'series' }
                    }
                });
            });

            seriesConfig.push({
                name: `Logo-${providerKey}`,
                kind: 'bar',
                legendHoverLink: false,
                legend: { show: false },
                data: chartData.dates.map(() => 0),
                extra: {
                    type: 'bar',
                    stack: providerKey,
                    tooltip: { show: false },
                    itemStyle: { color: 'transparent' },
                    label: {
                        show: true,
                        position: 'top',
                        distance: 5,
                        formatter: (params: echarts.CallbackDataParams) => {
                            const dataIndex = params.dataIndex;
                            const totalMonth = providerTotals[dataIndex];
                            if (totalMonth === 0) return '';
                            if (providerKey === 'aws') return '{awsLogo|}';
                            if (providerKey === 'azure') return '{azureLogo|}';
                            if (providerKey === 'gcp') return '{gcpLogo|}';
                            return '';
                        },
                        rich: {
                            awsLogo: { backgroundColor: { image: '/aws.svg' }, height: 20, width: 20 },
                            azureLogo: { backgroundColor: { image: '/azure.svg' }, height: 20, width: 20 },
                            gcpLogo: { backgroundColor: { image: '/gcp.svg' }, height: 20, width: 20 }
                        }
                    }
                }
            });
        });

        const groupedOption = createChartOption({
            kind: 'bar',
            xAxisType: 'category',
            legend: true,
            tooltip: true,
            series: seriesConfig,
            extraOption: {
                legend: {
                    show: true,
                    top: 0,
                    left: 'center',
                    selectedMode: 'multiple',
                    textStyle: { color: isDark ? '#ccc' : '#666' },
                    data: Object.keys(CATEGORY_COLORS).map(cat => ({
                        name: cat,
                        icon: 'roundRect' 
                    }))
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    formatter: (params: string | number | echarts.CallbackDataParams | echarts.CallbackDataParams[]) => {
                        const paramsArray = Array.isArray(params) ? params : [params as echarts.CallbackDataParams];
                        if (!paramsArray.length) return '';
                        let html = `<div style="font-weight:bold;margin-bottom:8px">${formatMonthName(paramsArray[0].name as string)}</div>`;
                        const byProvider: Record<string, echarts.CallbackDataParams[]> = {};

                        paramsArray.forEach((p) => {
                            const value = Number(p.value || 0);
                            const seriesName = String(p.seriesName || '');
                            const seriesId = String(p.seriesId || '');
                            
                            if (value > 0 && !seriesName.startsWith('Logo-')) {
                                const prov = seriesId.includes('aws') ? 'AWS' : seriesId.includes('azure') ? 'Azure' : 'GCP';
                                if (!byProvider[prov]) byProvider[prov] = [];
                                byProvider[prov].push(p);
                            }
                        });

                        Object.keys(byProvider).forEach(prov => {
                            html += `<div style="margin-top:6px; font-weight:bold; border-bottom: 1px solid #ccc;">${prov}</div>`;
                            let provTotal = 0;
                            byProvider[prov].forEach((p) => {
                                const val = Number(p.value || 0);
                                provTotal += val;
                                html += `<div style="display:flex; justify-content:space-between; margin-top:4px;">
                                            <span>${p.marker} ${p.seriesName}</span>
                                            <span style="font-variant-numeric:tabular-nums; margin-left:12px;">$${val.toLocaleString('es-ES', {minimumFractionDigits:2})}</span>
                                        </div>`;
                            });
                            html += `<div style="text-align:right; font-size:10px; color:#666; margin-top:2px;">Total ${prov}: $${provTotal.toLocaleString('es-ES', {minimumFractionDigits:2})}</div>`;
                        });
                        return html;
                    }
                },
                grid: { left: '3%', right: '4%', bottom: '10%', top: '15%', containLabel: true },
                xAxis: {
                    type: 'category',
                    data: chartData.dates,
                    axisLabel: { formatter: (v: string) => formatMonthName(v), rotate: 45, color: '#666' },
                },
                yAxis: {
                    type: 'value',
                    axisLabel: { formatter: (v: number) => v >= 1000 ? `$${(v/1000).toFixed(0)}K` : `$${v}`, color: '#666' },
                    splitLine: { lineStyle: { type: 'dashed', color: isDark ? '#333' : '#eee' } }
                }
            }
        });

        return deepMerge(base, groupedOption);
    }, [isDark, chartData, selectedClouds]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    if (isLoading) return <div className="h-[400px] flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="w-full">
            <div className="flex flex-col items-center justify-center gap-2 mb-4 bg-gray-50 dark:bg-gray-900/50 py-3 rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 text-[11px] text-gray-500 pt-1 px-4">
                    <span className="font-semibold uppercase tracking-wider">Orden por mes:</span>
                    {selectedClouds.includes('azure') && <div className="flex items-center gap-1"><Image src="/azure.svg" width={12} height={12} alt="Azure"/> Azure</div>}
                    {selectedClouds.includes('aws') && <div className="flex items-center gap-1"><Image src="/aws.svg" width={12} height={12} alt="AWS"/> AWS</div>}
                    {selectedClouds.includes('gcp') && <div className="flex items-center gap-1"><Image src="/gcp.svg" width={12} height={12} alt="GCP"/> GCP</div>}
                </div>
            </div>

            <div ref={chartRef} className="w-full h-[400px]" />
        </div>
    );
};