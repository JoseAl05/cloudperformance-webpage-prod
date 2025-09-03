'use client'
import { Dispatch, SetStateAction, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import useSWR from 'swr'

interface AsgInstancesFilterComponentProps {
    asgName: string,
    instance: string,
    setInstance: Dispatch<SetStateAction<string>>,
    startDate: Date,
    endDate: Date,
    region: string,
    isInstanceMultiSelect: boolean
}

const fetcher = (url: string) =>
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            'Content-Type': 'application/json',
        }
    }).then(res => res.json());

export const AsgInstancesFilterComponent = ({
    asgName,
    instance,
    setInstance,
    startDate,
    endDate,
    region,
    isInstanceMultiSelect
}: AsgInstancesFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const url = `${process.env.NEXT_PUBLIC_API_URL}/autoscaling/all-asg-instances-ec2?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&asgName=${asgName}`;

    const { data, error, isLoading } = useSWR(instance ? url : null, fetcher);

    if (isLoading) return <div>Cargando...</div>
    if (error) return <div>Error al cargar datos</div>

    const selectedInstancesArray = instance ? instance.split(',').filter(Boolean) : [];

    const getDisplayText = () => {
        if (!instance || (!isInstanceMultiSelect && instance === 'all')) {
            return 'Seleccione una instancia';
        }
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

            if (instances.includes(instanceValue)) {
                instances = instances.filter((i) => i !== instanceValue);
            } else {
                instances.push(instanceValue);
            }
        }

        setInstance(instances.length ? instances.join(',') : '');
    };

    return !isInstanceMultiSelect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                >
                    {getDisplayText()}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar instancia...' />
                    <CommandList>
                        <CommandEmpty>No se encontró instancia.</CommandEmpty>
                        <CommandGroup className='max-h-[250px] overflow-y-auto'>
                            {data && data.map((i: string) => (
                                <CommandItem
                                    key={i}
                                    value={i}
                                    onSelect={() => {
                                        setInstance(i);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            instance === i ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />
                                    {i}
                                </CommandItem>
                            ))}
                        </CommandGroup>
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
                    className='w-[250px] justify-between'
                >
                    {getDisplayText()}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[300px] p-0'>
                <Command>
                    <CommandInput placeholder='Buscar instancia...' />
                    <CommandEmpty>No se encontró instancia.</CommandEmpty>
                    <CommandGroup className='max-h-[200px] overflow-y-auto'>
                        <CommandItem
                            value='all'
                            onSelect={() => handleInstanceToggle('all')}
                        >
                            <Check
                                className={cn(
                                    'mr-2 h-4 w-4',
                                    selectedInstancesArray.includes('all') ? 'opacity-100' : 'opacity-0'
                                )}
                            />
                            Todas las Instancias
                        </CommandItem>
                        {data && data.map((i: string) => (
                            <CommandItem
                                key={i}
                                value={i}
                                onSelect={() => handleInstanceToggle(i)}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        selectedInstancesArray.includes(i) ? 'opacity-100' : 'opacity-0'
                                    )}
                                />
                                {i}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
