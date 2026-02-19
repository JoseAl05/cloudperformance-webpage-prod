'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command, CommandEmpty, CommandGroup, CommandItem, CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface EstadoUsoFilterProps {
    estadoUso: string;
    setEstadoUso: (type: string) => void;
}

const ESTADO_USO_OPTIONS = [
    { value: 'all', label: 'Todas las Zonas' },
    { value: 'sin_uso', label: 'Solo Sin Uso' },
    { value: 'con_consumo', label: 'Solo Con Consumo' },
];

export const EstadoUsoFilterComponent = ({ 
    estadoUso, 
    setEstadoUso 
}: EstadoUsoFilterProps) => {
    const [open, setOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const selectedLabel = ESTADO_USO_OPTIONS.find(t => t.value === estadoUso)?.label || 'Selecciona estado...';

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
                            {ESTADO_USO_OPTIONS.map((opcion) => (
                                <CommandItem
                                    key={opcion.value}
                                    value={opcion.value}
                                    onSelect={() => {
                                        setEstadoUso(opcion.value);
                                        setOpen(false);
                                    }}
                                >
                                    <Check 
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            estadoUso === opcion.value ? "opacity-100" : "opacity-0"
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