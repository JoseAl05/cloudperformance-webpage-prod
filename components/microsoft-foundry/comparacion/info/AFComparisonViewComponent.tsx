'use client'

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertTriangle, Cloud } from 'lucide-react';
import { AzureFoundryComparison } from '@/interfaces/vista-azure-foundry/azureFoundryInterfaces';
import { AzureFoundrySummaryCards } from '@/components/microsoft-foundry/comparacion/info/AFComparisonCardsComponent';
import { formatCurrency, formatInteger } from '@/lib/azureFoundryFormatters';
import { AzureFoundryModelsTableComponent } from '@/components/microsoft-foundry/comparacion/table/AFComparisonModelsTableComponent';
import { AzureFoundryCandidatesTableComponent } from '@/components/microsoft-foundry/comparacion/table/AFComparisonCandidatesTableComponent';
import { AzureFoundryDeploymentsTableComponent } from '@/components/microsoft-foundry/comparacion/table/AFComparisonDeploymentsTableComponent';

interface AzureFoundryComparisonViewProps {
    data: AzureFoundryComparison;
}

export const AzureFoundryComparisonView = ({ data }: AzureFoundryComparisonViewProps) => {
    const pendingMeters = useMemo(
        () => [...(data.unmapped_meters || []), ...(data.unresolved_meters || [])],
        [data.unmapped_meters, data.unresolved_meters]
    );

    const pendingCost = useMemo(
        () => pendingMeters.reduce((total, meter) => total + (meter.cost_usd || 0), 0),
        [pendingMeters]
    );

    return (
        <div className="flex flex-col gap-4">
            <Card className="border-slate-200 dark:border-slate-800">
                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-sky-50 p-2 dark:bg-sky-950/40">
                            <Cloud className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                {data.account_name}
                            </span>
                            <span className="font-mono text-[11px] text-muted-foreground">
                                {data.resource_group} · {data.account_location} · {data.account_kind}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex flex-col">
                            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                Catálogo Bedrock
                            </span>
                            <span className="text-xs font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                                {formatInteger(data.diagnostics.bedrock_catalog_models)} modelos
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                Líneas de facturación
                            </span>
                            <span className="text-xs font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                                {formatInteger(data.diagnostics.billing_rows)}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <AzureFoundrySummaryCards data={data} />

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
                            {pendingMeters.map((meter) => (
                                <span
                                    key={meter.meter_name}
                                    className="rounded-md border border-amber-200 bg-white px-2 py-0.5 font-mono text-[10px] text-amber-700 dark:border-amber-900 dark:bg-slate-900 dark:text-amber-400"
                                >
                                    {meter.meter_name} · {formatCurrency(meter.cost_usd)}
                                </span>
                            ))}
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                            Estos consumos no se atribuyeron a ningún modelo desplegado y quedan fuera de la proyección.
                        </span>
                    </CardContent>
                </Card>
            )}

            <AzureFoundryModelsTableComponent data={data.models} />
            <AzureFoundryCandidatesTableComponent data={data.models} />
            <AzureFoundryDeploymentsTableComponent data={data.models} />
        </div>
    );
};