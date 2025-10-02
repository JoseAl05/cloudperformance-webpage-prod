'use client'
import { Dispatch, SetStateAction, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '../LoaderComponent'

interface MetricsFilterComponentProps {
    startDate: Date
    endDate: Date
    collection: string
    metric: string
    setMetric: Dispatch<SetStateAction<string>>
}

const fetcherGet = (url: string) =>
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => res.json());

export const MetricsFilterComponent = ({
    startDate,
    endDate,
    collection,
    metric,
    setMetric
}: MetricsFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate.toISOString().replace('Z', '').slice(0, -4);

    const shouldFetch = !!collection;
    const url = shouldFetch
        ? `/api/azure/bridge/azure/get-all-metrics?date_from=${startDateFormatted}&date_to=${endDateFormatted}&collection=${collection}`
        : null;

    const { data, error, isLoading } = useSWR<string[]>(url, fetcherGet);

    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar métricas</div>

    const metrics: string[] = Array.isArray(data) ? data : []
    const noMetrics = metrics.length === 0

    const getDisplayText = () => {
        if (noMetrics) return 'Sin métricas disponibles';
        if (!metric) return 'Seleccione una métrica';
        return metric;
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-transparent'
                    disabled={noMetrics || !shouldFetch}
                >
                    <span className="truncate text-left max-w-[85%]">
                        {getDisplayText()}
                    </span>
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Buscar métrica...' />
                    <CommandEmpty>
                        {noMetrics ? 'No hay métricas disponibles.' : 'No se encontró métrica.'}
                    </CommandEmpty>
                    {!noMetrics && (
                        <CommandGroup className='max-h-[200px] overflow-y-auto'>
                            {metrics.map((met: string) => (
                                <CommandItem
                                    key={met}
                                    value={met}
                                    onSelect={() => {
                                        setMetric(met);
                                        setOpen(false);
                                    }}
                                >
                                    <Check className={cn('mr-2 h-4 w-4', metric === met ? 'opacity-100' : 'opacity-0')} />
                                    {met}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    );
};