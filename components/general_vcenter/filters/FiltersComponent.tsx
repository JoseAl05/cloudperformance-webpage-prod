'use client'

import { useEffect, useMemo, useState } from 'react';
import { Building2, HardDrive, Receipt } from 'lucide-react';
import { BaseFiltersComponent } from '@/components/shared/filters/BaseFiltersComponent';
import { readFilterParam, setFilterDates, setFilterParam } from '@/lib/filters';
import { useRouter, useSearchParams } from 'next/navigation';

import { ResourcesFilterComponent } from './ResourcesFilterComponent';
import {
    BillingTypeFilterComponent,
    parseBillingType,
    type BillingType
} from './BillingTypeFilterComponent';
import {
    BusinessUnitFilterComponent,
    parseBusinessUnit,
    type BusinessUnit
} from './BusinessUnitFilterComponent';


interface FiltersComponentProps {
    Component: (params: {
        startDate?: Date;
        endDate?: Date;
        resourceIp?: string;
        billingType?: BillingType;
        businessUnit?: BusinessUnit;
        cloud?: string;
    }) => React.JSX.Element;

    dateFilter?: boolean;
    resourceFilter?: boolean;
    isResourceMultiSelect?: boolean;
    billingTypeFilter?: boolean;
    businessUnitFilter?: boolean;
    cloud: string;
}

export const FiltersComponent = ({
    Component,
    dateFilter = true,
    resourceFilter = false,
    isResourceMultiSelect = false,
    billingTypeFilter = false,
    businessUnitFilter = false,
    cloud
}: FiltersComponentProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // const parseDate = (value: string | null): Date | undefined => {
    //     if (!value) return undefined;
    //     const date = new Date(value);
    //     return Number.isNaN(date.getTime()) ? undefined : date;
    // };

    const getInitialFilters = () => {
        const startDateParam = readFilterParam(searchParams, 'dateFrom');
        const endDateParam = readFilterParam(searchParams, 'dateTo');

        const resourceParam = readFilterParam(searchParams, 'resourceIds');
        const billingTypeParam = searchParams.get('billingType');
        const businessUnitParam = searchParams.get('businessUnit');

        const startDate = startDateParam ? new Date(startDateParam) : yesterday;
        const endDate = endDateParam ? new Date(endDateParam) : new Date();

        return {
            startDate,
            endDate,
            resourceIp: resourceParam || 'all',
            billingType: parseBillingType(billingTypeParam),
            businessUnit: parseBusinessUnit(businessUnitParam)
        };
    };

    const [filters, setFilters] = useState(getInitialFilters);

    const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([filters.startDate ?? null, filters.endDate ?? null]);
    const [tempResourceIp, setTempResourceIp] = useState<string>(filters.resourceIp);
    const [tempBillingType, setTempBillingType] = useState<BillingType>(filters.billingType);
    const [tempBusinessUnit, setTempBusinessUnit] = useState<BusinessUnit>(filters.businessUnit);

    useEffect(() => {
        const newFilters = getInitialFilters();
        setFilters(newFilters);
        setTempRange([newFilters.startDate ?? null, newFilters.endDate ?? null]);
        setTempResourceIp(newFilters.resourceIp);
        setTempBillingType(newFilters.billingType);
        setTempBusinessUnit(newFilters.businessUnit);
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
            resourceIp: tempResourceIp || 'all',
            billingType: tempBillingType,
            businessUnit: tempBusinessUnit
        };

        setFilters(newFilters);

        const query = new URLSearchParams();
        setFilterDates(query, newFilters.startDate, newFilters.endDate);
        setFilterParam(query, 'resourceIds', newFilters.resourceIp);
        if (newFilters.billingType !== 'all') query.set('billingType', newFilters.billingType);
        if (newFilters.businessUnit !== 'all') query.set('businessUnit', newFilters.businessUnit);

        router.push(`${window.location.pathname}?${query.toString()}`);
    };

    const clearFilters = () => {
        const defaultFilters = {
            startDate: yesterday,
            endDate: new Date(),
            resourceIp: 'all',
            billingType: 'all' as BillingType,
            businessUnit: 'all' as BusinessUnit
        };

        setFilters(defaultFilters);
        setTempRange([defaultFilters.startDate, defaultFilters.endDate]);
        setTempResourceIp('all');
        setTempBillingType('all');
        setTempBusinessUnit('all');

        router.push(window.location.pathname);
    };

    return (
        <BaseFiltersComponent
            dateRange={dateFilter ? { value: tempRange, onChange } : undefined}
            onApply={applyFilters}
            onClear={clearFilters}
            view={
                <Component
                    startDate={filters.startDate}
                    endDate={filters.endDate}
                    resourceIp={filters.resourceIp}
                    billingType={filters.billingType}
                    businessUnit={filters.businessUnit}
                    cloud={cloud}
                />
            }
        >
            {resourceFilter && (
                <div className='space-y-2'>
                    <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                        <HardDrive className='h-4 w-4' /> Recurso
                    </label>
                    <ResourcesFilterComponent
                        resourceIp={tempResourceIp}
                        setResourceIp={setTempResourceIp}
                        startDate={tempStartDate}
                        endDate={tempEndDate}
                        isResourceMultiSelect={isResourceMultiSelect}
                    />
                </div>
            )}
            {billingTypeFilter && (
                <div className='space-y-2'>
                    <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                        <Receipt className='h-4 w-4' /> Tipo de facturación
                    </label>
                    <BillingTypeFilterComponent
                        billingType={tempBillingType}
                        setBillingType={setTempBillingType}
                    />
                </div>
            )}
            {businessUnitFilter && (
                <div className='space-y-2'>
                    <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                        <Building2 className='h-4 w-4' /> Unidad de negocio
                    </label>
                    <BusinessUnitFilterComponent
                        businessUnit={tempBusinessUnit}
                        setBusinessUnit={setTempBusinessUnit}
                    />
                </div>
            )}
        </BaseFiltersComponent>
    );
};
