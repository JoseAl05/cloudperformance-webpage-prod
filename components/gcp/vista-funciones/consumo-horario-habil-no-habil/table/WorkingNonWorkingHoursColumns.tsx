'use client'

import { DynamicColumn } from '@/components/data-table/columns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Eye,
    Server,
    Moon,
    Sun,
    Scale
} from 'lucide-react';
import { useState } from 'react';
import { HistoryModal, HistoryModalTab } from '@/components/general_gcp/modal/HistoryModal';
import { WorkingNonWorkingHoursUsageSummaryByResource, WorkingNonWorkingHoursUsageSummaryByResourceMetrics } from '@/interfaces/vista-consumo-horario-habil-no-habil/workingNonWorkingHoursInterfaces';

import { formatGeneric, formatBytes } from '@/lib/bytesToMbs';
import { WorkingNonWorkingAnalysisView, WorkingNonWorkingInfoView, WorkingNonWorkingMetricsView } from '@/components/gcp/vista-funciones/consumo-horario-habil-no-habil/info/WorkingNonWorkingInsightModalComponent';

const findMetric = (metrics: WorkingNonWorkingHoursUsageSummaryByResourceMetrics[], metricName: string, schedule: string) => {
    return metrics.find(m =>
        m.metric_name === metricName &&
        m.schedule_type === schedule
    );
};

const getMetricTrend = (row: WorkingNonWorkingHoursUsageSummaryByResource, metricName: string) => {
    const summary = row.metric_activity_summary.find(s => s.metric_name === metricName);
    if (!summary) return 'balanced';
    return summary.highest_avg_schedule;
};

interface DualMetricCellProps {
    row: WorkingNonWorkingHoursUsageSummaryByResource;
    metricName: string;
    maxVal: number;
    format: 'percent' | 'bytes' | 'number';
}

const DualMetricCell = ({ row, metricName, maxVal, format }: DualMetricCellProps) => {
    const working = findMetric(row.metric_data, metricName, 'business_hours');
    const nonWorking = findMetric(row.metric_data, metricName, 'non_business_hours');
    const trend = getMetricTrend(row, metricName);

    const workingVal = working ? working.avg_value : 0;
    const nonWorkingVal = nonWorking ? nonWorking.avg_value : 0;

    const base = format === 'percent' ? 100 : maxVal;
    const pctWorking = base > 0 ? (workingVal / base) * 100 : 0;
    const pctNonWorking = base > 0 ? (nonWorkingVal / base) * 100 : 0;

    const formatValue = (val: number) => {
        if (format === 'percent') return `${val.toFixed(1)}%`;
        if (format === 'bytes') return formatBytes(val);
        return formatGeneric(val);
    };

    const TrendIcon = () => {
        if (trend === 'business_hours') return <Sun className="w-3 h-3 text-amber-500" />;
        if (trend === 'non_business_hours') return <Moon className="w-3 h-3 text-purple-500" />;
        return null;
    };

    return (
        <div className="flex flex-col w-full min-w-[130px] gap-1.5 py-1 relative">
            <div className='flex justify-center items-center gap-2'>
                {
                    trend === 'business_hours' && (
                        <>
                            <TrendIcon />
                            <span className='text-xs'>Mayor uso en horario hábil</span>
                        </>
                    )
                }
                {
                    trend === 'non_business_hours' && (
                        <>
                            <TrendIcon />
                            <span className='text-xs'>Mayor uso en horario no hábil</span>
                        </>
                    )
                }
            </div>
            <div className={`flex flex-col gap-0.5 ${trend === 'business_hours' ? 'opacity-100' : 'opacity-80'}`}>
                <div className="flex justify-between items-end text-[10px]">
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium">Hábil</span>
                    <span className={`font-mono ${trend === 'business_hours' ? 'font-bold text-amber-600' : ''}`}>
                        {formatValue(workingVal)}
                    </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.min(pctWorking, 100)}%` }} />
                </div>
            </div>
            <div className={`flex flex-col gap-0.5 ${trend === 'non_business_hours' ? 'opacity-100' : 'opacity-80'}`}>
                <div className="flex justify-between items-end text-[10px]">
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium">No Hábil</span>
                    <span className={`font-mono ${trend === 'non_business_hours' ? 'font-bold text-purple-600' : ''}`}>
                        {formatValue(nonWorkingVal)}
                    </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-purple-500" style={{ width: `${Math.min(pctNonWorking, 100)}%` }} />
                </div>
            </div>
        </div>
    );
};

const GeneralTrendCell = ({ row }: { row: WorkingNonWorkingHoursUsageSummaryByResource }) => {
    let workingCount = 0;
    let nonWorkingCount = 0;

    row.metric_activity_summary.forEach(summary => {
        if (summary.highest_avg_schedule === 'business_hours') workingCount++;
        else if (summary.highest_avg_schedule === 'non_business_hours') nonWorkingCount++;
    });

    if (workingCount > nonWorkingCount) {
        return <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200 flex w-fit items-center gap-1"><Sun className="w-3 h-3" /> Mayor uso general en horario hábil</Badge>;
    } else if (nonWorkingCount > workingCount) {
        return <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200 flex w-fit items-center gap-1"><Moon className="w-3 h-3" /> Mayor uso general en horario no hábil</Badge>;
    }
    return <Badge variant="secondary" className="text-[10px] flex w-fit items-center gap-1"><Scale className="w-3 h-3" /> Balanceado</Badge>;
};

const DetailsCell = ({ row }: { row: WorkingNonWorkingHoursUsageSummaryByResource }) => {
    const [isOpen, setIsOpen] = useState(false);

    const tabs: HistoryModalTab[] = [
        { value: "info", label: "Resumen", content: <WorkingNonWorkingInfoView data={row} /> },
        { value: "metricas", label: "Detalle Métricas", content: <WorkingNonWorkingMetricsView data={row} /> },
        // { value: "analisis", label: "Análisis & Ahorro", content: <WorkingNonWorkingAnalysisView data={row} /> }
    ];

    return (
        <>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsOpen(true)}>
                <Eye className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </Button>
            <HistoryModal isOpen={isOpen} onClose={() => setIsOpen(false)} title={row.resource_name} region={row.resource_id} resourceType="Workload Resource" tabs={tabs} />
        </>
    );
};

export interface MaxValues {
    maxDiskReadIOPS: number;
    maxDiskWriteIOPS: number;
    maxDiskReadThroughput: number;
    maxDiskWriteThroughput: number;
    maxNetIngressPPS: number;
    maxNetEgressPPS: number;
    maxNetIngressThroughput: number;
    maxNetEgressThroughput: number;
}

export const getWorkingNonWorkingColumns = (maxValues: MaxValues): DynamicColumn<WorkingNonWorkingHoursUsageSummaryByResource>[] => [
    {
        header: "Recurso",
        accessorKey: "resource_name",
        cell: (info) => (
            <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800">
                        <Server className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 max-w-[180px]" title={info.getValue() as string}>
                        {info.getValue() as string}
                    </span>
                </div>
                <div className="text-[10px] text-muted-foreground pl-1 max-w-[180px] opacity-70">
                    {info.row.original.resource_id}
                </div>
            </div>
        ),
        size: 200
    },
    {
        header: "CPU",
        id: "cpu_col",
        cell: ({ row }) => <DualMetricCell row={row.original} metricName="cpu_utilization" maxVal={100} format="percent" />,
        size: 130
    },
    {
        header: "Disk Read (IOPS)",
        id: "disk_read_iops_col",
        cell: ({ row }) => <DualMetricCell row={row.original} metricName="disk_read_iops" maxVal={maxValues.maxDiskReadIOPS} format="number" />,
        size: 140
    },
    {
        header: "Disk Write (IOPS)",
        id: "disk_write_iops_col",
        cell: ({ row }) => <DualMetricCell row={row.original} metricName="disk_write_iops" maxVal={maxValues.maxDiskWriteIOPS} format="number" />,
        size: 140
    },
    {
        header: "Disk Read (Bytes)",
        id: "disk_read_bytes_col",
        cell: ({ row }) => <DualMetricCell row={row.original} metricName="disk_read_throughput" maxVal={maxValues.maxDiskReadThroughput} format="bytes" />,
        size: 140
    },
    {
        header: "Disk Write (Bytes)",
        id: "disk_write_bytes_col",
        cell: ({ row }) => <DualMetricCell row={row.original} metricName="disk_write_throughput" maxVal={maxValues.maxDiskWriteThroughput} format="bytes" />,
        size: 140
    },
    {
        header: "Net In (Bytes)",
        id: "net_in_bytes_col",
        cell: ({ row }) => <DualMetricCell row={row.original} metricName="network_ingress_throughput" maxVal={maxValues.maxNetIngressThroughput} format="bytes" />,
        size: 140
    },
    {
        header: "Net Out (Bytes)",
        id: "net_out_bytes_col",
        cell: ({ row }) => <DualMetricCell row={row.original} metricName="network_egress_throughput" maxVal={maxValues.maxNetEgressThroughput} format="bytes" />,
        size: 140
    },
    {
        header: "Net In (PPS)",
        id: "net_in_pps_col",
        cell: ({ row }) => <DualMetricCell row={row.original} metricName="network_ingress_pps" maxVal={maxValues.maxNetIngressPPS} format="number" />,
        size: 130
    },
    {
        header: "Net Out (PPS)",
        id: "net_out_pps_col",
        cell: ({ row }) => <DualMetricCell row={row.original} metricName="network_egress_pps" maxVal={maxValues.maxNetEgressPPS} format="number" />,
        size: 130
    },
    {
        header: "Tendencia Global",
        accessorKey: "metric_activity_summary",
        cell: ({ row }) => <GeneralTrendCell row={row.original} />,
        size: 140
    },
    {
        id: "actions",
        header: " ",
        cell: ({ row }) => <DetailsCell row={row.original} />,
        size: 50
    }
];