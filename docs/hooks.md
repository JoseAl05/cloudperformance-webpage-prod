# Hooks (`hooks/`)

[← Índice](README.md)

Hooks compartidos: sesión, empresa activa, acceso por plan, selección multitenant, conectores y detección de móvil.

Archivos:

- [`hooks/use-mobile.ts`](#hooks-use-mobile-ts)
- [`hooks/useActiveCompany.ts`](#hooks-useactivecompany-ts)
- [`hooks/useConnectors.ts`](#hooks-useconnectors-ts)
- [`hooks/useFeatureAccess.ts`](#hooks-usefeatureaccess-ts)
- [`hooks/useMultiTenantSelection.ts`](#hooks-usemultitenantselection-ts)
- [`hooks/useSession.ts`](#hooks-usesession-ts)

<a id="hooks-use-mobile-ts"></a>
## `hooks/use-mobile.ts`

**Hook**

Exporta:

- hook `useIsMobile` `()`

Internos:

- constante `MOBILE_BREAKPOINT`

- Usado por: [`sidebar.tsx`](components/ui.md#components-ui-sidebar-tsx)

---

<a id="hooks-useactivecompany-ts"></a>
## `hooks/useActiveCompany.ts`

**Hook**

Exporta:

- hook `useActiveCompany` `()` — Empresa activa de un admin_global: la del token (`active_client`) mientras no haya otra seleccionada. Al recargar la página el contexto se pierde; en vez de cambiar el token a la primera empresa de la lista (lo que hacía el selector de "Nubes"), se vuelve a marcar como seleccionada la empresa en la que ya está la sesión.

- Hooks: `useClientContext`, `useFeatureAccess`, `useSession`
- Usa: [`useSession.ts`](#hooks-usesession-ts), [`useFeatureAccess.ts`](#hooks-usefeatureaccess-ts), [`ClientContext.tsx`](components/context.md#components-context-clientcontext-tsx)
- Usado por: [`NavbarClientSwitcher.tsx`](components/generales.md#components-navbarclientswitcher-tsx), [`ClientSelectorComponent.tsx`](components/profile.md#components-profile-clientselectorcomponent-tsx)

---

<a id="hooks-useconnectors-ts"></a>
## `hooks/useConnectors.ts`

**Hook**

Exporta:

- hook `useConnector` `()`

Internos:

- función `fetcher` `(url: string)`

- API: `/api/auth/me`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](lib.md#lib-fetcher-ts), [`db.ts`](tipos.md#types-db-ts)
- Usado por: [`AiRecommendationStatusHistoryComponent.tsx`](components/generales.md#components-airecommendationstatushistorycomponent-tsx), [`AiRecommendationStatusesInfoComponent.tsx`](components/ai-recommendation-statuses.md#components-ai-recommendation-statuses-info-airecommendationstatusesinfocomponent-tsx), [`ConnectorsManagerComponent.tsx`](components/profile.md#components-profile-connectorsmanagercomponent-tsx), [`JiraConnectorFormComponent.tsx`](components/profile.md#components-profile-connectors-jiraconnectorformcomponent-tsx), [`ServiceNowConnectorFormComponent.tsx`](components/profile.md#components-profile-connectors-servicenowconnectorformcomponent-tsx)

---

<a id="hooks-usefeatureaccess-ts"></a>
## `hooks/useFeatureAccess.ts`

**Hook**

Exporta:

- hook `useFeatureAccess` `()`

Internos:

- función `fetcher` `(url: string)`
- constante `PLAN_ACCESS_CONFIG`

- API: `/api/auth/swap-client-context`, `/api/perfilamiento/empresas`
- Hooks: `useClientContext`, `useSWR`, `useSession`
- Usa: [`fetcher.ts`](lib.md#lib-fetcher-ts), [`useSession.ts`](#hooks-usesession-ts), [`db.ts`](tipos.md#types-db-ts), [`ClientContext.tsx`](components/context.md#components-context-clientcontext-tsx)
- Usado por: [`layout.tsx`](rutas.md#app-dashboards-ia-amazon-bedrock-layout-tsx), [`layout.tsx`](rutas.md#app-dashboards-ia-google-vertex-layout-tsx), [`layout.tsx`](rutas.md#app-dashboards-ia-microsoft-foundry-layout-tsx), [`layout.tsx`](rutas.md#app-dashboards-ia-open-ia-layout-tsx), [`layout.tsx`](rutas.md#app-dashboards-nubes-cloud-aws-layout-tsx), [`PresupuestoClientLayout.tsx`](rutas.md#app-dashboards-nubes-cloud-aws-presupuesto-presupuestoclientlayout-tsx), [`page.tsx`](rutas.md#app-dashboards-nubes-cloud-aws-recomendaciones-page-tsx), [`page.tsx`](rutas.md#app-dashboards-nubes-cloud-aws-recomendaciones-rec-statuses-page-tsx), [`layout.tsx`](rutas.md#app-dashboards-nubes-cloud-azure-layout-tsx), [`PresupuestoClientLayout.tsx`](rutas.md#app-dashboards-nubes-cloud-azure-presupuesto-presupuestoclientlayout-tsx), [`page.tsx`](rutas.md#app-dashboards-nubes-cloud-azure-recomendaciones-page-tsx), [`page.tsx`](rutas.md#app-dashboards-nubes-cloud-azure-recomendaciones-rec-statuses-page-tsx), [`layout.tsx`](rutas.md#app-dashboards-nubes-cloud-gcp-layout-tsx), [`PresupuestoClientLayout.tsx`](rutas.md#app-dashboards-nubes-cloud-gcp-presupuesto-presupuestoclientlayout-tsx), [`page.tsx`](rutas.md#app-dashboards-nubes-cloud-gcp-recomendaciones-page-tsx), [`page.tsx`](rutas.md#app-dashboards-nubes-cloud-gcp-recomendaciones-rec-statuses-page-tsx), [`PresupuestoClientLayout.tsx`](rutas.md#app-presupuesto-presupuesto-presupuestoclientlayout-tsx), [`NavbarClientSwitcher.tsx`](components/generales.md#components-navbarclientswitcher-tsx), [`SelectAlertsCloud.tsx`](components/alertas.md#components-alertas-selectalertscloud-tsx), [`AnomalyAlertsView.tsx`](components/alertas.md#components-alertas-anomalies-anomalyalertsview-tsx), [`BillingAlertsView.tsx`](components/alertas.md#components-alertas-billing-billingalertsview-tsx), [`CostCenterBudgetView.tsx`](components/alertas.md#components-alertas-budget-costcenterbudgetview-tsx), [`MainViewMultiCloudComponent.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-mainviewmulticloudcomponent-tsx), [`ClientSelectorComponent.tsx`](components/profile.md#components-profile-clientselectorcomponent-tsx), [`SelectAIServiceComponent.tsx`](components/profile.md#components-profile-selectaiservicecomponent-tsx), [`SelectCloudComponent.tsx`](components/profile.md#components-profile-selectcloudcomponent-tsx), [`useActiveCompany.ts`](#hooks-useactivecompany-ts)

Notas de implementación:

- Caso 1: Admin Global visualizando una empresa seleccionada
- Caso 2: Admin Empresa o Usuario  (usando su propia sesión)
- LÓGICA MULTI-TENANT
- Normalizar nubes
- El servidor sólo acepta IDs de cuenta y resuelve la BD desde la empresa destino.
- Cambia la empresa/cuentas del token. Devuelve `true` si el servidor aceptó el cambio.

---

<a id="hooks-usemultitenantselection-ts"></a>
## `hooks/useMultiTenantSelection.ts`

**Hook**

Exporta:

- tipo `CloudProvider` = `'azure' | 'aws' | 'gcp'`
- interfaz `MultiTenantSelection`
- interfaz `CloudAccount`
- hook `useMultiTenantSelection` `()`

Interfaz `MultiTenantSelection` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `azure` | `string[]` | no | — |
| `aws` | `string[]` | no | — |
| `gcp` | `string[]` | no | — |

Interfaz `CloudAccount` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string` | no | — |
| `alias` | `string` | no | — |
| `db` | `string` | no | — |

- Usado por: [`MainViewMultiCloudComponent.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-mainviewmulticloudcomponent-tsx), [`MultiCloudComponent.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-multicloudcomponent-tsx), [`MultiCloudFiltersComponent.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-filters-multicloudfilterscomponent-tsx), [`MultiCloudLineChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-grafico-multicloudlinechartcomponent-tsx), [`MultiCloudMonthlyServiceChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-grafico-multicloudmonthlyservicechartcomponent-tsx), [`MultiCloudServiceBarChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-grafico-multicloudservicebarchartcomponent-tsx)

---

<a id="hooks-usesession-ts"></a>
## `hooks/useSession.ts`

**Hook**

Exporta:

- hook `useSession` `()`

Internos:

- función `fetcher` `(url: string)`

- API: `/api/auth/me`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](lib.md#lib-fetcher-ts), [`db.ts`](tipos.md#types-db-ts)
- Usado por: [`page.tsx`](rutas.md#app-profile-comparacion-comparacion-nubes-page-tsx), [`page.tsx`](rutas.md#app-profile-perfilamiento-perfilamiento-licencias-crear-page-tsx), [`page.tsx`](rutas.md#app-profile-perfilamiento-perfilamiento-licencias-page-tsx), [`page.tsx`](rutas.md#app-profile-perfilamiento-perfilamiento-page-tsx), [`page.tsx`](rutas.md#app-profile-perfilamiento-perfilamiento-usuarios-crear-page-tsx), [`page.tsx`](rutas.md#app-profile-perfilamiento-perfilamiento-usuarios-page-tsx), [`page.tsx`](rutas.md#app-profile-op-licencias-estado-page-tsx), [`page.tsx`](rutas.md#app-profile-op-licencias-generar-page-tsx), [`page.tsx`](rutas.md#app-profile-op-licencias-historial-page-tsx), [`page.tsx`](rutas.md#app-profile-op-licencias-importar-page-tsx), [`page.tsx`](rutas.md#app-profile-op-licencias-page-tsx), [`page.tsx`](rutas.md#app-profile-op-licencias-partner-page-tsx), [`page.tsx`](rutas.md#app-profile-op-licencias-solicitudes-page-tsx), [`AnomalyAlertsView.tsx`](components/alertas.md#components-alertas-anomalies-anomalyalertsview-tsx), [`BillingAlertsView.tsx`](components/alertas.md#components-alertas-billing-billingalertsview-tsx), [`CostCenterBudgetView.tsx`](components/alertas.md#components-alertas-budget-costcenterbudgetview-tsx), [`InterCloudSelectionComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intercloud-intercloudselectioncomponent-tsx), [`IntraCloudSelectionComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-intracloudselectioncomponent-tsx), [`MultiCloudComponent.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-multicloudcomponent-tsx), [`CloudFilterComponent.tsx`](components/general_presupuesto.md#components-general-presupuesto-filters-cloudfiltercomponent-tsx), [`SesionGate.tsx`](components/general_presupuesto.md#components-general-presupuesto-session-sesiongate-tsx), [`CreateUserForm.tsx`](components/perfilamiento.md#components-perfilamiento-createuserform-tsx), [`EditUserModal.tsx`](components/perfilamiento.md#components-perfilamiento-editusermodal-tsx), [`LicenseCreationForm.tsx`](components/perfilamiento.md#components-perfilamiento-licensecreationform-tsx), [`UserTable.tsx`](components/perfilamiento.md#components-perfilamiento-usertable-tsx), [`MainProfileComponent.tsx`](components/profile.md#components-profile-mainprofilecomponent-tsx), [`SidebarProfile.tsx`](components/profile.md#components-profile-sidebarprofile-tsx), [`useActiveCompany.ts`](#hooks-useactivecompany-ts), [`useFeatureAccess.ts`](#hooks-usefeatureaccess-ts)

