'use client'
import { useCallback, useEffect, useRef } from 'react';
import * as echarts from "echarts"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResourceViewUsageCreditsComponentProps {
    data: unknown
}

export const Ec2ResourceViewUsageCreditsComponent = ({ data, lastCpuCreditBalanceEc2, lastCpuCreditUsageEc2, percentageCreditsUsageEc2, creditsEfficiencyEc2 }: ResourceViewUsageCreditsComponentProps) => {
    // Chart para Credits Metrics
    const chartRefCpuCredits = useRef<HTMLDivElement>(null);
    const chartCpuCreditsInstance = useRef<echarts.ECharts | null>(null);
    // Resize Observer
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    // Métricas de Uso de Créditos
    const creditsUsageData = data ? data.metrics_data.filter(item => item.MetricLabel === "Uso de Créditos CPU (Promedio)") : [];
    creditsUsageData.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
    const creditsUsageMetric = creditsUsageData.map(item => [item.Timestamp, item.Value.toFixed(2)]);
    // Métricas de Créditos Disponibles
    const creditsBalanceData = data ? data.metrics_data.filter(item => item.MetricLabel === "Créditos de CPU Disponibles (Promedio)") : [];
    creditsBalanceData.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
    const creditsBalanceMetric = creditsBalanceData.map(item => [item.Timestamp, item.Value.toFixed(2)]);
    const maxCreditsValue = creditsBalanceData.length > 0
        ? Math.max(...creditsBalanceData.map(item => item.Value))
        : 0;

    const yMaxRaw = Math.ceil(maxCreditsValue * 1.5); // 1628
    const factor = 100; // múltiplo al que quieres redondear
    const yMaxRounded = Math.floor(yMaxRaw / factor) * factor;
    // const yInterval = Math.ceil(yMax / 5 / 50) * 50;

    const handleResize = useCallback(() => {
        if (chartCpuCreditsInstance.current) {
            chartCpuCreditsInstance.current.resize();
        }
    }, []);

    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        const optionsCpuCreditsMetrics: echarts.EChartsOption = {
            // title: {
            //     text: 'Consumo y Balance de Créditos',
            //     left: 'center',
            //     textStyle: {
            //         color: isDarkMode ? '#ffff' : '#000',
            //     }
            // },
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
                        result += `${p.marker} ${p.seriesName}: ${p.value[1]} Créditos<br/>`;
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
            //     data: ['Uso de Créditos', 'Créditos Disponibles'],
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
            //     bottom: 60,
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
                max: yMaxRounded,
                // interval: yInterval,
                axisLabel: {
                    formatter: (value: number) => `${value} Créditos`
                }
            },
            series: [
                {
                    name: 'Uso de Créditos',
                    type: 'line',
                    data: creditsUsageMetric,
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
                    name: 'Créditos Disponibles',
                    type: 'line',
                    data: creditsBalanceMetric,
                    smooth: true,
                    areaStyle: { color: 'rgba(235, 0, 0, 0.3)' },
                    lineStyle: { color: '#e60000' },
                    itemStyle: {
                        color: '#e60000',        // color del punto
                        borderColor: '#ffffff',  // borde del punto
                        borderWidth: 1
                    },
                    emphasis: {
                        focus: 'series'
                    }
                },
            ],
            animation: true,
        };
        if (!chartRefCpuCredits.current) return

        if (chartRefCpuCredits.current) {
            chartCpuCreditsInstance.current = echarts.init(chartRefCpuCredits.current);
            chartCpuCreditsInstance.current.setOption(optionsCpuCreditsMetrics);
        }

        resizeObserverRef.current = new ResizeObserver(handleResize);
        resizeObserverRef.current.observe(chartRefCpuCredits.current);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            resizeObserverRef.current?.disconnect();
            chartCpuCreditsInstance.current?.dispose();
        };
    }, [data, handleResize])

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Consumo y Balance de Créditos</CardTitle>
            </CardHeader>
            <CardContent>
                <div ref={chartRefCpuCredits} className="w-full h-[400px] md:h-[450px] lg:h-[500px]" />
            </CardContent>
        </Card>
    )
}