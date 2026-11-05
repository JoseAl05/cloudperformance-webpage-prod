# Componentes `components/general_comp_cloud/`

[← Índice](../README.md)

Filtros multitenant de la comparación de nubes (proyectos, recursos, resource groups, servicios, suscripciones, etiquetas).

Archivos:

- [`components/general_comp_cloud/FilterSkeletonComponent.tsx`](#components-general-comp-cloud-filterskeletoncomponent-tsx)
- [`components/general_comp_cloud/filters/FilterComponent.tsx`](#components-general-comp-cloud-filters-filtercomponent-tsx)
- [`components/general_comp_cloud/filters/MultiTenantProjectsFilterComponent.tsx`](#components-general-comp-cloud-filters-multitenantprojectsfiltercomponent-tsx)
- [`components/general_comp_cloud/filters/MultiTenantResourceFilterComponent.tsx`](#components-general-comp-cloud-filters-multitenantresourcefiltercomponent-tsx)
- [`components/general_comp_cloud/filters/MultiTenantResourceGroupFilterComponent.tsx`](#components-general-comp-cloud-filters-multitenantresourcegroupfiltercomponent-tsx)
- [`components/general_comp_cloud/filters/MultiTenantServiceFilterComponent.tsx`](#components-general-comp-cloud-filters-multitenantservicefiltercomponent-tsx)
- [`components/general_comp_cloud/filters/MultiTenantSubscriptionsFilterComponent.tsx`](#components-general-comp-cloud-filters-multitenantsubscriptionsfiltercomponent-tsx)
- [`components/general_comp_cloud/filters/MultiTenantTagsFilterComponent.tsx`](#components-general-comp-cloud-filters-multitenanttagsfiltercomponent-tsx)

<a id="components-general-comp-cloud-filterskeletoncomponent-tsx"></a>
## `components/general_comp_cloud/FilterSkeletonComponent.tsx`

**Componente**

Exporta:

- componente `FilterSkeleton` `()`

- Usado por: [`MultiTenantProjectsFilterComponent.tsx`](#components-general-comp-cloud-filters-multitenantprojectsfiltercomponent-tsx), [`MultiTenantResourceFilterComponent.tsx`](#components-general-comp-cloud-filters-multitenantresourcefiltercomponent-tsx), [`MultiTenantResourceGroupFilterComponent.tsx`](#components-general-comp-cloud-filters-multitenantresourcegroupfiltercomponent-tsx), [`MultiTenantSubscriptionsFilterComponent.tsx`](#components-general-comp-cloud-filters-multitenantsubscriptionsfiltercomponent-tsx), [`MultiTenantTagsFilterComponent.tsx`](#components-general-comp-cloud-filters-multitenanttagsfiltercomponent-tsx)

---

<a id="components-general-comp-cloud-filters-filtercomponent-tsx"></a>
## `components/general_comp_cloud/filters/FilterComponent.tsx`

**Componente (cliente)**

Exporta:

- interfaz `DynamicFilterProps`
- componente `FiltersComponent` `({ Component, dateFilter = true, regionFilter = false, subscriptionIdFilter = false, projectIdFilter = false, isRegionMultiSelect = false, isOnlyYearFilter = f…`

Interfaz `DynamicFilterProps` (exportada):

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | sí | — |
| `region` | `string` | no | — |
| `subscriptions` | `Record<string, string>` | no | — |
| `projects` | `Record<string, string>` | no | — |
| `resourceGroups` | `Record<string, string>` | no | — |
| `tagKeys` | `Record<string, string \| null>` | no | — |
| `tagValues` | `Record<string, string \| null>` | no | — |
| `resources` | `Record<string, string>` | no | — |
| `service` | `string` | no | — |
| `payload` | `IntraCloudReqPayload \| InterCloudReqPayload` | no | — |

Interfaz `FiltersComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `Component` | `(params: DynamicFilterProps) => React.JSX.Element` | no | — |
| `dateFilter` | `boolean` | sí | — |
| `regionFilter` | `boolean` | sí | — |
| `subscriptionIdFilter` | `boolean` | sí | — |
| `projectIdFilter` | `boolean` | sí | — |
| `isRegionMultiSelect` | `boolean` | sí | — |
| `isOnlyYearFilter` | `boolean` | sí | — |
| `tagsFilter` | `boolean` | sí | — |
| `resourceGroupFilter` | `boolean` | sí | — |
| `serviceFilter` | `boolean` | sí | — |
| `serviceType` | `string` | sí | — |
| `resourceFilter` | `boolean` | sí | — |
| `payload` | `IntraCloudReqPayload \| InterCloudReqPayload` | no | — |

Internos:

- componente `FilterSeparator` `()`
- componente `CascadeInfo` `()`

- Hooks: `useRouter`, `useSearchParams`
- Usa: [`RegionFilterComponent.tsx`](general_azure.md#components-general-azure-filters-regionfiltercomponent-tsx), [`RegionFilterComponent.tsx`](general_aws.md#components-general-aws-filters-regionfiltercomponent-tsx), [`RegionsFilterComponent.tsx`](general_gcp.md#components-general-gcp-filters-regionsfiltercomponent-tsx), [`card.tsx`](ui.md#components-ui-card-tsx), [`button.tsx`](ui.md#components-ui-button-tsx), [`MultiTenantSubscriptionsFilterComponent.tsx`](#components-general-comp-cloud-filters-multitenantsubscriptionsfiltercomponent-tsx), [`IntraCloudConfigComponent.tsx`](comp-cloud.md#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx), [`InterCloudConfigComponent.tsx`](comp-cloud.md#components-comp-cloud-intercloud-intercloudconfigcomponent-tsx), [`MultiTenantTagsFilterComponent.tsx`](#components-general-comp-cloud-filters-multitenanttagsfiltercomponent-tsx), [`MultiTenantResourceGroupFilterComponent.tsx`](#components-general-comp-cloud-filters-multitenantresourcegroupfiltercomponent-tsx), [`MultiTenantServiceFilterComponent.tsx`](#components-general-comp-cloud-filters-multitenantservicefiltercomponent-tsx), [`MultiTenantResourceFilterComponent.tsx`](#components-general-comp-cloud-filters-multitenantresourcefiltercomponent-tsx), [`MultiTenantProjectsFilterComponent.tsx`](#components-general-comp-cloud-filters-multitenantprojectsfiltercomponent-tsx)
- Usado por: [`InterCloudVmComponent.tsx`](comp-cloud.md#components-comp-cloud-intercloud-virtual-machines-intercloudvmcomponent-tsx), [`MainViewInterCloudVmComponent.tsx`](comp-cloud.md#components-comp-cloud-intercloud-virtual-machines-mainviewintercloudvmcomponent-tsx), [`IntraCloudBillingComponent.tsx`](comp-cloud.md#components-comp-cloud-intracloud-billing-intracloudbillingcomponent-tsx), [`MainViewIntraCloudBillingComponent.tsx`](comp-cloud.md#components-comp-cloud-intracloud-billing-mainviewintracloudbillingcomponent-tsx), [`IntraCloudComputeComponent.tsx`](comp-cloud.md#components-comp-cloud-intracloud-compute-intracloudcomputecomponent-tsx), [`MainViewIntraCloudComputeComponent.tsx`](comp-cloud.md#components-comp-cloud-intracloud-compute-mainviewintracloudcomputecomponent-tsx), [`IntraCloudDiskServiceComponent.tsx`](comp-cloud.md#components-comp-cloud-intracloud-storage-intraclouddiskservicecomponent-tsx), [`IntraCloudStorageComponent.tsx`](comp-cloud.md#components-comp-cloud-intracloud-storage-intracloudstoragecomponent-tsx), [`IntraCloudStorageServiceComponent.tsx`](comp-cloud.md#components-comp-cloud-intracloud-storage-intracloudstorageservicecomponent-tsx), [`MainViewIntraCloudStorageComponent.tsx`](comp-cloud.md#components-comp-cloud-intracloud-storage-mainviewintracloudstoragecomponent-tsx)

---

<a id="components-general-comp-cloud-filters-multitenantprojectsfiltercomponent-tsx"></a>
## `components/general_comp_cloud/filters/MultiTenantProjectsFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MultiTenantProjectsFilterComponent` `({ projectsMap, setProjectsMap, startDate, endDate, payload }: MultiTenantProjectsFilterComponentProps)`

Interfaz `MultiTenantProjectsFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `projectsMap` | `Record<string, string>` | no | — |
| `setProjectsMap` | `Dispatch<SetStateAction<Record<string, string>>>` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `payload` | `ReqPayload` | no | — |

Interfaz `ProjectItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_project` | `string` | no | — |
| `project_name` | `string` | no | — |

Internos:

- función `fetcherPost` `([url, payload]: [string, unknown])`
- componente `TenantCombobox` `({ label, projects, selectedValue, onToggle }: { label: string, projects: ProjectItem[], selectedValue: string, onToggl…`

- API: `/api/comparison-cloud/bridge/intracloud/gcp/projects/all_projects_ids`
- Hooks: `useSWR`
- Usa: [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`IntraCloudConfigComponent.tsx`](comp-cloud.md#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx), [`FilterSkeletonComponent.tsx`](#components-general-comp-cloud-filterskeletoncomponent-tsx)
- Usado por: [`FilterComponent.tsx`](#components-general-comp-cloud-filters-filtercomponent-tsx)

Notas de implementación:

- _TenantCombobox_: `value={project.project_name}` — Usamos nombre para búsqueda visual
- _TenantCombobox_: `onSelect={() => handleSelect(project.id_project)}` — ID para lógica

---

<a id="components-general-comp-cloud-filters-multitenantresourcefiltercomponent-tsx"></a>
## `components/general_comp_cloud/filters/MultiTenantResourceFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MultiTenantResourceFilterComponent` `({ resourcesMap, setResourcesMap, startDate, endDate, service, payload }: MultiTenantResourceFilterComponentProps)`

Interfaz `MultiTenantResourceFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resourcesMap` | `Record<string, string>` | no | — |
| `setResourcesMap` | `Dispatch<SetStateAction<Record<string, string>>>` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `service` | `string` | no | — |
| `payload` | `ReqPayload` | no | — |

Interfaz `ResourceItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource_id` | `string` | no | — |
| `resource_name` | `string` | no | — |

Internos:

- función `fetcherPost` `([url, payload]: [string, unknown])`
- componente `TenantCombobox` `({ label, resources, selectedValue, onToggle }: { label: string, resources: ResourceItem[], selectedValue: string, onTo…`

- API: `/api/comparison-cloud/bridge/intracloud/aws/resources/get_all_resources`, `/api/comparison-cloud/bridge/intracloud/azure/resources/get_all_resources`, `/api/comparison-cloud/bridge/intracloud/gcp/resources/get_all_resources`
- Hooks: `useSWR`
- Usa: [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`IntraCloudConfigComponent.tsx`](comp-cloud.md#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx), [`FilterSkeletonComponent.tsx`](#components-general-comp-cloud-filterskeletoncomponent-tsx)
- Usado por: [`FilterComponent.tsx`](#components-general-comp-cloud-filters-filtercomponent-tsx)

---

<a id="components-general-comp-cloud-filters-multitenantresourcegroupfiltercomponent-tsx"></a>
## `components/general_comp_cloud/filters/MultiTenantResourceGroupFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MultiTenantResourceGroupFilterComponent` `({ resourceGroupsMap, setResourceGroupsMap, tagKeysMap, tagValuesMap, startDate, endDate, service, payload }: MultiTenantResourceGroupFilterComponentProps)`

Interfaz `MultiTenantResourceGroupFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resourceGroupsMap` | `Record<string, string>` | no | — |
| `setResourceGroupsMap` | `Dispatch<SetStateAction<Record<string, string>>>` | no | — |
| `tagKeysMap` | `Record<string, string \| null>` | no | — |
| `tagValuesMap` | `Record<string, string \| null>` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `service` | `string` | no | — |
| `payload` | `FilterPayload` | no | — |

Interfaz `ResourceGroupItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `resource_group` | `string` | no | — |

- Tipo interno `FilterPayload` = `IntraCloudReqPayload | InterCloudReqPayload`
- Tipo interno `BackendPayload` = `FilterPayload & { filters: Record<string, { tagKey?: string | null; tagValue?: string | null; }>; }`
Internos:

- función `getTenantIds` `(payload: FilterPayload): string[]`
- función `fetcherPost` `([url, payload]: [string, BackendPayload])`
- componente `TenantCombobox` `({ label, resourceGroups, selectedValue, onToggle }: { label: string, resourceGroups: ResourceGroupItem[], selectedValu…`

- API: `/api/comparison-cloud/bridge/intracloud/azure/resource_groups/get-all-resource_groups`
- Hooks: `useSWR`
- Usa: [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`IntraCloudConfigComponent.tsx`](comp-cloud.md#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx), [`InterCloudConfigComponent.tsx`](comp-cloud.md#components-comp-cloud-intercloud-intercloudconfigcomponent-tsx), [`FilterSkeletonComponent.tsx`](#components-general-comp-cloud-filterskeletoncomponent-tsx), [`MultiTenantTagsFilterComponent.tsx`](#components-general-comp-cloud-filters-multitenanttagsfiltercomponent-tsx)
- Usado por: [`FilterComponent.tsx`](#components-general-comp-cloud-filters-filtercomponent-tsx)

---

<a id="components-general-comp-cloud-filters-multitenantservicefiltercomponent-tsx"></a>
## `components/general_comp_cloud/filters/MultiTenantServiceFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MultiTenantServiceFilterComponent` `({ service, setService, serviceType, payload }: MultiTenantServiceFilterComponentProps)`

Interfaz `MultiTenantServiceFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `service` | `string` | no | — |
| `setService` | `Dispatch<SetStateAction<string>>` | no | — |
| `serviceType` | `string` | sí | — |
| `payload` | `ReqPayload` | no | — |

- Usa: [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`azure_services.ts`](../lib.md#lib-azure-services-ts), [`IntraCloudConfigComponent.tsx`](comp-cloud.md#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx), [`aws_services.ts`](../lib.md#lib-aws-services-ts), [`gcp_services.ts`](../lib.md#lib-gcp-services-ts)
- Usado por: [`FilterComponent.tsx`](#components-general-comp-cloud-filters-filtercomponent-tsx)

---

<a id="components-general-comp-cloud-filters-multitenantsubscriptionsfiltercomponent-tsx"></a>
## `components/general_comp_cloud/filters/MultiTenantSubscriptionsFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- componente `MultiTenantSubscriptionsFilterComponent` `({ subscriptionsMap, setSubscriptionsMap, startDate, endDate, payload }: MultiTenantSubscriptionsFilterComponentProps)`

Interfaz `MultiTenantSubscriptionsFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `subscriptionsMap` | `Record<string, string>` | no | — |
| `setSubscriptionsMap` | `Dispatch<SetStateAction<Record<string, string>>>` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `payload` | `FilterPayload` | no | — |

Interfaz `SubscriptionItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `id_subscription` | `string` | no | — |
| `subscription_name` | `string` | no | — |

- Tipo interno `FilterPayload` = `IntraCloudReqPayload | InterCloudReqPayload`
Internos:

- función `getTenantIds` `(payload: FilterPayload): string[]`
- función `fetcherPost` `([url, payload]: [string, unknown])`
- componente `TenantCombobox` `({ label, subscriptions, selectedValue, onToggle }: { label: string, subscriptions: SubscriptionItem[], selectedValue: …`

- API: `/api/comparison-cloud/bridge/intracloud/azure/subs/all-subscriptions-ids`
- Hooks: `useSWR`
- Usa: [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`IntraCloudConfigComponent.tsx`](comp-cloud.md#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx), [`InterCloudConfigComponent.tsx`](comp-cloud.md#components-comp-cloud-intercloud-intercloudconfigcomponent-tsx), [`FilterSkeletonComponent.tsx`](#components-general-comp-cloud-filterskeletoncomponent-tsx)
- Usado por: [`FilterComponent.tsx`](#components-general-comp-cloud-filters-filtercomponent-tsx)

---

<a id="components-general-comp-cloud-filters-multitenanttagsfiltercomponent-tsx"></a>
## `components/general_comp_cloud/filters/MultiTenantTagsFilterComponent.tsx`

**Componente (cliente)**

Exporta:

- constante `TAG_CONSTANTS` = `{ DEFAULT_KEY: "allKeys", DEFAULT_VALUE: "allValues", }`
- componente `MultiTenantTagsFilterComponent` `({ keysMap, setKeysMap, valuesMap, setValuesMap, subscriptionsMap, startDate, endDate, region, service, payload }: MultiTenantTagsFilterComponentProps)`

Interfaz `MultiTenantTagsFilterComponentProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `keysMap` | `Record<string, string \| null>` | no | — |
| `setKeysMap` | `Dispatch<SetStateAction<Record<string, string \| null>>>` | no | — |
| `valuesMap` | `Record<string, string \| null>` | no | — |
| `setValuesMap` | `Dispatch<SetStateAction<Record<string, string \| null>>>` | no | — |
| `subscriptionsMap` | `Record<string, string>` | no | — |
| `startDate` | `Date` | no | — |
| `endDate` | `Date` | no | — |
| `region` | `string` | no | — |
| `service` | `string` | no | — |
| `payload` | `FilterPayload` | no | — |

Interfaz `AzureTagItem`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `Key` | `string` | no | — |
| `Values` | `string[]` | no | — |

Interfaz `SingleTenantTagSelectorProps`:

| Campo | Tipo | Opcional | Descripción |
|---|---|---|---|
| `label` | `string` | no | — |
| `tags` | `AzureTagItem[]` | no | — |
| `selectedKey` | `string \| null` | no | — |
| `setSelectedKey` | `(k: string \| null) => void` | no | — |
| `selectedValue` | `string \| null` | no | — |
| `setSelectedValue` | `(v: string \| null) => void` | no | — |
| `defaultKeyToken` | `string` | no | — |
| `defaultValueToken` | `string` | no | — |

- Tipo interno `FilterPayload` = `IntraCloudReqPayload | InterCloudReqPayload`
- Tipo interno `BackendPayload` = `FilterPayload & { filters: Record<string, { subscription?: string; }>; }`
Internos:

- función `getTenantIds` `(payload: FilterPayload): string[]`
- función `fetcherPost` `([url, payload]: [string, BackendPayload])`
- componente `SingleTenantTagSelector` `({ label, tags, selectedKey, setSelectedKey, selectedValue, setSelectedValue, defaultKeyToken, defaultValueToken }: Sin…`

- API: `/api/comparison-cloud/bridge/intracloud/azure/tags/get-all-tags`
- Hooks: `useSWR`
- Usa: [`utils.ts`](../lib.md#lib-utils-ts), [`button.tsx`](ui.md#components-ui-button-tsx), [`command.tsx`](ui.md#components-ui-command-tsx), [`popover.tsx`](ui.md#components-ui-popover-tsx), [`LoaderComponent.tsx`](general_azure.md#components-general-azure-loadercomponent-tsx), [`IntraCloudConfigComponent.tsx`](comp-cloud.md#components-comp-cloud-intracloud-intracloudconfigcomponent-tsx), [`InterCloudConfigComponent.tsx`](comp-cloud.md#components-comp-cloud-intercloud-intercloudconfigcomponent-tsx), [`FilterSkeletonComponent.tsx`](#components-general-comp-cloud-filterskeletoncomponent-tsx)
- Usado por: [`FilterComponent.tsx`](#components-general-comp-cloud-filters-filtercomponent-tsx), [`MultiTenantResourceGroupFilterComponent.tsx`](#components-general-comp-cloud-filters-multitenantresourcegroupfiltercomponent-tsx)

