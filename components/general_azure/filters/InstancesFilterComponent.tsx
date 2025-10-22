'use client'
import { useState, Dispatch, SetStateAction, useEffect, useMemo } from 'react'
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general_azure/LoaderComponent'

interface InstancesFilterComponentProps {
    startDate: Date,
    endDate: Date,
    region: string,
    subscription: string,
    selectedTagKey?: string | null,
    selectedTagValue?: string | null,
    selectedMeterCategory?: string | null,
    selectedInstance?: string | null,
    setSelectedMeterCategory: Dispatch<SetStateAction<string | null>>,
    setSelectedInstance: Dispatch<SetStateAction<string | null>>,
    setInstancesData?: Dispatch<SetStateAction<unknown[]>>,
    onChange?: (next: { meterCategory: string | null; instance: string | null }) => void
}

interface MeterInstanceItem {
    meter_category: string;
    instances: string[];
}

const fetcher = (url: string) =>
    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json())

export const InstancesFilterComponent = ({
    startDate,
    endDate,
    region,
    subscription,
    selectedTagKey,
    selectedTagValue,
    selectedMeterCategory,
    selectedInstance,
    setSelectedMeterCategory,
    setSelectedInstance,
    setInstancesData,
    onChange
}: InstancesFilterComponentProps) => {
    const [openMeterCategory, setOpenMeterCategory] = useState(false)
    const [openInstance, setOpenInstance] = useState(false)
    const [isMounted, setIsMounted] = useState(false);

    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

    const buildUrl = () => {
        const params = new URLSearchParams({
            date_from: startDateFormatted,
            date_to: endDateFormatted,
            region: region,
            subscription_name: subscription
        });

        if (selectedTagKey) params.append('nombre_tag', selectedTagKey);
        if (selectedTagValue) params.append('valor_tag', selectedTagValue);

        return `/api/azure/bridge/azure/get-meter-instance?${params.toString()}`;
    };

    const shouldFetch = !!subscription && !!region

    const { data, error, isLoading } = useSWR(
        shouldFetch ? buildUrl() : null,
        fetcher
    )

    useEffect(() => {
        if (setInstancesData) setInstancesData(data || [])
    }, [data, setInstancesData])

    // Construir mapa de meter_category -> instances
    const instanceMap: Record<string, Set<string>> = {};
    if (Array.isArray(data)) {
        data.forEach((item: MeterInstanceItem) => {
            if (!item || !item.meter_category || !item.instances) return;

            if (!instanceMap[item.meter_category]) {
                instanceMap[item.meter_category] = new Set<string>();
            }

            item.instances.forEach(instance => {
                instanceMap[item.meter_category].add(instance);
            });
        });
    }

    const meterCategories = Object.keys(instanceMap)
    const instancesForCategory = useMemo(
        () => (selectedMeterCategory ? Array.from(instanceMap[selectedMeterCategory] || []) : []),
        [selectedMeterCategory, instanceMap]
    )


    const getDisplayName = (fullPath: string) => {
        const parts = fullPath.split('/')
        return parts[parts.length - 1] || fullPath
    }

    const isValidMeterCategory = !!(selectedMeterCategory && selectedMeterCategory !== 'all_categories' && meterCategories.includes(selectedMeterCategory))
    const isValidInstance = !!(
        selectedInstance &&
        (selectedInstance === 'all_instances' || (isValidMeterCategory && instancesForCategory.includes(selectedInstance)))
    )


    useEffect(() => {
        if (!data || isLoading) return
        if (selectedMeterCategory && selectedMeterCategory !== 'all_categories' && !meterCategories.includes(selectedMeterCategory)) {
            setSelectedMeterCategory(null)
            setSelectedInstance(null)
        } else if (selectedInstance && selectedInstance !== 'all_instances' && selectedMeterCategory && selectedMeterCategory !== 'all_categories' && !instancesForCategory.includes(selectedInstance)) {
            setSelectedInstance(null)
        }
    }, [data, isLoading, meterCategories, instancesForCategory, selectedMeterCategory, selectedInstance, setSelectedMeterCategory, setSelectedInstance])

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    if (isLoading) return <LoaderComponent size='small' />
    if (error) return <div>Error al cargar instancias de Azure</div>

    const noInstances = (data && data.length === 0) || meterCategories.length === 0

    return (
        <div className="space-y-2">
            <Popover open={openMeterCategory} onOpenChange={setOpenMeterCategory}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={openMeterCategory} className="w-full justify-between bg-transparent">
                        {noInstances
                            ? 'Sin categorías disponibles'
                            : (!selectedMeterCategory || selectedMeterCategory === 'all_categories')
                                ? 'Todas las categorías'
                                : selectedMeterCategory
                        }
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Buscar categoría..." />
                        <CommandList>
                            <CommandEmpty>{noInstances ? 'No hay categorías disponibles.' : 'No hay categorías.'}</CommandEmpty>
                            {!noInstances && (
                                <CommandGroup>
                                    <CommandItem
                                        value="all_categories"
                                        onSelect={() => {
                                            setSelectedMeterCategory('all_categories')
                                            setSelectedInstance(null)
                                            setOpenMeterCategory(false)
                                            onChange?.({ meterCategory: 'all_categories', instance: null })
                                        }}
                                    >
                                        <Check className={cn("mr-2 h-4 w-4", (!selectedMeterCategory || selectedMeterCategory === 'all_categories') ? "opacity-100" : "opacity-0")} />
                                        Todas las categorías
                                    </CommandItem>
                                    {meterCategories.map((category, idx) => (
                                        <CommandItem
                                            key={`${category}-${idx}`}
                                            value={category}
                                            onSelect={() => {
                                                setSelectedMeterCategory(category)
                                                setSelectedInstance(null)
                                                setOpenMeterCategory(false)
                                                onChange?.({ meterCategory: category, instance: null })
                                            }}
                                        >
                                            <Check className={cn("mr-2 h-4 w-4", selectedMeterCategory === category ? "opacity-100" : "opacity-0")} />
                                            {category}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {isValidMeterCategory && (
                <Popover open={openInstance} onOpenChange={setOpenInstance}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between bg-transparent">
                            {selectedInstance === 'all_instances'
                                ? 'Todas las instancias'
                                : isValidInstance
                                    ? getDisplayName(selectedInstance!)
                                    : 'Selecciona una Instancia'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder="Buscar instancia..." />
                            <CommandList>
                                <CommandEmpty>No hay instancias.</CommandEmpty>
                                <CommandGroup>
                                    <CommandItem
                                        value="all_instances"
                                        onSelect={() => {
                                            setSelectedInstance('all_instances');
                                            setOpenInstance(false);
                                            onChange?.({ meterCategory: selectedMeterCategory ?? null, instance: 'all_instances' });
                                        }}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', selectedInstance === 'all_instances' ? 'opacity-100' : 'opacity-0')} />
                                        Todas las instancias
                                    </CommandItem>
                                    {instancesForCategory.map((instance, idx) => {
                                        const displayName = getDisplayName(instance);
                                        return (
                                            <CommandItem
                                                key={`${instance}-${idx}`}
                                                value={instance}
                                                onSelect={() => {
                                                    setSelectedInstance(instance);
                                                    setOpenInstance(false);
                                                    onChange?.({ meterCategory: selectedMeterCategory ?? null, instance });
                                                }}
                                            >
                                                <Check className={cn('mr-2 h-4 w-4', selectedInstance === instance ? 'opacity-100' : 'opacity-0')} />
                                                {displayName}
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    )
}