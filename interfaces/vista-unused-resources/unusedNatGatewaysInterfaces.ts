export interface UnusedNatGateways {
    nat_gw_id: string;
    region: string;
    diagnosis:{
        status:string;
        reason: string;
        metrics_summary:{
            avg_active_connections: number;
            total_bytes_out: number;
        }
    };
    details: UnusedNatGatewaysDetails[];
}

export interface UnusedNatGatewaysDetails {
    sync_time: string;
    VpcId: string;
    SubnetId: string;
    State: string;
    Tags: {
        [key: string]: string;
    };
    NatGatewayAddresses: UnusedNatGatewaysAddresses[];
    metrics_summary: {
        avg_active_connections: number;
        total_bytes_out: number;
    }
}

export interface UnusedNatGatewaysAddresses {
    AllocationId: string;
    NetworkInterfaceId: string;
    PrivateIp: string;
    PublicIp: string;
    AssociationId: string;
    IsPrimary: string;
    Status: string;
}