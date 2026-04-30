'use client'

import { Dispatch, SetStateAction, useMemo, useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { ReqPayload as IntraCloudReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent'
import { InterCloudReqPayload } from '@/components/comp-cloud/intercloud/InterCloudConfigComponent'
import { FilterSkeleton } from '@/components/general_comp_cloud/FilterSkeletonComponent'
import { TAG_CONSTANTS } from '@/components/general_comp_cloud/filters/MultiTenantTagsFilterComponent'

type FilterPayload = IntraCloudReqPayload | InterCloudReqPayload;

interface MultiTenantResourceGroupFilterComponentProps {
    resourceGroupsMap: Record<string, string>;
    setResourceGroupsMap: Dispatch<SetStateAction<Record<string, string>>>;
    tagKeysMap: Record<string, string | null>;
    tagValuesMap: Record<string, string | null>;
    startDate: Date;
    endDate: Date;
    service: string;
    payload: FilterPayload;
}

interface ResourceGroupItem {
    resource_group: string;
}

type BackendPayload = FilterPayload & {
    filters: Record<string, {
        tagKey?: string | null;
        tagValue?: string | null;
    }>;
};

const getTenantIds = (payload: FilterPayload): string[] => {
    if ('tenants' in payload) return payload.tenants;
    if ('tenant_id' in payload) return [payload.tenant_id];
    return [];
};

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

    const tenantIds = useMemo(() => getTenantIds(payload), [payload]);

    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const hasValidTags = tenantIds.some(tenantId => {
        const key = tagKeysMap[tenantId];
        return key && key !== "";
    });

    const filtersPayload: Record<string, unknown> = {};
    tenantIds.forEach(tenantId => {
        const rawKey = tagKeysMap[tenantId];
        const rawValue = tagValuesMap[tenantId];

        filtersPayload[tenantId] = {
            tagKey: rawKey || "",
            tagValue: rawValue || ""
        };
    });

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
        if (!data) return {};
        const map: Record<string, ResourceGroupItem[]> = {};
        tenantIds.forEach(id => {
            map[id] = data[id] || [];
        });
        return map;
    }, [data, tenantIds]);

    const handleUpdate = (tenantId: string, newVal: string) => {
        setResourceGroupsMap(prev => ({ ...prev, [tenantId]: newVal }));
    };

    useEffect(() => {
        if (isLoading || !data) return;
        setResourceGroupsMap(prev => {
            const next = { ...prev };
            tenantIds.forEach(id => {
                if (!next[id]) next[id] = 'all';
            });
            return next;
        });
    }, [data, isLoading, tenantIds, setResourceGroupsMap]);

    if (!service) {
        return (
            <div className="space-y-1">
                <label className='text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1 truncate block'>
                    Selecciona un Servicio
                </label>
            </div>
        )
    }

    if (isLoading) return <FilterSkeleton />
    if (error) return <div className="text-red-500 text-xs">Error cargando grupos de recursos</div>

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2  rounded-md border border-dashed">
            {tenantIds.map((tenantId, index) => {
                const rgs = tenantDataMap[tenantId] || [];
                const currentValue = resourceGroupsMap[tenantId] || 'all';
                const label = tenantIds.length === 1 ? 'Tenant' : `Tenant ${index + 1}`;

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