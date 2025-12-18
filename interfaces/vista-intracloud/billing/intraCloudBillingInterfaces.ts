export interface IntraCloudBilling {
    tenant_id: string;
    billing_data: IntraCloudBillingData[];
}

export interface IntraCloudBillingData {
    _id: string;
    cost_in_usd_sum: number;
    payg_cost_in_usd_sum: number;
}

export interface IntraCloudBillingByDimension {
    tenant_id: string;
    billing_data: IntraCloudBillingByDimensionData[];
}

export interface IntraCloudBillingByDimensionData {
    _id: string;
    cost_in_usd_sum: number;
    payg_cost_in_usd_sum: number;
    [key: 'product' | 'consumed_service' | 'resource_location' | 'resource_group' | 'meter_category' | 'meter_sub_category' | 'meter_name' | 'unit_of_measure' | 'pricing_model' | 'charge_type' | 'billing_profile_name' | 'customer_name' | 'cost_center']: string;
}