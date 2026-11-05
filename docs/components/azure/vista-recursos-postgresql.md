# Componentes `components/azure/vista-recursos-postgresql/`

[← Índice](../../README.md)

Vista de recurso PostgreSQL flexible: información, métricas y facturación.

Archivos:

- [`components/azure/vista-recursos-postgresql/AzurePostgresInfoComponent.tsx`](#components-azure-vista-recursos-postgresql-azurepostgresinfocomponent-tsx)
- [`components/azure/vista-recursos-postgresql/AzurePostgresResourceComponent.tsx`](#components-azure-vista-recursos-postgresql-azurepostgresresourcecomponent-tsx)
- [`components/azure/vista-recursos-postgresql/MainViewRecursosDbsComponent.tsx`](#components-azure-vista-recursos-postgresql-mainviewrecursosdbscomponent-tsx)
- [`components/azure/vista-recursos-postgresql/table/AzurePostgresBillingTableComponent.tsx`](#components-azure-vista-recursos-postgresql-table-azurepostgresbillingtablecomponent-tsx)

<a id="components-azure-vista-recursos-postgresql-azurepostgresinfocomponent-tsx"></a>
## `components/azure/vista-recursos-postgresql/AzurePostgresInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `AzurePostgresData`
- componente `AzurePostgresInfoComponent` `({ data }: Props)`

Interfaz `AzurePostgresData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instance_name` | `string` | no | — |
| `instance_id` | `string` | no | — |
| `history_data` | `Array<{ location: string; version: string; minor_version?: string; st…` | no | — |

Interfaz `Props`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AzurePostgresData[] \| null` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx)
- Usado por: [`AzurePostgresResourceComponent.tsx`](#components-azure-vista-recursos-postgresql-azurepostgresresourcecomponent-tsx)

---

<a id="components-azure-vista-recursos-postgresql-azurepostgresresourcecomponent-tsx"></a>
## `components/azure/vista-recursos-postgresql/AzurePostgresResourceComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AzurePostgresResourceComponent` `({ startDate, endDate, selectedInstanceV2 }: AzurePostgresResourceComponentProps)`

Interfaz `AzurePostgresResourceComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `selectedInstanceV2` | `string` | no | — |
| `subscription` | `string` | sí | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`

- API: `/api/azure/bridge/azure/recursos/db/azure-postgres-billing`, `/api/azure/bridge/azure/recursos/db/azure-postgres-info`, `/api/azure/bridge/azure/recursos/db/azure-postgres-metrics`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](../general_gcp.md#components-general-gcp-loadercomponent-tsx), [`ComputeEngineMetricsCardsComponent.tsx`](../gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-info-computeenginemetricscardscomponent-tsx), [`ComputeEngineChartComponent.tsx`](../gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-grafico-computeenginechartcomponent-tsx), [`AzurePostgresBillingTableComponent.tsx`](#components-azure-vista-recursos-postgresql-table-azurepostgresbillingtablecomponent-tsx), [`AzurePostgresInfoComponent.tsx`](#components-azure-vista-recursos-postgresql-azurepostgresinfocomponent-tsx), [`cEInterfaces.ts`](../../tipos.md#interfaces-vista-compute-engine-ceinterfaces-ts)
- Usado por: [`MainViewRecursosDbsComponent.tsx`](#components-azure-vista-recursos-postgresql-mainviewrecursosdbscomponent-tsx)

---

<a id="components-azure-vista-recursos-postgresql-mainviewrecursosdbscomponent-tsx"></a>
## `components/azure/vista-recursos-postgresql/MainViewRecursosDbsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewRecursosPostgresComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`AzurePostgresResourceComponent.tsx`](#components-azure-vista-recursos-postgresql-azurepostgresresourcecomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-recursos-db-postgresql-page-tsx)

---

<a id="components-azure-vista-recursos-postgresql-table-azurepostgresbillingtablecomponent-tsx"></a>
## `components/azure/vista-recursos-postgresql/table/AzurePostgresBillingTableComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `PostgresBillingRecord`
- componente `AzurePostgresBillingTableComponent` `({ data }: Props)`

Interfaz `PostgresBillingRecord` (exportada):

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
| `data` | `PostgresBillingRecord[]` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx)
- Usado por: [`AzurePostgresResourceComponent.tsx`](#components-azure-vista-recursos-postgresql-azurepostgresresourcecomponent-tsx)

