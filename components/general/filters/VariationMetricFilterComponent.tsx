'use client'
import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { AsgInstancesFilterComponent } from './AsgInstancesFilterComponent'
import { LoaderComponent } from '../LoaderComponent'

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

    // https://cloudperformance-desarrollo.eastus2.cloudapp.azure.com/api/recursos/getMetric?date_from=2025-01-01T02:32:18&date_to=2025-12-12T01:32:18&region=all_regions&service=DynamoDB
    // const url = `/api/bridge/autoscaling/all-autoscaling-groups?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`;
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

    const list: string[] = Array.isArray(data) ? data : []
    const noMetric = list.length === 0

    const selectedAsgArray = selectedMetric ? selectedMetric.split(',').filter(Boolean) : [];

    const getDisplayText = () => {
        if (noMetric) return 'Sin metricas para servicio seleccionado';
        if (!selectedMetric || (selectedMetric === 'all')) return 'Seleccione una metrica';
        if (isAsgMultiSelect && selectedAsgArray.includes('all')) return 'Todas las metricas';
        if (selectedAsgArray.length === 1) return selectedAsgArray[0];
        return `${selectedAsgArray.length} Metricas seleccionadas`;
    };

    const handleInstanceToggle = (metricValue: string) => {
        let metrics = selectedAsgArray.slice();

        if (metricValue === 'all') {
            metrics = ['all'];
        } else {
            metrics = metrics.filter((i) => i !== 'all');
            if (metrics.includes(metricValue)) metrics = metrics.filter((i) => i !== metricValue);
            else metrics.push(metricValue);
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
                                    {list.map((metrics,index) => (
                                        <CommandItem
                                            key={index}
                                            value={metrics.MetricLabel}
                                            onSelect={() => {
                                                if (isAsgMultiSelect) handleInstanceToggle(metrics.MetricLabel);
                                                else {
                                                    setSelectedMetric(metrics.MetricLabel);
                                                    setOpen(false);
                                                }
                                            }}
                                        >
                                            <Check
                                                className={cn('mr-2 h-4 w-4', isAsgMultiSelect ? (selectedAsgArray.includes(metrics.MetricLabel) ? 'opacity-100' : 'opacity-0') : (selectedMetric === metrics.MetricLabel ? 'opacity-100' : 'opacity-0'))}
                                            />
                                            {metrics.MetricLabel}
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
