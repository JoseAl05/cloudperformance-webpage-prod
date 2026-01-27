'use client'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_aws/LoaderComponent'

interface ResourcesFilterComponentProps {
    service: string,
    resourceId: string,
    setResourceId: Dispatch<SetStateAction<string>>,
    startDate: Date,
    endDate: Date,
    projects: string,
    regions: string;
    isResourceMultiSelect: boolean
}

interface ResourceItem {
    resource_id: string;
    resource_name: string;
}

const fetcherGet = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const ResourcesFilterComponent = ({
    service, resourceId, setResourceId, startDate, endDate, projects, regions, isResourceMultiSelect
}: ResourcesFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    let url = ''
    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    switch (service) {
        case 'disks':
            url = regions ? `/api/gcp/bridge/gcp/recursos_sin_uso/all_persistent_disks?date_from=${startDateFormatted}&date_to=${endDateFormatted}&project_id=${projects}&location=${regions}` : '';
            break;
        case 'instances_unused':
            url = regions ? `/api/gcp/bridge/gcp/recursos-sin-uso/compute-engine-sin-uso?projects=${projects}&regions=${regions}&simple_list=true` : '';
            break;
        case 'instances':
            url = regions ? `/api/gcp/bridge/gcp/instancias_compute_engine/all_compute_engine_instances?date_from=${startDateFormatted}&date_to=${endDateFormatted}&project_id=${projects}&location=${regions}` : '';
            break;
        case 'instance_groups':
            url = regions ? `/api/gcp/bridge/gcp/instance_groups/all_instance_groups?date_from=${startDateFormatted}&date_to=${endDateFormatted}&project_id=${projects}&location=${regions}` : '';
            break;
        case 'clusters-gke':
            url = regions ? `/api/gcp/bridge/gcp/gke_clusters/all_gke_clusters?date_from=${startDateFormatted}&date_to=${endDateFormatted}&project_id=${projects}&location=${regions}` : '';
            break;
        case 'postgres':
            url = regions ? `/api/gcp/bridge/gcp/instancias_cloud_sql/all_cloudsql_instances?date_from=${startDateFormatted}&date_to=${endDateFormatted}&project_id=${projects}&location=${regions}&db_engine=postgres` : '';
            break;
        case 'mysql':
            url = regions ? `/api/gcp/bridge/gcp/instancias_cloud_sql/all_cloudsql_instances?date_from=${startDateFormatted}&date_to=${endDateFormatted}&project_id=${projects}&location=${regions}&db_engine=mysql` : '';
            break;
        case 'sqlserver':
            url = regions ? `/api/gcp/bridge/gcp/instancias_cloud_sql/all_cloudsql_instances?date_from=${startDateFormatted}&date_to=${endDateFormatted}&project_id=${projects}&location=${regions}&db_engine=sqlserver` : '';
            break
        default:
            url = '';
    }

    const { data, error, isLoading } = useSWR(
        regions ? url : null,
        fetcherGet,
        { revalidateOnFocus: false, shouldRetryOnError: false }
    );

    const allResources = useMemo(() => {
        if (!Array.isArray(data)) return [] as ResourceItem[]
        if (data.length === 0) return []
        if (typeof data[0] === 'string') {
            return (data as string[]).map((resource_id) => ({ resource_id, resource_name: resource_id }))
        }
        return (data as ResourceItem[]).map((r) => ({
            resource_id: r.resource_id,
            resource_name: r.resource_name || r.resource_id,
        }))
    }, [data])

    const hasData = allResources.length > 0;

    useEffect(() => {
        if (isLoading || !data) return

        if (!hasData) {
            if (resourceId) setResourceId('')
            return
        }

        if (hasData && !resourceId) {
            setResourceId('all')
        }
    }, [data, isLoading, hasData, resourceId, setResourceId]);

    const selectedIds = useMemo(
        () => (resourceId ? resourceId.split(',').filter(Boolean) : []),
        [resourceId]
    )

    const idToName = useMemo(() => {
        const map = new Map<string, string>()
        for (const r of allResources) map.set(r.resource_id, r.resource_name)
        return map
    }, [allResources])

    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar recursos</div>

    const getDisplayText = () => {
        if (!hasData) return 'Sin recursos disponibles'
        if (selectedIds.includes('all')) return 'Todos los Recursos'
        if (!resourceId && hasData) return 'Selecciona un recurso...'
        if (selectedIds.length === 1) return idToName.get(selectedIds[0]) ?? idToName.get(selectedIds[0])
        return `${selectedIds.length} recursos seleccionados`
    }

    const handleResourceToggle = (resourceValue: string) => {
        let selectedResources = [...selectedIds]
        if (resourceValue === 'all') {
            selectedResources = ['all']
        } else {
            selectedResources = selectedResources.filter((s) => s !== 'all')
            if (selectedResources.includes(resourceValue)) {
                selectedResources = selectedResources.filter((s) => s !== resourceValue)
            } else {
                selectedResources.push(resourceValue)
            }
        }
        setResourceId(selectedResources.length ? selectedResources.join(',') : '')
    };

    return !isResourceMultiSelect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={!hasData}
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
                        <CommandEmpty>{!hasData ? 'No hay recursos disponibles.' : 'No se encontró recurso.'}</CommandEmpty>
                        {hasData && (
                            <CommandGroup className='max-h-[250px] overflow-y-auto'>
                                {allResources.map((i) => (
                                    <CommandItem
                                        key={i.resource_id}
                                        value={i.resource_id}
                                        onSelect={() => {
                                            setResourceId(i.resource_id);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', resourceId === i.resource_id ? 'opacity-100' : 'opacity-0')} />
                                        {i.resource_name}
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
                    disabled={!hasData}
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
                        <CommandEmpty>{!hasData ? 'No hay recursos disponibles.' : 'No se encontró recurso.'}</CommandEmpty>
                        {hasData && (
                            <CommandGroup className='max-h-[200px] overflow-y-auto'>
                                <CommandItem value='all' onSelect={() => handleResourceToggle('all')}>
                                    <Check className={cn('mr-2 h-4 w-4', selectedIds.includes('all') ? 'opacity-100' : 'opacity-0')} />
                                    Todos los Recursos
                                </CommandItem>
                                {allResources.map((i) => (
                                    <CommandItem
                                        key={i.resource_id}
                                        value={i.resource_id}
                                        onSelect={() => handleResourceToggle(i.resource_id)}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', selectedIds.includes(i.resource_id) ? 'opacity-100' : 'opacity-0')} />
                                        {i.resource_name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};