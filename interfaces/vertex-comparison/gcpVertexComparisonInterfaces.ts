export type GcpVertexConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export type GcpVertexProviderKey = 'bedrock' | 'foundry';

export interface GcpVertexUsage {
    dimension: string;
    dimension_label: string;
    tokens: number;
    cost_usd: number;
    catalog_cost_usd: number;
    price_per_1m_usd: number | null;
}

export interface GcpVertexMetric {
    metric_name: string;
    dimension: string;
    dimension_label: string;
    unit_of_measure: string;
    quantity: number;
    tokens: number;
    cost_usd: number;
}

export interface GcpVertexEndpoint {
    endpoint_id: string;
    name: string;
    project_id: string;
    location: string;
    deployed_model_id: string;
    traffic_percentage: number;
    model_version: string;
    tokens_input: number;
    tokens_output: number;
    tokens_total: number;
    allocation_share: number;
    allocated_cost_usd: number;
    is_idle: boolean;
}

export interface GcpVertexCandidateDimension {
    dimension: string;
    dimension_label: string;
    tokens: number;
    gcp_price_per_1m_usd: number | null;
    gcp_cost_usd: number;
    price_per_1m_usd: number | null;
    cost_usd: number;
    delta_usd: number;
    price_source_dimension: string;
    dimension_fallback: boolean;
}

export interface GcpVertexCandidate {
    model_id: string;
    model_name: string;
    provider: string | null;
    region: string | null;
    model_class: string;
    equivalence_class: string;
    input_modalities: string[] | null;
    output_modalities: string[] | null;
    inference_types_supported: string[] | null;
    lifecycle_status: string | null;
    price_similarity: number;
    dimension_coverage: number;
    equivalence_score: number;
    price_ratios: Record<string, number>;
    confidence: GcpVertexConfidence;
    priced: boolean;
    projected_cost_usd: number;
    gcp_cost_usd: number;
    delta_usd: number;
    delta_percent: number;
    dimensions: GcpVertexCandidateDimension[];
    dimension_fallback: boolean;
    missing_dimensions: string[];
    price_scope_sources: Record<string, string | null> | null;
    unresolved_price_rows: number | null;
    rationale: string;
    equivalent_models: string[];
    equivalent_models_count: number;
    rank: number | null;
    is_recommended: boolean;
}

export interface GcpVertexProviderCandidates {
    region: string | null;
    price_variant: string;
    candidates: GcpVertexCandidate[];
}

export interface GcpVertexDeprecation {
    inference?: string;
    fine_tune?: string;
}

export interface GcpVertexReplacementConfig {
    target_model_name: string;
    target_model_version: string;
    auto_upgrade_start_date: string;
    upgrade_on_expiry_lead_time_days: number;
}

export interface GcpVertexModel {
    gcp_model_name: string;
    gcp_model_version: string;
    gcp_base_model: string | null;
    gcp_model_format: string | null;
    model_class: string;
    model_class_label: string;
    lifecycle_status: string | null;
    deprecation: GcpVertexDeprecation | null;
    replacement_config: GcpVertexReplacementConfig | null;
    gcp_cost_usd: number;
    gcp_catalog_cost_usd: number;
    tokens_total: number;
    usage: GcpVertexUsage[];
    resource_locations: string[];
    project_ids: string[];
    metrics: GcpVertexMetric[];
    endpoints: GcpVertexEndpoint[];
    endpoints_total: number;
    endpoints_idle: number;
    allocation_basis: string;
    gcp_region: string | null;
    endpoint_type: string | null;
    bedrock: GcpVertexProviderCandidates;
    foundry: GcpVertexProviderCandidates;
}

export interface GcpVertexSummary {
    gcp_cost_usd: number;
    models_total: number;
    endpoints_total: number;
    endpoints_idle: number;
}

export interface GcpVertexMetricIssue {
    metric_name: string;
    metric_sub_category?: string;
    gcp_model_name?: string;
    cost_usd: number;
}

export interface GcpVertexCatalogBuildRegion {
    foundation_models?: number;
    usable_models?: number;
    price_groups?: number;
    joined_models?: number;
    unjoined_models?: number;
    unjoined_sample?: string[];
    price_catalog_versions?: Record<string, number>;
    price_rows?: number;
    excluded_rows?: number;
    unresolved_rows?: number;
    model_groups?: number;
    priced_models?: number;
    price_catalog_sync_time?: string;
}

export interface GcpVertexProviderDiagnostics {
    unresolved_price_rows: number;
    catalog_models: number;
    catalog_classes: Record<string, number>;
    catalog_build: Record<string, GcpVertexCatalogBuildRegion>;
}

export interface GcpVertexProviderSummaryBase {
    gcp_cost_usd: number;
    delta_usd: number;
    delta_percent: number;
    coverage_percent: number;
    models_total: number;
    models_unmapped: number;
}

export interface GcpVertexBedrockSummary extends GcpVertexProviderSummaryBase {
    bedrock_projected_cost_usd: number;
}

export interface GcpVertexFoundrySummary extends GcpVertexProviderSummaryBase {
    foundry_projected_cost_usd: number;
}

export interface GcpVertexBedrockComparison {
    summary: GcpVertexBedrockSummary;
    diagnostics: GcpVertexProviderDiagnostics;
}

export interface GcpVertexFoundryComparison {
    summary: GcpVertexFoundrySummary;
    diagnostics: GcpVertexProviderDiagnostics;
}

export interface GcpVertexDiagnostics {
    metrics_rows: number;
    endpoints_matched: number;
}

export interface GcpVertexComparison {
    project_id: string;
    project_number: string | null;
    service_label: string | null;
    region: string | null;
    resource_id: string | null;
    resource_name: string | null;
    summary: GcpVertexSummary;
    models: GcpVertexModel[];
    unmapped_metrics: GcpVertexMetricIssue[];
    unresolved_metrics: GcpVertexMetricIssue[];
    diagnostics: GcpVertexDiagnostics;
    bedrock: GcpVertexBedrockComparison;
    foundry: GcpVertexFoundryComparison;
}

export type GcpVertexComparisonResponse = GcpVertexComparison[];

export interface GcpVertexCostBridgePoint {
    model: string;
    gcp_cost_usd: number;
    projected_cost_usd: number;
    delta_usd: number;
    delta_percent: number;
    recommended_model: string;
    has_recommendation: boolean;
}

export interface GcpVertexTokenMixPoint {
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

export interface GcpVertexCandidateConfidenceRow {
    gcp_model_name: string;
    candidate_model_name: string;
    provider: string;
    region: string;
    equivalence_score: number;
    delta_percent: number;
    projected_cost_usd: number;
    confidence: GcpVertexConfidence;
    is_recommended: boolean;
    is_eligible: boolean;
}

export interface GcpVertexDimensionLadderRow {
    dimension: string;
    dimension_label: string;
    tokens: number;
    token_share: number;
    gcp_price_per_1m_usd: number | null;
    gcp_cost_usd: number;
    candidate_price_per_1m_usd: number | null;
    candidate_cost_usd: number | null;
    delta_usd: number | null;
    dimension_fallback: boolean;
}

export interface GcpVertexModelPanel {
    gcp_model_name: string;
    gcp_model_version: string;
    gcp_base_model: string | null;
    model_class_label: string;
    endpoint_type: string;
    gcp_region: string;
    candidate_region: string;
    lifecycle_status: string;
    deprecation_label: string;
    gcp_cost_usd: number;
    tokens_total: number;
    blended_price_per_1m_usd: number;
    endpoints_total: number;
    endpoints_idle: number;
    candidates_total: number;
    recommended_model: string;
    recommended_provider: string;
    recommended_confidence: string;
    recommended_cost_usd: number | null;
    recommended_delta_usd: number | null;
    recommended_delta_percent: number | null;
    recommended_equivalence: number | null;
    recommended_rationale: string;
    ladder: GcpVertexDimensionLadderRow[];
}

export interface GcpVertexEndpointRow {
    endpoint_id: string;
    name: string;
    gcp_model_name: string;
    model_version: string;
    location: string;
    project_id: string;
    traffic_percentage: number;
    tokens_input: number;
    tokens_output: number;
    tokens_total: number;
    allocation_share: number;
    allocated_cost_usd: number;
    is_idle: boolean;
    status_label: string;
}