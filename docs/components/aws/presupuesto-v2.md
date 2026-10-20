# Componentes `components/aws/presupuesto-v2/`

[← Índice](../../README.md)

Presupuestos AWS: centros de costo, presupuesto anual y mensual, y costos vs presupuesto.

Archivos:

- [`components/aws/presupuesto-v2/MainMenuComponent.tsx`](#components-aws-presupuesto-v2-mainmenucomponent-tsx)
- [`components/aws/presupuesto-v2/MainViewPresupuestoComponent.tsx`](#components-aws-presupuesto-v2-mainviewpresupuestocomponent-tsx)
- [`components/aws/presupuesto-v2/centro-de-costo/CentroDeCostoComponent.tsx`](#components-aws-presupuesto-v2-centro-de-costo-centrodecostocomponent-tsx)
- [`components/aws/presupuesto-v2/centro-de-costo/MainViewCentroDeCostoComponent.tsx`](#components-aws-presupuesto-v2-centro-de-costo-mainviewcentrodecostocomponent-tsx)
- [`components/aws/presupuesto-v2/centro-de-costo/form/CentroDeCostoFormComponent.tsx`](#components-aws-presupuesto-v2-centro-de-costo-form-centrodecostoformcomponent-tsx)
- [`components/aws/presupuesto-v2/centro-de-costo/table/CentroDeCostoTableComponent.tsx`](#components-aws-presupuesto-v2-centro-de-costo-table-centrodecostotablecomponent-tsx)
- [`components/aws/presupuesto-v2/costo-vs-presupuesto/CostosVsPresupuestoComponent.tsx`](#components-aws-presupuesto-v2-costo-vs-presupuesto-costosvspresupuestocomponent-tsx)
- [`components/aws/presupuesto-v2/costo-vs-presupuesto/MainViewCostoVsPresupuestoComponent.tsx`](#components-aws-presupuesto-v2-costo-vs-presupuesto-mainviewcostovspresupuestocomponent-tsx)
- [`components/aws/presupuesto-v2/costo-vs-presupuesto/graficos/CostosVsPresupuestoViewSummaryComponent.tsx`](#components-aws-presupuesto-v2-costo-vs-presupuesto-graficos-costosvspresupuestoviewsummarycomponent-tsx)
- [`components/aws/presupuesto-v2/costo-vs-presupuesto/table/ComparacionMensualTableComponent.tsx`](#components-aws-presupuesto-v2-costo-vs-presupuesto-table-comparacionmensualtablecomponent-tsx)
- [`components/aws/presupuesto-v2/presupuesto-anual/MainViewPresupuestoAnualComponent.tsx`](#components-aws-presupuesto-v2-presupuesto-anual-mainviewpresupuestoanualcomponent-tsx)
- [`components/aws/presupuesto-v2/presupuesto-anual/PresupuestoAnualComponent.tsx`](#components-aws-presupuesto-v2-presupuesto-anual-presupuestoanualcomponent-tsx)
- [`components/aws/presupuesto-v2/presupuesto-anual/form/PresupuestoAnualFormComponent.tsx`](#components-aws-presupuesto-v2-presupuesto-anual-form-presupuestoanualformcomponent-tsx)
- [`components/aws/presupuesto-v2/presupuesto-anual/table/PresupuestoAnualTableComponent.tsx`](#components-aws-presupuesto-v2-presupuesto-anual-table-presupuestoanualtablecomponent-tsx)
- [`components/aws/presupuesto-v2/presupuesto-mensual/MainViewPresupuestoMensualComponent.tsx`](#components-aws-presupuesto-v2-presupuesto-mensual-mainviewpresupuestomensualcomponent-tsx)
- [`components/aws/presupuesto-v2/presupuesto-mensual/PresupuestoMensualComponent.tsx`](#components-aws-presupuesto-v2-presupuesto-mensual-presupuestomensualcomponent-tsx)
- [`components/aws/presupuesto-v2/presupuesto-mensual/form/PresupuestoMensualFormComponent.tsx`](#components-aws-presupuesto-v2-presupuesto-mensual-form-presupuestomensualformcomponent-tsx)
- [`components/aws/presupuesto-v2/presupuesto-mensual/table/PresupuestoMensualTableComponent.tsx`](#components-aws-presupuesto-v2-presupuesto-mensual-table-presupuestomensualtablecomponent-tsx)

<a id="components-aws-presupuesto-v2-mainmenucomponent-tsx"></a>
## `components/aws/presupuesto-v2/MainMenuComponent.tsx`

**Módulo (cliente)**

Exporta:

- export default `MainMenuComponent`

Interfaz `Module`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `title` | `string` | no | — |
| `description` | `string` | no | — |
| `path` | `string` | no | — |

Internos:

- componente `MainMenuComponent` `()`

- Hooks: `useRouter`
- Usado por: [`MainViewPresupuestoComponent.tsx`](#components-aws-presupuesto-v2-mainviewpresupuestocomponent-tsx)

Notas de implementación:

- `onClick={() => router.push(mod.path)}` — Navegación usando Next.js

---

<a id="components-aws-presupuesto-v2-mainviewpresupuestocomponent-tsx"></a>
## `components/aws/presupuesto-v2/MainViewPresupuestoComponent.tsx`

**Componente**

Exporta:

- componente `MainViewPresupuestoComponent` `()`

- Usa: [`MainMenuComponent.tsx`](#components-aws-presupuesto-v2-mainmenucomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-presupuesto-page-tsx)

---

<a id="components-aws-presupuesto-v2-centro-de-costo-centrodecostocomponent-tsx"></a>
## `components/aws/presupuesto-v2/centro-de-costo/CentroDeCostoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `CentroDeCostoComponent` `()`

Interfaz `CloudTag`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string` | no | — |
| `nombre` | `string` | no | — |

- API: `/api/presupuesto/bridge/{…}/azure/obtener-centro-costo`, `/api/presupuesto/bridge/{…}/centro-costo`, `/api/presupuesto/bridge/{…}/centro-costo/`, `/api/presupuesto/bridge/{…}/centro-costo/{…}`, `/api/{…}/azure/centro-costo/importar-masivo`
- Usa: [`button.tsx`](../ui.md#components-ui-button-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`alert-dialog.tsx`](../ui.md#components-ui-alert-dialog-tsx), [`CentroDeCostoTableComponent.tsx`](#components-aws-presupuesto-v2-centro-de-costo-table-centrodecostotablecomponent-tsx), [`CentroDeCostoFormComponent.tsx`](#components-aws-presupuesto-v2-centro-de-costo-form-centrodecostoformcomponent-tsx), [`SesionGate.tsx`](../general_presupuesto.md#components-general-presupuesto-session-sesiongate-tsx)
- Usado por: [`MainViewCentroDeCostoComponent.tsx`](#components-aws-presupuesto-v2-centro-de-costo-mainviewcentrodecostocomponent-tsx)

Notas de implementación:

- La importación de centros de costo desde la nube sólo tiene back end para Azure.
- Estados Originales
- 1. Alineado con la eliminación de tags de los componentes hijos
- 2. Omitiendo variable de catch no utilizada
- `} catch {` — Ignorar si no es JSON válido
- 2. Omitiendo variable de catch no utilizada
- Si falla el parseo, se queda el mensaje original
- Acciones de Importación (Buscando en la Nube)
- JSX — Alertas y Confirmaciones

---

<a id="components-aws-presupuesto-v2-centro-de-costo-mainviewcentrodecostocomponent-tsx"></a>
## `components/aws/presupuesto-v2/centro-de-costo/MainViewCentroDeCostoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewCentroDeCostoComponent` `()`

- Usa: [`SesionGate.tsx`](../general_presupuesto.md#components-general-presupuesto-session-sesiongate-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`CentroDeCostoComponent.tsx`](#components-aws-presupuesto-v2-centro-de-costo-centrodecostocomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-presupuesto-centro-de-costo-page-tsx)

---

<a id="components-aws-presupuesto-v2-centro-de-costo-form-centrodecostoformcomponent-tsx"></a>
## `components/aws/presupuesto-v2/centro-de-costo/form/CentroDeCostoFormComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `CentroCosto`
- componente `CentroDeCostoFormComponent` `({ onSubmit, onCancel, initialData, })`
- export default `CentroDeCostoFormComponent`

Interfaz `CentroCosto` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_centro_costo` | `number \| string` | no | — |
| `nombre_centro` | `string` | no | — |
| `responsable_centro` | `string` | no | — |
| `localizacion` | `string` | no | — |

Interfaz `CentroCostoFormProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `onSubmit` | `(data: CentroCosto) => void` | no | — |
| `onCancel` | `() => void` | sí | — |
| `initialData` | `CentroCosto \| null` | sí | — |

- Usado por: [`CentroDeCostoComponent.tsx`](#components-aws-presupuesto-v2-centro-de-costo-centrodecostocomponent-tsx)

---

<a id="components-aws-presupuesto-v2-centro-de-costo-table-centrodecostotablecomponent-tsx"></a>
## `components/aws/presupuesto-v2/centro-de-costo/table/CentroDeCostoTableComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `CentroCosto`
- componente `CentroDeCostoTableComponent` `({ cloud, onEdit, onDelete }: CentroDeCostoTableComponentProps)`

Interfaz `CentroCosto` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_centro_costo` | `number` | no | — |
| `nombre_centro` | `string` | no | — |
| `responsable_centro` | `string \| null` | no | — |
| `localizacion` | `string \| null` | no | — |

Interfaz `CentroDeCostoTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `string` | no | — |
| `onEdit` | `(data: CentroCosto) => void` | no | — |
| `onDelete` | `(id: number) => void` | no | — |

- Tipo interno `SortField` = `keyof CentroCosto | null`
- Tipo interno `SortOrder` = `"asc" | "desc" | null`
Internos:

- función `fetcher` `(url: string): Promise<CentroCosto[]>`
- componente `AlertCircleIcon` `({ className }: { className?: string })`

- API: `/api/presupuesto/bridge/{…}/centro-costo`
- Hooks: `useSWR`
- Usado por: [`CentroDeCostoComponent.tsx`](#components-aws-presupuesto-v2-centro-de-costo-centrodecostocomponent-tsx)

Notas de implementación:

- _CentroDeCostoTableComponent_: JSX — Cambiado el colSpan de 6 a 5 al eliminar la columna de Tags

---

<a id="components-aws-presupuesto-v2-costo-vs-presupuesto-costosvspresupuestocomponent-tsx"></a>
## `components/aws/presupuesto-v2/costo-vs-presupuesto/CostosVsPresupuestoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `CostosVsPresupuestoComponentAWS` `({ anio, cloud, centroDeCosto }: CentroDeCostoComponentProps)`

Interfaz `CentroDeCostoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `string` | no | — |
| `anio` | `string` | no | — |
| `centroDeCosto` | `string` | no | — |

Interfaz `CentroCosto`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_centro_costo` | `number` | no | — |
| `nombre_centro` | `string` | no | — |
| `responsable_centro` | `string` | no | — |
| `localizacion` | `string` | no | — |
| `tags` | `Record<string, string>` | sí | — |

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
| `centro_costo` | `CentroCosto` | no | — |

Interfaz `FacturacionAnual`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `year` | `number` | no | — |
| `month` | `number` | no | — |
| `total_cost` | `number` | no | — |
| `count` | `number` | no | — |

- API: `/api/presupuesto/bridge/{…}/presupuesto/facturacion/facturacion-anual`, `/api/presupuesto/bridge/{…}/presupuesto/facturacion/facturacion-anual/tags-centro-costo`, `/api/presupuesto/bridge/{…}/presupuesto/summary/anual`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`LoaderComponent.tsx`](../general_presupuesto.md#components-general-presupuesto-loadercomponent-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`CostosVsPresupuestoViewSummaryComponent.tsx`](#components-aws-presupuesto-v2-costo-vs-presupuesto-graficos-costosvspresupuestoviewsummarycomponent-tsx), [`ComparacionMensualTableComponent.tsx`](#components-aws-presupuesto-v2-costo-vs-presupuesto-table-comparacionmensualtablecomponent-tsx)
- Usado por: [`MainViewCostoVsPresupuestoComponent.tsx`](#components-aws-presupuesto-v2-costo-vs-presupuesto-mainviewcostovspresupuestocomponent-tsx)

Notas de implementación:

- 1. OBTENER PRESUPUESTOS (SWR)
- 2. OBTENER FACTURACIÓN GLOBAL (SWR)
- 3. OBTENER FACTURACIÓN RELACIONAL (useEffect)

---

<a id="components-aws-presupuesto-v2-costo-vs-presupuesto-mainviewcostovspresupuestocomponent-tsx"></a>
## `components/aws/presupuesto-v2/costo-vs-presupuesto/MainViewCostoVsPresupuestoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewCostoVsPresupuestoAws` `()`

- Usa: [`SesionGate.tsx`](../general_presupuesto.md#components-general-presupuesto-session-sesiongate-tsx), [`FiltersComponent.tsx`](../general_presupuesto.md#components-general-presupuesto-filters-filterscomponent-tsx), [`CostosVsPresupuestoComponent.tsx`](#components-aws-presupuesto-v2-costo-vs-presupuesto-costosvspresupuestocomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-presupuesto-costos-vs-presupuesto-page-tsx)

---

<a id="components-aws-presupuesto-v2-costo-vs-presupuesto-graficos-costosvspresupuestoviewsummarycomponent-tsx"></a>
## `components/aws/presupuesto-v2/costo-vs-presupuesto/graficos/CostosVsPresupuestoViewSummaryComponent.tsx`

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
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`CostosVsPresupuestoComponent.tsx`](#components-aws-presupuesto-v2-costo-vs-presupuesto-costosvspresupuestocomponent-tsx)

---

<a id="components-aws-presupuesto-v2-costo-vs-presupuesto-table-comparacionmensualtablecomponent-tsx"></a>
## `components/aws/presupuesto-v2/costo-vs-presupuesto/table/ComparacionMensualTableComponent.tsx`

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

- Usado por: [`CostosVsPresupuestoComponent.tsx`](#components-aws-presupuesto-v2-costo-vs-presupuesto-costosvspresupuestocomponent-tsx)

---

<a id="components-aws-presupuesto-v2-presupuesto-anual-mainviewpresupuestoanualcomponent-tsx"></a>
## `components/aws/presupuesto-v2/presupuesto-anual/MainViewPresupuestoAnualComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewPresupuestoAnualComponent` `()`

- Usa: [`SesionGate.tsx`](../general_presupuesto.md#components-general-presupuesto-session-sesiongate-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`PresupuestoAnualComponent.tsx`](#components-aws-presupuesto-v2-presupuesto-anual-presupuestoanualcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-presupuesto-presupuesto-anual-page-tsx)

---

<a id="components-aws-presupuesto-v2-presupuesto-anual-presupuestoanualcomponent-tsx"></a>
## `components/aws/presupuesto-v2/presupuesto-anual/PresupuestoAnualComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `PresupuestoAnualComponent` `()`

- API: `/api/presupuesto/bridge/{…}/presupuesto/anual`, `/api/presupuesto/bridge/{…}/presupuesto/anual/{…}`
- Usa: [`button.tsx`](../ui.md#components-ui-button-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`alert-dialog.tsx`](../ui.md#components-ui-alert-dialog-tsx), [`PresupuestoAnualTableComponent.tsx`](#components-aws-presupuesto-v2-presupuesto-anual-table-presupuestoanualtablecomponent-tsx), [`PresupuestoAnualFormComponent.tsx`](#components-aws-presupuesto-v2-presupuesto-anual-form-presupuestoanualformcomponent-tsx), [`SesionGate.tsx`](../general_presupuesto.md#components-general-presupuesto-session-sesiongate-tsx)
- Usado por: [`MainViewPresupuestoAnualComponent.tsx`](#components-aws-presupuesto-v2-presupuesto-anual-mainviewpresupuestoanualcomponent-tsx)

---

<a id="components-aws-presupuesto-v2-presupuesto-anual-form-presupuestoanualformcomponent-tsx"></a>
## `components/aws/presupuesto-v2/presupuesto-anual/form/PresupuestoAnualFormComponent.tsx`

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
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts)
- Usado por: [`PresupuestoAnualComponent.tsx`](#components-aws-presupuesto-v2-presupuesto-anual-presupuestoanualcomponent-tsx)

Notas de implementación:

- _PresupuestoAnualFormComponent_: JSX — Centro de Costo
- _PresupuestoAnualFormComponent_: JSX — Año

---

<a id="components-aws-presupuesto-v2-presupuesto-anual-table-presupuestoanualtablecomponent-tsx"></a>
## `components/aws/presupuesto-v2/presupuesto-anual/table/PresupuestoAnualTableComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `PresupuestoAnualTableComponent` `({ cloud, onEdit, onDelete }: PresupuestoAnualTableComponentProps)`
- export default `PresupuestoAnualTableComponent`

Interfaz `PresupuestoMensual`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_presupuesto_mensual` | `number` | sí | — |
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
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts)
- Usado por: [`PresupuestoAnualComponent.tsx`](#components-aws-presupuesto-v2-presupuesto-anual-presupuestoanualcomponent-tsx)

---

<a id="components-aws-presupuesto-v2-presupuesto-mensual-mainviewpresupuestomensualcomponent-tsx"></a>
## `components/aws/presupuesto-v2/presupuesto-mensual/MainViewPresupuestoMensualComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewPresupuestoMensualComponent` `()`

- Usa: [`SesionGate.tsx`](../general_presupuesto.md#components-general-presupuesto-session-sesiongate-tsx), [`card.tsx`](../ui.md#components-ui-card-tsx), [`PresupuestoMensualComponent.tsx`](#components-aws-presupuesto-v2-presupuesto-mensual-presupuestomensualcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-presupuesto-presupuesto-mensual-page-tsx)

---

<a id="components-aws-presupuesto-v2-presupuesto-mensual-presupuestomensualcomponent-tsx"></a>
## `components/aws/presupuesto-v2/presupuesto-mensual/PresupuestoMensualComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `PresupuestoMensualComponent` `()`

- API: `/api/presupuesto/bridge/{…}/presupuesto/anual`, `/api/presupuesto/bridge/{…}/presupuesto/anual/{…}/mensual`, `/api/presupuesto/bridge/{…}/presupuesto/mensual/{…}`
- Usa: [`button.tsx`](../ui.md#components-ui-button-tsx), [`dialog.tsx`](../ui.md#components-ui-dialog-tsx), [`alert-dialog.tsx`](../ui.md#components-ui-alert-dialog-tsx), [`PresupuestoMensualTableComponent.tsx`](#components-aws-presupuesto-v2-presupuesto-mensual-table-presupuestomensualtablecomponent-tsx), [`PresupuestoMensualFormComponent.tsx`](#components-aws-presupuesto-v2-presupuesto-mensual-form-presupuestomensualformcomponent-tsx), [`SesionGate.tsx`](../general_presupuesto.md#components-general-presupuesto-session-sesiongate-tsx)
- Usado por: [`MainViewPresupuestoMensualComponent.tsx`](#components-aws-presupuesto-v2-presupuesto-mensual-mainviewpresupuestomensualcomponent-tsx)

---

<a id="components-aws-presupuesto-v2-presupuesto-mensual-form-presupuestomensualformcomponent-tsx"></a>
## `components/aws/presupuesto-v2/presupuesto-mensual/form/PresupuestoMensualFormComponent.tsx`

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

- API: `/api/presupuesto/bridge/{…}/centro-costo/`, `/api/presupuesto/bridge/{…}/presupuesto/anual`
- Usa: [`select.tsx`](../ui.md#components-ui-select-tsx)
- Usado por: [`PresupuestoMensualComponent.tsx`](#components-aws-presupuesto-v2-presupuesto-mensual-presupuestomensualcomponent-tsx)

---

<a id="components-aws-presupuesto-v2-presupuesto-mensual-table-presupuestomensualtablecomponent-tsx"></a>
## `components/aws/presupuesto-v2/presupuesto-mensual/table/PresupuestoMensualTableComponent.tsx`

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
| `onDelete` | `(id: number \| string) => void` | sí | Restaurado a tu original |

- Tipo interno `SortField` = `keyof PresupuestoAnualMensual | null`
- Tipo interno `SortOrder` = `"asc" | "desc" | null`
Internos:

- constante `MES_LETRAS`

- API: `/api/presupuesto/bridge/{…}/centro-costo/`, `/api/presupuesto/bridge/{…}/presupuesto/anual`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts)
- Usado por: [`PresupuestoMensualComponent.tsx`](#components-aws-presupuesto-v2-presupuesto-mensual-presupuestomensualcomponent-tsx)

Notas de implementación:

- _PresupuestoMensualTableComponent_: Pasamos solo el ID, idéntico a tu lógica original

