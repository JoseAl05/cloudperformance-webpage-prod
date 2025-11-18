'use client'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_azure/LoaderComponent'

interface UnusedAppGwFilterComponentProps {
    startDate: Date;
    endDate: Date;
    region: string;
    subscription: string;
    unusedAppGw: string;
    setUnusedAppGw: Dispatch<SetStateAction<string>>;
    isUnusedAppGFilterMultiselect: boolean;
}

type ApiUnusedAppGw =
    | { gw_id_lowercase: string; gw_name: string }
    | string

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const UnusedAppGwFilterComponent = ({
    startDate,
    endDate,
    region,
    subscription,
    unusedAppGw,
    setUnusedAppGw,
    isUnusedAppGFilterMultiselect
}: UnusedAppGwFilterComponentProps) => {
    const [open, setOpen] = useState(false);
    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const url = `/api/azure/bridge/azure/apps_gateway/all_unused_application_gateways?date_from=${startDateFormatted}&date_to=${endDateFormatted}&subscription_id=${subscription}&location=${region}`
    const { data, error, isLoading } = useSWR<ApiUnusedAppGw[]>(url, fetcher)

    const unusedAppsGw = useMemo(() => {
        if (!Array.isArray(data)) return [] as { id: string; name: string }[]
        if (data.length === 0) return []
        if (typeof data[0] === 'string') {
            return (data as string[]).map((id) => ({ id, name: id }))
        }
        return (data as { gw_id_lowercase: string; gw_name: string }[]).map((s) => ({
            id: s.gw_id_lowercase,
            name: s.gw_name,
        }))
    }, [data])

    const nounusedAppsGw = unusedAppsGw.length === 0

    const selectedIds = useMemo(
        () => (unusedAppGw ? unusedAppGw.split(',').filter(Boolean) : []),
        [unusedAppGw]
    )

    const allIds = useMemo(() => unusedAppsGw.map((lb) => lb.id), [unusedAppsGw]);

    const isAllSelected = unusedAppsGw.length > 0 && selectedIds.length === unusedAppsGw.length;

    const idToName = useMemo(() => {
        const map = new Map<string, string>()
        for (const s of unusedAppsGw) map.set(s.id, s.name)
        return map
    }, [unusedAppsGw])

    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar applications gateway infrautilizados</div>

    const getDisplayText = () => {
        if (nounusedAppsGw) return 'Sin applications gateway infrautilizados disponibles'
        if (isUnusedAppGFilterMultiselect) {
            if (!unusedAppGw) return 'Seleccione application gateway'

            if (selectedIds.includes('all') || isAllSelected) return 'Todos los applications gateway infrautilizados'

            if (selectedIds.length === 1) return idToName.get(selectedIds[0]) ?? selectedIds[0]
            return `${selectedIds.length} applications gateway seleccionados`
        } else {
            if (!unusedAppGw) return 'Selecciona application gateway infrautilizado'
            return idToName.get(unusedAppGw) ?? unusedAppGw
        }
    }

    const handleunusedAppsGwToggle = (unusedAppGwId: string) => {
        if (unusedAppGwId === 'all') {
            setUnusedAppGw(isAllSelected ? '' : allIds.join(','))
        } else {
            let appsGw = [...selectedIds]
            appsGw = appsGw.filter((s) => s !== 'all')

            if (appsGw.includes(unusedAppGwId)) {
                appsGw = appsGw.filter((s) => s !== unusedAppGwId)
            } else {
                appsGw.push(unusedAppGwId)
            }
            setUnusedAppGw(appsGw.join(','))
        }
    }
    return isUnusedAppGFilterMultiselect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={nounusedAppsGw}
                >
                    <span className='truncate text-left max-w-[85%]'>{getDisplayText()}</span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar application gateway...' />
                    <CommandEmpty>
                        {nounusedAppsGw ? 'No hay application gateways disponibles.' : 'No se encontró application gateway.'}
                    </CommandEmpty>

                    {!nounusedAppsGw && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            <CommandItem
                                value='all'
                                onSelect={() => handleunusedAppsGwToggle('all')}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        isAllSelected ? 'opacity-100' : 'opacity-0'
                                    )}
                                />
                                Todos los Applications Gateway
                            </CommandItem>

                            {unusedAppsGw.map(({ id, name }) => (
                                <CommandItem
                                    key={id}
                                    value={`${name} ${id}`}
                                    onSelect={() => handleunusedAppsGwToggle(id)}
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
                    disabled={nounusedAppsGw}
                >
                    <span className='truncate text-left max-w-[85%]'>{getDisplayText()}</span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar application gateway...' />
                    <CommandList>
                        <CommandEmpty>
                            {nounusedAppsGw ? 'No hay applications gateway disponibles.' : 'No se encontró application gateway.'}
                        </CommandEmpty>
                        {!nounusedAppsGw && (
                            <CommandGroup className='max-h-[250px] overflow-y-auto'>
                                {unusedAppsGw.map(({ id, name }) => (
                                    <CommandItem
                                        key={id}
                                        value={`${name} ${id}`}
                                        onSelect={() => {
                                            setUnusedAppGw(id)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', unusedAppGw === id ? 'opacity-100' : 'opacity-0')} />
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
