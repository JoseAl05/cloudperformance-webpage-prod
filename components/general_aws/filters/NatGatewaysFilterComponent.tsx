'use client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_aws/LoaderComponent'

interface NatGatewaysFilterComponentProps {
    natGateway: string,
    setNatGateway: Dispatch<SetStateAction<string>>,
    startDate: Date,
    endDate: Date,
    region: string,
    selectedKey: string,
    selectedValue: string,
    isNatGatewayMultiselect: boolean
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


export const NatGatewaysFilterComponent = ({
    startDate, endDate, natGateway, setNatGateway, region, selectedKey, selectedValue, isNatGatewayMultiselect
}: NatGatewaysFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const url = region ? `/api/aws/bridge/nat_gateways/all_nat_gateways?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}` : null;

    const tagsBody = selectedKey !== 'allKeys' && selectedValue ? { Key: selectedKey, Value: selectedValue } : null;

    const { data, error, isLoading } = useSWR<unknown[]>([url, tagsBody], ([u, t]) => fetcherPost(u, t));

    useEffect(() => {
        if (!isLoading && !error) {
            if (!Array.isArray(data) || data.length === 0) {
                setNatGateway('');
            }
        }
    }, [data, isLoading, error, setNatGateway]);


    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar datos</div>

    const list: string[] = Array.isArray(data) ? data : []
    const noNatGateways = list.length === 0

    const selectedGatewaysArray = natGateway ? natGateway.split(',').filter(Boolean) : [];


    const getDisplayText = () => {
        if (noNatGateways) return 'Sin nat gateways en la región/criterios seleccionados';
        if (!natGateway || (!isNatGatewayMultiselect && natGateway === 'all')) return 'Seleccione una nat gateway';
        if (isNatGatewayMultiselect && selectedGatewaysArray.includes('all')) return 'Todas las nat gateways';
        if (selectedGatewaysArray.length === 1) return selectedGatewaysArray[0];
        return `${selectedGatewaysArray.length} nat gateways seleccionadas`;
    };

    const handleNatGatewayToggle = (natGwValue: string) => {
        let natGws = selectedGatewaysArray.slice();
        if (natGwValue === 'all') {
            natGws  = ['all'];
        } else {
            natGws  = natGws .filter((i) => i !== 'all');
            if (natGws .includes(natGwValue)) natGws  = natGws .filter((i) => i !== natGwValue);
            else natGws .push(natGwValue);
        }
        setNatGateway(natGws .length ? natGws .join(',') : '');
    };


    return !isNatGatewayMultiselect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={noNatGateways}
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
                        <CommandEmpty>{noNatGateways ? 'No hay nat gateways disponibles.' : 'No se encontró nat gateway.'}</CommandEmpty>
                        {!noNatGateways && (
                            <CommandGroup className='max-h-[250px] overflow-y-auto'>
                                {list.map((i: string) => (
                                    <CommandItem key={i} value={i} onSelect={() => { setNatGateway(i); setOpen(false); }}>
                                        <Check className={cn('mr-2 h-4 w-4', natGateway === i ? 'opacity-100' : 'opacity-0')} />
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
                    disabled={noNatGateways}
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
                    <CommandEmpty>{noNatGateways ? 'No hay nat gateways disponibles.' : 'No se encontró nat gateway.'}</CommandEmpty>
                    {!noNatGateways && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            <CommandItem value='all' onSelect={() => handleNatGatewayToggle('all')}>
                                <Check className={cn('mr-2 h-4 w-4', selectedGatewaysArray.includes('all') ? 'opacity-100' : 'opacity-0')} />
                                Todas las Nat Gateways
                            </CommandItem>
                            {list.map((i: string) => (
                                <CommandItem key={i} value={i} onSelect={() => handleNatGatewayToggle(i)}>
                                    <Check className={cn('mr-2 h-4 w-4', selectedGatewaysArray.includes(i) ? 'opacity-100' : 'opacity-0')} />
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
