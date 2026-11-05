# Configuración y archivos raíz

[← Índice](README.md)

Archivos raíz: `middleware.ts` (autenticación, acceso por nube y redirecciones), `next.config.ts` (redirecciones de rutas antiguas y configuración de Next), `instrumentation.ts`, Tailwind, PostCSS y ESLint.

Archivos:

- [`eslint.config.mjs`](#eslint-config-mjs)
- [`instrumentation.ts`](#instrumentation-ts)
- [`middleware.ts`](#middleware-ts)
- [`next.config.ts`](#next-config-ts)
- [`postcss.config.mjs`](#postcss-config-mjs)
- [`tailwind.config.ts`](#tailwind-config-ts)

<a id="eslint-config-mjs"></a>
## `eslint.config.mjs`

**Módulo**

Exporta:

- export default `eslintConfig`

Internos:

- constante `__filename`
- constante `__dirname`
- constante `compat`
- constante `eslintConfig`

---

<a id="instrumentation-ts"></a>
## `instrumentation.ts`

**Módulo**

Exporta:

- función `register` `async ()`

- Variables de entorno: `NEW_RELIC_ENABLED`, `NEW_RELIC_LICENSE_KEY`, `NEXT_RUNTIME`

Notas de implementación:

- Solo proceder si estamos en Node.js runtime
- Verificar si New Relic debe estar habilitado
- `return;` — ← Salir sin cargar New Relic
- Verificar que tenemos la license key
- Solo cargar New Relic si está habilitado y configurado

---

<a id="middleware-ts"></a>
## `middleware.ts`

**Módulo**

Exporta:

- función `middleware` `async (req: NextRequest)`
- constante `config` = `{ // Excluye las rutas /api, los assets de Next y cualquier archivo estático de…`

Internos:

- constante `PUBLIC_PATHS` — Todo lo que no esté en esta lista exige sesión (las rutas /api validan su propio token).
- constante `CLOUD_FLAGS` — Prefijo de ruta -> flag del token que habilita esa nube.
- función `matchesPath` `(pathname: string, prefix: string)`

- Variables de entorno: `IS_VERCEL`, `PUBLIC_ORIGIN_LOCAL`, `PUBLIC_ORIGIN_VERCEL`
- Usa: [`auth.ts`](lib.md#lib-auth-ts)

Notas de implementación:

- _CLOUD_FLAGS_: Los servicios de IA leen los datos de su nube base.
- OBTENER EL DOMINIO PÚBLICO SEGÚN EL ENTORNO
- OBTENER LA SESIÓN DEL USUARIO
- REDIRIGIR AL LOGIN SI NO EXISTE UNA SESIÓN
- APLICAR LA EXCEPCIÓN: Si es 'admin_global', NO bloquear por nube.
- PERMITIR EL ACCESO
- _config_: Excluye las rutas /api, los assets de Next y cualquier archivo estático de /public.

---

<a id="next-config-ts"></a>
## `next.config.ts`

**Módulo**

** Usar TURBOPACK debido a nueva version de Nextjs 16.* lo usará por defecto y no WebPack ** -----------//

const nextConfig: NextConfig = {
typescript: {
ignoreBuildErrors: true,
},
serverExternalPackages: [
'newrelic',
'@newrelic/security-agent',
'@grpc/grpc-js',
],

turbopack: {
resolveAlias: {
'newrelic': 'newrelic',
'@newrelic/security-agent': '@newrelic/security-agent',
'@grpc/grpc-js': '@grpc/grpc-js',
},
},
};

Exporta:

- export default `nextConfig`

Internos:

- constante `LEGACY_CLOUD_BASES` — Rutas base de cada nube antes del cambio a /cloud-*: /aws/... -> /cloud-aws/...
- constante `ROUTE_REDIRECTS` — Estructura común de rutas por nube (F-07): /cloud-{nube}/consumos|recursos|funciones|recomendaciones|compromisos/... Ruta antigua -> ruta nueva; las subrutas y la query se conservan (p. ej. /cloud-aws/advisor/rec-statuses?x=1).
- constante `nextConfig`

Notas de implementación:

- Configuración recomendada para Next.js 15
- Asegurar que newrelic no sea empaquetado por webpack
- Si externals es un array
- En el cliente, asegurar que newrelic nunca se incluya
- Reemplazar newrelic con un módulo vacío en el cliente

---

<a id="postcss-config-mjs"></a>
## `postcss.config.mjs`

**Módulo**

Exporta:

- export default `config`

Internos:

- constante `config`

---

<a id="tailwind-config-ts"></a>
## `tailwind.config.ts`

**Módulo**

Exporta:

- export default `config`

Internos:

- constante `config`

