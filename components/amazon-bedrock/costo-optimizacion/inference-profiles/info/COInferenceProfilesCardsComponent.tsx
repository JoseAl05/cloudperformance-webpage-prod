import { useMemo } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    Boxes,
    Coins,
    Fingerprint,
    MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { InferenceProfilesPriceRate } from "@/types/inferenceProfiles";

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

const formatRate = (value: string): string => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? rateFormatter.format(parsed) : value;
};

const rateRows = [
    { key: "input", label: "Entrada" },
    { key: "output", label: "Salida" },
    { key: "cache_read", label: "Lectura de caché" },
    { key: "cache_write", label: "Escritura de caché" },
] as const;

const InferenceProfileCard = ({
    profile,
}: {
    profile: InferenceProfilesPriceRate;
}) => {
    const formatted = useMemo(
        () => ({
            cost: currencyFormatter.format(profile.cost),
            costInput: currencyFormatter.format(profile.cost_breakdown.input),
            costOutput: currencyFormatter.format(profile.cost_breakdown.output),
            tokensInput: tokenFormatter.format(profile.tokens.input),
            tokensOutput: tokenFormatter.format(profile.tokens.output),
        }),
        [profile]
    );

    return (
        <Card
            className={cn(
                "flex h-full flex-col overflow-hidden",
                "transition-shadow hover:border-primary/40 hover:shadow-md"
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
                                {profile.modelName}
                            </CardTitle>
                            <p className="mt-0.5 truncate text-sm text-muted-foreground">
                                {profile.inferenceProfileName}
                            </p>
                        </div>
                    </div>
                    <Badge
                        variant="outline"
                        className="shrink-0 gap-1 border-primary/30 text-primary"
                    >
                        <MapPin className="h-3 w-3" />
                        {profile.region}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-3">
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
                            <p className="text-xs text-muted-foreground">Entrada</p>
                            <p className="font-semibold tabular-nums text-foreground">
                                {formatted.costInput}
                            </p>
                        </div>
                        <div className="rounded-md border bg-card px-2.5 py-1.5">
                            <p className="text-xs text-muted-foreground">Salida</p>
                            <p className="font-semibold tabular-nums text-foreground">
                                {formatted.costOutput}
                            </p>
                        </div>
                    </div>
                </div>

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
                                    {formatRate(profile.rates[row.key].price_per_1k_tokens)}
                                </span>
                                <span className="text-right font-medium tabular-nums text-foreground">
                                    {formatRate(profile.rates[row.key].price_per_1m_tokens)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-auto space-y-1 border-t pt-3 text-xs">
                    <div className="flex items-center gap-1.5">
                        <Fingerprint className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="shrink-0 text-muted-foreground">Modelo:</span>
                        <span className="min-w-0 flex-1 truncate font-mono text-foreground">
                            {profile.modelId}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Fingerprint className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="shrink-0 text-muted-foreground">Perfil:</span>
                        <span className="min-w-0 flex-1 truncate font-mono text-foreground">
                            {profile.inferenceProfileId}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export const COInferenceProfilesCardsComponent = ({
    data,
}: {
    data: InferenceProfilesPriceRate[];
}) => {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center rounded-lg border border-dashed p-8 text-sm text-muted-foreground">
                No hay perfiles de inferencia disponibles.
            </div>
        );
    }

    return (
        <div className={
            cn(
                "grid gap-4",
                data.length === 1 && "sm:grid-cols-1 xl:grid-cols-1",
                data.length === 2 && "sm:grid-cols-1 xl:grid-cols-2",
                data.length > 2 && "sm:grid-cols-1 xl:grid-cols-3"
            )
        }>
            {data.map((profile) => (
                <InferenceProfileCard
                    key={`${profile.inferenceProfileId}-${profile.region}`}
                    profile={profile}
                />
            ))}
        </div>
    );
};