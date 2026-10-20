export type UnusedCloud = 'aws' | 'azure' | 'gcp';

export type UnusedAction = 'candidates' | 'summary' | 'series' | 'resources' | 'associated';

export type DiagnosisStatus = 'underutilized' | 'low_usage' | 'healthy' | 'no_data';

export interface UnusedCandidate {
    resource_id: string;
    resource_name: string;
    cpu_avg: number | null;
}

export interface UnusedMetricSummary {
    metric: string;
    avg_value: number | null;
    peak_value: number | null;
}

export interface UnusedSeriesPoint {
    timestamp: string;
    metric: string;
    avg_value: number | null;
    max_value: number | null;
    min_value: number | null;
}

export interface UnusedMetric {
    metric: string;
    avg_value: number | null;
    max_value: number | null;
    min_value: number | null;
    global_avg: number | null;
    bar_width: number | null;
    visualization_type: 'ranking' | 'contribution' | null;
    group_context_value: number | null;
}

export interface UnusedDiagnosis {
    status: DiagnosisStatus;
    reason: string;
}

export interface UnusedNetworkInterface {
    id: string | null;
    name: string | null;
    type: string | null;
    status: string | null;
    private_ip: string | null;
    public_ip: string | null;
    network: string | null;
    subnet: string | null;
    security_groups: string[];
}

export interface UnusedDisk {
    id: string | null;
    name: string | null;
    device: string | null;
    type: string | null;
    status: string | null;
    size_gb: number | null;
    boot: boolean | null;
    delete_on_termination: boolean | null;
}

export interface UnusedAttachment {
    instance_id: string | null;
    device: string | null;
    state: string | null;
    attach_time: string | null;
    delete_on_termination: boolean | null;
}

export interface UnusedRelated {
    type: string;
    id: string;
    name: string | null;
    status: string | null;
    detail: string | null;
    group: string | null;
}

export interface UnusedDetails {
    network_interfaces: UnusedNetworkInterface[];
    disks: UnusedDisk[];
    attachments: UnusedAttachment[];
    related: UnusedRelated[];
}

export interface UnusedHistoryEntry {
    sync_time: string | null;
    status: string | null;
    resource_type: string | null;
    metrics: Record<string, number | null>;
    attributes: Record<string, unknown>;
}

export interface UnusedResource {
    resource_id: string;
    resource_name: string;
    resource_type: string | null;
    region: string | null;
    scope: string | null;
    status: string | null;
    sync_time: string | null;
    metrics: UnusedMetric[];
    cost: number | null;
    currency: string;
    cost_local: number | null;
    cost_local_currency: string | null;
    potential_savings: number | null;
    diagnosis: UnusedDiagnosis;
    attributes: Record<string, unknown>;
    details: UnusedDetails;
    history: UnusedHistoryEntry[];
}
