'use client'

import { ColumnDef } from "@tanstack/react-table"
import { TrafficManagetDataEndpoints } from "@/interfaces/vista-traffic-manager/trafficManagerInterfaces"
import { Badge } from "@/components/ui/badge"
import { Globe, MapPin } from "lucide-react"

export const RecursosTrafficManagerEndpointsColumns: ColumnDef<TrafficManagetDataEndpoints>[] = [
    {
        accessorKey: "name",
        header: "Nombre Endpoint",
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("name")}</div>
        )
    },
    {
        accessorKey: "target",
        header: "Destino (Target)",
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm text-muted-foreground" title={row.getValue("target")}>
                <Globe className="h-3 w-3" />
                <span className="truncate max-w-[200px]">{row.getValue("target")}</span>
            </div>
        )
    },
    {
        accessorKey: "endpoint_location",
        header: "Ubicación",
        cell: ({ row }) => {
            const loc = row.getValue("endpoint_location") as string;
            return loc ? (
                <div className="flex items-center gap-1 text-xs">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    {loc}
                </div>
            ) : <span className="text-xs text-gray-400">-</span>
        }
    },
    {
        accessorKey: "endpoint_status",
        header: "Estado Config",
        cell: ({ row }) => {
            const status = row.getValue("endpoint_status") as string;
            return (
                <Badge variant={status === 'Enabled' ? 'outline' : 'secondary'} 
                       className={status === 'Enabled' ? 'border-green-500 text-green-600' : ''}>
                    {status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "endpoint_monitor_status",
        header: "Estado Monitor",
        cell: ({ row }) => {
            const status = row.getValue("endpoint_monitor_status") as string;
            // Lógica de colores simple
            let color = "text-yellow-600";
            if (status === 'Online') color = "text-green-600";
            if (status === 'Stopped' || status === 'Disabled') color = "text-gray-400";

            return (
                <span className={`text-xs font-bold ${color}`}>
                    {status}
                </span>
            )
        }
    },
    {
        accessorKey: "weight",
        header: "Peso",
        size: 80,
    }
]