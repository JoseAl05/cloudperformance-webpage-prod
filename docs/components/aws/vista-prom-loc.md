# Componentes `components/aws/vista-prom-loc/`

[← Índice](../../README.md)

Promedio de uso por región de EC2 y RDS.

Archivos:

- [`components/aws/vista-prom-loc/avg-uso-loc-inst-ec2/AVGUsoLocInstEC2ChartComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-ec2-avgusolocinstec2chartcomponent-tsx)
- [`components/aws/vista-prom-loc/avg-uso-loc-inst-ec2/MainViewInstanciasAVGUsoLocInstEC2Component.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-ec2-mainviewinstanciasavgusolocinstec2component-tsx)
- [`components/aws/vista-prom-loc/avg-uso-loc-inst-ec2/graficos/AVGUsoLocInstEC2ViewUsoPorRegionComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-ec2-graficos-avgusolocinstec2viewusoporregioncomponent-tsx)
- [`components/aws/vista-prom-loc/avg-uso-loc-inst-rds-mariadb/AVGUsoLocInstRdsMariaDBChartComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mariadb-avgusolocinstrdsmariadbchartcomponent-tsx)
- [`components/aws/vista-prom-loc/avg-uso-loc-inst-rds-mariadb/MainViewInstanciasAVGUsoLocInstRdsMariaDBComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mariadb-mainviewinstanciasavgusolocinstrdsmariadbcomponent-tsx)
- [`components/aws/vista-prom-loc/avg-uso-loc-inst-rds-mariadb/graficos/AVGUsoLocInstRdsMariaDBViewUsoPorRegionComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mariadb-graficos-avgusolocinstrdsmariadbviewusoporregioncomponent-tsx)
- [`components/aws/vista-prom-loc/avg-uso-loc-inst-rds-mysql/AVGUsoLocInstRdsMySQLChartComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mysql-avgusolocinstrdsmysqlchartcomponent-tsx)
- [`components/aws/vista-prom-loc/avg-uso-loc-inst-rds-mysql/MainViewInstanciasAVGUsoLocInstRdsMySQLComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mysql-mainviewinstanciasavgusolocinstrdsmysqlcomponent-tsx)
- [`components/aws/vista-prom-loc/avg-uso-loc-inst-rds-mysql/graficos/AVGUsoLocInstRdsMySQLViewUsoPorRegionComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mysql-graficos-avgusolocinstrdsmysqlviewusoporregioncomponent-tsx)
- [`components/aws/vista-prom-loc/avg-uso-loc-inst-rds-oracle/AVGUsoLocInstRdsOracleChartComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-oracle-avgusolocinstrdsoraclechartcomponent-tsx)
- [`components/aws/vista-prom-loc/avg-uso-loc-inst-rds-oracle/MainViewInstanciasAVGUsoLocInstRdsOracleComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-oracle-mainviewinstanciasavgusolocinstrdsoraclecomponent-tsx)
- [`components/aws/vista-prom-loc/avg-uso-loc-inst-rds-oracle/graficos/AVGUsoLocInstRdsOracleViewUsoPorRegionComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-oracle-graficos-avgusolocinstrdsoracleviewusoporregioncomponent-tsx)
- [`components/aws/vista-prom-loc/avg-uso-loc-inst-rds-pg/AVGUsoLocInstRdsPgChartComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-pg-avgusolocinstrdspgchartcomponent-tsx)
- [`components/aws/vista-prom-loc/avg-uso-loc-inst-rds-pg/MainViewInstanciasAVGUsoLocInstRdsPgComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-pg-mainviewinstanciasavgusolocinstrdspgcomponent-tsx)
- [`components/aws/vista-prom-loc/avg-uso-loc-inst-rds-pg/graficos/AVGUsoLocInstRdsPgViewUsoPorRegionComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-pg-graficos-avgusolocinstrdspgviewusoporregioncomponent-tsx)
- [`components/aws/vista-prom-loc/avg-uso-loc-inst-rds-sqlserver/AVGUsoLocInstRdsSQLServerChartComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-sqlserver-avgusolocinstrdssqlserverchartcomponent-tsx)
- [`components/aws/vista-prom-loc/avg-uso-loc-inst-rds-sqlserver/MainViewInstanciasAVGUsoLocInstRdsSQLServerComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-sqlserver-mainviewinstanciasavgusolocinstrdssqlservercomponent-tsx)
- [`components/aws/vista-prom-loc/avg-uso-loc-inst-rds-sqlserver/graficos/AVGUsoLocInstRdsSQLServerViewUsoPorRegionComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-sqlserver-graficos-avgusolocinstrdssqlserverviewusoporregioncomponent-tsx)

<a id="components-aws-vista-prom-loc-avg-uso-loc-inst-ec2-avgusolocinstec2chartcomponent-tsx"></a>
## `components/aws/vista-prom-loc/avg-uso-loc-inst-ec2/AVGUsoLocInstEC2ChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AVGUsoLocInstEC2ChartComponent` `({ startDate, endDate, instance, region, metrics }: Props)`

Interfaz `Props`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `instance` | `string` | no | — |
| `region` | `string` | no | — |
| `selectedKey` | `string \| null` | sí | — |
| `selectedValue` | `string \| null` | sí | — |
| `services` | `string` | sí | — |
| `metrics` | `string` | sí | — |

Interfaz `MetricAverageGeneral` — Interfaces para respuesta general (/promedio-loc-ec2):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_groups` | `string[]` | no | — |
| `metric_label` | `string` | no | — |
| `metric_label_original` | `string` | no | — |
| `average_value` | `number` | no | — |
| `min_value` | `number` | no | — |
| `max_value` | `number` | no | — |
| `metric_count` | `number` | no | — |
| `resource_region` | `string` | no | — |

Interfaz `ApiResponseGeneral`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_groups_requested` | `string[]` | no | — |
| `metric_averages` | `MetricAverageGeneral[]` | no | — |
| `instances_by_sync_time` | `unknown[]` | no | — |

Interfaz `MetricAverageDetail` — Interfaces para respuesta de detalle (/promedio-loc-ec2-detalle):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_group` | `string` | sí | — |
| `metric_groups` | `string[]` | sí | — |
| `metric_label` | `string` | no | — |
| `metric_label_original` | `string` | no | — |
| `average_value` | `number` | no | — |
| `min_value` | `number` | no | — |
| `max_value` | `number` | no | — |
| `metric_count` | `number` | no | — |
| `resource_region` | `string` | sí | — |

Interfaz `InstanceInfo`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instance_id` | `string` | no | — |
| `instance_type` | `string \| null` | no | — |
| `resource_region` | `string` | no | — |
| `is_from_asg` | `boolean` | no | — |
| `sync_time_range` | `{ from: string; to: string; }` | no | — |

Interfaz `ApiResponseDetail`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instance_info` | `InstanceInfo` | no | — |
| `metric_averages` | `MetricAverageDetail[]` | no | — |

Interfaz `MetricValues`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `avg` | `number` | no | — |
| `min` | `number` | no | — |
| `max` | `number` | no | — |
| `count` | `number` | no | — |

Interfaz `ProcessedHeatmapData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `region` | `string` | no | — |
| `metrics` | `{ [key: string]: MetricValues }` | no | — |

- Tipo interno `ApiResponse` = `ApiResponseGeneral | ApiResponseDetail`
- API: `/api/aws/bridge`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`AVGUsoLocInstEC2ViewUsoPorRegionComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-ec2-graficos-avgusolocinstec2viewusoporregioncomponent-tsx), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx)
- Usado por: [`MainViewInstanciasAVGUsoLocInstEC2Component.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-ec2-mainviewinstanciasavgusolocinstec2component-tsx)

Notas de implementación:

- Construir la URL de la API con lógica híbrida
- Formatear fechas exactamente como en tu ejemplo: 2025-08-01T00:00:00
- `return date.toISOString().split('.')[0];` — Elimina milisegundos y Z
- Los grupos de métricas decodificados y separados por coma
- LÓGICA HÍBRIDA: cambiar endpoint según instancia seleccionada
- Endpoint para instancia específica
- Endpoint general (comportamiento original)
- Solo hacer la petición si tenemos los parámetros mínimos
- Procesar datos para el heatmap con lógica híbrida
- Detectar tipo de respuesta basado en la estructura
- RESPUESTA DE DETALLE - instancia específica
- RESPUESTA GENERAL - todas las instancias (lógica original)
- Agrupar métricas por región real (solo regiones con datos)
- Solo devolver regiones que realmente tienen datos
- Obtener todas las métricas únicas
- Estados de carga y error
- Mensaje cuando no hay instancia seleccionada (opcional)

---

<a id="components-aws-vista-prom-loc-avg-uso-loc-inst-ec2-mainviewinstanciasavgusolocinstec2component-tsx"></a>
## `components/aws/vista-prom-loc/avg-uso-loc-inst-ec2/MainViewInstanciasAVGUsoLocInstEC2Component.tsx`

**Componente**

Exporta:

- componente `MainViewInstanciasAVGUsoLocInstEC2Component` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`AVGUsoLocInstEC2ChartComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-ec2-avgusolocinstec2chartcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-avg-uso-loc-inst-ec2-page-tsx)

---

<a id="components-aws-vista-prom-loc-avg-uso-loc-inst-ec2-graficos-avgusolocinstec2viewusoporregioncomponent-tsx"></a>
## `components/aws/vista-prom-loc/avg-uso-loc-inst-ec2/graficos/AVGUsoLocInstEC2ViewUsoPorRegionComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AVGUsoLocInstEC2ViewUsoPorRegionComponent` `({ data, allMetrics, isLoading, error, }: Props)`

- Tipo interno `CellDatum` = `{ avg_value: number; min_value?: number; max_value?: number; count?: number; resources?: string[]; resource_count?: num…`
- Tipo interno `MetricValues` = `{ avg: number; min: number; max: number; count: number; }`
- Tipo interno `ProcessedHeatmapData` = `{ region: string; metrics: Record<string, MetricValues>; }`
- Tipo interno `Props` = `{ data: ProcessedHeatmapData[]; allMetrics: string[]; isLoading: boolean; error: unknown; }`
Internos:

- función `byAlpha` `(a: string, b: string)`
- función `formatBytes` `(v: number)`
- función `formatMetricValue` `(metric: string, value: number)`
- función `isUnused` `(v: unknown)`
- componente `MetricCellDialog` `({ region, metric, datum, }: { region: string; metric: string; datum: CellDatum; })`

- Usa: [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx), [`utils.ts`](../../lib.md#lib-utils-ts), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts)
- Usado por: [`AVGUsoLocInstEC2ChartComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-ec2-avgusolocinstec2chartcomponent-tsx)

---

<a id="components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mariadb-avgusolocinstrdsmariadbchartcomponent-tsx"></a>
## `components/aws/vista-prom-loc/avg-uso-loc-inst-rds-mariadb/AVGUsoLocInstRdsMariaDBChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AVGUsoLocInstRdsMariaDBChartComponent` `({ startDate, endDate, instance, region, metrics }: Props)`

Interfaz `Props`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `instance` | `string` | no | — |
| `region` | `string` | no | — |
| `selectedKey` | `string \| null` | sí | — |
| `selectedValue` | `string \| null` | sí | — |
| `services` | `string` | sí | — |
| `metrics` | `string` | sí | — |

Interfaz `MetricAverageGeneral` — Interfaces para respuesta general (/promedio-loc-rds-mariadb):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_groups` | `string[]` | no | — |
| `metric_label` | `string` | no | — |
| `metric_label_original` | `string` | no | — |
| `average_value` | `number` | no | — |
| `min_value` | `number` | no | — |
| `max_value` | `number` | no | — |
| `metric_count` | `number` | no | — |
| `resource_region` | `string` | no | — |

Interfaz `ApiResponseGeneral`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_groups_requested` | `string[]` | no | — |
| `metric_averages` | `MetricAverageGeneral[]` | no | — |
| `instances_by_sync_time` | `unknown[]` | no | — |

Interfaz `MetricAverageDetail` — Interfaces para respuesta de detalle (/promedio-loc-rds-mariadb-detalle):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_group` | `string` | sí | Retrocompatibilidad Nueva estructura |
| `metric_groups` | `string[]` | sí | — |
| `metric_label` | `string` | no | — |
| `metric_label_original` | `string` | no | — |
| `average_value` | `number` | no | — |
| `min_value` | `number` | no | — |
| `max_value` | `number` | no | — |
| `metric_count` | `number` | no | — |
| `resource_region` | `string` | sí | Nuevo campo |

Interfaz `ResourceInfo`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource` | `string` | no | — |
| `db_instance_class` | `string \| null` | no | — |
| `resource_region` | `string` | no | — |
| `allocated_storage_formatted` | `string` | no | — |
| `engine_plus_version` | `string` | no | — |
| `sync_time_range` | `{ from: string; to: string; }` | no | — |

Interfaz `ApiResponseDetail`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource_info` | `ResourceInfo` | no | — |
| `metric_averages` | `MetricAverageDetail[]` | no | — |

Interfaz `MetricValues`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `avg` | `number` | no | — |
| `min` | `number` | no | — |
| `max` | `number` | no | — |
| `count` | `number` | no | — |

Interfaz `ProcessedHeatmapData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `region` | `string` | no | — |
| `metrics` | `{ [key: string]: MetricValues }` | no | — |

- Tipo interno `ApiResponse` = `ApiResponseGeneral | ApiResponseDetail`
- API: `/api/aws/bridge`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`AVGUsoLocInstRdsMariaDBViewUsoPorRegionComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mariadb-graficos-avgusolocinstrdsmariadbviewusoporregioncomponent-tsx), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx)
- Usado por: [`MainViewInstanciasAVGUsoLocInstRdsMariaDBComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mariadb-mainviewinstanciasavgusolocinstrdsmariadbcomponent-tsx)

Notas de implementación:

- Construir la URL de la API con lógica híbrida
- Formatear fechas: 2025-08-01T00:00:00
- Los grupos de métricas decodificados y separados por coma
- LÓGICA HÍBRIDA: cambiar endpoint según instancia seleccionada
- Endpoint para instancia específica
- Endpoint general (comportamiento original)
- Solo hacer la petición si tenemos los parámetros mínimos
- Procesar datos para el heatmap con lógica híbrida
- Detectar tipo de respuesta basado en la estructura
- RESPUESTA DE DETALLE - instancia específica
- Usar resource_region del resource_info si existe, sino usar la región del filtro
- RESPUESTA GENERAL - todas las instancias (lógica original)
- Agrupar métricas por región real (solo regiones con datos)
- Solo devolver regiones que realmente tienen datos
- Obtener todas las métricas únicas
- Estados de carga y error

---

<a id="components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mariadb-mainviewinstanciasavgusolocinstrdsmariadbcomponent-tsx"></a>
## `components/aws/vista-prom-loc/avg-uso-loc-inst-rds-mariadb/MainViewInstanciasAVGUsoLocInstRdsMariaDBComponent.tsx`

**Componente**

Exporta:

- componente `MainViewInstanciasAVGUsoLocInstRdsMariaDBComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`AVGUsoLocInstRdsMariaDBChartComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mariadb-avgusolocinstrdsmariadbchartcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-avg-uso-loc-inst-rds-mariadb-page-tsx)

---

<a id="components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mariadb-graficos-avgusolocinstrdsmariadbviewusoporregioncomponent-tsx"></a>
## `components/aws/vista-prom-loc/avg-uso-loc-inst-rds-mariadb/graficos/AVGUsoLocInstRdsMariaDBViewUsoPorRegionComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AVGUsoLocInstRdsMariaDBViewUsoPorRegionComponent` `({ data, allMetrics, isLoading, error, }: Props)`

- Tipo interno `CellDatum` = `{ avg_value: number; min_value?: number; max_value?: number; count?: number; resources?: string[]; resource_count?: num…`
- Tipo interno `MetricValues` = `{ avg: number; min: number; max: number; count: number; }`
- Tipo interno `ProcessedHeatmapData` = `{ region: string; metrics: Record<string, MetricValues>; }`
- Tipo interno `Props` = `{ data: ProcessedHeatmapData[]; allMetrics: string[]; isLoading: boolean; error: unknown; }`
Internos:

- función `byAlpha` `(a: string, b: string)`
- función `formatBytes` `(v: number)`
- función `formatMetricValue` `(metric: string, value: number)`
- función `isUnused` `(v: unknown)`
- componente `MetricCellDialog` `({ region, metric, datum, }: { region: string; metric: string; datum: CellDatum; })`

- Usa: [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx), [`utils.ts`](../../lib.md#lib-utils-ts), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts)
- Usado por: [`AVGUsoLocInstRdsMariaDBChartComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mariadb-avgusolocinstrdsmariadbchartcomponent-tsx)

Notas de implementación:

- Lista de métricas (únicas y ordenadas) igual que en EC2
- Mapa región → (métrica → dato de celda) igual que en EC2

---

<a id="components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mysql-avgusolocinstrdsmysqlchartcomponent-tsx"></a>
## `components/aws/vista-prom-loc/avg-uso-loc-inst-rds-mysql/AVGUsoLocInstRdsMySQLChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AVGUsoLocInstRdsMySQLChartComponent` `({ startDate, endDate, instance, region, metrics }: Props)`

Interfaz `Props`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `instance` | `string` | no | — |
| `region` | `string` | no | — |
| `selectedKey` | `string \| null` | sí | — |
| `selectedValue` | `string \| null` | sí | — |
| `services` | `string` | sí | — |
| `metrics` | `string` | sí | — |

Interfaz `MetricAverageGeneral` — Interfaces para respuesta general (/promedio-loc-rds-mysql):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_groups` | `string[]` | no | — |
| `metric_label` | `string` | no | — |
| `metric_label_original` | `string` | no | — |
| `average_value` | `number` | no | — |
| `min_value` | `number` | no | — |
| `max_value` | `number` | no | — |
| `metric_count` | `number` | no | — |
| `resource_region` | `string` | no | — |

Interfaz `ApiResponseGeneral`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_groups_requested` | `string[]` | no | — |
| `metric_averages` | `MetricAverageGeneral[]` | no | — |
| `instances_by_sync_time` | `unknown[]` | no | — |

Interfaz `MetricAverageDetail` — Interfaces para respuesta de detalle (/promedio-loc-rds-mysql-detalle):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_group` | `string` | sí | Retrocompatibilidad Nueva estructura |
| `metric_groups` | `string[]` | sí | — |
| `metric_label` | `string` | no | — |
| `metric_label_original` | `string` | no | — |
| `average_value` | `number` | no | — |
| `min_value` | `number` | no | — |
| `max_value` | `number` | no | — |
| `metric_count` | `number` | no | — |
| `resource_region` | `string` | sí | Nuevo campo |

Interfaz `ResourceInfo`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource` | `string` | no | — |
| `db_instance_class` | `string \| null` | no | — |
| `resource_region` | `string` | no | — |
| `allocated_storage_formatted` | `string` | no | — |
| `engine_plus_version` | `string` | no | — |
| `sync_time_range` | `{ from: string; to: string; }` | no | — |

Interfaz `ApiResponseDetail`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource_info` | `ResourceInfo` | no | — |
| `metric_averages` | `MetricAverageDetail[]` | no | — |

Interfaz `MetricValues`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `avg` | `number` | no | — |
| `min` | `number` | no | — |
| `max` | `number` | no | — |
| `count` | `number` | no | — |

Interfaz `ProcessedHeatmapData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `region` | `string` | no | — |
| `metrics` | `{ [key: string]: MetricValues }` | no | — |

- Tipo interno `ApiResponse` = `ApiResponseGeneral | ApiResponseDetail`
- API: `/api/aws/bridge`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`AVGUsoLocInstRdsMySQLViewUsoPorRegionComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mysql-graficos-avgusolocinstrdsmysqlviewusoporregioncomponent-tsx), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx)
- Usado por: [`MainViewInstanciasAVGUsoLocInstRdsMySQLComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mysql-mainviewinstanciasavgusolocinstrdsmysqlcomponent-tsx)

Notas de implementación:

- Construir la URL de la API con lógica híbrida
- Formatear fechas: 2025-08-01T00:00:00
- Los grupos de métricas decodificados y separados por coma
- LÓGICA HÍBRIDA: cambiar endpoint según instancia seleccionada
- Endpoint para instancia específica
- Endpoint general (comportamiento original)
- Solo hacer la petición si tenemos los parámetros mínimos
- Procesar datos para el heatmap con lógica híbrida
- Detectar tipo de respuesta basado en la estructura
- RESPUESTA DE DETALLE - instancia específica
- Usar resource_region del resource_info si existe, sino usar la región del filtro
- RESPUESTA GENERAL - todas las instancias (lógica original)
- Agrupar métricas por región real (solo regiones con datos)
- Solo devolver regiones que realmente tienen datos
- Obtener todas las métricas únicas
- Estados de carga y error

---

<a id="components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mysql-mainviewinstanciasavgusolocinstrdsmysqlcomponent-tsx"></a>
## `components/aws/vista-prom-loc/avg-uso-loc-inst-rds-mysql/MainViewInstanciasAVGUsoLocInstRdsMySQLComponent.tsx`

**Componente**

Exporta:

- componente `MainViewInstanciasAVGUsoLocInstRdsMySQLComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`AVGUsoLocInstRdsMySQLChartComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mysql-avgusolocinstrdsmysqlchartcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-avg-uso-loc-inst-rds-mysql-page-tsx)

---

<a id="components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mysql-graficos-avgusolocinstrdsmysqlviewusoporregioncomponent-tsx"></a>
## `components/aws/vista-prom-loc/avg-uso-loc-inst-rds-mysql/graficos/AVGUsoLocInstRdsMySQLViewUsoPorRegionComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AVGUsoLocInstRdsMySQLViewUsoPorRegionComponent` `({ data, allMetrics, isLoading, error, }: Props)`

- Tipo interno `CellDatum` = `{ avg_value: number; min_value?: number; max_value?: number; count?: number; resources?: string[]; resource_count?: num…`
- Tipo interno `MetricValues` = `{ avg: number; min: number; max: number; count: number; }`
- Tipo interno `ProcessedHeatmapData` = `{ region: string; metrics: Record<string, MetricValues>; }`
- Tipo interno `Props` = `{ data: ProcessedHeatmapData[]; allMetrics: string[]; isLoading: boolean; error: unknown; }`
Internos:

- función `byAlpha` `(a: string, b: string)`
- función `formatBytes` `(v: number)`
- función `formatMetricValue` `(metric: string, value: number)`
- función `isUnused` `(v: unknown)`
- componente `MetricCellDialog` `({ region, metric, datum, }: { region: string; metric: string; datum: CellDatum; })`

- Usa: [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx), [`utils.ts`](../../lib.md#lib-utils-ts), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts)
- Usado por: [`AVGUsoLocInstRdsMySQLChartComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mysql-avgusolocinstrdsmysqlchartcomponent-tsx)

Notas de implementación:

- Lista de métricas (únicas y ordenadas) igual que en EC2
- Mapa región → (métrica → dato de celda) igual que en EC2

---

<a id="components-aws-vista-prom-loc-avg-uso-loc-inst-rds-oracle-avgusolocinstrdsoraclechartcomponent-tsx"></a>
## `components/aws/vista-prom-loc/avg-uso-loc-inst-rds-oracle/AVGUsoLocInstRdsOracleChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AVGUsoLocInstRdsOracleChartComponent` `({ startDate, endDate, instance, region, metrics }: Props)`

Interfaz `Props`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `instance` | `string` | no | — |
| `region` | `string` | no | — |
| `selectedKey` | `string \| null` | sí | — |
| `selectedValue` | `string \| null` | sí | — |
| `services` | `string` | sí | — |
| `metrics` | `string` | sí | — |

Interfaz `MetricAverageGeneral` — Interfaces para respuesta general (/promedio-loc-rds-oracle):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_groups` | `string[]` | no | — |
| `metric_label` | `string` | no | — |
| `metric_label_original` | `string` | no | — |
| `average_value` | `number` | no | — |
| `min_value` | `number` | no | — |
| `max_value` | `number` | no | — |
| `metric_count` | `number` | no | — |
| `resource_region` | `string` | no | — |

Interfaz `ApiResponseGeneral`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_groups_requested` | `string[]` | no | — |
| `metric_averages` | `MetricAverageGeneral[]` | no | — |
| `instances_by_sync_time` | `unknown[]` | no | — |

Interfaz `MetricAverageDetail` — Interfaces para respuesta de detalle (/promedio-loc-rds-oracle-detalle):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_group` | `string` | sí | Retrocompatibilidad Nueva estructura |
| `metric_groups` | `string[]` | sí | — |
| `metric_label` | `string` | no | — |
| `metric_label_original` | `string` | no | — |
| `average_value` | `number` | no | — |
| `min_value` | `number` | no | — |
| `max_value` | `number` | no | — |
| `metric_count` | `number` | no | — |
| `resource_region` | `string` | sí | Nuevo campo |

Interfaz `ResourceInfo`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource` | `string` | no | — |
| `db_instance_class` | `string \| null` | no | — |
| `resource_region` | `string` | no | — |
| `allocated_storage_formatted` | `string` | no | — |
| `engine_plus_version` | `string` | no | — |
| `sync_time_range` | `{ from: string; to: string; }` | no | — |

Interfaz `ApiResponseDetail`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource_info` | `ResourceInfo` | no | — |
| `metric_averages` | `MetricAverageDetail[]` | no | — |

Interfaz `MetricValues`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `avg` | `number` | no | — |
| `min` | `number` | no | — |
| `max` | `number` | no | — |
| `count` | `number` | no | — |

Interfaz `ProcessedHeatmapData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `region` | `string` | no | — |
| `metrics` | `{ [key: string]: MetricValues }` | no | — |

- Tipo interno `ApiResponse` = `ApiResponseGeneral | ApiResponseDetail`
- API: `/api/aws/bridge`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`AVGUsoLocInstRdsOracleViewUsoPorRegionComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-oracle-graficos-avgusolocinstrdsoracleviewusoporregioncomponent-tsx), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx)
- Usado por: [`MainViewInstanciasAVGUsoLocInstRdsOracleComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-oracle-mainviewinstanciasavgusolocinstrdsoraclecomponent-tsx)

Notas de implementación:

- Construir la URL de la API con lógica híbrida
- Formatear fechas: 2025-08-01T00:00:00
- Los grupos de métricas decodificados y separados por coma
- LÓGICA HÍBRIDA: cambiar endpoint según instancia seleccionada
- Endpoint para instancia específica
- Endpoint general (comportamiento original)
- Solo hacer la petición si tenemos los parámetros mínimos
- Procesar datos para el heatmap con lógica híbrida
- Detectar tipo de respuesta basado en la estructura
- RESPUESTA DE DETALLE - instancia específica
- Usar resource_region del resource_info si existe, sino usar la región del filtro
- RESPUESTA GENERAL - todas las instancias (lógica original)
- Agrupar métricas por región real (solo regiones con datos)
- Solo devolver regiones que realmente tienen datos
- Obtener todas las métricas únicas
- Estados de carga y error

---

<a id="components-aws-vista-prom-loc-avg-uso-loc-inst-rds-oracle-mainviewinstanciasavgusolocinstrdsoraclecomponent-tsx"></a>
## `components/aws/vista-prom-loc/avg-uso-loc-inst-rds-oracle/MainViewInstanciasAVGUsoLocInstRdsOracleComponent.tsx`

**Componente**

Exporta:

- componente `MainViewInstanciasAVGUsoLocInstRdsOracleComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`AVGUsoLocInstRdsOracleChartComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-oracle-avgusolocinstrdsoraclechartcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-avg-uso-loc-inst-rds-oracle-page-tsx)

---

<a id="components-aws-vista-prom-loc-avg-uso-loc-inst-rds-oracle-graficos-avgusolocinstrdsoracleviewusoporregioncomponent-tsx"></a>
## `components/aws/vista-prom-loc/avg-uso-loc-inst-rds-oracle/graficos/AVGUsoLocInstRdsOracleViewUsoPorRegionComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AVGUsoLocInstRdsOracleViewUsoPorRegionComponent` `({ data, allMetrics, isLoading, error, }: Props)`

- Tipo interno `CellDatum` = `{ avg_value: number; min_value?: number; max_value?: number; count?: number; resources?: string[]; resource_count?: num…`
- Tipo interno `MetricValues` = `{ avg: number; min: number; max: number; count: number; }`
- Tipo interno `ProcessedHeatmapData` = `{ region: string; metrics: Record<string, MetricValues>; }`
- Tipo interno `Props` = `{ data: ProcessedHeatmapData[]; allMetrics: string[]; isLoading: boolean; error: unknown; }`
Internos:

- función `byAlpha` `(a: string, b: string)`
- función `formatBytes` `(v: number)`
- función `formatMetricValue` `(metric: string, value: number)`
- función `isUnused` `(v: unknown)`
- componente `MetricCellDialog` `({ region, metric, datum, }: { region: string; metric: string; datum: CellDatum; })`

- Usa: [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx), [`utils.ts`](../../lib.md#lib-utils-ts), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts)
- Usado por: [`AVGUsoLocInstRdsOracleChartComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-oracle-avgusolocinstrdsoraclechartcomponent-tsx)

Notas de implementación:

- Lista de métricas (únicas y ordenadas) igual que en EC2
- Mapa región → (métrica → dato de celda) igual que en EC2

---

<a id="components-aws-vista-prom-loc-avg-uso-loc-inst-rds-pg-avgusolocinstrdspgchartcomponent-tsx"></a>
## `components/aws/vista-prom-loc/avg-uso-loc-inst-rds-pg/AVGUsoLocInstRdsPgChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AVGUsoLocInstRdsPgChartComponent` `({ startDate, endDate, instance, region, metrics }: Props)`

Interfaz `Props`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `instance` | `string` | no | — |
| `region` | `string` | no | — |
| `selectedKey` | `string \| null` | sí | — |
| `selectedValue` | `string \| null` | sí | — |
| `services` | `string` | sí | — |
| `metrics` | `string` | sí | — |

Interfaz `MetricAverageGeneral` — Interfaces para respuesta general (/promedio-loc-rds-pg):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_groups` | `string[]` | no | — |
| `metric_label` | `string` | no | — |
| `metric_label_original` | `string` | no | — |
| `average_value` | `number` | no | — |
| `min_value` | `number` | no | — |
| `max_value` | `number` | no | — |
| `metric_count` | `number` | no | — |
| `resource_region` | `string` | no | — |

Interfaz `ApiResponseGeneral`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_groups_requested` | `string[]` | no | — |
| `metric_averages` | `MetricAverageGeneral[]` | no | — |
| `instances_by_sync_time` | `unknown[]` | no | — |

Interfaz `MetricAverageDetail` — Interfaces para respuesta de detalle (/promedio-loc-rds-pg-detalle):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_group` | `string` | sí | Retrocompatibilidad Nueva estructura |
| `metric_groups` | `string[]` | sí | — |
| `metric_label` | `string` | no | — |
| `metric_label_original` | `string` | no | — |
| `average_value` | `number` | no | — |
| `min_value` | `number` | no | — |
| `max_value` | `number` | no | — |
| `metric_count` | `number` | no | — |
| `resource_region` | `string` | sí | Nuevo campo |

Interfaz `ResourceInfo`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource` | `string` | no | — |
| `db_instance_class` | `string \| null` | no | — |
| `resource_region` | `string` | no | — |
| `allocated_storage_formatted` | `string` | no | — |
| `engine_plus_version` | `string` | no | — |
| `sync_time_range` | `{ from: string; to: string; }` | no | — |

Interfaz `ApiResponseDetail`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource_info` | `ResourceInfo` | no | — |
| `metric_averages` | `MetricAverageDetail[]` | no | — |

Interfaz `MetricValues`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `avg` | `number` | no | — |
| `min` | `number` | no | — |
| `max` | `number` | no | — |
| `count` | `number` | no | — |

Interfaz `ProcessedHeatmapData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `region` | `string` | no | — |
| `metrics` | `{ [key: string]: MetricValues }` | no | — |

- Tipo interno `ApiResponse` = `ApiResponseGeneral | ApiResponseDetail`
- API: `/api/aws/bridge`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`AVGUsoLocInstRdsPgViewUsoPorRegionComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-pg-graficos-avgusolocinstrdspgviewusoporregioncomponent-tsx), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx)
- Usado por: [`MainViewInstanciasAVGUsoLocInstRdsPgComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-pg-mainviewinstanciasavgusolocinstrdspgcomponent-tsx)

Notas de implementación:

- Construir la URL de la API con lógica híbrida
- Formatear fechas: 2025-08-01T00:00:00
- Los grupos de métricas decodificados y separados por coma
- LÓGICA HÍBRIDA: cambiar endpoint según instancia seleccionada
- Endpoint para instancia específica
- Endpoint general (comportamiento original)
- Solo hacer la petición si tenemos los parámetros mínimos
- Procesar datos para el heatmap con lógica híbrida
- Detectar tipo de respuesta basado en la estructura
- RESPUESTA DE DETALLE - instancia específica
- Usar resource_region del resource_info si existe, sino usar la región del filtro
- RESPUESTA GENERAL - todas las instancias (lógica original)
- Agrupar métricas por región real (solo regiones con datos)
- Solo devolver regiones que realmente tienen datos
- Obtener todas las métricas únicas
- Estados de carga y error

---

<a id="components-aws-vista-prom-loc-avg-uso-loc-inst-rds-pg-mainviewinstanciasavgusolocinstrdspgcomponent-tsx"></a>
## `components/aws/vista-prom-loc/avg-uso-loc-inst-rds-pg/MainViewInstanciasAVGUsoLocInstRdsPgComponent.tsx`

**Componente**

Exporta:

- componente `MainViewInstanciasAVGUsoLocInstRdsPgComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`AVGUsoLocInstRdsPgChartComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-pg-avgusolocinstrdspgchartcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-avg-uso-loc-inst-rds-pg-page-tsx)

---

<a id="components-aws-vista-prom-loc-avg-uso-loc-inst-rds-pg-graficos-avgusolocinstrdspgviewusoporregioncomponent-tsx"></a>
## `components/aws/vista-prom-loc/avg-uso-loc-inst-rds-pg/graficos/AVGUsoLocInstRdsPgViewUsoPorRegionComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AVGUsoLocInstRdsPgViewUsoPorRegionComponent` `({ data, allMetrics, isLoading, error, }: Props)`

- Tipo interno `CellDatum` = `{ avg_value: number; min_value?: number; max_value?: number; count?: number; resources?: string[]; resource_count?: num…`
- Tipo interno `MetricValues` = `{ avg: number; min: number; max: number; count: number; }`
- Tipo interno `ProcessedHeatmapData` = `{ region: string; metrics: Record<string, MetricValues>; }`
- Tipo interno `Props` = `{ data: ProcessedHeatmapData[]; allMetrics: string[]; isLoading: boolean; error: unknown; }`
Internos:

- función `byAlpha` `(a: string, b: string)`
- función `formatBytes` `(v: number)`
- función `formatMetricValue` `(metric: string, value: number)`
- función `isUnused` `(v: unknown)`
- componente `MetricCellDialog` `({ region, metric, datum, }: { region: string; metric: string; datum: CellDatum; })`

- Usa: [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx), [`utils.ts`](../../lib.md#lib-utils-ts), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts)
- Usado por: [`AVGUsoLocInstRdsPgChartComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-pg-avgusolocinstrdspgchartcomponent-tsx)

Notas de implementación:

- Lista de métricas (únicas y ordenadas) igual que en EC2
- Mapa región → (métrica → dato de celda) igual que en EC2

---

<a id="components-aws-vista-prom-loc-avg-uso-loc-inst-rds-sqlserver-avgusolocinstrdssqlserverchartcomponent-tsx"></a>
## `components/aws/vista-prom-loc/avg-uso-loc-inst-rds-sqlserver/AVGUsoLocInstRdsSQLServerChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AVGUsoLocInstRdsSQLServerChartComponent` `({ startDate, endDate, instance, region, metrics }: Props)`

Interfaz `Props`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `instance` | `string` | no | — |
| `region` | `string` | no | — |
| `selectedKey` | `string \| null` | sí | — |
| `selectedValue` | `string \| null` | sí | — |
| `services` | `string` | sí | — |
| `metrics` | `string` | sí | — |

Interfaz `MetricAverageGeneral` — Interfaces para respuesta general (/promedio-loc-rds-sqlserver):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_groups` | `string[]` | no | — |
| `metric_label` | `string` | no | — |
| `metric_label_original` | `string` | no | — |
| `average_value` | `number` | no | — |
| `min_value` | `number` | no | — |
| `max_value` | `number` | no | — |
| `metric_count` | `number` | no | — |
| `resource_region` | `string` | no | — |

Interfaz `ApiResponseGeneral`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_groups_requested` | `string[]` | no | — |
| `metric_averages` | `MetricAverageGeneral[]` | no | — |
| `instances_by_sync_time` | `unknown[]` | no | — |

Interfaz `MetricAverageDetail` — Interfaces para respuesta de detalle (/promedio-loc-rds-sqlserver-detalle):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `metric_group` | `string` | sí | Retrocompatibilidad Nueva estructura |
| `metric_groups` | `string[]` | sí | — |
| `metric_label` | `string` | no | — |
| `metric_label_original` | `string` | no | — |
| `average_value` | `number` | no | — |
| `min_value` | `number` | no | — |
| `max_value` | `number` | no | — |
| `metric_count` | `number` | no | — |
| `resource_region` | `string` | sí | Nuevo campo |

Interfaz `ResourceInfo`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource` | `string` | no | — |
| `db_instance_class` | `string \| null` | no | — |
| `resource_region` | `string` | no | — |
| `allocated_storage_formatted` | `string` | no | — |
| `engine_plus_version` | `string` | no | — |
| `sync_time_range` | `{ from: string; to: string; }` | no | — |

Interfaz `ApiResponseDetail`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource_info` | `ResourceInfo` | no | — |
| `metric_averages` | `MetricAverageDetail[]` | no | — |

Interfaz `MetricValues`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `avg` | `number` | no | — |
| `min` | `number` | no | — |
| `max` | `number` | no | — |
| `count` | `number` | no | — |

Interfaz `ProcessedHeatmapData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `region` | `string` | no | — |
| `metrics` | `{ [key: string]: MetricValues }` | no | — |

- Tipo interno `ApiResponse` = `ApiResponseGeneral | ApiResponseDetail`
- API: `/api/aws/bridge`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`AVGUsoLocInstRdsSQLServerViewUsoPorRegionComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-sqlserver-graficos-avgusolocinstrdssqlserverviewusoporregioncomponent-tsx), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx)
- Usado por: [`MainViewInstanciasAVGUsoLocInstRdsSQLServerComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-sqlserver-mainviewinstanciasavgusolocinstrdssqlservercomponent-tsx)

Notas de implementación:

- Construir la URL de la API con lógica híbrida
- Formatear fechas: 2025-08-01T00:00:00
- Los grupos de métricas decodificados y separados por coma
- LÓGICA HÍBRIDA: cambiar endpoint según instancia seleccionada
- Endpoint para instancia específica
- Endpoint general (comportamiento original)
- Solo hacer la petición si tenemos los parámetros mínimos
- Procesar datos para el heatmap con lógica híbrida
- Detectar tipo de respuesta basado en la estructura
- RESPUESTA DE DETALLE - instancia específica
- Usar resource_region del resource_info si existe, sino usar la región del filtro
- RESPUESTA GENERAL - todas las instancias (lógica original)
- Agrupar métricas por región real (solo regiones con datos)
- Solo devolver regiones que realmente tienen datos
- Obtener todas las métricas únicas
- Estados de carga y error

---

<a id="components-aws-vista-prom-loc-avg-uso-loc-inst-rds-sqlserver-mainviewinstanciasavgusolocinstrdssqlservercomponent-tsx"></a>
## `components/aws/vista-prom-loc/avg-uso-loc-inst-rds-sqlserver/MainViewInstanciasAVGUsoLocInstRdsSQLServerComponent.tsx`

**Componente**

Exporta:

- componente `MainViewInstanciasAVGUsoLocInstRdsSQLServerComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`AVGUsoLocInstRdsSQLServerChartComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-sqlserver-avgusolocinstrdssqlserverchartcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-funciones-avg-uso-loc-inst-rds-sqlserver-page-tsx)

---

<a id="components-aws-vista-prom-loc-avg-uso-loc-inst-rds-sqlserver-graficos-avgusolocinstrdssqlserverviewusoporregioncomponent-tsx"></a>
## `components/aws/vista-prom-loc/avg-uso-loc-inst-rds-sqlserver/graficos/AVGUsoLocInstRdsSQLServerViewUsoPorRegionComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AVGUsoLocInstRdsSQLServerViewUsoPorRegionComponent` `({ data, allMetrics, isLoading, error, }: Props)`

- Tipo interno `CellDatum` = `{ avg_value: number; min_value?: number; max_value?: number; count?: number; resources?: string[]; resource_count?: num…`
- Tipo interno `MetricValues` = `{ avg: number; min: number; max: number; count: number; }`
- Tipo interno `ProcessedHeatmapData` = `{ region: string; metrics: Record<string, MetricValues>; }`
- Tipo interno `Props` = `{ data: ProcessedHeatmapData[]; allMetrics: string[]; isLoading: boolean; error: unknown; }`
Internos:

- función `byAlpha` `(a: string, b: string)`
- función `formatBytes` `(v: number)`
- función `formatMetricValue` `(metric: string, value: number)`
- función `isUnused` `(v: unknown)`
- componente `MetricCellDialog` `({ region, metric, datum, }: { region: string; metric: string; datum: CellDatum; })`

- Usa: [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx), [`utils.ts`](../../lib.md#lib-utils-ts), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts)
- Usado por: [`AVGUsoLocInstRdsSQLServerChartComponent.tsx`](#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-sqlserver-avgusolocinstrdssqlserverchartcomponent-tsx)

Notas de implementación:

- Lista de métricas (únicas y ordenadas) igual que en EC2
- Mapa región → (métrica → dato de celda) igual que en EC2

