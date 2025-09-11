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

interface RdsIopsChartProps {
    data: MetricPoint[];
    title?: string;
    height?: string;
}

export const RdsIopsChart = ({
    data,
    title = "Operaciones Lectura/Escritura (IOPS/seg)",
    height = "300px"
}: RdsIopsChartProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);

    useEffect(() => {
        if (!data || data.length === 0 || !chartRef.current) return;

        // Filtrar solo las métricas de IOPS que necesitamos
        const allowedMetrics = [
            "Lecturas por Segundo (Promedio)",
            "Escrituras por Segundo (Promedio)"
        ];

        const filteredData = data.filter(item =>
            allowedMetrics.includes(item.MetricLabel)
        );

        if (filteredData.length === 0) {
            if (chartInstance.current) {
                chartInstance.current.dispose();
                chartInstance.current = null;
            }
            return;
        }

        // Agrupar datos por MetricLabel
        const grouped: Record<string, { time: string; value: number; timestamp: Date }[]> = {};

        filteredData.forEach((item) => {
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

        // Calcular estadísticas para cada métrica
        const stats: Record<string, { max: number; min: number; avg: number; total: number }> = {};
        Object.keys(grouped).forEach(label => {
            const values = grouped[label].map(p => p.value);
            stats[label] = {
                max: Math.max(...values),
                min: Math.min(...values),
                avg: Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)),
                total: Number(values.reduce((a, b) => a + b, 0).toFixed(2))
            };
        });

        // Crear series - una línea por cada MetricLabel (IOPS)
        const series = Object.keys(grouped).map((label, index) => {
            // Colores específicos para IOPS (tema MySQL)
            const colorMap: Record<string, { color: string; icon: string }> = {
                "Lecturas por Segundo (Promedio)": { color: '#3b82f6', icon: '📖' }, // azul para lectura
                "Escrituras por Segundo (Promedio)": { color: '#f97316', icon: '✍️' } // naranja MySQL para escritura
            };

            const config = colorMap[label] || { color: '#6b7280', icon: '📊' };

            return {
                name: label,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                lineStyle: {
                    width: 3,
                    color: config.color
                },
                itemStyle: {
                    color: config.color,
                    borderColor: '#ffffff',
                    borderWidth: 2
                },
                areaStyle: {
                    opacity: 0.15,
                    color: config.color
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
                    let result = `<div style="padding: 10px;">`;
                    result += `<div style="font-weight: bold; margin-bottom: 6px; color: #f97316;">⚡ ${params[0].axisValue}</div>`;

                    params.forEach((param: unknown) => {
                        if (param.value !== null) {
                            const icon = param.seriesName.includes('Lecturas') ? '📖' : '✍️';
                            result += `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">`;
                            result += `${param.marker}<span>${icon} ${param.seriesName.replace(' (Promedio)', '')}: <strong>${param.value} IOPS</strong></span>`;
                            result += `</div>`;
                        }
                    });

                    result += `<hr style="margin: 6px 0; border-color: #e5e7eb;">`;
                    result += `<div style="font-size: 11px; color: #6b7280; line-height: 1.4;">`;
                    result += `📊 <strong>Estadísticas actuales:</strong><br/>`;

                    Object.keys(stats).forEach(label => {
                        const icon = label.includes('Lecturas') ? '📖' : '✍️';
                        const shortLabel = label.includes('Lecturas') ? 'Lectura' : 'Escritura';
                        result += `• ${icon} ${shortLabel} - Max: ${stats[label].max}, Prom: ${stats[label].avg} IOPS<br/>`;
                    });

                    result += `</div></div>`;
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
                formatter: function (name: string) {
                    const icon = name.includes('Lecturas') ? '📖' : '✍️';
                    return `${icon} ${name.replace(' (Promedio)', '')}`;
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
                    fontSize: 10,
                    color: '#6b7280'
                },
                axisLine: {
                    lineStyle: {
                        color: '#d1d5db'
                    }
                }
            },
            yAxis: {
                type: 'value',
                name: 'IOPS/seg',
                nameLocation: 'middle',
                nameGap: 50,
                nameTextStyle: {
                    color: '#1f2937',
                    fontSize: 12,
                    fontWeight: 'bold'
                },
                axisLabel: {
                    formatter: (value: number) => `${value} IOPS`,
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
            <div className="flex justify-center items-center h-96 bg-gradient-to-br from-orange-50 to-amber-100 rounded-lg border-2 border-dashed border-orange-300">
                <div className="text-center">
                    <div className="text-orange-400 text-3xl mb-3">⚡</div>
                    <p className="text-orange-600 font-medium">No hay datos de IOPS disponibles</p>
                    <p className="text-orange-500 text-sm mt-1">Verifica el rango de fechas seleccionado</p>
                </div>
            </div>
        );
    }

    // Verificar si existen las métricas de IOPS específicas
    const allowedMetrics = [
        "Lecturas por Segundo (Promedio)",
        "Escrituras por Segundo (Promedio)"
    ];

    const hasValidMetrics = data.some(item =>
        allowedMetrics.includes(item.MetricLabel)
    );

    if (!hasValidMetrics) {
        return (
            <div className="flex justify-center items-center h-96 bg-gradient-to-br from-yellow-50 to-orange-100 rounded-lg border-2 border-dashed border-yellow-300">
                <div className="text-center">
                    <div className="text-yellow-500 text-3xl mb-3">⚠️</div>
                    <p className="text-yellow-700 font-medium">Métricas de IOPS no disponibles</p>
                    <p className="text-yellow-600 text-sm mt-1">
                        Este gráfico requiere: Lecturas por Segundo (Promedio) y Escrituras por Segundo (Promedio)
                    </p>
                </div>
            </div>
        );
    }

    return <div ref={chartRef} style={{ width: '100%', height }} />;
};