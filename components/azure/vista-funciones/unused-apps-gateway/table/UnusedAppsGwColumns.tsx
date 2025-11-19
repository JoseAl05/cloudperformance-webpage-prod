'use client'

import { Badge } from '@/components/ui/badge';
import { DynamicColumn } from '@/components/general/data-table/columns';
import { Button } from '@/components/ui/button';
import { Eye, Copy } from 'lucide-react';
import { useState } from 'react';
import { UnusedAppGw } from '@/interfaces/vista-unused-resources/unusedAppGInterfaces';
import { UnusedAppGwInsightModal } from '@/components/azure/vista-funciones/unused-apps-gateway/info/UnusedAppGwInsightModal'; // Asegúrate de importar el modal que creamos

const CopyBtn = ({ text }: { text: string }) => (
    <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 ml-2"
        onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(text);
        }}
    >
        <Copy className="h-3.5 w-3.5" />
    </Button>
);

// Componente wrapper para el modal dentro de la celda
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

export const UnusedAppsGwColumns: DynamicColumn<UnusedAppGw>[] = [
    {
        header: "Nombre Gateway",
        accessorKey: "name",
        cell: (info) => (
            <div className="font-medium">
                {info.getValue() as string}
            </div>
        )
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
        // Usamos un accessorFn para obtener el SKU más reciente para el ordenamiento/filtrado
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
        // Lógica para mostrar una etiqueta rápida en la tabla
        accessorFn: (row) => {
            const latest = [...row.details].sort((a, b) =>
                new Date(b.sync_time).getTime() - new Date(a.sync_time).getTime()
            )[0];

            // Replicamos la lógica de diagnóstico para la etiqueta
            // (Necesitamos las métricas para "Zombie" real, aquí usamos una aprox rápida basada en config)
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