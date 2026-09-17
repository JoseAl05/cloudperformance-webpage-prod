'use client'

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertTriangle, Cloud, Info } from 'lucide-react';
import { MessageCard } from '@/components/aws/cards/MessageCards';
import {
    GcpVertexComparison,
    GcpVertexComparisonResponse,
    GcpVertexProviderKey
} from '@/interfaces/vertex-comparison/gcpVertexComparisonInterfaces';
import { GcpVertexSummaryCards } from '@/components/google-vertex/comparacion/info/GcpVertexComparisonCardsComponent';
import { GcpVertexCostBridgeComponent } from '@/components/google-vertex/comparacion/info/GcpVertexComparisonCostBridgeComponent';
import { GcpVertexTokenMixComponent } from '@/components/google-vertex/comparacion/info/GcpVertexComparisonTokenMixComponent';
import { GcpVertexModelPanelsComponent } from '@/components/google-vertex/comparacion/info/GcpVertexComparisonModelPanelsComponent';
import { GcpVertexCandidateConfidenceComponent } from '@/components/google-vertex/comparacion/info/GcpVertexComparisonCandidateConfidenceComponent';
import { GcpVertexEndpointsTableComponent } from '@/components/google-vertex/comparacion/table/GcpVertexComparisonEndpointsTableComponent';
import { formatCurrency, formatInteger, providerFullLabels, providerShortLabels } from '@/lib/gcpVertexComparisonFormatters';

interface GcpVertexComparisonViewProps {
    data: GcpVertexComparison | GcpVertexComparisonResponse | null | undefined;
}

interface ChapterHeaderProps {
    step: number;
    eyebrow: string;
    question: string;
    sub: string;
}

const ChapterHeader = ({ step, eyebrow, question, sub }: ChapterHeaderProps) => (
    <div className="flex flex-col gap-1">
        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[5px] bg-slate-100 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {step}
            </span>
            {eyebrow}
        </span>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{question}</h2>
        <p className="max-w-[78ch] text-[12.5px] text-muted-foreground">{sub}</p>
    </div>
);

export const GcpVertexComparisonView = ({ data }: GcpVertexComparisonViewProps) => {
    const [provider, setProvider] = useState<GcpVertexProviderKey>('bedrock');
    const comparison = Array.isArray(data) ? data[0] : data;
    const models = comparison?.models ?? [];
    const diagnostics = comparison?.diagnostics;
    const providerDiagnostics = comparison?.[provider]?.diagnostics;

    const pendingMetrics = useMemo(
        () => [
            ...(comparison?.unmapped_metrics ?? []),
            ...(comparison?.unresolved_metrics ?? [])
        ],
        [comparison]
    );

    const pendingCost = useMemo(
        () => pendingMetrics.reduce((total, metric) => total + (metric.cost_usd || 0), 0),
        [pendingMetrics]
    );

    if (!comparison || !comparison.summary) {
        return (
            <MessageCard
                icon={Info}
                title="Sin datos para mostrar"
                description="No encontramos información sobre la seleccion de Vertex AI en el período elegido."
                tone="warn"
            />
        );
    }

    return (
        <div className="flex flex-col gap-5">
            <Card className="border-slate-200 dark:border-slate-800">
                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-sky-50 p-2 dark:bg-sky-950/40">
                            <Cloud className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                {comparison.project_id}
                            </span>
                            <span className="font-mono text-[11px] text-muted-foreground">
                                {comparison.project_id} · {comparison.region || 'all_regions'} · {comparison.service_label || 'Google Vertex AI'}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-6">
                        {providerDiagnostics && (
                            <div className="flex flex-col">
                                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                    Catálogo {providerFullLabels[provider]}
                                </span>
                                <span className="text-xs font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                                    {formatInteger(providerDiagnostics.catalog_models)} modelos
                                </span>
                            </div>
                        )}
                        {diagnostics && (
                            <div className="flex flex-col">
                                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                    Métricas Vertex
                                </span>
                                <span className="text-xs font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                                    {formatInteger(diagnostics.metrics_rows)}
                                </span>
                            </div>
                        )}
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                Comparar contra
                            </span>
                            <div className="inline-flex gap-1 rounded-lg border border-slate-200 p-1 dark:border-slate-800">
                                {(['bedrock', 'foundry'] as GcpVertexProviderKey[]).map((key) => (
                                    <Button
                                        key={key}
                                        type="button"
                                        size="sm"
                                        variant={provider === key ? 'default' : 'ghost'}
                                        className="h-7 px-3 text-[11px]"
                                        onClick={() => setProvider(key)}
                                    >
                                        {providerShortLabels[key]}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <GcpVertexSummaryCards data={comparison} provider={provider} />

            {pendingMetrics.length > 0 && (
                <Card className={cn('border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20')}>
                    <CardContent className="flex flex-col gap-2 p-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                                {formatInteger(pendingMetrics.length)} metricas sin resolver por {formatCurrency(pendingCost)}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {pendingMetrics.map((metric, index) => (
                                <span
                                    key={`${metric.metric_name}-${index}`}
                                    className="rounded-md border border-amber-200 bg-white px-2 py-0.5 font-mono text-[10px] text-amber-700 dark:border-amber-900 dark:bg-slate-900 dark:text-amber-400"
                                >
                                    {metric.metric_name} · {formatCurrency(metric.cost_usd)}
                                </span>
                            ))}
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                            Estos consumos no se pudieron atribuir a un modelo desplegado o resolver contra el catálogo de {providerFullLabels[provider]}, y quedan fuera de la proyección.
                        </span>
                    </CardContent>
                </Card>
            )}

            <section className="flex flex-col gap-3">
                <ChapterHeader
                    step={1}
                    eyebrow="Comparación de costos"
                    question={`¿Cuánto costaría lo mismo en ${providerFullLabels[provider]}?`}
                    sub="El total a la izquierda compara lo medido en GCP Vertex AI contra la proyección con el candidato recomendado de cada modelo. El ranking usa porcentaje, no dólares, así un modelo de US$4 y uno de US$400 son comparables en el mismo eje."
                />
                <GcpVertexCostBridgeComponent data={models} provider={provider} />
            </section>

            <section className="flex flex-col gap-3">
                <ChapterHeader
                    step={2}
                    eyebrow="Composición del consumo"
                    question="¿Por qué cuesta lo que cuesta?"
                    sub="Qué parte del volumen (tokens) es cada tipo de consumo, y qué parte del gasto representa. Cuando no coinciden es la señal de qué optimizar primero."
                />
                <GcpVertexTokenMixComponent data={models} />
            </section>

            <section className="flex flex-col gap-3">
                <ChapterHeader
                    step={3}
                    eyebrow="Detalle por modelo"
                    question="Modelo por modelo: consumo, precio y mejor alternativa"
                    sub={`Una tarjeta por modelo medido. La comparación GCP Vertex AI/${providerShortLabels[provider]} usa la escala propia de cada modelo para que uno chico no desaparezca al lado de uno grande.`}
                />
                <GcpVertexModelPanelsComponent data={models} provider={provider} />
            </section>

            <section className="flex flex-col gap-3">
                <ChapterHeader
                    step={4}
                    eyebrow="Confianza de la equivalencia"
                    question="¿Qué tan confiables son estas equivalencias?"
                    sub="Todos los candidatos evaluados por modelo, con el recomendado primero. Recomendado no es igual a más barato: los que no llegaron al umbral mínimo quedan atenuados, no ocultos."
                />
                <GcpVertexCandidateConfidenceComponent data={models} provider={provider} />
            </section>

            <section className="flex flex-col gap-3">
                <ChapterHeader
                    step={5}
                    eyebrow="Infraestructura"
                    question="¿Dónde vive este consumo?"
                    sub="Un registro por endpoint. El costo de cada modelo se reparte entre sus endpoints según la proporción de tokens observada en métricas."
                />
                <GcpVertexEndpointsTableComponent data={models} />
            </section>
        </div>
    );
};
