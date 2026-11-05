export type WorkingHoursCloud = 'aws' | 'azure' | 'gcp';

export type ScheduleType = 'business_hours' | 'non_business_hours';

export type WorkingHoursAction = 'usage' | 'summary' | 'resources';

export interface WorkingHoursPoint {
    timestamp: string;
    metric: string;
    schedule_type: ScheduleType;
    value: number | null;
}

export interface WorkingHoursSummaryItem {
    metric: string;
    schedule_type: ScheduleType;
    avg_value: number | null;
    max_value: number | null;
    min_value: number | null;
}

export interface WorkingHoursDominant {
    metric: string;
    schedule_type: ScheduleType | null;
    avg_value: number | null;
}

export interface WorkingHoursResource {
    resource_id: string;
    resource_name: string;
    region: string | null;
    sync_time: string | null;
    metrics: WorkingHoursSummaryItem[];
    dominant_schedule: WorkingHoursDominant[];
}
