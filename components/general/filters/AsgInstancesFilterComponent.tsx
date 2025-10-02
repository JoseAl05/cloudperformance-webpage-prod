'use client'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '../LoaderComponent'

interface AsgInstancesFilterComponentProps {
    asg: string,
    asgInstance: string,
    setAsgInstance: Dispatch<SetStateAction<string>>,
    region: string,
    startDate: string,
    endDate: string,
    isInstanceMultiSelect: boolean,
    isInstancesService?: string
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const AsgInstancesFilterComponent = ({
    asg, asgInstance, setAsgInstance, startDate, endDate, region, isInstanceMultiSelect, isInstancesService
}: AsgInstancesFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const shouldFetch = !!asg && !!region
    let url = '';
    switch (isInstancesService) {
        case 'infraUsed':
            // /api/aws/ec2/unused/autoscaling/getInstances?date_from=2025-08-01T00:00:00&date_to=2025-09-02T23:59:59&autoscaling_group=AutoscalingWeb,awseb-e-2heftjv3ym-stack-AWSEBAutoScalingGroup-132MCA73CRXKS
            url = shouldFetch ? `/api/aws/bridge/aws/ec2/unused/autoscaling/getInstances?date_from=${startDate}&date_to=${endDate}&region=${region}&autoscaling_group=${encodeURIComponent(asg)}` : null;
            break;
        default:
            url = shouldFetch
                ? `/api/aws/bridge/autoscaling/all-asg-instances-ec2?date_from=${startDate}&date_to=${endDate}&region=${region}&autoscaling_group=${encodeURIComponent(asg)}`
                : null;
            break;
    }
    // const url = shouldFetch
    //     ? `/api/aws/bridge/autoscaling/all-asg-instances-ec2?date_from=${startDate}&date_to=${endDate}&region=${region}&autoscaling_group=${encodeURIComponent(asg)}`
    //     : null

    const { data, error, isLoading } = useSWR<string[]>(url, fetcher);

    useEffect(() => {
        if (!isLoading && !error && shouldFetch) {
            if (!Array.isArray(data) || data.length === 0) {
                setAsgInstance('');
            }
        }
    }, [data, isLoading, error, shouldFetch, setAsgInstance]);


    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar datos</div>

    const list: string[] = Array.isArray(data) ? data : []
    const noInstances = shouldFetch && list.length === 0

    const selectedArray = asgInstance ? asgInstance.split(',').filter(Boolean) : [];
    const getDisplayText = () => {
        if (noInstances) return 'Sin instancias para el ASG seleccionado';
        if (!asgInstance || (!isInstanceMultiSelect && asgInstance === 'all')) return 'Seleccione una instancia';
        if (isInstanceMultiSelect && selectedArray.includes('all')) return 'Todas las Instancias';
        if (selectedArray.length === 1) return selectedArray[0];
        return `${selectedArray.length} instancias seleccionadas`;
    };

    const handleInstanceToggle = (val: string) => {
        const curr = selectedArray.slice();
        if (val === 'all' && asg !== 'all') {
            console.log(list.toString());
            setAsgInstance(list.toString());
            return;
        }
        if (val === 'all') {
            setAsgInstance('all');
            return;
        }
        if (val !== 'all' && asg === 'all'){
            if(curr.includes('all')){
                const idx = curr.indexOf('all');
                curr.splice(idx, 1);
            }
        }
        const idx = curr.indexOf(val);
        if (idx >= 0) curr.splice(idx, 1);
        else curr.push(val);
        setAsgInstance(curr.length ? curr.join(',') : '');
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
                        disabled={noInstances || !shouldFetch}
                    >
                        <span className="truncate text-left max-w-[85%]">
                            {getDisplayText()}
                        </span>
                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0'>
                    <Command>
                        <CommandInput placeholder='Buscar instancia...' />
                        <CommandList>
                            <CommandEmpty>{noInstances ? 'No hay instancias disponibles.' : 'No se encontró instancia.'}</CommandEmpty>
                            {!noInstances && shouldFetch && (
                                <CommandGroup className='max-h-[200px] overflow-y-auto'>
                                    {isInstanceMultiSelect && (
                                        <CommandItem value='all' onSelect={() => handleInstanceToggle('all')}>
                                            <Check className={cn('mr-2 h-4 w-4', selectedArray.includes('all') ? 'opacity-100' : 'opacity-0')} />
                                            Todas las Instancias
                                        </CommandItem>
                                    )}
                                    {list.map((i) => (
                                        <CommandItem key={i} value={i} onSelect={() => {
                                            if (isInstanceMultiSelect) handleInstanceToggle(i)
                                            else {
                                                setAsgInstance(i)
                                                setOpen(false)
                                            }
                                        }}>
                                            <Check className={cn('mr-2 h-4 w-4', isInstanceMultiSelect ? (selectedArray.includes(i) ? 'opacity-100' : 'opacity-0') : (asgInstance === i ? 'opacity-100' : 'opacity-0'))} />
                                            {i}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
};
