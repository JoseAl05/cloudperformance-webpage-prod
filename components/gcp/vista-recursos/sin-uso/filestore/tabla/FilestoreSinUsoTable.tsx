'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FilestoreItem {
    name: string;
    project_id: string;
    location: string;
    tier: string;
    total_capacity_gb: number;
    used: number;
    unused: number;
    porcentaje_uso: number;
    state: string;
    creation_time: string;
    dias_desde_creacion: number;
    clasificacion_actividad: string;
    iops_total: number;
    read_ops_total: number;
    write_ops_total: number;
    costo_mensual: number;
    cost_in_usd: number;
    tiene_billing: boolean;
    recomendacion: string;
    labels: Record<string, string>;
}

interface FilestoreSinUsoTableProps {
    data: FilestoreItem[];
}

const getBadgeClasificacion = (clasificacion: string) => {
    switch (clasificacion) {
        case 'SIN_ACTIVIDAD':
            return <Badge className="bg-red-100 text-red-700 border-red-300 dark:bg-red-900 dark:text-red-300">SIN ACTIVIDAD</Badge>;
        case 'ACTIVIDAD_BAJA':
            return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300">ACTIVIDAD BAJA</Badge>;
        case 'EN_USO':
            return <Badge className="bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-300">EN USO</Badge>;
        default:
            return <Badge variant="outline">{clasificacion}</Badge>;
    }
};

const getRecomendacionBadge = (recomendacion: string) => {
    switch (recomendacion) {
        case 'ELIMINAR':
            return <Badge className="bg-red-500 text-white">ELIMINAR</Badge>;
        case 'MONITOREAR':
            return <Badge className="bg-yellow-500 text-white">MONITOREAR</Badge>;
        case 'EN_USO':
            return <Badge className="bg-green-500 text-white">EN USO</Badge>;
        default:
            return <Badge variant="outline">{recomendacion}</Badge>;
    }
};

const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

export const FilestoreSinUsoTable = ({ data }: FilestoreSinUsoTableProps) => {
    if (!data || data.length === 0) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                    No se encontraron instancias Filestore para los filtros seleccionados.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Detalle de Instancias Filestore</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-muted-foreground">
                                <th className="text-left py-2 pr-4 font-medium">Instancia</th>
                                <th className="text-left py-2 pr-4 font-medium">Proyecto</th>
                                <th className="text-left py-2 pr-4 font-medium">Tier</th>
                                <th className="text-right py-2 pr-4 font-medium">Capacidad</th>
                                <th className="text-right py-2 pr-4 font-medium">Usado</th>
                                <th className="text-right py-2 pr-4 font-medium">IOPS Total</th>
                                <th className="text-right py-2 pr-4 font-medium">Costo período</th>
                                <th className="text-left py-2 pr-4 font-medium">Creado</th>
                                <th className="text-left py-2 pr-4 font-medium">Actividad</th>
                                <th className="text-left py-2 font-medium">Recomendación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr
                                    key={item.name}
                                    className="border-b last:border-0 hover:bg-muted/30"
                                >
                                    <td className="py-3 pr-4 font-mono text-xs font-medium">
                                        {item.name}
                                    </td>
                                    <td className="py-3 pr-4 text-muted-foreground">
                                        {item.project_id}
                                    </td>
                                    <td className="py-3 pr-4">
                                        <Badge variant="secondary" className="text-xs">
                                            {item.tier}
                                        </Badge>
                                    </td>
                                    <td className="py-3 pr-4 text-right">
                                        {item.total_capacity_gb?.toLocaleString()} GB
                                    </td>
                                    <td className="py-3 pr-4 text-right">
                                        <span className={item.used === 0 ? 'text-red-500 font-medium' : ''}>
                                            {item.used != null ? `${item.used.toFixed(2)} GB` : '—'}
                                        </span>
                                    </td>
                                    <td className="py-3 pr-4 text-right font-mono text-xs">
                                        {item.iops_total != null ? item.iops_total.toFixed(2) : '—'}
                                    </td>
                                    <td className="py-3 pr-4 text-right">
                                        {item.tiene_billing
                                            ? `$${(item.cost_in_usd ?? 0).toFixed(2)}`
                                            : <span className="text-muted-foreground text-xs">Sin billing</span>
                                        }
                                    </td>
                                    <td className="py-3 pr-4 text-muted-foreground text-xs">
                                        <div>{formatDate(item.creation_time)}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {item.dias_desde_creacion} días
                                        </div>
                                    </td>
                                    <td className="py-3 pr-4">
                                        {getBadgeClasificacion(item.clasificacion_actividad)}
                                    </td>
                                    <td className="py-3">
                                        {getRecomendacionBadge(item.recomendacion)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};