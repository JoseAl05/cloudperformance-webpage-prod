# Componentes `components/auth/`

[← Índice](../README.md)

Formularios de login y de verificación en dos pasos.

Archivos:

- [`components/auth/LoginFormComponent.tsx`](#components-auth-loginformcomponent-tsx)
- [`components/auth/Verify2FaComponent.tsx`](#components-auth-verify2facomponent-tsx)

<a id="components-auth-loginformcomponent-tsx"></a>
## `components/auth/LoginFormComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `LoginFormComponent` `()`

- API: `/api/auth/login`
- Hooks: `useRouter`, `useSearchParams`
- Usa: [`input.tsx`](ui.md#components-ui-input-tsx), [`label.tsx`](ui.md#components-ui-label-tsx), [`button.tsx`](ui.md#components-ui-button-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-auth-login-page-tsx)

---

<a id="components-auth-verify2facomponent-tsx"></a>
## `components/auth/Verify2FaComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `Verify2FaComponent` `()`

- API: `/api/auth/verify-2fa`
- Hooks: `useRouter`, `useSearchParams`
- Usa: [`input.tsx`](ui.md#components-ui-input-tsx), [`label.tsx`](ui.md#components-ui-label-tsx), [`button.tsx`](ui.md#components-ui-button-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-auth-verify-2fa-page-tsx)

