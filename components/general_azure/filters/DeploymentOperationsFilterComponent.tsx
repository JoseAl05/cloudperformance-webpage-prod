'use client'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '../LoaderComponent'

interface DeploymentOperationsFilterComponentProps {
    startDate: Date
    endDate: Date
    operation: string
    setOperation: Dispatch<SetStateAction<string>>
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const DeploymentOperationsFilterComponent = ({
    operation,
    setOperation,
    startDate,
    endDate,
}: DeploymentOperationsFilterComponentProps) => {
    const [open, setOpen] = useState(false)
    
    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''
    const url = `/api/azure/bridge/azure/deployments/deployments/operations?date_from=${startDateFormatted}&date_to=${endDateFormatted}`
    const { data, error, isLoading } = useSWR<string[]>(url, fetcher)

    const operations = useMemo(() => {
        if (!Array.isArray(data)) return []
        return data.map((op) => ({ id: op, name: op }))
    }, [data])

    const noOperations = operations.length === 0

    const selectedIds = useMemo(
        () => (operation ? operation.split(',').filter(Boolean) : []),
        [operation]
    )

    if (isLoading) return <LoaderComponent size="small" />
    if (error) return <div>Error al cargar operaciones</div>

    const getDisplayText = () => {
        if (noOperations) return 'Sin operaciones disponibles'
        if (!operation || selectedIds.includes('all_operations')) return 'Todas las Operaciones'
        if (selectedIds.length === 1) return selectedIds[0]
        return `${selectedIds.length} operaciones seleccionadas`
    }

    const handleOperationToggle = (operationIdOrAll: string) => {
        let ops = [...selectedIds]
        if (operationIdOrAll === 'all_operations') {
            ops = ['all_operations']
        } else {
            ops = ops.filter((o) => o !== 'all_operations')
            if (ops.includes(operationIdOrAll)) {
                ops = ops.filter((o) => o !== operationIdOrAll)
            } else {
                ops.push(operationIdOrAll)
            }
        }
        setOperation(ops.length ? ops.join(',') : '')
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-transparent"
                    disabled={noOperations}
                >
                    <span className="truncate text-left max-w-[85%]">{getDisplayText()}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Buscar operación..." />
                    <CommandEmpty>
                        {noOperations ? 'No hay operaciones disponibles.' : 'No se encontró operación.'}
                    </CommandEmpty>

                    {!noOperations && (
                        <CommandGroup className="max-h-[200px] overflow-y-auto">
                            <CommandItem
                                value="all_operations"
                                onSelect={() => handleOperationToggle('all_operations')}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        selectedIds.includes('all_operations') ? 'opacity-100' : 'opacity-0'
                                    )}
                                />
                                Todas las Operaciones
                            </CommandItem>

                            {operations.map(({ id, name }) => (
                                <CommandItem
                                    key={id}
                                    value={name}
                                    onSelect={() => handleOperationToggle(id)}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            selectedIds.includes(id) ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />
                                    <span className="truncate">{name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    )
}