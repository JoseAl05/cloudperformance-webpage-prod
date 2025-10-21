export interface MetricPoint {
  resource: string;
  region: string;
  metric: string;
  metric_value: number;
  metric_timestamp: string;
}

export interface RangeBlock {
  metrics: MetricPoint[];
  average: number;
  month: string;
  year: number;
}

export interface ResourceMetrics {
  resource: string;
  metric: string;
  actual_range: RangeBlock;
  prev_range: RangeBlock;
  variation: number,
  variation_percent: number,
  region: string,
}