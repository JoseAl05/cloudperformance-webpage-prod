'use client'
import { useCallback, useEffect, useRef } from 'react';
import * as echarts from "echarts"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResourceViewUsageCpuComponentProps {
    data: unknown
}


export const Ec2ResourceViewUsageCpuComponent = ({ data }: ResourceViewUsageCpuComponentProps) => {
    // Chart para CPU Metrics
    const chartRefCpuMetrics = useRef<HTMLDivElement>(null);
    const chartCpuMetricsInstance = useRef<echarts.ECharts | null>(null);
    // Resize Observer
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    // Métricas de Uso de CPU
    const cpuData = data ? data.metrics_data.filter(item => item.MetricLabel === "Uso de CPU (Promedio)") : [];
    cpuData.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
    const totalData = cpuData.map(item => [item.Timestamp, item.total]);
    const usedData = cpuData.map(item => [item.Timestamp, item.used]);
    const unusedData = cpuData.map(item => [item.Timestamp, item.unused]);
    const umbralCpu = cpuData.map(item => [item.Timestamp, ((90 * item.total) / 100)]);


    const maxTotalValue = totalData.length > 0
        ? Math.max(...totalData.map(item => item[1]))
        : 0;

    const yMaxRaw = Math.ceil(maxTotalValue * 1.5);
    const factor = 1;
    const yMaxRounded = Math.floor(yMaxRaw / factor) * factor;

    const handleResize = useCallback(() => {
        if (chartCpuMetricsInstance.current) {
            chartCpuMetricsInstance.current.resize();
        }
    }, []);

    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        const optionsCpuMetrics: echarts.EChartsOption = {
            dataZoom: {
                type: 'slider',     // tipo slider
                xAxisIndex: 0,      // aplica al eje X
                bottom: 20,         // distancia desde la parte inferior del contenedor
                height: 20,         // altura del slider
                handleSize: '100%', // tamaño del manejador
                start: 0,           // posición inicial
                end: 100            // posición final
            },
            tooltip: {
                trigger: 'axis',
                formatter: params => {
                    const date = new Date(params[0].value[0]).toUTCString();
                    let result = `${date}<br/>`;
                    params.forEach(p => {
                        result += `${p.marker} ${p.seriesName}: ${p.value[1]} vCores<br/>`;
                    });
                    return result;
                }
            },
            legend: {
                data: ['Uso de Créditos', 'Créditos Disponibles'],
                orient: 'horizontal',
                top: 10,
                left: 'center'
            },
            // legend: {
            //     data: ['Total', 'Umbral Critico', 'Used', 'Unused'],
            //     orient: 'vertical',  // vertical para que se apile
            //     right: 10,            // distancia desde el borde derecho
            //     top: 'middle'         // centrada verticalmente
            // },
            // grid: {
            //     left: 50,
            //     right: 180, // deja espacio para la leyenda
            //     top: 50,
            //     bottom: 50,
            //     containLabel: true // asegura que los labels no se corten
            // },
            grid: {
                left: 50,
                right: 30,
                top: 60,
                bottom: 60,
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'time',
                axisLabel: {
                    formatter: value => {
                        const date = new Date(value);
                        return `${date.getUTCDate()}/${date.getUTCMonth() + 1} ${date.getUTCHours()}:00`;
                    }
                }
            },
            yAxis: {
                type: 'value',
                max: yMaxRounded,
                axisLabel: {
                    formatter: (value: number) => `${value} vCores`
                }
            },
            series: [
                {
                    name: 'Total',
                    type: 'line',
                    data: totalData,
                    smooth: true,
                    areaStyle: { color: 'rgba(54, 162, 235, 0.3)' },
                    lineStyle: { color: '#36A2EB' },
                    itemStyle: {
                        color: '#36A2EB',
                        borderColor: '#ffffff',
                        borderWidth: 1
                    },
                    emphasis: {
                        focus: 'series'
                    }
                },
                {
                    name: 'Used',
                    type: 'line',
                    data: usedData,
                    smooth: true,
                    // areaStyle: { color: 'rgba(81, 243, 162, 0.232)' },
                    lineStyle: { color: '#28e995' },
                    itemStyle: {
                        color: '#28e995',
                        borderColor: '#ffffff',
                        borderWidth: 1
                    },
                    emphasis: {
                        focus: 'series'
                    }
                },
                {
                    name: 'Umbral Critico',
                    type: 'line',
                    data: umbralCpu,
                    smooth: true,
                    // areaStyle: { color: 'rgba(172, 0, 0, 0.286)' },
                    lineStyle: { color: '#ef0000' },
                    itemStyle: {
                        color: '#ef0000',
                        borderColor: '#ffffff',
                        borderWidth: 1
                    },
                    emphasis: {
                        focus: 'series'
                    }
                },
                {
                    name: 'Unused',
                    type: 'line',
                    data: unusedData,
                    smooth: true,
                    lineStyle: { color: '#FF6384' },
                    itemStyle: {
                        color: '#FF6384',
                        borderColor: '#ffffff',
                        borderWidth: 1
                    },
                    emphasis: { focus: 'series' },
                    markPoint: {
                        data: unusedData
                            .map(item => {
                                const timestamp = item[0];
                                const value = item[1];
                                const threshold = 90;
                                if (value > threshold) {
                                    return { name: 'Peak', value, xAxis: timestamp, yAxis: value };
                                }
                                return null;
                            })
                            .filter(Boolean),
                        symbol: 'circle',
                        symbolSize: 10,
                        label: { show: true, formatter: '{c}', color: '#ef0000' }
                    }
                }
            ],
            animation: true,
        };

        if (!chartRefCpuMetrics.current) return

        resizeObserverRef.current = new ResizeObserver(handleResize);
        resizeObserverRef.current.observe(chartRefCpuMetrics.current);
        if (chartRefCpuMetrics.current) {
            chartCpuMetricsInstance.current = echarts.init(chartRefCpuMetrics.current);
            chartCpuMetricsInstance.current.setOption(optionsCpuMetrics);
        }

        window.addEventListener('resize', handleResize);



        return () => {
            window.removeEventListener('resize', handleResize);
            resizeObserverRef.current?.disconnect();
            chartCpuMetricsInstance.current?.dispose();
        };
    }, [data, handleResize])

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Uso de Cores de CPU</CardTitle>
            </CardHeader>
            <CardContent>
                <div ref={chartRefCpuMetrics} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
            </CardContent>
        </Card>
    )
}