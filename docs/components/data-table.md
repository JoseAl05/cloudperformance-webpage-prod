# Componentes `components/data-table/`

[← Índice](../README.md)

Tablas de datos reutilizables: columnas, tabla simple y tabla con agrupación, orden, paginación y columnas redimensionables.

Archivos:

- [`components/data-table/columns.tsx`](#components-data-table-columns-tsx)
- [`components/data-table/data-table-grouping.tsx`](#components-data-table-data-table-grouping-tsx)
- [`components/data-table/data-table-single.tsx`](#components-data-table-data-table-single-tsx)

<a id="components-data-table-columns-tsx"></a>
## `components/data-table/columns.tsx`

**Módulo (cliente)**

Exporta:

- tipo `DynamicColumn` = `{ header: string; accessorKey?: keyof T | string; accessorFn?: (row: T) => unknown; cell?: (info: unknown) => React.Rea…`
- función `createColumns` `(cols: DynamicColumn<T>[]): ColumnDef<T>[]`

- Usado por: [`page.tsx`](../rutas.md#app-profile-op-licencias-historial-page-tsx), [`page.tsx`](../rutas.md#app-profile-op-licencias-importar-page-tsx), [`BMComparisonResourcesColumns.tsx`](amazon-bedrock.md#components-amazon-bedrock-comparacion-table-bmcomparisonresourcescolumns-tsx), [`BMComparisonResourcesTableComponent.tsx`](amazon-bedrock.md#components-amazon-bedrock-comparacion-table-bmcomparisonresourcestablecomponent-tsx), [`AutoscalingGroupsResourceViewInstanciasComponent.tsx`](aws/vista-autoscaling.md#components-aws-vista-autoscaling-autoscaling-groups-graficos-autoscalinggroupsresourceviewinstanciascomponent-tsx), [`Ec2ConsumeViewInstanceColumns.tsx`](aws/vista-consumos.md#components-aws-vista-consumos-ec2-table-ec2consumeviewinstancecolumns-tsx), [`Ec2EventsTable.tsx`](aws/vista-ec2.md#components-aws-vista-ec2-instancias-ec2-events-ec2eventstable-tsx), [`EventsViewColumns.tsx`](aws/vista-eventos.md#components-aws-vista-eventos-table-eventsviewcolumns-tsx), [`EventsViewTableComponent.tsx`](aws/vista-eventos.md#components-aws-vista-eventos-table-eventsviewtablecomponent-tsx), [`ConsumoHorarioColumns.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-table-consumohorariocolumns-tsx), [`S3LifecycleColumns.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-s3-buckets-table-s3lifecyclecolumns-tsx), [`S3LifecycleTableComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-s3-buckets-table-s3lifecycletablecomponent-tsx), [`S3VersioningColumns.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-s3-buckets-table-s3versioningcolumns-tsx), [`S3VersioningTableComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-s3-buckets-table-s3versioningtablecomponent-tsx), [`UnusedEbsColumns.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-ebs-table-unusedebscolumns-tsx), [`UnusedEc2Columns.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-ec2-table-unusedec2columns-tsx), [`UnusedElbV2Columns.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-elbv2-table-unusedelbv2columns-tsx), [`UnusedNatGatewaysColumns.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-nat-gateways-table-unusednatgatewayscolumns-tsx), [`RdsMariaDBEventsTable.tsx`](aws/vista-rds.md#components-aws-vista-rds-instancias-rds-mariadb-events-rdsmariadbeventstable-tsx), [`RdsMySQLEventsTable.tsx`](aws/vista-rds.md#components-aws-vista-rds-instancias-rds-mysql-events-rdsmysqleventstable-tsx), [`RdsOracleEventsTable.tsx`](aws/vista-rds.md#components-aws-vista-rds-instancias-rds-oracle-events-rdsoracleeventstable-tsx), [`RdsPgEventsTable.tsx`](aws/vista-rds.md#components-aws-vista-rds-instancias-rds-pg-events-rdspgeventstable-tsx), [`RdsSQLServerEventsTable.tsx`](aws/vista-rds.md#components-aws-vista-rds-instancias-rds-sqlserver-events-rdssqlservereventstable-tsx), [`ec2ResourceInfraUsedTableColumns.tsx`](aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-autoscaling-table-ec2resourceinfrausedtablecolumns-tsx), [`ec2ResourceInfraUsedTableColumns.tsx`](aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-ec2-table-ec2resourceinfrausedtablecolumns-tsx), [`ec2ResourceInfraUsedTableColumns.tsx`](aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-eks-table-ec2resourceinfrausedtablecolumns-tsx), [`WorkingNonWorkingHoursColumns.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-consumo-horario-habil-no-habil-table-workingnonworkinghourscolumns-tsx), [`SpotVsRegularVmColumns.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-spot-vs-regular-vm-table-spotvsregularvmcolumns-tsx), [`SpotVsRegularVmTable.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-spot-vs-regular-vm-table-spotvsregularvmtable-tsx), [`UnusedAppsGwColumns.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-apps-gateway-table-unusedappsgwcolumns-tsx), [`UnusedVmExtensionsColumns.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-resources-extensions-table-unusedvmextensionscolumns-tsx), [`UnusedVmColumns.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-resources-vm-table-unusedvmcolumns-tsx), [`UnusedVmssColumns.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-resources-vmss-table-unusedvmsscolumns-tsx), [`UnusedTrafficManagerColumns.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-unused-traffic-managers-table-unusedtrafficmanagercolumns-tsx), [`AzureNodeBillingTableComponent.tsx`](azure/vista-recursos-nodos.md#components-azure-vista-recursos-nodos-table-azurenodebillingtablecomponent-tsx), [`AzureVmBillingColumns.tsx`](azure/vista-recursos-nodos.md#components-azure-vista-recursos-nodos-table-azurevmbillingcolumns-tsx), [`AzureVmBillingColumns.tsx`](azure/vista-recursos-vm.md#components-azure-vista-recursos-vm-table-azurevmbillingcolumns-tsx), [`AzureVmBillingTableComponent.tsx`](azure/vista-recursos-vm.md#components-azure-vista-recursos-vm-table-azurevmbillingtablecomponent-tsx), [`IntraCloudBillingColumns.tsx`](comp-cloud.md#components-comp-cloud-intracloud-billing-table-intracloudbillingcolumns-tsx), [`IntraCloudBillingTable.tsx`](comp-cloud.md#components-comp-cloud-intracloud-billing-table-intracloudbillingtable-tsx), [`IntraCloudServicesBillingColumns.tsx`](comp-cloud.md#components-comp-cloud-intracloud-services-billing-table-intracloudservicesbillingcolumns-tsx), [`IntraCloudServicesBillingTable.tsx`](comp-cloud.md#components-comp-cloud-intracloud-services-billing-table-intracloudservicesbillingtable-tsx), [`WorkingNonWorkingHoursColumns.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-table-workingnonworkinghourscolumns-tsx), [`CloudSqlBillingColumns.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-cloudsql-table-cloudsqlbillingcolumns-tsx), [`CloudSqlBillingTableComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-cloudsql-table-cloudsqlbillingtablecomponent-tsx), [`GkeBillingColumns.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-table-gkebillingcolumns-tsx), [`GkeBillingTableComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-table-gkebillingtablecomponent-tsx), [`GkeNodesColumns.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-table-gkenodescolumns-tsx), [`GkeNodesTableComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-table-gkenodestablecomponent-tsx), [`ComputeEngineBillingColumns.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-table-computeenginebillingcolumns-tsx), [`ComputeEngineBillingTableComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-table-computeenginebillingtablecomponent-tsx), [`InstanceGroupBillingColumns.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-table-instancegroupbillingcolumns-tsx), [`InstanceGroupsBillingTableComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-table-instancegroupsbillingtablecomponent-tsx), [`InstanceGroupsInstancesColumns.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-table-instancegroupsinstancescolumns-tsx), [`InstanceGroupsInstancesTableComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-table-instancegroupsinstancestablecomponent-tsx), [`UnusedCeColumns.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-compute-engine-table-unusedcecolumns-tsx), [`GcpVertexComparisonEndpointsColumns.tsx`](google-vertex.md#components-google-vertex-comparacion-table-gcpvertexcomparisonendpointscolumns-tsx), [`GcpVertexComparisonEndpointsTableComponent.tsx`](google-vertex.md#components-google-vertex-comparacion-table-gcpvertexcomparisonendpointstablecomponent-tsx), [`AFComparisonDeploymentsColumns.tsx`](microsoft-foundry.md#components-microsoft-foundry-comparacion-table-afcomparisondeploymentscolumns-tsx), [`AFComparisonDeploymentsTableComponent.tsx`](microsoft-foundry.md#components-microsoft-foundry-comparacion-table-afcomparisondeploymentstablecomponent-tsx), [`ConsumptionTable.tsx`](shared.md#components-shared-consumption-consumptiontable-tsx), [`UnusedTable.tsx`](shared.md#components-shared-unused-unusedtable-tsx), [`WorkingHoursTable.tsx`](shared.md#components-shared-working-hours-workinghourstable-tsx)

---

<a id="components-data-table-data-table-grouping-tsx"></a>
## `components/data-table/data-table-grouping.tsx`

**Componente (cliente)**

Exporta:

- componente `DataTableGrouping` `({ columns, data = [], filterColumn, filterPlaceholder = 'Buscar...', enableGrouping = false, groupByColumn, pageSizeGroups = 10, pageSizeItems = 10, initialSo…`

Interfaz `DataTableGroupingProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `columns` | `ColumnDef<TData, TValue>[]` | no | — |
| `data` | `TData[]` | sí | — |
| `filterColumn` | `string` | sí | — |
| `filterPlaceholder` | `string` | sí | — |
| `enableGrouping` | `boolean` | sí | — |
| `groupByColumn` | `string` | sí | — |
| `pageSizeGroups` | `number` | sí | — |
| `pageSizeItems` | `number` | sí | — |
| `initialSorting` | `SortingState` | sí | — |

Interfaz `GroupMetadata`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `totalItems` | `number` | no | — |
| `totalPages` | `number` | no | — |
| `currentPage` | `number` | no | — |

Interfaz `ProcessedRow`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `__rowId` | `string` | no | — |
| `__isGroupRow` | `boolean` | no | — |
| `__groupValue` | `string` | sí | — |
| `__itemCount` | `number` | sí | — |
| `__isChildRow` | `boolean` | sí | — |
| `__parentGroup` | `string` | sí | — |

- Tipo interno `AnyRow` = `Record<string, unknown>`
- Tipo interno `ColumnMeta` = `{ isDefaultSort?: boolean defaultSortDesc?: boolean }`
Internos:

- función `comparator` `(a: unknown, b: unknown): number`
- función `sortData` `(data: T[], sortState: SortingState): T[]`
- función `clamp` `(value: number, min: number, max: number)`
- hook `useGroupedData` `(data: AnyRow[], sorting: SortingState, enableGrouping: boolean, groupByColumn?: string, expandedGroups?: Set<string>, …`
- hook `usePagination` `(totalItems: number, pageSize: number)`
- componente `ResizeHandle` `({ header }: { header: Header<unknown, unknown> })`
- componente `SortableHeader` `({ header }: { header: unknown })`
- componente `PageButtons` `({ current, total, onPageChange, }: { current: number total: number onPageChange: (page: number) => void })`
- componente `GroupRow` `({ groupValue, itemCount, isExpanded, metadata, onToggle, onPreviousPage, onNextPage, onPageChange, itemsPageSize, onIt…`

- Hooks: `useGroupedData`, `usePagination`, `useReactTable`
- Usa: [`button.tsx`](ui.md#components-ui-button-tsx), [`input.tsx`](ui.md#components-ui-input-tsx), [`table.tsx`](ui.md#components-ui-table-tsx), [`select.tsx`](ui.md#components-ui-select-tsx)
- Usado por: [`BMComparisonResourcesTableComponent.tsx`](amazon-bedrock.md#components-amazon-bedrock-comparacion-table-bmcomparisonresourcestablecomponent-tsx), [`AutoscalingGroupsResourceViewInstanciasComponent.tsx`](aws/vista-autoscaling.md#components-aws-vista-autoscaling-autoscaling-groups-graficos-autoscalinggroupsresourceviewinstanciascomponent-tsx), [`EventsViewTableComponent.tsx`](aws/vista-eventos.md#components-aws-vista-eventos-table-eventsviewtablecomponent-tsx), [`SpotVsVmTableComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-spot-vs-vm-table-spotvsvmtablecomponent-tsx), [`S3LifecycleTableComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-s3-buckets-table-s3lifecycletablecomponent-tsx), [`S3VersioningTableComponent.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-top-s3-buckets-table-s3versioningtablecomponent-tsx), [`InstanceEc2InfrautilizadaComponent.tsx`](aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-autoscaling-instanceec2infrautilizadacomponent-tsx), [`InstanceEc2InfrautilizadaComponent.tsx`](aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-ec2-instanceec2infrautilizadacomponent-tsx), [`InstanceEksInfrautilizadaComponent.tsx`](aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-eks-instanceeksinfrautilizadacomponent-tsx), [`Ec2TableComponent.tsx`](aws/vista-saving-plan.md#components-aws-vista-saving-plan-tables-ec2tablecomponent-tsx), [`TagsDataTable.tsx`](aws/vista-tags.md#components-aws-vista-tags-table-tagsdatatable-tsx), [`DeploymentsTableComponent.tsx`](azure/vista-deployments.md#components-azure-vista-deployments-table-deploymentstablecomponent-tsx), [`SpotVsRegularVmTable.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-spot-vs-regular-vm-table-spotvsregularvmtable-tsx), [`AzureNodeBillingTableComponent.tsx`](azure/vista-recursos-nodos.md#components-azure-vista-recursos-nodos-table-azurenodebillingtablecomponent-tsx), [`RecursosTrafficManagerTable.tsx`](azure/vista-recursos-tm.md#components-azure-vista-recursos-tm-table-recursostrafficmanagertable-tsx), [`AzureVmBillingTableComponent.tsx`](azure/vista-recursos-vm.md#components-azure-vista-recursos-vm-table-azurevmbillingtablecomponent-tsx), [`SavingPlanTableComponent.tsx`](azure/vista-savings-plan.md#components-azure-vista-savings-plan-table-savingplantablecomponent-tsx), [`TagsDataTable.tsx`](azure/vista-tags.md#components-azure-vista-tags-table-tagsdatatable-tsx), [`IntraCloudBillingTable.tsx`](comp-cloud.md#components-comp-cloud-intracloud-billing-table-intracloudbillingtable-tsx), [`IntraCloudServicesBillingTable.tsx`](comp-cloud.md#components-comp-cloud-intracloud-services-billing-table-intracloudservicesbillingtable-tsx), [`ZonasDNSTable.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-dns-zonas-consumo-estado-tabla-zonasdnstable-tsx), [`LoadBalancersTable.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-load-balancers-consumo-uso-tabla-loadbalancerstable-tsx), [`SpendBasedCudsTable.tsx`](gcp/vista-cuds.md#components-gcp-vista-cuds-spend-based-cuds-table-spendbasedcudstable-tsx), [`SubnetsSinRecursosTable.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-networking-subnets-sin-recursos-tabla-subnetssinrecursostable-tsx), [`SpotVsStandardTable.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-spot-vs-standard-table-spotvsstandardtable-tsx), [`BucketsHistoricalTable.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-top-storage-buckets-table-bucketshistoricaltable-tsx), [`CloudSqlBillingTableComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-cloudsql-table-cloudsqlbillingtablecomponent-tsx), [`GkeBillingColumns.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-table-gkebillingcolumns-tsx), [`GkeBillingTableComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-table-gkebillingtablecomponent-tsx), [`GkeNodesTableComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-table-gkenodestablecomponent-tsx), [`ComputeEngineBillingTableComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-table-computeenginebillingtablecomponent-tsx), [`InstanceGroupBillingColumns.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-table-instancegroupbillingcolumns-tsx), [`InstanceGroupsBillingTableComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-table-instancegroupsbillingtablecomponent-tsx), [`InstanceGroupsInstancesTableComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-table-instancegroupsinstancestablecomponent-tsx), [`ReservationsTable.tsx`](gcp/vista-reservas.md#components-gcp-vista-reservas-table-reservationstable-tsx), [`TagsDataTable.tsx`](gcp/vista-tags.md#components-gcp-vista-tags-table-tagsdatatable-tsx), [`GcpVertexComparisonEndpointsTableComponent.tsx`](google-vertex.md#components-google-vertex-comparacion-table-gcpvertexcomparisonendpointstablecomponent-tsx), [`AFComparisonDeploymentsTableComponent.tsx`](microsoft-foundry.md#components-microsoft-foundry-comparacion-table-afcomparisondeploymentstablecomponent-tsx), [`TopBillingTable.tsx`](shared.md#components-shared-billing-topbillingtable-tsx), [`ConsumptionTable.tsx`](shared.md#components-shared-consumption-consumptiontable-tsx), [`UnusedTable.tsx`](shared.md#components-shared-unused-unusedtable-tsx), [`WorkingHoursTable.tsx`](shared.md#components-shared-working-hours-workinghourstable-tsx)

---

<a id="components-data-table-data-table-single-tsx"></a>
## `components/data-table/data-table-single.tsx`

**Componente (cliente)**

Exporta:

- componente `DataTableSingle` `({ columns, data, filterColumn, filterPlaceholder = 'Buscar...', pageSizeOptions = [5, 10, 20, 50, 100], initialPageSize = 5, }: DataTableProps<TData, TValue>)`

Interfaz `DataTableProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `columns` | `ColumnDef<TData, TValue>[]` | no | — |
| `data` | `TData[]` | no | — |
| `filterColumn` | `string` | sí | — |
| `filterPlaceholder` | `string` | sí | — |
| `pageSizeOptions` | `number[]` | sí | Tamaños disponibles para el selector de página |
| `initialPageSize` | `number` | sí | Tamaño de página inicial |

- Hooks: `useReactTable`
- Usa: [`button.tsx`](ui.md#components-ui-button-tsx), [`input.tsx`](ui.md#components-ui-input-tsx), [`table.tsx`](ui.md#components-ui-table-tsx), [`select.tsx`](ui.md#components-ui-select-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-profile-op-licencias-historial-page-tsx), [`page.tsx`](../rutas.md#app-profile-op-licencias-importar-page-tsx), [`AnomalyAlertsTable.tsx`](alertas.md#components-alertas-anomalies-table-anomalyalertstable-tsx), [`BillingAlertsTable.tsx`](alertas.md#components-alertas-billing-table-billingalertstable-tsx), [`AutoscalingGroupsEventsTable.tsx`](aws/vista-autoscaling.md#components-aws-vista-autoscaling-autoscaling-groups-events-autoscalinggroupseventstable-tsx), [`Ec2EventsTable.tsx`](aws/vista-ec2.md#components-aws-vista-ec2-instancias-ec2-events-ec2eventstable-tsx), [`RdsMariaDBEventsTable.tsx`](aws/vista-rds.md#components-aws-vista-rds-instancias-rds-mariadb-events-rdsmariadbeventstable-tsx), [`RdsMySQLEventsTable.tsx`](aws/vista-rds.md#components-aws-vista-rds-instancias-rds-mysql-events-rdsmysqleventstable-tsx), [`RdsOracleEventsTable.tsx`](aws/vista-rds.md#components-aws-vista-rds-instancias-rds-oracle-events-rdsoracleeventstable-tsx), [`RdsPgEventsTable.tsx`](aws/vista-rds.md#components-aws-vista-rds-instancias-rds-pg-events-rdspgeventstable-tsx), [`RdsSQLServerEventsTable.tsx`](aws/vista-rds.md#components-aws-vista-rds-instancias-rds-sqlserver-events-rdssqlservereventstable-tsx), [`TablasItemAzureComponent.tsx`](azure/tables-azure.md#components-azure-tables-azure-tablas-item-azure-tablasitemazurecomponent-tsx)

Notas de implementación:

- Totales y rango visible
- Helpers para paginación numerada (ventana)
- JSX — Footer de paginación
- JSX — Rango visible
- JSX — Controles: prev / números / next
- JSX — Botones numerados
- JSX — Ir al primero si la ventana no empieza en 0
- JSX — Ventana central
- JSX — Ir al último si la ventana no termina en el último
- JSX — Selector de items por página
- `table.setPageIndex(0)` — volver al inicio al cambiar tamaño

