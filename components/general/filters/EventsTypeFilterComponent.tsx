'use client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '../LoaderComponent'

interface EventsTypeFilterComponentProps {
    eventType: string,
    setEventType: Dispatch<SetStateAction<string>>,
    region: string,
    isEventTypeMultiselect: boolean
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());


export const EventsTypeFilterComponent = ({
    eventType,
    setEventType,
    region,
    isEventTypeMultiselect
}: EventsTypeFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const url = `/api/aws/bridge/eventos/all_events_types?region=${region}`;

    const shouldFetch = !!url && !!region
    const { data, error, isLoading } = useSWR<unknown[]>(shouldFetch ? url : null, fetcher);

    useEffect(() => {
        if (!isLoading && !error && shouldFetch) {
            if (!Array.isArray(data) || data.length === 0) {
                setEventType('');
            }
        }
    }, [data, isLoading, error, shouldFetch, setEventType]);


    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar datos</div>
    const formattedData = Array.isArray(data) ? data.map(item => item === null ? "Other" : item) : [];
    const list: string[] = Array.isArray(formattedData) ? formattedData.sort() : []
    const noEventsTypes = shouldFetch && list.length === 0


    const selectedEventsTypesArray = eventType ? eventType.split(',').filter(Boolean) : [];


    const getDisplayText = () => {
        if (noEventsTypes) return 'Sin eventos en la región/criterios seleccionados';
        if (!eventType || (!isEventTypeMultiselect && eventType === 'all')) return 'Seleccione uno o más eventos';
        if (isEventTypeMultiselect && selectedEventsTypesArray.includes('all')) return 'Todos los Eventos';
        if (selectedEventsTypesArray.length === 1) return selectedEventsTypesArray[0];
        return `${selectedEventsTypesArray.length} eventos seleccionados`;
    };

    const handleEventToggle = (eventsTypeValue: string) => {
        let eventsTypes = selectedEventsTypesArray.slice();
        if (eventsTypeValue === 'all') {
            eventsTypes = ['all'];
        } else {
            eventsTypes = eventsTypes.filter((i) => i !== 'all');
            if (eventsTypes.includes(eventsTypeValue)) eventsTypes = eventsTypes.filter((i) => i !== eventsTypeValue);
            else eventsTypes.push(eventsTypeValue);
        }
        setEventType(eventsTypes.length ? eventsTypes.join(',') : '');
    };


    return !isEventTypeMultiselect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={noEventsTypes || !shouldFetch}
                >
                    <span className="truncate text-left max-w-[85%]">
                        {getDisplayText()}
                    </span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar evento..' />
                    <CommandList>
                        <CommandEmpty>{noEventsTypes ? 'No hay eventos disponibles.' : 'No se encontró evento.'}</CommandEmpty>
                        {!noEventsTypes && shouldFetch && (
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
                    disabled={noEventsTypes || !shouldFetch}
                >
                    <span className="truncate text-left max-w-[85%]">
                        {getDisplayText()}
                    </span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar evento...' />
                    <CommandEmpty>{noEventsTypes ? 'No hay eventos disponibles.' : 'No se encontró evento.'}</CommandEmpty>
                    {!noEventsTypes && shouldFetch && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            <CommandItem value='all' onSelect={() => handleEventToggle('all')}>
                                <Check className={cn('mr-2 h-4 w-4', selectedEventsTypesArray.includes('all') ? 'opacity-100' : 'opacity-0')} />
                                Todos los eventos
                            </CommandItem>
                            {list.map((i: string) => (
                                <CommandItem key={i} value={i} onSelect={() => handleEventToggle(i)}>
                                    <Check className={cn('mr-2 h-4 w-4', selectedEventsTypesArray.includes(i) ? 'opacity-100' : 'opacity-0')} />
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
