'use client'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_azure/LoaderComponent'

interface UnusedTrafficManagerFilterProps {
    startDate: Date;
    endDate: Date;
    region: string;
    subscription: string;
    unusedTm: string;
    resourceGroup: string;
    setUnusedTm: Dispatch<SetStateAction<string>>;
    isUnusedTmFilterMultiselect: boolean;
    selectedTagKey?: string | null;
    selectedTagValue?: string | null;
}

type ApiUnusedTm =
    | { tm_id_lowercase: string; tm_name: string }
    | string

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const UnusedTrafficManagerFilter = ({
    startDate,
    endDate,
    region,
    subscription,
    unusedTm,
    setUnusedTm,
    resourceGroup,
    isUnusedTmFilterMultiselect,
    selectedTagKey,
    selectedTagValue
}: UnusedTrafficManagerFilterProps) => {
    const [open, setOpen] = useState(false);
    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const tagKeyParam = selectedTagKey || 'allKeys';
    const tagValueParam = selectedTagValue || 'allValues';

    const url = `/api/azure/bridge/azure/traffic_managers/all_unused_traffic_managers?date_from=${startDateFormatted}&date_to=${endDateFormatted}&subscription_id=${subscription}&location=${region}&resource_groups=${resourceGroup}&nombre_tag=${tagKeyParam}&valor_tag=${tagValueParam}`
    const { data, error, isLoading } = useSWR<ApiUnusedTm[]>(url, fetcher)

    const unusedTms = useMemo(() => {
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

    const noUnusedTms = unusedTms.length === 0

    const selectedIds = useMemo(
        () => (unusedTm ? unusedTm.split(',').filter(Boolean) : []),
        [unusedTm]
    )

    const allIds = useMemo(() => unusedTms.map((lb) => lb.id), [unusedTms]);

    const isAllSelected = unusedTms.length > 0 && selectedIds.length === unusedTms.length;

    const idToName = useMemo(() => {
        const map = new Map<string, string>()
        for (const s of unusedTms) map.set(s.id, s.name)
        return map
    }, [unusedTms])

    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar traffic managers infrautilizados</div>

    const getDisplayText = () => {
        if (noUnusedTms) return 'Sin traffic managers infrautilizados disponibles'
        if (isUnusedTmFilterMultiselect) {
            if (!unusedTm) return 'Seleccione traffic manager'

            if (selectedIds.includes('all') || isAllSelected) return 'Todos los traffic managers infrautilizados'

            if (selectedIds.length === 1) return idToName.get(selectedIds[0]) ?? selectedIds[0]
            return `${selectedIds.length} traffic managers seleccionados`
        } else {
            if (!unusedTm) return 'Selecciona traffic manager infrautilizado'
            return idToName.get(unusedTm) ?? unusedTm
        }
    }

    const handleUnusedTmsToggle = (unusedTmId: string) => {
        if (unusedTmId === 'all') {
            setUnusedTm(isAllSelected ? '' : allIds.join(','))
        } else {
            let tms = [...selectedIds]
            tms = tms.filter((s) => s !== 'all')

            if (tms.includes(unusedTmId)) {
                tms = tms.filter((s) => s !== unusedTmId)
            } else {
                tms.push(unusedTmId)
            }
            setUnusedTm(tms.join(','))
        }
    }
    return isUnusedTmFilterMultiselect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={noUnusedTms}
                >
                    <span className='truncate text-left max-w-[85%]'>{getDisplayText()}</span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar traffic manager...' />
                    <CommandEmpty>
                        {noUnusedTms ? 'No hay traffic managers disponibles.' : 'No se encontró traffic manager.'}
                    </CommandEmpty>

                    {!noUnusedTms && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            <CommandItem
                                value='all'
                                onSelect={() => handleUnusedTmsToggle('all')}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        isAllSelected ? 'opacity-100' : 'opacity-0'
                                    )}
                                />
                                Todos los Traffic managers
                            </CommandItem>

                            {unusedTms.map(({ id, name }) => (
                                <CommandItem
                                    key={id}
                                    value={`${name} ${id}`}
                                    onSelect={() => handleUnusedTmsToggle(id)}
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
                    disabled={noUnusedTms}
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
                            {noUnusedTms ? 'No hay traffic managers disponibles.' : 'No se encontró traffic manager.'}
                        </CommandEmpty>
                        {!noUnusedTms && (
                            <CommandGroup className='max-h-[250px] overflow-y-auto'>
                                {unusedTms.map(({ id, name }) => (
                                    <CommandItem
                                        key={id}
                                        value={`${name} ${id}`}
                                        onSelect={() => {
                                            setUnusedTm(id)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', unusedTm === id ? 'opacity-100' : 'opacity-0')} />
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
