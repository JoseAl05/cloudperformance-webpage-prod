'use client'

import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { BarChart3 } from 'lucide-react';
import { useMemo } from 'react';
import { getUnusedEbsColumns } from './UnusedEbsColumns';
import { UnusedEbsTableData } from '@/interfaces/vista-unused-resources/unusedEbsResourcesInterfaces';

interface UnusedEbsTableComponentProps {
    data: UnusedEbsTableData[];
}

const TableLegend = () => (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-700 dark:bg-blue-800"></span>
            <span><strong>Ranking (Intensidad):</strong> % de uso relativo al volumen más cargado (Max).</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-600"></span>
            <span><strong>Contribución (Volumen):</strong> % del tráfico total del grupo (Suma).</span>
        </div>
    </div>
);

export const UnusedEbsTableComponent = ({ data }: UnusedEbsTableComponentProps) => {

    const totalGlobalCost = useMemo(() => {
        if (!data) return 0;
        return data.reduce((acc, row) => acc + (row.billing?.total_cost_usd || 0), 0);
    }, [data]);

    const processedData = useMemo(() => {
        if (!data) return [];
        return data.map(row => {
            const findVal = (key: string) => row.metrics?.find(m => m.metric_name.includes(key))?.avg || 0;

            return {
                ...row,
                sort_idle_time: findVal("VolumeIdleTime"),
                sort_ops: findVal("VolumeReadOps") + findVal("VolumeWriteOps"),
                sort_bytes: findVal("VolumeReadBytes") + findVal("VolumeWriteBytes"),
                sort_burst_balance: findVal("BurstBalance"),
                sort_queue_length: findVal("VolumeQueueLength"),
                sort_billing: row.billing?.total_cost_usd || 0
            };
        });
    }, [data]);

    const columns = createColumns(getUnusedEbsColumns(totalGlobalCost));

    return (
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="border-b dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20 pb-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                            <BarChart3 className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                Métricas Comparativas
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Análisis de actividad, rendimiento y facturación por volumen EBS.
                            </CardDescription>
                        </div>
                    </div>
                </div>
                <TableLegend />
            </CardHeader>
            <CardContent className="p-5">
                <DataTableGrouping
                    columns={columns}
                    data={processedData}
                    filterColumn="volume_name"
                    filterPlaceholder="Filtrar por Nombre..."
                    pageSizeItems={10}
                />
            </CardContent>
        </Card>
    );
};