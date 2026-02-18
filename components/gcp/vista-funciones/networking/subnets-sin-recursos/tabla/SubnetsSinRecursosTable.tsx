'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { ColumnDef } from '@tanstack/react-table';

interface Subnet {
    name: string;
    region: string;
    network: string;
    ip_cidr_range: string;
    purpose: string;
    state: string;
    has_secondary_ranges: boolean;
    enable_flow_logs: boolean;
    dias_desde_creacion: number;
    sync_time: { $date: string };
}

interface SubnetsSinRecursosTableProps {
    data: Subnet[];
    dateFrom: Date;
    dateTo: Date;
}

export const SubnetsSinRecursosTable = ({ data, dateFrom, dateTo }: SubnetsSinRecursosTableProps) => {
    const flattenedData = useMemo(() => {
        return data.map(subnet => {
            // Calcular IPs disponibles desde CIDR
            const cidrSuffix = parseInt(subnet.ip_cidr_range.split('/')[1]);
            const ipsDisponibles = Math.pow(2, 32 - cidrSuffix);

            return {
                sync_time: new Date(subnet.sync_time.$date).toISOString(),
                sync_time_formatted: new Date(subnet.sync_time.$date).toLocaleDateString('es-ES'),
                name: subnet.name,
                region: subnet.region,
                network: subnet.network,
                ip_cidr_range: subnet.ip_cidr_range,
                ips_disponibles: ipsDisponibles,
                purpose: subnet.purpose,
                state: subnet.state,
                has_secondary_ranges: subnet.has_secondary_ranges,
                enable_flow_logs: subnet.enable_flow_logs,
                dias_desde_creacion: subnet.dias_desde_creacion
            };
        });
    }, [data]);

    const columns: ColumnDef<typeof flattenedData[0]>[] = [
        {
            accessorKey: "sync_time_formatted",
            header: "Fecha",
            cell: ({ row }) => (
                <span className="text-sm font-medium">
                    {row.original.sync_time_formatted}
                </span>
            ),
        },
        {
            accessorKey: "name",
            header: "Subnet Name",
            cell: ({ row }) => (
                <span className="font-mono text-sm">
                    {row.original.name}
                </span>
            ),
        },
        {
            accessorKey: "region",
            header: "Región",
            cell: ({ row }) => (
                <span className="text-sm">
                    {row.original.region}
                </span>
            ),
        },
        {
            accessorKey: "network",
            header: "Red",
            cell: ({ row }) => (
                <span className={`text-sm font-medium ${
                    row.original.network === 'default' ? 'text-red-600' : 'text-blue-600'
                }`}>
                    {row.original.network}
                </span>
            ),
        },
        {
            accessorKey: "ip_cidr_range",
            header: "CIDR Range",
            cell: ({ row }) => (
                <span className="font-mono text-sm text-blue-600 dark:text-blue-400">
                    {row.original.ip_cidr_range}
                </span>
            ),
        },
        {
            accessorKey: "ips_disponibles",
            header: "IPs Disponibles",
            cell: ({ row }) => (
                <span className="text-sm font-semibold text-amber-600">
                    {row.original.ips_disponibles.toLocaleString('es-ES')}
                </span>
            ),
        },
        {
            accessorKey: "purpose",
            header: "Purpose",
            cell: ({ row }) => (
                <Badge 
                    variant={row.original.purpose === 'PRIVATE' ? 'default' : 'secondary'}
                    className="text-xs"
                >
                    {row.original.purpose}
                </Badge>
            ),
        },
        {
            accessorKey: "dias_desde_creacion",
            header: "Días sin Uso",
            cell: ({ row }) => (
                <span className={`text-sm font-semibold ${
                    row.original.dias_desde_creacion > 60 ? 'text-red-600' : 
                    row.original.dias_desde_creacion > 30 ? 'text-amber-600' : 'text-green-600'
                }`}>
                    {row.original.dias_desde_creacion.toFixed(0)} días
                </span>
            ),
        },
        {
            accessorKey: "enable_flow_logs",
            header: "Flow Logs",
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    {row.original.enable_flow_logs ? (
                        <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                            ✓ Habilitado
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="text-xs border-red-200 text-red-700">
                            ✗ Deshabilitado
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "has_secondary_ranges",
            header: "Acción Recomendada",
            cell: ({ row }) => {
                const isDefault = row.original.network === 'default';
                const oldSubnet = row.original.dias_desde_creacion > 60;
                
                let recommendation = "Monitorear";
                let colorClass = "text-blue-600";
                
                if (isDefault && oldSubnet) {
                    recommendation = "Eliminar + Recrear VPC";
                    colorClass = "text-red-600";
                } else if (isDefault) {
                    recommendation = "Revisar y Migrar";
                    colorClass = "text-amber-600";
                } else if (oldSubnet) {
                    recommendation = "Considerar Eliminación";
                    colorClass = "text-orange-600";
                }

                return (
                    <span className={`text-xs font-medium ${colorClass}`}>
                        {recommendation}
                    </span>
                );
            },
        },
    ];

    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Detalle de Subnets sin Recursos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        No hay subnets sin recursos en el período seleccionado.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Detalle de Subnets sin Recursos</CardTitle>
            </CardHeader>
            <CardContent>
                <DataTableGrouping
                    data={flattenedData}
                    columns={columns}
                    enableGrouping={true}
                    groupByColumn="sync_time_formatted"
                    footerText={`Total: ${data.length} subnets sin uso | Período: ${dateFrom.toLocaleDateString('es-ES')} - ${dateTo.toLocaleDateString('es-ES')}`}
                />
            </CardContent>
        </Card>
    );
};