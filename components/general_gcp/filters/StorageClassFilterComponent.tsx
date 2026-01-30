'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface StorageClassFilterProps {
    value: string;
    onChange: (value: string) => void;
}

const STORAGE_CLASSES = [
    { value: 'all', label: 'Todas las Clases' },
    { value: 'STANDARD', label: 'STANDARD' },
    { value: 'NEARLINE', label: 'NEARLINE' },
    { value: 'COLDLINE', label: 'COLDLINE' },
    { value: 'ARCHIVE', label: 'ARCHIVE' },
];

export const StorageClassFilterComponent = ({ value, onChange }: StorageClassFilterProps) => {
    const [open, setOpen] = useState(false);

    const selectedLabel = STORAGE_CLASSES.find((sc) => sc.value === value)?.label || 'Todas las Clases';

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Clase de Storage
            </label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {selectedLabel}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandList>
                            <CommandEmpty>No se encontraron clases.</CommandEmpty>
                            <CommandGroup>
                                {STORAGE_CLASSES.map((sc) => (
                                    <CommandItem
                                        key={sc.value}
                                        value={sc.value}
                                        onSelect={() => {
                                            onChange(sc.value);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                value === sc.value ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                        {sc.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};