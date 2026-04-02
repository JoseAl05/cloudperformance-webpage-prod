'use client'

import { DynamicColumn } from '@/components/data-table/columns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Server, ArrowDown, ArrowUp } from 'lucide-react';
import { useState } from 'react';
import { HistoryModal, HistoryModalTab } from '@/components/general_gcp/modal/HistoryModal';
import { Ec2InfoView, Ec2TagsView, Ec2MetricasView, Ec2RecomendacionView } from '@/components/aws/vista-consumos/ec2/info/Ec2InstancesConsumeInsightModalComponent';
import { ConsumeViewEc2InfoInstances, ConsumeViewEc2InfoInstancesHistory } from '@/interfaces/ec2ConsumeViewInterfaces';

export interface Ec2TableRow extends ConsumeViewEc2InfoInstancesHistory {
    _instance: ConsumeViewEc2InfoInstances;
    InstanceId: string;
    sort_cpu: number;
    sort_netinout: number;
    sort_billing: number;
}

const CPUCell = ({ cpu, maxCpu }: { cpu: number; maxCpu: number }) => {
    const percentage = maxCpu > 0 ? (cpu / maxCpu) * 100 : 0;
    const barColor = cpu < 5 ? "bg-red-600" : cpu < 20 ? "bg-amber-500" : "bg-green-500";

    return (
        <div className="flex flex-col w-full min-w-[120px] gap-1">
            <div className="flex justify-between items-end text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">
                    {cpu.toFixed(2)} <span className="text-[10px] font-normal text-muted-foreground">%</span>
                </span>
                <span className="text-[10px] text-muted-foreground opacity-80">
                    Max: {maxCpu.toFixed(2)}
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

const ClasificacionCell = ({ row }: { row: Ec2TableRow }) => {
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

const StatusCell = ({ status }: { status: string }) => {
    const color = status === 'running' ? 'bg-green-100 text-green-700' :
        status === 'stopped' || status === 'terminated' ? 'bg-gray-100 text-gray-700' :
            'bg-yellow-100 text-yellow-700';
    return (
        <Badge className={`${color} text-[10px] hover:${color}`}>
            {status}
        </Badge>
    );
};

const NetworkCell = ({ ingress, egress }: { ingress: number, egress: number }) => {
    const format = (v: number) => {
        if (v > 1024 * 1024) return `${(v / (1024 * 1024)).toFixed(1)} MB/s`;
        if (v > 1024) return `${(v / 1024).toFixed(1)} KB/s`;
        return `${v.toFixed(0)} B/s`;
    };

    return (
        <div className="flex flex-col gap-0.5 text-xs">
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <ArrowDown className="w-3 h-3 text-green-500" />
                <span>{format(ingress)}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <ArrowUp className="w-3 h-3 text-blue-500" />
                <span>{format(egress)}</span>
            </div>
        </div>
    );
};

const DetailsCell = ({ row }: { row: Ec2TableRow }) => {
    const [isOpen, setIsOpen] = useState(false);

    const instanciaTabs: HistoryModalTab[] = [
        {
            value: "info",
            label: "Información",
            content: <Ec2InfoView data={row._instance} />
        },
        {
            value: "metricas",
            label: "Métricas",
            content: <Ec2MetricasView data={row._instance} />
        },
        {
            value: "labels",
            label: "Tags",
            content: <Ec2TagsView data={row._instance} />
        },
        {
            value: "recomendacion",
            label: "Recomendación",
            content: <Ec2RecomendacionView data={row._instance} />
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
                region={row.availability_zone}
                resourceType="EC2 Instance"
                tabs={instanciaTabs}
            />
        </>
    );
};

export const getEc2ConsumeColumns = (maxCpu: number, maxCost: number): DynamicColumn<Ec2TableRow>[] => [
    {
        header: "Instancia",
        accessorKey: "InstanceId",
        cell: ({ row }) => (
            <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800">
                        <Server className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div className='flex flex-col'>
                        <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 truncate max-w-[180px]" title={row.original.InstanceId}>
                            {row.original.InstanceId}
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
        header: "Estado",
        accessorKey: "status",
        cell: (info) => <StatusCell status={info.getValue() as string} />,
        size: 150
    },
    {
        header: "Región",
        accessorKey: "availability_zone",
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
        id: "sort_cpu",
        header: "CPU Promedio",
        accessorKey: "sort_cpu",
        cell: ({ row }) => <CPUCell cpu={row.original.avg_cpu_utilization} maxCpu={maxCpu} />,
        size: 180
    },
    {
        header: "Red (In/Out)",
        accessorKey: "sort_netinout",
        cell: ({ row }) => (
            <NetworkCell
                ingress={row.original.avg_network_in}
                egress={row.original.avg_network_out}
            />
        ),
        size: 150
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