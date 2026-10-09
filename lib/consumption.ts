/**
 * Utilidades de la familia "Consumo / Eficiencia": URLs del contrato canónico, formato de valores y
 * el registro único de métricas (etiqueta + formato) que usan los gráficos y tablas de las tres nubes.
 */
import type { ConsumptionCloud, ConsumptionResource } from '@/interfaces/consumption';

export type ConsumptionAction = string; // 'info' | 'efficiency' | 'metrics' | 'metrics/cpu-usage' ...
export type QueryParams = Record<string, string | number | boolean | null | undefined>;

/** Fecha para la API: "YYYY-MM-DDTHH:MM:SS" (UTC, sin zona). */
export const toApiDate = (date: Date): string => date.toISOString().slice(0, 19);

/** `/api/{cloud}/bridge/{cloud}/consumption/{resource}/{action}?{params}` (el bridge lo envía a `/api/{cloud}/consumption/...`). */
export const consumptionUrl = (
    cloud: ConsumptionCloud,
    resource: string,
    action: ConsumptionAction,
    params: QueryParams
): string => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && value !== false) {
            query.append(key, String(value));
        }
    });
    return `/api/${cloud}/bridge/${cloud}/consumption/${resource}/${action}?${query.toString()}`;
};

// ---------------------------------------------------------------------------
// Formato de valores
// ---------------------------------------------------------------------------

export type ValueFormat = 'percent' | 'bytes' | 'bytesRate' | 'count' | 'number' | 'gb';

const scaleBytes = (value: number, units: string[]) => {
    if (value === 0) return `0 ${units[0]}`;
    const k = 1024;
    const i = Math.min(Math.max(0, Math.floor(Math.log(Math.abs(value)) / Math.log(k))), units.length - 1);
    return `${parseFloat((value / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
};

export const compactNumber = (value: number): string => {
    const abs = Math.abs(value);
    if (abs >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (abs >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (abs >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toFixed(2);
};

export const formatValue = (value: number | null | undefined, format: ValueFormat = 'number', unit = ''): string => {
    if (value === null || value === undefined || !Number.isFinite(value)) return '—';
    switch (format) {
        case 'percent':
            return `${value.toFixed(2)}%`;
        case 'bytes':
            return scaleBytes(value, ['B', 'KB', 'MB', 'GB', 'TB']);
        case 'bytesRate':
            return scaleBytes(value, ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s']);
        case 'gb':
            return `${value.toFixed(2)} GB`;
        case 'count':
            return unit ? `${compactNumber(value)} ${unit}` : compactNumber(value);
        default:
            return unit ? `${value.toFixed(2)} ${unit}` : value.toFixed(2);
    }
};

export const formatDateTime = (iso: string | null | undefined): string =>
    iso ? new Date(iso).toLocaleString('es-CL', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

// ---------------------------------------------------------------------------
// Registro de métricas (series de tiempo de las tres nubes)
// ---------------------------------------------------------------------------

export interface MetricDefinition {
    label: string;
    format: ValueFormat;
    unit?: string;
}

/** Clave normalizada: minúsculas y sin separadores ("Percentage CPU" -> "percentagecpu"). */
export const metricKey = (name: string): string => name.toLowerCase().replace(/[^a-z0-9]/g, '');

const METRICS: Record<string, MetricDefinition> = {
    // CPU
    cpuutilization: { label: 'Uso de CPU', format: 'percent' },
    percentagecpu: { label: 'Uso de CPU', format: 'percent' },
    cpucreditbalance: { label: 'Créditos de CPU Disponibles', format: 'count', unit: 'Créditos' },
    cpucreditusage: { label: 'Créditos de CPU Usados', format: 'count', unit: 'Créditos' },
    statuscheckfailed: { label: 'Check de Estado Fallido', format: 'count', unit: 'Fallos' },
    // Memoria
    availablememory: { label: 'Memoria Disponible', format: 'count', unit: 'GB' },
    availablememorybytes: { label: 'Memoria Disponible', format: 'bytes' },
    freeablememory: { label: 'Memoria Disponible', format: 'bytes' },
    memoryutilization: { label: 'Uso de Memoria', format: 'percent' },
    // Disco / almacenamiento
    disksiops: { label: 'Disco (IOPS)', format: 'count', unit: 'IOPS' },
    diskreadiops: { label: 'Lectura de Disco (IOPS)', format: 'count', unit: 'IOPS' },
    diskwriteiops: { label: 'Escritura en Disco (IOPS)', format: 'count', unit: 'IOPS' },
    diskreadthroughput: { label: 'Lectura de Disco (Throughput)', format: 'bytesRate' },
    diskwritethroughput: { label: 'Escritura en Disco (Throughput)', format: 'bytesRate' },
    readiops: { label: 'Lectura IOPS', format: 'count', unit: 'IOPS' },
    writeiops: { label: 'Escritura IOPS', format: 'count', unit: 'IOPS' },
    freestoragespace: { label: 'Storage Libre', format: 'bytes' },
    storageutilization: { label: 'Uso de Almacenamiento', format: 'percent' },
    storageusedgb: { label: 'Almacenamiento Usado', format: 'gb' },
    usedcapacity: { label: 'Capacidad Usada', format: 'bytes' },
    freecapacity: { label: 'Capacidad Libre', format: 'bytes' },
    readthroughput: { label: 'Throughput Lectura', format: 'bytesRate' },
    writethroughput: { label: 'Throughput Escritura', format: 'bytesRate' },
    // Red
    networkin: { label: 'Red: Tráfico Entrante', format: 'bytesRate' },
    networkout: { label: 'Red: Tráfico Saliente', format: 'bytesRate' },
    networkegressthroughput: { label: 'Red: Tráfico Saliente', format: 'bytesRate' },
    networkingressthroughput: { label: 'Red: Tráfico Entrante', format: 'bytesRate' },
    networkegresspps: { label: 'Red: Paquetes Salientes', format: 'count', unit: 'pps' },
    networkingresspps: { label: 'Red: Paquetes Entrantes', format: 'count', unit: 'pps' },
    // Conexiones / BD
    connections: { label: 'Conexiones', format: 'count', unit: 'Conexiones' },
    databaseconnections: { label: 'Conexiones a la Base de Datos', format: 'count', unit: 'Conexiones' },
    // NAT Gateway
    activeconnectioncount: { label: 'Conexiones Activas', format: 'count', unit: 'Conexiones' },
    bytesinfromsource: { label: 'Datos Enviados a Internet', format: 'bytesRate' },
    bytesouttodestination: { label: 'Datos Entregados al Destino', format: 'bytesRate' },
    errorportallocation: { label: 'Error de asignación de puertos', format: 'count', unit: 'Errores' },
    // Load Balancer v2
    activeflowcount: { label: 'Flujos Activos', format: 'count', unit: 'Flujos' },
    consumedlcus: { label: 'LCUs Consumidos', format: 'count', unit: 'LCUs' },
    httpcodetarget5xxcount: { label: 'Errores HTTP 5XX (Target)', format: 'count', unit: 'Errores' },
    newconnectioncount: { label: 'Nuevas Conexiones', format: 'count', unit: 'Conexiones' },
    newflowcount: { label: 'Nuevos Flujos', format: 'count', unit: 'Flujos' },
    processedbytes: { label: 'Datos Procesados', format: 'bytesRate' },
    requestcount: { label: 'Requests', format: 'count', unit: 'Requests' },
    ruleevaluations: { label: 'Evaluaciones de Reglas', format: 'count', unit: 'Evaluaciones' },
    tcpclientresetcount: { label: 'TCP Client Resets', format: 'count', unit: 'Resets' },
    // Application Gateway
    bytesreceived: { label: 'Bytes Recibidos', format: 'bytes' },
    bytessent: { label: 'Bytes Enviados', format: 'bytes' },
    capacityunits: { label: 'Capacidad Utilizada', format: 'count', unit: 'Unidades' },
    computeunits: { label: 'Unidades de Cómputo', format: 'count', unit: 'Unidades' },
    currentconnections: { label: 'Conexiones Actuales', format: 'count', unit: 'Conexiones' },
    fixedbillablecapacityunits: { label: 'Capacidad Mínima Facturada', format: 'count', unit: 'Unidades' },
    totalrequests: { label: 'Requests Totales', format: 'count', unit: 'Requests' },
    throughput: { label: 'Throughput', format: 'bytesRate' },
};

export const getMetricDefinition = (name: string): MetricDefinition =>
    METRICS[metricKey(name)] ?? { label: name.replace(/[_-]+/g, ' '), format: 'count' };

// ---------------------------------------------------------------------------
// Acceso a valores de un recurso
// ---------------------------------------------------------------------------

/** Lee un valor por ruta ("metrics.avg_cpu_utilization", "details.vpc_id", "resource_type"). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getResourceValue = (resource: ConsumptionResource, path: string): any =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    path.split('.').reduce<any>((acc, part) => (acc == null ? undefined : acc[part]), resource);
