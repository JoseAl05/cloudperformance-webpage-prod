'use client'

import { DynamicColumn } from '@/components/data-table/columns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Database } from 'lucide-react';
import { useState } from 'react';
import { HistoryModal, HistoryModalTab } from '@/components/general_gcp/modal/HistoryModal';
import { 
    FilestoreInfoView, 
    FilestoreMetricasView, 
    FilestoreLabelsView, 
    FilestoreRecomendacionView 
} from './FilestoreConsumeInsightModalComponent';

/**
 * Interface basada en el JSON del endpoint de Filestore
 */
interface InstanciaFilestore {
    name: string;
    project_id: string;
    location: string;
    tier: string;
    status: string;
    total_capacity_gb: number;
    used_capacity_gb: number;
    usage_percentage: number;
    is_idle: boolean;
    is_underutilized: boolean;
    costo_usd: number;
    costo_clp: number;
    sync_time: string;
    labels: Record<string, string>;
}

/**
 * Visualización de la capacidad de almacenamiento (Usado vs Total)
 */
const CapacityCell = ({ used, total, percentage }: { used: number; total: number; percentage: number }) => {
    // Lógica FinOps: Rojo si está casi vacío (<10%) o Naranja si está casi lleno (>90%)
    const barColor = percentage < 10 ? "bg-red-500" : percentage > 90 ? "bg-orange-500" : "bg-green-500";

    return (
        <div className="flex flex-col w-full min-w-[140px] gap-1">
            <div className="flex justify-between items-end text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">
                    {percentage.toFixed(1)} <span className="text-[10px] font-normal text-muted-foreground">%</span>
                </span>
                <span className="text-[10px] text-muted-foreground opacity-80">
                    {used.toFixed(1)} / {total} GB
                </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
};

/**
 * Visualización de costos con barra relativa al máximo
 */
const CostCell = ({ usd, clp, maxCost }: { usd: number; clp: number; maxCost: number }) => {
    const percentage = maxCost > 0 ? (usd / maxCost) * 100 : 0;
    
    return (
        <div className="flex flex-col w-full min-w-[110px] gap-1">
            <div className="flex justify-between items-end text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">
                    ${usd.toFixed(2)} <span className="text-[10px] font-normal text-muted-foreground">USD</span>
                </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-green-500" style={{ width: `${percentage}%` }} />
            </div>
            <div className="text-[10px] text-muted-foreground">
                ≈ ${clp.toLocaleString('es-CL')} CLP
            </div>
        </div>
    );
};

/**
 * Clasificación semántica de la instancia
 */
const ClasificacionCell = ({ row }: { row: InstanciaFilestore }) => {
    if (row.is_idle) {
        return <Badge variant="destructive" className="text-[10px]">Zombi</Badge>;
    }
    if (row.is_underutilized) {
        return <Badge className="bg-amber-500 text-white text-[10px]">Infrautilizada</Badge>;
    }
    return <Badge className="bg-green-500 text-white text-[10px]">Óptimo</Badge>;
};

/**
 * Celda de acción que abre el modal de detalles
 */
const DetailsCell = ({ row }: { row: InstanciaFilestore }) => {
    const [isOpen, setIsOpen] = useState(false);

    const instanciaTabs: HistoryModalTab[] = [
        {
            value: "info",
            label: "Información",
            content: <FilestoreInfoView data={row} />
        },
        {
            value: "metricas",
            label: "Métricas",
            content: <FilestoreMetricasView data={row} />
        },
        {
            value: "labels",
            label: "Labels",
            content: <FilestoreLabelsView data={row} />
        },
        {
            value: "recomendacion",
            label: "Recomendación",
            content: <FilestoreRecomendacionView data={row} />
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
                region={row.location}
                resourceType="Filestore Instance"
                tabs={instanciaTabs}
            />
        </>
    );
};

/**
 * Definición de columnas para la DataTable
 */
export const getFilestoreConsumeColumns = (maxCost: number): DynamicColumn<InstanciaFilestore>[] => [
    {
        header: "Instancia Filestore",
        accessorKey: "name",
        cell: (info) => (
            <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-100 dark:border-blue-800">
                        <Database className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 truncate max-w-[180px]">
                        {info.getValue() as string}
                    </span>
                </div>
                <div className="text-[10px] text-muted-foreground pl-1">
                    {info.row.original.project_id}
                </div>
            </div>
        ),
        size: 220
    },
    {
        header: "Estado",
        accessorKey: "status",
        cell: (info) => (
            <Badge className={`${(info.getValue() as string) === 'READY' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} text-[10px]`}>
                {info.getValue() as string}
            </Badge>
        ),
        size: 90
    },
    {
        header: "Tier / Ubicación",
        accessorKey: "tier",
        cell: (info) => (
            <div className="flex flex-col text-xs text-muted-foreground">
                <span className="font-bold text-slate-600 dark:text-slate-400">{(info.getValue() as string)}</span>
                <span className="text-[10px] opacity-70">{info.row.original.location}</span>
            </div>
        ),
        size: 150
    },
    {
        header: "Uso de Capacidad",
        accessorKey: "usage_percentage",
        cell: ({ row }) => (
            <CapacityCell 
                used={row.original.used_capacity_gb} 
                total={row.original.total_capacity_gb} 
                percentage={row.original.usage_percentage} 
            />
        ),
        size: 180
    },
    {
        header: "Clasificación",
        accessorKey: "is_idle",
        cell: ({ row }) => <ClasificacionCell row={row.original} />,
        size: 140
    },
    {
        header: "Costo",
        accessorKey: "costo_usd",
        cell: ({ row }) => (
            <CostCell 
                usd={row.original.costo_usd} 
                clp={row.original.costo_clp} 
                maxCost={maxCost} 
            />
        ),
        size: 140
    },
    {
        header: "Sync Time",
        accessorKey: "sync_time",
        cell: (info) => {
            const val = info.getValue() as string;
            const dateObj = new Date(val);
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
        size: 110
    },
    {
        id: "actions",
        header: " ",
        cell: ({ row }) => <DetailsCell row={row.original} />,
        size: 50
    }
];