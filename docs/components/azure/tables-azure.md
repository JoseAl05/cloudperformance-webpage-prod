# Componentes `components/azure/tables-azure/`

[← Índice](../../README.md)

Tablas por ítem de Azure (cuentas de facturación, resource groups, servicios).

Archivos:

- [`components/azure/tables-azure/tablas-item-azure/MainViewTablasItemAzureComponent.tsx`](#components-azure-tables-azure-tablas-item-azure-mainviewtablasitemazurecomponent-tsx)
- [`components/azure/tables-azure/tablas-item-azure/TablasItemAzureComponent.tsx`](#components-azure-tables-azure-tablas-item-azure-tablasitemazurecomponent-tsx)
- [`components/azure/tables-azure/tablas-item-azure/table/tableBillingAccountsColumns.tsx`](#components-azure-tables-azure-tablas-item-azure-table-tablebillingaccountscolumns-tsx)
- [`components/azure/tables-azure/tablas-item-azure/table/tableResourceGroupsColumns.tsx`](#components-azure-tables-azure-tablas-item-azure-table-tableresourcegroupscolumns-tsx)
- [`components/azure/tables-azure/tablas-item-azure/table/tableServicesColumns.tsx`](#components-azure-tables-azure-tablas-item-azure-table-tableservicescolumns-tsx)

<a id="components-azure-tables-azure-tablas-item-azure-mainviewtablasitemazurecomponent-tsx"></a>
## `components/azure/tables-azure/tablas-item-azure/MainViewTablasItemAzureComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewTablasItemAzureComponent` `()`

- Usa: [`TablasItemAzureComponent.tsx`](#components-azure-tables-azure-tablas-item-azure-tablasitemazurecomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-tables-azure-tablas-item-azure-page-tsx)

Notas de implementación:

- JSX — Header
- JSX — Componente con las 3 tablas

---

<a id="components-azure-tables-azure-tablas-item-azure-tablasitemazurecomponent-tsx"></a>
## `components/azure/tables-azure/tablas-item-azure/TablasItemAzureComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `TablasItemAzureComponent` `()`

Interfaz `TablasItemAzureResponse`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `'items-azure'` | `ServiceData[]` | sí | — |
| `'resource-groups'` | `ResourceGroupData[]` | sí | — |
| `'billing-accounts'` | `BillingAccountData[]` | sí | — |

- API: `/api/azure/bridge/azure/tablas-item-azure`
- Hooks: `useSWR`
- Usa: [`tableBillingAccountsColumns.tsx`](#components-azure-tables-azure-tablas-item-azure-table-tablebillingaccountscolumns-tsx), [`tableResourceGroupsColumns.tsx`](#components-azure-tables-azure-tablas-item-azure-table-tableresourcegroupscolumns-tsx), [`tableServicesColumns.tsx`](#components-azure-tables-azure-tablas-item-azure-table-tableservicescolumns-tsx), [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`card.tsx`](../ui.md#components-ui-card-tsx), [`data-table-single.tsx`](../data-table.md#components-data-table-data-table-single-tsx)
- Usado por: [`MainViewTablasItemAzureComponent.tsx`](#components-azure-tables-azure-tablas-item-azure-mainviewtablasitemazurecomponent-tsx)

Notas de implementación:

- JSX — Tabla 1: Lista de Servicios Registrados
- JSX — Tabla 2: Lista de Grupos de Recursos
- JSX — Tabla 3: Lista de Cuentas de Facturación

---

<a id="components-azure-tables-azure-tablas-item-azure-table-tablebillingaccountscolumns-tsx"></a>
## `components/azure/tables-azure/tablas-item-azure/table/tableBillingAccountsColumns.tsx`

**Módulo (cliente)**

Exporta:

- tipo `BillingAccountData` = `{ display_name: string account_type: string account_status: string agreement_type: string }`
- constante `tableBillingAccountsColumns` = `[ { accessorKey: 'display_name', header: ({ column }) => { return ( <Button var…`

- Usa: [`button.tsx`](../ui.md#components-ui-button-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx)
- Usado por: [`TablasItemAzureComponent.tsx`](#components-azure-tables-azure-tablas-item-azure-tablasitemazurecomponent-tsx)

---

<a id="components-azure-tables-azure-tablas-item-azure-table-tableresourcegroupscolumns-tsx"></a>
## `components/azure/tables-azure/tablas-item-azure/table/tableResourceGroupsColumns.tsx`

**Módulo (cliente)**

Exporta:

- tipo `ResourceGroupData` = `{ id: string name: string location: string subscription: string }`
- constante `tableResourceGroupsColumns` = `[ { accessorKey: 'name', header: ({ column }) => { return ( <Button variant="gh…`

- Usa: [`button.tsx`](../ui.md#components-ui-button-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx)
- Usado por: [`TablasItemAzureComponent.tsx`](#components-azure-tables-azure-tablas-item-azure-tablasitemazurecomponent-tsx)

---

<a id="components-azure-tables-azure-tablas-item-azure-table-tableservicescolumns-tsx"></a>
## `components/azure/tables-azure/tablas-item-azure/table/tableServicesColumns.tsx`

**Módulo (cliente)**

Exporta:

- tipo `ServiceData` = `{ id: string namespace: string subscription: string }`
- constante `tableServicesColumns` = `[ { accessorKey: 'namespace', header: ({ column }) => { return ( <Button varian…`

- Usa: [`button.tsx`](../ui.md#components-ui-button-tsx), [`badge.tsx`](../ui.md#components-ui-badge-tsx)
- Usado por: [`TablasItemAzureComponent.tsx`](#components-azure-tables-azure-tablas-item-azure-tablasitemazurecomponent-tsx)

