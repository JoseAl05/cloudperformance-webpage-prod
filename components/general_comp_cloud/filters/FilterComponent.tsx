'use client'

import { useEffect, useState, useMemo } from 'react';
import { DatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RegionFilterComponent } from '@/components/general_azure/filters/RegionFilterComponent';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Filter, MapPin, XCircle, Cloud, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { MultiTenantSubscriptionsFilterComponent } from '@/components/general_comp_cloud/filters/MultiTenantSubscriptionsFilterComponent';
import { AuditPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent';
import { MultiTenantTagsFilterComponent, TAG_DEFAULTS } from '@/components/general_comp_cloud/filters/MultiTenantTagsFilterComponent';
import { MultiTenantResourceGroupFilterComponent } from '@/components/general_comp_cloud/filters/MultiTenantResourceGroupFilterComponent';

interface FiltersComponentProps {
    Component: (params: {
        startDate: Date;
        endDate?: Date;
        region: string;
        subscription: string;
        tagsA: { key: string | null, value: string | null };
        tagsB: { key: string | null, value: string | null };
        resourceGroupA: string;
        resourceGroupB: string;
    }) => React.JSX.Element;
    dateFilter?: boolean;
    regionFilter?: boolean;
    subscriptionIdFilter?: boolean;
    isRegionMultiSelect?: boolean;
    tagsFilter?: boolean;
    resourceGroupFilter?: boolean;
    payload: AuditPayload;
}


export const FiltersComponent = ({
    Component,
    dateFilter = true,
    regionFilter = false,
    subscriptionIdFilter = false,
    isRegionMultiSelect = false,
    tagsFilter = false,
    resourceGroupFilter = false,
    payload
}: FiltersComponentProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const monthYearToRange = (y: number, m1to12: number) => {
        const monthIdx = Math.max(1, Math.min(12, m1to12)) - 1;
        const start = new Date(y, monthIdx, 1, 0, 0, 0, 0);
        const end = new Date(y, monthIdx + 1, 0, 23, 59, 59, 999);
        return [start, end] as const;
    };

    const getInitialFilters = () => {
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');
        const regionParam = searchParams.get('region');
        const subscriptionAParam = searchParams.get('subscriptionA');
        const subscriptionBParam = searchParams.get('subscriptionB');
        const selectedKeyAParam = searchParams.get('selectedKeyA');
        const selectedKeyBParam = searchParams.get('selectedKeyB');
        const selectedValueAParam = searchParams.get('selectedValueA');
        const selectedValueBParam = searchParams.get('selectedValueB');
        const resourceGroupAParam = searchParams.get('resourceGroupA');
        const resourceGroupBParam = searchParams.get('resourceGroupB');

        const startDate = startDateParam ? new Date(startDateParam) : yesterday;
        const endDate = endDateParam ? new Date(endDateParam) : new Date();


        return {
            startDate,
            endDate,
            region: regionParam || 'all_regions',
            subscriptionA: subscriptionAParam || '',
            subscriptionB: subscriptionBParam || '',
            tagKeyA: selectedKeyAParam || TAG_DEFAULTS.ALL_KEYS_A,
            tagKeyB: selectedKeyBParam || TAG_DEFAULTS.ALL_KEYS_B,
            tagValueA: selectedValueAParam || TAG_DEFAULTS.ALL_VALUES_A,
            tagValueB: selectedValueBParam || TAG_DEFAULTS.ALL_VALUES_B,
            resourceGroupA: resourceGroupAParam || '',
            resourceGroupB: resourceGroupBParam || ''
        };
    };

    const [filters, setFilters] = useState(getInitialFilters);
    const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([filters.startDate, filters.endDate]);
    const [tempRegion, setTempRegion] = useState(filters.region);
    const [tempSubscriptionA, setTempSubscriptionA] = useState(filters.subscriptionA);
    const [tempSubscriptionB, setTempSubscriptionB] = useState(filters.subscriptionB);
    const [tempSelectedKeyA, setTempSelectedKeyA] = useState<string | null>(filters.tagKeyA);
    const [tempSelectedValueA, setTempSelectedValueA] = useState<string | null>(filters.tagValueA);
    const [tempSelectedKeyB, setTempSelectedKeyB] = useState<string | null>(filters.tagKeyB);
    const [tempSelectedValueB, setTempSelectedValueB] = useState<string | null>(filters.tagValueB);
    const [tempResourceGroupA, setTempResourceGroupA] = useState<string>(filters.resourceGroupAParam);
    const [tempResourceGroupB, setTempResourceGroupB] = useState<string>(filters.resourceGroupBParam);

    useEffect(() => {
        const newFilters = getInitialFilters();
        setFilters(newFilters);
        setTempRange([newFilters.startDate, newFilters.endDate]);
        setTempRegion(newFilters.region);
        setTempSubscriptionA(newFilters.subscriptionA);
        setTempSubscriptionB(newFilters.subscriptionB);
        setTempSelectedKeyA(newFilters.tagKeyA);
        setTempSelectedKeyB(newFilters.tagKeyB);
        setTempSelectedValueA(newFilters.tagValueA);
        setTempSelectedValueB(newFilters.tagValueB);
        setTempResourceGroupA(newFilters.resourceGroupAParam);
        setTempResourceGroupB(newFilters.resourceGroupBParam);
    }, [searchParams]);

    const onChange = (dates: [Date | null, Date | null]) => setTempRange(dates);

    const tempStartDate = useMemo(() => (tempRange[0] ?? filters.startDate), [tempRange, filters.startDate]);
    const tempEndDate = useMemo(() => (tempRange[1] ?? filters.endDate), [tempRange, filters.endDate]);

    const applyFilters = () => {
        const [start, end] = tempRange;


        if (!start || !end) return;

        const newFilters = {
            startDate: start,
            endDate: end,
            region: tempRegion,
            subscriptionA: tempSubscriptionA,
            subscriptionB: tempSubscriptionB,
            tagKeyA: tempSelectedKeyA,
            tagKeyB: tempSelectedKeyB,
            tagValueA: tempSelectedValueA,
            tagValueB: tempSelectedValueB,
            resourceGroupA: tempResourceGroupA,
            resourceGroupB: tempResourceGroupB
        };

        setFilters(newFilters as unknown);

        const query = new URLSearchParams();
        query.set('startDate', newFilters.startDate.toISOString());
        query.set('endDate', newFilters.endDate.toISOString());

        const filterConfigs = [
            // Estructura: { flag: boolean, key: string, value: any, ignoreValue?: string }
            { flag: regionFilter, key: 'region', value: newFilters.region, ignoreValue: 'all_regions' },
            { flag: subscriptionIdFilter, key: 'subscriptionA', value: newFilters.subscriptionA },
            { flag: subscriptionIdFilter, key: 'subscriptionB', value: newFilters.subscriptionB },
            { flag: tagsFilter, key: 'selectedKeyA', value: newFilters.tagKeyA },
            { flag: tagsFilter, key: 'selectedKeyB', value: newFilters.tagKeyB },
            { flag: tagsFilter, key: 'selectedValueA', value: newFilters.tagValueA },
            { flag: tagsFilter, key: 'selectedValueB', value: newFilters.tagValueB },
            { flag: resourceGroupFilter, key: 'resourceGroupA', value: newFilters.resourceGroupA },
            { flag: resourceGroupFilter, key: 'resourceGroupB', value: newFilters.resourceGroupB }

        ];
        filterConfigs.forEach(({ flag, key, value, ignoreValue }) => {
            if (flag && value !== null && value !== undefined && value !== '' && value !== ignoreValue) {
                query.set(key, String(value));
            }
        });

        router.push(`${window.location.pathname}?${query.toString()}`);
    };

    const clearFilters = () => {
        const defaultFilters = {
            startDate: yesterday,
            endDate: new Date(),
            region: 'all_regions',
            subscriptionA: '',
            subscriptionB: '',
            tagKeyA: TAG_DEFAULTS.ALL_KEYS_A,
            tagKeyB: TAG_DEFAULTS.ALL_KEYS_B,
            tagValueA: TAG_DEFAULTS.ALL_VALUES_A,
            tagValueB: TAG_DEFAULTS.ALL_VALUES_B,
            resourceGroupA: '',
            resourceGroupB: ''
        };

        setFilters(defaultFilters as unknown);
        setTempRange([defaultFilters.startDate, defaultFilters.endDate]);
        setTempRegion(defaultFilters.region);
        setTempSubscriptionA(defaultFilters.subscriptionA);
        setTempSubscriptionB(defaultFilters.subscriptionB);
        setTempSelectedKeyA(defaultFilters.tagKeyA);
        setTempSelectedKeyB(defaultFilters.tagKeyB);
        setTempSelectedValueA(defaultFilters.tagValueA);
        setTempSelectedValueB(defaultFilters.tagValueB);
        setTempResourceGroupA(defaultFilters.resourceGroupA);
        setTempResourceGroupB(defaultFilters.resourceGroupB);

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
                                    Periodo
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


                        {subscriptionIdFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Cloud className='h-4 w-4' />
                                    Suscripción
                                </label>
                                <MultiTenantSubscriptionsFilterComponent
                                    subscriptionA={tempSubscriptionA}
                                    setSubscriptionA={setTempSubscriptionA}
                                    subscriptionB={tempSubscriptionB}
                                    setSubscriptionB={setTempSubscriptionB}
                                    startDate={tempStartDate}
                                    endDate={tempEndDate}
                                    payload={payload}
                                />
                            </div>
                        )}
                        {
                            tagsFilter && (
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                        <Cloud className='h-4 w-4' />
                                        Tags
                                    </label>
                                    <MultiTenantTagsFilterComponent
                                        selectedKeyA={tempSelectedKeyA}
                                        setSelectedKeyA={setTempSelectedKeyA}
                                        selectedValueA={tempSelectedValueA}
                                        setSelectedValueA={setTempSelectedValueA}
                                        selectedKeyB={tempSelectedKeyB}
                                        setSelectedKeyB={setTempSelectedKeyB}
                                        selectedValueB={tempSelectedValueB}
                                        setSelectedValueB={setTempSelectedValueB}
                                        startDate={tempStartDate}
                                        endDate={tempEndDate}
                                        region={tempRegion}
                                        subscriptionA={tempSubscriptionA}
                                        subscriptionB={tempSubscriptionB}
                                        payload={payload}
                                    />
                                </div>
                            )
                        }
                        {
                            resourceGroupFilter && (
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                        <Cloud className='h-4 w-4' />
                                        Grupos de recursos
                                    </label>
                                    <MultiTenantResourceGroupFilterComponent
                                        startDate={tempStartDate}
                                        endDate={tempEndDate}
                                        resourceGroupA={tempResourceGroupA}
                                        resourceGroupB={tempResourceGroupB}
                                        setResourceGroupA={setTempResourceGroupA}
                                        setResourceGroupB={setTempResourceGroupB}
                                        region={tempRegion}
                                        tagKeyA={tempSelectedKeyA}
                                        tagKeyB={tempSelectedKeyB}
                                        tagValueA={tempSelectedValueA}
                                        tagValueB={tempSelectedValueB}
                                        payload={payload}
                                    />
                                </div>
                            )
                        }


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
                    subscriptionA={filters.subscriptionA}
                    subscriptionB={filters.subscriptionB}
                    tagKeyA={filters.tagKeyA}
                    tagKeyB={filters.tagKeyB}
                    tagValueA={filters.tagValueA}
                    tagValueB={filters.tagValueB}
                    resourceGroupA={filters.resourceGroupA}
                    resourceGroupB={filters.resourceGroupB}
                    payload={payload}
                />
            </Card>
        </div>
    );
};