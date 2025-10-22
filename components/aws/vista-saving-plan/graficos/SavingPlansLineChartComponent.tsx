'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { EChartsOption } from 'echarts';
import { useTheme } from 'next-themes';
import { useMemo, useRef } from 'react';

interface SavingPlansLineChartComponentProps {
    costUsage: unknown[];
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

const normalizeDay = (date: Date | string) => {
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

        const filteredData = costUsage.filter((item: unknown) => {
            const itemDay = normalizeDay(item.start_date.$date)
            return itemDay >= startDay && itemDay <= endDay
        });

        const services = Array.from(new Set(filteredData.map((i: unknown) => i.dimensions?.SERVICE || 'Otro')));

        const seriesData = services.map((service) => ({
            name: service,
            kind: 'line',
            smooth: true,
            data: days.map((day) =>
                filteredData
                    .filter(
                        (item: unknown) =>
                            normalizeDay(item.start_date.$date) === day &&
                            (item.dimensions?.SERVICE || 'Otro') === service
                    )
                    .reduce((sum, m) => sum + parseFloat(m.amortizedcost.toFixed(2) || 0), 0)
            ),
            extra: {
                label: {
                    show: false,
                    position: 'top',
                    formatter: (val: unknown) => (val.value > 0 ? formatUSD(val.value) : ''),
                },
            }
        }))

        return { seriesData, services, startDay, endDay, days };
    }, [costUsage, endDate, startDate]);

    const option: EChartsOption = useMemo(() => {
        const base = makeBaseOptions({
            legend: costUsageData.services,
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
                tooltip:{
                    valueFormatter(value) {
                        return `$${value}`
                    },
                },
                xAxis: { type: "category", data: costUsageData.days, axisLabel: { rotate: 45 } },
                yAxis: { min: 0 },
                grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true }
            },
        });
        return deepMerge(base, lines);
    }, [costUsageData.chartData])

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');


    return (
        <div className="col-span-1 md:col-span-12 space-y-6">
            <Card className="shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle>Consumo Diario por Servicio</CardTitle>
                </CardHeader>
                <CardContent className="h-[500px]">
                    <div ref={chartRef} className="w-full h-full" />
                </CardContent>
            </Card>
        </div>
    )
}