'use client'

import { useMemo } from 'react';
import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { Database } from 'lucide-react';
import { RdsConsumeViewInfoInstances } from '@/interfaces/vista-consumos/rdsConsumeViewInterfaces';
import { getRdsColumns, RdsTableRow } from '@/components/aws/vista-consumos/rds/table/RdsConsumeViewInstanceColumns';

interface RdsConsumeViewInstanceTableProps {
    data: RdsConsumeViewInfoInstances[];
}

const TableLegend = () => (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full"></span>
            <span><strong>Barras:</strong> % relativo al máximo visible.</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full"></span>
            <span><strong>Costo:</strong> Rojo &gt;$20, Ámbar &gt;$10, Verde ≤$10 USD.</span>
        </div>
    </div>
);

export const RdsConsumeViewInstanceTable = ({ data }: RdsConsumeViewInstanceTableProps) => {

    const processedData = useMemo<RdsTableRow[]>(() => {
        if (!data) return [];
        return data
            .filter(inst => inst.history.length > 0)
            .map(inst => {
                const latest = inst.history[inst.history.length - 1];
                return {
                    ...latest,
                    _instance: inst,
                    sort_cpu: latest.avg_cpu_utilization,
                    sort_storage: latest.strg_pct_used,
                    sort_cost: latest.costo_total_usd,
                };
            });
    }, [data]);

    const { maxCpu, maxStorage, maxCost } = useMemo(() => {
        if (!processedData.length) return { maxCpu: 0, maxStorage: 0, maxCost: 0 };

        return {
            maxCpu: Math.max(...processedData.map(d => d.avg_cpu_utilization)),
            maxStorage: Math.max(...processedData.map(d => d.strg_pct_used)),
            maxCost: Math.max(...processedData.map(d => d.costo_total_usd)),
        };
    }, [processedData]);

    const columns = createColumns(getRdsColumns(maxCpu, maxStorage, maxCost));

    if (!data || data.length === 0) {
        return (
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardContent className="p-8 text-center text-muted-foreground">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay instancias para mostrar con los filtros aplicados.</p>
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
                            <Database className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                Detalle de Instancias RDS
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Análisis de consumo, eficiencia y costos por instancia.
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
                    filterColumn="name"
                    filterPlaceholder="Filtrar por nombre de instancia..."
                    pageSizeItems={10}
                />
            </CardContent>
        </Card>
    );
};