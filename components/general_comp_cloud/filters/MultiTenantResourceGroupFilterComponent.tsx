// 'use client'

// import { Dispatch, SetStateAction, useMemo, useState, useEffect } from 'react'
// import { Check, ChevronsUpDown } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import { Button } from '@/components/ui/button'
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
// import useSWR from 'swr'
// import { LoaderComponent } from '@/components/general_azure/LoaderComponent'
// import { ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent'
// import { TAG_DEFAULTS } from '@/components/general_comp_cloud/filters/MultiTenantTagsFilterComponent'

// interface MultiTenantResourceGroupFilterComponentProps {
//     resourceGroupA: string;
//     setResourceGroupA: Dispatch<SetStateAction<string>>;
//     resourceGroupB: string;
//     setResourceGroupB: Dispatch<SetStateAction<string>>;
//     tagKeyA: string;
//     tagKeyB: string;
//     tagValueA: string;
//     tagValueB: string;
//     startDate: Date;
//     endDate: Date;
//     region: string;
//     payload: ReqPayload;
// }

// interface ResourceGroupItem {
//     resource_group: string;
// }

// const fetcherPost = async ([url, payload]: [string, unknown]) => {
//     const res = await fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//     });
//     if (!res.ok) throw new Error('Error al obtener datos');
//     return res.json();
// };

// export const MultiTenantResourceGroupFilterComponent = ({
//     resourceGroupA,
//     setResourceGroupA,
//     resourceGroupB,
//     setResourceGroupB,
//     tagKeyA,
//     tagKeyB,
//     tagValueA,
//     tagValueB,
//     startDate,
//     endDate,
//     region,
//     payload
// }: MultiTenantResourceGroupFilterComponentProps) => {

//     const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
//     const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

//     const effectiveTagKeyA = tagKeyA === TAG_DEFAULTS.ALL_KEYS_A ? '' : tagKeyA;
//     const effectiveTagValueA = tagValueA === TAG_DEFAULTS.ALL_VALUES_A ? '' : tagValueA;

//     const effectiveTagKeyB = tagKeyB === TAG_DEFAULTS.ALL_KEYS_B ? '' : tagKeyB;
//     const effectiveTagValueB = tagValueB === TAG_DEFAULTS.ALL_VALUES_B ? '' : tagValueB;

//     const url = `/api/comparison-cloud/bridge/intracloud/resource_groups/get-all-resource_groups?date_from=${startDateFormatted}&date_to=${endDateFormatted}&location=${region}&tag_key_tenant_a=${effectiveTagKeyA || 'allKeysA'}&tag_key_tenant_b=${effectiveTagKeyB || 'allKeysB'}&tag_value_tenant_a=${effectiveTagValueA || 'allValuesA'}&tag_value_tenant_b=${effectiveTagValueB || 'allValuesB'}`;

//     const { data, error, isLoading } = useSWR(
//         payload ? [url, payload] : null,
//         fetcherPost,
//         { revalidateOnFocus: false, shouldRetryOnError: false }
//     );

//     const { mapA, mapB } = useMemo(() => {
//         const mA = new Map<string, string>();
//         const mB = new Map<string, string>();

//         if (!data || !payload) return { mapA: mA, mapB: mB };
//         const rgsA = data["rg_tenant_a"] || [];
//         const rgsB = data["rg_tenant_b"] || [];

//         rgsA.forEach((rg: ResourceGroupItem) => mA.set(rg.resource_group, rg.resource_group));
//         rgsB.forEach((rg: ResourceGroupItem) => mB.set(rg.resource_group, rg.resource_group));

//         return { mapA: mA, mapB: mB };
//     }, [data, payload]);

//     const initializeSelection = (
//         currentValue: string,
//         setValue: Dispatch<SetStateAction<string>>,
//         map: Map<string, string>
//     ) => {
//         if (map.size === 0) {
//             if (currentValue) setValue('');
//             return;
//         }
//         if (!currentValue) {
//             if (map.size === 1) {
//                 setValue(Array.from(map.keys())[0]);
//             } else {
//                 setValue('all');
//             }
//         }
//     };

//     useEffect(() => {
//         if (isLoading || !data || !payload) return;
//         initializeSelection(resourceGroupA, setResourceGroupA, mapA);
//         initializeSelection(resourceGroupB, setResourceGroupB, mapB);
//     }, [data, isLoading, mapA, mapB, payload]);

//     const handleToggleGeneric = (
//         idToToggle: string,
//         tenantIds: string[],
//         currentValue: string,
//         setValue: Dispatch<SetStateAction<string>>,
//         totalSize: number
//     ) => {
//         const isAllSelected = currentValue === 'all';
//         const currentSelection = isAllSelected
//             ? tenantIds
//             : (currentValue ? currentValue.split(',').filter(Boolean) : []);

//         let newSelection: string[] = [];

//         if (idToToggle === 'all_tenant') {
//             if (isAllSelected || currentSelection.length === totalSize) {
//                 newSelection = [];
//             } else {
//                 setValue('all');
//                 return;
//             }
//         } else {
//             if (currentSelection.includes(idToToggle)) {
//                 newSelection = currentSelection.filter(id => id !== idToToggle);
//             } else {
//                 newSelection = [...currentSelection, idToToggle];
//             }
//         }

//         if (newSelection.length === totalSize && totalSize > 0) {
//             setValue('all');
//         } else {
//             setValue(newSelection.join(','));
//         }
//     };

//     if (isLoading) return <LoaderComponent size="small" />
//     if (error) return <div className="text-red-500 text-xs">Error</div>
//     if (!data) return null;

//     const rgsA = data["rg_tenant_a"] || [];
//     const rgsB = data["rg_tenant_b"] || [];


//     return (
//         <div className="grid grid-cols-1 gap-2">
//             <div className="space-y-1">
//                 <TenantCombobox
//                     label={`Grupos de recursos Tenant A (${rgsA.length})`}
//                     resourceGroups={rgsA}
//                     selectedValue={resourceGroupA}
//                     allNamesMap={mapA}
//                     onToggle={(id) => handleToggleGeneric(
//                         id,
//                         rgsA.map((rg: unknown) => rg.resource_group),
//                         resourceGroupA,
//                         setResourceGroupA,
//                         mapA.size
//                     )}
//                 />
//             </div>

//             <div className="space-y-1">
//                 <TenantCombobox
//                     label={`Grupos de recursos Tenant B (${rgsB.length})`}
//                     resourceGroups={rgsB}
//                     selectedValue={resourceGroupB}
//                     allNamesMap={mapB}
//                     onToggle={(id) => handleToggleGeneric(
//                         id,
//                         rgsB.map((rg: unknown) => rg.resource_group),
//                         resourceGroupB,
//                         setResourceGroupB,
//                         mapB.size
//                     )}
//                 />
//             </div>
//         </div>
//     )
// }

// const TenantCombobox = ({
//     label,
//     resourceGroups,
//     selectedValue,
//     allNamesMap,
//     onToggle
// }: {
//     label: string,
//     resourceGroups: ResourceGroupItem[],
//     selectedValue: string,
//     allNamesMap: Map<string, string>,
//     onToggle: (id: string) => void
// }) => {
//     const [open, setOpen] = useState(false);

//     const isAllGlobal = selectedValue === 'all';
//     const selectedNames = isAllGlobal ? [] : (selectedValue ? selectedValue.split(',') : []);
//     const tenantIds = resourceGroups.map(rg => rg.resource_group);

//     const selectedCount = isAllGlobal
//         ? tenantIds.length
//         : tenantIds.filter(id => selectedNames.includes(id)).length;

//     const isAllSelected = isAllGlobal || (selectedCount === tenantIds.length && tenantIds.length > 0);

//     const getDisplayText = () => {
//         if (resourceGroups.length === 1 && isAllSelected) {
//             return resourceGroups[0].resource_group;
//         }
//         if (isAllSelected) return `Todos`;
//         if (selectedCount === 0) return `Seleccionar`;
//         if (selectedCount === 1) {
//             const id = tenantIds.find(tid => selectedNames.includes(tid));
//             return allNamesMap.get(id!) || id;
//         }
//         return `${selectedCount} seleccionados`;
//     };

//     return (
//         <div className="space-y-1">
//             <label className='text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1'>
//                 {label}
//             </label>
//             <Popover open={open} onOpenChange={setOpen}>
//                 <PopoverTrigger asChild>
//                     <Button
//                         variant="outline"
//                         role="combobox"
//                         aria-expanded={open}
//                         className="w-full justify-between bg-white text-xs h-8 px-2"
//                         disabled={resourceGroups.length === 0}
//                     >
//                         <span className="truncate text-left max-w-[90%]">
//                             {getDisplayText()}
//                         </span>
//                         <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
//                     </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-[280px] p-0" align="start">
//                     <Command>
//                         <CommandInput placeholder="Buscar grupo de recursos..." className="h-8 text-xs" />
//                         <CommandEmpty>No encontrado.</CommandEmpty>
//                         <CommandGroup className="max-h-[200px] overflow-y-auto">
//                             {resourceGroups.length > 1 && (
//                                 <CommandItem
//                                     value="all_tenant_option"
//                                     onSelect={() => onToggle('all_tenant')}
//                                     className="font-semibold text-xs"
//                                 >
//                                     <Check className={cn('mr-2 h-3 w-3', isAllSelected ? 'opacity-100' : 'opacity-0')} />
//                                     Todos los grupos de recursos
//                                 </CommandItem>
//                             )}
//                             {resourceGroups.map((rg) => {
//                                 const isSelected = isAllGlobal || selectedNames.includes(rg.resource_group);
//                                 return (
//                                     <CommandItem
//                                         key={rg.resource_group}
//                                         value={`${rg.resource_group}`}
//                                         onSelect={() => onToggle(rg.resource_group)}
//                                         className="text-xs"
//                                     >
//                                         <Check className={cn('mr-2 h-3 w-3', isSelected ? 'opacity-100' : 'opacity-0')} />
//                                         <span className="truncate" title={rg.resource_group}>
//                                             {rg.resource_group}
//                                         </span>
//                                     </CommandItem>
//                                 );
//                             })}
//                         </CommandGroup>
//                     </Command>
//                 </PopoverContent>
//             </Popover>
//         </div>
//     );
// };
'use client'

import { Dispatch, SetStateAction, useMemo, useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent'
import { FilterSkeleton } from '@/components/general_comp_cloud/FilterSkeletonComponent'
import { TAG_CONSTANTS } from '@/components/general_comp_cloud/filters/MultiTenantTagsFilterComponent'

interface MultiTenantResourceGroupFilterComponentProps {
    resourceGroupsMap: Record<string, string>;
    setResourceGroupsMap: Dispatch<SetStateAction<Record<string, string>>>;
    tagKeysMap: Record<string, string | null>;
    tagValuesMap: Record<string, string | null>;
    startDate: Date;
    endDate: Date;
    payload: ReqPayload;
}

interface ResourceGroupItem {
    resource_group: string;
}

interface BackendPayload extends ReqPayload {
    filters: Record<string, {
        tagKey?: string | null;
        tagValue?: string | null;
    }>;
}

const fetcherPost = async ([url, payload]: [string, BackendPayload]) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Error al obtener datos');
    return res.json();
};

export const MultiTenantResourceGroupFilterComponent = ({
    resourceGroupsMap,
    setResourceGroupsMap,
    tagKeysMap,
    tagValuesMap,
    startDate,
    endDate,
    service,
    payload
}: MultiTenantResourceGroupFilterComponentProps) => {

    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';


    const hasValidTags = payload.tenants.some(tenantId => {
        const key = tagKeysMap[tenantId];
        return key && key !== "";
    });

    const filtersPayload: Record<string, unknown> = {};
    if (payload.tenants) {
        payload.tenants.forEach(tenantId => {
            const rawKey = tagKeysMap[tenantId];
            const rawValue = tagValuesMap[tenantId];

            filtersPayload[tenantId] = {
                tagKey: rawKey || "",
                tagValue: rawValue || ""
            };
        });
    }

    const fullPayload: BackendPayload = {
        ...payload,
        filters: filtersPayload
    };

    const url = `/api/comparison-cloud/bridge/intracloud/azure/resource_groups/get-all-resource_groups?date_from=${startDateFormatted}&date_to=${endDateFormatted}&service=${service}`;
    const shouldFetch = payload && hasValidTags;

    const { data, error, isLoading } = useSWR(
        shouldFetch ? [url, fullPayload] : null,
        fetcherPost,
        { revalidateOnFocus: false, shouldRetryOnError: false }
    );
    const tenantDataMap = useMemo(() => {
        if (!data || !payload.tenants) return {};
        const map: Record<string, ResourceGroupItem[]> = {};

        payload.tenants.forEach(id => {
            map[id] = data[id] || [];
        });
        return map;
    }, [data, payload]);

    const handleUpdate = (tenantId: string, newVal: string) => {
        setResourceGroupsMap(prev => ({ ...prev, [tenantId]: newVal }));
    };

    useEffect(() => {
        if (isLoading || !data) return;
        setResourceGroupsMap(prev => {
            const next = { ...prev };
            payload.tenants.forEach(id => {
                if (!next[id]) next[id] = 'all';
            });
            return next;
        });
    }, [data, isLoading, payload.tenants, setResourceGroupsMap]);

    if (isLoading) return <FilterSkeleton />
    if (error) return <div className="text-red-500 text-xs">Error cargando grupos de recursos</div>
    // if (!data) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2  rounded-md border border-dashed">
            {payload.tenants.map((tenantId, index) => {
                const rgs = tenantDataMap[tenantId] || [];
                const currentValue = resourceGroupsMap[tenantId] || 'all';
                const label = `Tenant ${index + 1}`;

                return (
                    <div key={tenantId} className="space-y-1">
                        <TenantCombobox
                            label={label}
                            resourceGroups={rgs}
                            selectedValue={currentValue}
                            onToggle={(val) => handleUpdate(tenantId, val)}
                        />
                    </div>
                );
            })}
        </div>
    )
}

const TenantCombobox = ({
    label,
    resourceGroups,
    selectedValue,
    onToggle
}: {
    label: string,
    resourceGroups: ResourceGroupItem[],
    selectedValue: string,
    onToggle: (id: string) => void
}) => {
    const [open, setOpen] = useState(false);

    const isAllGlobal = selectedValue === 'all' || !selectedValue;
    const selectedNames = isAllGlobal ? [] : selectedValue.split(',').filter(Boolean);
    const availableRGs = resourceGroups.map(rg => rg.resource_group);

    const selectedCount = isAllGlobal
        ? availableRGs.length
        : availableRGs.filter(rg => selectedNames.includes(rg)).length;

    const isAllSelected = isAllGlobal || (selectedCount === availableRGs.length && availableRGs.length > 0);

    const getDisplayText = () => {
        if (resourceGroups.length === 0) return "Sin datos";
        if (isAllSelected) return "Todos";
        if (selectedCount === 0) return "Seleccionar";
        if (selectedCount === 1) return selectedNames[0];
        return `${selectedCount} seleccionados`;
    };

    const handleSelect = (val: string) => {
        if (val === 'all_option') {
            if (isAllSelected) onToggle('');
            else onToggle('all');
            return;
        }

        let newSelection = [...selectedNames];
        if (isAllSelected) {
            newSelection = [val];
        } else {
            if (newSelection.includes(val)) {
                newSelection = newSelection.filter(v => v !== val);
            } else {
                newSelection.push(val);
            }
        }
        if (newSelection.length === availableRGs.length || newSelection.length === 0) {
            onToggle('all');
        } else {
            onToggle(newSelection.join(','));
        }
    };

    return (
        <div className="space-y-1">
            <label className='text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1 truncate block' title={label}>
                {label}
            </label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-white text-xs h-8 px-2"
                        disabled={resourceGroups.length === 0}
                    >
                        <span className="truncate text-left max-w-[90%]">
                            {getDisplayText()}
                        </span>
                        <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Buscar..." className="h-8 text-xs" />
                        <CommandEmpty>No encontrado.</CommandEmpty>
                        <CommandGroup className="max-h-[200px] overflow-y-auto">
                            <CommandItem
                                value="all_option"
                                onSelect={() => handleSelect('all_option')}
                                className="font-semibold text-xs"
                            >
                                <Check className={cn('mr-2 h-3 w-3', isAllSelected ? 'opacity-100' : 'opacity-0')} />
                                Todos
                            </CommandItem>
                            {resourceGroups.map((rg) => {
                                const isSelected = isAllSelected || selectedNames.includes(rg.resource_group);
                                return (
                                    <CommandItem
                                        key={rg.resource_group}
                                        value={rg.resource_group}
                                        onSelect={() => handleSelect(rg.resource_group)}
                                        className="text-xs"
                                    >
                                        <Check className={cn('mr-2 h-3 w-3', isSelected ? 'opacity-100' : 'opacity-0')} />
                                        <span className="truncate">{rg.resource_group}</span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};