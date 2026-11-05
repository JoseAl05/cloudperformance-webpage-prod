# Componentes `components/azure/vista-consumo-vm/`

[← Índice](../../README.md)

Consumo de máquinas virtuales Azure.

Archivos:

- [`components/azure/vista-consumo-vm/ConsumoVmComponent.tsx`](#components-azure-vista-consumo-vm-consumovmcomponent-tsx)
- [`components/azure/vista-consumo-vm/MainViewConsumoVmComponent.tsx`](#components-azure-vista-consumo-vm-mainviewconsumovmcomponent-tsx)

<a id="components-azure-vista-consumo-vm-consumovmcomponent-tsx"></a>
## `components/azure/vista-consumo-vm/ConsumoVmComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AzureVmMetricsComponent` `({ startDate, endDate, subscription, region, selectedTagKey, selectedTagValue, selectedResourceGroup, selectedInstanceV2, }: AzureVmMetricsComponentProps)` — Consumo Virtual Machines: adapta los filtros de la vista al contrato canónico (/api/azure/consumption/vm/*).

Interfaz `AzureVmMetricsComponentProps`:

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
- Usado por: [`MainViewConsumoAppGwComponent.tsx`](vista-consumo-apps-gateway.md#components-azure-vista-consumo-apps-gateway-mainviewconsumoappgwcomponent-tsx), [`MainViewConsumoVmComponent.tsx`](#components-azure-vista-consumo-vm-mainviewconsumovmcomponent-tsx)

---

<a id="components-azure-vista-consumo-vm-mainviewconsumovmcomponent-tsx"></a>
## `components/azure/vista-consumo-vm/MainViewConsumoVmComponent.tsx`

**Componente**

Exporta:

- componente `MainViewConsumoVmComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`ConsumoVmComponent.tsx`](#components-azure-vista-consumo-vm-consumovmcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-consumos-vm-page-tsx)

