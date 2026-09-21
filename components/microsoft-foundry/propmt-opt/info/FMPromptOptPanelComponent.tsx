'use client'

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { formatMicroCurrency, formatInteger } from '@/lib/azureFoundryFormatters';
import { FMPromptOptTokensComponent } from '@/components/microsoft-foundry/propmt-opt/info/FMPromptOptTokensComponent';
import {
    PromptOptimizationBreakdown,
    PromptOptimizationSide,
    PromptOptimizationViewMode
} from '@/interfaces/foundry-cost-optimization/promptOptimizationInterfaces';

interface FMPromptOptPanelComponentProps {
    side: PromptOptimizationSide;
    label: string;
    hint: string;
    breakdown: PromptOptimizationBreakdown;
    viewMode: PromptOptimizationViewMode;
    emptyMessage: string;
}

const sideStyles: Record<PromptOptimizationSide, { accent: string; surface: string; border: string }> = {
    original: {
        accent: 'text-sky-600 dark:text-sky-400',
        surface: 'bg-sky-50 dark:bg-sky-950/40',
        border: 'border-slate-200 dark:border-slate-800'
    },
    optimized: {
        accent: 'text-emerald-600 dark:text-emerald-400',
        surface: 'bg-emerald-50 dark:bg-emerald-950/40',
        border: 'border-emerald-200 dark:border-emerald-900'
    }
};

export const FMPromptOptPanelComponent = ({
    side,
    label,
    hint,
    breakdown,
    viewMode,
    emptyMessage
}: FMPromptOptPanelComponentProps) => {
    const [copied, setCopied] = useState(false);
    const styles = sideStyles[side];

    useEffect(() => {
        if (!copied) return;
        const timeout = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(timeout);
    }, [copied]);

    const copyPrompt = async () => {
        try {
            await navigator.clipboard.writeText(breakdown.text);
            setCopied(true);
        } catch {
            setCopied(false);
        }
    };

    return (
        <Card className={cn('min-w-0', styles.border)}>
            <CardContent className="flex flex-col gap-3 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col">
                        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            {label}
                        </span>
                        <span className={cn('text-2xl font-bold tabular-nums', styles.accent)}>
                            {formatInteger(breakdown.token_count)}
                            <span className="pl-1 text-[12px] font-medium text-muted-foreground">tokens</span>
                        </span>
                        <span className="text-[12px] font-semibold tabular-nums text-slate-600 dark:text-slate-300">
                            {formatMicroCurrency(breakdown.token_price)}
                            <span className="pl-1 text-[11px] font-normal text-muted-foreground">costo estimado</span>
                        </span>
                        <span className="text-[11px] text-muted-foreground">{hint}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={cn('rounded-lg px-2 py-1 text-[11px] font-semibold', styles.surface, styles.accent)}>
                            {formatInteger(breakdown.text.length)} caracteres
                        </span>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-[11px]"
                            onClick={copyPrompt}
                            disabled={breakdown.text.length === 0}
                        >
                            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            {copied ? 'Copiado' : 'Copiar'}
                        </Button>
                    </div>
                </div>

                <FMPromptOptTokensComponent
                    tokens={breakdown.tokens}
                    viewMode={viewMode}
                    emptyMessage={emptyMessage}
                />
            </CardContent>
        </Card>
    );
};
