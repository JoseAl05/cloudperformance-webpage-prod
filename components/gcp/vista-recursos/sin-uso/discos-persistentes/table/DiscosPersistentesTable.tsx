'use client'

import { useMemo } from 'react';
import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { getDiscosPersistentesColumns } from './DiscosPersistentesColumns';
import { HardDrive, Info } from 'lucide-react';

interface DiscoRow {
    name: string;
    project_id: string;
    region: string;
    disk_type_simple: string;
    sizeGb: string;
    en_uso: boolean;
    cost_in_usd: number;
    labels: Record<string, string>;
    description?: string;
    creationTimestamp: string;
    lastDetachTimestamp?: string;
}

interface DiscosPersistentesTableProps {
    data: DiscoRow[];
}

const TableLegend = () => (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span><strong>Tamaño:</strong> Capacidad del disco relativa al máximo del grupo.</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span><strong>Costo FinOps:</strong> Gasto mensual (Rojo &gt;$20, Ámbar &gt;$10, Verde ≤$10).</span>
        </div>
    </div>
);

export const DiscosPersistentesTable = ({ data }: DiscosPersistentesTableProps) => {
    
    // Calcular valores máximos para las barras
    const { maxCost, maxSize } = useMemo(() => {
        if (!data || data.length === 0) return { maxCost: 0, maxSize: 0 };
        
        const costs = data.map(d => d.cost_in_usd);
        const sizes = data.map(d => Number(d.sizeGb));
        
        return {
            maxCost: Math.max(...costs),
            maxSize: Math.max(...sizes)
        };
    }, [data]);

    const columns = createColumns(getDiscosPersistentesColumns(maxCost, maxSize));

    if (!data || data.length === 0) {
        return (
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardContent className="p-8 text-center text-muted-foreground">
                    <HardDrive className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay discos para mostrar con los filtros aplicados.</p>
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
                                Detalle de Discos Persistentes
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Análisis de costos y utilización por disco.
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