'use client'

import { useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig'
import { useTheme } from 'next-themes'
import { S3MetricItem } from '@/interfaces/vista-top-s3-buckets/topS3BucketsInterfaces'

interface S3StorageTypeChartProps {
  data: S3MetricItem[]
  metric: 'NumberOfObjects Average' | 'BucketSizeBytes Average'
  title: string
}

const toNumber = (value: unknown): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export const S3StorageTypeChart = ({ data, metric, title }: S3StorageTypeChartProps) => {
  const { theme, resolvedTheme } = useTheme()
  const currentTheme = resolvedTheme || theme
  const isDark = currentTheme === 'dark'
  const chartRef = useRef<HTMLDivElement>(null)
  const [topLimit, setTopLimit] = useState<number | 'all'>(10)

  const isBytes = metric.includes('Bytes')
  const unitLabel = isBytes ? 'GB' : 'Objetos'

  const safeData = useMemo(() => (Array.isArray(data) ? data : []), [data])

  const aggregated = useMemo(() => {
    const rows = safeData.filter(
      item => item?.metric === metric && typeof item?.storage_type === 'string' && item.storage_type !== ''
    )
    const divisor = isBytes ? 1073741824 : 1
    const byResource = new Map<string, Map<string, number>>()
    const storageTypes = new Set<string>()

    rows.forEach(item => {
      const resource = item.resource
      const storageType = item.storage_type as string
      storageTypes.add(storageType)
      const inner = byResource.get(resource) ?? new Map<string, number>()
      inner.set(storageType, (inner.get(storageType) ?? 0) + toNumber(item.metric_value) / divisor)
      byResource.set(resource, inner)
    })

    const totals = Array.from(byResource, ([resource, inner]) => ({
      resource,
      inner,
      total: Array.from(inner.values()).reduce((acc, value) => acc + value, 0),
    })).sort((a, b) => b.total - a.total)

    const limited = topLimit === 'all' ? totals : totals.slice(0, topLimit)

    return {
      resources: limited.map(entry => entry.resource),
      rows: limited,
      storageTypes: Array.from(storageTypes).sort(),
    }
  }, [safeData, metric, topLimit, isBytes])

  const option = useMemo(() => {
    const base = makeBaseOptions({
      unitLabel,
      title: {
        text: `${title} (${topLimit === 'all' ? 'Todos' : 'Top ' + topLimit})`,
        left: 'center',
      },
      useUTC: true,
      showToolbox: true,
      metricType: 'default',
    })

    const longestNameLength = aggregated.resources.reduce((max, name) => Math.max(max, name.length), 0)
    const gridLeft = Math.min(360, Math.max(180, longestNameLength * 3 + 90))
    const gridRight = 72
    const sliderTop = 90
    const sliderBottom = 40
    const labelWidth = Math.max(120, gridLeft - 40)
    const nf = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 })

    const series = aggregated.storageTypes.map(storageType => ({
      kind: 'bar' as const,
      name: storageType,
      data: aggregated.rows.map(entry => Number((entry.inner.get(storageType) ?? 0).toFixed(2))),
      extra: {
        stack: 'total',
        barMaxWidth: 28,
        emphasis: { focus: 'series' },
      },
    }))

    const stacked = createChartOption({
      kind: 'bar',
      xAxisType: 'value',
      legend: true,
      tooltip: true,
      series,
      extraOption: {
        legend: {
          data: aggregated.storageTypes,
          type: 'scroll',
          top: 40,
          left: 'center',
        },
        grid: {
          left: gridLeft,
          right: gridRight,
          top: sliderTop,
          bottom: sliderBottom,
          containLabel: false,
        },
        xAxis: {
          type: 'value',
          name: isBytes ? 'Tamaño (GB)' : 'Objetos',
          axisLabel: {
            formatter: (value: number) => {
              if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + 'B'
              if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M'
              if (value >= 1_000) return (value / 1_000).toFixed(1) + 'K'
              return value.toString()
            },
          },
        },
        yAxis: {
          type: 'category',
          data: aggregated.resources,
          inverse: true,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            interval: 0,
            align: 'right',
            width: labelWidth,
            overflow: 'break',
            lineHeight: 16,
            margin: 12,
            fontSize: 11,
          },
        },
        dataZoom: [
          {
            type: 'slider',
            yAxisIndex: 0,
            orient: 'vertical',
            filterMode: 'weakFilter',
            right: 10,
            top: sliderTop,
            bottom: sliderBottom,
            width: 18,
            handleSize: '70%',
            showDataShadow: false,
            labelFormatter: '',
            start: 0,
            end: 100,
          },
          {
            type: 'inside',
            yAxisIndex: 0,
            filterMode: 'weakFilter',
            start: 0,
            end: 100,
          },
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params: unknown): string => {
            const list = (Array.isArray(params) ? params : [params]).filter(Boolean) as Record<string, unknown>[]
            const first = list[0] ?? {}
            const header = typeof first.name === 'string' ? first.name : ''
            const total = list.reduce((acc, entry) => acc + toNumber(entry.value), 0)
            const rows = list
              .filter(entry => toNumber(entry.value) > 0)
              .map(entry => {
                const marker = typeof entry.marker === 'string' ? entry.marker : ''
                const seriesName = typeof entry.seriesName === 'string' ? entry.seriesName : ''
                return `${marker}${seriesName}: <b>${nf.format(toNumber(entry.value))} ${unitLabel}</b>`
              })
              .join('<br/>')
            return `<div style="margin-bottom:4px;"><b>${header}</b></div>${rows}<div style="margin-top:6px;">Total: <b>${nf.format(total)} ${unitLabel}</b></div>`
          },
        },
      },
    })

    return deepMerge(base, stacked)
  }, [aggregated, title, topLimit, isBytes, unitLabel])

  useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light')

  return (
    <Card className="shadow-lg rounded-2xl">
      <CardHeader className="flex items-center justify-between border-b">
        <CardTitle>{title}</CardTitle>
        <Select
          value={topLimit.toString()}
          onValueChange={value => setTopLimit(value === 'all' ? 'all' : Number(value))}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Top" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Top 3</SelectItem>
            <SelectItem value="5">Top 5</SelectItem>
            <SelectItem value="10">Top 10</SelectItem>
            <SelectItem value="all">Todos</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="h-[440px]">
        {aggregated.storageTypes.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            No hay datos segmentados por clase de almacenamiento en el rango seleccionado.
          </div>
        ) : (
          <div ref={chartRef} className="w-full h-full" />
        )}
      </CardContent>
    </Card>
  )
}