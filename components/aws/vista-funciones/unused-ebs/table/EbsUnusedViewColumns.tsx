'use client'
import { Badge } from '@/components/ui/badge';
import { DynamicColumn } from '@/components/data-table/columns';
import { useSearchParams } from 'next/navigation';
import { UnusedEbsVolumeInfo } from '@/interfaces/vista-ebs-no-utilizados/ebsUnusedInterfaces';

const DateParams = () => {
    const searchParams = useSearchParams();

    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    return { startDateParam: startDateParam, endDateParam: endDateParam }
}

export const EbsUnusedViewColumns: DynamicColumn<UnusedEbsVolumeInfo>[] = [
    {
        header: "ID Volúmen",
        accessorKey: "ebs_name"
        // cell: (info) => {
        //     const value = info.getValue() as string;
        //     const startDate = DateParams().startDateParam;
        //     const endDate = DateParams().endDateParam
        //     return (
        //         <div className="font-medium">
        //             <Link
        //                 href={{ pathname: '/aws/recursos/instancias-ec2', query: { instance: value, startDate: startDate, endDate: endDate } }}
        //                 rel="noopener noreferrer"
        //                 target="_blank"
        //             >
        //                 <Badge variant="secondary" className="ml-3 font-mono text-sm transition-all hover:scale-[1.02]">
        //                     {value}
        //                 </Badge>
        //             </Link>
        //         </div>
        //     );
        // }
    },
    {
        header: "Tipo",
        accessorKey: "ebs_type",
        cell: (info) => (
            <div className="text-sm text-muted-foreground">
                {info.getValue() as string}
            </div>
        )
    },
    {
        header: "Fecha Observación",
        accessorKey: "sync_time",
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
        header: "Estado",
        accessorKey: "ebs_state",
        cell: (info) => {
            const value = info.getValue() as string;
            return (
                <div className="text-sm">
                    <Badge
                        variant={
                            value === 'available' ? 'warning' :
                                value === 'deleted' ? 'default' :
                                    value === 'error' ? 'destructive' :
                                        'warning'
                        }
                    >
                        {value || 'N/A'}
                    </Badge>
                </div>
            );
        }
    },
    {
        header: "Region",
        accessorKey: "ebs_region",
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
        header: "Máx. IOPS Soportados",
        accessorKey: "ebs_iops",
        cell: (info) => {
            const value = info.getValue() as number;
            return (
                <div className="text-sm text-muted-foreground">
                    {value} IOPS
                </div>
            )
        }
    },
    {
        header: "Throughput",
        accessorKey: "ebs_throughput",
        cell: (info) => {
            const value = info.getValue() as number;
            return (
                <div className="text-sm text-muted-foreground">
                    {value} MB/s
                </div>
            );
        }
    },
    {
        header: "Tamaño Volúmen",
        accessorKey: "ebs_size",
        cell: (info) => {
            const value = info.getValue() as number;
            return (
                <div className="text-sm text-muted-foreground">
                    {value} GB
                </div>
            );
        }
    },
    {
        header: "Attachments",
        accessorKey: "ebs_attachments",
        cell: (info) => {
            const value = info.getValue();
            const qAttach = value.length;
            return (
                <div className="text-sm text-muted-foreground">
                    {qAttach} Attachments
                </div>
            );
        }
    },
];