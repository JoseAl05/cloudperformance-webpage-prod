import type { MetricDefinition } from '@/lib/consumption';
import type { WorkingHoursCloud, WorkingHoursResource } from '@/interfaces/workingHours';

export interface ResourceLinkContext {
    param: (name: string) => string | null;
}

export interface ResourceLink {
    pathname: string;
    query: Record<string, string | null | undefined>;
}

export interface WorkingHoursViewConfig {
    cloud: WorkingHoursCloud;
    resource: string;
    serviceName: string;
    resourceTypeLabel: string;
    metricOverrides?: Record<string, MetricDefinition>;
    resourceLink?: (resource: WorkingHoursResource, ctx: ResourceLinkContext) => ResourceLink | null;
    emptyText: string;
}
