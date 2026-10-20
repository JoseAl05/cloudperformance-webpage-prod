# Componentes `components/ai-recommendation-statuses/`

[← Índice](../README.md)

Seguimiento del estado de ejecución de las recomendaciones IA y creación/validación de tickets en Jira o ServiceNow.

Archivos:

- [`components/ai-recommendation-statuses/AiRecommendationStatusesComponent.tsx`](#components-ai-recommendation-statuses-airecommendationstatusescomponent-tsx)
- [`components/ai-recommendation-statuses/MainViewAiRecommendationStatusesComponent.tsx`](#components-ai-recommendation-statuses-mainviewairecommendationstatusescomponent-tsx)
- [`components/ai-recommendation-statuses/info/AiRecommendationStatusesInfoComponent.tsx`](#components-ai-recommendation-statuses-info-airecommendationstatusesinfocomponent-tsx)

<a id="components-ai-recommendation-statuses-airecommendationstatusescomponent-tsx"></a>
## `components/ai-recommendation-statuses/AiRecommendationStatusesComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `AiRecommendationStatusesComponent` `({ startDate, endDate, cloud }: AiRecommendationStatusesComponentProps)`

Interfaz `AiRecommendationStatusesComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `cloud` | `string` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`

- API: `/api/aws/bridge/advisor/get_all_recomendations_statuses_events`, `/api/azure/bridge/azure/get_all_recomendations_statuses_events`, `/api/gcp/bridge/gcp/ai_recommendations/get_all_recomendations_statuses_events`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`AiRecommendationStatusesInfoComponent.tsx`](#components-ai-recommendation-statuses-info-airecommendationstatusesinfocomponent-tsx), [`MessageCards.tsx`](aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx), [`aiRecommendations.ts`](../tipos.md#interfaces-ai-recommendations-airecommendations-ts)
- Usado por: [`MainViewAiRecommendationStatusesComponent.tsx`](#components-ai-recommendation-statuses-mainviewairecommendationstatusescomponent-tsx)

---

<a id="components-ai-recommendation-statuses-mainviewairecommendationstatusescomponent-tsx"></a>
## `components/ai-recommendation-statuses/MainViewAiRecommendationStatusesComponent.tsx`

**Componente**

Exporta:

- componente `MainViewAiRecommendationStatusesComponent` `({cloud}: MainViewAiRecommendationStatusesComponentProps)`

Interfaz `MainViewAiRecommendationStatusesComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `string` | no | — |

- Usa: [`FiltersComponent.tsx`](general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`AiRecommendationStatusesComponent.tsx`](#components-ai-recommendation-statuses-airecommendationstatusescomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-dashboards-nubes-cloud-aws-recomendaciones-rec-statuses-page-tsx), [`page.tsx`](../rutas.md#app-dashboards-nubes-cloud-azure-recomendaciones-rec-statuses-page-tsx), [`page.tsx`](../rutas.md#app-dashboards-nubes-cloud-gcp-recomendaciones-rec-statuses-page-tsx)

---

<a id="components-ai-recommendation-statuses-info-airecommendationstatusesinfocomponent-tsx"></a>
## `components/ai-recommendation-statuses/info/AiRecommendationStatusesInfoComponent.tsx`

**Componente (cliente)**

Exporta:

- función `createTicketFetcher` `async (url: string, { arg }: { arg: unknown }): Promise<T>`
- función `validateTicketsBatchFetcher` `async ([url, payload]: [string, string]): Promise<BatchValidationResponse>`
- componente `AiRecommendationStatusesInfoComponent` `({ data }: AiRecommendationStatusesInfoComponentProps)`

Interfaz `AiRecommendationStatusesInfoComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `RecommendationStatusGroup[]` | no | — |

Interfaz `StatusFeedbackToastProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `feedback` | `StatusFeedback` | no | — |
| `onDismiss` | `() => void` | no | — |

Interfaz `StatusSectionProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `currentStatus` | `RecommendationStatus` | no | — |
| `onSubmit` | `(newStatus: RecommendationStatus, comment: string) => Promise<void>` | no | — |

Interfaz `GroupCardProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `group` | `RecommendationStatusGroup` | no | — |
| `sortedReports` | `RecommendationStatusGroupReport[]` | no | — |
| `allExecutionStatuses` | `{ execution_status: RecommendationStatus; status_assigned_at: string;…` | no | — |
| `jiraValidationResult` | `TicketValidationResult \| undefined` | no | — |
| `servicenowValidationResult` | `TicketValidationResult \| undefined` | no | — |
| `isValidatingJira` | `boolean` | no | — |
| `isValidatingServiceNow` | `boolean` | no | — |
| `anchorId` | `string` | sí | — |
| `expandRequestToken` | `number` | sí | — |
| `onStatusChange` | `(newStatus: RecommendationStatus, comment: string) => Promise<void>` | no | — |

Interfaz `InactionCostContributor`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `groupId` | `string` | no | — |
| `resourceName` | `string` | no | — |
| `recommendationSubtype` | `string` | no | — |
| `cloudProvider` | `string` | no | — |
| `status` | `RecommendationStatus` | no | — |
| `savingValue` | `number` | no | — |

Interfaz `InactionCostCardProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `total` | `number` | no | — |
| `contributors` | `InactionCostContributor[]` | no | — |
| `onSelect` | `(groupId: string) => void` | no | — |

- Tipo interno `CreateTicketResponse` = `CreateJiraTicketResponse | CreateServiceNowTicketResponse`
- Tipo interno `FetcherError` = `Error & { status?: number }`
- Tipo interno `StatusFeedback` = `{ recommendation_updated: boolean; status_event_created: boolean; error?: string; }`
- Tipo interno `SortField` = `'latest_activity' | 'most_changes'`
- Tipo interno `SortDirection` = `'asc' | 'desc'`
Internos:

- constante `CREATE_JIRA_TICKET_KEY`
- constante `VALIDATE_JIRA_TICKETS_KEY`
- constante `CREATE_SERVICENOW_TICKET_KEY`
- constante `VALIDATE_SERVICENOW_TICKETS_KEY`
- constante `CONNECTOR_DISPLAY_NAME`
- constante `STATUS_STYLES`
- constante `STATUS_DOT_COLOR`
- constante `ALL_STATUSES`
- constante `ITEMS_PER_PAGE`
- constante `COLLAPSED_TIMELINE_LIMIT`
- función `cleanText` `(text: string)`
- función `formatDate` `(dateStr: string)`
- función `formatCurrency` `(value: number)`
- función `resolveStatusEndpoint` `(cloud: string): string`
- función `statusFetcher` `(url: string, { arg }: { arg: RecommendationStatusEvent }): Promise<AssignExecutionStatusResponse>`
- componente `StatusFeedbackToast` `({ feedback, onDismiss }: StatusFeedbackToastProps)`
- componente `StatusSection` `({ currentStatus, onSubmit }: StatusSectionProps)`
- componente `GroupCard` `({ group, sortedReports, allExecutionStatuses, isValidatingJira, isValidatingServiceNow, jiraValidationResult, servicen…`
- componente `InactionCostCard` `({ total, contributors, onSelect }: InactionCostCardProps)`

- API: `/api/aws/bridge/advisor/assign_recommendation_execution_status`, `/api/azure/bridge/azure/assign_recommendation_execution_status`, `/api/connector/bridge/connector/jira/create_ticket`, `/api/connector/bridge/connector/jira/validate_tickets`, `/api/connector/bridge/connector/servicenow/create_ticket`, `/api/connector/bridge/connector/servicenow/validate_tickets`, `/api/gcp/bridge/gcp/ai_recommendations/assign_recommendation_execution_status`
- Hooks: `useConnector`, `useSWR`, `useSWRMutation`
- Usa: [`AiRecommendationStatusHistoryComponent.tsx`](generales.md#components-airecommendationstatushistorycomponent-tsx), [`aiRecommendations.ts`](../tipos.md#interfaces-ai-recommendations-airecommendations-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`input.tsx`](ui.md#components-ui-input-tsx), [`select.tsx`](ui.md#components-ui-select-tsx), [`textarea.tsx`](ui.md#components-ui-textarea-tsx), [`useConnectors.ts`](../hooks.md#hooks-useconnectors-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`TicketButtonComponent.tsx`](generales.md#components-ticketbuttoncomponent-tsx)
- Usado por: [`AiRecommendationStatusesComponent.tsx`](#components-ai-recommendation-statuses-airecommendationstatusescomponent-tsx)

