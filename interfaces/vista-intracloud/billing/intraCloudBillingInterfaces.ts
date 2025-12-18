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
