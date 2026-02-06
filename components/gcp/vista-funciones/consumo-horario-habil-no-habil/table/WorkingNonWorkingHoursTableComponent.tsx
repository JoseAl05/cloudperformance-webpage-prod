'use client'

import { useMemo } from 'react';
import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { Clock, Briefcase, Moon } from 'lucide-react';
import { WorkingNonWorkingHoursUsageSummaryByResource } from '@/interfaces/vista-consumo-horario-habil-no-habil/workingNonWorkingHoursInterfaces';
import { getWorkingNonWorkingColumns, MaxValues } from '@/components/gcp/vista-funciones/consumo-horario-habil-no-habil/table/WorkingNonWorkingHoursColumns';

interface WorkingNonWorkingHoursTableComponentProps {
    data: WorkingNonWorkingHoursUsageSummaryByResource[];
}

const TableLegend = () => (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <Briefcase className="w-3 h-3" />
                <strong>Hábil:</strong> Horario laboral
            </span>
        </div>
        <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <Moon className="w-3 h-3" />
                <strong>No Hábil:</strong> Noches/Fines de semana
            </span>
        </div>
    </div>
);

export const WorkingNonWorkingHoursTableComponent = ({ data }: WorkingNonWorkingHoursTableComponentProps) => {

    const maxValues: MaxValues = useMemo(() => {
        const result = {
            maxDiskReadIOPS: 0,
            maxDiskWriteIOPS: 0,
            maxDiskReadThroughput: 0,
            maxDiskWriteThroughput: 0,
            maxNetIngressPPS: 0,
            maxNetEgressPPS: 0,
            maxNetIngressThroughput: 0,
            maxNetEgressThroughput: 0
        };

        if (!data || data.length === 0) return {
            maxDiskReadIOPS: 1, maxDiskWriteIOPS: 1,
            maxDiskReadThroughput: 1, maxDiskWriteThroughput: 1,
            maxNetIngressPPS: 1, maxNetEgressPPS: 1,
            maxNetIngressThroughput: 1, maxNetEgressThroughput: 1
        };

        data.forEach(resource => {
            resource.metric_data.forEach(metric => {
                const val = metric.avg_value;
                switch (metric.metric_name) {
                    case 'disk_read_iops':
                        if (val > result.maxDiskReadIOPS) result.maxDiskReadIOPS = val;
                        break;
                    case 'disk_write_iops':
                        if (val > result.maxDiskWriteIOPS) result.maxDiskWriteIOPS = val;
                        break;
                    case 'disk_read_throughput':
                        if (val > result.maxDiskReadThroughput) result.maxDiskReadThroughput = val;
                        break;
                    case 'disk_write_throughput':
                        if (val > result.maxDiskWriteThroughput) result.maxDiskWriteThroughput = val;
                        break;
                    case 'network_ingress_pps':
                        if (val > result.maxNetIngressPPS) result.maxNetIngressPPS = val;
                        break;
                    case 'network_egress_pps':
                        if (val > result.maxNetEgressPPS) result.maxNetEgressPPS = val;
                        break;
                    case 'network_ingress_throughput':
                        if (val > result.maxNetIngressThroughput) result.maxNetIngressThroughput = val;
                        break;
                    case 'network_egress_throughput':
                        if (val > result.maxNetEgressThroughput) result.maxNetEgressThroughput = val;
                        break;
                }
            });
        });

        return {
            maxDiskReadIOPS: result.maxDiskReadIOPS || 1,
            maxDiskWriteIOPS: result.maxDiskWriteIOPS || 1,
            maxDiskReadThroughput: result.maxDiskReadThroughput || 1,
            maxDiskWriteThroughput: result.maxDiskWriteThroughput || 1,
            maxNetIngressPPS: result.maxNetIngressPPS || 1,
            maxNetEgressPPS: result.maxNetEgressPPS || 1,
            maxNetIngressThroughput: result.maxNetIngressThroughput || 1,
            maxNetEgressThroughput: result.maxNetEgressThroughput || 1
        };
    }, [data]);

    const columns = createColumns(getWorkingNonWorkingColumns(maxValues));

    if (!data || data.length === 0) {
        return (
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardContent className="p-8 text-center text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay datos de consumo horario disponibles.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="border-b dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20 pb-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                Análisis Completo Horario Hábil vs No Hábil
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Comparativa detallada de CPU, Disco (IOPS/Throughput) y Red (PPS/Throughput).
                            </CardDescription>
                        </div>
                    </div>
                </div>
                <TableLegend />
            </CardHeader>
            <CardContent className="p-4">
                <DataTableGrouping
                    columns={columns}
                    data={data}
                    filterColumn="resource_name"
                    filterPlaceholder="Filtrar por nombre..."
                    enableGrouping
                    groupByColumn='resource_name'
                    pageSizeItems={10}
                />
            </CardContent>
        </Card>
    );
};