'use client'

import useSWR from 'swr'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { BarChart3, Clock, Moon } from 'lucide-react'
import { TableRdsMariaDbMetrics } from "@/components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-rds-mariadb-horario-habil-vs-no-habil/table/tableComponent"
import { bytesToMB } from '@/lib/bytesToMbs'
import { ConsumoHorarioChartComponent } from '../grafico/ConsumoHorarioChartComponent'

const fetcher = (url: string) =>
  fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    .then(r => r.json());

interface ConsumoRdsMariaDbHorarioProps {
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

export const MainViewConsumoRdsMariaDbHorario = ({ startDate, endDate, metric, instance }: ConsumoRdsMariaDbHorarioProps) => {

  const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : ''
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''
  let avgDataHabil: unknown = 0;
  let avgDataNoHabil: unknown = 0;

  const { data, error, isLoading } = useSWR(
    `/api/aws/bridge/aws/rds/mariadb/business-vs-offhours?date_from=${startDateFormatted}&date_to=${endDateFormatted}&metric_label=${metric}&resource=${instance || "all"}`,
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
          <ConsumoHorarioChartComponent
            data={data}
            metric={metric ? metric : ''}
            metricUnits={metricUnits}
          />
        </CardContent>
      </Card>

      <div>
        <TableRdsMariaDbMetrics
          startDateFormatted={startDateFormatted}
          endDateFormatted={endDateFormatted}
          metric={metric}
          instance={instance || "all"}
        />
      </div>
    </div>
  )
}
