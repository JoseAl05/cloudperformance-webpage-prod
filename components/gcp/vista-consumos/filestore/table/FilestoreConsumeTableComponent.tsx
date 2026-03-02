'use client'

import { useMemo } from 'react';
import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { getFilestoreConsumeColumns } from './FilestoreConsumeColumns';
import { Database, HardDrive } from 'lucide-react';

interface FilestoreConsumeTableComponentProps {
    data: unknown[]; // Array de instancias del JSON
}

const TableLegend = () => (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md border border-slate-100 dark:border-slate-800">
        {/* <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span><strong>Capacidad:</strong> Porcentaje de uso real vs. el TB/GB contratado.</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span><strong>FinOps:</strong> Clasificación según desperdicio de recursos detectado.</span>
        </div> */}
    </div>
);

export const FilestoreConsumeTableComponent = ({ data }: FilestoreConsumeTableComponentProps) => {

    // Calculamos el costo máximo para que la barra de costos sea relativa (igual que en Compute)
    const maxCost = useMemo(() => {
        if (!data || data.length === 0) return 0;
        return Math.max(...data.map(d => d.costo_usd || 0));
    }, [data]);

    // Generamos las columnas pasando el maxCost para la lógica visual
    const columns = useMemo(() => 
        createColumns(getFilestoreConsumeColumns(maxCost)), 
    [maxCost]);

    if (!data || data.length === 0) {
        return (
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardContent className="p-8 text-center text-muted-foreground">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay instancias de Filestore para mostrar.</p>
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
                            <HardDrive className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                Detalle de Instancias Filestore
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Análisis de almacenamiento aprovisionado, uso real y eficiencia de costos.
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