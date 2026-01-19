'use client'

import { useEffect, useState, useMemo } from 'react';
import { DatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RegionFilterComponent } from '@/components/general_azure/filters/RegionFilterComponent';
import { RegionFilterComponent as AwsRegionFilterComponent } from '@/components/general_aws/filters/RegionFilterComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Calendar,
    Filter,
    XCircle,
    SlidersHorizontal,
    ArrowDown,
    Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { MultiTenantSubscriptionsFilterComponent } from '@/components/general_comp_cloud/filters/MultiTenantSubscriptionsFilterComponent';
import { ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent';
import { MultiTenantTagsFilterComponent, TAG_CONSTANTS } from '@/components/general_comp_cloud/filters/MultiTenantTagsFilterComponent';
import { MultiTenantResourceGroupFilterComponent } from '@/components/general_comp_cloud/filters/MultiTenantResourceGroupFilterComponent';
import { MultiTenantServiceFilterComponent } from '@/components/general_comp_cloud/filters/MultiTenantServiceFilterComponent';
import { MultiTenantResourceFilterComponent } from '@/components/general_comp_cloud/filters/MultiTenantResourceFilterComponent';

export interface DynamicFilterProps {
    startDate: Date;
    endDate?: Date;
    region: string;
    subscriptions: Record<string, string>;
    resourceGroups: Record<string, string>;
    tagKeys: Record<string, string | null>;
    tagValues: Record<string, string | null>;
    resources: Record<string, string>;
    service: string;
    payload: ReqPayload;
}

interface FiltersComponentProps {
    Component: (params: DynamicFilterProps) => React.JSX.Element;
    dateFilter?: boolean;
    regionFilter?: boolean;
    subscriptionIdFilter?: boolean;
    isRegionMultiSelect?: boolean;
    tagsFilter?: boolean;
    resourceGroupFilter?: boolean;
    serviceFilter?: boolean;
    serviceType?: string;
    resourceFilter?: boolean;
    payload: ReqPayload;
}

const FilterSeparator = () => (
    <div className="relative flex items-center justify-center py-3 z-0">
        <div className="absolute inset-0 flex items-center justify-center">
            {/* <div className="h-full w-px border-l-2 border-dashed "></div> */}
        </div>
        <div className="relative z-10 flex items-center justify-center h-8 w-8 rounded-full  border  shadow-sm text-blue-600 transition-transform hover:scale-110">
            <ArrowDown className="h-4 w-4" />
        </div>
    </div>
);

const CascadeInfo = () => (
    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-full shrink-0">
                <Info className="h-4 w-4 text-blue-700" />
            </div>
            <div className="space-y-3 w-full">
                <h4 className="text-sm font-semibold text-blue-900">
                    Lógica de Dependencia de Filtros
                </h4>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs text-blue-700/80">
                    <div className="flex items-center gap-2  px-3 py-1.5 rounded shadow-sm border border-blue-100 w-full sm:w-auto">
                        <span className="font-bold text-blue-800">1.</span>
                        <span>Fecha y Región</span>
                    </div>

                    <ArrowDown className="h-4 w-4 hidden sm:block text-blue-300" />
                    <ArrowDown className="h-4 w-4 sm:hidden self-center text-blue-300" />

                    <div className="flex items-center gap-2  px-3 py-1.5 rounded shadow-sm border border-blue-100 w-full sm:w-auto">
                        <span className="font-bold text-blue-800">2.</span>
                        <span>Subs y Tags</span>
                    </div>

                    <ArrowDown className="h-4 w-4 hidden sm:block text-blue-300" />
                    <ArrowDown className="h-4 w-4 sm:hidden self-center text-blue-300" />

                    <div className="flex items-center gap-2  px-3 py-1.5 rounded shadow-sm border border-blue-100 w-full sm:w-auto">
                        <span className="font-bold text-blue-800">3.</span>
                        <span>Resource Groups</span>
                    </div>
                </div>
                <p className="text-[11px] text-blue-600 mt-1 italic">
                    * Los filtros superiores actualizan las opciones disponibles en los niveles inferiores.
                </p>
            </div>
        </div>
    </div>
);

export const FiltersComponent = ({
    Component,
    dateFilter = true,
    regionFilter = false,
    subscriptionIdFilter = false,
    isRegionMultiSelect = false,
    tagsFilter = false,
    resourceGroupFilter = false,
    serviceFilter = false,
    serviceType = '',
    resourceFilter = false,
    payload
}: FiltersComponentProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const getDefaultService = () => {
        const isAzure = payload.cloud_provider === 'Azure';
        const isAws = payload.cloud_provider === 'AWS';
        if (isAzure) {
            if (serviceType === 'storage') return '';
            if (serviceType === 'compute') return 'vm';
            return 'billing';
        }

        if (isAws) {
            if (serviceType === 'storage') return '';
            if (serviceType === 'compute') return 'ec2';
            return 'billing';
        }

        return '';
    };

    const getInitialFilters = () => {
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');
        const regionParam = searchParams.get('region');
        const serviceParam = searchParams.get('service') || getDefaultService();

        const tenants = payload.tenants || [];

        const initialSubs: Record<string, string> = {};
        const initialRGs: Record<string, string> = {};
        const initialTagKeys: Record<string, string> = {};
        const initialTagValues: Record<string, string> = {};
        const initialResources: Record<string, string> = {};

        tenants.forEach((id, index) => {
            initialSubs[id] = searchParams.get(`sub_${index}`) || '';
            initialRGs[id] = searchParams.get(`rg_${index}`) || '';
            initialTagKeys[id] = searchParams.get(`tagKey_${index}`) || TAG_CONSTANTS.DEFAULT_KEY;
            initialTagValues[id] = searchParams.get(`tagValue_${index}`) || TAG_CONSTANTS.DEFAULT_VALUE;
            initialResources[id] = searchParams.get(`resource_${index}`) || '';

        });

        const startDate = startDateParam ? new Date(startDateParam) : yesterday;
        const endDate = endDateParam ? new Date(endDateParam) : new Date();

        return {
            startDate,
            endDate,
            region: regionParam || 'all_regions',
            subscriptions: initialSubs,
            resourceGroups: initialRGs,
            tagKeys: initialTagKeys,
            tagValues: initialTagValues,
            service: serviceParam,
            resources: initialResources
        };
    };

    const [filters, setFilters] = useState(getInitialFilters);

    const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([filters.startDate, filters.endDate]);
    const [tempRegion, setTempRegion] = useState(filters.region);

    const [tempSubs, setTempSubs] = useState<Record<string, string>>(filters.subscriptions);
    const [tempRGs, setTempRGs] = useState<Record<string, string>>(filters.resourceGroups);
    const [tempTagKeys, setTempTagKeys] = useState<Record<string, string | null>>(filters.tagKeys);
    const [tempTagValues, setTempTagValues] = useState<Record<string, string | null>>(filters.tagValues);
    const [tempService, setTempService] = useState<Record<string, string>>(filters.service);
    const [tempResources, setTempResources] = useState<Record<string, string>>(filters.resources);

    useEffect(() => {
        const newFilters = getInitialFilters();
        setFilters(newFilters);
        setTempRange([newFilters.startDate, newFilters.endDate]);
        setTempRegion(newFilters.region);
        setTempSubs(newFilters.subscriptions);
        setTempRGs(newFilters.resourceGroups);
        setTempTagKeys(newFilters.tagKeys);
        setTempTagValues(newFilters.tagValues);
        setTempService(newFilters.service);
        setTempResources(newFilters.resources);
    }, [searchParams, payload]);

    const onChangeDate = (dates: [Date | null, Date | null]) => setTempRange(dates);
    const tempStartDate = useMemo(() => (tempRange[0] ?? filters.startDate), [tempRange, filters.startDate]);
    const tempEndDate = useMemo(() => (tempRange[1] ?? filters.endDate), [tempRange, filters.endDate]);

    const applyFilters = () => {
        const [start, end] = tempRange;
        if (!start || !end) return;

        const newFilters = {
            startDate: start,
            endDate: end,
            region: tempRegion,
            subscriptions: tempSubs,
            resourceGroups: tempRGs,
            tagKeys: tempTagKeys,
            tagValues: tempTagValues,
            service: tempService,
            resources: tempResources
        };

        setFilters(newFilters as unknown);

        const query = new URLSearchParams();
        query.set('startDate', newFilters.startDate.toISOString());
        query.set('endDate', newFilters.endDate.toISOString());
        if (regionFilter && newFilters.region !== 'all_regions') query.set('region', newFilters.region);
        query.set('service', newFilters.service);

        payload.tenants.forEach((id, index) => {
            if (subscriptionIdFilter && tempSubs[id]) query.set(`sub_${index}`, tempSubs[id]);
            if (resourceGroupFilter && tempRGs[id]) query.set(`rg_${index}`, tempRGs[id]);
            if (tagsFilter) {
                if (tempTagKeys[id] && !tempTagKeys[id]?.startsWith('allKeys')) query.set(`tagKey_${index}`, tempTagKeys[id] as string);
                if (tempTagValues[id] && !tempTagValues[id]?.startsWith('allValues')) query.set(`tagValue_${index}`, tempTagValues[id] as string);
            }
            if (resourceFilter && tempResources[id]) query.set(`resource_${index}`, tempResources[id]);
        });

        router.push(`${window.location.pathname}?${query.toString()}`,{ scroll: false });
    };

    const clearFilters = () => {
        const tenants = payload.tenants || [];
        const emptyMapString = tenants.reduce((acc, id) => ({ ...acc, [id]: '' }), {});
        const defaultTagsK = tenants.reduce((acc, id) => ({ ...acc, [id]: TAG_CONSTANTS.DEFAULT_KEY }), {});
        const defaultTagsV = tenants.reduce((acc, id) => ({ ...acc, [id]: TAG_CONSTANTS.DEFAULT_VALUE }), {});

        setTempRange([yesterday, new Date()]);
        setTempRegion('all_regions');
        setTempSubs(emptyMapString);
        setTempRGs(emptyMapString);
        setTempTagKeys(defaultTagsK);
        setTempTagValues(defaultTagsV);
        setTempResources(emptyMapString);
        setTempService(getDefaultService());

        router.push(window.location.pathname,{ scroll: false });
    };

    return (
        <div className='space-y-8'>
            <Card className="w-full min-w-0 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
                            <SlidersHorizontal className="h-4 w-4" />
                            Configuración del Reporte
                        </CardTitle>
                    </div>
                </CardHeader>

                <CardContent className='p-6'>
                    <div className="space-y-0">
                        <div className="relative border rounded-lg p-5 shadow-sm z-[5] ">
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                                {dateFilter && (
                                    <div className='space-y-2'>
                                        <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                            <Calendar className='h-4 w-4 text-gray-400' />
                                            Período
                                        </label>
                                        <DatePicker
                                            selected={tempRange[0]}
                                            onChange={onChangeDate}
                                            startDate={tempRange[0]}
                                            endDate={tempRange[1]}
                                            selectsRange
                                            className='w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm'
                                        />
                                    </div>
                                )}
                                {regionFilter && payload.cloud_provider === 'AWS' && (
                                    <div className='space-y-1.5 flex flex-col'>
                                        <label className='text-sm font-medium text-gray-600'>Región de Nube</label>
                                        <AwsRegionFilterComponent
                                            selectedRegion={tempRegion}
                                            setSelectedRegion={setTempRegion}
                                            isRegionMultiSelect={isRegionMultiSelect}
                                        />
                                    </div>
                                )}
                                {
                                    serviceFilter && (
                                        <div className='space-y-1.5 flex flex-col'>
                                            <label className='text-sm font-medium text-gray-600'>Servicios</label>
                                            <MultiTenantServiceFilterComponent
                                                service={tempService}
                                                setService={setTempService}
                                                serviceType={serviceType}
                                                payload={payload}
                                            />
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                        {subscriptionIdFilter && payload.cloud_provider === 'Azure' && (
                            <>
                                <FilterSeparator />
                                <div className="border rounded-lg p-5 shadow-sm ">
                                    <div className="grid grid-cols-1 gap-6">
                                        {subscriptionIdFilter && (
                                            <div className='space-y-2'>
                                                <label className='text-xs font-medium text-gray-600 flex items-center gap-2'>
                                                    Suscripciones
                                                </label>
                                                <MultiTenantSubscriptionsFilterComponent
                                                    subscriptionsMap={tempSubs}
                                                    setSubscriptionsMap={setTempSubs}
                                                    startDate={tempStartDate}
                                                    endDate={tempEndDate}
                                                    payload={payload}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                        {regionFilter && payload.cloud_provider === 'Azure' && (
                            <>
                                <FilterSeparator />
                                <div className="border rounded-lg p-5 shadow-sm ">
                                    <div className='space-y-2'>
                                        <label className='text-xs font-medium text-gray-600 flex items-center gap-2'>
                                            Región
                                        </label>
                                        <RegionFilterComponent
                                            selectedRegion={tempRegion}
                                            setSelectedRegion={setTempRegion}
                                            isRegionMultiSelect={isRegionMultiSelect}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        {
                            tagsFilter && (
                                <>
                                    <FilterSeparator />
                                    <div className="border rounded-lg p-5 shadow-sm ">
                                        <div className='space-y-2'>
                                            <label className='text-xs font-medium text-gray-600 flex items-center gap-2'>
                                                Tags
                                            </label>
                                            <MultiTenantTagsFilterComponent
                                                keysMap={tempTagKeys}
                                                setKeysMap={setTempTagKeys}
                                                valuesMap={tempTagValues}
                                                setValuesMap={setTempTagValues}
                                                subscriptionsMap={tempSubs}
                                                startDate={tempStartDate}
                                                endDate={tempEndDate}
                                                region={tempRegion}
                                                service={tempService}
                                                payload={payload}
                                            />
                                        </div>
                                    </div>
                                </>
                            )
                        }

                        {resourceGroupFilter && payload.cloud_provider === 'Azure' && (
                            <>
                                <FilterSeparator />
                                <div className="border rounded-lg p-5 shadow-sm ">
                                    <div className='space-y-2'>
                                        <label className='text-xs font-medium text-gray-600 flex items-center gap-2'>
                                            Grupos de Recursos
                                        </label>
                                        <MultiTenantResourceGroupFilterComponent
                                            resourceGroupsMap={tempRGs}
                                            setResourceGroupsMap={setTempRGs}
                                            startDate={tempStartDate}
                                            endDate={tempEndDate}
                                            tagKeysMap={tempTagKeys}
                                            tagValuesMap={tempTagValues}
                                            service={tempService}
                                            payload={payload}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {serviceFilter && resourceFilter && (
                            <>
                                <FilterSeparator />
                                <div className="border rounded-lg p-5 shadow-sm ">
                                    <div className='space-y-2'>
                                        <label className='text-xs font-medium text-gray-600 flex items-center gap-2'>
                                            Recursos
                                        </label>
                                        <MultiTenantResourceFilterComponent
                                            resourceGroupsMap={tempRGs}
                                            setResourceGroupsMap={setTempRGs}
                                            startDate={tempStartDate}
                                            endDate={tempEndDate}
                                            service={tempService}
                                            resourcesMap={tempResources}
                                            setResourcesMap={setTempResources}
                                            payload={payload}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className='flex items-center gap-4 mt-8 pt-4 border-t'>
                        <Button onClick={applyFilters} className='flex items-center gap-2 bg-blue-700 cursor-pointer hover:bg-blue-600 text-white shadow-md transition-all'>
                            <Filter className="h-4 w-4" />
                            Aplicar Filtros
                        </Button>
                        <Button onClick={clearFilters} variant="outline" className='flex items-center gap-2 hover:bg-gray-50 text-gray-700'>
                            <XCircle className="h-4 w-4" />
                            Limpiar
                        </Button>
                    </div>
                </CardContent>

                <div className='p-6'>
                    <Component
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        region={filters.region}
                        subscriptions={filters.subscriptions}
                        resourceGroups={filters.resourceGroups}
                        tagKeys={filters.tagKeys}
                        tagValues={filters.tagValues}
                        service={filters.service}
                        resources={filters.resources}
                        payload={payload}
                    />
                </div>
            </Card>
        </div >
    );
};