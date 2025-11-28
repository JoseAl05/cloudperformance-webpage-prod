export interface TrafficManagerDataApiResponse {
  tm_id: string;
  tm_name: string;
  location: string;
  subscription_id: string;
  resource_group: string;
  history: TrafficManagerDataHistory[];
}

export interface TrafficManagerDataHistory {
  id: string;
  name: string;
  type: string;
  tags: {
    [key: string]: string;
  };
  location: string;
  profile_status: string;
  traffic_routing_method: string;
  dns_config: {
    relative_name: string;
    fqdn: string;
    ttl: number;
  };
  monitor_config: {
    profile_monitor_status?: string;
    protocol?: string;
    port?: number;
    path?: string;
    interval_in_seconds?: number;
    timeout_in_seconds?: number;
    tolerated_number_of_failures?: number;
  };
  endpoints: TrafficManagetDataEndpoints[];
  traffic_view_enrollment_status: string;
  max_return: 0;
  _cq_sync_time: string;
  _cq_source_name: string;
  resource_group: string;
  namespace: string;
  children: string;
  resource_parent: string;
  resource_namespace: string;
  resource_type: string;
  resource_name: string;
  subscription_id: string;
  avg_queries_returned?: number | null;
}

export interface TrafficManagetDataEndpoints {
  id?: string;
  name?: string;
  type?: string;
  target_resource_id?: string;
  target?: string;
  endpoint_status?: string;
  weight?: number;
  priority?: number;
  endpoint_location?: string;
  endpoint_monitor_status?: string;
  always_serve?: string;
}
