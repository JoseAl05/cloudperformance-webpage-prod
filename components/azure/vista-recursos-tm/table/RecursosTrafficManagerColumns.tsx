'use client'

import { ColumnDef } from "@tanstack/react-table"
import { TrafficManagerDataHistory } from "@/interfaces/vista-traffic-manager/trafficManagerInterfaces"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertTriangle, Eye } from "lucide-react"
import { RecursosTrafficManagerModalComponent } from '@/components/azure/vista-recursos-tm/info/RecursosTrafficManagerModalComponent'
import { Button } from '@/components/ui/button'

export const RecursosTrafficManagerColumns: ColumnDef<TrafficManagerDataHistory>[] = [
    {
        accessorKey: "_cq_sync_time",
        header: "Fecha de Sincronización",
        cell: ({ row }) => {
            const date = new Date(row.getValue("_cq_sync_time"));
            return <div className="text-muted-foreground">{date.toLocaleString()}</div>
        }
    },
    {
        accessorKey: "profile_status",
        header: "Estado Perfil",
        cell: ({ row }) => {
            const status = row.getValue("profile_status") as string;
            return (
                <Badge variant={status === 'Enabled' ? 'default' : 'secondary'}
                    className={status === 'Enabled' ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}>
                    {status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "monitor_config.profile_monitor_status",
        header: "Estado Monitor",
        cell: ({ row }) => {
            const status = row.original.monitor_config.profile_monitor_status;
            let colorClass = "text-gray-500";
            let Icon = AlertTriangle;

            if (status === 'Online') {
                colorClass = "text-green-600";
                Icon = CheckCircle2;
            } else if (status === 'Inactive' || status === 'Disabled') {
                colorClass = "text-gray-400";
                Icon = XCircle;
            } else {
                colorClass = "text-yellow-600";
            }

            return (
                <div className={`flex items-center gap-2 ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{status}</span>
                </div>
            )
        }
    },
    {
        accessorKey: "endpoints",
        header: "Endpoints Activos",
        cell: ({ row }) => {
            const endpoints = row.original.endpoints;
            const count = endpoints.length;

            if (count === 0) {
                return <span className="text-muted-foreground text-sm pl-4">0</span>
            }
            return (
                <div className="flex items-center gap-2">
                    <span className="font-mono w-4 text-right">{count}</span>
                    <RecursosTrafficManagerModalComponent
                        endpoints={endpoints}
                        titleSuffix={`(Histórico: ${new Date(row.original._cq_sync_time).toLocaleDateString()})`}
                        trigger={
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-blue-100 text-blue-500">
                                <Eye className="h-3 w-3" />
                                <span className="sr-only">Ver endpoints</span>
                            </Button>
                        }
                    />
                </div>
            )
        }
    },
    {
        accessorKey: "traffic_routing_method",
        header: "Método Enrutamiento",
    },
    {
        accessorKey: "avg_queries_returned",
        header: "Consultas Promedio",
        cell: ({ row }) => {
            const val = row.getValue("avg_queries_returned") as number | null;

            if (val === null || val === undefined) {
                return <span className="text-muted-foreground text-xs">-</span>;
            }

            return (
                <div className="flex items-center gap-1 font-mono">
                    {val.toFixed(2)}
                </div>
            )
        }
    },
]