'use client'

import { useEffect, useState, useMemo } from 'react';
import { DatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RegionFilterComponent } from '@/components/general_azure/filters/RegionFilterComponent';
import { SubscriptionsFilterComponent } from '@/components/general_azure/filters/SubscriptionsFilterComponent';
import { TagsFilterComponent } from '@/components/general_azure/filters/TagsFilterComponent';
import { MetricsFilterComponent } from '@/components/general_azure/filters/MetricsFilterComponent';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Filter, MapPin, XCircle, Cloud, Tag, Activity, Layers, Server, Cylinder, Database, Computer, Boxes, FolderTree, GitBranch, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { SubscriptionsFilterComponentV2 } from '@/components/general_azure/filters/SubscriptionsFilterComponentV2';
import { ResourceTypesFilterComponent } from '@/components/general_azure/filters/ResourceTypesFilterComponent';
import { InstancesFilterComponent } from '@/components/general_azure/filters/InstancesFilterComponent';
import { StorageAccountsFilterComponent } from '@/components/general_azure/filters/StorageAccountsFilterComponent';
import { ResourcesFilterComponent } from '@/components/general_azure/filters/ResourcesFilterComponent';
import { UnusedVmFilterComponent } from '@/components/general_azure/filters/UnusedVmFilterComponent';
import { UnusedVmssFilterComponent } from '@/components/general_azure/filters/UnusedVmssFilterComponent';
import { VmFilterComponent } from '@/components/general_azure/filters/VmFilterComponent';
import { ServiceFilterComponent } from '@/components/general_azure/filters/ServiceFilterComponent';
import { ResourceGroupFilterComponent } from '@/components/general_azure/filters/ResourceGroupsFilterComponent';
import { InstancesFilterComponentV2 } from '@/components/general_azure/filters/InstancesFilterComponentV2';
import { DeploymentOperationsFilterComponent } from '@/components/general_azure/filters/DeploymentOperationsFilterComponent';
import { ImpactFilterComponent } from '@/components/general_azure/filters/ImpactFilterComponent';
import { CategoryFilterComponent } from '@/components/general_azure/filters/CategoryFilterComponent';

interface FiltersComponentProps {
    Component: (params: {
        startDate: Date;
        endDate?: Date;
        month?: number | null;
        year?: number | null;
        region: string;
        subscription: string;
        selectedTagKey: string | null;
        selectedTagValue: string | null;
        selectedMetric: string;
        selectedResourceType?: string;
        selectedMeterCategory?: string | null;
        selectedInstance?: string | null;
        selectedStrgAccount?: string;
        selectedResource?: string;
        selectedUnusedVm?: string;
        selectedUnusedVmss?: string;
        selectedVm?: string;
        selectedService?: string;
        selectedResourceGroup?: string | null;
        selectedInstanceV2?: string | null;
        selectedOperation?: string;
        impact?: string | null;
        category?: string | null;
    }) => React.JSX.Element;
    dateFilter?: boolean;
    monthYearFilter?: boolean;
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
    strgAccountFilter?: boolean;
    isStrgAccountMultiselect?: boolean;
    resourcesFilter?: boolean;
    unusedVmFilter?: boolean;
    isUnusedVmFilterMultiselect?: boolean;
    unusedVmssFilter?: boolean;
    isUnusedVmssFilterMultiselect?: boolean;
    vmFilter?: boolean;
    isVmFilterMultiselect?: boolean;
    serviceFilter?: boolean;
    isServiceMultiselect?: boolean;
    resourceGroupFilter?: boolean;
    resourceGroupCollection?: string;
    resourceGroupSubscriptionField?: string;
    instancesFilterV2?: boolean;
    instancesV2Collection?: string;
    instancesV2SubscriptionField?: string;
    instancesV2InstanceField?: string;
    deploymentOperationsFilter?: boolean;
    impactFilter?: boolean;
    categoryFilter?: boolean;
}

export const FiltersComponent = ({
    Component,
    dateFilter = true,
    monthYearFilter = false,
    regionFilter = false,
    subscriptionFilter = false,
    subscriptionIdFilter = false,
    tagsFilter = false,
    tagsCollection = '',
    tagsColumnName = '',
    tagsRegionField = '',
    tagsSubscriptionField = '',
    isRegionMultiSelect = false,
    metricsFilter = false,
    metricsCollection = '',
    resourceTypeFilter = false,
    instancesFilter = false,
    strgAccountFilter = false,
    isStrgAccountMultiselect = false,
    resourcesFilter = false,
    unusedVmFilter = false,
    isUnusedVmFilterMultiselect = false,
    unusedVmssFilter = false,
    isUnusedVmssFilterMultiselect = false,
    vmFilter = false,
    isVmFilterMultiselect = false,
    serviceFilter = false,
    isServiceMultiselect = false,
    resourceGroupFilter = false,
    resourceGroupCollection = '',
    resourceGroupSubscriptionField = '',
    instancesFilterV2 = false,
    instancesV2Collection = '',
    instancesV2SubscriptionField = '',
    instancesV2InstanceField = '',
    deploymentOperationsFilter = false,
    impactFilter = false,
    categoryFilter = false,
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
        const monthParam = searchParams.get('month');
        const yearParam = searchParams.get('year');
        const endDateParam = searchParams.get('endDate');
        const regionParam = searchParams.get('region');
        const subscriptionParam = searchParams.get('subscription');
        const selectedTagKeyParam = searchParams.get('tagKey');
        const selectedTagValueParam = searchParams.get('tagValue');
        const selectedMetricParam = searchParams.get('metric');
        const selectedResourceTypeParam = searchParams.get('resourceType');
        const selectedMeterCategoryParam = searchParams.get('meterCategory');
        const selectedInstanceParam = searchParams.get('instance');
        const selectedStrgAccountParam = searchParams.get('strgAccount');
        const selectedResourceParam = searchParams.get('resource');
        const selectedUnusedVmParam = searchParams.get('unusedVm');
        const selectedUnusedVmssParam = searchParams.get('unusedVmss');
        const selectedVmParam = searchParams.get('vm');
        const selectedServiceParam = searchParams.get('service');
        const selectedResourceGroupParam = searchParams.get('resourceGroup');
        const selectedInstanceV2Param = searchParams.get('instanceV2');
        const selectedOperationParam = searchParams.get('operation');
        const impactParam = searchParams.get('impact');
        const categoryParam = searchParams.get('category');

        let startDate = startDateParam ? new Date(startDateParam) : yesterday;
        let endDate = endDateParam ? new Date(endDateParam) : new Date();
        const now = new Date();
        let month: number = now.getMonth() + 1;
        let year: number = now.getFullYear();

        if (monthYearFilter && monthParam && yearParam) {
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
            month,
            year,
            region: regionParam || 'all_regions',
            subscription: subscriptionParam || 'all_subscriptions',
            selectedTagKey: selectedTagKeyParam || '',
            selectedTagValue: selectedTagValueParam || '',
            selectedMetric: selectedMetricParam || '',
            selectedResourceType: selectedResourceTypeParam || '',
            selectedMeterCategory: selectedMeterCategoryParam || null,
            selectedInstance: selectedInstanceParam || null,
            selectedStrgAccount: selectedStrgAccountParam || '',
            selectedResource: selectedResourceParam || '',
            selectedUnusedVmParam: selectedUnusedVmParam || '',
            selectedUnusedVmssParam: selectedUnusedVmssParam || '',
            selectedVmParam: selectedVmParam || '',
            selectedServiceParam: selectedServiceParam || '',
            selectedResourceGroup: selectedResourceGroupParam || '',
            selectedInstanceV2: selectedInstanceV2Param || '',
            selectedOperation: selectedOperationParam || '',
            impact: impactParam !== null ? impactParam : null,
            category: categoryParam !== null ? categoryParam : null,
        };
    };

    const [filters, setFilters] = useState(getInitialFilters);
    const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([filters.startDate, filters.endDate]);
    const [tempMonth, setTempMonth] = useState<number | null>(filters.month ?? null);
    const [tempYear, setTempYear] = useState<number | null>(filters.year ?? null);
    const [tempMonthYearDate, setTempMonthYearDate] = useState<Date | null>(
        filters.month && filters.year ? new Date(filters.year, (filters.month - 1), 1) : null
    );
    const [tempRegion, setTempRegion] = useState(filters.region);
    const [tempSubscription, setTempSubscription] = useState(filters.subscription);
    const [tempTagKey, setTempTagKey] = useState<string | null>(filters.selectedTagKey);
    const [tempTagValue, setTempTagValue] = useState<string | null>(filters.selectedTagValue);
    const [tempMetric, setTempMetric] = useState<string>(filters.selectedMetric);
    const [tempResourceType, setTempResourceType] = useState<string>(filters.selectedResourceType);
    const [tempMeterCategory, setTempMeterCategory] = useState<string | null>(filters.selectedMeterCategory);
    const [tempInstance, setTempInstance] = useState<string | null>(filters.selectedInstance);
    const [tempStrgAccount, setTempStrgAccount] = useState(filters.selectedStrgAccount);
    const [tempResource, setTempResource] = useState<string>(filters.selectedResource);
    const [tempUnusedVm, setTempUnusedVm] = useState(filters.selectedUnusedVmParam);
    const [tempUnusedVmss, setTempUnusedVmss] = useState(filters.selectedUnusedVmssParam);
    const [tempVm, setTempVm] = useState(filters.selectedVmParam);
    const [tempService, setTempService] = useState(filters.selectedServiceParam);
    const [tempResourceGroup, setTempResourceGroup] = useState<string | null>(filters.selectedResourceGroup);
    const [tempInstanceV2, setTempInstanceV2] = useState<string | null>(filters.selectedInstanceV2);
    const [tempOperation, setTempOperation] = useState<string>(filters.selectedOperation);
    const [tempImpact, setTempImpact] = useState<string | null>(filters.impact);
    const [tempCategory, setTempCategory] = useState<string | null>(filters.category);

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
        setTempStrgAccount(newFilters.selectedStrgAccount);
        setTempMonth(newFilters.month ?? null);
        setTempYear(newFilters.year ?? null);
        setTempMonthYearDate(
            newFilters.month && newFilters.year ? new Date(newFilters.year, newFilters.month - 1, 1) : null
        );
        setTempResource(newFilters.selectedResource);
        setTempUnusedVm(newFilters.selectedUnusedVmParam);
        setTempUnusedVmss(newFilters.selectedUnusedVmssParam);
        setTempVm(newFilters.selectedVmParam);
        setTempService(newFilters.selectedServiceParam);
        setTempResourceGroup(newFilters.selectedResourceGroup);
        setTempInstanceV2(newFilters.selectedInstanceV2);
        setTempOperation(newFilters.selectedOperation);
        setTempImpact(newFilters.impact);
        setTempCategory(newFilters.category);
    }, [searchParams]);

    const onChange = (dates: [Date | null, Date | null]) => setTempRange(dates);

    const tempStartDate = useMemo(() => (tempRange[0] ?? filters.startDate), [tempRange, filters.startDate]);
    const tempEndDate = useMemo(() => (tempRange[1] ?? filters.endDate), [tempRange, filters.endDate]);

    const applyFilters = () => {
        let [start, end] = tempRange;

        if (monthYearFilter) {
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
            month: monthYearFilter ? (tempMonth ?? (tempMonthYearDate ? tempMonthYearDate.getMonth() + 1 : null)) : null,
            year: monthYearFilter ? (tempYear ?? (tempMonthYearDate ? tempMonthYearDate.getFullYear() : null)) : null,
            region: tempRegion,
            subscription: tempSubscription,
            selectedTagKey: tempTagKey,
            selectedTagValue: tempTagValue,
            selectedMetric: tempMetric,
            selectedResourceType: tempResourceType,
            selectedMeterCategory: tempMeterCategory,
            selectedInstance: tempInstance,
            selectedStrgAccount: tempStrgAccount,
            selectedResource: tempResource,
            selectedUnusedVm: tempUnusedVm,
            selectedUnusedVmss: tempUnusedVmss,
            selectedVm: tempVm,
            selectedService: tempService,
            selectedResourceGroup: tempResourceGroup,
            selectedInstanceV2: tempInstanceV2,
            selectedOperation: tempOperation,
            impact: tempImpact,
            category: tempCategory,
        };

        setFilters(newFilters as unknown);

        const query = new URLSearchParams();
        query.set('startDate', newFilters.startDate.toISOString());
        query.set('endDate', newFilters.endDate.toISOString());
        if (monthYearFilter) {
            if (newFilters.month) query.set('month', String(newFilters.month));
            if (newFilters.year) query.set('year', String(newFilters.year));
        }

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
        if (newFilters.selectedResource) {
            query.set('resource', newFilters.selectedResource);
        }
        if (newFilters.selectedMeterCategory) {
            query.set('meterCategory', newFilters.selectedMeterCategory);
        }
        if (newFilters.selectedInstance) {
            query.set('instance', newFilters.selectedInstance);
        }
        if (newFilters.impact !== null && newFilters.impact !== undefined) {
            query.set('impact', String(newFilters.impact));
        }
        if (newFilters.category !== null && newFilters.category !== undefined) {
            query.set('category', String(newFilters.category));
        }
        if (newFilters.selectedUnusedVm) {
            query.set('unusedVm', newFilters.selectedUnusedVm);
        }
        if (newFilters.selectedUnusedVmss) {
            query.set('unusedVmss', newFilters.selectedUnusedVmss);
        }
        if (newFilters.selectedResourceGroup && newFilters.selectedResourceGroup !== 'all_resource_groups') {
            query.set('resourceGroup', newFilters.selectedResourceGroup);
        }
        if (newFilters.selectedInstanceV2 && newFilters.selectedInstanceV2 !== 'all_instances') {
            query.set('instanceV2', newFilters.selectedInstanceV2);
        }
        if (newFilters.selectedOperation) {
            query.set('operation', newFilters.selectedOperation);
        }
        if (newFilters.selectedVm) {
            query.set('vm', newFilters.selectedVm);
        }
        if (newFilters.selectedService) {
            query.set('service', newFilters.selectedService);
        }
        if (newFilters.selectedStrgAccount) {
            query.set('strgAccount', newFilters.selectedStrgAccount);
        }

        router.push(`${window.location.pathname}?${query.toString()}`);
    };

    const clearFilters = () => {
        const defaultFilters = {
            startDate: yesterday,
            endDate: new Date(),
            month: null as number | null,
            year: null as number | null,
            region: 'all_regions',
            subscription: 'all_subscriptions',
            selectedTagKey: null,
            selectedTagValue: null,
            selectedMetric: '',
            selectedResourceType: '',
            selectedMeterCategory: null,
            selectedInstance: null,
            selectedStrgAccount: '',
            selectedResource: '',
            selectedUnusedVm: '',
            selectedUnusedVmss: '',
            selectedVm: '',
            selectedService: '',
            selectedResourceGroup: '',
            selectedInstanceV2: '',
            selectedOperation: '',
            impact: '',
            category: ''
        };

        setFilters(defaultFilters as unknown);
        setTempRange([defaultFilters.startDate, defaultFilters.endDate]);
        setTempMonth(defaultFilters.month);
        setTempYear(defaultFilters.year);
        setTempRegion(defaultFilters.region);
        setTempSubscription(defaultFilters.subscription);
        setTempTagKey(defaultFilters.selectedTagKey);
        setTempTagValue(defaultFilters.selectedTagValue);
        setTempMetric(defaultFilters.selectedMetric);
        setTempResourceType(defaultFilters.selectedResourceType);
        setTempMeterCategory(defaultFilters.selectedMeterCategory);
        setTempInstance(defaultFilters.selectedInstance);
        setTempStrgAccount(defaultFilters.selectedStrgAccount);
        setTempResource(defaultFilters.selectedResource);
        setTempUnusedVm(defaultFilters.selectedUnusedVm);
        setTempUnusedVmss(defaultFilters.selectedUnusedVmss);
        setTempVm(defaultFilters.selectedVm);
        setTempService(defaultFilters.selectedService);
        setTempResourceGroup(defaultFilters.selectedResourceGroup);
        setTempInstanceV2(defaultFilters.selectedInstanceV2);
        setTempOperation(defaultFilters.selectedOperation);
        setTempImpact(defaultFilters.impact as string);
        setTempCategory(defaultFilters.category as string);

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

                        {monthYearFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Calendar className='h-4 w-4' />
                                    Mes y Año
                                </label>
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

                        {strgAccountFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Cylinder className='h-4 w-4' />
                                    Storage Accounts
                                </label>
                                <StorageAccountsFilterComponent
                                    strgAccount={tempStrgAccount}
                                    setStrgAccount={setTempStrgAccount}
                                    startDate={tempStartDate}
                                    endDate={tempEndDate}
                                    region={tempRegion}
                                    subscriptions={tempSubscription}
                                    selectedKey={tempTagKey}
                                    selectedValue={tempTagKey}
                                    isStrgAccountMultiSelect={isStrgAccountMultiselect}
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

                        {resourcesFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Database className='h-4 w-4' />
                                    Recursos
                                </label>
                                <ResourcesFilterComponent
                                    startDate={tempRange[0] ?? filters.startDate}
                                    endDate={tempRange[1] ?? filters.endDate}
                                    selectedMetric={tempMetric}
                                    selectedResourceType={tempResourceType}
                                    selectedResource={tempResource}
                                    setSelectedResource={setTempResource}
                                />
                            </div>
                        )}

                        {impactFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <AlertTriangle className='h-4 w-4' />
                                    Impacto
                                </label>
                                <ImpactFilterComponent
                                    impact={tempImpact ?? ''}
                                    setImpact={(v: string) => setTempImpact(v)}
                                />
                            </div>
                        )}

                        {categoryFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <FolderTree className='h-4 w-4' />
                                    Categoría
                                </label>
                                <CategoryFilterComponent
                                    category={tempCategory ?? ''}
                                    setCategory={(v: string) => setTempCategory(v)}
                                />
                            </div>
                        )}

                        {resourceGroupFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <FolderTree className='h-4 w-4' />
                                    Grupo de Recursos
                                </label>
                                <ResourceGroupFilterComponent
                                    startDate={tempRange[0] ?? filters.startDate}
                                    endDate={tempRange[1] ?? filters.endDate}
                                    region={tempRegion}
                                    subscription={tempSubscription}
                                    collection={resourceGroupCollection}
                                    subscriptionField={resourceGroupSubscriptionField}
                                    selectedTagKey={tempTagKey}
                                    selectedTagValue={tempTagValue}
                                    selectedResourceGroup={tempResourceGroup}
                                    setSelectedResourceGroup={setTempResourceGroup}
                                />
                            </div>
                        )}

                        {instancesFilterV2 && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Server className='h-4 w-4' />
                                    Instancias
                                </label>
                                <InstancesFilterComponentV2
                                    startDate={tempRange[0] ?? filters.startDate}
                                    endDate={tempRange[1] ?? filters.endDate}
                                    region={tempRegion}
                                    subscription={tempSubscription}
                                    collection={instancesV2Collection}
                                    subscriptionField={instancesV2SubscriptionField}
                                    instanceField={instancesV2InstanceField}
                                    selectedTagKey={tempTagKey}
                                    selectedTagValue={tempTagValue}
                                    selectedResourceGroup={tempResourceGroup}
                                    selectedInstance={tempInstanceV2}
                                    setSelectedInstance={setTempInstanceV2}
                                />
                            </div>
                        )}

                        {deploymentOperationsFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <GitBranch className='h-4 w-4' />
                                    Operaciones
                                </label>
                                <DeploymentOperationsFilterComponent
                                    startDate={tempRange[0] ?? filters.startDate}
                                    endDate={tempRange[1] ?? filters.endDate}
                                    operation={tempOperation}
                                    setOperation={setTempOperation}
                                />
                            </div>
                        )}

                        {unusedVmFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Computer className='h-4 w-4' />
                                    VMs
                                </label>
                                <UnusedVmFilterComponent
                                    startDate={tempStartDate}
                                    endDate={tempEndDate}
                                    region={tempRegion}
                                    subscription={tempSubscription}
                                    unusedVm={tempUnusedVm}
                                    setUnusedVm={setTempUnusedVm}
                                    isUnusedVmFilterMultiselect={isUnusedVmFilterMultiselect}
                                />
                            </div>
                        )}

                        {unusedVmssFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Computer className='h-4 w-4' />
                                    VMs
                                </label>
                                <UnusedVmssFilterComponent
                                    startDate={tempStartDate}
                                    endDate={tempEndDate}
                                    region={tempRegion}
                                    subscription={tempSubscription}
                                    unusedVmss={tempUnusedVmss}
                                    setUnusedVmss={setTempUnusedVmss}
                                    isUnusedVmssFilterMultiselect={isUnusedVmssFilterMultiselect}
                                />
                            </div>
                        )}

                        {vmFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Computer className='h-4 w-4' />
                                    VMs
                                </label>
                                <VmFilterComponent
                                    startDate={tempStartDate}
                                    endDate={tempEndDate}
                                    region={tempRegion}
                                    subscription={tempSubscription}
                                    vm={tempVm}
                                    setVm={setTempVm}
                                    isVmFilterMultiselect={isVmFilterMultiselect}
                                />
                            </div>
                        )}

                        {serviceFilter && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                                    <Boxes className='h-4 w-4' />
                                    Servicios
                                </label>
                                <ServiceFilterComponent
                                    selectedService={tempService}
                                    setSelectedService={setTempService}
                                    isServiceMultiselect={isServiceMultiselect}
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
                    month={(filters as unknown).month}
                    year={(filters as unknown).year}
                    region={filters.region}
                    subscription={filters.subscription}
                    selectedTagKey={filters.selectedTagKey}
                    selectedTagValue={filters.selectedTagValue}
                    selectedMetric={filters.selectedMetric}
                    selectedResourceType={(filters as unknown).selectedResourceType}
                    selectedMeterCategory={(filters as unknown).selectedMeterCategory}
                    selectedInstance={(filters as unknown).selectedInstance}
                    selectedStrgAccount={(filters as unknown).selectedStrgAccount}
                    selectedResource={(filters as unknown).selectedResource}
                    selectedUnusedVm={(filters as unknown).selectedUnusedVmParam}
                    selectedUnusedVmss={(filters as unknown).selectedUnusedVmssParam}
                    selectedVm={(filters as unknown).selectedVmParam}
                    selectedService={(filters as unknown).selectedServiceParam}
                    selectedResourceGroup={(filters as unknown).selectedResourceGroup}
                    selectedInstanceV2={(filters as unknown).selectedInstanceV2}
                    selectedOperation={(filters as unknown).selectedOperation}
                    impact={(filters as unknown).impact}
                    category={(filters as unknown).category}
                />
            </Card>
        </div>
    );
};