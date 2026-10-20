# Componentes `components/azure/vista-facturacion/`

[← Índice](../../README.md)

Tendencia de facturación (pago por uso) y top de dólares facturados.

Archivos:

- [`components/azure/vista-facturacion/tendencia-pago-por-uso/MainViewTendenciaPagoPorUsoComponent.tsx`](#components-azure-vista-facturacion-tendencia-pago-por-uso-mainviewtendenciapagoporusocomponent-tsx)
- [`components/azure/vista-facturacion/tendencia-pago-por-uso/TendenciaFacturacionPagoPorUsoComponent.tsx`](#components-azure-vista-facturacion-tendencia-pago-por-uso-tendenciafacturacionpagoporusocomponent-tsx)
- [`components/azure/vista-facturacion/top-dolares-facturados/MainViewTopDolaresFacturadosComponent.tsx`](#components-azure-vista-facturacion-top-dolares-facturados-mainviewtopdolaresfacturadoscomponent-tsx)
- [`components/azure/vista-facturacion/top-dolares-facturados/TopDolaresFacturadosChartComponent.tsx`](#components-azure-vista-facturacion-top-dolares-facturados-topdolaresfacturadoschartcomponent-tsx)

<a id="components-azure-vista-facturacion-tendencia-pago-por-uso-mainviewtendenciapagoporusocomponent-tsx"></a>
## `components/azure/vista-facturacion/tendencia-pago-por-uso/MainViewTendenciaPagoPorUsoComponent.tsx`

**Componente**

Exporta:

- componente `MainViewTendenciaPagoPorUsoComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`TendenciaFacturacionPagoPorUsoComponent.tsx`](#components-azure-vista-facturacion-tendencia-pago-por-uso-tendenciafacturacionpagoporusocomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-facturacion-tendencia-pago-por-uso-page-tsx)

---

<a id="components-azure-vista-facturacion-tendencia-pago-por-uso-tendenciafacturacionpagoporusocomponent-tsx"></a>
## `components/azure/vista-facturacion/tendencia-pago-por-uso/TendenciaFacturacionPagoPorUsoComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `TendenciaFacturacionPagoPorUsoComponent` `({ startDate, endDate, region, subscription, selectedTagKey, selectedTagValue, selectedMeterCategory, selectedInstance, }: TendenciaFacturacionAzureProps)` — Tendencia de facturación Azure: adaptador sobre la vista común (`/api/azure/billing/trend` + `/history`).

Interfaz `TendenciaFacturacionAzureProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | Siempre llega desde el filtro de fechas; sin él se consulta solo el día inicial. |
| `region` | `string` | no | — |
| `subscription` | `string` | no | — |
| `selectedTagKey` | `string \| null` | no | — |
| `selectedTagValue` | `string \| null` | no | — |
| `selectedMeterCategory` | `string \| null` | no | — |
| `selectedInstance` | `string \| null` | no | — |

Internos:

- función `filterValue` `(value: string | null)` — Valor de filtro usable (los selectores entregan '' o 'null' cuando no hay selección).

- Usa: [`BillingTrendView.tsx`](../shared.md#components-shared-billing-billingtrendview-tsx), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewTendenciaPagoPorUsoComponent.tsx`](#components-azure-vista-facturacion-tendencia-pago-por-uso-mainviewtendenciapagoporusocomponent-tsx)

---

<a id="components-azure-vista-facturacion-top-dolares-facturados-mainviewtopdolaresfacturadoscomponent-tsx"></a>
## `components/azure/vista-facturacion/top-dolares-facturados/MainViewTopDolaresFacturadosComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewTopDolaresFacturadosComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`TopDolaresFacturadosChartComponent.tsx`](#components-azure-vista-facturacion-top-dolares-facturados-topdolaresfacturadoschartcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-facturacion-top-dolares-facturados-page-tsx)

Notas de implementación:

- JSX — Header

---

<a id="components-azure-vista-facturacion-top-dolares-facturados-topdolaresfacturadoschartcomponent-tsx"></a>
## `components/azure/vista-facturacion/top-dolares-facturados/TopDolaresFacturadosChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `TopDolaresFacturadosChartComponent` `({ startDate, endDate }: TopDolaresFacturadosChartProps)` — Top de facturación Azure (suscripción, grupo de recursos, servicio o ubicación): adaptador sobre la vista común.

Interfaz `TopDolaresFacturadosChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |

- Usa: [`TopBillingView.tsx`](../shared.md#components-shared-billing-topbillingview-tsx), [`billingConfigs.ts`](../shared.md#components-shared-billing-billingconfigs-ts)
- Usado por: [`MainViewTopDolaresFacturadosComponent.tsx`](#components-azure-vista-facturacion-top-dolares-facturados-mainviewtopdolaresfacturadoscomponent-tsx)

