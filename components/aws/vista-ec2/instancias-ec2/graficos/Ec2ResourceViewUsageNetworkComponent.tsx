'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { bytesToMB } from '@/lib/bytesToMbs';
import { Info } from 'lucide-react';
import { useTheme } from 'next-themes';

interface MetricData {
    MetricLabel: string;
    Timestamp: string;
    Value: number;
}

interface ResourceViewUsageNetworkComponentProps {
    data: { metrics_data: MetricData[] } | null;
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

const tooltipFormatter = (params: unknown) => {
    const date = new Date(params[0].value[0]).toUTCString();
    return (
        `${date}<br/>` +
        params.map((p: unknown) => `${p.marker} ${p.seriesName}: ${p.value[1]} MB/s<br/>`).join('')
    );
};

export const Ec2ResourceViewUsageNetworkComponent = ({ data }: ResourceViewUsageNetworkComponentProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === 'dark';

    const getThemeColors = useCallback(() => {
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
    }, [isDark]);

    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    const { networkInMetric, networkOutMetric } = useMemo(() => {
        const networkInData = data?.metrics_data.filter(item => item.MetricLabel === 'Entrada de Red (Promedio)') || [];
        networkInData.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());
        const networkInMetric: [string, number][] = networkInData.map(item => [item.Timestamp, bytesToMB(item.Value)]);

        const networkOutData = data?.metrics_data.filter(item => item.MetricLabel === 'Salida de Red (Promedio)') || [];
        networkOutData.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());
        const networkOutMetric: [string, number][] = networkOutData.map(item => [item.Timestamp, bytesToMB(item.Value)]);

        return { networkInMetric, networkOutMetric };
    }, [data]);

    const handleResize = useCallback(() => {
        chartInstance.current?.resize();
    }, []);

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

    useEffect(() => {
        if (!chartRef.current) return;

        const colors = getThemeColors();

        const optionsNetworkMetrics: echarts.EChartsOption = {
            animation: networkInMetric.length < 1000,
            animationDuration: 300,
            animationEasing: 'linear',
            progressiveThreshold: 500,
            progressive: 200,
            hoverLayerThreshold: 3000,
            useUTC: true,
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
                data: ['Entrada de Red', 'Salida de Red'],
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
                scale: true,
                axisLabel: {
                    fontSize: 11,
                    formatter: (val: number) => `${val} MBs`,
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
                    ...createSeries('Entrada de Red', networkInMetric, colors.netInColor, colors.netInAreaColor),
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
                },
                {
                    ...createSeries('Salida de Red', networkOutMetric, colors.netOutColor, colors.netOutAreaColor),
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


            ],
            animation: true
        };

        chartInstance.current = echarts.init(chartRef.current, null, {
            renderer: 'canvas'
        });
        chartInstance.current.setOption(optionsNetworkMetrics, {
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
    }, [networkInMetric, networkOutMetric, handleResize, getThemeColors, isDark]);

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
                <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
            </CardContent>
        </Card>
    );
};
