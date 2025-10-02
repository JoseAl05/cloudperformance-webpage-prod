'use client'

import { useEffect, useState, useMemo } from 'react';
import { DatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { RegionFilterComponent } from '@/components/general_azure/filters/RegionFilterComponent';
import { SubscriptionsFilterComponent } from '@/components/general_azure/filters/SubscriptionsFilterComponent';
import { TagsFilterComponent } from '@/components/general_azure/filters/TagsFilterComponent';
import { MetricsFilterComponent } from '@/components/general_azure/filters/MetricsFilterComponent';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Filter, MapPin, XCircle, Cloud, Tag, Activity, Layers, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { SubscriptionsFilterComponentV2 } from '@/components/general_azure/filters/SubscriptionsFilterComponentV2';
import { ResourceTypesFilterComponent } from '@/components/general_azure/filters/ResourceTypesFilterComponent';
import { InstancesFilterComponent } from '@/components/general/filters/InstancesFilterComponent';

interface FiltersComponentProps {
    Component: (params: {
        startDate: Date;
        endDate?: Date;
        region: string;
        subscription: string;
        selectedTagKey: string | null;
        selectedTagValue: string | null;
        selectedMetric: string;
    }) => React.JSX.Element;
    dateFilter?: boolean;
    regionFilter?: boolean;
    subscriptionFilter?: boolean;
    subscriptionIdFilter?: boolean;
    tagsFilter?: boolean;
    tagsCollection?: string;
    tagsColumnName?: string;
    tagsRegionField?: string;
    tagsSubscriptionField?: string;
    isRegionMultiSelect?: boolean;
    metricsFilter?: boolean;
    metricsCollection?: string;
    resourceTypeFilter?: boolean;
    instancesFilter?: boolean;
}

export const FiltersComponent = ({
    Component,
    dateFilter = true,
    regionFilter = false,
    subscriptionFilter = false,
    subscriptionIdFilter = false,
    tagsFilter = false,
    tagsCollection = '',
    tagsColumnName = 'tags',
    tagsRegionField = 'location',
    tagsSubscriptionField = 'subscription_id',
    isRegionMultiSelect = false,
    metricsFilter = false,
    metricsCollection = '',
    resourceTypeFilter = false,
    instancesFilter = false
}: FiltersComponentProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const getInitialFilters = () => {
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');
        const regionParam = searchParams.get('region');
        const subscriptionParam = searchParams.get('subscription');
        const selectedTagKeyParam = searchParams.get('tagKey');
        const selectedTagValueParam = searchParams.get('tagValue');
        const selectedMetricParam = searchParams.get('metric');
        const selectedResourceTypeParam = searchParams.get('resourceType');
        const selectedMeterCategoryParam = searchParams.get('meterCategory');
        const selectedInstanceParam = searchParams.get('instance');

        const startDate = startDateParam ? new Date(startDateParam) : yesterday;
        const endDate = endDateParam ? new Date(endDateParam) : new Date();

        return {
            startDate,
            endDate,
            region: regionParam || 'all_regions',
            subscription: subscriptionParam || 'all_subscriptions',
            selectedTagKey: selectedTagKeyParam || null,
            selectedTagValue: selectedTagValueParam || null,
            selectedMetric: selectedMetricParam || '',
            selectedResourceType: selectedResourceTypeParam || '',
            selectedMeterCategory: selectedMeterCategoryParam || null,
            selectedInstance: selectedInstanceParam || null
        };
    };

    const [filters, setFilters] = useState(getInitialFilters);
    const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([filters.startDate, filters.endDate]);
    const [tempRegion, setTempRegion] = useState(filters.region);
    const [tempSubscription, setTempSubscription] = useState(filters.subscription);
    const [tempTagKey, setTempTagKey] = useState<string | null>(filters.selectedTagKey);
    const [tempTagValue, setTempTagValue] = useState<string | null>(filters.selectedTagValue);
    const [tempMetric, setTempMetric] = useState<string>(filters.selectedMetric);
    const [tempResourceType, setTempResourceType] = useState<string>(filters.selectedResourceType);
    const [tempMeterCategory, setTempMeterCategory] = useState<string | null>(filters.selectedMeterCategory);
    const [tempInstance, setTempInstance] = useState<string | null>(filters.selectedInstance);

    useEffect(() => {
        const newFilters = getInitialFilters();
        setFilters(newFilters);
        setTempRange([newFilters.startDate, newFilters.endDate]);
        setTempRegion(newFilters.region);
        setTempSubscription(newFilters.subscription);
        setTempTagKey(newFilters.selectedTagKey);
        setTempTagValue(newFilters.selectedTagValue);
        setTempMetric(newFilters.selectedMetric);
        setTempResourceType(newFilters.selectedResourceType);
        setTempMeterCategory(newFilters.selectedMeterCategory);
        setTempInstance(newFilters.selectedInstance);
    }, [searchParams]);

    const onChange = (dates: [Date | null, Date | null]) => setTempRange(dates);

    const applyFilters = () => {
        const [start, end] = tempRange;

        if (!start || !end) return;

        const newFilters = {
            startDate: start,
            endDate: end,
            region: tempRegion,
            subscription: tempSubscription,
            selectedTagKey: tempTagKey,
            selectedTagValue: tempTagValue,
            selectedMetric: tempMetric,
            selectedResourceType: tempResourceType,
            selectedMeterCategory: tempMeterCategory,
            selectedInstance: tempInstance,
        };

        setFilters(newFilters);

        const query = new URLSearchParams();
        query.set('startDate', newFilters.startDate.toISOString());
        query.set('endDate', newFilters.endDate.toISOString());

        if (newFilters.region && newFilters.region !== 'all_regions') {
            query.set('region', newFilters.region);
        }

        if (newFilters.subscription && newFilters.subscription !== 'all_subscriptions') {
            query.set('subscription', newFilters.subscription);
        }

        if (newFilters.selectedTagKey) {
            query.set('tagKey', newFilters.selectedTagKey);
        }

        if (newFilters.selectedTagValue) {
            query.set('tagValue', newFilters.selectedTagValue);
        }

        if (newFilters.selectedMetric) {
            query.set('metric', newFilters.selectedMetric);
        }
        if (newFilters.selectedResourceType) {
            query.set('resourceType', newFilters.selectedResourceType);
        }
        if (newFilters.selectedMeterCategory) {
            query.set('meterCategory', newFilters.selectedMeterCategory);
        }
        if (newFilters.selectedInstance) {
            query.set('instance', newFilters.selectedInstance);
        }

        router.push(`${window.location.pathname}?${query.toString()}`);
    };

    const clearFilters = () => {
        const defaultFilters = {
            startDate: yesterday,
            endDate: new Date(),
            region: 'all_regions',
            subscription: 'all_subscriptions',
            selectedTagKey: null,
            selectedTagValue: null,
            selectedMetric: '',
            selectedResourceType: '',
            selectedMeterCategory: null,
            selectedInstance: null,
        };

        setFilters(defaultFilters);
        setTempRange([defaultFilters.startDate, defaultFilters.endDate]);
        setTempRegion(defaultFilters.region);
        setTempSubscription(defaultFilters.subscription);
        setTempTagKey(defaultFilters.selectedTagKey);
        setTempTagValue(defaultFilters.selectedTagValue);
        setTempMetric(defaultFilters.selectedMetric);
        setTempResourceType(defaultFilters.selectedResourceType);
        setTempMeterCategory(defaultFilters.selectedMeterCategory);
        setTempInstance(defaultFilters.selectedInstance);

        router.push(window.location.pathname);
    };

    return (
        <div className='space-y-6'>
            <Card className="w-full min-w-0 overflow-hidden">
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

                        {subscriptionFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Cloud className='h-4 w-4' />
                                    Suscripción
                                </label>
                                <SubscriptionsFilterComponent
                                    subscription={tempSubscription}
                                    setSubscription={setTempSubscription}
                                />
                            </div>
                        )}
                        {subscriptionIdFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Cloud className='h-4 w-4' />
                                    Suscripción
                                </label>
                                <SubscriptionsFilterComponentV2
                                    subscription={tempSubscription}
                                    setSubscription={setTempSubscription}
                                />
                            </div>
                        )}

                        {tagsFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Tag className='h-4 w-4' />
                                    Tags
                                </label>
                                <TagsFilterComponent
                                    startDate={tempRange[0] ?? filters.startDate}
                                    endDate={tempRange[1] ?? filters.endDate}
                                    region={tempRegion}
                                    subscription={tempSubscription}
                                    collection={tagsCollection}
                                    tagColumnName={tagsColumnName}
                                    regionField={tagsRegionField}
                                    subscriptionField={tagsSubscriptionField}
                                    selectedKey={tempTagKey}
                                    selectedValue={tempTagValue}
                                    setSelectedKey={setTempTagKey}
                                    setSelectedValue={setTempTagValue}
                                />
                            </div>
                        )}

                        {metricsFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Activity className='h-4 w-4' />
                                    Métricas
                                </label>
                                <MetricsFilterComponent
                                    startDate={tempRange[0] ?? filters.startDate}
                                    endDate={tempRange[1] ?? filters.endDate}
                                    collection={metricsCollection}
                                    metric={tempMetric}
                                    setMetric={setTempMetric}
                                />
                            </div>
                        )}
                        {instancesFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Server className='h-4 w-4' />
                                    Instancias
                                </label>
                                <InstancesFilterComponent
                                    startDate={tempRange[0] ?? filters.startDate}
                                    endDate={tempRange[1] ?? filters.endDate}
                                    region={tempRegion}
                                    subscription={tempSubscription}
                                    selectedTagKey={tempTagKey}
                                    selectedTagValue={tempTagValue}
                                    selectedMeterCategory={tempMeterCategory}
                                    selectedInstance={tempInstance}
                                    setSelectedMeterCategory={setTempMeterCategory}
                                    setSelectedInstance={setTempInstance}
                                />
                            </div>
                        )}
                        {resourceTypeFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Layers className='h-4 w-4' />
                                    Tipo de Recurso
                                </label>
                                <ResourceTypesFilterComponent
                                    selectedResourceType={tempResourceType}
                                    setSelectedResourceType={setTempResourceType}
                                />
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

                <Component
                    startDate={filters.startDate}
                    endDate={filters.endDate}
                    region={filters.region}
                    subscription={filters.subscription}
                    selectedTagKey={filters.selectedTagKey}
                    selectedTagValue={filters.selectedTagValue}
                    selectedMetric={filters.selectedMetric}
                    selectedResourceType={filters.selectedResourceType}
                    selectedMeterCategory={filters.selectedMeterCategory}
                    selectedInstance={filters.selectedInstance}
                />
            </Card>
        </div>
    );
};