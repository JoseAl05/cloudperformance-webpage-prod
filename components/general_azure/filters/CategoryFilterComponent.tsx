'use client'
import { Dispatch, SetStateAction, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '../LoaderComponent'

interface CategoryFilterComponentProps {
    category: string | null
    setCategory: Dispatch<SetStateAction<string | null>>
}

const fetcherGet = (url: string) =>
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => res.json());

export const CategoryFilterComponent = ({
    category,
    setCategory
}: CategoryFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const url = `/api/azure/bridge/azure/get-all-impact-category`;

    const { data, error, isLoading } = useSWR<{ impacts: string[], categories: string[] }>(url, fetcherGet);

    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar categorías</div>

    const categories: string[] = Array.isArray(data?.categories) ? data.categories : []
    const noCategories = categories.length === 0
    
    // Agregar "Ver todos" al inicio
    const categoriesWithAll = noCategories ? [] : ['Ver todos', ...categories]

    const getDisplayText = () => {
        if (noCategories) return 'Sin categorías disponibles';
        if (category === null || category === undefined) return 'Seleccione una categoría';
        if (category === '') return 'Ver todos';
        return category;
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={noCategories}
                >
                    <span className="truncate text-left max-w-[85%]">
                        {getDisplayText()}
                    </span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar categoría...' />
                    <CommandEmpty>
                        {noCategories ? 'No hay categorías disponibles.' : 'No se encontró categoría.'}
                    </CommandEmpty>
                    {!noCategories && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            {categoriesWithAll.map((cat: string) => (
                                <CommandItem
                                    key={cat}
                                    value={cat}
                                    onSelect={() => {
                                        // Si selecciona "Ver todos", pasa string vacío
                                        setCategory(cat === 'Ver todos' ? '' : cat);
                                        setOpen(false);
                                    }}
                                >
                                    <Check className={cn('mr-2 h-4 w-4', 
                                        (cat === 'Ver todos' && category === '') || category === cat 
                                        ? 'opacity-100' 
                                        : 'opacity-0'
                                    )} />
                                    {cat}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    );
};