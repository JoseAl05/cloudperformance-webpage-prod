'use client'

import { useMemo } from 'react';
import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { Server } from 'lucide-react';
import { LoadbalancerV2ConsumeInfoInstances } from '@/interfaces/vista-consumos/elbV2ConsumeViewInterfaces';
import { getElbV2ConsumeColumns, ElbV2TableRow } from '@/components/aws/vista-consumos/elbv2/table/ElbV2ConsumeColumns';

interface ElbV2ConsumeTableProps {
    data: LoadbalancerV2ConsumeInfoInstances[]
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

export const ElbV2ConsumeTable = ({ data }: ElbV2ConsumeTableProps) => {

    const processedData = useMemo<ElbV2TableRow[]>(() => {
        if (!data) return [];
        return data
            .filter(inst => inst.history.length > 0)
            .map(inst => {
                const latest = inst.history[inst.history.length - 1];
                return {
                    ...latest,
                    _instance: inst,
                    LoadBalancerArn: inst.LoadBalancerArn,
                    sort_active_connection_count: latest.avg_active_connection_count,
                    sort_consumed_lcus: latest.avg_consumed_lcus,
                    sort_processed_bytes: latest.avg_processed_bytes,
                    sort_request_count: latest.avg_request_count,
                    sort_http_5xx_count: latest.avg_http_5xx_count,
                    sort_billing: latest.costo_usd,
                };
            });
    }, [data]);

    const { maxActiveConnectionCount, maxConsumedLcus, maxProcessedBytes, maxHttp5xxCount, maxCost } = useMemo(() => {
        if (!processedData.length) return { maxActiveConnectionCount: 0, maxConsumedLcus: 0, maxProcessedBytes: 0, maxHttp5xxCount: 0, maxCost: 0 };

        return {
            maxActiveConnectionCount: Math.max(...processedData.map(d => d.avg_active_connection_count)),
            maxConsumedLcus: Math.max(...processedData.map(d => d.avg_consumed_lcus)),
            maxProcessedBytes: Math.max(...processedData.map(d => d.avg_processed_bytes)),
            maxHttp5xxCount: Math.max(...processedData.map(d => d.avg_http_5xx_count)),
            maxCost: Math.max(...processedData.map(d => d.costo_usd)),
        };
    }, [processedData]);

    const columns = createColumns(getElbV2ConsumeColumns(maxActiveConnectionCount, maxConsumedLcus, maxProcessedBytes, maxHttp5xxCount, maxCost));

    if (!data || data.length === 0) {
        return (
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardContent className="p-8 text-center text-muted-foreground">
                    <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay Load Balancers para mostrar.</p>
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
                                Detalle de Load Balancers v2
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Análisis de conexiones, tráfico y capacidad consumida
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
                    filterColumn="LoadBalancerArn"
                    filterPlaceholder="Filtrar por nombre de load balancer.."
                    pageSizeItems={10}
                />
            </CardContent>
        </Card>
    );
};