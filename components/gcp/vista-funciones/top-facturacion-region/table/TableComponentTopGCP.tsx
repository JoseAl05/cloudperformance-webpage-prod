"use client"

import useSWR from "swr"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableGrouping } from "@/components/data-table/data-table-grouping"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button" 
import { Skeleton } from "@/components/ui/skeleton"

import { 
  MapPin, 
  Calendar, 
  Cloud, 
  Download, 
  RefreshCcw,
  FileSpreadsheet
} from "lucide-react"

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
   Utils & Fetcher
======================= */
const fetcher = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then((r) => r.json())

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value)
}

/* =======================
   Componente
======================= */
export const TableComponentTopGCP = ({
  startDateFormatted,
  endDateFormatted,
  projects,
  tagKey,
  tagValue
}: {
  startDateFormatted: string
  endDateFormatted: string
  projects: string;
  tagKey: string | null;
  tagValue: string | null;
}) => {
  
  const { data, error, isLoading, mutate } = useSWR<TableDataTopGCP[]>(
    startDateFormatted && endDateFormatted
      ? `/api/gcp/bridge/gcp/funcion/facturacion_por_localizacion?date_from=${startDateFormatted}&date_to=${endDateFormatted}&project_id=${projects}&tag_key=${tagKey}&tag_value=${tagValue}`
      : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  const handleExportCSV = () => {
    if (!data) return
    const headers = ["Región,Servicio,Fecha,Costo Bruto,Costo Neto"]
    const csvContent = data.map(row => 
      `${row.location_region},"${row.service_description}",${row.usage_date},${row.cost_gross_usd},${row.cost_net_usd}`
    ).join("\n")
    const blob = new Blob([headers + "\n" + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `gcp_billing.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredData = (data ?? []).filter(
    (item) => !(item.cost_net_usd === 0 && item.cost_gross_usd === 0)
  )

  /* =============================================
     COLUMNAS AJUSTADAS PARA ANCHO TOTAL
  ============================================= */
  const columns: ColumnDef<TableDataTopGCP>[] = [
    {
      accessorKey: "location_region",
      header: "Región",
      // Ajuste: Ancho mínimo fijo para que no se apriete
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2 min-w-[150px]">
          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="font-medium text-slate-700">{getValue() as string}</span>
        </div>
      )
    },
    {
      accessorKey: "service_description",
      header: "Servicio",
      // Ajuste CRÍTICO: Eliminamos el max-w y truncate, ponemos min-w grande
      // para que esta columna ocupe el espacio sobrante.
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
      accessorKey: "usage_date",
      header: "Fecha de Uso",
      cell: ({ getValue }) => {
        const value = getValue() as string 
        const [year, month, day] = value.split("-").map(Number)
        const date = new Date(year, month - 1, day)
        const formattedDate = date.toLocaleDateString("es-CL", {
            day: "numeric", month: "short", year: "numeric"
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
      accessorKey: "cost_gross_usd",
      // header alineado a la derecha explícitamente con clase
      header: () => <div className="text-right w-full block">Costo Bruto</div>,
      cell: ({ getValue }) => {
        const num = getValue() as number
        return (
          <div className="text-right font-mono text-slate-500 text-xs min-w-[100px]">
            {num === 0 ? "-" : formatCurrency(num)}
          </div>
        )
      },
    },
    {
      accessorKey: "cost_net_usd",
      header: () => <div className="text-right w-full block">Costo Neto</div>,
      cell: ({ getValue }) => {
        const num = getValue() as number
        return (
          <div className="text-right font-mono font-bold text-indigo-700 min-w-[100px]">
            {num === 0 ? <span className="text-slate-400">Gratis</span> : formatCurrency(num)}
          </div>
        )
      },
    },
  ]

  const startDateOnly = startDateFormatted.split("T")[0]
  const endDateOnly = endDateFormatted.split("T")[0]

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
              Detalle de Facturación
            </CardTitle>
            <CardDescription className="mt-1">
               {startDateOnly} — {endDateOnly}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => mutate()} className="h-8 text-slate-600">
                <RefreshCcw className="h-3.5 w-3.5 mr-2" /> Actualizar
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExportCSV} disabled={!filteredData.length} className="h-8 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200">
                <Download className="h-3.5 w-3.5 mr-2" /> Exportar CSV
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="p-2 w-full"> {/* Aseguramos contenedor full width */}
            <DataTableGrouping
                columns={columns}
                data={filteredData}
                filterColumn="location_region"
                filterPlaceholder="Buscar región..."
                enableGrouping={true}
                groupByColumn="location_region"
            />
        </div>
        <div className="border-t bg-slate-50/50 px-6 py-3 text-xs text-slate-500">
             Registros totales: <strong>{filteredData.length}</strong>
        </div>
      </CardContent>
    </Card>
  )
}