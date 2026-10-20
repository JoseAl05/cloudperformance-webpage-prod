# Componentes `components/general_aws/`

[← Índice](../README.md)

Filtros de AWS (regiones, instancias, ASG, EKS, métricas, Advisor, Bedrock, …) y el loader.

Archivos:

- [`components/general_aws/LoaderComponent.tsx`](#components-general-aws-loadercomponent-tsx)
- [`components/general_aws/filters/AdvisorCategoriesFilterComponent.tsx`](#components-general-aws-filters-advisorcategoriesfiltercomponent-tsx)
- [`components/general_aws/filters/AdvisorStatusFilterComponent.tsx`](#components-general-aws-filters-advisorstatusfiltercomponent-tsx)
- [`components/general_aws/filters/AsgFilterComponent.tsx`](#components-general-aws-filters-asgfiltercomponent-tsx)
- [`components/general_aws/filters/AsgInstancesFilterComponent.tsx`](#components-general-aws-filters-asginstancesfiltercomponent-tsx)
- [`components/general_aws/filters/BedrockModelsFilterComponent.tsx`](#components-general-aws-filters-bedrockmodelsfiltercomponent-tsx)
- [`components/general_aws/filters/Ec2AutoscalingGroupsFilterComponent.tsx`](#components-general-aws-filters-ec2autoscalinggroupsfiltercomponent-tsx)
- [`components/general_aws/filters/Ec2MetricLabelFilterComponent.tsx`](#components-general-aws-filters-ec2metriclabelfiltercomponent-tsx)
- [`components/general_aws/filters/EksAsgFilterComponent.tsx`](#components-general-aws-filters-eksasgfiltercomponent-tsx)
- [`components/general_aws/filters/EksAsgInstancesFilterComponent.tsx`](#components-general-aws-filters-eksasginstancesfiltercomponent-tsx)
- [`components/general_aws/filters/EksFilterComponent.tsx`](#components-general-aws-filters-eksfiltercomponent-tsx)
- [`components/general_aws/filters/EventsTypeFilterComponent.tsx`](#components-general-aws-filters-eventstypefiltercomponent-tsx)
- [`components/general_aws/filters/FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx)
- [`components/general_aws/filters/InstancesFilterComponent.tsx`](#components-general-aws-filters-instancesfiltercomponent-tsx)
- [`components/general_aws/filters/LoadbalancersV2FilterComponent.tsx`](#components-general-aws-filters-loadbalancersv2filtercomponent-tsx)
- [`components/general_aws/filters/MetricsFilterComponent.tsx`](#components-general-aws-filters-metricsfiltercomponent-tsx)
- [`components/general_aws/filters/MetricsRDSFilterComponent.tsx`](#components-general-aws-filters-metricsrdsfiltercomponent-tsx)
- [`components/general_aws/filters/NatGatewaysFilterComponent.tsx`](#components-general-aws-filters-natgatewaysfiltercomponent-tsx)
- [`components/general_aws/filters/RegionFilterComponent.tsx`](#components-general-aws-filters-regionfiltercomponent-tsx)
- [`components/general_aws/filters/S3FilterComponent.tsx`](#components-general-aws-filters-s3filtercomponent-tsx)
- [`components/general_aws/filters/ServiceFilterComponent.tsx`](#components-general-aws-filters-servicefiltercomponent-tsx)
- [`components/general_aws/filters/TagsFilterComponent.tsx`](#components-general-aws-filters-tagsfiltercomponent-tsx)
- [`components/general_aws/filters/TagsFilterComponent_Aws.tsx`](#components-general-aws-filters-tagsfiltercomponent-aws-tsx)
- [`components/general_aws/filters/UnusedLoadbalancersV2FilterComponent.tsx`](#components-general-aws-filters-unusedloadbalancersv2filtercomponent-tsx)
- [`components/general_aws/filters/UnusedNatGatewaysFilterComponent.tsx`](#components-general-aws-filters-unusednatgatewaysfiltercomponent-tsx)
- [`components/general_aws/filters/UnusedRoute53FilterComponent.tsx`](#components-general-aws-filters-unusedroute53filtercomponent-tsx)
- [`components/general_aws/filters/VariationMetricFilterComponent.tsx`](#components-general-aws-filters-variationmetricfiltercomponent-tsx)
- [`components/general_aws/filters/VariationResourcesFilterComponent.tsx`](#components-general-aws-filters-variationresourcesfiltercomponent-tsx)
- [`components/general_aws/filters/VariationServiceFilterComponent.tsx`](#components-general-aws-filters-variationservicefiltercomponent-tsx)

<a id="components-general-aws-loadercomponent-tsx"></a>
## `components/general_aws/LoaderComponent.tsx`

**Componente**

Exporta:

- componente `LoaderComponent` `({ size = 'large' }: LoaderComponentProps)`

Interfaz `LoaderComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `size` | `'small' \| 'large'` | no | — |

- Usado por: [`AiFinopsMetricsComponent.tsx`](ai-finops-metrics.md#components-ai-finops-metrics-aifinopsmetricscomponent-tsx), [`AiRecommendationStatusesComponent.tsx`](ai-recommendation-statuses.md#components-ai-recommendation-statuses-airecommendationstatusescomponent-tsx), [`SelectAlertsCloud.tsx`](alertas.md#components-alertas-selectalertscloud-tsx), [`COCustomModelsComponent.tsx`](amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-custom-models-cocustommodelscomponent-tsx), [`COFoundationComponent.tsx`](amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-foundation-models-cofoundationcomponent-tsx), [`COInferenceProfilesComponent.tsx`](amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-inference-profiles-coinferenceprofilescomponent-tsx), [`AdvisorViewComponent.tsx`](aws/vista-advisor.md#components-aws-vista-advisor-advisorviewcomponent-tsx), [`InstanceEc2CpuMetricsComponent.tsx`](aws/vista-ec2.md#components-aws-vista-ec2-instancias-ec2-instanceec2cpumetricscomponent-tsx), [`EventsViewComponent.tsx`](aws/vista-eventos.md#components-aws-vista-eventos-eventsviewcomponent-tsx), [`TopS3BucketsComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-s3-buckets-tops3bucketscomponent-tsx), [`UnusedElbV2InsightModal.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-elbv2-info-unusedelbv2insightmodal-tsx), [`UnusedNatGatewaysInsightModal.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-nat-gateways-info-unusednatgatewaysinsightmodal-tsx), [`HeatmapQuotasComponent.tsx`](aws/vista-heatmap-quotas.md#components-aws-vista-heatmap-quotas-heatmapquotascomponent-tsx), [`AVGUsoLocInstEC2ChartComponent.tsx`](aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-ec2-avgusolocinstec2chartcomponent-tsx), [`AVGUsoLocInstRdsMariaDBChartComponent.tsx`](aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mariadb-avgusolocinstrdsmariadbchartcomponent-tsx), [`AVGUsoLocInstRdsMySQLChartComponent.tsx`](aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mysql-avgusolocinstrdsmysqlchartcomponent-tsx), [`AVGUsoLocInstRdsOracleChartComponent.tsx`](aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-oracle-avgusolocinstrdsoraclechartcomponent-tsx), [`AVGUsoLocInstRdsPgChartComponent.tsx`](aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-pg-avgusolocinstrdspgchartcomponent-tsx), [`AVGUsoLocInstRdsSQLServerChartComponent.tsx`](aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-sqlserver-avgusolocinstrdssqlserverchartcomponent-tsx), [`SavingPlansComponent.tsx`](aws/vista-saving-plan.md#components-aws-vista-saving-plan-savingplanscomponent-tsx), [`AdvisorViewComponent.tsx`](azure/vista-advisor.md#components-azure-vista-advisor-advisorviewcomponent-tsx), [`DeploymentsComponent.tsx`](azure/vista-deployments.md#components-azure-vista-deployments-deploymentscomponent-tsx), [`AverageByLocationComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-average-by-location-averagebylocationcomponent-tsx), [`BlobVsStorageGeneralComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-blob-vs-storage-general-blobvsstoragegeneralcomponent-tsx), [`SpotVsRegularVmComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-spot-vs-regular-vm-spotvsregularvmcomponent-tsx), [`StorageVariationComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-variacion-storage-storagevariationcomponent-tsx), [`HeatmapQuotasComponent.tsx`](azure/vista-heatmap-quotas.md#components-azure-vista-heatmap-quotas-heatmapquotascomponent-tsx), [`RecursosTrafficManagerComponent.tsx`](azure/vista-recursos-tm.md#components-azure-vista-recursos-tm-recursostrafficmanagercomponent-tsx), [`InterCloudSelectionComponent.tsx`](comp-cloud.md#components-comp-cloud-intercloud-intercloudselectioncomponent-tsx), [`IntraCloudSelectionComponent.tsx`](comp-cloud.md#components-comp-cloud-intracloud-intracloudselectioncomponent-tsx), [`IntraCloudBillingTable.tsx`](comp-cloud.md#components-comp-cloud-intracloud-billing-table-intracloudbillingtable-tsx), [`IntraCloudMontlhyBillingTable.tsx`](comp-cloud.md#components-comp-cloud-intracloud-billing-table-intracloudmontlhybillingtable-tsx), [`MultiCloudComponent.tsx`](comp-cloud.md#components-comp-cloud-multicloud-multicloudcomponent-tsx), [`HeatmapQuotasComponent.tsx`](gcp/vista-heatmap-quotas.md#components-gcp-vista-heatmap-quotas-heatmapquotascomponent-tsx), [`AdvisorCategoriesFilterComponent.tsx`](#components-general-aws-filters-advisorcategoriesfiltercomponent-tsx), [`AsgFilterComponent.tsx`](#components-general-aws-filters-asgfiltercomponent-tsx), [`AsgInstancesFilterComponent.tsx`](#components-general-aws-filters-asginstancesfiltercomponent-tsx), [`EksAsgFilterComponent.tsx`](#components-general-aws-filters-eksasgfiltercomponent-tsx), [`EksAsgInstancesFilterComponent.tsx`](#components-general-aws-filters-eksasginstancesfiltercomponent-tsx), [`EksFilterComponent.tsx`](#components-general-aws-filters-eksfiltercomponent-tsx), [`EventsTypeFilterComponent.tsx`](#components-general-aws-filters-eventstypefiltercomponent-tsx), [`InstancesFilterComponent.tsx`](#components-general-aws-filters-instancesfiltercomponent-tsx), [`MetricsFilterComponent.tsx`](#components-general-aws-filters-metricsfiltercomponent-tsx), [`MetricsRDSFilterComponent.tsx`](#components-general-aws-filters-metricsrdsfiltercomponent-tsx), [`NatGatewaysFilterComponent.tsx`](#components-general-aws-filters-natgatewaysfiltercomponent-tsx), [`ServiceFilterComponent.tsx`](#components-general-aws-filters-servicefiltercomponent-tsx), [`TagsFilterComponent.tsx`](#components-general-aws-filters-tagsfiltercomponent-tsx), [`TagsFilterComponent_Aws.tsx`](#components-general-aws-filters-tagsfiltercomponent-aws-tsx), [`UnusedNatGatewaysFilterComponent.tsx`](#components-general-aws-filters-unusednatgatewaysfiltercomponent-tsx), [`VariationMetricFilterComponent.tsx`](#components-general-aws-filters-variationmetricfiltercomponent-tsx), [`VariationResourcesFilterComponent.tsx`](#components-general-aws-filters-variationresourcesfiltercomponent-tsx), [`ResourcesFilterComponent.tsx`](general_gcp.md#components-general-gcp-filters-resourcesfiltercomponent-tsx), [`SesionGate.tsx`](general_presupuesto.md#components-general-presupuesto-session-sesiongate-tsx), [`GcpVertexComparisonComponent.tsx`](google-vertex.md#components-google-vertex-comparacion-gcpvertexcomparisoncomponent-tsx), [`COGcpVertexComponent.tsx`](google-vertex.md#components-google-vertex-costo-optimizacion-vertex-models-cogcpvertexcomponent-tsx), [`COAzureFoundryComponent.tsx`](microsoft-foundry.md#components-microsoft-foundry-costo-optimizacion-foundation-models-coazurefoundrycomponent-tsx), [`COOpenAIComponent.tsx`](open-ia.md#components-open-ia-costo-optimizacion-foundation-models-coopenaicomponent-tsx), [`MainProfileComponent.tsx`](profile.md#components-profile-mainprofilecomponent-tsx), [`SelectAIServiceComponent.tsx`](profile.md#components-profile-selectaiservicecomponent-tsx), [`SelectCloudComponent.tsx`](profile.md#components-profile-selectcloudcomponent-tsx), [`DataStateComponent.tsx`](shared.md#components-shared-datastatecomponent-tsx), [`BillingHistoryTable.tsx`](shared.md#components-shared-billing-billinghistorytable-tsx), [`BillingTrendView.tsx`](shared.md#components-shared-billing-billingtrendview-tsx), [`TopBillingView.tsx`](shared.md#components-shared-billing-topbillingview-tsx)

---

<a id="components-general-aws-filters-advisorcategoriesfiltercomponent-tsx"></a>
## `components/general_aws/filters/AdvisorCategoriesFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AdvisorCategoriesFilterComponent` `({ advisorCategory, setAdvisorCategory, startDate, endDate, region, isAdvisorCategoryMultiselect }: AdvisorCategoriesFilterComponentProps)`

Interfaz `AdvisorCategoriesFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `advisorCategory` | `string` | no | — |
| `setAdvisorCategory` | `Dispatch<SetStateAction<string>>` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `isAdvisorCategoryMultiselect` | `boolean` | no | — |

Internos:

- función `toCapitalCase` `(s: string)`

- API: `/api/aws/bridge/advisor/all_categories`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-aws-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](general_presupuesto.md#components-general-presupuesto-filters-filterscomponent-tsx)

---

<a id="components-general-aws-filters-advisorstatusfiltercomponent-tsx"></a>
## `components/general_aws/filters/AdvisorStatusFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AdvisorStatusFilterComponent` `({ advisorStatus, advisorCategory, setAdvisorStatus, isAdvisorStatusMultiselect }: AdvisorStatusFilterComponentProps)`

Interfaz `AdvisorStatusFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `advisorStatus` | `string` | no | — |
| `advisorCategory` | `string` | no | — |
| `setAdvisorStatus` | `Dispatch<SetStateAction<string>>` | no | — |
| `isAdvisorStatusMultiselect` | `boolean` | no | — |

Internos:

- constante `ADVISOR_STATUSES`

- Usa: [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](general_presupuesto.md#components-general-presupuesto-filters-filterscomponent-tsx)

---

<a id="components-general-aws-filters-asgfiltercomponent-tsx"></a>
## `components/general_aws/filters/AsgFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AsgFilterComponent` `({ asg, asgInstance, setAsg, setAsgInstance, startDate, endDate, region, selectedKey, selectedValue, isAsgMultiSelect, isAsgInstanceMultiselect, isInstancesSer…`

Interfaz `AsgFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `asg` | `string` | no | — |
| `asgInstance` | `string` | no | — |
| `setAsg` | `Dispatch<SetStateAction<string>>` | no | — |
| `setAsgInstance` | `Dispatch<SetStateAction<string>>` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `selectedKey` | `string` | no | — |
| `selectedValue` | `string` | no | — |
| `isAsgMultiSelect` | `boolean` | no | — |
| `isAsgInstanceMultiselect` | `boolean` | no | — |
| `isInstancesService` | `string` | sí | — |
| `isViewResource` | `boolean` | sí | — |

Internos:

- función `fetcherPost` `(url: string, tags: { Key: string; Value: string } | null = null)`

- API: `/api/aws/bridge/autoscaling/all-autoscaling-groups`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`AsgInstancesFilterComponent.tsx`](#components-general-aws-filters-asginstancesfiltercomponent-tsx), [`LoaderComponent.tsx`](#components-general-aws-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](general_presupuesto.md#components-general-presupuesto-filters-filterscomponent-tsx)

Notas de implementación:

- JSX — Instancias de ASG (solo si hay ASG disponible y seleccionado)

---

<a id="components-general-aws-filters-asginstancesfiltercomponent-tsx"></a>
## `components/general_aws/filters/AsgInstancesFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AsgInstancesFilterComponent` `({ asg, asgInstance, setAsgInstance, startDate, endDate, region, isInstanceMultiSelect, isInstancesService }: AsgInstancesFilterComponentProps)`

Interfaz `AsgInstancesFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `asg` | `string` | no | — |
| `asgInstance` | `string` | no | — |
| `setAsgInstance` | `Dispatch<SetStateAction<string>>` | no | — |
| `region` | `string` | no | — |
| `startDate` | `string` | no | — |
| `endDate` | `string` | no | — |
| `isInstanceMultiSelect` | `boolean` | no | — |
| `isInstancesService` | `string` | sí | — |

- API: `/api/aws/bridge/autoscaling/all-asg-instances-ec2`, `/api/aws/bridge/aws/ec2/unused/autoscaling/getInstances`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-aws-loadercomponent-tsx)
- Usado por: [`AsgFilterComponent.tsx`](#components-general-aws-filters-asgfiltercomponent-tsx)

Notas de implementación:

- /api/aws/ec2/unused/autoscaling/getInstances?date_from=2025-08-01T00:00:00&date_to=2025-09-02T23:59:59&autoscaling_group=AutoscalingWeb,awseb-e-2heftjv3ym-stack-AWSEBAutoScalingGroup-132MCA73CRXKS

---

<a id="components-general-aws-filters-bedrockmodelsfiltercomponent-tsx"></a>
## `components/general_aws/filters/BedrockModelsFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `BedrockModelsFilterComponent` `({ bedrockModel, setBedrockModel }: BedrockModelsFilterComponentProps)`

Interfaz `BedrockModelsFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `bedrockModel` | `string` | no | — |
| `setBedrockModel` | `Dispatch<SetStateAction<string>>` | no | — |

Interfaz `BedrockModelProvider`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string` | no | — |
| `label` | `string` | no | — |
| `dotClassName` | `string` | no | — |
| `pattern` | `RegExp` | no | — |

Interfaz `BedrockModelOption`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string` | no | — |
| `name` | `string` | no | — |
| `provider` | `BedrockModelProvider` | no | — |

- Tipo interno `ApiBedrockModel` = `| { model_id_lowercase: string; model_name: string } | string`
Internos:

- constante `BEDROCK_MODEL_PROVIDERS`
- constante `OTHER_BEDROCK_MODEL_PROVIDER`
- función `resolveBedrockModelProvider` `(name: string)`

- API: `/api/aws/bridge/bedrock/prompt_optimization/all_chat_bedrock_models`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx)
- Usado por: [`BMPromptOptInputComponent.tsx`](amazon-bedrock.md#components-amazon-bedrock-prompt-opt-info-bmpromptoptinputcomponent-tsx), [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx)

---

<a id="components-general-aws-filters-ec2autoscalinggroupsfiltercomponent-tsx"></a>
## `components/general_aws/filters/Ec2AutoscalingGroupsFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AutoScalingGroupFilterComponent` `({ selectedGroup, setSelectedGroup, startDate, endDate, }: AutoScalingGroupFilterProps)`

Interfaz `AutoScalingGroupFilterProps` — Fetcher para SWR:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `selectedGroup` | `string` | no | — |
| `setSelectedGroup` | `Dispatch<SetStateAction<string>>` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |

- API: `/api/aws/bridge/aws/ec2/autoscaling/groups`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](general_presupuesto.md#components-general-presupuesto-filters-filterscomponent-tsx)

Notas de implementación:

- Llamada a la API de AutoScaling Groups (string[])

---

<a id="components-general-aws-filters-ec2metriclabelfiltercomponent-tsx"></a>
## `components/general_aws/filters/Ec2MetricLabelFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `EC2MetricFilterComponent` `({ selectedMetric, setSelectedMetric, startDate, endDate, }: EC2MetricFilterProps)`

Interfaz `EC2MetricFilterProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `selectedMetric` | `string` | no | — |
| `setSelectedMetric` | `Dispatch<SetStateAction<string>>` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |

- API: `/api/aws/bridge/aws/ec2/metrics/labels`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](general_presupuesto.md#components-general-presupuesto-filters-filterscomponent-tsx)

---

<a id="components-general-aws-filters-eksasgfiltercomponent-tsx"></a>
## `components/general_aws/filters/EksAsgFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `EksAsgFilterComponent` `({ eks, eksAsg, eksAsgInstance, setEksAsg, setEksAsgInstance, startDate, endDate, region, isEksAsgMultiselect, isEksAsgInstanceMultiselect, isInstancesService …`

Interfaz `EksAsgFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `eks` | `string` | no | — |
| `eksAsg` | `string` | no | — |
| `eksAsgInstance` | `string` | no | — |
| `setEksAsg` | `Dispatch<SetStateAction<string>>` | no | — |
| `setEksAsgInstance` | `Dispatch<SetStateAction<string>>` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `isEksAsgMultiselect` | `boolean` | no | — |
| `isEksAsgInstanceMultiselect` | `boolean` | no | — |
| `isInstancesService` | `string` | sí | — |

- API: `/api/aws/bridge/aws/eks/getAsgListbyClusterName`, `/api/aws/bridge/eks/all-eks-autoscaling-groups`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-aws-loadercomponent-tsx), [`EksAsgInstancesFilterComponent.tsx`](#components-general-aws-filters-eksasginstancesfiltercomponent-tsx)
- Usado por: [`EksFilterComponent.tsx`](#components-general-aws-filters-eksfiltercomponent-tsx)

Notas de implementación:

- Solo actuar cuando terminó la carga y no hubo error
- JSX — Instancias de ASG (solo si hay ASG disponible y seleccionado)

---

<a id="components-general-aws-filters-eksasginstancesfiltercomponent-tsx"></a>
## `components/general_aws/filters/EksAsgInstancesFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `EksAsgInstancesFilterComponent` `({ eksAsg, eksAsgInstance, setEksAsgInstance, startDate, endDate, region, isEksAsgInstanceMultiselect, isInstancesService }: EksAsgInstancesFilterComponentProp…`

Interfaz `EksAsgInstancesFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `eksAsg` | `string` | no | — |
| `eksAsgInstance` | `string` | no | — |
| `setEksAsgInstance` | `Dispatch<SetStateAction<string>>` | no | — |
| `region` | `string` | no | — |
| `startDate` | `string` | no | — |
| `endDate` | `string` | no | — |
| `isInstanceMultiselect` | `boolean` | no | — |
| `isEksAsgInstanceMultiselect` | `boolean` | no | — |
| `isInstancesService` | `string` | sí | — |

- API: `/api/aws/bridge/aws/ec2/unused/autoscaling/getInstances`, `/api/aws/bridge/eks/all-eks-asg-instances-ec2`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-aws-loadercomponent-tsx)
- Usado por: [`EksAsgFilterComponent.tsx`](#components-general-aws-filters-eksasgfiltercomponent-tsx)

---

<a id="components-general-aws-filters-eksfiltercomponent-tsx"></a>
## `components/general_aws/filters/EksFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `EksFilterComponent` `({ eks, eksAsg, eksAsgInstance, setEks, setEksAsg, setEksAsgInstance, startDate, endDate, region, selectedKey, selectedValue, isEksMultiSelect, isEksAsgMultise…`

Interfaz `EksFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `eks` | `string` | no | — |
| `eksAsg` | `string` | no | — |
| `eksAsgInstance` | `string` | no | — |
| `setEks` | `Dispatch<SetStateAction<string>>` | no | — |
| `setEksAsg` | `Dispatch<SetStateAction<string>>` | no | — |
| `setEksAsgInstance` | `Dispatch<SetStateAction<string>>` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `selectedKey` | `string` | no | — |
| `selectedValue` | `string` | no | — |
| `isEksMultiSelect` | `boolean` | no | — |
| `isEksAsgMultiselect` | `boolean` | no | — |
| `isEksAsgInstanceMultiselect` | `boolean` | no | — |
| `isInstancesService` | `string` | sí | — |

Internos:

- función `fetcherPost` `(url: string, tags: { Key: string; Value: string } | null = null)`

- API: `/api/aws/bridge/aws/eks/getClusterEksList`, `/api/aws/bridge/eks/all-eks-clusters`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`LoaderComponent.tsx`](#components-general-aws-loadercomponent-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`command.tsx`](ui.md#components-ui-command-tsx), [`EksAsgFilterComponent.tsx`](#components-general-aws-filters-eksasgfiltercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](general_presupuesto.md#components-general-presupuesto-filters-filterscomponent-tsx)

Notas de implementación:

- Solo actuar cuando terminó la carga y no hubo error
- JSX — Instancias de ASG (solo si hay ASG disponible y seleccionado)

---

<a id="components-general-aws-filters-eventstypefiltercomponent-tsx"></a>
## `components/general_aws/filters/EventsTypeFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `EventsTypeFilterComponent` `({ eventType, setEventType, region, isEventTypeMultiselect }: EventsTypeFilterComponentProps)`

Interfaz `EventsTypeFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `eventType` | `string` | no | — |
| `setEventType` | `Dispatch<SetStateAction<string>>` | no | — |
| `region` | `string` | no | — |
| `isEventTypeMultiselect` | `boolean` | no | — |

- API: `/api/aws/bridge/eventos/all_events_types`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-aws-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](general_presupuesto.md#components-general-presupuesto-filters-filterscomponent-tsx)

---

<a id="components-general-aws-filters-filterscomponent-tsx"></a>
## `components/general_aws/filters/FiltersComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `FiltersComponent` `({ Component, dateFilter = true, regionFilter = false, isRegionMultiSelect = false, instancesFilter = false, instancesService, asgFilter = false, eksFilter = f…`

Interfaz `FiltersComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `Component` | `(params: { startDate: Date; endDate?: Date; instance: string; region:…` | no | — |
| `dateFilter` | `boolean` | sí | — |
| `regionFilter` | `boolean` | sí | — |
| `isRegionMultiSelect` | `boolean` | sí | — |
| `instancesFilter` | `boolean` | sí | — |
| `instancesService` | `string` | sí | — |
| `asgFilter` | `boolean` | sí | — |
| `eksFilter` | `boolean` | sí | — |
| `s3Filter` | `boolean` | sí | — |
| `eventsTypesFilter` | `boolean` | sí | — |
| `advisorCategoriesFilter` | `boolean` | sí | — |
| `advisorStatusFilter` | `boolean` | sí | — |
| `autoScalingGroupFilter` | `boolean` | sí | — |
| `metricFilter` | `boolean` | sí | — |
| `metricsFilter` | `boolean` | sí | — |
| `isMetricsMultiselect` | `boolean` | sí | — |
| `engine` | `string` | sí | — |
| `metricsRDSFilter` | `boolean` | sí | — |
| `isAdvisorCategoryMultiselect` | `boolean` | sí | — |
| `isAdvisorStatusMultiselect` | `boolean` | sí | — |
| `isEventsTypesMultiselect` | `boolean` | sí | — |
| `isAsgMultiSelect` | `boolean` | sí | — |
| `isEksMultiSelect` | `boolean` | sí | — |
| `isEksAsgMultiSelect` | `boolean` | sí | — |
| `isEksAsgInstanceMultiSelect` | `boolean` | sí | — |
| `isAsgInstanceMultiSelect` | `boolean` | sí | — |
| `isInstanceMultiSelect` | `boolean` | sí | — |
| `isViewUnused` | `boolean` | sí | — |
| `isViewResource` | `boolean` | sí | — |
| `tagsFilter` | `boolean` | sí | — |
| `serviceFilter` | `boolean` | sí | — |
| `resourceType` | `string \| null` | sí | — |
| `localService` | `string` | sí | — |
| `variationServiceFilter` | `boolean` | sí | — |
| `variationMetricFilter` | `boolean` | sí | — |
| `variationResourceFilter` | `boolean` | sí | — |
| `natGatewaysFilter` | `boolean` | sí | — |
| `isNatGatewaysMultiselect` | `boolean` | sí | — |
| `unusedNatGatewaysFilter` | `boolean` | sí | — |
| `isUnusedNatGatewaysMultiselect` | `boolean` | sí | — |
| `unusedElbV2Filter` | `boolean` | sí | — |
| `isUnusedElbV2Multiselect` | `boolean` | sí | — |
| `elbV2Filter` | `boolean` | sí | — |
| `isElbV2Multiselect` | `boolean` | sí | — |
| `unusedR53Filter` | `boolean` | sí | — |
| `isUnusedR53Multiselect` | `boolean` | sí | — |
| `bedrockModelFilter` | `boolean` | sí | — |
| `dbType` | `string` | sí | Motor RDS de la vista ('rds-mysql', 'rds-pg', ...); se reenvía tal cual a `Component`. |

- Hooks: `useRouter`, `useSearchParams`
- Usa: [`RegionFilterComponent.tsx`](#components-general-aws-filters-regionfiltercomponent-tsx), [`TagsFilterComponent.tsx`](#components-general-aws-filters-tagsfiltercomponent-tsx), [`ServiceFilterComponent.tsx`](#components-general-aws-filters-servicefiltercomponent-tsx), [`VariationServiceFilterComponent.tsx`](#components-general-aws-filters-variationservicefiltercomponent-tsx), [`BaseFiltersComponent.tsx`](shared.md#components-shared-filters-basefilterscomponent-tsx), [`filters.ts`](../lib.md#lib-filters-ts), [`InstancesFilterComponent.tsx`](#components-general-aws-filters-instancesfiltercomponent-tsx), [`AsgFilterComponent.tsx`](#components-general-aws-filters-asgfiltercomponent-tsx), [`EksFilterComponent.tsx`](#components-general-aws-filters-eksfiltercomponent-tsx), [`S3FilterComponent.tsx`](#components-general-aws-filters-s3filtercomponent-tsx), [`EventsTypeFilterComponent.tsx`](#components-general-aws-filters-eventstypefiltercomponent-tsx), [`AdvisorCategoriesFilterComponent.tsx`](#components-general-aws-filters-advisorcategoriesfiltercomponent-tsx), [`AdvisorStatusFilterComponent.tsx`](#components-general-aws-filters-advisorstatusfiltercomponent-tsx), [`VariationMetricFilterComponent.tsx`](#components-general-aws-filters-variationmetricfiltercomponent-tsx), [`Ec2MetricLabelFilterComponent.tsx`](#components-general-aws-filters-ec2metriclabelfiltercomponent-tsx), [`Ec2AutoscalingGroupsFilterComponent.tsx`](#components-general-aws-filters-ec2autoscalinggroupsfiltercomponent-tsx), [`MetricsFilterComponent.tsx`](#components-general-aws-filters-metricsfiltercomponent-tsx), [`MetricsRDSFilterComponent.tsx`](#components-general-aws-filters-metricsrdsfiltercomponent-tsx), [`VariationResourcesFilterComponent.tsx`](#components-general-aws-filters-variationresourcesfiltercomponent-tsx), [`UnusedNatGatewaysFilterComponent.tsx`](#components-general-aws-filters-unusednatgatewaysfiltercomponent-tsx), [`NatGatewaysFilterComponent.tsx`](#components-general-aws-filters-natgatewaysfiltercomponent-tsx), [`UnusedLoadbalancersV2FilterComponent.tsx`](#components-general-aws-filters-unusedloadbalancersv2filtercomponent-tsx), [`LoadbalancersV2FilterComponent.tsx`](#components-general-aws-filters-loadbalancersv2filtercomponent-tsx), [`UnusedRoute53FilterComponent.tsx`](#components-general-aws-filters-unusedroute53filtercomponent-tsx), [`BedrockModelsFilterComponent.tsx`](#components-general-aws-filters-bedrockmodelsfiltercomponent-tsx)
- Usado por: [`MainViewAiFinopsMetricsComponent.tsx`](ai-finops-metrics.md#components-ai-finops-metrics-mainviewaifinopsmetricscomponent-tsx), [`MainViewAiRecommendationStatusesComponent.tsx`](ai-recommendation-statuses.md#components-ai-recommendation-statuses-mainviewairecommendationstatusescomponent-tsx), [`MainViewBMComparisonComponent.tsx`](amazon-bedrock.md#components-amazon-bedrock-comparacion-mainviewbmcomparisoncomponent-tsx), [`MainViewCostOptimizationComponent.tsx`](amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-mainviewcostoptimizationcomponent-tsx), [`MainViewCOCustomModelsComponent.tsx`](amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-custom-models-mainviewcocustommodelscomponent-tsx), [`MainViewCOFoundationComponent.tsx`](amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-foundation-models-mainviewcofoundationcomponent-tsx), [`MainViewCOInferenceProfilesComponent.tsx`](amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-inference-profiles-mainviewcoinferenceprofilescomponent-tsx), [`MainViewAdvisorComponent.tsx`](aws/vista-advisor.md#components-aws-vista-advisor-mainviewadvisorcomponent-tsx), [`MainViewInstanciasAutoscalingGroupsComponent.tsx`](aws/vista-autoscaling.md#components-aws-vista-autoscaling-autoscaling-groups-mainviewinstanciasautoscalinggroupscomponent-tsx), [`MainViewConsumeEc2Component.tsx`](aws/vista-consumos.md#components-aws-vista-consumos-ec2-mainviewconsumeec2component-tsx), [`MainViewConsumeAsgComponent.tsx`](aws/vista-consumos.md#components-aws-vista-consumos-ec2-asg-mainviewconsumeasgcomponent-tsx), [`MainViewConsumeEksComponent.tsx`](aws/vista-consumos.md#components-aws-vista-consumos-ec2-eks-mainviewconsumeekscomponent-tsx), [`MainViewElbV2ConsumeComponent.tsx`](aws/vista-consumos.md#components-aws-vista-consumos-elbv2-mainviewelbv2consumecomponent-tsx), [`MainViewNatGatewaysConsumeComponent.tsx`](aws/vista-consumos.md#components-aws-vista-consumos-nat-gateways-mainviewnatgatewaysconsumecomponent-tsx), [`MainViewConsumeRdsComponent.tsx`](aws/vista-consumos.md#components-aws-vista-consumos-rds-mainviewconsumerdscomponent-tsx), [`MainViewInstancesEc2Component.tsx`](aws/vista-ec2.md#components-aws-vista-ec2-instancias-ec2-mainviewinstancesec2component-tsx), [`MainViewEventsComponent.tsx`](aws/vista-eventos.md#components-aws-vista-eventos-mainvieweventscomponent-tsx), [`MainViewTendenciaFacturacionComponent.tsx`](aws/vista-facturacion.md#components-aws-vista-facturacion-tendencia-facturacion-mainviewtendenciafacturacioncomponent-tsx), [`MainViewConsumoEC2AsgHorarioComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil-mainviewconsumoec2asghorariocomponent-tsx), [`MainViewConsumoEC2HorarioComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-horario-habil-vs-no-habil-mainviewconsumoec2horariocomponent-tsx), [`MainViewConsumoEC2NodosEKSHorarioComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-nodos-eks-horario-habil-vs-no-habil-mainviewconsumoec2nodosekshorariocomponent-tsx), [`MainViewConsumoRdsHorarioComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-rds-horario-habil-vs-no-habil-mainviewconsumordshorariocomponent-tsx), [`MainViewSpotVsVmComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-spot-vs-vm-mainviewspotvsvmcomponent-tsx), [`MainViewTopDolarFamiliaComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-por-famila-de-instancias-mainviewtopdolarfamiliacomponent-tsx), [`MainViewTopDolarRecursoComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-por-id-recurso-mainviewtopdolarrecursocomponent-tsx), [`MainViewTopDolarTipoCobroComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-cobro-mainviewtopdolartipocobrocomponent-tsx), [`MainViewTopDolarTipoCompraComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-compra-mainviewtopdolartipocompracomponent-tsx), [`TopDolarInstanciasComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-instancia-topdolarinstanciascomponent-tsx), [`TopDolarRegionComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-region-topdolarregioncomponent-tsx), [`TopDolarSOComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-so-topdolarsocomponent-tsx), [`MainViewTopS3BucketsComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-s3-buckets-mainviewtops3bucketscomponent-tsx), [`MainViewUnusedEbsComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-ebs-mainviewunusedebscomponent-tsx), [`MainViewUnusedAutoscalingComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-ec2-mainviewunusedautoscalingcomponent-tsx), [`MainViewUnusedEc2Component.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-ec2-mainviewunusedec2component-tsx), [`MainViewUnusedEksComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-ec2-mainviewunusedekscomponent-tsx), [`MainViewUnusedElbV2Component.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-elbv2-mainviewunusedelbv2component-tsx), [`MainViewUnusedNatGatewaysComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-nat-gateways-mainviewunusednatgatewayscomponent-tsx), [`MainViewUnusedRoute53Component.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-r53-mainviewunusedroute53component-tsx), [`MainViewVariacionTendenciaUsoDeRecursosComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-mainviewvariaciontendenciausoderecursoscomponent-tsx), [`MainViewHeatmapQuotasComponent.tsx`](aws/vista-heatmap-quotas.md#components-aws-vista-heatmap-quotas-mainviewheatmapquotascomponent-tsx), [`MainViewInstanciasAVGUsoLocInstEC2Component.tsx`](aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-ec2-mainviewinstanciasavgusolocinstec2component-tsx), [`MainViewInstanciasAVGUsoLocInstRdsMariaDBComponent.tsx`](aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mariadb-mainviewinstanciasavgusolocinstrdsmariadbcomponent-tsx), [`MainViewInstanciasAVGUsoLocInstRdsMySQLComponent.tsx`](aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mysql-mainviewinstanciasavgusolocinstrdsmysqlcomponent-tsx), [`MainViewInstanciasAVGUsoLocInstRdsOracleComponent.tsx`](aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-oracle-mainviewinstanciasavgusolocinstrdsoraclecomponent-tsx), [`MainViewInstanciasAVGUsoLocInstRdsPgComponent.tsx`](aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-pg-mainviewinstanciasavgusolocinstrdspgcomponent-tsx), [`MainViewInstanciasAVGUsoLocInstRdsSQLServerComponent.tsx`](aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-sqlserver-mainviewinstanciasavgusolocinstrdssqlservercomponent-tsx), [`MainViewInstanciasRdsMariaDBComponent.tsx`](aws/vista-rds.md#components-aws-vista-rds-instancias-rds-mariadb-mainviewinstanciasrdsmariadbcomponent-tsx), [`MainViewInstanciasRdsMySQLComponent.tsx`](aws/vista-rds.md#components-aws-vista-rds-instancias-rds-mysql-mainviewinstanciasrdsmysqlcomponent-tsx), [`MainViewInstanciasRdsOracleComponent.tsx`](aws/vista-rds.md#components-aws-vista-rds-instancias-rds-oracle-mainviewinstanciasrdsoraclecomponent-tsx), [`MainViewInstanciasRdsPgComponent.tsx`](aws/vista-rds.md#components-aws-vista-rds-instancias-rds-pg-mainviewinstanciasrdspgcomponent-tsx), [`MainViewInstanciasRdsSQLServerComponent.tsx`](aws/vista-rds.md#components-aws-vista-rds-instancias-rds-sqlserver-mainviewinstanciasrdssqlservercomponent-tsx), [`MainViewInfrautilizadasComponent.tsx`](aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-autoscaling-mainviewinfrautilizadascomponent-tsx), [`MainViewInfrautilizadasComponent.tsx`](aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-ec2-mainviewinfrautilizadascomponent-tsx), [`MainViewInfrautilizadasEksComponent.tsx`](aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-eks-mainviewinfrautilizadasekscomponent-tsx), [`MainViewSavingPlansComponent.tsx`](aws/vista-saving-plan.md#components-aws-vista-saving-plan-mainviewsavingplanscomponent-tsx), [`MainViewTaggedResourcesComponent.tsx`](aws/vista-tags.md#components-aws-vista-tags-mainviewtaggedresourcescomponent-tsx)

Notas de implementación:

- _FiltersComponentProps_: Filtros comunes a las 3 nubes (F-06).
- `const [tagsData, setTagsData] = useState<unknown[]>([]);` — Se mantiene para compatibilidad con el componente de tags
- Estructura: { flag: boolean, key: string, value: unknown, ignoreValue?: string }
- EKS
- Advisor
- Metrics
- Network
- Bedrock

---

<a id="components-general-aws-filters-instancesfiltercomponent-tsx"></a>
## `components/general_aws/filters/InstancesFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `InstancesFilterComponent` `({ service, instance, setInstance, startDate, endDate, region, selectedKey, selectedValue, isInstanceMultiSelect }: InstancesFilterComponentProps)`

Interfaz `InstancesFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `service` | `string` | no | — |
| `instance` | `string` | no | — |
| `setInstance` | `Dispatch<SetStateAction<string>>` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `selectedKey` | `string` | no | — |
| `selectedValue` | `string` | no | — |
| `isInstanceMultiSelect` | `boolean` | no | — |

Internos:

- función `fetcherPost` `(url: string, tags: { Key: string; Value: string } | null = null)`
- función `fetcherGet` `(url: string, _tags: { Key: string; Value: string } | null = null)`

- API: `/api/aws/bridge/autoscaling/all-autoscaling-groups`, `/api/aws/bridge/aws/unused/ebs/candidates`, `/api/aws/bridge/aws/unused/ec2/candidates`, `/api/aws/bridge/bedrock/custom_models/all_custom_models`, `/api/aws/bridge/bedrock/foundation_models/all_foundation_models`, `/api/aws/bridge/bedrock/inference_profile/all_inference_profiles`, `/api/aws/bridge/db/all-instances-rds-mariadb`, `/api/aws/bridge/db/all-instances-rds-mysql`, `/api/aws/bridge/db/all-instances-rds-oracle`, `/api/aws/bridge/db/all-instances-rds-pg`, `/api/aws/bridge/db/all-instances-rds-sqlserver`, `/api/aws/bridge/eks/all-eks-clusters`, `/api/aws/bridge/loadbalancersv2/all_load_balancersv2`, `/api/aws/bridge/nat_gateways/all_nat_gateways`, `/api/aws/bridge/vm/all-instances-ec2`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-aws-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](general_presupuesto.md#components-general-presupuesto-filters-filterscomponent-tsx)

---

<a id="components-general-aws-filters-loadbalancersv2filtercomponent-tsx"></a>
## `components/general_aws/filters/LoadbalancersV2FilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `LoadbalancersV2FilterComponent` `({ startDate, endDate, region, elbV2, setElbV2, isElbV2Multiselect }: LoadbalancersV2FilterComponentProps)`

Interfaz `LoadbalancersV2FilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `elbV2` | `string` | no | — |
| `setElbV2` | `Dispatch<SetStateAction<string>>` | no | — |
| `isElbV2Multiselect` | `boolean` | no | — |

- Tipo interno `ApiElbV2` = `| { elb_arn: string; elb_name: string } | string`
- API: `/api/aws/bridge/loadbalancersv2/all_load_balancersv2`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](general_azure.md#components-general-azure-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx)

---

<a id="components-general-aws-filters-metricsfiltercomponent-tsx"></a>
## `components/general_aws/filters/MetricsFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MetricsFilterComponent` `({ selectedMetrics, setSelectedMetrics, isMetricsMultiSelect = true, }: MetricsFilterComponentProps)`

Interfaz `MetricsFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `selectedMetrics` | `string` | no | CSV URL-encoded con los grupos seleccionados. Ej: "CPU%20Utilization,Network%20In" |
| `setSelectedMetrics` | `Dispatch<SetStateAction<string>>` | no | — |
| `isMetricsMultiSelect` | `boolean` | sí | Activa selección múltiple (default: true). En single-select se elige un solo grupo. |

Interfaz `ApiResponse`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `grupos_disponibles` | `string[]` | no | — |
| `detalles` | `Record<string, string[]>` | no | — |

- API: `/api/aws/bridge/vm/promedio-loc-ec2/grupos-disponibles`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-aws-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](general_presupuesto.md#components-general-presupuesto-filters-filterscomponent-tsx)

Notas de implementación:

- Endpoint actual de grupos de métricas
- Helpers para mantener compatibilidad con CSV URL-encoded
- Quitar selección de "todas" si se elige una específica
- SINGLE SELECT (como modo simple del InstancesFilterComponent)
- MULTI SELECT (con "Todas las Métricas")

---

<a id="components-general-aws-filters-metricsrdsfiltercomponent-tsx"></a>
## `components/general_aws/filters/MetricsRDSFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MetricsRDSFilterComponent` `({ selectedMetrics, setSelectedMetrics, rdsService, isMetricsMultiSelect = true, }: MetricsRDSFilterComponentProps)`

Interfaz `MetricsRDSFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `selectedMetrics` | `string` | no | CSV URL-encoded con los grupos seleccionados. Ej: "CPU%20Utilization,Network%20In" |
| `setSelectedMetrics` | `Dispatch<SetStateAction<string>>` | no | — |
| `rdsService` | `'postgresql' \| 'oracle' \| 'mysql' \| 'sqlserver' \| 'mariadb'` | no | Motor RDS para construir el endpoint |
| `isMetricsMultiSelect` | `boolean` | sí | Activa selección múltiple (default: true). En single-select se elige un solo grupo. |

Interfaz `ApiResponse`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `grupos_disponibles` | `string[]` | no | — |
| `detalles` | `Record<string, string[]>` | no | — |

Internos:

- función `getApiUrl` `(service: string)`

- API: `/api/aws/bridge/db/promedio-loc-{…}/grupos-disponibles`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-aws-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](general_presupuesto.md#components-general-presupuesto-filters-filterscomponent-tsx)

Notas de implementación:

- Helpers CSV URL-encoded (idéntico a MetricsFilterComponent)
- Si se elige una específica, se quita "all_metrics"
- SINGLE SELECT
- MULTI SELECT (con "Todas las Métricas")

---

<a id="components-general-aws-filters-natgatewaysfiltercomponent-tsx"></a>
## `components/general_aws/filters/NatGatewaysFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `NatGatewaysFilterComponent` `({ startDate, endDate, natGateway, setNatGateway, region, selectedKey, selectedValue, isNatGatewayMultiselect }: NatGatewaysFilterComponentProps)`

Interfaz `NatGatewaysFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `natGateway` | `string` | no | — |
| `setNatGateway` | `Dispatch<SetStateAction<string>>` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `selectedKey` | `string` | no | — |
| `selectedValue` | `string` | no | — |
| `isNatGatewayMultiselect` | `boolean` | no | — |

Internos:

- función `fetcherPost` `(url: string, tags: { Key: string; Value: string } | null = null)`

- API: `/api/aws/bridge/nat_gateways/all_nat_gateways`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-aws-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx)

---

<a id="components-general-aws-filters-regionfiltercomponent-tsx"></a>
## `components/general_aws/filters/RegionFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RegionFilterComponent` `({ selectedRegion, setSelectedRegion, isRegionMultiSelect, }: RegionFilterComponentProps)`

Interfaz `RegionFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `selectedRegion` | `string` | no | — |
| `setSelectedRegion` | `Dispatch<SetStateAction<string>>` | no | — |
| `isRegionMultiSelect` | `boolean` | no | — |

- Usa: [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`aws_regions.ts`](../lib.md#lib-aws-regions-ts)
- Usado por: [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx), [`FilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-filtercomponent-tsx), [`FiltersComponent.tsx`](general_presupuesto.md#components-general-presupuesto-filters-filterscomponent-tsx)

---

<a id="components-general-aws-filters-s3filtercomponent-tsx"></a>
## `components/general_aws/filters/S3FilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `S3BucketFilter` `({ selectedBuckets, setSelectedBuckets, startDate, endDate, region = 'all_regions', }: S3BucketFilterProps)`

Interfaz `S3BucketFilterProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `selectedBuckets` | `string` | no | — |
| `setSelectedBuckets` | `Dispatch<SetStateAction<string>>` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | sí | — |

- API: `/api/aws/bridge/s3/s3_buckets/list`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](general_presupuesto.md#components-general-presupuesto-filters-filterscomponent-tsx)

Notas de implementación:

- Render States
- JSX — Opción: Todos
- JSX — Buckets individuales

---

<a id="components-general-aws-filters-servicefiltercomponent-tsx"></a>
## `components/general_aws/filters/ServiceFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ServiceFilterComponent` `({ selectedServices, setSelectedServices }: ServiceFilterComponentProps)`

Interfaz `ServiceFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `selectedServices` | `string` | no | — |
| `setSelectedServices` | `Dispatch<SetStateAction<string>>` | no | — |

Interfaz `ServiceData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `SERVICE` | `string` | no | — |

- API: `/api/aws/bridge/funcion/servicios-disponibles`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-aws-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](general_presupuesto.md#components-general-presupuesto-filters-filterscomponent-tsx)

---

<a id="components-general-aws-filters-tagsfiltercomponent-tsx"></a>
## `components/general_aws/filters/TagsFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `TagFilterComponent` `({ startDate, endDate, region, resourceType, localService, selectedKey, selectedValue, setSelectedKey, setSelectedValue, setTagsData, onChange }: TagFilterComp…`

Interfaz `TaggedResource`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `Tags` | `{ Key: string; Value: string }[] \| null` | sí | — |

Interfaz `TagFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `resourceType` | `string` | no | — |
| `localService` | `string` | sí | — |
| `selectedKey` | `string \| null` | sí | — |
| `selectedValue` | `string \| null` | sí | — |
| `setSelectedKey` | `Dispatch<SetStateAction<string \| null>>` | no | — |
| `setSelectedValue` | `Dispatch<SetStateAction<string \| null>>` | no | — |
| `setTagsData` | `Dispatch<SetStateAction<unknown[]>>` | sí | — |
| `onChange` | `(next: { key: string \| null; value: string \| null }) => void` | sí | — |

- API: `/api/aws/bridge/get-all-tags`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-aws-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](general_presupuesto.md#components-general-presupuesto-filters-filterscomponent-tsx)

---

<a id="components-general-aws-filters-tagsfiltercomponent-aws-tsx"></a>
## `components/general_aws/filters/TagsFilterComponent_Aws.tsx`

**Componente (cliente)**

Exporta:

- componente `TagFilterComponent` `({ startDate, endDate, region, resourceType, localService, selectedKey, selectedValue, setSelectedKey, setSelectedValue, setTagsData, onChange }: TagFilterComp…`

Interfaz `TagFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `resourceType` | `string` | no | — |
| `localService` | `string` | sí | — |
| `selectedKey` | `string \| null` | sí | — |
| `selectedValue` | `string \| null` | sí | — |
| `setSelectedKey` | `Dispatch<SetStateAction<string \| null>>` | no | — |
| `setSelectedValue` | `Dispatch<SetStateAction<string \| null>>` | no | — |
| `setTagsData` | `Dispatch<SetStateAction<unknown[]>>` | sí | — |
| `onChange` | `(next: { key: string \| null; value: string \| null }) => void` | sí | — |

- API: `/api/aws/bridge/get-all-tags`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-aws-loadercomponent-tsx)

---

<a id="components-general-aws-filters-unusedloadbalancersv2filtercomponent-tsx"></a>
## `components/general_aws/filters/UnusedLoadbalancersV2FilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedLoadbalancersV2FilterComponent` `({ startDate, endDate, region, unusedElbV2, setUnusedElbV2, isUnusedElbV2Multiselect }: UnusedLoadbalancersV2FilterComponentProps)`

Interfaz `UnusedLoadbalancersV2FilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `unusedElbV2` | `string` | no | — |
| `setUnusedElbV2` | `Dispatch<SetStateAction<string>>` | no | — |
| `isUnusedElbV2Multiselect` | `boolean` | no | — |

- API: `/api/aws/bridge/aws/unused/load-balancers/candidates`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](general_azure.md#components-general-azure-loadercomponent-tsx), [`unused.ts`](../tipos.md#interfaces-unused-ts)
- Usado por: [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx)

---

<a id="components-general-aws-filters-unusednatgatewaysfiltercomponent-tsx"></a>
## `components/general_aws/filters/UnusedNatGatewaysFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedNatGatewaysFilterComponent` `({ startDate, endDate, unusedNatGateway, setUnusedNatGateway, region, selectedKey, selectedValue, isUnusedNatGatewayMultiselect }: UnusedNatGatewaysFilterCompo…`

Interfaz `UnusedNatGatewaysFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `unusedNatGateway` | `string` | no | — |
| `setUnusedNatGateway` | `Dispatch<SetStateAction<string>>` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `selectedKey` | `string` | no | — |
| `selectedValue` | `string` | no | — |
| `isUnusedNatGatewayMultiselect` | `boolean` | no | — |

Internos:

- función `fetcherPost` `(url: string, tags: { Key: string; Value: string } | null = null)`

- API: `/api/aws/bridge/aws/unused/nat-gateways/candidates`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-aws-loadercomponent-tsx), [`unused.ts`](../tipos.md#interfaces-unused-ts)
- Usado por: [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx)

---

<a id="components-general-aws-filters-unusedroute53filtercomponent-tsx"></a>
## `components/general_aws/filters/UnusedRoute53FilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedRoute53FilterComponent` `({ startDate, endDate, region, unusedR53, setUnusedR53, isUnusedR53Multiselect }: UnusedRoute53FilterComponentProps)`

Interfaz `UnusedRoute53FilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `unusedR53` | `string` | no | — |
| `setUnusedR53` | `Dispatch<SetStateAction<string>>` | no | — |
| `isUnusedR53Multiselect` | `boolean` | no | — |

- API: `/api/aws/bridge/aws/unused/route53/candidates`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](general_azure.md#components-general-azure-loadercomponent-tsx), [`unused.ts`](../tipos.md#interfaces-unused-ts)
- Usado por: [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx)

---

<a id="components-general-aws-filters-variationmetricfiltercomponent-tsx"></a>
## `components/general_aws/filters/VariationMetricFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `VariationMetricFilterComponent` `({ startDate, endDate, region, selectedService, selectedMetric, setSelectedMetric, isAsgMultiSelect }: VariationMetricFilterComponentProps)`

Interfaz `VariationMetricFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `selectedService` | `string` | no | — |
| `selectedMetric` | `string` | no | — |
| `setSelectedMetric` | `Dispatch<SetStateAction<string>>` | no | — |
| `isAsgMultiSelect` | `boolean` | no | — |

- Tipo interno `RawMetricItem` = `string | { MetricLabel?: string MetricName?: string label?: string value?: string [key: string]: unknown }`
- Tipo interno `MetricOption` = `{ value: string label: string }`
Internos:

- función `fetcherPost` `(url: string, tags: { Key: string; Value: string } | null = null)`
- función `fetcherGet` `(url: string, tags: { Key: string; Value: string } | null = null)`

- API: `/api/aws/bridge/recursos/getMetric`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-aws-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](general_presupuesto.md#components-general-presupuesto-filters-filterscomponent-tsx)

Notas de implementación:

- Solo actuar cuando terminó la carga y no hubo error
- JSX — Instancias de ASG (solo si hay ASG disponible y seleccionado)

---

<a id="components-general-aws-filters-variationresourcesfiltercomponent-tsx"></a>
## `components/general_aws/filters/VariationResourcesFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `VariationResourcesFilterComponent` `({ startDate, endDate, region, service, metric, resource, setResource, isResourceMultiSelect }: VariationResourcesFilterComponentProps)`

Interfaz `VariationResourcesFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `region` | `string` | no | — |
| `startDate` | `string` | no | — |
| `endDate` | `string` | no | — |
| `service` | `string` | no | — |
| `metric` | `string` | no | — |
| `resource` | `string` | no | — |
| `setResource` | `Dispatch<SetStateAction<string>>` | no | — |
| `isResourceMultiSelect` | `boolean` | no | — |

Internos:

- función `fetcherPost` `(url: string, tags: { Key: string; Value: string } | null = null)`

- API: `/api/aws/bridge/aws/ec2/autoscaling/groups`, `/api/aws/bridge/db/all-instances-rds-mariadb`, `/api/aws/bridge/db/all-instances-rds-mysql`, `/api/aws/bridge/db/all-instances-rds-oracle`, `/api/aws/bridge/db/all-instances-rds-pg`, `/api/aws/bridge/db/all-instances-rds-sqlserver`, `/api/aws/bridge/ebs/all_ebs`, `/api/aws/bridge/s3/s3_buckets/list`, `/api/aws/bridge/vm/all-instances-ec2`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-aws-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx)

Notas de implementación:

- default: fetcher = fetcherPost url = shouldFetch ? `no result` : null; break;

---

<a id="components-general-aws-filters-variationservicefiltercomponent-tsx"></a>
## `components/general_aws/filters/VariationServiceFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `VariationServiceFilterComponent` `({ selectedService, setSelectedService, }: VariationServiceFilterComponentProps)`

Interfaz `VariationServiceFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `selectedService` | `string` | no | — |
| `setSelectedService` | `Dispatch<SetStateAction<string>>` | no | — |

- Usa: [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`aws_variacion_servicios.ts`](../lib.md#lib-aws-variacion-servicios-ts)
- Usado por: [`FiltersComponent.tsx`](#components-general-aws-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](general_presupuesto.md#components-general-presupuesto-filters-filterscomponent-tsx)

