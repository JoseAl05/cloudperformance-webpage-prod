# Componentes `components/azure/vista-recursos-tm/`

[← Índice](../../README.md)

Vista de Traffic Managers: tarjetas, tabla y detalle.

Archivos:

- [`components/azure/vista-recursos-tm/MainViewRecursosTrafficManagerComponent.tsx`](#components-azure-vista-recursos-tm-mainviewrecursostrafficmanagercomponent-tsx)
- [`components/azure/vista-recursos-tm/RecursosTrafficManagerComponent.tsx`](#components-azure-vista-recursos-tm-recursostrafficmanagercomponent-tsx)
- [`components/azure/vista-recursos-tm/info/RecursosTrafficManagerCardsComponent.tsx`](#components-azure-vista-recursos-tm-info-recursostrafficmanagercardscomponent-tsx)
- [`components/azure/vista-recursos-tm/info/RecursosTrafficManagerModalComponent.tsx`](#components-azure-vista-recursos-tm-info-recursostrafficmanagermodalcomponent-tsx)
- [`components/azure/vista-recursos-tm/table/RecursosTrafficManagerColumns.tsx`](#components-azure-vista-recursos-tm-table-recursostrafficmanagercolumns-tsx)
- [`components/azure/vista-recursos-tm/table/RecursosTrafficManagerTable.tsx`](#components-azure-vista-recursos-tm-table-recursostrafficmanagertable-tsx)

<a id="components-azure-vista-recursos-tm-mainviewrecursostrafficmanagercomponent-tsx"></a>
## `components/azure/vista-recursos-tm/MainViewRecursosTrafficManagerComponent.tsx`

**Componente**

Exporta:

- componente `MainViewRecursosTrafficManagerComponent` `()`

- Usa: [`RecursosTrafficManagerComponent.tsx`](#components-azure-vista-recursos-tm-recursostrafficmanagercomponent-tsx), [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-recursos-traffic-manager-page-tsx)

---

<a id="components-azure-vista-recursos-tm-recursostrafficmanagercomponent-tsx"></a>
## `components/azure/vista-recursos-tm/RecursosTrafficManagerComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RecursosTrafficManagerComponent` `({ startDate, endDate, selectedTm, subscription, region }: RecursosTrafficManagerComponentProps)`

Interfaz `RecursosTrafficManagerComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `selectedTm` | `string` | no | — |
| `subscription` | `string` | no | — |
| `region` | `string` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`

- API: `/api/azure/bridge/azure/traffic_managers/avg_query_returned_by_profile`, `/api/azure/bridge/azure/traffic_managers/traffic_manager_data`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx), [`trafficManagerInterfaces.ts`](../../tipos.md#interfaces-vista-traffic-manager-trafficmanagerinterfaces-ts), [`RecursosTrafficManagerCardsComponent.tsx`](#components-azure-vista-recursos-tm-info-recursostrafficmanagercardscomponent-tsx), [`RecursosTrafficManagerTable.tsx`](#components-azure-vista-recursos-tm-table-recursostrafficmanagertable-tsx), [`trafficManagerAvgQueriesReturnedInterfaces.ts`](../../tipos.md#interfaces-vista-traffic-manager-trafficmanageravgqueriesreturnedinterfaces-ts)
- Usado por: [`MainViewRecursosTrafficManagerComponent.tsx`](#components-azure-vista-recursos-tm-mainviewrecursostrafficmanagercomponent-tsx)

---

<a id="components-azure-vista-recursos-tm-info-recursostrafficmanagercardscomponent-tsx"></a>
## `components/azure/vista-recursos-tm/info/RecursosTrafficManagerCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RecursosTrafficManagerCardsComponent` `({ latestData }: RecursosTrafficManagerCardsComponentProps)`

Interfaz `RecursosTrafficManagerCardsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `latestData` | `TrafficManagerDataHistory` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`alert.tsx`](../ui.md#components-ui-alert-tsx), [`trafficManagerInterfaces.ts`](../../tipos.md#interfaces-vista-traffic-manager-trafficmanagerinterfaces-ts), [`RecursosTrafficManagerModalComponent.tsx`](#components-azure-vista-recursos-tm-info-recursostrafficmanagermodalcomponent-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx)
- Usado por: [`RecursosTrafficManagerComponent.tsx`](#components-azure-vista-recursos-tm-recursostrafficmanagercomponent-tsx)

Notas de implementación:

- JSX — Tarjeta Principal de Estado
- JSX — Tarjeta de Métricas y Salud
- JSX — Tarjeta de Insights / Ahorro (Dinámica)
- JSX — Insight 1: Sin Endpoints
- JSX — Insight 2: Monitor Inactivo en Perfil Activo
- JSX — Insight 3: Configuración Estándar

---

<a id="components-azure-vista-recursos-tm-info-recursostrafficmanagermodalcomponent-tsx"></a>
## `components/azure/vista-recursos-tm/info/RecursosTrafficManagerModalComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `RecursosTrafficManagerModalComponent` `({ endpoints, trigger, titleSuffix = '' }: RecursosTrafficManagerModalComponentProps)`

Interfaz `RecursosTrafficManagerModalComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `endpoints` | `TrafficManagetDataEndpoints[]` | no | — |
| `trigger` | `ReactNode` | no | — |
| `titleSuffix` | `string` | sí | — |

- Usa: [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx), [`trafficManagerInterfaces.ts`](../../tipos.md#interfaces-vista-traffic-manager-trafficmanagerinterfaces-ts)
- Usado por: [`RecursosTrafficManagerCardsComponent.tsx`](#components-azure-vista-recursos-tm-info-recursostrafficmanagercardscomponent-tsx), [`RecursosTrafficManagerColumns.tsx`](#components-azure-vista-recursos-tm-table-recursostrafficmanagercolumns-tsx)

Notas de implementación:

- `return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border…` — CheckingEndpoint etc
- JSX — Cabecera de la tarjeta
- JSX — Grid de detalles similar a UnusedTrafficManagerInsightModal

---

<a id="components-azure-vista-recursos-tm-table-recursostrafficmanagercolumns-tsx"></a>
## `components/azure/vista-recursos-tm/table/RecursosTrafficManagerColumns.tsx`

**Módulo (cliente)**

Exporta:

- constante `RecursosTrafficManagerColumns` = `[ { accessorKey: "_cq_sync_time", header: "Fecha de Sincronización", cell: ({ r…`

- Usa: [`trafficManagerInterfaces.ts`](../../tipos.md#interfaces-vista-traffic-manager-trafficmanagerinterfaces-ts), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`RecursosTrafficManagerModalComponent.tsx`](#components-azure-vista-recursos-tm-info-recursostrafficmanagermodalcomponent-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx)
- Usado por: [`RecursosTrafficManagerTable.tsx`](#components-azure-vista-recursos-tm-table-recursostrafficmanagertable-tsx)

---

<a id="components-azure-vista-recursos-tm-table-recursostrafficmanagertable-tsx"></a>
## `components/azure/vista-recursos-tm/table/RecursosTrafficManagerTable.tsx`

**Componente (cliente)**

Asumiendo que existe

Exporta:

- componente `RecursosTrafficManagerTable` `({ historyData }: RecursosTrafficManagerTableProps)`

Interfaz `RecursosTrafficManagerTableProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `historyData` | `TrafficManagerDataHistory[]` | no | — |

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`trafficManagerInterfaces.ts`](../../tipos.md#interfaces-vista-traffic-manager-trafficmanagerinterfaces-ts), [`RecursosTrafficManagerColumns.tsx`](#components-azure-vista-recursos-tm-table-recursostrafficmanagercolumns-tsx)
- Usado por: [`RecursosTrafficManagerComponent.tsx`](#components-azure-vista-recursos-tm-recursostrafficmanagercomponent-tsx)

Notas de implementación:

- Ordenar historial por fecha descendente (más reciente primero)
- Desactivamos agrupamiento complejo para esta vista simple

