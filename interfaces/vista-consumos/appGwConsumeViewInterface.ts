export interface ConsumeViewAppGwApiResponse {
    metrics: ConsumeViewAppGwMetrics[];
}

export interface ConsumeViewAppGwMetrics {
    metric_name: string;
    metric_value: number;
    metric_value_maximum: number;
    metric_value_minimum: number;
    timestamp: string;
}

export interface ConsumeViewAppGwSummaryApiResponse {
    appg_id: string;
    appg_name: string;
    location: string;
    wasted_capacity: number;
    efficiency_percentage: number;
    total_requests: number;
    avg_current_connections: number;
}