'use client'

import { useMemo } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, FolderGit2, Cpu, TrendingUp, HardDrive, Sparkles, ArrowDownRight } from 'lucide-react';

export interface TableDetail {
    instance_name: string;
    component: string;
    sku: string;
    project_id: string;
    region: string;
    list_cost_usd: number; 
    net_paid_usd: number;
    saved_amount_usd: number;
}

interface GroupedInstance {
    name: string;
    project_id: string;
    total_list_cost: number;
    total_net_paid: number;
    total_saved: number;
    components: TableDetail[];
}

export const SpendBasedCudsTable = ({ data }: { data: TableDetail[] }) => {

    const tableData = useMemo(() => {
        const groups: Record<string, GroupedInstance> = {};
        if (!data) return [];

        data.forEach(item => {
            if (!groups[item.instance_name]) {
                groups[item.instance_name] = {
                    name: item.instance_name,
                    project_id: item.project_id || 'Desconocido',
                    total_list_cost: 0,
                    total_net_paid: 0,
                    total_saved: 0,
                    components: []
                };
            }
            groups[item.instance_name].total_list_cost += item.list_cost_usd;
            groups[item.instance_name].total_net_paid += item.net_paid_usd;
            groups[item.instance_name].total_saved += Math.abs(item.saved_amount_usd);
            groups[item.instance_name].components.push(item);
        });

        return Object.values(groups);
    }, [data]);

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 3 }).format(val);

    const columns: ColumnDef<GroupedInstance>[] = [
        {
            accessorKey: "name",
            header: "Instancia Beneficiada",
            size: 250, // Controlamos el ancho base
            cell: ({ row }) => (
                <div className="flex items-center gap-3 min-w-[180px]">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Server className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col truncate">
                        <span className="text-sm font-bold text-gray-900 truncate">{row.original.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono uppercase truncate">{row.original.project_id}</span>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "total_list_cost",
            header: () => <div className="text-right px-2">Costo OnDemand</div>,
            // Forzamos un ancho pequeño para que no se estire
            cell: ({ getValue }) => (
                <div className="text-right text-xs text-gray-400 line-through px-2 w-[100px] ml-auto">
                    {formatCurrency(getValue() as number)}
                </div>
            )
        },
        {
            accessorKey: "total_net_paid",
            header: () => <div className="text-right px-2">Costo Neto</div>,
            cell: ({ getValue, row }) => {
                const netPaid = getValue() as number;
                const isFullyCovered = netPaid <= 0; // GCP a veces marca decimales ínfimos, el <= 0 es más seguro

                return (
                    <div className="flex flex-col items-end px-2 min-w-[140px] ml-auto">
                        {isFullyCovered ? (
                            <div className="flex flex-col items-end gap-1">
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 px-2 py-0.5 text-[10px] font-bold">
                                    CUBIERTO POR CUD
                                </Badge>
                                <span className="text-[10px] text-gray-400 font-medium italic">
                                    Sin costo adicional
                                </span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-sm font-bold text-slate-800">
                                    {formatCurrency(netPaid)}
                                </span>
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[9px] leading-tight text-right">
                                    CUD INSUFICIENTE
                                </Badge>
                            </div>
                        )}
                    </div>
                );
            }
        },
        {
            accessorKey: "total_saved",
            header: () => <div className="text-right px-2">Cobertura CUD</div>,
            cell: ({ getValue }) => (
                <div className="flex justify-end px-2 w-[120px] ml-auto">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm gap-1 py-1">
                        <ArrowDownRight className="h-3 w-3" />
                        <span className="font-bold">{formatCurrency(getValue() as number)}</span>
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: "components",
            header: "SKU Beneficiados",
            // Esta columna puede ser más ancha para mostrar bien los SKUs
            cell: ({ row }) => (
                <div className="flex flex-col gap-1.5 py-2 min-w-[260px] max-w-[320px]">
                    {row.original.components.map((c, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50/50 px-2 py-1.5 rounded-md border border-gray-100">
                            <div className="flex items-center gap-2">
                                {c.component.toLowerCase().includes('core') 
                                    ? <Cpu className="h-3 w-3 text-purple-400" /> 
                                    : <HardDrive className="h-3 w-3 text-blue-400" />}
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-semibold text-gray-600 leading-tight">
                                        {c.component.split(' running')[0]}
                                    </span>
                                    <span className="text-[8px] text-gray-400 font-mono leading-tight">{c.sku}</span>
                                </div>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-emerald-600 ml-4">
                                +{formatCurrency(Math.abs(c.saved_amount_usd))}
                            </span>
                        </div>
                    ))}
                </div>
            )
        }
    ];

    return (
        <Card className="bg-white shadow-sm border rounded-2xl overflow-hidden">
            <CardHeader className="border-b bg-white px-6 py-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                            <Sparkles className="h-5 w-5 text-blue-600" />
                            Análisis de Eficiencia por Recurso
                        </CardTitle>
                        <p className="text-gray-500 text-xs">
                            Comparativa de costos reales y beneficios aplicados mediante CUD Flexible.
                        </p>
                    </div>
                    
                    {/* Indicador de Ahorro Total en estilo claro */}
                    <div className="flex flex-col items-end bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Ahorrado</span>
                        <span className="text-lg font-bold text-emerald-600">
                            {formatCurrency(tableData.reduce((acc, curr) => acc + curr.total_saved, 0))}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <DataTableGrouping
                    columns={columns}
                    data={tableData}
                    filterColumn="name"
                    filterPlaceholder="Buscar instancia..."
                    enableGrouping={true}
                    groupByColumn="project_id"
                />
            </CardContent>
        </Card>
    );
};

