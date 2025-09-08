'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface ResourceViewUsageCreditsComponentProps {
    data: {
        metrics_data: { MetricLabel: string; Timestamp: string; Value: number }[];
    } | null;
}

const sliderConfig = [
    {
        type: 'slider',
        xAxisIndex: 0,
        bottom: 20,
        height: 20,
        handleSize: '100%',
        start: 0,
        end: 100,
        realtime: false,
        throttle: 100,
        zoomOnMouseWheel: false,
        moveOnMouseMove: false
    },
    {
        type: 'inside',
        start: 0,
        end: 100,
        filterMode: 'filter',
        throttle: 100,
        zoomOnMouseWheel: true,
        moveOnMouseMove: true
    },
];

const tooltipFormatter = (params: unknown[]) => {
    if (!params.length) return '';
    const date = new Date(params[0].value[0]).toUTCString();
    return (
        `${date}<br/>` +
        params
            .map(p => `${p.marker} ${p.seriesName}: ${p.value[1]} Créditos<br/>`)
            .join('')
    );
};

export const Ec2ResourceViewUsageCreditsComponent = ({ data }: ResourceViewUsageCreditsComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

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

    const getThemeColors = useCallback(() => {
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
    }, [isDark]);

    const createSeries = (name: string, data: [string, number][], color: string, areaColor?: string) => ({
        name,
        type: 'line',
        data,
        smooth: false,
        smoothMonotone: null,
        symbol: 'none',
        symbolSize: 0,
        lineStyle: {
            color,
            width: 2,
            cap: 'round',
            join: 'round'
        },
        itemStyle: { color, borderColor: isDark ? '#18181b' : '#ffffff', borderWidth: 2 },
        emphasis: {
            focus: 'series',
            lineStyle: {
                width: 3
            },
            disabled: data.length > 5000
        },
        blur: {
            lineStyle: {
                opacity: 0.2
            }
        },
        large: data.length > 1000,
        largeThreshold: 1000,
        sampling: data.length > 2000 ? 'lttb' : null,
        progressive: data.length > 1000 ? 0 : undefined,
        progressiveThreshold: data.length > 1000 ? 500 : undefined,
        progressiveChunkMode: data.length > 5000 ? 'mod' : undefined,
        ...(areaColor && {
            areaStyle: {
                color: areaColor,
                opacity: 0.4
            }
        })
    });

    const handleResize = useCallback(() => {
        chartInstance.current?.resize();
    }, []);

    useEffect(() => {
        if (!chartRef.current) return;

        const colors = getThemeColors();

        const optionsCpuCreditsMetrics: echarts.EChartsOption = {
            animation: creditsBalanceMetric.length < 1000,
            animationDuration: 300,
            animationEasing: 'linear',
            progressiveThreshold: 500,
            progressive: 200,
            hoverLayerThreshold: 3000,
            useUTC: true,
            backgroundColor: colors.background,
            dataZoom: sliderConfig.map(config => ({
                ...config,
                textStyle: { color: colors.textColor },
                borderColor: colors.gridColor,
                fillerColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                handleStyle: {
                    color: colors.textColor,
                    borderColor: colors.gridColor,
                },
            })),
            tooltip: {
                trigger: 'axis',
                formatter: tooltipFormatter,
                transitionDuration: 0.1,
                hideDelay: 100,
                backgroundColor: isDark ? '#27272a' : '#ffffff',
                borderColor: colors.gridColor,
                textStyle: {
                    color: colors.textColor,
                    fontSize: 12
                },
                axisPointer: {
                    animation: false
                }
            },
            legend: {
                data: ['Uso de Créditos', 'Créditos Disponibles'],
                top: 10,
                left: 'center',
                animation: false,
                textStyle: {
                    fontSize: 12,
                    color: colors.textColor
                }
            },
            grid: {
                left: 50,
                right: 30,
                top: 60,
                bottom: 60,
                containLabel: true,
                borderColor: colors.gridColor,
            },
            toolbox: {
                feature: {
                    saveAsImage: {
                        pixelRatio: 2,
                        excludeComponents: ['toolbox']
                    }
                },
                iconStyle: {
                    borderColor: colors.gridColor
                },
                emphasis: {
                    iconStyle: {
                        borderColor: colors.gridColor
                    }
                }
            },
            xAxis: {
                type: 'time',
                boundaryGap: false,
                axisLabel: {
                    fontSize: 11,
                    formatter: (value: number) => {
                        const date = new Date(value);
                        return `${date.getUTCDate()}/${date.getUTCMonth() + 1} ${date.getUTCHours()}:00`;
                    },
                    showMaxLabel: true,
                    showMinLabel: true,
                    color: colors.textColor,
                },
                axisLine: { lineStyle: { color: colors.gridColor } },
                axisTick: {
                    show: false,
                    lineStyle: {
                        color: colors.gridColor
                    }
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: colors.gridColor,
                        opacity: 0.3
                    }
                }
            },
            yAxis: {
                type: 'value',
                max: yMaxRounded,
                axisLabel: {
                    fontSize: 11,
                    formatter: (val: number) => `${val} Créditos`,
                    showMaxLabel: true,
                    showMinLabel: true
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: colors.gridColor
                    }
                },
                axisTick: {
                    show: false,
                    lineStyle: {
                        color: colors.gridColor
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: colors.gridColor,
                        type: 'solid',
                        width: 1
                    }
                }
            },
            series: [
                {
                    ...createSeries('Uso de Créditos', creditsUsageMetric, colors.usageColor, colors.usageAreaColor),
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
                                        return `Max \n${params.data.coord[1]} vCores`;
                                    }
                                }
                            },
                            {
                                type: 'min',
                                name: 'Min',
                                label: {
                                    formatter: (params: unknown) => {
                                        return `Min \n${params.data.coord[1]} vCores`;
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
                },
                {
                    ...createSeries('Créditos Disponibles', creditsBalanceMetric, colors.balanceColor, colors.balanceAreaColor),
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
                                        return `Max \n${params.data.coord[1]} vCores`;
                                    }
                                }
                            },
                            {
                                type: 'min',
                                name: 'Min',
                                label: {
                                    formatter: (params: unknown) => {
                                        return `Min \n${params.data.coord[1]} vCores`;
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
                // createSeries('Uso de Créditos', creditsUsageMetric, colors.usageColor, colors.usageAreaColor),
                // createSeries('Créditos Disponibles', creditsBalanceMetric, colors.balanceColor, colors.balanceAreaColor),
            ],
            animation: true,
        };

        chartInstance.current = echarts.init(chartRef.current, null, {
            renderer: 'canvas'
        });
        chartInstance.current.setOption(optionsCpuCreditsMetrics, {
            notMerge: true,
            lazyUpdate: true,
            silent: false
        });

        resizeObserverRef.current = new ResizeObserver(handleResize);
        resizeObserverRef.current.observe(chartRef.current);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            resizeObserverRef.current?.disconnect();
            chartInstance.current?.dispose();
        };

    }, [creditsUsageMetric, creditsBalanceMetric, yMaxRounded, handleResize, isDark, getThemeColors]);

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
