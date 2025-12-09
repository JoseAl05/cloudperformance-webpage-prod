'use client'

import { ResourceBillingActionCell } from '@/components/aws/facturacion-recurso/table/ResourceBillingActionCell';
import { DynamicColumn } from '@/components/general_aws/data-table/columns';
import { NatGatewaysMetricsSummary, NatGatewaysMetricsSummaryMetrics } from '@/interfaces/vista-consumos/natGwConsumeViewInterfaces';
import { bytesToMB } from '@/lib/bytesToMbs';
import { formatMetric } from '@/lib/metricUtils'; // Asegúrate de tener esto importado
import { cn } from '@/lib/utils';
import {
    Activity,
    AlertTriangle,
    ArrowDownLeftFromCircle,
    ArrowUpRightFromCircle,
    CheckCircle2
} from 'lucide-react';

const formatNumber = (num: number) => new Intl.NumberFormat('es-CL', { AverageFractionDigits: 0 }).format(num);

// Definición de los totales que necesitamos
export interface NatGwGlobalMetrics {
    totalBytesOut: number;
    totalBytesIn: number;
    totalConnections: number;
    totalErrors: number;
}

interface MetricsCellProps {
    data: NatGatewaysMetricsSummaryMetrics[];
    metric_name: string;
    globalTotal: number; // El total contra el que comparamos
    type: 'out' | 'in' | 'connection' | 'error';
    unitLabel?: string;
}

const MetricsCell = ({ data, metric_name, globalTotal, type, unitLabel }: MetricsCellProps) => {
    if (!data || !Array.isArray(data)) return <span className="text-muted-foreground">-</span>;

    const metricItem = data.find(item => item.metric_name === metric_name);

    // Si no hay datos, asumimos 0
    const value = metricItem?.value || 0;

    // Calcular porcentaje de contribución al total
    const maxVal = globalTotal > 0 ? (value > globalTotal ? value : globalTotal) : (value > 0 ? value : 1);
    const percentage = globalTotal > 0 ? (value / globalTotal) * 100 : 0;

    // Highlight si contribuye más del 30%
    const isMajorContributor = percentage > 30;

    const config = {
        out: {
            icon: ArrowUpRightFromCircle,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            label: "MBs Out"
        },
        in: {
            icon: ArrowDownLeftFromCircle,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            label: "MBs In"
        },
        connection: {
            icon: Activity,
            color: "text-violet-600 dark:text-violet-400",
            bg: "bg-violet-50 dark:bg-violet-900/20",
            label: "Conns"
        },
        error: {
            icon: value > 0 ? AlertTriangle : CheckCircle2,
            color: value > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-500",
            bg: value > 0 ? "bg-red-50 dark:bg-red-900/20" : "bg-green-50 dark:bg-green-900/10",
            label: "Errs"
        }
    }[type];

    // Colores de la barra
    let progressColorClass = isMajorContributor
        ? '[&::-webkit-progress-value]:bg-orange-500 [&::-moz-progress-bar]:bg-orange-500'
        : '[&::-webkit-progress-value]:bg-blue-500 [&::-moz-progress-bar]:bg-blue-500';

    if (type === 'error') {
        progressColorClass = value > 0
            ? '[&::-webkit-progress-value]:bg-red-500 [&::-moz-progress-bar]:bg-red-500'
            : '[&::-webkit-progress-value]:bg-green-500 [&::-moz-progress-bar]:bg-green-500';
    }

    const Icon = config.icon;
    const isBytes = type === 'out' || type === 'in';

    // Formateo de valores para mostrar
    const displayValue = isBytes ? bytesToMB(value) : formatNumber(value);
    const displayTotal = isBytes ? bytesToMB(globalTotal) : formatMetric(globalTotal);

    return (
        <div className="flex flex-col w-full min-w-[140px] gap-1.5">
            <div className="flex items-center gap-2 mb-1">
                <div className={cn("p-1.5 rounded-md shrink-0", config.bg, config.color)}>
                    <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex justify-between items-baseline">
                        <span className={cn("font-mono font-semibold text-xs", value === 0 && type !== 'error' ? "text-muted-foreground" : "text-foreground")}>
                            {displayValue} <span className="text-[9px] text-muted-foreground font-sans uppercase">{unitLabel || config.label}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Barra de Progreso Nativa */}
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
                <span className="text-[9px] text-muted-foreground" title="Total Global del Grupo">
                    Total: {displayTotal}
                </span>
            </div>
        </div>
    );
}

export const getNatGatewaysConsumeColumns = (globalMetrics: NatGwGlobalMetrics): DynamicColumn<NatGatewaysMetricsSummary>[] => [
    {
        header: "Nombre/ID Nat Gateway",
        accessorKey: "resource",
        cell: ({ row, getValue }) => {
            const name = getValue() as string;
            return (
                <div className="flex flex-col py-1 max-w-[200px]">
                    <span className="font-semibold text-sm text-foreground truncate" title={name}>
                        {name}
                    </span>
                </div>
            )
        },
        size: 220
    },
    {
        header: "Localización",
        accessorKey: "resource_region",
        cell: (info) => (
            <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                {info.getValue() as string}
            </div>
        ),
        size: 100
    },
    {
        header: "Volumen Saliente",
        accessorKey: "bytes_out_metric", // key virtual
        cell: ({ row }) => {
            return <MetricsCell
                data={row.original.metrics}
                metric_name="BytesOutToDestination Average"
                globalTotal={globalMetrics.totalBytesOut}
                type="out"
            />
        },
        size: 160
    },
    {
        header: "Volumen Entrante",
        accessorKey: "bytes_in_metric", // key virtual
        cell: ({ row }) => {
            return <MetricsCell
                data={row.original.metrics}
                metric_name="BytesInFromSource Average"
                globalTotal={globalMetrics.totalBytesIn}
                type='in'
            />
        },
        size: 160
    },
    {
        header: "Conexiones Activas",
        accessorKey: "conn_metric", // key virtual
        cell: ({ row }) => {
            return <MetricsCell
                data={row.original.metrics}
                metric_name="ActiveConnectionCount Average"
                globalTotal={globalMetrics.totalConnections}
                type='connection'
            />
        },
        size: 160
    },
    {
        header: "Errores Puerto",
        accessorKey: "error_metric", // key virtual
        cell: ({ row }) => {
            console.log(row.original.metrics)
            return <MetricsCell
                data={row.original.metrics}
                metric_name="ErrorPortAllocation Average"
                globalTotal={globalMetrics.totalErrors}
                type='error'
            />
        },
        size: 160
    },
    {
        header: "Facturación",
        accessorKey: "billing_action",
        cell: ({ row }) => {
            return <ResourceBillingActionCell resourceId={row.original.resource} />;
        }
    }
];