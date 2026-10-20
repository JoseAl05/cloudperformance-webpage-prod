# Componentes `components/presupuesto/`

[← Índice](../README.md)

Presupuestos (versión común a las nubes): centros de costo, presupuesto anual y mensual, y costos vs presupuesto.

Archivos:

- [`components/presupuesto/MainMenuComponent.tsx`](#components-presupuesto-mainmenucomponent-tsx)
- [`components/presupuesto/MainViewPresupuestoComponent.tsx`](#components-presupuesto-mainviewpresupuestocomponent-tsx)
- [`components/presupuesto/centro-de-costo/CentroDeCostoComponent.tsx`](#components-presupuesto-centro-de-costo-centrodecostocomponent-tsx)
- [`components/presupuesto/centro-de-costo/MainViewCentroDeCostoComponent.tsx`](#components-presupuesto-centro-de-costo-mainviewcentrodecostocomponent-tsx)
- [`components/presupuesto/centro-de-costo/form/CentroDeCostoFormComponent.tsx`](#components-presupuesto-centro-de-costo-form-centrodecostoformcomponent-tsx)
- [`components/presupuesto/centro-de-costo/table/CentroDeCostoTableComponent.tsx`](#components-presupuesto-centro-de-costo-table-centrodecostotablecomponent-tsx)
- [`components/presupuesto/costo-vs-presupuesto/CostosVsPresupuestoComponent.tsx`](#components-presupuesto-costo-vs-presupuesto-costosvspresupuestocomponent-tsx)
- [`components/presupuesto/costo-vs-presupuesto/MainViewCostoVsPresupuestoComponent.tsx`](#components-presupuesto-costo-vs-presupuesto-mainviewcostovspresupuestocomponent-tsx)
- [`components/presupuesto/costo-vs-presupuesto/graficos/CostosVsPresupuestoViewSummaryComponent.tsx`](#components-presupuesto-costo-vs-presupuesto-graficos-costosvspresupuestoviewsummarycomponent-tsx)
- [`components/presupuesto/costo-vs-presupuesto/table/ComparacionMensualTableComponent.tsx`](#components-presupuesto-costo-vs-presupuesto-table-comparacionmensualtablecomponent-tsx)
- [`components/presupuesto/presupuesto-anual/MainViewPresupuestoAnualComponent.tsx`](#components-presupuesto-presupuesto-anual-mainviewpresupuestoanualcomponent-tsx)
- [`components/presupuesto/presupuesto-anual/PresupuestoAnualComponent.tsx`](#components-presupuesto-presupuesto-anual-presupuestoanualcomponent-tsx)
- [`components/presupuesto/presupuesto-anual/form/PresupuestoAnualFormComponent.tsx`](#components-presupuesto-presupuesto-anual-form-presupuestoanualformcomponent-tsx)
- [`components/presupuesto/presupuesto-anual/table/PresupuestoAnualTableComponent.tsx`](#components-presupuesto-presupuesto-anual-table-presupuestoanualtablecomponent-tsx)
- [`components/presupuesto/presupuesto-mensual/MainViewPresupuestoMensualComponent.tsx`](#components-presupuesto-presupuesto-mensual-mainviewpresupuestomensualcomponent-tsx)
- [`components/presupuesto/presupuesto-mensual/PresupuestoMensualComponent.tsx`](#components-presupuesto-presupuesto-mensual-presupuestomensualcomponent-tsx)
- [`components/presupuesto/presupuesto-mensual/form/PresupuestoMensualFormComponent.tsx`](#components-presupuesto-presupuesto-mensual-form-presupuestomensualformcomponent-tsx)
- [`components/presupuesto/presupuesto-mensual/table/PresupuestoMensualTableComponent.tsx`](#components-presupuesto-presupuesto-mensual-table-presupuestomensualtablecomponent-tsx)

<a id="components-presupuesto-mainmenucomponent-tsx"></a>
## `components/presupuesto/MainMenuComponent.tsx`

**Módulo (cliente)**

🔑 Necesario para hooks y eventos del DOM

Exporta:

- export default `MainMenuComponent`

Interfaz `Module` — ✅ Definimos la interfaz de los módulos:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `title` | `string` | no | — |
| `description` | `string` | no | — |
| `path` | `string` | no | — |

Internos:

- componente `MainMenuComponent` `()`

- Hooks: `useRouter`
- Usado por: [`MainViewPresupuestoComponent.tsx`](#components-presupuesto-mainviewpresupuestocomponent-tsx)

Notas de implementación:

- Array de módulos tipado
- Puedes agregar más módulos aquí
- `onClick={() => router.push(mod.path)}` — Navegación usando Next.js

---

<a id="components-presupuesto-mainviewpresupuestocomponent-tsx"></a>
## `components/presupuesto/MainViewPresupuestoComponent.tsx`

**Componente**

Exporta:

- componente `MainViewPresupuestoComponent` `()`

- Usa: [`MainMenuComponent.tsx`](#components-presupuesto-mainmenucomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-presupuesto-presupuesto-page-tsx)

Notas de implementación:

- JSX — Sección de encabezado
- JSX — Aquí puedes integrar HomePage como un subcomponente

---

<a id="components-presupuesto-centro-de-costo-centrodecostocomponent-tsx"></a>
## `components/presupuesto/centro-de-costo/CentroDeCostoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `CentroDeCostoComponent` `({ cloud }: CentroDeCostoComponentProps)`

Interfaz `CentroDeCostoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `string` | no | — |

- API: `/api/presupuesto/bridge/{…}/centro-costo`, `/api/presupuesto/bridge/{…}/centro-costo/{…}`
- Usa: [`button.tsx`](ui.md#components-ui-button-tsx), [`dialog.tsx`](ui.md#components-ui-dialog-tsx), [`alert-dialog.tsx`](ui.md#components-ui-alert-dialog-tsx), [`CentroDeCostoTableComponent.tsx`](#components-presupuesto-centro-de-costo-table-centrodecostotablecomponent-tsx), [`CentroDeCostoFormComponent.tsx`](#components-presupuesto-centro-de-costo-form-centrodecostoformcomponent-tsx), [`SesionGate.tsx`](general_presupuesto.md#components-general-presupuesto-session-sesiongate-tsx)
- Usado por: [`MainViewCentroDeCostoComponent.tsx`](#components-presupuesto-centro-de-costo-mainviewcentrodecostocomponent-tsx)

Notas de implementación:

- Estados
- Acciones
- Mostrar mensaje de éxito
- Mostrar mensaje de éxito
- Render
- JSX — MODAL FORMULARIO
- JSX — DIALOG CONFIRMACIÓN DE ELIMINACIÓN
- JSX — DIALOG ERROR
- JSX — DIALOG ÉXITO

---

<a id="components-presupuesto-centro-de-costo-mainviewcentrodecostocomponent-tsx"></a>
## `components/presupuesto/centro-de-costo/MainViewCentroDeCostoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewCentroDeCostoComponent` `()`

- Usa: [`SesionGate.tsx`](general_presupuesto.md#components-general-presupuesto-session-sesiongate-tsx), [`FiltersComponent.tsx`](general_presupuesto.md#components-general-presupuesto-filters-filterscomponent-tsx), [`CentroDeCostoComponent.tsx`](#components-presupuesto-centro-de-costo-centrodecostocomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-presupuesto-presupuesto-centro-de-costo-page-tsx)

---

<a id="components-presupuesto-centro-de-costo-form-centrodecostoformcomponent-tsx"></a>
## `components/presupuesto/centro-de-costo/form/CentroDeCostoFormComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `CentroCosto`
- componente `CentroDeCostoFormComponent` `({ onSubmit, onCancel, initialData, dateFrom, dateTo, region = "all_regions", subscription = "all_subscriptions", })`
- export default `CentroDeCostoFormComponent`

Interfaz `CentroCosto` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_centro_costo` | `number \| string` | no | — |
| `nombre_centro` | `string` | no | — |
| `responsable_centro` | `string` | no | — |
| `localizacion` | `string` | no | — |
| `tags` | `string[]` | sí | — |

Interfaz `CentroCostoFormProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `onSubmit` | `(data: CentroCosto) => void` | no | — |
| `onCancel` | `() => void` | sí | — |
| `initialData` | `CentroCosto \| null` | sí | — |
| `dateFrom` | `string` | sí | Props para la API de tags |
| `dateTo` | `string` | sí | — |
| `region` | `string` | sí | — |
| `subscription` | `string` | sí | — |

Interfaz `TagResponse`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `Key` | `string` | no | — |
| `Values` | `string[]` | no | — |

- API: `/api/azure/bridge/azure/get-all-tags`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts)
- Usado por: [`CentroDeCostoComponent.tsx`](#components-presupuesto-centro-de-costo-centrodecostocomponent-tsx)

Notas de implementación:

- _CentroDeCostoFormComponent_: Calcular fechas del último año solo una vez
- _CentroDeCostoFormComponent_: Llamada a la API para obtener tags
- _CentroDeCostoFormComponent_: `dedupingInterval: 60000,` — Cache por 1 minuto
- _CentroDeCostoFormComponent_: Procesar los tags de la API para obtener pares clave:valor
- _CentroDeCostoFormComponent_: Para cada Key, crear un par clave:valor por cada Value
- _CentroDeCostoFormComponent_: Solo agregar si el valor no está vacío
- _CentroDeCostoFormComponent_: Si el valor está vacío, solo agregar la clave
- _CentroDeCostoFormComponent_: Filtrar tags por búsqueda y excluir ya seleccionados
- _CentroDeCostoFormComponent_: JSX — ID Centro
- _CentroDeCostoFormComponent_: JSX — Nombre Centro
- _CentroDeCostoFormComponent_: JSX — Responsable
- _CentroDeCostoFormComponent_: JSX — Localización
- _CentroDeCostoFormComponent_: JSX — Tags
- _CentroDeCostoFormComponent_: JSX — Input de búsqueda
- _CentroDeCostoFormComponent_: JSX — Mostrar error si hay
- _CentroDeCostoFormComponent_: JSX — Dropdown personalizado
- _CentroDeCostoFormComponent_: JSX — Opción "Todas las tags"
- _CentroDeCostoFormComponent_: JSX — Lista con scroll
- _CentroDeCostoFormComponent_: Separar clave y valor para mejor visualización
- _CentroDeCostoFormComponent_: JSX — Mensaje cuando no hay resultados
- _CentroDeCostoFormComponent_: JSX — Click fuera para cerrar
- _CentroDeCostoFormComponent_: JSX — Tags seleccionados
- _CentroDeCostoFormComponent_: Separar clave y valor para mejor visualización
- _CentroDeCostoFormComponent_: JSX — Buttons

---

<a id="components-presupuesto-centro-de-costo-table-centrodecostotablecomponent-tsx"></a>
## `components/presupuesto/centro-de-costo/table/CentroDeCostoTableComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `CentroDeCostoTableComponent` `({ cloud, onEdit, onDelete }: CentroDeCostoTableComponentProps)`
- export default `CentroDeCostoTableComponent`

Interfaz `CentroCosto`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_centro_costo` | `number` | no | — |
| `nombre_centro` | `string` | no | — |
| `responsable_centro` | `string` | no | — |
| `localizacion` | `string` | no | — |
| `tags` | `string[]` | sí | — |

Interfaz `CentroDeCostoTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `string` | sí | — |
| `onEdit` | `(data: CentroCosto) => void` | sí | — |
| `onDelete` | `(id: number \| string) => void` | sí | — |

- Tipo interno `SortField` = `keyof CentroCosto | null`
- Tipo interno `SortOrder` = `"asc" | "desc" | null`
- API: `/api/presupuesto/bridge/{…}/centro-costo`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts)
- Usado por: [`CentroDeCostoComponent.tsx`](#components-presupuesto-centro-de-costo-centrodecostocomponent-tsx)

Notas de implementación:

- JSX — Search Bar
- JSX — Table Container
- JSX — Footer con Pagination

---

<a id="components-presupuesto-costo-vs-presupuesto-costosvspresupuestocomponent-tsx"></a>
## `components/presupuesto/costo-vs-presupuesto/CostosVsPresupuestoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `CostosVsPresupuestoComponent` `({ cloud, anio }: CentroDeCostoComponentProps)`

Interfaz `CentroDeCostoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `string` | no | — |
| `anio` | `string` | no | — |

Interfaz `PresupuestoMensual`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_presupuesto_mensual` | `number` | no | — |
| `mes` | `number` | no | — |
| `anio` | `number` | no | — |
| `monto_mensual_asociado` | `string` | no | — |
| `monto_real_mes` | `string` | no | — |
| `monto_forecast_mes` | `string` | no | — |

Interfaz `PresupuestoAnual`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_presupuesto_anual` | `number` | no | — |
| `id_centro_costo` | `number` | no | — |
| `anio` | `number` | no | — |
| `monto_anual_asociado` | `string` | no | — |
| `presupuestos_mensuales` | `PresupuestoMensual[] \| null` | no | — |

Interfaz `FacturacionAnual`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `year` | `number` | no | — |
| `month` | `number` | no | — |
| `total_cost` | `number` | no | — |
| `count` | `number` | no | — |

- API: `/api/presupuesto/bridge/{…}/presupuesto/summary/anual`, `/api/{…}/bridge/facturacion/facturacion-anual`, `/api/{…}/bridge/{…}/facturacion/facturacion-anual`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`LoaderComponent.tsx`](general_presupuesto.md#components-general-presupuesto-loadercomponent-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`CostosVsPresupuestoViewSummaryComponent.tsx`](#components-presupuesto-costo-vs-presupuesto-graficos-costosvspresupuestoviewsummarycomponent-tsx), [`ComparacionMensualTableComponent.tsx`](#components-presupuesto-costo-vs-presupuesto-table-comparacionmensualtablecomponent-tsx)
- Usado por: [`MainViewCostoVsPresupuestoComponent.tsx`](#components-presupuesto-costo-vs-presupuesto-mainviewcostovspresupuestocomponent-tsx)

Notas de implementación:

- SWR para presupuesto anual
- SWR para facturación anual
- Loader
- Error
- Validar data
- Función para calcular totales de presupuesto anual
- Totales presupuesto anual
- Formatear números a USD
- JSX — Tarjetas resumen
- JSX — Facturación
- JSX — Total Presupuesto
- JSX — Totales mensuales
- JSX — Presupuestos por Centro de Costo

---

<a id="components-presupuesto-costo-vs-presupuesto-mainviewcostovspresupuestocomponent-tsx"></a>
## `components/presupuesto/costo-vs-presupuesto/MainViewCostoVsPresupuestoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewCostoVsPresupuestoComponent` `()`

- Usa: [`SesionGate.tsx`](general_presupuesto.md#components-general-presupuesto-session-sesiongate-tsx), [`FiltersComponent.tsx`](general_presupuesto.md#components-general-presupuesto-filters-filterscomponent-tsx), [`CostosVsPresupuestoComponent.tsx`](#components-presupuesto-costo-vs-presupuesto-costosvspresupuestocomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-presupuesto-presupuesto-costos-vs-presupuesto-page-tsx)

---

<a id="components-presupuesto-costo-vs-presupuesto-graficos-costosvspresupuestoviewsummarycomponent-tsx"></a>
## `components/presupuesto/costo-vs-presupuesto/graficos/CostosVsPresupuestoViewSummaryComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `CostosVsPresupuestoChart` `({ data, facturacionData }: CostosVsPresupuestoChartProps)`

Interfaz `PresupuestoMensual`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_presupuesto_mensual` | `number` | no | — |
| `mes` | `number` | no | — |
| `anio` | `number` | no | — |
| `monto_mensual_asociado` | `string` | no | — |
| `monto_real_mes` | `string` | no | — |
| `monto_forecast_mes` | `string` | no | — |

Interfaz `PresupuestoAnual`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_presupuesto_anual` | `number` | no | — |
| `id_centro_costo` | `number` | no | — |
| `anio` | `number` | no | — |
| `monto_anual_asociado` | `string` | no | — |
| `presupuestos_mensuales` | `PresupuestoMensual[] \| null` | no | — |

Interfaz `FacturacionAnual`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `year` | `number` | no | — |
| `month` | `number` | no | — |
| `total_cost` | `number` | no | — |
| `count` | `number` | no | — |

Interfaz `CostosVsPresupuestoChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `PresupuestoAnual[] \| null` | no | — |
| `facturacionData` | `FacturacionAnual[] \| null` | sí | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`CostosVsPresupuestoComponent.tsx`](#components-presupuesto-costo-vs-presupuesto-costosvspresupuestocomponent-tsx)

Notas de implementación:

- Agrupar todos los datos mensuales
- Crear clave única: año-mes (formato YYYY-MM)
- Procesar datos de facturación
- Ordenar por fecha
- Ordenar por fecha y convertir a arrays para el gráfico
- Calcular el máximo para el eje Y
- Agregar serie de Facturación Real si existe

---

<a id="components-presupuesto-costo-vs-presupuesto-table-comparacionmensualtablecomponent-tsx"></a>
## `components/presupuesto/costo-vs-presupuesto/table/ComparacionMensualTableComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ComparacionMensualTableComponent` `({ dataPresupuesto, dataFacturacion }: ComparacionMensualTableComponentProps)`
- export default `ComparacionMensualTableComponent`

Interfaz `PresupuestoMensual`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_presupuesto_mensual` | `number` | no | — |
| `mes` | `number` | no | — |
| `anio` | `number` | no | — |
| `monto_mensual_asociado` | `string` | no | — |
| `monto_real_mes` | `string` | no | — |
| `monto_forecast_mes` | `string` | no | — |

Interfaz `PresupuestoAnual`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_presupuesto_anual` | `number` | no | — |
| `id_centro_costo` | `number` | no | — |
| `anio` | `number` | no | — |
| `monto_anual_asociado` | `string` | no | — |
| `presupuestos_mensuales` | `PresupuestoMensual[] \| null` | no | — |

Interfaz `FacturacionAnual`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `year` | `number` | no | — |
| `month` | `number` | no | — |
| `total_cost` | `number` | no | — |
| `count` | `number` | no | — |

Interfaz `DatosMensuales`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `mes` | `number` | no | — |
| `nombreMes` | `string` | no | — |
| `presupuesto` | `number` | no | — |
| `real` | `number` | no | — |
| `forecast` | `number` | no | — |
| `facturacion` | `number` | no | — |
| `diferencia` | `number` | no | — |
| `porcentajeUsado` | `number` | no | — |

Interfaz `ComparacionMensualTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `dataPresupuesto` | `PresupuestoAnual[] \| null` | no | — |
| `dataFacturacion` | `FacturacionAnual[] \| null` | no | — |

- Tipo interno `SortField` = `keyof DatosMensuales | null`
- Tipo interno `SortOrder` = `"asc" | "desc" | null`
Internos:

- constante `MESES`

- Usado por: [`CostosVsPresupuestoComponent.tsx`](#components-presupuesto-costo-vs-presupuesto-costosvspresupuestocomponent-tsx)

Notas de implementación:

- Inicializar todos los meses
- Sumar presupuestos, real y forecast por mes
- Sumar facturación por mes
- Crear array final
- Aplicar ordenamiento
- JSX — Table Container
- JSX — Fila de totales

---

<a id="components-presupuesto-presupuesto-anual-mainviewpresupuestoanualcomponent-tsx"></a>
## `components/presupuesto/presupuesto-anual/MainViewPresupuestoAnualComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewPresupuestoAnualComponent` `()`

- Usa: [`SesionGate.tsx`](general_presupuesto.md#components-general-presupuesto-session-sesiongate-tsx), [`FiltersComponent.tsx`](general_presupuesto.md#components-general-presupuesto-filters-filterscomponent-tsx), [`PresupuestoAnualComponent.tsx`](#components-presupuesto-presupuesto-anual-presupuestoanualcomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-presupuesto-presupuesto-presupuesto-anual-page-tsx)

---

<a id="components-presupuesto-presupuesto-anual-presupuestoanualcomponent-tsx"></a>
## `components/presupuesto/presupuesto-anual/PresupuestoAnualComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `PresupuestoAnualComponent` `({ cloud }: PresupuestoAnualComponentProps)`

Interfaz `PresupuestoAnualComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `string` | no | — |

- API: `/api/presupuesto/bridge/{…}/presupuesto/anual`, `/api/presupuesto/bridge/{…}/presupuesto/anual/{…}`
- Usa: [`button.tsx`](ui.md#components-ui-button-tsx), [`dialog.tsx`](ui.md#components-ui-dialog-tsx), [`alert-dialog.tsx`](ui.md#components-ui-alert-dialog-tsx), [`PresupuestoAnualTableComponent.tsx`](#components-presupuesto-presupuesto-anual-table-presupuestoanualtablecomponent-tsx), [`PresupuestoAnualFormComponent.tsx`](#components-presupuesto-presupuesto-anual-form-presupuestoanualformcomponent-tsx), [`SesionGate.tsx`](general_presupuesto.md#components-general-presupuesto-session-sesiongate-tsx)
- Usado por: [`MainViewPresupuestoAnualComponent.tsx`](#components-presupuesto-presupuesto-anual-mainviewpresupuestoanualcomponent-tsx)

Notas de implementación:

- Estados
- Acciones
- Revalidar los datos de la tabla
- Mostrar mensaje de éxito
- Revalidar los datos de la tabla
- Mostrar mensaje de éxito
- Render
- JSX — Header
- JSX — Tabla de presupuestos
- JSX — MODAL FORMULARIO
- JSX — DIALOG CONFIRMACIÓN DE ELIMINACIÓN
- JSX — DIALOG ERROR
- JSX — DIALOG ÉXITO

---

<a id="components-presupuesto-presupuesto-anual-form-presupuestoanualformcomponent-tsx"></a>
## `components/presupuesto/presupuesto-anual/form/PresupuestoAnualFormComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `PresupuestoAnual`
- componente `PresupuestoAnualFormComponent` `({ onSubmit, onCancel, initialData, cloud, })`
- export default `PresupuestoAnualFormComponent`

Interfaz `CentroCosto`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_centro_costo` | `number` | no | — |
| `nombre_centro` | `string` | no | — |
| `responsable_centro` | `string` | no | — |
| `localizacion` | `string` | no | — |

Interfaz `PresupuestoMensualPostPut`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `mes` | `number` | no | — |
| `anio` | `number` | no | — |
| `monto_mensual_asociado` | `string` | no | — |
| `monto_real_mes` | `string` | no | — |
| `monto_forecast_mes` | `string` | no | — |

Interfaz `PresupuestoMensualGet`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_presupuesto_mensual` | `number` | sí | — |
| `mes` | `number` | no | — |
| `anio` | `number` | no | — |
| `monto_mensual_asociado` | `string` | no | — |
| `monto_real_mes` | `string` | no | — |
| `monto_forecast_mes` | `string` | no | — |

Interfaz `PresupuestoAnual` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_presupuesto_anual` | `number` | sí | — |
| `id_centro_costo` | `number \| string` | no | — |
| `anio` | `number \| string` | no | — |
| `monto_anual_asociado` | `string` | no | — |
| `presupuestos_mensuales` | `PresupuestoMensualPostPut[] \| null` | no | — |

Interfaz `PresupuestoAnualFormProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `onSubmit` | `(data: PresupuestoAnual) => void` | no | — |
| `onCancel` | `() => void` | sí | — |
| `initialData` | `PresupuestoAnual \| null` | sí | — |
| `cloud` | `string` | sí | — |

Internos:

- constante `MESES_NOMBRES`

- API: `/api/presupuesto/bridge/{…}/centro-costo`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts)
- Usado por: [`PresupuestoAnualComponent.tsx`](#components-presupuesto-presupuesto-anual-presupuestoanualcomponent-tsx)

Notas de implementación:

- _PresupuestoAnualFormComponent_: Fetch centros de costo
- _PresupuestoAnualFormComponent_: Si tiene meses, mostrar el formulario mensual
- _PresupuestoAnualFormComponent_: Solo cambiar la visibilidad, NO modificar los datos
- _PresupuestoAnualFormComponent_: Si no hay meses y estamos mostrando el form, inicializar con array vacío
- _PresupuestoAnualFormComponent_: Obtener meses ya agregados
- _PresupuestoAnualFormComponent_: Obtener meses disponibles para agregar
- _PresupuestoAnualFormComponent_: Agregar nuevo mes
- _PresupuestoAnualFormComponent_: Eliminar mes (solo en modo creación)
- _PresupuestoAnualFormComponent_: No permitir eliminar en modo edición
- _PresupuestoAnualFormComponent_: Verificar si estamos en modo edición
- _PresupuestoAnualFormComponent_: JSX — Campos principales
- _PresupuestoAnualFormComponent_: JSX — Centro de Costo
- _PresupuestoAnualFormComponent_: JSX — Año
- _PresupuestoAnualFormComponent_: JSX — Monto Anual
- _PresupuestoAnualFormComponent_: JSX — Toggle Desglose Mensual
- _PresupuestoAnualFormComponent_: JSX — Formulario de desglose mensual
- _PresupuestoAnualFormComponent_: JSX — Selector para agregar meses
- _PresupuestoAnualFormComponent_: JSX — Información del total con porcentaje
- _PresupuestoAnualFormComponent_: JSX — Barra de progreso de porcentaje asignado
- _PresupuestoAnualFormComponent_: JSX — Barra de progreso
- _PresupuestoAnualFormComponent_: JSX — Grid de meses
- _PresupuestoAnualFormComponent_: JSX — Solo mostrar botón eliminar en modo creación
- _PresupuestoAnualFormComponent_: JSX — Buttons

---

<a id="components-presupuesto-presupuesto-anual-table-presupuestoanualtablecomponent-tsx"></a>
## `components/presupuesto/presupuesto-anual/table/PresupuestoAnualTableComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `PresupuestoAnualTableComponent` `({ cloud, onEdit, onDelete }: PresupuestoAnualTableComponentProps)`
- export default `PresupuestoAnualTableComponent`

Interfaz `PresupuestoMensual` — Tipos del schema:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_presupuesto_mensual` | `number` | no | — |
| `mes` | `number` | no | — |
| `anio` | `number` | no | — |
| `monto_mensual_asociado` | `string` | no | — |
| `monto_real_mes` | `string` | no | — |
| `monto_forecast_mes` | `string` | no | — |

Interfaz `PresupuestoAnual`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_presupuesto_anual` | `number` | no | — |
| `id_centro_costo` | `number` | no | — |
| `anio` | `number` | no | — |
| `monto_anual_asociado` | `string` | no | — |
| `presupuestos_mensuales` | `PresupuestoMensual[] \| null` | no | — |

Interfaz `PresupuestoAnualTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `string` | sí | — |
| `onEdit` | `(data: PresupuestoAnual) => void` | sí | — |
| `onDelete` | `(id: number) => void` | sí | — |

- Tipo interno `SortField` = `keyof PresupuestoAnual | null`
- Tipo interno `SortOrder` = `"asc" | "desc" | null`
- API: `/api/presupuesto/bridge/{…}/presupuesto/anual`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts)
- Usado por: [`PresupuestoAnualComponent.tsx`](#components-presupuesto-presupuesto-anual-presupuestoanualcomponent-tsx)

Notas de implementación:

- Para strings numéricos como monto_anual_asociado
- JSX — Search Bar
- JSX — Table Container
- JSX — Footer con Pagination

---

<a id="components-presupuesto-presupuesto-mensual-mainviewpresupuestomensualcomponent-tsx"></a>
## `components/presupuesto/presupuesto-mensual/MainViewPresupuestoMensualComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewPresupuestoMensualComponent` `()`

- Usa: [`SesionGate.tsx`](general_presupuesto.md#components-general-presupuesto-session-sesiongate-tsx), [`FiltersComponent.tsx`](general_presupuesto.md#components-general-presupuesto-filters-filterscomponent-tsx), [`PresupuestoMensualComponent.tsx`](#components-presupuesto-presupuesto-mensual-presupuestomensualcomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-presupuesto-presupuesto-presupuesto-mensual-page-tsx)

---

<a id="components-presupuesto-presupuesto-mensual-presupuestomensualcomponent-tsx"></a>
## `components/presupuesto/presupuesto-mensual/PresupuestoMensualComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `PresupuestoMensualComponent` `({ cloud, }: PresupuestoMensualComponentProps)`

Interfaz `PresupuestoMensualComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `string` | no | — |

- API: `/api/presupuesto/bridge/{…}/presupuesto/anual`, `/api/presupuesto/bridge/{…}/presupuesto/anual/{…}/mensual`, `/api/presupuesto/bridge/{…}/presupuesto/mensual/{…}`
- Usa: [`button.tsx`](ui.md#components-ui-button-tsx), [`dialog.tsx`](ui.md#components-ui-dialog-tsx), [`alert-dialog.tsx`](ui.md#components-ui-alert-dialog-tsx), [`PresupuestoMensualTableComponent.tsx`](#components-presupuesto-presupuesto-mensual-table-presupuestomensualtablecomponent-tsx), [`PresupuestoMensualFormComponent.tsx`](#components-presupuesto-presupuesto-mensual-form-presupuestomensualformcomponent-tsx), [`SesionGate.tsx`](general_presupuesto.md#components-general-presupuesto-session-sesiongate-tsx)
- Usado por: [`MainViewPresupuestoMensualComponent.tsx`](#components-presupuesto-presupuesto-mensual-mainviewpresupuestomensualcomponent-tsx)

Notas de implementación:

- Mapeo Cloud
- Misma clave SWR que usa PresupuestoMensualTableComponent para listar los presupuestos.
- Estados
- Handlers
- Render
- JSX — Header
- JSX — Header
- JSX — Tabla
- JSX — Formulario Modal
- JSX — Confirmación de eliminación
- JSX — Diálogo de alerta (éxito / error)

---

<a id="components-presupuesto-presupuesto-mensual-form-presupuestomensualformcomponent-tsx"></a>
## `components/presupuesto/presupuesto-mensual/form/PresupuestoMensualFormComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `PresupuestoMensual`
- componente `PresupuestoMensualFormComponent` `({ initialData, onSubmit, onCancel, cloud, })`
- export default `PresupuestoMensualFormComponent`

Interfaz `PresupuestoMensual` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_presupuesto_mensual` | `number \| string` | sí | — |
| `mes` | `number` | no | — |
| `anio` | `number` | no | — |
| `monto_mensual_asociado` | `string` | no | — |
| `monto_real_mes` | `string` | no | — |
| `monto_forecast_mes` | `string` | no | — |
| `id_presupuesto_anual` | `number \| string` | sí | — |

Interfaz `PresupuestoMensualPostPut`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `mes` | `number` | no | — |
| `anio` | `number` | no | — |
| `monto_mensual_asociado` | `string` | no | — |
| `monto_real_mes` | `string` | no | — |
| `monto_forecast_mes` | `string` | no | — |

Interfaz `CentroCosto`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_centro_costo` | `number` | no | — |
| `nombre_centro` | `string` | no | — |
| `responsable_centro` | `string` | no | — |
| `localizacion` | `string` | no | — |

Interfaz `PresupuestoAnual`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_presupuesto_anual` | `number` | no | — |
| `id_centro_costo` | `number` | no | — |
| `anio` | `number` | no | — |
| `monto_anual_asociado` | `string` | no | — |
| `presupuestos_mensuales` | `PresupuestoMensualPostPut[] \| null` | no | — |

Interfaz `PresupuestoMensualFormProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `initialData` | `PresupuestoMensual` | sí | — |
| `onSubmit` | `(data: PresupuestoMensual) => void` | no | — |
| `onCancel` | `() => void` | no | — |
| `cloud` | `string` | no | — |

- API: `/api/presupuesto/bridge/{…}/centro-costo`, `/api/presupuesto/bridge/{…}/presupuesto/anual`
- Usa: [`select.tsx`](ui.md#components-ui-select-tsx)
- Usado por: [`PresupuestoMensualComponent.tsx`](#components-presupuesto-presupuesto-mensual-presupuestomensualcomponent-tsx)

Notas de implementación:

- _PresupuestoMensualFormComponent_: Sincroniza los datos cuando se edita
- _PresupuestoMensualFormComponent_: Cargar presupuestos anuales y centros de costo
- _PresupuestoMensualFormComponent_: Función para obtener el nombre del centro de costo
- _PresupuestoMensualFormComponent_: Función para obtener los meses disponibles según el presupuesto anual seleccionado
- _PresupuestoMensualFormComponent_: Si no hay presupuestos mensuales, todos los meses están disponibles
- _PresupuestoMensualFormComponent_: Obtener los meses que ya tienen presupuesto
- _PresupuestoMensualFormComponent_: Si estamos editando, incluir el mes actual en los disponibles
- _PresupuestoMensualFormComponent_: Retornar todos los meses que no están ocupados (o el mes actual si estamos editando)
- _PresupuestoMensualFormComponent_: Función para calcular la diferencia entre el monto anual y la suma de montos mensuales
- _PresupuestoMensualFormComponent_: Sumar todos los montos mensuales existentes
- _PresupuestoMensualFormComponent_: Si estamos creando (no editando), sumar el monto actual del formulario
- _PresupuestoMensualFormComponent_: Si estamos editando, restar el monto original y sumar el nuevo
- _PresupuestoMensualFormComponent_: JSX — Campos del formulario
- _PresupuestoMensualFormComponent_: JSX — Presupuesto Anual y Mes en la misma fila
- _PresupuestoMensualFormComponent_: JSX — Mensaje de diferencia de presupuesto
- _PresupuestoMensualFormComponent_: JSX — Buttons

---

<a id="components-presupuesto-presupuesto-mensual-table-presupuestomensualtablecomponent-tsx"></a>
## `components/presupuesto/presupuesto-mensual/table/PresupuestoMensualTableComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `PresupuestoMensual`
- interfaz `PresupuestoAnual`
- interfaz `PresupuestoAnualMensual`
- componente `PresupuestoMensualTableComponent` `({ cloud, onEdit, onDelete, }: PresupuestoMensualTableComponentProps)`
- export default `PresupuestoMensualTableComponent`

Interfaz `CentroCosto`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_centro_costo` | `number` | no | — |
| `nombre_centro` | `string` | no | — |
| `responsable_centro` | `string` | no | — |
| `localizacion` | `string` | no | — |

Interfaz `PresupuestoMensual` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_presupuesto_mensual` | `number` | no | — |
| `mes` | `number` | no | — |
| `anio` | `number` | no | — |
| `monto_mensual_asociado` | `string` | no | — |
| `monto_real_mes` | `string` | no | — |
| `monto_forecast_mes` | `string` | no | — |

Interfaz `PresupuestoAnual` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_presupuesto_anual` | `number` | no | — |
| `id_centro_costo` | `number` | no | — |
| `anio` | `number` | no | — |
| `monto_anual_asociado` | `string` | no | — |
| `presupuestos_mensuales` | `PresupuestoMensual[] \| null` | no | — |

Interfaz `PresupuestoAnualMensual` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_centro_costo` | `number` | no | — |
| `nombre_centro` | `string` | no | — |
| `id_presupuesto_anual` | `number` | no | — |
| `id_presupuesto_mensual` | `number` | no | — |
| `mes` | `number` | no | — |
| `anio` | `number` | no | — |
| `monto_mensual_asociado` | `string` | no | — |
| `monto_real_mes` | `string` | no | — |
| `monto_forecast_mes` | `string` | no | — |

Interfaz `PresupuestoMensualTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `string` | sí | — |
| `onEdit` | `(data: PresupuestoAnualMensual) => void` | sí | — |
| `onDelete` | `(id: number \| string) => void` | sí | — |

- Tipo interno `SortField` = `keyof PresupuestoAnualMensual | null`
- Tipo interno `SortOrder` = `"asc" | "desc" | null`
Internos:

- constante `MES_LETRAS`

- API: `/api/presupuesto/bridge/{…}/centro-costo`, `/api/presupuesto/bridge/{…}/presupuesto/anual`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts)
- Usado por: [`PresupuestoMensualComponent.tsx`](#components-presupuesto-presupuesto-mensual-presupuestomensualcomponent-tsx)

Notas de implementación:

- _PresupuestoMensualTableComponent_: Fetch centros de costo
- _PresupuestoMensualTableComponent_: Transformar datos anuales a lista plana con nombre del centro
- _PresupuestoMensualTableComponent_: Para strings numéricos (montos)
- _PresupuestoMensualTableComponent_: JSX — Search Bar
- _PresupuestoMensualTableComponent_: JSX — Table Container
- _PresupuestoMensualTableComponent_: JSX — Footer con Pagination

