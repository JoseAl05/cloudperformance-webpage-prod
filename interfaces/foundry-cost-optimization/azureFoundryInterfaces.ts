export type AzureFoundryConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export interface AzureFoundryUsage {
    dimension: string;
    dimension_label: string;
    tokens: number;
    cost_usd: number;
    payg_cost_usd: number;
    price_per_1m_usd: number | null;
}

export interface AzureFoundryMeter {
    meter_name: string;
    dimension: string;
    dimension_label: string;
    unit_of_measure: string;
    quantity: number;
    tokens: number;
    cost_usd: number;
}

export interface AzureFoundryDeployment {
    deployment_id: string;
    name: string;
    account_name: string;
    resource_group: string;
    location: string;
    sku_name: string;
    sku_capacity: number;
    current_capacity: number;
    model_version: string;
    tokens_input: number;
    tokens_output: number;
    tokens_total: number;
    allocation_share: number;
    allocated_cost_usd: number;
    is_idle: boolean;
}

export interface AzureFoundryCandidateDimension {
    dimension: string;
    dimension_label: string;
    tokens: number;
    azure_price_per_1m_usd: number | null;
    azure_cost_usd: number;
    bedrock_price_per_1m_usd: number;
    bedrock_cost_usd: number;
    delta_usd: number;
    price_source_dimension: string;
    dimension_fallback: boolean;
}

export interface AzureFoundryCandidate {
    bedrock_model_id: string;
    bedrock_model_name: string;
    provider: string | null;
    region: string;
    model_class: string;
    equivalence_class: string;
    input_modalities: string[];
    output_modalities: string[];
    inference_types_supported: string[];
    lifecycle_status: string | null;
    price_similarity: number;
    dimension_coverage: number;
    equivalence_score: number;
    price_ratios: Record<string, number>;
    confidence: AzureFoundryConfidence;
    priced: boolean;
    projected_cost_usd: number;
    azure_cost_usd: number;
    delta_usd: number;
    delta_percent: number;
    dimensions: AzureFoundryCandidateDimension[];
    dimension_fallback: boolean;
    missing_dimensions: string[];
    unresolved_price_rows: number;
    rationale: string;
    rank: number | null;
    is_recommended: boolean;
}

export interface AzureFoundryDeprecation {
    inference?: string;
    fine_tune?: string;
}

export interface AzureFoundryReplacementConfig {
    target_model_name: string;
    target_model_version: string;
    auto_upgrade_start_date: string;
    upgrade_on_expiry_lead_time_days: number;
}

export interface AzureFoundryModel {
    azure_model_name: string;
    azure_model_version: string;
    azure_model_format: string | null;
    model_class: string;
    model_class_label: string;
    lifecycle_status: string | null;
    deprecation: AzureFoundryDeprecation | null;
    replacement_config: AzureFoundryReplacementConfig | null;
    azure_cost_usd: number;
    azure_payg_cost_usd: number;
    tokens_total: number;
    usage: AzureFoundryUsage[];
    resource_locations: string[];
    account_ids: string[];
    meters: AzureFoundryMeter[];
    deployments: AzureFoundryDeployment[];
    deployments_total: number;
    deployments_idle: number;
    allocation_basis: string;
    azure_location: string | null;
    deployment_type: string | null;
    aws_region: string;
    price_variant: string;
    candidates: AzureFoundryCandidate[];
}

export interface AzureFoundrySummary {
    azure_cost_usd: number;
    bedrock_projected_cost_usd: number;
    delta_usd: number;
    delta_percent: number;
    coverage_percent: number;
    models_total: number;
    models_unmapped: number;
    deployments_total: number;
    deployments_idle: number;
}

export interface AzureFoundryMeterIssue {
    meter_name: string;
    meter_sub_category?: string;
    azure_model_name?: string;
    cost_usd: number;
}

export interface AzureFoundryCatalogBuild {
    foundation_models: number;
    usable_models: number;
    joined_models: number;
    unjoined_models: number;
    unjoined_sample: string[];
}

export interface AzureFoundryDiagnostics {
    bedrock_unresolved_price_rows: number;
    bedrock_catalog_models: number;
    bedrock_catalog_classes: Record<string, number>;
    bedrock_catalog_build: Record<string, AzureFoundryCatalogBuild>;
    billing_rows: number;
    accounts_matched: number;
}

export interface AzureFoundryComparison {
    account_name: string;
    account_id: string;
    account_kind: string | null;
    account_location: string | null;
    resource_group: string | null;
    subscription_id: string | null;
    summary: AzureFoundrySummary;
    models: AzureFoundryModel[];
    unmapped_meters: AzureFoundryMeterIssue[];
    unresolved_meters: AzureFoundryMeterIssue[];
    diagnostics: AzureFoundryDiagnostics;
}

export type AzureFoundryComparisonResponse = AzureFoundryComparison[];

export interface AzureFoundryCostBridgePoint {
    model: string;
    azure_cost_usd: number;
    bedrock_cost_usd: number;
    delta_usd: number;
    delta_percent: number;
    recommended_model: string;
    has_recommendation: boolean;
}

export interface AzureFoundryTokenMixPoint {
    model: string;
    input: number;
    cache_read: number;
    cache_write: number;
    output: number;
    total: number;
    input_cost: number;
    cache_read_cost: number;
    cache_write_cost: number;
    output_cost: number;
    total_cost: number;
}

export interface AzureFoundryCandidateConfidenceRow {
    azure_model_name: string;
    bedrock_model_name: string;
    provider: string;
    region: string;
    equivalence_score: number;
    delta_percent: number;
    projected_cost_usd: number;
    confidence: AzureFoundryConfidence;
    is_recommended: boolean;
    is_eligible: boolean;
}

export interface AzureFoundryDimensionLadderRow {
    dimension: string;
    dimension_label: string;
    tokens: number;
    token_share: number;
    azure_price_per_1m_usd: number | null;
    azure_cost_usd: number;
    bedrock_price_per_1m_usd: number | null;
    bedrock_cost_usd: number | null;
    delta_usd: number | null;
    dimension_fallback: boolean;
}

export interface AzureFoundryModelPanel {
    azure_model_name: string;
    azure_model_version: string;
    model_class_label: string;
    deployment_type: string;
    azure_location: string;
    aws_region: string;
    lifecycle_status: string;
    deprecation_label: string;
    azure_cost_usd: number;
    tokens_total: number;
    blended_price_per_1m_usd: number;
    deployments_total: number;
    deployments_idle: number;
    candidates_total: number;
    recommended_model: string;
    recommended_provider: string;
    recommended_confidence: string;
    recommended_cost_usd: number | null;
    recommended_delta_usd: number | null;
    recommended_delta_percent: number | null;
    recommended_equivalence: number | null;
    recommended_rationale: string;
    ladder: AzureFoundryDimensionLadderRow[];
}

export interface AzureFoundryDeploymentRow {
    deployment_id: string;
    name: string;
    azure_model_name: string;
    model_version: string;
    sku_name: string;
    location: string;
    resource_group: string;
    sku_capacity: number;
    tokens_input: number;
    tokens_output: number;
    tokens_total: number;
    allocation_share: number;
    allocated_cost_usd: number;
    is_idle: boolean;
    status_label: string;
}