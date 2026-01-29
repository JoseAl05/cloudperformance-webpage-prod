'use client'

import { useMemo } from 'react';
import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { getComputeEngineConsumeColumns } from './ComputeEngineConsumeColumns';
import { Server } from 'lucide-react';
import { InstanciaData } from '@/components/gcp/vista-consumos/compute-engine/info/ComputeEngineConsumeInsightModalComponent';

interface ComputeEngineConsumeTableComponentProps {
    data: InstanciaData[];
}

const TableLegend = () => (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span><strong>Barras:</strong> % relativo al máximo visible.</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span><strong>Costo:</strong> Rojo &gt;$50, Ámbar &gt;$20, Verde ≤$20 USD/mes.</span>
        </div>
    </div>
);

export const ComputeEngineConsumeTableComponent = ({ data }: ComputeEngineConsumeTableComponentProps) => {

    const { maxCpu, maxCost } = useMemo(() => {
        if (!data || data.length === 0) return { maxCpu: 0, maxCost: 0 };

        const cpus = data.map(d => d.avg_cpu_utilization);
        const costs = data.map(d => d.costo_total_usd);

        return {
            maxCpu: Math.max(...cpus),
            maxCost: Math.max(...costs)
        };
    }, [data]);

    const columns = createColumns(getComputeEngineConsumeColumns(maxCpu, maxCost));

    if (!data || data.length === 0) {
        return (
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardContent className="p-8 text-center text-muted-foreground">
                    <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay instancias de Compute Engine para mostrar.</p>
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
                                Detalle de Instancias Compute Engine
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Análisis de consumo CPU, Disco, Red y costos asociados.
                            </CardDescription>
                        </div>
                    </div>
                </div>
                <TableLegend />
            </CardHeader>
            <CardContent className="p-0">
                <DataTableGrouping
                    columns={columns}
                    data={data}
                    filterColumn="name"
                    filterPlaceholder="Filtrar por nombre de instancia..."
                    enableGrouping
                    groupByColumn='name'
                    pageSizeItems={10}
                />
            </CardContent>
        </Card>
    );
};