export type ConsumptionCloud = 'aws' | 'azure' | 'gcp';

export interface MetricPoint {
    timestamp: string;
    metric: string;
    avg_value: number | null;
    max_value: number | null;
    min_value: number | null;
    samples: number | null;
    region: string | null;
    scope: string | null;
}

export type EfficiencyLevel = 'low' | 'medium' | 'high' | 'no_data';

export interface EfficiencyMetric {
    metric: string;
    avg_value: number | null;
    max_value: number | null;
    min_value: number | null;
    samples: number;
    efficiency_score: number | null;
}

export interface EfficiencyResponse {
    global_efficiency_score: number | null;
    global_efficiency_label: string;
    global_efficiency_level: EfficiencyLevel;
    metrics_detail: EfficiencyMetric[];
}

export interface SeriesValue {
    timestamp: string;
    value: number | null;
}

export interface ResourceSnapshot {
    sync_time: string | null;
    status: string | null;
    cost: number | null;
    is_idle: boolean;
    is_underutilized: boolean;
    metrics: Record<string, number | null>;
}

export interface ConsumptionResource {
    resource_id: string;
    resource_name: string;
    resource_type: string | null;
    region: string | null;
    scope: string | null;
    status: string | null;
    tags: Record<string, string>;
    cost: number | null;
    currency: string | null;
    has_billing: boolean;
    is_idle: boolean;
    is_underutilized: boolean;
    storage_inefficient: boolean | null;
    sync_time: string | null;
    metrics: Record<string, number | null>;
    details: Record<string, unknown>;
    history: ResourceSnapshot[];
    series: Record<string, SeriesValue[]>;
}

export interface ConsumptionSummary {
    total_resources: number;
    idle_resources: number;
    underutilized_resources: number;
    storage_inefficient_resources: number | null;
    cost_total: number | null;
    cost_total_by_currency: Record<string, number>;
    currency: string | null;
    has_billing: boolean;
    potential_savings: number | null;
    sync_time: string | null;
    breakdowns: Record<string, Record<string, number>>;
    extra: Record<string, unknown>;
}

export interface ConsumptionInfoResponse {
    summary: ConsumptionSummary;
    resources: ConsumptionResource[];
}
