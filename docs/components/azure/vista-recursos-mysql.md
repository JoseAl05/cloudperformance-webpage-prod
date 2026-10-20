# Componentes `components/azure/vista-recursos-mysql/`

[← Índice](../../README.md)

Vista de recurso MySQL flexible: información, métricas y facturación.

Archivos:

- [`components/azure/vista-recursos-mysql/AzureMysqlInfoComponent.tsx`](#components-azure-vista-recursos-mysql-azuremysqlinfocomponent-tsx)
- [`components/azure/vista-recursos-mysql/AzureMysqlResourceComponent.tsx`](#components-azure-vista-recursos-mysql-azuremysqlresourcecomponent-tsx)
- [`components/azure/vista-recursos-mysql/MainViewRecursosDbsComponent.tsx`](#components-azure-vista-recursos-mysql-mainviewrecursosdbscomponent-tsx)
- [`components/azure/vista-recursos-mysql/table/AzureMysqlBillingTableComponent.tsx`](#components-azure-vista-recursos-mysql-table-azuremysqlbillingtablecomponent-tsx)

<a id="components-azure-vista-recursos-mysql-azuremysqlinfocomponent-tsx"></a>
## `components/azure/vista-recursos-mysql/AzureMysqlInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `AzureMysqlData`
- componente `AzureMysqlInfoComponent` `({ data }: Props)`

Interfaz `AzureMysqlData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instance_name` | `string` | no | — |
| `instance_id` | `string` | no | — |
| `history_data` | `Array<{ location: string; version: string; state: string; administrat…` | no | — |

Interfaz `Props`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AzureMysqlData[] \| null` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx)
- Usado por: [`AzureMysqlResourceComponent.tsx`](#components-azure-vista-recursos-mysql-azuremysqlresourcecomponent-tsx)

---

<a id="components-azure-vista-recursos-mysql-azuremysqlresourcecomponent-tsx"></a>
## `components/azure/vista-recursos-mysql/AzureMysqlResourceComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AzureMysqlResourceComponent` `({ startDate, endDate, selectedInstanceV2 }: AzureMysqlResourceComponentProps)`

Interfaz `AzureMysqlResourceComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `selectedInstanceV2` | `string` | no | — |
| `subscription` | `string` | sí | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`

- API: `/api/azure/bridge/azure/recursos/db/azure-mysql-billing`, `/api/azure/bridge/azure/recursos/db/azure-mysql-info`, `/api/azure/bridge/azure/recursos/db/azure-mysql-metrics`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](../general_gcp.md#components-general-gcp-loadercomponent-tsx), [`ComputeEngineMetricsCardsComponent.tsx`](../gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-info-computeenginemetricscardscomponent-tsx), [`ComputeEngineChartComponent.tsx`](../gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-grafico-computeenginechartcomponent-tsx), [`AzureMysqlBillingTableComponent.tsx`](#components-azure-vista-recursos-mysql-table-azuremysqlbillingtablecomponent-tsx), [`AzureMysqlInfoComponent.tsx`](#components-azure-vista-recursos-mysql-azuremysqlinfocomponent-tsx), [`cEInterfaces.ts`](../../tipos.md#interfaces-vista-compute-engine-ceinterfaces-ts)
- Usado por: [`MainViewRecursosDbsComponent.tsx`](#components-azure-vista-recursos-mysql-mainviewrecursosdbscomponent-tsx)

Notas de implementación:

- Rutas apuntando al nuevo backend de MySQL

---

<a id="components-azure-vista-recursos-mysql-mainviewrecursosdbscomponent-tsx"></a>
## `components/azure/vista-recursos-mysql/MainViewRecursosDbsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewRecursosMysqlComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`AzureMysqlResourceComponent.tsx`](#components-azure-vista-recursos-mysql-azuremysqlresourcecomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-recursos-db-mysql-page-tsx)

---

<a id="components-azure-vista-recursos-mysql-table-azuremysqlbillingtablecomponent-tsx"></a>
## `components/azure/vista-recursos-mysql/table/AzureMysqlBillingTableComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `MysqlBillingRecord`
- componente `AzureMysqlBillingTableComponent` `({ data }: Props)`

Interfaz `MysqlBillingRecord` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `usage_start_time` | `string` | no | — |
| `sku` | `string` | no | — |
| `cost_gross_usd` | `number` | no | — |
| `cost_net_usd` | `number` | no | — |
| `discount_usd` | `number` | no | — |

Interfaz `Props`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `MysqlBillingRecord[]` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx)
- Usado por: [`AzureMysqlResourceComponent.tsx`](#components-azure-vista-recursos-mysql-azuremysqlresourcecomponent-tsx)

