'use client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '../LoaderComponent'

interface InstancesFilterComponentProps {
    service: string,
    instance: string,
    setInstance: Dispatch<SetStateAction<string>>,
    startDate: Date,
    endDate: Date,
    region: string,
    selectedKey: string,
    selectedValue: string,
    isInstanceMultiSelect: boolean
}

const fetcherPost = (url: string, tags: { Key: string; Value: string } | null = null) =>
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: tags ? JSON.stringify([tags]) : null,
    }).then(res => res.json());

export const InstancesFilterComponent = ({
    service, instance, setInstance, startDate, endDate, region, selectedKey, selectedValue, isInstanceMultiSelect
}: InstancesFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    let url = ''
    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    switch (service) {
        case 'ec2':
            url = `${process.env.NEXT_PUBLIC_API_URL}/vm/all-instances-ec2?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`;
            break;
        case 'rds-pg':
            url = `${process.env.NEXT_PUBLIC_API_URL}/db/all-instances-rds-pg?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`;
            break;
        case 'asg':
            url = `${process.env.NEXT_PUBLIC_API_URL}/autoscaling/all-autoscaling-groups?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`;
            break;
        default:
            url = '';
    }

    const tagsBody = selectedKey !== 'allKeys' && selectedValue ? { Key: selectedKey, Value: selectedValue } : null;

    const shouldFetch = !!url && !!region // dejar pasar 'all_regions'
    const { data, error, isLoading } = useSWR<unknown[]>(shouldFetch ? [url, tagsBody] : null, ([u, t]) => fetcherPost(u, t));

    // normalizar si queda sin data
    useEffect(() => {
        if (!isLoading && !error && shouldFetch) {
            if (!Array.isArray(data) || data.length === 0) {
                setInstance(''); // evita fetch aguas abajo
            }
        }
    }, [data, isLoading, error, shouldFetch, setInstance]);


    if (isLoading) return <LoaderComponent />
    if (error) return <div>Error al cargar datos</div>

    const list: string[] = Array.isArray(data) ? data : []
    const noInstances = shouldFetch && list.length === 0

    const selectedInstancesArray = instance ? instance.split(',').filter(Boolean) : [];


    const getDisplayText = () => {
        if (noInstances) return 'Sin instancias en la región/criterios seleccionados';
        if (!instance || (!isInstanceMultiSelect && instance === 'all')) return 'Seleccione una instancia';
        if (isInstanceMultiSelect && selectedInstancesArray.includes('all')) return 'Todas las Instancias';
        if (selectedInstancesArray.length === 1) return selectedInstancesArray[0];
        return `${selectedInstancesArray.length} instancias seleccionadas`;
    };

    const handleInstanceToggle = (instanceValue: string) => {
        let instances = selectedInstancesArray.slice();
        if (instanceValue === 'all') {
            instances = ['all'];
        } else {
            instances = instances.filter((i) => i !== 'all');
            if (instances.includes(instanceValue)) instances = instances.filter((i) => i !== instanceValue);
            else instances.push(instanceValue);
        }
        setInstance(instances.length ? instances.join(',') : '');
    };


    return !isInstanceMultiSelect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between bg-transparent' disabled={noInstances || !shouldFetch}>
                    {getDisplayText()}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar instancia...' />
                    <CommandList>
                        <CommandEmpty>{noInstances ? 'No hay instancias disponibles.' : 'No se encontró instancia.'}</CommandEmpty>
                        {!noInstances && shouldFetch && (
                            <CommandGroup className='max-h-[250px] overflow-y-auto'>
                                {list.map((i: string) => (
                                    <CommandItem key={i} value={i} onSelect={() => { setInstance(i); setOpen(false); }}>
                                        <Check className={cn('mr-2 h-4 w-4', instance === i ? 'opacity-100' : 'opacity-0')} />
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
                <Button variant='outline' role='combobox' aria-expanded={open} className='w-[250px] justify-between' disabled={noInstances || !shouldFetch}>
                    {getDisplayText()}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[300px] p-0'>
                <Command>
                    <CommandInput placeholder='Buscar instancia...' />
                    <CommandEmpty>{noInstances ? 'No hay instancias disponibles.' : 'No se encontró instancia.'}</CommandEmpty>
                    {!noInstances && shouldFetch && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            <CommandItem value='all' onSelect={() => handleInstanceToggle('all')}>
                                <Check className={cn('mr-2 h-4 w-4', selectedInstancesArray.includes('all') ? 'opacity-100' : 'opacity-0')} />
                                Todas las Instancias
                            </CommandItem>
                            {list.map((i: string) => (
                                <CommandItem key={i} value={i} onSelect={() => handleInstanceToggle(i)}>
                                    <Check className={cn('mr-2 h-4 w-4', selectedInstancesArray.includes(i) ? 'opacity-100' : 'opacity-0')} />
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
