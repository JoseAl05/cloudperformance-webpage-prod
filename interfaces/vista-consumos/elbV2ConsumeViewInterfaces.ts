export interface LoadbalancerV2ConsumeMetrics {
  timestamp: string;
  metric: string;
  avg_value: number;
  max_value: number;
  min_value: number;
}

export interface LoadbalancerV2ConsumeGlobalEfficiencyMetricsDetail {
  metric: string;
  avg_consumed_lcus: number;
  max_utilization: number;
  min_utilization: number;
  samples: number;
}

export interface LoadbalancerV2ConsumeGlobalEfficiency {
  global_efficiency: string;
  metrics_detail: LoadbalancerV2ConsumeGlobalEfficiencyMetricsDetail[];
}

export interface LoadbalancerV2ConsumeInfoInstancesHistoryTargetGroupTargetHealth {
  Target: {
    Id: string;
    Port: number;
  };
  HealthCheckPort: string;
  TargetHealth: {
    State: string;
  }
}

export interface LoadbalancerV2ConsumeInfoInstancesHistoryTargetGroup {
  TargetGroupArn: string;
  TargetGroupName: string;
  Protocol: string;
  Port: number;
  TargetType: string;
  HealthCheckProtocol: string;
  HealthCheckPort: string;
  HealthCheckEnabled: boolean;
  targets_health: LoadbalancerV2ConsumeInfoInstancesHistoryTargetGroupTargetHealth[];
}

export interface LoadbalancerV2ConsumeInfoInstancesHistory {
  sync_time: {
    $date: string;
  };
  name: string;
  DNSName: string;
  Scheme: string;
  Type: string;
  State: {
    Code: string;
  };
  VpcId: string;
  region: string;
  AvailabilityZones: [
    {
      ZoneName: string;
      SubnetId: string;
      LoadBalancerAddresses: unknown[];
    }
  ];
  IpAddressType: string;
  avg_active_connection_count: number;
  max_active_connection_count: number;
  min_active_connection_count: number;
  avg_active_flow_count: number;
  max_active_flow_count: number;
  min_active_flow_count: number;
  avg_consumed_lcus: number;
  max_consumed_lcus: number;
  min_consumed_lcus: number;
  avg_http_5xx_count: number;
  max_http_5xx_count: number;
  min_http_5xx_count: number;
  avg_new_connection_count: number;
  max_new_connection_count: number;
  min_new_connection_count: number;
  avg_new_flow_count: number;
  max_new_flow_count: number;
  min_new_flow_count: number;
  avg_processed_bytes: number;
  max_processed_bytes: number;
  min_processed_bytes: number;
  avg_request_count: number;
  max_request_count: number;
  min_request_count: number;
  avg_rule_evaluations: number;
  max_rule_evaluations: number;
  min_rule_evaluations: number;
  avg_tcp_client_reset_count: number;
  max_tcp_client_reset_count: number;
  min_tcp_client_reset_count: number;
  is_idle: boolean;
  is_underutilized: boolean;
  costo_usd: number;
  CreatedTime: {
    $date: string;
  };
  target_groups: LoadbalancerV2ConsumeInfoInstancesHistoryTargetGroup[];
}

export interface LoadbalancerV2ConsumeInfoInstances {
  name: string;
  LoadBalancerArn: string;
  history: LoadbalancerV2ConsumeInfoInstancesHistory[];
}

export interface LoadbalancerV2ConsumeInfo {
  resumen: {
    total_loadbalancersv2: number;
    loadbalancersv2_idle: number;
    loadbalancersv2_infrautilizadas: number;
  };
  loadbalancersv2: LoadbalancerV2ConsumeInfoInstances[];
}
