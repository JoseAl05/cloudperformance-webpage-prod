export interface WorkingNonWorkingHoursUsage {
    metric:string;
    metric_value: number;
    schedule_type: string;
    timestamp:string;
}

export interface WorkingNonWorkingHoursUsageSummary {
    metric: string;
    schedule_type: string;
    average: number;
    max: number;
    min: number;
}

export interface WorkingNonWorkingHoursUsageSummaryByResource {
    resource_name: string;
    resource_id: string;
    sync_time: string;
    metric_data: WorkingNonWorkingHoursUsageSummaryByResourceMetrics[];
    metric_activity_summary: WorkingNonWorkingHoursUsageSummaryByResourceActivitySummary[];
}

export interface WorkingNonWorkingHoursUsageSummaryByResourceMetrics {
    metric_name: string;
    schedule_type: string;
    avg_value: number;
    max_value: number;
    min_value: number;
}

export interface WorkingNonWorkingHoursUsageSummaryByResourceActivitySummary {
    metric_name: string;
    highest_avg_schedule: string;
    highest_avg_value:number;
}