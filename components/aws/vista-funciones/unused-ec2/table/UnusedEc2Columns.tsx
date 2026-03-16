'use client'

import { DynamicColumn } from '@/components/general/data-table/columns';
import { Button } from '@/components/ui/button';
import { Eye, Server } from 'lucide-react';
import { useState } from 'react';
import { bytesToMB } from '@/lib/bytesToMbs';
import { HistoryModal, HistoryModalTab } from '@/components/general_gcp/modal/HistoryModal';
import { UnusedEc2TableData, UnusedEc2TableDataMetric } from '@/interfaces/vista-unused-resources/unusedEc2InstanceInterfaces';
import { UnusedEc2AnalysisView, UnusedEc2ResourcesView, UnusedEc2HistoryView } from '@/components/aws/vista-funciones/unused-ec2/info/UnusedEc2InsightModal';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export interface FlattenedEc2Row extends UnusedEc2TableData {
    sort_cpu: number;
    sort_net_inout: number;
    sort_cpu_credit_usage: number;
    sort_cpu_credit_balance: number;
    sort_status_check_failed: number;
    sort_billing: number;
}

const combineMetrics = (metrics: UnusedEc2TableDataMetric[] | undefined, keys: string[], nameLabel: string): UnusedEc2TableDataMetric | undefined => {
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

const SmartMetricCell = ({ metric, unit }: { metric?: UnusedEc2TableDataMetric, unit: string }) => {
    if (!metric) return <span className="text-muted-foreground text-xs">-</span>;

    const { avg, bar_width, visualization_type, group_context_value, metric_name } = metric;

    let valStr = '';
    let contextStr = '';

    if (metric_name.toLowerCase().includes('networkin') || metric_name.toLowerCase().includes('networkout') || unit === 'MB/s') {
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

const DetailsCell = ({ row }: { row: UnusedEc2TableData }) => {
    const [isOpen, setIsOpen] = useState(false);

    const ec2Tabs: HistoryModalTab[] = [
        {
            value: "analysis",
            label: "Diagnóstico",
            content: <UnusedEc2AnalysisView data={row} />
        },
        {
            value: "resources",
            label: "Recursos",
            content: <UnusedEc2ResourcesView data={row} />
        },
        {
            value: "history",
            label: "Historial",
            content: <UnusedEc2HistoryView data={row} />
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
                title={row.instance_id}
                subTitle={row.instance_name}
                region={row.metrics?.[0]?.region || row.region || 'Unknown'}
                resourceType="EC2 Instance"
                tabs={ec2Tabs}
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

export const getUnusedEc2Columns = (totalGlobalCost: number): DynamicColumn<FlattenedEc2Row>[] => [
    {
        header: "Instancia",
        accessorKey: "instance_name",
        cell: ({ row }) => {
            const { startDateParam, endDateParam, regionParam } = GetParameters();
            return (
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded border shrink-0">
                        <Server className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <Link
                            href={{ pathname: '/aws/recursos/ec2', query: { startDate: startDateParam, endDate: endDateParam, resourceId: row.original.instance_id, regions: regionParam } }}
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
                metric={combineMetrics(row.original.metrics, ["CPUUtilization"], "CPUUtilization")}
                unit="%"
            />
        ),
        size: 120
    },
    {
        id: "sort_net_inout",
        accessorKey: "sort_net_inout",
        header: "Net (I/O)",
        cell: ({ row }) => (
            <SmartMetricCell
                metric={combineMetrics(row.original.metrics, ["NetworkIn", "NetworkOut"], "NetworkInOut")}
                unit="MB/s"
            />
        ),
        size: 120
    },
    {
        id: "sort_cpu_credit_usage",
        accessorKey: "sort_cpu_credit_usage",
        header: "CPU Credit Usage",
        cell: ({ row }) => (
            <SmartMetricCell
                metric={combineMetrics(row.original.metrics, ["CPUCreditUsage"], "CPUCreditUsage")}
                unit="Créditos"
            />
        ),
        size: 120
    },
    {
        id: "sort_cpu_credit_balance",
        accessorKey: "sort_cpu_credit_balance",
        header: "CPU Credit Balance",
        cell: ({ row }) => (
            <SmartMetricCell
                metric={combineMetrics(row.original.metrics, ["CPUCreditBalance"], "CPUCreditBalance")}
                unit="Créditos"
            />
        ),
        size: 120
    },
    {
        id: "sort_status_check_failed",
        accessorKey: "sort_status_check_failed",
        header: "Status Check",
        cell: ({ row }) => (
            <SmartMetricCell
                metric={combineMetrics(row.original.metrics, ["StatusCheckFailed"], "StatusCheckFailed")}
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