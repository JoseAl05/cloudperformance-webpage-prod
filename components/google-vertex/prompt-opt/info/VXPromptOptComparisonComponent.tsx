'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCard } from '@/components/azure/cards/MessageCards';
import { Info } from 'lucide-react';
import { formatInteger } from '@/lib/azureFoundryFormatters';
import { VXPromptOptCardsComponent } from '@/components/google-vertex/prompt-opt/info/VXPromptOptCardsComponent';
import { VXPromptOptPanelComponent } from '@/components/google-vertex/prompt-opt/info/VXPromptOptPanelComponent';
import {
    PromptOptimizationResponse,
    PromptOptimizationViewMode
} from '@/interfaces/foundry-cost-optimization/promptOptimizationInterfaces';

interface VXPromptOptComparisonComponentProps {
    data: PromptOptimizationResponse | null | undefined;
}

const viewModeLabels: Record<PromptOptimizationViewMode, string> = {
    text: 'Texto',
    ids: 'IDs de token'
};

export const VXPromptOptComparisonComponent = ({ data }: VXPromptOptComparisonComponentProps) => {
    const [viewMode, setViewMode] = useState<PromptOptimizationViewMode>('text');

    if (!data || !data.original_prompt || !data.optimized_prompt) {
        return (
            <MessageCard
                icon={Info}
                title="Sin resultados para mostrar"
                description="La API no devolvió un desglose de tokens para este prompt."
                tone="warn"
            />
        );
    }

    console.log(data)

    return (
        <div className="flex flex-col gap-5">
            <VXPromptOptCardsComponent data={data} />

            <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Desglose de tokens
                        </span>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                            ¿Qué se recortó del prompt?
                        </h2>
                        <p className="max-w-[78ch] text-[12.5px] text-muted-foreground">
                            Cada bloque de color es un token tal como lo cuenta el modelo, no una palabra. Los colores solo
                            marcan dónde empieza y termina cada token: pasa el cursor sobre uno para ver su posición y su ID.
                            La compresión descarta lo que aporta menos información, así que el prompt optimizado se lee
                            entrecortado &mdash; revisalo antes de usarlo.
                        </p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                            Mostrar como
                        </span>
                        <div className="inline-flex gap-1 rounded-lg border border-slate-200 p-1 dark:border-slate-800">
                            {(['text', 'ids'] as PromptOptimizationViewMode[]).map((mode) => (
                                <Button
                                    key={mode}
                                    type="button"
                                    size="sm"
                                    variant={viewMode === mode ? 'default' : 'ghost'}
                                    className="h-7 px-3 text-[11px]"
                                    onClick={() => setViewMode(mode)}
                                >
                                    {viewModeLabels[mode]}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                    <VXPromptOptPanelComponent
                        side="original"
                        label="Prompt original"
                        hint="Lo que escribiste, tokenizado tal cual"
                        breakdown={data.original_prompt}
                        viewMode={viewMode}
                        emptyMessage="El prompt original no generó tokens."
                    />
                    <VXPromptOptPanelComponent
                        side="optimized"
                        label="Prompt optimizado"
                        hint={
                            data.token_difference > 0
                                ? `${formatInteger(data.token_difference)} tokens menos que el original`
                                : 'Sin reducción respecto al original'
                        }
                        breakdown={data.optimized_prompt}
                        viewMode={viewMode}
                        emptyMessage="La compresión no devolvió contenido para este prompt."
                    />
                </div>
            </div>
        </div>
    );
};
