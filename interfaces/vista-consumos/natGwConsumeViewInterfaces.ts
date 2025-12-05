export interface NatGatewayMetrics {
  timestamp: string;
  metric_name: string;
  avg_value: number;
  sum_value: number;
}

export interface NatGatewayCardsSummary {
  metric_name: string;
  value: number;
  peak_value: number;
  unit: string;
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

export interface NatGatewaysCardsSummary {
  metric_name: string;
  value: number;
  peak_value: number;
  unit: string;
}
