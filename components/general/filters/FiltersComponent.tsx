'use client'

import { useEffect, useState, useMemo, useRef } from 'react';
import { DatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { RegionFilterComponent } from './RegionFilterComponent';
import { TagFilterComponent } from './TagsFilterComponent';
import { ServiceFilterComponent } from './ServiceFilterComponent';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Calendar, Filter, MapPin, Server, Tag, XCircle, Ban } from 'lucide-react';
import { Button } from '../../ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { InstancesFilterComponent } from './InstancesFilterComponent';
import { AsgInstancesFilterComponent } from './AsgInstancesFilterComponent';
import { AsgFilterComponent } from './AsgFilterComponent';

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
    instancesService?: string;
    asgFilter?: boolean;
    isAsgMultiSelect?: boolean;
    isAsgInstanceMultiSelect?: boolean;
    isInstanceMultiSelect?: boolean;
    isViewUnused?: boolean;
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
    instancesService,
    asgFilter = false,
    isInstanceMultiSelect = false,
    isAsgMultiSelect = false,
    isAsgInstanceMultiSelect = false,
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
        const asgParam = searchParams.get('asg');
        const asgInstanceParam = searchParams.get('asgInstance');
        const regionParam = searchParams.get('region');
        const selectedKeyParam = searchParams.get('selectedKey');
        const selectedValueParam = searchParams.get('selectedValue');
        const selectedServiceParam = searchParams.get('services');

        return {
            startDate: startDateParam ? new Date(startDateParam) : yesterday,
            endDate: endDateParam ? new Date(endDateParam) : new Date(),
            instance: instanceParam || '',
            asg: asgParam || '',
            asgInstance: asgInstanceParam || '',
            instanceService: instancesService || null,
            region: regionParam || 'all_regions',
            selectedKey: selectedKeyParam || null,
            selectedValue: selectedValueParam || null,
            service: selectedServiceParam || ''
        };
    };

    const [filters, setFilters] = useState(getInitialFilters);
    const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([filters.startDate, filters.endDate]);
    const [tempInstance, setTempInstance] = useState(filters.instance);
    const [tempAsg, setTempAsg] = useState(filters.asg);
    const [tempAsgInstance, setTempAsgInstance] = useState(filters.asgInstance);
    const [tempInstanceService, setTempInstanceService] = useState(filters.instanceService);
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
        setTempAsg(newFilters.asg);
        setTempAsgInstance(newFilters.asgInstance);
        setTempInstanceService(newFilters.instanceService);
        setTempRegion(newFilters.region);
        setTempKey(newFilters.selectedKey);
        setTempValue(newFilters.selectedValue);
        setTempService(newFilters.service);
    }, [searchParams]);

    const onChange = (dates: [Date | null, Date | null]) => setTempRange(dates);

    const applyFilters = () => {
        const [start, end] = tempRange;
        if (!start || !end) return;

        const newFilters = {
            startDate: start,
            endDate: end,
            instance: tempAsg ? tempAsgInstance : tempInstance,
            asg: tempAsg,
            asgInstance: tempAsgInstance,
            instanceService: tempInstanceService,
            region: tempRegion,
            selectedKey: tempKey,
            selectedValue: tempValue,
            service: tempService
        };
        setFilters(newFilters);

        const query = new URLSearchParams();
        query.set('startDate', newFilters.startDate.toISOString());
        query.set('endDate', newFilters.endDate.toISOString());
        if (newFilters.asg) query.set('asg', newFilters.asg);
        if (newFilters.asgInstance) query.set('asgInstance', newFilters.asgInstance);
        if (!newFilters.asg && newFilters.instance) query.set('instance', newFilters.instance);
        if (newFilters.instanceService) query.set('instanceService', String(newFilters.instanceService));
        if (newFilters.region && newFilters.region !== 'all_regions') query.set('region', newFilters.region);
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
            asg: '',
            asgInstance: '',
            instancesService: null,
            region: 'all_regions',
            selectedKey: null,
            selectedValue: null,
            service: ''
        };

        setFilters({
            startDate: defaultFilters.startDate,
            endDate: defaultFilters.endDate,
            instance: defaultFilters.instance,
            asg: defaultFilters.asg,
            asgInstance: defaultFilters.asgInstance,
            instanceService: defaultFilters.instancesService,
            region: defaultFilters.region,
            selectedKey: defaultFilters.selectedKey,
            selectedValue: defaultFilters.selectedValue,
            service: defaultFilters.service
        });
        setTempRange([defaultFilters.startDate, defaultFilters.endDate]);
        setTempInstance(defaultFilters.instance);
        setTempAsg(defaultFilters.asg);
        setTempAsgInstance(defaultFilters.asgInstance);
        setTempInstanceService(defaultFilters.instancesService);
        setTempRegion(defaultFilters.region);
        setTempKey(defaultFilters.selectedKey);
        setTempValue(defaultFilters.selectedValue);
        setTempService(defaultFilters.service);

        router.push(window.location.pathname);
    };

    const handleTagChange = (nextKey: string | null, nextValue: string | null) => {
        setTempKey(nextKey);
        setTempValue(nextValue);
        setTempInstance('');
        setTempAsg('');
        setTempAsgInstance('');

        const params = new URLSearchParams(searchParams.toString());

        const start = (tempRange[0] ?? filters.startDate)
        const end = (tempRange[1] ?? filters.endDate)
        params.set('startDate', start);
        params.set('endDate', end);

        if (tempRegion && tempRegion !== 'all_regions') {
            params.set('region', tempRegion);
        } else {
            params.delete('region');
        }

        if (nextKey) params.set('selectedKey', nextKey); else params.delete('selectedKey');
        if (nextValue) params.set('selectedValue', nextValue); else params.delete('selectedValue');

        params.delete('instance');
        params.delete('asg');
        params.delete('asgInstance');

        router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
    };

    const tempStartDate = useMemo(() => (tempRange[0] ?? filters.startDate), [tempRange, filters.startDate]);
    const tempEndDate = useMemo(() => (tempRange[1] ?? filters.endDate), [tempRange, filters.endDate]);

    const canFetchByInstances = instancesFilter && !!tempInstance;
    const canFetchByAsg = asgFilter && (!!tempAsgInstance || (!!tempAsg && tempAsg.includes('all')));
    const canFetch = (asgFilter ? canFetchByAsg : canFetchByInstances) || (!instancesFilter && !asgFilter);

    const EmptyState = ({ text }: { text: string }) => (
        <div className="w-full min-w-0 px-4 py-6">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Ban className="h-5 w-5" />
                <span className="text-sm">{text}</span>
            </div>
        </div>
    );

    return (
        <div className='space-y-6'>
            <Card className="w-full min-w-0 overflow-hidden">
                {/* <CardHeader className='pb-4'>
                    <CardTitle className='text-xl font-semibold flex items-center gap-2'>
                        <Server className='h-5 w-5' />
                        Filtros
                    </CardTitle>
                </CardHeader> */}
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
                                <RegionFilterComponent selectedRegion={tempRegion} setSelectedRegion={setTempRegion} isRegionMultiSelect={isRegionMultiSelect} />
                            </div>
                        )}

                        {tagsFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Tag className='h-4 w-4' />
                                    Tags
                                </label>
                                <TagFilterComponent
                                    startDate={tempStartDate}
                                    endDate={tempEndDate}
                                    region={tempRegion}
                                    collection={collection as string}
                                    tagColumnName={tagColumnName as string}
                                    selectedKey={tempKey}
                                    selectedValue={tempValue}
                                    setSelectedKey={setTempKey}
                                    setSelectedValue={setTempValue}
                                    setTagsData={setTagsData}
                                    onChange={({ key, value }) => handleTagChange(key, value)}
                                />
                            </div>
                        )}

                        {instancesFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Server className='h-4 w-4' />
                                    Instancia
                                </label>
                                <InstancesFilterComponent
                                    service={tempInstanceService as unknown}
                                    instance={tempInstance}
                                    setInstance={setTempInstance}
                                    startDate={tempStartDate}
                                    endDate={tempEndDate}
                                    region={tempRegion}
                                    selectedKey={tempKey ?? ''}
                                    selectedValue={tempValue ?? ''}
                                    isInstanceMultiSelect={isInstanceMultiSelect}
                                />
                            </div>
                        )}

                        {asgFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Server className='h-4 w-4' />
                                    Autoscaling
                                </label>
                                <AsgFilterComponent
                                    asg={tempAsg}
                                    asgInstance={tempAsgInstance}
                                    setAsg={setTempAsg}
                                    setAsgInstance={setTempAsgInstance}
                                    startDate={tempStartDate}
                                    endDate={tempEndDate}
                                    region={tempRegion}
                                    selectedKey={tempKey ?? ''}
                                    selectedValue={tempValue ?? ''}
                                    isAsgMultiSelect={isAsgMultiSelect}
                                    isAsgInstanceMultiselect={isAsgInstanceMultiSelect}
                                    isInstancesService={instancesService}
                                />
                            </div>
                        )}

                        {serviceFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Server className='h-4 w-4' />
                                    Servicio
                                </label>
                                <ServiceFilterComponent selectedServices={tempService} setSelectedServices={setTempService} />
                            </div>
                        )}
                    </div>

                    <div className='flex items-center gap-4'>
                        <Button onClick={applyFilters} className='flex items-center gap-2 bg-blue-700 cursor-pointer hover:bg-blue-500 text-white'>
                            <Filter />
                            Aplicar Filtros
                        </Button>
                        <Button onClick={clearFilters} className='flex items-center gap-2 bg-gray-500 cursor-pointer hover:bg-gray-400 text-white'>
                            <XCircle />
                            Limpiar Filtros
                        </Button>
                    </div>
                </CardContent>

                {/* {!canFetch ? (
                    <EmptyState text={asgFilter
                        ? 'Selecciona un Autoscaling Group o una instancia del ASG para continuar.'
                        : 'Selecciona una instancia para continuar.'
                    } />
                ) : (
                    <Component
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        instance={asgFilter ? (filters.asgInstance || filters.asg) : filters.instance}
                        region={filters.region}
                        selectedKey={filters.selectedKey}
                        selectedValue={filters.selectedValue}
                    />
                )} */}
                <Component
                    startDate={filters.startDate}
                    endDate={filters.endDate}
                    instance={asgFilter ? (filters.asgInstance || filters.asg) : filters.instance}
                    region={filters.region}
                    selectedKey={filters.selectedKey}
                    selectedValue={filters.selectedValue}
                    services={filters.service}
                />
            </Card>
        </div>
    );
};
