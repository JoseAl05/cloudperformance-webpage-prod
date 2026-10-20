# Componentes `components/aws/vista-saving-plan/`

[← Índice](../../README.md)

Savings Plans de AWS: resumen, costo y uso, y precios de EC2.

Archivos:

- [`components/aws/vista-saving-plan/MainViewSavingPlansComponent.tsx`](#components-aws-vista-saving-plan-mainviewsavingplanscomponent-tsx)
- [`components/aws/vista-saving-plan/SavingPlansComponent.tsx`](#components-aws-vista-saving-plan-savingplanscomponent-tsx)
- [`components/aws/vista-saving-plan/graficos/SavingPlansBarChartComponent.tsx`](#components-aws-vista-saving-plan-graficos-savingplansbarchartcomponent-tsx)
- [`components/aws/vista-saving-plan/graficos/SavingPlansLineChartComponent.tsx`](#components-aws-vista-saving-plan-graficos-savingplanslinechartcomponent-tsx)
- [`components/aws/vista-saving-plan/tables/Ec2TableComponent.tsx`](#components-aws-vista-saving-plan-tables-ec2tablecomponent-tsx)

<a id="components-aws-vista-saving-plan-mainviewsavingplanscomponent-tsx"></a>
## `components/aws/vista-saving-plan/MainViewSavingPlansComponent.tsx`

**Componente**

Exporta:

- componente `MainViewSavingPlansComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`SavingPlansComponent.tsx`](#components-aws-vista-saving-plan-savingplanscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-compromisos-saving-plans-page-tsx)

---

<a id="components-aws-vista-saving-plan-savingplanscomponent-tsx"></a>
## `components/aws/vista-saving-plan/SavingPlansComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `SavingPlansViewComponent` `({ startDate, endDate }: SavingPlansComponentProps)`

Interfaz `SavingsPlanItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `savingsPlanArn` | `string` | no | — |
| `savingsPlanId` | `string` | sí | — |
| `savingsPlanType` | `string` | sí | — |
| `planType` | `string` | sí | — |
| `type` | `string` | sí | — |
| `state` | `string` | sí | — |
| `status` | `string` | sí | — |
| `estado` | `string` | sí | — |
| `[key: string]: unknown` | `unknown` | no | — |

Interfaz `CostUsageItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `dimensions` | `{ SERVICE?: string; [key: string]: string \| undefined }` | sí | — |
| `SERVICE` | `string` | sí | — |
| `amortizedcost` | `number \| string` | sí | — |
| `unblendedcost` | `number \| string` | sí | — |
| `[key: string]: unknown` | `unknown` | no | — |

Interfaz `SpCostData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `commitment_hourly` | `number` | sí | — |
| `costo_diario` | `number` | sí | — |
| `costo_mensual` | `number` | sí | — |

Interfaz `DashboardStats`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `planes_retirados` | `number` | sí | — |
| `planes_registrados` | `number` | sí | — |
| `planes_activos` | `number` | sí | — |

Interfaz `Ec2InstancesPrices`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `total_unique_instances` | `number` | sí | — |
| `total_price_usd` | `number` | sí | — |

Interfaz `SavingPlansComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date \| string` | no | — |
| `endDate` | `Date \| string` | no | — |

Internos:

- función `formatUSD` `(value: number)`

- API: `/api/aws/bridge/saving-plans/ec2-instances-prices/`, `/api/aws/bridge/saving-plans/saving-plan-cost-usage`, `/api/aws/bridge/saving-plans/savings-plan-cost`, `/api/aws/bridge/saving-plans/vista-saving-plans`, `/api/aws/bridge/saving-plans/vista-saving-plans/dashboard-stats`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`select.tsx`](../ui.md#components-ui-select-tsx), [`Ec2TableComponent.tsx`](#components-aws-vista-saving-plan-tables-ec2tablecomponent-tsx), [`SavingPlansBarChartComponent.tsx`](#components-aws-vista-saving-plan-graficos-savingplansbarchartcomponent-tsx), [`SavingPlansLineChartComponent.tsx`](#components-aws-vista-saving-plan-graficos-savingplanslinechartcomponent-tsx), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx)
- Usado por: [`MainViewSavingPlansComponent.tsx`](#components-aws-vista-saving-plan-mainviewsavingplanscomponent-tsx)

Notas de implementación:

- 1. Lógica para la línea del Savings Plan
- 2. Lógica para el uso de Cómputo (EC2, etc.)
- Fallback de seguridad por si el array de costUsage viene incompleto
- `const toleranciaDesperdicio = totalCompromiso * 0.15;` — 15% de margen para subutilización
- `const toleranciaExcedente = totalCompromiso * 0.05;` — 5% de margen para gasto On-Demand
- 3. Evaluamos el estado usando los umbrales relativos
- Si el desperdicio y el excedente están dentro de los márgenes tolerados, es un plan perfecto
- `desperdicio: totalDesperdicio` — Mostramos el pequeño remanente (si lo hay) como información útil

---

<a id="components-aws-vista-saving-plan-graficos-savingplansbarchartcomponent-tsx"></a>
## `components/aws/vista-saving-plan/graficos/SavingPlansBarChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `SavingPlansBarChartComponent` `({ costUsage }: SavingPlansBarChartComponentProps)`

Interfaz `CostUsageItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `dimensions` | `{ SERVICE?: string }` | sí | — |
| `SERVICE` | `string` | sí | — |
| `amortizedcost` | `number \| string` | sí | — |
| `unblendedcost` | `number \| string` | sí | — |
| `[key: string]: unknown;` | `unknown` | no | — |

Interfaz `SavingPlansBarChartComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `costUsage` | `CostUsageItem[]` | no | — |

Internos:

- función `formatUSD` `(value: number)`

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`SavingPlansComponent.tsx`](#components-aws-vista-saving-plan-savingplanscomponent-tsx)

---

<a id="components-aws-vista-saving-plan-graficos-savingplanslinechartcomponent-tsx"></a>
## `components/aws/vista-saving-plan/graficos/SavingPlansLineChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `SavingPlansLineChartComponent` `({ costUsage, startDate, endDate }: SavingPlansLineChartComponentProps)`

Interfaz `CostUsageItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `dimensions` | `{ SERVICE?: string }` | sí | — |
| `SERVICE` | `string` | sí | — |
| `start_date` | `{ $date?: string } \| string` | sí | — |
| `amortizedcost` | `number \| string` | sí | — |
| `unblendedcost` | `number \| string` | sí | — |
| `[key: string]: unknown;` | `unknown` | no | — |

Interfaz `SavingPlansLineChartComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `costUsage` | `CostUsageItem[]` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |

Internos:

- función `formatUSD` `(value: number)`
- función `normalizeDay` `(date: Date | string | undefined)`
- función `generateDaysRange` `(start: Date, end: Date)`

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`SavingPlansComponent.tsx`](#components-aws-vista-saving-plan-savingplanscomponent-tsx)

---

<a id="components-aws-vista-saving-plan-tables-ec2tablecomponent-tsx"></a>
## `components/aws/vista-saving-plan/tables/Ec2TableComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `Ec2TableComponent` `({ startDateFormatted, endDateFormatted, }: { startDateFormatted: string endDateFormatted: string })`

- Tipo interno `EC2Instance` = `{ InstanceId: string InstanceType: string pricePerUnit_USD: number | string unit: string servicename: string sync_time_…`
- API: `/api/aws/bridge/saving-plans/ec2-instances-prices/`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx)
- Usado por: [`SavingPlansComponent.tsx`](#components-aws-vista-saving-plan-savingplanscomponent-tsx)

