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

type FilterPayload = IntraCloudReqPayload | InterCloudReqPayload;

interface MultiTenantSubscriptionsFilterComponentProps {
    subscriptionsMap: Record<string, string>;
    setSubscriptionsMap: Dispatch<SetStateAction<Record<string, string>>>;
    startDate: Date;
    endDate: Date;
    payload: FilterPayload;
}

interface SubscriptionItem {
    id_subscription: string;
    subscription_name: string;
}

const getTenantIds = (payload: FilterPayload): string[] => {
    if ('tenants' in payload) return payload.tenants;
    if ('tenant_id' in payload) return [payload.tenant_id];
    return [];
};

const fetcherPost = async ([url, payload]: [string, unknown]) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Error al obtener datos');
    return res.json();
};

export const MultiTenantSubscriptionsFilterComponent = ({
    subscriptionsMap,
    setSubscriptionsMap,
    startDate,
    endDate,
    payload
}: MultiTenantSubscriptionsFilterComponentProps) => {

    const tenantIds = useMemo(() => getTenantIds(payload), [payload]);

    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const url = `/api/comparison-cloud/bridge/intracloud/azure/subs/all-subscriptions-ids?date_from=${startDateFormatted}&date_to=${endDateFormatted}`;

    const { data, error, isLoading } = useSWR(
        payload ? [url, payload] : null,
        fetcherPost,
        { revalidateOnFocus: false, shouldRetryOnError: false }
    );

    const tenantDataMap = useMemo(() => {
        if (!data) return {};
        const map: Record<string, SubscriptionItem[]> = {};
        tenantIds.forEach(id => {
            map[id] = data[id] || [];
        });
        return map;
    }, [data, tenantIds]);

    const handleUpdate = (tenantId: string, val: string) => {
        setSubscriptionsMap(prev => ({ ...prev, [tenantId]: val }));
    };

    useEffect(() => {
        if (isLoading || !data) return;
        setSubscriptionsMap(prev => {
            const next = { ...prev };
            tenantIds.forEach(id => {
                if (!next[id]) next[id] = 'all';
            });
            return next;
        });
    }, [data, isLoading, tenantIds, setSubscriptionsMap]);

    if (isLoading) return <FilterSkeleton />
    if (error) return <div className="text-red-500 text-xs">Error</div>
    if (!data) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2  rounded-md border border-dashed">
            {tenantIds.map((tenantId, index) => {
                const subs = tenantDataMap[tenantId] || [];
                const currentValue = subscriptionsMap[tenantId] || 'all';
                const label = tenantIds.length === 1 ? 'Subs Tenant' : `Subs Tenant ${index + 1}`;

                return (
                    <TenantCombobox
                        key={tenantId}
                        label={label}
                        subscriptions={subs}
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
    subscriptions,
    selectedValue,
    onToggle
}: {
    label: string,
    subscriptions: SubscriptionItem[],
    selectedValue: string,
    onToggle: (id: string) => void
}) => {
    const [open, setOpen] = useState(false);

    const isAllGlobal = selectedValue === 'all' || !selectedValue;
    const selectedIds = isAllGlobal ? [] : selectedValue.split(',').filter(Boolean);
    const availableIds = subscriptions.map(s => s.id_subscription);

    const selectedCount = isAllGlobal
        ? availableIds.length
        : availableIds.filter(id => selectedIds.includes(id)).length;

    const isAllSelected = isAllGlobal || (selectedCount === availableIds.length && availableIds.length > 0);

    const getDisplayText = () => {
        if (subscriptions.length === 0) return "Sin datos";
        if (isAllSelected) return "Todas";
        if (selectedCount === 1) {
            const found = subscriptions.find(s => selectedIds.includes(s.id_subscription));
            return found?.subscription_name || "1 Seleccionada";
        }
        return `${selectedCount} seleccionadas`;
    };

    const handleSelect = (val: string) => {
        if (val === 'all_option') {
            if (isAllSelected) onToggle('');
            else onToggle('all');
            return;
        }

        let newSelection = [...selectedIds];
        if (isAllSelected) {
            newSelection = [val];
        } else {
            if (newSelection.includes(val)) {
                newSelection = newSelection.filter(v => v !== val);
            } else {
                newSelection.push(val);
            }
        }

        if (newSelection.length === availableIds.length || newSelection.length === 0) {
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
                        disabled={subscriptions.length === 0}
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
                                Todas
                            </CommandItem>
                            {subscriptions.map((sub) => {
                                const isSelected = isAllSelected || selectedIds.includes(sub.id_subscription);
                                return (
                                    <CommandItem
                                        key={sub.id_subscription}
                                        value={sub.subscription_name}
                                        onSelect={() => handleSelect(sub.id_subscription)}
                                        className="text-xs"
                                    >
                                        <Check className={cn('mr-2 h-3 w-3', isSelected ? 'opacity-100' : 'opacity-0')} />
                                        <span className="truncate">{sub.subscription_name}</span>
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