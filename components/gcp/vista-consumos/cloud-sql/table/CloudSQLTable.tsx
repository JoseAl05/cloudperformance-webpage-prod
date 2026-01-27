'use client'

import { useMemo } from 'react';
import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { getCloudSQLColumns } from './CloudSQLColumns';
import { Database, Info } from 'lucide-react';

interface InstanciaRow {
    name: string;
    db_type: string;
    region_name: string;
    avg_cpu_utilization: number;
    avg_connections: number;
    storage_utilization_pct: number;
    avg_memory_utilization: number;
    is_idle: boolean;
    is_underutilized: boolean;
    storage_inefficient: boolean;
    costo_total_usd: number;
    tiene_billing: boolean;
    tier: string;
    databaseVersion: string;
    state: string;
    createTime: string;
    avg_storage_used_gb: number;
    avg_storage_total_gb: number;
    max_cpu_utilization: number;
    max_connections: number;
    max_memory_utilization: number;
    zone: string;
    project_id: string;
}

interface CloudSQLTableProps {
    data: InstanciaRow[];
}

const TableLegend = () => (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span><strong>Barras:</strong> Valores relativos al máximo del grupo visible.</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span><strong>Costo FinOps:</strong> Rojo &gt;$20, Ámbar &gt;$10, Verde ≤$10 USD/mes.</span>
        </div>
    </div>
);

export const CloudSQLTable = ({ data }: CloudSQLTableProps) => {
    
    // Calcular valores máximos para las barras
    const { maxCpu, maxStorage, maxCost } = useMemo(() => {
        if (!data || data.length === 0) return { maxCpu: 0, maxStorage: 0, maxCost: 0 };
        
        const cpus = data.map(d => d.avg_cpu_utilization);
        const storages = data.map(d => d.storage_utilization_pct);
        const costs = data.map(d => d.costo_total_usd);
        
        return {
            maxCpu: Math.max(...cpus),
            maxStorage: Math.max(...storages),
            maxCost: Math.max(...costs)
        };
    }, [data]);

    const columns = createColumns(getCloudSQLColumns(maxCpu, maxStorage, maxCost));

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
                                Detalle de Instancias Cloud SQL
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
                    data={data}
                    filterColumn="name"
                    filterPlaceholder="Filtrar por nombre..."
                    pageSizeItems={10}
                />
            </CardContent>
        </Card>
    );
};