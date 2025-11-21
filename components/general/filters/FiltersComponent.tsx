'use client'

import { useEffect, useState, useMemo } from 'react';
import { DatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { RegionFilterComponent } from '@/components/general/filters/RegionFilterComponent';
import { TagFilterComponent } from '@/components/general/filters/TagsFilterComponent';
import { ServiceFilterComponent } from '@/components/general/filters/ServiceFilterComponent';
import { VariationServiceFilterComponent } from '@/components/general/filters/VariationServiceFilterComponent';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Filter, MapPin, Server, Tag, XCircle, Ban, Box, Activity, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { InstancesFilterComponent } from '@/components/general/filters/InstancesFilterComponent';
import { AsgFilterComponent } from '@/components/general/filters/AsgFilterComponent';
import { EksFilterComponent } from '@/components/general/filters/EksFilterComponent';
import { S3BucketFilter } from '@/components/general/filters/S3FilterComponent';
import { EbsFilterComponent } from '@/components/general/filters/EbsFilterComponent';
import { EventsTypeFilterComponent } from '@/components/general/filters/EventsTypeFilterComponent';
import { AdvisorCategoriesFilterComponent } from '@/components/general/filters/AdvisorCategoriesFilterComponent';
import { AdvisorStatusFilterComponent } from '@/components/general/filters/AdvisorStatusFilterComponent';
import { VariationMetricFilterComponent } from '@/components/general/filters/VariationMetricFilterComponent';
import { EC2MetricFilterComponent } from '@/components/general/filters/Ec2MetricLabelFilterComponent';
import { RDSMetricFilterComponent } from '@/components/general/filters/RdsMetricFilterComponent';
import { AutoScalingGroupFilterComponent } from '@/components/general/filters/Ec2AutoscalingGroupsFilterComponent';
import { MetricsFilterComponent } from '@/components/general/filters/MetricsFilterComponent';
import { MetricsRDSFilterComponent } from '@/components/general/filters/MetricsRDSFilterComponent';
import { VariationResourcesFilterComponent } from '@/components/general/filters/VariationResourcesFilterComponent';

interface FiltersComponentProps {
    Component: (params: {
        startDate: Date;
        endDate?: Date;
        instance: string;
        region: string;
        selectedKey?: string | null;
        selectedValue?: string | null;
        services?: string;
        buckets?: string;
        ebs?: string;
        eventType?: string;
        advisorCategory?: string;
        advisorStatus?: string;
        variationMetric?: string;
        variationService?: string;
        metric?: string;
        metrics?: string;
        variationResource?: string;
        month?: number | null;
        year?: number | null;
        eksAsgInstance?: string;
    }) => React.JSX.Element;
    dateFilter?: boolean;
    regionFilter?: boolean;
    isRegionMultiSelect?: boolean;
    instancesFilter?: boolean;
    instancesService?: string;
    asgFilter?: boolean;
    eksFilter?: boolean;
    s3Filter?: boolean;
    ebsFilter?: boolean;
    eventsTypesFilter?: boolean;
    advisorCategoriesFilter?: boolean;
    advisorStatusFilter?: boolean;
    autoScalingGroupFilter?: boolean;
    metricFilter?: boolean;
    metricsFilter?: boolean;
    isMetricsMultiselect?: boolean;
    rdsFilter?: boolean;
    engine?: string;
    metricsRDSFilter?: boolean;
    isAdvisorCategoryMultiselect?: boolean;
    isAdvisorStatusMultiselect?: boolean;
    isEventsTypesMultiselect?: boolean;
    isAsgMultiSelect?: boolean;
    isEksMultiSelect?: boolean;
    isEksAsgMultiSelect?: boolean;
    isEksAsgInstanceMultiSelect?: boolean;
    isAsgInstanceMultiSelect?: boolean;
    isInstanceMultiSelect?: boolean;
    isEbsMultiselect?: boolean;
    isViewUnused?: boolean;
    isViewResource?: boolean;
    tagsFilter?: boolean;
    serviceFilter?: boolean;
    collection?: string | null;
    tagColumnName?: string | null;
    variationServiceFilter?: boolean;
    variationMetricFilter?: boolean;
    variationResourceFilter?: boolean;
}

export const FiltersComponent = ({
    Component,
    dateFilter = true,
    regionFilter = false,
    isRegionMultiSelect = false,
    instancesFilter = false,
    instancesService,
    asgFilter = false,
    eksFilter = false,
    s3Filter = false,
    ebsFilter = false,
    eventsTypesFilter = false,
    advisorCategoriesFilter = false,
    advisorStatusFilter = false,
    autoScalingGroupFilter = false,
    metricFilter = false,
    metricsFilter = false,
    isMetricsMultiselect = false,
    rdsFilter = false,
    engine,
    metricsRDSFilter = false,
    isAdvisorCategoryMultiselect = false,
    isAdvisorStatusMultiselect = false,
    isEventsTypesMultiselect = false,
    isEbsMultiselect = false,
    isInstanceMultiSelect = false,
    isAsgMultiSelect = false,
    isEksMultiSelect = false,
    isEksAsgMultiSelect = false,
    isAsgInstanceMultiSelect = false,
    isEksAsgInstanceMultiSelect = false,
    isViewResource = false,
    tagsFilter = false,
    serviceFilter = false,
    collection = null,
    tagColumnName = null,
    variationServiceFilter = false,
    variationMetricFilter = false,
    variationResourceFilter = false,
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
        const monthParam = searchParams.get('month');
        const yearParam = searchParams.get('year');
        const instanceParam = searchParams.get('instance');
        const asgParam = searchParams.get('asg');
        const eksParam = searchParams.get('eks');
        const eksAsgParam = searchParams.get('eksAsg');
        const eksAsgInstanceParam = searchParams.get('eksAsgInstance');
        const asgInstanceParam = searchParams.get('asgInstance');
        const regionParam = searchParams.get('region');
        const selectedKeyParam = searchParams.get('selectedKey');
        const selectedValueParam = searchParams.get('selectedValue');
        const selectedServiceParam = searchParams.get('services');
        const s3BucketParam = searchParams.get('s3Bucket');
        const ebsParam = searchParams.get('ebs');
        const eventsTypesParam = searchParams.get('eventsTypes');
        const advisorCategoryParam = searchParams.get('advisorCategory');
        const advisorStatusParam = searchParams.get('advisorStatus');
        const variationServiceParam = searchParams.get('variationService');
        const variationMetricParam = searchParams.get('variationMetric');
        const metricParam = searchParams.get('metric');
        const autoScalingGroupParam = searchParams.get('autoScalingGroup');
        const selectedMetricsParam = searchParams.get('metrics');
        const selectedMetricsRDSParam = searchParams.get('metricsRDS');
        const variationResourceParam = searchParams.get('variationResource');

        let startDate = startDateParam ? new Date(startDateParam) : yesterday;
        let endDate = endDateParam ? new Date(endDateParam) : new Date();
        const now = new Date();
        let month: number = now.getMonth() + 1;
        let year: number = now.getFullYear();

        if (variationServiceFilter && monthParam && yearParam) {
            const m = Number(monthParam);
            const y = Number(yearParam);
            if (!Number.isNaN(m) && !Number.isNaN(y) && y >= 1970) {
                const [s, e] = monthYearToRange(y, m);
                startDate = s;
                endDate = e;
                month = m;
                year = y;
            }
        }

        return {
            startDate,
            endDate,
            month: variationServiceFilter ? month : null,
            year: variationServiceFilter ? year : null,
            instance: instanceParam || '',
            asg: asgParam || '',
            asgInstance: asgInstanceParam || '',
            eks: eksParam || '',
            eksAsg: eksAsgParam || '',
            eksAsgInstance: eksAsgInstanceParam || '',
            instanceService: instancesService || null,
            region: regionParam || 'all_regions',
            selectedKey: selectedKeyParam || null,
            selectedValue: selectedValueParam || null,
            service: selectedServiceParam || '',
            s3Bucket: s3BucketParam || '',
            ebs: ebsParam || '',
            eventsTypes: eventsTypesParam || '',
            advisorCategory: advisorCategoryParam || '',
            advisorStatus: advisorStatusParam || '',
            variationService: variationServiceParam || '',
            variationMetric: variationMetricParam || '',
            metric: metricParam || '',
            autoScalingGroup: autoScalingGroupParam || '',
            engine: engine || '',
            metrics: selectedMetricsParam || '',
            metricsRDS: selectedMetricsRDSParam || '',
            variationResource: variationResourceParam || ''
        };
    };

    const [filters, setFilters] = useState(getInitialFilters);
    const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([filters.startDate, filters.endDate]);
    const [tempMonth, setTempMonth] = useState<number | null>(filters.month ?? null);
    const [tempYear, setTempYear] = useState<number | null>(filters.year ?? null);
    const [tempMonthYearDate, setTempMonthYearDate] = useState<Date | null>(
        filters.month && filters.year ? new Date(filters.year, (filters.month - 1), 1) : null
    );

    const [tempInstance, setTempInstance] = useState(filters.instance);
    const [tempAsg, setTempAsg] = useState(filters.asg);
    const [tempEks, setTempEks] = useState(filters.eks);
    const [tempEksAsg, setTempEksAsg] = useState(filters.eksAsg);
    const [tempEksAsgInstance, setTempEksAsgInstance] = useState(filters.eksAsgInstance);
    const [tempAsgInstance, setTempAsgInstance] = useState(filters.asgInstance);
    const [tempInstanceService, setTempInstanceService] = useState(filters.instanceService);
    const [tempRegion, setTempRegion] = useState(filters.region);
    const [tempKey, setTempKey] = useState<string | null>(filters.selectedKey);
    const [tempValue, setTempValue] = useState<string | null>(filters.selectedValue);
    const [tagsData, setTagsData] = useState<unknown[]>([]); // Se mantiene para compatibilidad con el componente de tags
    const [tempService, setTempService] = useState(filters.service);
    const [tempS3Bucket, setTempS3Bucket] = useState(filters.s3Bucket);
    const [tempEbs, setTempEbs] = useState(filters.ebs);
    const [tempEventsTypes, setTempEventsTypes] = useState(filters.eventsTypes);
    const [tempAdvisorCategory, setTempAdvisorCategory] = useState(filters.advisorCategory);
    const [tempAdvisorStatus, setTempAdvisorStatus] = useState(filters.advisorStatus);
    const [tempVariationService, setTempVariationService] = useState(filters.variationService);
    const [tempVariationMetric, setTempVariationMetric] = useState(filters.variationMetric);
    const [tempMetric, setTempMetric] = useState(filters.metric);
    const [tempAutoScalingGroup, setTempAutoScalingGroup] = useState(filters.autoScalingGroup);
    const [tempEngine, setTempEngine] = useState(filters.engine);
    const [tempMetrics, setTempMetrics] = useState(filters.metrics);
    const [tempMetricsRDS, setTempMetricsRDS] = useState(filters.metricsRDS);
    const [tempVariationResource, setTempVariationResource] = useState(filters.variationResource);

    useEffect(() => {
        const newFilters = getInitialFilters();
        setFilters(newFilters);
        setTempRange([newFilters.startDate, newFilters.endDate]);
        setTempInstance(newFilters.instance);
        setTempAsg(newFilters.asg);
        setTempEks(newFilters.eks);
        setTempEksAsg(newFilters.eksAsg);
        setTempEksAsgInstance(newFilters.eksAsgInstance);
        setTempAsgInstance(newFilters.asgInstance);
        setTempInstanceService(newFilters.instanceService);
        setTempRegion(newFilters.region);
        setTempKey(newFilters.selectedKey);
        setTempValue(newFilters.selectedValue);
        setTempService(newFilters.service);
        setTempS3Bucket(newFilters.s3Bucket);
        setTempEbs(newFilters.ebs);
        setTempEventsTypes(newFilters.eventsTypes);
        setTempAdvisorCategory(newFilters.advisorCategory);
        setTempAdvisorStatus(newFilters.advisorStatus);
        setTempVariationService(newFilters.variationService);
        setTempVariationMetric(newFilters.variationMetric);
        setTempMetric(newFilters.metric);
        setTempAutoScalingGroup(newFilters.autoScalingGroup);
        setTempEngine(newFilters.engine);
        setTempMetrics(newFilters.metrics);
        setTempMetricsRDS(newFilters.metricsRDS);

        setTempMonth(newFilters.month ?? null);
        setTempYear(newFilters.year ?? null);
        setTempMonthYearDate(
            newFilters.month && newFilters.year ? new Date(newFilters.year, newFilters.month - 1, 1) : null
        );
        setTempVariationResource(newFilters.variationResource);
    }, [searchParams]);

    const getRDSService = (): 'postgresql' | 'oracle' | 'mysql' | 'sqlserver' | 'mariadb' => {
        if (instancesService?.includes('oracle')) return 'oracle';
        if (instancesService?.includes('mysql')) return 'mysql';
        if (instancesService?.includes('sqlserver')) return 'sqlserver';
        if (instancesService?.includes('mariadb')) return 'mariadb';
        return 'postgresql';
    };

    const onChange = (dates: [Date | null, Date | null]) => setTempRange(dates);

    const tempStartDate = useMemo(() => (tempRange[0] ?? filters.startDate), [tempRange, filters.startDate]);
    const tempEndDate = useMemo(() => (tempRange[1] ?? filters.endDate), [tempRange, filters.endDate]);

    // Handle Tag Change logic replicated but updating temp state instead of immediate push
    const handleTagChange = (nextKey: string | null, nextValue: string | null) => {
        setTempKey(nextKey);
        setTempValue(nextValue);
        // Cuando cambian los tags, se suelen resetear las instancias seleccionadas
        setTempInstance('');
        setTempAsg('');
        setTempAsgInstance('');
        setTempEks('');
        setTempEksAsg('');
        setTempEksAsgInstance('');
    };

    const applyFilters = () => {
        let [start, end] = tempRange;

        if (variationServiceFilter) {
            const base = tempMonthYearDate ?? new Date();
            const m = tempMonth ?? (base.getMonth() + 1);
            const y = tempYear ?? base.getFullYear();
            const [s, e] = monthYearToRange(y, m);
            start = s;
            end = e;
        }

        if (!start || !end) return;

        const newFilters = {
            startDate: start,
            endDate: end,
            month: variationServiceFilter ? (tempMonth ?? (tempMonthYearDate ? tempMonthYearDate.getMonth() + 1 : null)) : null,
            year: variationServiceFilter ? (tempYear ?? (tempMonthYearDate ? tempMonthYearDate.getFullYear() : null)) : null,
            instance: tempAsg ? tempAsgInstance : tempInstance,
            asg: tempAsg,
            eks: tempEks,
            eksAsg: tempEksAsg,
            eksAsgInstance: tempEksAsgInstance,
            asgInstance: tempAsgInstance,
            instanceService: tempInstanceService,
            region: tempRegion,
            selectedKey: tempKey,
            selectedValue: tempValue,
            service: tempService,
            s3Bucket: tempS3Bucket,
            ebs: tempEbs,
            eventsTypes: tempEventsTypes,
            advisorCategory: tempAdvisorCategory,
            advisorStatus: tempAdvisorStatus,
            variationService: tempVariationService,
            variationMetric: tempVariationMetric,
            metric: tempMetric,
            autoScalingGroup: tempAutoScalingGroup,
            engine: tempEngine,
            metrics: tempMetrics,
            metricsRDS: tempMetricsRDS,
            variationResource: tempVariationResource,
        };

        setFilters(newFilters as unknown);

        const query = new URLSearchParams();
        query.set('startDate', newFilters.startDate.toISOString());
        query.set('endDate', newFilters.endDate.toISOString());

        if (variationServiceFilter) {
            if (newFilters.month) query.set('month', String(newFilters.month));
            if (newFilters.year) query.set('year', String(newFilters.year));
        }

        const filterConfigs = [
            // Estructura: { flag: boolean, key: string, value: any, ignoreValue?: string }
            { flag: regionFilter, key: 'region', value: newFilters.region, ignoreValue: 'all_regions' },
            { flag: instancesFilter || asgFilter, key: 'selectedKey', value: newFilters.selectedKey },
            { flag: instancesFilter || asgFilter, key: 'selectedValue', value: newFilters.selectedValue },

            // Instances & ASG
            { flag: asgFilter, key: 'asg', value: newFilters.asg },
            { flag: asgFilter, key: 'asgInstance', value: newFilters.asgInstance },
            { flag: instancesFilter && !newFilters.asg, key: 'instance', value: newFilters.instance },
            { flag: instancesFilter, key: 'instanceService', value: newFilters.instanceService },
            { flag: autoScalingGroupFilter, key: 'autoScalingGroup', value: newFilters.autoScalingGroup },

            // EKS
            { flag: eksFilter, key: 'eks', value: newFilters.eks },
            { flag: eksFilter, key: 'eksAsg', value: newFilters.eksAsg },
            { flag: eksFilter, key: 'eksAsgInstance', value: newFilters.eksAsgInstance },

            // Services & Variation
            { flag: serviceFilter, key: 'services', value: newFilters.service },
            { flag: variationServiceFilter, key: 'variationService', value: newFilters.variationService },
            { flag: variationMetricFilter, key: 'variationMetric', value: newFilters.variationMetric },
            { flag: variationResourceFilter, key: 'variationResource', value: newFilters.variationResource },

            // Storage & Events
            { flag: s3Filter, key: 's3Bucket', value: newFilters.s3Bucket },
            { flag: ebsFilter, key: 'ebs', value: newFilters.ebs },
            { flag: eventsTypesFilter, key: 'eventsTypes', value: newFilters.eventsTypes },

            // Advisor
            { flag: advisorCategoriesFilter, key: 'advisorCategory', value: newFilters.advisorCategory },
            { flag: advisorStatusFilter, key: 'advisorStatus', value: newFilters.advisorStatus },

            // Metrics
            { flag: metricFilter, key: 'metric', value: newFilters.metric },
            { flag: metricsFilter, key: 'metrics', value: newFilters.metrics },
            { flag: metricsRDSFilter, key: 'metricsRDS', value: newFilters.metricsRDS },
            { flag: rdsFilter, key: 'engine', value: newFilters.engine },
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
            month: null as number | null,
            year: null as number | null,
            instance: '',
            asg: '',
            eks: '',
            eksAsg: '',
            eksAsgInstance: '',
            asgInstance: '',
            instancesService: null as unknown,
            region: 'all_regions',
            selectedKey: null as string | null,
            selectedValue: null as string | null,
            service: '',
            s3Bucket: '',
            ebs: '',
            eventsTypes: '',
            advisorCategory: '',
            advisorStatus: '',
            variationService: '',
            variationMetric: '',
            metric: '',
            autoScalingGroup: '',
            engine: '',
            metrics: '',
            metricsRDS: '',
            variationResource: '',
        };

        setFilters({ ...defaultFilters, instanceService: defaultFilters.instancesService }); // Adjust type mismatch

        // Reset Temp State
        setTempRange([defaultFilters.startDate, defaultFilters.endDate]);
        setTempMonth(defaultFilters.month);
        setTempYear(defaultFilters.year);
        setTempMonthYearDate(null);
        setTempInstance(defaultFilters.instance);
        setTempAsg(defaultFilters.asg);
        setTempEks(defaultFilters.eks);
        setTempEksAsg(defaultFilters.eksAsg);
        setTempEksAsgInstance(defaultFilters.eksAsgInstance);
        setTempAsgInstance(defaultFilters.asgInstance);
        setTempInstanceService(defaultFilters.instancesService);
        setTempRegion(defaultFilters.region);
        setTempKey(defaultFilters.selectedKey);
        setTempValue(defaultFilters.selectedValue);
        setTempService(defaultFilters.service);
        setTempS3Bucket(defaultFilters.s3Bucket);
        setTempEbs(defaultFilters.ebs);
        setTempEventsTypes(defaultFilters.eventsTypes);
        setTempAdvisorCategory(defaultFilters.advisorCategory);
        setTempAdvisorStatus(defaultFilters.advisorStatus);
        setTempVariationService(defaultFilters.variationService);
        setTempVariationMetric(defaultFilters.variationMetric);
        setTempMetric(defaultFilters.metric);
        setTempAutoScalingGroup(defaultFilters.autoScalingGroup);
        setTempEngine(defaultFilters.engine);
        setTempMetrics(defaultFilters.metrics);
        setTempMetricsRDS(defaultFilters.metricsRDS);
        setTempVariationResource(defaultFilters.variationResource);

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

                                {variationServiceFilter ? (
                                    <DatePicker
                                        selected={tempMonthYearDate}
                                        onChange={(d: Date | null) => {
                                            setTempMonthYearDate(d);
                                            if (d) {
                                                const m = d.getMonth() + 1;
                                                const y = d.getFullYear();
                                                setTempMonth(m);
                                                setTempYear(y);
                                                const [s, e] = monthYearToRange(y, m);
                                                setTempRange([s, e]);
                                            } else {
                                                setTempMonth(null);
                                                setTempYear(null);
                                                setTempRange([null, null]);
                                            }
                                        }}
                                        dateFormat="MMMM yyyy"
                                        showMonthYearPicker
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        placeholderText="Selecciona mes y año"
                                        className='w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent'
                                    />
                                ) : (
                                    <DatePicker
                                        selected={tempRange[0]}
                                        onChange={onChange}
                                        startDate={tempRange[0]}
                                        endDate={tempRange[1]}
                                        selectsRange
                                        className='w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent'
                                    />
                                )}
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

                        {variationServiceFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Server className='h-4 w-4' />
                                    Servicio
                                </label>
                                <VariationServiceFilterComponent
                                    selectedService={tempVariationService}
                                    setSelectedService={setTempVariationService}
                                />
                            </div>
                        )}

                        {variationMetricFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <MapPin className='h-4 w-4' />
                                    Metrica
                                </label>
                                <VariationMetricFilterComponent
                                    startDate={tempStartDate}
                                    endDate={tempEndDate}
                                    region={tempRegion}
                                    selectedService={tempVariationService}
                                    selectedMetric={tempVariationMetric}
                                    setSelectedMetric={setTempVariationMetric}
                                    selectedResource={tempVariationResource}
                                    setSelectedResource={setTempVariationResource}
                                    isAsgMultiSelect={false}
                                />
                            </div>
                        )}
                        {variationResourceFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <MapPin className='h-4 w-4' />
                                    Recurso
                                </label>
                                <VariationResourcesFilterComponent
                                    startDate={tempStartDate}
                                    endDate={tempEndDate}
                                    region={tempRegion}
                                    service={tempVariationService}
                                    metric={tempVariationMetric}
                                    resource={tempVariationResource}
                                    setResource={setTempVariationResource}
                                    isResourceMultiSelect={false}
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
                                    isViewResource={isViewResource}
                                />
                            </div>
                        )}

                        {eksFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Server className='h-4 w-4' />
                                    Cluster EKS
                                </label>
                                <EksFilterComponent
                                    eks={tempEks}
                                    eksAsg={tempEksAsg}
                                    eksAsgInstance={tempEksAsgInstance}
                                    setEks={setTempEks}
                                    setEksAsg={setTempEksAsg}
                                    setEksAsgInstance={setTempEksAsgInstance}
                                    startDate={tempStartDate}
                                    endDate={tempEndDate}
                                    region={tempRegion}
                                    selectedKey={tempKey ?? ''}
                                    selectedValue={tempValue ?? ''}
                                    isEksMultiSelect={isEksMultiSelect}
                                    isEksAsgMultiselect={isEksAsgMultiSelect}
                                    isEksAsgInstanceMultiselect={isEksAsgInstanceMultiSelect}
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

                        {s3Filter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Server className='h-4 w-4' />
                                    S3 Buckets
                                </label>
                                <S3BucketFilter
                                    selectedBuckets={tempS3Bucket}
                                    setSelectedBuckets={setTempS3Bucket}
                                    startDate={tempStartDate}
                                    endDate={tempEndDate}
                                    region={tempRegion}
                                />
                            </div>
                        )}

                        {metricFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Activity className='h-4 w-4' /> Métrica EC2
                                </label>
                                <EC2MetricFilterComponent
                                    selectedMetric={tempMetric}
                                    setSelectedMetric={setTempMetric}
                                    startDate={tempStartDate}
                                    endDate={tempEndDate}
                                />
                            </div>
                        )}

                        {ebsFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Server className='h-4 w-4' />
                                    Volúmenes EBS
                                </label>
                                <EbsFilterComponent
                                    ebs={tempEbs}
                                    setEbs={setTempEbs}
                                    startDate={tempStartDate}
                                    endDate={tempEndDate}
                                    region={tempRegion}
                                    isEbsMultiselect={isEbsMultiselect}
                                />
                            </div>
                        )}

                        {eventsTypesFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Server className='h-4 w-4' />
                                    Eventos
                                </label>
                                <EventsTypeFilterComponent
                                    eventType={tempEventsTypes}
                                    setEventType={setTempEventsTypes}
                                    region={tempRegion}
                                    isEventTypeMultiselect={isEventsTypesMultiselect}
                                />
                            </div>
                        )}

                        {advisorCategoriesFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Box className='h-4 w-4' />
                                    Categorías
                                </label>
                                <AdvisorCategoriesFilterComponent
                                    advisorCategory={tempAdvisorCategory}
                                    setAdvisorCategory={setTempAdvisorCategory}
                                    startDate={tempStartDate}
                                    endDate={tempEndDate}
                                    region={tempRegion}
                                    isAdvisorCategoryMultiselect={isAdvisorCategoryMultiselect}
                                />
                            </div>
                        )}

                        {advisorStatusFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Activity className='h-4 w-4' />
                                    Status
                                </label>
                                <AdvisorStatusFilterComponent
                                    advisorStatus={tempAdvisorStatus}
                                    advisorCategory={tempAdvisorCategory}
                                    setAdvisorStatus={setTempAdvisorStatus}
                                    isAdvisorStatusMultiselect={isAdvisorStatusMultiselect}
                                />
                            </div>
                        )}

                        {autoScalingGroupFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Activity className='h-4 w-4' /> Grupo de Auto Scaling
                                </label>
                                <AutoScalingGroupFilterComponent
                                    selectedGroup={tempAutoScalingGroup}
                                    setSelectedGroup={setTempAutoScalingGroup}
                                    startDate={tempStartDate}
                                    endDate={tempEndDate}
                                />
                            </div>
                        )}

                        {rdsFilter && engine && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Activity className='h-4 w-4' /> Métrica RDS
                                </label>
                                <RDSMetricFilterComponent
                                    selectedMetric={tempMetric}
                                    setSelectedMetric={setTempMetric}
                                    engine={engine}
                                />
                            </div>
                        )}
                        {metricsFilter && (
                            <div className='space-y-2 ml-8'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <BarChart3 className='h-4 w-4' />
                                    Métrica
                                </label>
                                <MetricsFilterComponent selectedMetrics={tempMetrics} setSelectedMetrics={setTempMetrics} isMetricsMultiSelect={isMetricsMultiselect} />
                            </div>
                        )}
                        {metricsRDSFilter && (
                            <div key="metrics-rds-filter" className='space-y-2 ml-8'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <BarChart3 className='h-4 w-4' />
                                    Métrica RDS
                                </label>
                                <MetricsRDSFilterComponent
                                    selectedMetrics={tempMetricsRDS}
                                    setSelectedMetrics={setTempMetricsRDS}
                                    rdsService={getRDSService()}
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
                    instance={asgFilter ? (filters.asgInstance || filters.asg) : filters.instance}
                    eksAsgInstance={filters.eksAsgInstance}
                    instancesService={instancesService}
                    region={filters.region}
                    selectedKey={filters.selectedKey}
                    selectedValue={filters.selectedValue}
                    services={filters.service}
                    buckets={filters.s3Bucket}
                    ebs={filters.ebs}
                    eventType={filters.eventsTypes}
                    advisorCategory={filters.advisorCategory}
                    advisorStatus={filters.advisorStatus}
                    variationMetric={filters.variationMetric}
                    variationService={filters.variationService}
                    metric={filters.metric}
                    metrics={metricsRDSFilter ? filters.metricsRDS : filters.metrics}
                    variationResource={filters.variationResource}
                    month={filters.month}
                    year={filters.year}
                />
            </Card>
        </div>
    );
};