'use client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_aws/LoaderComponent'

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
            'Content-Type': 'application/json'
        },
        body: tags ? JSON.stringify([tags]) : null,
    }).then(res => res.json());

const fetcherGet = (url: string, _tags: { Key: string; Value: string } | null = null) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());


export const InstancesFilterComponent = ({
    service, instance, setInstance, startDate, endDate, region, selectedKey, selectedValue, isInstanceMultiSelect
}: InstancesFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    console.log(selectedKey, selectedValue)

    let url = ''
    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const tagQueryParams = selectedKey !== 'allKeys' && selectedValue && selectedValue !== 'allValues' 
        ? `&tagKey=${encodeURIComponent(selectedKey)}&tagValue=${encodeURIComponent(selectedValue)}` 
        : '';

    switch (service) {
        case 'ec2':
            url = (selectedKey && selectedValue) ? `/api/aws/bridge/vm/all-instances-ec2?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}${tagQueryParams}` : null;
            break;
        case 'unused-ec2':
            url = (selectedKey && selectedValue) ? `/api/aws/bridge/unused/ec2/all_unused_ec2_instances?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}` : null;
            break;
        case 'eks':
            url = (selectedKey && selectedValue) ? `/api/aws/bridge/eks/all-eks-clusters?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}` : null;
            break;
        case 'ebs':
            url = (selectedKey && selectedValue) ? `/api/aws/bridge/unused/ebs/all_unused_ebs?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}` : null;
            break;
        case 'rds-pg':
            url = (selectedKey && selectedValue) ? `/api/aws/bridge/db/all-instances-rds-pg?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}${tagQueryParams}` : null;
            break;
        case 'rds-mysql':
            url = (selectedKey && selectedValue) ? `/api/aws/bridge/db/all-instances-rds-mysql?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}${tagQueryParams}` : null;
            break;
        case 'rds-oracle':
            url = (selectedKey && selectedValue) ? `/api/aws/bridge/db/all-instances-rds-oracle?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}${tagQueryParams}` : null;
            break;
        case 'rds-sqlserver':
            url = (selectedKey && selectedValue) ? `/api/aws/bridge/db/all-instances-rds-sqlserver?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}${tagQueryParams}` : null;
            break;
        case 'rds-mariadb':
            url = (selectedKey && selectedValue) ? `/api/aws/bridge/db/all-instances-rds-mariadb?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}${tagQueryParams}` : null;
            break;
        case 'asg':
            url = (selectedKey && selectedValue) ? `/api/aws/bridge/autoscaling/all-autoscaling-groups?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}` : null;
            break;
        case 'nat_gateway':
            url = (selectedKey && selectedValue) ? `/api/aws/bridge/nat_gateways/all_nat_gateways?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}` : null;
            break;
        case "infraUsed":
            url = region ? `/api/aws/bridge/ec2/all_unused_ec2_instances?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}` : null;
            break;
        default:
            url = '';
    }

    //const tagsBody = selectedKey !== 'allKeys' && selectedValue && selectedValue !== 'allValues' ? { Key: selectedKey, Value: selectedValue } : null;
    const hasTag = selectedKey && selectedKey !== 'allKeys';
    
    const tagsBody = hasTag ? { Key: selectedKey, Value: selectedValue || 'allValues' } : null;
    
    const apiMethod = service === "infraUsed" ? fetcherGet : fetcherPost;
    const { data, error, isLoading } = useSWR<(string | { resource_id: string; resource_name: string; cpu_avg: number })[]>(
        url ? [url, tagsBody] : null,
        ([u, t]) => fetcherPost(u, t)
    );

    useEffect(() => {
        if (!isLoading && !error) {
            if (!Array.isArray(data) || data.length === 0) {
                setInstance('');
            }
        }
    }, [data, isLoading, error, setInstance]);


    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar datos</div>

    const list: string[] = Array.isArray(data)
        ? data.map((item) =>
            typeof item === 'string' ? item : item.resource_id
        )
        : [];
    const noInstances = list.length === 0

    const selectedInstancesArray = instance ? instance.split(',').filter(Boolean) : [];


    const getDisplayText = () => {
        if (noInstances) return 'Sin instancias en la región/criterios seleccionados';
        if (!instance) return 'Seleccione una instancia';
        if (!isInstanceMultiSelect && instance === 'all') return 'Seleccione una instancia';
        const allSelected = list.length > 0 && list.every((i) => selectedInstancesArray.includes(i));
        if (isInstanceMultiSelect && allSelected) return 'Todas las Instancias';
        if (selectedInstancesArray.length === 1) return selectedInstancesArray[0];
        return `${selectedInstancesArray.length} instancias seleccionadas`;
    };

    const handleInstanceToggle = (instanceValue: string) => {
        let instances = selectedInstancesArray.slice();
        if (instanceValue === 'all') {
            const allSelected = list.every((i) => selectedInstancesArray.includes(i));
            instances = allSelected ? [] : [...list];
        } else {
            if (instances.includes(instanceValue)) instances = instances.filter((i) => i !== instanceValue);
            else instances.push(instanceValue);
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
                    disabled={noInstances}
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
                        {!noInstances && (
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
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={noInstances}
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
                    <CommandEmpty>{noInstances ? 'No hay instancias disponibles.' : 'No se encontró instancia.'}</CommandEmpty>
                    {!noInstances && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            <CommandItem value='all' onSelect={() => handleInstanceToggle('all')}>
                                <Check className={cn('mr-2 h-4 w-4', list.every((i) => selectedInstancesArray.includes(i)) ? 'opacity-100' : 'opacity-0')} />
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
