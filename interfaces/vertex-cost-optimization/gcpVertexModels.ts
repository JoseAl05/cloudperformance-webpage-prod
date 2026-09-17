export interface VertexRateObject {
  sku_id?: string;
  sku_ids?: string[];
  sku_descriptions?: string[];
  description?: string;
  meter_name?: string;
  price?: number;
  net_price?: number;
  price_per_1m_usd?: number;
  net_price_per_1m_usd?: number;
  unit?: string;
  currency?: string;
  effective_time?: string;
}

export interface VertexMeterDetail {
  source?: string | null;
  direction?: string | null;
  sku_id?: string | null;
  sku_description?: string | null;
  usage_amount?: number | null;
  usage_billed_amount?: number | null;
  usage_unit?: string | null;
  usage_billed_unit?: string | null;
  cost_gross_usd?: number | null;
  cost_net_usd?: number | null;
  credits_amount_usd?: number | null;
  price_effective?: number | null;
  location_region?: string | null;
  api_location?: string | null;
  usage_start_time?: string | null;
  usage_end_time?: string | null;
}

export interface VertexBillingPriceComparison {
  direction: string;
  tokens: number;
  catalog_cost_usd: number;
  billing_cost_usd: number;
  billing_gross_cost_usd?: number;
  delta_usd: number;
  delta_percent: number;
  catalog_rate?: VertexRateObject | null;
  billing_rate?: VertexRateObject | null;
}

export interface VertexSimilarityDetail {
  required?: string[];
  matched?: string[];
  missing?: string[];
  unknown?: string[];
  score?: number | null;
  source?: string;
  fallback_used?: string[];
  ratios?: Record<string, number>;
  price_similarity_pct?: number | null;
  dimension_coverage_pct?: number | null;
}

export interface VertexModelSimilarity {
  score?: number | null;
  level?: string;
  basis?: string;
  evidence_coverage_pct?: number | null;
  weights?: Record<string, number>;
  skills?: VertexSimilarityDetail;
  capabilities?: VertexSimilarityDetail;
  pricing?: VertexSimilarityDetail;
  category_alignment?: Record<string, unknown> | null;
  limitations?: string[];
}

export interface VertexTechnicalParityReport {
  is_100_percent_compatible?: boolean;
  missing_capabilities?: string[];
  infrastructure_warning?: string;
  current_max_tpm?: number;
  candidate_max_tpm?: number;
}

export interface VertexPriceComparison {
  modelName: string;
  provider: string;
  estimated_cost: number;
  cost_breakdown?: Record<string, number>;
  detailed_cost_breakdown?: Record<string, number>;
  base_rates?: Record<string, VertexRateObject>;
  detailed_base_rates?: Record<string, VertexRateObject>;
  delta_pct_vs_catalog?: number | null;
  delta_pct_vs_billing?: number | null;
  missing_rates?: string[];
  technical_parity_report?: VertexTechnicalParityReport;
  model_similarity?: VertexModelSimilarity;
  model_profile?: VertexModelProfile;
}

export interface VertexModelProfile {
  stars: number;
  tier: string;
  description: string;
}

export interface VertexModelCost {
  project_id: string;
  region: string;
  resource_id: string;
  resource_type: string;
  endpoint_id?: string | null;
  endpoint_name?: string | null;
  deployed_model_id?: string | null;
  model_id?: string | null;
  model_name: string;
  model_version: string;
  base_model?: string | null;
  provider: string;
  tokens: Record<string, number>;
  throughput?: Record<string, number>;
  cost_breakdown: Record<string, number>;
  total_cost: number;
  billing_cost_breakdown?: Record<string, number>;
  billing_gross_cost_breakdown?: Record<string, number>;
  billing_quantity_breakdown?: Record<string, number>;
  total_billing_cost?: number;
  total_billing_gross_cost?: number;
  billing_match_state?: string;
  catalog_rates: Record<string, VertexRateObject>;
  billing_rates?: Record<string, VertexRateObject>;
  meter_details?: VertexMeterDetail[];
  billing_price_comparison?: VertexBillingPriceComparison[];
  price_comparison?: VertexPriceComparison[];
  model_profile?: VertexModelProfile;
  missing_rates?: string[];
  data_state?: string;
}

export interface VertexPriceRateResponse {
  has_data: boolean;
  message?: string | null;
  data: VertexModelCost[];
}
