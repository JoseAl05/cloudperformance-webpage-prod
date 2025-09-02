'use client'
import { useState, Dispatch, SetStateAction, useEffect, useMemo } from 'react'
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import useSWR from 'swr'

interface TagFilterComponentProps {
    startDate: Date,
    endDate: Date,
    region: string,
    collection: string,
    tagColumnName: string,
    selectedKey?: string | null,
    selectedValue?: string | null,
    setSelectedKey: Dispatch<SetStateAction<string | null>>,
    setSelectedValue: Dispatch<SetStateAction<string | null>>,
    setTagsData?: Dispatch<SetStateAction<unknown[]>>
}

const fetcher = (url: string) =>
    fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            "Content-Type": "application/json"
        }
    }).then(res => res.json())

export const TagFilterComponent = ({
    startDate,
    endDate,
    region,
    collection,
    tagColumnName,
    selectedKey,
    selectedValue,
    setSelectedKey,
    setSelectedValue,
    setTagsData
}: TagFilterComponentProps) => {

    const [openKey, setOpenKey] = useState(false)
    const [openValue, setOpenValue] = useState(false)

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

    const { data, error, isLoading } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/get-all-tags?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&collection=${collection}&tag_column_name=${tagColumnName}`,
        fetcher
    )

    useEffect(() => {
        if (setTagsData) setTagsData(data || [])
    }, [data, setTagsData])

    const tagMap: Record<string, Set<string>> = {}
    data?.forEach((item: unknown) => {
        item?.Tags?.forEach((tag: { Key: string; Value: string }) => {
            if (!tagMap[tag.Key]) tagMap[tag.Key] = new Set()
            tagMap[tag.Key].add(tag.Value)
        })
    })

    const keys = Object.keys(tagMap)


    const valuesForKey = useMemo(
        () => (selectedKey ? Array.from(tagMap[selectedKey] || []) : []),
        [selectedKey, tagMap]
    )

    const isValidKey = selectedKey && keys.includes(selectedKey)
    const isValidValue = selectedValue && isValidKey && valuesForKey.includes(selectedValue)
    useEffect(() => {
        if (!data || isLoading) return
        if (selectedKey && !keys.includes(selectedKey)) {
            setSelectedKey(null)
            setSelectedValue(null)
        }
        else if (selectedValue && selectedKey && !valuesForKey.includes(selectedValue)) {
            setSelectedValue(null)
        }
    }, [data, isLoading, keys, valuesForKey, selectedKey, selectedValue, setSelectedKey, setSelectedValue])

    if (isLoading) return <div>Cargando...</div>
    if (error) return <div>Error al cargar datos</div>

    return (
        <div className="space-y-2">
            <Popover open={openKey} onOpenChange={setOpenKey}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openKey}
                        className="w-full justify-between bg-transparent"
                    >
                        {isValidKey ? selectedKey : "Selecciona una Key"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Buscar key..." />
                        <CommandList>
                            <CommandEmpty>No hay keys.</CommandEmpty>
                            <CommandGroup>
                                <CommandItem
                                    value="allKeys"
                                    onSelect={() => {
                                        setSelectedKey(null)
                                        setSelectedValue(null)
                                        setOpenKey(false)
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
                                        }}
                                    >
                                        <Check className={cn("mr-2 h-4 w-4", selectedKey === key ? "opacity-100" : "opacity-0")} />
                                        {key}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
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