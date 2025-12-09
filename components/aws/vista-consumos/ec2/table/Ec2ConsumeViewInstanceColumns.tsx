'use client'
import { Badge } from '@/components/ui/badge';
import { DynamicColumn } from '@/components/general_aws/data-table/columns';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Ec2ConsumneViewInstance } from '@/interfaces/vista-consumos/ec2ConsumeViewInterfaces';
import { ModalResourceBillingComponent } from '@/components/aws/facturacion-recurso/info/ModalResourceBillingComponent'
import { ResourceBillingActionCell } from '@/components/aws/facturacion-recurso/table/ResourceBillingActionCell';

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
        header: "Facturación",
        accessorKey: "billing_action",
        cell: ({ row }) => {
            const startDateHistoryFormatted = new Date(row.original.metric_sync_time).toISOString().split('.')[0];
            return <ResourceBillingActionCell resourceId={row.original.resource} startDateHistory={startDateHistoryFormatted} />;
        }
    }
];