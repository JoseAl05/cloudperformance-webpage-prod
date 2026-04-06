'use client'

import { DynamicColumn } from '@/components/data-table/columns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Server, ArrowDown, ArrowUp } from 'lucide-react';
import { useState } from 'react';
import { HistoryModal, HistoryModalTab } from '@/components/general_gcp/modal/HistoryModal';
import { NatGatewayConsumeInfoInstances, NatGatewayConsumeInfoInstancesHistory } from '@/interfaces/vista-consumos/natGwConsumeViewInterfaces';
import { formatBytes } from '@/lib/bytesToMbs';
import { NatGwInfoView, NatGwMetricasView, NatGwRecomendacionView, NatGwTagsView } from '@/components/aws/vista-consumos/nat-gateways/info/NatGatewaysConsumeInsightModalComponent';

export interface NatGwTableRow extends NatGatewayConsumeInfoInstancesHistory {
    _instance: NatGatewayConsumeInfoInstances;
    NatGatewayId: string;
    sort_active_connections: number;
    sort_bytes_in: number;
    sort_bytes_out: number;
    sort_error_port_allocation: number;
    sort_billing: number;
}

const ConnectionsCell = ({ activeConnections, maxActiveConnections }: { activeConnections: number; maxActiveConnections: number }) => {
    const percentage = maxActiveConnections > 0 ? (activeConnections / maxActiveConnections) * 100 : 0;
    const barColor = activeConnections < 5 ? "bg-red-600" : activeConnections < 20 ? "bg-amber-500" : "bg-green-500";
    console.log(activeConnections)
    console.log(maxActiveConnections)

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

const ErrorPortAllocationCell = ({ errorPortAllocation, maxErrorPortAllocation }: { errorPortAllocation: number; maxErrorPortAllocation: number }) => {
    const percentage = maxErrorPortAllocation > 0 ? (errorPortAllocation / maxErrorPortAllocation) * 100 : 0;
    const barColor = errorPortAllocation < 5 ? "bg-amber-500" : "bg-red-500";

    return (
        <div className="flex flex-col w-full min-w-[120px] gap-1">
            <div className="flex justify-between items-end text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">
                    {errorPortAllocation.toFixed(2)} <span className="text-[10px] font-normal text-muted-foreground">Errores</span>
                </span>
                <span className="text-[10px] text-muted-foreground opacity-80">
                    Max: {maxErrorPortAllocation.toFixed(2)}
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

const ClasificacionCell = ({ row }: { row: NatGwTableRow }) => {
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


const NetworkCell = ({ ingress, egress }: { ingress: number, egress: number }) => {

    return (
        <div className="flex flex-col gap-0.5 text-xs">
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <ArrowDown className="w-3 h-3 text-green-500" />
                <span>{formatBytes(ingress)}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <ArrowUp className="w-3 h-3 text-blue-500" />
                <span>{formatBytes(egress)}</span>
            </div>
        </div>
    );
};

const DetailsCell = ({ row }: { row: NatGwTableRow }) => {
    const [isOpen, setIsOpen] = useState(false);

    const instanciaTabs: HistoryModalTab[] = [
        {
            value: "info",
            label: "Información",
            content: <NatGwInfoView data={row._instance} />
        },
        {
            value: "metricas",
            label: "Métricas",
            content: <NatGwMetricasView data={row._instance} />
        },
        {
            value: "labels",
            label: "Tags",
            content: <NatGwTagsView data={row._instance} />
        },
        {
            value: "recomendacion",
            label: "Recomendación",
            content: <NatGwRecomendacionView data={row._instance} />
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
                resourceType="Nat Gateways"
                tabs={instanciaTabs}
            />
        </>
    );
};

export const getNatGwConsumeColumns = (maxActiveConnections: number, maxBytesIn: number, maxBytesOut: number, maxErrorPortAllocation: number, maxCost: number): DynamicColumn<NatGwTableRow>[] => [
    {
        header: "Nat Gateway",
        accessorKey: "NatGatewayId",
        cell: ({ row }) => (
            <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800">
                        <Server className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div className='flex flex-col'>
                        <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 truncate max-w-[180px]" title={row.original.InstanceId}>
                            {row.original.NatGatewayId}
                        </span>
                        <span className='text-xs text-muted-foreground bg-slate-100 rounded p-1.5 dark:bg-slate-900'>
                            {row.original.name || 'Sin nombre'}
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
                <span className="text-[10px] opacity-70">
                    {info.row.original.InstanceType}
                </span>
            </div>
        ),
        size: 130
    },
    {
        header: "Tipo de Conexión",
        accessorKey: "ConnectivityType",
        cell: (info) => (
            <div className="flex flex-col text-xs text-muted-foreground">
                <span>{info.getValue() as string}</span>
            </div>
        ),
        size: 130
    },
    {
        id: "sort_active_connections",
        header: "Conexiones Activas Promedio",
        accessorKey: "sort_active_connections",
        cell: ({ row }) => <ConnectionsCell activeConnections={row.original.avg_active_connections} maxActiveConnections={maxActiveConnections} />,
        size: 180
    },
    {
        header: "Datos Enviados / Datos Entregados (In/Out)",
        accessorKey: "sort_bytes_in",
        cell: ({ row }) => (
            <NetworkCell
                ingress={row.original.avg_bytes_in}
                egress={row.original.avg_bytes_out}
            />
        ),
        size: 150
    },
    {
        id: "sort_error_port_allocation",
        header: "Errores de asignacion de puertos Promedio",
        accessorKey: "sort_error_port_allocation",
        cell: ({ row }) => <ErrorPortAllocationCell errorPortAllocation={row.original.avg_error_port_allocation} maxErrorPortAllocation={maxErrorPortAllocation} />,
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