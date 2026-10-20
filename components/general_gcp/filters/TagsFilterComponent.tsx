'use client'
import { fetcher } from '@/lib/fetcher';
import { useState, Dispatch, SetStateAction, useEffect, useMemo } from 'react'
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import useSWR from 'swr'

interface TagFilterComponentProps {
    startDate: Date,
    endDate: Date,
    regions: string,
    projects: string,
    resourceType: string,
    localService: string,

    selectedKey?: string | null,
    selectedValue?: string | null,
    setSelectedKey: Dispatch<SetStateAction<string | null>>,
    setSelectedValue: Dispatch<SetStateAction<string | null>>,
    setTagsData?: Dispatch<SetStateAction<unknown[]>>,
    onChange?: (next: { key: string | null; value: string | null }) => void
}

interface GcpTagItem {
    Key: string;
    Values: string[];
}

export const TagsFilterComponent = ({
    startDate,
    endDate,
    regions,
    projects,
    resourceType,
    localService,
    selectedKey,
    selectedValue,
    setSelectedKey,
    setSelectedValue,
    setTagsData,
    onChange
}: TagFilterComponentProps) => {
    const [openKey, setOpenKey] = useState(false)
    const [openValue, setOpenValue] = useState(false)
    const [isMounted, setIsMounted] = useState(false);

    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : ''
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

    const shouldFetch = !!projects

    const url = `/api/gcp/bridge/gcp/general/get_all_tags?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${regions}&project=${projects}&resource_type=${resourceType}&local_service=${localService}`;

    const { data, error, isLoading } = useSWR<GcpTagItem[]>(
        shouldFetch ? url : null,
        fetcher
    )

    useEffect(() => {
        if (setTagsData) setTagsData(data || [])
    }, [data, setTagsData])

    const tagMap: Record<string, Set<string>> = {};
    if (Array.isArray(data)) {
        data.forEach((item: GcpTagItem) => {
            if (!item || !item.Key || !item.Values) return;

            if (!tagMap[item.Key]) {
                tagMap[item.Key] = new Set<string>();
            }

            item.Values.forEach(value => {
                tagMap[item.Key].add(value);
            });
        });
    }

    const keys = Object.keys(tagMap)

    const valuesForKey = useMemo(
        () => ((selectedKey && selectedKey !== 'allKeys') ? Array.from(tagMap[selectedKey] || []) : []),
        [selectedKey, tagMap]
    )

    const noTags = (data && data.length === 0) || keys.length === 0
    const isValidKey = !!(selectedKey && !noTags && (keys.includes(selectedKey) || selectedKey === 'allKeys'))
    const isValidValue = !!(selectedValue && isValidKey && (valuesForKey.includes(selectedValue) || selectedValue === 'allValues'))

    useEffect(() => {
        if (isLoading || !data || keys.length === 0) return;

        if (!selectedKey) {
            setSelectedKey('allKeys');
            setSelectedValue('allValues');
        }
        else if (!selectedValue) {
            setSelectedValue('allValues');
        }

    }, [data, isLoading, keys, selectedKey, selectedValue, setSelectedKey, setSelectedValue]);

    useEffect(() => {
        if (!data || isLoading) return

        if (keys.length === 0) {
            if (selectedKey !== 'allKeys') setSelectedKey('allKeys')
            if (selectedValue !== 'allValues') setSelectedValue('allValues')
            return
        }

        if (selectedKey && selectedKey !== 'allKeys' && !keys.includes(selectedKey)) {
            setSelectedKey('allKeys')
            setSelectedValue('allValues')
            onChange?.({ key: 'allKeys', value: 'allValues' })
        }
        else if (selectedValue && selectedValue !== 'allValues' && selectedKey && selectedKey !== 'allKeys' && !valuesForKey.includes(selectedValue)) {
            setSelectedValue('allValues')
            onChange?.({ key: selectedKey, value: 'allValues' })
        }
    }, [data, isLoading, keys, valuesForKey, selectedKey, selectedValue, setSelectedKey, setSelectedValue, onChange])

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    if (isLoading) return <div className="text-xs text-muted-foreground">Cargando tags...</div>
    if (error) return <div className="text-xs text-red-500">Error tags</div>

    return (
        <div className="space-y-2">
            <Popover open={openKey} onOpenChange={setOpenKey}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={openKey} className="w-full justify-between bg-transparent">
                        <span className="truncate">
                            {noTags
                                ? 'Sin tags'
                                : (isValidKey
                                    ? (selectedKey === 'allKeys' ? 'Todas las claves' : selectedKey)
                                    : 'Selecciona una key...')}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Buscar key..." />
                        <CommandList>
                            <CommandEmpty>{noTags ? 'No hay tags.' : 'No hay keys.'}</CommandEmpty>
                            {!noTags && (
                                <CommandGroup>
                                    <CommandItem
                                        value="allKeys"
                                        onSelect={() => {
                                            setSelectedKey("allKeys")
                                            setSelectedValue("allValues")
                                            setOpenKey(false)
                                            onChange?.({ key: "allKeys", value: "allValues" })
                                        }}
                                    >
                                        <Check className={cn("mr-2 h-4 w-4", selectedKey === 'allKeys' ? "opacity-100" : "opacity-0")} />
                                        Todas las claves
                                    </CommandItem>
                                    {keys.map((key, idx) => (
                                        <CommandItem
                                            key={`${key}-${idx}`}
                                            value={key}
                                            onSelect={() => {
                                                setSelectedKey(key)
                                                setSelectedValue("allValues")
                                                setOpenKey(false)
                                                onChange?.({ key, value: "allValues" })
                                            }}
                                        >
                                            <Check className={cn("mr-2 h-4 w-4", selectedKey === key ? "opacity-100" : "opacity-0")} />
                                            {key}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {isValidKey && selectedKey !== 'allKeys' && (
                <Popover open={openValue} onOpenChange={setOpenValue}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between bg-transparent">
                            <span className="truncate">
                                {isValidValue
                                    ? (selectedValue === 'allValues' ? 'Todos los valores' : selectedValue)
                                    : "Selecciona un valor..."}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Buscar value..." />
                            <CommandList>
                                <CommandEmpty>No hay valores.</CommandEmpty>
                                <CommandGroup>
                                    <CommandItem
                                        value="allValues"
                                        onSelect={() => {
                                            setSelectedValue("allValues")
                                            setOpenValue(false)
                                            onChange?.({ key: selectedKey ?? "allKeys", value: "allValues" })
                                        }}
                                    >
                                        <Check className={cn("mr-2 h-4 w-4", selectedValue === 'allValues' ? "opacity-100" : "opacity-0")} />
                                        Todos los valores
                                    </CommandItem>
                                    {valuesForKey.map((value, idx) => (
                                        <CommandItem
                                            key={`${value}-${idx}`}
                                            value={value}
                                            onSelect={() => {
                                                setSelectedValue(value)
                                                setOpenValue(false)
                                                onChange?.({ key: selectedKey ?? "allKeys", value })
                                            }}
                                        >
                                            <Check className={cn("mr-2 h-4 w-4", selectedValue === value ? "opacity-100" : "opacity-0")} />
                                            {value}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    )
}