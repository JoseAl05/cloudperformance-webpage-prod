# Componentes `components/general_presupuesto/`

[← Índice](../README.md)

Filtros de presupuestos (año, nube, centro de costo) y control de sesión.

Archivos:

- [`components/general_presupuesto/LoaderComponent.tsx`](#components-general-presupuesto-loadercomponent-tsx)
- [`components/general_presupuesto/filters/AnioFilterComponent.tsx`](#components-general-presupuesto-filters-aniofiltercomponent-tsx)
- [`components/general_presupuesto/filters/CentroDeCostoFilterComponent.tsx`](#components-general-presupuesto-filters-centrodecostofiltercomponent-tsx)
- [`components/general_presupuesto/filters/CloudFilterComponent.tsx`](#components-general-presupuesto-filters-cloudfiltercomponent-tsx)
- [`components/general_presupuesto/filters/FiltersComponent.tsx`](#components-general-presupuesto-filters-filterscomponent-tsx)
- [`components/general_presupuesto/session/SesionGate.tsx`](#components-general-presupuesto-session-sesiongate-tsx)

<a id="components-general-presupuesto-loadercomponent-tsx"></a>
## `components/general_presupuesto/LoaderComponent.tsx`

**Componente**

Exporta:

- componente `LoaderComponent` `({ size = 'large' }: LoaderComponentProps)`

Interfaz `LoaderComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `size` | `'small' \| 'large'` | no | — |

- Usado por: [`CostosVsPresupuestoComponent.tsx`](aws/presupuesto-v2.md#components-aws-presupuesto-v2-costo-vs-presupuesto-costosvspresupuestocomponent-tsx), [`CostosVsPresupuestoComponent.tsx`](azure/presupuesto-v2.md#components-azure-presupuesto-v2-costo-vs-presupuesto-costosvspresupuestocomponent-tsx), [`CostosVsPresupuestoComponent.tsx`](gcp/presupuesto.md#components-gcp-presupuesto-costo-vs-presupuesto-costosvspresupuestocomponent-tsx), [`CentroDeCostoFilterComponent.tsx`](#components-general-presupuesto-filters-centrodecostofiltercomponent-tsx), [`CostosVsPresupuestoComponent.tsx`](presupuesto.md#components-presupuesto-costo-vs-presupuesto-costosvspresupuestocomponent-tsx)

---

<a id="components-general-presupuesto-filters-aniofiltercomponent-tsx"></a>
## `components/general_presupuesto/filters/AnioFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AnioFilterComponent` `({ selectedAnio, setSelectedAnio, startYear = 2020, endYear = new Date().getFullYear() + 1, }: AnioFilterComponentProps)`

Interfaz `AnioFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `selectedAnio` | `string` | no | — |
| `setSelectedAnio` | `(anio: string) => void` | no | — |
| `startYear` | `number` | sí | — |
| `endYear` | `number` | sí | — |

- Usa: [`select.tsx`](ui.md#components-ui-select-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-presupuesto-filters-filterscomponent-tsx)

---

<a id="components-general-presupuesto-filters-centrodecostofiltercomponent-tsx"></a>
## `components/general_presupuesto/filters/CentroDeCostoFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `CentroDeCostoFilterComponent` `({ cloudType, CentroDeCosto, setCentroDeCosto, isCentroDeCostoMultiselect, }: CentroDeCostoFilterComponentProps)`

Interfaz `CentroDeCosto`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_centro_costo` | `number` | no | — |
| `nombre_centro` | `string` | no | — |
| `responsable_centro` | `string` | no | — |
| `localizacion` | `string` | no | — |

Interfaz `CentroDeCostoFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloudType` | `string` | no | — |
| `CentroDeCosto` | `string` | no | — |
| `setCentroDeCosto` | `Dispatch<SetStateAction<string>>` | no | — |
| `isCentroDeCostoMultiselect` | `boolean` | no | — |

- API: `/api/presupuesto/bridge/{…}/centro-costo`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](#components-general-presupuesto-loadercomponent-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-presupuesto-filters-filterscomponent-tsx)

---

<a id="components-general-presupuesto-filters-cloudfiltercomponent-tsx"></a>
## `components/general_presupuesto/filters/CloudFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `CloudFilterComponent` `({ selectedCloud, setSelectedCloud, isCloudMultiSelect, }: CloudFilterComponentProps)`

Interfaz `CloudFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `selectedCloud` | `string` | no | — |
| `setSelectedCloud` | `Dispatch<SetStateAction<string>>` | no | — |
| `isCloudMultiSelect` | `boolean` | no | — |

- Hooks: `useSession`
- Usa: [`useSession.ts`](../hooks.md#hooks-usesession-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx)
- Usado por: [`FiltersComponent.tsx`](#components-general-presupuesto-filters-filterscomponent-tsx)

---

<a id="components-general-presupuesto-filters-filterscomponent-tsx"></a>
## `components/general_presupuesto/filters/FiltersComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `FiltersComponent` `({ Component, dateFilter = true, regionFilter = false, isRegionMultiSelect = false, instancesFilter = false, instancesService, asgFilter = false, eksFilter = f…`

Interfaz `FiltersComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `Component` | `(params: { startDate: Date; endDate?: Date; instance: string; region:…` | no | — |
| `dateFilter` | `boolean` | sí | — |
| `regionFilter` | `boolean` | sí | — |
| `isRegionMultiSelect` | `boolean` | sí | — |
| `instancesFilter` | `boolean` | sí | — |
| `instancesService` | `string` | sí | — |
| `asgFilter` | `boolean` | sí | — |
| `eksFilter` | `boolean` | sí | — |
| `s3Filter` | `boolean` | sí | — |
| `eventsTypesFilter` | `boolean` | sí | — |
| `advisorCategoriesFilter` | `boolean` | sí | — |
| `advisorStatusFilter` | `boolean` | sí | — |
| `autoScalingGroupFilter` | `boolean` | sí | — |
| `metricFilter` | `boolean` | sí | — |
| `metricsFilter` | `boolean` | sí | — |
| `engine` | `string` | sí | — |
| `metricsRDSFilter` | `boolean` | sí | — |
| `isAdvisorCategoryMultiselect` | `boolean` | sí | — |
| `isAdvisorStatusMultiselect` | `boolean` | sí | — |
| `isEventsTypesMultiselect` | `boolean` | sí | — |
| `isAsgMultiSelect` | `boolean` | sí | — |
| `isEksMultiSelect` | `boolean` | sí | — |
| `isEksAsgMultiSelect` | `boolean` | sí | — |
| `isEksAsgInstanceMultiSelect` | `boolean` | sí | — |
| `isAsgInstanceMultiSelect` | `boolean` | sí | — |
| `isInstanceMultiSelect` | `boolean` | sí | — |
| `isViewUnused` | `boolean` | sí | — |
| `isViewResource` | `boolean` | sí | — |
| `tagsFilter` | `boolean` | sí | — |
| `serviceFilter` | `boolean` | sí | — |
| `resourceType` | `string \| null` | sí | — |
| `variationServiceFilter` | `boolean` | sí | — |
| `variationMetricFilter` | `boolean` | sí | — |
| `cloudFilter` | `boolean` | sí | — |
| `cloudFilterType` | `string \| null` | sí | — |
| `centroDeCostoFilter` | `boolean` | sí | — |
| `isCentroDeCostoMultiselect` | `boolean` | sí | — |
| `anioFilter` | `boolean` | sí | — |

- Hooks: `useRouter`, `useSearchParams`
- Usa: [`RegionFilterComponent.tsx`](general_aws.md#components-general-aws-filters-regionfiltercomponent-tsx), [`CloudFilterComponent.tsx`](#components-general-presupuesto-filters-cloudfiltercomponent-tsx), [`CentroDeCostoFilterComponent.tsx`](#components-general-presupuesto-filters-centrodecostofiltercomponent-tsx), [`TagsFilterComponent.tsx`](general_aws.md#components-general-aws-filters-tagsfiltercomponent-tsx), [`ServiceFilterComponent.tsx`](general_aws.md#components-general-aws-filters-servicefiltercomponent-tsx), [`VariationServiceFilterComponent.tsx`](general_aws.md#components-general-aws-filters-variationservicefiltercomponent-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`InstancesFilterComponent.tsx`](general_aws.md#components-general-aws-filters-instancesfiltercomponent-tsx), [`AsgFilterComponent.tsx`](general_aws.md#components-general-aws-filters-asgfiltercomponent-tsx), [`EksFilterComponent.tsx`](general_aws.md#components-general-aws-filters-eksfiltercomponent-tsx), [`S3FilterComponent.tsx`](general_aws.md#components-general-aws-filters-s3filtercomponent-tsx), [`EventsTypeFilterComponent.tsx`](general_aws.md#components-general-aws-filters-eventstypefiltercomponent-tsx), [`AdvisorCategoriesFilterComponent.tsx`](general_aws.md#components-general-aws-filters-advisorcategoriesfiltercomponent-tsx), [`AdvisorStatusFilterComponent.tsx`](general_aws.md#components-general-aws-filters-advisorstatusfiltercomponent-tsx), [`VariationMetricFilterComponent.tsx`](general_aws.md#components-general-aws-filters-variationmetricfiltercomponent-tsx), [`Ec2MetricLabelFilterComponent.tsx`](general_aws.md#components-general-aws-filters-ec2metriclabelfiltercomponent-tsx), [`Ec2AutoscalingGroupsFilterComponent.tsx`](general_aws.md#components-general-aws-filters-ec2autoscalinggroupsfiltercomponent-tsx), [`MetricsFilterComponent.tsx`](general_aws.md#components-general-aws-filters-metricsfiltercomponent-tsx), [`MetricsRDSFilterComponent.tsx`](general_aws.md#components-general-aws-filters-metricsrdsfiltercomponent-tsx), [`AnioFilterComponent.tsx`](#components-general-presupuesto-filters-aniofiltercomponent-tsx), [`filters.ts`](../lib.md#lib-filters-ts)
- Usado por: [`MainViewCostoVsPresupuestoComponent.tsx`](aws/presupuesto-v2.md#components-aws-presupuesto-v2-costo-vs-presupuesto-mainviewcostovspresupuestocomponent-tsx), [`MainViewCostoVsPresupuestoComponent.tsx`](azure/presupuesto-v2.md#components-azure-presupuesto-v2-costo-vs-presupuesto-mainviewcostovspresupuestocomponent-tsx), [`MainViewCostoVsPresupuestoComponent.tsx`](gcp/presupuesto.md#components-gcp-presupuesto-costo-vs-presupuesto-mainviewcostovspresupuestocomponent-tsx), [`MainViewCentroDeCostoComponent.tsx`](presupuesto.md#components-presupuesto-centro-de-costo-mainviewcentrodecostocomponent-tsx), [`MainViewCostoVsPresupuestoComponent.tsx`](presupuesto.md#components-presupuesto-costo-vs-presupuesto-mainviewcostovspresupuestocomponent-tsx), [`MainViewPresupuestoAnualComponent.tsx`](presupuesto.md#components-presupuesto-presupuesto-anual-mainviewpresupuestoanualcomponent-tsx), [`MainViewPresupuestoMensualComponent.tsx`](presupuesto.md#components-presupuesto-presupuesto-mensual-mainviewpresupuestomensualcomponent-tsx)

---

<a id="components-general-presupuesto-session-sesiongate-tsx"></a>
## `components/general_presupuesto/session/SesionGate.tsx`

**Componente (cliente)**

Exporta:

- componente `SessionGate` `({ children, redirectTo = "/login", }: SessionGateProps)` — SessionGate protege rutas que requieren sesión. - Muestra un loader mientras se carga la sesión. - Redirige al login si no hay usuario. - Muestra error si ocurre uno.

Interfaz `SessionGateProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `children` | `ReactNode` | no | — |
| `redirectTo` | `string` | sí | Ruta a la que redirige si no hay sesión |

- Hooks: `useRouter`, `useSession`
- Usa: [`useSession.ts`](../hooks.md#hooks-usesession-ts), [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx)
- Usado por: [`CentroDeCostoComponent.tsx`](aws/presupuesto-v2.md#components-aws-presupuesto-v2-centro-de-costo-centrodecostocomponent-tsx), [`MainViewCentroDeCostoComponent.tsx`](aws/presupuesto-v2.md#components-aws-presupuesto-v2-centro-de-costo-mainviewcentrodecostocomponent-tsx), [`MainViewCostoVsPresupuestoComponent.tsx`](aws/presupuesto-v2.md#components-aws-presupuesto-v2-costo-vs-presupuesto-mainviewcostovspresupuestocomponent-tsx), [`MainViewPresupuestoAnualComponent.tsx`](aws/presupuesto-v2.md#components-aws-presupuesto-v2-presupuesto-anual-mainviewpresupuestoanualcomponent-tsx), [`PresupuestoAnualComponent.tsx`](aws/presupuesto-v2.md#components-aws-presupuesto-v2-presupuesto-anual-presupuestoanualcomponent-tsx), [`MainViewPresupuestoMensualComponent.tsx`](aws/presupuesto-v2.md#components-aws-presupuesto-v2-presupuesto-mensual-mainviewpresupuestomensualcomponent-tsx), [`PresupuestoMensualComponent.tsx`](aws/presupuesto-v2.md#components-aws-presupuesto-v2-presupuesto-mensual-presupuestomensualcomponent-tsx), [`CentroDeCostoComponent.tsx`](azure/presupuesto-v2.md#components-azure-presupuesto-v2-centro-de-costo-centrodecostocomponent-tsx), [`MainViewCentroDeCostoComponent.tsx`](azure/presupuesto-v2.md#components-azure-presupuesto-v2-centro-de-costo-mainviewcentrodecostocomponent-tsx), [`MainViewCostoVsPresupuestoComponent.tsx`](azure/presupuesto-v2.md#components-azure-presupuesto-v2-costo-vs-presupuesto-mainviewcostovspresupuestocomponent-tsx), [`MainViewPresupuestoAnualComponent.tsx`](azure/presupuesto-v2.md#components-azure-presupuesto-v2-presupuesto-anual-mainviewpresupuestoanualcomponent-tsx), [`PresupuestoAnualComponent.tsx`](azure/presupuesto-v2.md#components-azure-presupuesto-v2-presupuesto-anual-presupuestoanualcomponent-tsx), [`MainViewPresupuestoMensualComponent.tsx`](azure/presupuesto-v2.md#components-azure-presupuesto-v2-presupuesto-mensual-mainviewpresupuestomensualcomponent-tsx), [`PresupuestoMensualComponent.tsx`](azure/presupuesto-v2.md#components-azure-presupuesto-v2-presupuesto-mensual-presupuestomensualcomponent-tsx), [`CentroDeCostoComponent.tsx`](gcp/presupuesto.md#components-gcp-presupuesto-centro-de-costo-centrodecostocomponent-tsx), [`MainViewCentroDeCostoComponent.tsx`](gcp/presupuesto.md#components-gcp-presupuesto-centro-de-costo-mainviewcentrodecostocomponent-tsx), [`MainViewCostoVsPresupuestoComponent.tsx`](gcp/presupuesto.md#components-gcp-presupuesto-costo-vs-presupuesto-mainviewcostovspresupuestocomponent-tsx), [`MainViewPresupuestoAnualComponent.tsx`](gcp/presupuesto.md#components-gcp-presupuesto-presupuesto-anual-mainviewpresupuestoanualcomponent-tsx), [`PresupuestoAnualComponent.tsx`](gcp/presupuesto.md#components-gcp-presupuesto-presupuesto-anual-presupuestoanualcomponent-tsx), [`MainViewPresupuestoMensualComponent.tsx`](gcp/presupuesto.md#components-gcp-presupuesto-presupuesto-mensual-mainviewpresupuestomensualcomponent-tsx), [`PresupuestoMensualComponent.tsx`](gcp/presupuesto.md#components-gcp-presupuesto-presupuesto-mensual-presupuestomensualcomponent-tsx), [`CentroDeCostoComponent.tsx`](presupuesto.md#components-presupuesto-centro-de-costo-centrodecostocomponent-tsx), [`MainViewCentroDeCostoComponent.tsx`](presupuesto.md#components-presupuesto-centro-de-costo-mainviewcentrodecostocomponent-tsx), [`MainViewCostoVsPresupuestoComponent.tsx`](presupuesto.md#components-presupuesto-costo-vs-presupuesto-mainviewcostovspresupuestocomponent-tsx), [`MainViewPresupuestoAnualComponent.tsx`](presupuesto.md#components-presupuesto-presupuesto-anual-mainviewpresupuestoanualcomponent-tsx), [`PresupuestoAnualComponent.tsx`](presupuesto.md#components-presupuesto-presupuesto-anual-presupuestoanualcomponent-tsx), [`MainViewPresupuestoMensualComponent.tsx`](presupuesto.md#components-presupuesto-presupuesto-mensual-mainviewpresupuestomensualcomponent-tsx), [`PresupuestoMensualComponent.tsx`](presupuesto.md#components-presupuesto-presupuesto-mensual-presupuestomensualcomponent-tsx)

Notas de implementación:

- 🚀 Redirigir si no hay usuario
- 🌀 Mostrar loader mientras carga la sesión
- ❌ Mostrar error si ocurre
- 🚷 Si ya terminó de cargar pero no hay usuario, no renderices nada (ya redirigió)
- ✅ Si todo está bien, renderiza los hijos protegidos

