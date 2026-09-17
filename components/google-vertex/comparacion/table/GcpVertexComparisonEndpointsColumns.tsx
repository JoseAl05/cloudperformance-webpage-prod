'use client'

import { DynamicColumn } from '@/components/data-table/columns';
import { GcpVertexEndpointRow } from '@/interfaces/vertex-comparison/gcpVertexComparisonInterfaces';
import { formatCurrency, formatPercent, formatTokens } from '@/lib/gcpVertexComparisonFormatters';
import { cn } from '@/lib/utils';

type EndpointCellInfo = {
    row: {
        original: GcpVertexEndpointRow;
    };
};

const getEndpoint = (info: unknown) => (info as EndpointCellInfo).row.original;

export const getGcpVertexEndpointsColumns = (): DynamicColumn<GcpVertexEndpointRow>[] => [
    {
        accessorKey: 'name',
        header: 'Endpoint',
        cell: (info) => {
            const endpoint = getEndpoint(info);
            return (
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {endpoint.name}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                        {endpoint.project_id}
                    </span>
                </div>
            );
        },
        size: 200
    },
    {
        accessorKey: 'gcp_model_name',
        header: 'Modelo',
        cell: (info) => {
            const endpoint = getEndpoint(info);
            return (
                <div className="flex flex-col">
                    <span className="text-xs text-slate-700 dark:text-slate-300">
                        {endpoint.gcp_model_name}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                        v{endpoint.model_version}
                    </span>
                </div>
            );
        },
        size: 180
    },
    {
        accessorKey: 'traffic_percentage',
        header: 'Trafico',
        cell: (info) => {
            const endpoint = getEndpoint(info);
            return (
                <div className="flex flex-col gap-1">
                    <span className="text-xs tabular-nums text-slate-700 dark:text-slate-200">
                        {formatPercent(endpoint.traffic_percentage)}
                    </span>
                    <div className="h-1 w-16 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                            className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400"
                            style={{ width: `${Math.min(100, Math.max(0, endpoint.traffic_percentage))}%` }}
                        />
                    </div>
                </div>
            );
        },
        size: 120
    },
    {
        accessorKey: 'location',
        header: 'Region',
        cell: (info) => {
            const endpoint = getEndpoint(info);
            return (
                <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    {endpoint.location}
                </span>
            );
        },
        size: 110
    },
    {
        accessorKey: 'tokens_input',
        header: 'Tokens entrada',
        cell: (info) => {
            const endpoint = getEndpoint(info);
            return (
                <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">
                    {formatTokens(endpoint.tokens_input)}
                </span>
            );
        },
        size: 130
    },
    {
        accessorKey: 'tokens_output',
        header: 'Tokens salida',
        cell: (info) => {
            const endpoint = getEndpoint(info);
            return (
                <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">
                    {formatTokens(endpoint.tokens_output)}
                </span>
            );
        },
        size: 130
    },
    {
        accessorKey: 'allocation_share',
        header: 'Participacion',
        cell: (info) => {
            const endpoint = getEndpoint(info);
            return (
                <div className="flex flex-col gap-1">
                    <span className="text-xs tabular-nums text-slate-700 dark:text-slate-200">
                        {formatPercent(endpoint.allocation_share * 100)}
                    </span>
                    <div className="h-1 w-16 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                            className="h-full rounded-full bg-sky-500 dark:bg-sky-400"
                            style={{ width: `${Math.min(100, Math.max(0, endpoint.allocation_share * 100))}%` }}
                        />
                    </div>
                </div>
            );
        },
        size: 130
    },
    {
        accessorKey: 'allocated_cost_usd',
        header: 'Costo asignado',
        cell: (info) => {
            const endpoint = getEndpoint(info);
            return (
                <span className="text-xs font-bold tabular-nums text-sky-600 dark:text-sky-400">
                    {formatCurrency(endpoint.allocated_cost_usd)}
                </span>
            );
        },
        size: 150
    },
    {
        accessorKey: 'status_label',
        header: 'Estado',
        cell: (info) => {
            const endpoint = getEndpoint(info);
            return (
                <span className={cn(
                    'rounded-md px-2 py-0.5 text-[10px] font-semibold',
                    endpoint.is_idle
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                )}>
                    {endpoint.status_label}
                </span>
            );
        },
        size: 120
    }
];