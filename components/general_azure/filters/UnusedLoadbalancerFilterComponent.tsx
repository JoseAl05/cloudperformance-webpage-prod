'use client'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_azure/LoaderComponent'

interface UnusedLoadbalancerFilterComponentProps {
    startDate: Date;
    endDate: Date;
    region: string;
    subscription: string;
    unusedLb: string;
    setUnusedLb: Dispatch<SetStateAction<string>>;
    isUnusedLoadbalancerFilterMultiselect: boolean;
}

type ApiUnusedLb =
    | { lb_id_lowercase: string; lb_name: string }
    | string

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const UnusedLoadbalancerFilterComponent = ({
    startDate,
    endDate,
    region,
    subscription,
    unusedLb,
    setUnusedLb,
    isUnusedLoadbalancerFilterMultiselect
}: UnusedLoadbalancerFilterComponentProps) => {
    const [open, setOpen] = useState(false);
    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const url = `/api/azure/bridge/azure/loadbalancers/all_unused_loadbalancers?date_from=${startDateFormatted}&date_to=${endDateFormatted}&subscription_id=${subscription}&location=${region}`
    const { data, error, isLoading } = useSWR<ApiUnusedLb[]>(url, fetcher)

    const unusedLbs = useMemo(() => {
        if (!Array.isArray(data)) return [] as { id: string; name: string }[]
        if (data.length === 0) return []
        if (typeof data[0] === 'string') {
            return (data as string[]).map((id) => ({ id, name: id }))
        }
        return (data as { lb_id_lowercase: string; lb_name: string }[]).map((s) => ({
            id: s.lb_id_lowercase,
            name: s.lb_name,
        }))
    }, [data])

    const noUnusedLbs = unusedLbs.length === 0

    const selectedIds = useMemo(
        () => (unusedLb ? unusedLb.split(',').filter(Boolean) : []),
        [unusedLb]
    )

    const idToName = useMemo(() => {
        const map = new Map<string, string>()
        for (const s of unusedLbs) map.set(s.id, s.name)
        return map
    }, [unusedLbs])

    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar loadbalancers infrautilizados</div>

    const getDisplayText = () => {
        if (noUnusedLbs) return 'Sin Loadbalancers infrautilizados disponibles'
        if (isUnusedLoadbalancerFilterMultiselect) {
            if (!unusedLb || selectedIds.includes('')) return 'Seleccione loadbalancer'
            if (!unusedLb || selectedIds.includes('all')) return 'Todos los loadbalancers infrautilizados'
            if (selectedIds.length === 1) return idToName.get(selectedIds[0]) ?? selectedIds[0]
            return `${selectedIds.length} loadbalancers seleccionados`
        } else {
            if (!unusedLb) return 'Selecciona loadbalancer infrautilizado'
            return idToName.get(unusedLb) ?? unusedLb
        }
    }

    const handleUnusedLbsToggle = (unusedLbId: string) => {
        let uLbs = [...selectedIds]
        if (unusedLbId === 'all') {
            uLbs = ['all']
        } else {
            uLbs = uLbs.filter((s) => s !== 'all')
            if (uLbs.includes(unusedLbId)) {
                uLbs = uLbs.filter((s) => s !== unusedLbId)
            } else {
                uLbs.push(unusedLbId)
            }
        }
        setUnusedLb(uLbs.length ? uLbs.join(',') : '')
    }
    return isUnusedLoadbalancerFilterMultiselect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={noUnusedLbs}
                >
                    <span className='truncate text-left max-w-[85%]'>{getDisplayText()}</span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar loadbalancer...' />
                    <CommandEmpty>
                        {noUnusedLbs ? 'No hay loadbalancers disponibles.' : 'No se encontró loadbalancer.'}
                    </CommandEmpty>

                    {!noUnusedLbs && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            <CommandItem
                                value='all'
                                onSelect={() => handleUnusedLbsToggle('all')}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        selectedIds.includes('all') ? 'opacity-100' : 'opacity-0'
                                    )}
                                />
                                Todos los Loadbalancers
                            </CommandItem>

                            {unusedLbs.map(({ id, name }) => (
                                <CommandItem
                                    key={id}
                                    value={`${name} ${id}`}
                                    onSelect={() => handleUnusedLbsToggle(id)}
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
                    disabled={noUnusedLbs}
                >
                    <span className='truncate text-left max-w-[85%]'>{getDisplayText()}</span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar loadbalancer...' />
                    <CommandList>
                        <CommandEmpty>
                            {noUnusedLbs ? 'No hay loadbalancers disponibles.' : 'No se encontró loadbalancer.'}
                        </CommandEmpty>
                        {!noUnusedLbs && (
                            <CommandGroup className='max-h-[250px] overflow-y-auto'>
                                {unusedLbs.map(({ id, name }) => (
                                    <CommandItem
                                        key={id}
                                        value={`${name} ${id}`}
                                        onSelect={() => {
                                            setunusedLb(id)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', unusedLb === id ? 'opacity-100' : 'opacity-0')} />
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
