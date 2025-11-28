export interface UnusedTm {
  name: string;
  location: string;
  details: UnusedTmDetails[];
  resource_id: string;
  metrics: UnusedTmMetrics[];
}

export interface UnusedTmDetails {
  sync_time: string;
  tags: {
    [key: string]: string;
  };
  profile_status: string;
  monitor_config: {
    profile_monitor_status?: string;
    protocol?: string;
    port?: number;
    path?: string;
    interval_in_seconds?: number;
    timeout_in_seconds?: number;
    tolerated_number_of_failures?: number;
  };
  traffic_view_enrollment_status: string;
}

export interface UnusedTmMetrics {
  metric_name: string;
  values: UnusedTmMetricValues[];
}

export interface UnusedTmMetricValues {
  metric_value: number;
  timestamp: string;
}
