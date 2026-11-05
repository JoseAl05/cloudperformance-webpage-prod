# Componentes `components/azure/vista-funciones/`

[← Índice](../../README.md)

Funciones de Azure: promedio por localización, blob vs storage, horario hábil vs no hábil (VM, BD, nodos), Top 10 recursos por uso y su incremento, y VMs spot vs regulares.

Archivos:

- [`components/azure/vista-funciones/average-by-location/AverageByLocationComponent.tsx`](#components-azure-vista-funciones-average-by-location-averagebylocationcomponent-tsx)
- [`components/azure/vista-funciones/average-by-location/MainViewAverageByLocationComponent.tsx`](#components-azure-vista-funciones-average-by-location-mainviewaveragebylocationcomponent-tsx)
- [`components/azure/vista-funciones/average-by-location/grafico/AverageByLocationMetricsComponent.tsx`](#components-azure-vista-funciones-average-by-location-grafico-averagebylocationmetricscomponent-tsx)
- [`components/azure/vista-funciones/average-by-location/info/AverageByLocationCardsComponent.tsx`](#components-azure-vista-funciones-average-by-location-info-averagebylocationcardscomponent-tsx)
- [`components/azure/vista-funciones/blob-vs-storage-general/BlobVsStorageGeneralComponent.tsx`](#components-azure-vista-funciones-blob-vs-storage-general-blobvsstoragegeneralcomponent-tsx)
- [`components/azure/vista-funciones/blob-vs-storage-general/MainViewBlobVsStorageComponent.tsx`](#components-azure-vista-funciones-blob-vs-storage-general-mainviewblobvsstoragecomponent-tsx)
- [`components/azure/vista-funciones/blob-vs-storage-general/graficos/BlobVsStorageGeneralCapacityComponent.tsx`](#components-azure-vista-funciones-blob-vs-storage-general-graficos-blobvsstoragegeneralcapacitycomponent-tsx)
- [`components/azure/vista-funciones/blob-vs-storage-general/info/BlobVsStorageCardsComponent.tsx`](#components-azure-vista-funciones-blob-vs-storage-general-info-blobvsstoragecardscomponent-tsx)
- [`components/azure/vista-funciones/consumo-horario-habil-no-habil/data-bases/AzureDbWorkingNonWorkingHoursComponent.tsx`](#components-azure-vista-funciones-consumo-horario-habil-no-habil-data-bases-azuredbworkingnonworkinghourscomponent-tsx)
- [`components/azure/vista-funciones/consumo-horario-habil-no-habil/data-bases/MainViewAzureDbWorkingNonWorkingHoursComponent.tsx`](#components-azure-vista-funciones-consumo-horario-habil-no-habil-data-bases-mainviewazuredbworkingnonworkinghourscomponent-tsx)
- [`components/azure/vista-funciones/consumo-horario-habil-no-habil/nodes/AzureNodosWorkingNonWorkingHoursComponent.tsx`](#components-azure-vista-funciones-consumo-horario-habil-no-habil-nodes-azurenodosworkingnonworkinghourscomponent-tsx)
- [`components/azure/vista-funciones/consumo-horario-habil-no-habil/nodes/MainViewAzureNodosWorkingNonWorkingHoursComponent.tsx`](#components-azure-vista-funciones-consumo-horario-habil-no-habil-nodes-mainviewazurenodosworkingnonworkinghourscomponent-tsx)
- [`components/azure/vista-funciones/consumo-horario-habil-no-habil/table/WorkingNonWorkingHoursColumns.tsx`](#components-azure-vista-funciones-consumo-horario-habil-no-habil-table-workingnonworkinghourscolumns-tsx)
- [`components/azure/vista-funciones/consumo-horario-habil-no-habil/virtual-machines/AnalisisVMsHorarioChartComponent.tsx`](#components-azure-vista-funciones-consumo-horario-habil-no-habil-virtual-machines-analisisvmshorariochartcomponent-tsx)
- [`components/azure/vista-funciones/consumo-horario-habil-no-habil/virtual-machines/AzureVmWorkingNonWorkingHoursComponent.tsx`](#components-azure-vista-funciones-consumo-horario-habil-no-habil-virtual-machines-azurevmworkingnonworkinghourscomponent-tsx)
- [`components/azure/vista-funciones/consumo-horario-habil-no-habil/virtual-machines/MainViewAnalisisVMsHorarioComponent.tsx`](#components-azure-vista-funciones-consumo-horario-habil-no-habil-virtual-machines-mainviewanalisisvmshorariocomponent-tsx)
- [`components/azure/vista-funciones/incremento-top-recursos-uso/IncrementoTopRecursosUsoChartComponent.tsx`](#components-azure-vista-funciones-incremento-top-recursos-uso-incrementotoprecursosusochartcomponent-tsx)
- [`components/azure/vista-funciones/incremento-top-recursos-uso/MainViewIncrementoTopRecursosUsoComponent.tsx`](#components-azure-vista-funciones-incremento-top-recursos-uso-mainviewincrementotoprecursosusocomponent-tsx)
- [`components/azure/vista-funciones/spot-vs-regular-vm/MainViewSpotVsRegularVmComponent.tsx`](#components-azure-vista-funciones-spot-vs-regular-vm-mainviewspotvsregularvmcomponent-tsx)
- [`components/azure/vista-funciones/spot-vs-regular-vm/SpotVsRegularVmComponent.tsx`](#components-azure-vista-funciones-spot-vs-regular-vm-spotvsregularvmcomponent-tsx)
- [`components/azure/vista-funciones/spot-vs-regular-vm/grafico/SpotVsRegularVmTimelineComponent.tsx`](#components-azure-vista-funciones-spot-vs-regular-vm-grafico-spotvsregularvmtimelinecomponent-tsx)
- [`components/azure/vista-funciones/spot-vs-regular-vm/info/SpotVsRegularVmCardsComponent.tsx`](#components-azure-vista-funciones-spot-vs-regular-vm-info-spotvsregularvmcardscomponent-tsx)
- [`components/azure/vista-funciones/spot-vs-regular-vm/table/SpotVsRegularVmColumns.tsx`](#components-azure-vista-funciones-spot-vs-regular-vm-table-spotvsregularvmcolumns-tsx)
- [`components/azure/vista-funciones/spot-vs-regular-vm/table/SpotVsRegularVmTable.tsx`](#components-azure-vista-funciones-spot-vs-regular-vm-table-spotvsregularvmtable-tsx)
- [`components/azure/vista-funciones/top-10-recursos-uso/MainViewTop10RecursosUsoComponent.tsx`](#components-azure-vista-funciones-top-10-recursos-uso-mainviewtop10recursosusocomponent-tsx)
- [`components/azure/vista-funciones/top-10-recursos-uso/Top10RecursosUsoChartComponent.tsx`](#components-azure-vista-funciones-top-10-recursos-uso-top10recursosusochartcomponent-tsx)
- [`components/azure/vista-funciones/unused-apps-gateway/MainViewUnusedAppsGw.tsx`](#components-azure-vista-funciones-unused-apps-gateway-mainviewunusedappsgw-tsx)
- [`components/azure/vista-funciones/unused-apps-gateway/UnusedAppsGwComponent.tsx`](#components-azure-vista-funciones-unused-apps-gateway-unusedappsgwcomponent-tsx)
- [`components/azure/vista-funciones/unused-apps-gateway/table/UnusedAppsGwColumns.tsx`](#components-azure-vista-funciones-unused-apps-gateway-table-unusedappsgwcolumns-tsx)
- [`components/azure/vista-funciones/unused-loadbalancers/MainViewUnusedLoadbalancers.tsx`](#components-azure-vista-funciones-unused-loadbalancers-mainviewunusedloadbalancers-tsx)
- [`components/azure/vista-funciones/unused-loadbalancers/UnusedLoadbalancersComponent.tsx`](#components-azure-vista-funciones-unused-loadbalancers-unusedloadbalancerscomponent-tsx)
- [`components/azure/vista-funciones/unused-resources/extensions/MainViewUnusedVmExtensionsComponent.tsx`](#components-azure-vista-funciones-unused-resources-extensions-mainviewunusedvmextensionscomponent-tsx)
- [`components/azure/vista-funciones/unused-resources/extensions/UnusedVmExtensionsComponent.tsx`](#components-azure-vista-funciones-unused-resources-extensions-unusedvmextensionscomponent-tsx)
- [`components/azure/vista-funciones/unused-resources/extensions/table/UnusedVmExtensionsColumns.tsx`](#components-azure-vista-funciones-unused-resources-extensions-table-unusedvmextensionscolumns-tsx)
- [`components/azure/vista-funciones/unused-resources/vm/MainViewUnusedVmComponent.tsx`](#components-azure-vista-funciones-unused-resources-vm-mainviewunusedvmcomponent-tsx)
- [`components/azure/vista-funciones/unused-resources/vm/UnusedVmComponent.tsx`](#components-azure-vista-funciones-unused-resources-vm-unusedvmcomponent-tsx)
- [`components/azure/vista-funciones/unused-resources/vm/table/UnusedVmColumns.tsx`](#components-azure-vista-funciones-unused-resources-vm-table-unusedvmcolumns-tsx)
- [`components/azure/vista-funciones/unused-resources/vmss/MainViewUnusedVmssComponent.tsx`](#components-azure-vista-funciones-unused-resources-vmss-mainviewunusedvmsscomponent-tsx)
- [`components/azure/vista-funciones/unused-resources/vmss/UnusedVmssComponent.tsx`](#components-azure-vista-funciones-unused-resources-vmss-unusedvmsscomponent-tsx)
- [`components/azure/vista-funciones/unused-resources/vmss/table/UnusedVmssColumns.tsx`](#components-azure-vista-funciones-unused-resources-vmss-table-unusedvmsscolumns-tsx)
- [`components/azure/vista-funciones/unused-traffic-managers/MainViewUnusedTrafficManagerComponent.tsx`](#components-azure-vista-funciones-unused-traffic-managers-mainviewunusedtrafficmanagercomponent-tsx)
- [`components/azure/vista-funciones/unused-traffic-managers/UnusedTrafficManagerComponent.tsx`](#components-azure-vista-funciones-unused-traffic-managers-unusedtrafficmanagercomponent-tsx)
- [`components/azure/vista-funciones/unused-traffic-managers/table/UnusedTrafficManagerColumns.tsx`](#components-azure-vista-funciones-unused-traffic-managers-table-unusedtrafficmanagercolumns-tsx)
- [`components/azure/vista-funciones/variacion-storage/MainViewStorageVariationComponent.tsx`](#components-azure-vista-funciones-variacion-storage-mainviewstoragevariationcomponent-tsx)
- [`components/azure/vista-funciones/variacion-storage/StorageVariationComponent.tsx`](#components-azure-vista-funciones-variacion-storage-storagevariationcomponent-tsx)
- [`components/azure/vista-funciones/variacion-storage/graficos/StorageVariationCapacitiesComponent.tsx`](#components-azure-vista-funciones-variacion-storage-graficos-storagevariationcapacitiescomponent-tsx)
- [`components/azure/vista-funciones/variacion-storage/info/StorageVariationCardsComponent.tsx`](#components-azure-vista-funciones-variacion-storage-info-storagevariationcardscomponent-tsx)

<a id="components-azure-vista-funciones-average-by-location-averagebylocationcomponent-tsx"></a>
## `components/azure/vista-funciones/average-by-location/AverageByLocationComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AverageByLocationComponent` `({ startDate, endDate, region, subscription, selectedService }: AverageByLocationComponentProps)`

Interfaz `AverageByLocationComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `subscription` | `string` | no | — |
| `selectedService` | `string` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`
- función `isNullish` `(v: unknown)`

- API: `/api/azure/bridge/azure/recursos/avg_by_location`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx), [`avgByLocationInterfaces.ts`](../../tipos.md#interfaces-vista-promedio-por-localizacion-avgbylocationinterfaces-ts), [`AverageByLocationMetricsComponent.tsx`](#components-azure-vista-funciones-average-by-location-grafico-averagebylocationmetricscomponent-tsx), [`AverageByLocationCardsComponent.tsx`](#components-azure-vista-funciones-average-by-location-info-averagebylocationcardscomponent-tsx)
- Usado por: [`MainViewAverageByLocationComponent.tsx`](#components-azure-vista-funciones-average-by-location-mainviewaveragebylocationcomponent-tsx)

---

<a id="components-azure-vista-funciones-average-by-location-mainviewaveragebylocationcomponent-tsx"></a>
## `components/azure/vista-funciones/average-by-location/MainViewAverageByLocationComponent.tsx`

**Componente**

Exporta:

- componente `MainViewAverageByLocationComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`AverageByLocationComponent.tsx`](#components-azure-vista-funciones-average-by-location-averagebylocationcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-funciones-promedio-por-localizacion-page-tsx)

---

<a id="components-azure-vista-funciones-average-by-location-grafico-averagebylocationmetricscomponent-tsx"></a>
## `components/azure/vista-funciones/average-by-location/grafico/AverageByLocationMetricsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AverageByLocationMetricsComponent` `({ data }: Props)`

- Tipo interno `Props` = `{ data: AverageByLocationData[]; }`
Internos:

- función `byAlpha` `(a: string, b: string)`
- función `formatBytes` `(v: number)`
- función `formatMetricValue` `(metric: string, value: number)`
- función `isUnused` `(v: unknown)`
- componente `MetricCellDialog` `({ region, metric, datum, }: { region: string; metric: string; datum: AverageByLocationData['averages'][number]; })`

- Usa: [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx), [`avgByLocationInterfaces.ts`](../../tipos.md#interfaces-vista-promedio-por-localizacion-avgbylocationinterfaces-ts), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts), [`utils.ts`](../../lib.md#lib-utils-ts)
- Usado por: [`AverageByLocationComponent.tsx`](#components-azure-vista-funciones-average-by-location-averagebylocationcomponent-tsx)

Notas de implementación:

- _MetricCellDialog_: JSX — NUEVO: max y min observados

---

<a id="components-azure-vista-funciones-average-by-location-info-averagebylocationcardscomponent-tsx"></a>
## `components/azure/vista-funciones/average-by-location/info/AverageByLocationCardsComponent.tsx`

**Componente**

Exporta:

- componente `AverageByLocationCardsComponent` `({ data }: AverageByLocationCardsComponentProps)`

Interfaz `AverageByLocationCardsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AverageByLocation[]` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`avgByLocationInterfaces.ts`](../../tipos.md#interfaces-vista-promedio-por-localizacion-avgbylocationinterfaces-ts), [`utils.ts`](../../lib.md#lib-utils-ts)
- Usado por: [`AverageByLocationComponent.tsx`](#components-azure-vista-funciones-average-by-location-averagebylocationcomponent-tsx)

---

<a id="components-azure-vista-funciones-blob-vs-storage-general-blobvsstoragegeneralcomponent-tsx"></a>
## `components/azure/vista-funciones/blob-vs-storage-general/BlobVsStorageGeneralComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `BlobVsStorageGeneralComponent` `({ selectedStrgAccount, region, subscription, startDate, endDate }: BlobVsStorageGeneralComponentProps)`

Interfaz `BlobVsStorageGeneralComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `selectedStrgAccount` | `string` | no | — |
| `region` | `string` | no | — |
| `subscription` | `string` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`
- función `isNullish` `(v: unknown)`

- API: `/api/azure/bridge/azure/storage/service-storage-vs-total-storage`, `/api/azure/bridge/azure/storage/storage-capacity-sum`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx), [`allStorageCapacityInterfaces.ts`](../../tipos.md#interfaces-vista-blob-vs-storage-allstoragecapacityinterfaces-ts), [`BlobVsStorageCardsComponent.tsx`](#components-azure-vista-funciones-blob-vs-storage-general-info-blobvsstoragecardscomponent-tsx), [`strgVsGeneralInterfaces.ts`](../../tipos.md#interfaces-vista-blob-vs-storage-strgvsgeneralinterfaces-ts), [`BlobVsStorageGeneralCapacityComponent.tsx`](#components-azure-vista-funciones-blob-vs-storage-general-graficos-blobvsstoragegeneralcapacitycomponent-tsx)
- Usado por: [`MainViewBlobVsStorageComponent.tsx`](#components-azure-vista-funciones-blob-vs-storage-general-mainviewblobvsstoragecomponent-tsx)

---

<a id="components-azure-vista-funciones-blob-vs-storage-general-mainviewblobvsstoragecomponent-tsx"></a>
## `components/azure/vista-funciones/blob-vs-storage-general/MainViewBlobVsStorageComponent.tsx`

**Componente**

Exporta:

- componente `MainViewBlobVsStorageComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`BlobVsStorageGeneralComponent.tsx`](#components-azure-vista-funciones-blob-vs-storage-general-blobvsstoragegeneralcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-funciones-blob-vs-storage-general-page-tsx)

---

<a id="components-azure-vista-funciones-blob-vs-storage-general-graficos-blobvsstoragegeneralcapacitycomponent-tsx"></a>
## `components/azure/vista-funciones/blob-vs-storage-general/graficos/BlobVsStorageGeneralCapacityComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `BlobVsStorageGeneralCapacityComponent` `({ data, title = 'Capacidad: Storage Account vs Servicios', }: BlobVsStorageGeneralCapacityComponentProps)`

Interfaz `BlobVsStorageGeneralCapacityComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `StorageVsGeneralCapacity[] \| null` | no | — |
| `title` | `string` | sí | — |

Internos:

- función `normalizeMetric` `(m: string)`

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts), [`strgVsGeneralInterfaces.ts`](../../tipos.md#interfaces-vista-blob-vs-storage-strgvsgeneralinterfaces-ts), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`BlobVsStorageGeneralComponent.tsx`](#components-azure-vista-funciones-blob-vs-storage-general-blobvsstoragegeneralcomponent-tsx)

---

<a id="components-azure-vista-funciones-blob-vs-storage-general-info-blobvsstoragecardscomponent-tsx"></a>
## `components/azure/vista-funciones/blob-vs-storage-general/info/BlobVsStorageCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `BlobVsStorageCardsComponent` `({ strgCapacityData }: BlobVsStorageCardsComponentProps)`

Interfaz `BlobVsStorageCardsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `strgCapacityData` | `AllStorageCapacity[] \| null` | no | — |

- Tipo interno `LucideIcon` = `ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>`
Internos:

- constante `SERVICE_LABELS`
- constante `SERVICE_ICONS`
- constante `SERVICE_BORDERS`
- función `formatPct` `(n: number)`

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`allStorageCapacityInterfaces.ts`](../../tipos.md#interfaces-vista-blob-vs-storage-allstoragecapacityinterfaces-ts), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts)
- Usado por: [`BlobVsStorageGeneralComponent.tsx`](#components-azure-vista-funciones-blob-vs-storage-general-blobvsstoragegeneralcomponent-tsx)

---

<a id="components-azure-vista-funciones-consumo-horario-habil-no-habil-data-bases-azuredbworkingnonworkinghourscomponent-tsx"></a>
## `components/azure/vista-funciones/consumo-horario-habil-no-habil/data-bases/AzureDbWorkingNonWorkingHoursComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AzureDbWorkingNonWorkingHoursComponent` `({ startDate, endDate, subscription, region, selectedTagKey, selectedTagValue, selectedResourceGroup, selectedInstanceV2, }: AzureDbWorkingNonWorkingHoursCompo…` — Horario hábil vs no hábil Bases de Datos: adapta los filtros de la vista al contrato canónico (/api/azure/working-hours/db/*).

Interfaz `AzureDbWorkingNonWorkingHoursComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `subscription` | `string` | no | — |
| `region` | `string` | no | — |
| `selectedTagKey` | `string \| null` | sí | — |
| `selectedTagValue` | `string \| null` | sí | — |
| `selectedResourceGroup` | `string \| null` | sí | — |
| `selectedInstanceV2` | `string \| null` | sí | — |

Internos:

- función `isSet` `(value: string | null | undefined, allValue: string): value is string`

- Usa: [`WorkingHoursView.tsx`](../shared.md#components-shared-working-hours-workinghoursview-tsx), [`workingHoursConfigs.ts`](../shared.md#components-shared-working-hours-workinghoursconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewAzureDbWorkingNonWorkingHoursComponent.tsx`](#components-azure-vista-funciones-consumo-horario-habil-no-habil-data-bases-mainviewazuredbworkingnonworkinghourscomponent-tsx)

---

<a id="components-azure-vista-funciones-consumo-horario-habil-no-habil-data-bases-mainviewazuredbworkingnonworkinghourscomponent-tsx"></a>
## `components/azure/vista-funciones/consumo-horario-habil-no-habil/data-bases/MainViewAzureDbWorkingNonWorkingHoursComponent.tsx`

**Componente**

Exporta:

- componente `MainViewAzureDbWorkingNonWorkingHoursComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`AzureDbWorkingNonWorkingHoursComponent.tsx`](#components-azure-vista-funciones-consumo-horario-habil-no-habil-data-bases-azuredbworkingnonworkinghourscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-funciones-consumo-bds-horario-habil-vs-no-habil-page-tsx)

---

<a id="components-azure-vista-funciones-consumo-horario-habil-no-habil-nodes-azurenodosworkingnonworkinghourscomponent-tsx"></a>
## `components/azure/vista-funciones/consumo-horario-habil-no-habil/nodes/AzureNodosWorkingNonWorkingHoursComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AzureNodosWorkingNonWorkingHoursComponent` `({ startDate, endDate, subscription, region, selectedTagKey, selectedTagValue, selectedResourceGroup, selectedInstanceV2, }: AzureNodosWorkingNonWorkingHoursCo…` — Horario hábil vs no hábil Nodos AKS: adapta los filtros de la vista al contrato canónico (/api/azure/working-hours/nodes/*).

Interfaz `AzureNodosWorkingNonWorkingHoursComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `subscription` | `string` | no | — |
| `region` | `string` | no | — |
| `selectedTagKey` | `string \| null` | sí | — |
| `selectedTagValue` | `string \| null` | sí | — |
| `selectedResourceGroup` | `string \| null` | sí | — |
| `selectedInstanceV2` | `string \| null` | sí | — |

Internos:

- función `isSet` `(value: string | null | undefined, allValue: string): value is string`

- Usa: [`WorkingHoursView.tsx`](../shared.md#components-shared-working-hours-workinghoursview-tsx), [`workingHoursConfigs.ts`](../shared.md#components-shared-working-hours-workinghoursconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewAzureNodosWorkingNonWorkingHoursComponent.tsx`](#components-azure-vista-funciones-consumo-horario-habil-no-habil-nodes-mainviewazurenodosworkingnonworkinghourscomponent-tsx)

---

<a id="components-azure-vista-funciones-consumo-horario-habil-no-habil-nodes-mainviewazurenodosworkingnonworkinghourscomponent-tsx"></a>
## `components/azure/vista-funciones/consumo-horario-habil-no-habil/nodes/MainViewAzureNodosWorkingNonWorkingHoursComponent.tsx`

**Componente**

Exporta:

- componente `MainViewAzureNodosWorkingNonWorkingHoursComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`AzureNodosWorkingNonWorkingHoursComponent.tsx`](#components-azure-vista-funciones-consumo-horario-habil-no-habil-nodes-azurenodosworkingnonworkinghourscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-funciones-consumo-nodes-horario-habil-vs-no-habil-page-tsx)

---

<a id="components-azure-vista-funciones-consumo-horario-habil-no-habil-table-workingnonworkinghourscolumns-tsx"></a>
## `components/azure/vista-funciones/consumo-horario-habil-no-habil/table/WorkingNonWorkingHoursColumns.tsx`

**Módulo (cliente)**

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
- componente `DualMetricCell` `({ row, metricName, maxVal, format }: DualMetricCellProps)`
- componente `GeneralTrendCell` `({ row }: { row: WorkingNonWorkingHoursUsageSummaryByResource })`
- componente `DetailsCell` `({ row }: { row: WorkingNonWorkingHoursUsageSummaryByResource })`
- componente `GetParameters` `()`

- Hooks: `usePathname`, `useSearchParams`
- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`HistoryModal.tsx`](../general_gcp.md#components-general-gcp-modal-historymodal-tsx), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts), [`filters.ts`](../../lib.md#lib-filters-ts)

---

<a id="components-azure-vista-funciones-consumo-horario-habil-no-habil-virtual-machines-analisisvmshorariochartcomponent-tsx"></a>
## `components/azure/vista-funciones/consumo-horario-habil-no-habil/virtual-machines/AnalisisVMsHorarioChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AnalisisVMsHorarioChartComponent` `({ startDate, endDate, selectedMetric }: AnalisisVMsHorarioChartProps)`

Interfaz `AnalisisVmDato`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `vm_name` | `string` | no | — |
| `Tipo_Horario` | `string` | no | — |
| `used` | `number` | no | — |
| `Fecha` | `string` | no | — |
| `Hora` | `string` | sí | — |

Interfaz `AnalisisVmsHorarioResponse`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `datos` | `AnalisisVmDato[]` | sí | — |
| `tarjetas` | `Record<string, string>` | sí | — |

Interfaz `AnalisisVMsHorarioChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `selectedMetric` | `string` | sí | — |

- API: `/api/azure/bridge/azure/analisis-vms-horario`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx)

Notas de implementación:

- Filtrar por VM si hay una seleccionada
- Extraer unidad del primer valor de las tarjetas originales
- Recalcular tarjetas si hay VM seleccionada
- Calcular promedios para la VM seleccionada
- `setSelectedVM(null)` — Si ya está seleccionada, deseleccionar
- Agrupar por día y tomar el promedio, guardando también la hora
- `const fecha = item.Fecha` — Ya está en formato DD/MM/YYYY
- JSX — Indicador de VM seleccionada
- JSX — Gráfico
- JSX — Tarjetas
- JSX — Tabla de Detalle

---

<a id="components-azure-vista-funciones-consumo-horario-habil-no-habil-virtual-machines-azurevmworkingnonworkinghourscomponent-tsx"></a>
## `components/azure/vista-funciones/consumo-horario-habil-no-habil/virtual-machines/AzureVmWorkingNonWorkingHoursComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AzureVmWorkingNonWorkingHoursComponent` `({ startDate, endDate, subscription, region, selectedTagKey, selectedTagValue, selectedResourceGroup, selectedInstanceV2, }: AzureVmWorkingNonWorkingHoursCompo…` — Horario hábil vs no hábil Máquinas Virtuales: adapta los filtros de la vista al contrato canónico (/api/azure/working-hours/vm/*).

Interfaz `AzureVmWorkingNonWorkingHoursComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `subscription` | `string` | no | — |
| `region` | `string` | no | — |
| `selectedTagKey` | `string \| null` | sí | — |
| `selectedTagValue` | `string \| null` | sí | — |
| `selectedResourceGroup` | `string \| null` | sí | — |
| `selectedInstanceV2` | `string \| null` | sí | — |

Internos:

- función `isSet` `(value: string | null | undefined, allValue: string): value is string`

- Usa: [`WorkingHoursView.tsx`](../shared.md#components-shared-working-hours-workinghoursview-tsx), [`workingHoursConfigs.ts`](../shared.md#components-shared-working-hours-workinghoursconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewAnalisisVMsHorarioComponent.tsx`](#components-azure-vista-funciones-consumo-horario-habil-no-habil-virtual-machines-mainviewanalisisvmshorariocomponent-tsx)

---

<a id="components-azure-vista-funciones-consumo-horario-habil-no-habil-virtual-machines-mainviewanalisisvmshorariocomponent-tsx"></a>
## `components/azure/vista-funciones/consumo-horario-habil-no-habil/virtual-machines/MainViewAnalisisVMsHorarioComponent.tsx`

**Componente**

{/* Filtros + gráfico */}
<FiltersComponent
Component={AnalisisVMsHorarioChartComponent}
dateFilter
metricsFilter
metricsCollection='custom_db_metrics_logs'
//resourceTypeFilter
</div>
)
}

Exporta:

- componente `MainViewAnalisisVMsHorarioComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`AzureVmWorkingNonWorkingHoursComponent.tsx`](#components-azure-vista-funciones-consumo-horario-habil-no-habil-virtual-machines-azurevmworkingnonworkinghourscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-funciones-analisis-vms-horario-page-tsx)

---

<a id="components-azure-vista-funciones-incremento-top-recursos-uso-incrementotoprecursosusochartcomponent-tsx"></a>
## `components/azure/vista-funciones/incremento-top-recursos-uso/IncrementoTopRecursosUsoChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `IncrementoTopRecursosUsoChartComponent` `({ startDate, endDate, selectedMetric, selectedResourceType, selectedResource }: IncrementoTopRecursosUsoChartProps)`

Interfaz `IncrementoSeriePunto`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `fecha` | `string` | no | — |
| `porcentaje_uso` | `number` | no | — |

Interfaz `IncrementoTarjetas`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `porcentaje_uso_mes_anterior` | `number \| null` | no | — |
| `porcentaje_uso_mes_actual` | `number \| null` | no | — |
| `porcentaje_uso_fecha_anterior` | `number \| null` | no | — |
| `porcentaje_uso_ultima_fecha` | `number \| null` | no | — |
| `variacion` | `number` | no | — |
| `incremento` | `number` | no | — |
| `tendencia_variacion` | `string` | no | — |
| `tendencia_incremento` | `string` | no | — |

Interfaz `IncrementoTopRecursosUsoResponse`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `es_porcentaje` | `boolean` | sí | Los valores `porcentaje_uso*` son el promedio de `metric_value` en la unidad de la métrica (en % sólo si es_porcentaje) |
| `unidad` | `string` | sí | — |
| `serie_temporal` | `IncrementoSeriePunto[]` | sí | — |
| `tarjetas` | `IncrementoTarjetas` | sí | — |

Interfaz `IncrementoTopRecursosUsoChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `selectedMetric` | `string` | sí | — |
| `selectedResourceType` | `string` | sí | — |
| `selectedResource` | `string` | sí | — |

- API: `/api/azure/bridge/azure/incremento-top-recursos-uso`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewIncrementoTopRecursosUsoComponent.tsx`](#components-azure-vista-funciones-incremento-top-recursos-uso-mainviewincrementotoprecursosusocomponent-tsx)

Notas de implementación:

- JSX — Gráfico
- JSX — Tarjetas de métricas
- JSX — Mes Anterior
- JSX — Mes Actual
- JSX — Variación
- JSX — Fecha Anterior
- JSX — Última Fecha
- JSX — Incremento

---

<a id="components-azure-vista-funciones-incremento-top-recursos-uso-mainviewincrementotoprecursosusocomponent-tsx"></a>
## `components/azure/vista-funciones/incremento-top-recursos-uso/MainViewIncrementoTopRecursosUsoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewIncrementoTopRecursosUsoComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`IncrementoTopRecursosUsoChartComponent.tsx`](#components-azure-vista-funciones-incremento-top-recursos-uso-incrementotoprecursosusochartcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-funciones-incremento-top-recursos-uso-page-tsx)

Notas de implementación:

- JSX — Header

---

<a id="components-azure-vista-funciones-spot-vs-regular-vm-mainviewspotvsregularvmcomponent-tsx"></a>
## `components/azure/vista-funciones/spot-vs-regular-vm/MainViewSpotVsRegularVmComponent.tsx`

**Componente**

Exporta:

- componente `MainViewSpotVsRegularVmComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`SpotVsRegularVmComponent.tsx`](#components-azure-vista-funciones-spot-vs-regular-vm-spotvsregularvmcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-funciones-spot-vs-regular-vm-page-tsx)

---

<a id="components-azure-vista-funciones-spot-vs-regular-vm-spotvsregularvmcomponent-tsx"></a>
## `components/azure/vista-funciones/spot-vs-regular-vm/SpotVsRegularVmComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `SpotVsRegularVmComponent` `({ startDate, endDate, subscription, region }: SpotVsRegularVmComponentProps)`

Interfaz `SpotVsRegularVmComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `subscription` | `string` | no | — |
| `region` | `string` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`
- función `isNullish` `(v: unknown)`

- API: `/api/azure/bridge/azure/vms/vm-vs-spot`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx), [`spotVsRegularVmInterfaces.ts`](../../tipos.md#interfaces-vista-spot-vs-regular-vm-spotvsregularvminterfaces-ts), [`SpotVsRegularVmTimelineComponent.tsx`](#components-azure-vista-funciones-spot-vs-regular-vm-grafico-spotvsregularvmtimelinecomponent-tsx), [`SpotVsRegularVmCardsComponent.tsx`](#components-azure-vista-funciones-spot-vs-regular-vm-info-spotvsregularvmcardscomponent-tsx), [`SpotVsRegularVmTable.tsx`](#components-azure-vista-funciones-spot-vs-regular-vm-table-spotvsregularvmtable-tsx)
- Usado por: [`MainViewSpotVsRegularVmComponent.tsx`](#components-azure-vista-funciones-spot-vs-regular-vm-mainviewspotvsregularvmcomponent-tsx)

---

<a id="components-azure-vista-funciones-spot-vs-regular-vm-grafico-spotvsregularvmtimelinecomponent-tsx"></a>
## `components/azure/vista-funciones/spot-vs-regular-vm/grafico/SpotVsRegularVmTimelineComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `SpotVsRegularVmTimelineComponent` `({ data }: SpotVsRegularVmTimelineComponentProps)`

Interfaz `SpotVsRegularVmTimelineComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `SpotVsRegularVm[]` | no | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`spotVsRegularVmInterfaces.ts`](../../tipos.md#interfaces-vista-spot-vs-regular-vm-spotvsregularvminterfaces-ts), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts), [`card.tsx`](../ui.md#components-ui-card-tsx)
- Usado por: [`SpotVsRegularVmComponent.tsx`](#components-azure-vista-funciones-spot-vs-regular-vm-spotvsregularvmcomponent-tsx)

---

<a id="components-azure-vista-funciones-spot-vs-regular-vm-info-spotvsregularvmcardscomponent-tsx"></a>
## `components/azure/vista-funciones/spot-vs-regular-vm/info/SpotVsRegularVmCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `SpotVsRegularVmCardsComponent` `({ data }: SpotVsRegularVmCardsComponentProps)`

Interfaz `SpotVsRegularVmCardsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `SpotVsRegularVm[]` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`spotVsRegularVmInterfaces.ts`](../../tipos.md#interfaces-vista-spot-vs-regular-vm-spotvsregularvminterfaces-ts)
- Usado por: [`SpotVsRegularVmComponent.tsx`](#components-azure-vista-funciones-spot-vs-regular-vm-spotvsregularvmcomponent-tsx)

---

<a id="components-azure-vista-funciones-spot-vs-regular-vm-table-spotvsregularvmcolumns-tsx"></a>
## `components/azure/vista-funciones/spot-vs-regular-vm/table/SpotVsRegularVmColumns.tsx`

**Módulo (cliente)**

Exporta:

- constante `SpotVsRegularVmColumns` = `[ { header: "Fecha Observación", accessorKey: "sync_time", cell: (info) => { co…`

Internos:

- componente `DateParams` `()`

- Hooks: `useSearchParams`
- Usa: [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`spotVsRegularVmInterfaces.ts`](../../tipos.md#interfaces-vista-spot-vs-regular-vm-spotvsregularvminterfaces-ts), [`filters.ts`](../../lib.md#lib-filters-ts)
- Usado por: [`SpotVsRegularVmTable.tsx`](#components-azure-vista-funciones-spot-vs-regular-vm-table-spotvsregularvmtable-tsx)

---

<a id="components-azure-vista-funciones-spot-vs-regular-vm-table-spotvsregularvmtable-tsx"></a>
## `components/azure/vista-funciones/spot-vs-regular-vm/table/SpotVsRegularVmTable.tsx`

**Componente**

Exporta:

- componente `SpotVsRegularVmTable` `({ data }: SpotVsRegularVmTableProps)`

Interfaz `SpotVsRegularVmTableProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `SpotVsRegularVm[]` | no | — |

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`spotVsRegularVmInterfaces.ts`](../../tipos.md#interfaces-vista-spot-vs-regular-vm-spotvsregularvminterfaces-ts), [`SpotVsRegularVmColumns.tsx`](#components-azure-vista-funciones-spot-vs-regular-vm-table-spotvsregularvmcolumns-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx)
- Usado por: [`SpotVsRegularVmComponent.tsx`](#components-azure-vista-funciones-spot-vs-regular-vm-spotvsregularvmcomponent-tsx)

---

<a id="components-azure-vista-funciones-top-10-recursos-uso-mainviewtop10recursosusocomponent-tsx"></a>
## `components/azure/vista-funciones/top-10-recursos-uso/MainViewTop10RecursosUsoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewTop10RecursosUsoComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`Top10RecursosUsoChartComponent.tsx`](#components-azure-vista-funciones-top-10-recursos-uso-top10recursosusochartcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-funciones-top-10-recursos-uso-page-tsx)

Notas de implementación:

- JSX — Header

---

<a id="components-azure-vista-funciones-top-10-recursos-uso-top10recursosusochartcomponent-tsx"></a>
## `components/azure/vista-funciones/top-10-recursos-uso/Top10RecursosUsoChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `Top10RecursosUsoChartComponent` `({ startDate, endDate, selectedMetric, selectedResourceType }: Top10RecursosUsoChartProps)`

Interfaz `Top10RecursoUso`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `vm_name` | `string` | no | — |
| `valor` | `number` | sí | Promedio de `metric_value` en la unidad de la métrica |
| `porcentaje_uso` | `number \| null` | no | Sólo para métricas en %; null en el resto |
| `porcentaje_no_uso` | `number \| null` | no | — |

Interfaz `Top10RecursosUsoResponse`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `es_porcentaje` | `boolean` | sí | — |
| `unidad` | `string` | sí | — |
| `top_10_mayor_uso` | `Top10RecursoUso[]` | sí | — |
| `top_10_menor_uso` | `Top10RecursoUso[]` | sí | — |
| `resumen` | `{ total_recursos_analizados: number recursos_uso_critico: number \| nu…` | sí | — |

Interfaz `Top10RecursosUsoChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `selectedMetric` | `string` | sí | — |
| `selectedResourceType` | `string` | sí | — |

- API: `/api/azure/bridge/azure/top-recursos-uso`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewTop10RecursosUsoComponent.tsx`](#components-azure-vista-funciones-top-10-recursos-uso-mainviewtop10recursosusocomponent-tsx)

Notas de implementación:

- Métricas en %: uso / disponible. Resto (bytes, GB, IOPS, créditos): el valor de la métrica en su unidad
- Pequeño timeout para asegurar que ambos charts estén inicializados
- Quitar resaltado de ambos gráficos
- Event listeners para sincronización
- Event listeners para sincronización
- JSX — Gráficos
- JSX — Cards de métricas
- JSX — Umbrales en %: sólo aplican a métricas en porcentaje

---

<a id="components-azure-vista-funciones-unused-apps-gateway-mainviewunusedappsgw-tsx"></a>
## `components/azure/vista-funciones/unused-apps-gateway/MainViewUnusedAppsGw.tsx`

**Componente**

Exporta:

- componente `MainViewUnusedAppsGw` `()`

- Usa: [`UnusedAppsGwComponent.tsx`](#components-azure-vista-funciones-unused-apps-gateway-unusedappsgwcomponent-tsx), [`UnusedLoadbalancersComponent.tsx`](#components-azure-vista-funciones-unused-loadbalancers-unusedloadbalancerscomponent-tsx), [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-funciones-apps-gateway-infrautilizados-page-tsx)

---

<a id="components-azure-vista-funciones-unused-apps-gateway-unusedappsgwcomponent-tsx"></a>
## `components/azure/vista-funciones/unused-apps-gateway/UnusedAppsGwComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedAppsGwComponent` `({ startDate, endDate, subscription, region, selectedUnusedAppG }: UnusedAppsGwComponentProps)` — Application Gateways infrautilizados: adapta los filtros de la vista al contrato canónico (/api/azure/unused/app-gateways/*).

Interfaz `UnusedAppsGwComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `subscription` | `string` | no | — |
| `region` | `string` | no | — |
| `selectedUnusedAppG` | `string` | sí | — |

Internos:

- función `isSet` `(value: string | null | undefined, allValue: string): value is string`

- Usa: [`UnusedView.tsx`](../shared.md#components-shared-unused-unusedview-tsx), [`unusedConfigs.ts`](../shared.md#components-shared-unused-unusedconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewUnusedAppsGw.tsx`](#components-azure-vista-funciones-unused-apps-gateway-mainviewunusedappsgw-tsx)

---

<a id="components-azure-vista-funciones-unused-apps-gateway-table-unusedappsgwcolumns-tsx"></a>
## `components/azure/vista-funciones/unused-apps-gateway/table/UnusedAppsGwColumns.tsx`

**Módulo (cliente)**

Asegúrate de importar el modal que creamos

Exporta:

- constante `UnusedAppsGwColumns` = `[ { header: "Nombre Gateway", accessorKey: "name", cell: ({ row, getValue }) =>…`

Internos:

- componente `DetailsCell` `({ appGw }: { appGw: UnusedAppGw })`
- componente `QueryParams` `()`

- Hooks: `useSearchParams`
- Usa: [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`filters.ts`](../../lib.md#lib-filters-ts)

---

<a id="components-azure-vista-funciones-unused-loadbalancers-mainviewunusedloadbalancers-tsx"></a>
## `components/azure/vista-funciones/unused-loadbalancers/MainViewUnusedLoadbalancers.tsx`

**Componente**

Exporta:

- componente `MainViewUnusedLoadbalancers` `()`

- Usa: [`UnusedLoadbalancersComponent.tsx`](#components-azure-vista-funciones-unused-loadbalancers-unusedloadbalancerscomponent-tsx), [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-funciones-loadbalancers-infrautilizados-page-tsx)

---

<a id="components-azure-vista-funciones-unused-loadbalancers-unusedloadbalancerscomponent-tsx"></a>
## `components/azure/vista-funciones/unused-loadbalancers/UnusedLoadbalancersComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedLoadbalancersComponent` `({ startDate, endDate, subscription, region, selectedUnusedLb }: UnusedLoadbalancersComponentProps)` — Load Balancers infrautilizados: adapta los filtros de la vista al contrato canónico (/api/azure/unused/load-balancers/*).

Interfaz `UnusedLoadbalancersComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `subscription` | `string` | no | — |
| `region` | `string` | no | — |
| `selectedUnusedLb` | `string` | sí | — |

Internos:

- función `isSet` `(value: string | null | undefined, allValue: string): value is string`

- Usa: [`UnusedView.tsx`](../shared.md#components-shared-unused-unusedview-tsx), [`unusedConfigs.ts`](../shared.md#components-shared-unused-unusedconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewUnusedAppsGw.tsx`](#components-azure-vista-funciones-unused-apps-gateway-mainviewunusedappsgw-tsx), [`MainViewUnusedLoadbalancers.tsx`](#components-azure-vista-funciones-unused-loadbalancers-mainviewunusedloadbalancers-tsx)

---

<a id="components-azure-vista-funciones-unused-resources-extensions-mainviewunusedvmextensionscomponent-tsx"></a>
## `components/azure/vista-funciones/unused-resources/extensions/MainViewUnusedVmExtensionsComponent.tsx`

**Componente**

Exporta:

- componente `MainViewUnusedVmExtensionsComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`UnusedVmExtensionsComponent.tsx`](#components-azure-vista-funciones-unused-resources-extensions-unusedvmextensionscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-funciones-unused-resources-extensions-page-tsx)

---

<a id="components-azure-vista-funciones-unused-resources-extensions-unusedvmextensionscomponent-tsx"></a>
## `components/azure/vista-funciones/unused-resources/extensions/UnusedVmExtensionsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedVmExtensionsComponent` `({ startDate, endDate, subscription, region, selectedVm }: UnusedVmExtensionsComponentProps)` — Extensiones de VMs: adapta los filtros de la vista al contrato canónico (/api/azure/unused/vm-extensions/*).

Interfaz `UnusedVmExtensionsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `subscription` | `string` | no | — |
| `region` | `string` | no | — |
| `selectedVm` | `string` | sí | — |

Internos:

- función `isSet` `(value: string | null | undefined, allValue: string): value is string`

- Usa: [`UnusedView.tsx`](../shared.md#components-shared-unused-unusedview-tsx), [`unusedConfigs.ts`](../shared.md#components-shared-unused-unusedconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewUnusedVmExtensionsComponent.tsx`](#components-azure-vista-funciones-unused-resources-extensions-mainviewunusedvmextensionscomponent-tsx)

---

<a id="components-azure-vista-funciones-unused-resources-extensions-table-unusedvmextensionscolumns-tsx"></a>
## `components/azure/vista-funciones/unused-resources/extensions/table/UnusedVmExtensionsColumns.tsx`

**Módulo (cliente)**

Exporta:

- constante `UnusedVmExtensionsColumns` = `[ { header: "Fecha Observación", accessorKey: "_cq_sync_time", cell: (info) => …`

Internos:

- componente `DateParams` `()`
- componente `ShortenedId` `({ id }: { id: string })`
- función `normalizeDisks` `(details: UnusedVmssDiskDetails[]): UnusedVmssDisksData[]`
- componente `ExtensionsCell` `({ details }: { details?: UnusedVmExtensionsData[] })`

- Hooks: `useSearchParams`
- Usa: [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`filters.ts`](../../lib.md#lib-filters-ts)

---

<a id="components-azure-vista-funciones-unused-resources-vm-mainviewunusedvmcomponent-tsx"></a>
## `components/azure/vista-funciones/unused-resources/vm/MainViewUnusedVmComponent.tsx`

**Componente**

Exporta:

- componente `MainViewUnusedVmComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`UnusedVmComponent.tsx`](#components-azure-vista-funciones-unused-resources-vm-unusedvmcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-funciones-unused-resources-vm-page-tsx)

---

<a id="components-azure-vista-funciones-unused-resources-vm-unusedvmcomponent-tsx"></a>
## `components/azure/vista-funciones/unused-resources/vm/UnusedVmComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedVmComponent` `({ startDate, endDate, subscription, region, selectedUnusedVm }: UnusedVmComponentProps)` — VMs infrautilizadas: adapta los filtros de la vista al contrato canónico (/api/azure/unused/vm/*).

Interfaz `UnusedVmComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `subscription` | `string` | no | — |
| `region` | `string` | no | — |
| `selectedUnusedVm` | `string` | no | — |

Internos:

- función `isSet` `(value: string | null | undefined, allValue: string): value is string`

- Usa: [`UnusedView.tsx`](../shared.md#components-shared-unused-unusedview-tsx), [`unusedConfigs.ts`](../shared.md#components-shared-unused-unusedconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewUnusedVmComponent.tsx`](#components-azure-vista-funciones-unused-resources-vm-mainviewunusedvmcomponent-tsx)

---

<a id="components-azure-vista-funciones-unused-resources-vm-table-unusedvmcolumns-tsx"></a>
## `components/azure/vista-funciones/unused-resources/vm/table/UnusedVmColumns.tsx`

**Módulo (cliente)**

Exporta:

- constante `UnusedVmColumns` = `[ { header: "Fecha Observación", accessorKey: "sync_time", cell: (info) => { co…`

Internos:

- componente `DateParams` `()`
- componente `ShortenedId` `({ id }: { id: string })`
- función `normalizeDisks` `(details: UnusedVmDiskDetails[]): UnusedVmDisksData[]`
- función `normalizeNics` `(details: UnusedVmInterfaceDetails[]): UnusedVmInterfaceData[]`
- componente `DisksCell` `({ details }: { details?: UnusedVmDiskDetails[] })`
- componente `InterfacesCell` `({ details }: { details?: UnusedVmInterfaceDetails })`

- Hooks: `useSearchParams`
- Usa: [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`filters.ts`](../../lib.md#lib-filters-ts)

Notas de implementación:

- _InterfacesCell_: JSX — NIC Header
- _InterfacesCell_: JSX — IP Configurations
- NUEVO: columnas de métricas FinOps

---

<a id="components-azure-vista-funciones-unused-resources-vmss-mainviewunusedvmsscomponent-tsx"></a>
## `components/azure/vista-funciones/unused-resources/vmss/MainViewUnusedVmssComponent.tsx`

**Componente**

Exporta:

- componente `MainViewUnusedVmssComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`UnusedVmssComponent.tsx`](#components-azure-vista-funciones-unused-resources-vmss-unusedvmsscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-funciones-unused-resources-vmss-page-tsx)

---

<a id="components-azure-vista-funciones-unused-resources-vmss-unusedvmsscomponent-tsx"></a>
## `components/azure/vista-funciones/unused-resources/vmss/UnusedVmssComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedVmssComponent` `({ startDate, endDate, subscription, region, selectedUnusedVmss }: UnusedVmssComponentProps)` — VMSS infrautilizadas: adapta los filtros de la vista al contrato canónico (/api/azure/unused/vmss/*).

Interfaz `UnusedVmssComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `subscription` | `string` | no | — |
| `region` | `string` | no | — |
| `selectedUnusedVmss` | `string` | no | — |

Internos:

- función `isSet` `(value: string | null | undefined, allValue: string): value is string`

- Usa: [`UnusedView.tsx`](../shared.md#components-shared-unused-unusedview-tsx), [`unusedConfigs.ts`](../shared.md#components-shared-unused-unusedconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewUnusedVmssComponent.tsx`](#components-azure-vista-funciones-unused-resources-vmss-mainviewunusedvmsscomponent-tsx)

---

<a id="components-azure-vista-funciones-unused-resources-vmss-table-unusedvmsscolumns-tsx"></a>
## `components/azure/vista-funciones/unused-resources/vmss/table/UnusedVmssColumns.tsx`

**Módulo (cliente)**

Exporta:

- constante `UnusedVmssColumns` = `[ { header: "Fecha Observación", accessorKey: "sync_time", cell: (info) => { co…`

Internos:

- componente `DateParams` `()`
- componente `ShortenedId` `({ id }: { id: string })`
- función `normalizeDisks` `(details: UnusedVmssDiskDetails[]): UnusedVmssDisksData[]`
- función `normalizeNics` `(details: UnusedVmssInterfaceDetails[]): UnusedVmssInterfaceData[]`
- componente `DisksCell` `({ details }: { details?: UnusedVmssDiskDetails[] })`
- componente `InterfacesCell` `({ details }: { details?: UnusedVmssInterfaceDetails })`

- Hooks: `useSearchParams`
- Usa: [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`filters.ts`](../../lib.md#lib-filters-ts)

Notas de implementación:

- NUEVO: columnas de métricas FinOps

---

<a id="components-azure-vista-funciones-unused-traffic-managers-mainviewunusedtrafficmanagercomponent-tsx"></a>
## `components/azure/vista-funciones/unused-traffic-managers/MainViewUnusedTrafficManagerComponent.tsx`

**Componente**

Exporta:

- componente `MainViewUnusedTrafficManagerComponent` `()`

- Usa: [`UnusedTrafficManagerComponent.tsx`](#components-azure-vista-funciones-unused-traffic-managers-unusedtrafficmanagercomponent-tsx), [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`UnusedTrafficManagerFilter.tsx`](../general_azure.md#components-general-azure-filters-unusedtrafficmanagerfilter-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-funciones-traffic-managers-infrautilizados-page-tsx)

---

<a id="components-azure-vista-funciones-unused-traffic-managers-unusedtrafficmanagercomponent-tsx"></a>
## `components/azure/vista-funciones/unused-traffic-managers/UnusedTrafficManagerComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `UnusedTrafficManagerComponent` `({ startDate, endDate, subscription, region, selectedUnusedTm }: UnusedTrafficManagerComponentProps)` — Traffic Managers infrautilizados: adapta los filtros de la vista al contrato canónico (/api/azure/unused/traffic-managers/*).

Interfaz `UnusedTrafficManagerComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `subscription` | `string` | no | — |
| `region` | `string` | no | — |
| `selectedUnusedTm` | `string` | sí | — |

Internos:

- función `isSet` `(value: string | null | undefined, allValue: string): value is string`

- Usa: [`UnusedView.tsx`](../shared.md#components-shared-unused-unusedview-tsx), [`unusedConfigs.ts`](../shared.md#components-shared-unused-unusedconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewUnusedTrafficManagerComponent.tsx`](#components-azure-vista-funciones-unused-traffic-managers-mainviewunusedtrafficmanagercomponent-tsx)

---

<a id="components-azure-vista-funciones-unused-traffic-managers-table-unusedtrafficmanagercolumns-tsx"></a>
## `components/azure/vista-funciones/unused-traffic-managers/table/UnusedTrafficManagerColumns.tsx`

**Módulo (cliente)**

Exporta:

- constante `UnusedTrafficManagerColumns` = `[ { header: "Nombre Traffic Manager", accessorKey: "name", cell: ({ row, getVal…`

Internos:

- componente `DetailsCell` `({ tm }: { tm: UnusedTm })`
- componente `QueryParams` `()`

- Hooks: `useSearchParams`
- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`filters.ts`](../../lib.md#lib-filters-ts)

---

<a id="components-azure-vista-funciones-variacion-storage-mainviewstoragevariationcomponent-tsx"></a>
## `components/azure/vista-funciones/variacion-storage/MainViewStorageVariationComponent.tsx`

**Componente**

Exporta:

- componente `MainViewStorageVariationComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`StorageVariationComponent.tsx`](#components-azure-vista-funciones-variacion-storage-storagevariationcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-funciones-variacion-storage-page-tsx)

---

<a id="components-azure-vista-funciones-variacion-storage-storagevariationcomponent-tsx"></a>
## `components/azure/vista-funciones/variacion-storage/StorageVariationComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `StorageVariationComponent` `({ selectedStrgAccount, subscription, region, year, month }: StorageVariationComponentProps)`

Interfaz `StorageVariationComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `selectedStrgAccount` | `string` | no | — |
| `subscription` | `string` | no | — |
| `region` | `string` | no | — |
| `year` | `number \| null` | no | — |
| `month` | `number \| null` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`
- función `isNullish` `(v: unknown)`

- API: `/api/azure/bridge/azure/storage/storage-variations`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx), [`variationStorageInterfaces.ts`](../../tipos.md#interfaces-vista-variacion-storage-variationstorageinterfaces-ts), [`StorageVariationCardsComponent.tsx`](#components-azure-vista-funciones-variacion-storage-info-storagevariationcardscomponent-tsx), [`StorageVariationCapacitiesComponent.tsx`](#components-azure-vista-funciones-variacion-storage-graficos-storagevariationcapacitiescomponent-tsx)
- Usado por: [`MainViewStorageVariationComponent.tsx`](#components-azure-vista-funciones-variacion-storage-mainviewstoragevariationcomponent-tsx)

---

<a id="components-azure-vista-funciones-variacion-storage-graficos-storagevariationcapacitiescomponent-tsx"></a>
## `components/azure/vista-funciones/variacion-storage/graficos/StorageVariationCapacitiesComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `StorageVariationCapacitiesProps`
- componente `StorageVariationCapacitiesComponent` `({ blob, table, queue, file, storage, unitLabel = 'GB', height = 420, title = 'Capacidades por Servicio vs Storage Account', }: StorageVariationCapacitiesProps)`

Interfaz `StorageVariationCapacitiesProps` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `blob` | `StorageVariationsRangesMetrics[]` | no | — |
| `table` | `StorageVariationsRangesMetrics[]` | no | — |
| `queue` | `StorageVariationsRangesMetrics[]` | no | — |
| `file` | `StorageVariationsRangesMetrics[]` | no | — |
| `storage` | `StorageVariationsRangesMetrics[]` | no | — |
| `unitLabel` | `string` | sí | — |
| `height` | `number` | sí | — |
| `title` | `string` | sí | — |

- Tipo interno `SeriesTuple` = `[string, number]`
- Tipo interno `SeriesKey` = `'blob' | 'table' | 'queue' | 'file' | 'storage'`
Internos:

- constante `SERIES_CONFIG`
- constante `sliderConfig`
- función `toSeriesPairs` `(arr: StorageVariationsRangesMetrics[]): SeriesTuple[]`
- función `createSeries` `(name: string, data: SeriesTuple[], color: string, areaColor?: string): AnySeriesDef`

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`variationStorageInterfaces.ts`](../../tipos.md#interfaces-vista-variacion-storage-variationstorageinterfaces-ts), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`StorageVariationComponent.tsx`](#components-azure-vista-funciones-variacion-storage-storagevariationcomponent-tsx)

---

<a id="components-azure-vista-funciones-variacion-storage-info-storagevariationcardscomponent-tsx"></a>
## `components/azure/vista-funciones/variacion-storage/info/StorageVariationCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `StorageVariationCardsComponent` `({ strgVariationData, }: StorageVariationCardsComponentProps)`

Interfaz `StorageVariationCardsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `strgVariationData` | `StorageVariation[]` | no | — |

Internos:

- función `fmtNumber` `(n: number | null | undefined)`
- función `fmtPercent` `(n: number | null | undefined)`
- función `fmtGB` `(n: number | null | undefined)`
- constante `esLabelMap`
- función `toEsLabel` `(key: string)`
- componente `Trend` `({ value }: { value: number | null | undefined })`
- componente `RangeExtras` `({ label, range }: { label: string; range?: StorageVariationRanges })`
- constante `accentByService`
- función `serviceLabel` `(key: string)`

- Usa: [`variationStorageInterfaces.ts`](../../tipos.md#interfaces-vista-variacion-storage-variationstorageinterfaces-ts), [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`bytesToMbs.ts`](../../lib.md#lib-bytestombs-ts), [`format.ts`](../../lib.md#lib-format-ts)
- Usado por: [`StorageVariationComponent.tsx`](#components-azure-vista-funciones-variacion-storage-storagevariationcomponent-tsx)

