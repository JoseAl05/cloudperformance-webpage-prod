# Componentes `components/gcp/vista-reservas/`

[← Índice](../../README.md)

Reservas de capacidad de GCP.

Archivos:

- [`components/gcp/vista-reservas/MainViewReservationsComponent.tsx`](#components-gcp-vista-reservas-mainviewreservationscomponent-tsx)
- [`components/gcp/vista-reservas/ReservationsComponent.tsx`](#components-gcp-vista-reservas-reservationscomponent-tsx)
- [`components/gcp/vista-reservas/graficos/ReservationsBarChartComponent.tsx`](#components-gcp-vista-reservas-graficos-reservationsbarchartcomponent-tsx)
- [`components/gcp/vista-reservas/table/ReservationsTable.tsx`](#components-gcp-vista-reservas-table-reservationstable-tsx)

<a id="components-gcp-vista-reservas-mainviewreservationscomponent-tsx"></a>
## `components/gcp/vista-reservas/MainViewReservationsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewReservationsComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`ReservationsComponent.tsx`](#components-gcp-vista-reservas-reservationscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-reservas-page-tsx)

---

<a id="components-gcp-vista-reservas-reservationscomponent-tsx"></a>
## `components/gcp/vista-reservas/ReservationsComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `ReservationData` — Types
- componente `ReservationsAnalysisComponent` `({ startDate, endDate }: ReservationsComponentProps)` — Component

Interfaz `ReservationData` (exportada) — Types:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `nombre_reserva` | `string` | no | — |
| `zona` | `string` | no | — |
| `tipo_maquina` | `string` | no | — |
| `cantidad_vms` | `number` | no | — |
| `estado` | `string` | no | — |
| `horas_inactivas` | `number` | no | — |
| `dinero_perdido_usd` | `number` | no | — |

Interfaz `ReservationsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |

Internos:

- función `formatCurrency` `(amount: number)` — Utils & Formatters

- API: `/api/gcp/bridge/gcp/vista/reservas`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx), [`LoaderComponent.tsx`](../general_gcp.md#components-general-gcp-loadercomponent-tsx), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`ReservationsTable.tsx`](#components-gcp-vista-reservas-table-reservationstable-tsx), [`ReservationsBarChartComponent.tsx`](#components-gcp-vista-reservas-graficos-reservationsbarchartcomponent-tsx)
- Usado por: [`MainViewReservationsComponent.tsx`](#components-gcp-vista-reservas-mainviewreservationscomponent-tsx), [`ReservationsBarChartComponent.tsx`](#components-gcp-vista-reservas-graficos-reservationsbarchartcomponent-tsx)

Notas de implementación:

- _ReservationsAnalysisComponent_: Preparamos las fechas
- _ReservationsAnalysisComponent_: Llamada al endpoint
- _ReservationsAnalysisComponent_: 1. Manejo de Carga
- _ReservationsAnalysisComponent_: 2. Manejo de Errores de Red
- _ReservationsAnalysisComponent_: 3. ADAPTACIÓN AL FORMATO DEL ENDPOINT
- _ReservationsAnalysisComponent_: Escenario Ideal: El endpoint devolvió la lista directamente
- _ReservationsAnalysisComponent_: Escenario Alternativo: Viene envuelto (ej. { data: [...] } ) o es un mensaje de error
- _ReservationsAnalysisComponent_: Si sigue vacío y detectamos un error de FastAPI (detail/message)
- _ReservationsAnalysisComponent_: 4. Validación de datos vacíos (Sin reservas)
- _ReservationsAnalysisComponent_: 5. CÁLCULO DE KPIs (A prueba de fallos) Ahora usamos 'reservasArray', garantizando que SIEMPRE es una lista
- _ReservationsAnalysisComponent_: Lógica de estado
- _ReservationsAnalysisComponent_: JSX — HEADER
- _ReservationsAnalysisComponent_: JSX — DIAGNÓSTICO INTELIGENTE
- _ReservationsAnalysisComponent_: JSX — TARJETAS DE INDICADORES (KPIs)
- _ReservationsAnalysisComponent_: JSX — Tarjeta 1
- _ReservationsAnalysisComponent_: JSX — Tarjeta 2
- _ReservationsAnalysisComponent_: JSX — Tarjeta 3
- _ReservationsAnalysisComponent_: JSX — Tarjeta 4
- _ReservationsAnalysisComponent_: JSX — GRÁFICO DE ECHARTS
- _ReservationsAnalysisComponent_: JSX — TABLA DE DETALLES
- _ReservationsAnalysisComponent_: JSX — Le pasamos reservasArray, garantizando que la tabla nunca se rompa

---

<a id="components-gcp-vista-reservas-graficos-reservationsbarchartcomponent-tsx"></a>
## `components/gcp/vista-reservas/graficos/ReservationsBarChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ReservationsBarChartComponent` `({ data }: ReservationsBarChartProps)`

Interfaz `ReservationsBarChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ReservationData[]` | no | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`button.tsx`](../ui.md#components-ui-button-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts), [`ReservationsComponent.tsx`](#components-gcp-vista-reservas-reservationscomponent-tsx)
- Usado por: [`ReservationsComponent.tsx`](#components-gcp-vista-reservas-reservationscomponent-tsx)

Notas de implementación:

- Calculamos si hay dinero perdido en general
- EL FIX: Si el total desperdiciado es 0, mostramos un mensaje de éxito

---

<a id="components-gcp-vista-reservas-table-reservationstable-tsx"></a>
## `components/gcp/vista-reservas/table/ReservationsTable.tsx`

**Componente (cliente)**

Exporta:

- interfaz `ReservationData`
- componente `ReservationsTable` `({ data }: ReservationsTableProps)`

Interfaz `ReservationData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `nombre_reserva` | `string` | no | — |
| `zona` | `string` | no | — |
| `tipo_maquina` | `string` | no | — |
| `cantidad_vms` | `number` | no | — |
| `estado` | `string` | no | — |
| `horas_inactivas` | `number` | no | — |
| `dinero_perdido_usd` | `number` | no | — |

Interfaz `ReservationsTableProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `ReservationData[]` | no | — |

- Usa: [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx)
- Usado por: [`ReservationsComponent.tsx`](#components-gcp-vista-reservas-reservationscomponent-tsx)

