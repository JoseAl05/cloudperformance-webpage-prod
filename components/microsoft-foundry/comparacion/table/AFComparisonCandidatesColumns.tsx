'use client'

import { DynamicColumn } from '@/components/general/data-table/columns';
import { AzureFoundryCandidateRow } from '@/interfaces/foundry-cost-optimization/azureFoundryInterfaces';
import { confidenceClasses, confidenceLabels, deltaClass, formatCurrency, formatScore, formatSignedPercent } from '@/lib/azureFoundryFormatters';
import { cn } from '@/lib/utils';
import { Star, AlertTriangle } from 'lucide-react';

export const getAzureFoundryCandidatesColumns = (): DynamicColumn<AzureFoundryCandidateRow>[] => [
    {
        id: 'azure_model_name',
        accessorKey: 'azure_model_name',
        header: 'Modelo Azure',
        cell: ({ row }) => (
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {row.original.azure_model_name}
            </span>
        ),
        size: 170
    },
    {
        id: 'bedrock_model_name',
        accessorKey: 'bedrock_model_name',
        header: 'Candidato Bedrock',
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                {row.original.is_recommended && (
                    <Star className="h-3 w-3 shrink-0 text-amber-500" />
                )}
                <div className="flex min-w-0 flex-col">
                    <span className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {row.original.bedrock_model_name}
                    </span>
                    <span className="truncate font-mono text-[10px] text-muted-foreground">
                        {row.original.provider} · {row.original.region}
                    </span>
                </div>
            </div>
        ),
        size: 220
    },
    {
        id: 'rank_label',
        accessorKey: 'rank_label',
        header: 'Ranking',
        cell: ({ row }) => (
            <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">
                {row.original.rank_label}
            </span>
        ),
        size: 100
    },
    {
        id: 'equivalence_score',
        accessorKey: 'equivalence_score',
        header: 'Equivalencia',
        cell: ({ row }) => (
            <div className="flex flex-col gap-1">
                <span className="text-xs font-bold tabular-nums text-slate-700 dark:text-slate-200">
                    {formatScore(row.original.equivalence_score)}%
                </span>
                <div className="h-1 w-16 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                        className="h-full rounded-full bg-slate-500 dark:bg-slate-400"
                        style={{ width: `${Math.min(100, Math.max(0, row.original.equivalence_score * 100))}%` }}
                    />
                </div>
            </div>
        ),
        size: 130
    },
    {
        id: 'price_similarity',
        accessorKey: 'price_similarity',
        header: 'Similitud precio',
        cell: ({ row }) => (
            <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">
                {formatScore(row.original.price_similarity)}%
            </span>
        ),
        size: 140
    },
    {
        id: 'dimension_coverage',
        accessorKey: 'dimension_coverage',
        header: 'Cobertura',
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">
                    {formatScore(row.original.dimension_coverage)}%
                </span>
                {row.original.dimension_fallback && (
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                )}
            </div>
        ),
        size: 120
    },
    {
        id: 'confidence',
        accessorKey: 'confidence',
        header: 'Confianza',
        cell: ({ row }) => (
            <span className={cn('rounded-md px-2 py-0.5 text-[10px] font-semibold', confidenceClasses[row.original.confidence])}>
                {confidenceLabels[row.original.confidence]}
            </span>
        ),
        size: 110
    },
    {
        id: 'projected_cost_usd',
        accessorKey: 'projected_cost_usd',
        header: 'Costo proyectado',
        cell: ({ row }) => (
            <span className="text-xs font-bold tabular-nums text-violet-600 dark:text-violet-400">
                {formatCurrency(row.original.projected_cost_usd)}
            </span>
        ),
        size: 150
    },
    {
        id: 'delta_usd',
        accessorKey: 'delta_usd',
        header: 'Diferencia',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className={cn('text-xs font-bold tabular-nums', deltaClass(row.original.delta_usd))}>
                    {formatCurrency(row.original.delta_usd)}
                </span>
                <span className={cn('text-[10px] tabular-nums', deltaClass(row.original.delta_percent))}>
                    {formatSignedPercent(row.original.delta_percent)}
                </span>
            </div>
        ),
        size: 130
    },
    {
        id: 'missing_dimensions_label',
        accessorKey: 'missing_dimensions_label',
        header: 'Sin tarifa',
        cell: ({ row }) => (
            <span className={cn(
                'text-[11px]',
                row.original.missing_dimensions_label === '—'
                    ? 'text-muted-foreground'
                    : 'text-amber-600 dark:text-amber-400'
            )}>
                {row.original.missing_dimensions_label}
            </span>
        ),
        size: 170
    },
    {
        id: 'rationale',
        accessorKey: 'rationale',
        header: 'Justificación',
        cell: ({ row }) => (
            <span className="block max-w-[420px] text-[11px] leading-snug text-muted-foreground">
                {row.original.rationale}
            </span>
        ),
        size: 420
    }
];