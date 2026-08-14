'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { EChartsOption } from 'echarts';
import { useTheme } from 'next-themes';
import { useMemo, useRef } from 'react';

interface CostUsageItem {
    dimensions?: { SERVICE?: string };
    SERVICE?: string;
    start_date?: { $date?: string } | string;
    amortizedcost?: number | string;
    unblendedcost?: number | string;
    [key: string]: unknown;
}

interface SavingPlansLineChartComponentProps {
    costUsage: CostUsageItem[];
    startDate: Date;
    endDate: Date;
}

const formatUSD = (value: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)

const normalizeDay = (date: Date | string | undefined) => {
    if (!date) return "";
    const d = new Date(date)
    return d.toISOString().split("T")[0]
}

const generateDaysRange = (start: Date, end: Date) => {
    const days: string[] = []
    const current = new Date(start)
    while (current <= end) {
        days.push(normalizeDay(current))
        current.setUTCDate(current.getUTCDate() + 1)
    }
    return days
}

export const SavingPlansLineChartComponent = ({ costUsage, startDate, endDate }: SavingPlansLineChartComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const costUsageData = useMemo(() => {
        const startDay = normalizeDay(startDate)
        const endDay = normalizeDay(endDate)
        const days = generateDaysRange(startDate, endDate)

        const filteredData = costUsage.filter((item) => {
            const rawDate = item.start_date?.$date || item.start_date;
            const itemDay = normalizeDay(rawDate)
            return itemDay >= startDay && itemDay <= endDay
        });

        const realServices = Array.from(new Set(
            filteredData
                .map(i => i.dimensions?.SERVICE || i.SERVICE || 'Otro')
                .filter(srv => !srv.includes("Savings Plans"))
        ));

        const seriesData: Record<string, unknown>[] = realServices.map((service) => ({
            name: service,
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            smooth: true,
            emphasis: { focus: 'series' },
            data: days.map((day) =>
                filteredData
                    .filter(item => {
                        const rawDate = item.start_date?.$date || item.start_date;
                        return normalizeDay(rawDate) === day && (item.dimensions?.SERVICE || item.SERVICE || 'Otro') === service;
                    })
                    .reduce((sum, m) => sum + (Number(m.amortizedcost) || 0), 0)
                    .toFixed(2)
            )
        }));

        const compromisoData = days.map(day => {
            return filteredData
                .filter(item => {
                    const rawDate = item.start_date?.$date || item.start_date;
                    const srv = item.dimensions?.SERVICE || item.SERVICE || '';
                    return normalizeDay(rawDate) === day && srv.includes("Savings Plans");
                })
                .reduce((sum, m) => sum + (Number(m.unblendedcost) || 0), 0)
                .toFixed(2);
        });

        seriesData.push({
            name: 'Compromiso del Plan (Límite)',
            type: 'line',
            smooth: true,
            data: compromisoData,
            itemStyle: { color: '#8b5cf6' },
            lineStyle: { type: 'dashed', width: 3 },
            symbol: 'none',
            z: 10
        });

        const legend = [...realServices, 'Compromiso del Plan (Límite)'];

        return { seriesData, days, legend };
    }, [costUsage, endDate, startDate]);

    const option: EChartsOption = useMemo(() => {
        const base = makeBaseOptions({
            legend: costUsageData.legend,
            legendPos: 'top',
            unitLabel: '$',
            useUTC: true,
            showToolbox: true,
            metricType: 'default',
        });

        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'category',
            legend: true,
            tooltip: true,
            series: costUsageData.seriesData,
            extraOption: {
                tooltip: {
                    trigger: 'axis',
                    valueFormatter(value: number) {
                        return formatUSD(value);
                    },
                },
                xAxis: { type: "category", data: costUsageData.days, axisLabel: { rotate: 45 } },
                yAxis: { min: 0 },
                grid: { left: 56, right: 12, top: 70, bottom: 64, containLabel: true }
            },
        });
        return deepMerge(base, lines);
    }, [costUsageData]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <div className="col-span-1 md:col-span-12 space-y-6">
            <Card className="shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle>Consumo Diario por Servicio vs Compromiso</CardTitle>
                </CardHeader>
                <CardContent className="h-[500px]">
                    <div ref={chartRef} className="w-full h-full" />
                </CardContent>
            </Card>
        </div>
    )
}