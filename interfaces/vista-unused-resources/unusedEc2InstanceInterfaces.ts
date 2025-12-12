export interface UnusedEc2Instances {
    instance_id: string;
    region: string;
    instance_type: string;
    diagnosis: {
        status: string;
        reason: string;
        monthly_cost_estimate: number;
        metrics_summary: {
            avg_cpu_utilization: number;
            total_network_io: number;
        }
    };
    details: UnusedEc2Details[];
}

export interface UnusedEc2Details {
    sync_time: string;
    VpcId: string;
    SubnetId: string;
    State: {
        Name: string;
        Code: number;
    };
    Tags: { [key: string]: string };
    PrivateIpAddress: string;
    PublicIpAddress?: string;
    InstanceType: string;
    metrics_summary: {
        avg_cpu_utilization: number;
        total_network_io: number;
    }
}

export interface UnusedEc2CardsData {
    metric_name: string;
    value: number;
    peak_value: number;
    unit: string;
}