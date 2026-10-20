# Componentes `components/azure/vista-recursos-vm/`

[← Índice](../../README.md)

Vista de recurso VM: información, historial, métricas y facturación.

Archivos:

- [`components/azure/vista-recursos-vm/AzureVmHistoricInfoComponent.tsx`](#components-azure-vista-recursos-vm-azurevmhistoricinfocomponent-tsx)
- [`components/azure/vista-recursos-vm/AzureVmInfoComponent.tsx`](#components-azure-vista-recursos-vm-azurevminfocomponent-tsx)
- [`components/azure/vista-recursos-vm/AzureVmResourceComponent.tsx`](#components-azure-vista-recursos-vm-azurevmresourcecomponent-tsx)
- [`components/azure/vista-recursos-vm/MainViewRecursosVmComponent.tsx`](#components-azure-vista-recursos-vm-mainviewrecursosvmcomponent-tsx)
- [`components/azure/vista-recursos-vm/graficos/VmBillingPropertiesComponent.tsx`](#components-azure-vista-recursos-vm-graficos-vmbillingpropertiescomponent-tsx)
- [`components/azure/vista-recursos-vm/graficos/VmMetricChartsComponent.tsx`](#components-azure-vista-recursos-vm-graficos-vmmetricchartscomponent-tsx)
- [`components/azure/vista-recursos-vm/table/AzureVmBillingColumns.tsx`](#components-azure-vista-recursos-vm-table-azurevmbillingcolumns-tsx)
- [`components/azure/vista-recursos-vm/table/AzureVmBillingTableComponent.tsx`](#components-azure-vista-recursos-vm-table-azurevmbillingtablecomponent-tsx)

<a id="components-azure-vista-recursos-vm-azurevmhistoricinfocomponent-tsx"></a>
## `components/azure/vista-recursos-vm/AzureVmHistoricInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `VmStatus`
- interfaz `VmDisk`
- interfaz `VmNic`
- interfaz `AzureInstance`
- componente `AzureVmHistoricInfoComponent` `({ instances }: { instances: AzureInstance[] })`

Interfaz `VmStatus` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `code` | `string` | sí | — |
| `display_status` | `string` | sí | — |

Interfaz `VmDisk` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `name` | `string` | sí | — |
| `managed_disk` | `{ storage_account_type?: string }` | sí | — |
| `disk_size_gb` | `number` | sí | — |
| `os_type` | `string` | sí | — |

Interfaz `VmNic` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string` | sí | — |

Interfaz `AzureInstance` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `hardware_profile` | `{ vm_size?: string }` | sí | — |
| `instance_view` | `{ statuses?: VmStatus[]; os_name?: string; os_version?: string; }` | sí | — |
| `storage_profile` | `{ os_disk?: VmDisk; data_disks?: VmDisk[]; }` | sí | — |
| `network_profile` | `{ network_interfaces?: VmNic[]; }` | sí | — |
| `_cq_sync_time` | `{ $date?: string } \| string` | sí | — |
| `location` | `string` | sí | — |
| `tags` | `Record<string, unknown>` | sí | — |
| `time_created` | `string \| Date` | sí | — |
| `[key: string]: unknown;` | `unknown` | no | — |

- Usa: [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx)
- Usado por: [`AzureVmInfoComponent.tsx`](#components-azure-vista-recursos-vm-azurevminfocomponent-tsx)

---

<a id="components-azure-vista-recursos-vm-azurevminfocomponent-tsx"></a>
## `components/azure/vista-recursos-vm/AzureVmInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `AzureGroupData`
- componente `AzureVmInfoComponent` `({ data }: { data: AzureGroupData[] | null })`

Interfaz `AzureGroupData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instance_name` | `string` | no | — |
| `history_data` | `AzureInstance[]` | sí | — |
| `[key: string]: unknown;` | `unknown` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`AzureVmHistoricInfoComponent.tsx`](#components-azure-vista-recursos-vm-azurevmhistoricinfocomponent-tsx), [`getUptimeInstance.ts`](../../lib.md#lib-getuptimeinstance-ts)
- Usado por: [`AzureVmResourceComponent.tsx`](#components-azure-vista-recursos-vm-azurevmresourcecomponent-tsx)

---

<a id="components-azure-vista-recursos-vm-azurevmresourcecomponent-tsx"></a>
## `components/azure/vista-recursos-vm/AzureVmResourceComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AzureVmResourceComponent` `({ startDate, endDate, selectedInstanceV2 }: AzureVmResourceComponentProps)`

Interfaz `AzureVmResourceComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `selectedInstanceV2` | `string` | no | — |
| `subscription` | `string` | sí | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`

- API: `/api/azure/bridge/azure/recursos/vm/azure-vm-instances`, `/api/azure/bridge/azure/recursos/vm/azure-vm-instances_billing`, `/api/azure/bridge/azure/recursos/vm/azure-vm-instances_metrics`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](../general_gcp.md#components-general-gcp-loadercomponent-tsx), [`ComputeEngineMetricsCardsComponent.tsx`](../gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-info-computeenginemetricscardscomponent-tsx), [`ComputeEngineChartComponent.tsx`](../gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-grafico-computeenginechartcomponent-tsx), [`AzureVmBillingTableComponent.tsx`](#components-azure-vista-recursos-vm-table-azurevmbillingtablecomponent-tsx), [`AzureVmInfoComponent.tsx`](#components-azure-vista-recursos-vm-azurevminfocomponent-tsx), [`cEInterfaces.ts`](../../tipos.md#interfaces-vista-compute-engine-ceinterfaces-ts)
- Usado por: [`MainViewRecursosVmComponent.tsx`](#components-azure-vista-recursos-vm-mainviewrecursosvmcomponent-tsx)

---

<a id="components-azure-vista-recursos-vm-mainviewrecursosvmcomponent-tsx"></a>
## `components/azure/vista-recursos-vm/MainViewRecursosVmComponent.tsx`

**Componente**

Exporta:

- componente `MainViewRecursosVmComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`AzureVmResourceComponent.tsx`](#components-azure-vista-recursos-vm-azurevmresourcecomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-recursos-vm-page-tsx)

---

<a id="components-azure-vista-recursos-vm-graficos-vmbillingpropertiescomponent-tsx"></a>
## `components/azure/vista-recursos-vm/graficos/VmBillingPropertiesComponent.tsx`

**Módulo (cliente)**

Exporta:

- export default `VmBillingPropertiesComponent`

Interfaz `BillingProperty`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `charge_type` | `string` | no | — |
| `provider` | `string` | no | — |
| `consumed_service` | `string` | no | — |
| `product_identifier` | `string` | no | — |
| `cost_center` | `string` | no | — |
| `resource_location_normalized` | `string` | no | — |
| `resource_name` | `string` | no | — |

Interfaz `BillingPropertiesData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `propiedades_facturacion` | `BillingProperty[]` | no | — |

Interfaz `VmBillingPropertiesProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `BillingPropertiesData \| null` | no | — |

Interfaz `VmBillingPropertiesComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `instanceName` | `string` | no | — |

Internos:

- componente `LoaderComponent` `()`
- componente `VmBillingProperties` `({ data }: VmBillingPropertiesProps)`
- componente `VmBillingPropertiesComponent` `({ startDate, endDate, instanceName }: VmBillingPropertiesComponentProps)`

- API: `/api/azure/bridge/azure/recursos/vm/facturacion/propiedades`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx)

Notas de implementación:

- _VmBillingProperties_: JSX — Tipo de Cargo
- _VmBillingProperties_: JSX — Proveedor
- _VmBillingProperties_: JSX — Servicio Consumido
- _VmBillingProperties_: JSX — Centro de Costos
- _VmBillingProperties_: JSX — Identificador de Producto - Ancho completo o 2 columnas
- _VmBillingProperties_: JSX — Ubicación del Recurso
- _VmBillingProperties_: JSX — Nombre del Recurso

---

<a id="components-azure-vista-recursos-vm-graficos-vmmetricchartscomponent-tsx"></a>
## `components/azure/vista-recursos-vm/graficos/VmMetricChartsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `VmCpuUsageComponent` `({ startDate, endDate, vmName }: { startDate: Date; endDate: Date; vmName: string })`
- componente `VmMemoryUsageComponent` `({ startDate, endDate, vmName }: { startDate: Date; endDate: Date; vmName: string })`
- componente `VmDiskUsageComponent` `({ startDate, endDate, vmName }: { startDate: Date; endDate: Date; vmName: string })`

Interfaz `VmMetricsData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_name` | `string` | no | — |
| `vm_name` | `string` | no | — |
| `total` | `number` | no | — |
| `used` | `number` | no | — |
| `unused` | `number` | no | — |
| `timestamp` | `{ $date: string }` | no | — |

Interfaz `VmMetricsChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `VmMetricsData[] \| null` | no | — |
| `title` | `string` | no | — |
| `metricUnit` | `string` | no | — |

Interfaz `VmMetricProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `vmName` | `string` | no | — |
| `metricName` | `string` | no | — |
| `title` | `string` | no | — |
| `unit` | `string` | no | — |

Internos:

- componente `LoaderComponent` `()`
- constante `sliderConfig`
- función `createTooltipFormatter` `(unit: string)`
- componente `VmMetricsChart` `({ data, title, metricUnit }: VmMetricsChartProps)`
- función `createSeries` `(name: string, data: [string, number][], color: string, areaColor?: string)`
- componente `VmMetricComponent` `({ startDate, endDate, vmName, metricName, title, unit }: VmMetricProps)`

- API: `/api/azure/bridge/azure/recursos/vm/consumo-metricas`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx)

Notas de implementación:

- _VmMetricsChart_: Agrupar por timestamp y sumar los valores
- _VmMetricsChart_: Convertir a arrays y ordenar

---

<a id="components-azure-vista-recursos-vm-table-azurevmbillingcolumns-tsx"></a>
## `components/azure/vista-recursos-vm/table/AzureVmBillingColumns.tsx`

**Módulo (cliente)**

Exporta:

- función `getAzureVmBillingColumns` `(): DynamicColumn<ComputeEngineBilling>[]`

Internos:

- función `formatCurrencyUSD` `(value: number | undefined)`

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`cEInterfaces.ts`](../../tipos.md#interfaces-vista-compute-engine-ceinterfaces-ts)
- Usado por: [`AzureVmBillingTableComponent.tsx`](#components-azure-vista-recursos-vm-table-azurevmbillingtablecomponent-tsx)

---

<a id="components-azure-vista-recursos-vm-table-azurevmbillingtablecomponent-tsx"></a>
## `components/azure/vista-recursos-vm/table/AzureVmBillingTableComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AzureVmBillingTableComponent` `({ data }: AzureVmBillingTableComponentProps)`

Interfaz `AzureVmBillingTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ComputeEngineBilling[]` | no | — |

Internos:

- función `formatUSD` `(value: number)`

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`cEInterfaces.ts`](../../tipos.md#interfaces-vista-compute-engine-ceinterfaces-ts), [`AzureVmBillingColumns.tsx`](#components-azure-vista-recursos-vm-table-azurevmbillingcolumns-tsx)
- Usado por: [`AzureVmResourceComponent.tsx`](#components-azure-vista-recursos-vm-azurevmresourcecomponent-tsx)

