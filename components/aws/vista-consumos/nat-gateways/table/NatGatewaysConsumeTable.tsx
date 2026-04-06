'use client'

import { useMemo } from 'react';
import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { Server } from 'lucide-react';
import { NatGatewayConsumeInfoInstances } from '@/interfaces/vista-consumos/natGwConsumeViewInterfaces';
import { getNatGwConsumeColumns, NatGwTableRow } from '@/components/aws/vista-consumos/nat-gateways/table/NatGatewaysConsumeColumns';

interface NatGatewaysConsumeTableProps {
    data: NatGatewayConsumeInfoInstances[]
}

const TableLegend = () => (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full"></span>
            <span><strong>Barras:</strong> % relativo al máximo visible.</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full"></span>
            <span><strong>Costo:</strong> Rojo &gt;$50, Ámbar &gt;$20, Verde ≤$20 USD/mes.</span>
        </div>
    </div>
);

export const NatGatewaysConsumeTable = ({ data }: NatGatewaysConsumeTableProps) => {

    const processedData = useMemo<NatGwTableRow[]>(() => {
        if (!data) return [];
        return data
            .filter(inst => inst.history.length > 0)
            .map(inst => {
                const latest = inst.history[inst.history.length - 1];
                return {
                    ...latest,
                    _instance: inst,
                    NatGatewayId: inst.NatGatewayId,
                    sort_active_connections: latest.avg_active_connections,
                    sort_bytes_in: latest.avg_bytes_in,
                    sort_bytes_out: latest.avg_bytes_out,
                    sort_error_port_allocation: latest.avg_error_port_allocation,
                    sort_billing: latest.costo_usd,
                };
            });
    }, [data]);

    const { maxActiveConnections, maxBytesIn, maxBytesOut, maxErrorPortAllocation, maxCost } = useMemo(() => {
        if (!processedData.length) return { maxActiveConnections: 0, maxBytesIn: 0, maxBytesOut: 0, maxErrorPortAllocation: 0, maxCost: 0 };

        return {
            maxActiveConnections: Math.max(...processedData.map(d => d.avg_active_connections)),
            maxBytesIn: Math.max(...processedData.map(d => d.avg_bytes_in)),
            maxBytesOut: Math.max(...processedData.map(d => d.avg_bytes_out)),
            maxErrorPortAllocation: Math.max(...processedData.map(d => d.avg_error_port_allocation)),
            maxCost: Math.max(...processedData.map(d => d.costo_usd)),
        };
    }, [processedData]);

    const columns = createColumns(getNatGwConsumeColumns(maxActiveConnections, maxBytesIn, maxBytesOut, maxErrorPortAllocation, maxCost));

    if (!data || data.length === 0) {
        return (
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardContent className="p-8 text-center text-muted-foreground">
                    <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay Nat Gateways para mostrar.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="border-b dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20 pb-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                            <Server className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                Detalle de Nat Gateways
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Análisis de conexiones y flujo de datos
                            </CardDescription>
                        </div>
                    </div>
                </div>
                <TableLegend />
            </CardHeader>
            <CardContent className="p-0">
                <DataTableGrouping
                    columns={columns}
                    data={processedData}
                    filterColumn="NatGatewayId"
                    filterPlaceholder="Filtrar por nombre de nat gateway.."
                    pageSizeItems={10}
                />
            </CardContent>
        </Card>
    );
};