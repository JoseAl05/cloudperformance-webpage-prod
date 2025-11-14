'use client'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_azure/LoaderComponent'

interface LoadbalancerFilterComponentProps {
    startDate: Date;
    endDate: Date;
    region: string;
    subscription: string;
    lb: string;
    setLb: Dispatch<SetStateAction<string>>;
    isLoadbalancerFilterMultiselect: boolean;
}

type ApiLb =
    | { lb_id_lowercase: string; lb_name: string }
    | string

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const LoadbalancerFilterComponent = ({
    startDate,
    endDate,
    region,
    subscription,
    lb,
    setLb,
    isLoadbalancerFilterMultiselect
}: LoadbalancerFilterComponentProps) => {
    const [open, setOpen] = useState(false);
    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const url = `/api/azure/bridge/azure/loadbalancers/all_loadbalancers?date_from=${startDateFormatted}&date_to=${endDateFormatted}&subscription=${subscription}&location=${region}`
    const { data, error, isLoading } = useSWR<ApiLb[]>(url, fetcher)

    const loadbalancers = useMemo(() => {
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

    const noLbs = loadbalancers.length === 0

    const selectedIds = useMemo(
        () => (lb ? lb.split(',').filter(Boolean) : []),
        [lb]
    )

    const idToName = useMemo(() => {
        const map = new Map<string, string>()
        for (const s of loadbalancers) map.set(s.id, s.name)
        return map
    }, [loadbalancers])

    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar loadbalancers</div>

    const getDisplayText = () => {
        if (noLbs) return 'Sin Loadbalancers disponibles'
        if (isLoadbalancerFilterMultiselect) {
            if (!lb || selectedIds.includes('')) return 'Seleccione Loadbalancers'
            if (!lb || selectedIds.includes('all')) return 'Todos los Loadbalancers'
            if (selectedIds.length === 1) return idToName.get(selectedIds[0]) ?? selectedIds[0]
            return `${selectedIds.length} loadbalancers seleccionados`
        } else {
            if (!lb) return 'Selecciona Loadbalancer'
            return idToName.get(lb) ?? lb
        }
    }

    const handleLbsToggle = (lbId: string) => {
        let loadBal = [...selectedIds]
        if (lbId === 'all') {
            loadBal = ['all']
        } else {
            loadBal = loadBal.filter((s) => s !== 'all')
            if (loadBal.includes(lbId)) {
                loadBal = loadBal.filter((s) => s !== lbId)
            } else {
                loadBal.push(lbId)
            }
        }
        setLb(loadBal.length ? loadBal.join(',') : '')
    }
    return isLoadbalancerFilterMultiselect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={noLbs}
                >
                    <span className='truncate text-left max-w-[85%]'>{getDisplayText()}</span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar Loadbalancer...' />
                    <CommandEmpty>
                        {noLbs ? 'No hay loadbalancers disponibles.' : 'No se encontró loadbalancer.'}
                    </CommandEmpty>

                    {!noLbs && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            <CommandItem
                                value='all'
                                onSelect={() => handleLbsToggle('all')}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        selectedIds.includes('all') ? 'opacity-100' : 'opacity-0'
                                    )}
                                />
                                Todos los Loadbalancers
                            </CommandItem>

                            {loadbalancers.map(({ id, name }) => (
                                <CommandItem
                                    key={id}
                                    value={`${name} ${id}`}
                                    onSelect={() => handleLbsToggle(id)}
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
                    disabled={noLbs}
                >
                    <span className='truncate text-left max-w-[85%]'>{getDisplayText()}</span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar Loadbalancer...' />
                    <CommandList>
                        <CommandEmpty>
                            {noLbs ? 'No hay loadbalancers disponibles.' : 'No se encontró loadbalancer.'}
                        </CommandEmpty>
                        {!noLbs && (
                            <CommandGroup className='max-h-[250px] overflow-y-auto'>
                                {loadbalancers.map(({ id, name }) => (
                                    <CommandItem
                                        key={id}
                                        value={`${name} ${id}`}
                                        onSelect={() => {
                                            setLb(id)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', vm === id ? 'opacity-100' : 'opacity-0')} />
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
