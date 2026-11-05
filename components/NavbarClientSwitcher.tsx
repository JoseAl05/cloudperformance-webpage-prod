'use client'

import { useState } from 'react';
import { Building2, Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { useActiveCompany } from '@/hooks/useActiveCompany';
import { cn } from '@/lib/utils';

export const NavbarClientSwitcher = () => {
    const { isGlobalAdmin, companiesList, loading, swapContextToken } = useFeatureAccess();
    const { activeCompanyName } = useActiveCompany();
    const [open, setOpen] = useState(false);
    const [switching, setSwitching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isGlobalAdmin) return null;

    const handleSelect = async (clientName: string) => {
        setOpen(false);
        if (clientName === activeCompanyName) return;
        setSwitching(true);
        setError(null);
        const ok = await swapContextToken(clientName);
        if (ok) {
            window.location.reload();
            return;
        }
        setError('No se pudo cambiar de empresa.');
        setSwitching(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Cambiar empresa"
                    title={error ?? 'Empresa que estás visualizando'}
                    disabled={loading || switching}
                    className={cn('h-9 rounded-full gap-2 px-3 max-w-[260px]', error && 'border-red-400 text-red-600')}
                >
                    {switching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Building2 className="h-4 w-4 shrink-0" />}
                    <span className="hidden sm:inline truncate text-sm">
                        {switching ? 'Cambiando…' : activeCompanyName ?? 'Seleccionar empresa'}
                    </span>
                    <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 p-0 z-70">
                <Command>
                    <CommandInput placeholder="Buscar empresa..." />
                    <CommandList>
                        <CommandEmpty>No se encontró ningún cliente.</CommandEmpty>
                        <CommandGroup heading="Visualizando cliente">
                            {companiesList.map((company) => (
                                <CommandItem
                                    key={company._id.toString()}
                                    value={company.name}
                                    onSelect={() => handleSelect(company.name)}
                                    className="cursor-pointer"
                                >
                                    <Check className={cn('mr-2 h-4 w-4', company.name === activeCompanyName ? 'opacity-100' : 'opacity-0')} />
                                    {company.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
