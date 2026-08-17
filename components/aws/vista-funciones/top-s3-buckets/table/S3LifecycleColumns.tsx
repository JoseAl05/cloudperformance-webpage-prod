'use client'

import { DynamicColumn } from '@/components/general/data-table/columns';
import { Database } from 'lucide-react';
import { S3LifecycleRow, S3LifecycleHistoryRow } from '@/interfaces/vista-top-s3-buckets/topS3BucketsInterfaces';

const statusClass = (value: string | null): string => {
    if (value === 'Enabled') return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    if (value === 'Disabled') return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
    return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
};

const PlainCell = ({ value }: { value: string }) => (
    <span className="text-[11px] text-slate-700 dark:text-slate-200">
        {value}
    </span>
);

export const getS3LifecycleColumns = (): DynamicColumn<S3LifecycleRow>[] => [
    {
        header: "Bucket",
        accessorKey: "resource",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <div className="p-2 rounded border shrink-0">
                    <Database className="h-4 w-4" />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-mono text-slate-700 dark:text-slate-200 truncate">
                        {row.original.resource}
                    </span>
                </div>
            </div>
        ),
        size: 240
    },
    {
        id: "rule_id",
        accessorKey: "rule_id",
        header: "Regla",
        cell: ({ row }) => (
            <span className="text-[10px] text-muted-foreground font-mono truncate">
                {row.original.rule_id}
            </span>
        ),
        size: 180
    },
    {
        id: "status",
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => (
            <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${statusClass(row.original.status)}`}>
                {row.original.status_label}
            </span>
        ),
        size: 130
    },
    {
        id: "prefix_label",
        accessorKey: "prefix_label",
        header: "Prefijo",
        cell: ({ row }) => (
            <span className="text-[10px] text-muted-foreground font-mono truncate">
                {row.original.prefix_label}
            </span>
        ),
        size: 140
    },
    {
        id: "transitions_label",
        accessorKey: "transitions_label",
        header: "Transiciones",
        cell: ({ row }) => <PlainCell value={row.original.transitions_label} />,
        size: 190
    },
    {
        id: "noncurrent_transitions_label",
        accessorKey: "noncurrent_transitions_label",
        header: "Transiciones No Vigentes",
        cell: ({ row }) => <PlainCell value={row.original.noncurrent_transitions_label} />,
        size: 200
    },
    {
        id: "expiration_label",
        accessorKey: "expiration_label",
        header: "Expiración",
        cell: ({ row }) => <PlainCell value={row.original.expiration_label} />,
        size: 150
    },
    {
        id: "noncurrent_expiration_label",
        accessorKey: "noncurrent_expiration_label",
        header: "Expiración No Vigente",
        cell: ({ row }) => <PlainCell value={row.original.noncurrent_expiration_label} />,
        size: 160
    },
    {
        id: "abort_multipart_label",
        accessorKey: "abort_multipart_label",
        header: "Multipart Abortado",
        cell: ({ row }) => <PlainCell value={row.original.abort_multipart_label} />,
        size: 150
    }
];

export const getS3LifecycleHistoryColumns = (): DynamicColumn<S3LifecycleHistoryRow>[] => [
    {
        header: "Sincronización",
        accessorKey: "sync_time_label",
        cell: ({ row }) => (
            <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                {row.original.sync_time_label}
            </span>
        ),
        size: 200
    },
    {
        id: "buckets",
        accessorKey: "buckets",
        header: "Buckets",
        cell: ({ row }) => (
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tabular-nums">
                {row.original.buckets.toLocaleString('es-CL')}
            </span>
        ),
        size: 110
    },
    {
        id: "rules",
        accessorKey: "rules",
        header: "Reglas",
        cell: ({ row }) => (
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tabular-nums">
                {row.original.rules.toLocaleString('es-CL')}
            </span>
        ),
        size: 110
    },
    {
        id: "enabled",
        accessorKey: "enabled",
        header: "Habilitadas",
        cell: ({ row }) => (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {row.original.enabled.toLocaleString('es-CL')}
            </span>
        ),
        size: 120
    }
];