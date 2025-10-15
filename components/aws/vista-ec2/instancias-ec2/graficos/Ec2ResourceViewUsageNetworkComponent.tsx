'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { bytesToMB } from '@/lib/bytesToMbs';
import { Info } from 'lucide-react';
import { useTheme } from 'next-themes';
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig';

interface MetricData {
    MetricLabel: string;
    Timestamp: string;
    Value: number;
}

interface ResourceViewUsageNetworkComponentProps {
    data: { metrics_data: MetricData[] } | null;
}


export const Ec2ResourceViewUsageNetworkComponent = ({ data }: ResourceViewUsageNetworkComponentProps) => {
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
                netInColor: '#5bbae5',
                netInAreaColor: '#5bb9e542',
                netOutColor: '#d75c5c',
                netOutAreaColor: '#d75c5c41',
            };
        } else {
            return {
                background: 'transparent',
                textColor: '#3f3f46',
                gridColor: '#e4e4e7',
                netInColor: '#0d9de0',
                netInAreaColor: '#0d9de048',
                netOutColor: '#d50b0b',
                netOutAreaColor: '#d50b0b47',
            };
        }
    };

    const { networkInMetric, networkOutMetric } = useMemo(() => {
        const networkInData = data?.metrics_data.filter(item => item.MetricLabel === 'Entrada de Red (Promedio)') || [];
        networkInData.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());
        const networkInMetric: [string, number][] = networkInData.map(item => [item.Timestamp, bytesToMB(item.Value)]);

        const networkOutData = data?.metrics_data.filter(item => item.MetricLabel === 'Salida de Red (Promedio)') || [];
        networkOutData.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());
        const networkOutMetric: [string, number][] = networkOutData.map(item => [item.Timestamp, bytesToMB(item.Value)]);

        return { networkInMetric, networkOutMetric };
    }, [data]);

    const option = useMemo(() => {
        const colors = getThemeColors();
        const base = makeBaseOptions({
            legend: ['Entrada de Red', 'Salida de Red'],
            unitLabel: 'MBs',
            useUTC: true,
            showToolbox: true,
            metricType: 'mb',
        });

        const lines = createChartOption({
            kind: 'line',
            xAxisType: 'time',
            legend: true,
            tooltip: true,
            series: [
                {
                    kind: 'line',
                    name: 'Entrada de Red',
                    data: networkInMetric,
                    smooth: true,
                    extra: {
                        color: colors.netInColor,
                        markPoint: {
                            symbol: 'pin',
                            symbolSize: networkInMetric.length > 2000 ? 10 : 30,
                            itemStyle: {
                                color: colors.netInColor,
                                borderColor: isDark ? '#18181b' : '#ffffff',
                                borderWidth: 2
                            },
                            label: {
                                show: false,
                                // formatter: '{c}',
                                // color: '#fff',
                                // fontSize: 10,
                                // backgroundColor: colors.netInAreaColor,
                                // padding: [2, 4],
                                // borderRadius: 4,
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: (param: unknown) => {
                                    if (param.data.coord) {
                                        const date = new Date(param.data.coord[0]).toUTCString();
                                        return `${param.name}<br/>${date}<br/>${param.data.coord[1]} MBs`;
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
                                            return `Max \n${params.data.coord[1]} MBs`;
                                        }
                                    }
                                },
                                {
                                    type: 'min',
                                    name: 'Min',
                                    label: {
                                        formatter: (params: unknown) => {
                                            return `Min \n${params.data.coord[1]} MBs`;
                                        }
                                    }
                                },
                                {
                                    coord: networkInMetric.length ? [networkInMetric[networkInMetric.length - 1][0], networkInMetric[networkInMetric.length - 1][1]] : null,
                                    name: 'Último',
                                    value: networkInMetric.length ? networkInMetric[networkInMetric.length - 1][1] : null,
                                    label: {
                                        formatter: (params: unknown) => {
                                            return `Último \n${params.data.coord[1]} MBs`;
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    kind: 'line',
                    name: 'Salida de Red',
                    data: networkOutMetric,
                    smooth: true,
                    extra: {
                        color: colors.netOutColor,
                        markPoint: {
                            symbol: 'pin',
                            symbolSize: networkOutMetric.length > 2000 ? 10 : 30,
                            label: {
                                show: false,
                                // formatter: '{c}',
                                // color: '#fff',
                                // fontSize: 10,
                                // backgroundColor: colors.netOutAreaColor,
                                // padding: [2, 4],
                                // borderRadius: 4,
                            },
                            itemStyle: {
                                color: colors.netOutColor,
                                borderColor: isDark ? '#18181b' : '#ffffff',
                                borderWidth: 2
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: (param: unknown) => {
                                    if (param.data.coord) {
                                        const date = new Date(param.data.coord[0]).toUTCString();
                                        return `${param.name}<br/>${date}<br/>${param.data.coord[1]} MBs`;
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
                                            return `Max \n${params.data.coord[1]} MBs`;
                                        }
                                    }
                                },
                                {
                                    type: 'min',
                                    name: 'Min',
                                    label: {
                                        formatter: (params: unknown) => {
                                            return `Min \n${params.data.coord[1]} MBs`;
                                        }
                                    }
                                },
                                {
                                    coord: networkOutMetric.length ? [networkOutMetric[networkOutMetric.length - 1][0], networkOutMetric[networkOutMetric.length - 1][1]] : null,
                                    name: 'Último',
                                    value: networkOutMetric.length ? networkOutMetric[networkOutMetric.length - 1][1] : null,
                                    label: {
                                        formatter: (params: unknown) => {
                                            return `Último \n${params.data.coord[1]} MBs`;
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
                <CardTitle>Entrada y Salida de Red</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        Las marcas de tiempo (Timestamps) están en formato <strong>UTC</strong>.
                    </p>
                </div>
                {(!data || data.metrics_data.length === 0) ? (
                    <div className="text-center text-gray-500 py-6">No hay métricas de Red disponibles.</div>
                ) : (
                    <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
                )}
            </CardContent>
        </Card>
    );
};
