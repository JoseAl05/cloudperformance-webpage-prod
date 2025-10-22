'use client'

import useSWR from 'swr'
import React, { act } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Database, Package, HardDrive, TrendingUp, TrendingDown, TrendingUpDown, CalendarClock, CalendarFold, CalendarDays, CalendarRange } from 'lucide-react'
import { MetricPoint, ResourceMetrics } from '@/interfaces/vista-variacion-tendencia-uso-de-recursos/variacionTendenciaUsoDeRecursosViewInterface'
import { TrendLineChart } from './grafico/TrendLineChart'
import { DualSeriesChart } from './grafico/TrendLineChartv2'
import { bytesToGB } from '@/lib/bytesToMbs'
import { VariacionTendenciaUsoDeRecursosCardsComponent } from './info/VariacionTendenciaUsoDeRecursosCardsComponent'

const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json())


interface VariacionTendenciaUsoDeRecursosProps {
  startDate: Date
  endDate: Date
  region?: string
  variationService?: string
  variationMetric?: string
  variationResource?: string
  year: number
  month: number
}

export const VariacionTendenciaUsoDeRecursosComponent = ({
  startDate,
  endDate,
  region,
  variationService,
  variationMetric,
  variationResource,
  year,
  month,
}: VariacionTendenciaUsoDeRecursosProps) => {

  const { data: dataInfo, error: errorInfo, isLoading: isLoadingInfo } = useSWR<ResourceMetrics>(
    variationResource ? `/api/aws/bridge/recursos/variation_resources_v2/${variationResource}?year=${year}&month=${month}&region=${region}&service=${variationService}&metric=${variationMetric}` : null,
    fetcher
  )
  if (!variationMetric || !month || !year) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center text-gray-500 text-lg font-medium">Debe seleccionar recurso y aplicar filtros.</div>
      </div>
    )
  }

  if (isLoadingInfo) return <p>Cargando...</p>
  if (errorInfo) return <p>Error cargando datos</p>

  const actual_range = dataInfo?.actual_range
  const prev_range = dataInfo?.prev_range
  const metric = dataInfo?.metric
  const variation_percent = dataInfo?.variation_percent
  const formattedActualRange = actual_range.metrics.map(m => {
    if (dataInfo.metric.includes('NetworkIn') || dataInfo.metric.includes('NetworkOut')) {
      return {
        ...m,
        metric_value: bytesToGB(m.metric_value)
      }
    }
    return m
  });
  const formattedPrevRange = prev_range.metrics.map(m => {
    if (dataInfo.metric.includes('NetworkIn') || dataInfo.metric.includes('NetworkOut')) {
      return {
        ...m,
        metric_value: bytesToGB(m.metric_value)
      }
    }
    return m
  });
  const safeDataActualRange: MetricPoint[] = actual_range ? formattedActualRange: [];
  const safeDataPrevRange: MetricPoint[] = prev_range ? formattedPrevRange : [];

  const unit = metric?.includes('CPUCredit') ? 'créditos' :
    metric?.includes('CPUUtilization') ? '%' :
      metric?.includes('Network') ? 'GB' :
        metric?.includes('Bytes') ? 'Bytes' :
          metric?.includes('NumberOfObjects') ? 'Objetos' :
            metric?.includes('BurstBalance') ? '%' :
              metric?.includes('Time') ? 'segundos' :
                metric?.includes('VolumeQueueLength') ? 'Ops E/S' :
                  metric?.includes('VolumeReadOps') ? 'Ops E/S' :
                    metric?.includes('VolumeWriteOps') ? 'Ops E/S' :
                      metric?.includes('DatabaseConnections') ? 'Conexiones' :
                        metric?.includes('FreeStorageSpace') ? 'Bytes' :
                          metric?.includes('ReadIOPS') ? 'IOPS' :
                            metric?.includes('WriteIOPS') ? 'IOPS' :
                              ''

  const chartTitle = metric?.split(" ")[0].replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");

  const chartyAxisLabel = metric?.includes('Minimum') ? 'Minimo' :
    metric?.includes('Maximum') ? 'Maximo' :
      metric?.includes('Average') ? 'Promedio' :
        metric?.split("\n+")[1]

  return (
    <div className="space-y-8 p-4">
      <VariacionTendenciaUsoDeRecursosCardsComponent
        prev_range={prev_range}
        unit={unit}
        chartyAxisLabel={chartyAxisLabel}
        metric={metric}
        actual_range={actual_range}
        variation_percent={variation_percent}
      />
      <div className="grid grid-cols-1 gap-6">
        <DualSeriesChart
          currentPeriodData={safeDataActualRange}
          previousPeriodData={safeDataPrevRange}
          currentPeriodLabel={actual_range?.month + " " + actual_range?.year}
          previousPeriodLabel={prev_range?.month + " " + prev_range?.year}
          title={chartTitle}
          yAxisLabel={chartyAxisLabel}
          unit={unit}
        />
      </div>

    </div>
  )
}
