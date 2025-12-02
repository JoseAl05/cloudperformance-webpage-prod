export interface NatGatewayMetrics {
  sum_value: number;
  avg_value: number;
  timestamp: string;
  metric_name: string;
}

export interface NatGatewaysMetricsSummary {
  resource: string;
  resource_region: string;
  metrics: NatGatewaysMetricsSummaryMetrics[];
}

export interface NatGatewaysMetricsSummaryMetrics {
  sync_time: string;
  metric_name: string;
  value: number;
}
