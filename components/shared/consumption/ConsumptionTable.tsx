'use client'

import { useMemo, useState } from 'react';
import { Eye, Server } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createColumns, DynamicColumn } from '@/components/data-table/columns';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { ConsumptionDetailModal, renderField } from '@/components/shared/consumption/ConsumptionDetailModal';
import { formatCurrency } from '@/lib/format';
import { formatDateTime, getResourceValue } from '@/lib/consumption';
import type { ConsumptionResource } from '@/interfaces/consumption';
import type { ConsumptionViewConfig, MetricColumnDef } from '@/components/shared/consumption/types';

// Fila de la tabla: el recurso + valores planos para ordenar/filtrar
type Row = ConsumptionResource & Record<string, unknown>;

const BarCell = ({ value, max, column, row }: { value: number | null; max: number; column: MetricColumnDef; row: Row }) => {
    const pct = value !== null && max > 0 ? Math.min((value / max) * 100, 100) : 0;
    const color = column.format === 'percent'
        ? (value ?? 0) < 5 ? 'bg-red-600' : (value ?? 0) < 20 ? 'bg-amber-500' : 'bg-green-500'
        : 'bg-blue-500';
    return (
        <div className="flex flex-col w-full min-w-[120px] gap-1">
            <div className="flex justify-between items-end text-xs gap-2">
                <span className="font-bold text-slate-700 dark:text-slate-200">{renderField(value, column)}</span>
                {column.secondary && (
                    <span className="text-[10px] text-muted-foreground opacity-80">
                        {column.secondary.label}: {renderField(getResourceValue(row, column.secondary.path), column.secondary)}
                    </span>
                )}
            </div>
            {column.bar && (
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
            )}
        </div>
    );
};

const ClassificationCell = ({ row }: { row: Row }) => {
    const badges = [];
    if (row.is_idle) badges.push(<Badge key="idle" variant="destructive" className="text-[10px]">Idle</Badge>);
    if (row.is_underutilized) badges.push(<Badge key="under" className="bg-amber-500 text-white text-[10px]">Infrautilizado</Badge>);
    if (row.storage_inefficient) badges.push(<Badge key="storage" className="bg-purple-500 text-white text-[10px]">Storage ineficiente</Badge>);
    if (badges.length === 0) badges.push(<Badge key="ok" className="bg-green-500 text-white text-[10px]">Óptimo</Badge>);
    return <div className="flex flex-wrap gap-1">{badges}</div>;
};

const DetailsCell = ({ row, config }: { row: Row; config: ConsumptionViewConfig }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setOpen(true)} aria-label="Ver detalle">
                <Eye className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </Button>
            {open && <ConsumptionDetailModal resource={row} config={config} isOpen={open} onClose={() => setOpen(false)} />}
        </>
    );
};

export const ConsumptionTable = ({ resources, config }: { resources: ConsumptionResource[]; config: ConsumptionViewConfig }) => {
    const rows = useMemo<Row[]>(() => resources.map((r) => {
        const row: Row = { ...r };
        config.tableColumns.forEach((col, i) => { row[`__col${i}`] = getResourceValue(r, col.path) ?? null; });
        row.__cost = r.cost ?? 0;
        return row;
    }), [resources, config.tableColumns]);

    const maxima = useMemo(() => config.tableColumns.map((_, i) =>
        Math.max(0, ...rows.map((row) => Number(row[`__col${i}`] ?? 0)))), [rows, config.tableColumns]);

    const columns = useMemo(() => {
        const cols: DynamicColumn<Row>[] = [
            {
                header: 'Recurso',
                accessorKey: 'resource_name',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cell: ({ row }: any) => (
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800">
                            <Server className="h-3.5 w-3.5 text-slate-500" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-sm truncate max-w-[200px]" title={row.original.resource_name}>{row.original.resource_name}</span>
                            {row.original.resource_id !== row.original.resource_name && (
                                <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[200px]" title={row.original.resource_id}>{row.original.resource_id}</span>
                            )}
                        </div>
                    </div>
                ),
                size: 240,
            },
            {
                header: 'Estado',
                accessorKey: 'status',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cell: (info: any) => info.getValue() ? <Badge variant="outline" className="text-[10px]">{String(info.getValue())}</Badge> : '—',
                size: 120,
            },
            {
                header: 'Ubicación',
                accessorKey: 'region',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cell: ({ row }: any) => (
                    <div className="flex flex-col text-xs text-muted-foreground">
                        <span>{row.original.region ?? '—'}</span>
                        <span className="text-[10px] opacity-70">{row.original.resource_type ?? ''}</span>
                    </div>
                ),
                size: 140,
            },
            ...config.tableColumns.map((col, i): DynamicColumn<Row> => ({
                header: col.label,
                accessorKey: `__col${i}`,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cell: ({ row }: any) => <BarCell value={row.original[`__col${i}`]} max={maxima[i]} column={col} row={row.original} />,
                size: 180,
            })),
            {
                header: 'Clasificación',
                accessorKey: 'is_idle',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cell: ({ row }: any) => <ClassificationCell row={row.original} />,
                size: 150,
            },
            {
                header: 'Costo',
                accessorKey: '__cost',
                desc: true,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cell: ({ row }: any) => row.original.cost !== null
                    ? <span className="text-xs font-bold">{formatCurrency(row.original.cost, { currency: row.original.currency ?? 'USD' })}</span>
                    : <span className="text-xs text-muted-foreground">—</span>,
                size: 130,
            },
            {
                header: 'Sync Time',
                accessorKey: 'sync_time',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cell: (info: any) => <span className="text-xs">{formatDateTime(info.getValue() as string | null)}</span>,
                size: 150,
            },
            {
                header: 'Detalle',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cell: ({ row }: any) => <DetailsCell row={row.original} config={config} />,
                size: 90,
            },
        ];
        return createColumns(cols);
    }, [config, maxima]);

    if (resources.length === 0) return null;

    return (
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="border-b dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                        <Server className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold">Detalle de recursos {config.serviceName}</CardTitle>
                        <CardDescription>Consumo, clasificación y costo de cada recurso en el período.</CardDescription>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2"><strong>Barras:</strong> % relativo al máximo visible.</p>
            </CardHeader>
            <CardContent className="p-0">
                <DataTableGrouping
                    columns={columns}
                    data={rows}
                    filterColumn="resource_name"
                    filterPlaceholder="Filtrar por nombre..."
                    pageSizeItems={10}
                />
            </CardContent>
        </Card>
    );
};
