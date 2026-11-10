'use client'

import { useEffect, useMemo, useState } from 'react';
import { HardDrive } from 'lucide-react';
import { BaseFiltersComponent } from '@/components/shared/filters/BaseFiltersComponent';
import { readFilterParam, setFilterDates, setFilterParam } from '@/lib/filters';
import { useRouter, useSearchParams } from 'next/navigation';

import { ResourcesFilterComponent } from './ResourcesFilterComponent';


interface FiltersComponentProps {
    Component: (params: {
        startDate?: Date;
        endDate?: Date;
        resourceIp?: string;
        cloud?: string;
    }) => React.JSX.Element;

    dateFilter?: boolean;
    resourceFilter?: boolean;
    isResourceMultiSelect?: boolean;
    cloud: string;
}

export const FiltersComponent = ({
    Component,
    dateFilter = true,
    resourceFilter = false,
    isResourceMultiSelect = false,
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

        const startDate = startDateParam ? new Date(startDateParam) : yesterday;
        const endDate = endDateParam ? new Date(endDateParam) : new Date();

        return {
            startDate,
            endDate,
            resourceIp: resourceParam || 'all'
        };
    };

    const [filters, setFilters] = useState(getInitialFilters);

    const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([filters.startDate ?? null, filters.endDate ?? null]);
    const [tempResourceIp, setTempResourceIp] = useState<string>(filters.resourceIp);

    useEffect(() => {
        const newFilters = getInitialFilters();
        setFilters(newFilters);
        setTempRange([newFilters.startDate ?? null, newFilters.endDate ?? null]);
        setTempResourceIp(newFilters.resourceIp);
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
            resourceIp: tempResourceIp || 'all'
        };

        setFilters(newFilters);

        const query = new URLSearchParams();
        setFilterDates(query, newFilters.startDate, newFilters.endDate);
        setFilterParam(query, 'resourceIds', newFilters.resourceIp);

        router.push(`${window.location.pathname}?${query.toString()}`);
    };

    const clearFilters = () => {
        const defaultFilters = {
            startDate: yesterday,
            endDate: new Date(),
            resourceIp: 'all'
        };

        setFilters(defaultFilters);
        setTempRange([defaultFilters.startDate, defaultFilters.endDate]);
        setTempResourceIp('all');

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
        </BaseFiltersComponent>
    );
};
