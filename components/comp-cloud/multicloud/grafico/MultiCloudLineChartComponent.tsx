'use client';

import * as echarts from 'echarts';
import { useEffect, useMemo, useRef } from 'react';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';
import { Loader2 } from 'lucide-react';
import { CloudBillingItem } from '@/lib/CloudBillingItem';
import { CloudProvider } from '@/hooks/useMultiTenantSelection';

interface MultiCloudLineChartProps {
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

const formatMonthName = (yyyyMm: string) => {
    const [y, m] = yyyyMm.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, 1));
    const str = new Intl.DateTimeFormat('es-CL', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const MultiCloudLineChartComponent = ({
    azureData,
    awsData,
    gcpData,
    selectedClouds,
    isLoading,
    startDate,
    endDate,
    dateMode,
    selectedMonths
}: MultiCloudLineChartProps) => {
    const { theme, resolvedTheme } = useTheme();
    const isDark = (resolvedTheme || theme) === 'dark';
    const chartRef = useRef<HTMLDivElement>(null);

    const targetMonthStr = dateMode === 'monthly' 
        ? `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}` 
        : null;

    const monthList = useMemo(() => {
        if (dateMode === 'multi-month' && selectedMonths && selectedMonths.length > 0) {
            return [...selectedMonths].sort();
        }
        const months = [];
        const current = dateMode === 'monthly' 
            ? new Date(startDate.getFullYear(), 0, 1) 
            : new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        while (current <= end) {
            const year = current.getFullYear();
            const month = String(current.getMonth() + 1).padStart(2, '0');
            months.push(`${year}-${month}`);
            current.setMonth(current.getMonth() + 1);
        }
        return months;
    }, [startDate, endDate, dateMode, selectedMonths]);

    const timeChartData = useMemo(() => {
        if (isLoading) return { dates: [], azure: [], aws: [], gcp: [] };

        const dateMap = new Map<string, { azure: number, aws: number, gcp: number }>();
        monthList.forEach(m => dateMap.set(m, { azure: 0, aws: 0, gcp: 0 }));

        const processData = (data: CloudBillingItem[], provider: 'azure' | 'aws' | 'gcp', costField: keyof CloudBillingItem) => {
            if (!Array.isArray(data)) return;
            data.forEach(item => {
                const dateVal = item.date || item.start_date || item.usage_date || item.time_period_start || item.usage_start_time || item.day || item.timePeriod?.start || item.TimePeriod?.Start;
                if (!dateVal) return;
                
                let monthStr = '';
                try {
                    if (typeof dateVal === 'string') {
                        if (dateVal.includes('/')) {
                            const parts = dateVal.split('/');
                            if (parts.length === 3) monthStr = `${parts[2]}-${String(parts[1]).padStart(2, '0')}`;
                        } else {
                            monthStr = dateVal.split('T')[0].substring(0, 7);
                        }
                    } else {
                        monthStr = new Date(dateVal as number | Date).toISOString().substring(0, 7);
                    }
                    if (!monthStr || monthStr.includes('NaN')) return;
                } catch (error) { return; }
                
                if (dateMap.has(monthStr)) {
                    const costValue = Number(item[costField]);
                    if (!isNaN(costValue)) dateMap.get(monthStr)![provider] += costValue;
                }
            });
        };

        if (selectedClouds.includes('azure')) processData(azureData, 'azure', 'cost_in_usd');
        if (selectedClouds.includes('aws')) processData(awsData, 'aws', 'unblendedcost');
        if (selectedClouds.includes('gcp')) processData(gcpData, 'gcp', 'cost_net_usd');

        const azureSeries: number[] = [];
        const awsSeries: number[] = [];
        const gcpSeries: number[] = [];

        monthList.forEach(date => {
            const dayObj = dateMap.get(date)!;
            azureSeries.push(dayObj.azure);
            awsSeries.push(dayObj.aws);
            gcpSeries.push(dayObj.gcp);
        });

        return { dates: monthList, azure: azureSeries, aws: awsSeries, gcp: gcpSeries };
    }, [azureData, awsData, gcpData, isLoading, selectedClouds, monthList]);

    const option = useMemo(() => {
        if (timeChartData.dates.length === 0) return {};
        const dates = timeChartData.dates;

        const base = makeBaseOptions({
            legend: [],
            unitLabel: '$',
            useUTC: true,
            showToolbox: false, 
        });

        const seriesConfig = [];
        const legendData = [];

        const highlightArea = targetMonthStr ? {
            itemStyle: { color: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 138, 215, 0.08)' },
            data: [[ { xAxis: targetMonthStr }, { xAxis: targetMonthStr } ]]
        } : undefined;

        if (selectedClouds.includes('azure')) {
            legendData.push('Azure');
            seriesConfig.push({
                name: 'Azure',
                kind: 'line',
                smooth: true,
                data: timeChartData.azure,
                extra: {
                    itemStyle: { color: '#008ad7' },
                    lineStyle: { width: 1, color: '#008ad7' },
                    areaStyle: { color: '#008ad7', opacity: 0.7 },
                    smooth: true,
                    smoothMonotone: 'x',
                    symbol: 'circle',
                    showSymbol: true,
                    symbolSize: 4,
                    emphasis: { focus: 'series' },
                    markArea: seriesConfig.length === 0 ? highlightArea : undefined
                }
            });
        }

        if (selectedClouds.includes('aws')) {
            legendData.push('AWS');
            seriesConfig.push({
                name: 'AWS',
                kind: 'line',
                smooth: true,
                data: timeChartData.aws,
                extra: {
                    itemStyle: { color: '#ff9900' },
                    lineStyle: { width: 1, color: '#ff9900' },
                    areaStyle: { color: '#ff9900', opacity: 0.7 },
                    smooth: true,
                    smoothMonotone: 'x',
                    symbol: 'circle',
                    showSymbol: true,
                    symbolSize: 4,
                    emphasis: { focus: 'series' },
                    markArea: seriesConfig.length === 0 ? highlightArea : undefined
                }
            });
        }

        if (selectedClouds.includes('gcp')) {
            legendData.push('GCP');
            seriesConfig.push({
                name: 'GCP',
                kind: 'line',
                smooth: true,
                data: timeChartData.gcp,
                extra: {
                    itemStyle: { color: '#ea4335' },
                    lineStyle: { width: 1, color: '#ea4335' },
                    areaStyle: { color: '#ea4335', opacity: 0.7 },
                    smooth: true,
                    smoothMonotone: 'x',
                    symbol: 'circle',
                    showSymbol: true,
                    symbolSize: 4,
                    emphasis: { focus: 'series' },
                    markArea: seriesConfig.length === 0 ? highlightArea : undefined
                }
            });
        }

        const linesOption = createChartOption({
            kind: 'line',
            xAxisType: 'category',
            legend: true,
            legendOption: {
                type: 'scroll',
                orient: 'horizontal',
                top: 6,
                left: 'center',
                textStyle: { fontSize: 11, color: '#666' },
                selectedMode: 'multiple',
                data: legendData,
            },
            tooltip: true,
            tooltipFormatter(params) {
                if (!params || !(Array.isArray(params)) || !params.length) return '';

                const dataIndexObj = params[0] as { dataIndex: number };
                if (typeof dataIndexObj?.dataIndex !== 'number') return '';

                const rawMonth = dates[dataIndexObj.dataIndex];
                const dateStr = formatMonthName(rawMonth);

                const items = (params as unknown[]).map((p) => ({
                    name: (p as { seriesName: string }).seriesName,
                    value: Number((p as { value: unknown }).value || 0),
                    marker: (p as { marker: string }).marker,
                })).filter((i) => (i as { value: number }).value > 0) as { name: string; value: number; marker: string }[];

                if (!items.length) {
                    return `<div style="font-weight:600;margin-bottom:6px">${dateStr}</div>
                      <div style="font-weight:600">Total: $0</div>`;
                }

                items.sort((a, b) => b.value - a.value);
                const total = items.reduce((s, i) => s + i.value, 0);

                const money = (n: number) =>
                    n >= 1_000_000 ? '$' + (n / 1_000_000).toFixed(2) + 'M'
                        : n >= 1_000 ? '$' + (n / 1_000).toFixed(0) + 'K'
                            : '$' + n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                let html = `<div style="font-weight:600;margin-bottom:8px;text-transform:capitalize">${dateStr}</div>`;
                html += `<div style="max-height:280px; overflow:auto; padding-right:4px;">`;

                html += items.map((i) => {
                    const pct = total > 0 ? (i.value / total) * 100 : 0;
                    return `
                    <div style="display:flex;align-items:center;gap:8px;justify-content:space-between;line-height:1.25;margin:3px 0">
                      <div style="display:flex;align-items:center;gap:6px;min-width:0">
                        ${i.marker}
                        <span style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${i.name}</span>
                      </div>
                      <div style="font-variant-numeric: tabular-nums;">
                        <span>${money(i.value)}</span>
                        <span style="color:#666"> · ${pct.toFixed(1)}%</span>
                      </div>
                    </div>`;
                }).join('');

                html += `</div>`;
                html += `
                  <div style="border-top:1px solid #eee;margin-top:8px;padding-top:6px;font-weight:700">
                    Total Consolidado: ${money(total)}
                  </div>`;

                return html;
            },
            series: (seriesConfig as unknown[]).slice().reverse(),
            extraOption: {
                tooltip: {
                    triggerOn: 'mousemove|click',
                    enterable: true,
                    confine: true,
                },
                toolbox: {
                    show: true,
                    top: 0,
                    right: 15,
                    feature: {
                        dataZoom: { yAxisIndex: 'none' },
                        restore: {},
                        saveAsImage: { name: 'tendencia-multinube' }
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: dates,
                    axisLine: { lineStyle: { color: '#d0d0d0' } },
                    axisTick: { show: false },
                    axisLabel: {
                        fontSize: 10,
                        color: (value: string) => value === targetMonthStr ? (isDark ? '#fff' : '#000') : '#666',
                        fontWeight: (value: string) => value === targetMonthStr ? 'bold' : 'normal',
                        formatter: (value: string) => formatMonthName(value),
                        rotate: 45,
                        margin: 8,
                    },
                    splitLine: { show: true, lineStyle: { color: isDark ? '#333' : '#f5f5f5', type: 'dashed' } },
                },
                yAxis: {
                    type: 'value',
                    name: 'Facturación Mensual (USD)',
                    nameTextStyle: { color: '#666', fontSize: 12, padding: [0, 0, 10, 0] },
                    nameGap: 25,
                    axisLine: { show: false },
                    axisTick: { show: false },
                    axisLabel: {
                        formatter: (value: number) => {
                            if (value === 0) return '$0';
                            if (value >= 1_000_000) return '$' + (value / 1_000_000).toFixed(1) + 'M';
                            if (value >= 1_000) return '$' + (value / 1_000).toFixed(0) + 'K';
                            return '$' + value.toLocaleString();
                        },
                        color: '#666',
                        fontSize: 10,
                    },
                    splitLine: { lineStyle: { color: isDark ? '#333' : '#f5f5f5', type: 'dashed' } },
                    min: (v: unknown) => {
                        const obj = v as { min: number; max: number };
                        return Math.max(0, obj.min - (obj.max - obj.min) * 0.1);
                    },
                },
                grid: { left: 60, right: 60, top: 50, bottom: 80, containLabel: true },
            },
        });

        return deepMerge(base, linesOption);
    }, [isDark, timeChartData, selectedClouds, targetMonthStr]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    useEffect(() => {
        const dom = chartRef.current;
        if (!dom) return;

        const chart = echarts.getInstanceByDom(dom);
        if (!chart || (chart as unknown as { isDisposed?: () => boolean }).isDisposed?.()) return;

        let pinned = false;

        const setPinned = (value: boolean) => {
            pinned = value;
            chart.setOption(
                { tooltip: { alwaysShowContent: value, triggerOn: value ? 'none' : 'mousemove|click' } },
                false
            );
            if (!value) chart.dispatchAction({ type: 'hideTip' });
        };

        const onClick = (params: unknown) => {
            setPinned(!pinned);
            if (!pinned) {
                const p = params as { seriesIndex?: number; dataIndex?: number };
                if (typeof p.dataIndex === 'number') {
                    chart.dispatchAction({
                        type: 'showTip',
                        seriesIndex: typeof p.seriesIndex === 'number' ? p.seriesIndex : 0,
                        dataIndex: p.dataIndex,
                    });
                }
            }
        };

        const onZrClick = (e: unknown) => {
            const ev = e as { target?: unknown };
            if (!ev.target && pinned) setPinned(false);
        };

        const onGlobalOut = () => {
            if (!pinned) chart.dispatchAction({ type: 'hideTip' });
        };

        chart.on?.('click', onClick);
        chart.on?.('globalout', onGlobalOut);
        chart.getZr?.()?.on?.('click', onZrClick);

        return () => {
            const currentDom = chartRef.current;
            const inst = currentDom ? echarts.getInstanceByDom(currentDom) : null;
            const disposed = (inst as unknown as { isDisposed?: () => boolean })?.isDisposed?.();
            if (!inst || disposed) return;

            inst.off?.('click', onClick);
            inst.off?.('globalout', onGlobalOut);
            inst.getZr?.()?.off?.('click', onZrClick);
        };
    }, [option]);

    if (isLoading) {
        return (
            <div className="w-full h-[300px] flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-900/50 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                <p className="text-sm text-muted-foreground">Agrupando facturación mensual...</p>
            </div>
        );
    }

    if (timeChartData.dates.length === 0) {
        return (
            <div className="w-full h-[200px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">No hay datos de facturación disponibles en este período.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 pt-2">
            <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
        </div>
    );
};