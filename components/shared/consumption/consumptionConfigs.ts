import type { ConsumptionViewConfig, MetricColumnDef, MetricGroupDef } from '@/components/shared/consumption/types';

const INSTANCE_LABELS = { total: 'Total Instancias', unit: 'VMs', idle: 'Instancias Idle', underutilized: 'Infrautilizadas' };
const DB_LABELS = { total: 'Total Bases de Datos', unit: 'instancias', idle: 'Bases Idle', underutilized: 'Infrautilizadas' };

const COMPUTE_RECOMMENDATIONS = {
    idle: 'Sin peaks de uso en el período. Si no es crítica, detenga o elimine la instancia para ahorrar costos de cómputo y discos.',
    underutilized: 'Uso bajo de CPU. Evalúe reducir el tamaño (right-sizing) a un tipo menor dentro de la misma familia.',
};
const DB_RECOMMENDATIONS = {
    idle: 'Base de datos sin actividad en el período. Evalúe detenerla o eliminarla si no es necesaria.',
    underutilized: 'Uso bajo de CPU y memoria. Evalúe reducir la clase/tier de la instancia.',
};
const NETWORK_RECOMMENDATIONS = {
    idle: 'Sin tráfico relevante en el período. Evalúe si el recurso sigue siendo necesario.',
    underutilized: 'Tráfico bajo para la capacidad aprovisionada. Evalúe consolidar o reducir la configuración.',
};

const CPU_COLUMN: MetricColumnDef = {
    label: 'CPU Promedio', path: 'metrics.avg_cpu_utilization', format: 'percent', bar: true,
    secondary: { label: 'Máx', path: 'metrics.max_cpu_utilization', format: 'percent' },
};
const CPU_GROUP: MetricGroupDef = {
    title: 'CPU',
    rows: [
        { label: 'Promedio', path: 'metrics.avg_cpu_utilization', format: 'percent' },
        { label: 'Máximo', path: 'metrics.max_cpu_utilization', format: 'percent' },
        { label: 'Mínimo', path: 'metrics.min_cpu_utilization', format: 'percent' },
    ],
};

const awsCompute = (resource: string, serviceName: string, resourceTypeLabel: string): ConsumptionViewConfig => ({
    cloud: 'aws',
    resource,
    serviceName,
    resourceTypeLabel,
    labels: INSTANCE_LABELS,
    metricsEndpoints: ['metrics'],
    hasEfficiency: true,
    tableColumns: [
        CPU_COLUMN,
        { label: 'Red Entrante', path: 'metrics.avg_network_in', format: 'bytesRate', secondary: { label: 'Salida', path: 'metrics.avg_network_out', format: 'bytesRate' } },
    ],
    generalFields: [
        { label: 'Tipo de compra', path: 'details.InstancePurchaseMethod' },
        { label: 'Zona de disponibilidad', path: 'details.availability_zone' },
        { label: 'VPC', path: 'details.vpc_id' },
        { label: 'IP privada', path: 'details.private_ip' },
        { label: 'IP pública', path: 'details.public_ip' },
        { label: 'Discos asociados', path: 'metrics.devices_attached_count', format: 'number' },
        { label: 'Interfaces de red en uso', path: 'metrics.interfaces_inuse_count', format: 'number' },
        { label: 'Fecha de creación', path: 'details.LaunchTime', format: 'date' },
    ],
    metricGroups: [
        CPU_GROUP,
        {
            title: 'Red',
            rows: [
                { label: 'Entrada (prom.)', path: 'metrics.avg_network_in', format: 'bytes' },
                { label: 'Entrada (máx.)', path: 'metrics.max_network_in', format: 'bytes' },
                { label: 'Salida (prom.)', path: 'metrics.avg_network_out', format: 'bytes' },
                { label: 'Salida (máx.)', path: 'metrics.max_network_out', format: 'bytes' },
            ],
        },
        {
            title: 'Créditos de CPU',
            rows: [
                { label: 'Usados (prom.)', path: 'metrics.avg_cpu_credit_usage', format: 'count' },
                { label: 'Usados (máx.)', path: 'metrics.max_cpu_credit_usage', format: 'count' },
                { label: 'Disponibles (prom.)', path: 'metrics.avg_cpu_credit_balance', format: 'count' },
                { label: 'Disponibles (máx.)', path: 'metrics.max_cpu_credit_balance', format: 'count' },
            ],
        },
    ],
    historyColumns: [
        { label: 'CPU Prom.', path: 'metrics.avg_cpu_utilization', format: 'percent' },
        { label: 'Red Entrada', path: 'metrics.avg_network_in', format: 'bytes' },
        { label: 'Red Salida', path: 'metrics.avg_network_out', format: 'bytes' },
        { label: 'Créditos Usados', path: 'metrics.avg_cpu_credit_usage', format: 'count' },
        { label: 'Créditos Disponibles', path: 'metrics.avg_cpu_credit_balance', format: 'count' },
    ],
    recommendations: COMPUTE_RECOMMENDATIONS,
    emptyText: `No encontramos métricas ni información de instancias ${serviceName} en el rango seleccionado.`,
});

export const AWS_EC2 = awsCompute('ec2', 'EC2', 'EC2 Instance');
export const AWS_ASG = awsCompute('asg', 'EC2 (Auto Scaling)', 'EC2 Instance (ASG)');
export const AWS_EKS = awsCompute('eks', 'EC2 (Nodos EKS)', 'EC2 Instance (EKS)');

export const AWS_RDS: ConsumptionViewConfig = {
    cloud: 'aws',
    resource: 'rds',
    serviceName: 'RDS',
    resourceTypeLabel: 'RDS Instance',
    labels: DB_LABELS,
    metricsEndpoints: [
        'metrics/cpu-usage', 'metrics/credits-usage', 'metrics/credits-balance', 'metrics/memory',
        'metrics/connections', 'metrics/free-storage', 'metrics/read-iops', 'metrics/write-iops',
    ],
    hasEfficiency: true,
    tableColumns: [
        CPU_COLUMN,
        { label: 'Conexiones', path: 'metrics.avg_connections', format: 'count', secondary: { label: 'Máx', path: 'metrics.max_connections', format: 'count' } },
        { label: 'Storage Usado', path: 'metrics.strg_pct_used', format: 'percent', bar: true },
    ],
    generalFields: [
        { label: 'Motor', path: 'details.engine' },
        { label: 'Versión', path: 'details.engine_version' },
        { label: 'Multi-AZ', path: 'details.multi_az' },
        { label: 'Tipo de storage', path: 'details.storage_type' },
        { label: 'Storage asignado (GB)', path: 'metrics.allocated_storage', format: 'number' },
        { label: 'Zona de disponibilidad', path: 'details.availability_zone' },
        { label: 'ARN', path: 'details.resource_arn' },
        { label: 'Fecha de creación', path: 'details.InstanceCreateTime', format: 'date' },
    ],
    metricGroups: [
        { title: 'CPU', rows: [CPU_GROUP.rows[0], CPU_GROUP.rows[1]] },
        {
            title: 'Memoria y Conexiones',
            rows: [
                { label: 'Memoria libre (prom.)', path: 'metrics.avg_memory_free', format: 'bytes' },
                { label: 'Memoria libre (máx.)', path: 'metrics.max_memory_free', format: 'bytes' },
                { label: 'Conexiones (prom.)', path: 'metrics.avg_connections', format: 'count' },
                { label: 'Conexiones (máx.)', path: 'metrics.max_connections', format: 'count' },
            ],
        },
        {
            title: 'Almacenamiento',
            rows: [
                { label: 'Libre (prom.)', path: 'metrics.avg_storage_free', format: 'bytes' },
                { label: '% usado', path: 'metrics.strg_pct_used', format: 'percent' },
                { label: '% libre', path: 'metrics.strg_pct_free', format: 'percent' },
            ],
        },
    ],
    historyColumns: [
        { label: 'CPU Prom.', path: 'metrics.avg_cpu_utilization', format: 'percent' },
        { label: 'Conexiones', path: 'metrics.avg_connections', format: 'count' },
        { label: 'Memoria libre', path: 'metrics.avg_memory_free', format: 'bytes' },
        { label: 'Storage usado', path: 'metrics.strg_pct_used', format: 'percent' },
    ],
    showStorageInefficient: true,
    recommendations: DB_RECOMMENDATIONS,
    emptyText: 'No encontramos métricas ni información de instancias RDS en el rango seleccionado.',
};

export const AWS_NAT: ConsumptionViewConfig = {
    cloud: 'aws',
    resource: 'nat-gateways',
    serviceName: 'NAT Gateway',
    resourceTypeLabel: 'NAT Gateway',
    labels: { total: 'Total NAT Gateways', unit: 'gateways', idle: 'NAT Gateways Idle', underutilized: 'Infrautilizados' },
    metricsEndpoints: ['metrics'],
    hasEfficiency: true,
    tableColumns: [
        { label: 'Conexiones Activas', path: 'metrics.avg_active_connections', format: 'count', bar: true, secondary: { label: 'Máx', path: 'metrics.max_active_connections', format: 'count' } },
        { label: 'Bytes Entrantes', path: 'metrics.avg_bytes_in', format: 'bytes', secondary: { label: 'Salida', path: 'metrics.avg_bytes_out', format: 'bytes' } },
    ],
    generalFields: [
        { label: 'Fecha de creación', path: 'details.CreateTime', format: 'date' },
    ],
    metricGroups: [
        {
            title: 'Tráfico',
            rows: [
                { label: 'Bytes entrada (prom.)', path: 'metrics.avg_bytes_in', format: 'bytes' },
                { label: 'Bytes salida (prom.)', path: 'metrics.avg_bytes_out', format: 'bytes' },
                { label: 'Conexiones activas (prom.)', path: 'metrics.avg_active_connections', format: 'count' },
                { label: 'Errores de asignación de puertos', path: 'metrics.max_error_port_allocation', format: 'count' },
            ],
        },
    ],
    historyColumns: [
        { label: 'Conexiones', path: 'metrics.avg_active_connections', format: 'count' },
        { label: 'Bytes Entrada', path: 'metrics.avg_bytes_in', format: 'bytes' },
        { label: 'Bytes Salida', path: 'metrics.avg_bytes_out', format: 'bytes' },
    ],
    recommendations: NETWORK_RECOMMENDATIONS,
    emptyText: 'No encontramos métricas ni información de NAT Gateways en el rango seleccionado.',
};

export const AWS_ELB: ConsumptionViewConfig = {
    cloud: 'aws',
    resource: 'load-balancers',
    serviceName: 'Load Balancer v2',
    resourceTypeLabel: 'Load Balancer v2',
    labels: { total: 'Total Load Balancers', unit: 'balanceadores', idle: 'Load Balancers Idle', underutilized: 'Infrautilizados' },
    metricsEndpoints: ['metrics'],
    hasEfficiency: true,
    tableColumns: [
        { label: 'LCUs Consumidos', path: 'metrics.avg_consumed_lcus', format: 'count', bar: true, secondary: { label: 'Máx', path: 'metrics.max_consumed_lcus', format: 'count' } },
        { label: 'Conexiones Activas', path: 'metrics.avg_active_connection_count', format: 'count' },
        { label: 'Datos Procesados', path: 'metrics.avg_processed_bytes', format: 'bytes' },
    ],
    generalFields: [
        { label: 'DNS', path: 'details.DNSName' },
        { label: 'Esquema', path: 'details.Scheme' },
        { label: 'VPC', path: 'details.VpcId' },
        { label: 'Tipo de IP', path: 'details.IpAddressType' },
        { label: 'Fecha de creación', path: 'details.CreatedTime', format: 'date' },
    ],
    metricGroups: [
        {
            title: 'Capacidad y Tráfico',
            rows: [
                { label: 'LCUs (prom.)', path: 'metrics.avg_consumed_lcus', format: 'count' },
                { label: 'Requests (prom.)', path: 'metrics.avg_request_count', format: 'count' },
                { label: 'Datos procesados (prom.)', path: 'metrics.avg_processed_bytes', format: 'bytes' },
                { label: 'Errores HTTP 5XX (máx.)', path: 'metrics.max_http_5xx_count', format: 'count' },
            ],
        },
        {
            title: 'Conexiones y Flujos',
            rows: [
                { label: 'Conexiones activas (prom.)', path: 'metrics.avg_active_connection_count', format: 'count' },
                { label: 'Nuevas conexiones (prom.)', path: 'metrics.avg_new_connection_count', format: 'count' },
                { label: 'Flujos activos (prom.)', path: 'metrics.avg_active_flow_count', format: 'count' },
                { label: 'TCP resets (prom.)', path: 'metrics.avg_tcp_client_reset_count', format: 'count' },
            ],
        },
    ],
    historyColumns: [
        { label: 'LCUs', path: 'metrics.avg_consumed_lcus', format: 'count' },
        { label: 'Conexiones', path: 'metrics.avg_active_connection_count', format: 'count' },
        { label: 'Datos Procesados', path: 'metrics.avg_processed_bytes', format: 'bytes' },
    ],
    recommendations: NETWORK_RECOMMENDATIONS,
    emptyText: 'No encontramos métricas ni información de Load Balancers en el rango seleccionado.',
};

const COMPUTE_TABLE: MetricColumnDef[] = [
    CPU_COLUMN,
    { label: 'Disco (IOPS lectura)', path: 'metrics.avg_disk_read_iops', format: 'count' },
    { label: 'Red Saliente', path: 'metrics.avg_network_egress_throughput', format: 'bytesRate', secondary: { label: 'Entrada', path: 'metrics.avg_network_ingress_throughput', format: 'bytesRate' } },
];
const COMPUTE_GROUPS: MetricGroupDef[] = [
    CPU_GROUP,
    {
        title: 'Disco y Red',
        rows: [
            { label: 'IOPS lectura (prom.)', path: 'metrics.avg_disk_read_iops', format: 'count' },
            { label: 'IOPS escritura (prom.)', path: 'metrics.avg_disk_write_iops', format: 'count' },
            { label: 'Red saliente (prom.)', path: 'metrics.avg_network_egress_throughput', format: 'bytesRate' },
            { label: 'Red entrante (prom.)', path: 'metrics.avg_network_ingress_throughput', format: 'bytesRate' },
        ],
    },
];

const azureCompute = (resource: string, serviceName: string, resourceTypeLabel: string): ConsumptionViewConfig => ({
    cloud: 'azure',
    resource,
    serviceName,
    resourceTypeLabel,
    labels: INSTANCE_LABELS,
    metricsEndpoints: ['metrics'],
    hasEfficiency: true,
    tableColumns: COMPUTE_TABLE,
    generalFields: [{ label: 'Resource Group', path: 'details.resource_group' }],
    metricGroups: COMPUTE_GROUPS,
    recommendations: COMPUTE_RECOMMENDATIONS,
    emptyText: `No se encontraron recursos ${serviceName} ni métricas en el rango seleccionado.`,
});

export const AZURE_VM = azureCompute('vm', 'Virtual Machines', 'Azure VM');
export const AZURE_NODES = azureCompute('nodes', 'Nodos AKS', 'AKS Node');

const DB_TABLE: MetricColumnDef[] = [
    CPU_COLUMN,
    { label: 'Memoria', path: 'metrics.avg_memory_utilization', format: 'percent', bar: true },
    { label: 'Storage Usado', path: 'metrics.storage_utilization_pct', format: 'percent', bar: true },
];
const DB_GROUPS: MetricGroupDef[] = [
    { title: 'CPU', rows: [CPU_GROUP.rows[0], CPU_GROUP.rows[1]] },
    {
        title: 'Memoria y Conexiones',
        rows: [
            { label: 'Memoria (prom.)', path: 'metrics.avg_memory_utilization', format: 'percent' },
            { label: 'Memoria (máx.)', path: 'metrics.max_memory_utilization', format: 'percent' },
            { label: 'Conexiones (prom.)', path: 'metrics.avg_connections', format: 'count' },
            { label: 'Conexiones (máx.)', path: 'metrics.max_connections', format: 'count' },
        ],
    },
    {
        title: 'Almacenamiento',
        rows: [
            { label: 'Usado', path: 'metrics.avg_storage_used_gb', format: 'gb' },
            { label: 'Total', path: 'metrics.avg_storage_total_gb', format: 'gb' },
            { label: '% usado', path: 'metrics.storage_utilization_pct', format: 'percent' },
        ],
    },
];

export const AZURE_DB: ConsumptionViewConfig = {
    cloud: 'azure',
    resource: 'db',
    serviceName: 'Azure Database',
    resourceTypeLabel: 'Azure Database',
    labels: DB_LABELS,
    metricsEndpoints: ['metrics/cpu-usage', 'metrics/storage', 'metrics/memory'],
    hasEfficiency: true,
    tableColumns: DB_TABLE,
    generalFields: [{ label: 'Resource Group', path: 'details.resource_group' }],
    metricGroups: DB_GROUPS,
    showStorageInefficient: true,
    recommendations: DB_RECOMMENDATIONS,
    emptyText: 'No se encontraron recursos de Azure Database para los filtros seleccionados.',
};

export const AZURE_APP_GATEWAY: ConsumptionViewConfig = {
    cloud: 'azure',
    resource: 'app-gateways',
    serviceName: 'Application Gateway',
    resourceTypeLabel: 'Application Gateway',
    labels: { total: 'Total Application Gateways', unit: 'gateways', idle: 'Gateways Idle', underutilized: 'Infrautilizados' },
    metricsEndpoints: ['metrics'],
    hasEfficiency: false,
    tableColumns: [
        { label: 'Eficiencia', path: 'metrics.efficiency_percentage', format: 'percent', bar: true },
        { label: 'Capacidad Desperdiciada', path: 'metrics.wasted_capacity', format: 'count' },
        { label: 'Requests', path: 'metrics.total_requests', format: 'count' },
        { label: 'Conexiones (prom.)', path: 'metrics.avg_current_connections', format: 'count' },
    ],
    generalFields: [],
    metricGroups: [
        {
            title: 'Uso',
            rows: [
                { label: 'Eficiencia', path: 'metrics.efficiency_percentage', format: 'percent' },
                { label: 'Capacidad desperdiciada', path: 'metrics.wasted_capacity', format: 'count', unit: 'unidades' },
                { label: 'Requests totales', path: 'metrics.total_requests', format: 'count' },
                { label: 'Conexiones actuales (prom.)', path: 'metrics.avg_current_connections', format: 'count' },
            ],
        },
    ],
    recommendations: NETWORK_RECOMMENDATIONS,
    emptyText: 'No se encontraron métricas del Application Gateway seleccionado.',
};

const gcpCompute = (resource: string, serviceName: string, resourceTypeLabel: string): ConsumptionViewConfig => ({
    cloud: 'gcp',
    resource,
    serviceName,
    resourceTypeLabel,
    labels: INSTANCE_LABELS,
    metricsEndpoints: ['metrics'],
    hasEfficiency: true,
    tableColumns: COMPUTE_TABLE,
    generalFields: [{ label: 'Fecha de creación', path: 'details.creationTimestamp', format: 'date' }],
    metricGroups: COMPUTE_GROUPS,
    recommendations: COMPUTE_RECOMMENDATIONS,
    emptyText: `No se encontraron instancias ${serviceName} para los filtros seleccionados.`,
});

export const GCP_COMPUTE_ENGINE = gcpCompute('compute-engine', 'Compute Engine', 'Compute Engine');
export const GCP_INSTANCE_GROUPS = gcpCompute('instance-groups', 'Instance Groups', 'Instance Group VM');
export const GCP_GKE = gcpCompute('gke', 'Clusters GKE', 'GKE Node');

export const GCP_CLOUD_SQL: ConsumptionViewConfig = {
    cloud: 'gcp',
    resource: 'cloud-sql',
    serviceName: 'Cloud SQL',
    resourceTypeLabel: 'Cloud SQL',
    labels: DB_LABELS,
    metricsEndpoints: ['metrics/cpu-usage', 'metrics/connections', 'metrics/storage', 'metrics/memory'],
    hasEfficiency: true,
    tableColumns: DB_TABLE,
    generalFields: [
        { label: 'Versión', path: 'details.databaseVersion' },
        { label: 'Motor', path: 'details.db_type' },
        { label: 'Zona', path: 'details.zone' },
        { label: 'Tipo de instancia', path: 'details.instance_type' },
        { label: 'Fecha de creación', path: 'details.createTime', format: 'date' },
    ],
    metricGroups: DB_GROUPS,
    showStorageInefficient: true,
    recommendations: DB_RECOMMENDATIONS,
    emptyText: 'No se encontraron instancias Cloud SQL para los filtros seleccionados.',
};

export const GCP_FILESTORE: ConsumptionViewConfig = {
    cloud: 'gcp',
    resource: 'filestore',
    serviceName: 'Filestore',
    resourceTypeLabel: 'Filestore',
    labels: { total: 'Total Instancias', unit: 'filestores', idle: 'Instancias Idle', underutilized: 'Infrautilizadas' },
    metricsEndpoints: [],
    hasEfficiency: false,
    tableColumns: [
        { label: 'Uso', path: 'metrics.usage_percentage', format: 'percent', bar: true },
        { label: 'Capacidad Usada', path: 'metrics.used_capacity_gb', format: 'gb', secondary: { label: 'Total', path: 'metrics.total_capacity_gb', format: 'gb' } },
    ],
    generalFields: [],
    metricGroups: [
        {
            title: 'Capacidad',
            rows: [
                { label: 'Total', path: 'metrics.total_capacity_gb', format: 'gb' },
                { label: 'Usada', path: 'metrics.used_capacity_gb', format: 'gb' },
                { label: '% uso', path: 'metrics.usage_percentage', format: 'percent' },
            ],
        },
    ],
    recommendations: {
        idle: 'Sin operaciones de lectura/escritura en el período. Evalúe si la instancia sigue siendo necesaria.',
        underutilized: 'Menos del 10% de la capacidad en uso. Evalúe reducir la capacidad o cambiar de tier.',
    },
    emptyText: 'No se encontraron instancias de Filestore para los filtros seleccionados.',
};
