# Componentes `components/general_alertas/`

[← Índice](../README.md)

Componentes auxiliares de alertas (loader y select con búsqueda).

Archivos:

- [`components/general_alertas/LoaderComponent.tsx`](#components-general-alertas-loadercomponent-tsx)
- [`components/general_alertas/SearchableSelect.tsx`](#components-general-alertas-searchableselect-tsx)

<a id="components-general-alertas-loadercomponent-tsx"></a>
## `components/general_alertas/LoaderComponent.tsx`

**Componente**

Exporta:

- componente `LoaderComponent` `({ size = 'large', text = 'Sincronizando reglas de alerta...' }: LoaderComponentProps)`

Interfaz `LoaderComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `size` | `'small' \| 'large'` | sí | — |
| `text` | `string` | sí | — |

- Usado por: [`AnomalyAlertsTable.tsx`](alertas.md#components-alertas-anomalies-table-anomalyalertstable-tsx), [`BillingAlertsTable.tsx`](alertas.md#components-alertas-billing-table-billingalertstable-tsx), [`CostCenterBudgetView.tsx`](alertas.md#components-alertas-budget-costcenterbudgetview-tsx)

---

<a id="components-general-alertas-searchableselect-tsx"></a>
## `components/general_alertas/SearchableSelect.tsx`

**Componente (cliente)**

Exporta:

- componente `SearchableSelect` `({ value, onChange, options, placeholder = "Seleccionar...", emptyMessage = "No se encontraron resultados.", disabled = false, className }: SearchableSelectPro…`

Interfaz `SearchableSelectProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `value` | `string` | no | — |
| `onChange` | `(value: string) => void` | no | — |
| `options` | `{ label: string; value: string }[]` | no | — |
| `placeholder` | `string` | sí | — |
| `emptyMessage` | `string` | sí | — |
| `disabled` | `boolean` | sí | — |
| `className` | `string` | sí | — |

- Usa: [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx)
- Usado por: [`AnomalyAlertsView.tsx`](alertas.md#components-alertas-anomalies-anomalyalertsview-tsx), [`BillingAlertsView.tsx`](alertas.md#components-alertas-billing-billingalertsview-tsx), [`BillingAlertForm.tsx`](alertas.md#components-alertas-billing-form-billingalertform-tsx), [`CostCenterBudgetView.tsx`](alertas.md#components-alertas-budget-costcenterbudgetview-tsx)

