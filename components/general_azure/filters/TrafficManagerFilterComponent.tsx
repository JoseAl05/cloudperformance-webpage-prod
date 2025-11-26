'use client'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_azure/LoaderComponent'

interface TrafficManagerFilterComponentProps {
    startDate: Date;
    endDate: Date;
    region: string;
    subscription: string;
    tm: string;
    resourceGroup: string;
    setTm: Dispatch<SetStateAction<string>>;
    isTmFilterMultiselect: boolean;
}

type ApiTm =
    | { tm_id_lowercase: string; tm_name: string }
    | string

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const TrafficManagerFilterComponent = ({
    startDate,
    endDate,
    region,
    subscription,
    tm,
    setTm,
    resourceGroup,
    isTmFilterMultiselect
}: TrafficManagerFilterComponentProps) => {
    const [open, setOpen] = useState(false);
    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const url = `/api/azure/bridge/azure/traffic_managers/all_traffic_managers?date_from=${startDateFormatted}&date_to=${endDateFormatted}&subscription_id=${subscription}&location=${region}&resource_groups=${resourceGroup}`
    const { data, error, isLoading } = useSWR<ApiTm[]>(url, fetcher)

    const tms = useMemo(() => {
        if (!Array.isArray(data)) return [] as { id: string; name: string }[]
        if (data.length === 0) return []
        if (typeof data[0] === 'string') {
            return (data as string[]).map((id) => ({ id, name: id }))
        }
        return (data as { tm_id_lowercase: string; tm_name: string }[]).map((s) => ({
            id: s.tm_id_lowercase,
            name: s.tm_name,
        }))
    }, [data])

    const noTms = tms.length === 0

    const selectedIds = useMemo(
        () => (tm ? tm.split(',').filter(Boolean) : []),
        [tm]
    )

    const allIds = useMemo(() => tms.map((lb) => lb.id), [tms]);

    const isAllSelected = tms.length > 0 && selectedIds.length === tms.length;

    const idToName = useMemo(() => {
        const map = new Map<string, string>()
        for (const s of tms) map.set(s.id, s.name)
        return map
    }, [tms])

    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar traffic managers</div>

    const getDisplayText = () => {
        if (noTms) return 'Sin traffic managers disponibles'
        if (isTmFilterMultiselect) {
            if (!tm) return 'Seleccione traffic manager'

            if (selectedIds.includes('all') || isAllSelected) return 'Todos los traffic managers'

            if (selectedIds.length === 1) return idToName.get(selectedIds[0]) ?? selectedIds[0]
            return `${selectedIds.length} traffic managers seleccionados`
        } else {
            if (!tm) return 'Selecciona traffic manager'
            return idToName.get(tm) ?? tm
        }
    }

    const handleTmsToggle = (tmId: string) => {
        if (tmId === 'all') {
            setTm(isAllSelected ? '' : allIds.join(','))
        } else {
            let tms_selected = [...selectedIds]
            tms_selected = tms_selected.filter((s) => s !== 'all')

            if (tms_selected.includes(tmId)) {
                tms_selected = tms_selected.filter((s) => s !== tmId)
            } else {
                tms_selected.push(tmId)
            }
            setTm(tms_selected.join(','))
        }
    }
    return isTmFilterMultiselect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={noTms}
                >
                    <span className='truncate text-left max-w-[85%]'>{getDisplayText()}</span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar traffic manager...' />
                    <CommandEmpty>
                        {noTms ? 'No hay traffic managers disponibles.' : 'No se encontró traffic manager.'}
                    </CommandEmpty>

                    {!noTms && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            <CommandItem
                                value='all'
                                onSelect={() => handleTmsToggle('all')}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        isAllSelected ? 'opacity-100' : 'opacity-0'
                                    )}
                                />
                                Todos los Traffic managers
                            </CommandItem>

                            {tms.map(({ id, name }) => (
                                <CommandItem
                                    key={id}
                                    value={`${name} ${id}`}
                                    onSelect={() => handleTmsToggle(id)}
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
                    disabled={noTms}
                >
                    <span className='truncate text-left max-w-[85%]'>{getDisplayText()}</span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar traffic manager...' />
                    <CommandList>
                        <CommandEmpty>
                            {noTms ? 'No hay traffic managers disponibles.' : 'No se encontró traffic manager.'}
                        </CommandEmpty>
                        {!noTms && (
                            <CommandGroup className='max-h-[250px] overflow-y-auto'>
                                {tms.map(({ id, name }) => (
                                    <CommandItem
                                        key={id}
                                        value={`${name} ${id}`}
                                        onSelect={() => {
                                            setTm(id)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', tm === id ? 'opacity-100' : 'opacity-0')} />
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
