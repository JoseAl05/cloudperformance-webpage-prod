import type { MetricDefinition } from '@/lib/consumption';
import type { MetricGroup } from '@/lib/unused';
import type { UnusedResource } from '@/interfaces/unused';
import type { ResourceLink, ResourceLinkContext } from '@/components/shared/working-hours/types';
import type { AttributeDef, UnusedViewConfig } from '@/components/shared/unused/types';

const awsEc2Link = (r: UnusedResource, { param }: ResourceLinkContext): ResourceLink => ({
    pathname: '/cloud-aws/recursos/instancias-ec2',
    query: { startDate: param('startDate'), endDate: param('endDate'), instance: r.resource_id, region: r.region ?? param('region') },
});

const gcpComputeLink = (r: UnusedResource, { param }: ResourceLinkContext): ResourceLink => ({
    pathname: '/cloud-gcp/recursos/compute-engine',
    query: { startDate: param('startDate'), endDate: param('endDate'), resourceId: r.resource_id, projects: param('projects'), regions: param('regions') },
});

const azureVmLink = (r: UnusedResource, { param }: ResourceLinkContext): ResourceLink => {
    const scope = /\/subscriptions\/([^/]+)\/resourceGroups\/([^/]+)/i.exec(r.resource_id);
    return {
        pathname: '/cloud-azure/recursos/vm',
        query: {
            startDate: param('startDate'),
            endDate: param('endDate'),
            subscription: scope?.[1] ?? r.scope ?? param('subscription'),
            region: param('region'),
            resourceGroup: scope?.[2] ?? param('resourceGroup'),
            instanceV2: r.resource_name,
        },
    };
};

const AWS_EC2_METRICS: MetricGroup[] = [
    { label: 'CPU', metrics: ['CPUUtilization Average'] },
    { label: 'Red (In + Out)', metrics: ['NetworkIn Average', 'NetworkOut Average'] },
    { label: 'Créditos de CPU Usados', metrics: ['CPUCreditUsage Average'] },
    { label: 'Créditos de CPU Disponibles', metrics: ['CPUCreditBalance Average'] },
    { label: 'Status Check Fallido', metrics: ['StatusCheckFailed Average'] },
];

const AWS_EC2_CARDS: MetricGroup[] = [
    { label: 'CPU Promedio Global', metrics: ['CPUUtilization Average'] },
    { label: 'Status Check Fallido', metrics: ['StatusCheckFailed Average'] },
    { label: 'Créditos de CPU Usados', metrics: ['CPUCreditUsage Average'] },
    { label: 'Créditos de CPU Disponibles', metrics: ['CPUCreditBalance Average'] },
    { label: 'Red Entrante', metrics: ['NetworkIn Average'] },
    { label: 'Red Saliente', metrics: ['NetworkOut Average'] },
];

const GCP_COMPUTE_METRICS: MetricGroup[] = [
    { label: 'CPU', metrics: ['cpu_utilization'] },
    { label: 'Red (I/O) Paquetes', metrics: ['network_ingress_pps', 'network_egress_pps'] },
    { label: 'Red (I/O) Throughput', metrics: ['network_ingress_throughput', 'network_egress_throughput'] },
    { label: 'Disco (I/O) IOPS', metrics: ['disk_read_iops', 'disk_write_iops'] },
    { label: 'Disco (I/O) Throughput', metrics: ['disk_read_throughput', 'disk_write_throughput'] },
];

const GCP_COMPUTE_CARDS: MetricGroup[] = [
    { label: 'CPU Promedio Global', metrics: ['cpu_utilization'] },
    { label: 'Red (I/O) Paquetes', metrics: ['network_ingress_pps', 'network_egress_pps'] },
    { label: 'Red (I/O) Throughput', metrics: ['network_ingress_throughput', 'network_egress_throughput'] },
    { label: 'Disco (I/O) IOPS', metrics: ['disk_read_iops', 'disk_write_iops'] },
    { label: 'Disco (I/O) Throughput', metrics: ['disk_read_throughput', 'disk_write_throughput'] },
];

const AZURE_OVERRIDES: Record<string, MetricDefinition> = {
    availablememory: { label: 'Memoria Disponible', format: 'bytes' },
    availablememorybytes: { label: 'Memoria Disponible', format: 'bytes' },
};

const AZURE_ATTRIBUTES: AttributeDef[] = [
    { key: 'cpu_total', label: 'vCPUs', format: 'count', unit: 'vCores', total: true },
    { key: 'memory_total_gb', label: 'Memoria', format: 'gb', total: true },
    { key: 'disks_count', label: 'Discos', format: 'count' },
    { key: 'disks_size_gb', label: 'Tamaño de discos', format: 'gb', total: true },
    { key: 'public_ips', label: 'IPs públicas', format: 'count', total: true },
];

const CPU_RULE = 'CPU promedio < 10% = infrautilizado; < 30% = bajo uso.';

const awsEc2Base = {
    cloud: 'aws' as const,
    resourceTypeLabel: 'EC2 Instance',
    cardMetrics: AWS_EC2_CARDS,
    tableMetrics: AWS_EC2_METRICS,
    diagnosisRule: CPU_RULE,
    resourceLink: awsEc2Link,
};

export const AWS_EC2_UNUSED: UnusedViewConfig = {
    ...awsEc2Base,
    resource: 'ec2',
    serviceName: 'instancias EC2',
    emptyText: 'No encontramos instancias EC2 infrautilizadas en el rango seleccionado.',
};

export const AWS_ASG_UNUSED: UnusedViewConfig = {
    ...awsEc2Base,
    resource: 'asg',
    serviceName: 'instancias de Auto Scaling Groups',
    emptyText: 'No encontramos instancias infrautilizadas en los Auto Scaling Groups seleccionados.',
};

export const AWS_EKS_UNUSED: UnusedViewConfig = {
    ...awsEc2Base,
    resource: 'eks',
    serviceName: 'nodos EKS',
    emptyText: 'No encontramos nodos infrautilizados en los clusters EKS seleccionados.',
};

export const AWS_EBS_UNUSED: UnusedViewConfig = {
    cloud: 'aws',
    resource: 'ebs',
    serviceName: 'volúmenes EBS',
    resourceTypeLabel: 'EBS Volume',
    cardMetrics: [
        { label: 'Tiempo Inactivo', metrics: ['VolumeIdleTime Average'] },
        { label: 'Operaciones de Lectura', metrics: ['VolumeReadOps Average'] },
        { label: 'Operaciones de Escritura', metrics: ['VolumeWriteOps Average'] },
        { label: 'Bytes Leídos', metrics: ['VolumeReadBytes Average'] },
        { label: 'Bytes Escritos', metrics: ['VolumeWriteBytes Average'] },
        { label: 'Burst Balance', metrics: ['BurstBalance Average'] },
        { label: 'Cola de Operaciones', metrics: ['VolumeQueueLength Average'] },
    ],
    tableMetrics: [
        { label: 'Tiempo Inactivo', metrics: ['VolumeIdleTime Average'] },
        { label: 'Operaciones (R/W)', metrics: ['VolumeReadOps Average', 'VolumeWriteOps Average'] },
        { label: 'Bytes (R/W)', metrics: ['VolumeReadBytes Average', 'VolumeWriteBytes Average'] },
        { label: 'Burst Balance', metrics: ['BurstBalance Average'] },
        { label: 'Cola de Operaciones', metrics: ['VolumeQueueLength Average'] },
    ],
    attributes: [
        { key: 'size_gb', label: 'Tamaño', format: 'gb', total: true },
        { key: 'iops', label: 'IOPS aprovisionadas', format: 'count', unit: 'IOPS' },
        { key: 'throughput', label: 'Throughput aprovisionado', format: 'count', unit: 'MiB/s' },
        { key: 'encrypted', label: 'Cifrado', format: 'boolean' },
    ],
    diagnosisRule: 'Tiempo inactivo promedio > 50 s/min = infrautilizado; > 30 s/min = bajo uso.',
    emptyText: 'No encontramos volúmenes EBS no utilizados en el rango seleccionado.',
};

const azureBase = {
    cloud: 'azure' as const,
    cardMetrics: [
        { label: 'CPU Promedio', metrics: ['Percentage CPU'] },
        { label: 'Memoria Disponible', metrics: ['Available Memory'] },
        { label: 'Disco (IOPS)', metrics: ['Disks IOPS'] },
    ],
    tableMetrics: [
        { label: 'CPU', metrics: ['Percentage CPU'] },
        { label: 'Memoria Disponible', metrics: ['Available Memory'] },
        { label: 'Disco (IOPS)', metrics: ['Disks IOPS'] },
    ],
    attributes: AZURE_ATTRIBUTES,
    hasSeries: true,
    metricOverrides: AZURE_OVERRIDES,
    diagnosisRule: 'CPU y memoria bajo el umbral = infrautilizada; solo una de ellas = bajo uso.',
};

export const AZURE_VM_UNUSED: UnusedViewConfig = {
    ...azureBase,
    resource: 'vm',
    serviceName: 'VMs',
    resourceTypeLabel: 'Virtual Machine',
    tableMetrics: [...azureBase.tableMetrics, { label: 'Créditos de CPU Disponibles', metrics: ['CPU Credits Remaining'] }],
    resourceLink: azureVmLink,
    emptyText: 'No encontramos VMs infrautilizadas en el rango seleccionado.',
};

export const AZURE_VMSS_UNUSED: UnusedViewConfig = {
    ...azureBase,
    resource: 'vmss',
    serviceName: 'VMSS',
    resourceTypeLabel: 'Virtual Machine Scale Set',
    emptyText: 'No encontramos VMSS infrautilizadas en el rango seleccionado.',
};

const gcpBase = {
    cloud: 'gcp' as const,
    cardMetrics: GCP_COMPUTE_CARDS,
    tableMetrics: GCP_COMPUTE_METRICS,
    diagnosisRule: CPU_RULE,
    resourceLink: gcpComputeLink,
};

export const GCP_COMPUTE_ENGINE_UNUSED: UnusedViewConfig = {
    ...gcpBase,
    resource: 'compute-engine',
    serviceName: 'instancias Compute Engine',
    resourceTypeLabel: 'Compute Engine',
    emptyText: 'No encontramos instancias infrautilizadas en el rango seleccionado.',
};

export const GCP_INSTANCE_GROUPS_UNUSED: UnusedViewConfig = {
    ...gcpBase,
    resource: 'instance-groups',
    serviceName: 'instancias de Instance Groups',
    resourceTypeLabel: 'Instancia de Instance Group',
    emptyText: 'No encontramos instancias infrautilizadas en los Instance Groups seleccionados.',
};

export const GCP_GKE_UNUSED: UnusedViewConfig = {
    ...gcpBase,
    resource: 'gke',
    serviceName: 'nodos GKE',
    resourceTypeLabel: 'Nodo GKE',
    emptyText: 'No encontramos nodos infrautilizados en los clusters GKE seleccionados.',
};

export const AWS_NAT_GATEWAYS_UNUSED: UnusedViewConfig = {
    cloud: 'aws',
    resource: 'nat-gateways',
    serviceName: 'NAT Gateways',
    resourceTypeLabel: 'NAT Gateway',
    cardMetrics: [
        { label: 'Conexiones Activas Promedio', metrics: ['ActiveConnectionCount Average'] },
        { label: 'Datos Enviados al Destino', metrics: ['BytesOutToDestination Average'] },
        { label: 'Datos Recibidos desde el Origen', metrics: ['BytesInFromSource Average'] },
    ],
    tableMetrics: [
        { label: 'Conexiones', metrics: ['ActiveConnectionCount Average'] },
        { label: 'Tráfico (In + Out)', metrics: ['BytesInFromSource Average', 'BytesOutToDestination Average'] },
    ],
    attributes: [
        { key: 'vpc_id', label: 'VPC', format: 'text' },
        { key: 'subnet_id', label: 'Subred', format: 'text' },
        { key: 'public_ip', label: 'IP pública', format: 'text' },
        { key: 'private_ip', label: 'IP privada', format: 'text' },
    ],
    summaryFromResources: true,
    hasAssociated: true,
    diagnosisRule: 'Conexiones activas prom. < 5 y tráfico de entrada < 10 MB = infrautilizado.',
    emptyText: 'No encontramos NAT Gateways sin uso en el rango seleccionado.',
};

export const AWS_LOAD_BALANCERS_UNUSED: UnusedViewConfig = {
    cloud: 'aws',
    resource: 'load-balancers',
    serviceName: 'Load Balancers',
    resourceTypeLabel: 'Elastic Load Balancer v2',
    cardMetrics: [
        { label: 'Requests Promedio', metrics: ['RequestCount Average'] },
        { label: 'Conexiones Activas', metrics: ['ActiveConnectionCount Average'] },
        { label: 'Flujos Nuevos', metrics: ['NewFlowCount Average'] },
        { label: 'Flujos Activos', metrics: ['ActiveFlowCount Average'] },
        { label: 'Consumo LCU', metrics: ['ConsumedLCUs Average'] },
    ],
    tableMetrics: [
        { label: 'Requests', metrics: ['RequestCount Average'] },
        { label: 'Conexiones', metrics: ['ActiveConnectionCount Average'] },
        { label: 'Flujos (Nuevos + Activos)', metrics: ['NewFlowCount Average', 'ActiveFlowCount Average'] },
        { label: 'LCUs', metrics: ['ConsumedLCUs Average'] },
    ],
    attributes: [
        { key: 'elb_type', label: 'Tipo', format: 'text' },
        { key: 'dns_name', label: 'DNS', format: 'text' },
        { key: 'vpc_id', label: 'VPC', format: 'text' },
        { key: 'availability_zones', label: 'Zonas de disponibilidad', format: 'text' },
    ],
    breakdowns: [{ key: 'elb_type', label: 'Por tipo de balanceador' }],
    summaryFromResources: true,
    hasAssociated: true,
    diagnosisRule: 'ALB: requests < 100, conexiones activas < 1 y LCUs < 0.5. NLB: flujos nuevos < 100 y flujos activos < 1.',
    emptyText: 'No encontramos Load Balancers sin uso en el rango seleccionado.',
};

const R53_ATTRIBUTES: AttributeDef[] = [
    { key: 'record_count', label: 'Registros', format: 'count' },
    { key: 'record_types', label: 'Tipos de registro', format: 'text' },
];

export const AWS_ROUTE53_UNUSED: UnusedViewConfig = {
    cloud: 'aws',
    resource: 'route53',
    serviceName: 'hosted zones',
    resourceTypeLabel: 'Route 53 Hosted Zone',
    cardMetrics: [],
    tableMetrics: [],
    attributes: R53_ATTRIBUTES,
    tableAttributes: R53_ATTRIBUTES,
    summaryFromResources: true,
    diagnosisRule: 'Zona que solo tiene los registros NS / SOA que crea AWS = sin uso.',
    emptyText: 'No encontramos hosted zones sin uso en el rango seleccionado.',
};

const AZURE_LB_ATTRIBUTES: AttributeDef[] = [
    { key: 'sku', label: 'SKU', format: 'text' },
    { key: 'backend_instance_count', label: 'Instancias en backend', format: 'count' },
    { key: 'lb_rule_count', label: 'Reglas de balanceo', format: 'count' },
    { key: 'nat_rule_count', label: 'Reglas NAT', format: 'count' },
];

export const AZURE_LOAD_BALANCERS_UNUSED: UnusedViewConfig = {
    cloud: 'azure',
    resource: 'load-balancers',
    serviceName: 'Load Balancers',
    resourceTypeLabel: 'Azure Load Balancer',
    cardMetrics: [],
    tableMetrics: [],
    attributes: AZURE_LB_ATTRIBUTES,
    tableAttributes: AZURE_LB_ATTRIBUTES,
    breakdowns: [{ key: 'sku', label: 'Por SKU' }],
    summaryFromResources: true,
    diagnosisRule: 'Sin instancias en el backend pool o sin reglas de balanceo / NAT = sin uso.',
    emptyText: 'No encontramos load balancers infrautilizados en el rango seleccionado.',
};

const AZURE_APPGW_ATTRIBUTES: AttributeDef[] = [
    { key: 'sku', label: 'SKU', format: 'text' },
    { key: 'waf_mode', label: 'Modo WAF', format: 'text' },
    { key: 'backend_instance_count', label: 'Instancias en backend', format: 'count' },
    { key: 'min_capacity', label: 'Capacidad mínima', format: 'count' },
    { key: 'max_capacity', label: 'Capacidad máxima', format: 'count' },
];

export const AZURE_APP_GATEWAYS_UNUSED: UnusedViewConfig = {
    cloud: 'azure',
    resource: 'app-gateways',
    serviceName: 'Application Gateways',
    resourceTypeLabel: 'Application Gateway',
    cardMetrics: [
        { label: 'CPU Promedio', metrics: ['Cpu Utilization'] },
        { label: 'Conexiones Actuales', metrics: ['Current Connections'] },
        { label: 'Requests Totales', metrics: ['Total Requests'] },
        { label: 'Capacidad Utilizada', metrics: ['Capacity Units'] },
    ],
    tableMetrics: [
        { label: 'CPU', metrics: ['Cpu Utilization'] },
        { label: 'Conexiones', metrics: ['Current Connections'] },
        { label: 'Requests', metrics: ['Total Requests'] },
    ],
    attributes: AZURE_APPGW_ATTRIBUTES,
    tableAttributes: AZURE_APPGW_ATTRIBUTES.slice(0, 3),
    breakdowns: [{ key: 'sku', label: 'Por SKU' }, { key: 'waf_mode', label: 'Por modo WAF' }],
    summaryFromResources: true,
    hasSeries: true,
    diagnosisRule: 'Backend pool vacío = sin uso. SKU v1 (legacy), capacidad mínima > 2 o WAF solo en detección = optimizable.',
    emptyText: 'No encontramos Application Gateways infrautilizados en el rango seleccionado.',
};

const AZURE_TM_ATTRIBUTES: AttributeDef[] = [
    { key: 'profile_status', label: 'Estado del perfil', format: 'text' },
    { key: 'monitor_status', label: 'Estado del monitor', format: 'text' },
    { key: 'traffic_view', label: 'Traffic View', format: 'text' },
    { key: 'routing_method', label: 'Método de enrutamiento', format: 'text' },
];

export const AZURE_TRAFFIC_MANAGERS_UNUSED: UnusedViewConfig = {
    cloud: 'azure',
    resource: 'traffic-managers',
    serviceName: 'Traffic Managers',
    resourceTypeLabel: 'Traffic Manager',
    cardMetrics: [{ label: 'Consultas Respondidas', metrics: ['Queries by Endpoint Returned'] }],
    tableMetrics: [{ label: 'Consultas', metrics: ['Queries by Endpoint Returned'] }],
    attributes: AZURE_TM_ATTRIBUTES,
    tableAttributes: AZURE_TM_ATTRIBUTES.slice(0, 3),
    breakdowns: [{ key: 'traffic_view', label: 'Por Traffic View' }, { key: 'monitor_status', label: 'Por estado del monitor' }],
    summaryFromResources: true,
    hasSeries: true,
    diagnosisRule: 'Perfil sin endpoints configurados = sin uso.',
    emptyText: 'No encontramos Traffic Managers infrautilizados en el rango seleccionado.',
};

const AZURE_EXTENSION_ATTRIBUTES: AttributeDef[] = [
    { key: 'vm_name', label: 'VM', format: 'text' },
    { key: 'publisher', label: 'Publicador', format: 'text' },
    { key: 'version', label: 'Versión', format: 'text' },
    { key: 'auto_upgrade', label: 'Actualización automática', format: 'boolean' },
];

export const AZURE_VM_EXTENSIONS_UNUSED: UnusedViewConfig = {
    cloud: 'azure',
    resource: 'vm-extensions',
    serviceName: 'extensiones',
    resourceTypeLabel: 'Extensión de VM',
    cardMetrics: [],
    tableMetrics: [],
    attributes: AZURE_EXTENSION_ATTRIBUTES,
    tableAttributes: AZURE_EXTENSION_ATTRIBUTES,
    breakdowns: [{ key: 'resource_type', label: 'Por tipo de extensión' }, { key: 'status', label: 'Por estado' }],
    summaryFromResources: true,
    groupByAttribute: 'vm_name',
    diagnosisRule: 'Extensión aprovisionada (Succeeded) = operativa; cualquier otro estado = no operativa.',
    emptyText: 'No encontramos extensiones en las VMs seleccionadas.',
};

export const GCP_PERSISTENT_DISKS_UNUSED: UnusedViewConfig = {
    cloud: 'gcp',
    resource: 'persistent-disks',
    serviceName: 'discos persistentes',
    resourceTypeLabel: 'Persistent Disk',
    cardMetrics: [],
    tableMetrics: [],
    attributes: [
        { key: 'size_gb', label: 'Tamaño', format: 'gb', total: true },
        { key: 'users', label: 'VMs asociadas', format: 'count' },
        { key: 'created', label: 'Creado', format: 'date' },
        { key: 'last_attach', label: 'Última conexión', format: 'date' },
        { key: 'last_detach', label: 'Última desconexión', format: 'date' },
    ],
    tableAttributes: [
        { key: 'size_gb', label: 'Tamaño', format: 'gb' },
        { key: 'last_detach', label: 'Última desconexión', format: 'date' },
    ],
    breakdowns: [{ key: 'resource_type', label: 'Por tipo de disco' }, { key: 'region', label: 'Por zona' }],
    summaryFromResources: true,
    diagnosisRule: 'Disco sin VMs asociadas = sin uso.',
    emptyText: 'No encontramos discos persistentes sin uso en el rango seleccionado.',
};

export const GCP_FILESTORE_UNUSED: UnusedViewConfig = {
    cloud: 'gcp',
    resource: 'filestore',
    serviceName: 'instancias Filestore',
    resourceTypeLabel: 'Filestore',
    cardMetrics: [
        { label: 'Almacenamiento Usado', metrics: ['storage_used_gb'] },
        { label: 'Uso de Capacidad', metrics: ['usage_percentage'] },
        { label: 'IOPS Totales', metrics: ['iops_total'] },
    ],
    tableMetrics: [
        { label: 'Usado', metrics: ['storage_used_gb'] },
        { label: 'Uso de Capacidad', metrics: ['usage_percentage'] },
        { label: 'IOPS', metrics: ['iops_total'] },
    ],
    attributes: [
        { key: 'capacity_gb', label: 'Capacidad', format: 'gb', total: true },
        { key: 'share_name', label: 'Share', format: 'text' },
        { key: 'protocol', label: 'Protocolo', format: 'text' },
        { key: 'ip_address', label: 'IP', format: 'text' },
        { key: 'monthly_cost', label: 'Costo mensual estimado', format: 'number', unit: 'USD' },
        { key: 'last_activity', label: 'Última actividad', format: 'date' },
        { key: 'created', label: 'Creada', format: 'date' },
    ],
    tableAttributes: [{ key: 'capacity_gb', label: 'Capacidad', format: 'gb' }],
    breakdowns: [{ key: 'resource_type', label: 'Por tier' }],
    summaryFromResources: true,
    diagnosisRule: 'Sin IOPS en el período = sin uso; IOPS muy bajas = bajo uso.',
    emptyText: 'No encontramos instancias Filestore en el rango seleccionado.',
};

export const GCP_IPS_UNUSED: UnusedViewConfig = {
    cloud: 'gcp',
    resource: 'ips',
    serviceName: 'IPs',
    resourceTypeLabel: 'Dirección IP',
    cardMetrics: [],
    tableMetrics: [],
    attributes: [
        { key: 'address', label: 'Dirección IP', format: 'text' },
        { key: 'address_type', label: 'Tipo', format: 'text' },
        { key: 'network_tier', label: 'Network tier', format: 'text' },
        { key: 'purpose', label: 'Propósito', format: 'text' },
        { key: 'reserved_days', label: 'Días reservada', format: 'count', unit: 'días' },
        { key: 'monthly_cost', label: 'Costo mensual estimado', format: 'number', unit: 'CLP' },
        { key: 'created', label: 'Creada', format: 'date' },
    ],
    tableAttributes: [
        { key: 'address', label: 'Dirección IP', format: 'text' },
        { key: 'network_tier', label: 'Network tier', format: 'text' },
        { key: 'reserved_days', label: 'Días reservada', format: 'count', unit: 'días' },
    ],
    breakdowns: [{ key: 'region', label: 'Por región' }, { key: 'reserved_days_bucket', label: 'Por días reservada' }, { key: 'address_type', label: 'Por tipo' }],
    summaryFromResources: true,
    diagnosisRule: 'IP reservada sin recursos que la usen = sin uso.',
    emptyText: 'No encontramos IPs sin uso en el rango seleccionado.',
};
