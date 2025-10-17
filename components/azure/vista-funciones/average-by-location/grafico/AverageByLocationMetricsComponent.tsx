// 'use client';

// import { useMemo } from 'react';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
//   DialogClose,
// } from '@/components/ui/dialog';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Info, PowerOff } from 'lucide-react';
// import { AverageByLocationData } from '@/interfaces/vista-promedio-por-localizacion/avgByLocationInterfaces';
// import { bytesToGB } from '@/lib/bytesToMbs';
// import { cn } from '@/lib/utils';

// type Props = {
//   data: AverageByLocationData[];
// };
// type Rule = {
//   match: (metric: string) => boolean;
//   normalize: (v: number) => number;
//   weight?: number;
// };
// type RegionStatus = {
//   score: number;
//   label: 'Infrautilizada' | 'Sobreutilizada' | 'Neutra';
//   color: 'green' | 'amber' | 'red';
//   reasons: string[];
// };

// const clamp = (v: number, a = 0, b = 100) => Math.max(a, Math.min(b, v));
// const nearZero = (v: number | null | undefined, eps = 1e-6) =>
//   v == null || Math.abs(v) <= eps;

// const METRIC_RULES: Rule[] = [
//   { match: m => /percentage cpu|cpu percent|%/i.test(m), normalize: v => clamp(v), weight: 1.0 },
//   { match: m => /memory percent/i.test(m), normalize: v => clamp(v), weight: 0.9 },
//   { match: m => /storage percent/i.test(m), normalize: v => clamp(v), weight: 0.8 },
//   { match: m => /availability/i.test(m), normalize: v => clamp(100 - v), weight: 0.7 },
//   { match: m => /cpu credits consumed/i.test(m), normalize: v => clamp(v * 10), weight: 0.7 },
//   {
//     match: m => /cpu credits remaining/i.test(m), normalize: v => {
//       const inv = v <= 1 ? 95 : v <= 5 ? 80 : v <= 10 ? 60 : v <= 20 ? 40 : 10;
//       return clamp(inv);
//     }, weight: 0.8
//   },
//   {
//     match: m => /iops/i.test(m), normalize: v => {
//       if (v <= 1) return 5;
//       if (v <= 5) return 25;
//       if (v <= 50) return 60;
//       if (v <= 200) return 80;
//       return 95;
//     }, weight: 0.7
//   },
//   {
//     match: m => /available memory|memory bytes/i.test(m), normalize: v => {
//       const gb = v / 1_073_741_824;
//       if (gb <= 0.25) return 95;
//       if (gb <= 1) return 70;
//       if (gb <= 4) return 40;
//       if (gb <= 8) return 20;
//       if (gb <= 16) return 10;
//       return 5;
//     }, weight: 0.6
//   },
//   {
//     match: m => /storage used|used capacity/i.test(m), normalize: v => {
//       const gb = v / 1_073_741_824;
//       if (gb <= 1) return 10;
//       if (gb <= 10) return 30;
//       if (gb <= 100) return 70;
//       if (gb <= 1024) return 90;
//       return 98;
//     }, weight: 0.6
//   },
//   {
//     match: m => /transactions/i.test(m), normalize: v => {
//       if (v <= 0.01) return 5;
//       if (v <= 1) return 20;
//       if (v <= 100) return 60;
//       return 85;
//     }, weight: 0.4
//   },
// ];

// const normalizeMetric = (metric: string, value: number, ctx?: {
//   activityLow?: boolean;
// }): number | null => {
//   if (typeof value !== "number" || Number.isNaN(value)) return null;
//   if (/percentage cpu|cpu percent/i.test(metric)) return clamp(value);
//   if (/memory percent/i.test(metric)) return clamp(value);
//   if (/storage percent/i.test(metric)) return clamp(value);
//   if (/availability/i.test(metric)) return clamp(100 - value);
//   if (/iops/i.test(metric)) {
//     if (value <= 1) return 5;
//     if (value <= 5) return 25;
//     if (value <= 50) return 60;
//     if (value <= 200) return 80;
//     return 95;
//   }
//   if (/cpu credits consumed/i.test(metric)) return clamp(value * 10);
//   if (/cpu credits remaining/i.test(metric)) {
//     if (ctx?.activityLow) return 5;
//     const inv = value <= 1 ? 95 : value <= 5 ? 80 : value <= 10 ? 60 : value <= 20 ? 40 : 10;
//     return clamp(inv);
//   }
//   if (/available memory|memory bytes/i.test(metric)) {
//     if (ctx?.activityLow && value === 0) return null;
//     const gb = value / 1_073_741_824;
//     if (gb <= 0.25) return 95;
//     if (gb <= 1) return 70;
//     if (gb <= 4) return 40;
//     if (gb <= 8) return 20;
//     if (gb <= 16) return 10;
//     return 5;
//   }
//   if (/storage used|used capacity/i.test(metric)) {
//     const gb = value / 1_073_741_824;
//     if (gb <= 1) return 10;
//     if (gb <= 10) return 30;
//     if (gb <= 100) return 70;
//     if (gb <= 1024) return 90;
//     return 98;
//   }

//   return null;
// }

// const evaluateRegion = (
//   values: Map<string, { avg_value: number; metric_name: string; count: number }>
// ): RegionStatus => {
//   const get = (re: RegExp) => {
//     for (const [k, v] of values.entries()) if (re.test(k)) return v;
//     return undefined;
//   };

//   const cpu = get(/percentage cpu|cpu percent/i)?.avg_value ?? null;
//   const iops = get(/iops/i)?.avg_value ?? null;
//   const tx = get(/transactions/i)?.avg_value ?? null;
//   const memPct = get(/memory percent/i)?.avg_value ?? null;
//   const storPct = get(/storage percent/i)?.avg_value ?? null;
//   const creditsRem = get(/cpu credits remaining/i)?.avg_value ?? null;
//   const creditsCons = get(/cpu credits consumed/i)?.avg_value ?? null;
//   const allZero = [...values.values()].every(v => nearZero(v.avg_value));
//   if (allZero) {
//     return {
//       score: 0,
//       label: "Infrautilizada",
//       color: "green",
//       reasons: ["Sin actividad en el rango (promedios = 0)"],
//     };
//   }
//   const activityLow =
//     (cpu != null && cpu < 5) &&
//     (iops == null || iops < 5) &&
//     (creditsCons == null || creditsCons < 0.01) &&
//     (tx == null || tx < 0.05);

//   const reasons: string[] = [];
//   const highCPU = cpu != null && cpu >= 85;
//   const highMem = memPct != null && memPct >= 90;
//   const highStor = storPct != null && storPct >= 90;
//   const highIOPS = iops != null && iops >= 200;
//   const riskyCredits =
//     creditsRem != null &&
//     creditsRem <= 5 &&
//     ((cpu != null && cpu > 20) || (creditsCons != null && creditsCons > 0.1));

//   if (highCPU) reasons.push("CPU ≥ 85%");
//   if (highIOPS) reasons.push("IOPS altos");
//   if (highMem) reasons.push("Memoria ≥ 90%");
//   if (highStor) reasons.push("Almacenamiento ≥ 90%");
//   if (riskyCredits) reasons.push("Créditos de CPU muy bajos con carga");
//   if (activityLow) reasons.push("Actividad muy baja (CPU/IOPS/Tx/Credits)");

//   const weights: Record<string, number> = {
//     "percentage cpu": 1.0,
//     "cpu percent": 1.0,
//     "memory percent": 0.9,
//     "storage percent": 0.8,
//     "iops": 0.7,
//     "availability": 0.6,
//     "cpu credits consumed": 0.6,
//     "cpu credits remaining": 0.6,
//     "available memory": 0.5,
//     "storage used": 0.6,
//     "used capacity": 0.6,
//     "transactions": 0.4,
//   };

//   let sum = 0,
//     wsum = 0;
//   for (const [metricName, a] of values.entries()) {
//     const n = normalizeMetric(metricName, a.avg_value, { activityLow });
//     if (n == null) continue;
//     const key = Object.keys(weights).find(k => new RegExp(k, "i").test(metricName));
//     const w = key ? weights[key] : 0.5;
//     sum += n * w;
//     wsum += w;
//   }

//   const score = wsum > 0 ? +(sum / wsum).toFixed(2) : 0;
//   if (highCPU || highIOPS || highMem || highStor || riskyCredits || score >= 75) {
//     return { score, label: "Sobreutilizada", color: "red", reasons };
//   }
//   if (activityLow || score <= 25) {
//     return { score, label: "Infrautilizada", color: "green", reasons };
//   }
//   return { score, label: "Neutra", color: "amber", reasons };
// }

// const byAlpha = (a: string, b: string) => a.localeCompare(b, 'es', { sensitivity: 'base' });

// const formatBytes = (v: number) => {
//   if (!isFinite(v)) return 'N/A';
//   if (v >= 1e12) return `${(v / 1e12).toFixed(2)} TB`;
//   if (v >= 1e9) return `${(v / 1e9).toFixed(2)} GB`;
//   if (v >= 1e6) return `${(v / 1e6).toFixed(2)} MB`;
//   if (v >= 1e3) return `${(v / 1e3).toFixed(2)} KB`;
//   return `${v.toFixed(2)} B`;
// };

// const formatMetricValue = (metric: string, value: number) => {
//   if (value === null || value === undefined || Number.isNaN(value)) return 'N/A';

//   const m = metric.toLowerCase();
//   if (m.includes('percentage') || m.includes('%') || m.includes('percent')) return `${value.toFixed(2)}%`;
//   if (m.includes('available memory') || m.includes('memory bytes') || m.includes('bytes')) return formatBytes(value);
//   if (m.includes('iops')) return `${value.toFixed(2)} IOPS`;
//   if (m.includes('credits')) return `${(+value).toFixed(4).replace(/\.?0+$/, '')} créditos`;
//   if (m.includes('capacity')) return `${bytesToGB(value)} GB`;
//   if (m.includes('storage used') || m.includes('backup storage used')) return `${bytesToGB(value)} GB`
//   return value.toFixed(2);
// };


// const isUnused = (v: unknown) => typeof v === 'number' && v === 0;

// const MetricCellDialog = ({
//   region,
//   metric,
//   datum,
// }: {
//   region: string;
//   metric: string;
//   datum: AverageByLocationData['averages'][number];
// }) => {
//   const used = isUnused(datum?.avg_value);
//   const resources = datum?.resources ?? [];
//   const resourceCount = datum?.resource_count ?? 0;

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <button
//           type="button"
//           className={cn(
//             'group relative min-w-[13rem] flex-1 p-3 text-center border-r cursor-pointer',
//             'transition-all duration-150 ease-out',
//             'hover:bg-primary/5 hover:shadow-sm hover:-translate-y-[1px] hover:ring-2 hover:ring-primary/20',
//             'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2',
//             'active:translate-y-0',
//             used && 'bg-amber-200/60 dark:bg-amber-900/10'
//           )}
//           aria-label={`Ver detalle de ${metric} en ${region}`}
//           title="Click para ver detalle"
//         >
//           <div className="flex items-center justify-center gap-1 mb-1">
//             <div className="font-semibold text-sm">
//               {formatMetricValue(metric, datum.avg_value)}
//             </div>
//             <span
//               className={cn(
//                 'inline-flex h-6 w-6 items-center justify-center rounded-md border',
//                 'text-muted-foreground',
//                 'border-transparent bg-transparent group-hover:bg-primary/10 group-hover:text-primary'
//               )}
//             >
//               <Info className="h-4 w-4" />
//             </span>
//           </div>

//           <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
//             <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
//               {datum.count} muestras
//             </Badge>
//             <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
//               {resourceCount === 1 ? '1 recurso' : `${resourceCount} recursos`}
//             </Badge>
//           </div>
//           {used && (
//             <Badge
//               variant="secondary"
//               className={cn(
//                 'mt-1 h-5 px-1.5 text-[7px] inline-flex items-center gap-1.5',
//                 'bg-amber-100 text-amber-800 border-amber-200/70',
//                 'dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800'
//               )}
//             >
//               <PowerOff className="h-3.5 w-3.5" />
//             </Badge>
//           )}
//         </button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle className="text-base">
//             {region} — {metric}
//           </DialogTitle>
//           <DialogDescription className="text-xs">
//             Promedio y detalle de la métrica en el rango seleccionado.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="space-y-3">
//           <div className="flex items-center justify-between">
//             <span className="text-muted-foreground text-sm">Promedio</span>
//             <span className="font-medium">{formatMetricValue(metric, datum.avg_value)}</span>
//           </div>

//           <div className="grid grid-cols-2 gap-2 text-sm">
//             <span className="text-muted-foreground">Muestras</span>
//             <span className="text-right">{datum.count}</span>

//             <span className="text-muted-foreground">{resourceCount === 1 ? 'Recurso' : 'Recursos'}</span>
//             <span className="text-right">{resourceCount}</span>

//             <span className="text-muted-foreground">Desde</span>
//             <span className="text-right">
//               {datum.first_ts ? new Date(datum.first_ts).toLocaleString() : '—'}
//             </span>

//             <span className="text-muted-foreground">Hasta</span>
//             <span className="text-right">
//               {datum.last_ts ? new Date(datum.last_ts).toLocaleString() : '—'}
//             </span>
//           </div>
//           {isUnused(datum.avg_value) && (
//             <Badge
//               variant="secondary"
//               className={cn(
//                 'mt-1 flex flex-col items-center gap-1.5 font-semibold text-sm whitespace-normal',
//                 'bg-amber-100 text-amber-800 border-amber-200/70',
//                 'dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
//                 'lg:inline-flex lg:flex-row'
//               )}
//             >
//               <PowerOff className="h-3.5 w-3.5" />
//               métrica sin uso / recursos sin uso / recursos apagados
//             </Badge>
//           )}
//           {resources.length > 0 && (
//             <div className="space-y-2">
//               <div className="text-xs text-muted-foreground">Recursos</div>
//               <ScrollArea className="h-28 rounded-md border p-2">
//                 <div className="flex flex-wrap gap-1">
//                   {resources.map((r, i) => (
//                     <Badge key={r + i} variant="secondary" className="text-[10px]">
//                       {r}
//                     </Badge>
//                   ))}
//                 </div>
//               </ScrollArea>
//             </div>
//           )}
//         </div>
//         <DialogFooter>
//           <DialogClose asChild>
//             <Button variant="default" type="button" className='cursor-pointer'>Cerrar</Button>
//           </DialogClose>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export const AverageByLocationMetricsComponent = ({ data }: Props) => {
//   const metrics = useMemo(() => {
//     const set = new Set<string>();
//     for (const row of data ?? []) {
//       for (const a of row.averages ?? []) {
//         if (a?.metric_name) set.add(a.metric_name);
//       }
//     }
//     return Array.from(set).sort(byAlpha);
//   }, [data]);

//   const table = useMemo(() => {
//     const map = new Map<string, Map<string, AverageByLocationData['averages'][number]>>([]);
//     for (const row of data ?? []) {
//       const region = row.location;
//       if (!region) continue;
//       if (!map.has(region)) map.set(region, new Map());
//       const inner = map.get(region)!;
//       for (const a of row.averages ?? []) {
//         if (!a?.metric_name) continue;
//         inner.set(a.metric_name, a);
//       }
//     }
//     return map;
//   }, [data]);

//   const regions = useMemo(() => Array.from(table.keys()).sort(byAlpha), [table]);

//   if (!data?.length || !metrics.length) {
//     return (
//       <div className="rounded-md border p-8">
//         <div className="text-center space-y-1">
//           <div className="text-lg text-muted-foreground">No hay datos disponibles</div>
//           <div className="text-xs text-muted-foreground">Ajusta filtros de fecha, región o servicio</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-lg border border-border p-5">
//       <div className="p-5 border-b">
//         <h2 className="text-xl font-semibold tracking-tight">Métricas por Región</h2>
//         <p className="text-sm text-muted-foreground">
//           Promedios por métrica y región en el rango seleccionado.
//         </p>
//         <Badge
//           variant="secondary"
//           className={cn(
//             'mt-1 flex flex-col items-center gap-1.5 font-semibold text-sm whitespace-normal',
//             'bg-amber-100 text-amber-800 border-amber-200/70',
//             'dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
//             'lg:inline-flex lg:flex-row'
//           )}
//         >
//           <PowerOff className="h-3.5 w-3.5" />
//           Indica métrica sin uso / recursos sin uso / recursos apagados
//         </Badge>
//         <p className="text-md text-muted-foreground font-semibold pt-5">
//           Haz clic en el botón <Info className="inline h-3.5 w-3.5 align-text-bottom" /> para ver el detalle.
//         </p>
//       </div>

//       <div className="overflow-x-auto">
//         <div className="inline-block min-w-full">
//           <div className="flex bg-muted/40 border-y">
//             <div className="w-44 shrink-0 p-3 font-medium border-r bg-muted text-foreground">Región</div>
//             {metrics.map((m) => (
//               <div
//                 key={m}
//                 className="min-w-[13rem] flex-1 p-3 font-medium border-r bg-muted text-foreground text-center"
//               >
//                 <div className="text-xs leading-tight">{m}</div>
//               </div>
//             ))}
//           </div>

//           {regions.map((region) => {
//             const values = table.get(region)!;
//             const status = evaluateRegion(values as Map<string, unknown>);

//             return (
//               <div key={region} className="flex border-b hover:bg-muted/20 transition-colors">
//                 <div className="w-44 shrink-0 p-3 border-r bg-muted/10 flex flex-col gap-1">
//                   <span className="text-sm font-medium">{region}</span>
//                   <span className="text-[10px] text-muted-foreground">
//                     Índice: {status.score.toFixed(0)}/100
//                   </span>
//                   <span
//                     className={cn(
//                       'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium w-fit',
//                       status.color === 'red' && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
//                       status.color === 'amber' && 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
//                       status.color === 'green' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
//                     )}
//                     title={status.reasons.length ? status.reasons.join(' • ') : 'Sin observaciones'}
//                   >
//                     {status.label}
//                   </span>
//                 </div>

//                 {metrics.map((m) => {
//                   const a = values.get(m);
//                   if (!a) {
//                     return (
//                       <div key={`${region}-${m}`} className="min-w-[13rem] flex-1 p-3 text-center border-r">
//                         <span className="text-muted-foreground text-sm">N/A</span>
//                       </div>
//                     );
//                   }
//                   return (
//                     <MetricCellDialog key={`${region}-${m}`} region={region} metric={m} datum={a} />
//                   );
//                 })}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };
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