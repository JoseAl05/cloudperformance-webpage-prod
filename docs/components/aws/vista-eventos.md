# Componentes `components/aws/vista-eventos/`

[← Índice](../../README.md)

Vista de eventos de AWS: conteos, tarjetas y tabla.

Archivos:

- [`components/aws/vista-eventos/EventsViewComponent.tsx`](#components-aws-vista-eventos-eventsviewcomponent-tsx)
- [`components/aws/vista-eventos/MainViewEventsComponent.tsx`](#components-aws-vista-eventos-mainvieweventscomponent-tsx)
- [`components/aws/vista-eventos/graficos/EventsViewEventCountComponent.tsx`](#components-aws-vista-eventos-graficos-eventsvieweventcountcomponent-tsx)
- [`components/aws/vista-eventos/info/EventsViewInfoCardsComponent.tsx`](#components-aws-vista-eventos-info-eventsviewinfocardscomponent-tsx)
- [`components/aws/vista-eventos/info/EventsViewInfoComponent.tsx`](#components-aws-vista-eventos-info-eventsviewinfocomponent-tsx)
- [`components/aws/vista-eventos/table/EventsViewColumns.tsx`](#components-aws-vista-eventos-table-eventsviewcolumns-tsx)
- [`components/aws/vista-eventos/table/EventsViewTableComponent.tsx`](#components-aws-vista-eventos-table-eventsviewtablecomponent-tsx)

<a id="components-aws-vista-eventos-eventsviewcomponent-tsx"></a>
## `components/aws/vista-eventos/EventsViewComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `EventsViewComponent` `({ startDate, endDate, eventType, region }: EventsViewComponentProps)`

Interfaz `EventsViewComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `eventType` | `string` | no | — |
| `region` | `string` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`
- función `isNullish` `(v: unknown)`

- API: `/api/aws/bridge/eventos/get_eventos`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx), [`eventsViewInterfaces.ts`](../../tipos.md#interfaces-vista-eventos-eventsviewinterfaces-ts), [`MessageCards.tsx`](cards.md#components-aws-cards-messagecards-tsx), [`EventsViewTableComponent.tsx`](#components-aws-vista-eventos-table-eventsviewtablecomponent-tsx), [`EventsViewInfoComponent.tsx`](#components-aws-vista-eventos-info-eventsviewinfocomponent-tsx), [`EventsViewEventCountComponent.tsx`](#components-aws-vista-eventos-graficos-eventsvieweventcountcomponent-tsx)
- Usado por: [`MainViewEventsComponent.tsx`](#components-aws-vista-eventos-mainvieweventscomponent-tsx)

---

<a id="components-aws-vista-eventos-mainvieweventscomponent-tsx"></a>
## `components/aws/vista-eventos/MainViewEventsComponent.tsx`

**Componente**

Exporta:

- componente `MainViewEventsComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`EventsViewComponent.tsx`](#components-aws-vista-eventos-eventsviewcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-eventos-page-tsx)

---

<a id="components-aws-vista-eventos-graficos-eventsvieweventcountcomponent-tsx"></a>
## `components/aws/vista-eventos/graficos/EventsViewEventCountComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `EventsViewEventCountComponent` `({ data, sortDesc = true }: EventsViewEventCountComponentProps)`

Interfaz `EventsViewEventCountComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `EventGroup[][] \| null` | no | — |
| `sortDesc` | `boolean` | sí | — |

Internos:

- constante `palette`

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`eventsViewInterfaces.ts`](../../tipos.md#interfaces-vista-eventos-eventsviewinterfaces-ts), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`EventsViewComponent.tsx`](#components-aws-vista-eventos-eventsviewcomponent-tsx)

---

<a id="components-aws-vista-eventos-info-eventsviewinfocardscomponent-tsx"></a>
## `components/aws/vista-eventos/info/EventsViewInfoCardsComponent.tsx`

**Componente**

Exporta:

- componente `EventsViewInfoCardsComponent` `({ infoData }: EventsViewInfoCardsComponentProps)`

Interfaz `EventsViewInfoCardsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `infoData` | `EventsApiResponse \| null` | no | — |

Internos:

- constante `ICONS`
- constante `BORDERS`

- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`eventsViewInterfaces.ts`](../../tipos.md#interfaces-vista-eventos-eventsviewinterfaces-ts)
- Usado por: [`EventsViewInfoComponent.tsx`](#components-aws-vista-eventos-info-eventsviewinfocomponent-tsx)

Notas de implementación:

- Total global de eventos (suma de docs)
- 1) NUEVO: contar total de docs por event_name en todo el periodo
- 2) Usar el conteo anterior para construir las cards
- `});` — ahora muestra totales de eventos (docs) por tipo

---

<a id="components-aws-vista-eventos-info-eventsviewinfocomponent-tsx"></a>
## `components/aws/vista-eventos/info/EventsViewInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `EventsViewInfoComponent` `({ infoData }: EventsViewInfoComponentProps)`

Interfaz `EventsViewInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `infoData` | `EventsApiResponse[] \| null` | no | — |

- Usa: [`eventsViewInterfaces.ts`](../../tipos.md#interfaces-vista-eventos-eventsviewinterfaces-ts), [`EventsViewInfoCardsComponent.tsx`](#components-aws-vista-eventos-info-eventsviewinfocardscomponent-tsx)
- Usado por: [`EventsViewComponent.tsx`](#components-aws-vista-eventos-eventsviewcomponent-tsx)

---

<a id="components-aws-vista-eventos-table-eventsviewcolumns-tsx"></a>
## `components/aws/vista-eventos/table/EventsViewColumns.tsx`

**Módulo (cliente)**

Exporta:

- constante `EventsViewColumns` = `[ { id: 'EventName', header: 'Evento', accessorKey: 'EventName', enableSorting:…`

Internos:

- función `getAwsConsoleUrl` `(resourceType: string, resourceName: string, region = 'us-east-1')`
- función `getNormalizedResources` `(row: FlatEventRow)`
- función `copyToClipboard` `(text: string, label?: string)`
- función `fmtDateTime` `(v?: string)`
- función `truncateMiddle` `(str: string, keep = 36)`
- componente `ResourcesDialogCell` `({ row }: { row: FlatEventRow })`

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`EventsViewTableComponent.tsx`](#components-aws-vista-eventos-table-eventsviewtablecomponent-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx), [`button.tsx`](../ui.md#components-ui-button-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`scroll-area.tsx`](../ui.md#components-ui-scroll-area-tsx)
- Usado por: [`EventsViewTableComponent.tsx`](#components-aws-vista-eventos-table-eventsviewtablecomponent-tsx)

---

<a id="components-aws-vista-eventos-table-eventsviewtablecomponent-tsx"></a>
## `components/aws/vista-eventos/table/EventsViewTableComponent.tsx`

**Componente**

Exporta:

- tipo `FlatEventRow` = `ApiDoc & { EventName: string; ResourceTypes?: string; ResourceNames?: string; ResourceCount?: number; }`
- componente `EventsViewTableComponent` `({ data, startDate, endDate, eventType }: EventsViewTableComponentProps)`

Interfaz `EventsViewTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `EventsApiResponse \| FlatEventRow[] \| null` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `eventType` | `string` | no | — |

Internos:

- función `mapApiToFlatRows` `(api: EventsApiResponse | null | undefined): FlatEventRow[]`

- Usa: [`columns.tsx`](../data-table.md#components-data-table-columns-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`eventsViewInterfaces.ts`](../../tipos.md#interfaces-vista-eventos-eventsviewinterfaces-ts), [`EventsViewColumns.tsx`](#components-aws-vista-eventos-table-eventsviewcolumns-tsx)
- Usado por: [`EventsViewComponent.tsx`](#components-aws-vista-eventos-eventsviewcomponent-tsx), [`EventsViewColumns.tsx`](#components-aws-vista-eventos-table-eventsviewcolumns-tsx)

