# Componentes `components/comp-cloud/`

[← Índice](../README.md)

Comparación de nubes: intercloud (VMs equivalentes en otras nubes y proyección de costo) e intracloud (facturación, cómputo y almacenamiento entre tenants).

Archivos:

- [`components/comp-cloud/intercloud/InterCloudConfigComponent.tsx`](#components-comp-cloud-intercloud-intercloudconfigcomponent-tsx)
- [`components/comp-cloud/intercloud/InterCloudSelectionComponent.tsx`](#components-comp-cloud-intercloud-intercloudselectioncomponent-tsx)
- [`components/comp-cloud/intercloud/InterCloudServiceSelectionComponent.tsx`](#components-comp-cloud-intercloud-intercloudserviceselectioncomponent-tsx)
- [`components/comp-cloud/intercloud/virtual_machines/InterCloudVmComponent.tsx`](#components-comp-cloud-intercloud-virtual-machines-intercloudvmcomponent-tsx)
- [`components/comp-cloud/intercloud/virtual_machines/MainViewInterCloudVmComponent.tsx`](#components-comp-cloud-intercloud-virtual-machines-mainviewintercloudvmcomponent-tsx)
- [`components/comp-cloud/intercloud/virtual_machines/info/InterCloudVmCardsComponent.tsx`](#components-comp-cloud-intercloud-virtual-machines-info-intercloudvmcardscomponent-tsx)
- [`components/comp-cloud/intercloud/virtual_machines/info/InterCloudVmProjectionComponent.tsx`](#components-comp-cloud-intercloud-virtual-machines-info-intercloudvmprojectioncomponent-tsx)
- [`components/comp-cloud/intracloud/IntraCloudConfigComponent.tsx`](#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx)
- [`components/comp-cloud/intracloud/IntraCloudSelectionComponent.tsx`](#components-comp-cloud-intracloud-intracloudselectioncomponent-tsx)
- [`components/comp-cloud/intracloud/IntraCloudServiceSelectionComponent.tsx`](#components-comp-cloud-intracloud-intracloudserviceselectioncomponent-tsx)
- [`components/comp-cloud/intracloud/billing/IntraCloudBillingComponent.tsx`](#components-comp-cloud-intracloud-billing-intracloudbillingcomponent-tsx)
- [`components/comp-cloud/intracloud/billing/MainViewIntraCloudBillingComponent.tsx`](#components-comp-cloud-intracloud-billing-mainviewintracloudbillingcomponent-tsx)
- [`components/comp-cloud/intracloud/billing/grafico/IntraCloudBillingCostUsdChartComponent.tsx`](#components-comp-cloud-intracloud-billing-grafico-intracloudbillingcostusdchartcomponent-tsx)
- [`components/comp-cloud/intracloud/billing/info/IntraCloudBillingCardsComponent.tsx`](#components-comp-cloud-intracloud-billing-info-intracloudbillingcardscomponent-tsx)
- [`components/comp-cloud/intracloud/billing/table/IntraCloudBillingColumns.tsx`](#components-comp-cloud-intracloud-billing-table-intracloudbillingcolumns-tsx)
- [`components/comp-cloud/intracloud/billing/table/IntraCloudBillingDimSelectionComponent.tsx`](#components-comp-cloud-intracloud-billing-table-intracloudbillingdimselectioncomponent-tsx)
- [`components/comp-cloud/intracloud/billing/table/IntraCloudBillingTable.tsx`](#components-comp-cloud-intracloud-billing-table-intracloudbillingtable-tsx)
- [`components/comp-cloud/intracloud/billing/table/IntraCloudMontlhyBillingTable.tsx`](#components-comp-cloud-intracloud-billing-table-intracloudmontlhybillingtable-tsx)
- [`components/comp-cloud/intracloud/compute/IntraCloudComputeComponent.tsx`](#components-comp-cloud-intracloud-compute-intracloudcomputecomponent-tsx)
- [`components/comp-cloud/intracloud/compute/MainViewIntraCloudComputeComponent.tsx`](#components-comp-cloud-intracloud-compute-mainviewintracloudcomputecomponent-tsx)
- [`components/comp-cloud/intracloud/compute/grafico/IntraCloudComputeChartComponent.tsx`](#components-comp-cloud-intracloud-compute-grafico-intracloudcomputechartcomponent-tsx)
- [`components/comp-cloud/intracloud/compute/info/IntraCloudComputeCardsByTenantComponent.tsx`](#components-comp-cloud-intracloud-compute-info-intracloudcomputecardsbytenantcomponent-tsx)
- [`components/comp-cloud/intracloud/services_billing/table/IntraCloudServicesBillingColumns.tsx`](#components-comp-cloud-intracloud-services-billing-table-intracloudservicesbillingcolumns-tsx)
- [`components/comp-cloud/intracloud/services_billing/table/IntraCloudServicesBillingTable.tsx`](#components-comp-cloud-intracloud-services-billing-table-intracloudservicesbillingtable-tsx)
- [`components/comp-cloud/intracloud/storage/IntraCloudDiskServiceComponent.tsx`](#components-comp-cloud-intracloud-storage-intraclouddiskservicecomponent-tsx)
- [`components/comp-cloud/intracloud/storage/IntraCloudStorageCategorySelectionComponent.tsx`](#components-comp-cloud-intracloud-storage-intracloudstoragecategoryselectioncomponent-tsx)
- [`components/comp-cloud/intracloud/storage/IntraCloudStorageComponent.tsx`](#components-comp-cloud-intracloud-storage-intracloudstoragecomponent-tsx)
- [`components/comp-cloud/intracloud/storage/IntraCloudStorageServiceComponent.tsx`](#components-comp-cloud-intracloud-storage-intracloudstorageservicecomponent-tsx)
- [`components/comp-cloud/intracloud/storage/MainViewIntraCloudStorageComponent.tsx`](#components-comp-cloud-intracloud-storage-mainviewintracloudstoragecomponent-tsx)
- [`components/comp-cloud/intracloud/storage/aws/grafico/IntraCloudAwsStorageChartComponent.tsx`](#components-comp-cloud-intracloud-storage-aws-grafico-intracloudawsstoragechartcomponent-tsx)
- [`components/comp-cloud/intracloud/storage/aws/info/IntraCloudAwsStorageCardsByTenantComponent.tsx`](#components-comp-cloud-intracloud-storage-aws-info-intracloudawsstoragecardsbytenantcomponent-tsx)
- [`components/comp-cloud/intracloud/storage/azure/grafico/IntraCloudAzureStorageChartComponent.tsx`](#components-comp-cloud-intracloud-storage-azure-grafico-intracloudazurestoragechartcomponent-tsx)
- [`components/comp-cloud/intracloud/storage/azure/info/IntraCloudAzureStorageCardsByTenantComponent.tsx`](#components-comp-cloud-intracloud-storage-azure-info-intracloudazurestoragecardsbytenantcomponent-tsx)
- [`components/comp-cloud/intracloud/storage/gcp/grafico/IntraCloudGcpStorageChartComponent.tsx`](#components-comp-cloud-intracloud-storage-gcp-grafico-intracloudgcpstoragechartcomponent-tsx)
- [`components/comp-cloud/intracloud/storage/gcp/info/IntraCloudGcpStorageCardsByTenantComponent.tsx`](#components-comp-cloud-intracloud-storage-gcp-info-intracloudgcpstoragecardsbytenantcomponent-tsx)
- [`components/comp-cloud/multicloud/MainViewMultiCloudComponent.tsx`](#components-comp-cloud-multicloud-mainviewmulticloudcomponent-tsx)
- [`components/comp-cloud/multicloud/MultiCloudComponent.tsx`](#components-comp-cloud-multicloud-multicloudcomponent-tsx)
- [`components/comp-cloud/multicloud/filters/MultiCloudFiltersComponent.tsx`](#components-comp-cloud-multicloud-filters-multicloudfilterscomponent-tsx)
- [`components/comp-cloud/multicloud/filters/MultiCloudTagFilter.tsx`](#components-comp-cloud-multicloud-filters-multicloudtagfilter-tsx)
- [`components/comp-cloud/multicloud/grafico/MultiCloudLineChartComponent.tsx`](#components-comp-cloud-multicloud-grafico-multicloudlinechartcomponent-tsx)
- [`components/comp-cloud/multicloud/grafico/MultiCloudMonthlyServiceChartComponent.tsx`](#components-comp-cloud-multicloud-grafico-multicloudmonthlyservicechartcomponent-tsx)
- [`components/comp-cloud/multicloud/grafico/MultiCloudServiceBarChartComponent.tsx`](#components-comp-cloud-multicloud-grafico-multicloudservicebarchartcomponent-tsx)

<a id="components-comp-cloud-intercloud-intercloudconfigcomponent-tsx"></a>
## `components/comp-cloud/intercloud/InterCloudConfigComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `InterCloudReqPayload`
- componente `InterCloudConfigComponent` `({ cloudType, accounts, onReqReady }: InterCloudConfigComponentProps)`

Interfaz `InterCloudReqPayload` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `tenant_id` | `string` | no | — |
| `cloud_provider` | `string` | no | — |
| `service_type` | `ServiceType` | no | — |

Interfaz `InterCloudConfigComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloudType` | `string` | no | — |
| `accounts` | `CloudAccount[]` | no | — |
| `onReqReady` | `(payload: InterCloudReqPayload) => void` | no | — |

- Usa: [`InterCloudServiceSelectionComponent.tsx`](#components-comp-cloud-intercloud-intercloudserviceselectioncomponent-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`checkbox.tsx`](ui.md#components-ui-checkbox-tsx), [`db.ts`](../tipos.md#types-db-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`badge.tsx`](ui.md#components-ui-badge-tsx)
- Usado por: [`InterCloudSelectionComponent.tsx`](#components-comp-cloud-intercloud-intercloudselectioncomponent-tsx), [`InterCloudVmComponent.tsx`](#components-comp-cloud-intercloud-virtual-machines-intercloudvmcomponent-tsx), [`MainViewInterCloudVmComponent.tsx`](#components-comp-cloud-intercloud-virtual-machines-mainviewintercloudvmcomponent-tsx), [`FilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-filtercomponent-tsx), [`MultiTenantResourceGroupFilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-multitenantresourcegroupfiltercomponent-tsx), [`MultiTenantSubscriptionsFilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-multitenantsubscriptionsfiltercomponent-tsx), [`MultiTenantTagsFilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-multitenanttagsfiltercomponent-tsx)

---

<a id="components-comp-cloud-intercloud-intercloudselectioncomponent-tsx"></a>
## `components/comp-cloud/intercloud/InterCloudSelectionComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `InterCloudSelectionComponent` `()`

- Hooks: `usePathname`, `useRouter`, `useSession`
- Usa: [`InterCloudConfigComponent.tsx`](#components-comp-cloud-intercloud-intercloudconfigcomponent-tsx), [`InterCloudServiceSelectionComponent.tsx`](#components-comp-cloud-intercloud-intercloudserviceselectioncomponent-tsx), [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx), [`select.tsx`](ui.md#components-ui-select-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`useSession.ts`](../hooks.md#hooks-usesession-ts), [`db.ts`](../tipos.md#types-db-ts), [`MainViewInterCloudVmComponent.tsx`](#components-comp-cloud-intercloud-virtual-machines-mainviewintercloudvmcomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-profile-comparacion-comparacion-nubes-internube-page-tsx)

---

<a id="components-comp-cloud-intercloud-intercloudserviceselectioncomponent-tsx"></a>
## `components/comp-cloud/intercloud/InterCloudServiceSelectionComponent.tsx`

**Componente (cliente)**

Exporta:

- tipo `ServiceType` = `'vms'`
- componente `InterCloudServiceSelectionComponent` `({ cloudType, onServiceSelected }: InterCloudServiceSelectionComponentProps)`

Interfaz `InterCloudServiceSelectionComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloudType` | `string` | no | — |
| `onServiceSelected` | `(service: ServiceType) => void` | no | — |

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx)
- Usado por: [`InterCloudConfigComponent.tsx`](#components-comp-cloud-intercloud-intercloudconfigcomponent-tsx), [`InterCloudSelectionComponent.tsx`](#components-comp-cloud-intercloud-intercloudselectioncomponent-tsx)

Notas de implementación:

- _InterCloudServiceSelectionComponent_: { id: 'storage', label: 'Storage y Discos', icon: HardDrive, description: 'Volúmenes, Buckets y retención.' }

---

<a id="components-comp-cloud-intercloud-virtual-machines-intercloudvmcomponent-tsx"></a>
## `components/comp-cloud/intercloud/virtual_machines/InterCloudVmComponent.tsx`

**Componente**

Exporta:

- componente `InterCloudVmComponent` `({ region, subscriptions, resourceGroups, projects, payload }: InterCloudVmComponentProps)`

Interfaz `BackendPayload`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `filters` | `Record<string, { resourceGgroup?: string; resources?: string; region?…` | no | — |

- Tipo interno `InterCloudVmComponentProps` = `DynamicFilterProps`
Internos:

- función `fetcherPost` `([url, payload]: [string, BackendPayload])`
- función `isNonEmptyArray` `(v: unknown): v is T[]`
- función `isNullish` `(v: unknown)`

- API: `/api/comparison-cloud/bridge/intercloud/aws/ec2/get_virtual_machine_cloud_comparison`, `/api/comparison-cloud/bridge/intercloud/azure/vms/get_virtual_machine_cloud_comparison`, `/api/comparison-cloud/bridge/intercloud/gcp/vms/get_virtual_machine_cloud_comparison`
- Hooks: `useSWR`
- Usa: [`InterCloudConfigComponent.tsx`](#components-comp-cloud-intercloud-intercloudconfigcomponent-tsx), [`InterCloudVmCardsComponent.tsx`](#components-comp-cloud-intercloud-virtual-machines-info-intercloudvmcardscomponent-tsx), [`FilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-filtercomponent-tsx)
- Usado por: [`MainViewInterCloudVmComponent.tsx`](#components-comp-cloud-intercloud-virtual-machines-mainviewintercloudvmcomponent-tsx)

---

<a id="components-comp-cloud-intercloud-virtual-machines-mainviewintercloudvmcomponent-tsx"></a>
## `components/comp-cloud/intercloud/virtual_machines/MainViewInterCloudVmComponent.tsx`

**Componente**

Exporta:

- componente `MainViewInterCloudVmComponent` `({ payload }: MainViewInterCloudVmComponentProps)`

Interfaz `MainViewInterCloudVmComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `payload` | `InterCloudReqPayload` | no | — |

- Usa: [`InterCloudConfigComponent.tsx`](#components-comp-cloud-intercloud-intercloudconfigcomponent-tsx), [`InterCloudVmComponent.tsx`](#components-comp-cloud-intercloud-virtual-machines-intercloudvmcomponent-tsx), [`FilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-filtercomponent-tsx)
- Usado por: [`InterCloudSelectionComponent.tsx`](#components-comp-cloud-intercloud-intercloudselectioncomponent-tsx)

---

<a id="components-comp-cloud-intercloud-virtual-machines-info-intercloudvmcardscomponent-tsx"></a>
## `components/comp-cloud/intercloud/virtual_machines/info/InterCloudVmCardsComponent.tsx`

**Componente (cliente)**

Exporta:

- tipo `CloudProvider` = `"AWS" | "Azure" | "GCP"`
- interfaz `VmMatch`
- interfaz `InterCloudVm`
- interfaz `InterCloudVmCardsComponentProps`
- componente `InterCloudVmCardsComponent` `({ data, sourceCloud, }: InterCloudVmCardsComponentProps)`

Interfaz `VmMatch` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instance_type` | `string` | no | — |
| `os` | `string` | no | — |
| `region` | `string` | no | — |
| `vcpus` | `number` | no | — |
| `memory_gb` | `number` | no | — |
| `hourly_usd` | `number` | no | — |
| `monthly_usd_730h` | `number` | no | — |
| `precision_treshold` | `string` | no | — |
| `precision_treshold_description` | `string` | no | — |
| `projected_cost_30d` | `number \| null` | no | — |
| `savings_vs_actual_30d` | `number \| null` | no | — |
| `savings_vs_on_demand_30d` | `number \| null` | no | — |
| `savings_pct_vs_on_demand` | `number \| null` | no | — |
| `confidence` | `"high" \| "medium" \| "low" \| "unknown"` | no | — |
| `status` | `"ok" \| "missing_billing" \| "missing_metrics" \| "missing_both" \| "erro…` | no | — |

Interfaz `InterCloudVm` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `instance_id` | `string` | no | — |
| `instance_type` | `string` | no | — |
| `instance_os` | `string` | no | — |
| `instance_region` | `string` | no | — |
| `instance_arch` | `string` | no | — |
| `instance_name` | `string` | no | — |
| `last_sync` | `string` | no | — |
| `type_vcpu` | `number` | no | — |
| `type_memory` | `number` | no | — |
| `type_memory_gb` | `number` | no | — |
| `hourly_usd` | `number` | no | — |
| `monthly_usd_730h` | `number` | no | — |
| `billed_hours_30d` | `number \| null` | no | — |
| `actual_vm_cost_30d` | `number \| null` | no | — |
| `on_demand_equivalent_cost_30d` | `number \| null` | no | — |
| `billing_days_with_data` | `number` | no | — |
| `cpu_utilization_max_30d` | `number \| null` | no | — |
| `cpu_utilization_avg_30d` | `number \| null` | no | — |
| `cpu_credit_balance_min_30d` | `number \| null` | no | — |
| `cpu_credit_usage_max_30d` | `number \| null` | no | — |
| `projection_status` | `"ok" \| "missing_billing" \| "missing_metrics" \| "missing_both" \| "erro…` | no | — |
| `azure_vms_match` | `VmMatch[]` | sí | — |
| `gcp_vms_match` | `VmMatch[]` | sí | — |
| `aws_vms_match` | `VmMatch[]` | sí | — |

Interfaz `InterCloudVmCardsComponentProps` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `InterCloudVm[]` | no | — |
| `sourceCloud` | `CloudProvider` | no | — |

- Tipo interno `CloudMeta` = `{ label: string dot: string bg: string border: string text: string }`
- Tipo interno `DiffDirection` = `"down" | "up" | "equal"`
- Tipo interno `PriceDiff` = `{ delta: number absDelta: number percent: number direction: DiffDirection }`
- Tipo interno `InfrastructureSummary` = `{ original: { hourly: number monthly: number count: number types: { instance_type: string; count: number }[] } best: { …`
Internos:

- constante `CLOUD_META`
- constante `CLOUD_FIELD_MAP`
- constante `PROVIDER_ORDER`
- función `formatHourly` `(value: number): string`
- función `formatMonthly` `(value: number): string`
- función `formatPercent` `(value: number): string`
- componente `InfoHint` `({ children, side = "top", }: { children: ReactNode side?: "top" | "right" | "bottom" | "left" })`
- función `computePriceDiff` `(matchValue: number, originalValue: number | undefined | null, epsilon: number): PriceDiff | null`
- componente `PriceDiff` `({ diff, formatter, size = "sm", }: { diff: PriceDiff | null formatter: (v: number) => string size?: "sm" | "md" })`
- constante `HOURLY_EPSILON`
- constante `MONTHLY_EPSILON`
- función `getLatestSyncTime` `(data: InterCloudVm[]): Date | null`
- función `formatSyncDate` `(date: Date): string`
- función `getDestinationProviders` `(vm: InterCloudVm, sourceCloud: CloudProvider)`
- componente `PrecisionBadge` `({ match }: { match: VmMatch })`
- componente `VmListItem` `({ vm, sourceCloud, isSelected, onSelect, }: { vm: InterCloudVm sourceCloud: CloudProvider isSelected: boolean onSelect…`
- componente `MatchesTable` `({ matches, provider, vm_original }: { matches: VmMatch[] provider: CloudProvider vm_original: InterCloudVm })`
- componente `VmDetailPanel` `({ vm, sourceCloud, }: { vm: InterCloudVm sourceCloud: CloudProvider })`
- función `computeInfrastructureSummary` `(data: InterCloudVm[], sourceCloud: CloudProvider): InfrastructureSummary`
- componente `InfrastructureOverview` `({ data, sourceCloud, }: { data: InterCloudVm[] sourceCloud: CloudProvider })`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`badge.tsx`](ui.md#components-ui-badge-tsx), [`input.tsx`](ui.md#components-ui-input-tsx), [`tabs.tsx`](ui.md#components-ui-tabs-tsx), [`tooltip.tsx`](ui.md#components-ui-tooltip-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`InterCloudVmProjectionComponent.tsx`](#components-comp-cloud-intercloud-virtual-machines-info-intercloudvmprojectioncomponent-tsx)
- Usado por: [`InterCloudVmComponent.tsx`](#components-comp-cloud-intercloud-virtual-machines-intercloudvmcomponent-tsx), [`InterCloudVmProjectionComponent.tsx`](#components-comp-cloud-intercloud-virtual-machines-info-intercloudvmprojectioncomponent-tsx)

---

<a id="components-comp-cloud-intercloud-virtual-machines-info-intercloudvmprojectioncomponent-tsx"></a>
## `components/comp-cloud/intercloud/virtual_machines/info/InterCloudVmProjectionComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `InterCloudVmProjectionComponentProps`
- componente `InterCloudVmProjectionComponent` `({ vm, sourceCloud, }: InterCloudVmProjectionComponentProps)`

Interfaz `InterCloudVmProjectionComponentProps` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `vm` | `InterCloudVm` | no | — |
| `sourceCloud` | `CloudProvider` | no | — |

- Tipo interno `CommitmentTerm` = `"on_demand" | "1y" | "3y"`
- Tipo interno `ConfidenceLevel` = `VmMatch["confidence"]`
- Tipo interno `ProjectionStatus` = `InterCloudVm["projection_status"]`
Internos:

- constante `CLOUD_META`
- constante `CLOUD_FIELD_MAP`
- constante `PROVIDER_ORDER`
- constante `COMMITMENT_DISCOUNTS`
- constante `COMMITMENT_LABELS`
- constante `COMMITMENT_SHORT_LABELS`
- función `applyCommitment` `(amount: number | null, provider: CloudProvider, term: CommitmentTerm): number | null`
- función `computeProjectedCost` `(match: VmMatch, provider: CloudProvider, term: CommitmentTerm): number | null`
- función `computeSavingsVsActual` `(match: VmMatch, vm: InterCloudVm, provider: CloudProvider, term: CommitmentTerm): number | null`
- función `computeSavingsVsOnDemand` `(match: VmMatch, vm: InterCloudVm, provider: CloudProvider, term: CommitmentTerm): { amount: number | null; pct: number…`
- función `formatMoney` `(value: number): string`
- función `formatSignedMoney` `(value: number): string`
- función `formatHours` `(value: number): string`
- función `formatPercent` `(value: number): string`
- constante `CONFIDENCE_META`
- constante `STATUS_META`
- constante `STATUS_TONE_CLASSES`
- componente `InfoHint` `({ children, side = "top", }: { children: ReactNode side?: "top" | "right" | "bottom" | "left" })`
- componente `ConfidenceBadge` `({ match }: { match: VmMatch })`
- componente `SavingsCell` `({ amount, percent, }: { amount: number | null percent?: number | null })`
- componente `ProjectionContextStrip` `({ vm }: { vm: InterCloudVm })`
- componente `SourceBaselineCard` `({ vm, sourceCloud, }: { vm: InterCloudVm sourceCloud: CloudProvider })`
- componente `ProjectionTable` `({ matches, provider, vm, term, }: { matches: VmMatch[] provider: CloudProvider vm: InterCloudVm term: CommitmentTerm })`

- Usa: [`tabs.tsx`](ui.md#components-ui-tabs-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`badge.tsx`](ui.md#components-ui-badge-tsx), [`tooltip.tsx`](ui.md#components-ui-tooltip-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`InterCloudVmCardsComponent.tsx`](#components-comp-cloud-intercloud-virtual-machines-info-intercloudvmcardscomponent-tsx)
- Usado por: [`InterCloudVmCardsComponent.tsx`](#components-comp-cloud-intercloud-virtual-machines-info-intercloudvmcardscomponent-tsx)

---

<a id="components-comp-cloud-intracloud-intracloudconfigcomponent-tsx"></a>
## `components/comp-cloud/intracloud/IntraCloudConfigComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `ReqPayload`
- componente `IntraCloudConfigComponent` `({ cloudType, accounts, onReqReady }: IntraCloudConfigComponentProps)`

Interfaz `ReqPayload` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `tenants` | `string[]` | no | — |
| `cloud_provider` | `string` | no | — |
| `service_type` | `ServiceType` | no | — |

Interfaz `IntraCloudConfigComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloudType` | `string` | no | — |
| `accounts` | `CloudAccount[]` | no | — |
| `onReqReady` | `(payload: ReqPayload) => void` | no | — |

- Usa: [`IntraCloudServiceSelectionComponent.tsx`](#components-comp-cloud-intracloud-intracloudserviceselectioncomponent-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`checkbox.tsx`](ui.md#components-ui-checkbox-tsx), [`db.ts`](../tipos.md#types-db-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`badge.tsx`](ui.md#components-ui-badge-tsx)
- Usado por: [`IntraCloudSelectionComponent.tsx`](#components-comp-cloud-intracloud-intracloudselectioncomponent-tsx), [`IntraCloudBillingComponent.tsx`](#components-comp-cloud-intracloud-billing-intracloudbillingcomponent-tsx), [`MainViewIntraCloudBillingComponent.tsx`](#components-comp-cloud-intracloud-billing-mainviewintracloudbillingcomponent-tsx), [`IntraCloudBillingDimSelectionComponent.tsx`](#components-comp-cloud-intracloud-billing-table-intracloudbillingdimselectioncomponent-tsx), [`IntraCloudBillingTable.tsx`](#components-comp-cloud-intracloud-billing-table-intracloudbillingtable-tsx), [`IntraCloudComputeComponent.tsx`](#components-comp-cloud-intracloud-compute-intracloudcomputecomponent-tsx), [`MainViewIntraCloudComputeComponent.tsx`](#components-comp-cloud-intracloud-compute-mainviewintracloudcomputecomponent-tsx), [`IntraCloudServicesBillingTable.tsx`](#components-comp-cloud-intracloud-services-billing-table-intracloudservicesbillingtable-tsx), [`IntraCloudDiskServiceComponent.tsx`](#components-comp-cloud-intracloud-storage-intraclouddiskservicecomponent-tsx), [`IntraCloudStorageComponent.tsx`](#components-comp-cloud-intracloud-storage-intracloudstoragecomponent-tsx), [`IntraCloudStorageServiceComponent.tsx`](#components-comp-cloud-intracloud-storage-intracloudstorageservicecomponent-tsx), [`MainViewIntraCloudStorageComponent.tsx`](#components-comp-cloud-intracloud-storage-mainviewintracloudstoragecomponent-tsx), [`FilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-filtercomponent-tsx), [`MultiTenantProjectsFilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-multitenantprojectsfiltercomponent-tsx), [`MultiTenantResourceFilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-multitenantresourcefiltercomponent-tsx), [`MultiTenantResourceGroupFilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-multitenantresourcegroupfiltercomponent-tsx), [`MultiTenantServiceFilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-multitenantservicefiltercomponent-tsx), [`MultiTenantSubscriptionsFilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-multitenantsubscriptionsfiltercomponent-tsx), [`MultiTenantTagsFilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-multitenanttagsfiltercomponent-tsx)

---

<a id="components-comp-cloud-intracloud-intracloudselectioncomponent-tsx"></a>
## `components/comp-cloud/intracloud/IntraCloudSelectionComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `IntraCloudSelectionComponent` `()`

- Hooks: `usePathname`, `useRouter`, `useSession`
- Usa: [`IntraCloudConfigComponent.tsx`](#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx), [`MainViewIntraCloudBillingComponent.tsx`](#components-comp-cloud-intracloud-billing-mainviewintracloudbillingcomponent-tsx), [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx), [`select.tsx`](ui.md#components-ui-select-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`useSession.ts`](../hooks.md#hooks-usesession-ts), [`db.ts`](../tipos.md#types-db-ts), [`MainViewIntraCloudComputeComponent.tsx`](#components-comp-cloud-intracloud-compute-mainviewintracloudcomputecomponent-tsx), [`MainViewIntraCloudStorageComponent.tsx`](#components-comp-cloud-intracloud-storage-mainviewintracloudstoragecomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-profile-comparacion-comparacion-nubes-intranube-page-tsx)

---

<a id="components-comp-cloud-intracloud-intracloudserviceselectioncomponent-tsx"></a>
## `components/comp-cloud/intracloud/IntraCloudServiceSelectionComponent.tsx`

**Componente (cliente)**

Exporta:

- tipo `ServiceType` = `'billing' | 'compute' | 'storage'`
- componente `IntraCloudServiceSelectionComponent` `({ cloudType, onServiceSelected }: IntraCloudServiceSelectionComponentProps)`

Interfaz `IntraCloudServiceSelectionComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `cloudType` | `string` | no | — |
| `onServiceSelected` | `(service: ServiceType) => void` | no | — |

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx)
- Usado por: [`IntraCloudConfigComponent.tsx`](#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx)

---

<a id="components-comp-cloud-intracloud-billing-intracloudbillingcomponent-tsx"></a>
## `components/comp-cloud/intracloud/billing/IntraCloudBillingComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `IntraCloudBillingComponent` `({ payload, startDate, endDate, projects, resourceGroups, subscriptions, tagKeys, tagValues, region }: IntraCloudBillingComponentProps)`

Interfaz `BackendPayload`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `filters` | `Record<string, { resource_group?: string; project_id?: string; locati…` | no | — |

- Tipo interno `IntraCloudBillingComponentProps` = `DynamicFilterProps`
Internos:

- función `fetcherPost` `([url, payload]: [string, BackendPayload])`
- función `isNonEmptyArray` `(v: unknown): v is T[]`
- función `isNullish` `(v: unknown)`

- API: `/api/comparison-cloud/bridge/intracloud/aws/billing/get_tenants_billing`, `/api/comparison-cloud/bridge/intracloud/aws/billing/get_tenants_billing_by_dimension`, `/api/comparison-cloud/bridge/intracloud/aws/billing/get_tenants_monthly_billing`, `/api/comparison-cloud/bridge/intracloud/azure/billing/get_tenants_billing`, `/api/comparison-cloud/bridge/intracloud/azure/billing/get_tenants_billing_by_dimension`, `/api/comparison-cloud/bridge/intracloud/azure/billing/get_tenants_monthly_billing`, `/api/comparison-cloud/bridge/intracloud/gcp/billing/get_tenants_billing`, `/api/comparison-cloud/bridge/intracloud/gcp/billing/get_tenants_billing_by_dimension`, `/api/comparison-cloud/bridge/intracloud/gcp/billing/get_tenants_monthly_billing`
- Hooks: `useSWR`
- Usa: [`IntraCloudBillingCostUsdChartComponent.tsx`](#components-comp-cloud-intracloud-billing-grafico-intracloudbillingcostusdchartcomponent-tsx), [`IntraCloudBillingCardsComponent.tsx`](#components-comp-cloud-intracloud-billing-info-intracloudbillingcardscomponent-tsx), [`IntraCloudBillingTable.tsx`](#components-comp-cloud-intracloud-billing-table-intracloudbillingtable-tsx), [`IntraCloudMontlhyBillingTable.tsx`](#components-comp-cloud-intracloud-billing-table-intracloudmontlhybillingtable-tsx), [`IntraCloudConfigComponent.tsx`](#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx), [`FilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-filtercomponent-tsx), [`intraCloudBillingInterfaces.ts`](../tipos.md#interfaces-vista-intracloud-billing-intracloudbillinginterfaces-ts)
- Usado por: [`MainViewIntraCloudBillingComponent.tsx`](#components-comp-cloud-intracloud-billing-mainviewintracloudbillingcomponent-tsx), [`MainViewIntraCloudComputeComponent.tsx`](#components-comp-cloud-intracloud-compute-mainviewintracloudcomputecomponent-tsx)

---

<a id="components-comp-cloud-intracloud-billing-mainviewintracloudbillingcomponent-tsx"></a>
## `components/comp-cloud/intracloud/billing/MainViewIntraCloudBillingComponent.tsx`

**Componente (cliente)**

'use client'

Exporta:

- componente `MainViewIntraCloudBillingComponent` `({ payload }: MainViewIntraCloudBillingComponentProps)`

Interfaz `MainViewIntraCloudBillingComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `payload` | `ReqPayload` | no | — |

- Usa: [`IntraCloudConfigComponent.tsx`](#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx), [`IntraCloudBillingComponent.tsx`](#components-comp-cloud-intracloud-billing-intracloudbillingcomponent-tsx), [`FilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-filtercomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-profile-comparacion-comparacion-nubes-intranube-facturacion-page-tsx), [`IntraCloudSelectionComponent.tsx`](#components-comp-cloud-intracloud-intracloudselectioncomponent-tsx)

---

<a id="components-comp-cloud-intracloud-billing-grafico-intracloudbillingcostusdchartcomponent-tsx"></a>
## `components/comp-cloud/intracloud/billing/grafico/IntraCloudBillingCostUsdChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `IntraCloudBillingCostUsdChartComponent` `({ data }: IntraCloudBillingCostUsdChartComponentProps)`

Interfaz `IntraCloudBillingCostUsdChartComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `IntraCloudMonthlyBilling[] \| undefined` | no | — |

Internos:

- constante `MONTH_ORDER`

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../lib.md#lib-echartsglobalconfig-ts), [`intraCloudBillingInterfaces.ts`](../tipos.md#interfaces-vista-intracloud-billing-intracloudbillinginterfaces-ts)
- Usado por: [`IntraCloudBillingComponent.tsx`](#components-comp-cloud-intracloud-billing-intracloudbillingcomponent-tsx)

Notas de implementación:

- Meses de todos los tenants en orden cronológico; cada serie lleva un valor numérico por mes (null si no hay datos). Antes se enviaban strings formateados ("4,580.36") que ECharts no puede graficar.

---

<a id="components-comp-cloud-intracloud-billing-info-intracloudbillingcardscomponent-tsx"></a>
## `components/comp-cloud/intracloud/billing/info/IntraCloudBillingCardsComponent.tsx`

**Componente**

Agregué LucideIcon al import

Exporta:

- componente `IntraCloudBillingCardsComponent` `({ data }: IntraCloudBillingCardsComponentProps)`

Interfaz `IntraCloudBillingCardsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `IntraCloudBilling[]` | no | — |

Interfaz `StatCardProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `title` | `string` | no | — |
| `value` | `string \| number` | no | — |
| `description` | `string` | no | — |
| `subDescription` | `string` | sí | — |
| `icon` | `LucideIcon` | no | — |
| `actionLabel` | `string` | sí | — |
| `dateLabel` | `string` | sí | — |
| `onViewList` | `() => void` | sí | — |

Internos:

- constante `gridColsMap`
- componente `StatCard` `({ title, value, description, subDescription, icon: Icon, actionLabel, dateLabel }: StatCardProps)`

- Usa: [`button.tsx`](ui.md#components-ui-button-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`intraCloudBillingInterfaces.ts`](../tipos.md#interfaces-vista-intracloud-billing-intracloudbillinginterfaces-ts), [`metricUtils.ts`](../lib.md#lib-metricutils-ts), [`utils.ts`](../lib.md#lib-utils-ts)
- Usado por: [`IntraCloudBillingComponent.tsx`](#components-comp-cloud-intracloud-billing-intracloudbillingcomponent-tsx)

Notas de implementación:

- Iteración única para sumar costos y encontrar rango de fechas
- Asumimos que start_date viene en formato ISO string compatible

---

<a id="components-comp-cloud-intracloud-billing-table-intracloudbillingcolumns-tsx"></a>
## `components/comp-cloud/intracloud/billing/table/IntraCloudBillingColumns.tsx`

**Módulo (cliente)**

Exporta:

- función `getIntraCloudBillingColumns` `(allData: IntraCloudBillingByDimension[]): DynamicColumn<AggregatedBillingRow>[]`

Interfaz `AggregatedBillingRow`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `dimension_value` | `string` | no | — |
| `[tenantId: string]: string \| number;` | `string \| number` | no | — |

Internos:

- función `formatCurrency` `(value: number | undefined)`
- componente `CostCell` `({ cost }: { cost: number | undefined })`
- componente `ComparisonCell` `({ row, tenantIds, aliasMap }: { row: AggregatedBillingRow, tenantIds: string[], aliasMap: Record<string, string> })`

- Usa: [`badge.tsx`](ui.md#components-ui-badge-tsx), [`tooltip.tsx`](ui.md#components-ui-tooltip-tsx), [`columns.tsx`](data-table.md#components-data-table-columns-tsx), [`intraCloudBillingInterfaces.ts`](../tipos.md#interfaces-vista-intracloud-billing-intracloudbillinginterfaces-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`metricUtils.ts`](../lib.md#lib-metricutils-ts), [`bytesToMbs.ts`](../lib.md#lib-bytestombs-ts)
- Usado por: [`IntraCloudBillingTable.tsx`](#components-comp-cloud-intracloud-billing-table-intracloudbillingtable-tsx)

---

<a id="components-comp-cloud-intracloud-billing-table-intracloudbillingdimselectioncomponent-tsx"></a>
## `components/comp-cloud/intracloud/billing/table/IntraCloudBillingDimSelectionComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `IntraCloudBillingDimSelectionComponent` `({ dimension, setDimension, payload }: IntraCloudBillingDimSelectionComponentProps)`

Interfaz `DimensionGroup` — Grupo de dimensiones del selector: claves de DIMENSIONS_MAPPING de la nube activa.:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `label` | `string` | no | — |
| `keys` | `string[]` | no | — |

Interfaz `IntraCloudBillingDimSelectionComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `dimension` | `string` | no | — |
| `setDimension` | `Dispatch<SetStateAction<string>>` | no | — |
| `payload` | `ReqPayload` | no | — |

- Usa: [`IntraCloudConfigComponent.tsx`](#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx), [`select.tsx`](ui.md#components-ui-select-tsx)
- Usado por: [`IntraCloudBillingTable.tsx`](#components-comp-cloud-intracloud-billing-table-intracloudbillingtable-tsx), [`IntraCloudServicesBillingTable.tsx`](#components-comp-cloud-intracloud-services-billing-table-intracloudservicesbillingtable-tsx)

---

<a id="components-comp-cloud-intracloud-billing-table-intracloudbillingtable-tsx"></a>
## `components/comp-cloud/intracloud/billing/table/IntraCloudBillingTable.tsx`

**Componente**

Exporta:

- componente `IntraCloudBillingTable` `({ data, dimension, setDimension, payload, isLoading }: IntraCloudBillingTableProps)`

Interfaz `IntraCloudBillingTableProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `IntraCloudBillingByDimension[]` | no | — |
| `dimension` | `string` | no | — |
| `setDimension` | `Dispatch<SetStateAction<string>>` | no | — |
| `payload` | `ReqPayload` | no | — |
| `isLoading` | `boolean` | no | — |

- Usa: [`columns.tsx`](data-table.md#components-data-table-columns-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`data-table-grouping.tsx`](data-table.md#components-data-table-data-table-grouping-tsx), [`intraCloudBillingInterfaces.ts`](../tipos.md#interfaces-vista-intracloud-billing-intracloudbillinginterfaces-ts), [`IntraCloudBillingColumns.tsx`](#components-comp-cloud-intracloud-billing-table-intracloudbillingcolumns-tsx), [`IntraCloudBillingDimSelectionComponent.tsx`](#components-comp-cloud-intracloud-billing-table-intracloudbillingdimselectioncomponent-tsx), [`IntraCloudConfigComponent.tsx`](#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx), [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx)
- Usado por: [`IntraCloudBillingComponent.tsx`](#components-comp-cloud-intracloud-billing-intracloudbillingcomponent-tsx)

---

<a id="components-comp-cloud-intracloud-billing-table-intracloudmontlhybillingtable-tsx"></a>
## `components/comp-cloud/intracloud/billing/table/IntraCloudMontlhyBillingTable.tsx`

**Componente**

Exporta:

- componente `IntraCloudMonthlyBillingTable` `({ data, isLoading }: IntraCloudMonthlyBillingTableProps)`

Interfaz `IntraCloudMonthlyBillingTableProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `IntraCloudMonthlyBilling[]` | no | — |
| `isLoading` | `boolean` | no | — |

Internos:

- función `formatPercent` `(value: number): string`

- Usa: [`intraCloudBillingInterfaces.ts`](../tipos.md#interfaces-vista-intracloud-billing-intracloudbillinginterfaces-ts), [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`exportExcelBillingIntracloud.ts`](../lib.md#lib-exportexcelbillingintracloud-ts), [`bytesToMbs.ts`](../lib.md#lib-bytestombs-ts)
- Usado por: [`IntraCloudBillingComponent.tsx`](#components-comp-cloud-intracloud-billing-intracloudbillingcomponent-tsx)

---

<a id="components-comp-cloud-intracloud-compute-intracloudcomputecomponent-tsx"></a>
## `components/comp-cloud/intracloud/compute/IntraCloudComputeComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `IntraCloudComputeComponent` `({ payload, startDate, endDate, resourceGroups, resources, service, region }: IntraCloudComputeComponentProps)`

Interfaz `BackendPayload`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `filters` | `Record<string, { resource_group?: string; resources?: string; region?…` | no | — |

- Tipo interno `IntraCloudComputeComponentProps` = `DynamicFilterProps`
Internos:

- función `fetcherPost` `([url, payload]: [string, BackendPayload])`
- función `isNonEmptyArray` `(v: unknown): v is T[]`
- función `isNullish` `(v: unknown)`

- API: `/api/comparison-cloud/bridge/intracloud/aws/compute/get_compute_billing_data`, `/api/comparison-cloud/bridge/intracloud/aws/compute/get_compute_usage`, `/api/comparison-cloud/bridge/intracloud/azure/compute/get_compute_billing_data`, `/api/comparison-cloud/bridge/intracloud/azure/compute/get_compute_usage`, `/api/comparison-cloud/bridge/intracloud/gcp/compute/get_compute_billing_data`, `/api/comparison-cloud/bridge/intracloud/gcp/compute/get_compute_usage`
- Hooks: `useSWR`
- Usa: [`IntraCloudComputeChartComponent.tsx`](#components-comp-cloud-intracloud-compute-grafico-intracloudcomputechartcomponent-tsx), [`IntraCloudComputeCardsByTenantComponent.tsx`](#components-comp-cloud-intracloud-compute-info-intracloudcomputecardsbytenantcomponent-tsx), [`IntraCloudConfigComponent.tsx`](#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx), [`IntraCloudServicesBillingTable.tsx`](#components-comp-cloud-intracloud-services-billing-table-intracloudservicesbillingtable-tsx), [`FilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-filtercomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-profile-comparacion-comparacion-nubes-intranube-computo-page-tsx), [`MainViewIntraCloudComputeComponent.tsx`](#components-comp-cloud-intracloud-compute-mainviewintracloudcomputecomponent-tsx)

---

<a id="components-comp-cloud-intracloud-compute-mainviewintracloudcomputecomponent-tsx"></a>
## `components/comp-cloud/intracloud/compute/MainViewIntraCloudComputeComponent.tsx`

**Componente (cliente)**

'use client'

Exporta:

- componente `MainViewIntraCloudComputeComponent` `({ payload }: MainViewIntraCloudComputeComponentProps)`

Interfaz `MainViewIntraCloudComputeComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `payload` | `ReqPayload` | no | — |

- Usa: [`IntraCloudConfigComponent.tsx`](#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx), [`IntraCloudBillingComponent.tsx`](#components-comp-cloud-intracloud-billing-intracloudbillingcomponent-tsx), [`FilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-filtercomponent-tsx), [`IntraCloudComputeComponent.tsx`](#components-comp-cloud-intracloud-compute-intracloudcomputecomponent-tsx)
- Usado por: [`IntraCloudSelectionComponent.tsx`](#components-comp-cloud-intracloud-intracloudselectioncomponent-tsx)

---

<a id="components-comp-cloud-intracloud-compute-grafico-intracloudcomputechartcomponent-tsx"></a>
## `components/comp-cloud/intracloud/compute/grafico/IntraCloudComputeChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `IntraCloudComputeChartComponent` `({ data }: IntraCloudComputeChartComponentProps)`

Interfaz `ComputeMetric`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `avg_value` | `number` | no | — |
| `timestamp` | `string` | no | — |
| `metric_name` | `string` | no | — |

Interfaz `TenantComputeData`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `tenant_id` | `string` | no | — |
| `compute_data` | `ComputeMetric[]` | no | — |

Interfaz `IntraCloudComputeChartComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `TenantComputeData[]` | no | — |

Internos:

- componente `SingleMetricChart` `({ metricName, data }: { metricName: string; data: TenantComputeData[] })`

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../lib.md#lib-echartsglobalconfig-ts), [`bytesToMbs.ts`](../lib.md#lib-bytestombs-ts)
- Usado por: [`IntraCloudComputeComponent.tsx`](#components-comp-cloud-intracloud-compute-intracloudcomputecomponent-tsx)

---

<a id="components-comp-cloud-intracloud-compute-info-intracloudcomputecardsbytenantcomponent-tsx"></a>
## `components/comp-cloud/intracloud/compute/info/IntraCloudComputeCardsByTenantComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `IntraCloudComputeCardsByTenantComponent` `({ data }: IntraCloudComputeCardsComponentProps)`

Interfaz `IntraCloudComputeCardsComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `IntraCloudCompute[]` | sí | — |

Interfaz `ScenarioFactor`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `label` | `string` | no | — |
| `value` | `string` | no | — |
| `condition` | `string` | no | — |

Interfaz `StatusAnalysis`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `status` | `ResourceStatus` | no | — |
| `label` | `string` | no | — |
| `colorClass` | `string` | no | — |
| `icon` | `LucideIcon` | no | — |
| `scenarioTitle` | `string` | sí | — |
| `factors` | `ScenarioFactor[]` | no | — |

- Tipo interno `ResourceStatus` = `'underutilized' | 'overutilized' | 'healthy' | 'unknown'`
Internos:

- constante `gridColsMap`
- función `getMetricUnit` `(metricName: string): string`
- función `analyzeResourceStatus` `(metrics: IntraCloudComputeMetricsSummary[]): StatusAnalysis`
- componente `ThresholdLegend` `()`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`badge.tsx`](ui.md#components-ui-badge-tsx), [`intraCloudComputeInterfaces.ts`](../tipos.md#interfaces-vista-intracloud-compute-intracloudcomputeinterfaces-ts), [`metricUtils.ts`](../lib.md#lib-metricutils-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`bytesToMbs.ts`](../lib.md#lib-bytestombs-ts)
- Usado por: [`IntraCloudComputeComponent.tsx`](#components-comp-cloud-intracloud-compute-intracloudcomputecomponent-tsx)

---

<a id="components-comp-cloud-intracloud-services-billing-table-intracloudservicesbillingcolumns-tsx"></a>
## `components/comp-cloud/intracloud/services_billing/table/IntraCloudServicesBillingColumns.tsx`

**Módulo (cliente)**

Exporta:

- interfaz `AggregatedComputeRow`
- función `getIntraCloudServicesBillingColumns` `(allData: IntraCloudComputeBilling[] | IntraCloudStorageBilling[], cloudProvider: string): DynamicColumn<AggregatedComputeRow>[]`

Interfaz `AggregatedComputeRow` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `dimension_value` | `string` | no | — |
| `resource_search_term` | `string` | sí | — |
| `[key: string]: string \| number \| Record<string, string> \| Record<string, number>;` | `string \| number \| Record<string, string> \| Record<string, number>` | no | — |
| `max_resource_name` | `Record<string, string>` | no | — |
| `max_resource_cost` | `Record<string, number>` | no | — |
| `min_resource_name` | `Record<string, string>` | no | — |
| `min_resource_cost` | `Record<string, number>` | no | — |

Internos:

- función `formatCurrency` `(value: number | undefined)`
- función `getResourceName` `(resourceId: string)`
- componente `CostCell` `({ cost, subLabel }: { cost: number | undefined, subLabel?: string })`
- componente `ComparisonCell` `({ row, tenantIds, cloudProvider }: { row: AggregatedComputeRow, tenantIds: string[], cloudProvider: string })`

- Usa: [`badge.tsx`](ui.md#components-ui-badge-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`dialog.tsx`](ui.md#components-ui-dialog-tsx), [`tooltip.tsx`](ui.md#components-ui-tooltip-tsx), [`columns.tsx`](data-table.md#components-data-table-columns-tsx), [`intraCloudComputeInterfaces.ts`](../tipos.md#interfaces-vista-intracloud-compute-intracloudcomputeinterfaces-ts), [`metricUtils.ts`](../lib.md#lib-metricutils-ts), [`intraCloudStorageInterfaces.ts`](../tipos.md#interfaces-vista-intracloud-storage-intracloudstorageinterfaces-ts)
- Usado por: [`IntraCloudServicesBillingTable.tsx`](#components-comp-cloud-intracloud-services-billing-table-intracloudservicesbillingtable-tsx)

---

<a id="components-comp-cloud-intracloud-services-billing-table-intracloudservicesbillingtable-tsx"></a>
## `components/comp-cloud/intracloud/services_billing/table/IntraCloudServicesBillingTable.tsx`

**Componente (cliente)**

Exporta:

- componente `IntraCloudServicesBillingTable` `({ data, dimension, setDimension, payload }: IntraCloudServicesBillingTableProps)`

Interfaz `IntraCloudServicesBillingTableProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `IntraCloudComputeBilling[] \| IntraCloudStorageBilling[]` | no | — |
| `dimension` | `string` | no | — |
| `setDimension` | `Dispatch<SetStateAction<string>>` | no | — |
| `payload` | `ReqPayload` | no | — |

- Usa: [`columns.tsx`](data-table.md#components-data-table-columns-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`data-table-grouping.tsx`](data-table.md#components-data-table-data-table-grouping-tsx), [`intraCloudComputeInterfaces.ts`](../tipos.md#interfaces-vista-intracloud-compute-intracloudcomputeinterfaces-ts), [`IntraCloudConfigComponent.tsx`](#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx), [`IntraCloudServicesBillingColumns.tsx`](#components-comp-cloud-intracloud-services-billing-table-intracloudservicesbillingcolumns-tsx), [`metricUtils.ts`](../lib.md#lib-metricutils-ts), [`IntraCloudBillingDimSelectionComponent.tsx`](#components-comp-cloud-intracloud-billing-table-intracloudbillingdimselectioncomponent-tsx), [`intraCloudStorageInterfaces.ts`](../tipos.md#interfaces-vista-intracloud-storage-intracloudstorageinterfaces-ts)
- Usado por: [`IntraCloudComputeComponent.tsx`](#components-comp-cloud-intracloud-compute-intracloudcomputecomponent-tsx), [`IntraCloudDiskServiceComponent.tsx`](#components-comp-cloud-intracloud-storage-intraclouddiskservicecomponent-tsx), [`IntraCloudStorageServiceComponent.tsx`](#components-comp-cloud-intracloud-storage-intracloudstorageservicecomponent-tsx)

---

<a id="components-comp-cloud-intracloud-storage-intraclouddiskservicecomponent-tsx"></a>
## `components/comp-cloud/intracloud/storage/IntraCloudDiskServiceComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `IntraCloudDiskServiceComponent` `({ payload, startDate, endDate, resourceGroups, resources, projects, service, region }: IntraCloudDiskServiceComponentProps)`

Interfaz `BackendPayload`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `filters` | `Record<string, { resource_group?: string; resources?: string; project…` | no | — |

- Tipo interno `IntraCloudDiskServiceComponentProps` = `DynamicFilterProps`
Internos:

- función `fetcherPost` `([url, payload]: [string, BackendPayload])`

- API: `/api/comparison-cloud/bridge/intracloud/aws/storage/get_disks_billing_data`, `/api/comparison-cloud/bridge/intracloud/aws/storage/get_disks_usage`, `/api/comparison-cloud/bridge/intracloud/azure/storage/get_disks_billing_data`, `/api/comparison-cloud/bridge/intracloud/azure/storage/get_disks_usage`, `/api/comparison-cloud/bridge/intracloud/gcp/storage/get_disks_billing_data`, `/api/comparison-cloud/bridge/intracloud/gcp/storage/get_disks_usage`
- Hooks: `useSWR`
- Usa: [`IntraCloudConfigComponent.tsx`](#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx), [`IntraCloudServicesBillingTable.tsx`](#components-comp-cloud-intracloud-services-billing-table-intracloudservicesbillingtable-tsx), [`IntraCloudAwsStorageChartComponent.tsx`](#components-comp-cloud-intracloud-storage-aws-grafico-intracloudawsstoragechartcomponent-tsx), [`IntraCloudAwsStorageCardsByTenantComponent.tsx`](#components-comp-cloud-intracloud-storage-aws-info-intracloudawsstoragecardsbytenantcomponent-tsx), [`IntraCloudAzureStorageChartComponent.tsx`](#components-comp-cloud-intracloud-storage-azure-grafico-intracloudazurestoragechartcomponent-tsx), [`IntraCloudAzureStorageCardsByTenantComponent.tsx`](#components-comp-cloud-intracloud-storage-azure-info-intracloudazurestoragecardsbytenantcomponent-tsx), [`FilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-filtercomponent-tsx), [`IntraCloudGcpStorageCardsByTenantComponent.tsx`](#components-comp-cloud-intracloud-storage-gcp-info-intracloudgcpstoragecardsbytenantcomponent-tsx), [`IntraCloudGcpStorageChartComponent.tsx`](#components-comp-cloud-intracloud-storage-gcp-grafico-intracloudgcpstoragechartcomponent-tsx)
- Usado por: [`IntraCloudStorageComponent.tsx`](#components-comp-cloud-intracloud-storage-intracloudstoragecomponent-tsx)

---

<a id="components-comp-cloud-intracloud-storage-intracloudstoragecategoryselectioncomponent-tsx"></a>
## `components/comp-cloud/intracloud/storage/IntraCloudStorageCategorySelectionComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `IntraCloudStorageCategorySelectionComponent` `({ category, setCategory }: IntraCloudStorageCategorySelectionComponentProps)`

Interfaz `IntraCloudStorageCategorySelectionComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `category` | `string` | no | — |
| `setCategory` | `Dispatch<SetStateAction<string>>` | no | — |

- Usa: [`select.tsx`](ui.md#components-ui-select-tsx)
- Usado por: [`IntraCloudStorageComponent.tsx`](#components-comp-cloud-intracloud-storage-intracloudstoragecomponent-tsx)

---

<a id="components-comp-cloud-intracloud-storage-intracloudstoragecomponent-tsx"></a>
## `components/comp-cloud/intracloud/storage/IntraCloudStorageComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `IntraCloudStorageComponent` `({ payload, startDate, endDate, resourceGroups, resources, service, region }: IntraCloudStorageComponentProps)`

Interfaz `BackendPayload`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `filters` | `Record<string, { resource_group?: string; resources?: string; }>` | no | — |

- Tipo interno `IntraCloudStorageComponentProps` = `DynamicFilterProps`
Internos:

- función `fetcherPost` `([url, payload]: [string, BackendPayload])`

- Usa: [`IntraCloudConfigComponent.tsx`](#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx), [`IntraCloudDiskServiceComponent.tsx`](#components-comp-cloud-intracloud-storage-intraclouddiskservicecomponent-tsx), [`IntraCloudStorageServiceComponent.tsx`](#components-comp-cloud-intracloud-storage-intracloudstorageservicecomponent-tsx), [`IntraCloudStorageCategorySelectionComponent.tsx`](#components-comp-cloud-intracloud-storage-intracloudstoragecategoryselectioncomponent-tsx), [`FilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-filtercomponent-tsx)
- Usado por: [`page.tsx`](../rutas.md#app-profile-comparacion-comparacion-nubes-intranube-storage-page-tsx), [`MainViewIntraCloudStorageComponent.tsx`](#components-comp-cloud-intracloud-storage-mainviewintracloudstoragecomponent-tsx)

Notas de implementación:

- AWS envía `s3` (lib/aws_services.ts); antes no calzaba con ninguna rama y la vista quedaba vacía

---

<a id="components-comp-cloud-intracloud-storage-intracloudstorageservicecomponent-tsx"></a>
## `components/comp-cloud/intracloud/storage/IntraCloudStorageServiceComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `IntraCloudStorageServiceComponent` `({ payload, startDate, endDate, resourceGroups, projects, resources, service, region }: IntraCloudStorageServiceComponentProps)`

Interfaz `BackendPayload`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `filters` | `Record<string, { resource_group?: string; resources?: string; project…` | no | — |

- Tipo interno `IntraCloudStorageServiceComponentProps` = `DynamicFilterProps`
Internos:

- función `fetcherPost` `([url, payload]: [string, BackendPayload])`

- API: `/api/comparison-cloud/bridge/intracloud/aws/storage/get_storage_billing_data`, `/api/comparison-cloud/bridge/intracloud/aws/storage/get_storage_usage`, `/api/comparison-cloud/bridge/intracloud/azure/storage/get_storage_billing_data`, `/api/comparison-cloud/bridge/intracloud/azure/storage/get_storage_usage`, `/api/comparison-cloud/bridge/intracloud/gcp/storage/get_storage_billing_data`, `/api/comparison-cloud/bridge/intracloud/gcp/storage/get_storage_usage`
- Hooks: `useSWR`
- Usa: [`IntraCloudConfigComponent.tsx`](#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx), [`IntraCloudServicesBillingTable.tsx`](#components-comp-cloud-intracloud-services-billing-table-intracloudservicesbillingtable-tsx), [`IntraCloudAwsStorageChartComponent.tsx`](#components-comp-cloud-intracloud-storage-aws-grafico-intracloudawsstoragechartcomponent-tsx), [`IntraCloudAwsStorageCardsByTenantComponent.tsx`](#components-comp-cloud-intracloud-storage-aws-info-intracloudawsstoragecardsbytenantcomponent-tsx), [`IntraCloudAzureStorageChartComponent.tsx`](#components-comp-cloud-intracloud-storage-azure-grafico-intracloudazurestoragechartcomponent-tsx), [`IntraCloudAzureStorageCardsByTenantComponent.tsx`](#components-comp-cloud-intracloud-storage-azure-info-intracloudazurestoragecardsbytenantcomponent-tsx), [`FilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-filtercomponent-tsx), [`IntraCloudGcpStorageCardsByTenantComponent.tsx`](#components-comp-cloud-intracloud-storage-gcp-info-intracloudgcpstoragecardsbytenantcomponent-tsx), [`IntraCloudGcpStorageChartComponent.tsx`](#components-comp-cloud-intracloud-storage-gcp-grafico-intracloudgcpstoragechartcomponent-tsx)
- Usado por: [`IntraCloudStorageComponent.tsx`](#components-comp-cloud-intracloud-storage-intracloudstoragecomponent-tsx)

---

<a id="components-comp-cloud-intracloud-storage-mainviewintracloudstoragecomponent-tsx"></a>
## `components/comp-cloud/intracloud/storage/MainViewIntraCloudStorageComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewIntraCloudStorageComponent` `({ payload }: MainViewIntraCloudStorageComponentProps)`

Interfaz `MainViewIntraCloudStorageComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `payload` | `ReqPayload` | no | — |

- Usa: [`IntraCloudConfigComponent.tsx`](#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx), [`FilterComponent.tsx`](general_comp_cloud.md#components-general-comp-cloud-filters-filtercomponent-tsx), [`IntraCloudStorageComponent.tsx`](#components-comp-cloud-intracloud-storage-intracloudstoragecomponent-tsx)
- Usado por: [`IntraCloudSelectionComponent.tsx`](#components-comp-cloud-intracloud-intracloudselectioncomponent-tsx)

---

<a id="components-comp-cloud-intracloud-storage-aws-grafico-intracloudawsstoragechartcomponent-tsx"></a>
## `components/comp-cloud/intracloud/storage/aws/grafico/IntraCloudAwsStorageChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `IntraCloudAwsStorageChartComponent` `({ data, service }: IntraCloudAwsStorageChartComponentProps)`

Interfaz `IntraCloudAwsStorageChartComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `IntraCloudStorage[]` | no | — |
| `service` | `string` | no | — |

Internos:

- componente `SingleMetricChart` `({ metricName, data, service }: { metricName: string; data: IntraCloudStorage[] | IntraCloudDisks[], service: string })`

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../lib.md#lib-echartsglobalconfig-ts), [`bytesToMbs.ts`](../lib.md#lib-bytestombs-ts), [`intraCloudStorageInterfaces.ts`](../tipos.md#interfaces-vista-intracloud-storage-intracloudstorageinterfaces-ts), [`intraCloudDisksInterfaces.ts`](../tipos.md#interfaces-vista-intracloud-storage-intraclouddisksinterfaces-ts)
- Usado por: [`IntraCloudDiskServiceComponent.tsx`](#components-comp-cloud-intracloud-storage-intraclouddiskservicecomponent-tsx), [`IntraCloudStorageServiceComponent.tsx`](#components-comp-cloud-intracloud-storage-intracloudstorageservicecomponent-tsx)

---

<a id="components-comp-cloud-intracloud-storage-aws-info-intracloudawsstoragecardsbytenantcomponent-tsx"></a>
## `components/comp-cloud/intracloud/storage/aws/info/IntraCloudAwsStorageCardsByTenantComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `IntraCloudAwsStorageCardsByTenantComponent` `({ data, service }: IntraCloudAwsStorageCardsByTenantComponentProps)`

Interfaz `IntraCloudAwsStorageCardsByTenantComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `IntraCloudStorage[]` | sí | — |
| `service` | `string` | no | — |

Internos:

- constante `gridColsMap`
- función `getMetricUnit` `(metricName: string): string`
- componente `MetricItem` `({ metric }: { metric: IntraCloudStorageMetricsSummary })`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`intraCloudStorageInterfaces.ts`](../tipos.md#interfaces-vista-intracloud-storage-intracloudstorageinterfaces-ts), [`metricUtils.ts`](../lib.md#lib-metricutils-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`bytesToMbs.ts`](../lib.md#lib-bytestombs-ts)
- Usado por: [`IntraCloudDiskServiceComponent.tsx`](#components-comp-cloud-intracloud-storage-intraclouddiskservicecomponent-tsx), [`IntraCloudStorageServiceComponent.tsx`](#components-comp-cloud-intracloud-storage-intracloudstorageservicecomponent-tsx)

---

<a id="components-comp-cloud-intracloud-storage-azure-grafico-intracloudazurestoragechartcomponent-tsx"></a>
## `components/comp-cloud/intracloud/storage/azure/grafico/IntraCloudAzureStorageChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `IntraCloudAzureStorageChartComponent` `({ data, service }: IntraCloudAzureStorageChartComponentProps)`

Interfaz `IntraCloudAzureStorageChartComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `IntraCloudStorage[] \| IntraCloudDisks[]` | sí | — |
| `service` | `string` | no | — |

Internos:

- función `formatServiceTitle` `(serviceType: string)`
- función `getServiceIcon` `(serviceType: string)`
- componente `SingleMetricChart` `({ serviceType, metricName, data, service }: { serviceType: string; metricName: string; data: IntraCloudStorage[] | Int…`

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../lib.md#lib-echartsglobalconfig-ts), [`bytesToMbs.ts`](../lib.md#lib-bytestombs-ts), [`intraCloudStorageInterfaces.ts`](../tipos.md#interfaces-vista-intracloud-storage-intracloudstorageinterfaces-ts), [`intraCloudDisksInterfaces.ts`](../tipos.md#interfaces-vista-intracloud-storage-intraclouddisksinterfaces-ts)
- Usado por: [`IntraCloudDiskServiceComponent.tsx`](#components-comp-cloud-intracloud-storage-intraclouddiskservicecomponent-tsx), [`IntraCloudStorageServiceComponent.tsx`](#components-comp-cloud-intracloud-storage-intracloudstorageservicecomponent-tsx)

---

<a id="components-comp-cloud-intracloud-storage-azure-info-intracloudazurestoragecardsbytenantcomponent-tsx"></a>
## `components/comp-cloud/intracloud/storage/azure/info/IntraCloudAzureStorageCardsByTenantComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `IntraCloudAzureStorageCardsByTenantComponent` `({ data, service }: IntraCloudAzureStorageCardsByTenantComponentProps)`

Interfaz `IntraCloudAzureStorageCardsByTenantComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `IntraCloudStorage[] \| IntraCloudDisks[]` | sí | — |
| `service` | `string` | no | — |

- Tipo interno `MetricSummary` = `IntraCloudStorageMetricsSummary | IntraCloudDisksMetricsSummary`
Internos:

- constante `gridColsMap`
- función `getMetricUnit` `(metricName: string): string`
- función `getServiceIcon` `(serviceType: string)`
- función `formatServiceTitle` `(serviceType: string)`
- componente `MetricItem` `({ metric }: { metric: MetricSummary })`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`intraCloudStorageInterfaces.ts`](../tipos.md#interfaces-vista-intracloud-storage-intracloudstorageinterfaces-ts), [`metricUtils.ts`](../lib.md#lib-metricutils-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`bytesToMbs.ts`](../lib.md#lib-bytestombs-ts), [`intraCloudDisksInterfaces.ts`](../tipos.md#interfaces-vista-intracloud-storage-intraclouddisksinterfaces-ts)
- Usado por: [`IntraCloudDiskServiceComponent.tsx`](#components-comp-cloud-intracloud-storage-intraclouddiskservicecomponent-tsx), [`IntraCloudStorageServiceComponent.tsx`](#components-comp-cloud-intracloud-storage-intracloudstorageservicecomponent-tsx)

---

<a id="components-comp-cloud-intracloud-storage-gcp-grafico-intracloudgcpstoragechartcomponent-tsx"></a>
## `components/comp-cloud/intracloud/storage/gcp/grafico/IntraCloudGcpStorageChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `IntraCloudGcpStorageChartComponent` `({ data, service }: IntraCloudGcpStorageChartComponentProps)`

Interfaz `IntraCloudGcpStorageChartComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `IntraCloudStorage[]` | no | — |
| `service` | `string` | no | — |

Internos:

- componente `SingleMetricChart` `({ metricName, data, service }: { metricName: string; data: IntraCloudStorage[] | IntraCloudDisks[], service: string })`

- Hooks: `useECharts`, `useTheme`
- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`echartsGlobalConfig.ts`](../lib.md#lib-echartsglobalconfig-ts), [`bytesToMbs.ts`](../lib.md#lib-bytestombs-ts), [`intraCloudStorageInterfaces.ts`](../tipos.md#interfaces-vista-intracloud-storage-intracloudstorageinterfaces-ts), [`intraCloudDisksInterfaces.ts`](../tipos.md#interfaces-vista-intracloud-storage-intraclouddisksinterfaces-ts)
- Usado por: [`IntraCloudDiskServiceComponent.tsx`](#components-comp-cloud-intracloud-storage-intraclouddiskservicecomponent-tsx), [`IntraCloudStorageServiceComponent.tsx`](#components-comp-cloud-intracloud-storage-intracloudstorageservicecomponent-tsx)

---

<a id="components-comp-cloud-intracloud-storage-gcp-info-intracloudgcpstoragecardsbytenantcomponent-tsx"></a>
## `components/comp-cloud/intracloud/storage/gcp/info/IntraCloudGcpStorageCardsByTenantComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `IntraCloudGcpStorageCardsByTenantComponent` `({ data, service }: IntraCloudGcpStorageCardsByTenantComponentProps)`

Interfaz `IntraCloudGcpStorageCardsByTenantComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `data` | `IntraCloudStorage[]` | sí | — |
| `service` | `string` | no | — |

Internos:

- constante `gridColsMap`
- función `getMetricUnit` `(metricName: string): string`
- componente `MetricItem` `({ metric }: { metric: IntraCloudStorageMetricsSummary })`

- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`intraCloudStorageInterfaces.ts`](../tipos.md#interfaces-vista-intracloud-storage-intracloudstorageinterfaces-ts), [`metricUtils.ts`](../lib.md#lib-metricutils-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`bytesToMbs.ts`](../lib.md#lib-bytestombs-ts)
- Usado por: [`IntraCloudDiskServiceComponent.tsx`](#components-comp-cloud-intracloud-storage-intraclouddiskservicecomponent-tsx), [`IntraCloudStorageServiceComponent.tsx`](#components-comp-cloud-intracloud-storage-intracloudstorageservicecomponent-tsx)

---

<a id="components-comp-cloud-multicloud-mainviewmulticloudcomponent-tsx"></a>
## `components/comp-cloud/multicloud/MainViewMultiCloudComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MainViewMultiTenantComponent` `()`

Interfaz `CloudConfigOption`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id` | `CloudProvider` | no | — |
| `active` | `boolean` | no | — |
| `label` | `string` | no | — |
| `logo` | `string` | no | — |
| `accounts` | `CloudAccount[]` | no | — |

- Hooks: `useFeatureAccess`, `useMultiTenantSelection`
- Usa: [`MultiCloudFiltersComponent.tsx`](#components-comp-cloud-multicloud-filters-multicloudfilterscomponent-tsx), [`MultiCloudComponent.tsx`](#components-comp-cloud-multicloud-multicloudcomponent-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`checkbox.tsx`](ui.md#components-ui-checkbox-tsx), [`useFeatureAccess.ts`](../hooks.md#hooks-usefeatureaccess-ts), [`useMultiTenantSelection.ts`](../hooks.md#hooks-usemultitenantselection-ts), [`utils.ts`](../lib.md#lib-utils-ts)
- Usado por: [`page.tsx`](../rutas.md#app-profile-comparacion-comparacion-nubes-multinube-page-tsx)

Notas de implementación:

- Arreglo maestro tipado
- Validaciones seguras para TypeScript con Optional Chaining
- VISTA DEL DASHBOARD (Paso 3)
- JSX — BOTÓN STICKY DE VOLVER
- VISTA DE CONFIGURACIÓN (Pasos 1 y 2)
- JSX — PASO 1: SELECTOR DE NUBES
- JSX — PASO 2: SELECCIÓN DE TENANTS

---

<a id="components-comp-cloud-multicloud-multicloudcomponent-tsx"></a>
## `components/comp-cloud/multicloud/MultiCloudComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `GlobalBillingMultiTenantDashboard` `({ startDate, endDate, dateMode = 'monthly', selectedMonths = [], azTagKey, azTagValue, awsTagKey, awsTagValue, gcpTagKey, gcpTagValue, selectedClouds, selecte…`

Interfaz `GlobalBillingMultiTenantDashboardProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `selectedClouds` | `CloudProvider[]` | no | — |
| `selectedTenants` | `MultiTenantSelection` | no | — |
| `accountsList` | `{ azure: CloudAccount[]; aws: CloudAccount[]; gcp: CloudAccount[]; }` | no | — |

Internos:

- función `pointsInMonths` `(trend: BillingTrend | undefined, monthsKey: string): BillingPoint[]` — Puntos de la tendencia, limitados a los meses "YYYY-MM" de `monthsKey` (separados por coma; vacío = todos).

- Hooks: `useSWR`, `useSession`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`card.tsx`](ui.md#components-ui-card-tsx), [`utils.ts`](../lib.md#lib-utils-ts), [`useSession.ts`](../hooks.md#hooks-usesession-ts), [`LoaderComponent.tsx`](general_aws.md#components-general-aws-loadercomponent-tsx), [`billing.ts`](../tipos.md#interfaces-billing-ts), [`billing.ts`](../lib.md#lib-billing-ts), [`consumption.ts`](../lib.md#lib-consumption-ts), [`CostMetricInfo.tsx`](shared.md#components-shared-billing-costmetricinfo-tsx), [`useMultiTenantSelection.ts`](../hooks.md#hooks-usemultitenantselection-ts), [`MultiCloudFiltersComponent.tsx`](#components-comp-cloud-multicloud-filters-multicloudfilterscomponent-tsx), [`MultiCloudLineChartComponent.tsx`](#components-comp-cloud-multicloud-grafico-multicloudlinechartcomponent-tsx), [`MultiCloudServiceBarChartComponent.tsx`](#components-comp-cloud-multicloud-grafico-multicloudservicebarchartcomponent-tsx), [`MultiCloudMonthlyServiceChartComponent.tsx`](#components-comp-cloud-multicloud-grafico-multicloudmonthlyservicechartcomponent-tsx)
- Usado por: [`MainViewMultiCloudComponent.tsx`](#components-comp-cloud-multicloud-mainviewmulticloudcomponent-tsx)

Notas de implementación:

- Sólo se envían IDs de cuenta: el back end resuelve las BD desde el token.
- Varios meses sueltos: se pide el rango que los cubre y se filtran los puntos por mes (la API no recibe una lista de meses).

---

<a id="components-comp-cloud-multicloud-filters-multicloudfilterscomponent-tsx"></a>
## `components/comp-cloud/multicloud/filters/MultiCloudFiltersComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `AppliedMultiCloudFilters`
- componente `MultiCloudFiltersComponent` `({ selectedClouds, selectedTenants, accountsList, Component }: MultiCloudFiltersComponentProps)`

Interfaz `AppliedMultiCloudFilters` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `dateMode` | `'monthly'` | no | — |
| `selectedMonths` | `string[]` | no | — |
| `azTagKey` | `string \| null` | no | — |
| `azTagValue` | `string \| null` | no | — |
| `awsTagKey` | `string \| null` | no | — |
| `awsTagValue` | `string \| null` | no | — |
| `gcpTagKey` | `string \| null` | no | — |
| `gcpTagValue` | `string \| null` | no | — |

Interfaz `MultiCloudFiltersComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `selectedClouds` | `CloudProvider[]` | no | — |
| `selectedTenants` | `MultiTenantSelection` | no | — |
| `accountsList` | `{ azure: CloudAccount[]; aws: CloudAccount[]; gcp: CloudAccount[]; }` | no | — |
| `Component` | `ComponentType<AppliedMultiCloudFilters & { selectedClouds: CloudProvi…` | no | — |

- Hooks: `useRouter`, `useSearchParams`
- Usa: [`card.tsx`](ui.md#components-ui-card-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`MultiCloudTagFilter.tsx`](#components-comp-cloud-multicloud-filters-multicloudtagfilter-tsx), [`useMultiTenantSelection.ts`](../hooks.md#hooks-usemultitenantselection-ts)
- Usado por: [`MainViewMultiCloudComponent.tsx`](#components-comp-cloud-multicloud-mainviewmulticloudcomponent-tsx), [`MultiCloudComponent.tsx`](#components-comp-cloud-multicloud-multicloudcomponent-tsx)

Notas de implementación:

- _MultiCloudFiltersComponent_: Sólo se envían IDs de cuenta: el back end resuelve las BD desde el token.

---

<a id="components-comp-cloud-multicloud-filters-multicloudtagfilter-tsx"></a>
## `components/comp-cloud/multicloud/filters/MultiCloudTagFilter.tsx`

**Componente (cliente)**

Exporta:

- componente `MultiCloudTagFilter` `({ provider, accountIds, startDate, endDate, selectedKey, selectedValue, onChange }: MultiCloudTagFilterProps)`

Interfaz `MultiCloudTagFilterProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `provider` | `'azure' \| 'aws' \| 'gcp'` | no | — |
| `accountIds` | `string` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `selectedKey` | `string \| null` | sí | — |
| `selectedValue` | `string \| null` | sí | — |
| `onChange` | `(key: string \| null, value: string \| null) => void` | no | — |

Interfaz `TagItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `Key` | `string` | no | — |
| `Values` | `string[]` | no | — |

- API: `/api/aws/bridge/multitenant/get-all-tags`, `/api/azure/bridge/azure/multitenant/get-all-tags`, `/api/gcp/bridge/gcp/general/multitenant/get_all_tags`
- Hooks: `useSWR`
- Usa: [`fetcher.ts`](../lib.md#lib-fetcher-ts), [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx)
- Usado por: [`MultiCloudFiltersComponent.tsx`](#components-comp-cloud-multicloud-filters-multicloudfilterscomponent-tsx)

Notas de implementación:

- Formateo de fechas
- URL dinámica según el proveedor
- Lógica de transformación de datos
- 1. Efecto para asignar valores por DEFECTO ('allKeys' / 'allValues')
- Si no hay key seleccionada, forzar 'allKeys'
- Si hay key pero no hay valor, forzar 'allValues'
- 2. Efecto de Limpieza / Validación si los datos cambian
- Si la key seleccionada ya no existe en los nuevos datos (y no es 'allKeys'), resetear a default
- Si el valor seleccionado ya no existe para la key actual (y no es 'allValues'), resetear valor
- JSX — Combo 1: KEY
- JSX — Combo 2: VALUE

---

<a id="components-comp-cloud-multicloud-grafico-multicloudlinechartcomponent-tsx"></a>
## `components/comp-cloud/multicloud/grafico/MultiCloudLineChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MultiCloudLineChartComponent` `({ azureData, awsData, gcpData, selectedClouds, isLoading, startDate, endDate, dateMode, selectedMonths }: MultiCloudLineChartProps)`

Interfaz `MultiCloudLineChartProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `azureData` | `BillingPoint[]` | no | — |
| `awsData` | `BillingPoint[]` | no | — |
| `gcpData` | `BillingPoint[]` | no | — |
| `selectedClouds` | `CloudProvider[] \| string[]` | no | — |
| `isLoading` | `boolean` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `dateMode` | `string` | no | — |
| `selectedMonths` | `string[]` | no | — |

Internos:

- función `formatMonthName` `(yyyyMm: string)`

- Hooks: `useECharts`, `useTheme`
- Usa: [`echartsGlobalConfig.ts`](../lib.md#lib-echartsglobalconfig-ts), [`billing.ts`](../tipos.md#interfaces-billing-ts), [`useMultiTenantSelection.ts`](../hooks.md#hooks-usemultitenantselection-ts)
- Usado por: [`MultiCloudComponent.tsx`](#components-comp-cloud-multicloud-multicloudcomponent-tsx)

---

<a id="components-comp-cloud-multicloud-grafico-multicloudmonthlyservicechartcomponent-tsx"></a>
## `components/comp-cloud/multicloud/grafico/MultiCloudMonthlyServiceChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MultiCloudMonthlyServiceChartComponent` `({ azureData, awsData, gcpData, selectedClouds, isLoading, startDate, endDate, dateMode, selectedMonths }: MultiCloudMonthlyServiceProps)`

Interfaz `MultiCloudMonthlyServiceProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `azureData` | `BillingPoint[]` | no | — |
| `awsData` | `BillingPoint[]` | no | — |
| `gcpData` | `BillingPoint[]` | no | — |
| `selectedClouds` | `CloudProvider[] \| string[]` | no | — |
| `isLoading` | `boolean` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `dateMode` | `string` | no | — |
| `selectedMonths` | `string[]` | no | — |

- Tipo interno `MonthlyDataMap` = `Record<string, Record<'azure' | 'aws' | 'gcp', Record<string, number>>>`
Internos:

- constante `CATEGORY_COLORS`
- función `normalizeCategory` `(point: BillingPoint)`
- función `formatMonthName` `(yyyyMm: string)`

- Hooks: `useECharts`, `useTheme`
- Usa: [`echartsGlobalConfig.ts`](../lib.md#lib-echartsglobalconfig-ts), [`billing.ts`](../tipos.md#interfaces-billing-ts), [`useMultiTenantSelection.ts`](../hooks.md#hooks-usemultitenantselection-ts)
- Usado por: [`MultiCloudComponent.tsx`](#components-comp-cloud-multicloud-multicloudcomponent-tsx)

---

<a id="components-comp-cloud-multicloud-grafico-multicloudservicebarchartcomponent-tsx"></a>
## `components/comp-cloud/multicloud/grafico/MultiCloudServiceBarChartComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MultiCloudServiceBarChartComponent` `({ azureData, awsData, gcpData, selectedClouds, isLoading = false }: MultiCloudServiceBarProps)`

Interfaz `MultiCloudServiceBarProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `azureData` | `BillingPoint[]` | no | — |
| `awsData` | `BillingPoint[]` | no | — |
| `gcpData` | `BillingPoint[]` | no | — |
| `selectedClouds` | `CloudProvider[] \| string[]` | no | — |
| `isLoading` | `boolean` | sí | — |

- Hooks: `useECharts`, `useTheme`
- Usa: [`echartsGlobalConfig.ts`](../lib.md#lib-echartsglobalconfig-ts), [`billing.ts`](../tipos.md#interfaces-billing-ts), [`useMultiTenantSelection.ts`](../hooks.md#hooks-usemultitenantselection-ts)
- Usado por: [`MultiCloudComponent.tsx`](#components-comp-cloud-multicloud-multicloudcomponent-tsx)

