'use client'

import { DynamicColumn } from '@/components/data-table/columns';
import { AwsBedrockResourceRow } from '@/interfaces/bedrock-comparison/awsBedrockComparisonInterfaces';
import { formatCurrency, formatPercent, formatTokens } from '@/lib/awsBedrockComparisonFormatters';
import { cn } from '@/lib/utils';

type ResourceCellInfo = {
    row: {
        original: AwsBedrockResourceRow;
    };
};

const getResource = (info: unknown) => (info as ResourceCellInfo).row.original;

export const getBMComparisonResourcesColumns = (): DynamicColumn<AwsBedrockResourceRow>[] => [
    {
        accessorKey: 'name',
        header: 'Recurso',
        cell: (info) => (
            <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {getResource(info).name}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                    {getResource(info).resource_id}
                </span>
            </div>
        ),
        size: 220
    },
    {
        accessorKey: 'aws_model_name',
        header: 'Modelo',
        cell: (info) => (
            <div className="flex flex-col">
                <span className="text-xs text-slate-700 dark:text-slate-300">
                    {getResource(info).aws_model_name}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                    {getResource(info).aws_model_id}
                </span>
            </div>
        ),
        size: 200
    },
    {
        accessorKey: 'resource_type_label',
        header: 'Tipo',
        cell: (info) => (
            <div className="flex flex-col">
                <span className="text-xs text-slate-700 dark:text-slate-300">
                    {getResource(info).resource_type_label}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                    {getResource(info).price_variant}
                </span>
            </div>
        ),
        size: 150
    },
    {
        accessorKey: 'location',
        header: 'Región',
        cell: (info) => (
            <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                {getResource(info).location}
            </span>
        ),
        size: 110
    },
    {
        accessorKey: 'tokens_input',
        header: 'Tokens entrada',
        cell: (info) => (
            <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">
                {formatTokens(getResource(info).tokens_input)}
            </span>
        ),
        size: 130
    },
    {
        accessorKey: 'tokens_output',
        header: 'Tokens salida',
        cell: (info) => (
            <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">
                {formatTokens(getResource(info).tokens_output)}
            </span>
        ),
        size: 130
    },
    {
        accessorKey: 'allocation_share',
        header: 'Participación',
        cell: (info) => (
            <div className="flex flex-col gap-1">
                <span className="text-xs tabular-nums text-slate-700 dark:text-slate-200">
                    {formatPercent(getResource(info).allocation_share * 100)}
                </span>
                <div className="h-1 w-16 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                        className="h-full rounded-full bg-sky-500 dark:bg-sky-400"
                        style={{ width: `${Math.min(100, Math.max(0, getResource(info).allocation_share * 100))}%` }}
                    />
                </div>
            </div>
        ),
        size: 130
    },
    {
        accessorKey: 'allocated_cost_usd',
        header: 'Costo asignado',
        cell: (info) => (
            <span className="text-xs font-bold tabular-nums text-sky-600 dark:text-sky-400">
                {formatCurrency(getResource(info).allocated_cost_usd)}
            </span>
        ),
        size: 150
    },
    {
        accessorKey: 'status_label',
        header: 'Estado',
        cell: (info) => (
            <span className={cn(
                'rounded-md px-2 py-0.5 text-[10px] font-semibold',
                getResource(info).is_idle
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
            )}>
                {getResource(info).status_label}
            </span>
        ),
        size: 120
    }
];
