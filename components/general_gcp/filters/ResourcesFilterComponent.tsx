'use client'
import { fetcher as fetcherGet } from '@/lib/fetcher';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
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
    CommandSeparator
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_aws/LoaderComponent'

interface ResourcesFilterComponentProps {
    service: string;
    resourceId: string;
    setResourceId: Dispatch<SetStateAction<string>>;
    startDate: Date;
    endDate: Date;
    projects: string;
    regions: string;
    tagKey: string;
    tagValue: string;
    isResourceMultiSelect: boolean;
}

interface VertexEndpointItem {
    endpoint_id: string;
    endpoint_short_id?: string;
    endpoint_name?: string;
}

interface ResourceItem {
    resource_id: string;
    resource_name: string;
}

const getUrlForService = (service: string, params: { startDate: string, endDate: string, projects: string, regions: string, tagKey: string, tagValue: string }) => {
    const { startDate, endDate, projects, regions } = params;
    if (!regions) return null;

    const baseParams = `date_from=${startDate}&date_to=${endDate}&project_id=${projects}&location=${regions}`;
    const baseUrl = '/api/gcp/bridge/gcp';

    switch (service) {
        case 'vertex-endpoints':
        case 'gcp-vertex-endpoints': {
            const vertexParams = new URLSearchParams({
                project_id: projects || 'all_projects',
                region: regions,
            });
            return `${baseUrl}/vertex/gcp_vertex_endpoints?${vertexParams.toString()}`;
        }
        case 'disks': return `${baseUrl}/unused/persistent-disks/candidates?${baseParams}`;
        case 'instances': return `${baseUrl}/instancias_compute_engine/all_compute_engine_instances?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}`;
        case 'unused-instances': return `${baseUrl}/unused/compute-engine/candidates?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}`;
        case 'instance_groups': return `${baseUrl}/instance_groups/all_instance_groups?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}`;
        case 'filestore': return `${baseUrl}/instancias_filestore/all_filestore?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}`;
        case 'clusters-gke': return `${baseUrl}/gke_clusters/all_gke_clusters?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}`;
        case 'postgres': return `${baseUrl}/instancias_cloud_sql/all_cloudsql_instances?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}&db_engine=postgres`;
        case 'mysql': return `${baseUrl}/instancias_cloud_sql/all_cloudsql_instances?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}&db_engine=mysql`;
        case 'sqlserver': return `${baseUrl}/instancias_cloud_sql/all_cloudsql_instances?${baseParams}&tagKey=${params.tagKey}&tagValue=${params.tagValue}&db_engine=sqlserver`;
        default: return null;
    }
}

export const ResourcesFilterComponent = ({
    service, resourceId, setResourceId, startDate, endDate, projects, regions,tagKey, tagValue, isResourceMultiSelect
}: ResourcesFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const dateParams = useMemo(() => ({
        startDate: startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '',
        endDate: endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '',
        projects,
        regions,
        tagKey,
        tagValue
    }), [startDate, endDate, projects, regions, tagKey, tagValue]);

    const url = useMemo(() => getUrlForService(service, dateParams), [service, dateParams]);

    const { data, error, isLoading } = useSWR(url, fetcherGet, {
        revalidateOnFocus: false,
        shouldRetryOnError: false
    });

    const allResources = useMemo(() => {
        if (!Array.isArray(data) || data.length === 0) return [] as ResourceItem[];

        if (
            service === 'vertex-endpoints' ||
            service === 'gcp-vertex-endpoints'
        ) {
            const endpoints = new Map<string, ResourceItem>();
            for (const endpoint of data as VertexEndpointItem[]) {
                if (!endpoint?.endpoint_id) continue;
                const id = endpoint.endpoint_short_id || endpoint.endpoint_id.split('/').pop();
                if (!id) continue;
                endpoints.set(id, {
                    resource_id: id,
                    resource_name: endpoint.endpoint_name || id,
                });
            }
            return Array.from(endpoints.values());
        }

        if (typeof data[0] === 'string') {
            return (data as string[]).map((id) => ({ resource_id: id, resource_name: id }));
        }
        return (data as ResourceItem[]).map((r) => ({
            resource_id: r.resource_id,
            resource_name: r.resource_name || r.resource_id,
        }));
    }, [data, service]);

    const selectedIds = useMemo(() =>
        resourceId ? resourceId.split(',').filter(Boolean) : [],
        [resourceId]);

    const allIdsString = useMemo(() => allResources.map(r => r.resource_id).join(','), [allResources]);
    const hasData = allResources.length > 0;

    const isAllSelected = hasData && selectedIds.length === allResources.length;
    const isIndeterminate = selectedIds.length > 0 && selectedIds.length < allResources.length;

    const idToName = useMemo(() => {
        const map = new Map<string, string>();
        allResources.forEach(r => map.set(r.resource_id, r.resource_name));
        return map;
    }, [allResources]);

    useEffect(() => {
        if (isLoading || !hasData) return;

        if (resourceId === '') {
            setResourceId(allIdsString);
        }
    }, [allIdsString, hasData, isLoading, setResourceId]);

    const handleToggleAll = () => {
        if (isAllSelected) {
            setResourceId('');
        } else {
            setResourceId(allIdsString);
        }
    };

    const handleToggleOne = (currentId: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(currentId)) {
            newSelected.delete(currentId);
        } else {
            newSelected.add(currentId);
        }
        setResourceId(Array.from(newSelected).join(','));
    };

    const getDisplayText = () => {
        if (isLoading) return 'Cargando...';
        if (!hasData) return 'Sin recursos';

        if (isAllSelected) return 'Todos los Recursos';
        if (selectedIds.length === 0) return 'Seleccionar recursos...';

        if (selectedIds.length === 1) {
            const id = selectedIds[0];
            const name = idToName.get(id) || id;
            return name === id ? name : `${id} - ${name}`;
        }

        return `${selectedIds.length} recursos seleccionados`;
    };

    if (error) return <div className="text-red-500 text-sm">Error al cargar</div>;

    const MultiSelectContent = () => (
        <CommandGroup className='max-h-[250px] overflow-y-auto'>
            <CommandItem
                value="all-resources-toggle"
                onSelect={handleToggleAll}
                className="font-medium cursor-pointer"
            >
                <div className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    isAllSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                )}>
                    <Check className={cn("h-4 w-4")} />
                </div>
                <span>{isAllSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}</span>

                {isIndeterminate && (
                    <span className="ml-auto text-xs text-muted-foreground">
                        {selectedIds.length} / {allResources.length}
                    </span>
                )}
            </CommandItem>

            <CommandSeparator className="my-1" />

            {allResources.map((item) => {
                const isSelected = selectedIds.includes(item.resource_id);
                return (
                    <CommandItem
                        key={item.resource_id}
                        value={`${item.resource_id} ${item.resource_name}`}
                        onSelect={() => handleToggleOne(item.resource_id)}
                    >
                        <div className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                        )}>
                            <Check className={cn("h-4 w-4")} />
                        </div>
                        <span className="truncate">
                            {item.resource_name}
                        </span>
                    </CommandItem>
                );
            })}
        </CommandGroup>
    );

    const SingleSelectContent = () => (
        <CommandGroup className='max-h-[250px] overflow-y-auto'>
            {allResources.map((item) => (
                <CommandItem
                    key={item.resource_id}
                    value={`${item.resource_id} ${item.resource_name}`}
                    onSelect={() => {
                        setResourceId(item.resource_id);
                        setOpen(false);
                    }}
                >
                    <Check className={cn('mr-2 h-4 w-4', resourceId === item.resource_id ? 'opacity-100' : 'opacity-0')} />
                    {item.resource_name}
                </CommandItem>
            ))}
        </CommandGroup>
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent hover:bg-accent'
                    disabled={!hasData || isLoading}
                >
                    {isLoading ? (
                        <LoaderComponent size='small' />
                    ) : (
                        <>
                            <span className="truncate text-left max-w-[90%]">
                                {getDisplayText()}
                            </span>
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[--radix-popover-trigger-width] p-0' align="start">
                <Command>
                    <CommandInput placeholder='Buscar recurso...' />
                    <CommandList>
                        <CommandEmpty>No se encontró recurso.</CommandEmpty>
                        {hasData && (
                            isResourceMultiSelect ? <MultiSelectContent /> : <SingleSelectContent />
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};