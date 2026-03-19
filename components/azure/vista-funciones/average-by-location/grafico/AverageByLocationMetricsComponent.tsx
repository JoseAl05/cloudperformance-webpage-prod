'use client';

import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Info, PowerOff } from 'lucide-react';
import { AverageByLocationData } from '@/interfaces/vista-promedio-por-localizacion/avgByLocationInterfaces';
import { bytesToGB } from '@/lib/bytesToMbs';
import { cn } from '@/lib/utils';

type Props = {
  data: AverageByLocationData[];
};

const byAlpha = (a: string, b: string) => a.localeCompare(b, 'es', { sensitivity: 'base' });

const formatBytes = (v: number) => {
  if (!isFinite(v)) return 'N/A';
  if (v >= 1e12) return `${(v / 1e12).toFixed(2)} TB`;
  if (v >= 1e9) return `${(v / 1e9).toFixed(2)} GB`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(2)} MB`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(2)} KB`;
  return `${v.toFixed(2)} B`;
};

const formatMetricValue = (metric: string, value: number) => {
  if (value === null || value === undefined || Number.isNaN(value)) return 'N/A';

  const m = metric.toLowerCase();
  if (m.includes('percentage') || m.includes('%')) return `${value.toFixed(2)}%`;
  if (m.includes('available memory') || m.includes('memory bytes') || m.includes('bytes')) return formatBytes(value);
  if (m.includes('iops')) return `${value.toFixed(2)} IOPS`;
  if (m.includes('credits')) return `${(+value).toFixed(4).replace(/\.?0+$/, '')} créditos`;
  if (m.includes('capacity')) return `${bytesToGB(value)} GB`;
  return value.toFixed(2);
};

const isUnused = (v: unknown) => typeof v === 'number' && v === 0;

const MetricCellDialog = ({
  region,
  metric,
  datum,
}: {
  region: string;
  metric: string;
  datum: AverageByLocationData['averages'][number];
}) => {
  const used = isUnused(datum?.avg_value);
  const resources = datum?.resources ?? [];
  const resourceCount = datum?.resource_count ?? 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            'group relative min-w-[13rem] flex-1 p-3 text-center border-r cursor-pointer',
            'transition-all duration-150 ease-out',
            'hover:bg-primary/5 hover:shadow-sm hover:-translate-y-[1px] hover:ring-2 hover:ring-primary/20',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2',
            'active:translate-y-0',
            used && 'bg-amber-200/60 dark:bg-amber-900/10'
          )}
          aria-label={`Ver detalle de ${metric} en ${region}`}
          title="Click para ver detalle"
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="font-semibold text-sm">
              {formatMetricValue(metric, datum.avg_value)}
            </div>
            <span
              className={cn(
                'inline-flex h-6 w-6 items-center justify-center rounded-md border',
                'text-muted-foreground',
                'border-transparent bg-transparent group-hover:bg-primary/10 group-hover:text-primary'
              )}
            >
              <Info className="h-4 w-4" />
            </span>
          </div>

          <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
            <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
              {datum.count} muestras
            </Badge>
            <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
              {resourceCount === 1 ? '1 recurso' : `${resourceCount} recursos`}
            </Badge>
          </div>
          {used && (
            <Badge
              variant="secondary"
              className={cn(
                'mt-1 h-5 px-1.5 text-[7px] inline-flex items-center gap-1.5',
                'bg-amber-100 text-amber-800 border-amber-200/70',
                'dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800'
              )}
            >
              <PowerOff className="h-3.5 w-3.5" />
            </Badge>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">
            {region} — {metric}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Promedio y detalle de la métrica en el rango seleccionado.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Promedio</span>
            <span className="font-medium">{formatMetricValue(metric, datum.avg_value)}</span>
          </div>

          {/* --- NUEVO: max y min observados --- */}
          {(datum.max_value != null || datum.min_value != null) && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Máx observado</span>
              <span className="font-medium text-red-500">{datum.max_value != null ? formatMetricValue(metric, datum.max_value) : '—'}</span>
            </div>
          )}
          {(datum.max_value != null || datum.min_value != null) && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Mín observado</span>
              <span className="font-medium text-yellow-500">{datum.min_value != null ? formatMetricValue(metric, datum.min_value) : '—'}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Muestras</span>
            <span className="text-right">{datum.count}</span>

            <span className="text-muted-foreground">{resourceCount === 1 ? 'Recurso' : 'Recursos'}</span>
            <span className="text-right">{resourceCount}</span>

            <span className="text-muted-foreground">Desde</span>
            <span className="text-right">
              {datum.first_ts ? new Date(datum.first_ts).toLocaleString() : '—'}
            </span>

            <span className="text-muted-foreground">Hasta</span>
            <span className="text-right">
              {datum.last_ts ? new Date(datum.last_ts).toLocaleString() : '—'}
            </span>
          </div>
          {isUnused(datum.avg_value) && (
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
              métrica sin uso / recursos sin uso / recursos apagados
            </Badge>
          )}
          {resources.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Recursos</div>
              <ScrollArea className="h-28 rounded-md border p-2">
                <div className="flex flex-wrap gap-1">
                  {resources.map((r, i) => (
                    <Badge key={r + i} variant="secondary" className="text-[10px]">
                      {r}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="default" type="button" className='cursor-pointer'>Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const AverageByLocationMetricsComponent = ({ data }: Props) => {
  const metrics = useMemo(() => {
    const set = new Set<string>();
    for (const row of data ?? []) {
      for (const a of row.averages ?? []) {
        if (a?.metric_name) set.add(a.metric_name);
      }
    }
    return Array.from(set).sort(byAlpha);
  }, [data]);

  const table = useMemo(() => {
    const map = new Map<string, Map<string, AverageByLocationData['averages'][number]>>([]);
    for (const row of data ?? []) {
      const region = row.location;
      if (!region) continue;
      if (!map.has(region)) map.set(region, new Map());
      const inner = map.get(region)!;
      for (const a of row.averages ?? []) {
        if (!a?.metric_name) continue;
        inner.set(a.metric_name, a);
      }
    }
    return map;
  }, [data]);

  const regions = useMemo(() => Array.from(table.keys()).sort(byAlpha), [table]);

  if (!data?.length || !metrics.length) {
    return (
      <div className="rounded-md border p-8">
        <div className="text-center space-y-1">
          <div className="text-lg text-muted-foreground">No hay datos disponibles</div>
          <div className="text-xs text-muted-foreground">Ajusta filtros de fecha, región o servicio</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border p-5">
      <div className="p-5 border-b">
        <h2 className="text-xl font-semibold tracking-tight">Métricas por Región</h2>
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
        <p className="text-md text-muted-foreground font-semibold pt-5">
          Haz clic en el botón <Info className="inline h-3.5 w-3.5 align-text-bottom" /> para ver el detalle.
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex bg-muted/40 border-y">
            <div className="w-44 shrink-0 p-3 font-medium border-r bg-muted text-foreground">Región</div>
            {metrics.map((m) => (
              <div
                key={m}
                className="min-w-[13rem] flex-1 p-3 font-medium border-r bg-muted text-foreground text-center"
              >
                <div className="text-xs leading-tight">{m}</div>
              </div>
            ))}
          </div>

          {regions.map((region) => {
            const values = table.get(region)!;
            return (
              <div key={region} className="flex border-b hover:bg-muted/20 transition-colors">
                <div className="w-44 shrink-0 p-3 border-r bg-muted/10 flex items-center justify-between">
                  <span className="text-sm font-medium">{region}</span>
                </div>

                {metrics.map((m) => {
                  const a = values.get(m);

                  if (!a) {
                    return (
                      <div
                        key={`${region}-${m}`}
                        className="min-w-[13rem] flex-1 p-3 text-center border-r"
                      >
                        <span className="text-muted-foreground text-sm">N/A</span>
                      </div>
                    );
                  }

                  return (
                    <MetricCellDialog
                      key={`${region}-${m}`}
                      region={region}
                      metric={m}
                      datum={a}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};