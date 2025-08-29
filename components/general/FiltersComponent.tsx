'use client'

import { useEffect, useState } from 'react';
import { DatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { RegionFilterComponent } from './RegionFilterComponent';
import { InstancesEc2FilterComponent } from './InstancesEc2FilterComponent';
import { TagFilterComponent } from './TagsFilterComponent';
import { ServiceFilterComponent } from './ServiceFilterComponent';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Calendar, Filter, MapPin, Server, Tag, XCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

interface FiltersComponentProps {
    Component: (params: {
        startDate: Date;
        endDate?: Date;
        instance: string;
        region: string;
        selectedKey?: string | null;
        selectedValue?: string | null;
    }) => React.JSX.Element;
    dateFilter?: boolean;
    regionFilter?: boolean;
    isRegionMultiSelect?: boolean;
    instancesFilter?: boolean;
    tagsFilter?: boolean;
    serviceFilter?: boolean;
    collection?: string;
    tagColumnName?: string;
}

export const FiltersComponent = ({
    Component,
    dateFilter = true,
    regionFilter = false,
    isRegionMultiSelect = false,
    instancesFilter = false,
    tagsFilter = false,
    serviceFilter = false,
    collection = null,
    tagColumnName = null
}: FiltersComponentProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const getInitialFilters = () => {
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');
        const instanceParam = searchParams.get('instance');
        const regionParam = searchParams.get('region');
        const selectedKeyParam = searchParams.get('selectedKey');
        const selectedValueParam = searchParams.get('selectedValue');
        const selectedServiceParam = searchParams.get('services')

        return {
            startDate: startDateParam ? new Date(startDateParam) : yesterday,
            endDate: endDateParam ? new Date(endDateParam) : new Date(),
            instance: instanceParam || '',
            region: regionParam || 'all_regions',
            selectedKey: selectedKeyParam || null,
            selectedValue: selectedValueParam || null,
            service: selectedServiceParam || ''
        };
    };


    const [filters, setFilters] = useState(getInitialFilters);

    const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([filters.startDate, filters.endDate]);
    const [tempInstance, setTempInstance] = useState(filters.instance);
    const [tempRegion, setTempRegion] = useState(filters.region);
    const [tempKey, setTempKey] = useState<string | null>(filters.selectedKey);
    const [tempValue, setTempValue] = useState<string | null>(filters.selectedValue);
    const [tagsData, setTagsData] = useState<unknown[]>([]);
    const [tempService, setTempService] = useState(filters.service);

    useEffect(() => {
        const newFilters = getInitialFilters();
        setFilters(newFilters);
        setTempRange([newFilters.startDate, newFilters.endDate]);
        setTempInstance(newFilters.instance);
        setTempRegion(newFilters.region);
        setTempKey(newFilters.selectedKey);
        setTempValue(newFilters.selectedValue);
        setTempService(newFilters.service);
    }, [searchParams]);

    useEffect(() => {
        const hasTagsForRegion = tagsData?.some(item => (item as unknown)?.Tags?.length > 0);

        if (!hasTagsForRegion && (tempKey || tempValue)) {
            setTempKey(null);
            setTempValue(null);
        }
    }, [tempRegion, tagsData]);

    const onChange = (dates: [Date | null, Date | null]) => {
        setTempRange(dates);
    };

    const applyFilters = () => {
        const [start, end] = tempRange;
        if (!start || !end) return;

        const newFilters = {
            startDate: start,
            endDate: end,
            instance: tempInstance,
            region: tempRegion,
            selectedKey: tempKey,
            selectedValue: tempValue,
            service: tempService
        };
        setFilters(newFilters);
        const query = new URLSearchParams();
        if (newFilters.startDate) query.set('startDate', newFilters.startDate.toISOString());
        if (newFilters.endDate) query.set('endDate', newFilters.endDate.toISOString());
        if (newFilters.instance) query.set('instance', newFilters.instance);
        if (newFilters.region && newFilters.region !== 'all_regions') {
            query.set('region', newFilters.region);
        }
        if (newFilters.selectedKey) query.set('selectedKey', newFilters.selectedKey);
        if (newFilters.selectedValue) query.set('selectedValue', newFilters.selectedValue);
        if (newFilters.service) query.set('services', newFilters.service);

        router.push(`${window.location.pathname}?${query.toString()}`);
    };

    const clearFilters = () => {
        const defaultFilters = {
            startDate: yesterday,
            endDate: new Date(),
            instance: '',
            region: 'all_regions',
            selectedKey: null,
            selectedValue: null,
            service: ''
        };

        setFilters(defaultFilters);
        setTempRange([defaultFilters.startDate, defaultFilters.endDate]);
        setTempInstance(defaultFilters.instance);
        setTempRegion(defaultFilters.region);
        setTempKey(defaultFilters.selectedKey);
        setTempValue(defaultFilters.selectedValue);
        setTempService(defaultFilters.service)

        router.push(window.location.pathname);
    };
    return (
        <div className='space-y-6'>
            <Card className="w-full min-w-0 overflow-hidden">
                <CardHeader className='pb-4'>
                    <CardTitle className='text-xl font-semibold flex items-center gap-2'>
                        <Server className='h-5 w-5' />
                        Filtros
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {dateFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Calendar className='h-4 w-4' />
                                    Período
                                </label>
                                <DatePicker
                                    selected={tempRange[0]}
                                    onChange={onChange}
                                    startDate={tempRange[0]}
                                    endDate={tempRange[1]}
                                    selectsRange
                                    className='w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent'
                                />
                            </div>
                        )}
                        {regionFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <MapPin className='h-4 w-4' />
                                    Región
                                </label>
                                <RegionFilterComponent
                                    selectedRegion={tempRegion}
                                    setSelectedRegion={setTempRegion}
                                    isRegionMultiSelect={isRegionMultiSelect}
                                />
                            </div>
                        )}
                        {tagsFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Tag className='h-4 w-4' />
                                    Tags
                                </label>
                                <TagFilterComponent
                                    startDate={filters.startDate}
                                    endDate={filters.endDate}
                                    region={tempRegion}
                                    collection={collection}
                                    tagColumnName={tagColumnName}
                                    selectedKey={filters.selectedKey ? filters.selectedKey : tempKey}
                                    selectedValue={filters.selectedValue ? filters.selectedValue : tempValue}
                                    setSelectedKey={setTempKey}
                                    setSelectedValue={setTempValue}
                                    setTagsData={setTagsData}
                                />
                            </div>
                        )}
                        {instancesFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Server className='h-4 w-4' />
                                    Instancia
                                </label>
                                <InstancesEc2FilterComponent
                                    instance={tempInstance}
                                    setInstance={setTempInstance}
                                    startDate={filters.startDate}
                                    endDate={filters.endDate}
                                    region={tempRegion}
                                    selectedKey={tempKey ?? ''}
                                    selectedValue={tempValue ?? ''}
                                />
                            </div>
                        )}
                        {serviceFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Server className='h-4 w-4' />
                                    Servicio
                                </label>
                                <ServiceFilterComponent
                                    selectedServices={tempService}
                                    setSelectedServices={setTempService}
                                />
                            </div>
                        )}
                    </div>
                    <div className='flex items-center gap-4'>
                        <Button onClick={applyFilters} className='flex items-center gap-2 bg-blue-700 hover:bg-blue-500 text-white'>
                            <Filter />
                            Aplicar Filtros
                        </Button>
                        <Button onClick={clearFilters} className='flex items-center gap-2 bg-gray-500 hover:bg-gray-400 text-white'>
                            <XCircle />
                            Limpiar Filtros
                        </Button>
                    </div>
                </CardContent>
                <Component
                    startDate={filters.startDate}
                    endDate={filters.endDate}
                    instance={filters.instance}
                    region={filters.region}
                    selectedKey={filters.selectedKey}
                    selectedValue={filters.selectedValue}
                    services={filters.service}
                />
            </Card>
        </div>
    );
};