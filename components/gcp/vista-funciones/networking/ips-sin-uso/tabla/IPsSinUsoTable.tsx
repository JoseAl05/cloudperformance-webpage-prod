'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { ColumnDef } from '@tanstack/react-table';

interface IP {
    name: string;
    address: string;
    region: string;
    network_tier: string;
    status: string;
    is_orphaned: boolean;
    dias_reservada: number;
    costo_mensual_estimado: number;
    ahorro_potencial_usd: number;
    sync_time: { $date: string };
}

interface IPsSinUsoTableProps {
    data: IP[];
    dateFrom: Date;
    dateTo: Date;
}

export const IPsSinUsoTable = ({ data, dateFrom, dateTo }: IPsSinUsoTableProps) => {
    const flattenedData = useMemo(() => {
        return data.map(ip => ({
            sync_time: new Date(ip.sync_time.$date).toISOString(),
            sync_time_formatted: new Date(ip.sync_time.$date).toLocaleDateString('es-ES'),
            name: ip.name,
            address: ip.address,
            region: ip.region,
            network_tier: ip.network_tier,
            status: ip.status,
            is_orphaned: ip.is_orphaned,
            dias_reservada: ip.dias_reservada,
            costo_mensual_estimado: ip.costo_mensual_estimado,
            ahorro_potencial_usd: ip.ahorro_potencial_usd
        }));
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
            header: "Nombre IP",
            cell: ({ row }) => (
                <span className="font-mono text-sm">
                    {row.original.name}
                </span>
            ),
        },
        {
            accessorKey: "address",
            header: "Dirección IP",
            cell: ({ row }) => (
                <span className="font-mono text-sm text-blue-600 dark:text-blue-400">
                    {row.original.address}
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
            accessorKey: "network_tier",
            header: "Network Tier",
            cell: ({ row }) => (
                <Badge 
                    variant={row.original.network_tier === 'PREMIUM' ? 'default' : 'secondary'}
                    className="text-xs"
                >
                    {row.original.network_tier}
                </Badge>
            ),
        },
        {
            accessorKey: "dias_reservada",
            header: "Días Reservada",
            cell: ({ row }) => (
                <span className={`text-sm font-semibold ${
                    row.original.dias_reservada > 30 ? 'text-red-600' : 
                    row.original.dias_reservada > 7 ? 'text-amber-600' : 'text-green-600'
                }`}>
                    {row.original.dias_reservada.toFixed(0)} días
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: "Estado",
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <Badge 
                        variant={row.original.status === 'RESERVED' ? 'destructive' : 'secondary'}
                        className="text-xs"
                    >
                        {row.original.status}
                    </Badge>
                    {row.original.is_orphaned && (
                        <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
                            ORPHANED
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "costo_mensual_estimado",
            header: "Costo Mensual",
            cell: ({ row }) => (
                <span className="text-sm font-semibold text-blue-600">
                    ${row.original.costo_mensual_estimado.toFixed(4)}/mes
                </span>
            ),
        },
        {
            accessorKey: "ahorro_potencial_usd",
            header: "Ahorro Potencial",
            cell: ({ row }) => (
                <span className="text-sm font-semibold text-green-600">
                    ${row.original.ahorro_potencial_usd.toFixed(4)}/mes
                </span>
            ),
        },
    ];

    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Detalle de IPs sin Uso</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        No hay IPs sin uso en el período seleccionado.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Detalle de IPs sin Uso</CardTitle>
            </CardHeader>
            <CardContent>
                <DataTableGrouping
                    data={flattenedData}
                    columns={columns}
                    enableGrouping={true}
                    groupByColumn="sync_time_formatted"
                    footerText={`Total: ${data.length} IPs sin uso | Período: ${dateFrom.toLocaleDateString('es-ES')} - ${dateTo.toLocaleDateString('es-ES')}`}
                />
            </CardContent>
        </Card>
    );
};