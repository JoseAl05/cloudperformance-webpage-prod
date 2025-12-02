'use client'

import { DynamicColumn } from '@/components/general_aws/data-table/columns';
import { NatGatewaysMetricsSummary, NatGatewaysMetricsSummaryMetrics } from '@/interfaces/vista-consumos/natGwConsumeViewInterfaces';
import { bytesToMB } from '@/lib/bytesToMbs';
import { cn } from '@/lib/utils';
import { Activity, AlertTriangle, ArrowDownLeftFromCircle, ArrowUpRightFromCircle, CheckCircle2 } from 'lucide-react';

const formatNumber = (num: number) => new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(num);

interface MetricsCellProps {
    data: NatGatewaysMetricsSummaryMetrics[];
    metric_name: string;
    type: 'out' | 'in' | 'connection' | 'error';
}


const MetricsCell = ({ data, metric_name, type }: MetricsCellProps) => {
    if (!data || !Array.isArray(data)) return <span className="text-muted-foreground">-</span>;

    const filterMetrics = data.filter(item => item.metric_name === metric_name);
    if (filterMetrics.length === 0) return <span className="text-muted-foreground text-xs">Sin datos</span>;


    const sumMetricValue = filterMetrics.reduce((acc, curr) => acc + curr.value, 0);
    const avgValue = sumMetricValue / filterMetrics.length;

    const config = {
        out: {
            icon: ArrowUpRightFromCircle,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            label: "MBs"
        },
        in: {
            icon: ArrowDownLeftFromCircle,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            label: "MBs"
        },
        connection: {
            icon: Activity,
            color: "text-violet-600 dark:text-violet-400",
            bg: "bg-violet-50 dark:bg-violet-900/20",
            label: "conn"
        },
        error: {
            icon: avgValue > 0 ? AlertTriangle : CheckCircle2,
            color: avgValue > 0 ? "text-red-600 dark:text-red-400" : "text-slate-400",
            bg: avgValue > 0 ? "bg-red-50 dark:bg-red-900/20" : "bg-slate-50 dark:bg-slate-800/50",
            label: "err"
        }
    }[type];

    const Icon = config.icon;
    const isBytes = type === 'out' || type === 'in';
    const displayValue = isBytes ? bytesToMB(avgValue) : formatNumber(avgValue);

    return (
        <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg shrink-0", config.bg, config.color)}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
                <span className="font-mono font-semibold text-sm text-gray-700 dark:text-gray-200 leading-none">
                    {displayValue}
                </span>
                <span className="text-[10px] uppercase font-medium text-muted-foreground mt-1">
                    {config.label}
                </span>
            </div>
        </div>
    );

}

export const NatGatewaysConsumeColumns: DynamicColumn<NatGatewaysMetricsSummary>[] = [
    {
        header: "Nombre/ID Nat Gateway",
        accessorKey: "resource",
        cell: ({ row, getValue }) => {
            const name = getValue() as string;

            return (
                <div className="flex flex-col py-1">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {name}
                    </span>
                </div>
            )
        }
    },
    {
        header: "Localización",
        accessorKey: "resource_region",
        cell: (info) => (
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                {info.getValue() as string}
            </div>
        )
    },
    {
        header: "Volumen Saliente (Internet)",
        accessorKey: "bytes_out_to_destination",
        cell: ({ row }) => {
            const metrics = row.original.metrics as NatGatewaysMetricsSummaryMetrics[];
            return <MetricsCell data={metrics} metric_name="BytesOutToDestination Maximum" type="out" />
        }
    },
    {
        header: "Volumen Entrante (VPC)",
        accessorKey: "bytes_in_from_source",
        cell: ({ row }) => {
            const metrics = row.original.metrics as NatGatewaysMetricsSummaryMetrics[];
            return <MetricsCell data={metrics} metric_name="BytesInFromSource Maximum" type='in' />
        }
    },
    {
        header: "Carga de Conexiones (Total)",
        accessorKey: "active_connection_count",
        cell: ({ row }) => {
            const metrics = row.original.metrics as NatGatewaysMetricsSummaryMetrics[];
            return <MetricsCell data={metrics} metric_name="ActiveConnectionCount Maximum" type='connection' />
        }
    },
    {
        header: "Errores de Asignación de Puerto",
        accessorKey: "error_port_allocation",
        cell: ({ row }) => {
            const metrics = row.original.metrics as NatGatewaysMetricsSummaryMetrics[];
            return <MetricsCell data={metrics} metric_name="ErrorPortAllocation Maximum" type='error' />
        }
    }
];