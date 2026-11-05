# Componentes `components/gcp/vista-consumos/`

[← Índice](../../README.md)

Vistas de consumo GCP (Compute Engine, instance groups, GKE, Cloud SQL, Filestore, Load Balancers, zonas DNS).

Archivos:

- [`components/gcp/vista-consumos/cloud-sql/CloudSQLComponent.tsx`](#components-gcp-vista-consumos-cloud-sql-cloudsqlcomponent-tsx)
- [`components/gcp/vista-consumos/cloud-sql/MainViewCloudSQLComponent.tsx`](#components-gcp-vista-consumos-cloud-sql-mainviewcloudsqlcomponent-tsx)
- [`components/gcp/vista-consumos/clusters-gke/ClusterGkeConsumeComponent.tsx`](#components-gcp-vista-consumos-clusters-gke-clustergkeconsumecomponent-tsx)
- [`components/gcp/vista-consumos/clusters-gke/MainViewClusterGkeConsumeComponent.tsx`](#components-gcp-vista-consumos-clusters-gke-mainviewclustergkeconsumecomponent-tsx)
- [`components/gcp/vista-consumos/compute-engine/ComputeEngineConsumeComponent.tsx`](#components-gcp-vista-consumos-compute-engine-computeengineconsumecomponent-tsx)
- [`components/gcp/vista-consumos/compute-engine/MainViewComputeEngineConsumeComponent.tsx`](#components-gcp-vista-consumos-compute-engine-mainviewcomputeengineconsumecomponent-tsx)
- [`components/gcp/vista-consumos/dns/zonas-consumo-estado/MainViewZonasDNSComponent.tsx`](#components-gcp-vista-consumos-dns-zonas-consumo-estado-mainviewzonasdnscomponent-tsx)
- [`components/gcp/vista-consumos/dns/zonas-consumo-estado/ZonasDNSComponent.tsx`](#components-gcp-vista-consumos-dns-zonas-consumo-estado-zonasdnscomponent-tsx)
- [`components/gcp/vista-consumos/dns/zonas-consumo-estado/graficos/ZonasDNSCharts.tsx`](#components-gcp-vista-consumos-dns-zonas-consumo-estado-graficos-zonasdnscharts-tsx)
- [`components/gcp/vista-consumos/dns/zonas-consumo-estado/info/ZonasDNSCardsComponent.tsx`](#components-gcp-vista-consumos-dns-zonas-consumo-estado-info-zonasdnscardscomponent-tsx)
- [`components/gcp/vista-consumos/dns/zonas-consumo-estado/tabla/ZonasDNSTable.tsx`](#components-gcp-vista-consumos-dns-zonas-consumo-estado-tabla-zonasdnstable-tsx)
- [`components/gcp/vista-consumos/filestore/FilestoreConsumeComponent.tsx`](#components-gcp-vista-consumos-filestore-filestoreconsumecomponent-tsx)
- [`components/gcp/vista-consumos/filestore/MainViewFilestoreConsumeComponent.tsx`](#components-gcp-vista-consumos-filestore-mainviewfilestoreconsumecomponent-tsx)
- [`components/gcp/vista-consumos/instance-groups/InstanceGroupConsumeComponent.tsx`](#components-gcp-vista-consumos-instance-groups-instancegroupconsumecomponent-tsx)
- [`components/gcp/vista-consumos/instance-groups/MainViewInstanceGroupConsumeComponent.tsx`](#components-gcp-vista-consumos-instance-groups-mainviewinstancegroupconsumecomponent-tsx)
- [`components/gcp/vista-consumos/load-balancers/consumo-uso/LoadBalancersComponent.tsx`](#components-gcp-vista-consumos-load-balancers-consumo-uso-loadbalancerscomponent-tsx)
- [`components/gcp/vista-consumos/load-balancers/consumo-uso/MainViewLoadBalancersComponent.tsx`](#components-gcp-vista-consumos-load-balancers-consumo-uso-mainviewloadbalancerscomponent-tsx)
- [`components/gcp/vista-consumos/load-balancers/consumo-uso/graficos/LoadBalancersCharts.tsx`](#components-gcp-vista-consumos-load-balancers-consumo-uso-graficos-loadbalancerscharts-tsx)
- [`components/gcp/vista-consumos/load-balancers/consumo-uso/info/LoadBalancersCardsComponent.tsx`](#components-gcp-vista-consumos-load-balancers-consumo-uso-info-loadbalancerscardscomponent-tsx)
- [`components/gcp/vista-consumos/load-balancers/consumo-uso/tabla/LoadBalancersTable.tsx`](#components-gcp-vista-consumos-load-balancers-consumo-uso-tabla-loadbalancerstable-tsx)

<a id="components-gcp-vista-consumos-cloud-sql-cloudsqlcomponent-tsx"></a>
## `components/gcp/vista-consumos/cloud-sql/CloudSQLComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `CloudSQLComponent` `({ startDate, endDate, projects, regions, databaseType, tagKey, tagValue }: CloudSQLComponentProps)` — Consumo Cloud SQL: adapta los filtros de la vista al contrato canónico (/api/gcp/consumption/cloud-sql/*).

Interfaz `CloudSQLComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `projects` | `string` | no | — |
| `regions` | `string` | no | — |
| `databaseType` | `string` | sí | — |
| `tagKey` | `string \| null` | sí | — |
| `tagValue` | `string \| null` | sí | — |

- Usa: [`ConsumptionView.tsx`](../shared.md#components-shared-consumption-consumptionview-tsx), [`consumptionConfigs.ts`](../shared.md#components-shared-consumption-consumptionconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewCloudSQLComponent.tsx`](#components-gcp-vista-consumos-cloud-sql-mainviewcloudsqlcomponent-tsx)

---

<a id="components-gcp-vista-consumos-cloud-sql-mainviewcloudsqlcomponent-tsx"></a>
## `components/gcp/vista-consumos/cloud-sql/MainViewCloudSQLComponent.tsx`

**Componente**

Exporta:

- componente `MainViewCloudSQLComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`CloudSQLComponent.tsx`](#components-gcp-vista-consumos-cloud-sql-cloudsqlcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-consumos-cloud-sql-page-tsx)

---

<a id="components-gcp-vista-consumos-clusters-gke-clustergkeconsumecomponent-tsx"></a>
## `components/gcp/vista-consumos/clusters-gke/ClusterGkeConsumeComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ClusterGkeConsumeComponent` `({ startDate, endDate, projects, regions, resourceId, tagKey, tagValue }: ClusterGkeConsumeComponentProps)` — Consumo Clusters GKE: adapta los filtros de la vista al contrato canónico (/api/gcp/consumption/gke/*).

Interfaz `ClusterGkeConsumeComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `projects` | `string` | no | — |
| `regions` | `string` | no | — |
| `resourceId` | `string` | sí | — |
| `tagKey` | `string \| null` | sí | — |
| `tagValue` | `string \| null` | sí | — |

- Usa: [`ConsumptionView.tsx`](../shared.md#components-shared-consumption-consumptionview-tsx), [`consumptionConfigs.ts`](../shared.md#components-shared-consumption-consumptionconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewClusterGkeConsumeComponent.tsx`](#components-gcp-vista-consumos-clusters-gke-mainviewclustergkeconsumecomponent-tsx)

---

<a id="components-gcp-vista-consumos-clusters-gke-mainviewclustergkeconsumecomponent-tsx"></a>
## `components/gcp/vista-consumos/clusters-gke/MainViewClusterGkeConsumeComponent.tsx`

**Componente**

Exporta:

- componente `MainViewClusterGkeConsumeComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`InstanceGroupConsumeComponent.tsx`](#components-gcp-vista-consumos-instance-groups-instancegroupconsumecomponent-tsx), [`ClusterGkeConsumeComponent.tsx`](#components-gcp-vista-consumos-clusters-gke-clustergkeconsumecomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-consumos-clusters-gke-page-tsx)

---

<a id="components-gcp-vista-consumos-compute-engine-computeengineconsumecomponent-tsx"></a>
## `components/gcp/vista-consumos/compute-engine/ComputeEngineConsumeComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ComputeEngineConsumeComponent` `({ startDate, endDate, projects, regions, resourceId, tagKey, tagValue }: ComputeEngineConsumeComponentProps)` — Consumo Compute Engine: adapta los filtros de la vista al contrato canónico (/api/gcp/consumption/compute-engine/*).

Interfaz `ComputeEngineConsumeComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `projects` | `string` | no | — |
| `regions` | `string` | no | — |
| `resourceId` | `string` | sí | — |
| `tagKey` | `string \| null` | sí | — |
| `tagValue` | `string \| null` | sí | — |

- Usa: [`ConsumptionView.tsx`](../shared.md#components-shared-consumption-consumptionview-tsx), [`consumptionConfigs.ts`](../shared.md#components-shared-consumption-consumptionconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewComputeEngineConsumeComponent.tsx`](#components-gcp-vista-consumos-compute-engine-mainviewcomputeengineconsumecomponent-tsx), [`MainViewInstanceGroupConsumeComponent.tsx`](#components-gcp-vista-consumos-instance-groups-mainviewinstancegroupconsumecomponent-tsx)

---

<a id="components-gcp-vista-consumos-compute-engine-mainviewcomputeengineconsumecomponent-tsx"></a>
## `components/gcp/vista-consumos/compute-engine/MainViewComputeEngineConsumeComponent.tsx`

**Componente**

Exporta:

- componente `MainViewComputeEngineConsumeComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`ComputeEngineConsumeComponent.tsx`](#components-gcp-vista-consumos-compute-engine-computeengineconsumecomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-consumos-compute-engine-page-tsx)

---

<a id="components-gcp-vista-consumos-dns-zonas-consumo-estado-mainviewzonasdnscomponent-tsx"></a>
## `components/gcp/vista-consumos/dns/zonas-consumo-estado/MainViewZonasDNSComponent.tsx`

**Componente**

Exporta:

- componente `MainViewZonasDNSComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`ZonasDNSComponent.tsx`](#components-gcp-vista-consumos-dns-zonas-consumo-estado-zonasdnscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-consumos-dns-zonas-consumo-estado-page-tsx)

---

<a id="components-gcp-vista-consumos-dns-zonas-consumo-estado-zonasdnscomponent-tsx"></a>
## `components/gcp/vista-consumos/dns/zonas-consumo-estado/ZonasDNSComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ZonasDNSComponent` `({ startDate, endDate, projects, estadoUso, tagKey, tagValue }: ZonasDNSComponentProps)`

Interfaz `ZonasDNSComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `projects` | `string` | no | — |
| `estadoUso` | `string` | sí | — |
| `tagKey` | `string \| null` | sí | — |
| `tagValue` | `string \| null` | sí | — |

- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`DataStateComponent.tsx`](../shared.md#components-shared-datastatecomponent-tsx), [`consumption.ts`](../../lib.md#lib-consumption-ts), [`consumption.ts`](../../tipos.md#interfaces-consumption-ts), [`ZonasDNSCardsComponent.tsx`](#components-gcp-vista-consumos-dns-zonas-consumo-estado-info-zonasdnscardscomponent-tsx), [`ZonasDNSCharts.tsx`](#components-gcp-vista-consumos-dns-zonas-consumo-estado-graficos-zonasdnscharts-tsx), [`ZonasDNSTable.tsx`](#components-gcp-vista-consumos-dns-zonas-consumo-estado-tabla-zonasdnstable-tsx)
- Usado por: [`MainViewZonasDNSComponent.tsx`](#components-gcp-vista-consumos-dns-zonas-consumo-estado-mainviewzonasdnscomponent-tsx)

---

<a id="components-gcp-vista-consumos-dns-zonas-consumo-estado-graficos-zonasdnscharts-tsx"></a>
## `components/gcp/vista-consumos/dns/zonas-consumo-estado/graficos/ZonasDNSCharts.tsx`

**Componente (cliente)**

Exporta:

- componente `ZonasDNSCharts` `({ data }: ZonasDNSChartsProps)`

Interfaz `ZonaDNS`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `name` | `string` | no | — |
| `dns_name` | `string` | no | — |
| `clasificacion_uso` | `string` | no | — |
| `queries_por_segundo` | `number` | no | — |

Interfaz `ZonasDNSChartsProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ZonaDNS[]` | no | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`ZonasDNSComponent.tsx`](#components-gcp-vista-consumos-dns-zonas-consumo-estado-zonasdnscomponent-tsx)

Notas de implementación:

- Gráfico 1: Top Zonas por Queries/Segundo (solo zonas activas)
- `names: sorted.map(z => z.name).reverse(),` — Reverso para que el mayor esté arriba
- Gráfico 2: Distribución por Clasificación (Dona)

---

<a id="components-gcp-vista-consumos-dns-zonas-consumo-estado-info-zonasdnscardscomponent-tsx"></a>
## `components/gcp/vista-consumos/dns/zonas-consumo-estado/info/ZonasDNSCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ZonasDNSCardsComponent` `({ summary }: { summary: ConsumptionSummary })`

- Usa: [`StatCard.tsx`](../shared.md#components-shared-statcard-tsx), [`format.ts`](../../lib.md#lib-format-ts), [`consumption.ts`](../../tipos.md#interfaces-consumption-ts)
- Usado por: [`ZonasDNSComponent.tsx`](#components-gcp-vista-consumos-dns-zonas-consumo-estado-zonasdnscomponent-tsx)

---

<a id="components-gcp-vista-consumos-dns-zonas-consumo-estado-tabla-zonasdnstable-tsx"></a>
## `components/gcp/vista-consumos/dns/zonas-consumo-estado/tabla/ZonasDNSTable.tsx`

**Componente (cliente)**

Exporta:

- componente `ZonasDNSTable` `({ data, dateFrom, dateTo }: ZonasDNSTableProps)`

Interfaz `ZonasDNSTableProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ConsumptionResource[]` | no | — |
| `dateFrom` | `Date` | no | — |
| `dateTo` | `Date` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`consumption.ts`](../../tipos.md#interfaces-consumption-ts)
- Usado por: [`ZonasDNSComponent.tsx`](#components-gcp-vista-consumos-dns-zonas-consumo-estado-zonasdnscomponent-tsx)

---

<a id="components-gcp-vista-consumos-filestore-filestoreconsumecomponent-tsx"></a>
## `components/gcp/vista-consumos/filestore/FilestoreConsumeComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `FilestoreConsumeComponent` `({ startDate, endDate, projects, regions, resourceId, tagKey, tagValue }: FilestoreConsumeComponentProps)` — Consumo Filestore: adapta los filtros de la vista al contrato canónico (/api/gcp/consumption/filestore/*).

Interfaz `FilestoreConsumeComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `projects` | `string` | no | — |
| `regions` | `string` | no | — |
| `resourceId` | `string` | sí | — |
| `tagKey` | `string \| null` | sí | — |
| `tagValue` | `string \| null` | sí | — |

- Usa: [`ConsumptionView.tsx`](../shared.md#components-shared-consumption-consumptionview-tsx), [`consumptionConfigs.ts`](../shared.md#components-shared-consumption-consumptionconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewFilestoreConsumeComponent.tsx`](#components-gcp-vista-consumos-filestore-mainviewfilestoreconsumecomponent-tsx)

---

<a id="components-gcp-vista-consumos-filestore-mainviewfilestoreconsumecomponent-tsx"></a>
## `components/gcp/vista-consumos/filestore/MainViewFilestoreConsumeComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewFilestoreConsumeComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`FilestoreConsumeComponent.tsx`](#components-gcp-vista-consumos-filestore-filestoreconsumecomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-consumos-filestore-page-tsx)

---

<a id="components-gcp-vista-consumos-instance-groups-instancegroupconsumecomponent-tsx"></a>
## `components/gcp/vista-consumos/instance-groups/InstanceGroupConsumeComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `InstanceGroupConsumeComponent` `({ startDate, endDate, projects, regions, resourceId, tagKey, tagValue }: InstanceGroupConsumeComponentProps)` — Consumo Instance Groups: adapta los filtros de la vista al contrato canónico (/api/gcp/consumption/instance-groups/*).

Interfaz `InstanceGroupConsumeComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `projects` | `string` | no | — |
| `regions` | `string` | no | — |
| `resourceId` | `string` | sí | — |
| `tagKey` | `string \| null` | sí | — |
| `tagValue` | `string \| null` | sí | — |

- Usa: [`ConsumptionView.tsx`](../shared.md#components-shared-consumption-consumptionview-tsx), [`consumptionConfigs.ts`](../shared.md#components-shared-consumption-consumptionconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewClusterGkeConsumeComponent.tsx`](#components-gcp-vista-consumos-clusters-gke-mainviewclustergkeconsumecomponent-tsx), [`MainViewInstanceGroupConsumeComponent.tsx`](#components-gcp-vista-consumos-instance-groups-mainviewinstancegroupconsumecomponent-tsx)

---

<a id="components-gcp-vista-consumos-instance-groups-mainviewinstancegroupconsumecomponent-tsx"></a>
## `components/gcp/vista-consumos/instance-groups/MainViewInstanceGroupConsumeComponent.tsx`

**Componente**

Exporta:

- componente `MainViewInstanceGroupConsumeComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`ComputeEngineConsumeComponent.tsx`](#components-gcp-vista-consumos-compute-engine-computeengineconsumecomponent-tsx), [`InstanceGroupConsumeComponent.tsx`](#components-gcp-vista-consumos-instance-groups-instancegroupconsumecomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-consumos-instances-group-page-tsx)

Notas de implementación:

- tagsFilter

---

<a id="components-gcp-vista-consumos-load-balancers-consumo-uso-loadbalancerscomponent-tsx"></a>
## `components/gcp/vista-consumos/load-balancers/consumo-uso/LoadBalancersComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `LoadBalancersComponent` `({ startDate, endDate, projects, regions, esquema, estadoUso }: LoadBalancersComponentProps)`

Interfaz `LoadBalancersComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `projects` | `string` | no | — |
| `regions` | `string` | no | — |
| `esquema` | `string` | sí | — |
| `estadoUso` | `string` | sí | — |

- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`DataStateComponent.tsx`](../shared.md#components-shared-datastatecomponent-tsx), [`consumption.ts`](../../lib.md#lib-consumption-ts), [`consumption.ts`](../../tipos.md#interfaces-consumption-ts), [`LoadBalancersCardsComponent.tsx`](#components-gcp-vista-consumos-load-balancers-consumo-uso-info-loadbalancerscardscomponent-tsx), [`LoadBalancersCharts.tsx`](#components-gcp-vista-consumos-load-balancers-consumo-uso-graficos-loadbalancerscharts-tsx), [`LoadBalancersTable.tsx`](#components-gcp-vista-consumos-load-balancers-consumo-uso-tabla-loadbalancerstable-tsx)
- Usado por: [`MainViewLoadBalancersComponent.tsx`](#components-gcp-vista-consumos-load-balancers-consumo-uso-mainviewloadbalancerscomponent-tsx)

---

<a id="components-gcp-vista-consumos-load-balancers-consumo-uso-mainviewloadbalancerscomponent-tsx"></a>
## `components/gcp/vista-consumos/load-balancers/consumo-uso/MainViewLoadBalancersComponent.tsx`

**Componente**

Exporta:

- componente `MainViewLoadBalancersComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`LoadBalancersComponent.tsx`](#components-gcp-vista-consumos-load-balancers-consumo-uso-loadbalancerscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-consumos-load-balancers-consumo-uso-page-tsx)

---

<a id="components-gcp-vista-consumos-load-balancers-consumo-uso-graficos-loadbalancerscharts-tsx"></a>
## `components/gcp/vista-consumos/load-balancers/consumo-uso/graficos/LoadBalancersCharts.tsx`

**Componente (cliente)**

Exporta:

- componente `LoadBalancersCharts` `({ data, porEsquema }: LoadBalancersChartsProps)`

Interfaz `LoadBalancer`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `name` | `string` | no | — |
| `region` | `string` | no | — |
| `loadBalancingScheme` | `string` | no | — |
| `requests_totales` | `number` | no | — |
| `clasificacion_trafico` | `string` | no | — |

Interfaz `LoadBalancersChartsProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `LoadBalancer[]` | no | — |
| `porEsquema` | `Record<string, number>` | no | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`LoadBalancersComponent.tsx`](#components-gcp-vista-consumos-load-balancers-consumo-uso-loadbalancerscomponent-tsx)

Notas de implementación:

- Gráfico 1: Top Load Balancers por Requests (solo activos)
- `names: sorted.map(lb => lb.name).reverse(),` — Reverso para que el mayor esté arriba
- Gráfico 2: Distribución por Load Balancing Scheme (Dona)

---

<a id="components-gcp-vista-consumos-load-balancers-consumo-uso-info-loadbalancerscardscomponent-tsx"></a>
## `components/gcp/vista-consumos/load-balancers/consumo-uso/info/LoadBalancersCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `LoadBalancersCardsComponent` `({ summary }: { summary: ConsumptionSummary })`

- Usa: [`StatCard.tsx`](../shared.md#components-shared-statcard-tsx), [`format.ts`](../../lib.md#lib-format-ts), [`consumption.ts`](../../tipos.md#interfaces-consumption-ts)
- Usado por: [`LoadBalancersComponent.tsx`](#components-gcp-vista-consumos-load-balancers-consumo-uso-loadbalancerscomponent-tsx)

---

<a id="components-gcp-vista-consumos-load-balancers-consumo-uso-tabla-loadbalancerstable-tsx"></a>
## `components/gcp/vista-consumos/load-balancers/consumo-uso/tabla/LoadBalancersTable.tsx`

**Componente (cliente)**

Exporta:

- componente `LoadBalancersTable` `({ data, dateFrom, dateTo }: LoadBalancersTableProps)`

Interfaz `LoadBalancersTableProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ConsumptionResource[]` | no | — |
| `dateFrom` | `Date` | no | — |
| `dateTo` | `Date` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`consumption.ts`](../../tipos.md#interfaces-consumption-ts)
- Usado por: [`LoadBalancersComponent.tsx`](#components-gcp-vista-consumos-load-balancers-consumo-uso-loadbalancerscomponent-tsx)

