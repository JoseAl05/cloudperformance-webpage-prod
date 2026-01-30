'use client'

import { DynamicColumn } from '@/components/general/data-table/columns';
import { Button } from '@/components/ui/button';
import { Eye, Server } from 'lucide-react';
import { useState } from 'react';
import { bytesToMB } from '@/lib/bytesToMbs';
import { HistoryModal, HistoryModalTab } from '@/components/general_gcp/modal/HistoryModal';
import { UnusedCeTableData, UnusedCeTableDataMetric } from '@/interfaces/vista-unused-resources/unusedComputeEngineInterfaces';
import { UnusedCeAnalysisView, UnusedCeBillingView, UnusedCeHistoryView, UnusedCeResourcesView } from '@/components/gcp/vista-recursos/sin-uso/compute-engine/info/UnusedCeInsightModal';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Interfaz extendida para incluir los campos de ordenamiento calculados
export interface FlattenedCeRow extends UnusedCeTableData {
    sort_cpu: number;
    sort_net_inout_pps: number;
    sort_net_inout_throughput: number;
    sort_disk_inout_iops: number;
    sort_disk_inout_throughput: number;
    sort_billing: number;
}

// Función auxiliar para combinar métricas (ej. Ingress + Egress) en un objeto visual
const combineMetrics = (metrics: UnusedCeTableDataMetric[] | undefined, keys: string[], nameLabel: string): UnusedCeTableDataMetric | undefined => {
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

const SmartMetricCell = ({ metric, unit }: { metric?: UnusedCeTableDataMetric, unit: string }) => {
    if (!metric) return <span className="text-muted-foreground text-xs">-</span>;

    const { avg, bar_width, visualization_type, group_context_value, metric_name } = metric;

    let valStr = '';
    let contextStr = '';

    if (metric_name.toLowerCase().includes('throughput') || unit === 'MB/s') {
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

const DetailsCell = ({ row }: { row: UnusedCeTableData }) => {
    const [isOpen, setIsOpen] = useState(false);

    const ceTabs: HistoryModalTab[] = [
        {
            value: "analysis",
            label: "Diagnóstico",
            content: <UnusedCeAnalysisView data={row} />
        },
        // {
        //     value: "billing",
        //     label: "Facturación",
        //     content: <UnusedCeBillingView data={row} />
        // },
        {
            value: "resources",
            label: "Recursos",
            content: <UnusedCeResourcesView data={row} />
        },
        {
            value: "history",
            label: "Historial",
            content: <UnusedCeHistoryView data={row} />
        }
    ];

    console.log(row)

    return (
        <>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsOpen(true)}>
                <Eye className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </Button>
            <HistoryModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={row.instance_id}
                subTitle={row.instance_name}
                region={row.metrics?.[0]?.region || row.region || 'Unknown'}
                resourceType="Compute Engine"
                tabs={ceTabs}
            />
        </>
    );
};

const GetParameters = () => {
    const searchParams = useSearchParams();
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const projectParam = searchParams.get('projects');
    const regionParam = searchParams.get('regions');

    return {
        startDateParam,
        endDateParam,
        projectParam,
        regionParam
    }
}

export const getUnusedCeColumns = (totalGlobalCost: number): DynamicColumn<FlattenedCeRow>[] => [
    {
        header: "Instancia",
        accessorKey: "instance_name",
        cell: ({ row }) => {
            const { startDateParam, endDateParam, projectParam, regionParam } = GetParameters();
            return (
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded border shrink-0">
                        <Server className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <Link
                            href={{ pathname: '/gcp/recursos/compute-engine', query: { startDate: startDateParam, endDate: endDateParam, resourceId: row.original.instance_id, projects: projectParam, regions: regionParam } }}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <span className="text-xs font-mono text-blue-500 truncate transition-all hover:text-blue-300">
                                {row.original.instance_name}
                            </span>
                        </Link>
                    </div>
                </div>
            )
        },
        size: 180
    },
    {
        header: "ID Instancia",
        accessorKey: "instance_id",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <div className="flex flex-col overflow-hidden">
                    <span className="text-[10px] text-muted-foreground font-mono truncate">
                        {row.original.instance_id}
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
                        <span className="text-[10px] text-muted-foreground opacity-80" title="Total de todas las instancias">
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
        id: "sort_cpu",
        accessorKey: "sort_cpu",
        header: "CPU",
        cell: ({ row }) => (
            <SmartMetricCell
                metric={combineMetrics(row.original.metrics, ["cpu_utilization"], "cpu_utilization")}
                unit="%"
            />
        ),
        size: 120
    },
    {
        id: "sort_net_inout_pps",
        accessorKey: "sort_net_inout_pps",
        header: "Net (I/O) PPS",
        cell: ({ row }) => (
            <SmartMetricCell
                metric={combineMetrics(row.original.metrics, ["network_ingress_pps", "network_egress_pps"], "net_pps")}
                unit="PPS"
            />
        ),
        size: 120
    },
    {
        id: "sort_net_inout_throughput",
        accessorKey: "sort_net_inout_throughput",
        header: "Net (I/O) Tpt",
        cell: ({ row }) => (
            <SmartMetricCell
                metric={combineMetrics(row.original.metrics, ["network_ingress_throughput", "network_egress_throughput"], "net_throughput")}
                unit="MB/s"
            />
        ),
        size: 120
    },
    {
        id: "sort_disk_inout_iops",
        accessorKey: "sort_disk_inout_iops",
        header: "Disk (I/O) IOPS",
        cell: ({ row }) => (
            <SmartMetricCell
                metric={combineMetrics(row.original.metrics, ["disk_read_iops", "disk_write_iops"], "disk_iops")}
                unit="IOPS"
            />
        ),
        size: 120
    },
    {
        id: "sort_disk_inout_throughput",
        accessorKey: "sort_disk_inout_throughput",
        header: "Disk (I/O) Tpt",
        cell: ({ row }) => (
            <SmartMetricCell
                metric={combineMetrics(row.original.metrics, ["disk_read_throughput", "disk_write_throughput"], "disk_throughput")}
                unit="MB/s"
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