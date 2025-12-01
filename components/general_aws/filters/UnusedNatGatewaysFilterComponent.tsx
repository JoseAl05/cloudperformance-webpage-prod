'use client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_aws/LoaderComponent'

interface UnusedNatGatewaysFilterComponentProps {
    unusedNatGateway: string,
    setUnusedNatGateway: Dispatch<SetStateAction<string>>,
    startDate: Date,
    endDate: Date,
    region: string,
    selectedKey: string,
    selectedValue: string,
    isUnusedNatGatewayMultiselect: boolean
}

const fetcherPost = (url: string, tags: { Key: string; Value: string } | null = null) =>
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: tags ? JSON.stringify([tags]) : null,
    }).then(res => res.json());

const fetcherGet = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());


export const UnusedNatGatewaysFilterComponent = ({
    startDate, endDate, unusedNatGateway, setUnusedNatGateway, region, selectedKey, selectedValue, isUnusedNatGatewayMultiselect
}: UnusedNatGatewaysFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const url = region ? `/api/aws/bridge/nat_gateways/all_unused_nat_gateways?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}` : null;

    const tagsBody = selectedKey !== 'allKeys' && selectedValue ? { Key: selectedKey, Value: selectedValue } : null;

    const { data, error, isLoading } = useSWR<unknown[]>([url, tagsBody], ([u, t]) => fetcherPost(u, t));

    useEffect(() => {
        if (!isLoading && !error) {
            if (!Array.isArray(data) || data.length === 0) {
                setUnusedNatGateway('');
            }
        }
    }, [data, isLoading, error, setUnusedNatGateway]);


    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar datos</div>

    const list: string[] = Array.isArray(data) ? data : []
    const noUnusedNatGateways = list.length === 0

    const selectedUnusedGatewaysArray = unusedNatGateway ? unusedNatGateway.split(',').filter(Boolean) : [];


    const getDisplayText = () => {
        if (noUnusedNatGateways) return 'Sin nat gateways en la región/criterios seleccionados';
        if (!unusedNatGateway || (!isUnusedNatGatewayMultiselect && unusedNatGateway === 'all')) return 'Seleccione una nat gateway';
        if (isUnusedNatGatewayMultiselect && selectedUnusedGatewaysArray.includes('all')) return 'Todas las nat gateways';
        if (selectedUnusedGatewaysArray.length === 1) return selectedUnusedGatewaysArray[0];
        return `${selectedUnusedGatewaysArray.length} nat gateways seleccionadas`;
    };

    const handleUnusedNatGatewayToggle = (unusedNatGwValue: string) => {
        let unusedNatGws = selectedUnusedGatewaysArray.slice();
        if (unusedNatGwValue === 'all') {
            unusedNatGws = ['all'];
        } else {
            unusedNatGws = unusedNatGws.filter((i) => i !== 'all');
            if (unusedNatGws.includes(unusedNatGwValue)) unusedNatGws = unusedNatGws.filter((i) => i !== unusedNatGwValue);
            else unusedNatGws.push(unusedNatGwValue);
        }
        setUnusedNatGateway(unusedNatGws.length ? unusedNatGws.join(',') : '');
    };


    return !isUnusedNatGatewayMultiselect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={noUnusedNatGateways}
                >
                    <span className="truncate text-left max-w-[85%]">
                        {getDisplayText()}
                    </span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar nat gateway...' />
                    <CommandList>
                        <CommandEmpty>{noUnusedNatGateways ? 'No hay nat gateways disponibles.' : 'No se encontró nat gateway.'}</CommandEmpty>
                        {!noUnusedNatGateways && (
                            <CommandGroup className='max-h-[250px] overflow-y-auto'>
                                {list.map((i: string) => (
                                    <CommandItem key={i} value={i} onSelect={() => { setUnusedNatGateway(i); setOpen(false); }}>
                                        <Check className={cn('mr-2 h-4 w-4', unusedNatGateway === i ? 'opacity-100' : 'opacity-0')} />
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
                    disabled={noUnusedNatGateways}
                >
                    <span className="truncate text-left max-w-[85%]">
                        {getDisplayText()}
                    </span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar nat gateway...' />
                    <CommandEmpty>{noUnusedNatGateways ? 'No hay nat gateways disponibles.' : 'No se encontró nat gateway.'}</CommandEmpty>
                    {!noUnusedNatGateways && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            <CommandItem value='all' onSelect={() => handleUnusedNatGatewayToggle('all')}>
                                <Check className={cn('mr-2 h-4 w-4', selectedUnusedGatewaysArray.includes('all') ? 'opacity-100' : 'opacity-0')} />
                                Todas las Nat Gateways
                            </CommandItem>
                            {list.map((i: string) => (
                                <CommandItem key={i} value={i} onSelect={() => handleUnusedNatGatewayToggle(i)}>
                                    <Check className={cn('mr-2 h-4 w-4', selectedUnusedGatewaysArray.includes(i) ? 'opacity-100' : 'opacity-0')} />
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
