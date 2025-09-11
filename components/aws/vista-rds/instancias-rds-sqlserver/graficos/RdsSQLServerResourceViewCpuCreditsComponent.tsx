'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface MetricPoint {
    sync_time: { $date: string };
    Resource: string;
    Timestamp: string;
    Value: number;
    total?: number;
    unused?: number;
    used?: number;
    MetricId: string;
    MetricLabel: string;
}

interface RdsCpuCreditsLineChartProps {
    data: MetricPoint[];
    title?: string;
    height?: string;
}

export const RdsCpuCreditsLineChart = ({
    data,
    title = "Consumo y Balance de Créditos de CPU (Burstable)",
    height = "300px"
}: RdsCpuCreditsLineChartProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);

    useEffect(() => {
        if (!data || data.length === 0 || !chartRef.current) return;

        // Filtrar solo las métricas de CPU Credits que necesitamos
        const allowedMetrics = [
            "Uso de Créditos de CPU (Promedio)",
            "Créditos de CPU Disponibles (Promedio)"
        ];

        const filteredData = data.filter(item =>
            allowedMetrics.includes(item.MetricLabel)
        );

        if (filteredData.length === 0) {
            // Si no hay datos de CPU Credits, mostrar mensaje
            if (chartInstance.current) {
                chartInstance.current.dispose();
                chartInstance.current = null;
            }
            return;
        }

        // Agrupar datos por MetricLabel
        const grouped: Record<string, { time: string; value: number; timestamp: Date }[]> = {};

        filteredData.forEach((item) => {
            // Usar el Timestamp del item que viene en formato ISO
            const timestamp = new Date(item.Timestamp);
            const timeFormatted = timestamp.toLocaleString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            if (!grouped[item.MetricLabel]) grouped[item.MetricLabel] = [];
            grouped[item.MetricLabel].push({
                time: timeFormatted,
                value: item.Value,
                timestamp: timestamp
            });
        });

        // Ordenar datos por timestamp dentro de cada grupo
        Object.keys(grouped).forEach(label => {
            grouped[label].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        });

        // Obtener todas las fechas únicas ordenadas (de los datos filtrados)
        const allTimestamps = Array.from(
            new Set(filteredData.map(d => new Date(d.Timestamp).getTime()))
        ).sort((a, b) => a - b);

        const allTimes = allTimestamps.map(timestamp =>
            new Date(timestamp).toLocaleString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        );

        // Crear series - una línea por cada MetricLabel (solo CPU Credits)
        const series = Object.keys(grouped).map((label, index) => {
            // Colores específicos para las métricas de CPU Credits (tema SQL Server azul)
            const colorMap: Record<string, string> = {
                "Uso de Créditos de CPU (Promedio)": '#3b82f6', // azul para uso (SQL Server theme)
                "Créditos de CPU Disponibles (Promedio)": '#10b981' // verde para disponibles
            };

            return {
                name: label,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 4,
                lineStyle: {
                    width: 3,
                    color: colorMap[label] || '#3b82f6'
                },
                itemStyle: {
                    color: colorMap[label] || '#3b82f6'
                },
                areaStyle: {
                    opacity: 0.1,
                    color: colorMap[label] || '#3b82f6'
                },
                data: allTimes.map((timeStr) => {
                    const point = grouped[label].find((p) => p.time === timeStr);
                    return point ? Number(point.value.toFixed(2)) : null;
                }),
            };
        });

        // Crear o actualizar el chart
        if (chartInstance.current) {
            chartInstance.current.dispose();
        }
        const chart = echarts.init(chartRef.current);
        chartInstance.current = chart;

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
                        backgroundColor: '#6a7985'
                    }
                },
                formatter: function (params: unknown) {
                    let result = `<strong>${params[0].axisValue}</strong><br/>`;
                    params.forEach((param: unknown) => {
                        if (param.value !== null) {
                            result += `${param.marker}${param.seriesName}: ${param.value}<br/>`;
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
                type: 'category',
                boundaryGap: false,
                data: allTimes,
                axisLabel: {
                    rotate: 45,
                    fontSize: 10
                }
            },
            yAxis: {
                type: 'value',
                name: 'Valor',
                nameLocation: 'middle',
                nameGap: 50,
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series,
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

    // Verificar si existen las métricas de CPU Credits específicas
    const allowedMetrics = [
        "Uso de Créditos de CPU (Promedio)",
        "Créditos de CPU Disponibles (Promedio)"
    ];

    const hasValidMetrics = data.some(item =>
        allowedMetrics.includes(item.MetricLabel)
    );

    if (!hasValidMetrics) {
        return (
            <div className="flex justify-center items-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                    <div className="text-yellow-400 text-lg mb-2">⚠️</div>
                    <p className="text-gray-500 font-medium">Métricas de CPU Credits no disponibles</p>
                    <p className="text-gray-400 text-sm mt-1">
                        Este gráfico requiere: Uso de Créditos de CPU (Promedio) y Créditos de CPU Disponibles (Promedio)
                    </p>
                </div>
            </div>
        );
    }

    //return <div ref={chartRef} style={{ width: '100%', height }} />;
    return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;

};