'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { EChartsOption } from 'echarts';
import { useTheme } from 'next-themes';
import { useMemo, useRef } from 'react';

interface SavingPlansBarChartComponentProps {
    costUsage: unknown[];
}

const formatUSD = (value: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)

export const SavingPlansBarChartComponent = ({ costUsage }: SavingPlansBarChartComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const costUsageData = useMemo(() => {
        const aggregated = costUsage.reduce((acc: unknown, item: unknown) => {
            const service = item.dimensions?.SERVICE || "Otro"
            const amortized = Number(item.amortizedcost) || 0
            const unblended = Number(item.unblendedcost) || 0

            if (!acc[service]) acc[service] = { service, amortizedcost: 0, unblendedcost: 0 }
            acc[service].amortizedcost += amortized
            acc[service].unblendedcost += unblended

            return acc
        }, {});

        const chartData = Object.values(aggregated);

        return { chartData };
    }, [costUsage]);

    const option: EChartsOption = useMemo(() => {
        const base = makeBaseOptions({
            legend: ["Facturado sin el plan", "Facturado con el plan"],
            legendPos: 'top',
            unitLabel: '$',
            useUTC: true,
            showToolbox: true,
            metricType: 'default',
        });

        const bars = createChartOption({
            kind: 'bar',
            xAxisType: 'category',
            legend: true,
            tooltip: true,
            series: [
                {
                    name: "Facturado sin el plan",
                    kind: "bar",
                    data: costUsageData.chartData?.map((d: unknown) => d.amortizedcost.toFixed(2)),
                    smooth: true,
                },
                {
                    name: "Facturado con el plan",
                    kind: "bar",
                    data: costUsageData.chartData?.map((d: unknown) => d.unblendedcost.toFixed(2)),
                }
            ],
            extraOption: {
                tooltip: {
                    valueFormatter(value) {
                        return `$${value}`
                    },
                },
                xAxis: {
                    type: "category",
                    data: costUsageData.chartData.map((d: unknown) => d.service),
                    axisLabel: {
                        interval: 0,
                        formatter: (value: string) =>
                            value.split(" ").reduce((acc, word, i) => {
                                if (i % 2 === 0) acc.push([])
                                acc[acc.length - 1].push(word)
                                return acc
                            }, [] as string[][]).map(w => w.join(" ")).join("\n"),
                    },
                },
                yAxis: { min: 0 },
                grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true }
            },
        });
        return deepMerge(base, bars);
    }, [costUsageData.chartData])

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');


    return (
        <div className="col-span-1 md:col-span-8 space-y-6">
            <Card className="shadow-lg h-full rounded-2xl">
                <CardHeader>
                    <CardTitle>Consumo Acumulado por Servicio</CardTitle>
                </CardHeader>
                <CardContent className="h-[500px]">
                    <div ref={chartRef} className="w-full h-full" />
                </CardContent>
            </Card>
        </div>
    )
}