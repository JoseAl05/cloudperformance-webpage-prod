export interface Ec2ResourceViewMetricData {
  _id: string;
  Timestamp: string;
  total: number | null;
  unused: number | null;
  used: number | null;
  Value: number;
  MetricLabel: string;
  MetricId: string;
  Resource: string;
  sync_time: string;
}

export interface Ec2ResourceViewMetricsApiResponse {
  metrics_data: MetricData[];
}
