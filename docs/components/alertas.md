# Componentes `components/alertas/`

[← Índice](../README.md)

Gestión de alertas: alertas de facturación, anomalías y presupuesto por centro de costo (formularios, tablas, KPIs, top movers e historial).

Archivos:

- [`components/alertas/AlertsManager.tsx`](#components-alertas-alertsmanager-tsx)
- [`components/alertas/SelectAlertsCloud.tsx`](#components-alertas-selectalertscloud-tsx)
- [`components/alertas/anomalies/AnomalyAlertsView.tsx`](#components-alertas-anomalies-anomalyalertsview-tsx)
- [`components/alertas/anomalies/cards/AnomalyKpiCards.tsx`](#components-alertas-anomalies-cards-anomalykpicards-tsx)
- [`components/alertas/anomalies/form/AnomalyAlertForm.tsx`](#components-alertas-anomalies-form-anomalyalertform-tsx)
- [`components/alertas/anomalies/table/AnomalyAlertsTable.tsx`](#components-alertas-anomalies-table-anomalyalertstable-tsx)
- [`components/alertas/anomalies/table/AnomalyTopMoversModal.tsx`](#components-alertas-anomalies-table-anomalytopmoversmodal-tsx)
- [`components/alertas/anomalies/table/anomalyAlertsColumns.tsx`](#components-alertas-anomalies-table-anomalyalertscolumns-tsx)
- [`components/alertas/billing/BillingAlertsView.tsx`](#components-alertas-billing-billingalertsview-tsx)
- [`components/alertas/billing/cards/BillingKpiCards.tsx`](#components-alertas-billing-cards-billingkpicards-tsx)
- [`components/alertas/billing/form/BillingAlertForm.tsx`](#components-alertas-billing-form-billingalertform-tsx)
- [`components/alertas/billing/table/BillingAlertsTable.tsx`](#components-alertas-billing-table-billingalertstable-tsx)
- [`components/alertas/billing/table/TopMoversModal.tsx`](#components-alertas-billing-table-topmoversmodal-tsx)
- [`components/alertas/billing/table/billingAlertsColumns.tsx`](#components-alertas-billing-table-billingalertscolumns-tsx)
- [`components/alertas/budget/CostCenterBudgetView.tsx`](#components-alertas-budget-costcenterbudgetview-tsx)
- [`components/alertas/budget/form/CostCenterBudgetForm.tsx`](#components-alertas-budget-form-costcenterbudgetform-tsx)
- [`components/alertas/budget/status/AlertHistoryModal.tsx`](#components-alertas-budget-status-alerthistorymodal-tsx)
- [`components/alertas/budget/status/CostCenterStatusBoard.tsx`](#components-alertas-budget-status-costcenterstatusboard-tsx)

<a id="components-alertas-alertsmanager-tsx"></a>
## `components/alertas/AlertsManager.tsx`

**Componente (cliente)**

Exporta:

- (default) componente `AlertsManager` `({ provider }: AlertsManagerProps)`

Interfaz `AlertsManagerProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `provider` | `string` | no | — |

- Tipo interno `ModuleType` = `'billing' | 'anomalies' | 'budget' | null`
- Usa: [`BillingAlertsView.tsx`](#components-alertas-billing-billingalertsview-tsx), [`AnomalyAlertsView.tsx`](#components-alertas-anomalies-anomalyalertsview-tsx), [`CostCenterBudgetView.tsx`](#components-alertas-budget-costcenterbudgetview-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-alertas-alertas-nube-page-tsx)

---

<a id="components-alertas-selectalertscloud-tsx"></a>
## `components/alertas/SelectAlertsCloud.tsx`

**Componente (cliente)**

Exporta:

- componente `SelectAlertsCloud` `()`

- Hooks: `useFeatureAccess`, `useRouter`
- Usa: [`useFeatureAccess.ts`](../hooks.md#hooks-usefeatureaccess-ts), [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx), [`ClientSelectorComponent.tsx`](profile.md#components-profile-clientselectorcomponent-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`select.tsx`](ui.md#components-ui-select-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-alertas-alertas-page-tsx)

Notas de implementación:

- JSX — AZURE
- JSX — AWS
- JSX — GCP

---

<a id="components-alertas-anomalies-anomalyalertsview-tsx"></a>
## `components/alertas/anomalies/AnomalyAlertsView.tsx`

**Componente (cliente)**

Exporta:

- interfaz `CloudProject`
- (default) componente `AnomalyAlertsView` `({ provider }: AnomalyAlertsViewProps)`

Interfaz `CloudProject` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string` | no | — |
| `name` | `string` | sí | — |

Interfaz `UserProfile`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `email` | `string` | no | — |
| `client` | `string` | no | — |
| `[key: string]: unknown;` | `unknown` | no | — |

Interfaz `CloudAccount`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string` | no | — |
| `alias` | `string` | no | — |
| `db` | `string` | no | — |

Interfaz `AnomalyAlertsViewProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `provider` | `string` | no | — |

- API: `/api/perfilamiento/users`
- Hooks: `useFeatureAccess`, `useSession`
- Usa: [`useSession.ts`](../hooks.md#hooks-usesession-ts), [`useFeatureAccess.ts`](../hooks.md#hooks-usefeatureaccess-ts), [`SearchableSelect.tsx`](general_alertas.md#components-general-alertas-searchableselect-tsx), [`alertasAnomaliasService.ts`](../lib.md#lib-alertasanomaliasservice-ts), [`alertasService.ts`](../lib.md#lib-alertasservice-ts), [`anomalias.ts`](../tipos.md#interfaces-anomalias-ts), [`AnomalyKpiCards.tsx`](#components-alertas-anomalies-cards-anomalykpicards-tsx), [`AnomalyAlertForm.tsx`](#components-alertas-anomalies-form-anomalyalertform-tsx), [`AnomalyAlertsTable.tsx`](#components-alertas-anomalies-table-anomalyalertstable-tsx)
- Usado por: [`AlertsManager.tsx`](#components-alertas-alertsmanager-tsx), [`AnomalyAlertForm.tsx`](#components-alertas-anomalies-form-anomalyalertform-tsx)

---

<a id="components-alertas-anomalies-cards-anomalykpicards-tsx"></a>
## `components/alertas/anomalies/cards/AnomalyKpiCards.tsx`

**Componente**

Exporta:

- componente `AnomalyKpiCards` `({ totalReglas, anomaliasDetectadas })`

Interfaz `AnomalyKpiCardsProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `totalReglas` | `number` | no | — |
| `anomaliasDetectadas` | `number` | no | — |

- Usado por: [`AnomalyAlertsView.tsx`](#components-alertas-anomalies-anomalyalertsview-tsx)

---

<a id="components-alertas-anomalies-form-anomalyalertform-tsx"></a>
## `components/alertas/anomalies/form/AnomalyAlertForm.tsx`

**Componente**

Exporta:

- componente `AnomalyAlertForm` `({ formData, setFormData, projectOptions, serviceOptions, isLoadingProjects, isLoadingServices, alertEmails, setAlertEmails, handleSubmit, editingId, cancelEdi…`

Interfaz `AnomalyAlertFormProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `formData` | `AnomalyConfig` | no | — |
| `setFormData` | `React.Dispatch<React.SetStateAction<AnomalyConfig>>` | no | — |
| `projectOptions` | `CloudProject[]` | no | — |
| `serviceOptions` | `string[]` | no | — |
| `isLoadingProjects` | `boolean` | no | — |
| `isLoadingServices` | `boolean` | no | — |
| `alertEmails` | `string[]` | no | — |
| `setAlertEmails` | `React.Dispatch<React.SetStateAction<string[]>>` | no | — |
| `handleSubmit` | `(e: React.FormEvent) => void` | no | — |
| `editingId` | `string \| null` | no | — |
| `cancelEdit` | `() => void` | no | — |
| `loading` | `boolean` | no | — |
| `currentUserEmail` | `string` | sí | — |
| `companyEmails` | `string[]` | sí | — |

- Tipo interno `ComparisonPeriodType` = `'previous_day' | '7d' | '15d' | '30d'`
- Usa: [`anomalias.ts`](../tipos.md#interfaces-anomalias-ts), [`AnomalyAlertsView.tsx`](#components-alertas-anomalies-anomalyalertsview-tsx)
- Usado por: [`AnomalyAlertsView.tsx`](#components-alertas-anomalies-anomalyalertsview-tsx)

---

<a id="components-alertas-anomalies-table-anomalyalertstable-tsx"></a>
## `components/alertas/anomalies/table/AnomalyAlertsTable.tsx`

**Componente**

Exporta:

- interfaz `AnomalyAlertsTableProps`
- interfaz `AnomalyHistoryResponse`
- componente `AnomalyAlertsTable` `({ alertas, isFetching, handleEditClick, handleDelete, isDeleting }: AnomalyAlertsTableProps)`

Interfaz `AnomalyAlertsTableProps` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `alertas` | `AnomalyConfig[]` | no | — |
| `isFetching` | `boolean` | no | — |
| `handleEditClick` | `(alerta: AnomalyConfig) => void` | no | — |
| `handleDelete` | `(id: string) => void` | no | — |
| `isDeleting` | `string \| null` | no | — |

Interfaz `AnomalyHistoryResponse` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `top_movers` | `Record<string, unknown>[]` | sí | — |
| `[key: string]: unknown;` | `unknown` | no | — |

- Usa: [`data-table-single.tsx`](data-table.md#components-data-table-data-table-single-tsx), [`LoaderComponent.tsx`](general_alertas.md#components-general-alertas-loadercomponent-tsx), [`anomalyAlertsColumns.tsx`](#components-alertas-anomalies-table-anomalyalertscolumns-tsx), [`anomalias.ts`](../tipos.md#interfaces-anomalias-ts), [`AnomalyTopMoversModal.tsx`](#components-alertas-anomalies-table-anomalytopmoversmodal-tsx), [`alertasAnomaliasService.ts`](../lib.md#lib-alertasanomaliasservice-ts)
- Usado por: [`AnomalyAlertsView.tsx`](#components-alertas-anomalies-anomalyalertsview-tsx)

---

<a id="components-alertas-anomalies-table-anomalytopmoversmodal-tsx"></a>
## `components/alertas/anomalies/table/AnomalyTopMoversModal.tsx`

**Componente**

Exporta:

- interfaz `AnomalyTopMover`
- interfaz `AnomalyTopMoversModalProps`
- componente `AnomalyTopMoversModal` `({ isOpen, onClose, data, isLoading }: AnomalyTopMoversModalProps)`

Interfaz `AnomalyTopMover` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `recurso` | `string` | sí | — |
| `sku` | `string` | sí | — |
| `modelo_precio` | `string` | sí | — |
| `gasto_promedio_historico` | `number` | sí | — |
| `gasto_ayer` | `number` | sí | — |
| `variacion_usd` | `number` | sí | — |
| `impacto_pct` | `number` | sí | — |

Interfaz `AnomalyTopMoversModalProps` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `isOpen` | `boolean` | no | — |
| `onClose` | `() => void` | no | — |
| `data` | `AnomalyTopMover[] \| Record<string, unknown>[]` | no | — |
| `isLoading` | `boolean` | no | — |

- Usado por: [`AnomalyAlertsTable.tsx`](#components-alertas-anomalies-table-anomalyalertstable-tsx)

Notas de implementación:

- _AnomalyTopMoversModal_: JSX — Body

---

<a id="components-alertas-anomalies-table-anomalyalertscolumns-tsx"></a>
## `components/alertas/anomalies/table/anomalyAlertsColumns.tsx`

**Módulo**

Exporta:

- función `getAnomalyAlertsColumns` `(handleEditClick: (alerta: AnomalyConfig) => void, handleDelete: (id: string) => void, isDeleting: string | null, onInspectAlert: (alertaId: string, cloudProvi…`

- Usa: [`anomalias.ts`](../tipos.md#interfaces-anomalias-ts)
- Usado por: [`AnomalyAlertsTable.tsx`](#components-alertas-anomalies-table-anomalyalertstable-tsx)

---

<a id="components-alertas-billing-billingalertsview-tsx"></a>
## `components/alertas/billing/BillingAlertsView.tsx`

**Componente (cliente)**

Exporta:

- (default) componente `BillingAlertsView` `({ provider }: { provider: string })`

Interfaz `CloudAccount`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string` | no | — |
| `alias` | `string` | no | — |
| `db` | `string` | no | — |

Interfaz `UsuarioPerfil`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `client` | `string` | sí | — |
| `email` | `string` | no | — |
| `[key: string]: unknown;` | `unknown` | no | — |

- API: `/api/perfilamiento/users`
- Hooks: `useFeatureAccess`, `useSession`
- Usa: [`alertas.ts`](../tipos.md#interfaces-alertas-ts), [`alertasService.ts`](../lib.md#lib-alertasservice-ts), [`useFeatureAccess.ts`](../hooks.md#hooks-usefeatureaccess-ts), [`SearchableSelect.tsx`](general_alertas.md#components-general-alertas-searchableselect-tsx), [`useSession.ts`](../hooks.md#hooks-usesession-ts), [`BillingKpiCards.tsx`](#components-alertas-billing-cards-billingkpicards-tsx), [`BillingAlertForm.tsx`](#components-alertas-billing-form-billingalertform-tsx), [`BillingAlertsTable.tsx`](#components-alertas-billing-table-billingalertstable-tsx)
- Usado por: [`AlertsManager.tsx`](#components-alertas-alertsmanager-tsx)

---

<a id="components-alertas-billing-cards-billingkpicards-tsx"></a>
## `components/alertas/billing/cards/BillingKpiCards.tsx`

**Componente**

Exporta:

- componente `BillingKpiCards` `({ totalReglas, reglasDisparadas, presupuestoProtegido }: BillingKpiCardsProps)`

Interfaz `BillingKpiCardsProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `totalReglas` | `number` | no | — |
| `reglasDisparadas` | `number` | no | — |
| `presupuestoProtegido` | `number` | no | — |

- Usado por: [`BillingAlertsView.tsx`](#components-alertas-billing-billingalertsview-tsx)

---

<a id="components-alertas-billing-form-billingalertform-tsx"></a>
## `components/alertas/billing/form/BillingAlertForm.tsx`

**Componente**

Exporta:

- componente `BillingAlertForm` `({ formData, setFormData, projectOptions, serviceOptions, isLoadingProjects, isLoadingServices, alertEmails, setAlertEmails, quiereAdvertencias, setQuiereAdver…`

Interfaz `SelectOption`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `label` | `string` | no | — |
| `value` | `string` | no | — |

Interfaz `BillingAlertFormProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `formData` | `AlertConfig` | no | — |
| `setFormData` | `React.Dispatch<React.SetStateAction<AlertConfig>>` | no | — |
| `projectOptions` | `SelectOption[]` | no | — |
| `serviceOptions` | `SelectOption[]` | no | — |
| `isLoadingProjects` | `boolean` | no | — |
| `isLoadingServices` | `boolean` | no | — |
| `alertEmails` | `string[]` | no | — |
| `setAlertEmails` | `React.Dispatch<React.SetStateAction<string[]>>` | no | — |
| `quiereAdvertencias` | `boolean` | no | — |
| `setQuiereAdvertencias` | `(val: boolean) => void` | no | — |
| `porcentajes` | `number[]` | no | — |
| `togglePorcentaje` | `(val: number) => void` | no | — |
| `handleSubmit` | `(e: React.FormEvent) => void` | no | — |
| `editingId` | `string \| null` | no | — |
| `cancelEdit` | `() => void` | no | — |
| `loading` | `boolean` | no | — |
| `currentUserEmail` | `string` | sí | — |
| `companyEmails` | `string[]` | sí | — |

- Usa: [`button.tsx`](ui.md#components-ui-button-tsx), [`SearchableSelect.tsx`](general_alertas.md#components-general-alertas-searchableselect-tsx), [`alertas.ts`](../tipos.md#interfaces-alertas-ts)
- Usado por: [`BillingAlertsView.tsx`](#components-alertas-billing-billingalertsview-tsx)

---

<a id="components-alertas-billing-table-billingalertstable-tsx"></a>
## `components/alertas/billing/table/BillingAlertsTable.tsx`

**Componente**

Exporta:

- componente `BillingAlertsTable` `({ alertas, isFetching, handleEditClick, handleDelete, isDeleting }: BillingAlertsTableProps)`

Interfaz `BillingAlertsTableProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `alertas` | `AlertConfig[]` | no | — |
| `isFetching` | `boolean` | no | — |
| `handleEditClick` | `(alerta: AlertConfig) => void` | no | — |
| `handleDelete` | `(id: string) => void` | no | — |
| `isDeleting` | `string \| null` | no | — |

- Usa: [`data-table-single.tsx`](data-table.md#components-data-table-data-table-single-tsx), [`LoaderComponent.tsx`](general_alertas.md#components-general-alertas-loadercomponent-tsx), [`billingAlertsColumns.tsx`](#components-alertas-billing-table-billingalertscolumns-tsx), [`alertas.ts`](../tipos.md#interfaces-alertas-ts), [`alertasService.ts`](../lib.md#lib-alertasservice-ts), [`TopMoversModal.tsx`](#components-alertas-billing-table-topmoversmodal-tsx)
- Usado por: [`BillingAlertsView.tsx`](#components-alertas-billing-billingalertsview-tsx)

---

<a id="components-alertas-billing-table-topmoversmodal-tsx"></a>
## `components/alertas/billing/table/TopMoversModal.tsx`

**Componente**

Exporta:

- componente `TopMoversModal` `({ isOpen, onClose, data, isLoading, gastoTotal }: TopMoversModalProps)`

Interfaz `TopMover`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `recurso` | `string` | no | — |
| `sku` | `string` | no | — |
| `modelo_precio` | `string` | no | — |
| `gasto_usd` | `number` | no | — |
| `impacto_pct` | `number` | no | — |

Interfaz `TopMoversModalProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `isOpen` | `boolean` | no | — |
| `onClose` | `() => void` | no | — |
| `data` | `TopMover[]` | no | — |
| `isLoading` | `boolean` | no | — |
| `gastoTotal` | `number` | sí | — |

- Usado por: [`BillingAlertsTable.tsx`](#components-alertas-billing-table-billingalertstable-tsx)

Notas de implementación:

- JSX — Header
- JSX — Body

---

<a id="components-alertas-billing-table-billingalertscolumns-tsx"></a>
## `components/alertas/billing/table/billingAlertsColumns.tsx`

**Módulo**

Exporta:

- función `getBillingAlertsColumns` `(handleEditClick: (alerta: AlertConfig) => void, handleDelete: (id: string) => void, isDeleting: string | null, onInspectAlert: (alertaId: string, cloudProvide…`

- Usa: [`alertas.ts`](../tipos.md#interfaces-alertas-ts)
- Usado por: [`BillingAlertsTable.tsx`](#components-alertas-billing-table-billingalertstable-tsx)

---

<a id="components-alertas-budget-costcenterbudgetview-tsx"></a>
## `components/alertas/budget/CostCenterBudgetView.tsx`

**Componente (cliente)**

Exporta:

- (default) componente `CostCenterBudgetView` `({ provider }: CostCenterBudgetViewProps)`

Interfaz `CloudAccount`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string` | no | — |
| `alias` | `string` | no | — |
| `db` | `string` | no | — |

Interfaz `UserProfile`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `email` | `string` | no | — |
| `client` | `string` | no | — |

Interfaz `CostCenterBudgetViewProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `provider` | `string` | no | — |

- API: `/api/perfilamiento/users`
- Hooks: `useFeatureAccess`, `useSession`
- Usa: [`useSession.ts`](../hooks.md#hooks-usesession-ts), [`useFeatureAccess.ts`](../hooks.md#hooks-usefeatureaccess-ts), [`SearchableSelect.tsx`](general_alertas.md#components-general-alertas-searchableselect-tsx), [`LoaderComponent.tsx`](general_alertas.md#components-general-alertas-loadercomponent-tsx), [`alertasBudget.ts`](../lib.md#lib-alertasbudget-ts), [`CostCenterBudgetForm.tsx`](#components-alertas-budget-form-costcenterbudgetform-tsx), [`CostCenterStatusBoard.tsx`](#components-alertas-budget-status-costcenterstatusboard-tsx)
- Usado por: [`AlertsManager.tsx`](#components-alertas-alertsmanager-tsx)

---

<a id="components-alertas-budget-form-costcenterbudgetform-tsx"></a>
## `components/alertas/budget/form/CostCenterBudgetForm.tsx`

**Componente**

Exporta:

- componente `CostCenterBudgetForm` `({ config, centrosCosto, selectedCostCenterId, onCostCenterChange, setConfig, handleSubmit, isSaving, currentUserEmail, companyEmails, feedbackMsg, presupuesto…`

Interfaz `CostCenterBudgetFormProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `config` | `BudgetAlertConfig` | no | — |
| `centrosCosto` | `CostCenter[]` | no | — |
| `selectedCostCenterId` | `number` | no | — |
| `onCostCenterChange` | `(id: number) => void` | no | — |
| `setConfig` | `(config: BudgetAlertConfig) => void` | no | — |
| `handleSubmit` | `(e: React.FormEvent) => void` | no | — |
| `isSaving` | `boolean` | no | — |
| `currentUserEmail` | `string` | sí | — |
| `companyEmails` | `string[]` | no | — |
| `feedbackMsg` | `{ text: string; type: 'success' \| 'info' \| 'error' } \| null` | no | — |
| `presupuestoActual` | `number` | no | — |

- Usa: [`alertasBudget.ts`](../lib.md#lib-alertasbudget-ts)
- Usado por: [`CostCenterBudgetView.tsx`](#components-alertas-budget-costcenterbudgetview-tsx)

---

<a id="components-alertas-budget-status-alerthistorymodal-tsx"></a>
## `components/alertas/budget/status/AlertHistoryModal.tsx`

**Componente**

Exporta:

- interfaz `TopMover`
- interfaz `HistoryEventData`
- interfaz `AlertHistoryModalProps`
- componente `AlertHistoryModal` `({ isOpen, onClose, data }: AlertHistoryModalProps)`

Interfaz `TopMover` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `recurso` | `string` | no | — |
| `sku` | `string` | no | — |
| `modelo_precio` | `string` | sí | — |
| `categoria_servicio` | `string` | sí | — |
| `grupo_recurso` | `string` | sí | — |
| `ubicacion` | `string` | sí | — |
| `suscripcion` | `string` | sí | — |
| `gasto_usd` | `number` | sí | — |
| `impacto_pct` | `number` | sí | — |

Interfaz `HistoryEventData` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `tipo_alerta` | `'EXCEDIDO' \| 'PRECAUCION' \| 'OPTIMO' \| string` | sí | — |
| `porcentaje_alcanzado` | `number` | sí | — |
| `gasto_real_mes` | `number` | sí | — |
| `threshold_amount` | `number` | sí | — |
| `timestamp` | `string \| Date` | sí | — |
| `top_movers` | `TopMover[]` | sí | — |

Interfaz `AlertHistoryModalProps` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `isOpen` | `boolean` | no | — |
| `onClose` | `() => void` | no | — |
| `data` | `HistoryEventData \| HistoryEventData[] \| null` | no | — |

- Usado por: [`CostCenterStatusBoard.tsx`](#components-alertas-budget-status-costcenterstatusboard-tsx)

---

<a id="components-alertas-budget-status-costcenterstatusboard-tsx"></a>
## `components/alertas/budget/status/CostCenterStatusBoard.tsx`

**Componente (cliente)**

Exporta:

- interfaz `CostCenterConfig`
- interfaz `CentroCosto`
- interfaz `CostCenterProps`
- tipo `AlertHistoryData` = `Record<string, unknown> | unknown[]`
- componente `CostCenterStatusBoard` `({ provider, configuraciones, centrosCosto, presupuestosMap }: CostCenterProps)`

Interfaz `CostCenterConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_id` | `string` | no | — |
| `cost_center_id` | `string` | no | — |
| `client_id` | `string` | sí | — |

Interfaz `CentroCosto` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_centro_costo` | `string` | no | — |
| `nombre_centro` | `string` | sí | — |

Interfaz `CostCenterProps` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `provider` | `string` | no | — |
| `configuraciones` | `CostCenterConfig[]` | no | — |
| `centrosCosto` | `CentroCosto[]` | no | — |
| `presupuestosMap` | `Record<string, number>` | no | — |

Interfaz `BudgetStatusResponse`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_regla` | `string` | no | — |

- Usa: [`alertasBudget.ts`](../lib.md#lib-alertasbudget-ts), [`AlertHistoryModal.tsx`](#components-alertas-budget-status-alerthistorymodal-tsx)
- Usado por: [`CostCenterBudgetView.tsx`](#components-alertas-budget-costcenterbudgetview-tsx)

