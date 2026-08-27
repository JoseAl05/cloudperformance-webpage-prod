'use client'

import { DynamicColumn } from '@/components/general/data-table/columns';
import { cn } from '@/lib/utils';
import { AzureFoundryModelRow } from '@/interfaces/vista-azure-foundry/azureFoundryInterfaces';
import {
    formatCurrency,
    formatSignedPercent,
    formatTokens,
    formatInteger,
    formatPricePerMillion,
    confidenceLabels,
    confidenceClasses,
    deltaClass
} from '@/lib/azureFoundryFormatters';

export const getAzureFoundryModelsColumns = (): DynamicColumn<AzureFoundryModelRow>[] => [
    {
        id: 'azure_model_name',
        accessorKey: 'azure_model_name',
        header: 'Modelo Azure',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {row.original.azure_model_name}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                    v{row.original.azure_model_version}
                </span>
            </div>
        ),
        size: 190
    },
    {
        id: 'model_class_label',
        accessorKey: 'model_class_label',
        header: 'Clase',
        cell: ({ row }) => (
            <span className="text-xs text-slate-600 dark:text-slate-400">
                {row.original.model_class_label}
            </span>
        ),
        size: 150
    },
    {
        id: 'deployment_type',
        accessorKey: 'deployment_type',
        header: 'Despliegue',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-xs text-slate-700 dark:text-slate-300">
                    {row.original.deployment_type}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                    {row.original.azure_location} → {row.original.aws_region}
                </span>
            </div>
        ),
        size: 160
    },
    {
        id: 'tokens_total',
        accessorKey: 'tokens_total',
        header: 'Tokens',
        cell: ({ row }) => (
            <span className="text-xs font-bold tabular-nums text-slate-700 dark:text-slate-200">
                {formatTokens(row.original.tokens_total)}
            </span>
        ),
        size: 100
    },
    {
        id: 'blended_price_per_1m_usd',
        accessorKey: 'blended_price_per_1m_usd',
        header: 'Precio mezclado',
        cell: ({ row }) => (
            <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">
                {formatPricePerMillion(row.original.blended_price_per_1m_usd)}
            </span>
        ),
        size: 140
    },
    {
        id: 'azure_cost_usd',
        accessorKey: 'azure_cost_usd',
        header: 'Costo Azure',
        cell: ({ row }) => (
            <span className="text-xs font-bold tabular-nums text-sky-600 dark:text-sky-400">
                {formatCurrency(row.original.azure_cost_usd)}
            </span>
        ),
        size: 130
    },
    {
        id: 'recommended_model',
        accessorKey: 'recommended_model',
        header: 'Equivalente sugerido',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {row.original.recommended_model}
                </span>
                <span className="text-[10px] text-muted-foreground">
                    {formatInteger(row.original.candidates_total)} candidatos evaluados
                </span>
            </div>
        ),
        size: 200
    },
    {
        id: 'recommended_confidence',
        accessorKey: 'recommended_confidence',
        header: 'Confianza',
        cell: ({ row }) => {
            const value = row.original.recommended_confidence;
            if (!confidenceLabels[value]) {
                return <span className="text-xs text-muted-foreground">—</span>;
            }
            return (
                <span className={cn('rounded-md px-2 py-0.5 text-[10px] font-semibold', confidenceClasses[value])}>
                    {confidenceLabels[value]}
                </span>
            );
        },
        size: 110
    },
    {
        id: 'recommended_cost_usd',
        accessorKey: 'recommended_cost_usd',
        header: 'Costo Bedrock',
        cell: ({ row }) => (
            <span className="text-xs font-bold tabular-nums text-violet-600 dark:text-violet-400">
                {formatCurrency(row.original.recommended_cost_usd)}
            </span>
        ),
        size: 140
    },
    {
        id: 'recommended_delta_usd',
        accessorKey: 'recommended_delta_usd',
        header: 'Diferencia',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className={cn('text-xs font-bold tabular-nums', deltaClass(row.original.recommended_delta_usd))}>
                    {formatCurrency(row.original.recommended_delta_usd)}
                </span>
                <span className={cn('text-[10px] tabular-nums', deltaClass(row.original.recommended_delta_percent))}>
                    {formatSignedPercent(row.original.recommended_delta_percent)}
                </span>
            </div>
        ),
        size: 130
    },
    {
        id: 'deployments_total',
        accessorKey: 'deployments_total',
        header: 'Despliegues',
        cell: ({ row }) => (
            <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">
                {formatInteger(row.original.deployments_total)}
                {row.original.deployments_idle > 0 && (
                    <span className="ml-1 text-amber-600 dark:text-amber-400">
                        ({formatInteger(row.original.deployments_idle)} inactivos)
                    </span>
                )}
            </span>
        ),
        size: 140
    },
    {
        id: 'deprecation_label',
        accessorKey: 'deprecation_label',
        header: 'Retiro',
        cell: ({ row }) => (
            <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">
                {row.original.deprecation_label}
            </span>
        ),
        size: 120
    }
];