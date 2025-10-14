'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card'; // Agregar este import al inicio
import { MapPin, BarChart3, Cpu, Network, Zap, Shield } from 'lucide-react';

// Función para determinar el grupo de una métrica
const getMetricGroup = (metricLabel: string): string => {
  if (metricLabel.includes('CPU') && !metricLabel.includes('Créditos')) {
    return 'cpu';
  } else if (metricLabel.includes('Red') || metricLabel.includes('Network')) {
    return 'network';
  } else if (metricLabel.includes('Créditos')) {
    return 'credits';
  }
  return 'other';
};

// Función para formatear valores según el tipo de métrica
const formatMetricValue = (value: number, metricLabel: string): string => {
  if (metricLabel.includes('CPU') && !metricLabel.includes('Créditos')) {
    return `${value.toFixed(1)}%`;
  } else if (metricLabel.includes('Red') || metricLabel.includes('Network')) {
    if (value > 1000000000) return `${(value / 1000000000).toFixed(2)} GB/s`;
    if (value > 1000000) return `${(value / 1000000).toFixed(2)} MB/s`;
    if (value > 1000) return `${(value / 1000).toFixed(2)} KB/s`;
    return `${value.toFixed(2)} B/s`;
  } else if (metricLabel.includes('Créditos')) {
    return `${value.toFixed(4).replace(/\.?0+$/, '')} unidades`;
  }
  return value.toFixed(2);
};

interface ProcessedHeatmapData {
  region: string;
  metrics: { [key: string]: number };
}

interface Props {
  data: ProcessedHeatmapData[];
  allMetrics: string[];
  isLoading: boolean;
  error: unknown;
}

// FUNCIÓN PARA OBTENER EL GRUPO DE LA MÉTRICA (texto antes del paréntesis)
const getMetricGroupName = (metricLabel: string): string => {
  const parenIndex = metricLabel.indexOf('(');
  return parenIndex > 0 ? metricLabel.substring(0, parenIndex).trim() : metricLabel;
};

// FUNCIÓN PARA CALCULAR VALORES AGRUPADOS POR NOMBRE BASE (sin paréntesis)
const calculateMetricValues = (data: ProcessedHeatmapData[], allMetrics: string[]) => {
  const groupedValues: { [key: string]: number[] } = {};

  // Agrupar métricas por nombre base (antes del paréntesis)
  const metricGroups: { [key: string]: string[] } = {};
  allMetrics.forEach(metric => {
    const groupName = getMetricGroupName(metric);
    if (!metricGroups[groupName]) {
      metricGroups[groupName] = [];
    }
    metricGroups[groupName].push(metric);
  });

  // Para cada grupo, recopilar todos los valores
  Object.keys(metricGroups).forEach(groupName => {
    const metricsInGroup = metricGroups[groupName];
    const allValuesInGroup: number[] = [];

    metricsInGroup.forEach(metric => {
      data.forEach(item => {
        const value = item.metrics[metric];
        if (value !== undefined && value !== null && !isNaN(value)) {
          allValuesInGroup.push(value);
        }
      });
    });

    if (allValuesInGroup.length > 0) {
      // Eliminar duplicados y ordenar de MAYOR a MENOR
      const uniqueValues = [...new Set(allValuesInGroup)].sort((a, b) => b - a);
      groupedValues[groupName] = uniqueValues;

      // También asignar a cada métrica individual el mismo grupo
      metricsInGroup.forEach(metric => {
        groupedValues[metric] = uniqueValues;
      });
    }
  });

  return groupedValues;
};

// FUNCIÓN PARA ASIGNAR COLORES BASÁNDOSE EN LA POSICIÓN EN EL RANKING
const getColorByAbsoluteValue = (
  value: number, 
  metricLabel: string, 
  metricValues: { [key: string]: number[] }
): string => {
  const values = metricValues[metricLabel];

  if (!values || values.length === 0) {
    return 'rgb(220, 220, 220)'; // Default gris si no hay valores
  }

  // Encontrar la posición del valor en el array ordenado (mayor a menor)
  const position = values.indexOf(value);

  if (position === -1) {
    return 'rgb(220, 220, 220)'; // Default gris si no se encuentra
  }

  const totalValues = values.length;


  // Asignación de colores según cantidad de valores
  if (totalValues === 1) {
    return 'hsl(45, 60%, 75%)'; // 1 valor = AMARILLO
  } else if (totalValues === 2) {
    // 2 valores: ROJO (mayor), VERDE (menor)
    return position === 0 ? 'hsl(0, 70%, 75%)' : 'hsl(120, 70%, 75%)';
  } else if (totalValues === 3) {
    // 3 valores: ROJO (mayor), AMARILLO (medio), VERDE (menor)
    if (position === 0) return 'hsl(0, 70%, 75%)';    // ROJO
    if (position === 1) return 'hsl(45, 60%, 75%)';   // AMARILLO
    return 'hsl(120, 70%, 75%)';                       // VERDE
  } else if (totalValues === 4) {
    // 4 valores: ROJO, AMARILLO, VERDE, GRIS
    if (position === 0) return 'hsl(0, 70%, 75%)';    // ROJO
    if (position === 1) return 'hsl(45, 60%, 75%)';   // AMARILLO
    if (position === 2) return 'hsl(120, 70%, 75%)';  // VERDE
    return 'hsl(0, 0%, 65%)';                          // GRIS
  } else {
    // 5+ valores: ROJO, AMARILLO, VERDE, GRIS, BLANCO, etc.
    if (position === 0) return 'hsl(0, 70%, 75%)';    // ROJO
    if (position === 1) return 'hsl(45, 60%, 75%)';   // AMARILLO
    if (position === 2) return 'hsl(120, 70%, 75%)';  // VERDE
    if (position === 3) return 'hsl(0, 0%, 65%)';     // GRIS
    if (position === 4) return 'hsl(0, 0%, 85%)';     // BLANCO/GRIS CLARO
    // Para más valores, continuar con grises más claros
    const lightness = Math.min(95, 85 + ((position - 4) * 2));
    return `hsl(0, 0%, ${lightness}%)`;
  }
};

export const AVGUsoLocInstEC2ViewUsoPorRegionComponent = ({
  data,
  allMetrics,
  isLoading,
  error
}: Props) => {
  const [hoveredCell, setHoveredCell] = useState<{ 
    region: string; 
    metric: string; 
    value: number;
    x: number;
    y: number;
  } | null>(null);

  // CALCULAR VALORES ORDENADOS PARA CADA MÉTRICA
  const metricValues = useMemo(() => {
    return calculateMetricValues(data, allMetrics);
  }, [data, allMetrics]);

  // Calcular valores min y max para el gradiente de colores
  const { minValue, maxValue } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;

    data.forEach(item => {
      Object.values(item.metrics).forEach(value => {
        min = Math.min(min, value);
        max = Math.max(max, value);
      });
    });

    return { 
      minValue: min === Infinity ? 0 : min, 
      maxValue: max === -Infinity ? 0 : max 
    };
  }, [data]);

  // FUNCION PARA CONFIGURAR LAS TARJETAS
  const getGroupStats = useMemo(() => {
    const stats = {
      cpu: { status: 'Normal' },
      network: { status: 'Bajo' },
      credits: { status: 'Disponibles' }
    };

    ['cpu', 'network', 'credits'].forEach(group => {
      const groupMetrics = allMetrics.filter(metric => getMetricGroup(metric) === group);
      const values: number[] = [];

      data.forEach(item => {
        groupMetrics.forEach(metric => {
          const value = item.metrics[metric];
          if (value !== undefined) values.push(value);
        });
      });

      if (values.length > 0) {
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

        if (group === 'cpu') {
          stats.cpu.status = avg > 80 ? 'Crítico' : avg > 50 ? 'Alto' : 'Normal';
        } else if (group === 'network') {
          stats.network.status = avg > 1000000000 ? 'Alto' : avg > 100000 ? 'Moderado' : 'Bajo';
        } else if (group === 'credits') {
          stats.credits.status = avg > 400 ? 'Abundantes' : avg > 100 ? 'Disponibles' : 'Bajos';
        }
      }
    });

    return stats;
  }, [data, allMetrics]);

  if (!data.length || !allMetrics.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-gray-500 dark:text-gray-400 mb-2 text-lg">No hay datos disponibles</div>
          <div className="text-gray-400 dark:text-gray-500 text-sm">
            Selecciona al menos una métrica y ajusta los filtros de fecha y región
          </div>
        </div>
      </div>
    );
  }

  const handleCellHover = (
    region: string, 
    metric: string, 
    value: number, 
    event: React.MouseEvent
  ) => {
    setHoveredCell({
      region,
      metric,
      value,
      x: event.clientX,
      y: event.clientY
    });
  };

  return (
    <div className="bg-white dark:bg-transparent rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Uso por Región - Heatmap Interactivo
        </h2>
        <p className="text-gray-600">
          Visualización de métricas promedio por región AWS
        </p>
      </div>

      {/* Leyenda de colores */}
      {/* <div className="mb-6 flex flex-wrap items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Intensidad:</span>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded" style={{backgroundColor: 'hsl(120, 70%, 80%)'}}></div>
          <span className="text-xs text-gray-600">Bajo</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded" style={{backgroundColor: 'hsl(45, 80%, 70%)'}}></div>
          <span className="text-xs text-gray-600">Medio</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded" style={{backgroundColor: 'hsl(0, 75%, 75%)'}}></div>
          <span className="text-xs text-gray-600">Alto</span>
        </div>
      </div> */}

      {/* Heatmap */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <div className="inline-block min-w-full">
          {/* Headers de métricas */}
          <div className="flex bg-gray-50 dark:bg-slate-800 border-b-2 border-gray-200 dark:border-gray-600">
            <div className="w-36 p-4 font-semibold text-gray-700 border-r border-gray-300 bg-gray-100">
              <div className="text-sm">Región</div>
            </div>
            {allMetrics.map((metric) => (
              <div
                key={metric}
                className="flex-1 min-w-[11rem] p-4 font-semibold text-gray-700 border-r border-gray-300 text-center bg-gray-100 flex items-center justify-center"
              >
                <div className="text-xs leading-tight break-words">{metric}</div>
              </div>
            ))}
          </div>

          {/* Filas de datos */}
          {data.map((item) => (
            <div key={item.region} className="flex border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150">
              <div className="w-36 p-4 font-medium text-gray-800 bg-gray-50/50 border-r border-gray-300 flex items-center">
                <div className="text-sm">{item.region}</div>
              </div>
              {allMetrics.map((metric) => {

                const value = item.metrics[metric];
                const hasValue = value !== undefined && value !== null;
                // USAR LA NUEVA FUNCIÓN SIMPLE
                const backgroundColor = hasValue 
                  ? getColorByAbsoluteValue(value, metric, metricValues)
                  : '#f9fafb';

                return (
                  <div
                    key={`${item.region}-${metric}`}
                    className="flex-1 min-w-[11rem] p-4 border-r border-gray-300 text-center cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-blue-400 hover:ring-inset relative flex items-center justify-center"
                    style={{ backgroundColor }}
                    onMouseEnter={(e) => hasValue && handleCellHover(item.region, metric, value, e)}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {hasValue ? (
                      <div className="font-semibold text-gray-800 text-sm">
                        {formatMetricValue(value, metric)}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm">N/A</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip flotante */}
      {hoveredCell && (
        <div 
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: hoveredCell.x,
            top: hoveredCell.y - 10
          }}
        >
          <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl text-sm max-w-xs border border-gray-700">
            <div className="font-semibold text-blue-300">{hoveredCell.region}</div>
            <div className="text-gray-300 text-xs mt-1">{hoveredCell.metric}</div>
            <div className="text-yellow-300 font-bold mt-1">
              Valor: {hoveredCell.value.toFixed(4)}
            </div>
          </div>
        </div>
      )}
      {/* TARJETAS DESDE AQUI */}
      {/* Estadísticas resumidas */}
      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {/* Card Regiones */}
          <Card key="regions-card" className="border-l-blue-500 border-l-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group">
            <CardContent className="p-2 flex flex-col h-full">
              <div className="flex items-center justify-between">
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 group-hover:scale-110">
                  <MapPin className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <h3 className="text-xs font-medium text-muted-foreground mt-1">
                Regiones
              </h3>
              <div className="mt-auto">
                <p className="text-lg font-bold text-foreground tracking-tight">
                  {data.length}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card Métricas */}
          <Card key="metrics-card" className="border-l-green-500 border-l-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group">
            <CardContent className="p-2 flex flex-col h-full">
              <div className="flex items-center justify-between">
                <div className="p-1.5 rounded-lg bg-green-50 dark:bg-green-950/20 group-hover:scale-110">
                  <BarChart3 className="h-3 w-3 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <h3 className="text-xs font-medium text-muted-foreground mt-1">
                Métricas
              </h3>
              <div className="mt-auto">
                <p className="text-lg font-bold text-foreground tracking-tight">
                  {allMetrics.length}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cards dinámicas por grupo */}
          {allMetrics.some(metric => getMetricGroup(metric) === 'cpu') && (
            <Card key="cpu-card" className="border-l-red-500 border-l-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group">
              <CardContent className="p-2 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/20 group-hover:scale-110">
                    <Cpu className="h-3 w-3 text-red-600 dark:text-red-400" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <h3 className="text-xs font-medium text-muted-foreground mt-1">
                  Estado CPU
                </h3>
                <div className="mt-auto">
                  <p className="text-lg font-bold text-foreground tracking-tight">
                    {getGroupStats.cpu.status}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Card Network */}
          {allMetrics.some(metric => getMetricGroup(metric) === 'network') && (
            <Card key="network-card" className="border-l-cyan-500 border-l-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group">
              <CardContent className="p-2 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/20 group-hover:scale-110">
                    <Network className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <h3 className="text-xs font-medium text-muted-foreground mt-1">
                  Tráfico Red
                </h3>
                <div className="mt-auto">
                  <p className="text-lg font-bold text-foreground tracking-tight">
                    {getGroupStats.network.status}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Card Credits */}
          {allMetrics.some(metric => getMetricGroup(metric) === 'credits') && (
            <Card key="credits-card" className="border-l-amber-500 border-l-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group">
              <CardContent className="p-2 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 group-hover:scale-110">
                    <Zap className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <h3 className="text-xs font-medium text-muted-foreground mt-1">
                  Créditos CPU
                </h3>
                <div className="mt-auto">
                  <p className="text-lg font-bold text-foreground tracking-tight">
                    {getGroupStats.credits.status}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Card Status Check */}
          {allMetrics.some(metric => getMetricGroup(metric) === 'status') && (
            <Card key="status-card" className="border-l-purple-500 border-l-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group">
              <CardContent className="p-2 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/20 group-hover:scale-110">
                    <Shield className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <h3 className="text-xs font-medium text-muted-foreground mt-1">
                  Status Check
                </h3>
                <div className="mt-auto">
                  <p className="text-lg font-bold text-foreground tracking-tight">
                    {getGroupStats.status?.status || 'Normal'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {/* TARJETAS HASTA AQUI */}
    </div>
  );
};













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
// import { cn } from '@/lib/utils';

// // --- Tipos locales mínimos para estandarizar la celda (simil AverageByLocation) ---
// type CellDatum = {
//   avg_value: number;
//   count?: number;
//   resources?: string[];
//   resource_count?: number;
//   first_ts?: string | null;
//   last_ts?: string | null;
// };

// type ProcessedHeatmapData = {
//   region: string;
//   metrics: Record<string, number>;
// };

// type Props = {
//   data: ProcessedHeatmapData[];
//   allMetrics: string[];
//   isLoading: boolean;
//   error: unknown;
// };

// // --- Utils (idéntica filosofía del otro componente) ---
// const byAlpha = (a: string, b: string) =>
//   a.localeCompare(b, 'es', { sensitivity: 'base' });

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
//   if (m.includes('percentage') || m.includes('%') || m.includes('percent')) {
//     return `${value.toFixed(2)}%`;
//   }
//   if (m.includes('available memory') || m.includes('memory bytes') || m.includes('bytes')) {
//     return formatBytes(value);
//   }
//   if (m.includes('iops')) return `${value.toFixed(2)} IOPS`;
//   if (m.includes('credits')) return `${(+value).toFixed(4).replace(/\.?0+$/, '')} créditos`;
//   if (m.includes('capacity') || m.includes('storage used') || m.includes('backup storage used')) {
//     // si tu helper bytesToGB existe, puedes usarlo; acá dejamos formato básico:
//     return formatBytes(value);
//   }
//   return value.toFixed(2);
// };

// const isUnused = (v: unknown) => typeof v === 'number' && v === 0;

// // --- Celda con Dialog (calcada metodológicamente del otro componente) ---
// const MetricCellDialog = ({
//   region,
//   metric,
//   datum,
// }: {
//   region: string;
//   metric: string;
//   datum: CellDatum;
// }) => {
//   const unused = isUnused(datum?.avg_value);
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
//             unused && 'bg-amber-200/60 dark:bg-amber-900/10'
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
//             {typeof datum.count === 'number' && (
//               <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
//                 {datum.count} muestras
//               </Badge>
//             )}
//             {typeof resourceCount === 'number' && resourceCount > 0 && (
//               <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
//                 {resourceCount === 1 ? '1 recurso' : `${resourceCount} recursos`}
//               </Badge>
//             )}
//           </div>

//           {unused && (
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
//             {typeof datum.count === 'number' && (
//               <>
//                 <span className="text-muted-foreground">Muestras</span>
//                 <span className="text-right">{datum.count}</span>
//               </>
//             )}

//             {typeof resourceCount === 'number' && resourceCount > 0 && (
//               <>
//                 <span className="text-muted-foreground">{resourceCount === 1 ? 'Recurso' : 'Recursos'}</span>
//                 <span className="text-right">{resourceCount}</span>
//               </>
//             )}

//             {datum.first_ts && (
//               <>
//                 <span className="text-muted-foreground">Desde</span>
//                 <span className="text-right">{new Date(datum.first_ts).toLocaleString()}</span>
//               </>
//             )}
//             {datum.last_ts && (
//               <>
//                 <span className="text-muted-foreground">Hasta</span>
//                 <span className="text-right">{new Date(datum.last_ts).toLocaleString()}</span>
//               </>
//             )}
//           </div>

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
//             <Button variant="default" type="button" className="cursor-pointer">
//               Cerrar
//             </Button>
//           </DialogClose>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// // --- Componente principal con la MISMA estructura de tabla/encabezados ---
// export const AVGUsoLocInstEC2ViewUsoPorRegionComponent = ({
//   data,
//   allMetrics,
//   isLoading,
//   error,
// }: Props) => {
//   // 1) Métricas (si no te pasan allMetrics, las deduzco de la data)
//   const metrics = useMemo(() => {
//     if (Array.isArray(allMetrics) && allMetrics.length) {
//       return [...new Set(allMetrics)].sort(byAlpha);
//     }
//     const set = new Set<string>();
//     for (const row of data ?? []) {
//       for (const k of Object.keys(row.metrics ?? {})) set.add(k);
//     }
//     return Array.from(set).sort(byAlpha);
//   }, [allMetrics, data]);

//   // 2) Tabla region -> metric -> datum (mismo approach que AverageByLocation)
//   const table = useMemo(() => {
//     const map = new Map<string, Map<string, CellDatum>>();
//     for (const row of data ?? []) {
//       const region = row.region;
//       if (!region) continue;
//       if (!map.has(region)) map.set(region, new Map());
//       const inner = map.get(region)!;

//       for (const metric of Object.keys(row.metrics ?? {})) {
//         const val = row.metrics[metric];
//         // Datos que no tenemos en esta vista (count/resources) quedan como opcionales
//         inner.set(metric, {
//           avg_value: typeof val === 'number' ? val : Number.NaN,
//         });
//       }
//     }
//     return map;
//   }, [data]);

//   const regions = useMemo(() => Array.from(table.keys()).sort(byAlpha), [table]);

//   // 3) Estados
//   if (isLoading) {
//     return (
//       <div className="rounded-md border p-8">
//         <div className="text-center space-y-1">
//           <div className="text-lg text-muted-foreground">Cargando…</div>
//           <div className="text-xs text-muted-foreground">Obteniendo promedios por región</div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="rounded-md border p-8">
//         <div className="text-center space-y-1">
//           <div className="text-lg text-red-600">Error</div>
//           <div className="text-xs text-muted-foreground">No se pudo cargar la información</div>
//         </div>
//       </div>
//     );
//   }

//   if (!data?.length || !metrics.length) {
//     return (
//       <div className="rounded-md border p-8">
//         <div className="text-center space-y-1">
//           <div className="text-lg text-muted-foreground">No hay datos disponibles</div>
//           <div className="text-xs text-muted-foreground">
//             Ajusta filtros de fecha, región o servicio
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // 4) Render idéntico en estructura al componente de referencia
//   return (
//     <div className="rounded-lg border border-border p-5">
//       <div className="p-5 border-b">
//         <h2 className="text-xl font-semibold tracking-tight">Uso por Región (EC2)</h2>
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
//           {/* Encabezados */}
//           <div className="flex bg-muted/40 border-y">
//             <div className="w-44 shrink-0 p-3 font-medium border-r bg-muted text-foreground">
//               Región
//             </div>
//             {metrics.map((m) => (
//               <div
//                 key={m}
//                 className="min-w-[13rem] flex-1 p-3 font-medium border-r bg-muted text-foreground text-center"
//               >
//                 <div className="text-xs leading-tight">{m}</div>
//               </div>
//             ))}
//           </div>

//           {/* Filas */}
//           {regions.map((region) => {
//             const values = table.get(region)!;

//             return (
//               <div
//                 key={region}
//                 className="flex border-b hover:bg-muted/20 transition-colors"
//               >
//                 <div className="w-44 shrink-0 p-3 border-r bg-muted/10 flex items-center justify-between">
//                   <span className="text-sm font-medium">{region}</span>
//                 </div>

//                 {metrics.map((m) => {
//                   const a = values.get(m);
//                   if (!a || Number.isNaN(a.avg_value)) {
//                     return (
//                       <div
//                         key={`${region}-${m}`}
//                         className="min-w-[13rem] flex-1 p-3 text-center border-r"
//                       >
//                         <span className="text-muted-foreground text-sm">N/A</span>
//                       </div>
//                     );
//                   }

//                   return (
//                     <MetricCellDialog
//                       key={`${region}-${m}`}
//                       region={region}
//                       metric={m}
//                       datum={a}
//                     />
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
