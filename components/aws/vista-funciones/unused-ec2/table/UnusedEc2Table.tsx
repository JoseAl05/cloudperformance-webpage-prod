import { createColumns } from '@/components/general_aws/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/general_aws/data-table/data-table-grouping';
import { getUnusedEc2Columns } from './UnusedEc2Columns'; // Ajustar ruta
import { BarChart3, Info } from 'lucide-react';
import { Ec2TableRow } from '@/interfaces/general-interfaces/ec2MetricsTableData';
import { useMemo } from 'react';

interface UnusedEc2TableProps {
    data: Ec2TableRow[];
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

export const UnusedEc2Table = ({ data }: UnusedEc2TableProps) => {
    const processedData = useMemo(() => {
        if (!data) return [];
        return data.map(row => {
            const findVal = (key: string) => row.metrics?.find(m => m.metric_name.includes(key))?.avg || 0;

            return {
                ...row,
                sort_cpu: findVal("CPUUtilization"),
                sort_net_in: findVal("NetworkIn"),
                sort_net_out: findVal("NetworkOut")
            };
        });
    }, [data]);
    const columns = createColumns(getUnusedEc2Columns());

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
                                Análisis de saturación y volumen de tráfico por instancia.
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
                    filterColumn="instance_id"
                    filterPlaceholder="Filtrar por ID..."
                    pageSizeItems={10}
                />
            </CardContent>
        </Card>
    );
};