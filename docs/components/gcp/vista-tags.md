# Componentes `components/gcp/vista-tags/`

[← Índice](../../README.md)

Mantenedor de etiquetas GCP.

Archivos:

- [`components/gcp/vista-tags/MainViewTaggedResourcesComponent.tsx`](#components-gcp-vista-tags-mainviewtaggedresourcescomponent-tsx)
- [`components/gcp/vista-tags/TaggedResourcesComponent.tsx`](#components-gcp-vista-tags-taggedresourcescomponent-tsx)
- [`components/gcp/vista-tags/table/TagsDataTable.tsx`](#components-gcp-vista-tags-table-tagsdatatable-tsx)

<a id="components-gcp-vista-tags-mainviewtaggedresourcescomponent-tsx"></a>
## `components/gcp/vista-tags/MainViewTaggedResourcesComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewTagsComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`TaggedResourcesComponent.tsx`](#components-gcp-vista-tags-taggedresourcescomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-tags-page-tsx)

Notas de implementación:

- serviceFilter isServiceMultiSelect

---

<a id="components-gcp-vista-tags-taggedresourcescomponent-tsx"></a>
## `components/gcp/vista-tags/TaggedResourcesComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `ResourceItem`
- interfaz `ServiceGroup`
- interfaz `ApiResponseWrapper`
- componente `TagsAnalysisComponent` `({ startDate, endDate }: TagsAnalysisComponentProps)`

Interfaz `ResourceItem` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource` | `string` | no | — |
| `sub_service` | `string` | no | — |
| `id_resource` | `string` | no | — |
| `project_id` | `string` | no | — |
| `project_name` | `string` | no | — |
| `region` | `string` | no | — |
| `tags` | `Record<string, string> \| "SIN TAGS"` | no | — |
| `local_keys` | `string[]` | sí | — |

Interfaz `ServiceGroup` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `service` | `string` | no | — |
| `resources` | `ResourceItem[]` | no | — |

Interfaz `ApiResponseWrapper` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ServiceGroup[]` | sí | — |
| `items` | `ServiceGroup[]` | sí | — |
| `results` | `ServiceGroup[]` | sí | — |
| `detail` | `string \| Record<string, unknown>` | sí | — |
| `message` | `string \| Record<string, unknown>` | sí | — |

Interfaz `TagsAnalysisComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |

- API: `/api/gcp/bridge/mantenedor-tags/gcp/get_resource_tags`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx), [`LoaderComponent.tsx`](../general_gcp.md#components-general-gcp-loadercomponent-tsx), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`TagsDataTable.tsx`](#components-gcp-vista-tags-table-tagsdatatable-tsx)
- Usado por: [`MainViewTaggedResourcesComponent.tsx`](#components-gcp-vista-tags-mainviewtaggedresourcescomponent-tsx), [`TagsDataTable.tsx`](#components-gcp-vista-tags-table-tagsdatatable-tsx)

Notas de implementación:

- _TagsAnalysisComponentProps_: service: string
- _TagsAnalysisComponent_: `onClick={(e) => e.stopPropagation()}` — Evita que el click dentro cierre el modal
- _TagsAnalysisComponent_: JSX — Etiquetado en Nube
- _TagsAnalysisComponent_: JSX — Etiquetado Local
- _TagsAnalysisComponent_: JSX — Mixto

---

<a id="components-gcp-vista-tags-table-tagsdatatable-tsx"></a>
## `components/gcp/vista-tags/table/TagsDataTable.tsx`

**Componente (cliente)**

Exporta:

- interfaz `FlattenedResource`
- componente `TagsDataTable` `({ data }: TagsDataTableProps)`

Interfaz `FlattenedResource` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `service` | `string` | no | — |
| `sub_service` | `string` | no | — |
| `id_resource` | `string` | no | — |
| `resourceId` | `string` | no | — |
| `project_id` | `string` | no | — |
| `project_name` | `string` | no | — |
| `region` | `string` | no | — |
| `hasTags` | `boolean` | no | — |
| `tags_raw` | `Record<string, string \| string[]> \| null` | no | — |
| `local_keys` | `string[]` | no | — |
| `status` | `string` | no | — |

Interfaz `CostCenter`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `number` | no | — |
| `nombre` | `string` | no | — |
| `responsable` | `string` | no | — |

Interfaz `TagsDataTableProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ServiceGroup[]` | no | — |
| `startDate` | `string` | sí | — |
| `endDate` | `string` | sí | — |

- API: `/api/gcp/bridge/mantenedor-tags/gcp/get_resource_tags`, `/api/gcp/bridge/mantenedor-tags/gcp/local/add`, `/api/gcp/bridge/mantenedor-tags/gcp/local/assign-bulk-cc`, `/api/gcp/bridge/mantenedor-tags/gcp/local/cost-centers`, `/api/gcp/bridge/mantenedor-tags/gcp/local/delete`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`TaggedResourcesComponent.tsx`](#components-gcp-vista-tags-taggedresourcescomponent-tsx)
- Usado por: [`TaggedResourcesComponent.tsx`](#components-gcp-vista-tags-taggedresourcescomponent-tsx)

