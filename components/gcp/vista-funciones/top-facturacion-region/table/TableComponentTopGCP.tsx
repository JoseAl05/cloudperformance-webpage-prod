"use client"

import useSWR from "swr"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableGrouping } from "@/components/data-table/data-table-grouping"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/* =======================
   Tipado datos GCP
======================= */
type TableDataTopGCP = {
  location_region: string
  service_description: string
  usage_date: string
  cost_net_usd: number
  cost_gross_usd: number
}

/* =======================
   Fetcher
======================= */
const fetcher = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then((r) => r.json())

/* =======================
   Componente
======================= */
export const TableComponentTopGCP = ({
  startDateFormatted,
  endDateFormatted,
}: {
  startDateFormatted: string
  endDateFormatted: string
}) => {
  const { data, error, isLoading } = useSWR<TableDataTopGCP[]>(
    startDateFormatted && endDateFormatted
      ? `/api/gcp/bridge/gcp/funcion/facturacion_por_localizacion?date_from=${startDateFormatted}&date_to=${endDateFormatted}`
      : null,
    fetcher
  )

  /* =======================
     Filtrar costos = 0
  ======================= */
  const filteredData = (data ?? []).filter(
    (item) => !(item.cost_net_usd === 0 && item.cost_gross_usd === 0)
  )

  /* =======================
     Columnas
  ======================= */
  const columns: ColumnDef<TableDataTopGCP>[] = [
    {
      accessorKey: "location_region",
      header: "Región",
    },
    {
      accessorKey: "service_description",
      header: "Servicio",
    },
    {
      accessorKey: "usage_date",
      header: "Fecha",
      cell: (info) => {
        const value = info.getValue() as string 
        const [year, month, day] = value.split("-").map(Number)

        const date = new Date(year, month - 1, day)

        return date.toLocaleDateString("es-CL", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      },
    },
    {
      accessorKey: "cost_gross_usd",
      header: "Costo Bruto",
      cell: (info) => {
        const num = info.getValue() as number
        return num === 0 ? "Sin cobro" : `${num.toPrecision(6)} USD`
      },
    },
    {
      accessorKey: "cost_net_usd",
      header: "Costo Neto",
      cell: (info) => {
        const num = info.getValue() as number
        return num === 0 ? "Sin cobro" : `${num.toPrecision(6)} USD`
      },
    },
  ]

  const startDateOnly = startDateFormatted.split("T")[0]
  const endDateOnly = endDateFormatted.split("T")[0]

  if (isLoading) return <p>Cargando datos...</p>
  if (error) return <p>Error cargando datos</p>

  /* =======================
     Render
  ======================= */
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              Historial de facturación GCP por región
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Detalle de facturación de servicios en Google Cloud
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <DataTableGrouping
          columns={columns}
          data={filteredData}
          filterColumn="location_region"
          filterPlaceholder="Buscar región…"
          enableGrouping={true}
          groupByColumn="location_region"
        />

        <div className="border-t bg-muted/50 px-6 py-4">
          <div className="flex items-center justify-between">
            {data && (
              <div className="text-sm text-muted-foreground">
                Mostrando {filteredData.length} registros
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              {/* Período: {startDateFormatted} - {endDateFormatted} */}
              Período: {startDateOnly} - {endDateOnly}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}