export type AwsBedrockConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export type AwsBedrockProviderKey = 'foundry' | 'vertex';

export interface AwsBedrockUsage {
    dimension: string;
    dimension_label: string;
    tokens: number;
    priced_tokens: number;
    cost_usd: number;
    price_per_1m_usd: number | null;
}

export interface AwsBedrockMetric {
    metric_name: string;
    resource_id: string;
    resource_type: string;
    dimension: string;
    dimension_label: string;
    price_variant: string;
    datapoints: number;
    tokens: number;
    price_per_1m_usd: number | null;
    cost_usd: number;
}

export interface AwsBedrockResource {
    resource_id: string;
    name: string;
    resource_type: string;
    resource_type_label: string;
    location: string;
    price_variant: string;
    customization_type: string | null;
    tokens_input: number;
    tokens_output: number;
    tokens_total: number;
    allocation_share: number;
    allocated_cost_usd: number;
    is_idle: boolean;
}

export interface AwsBedrockCandidateDimension {
    dimension: string;
    dimension_label: string;
    tokens: number;
    aws_price_per_1m_usd: number | null;
    aws_cost_usd: number;
    price_per_1m_usd: number | null;
    cost_usd: number;
    delta_usd: number;
    price_source_dimension: string;
    dimension_fallback: boolean;
}

export interface AwsBedrockCandidate {
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
    confidence: AwsBedrockConfidence;
    priced: boolean;
    projected_cost_usd: number;
    aws_cost_usd: number;
    delta_usd: number;
    delta_percent: number;
    dimensions: AwsBedrockCandidateDimension[];
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

export interface AwsBedrockProviderCandidates {
    region: string | null;
    price_variant: string;
    candidates: AwsBedrockCandidate[];
}

export interface AwsBedrockModel {
    aws_model_name: string;
    aws_model_id: string;
    aws_model_version: string | null;
    aws_model_format: string | null;
    provider: string | null;
    model_class: string;
    model_class_label: string;
    input_modalities: string[] | null;
    output_modalities: string[] | null;
    inference_types_supported: string[] | null;
    lifecycle_status: string | null;
    aws_cost_usd: number;
    tokens_total: number;
    usage: AwsBedrockUsage[];
    resource_locations: string[];
    resource_types: string[];
    metrics: AwsBedrockMetric[];
    resources: AwsBedrockResource[];
    resources_total: number;
    resources_idle: number;
    allocation_basis: string;
    aws_region: string | null;
    price_variant: string;
    foundry: AwsBedrockProviderCandidates;
    vertex: AwsBedrockProviderCandidates;
}

export interface AwsBedrockSummary {
    aws_cost_usd: number;
    models_total: number;
    resources_total: number;
    resources_idle: number;
}

export interface AwsBedrockMetricIssue {
    metric_name: string;
    resource_id?: string;
    resource_type?: string;
    aws_model_id?: string;
    cost_usd: number;
}

export interface AwsBedrockCatalogBuildRegion {
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

export interface AwsBedrockPriceCatalog {
    unresolved_price_rows: number;
    catalog_models: number;
    catalog_build: Record<string, AwsBedrockCatalogBuildRegion>;
}

export interface AwsBedrockDiagnostics {
    metrics_rows: number;
    inference_profiles_matched: number;
    custom_deployments_matched: number;
    idle_resources_attached: number;
    models_enriched_with_metadata: number;
    price_catalog: AwsBedrockPriceCatalog;
    elapsed_ms: number;
    cache_entries: number;
    response_cache_hit: boolean;
}

export interface AwsBedrockProviderDiagnostics {
    unresolved_price_rows: number;
    catalog_models: number;
    catalog_classes: Record<string, number>;
    catalog_build: Record<string, AwsBedrockCatalogBuildRegion>;
}

export interface AwsBedrockProviderSummaryBase {
    aws_cost_usd: number;
    delta_usd: number;
    delta_percent: number;
    coverage_percent: number;
    models_total: number;
    models_unmapped: number;
}

export interface AwsBedrockFoundrySummary extends AwsBedrockProviderSummaryBase {
    foundry_projected_cost_usd: number;
}

export interface AwsBedrockVertexSummary extends AwsBedrockProviderSummaryBase {
    vertex_projected_cost_usd: number;
}

export interface AwsBedrockFoundryComparison {
    summary: AwsBedrockFoundrySummary;
    diagnostics: AwsBedrockProviderDiagnostics;
}

export interface AwsBedrockVertexComparison {
    summary: AwsBedrockVertexSummary;
    diagnostics: AwsBedrockProviderDiagnostics;
}

export interface AwsBedrockComparison {
    service_label: string | null;
    region: string | null;
    resource_id: string | null;
    resource_name: string | null;
    summary: AwsBedrockSummary;
    models: AwsBedrockModel[];
    unmapped_metrics: AwsBedrockMetricIssue[];
    unresolved_metrics: AwsBedrockMetricIssue[];
    diagnostics: AwsBedrockDiagnostics;
    foundry: AwsBedrockFoundryComparison;
    vertex: AwsBedrockVertexComparison;
}

export type AwsBedrockComparisonResponse = AwsBedrockComparison[];

export interface AwsBedrockCostBridgePoint {
    model: string;
    aws_cost_usd: number;
    projected_cost_usd: number;
    delta_usd: number;
    delta_percent: number;
    recommended_model: string;
    has_recommendation: boolean;
}

export interface AwsBedrockCandidateConfidenceRow {
    aws_model_name: string;
    candidate_model_name: string;
    provider: string;
    region: string;
    equivalence_score: number;
    delta_percent: number;
    projected_cost_usd: number;
    confidence: AwsBedrockConfidence;
    is_recommended: boolean;
    is_eligible: boolean;
}

export interface AwsBedrockDimensionLadderRow {
    dimension: string;
    dimension_label: string;
    tokens: number;
    token_share: number;
    aws_price_per_1m_usd: number | null;
    aws_cost_usd: number;
    candidate_price_per_1m_usd: number | null;
    candidate_cost_usd: number | null;
    delta_usd: number | null;
    dimension_fallback: boolean;
}

export interface AwsBedrockModelPanel {
    aws_model_name: string;
    aws_model_id: string;
    model_provider: string;
    model_class_label: string;
    resource_types_label: string;
    aws_region: string;
    candidate_region: string;
    lifecycle_status: string;
    aws_cost_usd: number;
    tokens_total: number;
    blended_price_per_1m_usd: number;
    resources_total: number;
    resources_idle: number;
    candidates_total: number;
    recommended_model: string;
    recommended_provider: string;
    recommended_confidence: string;
    recommended_cost_usd: number | null;
    recommended_delta_usd: number | null;
    recommended_delta_percent: number | null;
    recommended_equivalence: number | null;
    recommended_rationale: string;
    ladder: AwsBedrockDimensionLadderRow[];
}

export interface AwsBedrockResourceRow {
    resource_id: string;
    name: string;
    aws_model_name: string;
    aws_model_id: string;
    resource_type: string;
    resource_type_label: string;
    price_variant: string;
    location: string;
    tokens_input: number;
    tokens_output: number;
    tokens_total: number;
    allocation_share: number;
    allocated_cost_usd: number;
    is_idle: boolean;
    status_label: string;
}
