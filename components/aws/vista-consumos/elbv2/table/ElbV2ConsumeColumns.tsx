'use client'

import { DynamicColumn } from '@/components/data-table/columns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Server, ArrowDown, ArrowUp } from 'lucide-react';
import { useState } from 'react';
import { HistoryModal, HistoryModalTab } from '@/components/general_gcp/modal/HistoryModal';
import { LoadbalancerV2ConsumeInfoInstances, LoadbalancerV2ConsumeInfoInstancesHistory } from '@/interfaces/vista-consumos/elbV2ConsumeViewInterfaces';
import { formatBytes } from '@/lib/bytesToMbs';
import { ElbV2InfoView, ElbV2MetricasView, ElbV2TargetGroupsView, ElbV2RecomendacionView } from '@/components/aws/vista-consumos/elbv2/info/ElbV2ConsumeInsightModalComponent';

export interface ElbV2TableRow extends LoadbalancerV2ConsumeInfoInstancesHistory {
    _instance: LoadbalancerV2ConsumeInfoInstances;
    LoadBalancerArn: string;
    sort_active_connection_count: number;
    sort_consumed_lcus: number;
    sort_processed_bytes: number;
    sort_request_count: number;
    sort_http_5xx_count: number;
    sort_billing: number;
}

const ConnectionsCell = ({ activeConnections, maxActiveConnections }: { activeConnections: number; maxActiveConnections: number }) => {
    const percentage = maxActiveConnections > 0 ? (activeConnections / maxActiveConnections) * 100 : 0;
    const barColor = activeConnections < 5 ? "bg-red-600" : activeConnections < 20 ? "bg-amber-500" : "bg-green-500";

    return (
        <div className="flex flex-col w-full min-w-[120px] gap-1">
            <div className="flex justify-between items-end text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">
                    {activeConnections.toFixed(2)} <span className="text-[10px] font-normal text-muted-foreground">Conexiones</span>
                </span>
                <span className="text-[10px] text-muted-foreground opacity-80">
                    Max: {maxActiveConnections.toFixed(2)}
                </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
};

const LcuCell = ({ lcus, maxLcus }: { lcus: number; maxLcus: number }) => {
    const percentage = maxLcus > 0 ? (lcus / maxLcus) * 100 : 0;
    const barColor = lcus < 0.1 ? "bg-red-600" : lcus < 1 ? "bg-amber-500" : "bg-green-500";

    return (
        <div className="flex flex-col w-full min-w-[120px] gap-1">
            <div className="flex justify-between items-end text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">
                    {lcus.toFixed(2)} <span className="text-[10px] font-normal text-muted-foreground">LCUs</span>
                </span>
                <span className="text-[10px] text-muted-foreground opacity-80">
                    Max: {maxLcus.toFixed(2)}
                </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
};

const Http5xxCell = ({ errors, maxErrors }: { errors: number; maxErrors: number }) => {
    const percentage = maxErrors > 0 ? (errors / maxErrors) * 100 : 0;
    const barColor = errors === 0 ? "bg-green-500" : errors < 5 ? "bg-amber-500" : "bg-red-500";

    return (
        <div className="flex flex-col w-full min-w-[120px] gap-1">
            <div className="flex justify-between items-end text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">
                    {errors.toFixed(2)} <span className="text-[10px] font-normal text-muted-foreground">Errores</span>
                </span>
                <span className="text-[10px] text-muted-foreground opacity-80">
                    Max: {maxErrors.toFixed(2)}
                </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
};

const CostCell = ({ cost, maxCost }: { cost: number; maxCost: number }) => {
    const percentage = maxCost > 0 ? (cost / maxCost) * 100 : 0;
    const barColor = cost > 50 ? "bg-red-600" : cost > 20 ? "bg-amber-500" : "bg-green-500";

    return (
        <div className="flex flex-col w-full min-w-[100px] gap-1">
            <div className="flex justify-between items-end text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">
                    ${cost.toFixed(2)} <span className="text-[10px] font-normal text-muted-foreground">USD</span>
                </span>
                <span className="text-[10px] text-muted-foreground opacity-80">
                    Max: ${maxCost.toFixed(0)}
                </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
};

const ClasificacionCell = ({ row }: { row: ElbV2TableRow }) => {
    const badges = [];

    if (row.is_idle) {
        badges.push(<Badge key="idle" variant="destructive" className="text-[10px]">Idle</Badge>);
    }
    if (row.is_underutilized) {
        badges.push(<Badge key="infra" className="bg-amber-500 text-white text-[10px]">Infrautilizada</Badge>);
    }

    if (badges.length === 0) {
        badges.push(<Badge key="ok" className="bg-green-500 text-white text-[10px]">Óptimo</Badge>);
    }

    return <div className="flex flex-wrap gap-1">{badges}</div>;
};

const DetailsCell = ({ row }: { row: ElbV2TableRow }) => {
    const [isOpen, setIsOpen] = useState(false);

    const instanciaTabs: HistoryModalTab[] = [
        {
            value: "info",
            label: "Información",
            content: <ElbV2InfoView data={row._instance} />
        },
        {
            value: "metricas",
            label: "Métricas",
            content: <ElbV2MetricasView data={row._instance} />
        },
        {
            value: "target_groups",
            label: "Target Groups",
            content: <ElbV2TargetGroupsView data={row._instance} />
        },
        {
            value: "recomendacion",
            label: "Recomendación",
            content: <ElbV2RecomendacionView data={row._instance} />
        }
    ];

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setIsOpen(true)}
            >
                <Eye className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </Button>
            <HistoryModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={row.name}
                region={row.region}
                resourceType="Load Balancer v2"
                tabs={instanciaTabs}
            />
        </>
    );
};

export const getElbV2ConsumeColumns = (
    maxActiveConnectionCount: number,
    maxConsumedLcus: number,
    maxProcessedBytes: number,
    maxHttp5xxCount: number,
    maxCost: number
): DynamicColumn<ElbV2TableRow>[] => [
    {
        header: "Load Balancer",
        accessorKey: "LoadBalancerArn",
        cell: ({ row }) => (
            <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800">
                        <Server className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div className='flex flex-col'>
                        <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 truncate max-w-[180px]" title={row.original.LoadBalancerArn}>
                            {row.original.name || 'Sin nombre'}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                            {row.original.Type} / {row.original.Scheme}
                        </span>
                    </div>
                </div>
            </div>
        ),
        size: 230
    },
    {
        header: "Región",
        accessorKey: "region",
        cell: (info) => (
            <div className="flex flex-col text-xs text-muted-foreground">
                <span>{info.getValue() as string}</span>
            </div>
        ),
        size: 130
    },
    {
        id: "sort_active_connection_count",
        header: "Conexiones Activas Promedio",
        accessorKey: "sort_active_connection_count",
        cell: ({ row }) => <ConnectionsCell activeConnections={row.original.avg_active_connection_count} maxActiveConnections={maxActiveConnectionCount} />,
        size: 180
    },
    {
        id: "sort_consumed_lcus",
        header: "LCUs Consumidos Promedio",
        accessorKey: "sort_consumed_lcus",
        cell: ({ row }) => <LcuCell lcus={row.original.avg_consumed_lcus} maxLcus={maxConsumedLcus} />,
        size: 180
    },
    {
        header: "Datos Procesados",
        accessorKey: "sort_processed_bytes",
        cell: ({ row }) => (
            <div className="flex flex-col gap-0.5 text-xs">
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <ArrowDown className="w-3 h-3 text-green-500" />
                    <span>{formatBytes(row.original.avg_processed_bytes)}</span>
                </div>
            </div>
        ),
        size: 150
    },
    {
        id: "sort_http_5xx_count",
        header: "Errores HTTP 5XX Promedio",
        accessorKey: "sort_http_5xx_count",
        cell: ({ row }) => <Http5xxCell errors={row.original.avg_http_5xx_count} maxErrors={maxHttp5xxCount} />,
        size: 180
    },
    {
        header: "Clasificación",
        accessorKey: "is_idle",
        cell: ({ row }) => <ClasificacionCell row={row.original} />,
        size: 150
    },
    {
        header: "Costo Mes",
        accessorKey: "sort_billing",
        cell: ({ row }) => (
            <CostCell
                cost={row.original.costo_usd}
                maxCost={maxCost}
            />
        ),
        size: 150
    },
    {
        header: "Sync Time",
        accessorKey: "sync_time",
        cell: (info) => {
            const syncTime = (info.getValue() as { $date: string })?.$date;
            if (!syncTime) return <span className="text-xs text-muted-foreground">-</span>;
            const dateObj = new Date(syncTime);
            return (
                <div className="flex flex-col text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {dateObj.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                        {dateObj.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            );
        },
        size: 150
    },
    {
        id: "actions",
        header: "Historial",
        cell: ({ row }) => <DetailsCell row={row.original} />,
        size: 100
    }
];