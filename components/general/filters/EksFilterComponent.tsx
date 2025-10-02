'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { LoaderComponent } from '../LoaderComponent';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { EksAsgFilterComponent } from './EksAsgFilterComponent';
import useSWR from 'swr';

interface EksFilterComponentProps {
    eks: string;
    eksAsg: string;
    eksAsgInstance: string;
    setEks: Dispatch<SetStateAction<string>>;
    setEksAsg: Dispatch<SetStateAction<string>>;
    setEksAsgInstance: Dispatch<SetStateAction<string>>;
    startDate: Date;
    endDate: Date;
    region: string;
    selectedKey: string;
    selectedValue: string;
    isEksMultiSelect: boolean;
    isEksAsgMultiselect: boolean;
    isEksAsgInstanceMultiselect: boolean;
    isInstancesService?: string;
}

const fetcherPost = (url: string, tags: { Key: string; Value: string } | null = null) =>
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: tags ? JSON.stringify([tags]) : null,
    }).then(res => res.json());

const fetcherGet = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());


export const EksFilterComponent = ({
    eks,
    eksAsg,
    eksAsgInstance,
    setEks,
    setEksAsg,
    setEksAsgInstance,
    startDate,
    endDate,
    region,
    selectedKey,
    selectedValue,
    isEksMultiSelect,
    isEksAsgMultiselect,
    isEksAsgInstanceMultiselect,
    isInstancesService
}: EksFilterComponentProps) => {

    const [open, setOpen] = useState(false);

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    // const url = `/api/aws/bridge/eks/all-eks_clusters?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`;
    let url = '';
    switch (isInstancesService) {
        case "infraUsed":
            url = `/api/aws/bridge/aws/eks/getClusterEksList?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`;
            break;
        default:
            url = `/api/aws/bridge/eks/all-eks-clusters?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`;
            break;
    }

    // const url = `/api/aws/bridge/aws/eks/getClusterEksList?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}`;
    const tagsBody = selectedKey !== 'allKeys' && selectedValue ? { Key: selectedKey, Value: selectedValue } : null;


    const shouldFetch = !!region;
    const apiMethod = isInstancesService === "infraUsed" ? fetcherGet : fetcherPost;
    const { data, error, isLoading } = useSWR(shouldFetch ? [url, tagsBody] : null, ([u, t]) => apiMethod(u, t));

    useEffect(() => {
        // Solo actuar cuando terminó la carga y no hubo error
        if (!isLoading && !error && Array.isArray(data) && data.length === 0) {
            setEks('');
            setEksAsg('');
            setEksAsgInstance('');
        }
    }, [isLoading, error, data, setEks, setEksAsg, setEksAsgInstance]);

    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar datos</div>

    const list: string[] = Array.isArray(data) ? data : [];
    const noEks = list.length === 0;

    const selectedEksArray = eks ? eks.split(',').filter(Boolean) : [];

    const getDisplayText = () => {
        if (noEks) return 'Sin Clusters EKS en la región seleccionada';
        if (!eks || (!isEksMultiSelect && eks === 'all')) return 'Seleccione un Cluster EKS';
        if (isEksMultiSelect && selectedEksArray.includes('all')) return 'Todos los Clusters EKS';
        if (selectedEksArray.length === 1) return selectedEksArray[0];
        return `${selectedEksArray.length} clusters eks seleccionados`;
    };

    const handleEksToggle = (eksValue: string) => {
        let clustersEks = selectedEksArray.slice();

        if (eksValue === 'all') {
            clustersEks = ['all'];
        } else {
            clustersEks = clustersEks.filter((i) => i !== 'all');
            if (clustersEks.includes(eksValue)) clustersEks = clustersEks.filter((i) => i !== eksValue);
            else clustersEks.push(eksValue);
        }
        setEks(clustersEks.length ? clustersEks.join(',') : '');
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
                        disabled={noEks || !shouldFetch}
                    >
                        <span className="truncate text-left max-w-[85%]">
                            {getDisplayText()}
                        </span>
                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0'>
                    <Command>
                        <CommandInput placeholder='Buscar cluster eks..' />
                        <CommandList>
                            <CommandEmpty>{noEks ? 'No hay Clusters EKS.' : 'No se encontró cluster.'}</CommandEmpty>
                            {!noEks && (
                                <CommandGroup className='max-h-[200px] overflow-y-auto'>
                                    {isEksMultiSelect && (
                                        <CommandItem value='all' onSelect={() => handleEksToggle('all')}>
                                            <Check className={cn('mr-2 h-4 w-4', selectedEksArray.includes('all') ? 'opacity-100' : 'opacity-0')} />
                                            Todos los Clusters
                                        </CommandItem>
                                    )}
                                    {list.map((cluster: string) => (
                                        <CommandItem
                                            key={cluster}
                                            value={cluster}
                                            onSelect={() => {
                                                if (isEksMultiSelect) handleEksToggle(cluster);
                                                else {
                                                    setEks(cluster);
                                                    setOpen(false);
                                                }
                                            }}
                                        >
                                            <Check
                                                className={cn('mr-2 h-4 w-4', isEksMultiSelect ? (selectedEksArray.includes(cluster) ? 'opacity-100' : 'opacity-0') : (eks === cluster ? 'opacity-100' : 'opacity-0'))}
                                            />
                                            {cluster}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <EksAsgFilterComponent
                eks={eks}
                eksAsg={eksAsg}
                eksAsgInstance={eksAsgInstance}
                setEksAsg={setEksAsg}
                setEksAsgInstance={setEksAsgInstance}
                startDate={startDateFormatted}
                endDate={endDateFormatted}
                region={region}
                isEksAsgMultiselect={isEksAsgMultiselect}
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
}