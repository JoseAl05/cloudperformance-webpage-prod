# Componentes `components/aws/vista-funciones/`

[← Índice](../../README.md)

Funciones de AWS: horario hábil vs no hábil, spot vs on-demand, top de facturación por familia / recurso / servicio, buckets S3, recursos asociados y variación de recursos.

Archivos:

- [`components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil/ConsumoEC2AsgHorarioComponent.tsx`](#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil-consumoec2asghorariocomponent-tsx)
- [`components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil/MainViewConsumoEC2AsgHorarioComponent.tsx`](#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil-mainviewconsumoec2asghorariocomponent-tsx)
- [`components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-ec2-horario-habil-vs-no-habil/ConsumoEC2HorarioComponent.tsx`](#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-horario-habil-vs-no-habil-consumoec2horariocomponent-tsx)
- [`components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-ec2-horario-habil-vs-no-habil/MainViewConsumoEC2HorarioComponent.tsx`](#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-horario-habil-vs-no-habil-mainviewconsumoec2horariocomponent-tsx)
- [`components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-ec2-nodos-eks-horario-habil-vs-no-habil/ConsumoEC2NodosEKSHorarioComponent.tsx`](#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-nodos-eks-horario-habil-vs-no-habil-consumoec2nodosekshorariocomponent-tsx)
- [`components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-ec2-nodos-eks-horario-habil-vs-no-habil/MainViewConsumoEC2NodosEKSHorarioComponent.tsx`](#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-nodos-eks-horario-habil-vs-no-habil-mainviewconsumoec2nodosekshorariocomponent-tsx)
- [`components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-rds-horario-habil-vs-no-habil/ConsumoRdsHorarioComponent.tsx`](#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-rds-horario-habil-vs-no-habil-consumordshorariocomponent-tsx)
- [`components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-rds-horario-habil-vs-no-habil/MainViewConsumoRdsHorarioComponent.tsx`](#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-rds-horario-habil-vs-no-habil-mainviewconsumordshorariocomponent-tsx)
- [`components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/table/ConsumoHorarioColumns.tsx`](#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-table-consumohorariocolumns-tsx)
- [`components/aws/vista-funciones/spot-vs-vm/MainViewSpotVsVmComponent.tsx`](#components-aws-vista-funciones-spot-vs-vm-mainviewspotvsvmcomponent-tsx)
- [`components/aws/vista-funciones/spot-vs-vm/SpotVsVmComponent.tsx`](#components-aws-vista-funciones-spot-vs-vm-spotvsvmcomponent-tsx)
- [`components/aws/vista-funciones/spot-vs-vm/grafico/SpotVsVmChartComponent.tsx`](#components-aws-vista-funciones-spot-vs-vm-grafico-spotvsvmchartcomponent-tsx)
- [`components/aws/vista-funciones/spot-vs-vm/table/SpotVsVmTableComponent.tsx`](#components-aws-vista-funciones-spot-vs-vm-table-spotvsvmtablecomponent-tsx)
- [`components/aws/vista-funciones/top-facturaciones/grafico/TopFacturacionChartComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-grafico-topfacturacionchartcomponent-tsx)
- [`components/aws/vista-funciones/top-facturaciones/top-dolares-por-famila-de-instancias/MainViewTopDolarFamiliaComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-por-famila-de-instancias-mainviewtopdolarfamiliacomponent-tsx)
- [`components/aws/vista-funciones/top-facturaciones/top-dolares-por-famila-de-instancias/TopDolarFamiliaComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-por-famila-de-instancias-topdolarfamiliacomponent-tsx)
- [`components/aws/vista-funciones/top-facturaciones/top-dolares-por-id-recurso/MainViewTopDolarRecursoComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-por-id-recurso-mainviewtopdolarrecursocomponent-tsx)
- [`components/aws/vista-funciones/top-facturaciones/top-dolares-por-id-recurso/TopDolarRecursoComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-por-id-recurso-topdolarrecursocomponent-tsx)
- [`components/aws/vista-funciones/top-facturaciones/top-dolares-por-tipo-de-cobro/MainViewTopDolarTipoCobroComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-cobro-mainviewtopdolartipocobrocomponent-tsx)
- [`components/aws/vista-funciones/top-facturaciones/top-dolares-por-tipo-de-cobro/TopDolarTipoCobroComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-cobro-topdolartipocobrocomponent-tsx)
- [`components/aws/vista-funciones/top-facturaciones/top-dolares-por-tipo-de-compra/MainViewTopDolarTipoCompraComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-compra-mainviewtopdolartipocompracomponent-tsx)
- [`components/aws/vista-funciones/top-facturaciones/top-dolares-por-tipo-de-compra/TopDolarTipoCompraComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-compra-topdolartipocompracomponent-tsx)
- [`components/aws/vista-funciones/top-facturaciones/top-dolares-por-tipo-de-instancia/MainViewTopDolarInstanciasComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-instancia-mainviewtopdolarinstanciascomponent-tsx)
- [`components/aws/vista-funciones/top-facturaciones/top-dolares-por-tipo-de-instancia/TopDolarInstanciasComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-instancia-topdolarinstanciascomponent-tsx)
- [`components/aws/vista-funciones/top-facturaciones/top-dolares-region/MainViewTopDolarRegionComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-region-mainviewtopdolarregioncomponent-tsx)
- [`components/aws/vista-funciones/top-facturaciones/top-dolares-region/TopDolarRegionComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-region-topdolarregioncomponent-tsx)
- [`components/aws/vista-funciones/top-facturaciones/top-dolares-so/MainViewTopDolarSOComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-so-mainviewtopdolarsocomponent-tsx)
- [`components/aws/vista-funciones/top-facturaciones/top-dolares-so/TopDolarSOComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-so-topdolarsocomponent-tsx)
- [`components/aws/vista-funciones/top-facturaciones/top-recursos/MainViewTopRecursosComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-recursos-mainviewtoprecursoscomponent-tsx)
- [`components/aws/vista-funciones/top-facturaciones/top-recursos/TopRecursosComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-recursos-toprecursoscomponent-tsx)
- [`components/aws/vista-funciones/top-facturaciones/top-recursos/grafico/topRecursosGroupBy.tsx`](#components-aws-vista-funciones-top-facturaciones-top-recursos-grafico-toprecursosgroupby-tsx)
- [`components/aws/vista-funciones/top-s3-buckets/MainViewTopS3BucketsComponent.tsx`](#components-aws-vista-funciones-top-s3-buckets-mainviewtops3bucketscomponent-tsx)
- [`components/aws/vista-funciones/top-s3-buckets/TopS3BucketsComponent.tsx`](#components-aws-vista-funciones-top-s3-buckets-tops3bucketscomponent-tsx)
- [`components/aws/vista-funciones/top-s3-buckets/grafico/S3StorageTypeChart.tsx`](#components-aws-vista-funciones-top-s3-buckets-grafico-s3storagetypechart-tsx)
- [`components/aws/vista-funciones/top-s3-buckets/grafico/TopS3BucketsChart.tsx`](#components-aws-vista-funciones-top-s3-buckets-grafico-tops3bucketschart-tsx)
- [`components/aws/vista-funciones/top-s3-buckets/grafico/TrendLineChart.tsx`](#components-aws-vista-funciones-top-s3-buckets-grafico-trendlinechart-tsx)
- [`components/aws/vista-funciones/top-s3-buckets/table/S3LifecycleColumns.tsx`](#components-aws-vista-funciones-top-s3-buckets-table-s3lifecyclecolumns-tsx)
- [`components/aws/vista-funciones/top-s3-buckets/table/S3LifecycleTableComponent.tsx`](#components-aws-vista-funciones-top-s3-buckets-table-s3lifecycletablecomponent-tsx)
- [`components/aws/vista-funciones/top-s3-buckets/table/S3VersioningColumns.tsx`](#components-aws-vista-funciones-top-s3-buckets-table-s3versioningcolumns-tsx)
- [`components/aws/vista-funciones/top-s3-buckets/table/S3VersioningTableComponent.tsx`](#components-aws-vista-funciones-top-s3-buckets-table-s3versioningtablecomponent-tsx)
- [`components/aws/vista-funciones/unused-ebs/MainViewUnusedEbsComponent.tsx`](#components-aws-vista-funciones-unused-ebs-mainviewunusedebscomponent-tsx)
- [`components/aws/vista-funciones/unused-ebs/UnusedEbsComponent.tsx`](#components-aws-vista-funciones-unused-ebs-unusedebscomponent-tsx)
- [`components/aws/vista-funciones/unused-ebs/table/UnusedEbsColumns.tsx`](#components-aws-vista-funciones-unused-ebs-table-unusedebscolumns-tsx)
- [`components/aws/vista-funciones/unused-ec2/MainViewUnusedAutoscalingComponent.tsx`](#components-aws-vista-funciones-unused-ec2-mainviewunusedautoscalingcomponent-tsx)
- [`components/aws/vista-funciones/unused-ec2/MainViewUnusedEc2Component.tsx`](#components-aws-vista-funciones-unused-ec2-mainviewunusedec2component-tsx)
- [`components/aws/vista-funciones/unused-ec2/MainViewUnusedEksComponent.tsx`](#components-aws-vista-funciones-unused-ec2-mainviewunusedekscomponent-tsx)
- [`components/aws/vista-funciones/unused-ec2/UnusedAutoscalingComponent.tsx`](#components-aws-vista-funciones-unused-ec2-unusedautoscalingcomponent-tsx)
- [`components/aws/vista-funciones/unused-ec2/UnusedEc2Component.tsx`](#components-aws-vista-funciones-unused-ec2-unusedec2component-tsx)
- [`components/aws/vista-funciones/unused-ec2/UnusedEksComponent.tsx`](#components-aws-vista-funciones-unused-ec2-unusedekscomponent-tsx)
- [`components/aws/vista-funciones/unused-ec2/table/UnusedEc2Columns.tsx`](#components-aws-vista-funciones-unused-ec2-table-unusedec2columns-tsx)
- [`components/aws/vista-funciones/unused-elbv2/MainViewUnusedElbV2Component.tsx`](#components-aws-vista-funciones-unused-elbv2-mainviewunusedelbv2component-tsx)
- [`components/aws/vista-funciones/unused-elbv2/UnusedElbV2Component.tsx`](#components-aws-vista-funciones-unused-elbv2-unusedelbv2component-tsx)
- [`components/aws/vista-funciones/unused-elbv2/info/UnusedElbV2InsightModal.tsx`](#components-aws-vista-funciones-unused-elbv2-info-unusedelbv2insightmodal-tsx)
- [`components/aws/vista-funciones/unused-elbv2/table/UnusedElbV2Columns.tsx`](#components-aws-vista-funciones-unused-elbv2-table-unusedelbv2columns-tsx)
- [`components/aws/vista-funciones/unused-nat-gateways/MainViewUnusedNatGatewaysComponent.tsx`](#components-aws-vista-funciones-unused-nat-gateways-mainviewunusednatgatewayscomponent-tsx)
- [`components/aws/vista-funciones/unused-nat-gateways/UnusedNatGatewaysComponent.tsx`](#components-aws-vista-funciones-unused-nat-gateways-unusednatgatewayscomponent-tsx)
- [`components/aws/vista-funciones/unused-nat-gateways/info/UnusedNatGatewaysInsightModal.tsx`](#components-aws-vista-funciones-unused-nat-gateways-info-unusednatgatewaysinsightmodal-tsx)
- [`components/aws/vista-funciones/unused-nat-gateways/table/UnusedNatGatewaysColumns.tsx`](#components-aws-vista-funciones-unused-nat-gateways-table-unusednatgatewayscolumns-tsx)
- [`components/aws/vista-funciones/unused-r53/MainViewUnusedRoute53Component.tsx`](#components-aws-vista-funciones-unused-r53-mainviewunusedroute53component-tsx)
- [`components/aws/vista-funciones/unused-r53/UnusedRoute53Component.tsx`](#components-aws-vista-funciones-unused-r53-unusedroute53component-tsx)
- [`components/aws/vista-funciones/variacion-tendencia-uso-de-recursos/MainViewVariacionTendenciaUsoDeRecursosComponent.tsx`](#components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-mainviewvariaciontendenciausoderecursoscomponent-tsx)
- [`components/aws/vista-funciones/variacion-tendencia-uso-de-recursos/VariacionTendenciaUsoDeRecursosComponent.tsx`](#components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-variaciontendenciausoderecursoscomponent-tsx)
- [`components/aws/vista-funciones/variacion-tendencia-uso-de-recursos/grafico/TrendLineChartv2.tsx`](#components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-grafico-trendlinechartv2-tsx)
- [`components/aws/vista-funciones/variacion-tendencia-uso-de-recursos/info/VariacionTendenciaUsoDeRecursosCardsComponent.tsx`](#components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-info-variaciontendenciausoderecursoscardscomponent-tsx)

<a id="components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil-consumoec2asghorariocomponent-tsx"></a>
## `components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil/ConsumoEC2AsgHorarioComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ConsumoEC2AsgHorarioComponent` `({ startDate, endDate, instance, region }: ConsumoEC2AsgHorarioComponentProps)` — Horario hábil vs no hábil Auto Scaling Groups: adapta los filtros de la vista al contrato canónico (/api/aws/working-hours/asg/*).

Interfaz `ConsumoEC2AsgHorarioComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `instance` | `string` | no | — |
| `region` | `string` | no | — |

- Usa: [`WorkingHoursView.tsx`](../shared.md#components-shared-working-hours-workinghoursview-tsx), [`workingHoursConfigs.ts`](../shared.md#components-shared-working-hours-workinghoursconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewConsumoEC2AsgHorarioComponent.tsx`](#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil-mainviewconsumoec2asghorariocomponent-tsx)

---

<a id="components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil-mainviewconsumoec2asghorariocomponent-tsx"></a>
## `components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil/MainViewConsumoEC2AsgHorarioComponent.tsx`

**Componente**

Exporta:

- componente `ViewConsumoEC2AutoscalingGroupsHorario` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`ConsumoEC2AsgHorarioComponent.tsx`](#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil-consumoec2asghorariocomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil-page-tsx)

Notas de implementación:

- JSX — Header

---

<a id="components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-horario-habil-vs-no-habil-consumoec2horariocomponent-tsx"></a>
## `components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-ec2-horario-habil-vs-no-habil/ConsumoEC2HorarioComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ConsumoEC2HorarioComponent` `({ startDate, endDate, instance, region }: ConsumoEC2HorarioComponentProps)` — Horario hábil vs no hábil EC2: adapta los filtros de la vista al contrato canónico (/api/aws/working-hours/ec2/*).

Interfaz `ConsumoEC2HorarioComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `instance` | `string` | no | — |
| `region` | `string` | no | — |

- Usa: [`WorkingHoursView.tsx`](../shared.md#components-shared-working-hours-workinghoursview-tsx), [`workingHoursConfigs.ts`](../shared.md#components-shared-working-hours-workinghoursconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewConsumoEC2HorarioComponent.tsx`](#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-horario-habil-vs-no-habil-mainviewconsumoec2horariocomponent-tsx), [`MainViewConsumoRdsHorarioComponent.tsx`](#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-rds-horario-habil-vs-no-habil-mainviewconsumordshorariocomponent-tsx)

---

<a id="components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-horario-habil-vs-no-habil-mainviewconsumoec2horariocomponent-tsx"></a>
## `components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-ec2-horario-habil-vs-no-habil/MainViewConsumoEC2HorarioComponent.tsx`

**Componente**

Exporta:

- componente `ViewConsumoEC2Horario` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`ConsumoEC2HorarioComponent.tsx`](#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-horario-habil-vs-no-habil-consumoec2horariocomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-consumo-ec2-horario-habil-vs-no-habil-page-tsx)

---

<a id="components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-nodos-eks-horario-habil-vs-no-habil-consumoec2nodosekshorariocomponent-tsx"></a>
## `components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-ec2-nodos-eks-horario-habil-vs-no-habil/ConsumoEC2NodosEKSHorarioComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ConsumoEC2NodosEKSHorarioComponent` `({ startDate, endDate, instance, region }: ConsumoEC2NodosEKSHorarioComponentProps)` — Horario hábil vs no hábil nodos EKS: adapta los filtros de la vista al contrato canónico (/api/aws/working-hours/eks/*).

Interfaz `ConsumoEC2NodosEKSHorarioComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `instance` | `string` | no | — |
| `region` | `string` | no | — |

- Usa: [`WorkingHoursView.tsx`](../shared.md#components-shared-working-hours-workinghoursview-tsx), [`workingHoursConfigs.ts`](../shared.md#components-shared-working-hours-workinghoursconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewConsumoEC2NodosEKSHorarioComponent.tsx`](#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-nodos-eks-horario-habil-vs-no-habil-mainviewconsumoec2nodosekshorariocomponent-tsx)

---

<a id="components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-nodos-eks-horario-habil-vs-no-habil-mainviewconsumoec2nodosekshorariocomponent-tsx"></a>
## `components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-ec2-nodos-eks-horario-habil-vs-no-habil/MainViewConsumoEC2NodosEKSHorarioComponent.tsx`

**Componente**

Exporta:

- componente `ViewConsumoEC2NodesEKSHorario` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`ConsumoEC2NodosEKSHorarioComponent.tsx`](#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-nodos-eks-horario-habil-vs-no-habil-consumoec2nodosekshorariocomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-consumo-ec2-nodos-eks-horario-habil-vs-no-habil-page-tsx)

Notas de implementación:

- JSX — Header

---

<a id="components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-rds-horario-habil-vs-no-habil-consumordshorariocomponent-tsx"></a>
## `components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-rds-horario-habil-vs-no-habil/ConsumoRdsHorarioComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ConsumoRdsHorarioComponent` `({ startDate, endDate, instance, region, dbType }: ConsumoRdsHorarioComponentProps)` — Horario hábil vs no hábil RDS: adapta los filtros de la vista al contrato canónico (/api/aws/working-hours/rds/*).

Interfaz `ConsumoRdsHorarioComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `instance` | `string` | no | — |
| `region` | `string` | no | — |
| `dbType` | `string` | sí | — |

- Usa: [`WorkingHoursView.tsx`](../shared.md#components-shared-working-hours-workinghoursview-tsx), [`workingHoursConfigs.ts`](../shared.md#components-shared-working-hours-workinghoursconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewConsumoRdsHorarioComponent.tsx`](#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-rds-horario-habil-vs-no-habil-mainviewconsumordshorariocomponent-tsx)

---

<a id="components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-rds-horario-habil-vs-no-habil-mainviewconsumordshorariocomponent-tsx"></a>
## `components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-rds-horario-habil-vs-no-habil/MainViewConsumoRdsHorarioComponent.tsx`

**Componente**

Exporta:

- componente `MainViewConsumoRdsHorario` `({ dbType }: { dbType: string })`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`ConsumoEC2HorarioComponent.tsx`](#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-horario-habil-vs-no-habil-consumoec2horariocomponent-tsx), [`ConsumoRdsHorarioComponent.tsx`](#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-rds-horario-habil-vs-no-habil-consumordshorariocomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-consumo-rds-mariadb-horario-habil-vs-no-habil-page-tsx), [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-consumo-rds-mysql-horario-habil-vs-no-habil-page-tsx), [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-consumo-rds-oracle-horario-habil-vs-no-habil-page-tsx), [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-consumo-rds-postgresql-horario-habil-vs-no-habil-page-tsx), [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-consumo-rds-sql-horario-habil-vs-no-habil-page-tsx)

---

<a id="components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-table-consumohorariocolumns-tsx"></a>
## `components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/table/ConsumoHorarioColumns.tsx`

**Módulo (cliente)**

Exporta:

- función `getMetricFormat` `(metricName: string): 'percent' | 'bytes' | 'number'`
- función `formatMetricName` `(name: string): string`
- función `getConsumoHorarioColumns` `(uniqueMetrics: string[], maxValues: Record<string, number>, resourceType: string = 'EC2'): DynamicColumn<WorkingNonWorkingHoursUsageSummaryByResource>[]`

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
- componente `DetailsCell` `({ row, resourceType }: { row: WorkingNonWorkingHoursUsageSummaryByResource; resourceType: string })`
- componente `GetParameters` `()`

- Hooks: `usePathname`, `useSearchParams`
- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts), [`filters.ts`](../../lib.md#lib-filters-ts)

Notas de implementación:

- _DualMetricCell_: Función de formateo
- _DualMetricCell_: 1. Obtenemos los valores visuales exactos
- _DualMetricCell_: 2. Calculamos la tendencia basándonos en lo que ve el usuario (post-redondeo)
- _DualMetricCell_: Solo si visualmente son distintos, miramos los datos crudos para ver quién gana
- _DualMetricCell_: JSX — Opcional: Espacio vacío o indicador de balanceado si son iguales

---

<a id="components-aws-vista-funciones-spot-vs-vm-mainviewspotvsvmcomponent-tsx"></a>
## `components/aws/vista-funciones/spot-vs-vm/MainViewSpotVsVmComponent.tsx`

**Componente**

Exporta:

- componente `ViewSpotVsVm` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`SpotVsVmComponent.tsx`](#components-aws-vista-funciones-spot-vs-vm-spotvsvmcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-spot-vs-vm-page-tsx)

Notas de implementación:

- JSX — Header

---

<a id="components-aws-vista-funciones-spot-vs-vm-spotvsvmcomponent-tsx"></a>
## `components/aws/vista-funciones/spot-vs-vm/SpotVsVmComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewSpotVsVm` `({ startDate, endDate }: SpotVsVmProps)`

Interfaz `SpotVsVmProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |

- API: `/api/aws/bridge/vm/spot_vs_vm`
- Hooks: `useSWR`
- Usa: [`spotVsRegularVmInterfaces.ts`](../../tipos.md#interfaces-vista-spot-vs-regular-vm-spotvsregularvminterfaces-ts), [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx), [`SpotVsVmTableComponent.tsx`](#components-aws-vista-funciones-spot-vs-vm-table-spotvsvmtablecomponent-tsx), [`SpotVsVmChartComponent.tsx`](#components-aws-vista-funciones-spot-vs-vm-grafico-spotvsvmchartcomponent-tsx)
- Usado por: [`MainViewSpotVsVmComponent.tsx`](#components-aws-vista-funciones-spot-vs-vm-mainviewspotvsvmcomponent-tsx)

Notas de implementación:

- 📌 Calcular métricas finales
- `const last = data[data.length - 1]` — último registro
- Solo día/mes (si prefieres dd/mm/yyyy agrega también d.getUTCFullYear())
- JSX — 📌 Tarjetas métricas
- JSX — Total VMs
- JSX — Total Spot VMs
- JSX — % Spot
- JSX — 📊 Gráfico
- JSX — Tabla

---

<a id="components-aws-vista-funciones-spot-vs-vm-grafico-spotvsvmchartcomponent-tsx"></a>
## `components/aws/vista-funciones/spot-vs-vm/grafico/SpotVsVmChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `SpotVsVmChartComponent` `({ data }: SpotVsVmChartComponentProps)`

Interfaz `SpotVsVmChartComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `SpotVsRegularVm[]` | no | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`spotVsRegularVmInterfaces.ts`](../../tipos.md#interfaces-vista-spot-vs-regular-vm-spotvsregularvminterfaces-ts), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`SpotVsVmComponent.tsx`](#components-aws-vista-funciones-spot-vs-vm-spotvsvmcomponent-tsx)

Notas de implementación:

- `const last = data[data.length - 1]` — último registro

---

<a id="components-aws-vista-funciones-spot-vs-vm-table-spotvsvmtablecomponent-tsx"></a>
## `components/aws/vista-funciones/spot-vs-vm/table/SpotVsVmTableComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `TableComponentSpotVsVm` `({ startDateFormatted, endDateFormatted, }: { startDateFormatted: string endDateFormatted: string })`

- Tipo interno `InstanceData` = `{ InstanceId: string InstancePurchaseMethod: string belong_to_asg: boolean belong_to_eks: boolean AutoScalingGroupName:…`
- Tipo interno `SpotVsVmApiResponse` = `{ sync_time: string total_spot: number total_instancias: number instancias: InstanceData[] }`
- API: `/api/aws/bridge/vm/spot_vs_vm`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx)
- Usado por: [`SpotVsVmComponent.tsx`](#components-aws-vista-funciones-spot-vs-vm-spotvsvmcomponent-tsx)

Notas de implementación:

- 🔎 Flatten: cada fila será una instancia con su fecha asociada

---

<a id="components-aws-vista-funciones-top-facturaciones-grafico-topfacturacionchartcomponent-tsx"></a>
## `components/aws/vista-funciones/top-facturaciones/grafico/TopFacturacionChartComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `TopFacturacionRow` — Fila de /facturacion/top_facturacion/{dimensión} (costo por dimensión y período).
- tipo `TopFacturacionResponse` = `TopFacturacionRow[] | { data?: TopFacturacionRow[] }` — La API responde una lista o `{ data: lista }`.
- componente `TopFacturacionChartComponent` `({ data, selectedFamily, setSelectedFamily, tipoCosto, topLimit, uiTuning, detailsEnabled = true, isBilling = true }: TopFacturacionChartComponentProps)`

Interfaz `LegendCfg`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `type` | `'plain' \| 'scroll'` | sí | — |
| `orient` | `'horizontal' \| 'vertical'` | sí | — |
| `top` | `number \| string` | sí | — |
| `bottom` | `number \| string` | sí | — |
| `left` | `number \| string` | sí | — |
| `right` | `number \| string` | sí | — |

Interfaz `UiTuning`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `yLabelStrategy` | `'truncate' \| 'fit'` | sí | — |
| `yLabelMaxChars` | `number` | sí | — |
| `yLabelFontSize` | `number` | sí | — |
| `gridMinLeft` | `number` | sí | — |
| `gridMaxLeft` | `number` | sí | — |
| `axisLabelInterval` | `number \| 'auto'` | sí | — |
| `legend` | `LegendCfg` | sí | — |

Interfaz `TopFacturacionRow` (exportada) — Fila de /facturacion/top_facturacion/{dimensión} (costo por dimensión y período).:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `dimension` | `string` | sí | — |
| `costo_neto` | `number` | sí | — |
| `costo_bruto` | `number` | sí | — |
| `[key: string]: unknown;` | `unknown` | no | — |

Interfaz `TopFacturacionChartComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `unknown[] \| { data?: unknown[] }` | no | — |
| `selectedFamily` | `string` | no | — |
| `setSelectedFamily` | `React.Dispatch<React.SetStateAction<string \| null>>` | no | — |
| `tipoCosto` | `'costo_neto' \| 'costo_bruto'` | no | — |
| `topLimit` | `number \| 'all'` | no | — |
| `uiTuning` | `UiTuning` | sí | — |
| `detailsEnabled` | `boolean` | sí | — |
| `isBilling` | `boolean` | sí | — |

- Tipo interno `CostKey` = `'costo_neto' | 'costo_bruto'`
Internos:

- función `toNumber` `(v: unknown)`
- función `getStr` `(v: unknown)`
- función `clamp` `(n: number, min: number, max: number)`

- Hooks: `useECharts`, `useTheme`
- Usa: [`button.tsx`](../ui.md#components-ui-button-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`topRecursosGroupBy.tsx`](#components-aws-vista-funciones-top-facturaciones-top-recursos-grafico-toprecursosgroupby-tsx)

---

<a id="components-aws-vista-funciones-top-facturaciones-top-dolares-por-famila-de-instancias-mainviewtopdolarfamiliacomponent-tsx"></a>
## `components/aws/vista-funciones/top-facturaciones/top-dolares-por-famila-de-instancias/MainViewTopDolarFamiliaComponent.tsx`

**Componente**

Exporta:

- componente `TopDolarFamiliaComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`TopDolarFamiliaComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-por-famila-de-instancias-topdolarfamiliacomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-top-dolares-por-familia-de-instancia-page-tsx)

Notas de implementación:

- JSX — Header

---

<a id="components-aws-vista-funciones-top-facturaciones-top-dolares-por-famila-de-instancias-topdolarfamiliacomponent-tsx"></a>
## `components/aws/vista-funciones/top-facturaciones/top-dolares-por-famila-de-instancias/TopDolarFamiliaComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewTopDolaresFamilia` `({ startDate, endDate }: TopDolaresInstanceTypeFamilyProps)` — Top de facturación AWS por familia de instancia: adaptador sobre la vista común (`/api/aws/billing/top?dimension=...`).

Interfaz `TopDolaresInstanceTypeFamilyProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |

- Usa: [`TopBillingView.tsx`](../shared.md#components-shared-billing-topbillingview-tsx), [`billingConfigs.ts`](../shared.md#components-shared-billing-billingconfigs-ts)
- Usado por: [`MainViewTopDolarFamiliaComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-por-famila-de-instancias-mainviewtopdolarfamiliacomponent-tsx)

---

<a id="components-aws-vista-funciones-top-facturaciones-top-dolares-por-id-recurso-mainviewtopdolarrecursocomponent-tsx"></a>
## `components/aws/vista-funciones/top-facturaciones/top-dolares-por-id-recurso/MainViewTopDolarRecursoComponent.tsx`

**Componente**

Exporta:

- componente `TopDolarRecursoComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`TopDolarRecursoComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-por-id-recurso-topdolarrecursocomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-top-dolares-por-id-recurso-page-tsx)

Notas de implementación:

- JSX — Header

---

<a id="components-aws-vista-funciones-top-facturaciones-top-dolares-por-id-recurso-topdolarrecursocomponent-tsx"></a>
## `components/aws/vista-funciones/top-facturaciones/top-dolares-por-id-recurso/TopDolarRecursoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewTopDolaresRecurso` `({ startDate, endDate }: TopDolaresResourceProps)` — Top de facturación AWS por recurso: adaptador sobre la vista común (`/api/aws/billing/top?dimension=...`).

Interfaz `TopDolaresResourceProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |

- Usa: [`TopBillingView.tsx`](../shared.md#components-shared-billing-topbillingview-tsx), [`billingConfigs.ts`](../shared.md#components-shared-billing-billingconfigs-ts)
- Usado por: [`MainViewTopDolarRecursoComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-por-id-recurso-mainviewtopdolarrecursocomponent-tsx)

---

<a id="components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-cobro-mainviewtopdolartipocobrocomponent-tsx"></a>
## `components/aws/vista-funciones/top-facturaciones/top-dolares-por-tipo-de-cobro/MainViewTopDolarTipoCobroComponent.tsx`

**Componente**

Exporta:

- componente `TopDolarTipoCobroComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`TopDolarTipoCobroComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-cobro-topdolartipocobrocomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-top-dolares-por-tipo-de-cobro-page-tsx)

Notas de implementación:

- JSX — Header

---

<a id="components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-cobro-topdolartipocobrocomponent-tsx"></a>
## `components/aws/vista-funciones/top-facturaciones/top-dolares-por-tipo-de-cobro/TopDolarTipoCobroComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewTopDolaresTipoCobro` `({ startDate, endDate }: TopDolaresRecordTypeProps)` — Top de facturación AWS por tipo de cobro: adaptador sobre la vista común (`/api/aws/billing/top?dimension=...`).

Interfaz `TopDolaresRecordTypeProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |

- Usa: [`TopBillingView.tsx`](../shared.md#components-shared-billing-topbillingview-tsx), [`billingConfigs.ts`](../shared.md#components-shared-billing-billingconfigs-ts)
- Usado por: [`MainViewTopDolarTipoCobroComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-cobro-mainviewtopdolartipocobrocomponent-tsx)

---

<a id="components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-compra-mainviewtopdolartipocompracomponent-tsx"></a>
## `components/aws/vista-funciones/top-facturaciones/top-dolares-por-tipo-de-compra/MainViewTopDolarTipoCompraComponent.tsx`

**Componente**

Exporta:

- componente `TopDolarTipoCompraComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`TopDolarTipoCompraComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-compra-topdolartipocompracomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-top-dolares-por-tipo-de-compra-page-tsx)

Notas de implementación:

- JSX — Header

---

<a id="components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-compra-topdolartipocompracomponent-tsx"></a>
## `components/aws/vista-funciones/top-facturaciones/top-dolares-por-tipo-de-compra/TopDolarTipoCompraComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewTopDolaresTipoCompra` `({ startDate, endDate }: TopDolaresPurchaseTypeProps)` — Top de facturación AWS por tipo de compra: adaptador sobre la vista común (`/api/aws/billing/top?dimension=...`).

Interfaz `TopDolaresPurchaseTypeProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |

- Usa: [`TopBillingView.tsx`](../shared.md#components-shared-billing-topbillingview-tsx), [`billingConfigs.ts`](../shared.md#components-shared-billing-billingconfigs-ts)
- Usado por: [`MainViewTopDolarTipoCompraComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-compra-mainviewtopdolartipocompracomponent-tsx)

---

<a id="components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-instancia-mainviewtopdolarinstanciascomponent-tsx"></a>
## `components/aws/vista-funciones/top-facturaciones/top-dolares-por-tipo-de-instancia/MainViewTopDolarInstanciasComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewTopDolaresTipoInstancia` `({ startDate, endDate }: TopDolaresInstanceTypeProps)` — Top de facturación AWS por tipo de instancia: adaptador sobre la vista común (`/api/aws/billing/top?dimension=...`).

Interfaz `TopDolaresInstanceTypeProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |

- Usa: [`TopBillingView.tsx`](../shared.md#components-shared-billing-topbillingview-tsx), [`billingConfigs.ts`](../shared.md#components-shared-billing-billingconfigs-ts)
- Usado por: [`TopDolarInstanciasComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-instancia-topdolarinstanciascomponent-tsx)

---

<a id="components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-instancia-topdolarinstanciascomponent-tsx"></a>
## `components/aws/vista-funciones/top-facturaciones/top-dolares-por-tipo-de-instancia/TopDolarInstanciasComponent.tsx`

**Componente**

Exporta:

- componente `TopDolarInstanciasComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`MainViewTopDolarInstanciasComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-por-tipo-de-instancia-mainviewtopdolarinstanciascomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-top-dolares-por-tipo-de-instancia-page-tsx)

Notas de implementación:

- JSX — Header

---

<a id="components-aws-vista-funciones-top-facturaciones-top-dolares-region-mainviewtopdolarregioncomponent-tsx"></a>
## `components/aws/vista-funciones/top-facturaciones/top-dolares-region/MainViewTopDolarRegionComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewTopDolaresRegion` `({ startDate, endDate }: TopDolaresRegionComponentProps)` — Top de facturación AWS por región: adaptador sobre la vista común (`/api/aws/billing/top?dimension=...`).

Interfaz `TopDolaresRegionComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |

- Usa: [`TopBillingView.tsx`](../shared.md#components-shared-billing-topbillingview-tsx), [`billingConfigs.ts`](../shared.md#components-shared-billing-billingconfigs-ts)
- Usado por: [`TopDolarRegionComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-region-topdolarregioncomponent-tsx)

---

<a id="components-aws-vista-funciones-top-facturaciones-top-dolares-region-topdolarregioncomponent-tsx"></a>
## `components/aws/vista-funciones/top-facturaciones/top-dolares-region/TopDolarRegionComponent.tsx`

**Componente**

Exporta:

- componente `TopDolarRegionComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`MainViewTopDolarRegionComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-region-mainviewtopdolarregioncomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-top-dolares-region-page-tsx)

Notas de implementación:

- JSX — Header

---

<a id="components-aws-vista-funciones-top-facturaciones-top-dolares-so-mainviewtopdolarsocomponent-tsx"></a>
## `components/aws/vista-funciones/top-facturaciones/top-dolares-so/MainViewTopDolarSOComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewTopDolaresSO` `({ startDate, endDate }: TopDolaresOSComponentProps)` — Top de facturación AWS por sistema operativo: adaptador sobre la vista común (`/api/aws/billing/top?dimension=...`).

Interfaz `TopDolaresOSComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |

- Usa: [`TopBillingView.tsx`](../shared.md#components-shared-billing-topbillingview-tsx), [`billingConfigs.ts`](../shared.md#components-shared-billing-billingconfigs-ts)
- Usado por: [`TopDolarSOComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-so-topdolarsocomponent-tsx)

---

<a id="components-aws-vista-funciones-top-facturaciones-top-dolares-so-topdolarsocomponent-tsx"></a>
## `components/aws/vista-funciones/top-facturaciones/top-dolares-so/TopDolarSOComponent.tsx`

**Componente**

Exporta:

- componente `TopDolarSOComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`MainViewTopDolarSOComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-dolares-so-mainviewtopdolarsocomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-top-dolares-so-page-tsx)

Notas de implementación:

- JSX — Header

---

<a id="components-aws-vista-funciones-top-facturaciones-top-recursos-mainviewtoprecursoscomponent-tsx"></a>
## `components/aws/vista-funciones/top-facturaciones/top-recursos/MainViewTopRecursosComponent.tsx`

**Componente**

Exporta:

- componente `TopRecursosComponent` `()`

- Usa: [`TopRecursosComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-recursos-toprecursoscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-top-recursos-page-tsx)

---

<a id="components-aws-vista-funciones-top-facturaciones-top-recursos-toprecursoscomponent-tsx"></a>
## `components/aws/vista-funciones/top-facturaciones/top-recursos/TopRecursosComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewTopRecursos` `()`

- Usa: [`topRecursosGroupBy.tsx`](#components-aws-vista-funciones-top-facturaciones-top-recursos-grafico-toprecursosgroupby-tsx)
- Usado por: [`MainViewTopRecursosComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-recursos-mainviewtoprecursoscomponent-tsx)

---

<a id="components-aws-vista-funciones-top-facturaciones-top-recursos-grafico-toprecursosgroupby-tsx"></a>
## `components/aws/vista-funciones/top-facturaciones/top-recursos/grafico/topRecursosGroupBy.tsx`

**Componente (cliente)**

Exporta:

- componente `TopRecursosChart` `({ groupBy, title, icon }: TopRecursosProps)`

Interfaz `TopRecursosProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `groupBy` | `'ResourceRegion' \| 'ResourceType' \| 'ResourceService'` | no | — |
| `title` | `string` | no | — |
| `icon` | `React.ReactNode` | sí | — |

- Tipo interno `Row` = `{ group_by: unknown total_unique_resources: unknown }`
- API: `/api/aws/bridge/recursos/top_recursos_unicos`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx), [`select.tsx`](../ui.md#components-ui-select-tsx), [`TopFacturacionChartComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-grafico-topfacturacionchartcomponent-tsx)
- Usado por: [`TopRecursosComponent.tsx`](#components-aws-vista-funciones-top-facturaciones-top-recursos-toprecursoscomponent-tsx)

---

<a id="components-aws-vista-funciones-top-s3-buckets-mainviewtops3bucketscomponent-tsx"></a>
## `components/aws/vista-funciones/top-s3-buckets/MainViewTopS3BucketsComponent.tsx`

**Componente**

Exporta:

- componente `ViewTopS3Buckets` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`TopS3BucketsComponent.tsx`](#components-aws-vista-funciones-top-s3-buckets-tops3bucketscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-top-s3-buckets-page-tsx)

Notas de implementación:

- JSX — Header

---

<a id="components-aws-vista-funciones-top-s3-buckets-tops3bucketscomponent-tsx"></a>
## `components/aws/vista-funciones/top-s3-buckets/TopS3BucketsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `TopS3BucketsComponent` `({ startDate, endDate, region, buckets, }: TopS3BucketsProps)`

Interfaz `S3InfoItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `total_size_gb` | `number` | sí | — |
| `total_objects` | `number` | sí | — |
| `total_buckets` | `number` | sí | — |
| `[key: string]: unknown` | `unknown` | no | — |

Interfaz `TopS3BucketsProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | sí | — |
| `buckets` | `string` | sí | — |

- API: `/api/aws/bridge/s3/top_s3_buckets/info`, `/api/aws/bridge/s3/top_s3_buckets/lifecycle`, `/api/aws/bridge/s3/top_s3_buckets/metrics`, `/api/aws/bridge/s3/top_s3_buckets/tops`, `/api/aws/bridge/s3/top_s3_buckets/versioning`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx), [`TopS3BucketsChart.tsx`](#components-aws-vista-funciones-top-s3-buckets-grafico-tops3bucketschart-tsx), [`TrendLineChart.tsx`](#components-aws-vista-funciones-top-s3-buckets-grafico-trendlinechart-tsx), [`S3StorageTypeChart.tsx`](#components-aws-vista-funciones-top-s3-buckets-grafico-s3storagetypechart-tsx), [`S3VersioningTableComponent.tsx`](#components-aws-vista-funciones-top-s3-buckets-table-s3versioningtablecomponent-tsx), [`S3LifecycleTableComponent.tsx`](#components-aws-vista-funciones-top-s3-buckets-table-s3lifecycletablecomponent-tsx), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx), [`MessageCards.tsx`](cards.md#components-aws-cards-messagecards-tsx), [`topS3BucketsInterfaces.ts`](../../tipos.md#interfaces-vista-top-s3-buckets-tops3bucketsinterfaces-ts)
- Usado por: [`MainViewTopS3BucketsComponent.tsx`](#components-aws-vista-funciones-top-s3-buckets-mainviewtops3bucketscomponent-tsx)

---

<a id="components-aws-vista-funciones-top-s3-buckets-grafico-s3storagetypechart-tsx"></a>
## `components/aws/vista-funciones/top-s3-buckets/grafico/S3StorageTypeChart.tsx`

**Componente (cliente)**

Exporta:

- componente `S3StorageTypeChart` `({ data, metric, title }: S3StorageTypeChartProps)`

Interfaz `S3StorageTypeChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `S3MetricItem[]` | no | — |
| `metric` | `'NumberOfObjects Average' \| 'BucketSizeBytes Average'` | no | — |
| `title` | `string` | no | — |

Internos:

- función `toNumber` `(value: unknown): number`

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`select.tsx`](../ui.md#components-ui-select-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts), [`topS3BucketsInterfaces.ts`](../../tipos.md#interfaces-vista-top-s3-buckets-tops3bucketsinterfaces-ts)
- Usado por: [`TopS3BucketsComponent.tsx`](#components-aws-vista-funciones-top-s3-buckets-tops3bucketscomponent-tsx)

---

<a id="components-aws-vista-funciones-top-s3-buckets-grafico-tops3bucketschart-tsx"></a>
## `components/aws/vista-funciones/top-s3-buckets/grafico/TopS3BucketsChart.tsx`

**Componente (cliente)**

Exporta:

- componente `TopS3BucketsChart` `({ data, metric, title }: TopS3BucketsChartProps)`

Interfaz `TopS3BucketsChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `unknown[]` | no | — |
| `metric` | `'NumberOfObjects Average' \| 'BucketSizeBytes Average'` | no | — |
| `title` | `string` | no | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`select.tsx`](../ui.md#components-ui-select-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`TopS3BucketsComponent.tsx`](#components-aws-vista-funciones-top-s3-buckets-tops3bucketscomponent-tsx)

Notas de implementación:

- `overflow: 'break',` — parte en varias líneas si no cabe

---

<a id="components-aws-vista-funciones-top-s3-buckets-grafico-trendlinechart-tsx"></a>
## `components/aws/vista-funciones/top-s3-buckets/grafico/TrendLineChart.tsx`

**Componente (cliente)**

Exporta:

- componente `TrendLineChart` `({ data, metric, title, yAxisLabel, }: TrendLineChartProps)`

Interfaz `TrendLineChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `unknown[]` | no | — |
| `metric` | `'NumberOfObjects Average' \| 'BucketSizeBytes Average'` | no | — |
| `title` | `string` | no | — |
| `yAxisLabel` | `string` | no | — |

Internos:

- función `parseISO` `(s: string): Date`
- constante `fmt`
- constante `fmtFull`

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`TopS3BucketsComponent.tsx`](#components-aws-vista-funciones-top-s3-buckets-tops3bucketscomponent-tsx)

Notas de implementación:

- Tomamos el valor crudo del eje (tu timestamp ISO)
- Encabezado con la fecha formateada
- `header = fmtFull.format(d);` — p.ej. "1 oct"
- si falla el parseo, mostramos tal cual
- Filas por serie (soporta 1+ series)
- value puede ser number|string|[x,y]
- grid: { left: 150, right: 50, top: 60, bottom: 60 },

---

<a id="components-aws-vista-funciones-top-s3-buckets-table-s3lifecyclecolumns-tsx"></a>
## `components/aws/vista-funciones/top-s3-buckets/table/S3LifecycleColumns.tsx`

**Módulo (cliente)**

Exporta:

- función `getS3LifecycleColumns` `(): DynamicColumn<S3LifecycleRow>[]`
- función `getS3LifecycleHistoryColumns` `(): DynamicColumn<S3LifecycleHistoryRow>[]`

Internos:

- función `statusClass` `(value: string | null): string`
- componente `PlainCell` `({ value }: { value: string })`

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`topS3BucketsInterfaces.ts`](../../tipos.md#interfaces-vista-top-s3-buckets-tops3bucketsinterfaces-ts)
- Usado por: [`S3LifecycleTableComponent.tsx`](#components-aws-vista-funciones-top-s3-buckets-table-s3lifecycletablecomponent-tsx)

---

<a id="components-aws-vista-funciones-top-s3-buckets-table-s3lifecycletablecomponent-tsx"></a>
## `components/aws/vista-funciones/top-s3-buckets/table/S3LifecycleTableComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `S3LifecycleTableComponent` `({ data }: S3LifecycleTableComponentProps)`

Interfaz `S3LifecycleTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `S3LifecycleItem[]` | no | — |

Internos:

- constante `fmtSync`
- función `formatSyncTime` `(value: string): string`
- función `statusLabel` `(value: string | null): string`
- función `describeTransitions` `(transitions: S3LifecycleTransition[] | undefined, noncurrent: boolean): string`
- función `describeExpiration` `(row: S3LifecycleItem): string`
- componente `TableLegend` `()`

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`select.tsx`](../ui.md#components-ui-select-tsx), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`topS3BucketsInterfaces.ts`](../../tipos.md#interfaces-vista-top-s3-buckets-tops3bucketsinterfaces-ts), [`S3LifecycleColumns.tsx`](#components-aws-vista-funciones-top-s3-buckets-table-s3lifecyclecolumns-tsx)
- Usado por: [`TopS3BucketsComponent.tsx`](#components-aws-vista-funciones-top-s3-buckets-tops3bucketscomponent-tsx)

---

<a id="components-aws-vista-funciones-top-s3-buckets-table-s3versioningcolumns-tsx"></a>
## `components/aws/vista-funciones/top-s3-buckets/table/S3VersioningColumns.tsx`

**Módulo (cliente)**

Exporta:

- función `getS3VersioningColumns` `(): DynamicColumn<S3VersioningRow>[]`
- función `getS3VersioningChangesColumns` `(): DynamicColumn<S3VersioningChangeRow>[]`

Internos:

- función `statusClass` `(value: string | null): string`
- componente `StatusBadge` `({ value, label }: { value: string | null, label: string })`

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`topS3BucketsInterfaces.ts`](../../tipos.md#interfaces-vista-top-s3-buckets-tops3bucketsinterfaces-ts)
- Usado por: [`S3VersioningTableComponent.tsx`](#components-aws-vista-funciones-top-s3-buckets-table-s3versioningtablecomponent-tsx)

---

<a id="components-aws-vista-funciones-top-s3-buckets-table-s3versioningtablecomponent-tsx"></a>
## `components/aws/vista-funciones/top-s3-buckets/table/S3VersioningTableComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `S3VersioningTableComponent` `({ data }: S3VersioningTableComponentProps)`

Interfaz `S3VersioningTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `S3VersioningItem[]` | no | — |

Internos:

- constante `fmtSync`
- función `formatSyncTime` `(value: string): string`
- función `statusLabel` `(value: string | null): string`
- componente `TableLegend` `()`

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`select.tsx`](../ui.md#components-ui-select-tsx), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`topS3BucketsInterfaces.ts`](../../tipos.md#interfaces-vista-top-s3-buckets-tops3bucketsinterfaces-ts), [`S3VersioningColumns.tsx`](#components-aws-vista-funciones-top-s3-buckets-table-s3versioningcolumns-tsx)
- Usado por: [`TopS3BucketsComponent.tsx`](#components-aws-vista-funciones-top-s3-buckets-tops3bucketscomponent-tsx)

---

<a id="components-aws-vista-funciones-unused-ebs-mainviewunusedebscomponent-tsx"></a>
## `components/aws/vista-funciones/unused-ebs/MainViewUnusedEbsComponent.tsx`

**Componente**

Exporta:

- componente `MainViewUnusedEbsComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`UnusedEbsComponent.tsx`](#components-aws-vista-funciones-unused-ebs-unusedebscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-ebs-no-utilizados-page-tsx)

---

<a id="components-aws-vista-funciones-unused-ebs-unusedebscomponent-tsx"></a>
## `components/aws/vista-funciones/unused-ebs/UnusedEbsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedEbsComponent` `({ startDate, endDate, instance, region }: UnusedEbsComponentProps)` — Volúmenes EBS no utilizados: adapta los filtros de la vista al contrato canónico (/api/aws/unused/ebs/*).

Interfaz `UnusedEbsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `instance` | `string` | no | — |
| `region` | `string` | no | — |

- Usa: [`UnusedView.tsx`](../shared.md#components-shared-unused-unusedview-tsx), [`unusedConfigs.ts`](../shared.md#components-shared-unused-unusedconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewUnusedEbsComponent.tsx`](#components-aws-vista-funciones-unused-ebs-mainviewunusedebscomponent-tsx)

---

<a id="components-aws-vista-funciones-unused-ebs-table-unusedebscolumns-tsx"></a>
## `components/aws/vista-funciones/unused-ebs/table/UnusedEbsColumns.tsx`

**Módulo (cliente)**

Exporta:

- interfaz `FlattenedEbsRow`
- función `getUnusedEbsColumns` `(totalGlobalCost: number): DynamicColumn<FlattenedEbsRow>[]`

Interfaz `FlattenedEbsRow` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sort_idle_time` | `number` | no | — |
| `sort_ops` | `number` | no | — |
| `sort_bytes` | `number` | no | — |
| `sort_burst_balance` | `number` | no | — |
| `sort_queue_length` | `number` | no | — |
| `sort_billing` | `number` | no | — |

Internos:

- función `combineMetrics` `(metrics: UnusedEbsTableDataMetric[] | undefined, keys: string[], nameLabel: string): UnusedEbsTableDataMetric | undefi…`
- componente `SmartMetricCell` `({ metric, unit }: { metric?: UnusedEbsTableDataMetric, unit: string })`
- componente `DetailsCell` `({ row }: { row: UnusedEbsTableData })`
- componente `GetParameters` `()`

- Hooks: `useSearchParams`
- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts), [`HistoryModal.tsx`](../general_gcp.md#components-general-gcp-modal-historymodal-tsx), [`filters.ts`](../../lib.md#lib-filters-ts)

---

<a id="components-aws-vista-funciones-unused-ec2-mainviewunusedautoscalingcomponent-tsx"></a>
## `components/aws/vista-funciones/unused-ec2/MainViewUnusedAutoscalingComponent.tsx`

**Componente**

Exporta:

- componente `MainViewUnusedAutoscalingComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`UnusedEc2Component.tsx`](#components-aws-vista-funciones-unused-ec2-unusedec2component-tsx), [`UnusedAutoscalingComponent.tsx`](#components-aws-vista-funciones-unused-ec2-unusedautoscalingcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-ec2-no-utilizados-autoscaling-page-tsx)

---

<a id="components-aws-vista-funciones-unused-ec2-mainviewunusedec2component-tsx"></a>
## `components/aws/vista-funciones/unused-ec2/MainViewUnusedEc2Component.tsx`

**Componente**

Exporta:

- componente `MainViewUnusedEc2Component` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`UnusedEc2Component.tsx`](#components-aws-vista-funciones-unused-ec2-unusedec2component-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-ec2-no-utilizados-page-tsx)

---

<a id="components-aws-vista-funciones-unused-ec2-mainviewunusedekscomponent-tsx"></a>
## `components/aws/vista-funciones/unused-ec2/MainViewUnusedEksComponent.tsx`

**Componente**

Exporta:

- componente `MainViewUnusedEksComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`UnusedEksComponent.tsx`](#components-aws-vista-funciones-unused-ec2-unusedekscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-ec2-no-utilizados-eks-page-tsx)

---

<a id="components-aws-vista-funciones-unused-ec2-unusedautoscalingcomponent-tsx"></a>
## `components/aws/vista-funciones/unused-ec2/UnusedAutoscalingComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedAutoscalingComponent` `({ startDate, endDate, instance, region }: UnusedAutoscalingComponentProps)` — Instancias infrautilizadas de Auto Scaling Groups: adapta los filtros de la vista al contrato canónico (/api/aws/unused/asg/*).

Interfaz `UnusedAutoscalingComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `instance` | `string` | no | — |
| `region` | `string` | no | — |

- Usa: [`UnusedView.tsx`](../shared.md#components-shared-unused-unusedview-tsx), [`unusedConfigs.ts`](../shared.md#components-shared-unused-unusedconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewUnusedAutoscalingComponent.tsx`](#components-aws-vista-funciones-unused-ec2-mainviewunusedautoscalingcomponent-tsx)

---

<a id="components-aws-vista-funciones-unused-ec2-unusedec2component-tsx"></a>
## `components/aws/vista-funciones/unused-ec2/UnusedEc2Component.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedEc2Component` `({ startDate, endDate, instance, region }: UnusedEc2ComponentProps)` — Instancias EC2 infrautilizadas: adapta los filtros de la vista al contrato canónico (/api/aws/unused/ec2/*).

Interfaz `UnusedEc2ComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `instance` | `string` | no | — |
| `region` | `string` | no | — |

- Usa: [`UnusedView.tsx`](../shared.md#components-shared-unused-unusedview-tsx), [`unusedConfigs.ts`](../shared.md#components-shared-unused-unusedconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewUnusedAutoscalingComponent.tsx`](#components-aws-vista-funciones-unused-ec2-mainviewunusedautoscalingcomponent-tsx), [`MainViewUnusedEc2Component.tsx`](#components-aws-vista-funciones-unused-ec2-mainviewunusedec2component-tsx)

---

<a id="components-aws-vista-funciones-unused-ec2-unusedekscomponent-tsx"></a>
## `components/aws/vista-funciones/unused-ec2/UnusedEksComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedEksComponent` `({ startDate, endDate, instance, region }: UnusedEksComponentProps)` — Nodos EKS infrautilizados: adapta los filtros de la vista al contrato canónico (/api/aws/unused/eks/*).

Interfaz `UnusedEksComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `instance` | `string` | no | — |
| `region` | `string` | no | — |

- Usa: [`UnusedView.tsx`](../shared.md#components-shared-unused-unusedview-tsx), [`unusedConfigs.ts`](../shared.md#components-shared-unused-unusedconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewUnusedEksComponent.tsx`](#components-aws-vista-funciones-unused-ec2-mainviewunusedekscomponent-tsx)

---

<a id="components-aws-vista-funciones-unused-ec2-table-unusedec2columns-tsx"></a>
## `components/aws/vista-funciones/unused-ec2/table/UnusedEc2Columns.tsx`

**Módulo (cliente)**

Exporta:

- interfaz `FlattenedEc2Row`
- función `getUnusedEc2Columns` `(totalGlobalCost: number): DynamicColumn<FlattenedEc2Row>[]`

Interfaz `FlattenedEc2Row` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `sort_cpu` | `number` | no | — |
| `sort_net_inout` | `number` | no | — |
| `sort_cpu_credit_usage` | `number` | no | — |
| `sort_cpu_credit_balance` | `number` | no | — |
| `sort_status_check_failed` | `number` | no | — |
| `sort_billing` | `number` | no | — |

Internos:

- función `combineMetrics` `(metrics: UnusedEc2TableDataMetric[] | undefined, keys: string[], nameLabel: string): UnusedEc2TableDataMetric | undefi…`
- componente `SmartMetricCell` `({ metric, unit }: { metric?: UnusedEc2TableDataMetric, unit: string })`
- componente `DetailsCell` `({ row }: { row: UnusedEc2TableData })`
- componente `GetParameters` `()`

- Hooks: `useSearchParams`
- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts), [`HistoryModal.tsx`](../general_gcp.md#components-general-gcp-modal-historymodal-tsx), [`filters.ts`](../../lib.md#lib-filters-ts)

---

<a id="components-aws-vista-funciones-unused-elbv2-mainviewunusedelbv2component-tsx"></a>
## `components/aws/vista-funciones/unused-elbv2/MainViewUnusedElbV2Component.tsx`

**Componente**

Exporta:

- componente `MainViewUnusedElbV2Component` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`UnusedNatGatewaysComponent.tsx`](#components-aws-vista-funciones-unused-nat-gateways-unusednatgatewayscomponent-tsx), [`UnusedElbV2Component.tsx`](#components-aws-vista-funciones-unused-elbv2-unusedelbv2component-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-elbv2-no-utilizados-page-tsx)

---

<a id="components-aws-vista-funciones-unused-elbv2-unusedelbv2component-tsx"></a>
## `components/aws/vista-funciones/unused-elbv2/UnusedElbV2Component.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedElbV2Component` `({ startDate, endDate, region, unusedElbV2 }: UnusedElbV2ComponentProps)` — Load Balancers v2 sin uso: adapta los filtros de la vista al contrato canónico (/api/aws/unused/load-balancers/*).

Interfaz `UnusedElbV2ComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `region` | `string` | no | — |
| `unusedElbV2` | `string` | no | — |

- Usa: [`UnusedView.tsx`](../shared.md#components-shared-unused-unusedview-tsx), [`unusedConfigs.ts`](../shared.md#components-shared-unused-unusedconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewUnusedElbV2Component.tsx`](#components-aws-vista-funciones-unused-elbv2-mainviewunusedelbv2component-tsx)

---

<a id="components-aws-vista-funciones-unused-elbv2-info-unusedelbv2insightmodal-tsx"></a>
## `components/aws/vista-funciones/unused-elbv2/info/UnusedElbV2InsightModal.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedElbV2InsightModal` `({ elbData, asociatedResources, globalMetrics, isLoading, isOpen, onClose, }: UnusedElbV2InsightModalProps)`

Interfaz `UnusedElbV2InsightModalProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `elbData` | `UnusedElbV2Details` | no | — |
| `asociatedResources` | `AsociatedElbV2Resources[] \| undefined` | no | — |
| `globalMetrics` | `GlobalMetricsSummary` | sí | — |
| `isLoading` | `boolean` | no | — |
| `isOpen` | `boolean` | no | — |
| `onClose` | `() => void` | no | — |

Internos:

- componente `MetricProgressRow` `({ label, value, globalAvg, unit }: { label: string, value: number, globalAvg: number, unit?: string })` — Componente para filas de progreso con tag nativo <progress>

- Hooks: `useSearchParams`
- Usa: [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx), [`separator.tsx`](../ui.md#components-ui-separator-tsx), [`tabs.tsx`](../ui.md#components-ui-tabs-tsx), [`table.tsx`](../ui.md#components-ui-table-tsx), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx), [`UnusedElbV2Columns.tsx`](#components-aws-vista-funciones-unused-elbv2-table-unusedelbv2columns-tsx), [`metricUtils.ts`](../../lib.md#lib-metricutils-ts), [`filters.ts`](../../lib.md#lib-filters-ts)
- Usado por: [`UnusedElbV2Columns.tsx`](#components-aws-vista-funciones-unused-elbv2-table-unusedelbv2columns-tsx)

Notas de implementación:

- _MetricProgressRow_: Ajuste de escala: si el valor local es mayor al promedio, el máximo de la barra es el valor local (para que se llene al 100%) Si es menor, el máximo es el promedio (para mostrar qué fracción del promedio representa)
- JSX — TAB 1: RESUMEN ACTUAL
- JSX — Columna Izquierda: Configuración (Sin cambios)
- JSX — Columna Derecha: Métricas con Barras
- CORRECCIÓN: avg_new_flows
- JSX — (Resto del contenido del modal igual que antes)
- JSX — Target Groups, Tablas Históricas...
- JSX — TABS DE HISTORIAL (Mantienen su lógica interna, solo usan el formatMetric ya añadido)
- JSX — Historial de Salud
- JSX — Historial de Configuración

---

<a id="components-aws-vista-funciones-unused-elbv2-table-unusedelbv2columns-tsx"></a>
## `components/aws/vista-funciones/unused-elbv2/table/UnusedElbV2Columns.tsx`

**Módulo (cliente)**

Exporta:

- interfaz `GlobalMetricsSummary`
- función `getUnusedElbV2Columns` `(dateFrom: string, dateTo: string, globalMetrics?: GlobalMetricsSummary): DynamicColumn<UnusedElbV2Details>[]`

Interfaz `GlobalMetricsSummary` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `avg_requests` | `number` | no | — |
| `avg_active_connections` | `number` | no | — |
| `avg_new_flows` | `number` | no | — |
| `avg_active_flows` | `number` | no | — |
| `avg_consumed_lcus` | `number` | no | — |

Internos:

- componente `DetailsCell` `({ elb, dateParams, globalMetrics }: { elb: UnusedElbV2Details, dateParams: { from: string, to: string }, globalMetrics…`
- componente `GetParameters` `()`
- componente `MetricCell` `({ value, globalValue, label, unit }: { value: number, globalValue: number, label: string, unit?: string })`

- API: `/api/aws/bridge/loadbalancersv2/get_associated_resources`
- Hooks: `useSWR`, `useSearchParams`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`UnusedElbV2InsightModal.tsx`](#components-aws-vista-funciones-unused-elbv2-info-unusedelbv2insightmodal-tsx), [`metricUtils.ts`](../../lib.md#lib-metricutils-ts), [`filters.ts`](../../lib.md#lib-filters-ts)
- Usado por: [`UnusedElbV2InsightModal.tsx`](#components-aws-vista-funciones-unused-elbv2-info-unusedelbv2insightmodal-tsx)

Notas de implementación:

- _MetricCell_: Si el valor local es mayor al global, la barra se llena al 100% (usando value como max) Si es menor, se usa globalValue como max.
- _MetricCell_: Si supera el promedio, pintamos naranja, si no, azul.
- _getUnusedElbV2Columns_: USAMOS EL PROMEDIO DEL RANGO (metrics_summary en raíz), NO EL HISTÓRICO

---

<a id="components-aws-vista-funciones-unused-nat-gateways-mainviewunusednatgatewayscomponent-tsx"></a>
## `components/aws/vista-funciones/unused-nat-gateways/MainViewUnusedNatGatewaysComponent.tsx`

**Componente**

Exporta:

- componente `MainViewUnusedNatGatewaysComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`UnusedNatGatewaysComponent.tsx`](#components-aws-vista-funciones-unused-nat-gateways-unusednatgatewayscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-nat-gateways-no-utilizados-page-tsx)

---

<a id="components-aws-vista-funciones-unused-nat-gateways-unusednatgatewayscomponent-tsx"></a>
## `components/aws/vista-funciones/unused-nat-gateways/UnusedNatGatewaysComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedNatGatewaysComponent` `({ startDate, endDate, region, unusedNatGateway }: UnusedNatGatewaysComponentProps)` — NAT Gateways sin uso: adapta los filtros de la vista al contrato canónico (/api/aws/unused/nat-gateways/*).

Interfaz `UnusedNatGatewaysComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `region` | `string` | no | — |
| `unusedNatGateway` | `string` | no | — |

- Usa: [`UnusedView.tsx`](../shared.md#components-shared-unused-unusedview-tsx), [`unusedConfigs.ts`](../shared.md#components-shared-unused-unusedconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewUnusedElbV2Component.tsx`](#components-aws-vista-funciones-unused-elbv2-mainviewunusedelbv2component-tsx), [`MainViewUnusedNatGatewaysComponent.tsx`](#components-aws-vista-funciones-unused-nat-gateways-mainviewunusednatgatewayscomponent-tsx), [`MainViewUnusedRoute53Component.tsx`](#components-aws-vista-funciones-unused-r53-mainviewunusedroute53component-tsx)

---

<a id="components-aws-vista-funciones-unused-nat-gateways-info-unusednatgatewaysinsightmodal-tsx"></a>
## `components/aws/vista-funciones/unused-nat-gateways/info/UnusedNatGatewaysInsightModal.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedNatGatewaysInsightModal` `({ natGw, asociatedResources, isLoading, isOpen, onClose }: UnusedNatGatewaysInsightModalProps)`

Interfaz `UnusedNatGatewaysInsightModalProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `natGw` | `UnusedNatGateways \| null` | no | — |
| `asociatedResources` | `AsociatedResourcesNatGw \| null` | no | — |
| `isLoading` | `boolean` | no | — |
| `isOpen` | `boolean` | no | — |
| `onClose` | `() => void` | no | — |

- Hooks: `useSearchParams`
- Usa: [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`tabs.tsx`](../ui.md#components-ui-tabs-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts), [`filters.ts`](../../lib.md#lib-filters-ts)
- Usado por: [`UnusedNatGatewaysColumns.tsx`](#components-aws-vista-funciones-unused-nat-gateways-table-unusednatgatewayscolumns-tsx)

---

<a id="components-aws-vista-funciones-unused-nat-gateways-table-unusednatgatewayscolumns-tsx"></a>
## `components/aws/vista-funciones/unused-nat-gateways/table/UnusedNatGatewaysColumns.tsx`

**Módulo (cliente)**

Exporta:

- interfaz `GlobalNatStats` — NUEVA INTERFAZ EXPORTADA
- función `getUnusedNatGwColumns` `(dateFrom: string, dateTo: string, globalStats: GlobalNatStats): DynamicColumn<UnusedNatGateways>[]` — FUNCIÓN ACTUALIZADA CON globalStats

Interfaz `GlobalNatStats` (exportada) — NUEVA INTERFAZ EXPORTADA:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `avgGlobalConnections` | `number` | no | — |
| `totalGlobalBytes` | `number` | no | — |

Internos:

- componente `DetailsCell` `({ natGw, dateParams }: { natGw: UnusedNatGateways, dateParams: { from: string, to: string } })`
- componente `GetParameters` `()`

- API: `/api/aws/bridge/nat_gateways/get_associated_resources`
- Hooks: `useSWR`, `useSearchParams`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`UnusedNatGatewaysInsightModal.tsx`](#components-aws-vista-funciones-unused-nat-gateways-info-unusednatgatewaysinsightmodal-tsx), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts), [`filters.ts`](../../lib.md#lib-filters-ts)

Notas de implementación:

- _getUnusedNatGwColumns_: `globalStats: GlobalNatStats` — Recibimos las estadísticas globales aquí
- _getUnusedNatGwColumns_: NUEVA COLUMNA: Conexiones
- _getUnusedNatGwColumns_: Calculamos el porcentaje relativo al promedio
- _getUnusedNatGwColumns_: NUEVA COLUMNA: Tráfico
- _getUnusedNatGwColumns_: Calculamos cuánto aporta este recurso al total global

---

<a id="components-aws-vista-funciones-unused-r53-mainviewunusedroute53component-tsx"></a>
## `components/aws/vista-funciones/unused-r53/MainViewUnusedRoute53Component.tsx`

**Componente**

Exporta:

- componente `MainViewUnusedRoute53Component` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`UnusedNatGatewaysComponent.tsx`](#components-aws-vista-funciones-unused-nat-gateways-unusednatgatewayscomponent-tsx), [`UnusedRoute53Component.tsx`](#components-aws-vista-funciones-unused-r53-unusedroute53component-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-routes53-no-utilizados-page-tsx)

---

<a id="components-aws-vista-funciones-unused-r53-unusedroute53component-tsx"></a>
## `components/aws/vista-funciones/unused-r53/UnusedRoute53Component.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedRoute53Component` `({ startDate, endDate, region, unusedR53 }: UnusedRoute53ComponentProps)` — Hosted zones de Route 53 sin uso: adapta los filtros de la vista al contrato canónico (/api/aws/unused/route53/*).

Interfaz `UnusedRoute53ComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `region` | `string` | no | — |
| `unusedR53` | `string` | no | — |

- Usa: [`UnusedView.tsx`](../shared.md#components-shared-unused-unusedview-tsx), [`unusedConfigs.ts`](../shared.md#components-shared-unused-unusedconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewUnusedRoute53Component.tsx`](#components-aws-vista-funciones-unused-r53-mainviewunusedroute53component-tsx)

---

<a id="components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-mainviewvariaciontendenciausoderecursoscomponent-tsx"></a>
## `components/aws/vista-funciones/variacion-tendencia-uso-de-recursos/MainViewVariacionTendenciaUsoDeRecursosComponent.tsx`

**Componente**

Exporta:

- componente `ViewVariacionTendenciaUsoDeRecursos` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`VariacionTendenciaUsoDeRecursosComponent.tsx`](#components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-variaciontendenciausoderecursoscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-variacion-tendencia-uso-de-recursos-page-tsx)

Notas de implementación:

- JSX — Header

---

<a id="components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-variaciontendenciausoderecursoscomponent-tsx"></a>
## `components/aws/vista-funciones/variacion-tendencia-uso-de-recursos/VariacionTendenciaUsoDeRecursosComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `VariacionTendenciaUsoDeRecursosComponent` `({ startDate, endDate, region, variationService, variationMetric, variationResource, year, month, }: VariacionTendenciaUsoDeRecursosProps)`

Interfaz `VariacionTendenciaUsoDeRecursosProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | sí | — |
| `variationService` | `string` | sí | — |
| `variationMetric` | `string` | sí | — |
| `variationResource` | `string` | sí | — |
| `year` | `number` | no | — |
| `month` | `number` | no | — |

- API: `/api/aws/bridge/recursos/variation_resources_v2/{…}`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`variacionTendenciaUsoDeRecursosViewInterface.ts`](../../tipos.md#interfaces-vista-variacion-tendencia-uso-de-recursos-variaciontendenciausoderecursosviewinterface-ts), [`TrendLineChartv2.tsx`](#components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-grafico-trendlinechartv2-tsx), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts), [`VariacionTendenciaUsoDeRecursosCardsComponent.tsx`](#components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-info-variaciontendenciausoderecursoscardscomponent-tsx)
- Usado por: [`MainViewVariacionTendenciaUsoDeRecursosComponent.tsx`](#components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-mainviewvariaciontendenciausoderecursoscomponent-tsx)

---

<a id="components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-grafico-trendlinechartv2-tsx"></a>
## `components/aws/vista-funciones/variacion-tendencia-uso-de-recursos/grafico/TrendLineChartv2.tsx`

**Componente (cliente)**

Exporta:

- componente `DualSeriesChart` `({ currentPeriodData, previousPeriodData, currentPeriodLabel = "Período Actual", previousPeriodLabel = "Período Anterior", title = "Comparación de Métricas", y…`

Interfaz `DualSeriesChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `currentPeriodData` | `MetricPoint[]` | no | — |
| `previousPeriodData` | `MetricPoint[]` | no | — |
| `currentPeriodLabel` | `string` | sí | — |
| `previousPeriodLabel` | `string` | sí | — |
| `title` | `string` | sí | — |
| `yAxisLabel` | `string` | sí | — |
| `unit` | `string` | sí | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`variacionTendenciaUsoDeRecursosViewInterface.ts`](../../tipos.md#interfaces-vista-variacion-tendencia-uso-de-recursos-variaciontendenciausoderecursosviewinterface-ts), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`VariacionTendenciaUsoDeRecursosComponent.tsx`](#components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-variaciontendenciausoderecursoscomponent-tsx)

Notas de implementación:

- Agrupar por timestamp
- Convertir a array y ordenar
- Normalizar timestamps para superponer (usar solo día/hora, ignorar mes/año)
- Para el displayTime, usar la fecha/hora original del timestamp (UTC)
- Para normalizar, usar UTC para mantener consistencia
- lineStyle: { width: 2, color: '#00a53d' }, itemStyle: { color: '#22c55e' }

---

<a id="components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-info-variaciontendenciausoderecursoscardscomponent-tsx"></a>
## `components/aws/vista-funciones/variacion-tendencia-uso-de-recursos/info/VariacionTendenciaUsoDeRecursosCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `VariacionTendenciaUsoDeRecursosCardsComponent` `({ prev_range, unit, chartyAxisLabel, metric, actual_range, variation_percent, }: VariacionTendenciaUsoDeRecursosCardsComponentProps)`

Interfaz `VariacionTendenciaUsoDeRecursosCardsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `prev_range` | `RangeBlock` | sí | — |
| `unit` | `'créditos' \| '%' \| 'GB' \| 'Bytes' \| 'Objetos' \| 'segundos' \| 'Ops E/S…` | no | — |
| `chartyAxisLabel` | `string` | sí | — |
| `metric` | `string` | sí | — |
| `actual_range` | `RangeBlock` | sí | — |
| `variation_percent` | `number` | sí | — |

Internos:

- función `isFiniteNumber` `(v: unknown): v is number`
- función `formatNumber` `(v: unknown, digits = 2): string`
- función `isBytesMetric` `(metric?: string): boolean`
- función `getMetricDisplayValue` `(range?: RangeBlock, metric?: string): string`
- función `withUnits` `(value: string, unit: VariacionTendenciaUsoDeRecursosCardsComponentProps['unit'], axisLabel?: string): string`

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`variacionTendenciaUsoDeRecursosViewInterface.ts`](../../tipos.md#interfaces-vista-variacion-tendencia-uso-de-recursos-variaciontendenciausoderecursosviewinterface-ts), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts)
- Usado por: [`VariacionTendenciaUsoDeRecursosComponent.tsx`](#components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-variaciontendenciausoderecursoscomponent-tsx)

