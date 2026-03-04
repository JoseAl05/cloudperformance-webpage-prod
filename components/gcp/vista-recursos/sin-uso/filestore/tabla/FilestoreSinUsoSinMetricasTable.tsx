'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

interface SinMetricasItem {
    name: string;
    project_id: string;
    location: string;
    tier: string;
    total_capacity_gb: number;
    state: string;
    creation_time: string;
    metrics_status: string;
}

interface FilestoreSinUsoSinMetricasTableProps {
    data: SinMetricasItem[];
}

export const FilestoreSinUsoSinMetricasTable = ({ data }: FilestoreSinUsoSinMetricasTableProps) => {
    if (!data || data.length === 0) return null;

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('es-CL', {
            day: '2-digit', month: '2-digit', year: 'numeric',
        });
    };

    return (
        <Card className="w-full border-yellow-200 dark:border-yellow-900">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <CardTitle className="text-lg">Instancias sin datos de métricas</CardTitle>
                    <Badge variant="outline" className="ml-auto text-yellow-600 border-yellow-400">
                        {data.length} instancia{data.length > 1 ? 's' : ''}
                    </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                    Estas instancias están excluidas del análisis. Pueden estar recién creadas,
                    en reparación o con facturación suspendida.
                </p>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-muted-foreground">
                                <th className="text-left py-2 pr-4 font-medium">Instancia</th>
                                <th className="text-left py-2 pr-4 font-medium">Proyecto</th>
                                <th className="text-left py-2 pr-4 font-medium">Location</th>
                                <th className="text-left py-2 pr-4 font-medium">Tier</th>
                                <th className="text-right py-2 pr-4 font-medium">Capacidad</th>
                                <th className="text-left py-2 pr-4 font-medium">Estado</th>
                                <th className="text-left py-2 font-medium">Creado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.name} className="border-b last:border-0 hover:bg-muted/30">
                                    <td className="py-2 pr-4 font-mono text-xs">{item.name}</td>
                                    <td className="py-2 pr-4">{item.project_id}</td>
                                    <td className="py-2 pr-4">{item.location}</td>
                                    <td className="py-2 pr-4">
                                        <Badge variant="secondary" className="text-xs">{item.tier}</Badge>
                                    </td>
                                    <td className="py-2 pr-4 text-right">{item.total_capacity_gb} GB</td>
                                    <td className="py-2 pr-4">
                                        <Badge variant="outline" className={
                                            item.state === 'READY'
                                                ? 'text-green-600 border-green-400'
                                                : 'text-yellow-600 border-yellow-400'
                                        }>
                                            {item.state}
                                        </Badge>
                                    </td>
                                    <td className="py-2 text-muted-foreground">{formatDate(item.creation_time)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};