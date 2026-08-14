'use client'

import { DynamicColumn } from '@/components/data-table/columns';
import { Button } from '@/components/ui/button';
import { Eye, Database } from 'lucide-react';
import { useState } from 'react';
import { HistoryModal, HistoryModalTab } from '@/components/general_gcp/modal/HistoryModal';
import { AzureDbInstanciaData, AzureDbInfoView, AzureDbMetricasView, AzureDbRecomendacionView } from './AzureDbInsightModal';

const ActionCell = ({ row }: { row: { original: AzureDbInstanciaData } }) => {
    const [isOpen, setIsOpen] = useState(false);
    const tabs: HistoryModalTab[] = [
        { value: "info", label: "Información", content: <AzureDbInfoView data={row.original} /> },
        { value: "metricas", label: "Métricas", content: <AzureDbMetricasView data={row.original} /> },
        { value: "recomendacion", label: "Recomendación", content: <AzureDbRecomendacionView data={row.original} /> }
    ];
    return (
        <>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
                <Eye className="h-4 w-4 text-slate-500" />
            </Button>
            <HistoryModal isOpen={isOpen} onClose={() => setIsOpen(false)} title={row.original.name} region={row.original.region_name} resourceType="Azure Database" tabs={tabs} />
        </>
    );
};

export const getAzureDbColumns = (): DynamicColumn<AzureDbInstanciaData>[] => [
    {
        header: "Base de Datos",
        accessorKey: "name",
        cell: (info) => (
            <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800">
                        <Database className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 truncate max-w-[180px]" title={info.getValue() as string}>
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
        header: "Región",
        accessorKey: "region_name",
        cell: (info) => <span className="text-xs text-muted-foreground">{info.getValue() as string}</span>,
        size: 100
    },
    {
        header: "CPU %",
        accessorKey: "avg_cpu_utilization",
        cell: ({ row }) => <span>{row.original.avg_cpu_utilization.toFixed(1)}%</span>,
        size: 120
    },
    {
        header: "Memoria %",
        accessorKey: "avg_memory_utilization",
        cell: (info) => <span className="font-semibold text-sm">{(info.getValue() as number).toFixed(1)}%</span>,
        size: 100
    },
    {
        header: "Storage %",
        accessorKey: "storage_utilization_pct",
        cell: ({ row }) => <span>{row.original.storage_utilization_pct.toFixed(1)}%</span>,
        size: 140
    },
    {
        header: "Costo Mensual",
        accessorKey: "costo_total_usd",
        cell: ({ row }) => <span>${row.original.costo_total_usd.toFixed(2)}</span>,
        size: 130
    },
    {
        id: "actions",
        header: " ",
        cell: ({ row }) => <ActionCell row={row} />,
        size: 50
    }
];