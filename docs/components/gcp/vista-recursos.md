# Componentes `components/gcp/vista-recursos/`

[← Índice](../../README.md)

Vistas de recurso GCP (Cloud SQL, GKE, Compute Engine, instance groups, Filestore): información, historial, métricas y facturación.

Archivos:

- [`components/gcp/vista-recursos/cloudsql/CloudSqlComponent.tsx`](#components-gcp-vista-recursos-cloudsql-cloudsqlcomponent-tsx)
- [`components/gcp/vista-recursos/cloudsql/MainViewCloudSqlComponent.tsx`](#components-gcp-vista-recursos-cloudsql-mainviewcloudsqlcomponent-tsx)
- [`components/gcp/vista-recursos/cloudsql/grafico/CloudSqlChartComponent.tsx`](#components-gcp-vista-recursos-cloudsql-grafico-cloudsqlchartcomponent-tsx)
- [`components/gcp/vista-recursos/cloudsql/info/CloudSqlHistoricInfoComponent.tsx`](#components-gcp-vista-recursos-cloudsql-info-cloudsqlhistoricinfocomponent-tsx)
- [`components/gcp/vista-recursos/cloudsql/info/CloudSqlInfoComponent.tsx`](#components-gcp-vista-recursos-cloudsql-info-cloudsqlinfocomponent-tsx)
- [`components/gcp/vista-recursos/cloudsql/info/CloudSqlMetricsCardComponent.tsx`](#components-gcp-vista-recursos-cloudsql-info-cloudsqlmetricscardcomponent-tsx)
- [`components/gcp/vista-recursos/cloudsql/table/CloudSqlBillingColumns.tsx`](#components-gcp-vista-recursos-cloudsql-table-cloudsqlbillingcolumns-tsx)
- [`components/gcp/vista-recursos/cloudsql/table/CloudSqlBillingTableComponent.tsx`](#components-gcp-vista-recursos-cloudsql-table-cloudsqlbillingtablecomponent-tsx)
- [`components/gcp/vista-recursos/clusters-gke/GkeComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-gkecomponent-tsx)
- [`components/gcp/vista-recursos/clusters-gke/MainViewGkeComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-mainviewgkecomponent-tsx)
- [`components/gcp/vista-recursos/clusters-gke/grafico/GkeChartComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-grafico-gkechartcomponent-tsx)
- [`components/gcp/vista-recursos/clusters-gke/info/GkeHistoricInfoComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-info-gkehistoricinfocomponent-tsx)
- [`components/gcp/vista-recursos/clusters-gke/info/GkeInfoComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-info-gkeinfocomponent-tsx)
- [`components/gcp/vista-recursos/clusters-gke/info/GkeMetricsCardComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-info-gkemetricscardcomponent-tsx)
- [`components/gcp/vista-recursos/clusters-gke/table/GkeBillingColumns.tsx`](#components-gcp-vista-recursos-clusters-gke-table-gkebillingcolumns-tsx)
- [`components/gcp/vista-recursos/clusters-gke/table/GkeBillingComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-table-gkebillingcomponent-tsx)
- [`components/gcp/vista-recursos/clusters-gke/table/GkeBillingTableComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-table-gkebillingtablecomponent-tsx)
- [`components/gcp/vista-recursos/clusters-gke/table/GkeNodesColumns.tsx`](#components-gcp-vista-recursos-clusters-gke-table-gkenodescolumns-tsx)
- [`components/gcp/vista-recursos/clusters-gke/table/GkeNodesTableComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-table-gkenodestablecomponent-tsx)
- [`components/gcp/vista-recursos/compute-engine/ComputeEngineComponent.tsx`](#components-gcp-vista-recursos-compute-engine-computeenginecomponent-tsx)
- [`components/gcp/vista-recursos/compute-engine/MainViewComputeEngineComponent.tsx`](#components-gcp-vista-recursos-compute-engine-mainviewcomputeenginecomponent-tsx)
- [`components/gcp/vista-recursos/compute-engine/grafico/ComputeEngineChartComponent.tsx`](#components-gcp-vista-recursos-compute-engine-grafico-computeenginechartcomponent-tsx)
- [`components/gcp/vista-recursos/compute-engine/info/ComputeEngineHistoricInfoComponent.tsx`](#components-gcp-vista-recursos-compute-engine-info-computeenginehistoricinfocomponent-tsx)
- [`components/gcp/vista-recursos/compute-engine/info/ComputeEngineInfoComponent.tsx`](#components-gcp-vista-recursos-compute-engine-info-computeengineinfocomponent-tsx)
- [`components/gcp/vista-recursos/compute-engine/info/ComputeEngineMetricsCardsComponent.tsx`](#components-gcp-vista-recursos-compute-engine-info-computeenginemetricscardscomponent-tsx)
- [`components/gcp/vista-recursos/compute-engine/table/ComputeEngineBillingColumns.tsx`](#components-gcp-vista-recursos-compute-engine-table-computeenginebillingcolumns-tsx)
- [`components/gcp/vista-recursos/compute-engine/table/ComputeEngineBillingTableComponent.tsx`](#components-gcp-vista-recursos-compute-engine-table-computeenginebillingtablecomponent-tsx)
- [`components/gcp/vista-recursos/instance-groups/InstanceGroupsComponent.tsx`](#components-gcp-vista-recursos-instance-groups-instancegroupscomponent-tsx)
- [`components/gcp/vista-recursos/instance-groups/MainViewInstanceGroupsComponent.tsx`](#components-gcp-vista-recursos-instance-groups-mainviewinstancegroupscomponent-tsx)
- [`components/gcp/vista-recursos/instance-groups/grafico/InstanceGroupChartComponent.tsx`](#components-gcp-vista-recursos-instance-groups-grafico-instancegroupchartcomponent-tsx)
- [`components/gcp/vista-recursos/instance-groups/info/InstanceGroupsHistoricInfoComponent.tsx`](#components-gcp-vista-recursos-instance-groups-info-instancegroupshistoricinfocomponent-tsx)
- [`components/gcp/vista-recursos/instance-groups/info/InstanceGroupsInfoComponent.tsx`](#components-gcp-vista-recursos-instance-groups-info-instancegroupsinfocomponent-tsx)
- [`components/gcp/vista-recursos/instance-groups/info/InstanceGroupsMetricsCardsComponent.tsx`](#components-gcp-vista-recursos-instance-groups-info-instancegroupsmetricscardscomponent-tsx)
- [`components/gcp/vista-recursos/instance-groups/table/InstanceGroupBillingColumns.tsx`](#components-gcp-vista-recursos-instance-groups-table-instancegroupbillingcolumns-tsx)
- [`components/gcp/vista-recursos/instance-groups/table/InstanceGroupsBillingComponent.tsx`](#components-gcp-vista-recursos-instance-groups-table-instancegroupsbillingcomponent-tsx)
- [`components/gcp/vista-recursos/instance-groups/table/InstanceGroupsBillingTableComponent.tsx`](#components-gcp-vista-recursos-instance-groups-table-instancegroupsbillingtablecomponent-tsx)
- [`components/gcp/vista-recursos/instance-groups/table/InstanceGroupsInstancesColumns.tsx`](#components-gcp-vista-recursos-instance-groups-table-instancegroupsinstancescolumns-tsx)
- [`components/gcp/vista-recursos/instance-groups/table/InstanceGroupsInstancesTableComponent.tsx`](#components-gcp-vista-recursos-instance-groups-table-instancegroupsinstancestablecomponent-tsx)
- [`components/gcp/vista-recursos/sin-uso/clusters-gke/MainViewUnusedGkeComponent.tsx`](#components-gcp-vista-recursos-sin-uso-clusters-gke-mainviewunusedgkecomponent-tsx)
- [`components/gcp/vista-recursos/sin-uso/clusters-gke/UnusedGkeComponent.tsx`](#components-gcp-vista-recursos-sin-uso-clusters-gke-unusedgkecomponent-tsx)
- [`components/gcp/vista-recursos/sin-uso/compute-engine/MainViewUnusedCeComponent.tsx`](#components-gcp-vista-recursos-sin-uso-compute-engine-mainviewunusedcecomponent-tsx)
- [`components/gcp/vista-recursos/sin-uso/compute-engine/UnusedCeComponent.tsx`](#components-gcp-vista-recursos-sin-uso-compute-engine-unusedcecomponent-tsx)
- [`components/gcp/vista-recursos/sin-uso/compute-engine/table/UnusedCeColumns.tsx`](#components-gcp-vista-recursos-sin-uso-compute-engine-table-unusedcecolumns-tsx)
- [`components/gcp/vista-recursos/sin-uso/discos-persistentes/DiscosPersistentesComponent.tsx`](#components-gcp-vista-recursos-sin-uso-discos-persistentes-discospersistentescomponent-tsx)
- [`components/gcp/vista-recursos/sin-uso/discos-persistentes/MainViewDiscosPersistentesComponent.tsx`](#components-gcp-vista-recursos-sin-uso-discos-persistentes-mainviewdiscospersistentescomponent-tsx)
- [`components/gcp/vista-recursos/sin-uso/filestore/FilestoreSinUsoComponent.tsx`](#components-gcp-vista-recursos-sin-uso-filestore-filestoresinusocomponent-tsx)
- [`components/gcp/vista-recursos/sin-uso/filestore/MainViewFilestoreSinUsoComponent.tsx`](#components-gcp-vista-recursos-sin-uso-filestore-mainviewfilestoresinusocomponent-tsx)
- [`components/gcp/vista-recursos/sin-uso/instance-groups/MainViewUnusedIgComponent.tsx`](#components-gcp-vista-recursos-sin-uso-instance-groups-mainviewunusedigcomponent-tsx)
- [`components/gcp/vista-recursos/sin-uso/instance-groups/UnusedIgComponent.tsx`](#components-gcp-vista-recursos-sin-uso-instance-groups-unusedigcomponent-tsx)

<a id="components-gcp-vista-recursos-cloudsql-cloudsqlcomponent-tsx"></a>
## `components/gcp/vista-recursos/cloudsql/CloudSqlComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `CloudSqlComponent` `({ startDate, endDate, resourceId, tagKey, tagValue }: CloudSqlComponentProps)`

Interfaz `CloudSqlComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `resourceId` | `string` | no | — |
| `dbEngine` | `string` | no | — |
| `tagKey` | `string` | no | — |
| `tagValue` | `string` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`

- API: `/api/gcp/bridge/gcp/instancias_cloud_sql/gcp-cloudsql-instances`, `/api/gcp/bridge/gcp/instancias_cloud_sql/gcp-cloudsql-instances_billing`, `/api/gcp/bridge/gcp/instancias_cloud_sql/gcp-cloudsql-instances_metrics`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`CloudSqlChartComponent.tsx`](#components-gcp-vista-recursos-cloudsql-grafico-cloudsqlchartcomponent-tsx), [`CloudSqlInfoComponent.tsx`](#components-gcp-vista-recursos-cloudsql-info-cloudsqlinfocomponent-tsx), [`CloudSqlMetricsCardComponent.tsx`](#components-gcp-vista-recursos-cloudsql-info-cloudsqlmetricscardcomponent-tsx), [`CloudSqlBillingTableComponent.tsx`](#components-gcp-vista-recursos-cloudsql-table-cloudsqlbillingtablecomponent-tsx), [`LoaderComponent.tsx`](../general_gcp.md#components-general-gcp-loadercomponent-tsx), [`cSqlInterfaces.ts`](../../tipos.md#interfaces-vista-cloudsql-csqlinterfaces-ts)
- Usado por: [`MainViewCloudSqlComponent.tsx`](#components-gcp-vista-recursos-cloudsql-mainviewcloudsqlcomponent-tsx)

---

<a id="components-gcp-vista-recursos-cloudsql-mainviewcloudsqlcomponent-tsx"></a>
## `components/gcp/vista-recursos/cloudsql/MainViewCloudSqlComponent.tsx`

**Componente**

Exporta:

- componente `MainViewCloudSqlComponent` `({ db_engine }: { db_engine: string })`

- Usa: [`CloudSqlComponent.tsx`](#components-gcp-vista-recursos-cloudsql-cloudsqlcomponent-tsx), [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-recursos-cloudsql-mysql-page-tsx), [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-recursos-cloudsql-postgresql-page-tsx), [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-recursos-cloudsql-sqlserver-page-tsx)

---

<a id="components-gcp-vista-recursos-cloudsql-grafico-cloudsqlchartcomponent-tsx"></a>
## `components/gcp/vista-recursos/cloudsql/grafico/CloudSqlChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `CloudSqlChartComponent` `({ data }: CloudSqlChartComponentProps)`

Interfaz `CloudSqlChartComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `CloudSqlMetrics[]` | no | — |

Internos:

- componente `SingleMetricChart` `({ metric }: { metric: CloudSqlMetrics })`

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts), [`cSqlInterfaces.ts`](../../tipos.md#interfaces-vista-cloudsql-csqlinterfaces-ts)
- Usado por: [`CloudSqlComponent.tsx`](#components-gcp-vista-recursos-cloudsql-cloudsqlcomponent-tsx)

Notas de implementación:

- _SingleMetricChart_: JSX — Promedio: <strong>{metric.avg_value.toFixed(2)}</strong>

---

<a id="components-gcp-vista-recursos-cloudsql-info-cloudsqlhistoricinfocomponent-tsx"></a>
## `components/gcp/vista-recursos/cloudsql/info/CloudSqlHistoricInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `CloudSqlHistoricInfoComponent` `({ instances }: CloudSqlHistoricInfoComponentProps)`

Interfaz `CloudSqlHistoricInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instances` | `HistoryDatum[]` | no | — |

- Usa: [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx), [`getUptimeInstance.ts`](../../lib.md#lib-getuptimeinstance-ts), [`cSqlInterfaces.ts`](../../tipos.md#interfaces-vista-cloudsql-csqlinterfaces-ts)
- Usado por: [`CloudSqlInfoComponent.tsx`](#components-gcp-vista-recursos-cloudsql-info-cloudsqlinfocomponent-tsx)

---

<a id="components-gcp-vista-recursos-cloudsql-info-cloudsqlinfocomponent-tsx"></a>
## `components/gcp/vista-recursos/cloudsql/info/CloudSqlInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `CloudSqlInfoComponent` `({ data }: CloudSqlInfoComponentProps)`

Interfaz `CloudSqlInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `CloudSqlInfo[] \| null` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`CloudSqlHistoricInfoComponent.tsx`](#components-gcp-vista-recursos-cloudsql-info-cloudsqlhistoricinfocomponent-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`getUptimeInstance.ts`](../../lib.md#lib-getuptimeinstance-ts), [`cSqlInterfaces.ts`](../../tipos.md#interfaces-vista-cloudsql-csqlinterfaces-ts)
- Usado por: [`CloudSqlComponent.tsx`](#components-gcp-vista-recursos-cloudsql-cloudsqlcomponent-tsx)

---

<a id="components-gcp-vista-recursos-cloudsql-info-cloudsqlmetricscardcomponent-tsx"></a>
## `components/gcp/vista-recursos/cloudsql/info/CloudSqlMetricsCardComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `CloudSqlMetricsCardComponent` `({ data }: CloudSqlMetricsCardComponentProps)`

Interfaz `CloudSqlMetricsCardComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `CloudSqlMetrics[]` | sí | — |

Internos:

- constante `metricUnits`
- función `getMetricIcon` `(metricName: string)`
- función `formatMetricName` `(name: string)`

- Hooks: `useSidebar`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`sidebar.tsx`](../ui.md#components-ui-sidebar-tsx), [`cSqlInterfaces.ts`](../../tipos.md#interfaces-vista-cloudsql-csqlinterfaces-ts), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts), [`metricUtils.ts`](../../lib.md#lib-metricutils-ts), [`utils.ts`](../../lib.md#lib-utils-ts)
- Usado por: [`CloudSqlComponent.tsx`](#components-gcp-vista-recursos-cloudsql-cloudsqlcomponent-tsx)

---

<a id="components-gcp-vista-recursos-cloudsql-table-cloudsqlbillingcolumns-tsx"></a>
## `components/gcp/vista-recursos/cloudsql/table/CloudSqlBillingColumns.tsx`

**Módulo (cliente)**

Exporta:

- función `getCloudSqlBillingColumns` `(): DynamicColumn<CloudSqlBilling>[]`

Internos:

- función `formatCurrencyUSD` `(value: number | undefined)`
- función `formatCurrencyCLP` `(value: number | undefined)`

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`cSqlInterfaces.ts`](../../tipos.md#interfaces-vista-cloudsql-csqlinterfaces-ts)
- Usado por: [`CloudSqlBillingTableComponent.tsx`](#components-gcp-vista-recursos-cloudsql-table-cloudsqlbillingtablecomponent-tsx)

---

<a id="components-gcp-vista-recursos-cloudsql-table-cloudsqlbillingtablecomponent-tsx"></a>
## `components/gcp/vista-recursos/cloudsql/table/CloudSqlBillingTableComponent.tsx`

**Componente**

Exporta:

- componente `CloudSqlBillingTableComponent` `({ data }: CloudSqlBillingTableComponentProps)`

Interfaz `CloudSqlBillingTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `CloudSqlBilling[]` | no | — |

Internos:

- función `formatUSD` `(value: number)`
- función `formatCLP` `(value: number)`

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`cSqlInterfaces.ts`](../../tipos.md#interfaces-vista-cloudsql-csqlinterfaces-ts), [`CloudSqlBillingColumns.tsx`](#components-gcp-vista-recursos-cloudsql-table-cloudsqlbillingcolumns-tsx)
- Usado por: [`CloudSqlComponent.tsx`](#components-gcp-vista-recursos-cloudsql-cloudsqlcomponent-tsx)

---

<a id="components-gcp-vista-recursos-clusters-gke-gkecomponent-tsx"></a>
## `components/gcp/vista-recursos/clusters-gke/GkeComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `GkeComponent` `({ startDate, endDate, resourceId }: GkeComponentProps)`

Interfaz `GkeComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `resourceId` | `string` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`

- API: `/api/gcp/bridge/gcp/gke_clusters/all_gke_instances`, `/api/gcp/bridge/gcp/gke_clusters/gcp_gke_cluster`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`GkeChartComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-grafico-gkechartcomponent-tsx), [`GkeInfoComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-info-gkeinfocomponent-tsx), [`GkeMetricsCardComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-info-gkemetricscardcomponent-tsx), [`GkeBillingComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-table-gkebillingcomponent-tsx), [`GkeNodesTableComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-table-gkenodestablecomponent-tsx), [`DataStateComponent.tsx`](../shared.md#components-shared-datastatecomponent-tsx), [`gkeInterfaces.ts`](../../tipos.md#interfaces-vista-gke-gkeinterfaces-ts)
- Usado por: [`MainViewGkeComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-mainviewgkecomponent-tsx)

---

<a id="components-gcp-vista-recursos-clusters-gke-mainviewgkecomponent-tsx"></a>
## `components/gcp/vista-recursos/clusters-gke/MainViewGkeComponent.tsx`

**Componente**

Exporta:

- componente `MainViewGkeComponent` `()`

- Usa: [`GkeComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-gkecomponent-tsx), [`ComputeEngineComponent.tsx`](#components-gcp-vista-recursos-compute-engine-computeenginecomponent-tsx), [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-recursos-clusters-gke-page-tsx)

---

<a id="components-gcp-vista-recursos-clusters-gke-grafico-gkechartcomponent-tsx"></a>
## `components/gcp/vista-recursos/clusters-gke/grafico/GkeChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `GkeChartComponent` `({ instances, startDate, endDate }: GkeChartComponentProps)`

Interfaz `GkeChartComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instances` | `string[]` | no | — |
| `startDate` | `string` | no | — |
| `endDate` | `string` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`
- componente `SingleMetricChart` `({ metric }: { metric: ClusterGkeMetrics })`

- API: `/api/gcp/bridge/gcp/gke_clusters/gcp_gke_cluster_metrics`
- Hooks: `useECharts`, `useSWR`, `useTheme`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts), [`gkeInterfaces.ts`](../../tipos.md#interfaces-vista-gke-gkeinterfaces-ts), [`LoaderComponent.tsx`](../general_gcp.md#components-general-gcp-loadercomponent-tsx), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx)
- Usado por: [`GkeComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-gkecomponent-tsx)

---

<a id="components-gcp-vista-recursos-clusters-gke-info-gkehistoricinfocomponent-tsx"></a>
## `components/gcp/vista-recursos/clusters-gke/info/GkeHistoricInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `GkeHistoricInfoComponent` `({ snapshots }: GkeHistoricInfoComponentProps)`

Interfaz `GkeHistoricInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `snapshots` | `ClusterGkeInfo[]` | no | — |

- Usa: [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx), [`gkeInterfaces.ts`](../../tipos.md#interfaces-vista-gke-gkeinterfaces-ts)
- Usado por: [`GkeInfoComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-info-gkeinfocomponent-tsx)

---

<a id="components-gcp-vista-recursos-clusters-gke-info-gkeinfocomponent-tsx"></a>
## `components/gcp/vista-recursos/clusters-gke/info/GkeInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `GkeInfoComponent` `({ data }: GkeInfoComponentProps)`

Interfaz `GkeInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ClusterGkeResponse[] \| null` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`gkeInterfaces.ts`](../../tipos.md#interfaces-vista-gke-gkeinterfaces-ts), [`GkeHistoricInfoComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-info-gkehistoricinfocomponent-tsx)
- Usado por: [`GkeComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-gkecomponent-tsx)

---

<a id="components-gcp-vista-recursos-clusters-gke-info-gkemetricscardcomponent-tsx"></a>
## `components/gcp/vista-recursos/clusters-gke/info/GkeMetricsCardComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `GkeMetricsCardComponent` `({ instances, startDate, endDate }: GkeMetricsCardComponentProps)`

Interfaz `GkeMetricsCardComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instances` | `string[]` | no | — |
| `startDate` | `string` | no | — |
| `endDate` | `string` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`
- constante `metricUnits`
- función `getMetricIcon` `(metricName: string)`
- función `formatMetricName` `(name: string)`

- API: `/api/gcp/bridge/gcp/gke_clusters/gcp_gke_cluster_metrics`
- Hooks: `useSWR`, `useSidebar`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](../general_gcp.md#components-general-gcp-loadercomponent-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`sidebar.tsx`](../ui.md#components-ui-sidebar-tsx), [`gkeInterfaces.ts`](../../tipos.md#interfaces-vista-gke-gkeinterfaces-ts), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts), [`metricUtils.ts`](../../lib.md#lib-metricutils-ts), [`utils.ts`](../../lib.md#lib-utils-ts)
- Usado por: [`GkeComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-gkecomponent-tsx)

---

<a id="components-gcp-vista-recursos-clusters-gke-table-gkebillingcolumns-tsx"></a>
## `components/gcp/vista-recursos/clusters-gke/table/GkeBillingColumns.tsx`

**Módulo (cliente)**

Exporta:

- interfaz `ResourceBillingGroup`
- función `getSkuBillingColumns` `(): DynamicColumn<ClusterGkeBilling>[]`
- función `getResourceBillingColumns` `(): DynamicColumn<ResourceBillingGroup>[]`

Interfaz `ResourceBillingGroup` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `items` | `ClusterGkeBilling[]` | no | — |

Internos:

- función `formatCurrencyUSD` `(value: number | undefined)`
- función `formatCurrencyCLP` `(value: number | undefined)`
- componente `SkuBreakdownTable` `({ data }: { data: ClusterGkeBilling[] })`

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`gkeInterfaces.ts`](../../tipos.md#interfaces-vista-gke-gkeinterfaces-ts)
- Usado por: [`GkeBillingTableComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-table-gkebillingtablecomponent-tsx)

---

<a id="components-gcp-vista-recursos-clusters-gke-table-gkebillingcomponent-tsx"></a>
## `components/gcp/vista-recursos/clusters-gke/table/GkeBillingComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `GkeBillingComponent` `({ instances, startDate, endDate }: GkeBillingComponentProps)`

Interfaz `GkeBillingComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instances` | `string[]` | no | — |
| `startDate` | `string` | no | — |
| `endDate` | `string` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`

- API: `/api/gcp/bridge/gcp/gke_clusters/gcp_gke_cluster_billing`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`GkeBillingTableComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-table-gkebillingtablecomponent-tsx), [`LoaderComponent.tsx`](../general_gcp.md#components-general-gcp-loadercomponent-tsx), [`gkeInterfaces.ts`](../../tipos.md#interfaces-vista-gke-gkeinterfaces-ts)
- Usado por: [`GkeComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-gkecomponent-tsx)

---

<a id="components-gcp-vista-recursos-clusters-gke-table-gkebillingtablecomponent-tsx"></a>
## `components/gcp/vista-recursos/clusters-gke/table/GkeBillingTableComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `GkeBillingTableComponent` `({ data }: GkeBillingTableComponentProps)`

Interfaz `GkeBillingTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ClusterGkeBilling[]` | no | — |

Internos:

- función `formatUSD` `(value: number)`
- función `formatCLP` `(value: number)`

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`GkeBillingColumns.tsx`](#components-gcp-vista-recursos-clusters-gke-table-gkebillingcolumns-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`gkeInterfaces.ts`](../../tipos.md#interfaces-vista-gke-gkeinterfaces-ts)
- Usado por: [`GkeBillingComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-table-gkebillingcomponent-tsx)

---

<a id="components-gcp-vista-recursos-clusters-gke-table-gkenodescolumns-tsx"></a>
## `components/gcp/vista-recursos/clusters-gke/table/GkeNodesColumns.tsx`

**Módulo (cliente)**

Exporta:

- tipo `ProcessedInstanceRow` = `ClusterGkeInstances & { latestSnapshot: ClusterGkeInstances | undefined; sync_time?: string; creationTimestamp?: string…`
- función `getGkeNodesColumns` `(onHistoryClick?: (instance: ProcessedInstanceRow) => void): DynamicColumn<ProcessedInstanceRow>[]`

Internos:

- función `formatDate` `(value: string | undefined)` — Función unificada para formatear fechas (ISO 8601 y con Timezone Offset)
- función `extractNameFromUrl` `(url: string)`
- componente `GetParameters` `()`

- Hooks: `useSearchParams`
- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`gkeInterfaces.ts`](../../tipos.md#interfaces-vista-gke-gkeinterfaces-ts), [`filters.ts`](../../lib.md#lib-filters-ts)
- Usado por: [`GkeNodesTableComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-table-gkenodestablecomponent-tsx)

---

<a id="components-gcp-vista-recursos-clusters-gke-table-gkenodestablecomponent-tsx"></a>
## `components/gcp/vista-recursos/clusters-gke/table/GkeNodesTableComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `GkeNodesTableComponent` `({ data }: GkeNodesTableComponentProps)`

Interfaz `GkeNodesTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ClusterGkeInstances[]` | no | — |

Internos:

- función `formatDate` `(value: string | undefined)` — Misma función de formateo para asegurar consistencia

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`table.tsx`](../ui.md#components-ui-table-tsx), [`gkeInterfaces.ts`](../../tipos.md#interfaces-vista-gke-gkeinterfaces-ts), [`GkeNodesColumns.tsx`](#components-gcp-vista-recursos-clusters-gke-table-gkenodescolumns-tsx)
- Usado por: [`GkeComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-gkecomponent-tsx)

---

<a id="components-gcp-vista-recursos-compute-engine-computeenginecomponent-tsx"></a>
## `components/gcp/vista-recursos/compute-engine/ComputeEngineComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ComputeEngineComponent` `({ startDate, endDate, resourceId }: ComputeEngineComponentProps)`

Interfaz `ComputeEngineComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `resourceId` | `string` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`

- API: `/api/gcp/bridge/gcp/instancias_compute_engine/gcp-compute-instances`, `/api/gcp/bridge/gcp/instancias_compute_engine/gcp-compute-instances_billing`, `/api/gcp/bridge/gcp/instancias_compute_engine/gcp-compute-instances_metrics`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`ComputeEngineChartComponent.tsx`](#components-gcp-vista-recursos-compute-engine-grafico-computeenginechartcomponent-tsx), [`ComputeEngineInfoComponent.tsx`](#components-gcp-vista-recursos-compute-engine-info-computeengineinfocomponent-tsx), [`ComputeEngineMetricsCardsComponent.tsx`](#components-gcp-vista-recursos-compute-engine-info-computeenginemetricscardscomponent-tsx), [`ComputeEngineBillingTableComponent.tsx`](#components-gcp-vista-recursos-compute-engine-table-computeenginebillingtablecomponent-tsx), [`LoaderComponent.tsx`](../general_gcp.md#components-general-gcp-loadercomponent-tsx), [`cEInterfaces.ts`](../../tipos.md#interfaces-vista-compute-engine-ceinterfaces-ts)
- Usado por: [`MainViewGkeComponent.tsx`](#components-gcp-vista-recursos-clusters-gke-mainviewgkecomponent-tsx), [`MainViewComputeEngineComponent.tsx`](#components-gcp-vista-recursos-compute-engine-mainviewcomputeenginecomponent-tsx)

---

<a id="components-gcp-vista-recursos-compute-engine-mainviewcomputeenginecomponent-tsx"></a>
## `components/gcp/vista-recursos/compute-engine/MainViewComputeEngineComponent.tsx`

**Componente**

Exporta:

- componente `MainViewComputeEngineComponent` `()`

- Usa: [`ComputeEngineComponent.tsx`](#components-gcp-vista-recursos-compute-engine-computeenginecomponent-tsx), [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-recursos-compute-engine-page-tsx)

---

<a id="components-gcp-vista-recursos-compute-engine-grafico-computeenginechartcomponent-tsx"></a>
## `components/gcp/vista-recursos/compute-engine/grafico/ComputeEngineChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ComputeEngineChartComponent` `({ data }: ComputeEngineChartComponentProps)`

Interfaz `ComputeEngineChartComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ComputeEngineMetrics[]` | no | — |

Internos:

- componente `SingleMetricChart` `({ metric }: { metric: ComputeEngineMetrics })`

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts), [`cEInterfaces.ts`](../../tipos.md#interfaces-vista-compute-engine-ceinterfaces-ts)
- Usado por: [`AzureMysqlResourceComponent.tsx`](../azure/vista-recursos-mysql.md#components-azure-vista-recursos-mysql-azuremysqlresourcecomponent-tsx), [`AzureNodeResourceComponent.tsx`](../azure/vista-recursos-nodos.md#components-azure-vista-recursos-nodos-azurenoderesourcecomponent-tsx), [`AzurePostgresResourceComponent.tsx`](../azure/vista-recursos-postgresql.md#components-azure-vista-recursos-postgresql-azurepostgresresourcecomponent-tsx), [`AzureVmResourceComponent.tsx`](../azure/vista-recursos-vm.md#components-azure-vista-recursos-vm-azurevmresourcecomponent-tsx), [`ComputeEngineComponent.tsx`](#components-gcp-vista-recursos-compute-engine-computeenginecomponent-tsx)

Notas de implementación:

- _SingleMetricChart_: JSX — Promedio: <strong>{metric.avg_value.toFixed(2)}</strong>

---

<a id="components-gcp-vista-recursos-compute-engine-info-computeenginehistoricinfocomponent-tsx"></a>
## `components/gcp/vista-recursos/compute-engine/info/ComputeEngineHistoricInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ComputeEngineHistoricInfoComponent` `({ instances }: ComputeEngineHistoricInfoComponentProps)`

Interfaz `ComputeEngineHistoricInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instances` | `ComputeEngineInfoHistoryData[]` | no | — |

- Usa: [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx), [`getUptimeInstance.ts`](../../lib.md#lib-getuptimeinstance-ts), [`cEInterfaces.ts`](../../tipos.md#interfaces-vista-compute-engine-ceinterfaces-ts)
- Usado por: [`ComputeEngineInfoComponent.tsx`](#components-gcp-vista-recursos-compute-engine-info-computeengineinfocomponent-tsx)

---

<a id="components-gcp-vista-recursos-compute-engine-info-computeengineinfocomponent-tsx"></a>
## `components/gcp/vista-recursos/compute-engine/info/ComputeEngineInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ComputeEngineInfoComponent` `({ data }: ComputeEngineInfoComponentProps)`

Interfaz `ComputeEngineInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ComputeEngineInfoResponse \| null` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`ComputeEngineHistoricInfoComponent.tsx`](#components-gcp-vista-recursos-compute-engine-info-computeenginehistoricinfocomponent-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`getUptimeInstance.ts`](../../lib.md#lib-getuptimeinstance-ts), [`cEInterfaces.ts`](../../tipos.md#interfaces-vista-compute-engine-ceinterfaces-ts)
- Usado por: [`ComputeEngineComponent.tsx`](#components-gcp-vista-recursos-compute-engine-computeenginecomponent-tsx)

---

<a id="components-gcp-vista-recursos-compute-engine-info-computeenginemetricscardscomponent-tsx"></a>
## `components/gcp/vista-recursos/compute-engine/info/ComputeEngineMetricsCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ComputeEngineMetricsCardsComponent` `({ data }: ComputeEngineMetricsCardsComponentProps)`

Interfaz `ComputeEngineMetricsCardsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ComputeEngineMetrics[]` | sí | — |

Internos:

- constante `metricUnits`
- función `getMetricIcon` `(metricName: string)`
- función `formatMetricName` `(name: string)`

- Hooks: `useSidebar`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`sidebar.tsx`](../ui.md#components-ui-sidebar-tsx), [`cEInterfaces.ts`](../../tipos.md#interfaces-vista-compute-engine-ceinterfaces-ts), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts), [`metricUtils.ts`](../../lib.md#lib-metricutils-ts), [`utils.ts`](../../lib.md#lib-utils-ts)
- Usado por: [`AzureMysqlResourceComponent.tsx`](../azure/vista-recursos-mysql.md#components-azure-vista-recursos-mysql-azuremysqlresourcecomponent-tsx), [`AzureNodeResourceComponent.tsx`](../azure/vista-recursos-nodos.md#components-azure-vista-recursos-nodos-azurenoderesourcecomponent-tsx), [`AzurePostgresResourceComponent.tsx`](../azure/vista-recursos-postgresql.md#components-azure-vista-recursos-postgresql-azurepostgresresourcecomponent-tsx), [`AzureVmResourceComponent.tsx`](../azure/vista-recursos-vm.md#components-azure-vista-recursos-vm-azurevmresourcecomponent-tsx), [`ComputeEngineComponent.tsx`](#components-gcp-vista-recursos-compute-engine-computeenginecomponent-tsx)

---

<a id="components-gcp-vista-recursos-compute-engine-table-computeenginebillingcolumns-tsx"></a>
## `components/gcp/vista-recursos/compute-engine/table/ComputeEngineBillingColumns.tsx`

**Módulo (cliente)**

Exporta:

- función `getComputeEngineBillingColumns` `(): DynamicColumn<ComputeEngineBilling>[]`

Internos:

- función `formatCurrencyUSD` `(value: number | undefined)`
- función `formatCurrencyCLP` `(value: number | undefined)`

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`cEInterfaces.ts`](../../tipos.md#interfaces-vista-compute-engine-ceinterfaces-ts)
- Usado por: [`ComputeEngineBillingTableComponent.tsx`](#components-gcp-vista-recursos-compute-engine-table-computeenginebillingtablecomponent-tsx)

---

<a id="components-gcp-vista-recursos-compute-engine-table-computeenginebillingtablecomponent-tsx"></a>
## `components/gcp/vista-recursos/compute-engine/table/ComputeEngineBillingTableComponent.tsx`

**Componente**

Exporta:

- componente `ComputeEngineBillingTableComponent` `({ data }: ComputeEngineBillingTableComponentProps)`

Interfaz `ComputeEngineBillingTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ComputeEngineBilling[]` | no | — |

Internos:

- función `formatUSD` `(value: number)`
- función `formatCLP` `(value: number)`

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`cEInterfaces.ts`](../../tipos.md#interfaces-vista-compute-engine-ceinterfaces-ts), [`ComputeEngineBillingColumns.tsx`](#components-gcp-vista-recursos-compute-engine-table-computeenginebillingcolumns-tsx)
- Usado por: [`ComputeEngineComponent.tsx`](#components-gcp-vista-recursos-compute-engine-computeenginecomponent-tsx)

---

<a id="components-gcp-vista-recursos-instance-groups-instancegroupscomponent-tsx"></a>
## `components/gcp/vista-recursos/instance-groups/InstanceGroupsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `InstanceGroupsComponent` `({ startDate, endDate, resourceId }: InstanceGroupsComponentProps)`

Interfaz `InstanceGroupsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `resourceId` | `string` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`

- API: `/api/gcp/bridge/gcp/instance_groups/all_instances_instance_groups`, `/api/gcp/bridge/gcp/instance_groups/gcp_instance_group_metrics`, `/api/gcp/bridge/gcp/instance_groups/gcp_instance_groups`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`InstanceGroupChartComponent.tsx`](#components-gcp-vista-recursos-instance-groups-grafico-instancegroupchartcomponent-tsx), [`InstanceGroupsInfoComponent.tsx`](#components-gcp-vista-recursos-instance-groups-info-instancegroupsinfocomponent-tsx), [`InstanceGroupsMetricsCardsComponent.tsx`](#components-gcp-vista-recursos-instance-groups-info-instancegroupsmetricscardscomponent-tsx), [`InstanceGroupsBillingComponent.tsx`](#components-gcp-vista-recursos-instance-groups-table-instancegroupsbillingcomponent-tsx), [`InstanceGroupsInstancesTableComponent.tsx`](#components-gcp-vista-recursos-instance-groups-table-instancegroupsinstancestablecomponent-tsx), [`LoaderComponent.tsx`](../general_gcp.md#components-general-gcp-loadercomponent-tsx), [`iGInterfaces.ts`](../../tipos.md#interfaces-vista-instance-group-iginterfaces-ts)
- Usado por: [`MainViewInstanceGroupsComponent.tsx`](#components-gcp-vista-recursos-instance-groups-mainviewinstancegroupscomponent-tsx)

---

<a id="components-gcp-vista-recursos-instance-groups-mainviewinstancegroupscomponent-tsx"></a>
## `components/gcp/vista-recursos/instance-groups/MainViewInstanceGroupsComponent.tsx`

**Componente**

Exporta:

- componente `MainViewInstanceGroupsComponent` `()`

- Usa: [`InstanceGroupsComponent.tsx`](#components-gcp-vista-recursos-instance-groups-instancegroupscomponent-tsx), [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-recursos-instance-groups-page-tsx)

---

<a id="components-gcp-vista-recursos-instance-groups-grafico-instancegroupchartcomponent-tsx"></a>
## `components/gcp/vista-recursos/instance-groups/grafico/InstanceGroupChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `InstanceGroupChartComponent` `({ instances, startDate, endDate }: InstanceGroupChartComponentProps)`

Interfaz `InstanceGroupChartComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instances` | `string[]` | no | — |
| `startDate` | `string` | no | — |
| `endDate` | `string` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`
- componente `SingleMetricChart` `({ metric }: { metric: InstanceGroupsMetrics })`

- API: `/api/gcp/bridge/gcp/instance_groups/gcp_instance_group_metrics`
- Hooks: `useECharts`, `useSWR`, `useTheme`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts), [`LoaderComponent.tsx`](../general_gcp.md#components-general-gcp-loadercomponent-tsx), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`iGInterfaces.ts`](../../tipos.md#interfaces-vista-instance-group-iginterfaces-ts)
- Usado por: [`InstanceGroupsComponent.tsx`](#components-gcp-vista-recursos-instance-groups-instancegroupscomponent-tsx)

---

<a id="components-gcp-vista-recursos-instance-groups-info-instancegroupshistoricinfocomponent-tsx"></a>
## `components/gcp/vista-recursos/instance-groups/info/InstanceGroupsHistoricInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `InstanceGroupsHistoricInfoComponent` `({ snapshots }: InstanceGroupsHistoricInfoComponentProps)`

Interfaz `InstanceGroupsHistoricInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `snapshots` | `HistoryData[]` | no | — |

- Usa: [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx), [`iGInterfaces.ts`](../../tipos.md#interfaces-vista-instance-group-iginterfaces-ts)
- Usado por: [`InstanceGroupsInfoComponent.tsx`](#components-gcp-vista-recursos-instance-groups-info-instancegroupsinfocomponent-tsx)

---

<a id="components-gcp-vista-recursos-instance-groups-info-instancegroupsinfocomponent-tsx"></a>
## `components/gcp/vista-recursos/instance-groups/info/InstanceGroupsInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `InstanceGroupsInfoComponent` `({ data }: InstanceGroupsInfoComponentProps)`

Interfaz `InstanceGroupsInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `InstanceGroupInfo[] \| null` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`InstanceGroupsHistoricInfoComponent.tsx`](#components-gcp-vista-recursos-instance-groups-info-instancegroupshistoricinfocomponent-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`iGInterfaces.ts`](../../tipos.md#interfaces-vista-instance-group-iginterfaces-ts)
- Usado por: [`InstanceGroupsComponent.tsx`](#components-gcp-vista-recursos-instance-groups-instancegroupscomponent-tsx)

---

<a id="components-gcp-vista-recursos-instance-groups-info-instancegroupsmetricscardscomponent-tsx"></a>
## `components/gcp/vista-recursos/instance-groups/info/InstanceGroupsMetricsCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `InstanceGroupsMetricsCardsComponent` `({ instances, startDate, endDate }: InstanceGroupsMetricsCardsComponentProps)`

Interfaz `InstanceGroupsMetricsCardsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instances` | `string[]` | no | — |
| `startDate` | `string` | no | — |
| `endDate` | `string` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`
- constante `metricUnits`
- función `getMetricIcon` `(metricName: string)`
- función `formatMetricName` `(name: string)`

- API: `/api/gcp/bridge/gcp/instance_groups/gcp_instance_group_metrics`
- Hooks: `useSWR`, `useSidebar`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](../general_gcp.md#components-general-gcp-loadercomponent-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`sidebar.tsx`](../ui.md#components-ui-sidebar-tsx), [`iGInterfaces.ts`](../../tipos.md#interfaces-vista-instance-group-iginterfaces-ts), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts), [`metricUtils.ts`](../../lib.md#lib-metricutils-ts), [`utils.ts`](../../lib.md#lib-utils-ts)
- Usado por: [`InstanceGroupsComponent.tsx`](#components-gcp-vista-recursos-instance-groups-instancegroupscomponent-tsx)

---

<a id="components-gcp-vista-recursos-instance-groups-table-instancegroupbillingcolumns-tsx"></a>
## `components/gcp/vista-recursos/instance-groups/table/InstanceGroupBillingColumns.tsx`

**Módulo (cliente)**

Exporta:

- interfaz `ResourceBillingGroup`
- función `getSkuBillingColumns` `(): DynamicColumn<InstanceGroupsBilling>[]`
- función `getResourceBillingColumns` `(): DynamicColumn<ResourceBillingGroup>[]`

Interfaz `ResourceBillingGroup` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `items` | `InstanceGroupsBilling[]` | no | — |

Internos:

- función `formatCurrencyUSD` `(value: number | undefined)`
- función `formatCurrencyCLP` `(value: number | undefined)`
- componente `SkuBreakdownTable` `({ data }: { data: InstanceGroupsBilling[] })`

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`iGInterfaces.ts`](../../tipos.md#interfaces-vista-instance-group-iginterfaces-ts), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx)
- Usado por: [`InstanceGroupsBillingTableComponent.tsx`](#components-gcp-vista-recursos-instance-groups-table-instancegroupsbillingtablecomponent-tsx)

---

<a id="components-gcp-vista-recursos-instance-groups-table-instancegroupsbillingcomponent-tsx"></a>
## `components/gcp/vista-recursos/instance-groups/table/InstanceGroupsBillingComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `InstanceGroupsBillingComponent` `({ instances, startDate, endDate }: InstanceGroupsBillingComponentProps)`

Interfaz `InstanceGroupsBillingComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instances` | `string[]` | no | — |
| `startDate` | `string` | no | — |
| `endDate` | `string` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`

- API: `/api/gcp/bridge/gcp/instance_groups/gcp_instance_groups_billing`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`InstanceGroupsBillingTableComponent.tsx`](#components-gcp-vista-recursos-instance-groups-table-instancegroupsbillingtablecomponent-tsx), [`LoaderComponent.tsx`](../general_gcp.md#components-general-gcp-loadercomponent-tsx), [`iGInterfaces.ts`](../../tipos.md#interfaces-vista-instance-group-iginterfaces-ts)
- Usado por: [`InstanceGroupsComponent.tsx`](#components-gcp-vista-recursos-instance-groups-instancegroupscomponent-tsx)

---

<a id="components-gcp-vista-recursos-instance-groups-table-instancegroupsbillingtablecomponent-tsx"></a>
## `components/gcp/vista-recursos/instance-groups/table/InstanceGroupsBillingTableComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `InstanceGroupsBillingTableComponent` `({ data }: InstanceGroupsBillingTableComponentProps)`

Interfaz `InstanceGroupsBillingTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `InstanceGroupsBilling[]` | no | — |

Internos:

- función `formatUSD` `(value: number)`
- función `formatCLP` `(value: number)`

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`InstanceGroupBillingColumns.tsx`](#components-gcp-vista-recursos-instance-groups-table-instancegroupbillingcolumns-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`iGInterfaces.ts`](../../tipos.md#interfaces-vista-instance-group-iginterfaces-ts)
- Usado por: [`InstanceGroupsBillingComponent.tsx`](#components-gcp-vista-recursos-instance-groups-table-instancegroupsbillingcomponent-tsx)

---

<a id="components-gcp-vista-recursos-instance-groups-table-instancegroupsinstancescolumns-tsx"></a>
## `components/gcp/vista-recursos/instance-groups/table/InstanceGroupsInstancesColumns.tsx`

**Módulo (cliente)**

Exporta:

- tipo `ProcessedInstanceRow` = `InstanceGroupsInstances & { latestSnapshot: InstanceGroupsInstancesData | undefined; sync_time?: string; creationTimest…`
- función `getInstanceGroupsInstancesColumns` `(onHistoryClick?: (instance: ProcessedInstanceRow) => void): DynamicColumn<ProcessedInstanceRow>[]`

Internos:

- función `formatDate` `(value: string | undefined)` — Función unificada para formatear fechas (ISO 8601 y con Timezone Offset)
- función `extractNameFromUrl` `(url: string)`
- componente `GetParameters` `()`

- Hooks: `useSearchParams`
- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`cEInterfaces.ts`](../../tipos.md#interfaces-vista-compute-engine-ceinterfaces-ts), [`button.tsx`](../ui.md#components-ui-button-tsx), [`filters.ts`](../../lib.md#lib-filters-ts)
- Usado por: [`InstanceGroupsInstancesTableComponent.tsx`](#components-gcp-vista-recursos-instance-groups-table-instancegroupsinstancestablecomponent-tsx)

---

<a id="components-gcp-vista-recursos-instance-groups-table-instancegroupsinstancestablecomponent-tsx"></a>
## `components/gcp/vista-recursos/instance-groups/table/InstanceGroupsInstancesTableComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `InstanceGroupsInstancesTableComponent` `({ data }: InstanceGroupsInstancesTableProps)`

Interfaz `InstanceGroupsInstancesTableProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `InstanceGroupsInstances[]` | no | — |

Internos:

- función `formatDate` `(value: string | undefined)` — Misma función de formateo para asegurar consistencia

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`cEInterfaces.ts`](../../tipos.md#interfaces-vista-compute-engine-ceinterfaces-ts), [`InstanceGroupsInstancesColumns.tsx`](#components-gcp-vista-recursos-instance-groups-table-instancegroupsinstancescolumns-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`table.tsx`](../ui.md#components-ui-table-tsx)
- Usado por: [`InstanceGroupsComponent.tsx`](#components-gcp-vista-recursos-instance-groups-instancegroupscomponent-tsx)

---

<a id="components-gcp-vista-recursos-sin-uso-clusters-gke-mainviewunusedgkecomponent-tsx"></a>
## `components/gcp/vista-recursos/sin-uso/clusters-gke/MainViewUnusedGkeComponent.tsx`

**Componente**

Exporta:

- componente `MainViewUnusedGkeComponent` `()`

- Usa: [`UnusedGkeComponent.tsx`](#components-gcp-vista-recursos-sin-uso-clusters-gke-unusedgkecomponent-tsx), [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-funciones-unused-resources-clusters-gke-page-tsx)

---

<a id="components-gcp-vista-recursos-sin-uso-clusters-gke-unusedgkecomponent-tsx"></a>
## `components/gcp/vista-recursos/sin-uso/clusters-gke/UnusedGkeComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedGkeComponent` `({ startDate, endDate, resourceId, regions, projects }: UnusedGkeComponentProps)` — Nodos GKE infrautilizados: adapta los filtros de la vista al contrato canónico (/api/gcp/unused/gke/*).

Interfaz `UnusedGkeComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `resourceId` | `string` | sí | — |
| `regions` | `string` | no | — |
| `projects` | `string` | no | — |

Internos:

- función `isSet` `(value: string | null | undefined, allValue: string): value is string`

- Usa: [`UnusedView.tsx`](../shared.md#components-shared-unused-unusedview-tsx), [`unusedConfigs.ts`](../shared.md#components-shared-unused-unusedconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewUnusedGkeComponent.tsx`](#components-gcp-vista-recursos-sin-uso-clusters-gke-mainviewunusedgkecomponent-tsx)

---

<a id="components-gcp-vista-recursos-sin-uso-compute-engine-mainviewunusedcecomponent-tsx"></a>
## `components/gcp/vista-recursos/sin-uso/compute-engine/MainViewUnusedCeComponent.tsx`

**Componente**

Exporta:

- componente `MainViewUnusedCeComponent` `()`

- Usa: [`UnusedCeComponent.tsx`](#components-gcp-vista-recursos-sin-uso-compute-engine-unusedcecomponent-tsx), [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-funciones-unused-resources-compute-engine-page-tsx)

---

<a id="components-gcp-vista-recursos-sin-uso-compute-engine-unusedcecomponent-tsx"></a>
## `components/gcp/vista-recursos/sin-uso/compute-engine/UnusedCeComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedCeComponent` `({ startDate, endDate, resourceId, regions, projects }: UnusedCeComponentProps)` — Instancias Compute Engine infrautilizadas: adapta los filtros de la vista al contrato canónico (/api/gcp/unused/compute-engine/*).

Interfaz `UnusedCeComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `resourceId` | `string` | sí | — |
| `regions` | `string` | no | — |
| `projects` | `string` | no | — |

Internos:

- función `isSet` `(value: string | null | undefined, allValue: string): value is string`

- Usa: [`UnusedView.tsx`](../shared.md#components-shared-unused-unusedview-tsx), [`unusedConfigs.ts`](../shared.md#components-shared-unused-unusedconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewAiFinopsMetricsComponent.tsx`](../ai-finops-metrics.md#components-ai-finops-metrics-mainviewaifinopsmetricscomponent-tsx), [`MainViewRecommenderComponent.tsx`](vista-recommender.md#components-gcp-vista-recommender-mainviewrecommendercomponent-tsx), [`MainViewUnusedCeComponent.tsx`](#components-gcp-vista-recursos-sin-uso-compute-engine-mainviewunusedcecomponent-tsx)

---

<a id="components-gcp-vista-recursos-sin-uso-compute-engine-table-unusedcecolumns-tsx"></a>
## `components/gcp/vista-recursos/sin-uso/compute-engine/table/UnusedCeColumns.tsx`

**Módulo (cliente)**

Exporta:

- interfaz `FlattenedCeRow` — Interfaz extendida para incluir los campos de ordenamiento calculados
- función `getUnusedCeColumns` `(totalGlobalCost: number): DynamicColumn<FlattenedCeRow>[]`

Interfaz `FlattenedCeRow` (exportada) — Interfaz extendida para incluir los campos de ordenamiento calculados:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sort_cpu` | `number` | no | — |
| `sort_net_inout_pps` | `number` | no | — |
| `sort_net_inout_throughput` | `number` | no | — |
| `sort_disk_inout_iops` | `number` | no | — |
| `sort_disk_inout_throughput` | `number` | no | — |
| `sort_billing` | `number` | no | — |

Internos:

- función `combineMetrics` `(metrics: UnusedCeTableDataMetric[] | undefined, keys: string[], nameLabel: string): UnusedCeTableDataMetric | undefined` — Función auxiliar para combinar métricas (ej. Ingress + Egress) en un objeto visual
- componente `SmartMetricCell` `({ metric, unit }: { metric?: UnusedCeTableDataMetric, unit: string })`
- componente `DetailsCell` `({ row }: { row: UnusedCeTableData })`
- componente `GetParameters` `()`

- Hooks: `useSearchParams`
- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts), [`HistoryModal.tsx`](../general_gcp.md#components-general-gcp-modal-historymodal-tsx), [`filters.ts`](../../lib.md#lib-filters-ts)

---

<a id="components-gcp-vista-recursos-sin-uso-discos-persistentes-discospersistentescomponent-tsx"></a>
## `components/gcp/vista-recursos/sin-uso/discos-persistentes/DiscosPersistentesComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `DiscosPersistentesComponent` `({ startDate, endDate, projects, regions, resourceId, tagKey, tagValue }: DiscosComponentProps)` — Discos persistentes sin uso: adapta los filtros de la vista al contrato canónico (/api/gcp/unused/persistent-disks/*).

Interfaz `DiscosComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `projects` | `string` | no | — |
| `regions` | `string` | no | — |
| `resourceId` | `string` | sí | — |
| `tagKey` | `string \| null` | sí | — |
| `tagValue` | `string \| null` | sí | — |

Internos:

- función `isSet` `(value: string | null | undefined, allValue: string): value is string`

- Usa: [`UnusedView.tsx`](../shared.md#components-shared-unused-unusedview-tsx), [`unusedConfigs.ts`](../shared.md#components-shared-unused-unusedconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewDiscosPersistentesComponent.tsx`](#components-gcp-vista-recursos-sin-uso-discos-persistentes-mainviewdiscospersistentescomponent-tsx)

---

<a id="components-gcp-vista-recursos-sin-uso-discos-persistentes-mainviewdiscospersistentescomponent-tsx"></a>
## `components/gcp/vista-recursos/sin-uso/discos-persistentes/MainViewDiscosPersistentesComponent.tsx`

**Componente**

Exporta:

- componente `MainViewDiscosPersistentesComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`DiscosPersistentesComponent.tsx`](#components-gcp-vista-recursos-sin-uso-discos-persistentes-discospersistentescomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-funciones-unused-resources-persistent-disks-page-tsx)

---

<a id="components-gcp-vista-recursos-sin-uso-filestore-filestoresinusocomponent-tsx"></a>
## `components/gcp/vista-recursos/sin-uso/filestore/FilestoreSinUsoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `FilestoreSinUsoComponent` `({ startDate, endDate, projects, regions, filestoreTier, tagKey, tagValue }: FilestoreSinUsoComponentProps)` — Filestore sin uso: adapta los filtros de la vista al contrato canónico (/api/gcp/unused/filestore/*).

Interfaz `FilestoreSinUsoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `projects` | `string` | no | — |
| `regions` | `string` | no | — |
| `filestoreTier` | `string` | sí | — |
| `tagKey` | `string \| null` | sí | — |
| `tagValue` | `string \| null` | sí | — |

Internos:

- función `isSet` `(value: string | null | undefined, allValue: string): value is string`

- Usa: [`UnusedView.tsx`](../shared.md#components-shared-unused-unusedview-tsx), [`unusedConfigs.ts`](../shared.md#components-shared-unused-unusedconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewFilestoreSinUsoComponent.tsx`](#components-gcp-vista-recursos-sin-uso-filestore-mainviewfilestoresinusocomponent-tsx)

---

<a id="components-gcp-vista-recursos-sin-uso-filestore-mainviewfilestoresinusocomponent-tsx"></a>
## `components/gcp/vista-recursos/sin-uso/filestore/MainViewFilestoreSinUsoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewFilestoreSinUsoComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`FilestoreSinUsoComponent.tsx`](#components-gcp-vista-recursos-sin-uso-filestore-filestoresinusocomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-funciones-unused-resources-filestore-page-tsx)

Notas de implementación:

- JSX — Contenedor del ícono estilizado

---

<a id="components-gcp-vista-recursos-sin-uso-instance-groups-mainviewunusedigcomponent-tsx"></a>
## `components/gcp/vista-recursos/sin-uso/instance-groups/MainViewUnusedIgComponent.tsx`

**Componente**

Exporta:

- componente `MainViewUnusedIgComponent` `()`

- Usa: [`UnusedIgComponent.tsx`](#components-gcp-vista-recursos-sin-uso-instance-groups-unusedigcomponent-tsx), [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-funciones-unused-resources-instance-groups-page-tsx)

---

<a id="components-gcp-vista-recursos-sin-uso-instance-groups-unusedigcomponent-tsx"></a>
## `components/gcp/vista-recursos/sin-uso/instance-groups/UnusedIgComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedIgComponent` `({ startDate, endDate, resourceId, regions, projects }: UnusedIgComponentProps)` — Instancias infrautilizadas de Instance Groups: adapta los filtros de la vista al contrato canónico (/api/gcp/unused/instance-groups/*).

Interfaz `UnusedIgComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `resourceId` | `string` | sí | — |
| `regions` | `string` | no | — |
| `projects` | `string` | no | — |

Internos:

- función `isSet` `(value: string | null | undefined, allValue: string): value is string`

- Usa: [`UnusedView.tsx`](../shared.md#components-shared-unused-unusedview-tsx), [`unusedConfigs.ts`](../shared.md#components-shared-unused-unusedconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewUnusedIgComponent.tsx`](#components-gcp-vista-recursos-sin-uso-instance-groups-mainviewunusedigcomponent-tsx)

