'use client'

import { DynamicColumn } from '@/components/general/data-table/columns';
import { Database } from 'lucide-react';
import { S3VersioningRow, S3VersioningChangeRow } from '@/interfaces/vista-top-s3-buckets/topS3BucketsInterfaces';

const statusClass = (value: string | null): string => {
    if (value === 'Enabled') return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    if (value === 'Suspended') return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
};

const StatusBadge = ({ value, label }: { value: string | null, label: string }) => (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${statusClass(value)}`}>
        {label}
    </span>
);

export const getS3VersioningColumns = (): DynamicColumn<S3VersioningRow>[] => [
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
        size: 260
    },
    {
        id: "status",
        accessorKey: "status",
        header: "Versionamiento",
        cell: ({ row }) => (
            <StatusBadge value={row.original.status} label={row.original.status_label} />
        ),
        size: 140
    },
    {
        id: "mfa_delete",
        accessorKey: "mfa_delete",
        header: "MFA Delete",
        cell: ({ row }) => (
            <StatusBadge value={row.original.mfa_delete} label={row.original.mfa_delete_label} />
        ),
        size: 140
    },
    {
        id: "region",
        accessorKey: "region",
        header: "Región",
        cell: ({ row }) => (
            <span className="text-[10px] text-muted-foreground font-mono truncate">
                {row.original.region ?? '-'}
            </span>
        ),
        size: 120
    }
];

export const getS3VersioningChangesColumns = (): DynamicColumn<S3VersioningChangeRow>[] => [
    {
        header: "Sincronización",
        accessorKey: "sync_time_label",
        cell: ({ row }) => (
            <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                {row.original.sync_time_label}
            </span>
        ),
        size: 170
    },
    {
        id: "resource",
        accessorKey: "resource",
        header: "Bucket",
        cell: ({ row }) => (
            <span className="text-xs font-mono text-slate-700 dark:text-slate-200 truncate">
                {row.original.resource}
            </span>
        ),
        size: 260
    },
    {
        id: "previous_state",
        accessorKey: "previous_state",
        header: "Estado Anterior",
        cell: ({ row }) => (
            <span className="text-[11px] text-muted-foreground">
                {row.original.previous_state}
            </span>
        ),
        size: 200
    },
    {
        id: "current_state",
        accessorKey: "current_state",
        header: "Estado Nuevo",
        cell: ({ row }) => (
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-200">
                {row.original.current_state}
            </span>
        ),
        size: 200
    }
];