import { getMetricDefinition, metricKey, toQueryString } from '@/lib/consumption';
import type { MetricDefinition, QueryParams } from '@/lib/consumption';
import type {
    ScheduleType,
    WorkingHoursAction,
    WorkingHoursCloud,
    WorkingHoursResource,
    WorkingHoursSummaryItem,
} from '@/interfaces/workingHours';

export const workingHoursUrl = (
    cloud: WorkingHoursCloud,
    resource: string,
    action: WorkingHoursAction,
    params: QueryParams
): string => `/api/${cloud}/bridge/${cloud}/working-hours/${resource}/${action}?${toQueryString(params)}`;

export const SCHEDULES: ScheduleType[] = ['business_hours', 'non_business_hours'];

export const SCHEDULE_LABELS: Record<ScheduleType, string> = {
    business_hours: 'Horario Hábil',
    non_business_hours: 'Horario No Hábil',
};

export const SCHEDULE_TIME_ZONE = 'America/Santiago';

export const formatSantiagoTime = (value: string | number | Date): string =>
    new Intl.DateTimeFormat('es-CL', {
        timeZone: SCHEDULE_TIME_ZONE,
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(new Date(value));

export const getWorkingHoursMetric = (name: string, overrides?: Record<string, MetricDefinition>): MetricDefinition =>
    overrides?.[metricKey(name)] ?? getMetricDefinition(name);

export const sortMetrics = (names: Iterable<string>): string[] =>
    Array.from(new Set(names)).sort((a, b) => {
        const cpuA = metricKey(a).includes('cpu');
        const cpuB = metricKey(b).includes('cpu');
        if (cpuA !== cpuB) return cpuA ? -1 : 1;
        return a.localeCompare(b);
    });

export const findSummary = (
    items: WorkingHoursSummaryItem[],
    metric: string,
    schedule: ScheduleType
): WorkingHoursSummaryItem | undefined => items.find((m) => m.metric === metric && m.schedule_type === schedule);

export type OverallTrend = ScheduleType | 'balanced';

export const overallTrend = (resource: WorkingHoursResource): OverallTrend => {
    let business = 0;
    let nonBusiness = 0;
    resource.dominant_schedule.forEach((d) => {
        if (d.schedule_type === 'business_hours') business++;
        else if (d.schedule_type === 'non_business_hours') nonBusiness++;
    });
    if (business > nonBusiness) return 'business_hours';
    if (nonBusiness > business) return 'non_business_hours';
    return 'balanced';
};
