'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IntraCloudStorage, IntraCloudStorageMetricsSummary } from '@/interfaces/vista-intracloud/storage/intraCloudStorageInterfaces';
import { formatMetric } from '@/lib/metricUtils';
import { cn } from '@/lib/utils';
import {
    Database,
    HardDrive,
    FileText,
    MessageSquare,
    Table as TableIcon,
    Server,
    Activity,
    Layers,
    ArrowDownRight
} from 'lucide-react';
import { bytesToGB } from '@/lib/bytesToMbs';

interface IntraCloudAzureStorageCardsByTenantComponentProps {
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
    if (name.includes('transaction')) return 'Transacciones';
    if (name.includes('capacity')) return 'GB';
    if (name.includes('count')) return 'Items';
    return '';
};

const getServiceIcon = (serviceType: string) => {
    const type = serviceType.toLowerCase();
    if (type.includes('blob')) return <Database className="w-4 h-4 text-blue-500" />;
    if (type.includes('file')) return <FileText className="w-4 h-4 text-green-500" />;
    if (type.includes('queue')) return <MessageSquare className="w-4 h-4 text-orange-500" />;
    if (type.includes('table')) return <TableIcon className="w-4 h-4 text-purple-500" />;
    return <Server className="w-4 h-4 text-slate-500" />;
};

const formatServiceTitle = (serviceType: string) => {
    return serviceType.replace(/_/g, ' ').replace('Service', '').trim();
};

const MetricItem = ({ metric }: { metric: IntraCloudStorageMetricsSummary }) => {
    const unit = getMetricUnit(metric.metric_name);
    let metricValue: string | number;

    if (
        metric.metric_name.toLowerCase().includes("bytes") ||
        metric.metric_name.toLowerCase().includes("capacity")
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

export const IntraCloudAzureStorageCardsByTenantComponent = ({ data }: IntraCloudAzureStorageCardsByTenantComponentProps) => {
    console.log(data);
    if (!data || data.length === 0) {
        return <div className="text-muted-foreground text-sm">No hay datos de almacenamiento para mostrar.</div>;
    }

    const colsClass = gridColsMap[data.length] ?? "grid-cols-3";

    return (
        <div className="w-full">
            <div className={cn("grid gap-6", colsClass)}>
                {data.map((tenant, index) => {
                    const accountMetrics = tenant.metrics_summary.filter(m => m.service_type === 'Storage_Account');

                    const childServicesMetrics = tenant.metrics_summary.filter(m => m.service_type !== 'Storage_Account');

                    const groupedChildServices = childServicesMetrics.reduce((acc, metric) => {
                        const service = metric.service_type || 'Unknown';
                        if (!acc[service]) acc[service] = [];
                        acc[service].push(metric);
                        return acc;
                    }, {} as Record<string, IntraCloudStorageMetricsSummary[]>);

                    const sortedChildServices = Object.keys(groupedChildServices).sort();

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
                                            Métricas Storage Account
                                        </h3>
                                    </div>
                                    {accountMetrics.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            {accountMetrics.map((metric, i) => (
                                                <MetricItem key={`acc-${i}`} metric={metric} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground italic px-2">Sin métricas de nivel de cuenta</div>
                                    )}
                                </div>

                                {sortedChildServices.length > 0 && (
                                    <div className="relative pl-4 space-y-4">
                                        <div className="absolute left-0 top-0 bottom-4 w-px bg-indigo-200 dark:bg-indigo-800/50 border-l border-dashed border-indigo-300 dark:border-indigo-700" />

                                        <div className="relative">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="absolute -left-[21px] top-1/2 -translate-y-1/2 bg-slate-50 dark:bg-slate-900 p-1">
                                                    <ArrowDownRight className="w-4 h-4 text-indigo-400" />
                                                </div>
                                                <Layers className="w-4 h-4 text-slate-500 ml-2" />
                                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                    Servicios Asociados
                                                </h3>
                                            </div>

                                            <div className="space-y-4">
                                                {sortedChildServices.map((serviceName) => (
                                                    <div key={serviceName} className="bg-white/50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200/60 dark:border-slate-800/60">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            {getServiceIcon(serviceName)}
                                                            <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                                                {formatServiceTitle(serviceName)}
                                                            </h4>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {groupedChildServices[serviceName].map((metric, mIndex) => (
                                                                <MetricItem
                                                                    key={`${serviceName}-${metric.metric_name}-${mIndex}`}
                                                                    metric={metric}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    )
}