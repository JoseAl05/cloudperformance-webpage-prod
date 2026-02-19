'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { ColumnDef } from '@tanstack/react-table';
import { Trash2, Eye } from 'lucide-react';

interface ZonaDNS {
    name: string;
    dns_name: string;
    visibility: string;
    dnssec_state: string;
    clasificacion_uso: string;
    queries_por_segundo: number;
    cost_in_usd: number;
    ahorro_potencial_usd: number;
    sync_time: { $date: string };
}

interface ZonasDNSTableProps {
    data: ZonaDNS[];
    dateFrom: Date;
    dateTo: Date;
}

export const ZonasDNSTable = ({ data, dateFrom, dateTo }: ZonasDNSTableProps) => {
    const flattenedData = useMemo(() => {
        return data.map(zona => ({
            sync_time: new Date(zona.sync_time.$date).toISOString(),
            sync_time_formatted: new Date(zona.sync_time.$date).toLocaleDateString('es-ES'),
            name: zona.name,
            dns_name: zona.dns_name,
            visibility: zona.visibility,
            dnssec_state: zona.dnssec_state,
            clasificacion_uso: zona.clasificacion_uso,
            queries_por_segundo: zona.queries_por_segundo,
            cost_in_usd: zona.cost_in_usd,
            ahorro_potencial_usd: zona.ahorro_potencial_usd
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
            header: "Nombre de Zona",
            cell: ({ row }) => (
                <span className="font-mono text-sm">
                    {row.original.name}
                </span>
            ),
        },
        {
            accessorKey: "dns_name",
            header: "DNS Name",
            cell: ({ row }) => (
                <span className="font-mono text-sm text-blue-600 dark:text-blue-400">
                    {row.original.dns_name}
                </span>
            ),
        },
        {
            accessorKey: "visibility",
            header: "Visibilidad",
            cell: ({ row }) => (
                <Badge 
                    variant={row.original.visibility === 'PUBLIC' ? 'default' : 'secondary'}
                    className="text-xs"
                >
                    {row.original.visibility}
                </Badge>
            ),
        },
        {
            accessorKey: "dnssec_state",
            header: "DNSSEC",
            cell: ({ row }) => (
                <Badge 
                    variant={row.original.dnssec_state === 'on' ? 'outline' : 'secondary'}
                    className={`text-xs ${
                        row.original.dnssec_state === 'on' 
                            ? 'border-green-200 text-green-700' 
                            : 'border-red-200 text-red-700'
                    }`}
                >
                    {row.original.dnssec_state === 'on' ? '✓ ON' : '✗ OFF'}
                </Badge>
            ),
        },
        {
            accessorKey: "queries_por_segundo",
            header: "Queries/seg",
            cell: ({ row }) => (
                <span className={`text-sm font-semibold ${
                    row.original.queries_por_segundo === 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                    {row.original.queries_por_segundo.toFixed(2)}
                </span>
            ),
        },
        {
            accessorKey: "clasificacion_uso",
            header: "Clasificación",
            cell: ({ row }) => {
                const clasificacion = row.original.clasificacion_uso;
                let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
                let className = 'text-xs';
                
                switch (clasificacion) {
                    case 'SIN_USO':
                        variant = 'destructive';
                        break;
                    case 'USO_BAJO':
                        className += ' bg-amber-100 text-amber-700 border-amber-200';
                        variant = 'outline';
                        break;
                    case 'USO_MEDIO':
                        className += ' bg-blue-100 text-blue-700 border-blue-200';
                        variant = 'outline';
                        break;
                    case 'USO_ALTO':
                        className += ' bg-green-100 text-green-700 border-green-200';
                        variant = 'outline';
                        break;
                }
                
                return (
                    <Badge variant={variant} className={className}>
                        {clasificacion}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "cost_in_usd",
            header: "Costo USD",
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
            id: "accion",
            header: "Acción Recomendada",
            cell: ({ row }) => {
                const esZombie = row.original.clasificacion_uso === 'SIN_USO';
                
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
                    <CardTitle>Detalle de Zonas DNS</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        No hay zonas DNS en el período seleccionado.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Detalle de Zonas DNS</CardTitle>
            </CardHeader>
            <CardContent>
                <DataTableGrouping
                    data={flattenedData}
                    columns={columns}
                    enableGrouping={true}
                    groupByColumn="sync_time_formatted"
                    footerText={`Total: ${data.length} zonas DNS | Período: ${dateFrom.toLocaleDateString('es-ES')} - ${dateTo.toLocaleDateString('es-ES')}`}
                />
            </CardContent>
        </Card>
    );
};