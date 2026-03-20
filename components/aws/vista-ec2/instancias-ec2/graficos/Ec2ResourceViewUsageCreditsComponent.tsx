'use client';

import { useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';

interface ResourceViewUsageCreditsComponentProps {
    data: {
        metrics_data: { MetricLabel: string; Timestamp: string; Value: number }[];
    } | null;
}


export const Ec2ResourceViewUsageCreditsComponent = ({ data }: ResourceViewUsageCreditsComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    console.log(data?.metrics_data.filter(
            item => item.MetricLabel === 'Uso de Créditos CPU (Promedio)'
        ))

    const { creditsUsageMetric, creditsBalanceMetric, yMaxRounded } = useMemo(() => {
        const creditsUsageData = data?.metrics_data.filter(
            item => item.MetricLabel === 'Uso de Créditos CPU (Promedio)'
        ) || [];
        creditsUsageData.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());
        const creditsUsageMetric: [string, number][] = creditsUsageData.map(item => [
            item.Timestamp,
            +item.Value.toFixed(2),
        ]);

        const creditsBalanceData = data?.metrics_data.filter(
            item => item.MetricLabel === 'Créditos de CPU Disponibles (Promedio)'
        ) || [];
        creditsBalanceData.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());
        const creditsBalanceMetric: [string, number][] = creditsBalanceData.map(item => [
            item.Timestamp,
            +item.Value.toFixed(2),
        ]);

        const maxCreditsValue = Math.max(
            creditsUsageData.length ? Math.max(...creditsUsageData.map(item => item.Value)) : 0,
            creditsBalanceData.length ? Math.max(...creditsBalanceData.map(item => item.Value)) : 0
        );

        const yMaxRaw = Math.ceil(maxCreditsValue * 1.5);
        const factor = 100;
        const yMaxRounded = Math.max(10, Math.floor(yMaxRaw / factor) * factor);

        return { creditsUsageMetric, creditsBalanceMetric, yMaxRounded };
    }, [data]);

    const getThemeColors = () => {
        if (isDark) {
            return {
                background: 'transparent',
                textColor: '#e4e4e7',
                gridColor: '#3f3f46',
                usageColor: '#60a5fa',
                usageAreaColor: 'rgba(96, 165, 250, 0.2)',
                balanceColor: '#f87171',
                balanceAreaColor: 'rgba(248, 113, 113, 0.2)',
            };
        } else {
            return {
                background: 'transparent',
                textColor: '#3f3f46',
                gridColor: '#e4e4e7',
                usageColor: '#2563eb',
                usageAreaColor: 'rgba(37, 99, 235, 0.2)',
                balanceColor: '#dc2626',
                balanceAreaColor: 'rgba(220, 38, 38, 0.2)',
            };
        }
    };

    const option = useMemo(() => {
        const colors = getThemeColors();
        const base = makeBaseOptions({
            legend: ['Uso de Créditos', 'Créditos Disponibles'],
            legendPos: 'top',
            unitLabel: 'Créditos',
            useUTC: true,
            showToolbox: true,
            metricType: 'default',
        });

        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: [
                {
                    kind: 'line',
                    name: 'Uso de Créditos',
                    data: creditsUsageMetric,
                    smooth: true,
                    extra: {
                        color: colors.usageColor,
                        markPoint: {
                            symbol: 'pin',
                            symbolSize: creditsUsageMetric.length > 2000 ? 10 : 30,
                            label: {
                                show: false,
                            },
                            itemStyle: {
                                color: colors.usageColor,
                                borderColor: isDark ? '#18181b' : '#ffffff',
                                borderWidth: 2
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: (param: unknown) => {
                                    if (param.data.coord) {
                                        const date = new Date(param.data.coord[0]).toUTCString();
                                        return `${param.name}<br/>${date}<br/>${param.data.coord[1]} Créditos`;
                                    }
                                    return `${param.name}: ${param.value}`;
                                }
                            },
                            data: [
                                {
                                    type: 'max',
                                    name: 'Max',
                                    label: {
                                        formatter: (params: unknown) => {
                                            return `Max \n${params.data.coord[1]} Créditos`;
                                        }
                                    }
                                },
                                {
                                    type: 'min',
                                    name: 'Min',
                                    label: {
                                        formatter: (params: unknown) => {
                                            return `Min \n${params.data.coord[1]} Créditos`;
                                        }
                                    }
                                },
                                {
                                    coord: creditsUsageMetric.length ? [creditsUsageMetric[creditsUsageMetric.length - 1][0], creditsUsageMetric[creditsUsageMetric.length - 1][1]] : null,
                                    name: 'Último',
                                    value: creditsUsageMetric.length ? creditsUsageMetric[creditsUsageMetric.length - 1][1] : null,
                                    label: {
                                        formatter: (params: unknown) => {
                                            return `Último \n${params.data.coord[1]} Créditos`;
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    kind: 'line',
                    name: 'Créditos Disponibles',
                    data: creditsBalanceMetric,
                    smooth: true,
                    extra: {
                        color: colors.balanceColor,
                        markPoint: {
                            symbol: 'pin',
                            symbolSize: creditsBalanceMetric.length > 2000 ? 10 : 30,
                            label: {
                                show: false,
                            },
                            itemStyle: {
                                color: colors.balanceColor,
                                borderColor: isDark ? '#18181b' : '#ffffff',
                                borderWidth: 2
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: (param: unknown) => {
                                    if (param.data.coord) {
                                        const date = new Date(param.data.coord[0]).toUTCString();
                                        return `${param.name}<br/>${date}<br/>${param.data.coord[1]} Créditos`;
                                    }
                                    return `${param.name}: ${param.value}`;
                                }
                            },
                            data: [
                                {
                                    type: 'max',
                                    name: 'Max',
                                    label: {
                                        formatter: (params: unknown) => {
                                            return `Max \n${params.data.coord[1]} Créditos`;
                                        }
                                    }
                                },
                                {
                                    type: 'min',
                                    name: 'Min',
                                    label: {
                                        formatter: (params: unknown) => {
                                            return `Min \n${params.data.coord[1]} Créditos`;
                                        }
                                    }
                                },
                                {
                                    coord: creditsBalanceMetric.length ? [creditsBalanceMetric[creditsBalanceMetric.length - 1][0], creditsBalanceMetric[creditsBalanceMetric.length - 1][1]] : null,
                                    name: 'Último',
                                    value: creditsBalanceMetric.length ? creditsBalanceMetric[creditsBalanceMetric.length - 1][1] : null,
                                    label: {
                                        formatter: (params: unknown) => {
                                            return `Último \n${params.data.coord[1]} Créditos`;
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            ],
            extraOption: {
                xAxis: { axisLabel: { rotate: 30 } },
                yAxis: { min: 0 },
                grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
            },
        });

        return deepMerge(base, lines);
    }, [data]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Consumo y Balance de Créditos</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        Las marcas de tiempo (Timestamps) están en formato <strong>UTC</strong>.
                    </p>
                </div>
                {(!data || data.metrics_data.length === 0) ? (
                    <div className="text-center text-gray-500 py-6">No hay métricas de Créditos disponibles.</div>
                ) : (
                    <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
                )}
            </CardContent>
        </Card>
    );
};
