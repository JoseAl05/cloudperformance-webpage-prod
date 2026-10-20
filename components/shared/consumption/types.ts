import type { ConsumptionCloud } from '@/interfaces/consumption';
import type { ValueFormat } from '@/lib/consumption';

export interface FieldDef {
    label: string;
    path: string;
    format?: ValueFormat | 'text' | 'date';
    unit?: string;
}

export interface MetricColumnDef extends FieldDef {
    bar?: boolean;
    secondary?: FieldDef;
}

export interface MetricGroupDef {
    title: string;
    rows: FieldDef[];
}

export interface ConsumptionViewConfig {
    cloud: ConsumptionCloud;
    resource: string;
    serviceName: string;
    resourceTypeLabel: string;
    labels: { total: string; unit: string; idle: string; underutilized: string };
    metricsEndpoints: string[];
    hasEfficiency: boolean;
    tableColumns: MetricColumnDef[];
    generalFields: FieldDef[];
    metricGroups: MetricGroupDef[];
    historyColumns?: FieldDef[];
    showStorageInefficient?: boolean;
    recommendations: { idle: string; underutilized: string };
    emptyText: string;
}
