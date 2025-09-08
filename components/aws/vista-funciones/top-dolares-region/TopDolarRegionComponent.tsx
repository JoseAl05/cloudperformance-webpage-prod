'use client'
import useSWR from 'swr'
import React, { useEffect, useRef, useState, useMemo } from "react"
import * as echarts from "echarts"
import { TableComponentTop } from "@/components/aws/vista-funciones/tables/TopTableComponent"
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card'
import { LoaderComponent } from '@/components/general/LoaderComponent'


const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())

interface TopDolaresRegionComponentProps {
  startDate: Date,
  endDate: Date
}

export const TopDolarRegionComponent = ({ startDate, endDate }: TopDolaresRegionComponentProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [tipoCosto, setTipoCosto] = useState<"costo_neto" | "costo_bruto">("costo_neto");
  const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '2025-08-31T00:00:00';
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '2025-09-01T00:00:00';
  const { data: topDolaresRegion = [], error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/facturacion/top_facturacion/REGION?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher
  )
  const [topLimit, setTopLimit] = useState<number>(10);
  const totalCosto = useMemo(() => {
    if (!Array.isArray(topDolaresRegion)) return 0;
    return topDolaresRegion.reduce((sum, item: unknown) =>
      sum + parseFloat(item[tipoCosto] || 0), 0
    );
  }, [topDolaresRegion, tipoCosto]);
  const handleTopLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTopLimit(Number(e.target.value));
  };

  useEffect(() => {
      if (!Array.isArray(topDolaresRegion) || !topDolaresRegion.length || !chartRef.current) return;

      const chart = echarts.init(chartRef.current);
      chartInstance.current = chart;

      if (selectedRegion === null) {
        const filteredData = topDolaresRegion.filter(item => parseFloat(item[tipoCosto]) > 0);
        if (!filteredData.length) return;

        const services = Array.from(new Set(filteredData.map(item => item.service_dimension)));

        const dataMap = new Map<string, Map<string, number>>();
        const regionTotals: Record<string, number> = {};

        filteredData.forEach((item: unknown) => {
          const region = item.dimension;
          const service = item.service_dimension;
          const cost = parseFloat(item[tipoCosto]) || 0;

          regionTotals[region] = (regionTotals[region] || 0) + cost;

          if (!dataMap.has(region)) dataMap.set(region, new Map());
          const serviceMap = dataMap.get(region)!;
          serviceMap.set(service, (serviceMap.get(service) || 0) + cost);
        });

        const sortedRegions = Object.entries(regionTotals)
          .map(([region, total]) => ({ region, total }))
          .sort((a, b) => b.total - a.total)
          .slice(0, topLimit);

        const seriesData = services.map(service => ({
          name: service,
          type: 'bar',
          stack: 'total',
          data: sortedRegions.map(({ region }) => dataMap.get(region)?.get(service) || 0),
        }));

        const option: echarts.EChartsOption = {
          title: {
            text: `Top ${topLimit} ${tipoCosto === 'costo_neto' ? 'Costo Neto' : 'Costo Bruto'} por Región (USD)`,
            left: 'center',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: (params: unknown) => {
              const visibleItems = params.filter((item: unknown) => item.value.toFixed(2) !== '0.00');
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
          grid: {
            left: 200,
            right: 50,
            top: 100,
            bottom: 100,
          },
          toolbox: { feature: { saveAsImage: {} } },
          xAxis: { type: 'value', name: 'USD' },
          yAxis: {
            type: 'category',
            data: sortedRegions.map(r => r.region),
            name: 'Regiones',
            inverse: true,
            axisLabel: {
              formatter: (value: string) => {
                const total = regionTotals[value] || 0;
                return `${value} ($${total.toFixed(2)})`;
              },
            },
          },
          series: seriesData,
        };

        chart.setOption(option);

        chart.on('click', function (params: unknown) {
          const region = params.name;
          if (region) setSelectedRegion(region);
        });
      } else {
        const regionData = topDolaresRegion.filter((item: unknown) => item.dimension === selectedRegion);
        const serviceTotals: Record<string, number> = {};

        regionData.forEach(item => {
          const service = item.service_dimension;
          const cost = parseFloat(item[tipoCosto]) || 0;
          serviceTotals[service] = (serviceTotals[service] || 0) + cost;
        });

        const sortedServices = Object.entries(serviceTotals)
          .map(([service, total]) => ({ service, total }))
          .sort((a, b) => b.total - a.total);

        const option: echarts.EChartsOption = {
          title: {
            text: `Detalle de Costos por Servicio - ${selectedRegion}`,
            left: 'center',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: (params: unknown) => {
              const total = params.reduce((sum: number, item: unknown) => sum + item.value, 0);
              const tooltipItems = params.map(
                (item: unknown) => `${item.marker} ${item.name}: $${item.value.toFixed(2)}`
              );
              return `<strong>Total: $${total.toFixed(2)}</strong><br/>${tooltipItems.join('<br/>')}`;
            },
          },
          grid: { left: 150, right: 50, top: 60, bottom: 40 },
          xAxis: { type: 'value', name: 'USD' },
          yAxis: {
            type: 'category',
            data: sortedServices.map(s => s.service),
            name: 'Servicios',
            inverse: true,
          },
          series: [
            {
              type: 'bar',
              data: sortedServices.map(s => s.total),
              label: {
                show: true,
                position: 'right',
                formatter: (val: unknown) => `$${val.value.toPrecision(2)}`,
              },
            },
          ],
        };

        chart.setOption(option);
      }

      const resizeObserver = new ResizeObserver(() => {
        chart.resize();
      });
      resizeObserver.observe(chartRef.current);

      return () => {
        resizeObserver.disconnect();
        chart.dispose();
      };
    }, [topDolaresRegion, tipoCosto, topLimit, selectedRegion]);


  if (isLoading) return <LoaderComponent />
  if (error) return <p>Error cargando los datos.</p>

return (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="border-l-4 border-l-blue-500 shadow-lg rounded-2xl transition-all duration-300 ease-in-out hover:shadow-xl">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">Tipo de Costo</p>
          <select
            value={tipoCosto}
            onChange={(e) => setTipoCosto(e.target.value as "costo_neto" | "costo_bruto")}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out hover:bg-blue-50"
          >
            <option value="costo_neto">Costo Neto</option>
            <option value="costo_bruto">Costo Bruto</option>
          </select>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-green-500 shadow-lg rounded-2xl transition-all duration-300 ease-in-out hover:shadow-xl">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">Mostrar Top</p>
          <select
            value={topLimit}
            onChange={handleTopLimitChange}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ease-in-out hover:bg-green-50"
          >
            <option value="3">Top 3</option>
            <option value="5">Top 5</option>
            <option value="10">Top 10</option>
            <option value={topDolaresRegion.length}>Ver todo</option>
          </select>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-indigo-500 shadow-lg rounded-2xl transition-all duration-300 ease-in-out hover:shadow-xl">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {tipoCosto === "costo_neto" ? "Costo Neto Total (USD)" : "Costo Bruto Total (USD)"}
          </p>
          <p className="text-3xl font-bold text-indigo-600">
            ${totalCosto.toLocaleString("es-CL", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground">Total acumulado</p>
        </CardContent>
      </Card>
    </div>
    <Card className="shadow-lg rounded-2xl transition-all duration-300 ease-in-out hover:shadow-xl">
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent className="h-[600px]">
        <div>
      {selectedRegion && (
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setSelectedRegion(null)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            ← Volver a Regiones
          </button>
        </div>
      )}
      <div ref={chartRef} className="w-full h-[600px]" />
      </div>
      </CardContent>
    </Card>
    <Card className="shadow-lg rounded-2xl transition-all duration-300 ease-in-out hover:shadow-xl">
      <CardHeader>
        <CardTitle>Detalle de Facturación</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[460px] overflow-y-auto">
          <TableComponentTop
            startDateFormatted={startDateFormatted}
            endDateFormatted={endDateFormatted}
          />
        </div>
      </CardContent>
    </Card>
  </div>
)


}