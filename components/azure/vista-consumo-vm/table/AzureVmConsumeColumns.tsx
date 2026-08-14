'use client'

import { DynamicColumn } from '@/components/data-table/columns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Server } from 'lucide-react';
import { useState } from 'react';
import { HistoryModal, HistoryModalTab } from '@/components/general_gcp/modal/HistoryModal'; // Ajusta la ruta a tu modal general
import {
    AzureVmInfoView,
    AzureVmLabelsView,
    AzureVmRecomendacionView,
    AzureInstanciaData
} from './AzureVmConsumeInsightModalComponent';

const CPUCell = ({ cpu, maxCpu }: { cpu: number; maxCpu: number }) => {
    const percentage = maxCpu > 0 ? (cpu / maxCpu) * 100 : 0;
    const barColor = cpu < 5 ? "bg-red-600" : cpu < 20 ? "bg-amber-500" : "bg-green-500";

    return (
        <div className="flex flex-col w-full min-w-[120px] gap-1">
            <div className="flex justify-between items-end text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">
                    {cpu.toFixed(2)} <span className="text-[10px] font-normal text-muted-foreground">%</span>
                </span>
                <span className="text-[10px] text-muted-foreground opacity-80">Max: {maxCpu.toFixed(2)}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
};

const CostCell = ({ cost, maxCost, tieneBilling }: { cost: number; maxCost: number; tieneBilling: boolean }) => {
    if (!tieneBilling) {
        return <div className="text-xs text-amber-600">Sin billing</div>;
    }
    const percentage = maxCost > 0 ? (cost / maxCost) * 100 : 0;
    const barColor = cost > 50 ? "bg-red-600" : cost > 20 ? "bg-amber-500" : "bg-green-500";

    return (
        <div className="flex flex-col w-full min-w-[100px] gap-1">
            <div className="flex justify-between items-end text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">
                    ${cost.toFixed(2)} <span className="text-[10px] font-normal text-muted-foreground">USD</span>
                </span>
                <span className="text-[10px] text-muted-foreground opacity-80">Max: ${maxCost.toFixed(0)}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
};

const ClasificacionCell = ({ row }: { row: AzureInstanciaData }) => {
    const badges = [];
    if (row.is_idle) badges.push(<Badge key="idle" variant="destructive" className="text-[10px]">Idle</Badge>);
    if (row.is_underutilized) badges.push(<Badge key="infra" className="bg-amber-500 text-white text-[10px]">Infrautilizada</Badge>);
    if (badges.length === 0) badges.push(<Badge key="ok" className="bg-green-500 text-white text-[10px]">Óptimo</Badge>);
    return <div className="flex flex-wrap gap-1">{badges}</div>;
};

const StatusCell = ({ status }: { status: string }) => {
    const color = status === 'Running' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
    return <Badge className={`${color} text-[10px] hover:${color}`}>{status}</Badge>;
};

const DetailsCell = ({ row }: { row: AzureInstanciaData }) => {
    const [isOpen, setIsOpen] = useState(false);

    const tabs: HistoryModalTab[] = [
        { value: "info", label: "Información", content: <AzureVmInfoView data={row} /> },
        { value: "tags", label: "Tags", content: <AzureVmLabelsView data={row} /> },
        { value: "recomendacion", label: "Recomendación", content: <AzureVmRecomendacionView data={row} /> }
    ];

    return (
        <>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsOpen(true)}>
                <Eye className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </Button>
            <HistoryModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={row.name}
                region={row.location}
                resourceType="Azure Virtual Machine"
                tabs={tabs}
            />
        </>
    );
};

export const getAzureVmConsumeColumns = (maxCpu: number, maxCost: number): DynamicColumn<AzureInstanciaData>[] => [
    {
        header: "Instancia",
        accessorKey: "name",
        cell: (info) => (
            <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800">
                        <Server className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 truncate max-w-[180px]" title={info.getValue() as string}>
                        {info.getValue() as string}
                    </span>
                </div>
                <div className="text-[10px] text-muted-foreground pl-1">
                    {info.row.original.project_id} {/* Resource Group */}
                </div>
            </div>
        ),
        size: 220
    },
    {
        header: "Estado",
        accessorKey: "status",
        cell: (info) => <StatusCell status={info.getValue() as string} />,
        size: 90
    },
    {
        header: "Ubicación",
        accessorKey: "location",
        cell: (info) => <span className="text-xs text-muted-foreground">{info.getValue() as string}</span>,
        size: 100
    },
    {
        header: "CPU Promedio",
        accessorKey: "avg_cpu_utilization",
        cell: ({ row }) => <CPUCell cpu={row.original.avg_cpu_utilization} maxCpu={maxCpu} />,
        size: 140
    },
    {
        header: "IOPS (Promedio)",
        accessorKey: "avg_disk_read_iops",
        cell: ({ row }) => (
            <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                <span title="IOPS Promedio">{row.original.avg_disk_read_iops.toFixed(0)} IOPS</span>
            </div>
        ),
        size: 100
    },
    {
        header: "Clasificación",
        accessorKey: "is_idle",
        cell: ({ row }) => <ClasificacionCell row={row.original} />,
        size: 140
    },
    {
        header: "Costo Mes",
        accessorKey: "costo_total_usd",
        cell: ({ row }) => <CostCell cost={row.original.costo_total_usd} maxCost={maxCost} tieneBilling={row.original.tiene_billing} />,
        size: 130
    },
    {
        id: "actions",
        header: " ",
        cell: ({ row }) => <DetailsCell row={row.original} />,
        size: 50
    }
];