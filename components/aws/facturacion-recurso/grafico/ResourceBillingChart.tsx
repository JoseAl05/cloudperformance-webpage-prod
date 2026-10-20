'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';
import { useMemo, useRef } from 'react';

interface BillingItem {
    start_date: string;
    end_date: string;
    unblendedcost: number;
}

interface ResourceBillingData {
    service: string;
    resource: string;
    billing: BillingItem[];
}

interface ResourceBillingChartProps {
    data: ResourceBillingData[];
    className?: string;
}

export const ResourceBillingChart = ({ data, className }: ResourceBillingChartProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';
    const chartRef = useRef<HTMLDivElement>(null);

    const colors = isDark
        ? ['#6366f1', '#10b981', '#f59e0b', '#ec4899']
        : ['#4f46e5', '#059669', '#d97706', '#db2777'];

    const option = useMemo(() => {
        const themeColors = {
            textColor: isDark ? '#e4e4e7' : '#3f3f46',
            gridColor: isDark ? '#3f3f46' : '#e4e4e7',
        };

        const allDatesSet = new Set<string>();
        data.forEach(srv => srv.billing.forEach(b => allDatesSet.add(b.start_date)));
        const sortedDates = Array.from(allDatesSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        const series = data.map((srv, index) => {
            const dataMap = new Map(srv.billing.map(b => [b.start_date, b.unblendedcost]));

            const alignedData = sortedDates.map(date => ({
                value: dataMap.get(date) || 0,
                date: date
            }));

            const chartData = alignedData.map(d => [d.date, d.value]);

            return {
                name: srv.service,
                data: chartData,
                kind: 'stackedBar',
                extra: {
                    color: colors[index % colors.length],
                    stack: 'total',
                    barWidth: '60%',
                    itemStyle: { borderRadius: [0, 0, 0, 0] }
                }
            };
        });

        const base = makeBaseOptions({
            legend: data.map(d => d.service),
            unitLabel: 'USD',
            useUTC: true,
            showToolbox: true,
            metricType: 'default',
            legendPos: 'top'
        });

        const chartOptions = createChartOption({
            kind: 'stackedBar',
            xAxisType: 'time',
            series: series,
            extraOption: {
                xAxis: {
                    axisLabel: { color: themeColors.textColor },
                    axisPointer: { label: { show: true } }
                },
                yAxis: {
                    name: 'Costo (USD)',
                    axisLabel: { color: themeColors.textColor },
                    splitLine: { lineStyle: { color: themeColors.gridColor } }
                },
                grid: { left: 50, right: 20, top: 60, bottom: 40, containLabel: true },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    borderColor: themeColors.gridColor,
                    textStyle: { color: themeColors.textColor },
                    valueFormatter: (value: number) => `$${Number(value).toFixed(4)}`
                }
            },
        });

        return deepMerge(base, chartOptions);
    }, [data, isDark, colors]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <Card className={`w-full shadow-sm border-none ${className || ''}`}>
            <CardHeader className='px-0 pt-0 pb-4'>
                <CardTitle className="text-base font-medium text-foreground/80">Evolución Diaria de Costos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div ref={chartRef} className="w-full h-[350px]" />
            </CardContent>
        </Card>
    );
};