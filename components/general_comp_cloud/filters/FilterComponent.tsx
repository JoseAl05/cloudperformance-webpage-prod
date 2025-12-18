// 'use client'

// import { useEffect, useState, useMemo } from 'react';
// import { DatePicker } from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { RegionFilterComponent } from '@/components/general_azure/filters/RegionFilterComponent';
// import { Card, CardContent } from '@/components/ui/card';
// import { Calendar, Filter, MapPin, XCircle, Cloud, Tag } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { MultiTenantSubscriptionsFilterComponent } from '@/components/general_comp_cloud/filters/MultiTenantSubscriptionsFilterComponent';
// import { ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent';
// import { MultiTenantTagsFilterComponent, TAG_DEFAULTS } from '@/components/general_comp_cloud/filters/MultiTenantTagsFilterComponent';
// import { MultiTenantResourceGroupFilterComponent } from '@/components/general_comp_cloud/filters/MultiTenantResourceGroupFilterComponent';

// interface FiltersComponentProps {
//     Component: (params: {
//         startDate: Date;
//         endDate?: Date;
//         region: string;
//         subscription: string;
//         tagsA: { key: string | null, value: string | null };
//         tagsB: { key: string | null, value: string | null };
//         resourceGroupA: string;
//         resourceGroupB: string;
//     }) => React.JSX.Element;
//     dateFilter?: boolean;
//     regionFilter?: boolean;
//     subscriptionIdFilter?: boolean;
//     isRegionMultiSelect?: boolean;
//     tagsFilter?: boolean;
//     resourceGroupFilter?: boolean;
//     payload: ReqPayload;
// }


// export const FiltersComponent = ({
//     Component,
//     dateFilter = true,
//     regionFilter = false,
//     subscriptionIdFilter = false,
//     isRegionMultiSelect = false,
//     tagsFilter = false,
//     resourceGroupFilter = false,
//     payload
// }: FiltersComponentProps) => {
//     const router = useRouter();
//     const searchParams = useSearchParams();

//     const yesterday = new Date();
//     yesterday.setDate(yesterday.getDate() - 1);

//     const monthYearToRange = (y: number, m1to12: number) => {
//         const monthIdx = Math.max(1, Math.min(12, m1to12)) - 1;
//         const start = new Date(y, monthIdx, 1, 0, 0, 0, 0);
//         const end = new Date(y, monthIdx + 1, 0, 23, 59, 59, 999);
//         return [start, end] as const;
//     };

//     const getInitialFilters = () => {
//         const startDateParam = searchParams.get('startDate');
//         const endDateParam = searchParams.get('endDate');
//         const regionParam = searchParams.get('region');
//         const subscriptionAParam = searchParams.get('subscriptionA');
//         const subscriptionBParam = searchParams.get('subscriptionB');
//         const selectedKeyAParam = searchParams.get('selectedKeyA');
//         const selectedKeyBParam = searchParams.get('selectedKeyB');
//         const selectedValueAParam = searchParams.get('selectedValueA');
//         const selectedValueBParam = searchParams.get('selectedValueB');
//         const resourceGroupAParam = searchParams.get('resourceGroupA');
//         const resourceGroupBParam = searchParams.get('resourceGroupB');

//         const startDate = startDateParam ? new Date(startDateParam) : yesterday;
//         const endDate = endDateParam ? new Date(endDateParam) : new Date();


//         return {
//             startDate,
//             endDate,
//             region: regionParam || 'all_regions',
//             subscriptionA: subscriptionAParam || '',
//             subscriptionB: subscriptionBParam || '',
//             tagKeyA: selectedKeyAParam || TAG_DEFAULTS.ALL_KEYS_A,
//             tagKeyB: selectedKeyBParam || TAG_DEFAULTS.ALL_KEYS_B,
//             tagValueA: selectedValueAParam || TAG_DEFAULTS.ALL_VALUES_A,
//             tagValueB: selectedValueBParam || TAG_DEFAULTS.ALL_VALUES_B,
//             resourceGroupA: resourceGroupAParam || '',
//             resourceGroupB: resourceGroupBParam || ''
//         };
//     };

//     const [filters, setFilters] = useState(getInitialFilters);
//     const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([filters.startDate, filters.endDate]);
//     const [tempRegion, setTempRegion] = useState(filters.region);
//     const [tempSubscriptionA, setTempSubscriptionA] = useState(filters.subscriptionA);
//     const [tempSubscriptionB, setTempSubscriptionB] = useState(filters.subscriptionB);
//     const [tempSelectedKeyA, setTempSelectedKeyA] = useState<string | null>(filters.tagKeyA);
//     const [tempSelectedValueA, setTempSelectedValueA] = useState<string | null>(filters.tagValueA);
//     const [tempSelectedKeyB, setTempSelectedKeyB] = useState<string | null>(filters.tagKeyB);
//     const [tempSelectedValueB, setTempSelectedValueB] = useState<string | null>(filters.tagValueB);
//     const [tempResourceGroupA, setTempResourceGroupA] = useState<string>(filters.resourceGroupAParam);
//     const [tempResourceGroupB, setTempResourceGroupB] = useState<string>(filters.resourceGroupBParam);

//     useEffect(() => {
//         const newFilters = getInitialFilters();
//         setFilters(newFilters);
//         setTempRange([newFilters.startDate, newFilters.endDate]);
//         setTempRegion(newFilters.region);
//         setTempSubscriptionA(newFilters.subscriptionA);
//         setTempSubscriptionB(newFilters.subscriptionB);
//         setTempSelectedKeyA(newFilters.tagKeyA);
//         setTempSelectedKeyB(newFilters.tagKeyB);
//         setTempSelectedValueA(newFilters.tagValueA);
//         setTempSelectedValueB(newFilters.tagValueB);
//         setTempResourceGroupA(newFilters.resourceGroupAParam);
//         setTempResourceGroupB(newFilters.resourceGroupBParam);
//     }, [searchParams]);

//     const onChange = (dates: [Date | null, Date | null]) => setTempRange(dates);

//     const tempStartDate = useMemo(() => (tempRange[0] ?? filters.startDate), [tempRange, filters.startDate]);
//     const tempEndDate = useMemo(() => (tempRange[1] ?? filters.endDate), [tempRange, filters.endDate]);

//     const applyFilters = () => {
//         const [start, end] = tempRange;


//         if (!start || !end) return;

//         const newFilters = {
//             startDate: start,
//             endDate: end,
//             region: tempRegion,
//             subscriptionA: tempSubscriptionA,
//             subscriptionB: tempSubscriptionB,
//             tagKeyA: tempSelectedKeyA,
//             tagKeyB: tempSelectedKeyB,
//             tagValueA: tempSelectedValueA,
//             tagValueB: tempSelectedValueB,
//             resourceGroupA: tempResourceGroupA,
//             resourceGroupB: tempResourceGroupB
//         };

//         setFilters(newFilters as unknown);

//         const query = new URLSearchParams();
//         query.set('startDate', newFilters.startDate.toISOString());
//         query.set('endDate', newFilters.endDate.toISOString());

//         const filterConfigs = [
//             // Estructura: { flag: boolean, key: string, value: unknown, ignoreValue?: string }
//             { flag: regionFilter, key: 'region', value: newFilters.region, ignoreValue: 'all_regions' },
//             { flag: subscriptionIdFilter, key: 'subscriptionA', value: newFilters.subscriptionA },
//             { flag: subscriptionIdFilter, key: 'subscriptionB', value: newFilters.subscriptionB },
//             { flag: tagsFilter, key: 'selectedKeyA', value: newFilters.tagKeyA },
//             { flag: tagsFilter, key: 'selectedKeyB', value: newFilters.tagKeyB },
//             { flag: tagsFilter, key: 'selectedValueA', value: newFilters.tagValueA },
//             { flag: tagsFilter, key: 'selectedValueB', value: newFilters.tagValueB },
//             { flag: resourceGroupFilter, key: 'resourceGroupA', value: newFilters.resourceGroupA },
//             { flag: resourceGroupFilter, key: 'resourceGroupB', value: newFilters.resourceGroupB }

//         ];
//         filterConfigs.forEach(({ flag, key, value, ignoreValue }) => {
//             if (flag && value !== null && value !== undefined && value !== '' && value !== ignoreValue) {
//                 query.set(key, String(value));
//             }
//         });

//         router.push(`${window.location.pathname}?${query.toString()}`);
//     };

//     const clearFilters = () => {
//         const defaultFilters = {
//             startDate: yesterday,
//             endDate: new Date(),
//             region: 'all_regions',
//             subscriptionA: '',
//             subscriptionB: '',
//             tagKeyA: TAG_DEFAULTS.ALL_KEYS_A,
//             tagKeyB: TAG_DEFAULTS.ALL_KEYS_B,
//             tagValueA: TAG_DEFAULTS.ALL_VALUES_A,
//             tagValueB: TAG_DEFAULTS.ALL_VALUES_B,
//             resourceGroupA: '',
//             resourceGroupB: ''
//         };

//         setFilters(defaultFilters as unknown);
//         setTempRange([defaultFilters.startDate, defaultFilters.endDate]);
//         setTempRegion(defaultFilters.region);
//         setTempSubscriptionA(defaultFilters.subscriptionA);
//         setTempSubscriptionB(defaultFilters.subscriptionB);
//         setTempSelectedKeyA(defaultFilters.tagKeyA);
//         setTempSelectedKeyB(defaultFilters.tagKeyB);
//         setTempSelectedValueA(defaultFilters.tagValueA);
//         setTempSelectedValueB(defaultFilters.tagValueB);
//         setTempResourceGroupA(defaultFilters.resourceGroupA);
//         setTempResourceGroupB(defaultFilters.resourceGroupB);

//         router.push(window.location.pathname);
//     };

//     return (
//         <div className='space-y-6'>
//             <Card className="w-full min-w-0 overflow-hidden">
//                 <CardContent className='space-y-6'>
//                     <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
//                         {dateFilter && (
//                             <div className='space-y-2'>
//                                 <label className='text-sm font-medium text-foreground flex items-center gap-2'>
//                                     <Calendar className='h-4 w-4' />
//                                     Periodo
//                                 </label>
//                                 <DatePicker
//                                     selected={tempRange[0]}
//                                     onChange={onChange}
//                                     startDate={tempRange[0]}
//                                     endDate={tempRange[1]}
//                                     selectsRange
//                                     className='w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent'
//                                 />
//                             </div>
//                         )}



//                         {regionFilter && (
//                             <div className='space-y-2'>
//                                 <label className='text-sm font-medium text-foreground flex items-center gap-2'>
//                                     <MapPin className='h-4 w-4' />
//                                     Región
//                                 </label>
//                                 <RegionFilterComponent
//                                     selectedRegion={tempRegion}
//                                     setSelectedRegion={setTempRegion}
//                                     isRegionMultiSelect={isRegionMultiSelect}
//                                 />
//                             </div>
//                         )}


//                         {subscriptionIdFilter && (
//                             <div className='space-y-2'>
//                                 <label className='text-sm font-medium text-foreground flex items-center gap-2'>
//                                     <Cloud className='h-4 w-4' />
//                                     Suscripción
//                                 </label>
//                                 <MultiTenantSubscriptionsFilterComponent
//                                     subscriptionA={tempSubscriptionA}
//                                     setSubscriptionA={setTempSubscriptionA}
//                                     subscriptionB={tempSubscriptionB}
//                                     setSubscriptionB={setTempSubscriptionB}
//                                     startDate={tempStartDate}
//                                     endDate={tempEndDate}
//                                     payload={payload}
//                                 />
//                             </div>
//                         )}
//                         {
//                             tagsFilter && (
//                                 <div className='space-y-2'>
//                                     <label className='text-sm font-medium text-foreground flex items-center gap-2'>
//                                         <Cloud className='h-4 w-4' />
//                                         Tags
//                                     </label>
//                                     <MultiTenantTagsFilterComponent
//                                         selectedKeyA={tempSelectedKeyA}
//                                         setSelectedKeyA={setTempSelectedKeyA}
//                                         selectedValueA={tempSelectedValueA}
//                                         setSelectedValueA={setTempSelectedValueA}
//                                         selectedKeyB={tempSelectedKeyB}
//                                         setSelectedKeyB={setTempSelectedKeyB}
//                                         selectedValueB={tempSelectedValueB}
//                                         setSelectedValueB={setTempSelectedValueB}
//                                         startDate={tempStartDate}
//                                         endDate={tempEndDate}
//                                         region={tempRegion}
//                                         subscriptionA={tempSubscriptionA}
//                                         subscriptionB={tempSubscriptionB}
//                                         payload={payload}
//                                     />
//                                 </div>
//                             )
//                         }
//                         {
//                             resourceGroupFilter && (
//                                 <div className='space-y-2'>
//                                     <label className='text-sm font-medium text-foreground flex items-center gap-2'>
//                                         <Cloud className='h-4 w-4' />
//                                         Grupos de recursos
//                                     </label>
//                                     <MultiTenantResourceGroupFilterComponent
//                                         startDate={tempStartDate}
//                                         endDate={tempEndDate}
//                                         resourceGroupA={tempResourceGroupA}
//                                         resourceGroupB={tempResourceGroupB}
//                                         setResourceGroupA={setTempResourceGroupA}
//                                         setResourceGroupB={setTempResourceGroupB}
//                                         region={tempRegion}
//                                         tagKeyA={tempSelectedKeyA}
//                                         tagKeyB={tempSelectedKeyB}
//                                         tagValueA={tempSelectedValueA}
//                                         tagValueB={tempSelectedValueB}
//                                         payload={payload}
//                                     />
//                                 </div>
//                             )
//                         }


//                     </div>

//                     <div className='flex items-center gap-4'>
//                         <Button onClick={applyFilters} className='flex items-center gap-2 bg-blue-700 cursor-pointer hover:bg-blue-500 text-white'>
//                             <Filter />
//                             Aplicar Filtros
//                         </Button>
//                         <Button onClick={clearFilters} className='flex items-center gap-2 bg-gray-500 cursor-pointer hover:bg-gray-400 text-white'>
//                             <XCircle />
//                             Limpiar Filtros
//                         </Button>
//                     </div>
//                 </CardContent>

//                 <Component
//                     startDate={filters.startDate}
//                     endDate={filters.endDate}
//                     region={filters.region}
//                     subscriptionA={filters.subscriptionA}
//                     subscriptionB={filters.subscriptionB}
//                     tagKeyA={filters.tagKeyA}
//                     tagKeyB={filters.tagKeyB}
//                     tagValueA={filters.tagValueA}
//                     tagValueB={filters.tagValueB}
//                     resourceGroupA={filters.resourceGroupA}
//                     resourceGroupB={filters.resourceGroupB}
//                     payload={payload}
//                 />
//             </Card>
//         </div>
//     );
// };
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

// ... (Interfaces DynamicFilterProps y ChildComponentProps se mantienen igual)
export interface DynamicFilterProps {
    startDate: Date;
    endDate?: Date;
    region: string;
    subscriptions: Record<string, string>;
    resourceGroups: Record<string, string>;
    tagKeys: Record<string, string | null>;
    tagValues: Record<string, string | null>;
    payload: ReqPayload;
}

interface ChildComponentProps {
    startDate: Date;
    endDate?: Date;
    region: string;
    subscriptionA: string;
    subscriptionB: string;
    tagKeyA: string | null;
    tagValueA: string | null;
    tagKeyB: string | null;
    tagValueB: string | null;
    resourceGroupA: string;
    resourceGroupB: string;
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
    payload: ReqPayload;
}

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
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded shadow-sm border border-blue-100 w-full sm:w-auto">
                        <span className="font-bold text-blue-800">1.</span>
                        <span>Fecha y Región</span>
                    </div>

                    <ArrowDown className="h-4 w-4 hidden sm:block text-blue-300" />
                    <ArrowDown className="h-4 w-4 sm:hidden self-center text-blue-300" />

                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded shadow-sm border border-blue-100 w-full sm:w-auto">
                        <span className="font-bold text-blue-800">2.</span>
                        <span>Subs y Tags</span>
                    </div>

                    <ArrowDown className="h-4 w-4 hidden sm:block text-blue-300" />
                    <ArrowDown className="h-4 w-4 sm:hidden self-center text-blue-300" />

                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded shadow-sm border border-blue-100 w-full sm:w-auto">
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
    payload
}: FiltersComponentProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const getInitialFilters = () => {
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');
        const regionParam = searchParams.get('region');

        const tenants = payload.tenants || [];

        const initialSubs: Record<string, string> = {};
        const initialRGs: Record<string, string> = {};
        const initialTagKeys: Record<string, string> = {};
        const initialTagValues: Record<string, string> = {};

        tenants.forEach((id, index) => {
            initialSubs[id] = searchParams.get(`sub_${index}`) || '';
            initialRGs[id] = searchParams.get(`rg_${index}`) || '';
            initialTagKeys[id] = searchParams.get(`tagKey_${index}`) || TAG_CONSTANTS.DEFAULT_KEY;
            initialTagValues[id] = searchParams.get(`tagValue_${index}`) || TAG_CONSTANTS.DEFAULT_VALUE;
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
            tagValues: initialTagValues
        };
    };

    const [filters, setFilters] = useState(getInitialFilters);

    const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([filters.startDate, filters.endDate]);
    const [tempRegion, setTempRegion] = useState(filters.region);

    const [tempSubs, setTempSubs] = useState<Record<string, string>>(filters.subscriptions);
    const [tempRGs, setTempRGs] = useState<Record<string, string>>(filters.resourceGroups);
    const [tempTagKeys, setTempTagKeys] = useState<Record<string, string | null>>(filters.tagKeys);
    const [tempTagValues, setTempTagValues] = useState<Record<string, string | null>>(filters.tagValues);

    useEffect(() => {
        const newFilters = getInitialFilters();
        setFilters(newFilters);
        setTempRange([newFilters.startDate, newFilters.endDate]);
        setTempRegion(newFilters.region);
        setTempSubs(newFilters.subscriptions);
        setTempRGs(newFilters.resourceGroups);
        setTempTagKeys(newFilters.tagKeys);
        setTempTagValues(newFilters.tagValues);
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
            tagValues: tempTagValues
        };

        setFilters(newFilters as unknown);

        const query = new URLSearchParams();
        query.set('startDate', newFilters.startDate.toISOString());
        query.set('endDate', newFilters.endDate.toISOString());
        if (regionFilter && newFilters.region !== 'all_regions') query.set('region', newFilters.region);

        payload.tenants.forEach((id, index) => {
            if (subscriptionIdFilter && tempSubs[id]) query.set(`sub_${index}`, tempSubs[id]);
            if (resourceGroupFilter && tempRGs[id]) query.set(`rg_${index}`, tempRGs[id]);
            if (tagsFilter) {
                if (tempTagKeys[id] && !tempTagKeys[id]?.startsWith('allKeys')) query.set(`tagKey_${index}`, tempTagKeys[id] as string);
                if (tempTagValues[id] && !tempTagValues[id]?.startsWith('allValues')) query.set(`tagValue_${index}`, tempTagValues[id] as string);
            }
        });

        router.push(`${window.location.pathname}?${query.toString()}`);
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

        router.push(window.location.pathname);
    };

    console.log(payload)

    return (
        <div className='space-y-8'>
            <Card className="w-full min-w-0 overflow-visible shadow-sm border-gray-200">
                <CardHeader className="pb-4 border-b bg-gray-50/50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
                            <SlidersHorizontal className="h-4 w-4" />
                            Configuración del Reporte
                        </CardTitle>
                    </div>
                </CardHeader>

                <CardContent className='p-6'>
                    {/* <CascadeInfo /> */}
                    <div className="space-y-0">

                        <div className="relative border border-gray-200 rounded-lg p-5 bg-white shadow-sm z-50">
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
                                {regionFilter && payload.cloud_provider === 'Azure' && (
                                    <div className='space-y-1.5'>
                                        <label className='text-sm font-medium text-gray-600'>Región de Nube</label>
                                        <RegionFilterComponent
                                            selectedRegion={tempRegion}
                                            setSelectedRegion={setTempRegion}
                                            isRegionMultiSelect={isRegionMultiSelect}
                                        />
                                    </div>
                                )}
                                {regionFilter && payload.cloud_provider === 'AWS' && (
                                    <div className='space-y-1.5'>
                                        <label className='text-sm font-medium text-gray-600'>Región de Nube</label>
                                        <AwsRegionFilterComponent
                                            selectedRegion={tempRegion}
                                            setSelectedRegion={setTempRegion}
                                            isRegionMultiSelect={isRegionMultiSelect}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {(subscriptionIdFilter || tagsFilter) && (
                            <div className="flex justify-center -my-3 relative z-0">
                                <div className="h-8 border-l-2 border-dashed border-gray-300"></div>
                            </div>
                        )}

                        {(subscriptionIdFilter || tagsFilter) && payload.cloud_provider === 'Azure' && (
                            <>
                                <div className="relative z-40">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full border border-gray-200 text-gray-400">
                                        <ArrowDown className="h-4 w-4" />
                                    </div>

                                    <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
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

                                            {tagsFilter && payload.cloud_provider === 'Azure' && (
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
                                                        payload={payload}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {resourceGroupFilter && (
                            <div className="flex justify-center -my-3 relative z-0">
                                <div className="h-8 border-l-2 border-dashed border-gray-300"></div>
                            </div>
                        )}

                        {resourceGroupFilter && payload.cloud_provider === 'Azure' && (
                            <div className="relative z-30">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full border border-gray-200 text-gray-400">
                                    <ArrowDown className="h-4 w-4" />
                                </div>

                                <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
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
                                            payload={payload}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='flex items-center gap-4 mt-8 pt-4 border-t border-gray-100'>
                        <Button onClick={applyFilters} className='flex items-center gap-2 bg-blue-700 cursor-pointer hover:bg-blue-600 text-white shadow-md transition-all'>
                            <Filter className="h-4 w-4" />
                            Aplicar Filtros
                        </Button>
                        <Button onClick={clearFilters} variant="outline" className='flex items-center gap-2 border-gray-300 hover:bg-gray-50 text-gray-700'>
                            <XCircle className="h-4 w-4" />
                            Limpiar
                        </Button>
                    </div>
                </CardContent>

                <div className='bg-gray-50 p-6'>
                    <Component
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        region={filters.region}
                        subscriptions={filters.subscriptions}
                        resourceGroups={filters.resourceGroups}
                        tagKeys={filters.tagKeys}
                        tagValues={filters.tagValues}
                        payload={payload}
                    />
                </div>
            </Card>
        </div>
    );
};