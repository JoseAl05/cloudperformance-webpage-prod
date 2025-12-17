'use client'

import { Dispatch, SetStateAction, useMemo, useState, useEffect } from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_azure/LoaderComponent'
import { AuditPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent'

export const TAG_DEFAULTS = {
    ALL_KEYS_A: "allKeysA",
    ALL_VALUES_A: "allValuesA",
    ALL_KEYS_B: "allKeysB",
    ALL_VALUES_B: "allValuesB",
};

interface MultiTenantTagsFilterComponentProps {
    selectedKeyA: string | null;
    setSelectedKeyA: Dispatch<SetStateAction<string | null>>;
    selectedValueA: string | null;
    setSelectedValueA: Dispatch<SetStateAction<string | null>>;
    selectedKeyB: string | null;
    setSelectedKeyB: Dispatch<SetStateAction<string | null>>;
    selectedValueB: string | null;
    setSelectedValueB: Dispatch<SetStateAction<string | null>>;
    startDate: Date;
    endDate: Date;
    region: string;
    subscriptionA: string;
    subscriptionB: string;
    payload: AuditPayload;
}

interface AzureTagItem {
    Key: string;
    Values: string[];
}

interface TagsResponse {
    tags_tenant_a: AzureTagItem[];
    tags_tenant_b: AzureTagItem[];
}

const fetcherPost = async ([url, payload]: [string, unknown]) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Error al obtener tags');
    return res.json();
};

export const MultiTenantTagsFilterComponent = ({
    selectedKeyA, setSelectedKeyA,
    selectedValueA, setSelectedValueA,
    selectedKeyB, setSelectedKeyB,
    selectedValueB, setSelectedValueB,
    startDate,
    endDate,
    region,
    subscriptionA,
    subscriptionB,
    payload
}: MultiTenantTagsFilterComponentProps) => {

    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const url = `/api/comparison-cloud/bridge/intracloud/tags/get-all-tags?date_from=${startDateFormatted}&date_to=${endDateFormatted}&location=${region}&subscription_tenant_a=${subscriptionA}&subscription_tenant_b=${subscriptionB}`;

    const shouldFetch = !!(payload && subscriptionA && subscriptionB);

    const { data, error, isLoading } = useSWR<TagsResponse>(
        shouldFetch ? [url, payload] : null,
        fetcherPost,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    );

    if (isLoading) return <LoaderComponent size="small" />
    if (error) return <div className="text-red-500 text-xs">Error cargando tags</div>

    const listTagsA = data?.tags_tenant_a || [];
    const listTagsB = data?.tags_tenant_b || [];

    return (
        <div className="grid grid-cols-1 gap-4">
            <SingleTenantTagSelector
                label="Tags Tenant A"
                tags={listTagsA}
                selectedKey={selectedKeyA}
                setSelectedKey={setSelectedKeyA}
                selectedValue={selectedValueA}
                setSelectedValue={setSelectedValueA}
                isDisabled={!subscriptionA}
                defaultKeyToken={TAG_DEFAULTS.ALL_KEYS_A}
                defaultValueToken={TAG_DEFAULTS.ALL_VALUES_A}
            />

            <SingleTenantTagSelector
                label="Tags Tenant B"
                tags={listTagsB}
                selectedKey={selectedKeyB}
                setSelectedKey={setSelectedKeyB}
                selectedValue={selectedValueB}
                setSelectedValue={setSelectedValueB}
                isDisabled={!subscriptionB}
                defaultKeyToken={TAG_DEFAULTS.ALL_KEYS_B}
                defaultValueToken={TAG_DEFAULTS.ALL_VALUES_B}
            />
        </div>
    )
}

interface SingleTenantTagSelectorProps {
    label: string;
    tags: AzureTagItem[];
    selectedKey: string | null;
    setSelectedKey: Dispatch<SetStateAction<string | null>>;
    selectedValue: string | null;
    setSelectedValue: Dispatch<SetStateAction<string | null>>;
    isDisabled?: boolean;
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
    isDisabled,
    defaultKeyToken,
    defaultValueToken
}: SingleTenantTagSelectorProps) => {
    const [openKey, setOpenKey] = useState(false);
    const [openValue, setOpenValue] = useState(false);

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

    const allKeysOptions = useMemo(() => {
        if (realKeys.length === 0) return [];
        return [defaultKeyToken, ...realKeys];
    }, [realKeys, defaultKeyToken]);

    const valuesOptions = useMemo(() => {
        if (!selectedKey || selectedKey === defaultKeyToken) {
            return [defaultValueToken];
        }

        const realValues = Array.from(tagMap[selectedKey] || []).sort();
        return [defaultValueToken, ...realValues];
    }, [selectedKey, tagMap, defaultKeyToken, defaultValueToken]);

    const noTags = realKeys.length === 0;

    const getDisplayLabel = (val: string | null, isKey: boolean) => {
        if (!val) return isKey ? "Seleccionar Clave..." : "Seleccionar Valor...";
        if (val === defaultKeyToken) return "Todas las Claves";
        if (val === defaultValueToken) return "Todos los Valores";
        return val;
    };

    useEffect(() => {
        if (!tags || tags.length === 0) return;
        if (selectedKey && selectedKey !== defaultKeyToken && !realKeys.includes(selectedKey)) {
            setSelectedKey(defaultKeyToken);
            setSelectedValue(defaultValueToken);
            return;
        }
        if (selectedKey === defaultKeyToken && selectedValue !== defaultValueToken) {
            setSelectedValue(defaultValueToken);
        }

    }, [tags, realKeys, selectedKey, selectedValue, defaultKeyToken, defaultValueToken, setSelectedKey, setSelectedValue]);


    return (
        <div className="space-y-2 border border-dashed border-gray-200 p-3 rounded-md bg-slate-50/50">
            <span className='text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1'>
                {label}
            </span>
            <Popover open={openKey} onOpenChange={setOpenKey}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between bg-white text-xs h-8"
                        disabled={isDisabled || noTags}
                    >
                        <span className="truncate max-w-[90%]">
                            {getDisplayLabel(selectedKey, true)}
                        </span>
                        <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Buscar clave..." className="h-8 text-xs" />
                        <CommandList>
                            <CommandEmpty>No se encontraron claves.</CommandEmpty>
                            <CommandGroup className="max-h-[200px] overflow-y-auto">
                                {allKeysOptions.map((key) => (
                                    <CommandItem
                                        key={key}
                                        value={key}
                                        onSelect={() => {
                                            setSelectedKey(key);
                                            // Al cambiar Key, siempre reseteamos Value al default
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

            {selectedKey && (
                <div className="flex gap-2 items-center animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="relative w-full">
                        <Popover open={openValue} onOpenChange={setOpenValue}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    disabled={selectedKey === defaultKeyToken}
                                    className="w-full justify-between bg-white text-xs h-8 disabled:opacity-70 disabled:bg-gray-100"
                                >
                                    <span className="truncate max-w-[90%]">
                                        {getDisplayLabel(selectedValue, false)}
                                    </span>
                                    <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[240px] p-0" align="start">
                                <Command>
                                    <CommandInput placeholder="Buscar valor..." className="h-8 text-xs" />
                                    <CommandList>
                                        <CommandEmpty>No se encontraron valores.</CommandEmpty>
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
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-gray-400 hover:text-blue-500"
                        onClick={() => setSelectedValue(defaultValueToken)}
                        title="Resetear valor"
                        disabled={selectedValue === defaultValueToken || selectedKey === defaultKeyToken}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            )}
            {(selectedKey !== defaultKeyToken || selectedValue !== defaultValueToken) && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[10px] text-gray-400 hover:text-blue-500 w-full mt-1"
                    onClick={() => {
                        setSelectedKey(defaultKeyToken);
                        setSelectedValue(defaultValueToken);
                    }}
                >
                    Resetear Filtro {label.replace('Tags ', '')}
                </Button>
            )}
        </div>
    );
};