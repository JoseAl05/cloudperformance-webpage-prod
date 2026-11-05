# Componentes `components/azure/vista-heatmap-quotas/`

[← Índice](../../README.md)

Mapa de calor de cuotas de Azure.

Archivos:

- [`components/azure/vista-heatmap-quotas/HeatmapQuotasComponent.tsx`](#components-azure-vista-heatmap-quotas-heatmapquotascomponent-tsx)
- [`components/azure/vista-heatmap-quotas/MainViewHeatmapQuotasComponent.tsx`](#components-azure-vista-heatmap-quotas-mainviewheatmapquotascomponent-tsx)

<a id="components-azure-vista-heatmap-quotas-heatmapquotascomponent-tsx"></a>
## `components/azure/vista-heatmap-quotas/HeatmapQuotasComponent.tsx`

**Componente (cliente)**

'use client'

// --- NUEVA LOGICA DE SUMA INTELIGENTE

Exporta:

- componente `HeatmapQuotasComponent` `({ startDate, endDate, region, subscription }: HeatmapQuotasComponentProps)`

Interfaz `HeatmapQuotasComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date \| null` | no | — |
| `region` | `string` | no | — |
| `subscription` | `string` | no | — |

Interfaz `AzureQuotaRow`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `timestamp` | `{ $date?: string } \| string` | sí | — |
| `quota_name` | `string` | sí | — |
| `usage_value` | `number` | sí | — |
| `limit_value` | `number` | sí | — |
| `porcentaje_consumo` | `number` | sí | — |
| `location_custom` | `string` | sí | — |
| `location` | `string` | sí | — |
| `subscription_id` | `string` | sí | — |

Interfaz `AzureQuotaEntry`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `quotaName` | `string` | no | — |
| `usagePct` | `number \| null` | no | — |
| `usageValue` | `number \| null` | no | — |
| `limitValue` | `number \| null` | no | — |
| `location` | `string` | no | — |
| `subscriptionId` | `string` | no | — |

Interfaz `DateGroup`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `label` | `string` | no | — |
| `order` | `number` | no | — |
| `locations` | `Map<string, Map<string, AzureQuotaEntry>>` | no | — |

- Tipo interno `SizeBy` = `'quotas' | 'maxUsage'`
Internos:

- función `fmtPct` `(v: number | null | undefined)`
- función `ellipsize` `(s: string, max = 28)`
- función `buildThemeColors` `(isDark: boolean)`

- API: `/api/azure/bridge/azure/funcion/heatmap-quotas`
- Hooks: `useECharts`, `useSWR`, `useTheme`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx), [`select.tsx`](../ui.md#components-ui-select-tsx), [`checkbox.tsx`](../ui.md#components-ui-checkbox-tsx), [`label.tsx`](../ui.md#components-ui-label-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`MainViewHeatmapQuotasComponent.tsx`](#components-azure-vista-heatmap-quotas-mainviewheatmapquotascomponent-tsx)

---

<a id="components-azure-vista-heatmap-quotas-mainviewheatmapquotascomponent-tsx"></a>
## `components/azure/vista-heatmap-quotas/MainViewHeatmapQuotasComponent.tsx`

**Componente**

Exporta:

- componente `MainViewHeatmapQuotasComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`HeatmapQuotasComponent.tsx`](#components-azure-vista-heatmap-quotas-heatmapquotascomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-quotas-page-tsx)

