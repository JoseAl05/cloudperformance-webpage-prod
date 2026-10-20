# Componentes `components/gcp/vista-recommender/`

[← Índice](../../README.md)

Recommender de GCP y recomendaciones IA.

Archivos:

- [`components/gcp/vista-recommender/MainViewRecommenderComponent.tsx`](#components-gcp-vista-recommender-mainviewrecommendercomponent-tsx)
- [`components/gcp/vista-recommender/RecommenderComponent.tsx`](#components-gcp-vista-recommender-recommendercomponent-tsx)
- [`components/gcp/vista-recommender/grafico/RecommenderPieChartComponent.tsx`](#components-gcp-vista-recommender-grafico-recommenderpiechartcomponent-tsx)
- [`components/gcp/vista-recommender/info/RecommenderInfoComponent.tsx`](#components-gcp-vista-recommender-info-recommenderinfocomponent-tsx)

<a id="components-gcp-vista-recommender-mainviewrecommendercomponent-tsx"></a>
## `components/gcp/vista-recommender/MainViewRecommenderComponent.tsx`

**Componente**

Exporta:

- componente `MainViewRecommenderComponent` `()`

- Usa: [`RecommenderComponent.tsx`](#components-gcp-vista-recommender-recommendercomponent-tsx), [`UnusedCeComponent.tsx`](vista-recursos.md#components-gcp-vista-recursos-sin-uso-compute-engine-unusedcecomponent-tsx), [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-recomendaciones-page-tsx)

---

<a id="components-gcp-vista-recommender-recommendercomponent-tsx"></a>
## `components/gcp/vista-recommender/RecommenderComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RecommenderComponent` `({ startDate, endDate, category, priority, regions, projects }: RecommenderComponentProps)`

Interfaz `RecommenderComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `category` | `string` | no | — |
| `priority` | `string` | no | — |
| `regions` | `string` | no | — |
| `projects` | `string` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`

- API: `/api/gcp/bridge/gcp/ai_recommendations/get_ai_recommendations`, `/api/gcp/bridge/gcp/recommender/get_recommendations`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`AiRecommendationsComponent.tsx`](../generales.md#components-airecommendationscomponent-tsx), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`RecommenderPieChartComponent.tsx`](#components-gcp-vista-recommender-grafico-recommenderpiechartcomponent-tsx), [`RecommenderInfoComponent.tsx`](#components-gcp-vista-recommender-info-recommenderinfocomponent-tsx), [`LoaderComponent.tsx`](../general_gcp.md#components-general-gcp-loadercomponent-tsx), [`aiRecommendations.ts`](../../tipos.md#interfaces-ai-recommendations-airecommendations-ts), [`gcpRecommenderInterfaces.ts`](../../tipos.md#interfaces-vista-recommender-gcprecommenderinterfaces-ts)
- Usado por: [`MainViewRecommenderComponent.tsx`](#components-gcp-vista-recommender-mainviewrecommendercomponent-tsx)

---

<a id="components-gcp-vista-recommender-grafico-recommenderpiechartcomponent-tsx"></a>
## `components/gcp/vista-recommender/grafico/RecommenderPieChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RecommenderPieChartComponent` `({ data, sortDesc = true, }: RecommenderPieChartComponentProps)`

Interfaz `RecommenderPieChartComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `RecommenderGcp[]` | no | — |
| `sortDesc` | `boolean` | sí | — |

Internos:

- constante `palette`

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts), [`gcpRecommenderInterfaces.ts`](../../tipos.md#interfaces-vista-recommender-gcprecommenderinterfaces-ts)
- Usado por: [`RecommenderComponent.tsx`](#components-gcp-vista-recommender-recommendercomponent-tsx)

---

<a id="components-gcp-vista-recommender-info-recommenderinfocomponent-tsx"></a>
## `components/gcp/vista-recommender/info/RecommenderInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RecommenderInfoComponent` `({ data }: RecommenderInfoComponentProps)`

Interfaz `RecommenderInfoComponentProps` — NOTA: Ajusta tu interfaz si es necesario, el JSON usa 'savings_estimate':

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `RecommenderGcp[] \| null` | no | — |

Interfaz `GroupedRecommender`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `description` | `string` | no | — |
| `category` | `string` | no | — |
| `recommender_subtype` | `string` | no | — |
| `priority` | `string` | no | — |
| `last_refresh_time` | `string` | no | — |
| `total_savings` | `number` | no | — |
| `currency` | `string` | no | — |
| `count` | `number` | no | — |
| `items` | `RecommenderGcp[]` | no | — |

Internos:

- función `normalize` `(s: string)`

- Usa: [`gcpRecommenderInterfaces.ts`](../../tipos.md#interfaces-vista-recommender-gcprecommenderinterfaces-ts)
- Usado por: [`RecommenderComponent.tsx`](#components-gcp-vista-recommender-recommendercomponent-tsx)

Notas de implementación:

- Agrupar por Category -> Description
- CAMBIO 1: Solo sumar si es categoría COST y usar Math.abs para quitar el negativo
- JSX — CAMBIO 2: Condicional para mostrar badge de ahorro solo si es COST
- JSX — CAMBIO 3: Renderizado condicional de la tarjeta de Ahorro
- Placeholder o Info cuando no es costo
- JSX — CAMBIO 5: Ocultar celda de ahorro si no es COST

