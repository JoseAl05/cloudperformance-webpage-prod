'use client'
import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_aws/LoaderComponent'
import { EksAsgInstancesFilterComponent } from '@/components/general_aws/filters/EksAsgInstancesFilterComponent'

interface EksAsgFilterComponentProps {
    eks: string,
    eksAsg: string,
    eksAsgInstance: string,
    setEksAsg: Dispatch<SetStateAction<string>>,
    setEksAsgInstance: Dispatch<SetStateAction<string>>,
    startDate: Date,
    endDate: Date,
    region: string,
    isEksAsgMultiselect: boolean,
    isEksAsgInstanceMultiselect: boolean,
    isInstancesService?: string,
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());


export const EksAsgFilterComponent = ({
    eks,
    eksAsg,
    eksAsgInstance,
    setEksAsg,
    setEksAsgInstance,
    startDate,
    endDate,
    region,
    isEksAsgMultiselect,
    isEksAsgInstanceMultiselect,
    isInstancesService
}: EksAsgFilterComponentProps) => {
    const [open, setOpen] = useState(false);

    let url = '';
    switch (isInstancesService) {
        case "infraUsed":
            url = `/api/aws/bridge/aws/eks/getAsgListbyClusterName?date_from=${startDate}&date_to=${endDate}&eks_clusterName=${eks}&region=${region}`;
            break;
        default:
            url = `/api/aws/bridge/eks/all-eks-autoscaling-groups?date_from=${startDate}&date_to=${endDate}&region=${region}&cluster_name=${eks}`;
            break;
    }


    const shouldFetch = !!region;
    const { data, error, isLoading } = useSWR(shouldFetch ? url : null, fetcher);


    useEffect(() => {
        // Solo actuar cuando terminó la carga y no hubo error
        if (!isLoading && !error && Array.isArray(data) && data.length === 0) {
            setEksAsg('');
            setEksAsgInstance('');
        }
    }, [isLoading, error, data, setEksAsg, setEksAsgInstance]);

    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar datos</div>

    const list: string[] = Array.isArray(data) ? data : []
    const noEksAsg = list.length === 0

    const selectedEksAsgArray = eksAsg ? eksAsg.split(',').filter(Boolean) : [];

    const getDisplayText = () => {
        if (noEksAsg) return 'Sin Autoscaling Groups en la región seleccionada';
        if (!eksAsg || (!isEksAsgMultiselect && eksAsg === 'all')) return 'Seleccione un Autoscaling Group';
        if (isEksAsgMultiselect && selectedEksAsgArray.includes('all')) return 'Todos los Autoscaling Groups';
        if (selectedEksAsgArray.length === 1) return selectedEksAsgArray[0];
        return `${selectedEksAsgArray.length} autoscaling groups seleccionados`;
    };

    const handleEksAsgToggle = (eksAsgValue: string) => {
        let eksAsgs = selectedEksAsgArray.slice();

        if (eksAsgValue === 'all') {
            eksAsgs = ['all'];
        } else {
            eksAsgs = eksAsgs.filter((i) => i !== 'all');
            if (eksAsgs.includes(eksAsgValue)) eksAsgs = eksAsgs.filter((i) => i !== eksAsgValue);
            else eksAsgs.push(eksAsgValue);
        }
        setEksAsg(eksAsgs.length ? eksAsgs.join(',') : '');
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
                        disabled={noEksAsg || !shouldFetch}
                    >
                        <span className="truncate text-left max-w-[85%]">
                            {getDisplayText()}
                        </span>
                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0'>
                    <Command>
                        <CommandInput placeholder='Buscar autoscaling...' />
                        <CommandList>
                            <CommandEmpty>{noEksAsg ? 'No hay Autoscaling Groups.' : 'No se encontró autoscaling.'}</CommandEmpty>
                            {!noEksAsg && (
                                <CommandGroup className='max-h-[200px] overflow-y-auto'>
                                    {isEksAsgMultiselect && (
                                        <CommandItem value='all' onSelect={() => handleEksAsgToggle('all')}>
                                            <Check className={cn('mr-2 h-4 w-4', selectedEksAsgArray.includes('all') ? 'opacity-100' : 'opacity-0')} />
                                            Todos los Autoscaling
                                        </CommandItem>
                                    )}
                                    {list.map((autoscaling: string) => (
                                        <CommandItem
                                            key={autoscaling}
                                            value={autoscaling}
                                            onSelect={() => {
                                                if (isEksAsgMultiselect) handleEksAsgToggle(autoscaling);
                                                else {
                                                    setEksAsg(autoscaling);
                                                    setOpen(false);
                                                }
                                            }}
                                        >
                                            <Check
                                                className={cn('mr-2 h-4 w-4', isEksAsgMultiselect ? (selectedEksAsgArray.includes(autoscaling) ? 'opacity-100' : 'opacity-0') : (eksAsg === autoscaling ? 'opacity-100' : 'opacity-0'))}
                                            />
                                            {autoscaling}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <EksAsgInstancesFilterComponent
                eksAsg={eksAsg}
                eksAsgInstance={eksAsgInstance}
                setEksAsgInstance={setEksAsgInstance}
                startDate={startDate}
                endDate={endDate}
                region={region}
                isEksAsgInstanceMultiselect={isEksAsgInstanceMultiselect}
                isInstancesService={isInstancesService}
            />
            {/* Instancias de ASG (solo si hay ASG disponible y seleccionado) */}
            {/* <AsgInstancesFilterComponent
                asg={asg}
                asgInstance={asgInstance}
                setAsgInstance={setAsgInstance}
                startDate={startDateFormatted}
                endDate={endDateFormatted}
                region={region}
                isInstanceMultiSelect={isAsgInstanceMultiselect}
                isInstancesService={isInstancesService}
            /> */}
        </div>
    )
};
