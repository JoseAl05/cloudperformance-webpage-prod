export interface CommonFilters {
    dateFrom: Date;
    dateTo: Date;
    regions: string[];
    scopes: string[];
    resourceIds: string[];
    tagKey: string | null;
    tagValue: string | null;
}

export const FILTER_PARAMS = {
    dateFrom: 'dateFrom',
    dateTo: 'dateTo',
    regions: 'regions',
    scopes: 'scopes',
    resourceIds: 'resourceIds',
    tagKey: 'tagKey',
    tagValue: 'tagValue',
} as const;

export type FilterParam = keyof typeof FILTER_PARAMS;

const LEGACY_PARAMS: Record<FilterParam, readonly string[]> = {
    dateFrom: ['startDate'],
    dateTo: ['endDate'],
    regions: ['region'],
    scopes: ['subscription', 'projects'],
    resourceIds: ['instance', 'resource', 'resourceId'],
    tagKey: ['selectedKey'],
    tagValue: ['selectedValue'],
};

const ALL_SENTINELS = new Set([
    'all', 'all_regions', 'all_projects', 'all_subscriptions', 'all_resources', 'all_instances', 'all_services',
    'allKeys', 'allValues',
]);

type SearchParamsLike = { get: (name: string) => string | null };

export const readFilterParam = (searchParams: SearchParamsLike, param: FilterParam): string | null => {
    const canonical = searchParams.get(FILTER_PARAMS[param]);
    if (canonical !== null) return canonical;
    for (const legacy of LEGACY_PARAMS[param]) {
        const value = searchParams.get(legacy);
        if (value !== null) return value;
    }
    return null;
};

export const readFilterDate = (searchParams: SearchParamsLike, param: 'dateFrom' | 'dateTo', fallback: Date): Date => {
    const raw = readFilterParam(searchParams, param);
    const parsed = raw ? new Date(raw) : null;
    return parsed && !Number.isNaN(parsed.getTime()) ? parsed : fallback;
};

const isAll = (value: string | null | undefined): boolean => !value || ALL_SENTINELS.has(value);

export const toFilterList = (value: string | string[] | null | undefined): string[] => {
    const items = Array.isArray(value) ? value : (value ?? '').split(',');
    return items.map((item) => item.trim()).filter((item) => item && !ALL_SENTINELS.has(item));
};

export const toFilterTag = (value: string | null | undefined): string | null => (isAll(value) ? null : (value as string));

export const buildCommonFilters = (values: {
    dateFrom: Date;
    dateTo: Date;
    regions?: string | string[] | null;
    scopes?: string | string[] | null;
    resourceIds?: string | string[] | null;
    tagKey?: string | null;
    tagValue?: string | null;
}): CommonFilters => ({
    dateFrom: values.dateFrom,
    dateTo: values.dateTo,
    regions: toFilterList(values.regions),
    scopes: toFilterList(values.scopes),
    resourceIds: toFilterList(values.resourceIds),
    tagKey: toFilterTag(values.tagKey),
    tagValue: toFilterTag(values.tagKey) ? toFilterTag(values.tagValue) : null,
});

export const setFilterParam = (query: URLSearchParams, param: FilterParam, value: string | string[] | null | undefined) => {
    const text = Array.isArray(value) ? value.join(',') : value;
    if (!isAll(text)) query.set(FILTER_PARAMS[param], text as string);
};

export const setFilterDates = (query: URLSearchParams, dateFrom: Date, dateTo: Date) => {
    query.set(FILTER_PARAMS.dateFrom, dateFrom.toISOString());
    query.set(FILTER_PARAMS.dateTo, dateTo.toISOString());
};
