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

interface RdsMariaDBCpuUsageChartProps {
    data: MetricPoint[];
    title?: string;
    height?: string;
}

export const RdsMariaDBCpuUsageChart = ({
    data,
    title = "Uso vs No Uso de Cores de CPU",
    height = "300px"
}: RdsMariaDBCpuUsageChartProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);

    useEffect(() => {
        if (!data || data.length === 0 || !chartRef.current) return;

        // Filtrar solo los datos de "Uso de CPU (Promedio)"
        const cpuUsageData = data.filter(item =>
            item.MetricLabel === "Uso de CPU (Promedio)"
        );

        if (cpuUsageData.length === 0) {
            if (chartInstance.current) {
                chartInstance.current.dispose();
                chartInstance.current = null;
            }
            return;
        }

        // Ordenar por timestamp
        const sortedData = cpuUsageData.sort((a, b) =>
            new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime()
        );

        // Convertir datos al formato [timestamp, value] para type: 'time'
        const totalData = sortedData.map(item => [
            new Date(item.Timestamp).getTime(),
            item.total || 0
        ]);

        const usedData = sortedData.map(item => [
            new Date(item.Timestamp).getTime(),
            item.used || 0
        ]);

        const unusedData = sortedData.map(item => [
            new Date(item.Timestamp).getTime(),
            item.unused || 0
        ]);

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
                        backgroundColor: '#f59e0b'
                    }
                },
                formatter: function (params: unknown) {
                    let result = `<strong>${new Date(params[0].value[0]).toLocaleString('es-ES')}</strong><br/>`;
                    params.forEach((param: unknown) => {
                        if (param.value[1] !== null && param.value[1] !== undefined) {
                            result += `${param.marker}${param.seriesName}: ${param.value[1].toFixed(2)}<br/>`;
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
                name: 'Cores',
                nameLocation: 'middle',
                nameGap: 50,
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series: [
                {
                    name: 'Total de Cores',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 4,
                    lineStyle: {
                        width: 3,
                        color: '#f59e0b' // ámbar MariaDB theme
                    },
                    itemStyle: {
                        color: '#f59e0b'
                    },
                    areaStyle: {
                        opacity: 0.1,
                        color: '#f59e0b'
                    },
                    data: totalData
                },
                {
                    name: 'Cores Usados',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 4,
                    lineStyle: {
                        width: 3,
                        color: '#dc2626'
                    },
                    itemStyle: {
                        color: '#dc2626'
                    },
                    areaStyle: {
                        opacity: 0.2,
                        color: '#dc2626'
                    },
                    data: usedData
                },
                {
                    name: 'Cores No Usados',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 4,
                    lineStyle: {
                        width: 3,
                        color: '#10b981'
                    },
                    itemStyle: {
                        color: '#10b981'
                    },
                    areaStyle: {
                        opacity: 0.2,
                        color: '#10b981'
                    },
                    data: unusedData
                }
            ],
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

    // Verificar si existen datos de "Uso de CPU (Promedio)" con campos total, used, unused
    const cpuUsageData = data.filter(item =>
        item.MetricLabel === "Uso de CPU (Promedio)" &&
        (item.total !== undefined || item.used !== undefined || item.unused !== undefined)
    );

    if (cpuUsageData.length === 0) {
        return (
            <div className="flex justify-center items-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                    <div className="text-yellow-400 text-lg mb-2">⚠️</div>
                    <p className="text-gray-500 font-medium">Datos de CPU Usage no disponibles</p>
                    <p className="text-gray-400 text-sm mt-1">
                        Este gráfico requiere datos de Uso de CPU (Promedio) con campos total, used y unused
                    </p>
                </div>
            </div>
        );
    }

    return <div ref={chartRef} style={{ width: '100%', height }} />;
};