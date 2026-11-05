# Componentes `components/azure/vista-savings-plan/`

[← Índice](../../README.md)

Savings Plans de Azure: resumen, análisis, treemap e instancias.

Archivos:

- [`components/azure/vista-savings-plan/MainViewSavingsPlanComponent.tsx`](#components-azure-vista-savings-plan-mainviewsavingsplancomponent-tsx)
- [`components/azure/vista-savings-plan/SavingsPlanComponent.tsx`](#components-azure-vista-savings-plan-savingsplancomponent-tsx)
- [`components/azure/vista-savings-plan/graficos/SavingsPlanLineChartComponent.tsx`](#components-azure-vista-savings-plan-graficos-savingsplanlinechartcomponent-tsx)
- [`components/azure/vista-savings-plan/graficos/TreemapSavingsPlanComponent.tsx`](#components-azure-vista-savings-plan-graficos-treemapsavingsplancomponent-tsx)
- [`components/azure/vista-savings-plan/table/SavingPlanTableComponent.tsx`](#components-azure-vista-savings-plan-table-savingplantablecomponent-tsx)

<a id="components-azure-vista-savings-plan-mainviewsavingsplancomponent-tsx"></a>
## `components/azure/vista-savings-plan/MainViewSavingsPlanComponent.tsx`

**Componente**

Exporta:

- componente `MainViewSavingPlanComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`SavingsPlanComponent.tsx`](#components-azure-vista-savings-plan-savingsplancomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-compromisos-saving-plans-page-tsx)

---

<a id="components-azure-vista-savings-plan-savingsplancomponent-tsx"></a>
## `components/azure/vista-savings-plan/SavingsPlanComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `SavingsPlanComponent` `({ startDate, endDate }: SavingsPlanProps)`

Interfaz `SavingsPlanProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |

Interfaz `ConsumoDiario`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `date` | `string` | no | — |
| `horas_savings_plan` | `number` | no | — |
| `horas_ondemand` | `number` | no | — |
| `costo_hipotetico_payg_sp` | `number` | no | — |
| `costo_real_ondemand` | `number` | no | — |
| `total_horas` | `number` | no | — |
| `total_costo_hipotetico` | `number` | no | — |
| `pay_g_price` | `number` | no | — |

Interfaz `Instancia`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instance_name` | `string` | no | — |
| `meter_category` | `string` | no | — |
| `totales` | `{ total_horas_savings_plan: number; total_horas_ondemand: number; tot…` | no | — |
| `consumo_diario` | `ConsumoDiario[]` | no | — |

Interfaz `SavingsPlanResumen`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `valor_fijo_mensual_saving_plan` | `number` | no | — |
| `valor_compromiso_por_hora` | `number` | no | — |
| `unidad_monetaria` | `string` | no | — |

Interfaz `SavingsPlanAnalisis`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `suma_pay_g_price_instancias` | `number` | no | — |
| `costo_por_uso_savings_plan` | `number` | no | — |
| `costo_exceso_ondemand` | `number` | no | — |
| `costo_hipotetico_ondemand` | `number` | no | — |

Interfaz `ConsumoApiResponse`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resumen` | `{ total_instancias: number; total_horas_savings_plan: number; total_h…` | no | — |
| `instancias` | `Instancia[]` | no | — |

Internos:

- componente `LoaderComponent` `()`
- función `isNullish` `(v: unknown)`

- API: `/api/azure/bridge/azure/saving-plan/analisis`, `/api/azure/bridge/azure/saving-plan/instancias_consumo_diario`, `/api/azure/bridge/azure/saving-plan/recursos_activos`, `/api/azure/bridge/azure/saving-plan/resumen`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx), [`popover.tsx`](../ui.md#components-ui-popover-tsx), [`select.tsx`](../ui.md#components-ui-select-tsx), [`SavingPlanTableComponent.tsx`](#components-azure-vista-savings-plan-table-savingplantablecomponent-tsx), [`TreemapSavingsPlanComponent.tsx`](#components-azure-vista-savings-plan-graficos-treemapsavingsplancomponent-tsx), [`SavingsPlanLineChartComponent.tsx`](#components-azure-vista-savings-plan-graficos-savingsplanlinechartcomponent-tsx), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx)
- Usado por: [`MainViewSavingsPlanComponent.tsx`](#components-azure-vista-savings-plan-mainviewsavingsplancomponent-tsx)

Notas de implementación:

- JSX — COLUMNA IZQUIERDA - 2/3 del ancho
- JSX — SECCIÓN: RESUMEN SAVING PLAN
- JSX — Valor Fijo Mensual
- JSX — Valor Compromiso por Hora
- JSX — Moneda
- JSX — TREEMAP - VISUALIZACIÓN DE EXCESO
- JSX — COLUMNA DERECHA - 1/3 del ancho
- JSX — SECCIÓN: GRÁFICO DE CONSUMO DIARIO
- JSX — Tarjetas de Resumen de Consumo
- JSX — Controles del Gráfico
- JSX — Gráfico
- JSX — Tabla de Instancias y Detalles

---

<a id="components-azure-vista-savings-plan-graficos-savingsplanlinechartcomponent-tsx"></a>
## `components/azure/vista-savings-plan/graficos/SavingsPlanLineChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `SavingsPlanLineChartComponent` `({ data }: SavingsPlanLineChartComponentProps)`

Interfaz `ConsumoDiario`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `date` | `string` | no | — |
| `horas_savings_plan` | `number` | no | — |
| `horas_ondemand` | `number` | no | — |
| `costo_hipotetico_payg_sp` | `number` | no | — |
| `costo_real_ondemand` | `number` | no | — |
| `total_horas` | `number` | no | — |
| `total_costo_hipotetico` | `number` | no | — |
| `pay_g_price` | `number` | no | — |

Interfaz `Instancia`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instance_name` | `string` | no | — |
| `meter_category` | `string` | no | — |
| `totales` | `{ total_horas_savings_plan: number; total_horas_ondemand: number; tot…` | no | — |
| `consumo_diario` | `ConsumoDiario[]` | no | — |

Interfaz `ConsumoApiResponse`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resumen` | `{ total_instancias: number; total_horas_savings_plan: number; total_h…` | no | — |
| `instancias` | `Instancia[]` | no | — |

Interfaz `SavingsPlanLineChartComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ConsumoApiResponse` | no | — |

- Tipo interno `SeriesMeta` = `{ instance: string; type: 'SavingsPlan' | 'OnDemand'; horas: number[]; costos: number[]; porcentajeCobertura: number; }`
Internos:

- constante `fmt`
- función `toUTCDate` `(value: string)`

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`SavingsPlanComponent.tsx`](#components-azure-vista-savings-plan-savingsplancomponent-tsx)

---

<a id="components-azure-vista-savings-plan-graficos-treemapsavingsplancomponent-tsx"></a>
## `components/azure/vista-savings-plan/graficos/TreemapSavingsPlanComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `TreemapSavingsPlanComponent` `({ startDate, endDate }: TreemapSavingsPlanProps)`

Interfaz `TreemapSavingsPlanProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |

Interfaz `TooltipData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instance_name` | `string` | no | — |
| `meter_category` | `string` | no | — |
| `total_horas_sp` | `number` | no | — |
| `total_horas_ondemand` | `number` | no | — |
| `total_horas` | `number` | no | — |
| `costo_hipotetico_sp` | `number` | no | — |
| `costo_ondemand` | `number` | no | — |
| `costo_total` | `number` | no | — |
| `porcentaje_cobertura` | `number` | no | — |
| `dias_con_datos` | `number` | no | — |

Interfaz `FormattedInstance`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `name` | `string` | no | — |
| `value` | `number` | no | — |
| `tooltipData` | `TooltipData` | no | — |

Internos:

- componente `LoaderComponent` `()`
- función `fetcher` `(url: string)`
- función `formatTooltip` `(info: TooltipData): string` — Funciones puras para transformación de datos
- función `transformData` `(data: unknown): FormattedInstance[]`
- función `getChartOptions` `(formattedData: FormattedInstance[]): echarts.EChartsOption`

- API: `/api/azure/bridge/azure/saving-plan/instancias_consumo_diario`
- Hooks: `useSWR`
- Usado por: [`SavingsPlanComponent.tsx`](#components-azure-vista-savings-plan-savingsplancomponent-tsx)

Notas de implementación:

- Memoizar URLs para evitar cambios innecesarios
- Memoizar datos transformados
- Memoizar opciones del gráfico
- Usar requestAnimationFrame para resize más eficiente
- Inicializar o reutilizar instancia
- `useDirtyRect: true,` — Optimización de rendimiento
- ResizeObserver con mejor rendimiento

---

<a id="components-azure-vista-savings-plan-table-savingplantablecomponent-tsx"></a>
## `components/azure/vista-savings-plan/table/SavingPlanTableComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `SavingsPlanInstancesTable` `({ startDateFormatted, endDateFormatted, }: { startDateFormatted: string endDateFormatted: string })`

- Tipo interno `InstanciaSavingsPlan` = `{ nombre_recurso: string instance_name_completo: string producto: string meter_name: string meter_sub_category: string …`
- Tipo interno `ApiResponse` = `{ instancias: InstanciaSavingsPlan[] }`
Internos:

- componente `ModeloBadge` `({ modelo }: { modelo: string })`

- API: `/api/azure/bridge/azure/saving-plan/detalle_instancias`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx)
- Usado por: [`SavingsPlanComponent.tsx`](#components-azure-vista-savings-plan-savingsplancomponent-tsx)

