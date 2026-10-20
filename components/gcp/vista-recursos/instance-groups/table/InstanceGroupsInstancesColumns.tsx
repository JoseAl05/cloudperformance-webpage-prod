'use client'

import { DynamicColumn } from '@/components/data-table/columns';
import { InstanceGroupsInstances, InstanceGroupsInstancesData } from '@/interfaces/vista-compute-engine/cEInterfaces';
import { Button } from '@/components/ui/button';
import { History, Monitor, Globe, MapPin, CalendarClock, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { readFilterParam } from '@/lib/filters';

export type ProcessedInstanceRow = InstanceGroupsInstances & {
    latestSnapshot: InstanceGroupsInstancesData | undefined;
    sync_time?: string;
    creationTimestamp?: string;
};

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

const GetParameters = () => {
    const searchParams = useSearchParams();
    const startDateParam = readFilterParam(searchParams, 'dateFrom');
    const endDateParam = readFilterParam(searchParams, 'dateTo');
    const projectParam = readFilterParam(searchParams, 'scopes');
    const regionParam = readFilterParam(searchParams, 'regions');

    return {
        startDateParam,
        endDateParam,
        projectParam,
        regionParam
    }
}

export const getInstanceGroupsInstancesColumns = (
    onHistoryClick?: (instance: ProcessedInstanceRow) => void
): DynamicColumn<ProcessedInstanceRow>[] => {
    return [
        {
            header: "Nombre de Instancia",
            accessorKey: "resource_name",
            cell: ({ row }) => {
                const { startDateParam, endDateParam, projectParam, regionParam } = GetParameters();
                return (
                    <div className="flex flex-col">
                        <Link
                            href={{ pathname: '/cloud-gcp/recursos/compute-engine', query: { startDate: startDateParam, endDate: endDateParam, resourceId: row.original.resource_id, projects: projectParam, regions: regionParam } }}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <span className="font-medium text-blue-500 flex items-center gap-2 transition-all hover:text-blue-300">
                                <Monitor className="h-4 w-4" />
                                {String(row.original.resource_name || '-')}
                            </span>
                        </Link>
                    </div>
                )
            },
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