# Componentes `components/aws/vista-recursos/`

[← Índice](../../README.md)

Instancias EC2 / EKS infrautilizadas.

Archivos:

- [`components/aws/vista-recursos/infrautilizadas/autoscaling/InstanceEc2InfrautilizadaComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-autoscaling-instanceec2infrautilizadacomponent-tsx)
- [`components/aws/vista-recursos/infrautilizadas/autoscaling/MainViewInfrautilizadasComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-autoscaling-mainviewinfrautilizadascomponent-tsx)
- [`components/aws/vista-recursos/infrautilizadas/autoscaling/graficos/MainEc2ResourceInfraUsedViewMetricsSummaryComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-autoscaling-graficos-mainec2resourceinfrausedviewmetricssummarycomponent-tsx)
- [`components/aws/vista-recursos/infrautilizadas/autoscaling/table/ec2ResourceInfraUsedTableColumns.tsx`](#components-aws-vista-recursos-infrautilizadas-autoscaling-table-ec2resourceinfrausedtablecolumns-tsx)
- [`components/aws/vista-recursos/infrautilizadas/ec2/InstanceEc2InfrautilizadaComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-ec2-instanceec2infrautilizadacomponent-tsx)
- [`components/aws/vista-recursos/infrautilizadas/ec2/MainViewInfrautilizadasComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-ec2-mainviewinfrautilizadascomponent-tsx)
- [`components/aws/vista-recursos/infrautilizadas/ec2/graficos/MainEc2ResourceInfraUsedViewMetricsSummaryComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-ec2-graficos-mainec2resourceinfrausedviewmetricssummarycomponent-tsx)
- [`components/aws/vista-recursos/infrautilizadas/ec2/table/ec2ResourceInfraUsedTableColumns.tsx`](#components-aws-vista-recursos-infrautilizadas-ec2-table-ec2resourceinfrausedtablecolumns-tsx)
- [`components/aws/vista-recursos/infrautilizadas/eks/InstanceEksInfrautilizadaComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-eks-instanceeksinfrautilizadacomponent-tsx)
- [`components/aws/vista-recursos/infrautilizadas/eks/MainViewInfrautilizadasEksComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-eks-mainviewinfrautilizadasekscomponent-tsx)
- [`components/aws/vista-recursos/infrautilizadas/eks/graficos/MainEc2ResourceInfraUsedViewMetricsSummaryComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-eks-graficos-mainec2resourceinfrausedviewmetricssummarycomponent-tsx)
- [`components/aws/vista-recursos/infrautilizadas/eks/table/ec2ResourceInfraUsedTableColumns.tsx`](#components-aws-vista-recursos-infrautilizadas-eks-table-ec2resourceinfrausedtablecolumns-tsx)
- [`components/aws/vista-recursos/infrautilizadas/graficos/ResourceInfraUsedViewUsageCreditsComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-graficos-resourceinfrausedviewusagecreditscomponent-tsx)

<a id="components-aws-vista-recursos-infrautilizadas-autoscaling-instanceec2infrautilizadacomponent-tsx"></a>
## `components/aws/vista-recursos/infrautilizadas/autoscaling/InstanceEc2InfrautilizadaComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `InstanceEc2InfrautilizadaComponent` `({ startDate, endDate, instance, }: InstanceEc2CInfrautilizadaComponentProps)`

Interfaz `InstanceEc2CInfrautilizadaComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `instance` | `string` | no | — |

- API: `/api/aws/bridge/aws/ec2/unused/unused`
- Hooks: `useSWR`
- Usa: [`ec2ResourceInfraUsedViewInterface.ts`](../../tipos.md#interfaces-vista-infrautilizadas-ec2resourceinfrausedviewinterface-ts), [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`MainEc2ResourceInfraUsedViewMetricsSummaryComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-autoscaling-graficos-mainec2resourceinfrausedviewmetricssummarycomponent-tsx), [`ec2ResourceInfraUsedTableColumns.tsx`](#components-aws-vista-recursos-infrautilizadas-autoscaling-table-ec2resourceinfrausedtablecolumns-tsx), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`ResourceInfraUsedViewUsageCreditsComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-graficos-resourceinfrausedviewusagecreditscomponent-tsx)
- Usado por: [`MainViewInfrautilizadasComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-autoscaling-mainviewinfrautilizadascomponent-tsx)

Notas de implementación:

- https://cloudperformance-desarrollo.eastus2.cloudapp.azure.com/api/aws/ec2/unused/unused?date_from=2025-08-01T00:00:00&date_to=2025-09-02T23:59:59&region=all&resource=i-08fc095993a5521be,i-084e4e667310b5e5b,i-0e2e4f97aaaaae90e

---

<a id="components-aws-vista-recursos-infrautilizadas-autoscaling-mainviewinfrautilizadascomponent-tsx"></a>
## `components/aws/vista-recursos/infrautilizadas/autoscaling/MainViewInfrautilizadasComponent.tsx`

**Componente**

Exporta:

- componente `MainViewInfrautilizadasComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`InstanceEc2InfrautilizadaComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-autoscaling-instanceec2infrautilizadacomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-recursos-infrautilizadas-autoscaling-page-tsx)

---

<a id="components-aws-vista-recursos-infrautilizadas-autoscaling-graficos-mainec2resourceinfrausedviewmetricssummarycomponent-tsx"></a>
## `components/aws/vista-recursos/infrautilizadas/autoscaling/graficos/MainEc2ResourceInfraUsedViewMetricsSummaryComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainEc2ResourceInfraUsedViewMetricsSummaryComponent` `({ data }: MainEc2ResourceInfraUsedViewMetricsSummaryComponentProps)`

Interfaz `MainEc2ResourceInfraUsedViewMetricsSummaryComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `Root \| null` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`ec2ResourceInfraUsedViewInterface.ts`](../../tipos.md#interfaces-vista-infrautilizadas-ec2resourceinfrausedviewinterface-ts)
- Usado por: [`InstanceEc2InfrautilizadaComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-autoscaling-instanceec2infrautilizadacomponent-tsx)

Notas de implementación:

- subtitle: isToday ? 'Actual' : dateLabel,
- subtitle: isToday ? 'Actual' : dateLabel,
- subtitle: isToday ? 'Actual' : dateLabel,
- subtitle: isToday ? 'Actual' : dateLabel,
- subtitle: isToday ? 'Actual' : dateLabel,
- subtitle: isToday ? 'Actual' : dateLabel,
- subtitle: isToday ? 'Actual' : dateLabel,

---

<a id="components-aws-vista-recursos-infrautilizadas-autoscaling-table-ec2resourceinfrausedtablecolumns-tsx"></a>
## `components/aws/vista-recursos/infrautilizadas/autoscaling/table/ec2ResourceInfraUsedTableColumns.tsx`

**Módulo (cliente)**

Exporta:

- constante `Ec2ResourceInfraUsedViewColumns` = `[ { header: "ID Instancia", accessorKey: "InstanceId", cell: (info) => { const …`

Internos:

- componente `DateParams` `()`

- Hooks: `useSearchParams`
- Usa: [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`ec2ResourceInfraUsedViewInterface.ts`](../../tipos.md#interfaces-vista-infrautilizadas-ec2resourceinfrausedviewinterface-ts), [`filters.ts`](../../lib.md#lib-filters-ts)
- Usado por: [`InstanceEc2InfrautilizadaComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-autoscaling-instanceec2infrautilizadacomponent-tsx)

---

<a id="components-aws-vista-recursos-infrautilizadas-ec2-instanceec2infrautilizadacomponent-tsx"></a>
## `components/aws/vista-recursos/infrautilizadas/ec2/InstanceEc2InfrautilizadaComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `InstanceEc2InfrautilizadaComponent` `({ startDate, endDate, instance, }: InstanceEc2CInfrautilizadaComponentProps)`

Interfaz `InstanceEc2CInfrautilizadaComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `instance` | `string` | no | — |

- API: `/api/aws/bridge/aws/ec2/unused/unused`
- Hooks: `useSWR`
- Usa: [`ec2ResourceInfraUsedViewInterface.ts`](../../tipos.md#interfaces-vista-infrautilizadas-ec2resourceinfrausedviewinterface-ts), [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`MainEc2ResourceInfraUsedViewMetricsSummaryComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-ec2-graficos-mainec2resourceinfrausedviewmetricssummarycomponent-tsx), [`ec2ResourceInfraUsedTableColumns.tsx`](#components-aws-vista-recursos-infrautilizadas-ec2-table-ec2resourceinfrausedtablecolumns-tsx), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`ResourceInfraUsedViewUsageCreditsComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-graficos-resourceinfrausedviewusagecreditscomponent-tsx)
- Usado por: [`MainViewInfrautilizadasComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-ec2-mainviewinfrautilizadascomponent-tsx)

---

<a id="components-aws-vista-recursos-infrautilizadas-ec2-mainviewinfrautilizadascomponent-tsx"></a>
## `components/aws/vista-recursos/infrautilizadas/ec2/MainViewInfrautilizadasComponent.tsx`

**Componente**

Exporta:

- componente `MainViewInfrautilizadasComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`InstanceEc2InfrautilizadaComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-ec2-instanceec2infrautilizadacomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-recursos-infrautilizadas-ec2-page-tsx)

---

<a id="components-aws-vista-recursos-infrautilizadas-ec2-graficos-mainec2resourceinfrausedviewmetricssummarycomponent-tsx"></a>
## `components/aws/vista-recursos/infrautilizadas/ec2/graficos/MainEc2ResourceInfraUsedViewMetricsSummaryComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainEc2ResourceInfraUsedViewMetricsSummaryComponent` `({ data }: MainEc2ResourceInfraUsedViewMetricsSummaryComponentProps)`

Interfaz `MainEc2ResourceInfraUsedViewMetricsSummaryComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `Root \| null` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`ec2ResourceInfraUsedViewInterface.ts`](../../tipos.md#interfaces-vista-infrautilizadas-ec2resourceinfrausedviewinterface-ts)
- Usado por: [`InstanceEc2InfrautilizadaComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-ec2-instanceec2infrautilizadacomponent-tsx)

Notas de implementación:

- subtitle: isToday ? 'Actual' : dateLabel,
- subtitle: isToday ? 'Actual' : dateLabel,
- subtitle: isToday ? 'Actual' : dateLabel,
- subtitle: isToday ? 'Actual' : dateLabel,
- subtitle: isToday ? 'Actual' : dateLabel,
- subtitle: isToday ? 'Actual' : dateLabel,
- subtitle: isToday ? 'Actual' : dateLabel,

---

<a id="components-aws-vista-recursos-infrautilizadas-ec2-table-ec2resourceinfrausedtablecolumns-tsx"></a>
## `components/aws/vista-recursos/infrautilizadas/ec2/table/ec2ResourceInfraUsedTableColumns.tsx`

**Módulo (cliente)**

Exporta:

- constante `Ec2ResourceInfraUsedViewColumns` = `[ { header: "Sync Time", accessorKey: "sync_time_formatted", cell: (info) => { …`

Internos:

- componente `DateParams` `()`

- Hooks: `useSearchParams`
- Usa: [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`ec2ResourceInfraUsedViewInterface.ts`](../../tipos.md#interfaces-vista-infrautilizadas-ec2resourceinfrausedviewinterface-ts), [`ResourceBillingActionCell.tsx`](facturacion-recurso.md#components-aws-facturacion-recurso-table-resourcebillingactioncell-tsx), [`filters.ts`](../../lib.md#lib-filters-ts)
- Usado por: [`InstanceEc2InfrautilizadaComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-ec2-instanceec2infrautilizadacomponent-tsx)

---

<a id="components-aws-vista-recursos-infrautilizadas-eks-instanceeksinfrautilizadacomponent-tsx"></a>
## `components/aws/vista-recursos/infrautilizadas/eks/InstanceEksInfrautilizadaComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `InstanceEksInfrautilizadaComponent` `({ startDate, endDate, eksAsgInstance, }: InstanceEc2CInfrautilizadaComponentProps)`

Interfaz `InstanceEc2CInfrautilizadaComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `eksAsgInstance` | `string` | no | — |

- API: `/api/aws/bridge/aws/ec2/unused/unused`
- Hooks: `useSWR`
- Usa: [`ec2ResourceInfraUsedViewInterface.ts`](../../tipos.md#interfaces-vista-infrautilizadas-ec2resourceinfrausedviewinterface-ts), [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`MainEc2ResourceInfraUsedViewMetricsSummaryComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-eks-graficos-mainec2resourceinfrausedviewmetricssummarycomponent-tsx), [`ec2ResourceInfraUsedTableColumns.tsx`](#components-aws-vista-recursos-infrautilizadas-eks-table-ec2resourceinfrausedtablecolumns-tsx), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`ResourceInfraUsedViewUsageCreditsComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-graficos-resourceinfrausedviewusagecreditscomponent-tsx)
- Usado por: [`MainViewInfrautilizadasEksComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-eks-mainviewinfrautilizadasekscomponent-tsx)

Notas de implementación:

- https://cloudperformance-desarrollo.eastus2.cloudapp.azure.com/api/aws/ec2/unused/unused?date_from=2025-08-01T00:00:00&date_to=2025-09-02T23:59:59&region=all&resource=i-08fc095993a5521be,i-084e4e667310b5e5b,i-0e2e4f97aaaaae90e

---

<a id="components-aws-vista-recursos-infrautilizadas-eks-mainviewinfrautilizadasekscomponent-tsx"></a>
## `components/aws/vista-recursos/infrautilizadas/eks/MainViewInfrautilizadasEksComponent.tsx`

**Componente**

Exporta:

- componente `MainViewInfrautilizadasEksComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`InstanceEksInfrautilizadaComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-eks-instanceeksinfrautilizadacomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-recursos-infrautilizadas-eks-page-tsx)

---

<a id="components-aws-vista-recursos-infrautilizadas-eks-graficos-mainec2resourceinfrausedviewmetricssummarycomponent-tsx"></a>
## `components/aws/vista-recursos/infrautilizadas/eks/graficos/MainEc2ResourceInfraUsedViewMetricsSummaryComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainEc2ResourceInfraUsedViewMetricsSummaryComponent` `({ data }: MainEc2ResourceInfraUsedViewMetricsSummaryComponentProps)`

Interfaz `MainEc2ResourceInfraUsedViewMetricsSummaryComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `Root \| null` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`ec2ResourceInfraUsedViewInterface.ts`](../../tipos.md#interfaces-vista-infrautilizadas-ec2resourceinfrausedviewinterface-ts)
- Usado por: [`InstanceEksInfrautilizadaComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-eks-instanceeksinfrautilizadacomponent-tsx)

Notas de implementación:

- subtitle: isToday ? 'Actual' : dateLabel,
- subtitle: isToday ? 'Actual' : dateLabel,
- subtitle: isToday ? 'Actual' : dateLabel,
- subtitle: isToday ? 'Actual' : dateLabel,
- subtitle: isToday ? 'Actual' : dateLabel,
- subtitle: isToday ? 'Actual' : dateLabel,
- subtitle: isToday ? 'Actual' : dateLabel,

---

<a id="components-aws-vista-recursos-infrautilizadas-eks-table-ec2resourceinfrausedtablecolumns-tsx"></a>
## `components/aws/vista-recursos/infrautilizadas/eks/table/ec2ResourceInfraUsedTableColumns.tsx`

**Módulo (cliente)**

Exporta:

- constante `Ec2ResourceInfraUsedViewColumns` = `[ { header: "ID Instancia", accessorKey: "InstanceId", cell: (info) => { const …`

Internos:

- componente `DateParams` `()`

- Hooks: `useSearchParams`
- Usa: [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`ec2ResourceInfraUsedViewInterface.ts`](../../tipos.md#interfaces-vista-infrautilizadas-ec2resourceinfrausedviewinterface-ts), [`filters.ts`](../../lib.md#lib-filters-ts)
- Usado por: [`InstanceEksInfrautilizadaComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-eks-instanceeksinfrautilizadacomponent-tsx)

---

<a id="components-aws-vista-recursos-infrautilizadas-graficos-resourceinfrausedviewusagecreditscomponent-tsx"></a>
## `components/aws/vista-recursos/infrautilizadas/graficos/ResourceInfraUsedViewUsageCreditsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ResourceInfraUsedViewUsageCreditsComponent` `({ data }: ResourceInfraUsedViewUsageCreditsComponentProps)`

Interfaz `ResourceInfraUsedViewUsageCreditsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `{ creditMetrics: { MetricId: string; Timestamp: string; AvgValue: num…` | no | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`InstanceEc2InfrautilizadaComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-autoscaling-instanceec2infrautilizadacomponent-tsx), [`InstanceEc2InfrautilizadaComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-ec2-instanceec2infrautilizadacomponent-tsx), [`InstanceEksInfrautilizadaComponent.tsx`](#components-aws-vista-recursos-infrautilizadas-eks-instanceeksinfrautilizadacomponent-tsx)

