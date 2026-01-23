'use client'

import { Badge } from '@/components/ui/badge';
import { DynamicColumn } from '@/components/data-table/columns';
import { Button } from '@/components/ui/button';
import { Eye, Copy } from 'lucide-react';
import { useState } from 'react';
import { UnusedAppGw } from '@/interfaces/vista-unused-resources/unusedAppGInterfaces';
import { UnusedAppGwInsightModal } from '@/components/azure/vista-funciones/unused-apps-gateway/info/UnusedAppGwInsightModal'; // Asegúrate de importar el modal que creamos
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const DetailsCell = ({ appGw }: { appGw: UnusedAppGw }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 cursor-pointer hover:bg-accent text-blue-600"
                onClick={() => setOpen(true)}
            >
                <Eye className="h-4 w-4 mr-2" />
                Ver Análisis
            </Button>

            <UnusedAppGwInsightModal
                appGw={appGw}
                isOpen={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
};

const QueryParams = () => {
    const searchParams = useSearchParams();

    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const resourceGroupParam = searchParams.get('resourceGroup');

    return { startDateParam: startDateParam, endDateParam: endDateParam, resourceGroup: resourceGroupParam }
}

export const UnusedAppsGwColumns: DynamicColumn<UnusedAppGw>[] = [
    {
        header: "Nombre Gateway",
        accessorKey: "name",
        cell: ({ row, getValue }) => {
            const name = getValue() as string;
            const startDate = QueryParams().startDateParam;
            const endDate = QueryParams().endDateParam;
            const resourceGroup = QueryParams().resourceGroup;

            const resourceId = row.original.resource_id;

            return (
                <div className="flex flex-col">
                    <Link
                        href={{ pathname: '/azure/consumo-apps-gateway/', query: { appgateway: resourceId, startDate: startDate, endDate: endDate, resourceGroup: resourceGroup } }}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <span className="font-medium">
                            {name}
                        </span>
                        <div className="flex items-center text-xs text-muted-foreground">

                            <span className="truncate max-w-[200px]" title={resourceId}>
                                {resourceId}
                            </span>
                        </div>
                    </Link>
                </div>
            )
        }
    },
    {
        header: "Ubicación",
        accessorKey: "location",
        cell: (info) => (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
                {info.getValue() as string}
            </div>
        )
    },
    {
        header: "SKU Actual",
        accessorFn: (row) => {
            const latest = [...row.details].sort((a, b) =>
                new Date(b.sync_time).getTime() - new Date(a.sync_time).getTime()
            )[0];
            return latest?.sku || 'Desconocido';
        },
        cell: (info) => {
            const sku = info.getValue() as string;
            const isV1 = sku.includes('v1');
            return (
                <Badge variant={isV1 ? 'secondary' : 'outline'} className={isV1 ? 'bg-amber-100 text-amber-800' : ''}>
                    {sku}
                </Badge>
            );
        }
    },
    {
        header: "Estado",
        accessorFn: (row) => {
            const latest = [...row.details].sort((a, b) =>
                new Date(b.sync_time).getTime() - new Date(a.sync_time).getTime()
            )[0];
            if (latest.backend_instance_count === 0) return "Sin uso (Sin Backends)";
            if (latest.sku.includes('v1')) return "Legacy V1";
            if (latest.autoscale_configuration?.min_capacity > 2) return "Sobreaprovisionado";
            if (latest.sku.includes('WAF') && latest.waf_mode !== 'Prevention') return "WAF Ineficiente";
            return "Revisar";
        },
        cell: (info) => {
            const status = info.getValue() as string;
            let variant: "default" | "destructive" | "outline" | "secondary" = "outline";
            let className = "";

            if (status.includes("Sin uso")) variant = "destructive";
            else if (status.includes("Legacy")) { variant = "secondary"; className = "bg-amber-100 text-amber-800"; }
            else if (status.includes("Sobreaprovisionado")) { variant = "outline"; className = "border-orange-500 text-orange-600"; }
            else if (status.includes("WAF")) { variant = "outline"; className = "border-red-200 text-red-700 bg-red-50"; }

            return <Badge variant={variant} className={className}>{status}</Badge>;
        }
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => <DetailsCell appGw={row.original} />,
        size: 140
    }
];