'use client'
import useSWR from 'swr'
import React, { useEffect, useRef, useMemo, useCallback } from "react"
import * as echarts from "echarts"
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, CheckCircle, TrendingDown, BarChart3 } from "lucide-react"

const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())

interface Top10RecursosUsoChartProps {
  startDate: Date
  endDate: Date
  selectedMetric?: string
  selectedResourceType?: string
}

export const Top10RecursosUsoChartComponent = ({
  startDate,
  endDate,
  selectedMetric,
  selectedResourceType
}: Top10RecursosUsoChartProps) => {

  const chartRefTop = useRef<HTMLDivElement>(null)
  const chartRefBottom = useRef<HTMLDivElement>(null)
  const chartInstanceTop = useRef<echarts.ECharts | null>(null)
  const chartInstanceBottom = useRef<echarts.ECharts | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  const startDateFormatted = startDate?.toISOString().replace('Z', '').slice(0, -4) || ''
  const endDateFormatted = endDate?.toISOString().replace('Z', '').slice(0, -4) || ''

  const apiUrl = !startDate || !endDate || !selectedMetric || !selectedResourceType
    ? null
    : `/api/azure/bridge/azure/top-recursos-uso?date_from=${startDateFormatted}&date_to=${endDateFormatted}&metric_name=${encodeURIComponent(selectedMetric)}&tipo=${selectedResourceType}`

  const { data, error, isLoading } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 2000
  })

  const { topMostUsed, topLeastUsed, resumen } = useMemo(() => {
    if (!data || !data.top_10_mayor_uso || !data.top_10_menor_uso) {
      return {
        topMostUsed: [],
        topLeastUsed: [],
        resumen: null
      }
    }

    const topMostUsed = data.top_10_mayor_uso.map((item: unknown) => ({
      name: item.vm_name,
      porcentajeUso: item.porcentaje_uso
    }))

    const topLeastUsed = data.top_10_menor_uso.map((item: unknown) => ({
      name: item.vm_name,
      porcentajeNoUso: item.porcentaje_no_uso
    }))

    return {
      topMostUsed,
      topLeastUsed,
      resumen: data.resumen
    }
  }, [data])

  const handleResize = useCallback(() => {
    chartInstanceTop.current?.resize()
    chartInstanceBottom.current?.resize()
  }, [])

  const handleMouseOver = useCallback((resourceName: string) => {
    // Pequeño timeout para asegurar que ambos charts estén inicializados
    setTimeout(() => {
      const indexTop = topMostUsed.findIndex(r => r.name === resourceName)
      const indexBottom = topLeastUsed.findIndex(r => r.name === resourceName)

      if (indexTop !== -1 && chartInstanceTop.current) {
        chartInstanceTop.current.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: indexTop
        })
      }

      if (indexBottom !== -1 && chartInstanceBottom.current) {
        chartInstanceBottom.current.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: indexBottom
        })
      }
    }, 0)
  }, [topMostUsed, topLeastUsed])

  const handleMouseOut = useCallback(() => {
    // Quitar resaltado de ambos gráficos
    if (chartInstanceTop.current) {
      chartInstanceTop.current.dispatchAction({
        type: 'downplay',
        seriesIndex: 0
      })
    }

    if (chartInstanceBottom.current) {
      chartInstanceBottom.current.dispatchAction({
        type: 'downplay',
        seriesIndex: 0
      })
    }
  }, [])

  useEffect(() => {
    if (!chartRefTop.current) return

    const hasData = topMostUsed.length > 0

    const options: echarts.EChartsOption = {
      title: {
        text: 'Top 10 de los Recursos más utilizados',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: unknown) => {
          if (!hasData) return 'No hay datos'
          const item = params[0]
          const value = Number(item.value ?? 0)
          return `<strong>${item.name}</strong><br/>Uso: ${value.toFixed(2)}%`
        }
      },
      grid: { left: 180, right: 50, top: 60, bottom: 10 },
      xAxis: {
        type: 'value',
        max: 100,
        name: '% Uso',
        axisLabel: { formatter: '{value}%' },
        splitLine: { show: true, lineStyle: { color: '#f3f4f6' } }
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: hasData ? topMostUsed.map(r => r.name) : [],
        axisLabel: { width: 150, overflow: 'truncate' }
      },
      series: [{
        type: 'bar',
        data: hasData ? topMostUsed.map(r => ({
          value: Number(r.porcentajeUso ?? 0),
          itemStyle: {
            color: '#60a5fa',
            borderRadius: [0, 4, 4, 0]
          },
          emphasis: {
            itemStyle: {
              color: '#1e40af',
              shadowBlur: 15,
              shadowColor: 'rgba(30, 64, 175, 0.7)',
              borderWidth: 2,
              borderColor: '#1e3a8a'
            }
          }
        })) : [],
        label: {
          show: hasData,
          position: 'right',
          formatter: (params: unknown) => `${Number(params.value ?? 0).toFixed(2)}%`,
          fontSize: 11,
          fontWeight: 'bold'
        },
        barMaxWidth: 30
      }],
      graphic: !hasData ? [{
        type: 'text',
        left: 'center',
        top: 'middle',
        style: {
          text: 'No hay datos disponibles',
          font: '14px sans-serif',
          fill: '#999'
        }
      }] : []
    }

    chartInstanceTop.current = echarts.init(chartRefTop.current, null, { renderer: 'canvas' })
    chartInstanceTop.current.setOption(options, { notMerge: true, lazyUpdate: true })

    // Event listeners para sincronización
    chartInstanceTop.current.on('mouseover', (params: unknown) => {
      if (params.componentType === 'series') {
        handleMouseOver(params.name)
      }
    })

    chartInstanceTop.current.on('mouseout', () => {
      handleMouseOut()
    })

    if (!resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver(handleResize)
      resizeObserverRef.current.observe(chartRefTop.current)
      window.addEventListener('resize', handleResize)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      resizeObserverRef.current?.disconnect()
      chartInstanceTop.current?.off('mouseover')
      chartInstanceTop.current?.off('mouseout')
      chartInstanceTop.current?.dispose()
      chartInstanceTop.current = null
    }
  }, [topMostUsed, handleResize, handleMouseOver, handleMouseOut])

  useEffect(() => {
    if (!chartRefBottom.current) return

    const hasData = topLeastUsed.length > 0

    const options: echarts.EChartsOption = {
      title: {
        text: 'Top 10 de los Recursos menos utilizados',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: unknown) => {
          if (!hasData) return 'No hay datos'
          const item = params[0]
          const value = Number(item.value ?? 0)
          return `<strong>${item.name}</strong><br/>Disponible: ${value.toFixed(2)}%`
        }
      },
      grid: { left: 180, right: 50, top: 60, bottom: 10 },
      xAxis: {
        type: 'value',
        max: 100,
        name: '% Disponible',
        axisLabel: { formatter: '{value}%' },
        splitLine: { show: true, lineStyle: { color: '#f3f4f6' } }
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: hasData ? topLeastUsed.map(r => r.name) : [],
        axisLabel: { width: 150, overflow: 'truncate' }
      },
      series: [{
        type: 'bar',
        data: hasData ? topLeastUsed.map(r => ({
          value: Number(r.porcentajeNoUso ?? 0),
          itemStyle: {
            color: '#60a5fa',
            borderRadius: [0, 4, 4, 0]
          },
          emphasis: {
            itemStyle: {
              color: '#1e40af',
              shadowBlur: 15,
              shadowColor: 'rgba(30, 64, 175, 0.7)',
              borderWidth: 2,
              borderColor: '#1e3a8a'
            }
          }
        })) : [],
        label: {
          show: hasData,
          position: 'right',
          formatter: (params: unknown) => `${Number(params.value ?? 0).toFixed(2)}%`,
          fontSize: 11,
          fontWeight: 'bold'
        },
        barMaxWidth: 30
      }],
      graphic: !hasData ? [{
        type: 'text',
        left: 'center',
        top: 'middle',
        style: {
          text: 'No hay datos disponibles',
          font: '14px sans-serif',
          fill: '#999'
        }
      }] : []
    }

    chartInstanceBottom.current = echarts.init(chartRefBottom.current, null, { renderer: 'canvas' })
    chartInstanceBottom.current.setOption(options, { notMerge: true, lazyUpdate: true })

    // Event listeners para sincronización
    chartInstanceBottom.current.on('mouseover', (params: unknown) => {
      if (params.componentType === 'series') {
        handleMouseOver(params.name)
      }
    })

    chartInstanceBottom.current.on('mouseout', () => {
      handleMouseOut()
    })

    return () => {
      chartInstanceBottom.current?.off('mouseover')
      chartInstanceBottom.current?.off('mouseout')
      chartInstanceBottom.current?.dispose()
      chartInstanceBottom.current = null
    }
  }, [topLeastUsed, handleMouseOver, handleMouseOut])

  const isEmpty = topMostUsed.length === 0 && topLeastUsed.length === 0

  if (isLoading) return <p className="p-8 text-center">Cargando datos...</p>
  if (error) return <p className="p-8 text-center text-red-500">Error al cargar datos</p>
  if (!startDate || !endDate || !selectedMetric || !selectedResourceType) {
    return <p className="p-8 text-center text-muted-foreground">Seleccione todos los filtros y presione Aplicar Filtros</p>
  }

  if (isEmpty) {
    return (
      <div className="w-full min-w-0 px-4 py-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">Sin datos para mostrar</h3>
              <p className="text-sm text-muted-foreground">No encontramos recursos en el rango seleccionado para esta métrica y tipo de recurso.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-0">
            <div ref={chartRefTop} style={{ width: '100%', height: '350px' }} />
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-0">
            <div ref={chartRefBottom} style={{ width: '100%', height: '350px' }} />
          </CardContent>
        </Card>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Recursos</p>
                <p className="text-3xl font-bold text-blue-600">{resumen?.total_recursos_analizados || 0}</p>
                <p className="text-xs text-muted-foreground">Analizados</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Uso Crítico (&gt;85%)</p>
                <p className="text-3xl font-bold text-red-600">{resumen?.recursos_uso_critico || 0}</p>
                <p className="text-xs text-muted-foreground">Requieren atención</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Muy Infrautilizados</p>
                <p className="text-3xl font-bold text-gray-600">{resumen?.recursos_muy_infrautilizados || 0}</p>
                <p className="text-xs text-muted-foreground">&gt;90% disponible</p>
              </div>
              <TrendingDown className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Promedio Uso</p>
                <p className="text-3xl font-bold text-green-600">{resumen?.promedio_porcentaje_uso.toFixed(1) || 0}%</p>
                <p className="text-xs text-muted-foreground">Del período</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-sm text-muted-foreground text-center space-y-1">
        <p>Métrica: <strong>{selectedMetric}</strong> | Tipo: <strong>{selectedResourceType}</strong></p>
        <p className="text-xs">Período: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</p>
      </div>
    </div>
  )
}