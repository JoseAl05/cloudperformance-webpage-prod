import type { MetricDefinition, ValueFormat } from '@/lib/consumption';
import type { MetricGroup } from '@/lib/unused';
import type { UnusedCloud, UnusedResource } from '@/interfaces/unused';
import type { ResourceLink, ResourceLinkContext } from '@/components/shared/working-hours/types';

export interface AttributeDef {
    key: string;
    label: string;
    format?: ValueFormat | 'text' | 'boolean' | 'date';
    unit?: string;
    total?: boolean;
}

export interface BreakdownDef {
    key: string;
    label: string;
}

export interface UnusedViewConfig {
    cloud: UnusedCloud;
    resource: string;
    serviceName: string;
    resourceTypeLabel: string;
    cardMetrics: MetricGroup[];
    tableMetrics: MetricGroup[];
    attributes?: AttributeDef[];
    tableAttributes?: AttributeDef[];
    breakdowns?: BreakdownDef[];
    summaryFromResources?: boolean;
    hasSeries?: boolean;
    hasAssociated?: boolean;
    groupByAttribute?: string;
    metricOverrides?: Record<string, MetricDefinition>;
    diagnosisRule: string;
    resourceLink?: (resource: UnusedResource, ctx: ResourceLinkContext) => ResourceLink | null;
    emptyText: string;
}
