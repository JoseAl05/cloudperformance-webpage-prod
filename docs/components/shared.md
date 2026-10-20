# Componentes `components/shared/`

[← Índice](../README.md)

Vistas genéricas reutilizadas por las tres nubes: facturación (tendencia, historial, top), consumo / eficiencia, recursos sin uso y horario hábil vs no hábil, cada una configurada por nube en su `*Configs.ts`; además el filtro base, tarjetas de estadística, estados de carga/error y el control de acceso por plan.

Archivos:

- [`components/shared/DataStateComponent.tsx`](#components-shared-datastatecomponent-tsx)
- [`components/shared/PlanAccessGate.tsx`](#components-shared-planaccessgate-tsx)
- [`components/shared/StatCard.tsx`](#components-shared-statcard-tsx)
- [`components/shared/billing/BillingHistoryTable.tsx`](#components-shared-billing-billinghistorytable-tsx)
- [`components/shared/billing/BillingTrendChart.tsx`](#components-shared-billing-billingtrendchart-tsx)
- [`components/shared/billing/BillingTrendView.tsx`](#components-shared-billing-billingtrendview-tsx)
- [`components/shared/billing/CostMetricInfo.tsx`](#components-shared-billing-costmetricinfo-tsx)
- [`components/shared/billing/TopBillingChart.tsx`](#components-shared-billing-topbillingchart-tsx)
- [`components/shared/billing/TopBillingTable.tsx`](#components-shared-billing-topbillingtable-tsx)
- [`components/shared/billing/TopBillingView.tsx`](#components-shared-billing-topbillingview-tsx)
- [`components/shared/billing/billingConfigs.ts`](#components-shared-billing-billingconfigs-ts)
- [`components/shared/consumption/ConsumptionCards.tsx`](#components-shared-consumption-consumptioncards-tsx)
- [`components/shared/consumption/ConsumptionCharts.tsx`](#components-shared-consumption-consumptioncharts-tsx)
- [`components/shared/consumption/ConsumptionDetailModal.tsx`](#components-shared-consumption-consumptiondetailmodal-tsx)
- [`components/shared/consumption/ConsumptionTable.tsx`](#components-shared-consumption-consumptiontable-tsx)
- [`components/shared/consumption/ConsumptionView.tsx`](#components-shared-consumption-consumptionview-tsx)
- [`components/shared/consumption/consumptionConfigs.ts`](#components-shared-consumption-consumptionconfigs-ts)
- [`components/shared/consumption/types.ts`](#components-shared-consumption-types-ts)
- [`components/shared/filters/BaseFiltersComponent.tsx`](#components-shared-filters-basefilterscomponent-tsx)
- [`components/shared/unused/UnusedCards.tsx`](#components-shared-unused-unusedcards-tsx)
- [`components/shared/unused/UnusedDetailModal.tsx`](#components-shared-unused-unuseddetailmodal-tsx)
- [`components/shared/unused/UnusedTable.tsx`](#components-shared-unused-unusedtable-tsx)
- [`components/shared/unused/UnusedView.tsx`](#components-shared-unused-unusedview-tsx)
- [`components/shared/unused/types.ts`](#components-shared-unused-types-ts)
- [`components/shared/unused/unusedConfigs.ts`](#components-shared-unused-unusedconfigs-ts)
- [`components/shared/working-hours/WorkingHoursCards.tsx`](#components-shared-working-hours-workinghourscards-tsx)
- [`components/shared/working-hours/WorkingHoursCharts.tsx`](#components-shared-working-hours-workinghourscharts-tsx)
- [`components/shared/working-hours/WorkingHoursDetailModal.tsx`](#components-shared-working-hours-workinghoursdetailmodal-tsx)
- [`components/shared/working-hours/WorkingHoursTable.tsx`](#components-shared-working-hours-workinghourstable-tsx)
- [`components/shared/working-hours/WorkingHoursView.tsx`](#components-shared-working-hours-workinghoursview-tsx)
- [`components/shared/working-hours/types.ts`](#components-shared-working-hours-types-ts)
- [`components/shared/working-hours/workingHoursConfigs.ts`](#components-shared-working-hours-workinghoursconfigs-ts)

<a id="components-shared-datastatecomponent-tsx"></a>
## `components/shared/DataStateComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `DataStateComponent` `({ isLoading = false, error, isEmpty = false, emptyTitle = 'Sin datos para mostrar', emptyDescription = 'No encontramos información en el rango seleccionado.',…` — Estados estándar de una vista: cargando → error → sin datos → contenido. Pensado para usarse con `useSWR(url, fetcher)` de `@/lib/fetcher`, que expone `error` en respuestas no-2xx.

Interfaz `DataStateComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `isLoading` | `boolean` | sí | — |
| `error` | `unknown` | sí | — |
| `isEmpty` | `boolean` | sí | — |
| `emptyTitle` | `string` | sí | — |
| `emptyDescription` | `string` | sí | — |
| `errorDescription` | `string` | sí | — |
| `children` | `React.ReactNode` | no | — |

Internos:

- constante `DEFAULT_ERROR_DESCRIPTION`
- función `describeError` `(error: unknown, fallback: string)`

- Usa: [`MessageCards.tsx`](aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx), [`fetcher.ts`](../lib.md#lib-fetcher-ts)
- Usado por: [`ZonasDNSComponent.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-dns-zonas-consumo-estado-zonasdnscomponent-tsx), [`LoadBalancersComponent.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-load-balancers-consumo-uso-loadbalancerscomponent-tsx), [`GkeComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-gkecomponent-tsx), [`ConsumptionView.tsx`](#components-shared-consumption-consumptionview-tsx), [`UnusedDetailModal.tsx`](#components-shared-unused-unuseddetailmodal-tsx), [`UnusedView.tsx`](#components-shared-unused-unusedview-tsx), [`WorkingHoursView.tsx`](#components-shared-working-hours-workinghoursview-tsx)

---

<a id="components-shared-planaccessgate-tsx"></a>
## `components/shared/PlanAccessGate.tsx`

**Componente (cliente)**

Exporta:

- componente `AccessDeniedComponent` `({ planName, serviceName }: { planName: string; serviceName: string })`
- componente `PdfReportComponent` `({ planName, serviceName, accent = 'amber' }: { planName: string; serviceName: string; accent?: Accent })`
- componente `PlanAccessGate` `({ serviceName, loading, canAccessFullDashboard, canAccessPdfReport, planName, showPdfReport = true, pdfAccent = 'amber', pdfFallbackPlanName = 'Starter', chil…` — Control de acceso por plan para el layout de una nube o servicio: sin acceso → "Acceso Denegado"; acceso completo → `children`; solo PDF → pantalla del reporte PDF.

Interfaz `PlanAccessGateProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `serviceName` | `string` | no | Nombre visible del servicio (p. ej. "Google Cloud Platform"). |
| `loading` | `boolean` | no | — |
| `canAccessFullDashboard` | `boolean` | no | — |
| `canAccessPdfReport` | `boolean` | no | — |
| `planName` | `string` | sí | — |
| `showPdfReport` | `boolean` | sí | Si es false, un plan con acceso solo a PDF recibe "Acceso Denegado" (servicios sin reporte PDF). |
| `pdfAccent` | `Accent` | sí | — |
| `pdfFallbackPlanName` | `string` | sí | — |
| `children` | `React.ReactNode` | no | — |

- Tipo interno `Accent` = `'amber' | 'blue'`
Internos:

- constante `ACCENT_CLASSES`

- Usado por: [`layout.tsx`](../rutas.md#app-dashboards-ia-amazon-bedrock-layout-tsx), [`layout.tsx`](../rutas.md#app-dashboards-ia-google-vertex-layout-tsx), [`layout.tsx`](../rutas.md#app-dashboards-ia-microsoft-foundry-layout-tsx), [`layout.tsx`](../rutas.md#app-dashboards-ia-open-ia-layout-tsx), [`layout.tsx`](../rutas.md#app-dashboards-nubes-cloud-aws-layout-tsx), [`layout.tsx`](../rutas.md#app-dashboards-nubes-cloud-azure-layout-tsx), [`layout.tsx`](../rutas.md#app-dashboards-nubes-cloud-gcp-layout-tsx)

Notas de implementación:

- _PlanAccessGate_: 1. SIN ACCESO (ni siquiera al PDF)
- _PlanAccessGate_: 2. ACCESO COMPLETO
- _PlanAccessGate_: 3. ACCESO LIMITADO: solo el reporte PDF
- _PlanAccessGate_: Fallback de seguridad

---

<a id="components-shared-statcard-tsx"></a>
## `components/shared/StatCard.tsx`

**Componente (cliente)**

Exporta:

- tipo `StatCardColor` = `'blue' | 'amber' | 'green' | 'red' | 'purple' | 'slate'`
- componente `StatCard` `({ title, value, unit, icon: Icon, description, subtitle, color = 'blue', warning, large = false }: StatCardProps)` — Tarjeta de KPI compartida por las vistas de las tres nubes.

Interfaz `StatCardProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `title` | `string` | no | — |
| `value` | `string \| number` | no | — |
| `unit` | `string` | sí | — |
| `icon` | `LucideIcon` | no | — |
| `description` | `string` | sí | — |
| `subtitle` | `string` | sí | — |
| `color` | `StatCardColor` | sí | — |
| `warning` | `{ title: string; text: string }` | sí | Muestra un aviso en vez de la descripción. |
| `large` | `boolean` | sí | — |

Internos:

- constante `COLOR_STYLES`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx)
- Usado por: [`ZonasDNSCardsComponent.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-dns-zonas-consumo-estado-info-zonasdnscardscomponent-tsx), [`LoadBalancersCardsComponent.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-load-balancers-consumo-uso-info-loadbalancerscardscomponent-tsx), [`ConsumptionCards.tsx`](#components-shared-consumption-consumptioncards-tsx), [`UnusedCards.tsx`](#components-shared-unused-unusedcards-tsx)

---

<a id="components-shared-billing-billinghistorytable-tsx"></a>
## `components/shared/billing/BillingHistoryTable.tsx`

**Componente (cliente)**

Exporta:

- componente `BillingHistoryTable` `({ data, isLoading, cloudLabel }: BillingHistoryTableProps)` — Consumo mes a mes por servicio, desviaciones frente al mes anterior y resumen de alzas/bajas (exportable a Excel).

Interfaz `BillingHistoryTableProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `BillingHistory \| null` | no | — |
| `isLoading` | `boolean` | no | — |
| `cloudLabel` | `string` | no | Se usa en el nombre del Excel ("AWS", "Azure", "GCP"). |

Internos:

- función `formatCurrency` `(value: number | null | undefined): string`
- función `devLabel` `(toMonth: string, months: string[])`
- componente `SummaryLabel` `({ label, help }: { label: string; help: ReactNode })`

- Usa: [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`tooltip.tsx`](ui.md#components-ui-tooltip-tsx), [`exportExcelHistoricalBilling.ts`](../lib.md#lib-exportexcelhistoricalbilling-ts), [`billing.ts`](../tipos.md#interfaces-billing-ts)
- Usado por: [`BillingTrendView.tsx`](#components-shared-billing-billingtrendview-tsx)

---

<a id="components-shared-billing-billingtrendchart-tsx"></a>
## `components/shared/billing/BillingTrendChart.tsx`

**Componente (cliente)**

Exporta:

- interfaz `BillingChartPoint` — Punto ya resuelto (costo en la moneda que se está mostrando).
- componente `BillingTrendChart` `({ data, currency }: BillingTrendChartProps)` — Costo diario por servicio (área apilada por servicio), con exportación PNG y tooltip fijable con un clic.

Interfaz `BillingChartPoint` (exportada) — Punto ya resuelto (costo en la moneda que se está mostrando).:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `date` | `string` | no | — |
| `service` | `string` | no | — |
| `cost` | `number` | no | — |

Interfaz `BillingTrendChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `BillingChartPoint[]` | no | — |
| `currency` | `string` | no | — |

Internos:

- función `generateUniqueColors` `(count: number)`
- constante `serviceColorCache`
- función `getServiceColor` `(serviceName: string, serviceIndex: number, totalServices: number)`
- función `toUTCDate` `(s: string)`
- constante `fmt`
- función `money` `(n: number)`
- función `processChartData` `(rawData: BillingChartPoint[])`

- Hooks: `useECharts`, `useTheme`
- Usa: [`button.tsx`](ui.md#components-ui-button-tsx), [`echartsGlobalConfig.ts`](../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`BillingTrendView.tsx`](#components-shared-billing-billingtrendview-tsx)

---

<a id="components-shared-billing-billingtrendview-tsx"></a>
## `components/shared/billing/BillingTrendView.tsx`

**Componente (cliente)**

Exporta:

- componente `BillingTrendView` `({ cloud, startDate, endDate, params, showHeader = true, servicesLabel = 'Servicios', regionsLabel = 'Regiones', }: BillingTrendViewProps)` — Vista "Tendencia de Facturación" común a AWS, Azure y GCP (contrato `BillingTrend` + `BillingHistory`).

Interfaz `BillingTrendViewProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `BillingCloud` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `params` | `QueryParams` | no | Filtros de la nube (se envían igual a /billing/trend y /billing/history). |
| `showHeader` | `boolean` | sí | Encabezado con título (AWS/GCP); en Azure el título lo pone la página. |
| `servicesLabel` | `string` | sí | "Servicios" (AWS/GCP) o "Categorías de Servicio" (Azure). |
| `regionsLabel` | `string` | sí | "Regiones" (AWS) o "Ubicaciones" (Azure). |

Internos:

- constante `CLOUD_LABEL`
- componente `DetailPopover` `({ title, items, icon: Icon }: { title: string; items: string[]; icon: LucideIcon })`

- Hooks: `useSWR`
- Usa: [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`select.tsx`](ui.md#components-ui-select-tsx), [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`format.ts`](../lib.md#lib-format-ts), [`billing.ts`](../lib.md#lib-billing-ts), [`consumption.ts`](../lib.md#lib-consumption-ts), [`billing.ts`](../tipos.md#interfaces-billing-ts), [`BillingTrendChart.tsx`](#components-shared-billing-billingtrendchart-tsx), [`BillingHistoryTable.tsx`](#components-shared-billing-billinghistorytable-tsx), [`CostMetricInfo.tsx`](#components-shared-billing-costmetricinfo-tsx)
- Usado por: [`TendenciaFacturacionChartComponent.tsx`](aws/vista-facturacion.md#components-aws-vista-facturacion-tendencia-facturacion-tendenciafacturacionchartcomponent-tsx), [`TendenciaFacturacionPagoPorUsoComponent.tsx`](azure/vista-facturacion.md#components-azure-vista-facturacion-tendencia-pago-por-uso-tendenciafacturacionpagoporusocomponent-tsx), [`TendenciaFacturacionComponent.tsx`](gcp/vista-facturacion.md#components-gcp-vista-facturacion-tendencia-facturacion-tendenciafacturacioncomponent-tsx)

---

<a id="components-shared-billing-costmetricinfo-tsx"></a>
## `components/shared/billing/CostMetricInfo.tsx`

**Componente (cliente)**

Exporta:

- componente `CostMetricInfo` `({ metric, currency }: { metric: string | null | undefined; currency?: string | null })` — Ícono con la métrica de costo que se está mostrando (decisión F-08: una métrica por nube).

- Usa: [`tooltip.tsx`](ui.md#components-ui-tooltip-tsx), [`billing.ts`](../lib.md#lib-billing-ts)
- Usado por: [`MultiCloudComponent.tsx`](comp-cloud.md#components-comp-cloud-multicloud-multicloudcomponent-tsx), [`BillingTrendView.tsx`](#components-shared-billing-billingtrendview-tsx), [`TopBillingView.tsx`](#components-shared-billing-topbillingview-tsx)

---

<a id="components-shared-billing-topbillingchart-tsx"></a>
## `components/shared/billing/TopBillingChart.tsx`

**Componente (cliente)**

Exporta:

- interfaz `TopBillingUiTuning`
- componente `TopBillingChart` `({ items, selected, onSelect, topLimit, currency, uiTuning }: TopBillingChartProps)` — Barras horizontales apiladas (valor de la dimensión × servicio); clic en una barra = detalle por servicio.

Interfaz `LegendCfg`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `type` | `'plain' \| 'scroll'` | sí | — |
| `orient` | `'horizontal' \| 'vertical'` | sí | — |
| `top` | `number \| string` | sí | — |
| `bottom` | `number \| string` | sí | — |
| `left` | `number \| string` | sí | — |
| `right` | `number \| string` | sí | — |

Interfaz `TopBillingUiTuning` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `yLabelStrategy` | `'truncate' \| 'fit'` | sí | — |
| `yLabelMaxChars` | `number` | sí | — |
| `yLabelFontSize` | `number` | sí | — |
| `gridMinLeft` | `number` | sí | — |
| `gridMaxLeft` | `number` | sí | — |
| `axisLabelInterval` | `number \| 'auto'` | sí | — |
| `legend` | `LegendCfg` | sí | — |

Interfaz `TopBillingChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `items` | `BillingTopItem[]` | no | — |
| `selected` | `string \| null` | no | Valor de la dimensión abierto en detalle (por servicio); null = vista general. |
| `onSelect` | `(value: string \| null) => void` | no | — |
| `topLimit` | `number \| 'all'` | no | — |
| `currency` | `string` | no | — |
| `uiTuning` | `TopBillingUiTuning` | sí | — |

Internos:

- constante `NO_SERVICE`
- función `clamp` `(n: number, min: number, max: number)`
- función `toNumber` `(v: unknown)`
- constante `LARGE_MODE`

- Hooks: `useECharts`, `useTheme`
- Usa: [`button.tsx`](ui.md#components-ui-button-tsx), [`echartsGlobalConfig.ts`](../lib.md#lib-echartsglobalconfig-ts), [`billing.ts`](../tipos.md#interfaces-billing-ts)
- Usado por: [`TopBillingView.tsx`](#components-shared-billing-topbillingview-tsx), [`billingConfigs.ts`](#components-shared-billing-billingconfigs-ts)

---

<a id="components-shared-billing-topbillingtable-tsx"></a>
## `components/shared/billing/TopBillingTable.tsx`

**Componente (cliente)**

Exporta:

- componente `TopBillingTable` `({ items, label, currency, period }: TopBillingTableProps)` — Detalle del top agrupado por valor de la dimensión (servicio, día y costo).

Interfaz `TopBillingTableProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `items` | `BillingTopItem[]` | no | — |
| `label` | `string` | no | Nombre de la dimensión ("Región", "Sistema Operativo", ...). |
| `currency` | `string` | no | — |
| `period` | `string` | no | — |

- Tipo interno `Row` = `BillingTopItem`
Internos:

- función `formatMoney` `(value: number, currency: string, maxDecimals = 4)`

- Usa: [`data-table-grouping.tsx`](data-table.md#components-data-table-data-table-grouping-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`billing.ts`](../tipos.md#interfaces-billing-ts)
- Usado por: [`TopBillingView.tsx`](#components-shared-billing-topbillingview-tsx)

---

<a id="components-shared-billing-topbillingview-tsx"></a>
## `components/shared/billing/TopBillingView.tsx`

**Componente (cliente)**

Exporta:

- componente `TopBillingView` `({ cloud, startDate, endDate, dimensions, params }: TopBillingViewProps)` — Vista "Top de facturación" común: KPIs (total, mayor y menor), barras por valor de la dimensión y tabla de detalle.

Interfaz `TopBillingViewProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `BillingCloud` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `dimensions` | `TopBillingDimension[]` | no | Una dimensión fija (AWS/GCP) o varias con selector (Azure). |
| `params` | `QueryParams` | sí | Filtros adicionales de la nube (p. ej. GCP: project_id, tag_key, tag_value). |

- Hooks: `useSWR`
- Usa: [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`select.tsx`](ui.md#components-ui-select-tsx), [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`format.ts`](../lib.md#lib-format-ts), [`billing.ts`](../lib.md#lib-billing-ts), [`consumption.ts`](../lib.md#lib-consumption-ts), [`billing.ts`](../tipos.md#interfaces-billing-ts), [`CostMetricInfo.tsx`](#components-shared-billing-costmetricinfo-tsx), [`TopBillingChart.tsx`](#components-shared-billing-topbillingchart-tsx), [`TopBillingTable.tsx`](#components-shared-billing-topbillingtable-tsx), [`billingConfigs.ts`](#components-shared-billing-billingconfigs-ts)
- Usado por: [`TopDolarFamiliaComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-por-famila-de-instancias-topdolarfamiliacomponent-tsx), [`TopDolarRecursoComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-por-id-recurso-topdolarrecursocomponent-tsx), [`TopDolarTipoCobroComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-cobro-topdolartipocobrocomponent-tsx), [`TopDolarTipoCompraComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-compra-topdolartipocompracomponent-tsx), [`MainViewTopDolarInstanciasComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-instancia-mainviewtopdolarinstanciascomponent-tsx), [`MainViewTopDolarRegionComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-region-mainviewtopdolarregioncomponent-tsx), [`MainViewTopDolarSOComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-so-mainviewtopdolarsocomponent-tsx), [`TopDolaresFacturadosChartComponent.tsx`](azure/vista-facturacion.md#components-azure-vista-facturacion-top-dolares-facturados-topdolaresfacturadoschartcomponent-tsx), [`MainViewTopFacturacionPorRegionComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-top-facturacion-region-mainviewtopfacturacionporregioncomponent-tsx)

---

<a id="components-shared-billing-billingconfigs-ts"></a>
## `components/shared/billing/billingConfigs.ts`

**Módulo**

Dimensiones del "Top de facturación" por nube (`dimension` de /api/{cloud}/billing/top), con sus textos y ajustes
del gráfico (los mismos que tenía cada vista antes de unificarlas).

Exporta:

- interfaz `TopBillingDimension`
- constante `AWS_TOP_DIMENSIONS` = `{ region: { value: 'region', label: 'Región', icon: '🌍', uiTuning: tuning(30, …`
- constante `AZURE_TOP_DIMENSIONS` = `[ { value: 'subscription', label: 'Suscripción', icon: '🔑', uiTuning: tuning(3…`
- constante `GCP_TOP_DIMENSIONS` = `{ region: { value: 'region', label: 'Región', icon: '🌍', uiTuning: tuning(30, …`

Interfaz `TopBillingDimension` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `value` | `string` | no | Valor de `dimension` en la API. |
| `label` | `string` | no | "Región", "Sistema Operativo", ... |
| `icon` | `string` | no | — |
| `uiTuning` | `TopBillingUiTuning` | sí | — |

Internos:

- constante `legend`
- función `tuning` `(gridMinLeft: number, gridMaxLeft: number): TopBillingUiTuning`

- Usa: [`TopBillingChart.tsx`](#components-shared-billing-topbillingchart-tsx)
- Usado por: [`TopDolarFamiliaComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-por-famila-de-instancias-topdolarfamiliacomponent-tsx), [`TopDolarRecursoComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-por-id-recurso-topdolarrecursocomponent-tsx), [`TopDolarTipoCobroComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-cobro-topdolartipocobrocomponent-tsx), [`TopDolarTipoCompraComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-compra-topdolartipocompracomponent-tsx), [`MainViewTopDolarInstanciasComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-instancia-mainviewtopdolarinstanciascomponent-tsx), [`MainViewTopDolarRegionComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-region-mainviewtopdolarregioncomponent-tsx), [`MainViewTopDolarSOComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-dolares-so-mainviewtopdolarsocomponent-tsx), [`TopDolaresFacturadosChartComponent.tsx`](azure/vista-facturacion.md#components-azure-vista-facturacion-top-dolares-facturados-topdolaresfacturadoschartcomponent-tsx), [`MainViewTopFacturacionPorRegionComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-top-facturacion-region-mainviewtopfacturacionporregioncomponent-tsx), [`TopBillingView.tsx`](#components-shared-billing-topbillingview-tsx)

---

<a id="components-shared-consumption-consumptioncards-tsx"></a>
## `components/shared/consumption/ConsumptionCards.tsx`

**Componente (cliente)**

Exporta:

- componente `ConsumptionCards` `({ config, summary, efficiency }: ConsumptionCardsProps)`

Interfaz `ConsumptionCardsProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `config` | `ConsumptionViewConfig` | no | — |
| `summary` | `ConsumptionSummary` | sí | — |
| `efficiency` | `EfficiencyResponse` | sí | — |

Internos:

- constante `LEVEL_COLOR`
- constante `METRIC_COLORS`

- Usa: [`StatCard.tsx`](#components-shared-statcard-tsx), [`format.ts`](../lib.md#lib-format-ts), [`consumption.ts`](../lib.md#lib-consumption-ts), [`consumption.ts`](../tipos.md#interfaces-consumption-ts), [`types.ts`](#components-shared-consumption-types-ts)
- Usado por: [`ConsumptionView.tsx`](#components-shared-consumption-consumptionview-tsx)

---

<a id="components-shared-consumption-consumptioncharts-tsx"></a>
## `components/shared/consumption/ConsumptionCharts.tsx`

**Componente (cliente)**

Exporta:

- componente `ConsumptionCharts` `({ data, metricOverrides }: ConsumptionChartsProps)` — Un gráfico por métrica (las series llegan mezcladas y se agrupan por `metric`).

Interfaz `ConsumptionChartsProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ChartPoint[]` | no | — |
| `metricOverrides` | `Record<string, MetricDefinition>` | sí | Formato propio de alguna métrica (por clave normalizada, ver `metricKey`). |

- Tipo interno `ChartPoint` = `Pick<MetricPoint, 'timestamp' | 'metric' | 'avg_value' | 'max_value' | 'min_value'>`
Internos:

- componente `MetricChart` `({ points, definition }: { points: ChartPoint[]; definition: MetricDefinition })`

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../lib.md#lib-echartsglobalconfig-ts), [`consumption.ts`](../lib.md#lib-consumption-ts), [`consumption.ts`](../tipos.md#interfaces-consumption-ts)
- Usado por: [`ConsumptionDetailModal.tsx`](#components-shared-consumption-consumptiondetailmodal-tsx), [`ConsumptionView.tsx`](#components-shared-consumption-consumptionview-tsx), [`UnusedView.tsx`](#components-shared-unused-unusedview-tsx)

---

<a id="components-shared-consumption-consumptiondetailmodal-tsx"></a>
## `components/shared/consumption/ConsumptionDetailModal.tsx`

**Componente (cliente)**

Exporta:

- función `renderField` `(value: unknown, field: Pick<FieldDef, 'format' | 'unit'>): string`
- componente `ConsumptionDetailModal` `({ resource, config, isOpen, onClose }: ConsumptionDetailModalProps)`

Interfaz `ConsumptionDetailModalProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource` | `ConsumptionResource` | no | — |
| `config` | `ConsumptionViewConfig` | no | — |
| `isOpen` | `boolean` | no | — |
| `onClose` | `() => void` | no | — |

Internos:

- constante `SCOPE_LABEL`
- componente `InfoTab` `({ resource, config }: { resource: ConsumptionResource; config: ConsumptionViewConfig })`
- componente `MetricsTab` `({ resource, config }: { resource: ConsumptionResource; config: ConsumptionViewConfig })`
- componente `SeriesTab` `({ resource }: { resource: ConsumptionResource })`
- componente `TagsTab` `({ resource }: { resource: ConsumptionResource })`
- componente `RecommendationTab` `({ resource, config }: { resource: ConsumptionResource; config: ConsumptionViewConfig })`

- Usa: [`scroll-area.tsx`](ui.md#components-ui-scroll-area-tsx), [`badge.tsx`](ui.md#components-ui-badge-tsx), [`table.tsx`](ui.md#components-ui-table-tsx), [`HistoryModal.tsx`](general_gcp.md#components-general-gcp-modal-historymodal-tsx), [`ConsumptionCharts.tsx`](#components-shared-consumption-consumptioncharts-tsx), [`format.ts`](../lib.md#lib-format-ts), [`consumption.ts`](../lib.md#lib-consumption-ts), [`consumption.ts`](../tipos.md#interfaces-consumption-ts), [`types.ts`](#components-shared-consumption-types-ts)
- Usado por: [`ConsumptionTable.tsx`](#components-shared-consumption-consumptiontable-tsx)

---

<a id="components-shared-consumption-consumptiontable-tsx"></a>
## `components/shared/consumption/ConsumptionTable.tsx`

**Componente (cliente)**

Exporta:

- componente `ConsumptionTable` `({ resources, config }: { resources: ConsumptionResource[]; config: ConsumptionViewConfig })`

- Tipo interno `Row` = `ConsumptionResource & Record<string, unknown>`
Internos:

- función `rowOf` `(info: unknown): Row` — DynamicColumn tipa `cell` con `info: unknown`; aquí se acota al contexto de celda de TanStack.
- componente `BarCell` `({ value, max, column, row }: { value: number | null; max: number; column: MetricColumnDef; row: Row })`
- componente `ClassificationCell` `({ row }: { row: Row })`
- componente `DetailsCell` `({ row, config }: { row: Row; config: ConsumptionViewConfig })`

- Usa: [`badge.tsx`](ui.md#components-ui-badge-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`columns.tsx`](data-table.md#components-data-table-columns-tsx), [`data-table-grouping.tsx`](data-table.md#components-data-table-data-table-grouping-tsx), [`ConsumptionDetailModal.tsx`](#components-shared-consumption-consumptiondetailmodal-tsx), [`format.ts`](../lib.md#lib-format-ts), [`consumption.ts`](../lib.md#lib-consumption-ts), [`consumption.ts`](../tipos.md#interfaces-consumption-ts), [`types.ts`](#components-shared-consumption-types-ts)
- Usado por: [`ConsumptionView.tsx`](#components-shared-consumption-consumptionview-tsx)

---

<a id="components-shared-consumption-consumptionview-tsx"></a>
## `components/shared/consumption/ConsumptionView.tsx`

**Componente (cliente)**

Exporta:

- componente `ConsumptionView` `({ config, params, enabled, disabledText }: ConsumptionViewProps)` — Vista estándar de Consumo / Eficiencia: tarjetas de resumen y eficiencia, un gráfico por métrica y la tabla de recursos con su detalle. Igual para AWS, Azure y GCP; lo propio de cada recurso vive en `config`.

Interfaz `ConsumptionViewProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `config` | `ConsumptionViewConfig` | no | — |
| `params` | `QueryParams` | no | Parámetros de la API ya traducidos desde los filtros de la vista. |
| `enabled` | `boolean` | no | Falso mientras falta un filtro obligatorio (instancia, suscripción, proyecto...). |
| `disabledText` | `string` | no | — |

Internos:

- constante `SWR_OPTIONS`
- función `fetchAll` `(urls: string[]): Promise<MetricPoint[]>`

- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`consumption.ts`](../lib.md#lib-consumption-ts), [`DataStateComponent.tsx`](#components-shared-datastatecomponent-tsx), [`ConsumptionCards.tsx`](#components-shared-consumption-consumptioncards-tsx), [`ConsumptionCharts.tsx`](#components-shared-consumption-consumptioncharts-tsx), [`ConsumptionTable.tsx`](#components-shared-consumption-consumptiontable-tsx), [`consumption.ts`](../tipos.md#interfaces-consumption-ts), [`types.ts`](#components-shared-consumption-types-ts)
- Usado por: [`Ec2InstancesConsumeComponent.tsx`](aws/vista-consumos.md#components-aws-vista-consumos-ec2-ec2instancesconsumecomponent-tsx), [`AsgConsumeComponent.tsx`](aws/vista-consumos.md#components-aws-vista-consumos-ec2-asg-asgconsumecomponent-tsx), [`EksConsumeComponent.tsx`](aws/vista-consumos.md#components-aws-vista-consumos-ec2-eks-eksconsumecomponent-tsx), [`ElbV2ConsumeComponent.tsx`](aws/vista-consumos.md#components-aws-vista-consumos-elbv2-elbv2consumecomponent-tsx), [`NatGatewaysConsumeComponent.tsx`](aws/vista-consumos.md#components-aws-vista-consumos-nat-gateways-natgatewaysconsumecomponent-tsx), [`RdsInstancesConsumeComponent.tsx`](aws/vista-consumos.md#components-aws-vista-consumos-rds-rdsinstancesconsumecomponent-tsx), [`ConsumoAppGwComponent.tsx`](azure/vista-consumo-apps-gateway.md#components-azure-vista-consumo-apps-gateway-consumoappgwcomponent-tsx), [`ConsumoDbComponent.tsx`](azure/vista-consumo-db.md#components-azure-vista-consumo-db-consumodbcomponent-tsx), [`ConsumoNodosComponent.tsx`](azure/vista-consumo-nodos.md#components-azure-vista-consumo-nodos-consumonodoscomponent-tsx), [`ConsumoVmComponent.tsx`](azure/vista-consumo-vm.md#components-azure-vista-consumo-vm-consumovmcomponent-tsx), [`CloudSQLComponent.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-cloud-sql-cloudsqlcomponent-tsx), [`ClusterGkeConsumeComponent.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-clusters-gke-clustergkeconsumecomponent-tsx), [`ComputeEngineConsumeComponent.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-compute-engine-computeengineconsumecomponent-tsx), [`FilestoreConsumeComponent.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-filestore-filestoreconsumecomponent-tsx), [`InstanceGroupConsumeComponent.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-instance-groups-instancegroupconsumecomponent-tsx)

---

<a id="components-shared-consumption-consumptionconfigs-ts"></a>
## `components/shared/consumption/consumptionConfigs.ts`

**Módulo**

Exporta:

- constante `AWS_EC2` = `awsCompute('ec2', 'EC2', 'EC2 Instance')`
- constante `AWS_ASG` = `awsCompute('asg', 'EC2 (Auto Scaling)', 'EC2 Instance (ASG)')`
- constante `AWS_EKS` = `awsCompute('eks', 'EC2 (Nodos EKS)', 'EC2 Instance (EKS)')`
- constante `AWS_RDS` = `{ cloud: 'aws', resource: 'rds', serviceName: 'RDS', resourceTypeLabel: 'RDS In…`
- constante `AWS_NAT` = `{ cloud: 'aws', resource: 'nat-gateways', serviceName: 'NAT Gateway', resourceT…`
- constante `AWS_ELB` = `{ cloud: 'aws', resource: 'load-balancers', serviceName: 'Load Balancer v2', re…`
- constante `AZURE_VM` = `azureCompute('vm', 'Virtual Machines', 'Azure VM')`
- constante `AZURE_NODES` = `azureCompute('nodes', 'Nodos AKS', 'AKS Node')`
- constante `AZURE_DB` = `{ cloud: 'azure', resource: 'db', serviceName: 'Azure Database', resourceTypeLa…`
- constante `AZURE_APP_GATEWAY` = `{ cloud: 'azure', resource: 'app-gateways', serviceName: 'Application Gateway',…`
- constante `GCP_COMPUTE_ENGINE` = `gcpCompute('compute-engine', 'Compute Engine', 'Compute Engine')`
- constante `GCP_INSTANCE_GROUPS` = `gcpCompute('instance-groups', 'Instance Groups', 'Instance Group VM')`
- constante `GCP_GKE` = `gcpCompute('gke', 'Clusters GKE', 'GKE Node')`
- constante `GCP_CLOUD_SQL` = `{ cloud: 'gcp', resource: 'cloud-sql', serviceName: 'Cloud SQL', resourceTypeLa…`
- constante `GCP_FILESTORE` = `{ cloud: 'gcp', resource: 'filestore', serviceName: 'Filestore', resourceTypeLa…`

Internos:

- constante `INSTANCE_LABELS` — Configuración por recurso de la vista compartida de Consumo / Eficiencia. Las rutas apuntan al contrato canónico (`metrics.*` = métricas numéricas, `details.*` = atributos del proveedor).
- constante `DB_LABELS`
- constante `COMPUTE_RECOMMENDATIONS`
- constante `DB_RECOMMENDATIONS`
- constante `NETWORK_RECOMMENDATIONS`
- constante `CPU_COLUMN`
- constante `CPU_GROUP`
- función `awsCompute` `(resource: string, serviceName: string, resourceTypeLabel: string): ConsumptionViewConfig` — AWS — EC2 / Auto Scaling / Nodos EKS (mismo modelo de datos)
- constante `COMPUTE_TABLE` — Azure / GCP — instancias de cómputo (mismo modelo de datos)
- constante `COMPUTE_GROUPS`
- función `azureCompute` `(resource: string, serviceName: string, resourceTypeLabel: string): ConsumptionViewConfig`
- constante `DB_TABLE`
- constante `DB_GROUPS`
- función `gcpCompute` `(resource: string, serviceName: string, resourceTypeLabel: string): ConsumptionViewConfig`

- Usa: [`types.ts`](#components-shared-consumption-types-ts)
- Usado por: [`Ec2InstancesConsumeComponent.tsx`](aws/vista-consumos.md#components-aws-vista-consumos-ec2-ec2instancesconsumecomponent-tsx), [`AsgConsumeComponent.tsx`](aws/vista-consumos.md#components-aws-vista-consumos-ec2-asg-asgconsumecomponent-tsx), [`EksConsumeComponent.tsx`](aws/vista-consumos.md#components-aws-vista-consumos-ec2-eks-eksconsumecomponent-tsx), [`ElbV2ConsumeComponent.tsx`](aws/vista-consumos.md#components-aws-vista-consumos-elbv2-elbv2consumecomponent-tsx), [`NatGatewaysConsumeComponent.tsx`](aws/vista-consumos.md#components-aws-vista-consumos-nat-gateways-natgatewaysconsumecomponent-tsx), [`RdsInstancesConsumeComponent.tsx`](aws/vista-consumos.md#components-aws-vista-consumos-rds-rdsinstancesconsumecomponent-tsx), [`ConsumoAppGwComponent.tsx`](azure/vista-consumo-apps-gateway.md#components-azure-vista-consumo-apps-gateway-consumoappgwcomponent-tsx), [`ConsumoDbComponent.tsx`](azure/vista-consumo-db.md#components-azure-vista-consumo-db-consumodbcomponent-tsx), [`ConsumoNodosComponent.tsx`](azure/vista-consumo-nodos.md#components-azure-vista-consumo-nodos-consumonodoscomponent-tsx), [`ConsumoVmComponent.tsx`](azure/vista-consumo-vm.md#components-azure-vista-consumo-vm-consumovmcomponent-tsx), [`CloudSQLComponent.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-cloud-sql-cloudsqlcomponent-tsx), [`ClusterGkeConsumeComponent.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-clusters-gke-clustergkeconsumecomponent-tsx), [`ComputeEngineConsumeComponent.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-compute-engine-computeengineconsumecomponent-tsx), [`FilestoreConsumeComponent.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-filestore-filestoreconsumecomponent-tsx), [`InstanceGroupConsumeComponent.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-instance-groups-instancegroupconsumecomponent-tsx)

---

<a id="components-shared-consumption-types-ts"></a>
## `components/shared/consumption/types.ts`

**Módulo**

Exporta:

- interfaz `FieldDef` — Un valor a mostrar, leído por ruta del recurso ("metrics.avg_cpu_utilization", "details.vpc_id", "resource_type").
- interfaz `MetricColumnDef` — Columna numérica de la tabla, con barra relativa al máximo visible.
- interfaz `MetricGroupDef`
- interfaz `ConsumptionViewConfig` — Configuración de una vista de consumo. Todo lo que cambia entre nubes/recursos vive aquí; el diseño (tarjetas, gráficos, tabla y detalle) es el mismo para todas.

Interfaz `FieldDef` (exportada) — Un valor a mostrar, leído por ruta del recurso ("metrics.avg_cpu_utilization", "details.vpc_id", "resource_type").:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `label` | `string` | no | — |
| `path` | `string` | no | — |
| `format` | `ValueFormat \| 'text' \| 'date'` | sí | — |
| `unit` | `string` | sí | — |

Interfaz `MetricColumnDef` (exportada) — Columna numérica de la tabla, con barra relativa al máximo visible.:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `bar` | `boolean` | sí | — |
| `secondary` | `FieldDef` | sí | Segunda línea opcional (p. ej. "Máx" o tráfico de salida). |

Interfaz `MetricGroupDef` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `title` | `string` | no | — |
| `rows` | `FieldDef[]` | no | — |

Interfaz `ConsumptionViewConfig` (exportada) — Configuración de una vista de consumo. Todo lo que cambia entre nubes/recursos vive aquí; el diseño (tarjetas, gráficos, tabla y detalle) es el mismo para todas.:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `ConsumptionCloud` | no | — |
| `resource` | `string` | no | Segmento de ruta del recurso: 'ec2', 'vm', 'compute-engine', 'cloud-sql', ... Etiqueta del recurso en el detalle ("EC2 Instance", "Cloud SQL"). |
| `serviceName` | `string` | no | Nombre del servicio en textos: "EC2", "Compute Engine", "Azure Database". |
| `resourceTypeLabel` | `string` | no | — |
| `labels` | `{ total: string; unit: string; idle: string; underutilized: string }` | no | Textos de las tarjetas de resumen. |
| `metricsEndpoints` | `string[]` | no | Endpoints de series: ['metrics'] o uno por métrica ('metrics/cpu-usage', ...). |
| `hasEfficiency` | `boolean` | no | — |
| `tableColumns` | `MetricColumnDef[]` | no | Columnas de métricas de la tabla (además de recurso, estado, ubicación, clasificación, costo y sincronización). |
| `generalFields` | `FieldDef[]` | no | Campos de "Información General" en el detalle. |
| `metricGroups` | `MetricGroupDef[]` | no | Bloques de "Métricas" en el detalle. |
| `historyColumns` | `FieldDef[]` | sí | Columnas del historial por sincronización (rutas relativas al registro: 'metrics.x', 'cost'). |
| `showStorageInefficient` | `boolean` | sí | — |
| `recommendations` | `{ idle: string; underutilized: string }` | no | — |
| `emptyText` | `string` | no | — |

- Usa: [`consumption.ts`](../tipos.md#interfaces-consumption-ts), [`consumption.ts`](../lib.md#lib-consumption-ts)
- Usado por: [`ConsumptionCards.tsx`](#components-shared-consumption-consumptioncards-tsx), [`ConsumptionDetailModal.tsx`](#components-shared-consumption-consumptiondetailmodal-tsx), [`ConsumptionTable.tsx`](#components-shared-consumption-consumptiontable-tsx), [`ConsumptionView.tsx`](#components-shared-consumption-consumptionview-tsx), [`consumptionConfigs.ts`](#components-shared-consumption-consumptionconfigs-ts)

---

<a id="components-shared-filters-basefilterscomponent-tsx"></a>
## `components/shared/filters/BaseFiltersComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `FilterField` `({ icon, label, className, children }: { icon?: ReactNode; label: ReactNode; className?: string; children: ReactNode })` — Campo de filtro con su etiqueta (ícono + texto), para que las 3 nubes se vean igual.
- componente `BaseFiltersComponent` `({ dateRange, monthYear, children, onApply, onClear, view }: BaseFiltersComponentProps)` — Base común de los filtros de AWS, Azure y GCP (F-06): tarjeta, período, botones Aplicar/Limpiar y la vista. Cada `FiltersComponent` de nube maneja su estado y agrega sus propios campos como `children`.

Interfaz `DateRangeControl`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `value` | `[Date \| null, Date \| null]` | no | — |
| `onChange` | `(range: [Date \| null, Date \| null]) => void` | no | — |
| `label` | `string` | sí | — |

Interfaz `MonthYearControl`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `value` | `Date \| null` | no | — |
| `onChange` | `(date: Date \| null) => void` | no | — |
| `label` | `string` | sí | — |

Interfaz `BaseFiltersComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `dateRange` | `DateRangeControl` | sí | Período (rango de fechas); se omite si la vista no filtra por fecha. |
| `monthYear` | `MonthYearControl` | sí | Selector de mes y año (vistas mensuales). |
| `children` | `ReactNode` | sí | Filtros propios de cada nube (región, suscripción, proyectos, tags, recursos...). |
| `onApply` | `() => void` | no | — |
| `onClear` | `() => void` | no | — |
| `view` | `ReactNode` | no | Vista que recibe los filtros aplicados. |

Internos:

- constante `INPUT_CLASS`

- Usa: [`button.tsx`](ui.md#components-ui-button-tsx), [`card.tsx`](ui.md#components-ui-card-tsx)
- Usado por: [`FiltersComponent.tsx`](general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](general_gcp.md#components-general-gcp-filters-filterscomponent-tsx)

---

<a id="components-shared-unused-unusedcards-tsx"></a>
## `components/shared/unused/UnusedCards.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedCards` `({ config, summary, resources }: UnusedCardsProps)` — Costo y ahorro (si la API los entrega), recursos analizados con su diagnóstico, totales de capacidad, distribuciones y una tarjeta por métrica (promedio y peak).

Interfaz `UnusedCardsProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `config` | `UnusedViewConfig` | no | — |
| `summary` | `UnusedMetricSummary[]` | no | — |
| `resources` | `UnusedResource[]` | no | — |

Internos:

- función `metricIcon` `(metric: string): LucideIcon`
- constante `COLORS`
- componente `BreakdownCard` `({ breakdown, resources }: { breakdown: BreakdownDef; resources: UnusedResource[] })` — Cuántos recursos hay por cada valor de un campo (tipo, región, estado...).

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`StatCard.tsx`](#components-shared-statcard-tsx), [`format.ts`](../lib.md#lib-format-ts), [`consumption.ts`](../lib.md#lib-consumption-ts), [`unused.ts`](../lib.md#lib-unused-ts), [`unused.ts`](../tipos.md#interfaces-unused-ts), [`types.ts`](#components-shared-unused-types-ts)
- Usado por: [`UnusedView.tsx`](#components-shared-unused-unusedview-tsx)

---

<a id="components-shared-unused-unuseddetailmodal-tsx"></a>
## `components/shared/unused/UnusedDetailModal.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedDetailModal` `({ resource, config, associatedUrl, isOpen, onClose }: UnusedDetailModalProps)`

Interfaz `UnusedDetailModalProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource` | `UnusedResource` | no | — |
| `config` | `UnusedViewConfig` | no | — |
| `associatedUrl` | `string` | sí | URL de `/associated` para este recurso (solo si `config.hasAssociated`). |
| `isOpen` | `boolean` | no | — |
| `onClose` | `() => void` | no | — |

Internos:

- función `yesNo` `(value: boolean | null)`
- componente `Section` `({ icon: Icon, title, children }: { icon: typeof Activity; title: string; children: React.ReactNode })`
- componente `DiagnosisView` `({ resource, config }: { resource: UnusedResource; config: UnusedViewConfig })`
- componente `ResourcesView` `({ resource, config }: { resource: UnusedResource; config: UnusedViewConfig })`
- componente `RelatedTables` `({ items }: { items: UnusedRelated[] })` — Elementos relacionados agrupados por bloque (registros DNS, backend pools, subredes, target groups...).
- componente `RelatedView` `({ resource, associatedUrl }: { resource: UnusedResource; associatedUrl?: string })` — Lo relacionado que trae la fila + lo que se consulta al abrir el detalle (`/associated`), si el recurso lo tiene.
- componente `HistoryView` `({ resource, config }: { resource: UnusedResource; config: UnusedViewConfig })`

- Hooks: `useSWR`
- Usa: [`badge.tsx`](ui.md#components-ui-badge-tsx), [`scroll-area.tsx`](ui.md#components-ui-scroll-area-tsx), [`table.tsx`](ui.md#components-ui-table-tsx), [`HistoryModal.tsx`](general_gcp.md#components-general-gcp-modal-historymodal-tsx), [`DataStateComponent.tsx`](#components-shared-datastatecomponent-tsx), [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`format.ts`](../lib.md#lib-format-ts), [`consumption.ts`](../lib.md#lib-consumption-ts), [`unused.ts`](../lib.md#lib-unused-ts), [`unused.ts`](../tipos.md#interfaces-unused-ts), [`types.ts`](#components-shared-unused-types-ts)
- Usado por: [`UnusedTable.tsx`](#components-shared-unused-unusedtable-tsx)

---

<a id="components-shared-unused-unusedtable-tsx"></a>
## `components/shared/unused/UnusedTable.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedTable` `({ resources, config, associatedUrl }: UnusedTableProps)` — Una fila por recurso: diagnóstico, costo / ahorro, barras por métrica, datos de inventario y el detalle.

Interfaz `UnusedTableProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resources` | `UnusedResource[]` | no | — |
| `config` | `UnusedViewConfig` | no | — |
| `associatedUrl` | `(resourceId: string) => string` | sí | URL de `/associated` de un recurso (solo si `config.hasAssociated`). |

- Tipo interno `Row` = `UnusedResource & Record<string, unknown>`
Internos:

- función `rowOf` `(info: unknown): Row` — DynamicColumn tipa `cell` con `info: unknown`; aquí se acota al contexto de celda de TanStack.
- constante `DIAGNOSIS_ORDER`
- función `attributeColumnKey` `(key: string)`
- componente `ResourceCell` `({ row, config }: { row: Row; config: UnusedViewConfig })`
- componente `MetricCell` `({ row, group, definition }: { row: Row; group: MetricGroup; definition: MetricDefinition })` — Valor del recurso + barra (ranking: respecto del más cargado; contribution: % del total del grupo).
- componente `AmountCell` `({ value, total, currency }: { value: number | null; total: number; currency: string })` — Monto con barra relativa al total de la tabla (costo del período o ahorro mensual).
- componente `DetailsCell` `({ row, config, associatedUrl }: { row: Row; config: UnusedViewConfig; associatedUrl?: (resourceId: string) => string })`
- componente `TableLegend` `()`

- Hooks: `useSearchParams`
- Usa: [`badge.tsx`](ui.md#components-ui-badge-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`columns.tsx`](data-table.md#components-data-table-columns-tsx), [`data-table-grouping.tsx`](data-table.md#components-data-table-data-table-grouping-tsx), [`UnusedDetailModal.tsx`](#components-shared-unused-unuseddetailmodal-tsx), [`format.ts`](../lib.md#lib-format-ts), [`consumption.ts`](../lib.md#lib-consumption-ts), [`unused.ts`](../lib.md#lib-unused-ts), [`unused.ts`](../tipos.md#interfaces-unused-ts), [`types.ts`](#components-shared-unused-types-ts)
- Usado por: [`UnusedView.tsx`](#components-shared-unused-unusedview-tsx)

---

<a id="components-shared-unused-unusedview-tsx"></a>
## `components/shared/unused/UnusedView.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedView` `({ config, params, enabled, disabledText }: UnusedViewProps)` — Vista estándar de Recursos sin uso: tarjetas, gráficos (si el recurso tiene series) y la tabla de recursos con diagnóstico, costo y detalle. Igual para AWS, Azure y GCP; lo propio de cada recurso vive en `config`.

Interfaz `UnusedViewProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `config` | `UnusedViewConfig` | no | — |
| `params` | `QueryParams` | no | Parámetros de la API ya traducidos desde los filtros de la vista (incluye `resource` cuando hay selección). |
| `enabled` | `boolean` | no | Falso mientras falta un filtro obligatorio (instancia, VM, grupo, proyecto...). |
| `disabledText` | `string` | no | — |

Internos:

- constante `SWR_OPTIONS`
- componente `SectionTitle` `({ icon: Icon, children }: { icon: typeof Clock; children: React.ReactNode })`

- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`consumption.ts`](../lib.md#lib-consumption-ts), [`unused.ts`](../lib.md#lib-unused-ts), [`DataStateComponent.tsx`](#components-shared-datastatecomponent-tsx), [`ConsumptionCharts.tsx`](#components-shared-consumption-consumptioncharts-tsx), [`UnusedCards.tsx`](#components-shared-unused-unusedcards-tsx), [`UnusedTable.tsx`](#components-shared-unused-unusedtable-tsx), [`unused.ts`](../tipos.md#interfaces-unused-ts), [`types.ts`](#components-shared-unused-types-ts)
- Usado por: [`UnusedEbsComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-ebs-unusedebscomponent-tsx), [`UnusedAutoscalingComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-ec2-unusedautoscalingcomponent-tsx), [`UnusedEc2Component.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-ec2-unusedec2component-tsx), [`UnusedEksComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-ec2-unusedekscomponent-tsx), [`UnusedElbV2Component.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-elbv2-unusedelbv2component-tsx), [`UnusedNatGatewaysComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-nat-gateways-unusednatgatewayscomponent-tsx), [`UnusedRoute53Component.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-r53-unusedroute53component-tsx), [`UnusedAppsGwComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-apps-gateway-unusedappsgwcomponent-tsx), [`UnusedLoadbalancersComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-loadbalancers-unusedloadbalancerscomponent-tsx), [`UnusedVmExtensionsComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-resources-extensions-unusedvmextensionscomponent-tsx), [`UnusedVmComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-resources-vm-unusedvmcomponent-tsx), [`UnusedVmssComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-resources-vmss-unusedvmsscomponent-tsx), [`UnusedTrafficManagerComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-traffic-managers-unusedtrafficmanagercomponent-tsx), [`IPsSinUsoComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-networking-ips-sin-uso-ipssinusocomponent-tsx), [`UnusedGkeComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-clusters-gke-unusedgkecomponent-tsx), [`UnusedCeComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-compute-engine-unusedcecomponent-tsx), [`DiscosPersistentesComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-discos-persistentes-discospersistentescomponent-tsx), [`FilestoreSinUsoComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-filestore-filestoresinusocomponent-tsx), [`UnusedIgComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-instance-groups-unusedigcomponent-tsx)

---

<a id="components-shared-unused-types-ts"></a>
## `components/shared/unused/types.ts`

**Módulo**

Exporta:

- interfaz `AttributeDef` — Un dato de `attributes` del recurso (capacidad / configuración).
- interfaz `BreakdownDef` — Tarjeta de distribución: cuántos recursos hay por cada valor de un campo.
- interfaz `UnusedViewConfig` — Configuración de una vista de recursos sin uso. Todo lo que cambia entre nubes/recursos vive aquí; el diseño (tarjetas, gráficos, tabla y detalle) es el mismo para todas.

Interfaz `AttributeDef` (exportada) — Un dato de `attributes` del recurso (capacidad / configuración).:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `key` | `string` | no | — |
| `label` | `string` | no | — |
| `format` | `ValueFormat \| 'text' \| 'boolean' \| 'date'` | sí | — |
| `unit` | `string` | sí | — |
| `total` | `boolean` | sí | Además de mostrarse en el detalle, se suma en una tarjeta de resumen. |

Interfaz `BreakdownDef` (exportada) — Tarjeta de distribución: cuántos recursos hay por cada valor de un campo.:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `key` | `string` | no | Clave de `attributes` o campo del recurso ('resource_type', 'region', 'status', 'scope'). |
| `label` | `string` | no | — |

Interfaz `UnusedViewConfig` (exportada) — Configuración de una vista de recursos sin uso. Todo lo que cambia entre nubes/recursos vive aquí; el diseño (tarjetas, gráficos, tabla y detalle) es el mismo para todas.:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `UnusedCloud` | no | — |
| `resource` | `string` | no | Segmento de ruta del recurso: 'ec2', 'asg', 'ebs', 'vm', 'compute-engine', 'nat-gateways', ... Etiqueta del recurso en el detalle ("EC2 Instance", "EBS Volume"). |
| `serviceName` | `string` | no | Nombre en plural para textos: "instancias EC2", "volúmenes EBS", "VMs". |
| `resourceTypeLabel` | `string` | no | — |
| `cardMetrics` | `MetricGroup[]` | no | Tarjetas de métricas (promedio y peak del período). |
| `tableMetrics` | `MetricGroup[]` | no | Columnas de métricas de la tabla (barras con el promedio del recurso). |
| `attributes` | `AttributeDef[]` | sí | Datos de `attributes` que se muestran en el detalle (y opcionalmente se suman en tarjetas). |
| `tableAttributes` | `AttributeDef[]` | sí | Columnas de atributos en la tabla (inventarios sin métricas: tamaño, tipo, días reservada...). |
| `breakdowns` | `BreakdownDef[]` | sí | Tarjetas de distribución (por tipo, región, estado...). |
| `summaryFromResources` | `boolean` | sí | El recurso no tiene `/summary`: las tarjetas de métricas se calculan desde las filas. |
| `hasSeries` | `boolean` | sí | Hay gráficos de series (`/series`). |
| `hasAssociated` | `boolean` | sí | Hay recursos asociados que se consultan al abrir el detalle (`/associated`). |
| `groupByAttribute` | `string` | sí | Agrupa la tabla por un atributo (debe estar en `tableAttributes`). |
| `metricOverrides` | `Record<string, MetricDefinition>` | sí | Formato propio de este recurso para alguna métrica (por clave normalizada, ver `metricKey`). |
| `diagnosisRule` | `string` | no | Regla del diagnóstico, para los textos ("CPU promedio < 10%"). |
| `resourceLink` | `(resource: UnusedResource, ctx: ResourceLinkContext) => ResourceLink …` | sí | — |
| `emptyText` | `string` | no | — |

- Usa: [`consumption.ts`](../lib.md#lib-consumption-ts), [`unused.ts`](../lib.md#lib-unused-ts), [`unused.ts`](../tipos.md#interfaces-unused-ts), [`types.ts`](#components-shared-working-hours-types-ts)
- Usado por: [`UnusedCards.tsx`](#components-shared-unused-unusedcards-tsx), [`UnusedDetailModal.tsx`](#components-shared-unused-unuseddetailmodal-tsx), [`UnusedTable.tsx`](#components-shared-unused-unusedtable-tsx), [`UnusedView.tsx`](#components-shared-unused-unusedview-tsx), [`unusedConfigs.ts`](#components-shared-unused-unusedconfigs-ts)

---

<a id="components-shared-unused-unusedconfigs-ts"></a>
## `components/shared/unused/unusedConfigs.ts`

**Módulo**

Configuración de cada vista de "Recursos sin uso" (grupo por métricas; rutas /api/{cloud}/unused/{resource}/*).
Lo común (tarjetas, gráficos, tabla, detalle) está en los componentes de `components/shared/unused`.

Exporta:

- constante `AWS_EC2_UNUSED` = `{ ...awsEc2Base, resource: 'ec2', serviceName: 'instancias EC2', emptyText: 'No…`
- constante `AWS_ASG_UNUSED` = `{ ...awsEc2Base, resource: 'asg', serviceName: 'instancias de Auto Scaling Grou…`
- constante `AWS_EKS_UNUSED` = `{ ...awsEc2Base, resource: 'eks', serviceName: 'nodos EKS', emptyText: 'No enco…`
- constante `AWS_EBS_UNUSED` = `{ cloud: 'aws', resource: 'ebs', serviceName: 'volúmenes EBS', resourceTypeLabe…`
- constante `AZURE_VM_UNUSED` = `{ ...azureBase, resource: 'vm', serviceName: 'VMs', resourceTypeLabel: 'Virtual…`
- constante `AZURE_VMSS_UNUSED` = `{ ...azureBase, resource: 'vmss', serviceName: 'VMSS', resourceTypeLabel: 'Virt…`
- constante `GCP_COMPUTE_ENGINE_UNUSED` = `{ ...gcpBase, resource: 'compute-engine', serviceName: 'instancias Compute Engi…`
- constante `GCP_INSTANCE_GROUPS_UNUSED` = `{ ...gcpBase, resource: 'instance-groups', serviceName: 'instancias de Instance…`
- constante `GCP_GKE_UNUSED` = `{ ...gcpBase, resource: 'gke', serviceName: 'nodos GKE', resourceTypeLabel: 'No…`
- constante `AWS_NAT_GATEWAYS_UNUSED` = `{ cloud: 'aws', resource: 'nat-gateways', serviceName: 'NAT Gateways', resource…` — Ronda B: recursos con diagnóstico propio e inventarios (las tarjetas se calculan desde las filas)
- constante `AWS_LOAD_BALANCERS_UNUSED` = `{ cloud: 'aws', resource: 'load-balancers', serviceName: 'Load Balancers', reso…`
- constante `AWS_ROUTE53_UNUSED` = `{ cloud: 'aws', resource: 'route53', serviceName: 'hosted zones', resourceTypeL…`
- constante `AZURE_LOAD_BALANCERS_UNUSED` = `{ cloud: 'azure', resource: 'load-balancers', serviceName: 'Load Balancers', re…`
- constante `AZURE_APP_GATEWAYS_UNUSED` = `{ cloud: 'azure', resource: 'app-gateways', serviceName: 'Application Gateways'…`
- constante `AZURE_TRAFFIC_MANAGERS_UNUSED` = `{ cloud: 'azure', resource: 'traffic-managers', serviceName: 'Traffic Managers'…`
- constante `AZURE_VM_EXTENSIONS_UNUSED` = `{ cloud: 'azure', resource: 'vm-extensions', serviceName: 'extensiones', resour…`
- constante `GCP_PERSISTENT_DISKS_UNUSED` = `{ cloud: 'gcp', resource: 'persistent-disks', serviceName: 'discos persistentes…` — GCP: discos persistentes, Filestore e IPs
- constante `GCP_FILESTORE_UNUSED` = `{ cloud: 'gcp', resource: 'filestore', serviceName: 'instancias Filestore', res…`
- constante `GCP_IPS_UNUSED` = `{ cloud: 'gcp', resource: 'ips', serviceName: 'IPs', resourceTypeLabel: 'Direcc…`

Internos:

- función `awsEc2Link` `(r: UnusedResource, { param }: ResourceLinkContext): ResourceLink` — Enlaces a las vistas de recursos
- función `gcpComputeLink` `(r: UnusedResource, { param }: ResourceLinkContext): ResourceLink`
- función `azureVmLink` `(r: UnusedResource, { param }: ResourceLinkContext): ResourceLink`
- constante `AWS_EC2_METRICS` — Métricas
- constante `AWS_EC2_CARDS`
- constante `GCP_COMPUTE_METRICS`
- constante `GCP_COMPUTE_CARDS`
- constante `AZURE_OVERRIDES` — Los pipelines de Azure entregan la memoria disponible en bytes (en otras familias viene en GB).
- constante `AZURE_ATTRIBUTES`
- constante `CPU_RULE`
- constante `awsEc2Base` — AWS
- constante `azureBase` — Azure
- constante `gcpBase` — GCP
- constante `R53_ATTRIBUTES`
- constante `AZURE_LB_ATTRIBUTES` — Azure: Load Balancer / Application Gateway / Traffic Manager / extensiones de VM
- constante `AZURE_APPGW_ATTRIBUTES`
- constante `AZURE_TM_ATTRIBUTES`
- constante `AZURE_EXTENSION_ATTRIBUTES`

- Usa: [`consumption.ts`](../lib.md#lib-consumption-ts), [`unused.ts`](../lib.md#lib-unused-ts), [`unused.ts`](../tipos.md#interfaces-unused-ts), [`types.ts`](#components-shared-working-hours-types-ts), [`types.ts`](#components-shared-unused-types-ts)
- Usado por: [`UnusedEbsComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-ebs-unusedebscomponent-tsx), [`UnusedAutoscalingComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-ec2-unusedautoscalingcomponent-tsx), [`UnusedEc2Component.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-ec2-unusedec2component-tsx), [`UnusedEksComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-ec2-unusedekscomponent-tsx), [`UnusedElbV2Component.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-elbv2-unusedelbv2component-tsx), [`UnusedNatGatewaysComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-nat-gateways-unusednatgatewayscomponent-tsx), [`UnusedRoute53Component.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-r53-unusedroute53component-tsx), [`UnusedAppsGwComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-apps-gateway-unusedappsgwcomponent-tsx), [`UnusedLoadbalancersComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-loadbalancers-unusedloadbalancerscomponent-tsx), [`UnusedVmExtensionsComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-resources-extensions-unusedvmextensionscomponent-tsx), [`UnusedVmComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-resources-vm-unusedvmcomponent-tsx), [`UnusedVmssComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-resources-vmss-unusedvmsscomponent-tsx), [`UnusedTrafficManagerComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-traffic-managers-unusedtrafficmanagercomponent-tsx), [`IPsSinUsoComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-networking-ips-sin-uso-ipssinusocomponent-tsx), [`UnusedGkeComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-clusters-gke-unusedgkecomponent-tsx), [`UnusedCeComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-compute-engine-unusedcecomponent-tsx), [`DiscosPersistentesComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-discos-persistentes-discospersistentescomponent-tsx), [`FilestoreSinUsoComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-filestore-filestoresinusocomponent-tsx), [`UnusedIgComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-instance-groups-unusedigcomponent-tsx)

---

<a id="components-shared-working-hours-workinghourscards-tsx"></a>
## `components/shared/working-hours/WorkingHoursCards.tsx`

**Componente (cliente)**

Exporta:

- componente `WorkingHoursCards` `({ data, config }: { data: WorkingHoursSummaryItem[]; config: WorkingHoursViewConfig })` — Una tarjeta por métrica: promedio, máximo y mínimo en horario hábil y no hábil.

Internos:

- función `metricIcon` `(name: string): LucideIcon`
- constante `STYLES`
- componente `ScheduleColumn` `({ item, schedule, definition }: { item?: WorkingHoursSummaryItem; schedule: ScheduleType; definition: MetricDefinition…`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`consumption.ts`](../lib.md#lib-consumption-ts), [`workingHours.ts`](../lib.md#lib-workinghours-ts), [`workingHours.ts`](../tipos.md#interfaces-workinghours-ts), [`types.ts`](#components-shared-working-hours-types-ts)
- Usado por: [`WorkingHoursView.tsx`](#components-shared-working-hours-workinghoursview-tsx)

---

<a id="components-shared-working-hours-workinghourscharts-tsx"></a>
## `components/shared/working-hours/WorkingHoursCharts.tsx`

**Componente (cliente)**

Exporta:

- componente `WorkingHoursCharts` `({ data, config }: { data: WorkingHoursPoint[]; config: WorkingHoursViewConfig })` — Un gráfico por métrica con la serie hábil (azul) y no hábil (rojo), en hora de Santiago.

Interfaz `TooltipParam`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `axisValue` | `number \| string` | sí | — |
| `seriesName` | `string` | sí | — |
| `color` | `string` | sí | — |
| `value` | `[string, number \| null]` | sí | — |

Internos:

- constante `BUSINESS_COLOR`
- constante `NON_BUSINESS_COLOR`
- función `average` `(values: number[])`
- componente `MetricChart` `({ metric, points, definition }: { metric: string; points: WorkingHoursPoint[]; definition: MetricDefinition })`

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../lib.md#lib-echartsglobalconfig-ts), [`consumption.ts`](../lib.md#lib-consumption-ts), [`workingHours.ts`](../lib.md#lib-workinghours-ts), [`workingHours.ts`](../tipos.md#interfaces-workinghours-ts), [`types.ts`](#components-shared-working-hours-types-ts)
- Usado por: [`WorkingHoursView.tsx`](#components-shared-working-hours-workinghoursview-tsx)

Notas de implementación:

- _MetricChart_: Series "espejo": cada punto va a su horario y deja un null en el otro, así las líneas se cortan al cambiar de turno.

---

<a id="components-shared-working-hours-workinghoursdetailmodal-tsx"></a>
## `components/shared/working-hours/WorkingHoursDetailModal.tsx`

**Componente (cliente)**

Exporta:

- componente `WorkingHoursDetailModal` `({ resource, config, isOpen, onClose }: WorkingHoursDetailModalProps)`

Interfaz `WorkingHoursDetailModalProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource` | `WorkingHoursResource` | no | — |
| `config` | `WorkingHoursViewConfig` | no | — |
| `isOpen` | `boolean` | no | — |
| `onClose` | `() => void` | no | — |

Internos:

- componente `MetaRow` `({ label, children }: { label: string; children: React.ReactNode })`
- componente `SummaryView` `({ resource, config }: { resource: WorkingHoursResource; config: WorkingHoursViewConfig })`
- componente `MetricsView` `({ resource, config }: { resource: WorkingHoursResource; config: WorkingHoursViewConfig })`

- Usa: [`scroll-area.tsx`](ui.md#components-ui-scroll-area-tsx), [`table.tsx`](ui.md#components-ui-table-tsx), [`HistoryModal.tsx`](general_gcp.md#components-general-gcp-modal-historymodal-tsx), [`consumption.ts`](../lib.md#lib-consumption-ts), [`workingHours.ts`](../lib.md#lib-workinghours-ts), [`workingHours.ts`](../tipos.md#interfaces-workinghours-ts), [`types.ts`](#components-shared-working-hours-types-ts)
- Usado por: [`WorkingHoursTable.tsx`](#components-shared-working-hours-workinghourstable-tsx)

---

<a id="components-shared-working-hours-workinghourstable-tsx"></a>
## `components/shared/working-hours/WorkingHoursTable.tsx`

**Componente (cliente)**

Exporta:

- componente `WorkingHoursTable` `({ resources, config }: { resources: WorkingHoursResource[]; config: WorkingHoursViewConfig })` — Una fila por recurso y sincronización: barras hábil / no hábil por métrica, tendencia global y detalle.

- Tipo interno `Row` = `WorkingHoursResource & Record<string, unknown>`
Internos:

- función `rowOf` `(info: unknown): Row` — DynamicColumn tipa `cell` con `info: unknown`; aquí se acota al contexto de celda de TanStack.
- función `metricColumnKey` `(index: number)`
- componente `ResourceCell` `({ row, config }: { row: Row; config: WorkingHoursViewConfig })`
- componente `DualMetricCell` `({ row, metric, max, definition }: { row: Row; metric: string; max: number; definition: MetricDefinition })` — Barras hábil / no hábil de una métrica, relativas al máximo visible (o a 100 si es porcentaje).
- componente `TrendCell` `({ row }: { row: Row })`
- componente `DetailsCell` `({ row, config }: { row: Row; config: WorkingHoursViewConfig })`
- componente `TableLegend` `()`

- Hooks: `useSearchParams`
- Usa: [`badge.tsx`](ui.md#components-ui-badge-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`columns.tsx`](data-table.md#components-data-table-columns-tsx), [`data-table-grouping.tsx`](data-table.md#components-data-table-data-table-grouping-tsx), [`WorkingHoursDetailModal.tsx`](#components-shared-working-hours-workinghoursdetailmodal-tsx), [`consumption.ts`](../lib.md#lib-consumption-ts), [`workingHours.ts`](../lib.md#lib-workinghours-ts), [`workingHours.ts`](../tipos.md#interfaces-workinghours-ts), [`types.ts`](#components-shared-working-hours-types-ts)
- Usado por: [`WorkingHoursView.tsx`](#components-shared-working-hours-workinghoursview-tsx)

---

<a id="components-shared-working-hours-workinghoursview-tsx"></a>
## `components/shared/working-hours/WorkingHoursView.tsx`

**Componente (cliente)**

Exporta:

- componente `WorkingHoursView` `({ config, params, enabled, disabledText }: WorkingHoursViewProps)` — Vista estándar de Horario hábil vs no hábil: tarjetas por métrica, un gráfico por métrica y la tabla de recursos con su detalle. Igual para AWS, Azure y GCP; lo propio de cada recurso vive en `config`.

Interfaz `WorkingHoursViewProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `config` | `WorkingHoursViewConfig` | no | — |
| `params` | `QueryParams` | no | Parámetros de la API ya traducidos desde los filtros de la vista. |
| `enabled` | `boolean` | no | Falso mientras falta un filtro obligatorio (instancia, suscripción, proyecto...). |
| `disabledText` | `string` | no | — |

Internos:

- constante `SWR_OPTIONS`
- componente `SectionTitle` `({ children }: { children: React.ReactNode })`

- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`consumption.ts`](../lib.md#lib-consumption-ts), [`workingHours.ts`](../lib.md#lib-workinghours-ts), [`DataStateComponent.tsx`](#components-shared-datastatecomponent-tsx), [`WorkingHoursCards.tsx`](#components-shared-working-hours-workinghourscards-tsx), [`WorkingHoursCharts.tsx`](#components-shared-working-hours-workinghourscharts-tsx), [`WorkingHoursTable.tsx`](#components-shared-working-hours-workinghourstable-tsx), [`workingHours.ts`](../tipos.md#interfaces-workinghours-ts), [`types.ts`](#components-shared-working-hours-types-ts)
- Usado por: [`ConsumoEC2AsgHorarioComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil-consumoec2asghorariocomponent-tsx), [`ConsumoEC2HorarioComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-horario-habil-vs-no-habil-consumoec2horariocomponent-tsx), [`ConsumoEC2NodosEKSHorarioComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-nodos-eks-horario-habil-vs-no-habil-consumoec2nodosekshorariocomponent-tsx), [`ConsumoRdsHorarioComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-rds-horario-habil-vs-no-habil-consumordshorariocomponent-tsx), [`AzureDbWorkingNonWorkingHoursComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-consumo-horario-habil-no-habil-data-bases-azuredbworkingnonworkinghourscomponent-tsx), [`AzureNodosWorkingNonWorkingHoursComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-consumo-horario-habil-no-habil-nodes-azurenodosworkingnonworkinghourscomponent-tsx), [`AzureVmWorkingNonWorkingHoursComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-consumo-horario-habil-no-habil-virtual-machines-azurevmworkingnonworkinghourscomponent-tsx), [`CloudSqlWorkingNonWorkingHoursComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-cloud-sql-cloudsqlworkingnonworkinghourscomponent-tsx), [`GkeWorkingNonWorkingHoursComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-cluster-gke-gkeworkingnonworkinghourscomponent-tsx), [`CeWorkingNonWorkingHoursComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-compute-engine-ceworkingnonworkinghourscomponent-tsx), [`FsWorkingNonWorkingHoursComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-filestore-fsworkingnonworkinghourscomponent-tsx), [`IgWorkingNonWorkingHoursComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-instance-group-igworkingnonworkinghourscomponent-tsx)

---

<a id="components-shared-working-hours-types-ts"></a>
## `components/shared/working-hours/types.ts`

**Módulo**

Exporta:

- interfaz `ResourceLinkContext` — Lo que la columna "Recurso" necesita para armar el enlace a la vista del recurso.
- interfaz `ResourceLink`
- interfaz `WorkingHoursViewConfig` — Configuración de una vista de horario hábil vs no hábil. Todo lo que cambia entre nubes/recursos vive aquí; el diseño (tarjetas, gráficos, tabla y detalle) es el mismo para todas.

Interfaz `ResourceLinkContext` (exportada) — Lo que la columna "Recurso" necesita para armar el enlace a la vista del recurso.:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `param` | `(name: string) => string \| null` | no | Lee un parámetro de la URL actual (fechas, región, proyecto...). |

Interfaz `ResourceLink` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `pathname` | `string` | no | — |
| `query` | `Record<string, string \| null \| undefined>` | no | — |

Interfaz `WorkingHoursViewConfig` (exportada) — Configuración de una vista de horario hábil vs no hábil. Todo lo que cambia entre nubes/recursos vive aquí; el diseño (tarjetas, gráficos, tabla y detalle) es el mismo para todas.:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `WorkingHoursCloud` | no | — |
| `resource` | `string` | no | Segmento de ruta del recurso: 'ec2', 'rds', 'vm', 'compute-engine', 'cloud-sql', ... Etiqueta del recurso en el detalle ("EC2", "RDS", "Compute Engine"). Enlace a la vista del recurso; sin él, el nombre se muestra sin enlace. |
| `serviceName` | `string` | no | Nombre del servicio en títulos: "instancias EC2", "Máquinas Virtuales Azure", "instancias Cloud SQL". |
| `resourceTypeLabel` | `string` | no | — |
| `metricOverrides` | `Record<string, MetricDefinition>` | sí | Formato propio de este recurso para alguna métrica (por clave normalizada, ver `metricKey`). |
| `resourceLink` | `(resource: WorkingHoursResource, ctx: ResourceLinkContext) => Resourc…` | sí | — |
| `emptyText` | `string` | no | — |

- Usa: [`consumption.ts`](../lib.md#lib-consumption-ts), [`workingHours.ts`](../tipos.md#interfaces-workinghours-ts)
- Usado por: [`types.ts`](#components-shared-unused-types-ts), [`unusedConfigs.ts`](#components-shared-unused-unusedconfigs-ts), [`WorkingHoursCards.tsx`](#components-shared-working-hours-workinghourscards-tsx), [`WorkingHoursCharts.tsx`](#components-shared-working-hours-workinghourscharts-tsx), [`WorkingHoursDetailModal.tsx`](#components-shared-working-hours-workinghoursdetailmodal-tsx), [`WorkingHoursTable.tsx`](#components-shared-working-hours-workinghourstable-tsx), [`WorkingHoursView.tsx`](#components-shared-working-hours-workinghoursview-tsx), [`workingHoursConfigs.ts`](#components-shared-working-hours-workinghoursconfigs-ts)

---

<a id="components-shared-working-hours-workinghoursconfigs-ts"></a>
## `components/shared/working-hours/workingHoursConfigs.ts`

**Módulo**

Configuración de cada vista de "Horario hábil vs no hábil" (rutas /api/{cloud}/working-hours/{resource}/*).
Lo común (tarjetas, gráficos, tabla, detalle) está en los componentes de `components/shared/working-hours`.

Exporta:

- constante `AWS_EC2_WH` = `{ cloud: 'aws', resource: 'ec2', serviceName: 'instancias EC2', resourceTypeLab…` — AWS
- constante `AWS_ASG_WH` = `{ cloud: 'aws', resource: 'asg', serviceName: 'instancias de Auto Scaling Group…`
- constante `AWS_EKS_WH` = `{ cloud: 'aws', resource: 'eks', serviceName: 'nodos EKS', resourceTypeLabel: '…`
- función `awsRdsWorkingHours` `(dbType?: string): WorkingHoursViewConfig` — `dbType` es el de la vista: 'rds-mysql', 'rds-pg', 'rds-sqlserver', 'rds-oracle' o 'rds-mariadb'.
- constante `AZURE_VM_WH` = `{ cloud: 'azure', resource: 'vm', serviceName: 'Máquinas Virtuales Azure', reso…` — Azure
- constante `AZURE_DB_WH` = `{ cloud: 'azure', resource: 'db', serviceName: 'Bases de Datos Azure', resource…`
- constante `AZURE_NODES_WH` = `{ cloud: 'azure', resource: 'nodes', serviceName: 'Nodos AKS Azure', resourceTy…`
- constante `GCP_COMPUTE_ENGINE_WH` = `{ cloud: 'gcp', resource: 'compute-engine', serviceName: 'instancias Compute En…` — GCP
- constante `GCP_INSTANCE_GROUPS_WH` = `{ cloud: 'gcp', resource: 'instance-groups', serviceName: 'instancias de Instan…`
- constante `GCP_GKE_WH` = `{ cloud: 'gcp', resource: 'gke', serviceName: 'nodos de Clusters GKE', resource…`
- función `gcpCloudSqlWorkingHours` `(dbEngine?: string): WorkingHoursViewConfig` — `dbEngine` es el de la vista: 'mysql', 'postgres' o 'sqlserver'.
- constante `GCP_FILESTORE_WH` = `{ cloud: 'gcp', resource: 'filestore', serviceName: 'instancias Filestore', res…`

Internos:

- función `awsLink` `(page: string)` — Enlaces a las vistas de recursos
- función `gcpComputeLink` `(r: WorkingHoursResource, { param }: ResourceLinkContext): ResourceLink` — Compute Engine / Instance Groups / GKE se abren en la vista de Compute Engine con el id de la instancia.
- función `gcpCloudSqlLink` `(engine: string)`
- función `azureScope` `(resourceId: string)` — "/subscriptions/{sub}/resourceGroups/{rg}/providers/..." -> { subscription, resourceGroup }.
- función `azureLink` `(page: (r: WorkingHoursResource) => string)`
- función `azureDbPage` `(r: WorkingHoursResource)`
- constante `AZURE_WH_METRICS` — Métricas de Azure: los pipelines de horario hábil promedian el valor de cada métrica de Azure Monitor (`metric_value`), igual que AWS y GCP. Sólo "Available Memory" necesita su propia definición: viene en bytes (la definición común la trata como GB). El resto (CPU y porcentajes en %, IOPS, GB usados) usa la común.

- Usa: [`consumption.ts`](../lib.md#lib-consumption-ts), [`workingHours.ts`](../tipos.md#interfaces-workinghours-ts), [`types.ts`](#components-shared-working-hours-types-ts)
- Usado por: [`ConsumoEC2AsgHorarioComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil-consumoec2asghorariocomponent-tsx), [`ConsumoEC2HorarioComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-horario-habil-vs-no-habil-consumoec2horariocomponent-tsx), [`ConsumoEC2NodosEKSHorarioComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-nodos-eks-horario-habil-vs-no-habil-consumoec2nodosekshorariocomponent-tsx), [`ConsumoRdsHorarioComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-rds-horario-habil-vs-no-habil-consumordshorariocomponent-tsx), [`AzureDbWorkingNonWorkingHoursComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-consumo-horario-habil-no-habil-data-bases-azuredbworkingnonworkinghourscomponent-tsx), [`AzureNodosWorkingNonWorkingHoursComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-consumo-horario-habil-no-habil-nodes-azurenodosworkingnonworkinghourscomponent-tsx), [`AzureVmWorkingNonWorkingHoursComponent.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-consumo-horario-habil-no-habil-virtual-machines-azurevmworkingnonworkinghourscomponent-tsx), [`CloudSqlWorkingNonWorkingHoursComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-cloud-sql-cloudsqlworkingnonworkinghourscomponent-tsx), [`GkeWorkingNonWorkingHoursComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-cluster-gke-gkeworkingnonworkinghourscomponent-tsx), [`CeWorkingNonWorkingHoursComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-compute-engine-ceworkingnonworkinghourscomponent-tsx), [`FsWorkingNonWorkingHoursComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-filestore-fsworkingnonworkinghourscomponent-tsx), [`IgWorkingNonWorkingHoursComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-instance-group-igworkingnonworkinghourscomponent-tsx)

