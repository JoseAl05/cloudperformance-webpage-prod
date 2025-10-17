'use client'

import { Badge } from '@/components/ui/badge';
import { DynamicColumn } from '@/components/general/data-table/columns';
import { Ec2Instance } from '@/interfaces/vista-infrautilizadas/ec2ResourceInfraUsedViewInterface';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const DateParams = () => {
    const searchParams = useSearchParams();

    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    return { startDateParam: startDateParam, endDateParam: endDateParam }
}


export const Ec2ResourceInfraUsedViewColumns: DynamicColumn<Ec2Instance>[] = [
    {
        header: "ID Instancia",
        accessorKey: "InstanceId",
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
        header: "Región",
        accessorKey: "ResourceRegion",
        cell: (info) => (
            <div className="text-sm text-muted-foreground">
                {info.getValue() as string}
            </div>
        )
    },
    {
        header: "Tipo",
        accessorKey: "InstanceType",
        cell: (info) => (
            <div className="text-sm text-muted-foreground">
                {info.getValue() as string}
            </div>
        )
    },
    {
        header: "vCPUs",
        accessorKey: "vCPUs",
        cell: (info) => {
            // const value = info.getValue() as number;
            return (
                <div className="text-sm text-muted-foreground">
                    {/* {value !== null && value !== undefined ? value.toFixed(2) : '-'} */}
                    {info.getValue() as number}
                </div>
            );
        }
    },
    {
        header: "N° IPs publicas",
        accessorKey: "PublicIpCount",
        cell: (info) => {
            // const value = info.getValue() as number;
            return (
                <div className="text-sm text-muted-foreground">
                    {/* {value !== null && value !== undefined ? value.toFixed(2) : '-'} */}
                    {info.getValue() as number}
                </div>
            );
        }
    },
    {
        header: "N° Volumenes EBS",
        accessorKey: "volumeCount",
        cell: (info) => {
            // const value = info.getValue() as number;
            return (
                <div className="text-sm text-muted-foreground">
                    {/* {value !== null && value !== undefined ? value.toFixed(2) : '-'} */}
                    {info.getValue() as number}
                </div>
            );
        }
    },
    {
        header: "Capacidad Total EBS (GB)",
        accessorKey: "totalSize",
        cell: (info) => {
            // const value = info.getValue() as number;
            return (
                <div className="text-sm text-muted-foreground">
                    {/* {value !== null && value !== undefined ? value.toFixed(2) : '-'} */}
                    {info.getValue() as number}
                </div>
            );
        }
    },
    {
        header: "Sync Time",
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

    // {
    //     header: "Eficiencia",
    //     accessorKey: "credit_efficiency",
    //     cell: (info) => {
    //         const value = info.getValue() as string;
    //         return (
    //             <div className="text-sm">
    //                 <Badge
    //                     variant={
    //                         value === 'High' ? 'default' :
    //                             value === 'Medium' ? 'secondary' :
    //                                 'destructive'
    //                     }
    //                 >
    //                     {value || 'N/A'}
    //                 </Badge>
    //             </div>
    //         );
    //     }
    // },


    // {
    //     header: "Créditos CPU Usados",
    //     accessorKey: "last_cpu_credits_usage",
    //     cell: (info) => {
    //         const value = info.getValue() as number;
    //         return (
    //             <div className="text-sm text-muted-foreground">
    //                 {value !== null && value !== undefined ? value.toFixed(2) : '-'}
    //             </div>
    //         );
    //     }
    // }
];