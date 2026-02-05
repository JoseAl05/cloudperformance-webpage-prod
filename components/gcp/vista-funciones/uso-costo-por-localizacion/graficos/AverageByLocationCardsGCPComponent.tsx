'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Boxes, CalendarClock, ChartBar, MapPin } from 'lucide-react'

interface MetricaPromedio {
  promedio: number
  minimo: number
  maximo: number
  muestras: number
}

interface RegionMetricas {
  region: string
  total_recursos: number
  total_muestras: number
  metricas_promedio: Record<string, MetricaPromedio>
}

interface Props {
  data: RegionMetricas[]
}

export const AverageByLocationCardsGCPComponent = ({ data }: Props) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Promedios por localización</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          No hay datos para mostrar.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Información General por Región
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div
          className={cn(
            'grid gap-3',
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          )}
        >
          {data.map(region => {
            const metricsCount = Object.keys(region.metricas_promedio || {}).length

            return (
              <div
                key={region.region}
                className={cn(
                  'flex flex-col justify-between rounded-md border p-4',
                  'bg-slate-100/40 dark:bg-slate-900/40'
                )}
              >
                {/* Región */}
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-lg font-semibold">{region.region}</span>
                </div>

                {/* Recursos */}
                <div className="flex items-center gap-2 text-sm">
                  <Boxes className="h-4 w-4 text-blue-500" />
                  <span>Total recursos analizados</span>
                </div>
                <div className="text-center border rounded-md py-2 text-lg font-bold mb-3">
                  {region.total_recursos}
                </div>

                {/* Métricas */}
                <div className="flex items-center gap-2 text-sm">
                  <ChartBar className="h-4 w-4 text-blue-500" />
                  <span>Métricas analizadas</span>
                </div>
                <div className="text-center border rounded-md py-2 text-lg font-bold mb-3">
                  {metricsCount}
                </div>

                {/* Muestras */}
                <div className="flex items-center gap-2 text-sm">
                  <CalendarClock className="h-4 w-4 text-blue-500" />
                  <span>Total muestras recolectadas</span>
                </div>
                <div className="text-center border rounded-md py-2 text-lg font-bold">
                  {region.total_muestras.toLocaleString('es-CL')}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}