'use client'

import useSWR from 'swr'
import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

interface TrendLineChartProps {
  startDate: Date
  endDate: Date
  region?: string
  buckets?: string
  metric: 'NumberOfObjects Average' | 'BucketSizeBytes Average'
  title: string
  yAxisLabel: string
}

export const TrendLineChart = ({
  startDate,
  endDate,
  region = 'all_regions',
  buckets = 'all',
  metric,
  title,
  yAxisLabel,
}: TrendLineChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
  const endDateFormatted = endDate.toISOString().replace('Z', '').slice(0, -4)

  const { data, error, isLoading } = useSWR(
    `/api/aws/bridge/s3/top_s3_buckets/metrics?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&resources=${buckets}`,
    fetcher
  )

  const toNumber = (v: unknown) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
  }

  useEffect(() => {
    if (!chartRef.current || !data) return

    // Filtrar por métrica
    const filtered = data.filter((d: unknown) => d.metric === metric)
    const map = new Map<string, number>()
    filtered.forEach((item: unknown) => {
      const key = item.sync_time
      const prev = map.get(key) ?? 0
      map.set(key, prev + toNumber(item.metric_value))
    })
    const trendData = Array.from(map.entries())
      .map(([sync_time, total]) => ({ sync_time, total }))
      .sort((a, b) => new Date(a.sync_time).getTime() - new Date(b.sync_time).getTime())

    const times = trendData.map(item => {
      const d = new Date(item.sync_time)
      return `${d.getUTCDate()}/${d.getUTCMonth() + 1}/${d.getUTCFullYear()}`
    })
    const values = metric.includes('Bytes')
      ? trendData.map(item => (item.total / 1073741824).toFixed(2)) // convertir a GB
      : trendData.map(item => item.total)

    if (!chartInstance.current) chartInstance.current = echarts.init(chartRef.current)

    chartInstance.current.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: times, axisLabel: { rotate: 45 } },
      yAxis: { type: 'value', name: yAxisLabel },
      grid: { left: 50, right: 50, top: 60, bottom: 60, containLabel: true },
      series: [
        {
          name: yAxisLabel,
          type: 'line',
          smooth: true,
          data: values,
          symbol: 'circle',
          symbolSize: 6,
        },
      ],
      legend: { data: [yAxisLabel], top: 10, left: 'center' },
    })

    const handleResize = () => chartInstance.current?.resize()
    resizeObserverRef.current = new ResizeObserver(handleResize)
    resizeObserverRef.current.observe(chartRef.current)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      resizeObserverRef.current?.disconnect()
      chartInstance.current?.dispose()
      chartInstance.current = null
    }
  }, [data, metric, yAxisLabel])

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Error cargando datos</p>

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
