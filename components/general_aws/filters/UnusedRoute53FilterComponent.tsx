'use client'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_azure/LoaderComponent'

interface UnusedRoute53FilterComponentProps {
    startDate: Date;
    endDate: Date;
    region: string;
    unusedR53: string;
    setUnusedR53: Dispatch<SetStateAction<string>>;
    isUnusedR53Multiselect: boolean;
}

type ApiR53 =
    | { hz_id: string; hz_name: string }
    | string

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const UnusedRoute53FilterComponent = ({
    startDate,
    endDate,
    region,
    unusedR53,
    setUnusedR53,
    isUnusedR53Multiselect
}: UnusedRoute53FilterComponentProps) => {
    const [open, setOpen] = useState(false);
    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const url = `/api/aws/bridge/route53/all_unused_hosted_zones?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`
    const { data, error, isLoading } = useSWR<ApiR53[]>(url,fetcher)

    const unusedRoutes = useMemo(() => {
        if (!Array.isArray(data)) return [] as { id: string; name: string }[]
        if (data.length === 0) return []
        if (typeof data[0] === 'string') {
            return (data as string[]).map((id) => ({ id, name: id }))
        }
        return (data as { hz_id: string; hz_name: string }[]).map((s) => ({
            id: s.hz_id,
            name: s.hz_name,
        }))
    }, [data])

    const noRoutes = unusedRoutes.length === 0

    const selectedIds = useMemo(
        () => (unusedR53 ? unusedR53.split(',').filter(Boolean) : []),
        [unusedR53]
    )

    const allIds = useMemo(() => unusedRoutes.map((elbv2) => elbv2.id), [unusedRoutes]);

    const isAllSelected = unusedRoutes.length > 0 && selectedIds.length === unusedRoutes.length;

    const idToName = useMemo(() => {
        const map = new Map<string, string>()
        for (const s of unusedRoutes) map.set(s.id, s.name)
        return map
    }, [unusedRoutes])

    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar hosted zones</div>

    const getDisplayText = () => {
        if (noRoutes) return 'Sin hosted zones disponibles'
        if (isUnusedR53Multiselect) {
            if (!unusedR53) return 'Seleccione hosted zone'

            if (selectedIds.includes('all') || isAllSelected) return 'Todos los hosted zones'

            if (selectedIds.length === 1) return idToName.get(selectedIds[0]) ?? selectedIds[0]
            return `${selectedIds.length} hosted zones seleccionados`
        } else {
            if (!unusedR53) return 'Selecciona hosted zone'
            return idToName.get(unusedR53) ?? unusedR53
        }
    }

    const handleUnusedR53Toggle = (unusedR53Id: string) => {
        if (unusedR53Id === 'all') {
            setUnusedR53(isAllSelected ? '' : allIds.join(','))
        } else {
            let routes53 = [...selectedIds]
            routes53 = routes53.filter((s) => s !== 'all')

            if (routes53.includes(unusedR53Id)) {
                routes53 = routes53.filter((s) => s !== unusedR53Id)
            } else {
                routes53.push(unusedR53Id)
            }
            setUnusedR53(routes53.join(','))
        }
    }
    return isUnusedR53Multiselect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={noRoutes}
                >
                    <span className='truncate text-left max-w-[85%]'>{getDisplayText()}</span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar hosted zone...' />
                    <CommandEmpty>
                        {noRoutes ? 'No hay hosted zones disponibles.' : 'No se encontró hosted zone.'}
                    </CommandEmpty>

                    {!noRoutes && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            <CommandItem
                                value='all'
                                onSelect={() => handleUnusedR53Toggle('all')}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        isAllSelected ? 'opacity-100' : 'opacity-0'
                                    )}
                                />
                                Todos los hosted zones
                            </CommandItem>

                            {unusedRoutes.map(({ id, name }) => (
                                <CommandItem
                                    key={id}
                                    value={`${name} ${id}`}
                                    onSelect={() => handleUnusedR53Toggle(id)}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            selectedIds.includes(id) ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />
                                    <span className='truncate'>{name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
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
                    disabled={noRoutes}
                >
                    <span className='truncate text-left max-w-[85%]'>{getDisplayText()}</span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar hosted zone...' />
                    <CommandList>
                        <CommandEmpty>
                            {noRoutes ? 'No hay hosted zones disponibles.' : 'No se encontró hosted zone.'}
                        </CommandEmpty>
                        {!noRoutes && (
                            <CommandGroup className='max-h-[250px] overflow-y-auto'>
                                {unusedRoutes.map(({ id, name }) => (
                                    <CommandItem
                                        key={id}
                                        value={`${name} ${id}`}
                                        onSelect={() => {
                                            setUnusedR53(id)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', unusedR53 === id ? 'opacity-100' : 'opacity-0')} />
                                        <span className='truncate'>{name}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
