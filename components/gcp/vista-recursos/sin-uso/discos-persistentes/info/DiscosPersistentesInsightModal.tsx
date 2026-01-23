'use client'

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HardDrive, Tag, Calendar, DollarSign, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DiscoData {
    name: string;
    project_id: string;
    region: string;
    disk_type_simple: string;
    sizeGb: string;
    status: string;
    cost_in_usd: number;
    labels: Record<string, string>;
    description?: string;
    creationTimestamp: string;
    lastAttachTimestamp?: string;
    lastDetachTimestamp?: string;
    en_uso: boolean;
}

// Tab 1: Información General
export const DiscoInfoView = ({ data }: { data: DiscoData }) => {
    const diasSinUso = data.lastDetachTimestamp 
        ? Math.floor((new Date().getTime() - new Date(data.lastDetachTimestamp).getTime()) / (1000 * 60 * 60 * 24))
        : null;

    const tipoColor = data.disk_type_simple === 'pd-ssd' ? 'bg-purple-100 text-purple-700' : 
                      data.disk_type_simple === 'pd-balanced' ? 'bg-blue-100 text-blue-700' : 
                      'bg-gray-100 text-gray-700';

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
                {/* Diagnóstico */}
                <div className={`rounded-lg border-l-4 p-4 shadow-sm flex items-start gap-3 ${
                    diasSinUso && diasSinUso > 30 ? 'border-red-500 bg-red-50 text-red-700' : 
                    'border-amber-500 bg-amber-50 text-amber-700'
                }`}>
                    <div className="p-2 bg-white/60 dark:bg-black/20 rounded-full">
                        {diasSinUso && diasSinUso > 30 ? 
                            <AlertTriangle className="h-5 w-5" /> : 
                            <CheckCircle2 className="h-5 w-5" />
                        }
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">
                            {diasSinUso && diasSinUso > 30 ? 'Disco Huérfano' : 'Disco Sin Uso'}
                        </h4>
                        <p className="text-xs opacity-90 mt-1">
                            {diasSinUso ? `Sin uso desde hace ${diasSinUso} días` : 'Nunca ha sido usado'}
                        </p>
                    </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <HardDrive className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Tamaño</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                            {data.sizeGb} <span className="text-sm font-normal">GB</span>
                        </p>
                    </div>
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Costo Mensual</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                            ${data.cost_in_usd.toFixed(2)} <span className="text-sm font-normal">USD</span>
                        </p>
                    </div>
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Tag className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Tipo</span>
                        </div>
                        <Badge className={`${tipoColor} text-sm mt-2`}>
                            {data.disk_type_simple}
                        </Badge>
                    </div>
                </div>

                {/* Detalles */}
                <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" /> Fechas
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-muted-foreground">Creación:</span>
                            <p className="font-medium">{new Date(data.creationTimestamp).toLocaleString('es-ES')}</p>
                        </div>
                        {data.lastAttachTimestamp && (
                            <div>
                                <span className="text-muted-foreground">Última conexión:</span>
                                <p className="font-medium">{new Date(data.lastAttachTimestamp).toLocaleString('es-ES')}</p>
                            </div>
                        )}
                        {data.lastDetachTimestamp && (
                            <div>
                                <span className="text-muted-foreground">Última desconexión:</span>
                                <p className="font-medium">{new Date(data.lastDetachTimestamp).toLocaleString('es-ES')}</p>
                            </div>
                        )}
                        <div>
                            <span className="text-muted-foreground">Estado:</span>
                            <Badge variant="outline" className="ml-2">{data.status}</Badge>
                        </div>
                    </div>
                    {data.description && (
                        <div className="mt-3 pt-3 border-t dark:border-slate-800">
                            <span className="text-muted-foreground text-xs">Descripción:</span>
                            <p className="text-sm mt-1">{data.description}</p>
                        </div>
                    )}
                </div>
            </div>
        </ScrollArea>
    );
};

// Tab 2: Labels/Tags
export const DiscoLabelsView = ({ data }: { data: DiscoData }) => {
    const labelsArray = Object.entries(data.labels || {});

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Tag className="h-4 w-4 text-slate-500" /> Labels del Disco ({labelsArray.length})
                </h4>
                {labelsArray.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden dark:border-slate-800">
                        <Table>
                            <TableHeader className="bg-slate-50 dark:bg-slate-900">
                                <TableRow>
                                    <TableHead>Key</TableHead>
                                    <TableHead>Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {labelsArray.map(([key, value]) => (
                                    <TableRow key={key}>
                                        <TableCell className="font-mono text-xs font-semibold">{key}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{value}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        Este disco no tiene labels asignados.
                    </p>
                )}
            </div>
        </ScrollArea>
    );
};

// Tab 3: Recomendación FinOps
export const DiscoRecomendacionView = ({ data }: { data: DiscoData }) => {
    const ahorroAnual = data.cost_in_usd * 12;

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
                <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="text-sm font-bold text-green-700 dark:text-green-400 mb-2">
                        💡 Recomendación FinOps
                    </h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                        Este disco persistente no está en uso. Considera las siguientes acciones:
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="border dark:border-slate-800 rounded-lg p-4">
                        <h5 className="font-semibold text-sm mb-2">1. Crear Snapshot y Eliminar</h5>
                        <p className="text-xs text-muted-foreground">
                            Crea un snapshot del disco para respaldo y elimina el disco persistente.
                            Los snapshots son incrementales y más económicos.
                        </p>
                        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded text-xs">
                            <strong>Ahorro estimado:</strong> ${data.cost_in_usd.toFixed(2)} USD/mes 
                            (${ahorroAnual.toFixed(2)} USD/año)
                        </div>
                    </div>

                    <div className="border dark:border-slate-800 rounded-lg p-4">
                        <h5 className="font-semibold text-sm mb-2">2. Reasignar a Otra Instancia</h5>
                        <p className="text-xs text-muted-foreground">
                            Si planeas usar este disco, conéctalo a una instancia activa.
                        </p>
                    </div>

                    <div className="border dark:border-slate-800 rounded-lg p-4">
                        <h5 className="font-semibold text-sm mb-2">3. Eliminar Directamente</h5>
                        <p className="text-xs text-muted-foreground">
                            Si no necesitas respaldo, elimina el disco para liberar costos inmediatamente.
                        </p>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
};