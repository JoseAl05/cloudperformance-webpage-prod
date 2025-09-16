'use client'
import useSWR from 'swr'
import React, { lazy, useEffect, useRef, useState } from "react"
import * as echarts from "echarts"
import { TableComponentTop } from "@/components/aws/vista-funciones/top-dolares-por-id-recurso/table/TopTableComponent"
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
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/top_facturacion/RESOURCE_ID?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
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


  // useEffect(() => {
  //   if (!Array.isArray(topDolaresResource) || !topDolaresResource.length || !chartRef.current) return;

  //   const chart = echarts.init(chartRef.current);
  //   chartInstance.current = chart;

  //   if (selectedResource === null) {
  //     // === VISTA PRINCIPAL por SERVICIO ===
  //     const filteredData = topDolaresResource.filter(item => toNumber(item[tipoCosto]) > 0);
  //     if (!filteredData.length) return;

  //     const resources = Array.from(new Set(filteredData.map(item => item.dimension)));

  //     const dataMap = new Map<string, Map<string, number>>();
  //     const serviceTotals: Record<string, number> = {};

  //     filteredData.forEach((item: unknown) => {
  //       const service = item.service_dimension;
  //       const resource = item.dimension;
  //       const cost = toNumber(item[tipoCosto]);

  //       serviceTotals[service] = (serviceTotals[service] || 0) + cost;

  //       if (!dataMap.has(service)) dataMap.set(service, new Map());
  //       const resourceMap = dataMap.get(service)!;
  //       resourceMap.set(resource, (resourceMap.get(resource) || 0) + cost);
  //     });

  //     let sortedServices = Object.entries(serviceTotals)
  //       .map(([service, total]) => ({ service, total }))
  //       .sort((a, b) => b.total - a.total);

  //     if (topLimit !== "all") {
  //       sortedServices = sortedServices.slice(0, topLimit);
  //     }

  //     const seriesData = resources.map(resource => ({
  //       name: resource,
  //       type: "bar",
  //       stack: "total",
  //       large: true,       
  //       data: sortedServices.map(({ service }) => dataMap.get(service)?.get(resource) || 0),
  //     }));

  //     const option: echarts.EChartsOption = {
  //       title: {
  //         text: `Top ${topLimit === "all" ? "" : topLimit} ${tipoCosto === "costo_neto" ? "Costo Neto" : "Costo Bruto"} por Servicio (USD)`,
  //         left: "center",
  //       },
  //       tooltip: {
  //         trigger: "axis",
  //         axisPointer: { type: "shadow" },
  //         formatter: (params: unknown) => {
  //           const visibleItems = params.filter((item: unknown) => Number(item.value) > 0);
  //           const total = visibleItems.reduce((sum: number, item: unknown) => sum + item.value, 0);

  //           const tooltipItems = visibleItems.map(
  //             (item: unknown) => `${item.marker} ${item.seriesName}: $${item.value.toPrecision(2)}`
  //           );

  //           return `<strong>${params[0].axisValue} - Total: $${total.toFixed(2)}</strong><br/>${
  //             tooltipItems.length ? tooltipItems.join("<br/>") : "<em>Sin recursos significativos</em>"
  //           }`;
  //         },
  //       },
  //       legend: {
  //         type: "scroll",
  //         bottom: 0,
  //         left: "center",
  //         data: resources,
  //       },
  //       grid: { left: 200, right: 50, top: 100, bottom: 100 },
  //       xAxis: { type: "value", name: "USD" },
  //       yAxis: {
  //         type: "category",
  //         data: sortedServices.map(s => s.service),
  //         name: "Servicio",
  //         inverse: true,
  //         axisLabel: {
  //           formatter: (value: string) => {
  //             const total = serviceTotals[value] || 0;
  //             return `${value} ($${total.toFixed(2)})`;
  //           },
  //         },
  //       },
  //       series: seriesData,
  //     };

  //     chart.setOption(option);

  //     chart.on("click", function (params: unknown) {
  //       const service = params.name;
  //       if (service) setSelectedResource(service);
  //     });
  //   } else {
  //     // === VISTA DETALLE por RECURSOS ===
  //     const serviceData = topDolaresResource.filter((item: unknown) => item.service_dimension === selectedResource);
  //     const resourceTotals: Record<string, number> = {};

  //     serviceData.forEach(item => {
  //       const resource = item.dimension;
  //       const cost = toNumber(item[tipoCosto]);
  //       resourceTotals[resource] = (resourceTotals[resource] || 0) + cost;
  //     });

  //     const sortedResources = Object.entries(resourceTotals)
  //       .map(([resource, total]) => ({ resource, total }))
  //       .filter(r => r.total > 0)
  //       .sort((a, b) => b.total - a.total);

  //     const option: echarts.EChartsOption = {
  //       title: { text: `Detalle de Costos por Recurso - ${selectedResource}`, left: "center" },
  //       tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
  //       grid: { left: 150, right: 50, top: 60, bottom: 40 },
  //       xAxis: { type: "value", name: "USD" },
  //       yAxis: { type: "category", data: sortedResources.map(r => r.resource), inverse: true },
  //       series: [{ type: "bar", data: sortedResources.map(r => r.total) }],
  //     };

  //     chart.setOption(option);
  //   }

  //   const resizeObserver = new ResizeObserver(() => chart.resize());
  //   resizeObserver.observe(chartRef.current);

  //   return () => {
  //     resizeObserver.disconnect();
  //     chart.dispose();
  //   };
  // }, [topDolaresResource, tipoCosto, topLimit, selectedResource]);

  // === Gráfico ===
  
  // useEffect(() => {
  //   if (!Array.isArray(topDolaresResource) || !topDolaresResource.length || !chartRef.current) return;

  //   const chart = echarts.init(chartRef.current);
  //   chartInstance.current = chart;

  //   if (selectedResource === null) {
  //     // === VISTA PRINCIPAL por SERVICIO ===
  //     const filteredData = topDolaresResource.filter(item => toNumber(item[tipoCosto]) > 0);
  //     if (!filteredData.length) return;

  //     const resources = Array.from(new Set(filteredData.map(item => item.dimension)));

  //     const dataMap = new Map<string, Map<string, number>>();
  //     const serviceTotals: Record<string, number> = {};

  //     filteredData.forEach((item: unknown) => {
  //       const service = item.service_dimension;
  //       const resource = item.dimension;
  //       const cost = toNumber(item[tipoCosto]);

  //       serviceTotals[service] = (serviceTotals[service] || 0) + cost;

  //       if (!dataMap.has(service)) dataMap.set(service, new Map());
  //       const resourceMap = dataMap.get(service)!;
  //       resourceMap.set(resource, (resourceMap.get(resource) || 0) + cost);
  //     });

  //     let sortedServices = Object.entries(serviceTotals)
  //       .map(([service, total]) => ({ service, total }))
  //       .sort((a, b) => b.total - a.total);

  //     if (topLimit !== "all") {
  //       sortedServices = sortedServices.slice(0, topLimit);
  //     }

  //     // 🔥 Limitar a Top 20 recursos para no saturar el gráfico
  //     const resourceTotalsGlobal: Record<string, number> = {};
  //     filteredData.forEach(item => {
  //       const r = item.dimension;
  //       const c = toNumber(item[tipoCosto]);
  //       resourceTotalsGlobal[r] = (resourceTotalsGlobal[r] || 0) + c;
  //     });

  //     const topResources = Object.entries(resourceTotalsGlobal)
  //       .sort((a, b) => b[1] - a[1])
  //       .slice(0, 20) // 👈 aquí puedes ajustar cuántos recursos mostrar
  //       .map(([r]) => r);

  //     const seriesData = topResources.map(resource => ({
  //       name: resource,
  //       type: "bar",
  //       stack: "total",
  //       large: true,               // optimización
  //       progressive: 500,          // render en batches
  //       progressiveThreshold: 3000,
  //       data: sortedServices.map(({ service }) => dataMap.get(service)?.get(resource) || 0),
  //     }));

  //     const option: echarts.EChartsOption = {
  //       title: {
  //         text: `Top ${topLimit === "all" ? "" : topLimit} ${tipoCosto === "costo_neto" ? "Costo Neto" : "Costo Bruto"} por Servicio (USD)`,
  //         left: "center",
  //       },
  //       tooltip: {
  //         trigger: "axis",
  //         axisPointer: { type: "shadow" },
  //         formatter: (params: unknown) => {
  //           const visibleItems = params.filter((item: unknown) => Number(item.value) > 0);
  //           const total = visibleItems.reduce((sum: number, item: unknown) => sum + item.value, 0);

  //           const tooltipItems = visibleItems.map(
  //             (item: unknown) => `${item.marker} ${item.seriesName}: $${item.value.toPrecision(2)}`
  //           );

  //           return `<strong>${params[0].axisValue} - Total: $${total.toFixed(2)}</strong><br/>${
  //             tooltipItems.length ? tooltipItems.join("<br/>") : "<em>Sin recursos significativos</em>"
  //           }`;
  //         },
  //       },
  //       legend: {
  //         type: "scroll",
  //         bottom: 0,
  //         left: "center",
  //         data: topResources, // 👈 solo Top recursos
  //       },
  //       grid: { left: 200, right: 50, top: 100, bottom: 100 },
  //       xAxis: { type: "value", name: "USD" },
  //       yAxis: {
  //         type: "category",
  //         data: sortedServices.map(s => s.service),
  //         name: "Servicio",
  //         inverse: true,
  //         axisLabel: {
  //           formatter: (value: string) => {
  //             const total = serviceTotals[value] || 0;
  //             return `${value} ($${total.toFixed(2)})`;
  //           },
  //         },
  //       },
  //       series: seriesData,
  //     };

  //     chart.setOption(option);

  //     chart.on("click", function (params: unknown) {
  //       const service = params.name;
  //       if (service) setSelectedResource(service);
  //     });
  //   } else {
  //     // === VISTA DETALLE por RECURSOS ===
  //     const serviceData = topDolaresResource.filter((item: unknown) => item.service_dimension === selectedResource);
  //     const resourceTotals: Record<string, number> = {};

  //     serviceData.forEach(item => {
  //       const resource = item.dimension;
  //       const cost = toNumber(item[tipoCosto]);
  //       resourceTotals[resource] = (resourceTotals[resource] || 0) + cost;
  //     });

  //     const sortedResources = Object.entries(resourceTotals)
  //       .map(([resource, total]) => ({ resource, total }))
  //       .filter(r => r.total > 0)
  //       .sort((a, b) => b.total - a.total);

  //     const option: echarts.EChartsOption = {
  //       title: { text: `Detalle de Costos por Recurso - ${selectedResource}`, left: "center" },
  //       tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
  //       grid: { left: 150, right: 50, top: 60, bottom: 40 },
  //       xAxis: { type: "value", name: "USD" },
  //       yAxis: { type: "category", data: sortedResources.map(r => r.resource), inverse: true },
  //       series: [{
  //         type: "bar",
  //         large: true,
  //         progressive: 500,
  //         progressiveThreshold: 3000,
  //         data: sortedResources.map(r => r.total)
  //       }],
  //     };

  //     chart.setOption(option);
  //   }

  //   const resizeObserver = new ResizeObserver(() => chart.resize());
  //   resizeObserver.observe(chartRef.current);

  //   return () => {
  //     resizeObserver.disconnect();
  //     chart.dispose();
  //   };
  // }, [topDolaresResource, tipoCosto, topLimit, selectedResource]);

  useEffect(() => {
    if (!Array.isArray(topDolaresResource) || !topDolaresResource.length || !chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chartInstance.current = chart;

    if (selectedResource === null) {
      // === VISTA PRINCIPAL por SERVICIO ===
      const filteredData = topDolaresResource.filter(item => toNumber(item[tipoCosto]) > 0);
      if (!filteredData.length) return;

      // === 1) calcular totales globales por recurso ===
      const resourceTotalsGlobal: Record<string, number> = {};
      filteredData.forEach((item: unknown) => {
        const resource = item.dimension;
        const cost = toNumber(item[tipoCosto]);
        resourceTotalsGlobal[resource] = (resourceTotalsGlobal[resource] || 0) + cost;
      });

      // === 2) elegir Top N recursos ===
      const MAX_RESOURCES = 15; // 🔧 cámbialo según lo que quieras mostrar
      const sortedResourcesGlobal = Object.entries(resourceTotalsGlobal)
        .map(([resource, total]) => ({ resource, total }))
        .sort((a, b) => b.total - a.total);

      const topResources = sortedResourcesGlobal.slice(0, MAX_RESOURCES).map(r => r.resource);
      const otherResources = sortedResourcesGlobal.slice(MAX_RESOURCES).map(r => r.resource);

      // === 3) armar estructuras de servicio/recurso ===
      const dataMap = new Map<string, Map<string, number>>();
      const serviceTotals: Record<string, number> = {};

      filteredData.forEach((item: unknown) => {
        const service = item.service_dimension;
        const resource = topResources.includes(item.dimension) ? item.dimension : "Otros";
        const cost = toNumber(item[tipoCosto]);

        serviceTotals[service] = (serviceTotals[service] || 0) + cost;

        if (!dataMap.has(service)) dataMap.set(service, new Map());
        const resourceMap = dataMap.get(service)!;
        resourceMap.set(resource, (resourceMap.get(resource) || 0) + cost);
      });

      // === 4) ordenar servicios por costo total ===
      let sortedServices = Object.entries(serviceTotals)
        .map(([service, total]) => ({ service, total }))
        .sort((a, b) => b.total - a.total);

      if (topLimit !== "all") {
        sortedServices = sortedServices.slice(0, topLimit);
      }

      // === 5) armar series con Top N recursos + "Otros" ===
      const resources = [...topResources, ...(otherResources.length ? ["Otros"] : [])];

      const seriesData = resources.map(resource => ({
        name: resource,
        type: "bar",
        stack: "total",
        data: sortedServices.map(({ service }) => dataMap.get(service)?.get(resource) || 0),
      }));

      const option: echarts.EChartsOption = {
        title: {
          text: `Top ${topLimit === "all" ? "" : topLimit} ${tipoCosto === "costo_neto" ? "Costo Neto" : "Costo Bruto"} por Servicio (USD)`,
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: (params: unknown) => {
            const visibleItems = params.filter((item: unknown) => Number(item.value) > 0);
            const total = visibleItems.reduce((sum: number, item: unknown) => sum + item.value, 0);

            const tooltipItems = visibleItems.map(
              (item: unknown) => `${item.marker} ${item.seriesName}: $${item.value.toPrecision(2)}`
            );

            return `<strong>${params[0].axisValue} - Total: $${total.toFixed(2)}</strong><br/>${
              tooltipItems.length ? tooltipItems.join("<br/>") : "<em>Sin recursos significativos</em>"
            }`;
          },
        },
        legend: {
          type: "scroll",
          bottom: 0,
          left: "center",
          data: resources,
        },
        grid: { left: 200, right: 50, top: 100, bottom: 100 },
        xAxis: { type: "value", name: "USD" },
        yAxis: {
          type: "category",
          data: sortedServices.map(s => s.service),
          name: "Servicio",
          inverse: true,
          axisLabel: {
            formatter: (value: string) => {
              const total = serviceTotals[value] || 0;
              return `${value} ($${total.toFixed(2)})`;
            },
          },
        },
        series: seriesData,
      };

      chart.setOption(option);

      chart.on("click", function (params: unknown) {
        const service = params.name;
        if (service) setSelectedResource(service);
      });
    } else {
      // === VISTA DETALLE por RECURSOS ===
      const serviceData = topDolaresResource.filter((item: unknown) => item.service_dimension === selectedResource);
      const resourceTotals: Record<string, number> = {};

      serviceData.forEach(item => {
        const resource = item.dimension;
        const cost = toNumber(item[tipoCosto]);
        resourceTotals[resource] = (resourceTotals[resource] || 0) + cost;
      });

      const sortedResources = Object.entries(resourceTotals)
        .map(([resource, total]) => ({ resource, total }))
        .filter(r => r.total > 0)
        .sort((a, b) => b.total - a.total);

      const option: echarts.EChartsOption = {
        title: { text: `Detalle de Costos por Recurso - ${selectedResource}`, left: "center" },
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        grid: { left: 150, right: 50, top: 60, bottom: 40 },
        xAxis: { type: "value", name: "USD" },
        yAxis: { type: "category", data: sortedResources.map(r => r.resource), inverse: true },
        series: [{ type: "bar", data: sortedResources.map(r => r.total), large: true }],
      };

      chart.setOption(option);
    }

    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, [topDolaresResource, tipoCosto, topLimit, selectedResource]);

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
            {selectedResource && (
              <Button
                onClick={() => setSelectedResource(null)}
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
