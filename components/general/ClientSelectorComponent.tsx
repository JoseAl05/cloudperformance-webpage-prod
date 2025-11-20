'use client';

import React, { useEffect, useState } from 'react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { useClientContext } from '@/components/context/ClientContext';

import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from "@/components/ui/popover";

import { Command, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";


export default function ClientSelectorComponent() {
    const { isGlobalAdmin, companiesList, loading, swapContextToken, setSelectedCompany } = useFeatureAccess(); 
    const { selectedCompany } = useClientContext();

    const [open, setOpen] = useState(false);

    if (!isGlobalAdmin) return null;

    // Seleccionar el primero automáticamente
    useEffect(() => {
        if (!selectedCompany && companiesList.length > 0) {
            setSelectedCompany(companiesList[0]);
            swapContextToken(companiesList[0].name);
        }
    }, [companiesList, selectedCompany, setSelectedCompany, swapContextToken]);

    const handleSelect = (clientName: string) => {
        const selected = companiesList.find(c => c.name === clientName) || null;
        setSelectedCompany(selected);

        if (selected) swapContextToken(selected.name);
        setOpen(false);
    };

    if (loading) return <span className="text-gray-400">Cargando clientes...</span>;
    if (companiesList.length === 0) return <span className="text-red-500">No hay clientes registrados.</span>;

    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Visualizando cliente:</span>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-64 justify-between"
                    >
                        {selectedCompany?.name || "Seleccionar cliente"}
                        <ChevronsUpDown className="opacity-50 h-4 w-4" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-64 p-0">
                    <Command>
                        <CommandInput placeholder="Buscar empresa..." />

                        <CommandList>
                            <CommandEmpty>No se encontró ningún cliente.</CommandEmpty>

                            <CommandGroup>
                                {companiesList.map(comp => (
                                    <CommandItem
                                        key={comp._id.toString()}
                                        value={comp.name}
                                        onSelect={handleSelect}
                                        className="cursor-pointer"
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedCompany?.name === comp.name ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {comp.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
