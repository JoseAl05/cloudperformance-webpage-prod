'use client'

import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { BarChart3 } from 'lucide-react';
import { useMemo } from 'react';
import { UnusedCeTableData } from '@/interfaces/vista-unused-resources/unusedComputeEngineInterfaces';
import { getUnusedCeColumns } from './UnusedCeColumns';

interface UnusedCeTableComponentProps {
    data: UnusedCeTableData[];
}

const TableLegend = () => (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-700 dark:bg-blue-800"></span>
            <span><strong>Ranking (Intensidad):</strong> % de uso relativo a la instancia más cargada (Max).</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-600"></span>
            <span><strong>Contribución (Volumen):</strong> % del tráfico total del grupo (Suma).</span>
        </div>
    </div>
);

export const UnusedCeTableComponent = ({ data }: UnusedCeTableComponentProps) => {

    const totalGlobalCost = useMemo(() => {
        if (!data) return 0;
        return data.reduce((acc, row) => acc + (row.billing?.total_cost_usd || 0), 0);
    }, [data]);

    console.log(totalGlobalCost);

    const processedData = useMemo(() => {
        if (!data) return [];
        return data.map(row => {
            const findVal = (key: string) => row.metrics?.find(m => m.metric_name.includes(key))?.avg || 0;

            return {
                ...row,
                sort_cpu: findVal("cpu_utilization"),
                sort_net_inout_pps: findVal("network_egress_pps") + findVal("network_ingress_pps"),
                sort_net_inout_throughput: findVal("network_egress_throughput") + findVal("network_ingress_throughput"),
                sort_disk_inout_iops: findVal("disk_read_iops") + findVal("disk_write_iops"),
                sort_disk_inout_throughput: findVal("disk_read_throughput") + findVal("disk_write_throughput"),
                sort_billing: row.billing?.total_cost_usd || 0
            };
        });
    }, [data]);

    const columns = createColumns(getUnusedCeColumns(totalGlobalCost));

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
                                Análisis de saturación, volumen de tráfico y facturación por instancia.
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
                    filterColumn="instance_name"
                    filterPlaceholder="Filtrar por Nombre..."
                    pageSizeItems={10}
                />
            </CardContent>
        </Card>
    );
};