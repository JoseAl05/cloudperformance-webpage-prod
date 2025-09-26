'use client'

import useSWR from 'swr'
import React, { useRef, useState, useEffect } from 'react'
import * as echarts from 'echarts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

interface TopS3BucketsChartProps {
  startDate: Date
  endDate: Date
  region?: string
  buckets?: string
  metric: 'NumberOfObjects Average' | 'BucketSizeBytes Average'
  title: string
}

export const TopS3BucketsChart = ({ startDate, endDate, region, buckets, metric, title }: TopS3BucketsChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const [topLimit, setTopLimit] = useState<number | 'all'>(10)

  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
  const endDateFormatted = endDate.toISOString().replace('Z', '').slice(0, -4)

  const { data, error, isLoading } = useSWR(
    `/api/bridge/s3/top_s3_buckets/tops?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resources=${buckets}`,
    fetcher
  )

  const aggregateData = () => {
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
  }

  const aggregated = aggregateData()

  useEffect(() => {
    if (!chartRef.current || !aggregated.length) return
    const chart = echarts.init(chartRef.current)

    chart.setOption({
      title: { text: `${title} (${topLimit === 'all' ? 'Todos' : 'Top ' + topLimit})`, left: 'center' },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: unknown) => {
          const val = params[0].value
          return metric.includes('Bytes')
            ? `${params[0].name}<br/>${(val / 1073741824).toFixed(2)} GB`
            : `${params[0].name}<br/>${val.toLocaleString()}`
        },
      },
      grid: { left: 150, right: 50, top: 60, bottom: 60 },
      xAxis: { 
        type: 'value', 
        name: metric.includes('Bytes') ? 'Tamaño (GB)' : 'Objetos',
        axisLabel: {
          formatter: (value: number) => {
            if (metric.includes('Bytes')) {
              // Para bytes → mostrar en GB legibles
              return (value / 1073741824).toFixed(0)
            } else {
              // Para número de objetos → formateo con K, M
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
        data: aggregated.map(r => r.name),
        inverse: true,
        axisLabel: {
          formatter: (val: string) => {
            const total = aggregated.find(r => r.name === val)?.total || 0
            return metric.includes('Bytes') ? `${val} (${(total / 1073741824).toFixed(2)} GB)` : `${val} (${total})`
          },
        },
      },
      series: [
        {
          type: 'bar',
          data: aggregated.map(r => r.total),
          itemStyle: { borderRadius: [6, 6, 0, 0] },
        },
      ],
    })

    const resizeObserver = new ResizeObserver(() => chart.resize())
    resizeObserver.observe(chartRef.current)

    return () => {
      resizeObserver.disconnect()
      chart.dispose()
    }
  }, [aggregated, topLimit, title, metric])

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Error cargando datos</p>

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
