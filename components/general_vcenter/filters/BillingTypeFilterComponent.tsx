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

export type BillingType = 'all' | 'fixed' | 'variable';

export const parseBillingType = (value: string | null): BillingType =>
    value === 'fixed' || value === 'variable' ? value : 'all';

interface BillingTypeFilterComponentProps {
    billingType: BillingType;
    setBillingType: Dispatch<SetStateAction<BillingType>>;
}

const BILLING_TYPES: Array<{ value: BillingType; label: string }> = [
    { value: 'all', label: 'Todas las opciones' },
    { value: 'fixed', label: 'Fija' },
    { value: 'variable', label: 'Variable' },
];

export const BillingTypeFilterComponent = ({
    billingType,
    setBillingType
}: BillingTypeFilterComponentProps) => {
    const [open, setOpen] = useState(false);
    const selectedLabel = BILLING_TYPES.find((item) => item.value === billingType)?.label;

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
                        {selectedLabel ?? 'Seleccionar tipo...'}
                    </span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[--radix-popover-trigger-width] p-0' align='start'>
                <Command>
                    <CommandInput placeholder='Buscar tipo de facturación...' />
                    <CommandList>
                        <CommandEmpty>No se encontró tipo de facturación.</CommandEmpty>
                        <CommandGroup className='max-h-[250px] overflow-y-auto'>
                            {BILLING_TYPES.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={`${item.label} ${item.value}`}
                                    onSelect={() => {
                                        setBillingType(item.value);
                                        setOpen(false);
                                    }}
                                >
                                    <Check className={cn(
                                        'mr-2 h-4 w-4',
                                        billingType === item.value ? 'opacity-100' : 'opacity-0'
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
