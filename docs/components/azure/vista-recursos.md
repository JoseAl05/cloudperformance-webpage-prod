# Componentes `components/azure/vista-recursos/`

[← Índice](../../README.md)

Top de recursos generales de Azure.

Archivos:

- [`components/azure/vista-recursos/top-recursos-general/MainViewTopRecursosGeneralComponent.tsx`](#components-azure-vista-recursos-top-recursos-general-mainviewtoprecursosgeneralcomponent-tsx)
- [`components/azure/vista-recursos/top-recursos-general/TopRecursosGeneralChartComponent.tsx`](#components-azure-vista-recursos-top-recursos-general-toprecursosgeneralchartcomponent-tsx)

<a id="components-azure-vista-recursos-top-recursos-general-mainviewtoprecursosgeneralcomponent-tsx"></a>
## `components/azure/vista-recursos/top-recursos-general/MainViewTopRecursosGeneralComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewTopRecursosGeneralComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`TopRecursosGeneralChartComponent.tsx`](#components-azure-vista-recursos-top-recursos-general-toprecursosgeneralchartcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-recursos-top-recursos-general-page-tsx)

Notas de implementación:

- JSX — Header

---

<a id="components-azure-vista-recursos-top-recursos-general-toprecursosgeneralchartcomponent-tsx"></a>
## `components/azure/vista-recursos/top-recursos-general/TopRecursosGeneralChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `TopRecursosGeneralChartComponent` `({ startDate, endDate }: TopRecursosGeneralChartProps)`

Interfaz `AzureTopResourceItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `display_name` | `string` | sí | — |
| `resource_group` | `string` | sí | — |
| `providers` | `string` | sí | — |
| `location` | `string` | sí | — |
| `resource_count` | `number` | sí | — |

Interfaz `AzureTopResourceRelationship`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `display_name` | `string` | no | — |
| `resource_group` | `string` | no | — |
| `providers` | `string` | no | — |
| `location` | `string` | no | — |
| `resource_count` | `number` | no | — |

Interfaz `AzureTopSummary`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `total_subscriptions` | `number` | no | — |
| `total_resource_groups` | `number` | no | — |
| `total_services` | `number` | no | — |
| `total_locations` | `number` | no | — |

Interfaz `AzureTopResponse`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `top_by_subscriptions` | `AzureTopResourceItem[]` | sí | — |
| `top_by_resource_groups` | `AzureTopResourceItem[]` | sí | — |
| `top_by_services` | `AzureTopResourceItem[]` | sí | — |
| `top_by_locations` | `AzureTopResourceItem[]` | sí | — |
| `summary` | `AzureTopSummary` | sí | — |

Interfaz `AzureTopDetalladoResponse`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `relationships` | `AzureTopResourceRelationship[]` | sí | — |

Interfaz `TopRecursosGeneralChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |

Interfaz `FilterState`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `type` | `'subscription' \| 'resourceGroup' \| 'service' \| 'location' \| null` | no | — |
| `value` | `string \| null` | no | — |

- API: `/api/azure/bridge/azure/top-recursos-general`, `/api/azure/bridge/azure/top-recursos-general-detallado`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx)
- Usado por: [`MainViewTopRecursosGeneralComponent.tsx`](#components-azure-vista-recursos-top-recursos-general-mainviewtoprecursosgeneralcomponent-tsx)

Notas de implementación:

- Fetch del endpoint agregado (original)
- Fetch del endpoint detallado (para relaciones)
- Si hay filtro activo, recalcular basado en relaciones
- Filtrar relaciones según el filtro activo
- Recalcular Top 5 para cada dimensión
- Sin filtro: usar datos originales
- Si hacen clic en el mismo elemento, deseleccionar
- Sino, seleccionar el nuevo elemento
- Chart 1: Subscriptions
- Chart 2: Resource Groups
- Chart 3: Services
- Chart 4: Locations
- JSX — Indicador de filtro activo
- JSX — Gráficos en grid 2x2
- JSX — Cards de métricas

