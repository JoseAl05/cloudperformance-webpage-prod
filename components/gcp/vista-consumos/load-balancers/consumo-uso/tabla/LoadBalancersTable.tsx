'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { ColumnDef } from '@tanstack/react-table';
import { Trash2, Eye } from 'lucide-react';

interface LoadBalancer {
    name: string;
    region: string;
    loadBalancingScheme: string;
    IPAddress: string;
    IPProtocol: string;
    clasificacion_trafico: string;
    requests_totales: number;
    cost_in_usd: number;
    ahorro_potencial_usd: number;
    sync_time: { $date: string };
}

interface LoadBalancersTableProps {
    data: LoadBalancer[];
    dateFrom: Date;
    dateTo: Date;
}

export const LoadBalancersTable = ({ data, dateFrom, dateTo }: LoadBalancersTableProps) => {
    const flattenedData = useMemo(() => {
        return data.map(lb => ({
            sync_time: new Date(lb.sync_time.$date).toISOString(),
            sync_time_formatted: new Date(lb.sync_time.$date).toLocaleDateString('es-ES'),
            name: lb.name,
            region: lb.region,
            loadBalancingScheme: lb.loadBalancingScheme,
            IPAddress: lb.IPAddress,
            IPProtocol: lb.IPProtocol,
            clasificacion_trafico: lb.clasificacion_trafico,
            requests_totales: lb.requests_totales,
            cost_in_usd: lb.cost_in_usd,
            ahorro_potencial_usd: lb.ahorro_potencial_usd
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
            header: "Nombre",
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
            accessorKey: "loadBalancingScheme",
            header: "Esquema",
            cell: ({ row }) => {
                const scheme = row.original.loadBalancingScheme;
                let colorClass = 'bg-blue-100 text-blue-700 border-blue-200';
                
                switch (scheme) {
                    case 'EXTERNAL':
                        colorClass = 'bg-blue-100 text-blue-700 border-blue-200';
                        break;
                    case 'INTERNAL':
                        colorClass = 'bg-green-100 text-green-700 border-green-200';
                        break;
                    case 'EXTERNAL_MANAGED':
                        colorClass = 'bg-amber-100 text-amber-700 border-amber-200';
                        break;
                    case 'INTERNAL_MANAGED':
                        colorClass = 'bg-purple-100 text-purple-700 border-purple-200';
                        break;
                }
                
                return (
                    <Badge variant="outline" className={`text-xs ${colorClass}`}>
                        {scheme}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "IPProtocol",
            header: "Protocolo",
            cell: ({ row }) => (
                <Badge variant="secondary" className="text-xs">
                    {row.original.IPProtocol}
                </Badge>
            ),
        },
        {
            accessorKey: "requests_totales",
            header: "Requests",
            cell: ({ row }) => (
                <span className={`text-sm font-semibold ${
                    row.original.requests_totales === 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                    {row.original.requests_totales.toLocaleString('es-ES')}
                </span>
            ),
        },
        {
            accessorKey: "cost_in_usd",
            header: "Costo Mensual",
            cell: ({ row }) => (
                <span className="text-sm font-semibold text-blue-600">
                    ${row.original.cost_in_usd.toFixed(4)}
                </span>
            ),
        },
        {
            accessorKey: "ahorro_potencial_usd",
            header: "Ahorro Potencial",
            cell: ({ row }) => (
                row.original.ahorro_potencial_usd > 0 ? (
                    <span className="text-sm font-semibold text-green-600">
                        ${row.original.ahorro_potencial_usd.toFixed(4)}
                    </span>
                ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                )
            ),
        },
        {
            accessorKey: "clasificacion_trafico",
            header: "Estado",
            cell: ({ row }) => {
                const esZombie = row.original.clasificacion_trafico === 'SIN_TRAFICO';
                
                return (
                    <Badge 
                        variant={esZombie ? 'destructive' : 'outline'}
                        className={`text-xs ${
                            esZombie ? '' : 'border-green-200 text-green-700'
                        }`}
                    >
                        {esZombie ? 'SIN TRÁFICO' : 'ACTIVO'}
                    </Badge>
                );
            },
        },
        {
            id: "accion",
            header: "Acción Recomendada",
            cell: ({ row }) => {
                const esZombie = row.original.clasificacion_trafico === 'SIN_TRAFICO';
                
                return esZombie ? (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50"
                    >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Eliminar
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs"
                    >
                        <Eye className="w-3 h-3 mr-1" />
                        Monitorear
                    </Button>
                );
            },
        },
    ];

    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Detalle de Load Balancers</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        No hay load balancers en el período seleccionado.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Detalle de Load Balancers</CardTitle>
            </CardHeader>
            <CardContent>
                <DataTableGrouping
                    data={flattenedData}
                    columns={columns}
                    enableGrouping={true}
                    groupByColumn="sync_time_formatted"
                    footerText={`Total: ${data.length} load balancers | Período: ${dateFrom.toLocaleDateString('es-ES')} - ${dateTo.toLocaleDateString('es-ES')}`}
                />
            </CardContent>
        </Card>
    );
};