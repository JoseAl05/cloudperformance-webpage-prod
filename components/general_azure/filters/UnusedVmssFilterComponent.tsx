'use client'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '../LoaderComponent'

interface UnusedVmssFilterComponentProps {
    startDate: Date;
    endDate: Date;
    region: string;
    subscription: string;
    unusedVmss: string;
    setUnusedVmss: Dispatch<SetStateAction<string>>;
    isUnusedVmssFilterMultiselect: boolean;
}

type ApiUnusedVmss =
    | { vm_id_lowercase: string; vm_name: string }
    | string

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const UnusedVmssFilterComponent = ({
    startDate,
    endDate,
    region,
    subscription,
    unusedVmss,
    setUnusedVmss,
    isUnusedVmssFilterMultiselect
}: UnusedVmssFilterComponentProps) => {
    const [open, setOpen] = useState(false);
    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const url = `/api/azure/bridge/azure/vms/all_unused_vmss?date_from=${startDateFormatted}&date_to=${endDateFormatted}&subscription=${subscription}&location=${region}`
    const { data, error, isLoading } = useSWR<string[]>(url, fetcher)

    const unusedScaleSet = useMemo(() => {
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

    const noUnusedScaleSet = unusedScaleSet.length === 0

    const selectedIds = useMemo(
        () => (unusedVmss ? unusedVmss.split(',').filter(Boolean) : []),
        [unusedVmss]
    )

    const idToName = useMemo(() => {
        const map = new Map<string, string>()
        for (const s of unusedScaleSet) map.set(s.id, s.name)
        return map
    }, [unusedScaleSet])

    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar vmss infrautilizadas</div>

    const getDisplayText = () => {
        if (noUnusedScaleSet) return 'Sin VMSS infrautilizadas disponibles'
        if (isUnusedVmssFilterMultiselect) {
            if (!unusedVmss || selectedIds.includes('')) return 'Seleccione VMSS'
            if (!unusedVmss || selectedIds.includes('all')) return 'Todas las VMSS infrautilizadas'
            if (selectedIds.length === 1) return idToName.get(selectedIds[0]) ?? selectedIds[0]
            return `${selectedIds.length} VMSS seleccionadas`
        } else {
            if (!unusedVmss) return 'Selecciona VMSS infrautilizada'
            return idToName.get(unusedVmss) ?? unusedVmss
        }
    }

    const handleUnusedVmssToggle = (unusedVmssId: string) => {
        let uVmss = [...selectedIds]
        if (unusedVmssId === 'all') {
            uVmss = ['all']
        } else {
            uVmss = uVmss.filter((s) => s !== 'all')
            if (uVmss.includes(unusedVmssId)) {
                uVmss = uVmss.filter((s) => s !== unusedVmssId)
            } else {
                uVmss.push(unusedVmssId)
            }
        }
        setUnusedVmss(uVmss.length ? uVmss.join(',') : '')
    }
    return isUnusedVmssFilterMultiselect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={noUnusedScaleSet}
                >
                    <span className='truncate text-left max-w-[85%]'>{getDisplayText()}</span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar VMSS...' />
                    <CommandEmpty>
                        {noUnusedScaleSet ? 'No hay VMSS disponibles.' : 'No se encontró VMSS.'}
                    </CommandEmpty>

                    {!noUnusedScaleSet && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            <CommandItem
                                value='all'
                                onSelect={() => handleUnusedVmssToggle('all')}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        selectedIds.includes('all') ? 'opacity-100' : 'opacity-0'
                                    )}
                                />
                                Todas las VMSS
                            </CommandItem>

                            {unusedScaleSet.map(({ id, name }) => (
                                <CommandItem
                                    key={id}
                                    value={`${name} ${id}`}
                                    onSelect={() => handleUnusedVmssToggle(id)}
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
                    disabled={unusedScaleSet}
                >
                    <span className='truncate text-left max-w-[85%]'>{getDisplayText()}</span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar VMSS...' />
                    <CommandList>
                        <CommandEmpty>
                            {noUnusedScaleSet ? 'No hay VMSS disponibles.' : 'No se encontró VMSS.'}
                        </CommandEmpty>
                        {!noUnusedScaleSet && (
                            <CommandGroup className='max-h-[250px] overflow-y-auto'>
                                {unusedScaleSet.map(({ id, name }) => (
                                    <CommandItem
                                        key={id}
                                        value={`${name} ${id}`}
                                        onSelect={() => {
                                            setUnusedVmss(id)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', unusedVmss === id ? 'opacity-100' : 'opacity-0')} />
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
