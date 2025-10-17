'use client'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '../LoaderComponent'

interface UnusedVmFilterComponentProps {
    startDate: Date;
    endDate: Date;
    region: string;
    subscription: string;
    unusedVm: string;
    setUnusedVm: Dispatch<SetStateAction<string>>;
    isUnusedVmFilterMultiselect: boolean;
}

type ApiUnusedVm =
    | { vm_id_lowercase: string; vm_name: string }
    | string

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const UnusedVmFilterComponent = ({
    startDate,
    endDate,
    region,
    subscription,
    unusedVm,
    setUnusedVm,
    isUnusedVmFilterMultiselect
}: UnusedVmFilterComponentProps) => {
    const [open, setOpen] = useState(false);
    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const url = `/api/azure/bridge/azure/vms/all_unused_vms?date_from=${startDateFormatted}&date_to=${endDateFormatted}&subscription=${subscription}&location=${region}`
    const { data, error, isLoading } = useSWR<ApiUnusedVm[]>(url, fetcher)

    const unusedVms = useMemo(() => {
        if (!Array.isArray(data)) return [] as { id: string; name: string }[]
        if (data.length === 0) return []
        if (typeof data[0] === 'string') {
            return (data as string[]).map((id) => ({ id, name: id }))
        }
        return (data as { vm_id_lowercase: string; vm_name: string }[]).map((s) => ({
            id: s.vm_id_lowercase,
            name: s.vm_name,
        }))
    }, [data])

    const noUnusedVms = unusedVms.length === 0

    const selectedIds = useMemo(
        () => (unusedVm ? unusedVm.split(',').filter(Boolean) : []),
        [unusedVm]
    )

    const idToName = useMemo(() => {
        const map = new Map<string, string>()
        for (const s of unusedVms) map.set(s.id, s.name)
        return map
    }, [unusedVms])

    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar vms infrautilizadas</div>

    const getDisplayText = () => {
        if (noUnusedVms) return 'Sin VMs infrautilizadas disponibles'
        if (isUnusedVmFilterMultiselect) {
            if (!unusedVm || selectedIds.includes('')) return 'Seleccione VMs'
            if (!unusedVm || selectedIds.includes('all')) return 'Todas las VMs infrautilizadas'
            if (selectedIds.length === 1) return idToName.get(selectedIds[0]) ?? selectedIds[0]
            return `${selectedIds.length} VMs seleccionadas`
        } else {
            if (!unusedVm) return 'Selecciona VM infrautilizada'
            return idToName.get(unusedVm) ?? unusedVm
        }
    }

    const handleUnusedVmsToggle = (unusedVmId: string) => {
        let uVms = [...selectedIds]
        if (unusedVmId === 'all') {
            uVms = ['all']
        } else {
            uVms = uVms.filter((s) => s !== 'all')
            if (uVms.includes(unusedVmId)) {
                uVms = uVms.filter((s) => s !== unusedVmId)
            } else {
                uVms.push(unusedVmId)
            }
        }
        setUnusedVm(uVms.length ? uVms.join(',') : '')
    }
    return isUnusedVmFilterMultiselect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={noUnusedVms}
                >
                    <span className='truncate text-left max-w-[85%]'>{getDisplayText()}</span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar VM...' />
                    <CommandEmpty>
                        {noUnusedVms ? 'No hay VMs disponibles.' : 'No se encontró VM.'}
                    </CommandEmpty>

                    {!noUnusedVms && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            <CommandItem
                                value='all'
                                onSelect={() => handleUnusedVmsToggle('all')}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        selectedIds.includes('all') ? 'opacity-100' : 'opacity-0'
                                    )}
                                />
                                Todas las VMs
                            </CommandItem>

                            {unusedVms.map(({ id, name }) => (
                                <CommandItem
                                    key={id}
                                    value={`${name} ${id}`}
                                    onSelect={() => handleUnusedVmsToggle(id)}
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
                    disabled={noUnusedVms}
                >
                    <span className='truncate text-left max-w-[85%]'>{getDisplayText()}</span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar VM...' />
                    <CommandList>
                        <CommandEmpty>
                            {noUnusedVms ? 'No hay VMs disponibles.' : 'No se encontró VM.'}
                        </CommandEmpty>
                        {!noUnusedVms && (
                            <CommandGroup className='max-h-[250px] overflow-y-auto'>
                                {unusedVms.map(({ id, name }) => (
                                    <CommandItem
                                        key={id}
                                        value={`${name} ${id}`}
                                        onSelect={() => {
                                            setUnusedVm(id)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', unusedVm === id ? 'opacity-100' : 'opacity-0')} />
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
