# Componentes `components/gcp/vista-heatmap-quotas/`

[← Índice](../../README.md)

Mapa de calor de cuotas de GCP.

Archivos:

- [`components/gcp/vista-heatmap-quotas/HeatmapQuotasComponent.tsx`](#components-gcp-vista-heatmap-quotas-heatmapquotascomponent-tsx)
- [`components/gcp/vista-heatmap-quotas/MainViewHeatmapQuotasComponent.tsx`](#components-gcp-vista-heatmap-quotas-mainviewheatmapquotascomponent-tsx)

<a id="components-gcp-vista-heatmap-quotas-heatmapquotascomponent-tsx"></a>
## `components/gcp/vista-heatmap-quotas/HeatmapQuotasComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `HeatmapQuotasComponent` `({ startDate, endDate, projects }: HeatmapQuotasComponentProps)`

Interfaz `HeatmapQuotasComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date \| null` | no | — |
| `projects` | `string` | no | — |

Interfaz `GcpQuotaRow`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `project_id` | `string` | sí | — |
| `service` | `string` | sí | — |
| `quota_metric` | `string` | sí | — |
| `usage` | `number` | sí | — |
| `limit` | `number` | sí | — |
| `utilization_percent` | `number` | sí | — |
| `timestamp` | `string` | sí | — |

Interfaz `ProcessedQuota`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `quotaName` | `string` | no | — |
| `usagePct` | `number \| null` | no | — |
| `usageValue` | `number \| null` | no | — |
| `limitValue` | `number \| null` | no | — |
| `projectId` | `string` | no | — |
| `service` | `string` | no | — |

Interfaz `ServiceGroup`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `quotas` | `ProcessedQuota[]` | no | — |

Interfaz `DateGroup`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `label` | `string` | no | — |
| `order` | `number` | no | — |
| `services` | `Map<string, ServiceGroup>` | no | — |

- Tipo interno `SizeBy` = `'quotas' | 'maxUsage'`
Internos:

- función `fmtPct` `(v: number | null | undefined)`
- función `ellipsize` `(s: string, max = 28)`
- función `buildThemeColors` `(isDark: boolean)`

- API: `/api/gcp/bridge/gcp/quotas/heatmap-gcp-quotas`
- Hooks: `useECharts`, `useSWR`, `useTheme`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx), [`select.tsx`](../ui.md#components-ui-select-tsx), [`checkbox.tsx`](../ui.md#components-ui-checkbox-tsx), [`label.tsx`](../ui.md#components-ui-label-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`MainViewHeatmapQuotasComponent.tsx`](#components-gcp-vista-heatmap-quotas-mainviewheatmapquotascomponent-tsx)

---

<a id="components-gcp-vista-heatmap-quotas-mainviewheatmapquotascomponent-tsx"></a>
## `components/gcp/vista-heatmap-quotas/MainViewHeatmapQuotasComponent.tsx`

**Componente**

Exporta:

- componente `MainViewHeatmapQuotasComponent` `()`

- Usa: [`HeatmapQuotasComponent.tsx`](#components-gcp-vista-heatmap-quotas-heatmapquotascomponent-tsx), [`FiltersComponent.tsx`](../general_gcp.md#components-general-gcp-filters-filterscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-gcp-quotas-page-tsx)

