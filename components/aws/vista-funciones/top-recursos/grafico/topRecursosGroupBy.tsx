'use client'
import useSWR from 'swr'
import React, { useEffect, useRef, useState } from "react"
import * as echarts from "echarts"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

interface TopRecursosProps {
  startDate: Date,
  endDate: Date,
  groupBy: "ResourceRegion" | "ResourceType" | "ResourceService",
  title: string,
  icon?: React.ReactNode
}

export const TopRecursosChart = ({ startDate, endDate,groupBy, title, icon }: TopRecursosProps) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const [topLimit, setTopLimit] = useState<number | "all">(10)

  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
  const endDateFormatted = endDate.toISOString().replace('Z', '').slice(0, -4)

  const { data, error, isLoading } = useSWR(
    `/api/bridge/recursos/top_recursos_unicos?date_from=${startDateFormatted}&date_to=${endDateFormatted}&group_by=${groupBy}`,
    fetcher
  )

  // `data` es un array con varios grupos
  const groups = Array.isArray(data) ? data : []

  // Ahora `total_unique_resources` ya viene calculado, no necesitamos sumar histórico
  const aggregated = groups.map((g: unknown) => ({
    name: g.group_by ?? "N/A",
    total: g.total_unique_resources ?? 0
  }))

  // Ordenar y cortar por topLimit
  let sorted = aggregated.sort((a, b) => b.total - a.total)
  if (topLimit !== "all") {
    sorted = sorted.slice(0, topLimit)
  }

  useEffect(() => {
    if (!chartRef.current || !sorted.length) return
    const chart = echarts.init(chartRef.current)

    chart.setOption({
      title: { text: `${title} (${topLimit === "all" ? "Todas" : "Top " + topLimit})`, left: "center" },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      grid: { left: 150, right: 50, top: 60, bottom: 60 },
      xAxis: { type: "value", name: "Recursos" },
      yAxis: {
        type: "category",
        data: sorted.map(r => r.name),
        inverse: true,
        axisLabel: {
          formatter: (val: string) => {
            const total = sorted.find(r => r.name === val)?.total || 0
            return `${val} (${total})`
          }
        }
      },
      series: [{
        type: "bar",
        data: sorted.map(r => r.total),
        itemStyle: { borderRadius: [6, 6, 0, 0] }
      }]
    })

    const resizeObserver = new ResizeObserver(() => chart.resize())
    resizeObserver.observe(chartRef.current)

    return () => {
      resizeObserver.disconnect()
      chart.dispose()
    }
  }, [sorted, topLimit, title])

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Error cargando los datos</p>

  return (
    <Card className="shadow-lg rounded-2xl">
      <CardHeader className="border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        <Select value={topLimit.toString()} onValueChange={(val) => setTopLimit(val === "all" ? "all" : Number(val))}>
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
