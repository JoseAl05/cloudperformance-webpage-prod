'use client'

import useSWR from 'swr'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { BarChart3, Moon, Clock } from 'lucide-react'
import { TableEC2AutoScalingMetrics } from "@/components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil/table/tableComponent"
import { bytesToMB } from '@/lib/bytesToMbs'
import { ConsumoHorarioChartComponent } from '../grafico/ConsumoHorarioChartComponent'

const fetcher = (url: string) =>
  fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    .then(r => r.json());

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
  "CPUCreditBalance Average": "Créditos",
  "CPUCreditBalance Maximum": "Créditos",
  "CPUCreditBalance Minimum": "Créditos",
  "CPUCreditUsage Average": "Créditos",
  "CPUCreditUsage Maximum": "Créditos",
  "CPUCreditUsage Minimum": "Créditos",
  "NetworkIn Average": "MBs",
  "NetworkIn Maximum": "MBs",
  "NetworkIn Minimum": "MBs",
  "NetworkOut Average": "MBs",
  "NetworkOut Maximum": "MBs",
  "NetworkOut Minimum": "MBs",
}

export const MainViewConsumoEC2AutoscalingGroupsHorario = ({ startDate, endDate, metric, autoScalingGroup }: ConsumoEC2HorarioProps) => {


  const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : ''
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''
  let avgDataHabil: unknown = 0
  let avgDataNoHabil: unknown = 0

  const { data, error, isLoading } = useSWR(
    `/api/aws/bridge/aws/ec2/business-vs-offhours/autoscaling?date_from=${startDateFormatted}&date_to=${endDateFormatted}&metric_label=${metric}&autoscaling_group=${autoScalingGroup || "all"}`,
    fetcher
  )

  // Promedios formateados
  const avgStatisticsFormatted = data && data.avgStatistics ? (data.avgStatistics as unknown[]).map((item: unknown) => {
    if (metric?.includes('NetworkIn') || metric?.includes('NetworkOut')) {
      return {
        ...item,
        average: Number(bytesToMB(Number(item.average ?? 0)))
      }
    }
    return item
  }) : []

  if (metric?.includes('NetworkIn') || metric?.includes('NetworkOut')) {
    avgDataHabil = avgStatisticsFormatted.find((s: unknown) => s.Horario === "Habil")?.average ?? "--"
    avgDataNoHabil = avgStatisticsFormatted.find((s: unknown) => s.Horario === "No habil")?.average ?? "--"
  } else {
    avgDataHabil = avgStatisticsFormatted.find((s: unknown) => s.Horario === "Habil")?.average?.toFixed?.(2) ?? "--"
    avgDataNoHabil = avgStatisticsFormatted.find((s: unknown) => s.Horario === "No habil")?.average?.toFixed?.(2) ?? "--"
  }

  if (isLoading) return <p>Cargando datos...</p>
  if (error) return <p>Error al cargar datos</p>

  const unit = metricUnits[metric || ""] || ""

  return (
    <div className="space-y-6 p-4">
      {/* Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {avgStatisticsFormatted && (
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
        {avgStatisticsFormatted && (
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

      {/* Gráfico */}
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

      {/* Tabla */}
      <div>
        <TableEC2AutoScalingMetrics
          startDateFormatted={startDateFormatted}
          endDateFormatted={endDateFormatted}
          metric={metric}
          autoScalingGroup={autoScalingGroup || "all"}
        />
      </div>
    </div>
  )
}
