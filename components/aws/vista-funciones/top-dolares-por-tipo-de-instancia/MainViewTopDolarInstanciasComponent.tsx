'use client'
import useSWR from 'swr'
import React, { useEffect, useRef, useState } from "react"
import * as echarts from "echarts"
import { TableComponentTop } from "@/components/aws/vista-funciones/top-dolares-por-tipo-de-instancia/table/TopTableComponent"
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card'
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { TopDolarFamiliaChartComponent } from '../top-dolares-por-famila-de-instancias/grafico/TopDolarFamiliaChartComponent'

const fetcher = (url: string) =>
  fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    .then(r => r.json());

interface TopDolaresInstanceTypeProps {
  startDate: Date,
  endDate: Date
}

export const MainViewTopDolaresTipoInstancia = ({ startDate, endDate }: TopDolaresInstanceTypeProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);
  const [selectedInstance, setSelectedInstance] = useState<string | null>(null);
  const [tipoCosto, setTipoCosto] = useState<"costo_neto" | "costo_bruto">("costo_neto");
  const [topLimit, setTopLimit] = useState<number | "all">(10);

  const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

  const { data, error, isLoading } = useSWR(
    `/api/aws/bridge/facturacion/top_facturacion/INSTANCE_TYPE?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher
  )

  const topDolaresInstance = Array.isArray(data) ? data : (data?.data ?? [])

  // === Función segura para números
  const toNumber = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  // === Agrupación por Tipo de Instancia ===
  const costoKey = tipoCosto;
  const instanceMap = new Map<string, number>();

  for (const row of topDolaresInstance) {
    const instance = row.dimension ?? "N/D";
    const val = toNumber(row[costoKey]);
    instanceMap.set(instance, (instanceMap.get(instance) ?? 0) + val);
  }

  const aggregatedInstances = Array.from(instanceMap, ([instance, value]) => ({ instance, value }));
  const totalCosto = aggregatedInstances.reduce((sum, r) => sum + r.value, 0);

  const instanceMax = aggregatedInstances.reduce(
    (max, r) => (r.value > max.value ? r : max),
    { instance: null, value: -Infinity }
  );

  const instanceMin = aggregatedInstances.reduce(
    (min, r) => (r.value > 0 && r.value < min.value ? r : min),
    { instance: null, value: Infinity }
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
                  📊 Facturación por Tipo de Instancia
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Análisis de costos totales en distintos tipos de instancia
                </p>
              </div>

              {/* === Filtros === */}
              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                {/* Filtro Mostrar Top */}
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

                {/* Filtro Tipo de Costo */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Tipo de Costo
                  </label>
                  <Select
                    value={tipoCosto}
                    onValueChange={(v) =>
                      setTipoCosto(v as "costo_neto" | "costo_bruto")
                    }
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
            <TopDolarFamiliaChartComponent
              data={data}
              selectedFamily={selectedInstance}
              setSelectedFamily={setSelectedInstance}
              tipoCosto={tipoCosto}
              topLimit={topLimit}
              uiTuning={{
                yLabelStrategy: 'truncate',
                gridMinLeft: 10,
                gridMaxLeft: 10,
                axisLabelInterval: 'auto',
              }}
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
          {/* Costo Total */}
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
                    ${totalCosto.toLocaleString("es-CL", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground">Total acumulado</p>
                </div>
                <DollarSign className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>

          {/* Más costoso */}
          {instanceMax.instance && (
            <Card className="border-l-4 border-l-red-500 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Tipo de Instancia con mayor costo de facturación
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {instanceMax.instance}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${instanceMax.value.toLocaleString("es-CL", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Menos costoso */}
          {instanceMin.instance && (
            <Card className="border-l-4 border-l-green-500 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Tipo de Instancia con menor costo de facturación
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {instanceMin.instance}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${instanceMin.value.toLocaleString("es-CL", { minimumFractionDigits: 2 })}
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
