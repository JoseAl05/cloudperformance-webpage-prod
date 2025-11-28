'use client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_aws/LoaderComponent'

interface EbsFilterComponentProps {
    ebs: string,
    setEbs: Dispatch<SetStateAction<string>>,
    startDate: Date,
    endDate: Date,
    region: string,
    isEbsMultiselect: boolean
}


const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());


export const EbsFilterComponent = ({
    ebs,
    setEbs,
    startDate,
    endDate,
    region,
    isEbsMultiselect
}: EbsFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const url = `/api/aws/bridge/ebs/all_unused_ebs?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`;

    const shouldFetch = !!url && !!region
    const { data, error, isLoading } = useSWR<unknown[]>(shouldFetch ? url: null,fetcher);

    useEffect(() => {
        if (!isLoading && !error && shouldFetch) {
            if (!Array.isArray(data) || data.length === 0) {
                setEbs('');
            }
        }
    }, [data, isLoading, error, shouldFetch, setEbs]);


    if (isLoading) return <LoaderComponent size='small'/>
    if (error) return <div>Error al cargar datos</div>

    const list: string[] = Array.isArray(data) ? data : []
    const noEbs = shouldFetch && list.length === 0

    const selectedEbsArray = ebs ? ebs.split(',').filter(Boolean) : [];


    const getDisplayText = () => {
        if (noEbs) return 'Sin volumenes en la región/criterios seleccionados';
        if (!ebs || (!isEbsMultiselect && ebs === 'all')) return 'Seleccione uno o más volúmenes';
        if (isEbsMultiselect && selectedEbsArray.includes('all')) return 'Todos los Volúmenes';
        if (selectedEbsArray.length === 1) return selectedEbsArray[0];
        return `${selectedEbsArray.length} volúmenes seleccionados`;
    };

    const handleEbsToggle = (ebsValue: string) => {
        let ebs = selectedEbsArray.slice();
        if (ebsValue === 'all') {
            ebs = ['all'];
        } else {
            ebs = ebs.filter((i) => i !== 'all');
            if (ebs.includes(ebsValue)) ebs = ebs.filter((i) => i !== ebsValue);
            else ebs.push(ebsValue);
        }
        setEbs(ebs.length ? ebs.join(',') : '');
    };


    return !isEbsMultiselect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={noEbs || !shouldFetch}
                >
                    <span className="truncate text-left max-w-[85%]">
                        {getDisplayText()}
                    </span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar volúmen ebs..' />
                    <CommandList>
                        <CommandEmpty>{noEbs ? 'No hay volumenes ebs disponibles.' : 'No se encontró volúmen ebs.'}</CommandEmpty>
                        {!noEbs && shouldFetch && (
                            <CommandGroup className='max-h-[250px] overflow-y-auto'>
                                {list.map((i: string) => (
                                    <CommandItem key={i} value={i} onSelect={() => { setEbs(i); setOpen(false); }}>
                                        <Check className={cn('mr-2 h-4 w-4', ebs === i ? 'opacity-100' : 'opacity-0')} />
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
                    disabled={noEbs || !shouldFetch}
                >
                    <span className="truncate text-left max-w-[85%]">
                        {getDisplayText()}
                    </span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar volúmen ebs...' />
                    <CommandEmpty>{noEbs ? 'No hay volúmenes ebs disponibles.' : 'No se encontró volúmen ebs.'}</CommandEmpty>
                    {!noEbs && shouldFetch && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            <CommandItem value='all' onSelect={() => handleEbsToggle('all')}>
                                <Check className={cn('mr-2 h-4 w-4', selectedEbsArray.includes('all') ? 'opacity-100' : 'opacity-0')} />
                                Todos los volúmenes
                            </CommandItem>
                            {list.map((i: string) => (
                                <CommandItem key={i} value={i} onSelect={() => handleEbsToggle(i)}>
                                    <Check className={cn('mr-2 h-4 w-4', selectedEbsArray.includes(i) ? 'opacity-100' : 'opacity-0')} />
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
