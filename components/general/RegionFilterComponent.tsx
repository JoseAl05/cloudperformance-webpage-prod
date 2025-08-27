'use client'
import { Dispatch, SetStateAction, useState } from 'react'
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

import { aws_regions } from '@/lib/aws_regions'

interface RegionFilterComponentProps {
    selectedRegion: string;
    setSelectedRegion: Dispatch<SetStateAction<string>>;
}

export const RegionFilterComponent = ({ selectedRegion, setSelectedRegion }: RegionFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-transparent"
                >
                    {selectedRegion === "all_regions"
                        ? "Todas las Regiones"
                        : aws_regions.find((region) => region.value === selectedRegion)?.label}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Buscar Región..." />
                    <CommandList>
                        <CommandEmpty>No se encontró región.</CommandEmpty>
                        <CommandGroup>
                            <CommandItem
                                value="all_regions"
                                onSelect={() => {
                                    setSelectedRegion('all_regions')
                                }}
                            >
                                <Check className={cn("ml-auto mr-2 h-4 w-4", !selectedRegion ? "opacity-100" : "opacity-0")} />
                                Todas las regiones
                            </CommandItem>
                            {aws_regions.map((region) => (
                                <CommandItem
                                    key={region.value}
                                    value={region.value}
                                    onSelect={(currentValue) => {
                                        setSelectedRegion(currentValue === selectedRegion ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn("ml-auto mr-2 h-4 w-4", selectedRegion === region.value ? "opacity-100" : "opacity-0")}
                                    />
                                    {region.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}