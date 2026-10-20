# Tipos (`interfaces/` y `types/`)

[← Índice](README.md)

Interfaces y tipos de las respuestas de las APIs, organizados por nube y vista.

Archivos:

- [`interfaces/ai-finops-metrics/aiFinopsMetricsInterfaces.ts`](#interfaces-ai-finops-metrics-aifinopsmetricsinterfaces-ts)
- [`interfaces/ai-recommendations/aiRecommendations.ts`](#interfaces-ai-recommendations-airecommendations-ts)
- [`interfaces/alertas.ts`](#interfaces-alertas-ts)
- [`interfaces/anomalias.ts`](#interfaces-anomalias-ts)
- [`interfaces/bedrock-comparison/awsBedrockComparisonInterfaces.ts`](#interfaces-bedrock-comparison-awsbedrockcomparisoninterfaces-ts)
- [`interfaces/bedrock-cost-optimization/customModels.ts`](#interfaces-bedrock-cost-optimization-custommodels-ts)
- [`interfaces/bedrock-cost-optimization/foundationModels.ts`](#interfaces-bedrock-cost-optimization-foundationmodels-ts)
- [`interfaces/bedrock-cost-optimization/inferenceProfiles.ts`](#interfaces-bedrock-cost-optimization-inferenceprofiles-ts)
- [`interfaces/billing.ts`](#interfaces-billing-ts)
- [`interfaces/consumption.ts`](#interfaces-consumption-ts)
- [`interfaces/foundry-cost-optimization/azureFoundryInterfaces.ts`](#interfaces-foundry-cost-optimization-azurefoundryinterfaces-ts)
- [`interfaces/foundry-cost-optimization/foundationModels.ts`](#interfaces-foundry-cost-optimization-foundationmodels-ts)
- [`interfaces/foundry-cost-optimization/promptOptimizationInterfaces.ts`](#interfaces-foundry-cost-optimization-promptoptimizationinterfaces-ts)
- [`interfaces/unused.ts`](#interfaces-unused-ts)
- [`interfaces/vertex-comparison/gcpVertexComparisonInterfaces.ts`](#interfaces-vertex-comparison-gcpvertexcomparisoninterfaces-ts)
- [`interfaces/vertex-cost-optimization/gcpVertexModels.ts`](#interfaces-vertex-cost-optimization-gcpvertexmodels-ts)
- [`interfaces/vista-advisor/advisorViewInterfaces.ts`](#interfaces-vista-advisor-advisorviewinterfaces-ts)
- [`interfaces/vista-blob-vs-storage/allStorageCapacityInterfaces.ts`](#interfaces-vista-blob-vs-storage-allstoragecapacityinterfaces-ts)
- [`interfaces/vista-blob-vs-storage/strgVsGeneralInterfaces.ts`](#interfaces-vista-blob-vs-storage-strgvsgeneralinterfaces-ts)
- [`interfaces/vista-cloudsql/cSqlInterfaces.ts`](#interfaces-vista-cloudsql-csqlinterfaces-ts)
- [`interfaces/vista-compute-engine/cEInterfaces.ts`](#interfaces-vista-compute-engine-ceinterfaces-ts)
- [`interfaces/vista-ec2/ec2EventsResourceViewInterfaces.ts`](#interfaces-vista-ec2-ec2eventsresourceviewinterfaces-ts)
- [`interfaces/vista-ec2/ec2MetricsResourceViewInterfaces.ts`](#interfaces-vista-ec2-ec2metricsresourceviewinterfaces-ts)
- [`interfaces/vista-ec2/ec2ResourceViewInterfaces.ts`](#interfaces-vista-ec2-ec2resourceviewinterfaces-ts)
- [`interfaces/vista-eventos/eventsViewInterfaces.ts`](#interfaces-vista-eventos-eventsviewinterfaces-ts)
- [`interfaces/vista-gke/gkeInterfaces.ts`](#interfaces-vista-gke-gkeinterfaces-ts)
- [`interfaces/vista-infrautilizadas/ec2ResourceInfraUsedViewInterface.ts`](#interfaces-vista-infrautilizadas-ec2resourceinfrausedviewinterface-ts)
- [`interfaces/vista-instance-group/iGInterfaces.ts`](#interfaces-vista-instance-group-iginterfaces-ts)
- [`interfaces/vista-intracloud/billing/intraCloudBillingInterfaces.ts`](#interfaces-vista-intracloud-billing-intracloudbillinginterfaces-ts)
- [`interfaces/vista-intracloud/compute/intraCloudComputeInterfaces.ts`](#interfaces-vista-intracloud-compute-intracloudcomputeinterfaces-ts)
- [`interfaces/vista-intracloud/storage/intraCloudDisksInterfaces.ts`](#interfaces-vista-intracloud-storage-intraclouddisksinterfaces-ts)
- [`interfaces/vista-intracloud/storage/intraCloudStorageInterfaces.ts`](#interfaces-vista-intracloud-storage-intracloudstorageinterfaces-ts)
- [`interfaces/vista-promedio-por-localizacion/avgByLocationInterfaces.ts`](#interfaces-vista-promedio-por-localizacion-avgbylocationinterfaces-ts)
- [`interfaces/vista-recommender/gcpRecommenderInterfaces.ts`](#interfaces-vista-recommender-gcprecommenderinterfaces-ts)
- [`interfaces/vista-spot-vs-regular-vm/spotVsRegularVmInterfaces.ts`](#interfaces-vista-spot-vs-regular-vm-spotvsregularvminterfaces-ts)
- [`interfaces/vista-top-s3-buckets/topS3BucketsInterfaces.ts`](#interfaces-vista-top-s3-buckets-tops3bucketsinterfaces-ts)
- [`interfaces/vista-traffic-manager/trafficManagerAvgQueriesReturnedInterfaces.ts`](#interfaces-vista-traffic-manager-trafficmanageravgqueriesreturnedinterfaces-ts)
- [`interfaces/vista-traffic-manager/trafficManagerInterfaces.ts`](#interfaces-vista-traffic-manager-trafficmanagerinterfaces-ts)
- [`interfaces/vista-variacion-storage/variationStorageInterfaces.ts`](#interfaces-vista-variacion-storage-variationstorageinterfaces-ts)
- [`interfaces/vista-variacion-tendencia-uso-de-recursos/variacionTendenciaUsoDeRecursosViewInterface.ts`](#interfaces-vista-variacion-tendencia-uso-de-recursos-variaciontendenciausoderecursosviewinterface-ts)
- [`interfaces/workingHours.ts`](#interfaces-workinghours-ts)
- [`types/db.ts`](#types-db-ts)
- [`types/index.ts`](#types-index-ts)

<a id="interfaces-ai-finops-metrics-aifinopsmetricsinterfaces-ts"></a>
## `interfaces/ai-finops-metrics/aiFinopsMetricsInterfaces.ts`

**Tipos**

Exporta:

- tipo `EffortLevel` = `| 'Low (Quick Win)' | 'Medium (Requires Planning)' | 'High (Architecture Change)'`
- tipo `Priority` = `'Critical' | 'Warning' | 'Low'`
- tipo `TargetProfessional` = `| 'DevOps/SRE' | 'Finance' | 'Cloud Architect' | 'Software Engineer'`
- tipo `RiskLevel` = `| 'LOW (Safe to Apply)' | 'MEDIUM (Testing Required)' | 'HIGH (Potential Downtime / Breaking Change / Difficult to Reve…`
- tipo `OperationalImpact` = `| 'NONE (Not affecting production operation)' | 'LOW (Might affect production operations)' | 'MEDIUM (Significant impac…`
- tipo `Reversibility` = `| 'EASY (Can be easily reversed if needed)' | 'MEDIUM (Requires careful planning to reverse)' | 'HARD (Very difficult o…`
- tipo `MetricStatus` = `'EXCELLENT' | 'WARNING' | 'CRITICAL'`
- tipo `ElasticityScore` = `'HIGH' | 'LOW' | 'NONE'`
- interfaz `AiFinopsMetricsReferences`
- interfaz `ResourceDetail`
- interfaz `ResourceAnalysisReport`
- interfaz `ForecastPeriodKeyDrivers`
- interfaz `ForecastPeriod`
- interfaz `AiFinopsMetrics`
- interfaz `AiFinopsMetricsMetadata`
- interfaz `AiFinopsMetricsExecutiveSummary`
- interfaz `AiFinopsMetricsSummary`
- interfaz `AiFinopsMetricsSummaryAnalyzed`
- interfaz `AiFinopsMetricsTopAction`
- interfaz `AiFinopsMetricsAnalysis`
- interfaz `OpportunityCostRecommendationAnalysis`
- interfaz `OpportunityCostAnalysis`
- interfaz `CostVolatilityAnalysis`
- interfaz `CpuEfficiencyAnalysis`
- interfaz `ElasticityAnalysis`
- interfaz `MaturityAssessmentAnalysisCriteriaDetails`
- interfaz `MaturityAssessmentAnalysisCriteria`
- interfaz `MaturityAssessmentAnalysisCapabilitiesAssessed`
- interfaz `MaturityAssessmentAnalysis`
- interfaz `AiFinopsMetricsForecastDeterministic`
- interfaz `AiFinopsMetricsForecastDeterministicIncomplete`
- interfaz `AiFinopsMetricsForecastAiInterpretation`
- interfaz `AiFinopsMetricsForecast`
- interfaz `IdleDisk`
- interfaz `IdlePublicIp`
- interfaz `IdleResources`

Interfaz `AiFinopsMetricsReferences` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `title` | `string` | no | — |
| `url` | `string` | no | — |
| `relevance` | `string` | no | — |

Interfaz `BaseMetricAnalysis`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `status` | `MetricStatus` | no | — |
| `root_cause_analysis` | `string` | no | — |
| `recommendation` | `string` | no | — |
| `effort` | `EffortLevel` | no | — |
| `priority` | `Priority` | no | — |
| `risk` | `RiskLevel` | no | — |
| `assigned_to` | `string` | no | — |
| `metric_potential_savings_usd` | `number` | no | — |
| `references` | `AiFinopsMetricsReferences[]` | no | — |
| `metric_name` | `string` | no | — |

Interfaz `ResourceDetail` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource_name` | `string` | no | — |
| `resource_id` | `string` | no | — |
| `resource_type` | `string` | no | — |
| `specific_evidence` | `string` | no | — |
| `suggested_action` | `string` | no | — |
| `potential_savings_usd` | `number` | sí | — |

Interfaz `ResourceAnalysisReport` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resources_analyzed_count` | `number` | no | — |
| `resources_flagged_count` | `number` | no | — |
| `details` | `ResourceDetail[]` | no | — |

Interfaz `ForecastPeriodKeyDrivers` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `value_detected` | `number` | no | — |
| `service_name` | `string` | no | — |
| `key_reason` | `string` | no | — |
| `anomaly_detected` | `string` | no | — |

Interfaz `ForecastPeriod` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `period` | `string` | no | — |
| `predicted_spend_usd` | `number` | no | — |
| `confidence_level` | `string` | no | — |
| `key_drivers` | `ForecastPeriodKeyDrivers[]` | no | — |

Interfaz `AiFinopsMetrics` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metadata` | `AiFinopsMetricsMetadata` | no | — |
| `global_score` | `number` | no | — |
| `global_score_explanation` | `string` | no | — |
| `total_potential_monthly_savings_usd` | `number` | no | — |
| `total_potential_monthly_savings_explanation` | `string` | no | — |
| `executive_summary` | `AiFinopsMetricsExecutiveSummary` | no | — |
| `metrics_summary` | `AiFinopsMetricsSummary` | no | — |
| `metrics_analysis` | `AiFinopsMetricsAnalysis` | no | — |
| `idle_resources` | `IdleResources` | sí | — |
| `spending_forecast` | `AiFinopsMetricsForecast` | no | — |

Interfaz `AiFinopsMetricsMetadata` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud_provider` | `string` | no | — |
| `data_last_sync_time` | `string` | no | — |
| `report_generation_date` | `string` | no | — |

Interfaz `AiFinopsMetricsExecutiveSummary` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cfo_summary` | `string` | no | — |
| `cto_summary` | `string` | no | — |

Interfaz `AiFinopsMetricsSummary` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metrics_analyzed` | `AiFinopsMetricsSummaryAnalyzed[]` | no | — |

Interfaz `AiFinopsMetricsSummaryAnalyzed` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_name` | `string` | no | — |
| `top_3_actions` | `AiFinopsMetricsTopAction[]` | no | — |

Interfaz `AiFinopsMetricsTopAction` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `action` | `string` | no | — |
| `risk_level` | `RiskLevel` | no | — |
| `operational_impact` | `OperationalImpact` | no | — |
| `reversibility` | `Reversibility` | no | — |
| `target_professional` | `TargetProfessional` | no | — |

Interfaz `AiFinopsMetricsAnalysis` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `opportunity_cost` | `OpportunityCostAnalysis` | no | — |
| `cost_volatility` | `CostVolatilityAnalysis` | no | — |
| `cpu_efficiency` | `CpuEfficiencyAnalysis` | no | — |
| `elasticity` | `ElasticityAnalysis` | no | — |
| `maturity_assessment` | `MaturityAssessmentAnalysis` | no | — |

Interfaz `OpportunityCostRecommendationAnalysis` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `recommendation_summary` | `string` | no | — |
| `oci_analysis` | `string` | no | — |

Interfaz `OpportunityCostAnalysis` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `total_potential_savings_usd` | `number` | no | — |
| `total_inaction_costs_usd` | `number` | no | — |
| `recommendations_analysis` | `OpportunityCostRecommendationAnalysis[]` | no | — |

Interfaz `CostVolatilityAnalysis` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `volatility_percentage` | `number` | no | — |
| `volatility_threshold` | `string` | no | — |
| `anomalous_services` | `{ services_flagged_count: number; services_analyzed_count: number; }` | sí | — |
| `anomalous_resources` | `{ services_flagged_count: number; services_analyzed_count: number; }` | sí | — |

Interfaz `CpuEfficiencyAnalysis` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `average_cpu_utilization` | `number` | no | — |
| `efficiency_target` | `string` | no | — |
| `underutilized_instances` | `ResourceAnalysisReport` | no | — |

Interfaz `ElasticityAnalysis` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `elasticity_score` | `ElasticityScore` | no | — |
| `scaling_effectiveness` | `string` | no | — |
| `scaling_groups_analysis` | `ResourceAnalysisReport` | no | — |

Interfaz `MaturityAssessmentAnalysisCriteriaDetails` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `name` | `string` | sí | — |
| `detail_description` | `string` | sí | — |

Interfaz `MaturityAssessmentAnalysisCriteria` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `value` | `string` | no | — |
| `service_analyzed` | `string` | no | — |
| `expected_value` | `string` | no | — |
| `criteria` | `string` | no | — |
| `details` | `MaturityAssessmentAnalysisCriteriaDetails[]` | no | — |

Interfaz `MaturityAssessmentAnalysisCapabilitiesAssessed` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `capability` | `string` | no | — |
| `level` | `string` | no | — |
| `evidence` | `string` | no | — |
| `gap` | `string` | no | — |

Interfaz `MaturityAssessmentAnalysis` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `status` | `string` | no | — |
| `root_cause_analysis` | `string` | no | — |
| `recommendation` | `string` | no | — |
| `effort` | `string` | no | — |
| `priority` | `string` | no | — |
| `risk` | `string` | no | — |
| `assigned_to` | `string` | no | — |
| `references` | `string` | no | — |
| `metric_name` | `string` | no | — |
| `capabilities_assessed` | `MaturityAssessmentAnalysisCapabilitiesAssessed[]` | no | — |

Interfaz `AiFinopsMetricsForecastDeterministic` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `engine` | `string` | no | — |
| `field_used` | `string` | no | — |
| `data_points_analyzed` | `number` | no | — |
| `frequency` | `string` | no | — |
| `season_length` | `number` | no | — |
| `preprocessing` | `{ trailing_days_dropped: number; outlier_dates_adjusted: string[]; }` | no | — |
| `diagnostics` | `{ daily_mean_usd: number; trend_slope_usd_per_day: number; trend_dire…` | no | — |
| `projections` | `{ forecast_30d_autoets: number; forecast_90d_autoets: number; forecas…` | no | — |
| `interval_80_usd` | `{ '30d': { low: number; point: number; high: number; }; '90d': { low:…` | no | — |
| `backtest_mape_pct` | `{ autoets: number; autoarima: number; autotheta: number; ces: number;…` | no | — |
| `backtest_wape_pct` | `{ autoets?: number; autoarima?: number; autotheta?: number; ces?: num…` | sí | — |
| `recommended_method` | `string` | no | — |
| `confidence_level` | `string` | no | — |

Interfaz `AiFinopsMetricsForecastDeterministicIncomplete` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `status` | `string` | no | — |
| `data_points_analyzed` | `number` | no | — |

Interfaz `AiFinopsMetricsForecastAiInterpretation` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `strategy_used` | `string` | no | — |
| `formulas_used` | `{ formula: string; description: string; selected_method: string; }[]` | no | — |
| `data_points_analyzed` | `number` | no | — |
| `short_term_forecast` | `ForecastPeriod` | no | — |
| `long_term_forecast` | `ForecastPeriod` | no | — |
| `recommendation` | `string` | no | — |

Interfaz `AiFinopsMetricsForecast` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `deterministic` | `\| AiFinopsMetricsForecastDeterministic \| AiFinopsMetricsForecastDeter…` | no | — |
| `ai_interpretation` | `AiFinopsMetricsForecastAiInterpretation` | no | — |

Interfaz `IdleDisk` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string` | no | — |
| `name` | `string` | no | — |
| `managed_by` | `string \| null` | no | — |
| `disk_state` | `string` | no | — |
| `disk_size_gb` | `number` | no | — |
| `reason` | `string` | no | — |
| `monthly_cost_in_usd` | `number` | no | — |

Interfaz `IdlePublicIp` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string` | no | — |
| `name` | `string` | no | — |
| `allocation_method` | `string \| null` | no | — |
| `monthly_cost_in_usd` | `number` | no | — |

Interfaz `IdleResources` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric` | `string` | no | — |
| `idle_disks` | `IdleDisk[]` | no | — |
| `idle_public_ips` | `IdlePublicIp[]` | no | — |
| `total_savings_usd` | `number` | no | — |

- Usado por: [`AiFinopsMetricsComponent.tsx`](components/ai-finops-metrics.md#components-ai-finops-metrics-aifinopsmetricscomponent-tsx), [`DetailedMetricsAnalysis.tsx`](components/ai-finops-metrics.md#components-ai-finops-metrics-details-detailedmetricsanalysis-tsx), [`GeneralStatus.tsx`](components/ai-finops-metrics.md#components-ai-finops-metrics-general-status-generalstatus-tsx), [`AnalyzedMetricsSummary.tsx`](components/ai-finops-metrics.md#components-ai-finops-metrics-summary-analyzedmetricssummary-tsx), [`FinancialSummary.tsx`](components/ai-finops-metrics.md#components-ai-finops-metrics-summary-financialsummary-tsx), [`IdleResources.tsx`](components/ai-finops-metrics.md#components-ai-finops-metrics-summary-idleresources-tsx), [`TechnicalSummary.tsx`](components/ai-finops-metrics.md#components-ai-finops-metrics-summary-technicalsummary-tsx)

---

<a id="interfaces-ai-recommendations-airecommendations-ts"></a>
## `interfaces/ai-recommendations/aiRecommendations.ts`

**Tipos**

Exporta:

- tipo `RecommendationStatus` = `'En ejecución' | 'Finalizada' | 'Rechazada' | 'Pospuesta'`
- interfaz `AiRecommendationReference`
- interfaz `AiRecommendationActionPlanRemediationSteps`
- interfaz `AiRecommendationActionPlanPrerequisites`
- interfaz `AiRecommendationActionPlan`
- interfaz `AiRecommendationImpactMatrixRiskLevel`
- interfaz `AiRecommendationImpactMatrixOperationalImpact`
- interfaz `AiRecommendationImpactMatrixReversibility`
- interfaz `AiRecommendationImpactMatrixExecutionTime`
- interfaz `AiRecommendationImpactMatrix`
- interfaz `AiRecommendationDiagnosis`
- interfaz `AiRecommendationResource`
- interfaz `AiRecommendationPrioritizationStrategy`
- interfaz `AiRecommendationReport`
- interfaz `RecommendationStatusEvent`
- interfaz `AssignExecutionStatusResponse`
- interfaz `JiraTicketReference`
- interfaz `ServiceNowTicketReference`
- interfaz `RecommendationStatusGroupReport`
- interfaz `RecommendationStatusGroup`
- interfaz `CreateJiraTicketResponse`
- interfaz `CreateServiceNowTicketResponse`
- interfaz `TicketValidationResult`
- interfaz `BatchValidationResponse`
- interfaz `ValidationItem`

Interfaz `AiRecommendationReference` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `title` | `string` | no | — |
| `url` | `string` | no | — |
| `relevance` | `string` | no | — |

Interfaz `AiRecommendationActionPlanRemediationSteps` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `title` | `string` | no | — |
| `description` | `string` | no | — |

Interfaz `AiRecommendationActionPlanPrerequisites` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `title` | `string` | no | — |
| `description` | `string` | no | — |

Interfaz `AiRecommendationActionPlan` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `remediation_steps` | `AiRecommendationActionPlanRemediationSteps[]` | no | — |
| `prerequisites` | `AiRecommendationActionPlanPrerequisites[]` | no | — |
| `references` | `AiRecommendationReference[]` | no | — |

Interfaz `AiRecommendationImpactMatrixRiskLevel` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `level` | `string` | no | — |
| `description` | `string` | no | — |

Interfaz `AiRecommendationImpactMatrixOperationalImpact` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `level` | `string` | no | — |
| `description` | `string` | no | — |

Interfaz `AiRecommendationImpactMatrixReversibility` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `level` | `string` | no | — |
| `description` | `string` | no | — |

Interfaz `AiRecommendationImpactMatrixExecutionTime` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `estimated_time` | `string` | no | — |
| `description` | `string` | no | — |

Interfaz `AiRecommendationImpactMatrix` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `estimated_savings` | `string` | no | — |
| `savings_value` | `number` | no | — |
| `potential_savings_value` | `number` | no | — |
| `potential_savings_confidence` | `number` | no | — |
| `currency` | `string` | no | — |
| `risk_level` | `AiRecommendationImpactMatrixRiskLevel` | no | — |
| `operational_impact` | `AiRecommendationImpactMatrixOperationalImpact` | no | — |
| `reversibility` | `AiRecommendationImpactMatrixReversibility` | no | — |
| `execution_time` | `AiRecommendationImpactMatrixExecutionTime` | no | — |

Interfaz `AiRecommendationDiagnosis` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `summary` | `string` | no | — |
| `technical_justification` | `string` | no | — |
| `context_contrast` | `string` | no | — |
| `billing_analysis` | `string` | no | — |

Interfaz `AiRecommendationResource` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `rec_group_id` | `string` | no | — |
| `resource_id` | `string \| string[]` | no | — |
| `resource_name` | `string[]` | no | — |
| `resource_type` | `string` | no | — |
| `icon` | `string` | no | — |
| `recommendation_subtype` | `string` | no | — |
| `provider` | `string` | sí | — |
| `diagnosis` | `AiRecommendationDiagnosis` | no | — |
| `impact_matrix` | `AiRecommendationImpactMatrix` | no | — |
| `action_plan` | `AiRecommendationActionPlan` | no | — |
| `execution_status` | `RecommendationStatus` | sí | — |

Interfaz `AiRecommendationPrioritizationStrategy` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `strategy_name` | `string` | no | — |
| `description` | `string` | no | — |

Interfaz `AiRecommendationReport` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `report_id` | `string` | no | — |
| `cloud_provider` | `string` | no | — |
| `timestamp` | `string` | no | — |
| `total_monthly_savings` | `number` | no | — |
| `total_potential_monthly_savings` | `number` | no | — |
| `confidence_potential_monthly_savings` | `string` | no | — |
| `executive_summary` | `string` | no | — |
| `prioritization_strategy` | `AiRecommendationPrioritizationStrategy[]` | no | — |
| `resources` | `AiRecommendationResource[]` | no | — |
| `sync_time` | `string` | no | — |
| `past_recommendations_execution` | `{ resources: AiRecommendationResource[]; report_id: string; timestamp…` | sí | — |

Interfaz `RecommendationStatusEvent` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `report_id` | `string` | no | — |
| `recommendation_group_id` | `string` | no | — |
| `cloud_provider` | `string` | no | — |
| `resource_type` | `string` | no | — |
| `recommendation_subtype` | `string` | no | — |
| `resource_id` | `string \| string[]` | no | — |
| `resource_name` | `string \| string[]` | no | — |
| `recommendation_summary` | `string` | no | — |
| `action_plan` | `AiRecommendationActionPlan` | no | — |
| `execution_status` | `RecommendationStatus` | no | — |
| `saving_value` | `number` | no | — |
| `status_assigned_at` | `string` | no | — |
| `recommendation_created_at` | `string` | no | — |
| `comment` | `string` | sí | — |

Interfaz `AssignExecutionStatusResponse` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `recommendation_updated` | `boolean` | no | — |
| `status_event_created` | `boolean` | no | — |
| `execution_status` | `RecommendationStatus` | no | — |
| `status_event_id` | `string \| null` | no | — |
| `error_detail` | `string \| null` | no | — |

Interfaz `JiraTicketReference` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `created_at` | `string` | no | — |
| `key` | `string` | no | — |
| `subtasks` | `string[]` | no | — |
| `url` | `string` | no | — |

Interfaz `ServiceNowTicketReference` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `created_at` | `string` | no | — |
| `key` | `string` | no | — |
| `sys_id` | `string` | no | — |
| `table` | `string` | no | — |
| `url` | `string` | no | — |
| `subtasks` | `string[]` | no | — |

Interfaz `RecommendationStatusGroupReport` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `report_id` | `string` | no | — |
| `cloud_provider` | `string` | no | — |
| `resource_type` | `string` | no | — |
| `recommendation_subtype` | `string` | no | — |
| `resource_id` | `string \| string[]` | no | — |
| `resource_name` | `string \| string[]` | no | — |
| `recommendation_summary` | `string` | no | — |
| `action_plan` | `AiRecommendationActionPlan` | no | — |
| `execution_status` | `RecommendationStatus` | no | — |
| `saving_value` | `number` | no | — |
| `status_assigned_at` | `string` | no | — |
| `recommendation_created_at` | `string` | no | — |
| `comment` | `string \| null` | no | — |
| `jira_ticket` | `JiraTicketReference` | sí | — |
| `servicenow_ticket` | `ServiceNowTicketReference` | sí | — |

Interfaz `RecommendationStatusGroup` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `reports` | `RecommendationStatusGroupReport[]` | no | — |
| `recommendation_group_id` | `string` | no | — |

Interfaz `CreateJiraTicketResponse` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `issue` | `Record<string, unknown>` | no | — |
| `key` | `string` | no | — |
| `subtasks` | `string[]` | no | — |
| `subtask_errors` | `string[]` | no | — |
| `transition_errors` | `string[]` | no | — |
| `persistence_warning` | `string \| null` | no | — |

Interfaz `CreateServiceNowTicketResponse` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `record` | `Record<string, unknown>` | no | — |
| `key` | `string` | no | — |
| `sys_id` | `string` | no | — |
| `url` | `string` | no | — |
| `subtasks` | `string[]` | no | — |
| `subtask_errors` | `string[]` | no | — |
| `persistence_warning` | `string \| null` | no | — |

Interfaz `TicketValidationResult` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `exists` | `boolean` | no | — |
| `key` | `string` | no | — |
| `summary` | `string \| null` | sí | — |
| `status` | `string \| null` | sí | — |
| `issue_type` | `string \| null` | sí | — |
| `sys_id` | `string \| null` | sí | — |
| `url` | `string \| null` | sí | — |
| `error` | `string` | sí | — |
| `cleanup_status` | `string \| null` | sí | — |

Interfaz `BatchValidationResponse` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `results` | `Record<string, TicketValidationResult>` | no | — |

Interfaz `ValidationItem` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `issue_key` | `string` | no | — |
| `rec_group_id` | `string` | no | — |
| `cloud_provider` | `string` | no | — |

- Usado por: [`AiRecommendationStatusHistoryComponent.tsx`](components/generales.md#components-airecommendationstatushistorycomponent-tsx), [`AiRecommendationsComponent.tsx`](components/generales.md#components-airecommendationscomponent-tsx), [`AiRecommendationsStatusDialogComponent.tsx`](components/generales.md#components-airecommendationsstatusdialogcomponent-tsx), [`AiRecommendationStatusesComponent.tsx`](components/ai-recommendation-statuses.md#components-ai-recommendation-statuses-airecommendationstatusescomponent-tsx), [`AiRecommendationStatusesInfoComponent.tsx`](components/ai-recommendation-statuses.md#components-ai-recommendation-statuses-info-airecommendationstatusesinfocomponent-tsx), [`AdvisorViewComponent.tsx`](components/aws/vista-advisor.md#components-aws-vista-advisor-advisorviewcomponent-tsx), [`AdvisorViewComponent.tsx`](components/azure/vista-advisor.md#components-azure-vista-advisor-advisorviewcomponent-tsx), [`RecommenderComponent.tsx`](components/gcp/vista-recommender.md#components-gcp-vista-recommender-recommendercomponent-tsx)

---

<a id="interfaces-alertas-ts"></a>
## `interfaces/alertas.ts`

**Tipos**

Exporta:

- interfaz `AlertConfig`

Interfaz `AlertConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_id` | `string` | sí | — |
| `cloud_provider` | `string` | no | — |
| `project_id` | `string` | no | — |
| `service` | `string` | no | — |
| `threshold_amount` | `number` | no | — |
| `currency` | `string` | no | — |
| `alert_emails` | `string[]` | no | — |
| `warning_percentages` | `number[]` | sí | — |
| `triggered_warnings_this_month` | `number[]` | sí | — |
| `last_triggered` | `string \| Date` | sí | — |

- Usado por: [`BillingAlertsView.tsx`](components/alertas.md#components-alertas-billing-billingalertsview-tsx), [`BillingAlertForm.tsx`](components/alertas.md#components-alertas-billing-form-billingalertform-tsx), [`BillingAlertsTable.tsx`](components/alertas.md#components-alertas-billing-table-billingalertstable-tsx), [`billingAlertsColumns.tsx`](components/alertas.md#components-alertas-billing-table-billingalertscolumns-tsx), [`alertasService.ts`](lib.md#lib-alertasservice-ts)

---

<a id="interfaces-anomalias-ts"></a>
## `interfaces/anomalias.ts`

**Tipos**

Exporta:

- interfaz `AnomalyConfig`

Interfaz `AnomalyConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_id` | `string` | sí | — |
| `cloud_provider` | `string` | no | — |
| `project_id` | `string` | no | — |
| `service` | `string` | no | — |
| `sensitivity_percentage` | `number` | no | — |
| `comparison_period` | `'7d' \| '15d' \| '30d' \| 'previous_day'` | no | — |
| `alert_emails` | `string[]` | no | — |
| `status` | `'normal' \| 'spike_detected'` | sí | — |
| `last_triggered` | `string \| null` | sí | — |

- Usado por: [`AnomalyAlertsView.tsx`](components/alertas.md#components-alertas-anomalies-anomalyalertsview-tsx), [`AnomalyAlertForm.tsx`](components/alertas.md#components-alertas-anomalies-form-anomalyalertform-tsx), [`AnomalyAlertsTable.tsx`](components/alertas.md#components-alertas-anomalies-table-anomalyalertstable-tsx), [`anomalyAlertsColumns.tsx`](components/alertas.md#components-alertas-anomalies-table-anomalyalertscolumns-tsx), [`alertasAnomaliasService.ts`](lib.md#lib-alertasanomaliasservice-ts)

---

<a id="interfaces-bedrock-comparison-awsbedrockcomparisoninterfaces-ts"></a>
## `interfaces/bedrock-comparison/awsBedrockComparisonInterfaces.ts`

**Tipos**

Exporta:

- tipo `AwsBedrockConfidence` = `'HIGH' | 'MEDIUM' | 'LOW'`
- tipo `AwsBedrockProviderKey` = `'foundry' | 'vertex'`
- interfaz `AwsBedrockUsage`
- interfaz `AwsBedrockMetric`
- interfaz `AwsBedrockResource`
- interfaz `AwsBedrockCandidateDimension`
- interfaz `AwsBedrockCandidate`
- interfaz `AwsBedrockProviderCandidates`
- interfaz `AwsBedrockModel`
- interfaz `AwsBedrockSummary`
- interfaz `AwsBedrockMetricIssue`
- interfaz `AwsBedrockCatalogBuildRegion`
- interfaz `AwsBedrockPriceCatalog`
- interfaz `AwsBedrockDiagnostics`
- interfaz `AwsBedrockProviderDiagnostics`
- interfaz `AwsBedrockProviderSummaryBase`
- interfaz `AwsBedrockFoundrySummary`
- interfaz `AwsBedrockVertexSummary`
- interfaz `AwsBedrockFoundryComparison`
- interfaz `AwsBedrockVertexComparison`
- interfaz `AwsBedrockComparison`
- tipo `AwsBedrockComparisonResponse` = `AwsBedrockComparison[]`
- interfaz `AwsBedrockCostBridgePoint`
- interfaz `AwsBedrockCandidateConfidenceRow`
- interfaz `AwsBedrockDimensionLadderRow`
- interfaz `AwsBedrockModelPanel`
- interfaz `AwsBedrockResourceRow`

Interfaz `AwsBedrockUsage` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `dimension` | `string` | no | — |
| `dimension_label` | `string` | no | — |
| `tokens` | `number` | no | — |
| `priced_tokens` | `number` | no | — |
| `cost_usd` | `number` | no | — |
| `price_per_1m_usd` | `number \| null` | no | — |

Interfaz `AwsBedrockMetric` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_name` | `string` | no | — |
| `resource_id` | `string` | no | — |
| `resource_type` | `string` | no | — |
| `dimension` | `string` | no | — |
| `dimension_label` | `string` | no | — |
| `price_variant` | `string` | no | — |
| `datapoints` | `number` | no | — |
| `tokens` | `number` | no | — |
| `price_per_1m_usd` | `number \| null` | no | — |
| `cost_usd` | `number` | no | — |

Interfaz `AwsBedrockResource` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource_id` | `string` | no | — |
| `name` | `string` | no | — |
| `resource_type` | `string` | no | — |
| `resource_type_label` | `string` | no | — |
| `location` | `string` | no | — |
| `price_variant` | `string` | no | — |
| `customization_type` | `string \| null` | no | — |
| `tokens_input` | `number` | no | — |
| `tokens_output` | `number` | no | — |
| `tokens_total` | `number` | no | — |
| `allocation_share` | `number` | no | — |
| `allocated_cost_usd` | `number` | no | — |
| `is_idle` | `boolean` | no | — |

Interfaz `AwsBedrockCandidateDimension` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `dimension` | `string` | no | — |
| `dimension_label` | `string` | no | — |
| `tokens` | `number` | no | — |
| `aws_price_per_1m_usd` | `number \| null` | no | — |
| `aws_cost_usd` | `number` | no | — |
| `price_per_1m_usd` | `number \| null` | no | — |
| `cost_usd` | `number` | no | — |
| `delta_usd` | `number` | no | — |
| `price_source_dimension` | `string` | no | — |
| `dimension_fallback` | `boolean` | no | — |

Interfaz `AwsBedrockCandidate` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `model_id` | `string` | no | — |
| `model_name` | `string` | no | — |
| `provider` | `string \| null` | no | — |
| `region` | `string \| null` | no | — |
| `model_class` | `string` | no | — |
| `equivalence_class` | `string` | no | — |
| `input_modalities` | `string[] \| null` | no | — |
| `output_modalities` | `string[] \| null` | no | — |
| `inference_types_supported` | `string[] \| null` | no | — |
| `lifecycle_status` | `string \| null` | no | — |
| `price_similarity` | `number` | no | — |
| `dimension_coverage` | `number` | no | — |
| `equivalence_score` | `number` | no | — |
| `price_ratios` | `Record<string, number>` | no | — |
| `confidence` | `AwsBedrockConfidence` | no | — |
| `priced` | `boolean` | no | — |
| `projected_cost_usd` | `number` | no | — |
| `aws_cost_usd` | `number` | no | — |
| `delta_usd` | `number` | no | — |
| `delta_percent` | `number` | no | — |
| `dimensions` | `AwsBedrockCandidateDimension[]` | no | — |
| `dimension_fallback` | `boolean` | no | — |
| `missing_dimensions` | `string[]` | no | — |
| `price_scope_sources` | `Record<string, string \| null> \| null` | no | — |
| `unresolved_price_rows` | `number \| null` | no | — |
| `rationale` | `string` | no | — |
| `equivalent_models` | `string[]` | no | — |
| `equivalent_models_count` | `number` | no | — |
| `rank` | `number \| null` | no | — |
| `is_recommended` | `boolean` | no | — |

Interfaz `AwsBedrockProviderCandidates` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `region` | `string \| null` | no | — |
| `price_variant` | `string` | no | — |
| `candidates` | `AwsBedrockCandidate[]` | no | — |

Interfaz `AwsBedrockModel` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `aws_model_name` | `string` | no | — |
| `aws_model_id` | `string` | no | — |
| `aws_model_version` | `string \| null` | no | — |
| `aws_model_format` | `string \| null` | no | — |
| `provider` | `string \| null` | no | — |
| `model_class` | `string` | no | — |
| `model_class_label` | `string` | no | — |
| `input_modalities` | `string[] \| null` | no | — |
| `output_modalities` | `string[] \| null` | no | — |
| `inference_types_supported` | `string[] \| null` | no | — |
| `lifecycle_status` | `string \| null` | no | — |
| `aws_cost_usd` | `number` | no | — |
| `tokens_total` | `number` | no | — |
| `usage` | `AwsBedrockUsage[]` | no | — |
| `resource_locations` | `string[]` | no | — |
| `resource_types` | `string[]` | no | — |
| `metrics` | `AwsBedrockMetric[]` | no | — |
| `resources` | `AwsBedrockResource[]` | no | — |
| `resources_total` | `number` | no | — |
| `resources_idle` | `number` | no | — |
| `allocation_basis` | `string` | no | — |
| `aws_region` | `string \| null` | no | — |
| `price_variant` | `string` | no | — |
| `foundry` | `AwsBedrockProviderCandidates` | no | — |
| `vertex` | `AwsBedrockProviderCandidates` | no | — |

Interfaz `AwsBedrockSummary` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `aws_cost_usd` | `number` | no | — |
| `models_total` | `number` | no | — |
| `resources_total` | `number` | no | — |
| `resources_idle` | `number` | no | — |

Interfaz `AwsBedrockMetricIssue` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_name` | `string` | no | — |
| `resource_id` | `string` | sí | — |
| `resource_type` | `string` | sí | — |
| `aws_model_id` | `string` | sí | — |
| `cost_usd` | `number` | no | — |

Interfaz `AwsBedrockCatalogBuildRegion` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `foundation_models` | `number` | sí | — |
| `usable_models` | `number` | sí | — |
| `price_groups` | `number` | sí | — |
| `joined_models` | `number` | sí | — |
| `unjoined_models` | `number` | sí | — |
| `unjoined_sample` | `string[]` | sí | — |
| `price_catalog_versions` | `Record<string, number>` | sí | — |
| `price_rows` | `number` | sí | — |
| `excluded_rows` | `number` | sí | — |
| `unresolved_rows` | `number` | sí | — |
| `model_groups` | `number` | sí | — |
| `priced_models` | `number` | sí | — |
| `price_catalog_sync_time` | `string` | sí | — |

Interfaz `AwsBedrockPriceCatalog` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `unresolved_price_rows` | `number` | no | — |
| `catalog_models` | `number` | no | — |
| `catalog_build` | `Record<string, AwsBedrockCatalogBuildRegion>` | no | — |

Interfaz `AwsBedrockDiagnostics` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metrics_rows` | `number` | no | — |
| `inference_profiles_matched` | `number` | no | — |
| `custom_deployments_matched` | `number` | no | — |
| `idle_resources_attached` | `number` | no | — |
| `models_enriched_with_metadata` | `number` | no | — |
| `price_catalog` | `AwsBedrockPriceCatalog` | no | — |
| `elapsed_ms` | `number` | no | — |
| `cache_entries` | `number` | no | — |
| `response_cache_hit` | `boolean` | no | — |

Interfaz `AwsBedrockProviderDiagnostics` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `unresolved_price_rows` | `number` | no | — |
| `catalog_models` | `number` | no | — |
| `catalog_classes` | `Record<string, number>` | no | — |
| `catalog_build` | `Record<string, AwsBedrockCatalogBuildRegion>` | no | — |

Interfaz `AwsBedrockProviderSummaryBase` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `aws_cost_usd` | `number` | no | — |
| `delta_usd` | `number` | no | — |
| `delta_percent` | `number` | no | — |
| `coverage_percent` | `number` | no | — |
| `models_total` | `number` | no | — |
| `models_unmapped` | `number` | no | — |

Interfaz `AwsBedrockFoundrySummary` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `foundry_projected_cost_usd` | `number` | no | — |

Interfaz `AwsBedrockVertexSummary` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `vertex_projected_cost_usd` | `number` | no | — |

Interfaz `AwsBedrockFoundryComparison` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `summary` | `AwsBedrockFoundrySummary` | no | — |
| `diagnostics` | `AwsBedrockProviderDiagnostics` | no | — |

Interfaz `AwsBedrockVertexComparison` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `summary` | `AwsBedrockVertexSummary` | no | — |
| `diagnostics` | `AwsBedrockProviderDiagnostics` | no | — |

Interfaz `AwsBedrockComparison` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `service_label` | `string \| null` | no | — |
| `region` | `string \| null` | no | — |
| `resource_id` | `string \| null` | no | — |
| `resource_name` | `string \| null` | no | — |
| `summary` | `AwsBedrockSummary` | no | — |
| `models` | `AwsBedrockModel[]` | no | — |
| `unmapped_metrics` | `AwsBedrockMetricIssue[]` | no | — |
| `unresolved_metrics` | `AwsBedrockMetricIssue[]` | no | — |
| `diagnostics` | `AwsBedrockDiagnostics` | no | — |
| `foundry` | `AwsBedrockFoundryComparison` | no | — |
| `vertex` | `AwsBedrockVertexComparison` | no | — |

Interfaz `AwsBedrockCostBridgePoint` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `model` | `string` | no | — |
| `aws_cost_usd` | `number` | no | — |
| `projected_cost_usd` | `number` | no | — |
| `delta_usd` | `number` | no | — |
| `delta_percent` | `number` | no | — |
| `recommended_model` | `string` | no | — |
| `has_recommendation` | `boolean` | no | — |

Interfaz `AwsBedrockCandidateConfidenceRow` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `aws_model_name` | `string` | no | — |
| `candidate_model_name` | `string` | no | — |
| `provider` | `string` | no | — |
| `region` | `string` | no | — |
| `equivalence_score` | `number` | no | — |
| `delta_percent` | `number` | no | — |
| `projected_cost_usd` | `number` | no | — |
| `confidence` | `AwsBedrockConfidence` | no | — |
| `is_recommended` | `boolean` | no | — |
| `is_eligible` | `boolean` | no | — |

Interfaz `AwsBedrockDimensionLadderRow` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `dimension` | `string` | no | — |
| `dimension_label` | `string` | no | — |
| `tokens` | `number` | no | — |
| `token_share` | `number` | no | — |
| `aws_price_per_1m_usd` | `number \| null` | no | — |
| `aws_cost_usd` | `number` | no | — |
| `candidate_price_per_1m_usd` | `number \| null` | no | — |
| `candidate_cost_usd` | `number \| null` | no | — |
| `delta_usd` | `number \| null` | no | — |
| `dimension_fallback` | `boolean` | no | — |

Interfaz `AwsBedrockModelPanel` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `aws_model_name` | `string` | no | — |
| `aws_model_id` | `string` | no | — |
| `model_provider` | `string` | no | — |
| `model_class_label` | `string` | no | — |
| `resource_types_label` | `string` | no | — |
| `aws_region` | `string` | no | — |
| `candidate_region` | `string` | no | — |
| `lifecycle_status` | `string` | no | — |
| `aws_cost_usd` | `number` | no | — |
| `tokens_total` | `number` | no | — |
| `blended_price_per_1m_usd` | `number` | no | — |
| `resources_total` | `number` | no | — |
| `resources_idle` | `number` | no | — |
| `candidates_total` | `number` | no | — |
| `recommended_model` | `string` | no | — |
| `recommended_provider` | `string` | no | — |
| `recommended_confidence` | `string` | no | — |
| `recommended_cost_usd` | `number \| null` | no | — |
| `recommended_delta_usd` | `number \| null` | no | — |
| `recommended_delta_percent` | `number \| null` | no | — |
| `recommended_equivalence` | `number \| null` | no | — |
| `recommended_rationale` | `string` | no | — |
| `ladder` | `AwsBedrockDimensionLadderRow[]` | no | — |

Interfaz `AwsBedrockResourceRow` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource_id` | `string` | no | — |
| `name` | `string` | no | — |
| `aws_model_name` | `string` | no | — |
| `aws_model_id` | `string` | no | — |
| `resource_type` | `string` | no | — |
| `resource_type_label` | `string` | no | — |
| `price_variant` | `string` | no | — |
| `location` | `string` | no | — |
| `tokens_input` | `number` | no | — |
| `tokens_output` | `number` | no | — |
| `tokens_total` | `number` | no | — |
| `allocation_share` | `number` | no | — |
| `allocated_cost_usd` | `number` | no | — |
| `is_idle` | `boolean` | no | — |
| `status_label` | `string` | no | — |

- Usado por: [`BMComparisonComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-bmcomparisoncomponent-tsx), [`BMComparisonCandidateConfidenceComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-info-bmcomparisoncandidateconfidencecomponent-tsx), [`BMComparisonCardsComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-info-bmcomparisoncardscomponent-tsx), [`BMComparisonCostBridgeComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-info-bmcomparisoncostbridgecomponent-tsx), [`BMComparisonModelPanelsComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-info-bmcomparisonmodelpanelscomponent-tsx), [`BMComparisonTokenMixComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-info-bmcomparisontokenmixcomponent-tsx), [`BMComparisonViewComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-info-bmcomparisonviewcomponent-tsx), [`BMComparisonResourcesColumns.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-table-bmcomparisonresourcescolumns-tsx), [`BMComparisonResourcesTableComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-table-bmcomparisonresourcestablecomponent-tsx)

---

<a id="interfaces-bedrock-cost-optimization-custommodels-ts"></a>
## `interfaces/bedrock-cost-optimization/customModels.ts`

**Tipos**

Exporta:

- interfaz `CustomModelsPriceRateComparison`
- interfaz `CustomModelsPriceRate`

Interfaz `CustomModelsPriceRateComparison` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `modelName` | `string` | no | — |
| `provider` | `string` | no | — |
| `estimated_cost` | `number` | no | — |
| `cost_breakdown` | `{ output: number; input: number; }` | no | — |
| `delta_pct_vs_current` | `number` | no | — |
| `missing_rates` | `string[]` | no | — |

Interfaz `CustomModelsPriceRate` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `modelName` | `string` | no | — |
| `modelId` | `string` | no | — |
| `region` | `string` | no | — |
| `customModelArn` | `string` | no | — |
| `customModelName` | `string` | no | — |
| `customModelDeploymentArn` | `string` | no | — |
| `provider` | `string` | no | — |
| `rates` | `{ input: { price_per_1k_tokens: string; price_per_1m_tokens: string; …` | no | — |
| `tokens` | `{ input: number; output: number; }` | no | — |
| `cost` | `number` | no | — |
| `cost_breakdown` | `{ input:number; output: number; }` | no | — |
| `price_comparison` | `CustomModelsPriceRateComparison[]` | no | — |

- Usado por: [`COCustomModelsComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-custom-models-cocustommodelscomponent-tsx), [`COCustomModelsCardsComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-custom-models-info-cocustommodelscardscomponent-tsx)

---

<a id="interfaces-bedrock-cost-optimization-foundationmodels-ts"></a>
## `interfaces/bedrock-cost-optimization/foundationModels.ts`

**Tipos**

Exporta:

- interfaz `FoundationModelsPriceRateComparison`
- interfaz `FoundationModelsPriceRate`

Interfaz `FoundationModelsPriceRateComparison` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `modelName` | `string` | no | — |
| `provider` | `string` | no | — |
| `estimated_cost` | `number` | no | — |
| `cost_breakdown` | `{ output: number; input: number; }` | no | — |
| `delta_pct_vs_current` | `number` | no | — |
| `missing_rates` | `string[]` | no | — |

Interfaz `FoundationModelsPriceRate` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `modelName` | `string` | no | — |
| `modelId` | `string` | no | — |
| `region` | `string` | no | — |
| `foundationModelId` | `string` | no | — |
| `foundationModelName` | `string` | no | — |
| `provider` | `string` | no | — |
| `rates` | `{ input: { price_per_1k_tokens: string; price_per_1m_tokens: string; …` | no | — |
| `tokens` | `{ input: number; output: number; }` | no | — |
| `cost` | `number` | no | — |
| `cost_breakdown` | `{ input:number; output: number; }` | no | — |
| `price_comparison` | `FoundationModelsPriceRateComparison[]` | no | — |

- Usado por: [`COFoundationComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-foundation-models-cofoundationcomponent-tsx), [`COFoundationCardsComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-foundation-models-info-cofoundationcardscomponent-tsx)

---

<a id="interfaces-bedrock-cost-optimization-inferenceprofiles-ts"></a>
## `interfaces/bedrock-cost-optimization/inferenceProfiles.ts`

**Tipos**

Exporta:

- interfaz `InferenceProfilesPriceRateComparison`
- interfaz `InferenceProfilesPriceRate`

Interfaz `InferenceProfilesPriceRateComparison` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `modelName` | `string` | no | — |
| `provider` | `string` | no | — |
| `estimated_cost` | `number` | no | — |
| `cost_breakdown` | `{ output: number; input: number; }` | no | — |
| `delta_pct_vs_current` | `number` | no | — |
| `missing_rates` | `string[]` | no | — |

Interfaz `InferenceProfilesPriceRate` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `modelName` | `string` | no | — |
| `modelId` | `string` | no | — |
| `region` | `string` | no | — |
| `inferenceProfileId` | `string` | no | — |
| `inferenceProfileName` | `string` | no | — |
| `provider` | `string` | no | — |
| `rates` | `{ input: { price_per_1k_tokens: string; price_per_1m_tokens: string; …` | no | — |
| `tokens` | `{ input: number; output: number; }` | no | — |
| `cost` | `number` | no | — |
| `cost_breakdown` | `{ input:number; output: number; }` | no | — |
| `price_comparison` | `InferenceProfilesPriceRateComparison[]` | no | — |

- Usado por: [`COInferenceProfilesComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-inference-profiles-coinferenceprofilescomponent-tsx), [`COInferenceProfilesCardsComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-inference-profiles-info-coinferenceprofilescardscomponent-tsx)

---

<a id="interfaces-billing-ts"></a>
## `interfaces/billing.ts`

**Tipos**

Exporta:

- tipo `BillingCloud` = `'aws' | 'azure' | 'gcp'` — Contrato canónico de la familia "Facturación" (espejo de `utils/billing_schemas.py`, idéntico en cloudperformance-api-aws, -azure y -gcp). Rutas: /api/{cloud}/billing/{trend|multitenant/trend|history|top?dimension=...} Una sola métrica de costo por nube (`cost_metric`): AWS `netamortizedcost`, Azure `cost_in_billing_currency`, GCP `cost_net_usd`. Cada registro de facturación se cuenta una vez (última sincronización).
- tipo `BillingAction` = `'trend' | 'multitenant/trend' | 'history' | 'top'`
- interfaz `BillingPoint`
- interfaz `BillingTrend`
- interfaz `BillingMonthCost`
- interfaz `BillingDeviation`
- interfaz `BillingHistoryService`
- interfaz `BillingDeviationSummary`
- interfaz `BillingHistory`
- interfaz `BillingTopItem`
- interfaz `BillingTop`

Interfaz `BillingPoint` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `date` | `string` | no | Día "YYYY-MM-DD". |
| `service` | `string` | no | — |
| `region` | `string \| null` | no | — |
| `scope` | `string \| null` | no | Suscripción (Azure) / proyecto (GCP), cuando la API lo entrega. |
| `account` | `string \| null` | no | Id de la cuenta de la plataforma (solo en multitenant). |
| `cost` | `number` | no | Mismo costo en la moneda local (GCP: CLP). |
| `cost_local` | `number \| null` | no | — |

Interfaz `BillingTrend` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cost_metric` | `string` | no | — |
| `currency` | `string` | no | — |
| `local_currency` | `string \| null` | no | — |
| `points` | `BillingPoint[]` | no | — |

Interfaz `BillingMonthCost` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `month` | `string` | no | — |
| `cost` | `number` | no | — |

Interfaz `BillingDeviation` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `to_month` | `string` | no | — |
| `value` | `number` | no | — |

Interfaz `BillingHistoryService` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `service` | `string` | no | — |
| `total` | `number` | no | — |
| `months` | `BillingMonthCost[]` | no | — |
| `deviations` | `BillingDeviation[]` | no | — |

Interfaz `BillingDeviationSummary` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `to_month` | `string` | no | — |
| `increases` | `number` | no | — |
| `decreases` | `number` | no | — |
| `net` | `number` | no | — |

Interfaz `BillingHistory` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cost_metric` | `string` | no | — |
| `currency` | `string` | no | — |
| `services` | `BillingHistoryService[]` | no | — |
| `totals` | `{ by_month: { month: string; total: number }[]; total: number }` | no | — |
| `deviations` | `BillingDeviationSummary[]` | no | — |

Interfaz `BillingTopItem` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `value` | `string` | no | — |
| `service` | `string \| null` | no | — |
| `date` | `string \| null` | no | Día "YYYY-MM-DD" (Azure agrega todo el período: null). |
| `cost` | `number` | no | — |

Interfaz `BillingTop` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cost_metric` | `string` | no | — |
| `currency` | `string` | no | — |
| `dimension` | `string` | no | — |
| `items` | `BillingTopItem[]` | no | — |

- Usado por: [`MultiCloudComponent.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-multicloudcomponent-tsx), [`MultiCloudLineChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-grafico-multicloudlinechartcomponent-tsx), [`MultiCloudMonthlyServiceChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-grafico-multicloudmonthlyservicechartcomponent-tsx), [`MultiCloudServiceBarChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-grafico-multicloudservicebarchartcomponent-tsx), [`BillingHistoryTable.tsx`](components/shared.md#components-shared-billing-billinghistorytable-tsx), [`BillingTrendView.tsx`](components/shared.md#components-shared-billing-billingtrendview-tsx), [`TopBillingChart.tsx`](components/shared.md#components-shared-billing-topbillingchart-tsx), [`TopBillingTable.tsx`](components/shared.md#components-shared-billing-topbillingtable-tsx), [`TopBillingView.tsx`](components/shared.md#components-shared-billing-topbillingview-tsx), [`billing.ts`](lib.md#lib-billing-ts), [`exportExcelHistoricalBilling.ts`](lib.md#lib-exportexcelhistoricalbilling-ts)

---

<a id="interfaces-consumption-ts"></a>
## `interfaces/consumption.ts`

**Tipos**

Exporta:

- tipo `ConsumptionCloud` = `'aws' | 'azure' | 'gcp'` — Contrato canónico de la familia "Consumo / Eficiencia" (espejo de `utils/consumption_schemas.py`, idéntico en cloudperformance-api-aws, -azure y -gcp). Rutas: /api/{cloud}/consumption/{recurso}/{metrics|info|efficiency} Fechas: siempre ISO 8601 UTC ("2026-09-22T07:00:03.184Z").
- interfaz `MetricPoint`
- tipo `EfficiencyLevel` = `'low' | 'medium' | 'high' | 'no_data'`
- interfaz `EfficiencyMetric`
- interfaz `EfficiencyResponse`
- interfaz `SeriesValue`
- interfaz `ResourceSnapshot`
- interfaz `ConsumptionResource`
- interfaz `ConsumptionSummary`
- interfaz `ConsumptionInfoResponse`

Interfaz `MetricPoint` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `timestamp` | `string` | no | — |
| `metric` | `string` | no | — |
| `avg_value` | `number \| null` | no | — |
| `max_value` | `number \| null` | no | — |
| `min_value` | `number \| null` | no | — |
| `samples` | `number \| null` | no | — |
| `region` | `string \| null` | no | — |
| `scope` | `string \| null` | no | — |

Interfaz `EfficiencyMetric` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric` | `string` | no | — |
| `avg_value` | `number \| null` | no | — |
| `max_value` | `number \| null` | no | — |
| `min_value` | `number \| null` | no | — |
| `samples` | `number` | no | — |
| `efficiency_score` | `number \| null` | no | — |

Interfaz `EfficiencyResponse` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `global_efficiency_score` | `number \| null` | no | — |
| `global_efficiency_label` | `string` | no | — |
| `global_efficiency_level` | `EfficiencyLevel` | no | — |
| `metrics_detail` | `EfficiencyMetric[]` | no | — |

Interfaz `SeriesValue` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `timestamp` | `string` | no | — |
| `value` | `number \| null` | no | — |

Interfaz `ResourceSnapshot` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `string \| null` | no | — |
| `status` | `string \| null` | no | — |
| `cost` | `number \| null` | no | — |
| `is_idle` | `boolean` | no | — |
| `is_underutilized` | `boolean` | no | — |
| `metrics` | `Record<string, number \| null>` | no | — |

Interfaz `ConsumptionResource` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource_id` | `string` | no | — |
| `resource_name` | `string` | no | — |
| `resource_type` | `string \| null` | no | — |
| `region` | `string \| null` | no | — |
| `scope` | `string \| null` | no | — |
| `status` | `string \| null` | no | — |
| `tags` | `Record<string, string>` | no | — |
| `cost` | `number \| null` | no | — |
| `currency` | `string \| null` | no | — |
| `has_billing` | `boolean` | no | — |
| `is_idle` | `boolean` | no | — |
| `is_underutilized` | `boolean` | no | — |
| `storage_inefficient` | `boolean \| null` | no | — |
| `sync_time` | `string \| null` | no | — |
| `metrics` | `Record<string, number \| null>` | no | — |
| `details` | `Record<string, unknown>` | no | — |
| `history` | `ResourceSnapshot[]` | no | — |
| `series` | `Record<string, SeriesValue[]>` | no | — |

Interfaz `ConsumptionSummary` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `total_resources` | `number` | no | — |
| `idle_resources` | `number` | no | — |
| `underutilized_resources` | `number` | no | — |
| `storage_inefficient_resources` | `number \| null` | no | — |
| `cost_total` | `number \| null` | no | — |
| `cost_total_by_currency` | `Record<string, number>` | no | — |
| `currency` | `string \| null` | no | — |
| `has_billing` | `boolean` | no | — |
| `potential_savings` | `number \| null` | no | — |
| `sync_time` | `string \| null` | no | — |
| `breakdowns` | `Record<string, Record<string, number>>` | no | — |
| `extra` | `Record<string, unknown>` | no | — |

Interfaz `ConsumptionInfoResponse` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `summary` | `ConsumptionSummary` | no | — |
| `resources` | `ConsumptionResource[]` | no | — |

- Usado por: [`ZonasDNSComponent.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-dns-zonas-consumo-estado-zonasdnscomponent-tsx), [`ZonasDNSCardsComponent.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-dns-zonas-consumo-estado-info-zonasdnscardscomponent-tsx), [`ZonasDNSTable.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-dns-zonas-consumo-estado-tabla-zonasdnstable-tsx), [`LoadBalancersComponent.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-load-balancers-consumo-uso-loadbalancerscomponent-tsx), [`LoadBalancersCardsComponent.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-load-balancers-consumo-uso-info-loadbalancerscardscomponent-tsx), [`LoadBalancersTable.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-load-balancers-consumo-uso-tabla-loadbalancerstable-tsx), [`ConsumptionCards.tsx`](components/shared.md#components-shared-consumption-consumptioncards-tsx), [`ConsumptionCharts.tsx`](components/shared.md#components-shared-consumption-consumptioncharts-tsx), [`ConsumptionDetailModal.tsx`](components/shared.md#components-shared-consumption-consumptiondetailmodal-tsx), [`ConsumptionTable.tsx`](components/shared.md#components-shared-consumption-consumptiontable-tsx), [`ConsumptionView.tsx`](components/shared.md#components-shared-consumption-consumptionview-tsx), [`types.ts`](components/shared.md#components-shared-consumption-types-ts), [`consumption.ts`](lib.md#lib-consumption-ts)

---

<a id="interfaces-foundry-cost-optimization-azurefoundryinterfaces-ts"></a>
## `interfaces/foundry-cost-optimization/azureFoundryInterfaces.ts`

**Tipos**

Exporta:

- tipo `AzureFoundryConfidence` = `'HIGH' | 'MEDIUM' | 'LOW'`
- tipo `AzureFoundryProviderKey` = `'bedrock' | 'vertex'`
- interfaz `AzureFoundryUsage`
- interfaz `AzureFoundryMeter`
- interfaz `AzureFoundryDeployment`
- interfaz `AzureFoundryCandidateDimension`
- interfaz `AzureFoundryCandidate`
- interfaz `AzureFoundryProviderCandidates`
- interfaz `AzureFoundryDeprecation`
- interfaz `AzureFoundryReplacementConfig`
- interfaz `AzureFoundryModel`
- interfaz `AzureFoundrySummary`
- interfaz `AzureFoundryMeterIssue`
- interfaz `AzureFoundryCatalogBuildRegion`
- interfaz `AzureFoundryProviderDiagnostics`
- interfaz `AzureFoundryProviderSummaryBase`
- interfaz `AzureFoundryBedrockSummary`
- interfaz `AzureFoundryVertexSummary`
- interfaz `AzureFoundryBedrockComparison`
- interfaz `AzureFoundryVertexComparison`
- interfaz `AzureFoundryDiagnostics`
- interfaz `AzureFoundryComparison`
- tipo `AzureFoundryComparisonResponse` = `AzureFoundryComparison[]`
- interfaz `AzureFoundryCostBridgePoint`
- interfaz `AzureFoundryTokenMixPoint`
- interfaz `AzureFoundryCandidateConfidenceRow`
- interfaz `AzureFoundryDimensionLadderRow`
- interfaz `AzureFoundryModelPanel`
- interfaz `AzureFoundryDeploymentRow`

Interfaz `AzureFoundryUsage` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `dimension` | `string` | no | — |
| `dimension_label` | `string` | no | — |
| `tokens` | `number` | no | — |
| `cost_usd` | `number` | no | — |
| `payg_cost_usd` | `number` | no | — |
| `price_per_1m_usd` | `number \| null` | no | — |

Interfaz `AzureFoundryMeter` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `meter_name` | `string` | no | — |
| `dimension` | `string` | no | — |
| `dimension_label` | `string` | no | — |
| `unit_of_measure` | `string` | no | — |
| `quantity` | `number` | no | — |
| `tokens` | `number` | no | — |
| `cost_usd` | `number` | no | — |

Interfaz `AzureFoundryDeployment` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `deployment_id` | `string` | no | — |
| `name` | `string` | no | — |
| `account_name` | `string` | no | — |
| `resource_group` | `string` | no | — |
| `location` | `string` | no | — |
| `sku_name` | `string` | no | — |
| `sku_capacity` | `number` | no | — |
| `current_capacity` | `number` | no | — |
| `model_version` | `string` | no | — |
| `tokens_input` | `number` | no | — |
| `tokens_output` | `number` | no | — |
| `tokens_total` | `number` | no | — |
| `allocation_share` | `number` | no | — |
| `allocated_cost_usd` | `number` | no | — |
| `is_idle` | `boolean` | no | — |

Interfaz `AzureFoundryCandidateDimension` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `dimension` | `string` | no | — |
| `dimension_label` | `string` | no | — |
| `tokens` | `number` | no | — |
| `azure_price_per_1m_usd` | `number \| null` | no | — |
| `azure_cost_usd` | `number` | no | — |
| `price_per_1m_usd` | `number \| null` | no | — |
| `cost_usd` | `number` | no | — |
| `delta_usd` | `number` | no | — |
| `price_source_dimension` | `string` | no | — |
| `dimension_fallback` | `boolean` | no | — |

Interfaz `AzureFoundryCandidate` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `model_id` | `string` | no | — |
| `model_name` | `string` | no | — |
| `provider` | `string \| null` | no | — |
| `region` | `string \| null` | no | — |
| `model_class` | `string` | no | — |
| `equivalence_class` | `string` | no | — |
| `input_modalities` | `string[] \| null` | no | — |
| `output_modalities` | `string[] \| null` | no | — |
| `inference_types_supported` | `string[] \| null` | no | — |
| `lifecycle_status` | `string \| null` | no | — |
| `price_similarity` | `number` | no | — |
| `dimension_coverage` | `number` | no | — |
| `equivalence_score` | `number` | no | — |
| `price_ratios` | `Record<string, number>` | no | — |
| `confidence` | `AzureFoundryConfidence` | no | — |
| `priced` | `boolean` | no | — |
| `projected_cost_usd` | `number` | no | — |
| `azure_cost_usd` | `number` | no | — |
| `delta_usd` | `number` | no | — |
| `delta_percent` | `number` | no | — |
| `dimensions` | `AzureFoundryCandidateDimension[]` | no | — |
| `dimension_fallback` | `boolean` | no | — |
| `missing_dimensions` | `string[]` | no | — |
| `price_scope_sources` | `Record<string, string \| null> \| null` | no | — |
| `unresolved_price_rows` | `number \| null` | no | — |
| `rationale` | `string` | no | — |
| `equivalent_models` | `string[]` | no | — |
| `equivalent_models_count` | `number` | no | — |
| `rank` | `number \| null` | no | — |
| `is_recommended` | `boolean` | no | — |

Interfaz `AzureFoundryProviderCandidates` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `region` | `string \| null` | no | — |
| `price_variant` | `string` | no | — |
| `candidates` | `AzureFoundryCandidate[]` | no | — |

Interfaz `AzureFoundryDeprecation` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `inference` | `string` | sí | — |
| `fine_tune` | `string` | sí | — |

Interfaz `AzureFoundryReplacementConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `target_model_name` | `string` | no | — |
| `target_model_version` | `string` | no | — |
| `auto_upgrade_start_date` | `string` | no | — |
| `upgrade_on_expiry_lead_time_days` | `number` | no | — |

Interfaz `AzureFoundryModel` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `azure_model_name` | `string` | no | — |
| `azure_model_version` | `string` | no | — |
| `azure_model_format` | `string \| null` | no | — |
| `model_class` | `string` | no | — |
| `model_class_label` | `string` | no | — |
| `lifecycle_status` | `string \| null` | no | — |
| `deprecation` | `AzureFoundryDeprecation \| null` | no | — |
| `replacement_config` | `AzureFoundryReplacementConfig \| null` | no | — |
| `azure_cost_usd` | `number` | no | — |
| `azure_payg_cost_usd` | `number` | no | — |
| `tokens_total` | `number` | no | — |
| `usage` | `AzureFoundryUsage[]` | no | — |
| `resource_locations` | `string[]` | no | — |
| `account_ids` | `string[]` | no | — |
| `meters` | `AzureFoundryMeter[]` | no | — |
| `deployments` | `AzureFoundryDeployment[]` | no | — |
| `deployments_total` | `number` | no | — |
| `deployments_idle` | `number` | no | — |
| `allocation_basis` | `string` | no | — |
| `azure_location` | `string \| null` | no | — |
| `deployment_type` | `string \| null` | no | — |
| `bedrock` | `AzureFoundryProviderCandidates` | no | — |
| `vertex` | `AzureFoundryProviderCandidates` | no | — |

Interfaz `AzureFoundrySummary` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `azure_cost_usd` | `number` | no | — |
| `models_total` | `number` | no | — |
| `deployments_total` | `number` | no | — |
| `deployments_idle` | `number` | no | — |

Interfaz `AzureFoundryMeterIssue` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `meter_name` | `string` | no | — |
| `meter_sub_category` | `string` | sí | — |
| `azure_model_name` | `string` | sí | — |
| `cost_usd` | `number` | no | — |

Interfaz `AzureFoundryCatalogBuildRegion` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `foundation_models` | `number` | sí | Bedrock shape |
| `usable_models` | `number` | sí | — |
| `price_groups` | `number` | sí | — |
| `joined_models` | `number` | sí | — |
| `unjoined_models` | `number` | sí | — |
| `unjoined_sample` | `string[]` | sí | — |
| `price_catalog_versions` | `Record<string, number>` | sí | — |
| `price_rows` | `number` | sí | Vertex shape |
| `excluded_rows` | `number` | sí | — |
| `unresolved_rows` | `number` | sí | — |
| `model_groups` | `number` | sí | — |
| `priced_models` | `number` | sí | — |
| `price_catalog_sync_time` | `string` | sí | — |

Interfaz `AzureFoundryProviderDiagnostics` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `unresolved_price_rows` | `number` | no | — |
| `catalog_models` | `number` | no | — |
| `catalog_classes` | `Record<string, number>` | no | — |
| `catalog_build` | `Record<string, AzureFoundryCatalogBuildRegion>` | no | — |

Interfaz `AzureFoundryProviderSummaryBase` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `azure_cost_usd` | `number` | no | — |
| `delta_usd` | `number` | no | — |
| `delta_percent` | `number` | no | — |
| `coverage_percent` | `number` | no | — |
| `models_total` | `number` | no | — |
| `models_unmapped` | `number` | no | — |

Interfaz `AzureFoundryBedrockSummary` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `bedrock_projected_cost_usd` | `number` | no | — |

Interfaz `AzureFoundryVertexSummary` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `vertex_projected_cost_usd` | `number` | no | — |

Interfaz `AzureFoundryBedrockComparison` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `summary` | `AzureFoundryBedrockSummary` | no | — |
| `diagnostics` | `AzureFoundryProviderDiagnostics` | no | — |

Interfaz `AzureFoundryVertexComparison` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `summary` | `AzureFoundryVertexSummary` | no | — |
| `diagnostics` | `AzureFoundryProviderDiagnostics` | no | — |

Interfaz `AzureFoundryDiagnostics` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `billing_rows` | `number` | no | — |
| `accounts_matched` | `number` | no | — |

Interfaz `AzureFoundryComparison` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `account_name` | `string` | no | — |
| `account_id` | `string` | no | — |
| `account_kind` | `string \| null` | no | — |
| `account_location` | `string \| null` | no | — |
| `resource_group` | `string \| null` | no | — |
| `subscription_id` | `string \| null` | no | — |
| `summary` | `AzureFoundrySummary` | no | — |
| `models` | `AzureFoundryModel[]` | no | — |
| `unmapped_meters` | `AzureFoundryMeterIssue[]` | no | — |
| `unresolved_meters` | `AzureFoundryMeterIssue[]` | no | — |
| `diagnostics` | `AzureFoundryDiagnostics` | no | — |
| `bedrock` | `AzureFoundryBedrockComparison` | no | — |
| `vertex` | `AzureFoundryVertexComparison` | no | — |

Interfaz `AzureFoundryCostBridgePoint` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `model` | `string` | no | — |
| `azure_cost_usd` | `number` | no | — |
| `projected_cost_usd` | `number` | no | — |
| `delta_usd` | `number` | no | — |
| `delta_percent` | `number` | no | — |
| `recommended_model` | `string` | no | — |
| `has_recommendation` | `boolean` | no | — |

Interfaz `AzureFoundryTokenMixPoint` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `model` | `string` | no | — |
| `input` | `number` | no | — |
| `cache_read` | `number` | no | — |
| `cache_write` | `number` | no | — |
| `output` | `number` | no | — |
| `total` | `number` | no | — |
| `input_cost` | `number` | no | — |
| `cache_read_cost` | `number` | no | — |
| `cache_write_cost` | `number` | no | — |
| `output_cost` | `number` | no | — |
| `total_cost` | `number` | no | — |

Interfaz `AzureFoundryCandidateConfidenceRow` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `azure_model_name` | `string` | no | — |
| `candidate_model_name` | `string` | no | — |
| `provider` | `string` | no | — |
| `region` | `string` | no | — |
| `equivalence_score` | `number` | no | — |
| `delta_percent` | `number` | no | — |
| `projected_cost_usd` | `number` | no | — |
| `confidence` | `AzureFoundryConfidence` | no | — |
| `is_recommended` | `boolean` | no | — |
| `is_eligible` | `boolean` | no | — |

Interfaz `AzureFoundryDimensionLadderRow` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `dimension` | `string` | no | — |
| `dimension_label` | `string` | no | — |
| `tokens` | `number` | no | — |
| `token_share` | `number` | no | — |
| `azure_price_per_1m_usd` | `number \| null` | no | — |
| `azure_cost_usd` | `number` | no | — |
| `candidate_price_per_1m_usd` | `number \| null` | no | — |
| `candidate_cost_usd` | `number \| null` | no | — |
| `delta_usd` | `number \| null` | no | — |
| `dimension_fallback` | `boolean` | no | — |

Interfaz `AzureFoundryModelPanel` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `azure_model_name` | `string` | no | — |
| `azure_model_version` | `string` | no | — |
| `model_class_label` | `string` | no | — |
| `deployment_type` | `string` | no | — |
| `azure_location` | `string` | no | — |
| `candidate_region` | `string` | no | — |
| `lifecycle_status` | `string` | no | — |
| `deprecation_label` | `string` | no | — |
| `azure_cost_usd` | `number` | no | — |
| `tokens_total` | `number` | no | — |
| `blended_price_per_1m_usd` | `number` | no | — |
| `deployments_total` | `number` | no | — |
| `deployments_idle` | `number` | no | — |
| `candidates_total` | `number` | no | — |
| `recommended_model` | `string` | no | — |
| `recommended_provider` | `string` | no | — |
| `recommended_confidence` | `string` | no | — |
| `recommended_cost_usd` | `number \| null` | no | — |
| `recommended_delta_usd` | `number \| null` | no | — |
| `recommended_delta_percent` | `number \| null` | no | — |
| `recommended_equivalence` | `number \| null` | no | — |
| `recommended_rationale` | `string` | no | — |
| `ladder` | `AzureFoundryDimensionLadderRow[]` | no | — |

Interfaz `AzureFoundryDeploymentRow` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `deployment_id` | `string` | no | — |
| `name` | `string` | no | — |
| `azure_model_name` | `string` | no | — |
| `model_version` | `string` | no | — |
| `sku_name` | `string` | no | — |
| `location` | `string` | no | — |
| `resource_group` | `string` | no | — |
| `sku_capacity` | `number` | no | — |
| `tokens_input` | `number` | no | — |
| `tokens_output` | `number` | no | — |
| `tokens_total` | `number` | no | — |
| `allocation_share` | `number` | no | — |
| `allocated_cost_usd` | `number` | no | — |
| `is_idle` | `boolean` | no | — |
| `status_label` | `string` | no | — |

- Usado por: [`AFComparisonComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-afcomparisoncomponent-tsx), [`AFComparisonCandidateConfidenceComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-info-afcomparisoncandidateconfidencecomponent-tsx), [`AFComparisonCardsComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-info-afcomparisoncardscomponent-tsx), [`AFComparisonCostBridgeComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-info-afcomparisoncostbridgecomponent-tsx), [`AFComparisonModelPanelsComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-info-afcomparisonmodelpanelscomponent-tsx), [`AFComparisonTokenMixComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-info-afcomparisontokenmixcomponent-tsx), [`AFComparisonViewComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-info-afcomparisonviewcomponent-tsx), [`AFComparisonDeploymentsColumns.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-table-afcomparisondeploymentscolumns-tsx), [`AFComparisonDeploymentsTableComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-table-afcomparisondeploymentstablecomponent-tsx)

---

<a id="interfaces-foundry-cost-optimization-foundationmodels-ts"></a>
## `interfaces/foundry-cost-optimization/foundationModels.ts`

**Tipos**

Exporta:

- interfaz `RateObject`
- interfaz `MeterDetail`
- interfaz `TechnicalParityReport`
- interfaz `ModelProfile`
- interfaz `ModelSimilarityDimension`
- interfaz `ModelPricingSimilarity`
- interfaz `ModelSimilarity`
- interfaz `PriceComparison`
- interfaz `AzureModelCost`
- interfaz `AzureFoundationModel`
- interfaz `TokenUsageTimeline`

Interfaz `RateObject` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `price` | `number` | no | — |
| `unit` | `string` | no | — |
| `meter_name` | `string` | sí | — |

Interfaz `MeterDetail` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `quantity` | `number` | no | — |
| `unit_of_measure` | `string` | no | — |
| `cost_in_billing_currency` | `number` | no | — |
| `meter_name` | `string` | no | — |
| `metric_type` | `string` | no | — |

Interfaz `TechnicalParityReport` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `missing_capabilities` | `string[]` | sí | — |
| `infrastructure_warning` | `string` | sí | — |
| `current_max_tpm` | `number` | sí | — |
| `candidate_max_tpm` | `number` | sí | — |

Interfaz `ModelProfile` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `tier` | `string` | sí | — |
| `stars` | `number` | no | — |
| `description` | `string` | sí | — |

Interfaz `ModelSimilarityDimension` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `required` | `string[]` | no | — |
| `matched` | `string[]` | no | — |
| `missing` | `string[]` | no | — |
| `unknown` | `string[]` | no | — |
| `score` | `number \| null` | no | — |
| `source` | `string` | sí | — |

Interfaz `ModelPricingSimilarity` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `fallback_used` | `string[]` | sí | — |
| `ratios` | `Record<string, number>` | sí | — |
| `price_similarity_pct` | `number \| null` | sí | — |
| `dimension_coverage_pct` | `number \| null` | sí | — |

Interfaz `ModelSimilarity` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `score` | `number \| null` | no | — |
| `level` | `"high" \| "medium" \| "low" \| "insufficient_data"` | no | — |
| `basis` | `"reference_model_metadata" \| "category_profile_and_capabilities" \| "c…` | no | — |
| `evidence_coverage_pct` | `number` | no | — |
| `weights` | `Record<string, number>` | sí | — |
| `skills` | `ModelSimilarityDimension` | no | — |
| `capabilities` | `ModelSimilarityDimension` | no | — |
| `pricing` | `ModelPricingSimilarity` | sí | — |
| `limitations` | `string[]` | no | — |

Interfaz `PriceComparison` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `modelName` | `string` | no | — |
| `provider` | `string` | no | — |
| `estimated_cost` | `number` | no | — |
| `cost_breakdown` | `Record<string, number>` | no | — |
| `delta_pct_vs_current` | `number \| null` | no | — |
| `missing_rates` | `string[]` | no | — |
| `delta_pct_vs_billing` | `number \| null` | sí | — |
| `detailed_cost_breakdown` | `Record<string, number>` | sí | — |
| `detailed_base_rates` | `Record<string, RateObject>` | sí | — |
| `technical_parity_report` | `TechnicalParityReport` | sí | — |
| `model_similarity` | `ModelSimilarity \| null` | sí | — |
| `model_profile` | `ModelProfile` | sí | — |

Interfaz `AzureModelCost` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `account_name` | `string` | no | — |
| `model_name` | `string` | no | — |
| `model_version` | `string` | no | — |
| `provider` | `string` | no | — |
| `region` | `string` | no | — |
| `tokens` | `Record<string, number>` | no | — |
| `cost_breakdown` | `Record<string, number>` | no | — |
| `total_cost` | `number` | no | — |
| `price_comparison` | `PriceComparison[]` | no | — |
| `total_billing_cost` | `number` | no | — |
| `billing_cost_breakdown` | `Record<string, number>` | no | — |
| `billing_rates` | `Record<string, RateObject>` | no | — |
| `meter_details` | `MeterDetail[]` | no | — |
| `model_profile` | `ModelProfile` | sí | — |

Interfaz `AzureFoundationModel` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource_name` | `string` | no | — |
| `version` | `string` | no | — |
| `provider` | `string` | no | — |
| `resource_id` | `string` | no | — |
| `region` | `string` | no | — |

Interfaz `TokenUsageTimeline` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `timestamp` | `string` | no | — |
| `metric` | `string` | no | — |
| `sum_value` | `number` | no | — |

- Usado por: [`COAzureFoundryComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-costo-optimizacion-foundation-models-coazurefoundrycomponent-tsx), [`COFoundationCardsComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-costo-optimizacion-foundation-models-info-cofoundationcardscomponent-tsx)

---

<a id="interfaces-foundry-cost-optimization-promptoptimizationinterfaces-ts"></a>
## `interfaces/foundry-cost-optimization/promptOptimizationInterfaces.ts`

**Tipos**

Exporta:

- tipo `PromptOptimizationViewMode` = `'text' | 'ids'`
- tipo `PromptOptimizationSide` = `'original' | 'optimized'`
- tipo `PromptOptimizationTarget` = `'rate' | 'target_token'`
- interfaz `PromptOptimizationRequest`
- interfaz `PromptOptimizationToken`
- interfaz `PromptOptimizationBreakdown`
- interfaz `PromptOptimizationResponse`

Interfaz `PromptOptimizationRequest` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `model` | `string` | no | — |
| `prompt` | `string` | no | — |
| `rate` | `number` | sí | — |
| `target_token` | `number` | sí | — |
| `use_context_level_filter` | `boolean` | no | — |
| `use_token_level_filter` | `boolean` | no | — |

Interfaz `PromptOptimizationToken` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `text` | `string` | no | — |
| `token_ids` | `number[]` | no | — |

Interfaz `PromptOptimizationBreakdown` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `text` | `string` | no | — |
| `token_count` | `number` | no | — |
| `token_price` | `number \| null` | no | — |
| `tokens` | `PromptOptimizationToken[]` | no | — |

Interfaz `PromptOptimizationResponse` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `model` | `string` | no | — |
| `encoding_name` | `string` | no | — |
| `original_prompt` | `PromptOptimizationBreakdown` | no | — |
| `optimized_prompt` | `PromptOptimizationBreakdown` | no | — |
| `token_difference` | `number` | no | — |
| `token_difference_percentage` | `number` | no | — |
| `cost_difference_usd` | `number \| null` | no | — |

- Usado por: [`BMPromptOptComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-prompt-opt-bmpromptoptcomponent-tsx), [`BMPromptOptCardsComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-prompt-opt-info-bmpromptoptcardscomponent-tsx), [`BMPromptOptComparisonComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-prompt-opt-info-bmpromptoptcomparisoncomponent-tsx), [`BMPromptOptInputComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-prompt-opt-info-bmpromptoptinputcomponent-tsx), [`BMPromptOptPanelComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-prompt-opt-info-bmpromptoptpanelcomponent-tsx), [`BMPromptOptTargetComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-prompt-opt-info-bmpromptopttargetcomponent-tsx), [`BMPromptOptTokensComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-prompt-opt-info-bmpromptopttokenscomponent-tsx), [`VXPromptOptComponent.tsx`](components/google-vertex.md#components-google-vertex-prompt-opt-vxpromptoptcomponent-tsx), [`VXPromptOptCardsComponent.tsx`](components/google-vertex.md#components-google-vertex-prompt-opt-info-vxpromptoptcardscomponent-tsx), [`VXPromptOptComparisonComponent.tsx`](components/google-vertex.md#components-google-vertex-prompt-opt-info-vxpromptoptcomparisoncomponent-tsx), [`VXPromptOptInputComponent.tsx`](components/google-vertex.md#components-google-vertex-prompt-opt-info-vxpromptoptinputcomponent-tsx), [`VXPromptOptPanelComponent.tsx`](components/google-vertex.md#components-google-vertex-prompt-opt-info-vxpromptoptpanelcomponent-tsx), [`VXPromptOptTargetComponent.tsx`](components/google-vertex.md#components-google-vertex-prompt-opt-info-vxpromptopttargetcomponent-tsx), [`VXPromptOptTokensComponent.tsx`](components/google-vertex.md#components-google-vertex-prompt-opt-info-vxpromptopttokenscomponent-tsx), [`FMPromptOptComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-prompt-opt-fmpromptoptcomponent-tsx), [`FMPromptOptCardsComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-prompt-opt-info-fmpromptoptcardscomponent-tsx), [`FMPromptOptComparisonComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-prompt-opt-info-fmpromptoptcomparisoncomponent-tsx), [`FMPromptOptInputComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-prompt-opt-info-fmpromptoptinputcomponent-tsx), [`FMPromptOptPanelComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-prompt-opt-info-fmpromptoptpanelcomponent-tsx), [`FMPromptOptTargetComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-prompt-opt-info-fmpromptopttargetcomponent-tsx), [`FMPromptOptTokensComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-prompt-opt-info-fmpromptopttokenscomponent-tsx)

---

<a id="interfaces-unused-ts"></a>
## `interfaces/unused.ts`

**Tipos**

Exporta:

- tipo `UnusedCloud` = `'aws' | 'azure' | 'gcp'` — Contrato canónico de la familia "Recursos sin uso", grupo por métricas (espejo de `utils/unused_schemas.py`, idéntico en cloudperformance-api-aws, -azure y -gcp). Rutas: /api/{cloud}/unused/{recurso}/{candidates|summary|series|resources|associated} El recurso a analizar va en `resource` ("all" o ids separados por coma). Fechas en ISO 8601 UTC. Vacío siempre `[]`.
- tipo `UnusedAction` = `'candidates' | 'summary' | 'series' | 'resources' | 'associated'`
- tipo `DiagnosisStatus` = `'underutilized' | 'low_usage' | 'healthy' | 'no_data'`
- interfaz `UnusedCandidate` — Opción del filtro: un recurso detectado como sin uso / infrautilizado.
- interfaz `UnusedMetricSummary` — Promedio y peak de una métrica en el período (tarjetas).
- interfaz `UnusedSeriesPoint` — Punto de serie de tiempo (mismo formato que los gráficos de Consumo).
- interfaz `UnusedMetric`
- interfaz `UnusedDiagnosis`
- interfaz `UnusedNetworkInterface`
- interfaz `UnusedDisk`
- interfaz `UnusedAttachment`
- interfaz `UnusedRelated` — Elemento relacionado con el recurso: registro DNS, backend pool, subred, base de datos asociada...
- interfaz `UnusedDetails`
- interfaz `UnusedHistoryEntry`
- interfaz `UnusedResource`

Interfaz `UnusedCandidate` (exportada) — Opción del filtro: un recurso detectado como sin uso / infrautilizado.:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource_id` | `string` | no | — |
| `resource_name` | `string` | no | — |
| `cpu_avg` | `number \| null` | no | — |

Interfaz `UnusedMetricSummary` (exportada) — Promedio y peak de una métrica en el período (tarjetas).:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric` | `string` | no | — |
| `avg_value` | `number \| null` | no | — |
| `peak_value` | `number \| null` | no | — |

Interfaz `UnusedSeriesPoint` (exportada) — Punto de serie de tiempo (mismo formato que los gráficos de Consumo).:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `timestamp` | `string` | no | — |
| `metric` | `string` | no | — |
| `avg_value` | `number \| null` | no | — |
| `max_value` | `number \| null` | no | — |
| `min_value` | `number \| null` | no | — |

Interfaz `UnusedMetric` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric` | `string` | no | — |
| `avg_value` | `number \| null` | no | — |
| `max_value` | `number \| null` | no | — |
| `min_value` | `number \| null` | no | — |
| `global_avg` | `number \| null` | no | — |
| `bar_width` | `number \| null` | no | % de la barra: "ranking" = respecto del recurso más cargado; "contribution" = del total del grupo. |
| `visualization_type` | `'ranking' \| 'contribution' \| null` | no | — |
| `group_context_value` | `number \| null` | no | — |

Interfaz `UnusedDiagnosis` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `status` | `DiagnosisStatus` | no | — |
| `reason` | `string` | no | — |

Interfaz `UnusedNetworkInterface` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string \| null` | no | — |
| `name` | `string \| null` | no | — |
| `type` | `string \| null` | no | — |
| `status` | `string \| null` | no | — |
| `private_ip` | `string \| null` | no | — |
| `public_ip` | `string \| null` | no | — |
| `network` | `string \| null` | no | — |
| `subnet` | `string \| null` | no | — |
| `security_groups` | `string[]` | no | — |

Interfaz `UnusedDisk` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string \| null` | no | — |
| `name` | `string \| null` | no | — |
| `device` | `string \| null` | no | — |
| `type` | `string \| null` | no | — |
| `status` | `string \| null` | no | — |
| `size_gb` | `number \| null` | no | — |
| `boot` | `boolean \| null` | no | — |
| `delete_on_termination` | `boolean \| null` | no | — |

Interfaz `UnusedAttachment` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instance_id` | `string \| null` | no | — |
| `device` | `string \| null` | no | — |
| `state` | `string \| null` | no | — |
| `attach_time` | `string \| null` | no | — |
| `delete_on_termination` | `boolean \| null` | no | — |

Interfaz `UnusedRelated` (exportada) — Elemento relacionado con el recurso: registro DNS, backend pool, subred, base de datos asociada...:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `type` | `string` | no | — |
| `id` | `string` | no | — |
| `name` | `string \| null` | no | — |
| `status` | `string \| null` | no | — |
| `detail` | `string \| null` | no | — |
| `group` | `string \| null` | no | Título del bloque en el que se agrupa ("Registros DNS", "Target groups"...). |

Interfaz `UnusedDetails` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `network_interfaces` | `UnusedNetworkInterface[]` | no | — |
| `disks` | `UnusedDisk[]` | no | — |
| `attachments` | `UnusedAttachment[]` | no | — |
| `related` | `UnusedRelated[]` | no | — |

Interfaz `UnusedHistoryEntry` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `string \| null` | no | — |
| `status` | `string \| null` | no | — |
| `resource_type` | `string \| null` | no | — |
| `metrics` | `Record<string, number \| null>` | no | Por nombre de métrica (el mismo de `metrics`). |
| `attributes` | `Record<string, unknown>` | no | — |

Interfaz `UnusedResource` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource_id` | `string` | no | — |
| `resource_name` | `string` | no | — |
| `resource_type` | `string \| null` | no | — |
| `region` | `string \| null` | no | — |
| `scope` | `string \| null` | no | — |
| `status` | `string \| null` | no | — |
| `sync_time` | `string \| null` | no | — |
| `metrics` | `UnusedMetric[]` | no | — |
| `cost` | `number \| null` | no | — |
| `currency` | `string` | no | — |
| `cost_local` | `number \| null` | no | — |
| `cost_local_currency` | `string \| null` | no | — |
| `potential_savings` | `number \| null` | no | Ahorro mensual estimado (USD) si se elimina el recurso, cuando la API lo calcula. |
| `diagnosis` | `UnusedDiagnosis` | no | — |
| `attributes` | `Record<string, unknown>` | no | — |
| `details` | `UnusedDetails` | no | — |
| `history` | `UnusedHistoryEntry[]` | no | — |

- Usado por: [`UnusedLoadbalancersV2FilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-unusedloadbalancersv2filtercomponent-tsx), [`UnusedNatGatewaysFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-unusednatgatewaysfiltercomponent-tsx), [`UnusedRoute53FilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-unusedroute53filtercomponent-tsx), [`UnusedAppGwFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-unusedappgwfiltercomponent-tsx), [`UnusedLoadbalancerFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-unusedloadbalancerfiltercomponent-tsx), [`UnusedTrafficManagerFilter.tsx`](components/general_azure.md#components-general-azure-filters-unusedtrafficmanagerfilter-tsx), [`UnusedVmFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-unusedvmfiltercomponent-tsx), [`UnusedVmssFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-unusedvmssfiltercomponent-tsx), [`UnusedCards.tsx`](components/shared.md#components-shared-unused-unusedcards-tsx), [`UnusedDetailModal.tsx`](components/shared.md#components-shared-unused-unuseddetailmodal-tsx), [`UnusedTable.tsx`](components/shared.md#components-shared-unused-unusedtable-tsx), [`UnusedView.tsx`](components/shared.md#components-shared-unused-unusedview-tsx), [`types.ts`](components/shared.md#components-shared-unused-types-ts), [`unusedConfigs.ts`](components/shared.md#components-shared-unused-unusedconfigs-ts), [`unused.ts`](lib.md#lib-unused-ts)

---

<a id="interfaces-vertex-comparison-gcpvertexcomparisoninterfaces-ts"></a>
## `interfaces/vertex-comparison/gcpVertexComparisonInterfaces.ts`

**Tipos**

Exporta:

- tipo `GcpVertexConfidence` = `'HIGH' | 'MEDIUM' | 'LOW'`
- tipo `GcpVertexProviderKey` = `'bedrock' | 'foundry'`
- interfaz `GcpVertexUsage`
- interfaz `GcpVertexMetric`
- interfaz `GcpVertexEndpoint`
- interfaz `GcpVertexCandidateDimension`
- interfaz `GcpVertexCandidate`
- interfaz `GcpVertexProviderCandidates`
- interfaz `GcpVertexDeprecation`
- interfaz `GcpVertexReplacementConfig`
- interfaz `GcpVertexModel`
- interfaz `GcpVertexSummary`
- interfaz `GcpVertexMetricIssue`
- interfaz `GcpVertexCatalogBuildRegion`
- interfaz `GcpVertexProviderDiagnostics`
- interfaz `GcpVertexProviderSummaryBase`
- interfaz `GcpVertexBedrockSummary`
- interfaz `GcpVertexFoundrySummary`
- interfaz `GcpVertexBedrockComparison`
- interfaz `GcpVertexFoundryComparison`
- interfaz `GcpVertexDiagnostics`
- interfaz `GcpVertexComparison`
- tipo `GcpVertexComparisonResponse` = `GcpVertexComparison[]`
- interfaz `GcpVertexCostBridgePoint`
- interfaz `GcpVertexTokenMixPoint`
- interfaz `GcpVertexCandidateConfidenceRow`
- interfaz `GcpVertexDimensionLadderRow`
- interfaz `GcpVertexModelPanel`
- interfaz `GcpVertexEndpointRow`

Interfaz `GcpVertexUsage` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `dimension` | `string` | no | — |
| `dimension_label` | `string` | no | — |
| `tokens` | `number` | no | — |
| `cost_usd` | `number` | no | — |
| `catalog_cost_usd` | `number` | no | — |
| `price_per_1m_usd` | `number \| null` | no | — |

Interfaz `GcpVertexMetric` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_name` | `string` | no | — |
| `dimension` | `string` | no | — |
| `dimension_label` | `string` | no | — |
| `unit_of_measure` | `string` | no | — |
| `quantity` | `number` | no | — |
| `tokens` | `number` | no | — |
| `cost_usd` | `number` | no | — |

Interfaz `GcpVertexEndpoint` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `endpoint_id` | `string` | no | — |
| `name` | `string` | no | — |
| `project_id` | `string` | no | — |
| `location` | `string` | no | — |
| `deployed_model_id` | `string` | no | — |
| `traffic_percentage` | `number` | no | — |
| `model_version` | `string` | no | — |
| `tokens_input` | `number` | no | — |
| `tokens_output` | `number` | no | — |
| `tokens_total` | `number` | no | — |
| `allocation_share` | `number` | no | — |
| `allocated_cost_usd` | `number` | no | — |
| `is_idle` | `boolean` | no | — |

Interfaz `GcpVertexCandidateDimension` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `dimension` | `string` | no | — |
| `dimension_label` | `string` | no | — |
| `tokens` | `number` | no | — |
| `gcp_price_per_1m_usd` | `number \| null` | no | — |
| `gcp_cost_usd` | `number` | no | — |
| `price_per_1m_usd` | `number \| null` | no | — |
| `cost_usd` | `number` | no | — |
| `delta_usd` | `number` | no | — |
| `price_source_dimension` | `string` | no | — |
| `dimension_fallback` | `boolean` | no | — |

Interfaz `GcpVertexCandidate` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `model_id` | `string` | no | — |
| `model_name` | `string` | no | — |
| `provider` | `string \| null` | no | — |
| `region` | `string \| null` | no | — |
| `model_class` | `string` | no | — |
| `equivalence_class` | `string` | no | — |
| `input_modalities` | `string[] \| null` | no | — |
| `output_modalities` | `string[] \| null` | no | — |
| `inference_types_supported` | `string[] \| null` | no | — |
| `lifecycle_status` | `string \| null` | no | — |
| `price_similarity` | `number` | no | — |
| `dimension_coverage` | `number` | no | — |
| `equivalence_score` | `number` | no | — |
| `price_ratios` | `Record<string, number>` | no | — |
| `confidence` | `GcpVertexConfidence` | no | — |
| `priced` | `boolean` | no | — |
| `projected_cost_usd` | `number` | no | — |
| `gcp_cost_usd` | `number` | no | — |
| `delta_usd` | `number` | no | — |
| `delta_percent` | `number` | no | — |
| `dimensions` | `GcpVertexCandidateDimension[]` | no | — |
| `dimension_fallback` | `boolean` | no | — |
| `missing_dimensions` | `string[]` | no | — |
| `price_scope_sources` | `Record<string, string \| null> \| null` | no | — |
| `unresolved_price_rows` | `number \| null` | no | — |
| `rationale` | `string` | no | — |
| `equivalent_models` | `string[]` | no | — |
| `equivalent_models_count` | `number` | no | — |
| `rank` | `number \| null` | no | — |
| `is_recommended` | `boolean` | no | — |

Interfaz `GcpVertexProviderCandidates` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `region` | `string \| null` | no | — |
| `price_variant` | `string` | no | — |
| `candidates` | `GcpVertexCandidate[]` | no | — |

Interfaz `GcpVertexDeprecation` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `inference` | `string` | sí | — |
| `fine_tune` | `string` | sí | — |

Interfaz `GcpVertexReplacementConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `target_model_name` | `string` | no | — |
| `target_model_version` | `string` | no | — |
| `auto_upgrade_start_date` | `string` | no | — |
| `upgrade_on_expiry_lead_time_days` | `number` | no | — |

Interfaz `GcpVertexModel` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `gcp_model_name` | `string` | no | — |
| `gcp_model_version` | `string` | no | — |
| `gcp_base_model` | `string \| null` | no | — |
| `gcp_model_format` | `string \| null` | no | — |
| `model_class` | `string` | no | — |
| `model_class_label` | `string` | no | — |
| `lifecycle_status` | `string \| null` | no | — |
| `deprecation` | `GcpVertexDeprecation \| null` | no | — |
| `replacement_config` | `GcpVertexReplacementConfig \| null` | no | — |
| `gcp_cost_usd` | `number` | no | — |
| `gcp_catalog_cost_usd` | `number` | no | — |
| `tokens_total` | `number` | no | — |
| `usage` | `GcpVertexUsage[]` | no | — |
| `resource_locations` | `string[]` | no | — |
| `project_ids` | `string[]` | no | — |
| `metrics` | `GcpVertexMetric[]` | no | — |
| `endpoints` | `GcpVertexEndpoint[]` | no | — |
| `endpoints_total` | `number` | no | — |
| `endpoints_idle` | `number` | no | — |
| `allocation_basis` | `string` | no | — |
| `gcp_region` | `string \| null` | no | — |
| `endpoint_type` | `string \| null` | no | — |
| `bedrock` | `GcpVertexProviderCandidates` | no | — |
| `foundry` | `GcpVertexProviderCandidates` | no | — |

Interfaz `GcpVertexSummary` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `gcp_cost_usd` | `number` | no | — |
| `models_total` | `number` | no | — |
| `endpoints_total` | `number` | no | — |
| `endpoints_idle` | `number` | no | — |

Interfaz `GcpVertexMetricIssue` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_name` | `string` | no | — |
| `metric_sub_category` | `string` | sí | — |
| `gcp_model_name` | `string` | sí | — |
| `cost_usd` | `number` | no | — |

Interfaz `GcpVertexCatalogBuildRegion` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `foundation_models` | `number` | sí | — |
| `usable_models` | `number` | sí | — |
| `price_groups` | `number` | sí | — |
| `joined_models` | `number` | sí | — |
| `unjoined_models` | `number` | sí | — |
| `unjoined_sample` | `string[]` | sí | — |
| `price_catalog_versions` | `Record<string, number>` | sí | — |
| `price_rows` | `number` | sí | — |
| `excluded_rows` | `number` | sí | — |
| `unresolved_rows` | `number` | sí | — |
| `model_groups` | `number` | sí | — |
| `priced_models` | `number` | sí | — |
| `price_catalog_sync_time` | `string` | sí | — |

Interfaz `GcpVertexProviderDiagnostics` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `unresolved_price_rows` | `number` | no | — |
| `catalog_models` | `number` | no | — |
| `catalog_classes` | `Record<string, number>` | no | — |
| `catalog_build` | `Record<string, GcpVertexCatalogBuildRegion>` | no | — |

Interfaz `GcpVertexProviderSummaryBase` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `gcp_cost_usd` | `number` | no | — |
| `delta_usd` | `number` | no | — |
| `delta_percent` | `number` | no | — |
| `coverage_percent` | `number` | no | — |
| `models_total` | `number` | no | — |
| `models_unmapped` | `number` | no | — |

Interfaz `GcpVertexBedrockSummary` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `bedrock_projected_cost_usd` | `number` | no | — |

Interfaz `GcpVertexFoundrySummary` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `foundry_projected_cost_usd` | `number` | no | — |

Interfaz `GcpVertexBedrockComparison` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `summary` | `GcpVertexBedrockSummary` | no | — |
| `diagnostics` | `GcpVertexProviderDiagnostics` | no | — |

Interfaz `GcpVertexFoundryComparison` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `summary` | `GcpVertexFoundrySummary` | no | — |
| `diagnostics` | `GcpVertexProviderDiagnostics` | no | — |

Interfaz `GcpVertexDiagnostics` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metrics_rows` | `number` | no | — |
| `endpoints_matched` | `number` | no | — |

Interfaz `GcpVertexComparison` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `project_id` | `string` | no | — |
| `project_number` | `string \| null` | no | — |
| `service_label` | `string \| null` | no | — |
| `region` | `string \| null` | no | — |
| `resource_id` | `string \| null` | no | — |
| `resource_name` | `string \| null` | no | — |
| `summary` | `GcpVertexSummary` | no | — |
| `models` | `GcpVertexModel[]` | no | — |
| `unmapped_metrics` | `GcpVertexMetricIssue[]` | no | — |
| `unresolved_metrics` | `GcpVertexMetricIssue[]` | no | — |
| `diagnostics` | `GcpVertexDiagnostics` | no | — |
| `bedrock` | `GcpVertexBedrockComparison` | no | — |
| `foundry` | `GcpVertexFoundryComparison` | no | — |

Interfaz `GcpVertexCostBridgePoint` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `model` | `string` | no | — |
| `gcp_cost_usd` | `number` | no | — |
| `projected_cost_usd` | `number` | no | — |
| `delta_usd` | `number` | no | — |
| `delta_percent` | `number` | no | — |
| `recommended_model` | `string` | no | — |
| `has_recommendation` | `boolean` | no | — |

Interfaz `GcpVertexTokenMixPoint` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `model` | `string` | no | — |
| `input` | `number` | no | — |
| `cache_read` | `number` | no | — |
| `cache_write` | `number` | no | — |
| `output` | `number` | no | — |
| `total` | `number` | no | — |
| `input_cost` | `number` | no | — |
| `cache_read_cost` | `number` | no | — |
| `cache_write_cost` | `number` | no | — |
| `output_cost` | `number` | no | — |
| `total_cost` | `number` | no | — |

Interfaz `GcpVertexCandidateConfidenceRow` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `gcp_model_name` | `string` | no | — |
| `candidate_model_name` | `string` | no | — |
| `provider` | `string` | no | — |
| `region` | `string` | no | — |
| `equivalence_score` | `number` | no | — |
| `delta_percent` | `number` | no | — |
| `projected_cost_usd` | `number` | no | — |
| `confidence` | `GcpVertexConfidence` | no | — |
| `is_recommended` | `boolean` | no | — |
| `is_eligible` | `boolean` | no | — |

Interfaz `GcpVertexDimensionLadderRow` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `dimension` | `string` | no | — |
| `dimension_label` | `string` | no | — |
| `tokens` | `number` | no | — |
| `token_share` | `number` | no | — |
| `gcp_price_per_1m_usd` | `number \| null` | no | — |
| `gcp_cost_usd` | `number` | no | — |
| `candidate_price_per_1m_usd` | `number \| null` | no | — |
| `candidate_cost_usd` | `number \| null` | no | — |
| `delta_usd` | `number \| null` | no | — |
| `dimension_fallback` | `boolean` | no | — |

Interfaz `GcpVertexModelPanel` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `gcp_model_name` | `string` | no | — |
| `gcp_model_version` | `string` | no | — |
| `gcp_base_model` | `string \| null` | no | — |
| `model_class_label` | `string` | no | — |
| `endpoint_type` | `string` | no | — |
| `gcp_region` | `string` | no | — |
| `candidate_region` | `string` | no | — |
| `lifecycle_status` | `string` | no | — |
| `deprecation_label` | `string` | no | — |
| `gcp_cost_usd` | `number` | no | — |
| `tokens_total` | `number` | no | — |
| `blended_price_per_1m_usd` | `number` | no | — |
| `endpoints_total` | `number` | no | — |
| `endpoints_idle` | `number` | no | — |
| `candidates_total` | `number` | no | — |
| `recommended_model` | `string` | no | — |
| `recommended_provider` | `string` | no | — |
| `recommended_confidence` | `string` | no | — |
| `recommended_cost_usd` | `number \| null` | no | — |
| `recommended_delta_usd` | `number \| null` | no | — |
| `recommended_delta_percent` | `number \| null` | no | — |
| `recommended_equivalence` | `number \| null` | no | — |
| `recommended_rationale` | `string` | no | — |
| `ladder` | `GcpVertexDimensionLadderRow[]` | no | — |

Interfaz `GcpVertexEndpointRow` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `endpoint_id` | `string` | no | — |
| `name` | `string` | no | — |
| `gcp_model_name` | `string` | no | — |
| `model_version` | `string` | no | — |
| `location` | `string` | no | — |
| `project_id` | `string` | no | — |
| `traffic_percentage` | `number` | no | — |
| `tokens_input` | `number` | no | — |
| `tokens_output` | `number` | no | — |
| `tokens_total` | `number` | no | — |
| `allocation_share` | `number` | no | — |
| `allocated_cost_usd` | `number` | no | — |
| `is_idle` | `boolean` | no | — |
| `status_label` | `string` | no | — |

- Usado por: [`GcpVertexComparisonComponent.tsx`](components/google-vertex.md#components-google-vertex-comparacion-gcpvertexcomparisoncomponent-tsx), [`GcpVertexComparisonCandidateConfidenceComponent.tsx`](components/google-vertex.md#components-google-vertex-comparacion-info-gcpvertexcomparisoncandidateconfidencecomponent-tsx), [`GcpVertexComparisonCardsComponent.tsx`](components/google-vertex.md#components-google-vertex-comparacion-info-gcpvertexcomparisoncardscomponent-tsx), [`GcpVertexComparisonCostBridgeComponent.tsx`](components/google-vertex.md#components-google-vertex-comparacion-info-gcpvertexcomparisoncostbridgecomponent-tsx), [`GcpVertexComparisonModelPanelsComponent.tsx`](components/google-vertex.md#components-google-vertex-comparacion-info-gcpvertexcomparisonmodelpanelscomponent-tsx), [`GcpVertexComparisonTokenMixComponent.tsx`](components/google-vertex.md#components-google-vertex-comparacion-info-gcpvertexcomparisontokenmixcomponent-tsx), [`GcpVertexComparisonViewComponent.tsx`](components/google-vertex.md#components-google-vertex-comparacion-info-gcpvertexcomparisonviewcomponent-tsx), [`GcpVertexComparisonEndpointsColumns.tsx`](components/google-vertex.md#components-google-vertex-comparacion-table-gcpvertexcomparisonendpointscolumns-tsx), [`GcpVertexComparisonEndpointsTableComponent.tsx`](components/google-vertex.md#components-google-vertex-comparacion-table-gcpvertexcomparisonendpointstablecomponent-tsx)

---

<a id="interfaces-vertex-cost-optimization-gcpvertexmodels-ts"></a>
## `interfaces/vertex-cost-optimization/gcpVertexModels.ts`

**Tipos**

Exporta:

- interfaz `VertexRateObject`
- interfaz `VertexMeterDetail`
- interfaz `VertexBillingPriceComparison`
- interfaz `VertexSimilarityDetail`
- interfaz `VertexModelSimilarity`
- interfaz `VertexTechnicalParityReport`
- interfaz `VertexPriceComparison`
- interfaz `VertexModelProfile`
- interfaz `VertexModelCost`
- interfaz `VertexPriceRateResponse`

Interfaz `VertexRateObject` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sku_id` | `string` | sí | — |
| `sku_ids` | `string[]` | sí | — |
| `sku_descriptions` | `string[]` | sí | — |
| `description` | `string` | sí | — |
| `meter_name` | `string` | sí | — |
| `price` | `number` | sí | — |
| `net_price` | `number` | sí | — |
| `price_per_1m_usd` | `number` | sí | — |
| `net_price_per_1m_usd` | `number` | sí | — |
| `unit` | `string` | sí | — |
| `currency` | `string` | sí | — |
| `effective_time` | `string` | sí | — |

Interfaz `VertexMeterDetail` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `source` | `string \| null` | sí | — |
| `direction` | `string \| null` | sí | — |
| `sku_id` | `string \| null` | sí | — |
| `sku_description` | `string \| null` | sí | — |
| `usage_amount` | `number \| null` | sí | — |
| `usage_billed_amount` | `number \| null` | sí | — |
| `usage_unit` | `string \| null` | sí | — |
| `usage_billed_unit` | `string \| null` | sí | — |
| `cost_gross_usd` | `number \| null` | sí | — |
| `cost_net_usd` | `number \| null` | sí | — |
| `credits_amount_usd` | `number \| null` | sí | — |
| `price_effective` | `number \| null` | sí | — |
| `location_region` | `string \| null` | sí | — |
| `api_location` | `string \| null` | sí | — |
| `usage_start_time` | `string \| null` | sí | — |
| `usage_end_time` | `string \| null` | sí | — |

Interfaz `VertexBillingPriceComparison` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `direction` | `string` | no | — |
| `tokens` | `number` | no | — |
| `catalog_cost_usd` | `number` | no | — |
| `billing_cost_usd` | `number` | no | — |
| `billing_gross_cost_usd` | `number` | sí | — |
| `delta_usd` | `number` | no | — |
| `delta_percent` | `number` | no | — |
| `catalog_rate` | `VertexRateObject \| null` | sí | — |
| `billing_rate` | `VertexRateObject \| null` | sí | — |

Interfaz `VertexSimilarityDetail` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `required` | `string[]` | sí | — |
| `matched` | `string[]` | sí | — |
| `missing` | `string[]` | sí | — |
| `unknown` | `string[]` | sí | — |
| `score` | `number \| null` | sí | — |
| `source` | `string` | sí | — |
| `fallback_used` | `string[]` | sí | — |
| `ratios` | `Record<string, number>` | sí | — |
| `price_similarity_pct` | `number \| null` | sí | — |
| `dimension_coverage_pct` | `number \| null` | sí | — |

Interfaz `VertexModelSimilarity` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `score` | `number \| null` | sí | — |
| `level` | `string` | sí | — |
| `basis` | `string` | sí | — |
| `evidence_coverage_pct` | `number \| null` | sí | — |
| `weights` | `Record<string, number>` | sí | — |
| `skills` | `VertexSimilarityDetail` | sí | — |
| `capabilities` | `VertexSimilarityDetail` | sí | — |
| `pricing` | `VertexSimilarityDetail` | sí | — |
| `category_alignment` | `Record<string, unknown> \| null` | sí | — |
| `limitations` | `string[]` | sí | — |

Interfaz `VertexTechnicalParityReport` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `is_100_percent_compatible` | `boolean` | sí | — |
| `missing_capabilities` | `string[]` | sí | — |
| `infrastructure_warning` | `string` | sí | — |
| `current_max_tpm` | `number` | sí | — |
| `candidate_max_tpm` | `number` | sí | — |

Interfaz `VertexPriceComparison` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `modelName` | `string` | no | — |
| `provider` | `string` | no | — |
| `estimated_cost` | `number` | no | — |
| `cost_breakdown` | `Record<string, number>` | sí | — |
| `detailed_cost_breakdown` | `Record<string, number>` | sí | — |
| `base_rates` | `Record<string, VertexRateObject>` | sí | — |
| `detailed_base_rates` | `Record<string, VertexRateObject>` | sí | — |
| `delta_pct_vs_catalog` | `number \| null` | sí | — |
| `delta_pct_vs_billing` | `number \| null` | sí | — |
| `missing_rates` | `string[]` | sí | — |
| `technical_parity_report` | `VertexTechnicalParityReport` | sí | — |
| `model_similarity` | `VertexModelSimilarity` | sí | — |
| `model_profile` | `VertexModelProfile` | sí | — |

Interfaz `VertexModelProfile` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `stars` | `number` | no | — |
| `tier` | `string` | no | — |
| `description` | `string` | no | — |

Interfaz `VertexModelCost` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `project_id` | `string` | no | — |
| `region` | `string` | no | — |
| `resource_id` | `string` | no | — |
| `resource_type` | `string` | no | — |
| `endpoint_id` | `string \| null` | sí | — |
| `endpoint_name` | `string \| null` | sí | — |
| `deployed_model_id` | `string \| null` | sí | — |
| `model_id` | `string \| null` | sí | — |
| `model_name` | `string` | no | — |
| `model_version` | `string` | no | — |
| `base_model` | `string \| null` | sí | — |
| `provider` | `string` | no | — |
| `tokens` | `Record<string, number>` | no | — |
| `throughput` | `Record<string, number>` | sí | — |
| `cost_breakdown` | `Record<string, number>` | no | — |
| `total_cost` | `number` | no | — |
| `billing_cost_breakdown` | `Record<string, number>` | sí | — |
| `billing_gross_cost_breakdown` | `Record<string, number>` | sí | — |
| `billing_quantity_breakdown` | `Record<string, number>` | sí | — |
| `total_billing_cost` | `number` | sí | — |
| `total_billing_gross_cost` | `number` | sí | — |
| `billing_match_state` | `string` | sí | — |
| `catalog_rates` | `Record<string, VertexRateObject>` | no | — |
| `billing_rates` | `Record<string, VertexRateObject>` | sí | — |
| `meter_details` | `VertexMeterDetail[]` | sí | — |
| `billing_price_comparison` | `VertexBillingPriceComparison[]` | sí | — |
| `price_comparison` | `VertexPriceComparison[]` | sí | — |
| `model_profile` | `VertexModelProfile` | sí | — |
| `missing_rates` | `string[]` | sí | — |
| `data_state` | `string` | sí | — |

Interfaz `VertexPriceRateResponse` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `has_data` | `boolean` | no | — |
| `message` | `string \| null` | sí | — |
| `data` | `VertexModelCost[]` | no | — |

- Usado por: [`COGcpVertexComponent.tsx`](components/google-vertex.md#components-google-vertex-costo-optimizacion-vertex-models-cogcpvertexcomponent-tsx), [`COGcpVertexCardsComponent.tsx`](components/google-vertex.md#components-google-vertex-costo-optimizacion-vertex-models-info-cogcpvertexcardscomponent-tsx)

---

<a id="interfaces-vista-advisor-advisorviewinterfaces-ts"></a>
## `interfaces/vista-advisor/advisorViewInterfaces.ts`

**Tipos**

Exporta:

- tipo `AdvisorApiResponse` = `AllAdvisorRecommendations[]`
- interfaz `AllAdvisorRecommendations`
- interfaz `AllAdvisorRecommendationsData`
- interfaz `AdvisorCheckDetails`
- interfaz `AdvisorCheckDetailsFlaggedResources`

Interfaz `AllAdvisorRecommendations` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `category` | `string` | no | — |
| `recommendations` | `AllAdvisorRecommendationsData[]` | no | — |
| `total_recommendations` | `number` | no | — |
| `total_ok_recommendations` | `number` | sí | — |
| `total_warning_recommendations` | `number` | sí | — |
| `total_not_available_recommendations` | `number` | sí | — |
| `total_error_recommendations` | `number` | sí | — |

Interfaz `AllAdvisorRecommendationsData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `description` | `string` | no | — |
| `check_id` | `string` | no | — |
| `sync_time` | `string` | no | — |
| `name` | `string` | no | — |
| `check_details` | `AdvisorCheckDetails[] \| []` | no | — |

Interfaz `AdvisorCheckDetails` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `categorySpecificSummary` | `{ costOptimizing?: { estimatedMonthlySavings?: number; estimatedPerce…` | sí | — |
| `flaggedResources` | `AdvisorCheckDetailsFlaggedResources[]` | sí | — |
| `resourcesSummary` | `{ resourcesProcessed?: number; resourcesFlagged?: number; resourcesIg…` | sí | — |
| `status` | `string` | sí | — |
| `sync_time` | `string` | sí | — |

Interfaz `AdvisorCheckDetailsFlaggedResources` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `status` | `string` | sí | — |
| `region` | `string` | sí | — |
| `resourceId` | `string` | sí | — |
| `isSuppressed` | `boolean` | sí | — |
| `metadata` | `string[]` | sí | — |

- Usado por: [`AdvisorViewComponent.tsx`](components/aws/vista-advisor.md#components-aws-vista-advisor-advisorviewcomponent-tsx), [`AdvisorViewPieChartComponent.tsx`](components/aws/vista-advisor.md#components-aws-vista-advisor-grafico-advisorviewpiechartcomponent-tsx), [`AdvisorViewInfoComponent.tsx`](components/aws/vista-advisor.md#components-aws-vista-advisor-info-advisorviewinfocomponent-tsx)

---

<a id="interfaces-vista-blob-vs-storage-allstoragecapacityinterfaces-ts"></a>
## `interfaces/vista-blob-vs-storage/allStorageCapacityInterfaces.ts`

**Tipos**

Exporta:

- interfaz `AllStorageCapacity`

Interfaz `AllStorageCapacity` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `total_capacity` | `number` | no | — |
| `resource` | `string` | no | — |
| `metric_name` | `string` | no | — |

- Usado por: [`BlobVsStorageGeneralComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-blob-vs-storage-general-blobvsstoragegeneralcomponent-tsx), [`BlobVsStorageCardsComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-blob-vs-storage-general-info-blobvsstoragecardscomponent-tsx)

---

<a id="interfaces-vista-blob-vs-storage-strgvsgeneralinterfaces-ts"></a>
## `interfaces/vista-blob-vs-storage/strgVsGeneralInterfaces.ts`

**Tipos**

Exporta:

- interfaz `StorageVsGeneralCapacity`
- interfaz `StorageVsGeneralCapacityPerService`
- interfaz `StorageVsGeneralCapacitySeries`

Interfaz `StorageVsGeneralCapacity` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `last_capacity_per_service` | `StorageVsGeneralCapacityPerService[]` | no | — |
| `last_strg_account_capacity` | `StorageVsGeneralCapacityPerService[]` | no | — |

Interfaz `StorageVsGeneralCapacityPerService` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `series` | `StorageVsGeneralCapacitySeries[]` | no | — |
| `metric` | `string` | no | — |
| `storage_account_name` | `string` | no | — |

Interfaz `StorageVsGeneralCapacitySeries` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `timestamp` | `string` | no | — |
| `value` | `number` | no | — |

- Usado por: [`BlobVsStorageGeneralComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-blob-vs-storage-general-blobvsstoragegeneralcomponent-tsx), [`BlobVsStorageGeneralCapacityComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-blob-vs-storage-general-graficos-blobvsstoragegeneralcapacitycomponent-tsx)

---

<a id="interfaces-vista-cloudsql-csqlinterfaces-ts"></a>
## `interfaces/vista-cloudsql/cSqlInterfaces.ts`

**Tipos**

Exporta:

- interfaz `CloudSqlMetrics`
- interfaz `CloudSqlMetricData`
- interfaz `CloudSqlBilling`
- interfaz `CloudSqlInfo`
- interfaz `HistoryDatum`
- interfaz `IpAddress`
- interfaz `ServerCaCert`
- interfaz `Settings`
- interfaz `FinalBackupConfig`
- interfaz `LocationPreference`
- interfaz `BackupConfiguration`
- interfaz `BackupRetentionSettings`
- interfaz `MaintenanceWindow`
- interfaz `IpConfiguration`
- interfaz `UserLabels`
- interfaz `SqlServerAuditConfig`
- interfaz `InsightsConfig`

Interfaz `CloudSqlMetrics` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `avg_value` | `number` | no | — |
| `metric_name` | `string` | no | — |
| `metric_data` | `CloudSqlMetricData[]` | no | — |

Interfaz `CloudSqlMetricData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `timestamp` | `string` | no | — |
| `metric_value` | `number` | no | — |

Interfaz `CloudSqlBilling` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cost_gross_clp` | `number` | no | — |
| `cost_gross_usd` | `number` | no | — |
| `cost_net_clp` | `number` | no | — |
| `cost_net_usd` | `number` | no | — |
| `discount_clp` | `number` | no | — |
| `discount_usd` | `number` | no | — |
| `sync_time` | `string` | no | — |
| `usage_start_time` | `string` | no | — |
| `sku` | `string` | no | — |

Interfaz `CloudSqlInfo` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `history_data` | `HistoryDatum[]` | no | — |
| `instance_name` | `string` | no | — |
| `instance_id` | `string` | no | — |

Interfaz `HistoryDatum` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `gceZone` | `string` | no | — |
| `databaseInstalledVersion` | `string` | no | — |
| `ipAddresses` | `IpAddress[]` | no | — |
| `state` | `string` | no | — |
| `region` | `string` | no | — |
| `createTime` | `string` | no | — |
| `selfLink` | `string` | no | — |
| `kind` | `string` | no | — |
| `maintenanceVersion` | `string` | no | — |
| `serviceAccountEmailAddress` | `string` | no | — |
| `serverCaCert` | `ServerCaCert` | no | — |
| `databaseVersion` | `string` | no | — |
| `project` | `string` | no | — |
| `satisfiesPzi` | `boolean` | no | — |
| `instanceType` | `string` | no | — |
| `includeReplicasForMajorVersionUpgrade` | `boolean` | no | — |
| `connectionName` | `string` | no | — |
| `settings` | `Settings` | no | — |
| `sqlNetworkArchitecture` | `string` | no | — |
| `name` | `string` | no | — |
| `backendType` | `string` | no | — |
| `project_id` | `string` | no | — |
| `source_name` | `string` | no | — |
| `replicaNames` | `unknown[]` | no | — |
| `masterInstanceName` | `string \| null` | no | — |
| `currentDiskSize` | `number \| null` | no | — |
| `maxDiskSize` | `number \| null` | no | — |
| `suspensionReason` | `unknown[]` | no | — |
| `satisfiesPzs` | `boolean` | no | — |
| `upgradableDatabaseVersions` | `unknown[]` | no | — |
| `diskEncryptionConfiguration` | `Record<string, unknown>` | no | — |
| `diskEncryptionStatus` | `Record<string, unknown>` | no | — |
| `scheduledMaintenance` | `Record<string, unknown>` | no | — |
| `outOfDiskReport` | `Record<string, unknown>` | no | — |
| `primaryDnsName` | `string \| null` | no | — |
| `writeEndpoint` | `string \| null` | no | — |
| `dnsName` | `string \| null` | no | — |
| `pscServiceAttachmentLink` | `string \| null` | no | — |
| `replicationCluster` | `Record<string, unknown>` | no | — |
| `geminiConfig` | `Record<string, unknown>` | no | — |
| `sync_time` | `string` | no | — |

Interfaz `IpAddress` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `ipAddress` | `string` | no | — |
| `type` | `string` | no | — |

Interfaz `ServerCaCert` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `kind` | `string` | no | — |
| `commonName` | `string` | no | — |
| `sha1Fingerprint` | `string` | no | — |
| `createTime` | `string` | no | — |
| `instance` | `string` | no | — |
| `certSerialNumber` | `string` | no | — |
| `expirationTime` | `string` | no | — |

Interfaz `Settings` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `edition` | `string` | no | — |
| `availabilityType` | `string` | no | — |
| `dataDiskSizeGb` | `string` | no | — |
| `connectorEnforcement` | `string` | no | — |
| `deletionProtectionEnabled` | `boolean` | no | — |
| `finalBackupConfig` | `FinalBackupConfig` | no | — |
| `replicationLagMaxSeconds` | `number` | no | — |
| `locationPreference` | `LocationPreference` | no | — |
| `backupConfiguration` | `BackupConfiguration` | no | — |
| `timeZone` | `string` | no | — |
| `activationPolicy` | `string` | no | — |
| `maintenanceWindow` | `MaintenanceWindow` | no | — |
| `ipConfiguration` | `IpConfiguration` | no | — |
| `collation` | `string` | no | — |
| `storageAutoResizeLimit` | `string` | no | — |
| `kind` | `string` | no | — |
| `advancedMachineFeatures` | `Record<string, unknown>` | no | — |
| `settingsVersion` | `string` | no | — |
| `replicationType` | `string` | no | — |
| `userLabels` | `UserLabels` | no | — |
| `retainBackupsOnDelete` | `boolean` | no | — |
| `storageAutoResize` | `boolean` | no | — |
| `sqlServerAuditConfig` | `SqlServerAuditConfig` | no | — |
| `tier` | `string` | no | — |
| `pricingPlan` | `string` | no | — |
| `dataDiskType` | `string` | no | — |
| `insightsConfig` | `InsightsConfig` | no | — |

Interfaz `FinalBackupConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `enabled` | `boolean` | no | — |

Interfaz `LocationPreference` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `zone` | `string` | no | — |
| `kind` | `string` | no | — |

Interfaz `BackupConfiguration` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `transactionLogRetentionDays` | `number` | no | — |
| `backupRetentionSettings` | `BackupRetentionSettings` | no | — |
| `transactionalLogStorageState` | `string` | no | — |
| `backupTier` | `string` | no | — |
| `startTime` | `string` | no | — |
| `pointInTimeRecoveryEnabled` | `boolean` | no | — |
| `enabled` | `boolean` | no | — |
| `kind` | `string` | no | — |

Interfaz `BackupRetentionSettings` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `retentionUnit` | `string` | no | — |
| `retainedBackups` | `number` | no | — |

Interfaz `MaintenanceWindow` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `day` | `number` | no | — |
| `hour` | `number` | no | — |
| `kind` | `string` | no | — |
| `updateTrack` | `string` | no | — |

Interfaz `IpConfiguration` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `serverCaMode` | `string` | no | — |
| `ipv4Enabled` | `boolean` | no | — |
| `sslMode` | `string` | no | — |
| `serverCertificateRotationMode` | `string` | no | — |
| `requireSsl` | `boolean` | no | — |

Interfaz `UserLabels` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `ambiente` | `string` | no | — |
| `servicio` | `string` | no | — |

Interfaz `SqlServerAuditConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `retentionInterval` | `string` | no | — |
| `uploadInterval` | `string` | no | — |
| `kind` | `string` | no | — |

Interfaz `InsightsConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `queryStringLength` | `number` | no | — |
| `enhancedQueryInsightsEnabled` | `boolean` | no | — |
| `queryPlansPerMinute` | `number` | no | — |

- Usado por: [`CloudSqlComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-cloudsql-cloudsqlcomponent-tsx), [`CloudSqlChartComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-cloudsql-grafico-cloudsqlchartcomponent-tsx), [`CloudSqlHistoricInfoComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-cloudsql-info-cloudsqlhistoricinfocomponent-tsx), [`CloudSqlInfoComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-cloudsql-info-cloudsqlinfocomponent-tsx), [`CloudSqlMetricsCardComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-cloudsql-info-cloudsqlmetricscardcomponent-tsx), [`CloudSqlBillingColumns.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-cloudsql-table-cloudsqlbillingcolumns-tsx), [`CloudSqlBillingTableComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-cloudsql-table-cloudsqlbillingtablecomponent-tsx)

---

<a id="interfaces-vista-compute-engine-ceinterfaces-ts"></a>
## `interfaces/vista-compute-engine/cEInterfaces.ts`

**Tipos**

Exporta:

- interfaz `ComputeEngineMetrics`
- interfaz `ComputeEngineMetricData`
- interfaz `ComputeEngineInfoServiceAccount`
- interfaz `ComputeEngineInfoIntegrityPolicy`
- interfaz `ComputeEngineInfoScheduling`
- interfaz `ComputeEngineInfoMetadataItem`
- interfaz `ComputeEngineInfoMetadata`
- interfaz `ComputeEngineInfoShieldedConfig`
- interfaz `ComputeEngineInfoDbxItem`
- interfaz `ComputeEngineInfoShieldedInitialState`
- interfaz `ComputeEngineInfoGuestOsFeature`
- interfaz `ComputeEngineInfoDisk`
- interfaz `ComputeEngineInfoAccessConfig`
- interfaz `ComputeEngineInfoNetworkInterface`
- interfaz `ComputeEngineInfoEffectiveMetadata`
- interfaz `ComputeEngineInfoResourceStatus`
- interfaz `ComputeEngineInfoTags`
- interfaz `ComputeEngineInfoHistoryData`
- interfaz `ComputeEngineInfo`
- tipo `ComputeEngineInfoResponse` = `ComputeEngineInfo[]`
- interfaz `ComputeEngineBilling`

Interfaz `ComputeEngineMetrics` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `avg_value` | `number` | no | — |
| `metric_name` | `string` | no | — |
| `metric_data` | `ComputeEngineMetricData[]` | no | — |

Interfaz `ComputeEngineMetricData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `timestamp` | `string` | no | — |
| `metric_value` | `number` | no | — |

Interfaz `ComputeEngineInfoServiceAccount` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `scopes` | `string[]` | no | — |
| `email` | `string` | no | — |

Interfaz `ComputeEngineInfoIntegrityPolicy` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `updateAutoLearnPolicy` | `boolean` | no | — |

Interfaz `ComputeEngineInfoScheduling` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `preemptible` | `boolean` | no | — |
| `onHostMaintenance` | `string` | no | — |
| `provisioningModel` | `string` | no | — |
| `instanceTerminationAction` | `string` | no | — |
| `automaticRestart` | `boolean` | no | — |

Interfaz `ComputeEngineInfoMetadataItem` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `key` | `string` | no | — |
| `value` | `string` | no | — |

Interfaz `ComputeEngineInfoMetadata` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `items` | `ComputeEngineInfoMetadataItem[]` | no | — |

Interfaz `ComputeEngineInfoShieldedConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `enableSecureBoot` | `boolean` | no | — |
| `enableIntegrityMonitoring` | `boolean` | no | — |
| `enableVtpm` | `boolean` | no | — |

Interfaz `ComputeEngineInfoDbxItem` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `content` | `string` | no | — |
| `fileType` | `string` | no | — |

Interfaz `ComputeEngineInfoShieldedInitialState` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `dbxs` | `ComputeEngineInfoDbxItem[]` | sí | — |
| `dbx` | `ComputeEngineInfoDbxItem[]` | sí | — |

Interfaz `ComputeEngineInfoGuestOsFeature` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `type` | `string` | no | — |

Interfaz `ComputeEngineInfoDisk` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `type` | `string` | no | — |
| `source` | `string` | no | — |
| `architecture` | `string` | no | — |
| `autoDelete` | `boolean` | no | — |
| `index` | `number` | no | — |
| `boot` | `boolean` | no | — |
| `deviceName` | `string` | no | — |
| `shieldedInstanceInitialState` | `ComputeEngineInfoShieldedInitialState` | sí | — |
| `diskSizeGb` | `string` | sí | — |
| `guestOsFeatures` | `ComputeEngineInfoGuestOsFeature[]` | sí | — |
| `licenses` | `string[]` | sí | — |
| `interface` | `string` | no | — |
| `mode` | `string` | no | — |

Interfaz `ComputeEngineInfoAccessConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `networkTier` | `string` | no | — |
| `name` | `string` | no | — |
| `type` | `string` | no | — |

Interfaz `ComputeEngineInfoNetworkInterface` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `stackType` | `string` | no | — |
| `networkIP` | `string` | no | — |
| `subnetwork` | `string` | no | — |
| `name` | `string` | no | — |
| `fingerprint` | `string` | no | — |
| `accessConfigs` | `ComputeEngineInfoAccessConfig[]` | no | — |
| `network` | `string` | no | — |

Interfaz `ComputeEngineInfoEffectiveMetadata` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `vmDnsSettingMetadataValue` | `string` | no | — |

Interfaz `ComputeEngineInfoResourceStatus` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `effectiveInstanceMetadata` | `ComputeEngineInfoEffectiveMetadata` | no | — |
| `scheduling` | `Record<string, unknown>` | no | — |

Interfaz `ComputeEngineInfoTags` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `fingerprint` | `string` | no | — |

Interfaz `ComputeEngineInfoHistoryData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `satisfiesPzi` | `boolean` | no | — |
| `id` | `string` | no | — |
| `status` | `string` | no | — |
| `lastStopTimestamp` | `string` | no | — |
| `lastStartTimestamp` | `string` | no | — |
| `selfLink` | `string` | no | — |
| `startRestricted` | `boolean` | no | — |
| `serviceAccounts` | `ComputeEngineInfoServiceAccount[]` | no | — |
| `creationTimestamp` | `string` | no | — |
| `shieldedInstanceIntegrityPolicy` | `ComputeEngineInfoIntegrityPolicy` | no | — |
| `scheduling` | `ComputeEngineInfoScheduling` | no | — |
| `machineType` | `string` | no | — |
| `metadata` | `ComputeEngineInfoMetadata` | no | — |
| `shieldedInstanceConfig` | `ComputeEngineInfoShieldedConfig` | no | — |
| `canIpForward` | `boolean` | no | — |
| `disks` | `ComputeEngineInfoDisk[]` | no | — |
| `zone` | `string` | no | — |
| `deletionProtection` | `boolean` | no | — |
| `networkInterfaces` | `ComputeEngineInfoNetworkInterface[]` | no | — |
| `labelFingerprint` | `string` | no | — |
| `cpuPlatform` | `string` | no | — |
| `name` | `string` | no | — |
| `fingerprint` | `string` | no | — |
| `resourceStatus` | `ComputeEngineInfoResourceStatus` | no | — |
| `tags` | `ComputeEngineInfoTags` | no | — |
| `location` | `string` | no | — |
| `project_id` | `string` | no | — |
| `source_name` | `string` | no | — |
| `sync_time` | `string` | no | — |

Interfaz `ComputeEngineInfo` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `history_data` | `ComputeEngineInfoHistoryData[]` | no | — |
| `instance_name` | `string` | no | — |
| `instance_id` | `string` | no | — |

Interfaz `ComputeEngineBilling` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cost_gross_clp` | `number` | no | — |
| `cost_gross_usd` | `number` | no | — |
| `cost_net_clp` | `number` | no | — |
| `cost_net_usd` | `number` | no | — |
| `discount_clp` | `number` | no | — |
| `discount_usd` | `number` | no | — |
| `sync_time` | `string` | no | — |
| `usage_start_time` | `string` | no | — |
| `sku` | `string` | no | — |

- Usado por: [`AzureMysqlResourceComponent.tsx`](components/azure/vista-recursos-mysql.md#components-azure-vista-recursos-mysql-azuremysqlresourcecomponent-tsx), [`AzureNodeResourceComponent.tsx`](components/azure/vista-recursos-nodos.md#components-azure-vista-recursos-nodos-azurenoderesourcecomponent-tsx), [`AzureNodeBillingTableComponent.tsx`](components/azure/vista-recursos-nodos.md#components-azure-vista-recursos-nodos-table-azurenodebillingtablecomponent-tsx), [`AzureVmBillingColumns.tsx`](components/azure/vista-recursos-nodos.md#components-azure-vista-recursos-nodos-table-azurevmbillingcolumns-tsx), [`AzurePostgresResourceComponent.tsx`](components/azure/vista-recursos-postgresql.md#components-azure-vista-recursos-postgresql-azurepostgresresourcecomponent-tsx), [`AzureVmResourceComponent.tsx`](components/azure/vista-recursos-vm.md#components-azure-vista-recursos-vm-azurevmresourcecomponent-tsx), [`AzureVmBillingColumns.tsx`](components/azure/vista-recursos-vm.md#components-azure-vista-recursos-vm-table-azurevmbillingcolumns-tsx), [`AzureVmBillingTableComponent.tsx`](components/azure/vista-recursos-vm.md#components-azure-vista-recursos-vm-table-azurevmbillingtablecomponent-tsx), [`ComputeEngineComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-computeenginecomponent-tsx), [`ComputeEngineChartComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-grafico-computeenginechartcomponent-tsx), [`ComputeEngineHistoricInfoComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-info-computeenginehistoricinfocomponent-tsx), [`ComputeEngineInfoComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-info-computeengineinfocomponent-tsx), [`ComputeEngineMetricsCardsComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-info-computeenginemetricscardscomponent-tsx), [`ComputeEngineBillingColumns.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-table-computeenginebillingcolumns-tsx), [`ComputeEngineBillingTableComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-table-computeenginebillingtablecomponent-tsx), [`InstanceGroupsInstancesColumns.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-table-instancegroupsinstancescolumns-tsx), [`InstanceGroupsInstancesTableComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-table-instancegroupsinstancestablecomponent-tsx)

---

<a id="interfaces-vista-ec2-ec2eventsresourceviewinterfaces-ts"></a>
## `interfaces/vista-ec2/ec2EventsResourceViewInterfaces.ts`

**Tipos**

Exporta:

- interfaz `Ec2ResourceViewEvents`
- tipo `Ec2ResourceViewEventsResponse` = `Ec2ResourceViewEvents[]`

Interfaz `Ec2ResourceViewEvents` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_id` | `string` | no | — |
| `EventName` | `string` | no | — |
| `EventTime` | `string` | no | — |
| `EventSource` | `string` | no | — |
| `Username` | `string` | no | — |
| `sync_time` | `string` | no | — |
| `Resources_ResourceName` | `string[]` | no | — |
| `Resources_ResourceType` | `string[]` | no | — |

- Usado por: [`InstanceEc2CpuMetricsComponent.tsx`](components/aws/vista-ec2.md#components-aws-vista-ec2-instancias-ec2-instanceec2cpumetricscomponent-tsx)

---

<a id="interfaces-vista-ec2-ec2metricsresourceviewinterfaces-ts"></a>
## `interfaces/vista-ec2/ec2MetricsResourceViewInterfaces.ts`

**Tipos**

Exporta:

- interfaz `Ec2ResourceViewMetricData`
- interfaz `Ec2ResourceViewMetricsApiResponse`

Interfaz `Ec2ResourceViewMetricData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_id` | `string` | no | — |
| `Timestamp` | `string` | no | — |
| `total` | `number \| null` | no | — |
| `unused` | `number \| null` | no | — |
| `used` | `number \| null` | no | — |
| `Value` | `number` | no | — |
| `MetricLabel` | `string` | no | — |
| `MetricId` | `string` | no | — |
| `Resource` | `string` | no | — |
| `sync_time` | `string` | no | — |

Interfaz `Ec2ResourceViewMetricsApiResponse` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metrics_data` | `Ec2ResourceViewMetricData[]` | no | — |

- Usado por: [`InstanceEc2CpuMetricsComponent.tsx`](components/aws/vista-ec2.md#components-aws-vista-ec2-instancias-ec2-instanceec2cpumetricscomponent-tsx)

---

<a id="interfaces-vista-ec2-ec2resourceviewinterfaces-ts"></a>
## `interfaces/vista-ec2/ec2ResourceViewInterfaces.ts`

**Tipos**

Exporta:

- tipo `AwsInstanceStateName` = `| 'pending' | 'running' | 'shutting-down' | 'terminated' | 'stopping' | 'stopped' | string`
- tipo `InstancePurchaseMethod` = `'on-demand' | 'spot' | 'reserved' | string`
- tipo `EbsAttachmentStatus` = `| 'attaching' | 'attached' | 'detaching' | 'detached' | string`
- interfaz `Ec2InstanceSummary`
- tipo `InstancesApiResponse` = `Ec2InstanceSummary[]`

Interfaz `Ec2InstanceSummary` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_id` | `string` | no | — |
| `PlatformDetails` | `string` | no | — |
| `InstanceId` | `string` | no | — |
| `InstanceType` | `string` | no | — |
| `LaunchTime` | `string` | no | — |
| `region` | `string` | no | — |
| `sync_time` | `string` | no | — |
| `InstancePurchaseMethod` | `InstancePurchaseMethod` | no | — |
| `State_Name` | `AwsInstanceStateName` | no | — |
| `CPU_Cores_Selected_Instance` | `number` | no | — |
| `CPU_Threads_Per_Core_Selected_Instance` | `number` | no | — |
| `Total_EBS_Volumes` | `number` | no | — |
| `Total_Attachments` | `number` | no | — |
| `BlockDeviceMappings_DeviceName` | `string[]` | no | — |
| `BlockDeviceMappings_Ebs_AttachTime` | `string[]` | no | — |
| `BlockDeviceMappings_Ebs_Status` | `EbsAttachmentStatus[]` | no | — |
| `BlockDeviceMappings_Ebs_VolumeId` | `string[]` | no | — |
| `NetworkInterfaces_Association_PublicDnsName` | `string[]` | no | — |
| `NetworkInterfaces_Association_PublicIp` | `string[]` | no | — |
| `NetworkInterfaces_Attachment_AttachmentId` | `string[]` | no | — |
| `BlockDeviceMappings_Ebs_Size` | `number[]` | no | — |

- Usado por: [`InstanceEc2CpuMetricsComponent.tsx`](components/aws/vista-ec2.md#components-aws-vista-ec2-instancias-ec2-instanceec2cpumetricscomponent-tsx), [`Ec2ResourceViewInfoComponent.tsx`](components/aws/vista-ec2.md#components-aws-vista-ec2-instancias-ec2-info-ec2resourceviewinfocomponent-tsx)

---

<a id="interfaces-vista-eventos-eventsviewinterfaces-ts"></a>
## `interfaces/vista-eventos/eventsViewInterfaces.ts`

**Tipos**

Exporta:

- tipo `EventsApiResponse` = `AllEvents[]`
- interfaz `AllEvents`
- interfaz `EventGroup`
- interfaz `AWSEvents`
- interfaz `EventsResources`

Interfaz `AllEvents` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `events` | `EventGroup[]` | no | — |
| `sync_time` | `string` | no | — |

Interfaz `EventGroup` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `event_name` | `string` | no | — |
| `docs` | `AWSEvents[]` | no | — |

Interfaz `AWSEvents` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `EventId` | `string` | no | — |
| `ReadOnly` | `string` | no | — |
| `AccessKeyId` | `string` | no | — |
| `EventTime` | `string` | no | — |
| `EventSource` | `string` | no | — |
| `Username` | `string` | no | — |
| `Resources` | `EventsResources[]` | no | — |

Interfaz `EventsResources` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `ResourceType` | `string` | no | — |
| `ResourceName` | `string` | no | — |

- Usado por: [`EventsViewComponent.tsx`](components/aws/vista-eventos.md#components-aws-vista-eventos-eventsviewcomponent-tsx), [`EventsViewEventCountComponent.tsx`](components/aws/vista-eventos.md#components-aws-vista-eventos-graficos-eventsvieweventcountcomponent-tsx), [`EventsViewInfoCardsComponent.tsx`](components/aws/vista-eventos.md#components-aws-vista-eventos-info-eventsviewinfocardscomponent-tsx), [`EventsViewInfoComponent.tsx`](components/aws/vista-eventos.md#components-aws-vista-eventos-info-eventsviewinfocomponent-tsx), [`EventsViewTableComponent.tsx`](components/aws/vista-eventos.md#components-aws-vista-eventos-table-eventsviewtablecomponent-tsx)

---

<a id="interfaces-vista-gke-gkeinterfaces-ts"></a>
## `interfaces/vista-gke/gkeInterfaces.ts`

**Tipos**

Exporta:

- interfaz `ClusterGkeMetrics`
- interfaz `ClusterGkeMetricData`
- interfaz `ClusterGkeInstances`
- interfaz `ClusterGkeInstancesData`
- interfaz `ClusterGkeInstancesDataDisks`
- interfaz `ClusterGkeInstancesDataNetworkInterfaces`
- interfaz `ClusterGkeBilling`
- interfaz `ClusterGkeResponse`
- interfaz `ClusterGkeInfo`
- interfaz `ClusterGkeNodeConfig`
- interfaz `ClusterGkeBootDisk`
- interfaz `ClusterGkeKubeletConfig`
- interfaz `ClusterGkeNodePoolDefaults`
- interfaz `ClusterGkeSecretManagerConfig`
- interfaz `ClusterGkeMasterAuth`
- interfaz `ClusterGkeMaxPodsConstraint`
- interfaz `ClusterGkeAnonymousAuthenticationConfig`
- interfaz `ClusterGkePodAutoscaling`
- interfaz `ClusterGkeAddonsConfig`
- interfaz `ClusterGkeMaintenancePolicy`
- interfaz `ClusterGkeIpAllocationPolicy`
- interfaz `ClusterGkeLoggingConfig`
- interfaz `ClusterGkeSecurityPostureConfig`
- interfaz `ClusterGkeDatabaseEncryption`
- interfaz `ClusterGkeMasterAuthorizedNetworksConfig`
- interfaz `ClusterGkeNodePoolAutoConfig`
- interfaz `ClusterGkeNotificationConfig`
- interfaz `ClusterGkeMonitoringConfig`
- interfaz `ClusterGkeRbacBindingConfig`
- interfaz `ClusterGkeAutoscaling`
- interfaz `ClusterGkeAutoProvisioningDefaults`
- interfaz `ClusterGkeControlPlaneEndpointsConfig`
- interfaz `ClusterGkeNodePool`
- interfaz `ClusterGkeNodePoolNetworkConfig`
- interfaz `ClusterGkePrivateClusterConfig`
- interfaz `ClusterGkeNetworkConfig`

Interfaz `ClusterGkeMetrics` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `avg_value` | `number` | no | — |
| `metric_name` | `string` | no | — |
| `metric_data` | `ClusterGkeMetricData[]` | no | — |

Interfaz `ClusterGkeMetricData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `timestamp` | `string` | no | — |
| `metric_value` | `number` | no | — |
| `resource_name` | `string` | no | — |

Interfaz `ClusterGkeInstances` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource_name` | `string` | no | — |
| `resource_id` | `string` | no | — |
| `instance_data` | `ClusterGkeInstancesData[]` | no | — |

Interfaz `ClusterGkeInstancesData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `status` | `string` | no | — |
| `location` | `string` | no | — |
| `disks` | `ClusterGkeInstancesDataDisks[]` | no | — |
| `cpuPlatform` | `string` | no | — |
| `networkInterfaces` | `ClusterGkeInstancesDataNetworkInterfaces[]` | no | — |
| `machineType` | `string` | no | — |
| `sync_time` | `string` | no | — |
| `creationTimestamp` | `string` | no | — |

Interfaz `ClusterGkeInstancesDataDisks` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `interface` | `string` | no | — |
| `deviceName` | `string` | no | — |
| `licenses` | `string[]` | no | — |
| `boot` | `boolean` | no | — |
| `mode` | `string` | no | — |
| `diskSizeGb` | `string` | no | — |
| `type` | `string` | no | — |
| `source` | `string` | no | — |
| `guestOsFeatures` | `[{type: string;}]` | no | — |
| `architecture` | `string` | no | — |
| `index` | `number` | no | — |
| `autoDelete` | `boolean` | no | — |
| `shieldedInstanceInitialState` | `{ [key: string]: [ { content: string; fileType: string; } ] }` | no | — |

Interfaz `ClusterGkeInstancesDataNetworkInterfaces` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `stackType` | `string` | no | — |
| `accessConfigs` | `[ { networkTier: string; type: string; name: string; natIP: string; }…` | no | — |
| `subnetwork` | `string` | no | — |
| `fingerprint` | `string` | no | — |
| `networkIP` | `string` | no | — |
| `network` | `string` | no | — |
| `name` | `string` | no | — |

Interfaz `ClusterGkeBilling` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cost_gross_clp` | `number` | no | — |
| `cost_gross_usd` | `number` | no | — |
| `cost_net_clp` | `number` | no | — |
| `cost_net_usd` | `number` | no | — |
| `discount_clp` | `number` | no | — |
| `discount_usd` | `number` | no | — |
| `sync_time` | `string` | no | — |
| `usage_start_time` | `string` | no | — |
| `sku` | `string` | no | — |
| `resource` | `string` | no | — |

Interfaz `ClusterGkeResponse` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cluster_gke_name` | `string` | no | — |
| `instance_group_id` | `string` | no | — |
| `history_data` | `ClusterGkeInfo[]` | no | — |

Interfaz `ClusterGkeInfo` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `nodeConfig` | `ClusterGkeNodeConfig` | no | — |
| `nodePoolDefaults` | `ClusterGkeNodePoolDefaults` | no | — |
| `workloadIdentityConfig` | `Record<string, unknown>` | no | — |
| `secretManagerConfig` | `ClusterGkeSecretManagerConfig` | no | — |
| `shieldedNodes` | `{ enabled: boolean }` | no | — |
| `authenticatorGroupsConfig` | `Record<string, unknown>` | no | — |
| `selfLink` | `string` | no | — |
| `etag` | `string` | no | — |
| `satisfiesPzs` | `boolean` | no | — |
| `resourceLabels` | `Record<string, string>` | no | — |
| `zone` | `string` | no | — |
| `currentNodeCount` | `number` | no | — |
| `masterAuth` | `ClusterGkeMasterAuth` | no | — |
| `monitoringService` | `string` | no | — |
| `instanceGroupUrls` | `string[]` | no | — |
| `network` | `string` | no | — |
| `status` | `string` | no | — |
| `initialClusterVersion` | `string` | no | — |
| `defaultMaxPodsConstraint` | `ClusterGkeMaxPodsConstraint` | no | — |
| `anonymousAuthenticationConfig` | `ClusterGkeAnonymousAuthenticationConfig` | no | — |
| `autopilot` | `Record<string, unknown>` | no | — |
| `podAutoscaling` | `ClusterGkePodAutoscaling` | no | — |
| `addonsConfig` | `ClusterGkeAddonsConfig` | no | — |
| `maintenancePolicy` | `ClusterGkeMaintenancePolicy` | no | — |
| `ipAllocationPolicy` | `ClusterGkeIpAllocationPolicy` | no | — |
| `loggingConfig` | `ClusterGkeLoggingConfig` | no | — |
| `securityPostureConfig` | `ClusterGkeSecurityPostureConfig` | no | — |
| `databaseEncryption` | `ClusterGkeDatabaseEncryption` | no | — |
| `masterAuthorizedNetworksConfig` | `ClusterGkeMasterAuthorizedNetworksConfig` | no | — |
| `name` | `string` | no | — |
| `nodePoolAutoConfig` | `ClusterGkeNodePoolAutoConfig` | no | — |
| `legacyAbac` | `Record<string, unknown>` | no | — |
| `notificationConfig` | `ClusterGkeNotificationConfig` | no | — |
| `monitoringConfig` | `ClusterGkeMonitoringConfig` | no | — |
| `currentNodeVersion` | `string` | no | — |
| `location` | `string` | no | — |
| `verticalPodAutoscaling` | `Record<string, unknown>` | no | — |
| `rbacBindingConfig` | `ClusterGkeRbacBindingConfig` | no | — |
| `autoscaling` | `ClusterGkeAutoscaling` | no | — |
| `loggingService` | `string` | no | — |
| `releaseChannel` | `{ channel: string }` | no | — |
| `createTime` | `string` | no | — |
| `id` | `string` | no | — |
| `binaryAuthorization` | `{ evaluationMode: string }` | no | — |
| `satisfiesPzi` | `boolean` | no | — |
| `subnetwork` | `string` | no | — |
| `clusterIpv4Cidr` | `string` | no | — |
| `userManagedKeysConfig` | `Record<string, unknown>` | no | — |
| `controlPlaneEndpointsConfig` | `ClusterGkeControlPlaneEndpointsConfig` | no | — |
| `nodePools` | `ClusterGkeNodePool[]` | no | — |
| `privateClusterConfig` | `ClusterGkePrivateClusterConfig` | no | — |
| `locations` | `string[]` | no | — |
| `enterpriseConfig` | `{ clusterTier: string }` | no | — |
| `endpoint` | `string` | no | — |
| `costManagementConfig` | `Record<string, unknown>` | no | — |
| `networkConfig` | `ClusterGkeNetworkConfig` | no | — |
| `currentMasterVersion` | `string` | no | — |
| `servicesIpv4Cidr` | `string` | no | — |
| `labelFingerprint` | `string` | no | — |
| `project_id` | `string` | no | — |
| `source_name` | `string` | no | — |
| `sync_time` | `string` | no | — |

Interfaz `ClusterGkeNodeConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `diskType` | `string` | no | — |
| `shieldedInstanceConfig` | `{ enableIntegrityMonitoring: boolean }` | no | — |
| `ephemeralStorageLocalSsdConfig` | `Record<string, unknown>` | no | — |
| `spot` | `boolean` | no | — |
| `metadata` | `Record<string, string>` | no | — |
| `effectiveCgroupMode` | `string` | no | — |
| `advancedMachineFeatures` | `Record<string, unknown>` | no | — |
| `bootDisk` | `ClusterGkeBootDisk` | no | — |
| `resourceLabels` | `Record<string, string>` | no | — |
| `windowsNodeConfig` | `Record<string, unknown>` | no | — |
| `kubeletConfig` | `ClusterGkeKubeletConfig` | no | — |
| `diskSizeGb` | `number` | no | — |
| `imageType` | `string` | no | — |
| `oauthScopes` | `string[]` | no | — |
| `serviceAccount` | `string` | no | — |
| `machineType` | `string` | no | — |

Interfaz `ClusterGkeBootDisk` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sizeGb` | `string` | no | — |
| `diskType` | `string` | no | — |

Interfaz `ClusterGkeKubeletConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `insecureKubeletReadonlyPortEnabled` | `boolean` | no | — |
| `maxParallelImagePulls` | `number` | no | — |

Interfaz `ClusterGkeNodePoolDefaults` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `nodeConfigDefaults` | `{ loggingConfig: { variantConfig: { variant: string; }; }; gcfsConfig…` | no | — |

Interfaz `ClusterGkeSecretManagerConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `rotationConfig` | `{ enabled: boolean }` | no | — |
| `enabled` | `boolean` | no | — |

Interfaz `ClusterGkeMasterAuth` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `clusterCaCertificate` | `string` | no | — |
| `clientCertificateConfig` | `Record<string, unknown>` | no | — |

Interfaz `ClusterGkeMaxPodsConstraint` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `maxPodsPerNode` | `string` | no | — |

Interfaz `ClusterGkeAnonymousAuthenticationConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `mode` | `string` | no | — |

Interfaz `ClusterGkePodAutoscaling` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `hpaProfile` | `string` | no | — |

Interfaz `ClusterGkeAddonsConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `gcsFuseCsiDriverConfig` | `Record<string, unknown>` | no | — |
| `networkPolicyConfig` | `{ disabled: boolean }` | no | — |
| `httpLoadBalancing` | `Record<string, unknown>` | no | — |
| `gkeBackupAgentConfig` | `Record<string, unknown>` | no | — |
| `dnsCacheConfig` | `{ enabled: boolean }` | no | — |
| `rayOperatorConfig` | `Record<string, unknown>` | no | — |
| `gcePersistentDiskCsiDriverConfig` | `{ enabled: boolean }` | no | — |
| `kubernetesDashboard` | `{ disabled: boolean }` | no | — |
| `gcpFilestoreCsiDriverConfig` | `Record<string, unknown>` | no | — |
| `configConnectorConfig` | `Record<string, unknown>` | no | — |
| `cloudRunConfig` | `{ disabled: boolean; loadBalancerType: string; }` | no | — |

Interfaz `ClusterGkeMaintenancePolicy` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resourceVersion` | `string` | no | — |

Interfaz `ClusterGkeIpAllocationPolicy` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `servicesIpv4Cidr` | `string` | no | — |
| `podCidrOverprovisionConfig` | `Record<string, unknown>` | no | — |
| `servicesIpv4CidrBlock` | `string` | no | — |
| `clusterSecondaryRangeName` | `string` | no | — |
| `defaultPodIpv4RangeUtilization` | `number` | no | — |
| `clusterIpv4CidrBlock` | `string` | no | — |
| `networkTierConfig` | `{ networkTier: string }` | no | — |
| `useIpAliases` | `boolean` | no | — |
| `clusterIpv4Cidr` | `string` | no | — |
| `stackType` | `string` | no | — |

Interfaz `ClusterGkeLoggingConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `componentConfig` | `{ enableComponents: string[]; }` | no | — |

Interfaz `ClusterGkeSecurityPostureConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `vulnerabilityMode` | `string` | no | — |
| `mode` | `string` | no | — |

Interfaz `ClusterGkeDatabaseEncryption` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `state` | `string` | no | — |
| `currentState` | `string` | no | — |

Interfaz `ClusterGkeMasterAuthorizedNetworksConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `privateEndpointEnforcementEnabled` | `boolean` | no | — |
| `gcpPublicCidrsAccessEnabled` | `boolean` | no | — |

Interfaz `ClusterGkeNodePoolAutoConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `nodeKubeletConfig` | `{ insecureKubeletReadonlyPortEnabled: boolean; }` | no | — |

Interfaz `ClusterGkeNotificationConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `pubsub` | `Record<string, unknown>` | no | — |

Interfaz `ClusterGkeMonitoringConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `advancedDatapathObservabilityConfig` | `{ enableRelay: boolean }` | no | — |
| `managedPrometheusConfig` | `{ autoMonitoringConfig: { scope: string }; enabled: boolean; }` | no | — |
| `componentConfig` | `{ enableComponents: string[]; }` | no | — |

Interfaz `ClusterGkeRbacBindingConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `enableInsecureBindingSystemAuthenticated` | `boolean` | no | — |
| `enableInsecureBindingSystemUnauthenticated` | `boolean` | no | — |

Interfaz `ClusterGkeAutoscaling` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `autoscalingProfile` | `string` | no | — |
| `autoprovisioningNodePoolDefaults` | `ClusterGkeAutoProvisioningDefaults` | no | — |

Interfaz `ClusterGkeAutoProvisioningDefaults` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `serviceAccount` | `string` | no | — |
| `imageType` | `string` | no | — |
| `oauthScopes` | `string[]` | no | — |
| `management` | `{ autoRepair: boolean; autoUpgrade: boolean; }` | no | — |

Interfaz `ClusterGkeControlPlaneEndpointsConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `ipEndpointsConfig` | `{ authorizedNetworksConfig: ClusterGkeMasterAuthorizedNetworksConfig;…` | no | — |
| `dnsEndpointConfig` | `{ enableK8sCertsViaDns: boolean; allowExternalTraffic: boolean; enabl…` | no | — |

Interfaz `ClusterGkeNodePool` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `upgradeSettings` | `{ strategy: string; maxSurge: number; }` | no | — |
| `status` | `string` | no | — |
| `etag` | `string` | no | — |
| `version` | `string` | no | — |
| `autoscaling` | `Record<string, unknown>` | no | — |
| `selfLink` | `string` | no | — |
| `locations` | `string[]` | no | — |
| `maxPodsConstraint` | `ClusterGkeMaxPodsConstraint` | no | — |
| `podIpv4CidrSize` | `number` | no | — |
| `networkConfig` | `ClusterGkeNodePoolNetworkConfig` | no | — |
| `queuedProvisioning` | `Record<string, unknown>` | no | — |
| `initialNodeCount` | `number` | no | — |
| `management` | `{ autoRepair: boolean; autoUpgrade: boolean; }` | no | — |
| `placementPolicy` | `Record<string, unknown>` | no | — |
| `name` | `string` | no | — |
| `config` | `ClusterGkeNodeConfig` | no | — |
| `instanceGroupUrls` | `string[]` | no | — |

Interfaz `ClusterGkeNodePoolNetworkConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `podRange` | `string` | no | — |
| `podIpv4RangeUtilization` | `number` | no | — |
| `subnetwork` | `string` | no | — |
| `podIpv4CidrBlock` | `string` | no | — |
| `enablePrivateNodes` | `boolean` | no | — |
| `networkTierConfig` | `{ networkTier: string }` | no | — |

Interfaz `ClusterGkePrivateClusterConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `enablePrivateNodes` | `boolean` | no | — |
| `privateEndpoint` | `string` | no | — |
| `publicEndpoint` | `string` | no | — |

Interfaz `ClusterGkeNetworkConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `network` | `string` | no | — |
| `defaultSnatStatus` | `Record<string, unknown>` | no | — |
| `dnsConfig` | `{ clusterDns: string }` | no | — |
| `serviceExternalIpsConfig` | `Record<string, unknown>` | no | — |
| `datapathProvider` | `string` | no | — |
| `subnetwork` | `string` | no | — |
| `disableL4LbFirewallReconciliation` | `boolean` | no | — |
| `defaultEnablePrivateNodes` | `boolean` | no | — |
| `enableFqdnNetworkPolicy` | `boolean` | no | — |

- Usado por: [`GkeComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-gkecomponent-tsx), [`GkeChartComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-grafico-gkechartcomponent-tsx), [`GkeHistoricInfoComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-info-gkehistoricinfocomponent-tsx), [`GkeInfoComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-info-gkeinfocomponent-tsx), [`GkeMetricsCardComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-info-gkemetricscardcomponent-tsx), [`GkeBillingColumns.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-table-gkebillingcolumns-tsx), [`GkeBillingComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-table-gkebillingcomponent-tsx), [`GkeBillingTableComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-table-gkebillingtablecomponent-tsx), [`GkeNodesColumns.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-table-gkenodescolumns-tsx), [`GkeNodesTableComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-table-gkenodestablecomponent-tsx)

---

<a id="interfaces-vista-infrautilizadas-ec2resourceinfrausedviewinterface-ts"></a>
## `interfaces/vista-infrautilizadas/ec2ResourceInfraUsedViewInterface.ts`

**Tipos**

Exporta:

- interfaz `Ec2InstancesResponse`
- interfaz `Root`
- interfaz `DateTimeFilter`
- interfaz `Ec2InstancesMetricsStatistics`
- interfaz `Ec2Instance`
- interfaz `State`
- interfaz `Ec2Volume`
- interfaz `Ec2Metric`
- interfaz `CreditMetric`

Interfaz `Ec2InstancesResponse` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `ec2Intances` | `Ec2Instance[]` | no | — |

Interfaz `Root` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `region` | `string[]` | no | — |
| `dateTime_filter` | `DateTimeFilter` | no | — |
| `ec2IntancesMetricsStatistics` | `Ec2InstancesMetricsStatistics` | no | — |
| `resourceList` | `string[]` | no | — |
| `resourceCount` | `number` | no | — |
| `vCpus` | `number` | no | — |
| `sumCreditBalance` | `number` | no | — |
| `ec2Intances` | `Ec2Instance[]` | no | — |
| `creditMetrics` | `CreditMetric[]` | no | — |

Interfaz `DateTimeFilter` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `from` | `string` | no | ISO date string |
| `to` | `string` | no | ISO date string |

Interfaz `Ec2InstancesMetricsStatistics` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `CPUUtilizationAverage` | `number` | no | — |
| `CPUCreditBalanceAverage` | `number` | no | — |
| `CPUCreditUsageAverage` | `number` | no | — |
| `CPUCreditUsagePercentage` | `number` | no | — |

Interfaz `Ec2Instance` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `InstanceId` | `string` | no | — |
| `sync_time` | `string` | no | — |
| `State` | `State` | no | — |
| `CoreCount` | `number` | no | — |
| `ThreadsPerCore` | `number` | no | — |
| `ResourceRegion` | `string` | no | — |
| `InstanceType` | `string` | no | — |
| `vCPUs` | `number` | no | — |
| `PublicIpCount` | `number` | no | — |
| `volumeCount` | `number` | no | — |
| `totalSize` | `number` | no | — |
| `volumes` | `Ec2Volume[]` | no | — |
| `metrics` | `Ec2Metric[]` | no | — |

Interfaz `State` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `Code` | `number` | no | — |
| `Name` | `string` | no | — |

Interfaz `Ec2Volume` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `VolumeId` | `string` | no | — |
| `Size` | `number` | no | — |
| `VolumeType` | `string` | no | — |
| `Encrypted` | `boolean` | no | — |
| `State` | `string` | no | — |
| `region` | `string` | no | — |
| `sync_time` | `string` | no | ISO datetime |

Interfaz `Ec2Metric` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `MetricLabel` | `string` | no | — |
| `ResourceRegion` | `string` | sí | opcional, porque no siempre aparece |
| `Value` | `number` | no | — |
| `used` | `number \| null` | sí | — |
| `unused` | `number \| null` | sí | — |
| `Count` | `number` | sí | — |

Interfaz `CreditMetric` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `MetricId` | `string` | no | — |
| `Timestamp` | `string` | no | — |
| `AvgValue` | `number` | no | — |

- Usado por: [`InstanceEc2InfrautilizadaComponent.tsx`](components/aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-autoscaling-instanceec2infrautilizadacomponent-tsx), [`MainEc2ResourceInfraUsedViewMetricsSummaryComponent.tsx`](components/aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-autoscaling-graficos-mainec2resourceinfrausedviewmetricssummarycomponent-tsx), [`ec2ResourceInfraUsedTableColumns.tsx`](components/aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-autoscaling-table-ec2resourceinfrausedtablecolumns-tsx), [`InstanceEc2InfrautilizadaComponent.tsx`](components/aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-ec2-instanceec2infrautilizadacomponent-tsx), [`MainEc2ResourceInfraUsedViewMetricsSummaryComponent.tsx`](components/aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-ec2-graficos-mainec2resourceinfrausedviewmetricssummarycomponent-tsx), [`ec2ResourceInfraUsedTableColumns.tsx`](components/aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-ec2-table-ec2resourceinfrausedtablecolumns-tsx), [`InstanceEksInfrautilizadaComponent.tsx`](components/aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-eks-instanceeksinfrautilizadacomponent-tsx), [`MainEc2ResourceInfraUsedViewMetricsSummaryComponent.tsx`](components/aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-eks-graficos-mainec2resourceinfrausedviewmetricssummarycomponent-tsx), [`ec2ResourceInfraUsedTableColumns.tsx`](components/aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-eks-table-ec2resourceinfrausedtablecolumns-tsx)

---

<a id="interfaces-vista-instance-group-iginterfaces-ts"></a>
## `interfaces/vista-instance-group/iGInterfaces.ts`

**Tipos**

Exporta:

- interfaz `InstanceGroupsMetrics`
- interfaz `InstanceGroupsMetricData`
- interfaz `InstanceGroupsInstances`
- interfaz `InstanceGroupsInstancesData`
- interfaz `InstanceGroupsInstancesDataDisks`
- interfaz `InstanceGroupsInstancesDataNetworkInterfaces`
- interfaz `InstanceGroupInfo`
- interfaz `HistoryData`
- interfaz `Version`
- interfaz `VersionTargetSize`
- interfaz `StandbyPolicy`
- interfaz `DistributionPolicy`
- interfaz `Zone`
- interfaz `Status`
- interfaz `VersionTarget`
- interfaz `Stateful`
- interfaz `PerInstanceConfigs`
- interfaz `AllInstancesConfig`
- interfaz `UpdatePolicy`
- interfaz `PolicyLimit`
- interfaz `InstanceLifecyclePolicy`
- interfaz `CurrentActions`
- interfaz `InstanceGroupsBilling`

Interfaz `InstanceGroupsMetrics` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `avg_value` | `number` | no | — |
| `metric_name` | `string` | no | — |
| `metric_data` | `InstanceGroupsMetricData[]` | no | — |

Interfaz `InstanceGroupsMetricData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `timestamp` | `string` | no | — |
| `metric_value` | `number` | no | — |

Interfaz `InstanceGroupsInstances` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource_name` | `string` | no | — |
| `resource_id` | `string` | no | — |
| `instance_data` | `InstanceGroupsInstancesData[]` | no | — |

Interfaz `InstanceGroupsInstancesData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `status` | `string` | no | — |
| `location` | `string` | no | — |
| `disks` | `InstanceGroupsInstancesDataDisks[]` | no | — |
| `cpuPlatform` | `string` | no | — |
| `networkInterfaces` | `InstanceGroupsInstancesDataNetworkInterfaces[]` | no | — |
| `machineType` | `string` | no | — |
| `sync_time` | `string` | no | — |
| `creationTimestamp` | `string` | no | — |

Interfaz `InstanceGroupsInstancesDataDisks` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `interface` | `string` | no | — |
| `deviceName` | `string` | no | — |
| `licenses` | `string[]` | no | — |
| `boot` | `boolean` | no | — |
| `mode` | `string` | no | — |
| `diskSizeGb` | `string` | no | — |
| `type` | `string` | no | — |
| `source` | `string` | no | — |
| `guestOsFeatures` | `[{type: string;}]` | no | — |
| `architecture` | `string` | no | — |
| `index` | `number` | no | — |
| `autoDelete` | `boolean` | no | — |
| `shieldedInstanceInitialState` | `{ [key: string]: [ { content: string; fileType: string; } ] }` | no | — |

Interfaz `InstanceGroupsInstancesDataNetworkInterfaces` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `stackType` | `string` | no | — |
| `accessConfigs` | `[ { networkTier: string; type: string; name: string; natIP: string; }…` | no | — |
| `subnetwork` | `string` | no | — |
| `fingerprint` | `string` | no | — |
| `networkIP` | `string` | no | — |
| `network` | `string` | no | — |
| `name` | `string` | no | — |

Interfaz `InstanceGroupInfo` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `history_data` | `HistoryData[]` | no | — |
| `instance_group_name` | `string` | no | — |
| `instance_group_id` | `string` | no | — |

Interfaz `HistoryData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `versions` | `Version[]` | no | — |
| `standbyPolicy` | `StandbyPolicy` | no | — |
| `description` | `string` | no | — |
| `fingerprint` | `string` | no | — |
| `baseInstanceName` | `string` | no | — |
| `instanceTemplate` | `string` | no | — |
| `distributionPolicy` | `DistributionPolicy` | no | — |
| `status` | `Status` | no | — |
| `region` | `string` | no | — |
| `selfLink` | `string` | no | — |
| `listManagedInstancesResults` | `string` | no | — |
| `id` | `string` | no | — |
| `instanceGroup` | `string` | no | — |
| `targetSize` | `number` | no | — |
| `satisfiesPzs` | `boolean` | no | — |
| `updatePolicy` | `UpdatePolicy` | no | — |
| `satisfiesPzi` | `boolean` | no | — |
| `creationTimestamp` | `string` | no | — |
| `targetSuspendedSize` | `number` | no | — |
| `instanceLifecyclePolicy` | `InstanceLifecyclePolicy` | no | — |
| `name` | `string` | no | — |
| `targetStoppedSize` | `number` | no | — |
| `currentActions` | `CurrentActions` | no | — |
| `location` | `string` | no | — |
| `project_id` | `string` | no | — |
| `source_name` | `string` | no | — |
| `sync_time` | `string` | no | — |

Interfaz `Version` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instanceTemplate` | `string` | no | — |
| `targetSize` | `VersionTargetSize` | no | — |

Interfaz `VersionTargetSize` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `calculated` | `number` | no | — |

Interfaz `StandbyPolicy` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `initialDelaySec` | `number` | no | — |
| `mode` | `string` | no | — |

Interfaz `DistributionPolicy` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `targetShape` | `string` | no | — |
| `zones` | `Zone[]` | no | — |

Interfaz `Zone` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `zone` | `string` | no | — |

Interfaz `Status` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `autoscaler` | `string` | no | — |
| `isStable` | `boolean` | no | — |
| `versionTarget` | `VersionTarget` | no | — |
| `stateful` | `Stateful` | no | — |
| `allInstancesConfig` | `AllInstancesConfig` | no | — |

Interfaz `VersionTarget` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `isReached` | `boolean` | no | — |

Interfaz `Stateful` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `hasStatefulConfig` | `boolean` | no | — |
| `perInstanceConfigs` | `PerInstanceConfigs` | no | — |

Interfaz `PerInstanceConfigs` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `allEffective` | `boolean` | no | — |

Interfaz `AllInstancesConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `effective` | `boolean` | no | — |

Interfaz `UpdatePolicy` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `replacementMethod` | `string` | no | — |
| `minimalAction` | `string` | no | — |
| `maxUnavailable` | `PolicyLimit` | no | — |
| `type` | `string` | no | — |
| `instanceRedistributionType` | `string` | no | — |
| `maxSurge` | `PolicyLimit` | no | — |

Interfaz `PolicyLimit` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `fixed` | `number` | no | — |
| `calculated` | `number` | no | — |

Interfaz `InstanceLifecyclePolicy` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `forceUpdateOnRepair` | `string` | no | — |
| `defaultActionOnFailure` | `string` | no | — |

Interfaz `CurrentActions` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `refreshing` | `number` | no | — |
| `deleting` | `number` | no | — |
| `creatingWithoutRetries` | `number` | no | — |
| `starting` | `number` | no | — |
| `none` | `number` | no | — |
| `recreating` | `number` | no | — |
| `verifying` | `number` | no | — |
| `resuming` | `number` | no | — |
| `suspending` | `number` | no | — |
| `creating` | `number` | no | — |
| `stopping` | `number` | no | — |
| `abandoning` | `number` | no | — |
| `restarting` | `number` | no | — |

Interfaz `InstanceGroupsBilling` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cost_gross_clp` | `number` | no | — |
| `cost_gross_usd` | `number` | no | — |
| `cost_net_clp` | `number` | no | — |
| `cost_net_usd` | `number` | no | — |
| `discount_clp` | `number` | no | — |
| `discount_usd` | `number` | no | — |
| `sync_time` | `string` | no | — |
| `usage_start_time` | `string` | no | — |
| `sku` | `string` | no | — |
| `resource` | `string` | no | — |

- Usado por: [`InstanceGroupsComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-instancegroupscomponent-tsx), [`InstanceGroupChartComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-grafico-instancegroupchartcomponent-tsx), [`InstanceGroupsHistoricInfoComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-info-instancegroupshistoricinfocomponent-tsx), [`InstanceGroupsInfoComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-info-instancegroupsinfocomponent-tsx), [`InstanceGroupsMetricsCardsComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-info-instancegroupsmetricscardscomponent-tsx), [`InstanceGroupBillingColumns.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-table-instancegroupbillingcolumns-tsx), [`InstanceGroupsBillingComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-table-instancegroupsbillingcomponent-tsx), [`InstanceGroupsBillingTableComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-table-instancegroupsbillingtablecomponent-tsx)

---

<a id="interfaces-vista-intracloud-billing-intracloudbillinginterfaces-ts"></a>
## `interfaces/vista-intracloud/billing/intraCloudBillingInterfaces.ts`

**Tipos**

Exporta:

- interfaz `IntraCloudBilling`
- interfaz `IntraCloudBillingData`
- interfaz `IntraCloudBillingByDimension`
- interfaz `IntraCloudBillingByDimensionData`
- interfaz `IntraCloudMonthlyBillingData`
- interfaz `IntraCloudMonthlyBilling`

Interfaz `IntraCloudBilling` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `tenant_id` | `string` | no | — |
| `tenant_alias` | `string` | no | — |
| `billing_data` | `IntraCloudBillingData[]` | no | — |

Interfaz `IntraCloudBillingData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `start_date` | `string` | no | — |
| `service` | `string` | no | — |
| `cost_in_usd_sum` | `number` | no | — |
| `payg_cost_in_usd_sum` | `number` | no | — |

Interfaz `IntraCloudBillingByDimension` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `tenant_id` | `string` | no | — |
| `tenant_alias` | `string` | no | — |
| `billing_data` | `IntraCloudBillingByDimensionData[]` | no | — |

Interfaz `IntraCloudBillingByDimensionData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_id` | `string` | no | — |
| `cost_in_usd_sum` | `number` | no | — |
| `payg_cost_in_usd_sum` | `number` | no | — |
| `[ key: \| 'product' \| 'consumed_service' \| 'resource_location' \| 'resource_group' \| 'meter_category' \| 'meter_sub_category' \| 'meter_name' \| 'unit_of_measure' \| 'pricing_model' \| 'charge_type' \| 'billing_profile_name' \| 'customer_name' \| 'cost_center' \| 'service' \| 'linked_account' \| 'region' \| 'az' \| 'usage_type' \| 'operation' \| 'instance_type' \| 'instance_type_family' \| 'platform' \| 'operating_system' \| 'tenancy' \| 'database_engine' \| 'cache_engine' \| 'deployment_option' \| 'purchase_type' \| 'record_type' \| 'billing_entity' \| 'legal_entity_name' \| 'invoicing_entity' \| 'savings_plans_type' \| 'savings_plan_arn' \| 'reservation_id' ]: string;` | `string` | no | — |

Interfaz `IntraCloudMonthlyBillingData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cost_in_usd` | `number` | no | — |
| `payg_cost_in_usd` | `number` | no | — |
| `year` | `number` | no | — |
| `month` | `string` | no | — |
| `monthly_associated_amount` | `number` | no | — |
| `actual_monthly_amount` | `number` | no | — |
| `monthly_forecast_amount` | `number` | no | — |

Interfaz `IntraCloudMonthlyBilling` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `tenant_id` | `string` | no | — |
| `tenant_alias` | `string` | no | — |
| `billing_data` | `IntraCloudMonthlyBillingData[]` | no | — |

- Usado por: [`IntraCloudBillingComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-billing-intracloudbillingcomponent-tsx), [`IntraCloudBillingCostUsdChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-billing-grafico-intracloudbillingcostusdchartcomponent-tsx), [`IntraCloudBillingCardsComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-billing-info-intracloudbillingcardscomponent-tsx), [`IntraCloudBillingColumns.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-billing-table-intracloudbillingcolumns-tsx), [`IntraCloudBillingTable.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-billing-table-intracloudbillingtable-tsx), [`IntraCloudMontlhyBillingTable.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-billing-table-intracloudmontlhybillingtable-tsx), [`exportExcelBillingIntracloud.ts`](lib.md#lib-exportexcelbillingintracloud-ts)

---

<a id="interfaces-vista-intracloud-compute-intracloudcomputeinterfaces-ts"></a>
## `interfaces/vista-intracloud/compute/intraCloudComputeInterfaces.ts`

**Tipos**

Exporta:

- interfaz `IntraCloudCompute`
- interfaz `IntraCloudComputeData`
- interfaz `IntraCloudComputeMetricsSummary`
- interfaz `IntraCloudComputeBilling`
- interfaz `IntraCloudComputeBillingData`
- interfaz `IntraCloudComputeBillingMostExpensive`
- interfaz `IntraCloudComputeBillingLeastExpensive`

Interfaz `IntraCloudCompute` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `tenant_id` | `string` | no | — |
| `compute_data` | `IntraCloudComputeData[]` | no | — |
| `metrics_summary` | `IntraCloudComputeMetricsSummary[]` | no | — |
| `total_analyzed_count` | `number` | no | — |

Interfaz `IntraCloudComputeData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `avg_value` | `number` | no | — |
| `timestamp` | `string` | no | — |
| `metric_name` | `string` | no | — |

Interfaz `IntraCloudComputeMetricsSummary` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `avg_value` | `number` | no | — |
| `metric_name` | `string` | no | — |
| `metric_count` | `number` | no | — |

Interfaz `IntraCloudComputeBilling` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `tenant_id` | `string` | no | — |
| `billing_data` | `IntraCloudComputeBillingData[]` | no | — |
| `most_expensive` | `IntraCloudComputeBillingMostExpensive` | no | — |
| `least_expensive` | `IntraCloudComputeBillingLeastExpensive` | no | — |

Interfaz `IntraCloudComputeBillingData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cost_in_usd` | `number` | no | — |
| `payg_cost_in_usd` | `number` | no | — |
| `[ key: \| 'product' \| 'consumed_service' \| 'resource_location' \| 'resource_group' \| 'meter_category' \| 'meter_sub_category' \| 'meter_name' \| 'unit_of_measure' \| 'pricing_model' \| 'charge_type' \| 'billing_profile_name' \| 'customer_name' \| 'cost_center' \| 'service' \| 'linked_account' \| 'region' \| 'az' \| 'usage_type' \| 'operation' \| 'instance_type' \| 'instance_type_family' \| 'platform' \| 'operating_system' \| 'tenancy' \| 'database_engine' \| 'cache_engine' \| 'deployment_option' \| 'purchase_type' \| 'record_type' \| 'billing_entity' \| 'legal_entity_name' \| 'invoicing_entity' \| 'savings_plans_type' \| 'savings_plan_arn' \| 'reservation_id' \| 'service_description' \| 'sku_description' ]: string;` | `string` | no | — |

Interfaz `IntraCloudComputeBillingMostExpensive` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `total_cost` | `number` | no | — |
| `[ key: \| 'product' \| 'consumed_service' \| 'resource_location' \| 'resource_group' \| 'meter_category' \| 'meter_sub_category' \| 'meter_name' \| 'unit_of_measure' \| 'pricing_model' \| 'charge_type' \| 'billing_profile_name' \| 'customer_name' \| 'cost_center' \| 'service' \| 'linked_account' \| 'region' \| 'az' \| 'usage_type' \| 'operation' \| 'instance_type' \| 'instance_type_family' \| 'platform' \| 'operating_system' \| 'tenancy' \| 'database_engine' \| 'cache_engine' \| 'deployment_option' \| 'purchase_type' \| 'record_type' \| 'billing_entity' \| 'legal_entity_name' \| 'invoicing_entity' \| 'savings_plans_type' \| 'savings_plan_arn' \| 'reservation_id' \| 'service_description' \| 'sku_description' ]: string;` | `string` | no | — |
| `resource` | `string` | no | — |
| `resource_global_name` | `string` | sí | — |

Interfaz `IntraCloudComputeBillingLeastExpensive` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `total_cost` | `number` | no | — |
| `[ key: \| 'product' \| 'consumed_service' \| 'resource_location' \| 'resource_group' \| 'meter_category' \| 'meter_sub_category' \| 'meter_name' \| 'unit_of_measure' \| 'pricing_model' \| 'charge_type' \| 'billing_profile_name' \| 'customer_name' \| 'cost_center' \| 'service' \| 'linked_account' \| 'region' \| 'az' \| 'usage_type' \| 'operation' \| 'instance_type' \| 'instance_type_family' \| 'platform' \| 'operating_system' \| 'tenancy' \| 'database_engine' \| 'cache_engine' \| 'deployment_option' \| 'purchase_type' \| 'record_type' \| 'billing_entity' \| 'legal_entity_name' \| 'invoicing_entity' \| 'savings_plans_type' \| 'savings_plan_arn' \| 'reservation_id' \| 'service_description' \| 'sku_description' ]: string;` | `string` | no | — |
| `resource` | `string` | no | — |
| `resource_global_name` | `string` | sí | — |

- Usado por: [`IntraCloudComputeCardsByTenantComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-compute-info-intracloudcomputecardsbytenantcomponent-tsx), [`IntraCloudServicesBillingColumns.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-services-billing-table-intracloudservicesbillingcolumns-tsx), [`IntraCloudServicesBillingTable.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-services-billing-table-intracloudservicesbillingtable-tsx)

---

<a id="interfaces-vista-intracloud-storage-intraclouddisksinterfaces-ts"></a>
## `interfaces/vista-intracloud/storage/intraCloudDisksInterfaces.ts`

**Tipos**

Exporta:

- interfaz `IntraCloudDisks`
- interfaz `IntraCloudDisksMetrics`
- interfaz `IntraCloudDisksMetricsSummary`

Interfaz `IntraCloudDisks` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `tenant_id` | `string` | no | — |
| `disks_data` | `IntraCloudDisksMetrics[]` | no | — |
| `metrics_summary` | `IntraCloudDisksMetricsSummary[]` | no | — |
| `total_analyzed_count` | `number` | no | — |
| `resources_count` | `number` | no | — |

Interfaz `IntraCloudDisksMetrics` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `value` | `number` | no | — |
| `timestamp` | `string` | no | — |
| `metric_name` | `string` | no | — |
| `service_type` | `string` | sí | — |

Interfaz `IntraCloudDisksMetricsSummary` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `value` | `number` | no | — |
| `metric_name` | `string` | no | — |
| `service_type` | `string` | sí | — |

- Usado por: [`IntraCloudAwsStorageChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-aws-grafico-intracloudawsstoragechartcomponent-tsx), [`IntraCloudAzureStorageChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-azure-grafico-intracloudazurestoragechartcomponent-tsx), [`IntraCloudAzureStorageCardsByTenantComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-azure-info-intracloudazurestoragecardsbytenantcomponent-tsx), [`IntraCloudGcpStorageChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-gcp-grafico-intracloudgcpstoragechartcomponent-tsx)

---

<a id="interfaces-vista-intracloud-storage-intracloudstorageinterfaces-ts"></a>
## `interfaces/vista-intracloud/storage/intraCloudStorageInterfaces.ts`

**Tipos**

Exporta:

- interfaz `IntraCloudStorage`
- interfaz `IntraCloudStorageData`
- interfaz `IntraCloudStorageMetrics`
- interfaz `IntraCloudStorageMetricsSummary`
- interfaz `IntraCloudStorageBilling`
- interfaz `IntraCloudStorageBillingData`
- interfaz `IntraCloudStorageBillingMostExpensive`
- interfaz `IntraCloudStorageBillingLeastExpensive`

Interfaz `IntraCloudStorage` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `tenant_id` | `string` | no | — |
| `storage_data` | `IntraCloudStorageData \| IntraCloudStorageMetrics[]` | no | — |
| `metrics_summary` | `IntraCloudStorageMetricsSummary[]` | no | — |
| `total_analyzed_count` | `number` | no | — |
| `resources_count` | `number` | no | — |

Interfaz `IntraCloudStorageData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `[ key: \| 'Storage_Account' \| 'Blob_Service' \| 'File_Service' \| 'Queue_Service' \| 'Table_Service' ]: IntraCloudStorageMetrics[];` | `IntraCloudStorageMetrics[]` | no | — |

Interfaz `IntraCloudStorageMetrics` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `value` | `number` | no | — |
| `timestamp` | `string` | no | — |
| `metric_name` | `string` | no | — |
| `service_type` | `string` | sí | — |

Interfaz `IntraCloudStorageMetricsSummary` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `value` | `number` | no | — |
| `metric_name` | `string` | no | — |
| `service_type` | `string` | sí | — |

Interfaz `IntraCloudStorageBilling` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `tenant_id` | `string` | no | — |
| `billing_data` | `IntraCloudStorageBillingData[]` | no | — |
| `most_expensive` | `IntraCloudStorageBillingMostExpensive` | no | — |
| `least_expensive` | `IntraCloudStorageBillingLeastExpensive` | no | — |

Interfaz `IntraCloudStorageBillingData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cost_in_usd` | `number` | no | — |
| `payg_cost_in_usd` | `number` | no | — |
| `[ key: \| 'product' \| 'consumed_service' \| 'resource_location' \| 'resource_group' \| 'meter_category' \| 'meter_sub_category' \| 'meter_name' \| 'unit_of_measure' \| 'pricing_model' \| 'charge_type' \| 'billing_profile_name' \| 'customer_name' \| 'cost_center' \| 'service' \| 'linked_account' \| 'region' \| 'az' \| 'usage_type' \| 'operation' \| 'instance_type' \| 'instance_type_family' \| 'platform' \| 'operating_system' \| 'tenancy' \| 'database_engine' \| 'cache_engine' \| 'deployment_option' \| 'purchase_type' \| 'record_type' \| 'billing_entity' \| 'legal_entity_name' \| 'invoicing_entity' \| 'savings_plans_type' \| 'savings_plan_arn' \| 'reservation_id' ]: string;` | `string` | no | — |

Interfaz `IntraCloudStorageBillingMostExpensive` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `total_cost` | `number` | no | — |
| `[ key: \| 'product' \| 'consumed_service' \| 'resource_location' \| 'resource_group' \| 'meter_category' \| 'meter_sub_category' \| 'meter_name' \| 'unit_of_measure' \| 'pricing_model' \| 'charge_type' \| 'billing_profile_name' \| 'customer_name' \| 'cost_center' \| 'service' \| 'linked_account' \| 'region' \| 'az' \| 'usage_type' \| 'operation' \| 'instance_type' \| 'instance_type_family' \| 'platform' \| 'operating_system' \| 'tenancy' \| 'database_engine' \| 'cache_engine' \| 'deployment_option' \| 'purchase_type' \| 'record_type' \| 'billing_entity' \| 'legal_entity_name' \| 'invoicing_entity' \| 'savings_plans_type' \| 'savings_plan_arn' \| 'reservation_id' ]: string;` | `string` | no | — |
| `resource` | `string` | no | — |

Interfaz `IntraCloudStorageBillingLeastExpensive` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `total_cost` | `number` | no | — |
| `[ key: \| 'product' \| 'consumed_service' \| 'resource_location' \| 'resource_group' \| 'meter_category' \| 'meter_sub_category' \| 'meter_name' \| 'unit_of_measure' \| 'pricing_model' \| 'charge_type' \| 'billing_profile_name' \| 'customer_name' \| 'cost_center' \| 'service' \| 'linked_account' \| 'region' \| 'az' \| 'usage_type' \| 'operation' \| 'instance_type' \| 'instance_type_family' \| 'platform' \| 'operating_system' \| 'tenancy' \| 'database_engine' \| 'cache_engine' \| 'deployment_option' \| 'purchase_type' \| 'record_type' \| 'billing_entity' \| 'legal_entity_name' \| 'invoicing_entity' \| 'savings_plans_type' \| 'savings_plan_arn' \| 'reservation_id' ]: string;` | `string` | no | — |
| `resource` | `string` | no | — |

- Usado por: [`IntraCloudServicesBillingColumns.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-services-billing-table-intracloudservicesbillingcolumns-tsx), [`IntraCloudServicesBillingTable.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-services-billing-table-intracloudservicesbillingtable-tsx), [`IntraCloudAwsStorageChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-aws-grafico-intracloudawsstoragechartcomponent-tsx), [`IntraCloudAwsStorageCardsByTenantComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-aws-info-intracloudawsstoragecardsbytenantcomponent-tsx), [`IntraCloudAzureStorageChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-azure-grafico-intracloudazurestoragechartcomponent-tsx), [`IntraCloudAzureStorageCardsByTenantComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-azure-info-intracloudazurestoragecardsbytenantcomponent-tsx), [`IntraCloudGcpStorageChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-gcp-grafico-intracloudgcpstoragechartcomponent-tsx), [`IntraCloudGcpStorageCardsByTenantComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-gcp-info-intracloudgcpstoragecardsbytenantcomponent-tsx)

---

<a id="interfaces-vista-promedio-por-localizacion-avgbylocationinterfaces-ts"></a>
## `interfaces/vista-promedio-por-localizacion/avgByLocationInterfaces.ts`

**Tipos**

Exporta:

- interfaz `AverageByLocation`
- interfaz `AverageByLocationData`

Interfaz `AverageByLocation` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `averages` | `AverageByLocationData[]` | no | — |
| `location` | `string` | no | — |

Interfaz `AverageByLocationData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `count` | `number` | no | — |
| `first_ts` | `string` | no | — |
| `last_ts` | `string` | no | — |
| `avg_value` | `number` | no | — |
| `max_value` | `number` | sí | — |
| `min_value` | `number` | sí | — |
| `metric_name` | `string` | no | — |
| `resource_count` | `number` | no | — |
| `resources` | `string[]` | no | — |

- Usado por: [`AverageByLocationComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-average-by-location-averagebylocationcomponent-tsx), [`AverageByLocationMetricsComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-average-by-location-grafico-averagebylocationmetricscomponent-tsx), [`AverageByLocationCardsComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-average-by-location-info-averagebylocationcardscomponent-tsx)

---

<a id="interfaces-vista-recommender-gcprecommenderinterfaces-ts"></a>
## `interfaces/vista-recommender/gcpRecommenderInterfaces.ts`

**Tipos**

Exporta:

- interfaz `RecommenderGcp`

Interfaz `RecommenderGcp` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `project_id` | `string` | no | — |
| `location` | `string` | no | — |
| `recommender_name` | `string` | no | — |
| `category` | `string` | no | — |
| `savings_estimate` | `{ currency?: string; amount?: number; }` | no | — |
| `description` | `string` | no | — |
| `recommender_subtype` | `string` | no | — |
| `priority` | `string` | no | — |
| `last_refresh_time` | `string` | no | — |

- Usado por: [`RecommenderComponent.tsx`](components/gcp/vista-recommender.md#components-gcp-vista-recommender-recommendercomponent-tsx), [`RecommenderPieChartComponent.tsx`](components/gcp/vista-recommender.md#components-gcp-vista-recommender-grafico-recommenderpiechartcomponent-tsx), [`RecommenderInfoComponent.tsx`](components/gcp/vista-recommender.md#components-gcp-vista-recommender-info-recommenderinfocomponent-tsx)

---

<a id="interfaces-vista-spot-vs-regular-vm-spotvsregularvminterfaces-ts"></a>
## `interfaces/vista-spot-vs-regular-vm/spotVsRegularVmInterfaces.ts`

**Tipos**

Exporta:

- interfaz `SpotVsRegularVm`
- interfaz `SpotVsRegularVmInstances`

Interfaz `SpotVsRegularVm` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `string` | no | — |
| `total_spot` | `number` | no | — |
| `total_instancias` | `number` | no | — |
| `instancias` | `SpotVsRegularVmInstances[]` | no | — |

Interfaz `SpotVsRegularVmInstances` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `vm_name` | `string` | no | — |
| `priority` | `string` | no | — |
| `location` | `string` | no | — |

- Usado por: [`SpotVsVmComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-spot-vs-vm-spotvsvmcomponent-tsx), [`SpotVsVmChartComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-spot-vs-vm-grafico-spotvsvmchartcomponent-tsx), [`SpotVsRegularVmComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-spot-vs-regular-vm-spotvsregularvmcomponent-tsx), [`SpotVsRegularVmTimelineComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-spot-vs-regular-vm-grafico-spotvsregularvmtimelinecomponent-tsx), [`SpotVsRegularVmCardsComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-spot-vs-regular-vm-info-spotvsregularvmcardscomponent-tsx), [`SpotVsRegularVmColumns.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-spot-vs-regular-vm-table-spotvsregularvmcolumns-tsx), [`SpotVsRegularVmTable.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-spot-vs-regular-vm-table-spotvsregularvmtable-tsx)

---

<a id="interfaces-vista-top-s3-buckets-tops3bucketsinterfaces-ts"></a>
## `interfaces/vista-top-s3-buckets/topS3BucketsInterfaces.ts`

**Tipos**

Exporta:

- interfaz `S3MetricItem`
- interfaz `S3VersioningItem`
- interfaz `S3VersioningRow`
- interfaz `S3VersioningChangeRow`
- interfaz `S3LifecycleTransition`
- interfaz `S3LifecycleItem`
- interfaz `S3LifecycleRow`
- interfaz `S3LifecycleHistoryRow`

Interfaz `S3MetricItem` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource` | `string` | no | — |
| `metric` | `string` | no | — |
| `storage_type` | `string \| null` | no | — |
| `metric_value` | `number` | no | — |
| `sync_time` | `string` | no | — |
| `timestamp` | `string` | sí | — |

Interfaz `S3VersioningItem` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource` | `string` | no | — |
| `status` | `string \| null` | no | — |
| `mfa_delete` | `string \| null` | no | — |
| `region` | `string \| null` | no | — |
| `sync_time` | `string` | no | — |

Interfaz `S3VersioningRow` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `status_label` | `string` | no | — |
| `mfa_delete_label` | `string` | no | — |

Interfaz `S3VersioningChangeRow` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource` | `string` | no | — |
| `sync_time` | `string` | no | — |
| `sync_time_label` | `string` | no | — |
| `previous_state` | `string` | no | — |
| `current_state` | `string` | no | — |

Interfaz `S3LifecycleTransition` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `days` | `number \| null` | sí | — |
| `noncurrent_days` | `number \| null` | sí | — |
| `storage_class` | `string \| null` | no | — |

Interfaz `S3LifecycleItem` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource` | `string` | no | — |
| `rule_id` | `string` | no | — |
| `status` | `string \| null` | no | — |
| `region` | `string \| null` | no | — |
| `prefix` | `string \| null` | no | — |
| `expiration_days` | `number \| null` | no | — |
| `expired_object_delete_marker` | `boolean \| null` | no | — |
| `noncurrent_expiration_days` | `number \| null` | no | — |
| `abort_multipart_days` | `number \| null` | no | — |
| `transitions` | `S3LifecycleTransition[]` | no | — |
| `noncurrent_transitions` | `S3LifecycleTransition[]` | no | — |
| `sync_time` | `string` | no | — |

Interfaz `S3LifecycleRow` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `status_label` | `string` | no | — |
| `prefix_label` | `string` | no | — |
| `transitions_label` | `string` | no | — |
| `noncurrent_transitions_label` | `string` | no | — |
| `expiration_label` | `string` | no | — |
| `noncurrent_expiration_label` | `string` | no | — |
| `abort_multipart_label` | `string` | no | — |

Interfaz `S3LifecycleHistoryRow` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `string` | no | — |
| `sync_time_label` | `string` | no | — |
| `buckets` | `number` | no | — |
| `rules` | `number` | no | — |
| `enabled` | `number` | no | — |

- Usado por: [`TopS3BucketsComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-top-s3-buckets-tops3bucketscomponent-tsx), [`S3StorageTypeChart.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-top-s3-buckets-grafico-s3storagetypechart-tsx), [`S3LifecycleColumns.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-top-s3-buckets-table-s3lifecyclecolumns-tsx), [`S3LifecycleTableComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-top-s3-buckets-table-s3lifecycletablecomponent-tsx), [`S3VersioningColumns.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-top-s3-buckets-table-s3versioningcolumns-tsx), [`S3VersioningTableComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-top-s3-buckets-table-s3versioningtablecomponent-tsx)

---

<a id="interfaces-vista-traffic-manager-trafficmanageravgqueriesreturnedinterfaces-ts"></a>
## `interfaces/vista-traffic-manager/trafficManagerAvgQueriesReturnedInterfaces.ts`

**Tipos**

Exporta:

- interfaz `TmAvgQueriesReturnedApiResponse`

Interfaz `TmAvgQueriesReturnedApiResponse` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `string` | no | — |
| `tm_id` | `string` | no | — |
| `tm_name` | `string` | no | — |
| `location` | `string` | no | — |
| `avg_queries_returned` | `number` | no | — |

- Usado por: [`RecursosTrafficManagerComponent.tsx`](components/azure/vista-recursos-tm.md#components-azure-vista-recursos-tm-recursostrafficmanagercomponent-tsx)

---

<a id="interfaces-vista-traffic-manager-trafficmanagerinterfaces-ts"></a>
## `interfaces/vista-traffic-manager/trafficManagerInterfaces.ts`

**Tipos**

Exporta:

- interfaz `TrafficManagerDataApiResponse`
- interfaz `TrafficManagerDataHistory`
- interfaz `TrafficManagetDataEndpoints`

Interfaz `TrafficManagerDataApiResponse` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `tm_id` | `string` | no | — |
| `tm_name` | `string` | no | — |
| `location` | `string` | no | — |
| `subscription_id` | `string` | no | — |
| `resource_group` | `string` | no | — |
| `history` | `TrafficManagerDataHistory[]` | no | — |

Interfaz `TrafficManagerDataHistory` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string` | no | — |
| `name` | `string` | no | — |
| `type` | `string` | no | — |
| `tags` | `{ [key: string]: string; }` | no | — |
| `location` | `string` | no | — |
| `profile_status` | `string` | no | — |
| `traffic_routing_method` | `string` | no | — |
| `dns_config` | `{ relative_name: string; fqdn: string; ttl: number; }` | no | — |
| `monitor_config` | `{ profile_monitor_status?: string; protocol?: string; port?: number; …` | no | — |
| `endpoints` | `TrafficManagetDataEndpoints[]` | no | — |
| `traffic_view_enrollment_status` | `string` | no | — |
| `max_return` | `0` | no | — |
| `_cq_sync_time` | `string` | no | — |
| `_cq_source_name` | `string` | no | — |
| `resource_group` | `string` | no | — |
| `namespace` | `string` | no | — |
| `children` | `string` | no | — |
| `resource_parent` | `string` | no | — |
| `resource_namespace` | `string` | no | — |
| `resource_type` | `string` | no | — |
| `resource_name` | `string` | no | — |
| `subscription_id` | `string` | no | — |
| `avg_queries_returned` | `number \| null` | sí | — |

Interfaz `TrafficManagetDataEndpoints` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string` | sí | — |
| `name` | `string` | sí | — |
| `type` | `string` | sí | — |
| `target_resource_id` | `string` | sí | — |
| `target` | `string` | sí | — |
| `endpoint_status` | `string` | sí | — |
| `weight` | `number` | sí | — |
| `priority` | `number` | sí | — |
| `endpoint_location` | `string` | sí | — |
| `endpoint_monitor_status` | `string` | sí | — |
| `always_serve` | `string` | sí | — |

- Usado por: [`RecursosTrafficManagerComponent.tsx`](components/azure/vista-recursos-tm.md#components-azure-vista-recursos-tm-recursostrafficmanagercomponent-tsx), [`RecursosTrafficManagerCardsComponent.tsx`](components/azure/vista-recursos-tm.md#components-azure-vista-recursos-tm-info-recursostrafficmanagercardscomponent-tsx), [`RecursosTrafficManagerModalComponent.tsx`](components/azure/vista-recursos-tm.md#components-azure-vista-recursos-tm-info-recursostrafficmanagermodalcomponent-tsx), [`RecursosTrafficManagerColumns.tsx`](components/azure/vista-recursos-tm.md#components-azure-vista-recursos-tm-table-recursostrafficmanagercolumns-tsx), [`RecursosTrafficManagerTable.tsx`](components/azure/vista-recursos-tm.md#components-azure-vista-recursos-tm-table-recursostrafficmanagertable-tsx)

---

<a id="interfaces-vista-variacion-storage-variationstorageinterfaces-ts"></a>
## `interfaces/vista-variacion-storage/variationStorageInterfaces.ts`

**Tipos**

Exporta:

- interfaz `StorageVariation`
- interfaz `StorageVariationData`
- interfaz `StorageVariationRanges`
- interfaz `StorageVariationsRangesMetrics`

Interfaz `StorageVariation` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `storage_account` | `StorageVariationData` | no | — |
| `blob_service` | `StorageVariationData` | no | — |
| `table_service` | `StorageVariationData` | no | — |
| `queue_service` | `StorageVariationData` | no | — |
| `file_service` | `StorageVariationData` | no | — |

Interfaz `StorageVariationData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource` | `string` | no | — |
| `metric` | `string` | no | — |
| `location` | `string` | no | — |
| `actual_range` | `StorageVariationRanges` | no | — |
| `prev_range` | `StorageVariationRanges` | no | — |
| `variation` | `number` | no | — |
| `variation_percent` | `number` | no | — |

Interfaz `StorageVariationRanges` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metrics` | `StorageVariationsRangesMetrics[]` | no | — |
| `average` | `number` | no | — |
| `month` | `string` | no | — |
| `year` | `number` | no | — |

Interfaz `StorageVariationsRangesMetrics` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource` | `string` | no | — |
| `region` | `string` | no | — |
| `metric` | `string` | no | — |
| `metric_value` | `number` | no | — |
| `metric_timestamp` | `string` | no | — |

- Usado por: [`StorageVariationComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-variacion-storage-storagevariationcomponent-tsx), [`StorageVariationCapacitiesComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-variacion-storage-graficos-storagevariationcapacitiescomponent-tsx), [`StorageVariationCardsComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-variacion-storage-info-storagevariationcardscomponent-tsx)

---

<a id="interfaces-vista-variacion-tendencia-uso-de-recursos-variaciontendenciausoderecursosviewinterface-ts"></a>
## `interfaces/vista-variacion-tendencia-uso-de-recursos/variacionTendenciaUsoDeRecursosViewInterface.ts`

**Tipos**

Exporta:

- interfaz `MetricPoint`
- interfaz `RangeBlock`
- interfaz `ResourceMetrics`

Interfaz `MetricPoint` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource` | `string` | no | — |
| `region` | `string` | no | — |
| `metric` | `string` | no | — |
| `metric_value` | `number` | no | — |
| `metric_timestamp` | `string` | no | — |

Interfaz `RangeBlock` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metrics` | `MetricPoint[]` | no | — |
| `average` | `number` | no | — |
| `month` | `string` | no | — |
| `year` | `number` | no | — |

Interfaz `ResourceMetrics` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource` | `string` | no | — |
| `metric` | `string` | no | — |
| `actual_range` | `RangeBlock` | no | — |
| `prev_range` | `RangeBlock` | no | — |
| `variation` | `number` | no | — |
| `variation_percent` | `number` | no | — |
| `region` | `string` | no | — |

- Usado por: [`VariacionTendenciaUsoDeRecursosComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-variaciontendenciausoderecursoscomponent-tsx), [`TrendLineChartv2.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-grafico-trendlinechartv2-tsx), [`VariacionTendenciaUsoDeRecursosCardsComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-info-variaciontendenciausoderecursoscardscomponent-tsx)

---

<a id="interfaces-workinghours-ts"></a>
## `interfaces/workingHours.ts`

**Tipos**

Exporta:

- tipo `WorkingHoursCloud` = `'aws' | 'azure' | 'gcp'` — Contrato canónico de la familia "Horario hábil vs no hábil" (espejo de `utils/working_hours_schemas.py`, idéntico en cloudperformance-api-aws, -azure y -gcp). Rutas: /api/{cloud}/working-hours/{recurso}/{usage|summary|resources} El horario hábil se calcula en America/Santiago (lunes a viernes, 08:00-18:00). Los `timestamp` de `usage` vienen en ISO 8601 con el desfase de Santiago ("2026-09-12T21:00:00-03:00"); `sync_time` en ISO 8601 UTC. Vacío siempre `[]`.
- tipo `ScheduleType` = `'business_hours' | 'non_business_hours'`
- tipo `WorkingHoursAction` = `'usage' | 'summary' | 'resources'`
- interfaz `WorkingHoursPoint` — Un punto por hora y métrica, clasificado en hábil / no hábil.
- interfaz `WorkingHoursSummaryItem` — Promedio, máximo y mínimo de una métrica en un horario.
- interfaz `WorkingHoursDominant` — Horario con el mayor promedio para una métrica del recurso (`null` si empatan o no hay datos).
- interfaz `WorkingHoursResource`

Interfaz `WorkingHoursPoint` (exportada) — Un punto por hora y métrica, clasificado en hábil / no hábil.:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `timestamp` | `string` | no | — |
| `metric` | `string` | no | — |
| `schedule_type` | `ScheduleType` | no | — |
| `value` | `number \| null` | no | — |

Interfaz `WorkingHoursSummaryItem` (exportada) — Promedio, máximo y mínimo de una métrica en un horario.:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric` | `string` | no | — |
| `schedule_type` | `ScheduleType` | no | — |
| `avg_value` | `number \| null` | no | — |
| `max_value` | `number \| null` | no | — |
| `min_value` | `number \| null` | no | — |

Interfaz `WorkingHoursDominant` (exportada) — Horario con el mayor promedio para una métrica del recurso (`null` si empatan o no hay datos).:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric` | `string` | no | — |
| `schedule_type` | `ScheduleType \| null` | no | — |
| `avg_value` | `number \| null` | no | — |

Interfaz `WorkingHoursResource` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource_id` | `string` | no | — |
| `resource_name` | `string` | no | — |
| `region` | `string \| null` | no | — |
| `sync_time` | `string \| null` | no | — |
| `metrics` | `WorkingHoursSummaryItem[]` | no | — |
| `dominant_schedule` | `WorkingHoursDominant[]` | no | — |

- Usado por: [`WorkingHoursCards.tsx`](components/shared.md#components-shared-working-hours-workinghourscards-tsx), [`WorkingHoursCharts.tsx`](components/shared.md#components-shared-working-hours-workinghourscharts-tsx), [`WorkingHoursDetailModal.tsx`](components/shared.md#components-shared-working-hours-workinghoursdetailmodal-tsx), [`WorkingHoursTable.tsx`](components/shared.md#components-shared-working-hours-workinghourstable-tsx), [`WorkingHoursView.tsx`](components/shared.md#components-shared-working-hours-workinghoursview-tsx), [`types.ts`](components/shared.md#components-shared-working-hours-types-ts), [`workingHoursConfigs.ts`](components/shared.md#components-shared-working-hours-workinghoursconfigs-ts), [`workingHours.ts`](lib.md#lib-workinghours-ts)

---

<a id="types-db-ts"></a>
## `types/db.ts`

**Tipos**

Exporta:

- tipo `UserRole` = `'admin_global' | 'admin_empresa' | 'usuario'`
- interfaz `CloudAccount`
- interfaz `Empresa` — INVARIANTE de los campos `<cloud>_accounts` (Empresas y Users): - Sólo existen cuando `is_<cloud>` e `is_<cloud>_multi_tenant` son `true`. - Si la nube NO es multi-tenant, el campo no existe y la conexión se resuelve por `user_db_<cloud>`. Ver `lib/cloudAccounts.ts`.
- interfaz `User` — Los campos de nube de un usuario son SIEMPRE un espejo de los de su empresa (`client`). Se copian al crear el usuario y se re-propagan al editar la licencia; nunca se editan por usuario.
- interfaz `AuthUserPayload`
- interfaz `ClientConnector`

Interfaz `CloudAccount` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string` | no | ID con formato `clp-<id>`. Lo genera el servidor y se propaga a Users. |
| `alias` | `string` | no | — |
| `db` | `string` | no | — |

Interfaz `Empresa` (exportada) — INVARIANTE de los campos `<cloud>_accounts` (Empresas y Users): - Sólo existen cuando `is_<cloud>` e `is_<cloud>_multi_tenant` son `true`. - Si la nube NO es multi-tenant, el campo no existe y la conexión se resuelve por `user_db_<cloud>`. Ver `lib/cloudAccounts.ts`.:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_id` | `ObjectId` | no | — |
| `name` | `string` | no | — |
| `planName` | `string` | no | — |
| `userLimit` | `number` | no | — |
| `currentUsers` | `number` | no | — |
| `createdAt` | `Date` | sí | — |
| `updatedAt` | `Date` | sí | — |
| `is_aws` | `boolean` | no | AWS |
| `user_db_aws` | `string \| null` | no | — |
| `is_aws_multi_tenant` | `boolean` | no | — |
| `aws_accounts` | `CloudAccount[]` | sí | — |
| `is_azure` | `boolean` | no | AZURE |
| `user_db_azure` | `string \| null` | no | — |
| `is_azure_multi_tenant` | `boolean` | no | — |
| `azure_accounts` | `CloudAccount[]` | sí | — |
| `is_gcp` | `boolean` | no | GCP |
| `user_db_gcp` | `string \| null` | no | — |
| `is_gcp_multi_tenant` | `boolean` | no | — |
| `gcp_accounts` | `CloudAccount[]` | sí | — |
| `is_openai` | `boolean` | no | OPENAI |
| `user_db_openai` | `string \| null` | no | — |
| `is_openai_multi_tenant` | `boolean` | no | — |
| `openai_accounts` | `CloudAccount[]` | sí | — |

Interfaz `User` (exportada) — Los campos de nube de un usuario son SIEMPRE un espejo de los de su empresa (`client`). Se copian al crear el usuario y se re-propagan al editar la licencia; nunca se editan por usuario.:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_id` | `ObjectId` | no | — |
| `email` | `string` | no | — |
| `username` | `string` | no | — |
| `client` | `string` | no | — |
| `passwordHash` | `string` | no | — |
| `role` | `UserRole` | no | — |
| `planName` | `string \| null` | sí | — |
| `is_active` | `boolean` | sí | — |
| `createdAt` | `Date` | no | — |
| `updatedAt` | `Date` | no | — |
| `is_aws` | `boolean` | no | AWS |
| `user_db_aws` | `string \| null` | sí | — |
| `is_aws_multi_tenant` | `boolean` | no | — |
| `aws_accounts` | `CloudAccount[]` | sí | — |
| `is_azure` | `boolean` | no | AZURE |
| `user_db_azure` | `string \| null` | sí | — |
| `is_azure_multi_tenant` | `boolean` | no | — |
| `azure_accounts` | `CloudAccount[]` | sí | — |
| `is_gcp` | `boolean` | no | GCP |
| `user_db_gcp` | `string \| null` | sí | — |
| `is_gcp_multi_tenant` | `boolean` | no | — |
| `gcp_accounts` | `CloudAccount[]` | sí | — |
| `is_openai` | `boolean` | no | OPENAI |
| `user_db_openai` | `string \| null` | sí | — |
| `is_openai_multi_tenant` | `boolean` | no | — |
| `openai_accounts` | `CloudAccount[]` | sí | — |
| `recoveryToken` | `string` | sí | — |
| `recoveryTokenExpires` | `Date` | sí | — |
| `connectors` | `unknown[]` | sí | — |
| `active_client` | `string` | sí | Sólo en `/api/auth/me`: empresa activa del token (un admin_global puede estar viendo otra empresa). |

Interfaz `AuthUserPayload` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `userId` | `string` | no | — |
| `email` | `string` | no | — |
| `username` | `string` | no | — |
| `client` | `string` | no | — |
| `role` | `UserRole` | no | — |
| `planName` | `string` | no | — |
| `user_db_aws` | `string \| null` | no | AWS |
| `is_aws` | `boolean` | no | — |
| `is_aws_multi_tenant` | `boolean` | sí | — |
| `aws_accounts` | `CloudAccount[]` | sí | — |
| `user_db_azure` | `string \| null` | no | AZURE |
| `is_azure` | `boolean` | no | — |
| `is_azure_multi_tenant` | `boolean` | sí | — |
| `azure_accounts` | `CloudAccount[]` | sí | — |
| `user_db_gcp` | `string \| null` | no | GCP |
| `is_gcp` | `boolean` | no | — |
| `is_gcp_multi_tenant` | `boolean` | sí | — |
| `gcp_accounts` | `CloudAccount[]` | sí | — |
| `user_db_openai` | `string \| null` | sí | OPENAI |
| `is_openai` | `boolean` | sí | — |
| `is_openai_multi_tenant` | `boolean` | sí | — |
| `openai_accounts` | `CloudAccount[]` | sí | — |

Interfaz `ClientConnector` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `created_by` | `{ username: string; email: string; client: string; role: UserRole; }` | no | — |
| `connector_type` | `string` | no | — |
| `config` | `{ [key: string]: string; }` | no | — |
| `encrypted_credentials` | `{ ciphertext: string; encrypted_data_key?: string; encryption_version…` | no | — |
| `status` | `string` | no | — |
| `created_at` | `Date` | no | — |
| `updated_at` | `Date` | no | — |
| `last_validated_at` | `Date` | no | — |

- Usado por: [`route.ts`](api-bridges.md#app-api-auth-forgot-password-route-ts), [`route.ts`](api-bridges.md#app-api-auth-get-token-route-ts), [`route.ts`](api-bridges.md#app-api-auth-me-route-ts), [`route.ts`](api-bridges.md#app-api-auth-reset-password-route-ts), [`route.ts`](api-bridges.md#app-api-auth-swap-client-context-route-ts), [`route.ts`](api-bridges.md#app-api-auth-validate-reset-token-route-ts), [`route.ts`](api-bridges.md#app-api-auth-verify-2fa-route-ts), [`route.ts`](api-bridges.md#app-api-perfilamiento-empresas-id-route-ts), [`route.ts`](api-bridges.md#app-api-perfilamiento-empresas-route-ts), [`route.ts`](api-bridges.md#app-api-perfilamiento-users-id-route-ts), [`route.ts`](api-bridges.md#app-api-perfilamiento-users-route-ts), [`InterCloudConfigComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intercloud-intercloudconfigcomponent-tsx), [`InterCloudSelectionComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intercloud-intercloudselectioncomponent-tsx), [`IntraCloudConfigComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx), [`IntraCloudSelectionComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-intracloudselectioncomponent-tsx), [`ClientContext.tsx`](components/context.md#components-context-clientcontext-tsx), [`CloudAccountsEditor.tsx`](components/perfilamiento.md#components-perfilamiento-cloudaccountseditor-tsx), [`CreateUserForm.tsx`](components/perfilamiento.md#components-perfilamiento-createuserform-tsx), [`EditLicenseModal.tsx`](components/perfilamiento.md#components-perfilamiento-editlicensemodal-tsx), [`EditUserModal.tsx`](components/perfilamiento.md#components-perfilamiento-editusermodal-tsx), [`UserTable.tsx`](components/perfilamiento.md#components-perfilamiento-usertable-tsx), [`useConnectors.ts`](hooks.md#hooks-useconnectors-ts), [`useFeatureAccess.ts`](hooks.md#hooks-usefeatureaccess-ts), [`useSession.ts`](hooks.md#hooks-usesession-ts), [`authUtils.ts`](lib.md#lib-authutils-ts), [`cloudAccounts.ts`](lib.md#lib-cloudaccounts-ts), [`connectors.ts`](lib.md#lib-connectors-ts), [`db-utils.ts`](lib.md#lib-db-utils-ts), [`sessionPayload.ts`](lib.md#lib-sessionpayload-ts), [`index.ts`](#types-index-ts)

---

<a id="types-index-ts"></a>
## `types/index.ts`

**Tipos**

Exporta:

- interfaz `UserDoc`
- interfaz `SessionDoc`
- interfaz `TwoFactorCodeDoc`
- interfaz `JWTPayload`

Interfaz `UserDoc` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_id` | `string` | no | — |
| `email` | `string` | no | — |
| `username` | `string` | no | — |
| `client` | `string` | no | — |
| `role` | `UserRole` | no | — |
| `user_db` | `string` | no | — |
| `passwordHash` | `string` | no | — |
| `createdAt` | `Date` | no | — |
| `updatedAt` | `Date` | no | — |

Interfaz `SessionDoc` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_id` | `string` | no | — |
| `userId` | `string` | no | — |
| `userAgent` | `string` | sí | — |
| `ip` | `string` | sí | — |
| `createdAt` | `Date` | no | — |
| `expiresAt` | `Date` | no | — |

Interfaz `TwoFactorCodeDoc` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_id` | `string` | no | — |
| `userId` | `string` | no | — |
| `code` | `string` | no | — |
| `purpose` | `'login'` | no | — |
| `createdAt` | `Date` | no | — |
| `expiresAt` | `Date` | no | — |

Interfaz `JWTPayload` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `[key: string]: unknown;` | `unknown` | no | — |
| `sub` | `string` | no | — |
| `username` | `string` | no | — |
| `client` | `string` | no | — |
| `role` | `UserRole` | no | — |
| `is_aws` | `boolean` | no | AWS |
| `user_db_aws` | `string \| null` | no | — |
| `is_azure` | `boolean` | no | Azure |
| `user_db_azure` | `string \| null` | no | — |
| `is_gcp` | `boolean` | no | GCP |
| `user_db_gcp` | `string \| null` | no | — |
| `is_openai` | `boolean` | sí | OpenAI |
| `user_db_openai` | `string \| null` | sí | — |
| `is_aws_multi_tenant` | `boolean` | sí | — |
| `is_azure_multi_tenant` | `boolean` | sí | — |
| `is_gcp_multi_tenant` | `boolean` | sí | — |
| `is_openai_multi_tenant` | `boolean` | sí | — |

- Usa: [`db.ts`](#types-db-ts)
- Usado por: [`route.ts`](api-bridges.md#app-api-auth-swap-client-context-route-ts), [`auth.ts`](lib.md#lib-auth-ts), [`sessionPayload.ts`](lib.md#lib-sessionpayload-ts)

