'use client'
import useSWR from 'swr'
import React, { useEffect, useRef } from "react"
import * as echarts from "echarts"
import { Ec2TableComponent } from "@/components/aws/vista-saving-plan/tables/Ec2TableComponent"
import { LambdaTableComponent } from "@/components/aws/vista-saving-plan/tables/LambdaTableComponent"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, TrendingDown, TrendingUp, Activity, DollarSign, Clock, Calendar, Server, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";


const fetcher = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      "Content-Type": "application/json"
    }
  }).then(res => res.json())

interface SavingPlansComponentProps {
  startDate: Date,
  endDate: Date
}

export const SavingPlansViewComponent = ({ startDate, endDate }: SavingPlansComponentProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const lineChartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const lineChartInstance = useRef<echarts.ECharts | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const lineResizeObserverRef = useRef<ResizeObserver | null>(null);
  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';
  const selectedArn = 'arn:aws:savingsplans::413591708008:savingsplan/e7ebd204-b438-4d74-969a-2a4be4e86a8a';

  const { data: stats } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/saving-plans/vista-saving-plans/dashboard-stats?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher
  )

  const { data: costUsage, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/saving-plans/saving-plan-cost-usage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&savings_plan_arn=${selectedArn}`,
    fetcher
  )

  const { data: spcost } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/saving-plans/savings-plan-cost?date_from=${startDateFormatted}&date_to=${endDateFormatted}&savings_plan_arn=${selectedArn}`,
    fetcher
  )

  const { data: ec2Intances } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/saving-plans/ec2-instances-prices/?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher
  )

  const { data: lambdaFunctions } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/saving-plans/lambda-functions-prices/?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher
  )

  // Datos en duro para tarjetas nuevas
  const estadoPlan = "Excesivo"

  // Formato moneda
  const formatUSD = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)


  // ==== Gráfico de barras ====
  useEffect(() => {
    if (!costUsage || costUsage.length === 0 || !chartRef.current) {
      console.log("⛔ No hay datos o chartRef vacío", { costUsage });
      return;
    }

    // --- Preparar datos ---
    const aggregated = costUsage.reduce((acc: unknown, item: unknown) => {
      const service = item.dimensions?.SERVICE || "Otro";
      const amortized = Number(item.amortizedcost) || 0;
      const unblended = Number(item.unblendedcost) || 0;

      if (!acc[service]) {
        acc[service] = { service, amortizedcost: 0, unblendedcost: 0 };
      }
      acc[service].amortizedcost += amortized;
      acc[service].unblendedcost += unblended;

      return acc;
    }, {});

    const chartData = Object.values(aggregated);

    // --- Destruir instancia previa si existe ---
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    // --- Crear nueva instancia ---
    const chart = echarts.init(chartRef.current);
    chartInstance.current = chart;

    const optionsCostMetrics: echarts.EChartsOption = {
      dataZoom: [{ type: "slider", start: 0, end: 100 }],
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params: unknown) => {
          const tooltipItems = params.map((item: unknown) => `${item.marker} ${item.seriesName}: ${formatUSD(item.value)}`);
          return `<strong>${params[0].name}</strong><br/>${tooltipItems.join("<br/>")}`;
        },
      },
      legend: { data: ["Facturado sin el plan", "Facturado con el plan"], top: 10, left: "center" },
      grid: { left: 50, right: 30, top: 60, bottom: 60, containLabel: true },
      toolbox: { feature: { saveAsImage: {} } },
      xAxis: {
        type: "category",
        data: chartData.map((d: unknown) => d.service),
        axisLabel: {
          interval: 0,
          rotate: 0,
          formatter: (value: string) => {
            const words = value.split(" ");
            const result: string[] = [];
            for (let i = 0; i < words.length; i += 2) result.push(words.slice(i, i + 2).join(" "));
            return result.join("\n");
          },
        },
      },
      yAxis: { type: "value", axisLabel: { formatter: (val: number) => formatUSD(val) } },
      series: [
        {
          name: "Facturado sin el plan",
          type: "bar",
          data: chartData.map((d: unknown) => d.amortizedcost),
          itemStyle: { color: "#4ade80" },
          label: { show: true, position: "top", formatter: (val: unknown) => formatUSD(val.value) },
        },
        {
          name: "Facturado con el plan",
          type: "bar",
          data: chartData.map((d: unknown) => d.unblendedcost),
          itemStyle: { color: "#60a5fa" },
          label: { show: true, position: "top", formatter: (val: unknown) => formatUSD(val.value) },
        },
      ],
      animation: true,
    };

    chart.setOption(optionsCostMetrics);
    chart.resize();

    // --- ResizeObserver ---
    if (chartRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => chart.resize());
      resizeObserverRef.current.observe(chartRef.current);
    }

    // --- Cleanup ---
    return () => {
      if (resizeObserverRef.current && chartRef.current) {
        resizeObserverRef.current.unobserve(chartRef.current);
        resizeObserverRef.current.disconnect();
      }
      chart.dispose();
    };
  }, [costUsage]);

  // ==== Gráfico de líneas ====
  useEffect(() => {
    if (!costUsage || costUsage.length === 0 || !lineChartRef.current) return;

    const filteredData = costUsage.filter(item => {
      const date = new Date(item.sync_time.$date);
      return (!startDate || date >= startDate) && (!endDate || date <= endDate);
    });

    const days = Array.from(new Set(filteredData.map(item => new Date(item.sync_time.$date).toISOString().split('T')[0])))
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const services = Array.from(new Set(filteredData.map(item => item.dimensions?.SERVICE || 'Otro')));

    const seriesData = services.map(service => ({
      name: service,
      type: 'line',
      smooth: true,
      data: days.map(day => {
        const match = filteredData.filter(item => {
          const date = new Date(item.sync_time.$date).toISOString().split('T')[0];
          return date === day && (item.dimensions?.SERVICE || 'Otro') === service;
        });
        return match.reduce((sum, m) => sum + parseFloat(m.amortizedcost || 0), 0);
      }),
      label: { show: false, position: 'top', formatter: (val: unknown) => val.value > 0 ? formatUSD(val.value) : "" },
    }));

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        formatter: (params: unknown) => {
          const tooltipItems = params.map((item: unknown) => `${item.marker} ${item.seriesName}: ${formatUSD(item.value)}`);
          return `<strong>${params[0].axisValue}</strong><br/>${tooltipItems.join("<br/>")}`;
        },
      },
      legend: { top: 0, data: services },
      xAxis: { type: 'category', data: days, axisLabel: { rotate: 45 } },
      yAxis: { type: 'value', axisLabel: { formatter: (val: number) => formatUSD(val) } },
      dataZoom: [{ type: "slider", start: 0, end: 100 }],
      series: seriesData,
    };

    const chart = echarts.init(lineChartRef.current);
    lineChartInstance.current = chart;
    chart.setOption(option);
    chart.resize();

    if (lineChartRef.current) {
      lineResizeObserverRef.current = new ResizeObserver(() => chart.resize());
      lineResizeObserverRef.current.observe(lineChartRef.current);
    }

    return () => {
      if (lineResizeObserverRef.current && lineChartRef.current) {
        lineResizeObserverRef.current.unobserve(lineChartRef.current);
        lineResizeObserverRef.current.disconnect();
      }
      chart.dispose();
    };
  }, [costUsage, startDate, endDate]);

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Error cargando los datos.</p>



  return (
    <div className="grid grid-cols-12 gap-6 p-4">
      {/* ===== Fila 1: Planes ===== */}
      <div className="col-span-2">
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Planes Retirados</p>
                <p className="text-2xl font-bold text-orange-600">{stats?.planes_retirados ?? 0}</p>
                <p className="text-xs text-muted-foreground">Planes desactivados</p>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-2">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Planes Registrados</p>
                <p className="text-2xl font-bold text-blue-600">{stats?.planes_registrados ?? 0}</p>
                <p className="text-xs text-muted-foreground">Total registrados</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-2">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Planes Activos</p>
                <p className="text-2xl font-bold text-green-600">{stats?.planes_activos ?? 0}</p>
                <p className="text-xs text-muted-foreground">Actualmente en uso</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-6">
        <Dialog>
          <DialogTrigger asChild>
            <Card className="border-l-4 border-l-yellow-500 cursor-pointer hover:shadow-lg transition w-full h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Estado Saving Plan</p>
                    <p className="text-2xl font-bold text-yellow-600">{estadoPlan}</p>
                    <p className="text-xs text-muted-foreground">Estado actual del plan</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalle del Estado del Saving Plan</DialogTitle>
              <DialogDescription>
                Aquí se mostrará la diferencia y recomendaciones de optimización.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <p><strong>Compromiso actual:</strong> {formatUSD(spcost?.commitment_hourly ?? 0)}/hora</p>
              <p><strong>Costo mensual estimado:</strong> {formatUSD(spcost?.costo_mensual ?? 0)}</p>
              <p><strong>Costo diario promedio:</strong> {formatUSD(spcost?.costo_diario ?? 0)}</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ===== Fila 2: Diferencia Saving Plan =====
      <div className="col-span-3">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Diferencia Saving Plan</p>
                <p className="text-2xl font-bold text-red-600">{formatUSD(diferencia)}</p>
                <p className="text-xs text-muted-foreground">Diferencia vs compromiso</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* ===== Fila 3: Gráfico + Métricas al lado ===== */}
      <div className="col-span-8 space-y-6">
        <Card className="shadow-lg h-full">
          <CardHeader>
            <CardTitle>Consumo Acumulado por Servicio</CardTitle>
          </CardHeader>
          <CardContent className="h-[450px]"> {/* le das alto al contenido */}
            <div ref={chartRef} className="w-full h-full" /> {/* ocupa todo el card */}
          </CardContent>
        </Card>
      </div>

      <div className="col-span-4 space-y-6">
        {/* Compromiso */}
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compromiso</p>
                <p className="text-2xl font-bold text-purple-600">{formatUSD(spcost?.commitment_hourly ?? 0)}/hora</p>
                <p className="text-xs text-muted-foreground">Compromiso por hora</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        {/* Costo Diario */}
        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Costo Diario</p>
                <p className="text-2xl font-bold text-indigo-600">{formatUSD(spcost?.costo_diario)}</p>
                <p className="text-xs text-muted-foreground">Promedio por día</p>
              </div>
              <Calendar className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        {/* Costo Mensual */}
        <Card className="border-l-4 border-l-teal-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Costo Mensual</p>
                <p className="text-2xl font-bold text-teal-600">{formatUSD(spcost?.costo_mensual)}</p>
                <p className="text-xs text-muted-foreground">Estimado mensual</p>
              </div>
              <DollarSign className="h-8 w-8 text-teal-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card con gráfico de líneas */}
      <div className="col-span-12 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Consumo Diario por Servicio</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <div ref={lineChartRef} className="w-full h-full" />
          </CardContent>
        </Card>
      </div>

      <div className="col-span-12 grid grid-cols-12 gap-6">
        {/* Tabla EC2 */}
        <div className="col-span-9">
          <Card className="shadow-lg h-full">
            <CardHeader>
              <CardTitle>Detalle instancias EC2</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[460px] overflow-y-auto">
                <Ec2TableComponent startDateFormatted={startDateFormatted} endDateFormatted={endDateFormatted} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenedor de tarjetas */}
        <div className="col-span-3 flex flex-col gap-6">
          <Card className="border-l-4 border-l-cyan-500 flex-1">
            <CardContent className="p-3 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cantidad Instancias EC2</p>
                  <p className="text-2xl font-bold text-cyan-600">{ec2Intances?.total_unique_instances ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Instancias registradas</p>
                </div>
                <Server className="h-8 w-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-cyan-500 flex-1">
            <CardContent className="p-3 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total precio Instancias EC2</p>
                  <p className="text-2xl font-bold text-cyan-600">{formatUSD(ec2Intances?.total_price_usd ?? 0)}/hora</p>
                  <p className="text-xs text-muted-foreground">Instancias registradas</p>
                </div>
                <Server className="h-8 w-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lambda */}
      <div className="col-span-12 grid grid-cols-12 gap-6">
        <div className="col-span-9">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Detalle Lambda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[460px] overflow-y-auto">
                <LambdaTableComponent startDateFormatted={startDateFormatted} endDateFormatted={endDateFormatted} />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-3">
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cantidad Funciones Lambda</p>
                  <p className="text-2xl font-bold text-emerald-600">{lambdaFunctions?.total_unique_functions ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Funciones registradas</p>
                </div>
                <Zap className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}