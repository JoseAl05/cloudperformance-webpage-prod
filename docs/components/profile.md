# Componentes `components/profile/`

[← Índice](../README.md)

Perfil: selector de empresa, elección de nube o servicio de IA, barra lateral del perfil y la gestión de conectores (Jira, ServiceNow).

Archivos:

- [`components/profile/ClientSelectorComponent.tsx`](#components-profile-clientselectorcomponent-tsx)
- [`components/profile/ConnectorsManagerComponent.tsx`](#components-profile-connectorsmanagercomponent-tsx)
- [`components/profile/MainProfileComponent.tsx`](#components-profile-mainprofilecomponent-tsx)
- [`components/profile/SelectAIServiceComponent.tsx`](#components-profile-selectaiservicecomponent-tsx)
- [`components/profile/SelectCloudComponent.tsx`](#components-profile-selectcloudcomponent-tsx)
- [`components/profile/SidebarProfile.tsx`](#components-profile-sidebarprofile-tsx)
- [`components/profile/connectors/JiraConnectorFormComponent.tsx`](#components-profile-connectors-jiraconnectorformcomponent-tsx)
- [`components/profile/connectors/ServiceNowConnectorFormComponent.tsx`](#components-profile-connectors-servicenowconnectorformcomponent-tsx)

<a id="components-profile-clientselectorcomponent-tsx"></a>
## `components/profile/ClientSelectorComponent.tsx`

**Componente (cliente)**

Exporta:

- (default) componente `ClientSelectorComponent` `()`

- Hooks: `useActiveCompany`, `useClientContext`, `useFeatureAccess`
- Usa: [`useFeatureAccess.ts`](../hooks.md#hooks-usefeatureaccess-ts), [`useActiveCompany.ts`](../hooks.md#hooks-useactivecompany-ts), [`ClientContext.tsx`](context.md#components-context-clientcontext-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`utils.ts`](../lib.md#lib-utils-ts)
- Usado por: [`SelectAlertsCloud.tsx`](alertas.md#components-alertas-selectalertscloud-tsx), [`SelectAIServiceComponent.tsx`](#components-profile-selectaiservicecomponent-tsx), [`SelectCloudComponent.tsx`](#components-profile-selectcloudcomponent-tsx)

Notas de implementación:

- Sin selección (p. ej. tras recargar) se marca la empresa en la que ya está la sesión, sin cambiar el token (antes se cambiaba a la primera empresa de la lista). Comparte el estado con el selector del navbar.

---

<a id="components-profile-connectorsmanagercomponent-tsx"></a>
## `components/profile/ConnectorsManagerComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ConnectorsManagerComponent` `()`

- Tipo interno `ConnectorStatus` = `"configured" | "not_configured" | "coming_soon"`
- Tipo interno `ConnectorDefinition` = `{ id: string; name: string; description: string; Icon: LucideIcon; status: ConnectorStatus; FormComponent: ComponentTyp…`
Internos:

- constante `CONNECTORS`
- constante `STATUS_LABELS`
- constante `STATUS_CLASSES`

- Hooks: `useConnector`
- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`badge.tsx`](ui.md#components-ui-badge-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`JiraConnectorFormComponent.tsx`](#components-profile-connectors-jiraconnectorformcomponent-tsx), [`ServiceNowConnectorFormComponent.tsx`](#components-profile-connectors-servicenowconnectorformcomponent-tsx), [`useConnectors.ts`](../hooks.md#hooks-useconnectors-ts)
- Usado por: [`page.tsx`](../rutas.md#app-profile-perfil-conectores-page-tsx)

---

<a id="components-profile-mainprofilecomponent-tsx"></a>
## `components/profile/MainProfileComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainProfileComponent` `()`

- Hooks: `useSession`
- Usa: [`useSession.ts`](../hooks.md#hooks-usesession-ts), [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts)
- Usado por: [`page.tsx`](../rutas.md#app-profile-perfil-page-tsx)

---

<a id="components-profile-selectaiservicecomponent-tsx"></a>
## `components/profile/SelectAIServiceComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `SelectAIServiceComponent` `()`

- Hooks: `useFeatureAccess`, `useRouter`
- Usa: [`useFeatureAccess.ts`](../hooks.md#hooks-usefeatureaccess-ts), [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx), [`ClientSelectorComponent.tsx`](#components-profile-clientselectorcomponent-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`select.tsx`](ui.md#components-ui-select-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-profile-perfil-servicios-ia-page-tsx)

Notas de implementación:

- Lógica para determinar si el usuario puede avanzar NO tiene múltiples cuentas (es única) O SI tiene múltiples y ya seleccionó una.
- JSX — AZURE
- JSX — Solo mostramos la flecha si está listo
- JSX — AWS
- JSX — GCP
- JSX — OPEN IA

---

<a id="components-profile-selectcloudcomponent-tsx"></a>
## `components/profile/SelectCloudComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `SelectCloudComponent` `()`

- Hooks: `useFeatureAccess`, `useRouter`
- Usa: [`useFeatureAccess.ts`](../hooks.md#hooks-usefeatureaccess-ts), [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx), [`ClientSelectorComponent.tsx`](#components-profile-clientselectorcomponent-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`select.tsx`](ui.md#components-ui-select-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-profile-perfil-nubes-page-tsx)

Notas de implementación:

- Lógica para determinar si el usuario puede avanzar NO tiene múltiples cuentas (es única) O SI tiene múltiples y ya seleccionó una.
- Solo permitimos navegar si está listo
- Si es cuenta única, aseguramos el token con la cuenta [0]
- JSX — AZURE
- JSX — Solo mostramos la flecha si está listo
- JSX — AWS
- JSX — GCP

---

<a id="components-profile-sidebarprofile-tsx"></a>
## `components/profile/SidebarProfile.tsx`

**Componente (cliente)**

Exporta:

- componente `SidebarProfileComponent` `({ ...props }: React.ComponentProps<typeof Sidebar>)`

Internos:

- constante `BASE_ITEMS`
- constante `MULTITENANT_ITEM`
- constante `PROFILING_ITEM`
- constante `ONPREM_LICENSES_ITEM`
- constante `ALERTS_ITEM`

- Hooks: `useSession`
- Usa: [`SidebarNav.tsx`](generales.md#components-sidebarnav-tsx), [`sidebar.tsx`](ui.md#components-ui-sidebar-tsx), [`useSession.ts`](../hooks.md#hooks-usesession-ts)
- Usado por: [`layout.tsx`](../rutas.md#app-alertas-layout-tsx), [`layout.tsx`](../rutas.md#app-presupuesto-presupuesto-layout-tsx), [`layout.tsx`](../rutas.md#app-profile-layout-tsx)

---

<a id="components-profile-connectors-jiraconnectorformcomponent-tsx"></a>
## `components/profile/connectors/JiraConnectorFormComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `JiraConnectorFormComponent` `({ onCreated, }: JiraConnectorFormProps)`

- Tipo interno `JiraConnectorFormState` = `{ jira_url: string; client_id: string; client_secret: string; default_project: string; }`
- Tipo interno `JiraConnectorFormProps` = `{ onCreated?: () => void; }`
Internos:

- constante `INITIAL_STATE`

- Hooks: `useConnector`, `useSWRMutation`
- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`label.tsx`](ui.md#components-ui-label-tsx), [`input.tsx`](ui.md#components-ui-input-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`handleConnectorsCreation.ts`](../lib.md#lib-handleconnectorscreation-ts), [`useConnectors.ts`](../hooks.md#hooks-useconnectors-ts)
- Usado por: [`ConnectorsManagerComponent.tsx`](#components-profile-connectorsmanagercomponent-tsx)

---

<a id="components-profile-connectors-servicenowconnectorformcomponent-tsx"></a>
## `components/profile/connectors/ServiceNowConnectorFormComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `ServiceNowConnectorFormComponent` `({ onCreated, }: ServiceNowConnectorFormProps)`

- Tipo interno `ServiceNowConnectorFormState` = `{ instance_url: string; client_id: string; client_secret: string; default_table: string; }`
- Tipo interno `ServiceNowConnectorFormProps` = `{ onCreated?: () => void; }`
Internos:

- constante `INITIAL_STATE`

- Hooks: `useConnector`, `useSWRMutation`
- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`label.tsx`](ui.md#components-ui-label-tsx), [`input.tsx`](ui.md#components-ui-input-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`handleConnectorsCreation.ts`](../lib.md#lib-handleconnectorscreation-ts), [`useConnectors.ts`](../hooks.md#hooks-useconnectors-ts)
- Usado por: [`ConnectorsManagerComponent.tsx`](#components-profile-connectorsmanagercomponent-tsx)

