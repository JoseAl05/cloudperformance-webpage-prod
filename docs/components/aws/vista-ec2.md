# Componentes `components/aws/vista-ec2/`

[← Índice](../../README.md)

Vista de instancia EC2: información, historial, eventos y uso de CPU, créditos y red.

Archivos:

- [`components/aws/vista-ec2/instancias-ec2/InstanceEc2CpuMetricsComponent.tsx`](#components-aws-vista-ec2-instancias-ec2-instanceec2cpumetricscomponent-tsx)
- [`components/aws/vista-ec2/instancias-ec2/MainViewInstancesEc2Component.tsx`](#components-aws-vista-ec2-instancias-ec2-mainviewinstancesec2component-tsx)
- [`components/aws/vista-ec2/instancias-ec2/events/Ec2EventsColumns.tsx`](#components-aws-vista-ec2-instancias-ec2-events-ec2eventscolumns-tsx)
- [`components/aws/vista-ec2/instancias-ec2/events/Ec2EventsTable.tsx`](#components-aws-vista-ec2-instancias-ec2-events-ec2eventstable-tsx)
- [`components/aws/vista-ec2/instancias-ec2/graficos/Ec2ResourceViewUsageCpuComponent.tsx`](#components-aws-vista-ec2-instancias-ec2-graficos-ec2resourceviewusagecpucomponent-tsx)
- [`components/aws/vista-ec2/instancias-ec2/graficos/Ec2ResourceViewUsageCreditsComponent.tsx`](#components-aws-vista-ec2-instancias-ec2-graficos-ec2resourceviewusagecreditscomponent-tsx)
- [`components/aws/vista-ec2/instancias-ec2/graficos/Ec2ResourceViewUsageNetworkComponent.tsx`](#components-aws-vista-ec2-instancias-ec2-graficos-ec2resourceviewusagenetworkcomponent-tsx)
- [`components/aws/vista-ec2/instancias-ec2/graficos/MainEc2ResourceViewMetricsSummaryComponent.tsx`](#components-aws-vista-ec2-instancias-ec2-graficos-mainec2resourceviewmetricssummarycomponent-tsx)
- [`components/aws/vista-ec2/instancias-ec2/info/Ec2ResourceViewHistoricInfoComponent.tsx`](#components-aws-vista-ec2-instancias-ec2-info-ec2resourceviewhistoricinfocomponent-tsx)
- [`components/aws/vista-ec2/instancias-ec2/info/Ec2ResourceViewInfoComponent.tsx`](#components-aws-vista-ec2-instancias-ec2-info-ec2resourceviewinfocomponent-tsx)

<a id="components-aws-vista-ec2-instancias-ec2-instanceec2cpumetricscomponent-tsx"></a>
## `components/aws/vista-ec2/instancias-ec2/InstanceEc2CpuMetricsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `InstanceEc2CpuMetricsComponent` `({ startDate, endDate, instance }: InstanceEc2CpuMetricsComponentProps)`

Interfaz `InstanceEc2CpuMetricsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `instance` | `string` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`
- función `isNullish` `(v: unknown)`

- API: `/api/aws/bridge/vm/instancias-ec2`, `/api/aws/bridge/vm/instancias-ec2-events`, `/api/aws/bridge/vm/instancias-ec2-metrics`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`Ec2ResourceViewUsageCpuComponent.tsx`](#components-aws-vista-ec2-instancias-ec2-graficos-ec2resourceviewusagecpucomponent-tsx), [`Ec2ResourceViewUsageCreditsComponent.tsx`](#components-aws-vista-ec2-instancias-ec2-graficos-ec2resourceviewusagecreditscomponent-tsx), [`Ec2ResourceViewUsageNetworkComponent.tsx`](#components-aws-vista-ec2-instancias-ec2-graficos-ec2resourceviewusagenetworkcomponent-tsx), [`Ec2ResourceViewInfoComponent.tsx`](#components-aws-vista-ec2-instancias-ec2-info-ec2resourceviewinfocomponent-tsx), [`MainEc2ResourceViewMetricsSummaryComponent.tsx`](#components-aws-vista-ec2-instancias-ec2-graficos-mainec2resourceviewmetricssummarycomponent-tsx), [`Ec2EventsTable.tsx`](#components-aws-vista-ec2-instancias-ec2-events-ec2eventstable-tsx), [`ec2ResourceViewInterfaces.ts`](../../tipos.md#interfaces-vista-ec2-ec2resourceviewinterfaces-ts), [`ec2MetricsResourceViewInterfaces.ts`](../../tipos.md#interfaces-vista-ec2-ec2metricsresourceviewinterfaces-ts), [`ec2EventsResourceViewInterfaces.ts`](../../tipos.md#interfaces-vista-ec2-ec2eventsresourceviewinterfaces-ts), [`MessageCards.tsx`](cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx)
- Usado por: [`MainViewInstancesEc2Component.tsx`](#components-aws-vista-ec2-instancias-ec2-mainviewinstancesec2component-tsx)

---

<a id="components-aws-vista-ec2-instancias-ec2-mainviewinstancesec2component-tsx"></a>
## `components/aws/vista-ec2/instancias-ec2/MainViewInstancesEc2Component.tsx`

**Componente**

Exporta:

- componente `MainViewInstancesEc2Component` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`InstanceEc2CpuMetricsComponent.tsx`](#components-aws-vista-ec2-instancias-ec2-instanceec2cpumetricscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-recursos-instancias-ec2-page-tsx)

---

<a id="components-aws-vista-ec2-instancias-ec2-events-ec2eventscolumns-tsx"></a>
## `components/aws/vista-ec2/instancias-ec2/events/Ec2EventsColumns.tsx`

**Módulo (cliente)**

Exporta:

- tipo `AwsEvent` = `{ _id: string EventName: string EventSource: string EventTime: string Username: string sync_time: string Resources_Reso…`
- constante `awsEventColumns` = `[ { header: "Nombre Evento", accessorKey: "EventName", cell: ({ getValue }) => …`

Internos:

- función `getAwsConsoleUrl` `(resourceType: string, resourceName: string, region = "us-east-1")`
- componente `EventDetailsModal` `({ event }: { event: AwsEvent })`
- componente `ResourcesCell` `({ resourceNames, resourceTypes, }: { resourceNames: string[] resourceTypes: string[] })`

- Usa: [`button.tsx`](../ui.md#components-ui-button-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`dropdown-menu.tsx`](../ui.md#components-ui-dropdown-menu-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx)
- Usado por: [`Ec2EventsTable.tsx`](#components-aws-vista-ec2-instancias-ec2-events-ec2eventstable-tsx)

---

<a id="components-aws-vista-ec2-instancias-ec2-events-ec2eventstable-tsx"></a>
## `components/aws/vista-ec2/instancias-ec2/events/Ec2EventsTable.tsx`

**Componente**

Exporta:

- componente `Ec2EventsTableComponent` `({ data, startDate, endDate, instance }: Ec2EventsTableComponentProps)`

Interfaz `Ec2EventsTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `unknown` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `instance` | `string` | no | — |

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`Ec2EventsColumns.tsx`](#components-aws-vista-ec2-instancias-ec2-events-ec2eventscolumns-tsx), [`data-table-single.tsx`](../data-table.md#components-data-table-data-table-single-tsx)
- Usado por: [`InstanceEc2CpuMetricsComponent.tsx`](#components-aws-vista-ec2-instancias-ec2-instanceec2cpumetricscomponent-tsx)

---

<a id="components-aws-vista-ec2-instancias-ec2-graficos-ec2resourceviewusagecpucomponent-tsx"></a>
## `components/aws/vista-ec2/instancias-ec2/graficos/Ec2ResourceViewUsageCpuComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `Ec2ResourceViewUsageCpuComponent` `({ data }: ResourceViewUsageCpuComponentProps)`

Interfaz `ResourceViewUsageCpuComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `{ metrics_data: { MetricLabel: string; Timestamp: string; total: numb…` | no | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`InstanceEc2CpuMetricsComponent.tsx`](#components-aws-vista-ec2-instancias-ec2-instanceec2cpumetricscomponent-tsx)

---

<a id="components-aws-vista-ec2-instancias-ec2-graficos-ec2resourceviewusagecreditscomponent-tsx"></a>
## `components/aws/vista-ec2/instancias-ec2/graficos/Ec2ResourceViewUsageCreditsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `Ec2ResourceViewUsageCreditsComponent` `({ data }: ResourceViewUsageCreditsComponentProps)`

Interfaz `ResourceViewUsageCreditsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `{ metrics_data: { MetricLabel: string; Timestamp: string; Value: numb…` | no | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`InstanceEc2CpuMetricsComponent.tsx`](#components-aws-vista-ec2-instancias-ec2-instanceec2cpumetricscomponent-tsx)

---

<a id="components-aws-vista-ec2-instancias-ec2-graficos-ec2resourceviewusagenetworkcomponent-tsx"></a>
## `components/aws/vista-ec2/instancias-ec2/graficos/Ec2ResourceViewUsageNetworkComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `Ec2ResourceViewUsageNetworkComponent` `({ data }: ResourceViewUsageNetworkComponentProps)`

Interfaz `MetricData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `MetricLabel` | `string` | no | — |
| `Timestamp` | `string` | no | — |
| `Value` | `number` | no | — |

Interfaz `ResourceViewUsageNetworkComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `{ metrics_data: MetricData[] } \| null` | no | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`InstanceEc2CpuMetricsComponent.tsx`](#components-aws-vista-ec2-instancias-ec2-instanceec2cpumetricscomponent-tsx)

---

<a id="components-aws-vista-ec2-instancias-ec2-graficos-mainec2resourceviewmetricssummarycomponent-tsx"></a>
## `components/aws/vista-ec2/instancias-ec2/graficos/MainEc2ResourceViewMetricsSummaryComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainEc2ResourceViewMetricsSummaryComponent` `({ data }: MainEc2ResourceViewMetricsSummaryComponentProps)`

Interfaz `MetricItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `MetricLabel` | `string` | no | — |
| `Value` | `number` | no | — |
| `sync_time` | `string` | no | — |

Interfaz `CalculatedSummary`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `Last_CPU_Credit_Balance_EC2` | `number` | no | — |
| `Last_CPU_Credit_Usage_EC2` | `number` | no | — |
| `Porcentaje_Uso_Créditos_CPU_EC2` | `number` | no | — |
| `Eficiencia_Creditos_CPU_EC2_Instancia` | `string` | no | — |

Interfaz `MetricsData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metrics_data` | `MetricItem[]` | no | — |
| `calculated_summary` | `CalculatedSummary` | sí | — |

Interfaz `MainEc2ResourceViewMetricsSummaryComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `MetricsData \| null` | no | — |

Internos:

- constante `CPU_THRESHOLD_LOW`
- constante `CPU_THRESHOLD_HIGH`
- constante `NETWORK_THRESHOLD_LOW`
- función `getUsageStatus` `(type: 'cpu' | 'network', value: number)`

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts)
- Usado por: [`InstanceEc2CpuMetricsComponent.tsx`](#components-aws-vista-ec2-instancias-ec2-instanceec2cpumetricscomponent-tsx)

---

<a id="components-aws-vista-ec2-instancias-ec2-info-ec2resourceviewhistoricinfocomponent-tsx"></a>
## `components/aws/vista-ec2/instancias-ec2/info/Ec2ResourceViewHistoricInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `Ec2ResourceViewHistoricInfoComponent` `({ instances }: Ec2ResourceViewHistoricInfoComponentProps)`

Interfaz `Ec2ResourceViewHistoricInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instances` | `unknown[]` | no | — |

Internos:

- función `getPublicIpCount` `(publicIps: (string | null)[])`

- Usa: [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx), [`getUptimeInstance.ts`](../../lib.md#lib-getuptimeinstance-ts)
- Usado por: [`Ec2ResourceViewInfoComponent.tsx`](#components-aws-vista-ec2-instancias-ec2-info-ec2resourceviewinfocomponent-tsx)

Notas de implementación:

- EBS
- NETWORK

---

<a id="components-aws-vista-ec2-instancias-ec2-info-ec2resourceviewinfocomponent-tsx"></a>
## `components/aws/vista-ec2/instancias-ec2/info/Ec2ResourceViewInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `Ec2ResourceViewInfoComponent` `({ data }: Ec2ResourceViewInfoComponentProps)`

Interfaz `Ec2ResourceViewInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `unknown` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`Ec2ResourceViewHistoricInfoComponent.tsx`](#components-aws-vista-ec2-instancias-ec2-info-ec2resourceviewhistoricinfocomponent-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`getUptimeInstance.ts`](../../lib.md#lib-getuptimeinstance-ts), [`ec2ResourceViewInterfaces.ts`](../../tipos.md#interfaces-vista-ec2-ec2resourceviewinterfaces-ts)
- Usado por: [`InstanceEc2CpuMetricsComponent.tsx`](#components-aws-vista-ec2-instancias-ec2-instanceec2cpumetricscomponent-tsx)

Notas de implementación:

- INSTANCE METADATA
- INSTANCE EBS VOLUMES
- INSTANCE NETWORK

