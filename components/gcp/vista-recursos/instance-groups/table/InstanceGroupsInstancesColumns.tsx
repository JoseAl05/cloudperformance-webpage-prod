'use client'

import { DynamicColumn } from '@/components/general/data-table/columns';
import { InstanceGroupsInstances, InstanceGroupsInstancesData } from '@/interfaces/vista-compute-engine/cEInterfaces';
import { Button } from '@/components/ui/button';
import { History, Monitor, Globe, MapPin, CalendarClock, Calendar } from 'lucide-react';

export type ProcessedInstanceRow = InstanceGroupsInstances & {
    latestSnapshot: InstanceGroupsInstancesData | undefined;
    sync_time?: string;
    creationTimestamp?: string;
};

// Función unificada para formatear fechas (ISO 8601 y con Timezone Offset)
const formatDate = (value: string | undefined) => {
    if (!value) return '-';
    try {
        return new Date(value).toLocaleDateString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return value;
    }
};

const extractNameFromUrl = (url: string) => {
    if (!url) return '-';
    const parts = url.split('/');
    return parts[parts.length - 1];
};

export const getInstanceGroupsInstancesColumns = (
    onHistoryClick?: (instance: ProcessedInstanceRow) => void
): DynamicColumn<ProcessedInstanceRow>[] => {
    return [
        {
            header: "Nombre de Instancia",
            accessorKey: "resource_name",
            cell: (info) => (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                        {String(info.getValue() || '-')}
                    </span>
                </div>
            ),
            size: 220,
            enableSorting: true
        },
        {
            header: "ID Instancia",
            accessorKey: "resource_id",
            cell: (info) => (
                <div className="text-xs font-mono text-muted-foreground">
                    {String(info.getValue() || '-')}
                </div>
            ),
            size: 160,
            enableSorting: true
        },
        // {
        //     header: "Estado",
        //     accessorFn: (row) => row.latestSnapshot?.status,
        //     cell: (info) => {
        //         const status = String(info.getValue() || 'UNKNOWN');
        //         let colorClass = "bg-gray-100 text-gray-600 border-gray-200";

        //         if (status === 'RUNNING') colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
        //         if (status === 'STOPPED' || status === 'TERMINATED') colorClass = "bg-red-50 text-red-700 border-red-200";
        //         if (status === 'PROVISIONING' || status === 'STAGING') colorClass = "bg-blue-50 text-blue-700 border-blue-200";
        //         if (status === 'SUSPENDED') colorClass = "bg-amber-50 text-amber-700 border-amber-200";

        //         return (
        //             <div className={`text-[10px] px-2 py-0.5 rounded-full border font-medium w-fit ${colorClass}`}>
        //                 {status}
        //             </div>
        //         );
        //     },
        //     size: 110,
        //     enableSorting: true
        // },
        {
            header: "Tipo Máquina",
            accessorFn: (row) => row.latestSnapshot?.machineType,
            cell: (info) => (
                <div className="text-xs text-muted-foreground">
                    {extractNameFromUrl(String(info.getValue() || '-'))}
                </div>
            ),
            size: 130,
            enableSorting: true
        },
        {
            header: "Zona",
            accessorFn: (row) => row.latestSnapshot?.location,
            cell: (info) => (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {extractNameFromUrl(String(info.getValue() || '-'))}
                </div>
            ),
            size: 110,
            enableSorting: true
        },
        {
            header: "IP Interna",
            accessorFn: (row) => row.latestSnapshot?.networkInterfaces?.[0]?.networkIP,
            cell: (info) => (
                <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                    <Globe className="h-3 w-3" />
                    {String(info.getValue() || '-')}
                </div>
            ),
            size: 130
        },
        {
            header: "Fecha Creación",
            accessorKey: "creationTimestamp",
            cell: (info) => (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(String(info.getValue()))}
                </div>
            ),
            size: 150,
            enableSorting: true
        },
        {
            header: "Última Sincronización",
            accessorKey: "sync_time",
            cell: (info) => (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarClock className="h-3 w-3" />
                    {formatDate(String(info.getValue()))}
                </div>
            ),
            size: 160,
            enableSorting: true
        },
        {
            header: "Acciones",
            id: "actions",
            cell: (info) => {
                const row = info.row.original;
                return (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            onHistoryClick?.(row);
                        }}
                    >
                        <History className="h-3.5 w-3.5" />
                        Historial
                    </Button>
                );
            },
            size: 100,
            enableSorting: false
        }
    ];
};