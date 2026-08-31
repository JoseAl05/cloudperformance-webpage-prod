'use client'

import { DynamicColumn } from '@/components/data-table/columns';
import { AzureFoundryDeploymentRow } from '@/interfaces/foundry-cost-optimization/azureFoundryInterfaces';
import { formatCurrency, formatInteger, formatPercent, formatTokens } from '@/lib/azureFoundryFormatters';
import { cn } from '@/lib/utils';

export const getAzureFoundryDeploymentsColumns = (): DynamicColumn<AzureFoundryDeploymentRow>[] => [
    {
        id: 'name',
        accessorKey: 'name',
        header: 'Despliegue',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {row.original.name}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                    {row.original.resource_group}
                </span>
            </div>
        ),
        size: 200
    },
    {
        id: 'azure_model_name',
        accessorKey: 'azure_model_name',
        header: 'Modelo',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-xs text-slate-700 dark:text-slate-300">
                    {row.original.azure_model_name}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                    v{row.original.model_version}
                </span>
            </div>
        ),
        size: 180
    },
    {
        id: 'sku_name',
        accessorKey: 'sku_name',
        header: 'SKU',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-xs text-slate-700 dark:text-slate-300">
                    {row.original.sku_name}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                    {formatInteger(row.original.sku_capacity)} capacidad
                </span>
            </div>
        ),
        size: 150
    },
    {
        id: 'location',
        accessorKey: 'location',
        header: 'Región',
        cell: ({ row }) => (
            <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                {row.original.location}
            </span>
        ),
        size: 110
    },
    {
        id: 'tokens_input',
        accessorKey: 'tokens_input',
        header: 'Tokens entrada',
        cell: ({ row }) => (
            <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">
                {formatTokens(row.original.tokens_input)}
            </span>
        ),
        size: 130
    },
    {
        id: 'tokens_output',
        accessorKey: 'tokens_output',
        header: 'Tokens salida',
        cell: ({ row }) => (
            <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">
                {formatTokens(row.original.tokens_output)}
            </span>
        ),
        size: 130
    },
    {
        id: 'allocation_share',
        accessorKey: 'allocation_share',
        header: 'Participación',
        cell: ({ row }) => (
            <div className="flex flex-col gap-1">
                <span className="text-xs tabular-nums text-slate-700 dark:text-slate-200">
                    {formatPercent(row.original.allocation_share * 100)}
                </span>
                <div className="h-1 w-16 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                        className="h-full rounded-full bg-sky-500 dark:bg-sky-400"
                        style={{ width: `${Math.min(100, Math.max(0, row.original.allocation_share * 100))}%` }}
                    />
                </div>
            </div>
        ),
        size: 130
    },
    {
        id: 'allocated_cost_usd',
        accessorKey: 'allocated_cost_usd',
        header: 'Costo asignado',
        cell: ({ row }) => (
            <span className="text-xs font-bold tabular-nums text-sky-600 dark:text-sky-400">
                {formatCurrency(row.original.allocated_cost_usd)}
            </span>
        ),
        size: 150
    },
    {
        id: 'status_label',
        accessorKey: 'status_label',
        header: 'Estado',
        cell: ({ row }) => (
            <span className={cn(
                'rounded-md px-2 py-0.5 text-[10px] font-semibold',
                row.original.is_idle
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
            )}>
                {row.original.status_label}
            </span>
        ),
        size: 120
    }
];