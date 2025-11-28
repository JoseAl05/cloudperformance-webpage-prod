'use client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_aws/LoaderComponent'

interface EksAsgInstancesFilterComponentProps {
    eksAsg: string,
    eksAsgInstance: string,
    setEksAsgInstance: Dispatch<SetStateAction<string>>,
    region: string,
    startDate: string,
    endDate: string,
    isInstanceMultiselect: boolean,
    isEksAsgInstanceMultiselect: boolean,
    isInstancesService?: string,
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const EksAsgInstancesFilterComponent = ({
    eksAsg,
    eksAsgInstance,
    setEksAsgInstance,
    startDate,
    endDate,
    region,
    isEksAsgInstanceMultiselect,
    isInstancesService
}: EksAsgInstancesFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const shouldFetch = !!eksAsg && !!region
    let url = '';
    switch (isInstancesService) {
        case 'infraUsed':
            url = shouldFetch ? `/api/aws/bridge/aws/ec2/unused/autoscaling/getInstances?date_from=${startDate}&date_to=${endDate}&region=${region}&autoscaling_group=${encodeURIComponent(eksAsg)}`
            // url = shouldFetch ? `/api/aws/bridge/autoscaling/all-asg-instances-ec2?date_from=${startDate}&date_to=${endDate}&region=${region}&autoscaling_group=${encodeURIComponent(asg)}`
            : null;
            break;
        default:
            url = shouldFetch
                ? `/api/aws/bridge/eks/all-eks-asg-instances-ec2?date_from=${startDate}&date_to=${endDate}&region=${region}&autoscaling_group=${encodeURIComponent(eksAsg)}`
                : null;
            break;
    }
    // const url = shouldFetch
    //     ? `/api/aws/bridge/eks/all-eks-asg-instances-ec2?date_from=${startDate}&date_to=${endDate}&region=${region}&autoscaling_group=${encodeURIComponent(eksAsg)}`
    //     : null

    const { data, error, isLoading } = useSWR<string[]>(url, fetcher);
    useEffect(() => {
        if (!isLoading && !error && shouldFetch) {
            if (!Array.isArray(data) || data.length === 0) {
                setEksAsgInstance('');
            }
        }
    }, [data, isLoading, error, shouldFetch, setEksAsgInstance]);


    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar datos</div>

    const list: string[] = Array.isArray(data) ? data : []
    const noInstances = shouldFetch && list.length === 0

    const selectedArray = eksAsgInstance ? eksAsgInstance.split(',').filter(Boolean) : [];
    const getDisplayText = () => {
        if (noInstances) return 'Sin instancias para el ASG seleccionado';
        if (!eksAsgInstance || (!isEksAsgInstanceMultiselect && eksAsgInstance === 'all')) return 'Seleccione una instancia';
        if (isEksAsgInstanceMultiselect && selectedArray.includes('all')) return 'Todas las Instancias';
        if (selectedArray.length === 1) return selectedArray[0];
        return `${selectedArray.length} instancias seleccionadas`;
    };

    const handleInstanceToggle = (val: string) => {
        const curr = selectedArray.slice();
        if (val === 'all' && eksAsg !== 'all') {
            setEksAsgInstance(list.toString());
            return;
        }
        if (val === 'all') {
            setEksAsgInstance('all');
            return;
        }
        const idx = curr.indexOf(val);
        if (idx >= 0) curr.splice(idx, 1);
        else curr.push(val);
        setEksAsgInstance(curr.length ? curr.join(',') : '');
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
                                    {isEksAsgInstanceMultiselect && (
                                        <CommandItem value='all' onSelect={() => handleInstanceToggle('all')}>
                                            <Check className={cn('mr-2 h-4 w-4', selectedArray.includes('all') ? 'opacity-100' : 'opacity-0')} />
                                            Todas las Instancias
                                        </CommandItem>
                                    )}
                                    {list.map((i) => (
                                        <CommandItem key={i} value={i} onSelect={() => {
                                            if (isEksAsgInstanceMultiselect) handleInstanceToggle(i)
                                            else {
                                                setEksAsgInstance(i)
                                                setOpen(false)
                                            }
                                        }}>
                                            <Check className={cn('mr-2 h-4 w-4', isEksAsgInstanceMultiselect ? (selectedArray.includes(i) ? 'opacity-100' : 'opacity-0') : (eksAsgInstance === i ? 'opacity-100' : 'opacity-0'))} />
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
