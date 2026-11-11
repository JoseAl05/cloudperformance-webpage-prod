'use client'

import { useState, type Dispatch, type SetStateAction } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type BusinessUnit = 'all' | 'CV' | 'MEDICARTE';

export const parseBusinessUnit = (value: string | null): BusinessUnit =>
    value === 'CV' || value === 'MEDICARTE' ? value : 'all';

interface BusinessUnitFilterComponentProps {
    businessUnit: BusinessUnit;
    setBusinessUnit: Dispatch<SetStateAction<BusinessUnit>>;
}

const BUSINESS_UNITS: Array<{ value: BusinessUnit; label: string }> = [
    { value: 'all', label: 'Todas las opciones' },
    { value: 'CV', label: 'Cruz Verde' },
    { value: 'MEDICARTE', label: 'Medicarte' },
];

export const BusinessUnitFilterComponent = ({
    businessUnit,
    setBusinessUnit
}: BusinessUnitFilterComponentProps) => {
    const [open, setOpen] = useState(false);
    const selectedLabel = BUSINESS_UNITS.find((item) => item.value === businessUnit)?.label;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent hover:bg-accent'
                >
                    <span className='truncate text-left max-w-[90%]'>
                        {selectedLabel ?? 'Seleccionar unidad...'}
                    </span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[--radix-popover-trigger-width] p-0' align='start'>
                <Command>
                    <CommandInput placeholder='Buscar unidad de negocio...' />
                    <CommandList>
                        <CommandEmpty>No se encontró unidad de negocio.</CommandEmpty>
                        <CommandGroup className='max-h-[250px] overflow-y-auto'>
                            {BUSINESS_UNITS.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={`${item.label} ${item.value}`}
                                    onSelect={() => {
                                        setBusinessUnit(item.value);
                                        setOpen(false);
                                    }}
                                >
                                    <Check className={cn(
                                        'mr-2 h-4 w-4',
                                        businessUnit === item.value ? 'opacity-100' : 'opacity-0'
                                    )} />
                                    <span className='truncate'>{item.label}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
