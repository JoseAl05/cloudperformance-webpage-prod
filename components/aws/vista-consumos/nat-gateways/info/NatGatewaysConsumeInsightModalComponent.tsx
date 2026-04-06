'use client'

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {  Tag, Calendar, DollarSign,  CheckCircle2, TrendingDown, Activity, HardDrive, Computer, Network, Trash2, Zap } from 'lucide-react';
import { formatGeneric } from '@/lib/bytesToMbs';
import { NatGatewayConsumeInfoInstances, NatGatewayConsumeInfoInstancesHistory } from '@/interfaces/vista-consumos/natGwConsumeViewInterfaces';

const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getLatestHistory = (data: NatGatewayConsumeInfoInstances): NatGatewayConsumeInfoInstancesHistory | null => {
    if (!data.history || data.history.length === 0) return null;
    return data.history[data.history.length - 1];
};

export const NatGwInfoView = ({ data }: { data: NatGatewayConsumeInfoInstances }) => {
    const latest = getLatestHistory(data);
    if (!latest) return <p className="p-6 text-sm text-muted-foreground">Sin datos disponibles.</p>;

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Computer className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Tipo de Conexión</span>
                        </div>
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate" title={latest.ConnectivityType}>
                            {latest.ConnectivityType}
                        </p>
                    </div>
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Activity className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Conexiones Activas Promedio</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {formatGeneric(latest.avg_active_connections)} Conexiones
                        </p>
                    </div>
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Activity className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Datos Enviados / Datos Entregados (In/Out)</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {formatBytes(latest.avg_bytes_in)} / {formatBytes(latest.avg_bytes_out)}
                        </p>
                    </div>
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Activity className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Error de Asignación de Puertos</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {formatGeneric(latest.avg_error_port_allocation)}
                        </p>
                    </div>
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Costo</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            ${formatGeneric(latest.costo_usd)} <span className="text-sm font-normal">USD</span>
                        </p>
                    </div>
                </div>

                <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" /> Información General
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-muted-foreground">ID Nat Gateway:</span>
                            <p className="font-medium font-mono text-xs">{data.NatGatewayId}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Nombre Nat Gateway:</span>
                            <p className="font-medium font-mono text-xs">{data.name}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Tipo de Conexión:</span>
                            <p className="font-medium">{latest.ConnectivityType}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Región:</span>
                            <p className="font-medium">{latest.region}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Interfaces asociadas:</span>
                            <p className="font-medium">{latest.NatGatewayAddresses.length}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Fecha Creación:</span>
                            <p className="font-medium">{new Date(latest.CreateTime.$date).toLocaleString('es-ES')}</p>
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

export const NatGwMetricasView = ({ data }: { data: NatGatewayConsumeInfoInstances }) => {
    const latest = getLatestHistory(data);
    if (!latest) return <p className="p-6 text-sm text-muted-foreground">Sin datos disponibles.</p>;

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
                <h4 className="text-sm font-semibold mb-3">Métricas de Rendimiento</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-500" /> Conexiones Activas
                        </h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Promedio:</span>
                                <span className="font-bold">{formatGeneric(latest.avg_active_connections)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Máximo:</span>
                                <span className="font-bold text-red-600">{formatGeneric(latest.max_active_connections)}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Network className="h-4 w-4 text-purple-500" /> Datos Enviados / Datos Entregados (In/Out)
                        </h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Promedio:</span>
                                <span className="font-bold">{formatBytes(latest.avg_bytes_in)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Máximo:</span>
                                <span className="font-bold text-red-600">{formatBytes(latest.max_bytes_in)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Promedio:</span>
                                <span className="font-bold">{formatBytes(latest.avg_bytes_out)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Máximo:</span>
                                <span className="font-bold text-red-600">{formatBytes(latest.max_bytes_out)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <HardDrive className="h-4 w-4 text-amber-500" /> Error de asignación de puertos
                        </h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Promedio:</span>
                                <span className="font-bold">{formatGeneric(latest.avg_error_port_allocation)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Máximo:</span>
                                <span className="font-bold">{formatGeneric(latest.max_error_port_allocation)}</span>
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
                                        <TableHead>Conexiones Activas</TableHead>
                                        <TableHead>Datos Enviados / Datos Entregados (In/Out)</TableHead>
                                        <TableHead>Error de asignación de puertos</TableHead>
                                        <TableHead>Costo</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[...data.history].reverse().map((h, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell className="font-mono text-xs">
                                                {new Date(h.sync_time.$date).toLocaleDateString('es-ES')}
                                            </TableCell>
                                            <TableCell className="text-xs">{formatGeneric(h.avg_active_connections)} Conexiones</TableCell>
                                            <TableCell className="text-xs">{formatBytes(h.avg_bytes_in)} / {formatBytes(h.avg_bytes_out)}</TableCell>
                                            <TableCell className="text-xs">{formatGeneric(h.avg_error_port_allocation)} Errores</TableCell>
                                            <TableCell className="text-xs font-medium">${h.costo_usd.toFixed(2)}</TableCell>
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

export const NatGwTagsView = ({ data }: { data: NatGatewayConsumeInfoInstances }) => {
    const latest = getLatestHistory(data);
    const tags = latest?.Tags || [];

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

export const NatGwRecomendacionView = ({ data }: { data: NatGatewayConsumeInfoInstances }) => {
    const latest = getLatestHistory(data);
    if (!latest) return <p className="p-6 text-sm text-muted-foreground">Sin datos disponibles.</p>;

    let recomendacion = {
        titulo: "NAT Gateway Eficiente",
        descripcion: "Este recurso está procesando un volumen de tráfico que justifica su costo fijo por hora.",
        icon: CheckCircle2,
        color: "border-green-500 bg-green-50 text-green-700 dark:bg-green-700 dark:text-green-200"
    };

    if (latest.is_idle) {
        recomendacion = {
            titulo: "⚠️ NAT Gateway Idle",
            descripcion: "Se detecta tráfico inferior a 5 MB y sin conexiones activas reales. El costo fijo es un desperdicio neto.",
            icon: Trash2,
            color: "border-red-500 bg-red-50 text-red-700 dark:bg-red-700 dark:text-red-200"
        };
    } else if (latest.is_underutilized) {
        recomendacion = {
            titulo: "📉 NAT Subutilizada",
            descripcion: "Bajo flujo de datos. El costo de procesamiento es menor al costo por hora de disponibilidad.",
            icon: TrendingDown,
            color: "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-700 dark:text-amber-200"
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
                            <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <Trash2 className="h-4 w-4 text-red-500" />
                                1. Eliminar Recurso
                            </h5>
                            <p className="text-xs text-muted-foreground mb-3">
                                La NAT Gateway no ha registrado conexiones activas. Elimínela para ahorrar ~${(0.045 * 24 * 30).toFixed(0)} USD al mes en costos fijos.
                            </p>
                            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded text-xs">
                                <strong>Nota:</strong> Verifique si las rutas en la Route Table son necesarias antes de borrar.
                            </div>
                        </div>
                    )}

                    {latest.is_underutilized && !latest.is_idle && (
                        <div className="border dark:border-slate-800 rounded-lg p-4">
                            <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <Zap className="h-4 w-4 text-amber-500" />
                                Evaluar VPC Endpoints
                            </h5>
                            <p className="text-xs text-muted-foreground mb-3">
                                El tráfico es mínimo. Si el destino es S3, DynamoDB o servicios de AWS, utilice <strong>VPC Endpoints (Gateway type)</strong> para eliminar el cargo por GB procesado y potencialmente la NAT.
                            </p>
                            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded text-xs">
                                <strong>Acción:</strong> Identifique los destinos mediante VPC Flow Logs.
                            </div>
                        </div>
                    )}

                    {!latest.is_idle && !latest.is_underutilized && (
                        <div className="border dark:border-slate-800 rounded-lg p-4">
                            <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <Network className="h-4 w-4 text-green-500" />
                                ✅ Operación Saludable
                            </h5>
                            <p className="text-xs text-muted-foreground">
                                El rendimiento actual justifica la inversión. Mantenga el monitoreo de <strong>ErrorPortAllocation</strong> para evitar saturación de puertos efímeros.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </ScrollArea>
    );
};