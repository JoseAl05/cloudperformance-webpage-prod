# Componentes `components/aws/vista-advisor/`

[← Índice](../../README.md)

Trusted Advisor y recomendaciones IA de AWS.

Archivos:

- [`components/aws/vista-advisor/AdvisorViewComponent.tsx`](#components-aws-vista-advisor-advisorviewcomponent-tsx)
- [`components/aws/vista-advisor/MainViewAdvisorComponent.tsx`](#components-aws-vista-advisor-mainviewadvisorcomponent-tsx)
- [`components/aws/vista-advisor/grafico/AdvisorViewPieChartComponent.tsx`](#components-aws-vista-advisor-grafico-advisorviewpiechartcomponent-tsx)
- [`components/aws/vista-advisor/info/AdvisorViewInfoComponent.tsx`](#components-aws-vista-advisor-info-advisorviewinfocomponent-tsx)

<a id="components-aws-vista-advisor-advisorviewcomponent-tsx"></a>
## `components/aws/vista-advisor/AdvisorViewComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AdvisorViewComponent` `({ advisorCategory, advisorStatus, startDate, endDate, region, }: AdvisorViewComponentProps)`

Interfaz `AdvisorViewComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `advisorCategory` | `string` | no | — |
| `advisorStatus` | `string` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`

- API: `/api/aws/bridge/advisor/get_advisor_data`, `/api/aws/bridge/advisor/get_ai_recommendations`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx), [`MessageCards.tsx`](cards.md#components-aws-cards-messagecards-tsx), [`advisorViewInterfaces.ts`](../../tipos.md#interfaces-vista-advisor-advisorviewinterfaces-ts), [`AdvisorViewPieChartComponent.tsx`](#components-aws-vista-advisor-grafico-advisorviewpiechartcomponent-tsx), [`AdvisorViewInfoComponent.tsx`](#components-aws-vista-advisor-info-advisorviewinfocomponent-tsx), [`aiRecommendations.ts`](../../tipos.md#interfaces-ai-recommendations-airecommendations-ts), [`AiRecommendationsComponent.tsx`](../generales.md#components-airecommendationscomponent-tsx)
- Usado por: [`MainViewAdvisorComponent.tsx`](#components-aws-vista-advisor-mainviewadvisorcomponent-tsx)

---

<a id="components-aws-vista-advisor-mainviewadvisorcomponent-tsx"></a>
## `components/aws/vista-advisor/MainViewAdvisorComponent.tsx`

**Componente**

Exporta:

- componente `MainViewAdvisorComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`AdvisorViewComponent.tsx`](#components-aws-vista-advisor-advisorviewcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-recomendaciones-page-tsx)

---

<a id="components-aws-vista-advisor-grafico-advisorviewpiechartcomponent-tsx"></a>
## `components/aws/vista-advisor/grafico/AdvisorViewPieChartComponent.tsx`

**Componente (cliente)**

'use client';

⬇️ IMPORTA desde tu config global (ajusta la ruta si corresponde)

Exporta:

- componente `AdvisorViewPieChartComponent` `({ data, sortDesc = true, }: AdvisorViewPieChartComponentProps)`

Interfaz `AdvisorViewPieChartComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AdvisorApiResponse \| null` | no | — |
| `sortDesc` | `boolean` | sí | — |

Internos:

- constante `STATE_COLORS`
- constante `STATES`
- constante `palette`

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`advisorViewInterfaces.ts`](../../tipos.md#interfaces-vista-advisor-advisorviewinterfaces-ts), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`AdvisorViewComponent.tsx`](#components-aws-vista-advisor-advisorviewcomponent-tsx)

Notas de implementación:

- Evitar hydration mismatch
- Orden de categorías según total (asc/desc)
- Colores estables por nombre (independiente del orden)

---

<a id="components-aws-vista-advisor-info-advisorviewinfocomponent-tsx"></a>
## `components/aws/vista-advisor/info/AdvisorViewInfoComponent.tsx`

**Componente (cliente)**

'use client'

Exporta:

- componente `AdvisorViewInfoComponent` `({ data }: AdvisorViewInfoComponentProps)`

Interfaz `AdvisorViewInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AllAdvisorRecommendations[] \| null` | no | — |

- Tipo interno `CheckDetail` = `{ status?: string sync_time?: string categorySpecificSummary?: { costOptimizing?: { estimatedMonthlySavings?: number es…`
- Tipo interno `AdvisorRecMaybeDetails` = `AllAdvisorRecommendationsData & { check_details?: CheckDetail[] }`
Internos:

- función `normalize` `(s: string)`
- función `hasCheckDetails` `(rec: unknown): rec is AdvisorRecMaybeDetails`
- función `fmtCurrencyUSD` `(n?: number)`
- función `fmtPct` `(n?: number)`
- función `shortId` `(id?: string, left = 6, right = 6)`
- función `fmtDateTime` `(dateStr?: string)`
- función `getLatestCheckDetail` `(rec: AllAdvisorRecommendationsData): CheckDetail | null`
- función `getLatestSyncTime` `(rec: AllAdvisorRecommendationsData): string | undefined`
- función `getSortedCheckDetails` `(rec: AllAdvisorRecommendationsData): CheckDetail[]`

- Usa: [`advisorViewInterfaces.ts`](../../tipos.md#interfaces-vista-advisor-advisorviewinterfaces-ts)
- Usado por: [`AdvisorViewComponent.tsx`](#components-aws-vista-advisor-advisorviewcomponent-tsx)

