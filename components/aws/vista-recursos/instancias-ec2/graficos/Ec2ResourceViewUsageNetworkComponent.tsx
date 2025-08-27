'use client'
import { useCallback, useEffect, useRef } from 'react';
import * as echarts from "echarts"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { bytesToMB } from '@/lib/bytesToMbs';

interface ResourceViewUsageNetworkComponentProps {
    data: unknown
}


export const Ec2ResourceViewUsageNetworkComponent = ({ data }: ResourceViewUsageNetworkComponentProps) => {
    // Chart para Network Metrics
    const chartRefNetwork = useRef<HTMLDivElement>(null);
    const chartNetworkInstance = useRef<echarts.ECharts | null>(null);
    // Resize Observer
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    // Métricas de Red
    // Network IN
    const networkInData = data ? data.metrics_data.filter(item => item.MetricLabel === "Entrada de Red (Promedio)") : [];
    networkInData.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
    const networkInMetric = networkInData.map(item => [item.Timestamp, bytesToMB(item.Value)]);
    // Network OUT
    const networkOutData = data ? data.metrics_data.filter(item => item.MetricLabel === "Salida de Red (Promedio)") : [];
    networkOutData.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
    const networkOutMetric = networkOutData.map(item => [item.Timestamp, bytesToMB(item.Value)]);

    const handleResize = useCallback(() => {

        if (chartNetworkInstance.current) {
            chartNetworkInstance.current.resize()
        }
    }, []);

    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        const optionsNetworkMetrics: echarts.EChartsOption = {
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
                        result += `${p.marker} ${p.seriesName}: ${p.value[1]} Mbs<br/>`;
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
            //     data: ['Entrada de Red', 'Salida de Red'],
            //     orient: 'vertical',  // vertical para que se apile
            //     right: 10,            // distancia desde el borde derecho
            //     top: 'middle'         // centrada verticalmente
            // },
            grid: {
                left: 50,
                right: 30,
                top: 60,
                bottom: 60,
                containLabel: true
            },
            // grid: {
            //     left: 50,
            //     right: 180, // deja espacio para la leyenda
            //     top: 50,
            //     bottom: 50,
            //     containLabel: true // asegura que los labels no se corten
            // },
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
                        return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:00`;
                    }
                }
            },
            yAxis: {
                type: 'value',
                scale: true,
                axisLabel: {
                    formatter: (value: number) => `${value} MB/s`
                }
            },
            series: [
                {
                    name: 'Entrada de Red',
                    type: 'line',
                    data: networkInMetric,
                    smooth: true,
                    areaStyle: { color: 'rgba(54, 162, 235, 0.3)' },
                    lineStyle: { color: '#36A2EB' },
                    itemStyle: {
                        color: '#36A2EB',        // color del punto
                        borderColor: '#ffffff',  // borde del punto
                        borderWidth: 1
                    },
                    emphasis: {
                        focus: 'series'
                    }
                },
                {
                    name: 'Salida de Red',
                    type: 'line',
                    data: networkOutMetric,
                    smooth: true,
                    areaStyle: { color: 'rgba(235, 0, 0, 0.3)' },
                    lineStyle: { color: '#e60000' },
                    itemStyle: {
                        color: '#e60000',
                        borderColor: '#ffffff',
                        borderWidth: 1
                    },
                    emphasis: {
                        focus: 'series'
                    }
                },
            ],
            animation: true,
        };
        if (!chartRefNetwork.current) return

        if (chartRefNetwork.current) {
            chartNetworkInstance.current = echarts.init(chartRefNetwork.current);
            chartNetworkInstance.current.setOption(optionsNetworkMetrics);
        }

        resizeObserverRef.current = new ResizeObserver(handleResize);
        resizeObserverRef.current.observe(chartRefNetwork.current);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            resizeObserverRef.current?.disconnect();
            chartNetworkInstance.current?.dispose();
        };
    }, [data, handleResize])
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Entrada y Salida de Red</CardTitle>
            </CardHeader>
            <CardContent>
                <div ref={chartRefNetwork} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
            </CardContent>
        </Card>
    )
}