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
  MapPin,
  TriangleAlert,
  Server,
  ReceiptText,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  AzureModelCost, 
  PriceComparison, 
  RateObject, 
  MeterDetail 
} from '@/interfaces/foundry-cost-optimization/foundationModels';

interface DetailedRateUI {
  key: string;
  label: string;
  meterName: string;
  rateLabel: string;
  cost: string;
}

type ComparisonSortOption = "savings" | "confidence" | "balanced";

const comparisonSortOptions: { value: ComparisonSortOption; label: string }[] = [
  { value: "savings", label: "Mayor ahorro" },
  { value: "confidence", label: "Mayor confiabilidad" },
  { value: "balanced", label: "Confiabilidad + ahorro" },
];
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

const formatRate = (rateObj: RateObject | undefined | null) => {
  if (!rateObj || rateObj.price === 0 || rateObj.price === undefined) return "—";
  return `${formatCost(rateObj.price)} / ${rateObj.unit}`;
};

const tokenFormatter = new Intl.NumberFormat("es-CL");

const percentFormatter = new Intl.NumberFormat("es-CL", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
});

const formatMeterTokens = (quantity: number, unit: string) => {
  let multiplier = 1;
  const u = (unit || "").toLowerCase();
  if (u.includes("1m") || u.includes("1 m")) multiplier = 1000000;
  else if (u.includes("1k") || u.includes("1 k")) multiplier = 1000;

  const tokens = Math.round(quantity * multiplier);
  return `${new Intl.NumberFormat("es-CL").format(tokens)} tokens`;
};

const rateLabels: Record<string, string> = {
  input: "Entrada",
  output: "Salida",
};

const detailedLabels: Record<string, string> = {
  input: "Entrada",
  input_cached: "Entrada (Caché Lectura)",
  input_cached_write: "Entrada (Caché Escritura)",
  output: "Salida",
  output_cached: "Salida (Caché)"
};

const getMeterFriendlyName = (meterName: string, metricType: string) => {
  const lower = meterName.toLowerCase();
  if (metricType === "input_cached_write" || lower.includes(" wr ")) return "Entrada (Caché Escritura)";
  if (metricType === "input_cached" || lower.includes("cd") || lower.includes("cached")) return "Entrada (Caché Lectura)";
  if (lower.includes("ft") || lower.includes("finetune")) return "Fine-tuning";
  return detailedLabels[metricType] || rateLabels[metricType] || metricType;
};

const renderMeterItem = (meter: MeterDetail, idx: number) => {
  const totalTokens = formatMeterTokens(meter.quantity, meter.unit_of_measure);
  const rateCalc = meter.quantity > 0 ? (meter.cost_in_billing_currency / meter.quantity) : 0;
  const rateFormatted = `${formatCost(rateCalc)} / ${meter.unit_of_measure}`;
  const friendlyName = getMeterFriendlyName(meter.meter_name, meter.metric_type);

  return (
    <div key={idx} className="flex justify-between items-center text-xs bg-white/60 dark:bg-black/20 p-2 rounded-md border border-blue-100/50">
      <div className="min-w-0 pr-3 flex-1">
        <p className="font-semibold text-blue-900 dark:text-blue-100 truncate" title={meter.meter_name}>
          {friendlyName}
        </p>
        <div className="flex items-center gap-1 text-[9px] text-blue-700/70 dark:text-blue-300/70 mt-0.5">
          <span className="font-mono">{rateFormatted}</span>
          <span className="opacity-50">•</span>
          <span className="truncate" title={meter.meter_name}>{meter.meter_name}</span>
        </div>
      </div>
      <div className="text-right shrink-0 flex flex-col items-end border-l border-blue-200/50 dark:border-blue-800/50 pl-3 ml-2">
        <p className="font-bold text-blue-700 dark:text-blue-400 tabular-nums text-sm">
          {formatCost(meter.cost_in_billing_currency)}
        </p>
        <span className="text-[9px] font-medium text-blue-800/70 dark:text-blue-300/70 mt-0.5">
          {totalTokens}
        </span>
      </div>
    </div>
  );
};

const confidenceFormatter = new Intl.NumberFormat("es-CL", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const getConfidenceScore = (similarity: PriceComparison["model_similarity"]) => {
  const score = similarity?.score;
  return typeof score === "number" && Number.isFinite(score) ? score : -1;
};

const ModelConfidence = ({
  similarity,
  modelName,
}: {
  similarity: PriceComparison["model_similarity"];
  modelName: string;
}) => {
  const score = similarity?.score;
  const hasScore = typeof score === "number" && Number.isFinite(score)
    && score >= 0 && score <= 100 && similarity?.level !== "insufficient_data";
  const level = similarity?.level;
  const levelLabel = level === "high" ? "Alta" : level === "medium" ? "Media" : level === "low" ? "Baja" : "";
  const scoreLabel = hasScore ? confidenceFormatter.format(score / 100) : null;
  const includesPricing = similarity?.basis === "category_profile_capabilities_and_pricing";
  const categoryEstimate = includesPricing || similarity?.basis === "category_profile_and_capabilities";
  const onlyCapabilities = similarity?.skills?.required?.length === 0;
  const coverage = similarity?.evidence_coverage_pct;
  const partialEvidence = typeof coverage === "number" && Number.isFinite(coverage)
    && coverage >= 0 && coverage < 100;

  return (
    <div className="mt-3 space-y-1.5" title="Similitud estimada de habilidades, capacidades y pricing con el modelo actual; no representa una probabilidad de exito.">
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[11px]">
        <span className="font-medium text-muted-foreground">Confiabilidad del modelo</span>
        <span className="font-semibold text-foreground">
          {hasScore ? levelLabel : "Sin datos suficientes"}
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
            aria-valuetext={`${scoreLabel}, nivel ${levelLabel.toLowerCase()}; similitud con el modelo actual`}
            className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
          >
            <div
              className={cn(
                "h-full rounded-full",
                level === "high" ? "bg-emerald-600 dark:bg-emerald-500"
                  : level === "medium" ? "bg-amber-600 dark:bg-amber-500"
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
      {hasScore && categoryEstimate && (
        <p className="text-[10px] leading-snug text-muted-foreground">
          {includesPricing ? "Estimacion por categoria, perfil, capacidades y pricing del modelo." : "Estimacion por categoria, perfil y capacidades del modelo."}
        </p>
      )}
      {hasScore && (onlyCapabilities || partialEvidence) && (
        <p className="text-[10px] leading-snug text-muted-foreground">
          {onlyCapabilities && "Basada solo en capacidades documentadas."}
          {onlyCapabilities && partialEvidence && " "}
          {partialEvidence && `Datos disponibles para el ${confidenceFormatter.format(coverage / 100)} de los requisitos.`}
        </p>
      )}
    </div>
  );
};

const AzureModelCard = ({
  azureModel,
}: {
  azureModel: AzureModelCost;
}) => {
  const formatted = useMemo(
    () => ({
      billingCost: formatCost(azureModel.total_billing_cost),
      billingInput: formatCost(azureModel.billing_cost_breakdown?.input),
      billingOutput: formatCost(azureModel.billing_cost_breakdown?.output),
      billingRateInput: formatRate(azureModel.billing_rates?.input),
      billingRateOutput: formatRate(azureModel.billing_rates?.output),

      tokensInput: tokenFormatter.format(azureModel.tokens?.input || 0),
      tokensOutput: tokenFormatter.format(azureModel.tokens?.output || 0),
      modelName: azureModel.model_name,
      provider: azureModel.provider,
      profile: azureModel.model_profile,
      
      comparison: azureModel.price_comparison?.map((pc: PriceComparison, index: number) => {
        const delta = pc.delta_pct_vs_billing;
        const hasDelta = typeof delta === "number";
        const missing = pc.missing_rates ?? [];
        
        const detailedRates = pc.detailed_base_rates 
          ? Object.entries(pc.detailed_base_rates).map(([key, rateObj]: [string, RateObject]) => ({
              key,
              label: detailedLabels[key] || key,
              meterName: rateObj.meter_name || "—",
              rateLabel: `${formatCost(rateObj.price)} / ${rateObj.unit}`,
              cost: formatCost(pc.detailed_cost_breakdown?.[key])
            }))
          : [];

        const techParity = pc.technical_parity_report;
        const missingCaps = (techParity?.missing_capabilities && techParity.missing_capabilities.length > 0)
          ? techParity.missing_capabilities.join(", ") 
          : null;
        const infraWarning = techParity?.infrastructure_warning !== "OK" 
          ? techParity?.infrastructure_warning 
          : null;

        const diffAmount = pc.estimated_cost - azureModel.total_billing_cost;
        const diffFormatted = formatCost(Math.abs(diffAmount));
        const confidenceScore = getConfidenceScore(pc.model_similarity);

        return {
          modelName: pc.modelName,
          modelSimilarity: pc.model_similarity,
          sortIndex: index,
          estimatedCost: pc.estimated_cost,
          savingsAmount: azureModel.total_billing_cost - pc.estimated_cost,
          confidenceScore,
          provider: pc.provider,
          cost: formatCost(pc.estimated_cost),
          deltaLabel: hasDelta && delta !== null ? percentFormatter.format(delta / 100) : null,
          isCheaper: hasDelta && delta !== null && delta < 0,
          isMoreExpensive: hasDelta && delta !== null && delta > 0,
          isNeutral: hasDelta && delta !== null && delta === 0,
          hasMissing: missing.length > 0,
          missingLabel: missing.map((key: string) => rateLabels[key] ?? key).join(", "),
          detailedRates,
          missingCaps,
          infraWarning,
          currentTpm: techParity?.current_max_tpm || 0,
          candidateTpm: techParity?.candidate_max_tpm || 0,
          diffFormatted,
          profile: pc.model_profile
        };
      }) || [],
    }),
    [azureModel],
  );


  const [comparisonSort, setComparisonSort] = useState<ComparisonSortOption>("savings");

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
  const inputMeters = azureModel.meter_details?.filter(m => m.metric_type.includes('input')) || [];
  const outputMeters = azureModel.meter_details?.filter(m => m.metric_type.includes('output')) || [];

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
                  {azureModel.provider} - {azureModel.model_name}
                </CardTitle>
                
                {formatted.profile && (
                  <div className="flex items-center gap-0.5" title={formatted.profile?.tier}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-4 w-4",
                          star <= (formatted.profile?.stars ?? 0)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <p className="flex items-center gap-1 truncate text-muted-foreground">
                  <Server className="h-3 w-3" />
                  {azureModel.account_name}
                </p>

                {formatted.profile && (
                  <>
                    <span className="text-muted-foreground/50">•</span>
                    <span className="font-medium text-sky-600 dark:text-sky-400">
                      {formatted.profile?.tier}
                    </span>
                  </>
                )}
              </div>

              {formatted.profile?.description && (
                <p className="text-[11px] italic leading-snug text-slate-500 mt-1">
                  &quot;{formatted.profile?.description}&quot;
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <Badge
              variant="outline"
              className="gap-1 border-primary/30 text-primary mb-1"
            >
              <MapPin className="h-3 w-3" />
              {azureModel.region}
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

            {(inputMeters.length > 0 || outputMeters.length > 0) && (
              <div className="flex flex-col gap-4 pt-3 border-t border-blue-200/60 dark:border-blue-800/50 mt-1">
                <p className="text-[10px] font-semibold text-blue-800/70 dark:text-blue-300/70 uppercase tracking-wide">
                  Desglose según facturación
                </p>

                {inputMeters.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wider">Entrada</span>
                      <span className="text-sm font-bold tabular-nums text-blue-900 dark:text-blue-100">{formatted.billingInput}</span>
                    </div>
                    <div className="space-y-1.5 pl-2.5 border-l-2 border-blue-200 dark:border-blue-800">
                      {inputMeters.map(renderMeterItem)}
                    </div>
                  </div>
                )}

                {outputMeters.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wider">Salida</span>
                      <span className="text-sm font-bold tabular-nums text-blue-900 dark:text-blue-100">{formatted.billingOutput}</span>
                    </div>
                    <div className="space-y-1.5 pl-2.5 border-l-2 border-blue-200 dark:border-blue-800">
                      {outputMeters.map(renderMeterItem)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Collapsible
          defaultOpen={false}
          className="overflow-hidden rounded-lg border bg-card mt-2"
        >
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="group h-auto w-full justify-between rounded-none px-3 py-3 text-left cursor-pointer hover:bg-muted/50"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 dark:text-sky-400">
                <Bot className="h-4 w-4" />
                Simulación de costos
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="cost-comparison-content overflow-hidden border-t">
            <div className="p-3">
              <p className="text-sm leading-snug text-slate-500">
                Simulación del gasto de tu operación en modelos equivalentes de otros proveedores basado en tu facturación actual.
              </p>
              
              <div className="mt-3 flex items-center justify-between gap-2 rounded-md bg-muted px-2.5 py-2 text-xs">
                <span className="min-w-0 truncate text-sky-600 font-bold">
                  Modelo actual · {formatted.provider} - {formatted.modelName}
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
                    <div
                      key={`${comp.modelName}-${comp.provider}`}
                      className="rounded-md border bg-background px-3 py-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-bold leading-tight text-foreground">
                              {comp.modelName}
                            </p>
                            
                            {comp.profile && (
                              <div className="flex items-center gap-0.5" title={comp.profile?.tier}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={cn(
                                      "h-3 w-3",
                                      star <= (comp.profile?.stars ?? 0)
                                        ? "fill-amber-400 text-amber-400"
                                        : "fill-muted text-muted-foreground/30"
                                    )}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          <p className="truncate text-xs font-medium text-sky-600 mt-0.5">
                            {comp.provider} 
                            {comp.profile && <span className="text-muted-foreground font-normal ml-1">• {comp.profile?.tier}</span>}
                          </p>
                          
                          {comp.profile?.description && (
                            <p className="mt-1 text-[11px] italic leading-snug text-slate-500">
                              &quot;{comp.profile?.description}&quot;
                            </p>
                          )}
                        </div>
                        {comp.deltaLabel && (
                          <Badge
                            variant="outline"
                            className={cn(
                              "shrink-0 gap-1 tabular-nums mt-0.5",
                              comp.isCheaper &&
                                "border-emerald-300 text-emerald-700 dark:border-emerald-900/50 dark:text-emerald-400",
                              comp.isMoreExpensive &&
                                "border-red-300 text-red-700 dark:border-red-900/50 dark:text-red-400",
                              comp.isNeutral && "text-muted-foreground",
                            )}
                          >
                            {comp.isCheaper && (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {comp.isMoreExpensive && (
                              <ArrowUpRight className="h-3 w-3" />
                            )}
                            {comp.deltaLabel}
                          </Badge>
                        )}
                      </div>
                      
                      <ModelConfidence
                        similarity={comp.modelSimilarity}
                        modelName={comp.modelName}
                      />

                      <div className="mt-2.5 border-t border-muted/50 pt-2">
                        <p className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                          Desglose Simulado
                        </p>
                        <div className="space-y-1.5 mb-2">
                          {comp.detailedRates.map((r: DetailedRateUI) => (
                            <div key={r.key} className="flex items-center justify-between text-[10px] bg-muted/30 px-2 py-1.5 rounded border border-muted/60">
                              <div className="flex flex-col min-w-0 pr-2">
                                <span className="font-semibold text-foreground/80 truncate">{r.label}</span>
                                <div className="flex items-center gap-1 text-[9px] text-muted-foreground mt-0.5">
                                  <span className="font-mono whitespace-nowrap">{r.rateLabel}</span>
                                  {r.meterName !== "—" && (
                                    <>
                                      <span className="opacity-50">•</span>
                                      <span className="truncate" title={r.meterName}>{r.meterName}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="shrink-0 text-right pl-2 border-l border-muted/50 ml-auto">
                                <span className="font-bold tabular-nums text-foreground">
                                  {r.cost}
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

                      {comp.hasMissing && (
                        <p className="mt-3 flex items-center gap-1 text-[11px] leading-snug text-amber-600 dark:text-amber-400">
                          <TriangleAlert className="h-3 w-3 shrink-0" />
                          Comparación parcial: sin tarifa para {comp.missingLabel}.
                        </p>
                      )}

                      {comp.missingCaps && (
                        <div className="mt-3 flex items-start gap-1.5 rounded bg-amber-50 p-2 text-[11px] leading-snug text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
                          <TriangleAlert className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <p>
                            <span className="font-semibold">Faltan capacidades:</span> El candidato no soporta <span className="font-mono text-[10px] font-bold">{comp.missingCaps}</span>.
                          </p>
                        </div>
                      )}

                      {comp.infraWarning && (
                        <div className="mt-2 flex items-start gap-1.5 rounded bg-rose-50 p-2 text-[11px] leading-snug text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
                          <TriangleAlert className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <p>
                            <span className="font-semibold">Riesgo de cuota (TPM):</span> {comp.infraWarning} ({tokenFormatter.format(comp.candidateTpm)} vs {tokenFormatter.format(comp.currentTpm)} TPM).
                          </p>
                        </div>
                      )}

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
            <span className="shrink-0 text-muted-foreground">Versión Modelo:</span>
            <span className="min-w-0 flex-1 truncate font-mono text-foreground">
              {azureModel.model_version}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Server className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="shrink-0 text-muted-foreground">Cuenta Base:</span>
            <span className="min-w-0 flex-1 truncate font-mono text-foreground">
              {azureModel.account_name}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AzureFoundryCardsComponent = ({
  data,
}: {
  data: AzureModelCost[];
}) => {
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
        {sortedData.map((azureModel) => (
          <AzureModelCard
            key={`${azureModel.account_name}-${azureModel.model_name}`}
            azureModel={azureModel}
          />
        ))}
      </div>
    </>
  );
};