'use client'

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDown } from 'lucide-react';
import { GcpVertexCostBridgePoint, GcpVertexModel, GcpVertexProviderKey } from '@/interfaces/vertex-comparison/gcpVertexComparisonInterfaces';
import { deltaClass, formatCurrency, formatSignedPercent, providerFullLabels } from '@/lib/gcpVertexComparisonFormatters';

interface GcpVertexCostBridgeComponentProps {
    data: GcpVertexModel[];
    provider: GcpVertexProviderKey;
}

const MIN_SPAN = 10;

export const GcpVertexCostBridgeComponent = ({ data, provider }: GcpVertexCostBridgeComponentProps) => {
    const points = useMemo<GcpVertexCostBridgePoint[]>(() => {
        return (data || [])
            .map((model) => {
                const recommended = model[provider].candidates.find((candidate) => candidate.is_recommended);
                return {
                    model: model.gcp_model_name,
                    gcp_cost_usd: model.gcp_cost_usd,
                    projected_cost_usd: recommended ? recommended.projected_cost_usd : model.gcp_cost_usd,
                    delta_usd: recommended ? recommended.delta_usd : 0,
                    delta_percent: recommended ? recommended.delta_percent : 0,
                    recommended_model: recommended ? recommended.model_name : '',
                    has_recommendation: !!recommended
                };
            })
            .sort((a, b) => {
                if (a.has_recommendation !== b.has_recommendation) return a.has_recommendation ? -1 : 1;
                return a.delta_percent - b.delta_percent;
            });
    }, [data, provider]);

    const covered = useMemo(() => points.filter((point) => point.has_recommendation), [points]);
    const uncovered = useMemo(() => points.filter((point) => !point.has_recommendation), [points]);

    const totals = useMemo(() => {
        const gcpTotal = points.reduce((sum, point) => sum + point.gcp_cost_usd, 0);
        const projectedTotal = covered.reduce((sum, point) => sum + point.projected_cost_usd, 0);
        const deltaUsd = projectedTotal - covered.reduce((sum, point) => sum + point.gcp_cost_usd, 0);
        const coveredGcpTotal = covered.reduce((sum, point) => sum + point.gcp_cost_usd, 0);
        const deltaPercent = coveredGcpTotal > 0 ? (deltaUsd / coveredGcpTotal) * 100 : 0;
        const totalProjected = points.reduce((sum, point) => sum + point.projected_cost_usd, 0);
        return { gcpTotal, projectedTotal, deltaUsd, deltaPercent, totalProjected };
    }, [points, covered]);

    const scale = useMemo(() => {
        const deltas = covered.map((point) => point.delta_percent);
        const minDelta = deltas.length ? Math.min(0, ...deltas) : 0;
        const maxDelta = deltas.length ? Math.max(0, ...deltas) : 0;
        const negSpan = Math.max(MIN_SPAN, Math.ceil((Math.abs(minDelta) * 1.15) / 10) * 10);
        const posSpan = Math.max(MIN_SPAN, Math.ceil((maxDelta * 1.15) / 10) * 10);
        const total = negSpan + posSpan;
        return { negSpan, posSpan, negPct: (negSpan / total) * 100, posPct: (posSpan / total) * 100 };
    }, [covered]);

    return (
        <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-5">
                {points.length === 0 ? (
                    <div className="py-10 text-center text-sm text-muted-foreground">Sin modelos para comparar.</div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-0.5">
                                <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                    <span className="h-2 w-2 rounded-sm bg-sky-600 dark:bg-sky-400" />
                                    GCP Vertex AI, hoy
                                </span>
                                <span className="text-2xl font-bold tabular-nums text-slate-800 dark:text-slate-100">
                                    {formatCurrency(totals.gcpTotal)}
                                </span>
                            </div>
                            <ArrowDown className="h-4 w-4 text-muted-foreground" />
                            <div className="flex flex-col gap-0.5">
                                <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                    <span className="h-2 w-2 rounded-sm bg-violet-600 dark:bg-violet-400" />
                                    Proyección {providerFullLabels[provider]}
                                </span>
                                <span className="text-2xl font-bold tabular-nums text-slate-800 dark:text-slate-100">
                                    {formatCurrency(totals.totalProjected)}
                                </span>
                            </div>
                            <span className={cn(
                                'w-fit rounded-lg px-2.5 py-1 text-sm font-bold tabular-nums',
                                totals.deltaUsd <= 0
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                    : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                            )}>
                                {formatSignedPercent(totals.deltaPercent)} · {formatCurrency(totals.deltaUsd)}
                            </span>
                            {uncovered.length > 0 && (
                                <p className="border-t border-slate-100 pt-2.5 text-[11px] leading-relaxed text-muted-foreground dark:border-slate-800">
                                    Incluye solo los {covered.length} modelo{covered.length === 1 ? '' : 's'} con candidato recomendado.{' '}
                                    {uncovered.map((point) => point.model).join(', ')} queda{uncovered.length === 1 ? '' : 'n'} fuera del total {providerFullLabels[provider]}:
                                    ningún candidato superó el umbral de equivalencia.
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            {covered.map((point) => {
                                const isNeg = point.delta_percent <= 0;
                                const barPct = isNeg
                                    ? (Math.abs(point.delta_percent) / scale.negSpan) * 100
                                    : (point.delta_percent / scale.posSpan) * 100;
                                return (
                                    <div key={point.model} className="grid grid-cols-[130px_1fr] items-center gap-2.5">
                                        <span className="truncate text-right text-xs font-semibold text-slate-700 dark:text-slate-200">
                                            {point.model}
                                        </span>
                                        <div
                                            className="grid h-9 items-center"
                                            style={{ gridTemplateColumns: `${scale.negPct}% ${scale.posPct}%` }}
                                        >
                                            <div className="flex justify-end pr-px">
                                                {isNeg && (
                                                    <div className="flex items-center justify-end" style={{ width: `${barPct}%` }}>
                                                        <span className="mr-2 flex items-baseline gap-1.5 whitespace-nowrap">
                                                            <span className={cn('text-sm font-bold tabular-nums', deltaClass(point.delta_percent))}>
                                                                {formatSignedPercent(point.delta_percent)}
                                                            </span>
                                                            <span className="text-[11px] text-muted-foreground">{point.recommended_model}</span>
                                                        </span>
                                                        <div className="h-5 min-w-[2px] rounded-l-sm bg-emerald-600 dark:bg-emerald-500" style={{ width: '100%' }} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex justify-start pl-px">
                                                {!isNeg && (
                                                    <div className="flex items-center justify-start" style={{ width: `${barPct}%` }}>
                                                        <div className="h-5 min-w-[2px] rounded-r-sm bg-red-600 dark:bg-red-500" style={{ width: '100%' }} />
                                                        <span className="ml-2 flex items-baseline gap-1.5 whitespace-nowrap">
                                                            <span className={cn('text-sm font-bold tabular-nums', deltaClass(point.delta_percent))}>
                                                                {formatSignedPercent(point.delta_percent)}
                                                            </span>
                                                            <span className="text-[11px] text-muted-foreground">{point.recommended_model}</span>
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {uncovered.map((point) => (
                                <div key={point.model} className="grid grid-cols-[130px_1fr] items-center gap-2.5">
                                    <span className="truncate text-right text-xs font-semibold text-slate-700 dark:text-slate-200">
                                        {point.model}
                                    </span>
                                    <div
                                        className="grid h-9 items-center"
                                        style={{ gridTemplateColumns: `${scale.negPct}% ${scale.posPct}%` }}
                                    >
                                        <div className="flex items-center justify-end gap-2 pr-px">
                                            <span className="w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground dark:bg-slate-800">
                                                Sin equivalencia
                                            </span>
                                            <span
                                                className="h-px w-2.5 shrink-0"
                                                style={{ backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0 3px, transparent 3px 6px)', color: 'var(--border)' }}
                                            />
                                        </div>
                                        <div />
                                    </div>
                                </div>
                            ))}
                            <div className="mt-1 grid grid-cols-[130px_1fr] gap-2.5">
                                <span />
                                <div
                                    className="grid font-mono text-[10px] text-muted-foreground"
                                    style={{ gridTemplateColumns: `${scale.negPct}% ${scale.posPct}%` }}
                                >
                                    <div className="flex justify-between">
                                        <span>&minus;{scale.negSpan}%</span>
                                        <span>0%</span>
                                    </div>
                                    <div className="text-right">
                                        <span>+{scale.posSpan}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
