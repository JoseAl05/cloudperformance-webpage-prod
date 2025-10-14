'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, BarChart3, Cpu, Database, HardDrive, Activity, Zap, Users } from 'lucide-react';

// Función para determinar el grupo de una métrica RDS Oracle
const getMetricGroup = (metricLabel: string): string => {
  if (metricLabel.includes('CPU') && !metricLabel.includes('Créditos')) {
    return 'cpu';
  } else if (metricLabel.includes('Créditos')) {
    return 'credits';
  } else if (metricLabel.includes('Conexiones')) {
    return 'connections';
  } else if (metricLabel.includes('Memoria')) {
    return 'memory';
  } else if (metricLabel.includes('Almacenamiento')) {
    return 'storage';
  } else if (metricLabel.includes('Lecturas') || metricLabel.includes('Escrituras') || metricLabel.includes('IOPS')) {
    return 'io';
  }
  return 'other';
};

// Función para formatear valores según el tipo de métrica RDS Oracle
const formatMetricValue = (value: number, metricLabel: string): string => {
  if (metricLabel.includes('CPU') && !metricLabel.includes('Créditos')) {
    return `${value.toFixed(1)}%`;
  } else if (metricLabel.includes('Créditos')) {
    return `${value.toFixed(4)} unidades`;
  } else if (metricLabel.includes('Conexiones')) {
    return `${value.toFixed(4)} conexiones`;
  } else if (metricLabel.includes('Memoria')) {
    if (value > 1073741824) return `${(value / 1073741824).toFixed(2)} GB`;
    if (value > 1048576) return `${(value / 1048576).toFixed(2)} MB`;
    if (value > 1024) return `${(value / 1024).toFixed(2)} KB`;
    return `${value.toFixed(2)} bytes`;
  } else if (metricLabel.includes('Almacenamiento')) {
    if (value > 1073741824) return `${(value / 1073741824).toFixed(2)} GB`;
    if (value > 1048576) return `${(value / 1048576).toFixed(2)} MB`;
    if (value > 1024) return `${(value / 1024).toFixed(2)} KB`;
    return `${value.toFixed(2)} bytes`;
  } else if (metricLabel.includes('Lecturas') || metricLabel.includes('Escrituras') || metricLabel.includes('IOPS')) {
    return `${value.toFixed(2)} IOPS`;
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

// FUNCIÓN DINÁMICA PARA ASIGNAR COLORES BASÁNDOSE EN LA POSICIÓN EN EL RANKING
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

export const AVGUsoLocInstRdsOracleViewUsoPorRegionComponent = ({
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

  // CALCULAR VALORES AGRUPADOS DINÁMICAMENTE
  const metricValues = useMemo(() => {
    return calculateMetricValues(data, allMetrics);
  }, [data, allMetrics]);

  // FUNCION PARA CONFIGURAR LAS TARJETAS
  const getGroupStats = useMemo(() => {
    const stats = {
      cpu: { status: 'Normal' },
      credits: { status: 'Disponibles' },
      connections: { status: 'Normales' },
      memory: { status: 'Suficiente' },
      storage: { status: 'Suficiente' },
      io: { status: 'Normal' }
    };

    ['cpu', 'credits', 'connections', 'memory', 'storage', 'io'].forEach(group => {
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
          stats.cpu.status = avg > 60 ? 'Alto' : avg > 20 ? 'Moderado' : 'Normal';
        } else if (group === 'credits') {
          stats.credits.status = avg > 200 ? 'Abundantes' : avg > 50 ? 'Disponibles' : 'Bajos';
        } else if (group === 'connections') {
          stats.connections.status = avg > 50 ? 'Altas' : avg > 10 ? 'Moderadas' : 'Normales';
        } else if (group === 'memory') {
          stats.memory.status = avg > 1073741824 ? 'Suficiente' : avg > 536870912 ? 'Limitada' : 'Baja';
        } else if (group === 'storage') {
          stats.storage.status = avg > 10737418240 ? 'Suficiente' : avg > 5368709120 ? 'Limitado' : 'Bajo';
        } else if (group === 'io') {
          stats.io.status = avg > 500 ? 'Alto' : avg > 100 ? 'Moderado' : 'Normal';
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
          Uso por Región - Heatmap RDS Oracle
        </h2>
        <p className="text-gray-600">
          Visualización de métricas promedio por región AWS - Instancias RDS Oracle
        </p>
      </div>

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
                // USAR LA FUNCIÓN DINÁMICA
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

      {/* Tarjetas de estadísticas */}
      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
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

          {/* Card Connections */}
          {allMetrics.some(metric => getMetricGroup(metric) === 'connections') && (
            <Card key="connections-card" className="border-l-purple-500 border-l-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group">
              <CardContent className="p-2 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/20 group-hover:scale-110">
                    <Users className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <h3 className="text-xs font-medium text-muted-foreground mt-1">
                  Conexiones
                </h3>
                <div className="mt-auto">
                  <p className="text-lg font-bold text-foreground tracking-tight">
                    {getGroupStats.connections.status}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Card Memory */}
          {allMetrics.some(metric => getMetricGroup(metric) === 'memory') && (
            <Card key="memory-card" className="border-l-indigo-500 border-l-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group">
              <CardContent className="p-2 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 group-hover:scale-110">
                    <Database className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <h3 className="text-xs font-medium text-muted-foreground mt-1">
                  Memoria
                </h3>
                <div className="mt-auto">
                  <p className="text-lg font-bold text-foreground tracking-tight">
                    {getGroupStats.memory.status}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Card Storage */}
          {allMetrics.some(metric => getMetricGroup(metric) === 'storage') && (
            <Card key="storage-card" className="border-l-teal-500 border-l-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group">
              <CardContent className="p-2 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/20 group-hover:scale-110">
                    <HardDrive className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <h3 className="text-xs font-medium text-muted-foreground mt-1">
                  Almacenamiento
                </h3>
                <div className="mt-auto">
                  <p className="text-lg font-bold text-foreground tracking-tight">
                    {getGroupStats.storage.status}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Card I/O */}
          {allMetrics.some(metric => getMetricGroup(metric) === 'io') && (
            <Card key="io-card" className="border-l-orange-500 border-l-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group">
              <CardContent className="p-2 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/20 group-hover:scale-110">
                    <Activity className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <h3 className="text-xs font-medium text-muted-foreground mt-1">
                  I/O Operaciones
                </h3>
                <div className="mt-auto">
                  <p className="text-lg font-bold text-foreground tracking-tight">
                    {getGroupStats.io.status}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};