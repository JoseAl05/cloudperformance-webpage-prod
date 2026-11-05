# Utilidades (`lib/`)

[← Índice](README.md)

Utilidades: creación de bridges (`bridge.ts`), fetcher de SWR, autenticación y cookies, filtros de URL, contratos de facturación / consumo / sin uso / horario hábil, formatos numéricos y de moneda, catálogos de regiones y servicios por nube, exportación a Excel y servicios de alertas.

Archivos:

- [`lib/alertasAnomaliasService.ts`](#lib-alertasanomaliasservice-ts)
- [`lib/alertasBudget.ts`](#lib-alertasbudget-ts)
- [`lib/alertasService.ts`](#lib-alertasservice-ts)
- [`lib/auth.ts`](#lib-auth-ts)
- [`lib/authUtils.ts`](#lib-authutils-ts)
- [`lib/awsBedrockComparisonFormatters.ts`](#lib-awsbedrockcomparisonformatters-ts)
- [`lib/aws_regions.ts`](#lib-aws-regions-ts)
- [`lib/aws_services.ts`](#lib-aws-services-ts)
- [`lib/aws_variacion_servicios.ts`](#lib-aws-variacion-servicios-ts)
- [`lib/azureFoundryFormatters.ts`](#lib-azurefoundryformatters-ts)
- [`lib/azure_regions.ts`](#lib-azure-regions-ts)
- [`lib/azure_resource_types.ts`](#lib-azure-resource-types-ts)
- [`lib/azure_services.ts`](#lib-azure-services-ts)
- [`lib/billing.ts`](#lib-billing-ts)
- [`lib/bridge.ts`](#lib-bridge-ts)
- [`lib/bridgePaths.ts`](#lib-bridgepaths-ts)
- [`lib/bytesToMbs.ts`](#lib-bytestombs-ts)
- [`lib/cloudAccounts.ts`](#lib-cloudaccounts-ts)
- [`lib/connectors.ts`](#lib-connectors-ts)
- [`lib/consumption.ts`](#lib-consumption-ts)
- [`lib/cookies.ts`](#lib-cookies-ts)
- [`lib/db-utils.ts`](#lib-db-utils-ts)
- [`lib/echartsGlobalConfig.ts`](#lib-echartsglobalconfig-ts)
- [`lib/email.ts`](#lib-email-ts)
- [`lib/exportExcelBillingIntracloud.ts`](#lib-exportexcelbillingintracloud-ts)
- [`lib/exportExcelHistoricalBilling.ts`](#lib-exportexcelhistoricalbilling-ts)
- [`lib/fetcher.ts`](#lib-fetcher-ts)
- [`lib/filters.ts`](#lib-filters-ts)
- [`lib/format.ts`](#lib-format-ts)
- [`lib/gcpVertexComparisonFormatters.ts`](#lib-gcpvertexcomparisonformatters-ts)
- [`lib/gcp_recommender_categories.ts`](#lib-gcp-recommender-categories-ts)
- [`lib/gcp_recommender_priorities.ts`](#lib-gcp-recommender-priorities-ts)
- [`lib/gcp_regions.ts`](#lib-gcp-regions-ts)
- [`lib/gcp_services.ts`](#lib-gcp-services-ts)
- [`lib/getUptimeInstance.ts`](#lib-getuptimeinstance-ts)
- [`lib/handleConnectorsCreation.ts`](#lib-handleconnectorscreation-ts)
- [`lib/logger.ts`](#lib-logger-ts)
- [`lib/metricUtils.ts`](#lib-metricutils-ts)
- [`lib/mongodb.ts`](#lib-mongodb-ts)
- [`lib/plans.ts`](#lib-plans-ts)
- [`lib/rateLimit.ts`](#lib-ratelimit-ts)
- [`lib/sessionPayload.ts`](#lib-sessionpayload-ts)
- [`lib/unused.ts`](#lib-unused-ts)
- [`lib/utils.ts`](#lib-utils-ts)
- [`lib/workingHours.ts`](#lib-workinghours-ts)

<a id="lib-alertasanomaliasservice-ts"></a>
## `lib/alertasAnomaliasService.ts`

**Utilidades**

Exporta:

- constante `alertasAnomaliasService` = `{ getAlertasAnomalias: async (provider: string): Promise<AnomalyConfig[]> => { …`

Internos:

- constante `NEXT_INTERNAL_API`

- API: `/api/alertas/bridge`
- Usa: [`anomalias.ts`](tipos.md#interfaces-anomalias-ts)
- Usado por: [`AnomalyAlertsView.tsx`](components/alertas.md#components-alertas-anomalies-anomalyalertsview-tsx), [`AnomalyAlertsTable.tsx`](components/alertas.md#components-alertas-anomalies-table-anomalyalertstable-tsx)

---

<a id="lib-alertasbudget-ts"></a>
## `lib/alertasBudget.ts`

**Utilidades**

Exporta:

- interfaz `CostCenter`
- interfaz `BudgetAlertConfig`
- interfaz `BudgetServiceResponse`
- interfaz `SaveConfigResponse`
- interfaz `BudgetStatus`
- constante `budgetAlertsService` = `{ getConfigByClient: async (provider: string) => { const res = await fetch(`${N…`

Interfaz `CostCenter` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_centro_costo` | `number` | no | — |
| `nombre_centro` | `string` | no | — |

Interfaz `BudgetAlertConfig` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_id` | `string` | sí | — |
| `cloud_provider` | `string` | no | — |
| `cost_center_id` | `number` | no | — |
| `client_id` | `string` | no | — |
| `is_active` | `boolean` | no | — |
| `alert_emails` | `string[]` | no | — |
| `warning_percentages` | `number[]` | no | — |

Interfaz `BudgetServiceResponse` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `configuraciones` | `BudgetAlertConfig[]` | no | — |
| `centros_costo` | `CostCenter[]` | no | — |
| `presupuestos_asignados` | `Record<number, number>` | no | — |

Interfaz `SaveConfigResponse` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `mensaje` | `string` | no | — |
| `id` | `string` | sí | — |

Interfaz `BudgetStatus` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_regla` | `string` | no | — |
| `cost_center_id` | `number` | no | — |
| `tipo_alerta` | `'PRECAUCION' \| 'EXCEDIDO' \| 'OPTIMO'` | no | — |
| `timestamp` | `string \| null` | no | — |
| `porcentaje_actual` | `number` | sí | — |

Internos:

- constante `NEXT_INTERNAL_API`

- API: `/api/alertas/bridge/budget`
- Usado por: [`CostCenterBudgetView.tsx`](components/alertas.md#components-alertas-budget-costcenterbudgetview-tsx), [`CostCenterBudgetForm.tsx`](components/alertas.md#components-alertas-budget-form-costcenterbudgetform-tsx), [`CostCenterStatusBoard.tsx`](components/alertas.md#components-alertas-budget-status-costcenterstatusboard-tsx)

---

<a id="lib-alertasservice-ts"></a>
## `lib/alertasService.ts`

**Utilidades**

Exporta:

- constante `alertasService` = `{ getAlertas: async (provider: string): Promise<AlertConfig[]> => { const respo…`

Internos:

- constante `NEXT_INTERNAL_API`

- API: `/api/alertas/bridge`
- Usa: [`alertas.ts`](tipos.md#interfaces-alertas-ts)
- Usado por: [`AnomalyAlertsView.tsx`](components/alertas.md#components-alertas-anomalies-anomalyalertsview-tsx), [`BillingAlertsView.tsx`](components/alertas.md#components-alertas-billing-billingalertsview-tsx), [`BillingAlertsTable.tsx`](components/alertas.md#components-alertas-billing-table-billingalertstable-tsx)

---

<a id="lib-auth-ts"></a>
## `lib/auth.ts`

**Utilidades**

Exporta:

- función `signAuthToken` `async (payload: JWTPayload, ttlSeconds = 60 * 60 * 24)`
- función `verifyAuthToken` `async (token: string)`
- función `getAuthFromRequest` `async (req: NextRequest)`

Internos:

- constante `secret`

- Variables de entorno: `FORCE_INSECURE_COOKIES`, `JWT_SECRET`, `NODE_ENV`
- Usa: [`cookies.ts`](#lib-cookies-ts), [`index.ts`](tipos.md#types-index-ts)
- Usado por: [`layout.tsx`](rutas.md#app-alertas-layout-tsx), [`layout.tsx`](rutas.md#app-dashboards-ia-layout-tsx), [`layout.tsx`](rutas.md#app-dashboards-nubes-layout-tsx), [`layout.tsx`](rutas.md#app-presupuesto-presupuesto-layout-tsx), [`layout.tsx`](rutas.md#app-profile-layout-tsx), [`route.ts`](api-bridges.md#app-api-auth-get-token-route-ts), [`route.ts`](api-bridges.md#app-api-auth-me-route-ts), [`route.ts`](api-bridges.md#app-api-auth-swap-client-context-route-ts), [`route.ts`](api-bridges.md#app-api-auth-verify-2fa-route-ts), [`route.ts`](api-bridges.md#app-api-op-licencias-generar-route-ts), [`route.ts`](api-bridges.md#app-api-openai-bridge-path-route-ts), [`authUtils.ts`](#lib-authutils-ts), [`middleware.ts`](configuracion.md#middleware-ts)

Notas de implementación:

- Detecta si la conexión es HTTPS (soporta proxies) Nota: en rutas de servidor puedes leer cabeceras, aquí suele bastar con NODE_ENV
- Si corres en prod pero en HTTP (localhost), puedes forzar via ENV:
- `secure: isProd && !forceInsecureLocal,` — evita secure en localhost http
- opcionalmente: expires: new Date(Date.now() + ttlSeconds*1000)

---

<a id="lib-authutils-ts"></a>
## `lib/authUtils.ts`

**Utilidades**

<--- Importa tu función existente de auth.ts

<--- Importa desde el archivo db.ts

Exporta:

- función `authorizeRequest` `async (req: NextRequest, allowedRoles: Role[])` — Verifica la autenticación y los permisos de rol para una solicitud. @param req - La solicitud de Next.js. @param allowedRoles - Un array de roles permitidos para acceder a esta ruta. @returns Un objeto con el estado de la autorización y la información del usuario si es exitosa.

- Tipo interno `Role` = `AuthUserPayload['role']`
- Usa: [`auth.ts`](#lib-auth-ts), [`db.ts`](tipos.md#types-db-ts)
- Usado por: [`route.ts`](api-bridges.md#app-api-empresas-sii-route-ts), [`route.ts`](api-bridges.md#app-api-op-licencias-comparar-route-ts), [`route.ts`](api-bridges.md#app-api-op-licencias-estado-route-ts), [`route.ts`](api-bridges.md#app-api-op-licencias-historial-route-ts), [`route.ts`](api-bridges.md#app-api-op-licencias-partner-route-ts), [`route.ts`](api-bridges.md#app-api-op-licencias-solicitudes-id-route-ts), [`route.ts`](api-bridges.md#app-api-op-licencias-solicitudes-route-ts), [`route.ts`](api-bridges.md#app-api-perfilamiento-empresas-id-route-ts), [`route.ts`](api-bridges.md#app-api-perfilamiento-empresas-route-ts), [`route.ts`](api-bridges.md#app-api-perfilamiento-users-id-route-ts), [`route.ts`](api-bridges.md#app-api-perfilamiento-users-route-ts)

Notas de implementación:

- 1. Obtener la carga útil (payload) del token JWT
- 2. Mapear el payload al tipo AuthUserPayload. Usamos 'as unknown as' para forzar la conversión, asumiendo que el JWT contiene el 'role' y 'client'.
- 3. Comprobación de integridad del rol
- 4. Verificar si el rol del usuario está en la lista de roles permitidos

---

<a id="lib-awsbedrockcomparisonformatters-ts"></a>
## `lib/awsBedrockComparisonFormatters.ts`

**Utilidades**

Exporta:

- función `formatCurrency` `(value: number | null | undefined): string`
- función `formatPercent` `(value: number | null | undefined): string`
- función `formatSignedPercent` `(value: number | null | undefined): string`
- función `formatTokens` `(value: number | null | undefined): string`
- función `formatInteger` `(value: number | null | undefined): string`
- función `formatScore` `(value: number | null | undefined): string`
- función `formatPricePerMillion` `(value: number | null | undefined): string`
- constante `confidenceLabels` = `{ HIGH: 'Alta', MEDIUM: 'Media', LOW: 'Baja' }`
- constante `confidenceClasses` = `{ HIGH: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-…`
- función `deltaClass` `(value: number): string`
- constante `providerShortLabels` = `{ foundry: 'Azure', vertex: 'GCP' }`
- constante `providerFullLabels` = `{ foundry: 'Azure Foundry', vertex: 'Google Vertex AI' }`

Internos:

- constante `currencyFormatter`
- constante `preciseCurrencyFormatter`
- constante `percentFormatter`
- constante `tokenFormatter`
- constante `integerFormatter`

- Usado por: [`BMComparisonCandidateConfidenceComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-info-bmcomparisoncandidateconfidencecomponent-tsx), [`BMComparisonCardsComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-info-bmcomparisoncardscomponent-tsx), [`BMComparisonCostBridgeComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-info-bmcomparisoncostbridgecomponent-tsx), [`BMComparisonModelPanelsComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-info-bmcomparisonmodelpanelscomponent-tsx), [`BMComparisonTokenMixComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-info-bmcomparisontokenmixcomponent-tsx), [`BMComparisonViewComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-info-bmcomparisonviewcomponent-tsx), [`BMComparisonResourcesColumns.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-table-bmcomparisonresourcescolumns-tsx)

---

<a id="lib-aws-regions-ts"></a>
## `lib/aws_regions.ts`

**Utilidades**

Exporta:

- constante `aws_regions` = `[ { label: 'Todas las Regiones', value: 'all_regions' }, { label: 'Africa (Cape…`

- Usado por: [`RegionFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-regionfiltercomponent-tsx)

---

<a id="lib-aws-services-ts"></a>
## `lib/aws_services.ts`

**Utilidades**

Exporta:

- constante `aws_compute_services` = `[ { label: 'Elastic Compute Cloud (EC2)', value: 'ec2' }, { label: 'RDS Mysql',…`
- constante `aws_storage_services` = `[ { label: 'S3 Buckets', value: 's3' }, { label: 'Discos', value: 'disks' }, ]`

- Usado por: [`MultiTenantServiceFilterComponent.tsx`](components/general_comp_cloud.md#components-general-comp-cloud-filters-multitenantservicefiltercomponent-tsx)

---

<a id="lib-aws-variacion-servicios-ts"></a>
## `lib/aws_variacion_servicios.ts`

**Utilidades**

Exporta:

- constante `aws_variacion_servicios` = `[ { label: 'Autoscaling Group', value: 'AutoscalingGroup' }, { label: 'Dynamo D…`

- Usado por: [`VariationServiceFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-variationservicefiltercomponent-tsx)

---

<a id="lib-azurefoundryformatters-ts"></a>
## `lib/azureFoundryFormatters.ts`

**Utilidades**

Exporta:

- función `formatCurrency` `(value: number | null | undefined): string`
- función `formatMicroCurrency` `(value: number | null | undefined): string` — El costo de un solo prompt suele ser una fracción de centavo, donde formatCurrency redondea a 0.
- función `formatPercent` `(value: number | null | undefined): string`
- función `formatSignedPercent` `(value: number | null | undefined): string`
- función `formatTokens` `(value: number | null | undefined): string`
- función `formatInteger` `(value: number | null | undefined): string`
- función `formatScore` `(value: number | null | undefined): string`
- función `formatDate` `(value: string | null | undefined): string`
- función `formatPricePerMillion` `(value: number | null | undefined): string`
- constante `confidenceLabels` = `{ HIGH: 'Alta', MEDIUM: 'Media', LOW: 'Baja' }`
- constante `confidenceClasses` = `{ HIGH: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-…`
- función `deltaClass` `(value: number): string`
- constante `providerShortLabels` = `{ bedrock: 'AWS', vertex: 'GCP' }`
- constante `providerFullLabels` = `{ bedrock: 'AWS Bedrock', vertex: 'GCP Vertex' }`

Internos:

- constante `currencyFormatter`
- constante `preciseCurrencyFormatter`
- constante `microCurrencyFormatter`
- constante `percentFormatter`
- constante `tokenFormatter`
- constante `integerFormatter`
- constante `dateFormatter`

- Usado por: [`BMPromptOptComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-prompt-opt-bmpromptoptcomponent-tsx), [`BMPromptOptCardsComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-prompt-opt-info-bmpromptoptcardscomponent-tsx), [`BMPromptOptComparisonComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-prompt-opt-info-bmpromptoptcomparisoncomponent-tsx), [`BMPromptOptInputComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-prompt-opt-info-bmpromptoptinputcomponent-tsx), [`BMPromptOptPanelComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-prompt-opt-info-bmpromptoptpanelcomponent-tsx), [`BMPromptOptTokensComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-prompt-opt-info-bmpromptopttokenscomponent-tsx), [`VXPromptOptComponent.tsx`](components/google-vertex.md#components-google-vertex-prompt-opt-vxpromptoptcomponent-tsx), [`VXPromptOptCardsComponent.tsx`](components/google-vertex.md#components-google-vertex-prompt-opt-info-vxpromptoptcardscomponent-tsx), [`VXPromptOptComparisonComponent.tsx`](components/google-vertex.md#components-google-vertex-prompt-opt-info-vxpromptoptcomparisoncomponent-tsx), [`VXPromptOptInputComponent.tsx`](components/google-vertex.md#components-google-vertex-prompt-opt-info-vxpromptoptinputcomponent-tsx), [`VXPromptOptPanelComponent.tsx`](components/google-vertex.md#components-google-vertex-prompt-opt-info-vxpromptoptpanelcomponent-tsx), [`VXPromptOptTokensComponent.tsx`](components/google-vertex.md#components-google-vertex-prompt-opt-info-vxpromptopttokenscomponent-tsx), [`AFComparisonCandidateConfidenceComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-info-afcomparisoncandidateconfidencecomponent-tsx), [`AFComparisonCardsComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-info-afcomparisoncardscomponent-tsx), [`AFComparisonCostBridgeComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-info-afcomparisoncostbridgecomponent-tsx), [`AFComparisonModelPanelsComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-info-afcomparisonmodelpanelscomponent-tsx), [`AFComparisonTokenMixComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-info-afcomparisontokenmixcomponent-tsx), [`AFComparisonViewComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-info-afcomparisonviewcomponent-tsx), [`AFComparisonDeploymentsColumns.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-table-afcomparisondeploymentscolumns-tsx), [`FMPromptOptComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-prompt-opt-fmpromptoptcomponent-tsx), [`FMPromptOptCardsComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-prompt-opt-info-fmpromptoptcardscomponent-tsx), [`FMPromptOptComparisonComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-prompt-opt-info-fmpromptoptcomparisoncomponent-tsx), [`FMPromptOptInputComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-prompt-opt-info-fmpromptoptinputcomponent-tsx), [`FMPromptOptPanelComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-prompt-opt-info-fmpromptoptpanelcomponent-tsx), [`FMPromptOptTokensComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-prompt-opt-info-fmpromptopttokenscomponent-tsx)

---

<a id="lib-azure-regions-ts"></a>
## `lib/azure_regions.ts`

**Utilidades**

Exporta:

- constante `azure_regions` = `[ { label: 'Todas las Regiones', value: 'all_regions' }, // África { label: 'Áf…`

- Usado por: [`RegionFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-regionfiltercomponent-tsx)

Notas de implementación:

- África
- Asia Pacífico
- Canadá
- Europa
- Israel
- Medio Oriente
- Sudamérica
- Estados Unidos

---

<a id="lib-azure-resource-types-ts"></a>
## `lib/azure_resource_types.ts`

**Utilidades**

Exporta:

- constante `azure_resource_types` = `[ { label: 'Máquinas Virtuales', value: 'VM' }, { label: 'Bases de Datos', valu…`

- Usado por: [`ResourceTypesFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-resourcetypesfiltercomponent-tsx)

---

<a id="lib-azure-services-ts"></a>
## `lib/azure_services.ts`

**Utilidades**

Exporta:

- constante `azure_services` = `[ { label: 'Virtual Machines', value: 'vm' }, { label: 'VM Scale Sets', value: …`
- constante `azure_compute_services` = `[ { label: 'Virtual Machines', value: 'vm' }, { label: 'VM Scale Sets', value: …`
- constante `azure_storage_services` = `[ { label: 'Storage Account', value: 'strg_account' }, { label: 'Discos', value…`

- Usado por: [`ServiceFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-servicefiltercomponent-tsx), [`MultiTenantServiceFilterComponent.tsx`](components/general_comp_cloud.md#components-general-comp-cloud-filters-multitenantservicefiltercomponent-tsx)

---

<a id="lib-billing-ts"></a>
## `lib/billing.ts`

**Utilidades**

Utilidades de la familia "Facturación": URLs del contrato canónico y la descripción de la métrica de costo de cada
nube (se muestra en un tooltip junto a cada monto).

Exporta:

- función `billingUrl` `(cloud: BillingCloud, action: BillingAction, params: QueryParams): string` — `/api/{cloud}/bridge/{cloud}/billing/{action}?{params}` (el bridge lo envía a `/api/{cloud}/billing/...`).
- constante `COST_METRICS` = `{ netamortizedcost: { label: 'AWS · Net amortized cost', description: 'Costo ne…` — Qué significa cada métrica de costo (la API la informa en `cost_metric`).
- función `costMetricInfo` `(metric: string | null | undefined)`
- función `monthOf` `(date: string): string` — Mes "YYYY-MM" de un día "YYYY-MM-DD".
- función `monthsRange` `(months: string[]): { from: string; to: string } | null` — Primer y último día de un conjunto de meses "YYYY-MM" (para pedir un rango que los cubra).

- API: `/api/{…}/bridge/{…}/billing/{…}`
- Usa: [`consumption.ts`](#lib-consumption-ts), [`billing.ts`](tipos.md#interfaces-billing-ts)
- Usado por: [`MultiCloudComponent.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-multicloudcomponent-tsx), [`BillingTrendView.tsx`](components/shared.md#components-shared-billing-billingtrendview-tsx), [`CostMetricInfo.tsx`](components/shared.md#components-shared-billing-costmetricinfo-tsx), [`TopBillingView.tsx`](components/shared.md#components-shared-billing-topbillingview-tsx)

---

<a id="lib-bridge-ts"></a>
## `lib/bridge.ts`

**Utilidades**

Bridge común `/api/<servicio>/bridge/[...path]` -> API back end (H-02).
- Sólo reenvía sub-paths del allowlist del servicio (`lib/bridgePaths.ts`).
- Envía la sesión como `Authorization: Bearer <token>` y un allowlist fijo de headers.
- Timeout (`BRIDGE_TIMEOUT_MS`, por defecto 120 s) hasta recibir los headers del upstream:
responde 504 si se cumple, 502 si el upstream no responde (caído o URL mal configurada).
- Si el navegador cancela la petición, se cancela también la del upstream.

Exporta:

- constante `BRIDGE_TIMEOUT_MS` = `Number(process.env.BRIDGE_TIMEOUT_MS) || 120_000` — Por defecto 120 s; el front (`lib/fetcher.ts`) espera un poco más para recibir el 504 con su mensaje.
- función `bridgeBaseUrl` `(envName: string, devEnvName?: string): string` — URL de un back end: `<VAR>_DEV` en desarrollo si está definida, `<VAR>` en el resto (o si falta la de desarrollo).
- función `createBridge` `(options: BridgeOptions)`

Interfaz `BridgeOptions`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `service` | `string` | no | Nombre del servicio para los mensajes de error, p. ej. "AWS". |
| `baseUrl` | `string` | no | URL base del back end (sin "/" final); vacía = mal configurado. |
| `envName` | `string` | no | Variable de entorno de la URL, para el mensaje de configuración. |
| `allowedPrefixes` | `readonly string[]` | no | — |
| `authorize` | `(token: string) => Promise<Response \| null>` | sí | Control de acceso extra con el token de la sesión; devuelve una respuesta para cortar la petición. |
| `bufferBody` | `boolean` | sí | Lee el body completo antes de reenviarlo (en vez de transmitirlo en streaming). |
| `timeoutMs` | `number` | sí | — |

- Tipo interno `RouteContext` = `{ params: Promise<{ path?: string[] }> }`
Internos:

- constante `FORWARD_REQUEST_HEADERS`
- constante `FORWARD_RESPONSE_HEADERS`
- función `bridgeError` `(status: number, error: string, message: string)`

- Variables de entorno: `BRIDGE_TIMEOUT_MS`, `NODE_ENV`
- Usa: [`cookies.ts`](#lib-cookies-ts), [`bridgePaths.ts`](#lib-bridgepaths-ts)
- Usado por: [`route.ts`](api-bridges.md#app-api-alertas-bridge-path-route-ts), [`route.ts`](api-bridges.md#app-api-aws-bridge-path-route-ts), [`route.ts`](api-bridges.md#app-api-azure-bridge-path-route-ts), [`route.ts`](api-bridges.md#app-api-comparison-cloud-bridge-path-route-ts), [`route.ts`](api-bridges.md#app-api-connector-bridge-path-route-ts), [`route.ts`](api-bridges.md#app-api-gcp-bridge-path-route-ts), [`route.ts`](api-bridges.md#app-api-openai-bridge-path-route-ts), [`route.ts`](api-bridges.md#app-api-presupuesto-bridge-path-route-ts)

Notas de implementación:

- _createBridge_: El navegador canceló la petición: nadie leerá esta respuesta.

---

<a id="lib-bridgepaths-ts"></a>
## `lib/bridgePaths.ts`

**Utilidades**

Exporta:

- constante `BRIDGE_ALLOWED_PREFIXES` = `{ aws: [ 'advisor', 'autoscaling', 'aws', 'bedrock', 'db', 'ebs', 'eks', 'event…` — Allowlist de los bridges `/api/<servicio>/bridge/[...path]`. Cada bridge sólo reenvía sub-paths cuyo primer segmento corresponda a un grupo de rutas que existe en su back end (inventario de routers FastAPI). Además se rechazan segmentos vacíos, `.`/`..` y separadores codificados, para que el sub-path no pueda salir del prefijo base del servicio.
- función `isAllowedBridgePath` `(segments: readonly string[], allowedPrefixes: readonly string[]): boolean`

- Usado por: [`route.ts`](api-bridges.md#app-api-alertas-bridge-path-route-ts), [`route.ts`](api-bridges.md#app-api-aws-bridge-path-route-ts), [`route.ts`](api-bridges.md#app-api-azure-bridge-path-route-ts), [`route.ts`](api-bridges.md#app-api-comparison-cloud-bridge-path-route-ts), [`route.ts`](api-bridges.md#app-api-connector-bridge-path-route-ts), [`route.ts`](api-bridges.md#app-api-gcp-bridge-path-route-ts), [`route.ts`](api-bridges.md#app-api-openai-bridge-path-route-ts), [`route.ts`](api-bridges.md#app-api-presupuesto-bridge-path-route-ts), [`bridge.ts`](#lib-bridge-ts)

---

<a id="lib-bytestombs-ts"></a>
## `lib/bytesToMbs.ts`

**Utilidades**

Exporta:

- función `bytesToMB` `(bytes:number)`
- función `bytesToGB` `(bytes: number): string`
- función `formatGeneric` `(value: number)`
- función `formatBytes` `(value: number)`
- función `formatCapacity` `(value: number)`
- función `formatUsd` `(value: number)`

- Usado por: [`ElbV2ConsumeInsightModalComponent.tsx`](components/aws/vista-consumos.md#components-aws-vista-consumos-elbv2-info-elbv2consumeinsightmodalcomponent-tsx), [`Ec2ResourceViewUsageNetworkComponent.tsx`](components/aws/vista-ec2.md#components-aws-vista-ec2-instancias-ec2-graficos-ec2resourceviewusagenetworkcomponent-tsx), [`MainEc2ResourceViewMetricsSummaryComponent.tsx`](components/aws/vista-ec2.md#components-aws-vista-ec2-instancias-ec2-graficos-mainec2resourceviewmetricssummarycomponent-tsx), [`ConsumoHorarioColumns.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-table-consumohorariocolumns-tsx), [`UnusedEbsColumns.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-ebs-table-unusedebscolumns-tsx), [`UnusedEc2Columns.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-ec2-table-unusedec2columns-tsx), [`UnusedNatGatewaysInsightModal.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-nat-gateways-info-unusednatgatewaysinsightmodal-tsx), [`UnusedNatGatewaysColumns.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-nat-gateways-table-unusednatgatewayscolumns-tsx), [`VariacionTendenciaUsoDeRecursosComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-variaciontendenciausoderecursoscomponent-tsx), [`VariacionTendenciaUsoDeRecursosCardsComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-info-variaciontendenciausoderecursoscardscomponent-tsx), [`AVGUsoLocInstEC2ViewUsoPorRegionComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-ec2-graficos-avgusolocinstec2viewusoporregioncomponent-tsx), [`AVGUsoLocInstRdsMariaDBViewUsoPorRegionComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mariadb-graficos-avgusolocinstrdsmariadbviewusoporregioncomponent-tsx), [`AVGUsoLocInstRdsMySQLViewUsoPorRegionComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mysql-graficos-avgusolocinstrdsmysqlviewusoporregioncomponent-tsx), [`AVGUsoLocInstRdsOracleViewUsoPorRegionComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-oracle-graficos-avgusolocinstrdsoracleviewusoporregioncomponent-tsx), [`AVGUsoLocInstRdsPgViewUsoPorRegionComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-pg-graficos-avgusolocinstrdspgviewusoporregioncomponent-tsx), [`AVGUsoLocInstRdsSQLServerViewUsoPorRegionComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-sqlserver-graficos-avgusolocinstrdssqlserverviewusoporregioncomponent-tsx), [`RdsResourceViewMemoryComponent.tsx`](components/aws/vista-rds.md#components-aws-vista-rds-graficos-rdsresourceviewmemorycomponent-tsx), [`RdsResourceViewStorageComponent.tsx`](components/aws/vista-rds.md#components-aws-vista-rds-graficos-rdsresourceviewstoragecomponent-tsx), [`AverageByLocationMetricsComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-average-by-location-grafico-averagebylocationmetricscomponent-tsx), [`BlobVsStorageGeneralCapacityComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-blob-vs-storage-general-graficos-blobvsstoragegeneralcapacitycomponent-tsx), [`BlobVsStorageCardsComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-blob-vs-storage-general-info-blobvsstoragecardscomponent-tsx), [`WorkingNonWorkingHoursColumns.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-consumo-horario-habil-no-habil-table-workingnonworkinghourscolumns-tsx), [`StorageVariationCapacitiesComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-variacion-storage-graficos-storagevariationcapacitiescomponent-tsx), [`StorageVariationCardsComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-variacion-storage-info-storagevariationcardscomponent-tsx), [`IntraCloudBillingColumns.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-billing-table-intracloudbillingcolumns-tsx), [`IntraCloudMontlhyBillingTable.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-billing-table-intracloudmontlhybillingtable-tsx), [`IntraCloudComputeChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-compute-grafico-intracloudcomputechartcomponent-tsx), [`IntraCloudComputeCardsByTenantComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-compute-info-intracloudcomputecardsbytenantcomponent-tsx), [`IntraCloudAwsStorageChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-aws-grafico-intracloudawsstoragechartcomponent-tsx), [`IntraCloudAwsStorageCardsByTenantComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-aws-info-intracloudawsstoragecardsbytenantcomponent-tsx), [`IntraCloudAzureStorageChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-azure-grafico-intracloudazurestoragechartcomponent-tsx), [`IntraCloudAzureStorageCardsByTenantComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-azure-info-intracloudazurestoragecardsbytenantcomponent-tsx), [`IntraCloudGcpStorageChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-gcp-grafico-intracloudgcpstoragechartcomponent-tsx), [`IntraCloudGcpStorageCardsByTenantComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-gcp-info-intracloudgcpstoragecardsbytenantcomponent-tsx), [`WorkingNonWorkingHoursColumns.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-table-workingnonworkinghourscolumns-tsx), [`CloudSqlMetricsCardComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-cloudsql-info-cloudsqlmetricscardcomponent-tsx), [`GkeMetricsCardComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-info-gkemetricscardcomponent-tsx), [`ComputeEngineMetricsCardsComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-info-computeenginemetricscardscomponent-tsx), [`InstanceGroupsMetricsCardsComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-info-instancegroupsmetricscardscomponent-tsx), [`UnusedCeColumns.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-compute-engine-table-unusedcecolumns-tsx)

---

<a id="lib-cloudaccounts-ts"></a>
## `lib/cloudAccounts.ts`

**Utilidades**

Exporta:

- tipo `CloudProvider` = `'aws' | 'azure' | 'gcp' | 'openai'` — AUTORIDAD ÚNICA DE CUENTAS CLOUD (`<cloud>_accounts`) Reglas del modelo: - `<cloud>_accounts` SOLO existe cuando la nube está habilitada Y es multi-tenant. En cualquier otro caso el campo NO debe existir en el documento y la conexión se resuelve por `user_db_<cloud>`. - El ID SIEMPRE lo genera el servidor con el formato `clp-<id>`. El cliente nunca inventa IDs: si envía uno desconocido, se descarta. - Los IDs de la empresa son la fuente de verdad y se propagan tal cual a la colección `Users`.
- constante `CLOUD_PROVIDERS` = `[ 'aws', 'azure', 'gcp', 'openai', ] as const`
- constante `CLOUD_LABELS` = `{ aws: { label: 'AWS', account: 'cuenta AWS', accountPlural: 'cuentas AWS' }, a…` — Etiquetas para los mensajes de error, respetando la nomenclatura previa.
- constante `ACCOUNT_ID_PREFIX` = `'clp-'`
- clase `CloudAccountsError` — Error de validación de cuentas: las rutas lo traducen a un HTTP 400.
- función `generateAccountId` `(): string` — Genera un ID único y estable con el formato `clp-<id>`.
- función `isValidAccountId` `(id: unknown): id is string`
- función `normalizeCloudAccounts` `(cloud: CloudProvider, rawAccounts: unknown, existingAccounts: CloudAccount[] = []): CloudAccount[]` — Valida y normaliza el array de cuentas de una nube multi-tenant. Los IDs ya existentes en la empresa se conservan (para no romper las referencias de los usuarios ya creados); cualquier otro caso — cuenta nueva, ID con formato inválido o ID duplicado dentro del mismo envío — recibe un ID nuevo generado por el servidor. @param cloud            Nube a la que pertenecen las cuentas. @param rawAccounts      Array recibido en el body de la petición. @param existingAccounts Cuentas actualmente persistidas en la empresa. @throws {CloudAccountsError} si el array es inválido o está vacío.
- función `cloneAccountsForUser` `(accounts: CloudAccount[] | null | undefined): CloudAccount[] | undefined` — Copia las cuentas de la empresa hacia un usuario preservando los IDs. Devuelve `undefined` cuando la empresa no tiene cuentas que propagar, para que el campo simplemente no se escriba en el documento del usuario.

Internos:

- constante `ACCOUNT_ID_REGEX` — Acepta el formato actual (`clp-<uuid>`) y el heredado (`clp-<base36>`).
- función `readString` `(value: unknown): string`

- Usa: [`db.ts`](tipos.md#types-db-ts)
- Usado por: [`route.ts`](api-bridges.md#app-api-auth-swap-client-context-route-ts), [`route.ts`](api-bridges.md#app-api-perfilamiento-empresas-id-route-ts), [`route.ts`](api-bridges.md#app-api-perfilamiento-empresas-route-ts), [`route.ts`](api-bridges.md#app-api-perfilamiento-users-route-ts), [`sessionPayload.ts`](#lib-sessionpayload-ts)

Notas de implementación:

- _normalizeCloudAccounts_: Se conserva el ID sólo si ya pertenecía a la empresa y no se repite.

---

<a id="lib-connectors-ts"></a>
## `lib/connectors.ts`

**Utilidades**

Exporta:

- función `findCompanyConnectors` `async (companyName: string | undefined | null)` — Conectores externos (Jira, ServiceNow) de una EMPRESA. Se leen desde la BD en cada uso y NO viajan en el JWT: así todos los usuarios de la empresa los ven al instante y un admin_global que cambia de empresa ve los de la destino. Los conectores creados antes de guardar `company_id` se reconocen por `created_by.client`.

- Usa: [`mongodb.ts`](#lib-mongodb-ts), [`db.ts`](tipos.md#types-db-ts)
- Usado por: [`route.ts`](api-bridges.md#app-api-auth-me-route-ts)

---

<a id="lib-consumption-ts"></a>
## `lib/consumption.ts`

**Utilidades**

Utilidades de la familia "Consumo / Eficiencia": URLs del contrato canónico, formato de valores y
el registro único de métricas (etiqueta + formato) que usan los gráficos y tablas de las tres nubes.

Acceso a valores de un recurso

Exporta:

- tipo `ConsumptionAction` = `string`
- tipo `QueryParams` = `Record<string, string | number | boolean | null | undefined>` — 'info' | 'efficiency' | 'metrics' | 'metrics/cpu-usage' ...
- función `toApiDate` `(date: Date): string` — Fecha para la API: "YYYY-MM-DDTHH:MM:SS" (UTC, sin zona).
- función `toQueryString` `(params: QueryParams): string` — Query string sin los parámetros vacíos (undefined, null, '' y false).
- función `consumptionUrl` `(cloud: ConsumptionCloud, resource: string, action: ConsumptionAction, params: QueryParams): string` — `/api/{cloud}/bridge/{cloud}/consumption/{resource}/{action}?{params}` (el bridge lo envía a `/api/{cloud}/consumption/...`).
- tipo `ValueFormat` = `'percent' | 'bytes' | 'bytesRate' | 'count' | 'number' | 'gb'` — Formato de valores
- función `compactNumber` `(value: number): string`
- función `formatValue` `(value: number | null | undefined, format: ValueFormat = 'number', unit = ''): string`
- función `formatByUnit` `(value: number | null | undefined, unidad = '%'): string` — Formatea un valor según la `unidad` que entrega la API ('%', 'bytes', 'GB', 'IOPS', 'Créditos'…).
- función `formatDateTime` `(iso: string | null | undefined): string`
- interfaz `MetricDefinition` — Registro de métricas (series de tiempo de las tres nubes)
- función `metricKey` `(name: string): string` — Clave normalizada: minúsculas y sin separadores ("Percentage CPU" -> "percentagecpu").
- función `getMetricDefinition` `(name: string): MetricDefinition`
- función `getPathValue` `(source: unknown, path: string): unknown` — Lee un valor por ruta ("metrics.avg_cpu_utilization", "details.vpc_id") de cualquier objeto.
- función `getResourceValue` `(resource: ConsumptionResource, path: string): unknown` — Lee un valor de un recurso por ruta ("metrics.avg_cpu_utilization", "details.vpc_id", "resource_type").
- función `toNumberOrNull` `(value: unknown): number | null` — Número o null (para valores leídos como `unknown`).

Interfaz `MetricDefinition` (exportada) — Registro de métricas (series de tiempo de las tres nubes):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `label` | `string` | no | — |
| `format` | `ValueFormat` | no | — |
| `unit` | `string` | sí | — |

Internos:

- función `scaleBytes` `(value: number, units: string[])`
- constante `METRICS`
- constante `STAT_SUFFIX` — AWS entrega algunas métricas con la estadística como sufijo ("CPUUtilization Average").

- API: `/api/{…}/bridge/{…}/consumption/{…}/{…}`
- Usa: [`consumption.ts`](tipos.md#interfaces-consumption-ts)
- Usado por: [`Ec2InstancesConsumeComponent.tsx`](components/aws/vista-consumos.md#components-aws-vista-consumos-ec2-ec2instancesconsumecomponent-tsx), [`AsgConsumeComponent.tsx`](components/aws/vista-consumos.md#components-aws-vista-consumos-ec2-asg-asgconsumecomponent-tsx), [`EksConsumeComponent.tsx`](components/aws/vista-consumos.md#components-aws-vista-consumos-ec2-eks-eksconsumecomponent-tsx), [`ElbV2ConsumeComponent.tsx`](components/aws/vista-consumos.md#components-aws-vista-consumos-elbv2-elbv2consumecomponent-tsx), [`NatGatewaysConsumeComponent.tsx`](components/aws/vista-consumos.md#components-aws-vista-consumos-nat-gateways-natgatewaysconsumecomponent-tsx), [`RdsInstancesConsumeComponent.tsx`](components/aws/vista-consumos.md#components-aws-vista-consumos-rds-rdsinstancesconsumecomponent-tsx), [`TendenciaFacturacionChartComponent.tsx`](components/aws/vista-facturacion.md#components-aws-vista-facturacion-tendencia-facturacion-tendenciafacturacionchartcomponent-tsx), [`ConsumoEC2AsgHorarioComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil-consumoec2asghorariocomponent-tsx), [`ConsumoEC2HorarioComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-horario-habil-vs-no-habil-consumoec2horariocomponent-tsx), [`ConsumoEC2NodosEKSHorarioComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-ec2-nodos-eks-horario-habil-vs-no-habil-consumoec2nodosekshorariocomponent-tsx), [`ConsumoRdsHorarioComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-consumo-rds-horario-habil-vs-no-habil-consumordshorariocomponent-tsx), [`UnusedEbsComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-ebs-unusedebscomponent-tsx), [`UnusedAutoscalingComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-ec2-unusedautoscalingcomponent-tsx), [`UnusedEc2Component.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-ec2-unusedec2component-tsx), [`UnusedEksComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-ec2-unusedekscomponent-tsx), [`UnusedElbV2Component.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-elbv2-unusedelbv2component-tsx), [`UnusedNatGatewaysComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-nat-gateways-unusednatgatewayscomponent-tsx), [`UnusedRoute53Component.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-r53-unusedroute53component-tsx), [`ConsumoAppGwComponent.tsx`](components/azure/vista-consumo-apps-gateway.md#components-azure-vista-consumo-apps-gateway-consumoappgwcomponent-tsx), [`ConsumoDbComponent.tsx`](components/azure/vista-consumo-db.md#components-azure-vista-consumo-db-consumodbcomponent-tsx), [`ConsumoNodosComponent.tsx`](components/azure/vista-consumo-nodos.md#components-azure-vista-consumo-nodos-consumonodoscomponent-tsx), [`ConsumoVmComponent.tsx`](components/azure/vista-consumo-vm.md#components-azure-vista-consumo-vm-consumovmcomponent-tsx), [`TendenciaFacturacionPagoPorUsoComponent.tsx`](components/azure/vista-facturacion.md#components-azure-vista-facturacion-tendencia-pago-por-uso-tendenciafacturacionpagoporusocomponent-tsx), [`AzureDbWorkingNonWorkingHoursComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-consumo-horario-habil-no-habil-data-bases-azuredbworkingnonworkinghourscomponent-tsx), [`AzureNodosWorkingNonWorkingHoursComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-consumo-horario-habil-no-habil-nodes-azurenodosworkingnonworkinghourscomponent-tsx), [`AzureVmWorkingNonWorkingHoursComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-consumo-horario-habil-no-habil-virtual-machines-azurevmworkingnonworkinghourscomponent-tsx), [`IncrementoTopRecursosUsoChartComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-incremento-top-recursos-uso-incrementotoprecursosusochartcomponent-tsx), [`Top10RecursosUsoChartComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-top-10-recursos-uso-top10recursosusochartcomponent-tsx), [`UnusedAppsGwComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-unused-apps-gateway-unusedappsgwcomponent-tsx), [`UnusedLoadbalancersComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-unused-loadbalancers-unusedloadbalancerscomponent-tsx), [`UnusedVmExtensionsComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-unused-resources-extensions-unusedvmextensionscomponent-tsx), [`UnusedVmComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-unused-resources-vm-unusedvmcomponent-tsx), [`UnusedVmssComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-unused-resources-vmss-unusedvmsscomponent-tsx), [`UnusedTrafficManagerComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-unused-traffic-managers-unusedtrafficmanagercomponent-tsx), [`MultiCloudComponent.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-multicloudcomponent-tsx), [`CloudSQLComponent.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-cloud-sql-cloudsqlcomponent-tsx), [`ClusterGkeConsumeComponent.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-clusters-gke-clustergkeconsumecomponent-tsx), [`ComputeEngineConsumeComponent.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-compute-engine-computeengineconsumecomponent-tsx), [`ZonasDNSComponent.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-dns-zonas-consumo-estado-zonasdnscomponent-tsx), [`FilestoreConsumeComponent.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-filestore-filestoreconsumecomponent-tsx), [`InstanceGroupConsumeComponent.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-instance-groups-instancegroupconsumecomponent-tsx), [`LoadBalancersComponent.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-load-balancers-consumo-uso-loadbalancerscomponent-tsx), [`TendenciaFacturacionComponent.tsx`](components/gcp/vista-facturacion.md#components-gcp-vista-facturacion-tendencia-facturacion-tendenciafacturacioncomponent-tsx), [`CloudSqlWorkingNonWorkingHoursComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-cloud-sql-cloudsqlworkingnonworkinghourscomponent-tsx), [`GkeWorkingNonWorkingHoursComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-cluster-gke-gkeworkingnonworkinghourscomponent-tsx), [`CeWorkingNonWorkingHoursComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-compute-engine-ceworkingnonworkinghourscomponent-tsx), [`FsWorkingNonWorkingHoursComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-filestore-fsworkingnonworkinghourscomponent-tsx), [`IgWorkingNonWorkingHoursComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-instance-group-igworkingnonworkinghourscomponent-tsx), [`IPsSinUsoComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-networking-ips-sin-uso-ipssinusocomponent-tsx), [`UnusedGkeComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-clusters-gke-unusedgkecomponent-tsx), [`UnusedCeComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-compute-engine-unusedcecomponent-tsx), [`DiscosPersistentesComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-discos-persistentes-discospersistentescomponent-tsx), [`FilestoreSinUsoComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-filestore-filestoresinusocomponent-tsx), [`UnusedIgComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-instance-groups-unusedigcomponent-tsx), [`BillingTrendView.tsx`](components/shared.md#components-shared-billing-billingtrendview-tsx), [`TopBillingView.tsx`](components/shared.md#components-shared-billing-topbillingview-tsx), [`ConsumptionCards.tsx`](components/shared.md#components-shared-consumption-consumptioncards-tsx), [`ConsumptionCharts.tsx`](components/shared.md#components-shared-consumption-consumptioncharts-tsx), [`ConsumptionDetailModal.tsx`](components/shared.md#components-shared-consumption-consumptiondetailmodal-tsx), [`ConsumptionTable.tsx`](components/shared.md#components-shared-consumption-consumptiontable-tsx), [`ConsumptionView.tsx`](components/shared.md#components-shared-consumption-consumptionview-tsx), [`types.ts`](components/shared.md#components-shared-consumption-types-ts), [`UnusedCards.tsx`](components/shared.md#components-shared-unused-unusedcards-tsx), [`UnusedDetailModal.tsx`](components/shared.md#components-shared-unused-unuseddetailmodal-tsx), [`UnusedTable.tsx`](components/shared.md#components-shared-unused-unusedtable-tsx), [`UnusedView.tsx`](components/shared.md#components-shared-unused-unusedview-tsx), [`types.ts`](components/shared.md#components-shared-unused-types-ts), [`unusedConfigs.ts`](components/shared.md#components-shared-unused-unusedconfigs-ts), [`WorkingHoursCards.tsx`](components/shared.md#components-shared-working-hours-workinghourscards-tsx), [`WorkingHoursCharts.tsx`](components/shared.md#components-shared-working-hours-workinghourscharts-tsx), [`WorkingHoursDetailModal.tsx`](components/shared.md#components-shared-working-hours-workinghoursdetailmodal-tsx), [`WorkingHoursTable.tsx`](components/shared.md#components-shared-working-hours-workinghourstable-tsx), [`WorkingHoursView.tsx`](components/shared.md#components-shared-working-hours-workinghoursview-tsx), [`types.ts`](components/shared.md#components-shared-working-hours-types-ts), [`workingHoursConfigs.ts`](components/shared.md#components-shared-working-hours-workinghoursconfigs-ts), [`billing.ts`](#lib-billing-ts), [`unused.ts`](#lib-unused-ts), [`workingHours.ts`](#lib-workinghours-ts)

Notas de implementación:

- _METRICS_: CPU
- _METRICS_: Memoria
- _METRICS_: Red
- _METRICS_: NAT Gateway
- _METRICS_: Load Balancer v2
- _METRICS_: Application Gateway
- _METRICS_: Horario hábil vs no hábil
- _METRICS_: Recursos sin uso (EBS / créditos de VMs de Azure)
- _METRICS_: Recursos sin uso (Traffic Manager / Filestore)

---

<a id="lib-cookies-ts"></a>
## `lib/cookies.ts`

**Utilidades**

Exporta:

- constante `AUTH_COOKIE` = `'auth_token'`
- función `clearAuthCookie` `async ()`

- Variables de entorno: `NODE_ENV`
- Usado por: [`layout.tsx`](rutas.md#app-alertas-layout-tsx), [`layout.tsx`](rutas.md#app-dashboards-ia-layout-tsx), [`layout.tsx`](rutas.md#app-dashboards-nubes-layout-tsx), [`layout.tsx`](rutas.md#app-presupuesto-presupuesto-layout-tsx), [`layout.tsx`](rutas.md#app-profile-layout-tsx), [`route.ts`](api-bridges.md#app-api-auth-get-token-route-ts), [`route.ts`](api-bridges.md#app-api-auth-logout-route-ts), [`route.ts`](api-bridges.md#app-api-auth-me-route-ts), [`route.ts`](api-bridges.md#app-api-auth-swap-client-context-route-ts), [`auth.ts`](#lib-auth-ts), [`bridge.ts`](#lib-bridge-ts)

---

<a id="lib-db-utils-ts"></a>
## `lib/db-utils.ts`

**Utilidades**

Exporta:

- función `findCompanyByName` `async (name: string): Promise<Empresa | null>`

- Usa: [`mongodb.ts`](#lib-mongodb-ts), [`db.ts`](tipos.md#types-db-ts)
- Usado por: [`route.ts`](api-bridges.md#app-api-auth-get-token-route-ts), [`route.ts`](api-bridges.md#app-api-auth-swap-client-context-route-ts)

---

<a id="lib-echartsglobalconfig-ts"></a>
## `lib/echartsGlobalConfig.ts`

**Utilidades**

Exporta:

- constante `defaultDataZoom` = `[ { type: 'slider', xAxisIndex: 0, bottom: 20, height: 20, handleSize: '100%', …`
- función `deepMerge` `(a: T, b: T): T`
- función `makeBaseOptions` `(args?: { legend?: string[] | boolean; legendPos?: LegendPos; legendConfig?: echarts.EChartsOption['legend']; unitLabel?: string; useUTC?: boolean; showToolbox…`
- tipo `ChartKind` = `| 'line' | 'area' | 'bar' | 'stackedBar' | 'scatter' | 'pie' | 'doughnut' | 'radar'`
- interfaz `SeriesOverrides`
- interfaz `BaseSeriesDef`
- interfaz `CartesianSeriesDef`
- interfaz `PieSeriesDef`
- tipo `AnySeriesDef` = `CartesianSeriesDef | PieSeriesDef`
- tipo `TooltipFormatter` = `| string | ((params: unknown) => string) | ((params: unknown[]) => string)`
- tipo `LegendOption` = `echarts.EChartsOption['legend']`
- interfaz `ChartFactoryInput`
- función `makeLineSeries` `(name: string, data: Array<[string | number, number]>, args: LineSeriesArgs = {}): echarts.EChartsOption['series'][number]`
- hook `useECharts` `(ref: React.RefObject<HTMLDivElement>, option: echarts.EChartsOption, deps: unknown[] = [], theme?: 'cp-light' | 'cp-dark' | string | null)`
- función `createChartOption` `(input: ChartFactoryInput): echarts.EChartsOption`
- función `createSeries` `(kind: ChartKind, name: string, data: unknown[], extra?: Partial<ChartFactoryInput>): echarts.EChartsOption`

Interfaz `SeriesOverrides` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `color` | `string` | sí | — |
| `lineStyle` | `Record<string, unknown>` | sí | — |
| `areaStyle` | `Record<string, unknown>` | sí | — |
| `itemStyle` | `Record<string, unknown>` | sí | — |
| `animation` | `boolean` | sí | — |
| `animationDuration` | `number` | sí | — |
| `animationDurationUpdate` | `number` | sí | — |
| `animationEasing` | `string` | sí | — |
| `animationEasingUpdate` | `string` | sí | — |
| `animationDelay` | `number` | sí | — |
| `animationDelayUpdate` | `number` | sí | — |
| `showSymbol` | `boolean` | sí | — |
| `smooth` | `boolean` | sí | — |
| `symbol` | `unknown` | sí | — |
| `symbolSize` | `number` | sí | — |
| `barWidth` | `number \| string` | sí | — |
| `stack` | `string` | sí | — |
| `progressive` | `number` | sí | — |
| `progressiveThreshold` | `number` | sí | — |
| `progressiveChunkMode` | `'sequential' \| 'mod'` | sí | — |
| `large` | `boolean` | sí | — |
| `largeThreshold` | `number` | sí | — |
| `yAxisIndex` | `number` | sí | — |
| `encode` | `Record<string, unknown>` | sí | — |
| `label` | `Record<string, unknown>` | sí | — |
| `emphasis` | `Record<string, unknown>` | sí | — |
| `markPoint` | `Record<string, unknown>` | sí | — |
| `z` | `number` | sí | — |
| `zlevel` | `number` | sí | — |

Interfaz `BaseSeriesDef` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `name` | `string` | no | — |
| `data` | `unknown[]` | no | Para (line, bar, area, stackedBar, scatter): Array<[number \| string \| Date, number]> Para pie/donut: Array<{ name: string; value: number }> |
| `extra` | `SeriesOverrides` | sí | — |

Interfaz `CartesianSeriesDef` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `kind` | `Extract<ChartKind, 'line' \| 'area' \| 'bar' \| 'stackedBar'>` | no | — |
| `smooth` | `boolean` | sí | — |

Interfaz `PieSeriesDef` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `kind` | `Extract<ChartKind, 'pie' \| 'doughnut'>` | no | — |
| `radius` | `[string \| number, string \| number] \| string \| number` | sí | — |
| `center` | `[string \| number, string \| number]` | sí | — |

Interfaz `ChartFactoryInput` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `kind` | `ChartKind` | no | — |
| `title` | `string` | sí | — |
| `subtitle` | `string` | sí | — |
| `series` | `AnySeriesDef[]` | no | — |
| `legend` | `boolean` | sí | — |
| `legendOption` | `LegendOption` | sí | — |
| `tooltip` | `boolean` | sí | — |
| `tooltipFormatter` | `TooltipFormatter` | sí | — |
| `xAxisType` | `'category' \| 'time' \| 'value'` | sí | — |
| `stackKey` | `string` | sí | — |
| `extraOption` | `echarts.EChartsOption` | sí | — |

Interfaz `LineSeriesArgs`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `color` | `string` | sí | — |
| `area` | `boolean \| { opacity?: number }` | sí | — |
| `samplingThreshold` | `number` | sí | — |
| `markPointPredicate` | `(x: [string \| number, number]) => boolean` | sí | — |
| `markPointLabelFormatter` | `(v: number) => string` | sí | — |

- Tipo interno `LegendPos` = `| 'top' | 'bottom' | 'left' | 'right' | { left?: string | number; right?: string | number; top?: string | number; botto…`
Internos:

- función `isDarkMode` `(): boolean`
- función `getThemeBG` `(): string`
- función `getIconColor` `(): string`
- función `makeFullscreenIconByTheme` `(): string` — Tu SVG (con color dinámico) -> data URL para ECharts
- función `augmentWithFullscreenTool` `(opt: echarts.EChartsOption, el: HTMLElement): echarts.EChartsOption` — Inyecta el botón en el toolbox (respeta overrides del usuario)
- función `bindFullscreenLifecycle` `(chart: echarts.ECharts, el: HTMLElement)` — Fullscreen lifecycle: aplica fondo correcto del tema y hace resize
- función `buildLegendOption` `(legend: string[] | boolean, legendPos: LegendPos, legendConfig?: echarts.EChartsOption['legend']): echarts.EChartsOpti…`
- función `buildSeries` `(def: AnySeriesDef): echarts.SeriesOption`

- Usado por: [`ResourceBillingChart.tsx`](components/aws/facturacion-recurso.md#components-aws-facturacion-recurso-grafico-resourcebillingchart-tsx), [`CostosVsPresupuestoViewSummaryComponent.tsx`](components/aws/presupuesto-v2.md#components-aws-presupuesto-v2-costo-vs-presupuesto-graficos-costosvspresupuestoviewsummarycomponent-tsx), [`AdvisorViewPieChartComponent.tsx`](components/aws/vista-advisor.md#components-aws-vista-advisor-grafico-advisorviewpiechartcomponent-tsx), [`AutoscalingGroupsResourceViewInstancesVsMaxMinComponent.tsx`](components/aws/vista-autoscaling.md#components-aws-vista-autoscaling-autoscaling-groups-graficos-autoscalinggroupsresourceviewinstancesvsmaxmincomponent-tsx), [`AutoscalingGroupsResourceViewStatesInstancesComponent.tsx`](components/aws/vista-autoscaling.md#components-aws-vista-autoscaling-autoscaling-groups-graficos-autoscalinggroupsresourceviewstatesinstancescomponent-tsx), [`Ec2ResourceViewUsageCpuComponent.tsx`](components/aws/vista-ec2.md#components-aws-vista-ec2-instancias-ec2-graficos-ec2resourceviewusagecpucomponent-tsx), [`Ec2ResourceViewUsageCreditsComponent.tsx`](components/aws/vista-ec2.md#components-aws-vista-ec2-instancias-ec2-graficos-ec2resourceviewusagecreditscomponent-tsx), [`Ec2ResourceViewUsageNetworkComponent.tsx`](components/aws/vista-ec2.md#components-aws-vista-ec2-instancias-ec2-graficos-ec2resourceviewusagenetworkcomponent-tsx), [`EventsViewEventCountComponent.tsx`](components/aws/vista-eventos.md#components-aws-vista-eventos-graficos-eventsvieweventcountcomponent-tsx), [`SpotVsVmChartComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-spot-vs-vm-grafico-spotvsvmchartcomponent-tsx), [`TopFacturacionChartComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-grafico-topfacturacionchartcomponent-tsx), [`S3StorageTypeChart.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-top-s3-buckets-grafico-s3storagetypechart-tsx), [`TopS3BucketsChart.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-top-s3-buckets-grafico-tops3bucketschart-tsx), [`TrendLineChart.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-top-s3-buckets-grafico-trendlinechart-tsx), [`TrendLineChartv2.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-grafico-trendlinechartv2-tsx), [`HeatmapQuotasComponent.tsx`](components/aws/vista-heatmap-quotas.md#components-aws-vista-heatmap-quotas-heatmapquotascomponent-tsx), [`RdsResourceViewCpuCreditsComponent.tsx`](components/aws/vista-rds.md#components-aws-vista-rds-graficos-rdsresourceviewcpucreditscomponent-tsx), [`RdsResourceViewCpuUsageComponent.tsx`](components/aws/vista-rds.md#components-aws-vista-rds-graficos-rdsresourceviewcpuusagecomponent-tsx), [`RdsResourceViewDbConnectionsComponent.tsx`](components/aws/vista-rds.md#components-aws-vista-rds-graficos-rdsresourceviewdbconnectionscomponent-tsx), [`RdsResourceViewIopsComponent.tsx`](components/aws/vista-rds.md#components-aws-vista-rds-graficos-rdsresourceviewiopscomponent-tsx), [`RdsResourceViewMemoryComponent.tsx`](components/aws/vista-rds.md#components-aws-vista-rds-graficos-rdsresourceviewmemorycomponent-tsx), [`RdsResourceViewStorageComponent.tsx`](components/aws/vista-rds.md#components-aws-vista-rds-graficos-rdsresourceviewstoragecomponent-tsx), [`ResourceInfraUsedViewUsageCreditsComponent.tsx`](components/aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-graficos-resourceinfrausedviewusagecreditscomponent-tsx), [`SavingPlansBarChartComponent.tsx`](components/aws/vista-saving-plan.md#components-aws-vista-saving-plan-graficos-savingplansbarchartcomponent-tsx), [`SavingPlansLineChartComponent.tsx`](components/aws/vista-saving-plan.md#components-aws-vista-saving-plan-graficos-savingplanslinechartcomponent-tsx), [`CostosVsPresupuestoViewSummaryComponent.tsx`](components/azure/presupuesto-v2.md#components-azure-presupuesto-v2-costo-vs-presupuesto-graficos-costosvspresupuestoviewsummarycomponent-tsx), [`DeploymentsChartComponent.tsx`](components/azure/vista-deployments.md#components-azure-vista-deployments-grafico-deploymentschartcomponent-tsx), [`BlobVsStorageGeneralCapacityComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-blob-vs-storage-general-graficos-blobvsstoragegeneralcapacitycomponent-tsx), [`SpotVsRegularVmTimelineComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-spot-vs-regular-vm-grafico-spotvsregularvmtimelinecomponent-tsx), [`StorageVariationCapacitiesComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-variacion-storage-graficos-storagevariationcapacitiescomponent-tsx), [`HeatmapQuotasComponent.tsx`](components/azure/vista-heatmap-quotas.md#components-azure-vista-heatmap-quotas-heatmapquotascomponent-tsx), [`SavingsPlanLineChartComponent.tsx`](components/azure/vista-savings-plan.md#components-azure-vista-savings-plan-graficos-savingsplanlinechartcomponent-tsx), [`IntraCloudBillingCostUsdChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-billing-grafico-intracloudbillingcostusdchartcomponent-tsx), [`IntraCloudComputeChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-compute-grafico-intracloudcomputechartcomponent-tsx), [`IntraCloudAwsStorageChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-aws-grafico-intracloudawsstoragechartcomponent-tsx), [`IntraCloudAzureStorageChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-azure-grafico-intracloudazurestoragechartcomponent-tsx), [`IntraCloudGcpStorageChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-gcp-grafico-intracloudgcpstoragechartcomponent-tsx), [`MultiCloudLineChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-grafico-multicloudlinechartcomponent-tsx), [`MultiCloudMonthlyServiceChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-grafico-multicloudmonthlyservicechartcomponent-tsx), [`MultiCloudServiceBarChartComponent.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-grafico-multicloudservicebarchartcomponent-tsx), [`CostosVsPresupuestoViewSummaryComponent.tsx`](components/gcp/presupuesto.md#components-gcp-presupuesto-costo-vs-presupuesto-graficos-costosvspresupuestoviewsummarycomponent-tsx), [`ZonasDNSCharts.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-dns-zonas-consumo-estado-graficos-zonasdnscharts-tsx), [`LoadBalancersCharts.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-load-balancers-consumo-uso-graficos-loadbalancerscharts-tsx), [`FlexibleCudLineChartComponent.tsx`](components/gcp/vista-cuds.md#components-gcp-vista-cuds-spend-based-cuds-graficos-flexiblecudlinechartcomponent-tsx), [`SubnetsSinRecursosCharts.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-networking-subnets-sin-recursos-graficos-subnetssinrecursoscharts-tsx), [`SpotVsStandardChart.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-spot-vs-standard-graficos-spotvsstandardchart-tsx), [`TopFilestoreSubUtilizadoChart.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-top-filestore-sub-utilizado-graficos-topfilestoresubutilizadochart-tsx), [`TopFilestoreSubUtilizadoTendenciaChart.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-top-filestore-sub-utilizado-graficos-topfilestoresubutilizadotendenciachart-tsx), [`TopStorageBucketsChart.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-top-storage-buckets-graficos-topstoragebucketschart-tsx), [`TrendStorageLineChart.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-top-storage-buckets-graficos-trendstoragelinechart-tsx), [`HeatmapQuotasComponent.tsx`](components/gcp/vista-heatmap-quotas.md#components-gcp-vista-heatmap-quotas-heatmapquotascomponent-tsx), [`RecommenderPieChartComponent.tsx`](components/gcp/vista-recommender.md#components-gcp-vista-recommender-grafico-recommenderpiechartcomponent-tsx), [`CloudSqlChartComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-cloudsql-grafico-cloudsqlchartcomponent-tsx), [`GkeChartComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-grafico-gkechartcomponent-tsx), [`ComputeEngineChartComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-grafico-computeenginechartcomponent-tsx), [`InstanceGroupChartComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-grafico-instancegroupchartcomponent-tsx), [`ReservationsBarChartComponent.tsx`](components/gcp/vista-reservas.md#components-gcp-vista-reservas-graficos-reservationsbarchartcomponent-tsx), [`CostosVsPresupuestoViewSummaryComponent.tsx`](components/presupuesto.md#components-presupuesto-costo-vs-presupuesto-graficos-costosvspresupuestoviewsummarycomponent-tsx), [`BillingTrendChart.tsx`](components/shared.md#components-shared-billing-billingtrendchart-tsx), [`TopBillingChart.tsx`](components/shared.md#components-shared-billing-topbillingchart-tsx), [`ConsumptionCharts.tsx`](components/shared.md#components-shared-consumption-consumptioncharts-tsx), [`WorkingHoursCharts.tsx`](components/shared.md#components-shared-working-hours-workinghourscharts-tsx)

Notas de implementación:

- _getThemeBG_: 1) intenta CSS var de shadcn
- _getThemeBG_: 2) sino, usa el fondo computado del body
- _getThemeBG_: 3) fallback
- _getIconColor_: Colores con buen contraste en ambos temas
- _getIconColor_: `? '#e5e7eb'` — Tailwind zinc-200
- _augmentWithFullscreenTool_: Si el usuario lo desactiva explícitamente
- _augmentWithFullscreenTool_: Asegura contraste de TODOS los íconos del toolbox (saveAsImage, etc.)
- _buildSeries_: encode: { x: 0, y: 1 },

---

<a id="lib-email-ts"></a>
## `lib/email.ts`

**Utilidades**

Exporta:

- constante `mailer` = `nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pa…`
- función `send2FACodeEmail` `async (to: string, code: string)`
- función `sendRecoveryEmail` `async (to: string, token: string): Promise<SentMessageInfo>` — NUEVA FUNCIÓN PARA RECUPERACIÓN DE CONTRASEÑA

Internos:

- constante `host`
- constante `port`
- constante `user`
- constante `pass`
- constante `from`

- Variables de entorno: `APP_NAME`, `APP_URL`, `MAIL_FROM`, `NEXT_PUBLIC_APP_URL`, `SMTP_HOST`, `SMTP_PASS`, `SMTP_PORT`, `SMTP_USER`
- Usado por: [`route.ts`](api-bridges.md#app-api-auth-forgot-password-route-ts), [`route.ts`](api-bridges.md#app-api-auth-login-route-ts)

Notas de implementación:

- _sendRecoveryEmail_: APP_URL es la variable preferida; NEXT_PUBLIC_APP_URL se mantiene como respaldo.

---

<a id="lib-exportexcelbillingintracloud-ts"></a>
## `lib/exportExcelBillingIntracloud.ts`

**Utilidades**

Exporta:

- tipo `RowType` = `'header' | 'budget' | 'invoiced' | 'var_dollar' | 'var_pct' | 'projected' | 'total' | 'dev_dollar' | 'dev_pct' | 'separ…`
- tipo `ExportRow` = `{ values: (string | number)[] type: RowType }`
- función `buildExportRows` `(data: IntraCloudMonthlyBilling[], months: string[], billingMap: Record<string, Record<string, IntraCloudMonthlyBillingData>>, summaryByMonth: Record<string, n…`
- función `exportToCSV` `(rows: ExportRow[], filename = 'intracloud_monthly_billing.csv')`
- función `exportToExcel` `async (rows: ExportRow[], monthCount: number, filename = 'intracloud_monthly_billing.xlsx')`

Internos:

- función `generateDummyBudget` `(invoiced: number): number`
- función `generateDummyProjected` `(invoiced: number): number`
- función `formatMonth` `(key: string)`
- función `buildSectionRows` `(label: string, monthlyInvoiced: Record<string, number>, totalInvoiced: number, months: string[], isSummary: boolean): …`

- Usa: [`intraCloudBillingInterfaces.ts`](tipos.md#interfaces-vista-intracloud-billing-intracloudbillinginterfaces-ts)
- Usado por: [`IntraCloudMontlhyBillingTable.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-billing-table-intracloudmontlhybillingtable-tsx)

---

<a id="lib-exportexcelhistoricalbilling-ts"></a>
## `lib/exportExcelHistoricalBilling.ts`

**Utilidades**

Exporta:

- función `exportHistoricalBillingToExcel` `async (data: BillingHistory, meses: string[], filename = 'Historico_Consumo.xlsx')` — Exporta el histórico (contrato `BillingHistory`): `meses` son las columnas y las desviaciones van hacia meses[1..].

Internos:

- función `formatDevLabel` `(toMonth: string, meses: string[])` — "YYYY-MM vs YYYY-MM" de la desviación hacia `toMonth`.

- Usa: [`billing.ts`](tipos.md#interfaces-billing-ts)
- Usado por: [`BillingHistoryTable.tsx`](components/shared.md#components-shared-billing-billinghistorytable-tsx)

Notas de implementación:

- AJUSTE DE ANCHO DE COLUMNAS (AUTOMÁTICO)

---

<a id="lib-fetcher-ts"></a>
## `lib/fetcher.ts`

**Utilidades**

Exporta:

- clase `FetchError` — Fetcher común para SWR y llamadas a los bridges. A diferencia de `fetch(url).then(r => r.json())`, lanza un `FetchError` cuando la respuesta no es 2xx. Así SWR expone `error` (y la vista puede mostrar "Error al cargar datos") en vez de tratar un body `{ detail: "..." }` de un 4xx/5xx como si fueran datos.
- constante `FETCH_TIMEOUT_MS` = `130_000` — Tiempo máximo de espera en el navegador. Es algo mayor que el timeout de los bridges (`lib/bridge.ts`, 120 s) para que normalmente llegue primero su 504 con el mensaje; este corte cubre el resto (p. ej. una red colgada).
- función `isTimeoutError` `(error: unknown): error is FetchError` — Error por tiempo de espera agotado (en el bridge o en el navegador).
- función `fetchJson` `async (input: string, init?: RequestInit): Promise<T>` — Igual que `fetch(input, init)` + `.json()`, pero lanza `FetchError` si `!res.ok` o si se agota el tiempo.
- función `fetcher` `(url: string): Promise<T>` — Fetcher GET estándar para `useSWR<T>(url, fetcher)`. Es genérico: SWR le pasa el tipo de `data` declarado en `useSWR<T>`; sin tipo explícito, `data` es `unknown`.

Internos:

- función `readErrorDetail` `(res: Response): Promise<unknown>`
- constante `TIMEOUT_MESSAGE`

- Usado por: [`page.tsx`](rutas.md#app-profile-op-licencias-estado-page-tsx), [`page.tsx`](rutas.md#app-profile-op-licencias-historial-page-tsx), [`SWRProvider.tsx`](components/generales.md#components-swrprovider-tsx), [`AiFinopsMetricsComponent.tsx`](components/ai-finops-metrics.md#components-ai-finops-metrics-aifinopsmetricscomponent-tsx), [`AiRecommendationStatusesComponent.tsx`](components/ai-recommendation-statuses.md#components-ai-recommendation-statuses-airecommendationstatusescomponent-tsx), [`BMComparisonComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-bmcomparisoncomponent-tsx), [`COCustomModelsComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-custom-models-cocustommodelscomponent-tsx), [`COFoundationComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-foundation-models-cofoundationcomponent-tsx), [`COInferenceProfilesComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-inference-profiles-coinferenceprofilescomponent-tsx), [`CostosVsPresupuestoComponent.tsx`](components/aws/presupuesto-v2.md#components-aws-presupuesto-v2-costo-vs-presupuesto-costosvspresupuestocomponent-tsx), [`PresupuestoAnualFormComponent.tsx`](components/aws/presupuesto-v2.md#components-aws-presupuesto-v2-presupuesto-anual-form-presupuestoanualformcomponent-tsx), [`PresupuestoAnualTableComponent.tsx`](components/aws/presupuesto-v2.md#components-aws-presupuesto-v2-presupuesto-anual-table-presupuestoanualtablecomponent-tsx), [`PresupuestoMensualTableComponent.tsx`](components/aws/presupuesto-v2.md#components-aws-presupuesto-v2-presupuesto-mensual-table-presupuestomensualtablecomponent-tsx), [`AdvisorViewComponent.tsx`](components/aws/vista-advisor.md#components-aws-vista-advisor-advisorviewcomponent-tsx), [`InstanciasAutoscalingGroupsChartComponent.tsx`](components/aws/vista-autoscaling.md#components-aws-vista-autoscaling-autoscaling-groups-instanciasautoscalinggroupschartcomponent-tsx), [`InstanceEc2CpuMetricsComponent.tsx`](components/aws/vista-ec2.md#components-aws-vista-ec2-instancias-ec2-instanceec2cpumetricscomponent-tsx), [`EventsViewComponent.tsx`](components/aws/vista-eventos.md#components-aws-vista-eventos-eventsviewcomponent-tsx), [`SpotVsVmComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-spot-vs-vm-spotvsvmcomponent-tsx), [`SpotVsVmTableComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-spot-vs-vm-table-spotvsvmtablecomponent-tsx), [`topRecursosGroupBy.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-top-facturaciones-top-recursos-grafico-toprecursosgroupby-tsx), [`TopS3BucketsComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-top-s3-buckets-tops3bucketscomponent-tsx), [`UnusedElbV2Columns.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-elbv2-table-unusedelbv2columns-tsx), [`UnusedNatGatewaysColumns.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-nat-gateways-table-unusednatgatewayscolumns-tsx), [`VariacionTendenciaUsoDeRecursosComponent.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-variacion-tendencia-uso-de-recursos-variaciontendenciausoderecursoscomponent-tsx), [`HeatmapQuotasComponent.tsx`](components/aws/vista-heatmap-quotas.md#components-aws-vista-heatmap-quotas-heatmapquotascomponent-tsx), [`AVGUsoLocInstEC2ChartComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-ec2-avgusolocinstec2chartcomponent-tsx), [`AVGUsoLocInstRdsMariaDBChartComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mariadb-avgusolocinstrdsmariadbchartcomponent-tsx), [`AVGUsoLocInstRdsMySQLChartComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mysql-avgusolocinstrdsmysqlchartcomponent-tsx), [`AVGUsoLocInstRdsOracleChartComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-oracle-avgusolocinstrdsoraclechartcomponent-tsx), [`AVGUsoLocInstRdsPgChartComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-pg-avgusolocinstrdspgchartcomponent-tsx), [`AVGUsoLocInstRdsSQLServerChartComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-sqlserver-avgusolocinstrdssqlserverchartcomponent-tsx), [`InstanciasRdsMariaDBChartComponent.tsx`](components/aws/vista-rds.md#components-aws-vista-rds-instancias-rds-mariadb-instanciasrdsmariadbchartcomponent-tsx), [`InstanciasRdsMySQLChartComponent.tsx`](components/aws/vista-rds.md#components-aws-vista-rds-instancias-rds-mysql-instanciasrdsmysqlchartcomponent-tsx), [`InstanciasRdsOracleChartComponent.tsx`](components/aws/vista-rds.md#components-aws-vista-rds-instancias-rds-oracle-instanciasrdsoraclechartcomponent-tsx), [`InstanciasRdsPgChartComponent.tsx`](components/aws/vista-rds.md#components-aws-vista-rds-instancias-rds-pg-instanciasrdspgchartcomponent-tsx), [`InstanciasRdsSQLServerChartComponent.tsx`](components/aws/vista-rds.md#components-aws-vista-rds-instancias-rds-sqlserver-instanciasrdssqlserverchartcomponent-tsx), [`InstanceEc2InfrautilizadaComponent.tsx`](components/aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-autoscaling-instanceec2infrautilizadacomponent-tsx), [`InstanceEc2InfrautilizadaComponent.tsx`](components/aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-ec2-instanceec2infrautilizadacomponent-tsx), [`InstanceEksInfrautilizadaComponent.tsx`](components/aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-eks-instanceeksinfrautilizadacomponent-tsx), [`SavingPlansComponent.tsx`](components/aws/vista-saving-plan.md#components-aws-vista-saving-plan-savingplanscomponent-tsx), [`Ec2TableComponent.tsx`](components/aws/vista-saving-plan.md#components-aws-vista-saving-plan-tables-ec2tablecomponent-tsx), [`TaggedResourcesComponent.tsx`](components/aws/vista-tags.md#components-aws-vista-tags-taggedresourcescomponent-tsx), [`TagsDataTable.tsx`](components/aws/vista-tags.md#components-aws-vista-tags-table-tagsdatatable-tsx), [`CostosVsPresupuestoComponent.tsx`](components/azure/presupuesto-v2.md#components-azure-presupuesto-v2-costo-vs-presupuesto-costosvspresupuestocomponent-tsx), [`PresupuestoAnualFormComponent.tsx`](components/azure/presupuesto-v2.md#components-azure-presupuesto-v2-presupuesto-anual-form-presupuestoanualformcomponent-tsx), [`PresupuestoAnualTableComponent.tsx`](components/azure/presupuesto-v2.md#components-azure-presupuesto-v2-presupuesto-anual-table-presupuestoanualtablecomponent-tsx), [`PresupuestoMensualTableComponent.tsx`](components/azure/presupuesto-v2.md#components-azure-presupuesto-v2-presupuesto-mensual-table-presupuestomensualtablecomponent-tsx), [`TablasItemAzureComponent.tsx`](components/azure/tables-azure.md#components-azure-tables-azure-tablas-item-azure-tablasitemazurecomponent-tsx), [`AdvisorViewComponent.tsx`](components/azure/vista-advisor.md#components-azure-vista-advisor-advisorviewcomponent-tsx), [`DeploymentsComponent.tsx`](components/azure/vista-deployments.md#components-azure-vista-deployments-deploymentscomponent-tsx), [`AverageByLocationComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-average-by-location-averagebylocationcomponent-tsx), [`BlobVsStorageGeneralComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-blob-vs-storage-general-blobvsstoragegeneralcomponent-tsx), [`AnalisisVMsHorarioChartComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-consumo-horario-habil-no-habil-virtual-machines-analisisvmshorariochartcomponent-tsx), [`IncrementoTopRecursosUsoChartComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-incremento-top-recursos-uso-incrementotoprecursosusochartcomponent-tsx), [`SpotVsRegularVmComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-spot-vs-regular-vm-spotvsregularvmcomponent-tsx), [`Top10RecursosUsoChartComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-top-10-recursos-uso-top10recursosusochartcomponent-tsx), [`StorageVariationComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-variacion-storage-storagevariationcomponent-tsx), [`HeatmapQuotasComponent.tsx`](components/azure/vista-heatmap-quotas.md#components-azure-vista-heatmap-quotas-heatmapquotascomponent-tsx), [`AzureMysqlResourceComponent.tsx`](components/azure/vista-recursos-mysql.md#components-azure-vista-recursos-mysql-azuremysqlresourcecomponent-tsx), [`AzureNodeResourceComponent.tsx`](components/azure/vista-recursos-nodos.md#components-azure-vista-recursos-nodos-azurenoderesourcecomponent-tsx), [`AzurePostgresResourceComponent.tsx`](components/azure/vista-recursos-postgresql.md#components-azure-vista-recursos-postgresql-azurepostgresresourcecomponent-tsx), [`RecursosTrafficManagerComponent.tsx`](components/azure/vista-recursos-tm.md#components-azure-vista-recursos-tm-recursostrafficmanagercomponent-tsx), [`AzureVmResourceComponent.tsx`](components/azure/vista-recursos-vm.md#components-azure-vista-recursos-vm-azurevmresourcecomponent-tsx), [`VmBillingPropertiesComponent.tsx`](components/azure/vista-recursos-vm.md#components-azure-vista-recursos-vm-graficos-vmbillingpropertiescomponent-tsx), [`VmMetricChartsComponent.tsx`](components/azure/vista-recursos-vm.md#components-azure-vista-recursos-vm-graficos-vmmetricchartscomponent-tsx), [`TopRecursosGeneralChartComponent.tsx`](components/azure/vista-recursos.md#components-azure-vista-recursos-top-recursos-general-toprecursosgeneralchartcomponent-tsx), [`SavingsPlanComponent.tsx`](components/azure/vista-savings-plan.md#components-azure-vista-savings-plan-savingsplancomponent-tsx), [`SavingPlanTableComponent.tsx`](components/azure/vista-savings-plan.md#components-azure-vista-savings-plan-table-savingplantablecomponent-tsx), [`TaggedResourcesComponent.tsx`](components/azure/vista-tags.md#components-azure-vista-tags-taggedresourcescomponent-tsx), [`TagsDataTable.tsx`](components/azure/vista-tags.md#components-azure-vista-tags-table-tagsdatatable-tsx), [`MultiCloudComponent.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-multicloudcomponent-tsx), [`MultiCloudTagFilter.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-filters-multicloudtagfilter-tsx), [`CostosVsPresupuestoComponent.tsx`](components/gcp/presupuesto.md#components-gcp-presupuesto-costo-vs-presupuesto-costosvspresupuestocomponent-tsx), [`PresupuestoAnualFormComponent.tsx`](components/gcp/presupuesto.md#components-gcp-presupuesto-presupuesto-anual-form-presupuestoanualformcomponent-tsx), [`PresupuestoAnualTableComponent.tsx`](components/gcp/presupuesto.md#components-gcp-presupuesto-presupuesto-anual-table-presupuestoanualtablecomponent-tsx), [`PresupuestoMensualTableComponent.tsx`](components/gcp/presupuesto.md#components-gcp-presupuesto-presupuesto-mensual-table-presupuestomensualtablecomponent-tsx), [`ZonasDNSComponent.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-dns-zonas-consumo-estado-zonasdnscomponent-tsx), [`LoadBalancersComponent.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-load-balancers-consumo-uso-loadbalancerscomponent-tsx), [`SavingPlansComponent.tsx`](components/gcp/vista-cuds.md#components-gcp-vista-cuds-resource-based-cuds-savingplanscomponent-tsx), [`SpendBasedCudsComponent.tsx`](components/gcp/vista-cuds.md#components-gcp-vista-cuds-spend-based-cuds-spendbasedcudscomponent-tsx), [`SubnetsSinRecursosComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-networking-subnets-sin-recursos-subnetssinrecursoscomponent-tsx), [`SpotVsStandardComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-spot-vs-standard-spotvsstandardcomponent-tsx), [`TopFilestoreSubUtilizadoComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-top-filestore-sub-utilizado-topfilestoresubutilizadocomponent-tsx), [`TopStorageBucketsComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-top-storage-buckets-topstoragebucketscomponent-tsx), [`UsedCostLocationComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-uso-costo-por-localizacion-usedcostlocationcomponent-tsx), [`HeatmapQuotasComponent.tsx`](components/gcp/vista-heatmap-quotas.md#components-gcp-vista-heatmap-quotas-heatmapquotascomponent-tsx), [`RecommenderComponent.tsx`](components/gcp/vista-recommender.md#components-gcp-vista-recommender-recommendercomponent-tsx), [`CloudSqlComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-cloudsql-cloudsqlcomponent-tsx), [`GkeComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-gkecomponent-tsx), [`GkeChartComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-grafico-gkechartcomponent-tsx), [`GkeMetricsCardComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-info-gkemetricscardcomponent-tsx), [`GkeBillingComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-table-gkebillingcomponent-tsx), [`ComputeEngineComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-computeenginecomponent-tsx), [`InstanceGroupsComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-instancegroupscomponent-tsx), [`InstanceGroupChartComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-grafico-instancegroupchartcomponent-tsx), [`InstanceGroupsMetricsCardsComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-info-instancegroupsmetricscardscomponent-tsx), [`InstanceGroupsBillingComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-table-instancegroupsbillingcomponent-tsx), [`ReservationsComponent.tsx`](components/gcp/vista-reservas.md#components-gcp-vista-reservas-reservationscomponent-tsx), [`TaggedResourcesComponent.tsx`](components/gcp/vista-tags.md#components-gcp-vista-tags-taggedresourcescomponent-tsx), [`TagsDataTable.tsx`](components/gcp/vista-tags.md#components-gcp-vista-tags-table-tagsdatatable-tsx), [`AdvisorCategoriesFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-advisorcategoriesfiltercomponent-tsx), [`AsgFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-asgfiltercomponent-tsx), [`AsgInstancesFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-asginstancesfiltercomponent-tsx), [`BedrockModelsFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-bedrockmodelsfiltercomponent-tsx), [`Ec2AutoscalingGroupsFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-ec2autoscalinggroupsfiltercomponent-tsx), [`Ec2MetricLabelFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-ec2metriclabelfiltercomponent-tsx), [`EksAsgFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-eksasgfiltercomponent-tsx), [`EksAsgInstancesFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-eksasginstancesfiltercomponent-tsx), [`EksFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-eksfiltercomponent-tsx), [`EventsTypeFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-eventstypefiltercomponent-tsx), [`InstancesFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-instancesfiltercomponent-tsx), [`LoadbalancersV2FilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-loadbalancersv2filtercomponent-tsx), [`MetricsFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-metricsfiltercomponent-tsx), [`MetricsRDSFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-metricsrdsfiltercomponent-tsx), [`NatGatewaysFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-natgatewaysfiltercomponent-tsx), [`S3FilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-s3filtercomponent-tsx), [`ServiceFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-servicefiltercomponent-tsx), [`TagsFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-tagsfiltercomponent-tsx), [`TagsFilterComponent_Aws.tsx`](components/general_aws.md#components-general-aws-filters-tagsfiltercomponent-aws-tsx), [`UnusedLoadbalancersV2FilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-unusedloadbalancersv2filtercomponent-tsx), [`UnusedNatGatewaysFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-unusednatgatewaysfiltercomponent-tsx), [`UnusedRoute53FilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-unusedroute53filtercomponent-tsx), [`VariationMetricFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-variationmetricfiltercomponent-tsx), [`VariationResourcesFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-variationresourcesfiltercomponent-tsx), [`AppGwFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-appgwfiltercomponent-tsx), [`CategoryFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-categoryfiltercomponent-tsx), [`DeploymentOperationsFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-deploymentoperationsfiltercomponent-tsx), [`FoundryModelsFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-foundrymodelsfiltercomponent-tsx), [`ImpactFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-impactfiltercomponent-tsx), [`InstancesFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-instancesfiltercomponent-tsx), [`InstancesFilterComponentV2.tsx`](components/general_azure.md#components-general-azure-filters-instancesfiltercomponentv2-tsx), [`MetricsFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-metricsfiltercomponent-tsx), [`ResourceGroupsFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-resourcegroupsfiltercomponent-tsx), [`ResourcesFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-resourcesfiltercomponent-tsx), [`StorageAccountsFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-storageaccountsfiltercomponent-tsx), [`SubscriptionsFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-subscriptionsfiltercomponent-tsx), [`SubscriptionsFilterComponentV2.tsx`](components/general_azure.md#components-general-azure-filters-subscriptionsfiltercomponentv2-tsx), [`TagsFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-tagsfiltercomponent-tsx), [`TrafficManagerFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-trafficmanagerfiltercomponent-tsx), [`UnusedAppGwFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-unusedappgwfiltercomponent-tsx), [`UnusedLoadbalancerFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-unusedloadbalancerfiltercomponent-tsx), [`UnusedTrafficManagerFilter.tsx`](components/general_azure.md#components-general-azure-filters-unusedtrafficmanagerfilter-tsx), [`UnusedVmFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-unusedvmfiltercomponent-tsx), [`UnusedVmssFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-unusedvmssfiltercomponent-tsx), [`VmFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-vmfiltercomponent-tsx), [`ProjectsFilterComponent.tsx`](components/general_gcp.md#components-general-gcp-filters-projectsfiltercomponent-tsx), [`ResourcesFilterComponent.tsx`](components/general_gcp.md#components-general-gcp-filters-resourcesfiltercomponent-tsx), [`TagsFilterComponent.tsx`](components/general_gcp.md#components-general-gcp-filters-tagsfiltercomponent-tsx), [`VertexModelsFilterComponent.tsx`](components/general_gcp.md#components-general-gcp-filters-vertexmodelsfiltercomponent-tsx), [`CentroDeCostoFilterComponent.tsx`](components/general_presupuesto.md#components-general-presupuesto-filters-centrodecostofiltercomponent-tsx), [`GcpVertexComparisonComponent.tsx`](components/google-vertex.md#components-google-vertex-comparacion-gcpvertexcomparisoncomponent-tsx), [`COGcpVertexComponent.tsx`](components/google-vertex.md#components-google-vertex-costo-optimizacion-vertex-models-cogcpvertexcomponent-tsx), [`AFComparisonComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-afcomparisoncomponent-tsx), [`COAzureFoundryComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-costo-optimizacion-foundation-models-coazurefoundrycomponent-tsx), [`CreateUserForm.tsx`](components/perfilamiento.md#components-perfilamiento-createuserform-tsx), [`LicenseTable.tsx`](components/perfilamiento.md#components-perfilamiento-licensetable-tsx), [`CentroDeCostoFormComponent.tsx`](components/presupuesto.md#components-presupuesto-centro-de-costo-form-centrodecostoformcomponent-tsx), [`CentroDeCostoTableComponent.tsx`](components/presupuesto.md#components-presupuesto-centro-de-costo-table-centrodecostotablecomponent-tsx), [`CostosVsPresupuestoComponent.tsx`](components/presupuesto.md#components-presupuesto-costo-vs-presupuesto-costosvspresupuestocomponent-tsx), [`PresupuestoAnualFormComponent.tsx`](components/presupuesto.md#components-presupuesto-presupuesto-anual-form-presupuestoanualformcomponent-tsx), [`PresupuestoAnualTableComponent.tsx`](components/presupuesto.md#components-presupuesto-presupuesto-anual-table-presupuestoanualtablecomponent-tsx), [`PresupuestoMensualTableComponent.tsx`](components/presupuesto.md#components-presupuesto-presupuesto-mensual-table-presupuestomensualtablecomponent-tsx), [`DataStateComponent.tsx`](components/shared.md#components-shared-datastatecomponent-tsx), [`BillingTrendView.tsx`](components/shared.md#components-shared-billing-billingtrendview-tsx), [`TopBillingView.tsx`](components/shared.md#components-shared-billing-topbillingview-tsx), [`ConsumptionView.tsx`](components/shared.md#components-shared-consumption-consumptionview-tsx), [`UnusedDetailModal.tsx`](components/shared.md#components-shared-unused-unuseddetailmodal-tsx), [`UnusedView.tsx`](components/shared.md#components-shared-unused-unusedview-tsx), [`WorkingHoursView.tsx`](components/shared.md#components-shared-working-hours-workinghoursview-tsx), [`useConnectors.ts`](hooks.md#hooks-useconnectors-ts), [`useFeatureAccess.ts`](hooks.md#hooks-usefeatureaccess-ts), [`useSession.ts`](hooks.md#hooks-usesession-ts)

---

<a id="lib-filters-ts"></a>
## `lib/filters.ts`

**Utilidades**

Exporta:

- interfaz `CommonFilters` — Filtros comunes a las 3 nubes (F-06). Cada `FiltersComponent` (general_aws / general_azure / general_gcp) entrega a su vista este objeto, además de sus props propias, y guarda los campos comunes en la URL con los mismos nombres. Las URLs antiguas siguen funcionando: al leer se aceptan también los nombres que usaba cada nube (`startDate`, `region`, `selectedKey`, `projects`...). En las APIs, los nombres canónicos equivalentes son `region`, `scope`, `resource_id`, `tag_key` y `tag_value`, con el centinela único `all` (ver `utils/query_params.py` de cada API).
- constante `FILTER_PARAMS` = `{ dateFrom: 'dateFrom', dateTo: 'dateTo', regions: 'regions', scopes: 'scopes',…` — Nombres de los campos comunes en la URL.
- tipo `FilterParam` = `keyof typeof FILTER_PARAMS`
- función `readFilterParam` `(searchParams: SearchParamsLike, param: FilterParam): string | null` — Lee un campo común de la URL: primero el nombre canónico y, si no está, los nombres antiguos.
- función `readFilterDate` `(searchParams: SearchParamsLike, param: 'dateFrom' | 'dateTo', fallback: Date): Date` — Fecha de la URL (o el valor por defecto si falta o no es válida).
- función `toFilterList` `(value: string | string[] | null | undefined): string[]` — "a,b" -> ['a', 'b']; centinelas y vacío -> [].
- función `toFilterTag` `(value: string | null | undefined): string | null` — Tag/label: centinelas y vacío -> null.
- función `buildCommonFilters` `(values: { dateFrom: Date; dateTo: Date; regions?: string | string[] | null; scopes?: string | string[] | null; resourceIds?: string | string[] | null; tagKey?…` — Arma el objeto común desde los valores (posiblemente con centinelas) que maneja cada `FiltersComponent`.
- función `setFilterParam` `(query: URLSearchParams, param: FilterParam, value: string | string[] | null | undefined)` — Escribe un campo común con su nombre canónico (omite vacíos y centinelas).
- función `setFilterDates` `(query: URLSearchParams, dateFrom: Date, dateTo: Date)` — Escribe las fechas del filtro en la URL.

Interfaz `CommonFilters` (exportada) — Filtros comunes a las 3 nubes (F-06). Cada `FiltersComponent` (general_aws / general_azure / general_gcp) entrega a su vista este objeto, además de sus props propias, y guarda los campos comunes en la URL con los mismos nombres. Las URLs antiguas siguen funcionando: al leer se aceptan también los nombres que usaba cada nube (`startDate`, `region`, `selectedKey`, `projects`...). En las APIs, los nombres canónicos equivalentes son `region`, `scope`, `resource_id`, `tag_key` y `tag_value`, con el centinela único `all` (ver `utils/query_params.py` de cada API).:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `dateFrom` | `Date` | no | — |
| `dateTo` | `Date` | no | — |
| `regions` | `string[]` | no | Regiones o ubicaciones; vacío = todas. |
| `scopes` | `string[]` | no | Suscripciones (Azure) o proyectos (GCP); vacío = todos. |
| `resourceIds` | `string[]` | no | Recursos seleccionados (instancias, VMs, recursos GCP...); vacío = todos. |
| `tagKey` | `string \| null` | no | Tag (AWS/Azure) o label (GCP); null = sin filtro. |
| `tagValue` | `string \| null` | no | — |

- Tipo interno `SearchParamsLike` = `{ get: (name: string) => string | null }`
Internos:

- constante `LEGACY_PARAMS` — Nombres que usaba cada nube antes de F-06 (se leen como respaldo para no romper enlaces guardados).
- constante `ALL_SENTINELS` — Valores que significan "todos" en alguna nube.
- función `isAll` `(value: string | null | undefined): boolean`

- Usado por: [`ModalResourceBillingComponent.tsx`](components/aws/facturacion-recurso.md#components-aws-facturacion-recurso-modalresourcebillingcomponent-tsx), [`AutoscalingGroupsInstancesColumns.tsx`](components/aws/vista-autoscaling.md#components-aws-vista-autoscaling-autoscaling-groups-graficos-autoscalinggroupsinstancescolumns-tsx), [`Ec2ConsumeViewInstanceColumns.tsx`](components/aws/vista-consumos.md#components-aws-vista-consumos-ec2-table-ec2consumeviewinstancecolumns-tsx), [`ElbV2ConsumeInsightModalComponent.tsx`](components/aws/vista-consumos.md#components-aws-vista-consumos-elbv2-info-elbv2consumeinsightmodalcomponent-tsx), [`ConsumoHorarioColumns.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-consumo-horario-habil-vs-no-habil-table-consumohorariocolumns-tsx), [`UnusedEbsColumns.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-ebs-table-unusedebscolumns-tsx), [`UnusedEc2Columns.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-ec2-table-unusedec2columns-tsx), [`UnusedElbV2InsightModal.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-elbv2-info-unusedelbv2insightmodal-tsx), [`UnusedElbV2Columns.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-elbv2-table-unusedelbv2columns-tsx), [`UnusedNatGatewaysInsightModal.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-nat-gateways-info-unusednatgatewaysinsightmodal-tsx), [`UnusedNatGatewaysColumns.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-nat-gateways-table-unusednatgatewayscolumns-tsx), [`ec2ResourceInfraUsedTableColumns.tsx`](components/aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-autoscaling-table-ec2resourceinfrausedtablecolumns-tsx), [`ec2ResourceInfraUsedTableColumns.tsx`](components/aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-ec2-table-ec2resourceinfrausedtablecolumns-tsx), [`ec2ResourceInfraUsedTableColumns.tsx`](components/aws/vista-recursos.md#components-aws-vista-recursos-infrautilizadas-eks-table-ec2resourceinfrausedtablecolumns-tsx), [`WorkingNonWorkingHoursColumns.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-consumo-horario-habil-no-habil-table-workingnonworkinghourscolumns-tsx), [`SpotVsRegularVmColumns.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-spot-vs-regular-vm-table-spotvsregularvmcolumns-tsx), [`UnusedAppsGwColumns.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-unused-apps-gateway-table-unusedappsgwcolumns-tsx), [`UnusedVmExtensionsColumns.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-unused-resources-extensions-table-unusedvmextensionscolumns-tsx), [`UnusedVmColumns.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-unused-resources-vm-table-unusedvmcolumns-tsx), [`UnusedVmssColumns.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-unused-resources-vmss-table-unusedvmsscolumns-tsx), [`UnusedTrafficManagerColumns.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-unused-traffic-managers-table-unusedtrafficmanagercolumns-tsx), [`WorkingNonWorkingHoursColumns.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-consumo-horario-habil-no-habil-table-workingnonworkinghourscolumns-tsx), [`GkeNodesColumns.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-table-gkenodescolumns-tsx), [`InstanceGroupsInstancesColumns.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-table-instancegroupsinstancescolumns-tsx), [`UnusedCeColumns.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-sin-uso-compute-engine-table-unusedcecolumns-tsx), [`FiltersComponent.tsx`](components/general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](components/general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](components/general_gcp.md#components-general-gcp-filters-filterscomponent-tsx), [`FiltersComponent.tsx`](components/general_presupuesto.md#components-general-presupuesto-filters-filterscomponent-tsx)

---

<a id="lib-format-ts"></a>
## `lib/format.ts`

**Utilidades**

Formateadores de texto y moneda compartidos por las vistas de AWS, Azure y GCP.

Exporta:

- función `titleCase` `(value: string): string` — `storage_account` / `blobService` / `file-service` → `Storage Account` / `Blob Service` / `File Service`.
- función `formatCurrency` `(value: number | null | undefined, { currency = 'USD', locale = 'es-CL' }: FormatCurrencyOptions = {}): string` — Formatea un monto con `Intl.NumberFormat` (p. ej. `$1.234,56`). Montos menores a una centésima se muestran con 2 cifras significativas en vez de `$0,00`.

Interfaz `FormatCurrencyOptions`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `currency` | `string` | sí | Código ISO 4217. Por defecto `USD`. |
| `locale` | `string` | sí | — |

- Usado por: [`StorageVariationCardsComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-variacion-storage-info-storagevariationcardscomponent-tsx), [`ZonasDNSCardsComponent.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-dns-zonas-consumo-estado-info-zonasdnscardscomponent-tsx), [`LoadBalancersCardsComponent.tsx`](components/gcp/vista-consumos.md#components-gcp-vista-consumos-load-balancers-consumo-uso-info-loadbalancerscardscomponent-tsx), [`BillingTrendView.tsx`](components/shared.md#components-shared-billing-billingtrendview-tsx), [`TopBillingView.tsx`](components/shared.md#components-shared-billing-topbillingview-tsx), [`ConsumptionCards.tsx`](components/shared.md#components-shared-consumption-consumptioncards-tsx), [`ConsumptionDetailModal.tsx`](components/shared.md#components-shared-consumption-consumptiondetailmodal-tsx), [`ConsumptionTable.tsx`](components/shared.md#components-shared-consumption-consumptiontable-tsx), [`UnusedCards.tsx`](components/shared.md#components-shared-unused-unusedcards-tsx), [`UnusedDetailModal.tsx`](components/shared.md#components-shared-unused-unuseddetailmodal-tsx), [`UnusedTable.tsx`](components/shared.md#components-shared-unused-unusedtable-tsx)

---

<a id="lib-gcpvertexcomparisonformatters-ts"></a>
## `lib/gcpVertexComparisonFormatters.ts`

**Utilidades**

Exporta:

- función `formatCurrency` `(value: number | null | undefined): string`
- función `formatPercent` `(value: number | null | undefined): string`
- función `formatSignedPercent` `(value: number | null | undefined): string`
- función `formatTokens` `(value: number | null | undefined): string`
- función `formatInteger` `(value: number | null | undefined): string`
- función `formatScore` `(value: number | null | undefined): string`
- función `formatDate` `(value: string | null | undefined): string`
- función `formatPricePerMillion` `(value: number | null | undefined): string`
- constante `confidenceLabels` = `{ HIGH: 'Alta', MEDIUM: 'Media', LOW: 'Baja' }`
- constante `confidenceClasses` = `{ HIGH: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-…`
- función `deltaClass` `(value: number): string`
- constante `providerShortLabels` = `{ bedrock: 'AWS', foundry: 'Azure' }`
- constante `providerFullLabels` = `{ bedrock: 'AWS Bedrock', foundry: 'Azure Foundry' }`

Internos:

- constante `currencyFormatter`
- constante `preciseCurrencyFormatter`
- constante `percentFormatter`
- constante `tokenFormatter`
- constante `integerFormatter`
- constante `dateFormatter`

- Usado por: [`GcpVertexComparisonCandidateConfidenceComponent.tsx`](components/google-vertex.md#components-google-vertex-comparacion-info-gcpvertexcomparisoncandidateconfidencecomponent-tsx), [`GcpVertexComparisonCardsComponent.tsx`](components/google-vertex.md#components-google-vertex-comparacion-info-gcpvertexcomparisoncardscomponent-tsx), [`GcpVertexComparisonCostBridgeComponent.tsx`](components/google-vertex.md#components-google-vertex-comparacion-info-gcpvertexcomparisoncostbridgecomponent-tsx), [`GcpVertexComparisonModelPanelsComponent.tsx`](components/google-vertex.md#components-google-vertex-comparacion-info-gcpvertexcomparisonmodelpanelscomponent-tsx), [`GcpVertexComparisonTokenMixComponent.tsx`](components/google-vertex.md#components-google-vertex-comparacion-info-gcpvertexcomparisontokenmixcomponent-tsx), [`GcpVertexComparisonViewComponent.tsx`](components/google-vertex.md#components-google-vertex-comparacion-info-gcpvertexcomparisonviewcomponent-tsx), [`GcpVertexComparisonEndpointsColumns.tsx`](components/google-vertex.md#components-google-vertex-comparacion-table-gcpvertexcomparisonendpointscolumns-tsx)

---

<a id="lib-gcp-recommender-categories-ts"></a>
## `lib/gcp_recommender_categories.ts`

**Utilidades**

Exporta:

- constante `gcp_recommender_categories` = `[ { label: 'Todas las Categorías', value: 'all_categories' }, { label: 'Costo',…`

- Usado por: [`RecommenderCategoriesFilterComponent.tsx`](components/general_gcp.md#components-general-gcp-filters-recommendercategoriesfiltercomponent-tsx)

---

<a id="lib-gcp-recommender-priorities-ts"></a>
## `lib/gcp_recommender_priorities.ts`

**Utilidades**

Exporta:

- constante `gcp_recommender_priorities` = `[ { label: 'Todas las Prioridades', value: 'all_priorities' }, { label: 'P1 (Cr…`

- Usado por: [`RecommenderPriorityFilterComponent.tsx`](components/general_gcp.md#components-general-gcp-filters-recommenderpriorityfiltercomponent-tsx)

---

<a id="lib-gcp-regions-ts"></a>
## `lib/gcp_regions.ts`

**Utilidades**

Exporta:

- constante `gcp_regions` = `[ { label: 'Todas las Regiones', value: 'all_regions' }, // América del Norte (…`

- Usado por: [`RegionsFilterComponent.tsx`](components/general_gcp.md#components-general-gcp-filters-regionsfiltercomponent-tsx)

Notas de implementación:

- América del Norte (EE.UU.)
- América del Norte (Canadá)
- Sudamérica
- Europa
- Asia Pacífico
- Medio Oriente

---

<a id="lib-gcp-services-ts"></a>
## `lib/gcp_services.ts`

**Utilidades**

Exporta:

- constante `gcp_services` = `[ // { value: 'all', label: 'Todos los Servicios' }, { value: 'compute_engine',…`
- constante `gcp_compute_services` = `[ { value: 'compute_engine', label: 'Compute Engine' }, { value: 'dbpg', label:…`
- constante `gcp_storage_services` = `[ { value: 'storage_buckets', label: 'Cloud Storage Buckets' }, // { value: 'fi…`

- Usado por: [`MultiTenantServiceFilterComponent.tsx`](components/general_comp_cloud.md#components-general-comp-cloud-filters-multitenantservicefiltercomponent-tsx), [`ServiceFilterComponent.tsx`](components/general_gcp.md#components-general-gcp-filters-servicefiltercomponent-tsx)

Notas de implementación:

- { value: 'all', label: 'Todos los Servicios' },
- _gcp_storage_services_: { value: 'filestore', label: 'Filestore' },

---

<a id="lib-getuptimeinstance-ts"></a>
## `lib/getUptimeInstance.ts`

**Utilidades**

Exporta:

- función `getUptime` `(launchTime: Date)`

- Usado por: [`Ec2ResourceViewHistoricInfoComponent.tsx`](components/aws/vista-ec2.md#components-aws-vista-ec2-instancias-ec2-info-ec2resourceviewhistoricinfocomponent-tsx), [`Ec2ResourceViewInfoComponent.tsx`](components/aws/vista-ec2.md#components-aws-vista-ec2-instancias-ec2-info-ec2resourceviewinfocomponent-tsx), [`AzureNodeInfoComponent.tsx`](components/azure/vista-recursos-nodos.md#components-azure-vista-recursos-nodos-azurenodeinfocomponent-tsx), [`AzureVmInfoComponent.tsx`](components/azure/vista-recursos-vm.md#components-azure-vista-recursos-vm-azurevminfocomponent-tsx), [`CloudSqlHistoricInfoComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-cloudsql-info-cloudsqlhistoricinfocomponent-tsx), [`CloudSqlInfoComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-cloudsql-info-cloudsqlinfocomponent-tsx), [`ComputeEngineHistoricInfoComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-info-computeenginehistoricinfocomponent-tsx), [`ComputeEngineInfoComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-info-computeengineinfocomponent-tsx)

---

<a id="lib-handleconnectorscreation-ts"></a>
## `lib/handleConnectorsCreation.ts`

**Utilidades**

Exporta:

- tipo `JiraConnectorPayload` = `{ jira_url: string; client_id: string; client_secret: string; default_project: string; }`
- tipo `ServiceNowConnectorPayload` = `{ instance_url: string; client_id: string; client_secret: string; default_table: string; }`
- tipo `ConnectorType` = `"jira" | "servicenow"`
- tipo `ConnectorBackendStatus` = `| "active" | "invalid_credentials" | "disabled"`
- tipo `JiraConnectorConfig` = `{ jira_url: string; client_id: string; default_project: string; }`
- tipo `ServiceNowConnectorConfig` = `{ instance_url: string; client_id: string; default_table: string; }`
- tipo `ExternalConnectorResponse` = `{ id: string; connectorType: ConnectorType; config: JiraConnectorConfig | ServiceNowConnectorConfig; status: ConnectorB…`
- clase `ApiError`
- constante `JIRA_CONNECTOR_KEY` = `"/api/connector/bridge/connector/create/jira"`
- constante `SERVICENOW_CONNECTOR_KEY` = `"/api/connector/bridge/connector/create/servicenow"`
- función `createJiraConnectorFetcher` `async (url: string, { arg }: { arg: JiraConnectorPayload }): Promise<ExternalConnectorResponse>`
- función `createServiceNowConnectorFetcher` `async (url: string, { arg }: { arg: ServiceNowConnectorPayload }): Promise<ExternalConnectorResponse>`
- función `isJiraConnectorConfig` `(config: JiraConnectorConfig | ServiceNowConnectorConfig): config is JiraConnectorConfig`
- función `isServiceNowConnectorConfig` `(config: JiraConnectorConfig | ServiceNowConnectorConfig): config is ServiceNowConnectorConfig`

- Tipo interno `FastApiValidationError` = `{ loc: (string | number)[]; msg: string; type: string; }`
Internos:

- constante `API_BASE`
- función `parseErrorDetail` `(detail: unknown, fallbackStatus: number): string`

- API: `/api/connector/bridge/connector/create/jira`, `/api/connector/bridge/connector/create/servicenow`
- Variables de entorno: `API_CONNECTORS`
- Usado por: [`JiraConnectorFormComponent.tsx`](components/profile.md#components-profile-connectors-jiraconnectorformcomponent-tsx), [`ServiceNowConnectorFormComponent.tsx`](components/profile.md#components-profile-connectors-servicenowconnectorformcomponent-tsx)

---

<a id="lib-logger-ts"></a>
## `lib/logger.ts`

**Utilidades**

Exporta:

- función `createLogger` `(context: string)`
- constante `logger` = `createLogger('App')`

Interfaz `LogMetadata`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `[key: string]: unknown;` | `unknown` | no | — |

- Tipo interno `LogLevel` = `'info' | 'warn' | 'error' | 'debug'`
Internos:

- clase `Logger`

- Variables de entorno: `NEW_RELIC_ENABLED`, `NODE_ENV`
- Usado por: [`route.ts`](api-bridges.md#app-api-auth-login-route-ts), [`route.ts`](api-bridges.md#app-api-auth-swap-client-context-route-ts)

Notas de implementación:

- _Logger_: Solo en entorno server (Next.js evita Webpack bundle)
- _Logger_: Agregar metadata personalizada
- _Logger_: ignorado
- _Logger_: Registrar errores
- _Logger_: Crear evento personalizado

---

<a id="lib-metricutils-ts"></a>
## `lib/metricUtils.ts`

**Utilidades**

Exporta:

- función `formatMetric` `(value: number)`

- Usado por: [`UnusedElbV2InsightModal.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-elbv2-info-unusedelbv2insightmodal-tsx), [`UnusedElbV2Columns.tsx`](components/aws/vista-funciones.md#components-aws-vista-funciones-unused-elbv2-table-unusedelbv2columns-tsx), [`IntraCloudBillingCardsComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-billing-info-intracloudbillingcardscomponent-tsx), [`IntraCloudBillingColumns.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-billing-table-intracloudbillingcolumns-tsx), [`IntraCloudComputeCardsByTenantComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-compute-info-intracloudcomputecardsbytenantcomponent-tsx), [`IntraCloudServicesBillingColumns.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-services-billing-table-intracloudservicesbillingcolumns-tsx), [`IntraCloudServicesBillingTable.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-services-billing-table-intracloudservicesbillingtable-tsx), [`IntraCloudAwsStorageCardsByTenantComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-aws-info-intracloudawsstoragecardsbytenantcomponent-tsx), [`IntraCloudAzureStorageCardsByTenantComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-azure-info-intracloudazurestoragecardsbytenantcomponent-tsx), [`IntraCloudGcpStorageCardsByTenantComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-gcp-info-intracloudgcpstoragecardsbytenantcomponent-tsx), [`CloudSqlMetricsCardComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-cloudsql-info-cloudsqlmetricscardcomponent-tsx), [`GkeMetricsCardComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-info-gkemetricscardcomponent-tsx), [`ComputeEngineMetricsCardsComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-info-computeenginemetricscardscomponent-tsx), [`InstanceGroupsMetricsCardsComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-info-instancegroupsmetricscardscomponent-tsx)

---

<a id="lib-mongodb-ts"></a>
## `lib/mongodb.ts`

**Utilidades**

Exporta:

- función `getDb` `async (): Promise<Db>`
- función `getCollection` `async (name: string): Promise<Collection<T>>`

Internos:

- constante `clientPromise`
- función `getClientPromise` `(): Promise<MongoClient>`

- Variables de entorno: `MONGODB_URI`, `MONGODB_USER_DB`, `NODE_ENV`
- Usado por: [`route.ts`](api-bridges.md#app-api-auth-forgot-password-route-ts), [`route.ts`](api-bridges.md#app-api-auth-get-token-route-ts), [`route.ts`](api-bridges.md#app-api-auth-login-route-ts), [`route.ts`](api-bridges.md#app-api-auth-me-route-ts), [`route.ts`](api-bridges.md#app-api-auth-reset-password-route-ts), [`route.ts`](api-bridges.md#app-api-auth-validate-reset-token-route-ts), [`route.ts`](api-bridges.md#app-api-auth-verify-2fa-route-ts), [`route.ts`](api-bridges.md#app-api-empresas-sii-route-ts), [`route.ts`](api-bridges.md#app-api-op-licencias-comparar-route-ts), [`route.ts`](api-bridges.md#app-api-op-licencias-estado-route-ts), [`route.ts`](api-bridges.md#app-api-op-licencias-generar-route-ts), [`route.ts`](api-bridges.md#app-api-op-licencias-historial-route-ts), [`route.ts`](api-bridges.md#app-api-op-licencias-partner-route-ts), [`route.ts`](api-bridges.md#app-api-op-licencias-solicitudes-id-route-ts), [`route.ts`](api-bridges.md#app-api-op-licencias-solicitudes-route-ts), [`route.ts`](api-bridges.md#app-api-perfilamiento-empresas-id-route-ts), [`route.ts`](api-bridges.md#app-api-perfilamiento-empresas-route-ts), [`route.ts`](api-bridges.md#app-api-perfilamiento-users-id-route-ts), [`route.ts`](api-bridges.md#app-api-perfilamiento-users-route-ts), [`connectors.ts`](#lib-connectors-ts), [`db-utils.ts`](#lib-db-utils-ts)

---

<a id="lib-plans-ts"></a>
## `lib/plans.ts`

**Utilidades**

Exporta:

- constante `PLAN_CONFIG` = `{ 'Starter (Freemium)': { userLimit: 1, }, Starter: { userLimit: 1, }, Pro: { u…`

- Usado por: [`route.ts`](api-bridges.md#app-api-perfilamiento-empresas-id-route-ts), [`route.ts`](api-bridges.md#app-api-perfilamiento-empresas-route-ts), [`EditLicenseModal.tsx`](components/perfilamiento.md#components-perfilamiento-editlicensemodal-tsx), [`LicenseCreationForm.tsx`](components/perfilamiento.md#components-perfilamiento-licensecreationform-tsx)

---

<a id="lib-ratelimit-ts"></a>
## `lib/rateLimit.ts`

**Utilidades**

Exporta:

- función `rateLimit` `(key: string, limit = 10, windowMs = 60_000)`

Internos:

- constante `buckets` — CAMBIAR ESTO PARA MANEJARLO CON REDIS (BACKLOG)

- Usado por: [`route.ts`](api-bridges.md#app-api-auth-login-route-ts)

---

<a id="lib-sessionpayload-ts"></a>
## `lib/sessionPayload.ts`

**Utilidades**

Contenido del token de sesión (G-06): la configuración de nubes sale SIEMPRE de la empresa, que es la fuente de
verdad; del usuario sólo se toma la identidad (sub, username, email, client, role).
Los campos son los mismos que ya llevaba el token (login, swap de admin_global), para no romper a las APIs.

Exporta:

- función `companyCloudClaims` `(company: Empresa, activeDbs: Partial<Record<CloudProvider, string | null>> = {}): CloudClaims` — Flags, BD activa y cuentas por nube de una empresa. `activeDbs` fija la BD activa de cada nube (el swap la elige por cuenta); por defecto, `user_db_<cloud>` de la empresa. Sólo hay cuentas en multi-tenant; en single-tenant manda `user_db_<cloud>`.
- función `buildLoginPayload` `(user: User, company: Empresa): JWTPayload` — Token de login: identidad del usuario + configuración y plan de su empresa.

- Tipo interno `CloudClaims` = `Pick< JWTPayload, | 'is_aws' | 'user_db_aws' | 'is_azure' | 'user_db_azure' | 'is_gcp' | 'user_db_gcp' | 'is_openai' | …`
- Usa: [`db.ts`](tipos.md#types-db-ts), [`index.ts`](tipos.md#types-index-ts), [`cloudAccounts.ts`](#lib-cloudaccounts-ts)
- Usado por: [`route.ts`](api-bridges.md#app-api-auth-get-token-route-ts), [`route.ts`](api-bridges.md#app-api-auth-swap-client-context-route-ts), [`route.ts`](api-bridges.md#app-api-auth-verify-2fa-route-ts)

Notas de implementación:

- _buildLoginPayload_: Los conectores NO viajan en el token: se leen por empresa (ver lib/connectors.ts)

---

<a id="lib-unused-ts"></a>
## `lib/unused.ts`

**Utilidades**

Utilidades de la familia "Recursos sin uso": URLs del contrato canónico, etiquetas del diagnóstico y
combinación de métricas para tarjetas y columnas. El formato de cada métrica sale del registro de `@/lib/consumption`.

Exporta:

- función `unusedUrl` `(cloud: UnusedCloud, resource: string, action: UnusedAction, params: QueryParams): string` — `/api/{cloud}/bridge/{cloud}/unused/{resource}/{action}?{params}` (el bridge lo envía a `/api/{cloud}/unused/...`).
- constante `DIAGNOSIS` = `{ underutilized: { label: 'Infrautilizado', className: 'bg-red-100 text-red-700…`
- función `formatAttribute` `(value: unknown, format?: ValueFormat | 'text' | 'boolean' | 'date', unit?: string): string` — Valor de un atributo del recurso para mostrar (número con su formato, fecha, sí / no o texto).
- función `resourceField` `(resource: UnusedResource, key: string): unknown` — Campo de un recurso para tarjetas de distribución y columnas: primero `attributes`, luego el campo de primer nivel.
- función `getUnusedMetric` `(name: string, overrides?: Record<string, MetricDefinition>): MetricDefinition` — Formato de una métrica: primero lo propio del recurso (`overrides`, por clave normalizada), luego el registro común.
- interfaz `MetricGroup` — Varias métricas que se muestran juntas (p. ej. red In + Out).
- interfaz `CombinedMetric`
- función `combineMetrics` `(metrics: UnusedMetric[], group: MetricGroup): CombinedMetric | null` — Suma las métricas del grupo (como hacía la tabla original con In + Out); la barra se recalcula sobre el total.
- función `summaryFromResources` `(resources: UnusedResource[], group: MetricGroup): { avg: number; peak: number | null } | null` — Promedio y peak de un grupo de métricas calculados desde las filas (recursos sin `/summary`): promedio entre recursos de la suma del grupo; peak = el mayor valor (máximo o promedio) de un recurso.
- función `combineSummary` `(summary: UnusedMetricSummary[], group: MetricGroup): { avg: number; peak: number | null } | null` — Promedio y peak de un grupo de métricas de las tarjetas (suma de las métricas del grupo).

Interfaz `MetricGroup` (exportada) — Varias métricas que se muestran juntas (p. ej. red In + Out).:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `label` | `string` | no | — |
| `metrics` | `string[]` | no | — |

Interfaz `CombinedMetric` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `avg` | `number \| null` | no | — |
| `context` | `number \| null` | no | Máximo (ranking) o total (contribution) del grupo, para el texto "Mx" / "Tot". |
| `bar` | `number` | no | — |
| `visualization` | `'ranking' \| 'contribution' \| null` | no | — |

- API: `/api/{…}/bridge/{…}/unused/{…}/{…}`
- Usa: [`consumption.ts`](#lib-consumption-ts), [`unused.ts`](tipos.md#interfaces-unused-ts)
- Usado por: [`UnusedCards.tsx`](components/shared.md#components-shared-unused-unusedcards-tsx), [`UnusedDetailModal.tsx`](components/shared.md#components-shared-unused-unuseddetailmodal-tsx), [`UnusedTable.tsx`](components/shared.md#components-shared-unused-unusedtable-tsx), [`UnusedView.tsx`](components/shared.md#components-shared-unused-unusedview-tsx), [`types.ts`](components/shared.md#components-shared-unused-types-ts), [`unusedConfigs.ts`](components/shared.md#components-shared-unused-unusedconfigs-ts)

---

<a id="lib-utils-ts"></a>
## `lib/utils.ts`

**Utilidades**

Exporta:

- función `cn` `(...inputs: ClassValue[])`

- Usado por: [`page.tsx`](rutas.md#app-profile-comparacion-comparacion-nubes-page-tsx), [`page.tsx`](rutas.md#app-profile-perfilamiento-perfilamiento-page-tsx), [`page.tsx`](rutas.md#app-profile-op-licencias-estado-page-tsx), [`page.tsx`](rutas.md#app-profile-op-licencias-page-tsx), [`AiRecommendationStatusHistoryComponent.tsx`](components/generales.md#components-airecommendationstatushistorycomponent-tsx), [`NavbarClientSwitcher.tsx`](components/generales.md#components-navbarclientswitcher-tsx), [`SidebarNav.tsx`](components/generales.md#components-sidebarnav-tsx), [`AiRecommendationStatusesInfoComponent.tsx`](components/ai-recommendation-statuses.md#components-ai-recommendation-statuses-info-airecommendationstatusesinfocomponent-tsx), [`SelectAlertsCloud.tsx`](components/alertas.md#components-alertas-selectalertscloud-tsx), [`BMComparisonCandidateConfidenceComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-info-bmcomparisoncandidateconfidencecomponent-tsx), [`BMComparisonCardsComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-info-bmcomparisoncardscomponent-tsx), [`BMComparisonCostBridgeComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-info-bmcomparisoncostbridgecomponent-tsx), [`BMComparisonModelPanelsComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-info-bmcomparisonmodelpanelscomponent-tsx), [`BMComparisonTokenMixComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-info-bmcomparisontokenmixcomponent-tsx), [`BMComparisonViewComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-info-bmcomparisonviewcomponent-tsx), [`BMComparisonResourcesColumns.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-comparacion-table-bmcomparisonresourcescolumns-tsx), [`MainViewCostOptimizationComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-mainviewcostoptimizationcomponent-tsx), [`COCustomModelsCardsComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-custom-models-info-cocustommodelscardscomponent-tsx), [`COFoundationCardsComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-foundation-models-info-cofoundationcardscomponent-tsx), [`COInferenceProfilesCardsComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-costo-optimizacion-inference-profiles-info-coinferenceprofilescardscomponent-tsx), [`BMPromptOptCardsComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-prompt-opt-info-bmpromptoptcardscomponent-tsx), [`BMPromptOptPanelComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-prompt-opt-info-bmpromptoptpanelcomponent-tsx), [`BMPromptOptTokensComponent.tsx`](components/amazon-bedrock.md#components-amazon-bedrock-prompt-opt-info-bmpromptopttokenscomponent-tsx), [`MessageCards.tsx`](components/aws/cards.md#components-aws-cards-messagecards-tsx), [`AVGUsoLocInstEC2ViewUsoPorRegionComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-ec2-graficos-avgusolocinstec2viewusoporregioncomponent-tsx), [`AVGUsoLocInstRdsMariaDBViewUsoPorRegionComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mariadb-graficos-avgusolocinstrdsmariadbviewusoporregioncomponent-tsx), [`AVGUsoLocInstRdsMySQLViewUsoPorRegionComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-mysql-graficos-avgusolocinstrdsmysqlviewusoporregioncomponent-tsx), [`AVGUsoLocInstRdsOracleViewUsoPorRegionComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-oracle-graficos-avgusolocinstrdsoracleviewusoporregioncomponent-tsx), [`AVGUsoLocInstRdsPgViewUsoPorRegionComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-pg-graficos-avgusolocinstrdspgviewusoporregioncomponent-tsx), [`AVGUsoLocInstRdsSQLServerViewUsoPorRegionComponent.tsx`](components/aws/vista-prom-loc.md#components-aws-vista-prom-loc-avg-uso-loc-inst-rds-sqlserver-graficos-avgusolocinstrdssqlserverviewusoporregioncomponent-tsx), [`MessageCards.tsx`](components/azure/cards.md#components-azure-cards-messagecards-tsx), [`AverageByLocationMetricsComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-average-by-location-grafico-averagebylocationmetricscomponent-tsx), [`AverageByLocationCardsComponent.tsx`](components/azure/vista-funciones.md#components-azure-vista-funciones-average-by-location-info-averagebylocationcardscomponent-tsx), [`InterCloudConfigComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intercloud-intercloudconfigcomponent-tsx), [`InterCloudServiceSelectionComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intercloud-intercloudserviceselectioncomponent-tsx), [`InterCloudVmCardsComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intercloud-virtual-machines-info-intercloudvmcardscomponent-tsx), [`InterCloudVmProjectionComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intercloud-virtual-machines-info-intercloudvmprojectioncomponent-tsx), [`IntraCloudConfigComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx), [`IntraCloudServiceSelectionComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-intracloudserviceselectioncomponent-tsx), [`IntraCloudBillingCardsComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-billing-info-intracloudbillingcardscomponent-tsx), [`IntraCloudComputeCardsByTenantComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-compute-info-intracloudcomputecardsbytenantcomponent-tsx), [`IntraCloudAwsStorageCardsByTenantComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-aws-info-intracloudawsstoragecardsbytenantcomponent-tsx), [`IntraCloudAzureStorageCardsByTenantComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-azure-info-intracloudazurestoragecardsbytenantcomponent-tsx), [`IntraCloudGcpStorageCardsByTenantComponent.tsx`](components/comp-cloud.md#components-comp-cloud-intracloud-storage-gcp-info-intracloudgcpstoragecardsbytenantcomponent-tsx), [`MainViewMultiCloudComponent.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-mainviewmulticloudcomponent-tsx), [`MultiCloudComponent.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-multicloudcomponent-tsx), [`MultiCloudTagFilter.tsx`](components/comp-cloud.md#components-comp-cloud-multicloud-filters-multicloudtagfilter-tsx), [`AverageByLocationCardsGCPComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-uso-costo-por-localizacion-graficos-averagebylocationcardsgcpcomponent-tsx), [`AvgUsageByLocationComponent.tsx`](components/gcp/vista-funciones.md#components-gcp-vista-funciones-uso-costo-por-localizacion-graficos-avgusagebylocationcomponent-tsx), [`CloudSqlMetricsCardComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-cloudsql-info-cloudsqlmetricscardcomponent-tsx), [`GkeMetricsCardComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-clusters-gke-info-gkemetricscardcomponent-tsx), [`ComputeEngineMetricsCardsComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-compute-engine-info-computeenginemetricscardscomponent-tsx), [`InstanceGroupsMetricsCardsComponent.tsx`](components/gcp/vista-recursos.md#components-gcp-vista-recursos-instance-groups-info-instancegroupsmetricscardscomponent-tsx), [`SearchableSelect.tsx`](components/general_alertas.md#components-general-alertas-searchableselect-tsx), [`AdvisorCategoriesFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-advisorcategoriesfiltercomponent-tsx), [`AdvisorStatusFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-advisorstatusfiltercomponent-tsx), [`AsgFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-asgfiltercomponent-tsx), [`AsgInstancesFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-asginstancesfiltercomponent-tsx), [`BedrockModelsFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-bedrockmodelsfiltercomponent-tsx), [`Ec2AutoscalingGroupsFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-ec2autoscalinggroupsfiltercomponent-tsx), [`Ec2MetricLabelFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-ec2metriclabelfiltercomponent-tsx), [`EksAsgFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-eksasgfiltercomponent-tsx), [`EksAsgInstancesFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-eksasginstancesfiltercomponent-tsx), [`EksFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-eksfiltercomponent-tsx), [`EventsTypeFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-eventstypefiltercomponent-tsx), [`InstancesFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-instancesfiltercomponent-tsx), [`LoadbalancersV2FilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-loadbalancersv2filtercomponent-tsx), [`MetricsFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-metricsfiltercomponent-tsx), [`MetricsRDSFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-metricsrdsfiltercomponent-tsx), [`NatGatewaysFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-natgatewaysfiltercomponent-tsx), [`RegionFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-regionfiltercomponent-tsx), [`TagsFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-tagsfiltercomponent-tsx), [`TagsFilterComponent_Aws.tsx`](components/general_aws.md#components-general-aws-filters-tagsfiltercomponent-aws-tsx), [`UnusedLoadbalancersV2FilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-unusedloadbalancersv2filtercomponent-tsx), [`UnusedNatGatewaysFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-unusednatgatewaysfiltercomponent-tsx), [`UnusedRoute53FilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-unusedroute53filtercomponent-tsx), [`VariationMetricFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-variationmetricfiltercomponent-tsx), [`VariationResourcesFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-variationresourcesfiltercomponent-tsx), [`VariationServiceFilterComponent.tsx`](components/general_aws.md#components-general-aws-filters-variationservicefiltercomponent-tsx), [`AppGwFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-appgwfiltercomponent-tsx), [`CategoryFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-categoryfiltercomponent-tsx), [`DeploymentOperationsFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-deploymentoperationsfiltercomponent-tsx), [`FoundryModelsFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-foundrymodelsfiltercomponent-tsx), [`ImpactFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-impactfiltercomponent-tsx), [`InstancesFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-instancesfiltercomponent-tsx), [`InstancesFilterComponentV2.tsx`](components/general_azure.md#components-general-azure-filters-instancesfiltercomponentv2-tsx), [`MetricsFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-metricsfiltercomponent-tsx), [`RegionFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-regionfiltercomponent-tsx), [`ResourceGroupsFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-resourcegroupsfiltercomponent-tsx), [`ResourceTypesFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-resourcetypesfiltercomponent-tsx), [`ServiceFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-servicefiltercomponent-tsx), [`StorageAccountsFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-storageaccountsfiltercomponent-tsx), [`SubscriptionsFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-subscriptionsfiltercomponent-tsx), [`SubscriptionsFilterComponentV2.tsx`](components/general_azure.md#components-general-azure-filters-subscriptionsfiltercomponentv2-tsx), [`TagsFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-tagsfiltercomponent-tsx), [`TrafficManagerFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-trafficmanagerfiltercomponent-tsx), [`UnusedAppGwFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-unusedappgwfiltercomponent-tsx), [`UnusedLoadbalancerFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-unusedloadbalancerfiltercomponent-tsx), [`UnusedTrafficManagerFilter.tsx`](components/general_azure.md#components-general-azure-filters-unusedtrafficmanagerfilter-tsx), [`UnusedVmFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-unusedvmfiltercomponent-tsx), [`UnusedVmssFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-unusedvmssfiltercomponent-tsx), [`VmFilterComponent.tsx`](components/general_azure.md#components-general-azure-filters-vmfiltercomponent-tsx), [`MultiTenantProjectsFilterComponent.tsx`](components/general_comp_cloud.md#components-general-comp-cloud-filters-multitenantprojectsfiltercomponent-tsx), [`MultiTenantResourceFilterComponent.tsx`](components/general_comp_cloud.md#components-general-comp-cloud-filters-multitenantresourcefiltercomponent-tsx), [`MultiTenantResourceGroupFilterComponent.tsx`](components/general_comp_cloud.md#components-general-comp-cloud-filters-multitenantresourcegroupfiltercomponent-tsx), [`MultiTenantServiceFilterComponent.tsx`](components/general_comp_cloud.md#components-general-comp-cloud-filters-multitenantservicefiltercomponent-tsx), [`MultiTenantSubscriptionsFilterComponent.tsx`](components/general_comp_cloud.md#components-general-comp-cloud-filters-multitenantsubscriptionsfiltercomponent-tsx), [`MultiTenantTagsFilterComponent.tsx`](components/general_comp_cloud.md#components-general-comp-cloud-filters-multitenanttagsfiltercomponent-tsx), [`DatabaseTypeFilterComponent.tsx`](components/general_gcp.md#components-general-gcp-filters-databasetypefiltercomponent-tsx), [`EstadoUsoFilterComponent.tsx`](components/general_gcp.md#components-general-gcp-filters-estadousofiltercomponent-tsx), [`FilestoreTierFilterComponent.tsx`](components/general_gcp.md#components-general-gcp-filters-filestoretierfiltercomponent-tsx), [`ProjectsFilterComponent.tsx`](components/general_gcp.md#components-general-gcp-filters-projectsfiltercomponent-tsx), [`RecommenderCategoriesFilterComponent.tsx`](components/general_gcp.md#components-general-gcp-filters-recommendercategoriesfiltercomponent-tsx), [`RecommenderPriorityFilterComponent.tsx`](components/general_gcp.md#components-general-gcp-filters-recommenderpriorityfiltercomponent-tsx), [`RegionsFilterComponent.tsx`](components/general_gcp.md#components-general-gcp-filters-regionsfiltercomponent-tsx), [`ResourcesFilterComponent.tsx`](components/general_gcp.md#components-general-gcp-filters-resourcesfiltercomponent-tsx), [`ServiceFilterComponent.tsx`](components/general_gcp.md#components-general-gcp-filters-servicefiltercomponent-tsx), [`StorageClassFilterComponent.tsx`](components/general_gcp.md#components-general-gcp-filters-storageclassfiltercomponent-tsx), [`TagsFilterComponent.tsx`](components/general_gcp.md#components-general-gcp-filters-tagsfiltercomponent-tsx), [`VertexModelsFilterComponent.tsx`](components/general_gcp.md#components-general-gcp-filters-vertexmodelsfiltercomponent-tsx), [`CentroDeCostoFilterComponent.tsx`](components/general_presupuesto.md#components-general-presupuesto-filters-centrodecostofiltercomponent-tsx), [`CloudFilterComponent.tsx`](components/general_presupuesto.md#components-general-presupuesto-filters-cloudfiltercomponent-tsx), [`GcpVertexComparisonCandidateConfidenceComponent.tsx`](components/google-vertex.md#components-google-vertex-comparacion-info-gcpvertexcomparisoncandidateconfidencecomponent-tsx), [`GcpVertexComparisonCardsComponent.tsx`](components/google-vertex.md#components-google-vertex-comparacion-info-gcpvertexcomparisoncardscomponent-tsx), [`GcpVertexComparisonCostBridgeComponent.tsx`](components/google-vertex.md#components-google-vertex-comparacion-info-gcpvertexcomparisoncostbridgecomponent-tsx), [`GcpVertexComparisonModelPanelsComponent.tsx`](components/google-vertex.md#components-google-vertex-comparacion-info-gcpvertexcomparisonmodelpanelscomponent-tsx), [`GcpVertexComparisonTokenMixComponent.tsx`](components/google-vertex.md#components-google-vertex-comparacion-info-gcpvertexcomparisontokenmixcomponent-tsx), [`GcpVertexComparisonViewComponent.tsx`](components/google-vertex.md#components-google-vertex-comparacion-info-gcpvertexcomparisonviewcomponent-tsx), [`GcpVertexComparisonEndpointsColumns.tsx`](components/google-vertex.md#components-google-vertex-comparacion-table-gcpvertexcomparisonendpointscolumns-tsx), [`MainViewCostOptimizationGcpVertexComponent.tsx`](components/google-vertex.md#components-google-vertex-costo-optimizacion-mainviewcostoptimizationgcpvertexcomponent-tsx), [`COGcpVertexCardsComponent.tsx`](components/google-vertex.md#components-google-vertex-costo-optimizacion-vertex-models-info-cogcpvertexcardscomponent-tsx), [`VXPromptOptCardsComponent.tsx`](components/google-vertex.md#components-google-vertex-prompt-opt-info-vxpromptoptcardscomponent-tsx), [`VXPromptOptPanelComponent.tsx`](components/google-vertex.md#components-google-vertex-prompt-opt-info-vxpromptoptpanelcomponent-tsx), [`VXPromptOptTokensComponent.tsx`](components/google-vertex.md#components-google-vertex-prompt-opt-info-vxpromptopttokenscomponent-tsx), [`AFComparisonCandidateConfidenceComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-info-afcomparisoncandidateconfidencecomponent-tsx), [`AFComparisonCardsComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-info-afcomparisoncardscomponent-tsx), [`AFComparisonCostBridgeComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-info-afcomparisoncostbridgecomponent-tsx), [`AFComparisonModelPanelsComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-info-afcomparisonmodelpanelscomponent-tsx), [`AFComparisonTokenMixComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-info-afcomparisontokenmixcomponent-tsx), [`AFComparisonViewComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-info-afcomparisonviewcomponent-tsx), [`AFComparisonDeploymentsColumns.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-comparacion-table-afcomparisondeploymentscolumns-tsx), [`MainViewCostOptimizationComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-costo-optimizacion-mainviewcostoptimizationcomponent-tsx), [`COFoundationCardsComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-costo-optimizacion-foundation-models-info-cofoundationcardscomponent-tsx), [`FMPromptOptCardsComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-prompt-opt-info-fmpromptoptcardscomponent-tsx), [`FMPromptOptPanelComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-prompt-opt-info-fmpromptoptpanelcomponent-tsx), [`FMPromptOptTokensComponent.tsx`](components/microsoft-foundry.md#components-microsoft-foundry-prompt-opt-info-fmpromptopttokenscomponent-tsx), [`MainViewCostOptimizationOpenAIComponent.tsx`](components/open-ia.md#components-open-ia-costo-optimizacion-mainviewcostoptimizationopenaicomponent-tsx), [`COOpenAICardsComponent.tsx`](components/open-ia.md#components-open-ia-costo-optimizacion-foundation-models-info-coopenaicardscomponent-tsx), [`CloudAccountsEditor.tsx`](components/perfilamiento.md#components-perfilamiento-cloudaccountseditor-tsx), [`EditUserModal.tsx`](components/perfilamiento.md#components-perfilamiento-editusermodal-tsx), [`ClientSelectorComponent.tsx`](components/profile.md#components-profile-clientselectorcomponent-tsx), [`ConnectorsManagerComponent.tsx`](components/profile.md#components-profile-connectorsmanagercomponent-tsx), [`MainProfileComponent.tsx`](components/profile.md#components-profile-mainprofilecomponent-tsx), [`SelectAIServiceComponent.tsx`](components/profile.md#components-profile-selectaiservicecomponent-tsx), [`SelectCloudComponent.tsx`](components/profile.md#components-profile-selectcloudcomponent-tsx), [`JiraConnectorFormComponent.tsx`](components/profile.md#components-profile-connectors-jiraconnectorformcomponent-tsx), [`ServiceNowConnectorFormComponent.tsx`](components/profile.md#components-profile-connectors-servicenowconnectorformcomponent-tsx), [`WorkingHoursCards.tsx`](components/shared.md#components-shared-working-hours-workinghourscards-tsx), [`accordion.tsx`](components/ui.md#components-ui-accordion-tsx), [`alert-dialog.tsx`](components/ui.md#components-ui-alert-dialog-tsx), [`alert.tsx`](components/ui.md#components-ui-alert-tsx), [`badge.tsx`](components/ui.md#components-ui-badge-tsx), [`button.tsx`](components/ui.md#components-ui-button-tsx), [`card.tsx`](components/ui.md#components-ui-card-tsx), [`checkbox.tsx`](components/ui.md#components-ui-checkbox-tsx), [`command.tsx`](components/ui.md#components-ui-command-tsx), [`dialog.tsx`](components/ui.md#components-ui-dialog-tsx), [`dropdown-menu.tsx`](components/ui.md#components-ui-dropdown-menu-tsx), [`input.tsx`](components/ui.md#components-ui-input-tsx), [`label.tsx`](components/ui.md#components-ui-label-tsx), [`popover.tsx`](components/ui.md#components-ui-popover-tsx), [`progress.tsx`](components/ui.md#components-ui-progress-tsx), [`scroll-area.tsx`](components/ui.md#components-ui-scroll-area-tsx), [`select.tsx`](components/ui.md#components-ui-select-tsx), [`separator.tsx`](components/ui.md#components-ui-separator-tsx), [`sheet.tsx`](components/ui.md#components-ui-sheet-tsx), [`sidebar.tsx`](components/ui.md#components-ui-sidebar-tsx), [`skeleton.tsx`](components/ui.md#components-ui-skeleton-tsx), [`slider.tsx`](components/ui.md#components-ui-slider-tsx), [`switch.tsx`](components/ui.md#components-ui-switch-tsx), [`table.tsx`](components/ui.md#components-ui-table-tsx), [`tabs.tsx`](components/ui.md#components-ui-tabs-tsx), [`textarea.tsx`](components/ui.md#components-ui-textarea-tsx), [`tooltip.tsx`](components/ui.md#components-ui-tooltip-tsx)

---

<a id="lib-workinghours-ts"></a>
## `lib/workingHours.ts`

**Utilidades**

Utilidades de la familia "Horario hábil vs no hábil": URLs del contrato canónico, formato de horas en Santiago
y lectura de métricas por horario. El formato de cada métrica sale del registro único de `@/lib/consumption`.

Exporta:

- función `workingHoursUrl` `(cloud: WorkingHoursCloud, resource: string, action: WorkingHoursAction, params: QueryParams): string` — `/api/{cloud}/bridge/{cloud}/working-hours/{resource}/{action}?{params}` (el bridge lo envía a `/api/{cloud}/working-hours/...`).
- constante `SCHEDULES` = `['business_hours', 'non_business_hours']`
- constante `SCHEDULE_LABELS` = `{ business_hours: 'Horario Hábil', non_business_hours: 'Horario No Hábil', }`
- constante `SCHEDULE_TIME_ZONE` = `'America/Santiago'` — El horario hábil se define en Santiago: las horas se muestran siempre en esa zona, sin importar el navegador.
- función `formatSantiagoTime` `(value: string | number | Date): string`
- función `getWorkingHoursMetric` `(name: string, overrides?: Record<string, MetricDefinition>): MetricDefinition` — Formato de una métrica: primero lo propio del recurso (`overrides`, por clave normalizada), luego el registro común.
- función `sortMetrics` `(names: Iterable<string>): string[]` — Ordena métricas con CPU primero y el resto alfabético.
- función `findSummary` `(items: WorkingHoursSummaryItem[], metric: string, schedule: ScheduleType): WorkingHoursSummaryItem | undefined`
- tipo `OverallTrend` = `ScheduleType | 'balanced'`
- función `overallTrend` `(resource: WorkingHoursResource): OverallTrend` — Tendencia global del recurso: el horario que domina en más métricas (los empates de métrica no suman).

- API: `/api/{…}/bridge/{…}/working-hours/{…}/{…}`
- Usa: [`consumption.ts`](#lib-consumption-ts), [`workingHours.ts`](tipos.md#interfaces-workinghours-ts)
- Usado por: [`WorkingHoursCards.tsx`](components/shared.md#components-shared-working-hours-workinghourscards-tsx), [`WorkingHoursCharts.tsx`](components/shared.md#components-shared-working-hours-workinghourscharts-tsx), [`WorkingHoursDetailModal.tsx`](components/shared.md#components-shared-working-hours-workinghoursdetailmodal-tsx), [`WorkingHoursTable.tsx`](components/shared.md#components-shared-working-hours-workinghourstable-tsx), [`WorkingHoursView.tsx`](components/shared.md#components-shared-working-hours-workinghoursview-tsx)

