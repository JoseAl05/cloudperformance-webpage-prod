# Componentes `components/ai-finops-metrics/`

[← Índice](../README.md)

Vista de métricas FinOps generadas por IA (resumen financiero y técnico, recursos ociosos, análisis detallado), común a las tres nubes.

Archivos:

- [`components/ai-finops-metrics/AiFinopsMetricsComponent.tsx`](#components-ai-finops-metrics-aifinopsmetricscomponent-tsx)
- [`components/ai-finops-metrics/MainViewAiFinopsMetricsComponent.tsx`](#components-ai-finops-metrics-mainviewaifinopsmetricscomponent-tsx)
- [`components/ai-finops-metrics/details/DetailedMetricsAnalysis.tsx`](#components-ai-finops-metrics-details-detailedmetricsanalysis-tsx)
- [`components/ai-finops-metrics/general-status/GeneralStatus.tsx`](#components-ai-finops-metrics-general-status-generalstatus-tsx)
- [`components/ai-finops-metrics/summary/AnalyzedMetricsSummary.tsx`](#components-ai-finops-metrics-summary-analyzedmetricssummary-tsx)
- [`components/ai-finops-metrics/summary/FinancialSummary.tsx`](#components-ai-finops-metrics-summary-financialsummary-tsx)
- [`components/ai-finops-metrics/summary/IdleResources.tsx`](#components-ai-finops-metrics-summary-idleresources-tsx)
- [`components/ai-finops-metrics/summary/TechnicalSummary.tsx`](#components-ai-finops-metrics-summary-technicalsummary-tsx)

<a id="components-ai-finops-metrics-aifinopsmetricscomponent-tsx"></a>
## `components/ai-finops-metrics/AiFinopsMetricsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AiFinopsMetricsComponent` `({ startDate, endDate, cloud }: AiFinopsMetricsComponentProps)`

Interfaz `AiFinopsMetricsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `cloud` | `string` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`

- API: `/api/aws/bridge/finops_metrics/get_finops_metrics`, `/api/azure/bridge/azure/finops_metrics/get_finops_metrics`, `/api/gcp/bridge/gcp/finops_metrics/get_finops_metrics`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`DetailedMetricsAnalysis.tsx`](#components-ai-finops-metrics-details-detailedmetricsanalysis-tsx), [`GeneralStatus.tsx`](#components-ai-finops-metrics-general-status-generalstatus-tsx), [`AnalyzedMetricsSummary.tsx`](#components-ai-finops-metrics-summary-analyzedmetricssummary-tsx), [`FinancialSummary.tsx`](#components-ai-finops-metrics-summary-financialsummary-tsx), [`TechnicalSummary.tsx`](#components-ai-finops-metrics-summary-technicalsummary-tsx), [`IdleResources.tsx`](#components-ai-finops-metrics-summary-idleresources-tsx), [`MessageCards.tsx`](aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx), [`aiFinopsMetricsInterfaces.ts`](../tipos.md#interfaces-ai-finops-metrics-aifinopsmetricsinterfaces-ts)
- Usado por: [`MainViewAiFinopsMetricsComponent.tsx`](#components-ai-finops-metrics-mainviewaifinopsmetricscomponent-tsx)

Notas de implementación:

- JSX — SECCIÓN 1: RESUMEN FINANCIERO
- JSX — SECCIÓN 2: RESUMEN TÉCNICO

---

<a id="components-ai-finops-metrics-mainviewaifinopsmetricscomponent-tsx"></a>
## `components/ai-finops-metrics/MainViewAiFinopsMetricsComponent.tsx`

**Componente**

Exporta:

- componente `MainViewAiFinopsMetricsComponent` `({cloud}: MainViewAiFinopsMetricsComponentProps)`

Interfaz `MainViewAiFinopsMetricsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `string` | no | — |

- Usa: [`AiFinopsMetricsComponent.tsx`](#components-ai-finops-metrics-aifinopsmetricscomponent-tsx), [`UnusedCeComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-compute-engine-unusedcecomponent-tsx), [`FiltersComponent.tsx`](general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](general_azure.md#components-general-azure-filters-filterscomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-dashboards-nubes-cloud-aws-finops-metrics-ai-page-tsx), [`page.tsx`](../rutas.md#app-dashboards-nubes-cloud-azure-finops-metrics-ai-page-tsx), [`page.tsx`](../rutas.md#app-dashboards-nubes-cloud-gcp-finops-metrics-ai-page-tsx)

---

<a id="components-ai-finops-metrics-details-detailedmetricsanalysis-tsx"></a>
## `components/ai-finops-metrics/details/DetailedMetricsAnalysis.tsx`

**Componente**

Exporta:

- componente `DetailedMetricsAnalysis` `({ data }: DetailedMetricsAnalysisProps)`

Interfaz `DetailedMetricsAnalysisProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AiFinopsMetrics` | no | — |

Interfaz `StandardMetricDetailProps` — Sub-componente: Detalle Estándar:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metricData` | `CostVolatilityAnalysis \| CpuEfficiencyAnalysis \| ElasticityAnalysis` | no | — |
| `type` | `'cost_volatility' \| 'cpu_efficiency' \| 'elasticity'` | no | — |

Interfaz `ModelComparisonTableProps` — Sub-componente: Tabla comparativa de modelos (proyección + backtest):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `projections` | `AiFinopsMetrics['spending_forecast']['deterministic']['projections']` | no | — |
| `mape` | `AiFinopsMetrics['spending_forecast']['deterministic']['backtest_mape_…` | no | — |
| `wape` | `AiFinopsMetricsForecastDeterministic['backtest_wape_pct']` | sí | — |
| `recommended` | `string` | no | — |
| `modelsConsidered` | `string[]` | no | — |

Interfaz `ForecastCardProps` — Sub-componente Forecast Card:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `periods` | `ForecastPeriod` | no | — |
| `interval` | `{ low: number; point: number; high: number }` | sí | — |
| `title` | `string` | no | — |
| `icon` | `React.ElementType` | no | — |
| `iconColor` | `string` | no | — |

Internos:

- constante `METRIC_OPTIONS`
- componente `MarkdownText` `({ content }: { content: string })` — Utils
- función `getStatusColor` `(status: string)`
- componente `EmptyState` `()`
- constante `ITEMS_PER_PAGE`
- componente `StandardMetricDetail` `({ metricData, type }: StandardMetricDetailProps)`
- componente `OpportunityCostDetail` `({ metricData }: { metricData: OpportunityCostAnalysis })` — Sub-componente: Detalle Costo de Oportunidad
- componente `MaturityDetail` `({ metricData }: { metricData: MaturityAssessmentAnalysis })` — Sub-componente: Detalle Madurez
- constante `MODEL_LABELS` — Sub-componente: Detalle Forecast
- función `getConfidenceClasses` `(confidence: string)`
- componente `TrendIcon` `({ direction }: { direction: string })`
- función `trendLabel` `(direction: string)`
- componente `ForecastDetail` `({ forecastData }: { forecastData: AiFinopsMetrics['spending_forecast'] })`
- componente `StatTile` `({ icon, label, value, hint, }: { icon: React.ReactNode; label: string; value: string; hint?: string; })` — Sub-componente: Tile de diagnóstico
- componente `ModelComparisonTable` `({ projections, mape, wape, recommended, modelsConsidered }: ModelComparisonTableProps)`
- componente `ForecastCard` `({ periods, interval, title, icon: Icon, iconColor }: ForecastCardProps)`

- Usa: [`select.tsx`](ui.md#components-ui-select-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`badge.tsx`](ui.md#components-ui-badge-tsx), [`separator.tsx`](ui.md#components-ui-separator-tsx), [`aiFinopsMetricsInterfaces.ts`](../tipos.md#interfaces-ai-finops-metrics-aifinopsmetricsinterfaces-ts), [`input.tsx`](ui.md#components-ui-input-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`IdleResources.tsx`](#components-ai-finops-metrics-summary-idleresources-tsx)
- Usado por: [`AiFinopsMetricsComponent.tsx`](#components-ai-finops-metrics-aifinopsmetricscomponent-tsx)

Notas de implementación:

- _StandardMetricDetail_: Estados para paginación y búsqueda
- _StandardMetricDetail_: Extracción de Datos (Misma lógica anterior)
- _StandardMetricDetail_: Lógica de Filtrado y Paginación
- _StandardMetricDetail_: 1. Filtrar
- _StandardMetricDetail_: 2. Calcular Páginas
- _StandardMetricDetail_: 3. Obtener items actuales
- _StandardMetricDetail_: Resetear a página 1 cuando cambia la búsqueda
- _StandardMetricDetail_: Helpers para color de estado (Misma lógica)
- _StandardMetricDetail_: JSX — KPI Card Principal (Sin cambios)
- _StandardMetricDetail_: JSX — SECCIÓN DE RECURSOS CON FILTRO Y PAGINACIÓN
- _StandardMetricDetail_: JSX — Buscador
- _StandardMetricDetail_: JSX — Lista de Tarjetas Paginada
- _StandardMetricDetail_: JSX — Controles de Paginación

---

<a id="components-ai-finops-metrics-general-status-generalstatus-tsx"></a>
## `components/ai-finops-metrics/general-status/GeneralStatus.tsx`

**Componente**

Componente de shadcn

Exporta:

- componente `GeneralStatus` `({ data }: GeneralStatusProps)`

Interfaz `GeneralStatusProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AiFinopsMetrics` | no | — |

Internos:

- componente `MarkdownText` `({ content }: { content: string })`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`badge.tsx`](ui.md#components-ui-badge-tsx), [`separator.tsx`](ui.md#components-ui-separator-tsx), [`aiFinopsMetricsInterfaces.ts`](../tipos.md#interfaces-ai-finops-metrics-aifinopsmetricsinterfaces-ts)
- Usado por: [`AiFinopsMetricsComponent.tsx`](#components-ai-finops-metrics-aifinopsmetricscomponent-tsx)

Notas de implementación:

- Formateadores
- Color dinámico para el Score
- JSX — KPIs Principales: Grid de 2 columnas en pantallas medianas+
- JSX — KPI 1: Global Score
- JSX — Elemento decorativo de fondo
- JSX — KPI 2: Ahorros Potenciales
- JSX — Elemento decorativo de fondo
- JSX — Barra de Metadata: Información técnica del reporte
- JSX — Proveedor
- JSX — Fecha de Generación
- JSX — Última Sincronización

---

<a id="components-ai-finops-metrics-summary-analyzedmetricssummary-tsx"></a>
## `components/ai-finops-metrics/summary/AnalyzedMetricsSummary.tsx`

**Componente**

Exporta:

- componente `AnalyzedMetricsSummary` `({ data }: AnalyzedMetricsSummaryProps)`

Interfaz `AnalyzedMetricsSummaryProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AiFinopsMetrics` | no | — |

Interfaz `FilterBarProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `activeFilters` | `Set<string>` | no | — |
| `onToggle` | `(value: string) => void` | no | — |
| `onClear` | `() => void` | no | — |

Interfaz `AttributeBadgeProps` — Helpers para Badges (Etiquetas):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `icon` | `React.ReactNode` | no | — |
| `title` | `string` | no | — |
| `label` | `string` | no | — |
| `colorClass` | `string` | no | — |

Internos:

- constante `FILTER_OPTIONS`
- función `getFilterLabel` `(value: string): string`
- función `actionMatchesFilters` `(action: AiFinopsMetricsTopAction, activeFilters: Set<string>): boolean`
- constante `LEGEND_SECTIONS` — Sub-componentes
- componente `MatrixLegend` `()`
- componente `FilterBar` `({ activeFilters, onToggle, onClear }: FilterBarProps)`
- componente `ActionItemRow` `({ actionItem, index }: { actionItem: AiFinopsMetricsTopAction, index: number })`
- componente `AttributeBadge` `({ icon, title, label, colorClass }: AttributeBadgeProps)`
- componente `RiskBadge` `({ level }: { level: RiskLevel })`
- componente `ImpactBadge` `({ impact }: { impact: OperationalImpact })`
- componente `ReversibilityBadge` `({ reversibility }: { reversibility: Reversibility })`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`aiFinopsMetricsInterfaces.ts`](../tipos.md#interfaces-ai-finops-metrics-aifinopsmetricsinterfaces-ts)
- Usado por: [`AiFinopsMetricsComponent.tsx`](#components-ai-finops-metrics-aifinopsmetricscomponent-tsx)

Notas de implementación:

- _ActionItemRow_: JSX — Contenedor de badges
- _ActionItemRow_: JSX — 1. Target Professional
- _ActionItemRow_: JSX — 2. Risk Level
- _ActionItemRow_: JSX — 3. Operational Impact
- _ActionItemRow_: JSX — 4. Reversibility
- _RiskBadge_: `let color = "bg-gray-100 text-gray-800 border-gray-200";` — Default

---

<a id="components-ai-finops-metrics-summary-financialsummary-tsx"></a>
## `components/ai-finops-metrics/summary/FinancialSummary.tsx`

**Componente**

Exporta:

- componente `FinancialSummary` `({ data }: FinancialSummaryProps)`

Interfaz `FinancialSummaryProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AiFinopsMetrics` | no | — |

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`badge.tsx`](ui.md#components-ui-badge-tsx), [`aiFinopsMetricsInterfaces.ts`](../tipos.md#interfaces-ai-finops-metrics-aifinopsmetricsinterfaces-ts)
- Usado por: [`AiFinopsMetricsComponent.tsx`](#components-ai-finops-metrics-aifinopsmetricscomponent-tsx)

---

<a id="components-ai-finops-metrics-summary-idleresources-tsx"></a>
## `components/ai-finops-metrics/summary/IdleResources.tsx`

**Componente**

Exporta:

- componente `IdleResources` `({ data }: IdleResourcesProps)`

Interfaz `IdleResourcesProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AiFinopsMetrics` | no | — |

Internos:

- función `formatCurrency` `(value: number)`
- constante `REASON_META`
- componente `ReasonBadge` `({ reason }: { reason: string })`
- componente `DiskRow` `({ disk }: { disk: IdleDisk })`
- componente `PublicIpRow` `({ ip }: { ip: IdlePublicIp })`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`aiFinopsMetricsInterfaces.ts`](../tipos.md#interfaces-ai-finops-metrics-aifinopsmetricsinterfaces-ts)
- Usado por: [`AiFinopsMetricsComponent.tsx`](#components-ai-finops-metrics-aifinopsmetricscomponent-tsx), [`DetailedMetricsAnalysis.tsx`](#components-ai-finops-metrics-details-detailedmetricsanalysis-tsx)

---

<a id="components-ai-finops-metrics-summary-technicalsummary-tsx"></a>
## `components/ai-finops-metrics/summary/TechnicalSummary.tsx`

**Componente**

Exporta:

- componente `TechnicalSummary` `({ data }: TechnicalSummaryProps)`

Interfaz `TechnicalSummaryProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AiFinopsMetrics` | no | — |

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`progress.tsx`](ui.md#components-ui-progress-tsx), [`aiFinopsMetricsInterfaces.ts`](../tipos.md#interfaces-ai-finops-metrics-aifinopsmetricsinterfaces-ts)
- Usado por: [`AiFinopsMetricsComponent.tsx`](#components-ai-finops-metrics-aifinopsmetricscomponent-tsx)

