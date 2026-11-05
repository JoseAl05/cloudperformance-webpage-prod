# Componentes `components/aws/vista-autoscaling/`

[← Índice](../../README.md)

Vista de Auto Scaling Groups: instancias, eventos, capacidad y métricas.

Archivos:

- [`components/aws/vista-autoscaling/autoscaling-groups/InstanciasAutoscalingGroupsChartComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-instanciasautoscalinggroupschartcomponent-tsx)
- [`components/aws/vista-autoscaling/autoscaling-groups/MainViewInstanciasAutoscalingGroupsComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-mainviewinstanciasautoscalinggroupscomponent-tsx)
- [`components/aws/vista-autoscaling/autoscaling-groups/events/AutoscalingGroupsEventsColumns.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-events-autoscalinggroupseventscolumns-tsx)
- [`components/aws/vista-autoscaling/autoscaling-groups/events/AutoscalingGroupsEventsTable.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-events-autoscalinggroupseventstable-tsx)
- [`components/aws/vista-autoscaling/autoscaling-groups/graficos/AutoscalingGroupsInstancesColumns.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-graficos-autoscalinggroupsinstancescolumns-tsx)
- [`components/aws/vista-autoscaling/autoscaling-groups/graficos/AutoscalingGroupsResourceViewInstancesVsMaxMinComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-graficos-autoscalinggroupsresourceviewinstancesvsmaxmincomponent-tsx)
- [`components/aws/vista-autoscaling/autoscaling-groups/graficos/AutoscalingGroupsResourceViewInstanciasComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-graficos-autoscalinggroupsresourceviewinstanciascomponent-tsx)
- [`components/aws/vista-autoscaling/autoscaling-groups/graficos/AutoscalingGroupsResourceViewStatesInstancesComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-graficos-autoscalinggroupsresourceviewstatesinstancescomponent-tsx)
- [`components/aws/vista-autoscaling/autoscaling-groups/graficos/MainAutoscalingGroupsResourceViewMetricsSummaryComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-graficos-mainautoscalinggroupsresourceviewmetricssummarycomponent-tsx)
- [`components/aws/vista-autoscaling/autoscaling-groups/info/AutoscalingGroupsResourceViewHistoricInfoComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-info-autoscalinggroupsresourceviewhistoricinfocomponent-tsx)
- [`components/aws/vista-autoscaling/autoscaling-groups/info/AutoscalingGroupsResourceViewInfoComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-info-autoscalinggroupsresourceviewinfocomponent-tsx)

<a id="components-aws-vista-autoscaling-autoscaling-groups-instanciasautoscalinggroupschartcomponent-tsx"></a>
## `components/aws/vista-autoscaling/autoscaling-groups/InstanciasAutoscalingGroupsChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `InstanciasAutoscalingGroupsChartComponent` `(props: unknown)`

Interfaz `AutoscalingGroupData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `region` | `string` | no | — |
| `AutoScalingGroupName` | `string` | no | — |
| `CreatedTime` | `{ $date: string }` | no | — |
| `LaunchTemplate_LaunchTemplateId` | `string \| null` | no | — |
| `LaunchTemplate_LaunchTemplateName` | `string \| null` | no | — |
| `LaunchTemplate_Version` | `string \| null` | no | — |
| `MinSize` | `number` | no | — |
| `MaxSize` | `number` | no | — |
| `Tags_Key` | `string[]` | no | — |
| `Tags_Value` | `string[]` | no | — |
| `Capacidad_Total_ASG` | `number` | no | — |
| `Launch_Template_Info_Formatted` | `string \| null` | no | — |
| `Size_Range_Formatted` | `string` | no | — |
| `Total_Tags_ASG` | `number` | no | — |

- API: `/api/aws/bridge/autoscaling/autoscaling_groups`, `/api/aws/bridge/autoscaling/autoscaling_groups_events`, `/api/aws/bridge/autoscaling/autoscaling_groups_instances`, `/api/aws/bridge/autoscaling/autoscaling_groups_metrics`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`AutoscalingGroupsResourceViewInfoComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-info-autoscalinggroupsresourceviewinfocomponent-tsx), [`MainAutoscalingGroupsResourceViewMetricsSummaryComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-graficos-mainautoscalinggroupsresourceviewmetricssummarycomponent-tsx), [`AutoscalingGroupsResourceViewInstanciasComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-graficos-autoscalinggroupsresourceviewinstanciascomponent-tsx), [`AutoscalingGroupsResourceViewStatesInstancesComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-graficos-autoscalinggroupsresourceviewstatesinstancescomponent-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`AutoscalingGroupsResourceViewInstancesVsMaxMinComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-graficos-autoscalinggroupsresourceviewinstancesvsmaxmincomponent-tsx), [`AutoscalingGroupsEventsTable.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-events-autoscalinggroupseventstable-tsx)
- Usado por: [`MainViewInstanciasAutoscalingGroupsComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-mainviewinstanciasautoscalinggroupscomponent-tsx)

Notas de implementación:

- Construir URL usando la estructura correcta que espera tu API
- TODOS LOS HOOKS JUNTOS AL PRINCIPIO
- API para instancias del autoscaling group
- API para métricas del autoscaling group
- API para eventos del autoscaling group (usando instance por ahora)
- DESPUÉS de todos los hooks, hacer el filtrado
- JSX — Tabla de Instancias del Autoscaling Group
- JSX — Gráfico de Estados de Instancias
- JSX — Gráfico de Instancias vs Max/Min
- JSX — Tabla de Eventos del Autoscaling Group

---

<a id="components-aws-vista-autoscaling-autoscaling-groups-mainviewinstanciasautoscalinggroupscomponent-tsx"></a>
## `components/aws/vista-autoscaling/autoscaling-groups/MainViewInstanciasAutoscalingGroupsComponent.tsx`

**Componente**

Exporta:

- componente `MainViewInstanciasAutoscalingGroupsComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`InstanciasAutoscalingGroupsChartComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-instanciasautoscalinggroupschartcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-recursos-autoscaling-groups-page-tsx)

---

<a id="components-aws-vista-autoscaling-autoscaling-groups-events-autoscalinggroupseventscolumns-tsx"></a>
## `components/aws/vista-autoscaling/autoscaling-groups/events/AutoscalingGroupsEventsColumns.tsx`

**Módulo (cliente)**

Exporta:

- tipo `AutoscalingGroupEvent` = `{ _id: { $oid: string } sync_time: { $date: string } Resources_ResourceName: string[] EventName: string EventSource: st…`
- constante `autoscalingGroupEventColumns` = `[ { header: 'Nombre Evento', accessorKey: 'EventName', cell: ({ getValue }) => …`

Internos:

- función `getAutoscalingConsoleUrl` `(resourceType: string, resourceName: string, region = 'us-east-1')`
- componente `AutoscalingEventDetailsModal` `({ event }: { event: AutoscalingGroupEvent })`
- componente `AutoscalingResourcesCell` `({ resourceNames, resourceTypes }: { resourceNames: string[]; resourceTypes: string[] })`

- Usa: [`button.tsx`](../ui.md#components-ui-button-tsx), [`dropdown-menu.tsx`](../ui.md#components-ui-dropdown-menu-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx)
- Usado por: [`AutoscalingGroupsEventsTable.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-events-autoscalinggroupseventstable-tsx)

---

<a id="components-aws-vista-autoscaling-autoscaling-groups-events-autoscalinggroupseventstable-tsx"></a>
## `components/aws/vista-autoscaling/autoscaling-groups/events/AutoscalingGroupsEventsTable.tsx`

**Componente**

Exporta:

- componente `AutoscalingGroupsEventsTableComponent` `({ data, startDate, endDate, autoscalingGroup, isLoading = false }: AutoscalingGroupsEventsTableComponentProps)`

Interfaz `AutoscalingGroupsEventsTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `unknown` | sí | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `autoscalingGroup` | `string` | no | — |
| `isLoading` | `boolean` | sí | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`AutoscalingGroupsEventsColumns.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-events-autoscalinggroupseventscolumns-tsx), [`data-table-single.tsx`](../data-table.md#components-data-table-data-table-single-tsx)
- Usado por: [`InstanciasAutoscalingGroupsChartComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-instanciasautoscalinggroupschartcomponent-tsx)

Notas de implementación:

- Ahora la API devuelve directamente un array, no un objeto con basic_events

---

<a id="components-aws-vista-autoscaling-autoscaling-groups-graficos-autoscalinggroupsinstancescolumns-tsx"></a>
## `components/aws/vista-autoscaling/autoscaling-groups/graficos/AutoscalingGroupsInstancesColumns.tsx`

**Módulo (cliente)**

Exporta:

- tipo `AutoscalingGroupInstance` = `{ sync_time: { $date: string } AutoScalingGroupName: string HealthStatus: string InstanceId: string InstanceType: strin…`
- constante `autoscalingGroupInstanceColumns` = `[ { header: 'Instance ID', accessorKey: 'InstanceId', cell: ({ getValue }) => {…`

Internos:

- función `getEc2ConsoleUrl` `(instanceId: string, region = 'us-east-1')`
- componente `AutoscalingInstanceDetailsModal` `({ instance }: { instance: AutoscalingGroupInstance })`
- componente `DateParams` `()`

- Hooks: `useSearchParams`
- Usa: [`button.tsx`](../ui.md#components-ui-button-tsx), [`dropdown-menu.tsx`](../ui.md#components-ui-dropdown-menu-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx), [`filters.ts`](../../lib.md#lib-filters-ts)
- Usado por: [`AutoscalingGroupsResourceViewInstanciasComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-graficos-autoscalinggroupsresourceviewinstanciascomponent-tsx)

---

<a id="components-aws-vista-autoscaling-autoscaling-groups-graficos-autoscalinggroupsresourceviewinstancesvsmaxmincomponent-tsx"></a>
## `components/aws/vista-autoscaling/autoscaling-groups/graficos/AutoscalingGroupsResourceViewInstancesVsMaxMinComponent.tsx`

**Componente (cliente)**

'use client';

Exporta:

- componente `AutoscalingGroupsResourceViewInstancesVsMaxMinComponent` `({ data, title = 'Cantidad Instancias configuradas vs Máximo y Mínimo deseado', height = '300px', }: AutoscalingGroupsInstancesVsMaxMinChartProps)`

Interfaz `MetricPoint`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `Resource` | `string` | no | — |
| `Timestamp` | `string` | no | — |
| `Value` | `number` | no | — |
| `sync_time` | `{ $date: string }` | no | — |
| `MetricLabelFormatted` | `string` | no | — |

Interfaz `AutoscalingGroupsInstancesVsMaxMinChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `MetricPoint[]` | no | — |
| `title` | `string` | sí | — |
| `height` | `string` | sí | — |

Internos:

- constante `TARGET_METRICS`

- Hooks: `useECharts`, `useTheme`
- Usa: [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts), [`card.tsx`](../ui.md#components-ui-card-tsx)
- Usado por: [`InstanciasAutoscalingGroupsChartComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-instanciasautoscalinggroupschartcomponent-tsx)

---

<a id="components-aws-vista-autoscaling-autoscaling-groups-graficos-autoscalinggroupsresourceviewinstanciascomponent-tsx"></a>
## `components/aws/vista-autoscaling/autoscaling-groups/graficos/AutoscalingGroupsResourceViewInstanciasComponent.tsx`

**Componente**

Exporta:

- componente `AutoscalingGroupsResourceViewInstanciasComponent` `({ data, startDate, endDate, autoscalingGroup, isLoading = false }: AutoscalingGroupsResourceViewInstanciasComponentProps)`

Interfaz `AutoscalingGroupsResourceViewInstanciasComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `unknown` | sí | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `autoscalingGroup` | `string` | no | — |
| `isLoading` | `boolean` | sí | — |

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`AutoscalingGroupsInstancesColumns.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-graficos-autoscalinggroupsinstancescolumns-tsx), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx)
- Usado por: [`InstanciasAutoscalingGroupsChartComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-instanciasautoscalinggroupschartcomponent-tsx)

---

<a id="components-aws-vista-autoscaling-autoscaling-groups-graficos-autoscalinggroupsresourceviewstatesinstancescomponent-tsx"></a>
## `components/aws/vista-autoscaling/autoscaling-groups/graficos/AutoscalingGroupsResourceViewStatesInstancesComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AutoscalingGroupsResourceViewStatesInstancesComponent` `({ data, title = 'Estados Instancias Autoscaling Group', height = '300px' }: AutoscalingGroupsStatesChartProps)`

Interfaz `MetricPoint`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `Resource` | `string` | no | — |
| `Timestamp` | `string` | no | — |
| `Value` | `number` | no | — |
| `sync_time` | `{ $date: string }` | no | — |
| `MetricLabelFormatted` | `string` | no | — |

Interfaz `AutoscalingGroupsStatesChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `MetricPoint[]` | no | — |
| `title` | `string` | sí | — |
| `height` | `string` | sí | — |

Internos:

- constante `MAX_METRICS`

- Hooks: `useECharts`, `useTheme`
- Usa: [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts), [`card.tsx`](../ui.md#components-ui-card-tsx)
- Usado por: [`InstanciasAutoscalingGroupsChartComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-instanciasautoscalinggroupschartcomponent-tsx)

---

<a id="components-aws-vista-autoscaling-autoscaling-groups-graficos-mainautoscalinggroupsresourceviewmetricssummarycomponent-tsx"></a>
## `components/aws/vista-autoscaling/autoscaling-groups/graficos/MainAutoscalingGroupsResourceViewMetricsSummaryComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainAutoscalingGroupsResourceViewMetricsSummaryComponent` `({ data, }: MainAutoscalingGroupsResourceViewMetricsSummaryProps)`

Interfaz `AutoscalingGroupData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `region` | `string` | no | — |
| `AutoScalingGroupName` | `string` | no | — |
| `CreatedTime` | `{ $date: string }` | no | — |
| `LaunchTemplate_LaunchTemplateId` | `string \| null` | no | — |
| `LaunchTemplate_LaunchTemplateName` | `string \| null` | no | — |
| `LaunchTemplate_Version` | `string \| null` | no | — |
| `MinSize` | `number` | no | — |
| `MaxSize` | `number` | no | — |
| `Tags_Key` | `string[]` | no | — |
| `Tags_Value` | `string[]` | no | — |
| `Capacidad_Total_ASG` | `number` | no | — |
| `Launch_Template_Info_Formatted` | `string \| null` | no | — |
| `Size_Range_Formatted` | `string` | no | — |
| `Total_Tags_ASG` | `number` | no | — |

Interfaz `MainAutoscalingGroupsResourceViewMetricsSummaryProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AutoscalingGroupData[] \| null` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx)
- Usado por: [`InstanciasAutoscalingGroupsChartComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-instanciasautoscalinggroupschartcomponent-tsx)

Notas de implementación:

- `const latestData = data[0];` — Tomar el primer elemento sin sorting complicado
- Formatear la fecha de creación de forma bonita

---

<a id="components-aws-vista-autoscaling-autoscaling-groups-info-autoscalinggroupsresourceviewhistoricinfocomponent-tsx"></a>
## `components/aws/vista-autoscaling/autoscaling-groups/info/AutoscalingGroupsResourceViewHistoricInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AutoscalingGroupsResourceViewHistoricInfoComponent` `({ groups }: AutoscalingGroupsResourceViewHistoricInfoComponentProps)`

Interfaz `AutoscalingGroupData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `region` | `string` | no | — |
| `AutoScalingGroupName` | `string` | no | — |
| `CreatedTime` | `{ $date: string }` | no | — |
| `LaunchTemplate_LaunchTemplateId` | `string \| null` | no | — |
| `LaunchTemplate_LaunchTemplateName` | `string \| null` | no | — |
| `LaunchTemplate_Version` | `string \| null` | no | — |
| `MinSize` | `number` | no | — |
| `MaxSize` | `number` | no | — |
| `Tags_Key` | `string[]` | no | — |
| `Tags_Value` | `string[]` | no | — |
| `Capacidad_Total_ASG` | `number` | no | — |
| `Launch_Template_Info_Formatted` | `string \| null` | no | — |
| `Size_Range_Formatted` | `string` | no | — |
| `Total_Tags_ASG` | `number` | no | — |

Interfaz `AutoscalingGroupsResourceViewHistoricInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `groups` | `AutoscalingGroupData[]` | no | — |

Internos:

- función `getUptime` `(createTime: Date)`
- función `getHealthStatusColor` `(region: string)`

- Usa: [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx)
- Usado por: [`AutoscalingGroupsResourceViewInfoComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-info-autoscalinggroupsresourceviewinfocomponent-tsx)

---

<a id="components-aws-vista-autoscaling-autoscaling-groups-info-autoscalinggroupsresourceviewinfocomponent-tsx"></a>
## `components/aws/vista-autoscaling/autoscaling-groups/info/AutoscalingGroupsResourceViewInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AutoscalingGroupsResourceViewInfoComponent` `({ data }: AutoscalingGroupsResourceViewInfoComponentProps)`

Interfaz `AutoscalingGroupData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sync_time` | `{ $date: string }` | no | — |
| `AutoScalingGroupName` | `string` | no | — |
| `CreatedTime` | `{ $date: string }` | no | — |
| `DesiredCapacity` | `number` | no | — |
| `MaxSize` | `number` | no | — |
| `MinSize` | `number` | no | — |
| `DefaultCooldown` | `number` | no | — |
| `HealthCheckType` | `string` | no | — |
| `HealthCheckGracePeriod` | `number` | no | — |
| `LaunchConfigurationName` | `string` | sí | — |
| `LaunchTemplate` | `{ LaunchTemplateName: string; Version: string; }` | sí | — |
| `VPCZoneIdentifier` | `string[]` | no | — |
| `AvailabilityZones` | `string[]` | no | — |
| `Instances` | `Array<{ InstanceId: string; InstanceType: string; AvailabilityZone: s…` | no | — |
| `Tags` | `Array<{ Key: string; Value: string; PropagateAtLaunch: boolean; }>` | no | — |
| `EnabledMetrics` | `Array<{ Metric: string; Granularity: string; }>` | no | — |
| `SuspendedProcesses` | `Array<{ ProcessName: string; SuspensionReason: string; }>` | no | — |
| `ServiceLinkedRoleARN` | `string` | no | — |
| `TargetGroupARNs` | `string[]` | no | — |
| `LoadBalancerNames` | `string[]` | no | — |
| `region` | `string` | no | — |

Interfaz `AutoscalingGroupsResourceViewInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AutoscalingGroupData[] \| null` | no | — |

Internos:

- función `getUptime` `(createTime: Date)`
- función `getHealthStatusColor` `(healthCheckType: string)`

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`AutoscalingGroupsResourceViewHistoricInfoComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-info-autoscalinggroupsresourceviewhistoricinfocomponent-tsx)
- Usado por: [`InstanciasAutoscalingGroupsChartComponent.tsx`](#components-aws-vista-autoscaling-autoscaling-groups-instanciasautoscalinggroupschartcomponent-tsx)

