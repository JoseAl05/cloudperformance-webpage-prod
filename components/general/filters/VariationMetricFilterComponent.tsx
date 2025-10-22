'use client'
import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general/LoaderComponent'

// interface VariationMetricFilterComponentProps {
//     asg: string,
//     asgInstance: string,
//     setAsg: Dispatch<SetStateAction<string>>,
//     setAsgInstance: Dispatch<SetStateAction<string>>,
//     startDate: Date,
//     endDate: Date,
//     region: string,
//     selectedKey: string,
//     selectedValue: string,
//     isAsgMultiSelect: boolean,
//     isAsgInstanceMultiselect: boolean,
//     isInstancesService?: string,
//     isViewResource?: boolean
// }

interface VariationMetricFilterComponentProps {
    startDate: Date,
    endDate: Date,
    region: string,
    selectedService: string,
    selectedMetric: string,
    setSelectedMetric: Dispatch<SetStateAction<string>>,
    isAsgMultiSelect: boolean,

}

type RawMetricItem = string | {
    MetricLabel?: string
    MetricName?: string
    label?: string
    value?: string
    [key: string]: unknown
}

type MetricOption = {
    value: string
    label: string
}

const fetcherPost = (url: string, tags: { Key: string; Value: string } | null = null) =>
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: tags ? JSON.stringify([tags]) : null,
    }).then(res => res.json());

const fetcherGet = (url: string, tags: { Key: string; Value: string } | null = null) =>
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: tags ? JSON.stringify([tags]) : null,
    }).then(res => res.json());

export const VariationMetricFilterComponent = ({
    startDate, endDate, region, selectedService, selectedMetric, setSelectedMetric, isAsgMultiSelect
}: VariationMetricFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    const url = `/api/aws/bridge/recursos/getMetric?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&service=${selectedService}`;

    const shouldFetch = !!region && !!selectedService;
    const { data, error, isLoading } = useSWR(shouldFetch ? [url] : null, ([u]) => fetcherGet(u));

    useEffect(() => {
        // Solo actuar cuando terminó la carga y no hubo error
        if (!isLoading && !error && Array.isArray(data) && data.length === 0) {
            setSelectedMetric('');
        }
    }, [isLoading, error, data, setSelectedMetric]);

    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar datos</div>

    const rawList: RawMetricItem[] = Array.isArray(data) ? data : []

    const options: MetricOption[] = rawList.reduce<MetricOption[]>((acc, item) => {
        if (typeof item === 'string') {
            const trimmed = item.trim()
            if (!trimmed) return acc
            acc.push({ value: trimmed, label: trimmed })
            return acc
        }

        const valueCandidate = [item.MetricName, item.value, item.MetricLabel, item.label]
            .find((val): val is string => typeof val === 'string' && val.trim() !== '')
        const labelCandidate = [item.MetricLabel, item.label, item.MetricName, item.value]
            .find((val): val is string => typeof val === 'string' && val.trim() !== '')

        const value = valueCandidate?.trim() ?? labelCandidate?.trim() ?? ''
        const label = labelCandidate?.trim() ?? value

        if (!value && !label) return acc

        acc.push({ value, label })
        return acc
    }, [])

    const optionsMap = new Map(options.map(opt => [opt.value, opt.label]))

    const noMetric = options.length === 0

    const selectedAsgArray = selectedMetric
        ? selectedMetric.split(',').map(item => item.trim()).filter(Boolean)
        : [];

    const getDisplayText = () => {
        if (noMetric) return 'Sin metricas para servicio seleccionado';
        if (!selectedMetric || (selectedMetric === 'all')) return 'Seleccione una metrica';
        if (isAsgMultiSelect && selectedAsgArray.includes('all')) return 'Todas las metricas';
        if (selectedAsgArray.length === 1) {
            const selectedValue = selectedAsgArray[0];
            return optionsMap.get(selectedValue) ?? selectedValue;
        }
        return `${selectedAsgArray.length} Metricas seleccionadas`;
    };

    const handleInstanceToggle = (metricValue: string) => {
        const normalizedValue = metricValue.trim()
        let metrics = selectedAsgArray.slice();

        if (normalizedValue === 'all') {
            metrics = ['all'];
        } else {
            metrics = metrics.filter((i) => i !== 'all');
            if (metrics.includes(normalizedValue)) metrics = metrics.filter((i) => i !== normalizedValue);
            else metrics.push(normalizedValue);
        }
        setSelectedMetric(metrics.length ? metrics.join(',') : '');
    };

    return (
        <div className='space-y-2'>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant='outline'
                        role='combobox'
                        aria-expanded={open}
                        className='w-full justify-between bg-transparent'
                        disabled={noMetric || !shouldFetch}
                    >
                        <span className="truncate text-left max-w-[85%]">
                            {getDisplayText()}
                        </span>
                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0'>
                    <Command>
                        <CommandInput placeholder='Buscar metricas...' />
                        <CommandList>
                            <CommandEmpty>{noMetric ? 'No hay metricas.' : 'No se encontraron metricas.'}</CommandEmpty>
                            {!noMetric && (
                                <CommandGroup className='max-h-[200px] overflow-y-auto'>
                                    {isAsgMultiSelect && (
                                        <CommandItem value='all' onSelect={() => handleInstanceToggle('all')}>
                                            <Check className={cn('mr-2 h-4 w-4', selectedAsgArray.includes('all') ? 'opacity-100' : 'opacity-0')} />
                                            Todas las metricas
                                        </CommandItem>
                                    )}
                                    {options.map((option) => (
                                        <CommandItem
                                            key={option.value}
                                            value={option.value}
                                            onSelect={(currentValue) => {
                                                if (isAsgMultiSelect) handleInstanceToggle(currentValue);
                                                else {
                                                    setSelectedMetric(currentValue.trim());
                                                    setOpen(false);
                                                }
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    isAsgMultiSelect
                                                        ? (selectedAsgArray.includes(option.value) ? 'opacity-100' : 'opacity-0')
                                                        : (selectedMetric === option.value ? 'opacity-100' : 'opacity-0')
                                                )}
                                            />
                                            {option.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Instancias de ASG (solo si hay ASG disponible y seleccionado) */}
            {/* {
                isViewResource ? (
                    <></>
                ) : (
                    <AsgInstancesFilterComponent
                        asg={asg}
                        asgInstance={asgInstance}
                        setAsgInstance={setAsgInstance}
                        startDate={startDateFormatted}
                        endDate={endDateFormatted}
                        region={region}
                        isInstanceMultiSelect={isAsgInstanceMultiselect}
                        isInstancesService={isInstancesService}
                    />
                )
            } */}
        </div>
    )
};
