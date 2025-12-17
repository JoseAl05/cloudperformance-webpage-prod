'use client'
import useSWR from 'swr'
import React, { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TopFacturacionChartComponent } from '@/components/aws/vista-funciones/top-facturaciones/grafico/TopFacturacionChartComponent'


const fetcher = (url: string) =>
  fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } }).then((r) => r.json())

interface TopRecursosProps {
  groupBy: 'ResourceRegion' | 'ResourceType' | 'ResourceService'
  title: string
  icon?: React.ReactNode
}

type Row = {
  group_by: unknown
  total_unique_resources: unknown
}

export const TopRecursosChart = ({ groupBy, title, icon }: TopRecursosProps) => {
  const [topLimit, setTopLimit] = useState<number | 'all'>(10)
  const [selectedFamily, setSelectedFamily] = useState<string>('')


  const { data, error, isLoading } = useSWR(
    `/api/aws/bridge/recursos/top_recursos_unicos?group_by=${groupBy}`,
    fetcher
  )

  const groups: Row[] = Array.isArray(data) ? (data as Row[]) : []

  const aggregated = useMemo(() => {
    const rows = groups.map((g) => ({
      name: typeof g.group_by === 'string' ? g.group_by : String(g.group_by ?? 'N/A'),
      total: Number(g.total_unique_resources) || 0,
    }))
    const sorted = rows.sort((a, b) => b.total - a.total)
    return topLimit === 'all' ? sorted : sorted.slice(0, topLimit)
  }, [groups, topLimit])

  const chartData = useMemo(() => {
    return aggregated.map((r) => ({
      dimension: r.name,
      service_dimension: 'Recursos',
      costo_neto: r.total,
      costo_bruto: r.total,
    }))
  }, [aggregated])

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Error cargando los datos</p>


  return (
    <Card className="shadow-lg rounded-2xl">
      <CardHeader className="border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>

        <Select
          value={topLimit.toString()}
          onValueChange={(val) => setTopLimit(val === 'all' ? 'all' : Number(val))}
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

      <CardContent className="relative">
        <TopFacturacionChartComponent
          data={chartData}
          selectedFamily={selectedFamily}
          setSelectedFamily={setSelectedFamily}
          tipoCosto="costo_neto"
          topLimit={topLimit}
          detailsEnabled={false}
          uiTuning={{
            yLabelStrategy: 'truncate',
            yLabelMaxChars: 38,
            yLabelFontSize: 12,
            gridMinLeft: 30,
            gridMaxLeft: 40,
            axisLabelInterval: 'auto',
            legend: { type: 'plain', orient: 'horizontal', bottom: 8, left: 'center' },
          }}
          isBilling={false}
        />
      </CardContent>
    </Card>
  )
}
