'use client';

import { useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { MessageCircleWarning } from 'lucide-react';

interface MetricPoint {
    sync_time: { $date: string };
    Resource: string;
    Timestamp: string;
    Value: number;
    total?: number;
    unused?: number;
    used?: number;
    MetricId: string;
    MetricLabel: string;
}

interface RdsResourceViewCpuCreditsComponentProps {
    data: MetricPoint[];
    title?: string;
}

export const RdsResourceViewCpuCreditsComponent = ({
    data,
    title = "Consumo y Balance de Créditos de CPU (Burstable)"
}: RdsResourceViewCpuCreditsComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

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

    const { creditsUsageMetric, creditsBalanceMetric } = useMemo(() => {
        const usageData = (data ?? []).filter(
            item => item.MetricLabel === 'Uso de Créditos de CPU (Promedio)'
        );
        usageData.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());
        const creditsUsageMetric: [string, number][] = usageData.map(item => [
            item.Timestamp,
            +item.Value.toFixed(2),
        ]);

        const balanceData = (data ?? []).filter(
            item => item.MetricLabel === 'Créditos de CPU Disponibles (Promedio)'
        );
        balanceData.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());
        const creditsBalanceMetric: [string, number][] = balanceData.map(item => [
            item.Timestamp,
            +item.Value.toFixed(2),
        ]);

        return { creditsUsageMetric, creditsBalanceMetric };
    }, [data]);

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
                                    if (param.data?.coord) {
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

                                    if (param.data?.coord) {

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
                tooltip: {
                    valueFormatter(value, dataIndex) {
                        return `${value} Créditos`
                    },
                },
                xAxis: { axisLabel: { rotate: 30 } },
                yAxis: { min: 0 },
                grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true }
            },
        });

        return deepMerge(base, lines);
    }, [creditsUsageMetric, creditsBalanceMetric, isDark]);

    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    if (!data || data.length === 0) {
        return (
            <div className="flex justify-center items-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                    <div className="text-gray-400 text-lg mb-2">No data</div>
                    <p className="text-gray-500">No hay datos disponibles para mostrar</p>
                </div>
            </div>
        );
    }

    // Verificar si existen las métricas de CPU Credits específicas
    const allowedMetrics = [
        "Uso de Créditos de CPU (Promedio)",
        "Créditos de CPU Disponibles (Promedio)"
    ];
    console.log(data);

    const hasValidMetrics = data.some(item =>
        allowedMetrics.includes(item.MetricLabel)
    );

    if (!hasValidMetrics) {
        return (
            <div className="flex justify-center items-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="flex flex-col items-center gap-5">
                    {/* <div className="text-yellow-400 text-lg mb-2">¡Ups!</div> */}
                    <MessageCircleWarning className='h-5 w-5 text-yellow-500'/>
                    <p className="text-gray-500 font-medium">Métricas de CPU Credits no disponibles</p>
                </div>
            </div>
        );
    }

    return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};
