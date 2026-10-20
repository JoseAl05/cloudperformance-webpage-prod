import type { MetricDefinition } from '@/lib/consumption';
import type { WorkingHoursResource } from '@/interfaces/workingHours';
import type { ResourceLink, ResourceLinkContext, WorkingHoursViewConfig } from '@/components/shared/working-hours/types';

const awsLink = (page: string) => (r: WorkingHoursResource, { param }: ResourceLinkContext): ResourceLink => ({
    pathname: `/cloud-aws/recursos/${page}`,
    query: {
        startDate: param('startDate'),
        endDate: param('endDate'),
        instance: r.resource_name,
        region: r.region ?? param('region'),
    },
});

const gcpComputeLink = (r: WorkingHoursResource, { param }: ResourceLinkContext): ResourceLink => ({
    pathname: '/cloud-gcp/recursos/compute-engine',
    query: {
        startDate: param('startDate'),
        endDate: param('endDate'),
        resourceId: r.resource_id,
        projects: param('projects'),
        regions: param('regions'),
    },
});

const gcpCloudSqlLink = (engine: string) => (r: WorkingHoursResource, { param }: ResourceLinkContext): ResourceLink => ({
    pathname: `/cloud-gcp/recursos/cloudsql/${engine}`,
    query: {
        startDate: param('startDate'),
        endDate: param('endDate'),
        resourceId: r.resource_name,
        projects: param('projects'),
        regions: param('regions'),
    },
});

const azureScope = (resourceId: string) => {
    const match = /\/subscriptions\/([^/]+)\/resourceGroups\/([^/]+)/i.exec(resourceId);
    return { subscription: match?.[1] ?? null, resourceGroup: match?.[2] ?? null };
};

const azureLink = (page: (r: WorkingHoursResource) => string) => (r: WorkingHoursResource, { param }: ResourceLinkContext): ResourceLink => {
    const { subscription, resourceGroup } = azureScope(r.resource_id);
    return {
        pathname: `/cloud-azure/${page(r)}`,
        query: {
            startDate: param('startDate'),
            endDate: param('endDate'),
            subscription: subscription ?? param('subscription'),
            region: param('region'),
            resourceGroup: resourceGroup ?? param('resourceGroup'),
            instanceV2: r.resource_name,
        },
    };
};

const azureDbPage = (r: WorkingHoursResource) =>
    /DBforPostgreSQL/i.test(r.resource_id) ? 'recursos/db-postgresql' : 'recursos/db-mysql';

const AZURE_WH_METRICS: Record<string, MetricDefinition> = {
    availablememory: { label: 'Memoria Disponible', format: 'bytes' },
};

export const AWS_EC2_WH: WorkingHoursViewConfig = {
    cloud: 'aws',
    resource: 'ec2',
    serviceName: 'instancias EC2',
    resourceTypeLabel: 'EC2',
    resourceLink: awsLink('instancias-ec2'),
    emptyText: 'No encontramos instancias EC2 en el rango seleccionado.',
};

export const AWS_ASG_WH: WorkingHoursViewConfig = {
    cloud: 'aws',
    resource: 'asg',
    serviceName: 'instancias de Auto Scaling Groups',
    resourceTypeLabel: 'EC2 (Auto Scaling)',
    resourceLink: awsLink('instancias-ec2'),
    emptyText: 'No encontramos instancias de Auto Scaling Groups en el rango seleccionado.',
};

export const AWS_EKS_WH: WorkingHoursViewConfig = {
    cloud: 'aws',
    resource: 'eks',
    serviceName: 'nodos EKS',
    resourceTypeLabel: 'EC2 (Nodos EKS)',
    resourceLink: awsLink('instancias-ec2'),
    emptyText: 'No encontramos nodos EKS en el rango seleccionado.',
};

export const awsRdsWorkingHours = (dbType?: string): WorkingHoursViewConfig => ({
    cloud: 'aws',
    resource: 'rds',
    serviceName: dbType ? `instancias ${dbType.toUpperCase()}` : 'instancias RDS',
    resourceTypeLabel: 'RDS',
    resourceLink: dbType ? awsLink(`instancias-${dbType}`) : undefined,
    emptyText: 'No encontramos instancias RDS en el rango seleccionado.',
});

export const AZURE_VM_WH: WorkingHoursViewConfig = {
    cloud: 'azure',
    resource: 'vm',
    serviceName: 'Máquinas Virtuales Azure',
    resourceTypeLabel: 'Virtual Machine',
    metricOverrides: AZURE_WH_METRICS,
    resourceLink: azureLink(() => 'recursos/vm'),
    emptyText: 'No encontramos máquinas virtuales en el rango seleccionado.',
};

export const AZURE_DB_WH: WorkingHoursViewConfig = {
    cloud: 'azure',
    resource: 'db',
    serviceName: 'Bases de Datos Azure',
    resourceTypeLabel: 'Azure Database',
    metricOverrides: AZURE_WH_METRICS,
    resourceLink: azureLink(azureDbPage),
    emptyText: 'No encontramos bases de datos en el rango seleccionado.',
};

export const AZURE_NODES_WH: WorkingHoursViewConfig = {
    cloud: 'azure',
    resource: 'nodes',
    serviceName: 'Nodos AKS Azure',
    resourceTypeLabel: 'Nodo AKS',
    metricOverrides: AZURE_WH_METRICS,
    resourceLink: azureLink(() => 'recursos/nodos'),
    emptyText: 'No encontramos nodos AKS en el rango seleccionado.',
};

export const GCP_COMPUTE_ENGINE_WH: WorkingHoursViewConfig = {
    cloud: 'gcp',
    resource: 'compute-engine',
    serviceName: 'instancias Compute Engine',
    resourceTypeLabel: 'Compute Engine',
    resourceLink: gcpComputeLink,
    emptyText: 'No encontramos instancias en el rango seleccionado.',
};

export const GCP_INSTANCE_GROUPS_WH: WorkingHoursViewConfig = {
    cloud: 'gcp',
    resource: 'instance-groups',
    serviceName: 'instancias de Instance Groups',
    resourceTypeLabel: 'Instance Group',
    resourceLink: gcpComputeLink,
    emptyText: 'No encontramos instancias en el rango seleccionado.',
};

export const GCP_GKE_WH: WorkingHoursViewConfig = {
    cloud: 'gcp',
    resource: 'gke',
    serviceName: 'nodos de Clusters GKE',
    resourceTypeLabel: 'Nodo GKE',
    resourceLink: gcpComputeLink,
    emptyText: 'No encontramos nodos en el rango seleccionado.',
};

export const gcpCloudSqlWorkingHours = (dbEngine?: string): WorkingHoursViewConfig => ({
    cloud: 'gcp',
    resource: 'cloud-sql',
    serviceName: 'instancias Cloud SQL',
    resourceTypeLabel: 'Cloud SQL',
    resourceLink: dbEngine ? gcpCloudSqlLink(dbEngine === 'postgres' ? 'postgresql' : dbEngine) : undefined,
    emptyText: 'No encontramos instancias Cloud SQL en el rango seleccionado.',
});

export const GCP_FILESTORE_WH: WorkingHoursViewConfig = {
    cloud: 'gcp',
    resource: 'filestore',
    serviceName: 'instancias Filestore',
    resourceTypeLabel: 'Filestore',
    emptyText: 'No encontramos instancias Filestore en el rango seleccionado.',
};
