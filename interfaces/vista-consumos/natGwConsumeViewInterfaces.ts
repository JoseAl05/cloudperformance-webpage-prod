export interface NatGatewayConsumeMetrics {
  timestamp: string;
  metric: string;
  avg_value: number;
  max_value: number;
  min_value: number;
}

export interface NatGatewayCardsSummary {
  metric_name: string;
  value: number;
  peak_value: number;
  unit: string;
}

export interface NatGatewayConsumeInfoInstancesHistoryAddress {
  AllocationId: string;
  NetworkInterfaceId: string;
  PrivateIp: string;
  PublicIp: string;
  AssociationId: string;
  IsPrimary:boolean;
  Status: string;
}

export interface NatGatewayConsumeInfoInstancesHistory {
  sync_time: {
    $date: string;
  };
  name: string;
  ConnectivityType: string;
  region: string;
  NatGatewayAddresses: NatGatewayConsumeInfoInstancesHistoryAddress[];
  avg_active_connections: number;
  max_active_connections: number;
  min_active_connections: number;
  avg_bytes_in: number;
  max_bytes_in: number;
  min_bytes_in: number;
  avg_bytes_out: number;
  max_bytes_out: number;
  min_bytes_out: number;
  avg_error_port_allocation: number;
  max_error_port_allocation: number;
  min_error_port_allocation: number;
  is_idle: boolean;
  is_underutilized: boolean;
  costo_usd: number;
  CreateTime: {
    $date: string;
  };
  Tags: [
    {
      Key: string;
      Value: string;
    }
  ]
}

export interface NatGatewayConsumeInfoInstances {
  name: string;
  NatGatewayId: string;
  history: NatGatewayConsumeInfoInstancesHistory[];
}

export interface NatGatewayConsumeInfo {
  resumen: {
    total_nat_gateways: number;
    nat_gateways_idle: number;
    nat_gateways_infrautilizadas: number;
  };
  nat_gateways: NatGatewayConsumeInfoInstances[];
}

export interface NatGatewayConsumeGlobalEfficiencyMetricsDetail {
  metric: string;
  avg_bytes: number;
  max_utilization: number;
  min_utilization: number;
  samples: number;
}

export interface NatGatewayConsumeGlobalEfficiency {
  global_efficiency: string;
  metrics_detail: NatGatewayConsumeGlobalEfficiencyMetricsDetail[];
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
