# Componentes `components/azure/vista-advisor/`

[← Índice](../../README.md)

Azure Advisor y recomendaciones IA de Azure.

Archivos:

- [`components/azure/vista-advisor/AdvisorViewComponent.tsx`](#components-azure-vista-advisor-advisorviewcomponent-tsx)
- [`components/azure/vista-advisor/MainViewAdvisorComponent.tsx`](#components-azure-vista-advisor-mainviewadvisorcomponent-tsx)
- [`components/azure/vista-advisor/grafico/AdvisorViewPieChartComponent.tsx`](#components-azure-vista-advisor-grafico-advisorviewpiechartcomponent-tsx)
- [`components/azure/vista-advisor/info/AdvisorViewInfoComponent.tsx`](#components-azure-vista-advisor-info-advisorviewinfocomponent-tsx)

<a id="components-azure-vista-advisor-advisorviewcomponent-tsx"></a>
## `components/azure/vista-advisor/AdvisorViewComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AdvisorViewComponent` `({ impact, category, startDate, endDate, }: AdvisorViewComponentProps)`

Interfaz `AdvisorViewComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `impact` | `string \| null` | no | — |
| `category` | `string \| null` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |

Interfaz `AzureAdvisorRecommendation`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_cq_sync_time` | `{ $date: string }` | no | — |
| `impact` | `string` | no | — |
| `high_impact` | `number` | no | — |
| `medium_impact` | `number` | no | — |
| `low_impact` | `number` | no | — |
| `category` | `string` | no | — |
| `impacted_value` | `string` | no | — |
| `impacted_value_count` | `number` | no | — |
| `last_updated` | `string` | no | — |
| `problem` | `string` | no | — |
| `total_recommendations` | `number` | no | — |
| `visual_impact` | `string` | no | — |
| `resource_type` | `string` | no | — |

- Tipo interno `AzureAdvisorApiResponse` = `AzureAdvisorRecommendation[]`
Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`

- API: `/api/azure/bridge/azure/get_ai_recommendations`, `/api/azure/bridge/azure/vista-asesor`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx), [`MessageCards.tsx`](cards.md#components-azure-cards-messagecards-tsx), [`AdvisorViewPieChartComponent.tsx`](#components-azure-vista-advisor-grafico-advisorviewpiechartcomponent-tsx), [`AdvisorViewInfoComponent.tsx`](#components-azure-vista-advisor-info-advisorviewinfocomponent-tsx), [`aiRecommendations.ts`](../../tipos.md#interfaces-ai-recommendations-airecommendations-ts), [`AiRecommendationsComponent.tsx`](../generales.md#components-airecommendationscomponent-tsx)
- Usado por: [`MainViewAdvisorComponent.tsx`](#components-azure-vista-advisor-mainviewadvisorcomponent-tsx)

Notas de implementación:

- Validación: Ambos filtros deben estar seleccionados null/undefined = No seleccionado '' (vacío) = "Ver todos" (SÍ está seleccionado) 'valor' = Filtro específico (SÍ está seleccionado)
- Construir URL con parámetros opcionales
- Solo agregar filtros si NO son vacíos (vacío = "Ver todos")
- Mostrar mensaje si no se han seleccionado los filtros obligatorios

---

<a id="components-azure-vista-advisor-mainviewadvisorcomponent-tsx"></a>
## `components/azure/vista-advisor/MainViewAdvisorComponent.tsx`

**Componente**

Exporta:

- componente `MainViewAdvisorComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`AdvisorViewComponent.tsx`](#components-azure-vista-advisor-advisorviewcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-recomendaciones-page-tsx)

---

<a id="components-azure-vista-advisor-grafico-advisorviewpiechartcomponent-tsx"></a>
## `components/azure/vista-advisor/grafico/AdvisorViewPieChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AdvisorViewPieChartComponent` `({ data, }: AdvisorViewPieChartComponentProps)`

Interfaz `AzureAdvisorRecommendation`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_cq_sync_time` | `{ $date: string }` | no | — |
| `impact` | `string` | no | — |
| `high_impact` | `number` | no | — |
| `medium_impact` | `number` | no | — |
| `low_impact` | `number` | no | — |
| `category` | `string` | no | — |
| `impacted_value` | `string` | no | — |
| `impacted_value_count` | `number` | no | — |
| `last_updated` | `string` | no | — |
| `problem` | `string` | no | — |
| `total_recommendations` | `number` | no | — |
| `visual_impact` | `string` | no | — |
| `resource_type` | `string` | no | — |

Interfaz `AdvisorViewPieChartComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AzureAdvisorRecommendation[] \| null` | no | — |

Internos:

- constante `IMPACT_COLORS`

- Hooks: `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx)
- Usado por: [`AdvisorViewComponent.tsx`](#components-azure-vista-advisor-advisorviewcomponent-tsx)

Notas de implementación:

- _IMPACT_COLORS_: `'Alto': '#dc2626',` — Rojo
- _IMPACT_COLORS_: `'Medio': '#eab308',` — Amarillo
- _IMPACT_COLORS_: `'Bajo': '#3b82f6',` — Azul
- Evitar hydration mismatch
- Tomar los valores del primer registro (todos tienen los mismos totales)
- `].filter(item => item.value > 0);` — Solo mostrar los que tienen valor
- (Re)inicializar y setear opciones
- Resize handling

---

<a id="components-azure-vista-advisor-info-advisorviewinfocomponent-tsx"></a>
## `components/azure/vista-advisor/info/AdvisorViewInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AdvisorViewInfoComponent` `({ data, startDate, endDate }: AdvisorViewInfoComponentProps)`

Interfaz `AzureAdvisorRecommendation`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_cq_sync_time` | `{ $date: string }` | no | — |
| `impact` | `string` | no | — |
| `high_impact` | `number` | no | — |
| `medium_impact` | `number` | no | — |
| `low_impact` | `number` | no | — |
| `category` | `string` | no | — |
| `impacted_value` | `string` | no | — |
| `impacted_value_count` | `number` | no | — |
| `last_updated` | `string` | no | — |
| `problem` | `string` | no | — |
| `total_recommendations` | `number` | no | — |
| `visual_impact` | `string` | no | — |
| `resource_type` | `string` | no | — |

Interfaz `AdvisorViewInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AzureAdvisorRecommendation[] \| null` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |

Interfaz `DetailResource`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `impacted_value` | `string` | no | — |
| `last_updated` | `string` | no | — |
| `solution` | `string` | no | — |
| `subscription` | `string` | no | — |

Interfaz `GroupedRecommendation`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `problem` | `string` | no | — |
| `impact` | `string` | no | — |
| `visual_impact` | `string` | no | — |
| `category` | `string` | no | — |
| `resource_type` | `string` | no | — |
| `last_updated` | `string` | no | — |
| `impacted_values` | `string[]` | no | — |
| `impacted_count` | `number` | no | — |
| `first_impacted_value` | `string` | no | — |

Interfaz `CategoryGroup`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `category` | `string` | no | — |
| `recommendations` | `GroupedRecommendation[]` | no | — |

Interfaz `DetailModalProps` — Componente Modal de Detalle:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resources` | `AzureAdvisorRecommendation[]` | no | — |
| `onClose` | `() => void` | no | — |

Internos:

- función `normalize` `(s: string)`
- componente `DetailModal` `({ resources, onClose }: DetailModalProps)`

- Usado por: [`AdvisorViewComponent.tsx`](#components-azure-vista-advisor-advisorviewcomponent-tsx)

Notas de implementación:

- Agrupar primero por problem, luego por category
- Paso 1: Agrupar por problem
- Paso 2: Crear recomendaciones agrupadas
- Paso 3: Agrupar por categoría
- Paso 4: Convertir a array y ordenar
- Auto-select first recommendation
- Obtener todos los recursos del grupo seleccionado
- Buscar en safeData todos los registros que tengan el mismo problem
- JSX — Panel Izquierdo - Categorías y Recomendaciones
- JSX — Panel Derecho - Detalle de Recomendación
- JSX — Información Principal
- JSX — Recursos Afectados
- JSX — Modal de detalle
- _DetailModal_: JSX — Necesitaríamos agregar subscription al registro, por ahora mostramos placeholder

