export interface UnusedAppGw {
    name: string;
    location: string;
    details: UnusedAppGwDetails[];
    resource_id: string;
    metrics: UnusedAppGwMetrics[];
}

export interface UnusedAppGwDetails {
    sync_time: string;
    tags: {
        [key: string]: string
    };
    sku: string;
    min_capacity:number;
    waf_mode: string;
    backend_instance_count: number;
    autoscale_configuration:{
        min_capacity: number;
        max_capacity: number;
    };
    backend_address_pools?: UnusedAppGwBackendAddressPools[];
}

export interface UnusedAppGwBackendAddressPools {
    id: string;
    name: string;
    etag:string;
    type:string;
    backend_ip_configurations?: UnusedAppGwBackendIpConfigurations[];
    backen_addresses?: UnusedAppGwBackendAddresses[];
    provisioning_state:string;
}

export interface UnusedAppGwBackendIpConfigurations {
    id: string;
}

export interface UnusedAppGwBackendAddresses {
    id: string;
}

export interface UnusedAppGwMetrics {
    metric_name: string;
    values: UnusedAppGwMetricValues[];
}

export interface UnusedAppGwMetricValues {
    metric_value: number;
    timestamp: string;
}