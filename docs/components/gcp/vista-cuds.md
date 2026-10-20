# Componentes `components/gcp/vista-cuds/`

[← Índice](../../README.md)

Compromisos de GCP: CUDs flexibles y planes de compromiso.

Archivos:

- [`components/gcp/vista-cuds/resource-based-cuds/MainViewSavingPlansComponent.tsx`](#components-gcp-vista-cuds-resource-based-cuds-mainviewsavingplanscomponent-tsx)
- [`components/gcp/vista-cuds/resource-based-cuds/SavingPlansComponent.tsx`](#components-gcp-vista-cuds-resource-based-cuds-savingplanscomponent-tsx)
- [`components/gcp/vista-cuds/spend-based-cuds/MainViewSpendBasedCudsComponent.tsx`](#components-gcp-vista-cuds-spend-based-cuds-mainviewspendbasedcudscomponent-tsx)
- [`components/gcp/vista-cuds/spend-based-cuds/SpendBasedCudsComponent.tsx`](#components-gcp-vista-cuds-spend-based-cuds-spendbasedcudscomponent-tsx)
- [`components/gcp/vista-cuds/spend-based-cuds/graficos/FlexibleCudLineChartComponent.tsx`](#components-gcp-vista-cuds-spend-based-cuds-graficos-flexiblecudlinechartcomponent-tsx)
- [`components/gcp/vista-cuds/spend-based-cuds/table/SpendBasedCudsTable.tsx`](#components-gcp-vista-cuds-spend-based-cuds-table-spendbasedcudstable-tsx)

<a id="components-gcp-vista-cuds-resource-based-cuds-mainviewsavingplanscomponent-tsx"></a>
## `components/gcp/vista-cuds/resource-based-cuds/MainViewSavingPlansComponent.tsx`

**Componente**

Exporta:

- componente `MainViewSavingPlansComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`SavingPlansComponent.tsx`](#components-gcp-vista-cuds-resource-based-cuds-savingplanscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-compromisos-resource-based-cuds-page-tsx)

---

<a id="components-gcp-vista-cuds-resource-based-cuds-savingplanscomponent-tsx"></a>
## `components/gcp/vista-cuds/resource-based-cuds/SavingPlansComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `GcpCommitmentsViewComponent` `({ startDate, endDate }: Props)` — Component

Interfaz `CommitmentResource` — Types:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `type_` | `'VCPU' \| 'MEMORY'` | no | — |
| `amount` | `string` | no | — |

Interfaz `CoveredInstance`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `vm_name` | `string` | no | — |
| `total_saved_usd` | `number` | no | — |

Interfaz `GcpCommitment`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `commitment_id` | `string` | no | — |
| `commitment_name` | `string` | no | — |
| `status` | `string` | no | — |
| `plan_type` | `string` | no | — |
| `region` | `string` | no | — |
| `project_id` | `string` | no | — |
| `start_timestamp` | `string` | no | — |
| `end_timestamp` | `string` | no | — |
| `resources` | `CommitmentResource[]` | no | — |
| `billing_period_cost` | `number` | no | — |
| `covered_instances` | `CoveredInstance[]` | no | — |
| `currency` | `string` | no | — |

Interfaz `Props`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |

Internos:

- función `formatCurrency` `(amount: number)` — Utils & Formatters

- API: `/api/gcp/bridge/gcp/vista/savings_plans`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx), [`LoaderComponent.tsx`](../general_gcp.md#components-general-gcp-loadercomponent-tsx)
- Usado por: [`MainViewSavingPlansComponent.tsx`](#components-gcp-vista-cuds-resource-based-cuds-mainviewsavingplanscomponent-tsx)

Notas de implementación:

- Lógica de Negocio
- JSX — 1. Header con Selector
- JSX — 2. DIAGNÓSTICO INTELIGENTE (Nuevo)
- JSX — 3. TARJETAS DE INDICADORES (KPIs)
- JSX — Costo
- JSX — Ahorro
- JSX — Resultado Neto
- JSX — Estado
- JSX — 4. DETALLES DIVIDIDOS (Explicativos)
- JSX — Panel Izquierdo: Qué contraté
- JSX — Panel Derecho: Quién lo usa

---

<a id="components-gcp-vista-cuds-spend-based-cuds-mainviewspendbasedcudscomponent-tsx"></a>
## `components/gcp/vista-cuds/spend-based-cuds/MainViewSpendBasedCudsComponent.tsx`

**Componente**

Exporta:

- componente `MainViewSavingPlansComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`SpendBasedCudsComponent.tsx`](#components-gcp-vista-cuds-spend-based-cuds-spendbasedcudscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-compromisos-spend-based-cuds-page-tsx)

Notas de implementación:

- monthYearFilter

---

<a id="components-gcp-vista-cuds-spend-based-cuds-spendbasedcudscomponent-tsx"></a>
## `components/gcp/vista-cuds/spend-based-cuds/SpendBasedCudsComponent.tsx`

**Componente (cliente)**

Asumiendo que tienes un MessageCard como en el ejemplo

Exporta:

- interfaz `ChartTrend`
- componente `SpendBasedCudsComponent` `({ startDate, endDate }: SpendBasedCudsComponentProps)` — Component

Interfaz `ComponentDiscounted` — Types:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `key` | `string` | no | — |
| `value` | `string` | no | — |

Interfaz `TableDetail`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instance_name` | `string` | no | — |
| `project_id` | `string` | no | — |
| `region` | `string` | no | — |
| `saved_amount_usd` | `number` | no | — |
| `components_discounted` | `ComponentDiscounted[]` | no | — |

Interfaz `ChartTrend` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `date` | `string` | no | — |
| `commitment_fee_usd` | `number` | no | — |
| `savings_generated_usd` | `number` | no | — |
| `net_impact_usd` | `number` | no | — |

Interfaz `CardsKpis`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cud_name` | `string` | no | — |
| `hourly_commitment_usd` | `number` | no | — |
| `total_commitment_cost_usd` | `number` | no | — |
| `total_savings_generated_usd` | `number` | no | — |
| `net_impact_usd` | `number` | no | — |
| `utilization_percentage` | `number` | no | — |
| `status` | `string` | no | — |

Interfaz `SpendBasedCudData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cards_kpis` | `CardsKpis` | no | — |
| `chart_trend` | `ChartTrend[]` | no | — |
| `table_details` | `TableDetail[]` | no | — |
| `message` | `string` | sí | — |

Interfaz `SpendBasedCudsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |

Internos:

- función `formatCurrency` `(amount: number)` — Utils & Formatters

- API: `/api/gcp/bridge/gcp/cud/cud_flexible`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx), [`LoaderComponent.tsx`](../general_gcp.md#components-general-gcp-loadercomponent-tsx), [`FlexibleCudLineChartComponent.tsx`](#components-gcp-vista-cuds-spend-based-cuds-graficos-flexiblecudlinechartcomponent-tsx), [`SpendBasedCudsTable.tsx`](#components-gcp-vista-cuds-spend-based-cuds-table-spendbasedcudstable-tsx), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx)
- Usado por: [`MainViewSpendBasedCudsComponent.tsx`](#components-gcp-vista-cuds-spend-based-cuds-mainviewspendbasedcudscomponent-tsx)

Notas de implementación:

- _SpendBasedCudsComponent_: Preparamos las fechas
- _SpendBasedCudsComponent_: Llamada al endpoint
- _SpendBasedCudsComponent_: 1. Manejo de Estado de Carga (Responsivo y alineado al ejemplo)
- _SpendBasedCudsComponent_: 2. Manejo de Errores
- _SpendBasedCudsComponent_: 3. Manejo de Datos Vacíos o Mensajes del Backend
- _SpendBasedCudsComponent_: Extracción de Datos
- _SpendBasedCudsComponent_: CLAVE DEL FIX: w-full min-w-0 px-4 py-6 (Exactamente igual que RecommenderComponent) Eliminamos max-w-7xl o cualquier restricción de ancho máximo
- _SpendBasedCudsComponent_: JSX — 1. HEADER
- _SpendBasedCudsComponent_: JSX — 2. DIAGNÓSTICO INTELIGENTE
- _SpendBasedCudsComponent_: JSX — ({cards_kpis.utilization_percentage}% de uso)
- _SpendBasedCudsComponent_: JSX — 3. TARJETAS DE INDICADORES (KPIs) - GRID FLUIDA
- _SpendBasedCudsComponent_: JSX — 👇 TEXTO CON ICONO lucide
- _SpendBasedCudsComponent_: JSX — 4. GRÁFICO DE TENDENCIA
- _SpendBasedCudsComponent_: JSX — 5. TABLA DE DETALLES

---

<a id="components-gcp-vista-cuds-spend-based-cuds-graficos-flexiblecudlinechartcomponent-tsx"></a>
## `components/gcp/vista-cuds/spend-based-cuds/graficos/FlexibleCudLineChartComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `ChartTrend` — Tipos de datos que provienen de la API
- componente `FlexibleCudLineChartComponent` `({ data }: FlexibleCudLineChartComponentProps)`

Interfaz `ChartTrend` (exportada) — Tipos de datos que provienen de la API:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `date` | `string` | no | — |
| `commitment_fee_usd` | `number` | no | — |
| `savings_generated_usd` | `number` | no | — |
| `net_impact_usd` | `number` | no | — |

Interfaz `FlexibleCudLineChartComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ChartTrend[]` | no | — |

Internos:

- función `toUTCDate` `(s: string)`
- constante `fmt`

- Hooks: `useECharts`, `useTheme`
- Usa: [`button.tsx`](../ui.md#components-ui-button-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`SpendBasedCudsComponent.tsx`](#components-gcp-vista-cuds-spend-based-cuds-spendbasedcudscomponent-tsx)

Notas de implementación:

- _FlexibleCudLineChartComponent_: Series para ECharts
- _FlexibleCudLineChartComponent_: CORRECCIÓN: Se envían tal cual vienen de la API (positivos)
- _FlexibleCudLineChartComponent_: CORRECCIÓN: Ya no usamos Math.abs para no "engañar" al eje
- _FlexibleCudLineChartComponent_: `min: 0` — Forzamos a que el gráfico empiece en 0 y suba

---

<a id="components-gcp-vista-cuds-spend-based-cuds-table-spendbasedcudstable-tsx"></a>
## `components/gcp/vista-cuds/spend-based-cuds/table/SpendBasedCudsTable.tsx`

**Componente (cliente)**

Exporta:

- interfaz `TableDetail`
- componente `SpendBasedCudsTable` `({ data }: { data: TableDetail[] })`

Interfaz `TableDetail` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instance_name` | `string` | no | — |
| `component` | `string` | no | — |
| `sku` | `string` | no | — |
| `project_id` | `string` | no | — |
| `region` | `string` | no | — |
| `list_cost_usd` | `number` | no | — |
| `net_paid_usd` | `number` | no | — |
| `saved_amount_usd` | `number` | no | — |

Interfaz `GroupedInstance`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `name` | `string` | no | — |
| `project_id` | `string` | no | — |
| `total_list_cost` | `number` | no | — |
| `total_net_paid` | `number` | no | — |
| `total_saved` | `number` | no | — |
| `components` | `TableDetail[]` | no | — |

- Usa: [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx)
- Usado por: [`SpendBasedCudsComponent.tsx`](#components-gcp-vista-cuds-spend-based-cuds-spendbasedcudscomponent-tsx)

Notas de implementación:

- _SpendBasedCudsTable_: `size: 250,` — Controlamos el ancho base
- _SpendBasedCudsTable_: Forzamos un ancho pequeño para que no se estire
- _SpendBasedCudsTable_: `const isFullyCovered = netPaid <= 0;` — GCP a veces marca decimales ínfimos, el <= 0 es más seguro
- _SpendBasedCudsTable_: Esta columna puede ser más ancha para mostrar bien los SKUs
- _SpendBasedCudsTable_: JSX — Indicador de Ahorro Total en estilo claro

