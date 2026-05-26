export interface CloudBillingItem {
    date?: string;
    start_date?: string;
    usage_date?: string;
    time_period_start?: string;
    usage_start_time?: string;
    day?: string;
    timePeriod?: { start?: string };
    TimePeriod?: { Start?: string };

    cost_in_usd?: string | number;
    unblendedcost?: string | number;
    cost_net_usd?: string | number;
    

    meter_category?: string;
    product?: string;
    service_name?: string;
    SERVICE?: string;
    service?: string;
    service_description?: string;

    source_db?: string;

    [key: string]: unknown;
}