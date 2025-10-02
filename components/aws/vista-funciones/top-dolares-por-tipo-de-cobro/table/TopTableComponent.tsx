"use client"

import useSWR from "swr"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableGrouping } from "@/components/general/data-table/data-table-grouping"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

type TableDataTop = {
  service_dimension: string
  end_date: string
  record_type: string
  costo_neto: number | string
  costo_bruto: number | string
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const TableComponentTop = ({
  startDateFormatted,
  endDateFormatted,
}: {
  startDateFormatted: string
  endDateFormatted: string
}) => {
  const { data, error, isLoading } = useSWR<TableDataTop[]>(
    startDateFormatted && endDateFormatted
      ? `/api/aws/bridge/facturacion/top_facturacion/RECORD_TYPE?date_from=${startDateFormatted}&date_to=${endDateFormatted}`
      : null,
    fetcher
  )

  // 🔎 Filtrar fuera los valores con 0
  const filteredData = (data ?? []).filter((item) => {
    const costoNeto = typeof item.costo_neto === "string" ? parseFloat(item.costo_neto) : item.costo_neto
    const costoBruto = typeof item.costo_bruto === "string" ? parseFloat(item.costo_bruto) : item.costo_bruto
    return costoNeto !== 0 && costoBruto !== 0
  })

  const columns: ColumnDef<TableDataTop>[] = [
    {
      accessorKey: "service_dimension",
      header: "Servicio",
    },
    {
      accessorKey: "end_date",
      header: ({ column }) => (
        <span
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      ),
      cell: (info) => {
        const date = new Date(info.getValue() as string)
        return date.toLocaleDateString("es-CL", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      },
    },
    {
      accessorKey: "dimension",
      header: "Tipo de Cobro",
    },
    {
      accessorKey: "costo_bruto",
      header: ({ column }) => (
        <span
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Costo Bruto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      ),
      cell: (info) => {
        const value = info.getValue()
        const num = typeof value === "string" ? parseFloat(value) : value
        return num === 0 ? "Sin cobro" : `${num.toPrecision(6)} USD`
      },
    },
    {
      accessorKey: "costo_neto",
      header: ({ column }) => (
        <span
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Costo Neto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      ),
      cell: (info) => {
        const value = info.getValue()
        const num = typeof value === "string" ? parseFloat(value) : value
        return num === 0 ? "Sin cobro" : `${num.toPrecision(6)} USD`
      },
    },
  ]

  if (isLoading) return <p>Cargando datos...</p>
  if (error) return <p>Error cargando datos</p>

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              📑 Historial de facturación por Tipo de Cobro
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Detalle de facturación agrupada según el tipo de cobro
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <DataTableGrouping
          columns={columns}
          data={filteredData}
          filterColumn="dimension"
          filterPlaceholder="Buscar tipo de cobro…"
          enableGrouping={true}                // activa agrupación
          groupByColumn="dimension"          // agrupa por Tipo de Cobro
        />

        <div className="border-t bg-muted/50 px-6 py-4">
          <div className="flex items-center justify-between">
            {data && (
              <div className="text-sm text-muted-foreground">
                Mostrando {data.length} registros
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              Período: {startDateFormatted} - {endDateFormatted}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
