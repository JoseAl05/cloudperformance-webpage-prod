'use client'

import useSWR from 'swr'
import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { Card, CardContent } from '@/components/ui/card'
import { BarChart3, Clock, Moon } from 'lucide-react'
import { TableEC2AutoScalingMetrics } from "@/components/aws/vista-funciones/consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil/table/tableComponent"

const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())

interface ConsumoEC2HorarioProps {
  startDate: Date,
  endDate: Date,
  metric?: string
  autoScalingGroup?: string
}

const metricUnits: Record<string, string> = {
  "CPUUtilization Average": "%",
  "CPUUtilization Maximum": "%",
  "CPUUtilization Minimum": "%",
  "CPUCreditBalance Average": "Unidades",
  "CPUCreditBalance Maximum": "Unidades",
  "CPUCreditBalance Minimum": "Unidades",
  "CPUCreditUsage Average": "Unidades",
  "CPUCreditUsage Maximum": "Unidades",
  "CPUCreditUsage Minimum": "Unidades",
  "NetworkIn Average": "Bytes",
  "NetworkIn Maximum": "Bytes",
  "NetworkIn Minimum": "Bytes",
  "NetworkOut Average": "Bytes",
  "NetworkOut Maximum": "Bytes",
  "NetworkOut Minimum": "Bytes",
}

export const MainViewConsumoEC2AutoscalingGroupsHorario = ({ startDate, endDate, metric, autoScalingGroup }: ConsumoEC2HorarioProps) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : ''
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/aws/ec2/business-vs-offhours/autoscaling?date_from=${startDateFormatted}&date_to=${endDateFormatted}&metric_label=${metric}&autoscaling_group=${autoScalingGroup}`,
    fetcher
  )

  useEffect(() => {
    if (!chartRef.current || !data) return;

    const times = data.data.map((item: unknown) => {
      const d = new Date(item.Timestamp);
      return `${d.getUTCDate()}/${d.getUTCMonth() + 1} ${d.getUTCHours()}:00`;
    });

    const valoresHabil = data.data.map((item: unknown) =>
      item.Horario === "Habil" ? item.Value : null
    );
    const valoresNoHabil = data.data.map((item: unknown) =>
      item.Horario === "No habil" ? item.Value : null
    );

    const options: echarts.EChartsOption = {
      tooltip: { trigger: "axis" },
      legend: { data: ["Horario Hábil", "Horario No Hábil"], top: 10, left: "center" },
      grid: { left: 50, right: 30, top: 60, bottom: 80, containLabel: true },
      xAxis: { type: "category", data: times, axisLabel: { rotate: 45 } },
      yAxis: { type: "value", name: metricUnits[metric || ""] || "", min: 0 },
      dataZoom: [
        { type: "slider", start: 80, end: 100 },
        { type: "inside", start: 80, end: 100 },
      ],
      series: [
        {
          name: "Horario Hábil",
          type: "line",
          smooth: true,
          data: valoresHabil,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: { color: "#3b82f6" },
          itemStyle: { color: "#3b82f6" },
        },
        {
          name: "Horario No Hábil",
          type: "line",
          smooth: true,
          data: valoresNoHabil,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: { color: "#1e40af" },
          itemStyle: { color: "#1e40af" },
        },
      ],
    };

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }
    chartInstance.current.setOption(options);

    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [data]);

  if (isLoading) return <p>Cargando datos...</p>
  if (error) return <p>Error al cargar datos</p>

  // 🔑 Definir unidad dinámica según la métrica
  const unit = metricUnits[metric || ""] || ""

  return (
    <div className="space-y-6 p-4">
            {/* Tarjetas de estadísticas promedio */}
              {/* 📊 Tarjetas de estadísticas promedio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Horario Hábil */}
          {data?.avgStatistics && (
            <Card className="border-l-4 border-l-blue-500 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Uso Horario Hábil
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {data.avgStatistics.find((s: unknown) => s.Horario === "Habil")?.average?.toFixed(2) ?? "--"} {unit}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Promedio de consumo en horas hábiles
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Horario No Hábil */}
          {data?.avgStatistics && (
            <Card className="border-l-4 border-l-red-500 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Uso Horario No Hábil
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {data.avgStatistics.find((s: unknown) => s.Horario === "No habil")?.average?.toFixed(2) ?? "--"} {unit}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Promedio de consumo en horas no hábiles
                    </p>
                  </div>
                  <Moon className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

      {/* 📊 Gráfico */}
      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">
              Evolución de {metric || 'Métrica'}
            </h2>
            <BarChart3 className="h-6 w-6 text-blue-500" />
          </div>
          <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>
        </CardContent>
      </Card>

      {/* === Tabla === */}
      <div>
        <TableEC2AutoScalingMetrics
          startDateFormatted={startDateFormatted}
          endDateFormatted={endDateFormatted}
          metric={metric}
          autoScalingGroup={autoScalingGroup}
        />
      </div>
    </div>
  )
}
