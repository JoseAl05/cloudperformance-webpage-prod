'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, Layers } from "lucide-react" // Usaremos Layers como icono sugerido
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command, CommandEmpty, CommandGroup, CommandItem, CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface FilestoreTierFilterProps {
    tier: string;
    setTier: (tier: string) => void;
}

const FILESTORE_TIER_OPTIONS = [
    { value: 'all', label: 'Todos los Tiers' },
    { value: 'BASIC_HDD', label: 'Basic HDD' },
    { value: 'BASIC_SSD', label: 'Basic SSD' },
    { value: 'ZONAL', label: 'Zonal' },
    { value: 'REGIONAL', label: 'Regional' },
    { value: 'ENTERPRISE', label: 'Enterprise' },
];

export const FilestoreTierFilterComponent = ({ 
    tier, 
    setTier 
}: FilestoreTierFilterProps) => {
    const [open, setOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const selectedLabel = FILESTORE_TIER_OPTIONS.find(t => t.value === tier)?.label || 'Selecciona Tier...';

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button 
                    variant="outline" 
                    role="combobox" 
                    aria-expanded={open} 
                    className="w-full justify-between bg-transparent"
                >
                    <span className="truncate">{selectedLabel}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandEmpty>No encontrado.</CommandEmpty>
                        <CommandGroup>
                            {FILESTORE_TIER_OPTIONS.map((opcion) => (
                                <CommandItem
                                    key={opcion.value}
                                    value={opcion.value}
                                    onSelect={() => {
                                        setTier(opcion.value);
                                        setOpen(false);
                                    }}
                                >
                                    <Check 
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            tier === opcion.value ? "opacity-100" : "opacity-0"
                                        )} 
                                    />
                                    {opcion.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};