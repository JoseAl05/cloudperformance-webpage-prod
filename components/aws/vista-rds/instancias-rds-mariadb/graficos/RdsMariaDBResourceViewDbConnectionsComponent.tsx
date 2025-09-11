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

interface RdsMariaDBDbConnectionsChartProps {
    data: MetricPoint[];
    title?: string;
    height?: string;
}

export const RdsMariaDBDbConnectionsChart = ({
    data,
    title = "Conexiones a Base de Datos",
    height = "300px"
}: RdsMariaDBDbConnectionsChartProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);

    useEffect(() => {
        if (!data || data.length === 0 || !chartRef.current) return;

        // Filtrar solo los datos de "Conexiones a la Base de Datos (Promedio)"
        const connectionData = data.filter(item =>
            item.MetricLabel === "Conexiones a la Base de Datos (Promedio)"
        );

        if (connectionData.length === 0) {
            if (chartInstance.current) {
                chartInstance.current.dispose();
                chartInstance.current = null;
            }
            return;
        }

        // Ordenar por timestamp
        const sortedData = connectionData.sort((a, b) =>
            new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime()
        );

        // Convertir datos al formato [timestamp, value] para type: 'time'
        const connectionValues = sortedData.map(item => [
            new Date(item.Timestamp).getTime(),
            Number(item.Value.toFixed(0))
        ]);

        // Calcular estadísticas para mostrar información adicional
        const valueNumbers = connectionValues.map(item => item[1]);
        const maxConnections = Math.max(...valueNumbers);
        const minConnections = Math.min(...valueNumbers);
        const avgConnections = Number((valueNumbers.reduce((a, b) => a + b, 0) / valueNumbers.length).toFixed(1));

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
                    fontWeight: 'bold',
                    color: '#374151'
                },
                subtextStyle: {
                    color: '#6b7280',
                    fontSize: 12
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
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#f59e0b',
                borderWidth: 1,
                textStyle: {
                    color: '#374151'
                },
                formatter: function (params: unknown) {
                    const param = params[0];
                    return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px; color: #f59e0b;">
                🔗 ${new Date(param.value[0]).toLocaleString('es-ES')}
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                ${param.marker}
                <span>Conexiones Activas: <strong>${param.value[1]}</strong></span>
              </div>
              <div style="margin-top: 6px; font-size: 11px; color: #6b7280;">
                📊 Max: ${maxConnections} | Min: ${minConnections} | Prom: ${avgConnections}
              </div>
            </div>
          `;
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '60px',
                containLabel: true
            },
            xAxis: {
                type: 'time',
                boundaryGap: false,
                axisLabel: {
                    rotate: 45,
                    fontSize: 10,
                    color: '#6b7280',
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
                },
                axisLine: {
                    lineStyle: {
                        color: '#d1d5db'
                    }
                }
            },
            yAxis: {
                type: 'value',
                name: 'Conexiones',
                nameLocation: 'middle',
                nameGap: 50,
                nameTextStyle: {
                    color: '#374151',
                    fontSize: 12,
                    fontWeight: 'bold'
                },
                axisLabel: {
                    formatter: '{value}',
                    color: '#6b7280'
                },
                axisLine: {
                    lineStyle: {
                        color: '#d1d5db'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#f3f4f6',
                        type: 'dashed'
                    }
                }
            },
            series: [
                {
                    name: 'Conexiones Activas',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 6,
                    lineStyle: {
                        width: 3,
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 1, y2: 0,
                            colorStops: [
                                { offset: 0, color: '#f59e0b' },
                                { offset: 0.5, color: '#d97706' },
                                { offset: 1, color: '#b45309' }
                            ]
                        }
                    },
                    itemStyle: {
                        color: '#f59e0b',
                        borderColor: '#ffffff',
                        borderWidth: 2
                    },
                    areaStyle: {
                        opacity: 0.15,
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: '#f59e0b' },
                                { offset: 1, color: 'rgba(245, 158, 11, 0.1)' }
                            ]
                        }
                    },
                    data: connectionValues,
                    markLine: {
                        silent: true,
                        symbol: ['none', 'none'],
                        label: {
                            show: true,
                            position: 'end',
                            formatter: 'Promedio: {c}',
                            fontSize: 10
                        },
                        lineStyle: {
                            color: '#f59e0b',
                            type: 'dashed',
                            width: 2
                        },
                        data: [
                            {
                                type: 'average',
                                name: 'Promedio'
                            }
                        ]
                    },
                    markPoint: {
                        symbol: 'pin',
                        symbolSize: 50,
                        label: {
                            fontSize: 10,
                            fontWeight: 'bold'
                        },
                        data: [
                            {
                                type: 'max',
                                name: 'Máximo',
                                itemStyle: {
                                    color: '#ef4444'
                                }
                            },
                            {
                                type: 'min',
                                name: 'Mínimo',
                                itemStyle: {
                                    color: '#10b981'
                                }
                            }
                        ]
                    }
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
                        color: '#f59e0b',
                        shadowBlur: 3,
                        shadowColor: 'rgba(245, 158, 11, 0.6)',
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
            <div className="flex justify-center items-center h-96 bg-gradient-to-br from-amber-50 to-yellow-100 rounded-lg border-2 border-dashed border-amber-300">
                <div className="text-center">
                    <div className="text-amber-400 text-3xl mb-3">🔗</div>
                    <p className="text-amber-600 font-medium">No hay datos de conexiones disponibles</p>
                    <p className="text-amber-400 text-sm mt-1">Verifica el rango de fechas seleccionado</p>
                </div>
            </div>
        );
    }

    // Verificar si existen datos de conexiones
    const connectionData = data.filter(item =>
        item.MetricLabel === "Conexiones a la Base de Datos (Promedio)"
    );

    if (connectionData.length === 0) {
        return (
            <div className="flex justify-center items-center h-96 bg-gradient-to-br from-yellow-50 to-amber-100 rounded-lg border-2 border-dashed border-yellow-300">
                <div className="text-center">
                    <div className="text-yellow-500 text-3xl mb-3">⚠️</div>
                    <p className="text-yellow-700 font-medium">Métricas de conexiones no disponibles</p>
                    <p className="text-yellow-600 text-sm mt-1">
                        Este gráfico requiere datos de Conexiones a la Base de Datos (Promedio)
                    </p>
                </div>
            </div>
        );
    }

    return <div ref={chartRef} style={{ width: '100%', height }} />;
};