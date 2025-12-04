'use client'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_azure/LoaderComponent'

interface LoadbalancersV2FilterComponentProps {
    startDate: Date;
    endDate: Date;
    region: string;
    elbV2: string;
    setElbV2: Dispatch<SetStateAction<string>>;
    isElbV2Multiselect: boolean;
}

type ApiElbV2 =
    | { elb_arn: string; elb_name: string }
    | string

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const LoadbalancersV2FilterComponent = ({
    startDate,
    endDate,
    region,
    elbV2,
    setElbV2,
    isElbV2Multiselect
}: LoadbalancersV2FilterComponentProps) => {
    const [open, setOpen] = useState(false);
    const startDateFormatted = startDate ? startDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';
    const url = `/api/aws/bridge/loadbalancersv2/all_load_balancersv2?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`
    const { data, error, isLoading } = useSWR<ApiElbV2[]>(url, fetcher)

    const elbsV2 = useMemo(() => {
        if (!Array.isArray(data)) return [] as { id: string; name: string }[]
        if (data.length === 0) return []
        if (typeof data[0] === 'string') {
            return (data as string[]).map((id) => ({ id, name: id }))
        }
        return (data as { elb_arn: string; elb_name: string }[]).map((s) => ({
            id: s.elb_arn,
            name: s.elb_name,
        }))
    }, [data])

    const noElbsV2 = elbsV2.length === 0

    const selectedIds = useMemo(
        () => (elbV2 ? elbV2.split(',').filter(Boolean) : []),
        [elbV2]
    )

    const allIds = useMemo(() => elbsV2.map((elbv2) => elbv2.id), [elbsV2]);

    const isAllSelected = elbsV2.length > 0 && selectedIds.length === elbsV2.length;

    const idToName = useMemo(() => {
        const map = new Map<string, string>()
        for (const s of elbsV2) map.set(s.id, s.name)
        return map
    }, [elbsV2])

    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar loadbalancers</div>

    const getDisplayText = () => {
        if (noElbsV2) return 'Sin loadbalancers disponibles'
        if (isElbV2Multiselect) {
            if (!elbV2) return 'Seleccione loadbalancer'

            if (selectedIds.includes('all') || isAllSelected) return 'Todos los loadbalancers'

            if (selectedIds.length === 1) return idToName.get(selectedIds[0]) ?? selectedIds[0]
            return `${selectedIds.length} loadbalancers seleccionados`
        } else {
            if (!elbV2) return 'Selecciona loadbalancer'
            return idToName.get(elbV2) ?? elbV2
        }
    }

    const handleElbV2Toggle = (elbV2Id: string) => {
        if (elbV2Id === 'all') {
            setElbV2(isAllSelected ? '' : allIds.join(','))
        } else {
            let allElbsV2 = [...selectedIds]
            allElbsV2 = allElbsV2.filter((s) => s !== 'all')

            if (allElbsV2.includes(elbV2Id)) {
                allElbsV2 = allElbsV2.filter((s) => s !== elbV2Id)
            } else {
                allElbsV2.push(elbV2Id)
            }
            setElbV2(allElbsV2.join(','))
        }
    }
    return isElbV2Multiselect ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={noElbsV2}
                >
                    <span className='truncate text-left max-w-[85%]'>{getDisplayText()}</span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar loadbalancer...' />
                    <CommandEmpty>
                        {noElbsV2 ? 'No hay loadbalancers disponibles.' : 'No se encontró loadbalancer.'}
                    </CommandEmpty>

                    {!noElbsV2 && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            <CommandItem
                                value='all'
                                onSelect={() => handleElbV2Toggle('all')}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        isAllSelected ? 'opacity-100' : 'opacity-0'
                                    )}
                                />
                                Todos los Loadbalancers
                            </CommandItem>

                            {elbsV2.map(({ id, name }) => (
                                <CommandItem
                                    key={id}
                                    value={`${name} ${id}`}
                                    onSelect={() => handleElbV2Toggle(id)}
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
                    disabled={noElbsV2}
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
                            {noElbsV2 ? 'No hay loadbalancers disponibles.' : 'No se encontró loadbalancer.'}
                        </CommandEmpty>
                        {!noElbsV2 && (
                            <CommandGroup className='max-h-[250px] overflow-y-auto'>
                                {elbsV2.map(({ id, name }) => (
                                    <CommandItem
                                        key={id}
                                        value={`${name} ${id}`}
                                        onSelect={() => {
                                            setElbV2(id)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', elbV2 === id ? 'opacity-100' : 'opacity-0')} />
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
