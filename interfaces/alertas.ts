export interface AlertConfig {
    _id?: string;
    cloud_provider: string;
    project_id: string;
    service: string;
    threshold_amount: number;
    currency: string;
    alert_emails: string[];
    warning_percentages?: number[];
    triggered_warnings_this_month?: number[];
    last_triggered?: string | Date;
}