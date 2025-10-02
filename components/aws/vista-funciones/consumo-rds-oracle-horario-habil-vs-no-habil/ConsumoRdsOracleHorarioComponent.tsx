'use client'

import useSWR from 'swr'
import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { Card, CardContent } from '@/components/ui/card'
import { BarChart3, Clock, Moon } from 'lucide-react'
import { TableRdsOracleMetrics } from "@/components/aws/vista-funciones/consumo-rds-oracle-horario-habil-vs-no-habil/table/tableComponent"
import { bytesToMB } from '@/lib/bytesToMbs'

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

interface ConsumoRdsOracleHorarioProps {
  startDate: Date,
  endDate: Date,
  metric?: string,
  instance?: string
}

const metricUnits: Record<string, string> = {
    "CPUUtilization Average": "%",
    "CPUUtilization Maximum": "%",
    "CPUUtilization Minimum": "%",
    "CPUCreditBalance Average": "Creditos",
    "CPUCreditBalance Maximum": "Creditos",
    "CPUCreditBalance Minimum": "Creditos",
    "CPUCreditUsage Average": "Creditos",
    "CPUCreditUsage Maximum": "Creditos",
    "CPUCreditUsage Minimum": "Creditos",
    "FreeableMemory Average": "MBs",
    "FreeableMemory Maximum": "MBs",
    "FreeableMemory Minimum": "MBs",
    "FreeStorageSpace Average": "MBs",
    "FreeStorageSpace Maximum": "MBs",
    "FreeStorageSpace Minimum": "MBs",
    "DatabaseConnections Average": "Cantidad",
    "DatabaseConnections Maximum": "Cantidad",
    "DatabaseConnections Minimum": "Cantidad",
    "ReadIOPS Average": "IOPS",
    "ReadIOPS Maximum": "IOPS",
    "ReadIOPS Minimum": "IOPS",
    "WriteIOPS Average": "IOPS",
    "WriteIOPS Maximum": "IOPS",
    "WriteIOPS Minimum": "IOPS"
}

export const MainViewConsumoRdsOracleHorario = ({ startDate, endDate, metric, instance }: ConsumoRdsOracleHorarioProps) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : ''
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''
  let avgDataHabil: unknown = 0;
  let avgDataNoHabil: unknown = 0;

  const { data, error, isLoading } = useSWR(
    `/api/aws/bridge/aws/rds/oracle/business-vs-offhours?date_from=${startDateFormatted}&date_to=${endDateFormatted}&metric_label=${metric}&resource=${instance || "all"}`,
    fetcher
  )
  
  const avgStatisticsFormatted = data && data.avgStatistics ? (data.avgStatistics as unknown[]).map((item: unknown) => {
    if (metric?.includes('FreeStorageSpace') || metric?.includes('FreeableMemory')) {
      return {
        ...item,
        average: Number(bytesToMB(Number(item.average ?? 0)))
      }
    }
    return item;
  }) : [];


  if (metric?.includes('FreeStorageSpace') || metric?.includes('FreeableMemory')) {
    avgDataHabil = avgStatisticsFormatted ? avgStatisticsFormatted.find((s: unknown) => s.Horario === "Habil")?.average ?? "--" : 0;
    avgDataNoHabil = avgStatisticsFormatted ? avgStatisticsFormatted.find((s: unknown) => s.Horario === "No habil")?.average ?? "--" : 0;
  } else {
    avgDataHabil = avgStatisticsFormatted ? avgStatisticsFormatted.find((s: unknown) => s.Horario === "Habil")?.average?.toFixed?.(2) ?? "--" : 0;
    avgDataNoHabil = avgStatisticsFormatted ? avgStatisticsFormatted.find((s: unknown) => s.Horario === "No habil")?.average?.toFixed?.(2) ?? "--" : 0;
  }

   useEffect(() => {
      if (!chartRef.current) return;
      if (!data || !Array.isArray(data.data) || data.data.length === 0) { 
        if (chartInstance.current) {
          chartInstance.current.clear()
        }
        return
      }
  
      
      const dataFormatted = (data.data as unknown[]).map((item: unknown) => {
        const rawVal = item.Value ?? item.value ?? 0
        let numericVal = Number(rawVal)

        if (item.MetricLabel && (item.MetricLabel.includes("FreeStorageSpace") || item.MetricLabel.includes("FreeableMemory"))) {

          numericVal = Number(bytesToMB(Number(rawVal)))
        }
  
        
        if (Number.isNaN(numericVal)) numericVal = null
  
        return {
          ...item,
          Value: numericVal
        }
      })
  
      
      const grouped: Record<string, { habil: number[]; noHabil: number[] }> = {}
  
      dataFormatted.forEach((item: unknown) => {
        if (!item.Timestamp) return
        const ts = new Date(item.Timestamp).toISOString()
        if (!grouped[ts]) grouped[ts] = { habil: [], noHabil: [] }
  
        const v = item.Value
        if (v === null || v === undefined) return
  
        if (item.Horario === "Habil") {
          grouped[ts].habil.push(Number(v))
        } else if (item.Horario === "No habil") {
          grouped[ts].noHabil.push(Number(v))
        } else {
          
        }
      })
  
      const times: string[] = []
      const valoresHabil: (number | null)[] = []
      const valoresNoHabil: (number | null)[] = []
  
      Object.keys(grouped)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .forEach((ts) => {
          const d = new Date(ts)
          times.push(`${d.getUTCDate()}/${d.getUTCMonth() + 1} ${d.getUTCHours()}:00`)
  
          const habilValues = grouped[ts].habil
          const noHabilValues = grouped[ts].noHabil
  
          const avgHabil = habilValues.length > 0
            ? Number((habilValues.reduce((acc, v) => acc + Number(v), 0) / habilValues.length).toFixed(2))
            : null
  
          const avgNoHabil = noHabilValues.length > 0
            ? Number((noHabilValues.reduce((acc, v) => acc + Number(v), 0) / noHabilValues.length).toFixed(2))
            : null
  
          valoresHabil.push(avgHabil)
          valoresNoHabil.push(avgNoHabil)
        })
  
      const options: echarts.EChartsOption = {
        tooltip: {
          trigger: "axis",
          valueFormatter: (value: unknown) => (value != null ? Number(value).toFixed(2) : "--")
        },
        legend: { data: ["Horario Hábil", "Horario No Hábil"], top: 10, left: "center" },
        grid: { left: 50, right: 30, top: 60, bottom: 80, containLabel: true },
        xAxis: { type: "category", data: times, axisLabel: { rotate: 45 } },
        yAxis: {
          type: "value",
          name: metricUnits[metric || ""] || "",
          min: 0,
          axisLabel: {
            formatter: (value: unknown) => Number(value).toFixed(2)
          }
        },
        dataZoom: [
          { type: "slider", start: 80, end: 100 },
          { type: "inside", start: 80, end: 100 }
        ],
        series: [
          {
            name: "Horario Hábil",
            type: "line",
            smooth: true,
            connectNulls: false,
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
            connectNulls: false,
            data: valoresNoHabil,
            symbol: "circle",
            symbolSize: 6,
            lineStyle: { color: "#1e40af" },
            itemStyle: { color: "#1e40af" },
          },
        ]
      }
  
      try {
        if (!chartInstance.current) {
          chartInstance.current = echarts.init(chartRef.current!)
        }
        chartInstance.current.setOption(options)
      } catch (err) {
        console.error('Error al inicializar ECharts:', err)
      }
  
      const handleResize = () => chartInstance.current?.resize()
      window.addEventListener("resize", handleResize)
      return () => {
        window.removeEventListener("resize", handleResize)
        chartInstance.current?.dispose()
        chartInstance.current = null
      }
    }, [data, metric])

  if (isLoading) return <p>Cargando datos...</p>
  if (error) return <p>Error al cargar datos</p>

  const unit = metricUnits[metric || ""] || ""

  return (
    <div className="space-y-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {data?.avgStatistics && (
            <Card className="border-l-4 border-l-blue-500 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Uso Horario Hábil
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {avgDataHabil} {unit}
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

          {data?.avgStatistics && (
            <Card className="border-l-4 border-l-red-500 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Uso Horario No Hábil
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {avgDataNoHabil} {unit}
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

      <div>
        <TableRdsOracleMetrics
          startDateFormatted={startDateFormatted}
          endDateFormatted={endDateFormatted}
          metric={metric}
          instance={instance || "all"}
        />
      </div>
    </div>
  )
}
