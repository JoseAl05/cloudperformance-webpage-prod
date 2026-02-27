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

export interface ForecastPeriod {
  period: string;
  predicted_spend_usd: number;
  confidence_level: string;
  key_drivers: string[];
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

export interface OpportunityCostAnalysis extends BaseMetricAnalysis {
  total_potential_savings_usd: number;
  savings_threshold_rule: string;
  resources_analysis: ResourceAnalysisReport;
}

export interface CostVolatilityAnalysis extends BaseMetricAnalysis {
  volatility_percentage: number;
  volatility_threshold: string;
  anomalous_resources: ResourceAnalysisReport;
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

export interface MaturityAssessmentAnalysis extends BaseMetricAnalysis {
  finops_maturity_level: string;
  maturity_level_description: string;
}

export interface AiFinopsMetricsForecast {
  strategy_used: string;
  data_points_analyzed: number;
  short_term_forecast: ForecastPeriod;
  long_term_forecast: ForecastPeriod;
  recommendation: string;
}
