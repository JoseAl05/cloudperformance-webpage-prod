'use client';

import { useMemo, useRef } from 'react';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';
import { useTheme } from 'next-themes';
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

interface RdsResourceViewCpuUsageComponentProps {
    data: unknown[];
    title?: string;
    height?: string;
}

export const RdsResourceViewCpuUsageComponent = ({
    data,
    title = "% Uso de CPU",
    height = "350px"
}: RdsResourceViewCpuUsageComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const chartRef = useRef<HTMLDivElement>(null);

    const { valueData, yMaxRounded } = useMemo(() => {
        const cpuData = data?.metrics_data.filter(item => item.MetricLabel === 'Uso de CPU (Promedio)') || [];
        cpuData.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());

        const valueData: [string, number][] = cpuData.map(item => [item.Timestamp, item.Value]);

        const maxTotalValue = valueData.length ? Math.max(...valueData.map(item => item[1])) : 0;
        const yMaxRaw = Math.ceil(maxTotalValue * 1.5);
        const yMaxRounded = Math.floor(yMaxRaw / 1) * 1;

        return { valueData, yMaxRounded };
    }, [data]);

    const getThemeColors = () => {
        if (isDark) {
            return {
                background: 'transparent',
                textColor: '#e4e4e7',
                gridColor: '#3f3f46',
                totalColor: '#44ad44',
                totalAreaColor: '#44ad4440',
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
                totalColor: '#009c00',
                totalAreaColor: '#009c003b',
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
            legend: ['% CPU'],
            unitLabel: '%',
            useUTC: true,
            showToolbox: true,
            metricType: 'percent',
        });

        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: [
                {
                    kind: 'line',
                    name: 'Usado',
                    data: valueData,
                    smooth: true,
                    extra: {
                        color: colors.usageColor,
                        markPoint: {
                            symbol: 'pin',
                            symbolSize: valueData.length > 2000 ? 10 : 25,
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
                                        return `${param.name}<br/>${date}<br/>${param.data.coord[1]} %`;
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
                                            return `Max \n${params.data.coord[1]} %`;
                                        }
                                    }
                                },
                                {
                                    type: 'min',
                                    name: 'Min',
                                    label: {
                                        formatter: (params: unknown) => {
                                            return `Min \n${params.data.coord[1]} %`;
                                        }
                                    }
                                },
                                {
                                    coord: valueData.length ? [valueData[valueData.length - 1][0], valueData[valueData.length - 1][1]] : null,
                                    name: 'Último',
                                    value: valueData.length ? valueData[valueData.length - 1][1] : null,
                                    label: {
                                        formatter: (params: unknown) => {
                                            return `Último \n${params.data.coord[1]} %`;
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
                        return `${value.toFixed(2)} %`
                    },
                },
                xAxis: { axisLabel: { rotate: 30 } },
                yAxis: { min: 0 },
                grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
            },
        });

        return deepMerge(base, lines);
    }, [data]);
    useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

    if (!data || data.length === 0) {
        return (
            <div className="flex justify-center items-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                    <div className="text-gray-400 text-lg mb-2">📊</div>
                    <p className="text-gray-500">No hay datos disponibles para mostrar</p>
                </div>
            </div>
        );
    }


    if (!data || data.metrics_data.length === 0) {
        return (
            <div className="flex justify-center items-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="flex flex-col items-center gap-5">
                    {/* <div className="text-yellow-400 text-lg mb-2">¡Ups!</div> */}
                    <MessageCircleWarning className='h-5 w-5 text-yellow-500' />
                    <p className="text-gray-500 font-medium">Métricas de CPU no disponibles</p>
                </div>
            </div>
        );
    }

    return <div ref={chartRef} style={{ width: '100%', height }} />;
};