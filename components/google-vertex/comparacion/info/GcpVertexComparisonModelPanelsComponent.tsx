'use client'

import { useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertTriangle, Boxes, Calendar, Server, Sparkles } from 'lucide-react';
import {
    GcpVertexDimensionLadderRow,
    GcpVertexModel,
    GcpVertexModelPanel,
    GcpVertexProviderKey
} from '@/interfaces/vertex-comparison/gcpVertexComparisonInterfaces';
import {
    confidenceClasses,
    confidenceLabels,
    deltaClass,
    formatCurrency,
    formatDate,
    formatInteger,
    formatPercent,
    formatPricePerMillion,
    formatSignedPercent,
    providerFullLabels,
    providerShortLabels
} from '@/lib/gcpVertexComparisonFormatters';

interface GcpVertexModelPanelsComponentProps {
    data: GcpVertexModel[];
    provider: GcpVertexProviderKey;
}

const buildLadder = (model: GcpVertexModel, recommended: GcpVertexModel['bedrock']['candidates'][number] | undefined): GcpVertexDimensionLadderRow[] => {
    return [...model.usage]
        .sort((a, b) => b.cost_usd - a.cost_usd)
        .map((usage) => {
            const candidateDimension = recommended?.dimensions.find((dimension) => dimension.dimension === usage.dimension);
            return {
                dimension: usage.dimension,
                dimension_label: usage.dimension_label,
                tokens: usage.tokens,
                token_share: model.tokens_total > 0 ? (usage.tokens / model.tokens_total) * 100 : 0,
                gcp_price_per_1m_usd: usage.price_per_1m_usd,
                gcp_cost_usd: usage.cost_usd,
                candidate_price_per_1m_usd: candidateDimension ? candidateDimension.price_per_1m_usd : null,
                candidate_cost_usd: candidateDimension ? candidateDimension.cost_usd : null,
                delta_usd: candidateDimension ? candidateDimension.delta_usd : null,
                dimension_fallback: candidateDimension ? candidateDimension.dimension_fallback : false
            };
        });
};

export const GcpVertexModelPanelsComponent = ({ data, provider }: GcpVertexModelPanelsComponentProps) => {
    const panels = useMemo<GcpVertexModelPanel[]>(() => {
        return (data || []).map((model) => {
            const recommended = model[provider].candidates.find((candidate) => candidate.is_recommended);
            return {
                gcp_model_name: model.gcp_model_name,
                gcp_model_version: model.gcp_model_version,
                gcp_base_model: model.gcp_base_model,
                model_class_label: model.model_class_label,
                endpoint_type: model.endpoint_type || '—',
                gcp_region: model.gcp_region || '—',
                candidate_region: model[provider].region || '—',
                lifecycle_status: model.lifecycle_status || '—',
                deprecation_label: formatDate(model.deprecation ? model.deprecation.inference : null),
                gcp_cost_usd: model.gcp_cost_usd,
                tokens_total: model.tokens_total,
                blended_price_per_1m_usd: model.tokens_total > 0 ? (model.gcp_cost_usd / model.tokens_total) * 1000000 : 0,
                endpoints_total: model.endpoints_total,
                endpoints_idle: model.endpoints_idle,
                candidates_total: model[provider].candidates.length,
                recommended_model: recommended ? recommended.model_name : '',
                recommended_provider: recommended ? (recommended.provider || '—') : '',
                recommended_confidence: recommended ? recommended.confidence : '',
                recommended_cost_usd: recommended ? recommended.projected_cost_usd : null,
                recommended_delta_usd: recommended ? recommended.delta_usd : null,
                recommended_delta_percent: recommended ? recommended.delta_percent : null,
                recommended_equivalence: recommended ? recommended.equivalence_score : null,
                recommended_rationale: recommended ? recommended.rationale : '',
                ladder: buildLadder(model, recommended)
            };
        });
    }, [data, provider]);

    if (panels.length === 0) {
        return (
            <Card className="border-slate-200 dark:border-slate-800">
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                    Sin modelos para mostrar.
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-4">
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-sm bg-sky-600 dark:bg-sky-400" />
                    GCP Vertex AI
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-sm bg-violet-600 dark:bg-violet-400" />
                    {providerFullLabels[provider]} (recomendado)
                </span>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {panels.map((panel) => {
                const hasRecommendation = !!panel.recommended_model;
                const miniMax = Math.max(panel.gcp_cost_usd, panel.recommended_cost_usd ?? 0, 1e-9);
                return (
                    <Card key={panel.gcp_model_name} className="border-slate-200 dark:border-slate-800">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-sky-50 p-2 dark:bg-sky-950/40">
                                        <Boxes className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                                            {panel.gcp_model_name}
                                        </span>
                                        <span className="block text-[11px] text-muted-foreground">
                                            v{panel.gcp_model_version} · {panel.model_class_label} · {panel.endpoint_type}
                                        </span>
                                        {panel.gcp_base_model && panel.gcp_base_model !== panel.gcp_model_name && (
                                            <span className="block truncate text-[10px] text-muted-foreground">
                                                Base: {panel.gcp_base_model}
                                            </span>
                                        )}
                                        <span className="block font-mono text-[10px] text-muted-foreground">
                                            {panel.gcp_region} → {panel.candidate_region}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex shrink-0 flex-col items-end">
                                    <span className="text-base font-bold tabular-nums text-slate-700 dark:text-slate-200">
                                        {formatCurrency(panel.gcp_cost_usd)}
                                    </span>
                                    <span className="text-[11px] tabular-nums text-muted-foreground">
                                        {formatInteger(panel.tokens_total)} tokens
                                    </span>
                                    <span className="text-[10px] tabular-nums text-muted-foreground">
                                        {formatPricePerMillion(panel.blended_price_per_1m_usd)}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-3 flex flex-col gap-1">
                                <div className="grid grid-cols-[42px_1fr_auto] items-center gap-2">
                                    <span className="text-[10px] font-semibold text-muted-foreground">GCP Vertex AI</span>
                                    <div className="h-3.5 rounded bg-slate-100 dark:bg-slate-800">
                                        <div
                                            className="h-full rounded bg-sky-600 dark:bg-sky-400"
                                            style={{ width: `${(panel.gcp_cost_usd / miniMax) * 100}%` }}
                                        />
                                    </div>
                                    <span className="min-w-[64px] text-right text-[11px] font-bold tabular-nums text-slate-700 dark:text-slate-200">
                                        {formatCurrency(panel.gcp_cost_usd)}
                                    </span>
                                </div>
                                <div className="grid grid-cols-[42px_1fr_auto] items-center gap-2">
                                    <span className="text-[10px] font-semibold text-muted-foreground">{providerShortLabels[provider]}</span>
                                    <div className="h-3.5 rounded bg-slate-100 dark:bg-slate-800">
                                        {hasRecommendation && (
                                            <div
                                                className="h-full rounded bg-violet-600 dark:bg-violet-400"
                                                style={{ width: `${((panel.recommended_cost_usd ?? 0) / miniMax) * 100}%` }}
                                            />
                                        )}
                                    </div>
                                    <span className="min-w-[64px] text-right text-[11px] font-bold tabular-nums text-slate-700 dark:text-slate-200">
                                        {hasRecommendation ? formatCurrency(panel.recommended_cost_usd) : '—'}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                {panel.ladder.map((row) => (
                                    <div key={row.dimension} className="flex items-center gap-3 rounded-md border border-slate-100 p-2 dark:border-slate-800">
                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <div className="flex items-center gap-1">
                                                <span className="truncate text-xs font-medium text-slate-700 dark:text-slate-200">
                                                    {row.dimension_label}
                                                </span>
                                                {row.dimension_fallback && (
                                                    <AlertTriangle className="h-3 w-3 shrink-0 text-amber-500" />
                                                )}
                                            </div>
                                            <span className="text-[10px] text-muted-foreground">
                                                {formatInteger(row.tokens)} tokens
                                            </span>
                                            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                                <div
                                                    className="h-full rounded-full bg-sky-500 dark:bg-sky-400"
                                                    style={{ width: `${Math.min(100, Math.max(0, row.token_share))}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 flex-col items-end text-right">
                                            <span className="text-[10px] text-muted-foreground">
                                                GCP Vertex AI {formatPricePerMillion(row.gcp_price_per_1m_usd)}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">
                                                {providerShortLabels[provider]} {formatPricePerMillion(row.candidate_price_per_1m_usd)}
                                            </span>
                                        </div>
                                        <div className="flex w-24 shrink-0 flex-col items-end text-right">
                                            <span className="text-xs font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                                                {formatCurrency(row.gcp_cost_usd)}
                                            </span>
                                            <span className={cn('text-[10px] tabular-nums', row.delta_usd !== null ? deltaClass(row.delta_usd) : 'text-muted-foreground')}>
                                                {row.delta_usd !== null ? formatCurrency(row.delta_usd) : '—'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={cn(
                                'rounded-lg border p-3',
                                hasRecommendation
                                    ? 'border-violet-200 bg-violet-50/50 dark:border-violet-900 dark:bg-violet-950/20'
                                    : 'border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20'
                            )}>
                                {hasRecommendation ? (
                                    <>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-2">
                                                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                        {panel.recommended_model}
                                                    </span>
                                                    <span className="text-[11px] text-muted-foreground">
                                                        {panel.recommended_provider} · equivalencia {formatPercent((panel.recommended_equivalence ?? 0) * 100)}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={cn(
                                                'shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold',
                                                confidenceClasses[panel.recommended_confidence]
                                            )}>
                                                {confidenceLabels[panel.recommended_confidence]}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex items-baseline gap-2">
                                            <span className="text-lg font-bold tabular-nums text-violet-700 dark:text-violet-300">
                                                {formatCurrency(panel.recommended_cost_usd)}
                                            </span>
                                            <span className={cn('text-xs font-semibold tabular-nums', deltaClass(panel.recommended_delta_percent ?? 0))}>
                                                {formatSignedPercent(panel.recommended_delta_percent)}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-xs leading-snug text-slate-600 dark:text-slate-300">
                                            {panel.recommended_rationale}
                                        </p>
                                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-violet-200/60 pt-2 text-[10px] text-muted-foreground dark:border-violet-900/50">
                                            <span>{formatInteger(panel.candidates_total)} candidatos evaluados</span>
                                            <span className="flex items-center gap-1">
                                                <Server className="h-3 w-3" />
                                                {formatInteger(panel.endpoints_total)} endpoints
                                                {panel.endpoints_idle > 0 && (
                                                    <span className="text-amber-600 dark:text-amber-400">
                                                        ({formatInteger(panel.endpoints_idle)} inactivos)
                                                    </span>
                                                )}
                                            </span>
                                            {panel.deprecation_label !== '-' && panel.deprecation_label !== '—' && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Retiro {panel.deprecation_label}
                                                </span>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                                                Ningún candidato supera el umbral mínimo de equivalencia
                                            </span>
                                            <span className="text-[11px] text-muted-foreground">
                                                {formatInteger(panel.candidates_total)} candidatos evaluados, ninguno con confianza suficiente o tarifas completas.
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
            </div>
        </div>
    );
};
