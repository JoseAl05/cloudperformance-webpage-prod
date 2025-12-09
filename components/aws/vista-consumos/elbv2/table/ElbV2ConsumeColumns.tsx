'use client'

import { ResourceBillingActionCell } from '@/components/aws/facturacion-recurso/table/ResourceBillingActionCell';
import { DynamicColumn } from '@/components/general_aws/data-table/columns';
import { LoadbalancerV2MetricsSummary, LoadbalancerV2MetricsSummaryMetrics } from '@/interfaces/vista-consumos/elbV2ConsumeViewInterfaces';
import { bytesToMB } from '@/lib/bytesToMbs';
import { formatMetric } from '@/lib/metricUtils';
import { cn } from '@/lib/utils';
import {
    Activity,
    AlertTriangle,
    ArrowRightLeft,
    BarChart3,
    CheckCircle2,
    Coins,
    Database,
    Globe
} from 'lucide-react';

export interface ElbV2GlobalMetrics {
    totalConsumedLCUs: number;
    totalProcessedBytes: number;
    totalRequestCount: number;
    totalNewFlowCount: number;
    totalActiveConnectionCount: number;
    totalTarget5xx: number;
    totalTcpReset: number;
}

interface MetricsCellProps {
    data: LoadbalancerV2MetricsSummaryMetrics[];
    primaryMetric: string;
    secondaryMetric?: string;
    globalTotal: number;
    type: 'cost' | 'volume' | 'traffic' | 'connection' | 'error';
    unitLabel?: string;
}

const MetricsCell = ({ data, primaryMetric, secondaryMetric, globalTotal, type, unitLabel }: MetricsCellProps) => {
    if (!data || !Array.isArray(data)) return <span className="text-muted-foreground">-</span>;

    let metricItem = data.find(item => item.metric_name.includes(primaryMetric));
    let usedMetricName = primaryMetric;

    if (!metricItem && secondaryMetric) {
        metricItem = data.find(item => item.metric_name.includes(secondaryMetric));
        usedMetricName = secondaryMetric;
    }

    const value = metricItem?.value || 0;

    const maxVal = globalTotal > 0 ? (value > globalTotal ? value : globalTotal) : (value > 0 ? value : 1);
    const percentage = globalTotal > 0 ? (value / globalTotal) * 100 : 0;

    const isMajorContributor = percentage > 30;

    const config = {
        cost: {

            color: "text-slate-600 dark:text-slate-400",
            bg: "bg-slate-100 dark:bg-slate-800",
            label: "LCUs"
        },
        volume: {

            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            label: "MBs"
        },
        traffic: {

            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            label: usedMetricName.includes('Request') ? "Reqs" : "Flows"
        },
        connection: {

            color: "text-violet-600 dark:text-violet-400",
            bg: "bg-violet-50 dark:bg-violet-900/20",
            label: "Conns"
        },
        error: {

            color: value > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-500",
            bg: value > 0 ? "bg-red-50 dark:bg-red-900/20" : "bg-green-50 dark:bg-green-900/10",
            label: usedMetricName.includes('5XX') ? "5xx" : "Rst"
        }
    }[type];

    let progressColorClass = isMajorContributor
        ? '[&::-webkit-progress-value]:bg-orange-500 [&::-moz-progress-bar]:bg-orange-500'
        : '[&::-webkit-progress-value]:bg-blue-500 [&::-moz-progress-bar]:bg-blue-500';

    if (type === 'error') {
        progressColorClass = value > 0
            ? '[&::-webkit-progress-value]:bg-red-500 [&::-moz-progress-bar]:bg-red-500'
            : '[&::-webkit-progress-value]:bg-green-500 [&::-moz-progress-bar]:bg-green-500';
    }


    let displayValue = formatMetric(value);
    let displayTotal = formatMetric(globalTotal);

    if (type === 'volume') {
        displayValue = bytesToMB(value);
        displayTotal = bytesToMB(globalTotal);
    }

    return (
        <div className="flex flex-col w-full min-w-[140px] gap-1.5">
            <div className="flex items-center gap-2 mb-1">
                <div className={cn("p-1.5 rounded-md shrink-0", config.bg, config.color)}>
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex justify-between items-baseline">
                        <span className={cn("font-mono font-semibold text-xs", value === 0 && type !== 'error' ? "text-muted-foreground" : "text-foreground")}>
                            {displayValue} <span className="text-[9px] text-muted-foreground font-sans uppercase">{unitLabel || config.label}</span>
                        </span>
                    </div>
                </div>
            </div>
            <progress
                value={value}
                max={maxVal}
                title={`Contribución: ${percentage.toFixed(1)}% del Total (${displayTotal})`}
                className={cn(
                    "w-full h-1.5 rounded-full overflow-hidden appearance-none bg-secondary/50 [&::-webkit-progress-bar]:bg-secondary/50 [&::-webkit-progress-bar]:rounded-full",
                    progressColorClass
                )}
            />

            <div className="flex justify-end">
                <span className="text-[9px] text-muted-foreground" title="Total Global del Grupo Seleccionado">
                    Total: {displayTotal}
                </span>
            </div>
        </div>
    );
}

export const getElbV2ConsumeColumns = (globalMetrics: ElbV2GlobalMetrics): DynamicColumn<LoadbalancerV2MetricsSummary>[] => [
    {
        header: "Recurso",
        accessorKey: "resource",
        cell: ({ row, getValue }) => {
            const name = getValue() as string;
            const parts = name.split(':').pop()?.split("/") || [];
            const shortName = parts.length >= 4 ? `${parts[2]} ${parts[3]}` : name;

            const isApp = name.includes('app/');
            const isNet = name.includes('net/');

            return (
                <div className="flex flex-col py-1 gap-1 max-w-[180px]">
                    <span className="font-semibold text-sm text-foreground truncate" title={name}>
                        {shortName}
                    </span>
                    <div className="flex gap-2">
                        {isApp && <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">ALB</span>}
                        {isNet && <span className="text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-800">NLB</span>}
                    </div>
                </div>
            )
        },
        size: 200,
        enableSorting: true
    },
    {
        header: "Región",
        accessorKey: "resource_region",
        cell: (info) => (
            <div className="text-xs font-medium text-muted-foreground">
                {info.getValue() as string}
            </div>
        ),
        size: 100
    },
    {
        header: "Consumo LCU",
        accessorKey: "lcu_metric",
        cell: ({ row }) => {
            return <MetricsCell
                data={row.original.metrics}
                primaryMetric="ConsumedLCUs Average"
                globalTotal={globalMetrics.totalConsumedLCUs}
                type="cost"
            />
        },

    },
    {
        header: "Volumen Proc.",
        accessorKey: "bytes_metric",
        cell: ({ row }) => {
            return <MetricsCell
                data={row.original.metrics}
                primaryMetric="ProcessedBytes Average"
                globalTotal={globalMetrics.totalProcessedBytes}
                type="volume"
            />
        },

    },
    {
        header: "Tráfico / Carga",
        accessorKey: "traffic_metric",
        cell: ({ row }) => {
            return <MetricsCell
                data={row.original.metrics}
                primaryMetric="RequestCount Average"
                secondaryMetric="NewFlowCount Average"
                globalTotal={globalMetrics.totalRequestCount + globalMetrics.totalNewFlowCount}
                type="traffic"
            />
        },

    },
    {
        header: "Conexiones Activas",
        accessorKey: "conn_metric",
        cell: ({ row }) => {
            return <MetricsCell
                data={row.original.metrics}
                primaryMetric="ActiveConnectionCount Average"
                globalTotal={globalMetrics.totalActiveConnectionCount}
                type="connection"
            />
        },

    },
    {
        header: "Reseteos de clientes TCP",
        accessorKey: "tcp_reset",
        cell: ({ row }) => {
            const totalTcpReset = globalMetrics.totalTcpReset;
            return <MetricsCell
                data={row.original.metrics}
                primaryMetric="TCP_Client_Reset_Count Average"
                globalTotal={totalTcpReset}
                type="error"
            />
        },

    },
    {
        header: "Errores",
        accessorKey: "error_metric",
        cell: ({ row }) => {
            const totalErrors = globalMetrics.totalTarget5xx;
            return <MetricsCell
                data={row.original.metrics}
                primaryMetric="HTTPCode_Target_5XX_Count Average"
                globalTotal={totalErrors}
                type="error"
            />
        },
    },
    {
        header: "Facturación",
        accessorKey: "billing_action",
        cell: ({ row }) => {
            return <ResourceBillingActionCell resourceId={row.original.resource} />;
        }
    }
];