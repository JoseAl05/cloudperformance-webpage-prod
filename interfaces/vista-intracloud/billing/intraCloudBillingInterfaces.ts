export interface IntraCloudBilling {
    billing_tenant_a:IntraCloudBillingTenant[];
    billing_tenant_b:IntraCloudBillingTenant[];
}

export interface IntraCloudBillingTenant {
    _id: string;
    cost_in_usd_sum: number;
    payg_cost_in_usd_sum: number;
}