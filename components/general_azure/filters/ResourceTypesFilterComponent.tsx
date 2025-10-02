'use client';
import { Dispatch, SetStateAction, useState } from 'react';
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
    PopoverTrigger,
} from '@/components/ui/popover';
import { azure_resource_types } from '@/lib/azure_resource_types';

interface ResourceTypesFilterComponentProps {
    selectedResourceType: string;
    setSelectedResourceType: Dispatch<SetStateAction<string>>;
}

export const ResourceTypesFilterComponent = ({
    selectedResourceType,
    setSelectedResourceType,
}: ResourceTypesFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const getDisplayText = () => {
        if (!selectedResourceType || selectedResourceType.trim() === '') return 'Selecciona tipo de recurso';
        const found = azure_resource_types.find((r) => r.value === selectedResourceType);
        return found ? found.label : selectedResourceType;
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between bg-transparent">
                    {getDisplayText()}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Buscar tipo..." />
                    <CommandList>
                        <CommandEmpty>No se encontró tipo de recurso.</CommandEmpty>
                        <CommandGroup className="max-h-[250px] overflow-y-auto">
                            {azure_resource_types.map((type) => (
                                <CommandItem
                                    key={type.value}
                                    value={type.value}
                                    onSelect={(currentValue) => {
                                        setSelectedResourceType(currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check className={cn('mr-2 h-4 w-4', selectedResourceType === type.value ? 'opacity-100' : 'opacity-0')} />
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