"use client"

import useSWR from "swr"
import { ColumnDef, CellContext } from "@tanstack/react-table"
import { DataTableGrouping } from "@/components/data-table/data-table-grouping"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Boxes, Calendar, Cloud, FileSpreadsheet } from "lucide-react"

type TableDataTop = {
  service_dimension: string
  end_date: string
  dimension: string
  costo_neto: number | string
  costo_bruto: number | string
}

const fetcher = (url: string) =>
  fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } })
    .then((r) => r.json())

const formatCurrency = (value: number | string, maxDecimals: number = 4) => {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (!num || isNaN(num) || num === 0) return "-"
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: maxDecimals,
  }).format(num)
}

export const TableComponentTop = ({
  startDateFormatted,
  endDateFormatted,
}: {
  startDateFormatted: string
  endDateFormatted: string
}) => {
  const { data, error, isLoading } = useSWR<TableDataTop[]>(
    startDateFormatted && endDateFormatted
      ? `/api/aws/bridge/facturacion/top_facturacion/INSTANCE_TYPE_FAMILY?date_from=${startDateFormatted}&date_to=${endDateFormatted}`
      : null,
    fetcher
  )

  const filteredData = (data ?? []).filter((item) => {
    const costoNeto = typeof item.costo_neto === "string" ? parseFloat(item.costo_neto) : item.costo_neto
    const costoBruto = typeof item.costo_bruto === "string" ? parseFloat(item.costo_bruto) : item.costo_bruto
    return !(costoNeto === 0 && costoBruto === 0)
  })

  const columns: ColumnDef<TableDataTop>[] = [
    {
      accessorKey: "dimension",
      header: "Familia de Instancias",
      cell: ({ getValue }: CellContext<TableDataTop, unknown>) => (
        <div className="flex items-center gap-2 min-w-[150px]">
          <Boxes className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="font-medium text-slate-700">{getValue() as string}</span>
        </div>
      ),
    },
    {
      accessorKey: "service_dimension",
      header: "Servicio",
      cell: ({ getValue }: CellContext<TableDataTop, unknown>) => (
        <div className="flex items-center gap-2 min-w-[300px] w-full">
          <Cloud className="h-4 w-4 text-indigo-400 shrink-0" />
          <span className="text-slate-600 font-medium" title={getValue() as string}>
            {getValue() as string}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "end_date",
      header: "Fecha",
      cell: ({ getValue, row }: CellContext<TableDataTop, unknown>) => {
        if (row.getIsGrouped()) return null
        const value = getValue()
        if (!value || typeof value !== "string") return "-"
        const date = new Date(value)
        if (isNaN(date.getTime())) return value

        const formattedDate = date.toLocaleDateString("es-CL", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })

        return (
          <div className="flex items-center gap-2 text-slate-500 min-w-[120px]">
            <Calendar className="h-3 w-3 shrink-0" />
            <span className="capitalize">{formattedDate}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "costo_bruto",
      header: () => <div className="text-right w-full block">Costo Bruto</div>,
      cell: ({ getValue }: CellContext<TableDataTop, unknown>) => {
        const value = getValue() as number | string
        const num = typeof value === "string" ? parseFloat(value) : value
        return (
          <div className="text-right font-mono text-slate-500 text-xs min-w-[100px]">
            {num === 0 ? "-" : formatCurrency(value, 8)}
          </div>
        )
      },
    },
    {
      accessorKey: "costo_neto",
      header: () => <div className="text-right w-full block">Costo Neto</div>,
      cell: ({ getValue }: CellContext<TableDataTop, unknown>) => {
        const value = getValue() as number | string
        const num = typeof value === "string" ? parseFloat(value) : value
        return (
          <div className="text-right font-mono font-bold text-indigo-700 min-w-[100px]">
            {num === 0 ? <span className="text-slate-400 font-normal">Gratis</span> : formatCurrency(value, 4)}
          </div>
        )
      },
    },
  ]

  if (isLoading) return <p className="p-4 text-sm text-slate-500">Cargando datos...</p>
  if (error) return <p className="p-4 text-sm text-red-500">Error cargando datos</p>

  const startDateOnly = startDateFormatted ? startDateFormatted.split("T")[0] : ""
  const endDateOnly = endDateFormatted ? endDateFormatted.split("T")[0] : ""

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="border-b bg-slate-50/50 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
              <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
              Historial de facturación por Familia de Instancias
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Período: {startDateOnly} - {endDateOnly}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="p-2 w-full">
          <DataTableGrouping
            columns={columns}
            data={filteredData}
            filterColumn="dimension"
            filterPlaceholder="Buscar familia…"
            enableGrouping={true}
            groupByColumn="dimension"
          />
        </div>

        <div className="border-t bg-slate-50/50 px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <div>Mostrando <strong>{filteredData.length}</strong> registros</div>
        </div>
      </CardContent>
    </Card>
  )
}