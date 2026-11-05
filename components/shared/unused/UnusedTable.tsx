'use client'

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { CellContext } from '@tanstack/react-table';
import { BarChart3, ExternalLink, Eye, Server } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createColumns, DynamicColumn } from '@/components/data-table/columns';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { UnusedDetailModal } from '@/components/shared/unused/UnusedDetailModal';
import { formatCurrency } from '@/lib/format';
import { formatValue } from '@/lib/consumption';
import type { MetricDefinition } from '@/lib/consumption';
import { combineMetrics, DIAGNOSIS, formatAttribute, getUnusedMetric } from '@/lib/unused';
import type { MetricGroup } from '@/lib/unused';
import type { UnusedResource } from '@/interfaces/unused';
import type { UnusedViewConfig } from '@/components/shared/unused/types';

type Row = UnusedResource & Record<string, unknown>;

const rowOf = (info: unknown): Row => (info as CellContext<Row, unknown>).row.original;

const DIAGNOSIS_ORDER = { underutilized: 0, low_usage: 1, healthy: 2, no_data: 3 } as const;

const attributeColumnKey = (key: string) => `__attr_${key}`;

const ResourceCell = ({ row, config }: { row: Row; config: UnusedViewConfig }) => {
    const searchParams = useSearchParams();
    const link = config.resourceLink?.(row, { param: (name) => searchParams.get(name) });
    const content = (
        <>
            <div className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 shrink-0">
                <Server className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="flex flex-col min-w-0">
                <span className="flex items-center gap-1 font-semibold text-xs text-slate-700 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400" title={row.resource_name}>
                    {row.resource_name}
                    {link && <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </span>
                {row.resource_id !== row.resource_name && (
                    <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[220px]" title={row.resource_id}>{row.resource_id}</span>
                )}
                <span className="text-[10px] text-muted-foreground">{[row.resource_type, row.region].filter(Boolean).join(' · ')}</span>
            </div>
        </>
    );
    if (!link) return <div className="flex items-center gap-3">{content}</div>;
    const query = Object.fromEntries(Object.entries(link.query).filter((entry): entry is [string, string] => !!entry[1]));
    return (
        <Link href={{ pathname: link.pathname, query }} className="group flex items-center gap-3" rel="noopener noreferrer" target="_blank">
            {content}
        </Link>
    );
};

const MetricCell = ({ row, group, definition }: { row: Row; group: MetricGroup; definition: MetricDefinition }) => {
    const metric = combineMetrics(row.metrics, group);
    if (!metric) return <span className="text-muted-foreground text-xs">—</span>;
    const fmt = (v: number | null) => formatValue(v, definition.format, definition.unit);
    const isRanking = metric.visualization !== 'contribution';
    const barColor = !isRanking ? 'bg-teal-500 dark:bg-teal-600' : metric.bar > 80 ? 'bg-red-700 dark:bg-red-800' : 'bg-blue-700 dark:bg-blue-800';
    return (
        <div className="flex flex-col w-full min-w-[120px] gap-1 pr-4">
            <div className="flex justify-between items-end text-xs gap-2">
                <span className="font-bold text-slate-700 dark:text-slate-200">{fmt(metric.avg)}</span>
                {metric.context !== null && (
                    <span className="text-[10px] text-muted-foreground opacity-80" title={isRanking ? 'Máximo del grupo' : 'Total del grupo'}>
                        {isRanking ? 'Mx' : 'Tot'}: {fmt(metric.context)}
                    </span>
                )}
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(metric.bar, 100)}%` }} />
            </div>
        </div>
    );
};

const AmountCell = ({ value, total, currency }: { value: number | null; total: number; currency: string }) => {
    const pct = total > 0 ? ((value ?? 0) / total) * 100 : 0;
    return (
        <div className="flex flex-col w-full min-w-[110px] gap-1 pr-4">
            <div className="flex justify-between items-end text-xs gap-2">
                <span className="font-bold">{value !== null ? formatCurrency(value, { currency }) : '—'}</span>
                <span className="text-[10px] text-muted-foreground opacity-80" title="Total de los recursos de la tabla">
                    Tot: {formatCurrency(total, { currency: 'USD' })}
                </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-teal-500 dark:bg-teal-600" style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
        </div>
    );
};

const DetailsCell = ({ row, config, associatedUrl }: { row: Row; config: UnusedViewConfig; associatedUrl?: (resourceId: string) => string }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setOpen(true)} aria-label="Ver detalle">
                <Eye className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </Button>
            {open && (
                <UnusedDetailModal
                    resource={row}
                    config={config}
                    associatedUrl={associatedUrl?.(row.resource_id)}
                    isOpen={open}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
};

const TableLegend = () => (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md border border-slate-100 dark:border-slate-800">
        <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-700 dark:bg-blue-800" />
            <span><strong>Ranking (intensidad):</strong> % respecto del recurso más cargado (Mx).</span>
        </span>
        <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-600" />
            <span><strong>Contribución (volumen):</strong> % del total del grupo (Tot).</span>
        </span>
    </div>
);

interface UnusedTableProps {
    resources: UnusedResource[];
    config: UnusedViewConfig;
    associatedUrl?: (resourceId: string) => string;
}

export const UnusedTable = ({ resources, config, associatedUrl }: UnusedTableProps) => {
    const hasCost = resources.some((r) => r.cost !== null);
    const hasSavings = resources.some((r) => r.potential_savings !== null);
    const totalCost = useMemo(() => resources.reduce((sum, r) => sum + (r.cost ?? 0), 0), [resources]);
    const totalSavings = useMemo(() => resources.reduce((sum, r) => sum + (r.potential_savings ?? 0), 0), [resources]);
    const tableAttributes = useMemo(() => config.tableAttributes ?? [], [config.tableAttributes]);

    const rows = useMemo<Row[]>(() => resources.map((r) => {
        const row: Row = { ...r, __cost: r.cost ?? 0, __savings: r.potential_savings ?? 0, __diagnosis: DIAGNOSIS_ORDER[r.diagnosis.status] };
        config.tableMetrics.forEach((group, i) => {
            row[`__metric${i}`] = combineMetrics(r.metrics, group)?.avg ?? null;
        });
        tableAttributes.forEach((attr) => {
            row[attributeColumnKey(attr.key)] = r.attributes[attr.key] ?? null;
        });
        return row;
    }), [resources, config.tableMetrics, tableAttributes]);

    const columns = useMemo(() => {
        const cols: DynamicColumn<Row>[] = [
            {
                header: 'Recurso',
                accessorKey: 'resource_name',
                cell: (info: unknown) => <ResourceCell row={rowOf(info)} config={config} />,
                size: 260,
            },
            {
                header: 'Diagnóstico',
                accessorKey: '__diagnosis',
                cell: (info: unknown) => {
                    const diagnosis = rowOf(info).diagnosis;
                    return (
                        <Badge variant="outline" className={`text-[10px] ${DIAGNOSIS[diagnosis.status].className}`} title={diagnosis.reason}>
                            {DIAGNOSIS[diagnosis.status].label}
                        </Badge>
                    );
                },
                size: 130,
            },
            ...(hasCost ? [{
                header: 'Gasto Periodo',
                accessorKey: '__cost',
                desc: true,
                cell: (info: unknown) => {
                    const row = rowOf(info);
                    return <AmountCell value={row.cost} total={totalCost} currency={row.currency} />;
                },
                size: 150,
            }] : []),
            ...(hasSavings ? [{
                header: 'Ahorro Mensual',
                accessorKey: '__savings',
                desc: true,
                cell: (info: unknown) => <AmountCell value={rowOf(info).potential_savings} total={totalSavings} currency="USD" />,
                size: 150,
            }] : []),
            ...tableAttributes.map((attr): DynamicColumn<Row> => ({
                header: attr.label,
                accessorKey: attributeColumnKey(attr.key),
                cell: (info: unknown) => (
                    <span className="text-xs">{formatAttribute(rowOf(info).attributes[attr.key], attr.format, attr.unit)}</span>
                ),
                size: 130,
            })),
            ...config.tableMetrics.map((group, i): DynamicColumn<Row> => {
                const definition = getUnusedMetric(group.metrics[0], config.metricOverrides);
                return {
                    header: group.label,
                    accessorKey: `__metric${i}`,
                    cell: (info: unknown) => <MetricCell row={rowOf(info)} group={group} definition={definition} />,
                    size: 150,
                };
            }),
            {
                header: 'Detalle',
                cell: (info: unknown) => <DetailsCell row={rowOf(info)} config={config} associatedUrl={associatedUrl} />,
                size: 70,
            },
        ];
        return createColumns(cols);
    }, [config, tableAttributes, hasCost, hasSavings, totalCost, totalSavings, associatedUrl]);

    if (resources.length === 0) return null;

    return (
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="border-b dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                        <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold">Métricas comparativas</CardTitle>
                        <CardDescription>Diagnóstico, gasto y uso de cada recurso en el período.</CardDescription>
                    </div>
                </div>
                {config.tableMetrics.length > 0 && <TableLegend />}
            </CardHeader>
            <CardContent className="p-5">
                <DataTableGrouping
                    columns={columns}
                    data={rows}
                    filterColumn="resource_name"
                    filterPlaceholder="Filtrar por nombre..."
                    enableGrouping={!!config.groupByAttribute}
                    groupByColumn={config.groupByAttribute ? attributeColumnKey(config.groupByAttribute) : undefined}
                    pageSizeItems={10}
                />
            </CardContent>
        </Card>
    );
};
