'use client'

import { DynamicColumn } from '@/components/data-table/columns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Database } from 'lucide-react';
import { useState } from 'react';
import { HistoryModal, HistoryModalTab } from '@/components/general_gcp/modal/HistoryModal';
import { RdsConsumeViewInfoInstances, RdsConsumeViewInfoInstanceHistory } from '@/interfaces/vista-consumos/rdsConsumeViewInterfaces';
import { RdsInfoView, RdsMetricasView, RdsRecomendacionView, RdsTagsView } from '@/components/aws/vista-consumos/rds/info/RdsInfoConsumeInsightModalComponent';

export interface RdsTableRow extends RdsConsumeViewInfoInstanceHistory {
    _instance: RdsConsumeViewInfoInstances;
    sort_cpu: number;
    sort_storage: number;
    sort_cost: number;
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

const StorageCell = ({ storage, maxStorage }: { storage: number; maxStorage: number }) => {
    const percentage = maxStorage > 0 ? (storage / maxStorage) * 100 : 0;
    const barColor = storage > 80 ? "bg-red-600" : storage > 50 ? "bg-amber-500" : "bg-blue-600";

    return (
        <div className="flex flex-col w-full min-w-[120px] gap-1">
            <div className="flex justify-between items-end text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">
                    {storage.toFixed(1)} <span className="text-[10px] font-normal text-muted-foreground">%</span>
                </span>
                <span className="text-[10px] text-muted-foreground opacity-80">
                    Max: {maxStorage.toFixed(1)}
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
    const barColor = cost > 20 ? "bg-red-600" : cost > 10 ? "bg-amber-500" : "bg-green-500";

    return (
        <div className="flex flex-col w-full min-w-[130px] gap-1">
            <div className="flex justify-between items-end text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">
                    ${cost.toFixed(2)} <span className="text-[10px] font-normal text-muted-foreground">USD</span>
                </span>
                <span className="text-[10px] text-muted-foreground opacity-80">
                    Max: ${maxCost.toFixed(2)}
                </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
};

const ClasificacionCell = ({ row }: { row: RdsTableRow }) => {
    const badges = [];

    if (row.is_idle) {
        badges.push(<Badge key="idle" variant="destructive" className="text-[10px]">Idle</Badge>);
    }
    if (row.is_underutilized) {
        badges.push(<Badge key="infra" className="bg-amber-500 text-white text-[10px]">Infrautilizada</Badge>);
    }
    if (row.storage_inefficient) {
        badges.push(<Badge key="storage" className="bg-orange-500 text-white text-[10px]">Storage ineficiente</Badge>);
    }

    if (badges.length === 0) {
        badges.push(<Badge key="ok" className="bg-green-500 text-white text-[10px]">Óptimo</Badge>);
    }

    return <div className="flex flex-wrap gap-1">{badges}</div>;
};

const DetailsCell = ({ row }: { row: RdsTableRow }) => {
    const [isOpen, setIsOpen] = useState(false);

    const instanciaTabs: HistoryModalTab[] = [
        {
            value: "info",
            label: "Información",
            content: <RdsInfoView data={row._instance} />
        },
        {
            value: "metricas",
            label: "Métricas",
            content: <RdsMetricasView data={row._instance} />
        },
        {
            value: "tags",
            label: "Tags",
            content: <RdsTagsView data={row._instance} />
        },
        {
            value: "recomendacion",
            label: "Recomendación",
            content: <RdsRecomendacionView data={row._instance} />
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
                region={row.region_name}
                resourceType="Instancia RDS"
                tabs={instanciaTabs}
            />
        </>
    );
};

export const getRdsColumns = (maxCpu: number, maxStorage: number, maxCost: number): DynamicColumn<RdsTableRow>[] => [
    {
        header: "Instancia",
        accessorKey: "name",
        cell: (info) => (
            <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800">
                    <Database className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                </div>
                <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">
                    {info.getValue() as string}
                </span>
            </div>
        ),
        size: 200
    },
    {
        header: "Engine",
        accessorKey: "engine",
        cell: (info) => {
            const engine = info.getValue() as string;
            const color = engine === 'postgres' ? 'bg-blue-100 text-blue-700' :
                engine === 'mysql' ? 'bg-orange-100 text-orange-700' :
                    engine === 'mariadb' ? 'bg-teal-100 text-teal-700' :
                        'bg-purple-100 text-purple-700';
            return (
                <Badge className={`${color} text-xs`}>
                    {engine}
                </Badge>
            );
        },
        size: 200
    },
    {
        header: "Región",
        accessorKey: "region_name",
        cell: (info) => (
            <div className="flex flex-col text-xs text-muted-foreground">
                <span>{info.getValue() as string}</span>
                <span className="text-[10px] opacity-70">
                    {info.row.original.instance_class}
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
        size: 200
    },
    {
        header: "Conexiones",
        accessorKey: "avg_connections",
        cell: (info) => (
            <span className="font-semibold text-sm">
                {`${(info.getValue() as number).toFixed(2)} Conexiones`}
            </span>
        ),
        size: 150
    },
    {
        id: "sort_storage",
        header: "Storage %",
        accessorKey: "sort_storage",
        cell: ({ row }) => <StorageCell storage={row.original.strg_pct_used} maxStorage={maxStorage} />,
        size: 150
    },
    // {
    //     header: "Clasificación",
    //     accessorKey: "is_idle",
    //     cell: ({ row }) => <ClasificacionCell row={row.original} />,
    //     size: 150
    // },
    {
        id: "sort_cost",
        header: "Costo",
        accessorKey: "sort_cost",
        cell: ({ row }) => (
            <CostCell
                cost={row.original.costo_total_usd}
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
        header: " ",
        cell: ({ row }) => <DetailsCell row={row.original} />,
        size: 50
    }
];