# Componentes `components/microsoft-foundry/`

[← Índice](../README.md)

Azure AI Foundry: comparación de costo con modelos equivalentes, optimización de costos y de prompts.

Archivos:

- [`components/microsoft-foundry/comparacion/AFComparisonComponent.tsx`](#components-microsoft-foundry-comparacion-afcomparisoncomponent-tsx)
- [`components/microsoft-foundry/comparacion/MainViewAFComparisonComponent.tsx`](#components-microsoft-foundry-comparacion-mainviewafcomparisoncomponent-tsx)
- [`components/microsoft-foundry/comparacion/info/AFComparisonCandidateConfidenceComponent.tsx`](#components-microsoft-foundry-comparacion-info-afcomparisoncandidateconfidencecomponent-tsx)
- [`components/microsoft-foundry/comparacion/info/AFComparisonCardsComponent.tsx`](#components-microsoft-foundry-comparacion-info-afcomparisoncardscomponent-tsx)
- [`components/microsoft-foundry/comparacion/info/AFComparisonCostBridgeComponent.tsx`](#components-microsoft-foundry-comparacion-info-afcomparisoncostbridgecomponent-tsx)
- [`components/microsoft-foundry/comparacion/info/AFComparisonModelPanelsComponent.tsx`](#components-microsoft-foundry-comparacion-info-afcomparisonmodelpanelscomponent-tsx)
- [`components/microsoft-foundry/comparacion/info/AFComparisonTokenMixComponent.tsx`](#components-microsoft-foundry-comparacion-info-afcomparisontokenmixcomponent-tsx)
- [`components/microsoft-foundry/comparacion/info/AFComparisonViewComponent.tsx`](#components-microsoft-foundry-comparacion-info-afcomparisonviewcomponent-tsx)
- [`components/microsoft-foundry/comparacion/table/AFComparisonDeploymentsColumns.tsx`](#components-microsoft-foundry-comparacion-table-afcomparisondeploymentscolumns-tsx)
- [`components/microsoft-foundry/comparacion/table/AFComparisonDeploymentsTableComponent.tsx`](#components-microsoft-foundry-comparacion-table-afcomparisondeploymentstablecomponent-tsx)
- [`components/microsoft-foundry/costo-optimizacion/MainViewCostOptimizationComponent.tsx`](#components-microsoft-foundry-costo-optimizacion-mainviewcostoptimizationcomponent-tsx)
- [`components/microsoft-foundry/costo-optimizacion/foundation-models/COAzureFoundryComponent.tsx`](#components-microsoft-foundry-costo-optimizacion-foundation-models-coazurefoundrycomponent-tsx)
- [`components/microsoft-foundry/costo-optimizacion/foundation-models/MainViewCOAzureFoundryComponent.tsx`](#components-microsoft-foundry-costo-optimizacion-foundation-models-mainviewcoazurefoundrycomponent-tsx)
- [`components/microsoft-foundry/costo-optimizacion/foundation-models/info/COFoundationCardsComponent.tsx`](#components-microsoft-foundry-costo-optimizacion-foundation-models-info-cofoundationcardscomponent-tsx)
- [`components/microsoft-foundry/prompt-opt/FMPromptOptComponent.tsx`](#components-microsoft-foundry-prompt-opt-fmpromptoptcomponent-tsx)
- [`components/microsoft-foundry/prompt-opt/MainViewFMPromptOptComponent.tsx`](#components-microsoft-foundry-prompt-opt-mainviewfmpromptoptcomponent-tsx)
- [`components/microsoft-foundry/prompt-opt/info/FMPromptOptCardsComponent.tsx`](#components-microsoft-foundry-prompt-opt-info-fmpromptoptcardscomponent-tsx)
- [`components/microsoft-foundry/prompt-opt/info/FMPromptOptComparisonComponent.tsx`](#components-microsoft-foundry-prompt-opt-info-fmpromptoptcomparisoncomponent-tsx)
- [`components/microsoft-foundry/prompt-opt/info/FMPromptOptFiltersComponent.tsx`](#components-microsoft-foundry-prompt-opt-info-fmpromptoptfilterscomponent-tsx)
- [`components/microsoft-foundry/prompt-opt/info/FMPromptOptInputComponent.tsx`](#components-microsoft-foundry-prompt-opt-info-fmpromptoptinputcomponent-tsx)
- [`components/microsoft-foundry/prompt-opt/info/FMPromptOptPanelComponent.tsx`](#components-microsoft-foundry-prompt-opt-info-fmpromptoptpanelcomponent-tsx)
- [`components/microsoft-foundry/prompt-opt/info/FMPromptOptTargetComponent.tsx`](#components-microsoft-foundry-prompt-opt-info-fmpromptopttargetcomponent-tsx)
- [`components/microsoft-foundry/prompt-opt/info/FMPromptOptTokensComponent.tsx`](#components-microsoft-foundry-prompt-opt-info-fmpromptopttokenscomponent-tsx)

<a id="components-microsoft-foundry-comparacion-afcomparisoncomponent-tsx"></a>
## `components/microsoft-foundry/comparacion/AFComparisonComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AzureFoundryComparisonComponent` `({ startDate, endDate, selectedInstance }: AzureFoundryComparisonComponent)`

Interfaz `AzureFoundryComparisonComponent`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `selectedInstance` | `string \| null` | sí | — |

- API: `/api/azure/bridge/azure/foundry/comparison/get_azure_bedrock_comparison`
- Hooks: `useSWR`
- Usa: [`azureFoundryInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-azurefoundryinterfaces-ts), [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`MessageCards.tsx`](azure/cards.md#components-azure-cards-messagecards-tsx), [`LoaderComponent.tsx`](general_azure.md#components-general-azure-loadercomponent-tsx), [`AFComparisonViewComponent.tsx`](#components-microsoft-foundry-comparacion-info-afcomparisonviewcomponent-tsx)
- Usado por: [`MainViewAFComparisonComponent.tsx`](#components-microsoft-foundry-comparacion-mainviewafcomparisoncomponent-tsx)

---

<a id="components-microsoft-foundry-comparacion-mainviewafcomparisoncomponent-tsx"></a>
## `components/microsoft-foundry/comparacion/MainViewAFComparisonComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewComparisonComponent` `()`

- Usa: [`FiltersComponent.tsx`](general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`AFComparisonComponent.tsx`](#components-microsoft-foundry-comparacion-afcomparisoncomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-dashboards-ia-microsoft-foundry-comparacion-page-tsx)

---

<a id="components-microsoft-foundry-comparacion-info-afcomparisoncandidateconfidencecomponent-tsx"></a>
## `components/microsoft-foundry/comparacion/info/AFComparisonCandidateConfidenceComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AzureFoundryCandidateConfidenceComponent` `({ data, provider }: AzureFoundryCandidateConfidenceComponentProps)`

Interfaz `AzureFoundryCandidateConfidenceComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AzureFoundryModel[]` | no | — |
| `provider` | `AzureFoundryProviderKey` | no | — |

Interfaz `CandidateGroup`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `azure_model_name` | `string` | no | — |
| `rows` | `AzureFoundryCandidateConfidenceRow[]` | no | — |

Internos:

- constante `CONFIDENCE_METER_COLOR`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`azureFoundryInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-azurefoundryinterfaces-ts), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts)
- Usado por: [`AFComparisonViewComponent.tsx`](#components-microsoft-foundry-comparacion-info-afcomparisonviewcomponent-tsx)

---

<a id="components-microsoft-foundry-comparacion-info-afcomparisoncardscomponent-tsx"></a>
## `components/microsoft-foundry/comparacion/info/AFComparisonCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AzureFoundrySummaryCards` `({ data, provider }: AzureFoundrySummaryCardsProps)`

Interfaz `AzureFoundrySummaryCardsProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AzureFoundryComparison` | no | — |
| `provider` | `AzureFoundryProviderKey` | no | — |

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`azureFoundryInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-azurefoundryinterfaces-ts), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts)
- Usado por: [`AFComparisonViewComponent.tsx`](#components-microsoft-foundry-comparacion-info-afcomparisonviewcomponent-tsx)

---

<a id="components-microsoft-foundry-comparacion-info-afcomparisoncostbridgecomponent-tsx"></a>
## `components/microsoft-foundry/comparacion/info/AFComparisonCostBridgeComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AzureFoundryCostBridgeComponent` `({ data, provider }: AzureFoundryCostBridgeComponentProps)`

Interfaz `AzureFoundryCostBridgeComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AzureFoundryModel[]` | no | — |
| `provider` | `AzureFoundryProviderKey` | no | — |

Internos:

- constante `MIN_SPAN`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`azureFoundryInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-azurefoundryinterfaces-ts), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts)
- Usado por: [`AFComparisonViewComponent.tsx`](#components-microsoft-foundry-comparacion-info-afcomparisonviewcomponent-tsx)

---

<a id="components-microsoft-foundry-comparacion-info-afcomparisonmodelpanelscomponent-tsx"></a>
## `components/microsoft-foundry/comparacion/info/AFComparisonModelPanelsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AzureFoundryModelPanelsComponent` `({ data, provider }: AzureFoundryModelPanelsComponentProps)`

Interfaz `AzureFoundryModelPanelsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AzureFoundryModel[]` | no | — |
| `provider` | `AzureFoundryProviderKey` | no | — |

Internos:

- función `buildLadder` `(model: AzureFoundryModel, recommended: AzureFoundryModel['bedrock']['candidates'][number] | undefined): AzureFoundryDi…`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`azureFoundryInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-azurefoundryinterfaces-ts), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts)
- Usado por: [`AFComparisonViewComponent.tsx`](#components-microsoft-foundry-comparacion-info-afcomparisonviewcomponent-tsx)

---

<a id="components-microsoft-foundry-comparacion-info-afcomparisontokenmixcomponent-tsx"></a>
## `components/microsoft-foundry/comparacion/info/AFComparisonTokenMixComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AzureFoundryTokenMixComponent` `({ data }: AzureFoundryTokenMixComponentProps)`

Interfaz `AzureFoundryTokenMixComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AzureFoundryModel[]` | no | — |

Interfaz `MixRow`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `model` | `string` | no | — |
| `values` | `Record<MixDimension, { tokens: number; cost: number }>` | no | — |
| `totalTokens` | `number` | no | — |
| `totalCost` | `number` | no | — |

- Tipo interno `MixDimension` = `'input' | 'cache_read' | 'cache_write' | 'output'`
- Tipo interno `MixMetric` = `'tokens' | 'cost'`
Internos:

- constante `DIMENSIONS`
- constante `DIMENSION_COLOR`
- constante `DIMENSION_SWATCH`
- constante `INSIGHT_THRESHOLD`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`azureFoundryInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-azurefoundryinterfaces-ts), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts)
- Usado por: [`AFComparisonViewComponent.tsx`](#components-microsoft-foundry-comparacion-info-afcomparisonviewcomponent-tsx)

---

<a id="components-microsoft-foundry-comparacion-info-afcomparisonviewcomponent-tsx"></a>
## `components/microsoft-foundry/comparacion/info/AFComparisonViewComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AzureFoundryComparisonView` `({ data }: AzureFoundryComparisonViewProps)`

Interfaz `AzureFoundryComparisonViewProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AzureFoundryComparison \| AzureFoundryComparisonResponse \| null \| unde…` | no | — |

Interfaz `ChapterHeaderProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `step` | `number` | no | — |
| `eyebrow` | `string` | no | — |
| `question` | `string` | no | — |
| `sub` | `string` | no | — |

Internos:

- componente `ChapterHeader` `({ step, eyebrow, question, sub }: ChapterHeaderProps)`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`MessageCards.tsx`](azure/cards.md#components-azure-cards-messagecards-tsx), [`azureFoundryInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-azurefoundryinterfaces-ts), [`AFComparisonCardsComponent.tsx`](#components-microsoft-foundry-comparacion-info-afcomparisoncardscomponent-tsx), [`AFComparisonCostBridgeComponent.tsx`](#components-microsoft-foundry-comparacion-info-afcomparisoncostbridgecomponent-tsx), [`AFComparisonTokenMixComponent.tsx`](#components-microsoft-foundry-comparacion-info-afcomparisontokenmixcomponent-tsx), [`AFComparisonModelPanelsComponent.tsx`](#components-microsoft-foundry-comparacion-info-afcomparisonmodelpanelscomponent-tsx), [`AFComparisonCandidateConfidenceComponent.tsx`](#components-microsoft-foundry-comparacion-info-afcomparisoncandidateconfidencecomponent-tsx), [`AFComparisonDeploymentsTableComponent.tsx`](#components-microsoft-foundry-comparacion-table-afcomparisondeploymentstablecomponent-tsx), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts)
- Usado por: [`AFComparisonComponent.tsx`](#components-microsoft-foundry-comparacion-afcomparisoncomponent-tsx)

---

<a id="components-microsoft-foundry-comparacion-table-afcomparisondeploymentscolumns-tsx"></a>
## `components/microsoft-foundry/comparacion/table/AFComparisonDeploymentsColumns.tsx`

**Módulo (cliente)**

Exporta:

- función `getAzureFoundryDeploymentsColumns` `(): DynamicColumn<AzureFoundryDeploymentRow>[]`

- Usa: [`columns.tsx`](data-table.md#components-data-table-columns-tsx), [`azureFoundryInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-azurefoundryinterfaces-ts), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts), [`utils.ts`](../lib.md#lib-utils-ts)
- Usado por: [`AFComparisonDeploymentsTableComponent.tsx`](#components-microsoft-foundry-comparacion-table-afcomparisondeploymentstablecomponent-tsx)

---

<a id="components-microsoft-foundry-comparacion-table-afcomparisondeploymentstablecomponent-tsx"></a>
## `components/microsoft-foundry/comparacion/table/AFComparisonDeploymentsTableComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AzureFoundryDeploymentsTableComponent` `({ data }: AzureFoundryDeploymentsTableComponentProps)`

Interfaz `AzureFoundryDeploymentsTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AzureFoundryModel[]` | no | — |

Internos:

- componente `TableLegend` `()`

- Usa: [`columns.tsx`](data-table.md#components-data-table-columns-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`data-table-grouping.tsx`](data-table.md#components-data-table-data-table-grouping-tsx), [`azureFoundryInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-azurefoundryinterfaces-ts), [`AFComparisonDeploymentsColumns.tsx`](#components-microsoft-foundry-comparacion-table-afcomparisondeploymentscolumns-tsx)
- Usado por: [`AFComparisonViewComponent.tsx`](#components-microsoft-foundry-comparacion-info-afcomparisonviewcomponent-tsx)

---

<a id="components-microsoft-foundry-costo-optimizacion-mainviewcostoptimizationcomponent-tsx"></a>
## `components/microsoft-foundry/costo-optimizacion/MainViewCostOptimizationComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewCostOptimizationFoundryComponent` `()`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts)
- Usado por: [`page.tsx`](../rutas.md#app-dashboards-ia-microsoft-foundry-costo-optimizacion-page-tsx)

---

<a id="components-microsoft-foundry-costo-optimizacion-foundation-models-coazurefoundrycomponent-tsx"></a>
## `components/microsoft-foundry/costo-optimizacion/foundation-models/COAzureFoundryComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AzureFoundryComponent` `({ startDate, endDate, selectedInstance, region }: AzureFoundryComponentProps)`

Interfaz `AzureFoundryComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `selectedInstance` | `string \| null` | sí | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`

- API: `/api/azure/bridge/azure/foundry/azure_get_model_price_rate`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`COFoundationCardsComponent.tsx`](#components-microsoft-foundry-costo-optimizacion-foundation-models-info-cofoundationcardscomponent-tsx), [`MessageCards.tsx`](aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx), [`foundationModels.ts`](../tipos.md#interfaces-foundry-cost-optimization-foundationmodels-ts)
- Usado por: [`MainViewCOAzureFoundryComponent.tsx`](#components-microsoft-foundry-costo-optimizacion-foundation-models-mainviewcoazurefoundrycomponent-tsx)

---

<a id="components-microsoft-foundry-costo-optimizacion-foundation-models-mainviewcoazurefoundrycomponent-tsx"></a>
## `components/microsoft-foundry/costo-optimizacion/foundation-models/MainViewCOAzureFoundryComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewAzureFoundryComponent` `()`

- Usa: [`FiltersComponent.tsx`](general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`COAzureFoundryComponent.tsx`](#components-microsoft-foundry-costo-optimizacion-foundation-models-coazurefoundrycomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-dashboards-ia-microsoft-foundry-costo-optimizacion-foundation-models-page-tsx)

---

<a id="components-microsoft-foundry-costo-optimizacion-foundation-models-info-cofoundationcardscomponent-tsx"></a>
## `components/microsoft-foundry/costo-optimizacion/foundation-models/info/COFoundationCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AzureFoundryCardsComponent` `({ data, }: { data: AzureModelCost[]; })`

Interfaz `DetailedRateUI`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `key` | `string` | no | — |
| `label` | `string` | no | — |
| `meterName` | `string` | no | — |
| `rateLabel` | `string` | no | — |
| `cost` | `string` | no | — |

- Tipo interno `ComparisonSortOption` = `"savings" | "confidence" | "balanced"`
Internos:

- constante `comparisonSortOptions`
- función `formatCost` `(value: number | undefined | null)`
- función `formatRate` `(rateObj: RateObject | undefined | null)`
- constante `tokenFormatter`
- constante `percentFormatter`
- función `formatMeterTokens` `(quantity: number, unit: string)`
- constante `rateLabels`
- constante `detailedLabels`
- función `getMeterFriendlyName` `(meterName: string, metricType: string)`
- función `renderMeterItem` `(meter: MeterDetail, idx: number)`
- constante `confidenceFormatter`
- función `getConfidenceScore` `(similarity: PriceComparison["model_similarity"])`
- componente `ModelConfidence` `({ similarity, modelName, }: { similarity: PriceComparison["model_similarity"]; modelName: string; })`
- componente `AzureModelCard` `({ azureModel, }: { azureModel: AzureModelCost; })`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`badge.tsx`](ui.md#components-ui-badge-tsx), [`select.tsx`](ui.md#components-ui-select-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`collapsible.tsx`](ui.md#components-ui-collapsible-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`foundationModels.ts`](../tipos.md#interfaces-foundry-cost-optimization-foundationmodels-ts)
- Usado por: [`COAzureFoundryComponent.tsx`](#components-microsoft-foundry-costo-optimizacion-foundation-models-coazurefoundrycomponent-tsx)

---

<a id="components-microsoft-foundry-prompt-opt-fmpromptoptcomponent-tsx"></a>
## `components/microsoft-foundry/prompt-opt/FMPromptOptComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `FMPromptOptComponent` `()`

Interfaz `AppliedSettings`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `model` | `string` | no | — |
| `target` | `PromptOptimizationTarget` | no | — |
| `rate` | `number` | no | — |
| `maxTokens` | `number \| null` | no | — |
| `useContextLevelFilter` | `boolean` | no | — |
| `useTokenLevelFilter` | `boolean` | no | — |

Internos:

- constante `OPTIMIZE_PROMPT_URL`
- constante `DEFAULT_ERROR_MESSAGE`
- función `optimizePromptFetcher` `(url: string, { arg }: { arg: PromptOptimizationRequest }): Promise<PromptOptimizationResponse>`

- API: `/api/azure/bridge/azure/foundry/prompt_optimization/optimize_prompt`
- Hooks: `useSWRMutation`
- Usa: [`MessageCards.tsx`](azure/cards.md#components-azure-cards-messagecards-tsx), [`LoaderComponent.tsx`](general_azure.md#components-general-azure-loadercomponent-tsx), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts), [`FMPromptOptInputComponent.tsx`](#components-microsoft-foundry-prompt-opt-info-fmpromptoptinputcomponent-tsx), [`FMPromptOptComparisonComponent.tsx`](#components-microsoft-foundry-prompt-opt-info-fmpromptoptcomparisoncomponent-tsx), [`FMPromptOptTargetComponent.tsx`](#components-microsoft-foundry-prompt-opt-info-fmpromptopttargetcomponent-tsx), [`promptOptimizationInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-promptoptimizationinterfaces-ts)
- Usado por: [`MainViewFMPromptOptComponent.tsx`](#components-microsoft-foundry-prompt-opt-mainviewfmpromptoptcomponent-tsx)

---

<a id="components-microsoft-foundry-prompt-opt-mainviewfmpromptoptcomponent-tsx"></a>
## `components/microsoft-foundry/prompt-opt/MainViewFMPromptOptComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewFMPromptOptComponent` `()`

- Usa: [`FMPromptOptComponent.tsx`](#components-microsoft-foundry-prompt-opt-fmpromptoptcomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-dashboards-ia-microsoft-foundry-prompt-opt-page-tsx)

---

<a id="components-microsoft-foundry-prompt-opt-info-fmpromptoptcardscomponent-tsx"></a>
## `components/microsoft-foundry/prompt-opt/info/FMPromptOptCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `FMPromptOptCardsComponent` `({ data }: FMPromptOptCardsComponentProps)`

Interfaz `FMPromptOptCardsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `PromptOptimizationResponse` | no | — |

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts), [`promptOptimizationInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-promptoptimizationinterfaces-ts)
- Usado por: [`FMPromptOptComparisonComponent.tsx`](#components-microsoft-foundry-prompt-opt-info-fmpromptoptcomparisoncomponent-tsx)

---

<a id="components-microsoft-foundry-prompt-opt-info-fmpromptoptcomparisoncomponent-tsx"></a>
## `components/microsoft-foundry/prompt-opt/info/FMPromptOptComparisonComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `FMPromptOptComparisonComponent` `({ data }: FMPromptOptComparisonComponentProps)`

Interfaz `FMPromptOptComparisonComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `PromptOptimizationResponse \| null \| undefined` | no | — |

Internos:

- constante `viewModeLabels`

- Usa: [`button.tsx`](ui.md#components-ui-button-tsx), [`MessageCards.tsx`](azure/cards.md#components-azure-cards-messagecards-tsx), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts), [`FMPromptOptCardsComponent.tsx`](#components-microsoft-foundry-prompt-opt-info-fmpromptoptcardscomponent-tsx), [`FMPromptOptPanelComponent.tsx`](#components-microsoft-foundry-prompt-opt-info-fmpromptoptpanelcomponent-tsx), [`promptOptimizationInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-promptoptimizationinterfaces-ts)
- Usado por: [`FMPromptOptComponent.tsx`](#components-microsoft-foundry-prompt-opt-fmpromptoptcomponent-tsx)

---

<a id="components-microsoft-foundry-prompt-opt-info-fmpromptoptfilterscomponent-tsx"></a>
## `components/microsoft-foundry/prompt-opt/info/FMPromptOptFiltersComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `FMPromptOptFiltersComponent` `({ useContextLevelFilter, onUseContextLevelFilterChange, useTokenLevelFilter, onUseTokenLevelFilterChange, disabled }: FMPromptOptFiltersComponentProps)`

Interfaz `FMPromptOptFiltersComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `useContextLevelFilter` | `boolean` | no | — |
| `onUseContextLevelFilterChange` | `(value: boolean) => void` | no | — |
| `useTokenLevelFilter` | `boolean` | no | — |
| `onUseTokenLevelFilterChange` | `(value: boolean) => void` | no | — |
| `disabled` | `boolean` | no | — |

- Usa: [`label.tsx`](ui.md#components-ui-label-tsx), [`switch.tsx`](ui.md#components-ui-switch-tsx)
- Usado por: [`FMPromptOptInputComponent.tsx`](#components-microsoft-foundry-prompt-opt-info-fmpromptoptinputcomponent-tsx)

---

<a id="components-microsoft-foundry-prompt-opt-info-fmpromptoptinputcomponent-tsx"></a>
## `components/microsoft-foundry/prompt-opt/info/FMPromptOptInputComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `FMPromptOptInputComponent` `({ prompt, setPrompt, foundryModel, setFoundryModel, target, setTarget, rate, setRate, maxTokens, setMaxTokens, useContextLevelFilter, onUseContextLevelFilterC…`

Interfaz `FMPromptOptInputComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `prompt` | `string` | no | — |
| `setPrompt` | `Dispatch<SetStateAction<string>>` | no | — |
| `foundryModel` | `string` | no | — |
| `setFoundryModel` | `Dispatch<SetStateAction<string>>` | no | — |
| `target` | `PromptOptimizationTarget` | no | — |
| `setTarget` | `Dispatch<SetStateAction<PromptOptimizationTarget>>` | no | — |
| `rate` | `number` | no | — |
| `setRate` | `Dispatch<SetStateAction<number>>` | no | — |
| `maxTokens` | `string` | no | — |
| `setMaxTokens` | `Dispatch<SetStateAction<string>>` | no | — |
| `useContextLevelFilter` | `boolean` | no | — |
| `onUseContextLevelFilterChange` | `(value: boolean) => void` | no | — |
| `useTokenLevelFilter` | `boolean` | no | — |
| `onUseTokenLevelFilterChange` | `(value: boolean) => void` | no | — |
| `isTargetReady` | `boolean` | no | — |
| `onOptimize` | `() => void` | no | — |
| `onClear` | `() => void` | no | — |
| `isOptimizing` | `boolean` | no | — |

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`label.tsx`](ui.md#components-ui-label-tsx), [`textarea.tsx`](ui.md#components-ui-textarea-tsx), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts), [`FoundryModelsFilterComponent.tsx`](general_azure.md#components-general-azure-filters-foundrymodelsfiltercomponent-tsx), [`FMPromptOptTargetComponent.tsx`](#components-microsoft-foundry-prompt-opt-info-fmpromptopttargetcomponent-tsx), [`FMPromptOptFiltersComponent.tsx`](#components-microsoft-foundry-prompt-opt-info-fmpromptoptfilterscomponent-tsx), [`promptOptimizationInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-promptoptimizationinterfaces-ts)
- Usado por: [`FMPromptOptComponent.tsx`](#components-microsoft-foundry-prompt-opt-fmpromptoptcomponent-tsx)

---

<a id="components-microsoft-foundry-prompt-opt-info-fmpromptoptpanelcomponent-tsx"></a>
## `components/microsoft-foundry/prompt-opt/info/FMPromptOptPanelComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `FMPromptOptPanelComponent` `({ side, label, hint, breakdown, viewMode, emptyMessage }: FMPromptOptPanelComponentProps)`

Interfaz `FMPromptOptPanelComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `side` | `PromptOptimizationSide` | no | — |
| `label` | `string` | no | — |
| `hint` | `string` | no | — |
| `breakdown` | `PromptOptimizationBreakdown` | no | — |
| `viewMode` | `PromptOptimizationViewMode` | no | — |
| `emptyMessage` | `string` | no | — |

Internos:

- constante `sideStyles`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts), [`FMPromptOptTokensComponent.tsx`](#components-microsoft-foundry-prompt-opt-info-fmpromptopttokenscomponent-tsx), [`promptOptimizationInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-promptoptimizationinterfaces-ts)
- Usado por: [`FMPromptOptComparisonComponent.tsx`](#components-microsoft-foundry-prompt-opt-info-fmpromptoptcomparisoncomponent-tsx)

---

<a id="components-microsoft-foundry-prompt-opt-info-fmpromptopttargetcomponent-tsx"></a>
## `components/microsoft-foundry/prompt-opt/info/FMPromptOptTargetComponent.tsx`

**Componente (cliente)**

Exporta:

- constante `PROMPT_OPT_RATE_MIN` = `5`
- constante `PROMPT_OPT_RATE_MAX` = `95`
- constante `PROMPT_OPT_RATE_STEP` = `5`
- constante `PROMPT_OPT_DEFAULT_RATE` = `50`
- componente `FMPromptOptTargetComponent` `({ target, setTarget, rate, setRate, maxTokens, setMaxTokens, disabled }: FMPromptOptTargetComponentProps)`

Interfaz `FMPromptOptTargetComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `target` | `PromptOptimizationTarget` | no | — |
| `setTarget` | `Dispatch<SetStateAction<PromptOptimizationTarget>>` | no | — |
| `rate` | `number` | no | — |
| `setRate` | `Dispatch<SetStateAction<number>>` | no | — |
| `maxTokens` | `string` | no | — |
| `setMaxTokens` | `Dispatch<SetStateAction<string>>` | no | — |
| `disabled` | `boolean` | no | — |

- Usa: [`input.tsx`](ui.md#components-ui-input-tsx), [`label.tsx`](ui.md#components-ui-label-tsx), [`slider.tsx`](ui.md#components-ui-slider-tsx), [`select.tsx`](ui.md#components-ui-select-tsx), [`promptOptimizationInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-promptoptimizationinterfaces-ts)
- Usado por: [`FMPromptOptComponent.tsx`](#components-microsoft-foundry-prompt-opt-fmpromptoptcomponent-tsx), [`FMPromptOptInputComponent.tsx`](#components-microsoft-foundry-prompt-opt-info-fmpromptoptinputcomponent-tsx)

---

<a id="components-microsoft-foundry-prompt-opt-info-fmpromptopttokenscomponent-tsx"></a>
## `components/microsoft-foundry/prompt-opt/info/FMPromptOptTokensComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `FMPromptOptTokensComponent` `({ tokens, viewMode, emptyMessage, originalText }: FMPromptOptTokensComponentProps)`

Interfaz `FMPromptOptTokensComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `tokens` | `PromptOptimizationToken[]` | sí | — |
| `originalText` | `string` | sí | — |
| `viewMode` | `PromptOptimizationViewMode` | no | — |
| `emptyMessage` | `string` | no | — |

Internos:

- constante `TOKEN_PALETTE`
- constante `TOKENS_PER_PAGE` — Un prompt grande puede superar los 100k tokens y pintar un span por token congela el navegador, así que se renderiza por tramos y el usuario decide cuánto más mostrar.
- constante `CHARS_PER_PAGE`

- Usa: [`button.tsx`](ui.md#components-ui-button-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts), [`promptOptimizationInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-promptoptimizationinterfaces-ts)
- Usado por: [`FMPromptOptPanelComponent.tsx`](#components-microsoft-foundry-prompt-opt-info-fmpromptoptpanelcomponent-tsx)

