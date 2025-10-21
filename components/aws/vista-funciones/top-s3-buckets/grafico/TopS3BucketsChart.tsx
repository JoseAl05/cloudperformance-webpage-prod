'use client'

import useSWR from 'swr'
import React, { useRef, useState, useEffect, useMemo } from 'react'
import * as echarts from 'echarts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createChartOption, deepMerge, makeBaseOptions, useECharts } from '@/lib/echartsGlobalConfig'
import { useTheme } from 'next-themes'

interface TopS3BucketsChartProps {
  data:unknown[];
  metric: 'NumberOfObjects Average' | 'BucketSizeBytes Average'
  title: string
}

export const TopS3BucketsChart = ({ data, metric, title }: TopS3BucketsChartProps) => {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';
  const [topLimit, setTopLimit] = useState<number | 'all'>(10)

  const chartRef = useRef<HTMLDivElement>(null);

  const safeData: [] = Array.isArray(data) ? data : [];

  const aggregateData = useMemo(() => {
    if (!Array.isArray(data)) return []
    const filtered = data.filter((d: unknown) => d.metric === metric)
    const map = new Map<string, number>()
    filtered.forEach((item: unknown) => {
      const prev = map.get(item.resource) ?? 0
      map.set(item.resource, prev + Number(item.metric_value))
    })
    let aggregated = Array.from(map, ([name, total]) => ({ name, total }))
    aggregated.sort((a, b) => b.total - a.total)
    if (topLimit !== 'all') aggregated = aggregated.slice(0, topLimit)
    return aggregated
  }, [data, metric, topLimit]);

  const option = useMemo(() => {
    const base = makeBaseOptions({
      unitLabel: 'Objetos',
      title: { text: `${title} (${topLimit === 'all' ? 'Todos' : 'Top ' + topLimit})`, left: 'center' },
      useUTC: true,
      showToolbox: true,
      metricType: 'default'
    });

    const bars = createChartOption({
      kind: 'bar',
      xAxisType: 'value',
      legend: false,
      tooltip: true,
      series: [
        {
          kind: 'bar',
          name: '',
          data: aggregateData.map(r => r.total),
          smooth: true,
          extra: {
            itemStyle: { borderRadius: [6, 6, 0, 0] },
          }
        },
      ],
      extraOption: {
        xAxis: {
          type: 'value',
          name: metric.includes('Bytes') ? 'Tamaño (GB)' : 'Objetos',
          axisLabel: {
            formatter: (value: number) => {
              if (metric.includes('Bytes')) {
                return (value / 1073741824).toFixed(0)
              } else {
                if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + 'B'
                if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M'
                if (value >= 1_000) return (value / 1_000).toFixed(1) + 'K'
                return value.toString()
              }
            }
          }
        },
        yAxis: {
          type: 'category',
          data: aggregateData.map(r => r.name),
          inverse: true,
          axisLabel: {
            formatter: (val: string) => {
              const total = aggregateData.find(r => r.name === val)?.total || 0
              return metric.includes('Bytes') ? `${val} (${(total / 1073741824).toFixed(2)} GB)` : `${val} (${total})`
            },
          },
        },
        // grid: { left: 150, right: 50, top: 60, bottom: 60 },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params: unknown) => {
            const val = params[0].value
            return metric.includes('Bytes')
              ? `${params[0].name}<br/>${(val / 1073741824).toFixed(2)} GB`
              : `${params[0].name}<br/>${val.toLocaleString()} Objetos`
          },
        },
      },
    });

    return deepMerge(base, bars);
  }, [safeData, topLimit, aggregateData, metric, title]);

  useECharts(chartRef, option, [option], isDark ? 'cp-dark' : 'cp-light');

  return (
    <Card className="shadow-lg rounded-2xl">
      <CardHeader className="flex items-center justify-between border-b">
        <CardTitle>{title}</CardTitle>
        <Select value={topLimit.toString()} onValueChange={val => setTopLimit(val === 'all' ? 'all' : Number(val))}>
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
      <CardContent className="h-[400px]">
        <div ref={chartRef} className="w-full h-full" />
      </CardContent>
    </Card>
  )
}
