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

interface RdsOracleMemoryChartProps {
  data: MetricPoint[];
  title?: string;
  height?: string;
}

export const RdsOracleMemoryChart = ({ 
  data, 
  title = "Memoria Disponible",
  height = "300px"
}: RdsOracleMemoryChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // Función para formatear bytes a unidades legibles
  const formatBytes = (bytes: number): { value: number; unit: string } => {
    if (bytes === 0) return { value: 0, unit: 'Bytes' };
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return {
      value: parseFloat((bytes / Math.pow(k, i)).toFixed(2)),
      unit: sizes[i]
    };
  };

  const formatBytesString = (bytes: number): string => {
    const formatted = formatBytes(bytes);
    return `${formatted.value} ${formatted.unit}`;
  };

  useEffect(() => {
    if (!data || data.length === 0 || !chartRef.current) return;

    // Filtrar solo los datos de "Memoria Disponible (Promedio)"
    const memoryData = data.filter(item => 
      item.MetricLabel === "Memoria Disponible (Promedio)"
    );

    if (memoryData.length === 0) {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
      return;
    }

    // Ordenar por timestamp
    const sortedData = memoryData.sort((a, b) => 
      new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime()
    );

    const memoryValues = sortedData.map(item => item.Value);

    // Calcular estadísticas
    const maxMemory = Math.max(...memoryValues);
    const minMemory = Math.min(...memoryValues);
    const avgMemory = memoryValues.reduce((a, b) => a + b, 0) / memoryValues.length;

    // Determinar la mejor unidad para mostrar (basada en el promedio)
    const avgFormatted = formatBytes(avgMemory);
    const unitDivisor = Math.pow(1024, ['Bytes', 'KB', 'MB', 'GB', 'TB'].indexOf(avgFormatted.unit));
    
    // Convertir datos al formato [timestamp, value] para type: 'time'
    // Convertir todos los valores a la misma unidad para consistencia
    const normalizedData = sortedData.map(item => [
      new Date(item.Timestamp).getTime(),
      item.Value / unitDivisor
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
        formatter: function(params: unknown) {
          const param = params[0];
          const originalValue = memoryValues[param.dataIndex];
          return `
            <div style="padding: 10px;">
              <div style="font-weight: bold; margin-bottom: 6px; color: #f97316;">
                🧠 ${new Date(param.value[0]).toLocaleString('es-ES')}
              </div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                ${param.marker}
                <span>Memoria Disponible: <strong>${formatBytesString(originalValue)}</strong></span>
              </div>
              <hr style="margin: 6px 0; border-color: #e5e7eb;">
              <div style="font-size: 11px; color: #6b7280; line-height: 1.4;">
                📊 <strong>Estadísticas:</strong><br/>
                • Máximo: ${formatBytesString(maxMemory)}<br/>
                • Mínimo: ${formatBytesString(minMemory)}<br/>
                • Promedio: ${formatBytesString(avgMemory)}
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
        name: `Memoria (${avgFormatted.unit})`,
        nameLocation: 'middle',
        nameGap: 60,
        nameTextStyle: {
          color: '#1f2937',
          fontSize: 12,
          fontWeight: 'bold'
        },
        axisLabel: {
          formatter: (value: number) => `${value.toFixed(1)} ${avgFormatted.unit}`,
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
          name: 'Memoria Disponible',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          lineStyle: {
            width: 3,
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: '#f97316' },
                { offset: 0.5, color: '#ea580c' },
                { offset: 1, color: '#dc2626' }
              ]
            }
          },
          itemStyle: {
            color: '#f97316',
            borderColor: '#ffffff',
            borderWidth: 2
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
          data: normalizedData,
          markLine: {
            silent: true,
            symbol: ['none', 'none'],
            label: {
              show: true,
              position: 'end',
              formatter: (params: unknown) => {
                const avgNormalized = avgMemory / unitDivisor;
                return `Promedio: ${avgNormalized.toFixed(1)} ${avgFormatted.unit}`;
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
            symbolSize: 45,
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
                  formatter: (params: unknown) => {
                    return `Max\n${formatBytes(maxMemory).value} ${formatBytes(maxMemory).unit}`;
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
                  formatter: (params: unknown) => {
                    return `Min\n${formatBytes(minMemory).value} ${formatBytes(minMemory).unit}`;
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
          <div className="text-orange-400 text-3xl mb-3">🧠</div>
          <p className="text-orange-600 font-medium">No hay datos de memoria disponibles</p>
          <p className="text-orange-500 text-sm mt-1">Verifica el rango de fechas seleccionado</p>
        </div>
      </div>
    );
  }

  // Verificar si existen datos de memoria
  const memoryData = data.filter(item => 
    item.MetricLabel === "Memoria Disponible (Promedio)"
  );

  if (memoryData.length === 0) {
    return (
      <div className="flex justify-center items-center h-96 bg-gradient-to-br from-yellow-50 to-orange-100 rounded-lg border-2 border-dashed border-yellow-300">
        <div className="text-center">
          <div className="text-yellow-500 text-3xl mb-3">⚠️</div>
          <p className="text-yellow-700 font-medium">Métricas de memoria no disponibles</p>
          <p className="text-yellow-600 text-sm mt-1">
            Este gráfico requiere datos de Memoria Disponible (Promedio)
          </p>
        </div>
      </div>
    );
  }

  return <div ref={chartRef} style={{ width: '100%', height }} />;
};