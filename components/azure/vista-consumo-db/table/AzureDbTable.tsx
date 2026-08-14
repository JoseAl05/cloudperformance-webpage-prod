'use client'

import { useMemo } from 'react';
import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { getAzureDbColumns } from './AzureDbColumns';
import { Database } from 'lucide-react';
import { AzureDbInstanciaData } from './AzureDbInsightModal';

interface AzureDbTableProps {
    data: AzureDbInstanciaData[];
}

export const AzureDbTable = ({ data }: AzureDbTableProps) => {
    
    const { maxCpu, maxStorage, maxCost } = useMemo(() => {
        if (!data || data.length === 0) return { maxCpu: 0, maxStorage: 0, maxCost: 0 };
        const cpus = data.map(d => d.avg_cpu_utilization);
        const storages = data.map(d => d.storage_utilization_pct);
        const costs = data.map(d => d.costo_total_usd);
        
        return { maxCpu: Math.max(...cpus), maxStorage: Math.max(...storages), maxCost: Math.max(...costs) };
    }, [data]);

    const columns = createColumns(getAzureDbColumns(maxCpu, maxStorage, maxCost));

    if (!data || data.length === 0) {
        return (
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardContent className="p-8 text-center text-muted-foreground">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay instancias de bases de datos para mostrar.</p>
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
                                Detalle de Bases de Datos
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Análisis de consumo y costos por instancia.
                            </CardDescription>
                        </div>
                    </div>
                </div>
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