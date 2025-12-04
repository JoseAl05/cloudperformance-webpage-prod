export interface UnusedElbV2 {
  diagnosis: {
    status: string;
    elb_type: string;
    reason: string;
    metrics_summary: {
      avg_requests: number;
      avg_active_connections: number;
      avg_new_flows: number;
      avg_active_flows: number;
      avg_consumed_lcus: number;
    };
  };
  details: UnusedElbV2Details[];
}

export interface UnusedElbV2Details {
  elb_arn: string;
  elb_type: string;
  region: string;
  metrics_summary: {
    request_count_avg: number;
    active_connections_avg: number;
    new_flows_avg: number;
    active_flows_avg: number;
    consumed_lcus_avg: number;
  };
  history: UnusedElbV2DetailsHistory[];
}

export interface UnusedElbV2DetailsHistory {
  sync_time: string;
  DNSName: string;
  Type: string;
  VpcId: string;
  State: {
    Code: string;
  };
  AvailabilityZones: UnusedElbV2DetailsAvailabilityZones[];
  metrics_summary: {
    request_count_avg: number;
    active_connections_avg: number;
    new_flows_avg: number;
    active_flows_avg: number;
    consumed_lcus_avg: number;
  };
}

export interface UnusedElbV2DetailsAvailabilityZones {
  ZoneName: string;
  SubnetId: string;
  LoadBalancerAddresses?: string[];
}