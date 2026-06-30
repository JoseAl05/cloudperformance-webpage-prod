export type EffortLevel =
  | 'Low (Quick Win)'
  | 'Medium (Requires Planning)'
  | 'High (Architecture Change)';

export type Priority = 'Critical' | 'Warning' | 'Low';

export type TargetProfessional =
  | 'DevOps/SRE'
  | 'Finance'
  | 'Cloud Architect'
  | 'Software Engineer';

export type RiskLevel =
  | 'LOW (Safe to Apply)'
  | 'MEDIUM (Testing Required)'
  | 'HIGH (Potential Downtime / Breaking Change / Difficult to Revert)';

export type OperationalImpact =
  | 'NONE (Not affecting production operation)'
  | 'LOW (Might affect production operations)'
  | 'MEDIUM (Significant impact on production operations)'
  | 'HIGH (Critical impact on production operations)';

export type Reversibility =
  | 'EASY (Can be easily reversed if needed)'
  | 'MEDIUM (Requires careful planning to reverse)'
  | 'HARD (Very difficult or impossible to reverse)'
  | 'NOT REVERSIBLE (Cannot be reversed on any condition)';

export type MetricStatus = 'EXCELLENT' | 'WARNING' | 'CRITICAL';

export type ElasticityScore = 'HIGH' | 'LOW' | 'NONE';

export interface AiFinopsMetricsReferences {
  title: string;
  url: string;
  relevance: string;
}

interface BaseMetricAnalysis {
  status: MetricStatus;
  root_cause_analysis: string;
  recommendation: string;
  effort: EffortLevel;
  priority: Priority;
  risk: RiskLevel;
  assigned_to: string;
  metric_potential_savings_usd: number;
  references: AiFinopsMetricsReferences[];
  metric_name: string;
}

export interface ResourceDetail {
  resource_name: string;
  resource_id: string;
  resource_type: string;
  specific_evidence: string;
  suggested_action: string;
  potential_savings_usd?: number;
}

export interface ResourceAnalysisReport {
  resources_analyzed_count: number;
  resources_flagged_count: number;
  details: ResourceDetail[];
}

export interface ForecastPeriodKeyDrivers {
  value_detected: number;
  service_name: string;
  key_reason: string;
  anomaly_detected: string;
}

export interface ForecastPeriod {
  period: string;
  predicted_spend_usd: number;
  confidence_level: string;
  key_drivers: ForecastPeriodKeyDrivers[];
}

export interface AiFinopsMetrics {
  metadata: AiFinopsMetricsMetadata;
  global_score: number;
  global_score_explanation: string;
  total_potential_monthly_savings_usd: number;
  total_potential_monthly_savings_explanation: string;
  executive_summary: AiFinopsMetricsExecutiveSummary;
  metrics_summary: AiFinopsMetricsSummary;
  metrics_analysis: AiFinopsMetricsAnalysis;
  idle_resources?: IdleResources;
  spending_forecast: AiFinopsMetricsForecast;
}

export interface AiFinopsMetricsMetadata {
  cloud_provider: string;
  data_last_sync_time: string;
  report_generation_date: string;
}

export interface AiFinopsMetricsExecutiveSummary {
  cfo_summary: string;
  cto_summary: string;
}

export interface AiFinopsMetricsSummary {
  metrics_analyzed: AiFinopsMetricsSummaryAnalyzed[];
}

export interface AiFinopsMetricsSummaryAnalyzed {
  metric_name: string;
  top_3_actions: AiFinopsMetricsTopAction[];
}

export interface AiFinopsMetricsTopAction {
  action: string;
  risk_level: RiskLevel;
  operational_impact: OperationalImpact;
  reversibility: Reversibility;
  target_professional: TargetProfessional;
}

export interface AiFinopsMetricsAnalysis {
  opportunity_cost: OpportunityCostAnalysis;
  cost_volatility: CostVolatilityAnalysis;
  cpu_efficiency: CpuEfficiencyAnalysis;
  elasticity: ElasticityAnalysis;
  maturity_assessment: MaturityAssessmentAnalysis;
}

export interface OpportunityCostRecommendationAnalysis {
  recommendation_summary: string;
  oci_analysis: string;
}

export interface OpportunityCostAnalysis extends BaseMetricAnalysis {
  total_potential_savings_usd: number;
  total_inaction_costs_usd: number;
  recommendations_analysis: OpportunityCostRecommendationAnalysis[]
}

export interface CostVolatilityAnalysis extends BaseMetricAnalysis {
  volatility_percentage: number;
  volatility_threshold: string;
  anomalous_services?: {
    services_flagged_count: number;
    services_analyzed_count: number;
  };
  anomalous_resources?: {
    services_flagged_count: number;
    services_analyzed_count: number;
  };
}

export interface CpuEfficiencyAnalysis extends BaseMetricAnalysis {
  average_cpu_utilization: number;
  efficiency_target: string;
  underutilized_instances: ResourceAnalysisReport;
}

export interface ElasticityAnalysis extends BaseMetricAnalysis {
  elasticity_score: ElasticityScore;
  scaling_effectiveness: string;
  scaling_groups_analysis: ResourceAnalysisReport;
}

export interface MaturityAssessmentAnalysisCriteriaDetails {
  name?: string;
  detail_description?: string;
}

export interface MaturityAssessmentAnalysisCriteria {
  value: string;
  service_analyzed: string;
  expected_value: string;
  criteria: string;
  details: MaturityAssessmentAnalysisCriteriaDetails[];
}

export interface MaturityAssessmentAnalysisCapabilitiesAssessed {
  capability: string;
  level: string;
  evidence: string;
  gap: string;
}

export interface MaturityAssessmentAnalysis extends BaseMetricAnalysis {
  status: string;
  root_cause_analysis: string;
  recommendation: string;
  effort: string;
  priority: string;
  risk: string;
  assigned_to: string;
  references: string;
  metric_name: string;
  capabilities_assessed: MaturityAssessmentAnalysisCapabilitiesAssessed[];
}

export interface AiFinopsMetricsForecastDeterministic {
  engine: string;
  field_used: string;
  data_points_analyzed: number;
  frequency: string;
  season_length: number;
  preprocessing: {
    trailing_days_dropped: number;
    outlier_dates_adjusted: string[];
  };
  diagnostics: {
    daily_mean_usd: number;
    trend_slope_usd_per_day: number;
    trend_direction: string;
    weekly_seasonality_detected: boolean;
    coefficient_of_variation_pct: number;
    models_considered: string[];
    validation: {
      performed: boolean;
      horizon_days: number;
      n_windows: number;
    };
  };
  projections: {
    forecast_30d_autoets: number;
    forecast_90d_autoets: number;
    forecast_30d_autoarima: number;
    forecast_90d_autoarima: number;
    forecast_30d_autotheta: number;
    forecast_90d_autotheta: number;
    forecast_30d_ces: number;
    forecast_90d_ces: number;
  };
  interval_80_usd: {
    '30d': {
      low: number;
      point: number;
      high: number;
    };
    '90d': {
      low: number;
      point: number;
      high: number;
    };
  };
  backtest_mape_pct: {
    autoets: number;
    autoarima: number;
    autotheta: number;
    ces: number;
  };
  recommended_method: string;
  confidence_level: string;
}

export interface AiFinopsMetricsForecastAiInterpretation {
  strategy_used: string;
  formulas_used: {
    formula: string;
    description: string;
    selected_method: string;
  }[];
  data_points_analyzed: number;
  short_term_forecast: ForecastPeriod;
  long_term_forecast: ForecastPeriod;
  recommendation: string;
}

export interface AiFinopsMetricsForecast {
  deterministic: AiFinopsMetricsForecastDeterministic;
  ai_interpretation: AiFinopsMetricsForecastAiInterpretation;
}


export interface IdleDisk {
  id: string;
  name: string;
  managed_by: string | null;
  disk_state: string;
  disk_size_gb: number;
  reason: string;
  monthly_cost_in_usd: number;
}

export interface IdlePublicIp {
  id: string;
  name: string;
  allocation_method: string | null;
  monthly_cost_in_usd: number;
}

export interface IdleResources {
  metric: string;
  idle_disks: IdleDisk[];
  idle_public_ips: IdlePublicIp[];
  total_savings_usd: number;
}