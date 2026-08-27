'use client'

import { useMemo } from 'react';
import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { Boxes } from 'lucide-react';
import { formatDate } from '@/lib/azureFoundryFormatters';
import { getAzureFoundryModelsColumns } from '@/components/microsoft-foundry/comparacion/table/AFComparisonModelsColumns';
import { AzureFoundryModel, AzureFoundryModelRow } from '@/interfaces/foundry-cost-optimization/azureFoundryInterfaces';

interface AzureFoundryModelsTableComponentProps {
    data: AzureFoundryModel[];
}

const TableLegend = () => (
    <div className="mt-2 flex flex-wrap gap-4 rounded-md border border-slate-100 bg-slate-50 p-2 text-xs text-muted-foreground dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
            <span><strong>Precio mezclado:</strong> costo Azure total dividido por tokens facturados.</span>
        </div>
        <div className="flex items-center gap-2">
            <span><strong>Equivalente sugerido:</strong> candidato más económico que supera el umbral de equivalencia.</span>
        </div>
        <div className="flex items-center gap-2">
            <span><strong>Diferencia:</strong> verde ahorro, rojo mayor costo en AWS.</span>
        </div>
    </div>
);

export const AzureFoundryModelsTableComponent = ({ data }: AzureFoundryModelsTableComponentProps) => {
    const processedData = useMemo<AzureFoundryModelRow[]>(() => {
        return (data || []).map((model) => {
            const recommended = model.candidates.find((candidate) => candidate.is_recommended);
            const tokens = model.tokens_total || 0;

            return {
                azure_model_name: model.azure_model_name,
                azure_model_version: model.azure_model_version,
                model_class_label: model.model_class_label,
                deployment_type: model.deployment_type || '—',
                azure_location: model.azure_location || '—',
                aws_region: model.aws_region,
                azure_cost_usd: model.azure_cost_usd,
                tokens_total: tokens,
                blended_price_per_1m_usd: tokens > 0 ? (model.azure_cost_usd / tokens) * 1000000 : 0,
                recommended_model: recommended ? recommended.bedrock_model_name : 'Sin equivalencia',
                recommended_cost_usd: recommended ? recommended.projected_cost_usd : model.azure_cost_usd,
                recommended_delta_usd: recommended ? recommended.delta_usd : 0,
                recommended_delta_percent: recommended ? recommended.delta_percent : 0,
                recommended_confidence: recommended ? recommended.confidence : '',
                candidates_total: model.candidates.length,
                deployments_total: model.deployments_total,
                deployments_idle: model.deployments_idle,
                lifecycle_status: model.lifecycle_status || '—',
                deprecation_label: formatDate(model.deprecation ? model.deprecation.inference : null)
            };
        });
    }, [data]);

    const columns = useMemo(() => createColumns(getAzureFoundryModelsColumns()), []);

    const withRecommendation = useMemo(
        () => processedData.filter((row) => row.recommended_confidence !== '').length,
        [processedData]
    );

    return (
        <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-sky-50 p-2 dark:bg-sky-950/40">
                            <Boxes className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                        </div>
                        <div>
                            <CardTitle className="text-base">Modelos facturados</CardTitle>
                            <CardDescription className="text-xs">
                                Consumo real por modelo y su equivalente estimado en AWS Bedrock
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-lg font-bold tabular-nums text-slate-700 dark:text-slate-200">
                            {processedData.length}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                            {withRecommendation} con equivalencia
                        </span>
                    </div>
                </div>
                <TableLegend />
            </CardHeader>
            <CardContent>
                <DataTableGrouping
                    columns={columns}
                    data={processedData}
                    filterColumn="azure_model_name"
                    filterPlaceholder="Buscar modelo..."
                    pageSizeItems={10}
                />
            </CardContent>
        </Card>
    );
};