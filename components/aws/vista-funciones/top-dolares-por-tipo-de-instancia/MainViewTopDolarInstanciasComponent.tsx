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

const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())

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
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/top_facturacion/INSTANCE_TYPE?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher
  )

  const topDolaresInstance = Array.isArray(data) ? data : (data?.data ?? [])

  // === Función segura para números
  const toNumber = (v: any) => {
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

  // === Gráfico ===
  useEffect(() => {
    if (!Array.isArray(topDolaresInstance) || !topDolaresInstance.length || !chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chartInstance.current = chart;

    if (selectedInstance === null) {
      // === Vista PRINCIPAL por Tipo de Instancia ===
      const filteredData = topDolaresInstance.filter(item => toNumber(item[tipoCosto]) > 0);
      if (!filteredData.length) return;

      const services = Array.from(new Set(filteredData.map(item => item.service_dimension)));

      const dataMap = new Map<string, Map<string, number>>();
      const instanceTotals: Record<string, number> = {};

      filteredData.forEach((item: any) => {
        const instance = item.dimension;
        const service = item.service_dimension;
        const cost = toNumber(item[tipoCosto]);

        instanceTotals[instance] = (instanceTotals[instance] || 0) + cost;

        if (!dataMap.has(instance)) dataMap.set(instance, new Map());
        const serviceMap = dataMap.get(instance)!;
        serviceMap.set(service, (serviceMap.get(service) || 0) + cost);
      });

      let sortedInstances = Object.entries(instanceTotals)
        .map(([instance, total]) => ({ instance, total }))
        .sort((a, b) => b.total - a.total);

      if (topLimit !== "all") {
        sortedInstances = sortedInstances.slice(0, topLimit);
      }

      const seriesData = services.map(service => ({
        name: service,
        type: 'bar',
        stack: 'total',
        data: sortedInstances.map(({ instance }) => dataMap.get(instance)?.get(service) || 0),
      }));

      const option: echarts.EChartsOption = {
        title: {
          text: `Top ${topLimit === "all" ? "" : topLimit} ${tipoCosto === 'costo_neto' ? 'Costo Neto' : 'Costo Bruto'} por Tipo de Instancia (USD)`,
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params: any) => {
          //filtrar solo valores mayores a 0
          const visibleItems = params.filter((item: any) => Number(item.value) > 0);

          const total = visibleItems.reduce((sum: number, item: any) => sum + item.value, 0);

          const tooltipItems = visibleItems.map(
            (item: any) => `${item.marker} ${item.seriesName}: $${item.value.toPrecision(2)}`
          );

          return `<strong>${params[0].axisValue} - Total: $${total.toFixed(2)}</strong><br/>${
            tooltipItems.length ? tooltipItems.join('<br/>') : '<em>Sin servicios significativos</em>'
          }`;
         },
        },
        legend: {
          type: 'scroll',
          orient: 'horizontal',
          bottom: 0,
          left: 'center',
          itemWidth: 14,
          itemHeight: 14,
          textStyle: { fontSize: 11 },
          data: services,
        },
        grid: { left: 200, right: 50, top: 100, bottom: 100 },
        toolbox: { feature: { saveAsImage: {} } },
        xAxis: { type: 'value', name: 'USD' },
        yAxis: {
          type: 'category',
          data: sortedInstances.map(r => r.instance),
          name: 'Tipos de Instancia',
          inverse: true,
          axisLabel: {
            formatter: (value: string) => {
              const total = instanceTotals[value] || 0;
              return `${value} ($${total.toFixed(2)})`;
            },
          },
        },
        series: seriesData,
      };

      chart.setOption(option);

      chart.on('click', function (params: any) {
        const instance = params.name;
        if (instance) setSelectedInstance(instance);
      });
    } else {
      // === Vista DETALLE por Servicios ===
      const instanceData = topDolaresInstance.filter((item: any) => item.dimension === selectedInstance);
      const serviceTotals: Record<string, number> = {};

      instanceData.forEach(item => {
        const service = item.service_dimension;
        const cost = toNumber(item[tipoCosto]);
        serviceTotals[service] = (serviceTotals[service] || 0) + cost;
      });

      const sortedServices = Object.entries(serviceTotals)
        .map(([service, total]) => ({ service, total }))
        .filter(s => s.total > 0)   // filtrar servicios en 0
        .sort((a, b) => b.total - a.total);

      const option: echarts.EChartsOption = {
        title: { text: `Detalle de Costos por Servicio - ${selectedInstance}`, left: 'center' },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params: any) => {
            const visibleItems = params.filter((item: any) => Number(item.value) > 0);

            const total = visibleItems.reduce((sum: number, item: any) => sum + item.value, 0);

            const tooltipItems = visibleItems.map(
              (item: any) => `${item.marker} ${item.name}: $${item.value.toPrecision(2)}`
            );

            return `<strong>Total: $${total.toFixed(2)}</strong><br/>${
              tooltipItems.length ? tooltipItems.join('<br/>') : '<em>Sin servicios significativos</em>'
            }`;
          },
        },
        grid: { left: 150, right: 50, top: 60, bottom: 40 },
        xAxis: { type: 'value', name: 'USD' },
        yAxis: { type: 'category', data: sortedServices.map(s => s.service), inverse: true },
        series: [{ type: 'bar', data: sortedServices.map(s => s.total) }],
      };

      chart.setOption(option);
    }

    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, [topDolaresInstance, tipoCosto, topLimit, selectedInstance]);

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
            {selectedInstance && (
              <Button
                onClick={() => setSelectedInstance(null)}
                className="absolute top-4 left-4 px-3 py-1 rounded text-sm z-10 bg-blue-600 text-white hover:bg-blue-700"
              >
                ← Volver
              </Button>
            )}
            <div ref={chartRef} className="w-full h-[600px]" />
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
