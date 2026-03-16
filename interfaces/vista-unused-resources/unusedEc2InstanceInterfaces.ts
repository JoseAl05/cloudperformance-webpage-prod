export interface UnusedEc2TableDataMetric {
    metric_name: string;
    avg: number;
    global_avg: number;
    region: string;
    bar_width: number;
    visualization_type: string;
    group_context_value: number;
}

export interface UnusedEc2TableDataBilling {
    total_cost_usd: number;
}


export interface UnusedEc2TableDataNetworkInterfaceGroups {
    GroupId: string;
    GroupName: string;
}

export interface UnusedEc2TableDataNetworkInterface {
    Association: {
        IpOwnerId: string;
        PublicDnsName: string;
        PublicIp: string;
    },
    Attachment: {
        AttachTime: string;
        AttachmentId: string;
        DeleteOnTermination: boolean;
        DeviceIndex: number;
        Status: string;
        NetworkCardIndex: number;
    },
    Description: string;
    Groups: UnusedEc2TableDataNetworkInterfaceGroups[];
    Ipv6Addresses?: string[];
    NetworkInterfaceId: string;
    OwnerId: string;
    PrivateDnsName: string;
    PrivateIpAddress: string;
    Status: string;
    SubnetId: string;
    VpcId: string;
    InterfaceType: string;
}


export interface UnusedEc2TableDataDisk {
    DeviceName: string;
    Ebs: {
        AttachTime: string;
        DeleteOnTermination: boolean;
        Status: string;
        VolumeId: string;
    }
}

export interface UnusedEc2TableDataHistoryMetrics {
    cpu_avg: number;
    cpu_credits_balance_avg: number;
    cpu_credits_usage_avg: number;
    net_egress_avg: number;
    net_ingress_avg: number;
    status_check_failed_avg: number;
}

export interface UnusedEc2TableDataHistory {
    sync_time: string;
    status: string;
    instance_type: string;
    networkInterfaces: UnusedEc2TableDataNetworkInterface[];
    disks: UnusedEc2TableDataDisk[];
    metrics: UnusedEc2TableDataHistoryMetrics;
}

export interface UnusedEc2TableData {
    instance_id: string;
    instance_name: string;
    instance_type: string;
    region: string;
    status: string;
    metrics: UnusedEc2TableDataMetric[];
    history: UnusedEc2TableDataHistory[];
    billing: UnusedEc2TableDataBilling;
}

export interface UnusedEc2CardsMetricSummary {
    metric_name: string;
    value: number;
    peak_value: number;
}