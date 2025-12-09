'use client'

import { Badge } from '@/components/ui/badge';
import { DynamicColumn } from '@/components/general/data-table/columns';
import { Button } from '@/components/ui/button';
import { Eye, Copy } from 'lucide-react';
import { useState } from 'react';
import { UnusedRoute53 } from '@/interfaces/vista-unused-resources/unusedRoutes53Interfaces';
import { UnusedRoute53InsightModal } from '@/components/aws/vista-funciones/unused-r53/info/UnusedRoute53InsightModal';
import { toast } from 'sonner';

const DetailsCell = ({ resource }: { resource: UnusedRoute53 }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 cursor-pointer hover:bg-accent text-blue-600"
                onClick={() => setIsOpen(true)}
            >
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalle
            </Button>

            <UnusedRoute53InsightModal
                resource={resource}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
};

export const getUnusedRoute53Columns = (): DynamicColumn<UnusedRoute53>[] => [
    {
        header: "Nombre de Zona (Dominio)",
        accessorKey: "rs_name",
        cell: (info) => (
            <div className="font-medium text-foreground">{info.getValue() as string}</div>
        )
    },
    {
        header: "Hosted Zone ID",
        accessorKey: "hz_id",
        cell: (info) => {
            const val = info.getValue() as string;
            return (
                <div className="flex items-center gap-2 group">
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">
                        {val}
                    </code>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                            navigator.clipboard.writeText(val);
                            toast.success("ID copiado");
                        }}
                    >
                        <Copy className="h-3 w-3 text-muted-foreground" />
                    </Button>
                </div>
            )
        }
    },
    {
        header: "Ahorro Potencial",
        accessorKey: "potential_savings",
        cell: (info) => {
            const val = info.getValue() as number;
            return (
                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                    ${val.toFixed(2)} USD
                </Badge>
            )
        }
    },
    {
        header: "Estado",
        id: "status",
        cell: ({ row }) => {
            const history = row.original.history || [];
            if (history.length === 0) return <Badge variant="secondary">Sin datos</Badge>;
            const latest = [...history].sort((a, b) => new Date(b.sync_time).getTime() - new Date(a.sync_time).getTime())[0];
            const isUnused = latest.details.length <= 2;

            return isUnused ? (
                <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200">
                    Infrautilizado (Vacía)
                </Badge>
            ) : (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200">
                    Sin Uso Reciente
                </Badge>
            )
        }
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => <DetailsCell resource={row.original} />,
        size: 140
    }
];