'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import * as echarts from 'echarts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricPoint } from '@/interfaces/vista-variacion-tendencia-uso-de-recursos/variacionTendenciaUsoDeRecursosViewInterface'
import { useTheme } from 'next-themes'
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig'

interface DualSeriesChartProps {
  currentPeriodData: MetricPoint[]
  previousPeriodData: MetricPoint[]
  currentPeriodLabel?: string
  previousPeriodLabel?: string
  title?: string
  yAxisLabel?: string
  unit?: string
}

export const DualSeriesChart = ({
  currentPeriodData,
  previousPeriodData,
  currentPeriodLabel = "Período Actual",
  previousPeriodLabel = "Período Anterior",
  title = "Comparación de Métricas",
  yAxisLabel = "Valor",
  unit,
}: DualSeriesChartProps) => {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';

  const chartRef = useRef<HTMLDivElement>(null);

  const toNumber = (v: unknown) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
  }

  const processDataForSeries = (data: MetricPoint[]) => {
    if (!data || data.length === 0) return []

    // Agrupar por timestamp
    const map = new Map<string, number>()
    data.forEach((item: MetricPoint) => {
      const key = item.metric_timestamp
      const prev = map.get(key) ?? 0
      map.set(key, prev + toNumber(item.metric_value))
    })

    // Convertir a array y ordenar
    return Array.from(map.entries())
      .map(([metric_timestamp, total]) => ({
        timestamp: metric_timestamp,
        value: total.toFixed(2)
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }

  const normalizeTimestamps = (data: Array<{ timestamp: string, value: number }>) => {
    // Normalizar timestamps para superponer (usar solo día/hora, ignorar mes/año)
    return data.map(item => {
      const date = new Date(item.timestamp)

      // Para el displayTime, usar la fecha/hora original del timestamp (UTC)
      const utcDate = new Date(item.timestamp)
      const day = utcDate.getUTCDate().toString().padStart(2, '0')
      const month = (utcDate.getUTCMonth() + 1).toString().padStart(2, '0')
      const hours = utcDate.getUTCHours().toString().padStart(2, '0')
      const minutes = utcDate.getUTCMinutes().toString().padStart(2, '0')

      // Para normalizar, usar UTC para mantener consistencia
      const normalizedDate = new Date(2024, 0, utcDate.getUTCDate(), utcDate.getUTCHours(), utcDate.getUTCMinutes())

      return {
        ...item,
        normalizedTimestamp: normalizedDate.getTime(),
        displayTime: `${day}/${month} ${hours}:${minutes}`
      }
    })
  }

  const option = useMemo(() => {

    if ((!currentPeriodData || currentPeriodData.length === 0) &&
      (!previousPeriodData || previousPeriodData.length === 0)) return

    const currentProcessed = processDataForSeries(currentPeriodData)
    const previousProcessed = processDataForSeries(previousPeriodData)

    const currentNormalized = normalizeTimestamps(currentProcessed)
    const previousNormalized = normalizeTimestamps(previousProcessed)

    const allTimestamps = Array.from(
      new Set([
        ...currentNormalized.map(item => item.normalizedTimestamp),
        ...previousNormalized.map(item => item.normalizedTimestamp)
      ])
    ).sort((a, b) => a - b)

    const currentMap = new Map(currentNormalized.map(item => [item.normalizedTimestamp, item.value]))
    const previousMap = new Map(previousNormalized.map(item => [item.normalizedTimestamp, item.value]))

    const times = allTimestamps.map(timestamp => {
      const date = new Date(timestamp)
      return `Dia ${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} Hrs`
    })

    const currentValues = allTimestamps.map(timestamp => currentMap.get(timestamp) ?? null)
    const previousValues = allTimestamps.map(timestamp => previousMap.get(timestamp) ?? null)

    const base = makeBaseOptions({
      legend: [currentPeriodLabel, previousPeriodLabel],
      unitLabel: unit,
      useUTC: true,
      showToolbox: true,
      metricType: 'default'
    });

    const lines = createChartOption({
      kind: 'line',
      xAxisType: 'category',
      legend: true,
      tooltip: true,
      series: [
        {
          name: currentPeriodLabel,
          kind: 'line',
          smooth: true,
          data: currentValues,
          extra: {
            symbol: 'circle',
            symbolSize: 4,
            connectNulls: false,
            // lineStyle: {
            //   width: 2,
            //   color: '#00a53d'
            // },
            // itemStyle: {
            //   color: '#22c55e'
            // }
          }
        },
        {
          name: previousPeriodLabel,
          kind: 'line',
          smooth: true,
          data: previousValues,
          extra: {
            symbol: 'diamond',
            symbolSize: 4,
            connectNulls: false,
            // lineStyle: {
            //   width: 2,
            //   color: '#00028b',
            //   type: 'dashed'
            // },
            // itemStyle: {
            //   color: '#6366f1'
            // }
          }
        }
      ],
      extraOption: {
        tooltip: {
          trigger: 'axis',
          formatter: function (params: unknown) {
            let result = `${params[0].name}<br/>`
            params.forEach((param: unknown) => {
              if (param.value !== null) {
                result += `${param.seriesName}: ${param.value} ${unit}<br/>`
              }
            })
            return result
          }
        },
        xAxis: {
          type: 'category',
          data: times,
          axisLabel: {
            rotate: 45,
            interval: Math.floor(times.length / 15)
          }
        },
        yAxis: {
          type: 'value',
          name: yAxisLabel,
          axisLabel: {
            formatter: `{value} ${unit}`
          }
        },
        grid: { left: 44, right: 12, top: 56, bottom: 64, containLabel: true },
      },
    });

    return deepMerge(base, lines);
  }, [isDark, currentPeriodData, currentPeriodLabel, previousPeriodData, processDataForSeries, previousPeriodLabel, unit, yAxisLabel]);


  const hasData = (currentPeriodData && currentPeriodData.length > 0) ||
    (previousPeriodData && previousPeriodData.length > 0)

  useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

  if (!hasData) {
    return (
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-96">
            <p>No hay datos disponibles</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} style={{ width: '100%', height: '500px' }} />
      </CardContent>
    </Card>
  )
}
