export interface AverageByLocation {
    averages: AverageByLocationData[];
    location: string;
}

export interface AverageByLocationData {
    count: number;
    first_ts: string;
    last_ts: string;
    avg_value: number;
    max_value?: number; 
    min_value?: number;
    metric_name: string;
    resource_count:number;
    resources: string[];
}