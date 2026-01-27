'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatabaseTypeFilterProps {
    databaseType: string;
    setDatabaseType: (type: string) => void;
}

const DB_TYPES = [
    { value: 'all', label: 'Todas las BD' },
    { value: 'POSTGRES', label: 'PostgreSQL' },
    { value: 'MYSQL', label: 'MySQL' },
    { value: 'SQLSERVER', label: 'SQL Server' },
];

export const DatabaseTypeFilterComponent = ({ 
    databaseType, 
    setDatabaseType 
}: DatabaseTypeFilterProps) => {
    const [open, setOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const selectedLabel = DB_TYPES.find(t => t.value === databaseType)?.label || 'Selecciona tipo BD...';

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
                    <CommandInput placeholder="Buscar tipo BD..." />
                    <CommandList>
                        <CommandEmpty>No encontrado.</CommandEmpty>
                        <CommandGroup>
                            {DB_TYPES.map((type) => (
                                <CommandItem
                                    key={type.value}
                                    value={type.value}
                                    onSelect={() => {
                                        setDatabaseType(type.value);
                                        setOpen(false);
                                    }}
                                >
                                    <Check 
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            databaseType === type.value ? "opacity-100" : "opacity-0"
                                        )} 
                                    />
                                    {type.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};