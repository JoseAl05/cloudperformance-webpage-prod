'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IntraCloudStorage, IntraCloudStorageMetricsSummary } from '@/interfaces/vista-intracloud/storage/intraCloudStorageInterfaces';
import { formatMetric } from '@/lib/metricUtils';
import { cn } from '@/lib/utils';
import {
    HardDrive,
    Activity,
    CircuitBoard
} from 'lucide-react';
import { bytesToGB } from '@/lib/bytesToMbs';

interface IntraCloudAwsStorageCardsByTenantComponentProps {
    data?: IntraCloudStorage[];
}

const gridColsMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4"
};

const getMetricUnit = (metricName: string): string => {
    const name = metricName.toLowerCase();
    if (name.includes('bytes')) return 'GB';
    if (name.includes('numberofobjects')) return 'Objetos';
    return '';
};


const MetricItem = ({ metric }: { metric: IntraCloudStorageMetricsSummary }) => {
    const unit = getMetricUnit(metric.metric_name);
    let metricValue: string | number;

    if (
        metric.metric_name.toLowerCase().includes("bytes")
    ) {
        metricValue = bytesToGB(metric.value);
    } else {
        metricValue = formatMetric(metric.value);
    }

    return (
        <div className="flex flex-col p-2.5 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate" title={metric.metric_name}>
                {metric.metric_name}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-bold text-slate-800 dark:text-slate-100">
                    {metricValue}
                </span>
                <span className="text-[10px] text-muted-foreground">
                    {unit}
                </span>
            </div>
        </div>
    );
};

export const IntraCloudAwsStorageCardsByTenantComponent = ({ data }: IntraCloudAwsStorageCardsByTenantComponentProps) => {
    if (!data || data.length === 0) {
        return <div className="text-muted-foreground text-sm">No hay datos de almacenamiento para mostrar.</div>;
    }

    const colsClass = gridColsMap[data.length] ?? "grid-cols-3";

    return (
        <div className="w-full">
            <div className={cn("grid gap-6", colsClass)}>
                {data.map((tenant, index) => {
                    const sortedSummary = tenant.metrics_summary.sort((a, b) => a.metric_name.localeCompare(b.metric_name));
                    return (
                        <Card
                            key={tenant.tenant_id}
                            className="border-t-4 shadow-md duration-200 border-t-indigo-600 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/10"
                        >
                            <CardHeader className="pb-4 bg-white dark:bg-slate-900 border-b">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                                            <HardDrive className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                                Tenant {index + 1}
                                            </CardTitle>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 px-2.5 py-1 rounded-full text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                                            {tenant.resources_count} Recursos
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-6 flex-1 space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Activity className="w-4 h-4 text-slate-500" />
                                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            Métricas Servicio S3 Bucket
                                        </h3>
                                    </div>
                                    {sortedSummary.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            {sortedSummary.map((metric, mIndex) => {
                                                const unit = getMetricUnit(metric.metric_name);
                                                let metricValue: string | number;

                                                if (metric.metric_name.toLowerCase().includes("bytes") || metric.metric_name.toLowerCase().includes("size")) {
                                                    metricValue = bytesToGB(metric.value);
                                                } else {
                                                    metricValue = formatMetric(metric.value);
                                                }

                                                return (
                                                    <div
                                                        key={`${tenant.tenant_id}-${metric.metric_name}-${mIndex}`}
                                                        className="flex items-center justify-between p-2 rounded-md border border-transparent"
                                                    >
                                                        <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                                                            <CircuitBoard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                            <span className="text-sm text-slate-700 dark:text-slate-300 truncate" title={metric.metric_name}>
                                                                {metric.metric_name}
                                                            </span>
                                                        </div>

                                                        <div className="text-right whitespace-nowrap">
                                                            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                                                {metricValue} <span className="text-xs font-normal text-muted-foreground">{unit}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-2 text-sm text-muted-foreground italic">
                                            Sin métricas
                                        </div>
                                    )
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    )
}