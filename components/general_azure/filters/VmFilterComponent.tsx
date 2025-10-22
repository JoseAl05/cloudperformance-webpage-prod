'use client'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_azure/LoaderComponent'

interface VmFilterComponentProps {
    startDate: Date;
    endDate: Date;
    region: string;
    subscription: string;
    vm: string;
    setVm: Dispatch<SetStateAction<string>>;
    isVmFilterMultiselect: boolean;
}

type ApiVm =
    | { vm_id_lowercase: string; vm_name: string }
    | string

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const VmFilterComponent = ({
    startDate,
    endDate,
    region,
    subscription,
    vm,
    setVm,
    isVmFilterMultiselect
}: VmFilterComponentProps) => {
    const [open, setOpen] = useState(false);
    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const url = `/api/azure/bridge/azure/vms/all_vms?date_from=${startDateFormatted}&date_to=${endDateFormatted}&subscription=${subscription}&location=${region}`
    const { data, error, isLoading } = useSWR<ApiVm[]>(url, fetcher)

    const virtualMachines = useMemo(() => {
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

    const noVms = virtualMachines.length === 0

    const selectedIds = useMemo(
        () => (vm ? vm.split(',').filter(Boolean) : []),
        [vm]
    )

    const idToName = useMemo(() => {
        const map = new Map<string, string>()
        for (const s of virtualMachines) map.set(s.id, s.name)
        return map
    }, [virtualMachines])

    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar vms</div>

    const getDisplayText = () => {
        if (noVms) return 'Sin VMs disponibles'
        if (isVmFilterMultiselect) {
            if (!vm || selectedIds.includes('')) return 'Seleccione VMs'
            if (!vm || selectedIds.includes('all')) return 'Todas las VMs'
            if (selectedIds.length === 1) return idToName.get(selectedIds[0]) ?? selectedIds[0]
            return `${selectedIds.length} VMs seleccionadas`
        } else {
            if (!vm) return 'Selecciona VM'
            return idToName.get(vm) ?? vm
        }
    }

    const handleVmsToggle = (vmId: string) => {
        let virtMach = [...selectedIds]
        if (vmId === 'all') {
            virtMach = ['all']
        } else {
            virtMach = virtMach.filter((s) => s !== 'all')
            if (virtMach.includes(vmId)) {
                virtMach = virtMach.filter((s) => s !== vmId)
            } else {
                virtMach.push(vmId)
            }
        }
        setVm(virtMach.length ? virtMach.join(',') : '')
    }
    return isVmFilterMultiselect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={noVms}
                >
                    <span className='truncate text-left max-w-[85%]'>{getDisplayText()}</span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar VM...' />
                    <CommandEmpty>
                        {noVms ? 'No hay VMs disponibles.' : 'No se encontró VM.'}
                    </CommandEmpty>

                    {!noVms && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            <CommandItem
                                value='all'
                                onSelect={() => handleVmsToggle('all')}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        selectedIds.includes('all') ? 'opacity-100' : 'opacity-0'
                                    )}
                                />
                                Todas las VMs
                            </CommandItem>

                            {virtualMachines.map(({ id, name }) => (
                                <CommandItem
                                    key={id}
                                    value={`${name} ${id}`}
                                    onSelect={() => handleVmsToggle(id)}
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
                    disabled={noVms}
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
                            {noVms ? 'No hay VMs disponibles.' : 'No se encontró VM.'}
                        </CommandEmpty>
                        {!noVms && (
                            <CommandGroup className='max-h-[250px] overflow-y-auto'>
                                {virtualMachines.map(({ id, name }) => (
                                    <CommandItem
                                        key={id}
                                        value={`${name} ${id}`}
                                        onSelect={() => {
                                            setVm(id)
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
