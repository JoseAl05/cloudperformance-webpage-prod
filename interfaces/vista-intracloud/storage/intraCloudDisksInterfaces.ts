export interface IntraCloudDisks {
  tenant_id: string;
  disks_data: IntraCloudDisksMetrics[];
  metrics_summary: IntraCloudDisksMetricsSummary[];
  total_analyzed_count: number;
  resources_count: number;
}

export interface IntraCloudDisksMetrics {
  value: number;
  timestamp: string;
  metric_name: string;
  service_type?: string;
}

export interface IntraCloudDisksMetricsSummary {
  value: number;
  metric_name: string;
  service_type?: string;
}