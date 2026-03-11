'use client'

import { useMemo } from 'react';
import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { Clock, Briefcase, Moon } from 'lucide-react';
import { WorkingNonWorkingHoursUsageSummaryByResource } from '@/interfaces/vista-consumo-horario-habil-no-habil/workingNonWorkingHoursInterfaces';
import { getConsumoHorarioColumns } from '@/components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/table/ConsumoHorarioColumns';

interface ConsumoHorarioTableComponentProps {
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

export const ConsumoHorarioTableComponent = ({ data }: ConsumoHorarioTableComponentProps) => {

    const { maxValues, uniqueMetrics } = useMemo(() => {
        const computedMaxValues: Record<string, number> = {};
        const metricSet = new Set<string>();

        if (!data || data.length === 0) return { maxValues: {}, uniqueMetrics: [] };

        data.forEach(resource => {
            resource.metric_data.forEach(metric => {
                metricSet.add(metric.metric_name);

                const currentMax = computedMaxValues[metric.metric_name] || 0;
                if (metric.avg_value > currentMax) {
                    computedMaxValues[metric.metric_name] = metric.avg_value;
                }
            });
        });

        const sortedMetrics = Array.from(metricSet).sort((a, b) => {
            if (a.includes('cpuutilization')) return -1;
            if (b.includes('cpuutilization')) return 1;
            return a.localeCompare(b);
        });

        return {
            maxValues: computedMaxValues,
            uniqueMetrics: sortedMetrics
        };
    }, [data]);

    const columns = createColumns(getConsumoHorarioColumns(uniqueMetrics, maxValues));

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
                                Comparativa detallada dinámica de todas las métricas disponibles.
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
                    pageSizeItems={5}
                    pageSizeGroups={5}
                />
            </CardContent>
        </Card>
    );
};