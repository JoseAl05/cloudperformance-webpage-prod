export interface RateObject {
    price: number;
    unit: string;
    meter_name?: string;
}

export interface MeterDetail {
    quantity: number;
    unit_of_measure: string;
    cost_in_billing_currency: number;
    meter_name: string;
    metric_type: string;
}

export interface PriceComparison {
    modelName: string;
    provider: string;
    estimated_cost: number;
    cost_breakdown: Record<string, number>;
    delta_pct_vs_current: number | null;
    missing_rates: string[];
    delta_pct_vs_billing?: number | null;
    detailed_cost_breakdown?: Record<string, number>;
    detailed_base_rates?: Record<string, RateObject>;
}

export interface AzureModelCost {
    account_name: string;
    model_name: string;
    model_version: string;
    provider: string;
    region: string;
    tokens: Record<string, number>; 
    cost_breakdown: Record<string, number>; 
    total_cost: number;
    price_comparison: PriceComparison[];
    total_billing_cost: number;
    billing_cost_breakdown: Record<string, number>;
    billing_rates: Record<string, RateObject>;
    meter_details: MeterDetail[];
}

export interface AzureFoundationModel {
    resource_name: string;
    version: string;
    provider: string;
    resource_id: string;
    region: string;
}

export interface TokenUsageTimeline {
    timestamp: string;
    metric: string;
    sum_value: number;
}