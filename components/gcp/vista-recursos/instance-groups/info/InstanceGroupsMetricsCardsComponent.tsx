'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSidebar } from '@/components/ui/sidebar';
import { InstanceGroupsMetrics } from '@/interfaces/vista-instance-group/iGInterfaces';
import { bytesToMB } from '@/lib/bytesToMbs';
import { formatMetric } from '@/lib/metricUtils';
import { cn } from '@/lib/utils';
import { Activity, HardDrive, Network, Clock, Cpu } from 'lucide-react';
import { useMemo } from 'react';

interface InstanceGroupsMetricsCardsComponentProps {
    data?: InstanceGroupsMetrics[];
}

const metricUnits: Record<string, string> = {
    network_ingress_throughput: "MB/s",
    network_ingress_pps: "PPS",
    network_egress_throughput: "MB/s",
    network_egress_pps: "PPS",
    disk_write_throughput: "MB/s",
    disk_write_iops: "IOPS",
    disk_read_throughput: "MB/s",
    disk_read_iops: "IOPS",
    cpu_utilization: "%",
    uptime_sec: "s"
};

const getMetricIcon = (metricName: string) => {
    if (metricName.includes('network')) return Network;
    if (metricName.includes('disk')) return HardDrive;
    if (metricName.includes('cpu')) return Cpu;
    if (metricName.includes('uptime')) return Clock;
    return Activity;
};

const formatMetricName = (name: string) => {
    return name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const InstanceGroupsMetricsCardsComponent = ({ data }: InstanceGroupsMetricsCardsComponentProps) => {

    const { state } = useSidebar()

    const metrics = useMemo(() => {
        if (!data || !Array.isArray(data) || data.length === 0) return [];
        return data;
    }, [data]);

    if (!data || data.length === 0) {
        return <div className="text-muted-foreground text-sm">No hay métricas de Compute Engine para mostrar.</div>;
    }

    const sortedMetrics = metrics.sort((a,b) => a.metric_name.localeCompare(b.metric_name));

    return (
        <div className={cn(
            "grid gap-6",
            state !== "collapsed" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        )
        }>
            {sortedMetrics.map((metric) => {
                const Icon = getMetricIcon(metric.metric_name);
                const unit = metricUnits[metric.metric_name] || '';
                const peakValue = metric.metric_data
                    ? metric.metric_data.reduce((max, current) => Math.max(max, current.metric_value), 0)
                    : 0;

                const metricValue = metric.avg_value;

                let finalMetricValue = 0;
                let finalPeakValue = 0;
                if(unit === "MB/s"){
                    finalMetricValue = bytesToMB(metricValue);
                    finalPeakValue = bytesToMB(peakValue);
                } else {
                    finalMetricValue = formatMetric(metricValue);
                    finalPeakValue = formatMetric(peakValue);
                }
                return (
                    <Card
                        key={metric.metric_name}
                        className="border-l-4 shadow-sm hover:shadow-md transition-all duration-200 border-l-blue-500 overflow-hidden"
                    >
                        <CardHeader className="pb-2 bg-slate-50/50 dark:bg-slate-900/20 border-b mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <CardTitle className="text-md font-bold text-slate-800 dark:text-slate-100 truncate" title={metric.metric_name}>
                                    {formatMetricName(metric.metric_name)}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <div className="flex justify-between items-end px-2 pb-2">
                                <div>
                                    <p className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-1">Promedio</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                                            {finalMetricValue}
                                        </span>
                                        {unit && (
                                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                {unit}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center text-right">
                                    <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-1">Peak</p>
                                    <div className="flex items-center gap-1 justify-end">
                                        <span className="font-bold text-lg text-slate-700 dark:text-slate-300">
                                            {finalPeakValue}
                                        </span>
                                        {unit && (
                                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                {unit}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};