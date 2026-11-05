# Componentes `components/google-vertex/`

[← Índice](../README.md)

Vertex AI: comparación de costo con modelos equivalentes, optimización de costos y de prompts.

Archivos:

- [`components/google-vertex/comparacion/GcpVertexComparisonComponent.tsx`](#components-google-vertex-comparacion-gcpvertexcomparisoncomponent-tsx)
- [`components/google-vertex/comparacion/MainViewGcpVertexComparisonComponent.tsx`](#components-google-vertex-comparacion-mainviewgcpvertexcomparisoncomponent-tsx)
- [`components/google-vertex/comparacion/info/GcpVertexComparisonCandidateConfidenceComponent.tsx`](#components-google-vertex-comparacion-info-gcpvertexcomparisoncandidateconfidencecomponent-tsx)
- [`components/google-vertex/comparacion/info/GcpVertexComparisonCardsComponent.tsx`](#components-google-vertex-comparacion-info-gcpvertexcomparisoncardscomponent-tsx)
- [`components/google-vertex/comparacion/info/GcpVertexComparisonCostBridgeComponent.tsx`](#components-google-vertex-comparacion-info-gcpvertexcomparisoncostbridgecomponent-tsx)
- [`components/google-vertex/comparacion/info/GcpVertexComparisonModelPanelsComponent.tsx`](#components-google-vertex-comparacion-info-gcpvertexcomparisonmodelpanelscomponent-tsx)
- [`components/google-vertex/comparacion/info/GcpVertexComparisonTokenMixComponent.tsx`](#components-google-vertex-comparacion-info-gcpvertexcomparisontokenmixcomponent-tsx)
- [`components/google-vertex/comparacion/info/GcpVertexComparisonViewComponent.tsx`](#components-google-vertex-comparacion-info-gcpvertexcomparisonviewcomponent-tsx)
- [`components/google-vertex/comparacion/table/GcpVertexComparisonEndpointsColumns.tsx`](#components-google-vertex-comparacion-table-gcpvertexcomparisonendpointscolumns-tsx)
- [`components/google-vertex/comparacion/table/GcpVertexComparisonEndpointsTableComponent.tsx`](#components-google-vertex-comparacion-table-gcpvertexcomparisonendpointstablecomponent-tsx)
- [`components/google-vertex/costo-optimizacion/MainViewCostOptimizationGcpVertexComponent.tsx`](#components-google-vertex-costo-optimizacion-mainviewcostoptimizationgcpvertexcomponent-tsx)
- [`components/google-vertex/costo-optimizacion/vertex-models/COGcpVertexComponent.tsx`](#components-google-vertex-costo-optimizacion-vertex-models-cogcpvertexcomponent-tsx)
- [`components/google-vertex/costo-optimizacion/vertex-models/MainViewCOGcpVertexComponent.tsx`](#components-google-vertex-costo-optimizacion-vertex-models-mainviewcogcpvertexcomponent-tsx)
- [`components/google-vertex/costo-optimizacion/vertex-models/info/COGcpVertexCardsComponent.tsx`](#components-google-vertex-costo-optimizacion-vertex-models-info-cogcpvertexcardscomponent-tsx)
- [`components/google-vertex/prompt-opt/MainViewVXPromptOptComponent.tsx`](#components-google-vertex-prompt-opt-mainviewvxpromptoptcomponent-tsx)
- [`components/google-vertex/prompt-opt/VXPromptOptComponent.tsx`](#components-google-vertex-prompt-opt-vxpromptoptcomponent-tsx)
- [`components/google-vertex/prompt-opt/info/VXPromptOptCardsComponent.tsx`](#components-google-vertex-prompt-opt-info-vxpromptoptcardscomponent-tsx)
- [`components/google-vertex/prompt-opt/info/VXPromptOptComparisonComponent.tsx`](#components-google-vertex-prompt-opt-info-vxpromptoptcomparisoncomponent-tsx)
- [`components/google-vertex/prompt-opt/info/VXPromptOptFiltersComponent.tsx`](#components-google-vertex-prompt-opt-info-vxpromptoptfilterscomponent-tsx)
- [`components/google-vertex/prompt-opt/info/VXPromptOptInputComponent.tsx`](#components-google-vertex-prompt-opt-info-vxpromptoptinputcomponent-tsx)
- [`components/google-vertex/prompt-opt/info/VXPromptOptPanelComponent.tsx`](#components-google-vertex-prompt-opt-info-vxpromptoptpanelcomponent-tsx)
- [`components/google-vertex/prompt-opt/info/VXPromptOptTargetComponent.tsx`](#components-google-vertex-prompt-opt-info-vxpromptopttargetcomponent-tsx)
- [`components/google-vertex/prompt-opt/info/VXPromptOptTokensComponent.tsx`](#components-google-vertex-prompt-opt-info-vxpromptopttokenscomponent-tsx)

<a id="components-google-vertex-comparacion-gcpvertexcomparisoncomponent-tsx"></a>
## `components/google-vertex/comparacion/GcpVertexComparisonComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `GcpVertexComparisonComponent` `({ startDate, endDate, projects, regions, resourceId }: GcpVertexComparisonComponentProps)`

Interfaz `GcpVertexComparisonComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `projects` | `string` | no | — |
| `regions` | `string` | no | — |
| `resourceId` | `string \| null` | sí | — |

Internos:

- función `formatApiDate` `(date?: Date)`

- API: `/api/gcp/bridge/gcp/vertex/comparison/get_gcp_vertex_comparison`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`MessageCards.tsx`](aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx), [`GcpVertexComparisonViewComponent.tsx`](#components-google-vertex-comparacion-info-gcpvertexcomparisonviewcomponent-tsx), [`gcpVertexComparisonInterfaces.ts`](../tipos.md#interfaces-vertex-comparison-gcpvertexcomparisoninterfaces-ts)
- Usado por: [`MainViewGcpVertexComparisonComponent.tsx`](#components-google-vertex-comparacion-mainviewgcpvertexcomparisoncomponent-tsx)

---

<a id="components-google-vertex-comparacion-mainviewgcpvertexcomparisoncomponent-tsx"></a>
## `components/google-vertex/comparacion/MainViewGcpVertexComparisonComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewGcpVertexComparisonComponent` `()`

- Usa: [`FiltersComponent.tsx`](general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`GcpVertexComparisonComponent.tsx`](#components-google-vertex-comparacion-gcpvertexcomparisoncomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-dashboards-ia-google-vertex-comparacion-page-tsx)

---

<a id="components-google-vertex-comparacion-info-gcpvertexcomparisoncandidateconfidencecomponent-tsx"></a>
## `components/google-vertex/comparacion/info/GcpVertexComparisonCandidateConfidenceComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `GcpVertexCandidateConfidenceComponent` `({ data, provider }: GcpVertexCandidateConfidenceComponentProps)`

Interfaz `GcpVertexCandidateConfidenceComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `GcpVertexModel[]` | no | — |
| `provider` | `GcpVertexProviderKey` | no | — |

Interfaz `CandidateGroup`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `gcp_model_name` | `string` | no | — |
| `rows` | `GcpVertexCandidateConfidenceRow[]` | no | — |

Internos:

- constante `CONFIDENCE_METER_COLOR`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`gcpVertexComparisonInterfaces.ts`](../tipos.md#interfaces-vertex-comparison-gcpvertexcomparisoninterfaces-ts), [`gcpVertexComparisonFormatters.ts`](../lib.md#lib-gcpvertexcomparisonformatters-ts)
- Usado por: [`GcpVertexComparisonViewComponent.tsx`](#components-google-vertex-comparacion-info-gcpvertexcomparisonviewcomponent-tsx)

---

<a id="components-google-vertex-comparacion-info-gcpvertexcomparisoncardscomponent-tsx"></a>
## `components/google-vertex/comparacion/info/GcpVertexComparisonCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `GcpVertexSummaryCards` `({ data, provider }: GcpVertexSummaryCardsProps)`

Interfaz `GcpVertexSummaryCardsProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `GcpVertexComparison` | no | — |
| `provider` | `GcpVertexProviderKey` | no | — |

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`gcpVertexComparisonInterfaces.ts`](../tipos.md#interfaces-vertex-comparison-gcpvertexcomparisoninterfaces-ts), [`gcpVertexComparisonFormatters.ts`](../lib.md#lib-gcpvertexcomparisonformatters-ts)
- Usado por: [`GcpVertexComparisonViewComponent.tsx`](#components-google-vertex-comparacion-info-gcpvertexcomparisonviewcomponent-tsx)

---

<a id="components-google-vertex-comparacion-info-gcpvertexcomparisoncostbridgecomponent-tsx"></a>
## `components/google-vertex/comparacion/info/GcpVertexComparisonCostBridgeComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `GcpVertexCostBridgeComponent` `({ data, provider }: GcpVertexCostBridgeComponentProps)`

Interfaz `GcpVertexCostBridgeComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `GcpVertexModel[]` | no | — |
| `provider` | `GcpVertexProviderKey` | no | — |

Internos:

- constante `MIN_SPAN`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`gcpVertexComparisonInterfaces.ts`](../tipos.md#interfaces-vertex-comparison-gcpvertexcomparisoninterfaces-ts), [`gcpVertexComparisonFormatters.ts`](../lib.md#lib-gcpvertexcomparisonformatters-ts)
- Usado por: [`GcpVertexComparisonViewComponent.tsx`](#components-google-vertex-comparacion-info-gcpvertexcomparisonviewcomponent-tsx)

---

<a id="components-google-vertex-comparacion-info-gcpvertexcomparisonmodelpanelscomponent-tsx"></a>
## `components/google-vertex/comparacion/info/GcpVertexComparisonModelPanelsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `GcpVertexModelPanelsComponent` `({ data, provider }: GcpVertexModelPanelsComponentProps)`

Interfaz `GcpVertexModelPanelsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `GcpVertexModel[]` | no | — |
| `provider` | `GcpVertexProviderKey` | no | — |

Internos:

- función `buildLadder` `(model: GcpVertexModel, recommended: GcpVertexModel['bedrock']['candidates'][number] | undefined): GcpVertexDimensionLa…`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`gcpVertexComparisonInterfaces.ts`](../tipos.md#interfaces-vertex-comparison-gcpvertexcomparisoninterfaces-ts), [`gcpVertexComparisonFormatters.ts`](../lib.md#lib-gcpvertexcomparisonformatters-ts)
- Usado por: [`GcpVertexComparisonViewComponent.tsx`](#components-google-vertex-comparacion-info-gcpvertexcomparisonviewcomponent-tsx)

---

<a id="components-google-vertex-comparacion-info-gcpvertexcomparisontokenmixcomponent-tsx"></a>
## `components/google-vertex/comparacion/info/GcpVertexComparisonTokenMixComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `GcpVertexTokenMixComponent` `({ data }: GcpVertexTokenMixComponentProps)`

Interfaz `GcpVertexTokenMixComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `GcpVertexModel[]` | no | — |

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

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`gcpVertexComparisonInterfaces.ts`](../tipos.md#interfaces-vertex-comparison-gcpvertexcomparisoninterfaces-ts), [`gcpVertexComparisonFormatters.ts`](../lib.md#lib-gcpvertexcomparisonformatters-ts)
- Usado por: [`GcpVertexComparisonViewComponent.tsx`](#components-google-vertex-comparacion-info-gcpvertexcomparisonviewcomponent-tsx)

---

<a id="components-google-vertex-comparacion-info-gcpvertexcomparisonviewcomponent-tsx"></a>
## `components/google-vertex/comparacion/info/GcpVertexComparisonViewComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `GcpVertexComparisonView` `({ data }: GcpVertexComparisonViewProps)`

Interfaz `GcpVertexComparisonViewProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `GcpVertexComparison \| GcpVertexComparisonResponse \| null \| undefined` | no | — |

Interfaz `ChapterHeaderProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `step` | `number` | no | — |
| `eyebrow` | `string` | no | — |
| `question` | `string` | no | — |
| `sub` | `string` | no | — |

Internos:

- componente `ChapterHeader` `({ step, eyebrow, question, sub }: ChapterHeaderProps)`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`MessageCards.tsx`](aws/cards.md#components-aws-cards-messagecards-tsx), [`gcpVertexComparisonInterfaces.ts`](../tipos.md#interfaces-vertex-comparison-gcpvertexcomparisoninterfaces-ts), [`GcpVertexComparisonCardsComponent.tsx`](#components-google-vertex-comparacion-info-gcpvertexcomparisoncardscomponent-tsx), [`GcpVertexComparisonCostBridgeComponent.tsx`](#components-google-vertex-comparacion-info-gcpvertexcomparisoncostbridgecomponent-tsx), [`GcpVertexComparisonTokenMixComponent.tsx`](#components-google-vertex-comparacion-info-gcpvertexcomparisontokenmixcomponent-tsx), [`GcpVertexComparisonModelPanelsComponent.tsx`](#components-google-vertex-comparacion-info-gcpvertexcomparisonmodelpanelscomponent-tsx), [`GcpVertexComparisonCandidateConfidenceComponent.tsx`](#components-google-vertex-comparacion-info-gcpvertexcomparisoncandidateconfidencecomponent-tsx), [`GcpVertexComparisonEndpointsTableComponent.tsx`](#components-google-vertex-comparacion-table-gcpvertexcomparisonendpointstablecomponent-tsx), [`gcpVertexComparisonFormatters.ts`](../lib.md#lib-gcpvertexcomparisonformatters-ts)
- Usado por: [`GcpVertexComparisonComponent.tsx`](#components-google-vertex-comparacion-gcpvertexcomparisoncomponent-tsx)

---

<a id="components-google-vertex-comparacion-table-gcpvertexcomparisonendpointscolumns-tsx"></a>
## `components/google-vertex/comparacion/table/GcpVertexComparisonEndpointsColumns.tsx`

**Módulo (cliente)**

Exporta:

- función `getGcpVertexEndpointsColumns` `(): DynamicColumn<GcpVertexEndpointRow>[]`

- Tipo interno `EndpointCellInfo` = `{ row: { original: GcpVertexEndpointRow; }; }`
Internos:

- función `getEndpoint` `(info: unknown)`

- Usa: [`columns.tsx`](data-table.md#components-data-table-columns-tsx), [`gcpVertexComparisonInterfaces.ts`](../tipos.md#interfaces-vertex-comparison-gcpvertexcomparisoninterfaces-ts), [`gcpVertexComparisonFormatters.ts`](../lib.md#lib-gcpvertexcomparisonformatters-ts), [`utils.ts`](../lib.md#lib-utils-ts)
- Usado por: [`GcpVertexComparisonEndpointsTableComponent.tsx`](#components-google-vertex-comparacion-table-gcpvertexcomparisonendpointstablecomponent-tsx)

---

<a id="components-google-vertex-comparacion-table-gcpvertexcomparisonendpointstablecomponent-tsx"></a>
## `components/google-vertex/comparacion/table/GcpVertexComparisonEndpointsTableComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `GcpVertexEndpointsTableComponent` `({ data }: GcpVertexEndpointsTableComponentProps)`

Interfaz `GcpVertexEndpointsTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `GcpVertexModel[]` | no | — |

Internos:

- componente `TableLegend` `()`

- Usa: [`columns.tsx`](data-table.md#components-data-table-columns-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`data-table-grouping.tsx`](data-table.md#components-data-table-data-table-grouping-tsx), [`gcpVertexComparisonInterfaces.ts`](../tipos.md#interfaces-vertex-comparison-gcpvertexcomparisoninterfaces-ts), [`GcpVertexComparisonEndpointsColumns.tsx`](#components-google-vertex-comparacion-table-gcpvertexcomparisonendpointscolumns-tsx)
- Usado por: [`GcpVertexComparisonViewComponent.tsx`](#components-google-vertex-comparacion-info-gcpvertexcomparisonviewcomponent-tsx)

---

<a id="components-google-vertex-costo-optimizacion-mainviewcostoptimizationgcpvertexcomponent-tsx"></a>
## `components/google-vertex/costo-optimizacion/MainViewCostOptimizationGcpVertexComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewCostOptimizationGcpVertexComponent` `()`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts)
- Usado por: [`page.tsx`](../rutas.md#app-dashboards-ia-google-vertex-costo-optimizacion-page-tsx)

---

<a id="components-google-vertex-costo-optimizacion-vertex-models-cogcpvertexcomponent-tsx"></a>
## `components/google-vertex/costo-optimizacion/vertex-models/COGcpVertexComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `GcpVertexComponent` `({ startDate, endDate, projects, regions, resourceId }: GcpVertexComponentProps)`

Interfaz `GcpVertexComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `projects` | `string` | no | — |
| `regions` | `string` | no | — |
| `resourceId` | `string \| null` | sí | — |

Internos:

- función `formatApiDate` `(date?: Date)`

- API: `/api/gcp/bridge/gcp/vertex/gcp_get_model_price_rate`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`COGcpVertexCardsComponent.tsx`](#components-google-vertex-costo-optimizacion-vertex-models-info-cogcpvertexcardscomponent-tsx), [`MessageCards.tsx`](aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx), [`gcpVertexModels.ts`](../tipos.md#interfaces-vertex-cost-optimization-gcpvertexmodels-ts)
- Usado por: [`MainViewCOGcpVertexComponent.tsx`](#components-google-vertex-costo-optimizacion-vertex-models-mainviewcogcpvertexcomponent-tsx)

---

<a id="components-google-vertex-costo-optimizacion-vertex-models-mainviewcogcpvertexcomponent-tsx"></a>
## `components/google-vertex/costo-optimizacion/vertex-models/MainViewCOGcpVertexComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewGcpVertexComponent` `()`

- Usa: [`FiltersComponent.tsx`](general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`COGcpVertexComponent.tsx`](#components-google-vertex-costo-optimizacion-vertex-models-cogcpvertexcomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-dashboards-ia-google-vertex-costo-optimizacion-vertex-models-page-tsx)

---

<a id="components-google-vertex-costo-optimizacion-vertex-models-info-cogcpvertexcardscomponent-tsx"></a>
## `components/google-vertex/costo-optimizacion/vertex-models/info/COGcpVertexCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `GcpVertexCardsComponent` `({ data }: { data: VertexModelCost[] })`

- Tipo interno `SortOption` = `'savings' | 'confidence' | 'balanced'`
Internos:

- constante `sortOptions`
- constante `tokenFormatter`
- constante `quantityFormatter`
- constante `percentFormatter`
- constante `confidenceFormatter`
- constante `currencyFormatter`
- función `toNumber` `(value: number | undefined | null)`
- función `firstFinite` `(...values: Array<number | undefined | null>)`
- función `formatCost` `(value: number | undefined | null)`
- función `formatSignedCost` `(value: number | undefined | null)`
- función `formatPercent` `(value: number | undefined | null)`
- función `formatQuantity` `(value: number | undefined | null)`
- función `formatRate` `(rate?: VertexRateObject | null)`
- constante `directionLabels`
- constante `stateLabels`
- constante `billingStateLabels`
- función `getBillingState` `(state?: string | null)`
- función `getDeltaTone` `(value: number)`
- función `formatSkuSummary` `(rate?: VertexRateObject | null)`
- función `getConfidenceScore` `(similarity: VertexPriceComparison['model_similarity'])`
- componente `ModelConfidence` `({ similarity, modelName }: { similarity: VertexPriceComparison['model_similarity']; modelName: string })`
- componente `GcpVertexModelCard` `({ vertexModel }: { vertexModel: VertexModelCost })`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`badge.tsx`](ui.md#components-ui-badge-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`select.tsx`](ui.md#components-ui-select-tsx), [`collapsible.tsx`](ui.md#components-ui-collapsible-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`gcpVertexModels.ts`](../tipos.md#interfaces-vertex-cost-optimization-gcpvertexmodels-ts)
- Usado por: [`COGcpVertexComponent.tsx`](#components-google-vertex-costo-optimizacion-vertex-models-cogcpvertexcomponent-tsx)

---

<a id="components-google-vertex-prompt-opt-mainviewvxpromptoptcomponent-tsx"></a>
## `components/google-vertex/prompt-opt/MainViewVXPromptOptComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewVXPromptOptComponent` `()`

- Usa: [`VXPromptOptComponent.tsx`](#components-google-vertex-prompt-opt-vxpromptoptcomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-dashboards-ia-google-vertex-prompt-opt-page-tsx)

---

<a id="components-google-vertex-prompt-opt-vxpromptoptcomponent-tsx"></a>
## `components/google-vertex/prompt-opt/VXPromptOptComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `VXPromptOptComponent` `()`

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

- API: `/api/gcp/bridge/gcp/vertex/prompt_optimization/optimize_prompt`
- Hooks: `useSWRMutation`
- Usa: [`MessageCards.tsx`](azure/cards.md#components-azure-cards-messagecards-tsx), [`LoaderComponent.tsx`](general_azure.md#components-general-azure-loadercomponent-tsx), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts), [`VXPromptOptInputComponent.tsx`](#components-google-vertex-prompt-opt-info-vxpromptoptinputcomponent-tsx), [`VXPromptOptComparisonComponent.tsx`](#components-google-vertex-prompt-opt-info-vxpromptoptcomparisoncomponent-tsx), [`VXPromptOptTargetComponent.tsx`](#components-google-vertex-prompt-opt-info-vxpromptopttargetcomponent-tsx), [`promptOptimizationInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-promptoptimizationinterfaces-ts)
- Usado por: [`MainViewVXPromptOptComponent.tsx`](#components-google-vertex-prompt-opt-mainviewvxpromptoptcomponent-tsx)

---

<a id="components-google-vertex-prompt-opt-info-vxpromptoptcardscomponent-tsx"></a>
## `components/google-vertex/prompt-opt/info/VXPromptOptCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `VXPromptOptCardsComponent` `({ data }: VXPromptOptCardsComponentProps)`

Interfaz `VXPromptOptCardsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `PromptOptimizationResponse` | no | — |

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts), [`promptOptimizationInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-promptoptimizationinterfaces-ts)
- Usado por: [`VXPromptOptComparisonComponent.tsx`](#components-google-vertex-prompt-opt-info-vxpromptoptcomparisoncomponent-tsx)

---

<a id="components-google-vertex-prompt-opt-info-vxpromptoptcomparisoncomponent-tsx"></a>
## `components/google-vertex/prompt-opt/info/VXPromptOptComparisonComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `VXPromptOptComparisonComponent` `({ data }: VXPromptOptComparisonComponentProps)`

Interfaz `VXPromptOptComparisonComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `PromptOptimizationResponse \| null \| undefined` | no | — |

Internos:

- constante `viewModeLabels`

- Usa: [`button.tsx`](ui.md#components-ui-button-tsx), [`MessageCards.tsx`](azure/cards.md#components-azure-cards-messagecards-tsx), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts), [`VXPromptOptCardsComponent.tsx`](#components-google-vertex-prompt-opt-info-vxpromptoptcardscomponent-tsx), [`VXPromptOptPanelComponent.tsx`](#components-google-vertex-prompt-opt-info-vxpromptoptpanelcomponent-tsx), [`promptOptimizationInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-promptoptimizationinterfaces-ts)
- Usado por: [`VXPromptOptComponent.tsx`](#components-google-vertex-prompt-opt-vxpromptoptcomponent-tsx)

---

<a id="components-google-vertex-prompt-opt-info-vxpromptoptfilterscomponent-tsx"></a>
## `components/google-vertex/prompt-opt/info/VXPromptOptFiltersComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `VXPromptOptFiltersComponent` `({ useContextLevelFilter, onUseContextLevelFilterChange, useTokenLevelFilter, onUseTokenLevelFilterChange, disabled }: VXPromptOptFiltersComponentProps)`

Interfaz `VXPromptOptFiltersComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `useContextLevelFilter` | `boolean` | no | — |
| `onUseContextLevelFilterChange` | `(value: boolean) => void` | no | — |
| `useTokenLevelFilter` | `boolean` | no | — |
| `onUseTokenLevelFilterChange` | `(value: boolean) => void` | no | — |
| `disabled` | `boolean` | no | — |

- Usa: [`label.tsx`](ui.md#components-ui-label-tsx), [`switch.tsx`](ui.md#components-ui-switch-tsx)
- Usado por: [`VXPromptOptInputComponent.tsx`](#components-google-vertex-prompt-opt-info-vxpromptoptinputcomponent-tsx)

---

<a id="components-google-vertex-prompt-opt-info-vxpromptoptinputcomponent-tsx"></a>
## `components/google-vertex/prompt-opt/info/VXPromptOptInputComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `VXPromptOptInputComponent` `({ prompt, setPrompt, vertexModel, setVertexModel, target, setTarget, rate, setRate, maxTokens, setMaxTokens, useContextLevelFilter, onUseContextLevelFilterCha…`

Interfaz `VXPromptOptInputComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `prompt` | `string` | no | — |
| `setPrompt` | `Dispatch<SetStateAction<string>>` | no | — |
| `vertexModel` | `string` | no | — |
| `setVertexModel` | `Dispatch<SetStateAction<string>>` | no | — |
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

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`label.tsx`](ui.md#components-ui-label-tsx), [`textarea.tsx`](ui.md#components-ui-textarea-tsx), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts), [`VXPromptOptTargetComponent.tsx`](#components-google-vertex-prompt-opt-info-vxpromptopttargetcomponent-tsx), [`VXPromptOptFiltersComponent.tsx`](#components-google-vertex-prompt-opt-info-vxpromptoptfilterscomponent-tsx), [`promptOptimizationInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-promptoptimizationinterfaces-ts), [`VertexModelsFilterComponent.tsx`](general_gcp.md#components-general-gcp-filters-vertexmodelsfiltercomponent-tsx)
- Usado por: [`VXPromptOptComponent.tsx`](#components-google-vertex-prompt-opt-vxpromptoptcomponent-tsx)

---

<a id="components-google-vertex-prompt-opt-info-vxpromptoptpanelcomponent-tsx"></a>
## `components/google-vertex/prompt-opt/info/VXPromptOptPanelComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `VXPromptOptPanelComponent` `({ side, label, hint, breakdown, viewMode, emptyMessage }: VXPromptOptPanelComponentProps)`

Interfaz `VXPromptOptPanelComponentProps`:

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

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts), [`VXPromptOptTokensComponent.tsx`](#components-google-vertex-prompt-opt-info-vxpromptopttokenscomponent-tsx), [`promptOptimizationInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-promptoptimizationinterfaces-ts)
- Usado por: [`VXPromptOptComparisonComponent.tsx`](#components-google-vertex-prompt-opt-info-vxpromptoptcomparisoncomponent-tsx)

---

<a id="components-google-vertex-prompt-opt-info-vxpromptopttargetcomponent-tsx"></a>
## `components/google-vertex/prompt-opt/info/VXPromptOptTargetComponent.tsx`

**Componente (cliente)**

Exporta:

- constante `PROMPT_OPT_RATE_MIN` = `5`
- constante `PROMPT_OPT_RATE_MAX` = `95`
- constante `PROMPT_OPT_RATE_STEP` = `5`
- constante `PROMPT_OPT_DEFAULT_RATE` = `50`
- componente `VXPromptOptTargetComponent` `({ target, setTarget, rate, setRate, maxTokens, setMaxTokens, disabled }: VXPromptOptTargetComponentProps)`

Interfaz `VXPromptOptTargetComponentProps`:

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
- Usado por: [`VXPromptOptComponent.tsx`](#components-google-vertex-prompt-opt-vxpromptoptcomponent-tsx), [`VXPromptOptInputComponent.tsx`](#components-google-vertex-prompt-opt-info-vxpromptoptinputcomponent-tsx)

---

<a id="components-google-vertex-prompt-opt-info-vxpromptopttokenscomponent-tsx"></a>
## `components/google-vertex/prompt-opt/info/VXPromptOptTokensComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `VXPromptOptTokensComponent` `({ tokens, viewMode, emptyMessage, originalText }: VXPromptOptTokensComponentProps)`

Interfaz `VXPromptOptTokensComponentProps`:

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
- Usado por: [`VXPromptOptPanelComponent.tsx`](#components-google-vertex-prompt-opt-info-vxpromptoptpanelcomponent-tsx)

