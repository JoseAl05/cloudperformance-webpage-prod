"use client"

import useSWR from "swr"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableGrouping } from "@/components/general/data-table/data-table-grouping"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

type TableDataTop = {
  service_dimension: string
  end_date: string
  dimension: string
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
      ? `/api/aws/bridge/facturacion/top_facturacion/OPERATING_SYSTEM?date_from=${startDateFormatted}&date_to=${endDateFormatted}`
      : null,
    fetcher
  )

  // 🔎 Filtrar fuera los que tienen ambos costos = 0
  const filteredData = (data ?? []).filter((item) => {
    const costoNeto = typeof item.costo_neto === "string" ? parseFloat(item.costo_neto) : item.costo_neto
    const costoBruto = typeof item.costo_bruto === "string" ? parseFloat(item.costo_bruto) : item.costo_bruto
    return !(costoNeto === 0 && costoBruto === 0)   // ✅ deja pasar si alguno es distinto de 0
  })

  const columns: ColumnDef<TableDataTop>[] = [
    {
      accessorKey: "service_dimension",
      header: "Servicio",
    },
    {
      accessorKey: "end_date",
      header: ({ column }) => {
        return (
          <span
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fecha
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </span>
        )
      },
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
      header: "Sistema Operativo",
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
    <DataTableGrouping
      columns={columns}
      data={filteredData}
      filterColumn="dimension"
      filterPlaceholder="Buscar sistema operativo…"
      enableGrouping={true}
      groupByColumn="dimension"
    />
  )
}
