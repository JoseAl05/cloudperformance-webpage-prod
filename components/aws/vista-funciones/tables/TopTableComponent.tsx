"use client"

import useSWR from "swr"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableSingle } from "@/components/general/data-table/data-table-single"
import { ArrowUpDown } from "lucide-react"
import { LoaderComponent } from '@/components/general/LoaderComponent'

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
      ? `/api/aws/bridge/facturacion/top_facturacion/REGION?date_from=${startDateFormatted}&date_to=${endDateFormatted}`
      : null,
    fetcher
  )

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
      header: "Región",
    },
    {
      accessorKey: "costo_bruto",
      header: ({ column }) => {
      return (
        <span
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Costo Bruto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      )
    },
      cell: (info) => {
        const value = info.getValue()
        const num = typeof value === "string" ? parseFloat(value) : value
        return `${num.toFixed(6)} USD`
      },
    },
    {
      accessorKey: "costo_neto",
      header: ({ column }) => {
      return (
        <span
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Costo Neto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      )
    },
      cell: (info) => {
        const value = info.getValue()
        const num = typeof value === "string" ? parseFloat(value) : value
        return `${num.toFixed(6)} USD`
      },
    },
  ]

  if (isLoading) return <LoaderComponent />
  if (error) return <p>Error cargando datos</p>

  return (
    <DataTableSingle
      columns={columns}
      data={data ?? []}
      filterColumn="service_dimension"
      filterPlaceholder="Buscar servicio…"
    />
  )
}
