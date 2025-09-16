'use client'
import useSWR from 'swr'
import React, { useEffect, useRef, useState } from "react"
import * as echarts from "echarts"
import { TableComponentTop } from "@/components/aws/vista-funciones/top-dolares-por-famila-de-instancias/table/TopTableComponent"
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

interface TopDolaresInstanceTypeFamilyProps {
  startDate: Date,
  endDate: Date
}

export const MainViewTopDolaresFamilia = ({ startDate, endDate }: TopDolaresInstanceTypeFamilyProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [tipoCosto, setTipoCosto] = useState<"costo_neto" | "costo_bruto">("costo_neto");
  const [topLimit, setTopLimit] = useState<number | "all">(10);

  const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '2025-08-31T00:00:00';
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '2025-09-01T00:00:00';

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/top_facturacion/INSTANCE_TYPE_FAMILY?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher
  )

  const topDolaresFamily = Array.isArray(data) ? data : (data?.data ?? [])

  const toNumber = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  // === Agrupación por familia (para KPIs y totales) ===
  const costoKey = tipoCosto;
  const familyMap = new Map<string, number>();

  for (const row of topDolaresFamily) {
    const family = row.dimension ?? "N/D";
    const val = toNumber(row[costoKey]);
    familyMap.set(family, (familyMap.get(family) ?? 0) + val);
  }

  const aggregatedFamilies = Array.from(familyMap, ([family, value]) => ({ family, value }));
  const totalCosto = aggregatedFamilies.reduce((sum, r) => sum + r.value, 0);

  const familyMax = aggregatedFamilies.reduce(
    (max, r) => (r.value > max.value ? r : max),
    { family: null, value: -Infinity }
  );

  const familyMin = aggregatedFamilies.reduce(
    (min, r) => (r.value > 0 && r.value < min.value ? r : min),
    { family: null, value: Infinity }
  );

  const handleTopLimitChange = (value: string) => {
    setTopLimit(value === "all" ? "all" : Number(value));
  };

  // === Gráfico ===
  useEffect(() => {
    if (!Array.isArray(topDolaresFamily) || !topDolaresFamily.length || !chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chartInstance.current = chart;

    if (selectedFamily === null) {
      // === Vista PRINCIPAL por Familias ===
      const filteredData = topDolaresFamily.filter(item => toNumber(item[tipoCosto]) > 0);
      if (!filteredData.length) return;

      const services = Array.from(new Set(filteredData.map(item => item.service_dimension)));

      const dataMap = new Map<string, Map<string, number>>();
      const familyTotals: Record<string, number> = {};

      filteredData.forEach((item: unknown) => {
        const family = item.dimension;
        const service = item.service_dimension;
        const cost = toNumber(item[tipoCosto]);

        familyTotals[family] = (familyTotals[family] || 0) + cost;

        if (!dataMap.has(family)) dataMap.set(family, new Map());
        const serviceMap = dataMap.get(family)!;
        serviceMap.set(service, (serviceMap.get(service) || 0) + cost);
      });

      let sortedFamilies = Object.entries(familyTotals)
        .map(([family, total]) => ({ family, total }))
        .sort((a, b) => b.total - a.total);

      if (topLimit !== "all") {
        sortedFamilies = sortedFamilies.slice(0, topLimit);
      }

      const seriesData = services.map(service => ({
        name: service,
        type: 'bar',
        stack: 'total',
        data: sortedFamilies.map(({ family }) => dataMap.get(family)?.get(service) || 0),
      }));

      const option: echarts.EChartsOption = {
        title: {
          text: `Top ${topLimit === "all" ? "" : topLimit} ${tipoCosto === 'costo_neto' ? 'Costo Neto' : 'Costo Bruto'} por Familia de Instancia (USD)`,
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params: unknown) => {
            const visibleItems = params.filter((item: unknown) => Number(item.value) > 0);
            const total = visibleItems.reduce((sum: number, item: unknown) => sum + item.value, 0);

            const tooltipItems = visibleItems.map(
              (item: unknown) => `${item.marker} ${item.seriesName}: $${item.value.toFixed(2)}`
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
        dataZoom: [
          { type: 'slider', yAxisIndex: 0, filterMode: 'weakFilter', width: 15, right: 10, start: 0, end: 100, handleSize: '80%', showDataShadow: false, labelFormatter: '' },
          { type: 'inside', yAxisIndex: 0, filterMode: 'weakFilter', start: 0, end: 100 }
        ],
        toolbox: { feature: { saveAsImage: {} } },
        xAxis: { type: 'value', name: 'USD' },
        yAxis: {
          type: 'category',
          data: sortedFamilies.map(r => r.family),
          name: 'Familias',
          inverse: true,
          axisLabel: {
            formatter: (value: string) => {
              const total = familyTotals[value] || 0;
              return `${value} ($${total.toFixed(2)})`;
            },
          },
        },
        series: seriesData,
      };

      chart.setOption(option);

      chart.on('click', function (params: unknown) {
        const family = params.name;
        if (family) setSelectedFamily(family);
      });
    } else {
      // === Vista DETALLE por SERVICIOS ===
      const familyData = topDolaresFamily.filter((item: unknown) => item.dimension === selectedFamily);
      const serviceTotals: Record<string, number> = {};

      familyData.forEach(item => {
        const service = item.service_dimension;
        const cost = toNumber(item[tipoCosto]);
        serviceTotals[service] = (serviceTotals[service] || 0) + cost;
      });

      const sortedServices = Object.entries(serviceTotals)
        .map(([service, total]) => ({ service, total }))
        .filter(s => s.total > 0)
        .sort((a, b) => b.total - a.total);

      const option: echarts.EChartsOption = {
        title: { text: `Detalle de Costos por Servicio - ${selectedFamily}`, left: 'center' },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params: unknown) => {
            const visibleItems = params.filter((item: unknown) => Number(item.value) > 0);
            const total = visibleItems.reduce((sum: number, item: unknown) => sum + item.value, 0);

            const tooltipItems = visibleItems.map(
              (item: unknown) => `${item.marker} ${item.name}: $${item.value.toFixed(2)}`
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
  }, [topDolaresFamily, tipoCosto, topLimit, selectedFamily]);

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
                  💻 Facturación por Familia de Instancia
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Análisis de costos totales agrupados por familia de instancias
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
            {selectedFamily && (
              <Button
                onClick={() => setSelectedFamily(null)}
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

          {familyMax.family && (
            <Card className="border-l-4 border-l-red-500 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Familia de Instancia con mayor costo de facturación
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {familyMax.family}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${familyMax.value.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          )}

          {familyMin.family && (
            <Card className="border-l-4 border-l-green-500 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Familia de Instancia con menor costo de facturación
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {familyMin.family}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${familyMin.value.toFixed(2)}
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
