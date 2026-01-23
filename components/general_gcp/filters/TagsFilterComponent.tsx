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
// Asumo que tienes un Loader en general_gcp, si no, usa el de UI o el que tengas a mano
// import { LoaderComponent } from '@/components/general_gcp/LoaderComponent' 
// Si no existe, comenta la línea de arriba y usa un <div>Cargando...</div> provisionalmente

interface TagFilterComponentProps {
    startDate: Date,
    endDate: Date,
    regions: string,      // Azure usa 'region', GCP usa 'regions' (plural en tus otros filtros)
    projects: string,     // Azure usa 'subscription', GCP usa 'projects'
    collection: string,   // La colección de Mongo (ej: gcp_compute_disks)
    tagColumnName: string,// El campo donde están los tags (ej: labels)
    
    // Campos opcionales para mapeo en backend
    regionField?: string,
    projectField?: string,

    // Estados del padre
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

const fetcher = (url: string) =>
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())

export const TagsFilterComponent = ({
    startDate,
    endDate,
    regions,
    projects,
    collection,
    tagColumnName,
    regionField = 'location',  // En GCP suele ser 'location' o 'region'
    projectField = 'project_id', // En GCP es project_id
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

    // Formateo de fechas (aunque discos persistentes es snapshot, mantenemos estructura por si acaso)
    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : ''
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

    // Solo fetch si hay proyectos seleccionados (regiones es opcional a veces, pero mejor tenerlo)
    const shouldFetch = !!projects

    // URL adaptada a la estructura GCP
    const url = `/api/gcp/bridge/gcp/general/get_all_tags?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${regions}&region_field=${regionField}&project=${projects}&project_field=${projectField}&collection=${collection}&tag_column_name=${tagColumnName}`;

    const { data, error, isLoading } = useSWR(
        shouldFetch ? url : null,
        fetcher
    )

    useEffect(() => {
        if (setTagsData) setTagsData(data || [])
    }, [data, setTagsData])

    // Lógica de transformación de datos (Idéntica a Azure)
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
        () => (selectedKey ? Array.from(tagMap[selectedKey] || []) : []),
        [selectedKey, tagMap]
    )

    const noTags = (data && data.length === 0) || keys.length === 0
    const isValidKey = !!(selectedKey && !noTags && (keys.includes(selectedKey) || selectedKey === 'allKeys'))
    const isValidValue = !!(selectedValue && isValidKey && (valuesForKey.includes(selectedValue) || selectedValue === 'allValues'))

    // Efecto para limpiar selección si cambian los datos y la key seleccionada ya no existe
    useEffect(() => {
        if (!data || isLoading) return

        if (keys.length === 0) {
            if (selectedKey) setSelectedKey(null)
            if (selectedValue) setSelectedValue(null)
            return
        }

        if (selectedKey && selectedKey !== 'allKeys' && !keys.includes(selectedKey)) {
            setSelectedKey(null)
            setSelectedValue(null)
        } else if (selectedValue && selectedValue !== 'allValues' && selectedKey && !valuesForKey.includes(selectedValue)) {
            setSelectedValue(null)
        }
    }, [data, isLoading, keys, valuesForKey, selectedKey, selectedValue, setSelectedKey, setSelectedValue])

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    if (isLoading) return <div className="text-xs text-muted-foreground">Cargando tags...</div> // Loader simple por ahora
    if (error) return <div className="text-xs text-red-500">Error tags</div>


    return (
        <div className="space-y-2"> 
            {/* Combo 1: KEY */}
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
                                            value={key}
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

            {/* Combo 2: VALUE (Solo se muestra/habilita si hay Key) */}
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
                                            value={value}
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