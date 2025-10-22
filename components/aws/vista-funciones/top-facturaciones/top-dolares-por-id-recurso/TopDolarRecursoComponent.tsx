'use client'
import useSWR from 'swr'
import { useRef, useState } from "react"
import * as echarts from "echarts"
import { TableComponentTop } from "@/components/aws/vista-funciones/top-facturaciones/top-dolares-por-id-recurso/table/TopTableComponent"
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card'
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { TopFacturacionChartComponent } from '@/components/aws/vista-funciones/top-facturaciones/grafico/TopFacturacionChartComponent'

const fetcher = (url: string) =>
  fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    .then(r => r.json());

interface TopDolaresResourceProps {
  startDate: Date,
  endDate: Date
}

export const MainViewTopDolaresRecurso = ({ startDate, endDate }: TopDolaresResourceProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [tipoCosto, setTipoCosto] = useState<"costo_neto" | "costo_bruto">("costo_neto");
  const [topLimit, setTopLimit] = useState<number | "all">(10);

  const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

  const { data, error, isLoading } = useSWR(
    `/api/aws/bridge/facturacion/top_facturacion/RESOURCE_ID?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher
  )

  const topDolaresResource = Array.isArray(data) ? data : (data?.data ?? [])

  const toNumber = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  // === Agrupación por recurso (para KPIs y totales) ===
  const costoKey = tipoCosto;
  const resourceMap = new Map<string, number>();

  for (const row of topDolaresResource) {
    const resource = row.dimension ?? "N/D";
    const val = toNumber(row[costoKey]);
    resourceMap.set(resource, (resourceMap.get(resource) ?? 0) + val);
  }

  const aggregatedResources = Array.from(resourceMap, ([resource, value]) => ({ resource, value }));
  const totalCosto = aggregatedResources.reduce((sum, r) => sum + r.value, 0);

  const resourceMax = aggregatedResources.reduce(
    (max, r) => (r.value > max.value ? r : max),
    { resource: null, value: -Infinity }
  );

  const resourceMin = aggregatedResources.reduce(
    (min, r) => (r.value > 0 && r.value < min.value ? r : min),
    { resource: null, value: Infinity }
  );

  const handleTopLimitChange = (value: string) => {
    setTopLimit(value === "all" ? "all" : Number(value));
  };



  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error cargando los datos.</p>;

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* === Gráfico === */}
        <Card className="lg:col-span-3 shadow-lg rounded-2xl">
          <CardHeader className="border-b">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 w-full">
              <div>
                <CardTitle className="flex items-center gap-2">
                  🆔 Facturación por Recurso
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Análisis de costos totales agrupados por recurso
                </p>
              </div>

              {/* === Filtros === */}
              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Mostrar Top
                  </label>
                  <Select value={topLimit.toString()} onValueChange={handleTopLimitChange}>
                    <SelectTrigger className="w-full md:w-36">
                      <SelectValue placeholder="Mostrar Top" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="all">Ver todo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Tipo de Costo
                  </label>
                  <Select
                    value={tipoCosto}
                    onValueChange={(v) => setTipoCosto(v as "costo_neto" | "costo_bruto")}
                  >
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Tipo de Costo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="costo_neto">Costo Neto</SelectItem>
                      <SelectItem value="costo_bruto">Costo Bruto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative h-[600px]">
            <TopFacturacionChartComponent
              data={data}
              selectedFamily={selectedResource}
              setSelectedFamily={setSelectedResource}
              tipoCosto={tipoCosto}
              topLimit={topLimit}
              uiTuning={{
                yLabelStrategy: 'truncate',
                gridMinLeft: 30,
                gridMaxLeft: 20,
                axisLabelInterval: 'auto',
                legend: { type: 'scroll', orient: 'horizontal', bottom: 8, left: 'center' },
              }}
              isBilling
              detailsEnabled
            />
          </CardContent>

          <div className="border-t bg-muted/50 px-6 py-3">
            <div className="flex justify-end text-sm text-muted-foreground">
              Actualizado al: {startDateFormatted} - {endDateFormatted}
            </div>
          </div>
        </Card>

        {/* === KPIs === */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="border-l-4 border-l-indigo-500 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {tipoCosto === "costo_neto"
                      ? "Costo Neto Total (USD)"
                      : "Costo Bruto Total (USD)"}
                  </p>
                  <p className="text-2xl font-bold text-indigo-600">
                    ${totalCosto.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total facturado acumulado</p>
                </div>
                <DollarSign className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>

          {resourceMax.resource && (
            <Card className="border-l-4 border-l-red-500 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Recurso con mayor costo de facturación
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {resourceMax.resource}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${resourceMax.value.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          )}

          {resourceMin.resource && (
            <Card className="border-l-4 border-l-green-500 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Recurso con menor costo de facturación
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {resourceMin.resource}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${resourceMin.value.toFixed(2)}
                    </p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* === Tabla === */}
      <div>
        <TableComponentTop
          startDateFormatted={startDateFormatted}
          endDateFormatted={endDateFormatted}
        />
      </div>
    </div>
  )
}
