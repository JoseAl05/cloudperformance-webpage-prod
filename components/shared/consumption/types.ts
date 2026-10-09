import type { ConsumptionCloud } from '@/interfaces/consumption';
import type { ValueFormat } from '@/lib/consumption';

/** Un valor a mostrar, leído por ruta del recurso ("metrics.avg_cpu_utilization", "details.vpc_id", "resource_type"). */
export interface FieldDef {
    label: string;
    path: string;
    format?: ValueFormat | 'text' | 'date';
    unit?: string;
}

/** Columna numérica de la tabla, con barra relativa al máximo visible. */
export interface MetricColumnDef extends FieldDef {
    bar?: boolean;
    /** Segunda línea opcional (p. ej. "Máx" o tráfico de salida). */
    secondary?: FieldDef;
}

export interface MetricGroupDef {
    title: string;
    rows: FieldDef[];
}

/**
 * Configuración de una vista de consumo. Todo lo que cambia entre nubes/recursos vive aquí;
 * el diseño (tarjetas, gráficos, tabla y detalle) es el mismo para todas.
 */
export interface ConsumptionViewConfig {
    cloud: ConsumptionCloud;
    /** Segmento de ruta del recurso: 'ec2', 'vm', 'compute-engine', 'cloud-sql', ... */
    resource: string;
    /** Nombre del servicio en textos: "EC2", "Compute Engine", "Azure Database". */
    serviceName: string;
    /** Etiqueta del recurso en el detalle ("EC2 Instance", "Cloud SQL"). */
    resourceTypeLabel: string;
    /** Textos de las tarjetas de resumen. */
    labels: { total: string; unit: string; idle: string; underutilized: string };
    /** Endpoints de series: ['metrics'] o uno por métrica ('metrics/cpu-usage', ...). */
    metricsEndpoints: string[];
    hasEfficiency: boolean;
    /** Columnas de métricas de la tabla (además de recurso, estado, ubicación, clasificación, costo y sincronización). */
    tableColumns: MetricColumnDef[];
    /** Campos de "Información General" en el detalle. */
    generalFields: FieldDef[];
    /** Bloques de "Métricas" en el detalle. */
    metricGroups: MetricGroupDef[];
    /** Columnas del historial por sincronización (rutas relativas al registro: 'metrics.x', 'cost'). */
    historyColumns?: FieldDef[];
    showStorageInefficient?: boolean;
    recommendations: { idle: string; underutilized: string };
    emptyText: string;
}
