'use client'

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AzureFoundryCandidateConfidenceRow, AzureFoundryModel, AzureFoundryProviderKey } from '@/interfaces/foundry-cost-optimization/azureFoundryInterfaces';
import { confidenceClasses, confidenceLabels, deltaClass, formatCurrency, formatPercent, formatSignedPercent } from '@/lib/azureFoundryFormatters';

interface AzureFoundryCandidateConfidenceComponentProps {
    data: AzureFoundryModel[];
    provider: AzureFoundryProviderKey;
}

interface CandidateGroup {
    azure_model_name: string;
    rows: AzureFoundryCandidateConfidenceRow[];
}

const CONFIDENCE_METER_COLOR: Record<string, string> = {
    HIGH: 'bg-emerald-600 dark:bg-emerald-400',
    MEDIUM: 'bg-amber-600 dark:bg-amber-400',
    LOW: 'bg-slate-400 dark:bg-slate-500'
};

export const AzureFoundryCandidateConfidenceComponent = ({ data, provider }: AzureFoundryCandidateConfidenceComponentProps) => {
    const groups = useMemo<CandidateGroup[]>(() => {
        return (data || []).map((model) => {
            const rows: AzureFoundryCandidateConfidenceRow[] = model[provider].candidates
                .map((candidate) => ({
                    azure_model_name: model.azure_model_name,
                    candidate_model_name: candidate.model_name,
                    provider: candidate.provider || '—',
                    region: candidate.region || '—',
                    equivalence_score: candidate.equivalence_score,
                    delta_percent: candidate.delta_percent,
                    projected_cost_usd: candidate.projected_cost_usd,
                    confidence: candidate.confidence,
                    is_recommended: candidate.is_recommended,
                    is_eligible: candidate.rank !== null
                }))
                .sort((a, b) => {
                    if (a.is_recommended !== b.is_recommended) return a.is_recommended ? -1 : 1;
                    if (a.is_eligible !== b.is_eligible) return a.is_eligible ? -1 : 1;
                    return b.equivalence_score - a.equivalence_score;
                });
            return { azure_model_name: model.azure_model_name, rows };
        });
    }, [data, provider]);

    if (groups.length === 0) {
        return (
            <Card className="border-slate-200 dark:border-slate-800">
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                    Sin modelos para mostrar.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-5">
                <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-slate-100 pb-4 text-[11px] text-muted-foreground dark:border-slate-800">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-sm bg-emerald-600 dark:bg-emerald-400" />
                        Confianza alta
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-sm bg-amber-600 dark:bg-amber-400" />
                        Confianza media
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-sm bg-slate-400 dark:bg-slate-500" />
                        Confianza baja
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-3 w-0.5 rounded-full bg-slate-700 dark:bg-slate-300" />
                        Umbral mínimo de equivalencia (50%)
                    </span>
                    <span>★ Recomendado</span>
                </div>

                <div className="flex flex-col">
                    {groups.map((group, groupIndex) => (
                        <div key={group.azure_model_name} className={cn('flex flex-col gap-2', groupIndex > 0 && 'mt-4 border-t border-slate-100 pt-4 dark:border-slate-800')}>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{group.azure_model_name}</span>
                                <span className="text-[11px] text-muted-foreground">
                                    {group.rows.length} candidato{group.rows.length === 1 ? '' : 's'} evaluado{group.rows.length === 1 ? '' : 's'}
                                </span>
                            </div>

                            {group.rows.length === 0 ? (
                                <p className="text-[11px] italic text-muted-foreground">Sin candidatos evaluados para este modelo.</p>
                            ) : (
                                group.rows.map((row) => (
                                    <div
                                        key={row.candidate_model_name}
                                        className={cn(
                                            'grid grid-cols-[18px_minmax(150px,1.4fr)_minmax(140px,1fr)_92px_auto] items-center gap-3 border-b border-slate-50 py-2 last:border-b-0 dark:border-slate-900',
                                            !row.is_eligible && 'opacity-55'
                                        )}
                                    >
                                        <span className={cn('text-center text-sm', row.is_recommended ? 'text-violet-600 dark:text-violet-400' : 'text-slate-300 dark:text-slate-700')}>
                                            {row.is_recommended ? '★' : '•'}
                                        </span>
                                        <div className="min-w-0">
                                            <div className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">{row.candidate_model_name}</div>
                                            <div className="truncate font-mono text-[10px] text-muted-foreground">{row.provider} · {row.region}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="relative h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-800">
                                                <span className="absolute inset-y-[-3px] left-1/2 w-0.5 rounded-full bg-slate-700/40 dark:bg-slate-300/40" />
                                                <div
                                                    className={cn('h-full rounded-full', CONFIDENCE_METER_COLOR[row.confidence])}
                                                    style={{ width: `${Math.min(100, Math.max(0, row.equivalence_score * 100))}%` }}
                                                />
                                            </div>
                                            <span className="min-w-[38px] text-right text-xs font-bold tabular-nums text-slate-700 dark:text-slate-200">
                                                {formatPercent(row.equivalence_score * 100)}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={cn('text-xs font-bold tabular-nums', deltaClass(row.delta_percent))}>
                                                {formatSignedPercent(row.delta_percent)}
                                            </span>
                                            <span className="text-[10px] tabular-nums text-muted-foreground">
                                                {formatCurrency(row.projected_cost_usd)}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', confidenceClasses[row.confidence])}>
                                                {confidenceLabels[row.confidence]}
                                            </span>
                                            {!row.is_eligible && (
                                                <span className="whitespace-nowrap rounded-full bg-slate-100 px-2 py-0.5 text-[9.5px] font-semibold text-muted-foreground dark:bg-slate-800">
                                                    No elegible
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
