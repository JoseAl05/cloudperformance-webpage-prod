'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IntraCloudCompute } from '@/interfaces/vista-intracloud/compute/intraCloudComputeInterfaces'; // Asegúrate que esta ruta sea correcta o ajústala
import { formatMetric } from '@/lib/metricUtils';
import { cn } from '@/lib/utils';
import { Activity, BarChart3 } from 'lucide-react';
import { useMemo } from 'react';

interface IntraCloudComputeCardsComponentProps {
    data?: IntraCloudCompute[];
}

interface MetricGroupedData {
    metricName: string;
    tenantsData: {
        tenantLabel: string;
        tenantId: string;
        count: number;
        average: number;
    }[];
}

const gridColsMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4"
};

export const IntraCloudComputeCardsComponent = ({ data }: IntraCloudComputeCardsComponentProps) => {

    const groupedMetrics = useMemo(() => {
        if (!data || !Array.isArray(data) || data.length === 0) return [];

        const metricsMap = new Map<string, MetricGroupedData>();

        data.forEach((tenant, index) => {
            const tenantLabel = `Tenant ${index + 1}`;

            tenant.metrics_summary.forEach((metric) => {
                if (!metricsMap.has(metric.metric_name)) {
                    metricsMap.set(metric.metric_name, {
                        metricName: metric.metric_name,
                        tenantsData: []
                    });
                }

                const currentMetricGroup = metricsMap.get(metric.metric_name)!;

                currentMetricGroup.tenantsData.push({
                    tenantId: tenant.tenant_id,
                    tenantLabel: tenantLabel,
                    count: metric.metric_count,
                    average: metric.avg_value
                });
            });
        });

        return Array.from(metricsMap.values());

    }, [data]);

    if (!data || data.length === 0) {
        return <div className="text-muted-foreground text-sm">No hay datos de cómputo para mostrar.</div>;
    }

    const tenantsCount = data.length;
    const internalGridCols = gridColsMap[tenantsCount] ?? "grid-cols-3";

    return (
        <div className="grid grid-cols-1 gap-6">
            {groupedMetrics.map((metricGroup) => (
                <Card
                    key={metricGroup.metricName}
                    className="border-l-4 shadow-sm hover:shadow-md transition-all duration-200 border-l-blue-500 overflow-hidden"
                >
                    <CardHeader className="pb-2 bg-slate-50/50 dark:bg-slate-900/20 border-b mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                {metricGroup.metricName}
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className={cn("grid gap-6", internalGridCols)}>
                            {metricGroup.tenantsData.map((tenantStat) => (
                                <div key={tenantStat.tenantId} className="flex flex-col space-y-1 p-3 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <h5 className="font-semibold text-sm text-slate-900 dark:text-slate-200 mb-2">
                                        {tenantStat.tenantLabel}
                                    </h5>

                                    <div className="grid grid-cols-1 gap-1 text-sm text-muted-foreground">
                                        <div className="flex justify-between items-center">
                                            <span># Métricas:</span>
                                            <span className="font-medium text-slate-700 dark:text-slate-300">
                                                {tenantStat.count}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Promedio:</span>
                                            <span className="font-bold text-blue-600 dark:text-blue-400">
                                                {formatMetric(tenantStat.average)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}