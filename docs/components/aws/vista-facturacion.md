# Componentes `components/aws/vista-facturacion/`

[← Índice](../../README.md)

Tendencia de facturación AWS.

Archivos:

- [`components/aws/vista-facturacion/tendencia-facturacion/MainViewTendenciaFacturacionComponent.tsx`](#components-aws-vista-facturacion-tendencia-facturacion-mainviewtendenciafacturacioncomponent-tsx)
- [`components/aws/vista-facturacion/tendencia-facturacion/TendenciaFacturacionChartComponent.tsx`](#components-aws-vista-facturacion-tendencia-facturacion-tendenciafacturacionchartcomponent-tsx)

<a id="components-aws-vista-facturacion-tendencia-facturacion-mainviewtendenciafacturacioncomponent-tsx"></a>
## `components/aws/vista-facturacion/tendencia-facturacion/MainViewTendenciaFacturacionComponent.tsx`

**Componente**

Exporta:

- componente `MainViewTendenciaFacturacionComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`TendenciaFacturacionChartComponent.tsx`](#components-aws-vista-facturacion-tendencia-facturacion-tendenciafacturacionchartcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-facturacion-tendencia-facturacion-page-tsx)

---

<a id="components-aws-vista-facturacion-tendencia-facturacion-tendenciafacturacionchartcomponent-tsx"></a>
## `components/aws/vista-facturacion/tendencia-facturacion/TendenciaFacturacionChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `TendenciaFacturacionChartComponent` `({ startDate, endDate, services, region, selectedKey, selectedValue }: TendenciaFacturacionProps)` — Tendencia de facturación AWS: adaptador sobre la vista común (`/api/aws/billing/trend` + `/history`).

Interfaz `TendenciaFacturacionProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | Siempre llega desde el filtro de fechas; sin él se consulta solo el día inicial. |
| `services` | `string` | sí | — |
| `region` | `string` | sí | — |
| `selectedKey` | `string \| null` | sí | — |
| `selectedValue` | `string \| null` | sí | — |

- Usa: [`BillingTrendView.tsx`](../shared.md#components-shared-billing-billingtrendview-tsx), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewTendenciaFacturacionComponent.tsx`](#components-aws-vista-facturacion-tendencia-facturacion-mainviewtendenciafacturacioncomponent-tsx)

