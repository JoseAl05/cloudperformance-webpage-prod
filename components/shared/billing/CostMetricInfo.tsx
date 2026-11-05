'use client'

import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { costMetricInfo } from '@/lib/billing';

export const CostMetricInfo = ({ metric, currency }: { metric: string | null | undefined; currency?: string | null }) => {
    const info = costMetricInfo(metric);
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button type="button" className="inline-flex text-muted-foreground hover:text-foreground" aria-label="Qué costo se muestra">
                        <Info className="h-3.5 w-3.5" />
                    </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                    <p className="text-xs font-semibold">
                        Métrica: <code>{metric ?? '—'}</code>{currency ? ` (${currency})` : ''}
                    </p>
                    <p className="text-xs mt-1">{info.description}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
