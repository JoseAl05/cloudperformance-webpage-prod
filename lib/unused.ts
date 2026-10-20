import { formatDateTime, formatValue, getMetricDefinition, metricKey, toNumberOrNull, toQueryString } from '@/lib/consumption';
import type { MetricDefinition, QueryParams, ValueFormat } from '@/lib/consumption';
import type { DiagnosisStatus, UnusedAction, UnusedCloud, UnusedMetric, UnusedMetricSummary, UnusedResource } from '@/interfaces/unused';

export const unusedUrl = (cloud: UnusedCloud, resource: string, action: UnusedAction, params: QueryParams): string =>
    `/api/${cloud}/bridge/${cloud}/unused/${resource}/${action}?${toQueryString(params)}`;

export const DIAGNOSIS: Record<DiagnosisStatus, { label: string; className: string }> = {
    underutilized: { label: 'Infrautilizado', className: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' },
    low_usage: { label: 'Bajo uso', className: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800' },
    healthy: { label: 'Saludable', className: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' },
    no_data: { label: 'Sin datos', className: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' },
};

export const formatAttribute = (value: unknown, format?: ValueFormat | 'text' | 'boolean' | 'date', unit?: string): string => {
    if (value === null || value === undefined || value === '') return '—';
    if (format === 'boolean') return value ? 'Sí' : 'No';
    if (format === 'date') return formatDateTime(String(value));
    if (format && format !== 'text') return formatValue(toNumberOrNull(value), format, unit);
    return String(value);
};

export const resourceField = (resource: UnusedResource, key: string): unknown =>
    resource.attributes[key] ?? (resource as unknown as Record<string, unknown>)[key];

export const getUnusedMetric = (name: string, overrides?: Record<string, MetricDefinition>): MetricDefinition =>
    overrides?.[metricKey(name)] ?? getMetricDefinition(name);

export interface MetricGroup {
    label: string;
    metrics: string[];
}

export interface CombinedMetric {
    avg: number | null;
    context: number | null;
    bar: number;
    visualization: 'ranking' | 'contribution' | null;
}

export const combineMetrics = (metrics: UnusedMetric[], group: MetricGroup): CombinedMetric | null => {
    const found = metrics.filter((m) => group.metrics.includes(m.metric) && m.avg_value !== null);
    if (found.length === 0) return null;
    if (found.length === 1) {
        const [m] = found;
        return { avg: m.avg_value, context: m.group_context_value, bar: m.bar_width ?? 0, visualization: m.visualization_type };
    }
    const avg = found.reduce((sum, m) => sum + (m.avg_value ?? 0), 0);
    const context = found.reduce((sum, m) => sum + (m.group_context_value ?? 0), 0);
    return { avg, context, bar: context > 0 ? (avg / context) * 100 : 0, visualization: found[0].visualization_type };
};

export const summaryFromResources = (resources: UnusedResource[], group: MetricGroup): { avg: number; peak: number | null } | null => {
    const perResource = resources
        .map((r) => r.metrics.filter((m) => group.metrics.includes(m.metric) && m.avg_value !== null))
        .filter((found) => found.length > 0);
    if (perResource.length === 0) return null;
    const avgs = perResource.map((found) => found.reduce((sum, m) => sum + (m.avg_value ?? 0), 0));
    const peaks = perResource.map((found) => found.reduce((sum, m) => sum + (m.max_value ?? m.avg_value ?? 0), 0));
    return { avg: avgs.reduce((sum, v) => sum + v, 0) / avgs.length, peak: Math.max(...peaks) };
};

export const combineSummary = (summary: UnusedMetricSummary[], group: MetricGroup): { avg: number; peak: number | null } | null => {
    const found = summary.filter((m) => group.metrics.includes(m.metric));
    if (found.length === 0) return null;
    const peaks = found.map((m) => m.peak_value).filter((v): v is number => v !== null);
    return {
        avg: found.reduce((sum, m) => sum + (m.avg_value ?? 0), 0),
        peak: peaks.length === found.length ? peaks.reduce((sum, v) => sum + v, 0) : null,
    };
};
