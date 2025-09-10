'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { ConsumeViewRdsPgCreditsMetrics } from '@/interfaces/vista-consumos/rdsPgConsumeViewInterfaces';

interface RdsConsumeViewUsageCreditsComponentProps {
    data: ConsumeViewRdsPgCreditsMetrics[] | null;
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
        params.map((p: unknown) => `${p.marker} ${p.seriesName}: ${p.value[1]} Créditos<br/>`).join('')
    );
};

export const RdsConsumeViewUsageCreditsComponent = ({ data }: RdsConsumeViewUsageCreditsComponentProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    const safeData = Array.isArray(data) ? data : [];

    const { creditsUsageMetric, creditsBalanceMetric, yMaxRounded } = useMemo(() => {
        const creditsUsageData = safeData.filter(item => typeof item.CpuCreditUsageValue === 'number');
        creditsUsageData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const creditsUsageMetric: [string, number][] = creditsUsageData.map(item => [item.timestamp, +item.CpuCreditUsageValue.toFixed(2)]);

        const creditsBalanceData = safeData.filter(item => typeof item.CpuCreditBalanceValue === 'number');
        creditsBalanceData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const creditsBalanceMetric: [string, number][] = creditsBalanceData.map(item => [item.timestamp, +item.CpuCreditBalanceValue.toFixed(2)]);

        const maxCreditsValue = creditsBalanceData.length ? Math.max(...creditsBalanceData.map(item => item.CpuCreditBalanceValue)) : 0;
        const yMaxRaw = Math.ceil(maxCreditsValue * 1.5);
        const factor = 100;
        const yMaxRounded = Math.max(10, Math.floor(yMaxRaw / factor) * factor);

        return { creditsUsageMetric, creditsBalanceMetric, yMaxRounded };
    }, [data]);

    const handleResize = useCallback(() => {
        chartInstance.current?.resize();
    }, []);

    useEffect(() => {
        if (!chartRef.current) return;

        const optionsCpuCreditsMetrics: echarts.EChartsOption = {
            animation: data.length < 1000,
            animationDuration: 300,
            animationEasing: 'linear',
            progressiveThreshold: 500,
            progressive: 200,
            hoverLayerThreshold: 3000,
            useUTC: true,
            dataZoom: sliderConfig,
            tooltip: {
                trigger: 'axis',
                formatter: tooltipFormatter,
                transitionDuration: 0.1,
                hideDelay: 100,
                backgroundColor: 'rgba(50, 50, 50, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                textStyle: {
                    color: '#fff',
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
                    fontSize: 12
                }
            },
            grid: { left: 50, right: 30, top: 60, bottom: 60, containLabel: true },
            toolbox: {
                feature: {
                    saveAsImage: {
                        pixelRatio: 2,
                        excludeComponents: ['toolbox']
                    }
                },
                iconStyle: {
                    borderColor: '#999'
                },
                emphasis: {
                    iconStyle: {
                        borderColor: '#666'
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
                    showMinLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: '#e0e0e0'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                max: yMaxRounded,
                scale: true,
                axisLabel: {
                    fontSize: 11,
                    formatter: (val: number) => `${val} vCores`,
                    showMaxLabel: true,
                    showMinLabel: true
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: '#f0f0f0',
                        type: 'solid',
                        width: 1
                    }
                }
            },
            series: [
                createSeries('Uso de Créditos', creditsUsageMetric, '#36A2EB', 'rgba(54, 162, 235, 0.3)'),
                createSeries('Créditos Disponibles', creditsBalanceMetric, '#e60000', 'rgba(235, 0, 0, 0.3)')
            ],
            animation: true
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
    }, [creditsUsageMetric, creditsBalanceMetric, yMaxRounded, handleResize]);

    const isEmpty = safeData.length === 0;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Uso de Créditos de CPU</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        Las marcas de tiempo (Timestamps) están en formato <strong>UTC</strong>.
                    </p>
                </div>
                {isEmpty ? (
                    <div className="w-full h-[200px] flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">No hay métricas de créditos disponibles.</p>
                    </div>
                ) : (
                    <div ref={chartRef} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
                )}
            </CardContent>
        </Card>
    );
};

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
    itemStyle: { color, borderColor: '#fff', borderWidth: 1 },
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
