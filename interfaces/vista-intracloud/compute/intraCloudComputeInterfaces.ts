export interface IntraCloudCompute {
  tenant_id: string;
  compute_data: IntraCloudComputeData[];
  metrics_summary: IntraCloudComputeMetricsSummary[];
  total_analyzed_count: number;
}

export interface IntraCloudComputeData {
  avg_value: number;
  timestamp: string;
  metric_name: string;
}

export interface IntraCloudComputeMetricsSummary {
  avg_value: number;
  metric_name: string;
  metric_count: number;
}

export interface IntraCloudComputeBilling {
  tenant_id: string;
  billing_data: IntraCloudComputeBillingData[];
  most_expensive: IntraCloudComputeBillingMostExpensive;
  least_expensive: IntraCloudComputeBillingLeastExpensive;
}

export interface IntraCloudComputeBillingData {
  cost_in_usd: number;
  payg_cost_in_usd: number;
  [
    key:
      | 'product'
      | 'consumed_service'
      | 'resource_location'
      | 'resource_group'
      | 'meter_category'
      | 'meter_sub_category'
      | 'meter_name'
      | 'unit_of_measure'
      | 'pricing_model'
      | 'charge_type'
      | 'billing_profile_name'
      | 'customer_name'
      | 'cost_center'
      | 'service'
      | 'linked_account'
      | 'region'
      | 'az'
      | 'usage_type'
      | 'operation'
      | 'instance_type'
      | 'instance_type_family'
      | 'platform'
      | 'operating_system'
      | 'tenancy'
      | 'database_engine'
      | 'cache_engine'
      | 'deployment_option'
      | 'purchase_type'
      | 'record_type'
      | 'billing_entity'
      | 'legal_entity_name'
      | 'invoicing_entity'
      | 'savings_plans_type'
      | 'savings_plan_arn'
      | 'reservation_id'
      | 'service_description'
      | 'sku_description'
  ]: string;
}

export interface IntraCloudComputeBillingMostExpensive {
  total_cost: number;
  [
    key:
      | 'product'
      | 'consumed_service'
      | 'resource_location'
      | 'resource_group'
      | 'meter_category'
      | 'meter_sub_category'
      | 'meter_name'
      | 'unit_of_measure'
      | 'pricing_model'
      | 'charge_type'
      | 'billing_profile_name'
      | 'customer_name'
      | 'cost_center'
      | 'service'
      | 'linked_account'
      | 'region'
      | 'az'
      | 'usage_type'
      | 'operation'
      | 'instance_type'
      | 'instance_type_family'
      | 'platform'
      | 'operating_system'
      | 'tenancy'
      | 'database_engine'
      | 'cache_engine'
      | 'deployment_option'
      | 'purchase_type'
      | 'record_type'
      | 'billing_entity'
      | 'legal_entity_name'
      | 'invoicing_entity'
      | 'savings_plans_type'
      | 'savings_plan_arn'
      | 'reservation_id'
      | 'service_description'
      | 'sku_description'
  ]: string;
  resource: string;
  resource_global_name?: string;
}

export interface IntraCloudComputeBillingLeastExpensive {
  total_cost: number;
  [
    key:
      | 'product'
      | 'consumed_service'
      | 'resource_location'
      | 'resource_group'
      | 'meter_category'
      | 'meter_sub_category'
      | 'meter_name'
      | 'unit_of_measure'
      | 'pricing_model'
      | 'charge_type'
      | 'billing_profile_name'
      | 'customer_name'
      | 'cost_center'
      | 'service'
      | 'linked_account'
      | 'region'
      | 'az'
      | 'usage_type'
      | 'operation'
      | 'instance_type'
      | 'instance_type_family'
      | 'platform'
      | 'operating_system'
      | 'tenancy'
      | 'database_engine'
      | 'cache_engine'
      | 'deployment_option'
      | 'purchase_type'
      | 'record_type'
      | 'billing_entity'
      | 'legal_entity_name'
      | 'invoicing_entity'
      | 'savings_plans_type'
      | 'savings_plan_arn'
      | 'reservation_id'
      | 'service_description'
      | 'sku_description'
  ]: string;
  resource: string;
  resource_global_name?: string;
}
