# Componentes `components/open-ia/`

[← Índice](../README.md)

OpenAI: optimización de costos por modelo.

Archivos:

- [`components/open-ia/costo-optimizacion/MainViewCostOptimizationOpenAIComponent.tsx`](#components-open-ia-costo-optimizacion-mainviewcostoptimizationopenaicomponent-tsx)
- [`components/open-ia/costo-optimizacion/foundation-models/COOpenAIComponent.tsx`](#components-open-ia-costo-optimizacion-foundation-models-coopenaicomponent-tsx)
- [`components/open-ia/costo-optimizacion/foundation-models/MainViewCOOpenAIComponent.tsx`](#components-open-ia-costo-optimizacion-foundation-models-mainviewcoopenaicomponent-tsx)
- [`components/open-ia/costo-optimizacion/foundation-models/info/COOpenAICardsComponent.tsx`](#components-open-ia-costo-optimizacion-foundation-models-info-coopenaicardscomponent-tsx)
- [`components/open-ia/costo-optimizacion/openaiCostOptimizationData.ts`](#components-open-ia-costo-optimizacion-openaicostoptimizationdata-ts)

<a id="components-open-ia-costo-optimizacion-mainviewcostoptimizationopenaicomponent-tsx"></a>
## `components/open-ia/costo-optimizacion/MainViewCostOptimizationOpenAIComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewCostOptimizationOpenAIComponent` `()`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts)
- Usado por: [`page.tsx`](../rutas.md#app-dashboards-ia-open-ia-costo-optimizacion-page-tsx)

---

<a id="components-open-ia-costo-optimizacion-foundation-models-coopenaicomponent-tsx"></a>
## `components/open-ia/costo-optimizacion/foundation-models/COOpenAIComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `OpenAICostOptimizationComponent` `({ startDate, endDate }: OpenAICostOptimizationComponentProps)`

Interfaz `OpenAICostOptimizationComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |

Internos:

- función `fetcher` `(url: string)`
- función `formatApiDate` `(date: Date)`
- función `isNonEmptyArray` `(value: unknown): value is T[]`

- API: `/api/openai/bridge/openai/openai_get_model_price_rate`
- Hooks: `useSWR`
- Usa: [`MessageCards.tsx`](aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx), [`COOpenAICardsComponent.tsx`](#components-open-ia-costo-optimizacion-foundation-models-info-coopenaicardscomponent-tsx), [`openaiCostOptimizationData.ts`](#components-open-ia-costo-optimizacion-openaicostoptimizationdata-ts)
- Usado por: [`MainViewCOOpenAIComponent.tsx`](#components-open-ia-costo-optimizacion-foundation-models-mainviewcoopenaicomponent-tsx)

---

<a id="components-open-ia-costo-optimizacion-foundation-models-mainviewcoopenaicomponent-tsx"></a>
## `components/open-ia/costo-optimizacion/foundation-models/MainViewCOOpenAIComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewOpenAICostOptimizationFoundationModelsComponent` `()`

- Usa: [`FiltersComponent.tsx`](general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`COOpenAIComponent.tsx`](#components-open-ia-costo-optimizacion-foundation-models-coopenaicomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-dashboards-ia-open-ia-costo-optimizacion-foundation-models-page-tsx)

---

<a id="components-open-ia-costo-optimizacion-foundation-models-info-coopenaicardscomponent-tsx"></a>
## `components/open-ia/costo-optimizacion/foundation-models/info/COOpenAICardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `OpenAICostOptimizationCardsComponent` `({ data }: { data: OpenAICostOptimizationModel[] })`

Interfaz `DetailedRateUI`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `key` | `string` | no | — |
| `label` | `string` | no | — |
| `rateLabel` | `string` | no | — |
| `cost` | `string` | no | — |

- Tipo interno `ComparisonSortOption` = `"savings" | "confidence" | "balanced"`
Internos:

- constante `comparisonSortOptions`
- constante `tokenFormatter`
- constante `percentFormatter`
- función `formatCost` `(value: number | undefined | null)`
- constante `detailedLabels`
- función `normalizeMetricKey` `(value: string)`
- función `getLineMetricKey` `(line: OpenAICostOptimizationLineItem)`
- función `getLineFriendlyName` `(line: OpenAICostOptimizationLineItem)`
- función `formatLineQuantity` `(line: OpenAICostOptimizationLineItem)`
- función `formatLineRate` `(line: OpenAICostOptimizationLineItem)`
- componente `Stars` `({ value, size = "md" }: { value: number; size?: "sm" | "md" })`
- función `renderLineItem` `(line: OpenAICostOptimizationLineItem, idx: number)`
- función `getConfidenceScore` `(candidate: OpenAICostOptimizationCandidate)`
- componente `ModelConfidence` `({ score, modelName }: { score: number; modelName: string })`
- función `getDetailedRates` `(candidate: OpenAICostOptimizationCandidate): DetailedRateUI[]`
- componente `OpenAIModelCard` `({ item }: { item: OpenAICostOptimizationModel })`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`badge.tsx`](ui.md#components-ui-badge-tsx), [`select.tsx`](ui.md#components-ui-select-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`collapsible.tsx`](ui.md#components-ui-collapsible-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`openaiCostOptimizationData.ts`](#components-open-ia-costo-optimizacion-openaicostoptimizationdata-ts)
- Usado por: [`COOpenAIComponent.tsx`](#components-open-ia-costo-optimizacion-foundation-models-coopenaicomponent-tsx)

---

<a id="components-open-ia-costo-optimizacion-openaicostoptimizationdata-ts"></a>
## `components/open-ia/costo-optimizacion/openaiCostOptimizationData.ts`

**Módulo**

Exporta:

- interfaz `OpenAICostOptimizationLineItem`
- interfaz `OpenAIModelProfile`
- interfaz `OpenAICostOptimizationCandidate`
- interfaz `OpenAICostOptimizationModel`
- interfaz `OpenAICostOptimizationApiModel`
- función `normalizeOpenAICostOptimizationData` `(data: OpenAICostOptimizationApiModel[]): OpenAICostOptimizationModel[]`

Interfaz `OpenAICostOptimizationLineItem` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `line_item` | `string` | no | — |
| `metric_type` | `string` | no | — |
| `amount_value` | `number` | no | — |
| `quantity` | `number` | no | — |
| `quantity_unit` | `string` | no | — |
| `rate` | `number` | no | — |
| `amount_currency` | `string` | sí | — |

Interfaz `OpenAIModelProfile` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `stars` | `number` | no | — |
| `tier` | `string` | no | — |
| `description` | `string` | no | — |

Interfaz `OpenAICostOptimizationCandidate` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `model_name` | `string` | no | — |
| `provider` | `string` | no | — |
| `estimated_cost` | `number` | no | — |
| `delta_pct` | `number` | no | — |
| `confidence` | `number` | no | — |
| `tier` | `string` | no | — |
| `description` | `string` | no | — |
| `rates` | `Record<string, number>` | no | — |
| `cost_breakdown` | `Record<string, number>` | sí | — |
| `model_profile` | `OpenAIModelProfile` | sí | — |
| `mode` | `string \| null` | sí | — |
| `max_input_tokens` | `number \| null` | sí | — |
| `max_output_tokens` | `number \| null` | sí | — |

Interfaz `OpenAICostOptimizationModel` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `project_id` | `string` | no | — |
| `project_name` | `string` | no | — |
| `model_name` | `string` | no | — |
| `provider` | `string` | no | — |
| `model_version` | `string` | no | — |
| `period_label` | `string` | no | — |
| `retrieved_at` | `string` | no | — |
| `start_time` | `number` | no | — |
| `end_time` | `number` | no | — |
| `start_time_date` | `string` | no | — |
| `end_time_date` | `string` | no | — |
| `model_profile` | `OpenAIModelProfile` | no | — |
| `tokens` | `Record<string, number>` | no | — |
| `cost_breakdown` | `Record<string, number>` | no | — |
| `total_cost` | `number` | no | — |
| `total_billing_cost` | `number` | no | — |
| `billing_cost_breakdown` | `Record<string, number>` | no | — |
| `billing_quantity_breakdown` | `Record<string, number>` | no | — |
| `catalog_rates` | `Record<string, unknown>` | no | — |
| `billing_rates` | `Record<string, unknown>` | no | — |
| `line_items` | `OpenAICostOptimizationLineItem[]` | no | — |
| `price_comparison` | `OpenAICostOptimizationCandidate[]` | no | — |

Interfaz `OpenAICostOptimizationApiLineItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `line_item` | `string \| null` | sí | — |
| `metric_type` | `string \| null` | sí | — |
| `amount_currency` | `string \| null` | sí | — |
| `amount_value` | `unknown` | sí | — |
| `quantity` | `unknown` | sí | — |
| `quantity_unit` | `string \| null` | sí | — |
| `rate` | `unknown` | sí | — |

Interfaz `OpenAICostOptimizationApiCandidate`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `model_name` | `string \| null` | sí | — |
| `provider` | `string \| null` | sí | — |
| `estimated_cost` | `unknown` | sí | — |
| `delta_pct` | `unknown` | sí | — |
| `confidence` | `unknown` | sí | — |
| `tier` | `string \| null` | sí | — |
| `description` | `string \| null` | sí | — |
| `rates` | `Record<string, unknown> \| null` | sí | — |
| `cost_breakdown` | `Record<string, unknown> \| null` | sí | — |
| `model_profile` | `Partial<OpenAIModelProfile> \| null` | sí | — |
| `mode` | `string \| null` | sí | — |
| `max_input_tokens` | `unknown` | sí | — |
| `max_output_tokens` | `unknown` | sí | — |

Interfaz `OpenAICostOptimizationApiModel` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `project_id` | `string \| null` | sí | — |
| `project_name` | `string \| null` | sí | — |
| `model_name` | `string \| null` | sí | — |
| `provider` | `string \| null` | sí | — |
| `model_version` | `string \| null` | sí | — |
| `period_label` | `string \| null` | sí | — |
| `retrieved_at` | `string \| null` | sí | — |
| `start_time` | `unknown` | sí | — |
| `end_time` | `unknown` | sí | — |
| `start_time_date` | `string \| null` | sí | — |
| `end_time_date` | `string \| null` | sí | — |
| `model_profile` | `Partial<OpenAIModelProfile> \| null` | sí | — |
| `tokens` | `Record<string, unknown> \| null` | sí | — |
| `cost_breakdown` | `Record<string, unknown> \| null` | sí | — |
| `total_cost` | `unknown` | sí | — |
| `billing_cost_breakdown` | `Record<string, unknown> \| null` | sí | — |
| `billing_quantity_breakdown` | `Record<string, unknown> \| null` | sí | — |
| `total_billing_cost` | `unknown` | sí | — |
| `catalog_rates` | `Record<string, unknown> \| null` | sí | — |
| `billing_rates` | `Record<string, unknown> \| null` | sí | — |
| `line_items` | `OpenAICostOptimizationApiLineItem[] \| null` | sí | — |
| `price_comparison` | `OpenAICostOptimizationApiCandidate[] \| null` | sí | — |

Internos:

- constante `DEFAULT_PROFILE`
- constante `METRIC_LABELS`
- función `toNumber` `(value: unknown, fallback = 0)`
- función `toNumberRecord` `(record?: Record<string, unknown> | null)`
- función `withCachedInputAlias` `(record: Record<string, number>)`
- función `normalizeProfile` `(profile?: Partial<OpenAIModelProfile> | null, fallback?: Partial<OpenAIModelProfile> | null): OpenAIModelProfile`
- función `normalizeMetricLabel` `(metric?: string | null)`
- función `normalizeLineItem` `(line: OpenAICostOptimizationApiLineItem, index: number): OpenAICostOptimizationLineItem`
- función `normalizeCandidate` `(candidate: OpenAICostOptimizationApiCandidate, currentCost: number): OpenAICostOptimizationCandidate`

- Usado por: [`COOpenAIComponent.tsx`](#components-open-ia-costo-optimizacion-foundation-models-coopenaicomponent-tsx), [`COOpenAICardsComponent.tsx`](#components-open-ia-costo-optimizacion-foundation-models-info-coopenaicardscomponent-tsx)

