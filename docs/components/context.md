# Componentes `components/context/`

[← Índice](../README.md)

Contexto React con la empresa (cliente) activa.

Archivos:

- [`components/context/ClientContext.tsx`](#components-context-clientcontext-tsx)

<a id="components-context-clientcontext-tsx"></a>
## `components/context/ClientContext.tsx`

**Componente (cliente)**

Exporta:

- componente `ClientContextProvider` `({ children }: { children: React.ReactNode })`
- hook `useClientContext` `()`

Interfaz `ClientContextType`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `selectedCompany` | `Empresa \| null` | no | — |
| `setSelectedCompany` | `(data: Empresa \| null) => void` | no | — |
| `activeAzureAccountId` | `string \| null` | no | Multi-Tenant Azure |
| `setActiveAzureAccountId` | `(id: string \| null) => void` | no | — |
| `activeAwsAccountId` | `string \| null` | no | Multi-Tenant AWS |
| `setActiveAwsAccountId` | `(id: string \| null) => void` | no | — |
| `activeGcpAccountId` | `string \| null` | no | Multi-Tenant GCP |
| `setActiveGcpAccountId` | `(id: string \| null) => void` | no | — |
| `activeOpenaiAccountId` | `string \| null` | no | Multi-Tenant OpenAI |
| `setActiveOpenaiAccountId` | `(id: string \| null) => void` | no | — |

Internos:

- constante `ClientContext`

- Usa: [`db.ts`](../tipos.md#types-db-ts)
- Usado por: [`layout.tsx`](../rutas.md#app-layout-tsx), [`ClientSelectorComponent.tsx`](profile.md#components-profile-clientselectorcomponent-tsx), [`useActiveCompany.ts`](../hooks.md#hooks-useactivecompany-ts), [`useFeatureAccess.ts`](../hooks.md#hooks-usefeatureaccess-ts)

