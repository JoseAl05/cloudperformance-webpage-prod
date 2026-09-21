'use client'

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatInteger } from '@/lib/azureFoundryFormatters';
import {
    PromptOptimizationToken,
    PromptOptimizationViewMode
} from '@/interfaces/foundry-cost-optimization/promptOptimizationInterfaces';

interface FMPromptOptTokensComponentProps {
    tokens: PromptOptimizationToken[];
    viewMode: PromptOptimizationViewMode;
    emptyMessage: string;
}

const TOKEN_PALETTE = [
    'bg-sky-200/70 dark:bg-sky-500/30',
    'bg-emerald-200/70 dark:bg-emerald-500/30',
    'bg-amber-200/70 dark:bg-amber-500/30',
    'bg-violet-200/70 dark:bg-violet-500/30',
    'bg-rose-200/70 dark:bg-rose-500/30',
    'bg-teal-200/70 dark:bg-teal-500/30'
];

// Un prompt grande puede superar los 100k tokens y pintar un span por token congela el navegador,
// así que se renderiza por tramos y el usuario decide cuánto más mostrar.
const TOKENS_PER_PAGE = 3000;

export const FMPromptOptTokensComponent = ({ tokens, viewMode, emptyMessage }: FMPromptOptTokensComponentProps) => {
    const [visibleCount, setVisibleCount] = useState(TOKENS_PER_PAGE);

    useEffect(() => {
        setVisibleCount(TOKENS_PER_PAGE);
    }, [tokens]);

    const visibleTokens = useMemo(
        () => tokens.slice(0, visibleCount),
        [tokens, visibleCount]
    );

    const visibleTokenIds = useMemo(
        () => (viewMode === 'ids' ? visibleTokens.flatMap((token) => token.token_ids) : []),
        [visibleTokens, viewMode]
    );

    const hiddenCount = tokens.length - visibleTokens.length;

    if (tokens.length === 0) {
        return (
            <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-dashed border-slate-200 p-4 text-center text-[12px] text-muted-foreground dark:border-slate-800">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="max-h-[420px] min-h-[220px] overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/40">
                {viewMode === 'text' ? (
                    <div className="whitespace-pre-wrap break-words font-mono text-[13px] leading-7 text-slate-700 dark:text-slate-200">
                        {visibleTokens.map((token, index) => (
                            <span
                                key={index}
                                title={`#${index + 1} · ${token.token_ids.join(', ')}`}
                                className={cn('rounded-[3px]', TOKEN_PALETTE[index % TOKEN_PALETTE.length])}
                            >
                                {token.text}
                            </span>
                        ))}
                    </div>
                ) : (
                    <div className="break-words font-mono text-[12px] leading-6 text-slate-600 dark:text-slate-300">
                        {visibleTokenIds.join(', ')}
                    </div>
                )}
            </div>

            {hiddenCount > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 px-3 text-[11px]"
                        onClick={() => setVisibleCount((current) => current + TOKENS_PER_PAGE)}
                    >
                        Mostrar {formatInteger(Math.min(hiddenCount, TOKENS_PER_PAGE))} tokens más
                    </Button>
                    <span className="text-[11px] text-muted-foreground">
                        {formatInteger(hiddenCount)} tokens ocultos de {formatInteger(tokens.length)}
                    </span>
                </div>
            )}
        </div>
    );
};
