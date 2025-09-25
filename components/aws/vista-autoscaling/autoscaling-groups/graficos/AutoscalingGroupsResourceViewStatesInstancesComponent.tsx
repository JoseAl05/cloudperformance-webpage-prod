'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface MetricPoint {
    Resource: string;
    Timestamp: string;
    Value: number;
    sync_time: { $date: string };
    MetricLabelFormatted: string;
}

interface AutoscalingGroupsStatesChartProps {
    data: MetricPoint[];
    title?: string;
    height?: string;
}

export const AutoscalingGroupsResourceViewStatesInstancesComponent = ({
    data,
    title = "Estados Instancias Autoscaling Group",
    height = "300px"
}: AutoscalingGroupsStatesChartProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);

    useEffect(() => {
        if (!data || data.length === 0 || !chartRef.current) return;

        // Filtrar solo métricas que terminan en "(Máximo)"
        const maximumMetrics = data.filter(item => 
            item.MetricLabelFormatted && item.MetricLabelFormatted.endsWith('(Máximo)')
        );

        // Filtrar y agrupar datos por tipo de métrica
        const metricsGroups = maximumMetrics.reduce((acc, item) => {
            const metricName = item.MetricLabelFormatted;
            if (!acc[metricName]) {
                acc[metricName] = [];
            }
            acc[metricName].push(item);
            return acc;
        }, {} as Record<string, MetricPoint[]>);

        // Si no hay datos, limpiar el chart
        if (Object.keys(metricsGroups).length === 0) {
            if (chartInstance.current) {
                chartInstance.current.dispose();
                chartInstance.current = null;
            }
            return;
        }

        // Crear o actualizar el chart
        if (chartInstance.current) {
            chartInstance.current.dispose();
        }
        const chart = echarts.init(chartRef.current);
        chartInstance.current = chart;

        // Colores para diferentes estados
        const colors = [
            '#10b981', // Verde - En servicio
            '#f59e0b', // Amarillo - Pendiente
            '#ef4444', // Rojo - Terminando
            '#8b5cf6', // Púrpura - Standby
            '#06b6d4', // Cian - Transición
            '#f97316'  // Naranja - Otros
        ];

        // Crear series para cada métrica
        const series = Object.keys(metricsGroups).map((metricName, index) => {
            const metricData = metricsGroups[metricName];
            
            // Ordenar por timestamp
            const sortedData = metricData.sort((a, b) =>
                new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime()
            );

            // Convertir datos al formato [timestamp, value]
            const seriesData = sortedData.map(item => [
                new Date(item.Timestamp).getTime(),
                item.Value
            ]);

            return {
                name: metricName,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 4,
                lineStyle: {
                    width: 3,
                    color: colors[index % colors.length]
                },
                itemStyle: {
                    color: colors[index % colors.length]
                },
                areaStyle: {
                    opacity: 0.1,
                    color: colors[index % colors.length]
                },
                data: seriesData
            };
        });

        const option: echarts.EChartsOption = {
            title: {
                text: title,
                left: 'center',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#f97316'
                    }
                },
                formatter: function (params: any) {
                    let result = `<strong>${new Date(params[0].value[0]).toLocaleString('es-ES')}</strong><br/>`;
                    params.forEach((param: any) => {
                        if (param.value[1] !== null && param.value[1] !== undefined) {
                            result += `${param.marker}${param.seriesName}: ${param.value[1]}<br/>`;
                        }
                    });
                    return result;
                }
            },
            legend: {
                top: '40px',
                left: 'center',
                orient: 'horizontal',
                textStyle: {
                    fontSize: 12
                },
                type: 'scroll'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '80px',
                containLabel: true
            },
            xAxis: {
                type: 'time',
                boundaryGap: false,
                axisLabel: {
                    rotate: 45,
                    fontSize: 10,
                    formatter: function(value: number) {
                        const date = new Date(value);
                        return date.toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        });
                    },
                    interval: 0,
                    showMaxLabel: true,
                    showMinLabel: true
                }
            },
            yAxis: {
                type: 'value',
                name: 'Cantidad de Instancias',
                nameLocation: 'middle',
                nameGap: 50,
                axisLabel: {
                    formatter: '{value}'
                },
                min: 0
            },
            series: series,
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 100
                },
                {
                    start: 0,
                    end: 100,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23.1h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '80%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    }
                }
            ]
        };

        chart.setOption(option);

        // Manejo del resize
        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartInstance.current) chartInstance.current.dispose();
        };
    }, [data, title, height]);

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

    return <div ref={chartRef} style={{ width: '100%', height }} />;
};