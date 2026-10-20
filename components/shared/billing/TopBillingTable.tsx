'use client'

import { useMemo } from 'react';
import type { CellContext, ColumnDef } from '@tanstack/react-table';
import { Calendar, Cloud, FileSpreadsheet, Tag } from 'lucide-react';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { BillingTopItem } from '@/interfaces/billing';

interface TopBillingTableProps {
    items: BillingTopItem[];
    label: string;
    currency: string;
    period: string;
}

type Row = BillingTopItem;

const formatMoney = (value: number, currency: string, maxDecimals = 4) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        currencyDisplay: 'narrowSymbol',
        minimumFractionDigits: 2,
        maximumFractionDigits: maxDecimals,
    }).format(value);

export const TopBillingTable = ({ items, label, currency, period }: TopBillingTableProps) => {
    const rows = useMemo(() => items.filter((item) => item.cost !== 0), [items]);
    const hasDates = rows.some((item) => item.date);

    const columns = useMemo<ColumnDef<Row>[]>(() => [
        {
            accessorKey: 'value',
            header: label,
            cell: ({ getValue }: CellContext<Row, unknown>) => (
                <div className="flex items-center gap-2 min-w-[150px]">
                    <Tag className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-200">{getValue() as string}</span>
                </div>
            ),
        },
        {
            accessorKey: 'service',
            header: 'Servicio',
            cell: ({ getValue }: CellContext<Row, unknown>) => (
                <div className="flex items-center gap-2 min-w-[300px] w-full">
                    <Cloud className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300 font-medium" title={(getValue() as string | null) ?? ''}>
                        {(getValue() as string | null) ?? '-'}
                    </span>
                </div>
            ),
        },
        ...(hasDates ? [{
            accessorKey: 'date',
            header: 'Fecha',
            cell: ({ getValue, row }: CellContext<Row, unknown>) => {
                if (row.getIsGrouped()) return null;
                const value = getValue();
                if (!value || typeof value !== 'string') return '-';
                const [y, m, d] = value.split('-').map(Number);
                const formatted = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('es-CL', {
                    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
                });
                return (
                    <div className="flex items-center gap-2 text-slate-500 min-w-[120px]">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span className="capitalize">{formatted}</span>
                    </div>
                );
            },
        } as ColumnDef<Row>] : []),
        {
            accessorKey: 'cost',
            header: () => <div className="text-right w-full block">Costo ({currency})</div>,
            cell: ({ getValue }: CellContext<Row, unknown>) => (
                <div className="text-right font-mono font-bold text-indigo-700 dark:text-indigo-300 min-w-[100px]">
                    {formatMoney(Number(getValue()), currency)}
                </div>
            ),
        },
    ], [label, currency, hasDates]);

    return (
        <Card className="shadow-sm">
            <CardHeader className="border-b py-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
                    Detalle de Facturación por {label}
                </CardTitle>
                <CardDescription className="mt-1">{period}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="p-2 w-full">
                    <DataTableGrouping
                        columns={columns}
                        data={rows}
                        filterColumn="value"
                        filterPlaceholder={`Buscar ${label.toLowerCase()}...`}
                        enableGrouping
                        groupByColumn="value"
                    />
                </div>
                <div className="border-t px-6 py-3 text-xs text-muted-foreground">
                    Registros totales: <strong>{rows.length}</strong>
                </div>
            </CardContent>
        </Card>
    );
};
