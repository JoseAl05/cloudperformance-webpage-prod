export type BillingCloud = 'aws' | 'azure' | 'gcp';

export type BillingAction = 'trend' | 'multitenant/trend' | 'history' | 'top';

export interface BillingPoint {
    date: string;
    service: string;
    region: string | null;
    scope: string | null;
    account: string | null;
    cost: number;
    cost_local: number | null;
}

export interface BillingTrend {
    cost_metric: string;
    currency: string;
    local_currency: string | null;
    points: BillingPoint[];
}

export interface BillingMonthCost {
    month: string;
    cost: number;
}

export interface BillingDeviation {
    to_month: string;
    value: number;
}

export interface BillingHistoryService {
    service: string;
    total: number;
    months: BillingMonthCost[];
    deviations: BillingDeviation[];
}

export interface BillingDeviationSummary {
    to_month: string;
    increases: number;
    decreases: number;
    net: number;
}

export interface BillingHistory {
    cost_metric: string;
    currency: string;
    services: BillingHistoryService[];
    totals: { by_month: { month: string; total: number }[]; total: number };
    deviations: BillingDeviationSummary[];
}

export interface BillingTopItem {
    value: string;
    service: string | null;
    date: string | null;
    cost: number;
}

export interface BillingTop {
    cost_metric: string;
    currency: string;
    dimension: string;
    items: BillingTopItem[];
}
