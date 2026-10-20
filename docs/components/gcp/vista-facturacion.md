# Componentes `components/gcp/vista-facturacion/`

[← Índice](../../README.md)

Tendencia de facturación GCP.

Archivos:

- [`components/gcp/vista-facturacion/tendencia-facturacion/MainViewTendenciaFacturacionComponent.tsx`](#components-gcp-vista-facturacion-tendencia-facturacion-mainviewtendenciafacturacioncomponent-tsx)
- [`components/gcp/vista-facturacion/tendencia-facturacion/TendenciaFacturacionComponent.tsx`](#components-gcp-vista-facturacion-tendencia-facturacion-tendenciafacturacioncomponent-tsx)

<a id="components-gcp-vista-facturacion-tendencia-facturacion-mainviewtendenciafacturacioncomponent-tsx"></a>
## `components/gcp/vista-facturacion/tendencia-facturacion/MainViewTendenciaFacturacionComponent.tsx`

**Componente**

Exporta:

- componente `MainViewTendenciaFacturacionComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`TendenciaFacturacionComponent.tsx`](#components-gcp-vista-facturacion-tendencia-facturacion-tendenciafacturacioncomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-facturacion-tendencia-facturacion-page-tsx)

---

<a id="components-gcp-vista-facturacion-tendencia-facturacion-tendenciafacturacioncomponent-tsx"></a>
## `components/gcp/vista-facturacion/tendencia-facturacion/TendenciaFacturacionComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `TendenciaFacturacionComponent` `({ startDate, endDate, projects, regions, service, tagKey, tagValue }: TendenciaFacturacionComponentProps)` — Tendencia de facturación GCP: adaptador sobre la vista común (`/api/gcp/billing/trend` + `/history`, en USD).

Interfaz `TendenciaFacturacionComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | Siempre llega desde el filtro de fechas; sin él se consulta solo el día inicial. |
| `regions` | `string` | no | — |
| `projects` | `string \| string[]` | sí | — |
| `service` | `string` | no | — |
| `tagKey` | `string \| null` | sí | — |
| `tagValue` | `string \| null` | sí | — |

- Usa: [`BillingTrendView.tsx`](../shared.md#components-shared-billing-billingtrendview-tsx), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewTendenciaFacturacionComponent.tsx`](#components-gcp-vista-facturacion-tendencia-facturacion-mainviewtendenciafacturacioncomponent-tsx)

