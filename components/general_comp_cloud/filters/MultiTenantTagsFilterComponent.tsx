// 'use client'

// import { Dispatch, SetStateAction, useMemo, useState, useEffect } from 'react'
// import { Check, ChevronsUpDown, X } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import { Button } from '@/components/ui/button'
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
// import useSWR from 'swr'
// import { LoaderComponent } from '@/components/general_azure/LoaderComponent'
// import { ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent'

// export const TAG_DEFAULTS = {
//     ALL_KEYS_A: "allKeysA",
//     ALL_VALUES_A: "allValuesA",
//     ALL_KEYS_B: "allKeysB",
//     ALL_VALUES_B: "allValuesB",
// };

// interface MultiTenantTagsFilterComponentProps {
//     selectedKeyA: string | null;
//     setSelectedKeyA: Dispatch<SetStateAction<string | null>>;
//     selectedValueA: string | null;
//     setSelectedValueA: Dispatch<SetStateAction<string | null>>;
//     selectedKeyB: string | null;
//     setSelectedKeyB: Dispatch<SetStateAction<string | null>>;
//     selectedValueB: string | null;
//     setSelectedValueB: Dispatch<SetStateAction<string | null>>;
//     startDate: Date;
//     endDate: Date;
//     region: string;
//     subscriptionA: string;
//     subscriptionB: string;
//     payload: ReqPayload;
// }

// interface AzureTagItem {
//     Key: string;
//     Values: string[];
// }

// interface TagsResponse {
//     tags_tenant_a: AzureTagItem[];
//     tags_tenant_b: AzureTagItem[];
// }

// const fetcherPost = async ([url, payload]: [string, unknown]) => {
//     const res = await fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//     });
//     if (!res.ok) throw new Error('Error al obtener tags');
//     return res.json();
// };

// export const MultiTenantTagsFilterComponent = ({
//     selectedKeyA, setSelectedKeyA,
//     selectedValueA, setSelectedValueA,
//     selectedKeyB, setSelectedKeyB,
//     selectedValueB, setSelectedValueB,
//     startDate,
//     endDate,
//     region,
//     subscriptionA,
//     subscriptionB,
//     payload
// }: MultiTenantTagsFilterComponentProps) => {

//     const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
//     const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

//     const url = `/api/comparison-cloud/bridge/intracloud/tags/get-all-tags?date_from=${startDateFormatted}&date_to=${endDateFormatted}&location=${region}&subscription_tenant_a=${subscriptionA}&subscription_tenant_b=${subscriptionB}`;

//     const shouldFetch = !!(payload && subscriptionA && subscriptionB);

//     const { data, error, isLoading } = useSWR<TagsResponse>(
//         shouldFetch ? [url, payload] : null,
//         fetcherPost,
//         {
//             revalidateOnFocus: false,
//             shouldRetryOnError: false
//         }
//     );

//     if (isLoading) return <LoaderComponent size="small" />
//     if (error) return <div className="text-red-500 text-xs">Error cargando tags</div>

//     const listTagsA = data?.tags_tenant_a || [];
//     const listTagsB = data?.tags_tenant_b || [];

//     return (
//         <div className="grid grid-cols-1 gap-4">
//             <SingleTenantTagSelector
//                 label="Tags Tenant A"
//                 tags={listTagsA}
//                 selectedKey={selectedKeyA}
//                 setSelectedKey={setSelectedKeyA}
//                 selectedValue={selectedValueA}
//                 setSelectedValue={setSelectedValueA}
//                 isDisabled={!subscriptionA}
//                 defaultKeyToken={TAG_DEFAULTS.ALL_KEYS_A}
//                 defaultValueToken={TAG_DEFAULTS.ALL_VALUES_A}
//             />

//             <SingleTenantTagSelector
//                 label="Tags Tenant B"
//                 tags={listTagsB}
//                 selectedKey={selectedKeyB}
//                 setSelectedKey={setSelectedKeyB}
//                 selectedValue={selectedValueB}
//                 setSelectedValue={setSelectedValueB}
//                 isDisabled={!subscriptionB}
//                 defaultKeyToken={TAG_DEFAULTS.ALL_KEYS_B}
//                 defaultValueToken={TAG_DEFAULTS.ALL_VALUES_B}
//             />
//         </div>
//     )
// }

// interface SingleTenantTagSelectorProps {
//     label: string;
//     tags: AzureTagItem[];
//     selectedKey: string | null;
//     setSelectedKey: Dispatch<SetStateAction<string | null>>;
//     selectedValue: string | null;
//     setSelectedValue: Dispatch<SetStateAction<string | null>>;
//     isDisabled?: boolean;
//     defaultKeyToken: string;
//     defaultValueToken: string;
// }

// const SingleTenantTagSelector = ({
//     label,
//     tags,
//     selectedKey,
//     setSelectedKey,
//     selectedValue,
//     setSelectedValue,
//     isDisabled,
//     defaultKeyToken,
//     defaultValueToken
// }: SingleTenantTagSelectorProps) => {
//     const [openKey, setOpenKey] = useState(false);
//     const [openValue, setOpenValue] = useState(false);

//     const tagMap = useMemo(() => {
//         const map: Record<string, Set<string>> = {};
//         if (Array.isArray(tags)) {
//             tags.forEach((item) => {
//                 if (!item || !item.Key || !item.Values) return;
//                 if (!map[item.Key]) map[item.Key] = new Set();
//                 item.Values.forEach(val => map[item.Key].add(val));
//             });
//         }
//         return map;
//     }, [tags]);

//     const realKeys = useMemo(() => Object.keys(tagMap).sort(), [tagMap]);

//     const allKeysOptions = useMemo(() => {
//         if (realKeys.length === 0) return [];
//         return [defaultKeyToken, ...realKeys];
//     }, [realKeys, defaultKeyToken]);

//     const valuesOptions = useMemo(() => {
//         if (!selectedKey || selectedKey === defaultKeyToken) {
//             return [defaultValueToken];
//         }

//         const realValues = Array.from(tagMap[selectedKey] || []).sort();
//         return [defaultValueToken, ...realValues];
//     }, [selectedKey, tagMap, defaultKeyToken, defaultValueToken]);

//     const noTags = realKeys.length === 0;

//     const getDisplayLabel = (val: string | null, isKey: boolean) => {
//         if (!val) return isKey ? "Seleccionar Clave..." : "Seleccionar Valor...";
//         if (val === defaultKeyToken) return "Todas las Claves";
//         if (val === defaultValueToken) return "Todos los Valores";
//         return val;
//     };

//     useEffect(() => {
//         if (!tags || tags.length === 0) return;
//         if (selectedKey && selectedKey !== defaultKeyToken && !realKeys.includes(selectedKey)) {
//             setSelectedKey(defaultKeyToken);
//             setSelectedValue(defaultValueToken);
//             return;
//         }
//         if (selectedKey === defaultKeyToken && selectedValue !== defaultValueToken) {
//             setSelectedValue(defaultValueToken);
//         }

//     }, [tags, realKeys, selectedKey, selectedValue, defaultKeyToken, defaultValueToken, setSelectedKey, setSelectedValue]);


//     return (
//         <div className="space-y-2 border border-dashed  p-3 rounded-md bg-slate-50/50">
//             <span className='text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1'>
//                 {label}
//             </span>
//             <Popover open={openKey} onOpenChange={setOpenKey}>
//                 <PopoverTrigger asChild>
//                     <Button
//                         variant="outline"
//                         role="combobox"
//                         className="w-full justify-between  text-xs h-8"
//                         disabled={isDisabled || noTags}
//                     >
//                         <span className="truncate max-w-[90%]">
//                             {getDisplayLabel(selectedKey, true)}
//                         </span>
//                         <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
//                     </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-[240px] p-0" align="start">
//                     <Command>
//                         <CommandInput placeholder="Buscar clave..." className="h-8 text-xs" />
//                         <CommandList>
//                             <CommandEmpty>No se encontraron claves.</CommandEmpty>
//                             <CommandGroup className="max-h-[200px] overflow-y-auto">
//                                 {allKeysOptions.map((key) => (
//                                     <CommandItem
//                                         key={key}
//                                         value={key}
//                                         onSelect={() => {
//                                             setSelectedKey(key);
//                                             // Al cambiar Key, siempre reseteamos Value al default
//                                             setSelectedValue(defaultValueToken);
//                                             setOpenKey(false);
//                                         }}
//                                         className="text-xs"
//                                     >
//                                         <Check className={cn("mr-2 h-3 w-3", selectedKey === key ? "opacity-100" : "opacity-0")} />
//                                         {key === defaultKeyToken ? "Todas las Claves" : key}
//                                     </CommandItem>
//                                 ))}
//                             </CommandGroup>
//                         </CommandList>
//                     </Command>
//                 </PopoverContent>
//             </Popover>

//             {selectedKey && (
//                 <div className="flex gap-2 items-center animate-in fade-in slide-in-from-top-1 duration-200">
//                     <div className="relative w-full">
//                         <Popover open={openValue} onOpenChange={setOpenValue}>
//                             <PopoverTrigger asChild>
//                                 <Button
//                                     variant="outline"
//                                     role="combobox"
//                                     disabled={selectedKey === defaultKeyToken}
//                                     className="w-full justify-between  text-xs h-8 disabled:opacity-70 disabled:bg-gray-100"
//                                 >
//                                     <span className="truncate max-w-[90%]">
//                                         {getDisplayLabel(selectedValue, false)}
//                                     </span>
//                                     <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
//                                 </Button>
//                             </PopoverTrigger>
//                             <PopoverContent className="w-[240px] p-0" align="start">
//                                 <Command>
//                                     <CommandInput placeholder="Buscar valor..." className="h-8 text-xs" />
//                                     <CommandList>
//                                         <CommandEmpty>No se encontraron valores.</CommandEmpty>
//                                         <CommandGroup className="max-h-[200px] overflow-y-auto">
//                                             {valuesOptions.map((val) => (
//                                                 <CommandItem
//                                                     key={val}
//                                                     value={val}
//                                                     onSelect={() => {
//                                                         setSelectedValue(val);
//                                                         setOpenValue(false);
//                                                     }}
//                                                     className="text-xs"
//                                                 >
//                                                     <Check className={cn("mr-2 h-3 w-3", selectedValue === val ? "opacity-100" : "opacity-0")} />
//                                                     {val === defaultValueToken ? "Todos los Valores" : val}
//                                                 </CommandItem>
//                                             ))}
//                                         </CommandGroup>
//                                     </CommandList>
//                                 </Command>
//                             </PopoverContent>
//                         </Popover>
//                     </div>
//                     <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-8 w-8 shrink-0 text-gray-400 hover:text-blue-500"
//                         onClick={() => setSelectedValue(defaultValueToken)}
//                         title="Resetear valor"
//                         disabled={selectedValue === defaultValueToken || selectedKey === defaultKeyToken}
//                     >
//                         <X className="h-3 w-3" />
//                     </Button>
//                 </div>
//             )}
//             {(selectedKey !== defaultKeyToken || selectedValue !== defaultValueToken) && (
//                 <Button
//                     variant="ghost"
//                     size="sm"
//                     className="h-6 text-[10px] text-gray-400 hover:text-blue-500 w-full mt-1"
//                     onClick={() => {
//                         setSelectedKey(defaultKeyToken);
//                         setSelectedValue(defaultValueToken);
//                     }}
//                 >
//                     Resetear Filtro {label.replace('Tags ', '')}
//                 </Button>
//             )}
//         </div>
//     );
// };
'use client'

import { Dispatch, SetStateAction, useMemo, useState, useEffect } from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_azure/LoaderComponent'
import { ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent'
import { FilterSkeleton } from '@/components/general_comp_cloud/FilterSkeletonComponent'

// Usamos constantes genéricas para evitar conflictos entre "A" y "B"
export const TAG_CONSTANTS = {
    DEFAULT_KEY: "allKeys",
    DEFAULT_VALUE: "allValues",
};

interface MultiTenantTagsFilterComponentProps {
    keysMap: Record<string, string | null>;
    setKeysMap: Dispatch<SetStateAction<Record<string, string | null>>>;
    valuesMap: Record<string, string | null>;
    setValuesMap: Dispatch<SetStateAction<Record<string, string | null>>>;
    subscriptionsMap: Record<string, string>;
    startDate: Date;
    endDate: Date;
    region: string;
    payload: ReqPayload;
}

interface AzureTagItem {
    Key: string;
    Values: string[];
}

interface BackendPayload extends ReqPayload {
    filters: Record<string, {
        subscription?: string;
    }>;
}

const fetcherPost = async ([url, payload]: [string, BackendPayload]) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Error al obtener tags');
    return res.json();
};

export const MultiTenantTagsFilterComponent = ({
    keysMap, setKeysMap,
    valuesMap, setValuesMap,
    subscriptionsMap,
    startDate,
    endDate,
    region,
    service,
    payload
}: MultiTenantTagsFilterComponentProps) => {

    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const filtersPayload: Record<string, unknown> = {};
    if (payload.tenants) {
        payload.tenants.forEach(tenantId => {
            filtersPayload[tenantId] = {
                subscription: subscriptionsMap[tenantId] || 'all'
            };
        });
    }

    const fullPayload: BackendPayload = {
        ...payload,
        filters: filtersPayload
    };

    const url = service ? `/api/comparison-cloud/bridge/intracloud/azure/tags/get-all-tags?date_from=${startDateFormatted}&date_to=${endDateFormatted}&location=${region}&service=${service}` : `/api/comparison-cloud/bridge/intracloud/azure/tags/get-all-tags?date_from=${startDateFormatted}&date_to=${endDateFormatted}&location=${region}`;

    const { data, error, isLoading } = useSWR(
        payload ? [url, fullPayload] : null,
        fetcherPost,
        { revalidateOnFocus: false, shouldRetryOnError: false }
    );

    if (isLoading) return <FilterSkeleton />
    if (error) return <div className="text-red-500 text-xs">Error cargando tags</div>
    if (!data) return null;

    const updateKey = (id: string, k: string | null) => setKeysMap(prev => ({ ...prev, [id]: k }));
    const updateValue = (id: string, v: string | null) => setValuesMap(prev => ({ ...prev, [id]: v }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2  rounded-md border border-dashed">
            {payload.tenants.map((tenantId, index) => {
                const tags = data[tenantId] || [];
                const currentKey = keysMap[tenantId];
                const currentValue = valuesMap[tenantId];

                return (
                    <SingleTenantTagSelector
                        key={tenantId}
                        label={`Tags Tenant ${index + 1}`}
                        tags={tags}
                        selectedKey={currentKey}
                        setSelectedKey={(k) => updateKey(tenantId, k)}
                        selectedValue={currentValue}
                        setSelectedValue={(v) => updateValue(tenantId, v)}
                        defaultKeyToken={TAG_CONSTANTS.DEFAULT_KEY}
                        defaultValueToken={TAG_CONSTANTS.DEFAULT_VALUE}
                    />
                )
            })}
        </div>
    )
}

interface SingleTenantTagSelectorProps {
    label: string;
    tags: AzureTagItem[];
    selectedKey: string | null;
    setSelectedKey: (k: string | null) => void;
    selectedValue: string | null;
    setSelectedValue: (v: string | null) => void;
    defaultKeyToken: string;
    defaultValueToken: string;
}

const SingleTenantTagSelector = ({
    label,
    tags,
    selectedKey,
    setSelectedKey,
    selectedValue,
    setSelectedValue,
    defaultKeyToken,
    defaultValueToken
}: SingleTenantTagSelectorProps) => {
    const [openKey, setOpenKey] = useState(false);
    const [openValue, setOpenValue] = useState(false);

    const noTags = !tags || tags.length === 0;

    const tagMap = useMemo(() => {
        const map: Record<string, Set<string>> = {};
        if (Array.isArray(tags)) {
            tags.forEach((item) => {
                if (!item || !item.Key || !item.Values) return;
                if (!map[item.Key]) map[item.Key] = new Set();
                item.Values.forEach(val => map[item.Key].add(val));
            });
        }
        return map;
    }, [tags]);

    const realKeys = useMemo(() => Object.keys(tagMap).sort(), [tagMap]);
    const allKeysOptions = useMemo(() => [defaultKeyToken, ...realKeys], [realKeys, defaultKeyToken]);

    const valuesOptions = useMemo(() => {
        if (!selectedKey || selectedKey === defaultKeyToken) return [defaultValueToken];
        const realValues = Array.from(tagMap[selectedKey] || []).sort();
        return [defaultValueToken, ...realValues];
    }, [selectedKey, tagMap, defaultKeyToken, defaultValueToken]);

    useEffect(() => {
        if (noTags) {
            if (selectedKey !== "" || selectedValue !== "") {
                setSelectedKey("");
                setSelectedValue("");
            }
            return;
        }

        if (selectedKey && selectedKey !== defaultKeyToken && selectedKey !== "" && !realKeys.includes(selectedKey)) {
            setSelectedKey(defaultKeyToken);
            setSelectedValue(defaultValueToken);
            return;
        }

        if (!selectedKey || selectedKey === "") {
            setSelectedKey(defaultKeyToken);
            setSelectedValue(defaultValueToken);
        }
    }, [tags, noTags, realKeys, selectedKey, selectedValue, defaultKeyToken, defaultValueToken, setSelectedKey, setSelectedValue]);

    const getDisplayLabel = (val: string | null, isKey: boolean) => {
        if (noTags) return "Sin datos";
        if (!val || val === defaultKeyToken || val === defaultValueToken) {
            return isKey ? "Todas las Claves" : "Todos los Valores";
        }
        return val;
    };

    return (
        <div className="space-y-2 border  p-3 rounded-md  shadow-sm h-full">
            <span className='text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1'>
                {label}
            </span>
            <Popover open={openKey} onOpenChange={setOpenKey}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between text-xs h-8 disabled:opacity-50 disabled:bg-gray-100"
                        disabled={noTags}
                    >
                        <span className="truncate">{getDisplayLabel(selectedKey, true)}</span>
                        <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Clave..." className="h-8 text-xs" />
                        <CommandList>
                            <CommandGroup className="max-h-[200px] overflow-y-auto">
                                {allKeysOptions.map((key) => (
                                    <CommandItem
                                        key={key}
                                        value={key}
                                        onSelect={() => {
                                            setSelectedKey(key);
                                            setSelectedValue(defaultValueToken);
                                            setOpenKey(false);
                                        }}
                                        className="text-xs"
                                    >
                                        <Check className={cn("mr-2 h-3 w-3", selectedKey === key ? "opacity-100" : "opacity-0")} />
                                        {key === defaultKeyToken ? "Todas las Claves" : key}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {!noTags && selectedKey && selectedKey !== defaultKeyToken && selectedKey !== "" && (
                <div className="relative animate-in fade-in slide-in-from-top-1">
                    <Popover open={openValue} onOpenChange={setOpenValue}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" role="combobox" className="w-full justify-between text-xs h-8">
                                <span className="truncate">{getDisplayLabel(selectedValue, false)}</span>
                                <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                            <Command>
                                <CommandInput placeholder="Valor..." className="h-8 text-xs" />
                                <CommandList>
                                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                                        {valuesOptions.map((val) => (
                                            <CommandItem
                                                key={val}
                                                value={val}
                                                onSelect={() => {
                                                    setSelectedValue(val);
                                                    setOpenValue(false);
                                                }}
                                                className="text-xs"
                                            >
                                                <Check className={cn("mr-2 h-3 w-3", selectedValue === val ? "opacity-100" : "opacity-0")} />
                                                {val === defaultValueToken ? "Todos los Valores" : val}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] text-gray-400 hover:text-blue-500 w-full mt-1 flex items-center justify-center"
                        onClick={() => {
                            setSelectedKey(defaultKeyToken);
                            setSelectedValue(defaultValueToken);
                        }}
                    >
                        <X className="h-3 w-3 mr-1" />
                        Limpiar filtro
                    </Button>
                </div>
            )}
        </div>
    );
};