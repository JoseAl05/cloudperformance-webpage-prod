'use client'

import { useState, useEffect, useMemo } from 'react'
import { Check, ChevronsUpDown, Loader2} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import useSWR from 'swr'
import Image from 'next/image'

interface MultiCloudTagFilterProps {
    provider: 'azure' | 'aws' | 'gcp';
    dbs: string;
    startDate: Date;
    endDate: Date;
    selectedKey?: string | null;
    selectedValue?: string | null;
    onChange: (key: string | null, value: string | null) => void;
}

interface TagItem {
    Key: string;
    Values: string[];
}

const fetcher = (url: string) =>
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())

export const MultiCloudTagFilter = ({
    provider,
    dbs,
    startDate,
    endDate,
    selectedKey,
    selectedValue,
    onChange
}: MultiCloudTagFilterProps) => {
    const [openKey, setOpenKey] = useState(false)
    const [openValue, setOpenValue] = useState(false)
    const [isMounted, setIsMounted] = useState(false);

    // Formateo de fechas
    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : ''
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

    const shouldFetch = !!dbs

    // URL dinámica según el proveedor
    const getUrl = () => {
        if (!shouldFetch) return null;
        
        if (provider === 'azure') {
            return `/api/azure/bridge/azure/multitenant/get-all-tags?dbs=${dbs}&date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=all_regions&region_field=resource_location&subscription=all&subscription_field=subscription_name&collection=azure_consumption_billing_account_modern_usage_details&tag_column_name=tags`;
        }
        if (provider === 'aws') {
            return `/api/aws/bridge/multitenant/get-all-tags?dbs=${dbs}&date_from=${startDateFormatted}&date_to=${endDateFormatted}&collection=aws_resources&tag_column_name=Tags`;
        }
        if (provider === 'gcp') {
            return `/api/gcp/bridge/gcp/general/multitenant/get_all_tags?dbs=${dbs}&date_from=${startDateFormatted}&date_to=${endDateFormatted}&collection=gcp_billing_export_detailed&tag_column_name=labels`;
        }   
        return null;
    };

    const { data, error, isLoading } = useSWR(
        getUrl(),
        fetcher
    )

    // Lógica de transformación de datos
    const tagMap: Record<string, Set<string>> = {};
    if (Array.isArray(data)) {
        data.forEach((item: TagItem) => {
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

    // ----------------------------------------------------------------------
    // 1. Efecto para asignar valores por DEFECTO ('allKeys' / 'allValues')
    // ----------------------------------------------------------------------
    useEffect(() => {
        if (isLoading || !data || keys.length === 0) return;

        // Si no hay key seleccionada, forzar 'allKeys'
        if (!selectedKey) {
            onChange('allKeys', 'allValues');
        }
        // Si hay key pero no hay valor, forzar 'allValues'
        else if (!selectedValue) {
            onChange(selectedKey, 'allValues');
        }

    }, [data, isLoading, keys, selectedKey, selectedValue, onChange]);

    // ----------------------------------------------------------------------
    // 2. Efecto de Limpieza / Validación si los datos cambian
    // ----------------------------------------------------------------------
    useEffect(() => {
        if (!data || isLoading) return

        if (keys.length === 0) {
            if (selectedKey !== 'allKeys' || selectedValue !== 'allValues') {
                onChange('allKeys', 'allValues');
            }
            return
        }

        // Si la key seleccionada ya no existe en los nuevos datos (y no es 'allKeys'), resetear a default
        if (selectedKey && selectedKey !== 'allKeys' && !keys.includes(selectedKey)) {
            onChange('allKeys', 'allValues');
        }
        // Si el valor seleccionado ya no existe para la key actual (y no es 'allValues'), resetear valor
        else if (selectedValue && selectedValue !== 'allValues' && selectedKey && selectedKey !== 'allKeys' && !valuesForKey.includes(selectedValue)) {
            onChange(selectedKey, 'allValues');
        }
    }, [data, isLoading, keys, valuesForKey, selectedKey, selectedValue, onChange])

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const providerName = provider === 'aws' ? 'AWS' : provider === 'azure' ? 'Azure' : 'GCP';

    return (
        <div className="space-y-2 border border-slate-100 dark:border-slate-800 p-3 rounded-md bg-white dark:bg-slate-900/50 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-2 mb-2">
                <Image src={`/${provider}.svg`} width={16} height={16} alt={provider} />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{providerName}</span>
                {isLoading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground ml-auto" />}
            </div>
            
            {error && <div className="text-xs text-red-500 py-1">Error cargando etiquetas.</div>}

            {/* Combo 1: KEY */}
            <Popover open={openKey} onOpenChange={setOpenKey}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={openKey} className="w-full justify-between bg-transparent disabled:opacity-50" disabled={noTags || isLoading}>
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
                <PopoverContent className="w-[200px] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Buscar key..." />
                        <CommandList>
                            <CommandEmpty>{noTags ? 'No hay tags.' : 'No hay keys.'}</CommandEmpty>
                            {!noTags && (
                                <CommandGroup>
                                    <CommandItem
                                        value="allKeys"
                                        onSelect={() => {
                                            setOpenKey(false)
                                            onChange("allKeys", "allValues")
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
                                                setOpenKey(false)
                                                onChange(key, "allValues")
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

            {/* Combo 2: VALUE */}
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
                    <PopoverContent className="w-[200px] p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Buscar value..." />
                            <CommandList>
                                <CommandEmpty>No hay valores.</CommandEmpty>
                                <CommandGroup>
                                    <CommandItem
                                        value="allValues"
                                        onSelect={() => {
                                            setOpenValue(false)
                                            onChange(selectedKey ?? "allKeys", "allValues")
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
                                                setOpenValue(false)
                                                onChange(selectedKey ?? "allKeys", value)
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