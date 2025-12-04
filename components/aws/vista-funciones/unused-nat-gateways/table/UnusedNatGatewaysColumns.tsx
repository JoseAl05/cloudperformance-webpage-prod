'use client'

import { Badge } from '@/components/ui/badge';
import { DynamicColumn } from '@/components/general/data-table/columns';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { UnusedNatGateways } from '@/interfaces/vista-unused-resources/unusedNatGatewaysInterfaces';
import { UnusedNatGatewaysInsightModal } from '@/components/aws/vista-funciones/unused-nat-gateways/info/UnusedNatGatewaysInsightModal';
import useSWR from 'swr';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { bytesToMB } from '@/lib/bytesToMbs';

// --- NUEVA INTERFAZ EXPORTADA ---
export interface GlobalNatStats {
    avgGlobalConnections: number;
    totalGlobalBytes: number;
}

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

// --- FUNCIÓN ACTUALIZADA CON globalStats ---
export const getUnusedNatGwColumns = (
    dateFrom: string,
    dateTo: string,
    globalStats: GlobalNatStats // Recibimos las estadísticas globales aquí
): DynamicColumn<UnusedNatGateways>[] => [
        {
            header: "Nombre / ID",
            accessorKey: "nat_gw_id",
            cell: (info) => {
                const val = info.getValue() as string;
                const { startDateParam, endDateParam, keyParam, valueParam, regionParam } = GetParameters();
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
        // --- NUEVA COLUMNA: Conexiones ---
        {
            header: "Conexiones (vs Global)",
            accessorKey: "diagnosis.metrics_summary.avg_active_connections",
            cell: (info) => {
                const val = info.getValue() as number;
                const globalAvg = globalStats.avgGlobalConnections;

                // Calculamos el porcentaje relativo al promedio
                const percentage = globalAvg > 0 ? (val / globalAvg) * 100 : 0;
                const isAboveAverage = val > globalAvg;

                return (
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm">
                            {val !== undefined ? val.toFixed(2) : '0.00'}
                        </span>
                        <span className={`text-[10px] flex items-center gap-1 ${isAboveAverage ? 'text-amber-600' : 'text-slate-500'}`}>
                            {globalAvg > 0 ? (
                                <>
                                    {Math.abs(percentage).toFixed(0)}% del prom.
                                </>
                            ) : 'Sin datos globales'}
                        </span>
                    </div>
                );
            }
        },
        // --- NUEVA COLUMNA: Tráfico ---
        {
            header: "Tráfico (vs Total)",
            accessorKey: "diagnosis.metrics_summary.total_bytes_out",
            cell: (info) => {
                const val = info.getValue() as number || 0;
                const totalGlobal = globalStats.totalGlobalBytes;
                const valMB = bytesToMB(val);

                // Calculamos cuánto aporta este recurso al total global
                const contributionPercentage = totalGlobal > 0 ? (val / totalGlobal) * 100 : 0;

                return (
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm">
                            {valMB} MB
                        </span>
                        <span className="text-[10px] text-slate-500">
                            {contributionPercentage < 0.01 && contributionPercentage > 0
                                ? '< 0.1%'
                                : `${contributionPercentage.toFixed(1)}% del total`
                            }
                        </span>
                    </div>
                );
            }
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