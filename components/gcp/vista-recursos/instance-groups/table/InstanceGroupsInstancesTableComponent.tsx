'use client'

import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { History, Layers, Server } from 'lucide-react';
import { useMemo, useState } from 'react';
import { InstanceGroupsInstances } from '@/interfaces/vista-compute-engine/cEInterfaces';
import {
    getInstanceGroupsInstancesColumns,
    ProcessedInstanceRow
} from './InstanceGroupsInstancesColumns';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface InstanceGroupsInstancesTableProps {
    data: InstanceGroupsInstances[];
}

// Misma función de formateo para asegurar consistencia
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

export const InstanceGroupsInstancesTableComponent = ({ data }: InstanceGroupsInstancesTableProps) => {
    const [selectedInstance, setSelectedInstance] = useState<InstanceGroupsInstances | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const processedData = useMemo<ProcessedInstanceRow[]>(() => {
        if (!data || data.length === 0) return [];

        return data.map(instance => {
            const sortedHistory = [...(instance.instance_data || [])].sort((a, b) =>
                new Date(b.sync_time).getTime() - new Date(a.sync_time).getTime()
            );

            const latest = sortedHistory[0];

            return {
                ...instance,
                latestSnapshot: latest,
                sync_time: latest?.sync_time,
                creationTimestamp: latest?.creationTimestamp
            };
        });
    }, [data]);

    const stats = useMemo(() => {
        return {
            totalInstances: processedData.length,
            runningInstances: processedData.filter(i => i.latestSnapshot?.status === 'RUNNING').length
        };
    }, [processedData]);

    const handleHistoryClick = (instance: ProcessedInstanceRow) => {
        setSelectedInstance(instance);
        setIsDialogOpen(true);
    };

    const columns = useMemo(() =>
        createColumns(getInstanceGroupsInstancesColumns(handleHistoryClick)),
        []);

    const sortedHistoryData = useMemo(() => {
        if (!selectedInstance) return [];
        return [...(selectedInstance.instance_data || [])].sort((a, b) =>
            new Date(b.sync_time).getTime() - new Date(a.sync_time).getTime()
        );
    }, [selectedInstance]);

    return (
        <>
            <Card className="w-full overflow-hidden border-none shadow-none">
                <CardHeader className="border-b bg-muted/10 pb-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Layers className="h-5 w-5 text-blue-600" />
                                Historial de Instancias
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Instancias generadas por instance group en el periodo seleccionado.
                            </p>
                        </div>

                        {/* <div className="flex items-center gap-6 bg-background/80 p-2 px-4 rounded-full border border-border/50 shadow-sm">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total</span>
                                <span className="text-base font-bold text-foreground font-mono">
                                    {stats.totalInstances}
                                </span>
                            </div>
                            <div className="h-8 w-px bg-border" />
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Running</span>
                                <span className="text-base font-bold text-emerald-600 font-mono">
                                    {stats.runningInstances}
                                </span>
                            </div>
                        </div> */}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {processedData.length > 0 ? (
                        <div className="p-4">
                            <DataTableGrouping
                                columns={columns}
                                data={processedData}
                                filterColumn="resource_name"
                                filterPlaceholder="Buscar por nombre de instancia..."
                                enableGrouping={false}
                                pageSizeItems={10}
                                initialSorting={[{ id: 'resource_name', desc: false }]}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Server className="h-10 w-10 mb-2 opacity-20" />
                            <p>No se encontraron instancias.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="min-w-5xl max-h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <History className="h-5 w-5 text-blue-500" />
                            Historial de Instancia
                        </DialogTitle>
                        <DialogDescription>
                            <span className="font-semibold text-foreground">
                                {selectedInstance?.resource_name}
                            </span>
                            <span className="mx-2 text-muted-foreground">|</span>
                            <span className="font-mono text-xs">{selectedInstance?.resource_id}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-auto border rounded-md mt-4">
                        <Table>
                            <TableHeader className="bg-muted/50 sticky top-0">
                                <TableRow>
                                    <TableHead>Fecha Sincronización</TableHead>
                                    <TableHead>Fecha Creación</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>IP Interna</TableHead>
                                    <TableHead>Zona</TableHead>
                                    <TableHead>Máquina</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedHistoryData.length > 0 ? (
                                    sortedHistoryData.map((snapshot, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-mono text-xs whitespace-nowrap">
                                                {formatDate(snapshot.sync_time)}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs whitespace-nowrap text-muted-foreground">
                                                {formatDate(snapshot.creationTimestamp)}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium
                                                    ${snapshot.status === 'RUNNING' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                        snapshot.status === 'TERMINATED' ? 'bg-red-50 text-red-700 border-red-200' :
                                                            'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                    {snapshot.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-xs font-mono">
                                                {snapshot.networkInterfaces?.[0]?.networkIP || '-'}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {snapshot.location?.split('/').pop() || '-'}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {snapshot.machineType?.split('/').pop() || '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No hay datos históricos disponibles.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};