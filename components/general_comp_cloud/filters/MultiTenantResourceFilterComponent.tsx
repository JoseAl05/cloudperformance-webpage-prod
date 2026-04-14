'use client'

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent'
import { FilterSkeleton } from '@/components/general_comp_cloud/FilterSkeletonComponent'

interface MultiTenantResourceFilterComponentProps {
    resourcesMap: Record<string, string>;
    setResourcesMap: Dispatch<SetStateAction<Record<string, string>>>;
    startDate: Date;
    endDate: Date;
    service: string;
    payload: ReqPayload;
}

interface ResourceItem {
    resource_id: string;
    resource_name: string;
}

const fetcherPost = async ([url, payload]: [string, unknown]) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Error al obtener datos');
    return res.json();
};

export const MultiTenantResourceFilterComponent = ({
    resourcesMap,
    setResourcesMap,
    startDate,
    endDate,
    service,
    payload
}: MultiTenantResourceFilterComponentProps) => {

    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    useEffect(() => {
        const resetState = payload.tenants.reduce((acc, tenantId) => ({
            ...acc,
            [tenantId]: ''
        }), {});

        setResourcesMap(resetState);
    }, [service, setResourcesMap]);

    let url = null;
    if (payload.cloud_provider === 'Azure') {
        url = service ? `/api/comparison-cloud/bridge/intracloud/azure/resources/get_all_resources?date_from=${startDateFormatted}&date_to=${endDateFormatted}&service=${service}` : null;
    } else if (payload.cloud_provider === 'AWS') {
        url = service ? `/api/comparison-cloud/bridge/intracloud/aws/resources/get_all_resources?date_from=${startDateFormatted}&date_to=${endDateFormatted}&service=${service}` : null;
    } else if (payload.cloud_provider === 'GCP') {
        url = service ? `/api/comparison-cloud/bridge/intracloud/gcp/resources/get_all_resources?date_from=${startDateFormatted}&date_to=${endDateFormatted}&service=${service}` : null;
    }

    const { data, error, isLoading } = useSWR(
        payload ? [url, payload] : null,
        fetcherPost,
        { revalidateOnFocus: false, shouldRetryOnError: false }
    );

    const tenantDataMap = useMemo(() => {
        if (!data || !payload.tenants) return {};
        const map: Record<string, ResourceItem[]> = {};
        payload.tenants.forEach(id => {
            map[id] = data[id] || [];
        });
        return map;
    }, [data, payload]);


    const handleUpdate = (tenantId: string, val: string) => {
        setResourcesMap(prev => ({ ...prev, [tenantId]: val }));
    };

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
    if (error) return <div className="text-red-500 text-xs">Error</div>
    if (!data) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2 rounded-md border border-dashed">
            {payload.tenants.map((tenantId, index) => {
                const resources = tenantDataMap[tenantId] || [];
                const currentValue = resourcesMap[tenantId] || '';
                const label = `Recursos Tenant ${index + 1}`;

                return (
                    <TenantCombobox
                        key={tenantId}
                        label={label}
                        resources={resources}
                        selectedValue={currentValue}
                        onToggle={(val) => handleUpdate(tenantId, val)}
                    />
                );
            })}
        </div>
    )
}

const TenantCombobox = ({
    label,
    resources,
    selectedValue,
    onToggle
}: {
    label: string,
    resources: ResourceItem[],
    selectedValue: string,
    onToggle: (id: string) => void
}) => {
    const [open, setOpen] = useState(false);
    const selectedIds = selectedValue ? selectedValue.split(',').filter(Boolean) : [];
    const availableIds = resources.map(s => s.resource_id);
    const selectedCount = selectedIds.length;

    const isAllSelected = availableIds.length > 0 && selectedCount === availableIds.length;

    const getDisplayText = () => {
        if (resources.length === 0) return "Sin datos";
        if (isAllSelected) return "Todos";
        if (selectedCount === 0) return "Seleccionar";

        if (selectedCount === 1) {
            const found = resources.find(s => selectedIds.includes(s.resource_id));
            return found?.resource_name || "1 Seleccionado";
        }
        return `${selectedCount} seleccionados`;
    };

    const handleSelect = (val: string) => {
        if (val === 'all_option') {
            if (isAllSelected) {
                onToggle('');
            } else {
                onToggle(availableIds.join(','));
            }
            return;
        }
        let newSelection = [...selectedIds];

        if (newSelection.includes(val)) {
            newSelection = newSelection.filter(v => v !== val);
        } else {
            newSelection.push(val);
        }

        onToggle(newSelection.join(','));
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
                        disabled={resources.length === 0}
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
                            {resources.length > 0 && (
                                <CommandItem
                                    value="all_option"
                                    onSelect={() => handleSelect('all_option')}
                                    className="font-semibold text-xs border-b"
                                >
                                    <Check className={cn('mr-2 h-3 w-3', isAllSelected ? 'opacity-100' : 'opacity-0')} />
                                    (Seleccionar Todos)
                                </CommandItem>
                            )}
                            {resources.map((res) => {
                                const isSelected = selectedIds.includes(res.resource_id);
                                return (
                                    <CommandItem
                                        key={res.resource_id}
                                        value={res.resource_name}
                                        onSelect={() => handleSelect(res.resource_id)}
                                        className="text-xs"
                                    >
                                        <Check className={cn('mr-2 h-3 w-3', isSelected ? 'opacity-100' : 'opacity-0')} />
                                        <span className="truncate">{res.resource_name}</span>
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