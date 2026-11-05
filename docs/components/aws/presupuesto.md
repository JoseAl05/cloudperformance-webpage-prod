# Componentes `components/aws/presupuesto/`

[← Índice](../../README.md)

Menú de la sección de presupuestos AWS.

Archivos:

- [`components/aws/presupuesto/MainMenuComponent.tsx`](#components-aws-presupuesto-mainmenucomponent-tsx)

<a id="components-aws-presupuesto-mainmenucomponent-tsx"></a>
## `components/aws/presupuesto/MainMenuComponent.tsx`

**Módulo (cliente)**

Necesario para hooks y eventos del DOM

'use client'; //  Necesario para hooks y eventos del DOM

Exporta:

- export default `MainMenuComponent`

Interfaz `Module` — Definimos la interfaz de los módulos:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `title` | `string` | no | — |
| `description` | `string` | no | — |
| `path` | `string` | no | — |

Internos:

- componente `MainMenuComponent` `()`

- Hooks: `useRouter`

Notas de implementación:

- Array de módulos tipado
- Puedes agregar más módulos aquí
- `onClick={() => router.push(mod.path)}` — Navegación usando Next.js

