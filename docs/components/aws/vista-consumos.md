# Componentes `components/aws/vista-consumos/`

[← Índice](../../README.md)

Vistas de consumo AWS (EC2, ASG, EKS, RDS, Load Balancers, NAT Gateways).

Archivos:

- [`components/aws/vista-consumos/ec2/Ec2InstancesConsumeComponent.tsx`](#components-aws-vista-consumos-ec2-ec2instancesconsumecomponent-tsx)
- [`components/aws/vista-consumos/ec2/MainViewConsumeEc2Component.tsx`](#components-aws-vista-consumos-ec2-mainviewconsumeec2component-tsx)
- [`components/aws/vista-consumos/ec2/asg/AsgConsumeComponent.tsx`](#components-aws-vista-consumos-ec2-asg-asgconsumecomponent-tsx)
- [`components/aws/vista-consumos/ec2/asg/MainViewConsumeAsgComponent.tsx`](#components-aws-vista-consumos-ec2-asg-mainviewconsumeasgcomponent-tsx)
- [`components/aws/vista-consumos/ec2/eks/EksConsumeComponent.tsx`](#components-aws-vista-consumos-ec2-eks-eksconsumecomponent-tsx)
- [`components/aws/vista-consumos/ec2/eks/MainViewConsumeEksComponent.tsx`](#components-aws-vista-consumos-ec2-eks-mainviewconsumeekscomponent-tsx)
- [`components/aws/vista-consumos/ec2/info/Ec2ConsumeViewAttachedDiskHistoricComponent.tsx`](#components-aws-vista-consumos-ec2-info-ec2consumeviewattacheddiskhistoriccomponent-tsx)
- [`components/aws/vista-consumos/ec2/info/Ec2ConsumeViewInUseInterfacesHistoricComponent.tsx`](#components-aws-vista-consumos-ec2-info-ec2consumeviewinuseinterfaceshistoriccomponent-tsx)
- [`components/aws/vista-consumos/ec2/table/Ec2ConsumeViewInstanceColumns.tsx`](#components-aws-vista-consumos-ec2-table-ec2consumeviewinstancecolumns-tsx)
- [`components/aws/vista-consumos/elbv2/ElbV2ConsumeComponent.tsx`](#components-aws-vista-consumos-elbv2-elbv2consumecomponent-tsx)
- [`components/aws/vista-consumos/elbv2/MainViewElbV2ConsumeComponent.tsx`](#components-aws-vista-consumos-elbv2-mainviewelbv2consumecomponent-tsx)
- [`components/aws/vista-consumos/elbv2/info/ElbV2ConsumeInsightModalComponent.tsx`](#components-aws-vista-consumos-elbv2-info-elbv2consumeinsightmodalcomponent-tsx)
- [`components/aws/vista-consumos/nat-gateways/MainViewNatGatewaysConsumeComponent.tsx`](#components-aws-vista-consumos-nat-gateways-mainviewnatgatewaysconsumecomponent-tsx)
- [`components/aws/vista-consumos/nat-gateways/NatGatewaysConsumeComponent.tsx`](#components-aws-vista-consumos-nat-gateways-natgatewaysconsumecomponent-tsx)
- [`components/aws/vista-consumos/rds/MainViewConsumeRdsComponent.tsx`](#components-aws-vista-consumos-rds-mainviewconsumerdscomponent-tsx)
- [`components/aws/vista-consumos/rds/RdsInstancesConsumeComponent.tsx`](#components-aws-vista-consumos-rds-rdsinstancesconsumecomponent-tsx)

<a id="components-aws-vista-consumos-ec2-ec2instancesconsumecomponent-tsx"></a>
## `components/aws/vista-consumos/ec2/Ec2InstancesConsumeComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `Ec2InstancesConsumeComponent` `({ startDate, endDate, instance, region }: Ec2InstancesConsumeComponentProps)` — Consumo EC2: adapta los filtros de la vista al contrato canónico (/api/aws/consumption/ec2/*).

Interfaz `Ec2InstancesConsumeComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `instance` | `string` | no | — |
| `region` | `string` | no | — |

- Usa: [`ConsumptionView.tsx`](../shared.md#components-shared-consumption-consumptionview-tsx), [`consumptionConfigs.ts`](../shared.md#components-shared-consumption-consumptionconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewConsumeEc2Component.tsx`](#components-aws-vista-consumos-ec2-mainviewconsumeec2component-tsx)

---

<a id="components-aws-vista-consumos-ec2-mainviewconsumeec2component-tsx"></a>
## `components/aws/vista-consumos/ec2/MainViewConsumeEc2Component.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewConsumeEc2Component` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`Ec2InstancesConsumeComponent.tsx`](#components-aws-vista-consumos-ec2-ec2instancesconsumecomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-consumos-ec2-page-tsx)

---

<a id="components-aws-vista-consumos-ec2-asg-asgconsumecomponent-tsx"></a>
## `components/aws/vista-consumos/ec2/asg/AsgConsumeComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AsgConsumeComponent` `({ startDate, endDate, instance, region }: AsgConsumeComponentProps)` — Consumo EC2 de Auto Scaling Groups: adapta los filtros de la vista al contrato canónico (/api/aws/consumption/asg/*).

Interfaz `AsgConsumeComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `instance` | `string` | no | — |
| `region` | `string` | no | — |

- Usa: [`ConsumptionView.tsx`](../shared.md#components-shared-consumption-consumptionview-tsx), [`consumptionConfigs.ts`](../shared.md#components-shared-consumption-consumptionconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewConsumeAsgComponent.tsx`](#components-aws-vista-consumos-ec2-asg-mainviewconsumeasgcomponent-tsx)

---

<a id="components-aws-vista-consumos-ec2-asg-mainviewconsumeasgcomponent-tsx"></a>
## `components/aws/vista-consumos/ec2/asg/MainViewConsumeAsgComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewConsumeAsgComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`AsgConsumeComponent.tsx`](#components-aws-vista-consumos-ec2-asg-asgconsumecomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-consumos-asg-page-tsx)

---

<a id="components-aws-vista-consumos-ec2-eks-eksconsumecomponent-tsx"></a>
## `components/aws/vista-consumos/ec2/eks/EksConsumeComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `EksConsumeComponent` `({ startDate, endDate, eksAsgInstance, region }: EksConsumeComponentProps)` — Consumo nodos EKS: adapta los filtros de la vista al contrato canónico (/api/aws/consumption/eks/*).

Interfaz `EksConsumeComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `eksAsgInstance` | `string` | sí | — |
| `region` | `string` | no | — |

- Usa: [`ConsumptionView.tsx`](../shared.md#components-shared-consumption-consumptionview-tsx), [`consumptionConfigs.ts`](../shared.md#components-shared-consumption-consumptionconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewConsumeEksComponent.tsx`](#components-aws-vista-consumos-ec2-eks-mainviewconsumeekscomponent-tsx)

---

<a id="components-aws-vista-consumos-ec2-eks-mainviewconsumeekscomponent-tsx"></a>
## `components/aws/vista-consumos/ec2/eks/MainViewConsumeEksComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewConsumeEksComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`EksConsumeComponent.tsx`](#components-aws-vista-consumos-ec2-eks-eksconsumecomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-consumos-eks-page-tsx)

---

<a id="components-aws-vista-consumos-ec2-info-ec2consumeviewattacheddiskhistoriccomponent-tsx"></a>
## `components/aws/vista-consumos/ec2/info/Ec2ConsumeViewAttachedDiskHistoricComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `Ec2ConsumeViewAttachedDiskHistoricComponent` `({ instanceInfo }: Ec2ConsumeViewAttachedDiskHistoricComponentProps)`

Interfaz `Ec2ConsumeViewAttachedDiskHistoricComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instanceInfo` | `Ec2ConsumneViewInstance[]` | no | — |

Interfaz `InstanceGrouped`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instanceId` | `string` | no | — |
| `syncs` | `{ sync_time: string; instanceEbs: unknown[]; }[]` | no | — |

- Usa: [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx)

---

<a id="components-aws-vista-consumos-ec2-info-ec2consumeviewinuseinterfaceshistoriccomponent-tsx"></a>
## `components/aws/vista-consumos/ec2/info/Ec2ConsumeViewInUseInterfacesHistoricComponent.tsx`

**Componente**

Exporta:

- componente `Ec2ConsumeViewInUseInterfacesHistoricComponent` `({ instanceInfo }: Ec2ConsumeViewInUseInterfacesHistoricComponentProps)`

Interfaz `Ec2ConsumeViewInUseInterfacesHistoricComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instanceInfo` | `Ec2ConsumneViewInstance[]` | no | — |

Interfaz `InstanceGrouped`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instanceId` | `string` | no | — |
| `syncs` | `{ sync_time: string; instanceEbs: unknown[]; }[]` | no | — |

- Usa: [`accordion.tsx`](../ui.md#components-ui-accordion-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx)

---

<a id="components-aws-vista-consumos-ec2-table-ec2consumeviewinstancecolumns-tsx"></a>
## `components/aws/vista-consumos/ec2/table/Ec2ConsumeViewInstanceColumns.tsx`

**Módulo (cliente)**

Exporta:

- constante `Ec2ConsumeViewInstanceColumns` = `[ { header: "ID Instancia", accessorKey: "resource", cell: (info) => { const va…`

Internos:

- componente `DateParams` `()`

- Hooks: `useSearchParams`
- Usa: [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`filters.ts`](../../lib.md#lib-filters-ts)

---

<a id="components-aws-vista-consumos-elbv2-elbv2consumecomponent-tsx"></a>
## `components/aws/vista-consumos/elbv2/ElbV2ConsumeComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ElbV2ConsumeComponent` `({ startDate, endDate, instance, region }: ElbV2ConsumeComponentProps)` — Consumo Load Balancers v2: adapta los filtros de la vista al contrato canónico (/api/aws/consumption/load-balancers/*).

Interfaz `ElbV2ConsumeComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `instance` | `string` | no | — |
| `region` | `string` | no | — |

- Usa: [`ConsumptionView.tsx`](../shared.md#components-shared-consumption-consumptionview-tsx), [`consumptionConfigs.ts`](../shared.md#components-shared-consumption-consumptionconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewElbV2ConsumeComponent.tsx`](#components-aws-vista-consumos-elbv2-mainviewelbv2consumecomponent-tsx)

---

<a id="components-aws-vista-consumos-elbv2-mainviewelbv2consumecomponent-tsx"></a>
## `components/aws/vista-consumos/elbv2/MainViewElbV2ConsumeComponent.tsx`

**Componente**

Exporta:

- componente `MainViewElbV2ConsumeComponent` `()`

- Usa: [`ElbV2ConsumeComponent.tsx`](#components-aws-vista-consumos-elbv2-elbv2consumecomponent-tsx), [`NatGatewaysConsumeComponent.tsx`](#components-aws-vista-consumos-nat-gateways-natgatewaysconsumecomponent-tsx), [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-consumos-elbv2-page-tsx)

---

<a id="components-aws-vista-consumos-elbv2-info-elbv2consumeinsightmodalcomponent-tsx"></a>
## `components/aws/vista-consumos/elbv2/info/ElbV2ConsumeInsightModalComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ElbV2InfoView` `({ data }: { data: LoadbalancerV2ConsumeInfoInstances })`
- componente `ElbV2MetricasView` `({ data }: { data: LoadbalancerV2ConsumeInfoInstances })`
- componente `ElbV2TargetGroupsView` `({ data }: { data: LoadbalancerV2ConsumeInfoInstances })`
- componente `ElbV2RecomendacionView` `({ data }: { data: LoadbalancerV2ConsumeInfoInstances })`

Internos:

- función `formatBytes` `(bytes: number)`
- función `getLatestHistory` `(data: LoadbalancerV2ConsumeInfoInstances): LoadbalancerV2ConsumeInfoInstancesHistory | null`
- componente `GetParameters` `()`

- Hooks: `useSearchParams`
- Usa: [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`table.tsx`](../ui.md#components-ui-table-tsx), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts), [`filters.ts`](../../lib.md#lib-filters-ts)

---

<a id="components-aws-vista-consumos-nat-gateways-mainviewnatgatewaysconsumecomponent-tsx"></a>
## `components/aws/vista-consumos/nat-gateways/MainViewNatGatewaysConsumeComponent.tsx`

**Componente**

Exporta:

- componente `MainViewNatGatewaysConsumeComponent` `()`

- Usa: [`NatGatewaysConsumeComponent.tsx`](#components-aws-vista-consumos-nat-gateways-natgatewaysconsumecomponent-tsx), [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-consumos-nat-gateways-page-tsx)

---

<a id="components-aws-vista-consumos-nat-gateways-natgatewaysconsumecomponent-tsx"></a>
## `components/aws/vista-consumos/nat-gateways/NatGatewaysConsumeComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `NatGatewaysConsumeComponent` `({ startDate, endDate, instance, region }: NatGatewaysConsumeComponentProps)` — Consumo NAT Gateways: adapta los filtros de la vista al contrato canónico (/api/aws/consumption/nat-gateways/*).

Interfaz `NatGatewaysConsumeComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `instance` | `string` | no | — |
| `region` | `string` | no | — |

- Usa: [`ConsumptionView.tsx`](../shared.md#components-shared-consumption-consumptionview-tsx), [`consumptionConfigs.ts`](../shared.md#components-shared-consumption-consumptionconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewElbV2ConsumeComponent.tsx`](#components-aws-vista-consumos-elbv2-mainviewelbv2consumecomponent-tsx), [`MainViewNatGatewaysConsumeComponent.tsx`](#components-aws-vista-consumos-nat-gateways-mainviewnatgatewaysconsumecomponent-tsx)

---

<a id="components-aws-vista-consumos-rds-mainviewconsumerdscomponent-tsx"></a>
## `components/aws/vista-consumos/rds/MainViewConsumeRdsComponent.tsx`

**Componente**

Exporta:

- componente `MainViewConsumeRdsComponent` `({ rdsType }: MainViewConsumeRdsComponentProps)`

Interfaz `MainViewConsumeRdsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `rdsType` | `string` | no | — |

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`RdsInstancesConsumeComponent.tsx`](#components-aws-vista-consumos-rds-rdsinstancesconsumecomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-consumos-rds-mariadb-page-tsx), [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-consumos-rds-mysql-page-tsx), [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-consumos-rds-oracle-page-tsx), [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-consumos-rds-postgresql-page-tsx), [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-consumos-rds-sqlserver-page-tsx)

---

<a id="components-aws-vista-consumos-rds-rdsinstancesconsumecomponent-tsx"></a>
## `components/aws/vista-consumos/rds/RdsInstancesConsumeComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RdsInstancesConsumeComponent` `({ startDate, endDate, instance, region, instancesService }: RdsInstancesConsumeComponentProps)` — Consumo RDS: adapta los filtros de la vista al contrato canónico (/api/aws/consumption/rds/*).

Interfaz `RdsInstancesConsumeComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `instance` | `string` | no | — |
| `region` | `string` | no | — |
| `instancesService` | `string` | sí | — |

Internos:

- constante `RDS_DB_TYPES`

- Usa: [`ConsumptionView.tsx`](../shared.md#components-shared-consumption-consumptionview-tsx), [`consumptionConfigs.ts`](../shared.md#components-shared-consumption-consumptionconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewConsumeRdsComponent.tsx`](#components-aws-vista-consumos-rds-mainviewconsumerdscomponent-tsx)

Notas de implementación:

- El backend valida db_type contra el motor RDS

