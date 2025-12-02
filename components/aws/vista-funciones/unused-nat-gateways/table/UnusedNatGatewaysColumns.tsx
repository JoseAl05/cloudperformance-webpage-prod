'use client'

import { Badge } from '@/components/ui/badge';
import { DynamicColumn } from '@/components/general/data-table/columns';
import { Button } from '@/components/ui/button';
import { Eye, Copy, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { UnusedNatGateways } from '@/interfaces/vista-unused-resources/unusedNatGatewaysInterfaces';
import { UnusedNatGatewaysInsightModal } from '@/components/aws/vista-funciones/unused-nat-gateways/info/UnusedNatGatewaysInsightModal'; // Ruta a tu modal
import useSWR from 'swr';

// Fetcher simple
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Componente de celda inteligente: Carga los recursos asociados al abrir
const DetailsCell = ({ natGw, dateParams }: { natGw: UnusedNatGateways, dateParams: { from: string, to: string } }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Solo cargamos los recursos asociados si el modal está abierto (Lazy Loading)
    // Esto optimiza mucho el rendimiento inicial de la tabla
    const { data: asociatedData, isLoading } = useSWR(
        isOpen ? `/api/aws/bridge/nat_gateways/get_associated_resources?nat_gw_id=${natGw.nat_gw_id}&date_from=${dateParams.from}&date_to=${dateParams.to}` : null,
        fetcher
    );

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 hover:bg-accent text-blue-600"
                onClick={() => setIsOpen(true)}
            >
                <Eye className="h-4 w-4 mr-2" />
                Ver Análisis
            </Button>

            {/* Renderizamos el modal, pasándole la data cargada */}
            <UnusedNatGatewaysInsightModal
                natGw={natGw}
                asociatedResources={asociatedData} // Puede ser undefined mientras carga
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
};

// Necesitamos pasar las fechas a las columnas para que el DetailsCell pueda hacer el fetch
// Así que exportamos una función creadora de columnas en lugar de un array estático
export const getUnusedNatGwColumns = (dateFrom: string, dateTo: string): DynamicColumn<UnusedNatGateways>[] => [
    {
        header: "Nombre / ID",
        accessorKey: "nat_gw_id",
        cell: (info) => {
            const val = info.getValue() as string;
            const nameTag = info.row.original.details[0]?.Tags?.Name;
            return (
                <div>
                    <div className="font-medium">{nameTag || val}</div>
                    {nameTag && <div className="text-xs text-muted-foreground font-mono">{val}</div>}
                </div>
            );
        }
    },
    {
        header: "Región",
        accessorKey: "region",
        cell: (info) => (
            <Badge variant="outline">{info.getValue() as string}</Badge>
        )
    },
    {
        header: "Diagnóstico",
        accessorKey: "diagnosis.status",
        cell: (info) => (
            <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">
                {info.getValue() as string}
            </Badge>
        )
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => <DetailsCell natGw={row.original} dateParams={{ from: dateFrom, to: dateTo }} />,
        size: 140
    }
];