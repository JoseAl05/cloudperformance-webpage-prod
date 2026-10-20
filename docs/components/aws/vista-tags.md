# Componentes `components/aws/vista-tags/`

[← Índice](../../README.md)

Mantenedor de etiquetas AWS.

Archivos:

- [`components/aws/vista-tags/MainViewTaggedResourcesComponent.tsx`](#components-aws-vista-tags-mainviewtaggedresourcescomponent-tsx)
- [`components/aws/vista-tags/TaggedResourcesComponent.tsx`](#components-aws-vista-tags-taggedresourcescomponent-tsx)
- [`components/aws/vista-tags/table/TagsDataTable.tsx`](#components-aws-vista-tags-table-tagsdatatable-tsx)

<a id="components-aws-vista-tags-mainviewtaggedresourcescomponent-tsx"></a>
## `components/aws/vista-tags/MainViewTaggedResourcesComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewTagsComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`TaggedResourcesComponent.tsx`](#components-aws-vista-tags-taggedresourcescomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-tags-page-tsx)

---

<a id="components-aws-vista-tags-taggedresourcescomponent-tsx"></a>
## `components/aws/vista-tags/TaggedResourcesComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `ResourceItemAWS`
- interfaz `ServiceGroupAWS`
- interfaz `ApiResponseWrapper`
- componente `TagsAnalysisComponentAWS` `({ startDate, endDate, services }: TagsAnalysisComponentProps)`

Interfaz `ResourceItemAWS` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource` | `string` | no | — |
| `tags` | `Record<string, string> \| "SIN TAGS"` | no | — |
| `local_keys` | `string[]` | sí | — |

Interfaz `ServiceGroupAWS` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `service` | `string` | no | — |
| `resources` | `ResourceItemAWS[]` | no | — |

Interfaz `ApiResponseWrapper` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ServiceGroupAWS[]` | sí | — |
| `items` | `ServiceGroupAWS[]` | sí | — |
| `results` | `ServiceGroupAWS[]` | sí | — |
| `detail` | `string \| Record<string, unknown>` | sí | — |
| `message` | `string \| Record<string, unknown>` | sí | — |
| `success` | `boolean` | sí | — |

Interfaz `TagsAnalysisComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `services` | `string` | sí | — |

- API: `/api/aws/bridge/mantenedor-tags/aws/get_resource_tags`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx), [`LoaderComponent.tsx`](../general_gcp.md#components-general-gcp-loadercomponent-tsx), [`MessageCards.tsx`](cards.md#components-aws-cards-messagecards-tsx), [`TagsDataTable.tsx`](#components-aws-vista-tags-table-tagsdatatable-tsx)
- Usado por: [`MainViewTaggedResourcesComponent.tsx`](#components-aws-vista-tags-mainviewtaggedresourcescomponent-tsx), [`TagsDataTable.tsx`](#components-aws-vista-tags-table-tagsdatatable-tsx)

Notas de implementación:

- _TagsAnalysisComponentAWS_: JSX — TARJETAS KPI
- _TagsAnalysisComponentAWS_: `onClick={(e) => e.stopPropagation()}` — Evita que el click dentro cierre el modal
- _TagsAnalysisComponentAWS_: JSX — Etiquetado en Nube
- _TagsAnalysisComponentAWS_: JSX — Etiquetado Local
- _TagsAnalysisComponentAWS_: JSX — Mixto

---

<a id="components-aws-vista-tags-table-tagsdatatable-tsx"></a>
## `components/aws/vista-tags/table/TagsDataTable.tsx`

**Componente (cliente)**

Exporta:

- interfaz `FlattenedResource`
- componente `TagsDataTableAWS` `({ data }: TagsDataTableProps)`

Interfaz `FlattenedResource` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `service` | `string` | no | — |
| `resourceId` | `string` | no | — |
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
| `data` | `ServiceGroupAWS[]` | no | — |

- API: `/api/aws/bridge/mantenedor-tags/aws/get_resource_tags`, `/api/aws/bridge/mantenedor-tags/aws/local/add`, `/api/aws/bridge/mantenedor-tags/aws/local/assign-bulk-cc`, `/api/aws/bridge/mantenedor-tags/aws/local/cost-centers`, `/api/aws/bridge/mantenedor-tags/aws/local/delete`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`TaggedResourcesComponent.tsx`](#components-aws-vista-tags-taggedresourcescomponent-tsx)
- Usado por: [`TaggedResourcesComponent.tsx`](#components-aws-vista-tags-taggedresourcescomponent-tsx)

Notas de implementación:

- _TagsDataTableAWS_: JSX — BARRA FLOTANTE DINÁMICA

