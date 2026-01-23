'use client'

import { DynamicColumn } from '@/components/data-table/columns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, HardDrive } from 'lucide-react';
import { useState } from 'react';

import { HistoryModal, HistoryModalTab } from '@/components/general_gcp/modal/HistoryModal';
import { DiscoInfoView, DiscoLabelsView, DiscoRecomendacionView } from '../info/DiscosPersistentesInsightModal';

interface DiscoRow {
    name: string;
    project_id: string;
    region: string;
    disk_type_simple: string;
    sizeGb: string;
    en_uso: boolean;
    cost_in_usd: number;
    labels: Record<string, string>;
    description?: string;
    creationTimestamp: string;
    lastDetachTimestamp?: string;
}

// Componente para costo con barra visual (FinOps)
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

// Componente para tamaño con barra visual
const SizeCell = ({ size, maxSize }: { size: number; maxSize: number }) => {
    const percentage = maxSize > 0 ? (size / maxSize) * 100 : 0;

    return (
        <div className="flex flex-col w-full min-w-[120px] gap-1">
            <div className="flex justify-between items-end text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">
                    {size} <span className="text-[10px] font-normal text-muted-foreground">GB</span>
                </span>
                <span className="text-[10px] text-muted-foreground opacity-80">
                    Max: {maxSize}
                </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-blue-600" style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
};

// Botón de detalles (después conectaremos el modal)
const DetailsCell = ({ row }: { row: DiscoRow }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const discoTabs: HistoryModalTab[] = [
        {
            value: "info",
            label: "Información",
            content: <DiscoInfoView data={row} />
        },
        {
            value: "labels",
            label: `Labels (${Object.keys(row.labels || {}).length})`,
            content: <DiscoLabelsView data={row} />
        },
        {
            value: "recomendacion",
            label: "Recomendación",
            content: <DiscoRecomendacionView data={row} />
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
                resourceType="Disco Persistente"
                tabs={discoTabs}
            />
        </>
    );
};

export const getDiscosPersistentesColumns = (maxCost: number, maxSize: number): DynamicColumn<DiscoRow>[] => [
    {
        header: "Disco",
        accessorKey: "name",
        cell: (info) => (
            <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800">
                    <HardDrive className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                </div>
                <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">
                    {info.getValue() as string}
                </span>
            </div>
        ),
        size: 200
    },
    {
        header: "Proyecto",
        accessorKey: "project_id",
        cell: (info) => (
            <Badge variant="outline" className="font-mono text-xs">
                {info.getValue() as string}
            </Badge>
        ),
        size: 150
    },
    {
        header: "Región",
        accessorKey: "region",
        cell: (info) => (
            <span className="text-xs text-muted-foreground">
                {info.getValue() as string}
            </span>
        ),
        size: 130
    },
    {
        header: "Tipo",
        accessorKey: "disk_type_simple",
        cell: (info) => {
            const type = info.getValue() as string;
            const color = type === 'pd-ssd' ? 'bg-purple-100 text-purple-700' : 
                         type === 'pd-balanced' ? 'bg-blue-100 text-blue-700' : 
                         'bg-gray-100 text-gray-700';
            return (
                <Badge className={`${color} text-xs`}>
                    {type}
                </Badge>
            );
        },
        size: 120
    },
    {
        header: "Tamaño",
        accessorKey: "sizeGb",
        cell: ({ row }) => <SizeCell size={Number(row.original.sizeGb)} maxSize={maxSize} />,
        size: 140
    },
    {
        header: "Costo Mensual",
        accessorKey: "cost_in_usd",
        cell: ({ row }) => <CostCell cost={row.original.cost_in_usd} maxCost={maxCost} />,
        size: 150
    },
    {
        header: "Estado",
        accessorKey: "en_uso",
        cell: (info) => {
            const enUso = info.getValue() as boolean;
            return (
                <Badge variant={enUso ? "default" : "destructive"}>
                    {enUso ? "En uso" : "Sin uso"}
                </Badge>
            );
        },
        size: 100
    },
    {
        id: "actions",
        header: " ",
        cell: ({ row }) => <DetailsCell row={row.original} />,
        size: 50
    }
];