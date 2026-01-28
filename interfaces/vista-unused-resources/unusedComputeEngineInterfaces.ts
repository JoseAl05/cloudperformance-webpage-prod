export interface UnusedCeTableDataMetric {
    metric_name: string;
    avg: number;
    global_avg: number;
    region: string;
    bar_width: number;
    visualization_type: string;
    group_context_value: number;
}

export interface UnusedCeTableDataBilling {
    resource_global_name: string;
    total_cost_clp: number;
    total_cost_usd: number;
}

export interface UnusedCeTableDataAccessConfig {
    name: string;
    natIP: string;
    networkTier: string;
    type: string;
}

export interface UnusedCeTableDataNetworkInterface {
    network: string;
    accessConfigs: UnusedCeTableDataAccessConfig[];
    stackType: string;
    name: string;
    subnetwork: string;
    fingerprint: string;
    networkIP: string;
}

export interface UnusedCeTableDataDbx {
    fileType: string;
    content: string;
}

export interface UnusedCeTableDataShieldedInstanceInitialState {
    dbxs?: UnusedCeTableDataDbx[];
    dbx?: UnusedCeTableDataDbx[];
}

export interface UnusedCeTableDataGuestOsFeature {
    type: string;
}

export interface UnusedCeTableDataDisk {
    interface: string;
    shieldedInstanceInitialState?: UnusedCeTableDataShieldedInstanceInitialState;
    guestOsFeatures?: UnusedCeTableDataGuestOsFeature[];
    diskSizeGb: string;
    mode: string;
    boot: boolean;
    type: string;
    architecture?: string;
    deviceName: string;
    licenses?: string[];
    source: string;
    autoDelete: boolean;
    index: number;
}

export interface UnusedCeTableDataHistoryMetrics {
    cpu_avg: number;
    disk_read_avg: number;
    disk_write_avg: number;
    net_egress_avg: number;
    net_ingress_avg: number;
    net_egress_throughput_avg: number;
    net_ingress_throughput_avg: number;
    disk_read_throughput_avg: number;
    disk_write_throughput_avg: number;
}

export interface UnusedCeTableDataHistory {
    sync_time: string;
    status: string;
    instance_type: string;
    networkInterfaces: UnusedCeTableDataNetworkInterface[];
    disks: UnusedCeTableDataDisk[];
    metrics: UnusedCeTableDataHistoryMetrics;
}

export interface UnusedCeTableData {
    instance_id: string;
    instance_name: string;
    instance_type: string;
    region: string;
    status: string;
    metrics: UnusedCeTableDataMetric[];
    history: UnusedCeTableDataHistory[];
    billing: UnusedCeTableDataBilling;
}

export interface UnusedCeCardsMetricSummary {
    metric_name: string;
    value: number;
    peak_value: number;
}