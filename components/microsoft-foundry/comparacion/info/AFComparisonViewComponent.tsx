'use client'

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertTriangle, Cloud, Info } from 'lucide-react';
import { MessageCard } from '@/components/azure/cards/MessageCards';
import {
    AzureFoundryComparison,
    AzureFoundryComparisonResponse
} from '@/interfaces/foundry-cost-optimization/azureFoundryInterfaces';
import { AzureFoundrySummaryCards } from '@/components/microsoft-foundry/comparacion/info/AFComparisonCardsComponent';
import { AzureFoundryCostBridgeComponent } from '@/components/microsoft-foundry/comparacion/info/AFComparisonCostBridgeComponent';
import { AzureFoundryTokenMixComponent } from '@/components/microsoft-foundry/comparacion/info/AFComparisonTokenMixComponent';
import { AzureFoundryModelPanelsComponent } from '@/components/microsoft-foundry/comparacion/info/AFComparisonModelPanelsComponent';
import { AzureFoundryCandidateConfidenceComponent } from '@/components/microsoft-foundry/comparacion/info/AFComparisonCandidateConfidenceComponent';
import { AzureFoundryDeploymentsTableComponent } from '@/components/microsoft-foundry/comparacion/table/AFComparisonDeploymentsTableComponent';
import { formatCurrency, formatInteger } from '@/lib/azureFoundryFormatters';

interface AzureFoundryComparisonViewProps {
    data: AzureFoundryComparison | AzureFoundryComparisonResponse | null | undefined;
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

export const AzureFoundryComparisonView = ({ data }: AzureFoundryComparisonViewProps) => {
    const comparison = Array.isArray(data) ? data[0] : data;
    const models = comparison?.models ?? [];
    const unmappedMeters = comparison?.unmapped_meters ?? [];
    const unresolvedMeters = comparison?.unresolved_meters ?? [];
    const diagnostics = comparison?.diagnostics;

    const pendingMeters = useMemo(
        () => [...unmappedMeters, ...unresolvedMeters],
        [unmappedMeters, unresolvedMeters]
    );

    const pendingCost = useMemo(
        () => pendingMeters.reduce((total, meter) => total + (meter.cost_usd || 0), 0),
        [pendingMeters]
    );

    if (!comparison || !comparison.summary) {
        return (
            <MessageCard
                icon={Info}
                title="Sin datos para mostrar"
                description="No encontramos información sobre la cuenta seleccionada en el período elegido."
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
                                {comparison.account_name}
                            </span>
                            <span className="font-mono text-[11px] text-muted-foreground">
                                {comparison.resource_group} · {comparison.account_location} · {comparison.account_kind}
                            </span>
                        </div>
                    </div>
                    {diagnostics && (
                        <div className="flex flex-wrap gap-6">
                            <div className="flex flex-col">
                                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                    Catálogo Bedrock
                                </span>
                                <span className="text-xs font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                                    {formatInteger(diagnostics.bedrock_catalog_models)} modelos
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                    Líneas de facturación
                                </span>
                                <span className="text-xs font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                                    {formatInteger(diagnostics.billing_rows)}
                                </span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <AzureFoundrySummaryCards data={comparison} />

            {pendingMeters.length > 0 && (
                <Card className={cn('border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20')}>
                    <CardContent className="flex flex-col gap-2 p-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                                {formatInteger(pendingMeters.length)} medidores sin resolver por {formatCurrency(pendingCost)}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {pendingMeters.map((meter, index) => (
                                <span
                                    key={`${meter.meter_name}-${index}`}
                                    className="rounded-md border border-amber-200 bg-white px-2 py-0.5 font-mono text-[10px] text-amber-700 dark:border-amber-900 dark:bg-slate-900 dark:text-amber-400"
                                >
                                    {meter.meter_name} · {formatCurrency(meter.cost_usd)}
                                </span>
                            ))}
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                            Estos consumos no se pudieron atribuir a un modelo desplegado o resolver contra el catálogo de Bedrock, y quedan fuera de la proyección.
                        </span>
                    </CardContent>
                </Card>
            )}

            <section className="flex flex-col gap-3">
                <ChapterHeader
                    step={1}
                    eyebrow="Comparación de costos"
                    question="¿Cuánto costaría lo mismo en AWS Bedrock?"
                    sub="El total a la izquierda compara lo facturado en Azure contra la proyección con el candidato recomendado de cada modelo. El ranking usa porcentaje, no dólares, así un modelo de US$4 y uno de US$400 son comparables en el mismo eje."
                />
                <AzureFoundryCostBridgeComponent data={models} />
            </section>

            <section className="flex flex-col gap-3">
                <ChapterHeader
                    step={2}
                    eyebrow="Composición del consumo"
                    question="¿Por qué cuesta lo que cuesta?"
                    sub="Qué parte del volumen (tokens) es cada tipo de consumo, y qué parte del gasto representa. Cuando no coinciden es la señal de qué optimizar primero."
                />
                <AzureFoundryTokenMixComponent data={models} />
            </section>

            <section className="flex flex-col gap-3">
                <ChapterHeader
                    step={3}
                    eyebrow="Detalle por modelo"
                    question="Modelo por modelo: consumo, precio y mejor alternativa"
                    sub="Una tarjeta por modelo facturado. La comparación Azure/Bedrock usa la escala propia de cada modelo para que uno chico no desaparezca al lado de uno grande."
                />
                <AzureFoundryModelPanelsComponent data={models} />
            </section>

            <section className="flex flex-col gap-3">
                <ChapterHeader
                    step={4}
                    eyebrow="Confianza de la equivalencia"
                    question="¿Qué tan confiables son estas equivalencias?"
                    sub="Todos los candidatos evaluados por modelo, con el recomendado primero. Recomendado no es igual a más barato: los que no llegaron al umbral mínimo quedan atenuados, no ocultos."
                />
                <AzureFoundryCandidateConfidenceComponent data={models} />
            </section>

            <section className="flex flex-col gap-3">
                <ChapterHeader
                    step={5}
                    eyebrow="Infraestructura"
                    question="¿Dónde vive este consumo?"
                    sub="Un registro por despliegue. El costo de cada modelo se reparte entre sus despliegues según la proporción de tokens observada en métricas."
                />
                <AzureFoundryDeploymentsTableComponent data={models} />
            </section>
        </div>
    );
};
