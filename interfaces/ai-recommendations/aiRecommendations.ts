export interface AiRecommendationReference {
  title: string;
  url: string;
  relevance: string;
}

export interface AiRecommendationActionPlanRemediationSteps {
    title: string;
    description: string;
}

export interface AiRecommendationActionPlanPrerequisites {
    title: string;
    description: string;
}

export interface AiRecommendationActionPlan {
  remediation_steps: AiRecommendationActionPlanRemediationSteps[];
  prerequisites: AiRecommendationActionPlanPrerequisites[];
  references: AiRecommendationReference[];
}

export interface AiRecommendationImpactMatrixRiskLevel {
  level: string;
  description: string;
}

export interface AiRecommendationImpactMatrixOperationalImpact {
  level: string;
  description: string;
}

export interface AiRecommendationImpactMatrixReversibility {
  level: string;
  description: string;
}

export interface AiRecommendationImpactMatrixExecutionTime {
  estimated_time: string;
  description: string;
}

export interface AiRecommendationImpactMatrix {
  estimated_savings: string;
  savings_value: number;
  currency: string;
  risk_level: AiRecommendationImpactMatrixRiskLevel;
  operational_impact: AiRecommendationImpactMatrixOperationalImpact;
  reversibility: AiRecommendationImpactMatrixReversibility;
  execution_time: AiRecommendationImpactMatrixExecutionTime;
}

export interface AiRecommendationDiagnosis {
  summary: string;
  technical_justification: string;
  context_contrast: string;
  billing_analysis: string;
}

export interface AiRecommendationResource {
  resource_id: string | string[];
  resource_name: string | string[];
  resource_type: string;
  icon: string;
  recommendation_subtype: string;
  diagnosis: AiRecommendationDiagnosis;
  impact_matrix: AiRecommendationImpactMatrix;
  action_plan: AiRecommendationActionPlan;
}

export interface AiRecommendationPrioritizationStrategy {
  strategy_name: string;
  description: string;
}

export interface AiRecommendationReport {
  report_id: string;
  cloud_provider: string;
  timestamp: string;
  total_monthly_savings: number;
  executive_summary: string;
  prioritization_strategy: AiRecommendationPrioritizationStrategy[];
  resources: AiRecommendationResource[];
  sync_time: string;
}
