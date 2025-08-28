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
    isRegionMultiSelect: boolean;
}

export const RegionFilterComponent = ({ selectedRegion, setSelectedRegion, isRegionMultiSelect }: RegionFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const getDisplayText = () => {
        if (!selectedRegion || selectedRegion.trim() === '') {
            return 'Todas las Regiones';
        }
        const regionArray = selectedRegion.split(',').filter((s) => s.trim() !== '');
        if (regionArray.length === 1) {
            return regionArray[0];
        } else {
            return `${regionArray.length} servicios seleccionados`;
        }
    };

    const handleRegionToggle = (regionValue: string) => {
        if (regionValue === '') {
            setSelectedRegion('Todas las Regiones');
        } else {
            const regionArray = selectedRegion ? selectedRegion.split(',') : [];
            if (regionArray.includes(regionValue)) {
                const updated = regionArray.filter((s) => s !== regionValue);
                setSelectedRegion(updated.join(','));
            } else {
                const updated = [...regionArray, regionValue];
                setSelectedRegion(updated.join(','));
            }
        }
    };
    const selectedRegionArray = selectedRegion ? selectedRegion.split(',') : [];
    return (
        !isRegionMultiSelect ? (
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
        ) : (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[250px] justify-between"
                    >
                        {getDisplayText()}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandInput placeholder="Buscar región..." />
                        <CommandEmpty>No se encontró la región.</CommandEmpty>
                        <CommandGroup className="max-h-[200px] overflow-y-auto">
                            <CommandItem value="Todas las Regiones" onSelect={() => handleRegionToggle('all_regions')}>
                                <Check
                                    className={`mr-2 h-4 w-4 ${!selectedRegion || selectedRegion.trim() === ''
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                        }`}
                                />
                                Todas las Regiones
                            </CommandItem>
                            {aws_regions.map((region) => (
                                <CommandItem
                                    key={region.value}
                                    value={region.value}
                                    onSelect={() => handleRegionToggle(region.value)}
                                >
                                    <Check
                                        className={`mr-2 h-4 w-4 ${selectedRegionArray.includes(region.value) ? 'opacity-100' : 'opacity-0'
                                            }`}
                                    />
                                    {region.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        )
    )
}