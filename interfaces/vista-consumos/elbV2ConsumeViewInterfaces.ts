export interface LoadbalancerV2Metrics {
  sum_value: number;
  avg_value: number;
  timestamp: string;
  metric_name: string;
}

export interface LoadbalancerV2MetricsSummary {
    resource: string;
    resource_region: string;
    metrics: LoadbalancerV2MetricsSummaryMetrics[];
}

export interface LoadbalancerV2MetricsSummaryMetrics {
    sync_time: string;
    metric_name: string;
    value: number;
    max_value: number;
}

export interface LoadbalancerV2CardsSummary {
  metric_name: string;
  value: number;
  peak_value: number;
  unit: string;
}
