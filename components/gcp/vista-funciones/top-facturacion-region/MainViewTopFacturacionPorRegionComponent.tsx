'use client'

import useSWR from 'swr'
import { useRef, useState } from "react"
import * as echarts from "echarts"

import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card'
import { DollarSign, TrendingUp, TrendingDown, BookOpen } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

/* === COMPONENTES GCP === */
import { TableComponentTopGCP } from "@/components/gcp/vista-funciones/top-facturacion-region/table/TableComponentTopGCP"
import { TopFacturacionChartComponentGCP } from "@/components/gcp/vista-funciones/top-facturacion-region/grafico/TopFacturacionChartComponentGCP"
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent'

/* =======================
   Tipado datos GCP
======================= */
type GCPFacturacionRow = {
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
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }).then(r => r.json())

interface TopDolaresRegionComponentProps {
  startDate: Date
  endDate: Date
}

export const MainViewTopFacturacionPorLocalizacionGCP = ({
  startDate,
  endDate
}: TopDolaresRegionComponentProps) => {

  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.EChartsType | null>(null)

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [tipoCosto, setTipoCosto] = useState<"cost_net_usd" | "cost_gross_usd">("cost_net_usd")
  const [topLimit, setTopLimit] = useState<number | "all">(10)

  const startDateFormatted = startDate
    ? startDate.toISOString().replace('Z', '').slice(0, -4)
    : '2025-12-01T00:00:00'

  const endDateFormatted = endDate
    ? endDate.toISOString().replace('Z', '').slice(0, -4)
    : '2026-12-31T23:59:59'

  /* =======================
     SWR – GCP endpoint
  ======================= */
  const { data, error, isLoading } = useSWR<GCPFacturacionRow[]>(
    `/api/gcp/bridge/gcp/funcion/facturacion_por_localizacion?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher
  )

  const rows = Array.isArray(data) ? data : []

  /* =======================
     Utils
  ======================= */
  const toNumber = (v: unknown) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
  }

  /* =======================
     Agrupación por región
  ======================= */
  const regionMap = new Map<string, number>()

  for (const row of rows) {
    const region = row.location_region ?? "N/D"
    const value = toNumber(row[tipoCosto])
    regionMap.set(region, (regionMap.get(region) ?? 0) + value)
  }

  const aggregatedRegions = Array.from(regionMap, ([region, value]) => ({
    region,
    value
  }))

  const totalCosto = aggregatedRegions.reduce((sum, r) => sum + r.value, 0)

  const regionMax = aggregatedRegions.reduce(
    (max, r) => (r.value > max.value ? r : max),
    { region: null as string | null, value: -Infinity }
  )

  const regionMin = aggregatedRegions.reduce(
    (min, r) => (r.value > 0 && r.value < min.value ? r : min),
    { region: null as string | null, value: Infinity }
  )

  const handleTopLimitChange = (value: string) => {
    setTopLimit(value === "all" ? "all" : Number(value))
  }

    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-12">
          <LoaderComponent size="large" />
          <span className="ml-3"></span>
        </div>
      )
    }
    
  if (error) return <p>Error cargando los datos</p>

  return (
    <div className="space-y-6 p-4">
<Card className="bg-slate-50 border-l-4 border-l-indigo-500 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-indigo-900">
            <BookOpen className="h-5 w-5 text-indigo-600" />
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Costo Bruto */}
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-bold text-slate-800">
              Costo Bruto 
            </span>
            <p className="text-sm text-slate-600 leading-relaxed">
              Es el <strong>precio de lista</strong> original de los servicios consumidos, sin aplicar ningún tipo de descuento o beneficio. Refleja el valor comercial "retail" de los recursos.
            </p>
          </div>

          {/* Costo Neto */}
          <div className="flex flex-col space-y-1 border-l-0 md:border-l md:pl-6 border-slate-200">
            <span className="text-sm font-bold text-slate-800">
              Costo Neto 
            </span>
            <div className="bg-white p-3 rounded-md border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-600 leading-relaxed">
                Es el <strong>monto final real a pagar</strong>. Se obtiene al restar todos los créditos y beneficios (como Free Tier o CUDs) al Costo Bruto.
              </p>
            </div>
          </div>

        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* =======================
            GRÁFICO
        ======================= */}
        <Card className="lg:col-span-3 shadow-lg rounded-2xl">
          <CardHeader className="border-b">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Facturación GCP por Región
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Análisis de costos en Google Cloud
                </p>
              </div>

              <div className="flex gap-4">
                {/* Top */}
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">
                    Mostrar Top
                  </label>
                  <Select value={topLimit.toString()} onValueChange={handleTopLimitChange}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="all">Ver todo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tipo costo */}
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">
                    Tipo de Costo
                  </label>
                  <Select
                    value={tipoCosto}
                    onValueChange={(v) =>
                      setTipoCosto(v as "cost_net_usd" | "cost_gross_usd")
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cost_net_usd">Costo Neto</SelectItem>
                      <SelectItem value="cost_gross_usd">Costo Bruto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative h-[600px]">
            <TopFacturacionChartComponentGCP
              data={rows}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              tipoCosto={tipoCosto}
              topLimit={topLimit}
              isBilling
              detailsEnabled
            />
          </CardContent>
        </Card>

        {/* =======================
            KPIs
        ======================= */}
        <div className="grid gap-6">
          <Card className="border-l-4 border-l-indigo-500">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                {tipoCosto === "cost_net_usd"
                  ? "Costo Neto Total (USD)"
                  : "Costo Bruto Total (USD)"}
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                ${totalCosto.toFixed(2)}
              </p>
              <DollarSign className="h-8 w-8 text-indigo-500 mt-2" />
            </CardContent>
          </Card>

          {regionMax.region && (
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  Región con mayor costo de facturación
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {regionMax.region}
                </p>
                <p className="text-xs">${regionMax.value.toFixed(2)}</p>
                <TrendingUp className="h-8 w-8 text-red-500 mt-2" />
              </CardContent>
            </Card>
          )}

          {regionMin.region && (
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  Región con menor costo de facturación
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {regionMin.region}
                </p>
                <p className="text-xs">${regionMin.value.toFixed(2)}</p>
                <TrendingDown className="h-8 w-8 text-green-500 mt-2" />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* =======================
          TABLA
      ======================= */}
      <TableComponentTopGCP
        startDateFormatted={startDateFormatted}
        endDateFormatted={endDateFormatted}
      />
    </div>
  )
}