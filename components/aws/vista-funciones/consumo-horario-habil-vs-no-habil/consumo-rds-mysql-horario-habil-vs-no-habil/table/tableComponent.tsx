"use client"

import useSWR from "swr"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableGrouping } from "@/components/data-table/data-table-grouping"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpDown } from "lucide-react"

type MysqlMetricData = {
  Resource: string
  ResourceRegion: string
  MetricLabel: string
  Timestamp: string
  Horario: "Habil" | "No habil"
  Value: number
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const TableRdsMysqlMetrics = ({
  startDateFormatted,
  endDateFormatted,
  metric,
  instance
}: {
  startDateFormatted: string
  endDateFormatted: string
  metric?: string
  instance?: string
}) => {
  const { data, error, isLoading } = useSWR<{ data: MysqlMetricData[] }>(
    startDateFormatted && endDateFormatted
      ? `/api/aws/bridge/aws/rds/mysql/business-vs-offhours?date_from=${startDateFormatted}&date_to=${endDateFormatted}&metric_label=${metric}&resource=${instance || "all"}`
      : null,
    fetcher
  )

  const metrics = data?.data ?? []

  const columns: ColumnDef<MysqlMetricData>[] = [
    {
      accessorKey: "Resource",
      header: "Instancia",
    },
    {
      accessorKey: "ResourceRegion",
      header: "Región",
    },
    {
      accessorKey: "Timestamp",
      header: "Fecha",
      cell: info => {
        const date = new Date(info.getValue() as string)
        const yyyy = date.getUTCFullYear()
        const mm = String(date.getUTCMonth() + 1).padStart(2, '0')
        const dd = String(date.getUTCDate()).padStart(2, '0')
        const hh = String(date.getUTCHours()).padStart(2, '0')
        const min = String(date.getUTCMinutes()).padStart(2, '0')
        const ss = String(date.getUTCSeconds()).padStart(2, '0')
        return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`
      }
    },
    {
      accessorKey: "Value",
      header: ({ column }) => (
        <span onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Valor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      ),
      cell: info => {
        const num = info.getValue() as number
        return num.toFixed(2)
      }
    },
    {
      accessorKey: "Horario",
      header: "Horario",
    },
  ]

  if (isLoading) return <p>Cargando datos...</p>
  if (error) return <p>Error cargando datos</p>

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Detalle Instancias</CardTitle>
      </CardHeader>

      <CardContent>
        <DataTableGrouping
          columns={columns}
          data={metrics}
          filterColumn="Resource"
          filterPlaceholder="Buscar instancia…"
          enableGrouping={true}          // agrupa por Horario
          groupByColumn="Horario"
        />

        <div className="border-t bg-muted/50 px-6 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>Mostrando {metrics.length} registros</div>
            <div>Período: {startDateFormatted} - {endDateFormatted}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
