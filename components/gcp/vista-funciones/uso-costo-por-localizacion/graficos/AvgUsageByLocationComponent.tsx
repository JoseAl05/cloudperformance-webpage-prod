'use client'

import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Info, PowerOff } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ================= TIPOS ================= */

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
  isLoading: boolean
  error: unknown
}

/* ================= HELPERS ================= */

const byAlpha = (a: string, b: string) =>
  a.localeCompare(b, 'es', { sensitivity: 'base' })

const formatMetricName = (name: string) =>
  name.replaceAll('_', ' ').replace(/\b\w/g, l => l.toUpperCase())

const METRIC_UNITS: Record<string, string> = {
  cpu_utilization: '%',
  disk_read_iops: 'IOPS',
  disk_write_iops: 'IOPS',
  disk_read_throughput: 'MB/s',
  disk_write_throughput: 'MB/s',
  network_egress_pps: 'packets/s',
  network_ingress_pps: 'packets/s',
  network_egress_throughput: 'MB/s',
  network_ingress_throughput: 'MB/s',
  uptime_sec: 'seg',
}

const formatValue = (metric: string, value: number) => {
  if (value === null || value === undefined || Number.isNaN(value)) return 'N/A'
  const unit = METRIC_UNITS[metric]
  return unit ? `${value.toFixed(2)} ${unit}` : value.toFixed(2)
}

const isUnused = (v?: number) => typeof v === 'number' && v === 0

/* ================= CELDA CON DIALOG ================= */

const MetricCellDialog = ({
  region,
  metric,
  datum,
}: {
  region: string
  metric: string
  datum: MetricaPromedio
}) => {
  const unused = isUnused(datum?.promedio)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            'group relative min-w-[13rem] flex-1 p-3 text-center border-r cursor-pointer',
            'transition-all hover:bg-primary/5 hover:shadow-sm hover:-translate-y-[1px]',
            unused && 'bg-amber-200/60 dark:bg-amber-900/10'
          )}
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="font-semibold text-sm">
              {formatValue(metric, datum.promedio)}
            </div>
            <Info className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
          </div>

          <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
            <Badge variant="outline">{datum.muestras} muestras</Badge>
          </div>

          {unused && (
            <Badge className="mt-1 text-[9px] bg-amber-100 text-amber-800">
              <PowerOff className="h-3 w-3 mr-1" /> Sin uso
            </Badge>
          )}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {region} — {formatMetricName(metric)}
          </DialogTitle>
          <DialogDescription>
            Detalle estadístico de la métrica
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Promedio</span>
            <span className="font-medium">{formatValue(metric, datum.promedio)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mínimo</span>
            <span>{formatValue(metric, datum.minimo)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Máximo</span>
            <span>{formatValue(metric, datum.maximo)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Muestras</span>
            <span>{datum.muestras}</span>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button>Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ================= TABLA PRINCIPAL ================= */

export const AvgUsageByLocationComponent = ({ data, isLoading, error }: Props) => {
  const metrics = useMemo(() => {
    const set = new Set<string>()
    data?.forEach(r =>
      Object.keys(r.metricas_promedio || {}).forEach(m => set.add(m))
    )
    return Array.from(set).sort(byAlpha)
  }, [data])

  if (isLoading) return <div className="p-10 text-center">Cargando métricas...</div>
  if (error) return <div className="p-10 text-red-500">Error al cargar datos</div>
  if (!data?.length) return <div className="p-10 text-center text-gray-500">Sin datos</div>

  return (
    <div className="rounded-lg border border-border">
      <div className="p-5 border-b space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Métricas por Región
        </h2>

        <p className="text-sm text-muted-foreground">
          Promedios por métrica y región en el rango seleccionado.
        </p>

        <Badge
          variant="secondary"
          className={cn(
            'mt-1 flex flex-col items-center gap-1.5 font-semibold text-sm whitespace-normal',
            'bg-amber-100 text-amber-800 border-amber-200/70',
            'dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
            'lg:inline-flex lg:flex-row'
          )}
        >
          <PowerOff className="h-3.5 w-3.5" />
          Indica métrica sin uso / recursos sin uso / recursos apagados
        </Badge>

        <p className="text-md text-muted-foreground font-semibold pt-2">
          Haz clic en el botón{" "}
          <Info className="inline h-3.5 w-3.5 align-text-bottom" /> para ver el detalle.
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex bg-muted/40 border-y">
            <div className="w-44 shrink-0 p-3 font-medium border-r bg-muted">
              Región
            </div>

            {metrics.map(m => (
              <div
                key={m}
                className="min-w-[13rem] flex-1 p-3 font-medium border-r bg-muted text-center text-xs"
              >
                {formatMetricName(m)}
              </div>
            ))}
          </div>

          {data.map(region => (
            <div key={region.region} className="flex border-b hover:bg-muted/20">
              <div className="w-44 shrink-0 p-3 border-r bg-muted/10 font-medium">
                {region.region}
              </div>

              {metrics.map(metric => {
                const datum = region.metricas_promedio?.[metric]

                if (!datum) {
                  return (
                    <div
                      key={metric}
                      className="min-w-[13rem] flex-1 p-3 text-center border-r text-muted-foreground"
                    >
                      N/A
                    </div>
                  )
                }

                return (
                  <MetricCellDialog
                    key={metric}
                    region={region.region}
                    metric={metric}
                    datum={datum}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}