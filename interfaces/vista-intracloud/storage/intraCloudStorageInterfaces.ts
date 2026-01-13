export interface IntraCloudStorage {
  tenant_id: string;
  storage_data: IntraCloudStorageData | IntraCloudStorageMetrics[];
  metrics_summary: IntraCloudStorageMetricsSummary[];
  total_analyzed_count: number;
  resources_count: number;
}

export interface IntraCloudStorageData {
  [
    key:
      | 'Storage_Account'
      | 'Blob_Service'
      | 'File_Service'
      | 'Queue_Service'
      | 'Table_Service'
  ]: IntraCloudStorageMetrics[];
}

export interface IntraCloudStorageMetrics {
  value: number;
  timestamp: string;
  metric_name: string;
  service_type?: string;
}

export interface IntraCloudStorageMetricsSummary {
  value: number;
  metric_name: string;
  service_type?: string;
}

export interface IntraCloudStorageBilling {
  tenant_id: string;
  billing_data: IntraCloudStorageBillingData[];
  most_expensive: IntraCloudStorageBillingMostExpensive;
  least_expensive: IntraCloudStorageBillingLeastExpensive;
}

export interface IntraCloudStorageBillingData {
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
  ]: string;
}

export interface IntraCloudStorageBillingMostExpensive {
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
  ]: string;
  resource: string;
}

export interface IntraCloudStorageBillingLeastExpensive {
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
  ]: string;
  resource: string;
}
