# Componentes `components/azure/vista-consumo-apps-gateway/`

[← Índice](../../README.md)

Consumo de Application Gateways.

Archivos:

- [`components/azure/vista-consumo-apps-gateway/ConsumoAppGwComponent.tsx`](#components-azure-vista-consumo-apps-gateway-consumoappgwcomponent-tsx)
- [`components/azure/vista-consumo-apps-gateway/MainViewConsumoAppGwComponent.tsx`](#components-azure-vista-consumo-apps-gateway-mainviewconsumoappgwcomponent-tsx)

<a id="components-azure-vista-consumo-apps-gateway-consumoappgwcomponent-tsx"></a>
## `components/azure/vista-consumo-apps-gateway/ConsumoAppGwComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ConsumoAppGwComponent` `({ startDate, endDate, selectedAppg }: ConsumoAppGwComponentProps)` — Consumo Application Gateway: adapta los filtros de la vista al contrato canónico (/api/azure/consumption/app-gateways/*).

Interfaz `ConsumoAppGwComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `selectedAppg` | `string` | no | — |

- Usa: [`ConsumptionView.tsx`](../shared.md#components-shared-consumption-consumptionview-tsx), [`consumptionConfigs.ts`](../shared.md#components-shared-consumption-consumptionconfigs-ts), [`consumption.ts`](../../lib.md#lib-consumption-ts)
- Usado por: [`MainViewConsumoAppGwComponent.tsx`](#components-azure-vista-consumo-apps-gateway-mainviewconsumoappgwcomponent-tsx)

---

<a id="components-azure-vista-consumo-apps-gateway-mainviewconsumoappgwcomponent-tsx"></a>
## `components/azure/vista-consumo-apps-gateway/MainViewConsumoAppGwComponent.tsx`

**Componente**

Exporta:

- componente `MainViewConsumoAppGwComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`ConsumoVmComponent.tsx`](vista-consumo-vm.md#components-azure-vista-consumo-vm-consumovmcomponent-tsx), [`ConsumoAppGwComponent.tsx`](#components-azure-vista-consumo-apps-gateway-consumoappgwcomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-consumos-apps-gateway-page-tsx)

