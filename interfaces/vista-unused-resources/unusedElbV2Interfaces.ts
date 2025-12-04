export interface UnusedElbV2 {
  elb_arn: string;
  region: string;
  diagnosis: {
    status: string;
    elb_type: string;
    reason: string;
    metrics_summary: {
      avg_requests: number;
      avg_active_connections: number;
      acg_new_flows: number;
      avg_active_flows: number;
      avg_consumed_lcus: number;
    };
  };
  details: UnusedElbV2Details[];
}

export interface UnusedElbV2Details {
  sync_time: string;
  DNSName: string;
  Type: string;
  VpcId: string;
  State: {
    Code: string;
  };
  AvailabilityZones: UnusedElbV2DetailsAvailabilityZones[];
  metrics_summary: {
    avg_requests: number;
    avg_active_connections: number;
    acg_new_flows: number;
    avg_active_flows: number;
    avg_consumed_lcus: number;
  };
}

export interface UnusedElbV2DetailsAvailabilityZones{
    ZoneName: string;
    SubnetId: string;
    LoadBalancerAddresses?: string[];
}
