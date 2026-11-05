# Componentes `components/general_azure/`

[← Índice](../README.md)

Filtros de Azure (suscripciones, regiones, resource groups, recursos, métricas, etiquetas, Foundry, …) y el loader.

Archivos:

- [`components/general_azure/LoaderComponent.tsx`](#components-general-azure-loadercomponent-tsx)
- [`components/general_azure/filters/AppGwFilterComponent.tsx`](#components-general-azure-filters-appgwfiltercomponent-tsx)
- [`components/general_azure/filters/CategoryFilterComponent.tsx`](#components-general-azure-filters-categoryfiltercomponent-tsx)
- [`components/general_azure/filters/DeploymentOperationsFilterComponent.tsx`](#components-general-azure-filters-deploymentoperationsfiltercomponent-tsx)
- [`components/general_azure/filters/FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)
- [`components/general_azure/filters/FoundryModelsFilterComponent.tsx`](#components-general-azure-filters-foundrymodelsfiltercomponent-tsx)
- [`components/general_azure/filters/ImpactFilterComponent.tsx`](#components-general-azure-filters-impactfiltercomponent-tsx)
- [`components/general_azure/filters/InstancesFilterComponent.tsx`](#components-general-azure-filters-instancesfiltercomponent-tsx)
- [`components/general_azure/filters/InstancesFilterComponentV2.tsx`](#components-general-azure-filters-instancesfiltercomponentv2-tsx)
- [`components/general_azure/filters/MetricsFilterComponent.tsx`](#components-general-azure-filters-metricsfiltercomponent-tsx)
- [`components/general_azure/filters/RegionFilterComponent.tsx`](#components-general-azure-filters-regionfiltercomponent-tsx)
- [`components/general_azure/filters/ResourceGroupsFilterComponent.tsx`](#components-general-azure-filters-resourcegroupsfiltercomponent-tsx)
- [`components/general_azure/filters/ResourceTypesFilterComponent.tsx`](#components-general-azure-filters-resourcetypesfiltercomponent-tsx)
- [`components/general_azure/filters/ResourcesFilterComponent.tsx`](#components-general-azure-filters-resourcesfiltercomponent-tsx)
- [`components/general_azure/filters/ServiceFilterComponent.tsx`](#components-general-azure-filters-servicefiltercomponent-tsx)
- [`components/general_azure/filters/StorageAccountsFilterComponent.tsx`](#components-general-azure-filters-storageaccountsfiltercomponent-tsx)
- [`components/general_azure/filters/SubscriptionsFilterComponent.tsx`](#components-general-azure-filters-subscriptionsfiltercomponent-tsx)
- [`components/general_azure/filters/SubscriptionsFilterComponentV2.tsx`](#components-general-azure-filters-subscriptionsfiltercomponentv2-tsx)
- [`components/general_azure/filters/TagsFilterComponent.tsx`](#components-general-azure-filters-tagsfiltercomponent-tsx)
- [`components/general_azure/filters/TrafficManagerFilterComponent.tsx`](#components-general-azure-filters-trafficmanagerfiltercomponent-tsx)
- [`components/general_azure/filters/UnusedAppGwFilterComponent.tsx`](#components-general-azure-filters-unusedappgwfiltercomponent-tsx)
- [`components/general_azure/filters/UnusedLoadbalancerFilterComponent.tsx`](#components-general-azure-filters-unusedloadbalancerfiltercomponent-tsx)
- [`components/general_azure/filters/UnusedTrafficManagerFilter.tsx`](#components-general-azure-filters-unusedtrafficmanagerfilter-tsx)
- [`components/general_azure/filters/UnusedVmFilterComponent.tsx`](#components-general-azure-filters-unusedvmfiltercomponent-tsx)
- [`components/general_azure/filters/UnusedVmssFilterComponent.tsx`](#components-general-azure-filters-unusedvmssfiltercomponent-tsx)
- [`components/general_azure/filters/VmFilterComponent.tsx`](#components-general-azure-filters-vmfiltercomponent-tsx)

<a id="components-general-azure-loadercomponent-tsx"></a>
## `components/general_azure/LoaderComponent.tsx`

**Componente**

Exporta:

- componente `LoaderComponent` `({ size = 'large' }: LoaderComponentProps)`

Interfaz `LoaderComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `size` | `'small' \| 'large'` | no | — |

- Usado por: [`BMComparisonComponent.tsx`](amazon-bedrock.md#components-amazon-bedrock-comparacion-bmcomparisoncomponent-tsx), [`BMPromptOptComponent.tsx`](amazon-bedrock.md#components-amazon-bedrock-prompt-opt-bmpromptoptcomponent-tsx), [`LoadbalancersV2FilterComponent.tsx`](general_aws.md#components-general-aws-filters-loadbalancersv2filtercomponent-tsx), [`UnusedLoadbalancersV2FilterComponent.tsx`](general_aws.md#components-general-aws-filters-unusedloadbalancersv2filtercomponent-tsx), [`UnusedRoute53FilterComponent.tsx`](general_aws.md#components-general-aws-filters-unusedroute53filtercomponent-tsx), [`AppGwFilterComponent.tsx`](#components-general-azure-filters-appgwfiltercomponent-tsx), [`CategoryFilterComponent.tsx`](#components-general-azure-filters-categoryfiltercomponent-tsx), [`DeploymentOperationsFilterComponent.tsx`](#components-general-azure-filters-deploymentoperationsfiltercomponent-tsx), [`ImpactFilterComponent.tsx`](#components-general-azure-filters-impactfiltercomponent-tsx), [`InstancesFilterComponent.tsx`](#components-general-azure-filters-instancesfiltercomponent-tsx), [`InstancesFilterComponentV2.tsx`](#components-general-azure-filters-instancesfiltercomponentv2-tsx), [`MetricsFilterComponent.tsx`](#components-general-azure-filters-metricsfiltercomponent-tsx), [`ResourceGroupsFilterComponent.tsx`](#components-general-azure-filters-resourcegroupsfiltercomponent-tsx), [`StorageAccountsFilterComponent.tsx`](#components-general-azure-filters-storageaccountsfiltercomponent-tsx), [`SubscriptionsFilterComponent.tsx`](#components-general-azure-filters-subscriptionsfiltercomponent-tsx), [`SubscriptionsFilterComponentV2.tsx`](#components-general-azure-filters-subscriptionsfiltercomponentv2-tsx), [`TagsFilterComponent.tsx`](#components-general-azure-filters-tagsfiltercomponent-tsx), [`TrafficManagerFilterComponent.tsx`](#components-general-azure-filters-trafficmanagerfiltercomponent-tsx), [`UnusedAppGwFilterComponent.tsx`](#components-general-azure-filters-unusedappgwfiltercomponent-tsx), [`UnusedLoadbalancerFilterComponent.tsx`](#components-general-azure-filters-unusedloadbalancerfiltercomponent-tsx), [`UnusedTrafficManagerFilter.tsx`](#components-general-azure-filters-unusedtrafficmanagerfilter-tsx), [`UnusedVmFilterComponent.tsx`](#components-general-azure-filters-unusedvmfiltercomponent-tsx), [`UnusedVmssFilterComponent.tsx`](#components-general-azure-filters-unusedvmssfiltercomponent-tsx), [`VmFilterComponent.tsx`](#components-general-azure-filters-vmfiltercomponent-tsx), [`MultiTenantTagsFilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-multitenanttagsfiltercomponent-tsx), [`VXPromptOptComponent.tsx`](google-vertex.md#components-google-vertex-prompt-opt-vxpromptoptcomponent-tsx), [`AFComparisonComponent.tsx`](microsoft-foundry.md#components-microsoft-foundry-comparacion-afcomparisoncomponent-tsx), [`FMPromptOptComponent.tsx`](microsoft-foundry.md#components-microsoft-foundry-prompt-opt-fmpromptoptcomponent-tsx)

---

<a id="components-general-azure-filters-appgwfiltercomponent-tsx"></a>
## `components/general_azure/filters/AppGwFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AppGwFilterComponent` `({ startDate, endDate, region, subscription, appGw, setAppGw, resourceGroup, isAppGFilterMultiselect, selectedTagKey, selectedTagValue }: AppGwFilterComponentP…`

Interfaz `AppGwFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `subscription` | `string` | no | — |
| `appGw` | `string` | no | — |
| `setAppGw` | `Dispatch<SetStateAction<string>>` | no | — |
| `isAppGFilterMultiselect` | `boolean` | no | — |
| `resourceGroup` | `string` | no | — |
| `selectedTagKey` | `string \| null` | sí | — |
| `selectedTagValue` | `string \| null` | sí | — |

- Tipo interno `ApiAppGw` = `| { gw_id_lowercase: string; gw_name: string } | string`
- API: `/api/azure/bridge/azure/apps_gateway/all_application_gateways`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-azure-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)

---

<a id="components-general-azure-filters-categoryfiltercomponent-tsx"></a>
## `components/general_azure/filters/CategoryFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `CategoryFilterComponent` `({ category, setCategory }: CategoryFilterComponentProps)`

Interfaz `CategoryFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `category` | `string \| null` | no | — |
| `setCategory` | `Dispatch<SetStateAction<string \| null>>` | no | — |

- API: `/api/azure/bridge/azure/get-all-impact-category`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-azure-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)

Notas de implementación:

- Agregar "Ver todos" al inicio
- Si selecciona "Ver todos", pasa string vacío

---

<a id="components-general-azure-filters-deploymentoperationsfiltercomponent-tsx"></a>
## `components/general_azure/filters/DeploymentOperationsFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `DeploymentOperationsFilterComponent` `({ operation, setOperation, startDate, endDate, }: DeploymentOperationsFilterComponentProps)`

Interfaz `DeploymentOperationsFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `operation` | `string` | no | — |
| `setOperation` | `Dispatch<SetStateAction<string>>` | no | — |

- API: `/api/azure/bridge/azure/deployments/deployments/operations`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-azure-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)

---

<a id="components-general-azure-filters-filterscomponent-tsx"></a>
## `components/general_azure/filters/FiltersComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `FiltersComponent` `({ Component, dateFilter = true, monthYearFilter = false, regionFilter = false, subscriptionFilter = false, subscriptionIdFilter = false, tagsFilter = false, t…`

Interfaz `FiltersComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `Component` | `(params: { startDate: Date; endDate?: Date; month?: number \| null; ye…` | no | — |
| `dateFilter` | `boolean` | sí | — |
| `monthYearFilter` | `boolean` | sí | — |
| `regionFilter` | `boolean` | sí | — |
| `subscriptionFilter` | `boolean` | sí | — |
| `subscriptionIdFilter` | `boolean` | sí | — |
| `tagsFilter` | `boolean` | sí | — |
| `tagsResourceType` | `string` | sí | — |
| `tagsLocalService` | `string` | sí | — |
| `isRegionMultiSelect` | `boolean` | sí | — |
| `metricsFilter` | `boolean` | sí | — |
| `metricsResourceType` | `string` | sí | — |
| `resourceTypeFilter` | `boolean` | sí | — |
| `instancesService` | `string` | sí | — |
| `instancesFilter` | `boolean` | sí | — |
| `strgAccountFilter` | `boolean` | sí | — |
| `isStrgAccountMultiselect` | `boolean` | sí | — |
| `resourcesFilter` | `boolean` | sí | — |
| `unusedVmFilter` | `boolean` | sí | — |
| `isUnusedVmFilterMultiselect` | `boolean` | sí | — |
| `unusedVmssFilter` | `boolean` | sí | — |
| `isUnusedVmssFilterMultiselect` | `boolean` | sí | — |
| `vmFilter` | `boolean` | sí | — |
| `isVmFilterMultiselect` | `boolean` | sí | — |
| `serviceFilter` | `boolean` | sí | — |
| `isServiceMultiselect` | `boolean` | sí | — |
| `resourceGroupFilter` | `boolean` | sí | — |
| `resourceGroupResourceType` | `string` | sí | — |
| `instancesFilterV2` | `boolean` | sí | — |
| `instancesV2ResourceType` | `string` | sí | — |
| `deploymentOperationsFilter` | `boolean` | sí | — |
| `impactFilter` | `boolean` | sí | — |
| `categoryFilter` | `boolean` | sí | — |
| `unusedLbFilter` | `boolean` | sí | — |
| `isUnusedLoadbalancerFilterMultiselect` | `boolean` | sí | — |
| `unusedAppGFilter` | `boolean` | sí | — |
| `isUnusedAppGFilterMultiselect` | `boolean` | sí | — |
| `appGFilter` | `boolean` | sí | — |
| `isAppGFilterMultiselect` | `boolean` | sí | — |
| `unusedTmFilter` | `boolean` | sí | — |
| `isUnusedTmFilterMultiselect` | `boolean` | sí | — |
| `tmFilter` | `boolean` | sí | — |
| `isTmFilterMultiselect` | `boolean` | sí | — |
| `cloud` | `string` | sí | — |
| `foundryModelFilter` | `boolean` | sí | — |
| `foundryModel` | `string` | sí | — |

- Hooks: `useRouter`, `useSearchParams`
- Usa: [`RegionFilterComponent.tsx`](#components-general-azure-filters-regionfiltercomponent-tsx), [`SubscriptionsFilterComponent.tsx`](#components-general-azure-filters-subscriptionsfiltercomponent-tsx), [`TagsFilterComponent.tsx`](#components-general-azure-filters-tagsfiltercomponent-tsx), [`MetricsFilterComponent.tsx`](#components-general-azure-filters-metricsfiltercomponent-tsx), [`BaseFiltersComponent.tsx`](shared.md#components-shared-filters-basefilterscomponent-tsx), [`filters.ts`](../lib.md#lib-filters-ts), [`SubscriptionsFilterComponentV2.tsx`](#components-general-azure-filters-subscriptionsfiltercomponentv2-tsx), [`ResourceTypesFilterComponent.tsx`](#components-general-azure-filters-resourcetypesfiltercomponent-tsx), [`InstancesFilterComponent.tsx`](#components-general-azure-filters-instancesfiltercomponent-tsx), [`StorageAccountsFilterComponent.tsx`](#components-general-azure-filters-storageaccountsfiltercomponent-tsx), [`ResourcesFilterComponent.tsx`](#components-general-azure-filters-resourcesfiltercomponent-tsx), [`UnusedVmFilterComponent.tsx`](#components-general-azure-filters-unusedvmfiltercomponent-tsx), [`UnusedVmssFilterComponent.tsx`](#components-general-azure-filters-unusedvmssfiltercomponent-tsx), [`VmFilterComponent.tsx`](#components-general-azure-filters-vmfiltercomponent-tsx), [`ServiceFilterComponent.tsx`](#components-general-azure-filters-servicefiltercomponent-tsx), [`ResourceGroupsFilterComponent.tsx`](#components-general-azure-filters-resourcegroupsfiltercomponent-tsx), [`InstancesFilterComponentV2.tsx`](#components-general-azure-filters-instancesfiltercomponentv2-tsx), [`DeploymentOperationsFilterComponent.tsx`](#components-general-azure-filters-deploymentoperationsfiltercomponent-tsx), [`ImpactFilterComponent.tsx`](#components-general-azure-filters-impactfiltercomponent-tsx), [`CategoryFilterComponent.tsx`](#components-general-azure-filters-categoryfiltercomponent-tsx), [`UnusedLoadbalancerFilterComponent.tsx`](#components-general-azure-filters-unusedloadbalancerfiltercomponent-tsx), [`UnusedAppGwFilterComponent.tsx`](#components-general-azure-filters-unusedappgwfiltercomponent-tsx), [`AppGwFilterComponent.tsx`](#components-general-azure-filters-appgwfiltercomponent-tsx), [`UnusedTrafficManagerFilter.tsx`](#components-general-azure-filters-unusedtrafficmanagerfilter-tsx), [`TrafficManagerFilterComponent.tsx`](#components-general-azure-filters-trafficmanagerfiltercomponent-tsx), [`FoundryModelsFilterComponent.tsx`](#components-general-azure-filters-foundrymodelsfiltercomponent-tsx)
- Usado por: [`MainViewAiFinopsMetricsComponent.tsx`](ai-finops-metrics.md#components-ai-finops-metrics-mainviewaifinopsmetricscomponent-tsx), [`MainViewAiRecommendationStatusesComponent.tsx`](ai-recommendation-statuses.md#components-ai-recommendation-statuses-mainviewairecommendationstatusescomponent-tsx), [`MainViewAdvisorComponent.tsx`](azure/vista-advisor.md#components-azure-vista-advisor-mainviewadvisorcomponent-tsx), [`MainViewConsumoAppGwComponent.tsx`](azure/vista-consumo-apps-gateway.md#components-azure-vista-consumo-apps-gateway-mainviewconsumoappgwcomponent-tsx), [`MainViewConsumoDbComponent.tsx`](azure/vista-consumo-db.md#components-azure-vista-consumo-db-mainviewconsumodbcomponent-tsx), [`MainViewConsumoNodosComponent.tsx`](azure/vista-consumo-nodos.md#components-azure-vista-consumo-nodos-mainviewconsumonodoscomponent-tsx), [`MainViewConsumoVmComponent.tsx`](azure/vista-consumo-vm.md#components-azure-vista-consumo-vm-mainviewconsumovmcomponent-tsx), [`MainViewDeploymentsComponent.tsx`](azure/vista-deployments.md#components-azure-vista-deployments-mainviewdeploymentscomponent-tsx), [`MainViewTendenciaPagoPorUsoComponent.tsx`](azure/vista-facturacion.md#components-azure-vista-facturacion-tendencia-pago-por-uso-mainviewtendenciapagoporusocomponent-tsx), [`MainViewTopDolaresFacturadosComponent.tsx`](azure/vista-facturacion.md#components-azure-vista-facturacion-top-dolares-facturados-mainviewtopdolaresfacturadoscomponent-tsx), [`MainViewAverageByLocationComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-average-by-location-mainviewaveragebylocationcomponent-tsx), [`MainViewBlobVsStorageComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-blob-vs-storage-general-mainviewblobvsstoragecomponent-tsx), [`MainViewAzureDbWorkingNonWorkingHoursComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-consumo-horario-habil-no-habil-data-bases-mainviewazuredbworkingnonworkinghourscomponent-tsx), [`MainViewAzureNodosWorkingNonWorkingHoursComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-consumo-horario-habil-no-habil-nodes-mainviewazurenodosworkingnonworkinghourscomponent-tsx), [`MainViewAnalisisVMsHorarioComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-consumo-horario-habil-no-habil-virtual-machines-mainviewanalisisvmshorariocomponent-tsx), [`MainViewIncrementoTopRecursosUsoComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-incremento-top-recursos-uso-mainviewincrementotoprecursosusocomponent-tsx), [`MainViewSpotVsRegularVmComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-spot-vs-regular-vm-mainviewspotvsregularvmcomponent-tsx), [`MainViewTop10RecursosUsoComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-top-10-recursos-uso-mainviewtop10recursosusocomponent-tsx), [`MainViewUnusedAppsGw.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-apps-gateway-mainviewunusedappsgw-tsx), [`MainViewUnusedLoadbalancers.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-loadbalancers-mainviewunusedloadbalancers-tsx), [`MainViewUnusedVmExtensionsComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-resources-extensions-mainviewunusedvmextensionscomponent-tsx), [`MainViewUnusedVmComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-resources-vm-mainviewunusedvmcomponent-tsx), [`MainViewUnusedVmssComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-resources-vmss-mainviewunusedvmsscomponent-tsx), [`MainViewUnusedTrafficManagerComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-traffic-managers-mainviewunusedtrafficmanagercomponent-tsx), [`MainViewStorageVariationComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-variacion-storage-mainviewstoragevariationcomponent-tsx), [`MainViewHeatmapQuotasComponent.tsx`](azure/vista-heatmap-quotas.md#components-azure-vista-heatmap-quotas-mainviewheatmapquotascomponent-tsx), [`MainViewRecursosDbsComponent.tsx`](azure/vista-recursos-mysql.md#components-azure-vista-recursos-mysql-mainviewrecursosdbscomponent-tsx), [`MainViewRecursosNodeComponent.tsx`](azure/vista-recursos-nodos.md#components-azure-vista-recursos-nodos-mainviewrecursosnodecomponent-tsx), [`MainViewRecursosDbsComponent.tsx`](azure/vista-recursos-postgresql.md#components-azure-vista-recursos-postgresql-mainviewrecursosdbscomponent-tsx), [`MainViewRecursosTrafficManagerComponent.tsx`](azure/vista-recursos-tm.md#components-azure-vista-recursos-tm-mainviewrecursostrafficmanagercomponent-tsx), [`MainViewRecursosVmComponent.tsx`](azure/vista-recursos-vm.md#components-azure-vista-recursos-vm-mainviewrecursosvmcomponent-tsx), [`MainViewTopRecursosGeneralComponent.tsx`](azure/vista-recursos.md#components-azure-vista-recursos-top-recursos-general-mainviewtoprecursosgeneralcomponent-tsx), [`MainViewSavingsPlanComponent.tsx`](azure/vista-savings-plan.md#components-azure-vista-savings-plan-mainviewsavingsplancomponent-tsx), [`MainViewTaggedResourcesComponent.tsx`](azure/vista-tags.md#components-azure-vista-tags-mainviewtaggedresourcescomponent-tsx), [`MainViewAFComparisonComponent.tsx`](microsoft-foundry.md#components-microsoft-foundry-comparacion-mainviewafcomparisoncomponent-tsx), [`MainViewCOAzureFoundryComponent.tsx`](microsoft-foundry.md#components-microsoft-foundry-costo-optimizacion-foundation-models-mainviewcoazurefoundrycomponent-tsx), [`MainViewCOOpenAIComponent.tsx`](open-ia.md#components-open-ia-costo-optimizacion-foundation-models-mainviewcoopenaicomponent-tsx)

Notas de implementación:

- _FiltersComponentProps_: Filtros comunes a las 3 nubes (F-06).
- Estructura: { flag: boolean, key: string, value: unknown, ignoreValue?: string }
- Tags
- Métricas y Recursos
- Instancias
- Impacto y Categoría
- VMs y VMSS
- Grupos y Servicios
- Operaciones
- Storage y Redes
- Foundry

---

<a id="components-general-azure-filters-foundrymodelsfiltercomponent-tsx"></a>
## `components/general_azure/filters/FoundryModelsFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `FoundryModelsFilterComponent` `({ foundryModel, setFoundryModel }: FoundryModelsFilterComponentProps)`

Interfaz `FoundryModelsFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `foundryModel` | `string` | no | — |
| `setFoundryModel` | `Dispatch<SetStateAction<string>>` | no | — |

Interfaz `FoundryModelProvider`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string` | no | — |
| `label` | `string` | no | — |
| `dotClassName` | `string` | no | — |
| `pattern` | `RegExp` | no | — |

Interfaz `FoundryModelOption`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string` | no | — |
| `name` | `string` | no | — |
| `provider` | `FoundryModelProvider` | no | — |

- Tipo interno `ApiFoundryModel` = `| { model_id_lowercase: string; model_name: string } | string`
Internos:

- constante `FOUNDRY_MODEL_PROVIDERS`
- constante `OTHER_FOUNDRY_MODEL_PROVIDER`
- función `resolveFoundryModelProvider` `(name: string)`

- API: `/api/azure/bridge/azure/foundry/prompt_optimization/all_chat_foundry_models`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx), [`FMPromptOptInputComponent.tsx`](microsoft-foundry.md#components-microsoft-foundry-prompt-opt-info-fmpromptoptinputcomponent-tsx)

---

<a id="components-general-azure-filters-impactfiltercomponent-tsx"></a>
## `components/general_azure/filters/ImpactFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ImpactFilterComponent` `({ impact, setImpact }: ImpactFilterComponentProps)`

Interfaz `ImpactFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `impact` | `string \| null` | no | — |
| `setImpact` | `Dispatch<SetStateAction<string \| null>>` | no | — |

- API: `/api/azure/bridge/azure/get-all-impact-category`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-azure-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)

Notas de implementación:

- Agregar "Ver todos" al inicio
- Si selecciona "Ver todos", pasa string vacío

---

<a id="components-general-azure-filters-instancesfiltercomponent-tsx"></a>
## `components/general_azure/filters/InstancesFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `InstancesFilterComponent` `({ startDate, endDate, region, subscription, instancesService, selectedTagKey, selectedTagValue, selectedMeterCategory, selectedInstance, setSelectedMeterCateg…`

Interfaz `InstancesFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `subscription` | `string` | no | — |
| `instancesService` | `string` | sí | — |
| `selectedTagKey` | `string \| null` | sí | — |
| `selectedTagValue` | `string \| null` | sí | — |
| `selectedMeterCategory` | `string \| null` | sí | — |
| `selectedInstance` | `string \| null` | sí | — |
| `setSelectedMeterCategory` | `Dispatch<SetStateAction<string \| null>>` | no | — |
| `setSelectedInstance` | `Dispatch<SetStateAction<string \| null>>` | no | — |
| `setInstancesData` | `Dispatch<SetStateAction<unknown[]>>` | sí | — |
| `onChange` | `(next: { meterCategory: string \| null; instance: string \| null }) => …` | sí | — |

Interfaz `MeterInstanceItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `meter_category` | `string` | no | — |
| `instances` | `string[]` | no | — |

- API: `/api/azure/bridge/azure/foundry/azure_foundry_accounts`, `/api/azure/bridge/azure/get-meter-instance`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-azure-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)

Notas de implementación:

- Las cuentas de Foundry llegan como lista plana ({ instance_name } o string)

---

<a id="components-general-azure-filters-instancesfiltercomponentv2-tsx"></a>
## `components/general_azure/filters/InstancesFilterComponentV2.tsx`

**Componente (cliente)**

Exporta:

- componente `InstancesFilterComponentV2` `({ startDate, endDate, region, subscription, resourceType, selectedTagKey, selectedTagValue, selectedResourceGroup, selectedInstance, setSelectedInstance, onCh…`

Interfaz `InstancesFilterProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `subscription` | `string` | no | — |
| `resourceType` | `string` | no | — |
| `selectedTagKey` | `string \| null` | sí | — |
| `selectedTagValue` | `string \| null` | sí | — |
| `selectedResourceGroup` | `string \| null` | sí | — |
| `selectedInstance` | `string \| null` | no | — |
| `setSelectedInstance` | `Dispatch<SetStateAction<string \| null>>` | no | — |
| `onChange` | `(next: { instance: string \| null }) => void` | sí | — |

- API: `/api/azure/bridge/azure/get-instances-custom`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-azure-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)

Notas de implementación:

- Solo hacer fetch si hay región y suscripción específicas seleccionadas
- Resetear la instancia seleccionada cuando cambian los filtros principales
- Si no se puede hacer fetch, mostrar mensaje informativo

---

<a id="components-general-azure-filters-metricsfiltercomponent-tsx"></a>
## `components/general_azure/filters/MetricsFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MetricsFilterComponent` `({ startDate, endDate, resourceType, metric, setMetric }: MetricsFilterComponentProps)`

Interfaz `MetricsFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `resourceType` | `string` | no | — |
| `metric` | `string` | no | — |
| `setMetric` | `Dispatch<SetStateAction<string>>` | no | — |

- API: `/api/azure/bridge/azure/get-all-metrics`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-azure-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)

---

<a id="components-general-azure-filters-regionfiltercomponent-tsx"></a>
## `components/general_azure/filters/RegionFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RegionFilterComponent` `({ selectedRegion, setSelectedRegion, isRegionMultiSelect, }: RegionFilterComponentProps)`

Interfaz `RegionFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `selectedRegion` | `string` | no | — |
| `setSelectedRegion` | `Dispatch<SetStateAction<string>>` | no | — |
| `isRegionMultiSelect` | `boolean` | no | — |

- Usa: [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`azure_regions.ts`](../lib.md#lib-azure-regions-ts)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx), [`FilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-filtercomponent-tsx)

---

<a id="components-general-azure-filters-resourcegroupsfiltercomponent-tsx"></a>
## `components/general_azure/filters/ResourceGroupsFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ResourceGroupFilterComponent` `({ startDate, endDate, region, subscription, resourceType, selectedTagKey, selectedTagValue, selectedResourceGroup, setSelectedResourceGroup, onChange }: Resou…`

Interfaz `ResourceGroupFilterProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `subscription` | `string` | no | — |
| `resourceType` | `string` | no | — |
| `selectedTagKey` | `string \| null` | sí | — |
| `selectedTagValue` | `string \| null` | sí | — |
| `selectedResourceGroup` | `string \| null` | no | — |
| `setSelectedResourceGroup` | `Dispatch<SetStateAction<string \| null>>` | no | — |
| `onChange` | `(next: { resourceGroup: string \| null }) => void` | sí | — |

- API: `/api/azure/bridge/azure/get-resource-groups`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-azure-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)

Notas de implementación:

- Solo hacer fetch si hay región y suscripción específicas seleccionadas
- Resetear el resource group seleccionado cuando cambian región o suscripción
- Si no se puede hacer fetch, mostrar mensaje informativo

---

<a id="components-general-azure-filters-resourcetypesfiltercomponent-tsx"></a>
## `components/general_azure/filters/ResourceTypesFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ResourceTypesFilterComponent` `({ selectedResourceType, setSelectedResourceType, }: ResourceTypesFilterComponentProps)`

Interfaz `ResourceTypesFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `selectedResourceType` | `string` | no | — |
| `setSelectedResourceType` | `Dispatch<SetStateAction<string>>` | no | — |

- Usa: [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`azure_resource_types.ts`](../lib.md#lib-azure-resource-types-ts)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)

---

<a id="components-general-azure-filters-resourcesfiltercomponent-tsx"></a>
## `components/general_azure/filters/ResourcesFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ResourcesFilterComponent` `({ startDate, endDate, selectedMetric, selectedResourceType, selectedResource, setSelectedResource }: ResourcesFilterComponentProps)`

Interfaz `ResourcesFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `selectedMetric` | `string` | sí | — |
| `selectedResourceType` | `string` | sí | — |
| `selectedResource` | `string` | no | — |
| `setSelectedResource` | `(resource: string) => void` | no | — |

- API: `/api/azure/bridge/azure/get-all-resources`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`select.tsx`](ui.md#components-ui-select-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)

Notas de implementación:

- Construir URL con filtros opcionales

---

<a id="components-general-azure-filters-servicefiltercomponent-tsx"></a>
## `components/general_azure/filters/ServiceFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ServiceFilterComponent` `({ selectedService, setSelectedService, isServiceMultiselect, }: ServiceFilterComponentProps)`

Interfaz `ServiceFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `selectedService` | `string` | no | — |
| `setSelectedService` | `Dispatch<SetStateAction<string>>` | no | — |
| `isServiceMultiselect` | `boolean` | no | — |

- Usa: [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`azure_services.ts`](../lib.md#lib-azure-services-ts)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)

---

<a id="components-general-azure-filters-storageaccountsfiltercomponent-tsx"></a>
## `components/general_azure/filters/StorageAccountsFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `StorageAccountsFilterComponent` `({ strgAccount, setStrgAccount, startDate, endDate, region, subscriptions, selectedKey, selectedValue, isStrgAccountMultiSelect }: StorageAccountsFilterCompone…`

Interfaz `StorageAccountsFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `strgAccount` | `string` | no | — |
| `setStrgAccount` | `Dispatch<SetStateAction<string>>` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `subscriptions` | `string` | no | — |
| `selectedKey` | `string` | no | — |
| `selectedValue` | `string` | no | — |
| `isStrgAccountMultiSelect` | `boolean` | no | — |

Internos:

- función `fetcherPost` `(url: string, tags: { Key: string; Value: string } | null = null)`

- API: `/api/azure/bridge/azure/storage/all-storage-account`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-azure-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)

---

<a id="components-general-azure-filters-subscriptionsfiltercomponent-tsx"></a>
## `components/general_azure/filters/SubscriptionsFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `SubscriptionsFilterComponent` `({ subscription, setSubscription }: SubscriptionsFilterComponentProps)`

Interfaz `SubscriptionsFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `subscription` | `string` | no | — |
| `setSubscription` | `Dispatch<SetStateAction<string>>` | no | — |

- API: `/api/azure/bridge/azure/subscriptions/all-subscriptions`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-azure-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)

---

<a id="components-general-azure-filters-subscriptionsfiltercomponentv2-tsx"></a>
## `components/general_azure/filters/SubscriptionsFilterComponentV2.tsx`

**Componente (cliente)**

Exporta:

- componente `SubscriptionsFilterComponentV2` `({ subscription, setSubscription, }: SubscriptionsFilterComponentV2Props)`

Interfaz `SubscriptionsFilterComponentV2Props`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `subscription` | `string` | no | — |
| `setSubscription` | `Dispatch<SetStateAction<string>>` | no | — |

- Tipo interno `ApiSubscription` = `| { id_subscription: string; subscription_name: string } | string`
- API: `/api/azure/bridge/azure/subscriptions/all-subscriptions-ids`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-azure-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)

---

<a id="components-general-azure-filters-tagsfiltercomponent-tsx"></a>
## `components/general_azure/filters/TagsFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `TagsFilterComponent` `({ startDate, endDate, region, subscription, resourceType, selectedKey, selectedValue, localService, setSelectedKey, setSelectedValue, setTagsData, onChange }:…`

Interfaz `TagFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `subscription` | `string` | no | — |
| `resourceType` | `string` | no | — |
| `selectedKey` | `string \| null` | sí | — |
| `selectedValue` | `string \| null` | sí | — |
| `localService` | `string \| null` | sí | — |
| `setSelectedKey` | `Dispatch<SetStateAction<string \| null>>` | no | — |
| `setSelectedValue` | `Dispatch<SetStateAction<string \| null>>` | no | — |
| `setTagsData` | `Dispatch<SetStateAction<unknown[]>>` | sí | — |
| `onChange` | `(next: { key: string \| null; value: string \| null }) => void` | sí | — |

Interfaz `AzureTagItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `Key` | `string` | no | — |
| `Values` | `string[]` | no | — |

- API: `/api/azure/bridge/azure/get-all-tags`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-azure-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)

---

<a id="components-general-azure-filters-trafficmanagerfiltercomponent-tsx"></a>
## `components/general_azure/filters/TrafficManagerFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `TrafficManagerFilterComponent` `({ startDate, endDate, region, subscription, tm, setTm, resourceGroup, isTmFilterMultiselect, selectedTagKey, selectedTagValue }: TrafficManagerFilterComponent…`

Interfaz `TrafficManagerFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `subscription` | `string` | no | — |
| `tm` | `string` | no | — |
| `resourceGroup` | `string` | no | — |
| `setTm` | `Dispatch<SetStateAction<string>>` | no | — |
| `isTmFilterMultiselect` | `boolean` | no | — |
| `selectedTagKey` | `string \| null` | sí | — |
| `selectedTagValue` | `string \| null` | sí | — |

- Tipo interno `ApiTm` = `| { tm_id_lowercase: string; tm_name: string } | string`
- API: `/api/azure/bridge/azure/traffic_managers/all_traffic_managers`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-azure-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)

---

<a id="components-general-azure-filters-unusedappgwfiltercomponent-tsx"></a>
## `components/general_azure/filters/UnusedAppGwFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedAppGwFilterComponent` `({ startDate, endDate, region, subscription, unusedAppGw, resourceGroup, setUnusedAppGw, isUnusedAppGFilterMultiselect, selectedTagKey, selectedTagValue }: Unu…`

Interfaz `UnusedAppGwFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `subscription` | `string` | no | — |
| `unusedAppGw` | `string` | no | — |
| `resourceGroup` | `string` | no | — |
| `setUnusedAppGw` | `Dispatch<SetStateAction<string>>` | no | — |
| `isUnusedAppGFilterMultiselect` | `boolean` | no | — |
| `selectedTagKey` | `string \| null` | sí | — |
| `selectedTagValue` | `string \| null` | sí | — |

- API: `/api/azure/bridge/azure/unused/app-gateways/candidates`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-azure-loadercomponent-tsx), [`unused.ts`](../tipos.md#interfaces-unused-ts)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)

---

<a id="components-general-azure-filters-unusedloadbalancerfiltercomponent-tsx"></a>
## `components/general_azure/filters/UnusedLoadbalancerFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedLoadbalancerFilterComponent` `({ startDate, endDate, region, subscription, unusedLb, setUnusedLb, isUnusedLoadbalancerFilterMultiselect }: UnusedLoadbalancerFilterComponentProps)`

Interfaz `UnusedLoadbalancerFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `subscription` | `string` | no | — |
| `unusedLb` | `string` | no | — |
| `setUnusedLb` | `Dispatch<SetStateAction<string>>` | no | — |
| `isUnusedLoadbalancerFilterMultiselect` | `boolean` | no | — |

- API: `/api/azure/bridge/azure/unused/load-balancers/candidates`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-azure-loadercomponent-tsx), [`unused.ts`](../tipos.md#interfaces-unused-ts)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)

---

<a id="components-general-azure-filters-unusedtrafficmanagerfilter-tsx"></a>
## `components/general_azure/filters/UnusedTrafficManagerFilter.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedTrafficManagerFilter` `({ startDate, endDate, region, subscription, unusedTm, setUnusedTm, resourceGroup, isUnusedTmFilterMultiselect, selectedTagKey, selectedTagValue }: UnusedTraff…`

Interfaz `UnusedTrafficManagerFilterProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `subscription` | `string` | no | — |
| `unusedTm` | `string` | no | — |
| `resourceGroup` | `string` | no | — |
| `setUnusedTm` | `Dispatch<SetStateAction<string>>` | no | — |
| `isUnusedTmFilterMultiselect` | `boolean` | no | — |
| `selectedTagKey` | `string \| null` | sí | — |
| `selectedTagValue` | `string \| null` | sí | — |

- API: `/api/azure/bridge/azure/unused/traffic-managers/candidates`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-azure-loadercomponent-tsx), [`unused.ts`](../tipos.md#interfaces-unused-ts)
- Usado por: [`MainViewUnusedTrafficManagerComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-traffic-managers-mainviewunusedtrafficmanagercomponent-tsx), [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)

---

<a id="components-general-azure-filters-unusedvmfiltercomponent-tsx"></a>
## `components/general_azure/filters/UnusedVmFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedVmFilterComponent` `({ startDate, endDate, region, subscription, unusedVm, setUnusedVm, isUnusedVmFilterMultiselect }: UnusedVmFilterComponentProps)`

Interfaz `UnusedVmFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `subscription` | `string` | no | — |
| `unusedVm` | `string` | no | — |
| `setUnusedVm` | `Dispatch<SetStateAction<string>>` | no | — |
| `isUnusedVmFilterMultiselect` | `boolean` | no | — |

- API: `/api/azure/bridge/azure/unused/vm/candidates`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-azure-loadercomponent-tsx), [`unused.ts`](../tipos.md#interfaces-unused-ts)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)

---

<a id="components-general-azure-filters-unusedvmssfiltercomponent-tsx"></a>
## `components/general_azure/filters/UnusedVmssFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedVmssFilterComponent` `({ startDate, endDate, region, subscription, unusedVmss, setUnusedVmss, isUnusedVmssFilterMultiselect }: UnusedVmssFilterComponentProps)`

Interfaz `UnusedVmssFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `subscription` | `string` | no | — |
| `unusedVmss` | `string` | no | — |
| `setUnusedVmss` | `Dispatch<SetStateAction<string>>` | no | — |
| `isUnusedVmssFilterMultiselect` | `boolean` | no | — |

- API: `/api/azure/bridge/azure/unused/vmss/candidates`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-azure-loadercomponent-tsx), [`unused.ts`](../tipos.md#interfaces-unused-ts)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)

---

<a id="components-general-azure-filters-vmfiltercomponent-tsx"></a>
## `components/general_azure/filters/VmFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `VmFilterComponent` `({ startDate, endDate, region, subscription, vm, setVm, isVmFilterMultiselect }: VmFilterComponentProps)`

Interfaz `VmFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `subscription` | `string` | no | — |
| `vm` | `string` | no | — |
| `setVm` | `Dispatch<SetStateAction<string>>` | no | — |
| `isVmFilterMultiselect` | `boolean` | no | — |

- Tipo interno `ApiVm` = `| { vm_id_lowercase: string; vm_name: string } | string`
- API: `/api/azure/bridge/azure/vms/all_vms`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-azure-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-azure-filters-filterscomponent-tsx)

