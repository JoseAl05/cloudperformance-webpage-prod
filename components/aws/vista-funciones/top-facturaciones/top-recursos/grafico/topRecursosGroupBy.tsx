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
import { AlertCircle } from 'lucide-react'

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

  const aggregated = useMemo(() => {
    const groups: Row[] = Array.isArray(data) ? (data as Row[]) : []
    
    const rows = groups.map((g) => ({
      name: typeof g.group_by === 'string' ? g.group_by : String(g.group_by ?? 'N/A'),
      total: Number(g.total_unique_resources) || 0,
    }))
    
    const sorted = rows.sort((a, b) => b.total - a.total)
    return topLimit === 'all' ? sorted : sorted.slice(0, topLimit)
  }, [data, topLimit])

  const chartData = useMemo(() => {
    return aggregated.map((r) => ({
      dimension: r.name,
      service_dimension: 'Recursos Únicos',
      costo_neto: r.total,
      costo_bruto: r.total,
    }))
  }, [aggregated])

  if (isLoading) {
    return (
      <Card className="shadow-md rounded-2xl border border-border/50 h-[420px] flex flex-col justify-between p-6 animate-pulse bg-card">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-8 bg-muted rounded w-24"></div>
        </div>
        <div className="h-64 bg-muted/60 rounded-xl w-full my-auto"></div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="shadow-md rounded-2xl border border-destructive/20 h-[420px] flex flex-col items-center justify-center p-6 text-center bg-destructive/5">
        <AlertCircle className="h-10 w-10 text-destructive mb-3" />
        <p className="font-semibold text-destructive">No se pudieron cargar los datos</p>
        <p className="text-xs text-muted-foreground mt-1">Ocurrió un error al consultar la agrupación por {groupBy}.</p>
      </Card>
    )
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 rounded-2xl border border-border/60 bg-card">
      <CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2.5">
            {icon}
            <CardTitle className="text-base font-semibold text-foreground">{title}</CardTitle>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Muestra: Última captura registrada
          </span>
        </div>

        <Select
          value={topLimit.toString()}
          onValueChange={(val) => setTopLimit(val === 'all' ? 'all' : Number(val))}
        >
          <SelectTrigger className="w-24 h-8 text-xs bg-background">
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

      <CardContent className="relative pt-4">
        <div className="mb-2 flex items-center justify-between text-xs px-1">
          <span className="text-muted-foreground">Total de elementos activos</span>
          <span className="font-medium bg-muted/50 px-2 py-0.5 rounded text-foreground border border-border/40">
            Unidad: <strong className="font-semibold text-primary">N° de Recursos</strong>
          </span>
        </div>

        <TopFacturacionChartComponent
          data={chartData}
          selectedFamily={selectedFamily}
          setSelectedFamily={setSelectedFamily}
          tipoCosto="costo_neto"
          topLimit={topLimit}
          detailsEnabled={false}
          uiTuning={{
            yLabelStrategy: 'truncate',
            yLabelMaxChars: 32,
            yLabelFontSize: 11,
            gridMinLeft: 20,
            gridMaxLeft: 30,
            axisLabelInterval: 'auto',
            legend: { type: 'plain', orient: 'horizontal', bottom: 4, left: 'center' },
          }}
          isBilling={false}
        />
      </CardContent>
    </Card>
  )
}