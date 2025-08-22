'use client'

import { useEffect, useRef, useCallback } from 'react';
import useSWR from 'swr';
import * as echarts from "echarts"

interface InstanceEc2CpuMetricsComponentProps {
    startDate: Date,
    endDate: Date,
    instance: string
}

const fetcher = (url: string) =>
    fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            "Content-Type": "application/json"
        }
    }).then(res => res.json())

export const InstanceEc2CpuMetricsComponent = ({ startDate, endDate, instance }: InstanceEc2CpuMetricsComponentProps) => {

    // Chart para CPU Metrics
    const chartRefCpuMetrics = useRef<HTMLDivElement>(null)
    const chartCpuMetricsInstance = useRef<echarts.ECharts | null>(null)
    // Chart para Credits Metrics
    const chartRefCpuCredits = useRef<HTMLDivElement>(null)
    const chartCpuCreditsInstance = useRef<echarts.ECharts | null>(null)
    // Chart para Network Metrics
    const chartRefNetwork = useRef<HTMLDivElement>(null)
    const chartNetworkInstance = useRef<echarts.ECharts | null>(null)
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const { data, error, isLoading } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/vm/instancias-ec2-metrics?date_from=${startDateFormatted}&date_to=${endDateFormatted}&resource=${instance}`,
        fetcher
    )
    // Métricas de Uso de CPU
    const cpuData = data ? data.metrics_data.filter(item => item.MetricLabel === "Uso de CPU (Promedio)") : [];
    cpuData.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
    const totalData = cpuData.map(item => [item.Timestamp, item.total]);
    const usedData = cpuData.map(item => [item.Timestamp, item.used]);
    const unusedData = cpuData.map(item => [item.Timestamp, item.unused]);
    const umbralCpu = cpuData.map(item => [item.Timestamp, ((90 * item.total) / 100)])
    // Métricas de Uso de Créditos
    const creditsUsageData = data ? data.metrics_data.filter(item => item.MetricLabel === "Uso de Créditos CPU (Promedio)") : [];
    creditsUsageData.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
    const creditsUsageMetric = creditsUsageData.map(item => [item.Timestamp, item.Value.toFixed(2)]);
    // Métricas de Créditos Disponibles
    const creditsBalanceData = data ? data.metrics_data.filter(item => item.MetricLabel === "Créditos de CPU Disponibles (Promedio)") : [];
    creditsBalanceData.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
    const creditsBalanceMetric = creditsBalanceData.map(item => [item.Timestamp, item.Value.toFixed(2)]);
    // Métricas de Red
    // Network IN
    const networkInData = data ? data.metrics_data.filter(item => item.MetricLabel === "Entrada de Red (Promedio)") : [];
    networkInData.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
    const networkInMetric = networkInData.map(item => [item.Timestamp, item.Value.toFixed(2)]);
    // Network OUT
    const networkOutData = data ? data.metrics_data.filter(item => item.MetricLabel === "Salida de Red (Promedio)") : [];
    networkOutData.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
    const networkOutMetric = networkOutData.map(item => [item.Timestamp, item.Value.toFixed(2)]);

    const handleResize = useCallback(() => {
        if (chartCpuMetricsInstance.current) {
            chartCpuMetricsInstance.current.resize();
        }
        if (chartCpuCreditsInstance.current){
            chartCpuCreditsInstance.current.resize();
        }

        if (chartNetworkInstance.current){
            chartNetworkInstance.current.resize()
        }
    }, []);

    useEffect(() => {

        const optionsCpuMetrics: echarts.EChartsOption = {
            title: {
                text: 'Uso de CPU (Promedio)',
                left: 'center'
            },
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
                        result += `${p.marker} ${p.seriesName}: ${p.value[1]}<br/>`;
                    });
                    return result;
                }
            },
            legend: {
                data: ['Total', 'Umbral Critico', 'Used', 'Unused'],
                orient: 'vertical',  // vertical para que se apile
                right: 10,            // distancia desde el borde derecho
                top: 'middle'         // centrada verticalmente
            },
            grid: {
                left: 50,
                right: 180, // deja espacio para la leyenda
                top: 50,
                bottom: 50,
                containLabel: true // asegura que los labels no se corten
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            // xAxis: {
            //     type: 'category',
            //     axisLabel: {
            //         formatter: value => {
            //             const date = new Date(value);
            //             return `${date.getUTCDate()}/${date.getUTCMonth() + 1} ${date.getUTCHours()}:00`;
            //         }
            //     }
            // },
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
                scale: true
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

    useEffect(() => {
        const optionsCpuCreditsMetrics: echarts.EChartsOption = {
            title: {
                text: 'Consumo y Balance de Créditos',
                left: 'center'
            },
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
                        result += `${p.marker} ${p.seriesName}: ${p.value[1]}<br/>`;
                    });
                    return result;
                }
            },
            legend: {
                data: ['Uso de Créditos', 'Créditos Disponibles'],
                orient: 'vertical',  // vertical para que se apile
                right: 10,            // distancia desde el borde derecho
                top: 'middle'         // centrada verticalmente
            },
            grid: {
                left: 50,
                right: 180, // deja espacio para la leyenda
                top: 50,
                bottom: 60,
                containLabel: true // asegura que los labels no se corten
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                axisLabel: {
                    formatter: value => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:00`;
                    }
                }
            },
            yAxis: {
                type: 'value',
                scale: true
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
        resizeObserverRef.current.observe(chartRefCpuMetrics.current);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            resizeObserverRef.current?.disconnect();
            chartCpuCreditsInstance.current?.dispose();
        };
    }, [data,handleResize])

    useEffect(() => {
        const optionsNetworkMetrics: echarts.EChartsOption = {
            title: {
                text: 'Entrada y Salida de Red',
                left: 'center'
            },
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
                        result += `${p.marker} ${p.seriesName}: ${p.value[1]}<br/>`;
                    });
                    return result;
                }
            },
            legend: {
                data: ['Entrada de Red', 'Salida de Red'],
                orient: 'vertical',  // vertical para que se apile
                right: 10,            // distancia desde el borde derecho
                top: 'middle'         // centrada verticalmente
            },
            grid: {
                left: 50,
                right: 180, // deja espacio para la leyenda
                top: 50,
                bottom: 50,
                containLabel: true // asegura que los labels no se corten
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                axisLabel: {
                    formatter: value => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:00`;
                    }
                }
            },
            yAxis: {
                type: 'value',
                scale: true
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
        resizeObserverRef.current.observe(chartRefCpuMetrics.current);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            resizeObserverRef.current?.disconnect();
            chartNetworkInstance.current?.dispose();
        };
    }, [data,handleResize])

    if (isLoading) return <div>Cargando...</div>
    if (error) return <div>Error al cargar datos</div>

    return (
        <div className='pt-20'>
            <h1 className='text-xl font-bold'>Métricas</h1>
            <div className='flex flex-col items-center gap-10'>
                <div
                    ref={chartRefCpuMetrics}
                    className='w-full h-[70vh]'
                />
                <div
                    ref={chartRefCpuCredits}
                    className='w-full h-[70vh]'
                />
                <div
                    ref={chartRefNetwork}
                    className='w-full h-[70vh]'
                />
            </div>
            {/* <div className='flex justify-center items-center gap-5'>
                <div
                    ref={chartRefCpuMetrics}
                    className='w-full h-[50vh]'
                />
                <div
                    ref={chartRefCpuCredits}
                    className='w-full h-[50vh]'
                />
            </div>
            <div>
                <div
                    ref={chartRefNetwork}
                    className='w-full h-[50vh]'
                />
            </div> */}
        </div>
    )
}