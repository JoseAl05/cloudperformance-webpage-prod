# Componentes `components/perfilamiento/`

[← Índice](../README.md)

Administración de usuarios y licencias: tablas, formularios de creación y edición, y el editor de cuentas cloud de cada empresa.

Archivos:

- [`components/perfilamiento/CloudAccountsEditor.tsx`](#components-perfilamiento-cloudaccountseditor-tsx)
- [`components/perfilamiento/ConfirmDeleteModal.tsx`](#components-perfilamiento-confirmdeletemodal-tsx)
- [`components/perfilamiento/CreateUserForm.tsx`](#components-perfilamiento-createuserform-tsx)
- [`components/perfilamiento/EditLicenseModal.tsx`](#components-perfilamiento-editlicensemodal-tsx)
- [`components/perfilamiento/EditUserModal.tsx`](#components-perfilamiento-editusermodal-tsx)
- [`components/perfilamiento/LicenseCreationForm.tsx`](#components-perfilamiento-licensecreationform-tsx)
- [`components/perfilamiento/LicenseTable.tsx`](#components-perfilamiento-licensetable-tsx)
- [`components/perfilamiento/UserTable.tsx`](#components-perfilamiento-usertable-tsx)

<a id="components-perfilamiento-cloudaccountseditor-tsx"></a>
## `components/perfilamiento/CloudAccountsEditor.tsx`

**Componente**

Exporta:

- tipo `CloudProvider` = `'azure' | 'aws' | 'gcp' | 'openai'`
- tipo `CloudAccountRow` = `{ _key: string; id?: string; alias: string; db: string; }` — Fila del editor. `_key` es sólo para React y para los handlers locales: NO se envía al backend. El `id` (`clp-<id>`) lo genera y lo devuelve el servidor, que es la única fuente de verdad — ver `lib/cloudAccounts.ts`.
- función `toAccountRows` `(accounts: CloudAccount[] | undefined): CloudAccountRow[]` — Convierte las cuentas persistidas en filas editables.
- función `newAccountRow` `(cloud: CloudProvider): CloudAccountRow` — Fila nueva, todavía sin ID: lo asignará el servidor al guardar.
- función `toAccountsPayload` `(rows: CloudAccountRow[])` — Payload para la API: se descarta `_key` y el `id` de las filas nuevas.
- componente `AccountListEditor` `({ cloud, accounts, onUpdate, onRemove, onAdd }: AccountListEditorProps)`

Interfaz `AccountRowProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `account` | `CloudAccountRow` | no | — |
| `cloud` | `CloudProvider` | no | — |
| `onUpdate` | `( cloud: CloudProvider, rowKey: string, field: 'alias' \| 'db', value:…` | no | — |
| `onRemove` | `(cloud: CloudProvider, rowKey: string) => void` | no | — |

Interfaz `AccountListEditorProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloud` | `CloudProvider` | no | — |
| `accounts` | `CloudAccountRow[]` | no | — |
| `onUpdate` | `( cloud: CloudProvider, rowKey: string, field: 'alias' \| 'db', value:…` | no | — |
| `onRemove` | `(cloud: CloudProvider, rowKey: string) => void` | no | — |
| `onAdd` | `(cloud: CloudProvider) => void` | no | — |

Internos:

- constante `rowCounter`
- función `nextRowKey` `(): string`
- constante `THEME`
- componente `AccountRow` `({ account, cloud, onUpdate, onRemove }: AccountRowProps)`

- Usa: [`db.ts`](../tipos.md#types-db-ts), [`utils.ts`](../lib.md#lib-utils-ts)
- Usado por: [`EditLicenseModal.tsx`](#components-perfilamiento-editlicensemodal-tsx), [`LicenseCreationForm.tsx`](#components-perfilamiento-licensecreationform-tsx)

---

<a id="components-perfilamiento-confirmdeletemodal-tsx"></a>
## `components/perfilamiento/ConfirmDeleteModal.tsx`

**Componente**

Exporta:

- (default) componente `ConfirmDeleteModal` `({ onConfirm, onCancel, username, loading }: ConfirmDeleteModalProps)`

Interfaz `ConfirmDeleteModalProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `onConfirm` | `() => void` | no | — |
| `onCancel` | `() => void` | no | — |
| `username` | `string` | no | — |
| `loading` | `boolean` | no | — |

- Usado por: [`UserTable.tsx`](#components-perfilamiento-usertable-tsx)

---

<a id="components-perfilamiento-createuserform-tsx"></a>
## `components/perfilamiento/CreateUserForm.tsx`

**Componente**

Exporta:

- (default) componente `CreateUserForm` `({ refreshUserList }: CreateUserFormProps)`

Interfaz `EmpresaOption`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_id` | `string` | no | — |
| `name` | `string` | no | — |
| `userLimit` | `number` | no | — |

Interfaz `CreateUserFormProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `refreshUserList` | `() => void` | no | — |

Internos:

- función `fetcher` `(url: string)`
- constante `ASSIGNABLE_ROLES`

- API: `/api/perfilamiento/empresas`, `/api/perfilamiento/users`
- Hooks: `useSWR`, `useSession`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`useSession.ts`](../hooks.md#hooks-usesession-ts), [`db.ts`](../tipos.md#types-db-ts)
- Usado por: [`page.tsx`](../rutas.md#app-profile-perfilamiento-perfilamiento-usuarios-crear-page-tsx)

Notas de implementación:

- 1. CARGA DE EMPRESAS REGISTRADAS (Solo si es Admin Global)
- Validación: Global Admin debe haber seleccionado una empresa
- Validación básica
- LÓGICA DE RESTRICCIÓN ADICIONAL: Si es Admin de Empresa, forzar el rol a 'usuario' en el envío, incluso si el frontend permite (o por si alguien manipula el select).
- `client: isGlobalAdmin ? formData.client : clientName` — Mantener selección si es Global
- LÓGICA CLAVE: Filtrar los roles
- Admin Global puede asignar todos los roles, incluyendo admin_global
- Admin de Empresa solo puede crear 'usuario'
- `disabled={isCompanyAdmin}` — Deshabilitar si es Admin de Empresa (el rol siempre será 'usuario')
- JSX — Si es Admin de Empresa, solo se muestra 'USUARIO'
- `className="flex h-10 w-full rounded-md border border-input …` — Añadimos padding a la derecha
- JSX — CAMPO 6: PERMISOS (Checkboxes)

---

<a id="components-perfilamiento-editlicensemodal-tsx"></a>
## `components/perfilamiento/EditLicenseModal.tsx`

**Componente**

Exporta:

- (default) componente `EditLicenseModal` `({ empresa, onClose, refreshList }: EditLicenseModalProps)`

Interfaz `EditLicenseModalProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `empresa` | `Empresa` | no | — |
| `onClose` | `() => void` | no | — |
| `refreshList` | `() => void` | no | — |

Internos:

- constante `PLAN_NAMES`

- API: `/api/perfilamiento/empresas/{…}`
- Usa: [`db.ts`](../tipos.md#types-db-ts), [`plans.ts`](../lib.md#lib-plans-ts), [`CloudAccountsEditor.tsx`](#components-perfilamiento-cloudaccountseditor-tsx)
- Usado por: [`LicenseTable.tsx`](#components-perfilamiento-licensetable-tsx)

Notas de implementación:

- `const [gcpAccountsData, setGcpAccountsData] = useState<Clou…` — Nuevo estado GCP
- AWS
- Azure
- Open IA
- Carga inicial GCP
- Cargar las cuentas existentes (conservando sus IDs `clp-<id>`)
- `setGcpAccountsData(toAccountRows(empresa.gcp_accounts));` — Cargar cuentas GCP
- Limpiar datos cuando se desactiva AWS
- Limpiar datos cuando se desactiva Azure
- Limpiar datos cuando se desactiva GCP
- Limpiar arrays cuando se desactiva multi-tenant
- Lógica de selección de setter
- Validaciones Básicas
- Validaciones AWS
- Validaciones Azure
- Validaciones GCP
- Validaciones Open IA
- Las cuentas SÓLO se envían en modo multi-tenant. En single-tenant el backend elimina el array y deja `user_db_<cloud>` como conexión.
- AWS
- Azure
- GCP
- Open IA
- JSX — Información básica
- JSX — Plan y límite
- JSX — Configuración de Conexiones
- JSX — Grilla de Nubes: AWS - Azure - GCP - Open IA
- JSX — AWS CONFIGURATION
- JSX — AZURE CONFIGURATION
- JSX — GCP CONFIGURATION (NUEVO)
- JSX — OPEN IA CONFIGURATION

---

<a id="components-perfilamiento-editusermodal-tsx"></a>
## `components/perfilamiento/EditUserModal.tsx`

**Componente**

Exporta:

- (default) componente `EditUserModal` `({ user, onClose, refreshUserList }: EditUserModalProps)`

Interfaz `UserToEdit`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_id` | `string` | no | — |
| `email` | `string` | no | — |
| `username` | `string` | no | — |
| `client` | `string` | no | — |
| `role` | `UserRole` | no | — |
| `is_aws` | `boolean` | no | — |
| `is_azure` | `boolean` | no | — |
| `is_gcp` | `boolean` | no | — |
| `is_openai` | `boolean` | no | — |

Interfaz `EditUserModalProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `user` | `UserToEdit \| null` | no | — |
| `onClose` | `() => void` | no | — |
| `refreshUserList` | `() => void` | no | — |

Internos:

- constante `ASSIGNABLE_ROLES`

- API: `/api/perfilamiento/users/{…}`
- Hooks: `useSession`
- Usa: [`db.ts`](../tipos.md#types-db-ts), [`useSession.ts`](../hooks.md#hooks-usesession-ts), [`utils.ts`](../lib.md#lib-utils-ts)
- Usado por: [`UserTable.tsx`](#components-perfilamiento-usertable-tsx)

---

<a id="components-perfilamiento-licensecreationform-tsx"></a>
## `components/perfilamiento/LicenseCreationForm.tsx`

**Componente**

Exporta:

- (default) componente `LicenseCreationForm` `({ refreshLicenseStatus }: LicenseCreationFormProps)`

Interfaz `LicenseCreationFormProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `refreshLicenseStatus` | `() => void` | sí | — |

Internos:

- constante `PLAN_NAMES`

- API: `/api/perfilamiento/empresas`
- Hooks: `useSession`
- Usa: [`useSession.ts`](../hooks.md#hooks-usesession-ts), [`plans.ts`](../lib.md#lib-plans-ts), [`CloudAccountsEditor.tsx`](#components-perfilamiento-cloudaccountseditor-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-profile-perfilamiento-perfilamiento-licencias-crear-page-tsx)

Notas de implementación:

- Estados para las cuentas dinámicas
- `const [gcpAccountsData, setGcpAccountsData] = useState<Clou…` — Nuevo estado GCP
- Campos AWS
- Campos Azure
- Campos GCP (Nuevos)
- Campos Open IA
- Limpieza de estados si se desactivan los checkbox principales
- `if (name === 'is_gcp' && !finalValue) {` — Lógica limpieza GCP
- Limpieza de arrays si se desactiva multi-tenant
- Handler unificado para añadir cuentas
- `else if (cloud === 'gcp') setGcpAccountsData(prev => [...pr…` — Caso GCP
- Handler unificado para actualizar cuentas
- `else if (cloud === 'gcp') setter = setGcpAccountsData;` — Setter GCP
- Handler unificado para eliminar cuentas
- `else if (cloud === 'gcp') setGcpAccountsData(prev => prev.f…` — Remover GCP
- Validaciones AWS
- Validaciones Azure
- Validaciones GCP (Nuevas)
- Validaciones Open IA
- Las cuentas SÓLO se envían en modo multi-tenant. En single-tenant la conexión vive en `user_db_<cloud>` y el backend no crea el array.
- Datos AWS
- Datos Azure
- Datos GCP
- Datos Open IA
- `is_gcp: true,` — Resetear GCP a true
- `setGcpAccountsData([]);` — Limpiar cuentas GCP
- JSX — COLUMNA AWS
- JSX — COLUMNA AZURE
- JSX — COLUMNA GCP (NUEVA)
- JSX — COLUMNA OPEN IA

---

<a id="components-perfilamiento-licensetable-tsx"></a>
## `components/perfilamiento/LicenseTable.tsx`

**Componente**

Exporta:

- (default) componente `LicenseTable` `()`

Interfaz `EmpresaData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_id` | `string` | no | — |
| `name` | `string` | no | — |
| `userLimit` | `number` | no | — |
| `currentUsers` | `number` | no | — |
| `is_aws` | `boolean` | no | — |
| `is_azure` | `boolean` | no | — |
| `is_gcp` | `boolean` | no | — |
| `is_openai` | `boolean` | no | — |
| `planName` | `string` | no | — |

Internos:

- función `fetcher` `(url: string)`
- componente `ToastNotification` `({ message, type, onClose })`

- API: `/api/perfilamiento/empresas`, `/api/perfilamiento/empresas/{…}`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`EditLicenseModal.tsx`](#components-perfilamiento-editlicensemodal-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-profile-perfilamiento-perfilamiento-licencias-page-tsx)

Notas de implementación:

- Fetch de licencias (GET /api/perfilamiento/empresas)
- LLAMADA A LA API DELETE

---

<a id="components-perfilamiento-usertable-tsx"></a>
## `components/perfilamiento/UserTable.tsx`

**Componente**

Exporta:

- (default) componente `UserTable` `()`

Interfaz `UserData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `_id` | `string` | no | — |
| `email` | `string` | no | — |
| `username` | `string` | no | — |
| `client` | `string` | no | — |
| `role` | `UserRole` | no | — |
| `is_aws` | `boolean` | no | AWS |
| `user_db_aws` | `string` | sí | — |
| `is_azure` | `boolean` | no | Azure |
| `user_db_azure` | `string` | sí | — |
| `is_gcp` | `boolean` | no | GCP |
| `user_db_gcp` | `string` | sí | — |
| `is_openai` | `boolean` | no | Open IA |
| `user_db_openai` | `string` | sí | — |
| `is_active` | `boolean` | no | — |

Internos:

- función `fetcher` `(url: string)`
- componente `ToastNotification` `({ message, type, onClose })`

- API: `/api/perfilamiento/users`, `/api/perfilamiento/users/{…}`
- Hooks: `useSWR`, `useSession`
- Usa: [`useSession.ts`](../hooks.md#hooks-usesession-ts), [`db.ts`](../tipos.md#types-db-ts), [`EditUserModal.tsx`](#components-perfilamiento-editusermodal-tsx), [`ConfirmDeleteModal.tsx`](#components-perfilamiento-confirmdeletemodal-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-profile-perfilamiento-perfilamiento-usuarios-page-tsx)

Notas de implementación:

- /api/auth/me entrega el _id serializado como string
- Iniciar eliminación

