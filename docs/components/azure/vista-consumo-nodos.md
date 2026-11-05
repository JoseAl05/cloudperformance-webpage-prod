# Componentes `components/azure/vista-consumo-nodos/`

[← Índice](../../README.md)

Consumo de nodos AKS.

Archivos:

- [`components/azure/vista-consumo-nodos/ConsumoNodosComponent.tsx`](#components-azure-vista-consumo-nodos-consumonodoscomponent-tsx)
- [`components/azure/vista-consumo-nodos/MainViewConsumoNodosComponent.tsx`](#components-azure-vista-consumo-nodos-mainviewconsumonodoscomponent-tsx)

<a id="components-azure-vista-consumo-nodos-consumonodoscomponent-tsx"></a>
## `components/azure/vista-consumo-nodos/ConsumoNodosComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AzureNodeMetricsComponent` `({ startDate, endDate, subscription, region, selectedTagKey, selectedTagValue, selectedResourceGroup, selectedInstanceV2, }: AzureNodeMetricsComponentProps)` — Consumo Nodos AKS: adapta los filtros de la vista al contrato canónico (/api/azure/consumption/nodes/*).

Interfaz `AzureNodeMetricsComponentProps`:

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
- Usado por: [`MainViewConsumoNodosComponent.tsx`](#components-azure-vista-consumo-nodos-mainviewconsumonodoscomponent-tsx)

---

<a id="components-azure-vista-consumo-nodos-mainviewconsumonodoscomponent-tsx"></a>
## `components/azure/vista-consumo-nodos/MainViewConsumoNodosComponent.tsx`

**Componente**

Exporta:

- componente `MainViewConsumoNodosComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`ConsumoNodosComponent.tsx`](#components-azure-vista-consumo-nodos-consumonodoscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-consumos-nodos-page-tsx)

