'use client'

import { Badge } from '@/components/ui/badge';
import { DynamicColumn } from '@/components/general/data-table/columns';
import { Button } from '@/components/ui/button';
import { Eye, Copy, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { UnusedNatGateways } from '@/interfaces/vista-unused-resources/unusedNatGatewaysInterfaces';
import { UnusedNatGatewaysInsightModal } from '@/components/aws/vista-funciones/unused-nat-gateways/info/UnusedNatGatewaysInsightModal'; // Ruta a tu modal
import useSWR from 'swr';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const DetailsCell = ({ natGw, dateParams }: { natGw: UnusedNatGateways, dateParams: { from: string, to: string } }) => {
    const [isOpen, setIsOpen] = useState(false);

    const { data: asociatedData, isLoading } = useSWR(
        isOpen ? `/api/aws/bridge/nat_gateways/get_associated_resources?nat_gw_id=${natGw.nat_gw_id}&date_from=${dateParams.from}&date_to=${dateParams.to}` : null,
        fetcher
    );

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 cursor-pointer hover:bg-accent text-blue-600"
                onClick={() => setIsOpen(true)}
            >
                <Eye className="h-4 w-4 mr-2" />
                Ver Análisis
            </Button>

            <UnusedNatGatewaysInsightModal
                natGw={natGw}
                asociatedResources={asociatedData}
                isLoading={isLoading}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
};

const GetParameters = () => {
    const searchParams = useSearchParams();
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const keyParam = searchParams.get('selectedKey');
    const valueParam = searchParams.get('selectedValue');
    const regionParam = searchParams.get('region');

    return {
        startDateParam,
        endDateParam,
        keyParam,
        valueParam,
        regionParam
    }
}

export const getUnusedNatGwColumns = (dateFrom: string, dateTo: string): DynamicColumn<UnusedNatGateways>[] => [
    {
        header: "Nombre / ID",
        accessorKey: "nat_gw_id",
        cell: (info) => {
            const val = info.getValue() as string;
            const startDateParam = GetParameters().startDateParam;
            const endDateParam = GetParameters().endDateParam;
            const keyParam = GetParameters().keyParam;
            const valueParam = GetParameters().valueParam;
            const regionParam = GetParameters().regionParam;
            return (
                <div>
                    <Link
                        href={{ pathname: '/aws/consumos/nat_gateways', query: { startDate: startDateParam, endDate: endDateParam, natGateway: val, region: regionParam, selectedKey: keyParam, selectedValue: valueParam } }}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <div className="font-medium text-blue-500 hover:text-blue-500/80">{val}</div>
                    </Link>
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