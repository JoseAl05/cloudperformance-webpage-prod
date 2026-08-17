export interface S3MetricItem {
    resource: string;
    metric: string;
    storage_type: string | null;
    metric_value: number;
    sync_time: string;
    timestamp?: string;
}

export interface S3VersioningItem {
    resource: string;
    status: string | null;
    mfa_delete: string | null;
    region: string | null;
    sync_time: string;
}

export interface S3VersioningRow extends S3VersioningItem {
    status_label: string;
    mfa_delete_label: string;
}

export interface S3VersioningChangeRow {
    resource: string;
    sync_time: string;
    sync_time_label: string;
    previous_state: string;
    current_state: string;
}

export interface S3LifecycleTransition {
    days?: number | null;
    noncurrent_days?: number | null;
    storage_class: string | null;
}

export interface S3LifecycleItem {
    resource: string;
    rule_id: string;
    status: string | null;
    region: string | null;
    prefix: string | null;
    expiration_days: number | null;
    expired_object_delete_marker: boolean | null;
    noncurrent_expiration_days: number | null;
    abort_multipart_days: number | null;
    transitions: S3LifecycleTransition[];
    noncurrent_transitions: S3LifecycleTransition[];
    sync_time: string;
}

export interface S3LifecycleRow extends S3LifecycleItem {
    status_label: string;
    prefix_label: string;
    transitions_label: string;
    noncurrent_transitions_label: string;
    expiration_label: string;
    noncurrent_expiration_label: string;
    abort_multipart_label: string;
}

export interface S3LifecycleHistoryRow {
    sync_time: string;
    sync_time_label: string;
    buckets: number;
    rules: number;
    enabled: number;
}