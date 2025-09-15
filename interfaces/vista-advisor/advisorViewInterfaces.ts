export type AdvisorApiResponse = AllAdvisorRecommendations[];

export interface AllAdvisorRecommendations {
  category: string;
  recommendations: AllAdvisorRecommendationsData[];
  total_recommendations: number;
}

export interface AllAdvisorRecommendationsData {
  description: string;
  check_id: string;
  sync_time: string;
  name: string;
  check_details: AdvisorCheckDetails[] | [];
}

export interface AdvisorCheckDetails {
  categorySpecificSummary?: {
    costOptimizing?: {
      estimatedMonthlySavings?: number;
      estimatedPercentMonthlySavings?: number;
    };
  };
  flaggedResources?: AdvisorCheckDetailsFlaggedResources[];
  resourcesSummary?: {
    resourcesProcessed?: number;
    resourcesFlagged?: number;
    resourcesIgnored?: number;
    resourcesSuppressed?: number;
  };
  status?: string;
  sync_time?: string;
}

export interface AdvisorCheckDetailsFlaggedResources {
  status?: string;
  region?: string;
  resourceId?: string;
  isSuppressed?: boolean;
  metadata?: string[];
}
