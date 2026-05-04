export interface AnomalyConfig {
    _id?: string;
    cloud_provider: string;
    project_id: string;
    service: string;
    sensitivity_percentage: number;
    comparison_period: '7d' | '15d' | '30d' | 'previous_day';
    alert_emails: string[];
    status?: 'normal' | 'spike_detected';
    last_triggered?: string | null;
}