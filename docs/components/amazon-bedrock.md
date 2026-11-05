# Componentes `components/amazon-bedrock/`

[← Índice](../README.md)

Amazon Bedrock: comparación de costo con modelos equivalentes, optimización de costos (foundation, custom e inference profiles) y optimización de prompts.

Archivos:

- [`components/amazon-bedrock/comparacion/BMComparisonComponent.tsx`](#components-amazon-bedrock-comparacion-bmcomparisoncomponent-tsx)
- [`components/amazon-bedrock/comparacion/MainViewBMComparisonComponent.tsx`](#components-amazon-bedrock-comparacion-mainviewbmcomparisoncomponent-tsx)
- [`components/amazon-bedrock/comparacion/info/BMComparisonCandidateConfidenceComponent.tsx`](#components-amazon-bedrock-comparacion-info-bmcomparisoncandidateconfidencecomponent-tsx)
- [`components/amazon-bedrock/comparacion/info/BMComparisonCardsComponent.tsx`](#components-amazon-bedrock-comparacion-info-bmcomparisoncardscomponent-tsx)
- [`components/amazon-bedrock/comparacion/info/BMComparisonCostBridgeComponent.tsx`](#components-amazon-bedrock-comparacion-info-bmcomparisoncostbridgecomponent-tsx)
- [`components/amazon-bedrock/comparacion/info/BMComparisonModelPanelsComponent.tsx`](#components-amazon-bedrock-comparacion-info-bmcomparisonmodelpanelscomponent-tsx)
- [`components/amazon-bedrock/comparacion/info/BMComparisonTokenMixComponent.tsx`](#components-amazon-bedrock-comparacion-info-bmcomparisontokenmixcomponent-tsx)
- [`components/amazon-bedrock/comparacion/info/BMComparisonViewComponent.tsx`](#components-amazon-bedrock-comparacion-info-bmcomparisonviewcomponent-tsx)
- [`components/amazon-bedrock/comparacion/table/BMComparisonResourcesColumns.tsx`](#components-amazon-bedrock-comparacion-table-bmcomparisonresourcescolumns-tsx)
- [`components/amazon-bedrock/comparacion/table/BMComparisonResourcesTableComponent.tsx`](#components-amazon-bedrock-comparacion-table-bmcomparisonresourcestablecomponent-tsx)
- [`components/amazon-bedrock/costo-optimizacion/MainViewCostOptimizationComponent.tsx`](#components-amazon-bedrock-costo-optimizacion-mainviewcostoptimizationcomponent-tsx)
- [`components/amazon-bedrock/costo-optimizacion/custom-models/COCustomModelsComponent.tsx`](#components-amazon-bedrock-costo-optimizacion-custom-models-cocustommodelscomponent-tsx)
- [`components/amazon-bedrock/costo-optimizacion/custom-models/MainViewCOCustomModelsComponent.tsx`](#components-amazon-bedrock-costo-optimizacion-custom-models-mainviewcocustommodelscomponent-tsx)
- [`components/amazon-bedrock/costo-optimizacion/custom-models/info/COCustomModelsCardsComponent.tsx`](#components-amazon-bedrock-costo-optimizacion-custom-models-info-cocustommodelscardscomponent-tsx)
- [`components/amazon-bedrock/costo-optimizacion/foundation-models/COFoundationComponent.tsx`](#components-amazon-bedrock-costo-optimizacion-foundation-models-cofoundationcomponent-tsx)
- [`components/amazon-bedrock/costo-optimizacion/foundation-models/MainViewCOFoundationComponent.tsx`](#components-amazon-bedrock-costo-optimizacion-foundation-models-mainviewcofoundationcomponent-tsx)
- [`components/amazon-bedrock/costo-optimizacion/foundation-models/info/COFoundationCardsComponent.tsx`](#components-amazon-bedrock-costo-optimizacion-foundation-models-info-cofoundationcardscomponent-tsx)
- [`components/amazon-bedrock/costo-optimizacion/inference-profiles/COInferenceProfilesComponent.tsx`](#components-amazon-bedrock-costo-optimizacion-inference-profiles-coinferenceprofilescomponent-tsx)
- [`components/amazon-bedrock/costo-optimizacion/inference-profiles/MainViewCOInferenceProfilesComponent.tsx`](#components-amazon-bedrock-costo-optimizacion-inference-profiles-mainviewcoinferenceprofilescomponent-tsx)
- [`components/amazon-bedrock/costo-optimizacion/inference-profiles/info/COInferenceProfilesCardsComponent.tsx`](#components-amazon-bedrock-costo-optimizacion-inference-profiles-info-coinferenceprofilescardscomponent-tsx)
- [`components/amazon-bedrock/prompt-opt/BMPromptOptComponent.tsx`](#components-amazon-bedrock-prompt-opt-bmpromptoptcomponent-tsx)
- [`components/amazon-bedrock/prompt-opt/MainViewBMPromptOptComponent.tsx`](#components-amazon-bedrock-prompt-opt-mainviewbmpromptoptcomponent-tsx)
- [`components/amazon-bedrock/prompt-opt/info/BMPromptOptCardsComponent.tsx`](#components-amazon-bedrock-prompt-opt-info-bmpromptoptcardscomponent-tsx)
- [`components/amazon-bedrock/prompt-opt/info/BMPromptOptComparisonComponent.tsx`](#components-amazon-bedrock-prompt-opt-info-bmpromptoptcomparisoncomponent-tsx)
- [`components/amazon-bedrock/prompt-opt/info/BMPromptOptFiltersComponent.tsx`](#components-amazon-bedrock-prompt-opt-info-bmpromptoptfilterscomponent-tsx)
- [`components/amazon-bedrock/prompt-opt/info/BMPromptOptInputComponent.tsx`](#components-amazon-bedrock-prompt-opt-info-bmpromptoptinputcomponent-tsx)
- [`components/amazon-bedrock/prompt-opt/info/BMPromptOptPanelComponent.tsx`](#components-amazon-bedrock-prompt-opt-info-bmpromptoptpanelcomponent-tsx)
- [`components/amazon-bedrock/prompt-opt/info/BMPromptOptTargetComponent.tsx`](#components-amazon-bedrock-prompt-opt-info-bmpromptopttargetcomponent-tsx)
- [`components/amazon-bedrock/prompt-opt/info/BMPromptOptTokensComponent.tsx`](#components-amazon-bedrock-prompt-opt-info-bmpromptopttokenscomponent-tsx)

<a id="components-amazon-bedrock-comparacion-bmcomparisoncomponent-tsx"></a>
## `components/amazon-bedrock/comparacion/BMComparisonComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `BMComparisonComponent` `({ startDate, endDate, instance, region }: BMComparisonComponent)`

Interfaz `BMComparisonComponent`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `instance` | `string \| null` | sí | — |
| `region` | `string \| null` | sí | — |

- API: `/api/aws/bridge/bedrock/comparison/get_aws_bedrock_comparison`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`MessageCards.tsx`](azure/cards.md#components-azure-cards-messagecards-tsx), [`LoaderComponent.tsx`](general_azure.md#components-general-azure-loadercomponent-tsx), [`BMComparisonViewComponent.tsx`](#components-amazon-bedrock-comparacion-info-bmcomparisonviewcomponent-tsx), [`awsBedrockComparisonInterfaces.ts`](../tipos.md#interfaces-bedrock-comparison-awsbedrockcomparisoninterfaces-ts)
- Usado por: [`MainViewBMComparisonComponent.tsx`](#components-amazon-bedrock-comparacion-mainviewbmcomparisoncomponent-tsx)

---

<a id="components-amazon-bedrock-comparacion-mainviewbmcomparisoncomponent-tsx"></a>
## `components/amazon-bedrock/comparacion/MainViewBMComparisonComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewBMComparisonComponent` `()`

- Usa: [`FiltersComponent.tsx`](general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`BMComparisonComponent.tsx`](#components-amazon-bedrock-comparacion-bmcomparisoncomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-dashboards-ia-amazon-bedrock-comparacion-page-tsx)

---

<a id="components-amazon-bedrock-comparacion-info-bmcomparisoncandidateconfidencecomponent-tsx"></a>
## `components/amazon-bedrock/comparacion/info/BMComparisonCandidateConfidenceComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `BMComparisonCandidateConfidenceComponent` `({ data, provider }: BMComparisonCandidateConfidenceComponentProps)`

Interfaz `BMComparisonCandidateConfidenceComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AwsBedrockModel[]` | no | — |
| `provider` | `AwsBedrockProviderKey` | no | — |

Interfaz `CandidateGroup`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `aws_model_id` | `string` | no | — |
| `aws_model_name` | `string` | no | — |
| `rows` | `AwsBedrockCandidateConfidenceRow[]` | no | — |

Internos:

- constante `CONFIDENCE_METER_COLOR`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`awsBedrockComparisonInterfaces.ts`](../tipos.md#interfaces-bedrock-comparison-awsbedrockcomparisoninterfaces-ts), [`awsBedrockComparisonFormatters.ts`](../lib.md#lib-awsbedrockcomparisonformatters-ts)
- Usado por: [`BMComparisonViewComponent.tsx`](#components-amazon-bedrock-comparacion-info-bmcomparisonviewcomponent-tsx)

---

<a id="components-amazon-bedrock-comparacion-info-bmcomparisoncardscomponent-tsx"></a>
## `components/amazon-bedrock/comparacion/info/BMComparisonCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `BMComparisonSummaryCards` `({ data, provider }: BMComparisonSummaryCardsProps)`

Interfaz `BMComparisonSummaryCardsProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AwsBedrockComparison` | no | — |
| `provider` | `AwsBedrockProviderKey` | no | — |

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`awsBedrockComparisonInterfaces.ts`](../tipos.md#interfaces-bedrock-comparison-awsbedrockcomparisoninterfaces-ts), [`awsBedrockComparisonFormatters.ts`](../lib.md#lib-awsbedrockcomparisonformatters-ts)
- Usado por: [`BMComparisonViewComponent.tsx`](#components-amazon-bedrock-comparacion-info-bmcomparisonviewcomponent-tsx)

---

<a id="components-amazon-bedrock-comparacion-info-bmcomparisoncostbridgecomponent-tsx"></a>
## `components/amazon-bedrock/comparacion/info/BMComparisonCostBridgeComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `BMComparisonCostBridgeComponent` `({ data, provider }: BMComparisonCostBridgeComponentProps)`

Interfaz `BMComparisonCostBridgeComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AwsBedrockModel[]` | no | — |
| `provider` | `AwsBedrockProviderKey` | no | — |

Internos:

- constante `MIN_SPAN`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`awsBedrockComparisonInterfaces.ts`](../tipos.md#interfaces-bedrock-comparison-awsbedrockcomparisoninterfaces-ts), [`awsBedrockComparisonFormatters.ts`](../lib.md#lib-awsbedrockcomparisonformatters-ts)
- Usado por: [`BMComparisonViewComponent.tsx`](#components-amazon-bedrock-comparacion-info-bmcomparisonviewcomponent-tsx)

---

<a id="components-amazon-bedrock-comparacion-info-bmcomparisonmodelpanelscomponent-tsx"></a>
## `components/amazon-bedrock/comparacion/info/BMComparisonModelPanelsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `BMComparisonModelPanelsComponent` `({ data, provider }: BMComparisonModelPanelsComponentProps)`

Interfaz `BMComparisonModelPanelsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AwsBedrockModel[]` | no | — |
| `provider` | `AwsBedrockProviderKey` | no | — |

Internos:

- función `buildLadder` `(model: AwsBedrockModel, recommended: AwsBedrockCandidate | undefined): AwsBedrockDimensionLadderRow[]`
- función `buildResourceTypesLabel` `(model: AwsBedrockModel): string`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`awsBedrockComparisonInterfaces.ts`](../tipos.md#interfaces-bedrock-comparison-awsbedrockcomparisoninterfaces-ts), [`awsBedrockComparisonFormatters.ts`](../lib.md#lib-awsbedrockcomparisonformatters-ts)
- Usado por: [`BMComparisonViewComponent.tsx`](#components-amazon-bedrock-comparacion-info-bmcomparisonviewcomponent-tsx)

---

<a id="components-amazon-bedrock-comparacion-info-bmcomparisontokenmixcomponent-tsx"></a>
## `components/amazon-bedrock/comparacion/info/BMComparisonTokenMixComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `BMComparisonTokenMixComponent` `({ data }: BMComparisonTokenMixComponentProps)`

Interfaz `BMComparisonTokenMixComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AwsBedrockModel[]` | no | — |

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

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`awsBedrockComparisonInterfaces.ts`](../tipos.md#interfaces-bedrock-comparison-awsbedrockcomparisoninterfaces-ts), [`awsBedrockComparisonFormatters.ts`](../lib.md#lib-awsbedrockcomparisonformatters-ts)
- Usado por: [`BMComparisonViewComponent.tsx`](#components-amazon-bedrock-comparacion-info-bmcomparisonviewcomponent-tsx)

---

<a id="components-amazon-bedrock-comparacion-info-bmcomparisonviewcomponent-tsx"></a>
## `components/amazon-bedrock/comparacion/info/BMComparisonViewComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `BMComparisonView` `({ data }: BMComparisonViewProps)`

Interfaz `BMComparisonViewProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AwsBedrockComparison \| AwsBedrockComparisonResponse \| null \| undefined` | no | — |

Interfaz `ChapterHeaderProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `step` | `number` | no | — |
| `eyebrow` | `string` | no | — |
| `question` | `string` | no | — |
| `sub` | `string` | no | — |

Internos:

- componente `ChapterHeader` `({ step, eyebrow, question, sub }: ChapterHeaderProps)`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`MessageCards.tsx`](aws/cards.md#components-aws-cards-messagecards-tsx), [`awsBedrockComparisonInterfaces.ts`](../tipos.md#interfaces-bedrock-comparison-awsbedrockcomparisoninterfaces-ts), [`BMComparisonCardsComponent.tsx`](#components-amazon-bedrock-comparacion-info-bmcomparisoncardscomponent-tsx), [`BMComparisonCostBridgeComponent.tsx`](#components-amazon-bedrock-comparacion-info-bmcomparisoncostbridgecomponent-tsx), [`BMComparisonTokenMixComponent.tsx`](#components-amazon-bedrock-comparacion-info-bmcomparisontokenmixcomponent-tsx), [`BMComparisonModelPanelsComponent.tsx`](#components-amazon-bedrock-comparacion-info-bmcomparisonmodelpanelscomponent-tsx), [`BMComparisonCandidateConfidenceComponent.tsx`](#components-amazon-bedrock-comparacion-info-bmcomparisoncandidateconfidencecomponent-tsx), [`BMComparisonResourcesTableComponent.tsx`](#components-amazon-bedrock-comparacion-table-bmcomparisonresourcestablecomponent-tsx), [`awsBedrockComparisonFormatters.ts`](../lib.md#lib-awsbedrockcomparisonformatters-ts)
- Usado por: [`BMComparisonComponent.tsx`](#components-amazon-bedrock-comparacion-bmcomparisoncomponent-tsx)

---

<a id="components-amazon-bedrock-comparacion-table-bmcomparisonresourcescolumns-tsx"></a>
## `components/amazon-bedrock/comparacion/table/BMComparisonResourcesColumns.tsx`

**Módulo (cliente)**

Exporta:

- función `getBMComparisonResourcesColumns` `(): DynamicColumn<AwsBedrockResourceRow>[]`

- Tipo interno `ResourceCellInfo` = `{ row: { original: AwsBedrockResourceRow; }; }`
Internos:

- función `getResource` `(info: unknown)`

- Usa: [`columns.tsx`](data-table.md#components-data-table-columns-tsx), [`awsBedrockComparisonInterfaces.ts`](../tipos.md#interfaces-bedrock-comparison-awsbedrockcomparisoninterfaces-ts), [`awsBedrockComparisonFormatters.ts`](../lib.md#lib-awsbedrockcomparisonformatters-ts), [`utils.ts`](../lib.md#lib-utils-ts)
- Usado por: [`BMComparisonResourcesTableComponent.tsx`](#components-amazon-bedrock-comparacion-table-bmcomparisonresourcestablecomponent-tsx)

---

<a id="components-amazon-bedrock-comparacion-table-bmcomparisonresourcestablecomponent-tsx"></a>
## `components/amazon-bedrock/comparacion/table/BMComparisonResourcesTableComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `BMComparisonResourcesTableComponent` `({ data }: BMComparisonResourcesTableComponentProps)`

Interfaz `BMComparisonResourcesTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AwsBedrockModel[]` | no | — |

Internos:

- componente `TableLegend` `()`

- Usa: [`columns.tsx`](data-table.md#components-data-table-columns-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`data-table-grouping.tsx`](data-table.md#components-data-table-data-table-grouping-tsx), [`awsBedrockComparisonInterfaces.ts`](../tipos.md#interfaces-bedrock-comparison-awsbedrockcomparisoninterfaces-ts), [`BMComparisonResourcesColumns.tsx`](#components-amazon-bedrock-comparacion-table-bmcomparisonresourcescolumns-tsx)
- Usado por: [`BMComparisonViewComponent.tsx`](#components-amazon-bedrock-comparacion-info-bmcomparisonviewcomponent-tsx)

---

<a id="components-amazon-bedrock-costo-optimizacion-mainviewcostoptimizationcomponent-tsx"></a>
## `components/amazon-bedrock/costo-optimizacion/MainViewCostOptimizationComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewCostOptimizationComponent` `()`

- Usa: [`FiltersComponent.tsx`](general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts)
- Usado por: [`page.tsx`](../rutas.md#app-dashboards-ia-amazon-bedrock-costo-optimizacion-page-tsx)

Notas de implementación:

- description: 'Visualiza y analiza los dashboards de costos de tus nubes.',
- description: 'Explora los dashboards de los principales servicios de IA de tus nubes.',
- description: 'Compara costos y métricas entre tus distintas nubes.',

---

<a id="components-amazon-bedrock-costo-optimizacion-custom-models-cocustommodelscomponent-tsx"></a>
## `components/amazon-bedrock/costo-optimizacion/custom-models/COCustomModelsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `COCustomModelsComponent` `({ startDate, endDate, instance, region }: COCustomModelsComponentProps)`

Interfaz `COCustomModelsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `instance` | `string` | no | — |
| `region` | `string` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`
- función `isNullish` `(v: unknown)`

- API: `/api/aws/bridge/bedrock/custom_models/get_model_price_rate`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`COCustomModelsCardsComponent.tsx`](#components-amazon-bedrock-costo-optimizacion-custom-models-info-cocustommodelscardscomponent-tsx), [`MessageCards.tsx`](aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx), [`customModels.ts`](../tipos.md#interfaces-bedrock-cost-optimization-custommodels-ts)
- Usado por: [`MainViewCOCustomModelsComponent.tsx`](#components-amazon-bedrock-costo-optimizacion-custom-models-mainviewcocustommodelscomponent-tsx)

---

<a id="components-amazon-bedrock-costo-optimizacion-custom-models-mainviewcocustommodelscomponent-tsx"></a>
## `components/amazon-bedrock/costo-optimizacion/custom-models/MainViewCOCustomModelsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewCOCustomModelsComponent` `()`

- Usa: [`FiltersComponent.tsx`](general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`COCustomModelsComponent.tsx`](#components-amazon-bedrock-costo-optimizacion-custom-models-cocustommodelscomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-dashboards-ia-amazon-bedrock-costo-optimizacion-custom-models-page-tsx)

---

<a id="components-amazon-bedrock-costo-optimizacion-custom-models-info-cocustommodelscardscomponent-tsx"></a>
## `components/amazon-bedrock/costo-optimizacion/custom-models/info/COCustomModelsCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `COCustomModelsCardsComponent` `({ data, }: { data: CustomModelsPriceRate[]; })`

Internos:

- constante `currencyFormatter`
- constante `tokenFormatter`
- constante `rateFormatter`
- constante `percentFormatter`
- función `formatRate` `(value: string): string`
- constante `rateLabels`
- constante `rateRows`
- componente `CustomModelCard` `({ customModel, expanded = false, }: { customModel: CustomModelsPriceRate; expanded?: boolean; })`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`badge.tsx`](ui.md#components-ui-badge-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`collapsible.tsx`](ui.md#components-ui-collapsible-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`customModels.ts`](../tipos.md#interfaces-bedrock-cost-optimization-custommodels-ts)
- Usado por: [`COCustomModelsComponent.tsx`](#components-amazon-bedrock-costo-optimizacion-custom-models-cocustommodelscomponent-tsx)

---

<a id="components-amazon-bedrock-costo-optimizacion-foundation-models-cofoundationcomponent-tsx"></a>
## `components/amazon-bedrock/costo-optimizacion/foundation-models/COFoundationComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `COFoundationComponent` `({ startDate, endDate, instance, region }: COFoundationComponentProps)`

Interfaz `COFoundationComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `instance` | `string` | no | — |
| `region` | `string` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`
- función `isNullish` `(v: unknown)`

- API: `/api/aws/bridge/bedrock/foundation_models/get_model_price_rate`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`COFoundationCardsComponent.tsx`](#components-amazon-bedrock-costo-optimizacion-foundation-models-info-cofoundationcardscomponent-tsx), [`MessageCards.tsx`](aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx), [`foundationModels.ts`](../tipos.md#interfaces-bedrock-cost-optimization-foundationmodels-ts)
- Usado por: [`MainViewCOFoundationComponent.tsx`](#components-amazon-bedrock-costo-optimizacion-foundation-models-mainviewcofoundationcomponent-tsx)

---

<a id="components-amazon-bedrock-costo-optimizacion-foundation-models-mainviewcofoundationcomponent-tsx"></a>
## `components/amazon-bedrock/costo-optimizacion/foundation-models/MainViewCOFoundationComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewCOFoundationComponent` `()`

- Usa: [`FiltersComponent.tsx`](general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`COFoundationComponent.tsx`](#components-amazon-bedrock-costo-optimizacion-foundation-models-cofoundationcomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-dashboards-ia-amazon-bedrock-costo-optimizacion-foundation-models-page-tsx)

---

<a id="components-amazon-bedrock-costo-optimizacion-foundation-models-info-cofoundationcardscomponent-tsx"></a>
## `components/amazon-bedrock/costo-optimizacion/foundation-models/info/COFoundationCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `COFoundationCardsComponent` `({ data, }: { data: FoundationModelsPriceRate[]; })`

Internos:

- constante `currencyFormatter`
- constante `tokenFormatter`
- constante `rateFormatter`
- constante `percentFormatter`
- función `formatRate` `(value: string): string`
- constante `rateLabels`
- constante `rateRows`
- componente `FoundationModelCard` `({ fm, expanded = false, }: { fm: FoundationModelsPriceRate; expanded?: boolean; })`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`badge.tsx`](ui.md#components-ui-badge-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`collapsible.tsx`](ui.md#components-ui-collapsible-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`foundationModels.ts`](../tipos.md#interfaces-bedrock-cost-optimization-foundationmodels-ts)
- Usado por: [`COFoundationComponent.tsx`](#components-amazon-bedrock-costo-optimizacion-foundation-models-cofoundationcomponent-tsx)

---

<a id="components-amazon-bedrock-costo-optimizacion-inference-profiles-coinferenceprofilescomponent-tsx"></a>
## `components/amazon-bedrock/costo-optimizacion/inference-profiles/COInferenceProfilesComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `COInferenceProfilesComponent` `({ startDate, endDate, instance, region }: COInferenceProfilesComponentProps)`

Interfaz `COInferenceProfilesComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `instance` | `string` | no | — |
| `region` | `string` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`
- función `isNullish` `(v: unknown)`

- API: `/api/aws/bridge/bedrock/inference_profile/get_model_price_rate`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`COInferenceProfilesCardsComponent.tsx`](#components-amazon-bedrock-costo-optimizacion-inference-profiles-info-coinferenceprofilescardscomponent-tsx), [`MessageCards.tsx`](aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx), [`inferenceProfiles.ts`](../tipos.md#interfaces-bedrock-cost-optimization-inferenceprofiles-ts)
- Usado por: [`MainViewCOInferenceProfilesComponent.tsx`](#components-amazon-bedrock-costo-optimizacion-inference-profiles-mainviewcoinferenceprofilescomponent-tsx)

---

<a id="components-amazon-bedrock-costo-optimizacion-inference-profiles-mainviewcoinferenceprofilescomponent-tsx"></a>
## `components/amazon-bedrock/costo-optimizacion/inference-profiles/MainViewCOInferenceProfilesComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewCOInferenceProfilesComponent` `()`

- Usa: [`FiltersComponent.tsx`](general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`COInferenceProfilesComponent.tsx`](#components-amazon-bedrock-costo-optimizacion-inference-profiles-coinferenceprofilescomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-dashboards-ia-amazon-bedrock-costo-optimizacion-inference-profiles-page-tsx)

---

<a id="components-amazon-bedrock-costo-optimizacion-inference-profiles-info-coinferenceprofilescardscomponent-tsx"></a>
## `components/amazon-bedrock/costo-optimizacion/inference-profiles/info/COInferenceProfilesCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `COInferenceProfilesCardsComponent` `({ data, }: { data: InferenceProfilesPriceRate[]; })`

Internos:

- constante `currencyFormatter`
- constante `tokenFormatter`
- constante `rateFormatter`
- constante `percentFormatter`
- función `formatRate` `(value: string): string`
- constante `rateLabels`
- constante `rateRows`
- componente `InferenceProfileCard` `({ profile, expanded = false, }: { profile: InferenceProfilesPriceRate; expanded?: boolean; })`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`badge.tsx`](ui.md#components-ui-badge-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`collapsible.tsx`](ui.md#components-ui-collapsible-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`inferenceProfiles.ts`](../tipos.md#interfaces-bedrock-cost-optimization-inferenceprofiles-ts)
- Usado por: [`COInferenceProfilesComponent.tsx`](#components-amazon-bedrock-costo-optimizacion-inference-profiles-coinferenceprofilescomponent-tsx)

---

<a id="components-amazon-bedrock-prompt-opt-bmpromptoptcomponent-tsx"></a>
## `components/amazon-bedrock/prompt-opt/BMPromptOptComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `BMPromptOptComponent` `()`

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

- API: `/api/aws/bridge/bedrock/prompt_optimization/optimize_prompt`
- Hooks: `useSWRMutation`
- Usa: [`MessageCards.tsx`](azure/cards.md#components-azure-cards-messagecards-tsx), [`LoaderComponent.tsx`](general_azure.md#components-general-azure-loadercomponent-tsx), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts), [`BMPromptOptInputComponent.tsx`](#components-amazon-bedrock-prompt-opt-info-bmpromptoptinputcomponent-tsx), [`BMPromptOptComparisonComponent.tsx`](#components-amazon-bedrock-prompt-opt-info-bmpromptoptcomparisoncomponent-tsx), [`BMPromptOptTargetComponent.tsx`](#components-amazon-bedrock-prompt-opt-info-bmpromptopttargetcomponent-tsx), [`promptOptimizationInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-promptoptimizationinterfaces-ts)
- Usado por: [`MainViewBMPromptOptComponent.tsx`](#components-amazon-bedrock-prompt-opt-mainviewbmpromptoptcomponent-tsx)

---

<a id="components-amazon-bedrock-prompt-opt-mainviewbmpromptoptcomponent-tsx"></a>
## `components/amazon-bedrock/prompt-opt/MainViewBMPromptOptComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewBMPromptOptComponent` `()`

- Usa: [`BMPromptOptComponent.tsx`](#components-amazon-bedrock-prompt-opt-bmpromptoptcomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-dashboards-ia-amazon-bedrock-prompt-opt-page-tsx)

---

<a id="components-amazon-bedrock-prompt-opt-info-bmpromptoptcardscomponent-tsx"></a>
## `components/amazon-bedrock/prompt-opt/info/BMPromptOptCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `BMPromptOptCardsComponent` `({ data }: BMPromptOptCardsComponentProps)`

Interfaz `BMPromptOptCardsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `PromptOptimizationResponse` | no | — |

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts), [`promptOptimizationInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-promptoptimizationinterfaces-ts)
- Usado por: [`BMPromptOptComparisonComponent.tsx`](#components-amazon-bedrock-prompt-opt-info-bmpromptoptcomparisoncomponent-tsx)

---

<a id="components-amazon-bedrock-prompt-opt-info-bmpromptoptcomparisoncomponent-tsx"></a>
## `components/amazon-bedrock/prompt-opt/info/BMPromptOptComparisonComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `BMPromptOptComparisonComponent` `({ data }: BMPromptOptComparisonComponentProps)`

Interfaz `BMPromptOptComparisonComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `PromptOptimizationResponse \| null \| undefined` | no | — |

Internos:

- constante `viewModeLabels`

- Usa: [`button.tsx`](ui.md#components-ui-button-tsx), [`MessageCards.tsx`](azure/cards.md#components-azure-cards-messagecards-tsx), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts), [`BMPromptOptCardsComponent.tsx`](#components-amazon-bedrock-prompt-opt-info-bmpromptoptcardscomponent-tsx), [`BMPromptOptPanelComponent.tsx`](#components-amazon-bedrock-prompt-opt-info-bmpromptoptpanelcomponent-tsx), [`promptOptimizationInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-promptoptimizationinterfaces-ts)
- Usado por: [`BMPromptOptComponent.tsx`](#components-amazon-bedrock-prompt-opt-bmpromptoptcomponent-tsx)

---

<a id="components-amazon-bedrock-prompt-opt-info-bmpromptoptfilterscomponent-tsx"></a>
## `components/amazon-bedrock/prompt-opt/info/BMPromptOptFiltersComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `BMPromptOptFiltersComponent` `({ useContextLevelFilter, onUseContextLevelFilterChange, useTokenLevelFilter, onUseTokenLevelFilterChange, disabled }: BMPromptOptFiltersComponentProps)`

Interfaz `BMPromptOptFiltersComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `useContextLevelFilter` | `boolean` | no | — |
| `onUseContextLevelFilterChange` | `(value: boolean) => void` | no | — |
| `useTokenLevelFilter` | `boolean` | no | — |
| `onUseTokenLevelFilterChange` | `(value: boolean) => void` | no | — |
| `disabled` | `boolean` | no | — |

- Usa: [`label.tsx`](ui.md#components-ui-label-tsx), [`switch.tsx`](ui.md#components-ui-switch-tsx)
- Usado por: [`BMPromptOptInputComponent.tsx`](#components-amazon-bedrock-prompt-opt-info-bmpromptoptinputcomponent-tsx)

---

<a id="components-amazon-bedrock-prompt-opt-info-bmpromptoptinputcomponent-tsx"></a>
## `components/amazon-bedrock/prompt-opt/info/BMPromptOptInputComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `BMPromptOptInputComponent` `({ prompt, setPrompt, bedrockModel, setBedrockModel, target, setTarget, rate, setRate, maxTokens, setMaxTokens, useContextLevelFilter, onUseContextLevelFilterC…`

Interfaz `BMPromptOptInputComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `prompt` | `string` | no | — |
| `setPrompt` | `Dispatch<SetStateAction<string>>` | no | — |
| `bedrockModel` | `string` | no | — |
| `setBedrockModel` | `Dispatch<SetStateAction<string>>` | no | — |
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

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`label.tsx`](ui.md#components-ui-label-tsx), [`textarea.tsx`](ui.md#components-ui-textarea-tsx), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts), [`BedrockModelsFilterComponent.tsx`](general_aws.md#components-general-aws-filters-bedrockmodelsfiltercomponent-tsx), [`BMPromptOptTargetComponent.tsx`](#components-amazon-bedrock-prompt-opt-info-bmpromptopttargetcomponent-tsx), [`BMPromptOptFiltersComponent.tsx`](#components-amazon-bedrock-prompt-opt-info-bmpromptoptfilterscomponent-tsx), [`promptOptimizationInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-promptoptimizationinterfaces-ts)
- Usado por: [`BMPromptOptComponent.tsx`](#components-amazon-bedrock-prompt-opt-bmpromptoptcomponent-tsx)

---

<a id="components-amazon-bedrock-prompt-opt-info-bmpromptoptpanelcomponent-tsx"></a>
## `components/amazon-bedrock/prompt-opt/info/BMPromptOptPanelComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `BMPromptOptPanelComponent` `({ side, label, hint, breakdown, viewMode, emptyMessage }: BMPromptOptPanelComponentProps)`

Interfaz `BMPromptOptPanelComponentProps`:

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

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`azureFoundryFormatters.ts`](../lib.md#lib-azurefoundryformatters-ts), [`BMPromptOptTokensComponent.tsx`](#components-amazon-bedrock-prompt-opt-info-bmpromptopttokenscomponent-tsx), [`promptOptimizationInterfaces.ts`](../tipos.md#interfaces-foundry-cost-optimization-promptoptimizationinterfaces-ts)
- Usado por: [`BMPromptOptComparisonComponent.tsx`](#components-amazon-bedrock-prompt-opt-info-bmpromptoptcomparisoncomponent-tsx)

---

<a id="components-amazon-bedrock-prompt-opt-info-bmpromptopttargetcomponent-tsx"></a>
## `components/amazon-bedrock/prompt-opt/info/BMPromptOptTargetComponent.tsx`

**Componente (cliente)**

Exporta:

- constante `PROMPT_OPT_RATE_MIN` = `5`
- constante `PROMPT_OPT_RATE_MAX` = `95`
- constante `PROMPT_OPT_RATE_STEP` = `5`
- constante `PROMPT_OPT_DEFAULT_RATE` = `50`
- componente `BMPromptOptTargetComponent` `({ target, setTarget, rate, setRate, maxTokens, setMaxTokens, disabled }: BMPromptOptTargetComponentProps)`

Interfaz `BMPromptOptTargetComponentProps`:

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
- Usado por: [`BMPromptOptComponent.tsx`](#components-amazon-bedrock-prompt-opt-bmpromptoptcomponent-tsx), [`BMPromptOptInputComponent.tsx`](#components-amazon-bedrock-prompt-opt-info-bmpromptoptinputcomponent-tsx)

---

<a id="components-amazon-bedrock-prompt-opt-info-bmpromptopttokenscomponent-tsx"></a>
## `components/amazon-bedrock/prompt-opt/info/BMPromptOptTokensComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `BMPromptOptTokensComponent` `({ tokens, viewMode, emptyMessage, originalText }: BMPromptOptTokensComponentProps)`

Interfaz `BMPromptOptTokensComponentProps`:

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
- Usado por: [`BMPromptOptPanelComponent.tsx`](#components-amazon-bedrock-prompt-opt-info-bmpromptoptpanelcomponent-tsx)

