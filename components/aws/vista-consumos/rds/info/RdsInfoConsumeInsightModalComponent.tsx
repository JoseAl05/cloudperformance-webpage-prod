'use client'

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, Tag, Calendar, DollarSign, AlertTriangle, CheckCircle2, TrendingDown, Activity, HardDrive, Cpu, MemoryStick } from 'lucide-react';
import { RdsConsumeViewInfoInstances, RdsConsumeViewInfoInstanceHistory } from '@/interfaces/vista-consumos/rdsConsumeViewInterfaces';

const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getLatestHistory = (data: RdsConsumeViewInfoInstances): RdsConsumeViewInfoInstanceHistory | null => {
    if (!data.history || data.history.length === 0) return null;
    return data.history[data.history.length - 1];
};

export const RdsInfoView = ({ data }: { data: RdsConsumeViewInfoInstances }) => {
    const latest = getLatestHistory(data);
    if (!latest) return <p className="p-6 text-sm text-muted-foreground">Sin datos disponibles.</p>;

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
                <div className={`rounded-lg border-l-4 p-4 shadow-sm flex items-start gap-3 ${latest.state === 'available' ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-700 dark:text-green-200' :
                    latest.state === 'stopped' || latest.state === 'deleted' ? 'border-gray-500 bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-200' :
                        'border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-200'
                    }`}>
                    <div className="p-2 bg-white/60 dark:bg-black/20 rounded-full">
                        <Database className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">Estado: {latest.state}</h4>
                        <p className="text-xs opacity-90 mt-1">
                            {latest.state === 'available' ? 'Instancia activa y disponible' : 'Instancia detenida o en transición'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Database className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Instance Class</span>
                        </div>
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate" title={latest.instance_class}>
                            {latest.instance_class}
                        </p>
                    </div>
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Activity className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">CPU Avg</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {latest.avg_cpu_utilization.toFixed(1)}%
                        </p>
                    </div>
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Costo</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            ${latest.costo_total_usd.toFixed(2)} <span className="text-sm font-normal">USD</span>
                        </p>
                    </div>
                </div>

                <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" /> Información General
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-muted-foreground">Resource ARN:</span>
                            <p className="font-medium font-mono text-xs">{data.resource_arn}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Resource ID:</span>
                            <p className="font-medium font-mono text-xs">{data.resource_id}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Engine:</span>
                            <p className="font-medium">{latest.engine} {latest.engine_version}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Región:</span>
                            <p className="font-medium">{latest.region_name}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Zona de Disponibilidad:</span>
                            <p className="font-medium">{latest.availability_zone}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Multi-AZ:</span>
                            <p className="font-medium">{latest.multi_az ? 'Sí' : 'No'}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Storage Asignado:</span>
                            <p className="font-medium">{latest.allocated_storage} GB ({latest.storage_type})</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Fecha Creación:</span>
                            <p className="font-medium">{new Date(latest.InstanceCreateTime.$date).toLocaleString('es-ES')}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Última Sync:</span>
                            <p className="font-medium">{new Date(latest.sync_time.$date).toLocaleString('es-ES')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
};

export const RdsMetricasView = ({ data }: { data: RdsConsumeViewInfoInstances }) => {
    const latest = getLatestHistory(data);
    if (!latest) return <p className="p-6 text-sm text-muted-foreground">Sin datos disponibles.</p>;

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
                <h4 className="text-sm font-semibold mb-3">Métricas de Rendimiento</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-500" /> CPU Utilization
                        </h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Promedio:</span>
                                <span className="font-bold">{latest.avg_cpu_utilization.toFixed(2)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Máximo:</span>
                                <span className="font-bold text-red-600">{latest.max_cpu_utilization.toFixed(2)}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-purple-500" /> Conexiones
                        </h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Promedio:</span>
                                <span className="font-bold">{latest.avg_connections.toFixed(1)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Máximo:</span>
                                <span className="font-bold text-red-600">{latest.max_connections.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <HardDrive className="h-4 w-4 text-amber-500" /> Storage
                        </h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Libre (Avg):</span>
                                <span className="font-bold">{formatBytes(latest.avg_storage_free)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Libre (Max):</span>
                                <span className="font-bold">{formatBytes(latest.max_storage_free)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">% Usado:</span>
                                <span className="font-bold text-amber-600">{latest.strg_pct_used.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">% Libre:</span>
                                <span className="font-bold text-green-600">{latest.strg_pct_free.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <MemoryStick className="h-4 w-4 text-green-500" /> Memoria
                        </h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Libre (Avg):</span>
                                <span className="font-bold">{formatBytes(latest.avg_memory_free)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Libre (Max):</span>
                                <span className="font-bold">{formatBytes(latest.max_memory_free)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {data.history.length > 1 && (
                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-500" /> Historial de Métricas ({data.history.length} registros)
                        </h5>
                        <div className="border rounded-lg overflow-hidden dark:border-slate-800">
                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-slate-900">
                                    <TableRow>
                                        <TableHead>Sync Time</TableHead>
                                        <TableHead>CPU Avg</TableHead>
                                        <TableHead>Conexiones</TableHead>
                                        <TableHead>Storage Usado</TableHead>
                                        <TableHead>Mem. Libre</TableHead>
                                        <TableHead>Costo</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[...data.history].reverse().map((h, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell className="font-mono text-xs">
                                                {new Date(h.sync_time.$date).toLocaleDateString('es-ES')}
                                            </TableCell>
                                            <TableCell className="text-xs">{h.avg_cpu_utilization.toFixed(2)}%</TableCell>
                                            <TableCell className="text-xs">{h.avg_connections.toFixed(1)}</TableCell>
                                            <TableCell className="text-xs">{h.strg_pct_used.toFixed(1)}%</TableCell>
                                            <TableCell className="text-xs">{formatBytes(h.avg_memory_free)}</TableCell>
                                            <TableCell className="text-xs font-medium">${h.costo_total_usd.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
    );
};

export const RdsTagsView = ({ data }: { data: RdsConsumeViewInfoInstances }) => {
    const latest = getLatestHistory(data);
    const tags = latest?.TagList || [];

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Tag className="h-4 w-4 text-slate-500" /> Tags de la Instancia ({tags.length})
                </h4>
                {tags.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden dark:border-slate-800">
                        <Table>
                            <TableHeader className="bg-slate-50 dark:bg-slate-900">
                                <TableRow>
                                    <TableHead>Key</TableHead>
                                    <TableHead>Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tags.map((tag) => (
                                    <TableRow key={tag.Key}>
                                        <TableCell className="font-mono text-xs font-semibold">{tag.Key}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{tag.Value}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        Esta instancia no tiene tags configurados.
                    </p>
                )}
            </div>
        </ScrollArea>
    );
};

export const RdsRecomendacionView = ({ data }: { data: RdsConsumeViewInfoInstances }) => {
    const latest = getLatestHistory(data);
    if (!latest) return <p className="p-6 text-sm text-muted-foreground">Sin datos disponibles.</p>;

    let recomendacion = {
        titulo: "Instancia Óptima",
        descripcion: "Esta instancia está bien dimensionada y siendo utilizada eficientemente.",
        icon: CheckCircle2,
        color: "border-green-500 bg-green-50 text-green-700 dark:bg-green-700 dark:text-green-200"
    };

    if (latest.is_idle) {
        recomendacion = {
            titulo: "⚠️ Instancia Idle",
            descripcion: "Sin conexiones activas promedio. Candidata para apagado o eliminación.",
            icon: AlertTriangle,
            color: "border-red-500 bg-red-50 text-red-700 dark:bg-red-700 dark:text-red-200"
        };
    } else if (latest.is_underutilized) {
        recomendacion = {
            titulo: "📉 Instancia Infrautilizada",
            descripcion: "Uso bajo de CPU. Considere reducir el instance class.",
            icon: TrendingDown,
            color: "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-700 dark:text-amber-200"
        };
    } else if (latest.storage_inefficient) {
        recomendacion = {
            titulo: "💾 Storage Ineficiente",
            descripcion: "Bajo porcentaje de storage utilizado. Considere reducir el almacenamiento asignado.",
            icon: HardDrive,
            color: "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-700 dark:text-orange-200"
        };
    }

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
                <div className={`border-l-4 p-4 rounded-lg ${recomendacion.color}`}>
                    <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                        <recomendacion.icon className="h-5 w-5" />
                        {recomendacion.titulo}
                    </h4>
                    <p className="text-sm opacity-90">
                        {recomendacion.descripcion}
                    </p>
                </div>

                <div className="space-y-3">
                    {latest.is_idle && (
                        <div className="border dark:border-slate-800 rounded-lg p-4">
                            <h5 className="font-semibold text-sm mb-2">1. Eliminar o Detener Instancia</h5>
                            <p className="text-xs text-muted-foreground mb-3">
                                Si no es crítica, elimine la instancia RDS para ahorrar costos de cómputo y storage.
                            </p>
                            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded text-xs">
                                <strong>Acción:</strong> RDS &gt; Delete/Stop Instance
                            </div>
                        </div>
                    )}

                    {latest.is_underutilized && !latest.is_idle && (
                        <div className="border dark:border-slate-800 rounded-lg p-4">
                            <h5 className="font-semibold text-sm mb-2">Right-sizing (Reducir Instance Class)</h5>
                            <p className="text-xs text-muted-foreground mb-3">
                                El class actual <strong>{latest.instance_class}</strong> parece excesivo.
                                Evalúe cambiar a un class menor dentro de la misma familia.
                            </p>
                        </div>
                    )}

                    {latest.storage_inefficient && !latest.is_idle && !latest.is_underutilized && (
                        <div className="border dark:border-slate-800 rounded-lg p-4">
                            <h5 className="font-semibold text-sm mb-2">Reducir Storage Asignado</h5>
                            <p className="text-xs text-muted-foreground mb-3">
                                Solo se usa el <strong>{latest.strg_pct_used.toFixed(1)}%</strong> del storage asignado ({latest.allocated_storage} GB).
                            </p>
                        </div>
                    )}

                    {!latest.is_idle && !latest.is_underutilized && !latest.storage_inefficient && (
                        <div className="border dark:border-slate-800 rounded-lg p-4">
                            <h5 className="font-semibold text-sm mb-2">✅ Sin recomendaciones activas</h5>
                            <p className="text-xs text-muted-foreground">
                                La instancia opera dentro de parámetros normales de eficiencia.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </ScrollArea>
    );
};