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
import { toApiDate } from '@/lib/consumption'

const ALL = 'all';

export type VcenterResourceService = 'all' | 'unused';

const RESOURCE_ENDPOINTS: Record<VcenterResourceService, string> = {
    all: 'all_resources',
    unused: 'all_unused_resources',
};

interface ResourcesFilterComponentProps {
    resourceIp: string;
    setResourceIp: Dispatch<SetStateAction<string>>;
    startDate?: Date;
    endDate?: Date;
    isResourceMultiSelect: boolean;
    service?: VcenterResourceService;
}

interface ResourceItem {
    resource_name: string;
    resource_ip: string;
}

const getUrl = (service: VcenterResourceService, startDate?: Date, endDate?: Date) => {
    if (!startDate || !endDate) return null;
    const params = new URLSearchParams({ date_from: toApiDate(startDate), date_to: toApiDate(endDate) });
    return `/api/vcenter/bridge/resources/${RESOURCE_ENDPOINTS[service]}?${params.toString()}`;
}

export const ResourcesFilterComponent = ({
    resourceIp, setResourceIp, startDate, endDate, isResourceMultiSelect, service = 'all'
}: ResourcesFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const url = useMemo(() => getUrl(service, startDate, endDate), [service, startDate, endDate]);

    const { data, error, isLoading } = useSWR<ResourceItem[]>(url, fetcherGet, {
        revalidateOnFocus: false,
        shouldRetryOnError: false
    });

    const allResources = useMemo(() => {
        if (!Array.isArray(data) || data.length === 0) return [] as ResourceItem[];
        return data
            .filter((r) => r.resource_ip)
            .map((r) => ({
                resource_ip: r.resource_ip,
                resource_name: r.resource_name || r.resource_ip,
            }));
    }, [data]);

    const allIps = useMemo(() => allResources.map(r => r.resource_ip), [allResources]);
    const hasData = allResources.length > 0;

    const selectedIps = useMemo(() => {
        if (resourceIp === ALL) return allIps;
        return resourceIp ? resourceIp.split(',').filter(Boolean) : [];
    }, [resourceIp, allIps]);

    const isAllSelected = hasData && (resourceIp === ALL || selectedIps.length === allResources.length);
    const isIndeterminate = selectedIps.length > 0 && selectedIps.length < allResources.length;

    const ipToName = useMemo(() => {
        const map = new Map<string, string>();
        allResources.forEach(r => map.set(r.resource_ip, r.resource_name));
        return map;
    }, [allResources]);

    useEffect(() => {
        if (isLoading || !hasData) return;

        if (resourceIp === '') {
            setResourceIp(isResourceMultiSelect ? ALL : allIps[0]);
        }
    }, [allIps, hasData, isLoading, setResourceIp]);

    const handleToggleAll = () => {
        setResourceIp(isAllSelected ? '' : ALL);
    };

    const handleToggleOne = (currentIp: string) => {
        const newSelected = new Set(selectedIps);
        if (newSelected.has(currentIp)) {
            newSelected.delete(currentIp);
        } else {
            newSelected.add(currentIp);
        }
        setResourceIp(newSelected.size === allResources.length ? ALL : Array.from(newSelected).join(','));
    };

    const getDisplayText = () => {
        if (isLoading) return 'Cargando...';
        if (!hasData) return 'Sin recursos';

        if (isAllSelected) return 'Todos los Recursos';
        if (selectedIps.length === 0) return 'Seleccionar recursos...';

        if (selectedIps.length === 1) {
            const ip = selectedIps[0];
            return ipToName.get(ip) || ip;
        }

        return `${selectedIps.length} recursos seleccionados`;
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
                        {selectedIps.length} / {allResources.length}
                    </span>
                )}
            </CommandItem>

            <CommandSeparator className="my-1" />

            {allResources.map((item) => {
                const isSelected = selectedIps.includes(item.resource_ip);
                return (
                    <CommandItem
                        key={item.resource_ip}
                        value={`${item.resource_ip} ${item.resource_name}`}
                        onSelect={() => handleToggleOne(item.resource_ip)}
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
                        <span className="ml-auto pl-2 text-xs text-muted-foreground">{item.resource_ip}</span>
                    </CommandItem>
                );
            })}
        </CommandGroup>
    );

    const SingleSelectContent = () => (
        <CommandGroup className='max-h-[250px] overflow-y-auto'>
            {allResources.map((item) => (
                <CommandItem
                    key={item.resource_ip}
                    value={`${item.resource_ip} ${item.resource_name}`}
                    onSelect={() => {
                        setResourceIp(item.resource_ip);
                        setOpen(false);
                    }}
                >
                    <Check className={cn('mr-2 h-4 w-4', resourceIp === item.resource_ip ? 'opacity-100' : 'opacity-0')} />
                    <span className="truncate">{item.resource_name}</span>
                    <span className="ml-auto pl-2 text-xs text-muted-foreground">{item.resource_ip}</span>
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
