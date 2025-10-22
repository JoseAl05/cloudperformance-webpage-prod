'use client'
import { Dispatch, SetStateAction, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_azure/LoaderComponent'

interface ImpactFilterComponentProps {
    impact: string | null
    setImpact: Dispatch<SetStateAction<string | null>>
}

const fetcherGet = (url: string) =>
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => res.json());

export const ImpactFilterComponent = ({
    impact,
    setImpact
}: ImpactFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const url = `/api/azure/bridge/azure/get-all-impact-category`;

    const { data, error, isLoading } = useSWR<{ impacts: string[], categories: string[] }>(url, fetcherGet);

    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar impactos</div>

    const impacts: string[] = Array.isArray(data?.impacts) ? data.impacts : []
    const noImpacts = impacts.length === 0
    
    // Agregar "Ver todos" al inicio
    const impactsWithAll = noImpacts ? [] : ['Ver todos', ...impacts]

    const getDisplayText = () => {
        if (noImpacts) return 'Sin impactos disponibles';
        if (impact === null || impact === undefined) return 'Seleccione un impacto';
        if (impact === '') return 'Ver todos';
        return impact;
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={noImpacts}
                >
                    <span className="truncate text-left max-w-[85%]">
                        {getDisplayText()}
                    </span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar impacto...' />
                    <CommandEmpty>
                        {noImpacts ? 'No hay impactos disponibles.' : 'No se encontró impacto.'}
                    </CommandEmpty>
                    {!noImpacts && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            {impactsWithAll.map((imp: string) => (
                                <CommandItem
                                    key={imp}
                                    value={imp}
                                    onSelect={() => {
                                        // Si selecciona "Ver todos", pasa string vacío
                                        setImpact(imp === 'Ver todos' ? '' : imp);
                                        setOpen(false);
                                    }}
                                >
                                    <Check className={cn('mr-2 h-4 w-4', 
                                        (imp === 'Ver todos' && impact === '') || impact === imp 
                                        ? 'opacity-100' 
                                        : 'opacity-0'
                                    )} />
                                    {imp}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    );
};