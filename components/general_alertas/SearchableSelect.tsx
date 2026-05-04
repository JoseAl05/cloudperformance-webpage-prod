'use client';

import React, { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';

interface SearchableSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { label: string; value: string }[];
    placeholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
    className?: string;
}

export function SearchableSelect({
    value,
    onChange,
    options,
    placeholder = "Seleccionar...",
    emptyMessage = "No se encontraron resultados.",
    disabled = false,
    className
}: SearchableSelectProps) {
    const [open, setOpen] = useState(false);
    const selectedLabel = options.find((opt) => opt.value === value)?.label;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button 
                    variant="outline" 
                    role="combobox" 
                    aria-expanded={open} 
                    disabled={disabled}
                    className={cn("w-full justify-between font-normal", className)}
                >
                    <span className="truncate">
                        {selectedLabel || placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                    <CommandInput placeholder={`Buscar...`} />
                    <CommandList>
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                        <CommandGroup className="max-h-[200px] overflow-y-auto">
                            {options.map((opt) => (
                                <CommandItem 
                                    key={opt.value} 
                                    value={opt.value}
                                    onSelect={() => { 
                                        onChange(opt.value); 
                                        setOpen(false); 
                                    }}
                                >
                                    <Check className={cn('mr-2 h-4 w-4', value === opt.value ? 'opacity-100' : 'opacity-0')} />
                                    {opt.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}