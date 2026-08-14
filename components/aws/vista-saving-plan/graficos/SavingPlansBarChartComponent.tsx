'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { EChartsOption } from 'echarts';
import { useTheme } from 'next-themes';
import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, BarChart3 } from 'lucide-react';

interface CostUsageItem {
    dimensions?: { SERVICE?: string };
    SERVICE?: string;
    amortizedcost?: number | string;
    unblendedcost?: number | string;
    [key: string]: unknown;
}

interface SavingPlansBarChartComponentProps {
    costUsage: CostUsageItem[];
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
    
    const [viewMode, setViewMode] = useState<'summary' | 'details'>('summary');

    const { summaryData, detailsData } = useMemo(() => {
        const planResumen = {
            service: "",
            compromisoTotal: 0,
            capacidadNoUsada: 0
        };

        const serviciosDetalle: Record<string, { service: string; usoCubierto: number; gastoOnDemand: number }> = {};

        costUsage.forEach((item) => {
            const service = item.dimensions?.SERVICE || item.SERVICE || "Otro";
            const amortized = Number(item.amortizedcost) || 0;
            const unblended = Number(item.unblendedcost) || 0;

            if (service.includes("Savings Plans")) {
                if (!planResumen.service) {
                    planResumen.service = service; 
                }
                planResumen.compromisoTotal += unblended;
                planResumen.capacidadNoUsada += amortized;
            } else {
                if (!serviciosDetalle[service]) {
                    serviciosDetalle[service] = { 
                        service, 
                        usoCubierto: 0, 
                        gastoOnDemand: 0 
                    };
                }
                serviciosDetalle[service].usoCubierto += amortized;
                serviciosDetalle[service].gastoOnDemand += unblended;
            }
        });

        if (!planResumen.service) {
            planResumen.service = "Savings Plan"; 
        }

        return {
            summaryData: [planResumen],
            detailsData: Object.values(serviciosDetalle)
        };
    }, [costUsage]);

    const option: EChartsOption = useMemo(() => {
        const isSummary = viewMode === 'summary';

        const base = makeBaseOptions({
            legend: isSummary 
                ? ["Compromiso del Plan", "Capacidad no utilizada"] 
                : ["Uso cubierto por el plan", "Gasto extra (On-Demand)"],
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
            series: isSummary ? [
                {
                    name: "Compromiso del Plan",
                    kind: "bar",
                    data: summaryData.map(d => d.compromisoTotal.toFixed(2)),
                    itemStyle: { color: '#8b5cf6' },
                    barMaxWidth: 120
                },
                {
                    name: "Capacidad no utilizada",
                    kind: "bar",
                    data: summaryData.map(d => d.capacidadNoUsada.toFixed(2)),
                    itemStyle: { color: '#f97316' },
                    barMaxWidth: 120
                }
            ] : [
                {
                    name: "Uso cubierto por el plan",
                    kind: "bar",
                    data: detailsData.map(d => d.usoCubierto.toFixed(2)),
                    itemStyle: { color: '#84cc16' }
                },
                {
                    name: "Gasto extra (On-Demand)",
                    kind: "bar",
                    data: detailsData.map(d => d.gastoOnDemand.toFixed(2)),
                    itemStyle: { color: '#3b82f6' }
                }
            ],
            extraOption: {
                tooltip: {
                    filterMode: 'none',
                    valueFormatter(value: number) {
                        return formatUSD(value);
                    },
                },
                xAxis: {
                    type: "category",
                    data: isSummary ? summaryData.map(d => d.service) : detailsData.map(d => d.service),
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
                grid: { left: 56, right: 12, top: 60, bottom: 64, containLabel: true }
            },
        });
        return deepMerge(base, bars);
    }, [viewMode, summaryData, detailsData]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <div className="col-span-1 md:col-span-8 space-y-6">
            <Card className="shadow-lg h-full rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                        <CardTitle>
                            {viewMode === 'summary' ? 'Resumen de Inversión del Plan' : 'Desglose de Consumo por Servicio'}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                            {viewMode === 'summary' 
                                ? 'Muestra el total comprometido frente a lo que no se alcanzó a utilizar.' 
                                : 'Muestra qué servicios específicos consumieron el plan.'}
                        </p>
                    </div>
                    
                    <div>
                        {viewMode === 'summary' ? (
                            <Button variant="outline" size="sm" onClick={() => setViewMode('details')} className="gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Ver Servicios
                            </Button>
                        ) : (
                            <Button variant="outline" size="sm" onClick={() => setViewMode('summary')} className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Volver al Resumen
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="h-[500px]">
                    <div ref={chartRef} className="w-full h-full" />
                </CardContent>
            </Card>
        </div>
    )
}