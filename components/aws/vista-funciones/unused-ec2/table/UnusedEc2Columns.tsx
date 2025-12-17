'use client'

import { DynamicColumn } from '@/components/general/data-table/columns';
import { Button } from '@/components/ui/button';
import { Eye, Server } from 'lucide-react';
import { useState } from 'react';
import { bytesToMB } from '@/lib/bytesToMbs';
import { Ec2MetricTableData, Ec2TableRow } from '@/interfaces/general-interfaces/ec2MetricsTableData';
import { HistoryModal } from '@/components/general_aws/modal/HistoryModal';
import { UnusedEc2AnalysisView, UnusedEc2HistoryView, UnusedEc2ResourcesView } from '@/components/aws/vista-funciones/unused-ec2/info/UnusedEc2InsightModal';

interface FlattenedEc2Row extends Ec2TableRow {
    sort_cpu: number;
    sort_net_in: number;
    sort_net_out: number;
}

const findMetricObj = (metrics: Ec2MetricTableData[] | undefined, key: string) => {
    return metrics?.find(m => m.metric_name.toLowerCase().includes(key.toLowerCase()));
};

const SmartMetricCell = ({ metric, unit }: { metric?: Ec2MetricTableData, unit: string }) => {
    if (!metric) return <span className="text-muted-foreground text-xs">-</span>;

    const { avg, bar_width, visualization_type, group_context_value } = metric;
    const valStr = unit === 'MB' ? bytesToMB(avg) : avg.toFixed(2);
    const contextStr = unit === 'MB' ? bytesToMB(group_context_value) : group_context_value.toFixed(2);
    const unitLabel = unit === 'MB' ? 'MB' : '%';

    let barColor = "bg-blue-700 dark:bg-blue-800";
    if (visualization_type === 'ranking' && avg > 80) barColor = "bg-red-700 dark:bg-red-800";
    else if (visualization_type === 'contribution') barColor = "bg-teal-500 dark:bg-teal-600";

    return (
        <div className="flex flex-col w-full min-w-[130px] gap-1">
            <div className="flex justify-between items-end text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">
                    {valStr} <span className="text-[10px] font-normal text-muted-foreground">{unitLabel}</span>
                </span>
                <span className="text-[10px] text-muted-foreground opacity-80" title={visualization_type === 'ranking' ? 'Max del grupo' : 'Total del grupo'}>
                    {visualization_type === 'ranking' ? 'Mx:' : 'Tot:'} {contextStr}
                </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${bar_width || 0}%` }} />
            </div>
        </div>
    );
};

const DetailsCell = ({ row }: { row: Ec2TableRow }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ec2Tabs: HistoryModalTab[] = [
        {
            value: "analysis",
            label: "Diagnóstico",
            content: <UnusedEc2AnalysisView data={row} />
        },
        {
            value: "resources",
            label: `Recursos (${row.volumes.length + row.network_interfaces.length})`,
            content: <UnusedEc2ResourcesView data={row} />
        },
        {
            value: "history",
            label: `Historial (${row.history.length})`,
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
                region={row.metrics?.[0]?.region || 'Unknown'}
                resourceType="EC2 Instance"
                tabs={ec2Tabs}
            />
        </>
    );
};

export const getUnusedEc2Columns = (): DynamicColumn<FlattenedEc2Row>[] => [
    {
        header: "Instancia",
        accessorKey: "instance_id",
        cell: (info) => (
            <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800">
                    <Server className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                </div>
                <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">{info.getValue() as string}</span>
            </div>
        ),
        size: 180
    },
    {
        id: "sort_cpu",
        accessorKey: "sort_cpu",
        header: "CPU (Avg)",
        cell: ({ row }) => <SmartMetricCell metric={findMetricObj(row.original.metrics, "CPUUtilization")} unit="%" />,
        size: 160
    },
    {
        id: "sort_net_in",
        accessorKey: "sort_net_in",
        header: "Network In",
        cell: ({ row }) => <SmartMetricCell metric={findMetricObj(row.original.metrics, "NetworkIn")} unit="MB" />,
        size: 160
    },
    {
        id: "sort_net_out",
        accessorKey: "sort_net_out",
        header: "Network Out",
        cell: ({ row }) => <SmartMetricCell metric={findMetricObj(row.original.metrics, "NetworkOut")} unit="MB" />,
        size: 160
    },
    {
        id: "actions",
        header: " ",
        cell: ({ row }) => <DetailsCell row={row.original} />,
        size: 50
    }
];