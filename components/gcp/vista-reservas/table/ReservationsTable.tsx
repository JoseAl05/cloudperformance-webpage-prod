'use client'

import { useMemo } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Server, 
    Cpu, 
    Sparkles, 
    Clock, 
    AlertTriangle, 
    CheckCircle2, 
    MapPin
} from 'lucide-react';


export interface ReservationData {
    nombre_reserva: string;
    zona: string;
    tipo_maquina: string;
    cantidad_vms: number;
    estado: string;
    horas_inactivas: number;
    dinero_perdido_usd: number;
}

interface ReservationsTableProps {
    data: ReservationData[];
}

export const ReservationsTable = ({ data }: ReservationsTableProps) => {

    const tableData = useMemo(() => data || [], [data]);

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val);

    const columns: ColumnDef<ReservationData>[] = [
        {
            accessorKey: "nombre_reserva",
            header: "Nombre de la Reserva",
            size: 250,
            cell: ({ row }) => (
                <div className="flex items-center gap-3 min-w-[200px]">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Server className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col truncate">
                        <span className="text-sm font-bold text-gray-900 truncate">{row.original.nombre_reserva}</span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono uppercase mt-0.5">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{row.original.zona}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "zona",
            header: "Zona",
            cell: ({ getValue }) => <span className="text-sm font-medium">{getValue() as string}</span>
        },
        {
            accessorKey: "tipo_maquina",
            header: "Capacidad (Hardware)",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 min-w-[140px]">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 px-2 py-0.5 text-xs font-mono font-bold flex items-center gap-1">
                        <Cpu className="h-3 w-3" />
                        {row.original.tipo_maquina}
                    </Badge>
                    <span className="text-xs font-semibold text-gray-600">
                        x{row.original.cantidad_vms} VMs
                    </span>
                </div>
            )
        },
        {
            accessorKey: "estado",
            header: "Estado",
            cell: ({ getValue }) => {
                const status = getValue() as string;
                const isReady = status.toUpperCase() === 'READY';
                return (
                    <Badge variant="outline" className={`${isReady ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200'} text-[10px] uppercase font-bold`}>
                        {status}
                    </Badge>
                );
            }
        },
        {
            accessorKey: "horas_inactivas",
            header: () => <div className="text-right px-2">Inactividad</div>,
            cell: ({ getValue }) => {
                const horas = getValue() as number;
                const hasInactivity = horas > 0;
                
                return (
                    <div className="flex flex-col items-end px-2 min-w-[100px] ml-auto">
                        <div className="flex items-center gap-1.5">
                            {hasInactivity ? <Clock className="h-3 w-3 text-amber-500" /> : <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                            <span className={`text-sm font-bold ${hasInactivity ? 'text-amber-600' : 'text-emerald-600'}`}>
                                {horas} <span className="text-[10px] font-normal">hrs</span>
                            </span>
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: "dinero_perdido_usd",
            header: () => <div className="text-right px-2">Dinero Perdido</div>,
            cell: ({ row, getValue }) => {
                const moneyLost = getValue() as number;
                const horasInactivas = row.original.horas_inactivas;
                const isLosingMoney = moneyLost > 0;

                return (
                    <div className="flex flex-col items-end px-2 min-w-[140px] ml-auto gap-1">
                        {isLosingMoney ? (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 shadow-sm gap-1 py-1">
                                <AlertTriangle className="h-3 w-3" />
                                <span className="font-bold">{formatCurrency(moneyLost)}</span>
                            </Badge>
                        ) : (
                            <div className="flex flex-col items-end gap-1">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 shadow-sm gap-1 py-1">
                                    <CheckCircle2 className="h-3 w-3" />
                                    <span className="font-bold">{formatCurrency(0)}</span>
                                </Badge>
                                
                                {horasInactivas > 0 && (
                                    <span className="text-[9px] text-green-600 font-medium bg-green-100/50 px-2 py-0.5 rounded-full border border-green-200 animate-pulse">
                                        Cubierto por Free Tier
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                );
            }
        }
    ];

    const totalDineroPerdido = tableData.reduce((acc, curr) => acc + curr.dinero_perdido_usd, 0);

    return (
        <Card className="bg-white shadow-sm border rounded-2xl overflow-hidden">
            <CardHeader className="border-b bg-white px-6 py-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                            <Sparkles className="h-5 w-5 text-indigo-600" />
                            Detalle de Hardware Reservado
                        </CardTitle>
                        <p className="text-gray-500 text-xs">
                            Monitoreo de inactividad y penalizaciones por capacidad sin utilizar.
                        </p>
                    </div>
                    
                    <div className={`flex flex-col items-end px-4 py-2 rounded-xl border ${totalDineroPerdido > 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${totalDineroPerdido > 0 ? 'text-red-400' : 'text-green-500'}`}>
                            Penalizaciones Totales
                        </span>
                        <span className={`text-lg font-bold ${totalDineroPerdido > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(totalDineroPerdido)}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <DataTableGrouping
                    columns={columns}
                    data={tableData}
                    filterColumn="nombre_reserva"
                    filterPlaceholder="Buscar reserva por nombre..."
                    enableGrouping={true}
                    groupByColumn="zona" 
                />
            </CardContent>
        </Card>
    );
};