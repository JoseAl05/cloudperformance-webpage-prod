'use client'
import { Badge } from '@/components/ui/badge';
import { DynamicColumn } from '@/components/general_aws/data-table/columns';
import { RdsConsumeViewInstance } from '@/interfaces/vista-consumos/rdsPgConsumeViewInterfaces';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ResourceBillingActionCell } from '@/components/aws/facturacion-recurso/table/ResourceBillingActionCell';

const DateParams = () => {
    const searchParams = useSearchParams();

    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    return { startDateParam: startDateParam, endDateParam: endDateParam }
}

const InstancesServiceParam = () => {
    const searchParams = useSearchParams();

    const instancesServiceParam = searchParams.get('instanceService');

    return { instancesServiceParam }
}


export const RdsConsumeViewInstanceColumns: DynamicColumn<RdsConsumeViewInstance>[] = [
    {
        header: "ID Instancia",
        accessorKey: "resource",
        cell: (info) => {
            const value = info.getValue() as string;
            const startDate = DateParams().startDateParam;
            const endDate = DateParams().endDateParam;
            let pathname = '';

            switch (InstancesServiceParam().instancesServiceParam) {
                case 'postgresql':
                    pathname = '/aws/recursos/instancias-rds-pg';
                    break;
                case 'mysql':
                    pathname = '/aws/recursos/instancias-rds-mysql';
                    break;
                default:
                    break;
            }

            return (
                <div className="font-medium">
                    <Link
                        href={{ pathname: pathname, query: { instance: value, startDate: startDate, endDate: endDate } }}
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
        header: "Engine",
        accessorKey: "engine",
        cell: (info) => (
            <div className="text-sm text-muted-foreground">
                {info.getValue() as string}
            </div>
        )
    },
    {
        header: "Versión Engine",
        accessorKey: "engine_version",
        cell: (info) => (
            <div className="text-sm text-muted-foreground">
                {info.getValue() as string}
            </div>
        )
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