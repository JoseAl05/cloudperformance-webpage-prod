# Componentes `components/azure/vista-deployments/`

[← Índice](../../README.md)

Deployments de ARM: gráfico y detalle.

Archivos:

- [`components/azure/vista-deployments/DeploymentsComponent.tsx`](#components-azure-vista-deployments-deploymentscomponent-tsx)
- [`components/azure/vista-deployments/MainViewDeploymentsComponent.tsx`](#components-azure-vista-deployments-mainviewdeploymentscomponent-tsx)
- [`components/azure/vista-deployments/grafico/DeploymentsChartComponent.tsx`](#components-azure-vista-deployments-grafico-deploymentschartcomponent-tsx)
- [`components/azure/vista-deployments/table/DeploymentsTableComponent.tsx`](#components-azure-vista-deployments-table-deploymentstablecomponent-tsx)

<a id="components-azure-vista-deployments-deploymentscomponent-tsx"></a>
## `components/azure/vista-deployments/DeploymentsComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `DeploymentsComponent` `({ startDate, endDate, selectedOperation,selectedResourceGroup }: DeploymentsProps)`

Interfaz `DeploymentsProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `selectedOperation` | `string` | no | — |
| `selectedResourceGroup` | `string` | no | — |

Interfaz `DeploymentData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `date` | `string` | no | — |
| `unique_deployments` | `number` | no | — |

Internos:

- función `isNonEmptyArray` `(v: unknown): v is T[]`
- función `isNullish` `(v: unknown)`

- API: `/api/azure/bridge/azure/deployments/deployments`, `/api/azure/bridge/azure/deployments/deployments-detalles`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../../lib.md#lib-fetcher-ts), [`DeploymentsTableComponent.tsx`](#components-azure-vista-deployments-table-deploymentstablecomponent-tsx), [`MessageCards.tsx`](../aws/cards.md#components-aws-cards-messagecards-tsx), [`LoaderComponent.tsx`](../general_aws.md#components-general-aws-loadercomponent-tsx), [`DeploymentsChartComponent.tsx`](#components-azure-vista-deployments-grafico-deploymentschartcomponent-tsx)
- Usado por: [`MainViewDeploymentsComponent.tsx`](#components-azure-vista-deployments-mainviewdeploymentscomponent-tsx)

---

<a id="components-azure-vista-deployments-mainviewdeploymentscomponent-tsx"></a>
## `components/azure/vista-deployments/MainViewDeploymentsComponent.tsx`

**Componente**

Exporta:

- componente `MainViewDeploymentsComponent` `()`

- Usa: [`FiltersComponent.tsx`](../general_azure.md#components-general-azure-filters-filterscomponent-tsx), [`DeploymentsComponent.tsx`](#components-azure-vista-deployments-deploymentscomponent-tsx)
- Usado por: [`page.tsx`](../../rutas.md#app-dashboards-nubes-cloud-azure-deployments-page-tsx)

---

<a id="components-azure-vista-deployments-grafico-deploymentschartcomponent-tsx"></a>
## `components/azure/vista-deployments/grafico/DeploymentsChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `DeploymentsChartComponent` `({ data, title }: DeploymentsChartComponentProps)`

Interfaz `DeploymentsChartComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `unknown[]` | no | — |
| `title` | `string` | no | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](../ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../../lib.md#lib-echartsglobalconfig-ts)
- Usado por: [`DeploymentsComponent.tsx`](#components-azure-vista-deployments-deploymentscomponent-tsx)

---

<a id="components-azure-vista-deployments-table-deploymentstablecomponent-tsx"></a>
## `components/azure/vista-deployments/table/DeploymentsTableComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `DeploymentsDetailsTableComponent` `({ data }: DeploymentsDetailsTableComponentProps)`

Interfaz `DeploymentsDetailsTableComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `DeploymentGroup[]` | no | — |

- Tipo interno `DeploymentDetail` = `{ id_deployment: string operation_name: string resource_id: string resource_group: string subscription_id: string event…`
- Tipo interno `DeploymentGroup` = `{ deployments_ids: string[] details: DeploymentDetail[] total_deployments: number date: string }`
Internos:

- componente `StatusBadge` `({ status }: { status: string })`

- Usa: [`data-table-grouping.tsx`](../data-table.md#components-data-table-data-table-grouping-tsx)
- Usado por: [`DeploymentsComponent.tsx`](#components-azure-vista-deployments-deploymentscomponent-tsx)

