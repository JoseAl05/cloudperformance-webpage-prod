"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Coins,
  Fingerprint,
  MapPin,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FoundationModelsPriceRate } from "@/interfaces/bedrock-cost-optimization/foundationModels";

const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 12,
});

const tokenFormatter = new Intl.NumberFormat("es-CL");

const rateFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 12,
});

const percentFormatter = new Intl.NumberFormat("es-CL", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
});

const formatRate = (value: string): string => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? rateFormatter.format(parsed) : value;
};

const rateLabels: Record<string, string> = {
  input: "Entrada",
  output: "Salida",
  cache_read: "Lectura de caché",
  cache_write: "Escritura de caché",
};

const rateRows = [
  { key: "input", label: "Entrada" },
  { key: "output", label: "Salida" },
  { key: "cache_read", label: "Lectura de caché" },
  { key: "cache_write", label: "Escritura de caché" },
] as const;

const FoundationModelCard = ({
  fm,
  expanded = false,
}: {
  fm: FoundationModelsPriceRate;
  expanded?: boolean;
}) => {
  const formatted = useMemo(
    () => ({
      cost: currencyFormatter.format(fm.cost),
      costInput: currencyFormatter.format(fm.cost_breakdown.input),
      costOutput: currencyFormatter.format(fm.cost_breakdown.output),
      tokensInput: tokenFormatter.format(fm.tokens.input),
      tokensOutput: tokenFormatter.format(fm.tokens.output),
      modelName: fm.modelName,
      provider: fm.provider,
      comparison: fm.price_comparison.map((pc) => {
        const delta = pc.delta_pct_vs_current;
        const hasDelta = typeof delta === "number";
        const missing = pc.missing_rates ?? [];
        return {
          modelName: pc.modelName,
          provider: pc.provider,
          cost: currencyFormatter.format(pc.estimated_cost),
          costInput:
            pc.cost_breakdown.input != null
              ? currencyFormatter.format(pc.cost_breakdown.input)
              : "—",
          costOutput:
            pc.cost_breakdown.output != null
              ? currencyFormatter.format(pc.cost_breakdown.output)
              : "—",
          deltaLabel: hasDelta ? percentFormatter.format(delta / 100) : null,
          isCheaper: hasDelta && delta < 0,
          isMoreExpensive: hasDelta && delta > 0,
          isNeutral: hasDelta && delta === 0,
          hasMissing: missing.length > 0,
          missingLabel: missing.map((key) => rateLabels[key] ?? key).join(", "),
        };
      }),
    }),
    [fm],
  );

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
            <div className="min-w-0">
              <CardTitle className="truncate text-base font-semibold leading-tight text-foreground">
                {fm.provider} - {fm.modelName}
              </CardTitle>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {fm.foundationModelName}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="shrink-0 gap-1 border-primary/30 text-primary"
          >
            <MapPin className="h-3 w-3" />
            {fm.region}
          </Badge>
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
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <Coins className="h-4 w-4" />
            Costo total
          </div>
          <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-950 dark:text-emerald-50">
            {formatted.cost}
          </p>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <div className="rounded-md border bg-card px-2.5 py-1.5">
              <p
                className={cn(
                  "text-xs text-muted-foreground",
                  expanded && "text-sm",
                )}
              >
                Entrada
              </p>
              <p
                className={cn(
                  "font-semibold tabular-nums text-foreground",
                  expanded && "text-xl",
                )}
              >
                {formatted.costInput}
              </p>
            </div>
            <div className="rounded-md border bg-card px-2.5 py-1.5">
              <p
                className={cn(
                  "text-xs text-muted-foreground",
                  expanded && "text-sm",
                )}
              >
                Salida
              </p>
              <p
                className={cn(
                  "font-semibold tabular-nums text-foreground",
                  expanded && "text-xl",
                )}
              >
                {formatted.costOutput}
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border">
          <div className="grid grid-cols-[minmax(0,1.4fr)_1fr_1fr] gap-2 border-b bg-muted px-3 py-2 text-xs font-semibold text-foreground">
            <span>Tarifas</span>
            <span className="text-right">por 1K</span>
            <span className="text-right">por 1M</span>
          </div>
          <div className="divide-y">
            {rateRows.map((row) => (
              <div
                key={row.key}
                className="grid grid-cols-[minmax(0,1.4fr)_1fr_1fr] items-center gap-2 px-3 py-2 text-xs"
              >
                <span className="font-medium leading-tight text-foreground">
                  {row.label}
                </span>
                <span className="text-right font-medium tabular-nums text-foreground">
                  {formatRate(fm.rates[row.key].price_per_1k_tokens)}
                </span>
                <span className="text-right font-medium tabular-nums text-foreground">
                  {formatRate(fm.rates[row.key].price_per_1m_tokens)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Collapsible
          defaultOpen={false}
          className="overflow-hidden rounded-lg border bg-card"
        >
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="group h-auto w-full justify-between rounded-none px-3 py-3 text-left cursor-pointer hover:bg-muted/50"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 dark:text-sky-400">
                <Bot className="h-4 w-4" />
                Comparación de costos
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="cost-comparison-content overflow-hidden border-t">
            <div className="p-3">
              <p className="text-sm leading-snug text-slate-500">
                Costo estimado de tu uso actual si se ejecutara en modelos
                equivalentes de otros proveedores.
              </p>
              <div className="mt-2 flex items-center justify-between gap-2 rounded-md bg-muted px-2.5 py-1.5 text-xs">
                <span className="min-w-0 truncate text-sky-600 font-bold">
                  Modelo actual · {formatted.provider} - {formatted.modelName}
                </span>
                <span className="shrink-0 font-semibold tabular-nums text-foreground">
                  {formatted.cost}
                </span>
              </div>

              {formatted.comparison.length === 0 ? (
                <p className="mt-3 rounded-md border border-dashed px-3 py-3 text-center text-xs text-muted-foreground">
                  No hay modelos equivalentes para comparar.
                </p>
              ) : (
                <div className="mt-2.5 space-y-2">
                  {formatted.comparison.map((comp) => (
                    <div
                      key={`${comp.modelName}-${comp.provider}`}
                      className="rounded-md border bg-background px-3 py-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium leading-tight text-foreground">
                            {comp.modelName}
                          </p>
                          <p className="truncate text-xs text-sky-600">
                            {comp.provider}
                          </p>
                        </div>
                        {comp.deltaLabel && (
                          <Badge
                            variant="outline"
                            className={cn(
                              "shrink-0 gap-1 tabular-nums",
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
                      <div className="mt-2 flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] text-muted-foreground">
                            Costo estimado
                          </p>
                          <p className="text-base font-bold tabular-nums text-foreground">
                            {comp.cost}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "shrink-0 space-y-0.5 text-right text-[11px] text-muted-foreground",
                            expanded && "text-sm",
                          )}
                        >
                          <p>
                            Entrada{" "}
                            <span className="font-medium tabular-nums text-foreground">
                              {comp.costInput}
                            </span>
                          </p>
                          <p>
                            Salida{" "}
                            <span className="font-medium tabular-nums text-foreground">
                              {comp.costOutput}
                            </span>
                          </p>
                        </div>
                      </div>
                      {comp.hasMissing && (
                        <p className="mt-2 flex items-center gap-1 text-[11px] leading-snug text-amber-600 dark:text-amber-400">
                          <TriangleAlert className="h-3 w-3 shrink-0" />
                          Comparación parcial: sin tarifa para{" "}
                          {comp.missingLabel}.
                        </p>
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
            <span className="shrink-0 text-muted-foreground">Modelo:</span>
            <span className="min-w-0 flex-1 truncate font-mono text-foreground">
              {fm.modelId}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fingerprint className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="shrink-0 text-muted-foreground">Modelo Foundation:</span>
            <span className="min-w-0 flex-1 truncate font-mono text-foreground">
              {fm.foundationModelId}
            </span>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export const COFoundationCardsComponent = ({
  data,
}: {
  data: FoundationModelsPriceRate[];
}) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed p-8 text-sm text-muted-foreground">
        No hay modelos foundation disponibles.
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "grid gap-4",
          data.length === 1 && "grid-cols-1",
          data.length === 2 && "grid-cols-1 md:grid-cols-2",
          data.length > 2 && "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
        )}
      >
        {data.map((fm) => (
          <FoundationModelCard
            key={`${fm.foundationModelId}-${fm.region}`}
            fm={fm}
            expanded={data.length === 1}
          />
        ))}
      </div>

      {/* <style jsx global>{`
        @keyframes cost-comparison-collapsible-down {
          from {
            height: 0;
            opacity: 0;
          }
          to {
            height: var(--radix-collapsible-content-height);
            opacity: 1;
          }
        }

        @keyframes cost-comparison-collapsible-up {
          from {
            height: var(--radix-collapsible-content-height);
            opacity: 1;
          }
          to {
            height: 0;
            opacity: 0;
          }
        }

        .cost-comparison-content[data-state="open"] {
          animation: cost-comparison-collapsible-down 300ms ease-out;
        }

        .cost-comparison-content[data-state="closed"] {
          animation: cost-comparison-collapsible-up 300ms ease-out;
        }
      `}</style> */}
    </>
  );
};