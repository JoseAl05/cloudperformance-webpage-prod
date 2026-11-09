'use client'

import { useMemo, useState, type ComponentType } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BaseFiltersComponent } from '@/components/shared/filters/BaseFiltersComponent';
import { readFilterParam, setFilterDates } from '@/lib/filters';

type DateRange = [Date | null, Date | null];

const parseDate = (raw: string | null): Date | null => {
    const parsed = raw ? new Date(raw) : null;
    return parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;
};

export interface VcenterFilterProps {
    startDate?: Date;
    endDate?: Date;
}

interface FiltersComponentProps {
    Component: ComponentType<VcenterFilterProps>;
}

export const FiltersComponent = ({ Component }: FiltersComponentProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const applied = useMemo<DateRange>(() => {
        const from = parseDate(readFilterParam(searchParams, 'dateFrom'));
        const to = parseDate(readFilterParam(searchParams, 'dateTo'));
        return from && to ? [from, to] : [null, null];
    }, [searchParams]);

    const [range, setRange] = useState<DateRange>(applied);

    const applyFilters = () => {
        const [from, to] = range;
        if (!from || !to) return;
        const query = new URLSearchParams(searchParams.toString());
        setFilterDates(query, from, to);
        router.push(`${window.location.pathname}?${query.toString()}`);
    };

    const clearFilters = () => {
        setRange([null, null]);
        router.push(window.location.pathname);
    };

    return (
        <BaseFiltersComponent
            dateRange={{ value: range, onChange: setRange }}
            onApply={applyFilters}
            onClear={clearFilters}
            view={<Component startDate={applied[0] ?? undefined} endDate={applied[1] ?? undefined} />}
        />
    );
};
