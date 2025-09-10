'use client'
import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { AsgInstancesFilterComponent } from './AsgInstancesFilterComponent'
import { LoaderComponent } from '../LoaderComponent'

interface AsgFilterComponentProps {
    asg: string,
    asgInstance: string,
    setAsg: Dispatch<SetStateAction<string>>,
    setAsgInstance: Dispatch<SetStateAction<string>>,
    startDate: Date,
    endDate: Date,
    region: string,
    selectedKey: string,
    selectedValue: string,
    isAsgMultiSelect: boolean,
    isAsgInstanceMultiselect: boolean,
    isInstancesService?: string,
    isViewResource?: boolean
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

export const AsgFilterComponent = ({
    asg, asgInstance, setAsg, setAsgInstance,
    startDate, endDate, region, selectedKey, selectedValue,
    isAsgMultiSelect, isAsgInstanceMultiselect, isInstancesService, isViewResource
}: AsgFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const url = `${process.env.NEXT_PUBLIC_API_URL}/autoscaling/all-autoscaling-groups?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`;
    const tagsBody = selectedKey !== 'allKeys' && selectedValue ? { Key: selectedKey, Value: selectedValue } : null;

    const shouldFetch = !!region;
    const { data, error, isLoading } = useSWR(shouldFetch ? [url, tagsBody] : null, ([u, t]) => fetcherPost(u, t));

    useEffect(() => {
        // Solo actuar cuando terminó la carga y no hubo error
        if (!isLoading && !error && Array.isArray(data) && data.length === 0) {
            setAsg('');
            setAsgInstance('');
        }
    }, [isLoading, error, data, setAsg, setAsgInstance]);

    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar datos</div>

    const list: string[] = Array.isArray(data) ? data : []
    const noAsg = list.length === 0

    const selectedAsgArray = asg ? asg.split(',').filter(Boolean) : [];

    const getDisplayText = () => {
        if (noAsg) return 'Sin Autoscaling Groups en la región seleccionada';
        if (!asg || (!isAsgMultiSelect && asg === 'all')) return 'Seleccione un Autoscaling Group';
        if (isAsgMultiSelect && selectedAsgArray.includes('all')) return 'Todos los Autoscaling Groups';
        if (selectedAsgArray.length === 1) return selectedAsgArray[0];
        return `${selectedAsgArray.length} autoscaling groups seleccionados`;
    };

    const handleInstanceToggle = (asgValue: string) => {
        let asgs = selectedAsgArray.slice();

        if (asgValue === 'all') {
            asgs = ['all'];
        } else {
            asgs = asgs.filter((i) => i !== 'all');
            if (asgs.includes(asgValue)) asgs = asgs.filter((i) => i !== asgValue);
            else asgs.push(asgValue);
        }
        setAsg(asgs.length ? asgs.join(',') : '');
    };

    return (
        <div className='space-y-2'>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant='outline'
                        role='combobox'
                        aria-expanded={open}
                        className='w-full justify-between bg-transparent'
                        disabled={noAsg || !shouldFetch}
                    >
                        <span className="truncate text-left max-w-[85%]">
                            {getDisplayText()}
                        </span>
                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0'>
                    <Command>
                        <CommandInput placeholder='Buscar autoscaling...' />
                        <CommandList>
                            <CommandEmpty>{noAsg ? 'No hay Autoscaling Groups.' : 'No se encontró autoscaling.'}</CommandEmpty>
                            {!noAsg && (
                                <CommandGroup className='max-h-[200px] overflow-y-auto'>
                                    {isAsgMultiSelect && (
                                        <CommandItem value='all' onSelect={() => handleInstanceToggle('all')}>
                                            <Check className={cn('mr-2 h-4 w-4', selectedAsgArray.includes('all') ? 'opacity-100' : 'opacity-0')} />
                                            Todos los Autoscaling
                                        </CommandItem>
                                    )}
                                    {list.map((autoscaling: string) => (
                                        <CommandItem
                                            key={autoscaling}
                                            value={autoscaling}
                                            onSelect={() => {
                                                if (isAsgMultiSelect) handleInstanceToggle(autoscaling);
                                                else {
                                                    setAsg(autoscaling);
                                                    setOpen(false);
                                                }
                                            }}
                                        >
                                            <Check
                                                className={cn('mr-2 h-4 w-4', isAsgMultiSelect ? (selectedAsgArray.includes(autoscaling) ? 'opacity-100' : 'opacity-0') : (asg === autoscaling ? 'opacity-100' : 'opacity-0'))}
                                            />
                                            {autoscaling}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Instancias de ASG (solo si hay ASG disponible y seleccionado) */}
            {
                isViewResource ? (
                    <></>
                ) : (
                    <AsgInstancesFilterComponent
                        asg={asg}
                        asgInstance={asgInstance}
                        setAsgInstance={setAsgInstance}
                        startDate={startDateFormatted}
                        endDate={endDateFormatted}
                        region={region}
                        isInstanceMultiSelect={isAsgInstanceMultiselect}
                        isInstancesService={isInstancesService}
                    />
                )
            }
        </div>
    )
};
