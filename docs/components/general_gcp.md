# Componentes `components/general_gcp/`

[← Índice](../README.md)

Filtros de GCP (proyectos, regiones, servicios, recursos, etiquetas, Vertex, …), el loader y el modal de historial.

Archivos:

- [`components/general_gcp/LoaderComponent.tsx`](#components-general-gcp-loadercomponent-tsx)
- [`components/general_gcp/filters/DatabaseTypeFilterComponent.tsx`](#components-general-gcp-filters-databasetypefiltercomponent-tsx)
- [`components/general_gcp/filters/EsquemaFilterComponent.tsx`](#components-general-gcp-filters-esquemafiltercomponent-tsx)
- [`components/general_gcp/filters/EstadoUsoFilterComponent.tsx`](#components-general-gcp-filters-estadousofiltercomponent-tsx)
- [`components/general_gcp/filters/FilestoreTierFilterComponent.tsx`](#components-general-gcp-filters-filestoretierfiltercomponent-tsx)
- [`components/general_gcp/filters/FiltersComponent.tsx`](#components-general-gcp-filters-filterscomponent-tsx)
- [`components/general_gcp/filters/ProjectsFilterComponent.tsx`](#components-general-gcp-filters-projectsfiltercomponent-tsx)
- [`components/general_gcp/filters/RecommenderCategoriesFilterComponent.tsx`](#components-general-gcp-filters-recommendercategoriesfiltercomponent-tsx)
- [`components/general_gcp/filters/RecommenderPriorityFilterComponent.tsx`](#components-general-gcp-filters-recommenderpriorityfiltercomponent-tsx)
- [`components/general_gcp/filters/RegionsFilterComponent.tsx`](#components-general-gcp-filters-regionsfiltercomponent-tsx)
- [`components/general_gcp/filters/ResourcesFilterComponent.tsx`](#components-general-gcp-filters-resourcesfiltercomponent-tsx)
- [`components/general_gcp/filters/ServiceFilterComponent.tsx`](#components-general-gcp-filters-servicefiltercomponent-tsx)
- [`components/general_gcp/filters/StorageClassFilterComponent.tsx`](#components-general-gcp-filters-storageclassfiltercomponent-tsx)
- [`components/general_gcp/filters/TagsFilterComponent.tsx`](#components-general-gcp-filters-tagsfiltercomponent-tsx)
- [`components/general_gcp/filters/VertexModelsFilterComponent.tsx`](#components-general-gcp-filters-vertexmodelsfiltercomponent-tsx)
- [`components/general_gcp/modal/HistoryModal.tsx`](#components-general-gcp-modal-historymodal-tsx)

<a id="components-general-gcp-loadercomponent-tsx"></a>
## `components/general_gcp/LoaderComponent.tsx`

**Componente**

Exporta:

- componente `LoaderComponent` `({ size = 'large' }: LoaderComponentProps)`

Interfaz `LoaderComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `size` | `'small' \| 'large'` | no | — |

- Usado por: [`TaggedResourcesComponent.tsx`](aws/vista-tags.md#components-aws-vista-tags-taggedresourcescomponent-tsx), [`AzureMysqlResourceComponent.tsx`](azure/vista-recursos-mysql.md#components-azure-vista-recursos-mysql-azuremysqlresourcecomponent-tsx), [`AzureNodeResourceComponent.tsx`](azure/vista-recursos-nodos.md#components-azure-vista-recursos-nodos-azurenoderesourcecomponent-tsx), [`AzurePostgresResourceComponent.tsx`](azure/vista-recursos-postgresql.md#components-azure-vista-recursos-postgresql-azurepostgresresourcecomponent-tsx), [`AzureVmResourceComponent.tsx`](azure/vista-recursos-vm.md#components-azure-vista-recursos-vm-azurevmresourcecomponent-tsx), [`TaggedResourcesComponent.tsx`](azure/vista-tags.md#components-azure-vista-tags-taggedresourcescomponent-tsx), [`SavingPlansComponent.tsx`](gcp/vista-cuds.md#components-gcp-vista-cuds-resource-based-cuds-savingplanscomponent-tsx), [`SpendBasedCudsComponent.tsx`](gcp/vista-cuds.md#components-gcp-vista-cuds-spend-based-cuds-spendbasedcudscomponent-tsx), [`UsedCostLocationComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-uso-costo-por-localizacion-usedcostlocationcomponent-tsx), [`RecommenderComponent.tsx`](gcp/vista-recommender.md#components-gcp-vista-recommender-recommendercomponent-tsx), [`CloudSqlComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-cloudsql-cloudsqlcomponent-tsx), [`GkeChartComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-grafico-gkechartcomponent-tsx), [`GkeMetricsCardComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-info-gkemetricscardcomponent-tsx), [`GkeBillingComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-table-gkebillingcomponent-tsx), [`ComputeEngineComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-computeenginecomponent-tsx), [`InstanceGroupsComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-instancegroupscomponent-tsx), [`InstanceGroupChartComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-grafico-instancegroupchartcomponent-tsx), [`InstanceGroupsMetricsCardsComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-info-instancegroupsmetricscardscomponent-tsx), [`InstanceGroupsBillingComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-table-instancegroupsbillingcomponent-tsx), [`ReservationsComponent.tsx`](gcp/vista-reservas.md#components-gcp-vista-reservas-reservationscomponent-tsx), [`TaggedResourcesComponent.tsx`](gcp/vista-tags.md#components-gcp-vista-tags-taggedresourcescomponent-tsx), [`ProjectsFilterComponent.tsx`](#components-general-gcp-filters-projectsfiltercomponent-tsx)

---

<a id="components-general-gcp-filters-databasetypefiltercomponent-tsx"></a>
## `components/general_gcp/filters/DatabaseTypeFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `DatabaseTypeFilterComponent` `({ databaseType, setDatabaseType }: DatabaseTypeFilterProps)`

Interfaz `DatabaseTypeFilterProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `databaseType` | `string` | no | — |
| `setDatabaseType` | `(type: string) => void` | no | — |

Internos:

- constante `DB_TYPES`

- Usa: [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-gcp-filters-filterscomponent-tsx)

---

<a id="components-general-gcp-filters-esquemafiltercomponent-tsx"></a>
## `components/general_gcp/filters/EsquemaFilterComponent.tsx`

**Componente**

Exporta:

- componente `EsquemaFilterComponent` `({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void })` — Exportación nombrada (con 'export const') para que coincida con tus llaves en el maestro

- Usado por: [`FiltersComponent.tsx`](#components-general-gcp-filters-filterscomponent-tsx)

Notas de implementación:

- Solo devuelve el select puro. El label y el estado lo maneja FiltersComponent.tsx

---

<a id="components-general-gcp-filters-estadousofiltercomponent-tsx"></a>
## `components/general_gcp/filters/EstadoUsoFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `EstadoUsoFilterComponent` `({ estadoUso, setEstadoUso }: EstadoUsoFilterProps)`

Interfaz `EstadoUsoFilterProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `estadoUso` | `string` | no | — |
| `setEstadoUso` | `(type: string) => void` | no | — |

Internos:

- constante `ESTADO_USO_OPTIONS`

- Usa: [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-gcp-filters-filterscomponent-tsx)

---

<a id="components-general-gcp-filters-filestoretierfiltercomponent-tsx"></a>
## `components/general_gcp/filters/FilestoreTierFilterComponent.tsx`

**Componente (cliente)**

Usaremos Layers como icono sugerido

Exporta:

- componente `FilestoreTierFilterComponent` `({ tier, setTier }: FilestoreTierFilterProps)`

Interfaz `FilestoreTierFilterProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `tier` | `string` | no | — |
| `setTier` | `(tier: string) => void` | no | — |

Internos:

- constante `FILESTORE_TIER_OPTIONS`

- Usa: [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-gcp-filters-filterscomponent-tsx)

---

<a id="components-general-gcp-filters-filterscomponent-tsx"></a>
## `components/general_gcp/filters/FiltersComponent.tsx`

**Componente (cliente)**

Agregamos Tag icon

Exporta:

- componente `FiltersComponent` `({ Component, dateFilter = true, projectsFilter = false, regionFilter = false, resourceFilter = false, tagsFilter = false, // Por defecto apagado resourceServi…`

Interfaz `FiltersComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `Component` | `(params: { startDate: Date; endDate?: Date; projects: string; regions…` | no | — |
| `dateFilter` | `boolean` | sí | Flags de activación |
| `projectsFilter` | `boolean` | sí | — |
| `regionFilter` | `boolean` | sí | — |
| `resourceFilter` | `boolean` | sí | — |
| `isResourceMultiSelect` | `boolean` | sí | — |
| `tagsFilter` | `boolean` | sí | — |
| `databaseTypeFilter` | `boolean` | sí | — |
| `estadoUsoFilter` | `boolean` | sí | — |
| `filestoreTierFilter` | `boolean` | sí | — |
| `esquemaFilter` | `boolean` | sí | — |
| `serviceFilter` | `boolean` | sí | — |
| `isServiceMultiSelect` | `boolean` | sí | — |
| `resourceService` | `string` | sí | Config extra |
| `tagResourceType` | `string` | sí | Tipo de recurso lógico para buscar tags (ej: compute_disks); obligatorio si tagsFilter es true |
| `localService` | `string` | sí | NUEVO: Nombre del servicio para filtrar tags (ej: Compute Engine, Cloud SQL, etc) |
| `dbEngine` | `string` | sí | — |
| `storageClassFilter` | `boolean` | sí | — |
| `categoryFilter` | `boolean` | sí | — |
| `priorityFilter` | `boolean` | sí | — |
| `category` | `string` | sí | — |
| `priority` | `string` | sí | — |
| `isRecommenderCategoryMultiSelect` | `boolean` | sí | — |
| `isRecommenderPriorityMultiSelect` | `boolean` | sí | — |
| `cloud` | `string` | no | — |
| `vertexModelFilter` | `boolean` | sí | — |

- Hooks: `useRouter`, `useSearchParams`
- Usa: [`BaseFiltersComponent.tsx`](shared.md#components-shared-filters-basefilterscomponent-tsx), [`filters.ts`](../lib.md#lib-filters-ts), [`ProjectsFilterComponent.tsx`](#components-general-gcp-filters-projectsfiltercomponent-tsx), [`RegionsFilterComponent.tsx`](#components-general-gcp-filters-regionsfiltercomponent-tsx), [`ResourcesFilterComponent.tsx`](#components-general-gcp-filters-resourcesfiltercomponent-tsx), [`TagsFilterComponent.tsx`](#components-general-gcp-filters-tagsfiltercomponent-tsx), [`DatabaseTypeFilterComponent.tsx`](#components-general-gcp-filters-databasetypefiltercomponent-tsx), [`EstadoUsoFilterComponent.tsx`](#components-general-gcp-filters-estadousofiltercomponent-tsx), [`FilestoreTierFilterComponent.tsx`](#components-general-gcp-filters-filestoretierfiltercomponent-tsx), [`EsquemaFilterComponent.tsx`](#components-general-gcp-filters-esquemafiltercomponent-tsx), [`StorageClassFilterComponent.tsx`](#components-general-gcp-filters-storageclassfiltercomponent-tsx), [`ServiceFilterComponent.tsx`](#components-general-gcp-filters-servicefiltercomponent-tsx), [`RecommenderCategoriesFilterComponent.tsx`](#components-general-gcp-filters-recommendercategoriesfiltercomponent-tsx), [`RecommenderPriorityFilterComponent.tsx`](#components-general-gcp-filters-recommenderpriorityfiltercomponent-tsx), [`VertexModelsFilterComponent.tsx`](#components-general-gcp-filters-vertexmodelsfiltercomponent-tsx)
- Usado por: [`MainViewAiFinopsMetricsComponent.tsx`](ai-finops-metrics.md#components-ai-finops-metrics-mainviewaifinopsmetricscomponent-tsx), [`MainViewAiRecommendationStatusesComponent.tsx`](ai-recommendation-statuses.md#components-ai-recommendation-statuses-mainviewairecommendationstatusescomponent-tsx), [`MainViewCloudSQLComponent.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-cloud-sql-mainviewcloudsqlcomponent-tsx), [`MainViewClusterGkeConsumeComponent.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-clusters-gke-mainviewclustergkeconsumecomponent-tsx), [`MainViewComputeEngineConsumeComponent.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-compute-engine-mainviewcomputeengineconsumecomponent-tsx), [`MainViewZonasDNSComponent.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-dns-zonas-consumo-estado-mainviewzonasdnscomponent-tsx), [`MainViewFilestoreConsumeComponent.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-filestore-mainviewfilestoreconsumecomponent-tsx), [`MainViewInstanceGroupConsumeComponent.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-instance-groups-mainviewinstancegroupconsumecomponent-tsx), [`MainViewLoadBalancersComponent.tsx`](gcp/vista-consumos.md#components-gcp-vista-consumos-load-balancers-consumo-uso-mainviewloadbalancerscomponent-tsx), [`MainViewSavingPlansComponent.tsx`](gcp/vista-cuds.md#components-gcp-vista-cuds-resource-based-cuds-mainviewsavingplanscomponent-tsx), [`MainViewSpendBasedCudsComponent.tsx`](gcp/vista-cuds.md#components-gcp-vista-cuds-spend-based-cuds-mainviewspendbasedcudscomponent-tsx), [`MainViewTendenciaFacturacionComponent.tsx`](gcp/vista-facturacion.md#components-gcp-vista-facturacion-tendencia-facturacion-mainviewtendenciafacturacioncomponent-tsx), [`MainViewCloudSqlWorkingNonWorkingHoursComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-cloud-sql-mainviewcloudsqlworkingnonworkinghourscomponent-tsx), [`MainViewGkeWorkingNonWorkingHoursComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-cluster-gke-mainviewgkeworkingnonworkinghourscomponent-tsx), [`MainViewCeWorkingNonWorkingHoursComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-compute-engine-mainviewceworkingnonworkinghourscomponent-tsx), [`MainViewFilestoreWorkingHoursComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-filestore-mainviewfilestoreworkinghourscomponent-tsx), [`MainViewIgWorkingNonWorkingHoursComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-instance-group-mainviewigworkingnonworkinghourscomponent-tsx), [`MainViewIPsSinUsoComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-networking-ips-sin-uso-mainviewipssinusocomponent-tsx), [`MainViewSubnetsSinRecursosComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-networking-subnets-sin-recursos-mainviewsubnetssinrecursoscomponent-tsx), [`MainViewSpotVsStandardComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-spot-vs-standard-mainviewspotvsstandardcomponent-tsx), [`TopFacturacionPorRegionComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-top-facturacion-region-topfacturacionporregioncomponent-tsx), [`MainViewTopFilestoreSubUtilizadoComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-top-filestore-sub-utilizado-mainviewtopfilestoresubutilizadocomponent-tsx), [`MainViewTopStorageBucketsComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-top-storage-buckets-mainviewtopstoragebucketscomponent-tsx), [`MainViewUsedCostLocationComponent.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-uso-costo-por-localizacion-mainviewusedcostlocationcomponent-tsx), [`MainViewHeatmapQuotasComponent.tsx`](gcp/vista-heatmap-quotas.md#components-gcp-vista-heatmap-quotas-mainviewheatmapquotascomponent-tsx), [`MainViewRecommenderComponent.tsx`](gcp/vista-recommender.md#components-gcp-vista-recommender-mainviewrecommendercomponent-tsx), [`MainViewCloudSqlComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-cloudsql-mainviewcloudsqlcomponent-tsx), [`MainViewGkeComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-mainviewgkecomponent-tsx), [`MainViewComputeEngineComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-mainviewcomputeenginecomponent-tsx), [`MainViewInstanceGroupsComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-mainviewinstancegroupscomponent-tsx), [`MainViewUnusedGkeComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-clusters-gke-mainviewunusedgkecomponent-tsx), [`MainViewUnusedCeComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-compute-engine-mainviewunusedcecomponent-tsx), [`MainViewDiscosPersistentesComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-discos-persistentes-mainviewdiscospersistentescomponent-tsx), [`MainViewFilestoreSinUsoComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-filestore-mainviewfilestoresinusocomponent-tsx), [`MainViewUnusedIgComponent.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-instance-groups-mainviewunusedigcomponent-tsx), [`MainViewReservationsComponent.tsx`](gcp/vista-reservas.md#components-gcp-vista-reservas-mainviewreservationscomponent-tsx), [`MainViewTaggedResourcesComponent.tsx`](gcp/vista-tags.md#components-gcp-vista-tags-mainviewtaggedresourcescomponent-tsx), [`MainViewGcpVertexComparisonComponent.tsx`](google-vertex.md#components-google-vertex-comparacion-mainviewgcpvertexcomparisoncomponent-tsx), [`MainViewCOGcpVertexComponent.tsx`](google-vertex.md#components-google-vertex-costo-optimizacion-vertex-models-mainviewcogcpvertexcomponent-tsx)

Notas de implementación:

- _FiltersComponentProps_: Nuevos params para el hijo
- _FiltersComponentProps_: Filtros comunes a las 3 nubes (F-06).
- `tagsFilter = false,` — Por defecto apagado
- Nuevos params de URL
- Estados temporales
- Estados temporales para Tags
- Guardar tags en URL si existen
- JSX — 2. PROYECTOS
- JSX — 3. REGIONES
- JSX — 4. TAGS (NUEVO)
- JSX — 5. RECURSOS (Discos, etc)
- JSX — 6. TIPO BD
- JSX — 7. ESTADO DE USO (DNS)
- JSX — 8. FILESTORE TIER
- JSX — 9. ESQUEMA DE BALANCEO
- JSX — Usa un ícono de Lucide como Network, GitMerge o Server
- JSX — 10. CLASE STORAGE
- JSX — 11. SERVICIOS GCP

---

<a id="components-general-gcp-filters-projectsfiltercomponent-tsx"></a>
## `components/general_gcp/filters/ProjectsFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ProjectsFilterComponent` `({ projects, setProjects, }: ProjectsFilterComponentProps)`

Interfaz `ProjectsFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `projects` | `string` | no | — |
| `setProjects` | `Dispatch<SetStateAction<string>>` | no | — |

Interfaz `ApiGcpProject`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `project_id` | `string` | no | — |
| `project_name` | `string` | no | — |

- API: `/api/gcp/bridge/gcp/general/all-gcp-projects-ids`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-gcp-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-gcp-filters-filterscomponent-tsx)

---

<a id="components-general-gcp-filters-recommendercategoriesfiltercomponent-tsx"></a>
## `components/general_gcp/filters/RecommenderCategoriesFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RecommenderCategoriesFilterComponent` `({ isRecommenderCategoryMultiSelect, category, setCategory, }: RecommenderCategoriesFilterComponentProps)`

Interfaz `RecommenderCategoriesFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `category` | `string` | no | — |
| `setCategory` | `Dispatch<SetStateAction<string>>` | no | — |
| `isRecommenderCategoryMultiSelect` | `boolean` | no | — |

- Usa: [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`gcp_recommender_categories.ts`](../lib.md#lib-gcp-recommender-categories-ts)
- Usado por: [`FiltersComponent.tsx`](#components-general-gcp-filters-filterscomponent-tsx)

---

<a id="components-general-gcp-filters-recommenderpriorityfiltercomponent-tsx"></a>
## `components/general_gcp/filters/RecommenderPriorityFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RecommenderPriorityFilterComponent` `({ priority, setPriority, isRecommenderPriorityMultiSelect }: RecommenderPriorityFilterComponentProps)`

Interfaz `RecommenderPriorityFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `priority` | `string` | no | — |
| `setPriority` | `Dispatch<SetStateAction<string>>` | no | — |
| `isRecommenderPriorityMultiSelect` | `boolean` | no | — |

- Usa: [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`gcp_recommender_priorities.ts`](../lib.md#lib-gcp-recommender-priorities-ts)
- Usado por: [`FiltersComponent.tsx`](#components-general-gcp-filters-filterscomponent-tsx)

---

<a id="components-general-gcp-filters-regionsfiltercomponent-tsx"></a>
## `components/general_gcp/filters/RegionsFilterComponent.tsx`

**Componente (cliente)**

Importamos la lista que acabamos de crear

Exporta:

- componente `RegionsFilterComponent` `({ regions, setRegions, }: RegionsFilterComponentProps)`

Interfaz `RegionsFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `regions` | `string` | no | Mantengo los nombres de props que usa tu padre (FiltersComponent) |
| `setRegions` | `Dispatch<SetStateAction<string>>` | no | — |

- Usa: [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`gcp_regions.ts`](../lib.md#lib-gcp-regions-ts)
- Usado por: [`FilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-filtercomponent-tsx), [`FiltersComponent.tsx`](#components-general-gcp-filters-filterscomponent-tsx)

Notas de implementación:

- Auto-seleccionar "Todas" si viene vacío al inicio
- Si selecciono una específica, quito "all_regions"
- Si ya estaba, la quito (toggle off)
- Si no estaba, la agrego (toggle on)
- Si me quedé sin nada, vuelvo a 'all_regions' por defecto
- JSX — 1. Opción Manual "Todas las Regiones" (Déjala tal cual)
- JSX — 2. Lista filtrada (Aquí es donde agregamos el .filter)
- `.filter((r) => r.value !== 'all_regions')` — <--- ESTA ES LA LÍNEA MÁGICA

---

<a id="components-general-gcp-filters-resourcesfiltercomponent-tsx"></a>
## `components/general_gcp/filters/ResourcesFilterComponent.tsx`

**Componente (cliente)**

switch (service) {
case 'vertex-endpoints': {
const vertexParams = new URLSearchParams({
project_id: projects || 'all_projects',
region: regions,
});
return `${baseUrl}/vertex/gcp_vertex_endpoints?${vertexParams.toString()}`;
}
case 'disks': return `${baseUrl}/recursos_sin_uso/all_persistent_disks?${baseParams}`;
case 'instances': return `${baseUrl}/instancias_compute_engine/all_compute_engine_instances?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}`;
case 'unused-instances': return `${baseUrl}/recursos_sin_uso/all_unused_compute_engines?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}`;
case 'instance_groups': return `${baseUrl}/instance_groups/all_instance_groups?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}`;
case 'filestore': return `${baseUrl}/instancias_filestore/all_filestore?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}`;
case 'clusters-gke': return `${baseUrl}/gke_clusters/all_gke_clusters?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}`;
case 'postgres': return `${baseUrl}/instancias_cloud_sql/all_cloudsql_instances?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}&db_engine=postgres`;
case 'mysql': return `${baseUrl}/instancias_cloud_sql/all_cloudsql_instances?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}&db_engine=mysql`;
case 'sqlserver': return `${baseUrl}/instancias_cloud_sql/all_cloudsql_instances?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}&db_engine=sqlserver`;
default: return null;
}
}

// 5. Efecto de carga inicial (Corregido para no pisar la acción de limpiar del usuario)
useEffect(() => {
if (isLoading || !hasData) return;

// Solo forzamos la selección de 'todos' si NO hay nada seleccionado Y
// acabamos de cargar datos nuevos (cambio de región o servicio).
// Usamos allIdsString como dependencia clave para detectar cambio de contexto.
if (resourceId === '') {
setResourceId(allIdsString);
}
}, [allIdsString, hasData, isLoading, setResourceId]);
// NOTA: Quitamos 'resourceId' de dependencias para evitar loop infinito al deseleccionar manual.

{/* Opcional: Mostrar conteo parcial */}
{isIndeterminate && (
<span className="ml-auto text-xs text-muted-foreground">
{selectedIds.length} / {allResources.length}
</span>
)}
</CommandItem>

Importante para la UX

Helpers

Exporta:

- componente `ResourcesFilterComponent` `({ service, resourceId, setResourceId, startDate, endDate, projects, regions,tagKey, tagValue, isResourceMultiSelect }: ResourcesFilterComponentProps)`

Interfaz `ResourcesFilterComponentProps` — Tipos:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `service` | `string` | no | — |
| `resourceId` | `string` | no | — |
| `setResourceId` | `Dispatch<SetStateAction<string>>` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `projects` | `string` | no | — |
| `regions` | `string` | no | — |
| `tagKey` | `string` | no | — |
| `tagValue` | `string` | no | — |
| `isResourceMultiSelect` | `boolean` | no | — |

Interfaz `VertexEndpointItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `endpoint_id` | `string` | no | — |
| `endpoint_short_id` | `string` | sí | — |
| `endpoint_name` | `string` | sí | — |

Interfaz `ResourceItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource_id` | `string` | no | — |
| `resource_name` | `string` | no | — |

Internos:

- función `getUrlForService` `(service: string, params: { startDate: string, endDate: string, projects: string, regions: string, tagKey: string, tagV…` — Función auxiliar para limpiar el switch gigante del componente principal

- API: `/api/gcp/bridge/gcp`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-gcp-filters-filterscomponent-tsx)

Notas de implementación:

- _getUrlForService_: `if (!regions) return null;` — Si no hay región, no hacemos fetch (comportamiento original)
- 1. Preparación de parámetros para URL
- 2. Data Fetching
- 3. Procesamiento de recursos
- Manejo si la API devuelve array de strings o de objetos
- IDs seleccionados convertidos a Array para facilitar manipulación
- Booleanos de estado de selección
- 4. Mapa para mostrar nombres bonitos en el botón
- 5. Efecto de carga inicial (Corregido para no pisar la acción de limpiar del usuario)
- Solo forzamos la selección de 'todos' si NO hay nada seleccionado Y acabamos de cargar datos nuevos (cambio de región o servicio). Usamos allIdsString como dependencia clave para detectar cambio de contexto.
- NOTA: Quitamos 'resourceId' de dependencias para evitar loop infinito al deseleccionar manual.
- 6. Handlers de Selección
- Si todo está seleccionado, desmarcamos todo
- Si hay 0 o algunos seleccionados, marcamos todo
- 7. Texto del botón
- Si el nombre es igual al ID, solo mostramos uno
- Renderizado condicional del contenido del Popover
- JSX — Opción Maestra: Seleccionar Todo
- `value="all-resources-toggle"` — Valor único que no choque con IDs reales
- JSX — Opcional: Mostrar conteo parcial
- JSX — Lista de Items
- `value={`${item.resource_id} ${item.resource_name}`}` — Truco para buscar por ID o Nombre

---

<a id="components-general-gcp-filters-servicefiltercomponent-tsx"></a>
## `components/general_gcp/filters/ServiceFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ServiceFilterComponent` `({ selectedService, setSelectedService, isServiceMultiselect, }: ServiceFilterComponentProps)`

Interfaz `ServiceFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `selectedService` | `string` | no | — |
| `setSelectedService` | `Dispatch<SetStateAction<string>>` | no | — |
| `isServiceMultiselect` | `boolean` | no | — |

- Usa: [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`gcp_services.ts`](../lib.md#lib-gcp-services-ts)
- Usado por: [`FiltersComponent.tsx`](#components-general-gcp-filters-filterscomponent-tsx)

Notas de implementación:

- SINGLE SELECT
- MULTI SELECT

---

<a id="components-general-gcp-filters-storageclassfiltercomponent-tsx"></a>
## `components/general_gcp/filters/StorageClassFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `StorageClassFilterComponent` `({ value, onChange }: StorageClassFilterProps)`

Interfaz `StorageClassFilterProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `value` | `string` | no | — |
| `onChange` | `(value: string) => void` | no | — |

Internos:

- constante `STORAGE_CLASSES`

- Usa: [`button.tsx`](ui.md#components-ui-button-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-gcp-filters-filterscomponent-tsx)

---

<a id="components-general-gcp-filters-tagsfiltercomponent-tsx"></a>
## `components/general_gcp/filters/TagsFilterComponent.tsx`

**Componente (cliente)**

interface TagFilterComponentProps {
startDate: Date,
endDate: Date,
regions: string,      // Azure usa 'region', GCP usa 'regions' (plural en tus otros filtros)
projects: string,     // Azure usa 'subscription', GCP usa 'projects'
collection: string,   // La colección de Mongo (ej: gcp_compute_disks)
tagColumnName: string,// El campo donde están los tags (ej: labels)

// Campos opcionales para mapeo en backend
regionField?: string,
projectField?: string,

// Estados del padre
selectedKey?: string | null,
selectedValue?: string | null,
setSelectedKey: Dispatch<SetStateAction<string | null>>,
setSelectedValue: Dispatch<SetStateAction<string | null>>,
setTagsData?: Dispatch<SetStateAction<unknown[]>>,
onChange?: (next: { key: string | null; value: string | null }) => void
}

export const TagsFilterComponent = ({
startDate,
endDate,
regions,
projects,
collection,
tagColumnName,
regionField = 'location',  // En GCP suele ser 'location' o 'region'
projectField = 'project_id', // En GCP es project_id
selectedKey,
selectedValue,
setSelectedKey,
setSelectedValue,
setTagsData,
onChange
}: TagFilterComponentProps) => {
const [openKey, setOpenKey] = useState(false)
const [openValue, setOpenValue] = useState(false)
const [isMounted, setIsMounted] = useState(false);

// Efecto para limpiar selección si cambian los datos y la key seleccionada ya no existe
useEffect(() => {
if (!data || isLoading) return

Exporta:

- componente `TagsFilterComponent` `({ startDate, endDate, regions, projects, resourceType, localService, selectedKey, selectedValue, setSelectedKey, setSelectedValue, setTagsData, onChange }: Ta…`

Interfaz `TagFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `regions` | `string` | no | — |
| `projects` | `string` | no | — |
| `resourceType` | `string` | no | — |
| `localService` | `string` | no | — |
| `selectedKey` | `string \| null` | sí | — |
| `selectedValue` | `string \| null` | sí | — |
| `setSelectedKey` | `Dispatch<SetStateAction<string \| null>>` | no | — |
| `setSelectedValue` | `Dispatch<SetStateAction<string \| null>>` | no | — |
| `setTagsData` | `Dispatch<SetStateAction<unknown[]>>` | sí | — |
| `onChange` | `(next: { key: string \| null; value: string \| null }) => void` | sí | — |

Interfaz `GcpTagItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `Key` | `string` | no | — |
| `Values` | `string[]` | no | — |

- API: `/api/gcp/bridge/gcp/general/get_all_tags`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-gcp-filters-filterscomponent-tsx)

Notas de implementación:

- Obtener valores según la key seleccionada. Si es 'allKeys', no suele haber valores específicos, pero mantenemos lógica segura.
- 1. Efecto para asignar valores por DEFECTO ('allKeys' / 'allValues')
- Si no hay key seleccionada, forzar 'allKeys'
- Si asignamos allKeys, automáticamente el valor es allValues
- Nota: No llamamos a onChange aquí para evitar bucles si el padre reacciona al cambio
- Si hay key pero no hay valor, forzar 'allValues'
- 2. Efecto de Limpieza / Validación si los datos cambian
- `if (selectedKey !== 'allKeys') setSelectedKey('allKeys')` — Reset a default seguro
- Si la key seleccionada ya no existe en los nuevos datos (y no es 'allKeys'), resetear a default
- Si el valor seleccionado ya no existe para la key actual (y no es 'allValues'), resetear valor
- JSX — Combo 1: KEY
- ASIGNACIÓN EXPLÍCITA DE 'allKeys'
- JSX — Check activado si es 'allKeys'
- Al cambiar de key específica, reseteamos value a 'allValues'
- JSX — Combo 2: VALUE (Solo se muestra/habilita si hay Key específica seleccionada)
- JSX — Si seleccionamos 'allKeys', ocultamos el segundo combo porque no tiene sentido filtrar por valor
- ASIGNACIÓN EXPLÍCITA DE 'allValues'
- JSX — Check activado si es 'allValues'

---

<a id="components-general-gcp-filters-vertexmodelsfiltercomponent-tsx"></a>
## `components/general_gcp/filters/VertexModelsFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `VertexModelsFilterComponent` `({ vertexModel, setVertexModel }: VertexModelsFilterComponentProps)`

Interfaz `VertexModelsFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `vertexModel` | `string` | no | — |
| `setVertexModel` | `Dispatch<SetStateAction<string>>` | no | — |

Interfaz `VertexModelProvider`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string` | no | — |
| `label` | `string` | no | — |
| `dotClassName` | `string` | no | — |
| `pattern` | `RegExp` | no | — |

Interfaz `VertexModelOption`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string` | no | — |
| `name` | `string` | no | — |
| `provider` | `VertexModelProvider` | no | — |

- Tipo interno `ApiVertexModel` = `| { model_id_lowercase: string; model_name: string } | string`
Internos:

- constante `VERTEX_MODEL_PROVIDERS`
- constante `OTHER_VERTEX_MODEL_PROVIDER`
- función `resolveVertexModelProvider` `(name: string)`

- API: `/api/gcp/bridge/gcp/vertex/prompt_optimization/all_chat_vertex_models`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-gcp-filters-filterscomponent-tsx), [`VXPromptOptInputComponent.tsx`](google-vertex.md#components-google-vertex-prompt-opt-info-vxpromptoptinputcomponent-tsx)

---

<a id="components-general-gcp-modal-historymodal-tsx"></a>
## `components/general_gcp/modal/HistoryModal.tsx`

**Componente (cliente)**

Exporta:

- interfaz `HistoryModalTab`
- componente `HistoryModal` `({ isOpen, onClose, title, subTitle, region, resourceType, tabs }: HistoryModalProps)`

Interfaz `HistoryModalTab` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `value` | `string` | no | — |
| `label` | `string` | no | — |
| `content` | `ReactNode` | no | — |

Interfaz `HistoryModalProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `isOpen` | `boolean` | no | — |
| `onClose` | `() => void` | no | — |
| `title` | `string` | no | — |
| `subTitle` | `string` | sí | — |
| `region` | `string` | no | — |
| `resourceType` | `string` | no | — |
| `tabs` | `HistoryModalTab[]` | no | — |

- Usa: [`dialog.tsx`](ui.md#components-ui-dialog-tsx), [`badge.tsx`](ui.md#components-ui-badge-tsx), [`tabs.tsx`](ui.md#components-ui-tabs-tsx)
- Usado por: [`UnusedEbsColumns.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-ebs-table-unusedebscolumns-tsx), [`UnusedEc2Columns.tsx`](aws/vista-funciones.md#components-aws-vista-funciones-unused-ec2-table-unusedec2columns-tsx), [`WorkingNonWorkingHoursColumns.tsx`](azure/vista-funciones.md#components-azure-vista-funciones-consumo-horario-habil-no-habil-table-workingnonworkinghourscolumns-tsx), [`WorkingNonWorkingHoursColumns.tsx`](gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-table-workingnonworkinghourscolumns-tsx), [`UnusedCeColumns.tsx`](gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-compute-engine-table-unusedcecolumns-tsx), [`ConsumptionDetailModal.tsx`](shared.md#components-shared-consumption-consumptiondetailmodal-tsx), [`UnusedDetailModal.tsx`](shared.md#components-shared-unused-unuseddetailmodal-tsx), [`WorkingHoursDetailModal.tsx`](shared.md#components-shared-working-hours-workinghoursdetailmodal-tsx)

