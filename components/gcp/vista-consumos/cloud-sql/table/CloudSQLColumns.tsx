'use client'

import { DynamicColumn } from '@/components/data-table/columns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Database } from 'lucide-react';
import { useState } from 'react';
//imports modal de la tabla 
import { HistoryModal, HistoryModalTab } from '@/components/general_gcp/modal/HistoryModal';
import { CloudSQLInfoView, CloudSQLMetricasView, CloudSQLLabelsView, CloudSQLRecomendacionView } from '../info/CloudSQLInsightModal';

interface InstanciaRow {
    name: string;
    db_type: string;
    region_name: string;
    avg_cpu_utilization: number;
    avg_connections: number;
    storage_utilization_pct: number;
    avg_memory_utilization: number;
    is_idle: boolean;
    is_underutilized: boolean;
    storage_inefficient: boolean;
    costo_total_usd: number;
    tiene_billing: boolean;
    tier: string;
    databaseVersion: string;
    state: string;
    createTime: string;
    avg_storage_used_gb: number;
    avg_storage_total_gb: number;
    max_cpu_utilization: number;
    max_connections: number;
    max_memory_utilization: number;
    zone: string;
    project_id: string;
    sync_time: { $date: string };
}

// Componente para CPU con barra visual
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

// Componente para Storage con barra visual
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

// Componente para costo con barra visual FinOps
const CostCell = ({ cost, maxCost, tieneBilling }: { cost: number; maxCost: number; tieneBilling: boolean }) => {
    if (!tieneBilling) {
        return (
            <div className="text-xs text-amber-600">
                Sin billing
            </div>
        );
    }

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

// Componente para clasificación (badges múltiples)
const ClasificacionCell = ({ row }: { row: InstanciaRow }) => {
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

// Botón modal de la tabla (el ojo)
const DetailsCell = ({ row }: { row: InstanciaRow }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const instanciaTabs: HistoryModalTab[] = [
        {
            value: "info",
            label: "Información",
            content: <CloudSQLInfoView data={row} />
        },
        {
            value: "metricas",
            label: "Métricas",
            content: <CloudSQLMetricasView data={row} />
        },
        {
            value: "labels",
            label: "Labels",
            content: <CloudSQLLabelsView data={row} />
        },
        {
            value: "recomendacion",
            label: "Recomendación",
            content: <CloudSQLRecomendacionView data={row} />
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
                resourceType="Cloud SQL Instance"
                tabs={instanciaTabs}
            />
        </>
    );
};

export const getCloudSQLColumns = (maxCpu: number, maxStorage: number, maxCost: number): DynamicColumn<InstanciaRow>[] => [
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
        header: "Tipo BD",
        accessorKey: "db_type",
        cell: (info) => {
            const type = info.getValue() as string;
            const color = type === 'PostgreSQL' ? 'bg-blue-100 text-blue-700' : 
                         type === 'MySQL' ? 'bg-orange-100 text-orange-700' : 
                         'bg-purple-100 text-purple-700';
            return (
                <Badge className={`${color} text-xs`}>
                    {type}
                </Badge>
            );
        },
        size: 100
    },
    {
        header: "Región",
        accessorKey: "region_name",
        cell: (info) => (
            <span className="text-xs text-muted-foreground">
                {info.getValue() as string}
            </span>
        ),
        size: 120
    },
    {
        header: "CPU %",
        accessorKey: "avg_cpu_utilization",
        cell: ({ row }) => <CPUCell cpu={row.original.avg_cpu_utilization} maxCpu={maxCpu} />,
        size: 140
    },
    {
        header: "Conexiones",
        accessorKey: "avg_connections",
        cell: (info) => (
            <span className="font-semibold text-sm">
                {(info.getValue() as number).toFixed(1)}
            </span>
        ),
        size: 100
    },
    {
        header: "Storage %",
        accessorKey: "storage_utilization_pct",
        cell: ({ row }) => <StorageCell storage={row.original.storage_utilization_pct} maxStorage={maxStorage} />,
        size: 140
    },
    {
        header: "Clasificación",
        accessorKey: "is_idle",
        cell: ({ row }) => <ClasificacionCell row={row.original} />,
        size: 150
    },
    {
        header: "Costo Mensual",
        accessorKey: "costo_total_usd",
        cell: ({ row }) => (
            <CostCell 
                cost={row.original.costo_total_usd} 
                maxCost={maxCost} 
                tieneBilling={row.original.tiene_billing}
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
            return (
                <span className="text-xs text-muted-foreground font-mono">
                    {new Date(syncTime).toLocaleString('es-ES', { 
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
            );
        },
        size: 140
    },    
    {
        id: "actions",
        header: " ",
        cell: ({ row }) => <DetailsCell row={row.original} />,
        size: 50
    }
];