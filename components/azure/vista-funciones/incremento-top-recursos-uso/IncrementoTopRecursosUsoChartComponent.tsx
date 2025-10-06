'use client'
import useSWR from 'swr'
import React, { useEffect, useRef, useMemo } from "react"
import * as echarts from "echarts"
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Calendar, Activity, AlertTriangle } from "lucide-react"

const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())

interface IncrementoTopRecursosUsoChartProps {
  startDate: Date
  endDate: Date
  selectedMetric?: string
  selectedResourceType?: string
  selectedResource?: string
}

export const IncrementoTopRecursosUsoChartComponent = ({
  startDate,
  endDate,
  selectedMetric,
  selectedResourceType,
  selectedResource
}: IncrementoTopRecursosUsoChartProps) => {

  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  const startDateFormatted = startDate?.toISOString().replace('Z', '').slice(0, -4) || ''
  const endDateFormatted = endDate?.toISOString().replace('Z', '').slice(0, -4) || ''

  const apiUrl = !startDate || !endDate || !selectedMetric || !selectedResourceType
    ? null
    : `/api/azure/bridge/azure/incremento-top-recursos-uso?date_from=${startDateFormatted}&date_to=${endDateFormatted}&metric_name=${encodeURIComponent(selectedMetric)}&tipo=${selectedResourceType}${selectedResource ? `&resource_name=${encodeURIComponent(selectedResource)}` : ''}`

  const { data, error, isLoading } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 2000
  })

  const { serieTemporal, tarjetas } = useMemo(() => {
    if (!data || !data.serie_temporal) {
      return { serieTemporal: [], tarjetas: null }
    }

    return {
      serieTemporal: data.serie_temporal,
      tarjetas: data.tarjetas
    }
  }, [data])

  useEffect(() => {
    if (!chartRef.current || !serieTemporal || serieTemporal.length === 0) return

    const timestamps = serieTemporal.map((item: unknown) => item.fecha)
    const porcentajes = serieTemporal.map((item: unknown) => item.porcentaje_uso)

    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    const chart = echarts.init(chartRef.current)
    chartInstance.current = chart

    const option: echarts.EChartsOption = {
      title: {
        text: 'Evolución del Porcentaje de Uso',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'cross'
        },
        formatter: function (params: unknown) {
          const fecha = new Date(params.data[0]).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })
          return `<strong>${fecha}</strong><br/>${params.marker}Uso: ${params.data[1].toFixed(2)}%`
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
          formatter: function (value: number) {
            const date = new Date(value)
            return date.toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short'
            })
          },
          rotate: 45,
          fontSize: 10
        },
        splitNumber: 8
      },
      yAxis: {
        type: 'value',
        name: '% Uso',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: 'Porcentaje de Uso',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: {
            width: 3,
            color: '#3b82f6'
          },
          itemStyle: {
            color: '#3b82f6'
          },
          areaStyle: {
            opacity: 0.2,
            color: '#3b82f6'
          },
          data: timestamps.map((fecha: string, index: number) => [fecha, porcentajes[index]])
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
    }

    chart.setOption(option)

    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chartInstance.current) {
        chartInstance.current.dispose()
        chartInstance.current = null
      }
    }
  }, [serieTemporal])

  if (isLoading) return <p className="p-8 text-center">Cargando datos...</p>
  if (error) return <p className="p-8 text-center text-red-500">Error al cargar datos</p>
  if (!startDate || !endDate || !selectedMetric || !selectedResourceType) {
    return <p className="p-8 text-center text-muted-foreground">Seleccione todos los filtros y presione Aplicar Filtros</p>
  }

  if (!serieTemporal || serieTemporal.length === 0) {
    return (
      <div className="w-full min-w-0 px-4 py-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">Sin datos para mostrar</h3>
              <p className="text-sm text-muted-foreground">No se encontraron datos para el período y filtros seleccionados.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      {/* Gráfico */}
      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-4">
          <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
        </CardContent>
      </Card>

      {/* Tarjetas de métricas */}
      {tarjetas && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mes Anterior */}
            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Uso Mes Anterior</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {tarjetas.porcentaje_uso_mes_anterior !== null
                        ? `${tarjetas.porcentaje_uso_mes_anterior.toFixed(2)}%`
                        : '-'}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            {/* Mes Actual */}
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Uso Mes Actual</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {tarjetas.porcentaje_uso_mes_actual !== null
                        ? `${tarjetas.porcentaje_uso_mes_actual.toFixed(2)}%`
                        : '-'}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            {/* Variación */}
            <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Variación Mensual</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {tarjetas.tendencia_variacion}
                    </p>
                  </div>
                  {tarjetas.variacion > 0 ? (
                    <TrendingUp className="h-8 w-8 text-orange-500" />
                  ) : (
                    <TrendingDown className="h-8 w-8 text-green-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Fecha Anterior */}
            <Card className="border-l-4 border-l-gray-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Uso Fecha Anterior</p>
                    <p className="text-3xl font-bold text-gray-600">
                      {tarjetas.porcentaje_uso_fecha_anterior !== null
                        ? `${tarjetas.porcentaje_uso_fecha_anterior.toFixed(2)}%`
                        : '-'}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-gray-500" />
                </div>
              </CardContent>
            </Card>

            {/* Última Fecha */}
            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Uso Última Fecha</p>
                    <p className="text-3xl font-bold text-green-600">
                      {tarjetas.porcentaje_uso_ultima_fecha !== null
                        ? `${tarjetas.porcentaje_uso_ultima_fecha.toFixed(2)}%`
                        : '-'}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            {/* Incremento */}
            <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Incremento Diario</p>
                    <p className="text-2xl font-bold text-red-600">
                      {tarjetas.tendencia_incremento}
                    </p>
                  </div>
                  {tarjetas.incremento > 0 ? (
                    <TrendingUp className="h-8 w-8 text-red-500" />
                  ) : (
                    <TrendingDown className="h-8 w-8 text-green-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <div className="text-sm text-muted-foreground text-center space-y-1">
        <p>Métrica: <strong>{selectedMetric}</strong> | Tipo: <strong>{selectedResourceType}</strong>{selectedResource ? ` | Recurso: ${selectedResource}` : ''}</p>
        <p className="text-xs">Período: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</p>
      </div>
    </div>
  )
}