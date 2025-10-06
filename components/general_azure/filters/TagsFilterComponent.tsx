'use client'
import { useState, Dispatch, SetStateAction, useEffect, useMemo } from 'react'
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import useSWR from 'swr'
import { LoaderComponent } from '../LoaderComponent'

interface TagFilterComponentProps {
    startDate: Date,
    endDate: Date,
    region: string,
    subscription: string,
    collection: string,
    tagColumnName: string,
    regionField?: string,
    subscriptionField?: string,
    selectedKey?: string | null,
    selectedValue?: string | null,
    setSelectedKey: Dispatch<SetStateAction<string | null>>,
    setSelectedValue: Dispatch<SetStateAction<string | null>>,
    setTagsData?: Dispatch<SetStateAction<unknown[]>>,
    onChange?: (next: { key: string | null; value: string | null }) => void
}

interface AzureTagItem {
    Key: string;
    Values: string[];
}

const fetcher = (url: string) =>
    fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            "Content-Type": "application/json"
        }
    }).then(res => res.json())

export const TagsFilterComponent = ({
    startDate,
    endDate,
    region,
    subscription,
    collection,
    tagColumnName,
    regionField = 'location',
    subscriptionField = 'subscription_id',
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

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

    const shouldFetch = !!subscription && !!region
    
    const { data, error, isLoading } = useSWR(
        shouldFetch
            ? `/api/azure/bridge/azure/get-all-tags?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&region_field=${regionField}&subscription=${subscription}&subscription_field=${subscriptionField}&collection=${collection}&tag_column_name=${tagColumnName}`
            : null,
        fetcher
    )

    useEffect(() => {
        if (setTagsData) setTagsData(data || [])
    }, [data, setTagsData])

    const tagMap: Record<string, Set<string>> = {};
    if (Array.isArray(data)) {
        data.forEach((item: AzureTagItem) => {
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
        () => (selectedKey ? Array.from(tagMap[selectedKey] || []) : []),
        [selectedKey, tagMap]
    )

    const isValidKey = !!(selectedKey && keys.includes(selectedKey))
    const isValidValue = !!(selectedValue && isValidKey && valuesForKey.includes(selectedValue))

    useEffect(() => {
        if (!data || isLoading) return
        if (selectedKey && !keys.includes(selectedKey)) {
            setSelectedKey(null)
            setSelectedValue(null)
        } else if (selectedValue && selectedKey && !valuesForKey.includes(selectedValue)) {
            setSelectedValue(null)
        }
    }, [data, isLoading, keys, valuesForKey, selectedKey, selectedValue, setSelectedKey, setSelectedValue])

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar tags de Azure</div>

    const noTags = (data && data.length === 0) || keys.length === 0

    return (
        <div className="space-y-2">
            <Popover open={openKey} onOpenChange={setOpenKey}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={openKey} className="w-full justify-between bg-transparent">
                        {noTags ? 'Sin tags disponibles' : (isValidKey ? selectedKey : 'Selecciona una Key')}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Buscar key..." />
                        <CommandList>
                            <CommandEmpty>{noTags ? 'No hay tags disponibles.' : 'No hay keys.'}</CommandEmpty>
                            {!noTags && (
                                <CommandGroup>
                                    <CommandItem
                                        value="allKeys"
                                        onSelect={() => {
                                            setSelectedKey(null)
                                            setSelectedValue(null)
                                            setOpenKey(false)
                                            onChange?.({ key: null, value: null })
                                        }}
                                    >
                                        <Check className={cn("mr-2 h-4 w-4", !selectedKey ? "opacity-100" : "opacity-0")} />
                                        Todas las claves
                                    </CommandItem>
                                    {keys.map((key, idx) => (
                                        <CommandItem
                                            key={`${key}-${idx}`}
                                            onSelect={() => {
                                                setSelectedKey(key)
                                                setSelectedValue(null)
                                                setOpenKey(false)
                                                onChange?.({ key, value: null })
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

            {isValidKey && (
                <Popover open={openValue} onOpenChange={setOpenValue}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                            {isValidValue ? selectedValue : "Selecciona un Value"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder="Buscar value..." />
                            <CommandList>
                                <CommandEmpty>No hay valores.</CommandEmpty>
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => {
                                            setSelectedValue(null)
                                            setOpenValue(false)
                                            onChange?.({ key: selectedKey ?? null, value: null })
                                        }}
                                    >
                                        <Check className={cn("mr-2 h-4 w-4", !selectedValue ? "opacity-100" : "opacity-0")} />
                                        Todos los valores
                                    </CommandItem>
                                    {valuesForKey.map((value, idx) => (
                                        <CommandItem
                                            key={`${value}-${idx}`}
                                            onSelect={() => {
                                                setSelectedValue(value)
                                                setOpenValue(false)
                                                onChange?.({ key: selectedKey ?? null, value })
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