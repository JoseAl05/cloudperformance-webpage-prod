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

interface RdsOracleStorageChartProps {
    data: MetricPoint[];
    title?: string;
    height?: string;
}

export const RdsOracleStorageChart = ({
    data,
    title = "Storage Disponible",
    height = "300px"
}: RdsOracleStorageChartProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);

    // Función para convertir bytes a GB
    const bytesToGB = (bytes: number): number => {
        return Number((bytes / (1024 * 1024 * 1024)).toFixed(3));
    };

    // Función para formatear storage a unidades apropiadas
    const formatStorage = (bytes: number): { value: number; unit: string } => {
        if (bytes === 0) return { value: 0, unit: 'GB' };

        const units = [
            { name: 'GB', factor: 1024 * 1024 * 1024 },
            { name: 'TB', factor: 1024 * 1024 * 1024 * 1024 },
            { name: 'PB', factor: 1024 * 1024 * 1024 * 1024 * 1024 }
        ];

        for (let i = units.length - 1; i >= 0; i--) {
            if (bytes >= units[i].factor) {
                return {
                    value: Number((bytes / units[i].factor).toFixed(3)),
                    unit: units[i].name
                };
            }
        }

        return { value: bytesToGB(bytes), unit: 'GB' };
    };

    const formatStorageString = (bytes: number): string => {
        const formatted = formatStorage(bytes);
        return `${formatted.value} ${formatted.unit}`;
    };

    useEffect(() => {
        if (!data || data.length === 0 || !chartRef.current) return;

        // Filtrar solo los datos de "Espacio de Almacenamiento Libre (Promedio)"
        const storageData = data.filter(item =>
            item.MetricLabel === "Espacio de Almacenamiento Libre (Promedio)"
        );

        if (storageData.length === 0) {
            if (chartInstance.current) {
                chartInstance.current.dispose();
                chartInstance.current = null;
            }
            return;
        }

        // Ordenar por timestamp
        const sortedData = storageData.sort((a, b) =>
            new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime()
        );

        const storageValues = sortedData.map(item => item.Value);

        // Calcular estadísticas
        const maxStorage = Math.max(...storageValues);
        const minStorage = Math.min(...storageValues);
        const avgStorage = storageValues.reduce((a, b) => a + b, 0) / storageValues.length;

        // Determinar si es mejor mostrar en GB o TB
        const avgFormatted = formatStorage(avgStorage);
        const shouldUseTB = avgFormatted.unit === 'TB';

        const displayUnit = shouldUseTB ? 'TB' : 'GB';
        const unitDivisor = shouldUseTB ? (1024 * 1024 * 1024 * 1024) : (1024 * 1024 * 1024);

        // Convertir datos al formato [timestamp, value] para type: 'time'
        const timeSeriesData = sortedData.map(item => [
            new Date(item.Timestamp).getTime(),
            Number((item.Value / unitDivisor).toFixed(3))
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
                    fontWeight: 'bold',
                    color: '#1f2937'
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
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#f97316',
                borderWidth: 2,
                textStyle: {
                    color: '#1f2937'
                },
                formatter: function (params: unknown) {
                    const param = params[0];
                    const originalValue = storageValues[param.dataIndex];
                    const percentageFree = ((originalValue / maxStorage) * 100).toFixed(1);

                    return `
            <div style="padding: 10px;">
              <div style="font-weight: bold; margin-bottom: 6px; color: #f97316;">
                💾 ${new Date(param.value[0]).toLocaleString('es-ES')}
              </div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                ${param.marker}
                <span>Espacio Libre: <strong>${formatStorageString(originalValue)}</strong></span>
              </div>
              <div style="background: linear-gradient(90deg, #f9731620, #ea580c20); padding: 6px; border-radius: 4px; margin: 6px 0;">
                <div style="font-size: 12px; color: #f97316;">
                  📊 <strong>Análisis de Capacidad:</strong>
                </div>
                <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">
                  • Espacio libre actual: ${percentageFree}% del máximo observado<br/>
                  • Máximo registrado: ${formatStorageString(maxStorage)}<br/>
                  • Mínimo registrado: ${formatStorageString(minStorage)}<br/>
                  • Promedio general: ${formatStorageString(avgStorage)}
                </div>
              </div>
              ${originalValue < (avgStorage * 0.5) ?
                            '<div style="color: #ef4444; font-size: 11px; font-weight: bold;">⚠️ Advertencia: Espacio bajo</div>' :
                            originalValue > (avgStorage * 1.5) ?
                                '<div style="color: #10b981; font-size: 11px; font-weight: bold;">✅ Estado: Espacio óptimo</div>' : ''
                        }
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
                name: `Almacenamiento (${displayUnit})`,
                nameLocation: 'middle',
                nameGap: 60,
                nameTextStyle: {
                    color: '#1f2937',
                    fontSize: 12,
                    fontWeight: 'bold'
                },
                axisLabel: {
                    formatter: (value: number) => `${value} ${displayUnit}`,
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
                    name: 'Espacio Libre',
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
                                { offset: 0, color: '#f97316' },
                                { offset: 0.3, color: '#ea580c' },
                                { offset: 0.7, color: '#dc2626' },
                                { offset: 1, color: '#b91c1c' }
                            ]
                        }
                    },
                    itemStyle: {
                        color: '#f97316',
                        borderColor: '#ffffff',
                        borderWidth: 3
                    },
                    areaStyle: {
                        opacity: 0.2,
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: '#f97316' },
                                { offset: 0.5, color: 'rgba(249, 115, 22, 0.4)' },
                                { offset: 1, color: 'rgba(249, 115, 22, 0.1)' }
                            ]
                        }
                    },
                    data: timeSeriesData,
                    markLine: {
                        silent: true,
                        symbol: ['none', 'none'],
                        label: {
                            show: true,
                            position: 'end',
                            formatter: (params: unknown) => {
                                const avgDisplay = Number((avgStorage / unitDivisor).toFixed(3));
                                return `Promedio: ${avgDisplay} ${displayUnit}`;
                            },
                            fontSize: 10,
                            color: '#f59e0b'
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
                            fontSize: 9,
                            fontWeight: 'bold'
                        },
                        data: [
                            {
                                type: 'max',
                                name: 'Máximo',
                                itemStyle: {
                                    color: '#10b981'
                                },
                                label: {
                                    formatter: () => {
                                        const maxFormatted = formatStorage(maxStorage);
                                        return `Max\n${maxFormatted.value} ${maxFormatted.unit}`;
                                    }
                                }
                            },
                            {
                                type: 'min',
                                name: 'Mínimo',
                                itemStyle: {
                                    color: '#ef4444'
                                },
                                label: {
                                    formatter: () => {
                                        const minFormatted = formatStorage(minStorage);
                                        return `Min\n${minFormatted.value} ${minFormatted.unit}`;
                                    }
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
                        color: '#f97316',
                        shadowBlur: 3,
                        shadowColor: 'rgba(249, 115, 22, 0.6)',
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
            <div className="flex justify-center items-center h-96 bg-gradient-to-br from-orange-50 to-red-100 rounded-lg border-2 border-dashed border-orange-300">
                <div className="text-center">
                    <div className="text-orange-400 text-3xl mb-3">💾</div>
                    <p className="text-orange-600 font-medium">No hay datos de almacenamiento disponibles</p>
                    <p className="text-orange-500 text-sm mt-1">Verifica el rango de fechas seleccionado</p>
                </div>
            </div>
        );
    }

    // Verificar si existen datos de storage
    const storageData = data.filter(item =>
        item.MetricLabel === "Espacio de Almacenamiento Libre (Promedio)"
    );

    if (storageData.length === 0) {
        return (
            <div className="flex justify-center items-center h-96 bg-gradient-to-br from-yellow-50 to-orange-100 rounded-lg border-2 border-dashed border-yellow-300">
                <div className="text-center">
                    <div className="text-yellow-500 text-3xl mb-3">⚠️</div>
                    <p className="text-yellow-700 font-medium">Métricas de almacenamiento no disponibles</p>
                    <p className="text-yellow-600 text-sm mt-1">
                        Este gráfico requiere datos de Espacio de Almacenamiento Libre (Promedio)
                    </p>
                </div>
            </div>
        );
    }

    return <div ref={chartRef} style={{ width: '100%', height }} />;
};