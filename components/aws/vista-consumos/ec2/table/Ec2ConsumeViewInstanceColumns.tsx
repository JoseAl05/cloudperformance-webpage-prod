import { Badge } from '@/components/ui/badge';
import { DynamicColumn } from '@/components/general/data-table/columns';

export const Ec2ConsumeViewInstanceColumns: DynamicColumn<Ec2ConsumneViewInstance>[] = [
    {
        header: "ID Instancia",
        accessorKey: "resource",
        cell: (info) => {
            const value = info.getValue() as string;
            return (
                <div className="font-medium">
                    <Badge variant="outline" className="font-mono text-xs">
                        {value}
                    </Badge>
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
    }
];