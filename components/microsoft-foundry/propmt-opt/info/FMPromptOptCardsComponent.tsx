'use client'

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Binary, DollarSign, Hash, Percent, Sparkles, TrendingDown } from 'lucide-react';
import { formatMicroCurrency, formatInteger, formatPercent } from '@/lib/azureFoundryFormatters';
import { PromptOptimizationResponse } from '@/interfaces/foundry-cost-optimization/promptOptimizationInterfaces';

interface FMPromptOptCardsComponentProps {
    data: PromptOptimizationResponse;
}

export const FMPromptOptCardsComponent = ({ data }: FMPromptOptCardsComponentProps) => {
    const original = data.original_prompt;
    const optimized = data.optimized_prompt;

    const cards = useMemo(() => {
        const saved = data.token_difference;
        const savedTone = saved > 0
            ? 'text-emerald-600 dark:text-emerald-400'
            : saved < 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-slate-700 dark:text-slate-300';
        const savedSurface = saved > 0
            ? 'bg-emerald-50 dark:bg-emerald-950/40'
            : saved < 0
                ? 'bg-red-50 dark:bg-red-950/40'
                : 'bg-slate-50 dark:bg-slate-900/40';

        const costSaved = data.cost_difference_usd ?? null;
        const costTone = costSaved === null || costSaved === 0
            ? 'text-slate-700 dark:text-slate-300'
            : costSaved > 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400';
        const costSurface = costSaved === null || costSaved === 0
            ? 'bg-slate-50 dark:bg-slate-900/40'
            : costSaved > 0
                ? 'bg-emerald-50 dark:bg-emerald-950/40'
                : 'bg-red-50 dark:bg-red-950/40';

        return [
            {
                key: 'original',
                label: 'Tokens originales',
                value: formatInteger(original.token_count),
                hint: `${formatInteger(original.text.length)} caracteres · ${formatMicroCurrency(original.token_price)}`,
                icon: Hash,
                tone: 'text-sky-600 dark:text-sky-400',
                surface: 'bg-sky-50 dark:bg-sky-950/40'
            },
            {
                key: 'optimized',
                label: 'Tokens optimizados',
                value: formatInteger(optimized.token_count),
                hint: `${formatInteger(optimized.text.length)} caracteres · ${formatMicroCurrency(optimized.token_price)}`,
                icon: Sparkles,
                tone: 'text-violet-600 dark:text-violet-400',
                surface: 'bg-violet-50 dark:bg-violet-950/40'
            },
            {
                key: 'difference',
                label: saved < 0 ? 'Tokens agregados' : 'Tokens ahorrados',
                value: formatInteger(Math.abs(saved)),
                hint: saved > 0
                    ? 'Menos tokens por cada llamada'
                    : saved < 0
                        ? 'La compresión no redujo el prompt'
                        : 'Sin cambios respecto al original',
                icon: TrendingDown,
                tone: savedTone,
                surface: savedSurface
            },
            {
                key: 'percentage',
                label: 'Reducción',
                value: formatPercent(data.token_difference_percentage),
                hint: 'Sobre el total de tokens originales',
                icon: Percent,
                tone: savedTone,
                surface: savedSurface
            },
            {
                key: 'cost',
                label: costSaved !== null && costSaved < 0 ? 'Costo adicional' : 'Ahorro estimado',
                value: formatMicroCurrency(costSaved === null ? null : Math.abs(costSaved)),
                hint: costSaved === null
                    ? 'Sin precio disponible para este modelo'
                    : `${formatMicroCurrency(original.token_price)} → ${formatMicroCurrency(optimized.token_price)}`,
                icon: DollarSign,
                tone: costTone,
                surface: costSurface
            },
            {
                key: 'encoding',
                label: 'Codificación',
                value: data.encoding_name,
                hint: data.model,
                icon: Binary,
                tone: 'text-slate-700 dark:text-slate-300',
                surface: 'bg-slate-50 dark:bg-slate-900/40'
            }
        ];
    }, [data, original, optimized]);

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <Card key={card.key} className="border-slate-200 dark:border-slate-800">
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className={cn('rounded-lg p-2', card.surface)}>
                                <Icon className={cn('h-4 w-4', card.tone)} />
                            </div>
                            <div className="flex min-w-0 flex-col">
                                <span className="truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                    {card.label}
                                </span>
                                <span className={cn('truncate text-lg font-bold tabular-nums', card.tone)}>
                                    {card.value}
                                </span>
                                <span className="truncate text-[11px] text-muted-foreground" title={card.hint}>
                                    {card.hint}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};
