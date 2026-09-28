'use client'

import { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowDownToLine, ArrowUpFromLine, ArrowUpRight, Bot, Boxes, ChevronDown, ReceiptText, Server, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { OpenAICostOptimizationModel } from '@/components/open-ia/costo-optimizacion/openaiCostOptimizationMockData';

const money = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 6 });
const integer = new Intl.NumberFormat('es-CL');
const compact = new Intl.NumberFormat('es-CL', { notation: 'compact', maximumFractionDigits: 1 });

const formatCost = (value: number | null | undefined) => money.format(Number(value || 0));
const formatRate = (value: number | null | undefined) => `${money.format(Number(value || 0))} / token`;
const totalTokens = (item: OpenAICostOptimizationModel) => (item.tokens.input || 0) + (item.tokens.output || 0) + (item.tokens.input_cached || 0);

const Stars = ({ value }: { value: number }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className={cn('h-3.5 w-3.5', star <= value ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted-foreground/30')} />
        ))}
    </div>
);

const ModelCard = ({ item }: { item: OpenAICostOptimizationModel }) => {
    const [open, setOpen] = useState(false);
    const inputCost = item.billing_cost_breakdown.input || 0;
    const cachedCost = item.billing_cost_breakdown.cached_input || 0;
    const outputCost = item.billing_cost_breakdown.output || 0;

    return (
        <Card className="flex h-full flex-col overflow-hidden border-slate-200 transition-shadow hover:border-primary/40 hover:shadow-md dark:border-slate-800">
            <CardHeader className="gap-2 pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2.5">
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Boxes className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <CardTitle className="truncate text-base font-semibold leading-tight text-foreground">
                                    {item.provider} - {item.model_name}
                                </CardTitle>
                                <Stars value={item.model_profile.stars} />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Server className="h-3 w-3" />{item.project_name}</span>
                                <span className="text-muted-foreground/50">·</span>
                                <span className="font-medium text-sky-600 dark:text-sky-400">{item.model_profile.tier}</span>
                            </div>
                            <p className="text-[11px] italic leading-snug text-slate-500">&quot;{item.model_profile.description}&quot;</p>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border bg-card p-3">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><ArrowDownToLine className="h-4 w-4 text-sky-600" />Tokens entrada</div>
                        <p className="mt-1 text-lg font-bold tabular-nums">{integer.format(item.tokens.input || 0)}</p>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><ArrowUpFromLine className="h-4 w-4 text-violet-600" />Tokens salida</div>
                        <p className="mt-1 text-lg font-bold tabular-nums">{integer.format(item.tokens.output || 0)}</p>
                    </div>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50/80 p-3 dark:border-blue-900/40 dark:bg-blue-950/20">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400"><ReceiptText className="h-4 w-4" />Costo facturado</div>
                    <p className="mt-1 text-3xl font-bold tabular-nums text-blue-950 dark:text-blue-50">{formatCost(item.total_billing_cost)}</p>
                    <div className="mt-3 space-y-1.5 border-t border-blue-200/70 pt-3 dark:border-blue-800/50">
                        {item.line_items.map((line) => (
                            <div key={line.line_item} className="flex items-center justify-between gap-3 rounded-md border border-blue-100 bg-white/60 p-2 text-xs dark:border-blue-900/40 dark:bg-black/20">
                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-blue-900 dark:text-blue-100">{line.metric_type}</p>
                                    <p className="truncate font-mono text-[10px] text-blue-700/70 dark:text-blue-300/70">{formatRate(line.rate)} · {integer.format(line.quantity)} {line.quantity_unit}</p>
                                </div>
                                <p className="shrink-0 font-bold tabular-nums text-blue-700 dark:text-blue-400">{formatCost(line.amount_value)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <Collapsible open={open} onOpenChange={setOpen} className="mt-auto overflow-hidden rounded-lg border bg-card">
                    <CollapsibleTrigger asChild>
                        <Button type="button" variant="ghost" className="group h-auto w-full justify-between rounded-none px-3 py-3 text-left hover:bg-muted/50">
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 dark:text-sky-400"><Bot className="h-4 w-4" />Simulación de costos</span>
                            <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', open && 'rotate-180')} />
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="border-t">
                        <div className="space-y-2 p-3">
                            {item.price_comparison.map((candidate) => {
                                const savings = item.total_billing_cost - candidate.estimated_cost;
                                return (
                                    <div key={candidate.model_name} className="rounded-md border bg-background px-3 py-2">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-bold">{candidate.model_name}</p>
                                                <p className="text-xs text-sky-600">{candidate.provider} · {candidate.tier}</p>
                                                <p className="mt-1 text-[11px] italic text-muted-foreground">{candidate.description}</p>
                                            </div>
                                            <Badge variant="outline" className="shrink-0 border-emerald-300 text-emerald-700 dark:border-emerald-900 dark:text-emerald-400">
                                                {candidate.delta_pct < 0 ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}{candidate.delta_pct.toFixed(1)}%
                                            </Badge>
                                        </div>
                                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                            <div className="rounded-md bg-muted/40 p-2">
                                                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Costo estimado</p>
                                                <p className="font-bold tabular-nums">{formatCost(candidate.estimated_cost)}</p>
                                            </div>
                                            <div className="rounded-md bg-emerald-50 p-2 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                                                <p className="text-[10px] font-semibold uppercase tracking-wide">{savings >= 0 ? 'Ahorro' : 'Costo adicional'}</p>
                                                <p className="font-bold tabular-nums">{formatCost(Math.abs(savings))}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                <div className="border-t pt-3 text-xs text-muted-foreground">
                    <span>Versión modelo: </span><span className="font-mono text-foreground">{item.model_version}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export const OpenAICostOptimizationCardsComponent = ({ data }: { data: OpenAICostOptimizationModel[] }) => {
    const sortedData = useMemo(() => [...data].sort((a, b) => b.total_billing_cost - a.total_billing_cost), [data]);

    if (sortedData.length === 0) {
        return <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No hay datos para los filtros seleccionados.</div>;
    }

    return (
        <div className="space-y-4">
            <div className={cn('grid gap-4', sortedData.length === 1 ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-2')}>
                {sortedData.map((model) => <ModelCard key={`${model.project_id}-${model.model_name}`} item={model} />)}
            </div>
        </div>
    );
};
