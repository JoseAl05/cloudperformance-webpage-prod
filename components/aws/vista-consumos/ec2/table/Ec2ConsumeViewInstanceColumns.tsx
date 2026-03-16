'use client'
import { Badge } from '@/components/ui/badge';
import { DynamicColumn } from '@/components/data-table/columns';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Ec2ConsumneViewInstance } from '@/interfaces/vista-consumos/ec2ConsumeViewInterfaces';
//import { ModalResourceBillingComponent } from '@/components/aws/facturacion-recurso/info/ModalResourceBillingComponent'
//import { ResourceBillingActionCell } from '@/components/aws/facturacion-recurso/table/ResourceBillingActionCell';

const DateParams = () => {
    const searchParams = useSearchParams();

    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    return { startDateParam: startDateParam, endDateParam: endDateParam }
}



export const Ec2ConsumeViewInstanceColumns: DynamicColumn<Ec2ConsumneViewInstance>[] = [
    {
        header: "ID Instancia",
        accessorKey: "resource",
        cell: (info) => {
            const value = info.getValue() as string;
            const startDate = DateParams().startDateParam;
            const endDate = DateParams().endDateParam
            return (
                <div className="font-medium">
                    <Link
                        href={{ pathname: '/aws/recursos/instancias-ec2', query: { instance: value, startDate: startDate, endDate: endDate } }}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <Badge variant="secondary" className="ml-3 font-mono text-sm transition-all hover:scale-[1.02]">
                            {value}
                        </Badge>
                    </Link>
                </div>
            );
        }
    },
    {
        header: "Tipo",
        accessorKey: "resource_type",
        cell: (info) => (
            <div className="text-sm text-muted-foreground">
                {info.getValue() as string}
            </div>
        )
    },
    {
        header: "Sync Time",
        accessorKey: "metric_sync_time",
        cell: (info) => {
            const value = info.getValue() as string;
            return (
                <div className="text-sm text-muted-foreground font-mono">
                    {value ? new Date(value).toLocaleString('es-CL') : '-'}
                </div>
            );
        }
    },
    {
        header: "Eficiencia",
        accessorKey: "credit_efficiency",
        cell: (info) => {
            const value = info.getValue() as string;
            return (
                <div className="text-sm">
                    <Badge
                        variant={
                            value === 'High' ? 'default' :
                                value === 'Medium' ? 'secondary' :
                                    'destructive'
                        }
                    >
                        {value || 'N/A'}
                    </Badge>
                </div>
            );
        }
    },
    {
        header: "Región",
        accessorKey: "region",
        cell: (info) => (
            <div className="text-sm text-muted-foreground">
                {info.getValue() as string}
            </div>
        )
    },
    {
        header: "Créditos CPU Balance",
        accessorKey: "last_cpu_credits_balance",
        cell: (info) => {
            const value = info.getValue() as number;
            return (
                <div className="text-sm text-muted-foreground">
                    {value !== null && value !== undefined ? value.toFixed(2) : '-'}
                </div>
            );
        }
    },
    {
        header: "Créditos CPU Usados",
        accessorKey: "last_cpu_credits_usage",
        cell: (info) => {
            const value = info.getValue() as number;
            return (
                <div className="text-sm text-muted-foreground">
                    {value !== null && value !== undefined ? value.toFixed(2) : '-'}
                </div>
            );
        }
    },
{
        header: "CPU Prom / Máx",
        accessorKey: "avg_cpu",
        cell: ({ row }) => {
            const avg = row.original.avg_cpu;
            const max = row.original.max_cpu;
            return (
                <div className="text-sm">
                    <span className="font-medium text-foreground">
                        {avg != null ? `${avg.toFixed(2)}%` : '-'}
                    </span>
                    {max != null && (
                        <span className="text-xs text-muted-foreground ml-1">
                            / Máx: {max.toFixed(1)}%
                        </span>
                    )}
                </div>
            );
        }
    },
    {
        header: "Red Entrada / Máx",
        accessorKey: "avg_network_in",
        cell: ({ row }) => {
            const avg = row.original.avg_network_in;
            const max = row.original.max_network_in;
            const fmt = (b: number | null) => {
                if (b == null) return '-';
                if (b >= 1_000_000) return `${(b / 1_000_000).toFixed(2)} MB/s`;
                if (b >= 1_000) return `${(b / 1_000).toFixed(2)} KB/s`;
                return `${b.toFixed(2)} B/s`;
            };
            return (
                <div className="text-sm">
                    <span className="font-medium text-foreground">{fmt(avg)}</span>
                    {max != null && (
                        <span className="text-xs text-muted-foreground ml-1">/ Máx: {fmt(max)}</span>
                    )}
                </div>
            );
        }
    },
    {
        header: "Red Salida / Máx",
        accessorKey: "avg_network_out",
        cell: ({ row }) => {
            const avg = row.original.avg_network_out;
            const max = row.original.max_network_out;
            const fmt = (b: number | null) => {
                if (b == null) return '-';
                if (b >= 1_000_000) return `${(b / 1_000_000).toFixed(2)} MB/s`;
                if (b >= 1_000) return `${(b / 1_000).toFixed(2)} KB/s`;
                return `${b.toFixed(2)} B/s`;
            };
            return (
                <div className="text-sm">
                    <span className="font-medium text-foreground">{fmt(avg)}</span>
                    {max != null && (
                        <span className="text-xs text-muted-foreground ml-1">/ Máx: {fmt(max)}</span>
                    )}
                </div>
            );
        }
    },
    {
        header: "Clasificación",
        accessorKey: "clasificacion",
        cell: (info) => {
            const value = info.getValue() as string;
            const colorMap: Record<string, string> = {
                'Idle': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                'Infrautilizada': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                'Óptimo': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                'Sin Datos': 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
            };
            return (
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${colorMap[value] ?? colorMap['Sin Datos']}`}>
                    {value ?? 'Sin Datos'}
                </span>
            );
        }
    },
    {
        header: "Costo USD",
        accessorKey: "costo_usd",
        cell: (info) => {
            const value = info.getValue() as number | null;
            const color = value == null ? 'text-muted-foreground'
                : value > 50 ? 'text-red-600 font-bold'
                : value > 20 ? 'text-yellow-600 font-bold'
                : 'text-green-600 font-bold';
            return (
                <div className={`text-sm ${color}`}>
                    {value != null ? `$${value.toFixed(2)}` : 'Sin billing'}
                </div>
            );
        }
    }
];