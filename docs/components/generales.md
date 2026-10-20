# Componentes `components/`

[← Índice](../README.md)

Componentes de la estructura general: barra de navegación y selector de empresa, barras laterales de dashboards, proveedor de SWR y de tema, recomendaciones IA con su historial de estados y el botón para crear tickets.

Archivos:

- [`components/AiRecommendationStatusHistoryComponent.tsx`](#components-airecommendationstatushistorycomponent-tsx)
- [`components/AiRecommendationsComponent.tsx`](#components-airecommendationscomponent-tsx)
- [`components/AiRecommendationsStatusDialogComponent.tsx`](#components-airecommendationsstatusdialogcomponent-tsx)
- [`components/Navbar.tsx`](#components-navbar-tsx)
- [`components/NavbarClientSwitcher.tsx`](#components-navbarclientswitcher-tsx)
- [`components/SWRProvider.tsx`](#components-swrprovider-tsx)
- [`components/SidebarDashboardNubes.tsx`](#components-sidebardashboardnubes-tsx)
- [`components/SidebarDashboardServiciosIa.tsx`](#components-sidebardashboardserviciosia-tsx)
- [`components/SidebarNav.tsx`](#components-sidebarnav-tsx)
- [`components/ThemeProvider.tsx`](#components-themeprovider-tsx)
- [`components/TicketButtonComponent.tsx`](#components-ticketbuttoncomponent-tsx)

<a id="components-airecommendationstatushistorycomponent-tsx"></a>
## `components/AiRecommendationStatusHistoryComponent.tsx`

**Componente (cliente)**

Exporta:

- función `createTicketFetcher` `async (url: string, { arg }: { arg: unknown }): Promise<T>`
- función `validateTicketsBatchFetcher` `async ([url, payload]: [string, string]): Promise<BatchValidationResponse>`
- tipo `TicketState` = `{ key: string; url: string; connectorType: 'jira' | 'servicenow'; }`
- componente `AiRecommendationStatusHistoryComponent` `({ data }: AiRecommendationStatusHistoryComponentProps)`

Interfaz `AiRecommendationStatusHistoryComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `RecommendationStatusGroup[] \| null` | no | — |

Interfaz `StatusGroupCardProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `group` | `RecommendationStatusGroup` | no | — |
| `allExecutionStatuses` | `{ execution_status: RecommendationStatus; status_assigned_at: string;…` | no | — |
| `jiraValidationResult` | `TicketValidationResult \| undefined` | no | — |
| `servicenowValidationResult` | `TicketValidationResult \| undefined` | no | — |
| `isValidatingJira` | `boolean` | no | — |
| `isValidatingServiceNow` | `boolean` | no | — |

- Tipo interno `CreateTicketResponse` = `CreateJiraTicketResponse | CreateServiceNowTicketResponse`
Internos:

- constante `STATUS_STYLES`
- constante `STATUS_DOT_COLOR`
- constante `CREATE_JIRA_TICKET_KEY`
- constante `VALIDATE_JIRA_TICKETS_KEY`
- constante `CREATE_SERVICENOW_TICKET_KEY`
- constante `VALIDATE_SERVICENOW_TICKETS_KEY`
- constante `CONNECTOR_DISPLAY_NAME`
- función `cleanText` `(text: string)`
- función `formatDate` `(dateStr: string)`
- componente `StatusGroupCard` `({ group, allExecutionStatuses, jiraValidationResult, servicenowValidationResult, isValidatingJira, isValidatingService…`

- API: `/api/connector/bridge/connector/jira/create_ticket`, `/api/connector/bridge/connector/jira/validate_tickets`, `/api/connector/bridge/connector/servicenow/create_ticket`, `/api/connector/bridge/connector/servicenow/validate_tickets`
- Hooks: `useConnector`, `useSWR`, `useSWRMutation`
- Usa: [`aiRecommendations.ts`](../tipos.md#interfaces-ai-recommendations-airecommendations-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`useConnectors.ts`](../hooks.md#hooks-useconnectors-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`TicketButtonComponent.tsx`](#components-ticketbuttoncomponent-tsx)
- Usado por: [`AiRecommendationsStatusDialogComponent.tsx`](#components-airecommendationsstatusdialogcomponent-tsx), [`AiRecommendationStatusesInfoComponent.tsx`](ai-recommendation-statuses.md#components-ai-recommendation-statuses-info-airecommendationstatusesinfocomponent-tsx)

---

<a id="components-airecommendationscomponent-tsx"></a>
## `components/AiRecommendationsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AiRecommendationsComponent` `({ data, cloud }: AiRecommendationsComponentProps)`

Interfaz `AiRecommendationsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `AiRecommendationReport[] \| null` | no | — |
| `cloud` | `string` | no | — |

Interfaz `StatusFeedbackToastProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `feedback` | `StatusFeedback` | no | — |
| `onDismiss` | `() => void` | no | — |

Interfaz `StatusSectionProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource` | `AiRecommendationResource` | no | — |
| `onSubmit` | `(newStatus: RecommendationStatus, comment: string) => Promise<void>` | no | — |
| `onOpenHistory` | `() => void` | no | — |

Interfaz `ResourceCardProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource` | `AiRecommendationResource` | no | — |
| `onStatusChange` | `(newStatus: RecommendationStatus, comment: string) => Promise<void>` | no | — |
| `onOpenHistory` | `() => void` | no | — |

Interfaz `FindingsSectionProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resources` | `AiRecommendationResource[]` | no | — |
| `onStatusChange` | `(resourceIndex: number, newStatus: RecommendationStatus, comment: str…` | no | — |
| `onOpenHistory` | `(resourceIndex: number) => void` | no | — |

- Tipo interno `FetcherError` = `Error & { status?: number }`
- Tipo interno `StatusFeedback` = `{ recommendation_updated: boolean; status_event_created: boolean; error?: string; }`
- Tipo interno `SortField` = `'savings' | 'potential' | 'risk'`
- Tipo interno `PotentialConfidence` = `'High' | 'Medium' | 'Low' | 'Not applicable'`
- Tipo interno `SortDirection` = `'desc' | 'asc'`
- Tipo interno `StatusFilterValue` = `RecommendationStatus | 'unassigned'`
Internos:

- constante `STATUS_OPTIONS`
- constante `STATUS_STYLES`
- constante `UNASSIGNED_BADGE`
- constante `RISK_ORDER`
- constante `CONFIDENCE_LABELS`
- constante `CONFIDENCE_STYLES`
- constante `CONFIDENCE_HINTS`
- constante `ITEMS_PER_PAGE`
- constante `ALL_STATUS_FILTERS`
- función `statusFetcher` `(url: string, { arg }: { arg: RecommendationStatusEvent }): Promise<AssignExecutionStatusResponse>`
- función `formatCurrency` `(amount: number, currency: string = 'USD')`
- función `formatRatio` `(value: number)`
- función `getRiskStyles` `(risk: string)`
- función `cleanText` `(text: string)`
- función `computeRecommendationGroupId` `(resource: AiRecommendationResource, cloudProvider: string): string`
- función `getRiskWeight` `(level: string): number`
- función `normalizeConfidence` `(value?: string): PotentialConfidence`
- componente `ConfidenceBadge` `({ value, className = '' }: { value?: string; className?: string })`
- componente `SavingsScenarioSummary` `({ conservative, optimistic, confidence, syncTime, }: { conservative: number; optimistic?: number | null; confidence?: …`
- componente `StatusFeedbackToast` `({ feedback, onDismiss }: StatusFeedbackToastProps)`
- componente `StatusSection` `({ resource, onSubmit, onOpenHistory }: StatusSectionProps)`
- componente `ResourceCard` `({ resource, onStatusChange, onOpenHistory }: ResourceCardProps)`
- componente `FindingsSection` `({ resources, onStatusChange, onOpenHistory }: FindingsSectionProps)`

- API: `/api/aws/bridge/advisor/assign_recommendation_execution_status`, `/api/azure/bridge/azure/assign_recommendation_execution_status`, `/api/gcp/bridge/gcp/ai_recommendations/assign_recommendation_execution_status`
- Hooks: `useSWRMutation`
- Usa: [`aiRecommendations.ts`](../tipos.md#interfaces-ai-recommendations-airecommendations-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`select.tsx`](ui.md#components-ui-select-tsx), [`textarea.tsx`](ui.md#components-ui-textarea-tsx), [`AiRecommendationsStatusDialogComponent.tsx`](#components-airecommendationsstatusdialogcomponent-tsx), [`separator.tsx`](ui.md#components-ui-separator-tsx), [`tooltip.tsx`](ui.md#components-ui-tooltip-tsx)
- Usado por: [`AdvisorViewComponent.tsx`](aws/vista-advisor.md#components-aws-vista-advisor-advisorviewcomponent-tsx), [`AdvisorViewComponent.tsx`](azure/vista-advisor.md#components-azure-vista-advisor-advisorviewcomponent-tsx), [`RecommenderComponent.tsx`](gcp/vista-recommender.md#components-gcp-vista-recommender-recommendercomponent-tsx)

Notas de implementación:

- JSX — Cabecera del Reporte

---

<a id="components-airecommendationsstatusdialogcomponent-tsx"></a>
## `components/AiRecommendationsStatusDialogComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AiRecommendationsStatusDialogComponent` `({ open, onOpenChange, recGroupId, cloud, }: AiRecommendationsStatusDialogComponentProps)`

Interfaz `AiRecommendationsStatusDialogComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `open` | `boolean` | no | — |
| `onOpenChange` | `(open: boolean) => void` | no | — |
| `recGroupId` | `string \| null` | no | — |
| `cloud` | `string` | no | — |

- Tipo interno `FetcherError` = `Error & { status?: number }`
Internos:

- función `historyFetcher` `(url: string): Promise<RecommendationStatusGroup[]>`

- API: `/api/aws/bridge/advisor/get_recommendation_execution_status_history`, `/api/azure/bridge/azure/get_recommendation_execution_status_history`, `/api/gcp/bridge/gcp/ai_recommendations/get_recommendation_execution_status_history`
- Hooks: `useSWR`
- Usa: [`dialog.tsx`](ui.md#components-ui-dialog-tsx), [`aiRecommendations.ts`](../tipos.md#interfaces-ai-recommendations-airecommendations-ts), [`AiRecommendationStatusHistoryComponent.tsx`](#components-airecommendationstatushistorycomponent-tsx)
- Usado por: [`AiRecommendationsComponent.tsx`](#components-airecommendationscomponent-tsx)

---

<a id="components-navbar-tsx"></a>
## `components/Navbar.tsx`

**Componente (cliente)**

Exporta:

- componente `Navbar` `({ payload }: NavbarProps)`

Interfaz `NavbarProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `payload` | `unknown` | no | — |

- API: `/api/auth/logout`
- Hooks: `useTheme`
- Usa: [`button.tsx`](ui.md#components-ui-button-tsx), [`dropdown-menu.tsx`](ui.md#components-ui-dropdown-menu-tsx), [`NavbarClientSwitcher.tsx`](#components-navbarclientswitcher-tsx)
- Usado por: [`layout.tsx`](../rutas.md#app-alertas-layout-tsx), [`layout.tsx`](../rutas.md#app-dashboards-ia-layout-tsx), [`layout.tsx`](../rutas.md#app-dashboards-nubes-layout-tsx), [`layout.tsx`](../rutas.md#app-presupuesto-presupuesto-layout-tsx), [`layout.tsx`](../rutas.md#app-profile-layout-tsx)

---

<a id="components-navbarclientswitcher-tsx"></a>
## `components/NavbarClientSwitcher.tsx`

**Componente (cliente)**

Exporta:

- componente `NavbarClientSwitcher` `()` — Cambio de empresa para admin_global desde el navbar (mismo flujo que el selector de "Nubes").

- Hooks: `useActiveCompany`, `useFeatureAccess`
- Usa: [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`useFeatureAccess.ts`](../hooks.md#hooks-usefeatureaccess-ts), [`useActiveCompany.ts`](../hooks.md#hooks-useactivecompany-ts), [`utils.ts`](../lib.md#lib-utils-ts)
- Usado por: [`Navbar.tsx`](#components-navbar-tsx)

Notas de implementación:

- Recarga completa: las vistas abiertas tienen datos (SWR) del token anterior

---

<a id="components-swrprovider-tsx"></a>
## `components/SWRProvider.tsx`

**Componente (cliente)**

Exporta:

- componente `SWRProvider` `({ children }: { children: React.ReactNode })`

Internos:

- constante `MAX_ERROR_RETRIES`
- constante `ERROR_RETRY_INTERVAL_MS`

- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts)
- Usado por: [`layout.tsx`](../rutas.md#app-layout-tsx)

Notas de implementación:

- Desactiva la revalidación al enfocar la ventana (soluciona tu problema)
- Opcional: Evita recargar al recuperar conexión a internet
- lib/fetcher lanza error en respuestas no-2xx: un 4xx no se reintenta (repetirlo no cambia el resultado) y los 5xx / errores de red se reintentan como máximo 2 veces. Un timeout tampoco se reintenta: repetir una consulta de 2 minutos sólo carga más la API.
- Las vistas muestran un error genérico; el motivo de un timeout se avisa una sola vez (mismo id) aunque fallen varios gráficos de la página.

---

<a id="components-sidebardashboardnubes-tsx"></a>
## `components/SidebarDashboardNubes.tsx`

**Componente (cliente)**

Exporta:

- componente `SidebarDashboardNubesComponent` `({ ...props }: React.ComponentProps<typeof Sidebar>)`

- Tipo interno `Provider` = `'aws' | 'azure' | 'gcp'`
Internos:

- constante `NAV`

- Hooks: `usePathname`
- Usa: [`SidebarNav.tsx`](#components-sidebarnav-tsx), [`sidebar.tsx`](ui.md#components-ui-sidebar-tsx)
- Usado por: [`layout.tsx`](../rutas.md#app-dashboards-nubes-layout-tsx)

---

<a id="components-sidebardashboardserviciosia-tsx"></a>
## `components/SidebarDashboardServiciosIa.tsx`

**Componente (cliente)**

Exporta:

- componente `SidebarDashboardServiciosIaComponent` `({ ...props }: React.ComponentProps<typeof Sidebar>)`

- Tipo interno `Service` = `'amazon-bedrock' | 'microsoft-foundry' | 'google-vertex' | 'open-ia'`
Internos:

- constante `NAV`

- Hooks: `usePathname`
- Usa: [`SidebarNav.tsx`](#components-sidebarnav-tsx), [`sidebar.tsx`](ui.md#components-ui-sidebar-tsx)
- Usado por: [`layout.tsx`](../rutas.md#app-dashboards-ia-layout-tsx)

---

<a id="components-sidebarnav-tsx"></a>
## `components/SidebarNav.tsx`

**Componente (cliente)**

Exporta:

- tipo `NavItem` = `{ label: string icon: LucideIcon href?: string color?: string prefix?: boolean items?: NavItem[] }`
- función `isItemActive` `(item: NavItem, pathname: string)`
- función `containsActive` `(items: NavItem[], pathname: string): boolean`
- función `resolveNav` `(map: Record<K, NavItem[]>, pathname: string): NavItem[]`
- componente `NavTree` `({ items, pathname, openMap, onToggle, forceOpen, parentId = '', depth = 0, }: NavTreeProps)`
- componente `SidebarNav` `({ items, ...props }: SidebarNavProps)`

- Tipo interno `NavTreeProps` = `{ items: NavItem[] pathname: string openMap: Record<string, boolean> onToggle: (id: string, open: boolean) => void forc…`
- Tipo interno `SidebarNavProps` = `React.ComponentProps<typeof Sidebar> & { items: NavItem[] }`
Internos:

- constante `FILTER_MIN_ITEMS`
- función `normalize` `(value: string)`
- función `filterNav` `(items: NavItem[], query: string): NavItem[]`
- función `countLeaves` `(items: NavItem[]): number`
- constante `rowBase`
- constante `rowIdle`
- constante `rowActive`
- constante `rowTrail`

- Hooks: `usePathname`, `useSidebar`
- Usa: [`collapsible.tsx`](ui.md#components-ui-collapsible-tsx), [`sidebar.tsx`](ui.md#components-ui-sidebar-tsx), [`utils.ts`](../lib.md#lib-utils-ts)
- Usado por: [`SidebarDashboardNubes.tsx`](#components-sidebardashboardnubes-tsx), [`SidebarDashboardServiciosIa.tsx`](#components-sidebardashboardserviciosia-tsx), [`SidebarProfile.tsx`](profile.md#components-profile-sidebarprofile-tsx)

---

<a id="components-themeprovider-tsx"></a>
## `components/ThemeProvider.tsx`

**Componente (cliente)**

Exporta:

- componente `ThemeProvider` `({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>)`

- Usado por: [`layout.tsx`](../rutas.md#app-layout-tsx)

---

<a id="components-ticketbuttoncomponent-tsx"></a>
## `components/TicketButtonComponent.tsx`

**Componente**

Exporta:

- componente `TicketButtonComponent` `({ connectorType, onCreate, isCreating, displayName }: TicketButtonComponentProps)`

Interfaz `TicketButtonComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `connectorType` | `string` | no | — |
| `onCreate` | `Promise<void>` | no | — |
| `isCreating` | `boolean` | no | — |
| `displayName` | `string` | no | — |

- Usa: [`button.tsx`](ui.md#components-ui-button-tsx)
- Usado por: [`AiRecommendationStatusHistoryComponent.tsx`](#components-airecommendationstatushistorycomponent-tsx), [`AiRecommendationStatusesInfoComponent.tsx`](ai-recommendation-statuses.md#components-ai-recommendation-statuses-info-airecommendationstatusesinfocomponent-tsx)

