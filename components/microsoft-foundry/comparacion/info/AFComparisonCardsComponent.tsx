'use client'

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Cloud, TrendingDown, Layers, Server, ShieldCheck } from 'lucide-react';
import { AzureFoundryComparison } from '@/interfaces/foundry-cost-optimization/azureFoundryInterfaces';
import { deltaClass, formatCurrency, formatInteger, formatPercent, formatSignedPercent } from '@/lib/azureFoundryFormatters';

interface AzureFoundrySummaryCardsProps {
    data: AzureFoundryComparison;
}

export const AzureFoundrySummaryCards = ({ data }: AzureFoundrySummaryCardsProps) => {
    const summary = data.summary;

    const cards = useMemo(() => ([
        {
            key: 'azure',
            label: 'Costo Azure Foundry',
            value: formatCurrency(summary.azure_cost_usd),
            hint: `${formatInteger(summary.models_total)} modelos facturados`,
            icon: Cloud,
            tone: 'text-sky-600 dark:text-sky-400',
            surface: 'bg-sky-50 dark:bg-sky-950/40'
        },
        {
            key: 'bedrock',
            label: 'Proyección AWS Bedrock',
            value: formatCurrency(summary.bedrock_projected_cost_usd),
            hint: `Cobertura ${formatPercent(summary.coverage_percent)} del gasto`,
            icon: Layers,
            tone: 'text-violet-600 dark:text-violet-400',
            surface: 'bg-violet-50 dark:bg-violet-950/40'
        },
        {
            key: 'delta',
            label: 'Diferencia estimada',
            value: formatCurrency(summary.delta_usd),
            hint: formatSignedPercent(summary.delta_percent),
            icon: TrendingDown,
            tone: deltaClass(summary.delta_usd),
            surface: 'bg-slate-50 dark:bg-slate-900/40'
        },
        {
            key: 'deployments',
            label: 'Despliegues',
            value: formatInteger(summary.deployments_total),
            hint: `${formatInteger(summary.deployments_idle)} sin consumo`,
            icon: Server,
            tone: 'text-slate-700 dark:text-slate-300',
            surface: 'bg-slate-50 dark:bg-slate-900/40'
        },
        {
            key: 'unmapped',
            label: 'Modelos sin equivalencia',
            value: formatInteger(summary.models_unmapped),
            hint: summary.models_unmapped > 0 ? 'Valorizados a costo Azure' : 'Todos con equivalente',
            icon: ShieldCheck,
            tone: summary.models_unmapped > 0
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-emerald-600 dark:text-emerald-400',
            surface: summary.models_unmapped > 0
                ? 'bg-amber-50 dark:bg-amber-950/40'
                : 'bg-emerald-50 dark:bg-emerald-950/40'
        }
    ]), [summary]);

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
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
                                <span className={cn('text-lg font-bold tabular-nums', card.tone)}>
                                    {card.value}
                                </span>
                                <span className="truncate text-[11px] text-muted-foreground">
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