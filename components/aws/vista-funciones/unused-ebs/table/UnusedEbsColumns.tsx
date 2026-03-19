'use client'

import { DynamicColumn } from '@/components/general/data-table/columns';
import { Button } from '@/components/ui/button';
import { Eye, HardDrive } from 'lucide-react';
import { useState } from 'react';
import { bytesToMB } from '@/lib/bytesToMbs';
import { HistoryModal, HistoryModalTab } from '@/components/general_gcp/modal/HistoryModal';
import { UnusedEbsTableData, UnusedEbsTableDataMetric } from '@/interfaces/vista-unused-resources/unusedEbsResourcesInterfaces';
import { UnusedEbsAnalysisView, UnusedEbsResourcesView, UnusedEbsHistoryView } from '@/components/aws/vista-funciones/unused-ebs/info/UnusedEbsInsightModal';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export interface FlattenedEbsRow extends UnusedEbsTableData {
    sort_idle_time: number;
    sort_ops: number;
    sort_bytes: number;
    sort_burst_balance: number;
    sort_queue_length: number;
    sort_billing: number;
}

const combineMetrics = (metrics: UnusedEbsTableDataMetric[] | undefined, keys: string[], nameLabel: string): UnusedEbsTableDataMetric | undefined => {
    if (!metrics) return undefined;

    const relevantMetrics = metrics.filter(m => keys.some(k => m.metric_name.includes(k)));
    if (relevantMetrics.length === 0) return undefined;

    const totalAvg = relevantMetrics.reduce((acc, curr) => acc + curr.avg, 0);
    const totalContext = relevantMetrics.reduce((acc, curr) => acc + curr.group_context_value, 0);

    const newBarWidth = totalContext > 0 ? (totalAvg / totalContext) * 100 : 0;

    return {
        ...relevantMetrics[0],
        metric_name: nameLabel,
        avg: totalAvg,
        group_context_value: totalContext,
        bar_width: newBarWidth
    };
};

const SmartMetricCell = ({ metric, unit }: { metric?: UnusedEbsTableDataMetric, unit: string }) => {
    if (!metric) return <span className="text-muted-foreground text-xs">-</span>;

    const { avg, bar_width, visualization_type, group_context_value, metric_name } = metric;

    let valStr = '';
    let contextStr = '';

    if (metric_name.toLowerCase().includes('bytes') || unit === 'MB') {
        valStr = bytesToMB(avg);
        contextStr = bytesToMB(group_context_value);
    } else {
        valStr = avg.toLocaleString('es-CL', { maximumFractionDigits: 2 });
        contextStr = group_context_value.toLocaleString('es-CL', { maximumFractionDigits: 2 });
    }

    let barColor = "bg-blue-700 dark:bg-blue-800";
    if (visualization_type === 'ranking' && bar_width > 80) barColor = "bg-red-700 dark:bg-red-800";
    else if (visualization_type === 'contribution') barColor = "bg-teal-500 dark:bg-teal-600";

    return (
        <div className="flex flex-col w-full min-w-[110px] gap-1 pr-4">
            <div className="flex justify-between items-end text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">
                    {valStr} <span className="text-[10px] font-normal text-muted-foreground">{unit}</span>
                </span>
                <span className="text-[10px] text-muted-foreground opacity-80" title={visualization_type === 'ranking' ? 'Max del grupo' : 'Total del grupo'}>
                    {visualization_type === 'ranking' ? 'Mx:' : 'Tot:'} {contextStr}
                </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(bar_width || 0, 100)}%` }} />
            </div>
        </div>
    );
};

const DetailsCell = ({ row }: { row: UnusedEbsTableData }) => {
    const [isOpen, setIsOpen] = useState(false);

    const ebsTabs: HistoryModalTab[] = [
        {
            value: "analysis",
            label: "Diagnóstico",
            content: <UnusedEbsAnalysisView data={row} />
        },
        {
            value: "resources",
            label: "Recursos",
            content: <UnusedEbsResourcesView data={row} />
        },
        {
            value: "history",
            label: "Historial",
            content: <UnusedEbsHistoryView data={row} />
        }
    ];

    return (
        <>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsOpen(true)}>
                <Eye className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </Button>
            <HistoryModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={row.volume_id}
                subTitle={row.volume_name}
                region={row.metrics?.[0]?.region || row.region || 'Unknown'}
                resourceType="EBS Volume"
                tabs={ebsTabs}
            />
        </>
    );
};

const GetParameters = () => {
    const searchParams = useSearchParams();
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const regionParam = searchParams.get('regions');

    return {
        startDateParam,
        endDateParam,
        regionParam
    }
}

export const getUnusedEbsColumns = (totalGlobalCost: number): DynamicColumn<FlattenedEbsRow>[] => [
    {
        header: "Volumen",
        accessorKey: "volume_name",
        cell: ({ row }) => {
            const { startDateParam, endDateParam, regionParam } = GetParameters();
            return (
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded border shrink-0">
                        <HardDrive className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <Link
                            href={{ pathname: '/aws/recursos/ebs', query: { startDate: startDateParam, endDate: endDateParam, resourceId: row.original.volume_id, regions: regionParam } }}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <span className="text-xs font-mono text-blue-500 truncate transition-all hover:text-blue-300">
                                {row.original.volume_name}
                            </span>
                        </Link>
                    </div>
                </div>
            )
        },
        size: 180
    },
    {
        header: "ID Volumen",
        accessorKey: "volume_id",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <div className="flex flex-col overflow-hidden">
                    <span className="text-[10px] text-muted-foreground font-mono truncate">
                        {row.original.volume_id}
                    </span>
                </div>
            </div>
        ),
        size: 150
    },
    {
        id: "sort_billing",
        accessorKey: "sort_billing",
        header: "Gasto Periodo",
        cell: ({ row }) => {
            const cost = row.original.billing?.total_cost_usd || 0;
            const percentage = totalGlobalCost > 0 ? (cost / totalGlobalCost) * 100 : 0;

            return (
                <div className="flex flex-col w-full min-w-[110px] gap-1 pr-4">
                    <div className="flex justify-between items-end text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-200">
                            ${cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] text-muted-foreground opacity-80" title="Total de todos los volúmenes">
                            Tot: ${totalGlobalCost.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                        </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-teal-500 dark:bg-teal-600" style={{ width: `${Math.min(percentage, 100)}%` }} />
                    </div>
                </div>
            );
        },
        size: 140
    },
    {
        id: "sort_idle_time",
        accessorKey: "sort_idle_time",
        header: "Idle Time",
        cell: ({ row }) => (
            <SmartMetricCell
                metric={combineMetrics(row.original.metrics, ["VolumeIdleTime"], "VolumeIdleTime")}
                unit="seg"
            />
        ),
        size: 120
    },
    {
        id: "sort_ops",
        accessorKey: "sort_ops",
        header: "Ops (R/W)",
        cell: ({ row }) => (
            <SmartMetricCell
                metric={combineMetrics(row.original.metrics, ["VolumeReadOps", "VolumeWriteOps"], "VolumeOpsReadWrite")}
                unit="OPS"
            />
        ),
        size: 120
    },
    {
        id: "sort_bytes",
        accessorKey: "sort_bytes",
        header: "Bytes (R/W)",
        cell: ({ row }) => (
            <SmartMetricCell
                metric={combineMetrics(row.original.metrics, ["VolumeReadBytes", "VolumeWriteBytes"], "VolumeBytesReadWrite")}
                unit="MB"
            />
        ),
        size: 120
    },
    {
        id: "sort_burst_balance",
        accessorKey: "sort_burst_balance",
        header: "Burst Balance",
        cell: ({ row }) => (
            <SmartMetricCell
                metric={combineMetrics(row.original.metrics, ["BurstBalance"], "BurstBalance")}
                unit="%"
            />
        ),
        size: 120
    },
    {
        id: "sort_queue_length",
        accessorKey: "sort_queue_length",
        header: "Queue Length",
        cell: ({ row }) => (
            <SmartMetricCell
                metric={combineMetrics(row.original.metrics, ["VolumeQueueLength"], "VolumeQueueLength")}
                unit=""
            />
        ),
        size: 120
    },
    {
        id: "actions",
        header: " ",
        cell: ({ row }) => <DetailsCell row={row.original} />,
        size: 50,
        enableSorting: false
    }
];