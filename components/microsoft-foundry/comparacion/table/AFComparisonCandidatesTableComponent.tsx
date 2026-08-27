'use client'

import { useMemo } from 'react';
import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { GitCompareArrows } from 'lucide-react';
import { AzureFoundryModelRow } from '@/interfaces/foundry-cost-optimization/azureFoundryInterfaces';
import { getAzureFoundryCandidatesColumns } from '@/components/microsoft-foundry/comparacion/table/AFComparisonCandidatesColumns';

interface AzureFoundryCandidatesTableComponentProps {
    data: AzureFoundryModelRow[];
}

const TableLegend = () => (
    <div className="mt-2 flex flex-wrap gap-4 rounded-md border border-slate-100 bg-slate-50 p-2 text-xs text-muted-foreground dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
            <span><strong>Equivalencia:</strong> similitud de precios ponderada por mezcla de tokens más cobertura de dimensiones.</span>
        </div>
        <div className="flex items-center gap-2">
            <span><strong>Ranking:</strong> solo candidatos con confianza media o alta y todas las dimensiones tarifadas.</span>
        </div>
        <div className="flex items-center gap-2">
            <span><strong>Sin tarifa:</strong> dimensión valorizada con el precio de entrada como reemplazo.</span>
        </div>
    </div>
);

export const AzureFoundryCandidatesTableComponent = ({ data }: AzureFoundryCandidatesTableComponentProps) => {
    const processedData = useMemo<AzureFoundryCandidateRow[]>(() => {
        const rows: AzureFoundryCandidateRow[] = [];

        (data || []).forEach((model) => {
            model.candidates.forEach((candidate) => {
                const missing = candidate.missing_dimensions || [];
                rows.push({
                    azure_model_name: model.azure_model_name,
                    bedrock_model_name: candidate.bedrock_model_name,
                    bedrock_model_id: candidate.bedrock_model_id,
                    provider: candidate.provider || '—',
                    region: candidate.region,
                    equivalence_score: candidate.equivalence_score,
                    price_similarity: candidate.price_similarity,
                    dimension_coverage: candidate.dimension_coverage,
                    confidence: candidate.confidence,
                    projected_cost_usd: candidate.projected_cost_usd,
                    azure_cost_usd: candidate.azure_cost_usd,
                    delta_usd: candidate.delta_usd,
                    delta_percent: candidate.delta_percent,
                    rank_label: candidate.rank !== null ? `#${candidate.rank}` : 'No elegible',
                    is_recommended: candidate.is_recommended,
                    dimension_fallback: candidate.dimension_fallback,
                    missing_dimensions_label: missing.length > 0
                        ? missing
                            .map((item) => {
                                const found = candidate.dimensions.find((dimension) => dimension.dimension === item);
                                return found ? found.dimension_label : item;
                            })
                            .join(', ')
                        : '—',
                    rationale: candidate.rationale
                });
            });
        });

        return rows.sort((first, second) => {
            if (first.azure_model_name !== second.azure_model_name) {
                return first.azure_model_name.localeCompare(second.azure_model_name, 'es-CL');
            }
            return second.equivalence_score - first.equivalence_score;
        });
    }, [data]);

    const columns = useMemo(() => createColumns(getAzureFoundryCandidatesColumns()), []);

    const eligible = useMemo(
        () => processedData.filter((row) => row.rank_label !== 'No elegible').length,
        [processedData]
    );

    return (
        <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-violet-50 p-2 dark:bg-violet-950/40">
                            <GitCompareArrows className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                            <CardTitle className="text-base">Candidatos en AWS Bedrock</CardTitle>
                            <CardDescription className="text-xs">
                                Equivalencias derivadas del catálogo de modelos y precios, no de una tabla fija
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-lg font-bold tabular-nums text-slate-700 dark:text-slate-200">
                            {processedData.length}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                            {eligible} elegibles
                        </span>
                    </div>
                </div>
                <TableLegend />
            </CardHeader>
            <CardContent>
                <DataTableGrouping
                    columns={columns}
                    data={processedData}
                    filterColumn="bedrock_model_name"
                    filterPlaceholder="Buscar candidato..."
                    enableGrouping
                    groupByColumn='azure_model_name'
                    pageSizeItems={10}
                />
            </CardContent>
        </Card>
    );
};