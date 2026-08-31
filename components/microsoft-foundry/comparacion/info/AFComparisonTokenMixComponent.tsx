'use client'

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Lightbulb } from 'lucide-react';
import { AzureFoundryModel } from '@/interfaces/foundry-cost-optimization/azureFoundryInterfaces';
import { formatCurrency, formatPercent, formatTokens } from '@/lib/azureFoundryFormatters';

interface AzureFoundryTokenMixComponentProps {
    data: AzureFoundryModel[];
}

type MixDimension = 'input' | 'cache_read' | 'cache_write' | 'output';
type MixMetric = 'tokens' | 'cost';

const DIMENSIONS: MixDimension[] = ['input', 'cache_read', 'cache_write', 'output'];

const DIMENSION_COLOR: Record<MixDimension, string> = {
    input: 'bg-blue-600 dark:bg-blue-500',
    cache_read: 'bg-teal-600 dark:bg-teal-500',
    cache_write: 'bg-fuchsia-600 dark:bg-fuchsia-500',
    output: 'bg-orange-600 dark:bg-orange-500'
};

const DIMENSION_SWATCH: Record<MixDimension, string> = {
    input: 'bg-blue-600 dark:bg-blue-400',
    cache_read: 'bg-teal-600 dark:bg-teal-400',
    cache_write: 'bg-fuchsia-600 dark:bg-fuchsia-400',
    output: 'bg-orange-600 dark:bg-orange-400'
};

const INSIGHT_THRESHOLD = 15;

interface MixRow {
    model: string;
    values: Record<MixDimension, { tokens: number; cost: number }>;
    totalTokens: number;
    totalCost: number;
}

export const AzureFoundryTokenMixComponent = ({ data }: AzureFoundryTokenMixComponentProps) => {
    const [metric, setMetric] = useState<MixMetric>('tokens');

    const dimensionLabels = useMemo(() => {
        const labels: Record<MixDimension, string> = {
            input: 'Entrada',
            cache_read: 'Caché lectura',
            cache_write: 'Caché escritura',
            output: 'Salida'
        };
        (data || []).forEach((model) => {
            model.usage.forEach((usage) => {
                if (DIMENSIONS.includes(usage.dimension as MixDimension) && usage.dimension_label) {
                    labels[usage.dimension as MixDimension] = usage.dimension_label;
                }
            });
        });
        return labels;
    }, [data]);

    const rows = useMemo<MixRow[]>(() => {
        return (data || [])
            .map((model) => {
                const values = DIMENSIONS.reduce((acc, dimension) => {
                    const usage = model.usage.find((item) => item.dimension === dimension);
                    acc[dimension] = { tokens: usage?.tokens ?? 0, cost: usage?.cost_usd ?? 0 };
                    return acc;
                }, {} as Record<MixDimension, { tokens: number; cost: number }>);

                const totalTokens = DIMENSIONS.reduce((sum, dimension) => sum + values[dimension].tokens, 0);
                const totalCost = DIMENSIONS.reduce((sum, dimension) => sum + values[dimension].cost, 0);

                return { model: model.azure_model_name, values, totalTokens, totalCost };
            })
            .sort((a, b) => b.totalCost - a.totalCost);
    }, [data]);

    const shareFor = (row: MixRow, dimension: MixDimension, byMetric: MixMetric) => {
        const total = byMetric === 'tokens' ? row.totalTokens : row.totalCost;
        const value = byMetric === 'tokens' ? row.values[dimension].tokens : row.values[dimension].cost;
        return total > 0 ? (value / total) * 100 : 0;
    };

    const cacheShare = useMemo(() => {
        let cacheAmount = 0;
        let grandTotal = 0;
        rows.forEach((row) => {
            const total = metric === 'tokens' ? row.totalTokens : row.totalCost;
            const cache = metric === 'tokens'
                ? row.values.cache_read.tokens + row.values.cache_write.tokens
                : row.values.cache_read.cost + row.values.cache_write.cost;
            cacheAmount += cache;
            grandTotal += total;
        });
        return grandTotal > 0 ? (cacheAmount / grandTotal) * 100 : 0;
    }, [rows, metric]);

    const insight = useMemo(() => {
        const candidates = rows.flatMap((row) =>
            DIMENSIONS.map((dimension) => {
                const tokenShare = shareFor(row, dimension, 'tokens');
                const costShare = shareFor(row, dimension, 'cost');
                return { model: row.model, dimension, tokenShare, costShare, gap: Math.abs(tokenShare - costShare) };
            })
        );
        const best = candidates.reduce<typeof candidates[number] | null>(
            (acc, item) => (!acc || item.gap > acc.gap ? item : acc),
            null
        );
        return best && best.gap >= INSIGHT_THRESHOLD ? best : null;
    }, [rows]);

    return (
        <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex gap-1 rounded-lg border border-slate-200 p-1 dark:border-slate-800">
                        <Button
                            type="button"
                            size="sm"
                            variant={metric === 'tokens' ? 'default' : 'ghost'}
                            className="h-7 px-3 text-[11px]"
                            onClick={() => setMetric('tokens')}
                        >
                            Tokens
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant={metric === 'cost' ? 'default' : 'ghost'}
                            className="h-7 px-3 text-[11px]"
                            onClick={() => setMetric('cost')}
                        >
                            Costo
                        </Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        {DIMENSIONS.map((dimension) => (
                            <span key={dimension} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                <span className={cn('h-2.5 w-2.5 rounded-sm', DIMENSION_SWATCH[dimension])} />
                                {dimensionLabels[dimension]}
                            </span>
                        ))}
                        <span className="text-[11px] font-medium text-muted-foreground">
                            Caché: {formatPercent(cacheShare)} del {metric === 'tokens' ? 'total de tokens' : 'costo total'}
                        </span>
                    </div>
                </div>

                {rows.length === 0 ? (
                    <div className="py-10 text-center text-sm text-muted-foreground">Sin modelos para comparar.</div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {rows.map((row) => (
                            <div key={row.model} className="grid grid-cols-1 gap-1.5 sm:grid-cols-[160px_1fr] sm:items-center sm:gap-3">
                                <div className="flex flex-col sm:items-end sm:text-right">
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{row.model}</span>
                                    <span className="font-mono text-[10px] text-muted-foreground">
                                        {metric === 'tokens' ? `${formatTokens(row.totalTokens)} tok` : formatCurrency(row.totalCost)}
                                    </span>
                                </div>
                                <div className="flex h-8 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
                                    {DIMENSIONS.map((dimension) => {
                                        const share = shareFor(row, dimension, metric);
                                        if (share <= 0) return null;
                                        return (
                                            <div
                                                key={dimension}
                                                className={cn(
                                                    'flex items-center justify-center border-l-2 border-white first:border-l-0 dark:border-slate-900',
                                                    DIMENSION_COLOR[dimension]
                                                )}
                                                style={{ width: `${share}%` }}
                                                title={`${dimensionLabels[dimension]}: ${formatPercent(share)}`}
                                            >
                                                {share >= 8 && (
                                                    <span className="whitespace-nowrap text-[10px] font-bold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
                                                        {formatPercent(share)}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {insight && (
                    <div className="mt-4 flex gap-2.5 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-600 dark:bg-slate-900/50 dark:text-slate-300">
                        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />
                        <span>
                            <strong className="text-slate-800 dark:text-slate-100">{insight.model} es el caso a mirar:</strong>{' '}
                            {dimensionLabels[insight.dimension]} representa el {formatPercent(insight.tokenShare)} de los tokens
                            y el {formatPercent(insight.costShare)} del costo &mdash; la mezcla de consumo no se parece a la de gasto.
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
