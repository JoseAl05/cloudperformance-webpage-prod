# Componentes `components/aws/vista-rds/`

[← Índice](../../README.md)

Vistas de instancia RDS por motor: información, historial, eventos y métricas.

Archivos:

- [`components/aws/vista-rds/graficos/MainRdsResourceViewMetricsSummaryComponent.tsx`](#components-aws-vista-rds-graficos-mainrdsresourceviewmetricssummarycomponent-tsx)
- [`components/aws/vista-rds/graficos/RdsResourceViewCpuCreditsComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewcpucreditscomponent-tsx)
- [`components/aws/vista-rds/graficos/RdsResourceViewCpuUsageComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewcpuusagecomponent-tsx)
- [`components/aws/vista-rds/graficos/RdsResourceViewDbConnectionsComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewdbconnectionscomponent-tsx)
- [`components/aws/vista-rds/graficos/RdsResourceViewIopsComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewiopscomponent-tsx)
- [`components/aws/vista-rds/graficos/RdsResourceViewMemoryComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewmemorycomponent-tsx)
- [`components/aws/vista-rds/graficos/RdsResourceViewStorageComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewstoragecomponent-tsx)
- [`components/aws/vista-rds/instancias-rds-mariadb/InstanciasRdsMariaDBChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-instanciasrdsmariadbchartcomponent-tsx)
- [`components/aws/vista-rds/instancias-rds-mariadb/MainViewInstanciasRdsMariaDBComponent.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-mainviewinstanciasrdsmariadbcomponent-tsx)
- [`components/aws/vista-rds/instancias-rds-mariadb/events/RdsMariaDBEventsColumns.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-events-rdsmariadbeventscolumns-tsx)
- [`components/aws/vista-rds/instancias-rds-mariadb/events/RdsMariaDBEventsTable.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-events-rdsmariadbeventstable-tsx)
- [`components/aws/vista-rds/instancias-rds-mariadb/info/RdsMariaDBResourceViewHistoricInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-info-rdsmariadbresourceviewhistoricinfocomponent-tsx)
- [`components/aws/vista-rds/instancias-rds-mariadb/info/RdsMariaDBResourceViewInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-info-rdsmariadbresourceviewinfocomponent-tsx)
- [`components/aws/vista-rds/instancias-rds-mysql/InstanciasRdsMySQLChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-mysql-instanciasrdsmysqlchartcomponent-tsx)
- [`components/aws/vista-rds/instancias-rds-mysql/MainViewInstanciasRdsMySQLComponent.tsx`](#components-aws-vista-rds-instancias-rds-mysql-mainviewinstanciasrdsmysqlcomponent-tsx)
- [`components/aws/vista-rds/instancias-rds-mysql/events/RdsMySQLEventsColumns.tsx`](#components-aws-vista-rds-instancias-rds-mysql-events-rdsmysqleventscolumns-tsx)
- [`components/aws/vista-rds/instancias-rds-mysql/events/RdsMySQLEventsTable.tsx`](#components-aws-vista-rds-instancias-rds-mysql-events-rdsmysqleventstable-tsx)
- [`components/aws/vista-rds/instancias-rds-mysql/info/RdsMysqlResourceViewHistoricInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-mysql-info-rdsmysqlresourceviewhistoricinfocomponent-tsx)
- [`components/aws/vista-rds/instancias-rds-mysql/info/RdsMysqlResourceViewInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-mysql-info-rdsmysqlresourceviewinfocomponent-tsx)
- [`components/aws/vista-rds/instancias-rds-oracle/InstanciasRdsOracleChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-oracle-instanciasrdsoraclechartcomponent-tsx)
- [`components/aws/vista-rds/instancias-rds-oracle/MainViewInstanciasRdsOracleComponent.tsx`](#components-aws-vista-rds-instancias-rds-oracle-mainviewinstanciasrdsoraclecomponent-tsx)
- [`components/aws/vista-rds/instancias-rds-oracle/events/RdsOracleEventsColumns.tsx`](#components-aws-vista-rds-instancias-rds-oracle-events-rdsoracleeventscolumns-tsx)
- [`components/aws/vista-rds/instancias-rds-oracle/events/RdsOracleEventsTable.tsx`](#components-aws-vista-rds-instancias-rds-oracle-events-rdsoracleeventstable-tsx)
- [`components/aws/vista-rds/instancias-rds-oracle/info/RdsOracleResourceViewHistoricInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-oracle-info-rdsoracleresourceviewhistoricinfocomponent-tsx)
- [`components/aws/vista-rds/instancias-rds-oracle/info/RdsOracleResourceViewInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-oracle-info-rdsoracleresourceviewinfocomponent-tsx)
- [`components/aws/vista-rds/instancias-rds-pg/InstanciasRdsPgChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-pg-instanciasrdspgchartcomponent-tsx)
- [`components/aws/vista-rds/instancias-rds-pg/MainViewInstanciasRdsPgComponent.tsx`](#components-aws-vista-rds-instancias-rds-pg-mainviewinstanciasrdspgcomponent-tsx)
- [`components/aws/vista-rds/instancias-rds-pg/events/RdsPgEventsColumns.tsx`](#components-aws-vista-rds-instancias-rds-pg-events-rdspgeventscolumns-tsx)
- [`components/aws/vista-rds/instancias-rds-pg/events/RdsPgEventsTable.tsx`](#components-aws-vista-rds-instancias-rds-pg-events-rdspgeventstable-tsx)
- [`components/aws/vista-rds/instancias-rds-pg/info/RdsResourceViewHistoricInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-pg-info-rdsresourceviewhistoricinfocomponent-tsx)
- [`components/aws/vista-rds/instancias-rds-pg/info/RdsResourceViewInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-pg-info-rdsresourceviewinfocomponent-tsx)
- [`components/aws/vista-rds/instancias-rds-sqlserver/InstanciasRdsSQLServerChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-instanciasrdssqlserverchartcomponent-tsx)
- [`components/aws/vista-rds/instancias-rds-sqlserver/MainViewInstanciasRdsSQLServerComponent.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-mainviewinstanciasrdssqlservercomponent-tsx)
- [`components/aws/vista-rds/instancias-rds-sqlserver/events/RdsSQLServerEventsColumns.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-events-rdssqlservereventscolumns-tsx)
- [`components/aws/vista-rds/instancias-rds-sqlserver/events/RdsSQLServerEventsTable.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-events-rdssqlservereventstable-tsx)
- [`components/aws/vista-rds/instancias-rds-sqlserver/info/RdsSQLServerResourceViewHistoricInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-info-rdssqlserverresourceviewhistoricinfocomponent-tsx)
- [`components/aws/vista-rds/instancias-rds-sqlserver/info/RdsSQLServerResourceViewInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-info-rdssqlserverresourceviewinfocomponent-tsx)

<a id="components-aws-vista-rds-graficos-mainrdsresourceviewmetricssummarycomponent-tsx"></a>
## `components/aws/vista-rds/graficos/MainRdsResourceViewMetricsSummaryComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainRdsResourceViewMetricsSummaryComponentComponent` `({ data, rdsType }: MainRdsResourceViewMetricsSummaryComponentProps)`

Interfaz `RdsMetricsData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metrics_data` | `unknown[]` | no | — |
| `calculated_summary` | `unknown` | sí | — |

Interfaz `MainRdsResourceViewMetricsSummaryComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `RdsMetricsData \| null` | no | — |
| `rdsType` | `'rds-pg' \| 'rds-mysql' \| 'rds-mariadb' \| 'rds-oracle' \| 'rds-sqlserve…` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx)
- Usado por: [`InstanciasRdsMariaDBChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-instanciasrdsmariadbchartcomponent-tsx), [`InstanciasRdsMySQLChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-mysql-instanciasrdsmysqlchartcomponent-tsx), [`InstanciasRdsOracleChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-oracle-instanciasrdsoraclechartcomponent-tsx), [`InstanciasRdsPgChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-pg-instanciasrdspgchartcomponent-tsx), [`InstanciasRdsSQLServerChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-instanciasrdssqlserverchartcomponent-tsx)

---

<a id="components-aws-vista-rds-graficos-rdsresourceviewcpucreditscomponent-tsx"></a>
## `components/aws/vista-rds/graficos/RdsResourceViewCpuCreditsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RdsResourceViewCpuCreditsComponent` `({ data, title = "Consumo y Balance de Créditos de CPU (Burstable)" }: RdsResourceViewCpuCreditsComponentProps)`

Interfaz `MetricPoint`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `Resource` | `string` | no | — |
| `Timestamp` | `string` | no | — |
| `Value` | `number` | no | — |
| `total` | `number` | sí | — |
| `unused` | `number` | sí | — |
| `used` | `number` | sí | — |
| `MetricId` | `string` | no | — |
| `MetricLabel` | `string` | no | — |

Interfaz `RdsResourceViewCpuCreditsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `MetricPoint[]` | no | — |
| `title` | `string` | sí | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`InstanciasRdsMariaDBChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-instanciasrdsmariadbchartcomponent-tsx), [`InstanciasRdsMySQLChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-mysql-instanciasrdsmysqlchartcomponent-tsx), [`InstanciasRdsOracleChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-oracle-instanciasrdsoraclechartcomponent-tsx), [`InstanciasRdsPgChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-pg-instanciasrdspgchartcomponent-tsx), [`InstanciasRdsSQLServerChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-instanciasrdssqlserverchartcomponent-tsx)

Notas de implementación:

- Verificar si existen las métricas de CPU Credits específicas

---

<a id="components-aws-vista-rds-graficos-rdsresourceviewcpuusagecomponent-tsx"></a>
## `components/aws/vista-rds/graficos/RdsResourceViewCpuUsageComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RdsResourceViewCpuUsageComponent` `({ data, title = "% Uso de CPU", height = "350px" }: RdsResourceViewCpuUsageComponentProps)`

Interfaz `MetricPoint`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `Resource` | `string` | no | — |
| `Timestamp` | `string` | no | — |
| `Value` | `number` | no | — |
| `total` | `number` | sí | — |
| `unused` | `number` | sí | — |
| `used` | `number` | sí | — |
| `MetricId` | `string` | no | — |
| `MetricLabel` | `string` | no | — |

Interfaz `RdsResourceViewCpuUsageComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `unknown[]` | no | — |
| `title` | `string` | sí | — |
| `height` | `string` | sí | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`InstanciasRdsMariaDBChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-instanciasrdsmariadbchartcomponent-tsx), [`InstanciasRdsMySQLChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-mysql-instanciasrdsmysqlchartcomponent-tsx), [`InstanciasRdsOracleChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-oracle-instanciasrdsoraclechartcomponent-tsx), [`InstanciasRdsPgChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-pg-instanciasrdspgchartcomponent-tsx), [`InstanciasRdsSQLServerChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-instanciasrdssqlserverchartcomponent-tsx)

---

<a id="components-aws-vista-rds-graficos-rdsresourceviewdbconnectionscomponent-tsx"></a>
## `components/aws/vista-rds/graficos/RdsResourceViewDbConnectionsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RdsResourceViewDbConnectionsComponent` `({ data, title = "Conexiones a Base de Datos", height = "350px" }: RdsResourceViewDbConnectionsComponentProps)`

Interfaz `MetricPoint`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `Resource` | `string` | no | — |
| `Timestamp` | `string` | no | — |
| `Value` | `number` | no | — |
| `total` | `number` | sí | — |
| `unused` | `number` | sí | — |
| `used` | `number` | sí | — |
| `MetricId` | `string` | no | — |
| `MetricLabel` | `string` | no | — |

Interfaz `RdsResourceViewDbConnectionsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `MetricPoint[]` | no | — |
| `title` | `string` | sí | — |
| `height` | `string` | sí | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`InstanciasRdsMariaDBChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-instanciasrdsmariadbchartcomponent-tsx), [`InstanciasRdsMySQLChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-mysql-instanciasrdsmysqlchartcomponent-tsx), [`InstanciasRdsOracleChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-oracle-instanciasrdsoraclechartcomponent-tsx), [`InstanciasRdsPgChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-pg-instanciasrdspgchartcomponent-tsx), [`InstanciasRdsSQLServerChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-instanciasrdssqlserverchartcomponent-tsx)

Notas de implementación:

- Verificar si existen datos de conexiones

---

<a id="components-aws-vista-rds-graficos-rdsresourceviewiopscomponent-tsx"></a>
## `components/aws/vista-rds/graficos/RdsResourceViewIopsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RdsResourceViewIopsComponent` `({ data, title = "Operaciones Lectura/Escritura (IOPS/seg)", height = "350px" }: RdsResourceViewIopsComponentProps)`

Interfaz `MetricPoint`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `Resource` | `string` | no | — |
| `Timestamp` | `string` | no | — |
| `Value` | `number` | no | — |
| `total` | `number` | sí | — |
| `unused` | `number` | sí | — |
| `used` | `number` | sí | — |
| `MetricId` | `string` | no | — |
| `MetricLabel` | `string` | no | — |

Interfaz `RdsResourceViewIopsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `MetricPoint[]` | no | — |
| `title` | `string` | sí | — |
| `height` | `string` | sí | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`InstanciasRdsMariaDBChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-instanciasrdsmariadbchartcomponent-tsx), [`InstanciasRdsMySQLChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-mysql-instanciasrdsmysqlchartcomponent-tsx), [`InstanciasRdsOracleChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-oracle-instanciasrdsoraclechartcomponent-tsx), [`InstanciasRdsPgChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-pg-instanciasrdspgchartcomponent-tsx), [`InstanciasRdsSQLServerChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-instanciasrdssqlserverchartcomponent-tsx)

Notas de implementación:

- Verificar si existen las métricas de IOPS específicas

---

<a id="components-aws-vista-rds-graficos-rdsresourceviewmemorycomponent-tsx"></a>
## `components/aws/vista-rds/graficos/RdsResourceViewMemoryComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RdsResourceViewMemoryComponent` `({ data, title = "Memoria Disponible", height = "350px" }: RdsResourceViewMemoryComponentProps)`

Interfaz `MetricPoint`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `Resource` | `string` | no | — |
| `Timestamp` | `string` | no | — |
| `Value` | `number` | no | — |
| `total` | `number` | sí | — |
| `unused` | `number` | sí | — |
| `used` | `number` | sí | — |
| `MetricId` | `string` | no | — |
| `MetricLabel` | `string` | no | — |

Interfaz `RdsResourceViewMemoryComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `MetricPoint[]` | no | — |
| `title` | `string` | sí | — |
| `height` | `string` | sí | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`InstanciasRdsMariaDBChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-instanciasrdsmariadbchartcomponent-tsx), [`InstanciasRdsMySQLChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-mysql-instanciasrdsmysqlchartcomponent-tsx), [`InstanciasRdsOracleChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-oracle-instanciasrdsoraclechartcomponent-tsx), [`InstanciasRdsPgChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-pg-instanciasrdspgchartcomponent-tsx), [`InstanciasRdsSQLServerChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-instanciasrdssqlserverchartcomponent-tsx)

Notas de implementación:

- Verificar si existen datos de memoria

---

<a id="components-aws-vista-rds-graficos-rdsresourceviewstoragecomponent-tsx"></a>
## `components/aws/vista-rds/graficos/RdsResourceViewStorageComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RdsResourceViewStorageComponent` `({ data, title = "Storage Disponible", height = "350px" }: RdsResourceViewStorageComponentProps)`

Interfaz `MetricPoint`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `Resource` | `string` | no | — |
| `Timestamp` | `string` | no | — |
| `Value` | `number` | no | — |
| `total` | `number` | sí | — |
| `unused` | `number` | sí | — |
| `used` | `number` | sí | — |
| `MetricId` | `string` | no | — |
| `MetricLabel` | `string` | no | — |

Interfaz `RdsResourceViewStorageComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `MetricPoint[]` | no | — |
| `title` | `string` | sí | — |
| `height` | `string` | sí | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts)
- Usado por: [`InstanciasRdsMariaDBChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-instanciasrdsmariadbchartcomponent-tsx), [`InstanciasRdsMySQLChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-mysql-instanciasrdsmysqlchartcomponent-tsx), [`InstanciasRdsOracleChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-oracle-instanciasrdsoraclechartcomponent-tsx), [`InstanciasRdsPgChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-pg-instanciasrdspgchartcomponent-tsx), [`InstanciasRdsSQLServerChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-instanciasrdssqlserverchartcomponent-tsx)

Notas de implementación:

- Verificar si existen datos de storage

---

<a id="components-aws-vista-rds-instancias-rds-mariadb-instanciasrdsmariadbchartcomponent-tsx"></a>
## `components/aws/vista-rds/instancias-rds-mariadb/InstanciasRdsMariaDBChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `InstanciasRdsMariaDBChartComponent` `({ startDate, endDate, region, instance = "", selectedKey, selectedValue, }: InstanciasRdsMariaDBProps)`

Interfaz `InstanciasRdsMariaDBProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | sí | — |
| `instance` | `string` | sí | — |
| `selectedKey` | `string \| null` | sí | — |
| `selectedValue` | `string \| null` | sí | — |

Interfaz `RdsMariaDBInstanceData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `TagList_Key` | `string[]` | no | — |
| `TagList_Value` | `string[]` | no | — |
| `region` | `string` | no | — |
| `DBInstanceIdentifier` | `string` | no | — |
| `InstanceCreateTime` | `{ $date: string }` | no | — |
| `DBInstanceStatus` | `string` | no | — |
| `DBInstanceClass` | `string` | no | — |
| `LicenseModel` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetIdentifier` | `string[]` | no | — |
| `Engine` | `string` | no | — |
| `EngineVersion` | `string` | no | — |
| `AllocatedStorage` | `number` | no | — |
| `StorageType` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetAvailabilityZone_Name` | `string[]` | no | — |
| `DBSubnetGroup_Subnets_SubnetStatus` | `string[]` | no | — |
| `Total_Subnets_RDS_MariaDB` | `number` | no | — |
| `EnginePlusVersion` | `string` | no | — |
| `Allocated_Storage_RDS_MariaDB_Formatted` | `string` | no | — |

Interfaz `RdsMetricItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `MetricLabel` | `string` | no | — |
| `Value` | `number` | no | — |
| `sync_time` | `string` | no | — |
| `Unit` | `string` | sí | — |

Interfaz `RdsMetricsData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metrics_data` | `RdsMetricItem[]` | no | — |
| `calculated_summary` | `Record<string, unknown>` | sí | — |

Interfaz `MetricPoint`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `Resource` | `string` | no | — |
| `Timestamp` | `string` | no | — |
| `Value` | `number` | no | — |
| `total` | `number` | sí | — |
| `unused` | `number` | sí | — |
| `used` | `number` | sí | — |
| `MetricId` | `string` | no | — |
| `MetricLabel` | `string` | no | — |

Internos:

- función `transformMetricsForChart` `(metricsData: RdsMetricsData): MetricPoint[]` — Función para transformar los datos de métricas al formato esperado por el gráfico

- API: `/api/aws/bridge/db/instancias-rds-mariadb`, `/api/aws/bridge/db/instancias-rds-mariadb-events`, `/api/aws/bridge/db/instancias-rds-mariadb-metrics`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx), [`RdsMariaDBResourceViewInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-info-rdsmariadbresourceviewinfocomponent-tsx), [`RdsMariaDBEventsTable.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-events-rdsmariadbeventstable-tsx), [`RdsResourceViewCpuCreditsComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewcpucreditscomponent-tsx), [`RdsResourceViewCpuUsageComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewcpuusagecomponent-tsx), [`RdsResourceViewDbConnectionsComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewdbconnectionscomponent-tsx), [`RdsResourceViewMemoryComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewmemorycomponent-tsx), [`RdsResourceViewStorageComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewstoragecomponent-tsx), [`RdsResourceViewIopsComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewiopscomponent-tsx), [`MainRdsResourceViewMetricsSummaryComponent.tsx`](#components-aws-vista-rds-graficos-mainrdsresourceviewmetricssummarycomponent-tsx)
- Usado por: [`MainViewInstanciasRdsMariaDBComponent.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-mainviewinstanciasrdsmariadbcomponent-tsx)

Notas de implementación:

- API de MariaDB
- Eventos de la instancia
- eCharts para "Estado de Instancias" (vista general)
- Loaders / errores
- Sin selección de instancia -> mensaje
- Datos de la instancia concreta
- Carga/errores de métricas del summary
- JSX — Panel izquierdo - Información de la instancia
- JSX — Panel derecho - Resumen de métricas
- JSX — Grafico 1 - Consumo y Balance de Créditos de CPU (Burstable)
- JSX — Gráfico 2: CPU Usage
- JSX — Gráfico 3: Database Connections
- JSX — Gráfico 4: Memory
- JSX — Gráfico 5: IOPS
- JSX — Gráfico 6: Storage
- JSX — Tabla de Eventos RDS MariaDB

---

<a id="components-aws-vista-rds-instancias-rds-mariadb-mainviewinstanciasrdsmariadbcomponent-tsx"></a>
## `components/aws/vista-rds/instancias-rds-mariadb/MainViewInstanciasRdsMariaDBComponent.tsx`

**Componente**

Exporta:

- componente `MainViewInstanciasRdsMariaDBComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`InstanciasRdsMariaDBChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-instanciasrdsmariadbchartcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-recursos-instancias-rds-mariadb-page-tsx)

---

<a id="components-aws-vista-rds-instancias-rds-mariadb-events-rdsmariadbeventscolumns-tsx"></a>
## `components/aws/vista-rds/instancias-rds-mariadb/events/RdsMariaDBEventsColumns.tsx`

**Módulo (cliente)**

Exporta:

- tipo `RdsMariaDBEvent` = `{ _id: string EventName: string EventSource: string EventTime: string Username: string sync_time: string Resources_Reso…`
- constante `rdsMariaDBEventColumns` = `[ { header: 'Nombre Evento', accessorKey: 'EventName', cell: ({ getValue }) => …`

Internos:

- función `getRdsConsoleUrl` `(resourceType: string, resourceName: string, region = 'us-east-1')`
- componente `RdsMariaDBEventDetailsModal` `({ event }: { event: RdsMariaDBEvent })`
- componente `RdsResourcesCell` `({ resourceNames, resourceTypes }: { resourceNames: string[]; resourceTypes: string[] })`

- Usa: [`button.tsx`](../ui.md#components-ui-button-tsx), [`dropdown-menu.tsx`](../ui.md#components-ui-dropdown-menu-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx)
- Usado por: [`RdsMariaDBEventsTable.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-events-rdsmariadbeventstable-tsx)

---

<a id="components-aws-vista-rds-instancias-rds-mariadb-events-rdsmariadbeventstable-tsx"></a>
## `components/aws/vista-rds/instancias-rds-mariadb/events/RdsMariaDBEventsTable.tsx`

**Componente**

Exporta:

- componente `RdsMariaDBEventsTableComponent` `({ data, startDate, endDate, instance, isLoading = false }: RdsMariaDBEventsTableComponentProps)`

Interfaz `RdsMariaDBEventsTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `unknown` | sí | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `instance` | `string` | no | — |
| `isLoading` | `boolean` | sí | — |

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`RdsMariaDBEventsColumns.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-events-rdsmariadbeventscolumns-tsx), [`data-table-single.tsx`](../data-table.md#components-data-table-data-table-single-tsx)
- Usado por: [`InstanciasRdsMariaDBChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-instanciasrdsmariadbchartcomponent-tsx)

---

<a id="components-aws-vista-rds-instancias-rds-mariadb-info-rdsmariadbresourceviewhistoricinfocomponent-tsx"></a>
## `components/aws/vista-rds/instancias-rds-mariadb/info/RdsMariaDBResourceViewHistoricInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RdsMariaDBResourceViewHistoricInfoComponent` `({ instances }: MariaDBResourceViewHistoricInfoComponentProps)`

Interfaz `MariaDBInstanceData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `TagList_Key` | `string[]` | no | — |
| `TagList_Value` | `string[]` | no | — |
| `region` | `string` | no | — |
| `DBInstanceIdentifier` | `string` | no | — |
| `InstanceCreateTime` | `{ $date: string }` | no | — |
| `DBInstanceStatus` | `string` | no | — |
| `DBInstanceClass` | `string` | no | — |
| `LicenseModel` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetIdentifier` | `string[]` | no | — |
| `Engine` | `string` | no | — |
| `EngineVersion` | `string` | no | — |
| `AllocatedStorage` | `number` | no | — |
| `StorageType` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetAvailabilityZone_Name` | `string[]` | no | — |
| `DBSubnetGroup_Subnets_SubnetStatus` | `string[]` | no | — |
| `Total_Subnets_RDS_MariaDB` | `number` | no | — |
| `EnginePlusVersion` | `string` | no | — |
| `Allocated_Storage_RDS_MariaDB_Formatted` | `string` | no | — |

Interfaz `MariaDBResourceViewHistoricInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instances` | `MariaDBInstanceData[]` | no | — |

Internos:

- función `getUptime` `(createTime: Date)`

- Usa: [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx)
- Usado por: [`RdsMariaDBResourceViewInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-info-rdsmariadbresourceviewinfocomponent-tsx)

---

<a id="components-aws-vista-rds-instancias-rds-mariadb-info-rdsmariadbresourceviewinfocomponent-tsx"></a>
## `components/aws/vista-rds/instancias-rds-mariadb/info/RdsMariaDBResourceViewInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RdsMariaDBResourceViewInfoComponent` `({ data }: RdsMariaDBResourceViewInfoComponentProps)`

Interfaz `MariaDBInstanceData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `TagList_Key` | `string[]` | no | — |
| `TagList_Value` | `string[]` | no | — |
| `region` | `string` | no | — |
| `DBInstanceIdentifier` | `string` | no | — |
| `InstanceCreateTime` | `{ $date: string }` | no | — |
| `DBInstanceStatus` | `string` | no | — |
| `DBInstanceClass` | `string` | no | — |
| `LicenseModel` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetIdentifier` | `string[]` | no | — |
| `Engine` | `string` | no | — |
| `EngineVersion` | `string` | no | — |
| `AllocatedStorage` | `number` | no | — |
| `StorageType` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetAvailabilityZone_Name` | `string[]` | no | — |
| `DBSubnetGroup_Subnets_SubnetStatus` | `string[]` | no | — |
| `Total_Subnets_RDS_MariaDB` | `number` | no | — |
| `EnginePlusVersion` | `string` | no | — |
| `Allocated_Storage_RDS_MariaDB_Formatted` | `string` | no | — |

Interfaz `RdsMariaDBResourceViewInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `MariaDBInstanceData[] \| null` | no | — |

Internos:

- función `getUptime` `(createTime: Date)`

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`RdsMariaDBResourceViewHistoricInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-info-rdsmariadbresourceviewhistoricinfocomponent-tsx)
- Usado por: [`InstanciasRdsMariaDBChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-mariadb-instanciasrdsmariadbchartcomponent-tsx)

---

<a id="components-aws-vista-rds-instancias-rds-mysql-instanciasrdsmysqlchartcomponent-tsx"></a>
## `components/aws/vista-rds/instancias-rds-mysql/InstanciasRdsMySQLChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `InstanciasRdsMySQLChartComponent` `({ startDate, endDate, region, instance = "", selectedKey, selectedValue, }: InstanciasRdsMysqlProps)`

Interfaz `InstanciasRdsMysqlProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | sí | — |
| `instance` | `string` | sí | — |
| `selectedKey` | `string \| null` | sí | — |
| `selectedValue` | `string \| null` | sí | — |

Interfaz `RdsInstanceData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `TagList_Key` | `string[]` | no | — |
| `TagList_Value` | `string[]` | no | — |
| `region` | `string` | no | — |
| `DBInstanceIdentifier` | `string` | no | — |
| `InstanceCreateTime` | `{ $date: string }` | no | — |
| `DBInstanceStatus` | `string` | no | — |
| `DBInstanceClass` | `string` | no | — |
| `LicenseModel` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetIdentifier` | `string[]` | no | — |
| `Engine` | `string` | no | — |
| `EngineVersion` | `string` | no | — |
| `AllocatedStorage` | `number` | no | — |
| `StorageType` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetAvailabilityZone_Name` | `string[]` | no | — |
| `DBSubnetGroup_Subnets_SubnetStatus` | `string[]` | no | — |
| `Total_Subnets_RDS_Mysql` | `number` | no | — |
| `EnginePlusVersion` | `string` | no | — |
| `Allocated_Storage_RDS_Mysql_Formatted` | `string` | no | — |

Interfaz `RdsMetricItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `MetricLabel` | `string` | no | — |
| `Value` | `number` | no | — |
| `sync_time` | `string` | no | — |
| `Unit` | `string` | sí | — |

Interfaz `RdsMetricsData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metrics_data` | `RdsMetricItem[]` | no | — |
| `calculated_summary` | `Record<string, unknown>` | sí | — |

Interfaz `MetricPoint`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `Resource` | `string` | no | — |
| `Timestamp` | `string` | no | — |
| `Value` | `number` | no | — |
| `total` | `number` | sí | — |
| `unused` | `number` | sí | — |
| `used` | `number` | sí | — |
| `MetricId` | `string` | no | — |
| `MetricLabel` | `string` | no | — |

Internos:

- función `transformMetricsForChart` `(metricsData: RdsMetricsData): MetricPoint[]`

- API: `/api/aws/bridge/db/instancias-rds-mysql`, `/api/aws/bridge/db/instancias-rds-mysql-events`, `/api/aws/bridge/db/instancias-rds-mysql-metrics`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`RdsMysqlResourceViewInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-mysql-info-rdsmysqlresourceviewinfocomponent-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`RdsMySQLEventsTable.tsx`](#components-aws-vista-rds-instancias-rds-mysql-events-rdsmysqleventstable-tsx), [`RdsResourceViewCpuCreditsComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewcpucreditscomponent-tsx), [`RdsResourceViewCpuUsageComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewcpuusagecomponent-tsx), [`RdsResourceViewDbConnectionsComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewdbconnectionscomponent-tsx), [`RdsResourceViewMemoryComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewmemorycomponent-tsx), [`RdsResourceViewStorageComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewstoragecomponent-tsx), [`RdsResourceViewIopsComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewiopscomponent-tsx), [`MainRdsResourceViewMetricsSummaryComponent.tsx`](#components-aws-vista-rds-graficos-mainrdsresourceviewmetricssummarycomponent-tsx)
- Usado por: [`MainViewInstanciasRdsMySQLComponent.tsx`](#components-aws-vista-rds-instancias-rds-mysql-mainviewinstanciasrdsmysqlcomponent-tsx)

Notas de implementación:

- _transformMetricsForChart_: Los datos ya vienen en el formato correcto desde la API
- Eventos de la instancia
- eCharts para "Estado de Instancias" (vista general)
- Loaders / errores
- Sin selección de instancia -> mensaje
- Datos de la instancia concreta
- Carga/errores de métricas del summary
- JSX — Panel izquierdo - Información de la instancia
- JSX — Panel derecho - Resumen de métricas
- JSX — Sección placeholder para futuras métricas
- JSX — Gráfico 1: CPU Credits
- JSX — Gráfico 2: CPU Usage
- JSX — Gráfico 3: Database Connections
- JSX — Gráfico 4: Memory
- JSX — Gráfico 5: IOPS
- JSX — Gráfico 6: Storage
- JSX — Tabla de Eventos RDS MySQL

---

<a id="components-aws-vista-rds-instancias-rds-mysql-mainviewinstanciasrdsmysqlcomponent-tsx"></a>
## `components/aws/vista-rds/instancias-rds-mysql/MainViewInstanciasRdsMySQLComponent.tsx`

**Componente**

Exporta:

- componente `MainViewInstanciasRdsMySQLComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`InstanciasRdsMySQLChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-mysql-instanciasrdsmysqlchartcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-recursos-instancias-rds-mysql-page-tsx)

---

<a id="components-aws-vista-rds-instancias-rds-mysql-events-rdsmysqleventscolumns-tsx"></a>
## `components/aws/vista-rds/instancias-rds-mysql/events/RdsMySQLEventsColumns.tsx`

**Módulo (cliente)**

Exporta:

- tipo `RdsMysqlEvent` = `{ _id: string EventName: string EventSource: string EventTime: string Username: string sync_time: string Resources_Reso…`
- constante `rdsMysqlEventColumns` = `[ { header: 'Nombre Evento', accessorKey: 'EventName', cell: ({ getValue }) => …`

Internos:

- función `getRdsConsoleUrl` `(resourceType: string, resourceName: string, region = 'us-east-1')`
- componente `RdsMysqlEventDetailsModal` `({ event }: { event: RdsMysqlEvent })`
- componente `RdsResourcesCell` `({ resourceNames, resourceTypes }: { resourceNames: string[]; resourceTypes: string[] })`

- Usa: [`button.tsx`](../ui.md#components-ui-button-tsx), [`dropdown-menu.tsx`](../ui.md#components-ui-dropdown-menu-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx)
- Usado por: [`RdsMySQLEventsTable.tsx`](#components-aws-vista-rds-instancias-rds-mysql-events-rdsmysqleventstable-tsx)

Notas de implementación:

- _RdsMysqlEventDetailsModal_: JSX — Información específica de RDS

---

<a id="components-aws-vista-rds-instancias-rds-mysql-events-rdsmysqleventstable-tsx"></a>
## `components/aws/vista-rds/instancias-rds-mysql/events/RdsMySQLEventsTable.tsx`

**Componente**

Exporta:

- componente `RdsMysqlEventsTableComponent` `({ data, startDate, endDate, instance, isLoading = false }: RdsMysqlEventsTableComponentProps)`

Interfaz `RdsMysqlEventsTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `unknown` | sí | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `instance` | `string` | no | — |
| `isLoading` | `boolean` | sí | — |

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`RdsMySQLEventsColumns.tsx`](#components-aws-vista-rds-instancias-rds-mysql-events-rdsmysqleventscolumns-tsx), [`data-table-single.tsx`](../data-table.md#components-data-table-data-table-single-tsx)
- Usado por: [`InstanciasRdsMySQLChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-mysql-instanciasrdsmysqlchartcomponent-tsx)

---

<a id="components-aws-vista-rds-instancias-rds-mysql-info-rdsmysqlresourceviewhistoricinfocomponent-tsx"></a>
## `components/aws/vista-rds/instancias-rds-mysql/info/RdsMysqlResourceViewHistoricInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RdsMysqlResourceViewHistoricInfoComponent` `({ instances }: MysqlResourceViewHistoricInfoComponentProps)`

Interfaz `MysqlInstanceData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `TagList_Key` | `string[]` | no | — |
| `TagList_Value` | `string[]` | no | — |
| `region` | `string` | no | — |
| `DBInstanceIdentifier` | `string` | no | — |
| `InstanceCreateTime` | `{ $date: string }` | no | — |
| `DBInstanceStatus` | `string` | no | — |
| `DBInstanceClass` | `string` | no | — |
| `LicenseModel` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetIdentifier` | `string[]` | no | — |
| `Engine` | `string` | no | — |
| `EngineVersion` | `string` | no | — |
| `AllocatedStorage` | `number` | no | — |
| `StorageType` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetAvailabilityZone_Name` | `string[]` | no | — |
| `DBSubnetGroup_Subnets_SubnetStatus` | `string[]` | no | — |
| `Total_Subnets_RDS_Mysql` | `number` | no | — |
| `EnginePlusVersion` | `string` | no | — |
| `Allocated_Storage_RDS_Mysql_Formatted` | `string` | no | — |

Interfaz `MysqlResourceViewHistoricInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instances` | `MysqlInstanceData[]` | no | — |

Internos:

- función `getUptime` `(createTime: Date)`

- Usa: [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx)
- Usado por: [`RdsMysqlResourceViewInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-mysql-info-rdsmysqlresourceviewinfocomponent-tsx)

Notas de implementación:

- Ordenar instancias por fecha de observación (más reciente primero)
- JSX — Tags accordion
- JSX — Subnets accordion

---

<a id="components-aws-vista-rds-instancias-rds-mysql-info-rdsmysqlresourceviewinfocomponent-tsx"></a>
## `components/aws/vista-rds/instancias-rds-mysql/info/RdsMysqlResourceViewInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RdsMysqlResourceViewInfoComponent` `({ data }: RdsMysqlResourceViewInfoComponentProps)`

Interfaz `MysqlInstanceData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `TagList_Key` | `string[]` | no | — |
| `TagList_Value` | `string[]` | no | — |
| `region` | `string` | no | — |
| `DBInstanceIdentifier` | `string` | no | — |
| `InstanceCreateTime` | `{ $date: string }` | no | — |
| `DBInstanceStatus` | `string` | no | — |
| `DBInstanceClass` | `string` | no | — |
| `LicenseModel` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetIdentifier` | `string[]` | no | — |
| `Engine` | `string` | no | — |
| `EngineVersion` | `string` | no | — |
| `AllocatedStorage` | `number` | no | — |
| `StorageType` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetAvailabilityZone_Name` | `string[]` | no | — |
| `DBSubnetGroup_Subnets_SubnetStatus` | `string[]` | no | — |
| `Total_Subnets_RDS_Mysql` | `number` | no | — |
| `EnginePlusVersion` | `string` | no | — |
| `Allocated_Storage_RDS_Mysql_Formatted` | `string` | no | — |

Interfaz `RdsMysqlResourceViewInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `MysqlInstanceData[] \| null` | no | — |

Internos:

- función `getUptime` `(createTime: Date)`

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`RdsMysqlResourceViewHistoricInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-mysql-info-rdsmysqlresourceviewhistoricinfocomponent-tsx)
- Usado por: [`InstanciasRdsMySQLChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-mysql-instanciasrdsmysqlchartcomponent-tsx)

Notas de implementación:

- Obtener la instancia más reciente
- JSX — Métricas rápidas
- JSX — Tags Information
- JSX — Subnet Information
- JSX — Botón Ver Historial - AL FINAL como EC2

---

<a id="components-aws-vista-rds-instancias-rds-oracle-instanciasrdsoraclechartcomponent-tsx"></a>
## `components/aws/vista-rds/instancias-rds-oracle/InstanciasRdsOracleChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `InstanciasRdsOracleChartComponent` `({ startDate, endDate, region, instance = "", selectedKey, selectedValue, }: InstanciasRdsOracleProps)`

Interfaz `InstanciasRdsOracleProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | sí | — |
| `instance` | `string` | sí | — |
| `selectedKey` | `string \| null` | sí | — |
| `selectedValue` | `string \| null` | sí | — |

Interfaz `RdsOracleInstanceData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `TagList_Key` | `string[]` | no | — |
| `TagList_Value` | `string[]` | no | — |
| `region` | `string` | no | — |
| `DBInstanceIdentifier` | `string` | no | — |
| `InstanceCreateTime` | `{ $date: string }` | no | — |
| `DBInstanceStatus` | `string` | no | — |
| `DBInstanceClass` | `string` | no | — |
| `LicenseModel` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetIdentifier` | `string[]` | no | — |
| `Engine` | `string` | no | — |
| `EngineVersion` | `string` | no | — |
| `AllocatedStorage` | `number` | no | — |
| `StorageType` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetAvailabilityZone_Name` | `string[]` | no | — |
| `DBSubnetGroup_Subnets_SubnetStatus` | `string[]` | no | — |
| `Total_Subnets_RDS_Oracle` | `number` | no | — |
| `EnginePlusVersion` | `string` | no | — |
| `Allocated_Storage_RDS_Oracle_Formatted` | `string` | no | — |

Interfaz `RdsMetricItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `MetricLabel` | `string` | no | — |
| `Value` | `number` | no | — |
| `sync_time` | `string` | no | — |
| `Unit` | `string` | sí | — |

Interfaz `RdsMetricsData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metrics_data` | `RdsMetricItem[]` | no | — |
| `calculated_summary` | `Record<string, unknown>` | sí | — |

Interfaz `MetricPoint`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `Resource` | `string` | no | — |
| `Timestamp` | `string` | no | — |
| `Value` | `number` | no | — |
| `total` | `number` | sí | — |
| `unused` | `number` | sí | — |
| `used` | `number` | sí | — |
| `MetricId` | `string` | no | — |
| `MetricLabel` | `string` | no | — |

Internos:

- función `transformMetricsForChart` `(metricsData: RdsMetricsData): MetricPoint[]` — Función para transformar los datos de métricas al formato esperado por el gráfico

- API: `/api/aws/bridge/db/instancias-rds-oracle`, `/api/aws/bridge/db/instancias-rds-oracle-events`, `/api/aws/bridge/db/instancias-rds-oracle-metrics`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx), [`RdsOracleResourceViewInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-oracle-info-rdsoracleresourceviewinfocomponent-tsx), [`RdsOracleEventsTable.tsx`](#components-aws-vista-rds-instancias-rds-oracle-events-rdsoracleeventstable-tsx), [`RdsResourceViewCpuCreditsComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewcpucreditscomponent-tsx), [`RdsResourceViewCpuUsageComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewcpuusagecomponent-tsx), [`RdsResourceViewDbConnectionsComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewdbconnectionscomponent-tsx), [`RdsResourceViewMemoryComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewmemorycomponent-tsx), [`RdsResourceViewStorageComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewstoragecomponent-tsx), [`RdsResourceViewIopsComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewiopscomponent-tsx), [`MainRdsResourceViewMetricsSummaryComponent.tsx`](#components-aws-vista-rds-graficos-mainrdsresourceviewmetricssummarycomponent-tsx)
- Usado por: [`MainViewInstanciasRdsOracleComponent.tsx`](#components-aws-vista-rds-instancias-rds-oracle-mainviewinstanciasrdsoraclecomponent-tsx)

Notas de implementación:

- Eventos de la instancia
- eCharts para "Estado de Instancias" (vista general)
- Loaders / errores
- Sin selección de instancia -> mensaje
- Datos de la instancia concreta
- Carga/errores de métricas del summary
- JSX — Panel izquierdo - Información de la instancia
- JSX — Panel derecho - Resumen de métricas
- JSX — Consumo y Balance de Créditos de CPU (Burstable)
- JSX — Gráfico 2: CPU Usage
- JSX — Gráfico 3: Database Connections
- JSX — Gráfico 4: Memory
- JSX — Gráfico 5: IOPS
- JSX — Gráfico 6: Storage
- JSX — Tabla de Eventos RDS Oracle

---

<a id="components-aws-vista-rds-instancias-rds-oracle-mainviewinstanciasrdsoraclecomponent-tsx"></a>
## `components/aws/vista-rds/instancias-rds-oracle/MainViewInstanciasRdsOracleComponent.tsx`

**Componente**

Exporta:

- componente `MainViewInstanciasRdsOracleComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`InstanciasRdsOracleChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-oracle-instanciasrdsoraclechartcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-recursos-instancias-rds-oracle-page-tsx)

---

<a id="components-aws-vista-rds-instancias-rds-oracle-events-rdsoracleeventscolumns-tsx"></a>
## `components/aws/vista-rds/instancias-rds-oracle/events/RdsOracleEventsColumns.tsx`

**Módulo (cliente)**

Exporta:

- tipo `RdsOracleEvent` = `{ _id: string EventName: string EventSource: string EventTime: string Username: string sync_time: string Resources_Reso…`
- constante `rdsOracleEventColumns` = `[ { header: 'Nombre Evento', accessorKey: 'EventName', cell: ({ getValue }) => …`

Internos:

- función `getRdsConsoleUrl` `(resourceType: string, resourceName: string, region = 'us-east-1')`
- componente `RdsOracleEventDetailsModal` `({ event }: { event: RdsOracleEvent })`
- componente `RdsResourcesCell` `({ resourceNames, resourceTypes }: { resourceNames: string[]; resourceTypes: string[] })`

- Usa: [`button.tsx`](../ui.md#components-ui-button-tsx), [`dropdown-menu.tsx`](../ui.md#components-ui-dropdown-menu-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx)
- Usado por: [`RdsOracleEventsTable.tsx`](#components-aws-vista-rds-instancias-rds-oracle-events-rdsoracleeventstable-tsx)

---

<a id="components-aws-vista-rds-instancias-rds-oracle-events-rdsoracleeventstable-tsx"></a>
## `components/aws/vista-rds/instancias-rds-oracle/events/RdsOracleEventsTable.tsx`

**Componente**

Exporta:

- componente `RdsOracleEventsTableComponent` `({ data, startDate, endDate, instance, isLoading = false }: RdsOracleEventsTableComponentProps)`

Interfaz `RdsOracleEventsTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `unknown` | sí | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `instance` | `string` | no | — |
| `isLoading` | `boolean` | sí | — |

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`RdsOracleEventsColumns.tsx`](#components-aws-vista-rds-instancias-rds-oracle-events-rdsoracleeventscolumns-tsx), [`data-table-single.tsx`](../data-table.md#components-data-table-data-table-single-tsx)
- Usado por: [`InstanciasRdsOracleChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-oracle-instanciasrdsoraclechartcomponent-tsx)

---

<a id="components-aws-vista-rds-instancias-rds-oracle-info-rdsoracleresourceviewhistoricinfocomponent-tsx"></a>
## `components/aws/vista-rds/instancias-rds-oracle/info/RdsOracleResourceViewHistoricInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RdsOracleResourceViewHistoricInfoComponent` `({ instances }: OracleResourceViewHistoricInfoComponentProps)`

Interfaz `OracleInstanceData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `TagList_Key` | `string[]` | no | — |
| `TagList_Value` | `string[]` | no | — |
| `region` | `string` | no | — |
| `DBInstanceIdentifier` | `string` | no | — |
| `InstanceCreateTime` | `{ $date: string }` | no | — |
| `DBInstanceStatus` | `string` | no | — |
| `DBInstanceClass` | `string` | no | — |
| `LicenseModel` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetIdentifier` | `string[]` | no | — |
| `Engine` | `string` | no | — |
| `EngineVersion` | `string` | no | — |
| `AllocatedStorage` | `number` | no | — |
| `StorageType` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetAvailabilityZone_Name` | `string[]` | no | — |
| `DBSubnetGroup_Subnets_SubnetStatus` | `string[]` | no | — |
| `Total_Subnets_RDS_Oracle` | `number` | no | — |
| `EnginePlusVersion` | `string` | no | — |
| `Allocated_Storage_RDS_Oracle_Formatted` | `string` | no | — |

Interfaz `OracleResourceViewHistoricInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instances` | `OracleInstanceData[]` | no | — |

Internos:

- función `getUptime` `(createTime: Date)`

- Usa: [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx)
- Usado por: [`RdsOracleResourceViewInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-oracle-info-rdsoracleresourceviewinfocomponent-tsx)

---

<a id="components-aws-vista-rds-instancias-rds-oracle-info-rdsoracleresourceviewinfocomponent-tsx"></a>
## `components/aws/vista-rds/instancias-rds-oracle/info/RdsOracleResourceViewInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RdsOracleResourceViewInfoComponent` `({ data }: RdsOracleResourceViewInfoComponentProps)`

Interfaz `OracleInstanceData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `TagList_Key` | `string[]` | no | — |
| `TagList_Value` | `string[]` | no | — |
| `region` | `string` | no | — |
| `DBInstanceIdentifier` | `string` | no | — |
| `InstanceCreateTime` | `{ $date: string }` | no | — |
| `DBInstanceStatus` | `string` | no | — |
| `DBInstanceClass` | `string` | no | — |
| `LicenseModel` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetIdentifier` | `string[]` | no | — |
| `Engine` | `string` | no | — |
| `EngineVersion` | `string` | no | — |
| `AllocatedStorage` | `number` | no | — |
| `StorageType` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetAvailabilityZone_Name` | `string[]` | no | — |
| `DBSubnetGroup_Subnets_SubnetStatus` | `string[]` | no | — |
| `Total_Subnets_RDS_Oracle` | `number` | no | — |
| `EnginePlusVersion` | `string` | no | — |
| `Allocated_Storage_RDS_Oracle_Formatted` | `string` | no | — |

Interfaz `RdsOracleResourceViewInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `OracleInstanceData[] \| null` | no | — |

Internos:

- función `getUptime` `(createTime: Date)`

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`RdsOracleResourceViewHistoricInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-oracle-info-rdsoracleresourceviewhistoricinfocomponent-tsx)
- Usado por: [`InstanciasRdsOracleChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-oracle-instanciasrdsoraclechartcomponent-tsx)

---

<a id="components-aws-vista-rds-instancias-rds-pg-instanciasrdspgchartcomponent-tsx"></a>
## `components/aws/vista-rds/instancias-rds-pg/InstanciasRdsPgChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `InstanciasRdsPgChartComponent` `({ startDate, endDate, region, instance = "", selectedKey, selectedValue, }: InstanciasRdsPgProps)`

Interfaz `InstanciasRdsPgProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | sí | — |
| `instance` | `string` | sí | — |
| `selectedKey` | `string \| null` | sí | — |
| `selectedValue` | `string \| null` | sí | — |

Interfaz `RdsInstanceData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `TagList_Key` | `string[]` | no | — |
| `TagList_Value` | `string[]` | no | — |
| `region` | `string` | no | — |
| `DBInstanceIdentifier` | `string` | no | — |
| `InstanceCreateTime` | `{ $date: string }` | no | — |
| `DBInstanceStatus` | `string` | no | — |
| `DBInstanceClass` | `string` | no | — |
| `LicenseModel` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetIdentifier` | `string[]` | no | — |
| `Engine` | `string` | no | — |
| `EngineVersion` | `string` | no | — |
| `AllocatedStorage` | `number` | no | — |
| `StorageType` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetAvailabilityZone_Name` | `string[]` | no | — |
| `DBSubnetGroup_Subnets_SubnetStatus` | `string[]` | no | — |
| `Total_Subnets_RDS_Postgresql` | `number` | no | — |
| `EnginePlusVersion` | `string` | no | — |
| `Allocated_Storage_RDS_Postgresql_Formatted` | `string` | no | — |

Interfaz `RdsMetricItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `MetricLabel` | `string` | no | — |
| `Value` | `number` | no | — |
| `sync_time` | `string` | no | — |
| `Unit` | `string` | sí | — |

Interfaz `MetricPoint`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `Resource` | `string` | no | — |
| `Timestamp` | `string` | no | — |
| `Value` | `number` | no | — |
| `total` | `number` | sí | — |
| `unused` | `number` | sí | — |
| `used` | `number` | sí | — |
| `MetricId` | `string` | no | — |
| `MetricLabel` | `string` | no | — |

Interfaz `RdsMetricsData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metrics_data` | `MetricPoint[]` | no | — |
| `calculated_summary` | `Record<string, unknown>` | sí | — |

- API: `/api/aws/bridge/db/instancias-rds-pg`, `/api/aws/bridge/db/instancias-rds-pg-events`, `/api/aws/bridge/db/instancias-rds-pg-metrics`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx), [`RdsResourceViewInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-pg-info-rdsresourceviewinfocomponent-tsx), [`RdsPgEventsTable.tsx`](#components-aws-vista-rds-instancias-rds-pg-events-rdspgeventstable-tsx), [`RdsResourceViewCpuCreditsComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewcpucreditscomponent-tsx), [`RdsResourceViewCpuUsageComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewcpuusagecomponent-tsx), [`RdsResourceViewDbConnectionsComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewdbconnectionscomponent-tsx), [`RdsResourceViewMemoryComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewmemorycomponent-tsx), [`RdsResourceViewStorageComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewstoragecomponent-tsx), [`RdsResourceViewIopsComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewiopscomponent-tsx), [`MainRdsResourceViewMetricsSummaryComponent.tsx`](#components-aws-vista-rds-graficos-mainrdsresourceviewmetricssummarycomponent-tsx)
- Usado por: [`MainViewInstanciasRdsPgComponent.tsx`](#components-aws-vista-rds-instancias-rds-pg-mainviewinstanciasrdspgcomponent-tsx)

Notas de implementación:

- Eventos de la instancia
- eCharts para "Estado de Instancias" (vista general)
- ← Función para transformar los datos de métricas al formato esperado por el gráfico
- Los datos ya vienen en el formato correcto desde la API
- Loaders / errores
- Sin selección de instancia -> mensaje
- Datos de la instancia concreta
- Carga/errores de métricas del summary
- JSX — Panel izquierdo - Información de la instancia
- JSX — Panel derecho - Resumen de métricas
- JSX — Sección "Métricas de la Instancia"
- JSX — ← Aquí se integra el gráfico de CPU Credits
- JSX — Gráfico 1: CPU Credits
- JSX — Gráfico 2: CPU Usage
- JSX — Gráfico 3: Database Connections
- JSX — Gráfico 4: Memory
- JSX — Gráfico 5: IOPS
- JSX — Gráfico 6: Storage
- JSX — Tabla de Eventos RDS PostgreSQL

---

<a id="components-aws-vista-rds-instancias-rds-pg-mainviewinstanciasrdspgcomponent-tsx"></a>
## `components/aws/vista-rds/instancias-rds-pg/MainViewInstanciasRdsPgComponent.tsx`

**Componente**

Exporta:

- componente `MainViewInstanciasRdsPgComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`InstanciasRdsPgChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-pg-instanciasrdspgchartcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-recursos-instancias-rds-pg-page-tsx)

---

<a id="components-aws-vista-rds-instancias-rds-pg-events-rdspgeventscolumns-tsx"></a>
## `components/aws/vista-rds/instancias-rds-pg/events/RdsPgEventsColumns.tsx`

**Módulo (cliente)**

Exporta:

- tipo `RdsPgEvent` = `{ _id: string EventName: string EventSource: string EventTime: string Username: string sync_time: string Resources_Reso…`
- constante `rdsPgEventColumns` = `[ { header: 'Nombre Evento', accessorKey: 'EventName', cell: (value, row) => ( …`

Internos:

- función `getRdsConsoleUrl` `(resourceType: string, resourceName: string, region = 'us-east-1')`
- componente `RdsPgEventDetailsModal` `({ event }: { event: RdsPgEvent })`
- componente `RdsResourcesCell` `({ resourceNames, resourceTypes }: { resourceNames: string[]; resourceTypes: string[] })`

- Usa: [`button.tsx`](../ui.md#components-ui-button-tsx), [`dropdown-menu.tsx`](../ui.md#components-ui-dropdown-menu-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx)
- Usado por: [`RdsPgEventsTable.tsx`](#components-aws-vista-rds-instancias-rds-pg-events-rdspgeventstable-tsx)

Notas de implementación:

- _RdsPgEventDetailsModal_: JSX — InformaciÃ³n especÃ­fica de RDS

---

<a id="components-aws-vista-rds-instancias-rds-pg-events-rdspgeventstable-tsx"></a>
## `components/aws/vista-rds/instancias-rds-pg/events/RdsPgEventsTable.tsx`

**Componente**

Exporta:

- componente `RdsPgEventsTableComponent` `({ data, startDate, endDate, instance, isLoading = false }: RdsPgEventsTableComponentProps)`

Interfaz `RdsPgEventsTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `unknown` | sí | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `instance` | `string` | no | — |
| `isLoading` | `boolean` | sí | — |

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`RdsPgEventsColumns.tsx`](#components-aws-vista-rds-instancias-rds-pg-events-rdspgeventscolumns-tsx), [`data-table-single.tsx`](../data-table.md#components-data-table-data-table-single-tsx)
- Usado por: [`InstanciasRdsPgChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-pg-instanciasrdspgchartcomponent-tsx)

---

<a id="components-aws-vista-rds-instancias-rds-pg-info-rdsresourceviewhistoricinfocomponent-tsx"></a>
## `components/aws/vista-rds/instancias-rds-pg/info/RdsResourceViewHistoricInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RdsResourceViewHistoricInfoComponent` `({ instances }: RdsResourceViewHistoricInfoComponentProps)`

Interfaz `RdsInstanceData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `TagList_Key` | `string[]` | no | — |
| `TagList_Value` | `string[]` | no | — |
| `region` | `string` | no | — |
| `DBInstanceIdentifier` | `string` | no | — |
| `InstanceCreateTime` | `{ $date: string }` | no | — |
| `DBInstanceStatus` | `string` | no | — |
| `DBInstanceClass` | `string` | no | — |
| `LicenseModel` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetIdentifier` | `string[]` | no | — |
| `Engine` | `string` | no | — |
| `EngineVersion` | `string` | no | — |
| `AllocatedStorage` | `number` | no | — |
| `StorageType` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetAvailabilityZone_Name` | `string[]` | no | — |
| `DBSubnetGroup_Subnets_SubnetStatus` | `string[]` | no | — |
| `Total_Subnets_RDS_Postgresql` | `number` | no | — |
| `EnginePlusVersion` | `string` | no | — |
| `Allocated_Storage_RDS_Postgresql_Formatted` | `string` | no | — |

Interfaz `RdsResourceViewHistoricInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instances` | `RdsInstanceData[]` | no | — |

Internos:

- función `getUptime` `(createTime: Date)`

- Usa: [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx)
- Usado por: [`RdsResourceViewInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-pg-info-rdsresourceviewinfocomponent-tsx)

Notas de implementación:

- Ordenar instancias por fecha de observación (más reciente primero)
- JSX — Tags accordion
- JSX — Subnets accordion

---

<a id="components-aws-vista-rds-instancias-rds-pg-info-rdsresourceviewinfocomponent-tsx"></a>
## `components/aws/vista-rds/instancias-rds-pg/info/RdsResourceViewInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RdsResourceViewInfoComponent` `({ data }: RdsResourceViewInfoComponentProps)`

Interfaz `RdsInstanceData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `TagList_Key` | `string[]` | no | — |
| `TagList_Value` | `string[]` | no | — |
| `region` | `string` | no | — |
| `DBInstanceIdentifier` | `string` | no | — |
| `InstanceCreateTime` | `{ $date: string }` | no | — |
| `DBInstanceStatus` | `string` | no | — |
| `DBInstanceClass` | `string` | no | — |
| `LicenseModel` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetIdentifier` | `string[]` | no | — |
| `Engine` | `string` | no | — |
| `EngineVersion` | `string` | no | — |
| `AllocatedStorage` | `number` | no | — |
| `StorageType` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetAvailabilityZone_Name` | `string[]` | no | — |
| `DBSubnetGroup_Subnets_SubnetStatus` | `string[]` | no | — |
| `Total_Subnets_RDS_Postgresql` | `number` | no | — |
| `EnginePlusVersion` | `string` | no | — |
| `Allocated_Storage_RDS_Postgresql_Formatted` | `string` | no | — |

Interfaz `RdsResourceViewInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `RdsInstanceData[] \| null` | no | — |

Internos:

- función `getUptime` `(createTime: Date)`

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`RdsResourceViewHistoricInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-pg-info-rdsresourceviewhistoricinfocomponent-tsx)
- Usado por: [`InstanciasRdsPgChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-pg-instanciasrdspgchartcomponent-tsx)

Notas de implementación:

- Obtener la instancia mas reciente
- JSX — Metricas rapidas
- JSX — Tags Information
- JSX — Subnet Information

---

<a id="components-aws-vista-rds-instancias-rds-sqlserver-instanciasrdssqlserverchartcomponent-tsx"></a>
## `components/aws/vista-rds/instancias-rds-sqlserver/InstanciasRdsSQLServerChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `InstanciasRdsSQLServerChartComponent` `({ startDate, endDate, region, instance = "", selectedKey, selectedValue, }: InstanciasRdsSQLServerProps)`

Interfaz `InstanciasRdsSQLServerProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | sí | — |
| `instance` | `string` | sí | — |
| `selectedKey` | `string \| null` | sí | — |
| `selectedValue` | `string \| null` | sí | — |

Interfaz `RdsInstanceData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `TagList_Key` | `string[]` | no | — |
| `TagList_Value` | `string[]` | no | — |
| `region` | `string` | no | — |
| `DBInstanceIdentifier` | `string` | no | — |
| `InstanceCreateTime` | `{ $date: string }` | no | — |
| `DBInstanceStatus` | `string` | no | — |
| `DBInstanceClass` | `string` | no | — |
| `LicenseModel` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetIdentifier` | `string[]` | no | — |
| `Engine` | `string` | no | — |
| `EngineVersion` | `string` | no | — |
| `AllocatedStorage` | `number` | no | — |
| `StorageType` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetAvailabilityZone_Name` | `string[]` | no | — |
| `DBSubnetGroup_Subnets_SubnetStatus` | `string[]` | no | — |
| `Total_Subnets_RDS_SQLServer` | `number` | no | — |
| `EnginePlusVersion` | `string` | no | — |
| `Allocated_Storage_RDS_SQLServer_Formatted` | `string` | no | — |

Interfaz `RdsMetricItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `MetricLabel` | `string` | no | — |
| `Value` | `number` | no | — |
| `sync_time` | `string` | no | — |
| `Unit` | `string` | sí | — |

Interfaz `RdsMetricsData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metrics_data` | `RdsMetricItem[]` | no | — |
| `calculated_summary` | `Record<string, unknown>` | sí | — |

Interfaz `MetricPoint`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `Resource` | `string` | no | — |
| `Timestamp` | `string` | no | — |
| `Value` | `number` | no | — |
| `total` | `number` | sí | — |
| `unused` | `number` | sí | — |
| `used` | `number` | sí | — |
| `MetricId` | `string` | no | — |
| `MetricLabel` | `string` | no | — |

Internos:

- función `transformMetricsForChart` `(metricsData: RdsMetricsData): MetricPoint[]` — Función para transformar los datos de métricas al formato esperado por el gráfico

- API: `/api/aws/bridge/db/instancias-rds-sqlserver`, `/api/aws/bridge/db/instancias-rds-sqlserver-events`, `/api/aws/bridge/db/instancias-rds-sqlserver-metrics`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx), [`RdsSQLServerResourceViewInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-info-rdssqlserverresourceviewinfocomponent-tsx), [`RdsSQLServerEventsTable.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-events-rdssqlservereventstable-tsx), [`RdsResourceViewCpuCreditsComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewcpucreditscomponent-tsx), [`RdsResourceViewCpuUsageComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewcpuusagecomponent-tsx), [`RdsResourceViewDbConnectionsComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewdbconnectionscomponent-tsx), [`RdsResourceViewMemoryComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewmemorycomponent-tsx), [`RdsResourceViewStorageComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewstoragecomponent-tsx), [`RdsResourceViewIopsComponent.tsx`](#components-aws-vista-rds-graficos-rdsresourceviewiopscomponent-tsx), [`MainRdsResourceViewMetricsSummaryComponent.tsx`](#components-aws-vista-rds-graficos-mainrdsresourceviewmetricssummarycomponent-tsx)
- Usado por: [`MainViewInstanciasRdsSQLServerComponent.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-mainviewinstanciasrdssqlservercomponent-tsx)

Notas de implementación:

- _transformMetricsForChart_: Los datos ya vienen en el formato correcto desde la API
- Eventos de la instancia
- eCharts para "Estado de Instancias" (vista general)
- Loaders / errores
- Sin selección de instancia -> mensaje
- Datos de la instancia concreta
- Carga/errores de métricas del summary
- JSX — Panel izquierdo - Información de la instancia
- JSX — Panel derecho - Resumen de métricas
- JSX — Sección placeholder para futuras métricas
- JSX — Gráfico 2: CPU Usage
- JSX — Gráfico 3: Database Connections
- JSX — Gráfico 4: Memory
- JSX — Gráfico 5: IOPS
- JSX — Gráfico 6: Storage
- JSX — Tabla de Eventos RDS SQL Server

---

<a id="components-aws-vista-rds-instancias-rds-sqlserver-mainviewinstanciasrdssqlservercomponent-tsx"></a>
## `components/aws/vista-rds/instancias-rds-sqlserver/MainViewInstanciasRdsSQLServerComponent.tsx`

**Componente**

Exporta:

- componente `MainViewInstanciasRdsSQLServerComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`InstanciasRdsSQLServerChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-instanciasrdssqlserverchartcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-recursos-instancias-rds-sqlserver-page-tsx)

---

<a id="components-aws-vista-rds-instancias-rds-sqlserver-events-rdssqlservereventscolumns-tsx"></a>
## `components/aws/vista-rds/instancias-rds-sqlserver/events/RdsSQLServerEventsColumns.tsx`

**Módulo (cliente)**

Exporta:

- tipo `RdsSQLServerEvent` = `{ _id: string EventName: string EventSource: string EventTime: string Username: string sync_time: string Resources_Reso…`
- constante `rdsSQLServerEventColumns` = `[ { header: 'Nombre Evento', accessorKey: 'EventName', cell: ({ getValue }) => …`

Internos:

- función `getRdsConsoleUrl` `(resourceType: string, resourceName: string, region = 'us-east-1')`
- componente `RdsSQLServerEventDetailsModal` `({ event }: { event: RdsSQLServerEvent })`
- componente `RdsResourcesCell` `({ resourceNames, resourceTypes }: { resourceNames: string[]; resourceTypes: string[] })`

- Usa: [`button.tsx`](../ui.md#components-ui-button-tsx), [`dropdown-menu.tsx`](../ui.md#components-ui-dropdown-menu-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx)
- Usado por: [`RdsSQLServerEventsTable.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-events-rdssqlservereventstable-tsx)

---

<a id="components-aws-vista-rds-instancias-rds-sqlserver-events-rdssqlservereventstable-tsx"></a>
## `components/aws/vista-rds/instancias-rds-sqlserver/events/RdsSQLServerEventsTable.tsx`

**Componente**

Exporta:

- componente `RdsSQLServerEventsTableComponent` `({ data, startDate, endDate, instance, isLoading = false }: RdsSQLServerEventsTableComponentProps)`

Interfaz `RdsSQLServerEventsTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `unknown` | sí | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `instance` | `string` | no | — |
| `isLoading` | `boolean` | sí | — |

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`RdsSQLServerEventsColumns.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-events-rdssqlservereventscolumns-tsx), [`data-table-single.tsx`](../data-table.md#components-data-table-data-table-single-tsx)
- Usado por: [`InstanciasRdsSQLServerChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-instanciasrdssqlserverchartcomponent-tsx)

---

<a id="components-aws-vista-rds-instancias-rds-sqlserver-info-rdssqlserverresourceviewhistoricinfocomponent-tsx"></a>
## `components/aws/vista-rds/instancias-rds-sqlserver/info/RdsSQLServerResourceViewHistoricInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RdsSQLServerResourceViewHistoricInfoComponent` `({ instances }: SQLServerResourceViewHistoricInfoComponentProps)`

Interfaz `SQLServerInstanceData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `TagList_Key` | `string[]` | no | — |
| `TagList_Value` | `string[]` | no | — |
| `region` | `string` | no | — |
| `DBInstanceIdentifier` | `string` | no | — |
| `InstanceCreateTime` | `{ $date: string }` | no | — |
| `DBInstanceStatus` | `string` | no | — |
| `DBInstanceClass` | `string` | no | — |
| `LicenseModel` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetIdentifier` | `string[]` | no | — |
| `Engine` | `string` | no | — |
| `EngineVersion` | `string` | no | — |
| `AllocatedStorage` | `number` | no | — |
| `StorageType` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetAvailabilityZone_Name` | `string[]` | no | — |
| `DBSubnetGroup_Subnets_SubnetStatus` | `string[]` | no | — |
| `Total_Subnets_RDS_SQLServer` | `number` | no | — |
| `EnginePlusVersion` | `string` | no | — |
| `Allocated_Storage_RDS_SQLServer_Formatted` | `string` | no | — |

Interfaz `SQLServerResourceViewHistoricInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instances` | `SQLServerInstanceData[]` | no | — |

Internos:

- función `getUptime` `(createTime: Date)`

- Usa: [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx)
- Usado por: [`RdsSQLServerResourceViewInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-info-rdssqlserverresourceviewinfocomponent-tsx)

---

<a id="components-aws-vista-rds-instancias-rds-sqlserver-info-rdssqlserverresourceviewinfocomponent-tsx"></a>
## `components/aws/vista-rds/instancias-rds-sqlserver/info/RdsSQLServerResourceViewInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RdsSQLServerResourceViewInfoComponent` `({ data }: RdsSQLServerResourceViewInfoComponentProps)`

Interfaz `SQLServerInstanceData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `TagList_Key` | `string[]` | no | — |
| `TagList_Value` | `string[]` | no | — |
| `region` | `string` | no | — |
| `DBInstanceIdentifier` | `string` | no | — |
| `InstanceCreateTime` | `{ $date: string }` | no | — |
| `DBInstanceStatus` | `string` | no | — |
| `DBInstanceClass` | `string` | no | — |
| `LicenseModel` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetIdentifier` | `string[]` | no | — |
| `Engine` | `string` | no | — |
| `EngineVersion` | `string` | no | — |
| `AllocatedStorage` | `number` | no | — |
| `StorageType` | `string` | no | — |
| `DBSubnetGroup_Subnets_SubnetAvailabilityZone_Name` | `string[]` | no | — |
| `DBSubnetGroup_Subnets_SubnetStatus` | `string[]` | no | — |
| `Total_Subnets_RDS_SQLServer` | `number` | no | — |
| `EnginePlusVersion` | `string` | no | — |
| `Allocated_Storage_RDS_SQLServer_Formatted` | `string` | no | — |

Interfaz `RdsSQLServerResourceViewInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `SQLServerInstanceData[] \| null` | no | — |

Internos:

- función `getUptime` `(createTime: Date)`

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`RdsSQLServerResourceViewHistoricInfoComponent.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-info-rdssqlserverresourceviewhistoricinfocomponent-tsx)
- Usado por: [`InstanciasRdsSQLServerChartComponent.tsx`](#components-aws-vista-rds-instancias-rds-sqlserver-instanciasrdssqlserverchartcomponent-tsx)

