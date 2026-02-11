'use client'
import { useMemo, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTheme } from 'next-themes'
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig'

interface TrendStorageLineChartProps {
  data: {
    date: string
    object_count: number
    total_size_gb: number
  }[]
  metric: 'object_count' | 'total_size_gb'
  title: string
  yAxisLabel: string
}

const parseISO = (s: string): Date => {
  const normalized = s.replace(/(\.\d{3})\d+/, '$1').replace(/\+00:00$/, 'Z')
  const d = new Date(normalized)
  if (Number.isNaN(d.getTime())) throw new Error(`Fecha inválida: ${s}`)
  return d
}

const fmt = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const fmtFull = new Intl.DateTimeFormat('es-CL', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC'
})

export const TrendStorageLineChart = ({
  data,
  metric,
  title,
  yAxisLabel,
}: TrendStorageLineChartProps) => {
  const { theme, resolvedTheme } = useTheme()
  const currentTheme = resolvedTheme || theme
  const isDark = currentTheme === 'dark'
  const chartRef = useRef<HTMLDivElement>(null)

  const safeData = Array.isArray(data) ? data : []

  const option = useMemo(() => {
    const sorted = [...safeData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    const times = sorted.map(item => item.date)
    const values = sorted.map(item => metric === 'total_size_gb'
      ? Number(item.total_size_gb.toFixed(2))
      : item.object_count
    )

    const dateCount = times.length
    const start = dateCount ? parseISO(times[0]) : null
    const end = dateCount ? parseISO(times[dateCount - 1]) : null
    const daysDiff = start && end ? Math.floor((+end - +start) / 86_400_000) + 1 : 0

    const bigStep = Math.max(1, Math.ceil(dateCount / 12))
    const midStep = Math.max(1, Math.ceil(dateCount / 20))

    const base = makeBaseOptions({
      unitLabel: metric === 'total_size_gb' ? 'GB' : 'Objetos',
      useUTC: true,
      showToolbox: true,
      metricType: 'default'
    })

    const nf = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 })

    const lines = createChartOption({
      kind: 'line',
      xAxisType: 'category',
      legend: false,
      tooltip: true,
      series: [
        {
          name: yAxisLabel,
          kind: 'line',
          smooth: true,
          data: values,
          extra: { symbol: 'circle', symbolSize: 6 }
        },
      ],
      extraOption: {
        tooltip: {
          trigger: 'axis',
          formatter: (params: unknown): string => {
            const list = (Array.isArray(params) ? params : [params]).filter(Boolean) as unknown[]
            const rawAxis = list[0]?.axisValue || list[0]?.name || ''

            let header = rawAxis
            try { header = fmtFull.format(parseISO(rawAxis)) } catch {}

            const rows = list.map(p =>
              `${p.marker}${p.seriesName}: <b>${nf.format(p.value)}</b>`
            ).join('<br/>')

            return `<div style="margin-bottom:4px;"><b>${header}</b></div>${rows}`
          },
        },
        xAxis: {
          type: 'category',
          data: times,
          boundaryGap: false,
          axisLabel: {
            fontSize: 10,
            rotate: 45,
            formatter: (value: string, index: number) => {
              if (!dateCount) return ''
              const d = parseISO(value)
              if (daysDiff > 365) return (index === 0 || index === dateCount - 1 || index % bigStep === 0) ? fmt.format(d) : ''
              if (daysDiff > 30) return (index % midStep === 0) ? fmt.format(d) : ''
              return fmt.format(d)
            }
          }
        },
        yAxis: { type: 'value', name: yAxisLabel },
      },
    })

    return deepMerge(base, lines)
  }, [safeData, metric, yAxisLabel])

  useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light')

  return (
    <Card className="shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
      </CardContent>
    </Card>
  )
}
