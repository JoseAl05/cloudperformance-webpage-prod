'use client'

import { useMemo } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VM {
    name: string;
    tipo_vm: string;
    machine_type_simple: string;
    region: string;
    zona: string;
    status: string;
    labels?: Record<string, string>;
    es_candidata_spot: boolean;
    cost_in_usd: number;
    costo_por_hora: number;
    tiene_billing: boolean;
    sync_time: { $date: string };
}

interface SpotVsStandardTableProps {
    data: VM[];
    startDate?: string;
    endDate?: string;
}

export const SpotVsStandardTable = ({ data, startDate, endDate }: SpotVsStandardTableProps) => {
    
    // Flatten data: cada fila es una VM con su fecha
    const flattenedData = useMemo(() => {
        return data.map(vm => ({
            sync_time: new Date(vm.sync_time.$date).toISOString(),
            sync_time_formatted: new Date(vm.sync_time.$date).toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }),
            name: vm.name,
            tipo_vm: vm.tipo_vm,
            machine_type_simple: vm.machine_type_simple,
            zona: vm.zona,
            gke_cluster: vm.labels?.['goog-k8s-cluster-name'] || '-',
            es_candidata_spot: vm.es_candidata_spot,
            costo_por_hora: vm.costo_por_hora,
            tiene_billing: vm.tiene_billing,
            ahorro_potencial_spot: vm.ahorro_potencial_spot || 0 
        }));
    }, [data]);

    const getTipoBadge = (tipo: string) => {
        if (tipo === 'SPOT') return <Badge className="bg-purple-100 text-purple-700 text-xs">SPOT</Badge>;
        if (tipo === 'PREEMPTIBLE') return <Badge className="bg-pink-100 text-pink-700 text-xs">PREEMPTIBLE</Badge>;
        return <Badge className="bg-blue-100 text-blue-700 text-xs">STANDARD</Badge>;
    };

    const columns: ColumnDef<typeof flattenedData[0]>[] = [
        {
            accessorKey: "sync_time_formatted",
            header: "Fecha",
            cell: (info) => (
                <span className="text-sm">{info.getValue() as string}</span>
            )
        },
        {
            accessorKey: "name",
            header: "VM Name",
            cell: (info) => (
                <span className="text-sm font-mono">{info.getValue() as string}</span>
            )
        },
        {
            accessorKey: "tipo_vm",
            header: "Tipo",
            cell: (info) => getTipoBadge(info.getValue() as string)
        },
        {
            accessorKey: "es_candidata_spot",
            header: "Oportunidad",
            cell: (info) => 
                info.getValue() ? (
                    <Badge className="bg-amber-100 text-amber-700 text-xs">
                        Candidata Spot
                    </Badge>
                ) : null
        },
        {
            accessorKey: "costo_por_hora",
            header: "Costo/Hora",
            cell: ({ row }) => 
                row.original.tiene_billing ? (
                    <span className="text-sm font-semibold">
                        ${row.original.costo_por_hora.toFixed(4)}/h
                    </span>
                ) : (
                    <span className="text-xs text-amber-600">Sin billing</span>
                )
        }, 
        {
            accessorKey: "ahorro_potencial_spot",
            header: "Ahorro Potencial",
            cell: ({ row }) => 
                row.original.es_candidata_spot && row.original.ahorro_potencial_spot > 0 ? (
                    <span className="text-sm font-semibold text-green-600">
                        ${row.original.ahorro_potencial_spot.toFixed(2)}/mes
                    </span>
                ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                )
        },                
        {
            accessorKey: "machine_type_simple",
            header: "Machine Type",
            cell: (info) => (
                <span className="text-sm">{info.getValue() as string}</span>
            )
        },       
        {
            accessorKey: "zona",
            header: "Zona",
            cell: (info) => (
                <span className="text-sm text-muted-foreground">{info.getValue() as string}</span>
            )
        },
        {
            accessorKey: "gke_cluster",
            header: "GKE Cluster",
            cell: (info) => (
                <span className="text-xs text-muted-foreground">{info.getValue() as string}</span>
            )
        }
    ];

    if (!data || data.length === 0) {
        return (
            <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                    <p>No hay VMs para mostrar con los filtros aplicados.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            💻 Historial Spot vs Standard VMs
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Instancias agrupadas por fecha de sincronización
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <DataTableGrouping
                    columns={columns}
                    data={flattenedData}
                    filterColumn="name"
                    filterPlaceholder="Buscar instancia..."
                    enableGrouping={true}
                    groupByColumn="sync_time_formatted"
                    pageSizeItems={10}
                />

                <div className="border-t bg-muted/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Mostrando {flattenedData.length} instancias
                        </div>
                        {startDate && endDate && (
                            <div className="text-sm text-muted-foreground">
                                Período: {startDate} - {endDate}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};