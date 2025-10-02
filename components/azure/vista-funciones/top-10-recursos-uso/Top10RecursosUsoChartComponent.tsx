'use client'
import useSWR from 'swr'
import React, { useEffect, useRef, useMemo, useCallback } from "react"
import * as echarts from "echarts"
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, CheckCircle, XCircle, Info, TrendingUp, TrendingDown, Calendar, BarChart3 } from "lucide-react"

const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
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
    : `/api/azure/bridge/azure/top-recursos-uso?date_from=${startDateFormatted}&date_to=${endDateFormatted}&metric_name=${encodeURIComponent(selectedMetric)}&tipo=${selectedResourceType}&umbral_alto_uso=70`

  const { data, error, isLoading } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 2000
  })

  const { topMostUsed, topLeastUsed, umbral, resumen, periodo } = useMemo(() => {
    if (!data || !data.top_10_mayor_uso || !data.top_10_menor_uso) {
      return {
        topMostUsed: [],
        topLeastUsed: [],
        umbral: 70,
        resumen: null,
        periodo: null
      }
    }

    const topMostUsed = data.top_10_mayor_uso.map((item: unknown) => ({
      name: item.vm_name,
      avgUsage: item.porcentaje_uso
    }))

    const topLeastUsed = data.top_10_menor_uso.map((item: unknown) => ({
      name: item.vm_name,
      avgUsage: item.porcentaje_uso
    }))

    return {
      topMostUsed,
      topLeastUsed,
      umbral: data.umbral_alto_uso_porcentaje || 70,
      resumen: data.resumen,
      periodo: data.periodo
    }
  }, [data])

  const getColorByUsage = (value: number, isTopUsed: boolean) => {
    const umbralCritico = umbral + 15 // 85% si umbral es 70%
    if (isTopUsed) return value > umbralCritico ? '#dc2626' : value > umbral ? '#ea580c' : '#2563eb'
    return value < 10 ? '#4b5563' : value < 30 ? '#7c3aed' : '#059669'
  }

  const handleResize = useCallback(() => {
    chartInstanceTop.current?.resize()
    chartInstanceBottom.current?.resize()
  }, [])

  useEffect(() => {
    if (!chartRefTop.current) return

    const hasData = topMostUsed.length > 0
    const umbralCritico = umbral + 15

    const options: echarts.EChartsOption = {
      title: {
        text: `Top 10 MÁS Utilizados (≥${umbral}%)`,
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: unknown) => {
          if (!hasData) return 'No hay datos'
          const item = params[0]
          const value = Number(item.value ?? 0)
          const status = value > umbralCritico ? '🔴 Crítico' : value > umbral ? '🟠 Alto Uso' : '🔵 Normal'
          return `<strong>${item.name}</strong><br/>${status}<br/>Uso: ${value.toFixed(1)}%`
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
          value: Number(r.avgUsage ?? 0),
          itemStyle: {
            color: getColorByUsage(r.avgUsage, true),
            borderRadius: [0, 4, 4, 0]
          }
        })) : [],
        label: {
          show: hasData,
          position: 'right',
          formatter: (params: unknown) => `${Number(params.value ?? 0).toFixed(1)}%`,
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
          text: '✓ No hay recursos con alto uso',
          font: '14px sans-serif',
          fill: '#10b981',
          fontWeight: 'bold'
        }
      }] : []
    }

    chartInstanceTop.current = echarts.init(chartRefTop.current, null, { renderer: 'canvas' })
    chartInstanceTop.current.setOption(options, { notMerge: true, lazyUpdate: true })

    if (!resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver(handleResize)
      resizeObserverRef.current.observe(chartRefTop.current)
      window.addEventListener('resize', handleResize)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      resizeObserverRef.current?.disconnect()
      chartInstanceTop.current?.dispose()
      chartInstanceTop.current = null
    }
  }, [topMostUsed, handleResize, umbral])

  useEffect(() => {
    if (!chartRefBottom.current) return

    const hasData = topLeastUsed.length > 0

    const options: echarts.EChartsOption = {
      title: {
        text: `Top 10 MENOS Utilizados (<${umbral}%)`,
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: unknown) => {
          if (!hasData) return 'No hay datos'
          const item = params[0]
          const value = Number(item.value ?? 0)
          const status = value < 10 ? '⚪ Apagar/Reducir' : value < 30 ? '🟣 Infrautilizado' : '🟢 Aceptable'
          return `<strong>${item.name}</strong><br/>${status}<br/>Uso: ${value.toFixed(1)}%`
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
        data: hasData ? topLeastUsed.map(r => r.name) : [],
        axisLabel: { width: 150, overflow: 'truncate' }
      },
      series: [{
        type: 'bar',
        data: hasData ? topLeastUsed.map(r => ({
          value: Number(r.avgUsage ?? 0),
          itemStyle: {
            color: getColorByUsage(r.avgUsage, false),
            borderRadius: [0, 4, 4, 0]
          }
        })) : [],
        label: {
          show: hasData,
          position: 'right',
          formatter: (params: unknown) => `${Number(params.value ?? 0).toFixed(1)}%`,
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
          text: '⚠️ Todos los recursos tienen alto uso',
          font: '14px sans-serif',
          fill: '#ef4444',
          fontWeight: 'bold'
        }
      }] : []
    }

    chartInstanceBottom.current = echarts.init(chartRefBottom.current, null, { renderer: 'canvas' })
    chartInstanceBottom.current.setOption(options, { notMerge: true, lazyUpdate: true })

    return () => {
      chartInstanceBottom.current?.dispose()
      chartInstanceBottom.current = null
    }
  }, [topLeastUsed, umbral])

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
            <Info className="w-8 h-8 text-yellow-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">Sin datos para mostrar</h3>
              <p className="text-sm text-muted-foreground">No encontramos recursos en el rango seleccionado para esta métrica y tipo de recurso.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const umbralCritico = umbral + 15
  const recursosEnRiesgo = resumen ? resumen.recursos_con_alto_uso : 0
  const recursosInfrautilizados = topLeastUsed.filter(r => r.avgUsage < 10).length

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
                <p className="text-sm font-medium text-muted-foreground">En Riesgo (≥{umbral}%)</p>
                <p className="text-3xl font-bold text-red-600">{recursosEnRiesgo}</p>
                <p className="text-xs text-muted-foreground">Requieren atención</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Infrautilizados (&lt;10%)</p>
                <p className="text-3xl font-bold text-gray-600">{recursosInfrautilizados}</p>
                <p className="text-xs text-muted-foreground">Candidatos a reducir</p>
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
                <p className="text-3xl font-bold text-green-600">{resumen?.promedio_uso_general.toFixed(1) || 0}%</p>
                <p className="text-xs text-muted-foreground">General del período</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-sm text-muted-foreground text-center space-y-1">
        <p>Métrica: <strong>{selectedMetric}</strong> | Tipo: <strong>{selectedResourceType}</strong> | Umbral: <strong>{umbral}%</strong></p>
        <p className="text-xs">Período: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</p>
      </div>
    </div>
  )
}