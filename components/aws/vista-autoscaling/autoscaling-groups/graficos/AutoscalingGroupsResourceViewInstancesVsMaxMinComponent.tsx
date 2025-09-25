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

interface AutoscalingGroupsInstancesVsMaxMinChartProps {
    data: MetricPoint[];
    title?: string;
    height?: string;
}

export const AutoscalingGroupsResourceViewInstancesVsMaxMinComponent = ({
    data,
    title = "Cantidad Instancias configuradas vs Máximo y Mínimo deseado",
    height = "300px"
}: AutoscalingGroupsInstancesVsMaxMinChartProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);

    useEffect(() => {
        if (!data || data.length === 0 || !chartRef.current) return;

        // Filtrar solo las métricas específicas que necesitamos
        const targetMetrics = [
            "Capacidad Deseada (Promedio)",
            "Tamaño Máximo del Grupo (Promedio)",
            "Tamaño Mínimo del Grupo (Promedio)"
        ];

        const filteredMetrics = data.filter(item => 
            item.MetricLabelFormatted && targetMetrics.includes(item.MetricLabelFormatted)
        );

        // Filtrar y agrupar datos por tipo de métrica
        const metricsGroups = filteredMetrics.reduce((acc, item) => {
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

        // Colores específicos para cada métrica
        const metricColors: Record<string, string> = {
            "Capacidad Deseada (Promedio)": '#f97316', // Naranja - la capacidad actual
            "Tamaño Máximo del Grupo (Promedio)": '#ef4444', // Rojo - límite superior
            "Tamaño Mínimo del Grupo (Promedio)": '#10b981'  // Verde - límite inferior
        };

        // Crear series para cada métrica
        const series = targetMetrics
            .filter(metricName => metricsGroups[metricName])
            .map((metricName) => {
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
                    symbolSize: 5,
                    lineStyle: {
                        width: 3,
                        color: metricColors[metricName]
                    },
                    itemStyle: {
                        color: metricColors[metricName]
                    },
                    areaStyle: metricName === "Capacidad Deseada (Promedio)" ? {
                        opacity: 0.2,
                        color: metricColors[metricName]
                    } : undefined,
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
                formatter: function (params: unknown) {
                    let result = `<strong>${new Date(params[0].value[0]).toLocaleString('es-ES')}</strong><br/>`;
                    params.forEach((param: unknown) => {
                        if (param.value[1] !== null && param.value[1] !== undefined) {
                            result += `${param.marker}${param.seriesName}: ${param.value[1]} instancias<br/>`;
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
                }
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

    // Verificar si existen las métricas específicas
    const targetMetrics = [
        "Capacidad Deseada (Promedio)",
        "Tamaño Máximo del Grupo (Promedio)",
        "Tamaño Mínimo del Grupo (Promedio)"
    ];

    const hasTargetMetrics = data.some(item => 
        item.MetricLabelFormatted && targetMetrics.includes(item.MetricLabelFormatted)
    );

    if (!hasTargetMetrics) {
        return (
            <div className="flex justify-center items-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                    <div className="text-yellow-400 text-lg mb-2">⚠️</div>
                    <p className="text-gray-500 font-medium">Métricas de capacidad no disponibles</p>
                    <p className="text-gray-400 text-sm mt-1">
                        Este gráfico requiere datos de Capacidad Deseada, Tamaño Máximo y Mínimo del Grupo
                    </p>
                </div>
            </div>
        );
    }

    return <div ref={chartRef} style={{ width: '100%', height }} />;
};