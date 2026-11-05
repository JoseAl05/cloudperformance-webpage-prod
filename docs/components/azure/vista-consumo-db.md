# Componentes `components/azure/vista-consumo-db/`

[← Índice](../../README.md)

Consumo de bases de datos Azure.

Archivos:

- [`components/azure/vista-consumo-db/ConsumoDbComponent.tsx`](#components-azure-vista-consumo-db-consumodbcomponent-tsx)
- [`components/azure/vista-consumo-db/MainViewConsumoDbComponent.tsx`](#components-azure-vista-consumo-db-mainviewconsumodbcomponent-tsx)

<a id="components-azure-vista-consumo-db-consumodbcomponent-tsx"></a>
## `components/azure/vista-consumo-db/ConsumoDbComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AzureDbMetricsComponent` `({ startDate, endDate, subscription, region, selectedTagKey, selectedTagValue, selectedResourceGroup, selectedInstanceV2, }: AzureDbMetricsComponentProps)` — Consumo Azure Database: adapta los filtros de la vista al contrato canónico (/api/azure/consumption/db/*).

Interfaz `AzureDbMetricsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `subscription` | `string` | no | — |
| `region` | `string` | no | — |
| `selectedTagKey` | `string \| null` | sí | — |
| `selectedTagValue` | `string \| null` | sí | — |
| `selectedResourceGroup` | `string \| null` | sí | — |
| `selectedInstanceV2` | `string \| null` | sí | — |

Internos:

- función `isSet` `(value: string | null | undefined, allValue: string): value is string`

- Usa: [`ConsumptionView.tsx`](../shared.md#components-shared-consumption-consumptionview-tsx), [`consumptionConfigs.ts`](../shared.md#components-shared-consumption-consumptionconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewConsumoDbComponent.tsx`](#components-azure-vista-consumo-db-mainviewconsumodbcomponent-tsx)

---

<a id="components-azure-vista-consumo-db-mainviewconsumodbcomponent-tsx"></a>
## `components/azure/vista-consumo-db/MainViewConsumoDbComponent.tsx`

**Componente**

Exporta:

- componente `MainViewConsumoDbComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`ConsumoDbComponent.tsx`](#components-azure-vista-consumo-db-consumodbcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-consumos-db-page-tsx)

