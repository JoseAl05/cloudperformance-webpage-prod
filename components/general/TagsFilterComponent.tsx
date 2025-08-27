'use client'
import { useState, Dispatch, SetStateAction, useEffect } from 'react'
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
    selectedKey?: string,
    selectedValue?: string,
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
        if (setTagsData) setTagsData(data || []);
    }, [data, setTagsData])

    if (isLoading) return <div>Cargando...</div>
    if (error) return <div>Error al cargar datos</div>

    const tagMap: Record<string, Set<string>> = {}
    data?.forEach((item: unknown) => {
        item?.Tags?.forEach((tag: { Key: string; Value: string }) => {
            if (!tagMap[tag.Key]) tagMap[tag.Key] = new Set()
            tagMap[tag.Key].add(tag.Value)
        })
    })

    const keys = Array.from(new Set(Object.keys(tagMap)))
    const valuesForKey = selectedKey ? Array.from(new Set(tagMap[selectedKey])) : []

    return (
        <div className="space-y-2">
            {/* Keys */}
            <Popover open={openKey} onOpenChange={setOpenKey}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openKey}
                        className="w-full justify-between bg-transparent"
                    >
                        {selectedKey || "Selecciona una Key"}
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
            {selectedKey && (
                <Popover open={openValue} onOpenChange={setOpenValue}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[300px] justify-between">
                            {selectedValue || "Selecciona un Value"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                        <Command>
                            <CommandInput placeholder="Buscar value..." />
                            <CommandList>
                                <CommandEmpty>No hay valores.</CommandEmpty>
                                <CommandGroup>
                                    {valuesForKey.map((value, idx) => (
                                        <CommandItem
                                            key={`${value}-${idx}`}
                                            onSelect={() => {
                                                setSelectedValue(value)
                                                setOpenValue(false)
                                            }}
                                        >
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
