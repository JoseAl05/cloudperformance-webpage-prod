'use client'

import { useMemo } from 'react';
import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { Server } from 'lucide-react';
import { AzureFoundryDeploymentRow, AzureFoundryModel } from '@/interfaces/foundry-cost-optimization/azureFoundryInterfaces';
import { getAzureFoundryDeploymentsColumns } from '@/components/microsoft-foundry/comparacion/table/AFComparisonDeploymentsColumns';

interface AzureFoundryDeploymentsTableComponentProps {
    data: AzureFoundryModel[];
}

const TableLegend = () => (
    <div className="mt-2 flex flex-wrap gap-4 rounded-md border border-slate-100 bg-slate-50 p-2 text-xs text-muted-foreground dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
            <span><strong>Participación:</strong> proporción de tokens del despliegue sobre el total del modelo.</span>
        </div>
        <div className="flex items-center gap-2">
            <span><strong>Costo asignado:</strong> costo facturado del modelo repartido según esa proporción.</span>
        </div>
        <div className="flex items-center gap-2">
            <span><strong>Inactivo:</strong> despliegue aprovisionado sin tokens en el período.</span>
        </div>
    </div>
);

export const AzureFoundryDeploymentsTableComponent = ({ data }: AzureFoundryDeploymentsTableComponentProps) => {
    const processedData = useMemo<AzureFoundryDeploymentRow[]>(() => {
        const rows: AzureFoundryDeploymentRow[] = [];

        (data || []).forEach((model) => {
            model.deployments.forEach((deployment) => {
                rows.push({
                    deployment_id: deployment.deployment_id,
                    name: deployment.name,
                    azure_model_name: model.azure_model_name,
                    model_version: deployment.model_version,
                    sku_name: deployment.sku_name,
                    location: deployment.location,
                    resource_group: deployment.resource_group,
                    sku_capacity: deployment.sku_capacity,
                    tokens_input: deployment.tokens_input,
                    tokens_output: deployment.tokens_output,
                    tokens_total: deployment.tokens_total,
                    allocation_share: deployment.allocation_share,
                    allocated_cost_usd: deployment.allocated_cost_usd,
                    is_idle: deployment.is_idle,
                    status_label: deployment.is_idle ? 'Inactivo' : 'Activo'
                });
            });
        });

        return rows.sort((first, second) => second.allocated_cost_usd - first.allocated_cost_usd);
    }, [data]);

    const columns = useMemo(() => createColumns(getAzureFoundryDeploymentsColumns()), []);

    const idleCount = useMemo(
        () => processedData.filter((row) => row.is_idle).length,
        [processedData]
    );

    return (
        <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
                            <Server className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                        </div>
                        <div>
                            <CardTitle className="text-base">Despliegues de la cuenta</CardTitle>
                            <CardDescription className="text-xs">
                                Costo repartido entre despliegues según los tokens observados en métricas
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-lg font-bold tabular-nums text-slate-700 dark:text-slate-200">
                            {processedData.length}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                            {idleCount} inactivos
                        </span>
                    </div>
                </div>
                <TableLegend />
            </CardHeader>
            <CardContent>
                <DataTableGrouping
                    columns={columns}
                    data={processedData}
                    filterColumn="name"
                    filterPlaceholder="Buscar despliegue..."
                    pageSizeItems={10}
                />
            </CardContent>
        </Card>
    );
};