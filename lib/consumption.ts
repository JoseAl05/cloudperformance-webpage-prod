import type { ConsumptionCloud, ConsumptionResource } from '@/interfaces/consumption';

export type ConsumptionAction = string;
export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export const toApiDate = (date: Date): string => date.toISOString().slice(0, 19);

export const toQueryString = (params: QueryParams): string => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && value !== false) {
            query.append(key, String(value));
        }
    });
    return query.toString();
};

export const consumptionUrl = (
    cloud: ConsumptionCloud,
    resource: string,
    action: ConsumptionAction,
    params: QueryParams
): string => `/api/${cloud}/bridge/${cloud}/consumption/${resource}/${action}?${toQueryString(params)}`;

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

export const formatByUnit = (value: number | null | undefined, unidad = '%'): string => {
    if (unidad === '%') return formatValue(value, 'percent');
    if (unidad === 'bytes') return formatValue(value, 'bytes');
    if (unidad === 'GB') return formatValue(value, 'gb');
    return formatValue(value, 'count', unidad);
};

export const formatDateTime = (iso: string | null | undefined): string =>
    iso ? new Date(iso).toLocaleString('es-CL', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

export interface MetricDefinition {
    label: string;
    format: ValueFormat;
    unit?: string;
}

export const metricKey = (name: string): string => name.toLowerCase().replace(/[^a-z0-9]/g, '');

const METRICS: Record<string, MetricDefinition> = {
    cpuutilization: { label: 'Uso de CPU', format: 'percent' },
    percentagecpu: { label: 'Uso de CPU', format: 'percent' },
    cpucreditbalance: { label: 'Créditos de CPU Disponibles', format: 'count', unit: 'Créditos' },
    cpucreditusage: { label: 'Créditos de CPU Usados', format: 'count', unit: 'Créditos' },
    statuscheckfailed: { label: 'Check de Estado Fallido', format: 'count', unit: 'Fallos' },
    availablememory: { label: 'Memoria Disponible', format: 'bytes' },
    availablememorybytes: { label: 'Memoria Disponible', format: 'bytes' },
    freeablememory: { label: 'Memoria Disponible', format: 'bytes' },
    memoryutilization: { label: 'Uso de Memoria', format: 'percent' },
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
    networkin: { label: 'Red: Tráfico Entrante', format: 'bytesRate' },
    networkout: { label: 'Red: Tráfico Saliente', format: 'bytesRate' },
    networkegressthroughput: { label: 'Red: Tráfico Saliente', format: 'bytesRate' },
    networkingressthroughput: { label: 'Red: Tráfico Entrante', format: 'bytesRate' },
    networkegresspps: { label: 'Red: Paquetes Salientes', format: 'count', unit: 'pps' },
    networkingresspps: { label: 'Red: Paquetes Entrantes', format: 'count', unit: 'pps' },
    connections: { label: 'Conexiones', format: 'count', unit: 'Conexiones' },
    databaseconnections: { label: 'Conexiones a la Base de Datos', format: 'count', unit: 'Conexiones' },
    activeconnectioncount: { label: 'Conexiones Activas', format: 'count', unit: 'Conexiones' },
    bytesinfromsource: { label: 'Datos Enviados a Internet', format: 'bytesRate' },
    bytesouttodestination: { label: 'Datos Entregados al Destino', format: 'bytesRate' },
    errorportallocation: { label: 'Error de asignación de puertos', format: 'count', unit: 'Errores' },
    activeflowcount: { label: 'Flujos Activos', format: 'count', unit: 'Flujos' },
    consumedlcus: { label: 'LCUs Consumidos', format: 'count', unit: 'LCUs' },
    httpcodetarget5xxcount: { label: 'Errores HTTP 5XX (Target)', format: 'count', unit: 'Errores' },
    newconnectioncount: { label: 'Nuevas Conexiones', format: 'count', unit: 'Conexiones' },
    newflowcount: { label: 'Nuevos Flujos', format: 'count', unit: 'Flujos' },
    processedbytes: { label: 'Datos Procesados', format: 'bytesRate' },
    requestcount: { label: 'Requests', format: 'count', unit: 'Requests' },
    ruleevaluations: { label: 'Evaluaciones de Reglas', format: 'count', unit: 'Evaluaciones' },
    tcpclientresetcount: { label: 'TCP Client Resets', format: 'count', unit: 'Resets' },
    bytesreceived: { label: 'Bytes Recibidos', format: 'bytes' },
    bytessent: { label: 'Bytes Enviados', format: 'bytes' },
    capacityunits: { label: 'Capacidad Utilizada', format: 'count', unit: 'Unidades' },
    computeunits: { label: 'Unidades de Cómputo', format: 'count', unit: 'Unidades' },
    currentconnections: { label: 'Conexiones Actuales', format: 'count', unit: 'Conexiones' },
    fixedbillablecapacityunits: { label: 'Capacidad Mínima Facturada', format: 'count', unit: 'Unidades' },
    totalrequests: { label: 'Requests Totales', format: 'count', unit: 'Requests' },
    throughput: { label: 'Throughput', format: 'bytesRate' },
    serverlessdatabasecapacity: { label: 'Capacidad Serverless', format: 'count', unit: 'ACUs' },
    activeconnections: { label: 'Conexiones Activas', format: 'count', unit: 'Conexiones' },
    dbqueriessec: { label: 'Consultas por Segundo', format: 'count', unit: 'consultas/s' },
    dbtransactionssec: { label: 'Transacciones por Segundo', format: 'count', unit: 'transacciones/s' },
    memoryusedgb: { label: 'Memoria Usada', format: 'gb' },
    memorypercent: { label: 'Uso de Memoria', format: 'percent' },
    storagepercent: { label: 'Uso de Almacenamiento', format: 'percent' },
    storageused: { label: 'Almacenamiento Usado', format: 'gb' },
    backupstorageused: { label: 'Almacenamiento de Backup Usado', format: 'gb' },
    serverlogstorageused: { label: 'Almacenamiento de Logs Usado', format: 'gb' },
    serverlogstoragepercent: { label: 'Uso de Almacenamiento de Logs', format: 'percent' },
    usedbytes: { label: 'Capacidad Usada', format: 'bytes' },
    freebytes: { label: 'Capacidad Libre', format: 'bytes' },
    readbytescount: { label: 'Bytes Leídos', format: 'bytes' },
    writebytescount: { label: 'Bytes Escritos', format: 'bytes' },
    readopscount: { label: 'Operaciones de Lectura', format: 'count', unit: 'Operaciones' },
    writeopscount: { label: 'Operaciones de Escritura', format: 'count', unit: 'Operaciones' },
    uptimesec: { label: 'Tiempo Activo', format: 'count', unit: 's' },
    volumeidletime: { label: 'Tiempo Inactivo', format: 'count', unit: 's' },
    volumereadops: { label: 'Operaciones de Lectura', format: 'count', unit: 'Ops' },
    volumewriteops: { label: 'Operaciones de Escritura', format: 'count', unit: 'Ops' },
    volumereadbytes: { label: 'Bytes Leídos', format: 'bytes' },
    volumewritebytes: { label: 'Bytes Escritos', format: 'bytes' },
    volumequeuelength: { label: 'Cola de Operaciones', format: 'count', unit: 'Ops' },
    volumethroughputpercentage: { label: 'Throughput Usado', format: 'percent' },
    volumeconsumedreadwriteops: { label: 'Operaciones Consumidas', format: 'count', unit: 'Ops' },
    burstbalance: { label: 'Burst Balance', format: 'percent' },
    cpucreditsremaining: { label: 'Créditos de CPU Disponibles', format: 'count', unit: 'Créditos' },
    cpucreditsconsumed: { label: 'Créditos de CPU Usados', format: 'count', unit: 'Créditos' },
    queriesbyendpointreturned: { label: 'Consultas Respondidas', format: 'count', unit: 'Consultas' },
    usagepercentage: { label: 'Uso de Capacidad', format: 'percent' },
    iopstotal: { label: 'IOPS Totales', format: 'count', unit: 'IOPS' },
    bytestotal: { label: 'Bytes Transferidos', format: 'bytes' },
};

const STAT_SUFFIX = /[\s_-]*(average|avg)$/i;

export const getMetricDefinition = (name: string): MetricDefinition =>
    METRICS[metricKey(name)]
    ?? METRICS[metricKey(name.replace(STAT_SUFFIX, ''))]
    ?? { label: name.replace(STAT_SUFFIX, '').replace(/[_-]+/g, ' '), format: 'count' };

export const getPathValue = (source: unknown, path: string): unknown =>
    path.split('.').reduce<unknown>(
        (acc, part) => (acc !== null && typeof acc === 'object' ? (acc as Record<string, unknown>)[part] : undefined),
        source
    );

export const getResourceValue = (resource: ConsumptionResource, path: string): unknown => getPathValue(resource, path);

export const toNumberOrNull = (value: unknown): number | null => {
    if (value === null || value === undefined || value === '') return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
};
