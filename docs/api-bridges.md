# Route handlers de `app/api/` (bridges a las APIs)

[← Índice](README.md)

Route handlers del servidor: autenticación (login, 2FA, recuperación de contraseña, cambio de empresa activa, sesión) y los bridges hacia cada API (`/api/<servicio>/bridge/[...path]`), además de perfilamiento, licencias on-premise y empresas.

| Ruta | Archivo | Tipo |
|---|---|---|
| `/api/alertas/bridge/[...path]` | [`api/alertas/bridge/[...path]/route.ts`](#app-api-alertas-bridge-path-route-ts) |  |
| `/api/auth/forgot-password` | [`api/auth/forgot-password/route.ts`](#app-api-auth-forgot-password-route-ts) | POST |
| `/api/auth/get-token` | [`api/auth/get-token/route.ts`](#app-api-auth-get-token-route-ts) | POST |
| `/api/auth/login` | [`api/auth/login/route.ts`](#app-api-auth-login-route-ts) | POST |
| `/api/auth/logout` | [`api/auth/logout/route.ts`](#app-api-auth-logout-route-ts) | POST |
| `/api/auth/me` | [`api/auth/me/route.ts`](#app-api-auth-me-route-ts) | GET |
| `/api/auth/reset-password` | [`api/auth/reset-password/route.ts`](#app-api-auth-reset-password-route-ts) | POST |
| `/api/auth/swap-client-context` | [`api/auth/swap-client-context/route.ts`](#app-api-auth-swap-client-context-route-ts) | POST |
| `/api/auth/validate-reset-token` | [`api/auth/validate-reset-token/route.ts`](#app-api-auth-validate-reset-token-route-ts) | POST |
| `/api/auth/verify-2fa` | [`api/auth/verify-2fa/route.ts`](#app-api-auth-verify-2fa-route-ts) | POST |
| `/api/aws/bridge/[...path]` | [`api/aws/bridge/[...path]/route.ts`](#app-api-aws-bridge-path-route-ts) |  |
| `/api/azure/bridge/[...path]` | [`api/azure/bridge/[...path]/route.ts`](#app-api-azure-bridge-path-route-ts) |  |
| `/api/comparison-cloud/bridge/[...path]` | [`api/comparison-cloud/bridge/[...path]/route.ts`](#app-api-comparison-cloud-bridge-path-route-ts) |  |
| `/api/connector/bridge/[...path]` | [`api/connector/bridge/[...path]/route.ts`](#app-api-connector-bridge-path-route-ts) |  |
| `/api/debug-newrelic` | [`api/debug-newrelic/route.ts`](#app-api-debug-newrelic-route-ts) | GET |
| `/api/empresas-sii` | [`api/empresas-sii/route.ts`](#app-api-empresas-sii-route-ts) | GET |
| `/api/gcp/bridge/[...path]` | [`api/gcp/bridge/[...path]/route.ts`](#app-api-gcp-bridge-path-route-ts) |  |
| `/api/health` | [`api/health/route.ts`](#app-api-health-route-ts) | GET |
| `/api/op-licencias/comparar` | [`api/op-licencias/comparar/route.ts`](#app-api-op-licencias-comparar-route-ts) | POST |
| `/api/op-licencias/estado` | [`api/op-licencias/estado/route.ts`](#app-api-op-licencias-estado-route-ts) | GET |
| `/api/op-licencias/generar` | [`api/op-licencias/generar/route.ts`](#app-api-op-licencias-generar-route-ts) | POST |
| `/api/op-licencias/historial` | [`api/op-licencias/historial/route.ts`](#app-api-op-licencias-historial-route-ts) | GET |
| `/api/op-licencias/partner` | [`api/op-licencias/partner/route.ts`](#app-api-op-licencias-partner-route-ts) | GET |
| `/api/op-licencias/solicitudes` | [`api/op-licencias/solicitudes/route.ts`](#app-api-op-licencias-solicitudes-route-ts) | GET, POST |
| `/api/op-licencias/solicitudes/[id]` | [`api/op-licencias/solicitudes/[id]/route.ts`](#app-api-op-licencias-solicitudes-id-route-ts) | PUT, DELETE |
| `/api/openai/bridge/[...path]` | [`api/openai/bridge/[...path]/route.ts`](#app-api-openai-bridge-path-route-ts) |  |
| `/api/perfilamiento/empresas` | [`api/perfilamiento/empresas/route.ts`](#app-api-perfilamiento-empresas-route-ts) | GET, POST |
| `/api/perfilamiento/empresas/[id]` | [`api/perfilamiento/empresas/[id]/route.ts`](#app-api-perfilamiento-empresas-id-route-ts) | GET, PUT, DELETE |
| `/api/perfilamiento/users` | [`api/perfilamiento/users/route.ts`](#app-api-perfilamiento-users-route-ts) | GET, POST |
| `/api/perfilamiento/users/[id]` | [`api/perfilamiento/users/[id]/route.ts`](#app-api-perfilamiento-users-id-route-ts) | PUT, DELETE |
| `/api/presupuesto/bridge/[...path]` | [`api/presupuesto/bridge/[...path]/route.ts`](#app-api-presupuesto-bridge-path-route-ts) |  |

<a id="app-api-alertas-bridge-path-route-ts"></a>
## `app/api/alertas/bridge/[...path]/route.ts`

**Route handler `/api/alertas/bridge/[...path]` · métodos: —**

Internos:

- constante `ENV_URL` — Las rutas de la API de alertas cuelgan de /alerts
- constante `BASE`
- constante `proxy`

- Usa: [`bridge.ts`](lib.md#lib-bridge-ts), [`bridgePaths.ts`](lib.md#lib-bridgepaths-ts)

---

<a id="app-api-auth-forgot-password-route-ts"></a>
## `app/api/auth/forgot-password/route.ts`

**Route handler `/api/auth/forgot-password` · métodos: POST**

Exporta:

- componente `POST` `async (req: Request)` — 1 hora

Internos:

- constante `TOKEN_EXPIRATION_MS`

- Usa: [`mongodb.ts`](lib.md#lib-mongodb-ts), [`db.ts`](tipos.md#types-db-ts), [`email.ts`](lib.md#lib-email-ts)

Notas de implementación:

- Buscar usuario
- Seguridad: Responder OK para prevenir ataques de enumeración de usuarios
- Generar Token y Expiración
- Guardar el token en la base de datos
- Enviar Correo (el enlace lo construye lib/email.ts)

---

<a id="app-api-auth-get-token-route-ts"></a>
## `app/api/auth/get-token/route.ts`

**Route handler `/api/auth/get-token` · métodos: POST**

Exporta:

- componente `POST` `async (req: Request)`

Internos:

- constante `LoginSchema`

- Variables de entorno: `NODE_ENV`
- Usa: [`mongodb.ts`](lib.md#lib-mongodb-ts), [`auth.ts`](lib.md#lib-auth-ts), [`sessionPayload.ts`](lib.md#lib-sessionpayload-ts), [`db-utils.ts`](lib.md#lib-db-utils-ts), [`db.ts`](tipos.md#types-db-ts), [`cookies.ts`](lib.md#lib-cookies-ts)

Notas de implementación:

- Mismo token que el login real: configuración de nubes y plan desde la empresa (G-06)

---

<a id="app-api-auth-login-route-ts"></a>
## `app/api/auth/login/route.ts`

**Route handler `/api/auth/login` · métodos: POST**

Exporta:

- componente `POST` `async (req: Request)`

Internos:

- constante `logger`
- constante `LoginSchema`
- función `generateCode` `()`

- Usa: [`mongodb.ts`](lib.md#lib-mongodb-ts), [`rateLimit.ts`](lib.md#lib-ratelimit-ts), [`email.ts`](lib.md#lib-email-ts), [`logger.ts`](lib.md#lib-logger-ts)

Notas de implementación:

- `const requestId = crypto.randomUUID();` — ID único para rastrear la petición
- Obtener IP
- Rate limiting
- Parsear body
- Validar datos
- Buscar usuario en DB
- Verificar si la cuenta está activa
- Verificar contraseña
- Generar código 2FA
- Guardar código en DB
- Enviar email
- Decidir si continuar o fallar

---

<a id="app-api-auth-logout-route-ts"></a>
## `app/api/auth/logout/route.ts`

**Route handler `/api/auth/logout` · métodos: POST**

Exporta:

- componente `POST` `async (req: NextRequest)`

- Variables de entorno: `NODE_ENV`
- Usa: [`cookies.ts`](lib.md#lib-cookies-ts)

---

<a id="app-api-auth-me-route-ts"></a>
## `app/api/auth/me/route.ts`

**Route handler `/api/auth/me` · métodos: GET**

Exporta:

- componente `GET` `async ()`

- Tipo interno `SessionUser` = `Omit<User, 'passwordHash'>`
Internos:

- función `dbOf` `(value: unknown): string | null`
- función `accountsOf` `(value: unknown): CloudAccount[]`

- Usa: [`cookies.ts`](lib.md#lib-cookies-ts), [`auth.ts`](lib.md#lib-auth-ts), [`mongodb.ts`](lib.md#lib-mongodb-ts), [`connectors.ts`](lib.md#lib-connectors-ts), [`db.ts`](tipos.md#types-db-ts)

Notas de implementación:

- Conectores de la empresa activa del token (cambia con el swap de admin_global)
- Identidad desde el usuario; la configuración de nubes desde el token, que se arma con la empresa activa (login o swap de admin_global). Así las cuentas que ve el front son las mismas que validan las APIs (G-06): las copias por usuario de `<cloud>_accounts` pueden tener otros IDs.
- Sólo existen en multi-tenant; en single-tenant manda `user_db_<cloud>`.

---

<a id="app-api-auth-reset-password-route-ts"></a>
## `app/api/auth/reset-password/route.ts`

**Route handler `/api/auth/reset-password` · métodos: POST**

Exporta:

- componente `POST` `async (req: Request)`

- Usa: [`mongodb.ts`](lib.md#lib-mongodb-ts), [`db.ts`](tipos.md#types-db-ts)

Notas de implementación:

- Buscar usuario y validar expiración

---

<a id="app-api-auth-swap-client-context-route-ts"></a>
## `app/api/auth/swap-client-context/route.ts`

**Route handler `/api/auth/swap-client-context` · métodos: POST**

Exporta:

- componente `POST` `async (request: Request)`

Internos:

- constante `logger`
- clase `AccountNotAllowedError`
- función `resolveCloudDb` `(company: Empresa, cloud: CloudProvider, requestedAccountId: unknown): string | null` — Resuelve la BD de una nube SIEMPRE desde la empresa destino. El navegador sólo puede elegir una cuenta por su ID; nunca envía nombres de BD.

- Usa: [`cookies.ts`](lib.md#lib-cookies-ts), [`auth.ts`](lib.md#lib-auth-ts), [`db-utils.ts`](lib.md#lib-db-utils-ts), [`sessionPayload.ts`](lib.md#lib-sessionpayload-ts), [`logger.ts`](lib.md#lib-logger-ts), [`cloudAccounts.ts`](lib.md#lib-cloudaccounts-ts), [`index.ts`](tipos.md#types-index-ts), [`db.ts`](tipos.md#types-db-ts)

Notas de implementación:

- _resolveCloudDb_: Single-tenant: la única BD posible es la de la empresa.
- Sólo admin_global elige la empresa; el resto queda en la de su propio token.
- DB FINAL POR NUBE
- NUEVO PAYLOAD
- Los tokens antiguos traían `connectors`; ya no viajan en el JWT (se leen por empresa)
- Flags, cuentas y BD activa SIEMPRE desde la empresa destino (lib/sessionPayload, G-06). Si se heredaran del token anterior, un admin_global podría arrastrar un `multi_tenant` de otra empresa y quedar con cuentas que no le corresponden.

---

<a id="app-api-auth-validate-reset-token-route-ts"></a>
## `app/api/auth/validate-reset-token/route.ts`

**Route handler `/api/auth/validate-reset-token` · métodos: POST**

Exporta:

- componente `POST` `async (req: Request)`

- Usa: [`mongodb.ts`](lib.md#lib-mongodb-ts), [`db.ts`](tipos.md#types-db-ts)

---

<a id="app-api-auth-verify-2fa-route-ts"></a>
## `app/api/auth/verify-2fa/route.ts`

**Route handler `/api/auth/verify-2fa` · métodos: POST**

Exporta:

- componente `POST` `async (req: Request)`

Internos:

- constante `VerifySchema`

- Usa: [`mongodb.ts`](lib.md#lib-mongodb-ts), [`auth.ts`](lib.md#lib-auth-ts), [`sessionPayload.ts`](lib.md#lib-sessionpayload-ts), [`db.ts`](tipos.md#types-db-ts)

Notas de implementación:

- NUEVA LÓGICA DE VERIFICACIÓN DE ESTADO ACTIVO Si el campo is_active es explícitamente `false`, denegar el acceso.
- `{ status: 403 }` — 403 Forbidden
- Obtener datos de cliente asociado a usuario
- Configuración de nubes y plan desde la empresa (fuente de verdad, G-06); del usuario sólo la identidad

---

<a id="app-api-aws-bridge-path-route-ts"></a>
## `app/api/aws/bridge/[...path]/route.ts`

**Route handler `/api/aws/bridge/[...path]` · métodos: —**

Internos:

- constante `proxy`

- Usa: [`bridge.ts`](lib.md#lib-bridge-ts), [`bridgePaths.ts`](lib.md#lib-bridgepaths-ts)

---

<a id="app-api-azure-bridge-path-route-ts"></a>
## `app/api/azure/bridge/[...path]/route.ts`

**Route handler `/api/azure/bridge/[...path]` · métodos: —**

Internos:

- constante `proxy`

- Usa: [`bridge.ts`](lib.md#lib-bridge-ts), [`bridgePaths.ts`](lib.md#lib-bridgepaths-ts)

---

<a id="app-api-comparison-cloud-bridge-path-route-ts"></a>
## `app/api/comparison-cloud/bridge/[...path]/route.ts`

**Route handler `/api/comparison-cloud/bridge/[...path]` · métodos: —**

Internos:

- constante `proxy`

- Usa: [`bridge.ts`](lib.md#lib-bridge-ts), [`bridgePaths.ts`](lib.md#lib-bridgepaths-ts)

---

<a id="app-api-connector-bridge-path-route-ts"></a>
## `app/api/connector/bridge/[...path]/route.ts`

**Route handler `/api/connector/bridge/[...path]` · métodos: —**

Internos:

- constante `proxy`

- Usa: [`bridge.ts`](lib.md#lib-bridge-ts), [`bridgePaths.ts`](lib.md#lib-bridgepaths-ts)

---

<a id="app-api-debug-newrelic-route-ts"></a>
## `app/api/debug-newrelic/route.ts`

**Route handler `/api/debug-newrelic` · métodos: GET**

Exporta:

- componente `GET` `async ()`

- Variables de entorno: `NEXT_RUNTIME`, `NODE_ENV`

---

<a id="app-api-empresas-sii-route-ts"></a>
## `app/api/empresas-sii/route.ts`

**Route handler `/api/empresas-sii` · métodos: GET**

Exporta:

- componente `GET` `async (req: NextRequest)` — ── GET — Buscar empresa en padrón SII ──────────────────────────────────────── ?rut=76021154-0  → búsqueda exacta por RUT ?q=bracace       → búsqueda por nombre, devuelve top 10

- Usa: [`mongodb.ts`](lib.md#lib-mongodb-ts), [`authUtils.ts`](lib.md#lib-authutils-ts)

Notas de implementación:

- ── Búsqueda exacta por RUT ───────────────────────────────────────────────
- ── Búsqueda por nombre — top 10 ──────────────────────────────────────────

---

<a id="app-api-gcp-bridge-path-route-ts"></a>
## `app/api/gcp/bridge/[...path]/route.ts`

**Route handler `/api/gcp/bridge/[...path]` · métodos: —**

Internos:

- constante `proxy`

- Usa: [`bridge.ts`](lib.md#lib-bridge-ts), [`bridgePaths.ts`](lib.md#lib-bridgepaths-ts)

---

<a id="app-api-health-route-ts"></a>
## `app/api/health/route.ts`

**Route handler `/api/health` · métodos: GET**

Exporta:

- componente `GET` `async ()`

---

<a id="app-api-op-licencias-comparar-route-ts"></a>
## `app/api/op-licencias/comparar/route.ts`

**Route handler `/api/op-licencias/comparar` · métodos: POST**

Exporta:

- componente `POST` `async (req: NextRequest)`

Interfaz `CSVUser`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string` | no | — |
| `email` | `string` | no | — |
| `empresa` | `string` | no | — |
| `fecha_solicitud` | `string` | no | — |

Interfaz `LicenciaUsuario`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `string` | no | — |
| `email` | `string` | no | — |
| `empresa` | `string` | no | — |
| `starts` | `string` | no | — |
| `expires` | `string` | no | — |

Interfaz `OpLicencia`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `partner` | `string` | no | — |
| `usuarios` | `LicenciaUsuario[]` | no | — |
| `generado_at` | `Date` | no | — |

- Usa: [`mongodb.ts`](lib.md#lib-mongodb-ts), [`authUtils.ts`](lib.md#lib-authutils-ts)

Notas de implementación:

- Buscar el último .lic generado para este partner
- Calcular estado por usuario
- KPIs
- Usuarios vigentes que deben incluirse automáticamente en el nuevo .lic

---

<a id="app-api-op-licencias-estado-route-ts"></a>
## `app/api/op-licencias/estado/route.ts`

**Route handler `/api/op-licencias/estado` · métodos: GET**

Exporta:

- componente `GET` `async (req: NextRequest)` — ── GET — Estado actual de todos los partners ─────────────────────────────────

Internos:

- función `calcularEstadoUC` `(uc: { type: string; expires: string | null; }): 'activa' | 'por_vencer' | 'vencida' | 'perpetua'` — ── Helpers ───────────────────────────────────────────────────────────────────

- Usa: [`mongodb.ts`](lib.md#lib-mongodb-ts), [`authUtils.ts`](lib.md#lib-authutils-ts)

Notas de implementación:

- ── Última licencia por partner ───────────────────────────────────────────
- ── Partners con solicitud pendiente sin licencia ─────────────────────────
- ── Calcular resumen por partner ──────────────────────────────────────────

---

<a id="app-api-op-licencias-generar-route-ts"></a>
## `app/api/op-licencias/generar/route.ts`

**Route handler `/api/op-licencias/generar` · métodos: POST**

Exporta:

- componente `POST` `async (req: Request)` — ─── Handler ──────────────────────────────────────────────────────────────────

Interfaz `ComputeUnitInput` — ─── Tipos ────────────────────────────────────────────────────────────────────:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `'aws' \| 'azure' \| 'gcp'` | no | — |
| `db` | `string` | no | — |
| `rut` | `string` | no | — |
| `cliente` | `string` | no | — |
| `alias` | `string` | no | — |
| `type` | `'subscription' \| 'perpetual'` | no | — |
| `starts` | `string` | no | — |
| `expires` | `string \| null` | no | — |
| `fingerprint_cliente` | `string \| null` | sí | — |

Interfaz `GenerarLicenciaBody`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `partner` | `string` | no | — |
| `rut` | `string` | no | — |
| `solicitante` | `string` | no | — |
| `fingerprint` | `string` | no | — |
| `compute_units` | `ComputeUnitInput[]` | no | — |
| `solicitudes_ids` | `string[]` | sí | — |

Interfaz `LicGenerado` — Resultado de un .lic generado:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `tipo` | `'subscription' \| 'perpetual'` | no | — |
| `nombre` | `string` | no | nombre descriptivo para el archivo |
| `cliente` | `string` | no | a quién pertenece |
| `rut_cliente` | `string` | no | — |
| `lic_content` | `string` | no | — |
| `lic_hash` | `string` | no | — |
| `compute_units` | `object[]` | no | — |

Internos:

- función `calcularUcFp` `(rutPartner: string, partner: string, rutCliente: string, cliente: string, db: string): string` — ─── Helpers ──────────────────────────────────────────────────────────────────
- función `firmarRSA` `(data: string, privateKeyPem: string): string`
- función `calcularHash` `(content: string): string`
- función `obtenerClavePrivada` `(): string | null`
- función `slugify` `(str: string): string`
- función `generarLicContent` `(payload: object, privateKey: string): { licContent: string; licHash: string; sig: string }`

- Variables de entorno: `INTAC_PRIVATE_KEY`
- Usa: [`auth.ts`](lib.md#lib-auth-ts), [`mongodb.ts`](lib.md#lib-mongodb-ts)

Notas de implementación:

- ── 1. Validar sesión y rol ───────────────────────────────────────────────
- ── 2. Leer y validar body ────────────────────────────────────────────────
- ── 3. Obtener clave privada ──────────────────────────────────────────────
- ── 4. Separar UCs por tipo ───────────────────────────────────────────────
- Agrupar perpetuos por cliente (rut)
- ── 5. Generar .lic de suscripciones (si hay) ─────────────────────────────
- variables necesarias para construir nombre del archivo suscripción
- suscripción
- ── 6. Generar .lic por cada cliente perpetuo ─────────────────────────────
- El fingerprint del perpetuo viene de la UC
- `partner: nombreCliente,` — el cliente perpetuo es el "partner" de su propio .lic
- `fingerprint: fpCliente,` — fingerprint del servidor del cliente
- variables necesarias para construir nombre del archivo perpetuo
- perpetuo
- ── 7. Marcar solicitudes como procesadas ─────────────────────────────────
- ── 8. Responder ──────────────────────────────────────────────────────────
- `lics: licsGenerados,` — array de .lic generados

---

<a id="app-api-op-licencias-historial-route-ts"></a>
## `app/api/op-licencias/historial/route.ts`

**Route handler `/api/op-licencias/historial` · métodos: GET**

Exporta:

- componente `GET` `async (req: NextRequest)`

- Usa: [`mongodb.ts`](lib.md#lib-mongodb-ts), [`authUtils.ts`](lib.md#lib-authutils-ts)

---

<a id="app-api-op-licencias-partner-route-ts"></a>
## `app/api/op-licencias/partner/route.ts`

**Route handler `/api/op-licencias/partner` · métodos: GET**

Exporta:

- componente `GET` `async (req: NextRequest)`

- Usa: [`mongodb.ts`](lib.md#lib-mongodb-ts), [`authUtils.ts`](lib.md#lib-authutils-ts)

Notas de implementación:

- ── Buscar en licencias primero ───────────────────────────────────────────
- ── Si no tiene licencia, buscar en solicitudes ────────────────────────────
- ── Datos base del partner ────────────────────────────────────────────────
- ── Solicitudes pendientes ────────────────────────────────────────────────

---

<a id="app-api-op-licencias-solicitudes-id-route-ts"></a>
## `app/api/op-licencias/solicitudes/[id]/route.ts`

**Route handler `/api/op-licencias/solicitudes/[id]` · métodos: PUT, DELETE**

Exporta:

- componente `PUT` `async (req: NextRequest, { params }: { params: { id: string } })` — ── PUT — Actualizar estado ───────────────────────────────────────────────────
- componente `DELETE` `async (req: NextRequest, { params }: { params: { id: string } })` — ── DELETE — Eliminar solicitud ───────────────────────────────────────────────

- Usa: [`mongodb.ts`](lib.md#lib-mongodb-ts), [`authUtils.ts`](lib.md#lib-authutils-ts)

---

<a id="app-api-op-licencias-solicitudes-route-ts"></a>
## `app/api/op-licencias/solicitudes/route.ts`

**Route handler `/api/op-licencias/solicitudes` · métodos: GET, POST**

Exporta:

- componente `GET` `async (req: NextRequest)` — ── GET — Listar solicitudes ──────────────────────────────────────────────────
- componente `POST` `async (req: NextRequest)` — ── POST — Guardar solicitud ──────────────────────────────────────────────────

Interfaz `ComputeUnitInput` — ── Tipos ─────────────────────────────────────────────────────────────────────:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `'aws' \| 'azure' \| 'gcp'` | no | — |
| `db` | `string` | no | — |
| `rut` | `string` | no | — |
| `cliente` | `string` | no | — |
| `alias` | `string` | no | — |
| `type` | `'subscription' \| 'perpetual'` | no | — |
| `starts` | `string` | no | — |
| `expires` | `string \| null` | no | — |

- Usa: [`mongodb.ts`](lib.md#lib-mongodb-ts), [`authUtils.ts`](lib.md#lib-authutils-ts)

Notas de implementación:

- _POST_: ── Validaciones ──────────────────────────────────────────────────────────
- _POST_: ── Verificar si ya existe solicitud pendiente para este partner ──────────
- _POST_: ── Insertar ──────────────────────────────────────────────────────────────

---

<a id="app-api-openai-bridge-path-route-ts"></a>
## `app/api/openai/bridge/[...path]/route.ts`

**Route handler `/api/openai/bridge/[...path]` · métodos: —**

Internos:

- constante `proxy`

- Variables de entorno: `API_OPENAI_URL`, `API_OPENIA_URL`
- Usa: [`auth.ts`](lib.md#lib-auth-ts), [`bridge.ts`](lib.md#lib-bridge-ts), [`bridgePaths.ts`](lib.md#lib-bridgepaths-ts)

---

<a id="app-api-perfilamiento-empresas-id-route-ts"></a>
## `app/api/perfilamiento/empresas/[id]/route.ts`

**Route handler `/api/perfilamiento/empresas/[id]` · métodos: GET, PUT, DELETE**

Exporta:

- componente `GET` `async (req: NextRequest, { params }: Params)` — RUTA: GET /api/perfilamiento/empresas/[id] (Obtener datos de una sola Licencia)
- componente `PUT` `async (req: NextRequest, { params }: Params)` — RUTA: PUT /api/perfilamiento/empresas/[id] (Edición de Licencia y Conexiones DB)
- componente `DELETE` `async (req: NextRequest, { params }: Params)` — RUTA: DELETE /api/perfilamiento/empresas/[id] (Eliminación de Licencia y Usuarios)

Interfaz `Params` — Define el tipo para los parámetros dinámicos de la ruta:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `params` | `{ id: string }` | no | — |

- Usa: [`mongodb.ts`](lib.md#lib-mongodb-ts), [`authUtils.ts`](lib.md#lib-authutils-ts), [`plans.ts`](lib.md#lib-plans-ts), [`cloudAccounts.ts`](lib.md#lib-cloudaccounts-ts), [`db.ts`](tipos.md#types-db-ts)

Notas de implementación:

- 1. Autorización: Exclusivo para admin_global
- Buscar la empresa por ID
- _PUT_: 1. Autorización: Exclusivo para admin_global
- _PUT_: CAMPOS DE LICENCIA. La configuración por nube se lee dentro del bucle.
- _PUT_: Campos a escribir en la empresa...
- _PUT_: 2. VALIDACIÓN Y ASIGNACIÓN DE PLAN/LÍMITE
- _PUT_: 3. CONFIGURACIÓN POR NUBE (AWS / Azure / GCP) Multi-tenant  -> se persiste `<cloud>_accounts`, conservando los IDs ya existentes y generando `clp-<id>` para las nuevas. Single-tenant -> se persiste `user_db_<cloud>` y se ELIMINA el array con `$unset` (nunca se escribe `undefined`, que el driver serializaría como `null` dejando IDs muertos).
- _PUT_: Si el body no declara la nube, no se toca ni aquí ni en los usuarios.
- _PUT_: Los usuarios reciben exactamente la misma configuración.
- _PUT_: 4. Ejecutar la actualización de la LICENCIA MAESTRA
- _PUT_: 5. PROPAGACIÓN DE CAMBIOS A USUARIOS ASOCIADOS El usuario queda como espejo exacto de la empresa: mismos flags, misma DB maestra y mismas cuentas con los mismos IDs `clp-<id>`.
- _DELETE_: 1. Autorización: Exclusivo para admin_global
- _DELETE_: 2. Buscar la empresa antes de eliminar (necesitamos el nombre para eliminar usuarios)
- _DELETE_: 3. Eliminar todos los usuarios asociados a esa empresa/cliente
- _DELETE_: 4. Eliminar la licencia (empresa)

---

<a id="app-api-perfilamiento-empresas-route-ts"></a>
## `app/api/perfilamiento/empresas/route.ts`

**Route handler `/api/perfilamiento/empresas` · métodos: GET, POST**

Exporta:

- componente `GET` `async (req: NextRequest)` — RUTA: GET /api/perfilamiento/empresas (Listado de Nombres y Datos de Licencia)
- componente `POST` `async (req: NextRequest)` — RUTA: POST /api/perfilamiento/empresas (Creación de Licencia)

- Usa: [`mongodb.ts`](lib.md#lib-mongodb-ts), [`authUtils.ts`](lib.md#lib-authutils-ts), [`plans.ts`](lib.md#lib-plans-ts), [`cloudAccounts.ts`](lib.md#lib-cloudaccounts-ts), [`db.ts`](tipos.md#types-db-ts)

Notas de implementación:

- 1. Autorización: Exclusivo para admin_global
- _POST_: 1. Validar Plan
- _POST_: 2. Construir el objeto final para la DB
- _POST_: 3. Configuración por nube. Multi-tenant  -> se persiste `<cloud>_accounts` (IDs generados aquí). Single-tenant -> se persiste `user_db_<cloud>` y NO se crea el array.

---

<a id="app-api-perfilamiento-users-id-route-ts"></a>
## `app/api/perfilamiento/users/[id]/route.ts`

**Route handler `/api/perfilamiento/users/[id]` · métodos: PUT, DELETE**

Exporta:

- componente `PUT` `async (req: NextRequest, { params }: Params)` — RUTA: PUT /api/perfilamiento/users/[id] (Edición de Usuario)
- componente `DELETE` `async (req: NextRequest, { params }: Params)` — RUTA: DELETE /api/perfilamiento/users/[id] (Eliminación de Usuario) - Sin cambios

Interfaz `Params` — Define el tipo para los parámetros dinámicos de la ruta:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `params` | `{ id: string }` | no | — |

- Usa: [`mongodb.ts`](lib.md#lib-mongodb-ts), [`authUtils.ts`](lib.md#lib-authutils-ts), [`db.ts`](tipos.md#types-db-ts)

Notas de implementación:

- 1. Comprobaciones de Seguridad de Roles (sin cambios)
- 2. Preparar Campos y Ejecutar Actualización
- Manejar cambio de contraseña
- Campos permitidos para actualizar. La configuración de nubes (is_<cloud>, user_db_<cloud>, cuentas) NO se edita por usuario: la fuente de verdad es la empresa y el token se arma desde ella (G-06). Editarla aquí sólo dejaba al usuario desalineado.
- `'passwordHash',` — Para que el campo de la contraseña hasheada sea incluido
- Asegurar que is_active solo acepte booleanos
- Ignorar o registrar error
- El admin global puede cambiar el campo 'client'
- Validación: No permitir que el admin se bloquee a sí mismo (solo si el campo está en el body)
- _DELETE_: 2. Comprobaciones de Seguridad
- _DELETE_: 3. Ejecutar ELIMINACIÓN y DECREMENTO

---

<a id="app-api-perfilamiento-users-route-ts"></a>
## `app/api/perfilamiento/users/route.ts`

**Route handler `/api/perfilamiento/users` · métodos: GET, POST**

Exporta:

- componente `GET` `async (req: NextRequest)` — RUTA: GET /api/perfilamiento/users (Listado de Usuarios)
- componente `POST` `async (req: NextRequest)` — RUTA: POST /api/perfilamiento/users (Creación de Usuarios)

- Usa: [`mongodb.ts`](lib.md#lib-mongodb-ts), [`authUtils.ts`](lib.md#lib-authutils-ts), [`cloudAccounts.ts`](lib.md#lib-cloudaccounts-ts), [`db.ts`](tipos.md#types-db-ts)

Notas de implementación:

- 1. Autorización: Permitir solo a admin_global y admin_empresa
- CORRECCIÓN: Tipar explícitamente el filtro de MongoDB
- 2. Aplicar Filtro de Empresa si el rol es admin_empresa
- 3. Ejecutar la consulta con el filtro
- _POST_: 1. Extraer datos
- _POST_: Validación básica
- _POST_: 2. Buscar la empresa
- _POST_: 3. Verificación de Límites
- _POST_: 4. Construir el nuevo usuario
- _POST_: 5. HERENCIA DESDE LA EMPRESA El usuario es un espejo de su empresa: en multi-tenant hereda `<cloud>_accounts` con los MISMOS IDs `clp-<id>`; en single-tenant no se crea el array y se hereda `user_db_<cloud>`.
- _POST_: Empresa marcada multi-tenant pero sin cuentas: dato heredado inconsistente. Se degrada a single-tenant en vez de copiar un array vacío que dejaría al usuario sin conexión utilizable.
- _POST_: 6. Insertar y Actualizar

---

<a id="app-api-presupuesto-bridge-path-route-ts"></a>
## `app/api/presupuesto/bridge/[...path]/route.ts`

**Route handler `/api/presupuesto/bridge/[...path]` · métodos: —**

Internos:

- constante `proxy`

- Usa: [`bridge.ts`](lib.md#lib-bridge-ts), [`bridgePaths.ts`](lib.md#lib-bridgepaths-ts)

Notas de implementación:

- _proxy_: Los formularios suben archivos (FormData): el body se lee completo y se reenvía tal cual.

