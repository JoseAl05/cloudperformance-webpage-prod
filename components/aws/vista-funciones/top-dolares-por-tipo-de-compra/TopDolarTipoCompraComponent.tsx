'use client'
import useSWR from 'swr'
import React, { useEffect, useRef, useState } from "react"
import * as echarts from "echarts"
import { TableComponentTop } from "@/components/aws/vista-funciones/top-dolares-por-tipo-de-compra/table/TopTableComponent"
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

interface TopDolaresPurchaseTypeProps {
  startDate: Date,
  endDate: Date
}

export const MainViewTopDolaresTipoCompra = ({ startDate, endDate }: TopDolaresPurchaseTypeProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);
  const [selectedPurchaseType, setSelectedPurchaseType] = useState<string | null>(null);
  const [tipoCosto, setTipoCosto] = useState<"costo_neto" | "costo_bruto">("costo_neto");
  const [topLimit, setTopLimit] = useState<number | "all">(10);

  const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '2025-08-31T00:00:00';
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '2025-09-01T00:00:00';

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/top_facturacion/PURCHASE_TYPE?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher
  )

  const topDolaresPurchaseType = Array.isArray(data) ? data : (data?.data ?? [])

  const toNumber = (v: any) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  // === Agrupación por tipo de compra (para KPIs y totales) ===
  const costoKey = tipoCosto;
  const purchaseMap = new Map<string, number>();

  for (const row of topDolaresPurchaseType) {
    const purchase = row.dimension ?? "N/D";
    const val = toNumber(row[costoKey]);
    purchaseMap.set(purchase, (purchaseMap.get(purchase) ?? 0) + val);
  }

  const aggregatedPurchases = Array.from(purchaseMap, ([purchase, value]) => ({ purchase, value }));
  const totalCosto = aggregatedPurchases.reduce((sum, r) => sum + r.value, 0);

  const purchaseMax = aggregatedPurchases.reduce(
    (max, r) => (r.value > max.value ? r : max),
    { purchase: null, value: -Infinity }
  );

  const purchaseMin = aggregatedPurchases.reduce(
    (min, r) => (r.value > 0 && r.value < min.value ? r : min),
    { purchase: null, value: Infinity }
  );

  const handleTopLimitChange = (value: string) => {
    setTopLimit(value === "all" ? "all" : Number(value));
  };

  // === Gráfico ===
  useEffect(() => {
    if (!Array.isArray(topDolaresPurchaseType) || !topDolaresPurchaseType.length || !chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chartInstance.current = chart;

    if (selectedPurchaseType === null) {
      // === Vista PRINCIPAL por Tipo de Compra ===
      const filteredData = topDolaresPurchaseType.filter(item => toNumber(item[tipoCosto]) > 0);
      if (!filteredData.length) return;

      const services = Array.from(new Set(filteredData.map(item => item.service_dimension)));

      const dataMap = new Map<string, Map<string, number>>();
      const purchaseTotals: Record<string, number> = {};

      filteredData.forEach((item: any) => {
        const purchase = item.dimension;
        const service = item.service_dimension;
        const cost = toNumber(item[tipoCosto]);

        purchaseTotals[purchase] = (purchaseTotals[purchase] || 0) + cost;

        if (!dataMap.has(purchase)) dataMap.set(purchase, new Map());
        const serviceMap = dataMap.get(purchase)!;
        serviceMap.set(service, (serviceMap.get(service) || 0) + cost);
      });

      let sortedPurchases = Object.entries(purchaseTotals)
        .map(([purchase, total]) => ({ purchase, total }))
        .sort((a, b) => b.total - a.total);

      if (topLimit !== "all") {
        sortedPurchases = sortedPurchases.slice(0, topLimit);
      }

      const seriesData = services.map(service => ({
        name: service,
        type: 'bar',
        stack: 'total',
        data: sortedPurchases.map(({ purchase }) => dataMap.get(purchase)?.get(service) || 0),
      }));

      const option: echarts.EChartsOption = {
        title: {
          text: `Top ${topLimit === "all" ? "" : topLimit} ${tipoCosto === 'costo_neto' ? 'Costo Neto' : 'Costo Bruto'} por Tipo de Compra (USD)`,
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params: any) => {
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
        dataZoom: [
          { type: 'slider', yAxisIndex: 0, filterMode: 'weakFilter', width: 15, right: 10, start: 0, end: 100, handleSize: '80%', showDataShadow: false, labelFormatter: '' },
          { type: 'inside', yAxisIndex: 0, filterMode: 'weakFilter', start: 0, end: 100 }
        ],
        toolbox: { feature: { saveAsImage: {} } },
        xAxis: { type: 'value', name: 'USD' },
        yAxis: {
          type: 'category',
          data: sortedPurchases.map(r => r.purchase),
          name: 'Tipos de Compra',
          inverse: true,
          axisLabel: {
            formatter: (value: string) => {
              const total = purchaseTotals[value] || 0;
              return `${value} ($${total.toFixed(2)})`;
            },
          },
        },
        series: seriesData,
      };

      chart.setOption(option);

      chart.on('click', function (params: any) {
        const purchase = params.name;
        if (purchase) setSelectedPurchaseType(purchase);
      });
    } else {
      // === Vista DETALLE por SERVICIOS ===
      const purchaseData = topDolaresPurchaseType.filter((item: any) => item.dimension === selectedPurchaseType);
      const serviceTotals: Record<string, number> = {};

      purchaseData.forEach(item => {
        const service = item.service_dimension;
        const cost = toNumber(item[tipoCosto]);
        serviceTotals[service] = (serviceTotals[service] || 0) + cost;
      });

      const sortedServices = Object.entries(serviceTotals)
        .map(([service, total]) => ({ service, total }))
        .filter(s => s.total > 0)
        .sort((a, b) => b.total - a.total);

      const option: echarts.EChartsOption = {
        title: { text: `Detalle de Costos por Servicio - ${selectedPurchaseType}`, left: 'center' },
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
  }, [topDolaresPurchaseType, tipoCosto, topLimit, selectedPurchaseType]);

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
                  🛒 Facturación por Tipo de Compra
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Análisis de costos totales agrupados por tipo de compra
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
            {selectedPurchaseType && (
              <Button
                onClick={() => setSelectedPurchaseType(null)}
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

          {purchaseMax.purchase && (
            <Card className="border-l-4 border-l-red-500 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Tipo de Compra con mayor costo de facturación
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {purchaseMax.purchase}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${purchaseMax.value.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          )}

          {purchaseMin.purchase && (
            <Card className="border-l-4 border-l-green-500 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Tipo de Compra con menor costo de facturación
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {purchaseMin.purchase}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${purchaseMin.value.toFixed(2)}
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
