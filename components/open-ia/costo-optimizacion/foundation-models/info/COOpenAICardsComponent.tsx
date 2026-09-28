"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowDownRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowUpRight,
  Bot,
  Boxes,
  ChevronDown,
  Fingerprint,
  ReceiptText,
  Server,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  OpenAICostOptimizationCandidate,
  OpenAICostOptimizationLineItem,
  OpenAICostOptimizationModel,
} from "@/components/open-ia/costo-optimizacion/openaiCostOptimizationData";

type ComparisonSortOption = "savings" | "confidence" | "balanced";

interface DetailedRateUI {
  key: string;
  label: string;
  rateLabel: string;
  cost: string;
}

const comparisonSortOptions: { value: ComparisonSortOption; label: string }[] = [
  { value: "savings", label: "Mayor ahorro" },
  { value: "confidence", label: "Mayor confiabilidad" },
  { value: "balanced", label: "Confiabilidad + ahorro" },
];

const tokenFormatter = new Intl.NumberFormat("es-CL");
const percentFormatter = new Intl.NumberFormat("es-CL", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
});

const formatCost = (value: number | undefined | null) => {
  if (value == null || value === 0) return "US$0,00";
  if (value > 0 && value < 0.01) {
    return `US$${value.toFixed(6).replace(".", ",")}`;
  }
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const detailedLabels: Record<string, string> = {
  input: "Entrada",
  cached_input: "Entrada (Cache Lectura)",
  input_cached: "Entrada (Cache Lectura)",
  output: "Salida",
  input_audio: "Entrada Audio",
  output_audio: "Salida Audio",
  input_image: "Entrada Imagen",
  output_image: "Salida Imagen",
};

const normalizeMetricKey = (value: string) => {
  const lower = value.toLowerCase();
  if (lower.includes("output") || lower.includes("salida") || lower.includes("completion")) return "output";
  if (lower.includes("cached") || lower.includes("cache")) return "input_cached";
  if (lower.includes("input") || lower.includes("entrada") || lower.includes("prompt")) return "input";
  return lower.replace(/\s+/g, "_") || "other";
};

const getLineMetricKey = (line: OpenAICostOptimizationLineItem) =>
  normalizeMetricKey(`${line.metric_type} ${line.line_item}`);

const getLineFriendlyName = (line: OpenAICostOptimizationLineItem) => {
  const metricKey = getLineMetricKey(line);
  return detailedLabels[metricKey] || line.metric_type || metricKey;
};

const formatLineQuantity = (line: OpenAICostOptimizationLineItem) => {
  const unit = line.quantity_unit || "tokens";
  const lowerUnit = unit.toLowerCase();
  if (lowerUnit.includes("token")) {
    return `${tokenFormatter.format(Math.round(line.quantity || 0))} tokens`;
  }
  return `${tokenFormatter.format(line.quantity || 0)} ${unit}`;
};

const formatLineRate = (line: OpenAICostOptimizationLineItem) => {
  const unit = line.quantity_unit || "token";
  return `${formatCost(line.rate)} / ${unit}`;
};

const Stars = ({ value, size = "md" }: { value: number; size?: "sm" | "md" }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={cn(
          size === "sm" ? "h-3 w-3" : "h-4 w-4",
          star <= value ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/30",
        )}
      />
    ))}
  </div>
);

const renderLineItem = (line: OpenAICostOptimizationLineItem, idx: number) => (
  <div key={`${line.line_item}-${idx}`} className="flex justify-between items-center text-xs bg-white/60 dark:bg-black/20 p-2 rounded-md border border-blue-100/50">
    <div className="min-w-0 pr-3 flex-1">
      <p className="font-semibold text-blue-900 dark:text-blue-100 truncate" title={line.line_item}>
        {getLineFriendlyName(line)}
      </p>
      <div className="flex items-center gap-1 text-[9px] text-blue-700/70 dark:text-blue-300/70 mt-0.5">
        <span className="font-mono">{formatLineRate(line)}</span>
        <span className="opacity-50">-</span>
        <span className="truncate" title={line.line_item}>{line.line_item}</span>
      </div>
    </div>
    <div className="text-right shrink-0 flex flex-col items-end border-l border-blue-200/50 dark:border-blue-800/50 pl-3 ml-2">
      <p className="font-bold text-blue-700 dark:text-blue-400 tabular-nums text-sm">
        {formatCost(line.amount_value)}
      </p>
      <span className="text-[9px] font-medium text-blue-800/70 dark:text-blue-300/70 mt-0.5">
        {formatLineQuantity(line)}
      </span>
    </div>
  </div>
);

const getConfidenceScore = (candidate: OpenAICostOptimizationCandidate) => {
  const score = candidate.confidence;
  return typeof score === "number" && Number.isFinite(score) && score > 0 ? Math.min(score, 100) : -1;
};

const ModelConfidence = ({ score, modelName }: { score: number; modelName: string }) => {
  const hasScore = score >= 0;
  const level = score >= 80 ? "Alta" : score >= 55 ? "Media" : "Baja";
  const scoreLabel = hasScore ? percentFormatter.format(score / 100) : null;

  return (
    <div className="mt-3 space-y-1.5" title="Similitud estimada del modelo candidato con el modelo actual.">
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[11px]">
        <span className="font-medium text-muted-foreground">Confiabilidad del modelo</span>
        <span className="font-semibold text-foreground">
          {hasScore ? level : "Sin datos suficientes"}
        </span>
      </div>
      {hasScore && (
        <div className="flex items-center gap-3">
          <div
            role="meter"
            aria-label={`Confiabilidad de ${modelName}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={score}
            aria-valuetext={`${scoreLabel}, nivel ${level.toLowerCase()}; similitud con el modelo actual`}
            className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
          >
            <div
              className={cn(
                "h-full rounded-full",
                score >= 80 ? "bg-emerald-600 dark:bg-emerald-500"
                  : score >= 55 ? "bg-amber-600 dark:bg-amber-500"
                  : "bg-rose-600 dark:bg-rose-500",
              )}
              style={{ width: `${score}%` }}
            />
          </div>
          <span className="w-14 shrink-0 text-right text-xs font-semibold tabular-nums text-foreground">
            {scoreLabel}
          </span>
        </div>
      )}
    </div>
  );
};

const getDetailedRates = (candidate: OpenAICostOptimizationCandidate): DetailedRateUI[] => {
  const costBreakdown = candidate.cost_breakdown || {};
  return Object.entries(costBreakdown).map(([key, cost]) => ({
    key,
    label: detailedLabels[key] || key,
    rateLabel: candidate.rates?.[key] ? `${formatCost(candidate.rates[key])} / token` : "-",
    cost: formatCost(cost),
  }));
};

const OpenAIModelCard = ({ item }: { item: OpenAICostOptimizationModel }) => {
  const [comparisonSort, setComparisonSort] = useState<ComparisonSortOption>("savings");

  const formatted = useMemo(() => {
    const billingCost = item.total_billing_cost || item.total_cost || 0;

    return {
      billingCost: formatCost(billingCost),
      billingInput: formatCost((item.billing_cost_breakdown?.input || 0) + (item.billing_cost_breakdown?.input_cached || 0)),
      billingOutput: formatCost(item.billing_cost_breakdown?.output),
      tokensInput: tokenFormatter.format(item.tokens?.input || 0),
      tokensOutput: tokenFormatter.format(item.tokens?.output || 0),
      modelName: item.model_name,
      provider: item.provider,
      profile: item.model_profile,
      comparison: item.price_comparison?.map((candidate, index) => {
        const diffAmount = candidate.estimated_cost - billingCost;
        const hasDelta = billingCost > 0;
        const deltaPct = hasDelta ? (diffAmount / billingCost) : candidate.delta_pct / 100;
        const confidenceScore = getConfidenceScore(candidate);
        const profile = candidate.model_profile || {
          stars: 0,
          tier: candidate.tier,
          description: candidate.description,
        };

        return {
          modelName: candidate.model_name,
          provider: candidate.provider,
          sortIndex: index,
          estimatedCost: candidate.estimated_cost,
          savingsAmount: billingCost - candidate.estimated_cost,
          confidenceScore,
          cost: formatCost(candidate.estimated_cost),
          deltaLabel: Number.isFinite(deltaPct) ? percentFormatter.format(deltaPct) : null,
          isCheaper: diffAmount < 0,
          isMoreExpensive: diffAmount > 0,
          isNeutral: diffAmount === 0,
          diffFormatted: formatCost(Math.abs(diffAmount)),
          detailedRates: getDetailedRates(candidate),
          profile,
        };
      }) || [],
    };
  }, [item]);

  const sortedComparison = useMemo(() => {
    const comparison = formatted.comparison;
    const maxSavings = Math.max(0, ...comparison.map((comp) => Math.max(comp.savingsAmount, 0)));

    const savingsScore = (comp: (typeof comparison)[number]) => {
      if (maxSavings <= 0) return 0;
      return (Math.max(comp.savingsAmount, 0) / maxSavings) * 100;
    };

    const bySavings = (a: (typeof comparison)[number], b: (typeof comparison)[number]) =>
      b.savingsAmount - a.savingsAmount;
    const byConfidence = (a: (typeof comparison)[number], b: (typeof comparison)[number]) =>
      b.confidenceScore - a.confidenceScore;
    const byOriginalOrder = (a: (typeof comparison)[number], b: (typeof comparison)[number]) =>
      a.sortIndex - b.sortIndex;

    return [...comparison].sort((a, b) => {
      if (comparisonSort === "confidence") {
        return byConfidence(a, b) || bySavings(a, b) || byOriginalOrder(a, b);
      }

      if (comparisonSort === "balanced") {
        const scoreA = a.confidenceScore < 0 ? -1 : (a.confidenceScore * 0.5) + (savingsScore(a) * 0.5);
        const scoreB = b.confidenceScore < 0 ? -1 : (b.confidenceScore * 0.5) + (savingsScore(b) * 0.5);
        return (scoreB - scoreA) || byConfidence(a, b) || bySavings(a, b) || byOriginalOrder(a, b);
      }

      return bySavings(a, b) || byConfidence(a, b) || byOriginalOrder(a, b);
    });
  }, [formatted.comparison, comparisonSort]);

  const inputLines = item.line_items?.filter((line) => getLineMetricKey(line).includes("input")) || [];
  const outputLines = item.line_items?.filter((line) => getLineMetricKey(line).includes("output")) || [];

  return (
    <Card
      className={cn(
        "flex h-full flex-col overflow-hidden",
        "transition-shadow hover:border-primary/40 hover:shadow-md",
      )}
    >
      <CardHeader className="gap-2 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2.5">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Boxes className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="truncate text-base font-semibold leading-tight text-foreground">
                  {item.provider} - {item.model_name}
                </CardTitle>
                <Stars value={formatted.profile?.stars ?? 0} />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <p className="flex items-center gap-1 truncate text-muted-foreground">
                  <Server className="h-3 w-3" />
                  {item.project_name}
                </p>
                <span className="text-muted-foreground/50">-</span>
                <span className="font-medium text-sky-600 dark:text-sky-400">
                  {formatted.profile?.tier}
                </span>
              </div>

              {formatted.profile?.description && (
                <p className="text-[11px] italic leading-snug text-slate-500 mt-1">
                  &quot;{formatted.profile.description}&quot;
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <Badge variant="outline" className="gap-1 border-primary/30 text-primary mb-1 max-w-[180px]">
              <Server className="h-3 w-3 shrink-0" />
              <span className="truncate" title={item.project_id}>{item.project_id}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border bg-card p-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <ArrowDownToLine className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              Tokens entrada
            </div>
            <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
              {formatted.tokensInput}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <ArrowUpFromLine className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              Tokens salida
            </div>
            <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
              {formatted.tokensOutput}
            </p>
          </div>
        </div>

        <div className="mt-1">
          <div className="rounded-lg border border-blue-200 bg-blue-50/80 p-3 dark:border-blue-900/40 dark:bg-blue-950/20 flex flex-col gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400">
                <ReceiptText className="h-4 w-4 shrink-0" />
                Costo Facturado
              </div>
              <p className="mt-1 text-3xl font-bold tabular-nums text-blue-950 dark:text-blue-50">
                {formatted.billingCost}
              </p>
            </div>

            {(inputLines.length > 0 || outputLines.length > 0) && (
              <div className="flex flex-col gap-4 pt-3 border-t border-blue-200/60 dark:border-blue-800/50 mt-1">
                <p className="text-[10px] font-semibold text-blue-800/70 dark:text-blue-300/70 uppercase tracking-wide">
                  Desglose segun facturacion
                </p>

                {inputLines.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wider">Entrada</span>
                      <span className="text-sm font-bold tabular-nums text-blue-900 dark:text-blue-100">{formatted.billingInput}</span>
                    </div>
                    <div className="space-y-1.5 pl-2.5 border-l-2 border-blue-200 dark:border-blue-800">
                      {inputLines.map(renderLineItem)}
                    </div>
                  </div>
                )}

                {outputLines.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wider">Salida</span>
                      <span className="text-sm font-bold tabular-nums text-blue-900 dark:text-blue-100">{formatted.billingOutput}</span>
                    </div>
                    <div className="space-y-1.5 pl-2.5 border-l-2 border-blue-200 dark:border-blue-800">
                      {outputLines.map(renderLineItem)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Collapsible defaultOpen={false} className="overflow-hidden rounded-lg border bg-card mt-2">
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="group h-auto w-full justify-between rounded-none px-3 py-3 text-left cursor-pointer hover:bg-muted/50"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 dark:text-sky-400">
                <Bot className="h-4 w-4" />
                Simulacion de costos
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="cost-comparison-content overflow-hidden border-t">
            <div className="p-3">
              <p className="text-sm leading-snug text-slate-500">
                Simulacion del gasto de tu operacion en modelos equivalentes basado en tu facturacion actual.
              </p>

              <div className="mt-3 flex items-center justify-between gap-2 rounded-md bg-muted px-2.5 py-2 text-xs">
                <span className="min-w-0 truncate text-sky-600 font-bold">
                  Modelo actual - {formatted.provider} - {formatted.modelName}
                </span>
                <span className="shrink-0 font-bold tabular-nums text-foreground text-sm">
                  {formatted.billingCost}
                </span>
              </div>

              {formatted.comparison.length > 1 && (
                <div className="mt-3 flex flex-col gap-1.5 rounded-md border bg-background/70 p-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Ordenar modelos
                  </span>
                  <Select value={comparisonSort} onValueChange={(value) => setComparisonSort(value as ComparisonSortOption)}>
                    <SelectTrigger className="h-8 w-full text-xs sm:w-[230px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {comparisonSortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formatted.comparison.length === 0 ? (
                <p className="mt-3 rounded-md border border-dashed px-3 py-3 text-center text-xs text-muted-foreground">
                  No hay modelos equivalentes para comparar.
                </p>
              ) : (
                <div className="mt-2.5 space-y-2">
                  {sortedComparison.map((comp) => (
                    <div key={`${comp.modelName}-${comp.provider}`} className="rounded-md border bg-background px-3 py-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-bold leading-tight text-foreground">
                              {comp.modelName}
                            </p>
                            {comp.profile && <Stars value={comp.profile.stars ?? 0} size="sm" />}
                          </div>
                          <p className="truncate text-xs font-medium text-sky-600 mt-0.5">
                            {comp.provider}
                            {comp.profile && <span className="text-muted-foreground font-normal ml-1">- {comp.profile.tier}</span>}
                          </p>
                          {comp.profile?.description && (
                            <p className="mt-1 text-[11px] italic leading-snug text-slate-500">
                              &quot;{comp.profile.description}&quot;
                            </p>
                          )}
                        </div>

                        {comp.deltaLabel && (
                          <Badge
                            variant="outline"
                            className={cn(
                              "shrink-0 gap-1 tabular-nums mt-0.5",
                              comp.isCheaper && "border-emerald-300 text-emerald-700 dark:border-emerald-900/50 dark:text-emerald-400",
                              comp.isMoreExpensive && "border-red-300 text-red-700 dark:border-red-900/50 dark:text-red-400",
                              comp.isNeutral && "text-muted-foreground",
                            )}
                          >
                            {comp.isCheaper && <ArrowDownRight className="h-3 w-3" />}
                            {comp.isMoreExpensive && <ArrowUpRight className="h-3 w-3" />}
                            {comp.deltaLabel}
                          </Badge>
                        )}
                      </div>

                      <ModelConfidence score={comp.confidenceScore} modelName={comp.modelName} />

                      <div className="mt-2.5 border-t border-muted/50 pt-2">
                        <p className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                          Desglose Simulado
                        </p>
                        <div className="space-y-1.5 mb-2">
                          {comp.detailedRates.map((rate) => (
                            <div key={rate.key} className="flex items-center justify-between text-[10px] bg-muted/30 px-2 py-1.5 rounded border border-muted/60">
                              <div className="flex flex-col min-w-0 pr-2">
                                <span className="font-semibold text-foreground/80 truncate">{rate.label}</span>
                                <span className="font-mono whitespace-nowrap text-[9px] text-muted-foreground mt-0.5">{rate.rateLabel}</span>
                              </div>
                              <div className="shrink-0 text-right pl-2 border-l border-muted/50 ml-auto">
                                <span className="font-bold tabular-nums text-foreground">
                                  {rate.cost}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-end mt-3 pt-3 border-t border-muted/50">
                          <div className="flex flex-col gap-0.5">
                            {comp.isCheaper && (
                              <>
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">Ahorro Proyectado</span>
                                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500 tabular-nums">-{comp.diffFormatted}</span>
                              </>
                            )}
                            {comp.isMoreExpensive && (
                              <>
                                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-500 uppercase tracking-wider">Costo Adicional</span>
                                <span className="text-sm font-bold text-rose-600 dark:text-rose-500 tabular-nums">+{comp.diffFormatted}</span>
                              </>
                            )}
                            {comp.isNeutral && (
                              <>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Diferencia</span>
                                <span className="text-sm font-bold text-muted-foreground tabular-nums">{comp.diffFormatted}</span>
                              </>
                            )}
                          </div>
                          <div className="text-right flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Costo Estimado</span>
                            <span className="text-lg font-bold tabular-nums text-foreground leading-none">
                              {comp.cost}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="mt-auto space-y-1 border-t pt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <Fingerprint className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="shrink-0 text-muted-foreground">Version Modelo:</span>
            <span className="min-w-0 flex-1 truncate font-mono text-foreground">
              {item.model_version}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Server className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="shrink-0 text-muted-foreground">Proyecto Base:</span>
            <span className="min-w-0 flex-1 truncate font-mono text-foreground">
              {item.project_name}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const OpenAICostOptimizationCardsComponent = ({ data }: { data: OpenAICostOptimizationModel[] }) => {
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => (b.total_billing_cost || 0) - (a.total_billing_cost || 0));
  }, [data]);

  if (sortedData.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed p-8 text-sm text-muted-foreground">
        No hay datos de consumo disponibles.
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "grid gap-4",
          sortedData.length === 1 && "grid-cols-1",
          sortedData.length === 2 && "grid-cols-1 md:grid-cols-2",
          sortedData.length > 2 && "grid-cols-1 md:grid-cols-2 xl:grid-cols-2",
        )}
      >
        {sortedData.map((model) => (
          <OpenAIModelCard key={`${model.project_id}-${model.model_name}`} item={model} />
        ))}
      </div>
    </>
  );
};