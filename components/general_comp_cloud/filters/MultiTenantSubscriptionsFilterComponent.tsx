// 'use client'

// import { Dispatch, SetStateAction, useMemo, useState, useEffect } from 'react'
// import { Check, ChevronsUpDown } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import { Button } from '@/components/ui/button'
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
// import useSWR from 'swr'
// import { LoaderComponent } from '@/components/general_azure/LoaderComponent'
// import { ReqPayload} from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent'

// interface MultiTenantSubscriptionsFilterComponentProps {
//     subscriptionA: string;
//     setSubscriptionA: Dispatch<SetStateAction<string>>;
//     subscriptionB: string;
//     setSubscriptionB: Dispatch<SetStateAction<string>>;
//     startDate: Date;
//     endDate: Date;
//     payload: ReqPayload;
// }

// interface SubscriptionItem {
//     id_subscription: string;
//     subscription_name: string;
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

// export const MultiTenantSubscriptionsFilterComponent = ({
//     subscriptionA,
//     setSubscriptionA,
//     subscriptionB,
//     setSubscriptionB,
//     startDate,
//     endDate,
//     payload
// }: MultiTenantSubscriptionsFilterComponentProps) => {

//     const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
//     const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';
//     const url = `/api/comparison-cloud/bridge/intracloud/subs/all-subscriptions-ids?date_from=${startDateFormatted}&date_to=${endDateFormatted}`;

//     const { data, error, isLoading } = useSWR(
//         payload ? [url, payload] : null,
//         fetcherPost,
//         { revalidateOnFocus: false, shouldRetryOnError: false }
//     );

//     const { mapA, mapB } = useMemo(() => {
//         const mA = new Map<string, string>();
//         const mB = new Map<string, string>();

//         if (!data || !payload) return { mapA: mA, mapB: mB };
//         const subsA = data["subs_tenant_a"] || [];
//         const subsB = data["subs_tenant_b"] || [];

//         subsA.forEach((s: SubscriptionItem) => mA.set(s.id_subscription, s.subscription_name));
//         subsB.forEach((s: SubscriptionItem) => mB.set(s.id_subscription, s.subscription_name));

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
//         initializeSelection(subscriptionA, setSubscriptionA, mapA);
//         initializeSelection(subscriptionB, setSubscriptionB, mapB);
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

//     const subsA = data["subs_tenant_a"] || [];
//     const subsB = data["subs_tenant_b"] || [];

//     return (
//         <div className="grid grid-cols-1 gap-2">
//             <div className="space-y-1">
//                 <TenantCombobox
//                     label={`Suscripciones Tenant A (${subsA.length})`}
//                     subscriptions={subsA}
//                     selectedValue={subscriptionA}
//                     allIdsMap={mapA}
//                     onToggle={(id) => handleToggleGeneric(
//                         id,
//                         subsA.map((s: unknown) => s.id_subscription),
//                         subscriptionA,
//                         setSubscriptionA,
//                         mapA.size
//                     )}
//                 />
//             </div>

//             <div className="space-y-1">
//                 <TenantCombobox
//                     label={`Suscripciones Tenant B (${subsB.length})`}
//                     subscriptions={subsB}
//                     selectedValue={subscriptionB}
//                     allIdsMap={mapB}
//                     onToggle={(id) => handleToggleGeneric(
//                         id,
//                         subsB.map((s: unknown) => s.id_subscription),
//                         subscriptionB,
//                         setSubscriptionB,
//                         mapB.size
//                     )}
//                 />
//             </div>
//         </div>
//     )
// }

// const TenantCombobox = ({
//     label,
//     subscriptions,
//     selectedValue,
//     allIdsMap,
//     onToggle
// }: {
//     label: string,
//     subscriptions: SubscriptionItem[],
//     selectedValue: string,
//     allIdsMap: Map<string, string>,
//     onToggle: (id: string) => void
// }) => {
//     const [open, setOpen] = useState(false);

//     const isAllGlobal = selectedValue === 'all';
//     const selectedIds = isAllGlobal ? [] : (selectedValue ? selectedValue.split(',') : []);
//     const tenantIds = subscriptions.map(s => s.id_subscription);

//     const selectedCount = isAllGlobal
//         ? tenantIds.length
//         : tenantIds.filter(id => selectedIds.includes(id)).length;

//     const isAllSelected = isAllGlobal || (selectedCount === tenantIds.length && tenantIds.length > 0);

//     const getDisplayText = () => {
//         if (subscriptions.length === 1 && isAllSelected) {
//             return subscriptions[0].subscription_name;
//         }
//         if (isAllSelected) return `Todas`;
//         if (selectedCount === 0) return `Seleccionar`;
//         if (selectedCount === 1) {
//             const id = tenantIds.find(tid => selectedIds.includes(tid));
//             return allIdsMap.get(id!) || id;
//         }
//         return `${selectedCount} seleccionadas`;
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
//                         disabled={subscriptions.length === 0}
//                     >
//                         <span className="truncate text-left max-w-[90%]">
//                             {getDisplayText()}
//                         </span>
//                         <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
//                     </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-[280px] p-0" align="start">
//                     <Command>
//                         <CommandInput placeholder="Buscar suscripción..." className="h-8 text-xs" />
//                         <CommandEmpty>No encontrado.</CommandEmpty>
//                         <CommandGroup className="max-h-[200px] overflow-y-auto">
//                             {subscriptions.length > 1 && (
//                                 <CommandItem
//                                     value="all_tenant_option"
//                                     onSelect={() => onToggle('all_tenant')}
//                                     className="font-semibold text-xs"
//                                 >
//                                     <Check className={cn('mr-2 h-3 w-3', isAllSelected ? 'opacity-100' : 'opacity-0')} />
//                                     Todas las suscripciones
//                                 </CommandItem>
//                             )}
//                             {subscriptions.map((sub) => {
//                                 const isSelected = isAllGlobal || selectedIds.includes(sub.id_subscription);
//                                 return (
//                                     <CommandItem
//                                         key={sub.id_subscription}
//                                         value={`${sub.subscription_name} ${sub.id_subscription}`}
//                                         onSelect={() => onToggle(sub.id_subscription)}
//                                         className="text-xs"
//                                     >
//                                         <Check className={cn('mr-2 h-3 w-3', isSelected ? 'opacity-100' : 'opacity-0')} />
//                                         <span className="truncate" title={sub.subscription_name}>
//                                             {sub.subscription_name}
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

interface MultiTenantSubscriptionsFilterComponentProps {
    subscriptionsMap: Record<string, string>;
    setSubscriptionsMap: Dispatch<SetStateAction<Record<string, string>>>;
    startDate: Date;
    endDate: Date;
    payload: ReqPayload;
}

interface SubscriptionItem {
    id_subscription: string;
    subscription_name: string;
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

export const MultiTenantSubscriptionsFilterComponent = ({
    subscriptionsMap,
    setSubscriptionsMap,
    startDate,
    endDate,
    payload
}: MultiTenantSubscriptionsFilterComponentProps) => {

    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const url = `/api/comparison-cloud/bridge/intracloud/azure/subs/all-subscriptions-ids?date_from=${startDateFormatted}&date_to=${endDateFormatted}`;

    const { data, error, isLoading } = useSWR(
        payload ? [url, payload] : null,
        fetcherPost,
        { revalidateOnFocus: false, shouldRetryOnError: false }
    );

    const tenantDataMap = useMemo(() => {
        if (!data || !payload.tenants) return {};
        const map: Record<string, SubscriptionItem[]> = {};
        payload.tenants.forEach(id => {
            map[id] = data[id] || [];
        });
        return map;
    }, [data, payload]);

    const handleUpdate = (tenantId: string, val: string) => {
        setSubscriptionsMap(prev => ({ ...prev, [tenantId]: val }));
    };

    useEffect(() => {
        if (isLoading || !data) return;
        setSubscriptionsMap(prev => {
            const next = { ...prev };
            payload.tenants.forEach(id => {
                if (!next[id]) next[id] = 'all';
            });
            return next;
        });
    }, [data, isLoading, payload.tenants, setSubscriptionsMap]);

    if (isLoading) return <FilterSkeleton />
    if (error) return <div className="text-red-500 text-xs">Error</div>
    if (!data) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2  rounded-md border border-dashed">
            {payload.tenants.map((tenantId, index) => {
                const subs = tenantDataMap[tenantId] || [];
                const currentValue = subscriptionsMap[tenantId] || 'all';
                const label = `Subs Tenant ${index + 1}`;

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
                                        value={sub.subscription_name} // Usamos nombre para búsqueda visual
                                        onSelect={() => handleSelect(sub.id_subscription)} // ID para lógica
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