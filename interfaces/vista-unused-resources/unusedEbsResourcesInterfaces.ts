export interface UnusedEbsTableDataMetric {
    metric_name: string;
    avg: number;
    global_avg: number;
    region: string;
    bar_width: number;
    visualization_type: string;
    group_context_value: number;
}

export interface UnusedEbsTableDataBilling {
    total_cost_usd: number;
}


export interface UnusedEbsTableDataAttachments {
    DeleteOnTermination: boolean;
    VolumeId: string;
    InstanceId: string;
    Device: string;
    State: string;
    AttachTime: string;
}

export interface UnusedEbsTableDataHistoryMetrics {
    volume_idle_time_avg: number;
    volume_write_bytes_avg: number;
    volume_read_bytes_avg: number;
    volume_write_ops_avg: number;
    volume_read_ops_avg: number;
    volume_queue_length_avg: number;
    burst_balance_avg: number;
}

export interface UnusedEbsTableDataHistory {
    sync_time: string;
    status: string;
    volume_type: string;
    throughput: number;
    size: number;
    iops: number;
    encrypted: boolean;
    attachments: UnusedEbsTableDataAttachments[];
    disks: UnusedEbsTableDataDisk[];
    metrics: UnusedEbsTableDataHistoryMetrics;
}

export interface UnusedEbsTableData {
    volume_id: string;
    volume_name: string;
    volume_type: string;
    region: string;
    status: string;
    throughput: number;
    size: number;
    iops: number;
    encrypted: boolean;
    metrics: UnusedEbsTableDataMetric[];
    history: UnusedEbsTableDataHistory[];
    billing: UnusedEbsTableDataBilling;
}

export interface UnusedEbsCardsMetricSummary {
    metric_name: string;
    value: number;
    peak_value: number;
}