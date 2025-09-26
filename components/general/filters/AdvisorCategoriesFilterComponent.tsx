'use client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '../LoaderComponent'

interface AdvisorCategoriesFilterComponentProps {
    advisorCategory: string,
    setAdvisorCategory: Dispatch<SetStateAction<string>>,
    startDate: Date,
    endDate: Date,
    region: string,
    isAdvisorCategoryMultiselect: boolean
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

const toCapitalCase = (s: string) =>
    s
        .toLocaleLowerCase('es')
        .replace(/(^|[\s_\-\/])(\p{L})/gu, (_, sep, ch) => sep + ch.toLocaleUpperCase('es'));

export const AdvisorCategoriesFilterComponent = ({
    advisorCategory,
    setAdvisorCategory,
    startDate,
    endDate,
    region,
    isAdvisorCategoryMultiselect
}: AdvisorCategoriesFilterComponentProps) => {
    const [open, setOpen] = useState(false);
    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const url = `/api/bridge/advisor/all_categories?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`;

    const shouldFetch = !!url && !!region
    const { data, error, isLoading } = useSWR<unknown[]>(shouldFetch ? url : null, fetcher);

    useEffect(() => {
        if (!isLoading && !error && shouldFetch) {
            if (!Array.isArray(data) || data.length === 0) {
                setAdvisorCategory('');
            }
        }
    }, [data, isLoading, error, shouldFetch, setAdvisorCategory]);


    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar datos</div>
    const list: string[] = Array.isArray(data)
        ? data
            .filter((x): x is string => typeof x === 'string')
            .map(toCapitalCase)
            .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
        : [];
    const noCategories = shouldFetch && list.length === 0


    const selectedCategoriesArray = advisorCategory ? advisorCategory.split(',').filter(Boolean) : [];


    const getDisplayText = () => {
        if (noCategories) return 'Sin recomendaciones en la región/criterios seleccionados';
        if (!advisorCategory || (!isAdvisorCategoryMultiselect && advisorCategory === 'all')) return 'Seleccione una o más categorías';
        if (isAdvisorCategoryMultiselect && selectedCategoriesArray.includes('all')) return 'Todas las categorías';
        if (selectedCategoriesArray.length === 1) return selectedCategoriesArray[0];
        return `${selectedCategoriesArray.length} categorías seleccionadas`;
    };

    const handleEventToggle = (categoryValue: string) => {
        let categories = selectedCategoriesArray.slice();
        if (categoryValue === 'all') {
            categories = ['all'];
        } else {
            categories = categories.filter((i) => i !== 'all');
            if (categories.includes(categoryValue)) categories = categories.filter((i) => i !== categoryValue);
            else categories.push(categoryValue);
        }
        setAdvisorCategory(categories.length ? categories.join(',') : '');
    };


    return !isAdvisorCategoryMultiselect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={noCategories || !shouldFetch}
                >
                    <span className="truncate text-left max-w-[85%]">
                        {getDisplayText()}
                    </span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar categoría..' />
                    <CommandList>
                        <CommandEmpty>{noCategories ? 'No hay categoróas disponibles.' : 'No se encontró categoría.'}</CommandEmpty>
                        {!noCategories && shouldFetch && (
                            <CommandGroup className='max-h-[250px] overflow-y-auto'>
                                {list.map((i: string) => (
                                    <CommandItem key={i} value={i} onSelect={() => { setAdvisorCategory(i); setOpen(false); }}>
                                        <Check className={cn('mr-2 h-4 w-4', advisorCategory === i ? 'opacity-100' : 'opacity-0')} />
                                        {i}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    ) : (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={noCategories || !shouldFetch}
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
                    <CommandEmpty>{noCategories ? 'No hay categoróas disponibles.' : 'No se encontró categoría.'}</CommandEmpty>
                    {!noCategories && shouldFetch && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            <CommandItem value='all' onSelect={() => handleEventToggle('all')}>
                                <Check className={cn('mr-2 h-4 w-4', selectedCategoriesArray.includes('all') ? 'opacity-100' : 'opacity-0')} />
                                Todas las categorías
                            </CommandItem>
                            {list.map((i: string) => (
                                <CommandItem key={i} value={i} onSelect={() => handleEventToggle(i)}>
                                    <Check className={cn('mr-2 h-4 w-4', selectedCategoriesArray.includes(i) ? 'opacity-100' : 'opacity-0')} />
                                    {i}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    );
};
