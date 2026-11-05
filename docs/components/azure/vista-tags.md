# Componentes `components/azure/vista-tags/`

[← Índice](../../README.md)

Mantenedor de etiquetas Azure.

Archivos:

- [`components/azure/vista-tags/MainViewTaggedResourcesComponent.tsx`](#components-azure-vista-tags-mainviewtaggedresourcescomponent-tsx)
- [`components/azure/vista-tags/TaggedResourcesComponent.tsx`](#components-azure-vista-tags-taggedresourcescomponent-tsx)
- [`components/azure/vista-tags/table/TagsDataTable.tsx`](#components-azure-vista-tags-table-tagsdatatable-tsx)

<a id="components-azure-vista-tags-mainviewtaggedresourcescomponent-tsx"></a>
## `components/azure/vista-tags/MainViewTaggedResourcesComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewTagsComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`TaggedResourcesComponent.tsx`](#components-azure-vista-tags-taggedresourcescomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-tags-page-tsx)

---

<a id="components-azure-vista-tags-taggedresourcescomponent-tsx"></a>
## `components/azure/vista-tags/TaggedResourcesComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `ResourceItemAzure` — Types
- interfaz `ServiceGroupAzure`
- interfaz `ApiResponseWrapper`
- componente `TagsAnalysisComponentAzure` `({ startDate, endDate, subscription, region }: TagsAnalysisProps)`

Interfaz `ResourceItemAzure` (exportada) — Types:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource` | `string` | no | — |
| `id_resource` | `string` | no | — |
| `sub_services` | `string[]` | no | — |
| `subscription_guid` | `string` | no | — |
| `subscription_name` | `string` | no | — |
| `region` | `string` | no | — |
| `tags` | `Record<string, string> \| "SIN TAGS"` | no | — |
| `local_keys` | `string[]` | sí | — |

Interfaz `ServiceGroupAzure` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `service` | `string` | no | — |
| `resources` | `ResourceItemAzure[]` | no | — |

Interfaz `ApiResponseWrapper` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ServiceGroupAzure[]` | sí | — |
| `items` | `ServiceGroupAzure[]` | sí | — |
| `results` | `ServiceGroupAzure[]` | sí | — |
| `detail` | `string \| Record<string, unknown>` | sí | — |
| `message` | `string \| Record<string, unknown>` | sí | — |

Interfaz `TagsAnalysisProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `subscription` | `string` | no | — |
| `region` | `string` | no | — |

- API: `/api/azure/bridge/mantenedor-tags/azure/get_resource_tags`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx), [`LoaderComponent.tsx`](../general_gcp.md#components-general-gcp-loadercomponent-tsx), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`TagsDataTable.tsx`](#components-azure-vista-tags-table-tagsdatatable-tsx)
- Usado por: [`MainViewTaggedResourcesComponent.tsx`](#components-azure-vista-tags-mainviewtaggedresourcescomponent-tsx), [`TagsDataTable.tsx`](#components-azure-vista-tags-table-tagsdatatable-tsx)

Notas de implementación:

- _TagsAnalysisComponentAzure_: Estado para controlar el pop-up de detalles
- _TagsAnalysisComponentAzure_: LÓGICA DE CÁLCULO AMPLIADA
- _TagsAnalysisComponentAzure_: Contadores para el detalle Nube vs Local
- _TagsAnalysisComponentAzure_: Iteración para calcular todos los KPIs incluyendo nube vs local
- _TagsAnalysisComponentAzure_: Calcula el % basado en el TOTAL de la infraestructura (tageados + huérfanos)
- _TagsAnalysisComponentAzure_: JSX — HEADER Y TEXTOS
- _TagsAnalysisComponentAzure_: JSX — TARJETAS KPI
- _TagsAnalysisComponentAzure_: JSX — TARJETA: RECURSOS TAGEADOS CON BOTÓN INFO
- _TagsAnalysisComponentAzure_: JSX — TARJETA: COBERTURA CON BOTÓN INFO
- _TagsAnalysisComponentAzure_: JSX — MODAL DE DETALLES
- _TagsAnalysisComponentAzure_: `onClick={(e) => e.stopPropagation()}` — Evita que el click dentro cierre el modal
- _TagsAnalysisComponentAzure_: JSX — Etiquetado en Nube
- _TagsAnalysisComponentAzure_: JSX — Etiquetado Local
- _TagsAnalysisComponentAzure_: JSX — Mixto

---

<a id="components-azure-vista-tags-table-tagsdatatable-tsx"></a>
## `components/azure/vista-tags/table/TagsDataTable.tsx`

**Componente (cliente)**

Exporta:

- interfaz `FlattenedResource`
- componente `TagsDataTableAzure` `({ data }: TagsDataTableProps)`

Interfaz `FlattenedResource` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `service` | `string` | no | — |
| `sub_services` | `string[]` | no | — |
| `id_resource` | `string` | no | — |
| `resourceId` | `string` | no | — |
| `subscription_guid` | `string` | no | — |
| `subscription_name` | `string` | no | — |
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
| `data` | `ServiceGroupAzure[]` | no | — |

- API: `/api/azure/bridge/mantenedor-tags/azure/get_resource_tags`, `/api/azure/bridge/mantenedor-tags/azure/local/add`, `/api/azure/bridge/mantenedor-tags/azure/local/assign-bulk-cc`, `/api/azure/bridge/mantenedor-tags/azure/local/cost-centers`, `/api/azure/bridge/mantenedor-tags/azure/local/delete`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`TaggedResourcesComponent.tsx`](#components-azure-vista-tags-taggedresourcescomponent-tsx)
- Usado por: [`TaggedResourcesComponent.tsx`](#components-azure-vista-tags-taggedresourcescomponent-tsx)

Notas de implementación:

- _TagsDataTableAzure_: Columnas

