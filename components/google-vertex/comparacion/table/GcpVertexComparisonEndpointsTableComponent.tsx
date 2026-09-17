'use client'

import { useMemo } from 'react';
import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { Server } from 'lucide-react';
import { GcpVertexEndpointRow, GcpVertexModel } from '@/interfaces/vertex-comparison/gcpVertexComparisonInterfaces';
import { getGcpVertexEndpointsColumns } from '@/components/google-vertex/comparacion/table/GcpVertexComparisonEndpointsColumns';

interface GcpVertexEndpointsTableComponentProps {
    data: GcpVertexModel[];
}

const TableLegend = () => (
    <div className="mt-2 flex flex-wrap gap-4 rounded-md border border-slate-100 bg-slate-50 p-2 text-xs text-muted-foreground dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
            <span><strong>Participación:</strong> proporción de tokens del endpoint sobre el total del modelo.</span>
        </div>
        <div className="flex items-center gap-2">
            <span><strong>Costo asignado:</strong> costo medido del modelo repartido según esa proporción.</span>
        </div>
        <div className="flex items-center gap-2">
            <span><strong>Inactivo:</strong> endpoint aprovisionado sin tokens en el período.</span>
        </div>
    </div>
);

export const GcpVertexEndpointsTableComponent = ({ data }: GcpVertexEndpointsTableComponentProps) => {
    const processedData = useMemo<GcpVertexEndpointRow[]>(() => {
        const rows: GcpVertexEndpointRow[] = [];

        (data || []).forEach((model) => {
            model.endpoints.forEach((endpoint) => {
                rows.push({
                    endpoint_id: endpoint.endpoint_id,
                    name: endpoint.name,
                    gcp_model_name: model.gcp_base_model || model.gcp_model_name,
                    model_version: endpoint.model_version,
                    location: endpoint.location,
                    project_id: endpoint.project_id,
                    traffic_percentage: endpoint.traffic_percentage,
                    tokens_input: endpoint.tokens_input,
                    tokens_output: endpoint.tokens_output,
                    tokens_total: endpoint.tokens_total,
                    allocation_share: endpoint.allocation_share,
                    allocated_cost_usd: endpoint.allocated_cost_usd,
                    is_idle: endpoint.is_idle,
                    status_label: endpoint.is_idle ? 'Inactivo' : 'Activo'
                });
            });
        });

        return rows.sort((first, second) => second.allocated_cost_usd - first.allocated_cost_usd);
    }, [data]);

    const columns = useMemo(() => createColumns(getGcpVertexEndpointsColumns()), []);

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
                            <CardTitle className="text-base">Endpoints de la seleccion</CardTitle>
                            <CardDescription className="text-xs">
                                Costo repartido entre endpoints según los tokens observados en métricas
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
                    filterPlaceholder="Buscar endpoint..."
                    pageSizeItems={10}
                />
            </CardContent>
        </Card>
    );
};