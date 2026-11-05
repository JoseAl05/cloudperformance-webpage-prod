'use client'

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { CellContext } from '@tanstack/react-table';
import { Briefcase, Calendar, Clock, ExternalLink, Eye, Moon, Scale, Server, Sun } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createColumns, DynamicColumn } from '@/components/data-table/columns';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { WorkingHoursDetailModal } from '@/components/shared/working-hours/WorkingHoursDetailModal';
import { formatDateTime, formatValue } from '@/lib/consumption';
import type { MetricDefinition } from '@/lib/consumption';
import { findSummary, getWorkingHoursMetric, overallTrend, sortMetrics } from '@/lib/workingHours';
import type { WorkingHoursResource } from '@/interfaces/workingHours';
import type { WorkingHoursViewConfig } from '@/components/shared/working-hours/types';

type Row = WorkingHoursResource & Record<string, unknown>;

const rowOf = (info: unknown): Row => (info as CellContext<Row, unknown>).row.original;

const metricColumnKey = (index: number) => `__metric${index}`;

const ResourceCell = ({ row, config }: { row: Row; config: WorkingHoursViewConfig }) => {
    const searchParams = useSearchParams();
    const link = config.resourceLink?.(row, { param: (name) => searchParams.get(name) });
    const content = (
        <>
            <div className="mt-0.5 p-1.5 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors">
                <Server className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" title={row.resource_name}>
                        {row.resource_name}
                    </span>
                    {link && <ExternalLink className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 group-hover:text-blue-500 transition-all" />}
                </div>
                {row.resource_id !== row.resource_name && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate" title={row.resource_id}>{row.resource_id}</span>
                )}
            </div>
        </>
    );

    if (!link) return <div className="flex items-start gap-3 p-2 -ml-2">{content}</div>;
    const query = Object.fromEntries(Object.entries(link.query).filter((entry): entry is [string, string] => !!entry[1]));
    return (
        <Link
            href={{ pathname: link.pathname, query }}
            className="group flex items-start gap-3 p-2 -ml-2 rounded-md transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            rel="noopener noreferrer"
            target="_blank"
        >
            {content}
        </Link>
    );
};

const DualMetricCell = ({ row, metric, max, definition }: { row: Row; metric: string; max: number; definition: MetricDefinition }) => {
    const business = findSummary(row.metrics, metric, 'business_hours')?.avg_value ?? null;
    const nonBusiness = findSummary(row.metrics, metric, 'non_business_hours')?.avg_value ?? null;
    const dominant = row.dominant_schedule.find((d) => d.metric === metric)?.schedule_type ?? null;

    const base = definition.format === 'percent' ? 100 : max;
    const pct = (value: number | null) => (value !== null && base > 0 ? Math.min((value / base) * 100, 100) : 0);
    const fmt = (value: number | null) => formatValue(value, definition.format, definition.unit);

    return (
        <div className="flex flex-col w-full min-w-[130px] gap-1.5 py-1">
            <div className="flex justify-center items-center gap-2 min-h-[20px] text-xs">
                {dominant === 'business_hours' && <><Sun className="w-3 h-3 text-amber-500" /> Mayor uso en horario hábil</>}
                {dominant === 'non_business_hours' && <><Moon className="w-3 h-3 text-purple-500" /> Mayor uso en horario no hábil</>}
                {dominant === null && <><Scale className="w-3 h-3" /> Balanceado</>}
            </div>
            <div className={`flex flex-col gap-0.5 ${dominant === 'business_hours' ? '' : 'opacity-80'}`}>
                <div className="flex justify-between items-end text-[10px]">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Hábil</span>
                    <span className={`font-mono ${dominant === 'business_hours' ? 'font-bold text-amber-600' : ''}`}>{fmt(business)}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: `${pct(business)}%` }} />
                </div>
            </div>
            <div className={`flex flex-col gap-0.5 ${dominant === 'non_business_hours' ? '' : 'opacity-80'}`}>
                <div className="flex justify-between items-end text-[10px]">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">No Hábil</span>
                    <span className={`font-mono ${dominant === 'non_business_hours' ? 'font-bold text-purple-600' : ''}`}>{fmt(nonBusiness)}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-purple-500" style={{ width: `${pct(nonBusiness)}%` }} />
                </div>
            </div>
        </div>
    );
};

const TrendCell = ({ row }: { row: Row }) => {
    const trend = overallTrend(row);
    if (trend === 'business_hours') {
        return <Badge variant="outline" className="text-[10px] text-amber-700 border-amber-200 flex w-fit items-center gap-1"><Sun className="w-3 h-3" /> Mayor uso general en horario hábil</Badge>;
    }
    if (trend === 'non_business_hours') {
        return <Badge variant="outline" className="text-[10px] text-purple-700 border-purple-200 flex w-fit items-center gap-1"><Moon className="w-3 h-3" /> Mayor uso general en horario no hábil</Badge>;
    }
    return <Badge variant="secondary" className="text-[10px] flex w-fit items-center gap-1"><Scale className="w-3 h-3" /> Balanceado</Badge>;
};

const DetailsCell = ({ row, config }: { row: Row; config: WorkingHoursViewConfig }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setOpen(true)} aria-label="Ver detalle">
                <Eye className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </Button>
            {open && <WorkingHoursDetailModal resource={row} config={config} isOpen={open} onClose={() => setOpen(false)} />}
        </>
    );
};

const TableLegend = () => (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md border border-slate-100 dark:border-slate-800">
        <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <Briefcase className="w-3 h-3" />
            <strong>Hábil:</strong> lunes a viernes, 08:00-18:00 (Santiago)
        </span>
        <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <Moon className="w-3 h-3" />
            <strong>No Hábil:</strong> noches y fines de semana
        </span>
        <span className="flex items-center gap-1">
            <Scale className="w-3 h-3" />
            <strong>Balanceado:</strong> mismo promedio en ambos horarios
        </span>
    </div>
);

export const WorkingHoursTable = ({ resources, config }: { resources: WorkingHoursResource[]; config: WorkingHoursViewConfig }) => {
    const metrics = useMemo(() => sortMetrics(resources.flatMap((r) => r.metrics.map((m) => m.metric))), [resources]);

    const rows = useMemo<Row[]>(() => resources.map((r) => {
        const row: Row = { ...r };
        metrics.forEach((metric, i) => {
            row[metricColumnKey(i)] = findSummary(r.metrics, metric, 'business_hours')?.avg_value ?? null;
        });
        return row;
    }), [resources, metrics]);

    const maxima = useMemo(() => metrics.map((metric) =>
        Math.max(0, ...resources.flatMap((r) => r.metrics.filter((m) => m.metric === metric).map((m) => m.avg_value ?? 0)))), [resources, metrics]);

    const columns = useMemo(() => {
        const cols: DynamicColumn<Row>[] = [
            {
                header: 'Recurso',
                accessorKey: 'resource_name',
                cell: (info: unknown) => <ResourceCell row={rowOf(info)} config={config} />,
                size: 300,
            },
            {
                header: 'Fecha Observación',
                accessorKey: 'sync_time',
                cell: (info: unknown) => (
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800">
                            <Calendar className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                        </div>
                        <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">{formatDateTime(rowOf(info).sync_time)}</span>
                    </div>
                ),
                size: 220,
            },
            ...metrics.map((metric, i): DynamicColumn<Row> => {
                const definition = getWorkingHoursMetric(metric, config.metricOverrides);
                return {
                    header: definition.label,
                    accessorKey: metricColumnKey(i),
                    cell: (info: unknown) => <DualMetricCell row={rowOf(info)} metric={metric} max={maxima[i]} definition={definition} />,
                    size: 220,
                };
            }),
            {
                header: 'Tendencia Global',
                accessorFn: (row: Row) => overallTrend(row),
                cell: (info: unknown) => <TrendCell row={rowOf(info)} />,
                size: 250,
            },
            {
                header: 'Detalle',
                cell: (info: unknown) => <DetailsCell row={rowOf(info)} config={config} />,
                size: 90,
            },
        ];
        return createColumns(cols);
    }, [config, metrics, maxima]);

    if (resources.length === 0) return null;

    return (
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="border-b dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                        <Clock className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold">Análisis completo horario hábil vs no hábil</CardTitle>
                        <CardDescription>Promedio de cada métrica por horario; la barra es relativa al máximo visible.</CardDescription>
                    </div>
                </div>
                <TableLegend />
            </CardHeader>
            <CardContent className="p-4">
                <DataTableGrouping
                    columns={columns}
                    data={rows}
                    filterColumn="resource_name"
                    filterPlaceholder="Filtrar por nombre..."
                    enableGrouping
                    groupByColumn="resource_name"
                    pageSizeItems={5}
                    pageSizeGroups={5}
                />
            </CardContent>
        </Card>
    );
};
