export type RecommendationStatus = 'En ejecución' | 'Finalizada' | 'Rechazada' | 'Pospuesta';

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
  execution_status?: RecommendationStatus;
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

export interface RecommendationStatusEvent {
  report_id: string;
  recommendation_group_id: string;
  cloud_provider: string;
  resource_type: string;
  recommendation_subtype: string;
  resource_id: string | string[];
  resource_name: string | string[];
  recommendation_summary: string;
  action_plan: AiRecommendationActionPlan;
  execution_status: RecommendationStatus;
  status_assigned_at: string;
  recommendation_created_at: string;
  comment?: string;
}

export interface AssignExecutionStatusResponse {
  recommendation_updated: boolean;
  status_event_created: boolean;
  execution_status: RecommendationStatus;
  status_event_id: string | null;
  error_detail: string | null;
}

export interface RecommendationStatusGroupReport {
  report_id: string;
  cloud_provider: string;
  resource_type: string;
  recommendation_subtype: string;
  resource_id: string | string[];
  resource_name: string | string[];
  recommendation_summary: string;
  action_plan: AiRecommendationActionPlan;
  execution_status: RecommendationStatus;
  status_assigned_at: string;
  recommendation_created_at: string;
  comment: string | null;
}

export interface RecommendationStatusGroup {
  reports: RecommendationStatusGroupReport[];
  recommendation_group_id: string;
}