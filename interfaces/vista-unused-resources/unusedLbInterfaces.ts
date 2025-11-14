export interface UnusedLb {
    name: string;
    resource_id: string;
    location: string;
    details: UnusedLbDetail[];
}

export interface UnusedLbDetail {
    sync_time: string;
    tags: { [key: string]: string };
    sku: string;
    backend_instance_count: number;
    lb_rule_count: number;
    nat_rule_count: number;
    backend_address_pools?: UnusedLbBackendAddressPools[];
    load_balancing_rules?: UnusedLbLoadBalancingRules[];
    inbound_nat_rules?: UnusedLbInboundNatRules[];
    inbound_nat_pools?: UnusedLbInboundNatPools[];
}

export interface UnusedLbBackendAddressPools {
    id: string;
    name: string;
    etag: string;
    type: string;
    load_balancer_backend_addresses?: UnusedLbBackendAddresses[];
    backend_ip_configurations?: UnusedLbBackendIpConfigurations[];
    provisioning_state: string;
}

export interface UnusedLbBackendAddresses {
    name: string;
    network_interface_ip_configuration?: {
        id: string;
    }
}

export interface UnusedLbBackendIpConfigurations {
    id: string;
}

export interface UnusedLbLoadBalancingRules {
    id: string;
}

export interface UnusedLbInboundNatRules {
    id: string;
}

export interface UnusedLbInboundNatPools {
    id: string;
}