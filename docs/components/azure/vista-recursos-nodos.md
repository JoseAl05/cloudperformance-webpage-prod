# Componentes `components/azure/vista-recursos-nodos/`

[← Índice](../../README.md)

Vista de recurso de nodo AKS: información, historial y facturación.

Archivos:

- [`components/azure/vista-recursos-nodos/AzureNodeHistoricInfoComponent.tsx`](#components-azure-vista-recursos-nodos-azurenodehistoricinfocomponent-tsx)
- [`components/azure/vista-recursos-nodos/AzureNodeInfoComponent.tsx`](#components-azure-vista-recursos-nodos-azurenodeinfocomponent-tsx)
- [`components/azure/vista-recursos-nodos/AzureNodeResourceComponent.tsx`](#components-azure-vista-recursos-nodos-azurenoderesourcecomponent-tsx)
- [`components/azure/vista-recursos-nodos/MainViewRecursosNodeComponent.tsx`](#components-azure-vista-recursos-nodos-mainviewrecursosnodecomponent-tsx)
- [`components/azure/vista-recursos-nodos/table/AzureNodeBillingTableComponent.tsx`](#components-azure-vista-recursos-nodos-table-azurenodebillingtablecomponent-tsx)
- [`components/azure/vista-recursos-nodos/table/AzureVmBillingColumns.tsx`](#components-azure-vista-recursos-nodos-table-azurevmbillingcolumns-tsx)

<a id="components-azure-vista-recursos-nodos-azurenodehistoricinfocomponent-tsx"></a>
## `components/azure/vista-recursos-nodos/AzureNodeHistoricInfoComponent.tsx`

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
- Usado por: [`AzureNodeInfoComponent.tsx`](#components-azure-vista-recursos-nodos-azurenodeinfocomponent-tsx)

---

<a id="components-azure-vista-recursos-nodos-azurenodeinfocomponent-tsx"></a>
## `components/azure/vista-recursos-nodos/AzureNodeInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `AzureNodeData`
- componente `AzureNodeInfoComponent` `({ data }: { data: AzureNodeData[] | null })`

Interfaz `AzureNodeData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instance_name` | `string` | no | — |
| `history_data` | `AzureInstance[]` | sí | — |
| `[key: string]: unknown;` | `unknown` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`AzureNodeHistoricInfoComponent.tsx`](#components-azure-vista-recursos-nodos-azurenodehistoricinfocomponent-tsx), [`getUptimeInstance.ts`](../../lib.md#lib-getuptimeinstance-ts)
- Usado por: [`AzureNodeResourceComponent.tsx`](#components-azure-vista-recursos-nodos-azurenoderesourcecomponent-tsx)

---

<a id="components-azure-vista-recursos-nodos-azurenoderesourcecomponent-tsx"></a>
## `components/azure/vista-recursos-nodos/AzureNodeResourceComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AzureNodeResourceComponent` `({ startDate, endDate, selectedInstanceV2 }: AzureNodeResourceComponentProps)`

Interfaz `AzureNodeResourceComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `selectedInstanceV2` | `string` | no | — |
| `subscription` | `string` | sí | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`

- API: `/api/azure/bridge/azure/recursos/nodos/azure-node-billing`, `/api/azure/bridge/azure/recursos/nodos/azure-node-info`, `/api/azure/bridge/azure/recursos/nodos/azure-node-metrics`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](../general_gcp.md#components-general-gcp-loadercomponent-tsx), [`ComputeEngineMetricsCardsComponent.tsx`](../gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-info-computeenginemetricscardscomponent-tsx), [`ComputeEngineChartComponent.tsx`](../gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-grafico-computeenginechartcomponent-tsx), [`AzureNodeBillingTableComponent.tsx`](#components-azure-vista-recursos-nodos-table-azurenodebillingtablecomponent-tsx), [`AzureNodeInfoComponent.tsx`](#components-azure-vista-recursos-nodos-azurenodeinfocomponent-tsx), [`cEInterfaces.ts`](../../tipos.md#interfaces-vista-compute-engine-ceinterfaces-ts)
- Usado por: [`MainViewRecursosNodeComponent.tsx`](#components-azure-vista-recursos-nodos-mainviewrecursosnodecomponent-tsx)

---

<a id="components-azure-vista-recursos-nodos-mainviewrecursosnodecomponent-tsx"></a>
## `components/azure/vista-recursos-nodos/MainViewRecursosNodeComponent.tsx`

**Componente**

Exporta:

- componente `MainViewRecursosNodeComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`AzureNodeResourceComponent.tsx`](#components-azure-vista-recursos-nodos-azurenoderesourcecomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-recursos-nodos-page-tsx)

---

<a id="components-azure-vista-recursos-nodos-table-azurenodebillingtablecomponent-tsx"></a>
## `components/azure/vista-recursos-nodos/table/AzureNodeBillingTableComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AzureNodeBillingTableComponent` `({ data }: AzureNodeBillingTableComponentProps)`

Interfaz `AzureNodeBillingTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ComputeEngineBilling[]` | no | — |

Internos:

- función `formatUSD` `(value: number)`

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`cEInterfaces.ts`](../../tipos.md#interfaces-vista-compute-engine-ceinterfaces-ts), [`AzureVmBillingColumns.tsx`](#components-azure-vista-recursos-nodos-table-azurevmbillingcolumns-tsx)
- Usado por: [`AzureNodeResourceComponent.tsx`](#components-azure-vista-recursos-nodos-azurenoderesourcecomponent-tsx)

---

<a id="components-azure-vista-recursos-nodos-table-azurevmbillingcolumns-tsx"></a>
## `components/azure/vista-recursos-nodos/table/AzureVmBillingColumns.tsx`

**Módulo (cliente)**

Exporta:

- función `getAzureVmBillingColumns` `(): DynamicColumn<ComputeEngineBilling>[]`

Internos:

- función `formatCurrencyUSD` `(value: number | undefined)`

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`cEInterfaces.ts`](../../tipos.md#interfaces-vista-compute-engine-ceinterfaces-ts)
- Usado por: [`AzureNodeBillingTableComponent.tsx`](#components-azure-vista-recursos-nodos-table-azurenodebillingtablecomponent-tsx)

