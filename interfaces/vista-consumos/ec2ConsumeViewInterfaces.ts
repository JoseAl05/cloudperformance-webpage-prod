export interface ConsumeViewEc2CpuMetrics {
    timestamp: string;
    sync_time: string;
    region: string;
    total_cpu: number;
    used_cpu: number;
    unused_cpu: number;
    average_cpu_metric_value: number;
}

export interface ConsumeViewEc2CreditsMetrics {
    timestamp: string;
    sync_time: string;
    region: string;
    CpuCreditUsageValue: number;
    CpuCreditBalanceValue: number;
}

export interface ConsumeViewEc2NetworkMetrics {
    timestamp: string;
    sync_time: string;
    region: string;
    avg_network_in: number | null;
    max_network_in: number | null;
    avg_network_out: number | null;
    max_network_out: number | null;
}

export interface ConsumeViewEc2EbsDevice {
    DeviceName: string;
    Ebs: {
        AttachTime: string;
        DeleteOnTermination: boolean;
        Status: string;
        VolumeId: string;
    };
}

export interface ConsumeViewEc2NetworkInterface {
    Association: { PublicIp: string; PublicDnsName: string };
    Status: string;
    NetworkInterfaceId: string;
    PrivateIpAddress: string;
}

export interface Ec2ConsumneViewInstance {
    resource: string;
    resource_type: string;
    resource_status: string;
    ebs_devices: ConsumeViewEc2EbsDevice[];
    devices_attached_count: number;
    devices_not_attached_count: number;
    public_ip: string;
    private_ip: string;
    network_interfaces: ConsumeViewEc2NetworkInterface[];
    interfaces_inuse_count: number;
    interfaces_not_inuse_count: number;
    vpc_id: string;
    region: string;
    last_cpu_credits_balance: number;
    last_cpu_credits_usage: number;
    credit_efficiency: string;
    metric_sync_time: string;
    instance_sync_time: string;
    // ── campos nuevos ──
    avg_cpu: number | null;
    max_cpu: number | null;
    avg_network_in: number | null;
    max_network_in: number | null;
    avg_network_out: number | null;
    max_network_out: number | null;
    costo_usd: number | null;
    clasificacion: 'Idle' | 'Infrautilizada' | 'Óptimo' | 'Sin Datos';
}

