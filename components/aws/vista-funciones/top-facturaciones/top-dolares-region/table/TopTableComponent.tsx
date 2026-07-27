"use client"

import useSWR from "swr"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableGrouping } from "@/components/data-table/data-table-grouping"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { 
  MapPin, 
  Calendar, 
  Cloud, 
  FileSpreadsheet
} from "lucide-react"


type TableDataTop = {
  service_dimension: string
  end_date: string
  dimension: string
  costo_neto: number | string
  costo_bruto: number | string
}

const fetcher = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then((r) => r.json())


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
      ? `/api/aws/bridge/facturacion/top_facturacion/REGION?date_from=${startDateFormatted}&date_to=${endDateFormatted}`
      : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  //Filtrar fuera los que tienen ambos costos = 0
  const filteredData = (data ?? []).filter((item) => {
    const costoNeto = typeof item.costo_neto === "string" ? parseFloat(item.costo_neto) : item.costo_neto
    const costoBruto = typeof item.costo_bruto === "string" ? parseFloat(item.costo_bruto) : item.costo_bruto
    return !(costoNeto === 0 && costoBruto === 0)
  })

  const columns: ColumnDef<TableDataTop>[] = [
    {
      accessorKey: "dimension",
      header: "Región",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2 min-w-[150px]">
          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="font-medium text-slate-700">{getValue() as string}</span>
        </div>
      )
    },
    {
      accessorKey: "service_dimension",
      header: "Servicio",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2 min-w-[300px] w-full">
          <Cloud className="h-4 w-4 text-indigo-400 shrink-0" />
          <span className="text-slate-600 font-medium" title={getValue() as string}>
            {getValue() as string}
          </span>
        </div>
      )
    },
    {
      accessorKey: "end_date",
      header: "Fecha",
      cell: ({ getValue, row }) => {
        if (row.getIsGrouped()) {
          return null
        }
        const value = getValue()
        if (!value || typeof value !== "string") {
          return "-"
        }
        const date = new Date(value)
        if (isNaN(date.getTime())) {
          return value
        }

        const formattedDate = date.toLocaleDateString("es-CL", {
          day: "numeric",
          month: "short",
          year: "numeric"
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
      cell: ({ getValue }) => {
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
      cell: ({ getValue }) => {
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

  const startDateOnly = startDateFormatted ? startDateFormatted.split("T")[0] : ""
  const endDateOnly = endDateFormatted ? endDateFormatted.split("T")[0] : ""

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="border-b pb-4"><Skeleton className="h-8 w-1/3 mb-2" /></CardHeader>
        <CardContent className="p-6 space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </CardContent>
      </Card>
    )
  }

  if (error) return <p className="text-red-500 p-4">Error cargando datos</p>

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="border-b bg-slate-50/50 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
              <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
              Detalle de Facturación por Región
            </CardTitle>
            <CardDescription className="mt-1">
               {startDateOnly} — {endDateOnly}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="p-2 w-full"> 
            <DataTableGrouping
              columns={columns}
              data={filteredData}
              filterColumn="dimension"
              filterPlaceholder="Buscar región..."
              enableGrouping={true}
              groupByColumn="dimension"
            />
        </div>
        <div className="border-t bg-slate-50/50 px-6 py-3 text-xs text-slate-500">
             Registros totales: <strong>{filteredData.length}</strong>
        </div>
      </CardContent>
    </Card>
  )
}