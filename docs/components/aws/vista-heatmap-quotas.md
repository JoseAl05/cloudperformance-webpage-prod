# Componentes `components/aws/vista-heatmap-quotas/`

[← Índice](../../README.md)

Mapa de calor de cuotas de servicio AWS.

Archivos:

- [`components/aws/vista-heatmap-quotas/HeatmapQuotasComponent.tsx`](#components-aws-vista-heatmap-quotas-heatmapquotascomponent-tsx)
- [`components/aws/vista-heatmap-quotas/MainViewHeatmapQuotasComponent.tsx`](#components-aws-vista-heatmap-quotas-mainviewheatmapquotascomponent-tsx)

<a id="components-aws-vista-heatmap-quotas-heatmapquotascomponent-tsx"></a>
## `components/aws/vista-heatmap-quotas/HeatmapQuotasComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `HeatmapQuotasComponent` `({ startDate, endDate }: HeatmapQuotasComponentProps)`

Interfaz `HeatmapQuotasComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date \| null` | no | — |

- Tipo interno `SizeBy` = `'quotas' | 'maxUsage'`
Internos:

- función `fmtPct` `(v: number | null | undefined)`
- función `ellipsize` `(s: string, max = 28)`
- función `extractResources` `(input: unknown): string[]`
- función `buildThemeColors` `(isDark: boolean)`

- API: `/api/aws/bridge/funcion/heatmap-quotas`
- Hooks: `useECharts`, `useSWR`, `useTheme`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx), [`select.tsx`](../ui.md#components-ui-select-tsx), [`checkbox.tsx`](../ui.md#components-ui-checkbox-tsx), [`label.tsx`](../ui.md#components-ui-label-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`MainViewHeatmapQuotasComponent.tsx`](#components-aws-vista-heatmap-quotas-mainviewheatmapquotascomponent-tsx)

---

<a id="components-aws-vista-heatmap-quotas-mainviewheatmapquotascomponent-tsx"></a>
## `components/aws/vista-heatmap-quotas/MainViewHeatmapQuotasComponent.tsx`

**Componente**

Exporta:

- componente `MainViewHeatmapQuotasComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_aws.md#components-general-aws-filters-filterscomponent-tsx), [`HeatmapQuotasComponent.tsx`](#components-aws-vista-heatmap-quotas-heatmapquotascomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-aws-quotas-page-tsx)

