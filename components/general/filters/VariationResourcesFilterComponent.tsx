'use client'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general/LoaderComponent'


interface VariationResourcesFilterComponentProps {
    region: string,
    startDate: string,
    endDate: string,
    service: string,
    metric: string
    resource: string,
    setResource: Dispatch<SetStateAction<string>>,
    isResourceMultiSelect: boolean,
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

const fetcherGet = (url: string) =>
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
    }).then(res => res.json());

export const VariationResourcesFilterComponent = ({
    startDate, endDate, region, service, metric, resource, setResource, isResourceMultiSelect
}: VariationResourcesFilterComponentProps) => {
    const [open, setOpen] = useState(false);
    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate
        ? endDate.toISOString().replace('Z', '').slice(0, -4)
        : '';

    const shouldFetch = !!service && !!region && !!metric
    let url = '';
    let fetcher: ((url: string) => Promise<unknown>) | null = null;
    switch (service) {
        case 'InstanciasEc2':
            // /api/vm/all-instances-ec2
            fetcher = fetcherPost
            url = shouldFetch ? `/api/aws/bridge/vm/all-instances-ec2?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`
                : null;
            break;
        case 'InstanciasRdsMysql':
            fetcher = fetcherPost
            url = shouldFetch ? `/api/aws/bridge/db/all-instances-rds-mysql?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`
                : null;
            break;
        case 'InstanciasRdsPostgresql':
            fetcher = fetcherPost
            url = shouldFetch ? `/api/aws/bridge/db/all-instances-rds-pg?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`
                : null;
            break;
        case 'InstanciasRdsSqlServer':
            fetcher = fetcherPost
            url = shouldFetch ? `/api/aws/bridge/db/all-instances-rds-sqlserver?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`
                : null;
            break;
        case 'InstanciasRdsMariadb':
            fetcher = fetcherPost
            url = shouldFetch ? `/api/aws/bridge/db/all-instances-rds-mariadb?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`
                : null;
            break;
        case 'InstanciasRdsOracle':
            fetcher = fetcherPost
            url = shouldFetch ? `/api/aws/bridge/db/all-instances-rds-oracle?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`
                : null;
            break;
        case 'AutoscalingGroup':
            fetcher = fetcherGet
            url = shouldFetch ? `/api/aws/bridge/aws/ec2/autoscaling/groups?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`
                : null;
            break;
        case 'DynamoDB':
            fetcher = fetcherPost
            url = shouldFetch ? `sin endpoint`
                : null;
            break;
        case 'S3Buckets':
            fetcher = fetcherGet
            // url = shouldFetch ? `balblalbal`
            url = shouldFetch ? `/api/aws/bridge/s3/s3_buckets/list?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`
                : null;
            break;
        case 'SqsQueue':
            fetcher = fetcherPost
            url = shouldFetch ? `sin endpoint`
                : null;
            break;
        case 'VolumesEbs':
            fetcher = fetcherGet
            url = shouldFetch ? `/api/aws/bridge/ebs/all_ebs?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`
                : null;
            break;
        // default:
        //     fetcher = fetcherPost
        //     url = shouldFetch ? `no result` 
        //     : null;
        //     break;
    }

    const { data, error, isLoading } = useSWR<string[]>(url, fetcher);

    useEffect(() => {
        if (!isLoading && !error && shouldFetch) {
            if (!Array.isArray(data) || data.length === 0) {
                setResource('');
            }
        }
    }, [data, isLoading, error, shouldFetch, setResource]);


    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar datos</div>

    const list: string[] = Array.isArray(data) ? data : []
    const noResource = shouldFetch && list.length === 0

    const selectedArray = resource ? resource.split(',').filter(Boolean) : [];
    const getDisplayText = () => {
        if (noResource) return 'Sin recursos para el servicio seleccionado';
        if (!resource || (!isResourceMultiSelect && resource === 'all')) return 'Seleccione un recurso';
        if (isResourceMultiSelect && selectedArray.includes('all')) return 'Todos los recursos';
        if (selectedArray.length === 1) return selectedArray[0];
        return `${selectedArray.length} recursos seleccionados`;
    };

    const handleInstanceToggle = (val: string) => {
        const curr = selectedArray.slice();
        if (val === 'all' && resource !== 'all') {
            setResource(list.toString());
            return;
        }
        if (val === 'all') {
            setResource('all');
            return;
        }
        if (val !== 'all' && resource === 'all') {
            if (curr.includes('all')) {
                const idx = curr.indexOf('all');
                curr.splice(idx, 1);
            }
        }
        const idx = curr.indexOf(val);
        if (idx >= 0) curr.splice(idx, 1);
        else curr.push(val);
        setResource(curr.length ? curr.join(',') : '');
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
                        disabled={noResource || !shouldFetch}
                    >
                        <span className="truncate text-left max-w-[85%]">
                            {getDisplayText()}
                        </span>
                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0'>
                    <Command>
                        <CommandInput placeholder='Buscar recurso...' />
                        <CommandList>
                            <CommandEmpty>{noResource ? 'No hay recursos disponibles.' : 'No se encontró recursos.'}</CommandEmpty>
                            {!noResource && shouldFetch && (
                                <CommandGroup className='max-h-[200px] overflow-y-auto'>
                                    {isResourceMultiSelect && (
                                        <CommandItem value='all' onSelect={() => handleInstanceToggle('all')}>
                                            <Check className={cn('mr-2 h-4 w-4', selectedArray.includes('all') ? 'opacity-100' : 'opacity-0')} />
                                            Todos los recursos
                                        </CommandItem>
                                    )}
                                    {list.map((i) => (
                                        <CommandItem key={i} value={i} onSelect={() => {
                                            if (isResourceMultiSelect) handleInstanceToggle(i)
                                            else {
                                                setResource(i)
                                                setOpen(false)
                                            }
                                        }}>
                                            <Check className={cn('mr-2 h-4 w-4', isResourceMultiSelect ? (selectedArray.includes(i) ? 'opacity-100' : 'opacity-0') : (resource === i ? 'opacity-100' : 'opacity-0'))} />
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
