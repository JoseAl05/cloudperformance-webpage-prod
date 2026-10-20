# Componentes `components/gcp/vista-funciones/`

[← Índice](../../README.md)

Funciones de GCP: horario hábil vs no hábil, IPs sin uso, subredes sin recursos, buckets, Filestore subutilizado, uso/costo por localización y spot vs estándar.

Archivos:

- [`components/gcp/vista-funciones/consumo-horario-habil-no-habil/cloud-sql/CloudSqlWorkingNonWorkingHoursComponent.tsx`](#components-gcp-vista-funciones-consumo-horario-habil-no-habil-cloud-sql-cloudsqlworkingnonworkinghourscomponent-tsx)
- [`components/gcp/vista-funciones/consumo-horario-habil-no-habil/cloud-sql/MainViewCloudSqlWorkingNonWorkingHoursComponent.tsx`](#components-gcp-vista-funciones-consumo-horario-habil-no-habil-cloud-sql-mainviewcloudsqlworkingnonworkinghourscomponent-tsx)
- [`components/gcp/vista-funciones/consumo-horario-habil-no-habil/cluster-gke/GkeWorkingNonWorkingHoursComponent.tsx`](#components-gcp-vista-funciones-consumo-horario-habil-no-habil-cluster-gke-gkeworkingnonworkinghourscomponent-tsx)
- [`components/gcp/vista-funciones/consumo-horario-habil-no-habil/cluster-gke/MainViewGkeWorkingNonWorkingHoursComponent.tsx`](#components-gcp-vista-funciones-consumo-horario-habil-no-habil-cluster-gke-mainviewgkeworkingnonworkinghourscomponent-tsx)
- [`components/gcp/vista-funciones/consumo-horario-habil-no-habil/compute-engine/CeWorkingNonWorkingHoursComponent.tsx`](#components-gcp-vista-funciones-consumo-horario-habil-no-habil-compute-engine-ceworkingnonworkinghourscomponent-tsx)
- [`components/gcp/vista-funciones/consumo-horario-habil-no-habil/compute-engine/MainViewCeWorkingNonWorkingHoursComponent.tsx`](#components-gcp-vista-funciones-consumo-horario-habil-no-habil-compute-engine-mainviewceworkingnonworkinghourscomponent-tsx)
- [`components/gcp/vista-funciones/consumo-horario-habil-no-habil/filestore/FsWorkingNonWorkingHoursComponent.tsx`](#components-gcp-vista-funciones-consumo-horario-habil-no-habil-filestore-fsworkingnonworkinghourscomponent-tsx)
- [`components/gcp/vista-funciones/consumo-horario-habil-no-habil/filestore/MainViewFilestoreWorkingHoursComponent.tsx`](#components-gcp-vista-funciones-consumo-horario-habil-no-habil-filestore-mainviewfilestoreworkinghourscomponent-tsx)
- [`components/gcp/vista-funciones/consumo-horario-habil-no-habil/instance-group/IgWorkingNonWorkingHoursComponent.tsx`](#components-gcp-vista-funciones-consumo-horario-habil-no-habil-instance-group-igworkingnonworkinghourscomponent-tsx)
- [`components/gcp/vista-funciones/consumo-horario-habil-no-habil/instance-group/MainViewIgWorkingNonWorkingHoursComponent.tsx`](#components-gcp-vista-funciones-consumo-horario-habil-no-habil-instance-group-mainviewigworkingnonworkinghourscomponent-tsx)
- [`components/gcp/vista-funciones/consumo-horario-habil-no-habil/table/WorkingNonWorkingHoursColumns.tsx`](#components-gcp-vista-funciones-consumo-horario-habil-no-habil-table-workingnonworkinghourscolumns-tsx)
- [`components/gcp/vista-funciones/networking/ips-sin-uso/IPsSinUsoComponent.tsx`](#components-gcp-vista-funciones-networking-ips-sin-uso-ipssinusocomponent-tsx)
- [`components/gcp/vista-funciones/networking/ips-sin-uso/MainViewIPsSinUsoComponent.tsx`](#components-gcp-vista-funciones-networking-ips-sin-uso-mainviewipssinusocomponent-tsx)
- [`components/gcp/vista-funciones/networking/subnets-sin-recursos/MainViewSubnetsSinRecursosComponent.tsx`](#components-gcp-vista-funciones-networking-subnets-sin-recursos-mainviewsubnetssinrecursoscomponent-tsx)
- [`components/gcp/vista-funciones/networking/subnets-sin-recursos/SubnetsSinRecursosComponent.tsx`](#components-gcp-vista-funciones-networking-subnets-sin-recursos-subnetssinrecursoscomponent-tsx)
- [`components/gcp/vista-funciones/networking/subnets-sin-recursos/graficos/SubnetsSinRecursosCharts.tsx`](#components-gcp-vista-funciones-networking-subnets-sin-recursos-graficos-subnetssinrecursoscharts-tsx)
- [`components/gcp/vista-funciones/networking/subnets-sin-recursos/info/SubnetsSinRecursosCardsComponent.tsx`](#components-gcp-vista-funciones-networking-subnets-sin-recursos-info-subnetssinrecursoscardscomponent-tsx)
- [`components/gcp/vista-funciones/networking/subnets-sin-recursos/tabla/SubnetsSinRecursosTable.tsx`](#components-gcp-vista-funciones-networking-subnets-sin-recursos-tabla-subnetssinrecursostable-tsx)
- [`components/gcp/vista-funciones/spot-vs-standard/MainViewSpotVsStandardComponent.tsx`](#components-gcp-vista-funciones-spot-vs-standard-mainviewspotvsstandardcomponent-tsx)
- [`components/gcp/vista-funciones/spot-vs-standard/SpotVsStandardComponent.tsx`](#components-gcp-vista-funciones-spot-vs-standard-spotvsstandardcomponent-tsx)
- [`components/gcp/vista-funciones/spot-vs-standard/graficos/SpotVsStandardChart.tsx`](#components-gcp-vista-funciones-spot-vs-standard-graficos-spotvsstandardchart-tsx)
- [`components/gcp/vista-funciones/spot-vs-standard/info/SpotVsStandardCardsComponent.tsx`](#components-gcp-vista-funciones-spot-vs-standard-info-spotvsstandardcardscomponent-tsx)
- [`components/gcp/vista-funciones/spot-vs-standard/table/SpotVsStandardTable.tsx`](#components-gcp-vista-funciones-spot-vs-standard-table-spotvsstandardtable-tsx)
- [`components/gcp/vista-funciones/top-facturacion-region/MainViewTopFacturacionPorRegionComponent.tsx`](#components-gcp-vista-funciones-top-facturacion-region-mainviewtopfacturacionporregioncomponent-tsx)
- [`components/gcp/vista-funciones/top-facturacion-region/TopFacturacionPorRegionComponent.tsx`](#components-gcp-vista-funciones-top-facturacion-region-topfacturacionporregioncomponent-tsx)
- [`components/gcp/vista-funciones/top-filestore-sub-utilizado/MainViewTopFilestoreSubUtilizadoComponent.tsx`](#components-gcp-vista-funciones-top-filestore-sub-utilizado-mainviewtopfilestoresubutilizadocomponent-tsx)
- [`components/gcp/vista-funciones/top-filestore-sub-utilizado/TopFilestoreSubUtilizadoComponent.tsx`](#components-gcp-vista-funciones-top-filestore-sub-utilizado-topfilestoresubutilizadocomponent-tsx)
- [`components/gcp/vista-funciones/top-filestore-sub-utilizado/graficos/TopFilestoreSubUtilizadoChart.tsx`](#components-gcp-vista-funciones-top-filestore-sub-utilizado-graficos-topfilestoresubutilizadochart-tsx)
- [`components/gcp/vista-funciones/top-filestore-sub-utilizado/graficos/TopFilestoreSubUtilizadoTendenciaChart.tsx`](#components-gcp-vista-funciones-top-filestore-sub-utilizado-graficos-topfilestoresubutilizadotendenciachart-tsx)
- [`components/gcp/vista-funciones/top-filestore-sub-utilizado/info/TopFilestoreSubUtilizadoCardsComponent.tsx`](#components-gcp-vista-funciones-top-filestore-sub-utilizado-info-topfilestoresubutilizadocardscomponent-tsx)
- [`components/gcp/vista-funciones/top-filestore-sub-utilizado/tabla/TopFilestoreSubUtilizadoSinMetricasTable.tsx`](#components-gcp-vista-funciones-top-filestore-sub-utilizado-tabla-topfilestoresubutilizadosinmetricastable-tsx)
- [`components/gcp/vista-funciones/top-storage-buckets/MainViewTopStorageBucketsComponent.tsx`](#components-gcp-vista-funciones-top-storage-buckets-mainviewtopstoragebucketscomponent-tsx)
- [`components/gcp/vista-funciones/top-storage-buckets/TopStorageBucketsComponent.tsx`](#components-gcp-vista-funciones-top-storage-buckets-topstoragebucketscomponent-tsx)
- [`components/gcp/vista-funciones/top-storage-buckets/graficos/TopStorageBucketsChart.tsx`](#components-gcp-vista-funciones-top-storage-buckets-graficos-topstoragebucketschart-tsx)
- [`components/gcp/vista-funciones/top-storage-buckets/graficos/TrendStorageLineChart.tsx`](#components-gcp-vista-funciones-top-storage-buckets-graficos-trendstoragelinechart-tsx)
- [`components/gcp/vista-funciones/top-storage-buckets/info/TopStorageBucketsCardsComponent.tsx`](#components-gcp-vista-funciones-top-storage-buckets-info-topstoragebucketscardscomponent-tsx)
- [`components/gcp/vista-funciones/top-storage-buckets/table/BucketsHistoricalTable.tsx`](#components-gcp-vista-funciones-top-storage-buckets-table-bucketshistoricaltable-tsx)
- [`components/gcp/vista-funciones/uso-costo-por-localizacion/MainViewUsedCostLocationComponent.tsx`](#components-gcp-vista-funciones-uso-costo-por-localizacion-mainviewusedcostlocationcomponent-tsx)
- [`components/gcp/vista-funciones/uso-costo-por-localizacion/UsedCostLocationComponent.tsx`](#components-gcp-vista-funciones-uso-costo-por-localizacion-usedcostlocationcomponent-tsx)
- [`components/gcp/vista-funciones/uso-costo-por-localizacion/graficos/AverageByLocationCardsGCPComponent.tsx`](#components-gcp-vista-funciones-uso-costo-por-localizacion-graficos-averagebylocationcardsgcpcomponent-tsx)
- [`components/gcp/vista-funciones/uso-costo-por-localizacion/graficos/AvgUsageByLocationComponent.tsx`](#components-gcp-vista-funciones-uso-costo-por-localizacion-graficos-avgusagebylocationcomponent-tsx)
- [`components/gcp/vista-funciones/uso-costo-por-localizacion/graficos/UsageCostLocationSummaryCards.tsx`](#components-gcp-vista-funciones-uso-costo-por-localizacion-graficos-usagecostlocationsummarycards-tsx)

<a id="components-gcp-vista-funciones-consumo-horario-habil-no-habil-cloud-sql-cloudsqlworkingnonworkinghourscomponent-tsx"></a>
## `components/gcp/vista-funciones/consumo-horario-habil-no-habil/cloud-sql/CloudSqlWorkingNonWorkingHoursComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `CloudSqlWorkingNonWorkingHoursComponent` `({ startDate, endDate, projects, resourceId, tagKey, tagValue, dbEngine, }: CloudSqlWorkingNonWorkingHoursComponentProps)` — Horario hábil vs no hábil Cloud SQL: adapta los filtros de la vista al contrato canónico (/api/gcp/working-hours/cloud-sql/*).

Interfaz `CloudSqlWorkingNonWorkingHoursComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `resourceId` | `string` | sí | — |
| `regions` | `string` | no | — |
| `projects` | `string` | no | — |
| `tagKey` | `string \| null` | sí | — |
| `tagValue` | `string \| null` | sí | — |
| `dbEngine` | `string` | sí | Motor de la vista ('mysql' \| 'postgres' \| 'sqlserver'): define el enlace a la vista del recurso. |

- Usa: [`WorkingHoursView.tsx`](../shared.md#components-shared-working-hours-workinghoursview-tsx), [`workingHoursConfigs.ts`](../shared.md#components-shared-working-hours-workinghoursconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewCloudSqlWorkingNonWorkingHoursComponent.tsx`](#components-gcp-vista-funciones-consumo-horario-habil-no-habil-cloud-sql-mainviewcloudsqlworkingnonworkinghourscomponent-tsx)

---

<a id="components-gcp-vista-funciones-consumo-horario-habil-no-habil-cloud-sql-mainviewcloudsqlworkingnonworkinghourscomponent-tsx"></a>
## `components/gcp/vista-funciones/consumo-horario-habil-no-habil/cloud-sql/MainViewCloudSqlWorkingNonWorkingHoursComponent.tsx`

**Componente**

Exporta:

- componente `MainViewCloudSqlWorkingNonWorkingHoursComponent` `({ db_engine }: { db_engine: string })`

- Usa: [`CloudSqlWorkingNonWorkingHoursComponent.tsx`](#components-gcp-vista-funciones-consumo-horario-habil-no-habil-cloud-sql-cloudsqlworkingnonworkinghourscomponent-tsx), [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-funciones-uso-horario-habil-no-habil-cloud-sql-mysql-page-tsx), [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-funciones-uso-horario-habil-no-habil-cloud-sql-postgresql-page-tsx), [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-funciones-uso-horario-habil-no-habil-cloud-sql-sqlserver-page-tsx)

---

<a id="components-gcp-vista-funciones-consumo-horario-habil-no-habil-cluster-gke-gkeworkingnonworkinghourscomponent-tsx"></a>
## `components/gcp/vista-funciones/consumo-horario-habil-no-habil/cluster-gke/GkeWorkingNonWorkingHoursComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `GkeWorkingNonWorkingHoursComponent` `({ startDate, endDate, resourceId }: GkeWorkingNonWorkingHoursComponentProps)` — Horario hábil vs no hábil Clusters GKE: adapta los filtros de la vista al contrato canónico (/api/gcp/working-hours/gke/*).

Interfaz `GkeWorkingNonWorkingHoursComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `resourceId` | `string` | sí | — |
| `regions` | `string` | no | — |
| `projects` | `string` | no | — |

- Usa: [`WorkingHoursView.tsx`](../shared.md#components-shared-working-hours-workinghoursview-tsx), [`workingHoursConfigs.ts`](../shared.md#components-shared-working-hours-workinghoursconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewGkeWorkingNonWorkingHoursComponent.tsx`](#components-gcp-vista-funciones-consumo-horario-habil-no-habil-cluster-gke-mainviewgkeworkingnonworkinghourscomponent-tsx)

---

<a id="components-gcp-vista-funciones-consumo-horario-habil-no-habil-cluster-gke-mainviewgkeworkingnonworkinghourscomponent-tsx"></a>
## `components/gcp/vista-funciones/consumo-horario-habil-no-habil/cluster-gke/MainViewGkeWorkingNonWorkingHoursComponent.tsx`

**Componente**

Exporta:

- componente `MainViewGkeWorkingNonWorkingHoursComponent` `()`

- Usa: [`GkeWorkingNonWorkingHoursComponent.tsx`](#components-gcp-vista-funciones-consumo-horario-habil-no-habil-cluster-gke-gkeworkingnonworkinghourscomponent-tsx), [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-funciones-uso-horario-habil-no-habil-cluster-gke-page-tsx)

---

<a id="components-gcp-vista-funciones-consumo-horario-habil-no-habil-compute-engine-ceworkingnonworkinghourscomponent-tsx"></a>
## `components/gcp/vista-funciones/consumo-horario-habil-no-habil/compute-engine/CeWorkingNonWorkingHoursComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `CeWorkingNonWorkingHoursComponent` `({ startDate, endDate, resourceId }: CeWorkingNonWorkingHoursComponentProps)` — Horario hábil vs no hábil Compute Engine: adapta los filtros de la vista al contrato canónico (/api/gcp/working-hours/compute-engine/*).

Interfaz `CeWorkingNonWorkingHoursComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `resourceId` | `string` | sí | — |
| `regions` | `string` | no | — |
| `projects` | `string` | no | — |

- Usa: [`WorkingHoursView.tsx`](../shared.md#components-shared-working-hours-workinghoursview-tsx), [`workingHoursConfigs.ts`](../shared.md#components-shared-working-hours-workinghoursconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewCeWorkingNonWorkingHoursComponent.tsx`](#components-gcp-vista-funciones-consumo-horario-habil-no-habil-compute-engine-mainviewceworkingnonworkinghourscomponent-tsx)

---

<a id="components-gcp-vista-funciones-consumo-horario-habil-no-habil-compute-engine-mainviewceworkingnonworkinghourscomponent-tsx"></a>
## `components/gcp/vista-funciones/consumo-horario-habil-no-habil/compute-engine/MainViewCeWorkingNonWorkingHoursComponent.tsx`

**Componente**

Exporta:

- componente `MainViewCeWorkingNonWorkingHoursComponent` `()`

- Usa: [`CeWorkingNonWorkingHoursComponent.tsx`](#components-gcp-vista-funciones-consumo-horario-habil-no-habil-compute-engine-ceworkingnonworkinghourscomponent-tsx), [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-funciones-uso-horario-habil-no-habil-compute-engines-page-tsx)

---

<a id="components-gcp-vista-funciones-consumo-horario-habil-no-habil-filestore-fsworkingnonworkinghourscomponent-tsx"></a>
## `components/gcp/vista-funciones/consumo-horario-habil-no-habil/filestore/FsWorkingNonWorkingHoursComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `FilestoreWorkingNonWorkingHoursComponent` `({ startDate, endDate, resourceId }: FilestoreWorkingNonWorkingHoursComponentProps)` — Horario hábil vs no hábil Filestore: adapta los filtros de la vista al contrato canónico (/api/gcp/working-hours/filestore/*).

Interfaz `FilestoreWorkingNonWorkingHoursComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `resourceId` | `string` | sí | — |
| `regions` | `string` | no | — |
| `projects` | `string` | no | — |

- Usa: [`WorkingHoursView.tsx`](../shared.md#components-shared-working-hours-workinghoursview-tsx), [`workingHoursConfigs.ts`](../shared.md#components-shared-working-hours-workinghoursconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewFilestoreWorkingHoursComponent.tsx`](#components-gcp-vista-funciones-consumo-horario-habil-no-habil-filestore-mainviewfilestoreworkinghourscomponent-tsx)

---

<a id="components-gcp-vista-funciones-consumo-horario-habil-no-habil-filestore-mainviewfilestoreworkinghourscomponent-tsx"></a>
## `components/gcp/vista-funciones/consumo-horario-habil-no-habil/filestore/MainViewFilestoreWorkingHoursComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewFilestoreWorkingHoursComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`FsWorkingNonWorkingHoursComponent.tsx`](#components-gcp-vista-funciones-consumo-horario-habil-no-habil-filestore-fsworkingnonworkinghourscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-funciones-uso-horario-habil-no-habil-filestore-page-tsx)

---

<a id="components-gcp-vista-funciones-consumo-horario-habil-no-habil-instance-group-igworkingnonworkinghourscomponent-tsx"></a>
## `components/gcp/vista-funciones/consumo-horario-habil-no-habil/instance-group/IgWorkingNonWorkingHoursComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `IgWorkingNonWorkingHoursComponent` `({ startDate, endDate, resourceId }: IgWorkingNonWorkingHoursComponentProps)` — Horario hábil vs no hábil Instance Groups: adapta los filtros de la vista al contrato canónico (/api/gcp/working-hours/instance-groups/*).

Interfaz `IgWorkingNonWorkingHoursComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `resourceId` | `string` | sí | — |
| `regions` | `string` | no | — |
| `projects` | `string` | no | — |

- Usa: [`WorkingHoursView.tsx`](../shared.md#components-shared-working-hours-workinghoursview-tsx), [`workingHoursConfigs.ts`](../shared.md#components-shared-working-hours-workinghoursconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewIgWorkingNonWorkingHoursComponent.tsx`](#components-gcp-vista-funciones-consumo-horario-habil-no-habil-instance-group-mainviewigworkingnonworkinghourscomponent-tsx)

---

<a id="components-gcp-vista-funciones-consumo-horario-habil-no-habil-instance-group-mainviewigworkingnonworkinghourscomponent-tsx"></a>
## `components/gcp/vista-funciones/consumo-horario-habil-no-habil/instance-group/MainViewIgWorkingNonWorkingHoursComponent.tsx`

**Componente**

Exporta:

- componente `MainViewIgWorkingNonWorkingHoursComponent` `()`

- Usa: [`IgWorkingNonWorkingHoursComponent.tsx`](#components-gcp-vista-funciones-consumo-horario-habil-no-habil-instance-group-igworkingnonworkinghourscomponent-tsx), [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-funciones-uso-horario-habil-no-habil-instance-group-page-tsx)

---

<a id="components-gcp-vista-funciones-consumo-horario-habil-no-habil-table-workingnonworkinghourscolumns-tsx"></a>
## `components/gcp/vista-funciones/consumo-horario-habil-no-habil/table/WorkingNonWorkingHoursColumns.tsx`

**Módulo (cliente)**

'use client'

return {
startDateParam,
endDateParam,
projectParam,
regionParam,
pathname
}
}

Exporta:

- función `getMetricFormat` `(metricName: string): 'percent' | 'bytes' | 'number'`
- función `formatMetricName` `(name: string): string`
- función `getWorkingNonWorkingColumns` `(uniqueMetrics: string[], maxValues: Record<string, number>): DynamicColumn<WorkingNonWorkingHoursUsageSummaryByResource>[]`

Interfaz `DualMetricCellProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `row` | `WorkingNonWorkingHoursUsageSummaryByResource` | no | — |
| `metricName` | `string` | no | — |
| `maxVal` | `number` | no | — |
| `format` | `'percent' \| 'bytes' \| 'number'` | no | — |

Internos:

- función `findMetric` `(metrics: WorkingNonWorkingHoursUsageSummaryByResourceMetrics[], metricName: string, schedule: string)`
- función `getMetricTrend` `(row: WorkingNonWorkingHoursUsageSummaryByResource, metricName: string)` — Esta función se mantiene para el uso en GeneralTrendCell, pero ya no se usa para determinar la visualización individual en DualMetricCell.
- componente `DualMetricCell` `({ row, metricName, maxVal, format }: DualMetricCellProps)`
- componente `GeneralTrendCell` `({ row }: { row: WorkingNonWorkingHoursUsageSummaryByResource })`
- componente `DetailsCell` `({ row }: { row: WorkingNonWorkingHoursUsageSummaryByResource })`
- componente `GetParameters` `()`

- Hooks: `usePathname`, `useSearchParams`
- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`HistoryModal.tsx`](../general_gcp.md#components-general-gcp-modal-historymodal-tsx), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts), [`filters.ts`](../../lib.md#lib-filters-ts)

Notas de implementación:

- _DualMetricCell_: Función de formateo
- _DualMetricCell_: 1. Obtenemos los valores visuales exactos
- _DualMetricCell_: 2. Calculamos la tendencia basándonos en lo que ve el usuario (post-redondeo)
- _DualMetricCell_: Solo si visualmente son distintos, miramos los datos crudos para ver quién gana
- _DualMetricCell_: JSX — Opcional: Espacio vacío o indicador de balanceado si son iguales

---

<a id="components-gcp-vista-funciones-networking-ips-sin-uso-ipssinusocomponent-tsx"></a>
## `components/gcp/vista-funciones/networking/ips-sin-uso/IPsSinUsoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `IPsSinUsoComponent` `({ startDate, endDate, projects, regions }: IPsSinUsoComponentProps)` — IPs sin uso: adapta los filtros de la vista al contrato canónico (/api/gcp/unused/ips/*). La API de IPs no filtra por tags (`tagKey` / `tagValue` se reciben del filtro pero no se envían).

Interfaz `IPsSinUsoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `projects` | `string` | no | — |
| `regions` | `string` | no | — |
| `tagKey` | `string \| null` | sí | — |
| `tagValue` | `string \| null` | sí | — |

Internos:

- función `isSet` `(value: string | null | undefined, allValue: string): value is string`

- Usa: [`UnusedView.tsx`](../shared.md#components-shared-unused-unusedview-tsx), [`unusedConfigs.ts`](../shared.md#components-shared-unused-unusedconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewIPsSinUsoComponent.tsx`](#components-gcp-vista-funciones-networking-ips-sin-uso-mainviewipssinusocomponent-tsx)

---

<a id="components-gcp-vista-funciones-networking-ips-sin-uso-mainviewipssinusocomponent-tsx"></a>
## `components/gcp/vista-funciones/networking/ips-sin-uso/MainViewIPsSinUsoComponent.tsx`

**Componente**

Exporta:

- componente `MainViewIPsSinUsoComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`IPsSinUsoComponent.tsx`](#components-gcp-vista-funciones-networking-ips-sin-uso-ipssinusocomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-funciones-networking-ips-sin-uso-page-tsx)

---

<a id="components-gcp-vista-funciones-networking-subnets-sin-recursos-mainviewsubnetssinrecursoscomponent-tsx"></a>
## `components/gcp/vista-funciones/networking/subnets-sin-recursos/MainViewSubnetsSinRecursosComponent.tsx`

**Componente**

Exporta:

- componente `MainViewSubnetsSinRecursosComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`SubnetsSinRecursosComponent.tsx`](#components-gcp-vista-funciones-networking-subnets-sin-recursos-subnetssinrecursoscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-funciones-networking-subnets-sin-recursos-page-tsx)

---

<a id="components-gcp-vista-funciones-networking-subnets-sin-recursos-subnetssinrecursoscomponent-tsx"></a>
## `components/gcp/vista-funciones/networking/subnets-sin-recursos/SubnetsSinRecursosComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `SubnetsSinRecursosComponent` `({ startDate, endDate, projects, regions, tagKey, tagValue }: SubnetsSinRecursosComponentProps)`

Interfaz `SubnetsSinRecursosResponse` — Respuesta de la API, tipada desde las props de los componentes que la consumen:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resumen` | `ComponentProps<typeof SubnetsSinRecursosCardsComponent>['summary'] & …` | sí | — |
| `subnets_sin_recursos` | `Array<NonNullable<ComponentProps<typeof SubnetsSinRecursosTable>['dat…` | sí | — |

Interfaz `SubnetsSinRecursosComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `projects` | `string` | no | — |
| `regions` | `string` | no | — |
| `tagKey` | `string \| null` | sí | — |
| `tagValue` | `string \| null` | sí | — |

- API: `/api/gcp/bridge/gcp/networking/subnets_sin_recursos`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`SubnetsSinRecursosCardsComponent.tsx`](#components-gcp-vista-funciones-networking-subnets-sin-recursos-info-subnetssinrecursoscardscomponent-tsx), [`SubnetsSinRecursosCharts.tsx`](#components-gcp-vista-funciones-networking-subnets-sin-recursos-graficos-subnetssinrecursoscharts-tsx), [`SubnetsSinRecursosTable.tsx`](#components-gcp-vista-funciones-networking-subnets-sin-recursos-tabla-subnetssinrecursostable-tsx)
- Usado por: [`MainViewSubnetsSinRecursosComponent.tsx`](#components-gcp-vista-funciones-networking-subnets-sin-recursos-mainviewsubnetssinrecursoscomponent-tsx)

Notas de implementación:

- JSX — Cards
- JSX — Gráficos
- JSX — Tabla
- JSX — TRABAJANDO

---

<a id="components-gcp-vista-funciones-networking-subnets-sin-recursos-graficos-subnetssinrecursoscharts-tsx"></a>
## `components/gcp/vista-funciones/networking/subnets-sin-recursos/graficos/SubnetsSinRecursosCharts.tsx`

**Componente (cliente)**

Exporta:

- componente `SubnetsSinRecursosCharts` `({ data, porRegion, porPurpose }: SubnetsSinRecursosChartsProps)`

Interfaz `Subnet`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `name` | `string` | no | — |
| `region` | `string` | no | — |
| `ip_cidr_range` | `string` | no | — |
| `purpose` | `string` | no | — |

Interfaz `SubnetsSinRecursosChartsProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `Subnet[]` | no | — |
| `porRegion` | `Record<string, number>` | no | — |
| `porPurpose` | `Record<string, number>` | no | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`SubnetsSinRecursosComponent.tsx`](#components-gcp-vista-funciones-networking-subnets-sin-recursos-subnetssinrecursoscomponent-tsx)

Notas de implementación:

- Gráfico 1: Top regiones con IPs desperdiciadas (barras horizontales)
- Ordenar regiones por cantidad y tomar top 10
- `const ipsWasted = sortedRegions.map(([,count]) => count * 4…` — Cada subnet /20 = 4096 IPs
- `return { regions: regions.reverse(), ipsWasted: ipsWasted.r…` — Reverso para que el mayor esté arriba
- toolbox: { show: false  // ← AGREGAR esta línea al inicio },
- Gráfico 2: Distribución por Purpose (gráfico de dona)
- `center: ['50%', '55%'],` — bajar grafico 55%
- `dataZoom: undefined,` — ← quita el zoom
- `xAxis: undefined,` — ← quita el zoom
- `yAxis: undefined,` — ← quita el zoom

---

<a id="components-gcp-vista-funciones-networking-subnets-sin-recursos-info-subnetssinrecursoscardscomponent-tsx"></a>
## `components/gcp/vista-funciones/networking/subnets-sin-recursos/info/SubnetsSinRecursosCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `SubnetsSinRecursosCardsComponent` `({ summary, subnets = [], isLoading }: SubnetsSinRecursosCardsProps)`

Interfaz `SubnetsResumen`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `total_subnets_sin_recursos` | `number` | no | — |
| `con_secondary_ranges` | `number` | no | — |
| `con_flow_logs_habilitados` | `number` | no | — |
| `por_network` | `Record<string, number>` | no | — |
| `por_region` | `Record<string, number>` | no | — |
| `por_purpose` | `Record<string, number>` | no | — |

Interfaz `SubnetsSinRecursosCardsProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `summary` | `SubnetsResumen` | sí | — |
| `subnets` | `unknown[]` | sí | — |
| `isLoading` | `boolean` | no | — |

Internos:

- componente `StatCard` `({ title, value, unit, icon: Icon, description, subtitle, colorClass = "blue", warning = false }: unknown)`
- función `calcularIPsDesdeSubnets` `(subnets: unknown[]): number` — Función para calcular IPs desde CIDR

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx)
- Usado por: [`SubnetsSinRecursosComponent.tsx`](#components-gcp-vista-funciones-networking-subnets-sin-recursos-subnetssinrecursoscomponent-tsx)

Notas de implementación:

- 🟢 CÁLCULO CORRECTO usando los datos reales
- `}, [summary, subnets]);` — ← Agregar 'subnets' a las dependencias

---

<a id="components-gcp-vista-funciones-networking-subnets-sin-recursos-tabla-subnetssinrecursostable-tsx"></a>
## `components/gcp/vista-funciones/networking/subnets-sin-recursos/tabla/SubnetsSinRecursosTable.tsx`

**Componente (cliente)**

Exporta:

- componente `SubnetsSinRecursosTable` `({ data, dateFrom, dateTo }: SubnetsSinRecursosTableProps)`

Interfaz `Subnet`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `name` | `string` | no | — |
| `region` | `string` | no | — |
| `network` | `string` | no | — |
| `ip_cidr_range` | `string` | no | — |
| `purpose` | `string` | no | — |
| `state` | `string` | no | — |
| `has_secondary_ranges` | `boolean` | no | — |
| `enable_flow_logs` | `boolean` | no | — |
| `dias_desde_creacion` | `number` | no | — |
| `sync_time` | `{ $date: string }` | no | — |

Interfaz `SubnetsSinRecursosTableProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `Subnet[]` | no | — |
| `dateFrom` | `Date` | no | — |
| `dateTo` | `Date` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx)
- Usado por: [`SubnetsSinRecursosComponent.tsx`](#components-gcp-vista-funciones-networking-subnets-sin-recursos-subnetssinrecursoscomponent-tsx)

Notas de implementación:

- Calcular IPs disponibles desde CIDR

---

<a id="components-gcp-vista-funciones-spot-vs-standard-mainviewspotvsstandardcomponent-tsx"></a>
## `components/gcp/vista-funciones/spot-vs-standard/MainViewSpotVsStandardComponent.tsx`

**Componente**

Exporta:

- componente `MainViewSpotVsStandardComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`SpotVsStandardComponent.tsx`](#components-gcp-vista-funciones-spot-vs-standard-spotvsstandardcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-funciones-spot-vs-standard-vm-page-tsx)

---

<a id="components-gcp-vista-funciones-spot-vs-standard-spotvsstandardcomponent-tsx"></a>
## `components/gcp/vista-funciones/spot-vs-standard/SpotVsStandardComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `SpotVsStandardComponent` `({ startDate, endDate, projects, regions, tagKey, tagValue }: SpotVsStandardComponentProps)`

Interfaz `SpotVsStandardResponse` — Respuesta de la API, tipada desde las props de los componentes que la consumen:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resumen` | `ComponentProps<typeof SpotVsStandardCardsComponent>['summary']` | sí | — |
| `vms` | `Array<NonNullable<ComponentProps<typeof SpotVsStandardTable>['data']>…` | sí | — |

Interfaz `SpotVsStandardComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `projects` | `string` | no | — |
| `regions` | `string` | no | — |
| `tagKey` | `string \| null` | sí | — |
| `tagValue` | `string \| null` | sí | — |

- API: `/api/gcp/bridge/gcp/versus/spot_vs_standard_vms`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`SpotVsStandardCardsComponent.tsx`](#components-gcp-vista-funciones-spot-vs-standard-info-spotvsstandardcardscomponent-tsx), [`SpotVsStandardChart.tsx`](#components-gcp-vista-funciones-spot-vs-standard-graficos-spotvsstandardchart-tsx), [`SpotVsStandardTable.tsx`](#components-gcp-vista-funciones-spot-vs-standard-table-spotvsstandardtable-tsx)
- Usado por: [`MainViewSpotVsStandardComponent.tsx`](#components-gcp-vista-funciones-spot-vs-standard-mainviewspotvsstandardcomponent-tsx)

Notas de implementación:

- Estado: Sin proyecto seleccionado
- Estado: Cargando
- Estado: Error
- Estado: Sin datos
- JSX — Cards
- JSX — Gráfico
- JSX — Tabla expandible

---

<a id="components-gcp-vista-funciones-spot-vs-standard-graficos-spotvsstandardchart-tsx"></a>
## `components/gcp/vista-funciones/spot-vs-standard/graficos/SpotVsStandardChart.tsx`

**Componente (cliente)**

Exporta:

- componente `SpotVsStandardChart` `({ data }: SpotVsStandardChartProps)`

Interfaz `VM`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `tipo_vm` | `string` | no | — |

Interfaz `SpotVsStandardChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `VM[] \| null` | no | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`SpotVsStandardComponent.tsx`](#components-gcp-vista-funciones-spot-vs-standard-spotvsstandardcomponent-tsx)

Notas de implementación:

- Agrupar por fecha
- Convertir a arrays ordenados

---

<a id="components-gcp-vista-funciones-spot-vs-standard-info-spotvsstandardcardscomponent-tsx"></a>
## `components/gcp/vista-funciones/spot-vs-standard/info/SpotVsStandardCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `SpotVsStandardCardsComponent` `({ summary, vms = [], isLoading }: SpotVsStandardCardsProps)`

Interfaz `SpotResumen`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `total_vms` | `number` | no | — |
| `vms_standard` | `number` | no | — |
| `vms_spot` | `number` | no | — |
| `vms_preemptible` | `number` | no | — |
| `costo_total_standard` | `number` | no | — |
| `costo_total_spot` | `number` | no | — |
| `ahorro_potencial_total` | `number` | no | — |
| `candidatas_spot` | `number` | no | — |
| `precio_mensual_standard_total` | `number` | no | — |
| `precio_mensual_spot_total` | `number` | no | — |
| `currency` | `string` | no | — |

Interfaz `VM`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `tiene_billing` | `boolean` | no | — |
| `cost_in_usd` | `number` | no | — |

Interfaz `SpotVsStandardCardsProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `summary` | `SpotResumen` | sí | — |
| `vms` | `VM[]` | sí | — |
| `isLoading` | `boolean` | no | — |

Internos:

- componente `StatCard` `({ title, value, unit, icon: Icon, description, colorClass = "blue", warning = false, subtitle }: unknown)`

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx)
- Usado por: [`SpotVsStandardComponent.tsx`](#components-gcp-vista-funciones-spot-vs-standard-spotvsstandardcomponent-tsx)

---

<a id="components-gcp-vista-funciones-spot-vs-standard-table-spotvsstandardtable-tsx"></a>
## `components/gcp/vista-funciones/spot-vs-standard/table/SpotVsStandardTable.tsx`

**Componente (cliente)**

Exporta:

- componente `SpotVsStandardTable` `({ data, startDate, endDate }: SpotVsStandardTableProps)`

Interfaz `VM`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `name` | `string` | no | — |
| `tipo_vm` | `string` | no | — |
| `machine_type_simple` | `string` | no | — |
| `region` | `string` | no | — |
| `zona` | `string` | no | — |
| `status` | `string` | no | — |
| `labels` | `Record<string, string>` | sí | — |
| `es_candidata_spot` | `boolean` | no | — |
| `cost_in_usd` | `number` | no | — |
| `costo_por_hora` | `number` | no | — |
| `tiene_billing` | `boolean` | no | — |
| `sync_time` | `{ $date: string }` | no | — |

Interfaz `SpotVsStandardTableProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `VM[]` | no | — |
| `startDate` | `string` | sí | — |
| `endDate` | `string` | sí | — |

- Usa: [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx)
- Usado por: [`SpotVsStandardComponent.tsx`](#components-gcp-vista-funciones-spot-vs-standard-spotvsstandardcomponent-tsx)

Notas de implementación:

- Flatten data: cada fila es una VM con su fecha

---

<a id="components-gcp-vista-funciones-top-facturacion-region-mainviewtopfacturacionporregioncomponent-tsx"></a>
## `components/gcp/vista-funciones/top-facturacion-region/MainViewTopFacturacionPorRegionComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewTopFacturacionPorLocalizacionGCP` `({ startDate, endDate, projects, tagKey, tagValue }: TopDolaresRegionComponentProps)` — Top de facturación GCP por región: adaptador sobre la vista común (`/api/gcp/billing/top?dimension=region`).

Interfaz `TopDolaresRegionComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `projects` | `string` | no | — |
| `tagKey` | `string \| null` | no | — |
| `tagValue` | `string \| null` | no | — |

- Usa: [`TopBillingView.tsx`](../shared.md#components-shared-billing-topbillingview-tsx), [`billingConfigs.ts`](../shared.md#components-shared-billing-billingconfigs-ts)
- Usado por: [`TopFacturacionPorRegionComponent.tsx`](#components-gcp-vista-funciones-top-facturacion-region-topfacturacionporregioncomponent-tsx)

---

<a id="components-gcp-vista-funciones-top-facturacion-region-topfacturacionporregioncomponent-tsx"></a>
## `components/gcp/vista-funciones/top-facturacion-region/TopFacturacionPorRegionComponent.tsx`

**Componente**

Exporta:

- componente `TopFacturacionPorRegionComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`MainViewTopFacturacionPorRegionComponent.tsx`](#components-gcp-vista-funciones-top-facturacion-region-mainviewtopfacturacionporregioncomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-funciones-top-facturacion-region-page-tsx)

Notas de implementación:

- JSX — Header

---

<a id="components-gcp-vista-funciones-top-filestore-sub-utilizado-mainviewtopfilestoresubutilizadocomponent-tsx"></a>
## `components/gcp/vista-funciones/top-filestore-sub-utilizado/MainViewTopFilestoreSubUtilizadoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewTopFilestoreSubUtilizadoComponent` `()` — Ícono ideal para representar sub-utilización/ahorro

- Usa: [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`TopFilestoreSubUtilizadoComponent.tsx`](#components-gcp-vista-funciones-top-filestore-sub-utilizado-topfilestoresubutilizadocomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-funciones-top-filestore-sub-utilizado-page-tsx)

Notas de implementación:

- JSX — Contenedor del ícono - Usamos ambar/naranja para indicar alerta/optimización

---

<a id="components-gcp-vista-funciones-top-filestore-sub-utilizado-topfilestoresubutilizadocomponent-tsx"></a>
## `components/gcp/vista-funciones/top-filestore-sub-utilizado/TopFilestoreSubUtilizadoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `TopFilestoreSubUtilizadoComponent` `({ startDate, endDate, projects, regions, filestoreTier, tagKey, tagValue, }: TopFilestoreSubUtilizadoComponentProps)`

Interfaz `TopFilestoreSubUtilizadoResponse` — Respuesta de la API, tipada desde las props de los componentes que la consumen:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resumen` | `NonNullable<ComponentProps<typeof TopFilestoreSubUtilizadoCardsCompon…` | no | — |
| `top_sub_utilizados` | `Array<NonNullable<ComponentProps<typeof TopFilestoreSubUtilizadoChart…` | sí | — |
| `tendencias` | `Array<NonNullable<ComponentProps<typeof TopFilestoreSubUtilizadoTende…` | sí | — |
| `sin_metricas` | `Array<NonNullable<ComponentProps<typeof TopFilestoreSubUtilizadoSinMe…` | sí | — |

Interfaz `TopFilestoreSubUtilizadoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `projects` | `string` | no | — |
| `regions` | `string` | no | — |
| `filestoreTier` | `string` | sí | — |
| `tagKey` | `string \| null` | sí | — |
| `tagValue` | `string \| null` | sí | — |

- API: `/api/gcp/bridge/gcp/funcion/top_filestore_sub_utilizado`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`TopFilestoreSubUtilizadoCardsComponent.tsx`](#components-gcp-vista-funciones-top-filestore-sub-utilizado-info-topfilestoresubutilizadocardscomponent-tsx), [`TopFilestoreSubUtilizadoChart.tsx`](#components-gcp-vista-funciones-top-filestore-sub-utilizado-graficos-topfilestoresubutilizadochart-tsx), [`TopFilestoreSubUtilizadoTendenciaChart.tsx`](#components-gcp-vista-funciones-top-filestore-sub-utilizado-graficos-topfilestoresubutilizadotendenciachart-tsx), [`TopFilestoreSubUtilizadoSinMetricasTable.tsx`](#components-gcp-vista-funciones-top-filestore-sub-utilizado-tabla-topfilestoresubutilizadosinmetricastable-tsx)
- Usado por: [`MainViewTopFilestoreSubUtilizadoComponent.tsx`](#components-gcp-vista-funciones-top-filestore-sub-utilizado-mainviewtopfilestoresubutilizadocomponent-tsx)

Notas de implementación:

- Construcción de URL
- Top items del snapshot más reciente para los gráficos de barras
- Estado: Sin proyecto seleccionado
- Estado: Cargando
- Estado: Error
- Estado: Sin datos
- JSX — Cards resumen
- JSX — 2 Gráficos TOP en 2 columnas
- JSX — Gráficos de Tendencia (ancho completo)
- JSX — Tabla instancias sin métricas

---

<a id="components-gcp-vista-funciones-top-filestore-sub-utilizado-graficos-topfilestoresubutilizadochart-tsx"></a>
## `components/gcp/vista-funciones/top-filestore-sub-utilizado/graficos/TopFilestoreSubUtilizadoChart.tsx`

**Componente (cliente)**

Exporta:

- componente `TopFilestoreSubUtilizadoChart` `({ data, type }: TopFilestoreSubUtilizadoChartProps)`

Interfaz `FilestoreItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `name` | `string` | no | — |
| `desperdicio_gb` | `number` | no | — |
| `costo_desperdiciado` | `number` | no | — |
| `tier` | `string` | no | — |
| `recomendacion` | `string` | no | — |

Interfaz `TopFilestoreSubUtilizadoChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `FilestoreItem[]` | no | — |
| `type` | `'desperdicio_gb' \| 'costo_desperdiciado'` | no | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`select.tsx`](../ui.md#components-ui-select-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`TopFilestoreSubUtilizadoComponent.tsx`](#components-gcp-vista-funciones-top-filestore-sub-utilizado-topfilestoresubutilizadocomponent-tsx)

Notas de implementación:

- `color: '#f97316',` — naranja — desperdicio
- `color: '#ef4444',` — rojo — costo
- `const top = sorted.slice(0, limit).reverse();` — invertir: mayor arriba

---

<a id="components-gcp-vista-funciones-top-filestore-sub-utilizado-graficos-topfilestoresubutilizadotendenciachart-tsx"></a>
## `components/gcp/vista-funciones/top-filestore-sub-utilizado/graficos/TopFilestoreSubUtilizadoTendenciaChart.tsx`

**Componente (cliente)**

Exporta:

- componente `TopFilestoreSubUtilizadoTendenciaChart` `({ data, metric, title, yAxisLabel, }: TopFilestoreSubUtilizadoTendenciaChartProps)`

Interfaz `TendenciaItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `fecha` | `string` | no | — |
| `total_used_gb` | `number` | no | — |
| `total_unused_gb` | `number` | no | — |

Interfaz `TopFilestoreSubUtilizadoTendenciaChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `TendenciaItem[]` | no | — |
| `metric` | `'total_used_gb' \| 'total_unused_gb'` | no | — |
| `title` | `string` | no | — |
| `yAxisLabel` | `string` | no | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`TopFilestoreSubUtilizadoComponent.tsx`](#components-gcp-vista-funciones-top-filestore-sub-utilizado-topfilestoresubutilizadocomponent-tsx)

---

<a id="components-gcp-vista-funciones-top-filestore-sub-utilizado-info-topfilestoresubutilizadocardscomponent-tsx"></a>
## `components/gcp/vista-funciones/top-filestore-sub-utilizado/info/TopFilestoreSubUtilizadoCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `TopFilestoreSubUtilizadoCardsComponent` `({ resumen, isLoading, }: TopFilestoreSubUtilizadoCardsComponentProps)`

Interfaz `Resumen`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `total_analizados` | `number` | no | — |
| `sub_utilizados` | `number` | no | — |
| `sin_metricas` | `number` | no | — |
| `costo_total_mensual` | `number` | no | — |
| `costo_desperdiciado` | `number` | no | — |
| `ahorro_potencial_top` | `number` | no | — |
| `capacidad_total_gb` | `number` | no | — |
| `capacidad_usada_gb` | `number` | no | — |
| `capacidad_desperdiciada_gb` | `number` | no | — |
| `porcentaje_uso_promedio` | `number` | no | — |
| `currency` | `string` | no | — |

Interfaz `TopFilestoreSubUtilizadoCardsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resumen` | `Resumen` | no | — |
| `isLoading` | `boolean` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx)
- Usado por: [`TopFilestoreSubUtilizadoComponent.tsx`](#components-gcp-vista-funciones-top-filestore-sub-utilizado-topfilestoresubutilizadocomponent-tsx)

---

<a id="components-gcp-vista-funciones-top-filestore-sub-utilizado-tabla-topfilestoresubutilizadosinmetricastable-tsx"></a>
## `components/gcp/vista-funciones/top-filestore-sub-utilizado/tabla/TopFilestoreSubUtilizadoSinMetricasTable.tsx`

**Componente (cliente)**

Exporta:

- componente `TopFilestoreSubUtilizadoSinMetricasTable` `({ data, }: TopFilestoreSubUtilizadoSinMetricasTableProps)`

Interfaz `SinMetricasItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `name` | `string` | no | — |
| `project_id` | `string` | no | — |
| `location` | `string` | no | — |
| `tier` | `string` | no | — |
| `total_capacity_gb` | `number` | no | — |
| `state` | `string` | no | — |
| `creation_time` | `string` | no | — |
| `metrics_status` | `string` | no | — |

Interfaz `TopFilestoreSubUtilizadoSinMetricasTableProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `SinMetricasItem[]` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx)
- Usado por: [`TopFilestoreSubUtilizadoComponent.tsx`](#components-gcp-vista-funciones-top-filestore-sub-utilizado-topfilestoresubutilizadocomponent-tsx)

---

<a id="components-gcp-vista-funciones-top-storage-buckets-mainviewtopstoragebucketscomponent-tsx"></a>
## `components/gcp/vista-funciones/top-storage-buckets/MainViewTopStorageBucketsComponent.tsx`

**Componente**

Exporta:

- componente `MainViewTopStorageBucketsComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`TopStorageBucketsComponent.tsx`](#components-gcp-vista-funciones-top-storage-buckets-topstoragebucketscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-funciones-top-cloud-storage-buckets-page-tsx)

---

<a id="components-gcp-vista-funciones-top-storage-buckets-topstoragebucketscomponent-tsx"></a>
## `components/gcp/vista-funciones/top-storage-buckets/TopStorageBucketsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `TopStorageBucketsComponent` `({ startDate, endDate, projects, regions, storageClass, tagKey, tagValue }: TopStorageBucketsComponentProps)`

Interfaz `TopStorageBucketsResponse`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resumen` | `ComponentProps<typeof TopStorageBucketsCardsComponent>['summary']` | sí | — |
| `buckets` | `StorageBucket[]` | sí | — |

Interfaz `TopStorageBucketsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `projects` | `string` | no | — |
| `regions` | `string` | no | — |
| `storageClass` | `string` | no | — |
| `tagKey` | `string \| null` | sí | — |
| `tagValue` | `string \| null` | sí | — |

- Tipo interno `StorageBucket` = `NonNullable<ComponentProps<typeof BucketsHistoricalTable>['data']>[number] & NonNullable<ComponentProps<typeof TopStora…`
Internos:

- función `bucketDate` `(bucket: StorageBucket): string` — sync_time puede venir como {"$date": ...} o como string ISO

- API: `/api/gcp/bridge/gcp/funcion/cloud_storage_buckets`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`TopStorageBucketsCardsComponent.tsx`](#components-gcp-vista-funciones-top-storage-buckets-info-topstoragebucketscardscomponent-tsx), [`TopStorageBucketsChart.tsx`](#components-gcp-vista-funciones-top-storage-buckets-graficos-topstoragebucketschart-tsx), [`TrendStorageLineChart.tsx`](#components-gcp-vista-funciones-top-storage-buckets-graficos-trendstoragelinechart-tsx), [`BucketsHistoricalTable.tsx`](#components-gcp-vista-funciones-top-storage-buckets-table-bucketshistoricaltable-tsx)
- Usado por: [`MainViewTopStorageBucketsComponent.tsx`](#components-gcp-vista-funciones-top-storage-buckets-mainviewtopstoragebucketscomponent-tsx)

Notas de implementación:

- Construcción de URL
- Preparar datos para gráficos de tendencia
- DATOS PARA LOS TOP
- Obtener timestamp más reciente real
- Nos quedamos SOLO con buckets de ese último snapshot exacto
- Estado: Sin proyecto seleccionado
- Estado: Cargando
- Estado: Error
- Estado: Sin datos
- JSX — Cards
- JSX — 2 Gráficos TOP
- JSX — Gráficos de Tendencia
- JSX — TODO: Tabla

---

<a id="components-gcp-vista-funciones-top-storage-buckets-graficos-topstoragebucketschart-tsx"></a>
## `components/gcp/vista-funciones/top-storage-buckets/graficos/TopStorageBucketsChart.tsx`

**Componente (cliente)**

Exporta:

- componente `TopStorageBucketsChart` `({ data, type }: TopStorageBucketsChartProps)`

Interfaz `Bucket`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `name` | `string` | no | — |
| `object_count` | `number` | no | — |
| `tamano_gb` | `number` | no | — |

Interfaz `TopStorageBucketsChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `Bucket[]` | no | — |
| `type` | `'objects' \| 'size'` | no | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`select.tsx`](../ui.md#components-ui-select-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`TopStorageBucketsComponent.tsx`](#components-gcp-vista-funciones-top-storage-buckets-topstoragebucketscomponent-tsx)

Notas de implementación:

- Ordenar por valor descendente
- Tomar solo top N
- Invertir para que el mayor esté arriba

---

<a id="components-gcp-vista-funciones-top-storage-buckets-graficos-trendstoragelinechart-tsx"></a>
## `components/gcp/vista-funciones/top-storage-buckets/graficos/TrendStorageLineChart.tsx`

**Componente (cliente)**

Exporta:

- componente `TrendStorageLineChart` `({ data, metric, title, yAxisLabel, }: TrendStorageLineChartProps)`

Interfaz `TrendStorageLineChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `{ date: string object_count: number total_size_gb: number }[]` | no | — |
| `metric` | `'object_count' \| 'total_size_gb'` | no | — |
| `title` | `string` | no | — |
| `yAxisLabel` | `string` | no | — |

Internos:

- función `parseISO` `(s: string): Date`
- constante `fmt`
- constante `fmtFull`

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`TopStorageBucketsComponent.tsx`](#components-gcp-vista-funciones-top-storage-buckets-topstoragebucketscomponent-tsx)

---

<a id="components-gcp-vista-funciones-top-storage-buckets-info-topstoragebucketscardscomponent-tsx"></a>
## `components/gcp/vista-funciones/top-storage-buckets/info/TopStorageBucketsCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `TopStorageBucketsCardsComponent` `({ summary, buckets = [], isLoading }: TopStorageBucketsCardsProps)`

Interfaz `StorageResumen`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `total_buckets` | `number` | no | — |
| `total_size_gb` | `number` | no | — |
| `total_objects` | `number` | no | — |
| `costo_total_usd` | `number` | no | — |
| `ahorro_potencial_total` | `number` | no | — |
| `currency` | `string` | no | — |

Interfaz `TopStorageBucketsCardsProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `summary` | `StorageResumen` | sí | — |
| `buckets` | `unknown[]` | sí | — |
| `isLoading` | `boolean` | no | — |

Internos:

- componente `StatCard` `({ title, value, unit, icon: Icon, description, colorClass = "blue" }: unknown)`

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx)
- Usado por: [`TopStorageBucketsComponent.tsx`](#components-gcp-vista-funciones-top-storage-buckets-topstoragebucketscomponent-tsx)

Notas de implementación:

- JSX — 1. TAMAÑO TOTAL
- JSX — 2. TOTAL BUCKETS - Quitamos cualquier espacio extra
- `unit=""` — Forzamos unit vacío para evitar el "22"
- JSX — 3. TOTAL OBJETOS
- JSX — 4. COSTO TOTAL - Usando el costo_total_usd del JSON
- `value={`$${(summary.costo_total_usd || 0).toFixed(8)}`}` — Subimos a 8 decimales por tu JSON

---

<a id="components-gcp-vista-funciones-top-storage-buckets-table-bucketshistoricaltable-tsx"></a>
## `components/gcp/vista-funciones/top-storage-buckets/table/BucketsHistoricalTable.tsx`

**Componente (cliente)**

Exporta:

- componente `BucketsHistoricalTable` `({ data, startDate, endDate }: BucketsHistoricalTableProps)`

Interfaz `Bucket`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `name` | `string` | no | — |
| `storage_class` | `string` | no | — |
| `location` | `string` | no | — |
| `location_type` | `string` | no | — |
| `tamano_gb` | `number` | sí | — |
| `costo_total` | `number` | sí | — |
| `currency` | `string` | sí | — |
| `sin_uso` | `boolean` | sí | — |
| `has_lifecycle_rules` | `boolean` | sí | — |
| `recomendacion` | `string` | sí | — |
| `ahorro_potencial` | `number` | sí | — |
| `object_count` | `number` | sí | — |
| `sync_time` | `{ $date: string }` | no | — |

Interfaz `BucketsHistoricalTableProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `Bucket[]` | no | — |
| `startDate` | `string` | sí | — |
| `endDate` | `string` | sí | — |

- Usa: [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx)
- Usado por: [`TopStorageBucketsComponent.tsx`](#components-gcp-vista-funciones-top-storage-buckets-topstoragebucketscomponent-tsx)

---

<a id="components-gcp-vista-funciones-uso-costo-por-localizacion-mainviewusedcostlocationcomponent-tsx"></a>
## `components/gcp/vista-funciones/uso-costo-por-localizacion/MainViewUsedCostLocationComponent.tsx`

**Componente**

Exporta:

- componente `MainViewUsedCostLocationComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`UsedCostLocationComponent.tsx`](#components-gcp-vista-funciones-uso-costo-por-localizacion-usedcostlocationcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-funciones-uso-costo-por-localizacion-page-tsx)

---

<a id="components-gcp-vista-funciones-uso-costo-por-localizacion-usedcostlocationcomponent-tsx"></a>
## `components/gcp/vista-funciones/uso-costo-por-localizacion/UsedCostLocationComponent.tsx`

**Componente (cliente)**

FETCHER

Exporta:

- componente `UsedCostLocationComponent` `({ startDate, endDate, regions, projects, service, }: UsedCostLocationComponentProps)` — COMPONENTE

Interfaz `UsedCostLocationComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `regions` | `string` | no | — |
| `projects` | `string \| string[]` | sí | 👈 ahora acepta ambos |
| `service` | `string` | sí | — |

Interfaz `MetricaPromedio` — TIPOS API:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `promedio` | `number` | no | — |
| `minimo` | `number` | no | — |
| `maximo` | `number` | no | — |
| `muestras` | `number` | no | — |

Interfaz `RegionMetricas`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `region` | `string` | no | — |
| `total_recursos` | `number` | no | — |
| `total_muestras` | `number` | no | — |
| `metricas_promedio` | `Record<string, MetricaPromedio>` | no | — |

Interfaz `ApiResponse`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `servicio` | `string` | no | — |
| `servicio_display` | `string` | no | — |
| `resumen` | `{ total_regiones: number total_recursos: number total_muestras: numbe…` | no | — |
| `metricas_por_region` | `RegionMetricas[]` | no | — |
| `costos_por_region` | `unknown[]` | no | — |

- API: `/api/gcp/bridge/gcp/funcion/uso_costo_por_localizacion`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`LoaderComponent.tsx`](../general_gcp.md#components-general-gcp-loadercomponent-tsx), [`AvgUsageByLocationComponent.tsx`](#components-gcp-vista-funciones-uso-costo-por-localizacion-graficos-avgusagebylocationcomponent-tsx), [`UsageCostLocationSummaryCards.tsx`](#components-gcp-vista-funciones-uso-costo-por-localizacion-graficos-usagecostlocationsummarycards-tsx), [`AverageByLocationCardsGCPComponent.tsx`](#components-gcp-vista-funciones-uso-costo-por-localizacion-graficos-averagebylocationcardsgcpcomponent-tsx)
- Usado por: [`MainViewUsedCostLocationComponent.tsx`](#components-gcp-vista-funciones-uso-costo-por-localizacion-mainviewusedcostlocationcomponent-tsx)

Notas de implementación:

- JSX — 🧠 TÍTULO DE LA VISTA
- JSX — 🌍 1️⃣ RESUMEN GLOBAL (todas las regiones juntas)
- JSX — 📊 2️⃣ MÉTRICAS PROMEDIO POR REGIÓN (tabla interactiva)
- JSX — 🧩 3️⃣ TARJETAS DETALLE POR CADA REGIÓN

---

<a id="components-gcp-vista-funciones-uso-costo-por-localizacion-graficos-averagebylocationcardsgcpcomponent-tsx"></a>
## `components/gcp/vista-funciones/uso-costo-por-localizacion/graficos/AverageByLocationCardsGCPComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AverageByLocationCardsGCPComponent` `({ data }: Props)`

Interfaz `MetricaPromedio`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `promedio` | `number` | no | — |
| `minimo` | `number` | no | — |
| `maximo` | `number` | no | — |
| `muestras` | `number` | no | — |

Interfaz `RegionMetricas`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `region` | `string` | no | — |
| `total_recursos` | `number` | no | — |
| `total_muestras` | `number` | no | — |
| `metricas_promedio` | `Record<string, MetricaPromedio>` | no | — |

Interfaz `Props`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `RegionMetricas[]` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`utils.ts`](../../lib.md#lib-utils-ts)
- Usado por: [`UsedCostLocationComponent.tsx`](#components-gcp-vista-funciones-uso-costo-por-localizacion-usedcostlocationcomponent-tsx)

Notas de implementación:

- JSX — Región
- JSX — Recursos
- JSX — Métricas
- JSX — Muestras

---

<a id="components-gcp-vista-funciones-uso-costo-por-localizacion-graficos-avgusagebylocationcomponent-tsx"></a>
## `components/gcp/vista-funciones/uso-costo-por-localizacion/graficos/AvgUsageByLocationComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AvgUsageByLocationComponent` `({ data, isLoading, error }: Props)` — TABLA PRINCIPAL

Interfaz `MetricaPromedio` — TIPOS:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `promedio` | `number` | no | — |
| `minimo` | `number` | no | — |
| `maximo` | `number` | no | — |
| `muestras` | `number` | no | — |

Interfaz `RegionMetricas`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `region` | `string` | no | — |
| `total_recursos` | `number` | no | — |
| `total_muestras` | `number` | no | — |
| `metricas_promedio` | `Record<string, MetricaPromedio>` | no | — |

Interfaz `Props`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `RegionMetricas[]` | no | — |
| `isLoading` | `boolean` | no | — |
| `error` | `unknown` | no | — |

Internos:

- función `byAlpha` `(a: string, b: string)` — HELPERS
- función `formatMetricName` `(name: string)`
- constante `METRIC_UNITS`
- función `formatValue` `(metric: string, value: number)`
- función `isUnused` `(v?: number)`
- componente `MetricCellDialog` `({ region, metric, datum, }: { region: string metric: string datum: MetricaPromedio })` — CELDA CON DIALOG

- Usa: [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx), [`utils.ts`](../../lib.md#lib-utils-ts)
- Usado por: [`UsedCostLocationComponent.tsx`](#components-gcp-vista-funciones-uso-costo-por-localizacion-usedcostlocationcomponent-tsx)

---

<a id="components-gcp-vista-funciones-uso-costo-por-localizacion-graficos-usagecostlocationsummarycards-tsx"></a>
## `components/gcp/vista-funciones/uso-costo-por-localizacion/graficos/UsageCostLocationSummaryCards.tsx`

**Componente (cliente)**

Exporta:

- componente `UsageCostLocationSummaryCards` `({ resumen, isLoading }: Props)`

Interfaz `ResumenUsoCosto`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `total_regiones` | `number` | no | — |
| `total_recursos` | `number` | no | — |
| `total_muestras` | `number` | no | — |
| `costo_total_global_usd` | `number` | no | — |

Interfaz `Props`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resumen` | `ResumenUsoCosto` | sí | — |
| `isLoading` | `boolean` | no | — |

Internos:

- componente `StatCard` `({ title, value, unit, icon: Icon, description, colorClass = 'blue' }: unknown)`

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx)
- Usado por: [`UsedCostLocationComponent.tsx`](#components-gcp-vista-funciones-uso-costo-por-localizacion-usedcostlocationcomponent-tsx)

