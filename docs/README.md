# CloudPerformance — Frontend (prod)

Aplicación Next.js 15 (App Router, React, TypeScript, Tailwind, ECharts, SWR) con los dashboards de CloudPerformance: AWS, Azure y GCP; servicios de IA (Bedrock, Foundry, Vertex, OpenAI); comparación de nubes; presupuestos; alertas; perfil, perfilamiento de usuarios y licencias.

## Estructura

- `app/`: rutas (páginas y layouts por grupo: `(dashboards-nubes)`, `(dashboards-ia)`, `(profile)`, `(presupuesto)`, `(alertas)`, `(auth)`) y los route handlers de `app/api/`.
- `components/`: componentes por nube y vista (`aws/`, `azure/`, `gcp/`, …), vistas compartidas (`shared/`), filtros (`general_*`) y la librería de UI (`ui/`, shadcn).
- `lib/`: utilidades (bridges, fetcher, filtros, formatos, autenticación, contratos).
- `hooks/`, `interfaces/` y `types/`: hooks y tipos compartidos.
- `middleware.ts`: autenticación y control de acceso por nube.

## Flujo de datos

Los componentes piden datos con SWR (`lib/fetcher.ts`, aborta a los 130 s) a rutas propias `/api/<servicio>/bridge/...`. Esos route handlers (creados con `createBridge`, `lib/bridge.ts`) reenvían la petición a la API correspondiente con el token de la sesión en `Authorization` y devuelven 502/504 con `{error, message}` si la API falla o supera `BRIDGE_TIMEOUT_MS` (120 s por defecto). `components/SWRProvider.tsx` muestra un aviso cuando hay timeout.

## Sesión y acceso

El login (`app/api/auth/*`) firma un JWT con la configuración de la empresa (nubes habilitadas, cuentas y plan; `lib/sessionPayload.ts`) y lo guarda en la cookie `auth_token`. `middleware.ts` exige la sesión en las rutas privadas, bloquea las nubes no habilitadas (salvo `admin_global`) y redirige las URLs antiguas. El acceso por plan se controla con `useFeatureAccess` y `PlanAccessGate`.

## Filtros y vistas compartidas

Los filtros viven en la URL (`dateFrom`, `dateTo`, `regions`, `scopes`, `resourceIds`, `tagKey`, `tagValue`; `lib/filters.ts`, `components/shared/filters/BaseFiltersComponent.tsx`). Las familias de vistas que existen en las tres nubes (facturación, consumo, recursos sin uso, horario hábil) se muestran con componentes genéricos de `components/shared/` configurados por nube (`*Configs.ts`), sobre los contratos canónicos de las APIs (`lib/billing.ts`, `lib/consumption.ts`, `lib/unused.ts`, `lib/workingHours.ts`).

## Ejecución y verificación

`npm install`, `npm run dev` (desarrollo) y `npm run build` / `npm start` (producción). `npm run lint` ejecuta ESLint. Las variables de entorno están en la tabla de abajo.

## Cómo leer esta documentación

Cada documento lista, por archivo: el tipo (página y su ruta, layout, route handler, componente, hook, utilidades), lo que exporta (con firma y props), las interfaces con sus campos, las rutas de API que consume, las variables de entorno y hooks que usa, los archivos del proyecto que importa (**Usa**) y los que lo importan (**Usado por**). Lo que antes eran comentarios en el código aparece como descripción o en "Notas de implementación". El manual de usuario está en [`manual-usuario/`](manual-usuario/).

## Variables de entorno

Definidas en `.env.example`:

| Variable | Descripción |
|---|---|
| `JWT_SECRET` | --- Sesión --- Clave con la que se firma el JWT de sesión (la misma SECRET_KEY de las APIs) |
| `FORCE_INSECURE_COOKIES` | '1' sólo en local sin HTTPS: permite cookies de sesión no seguras |
| `IS_VERCEL` | --- Dominio público (redirecciones del middleware) --- 'true' en Vercel: usa PUBLIC_ORIGIN_VERCEL; si no, PUBLIC_ORIGIN_LOCAL (p. ej. http://localhost:3000) |
| `PUBLIC_ORIGIN_LOCAL` | — |
| `PUBLIC_ORIGIN_VERCEL` | — |
| `MONGODB_URI` | --- MongoDB (usuarios, empresas, conectores) --- |
| `MONGODB_USER_DB` | Base de datos de usuarios (por defecto: appdb) |
| `API_AWS_URL` | --- APIs back end (bridges /api/<servicio>/bridge). En desarrollo se usa la variable *_DEV si está definida --- |
| `API_AWS_URL_DEV` | — |
| `API_AZURE_URL` | — |
| `API_AZURE_URL_DEV` | — |
| `API_GCP_URL` | — |
| `API_GCP_URL_DEV` | — |
| `API_CLOUD_COMPARISON` | — |
| `API_CLOUD_COMPARISON_DEV` | — |
| `API_PRESUPUESTO` | — |
| `API_PRESUPUESTO_DEV` | — |
| `API_CONNECTORS` | — |
| `API_CONNECTORS_DEV` | — |
| `API_ALERTAS_URL` | El bridge agrega /alerts si la URL no lo incluye |
| `API_ALERTAS_URL_DEV` | — |
| `API_OPENAI_URL` | API de Open IA (API_OPENIA_URL se acepta como nombre antiguo) |
| `BRIDGE_TIMEOUT_MS` | Tiempo máximo de espera de los bridges en ms (por defecto 120000) |
| `SMTP_HOST` | --- Correo (verificación en dos pasos, recuperación de contraseña) --- |
| `SMTP_PORT` | Por defecto 587 |
| `SMTP_USER` | — |
| `SMTP_PASS` | — |
| `MAIL_FROM` | — |
| `APP_NAME` | Nombre y URL de la aplicación en los correos (por defecto "Cloudperformance"; APP_URL o NEXT_PUBLIC_APP_URL) |
| `APP_URL` | — |
| `NEXT_PUBLIC_APP_URL` | — |
| `INTAC_PRIVATE_KEY` | --- Licencias --- Clave privada con la que se firman las licencias (/api/op-licencias/generar) |
| `NEW_RELIC_ENABLED` | --- New Relic (opcional) --- 'true' para cargar el agente; el agente lee además sus propias variables NEW_RELIC_* (nivel de log, tracing, etc.) |
| `NEW_RELIC_LICENSE_KEY` | — |
| `NEW_RELIC_APP_NAME` | — |

## Documentos

| Documento | Archivos |
|---|---|
| [`api-bridges`](api-bridges.md) | 31 |
| [`components/ai-finops-metrics`](components/ai-finops-metrics.md) | 8 |
| [`components/ai-recommendation-statuses`](components/ai-recommendation-statuses.md) | 3 |
| [`components/alertas`](components/alertas.md) | 18 |
| [`components/amazon-bedrock`](components/amazon-bedrock.md) | 29 |
| [`components/auth`](components/auth.md) | 2 |
| [`components/aws/cards`](components/aws/cards.md) | 1 |
| [`components/aws/facturacion-recurso`](components/aws/facturacion-recurso.md) | 5 |
| [`components/aws/presupuesto-v2`](components/aws/presupuesto-v2.md) | 18 |
| [`components/aws/presupuesto`](components/aws/presupuesto.md) | 1 |
| [`components/aws/vista-advisor`](components/aws/vista-advisor.md) | 4 |
| [`components/aws/vista-autoscaling`](components/aws/vista-autoscaling.md) | 11 |
| [`components/aws/vista-consumos`](components/aws/vista-consumos.md) | 16 |
| [`components/aws/vista-ec2`](components/aws/vista-ec2.md) | 10 |
| [`components/aws/vista-eventos`](components/aws/vista-eventos.md) | 7 |
| [`components/aws/vista-facturacion`](components/aws/vista-facturacion.md) | 2 |
| [`components/aws/vista-funciones`](components/aws/vista-funciones.md) | 64 |
| [`components/aws/vista-heatmap-quotas`](components/aws/vista-heatmap-quotas.md) | 2 |
| [`components/aws/vista-prom-loc`](components/aws/vista-prom-loc.md) | 18 |
| [`components/aws/vista-rds`](components/aws/vista-rds.md) | 37 |
| [`components/aws/vista-recursos`](components/aws/vista-recursos.md) | 13 |
| [`components/aws/vista-saving-plan`](components/aws/vista-saving-plan.md) | 5 |
| [`components/aws/vista-tags`](components/aws/vista-tags.md) | 3 |
| [`components/azure/cards`](components/azure/cards.md) | 1 |
| [`components/azure/presupuesto-v2`](components/azure/presupuesto-v2.md) | 18 |
| [`components/azure/presupuesto`](components/azure/presupuesto.md) | 1 |
| [`components/azure/tables-azure`](components/azure/tables-azure.md) | 5 |
| [`components/azure/vista-advisor`](components/azure/vista-advisor.md) | 4 |
| [`components/azure/vista-consumo-apps-gateway`](components/azure/vista-consumo-apps-gateway.md) | 2 |
| [`components/azure/vista-consumo-db`](components/azure/vista-consumo-db.md) | 2 |
| [`components/azure/vista-consumo-nodos`](components/azure/vista-consumo-nodos.md) | 2 |
| [`components/azure/vista-consumo-vm`](components/azure/vista-consumo-vm.md) | 2 |
| [`components/azure/vista-deployments`](components/azure/vista-deployments.md) | 4 |
| [`components/azure/vista-facturacion`](components/azure/vista-facturacion.md) | 4 |
| [`components/azure/vista-funciones`](components/azure/vista-funciones.md) | 47 |
| [`components/azure/vista-heatmap-quotas`](components/azure/vista-heatmap-quotas.md) | 2 |
| [`components/azure/vista-recursos-mysql`](components/azure/vista-recursos-mysql.md) | 4 |
| [`components/azure/vista-recursos-nodos`](components/azure/vista-recursos-nodos.md) | 6 |
| [`components/azure/vista-recursos-postgresql`](components/azure/vista-recursos-postgresql.md) | 4 |
| [`components/azure/vista-recursos-tm`](components/azure/vista-recursos-tm.md) | 6 |
| [`components/azure/vista-recursos-vm`](components/azure/vista-recursos-vm.md) | 8 |
| [`components/azure/vista-recursos`](components/azure/vista-recursos.md) | 2 |
| [`components/azure/vista-savings-plan`](components/azure/vista-savings-plan.md) | 5 |
| [`components/azure/vista-tags`](components/azure/vista-tags.md) | 3 |
| [`components/comp-cloud`](components/comp-cloud.md) | 42 |
| [`components/context`](components/context.md) | 1 |
| [`components/data-table`](components/data-table.md) | 3 |
| [`components/gcp/presupuesto`](components/gcp/presupuesto.md) | 18 |
| [`components/gcp/vista-consumos`](components/gcp/vista-consumos.md) | 20 |
| [`components/gcp/vista-cuds`](components/gcp/vista-cuds.md) | 6 |
| [`components/gcp/vista-facturacion`](components/gcp/vista-facturacion.md) | 2 |
| [`components/gcp/vista-funciones`](components/gcp/vista-funciones.md) | 42 |
| [`components/gcp/vista-heatmap-quotas`](components/gcp/vista-heatmap-quotas.md) | 2 |
| [`components/gcp/vista-recommender`](components/gcp/vista-recommender.md) | 4 |
| [`components/gcp/vista-recursos`](components/gcp/vista-recursos.md) | 49 |
| [`components/gcp/vista-reservas`](components/gcp/vista-reservas.md) | 4 |
| [`components/gcp/vista-tags`](components/gcp/vista-tags.md) | 3 |
| [`components/general_alertas`](components/general_alertas.md) | 2 |
| [`components/general_aws`](components/general_aws.md) | 29 |
| [`components/general_azure`](components/general_azure.md) | 26 |
| [`components/general_comp_cloud`](components/general_comp_cloud.md) | 8 |
| [`components/general_gcp`](components/general_gcp.md) | 16 |
| [`components/general_presupuesto`](components/general_presupuesto.md) | 6 |
| [`components/generales`](components/generales.md) | 11 |
| [`components/google-vertex`](components/google-vertex.md) | 23 |
| [`components/microsoft-foundry`](components/microsoft-foundry.md) | 23 |
| [`components/open-ia`](components/open-ia.md) | 5 |
| [`components/perfilamiento`](components/perfilamiento.md) | 8 |
| [`components/presupuesto`](components/presupuesto.md) | 18 |
| [`components/profile`](components/profile.md) | 8 |
| [`components/shared`](components/shared.md) | 32 |
| [`components/ui`](components/ui.md) | 28 |
| [`configuracion`](configuracion.md) | 6 |
| [`hooks`](hooks.md) | 6 |
| [`lib`](lib.md) | 45 |
| [`rutas`](rutas.md) | 229 |
| [`tipos`](tipos.md) | 43 |
