'use client'

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tag, Calendar, DollarSign, CheckCircle2, TrendingDown, Activity, Network, Trash2, Zap, Globe, Gauge, RotateCcw } from 'lucide-react';
import { formatGeneric } from '@/lib/bytesToMbs';
import { LoadbalancerV2ConsumeInfoInstances, LoadbalancerV2ConsumeInfoInstancesHistory } from '@/interfaces/vista-consumos/elbV2ConsumeViewInterfaces';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getLatestHistory = (data: LoadbalancerV2ConsumeInfoInstances): LoadbalancerV2ConsumeInfoInstancesHistory | null => {
    if (!data.history || data.history.length === 0) return null;
    return data.history[data.history.length - 1];
};

const GetParameters = () => {
    const searchParams = useSearchParams();
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const regionParam = searchParams.get('regions');

    return {
        startDateParam,
        endDateParam,
        regionParam
    }
}

export const ElbV2InfoView = ({ data }: { data: LoadbalancerV2ConsumeInfoInstances }) => {
    const latest = getLatestHistory(data);
    if (!latest) return <p className="p-6 text-sm text-muted-foreground">Sin datos disponibles.</p>;

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Globe className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Tipo</span>
                        </div>
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate" title={latest.Type}>
                            {latest.Type}
                        </p>
                    </div>
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Activity className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Conexiones Activas Promedio</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {formatGeneric(latest.avg_active_connection_count)} Conexiones
                        </p>
                    </div>
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Network className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Datos Procesados Promedio</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {formatBytes(latest.avg_processed_bytes)}
                        </p>
                    </div>
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Gauge className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">LCUs Consumidos Promedio</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {formatGeneric(latest.avg_consumed_lcus)} LCUs
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
                            <span className="text-muted-foreground">ARN Load Balancer:</span>
                            <p className="font-medium font-mono text-xs break-all">{data.LoadBalancerArn}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Nombre Load Balancer:</span>
                            <p className="font-medium font-mono text-xs">{data.name}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">DNS Name:</span>
                            <p className="font-medium font-mono text-xs break-all">{latest.DNSName}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Tipo:</span>
                            <p className="font-medium">{latest.Type}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Esquema:</span>
                            <p className="font-medium">{latest.Scheme}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Estado:</span>
                            <p className="font-medium">{latest.State?.Code}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">VPC ID:</span>
                            <p className="font-medium font-mono text-xs">{latest.VpcId}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Tipo de IP:</span>
                            <p className="font-medium">{latest.IpAddressType}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Región:</span>
                            <p className="font-medium">{latest.region}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Zonas de Disponibilidad:</span>
                            <p className="font-medium">{latest.AvailabilityZones?.map(az => az.ZoneName).join(', ')}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Fecha Creación:</span>
                            <p className="font-medium">{new Date(latest.CreatedTime.$date).toLocaleString('es-ES')}</p>
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

export const ElbV2MetricasView = ({ data }: { data: LoadbalancerV2ConsumeInfoInstances }) => {
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
                                <span className="font-bold">{formatGeneric(latest.avg_active_connection_count)} Conexiones</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Máximo:</span>
                                <span className="font-bold text-red-600">{formatGeneric(latest.max_active_connection_count)} Conexiones</span>
                            </div>
                        </div>
                    </div>

                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-500" /> Nuevas Conexiones
                        </h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Promedio:</span>
                                <span className="font-bold">{formatGeneric(latest.avg_new_connection_count)} Conexiones</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Máximo:</span>
                                <span className="font-bold text-red-600">{formatGeneric(latest.max_new_connection_count)} Conexiones</span>
                            </div>
                        </div>
                    </div>

                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Network className="h-4 w-4 text-purple-500" /> Datos Procesados
                        </h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Promedio:</span>
                                <span className="font-bold">{formatBytes(latest.avg_processed_bytes)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Máximo:</span>
                                <span className="font-bold text-red-600">{formatBytes(latest.max_processed_bytes)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Gauge className="h-4 w-4 text-green-500" /> LCUs Consumidos
                        </h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Promedio:</span>
                                <span className="font-bold">{formatGeneric(latest.avg_consumed_lcus)} LCUs</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Máximo:</span>
                                <span className="font-bold text-red-600">{formatGeneric(latest.max_consumed_lcus)} LCUs</span>
                            </div>
                        </div>
                    </div>

                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Globe className="h-4 w-4 text-blue-500" /> Requests
                        </h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Promedio:</span>
                                <span className="font-bold">{formatGeneric(latest.avg_request_count)} Requests</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Máximo:</span>
                                <span className="font-bold text-red-600">{formatGeneric(latest.max_request_count)} Requests</span>
                            </div>
                        </div>
                    </div>

                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <RotateCcw className="h-4 w-4 text-red-500" /> Errores HTTP 5XX / TCP Resets
                        </h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">HTTP 5XX Promedio:</span>
                                <span className="font-bold">{formatGeneric(latest.avg_http_5xx_count)} Errores</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">HTTP 5XX Máximo:</span>
                                <span className="font-bold text-red-600">{formatGeneric(latest.max_http_5xx_count)} Errores</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">TCP Resets Promedio:</span>
                                <span className="font-bold">{formatGeneric(latest.avg_tcp_client_reset_count)} Resets</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">TCP Resets Máximo:</span>
                                <span className="font-bold text-red-600">{formatGeneric(latest.max_tcp_client_reset_count)} Resets</span>
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
                                        <TableHead>Datos Procesados</TableHead>
                                        <TableHead>LCUs</TableHead>
                                        <TableHead>Requests</TableHead>
                                        <TableHead>Costo</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[...data.history].reverse().map((h, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell className="font-mono text-xs">
                                                {new Date(h.sync_time.$date).toLocaleDateString('es-ES')}
                                            </TableCell>
                                            <TableCell className="text-xs">{formatGeneric(h.avg_active_connection_count)} Conexiones</TableCell>
                                            <TableCell className="text-xs">{formatBytes(h.avg_processed_bytes)}</TableCell>
                                            <TableCell className="text-xs">{formatGeneric(h.avg_consumed_lcus)} LCUs</TableCell>
                                            <TableCell className="text-xs">{formatGeneric(h.avg_request_count)} Requests</TableCell>
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

export const ElbV2TargetGroupsView = ({ data }: { data: LoadbalancerV2ConsumeInfoInstances }) => {
    const latest = getLatestHistory(data);
    const targetGroups = latest?.target_groups || [];
    const { startDateParam, endDateParam, regionParam } = GetParameters();

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Tag className="h-4 w-4 text-slate-500" /> Target Groups ({targetGroups.length})
                </h4>
                {targetGroups.length > 0 ? (
                    targetGroups.map((tg) => (
                        <div key={tg.TargetGroupArn} className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Nombre:</span>
                                    <p className="font-medium font-mono text-xs">{tg.TargetGroupName}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Protocolo / Puerto:</span>
                                    <p className="font-medium">{tg.Protocol} : {tg.Port}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Tipo de Target:</span>
                                    <p className="font-medium">{tg.TargetType}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Health Check:</span>
                                    <p className="font-medium">{tg.HealthCheckProtocol} : {tg.HealthCheckPort}</p>
                                </div>
                            </div>
                            {tg.targets_health && tg.targets_health.length > 0 && (
                                <div className="border rounded-lg overflow-hidden dark:border-slate-800">
                                    <Table>
                                        <TableHeader className="bg-slate-50 dark:bg-slate-900">
                                            <TableRow>
                                                <TableHead>Target ID</TableHead>
                                                <TableHead>Puerto</TableHead>
                                                <TableHead>Estado</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {tg.targets_health.map((th, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell className="font-mono text-xs">
                                                        <Link
                                                            href={{
                                                                pathname: `/aws/recursos/instancias-ec2`,
                                                                query: {
                                                                    startDate: startDateParam,
                                                                    endDate: endDateParam,
                                                                    selectedKey: "allKeys",
                                                                    selectedValue: "allValues",
                                                                    instance: th.Target.Id,
                                                                    instanceService: "ec2"
                                                                }
                                                            }}
                                                            className='text-blue-500 hover:text-blue-500/80'
                                                            rel="noopener noreferrer"
                                                            target="_blank"
                                                        >
                                                            {th.Target.Id}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell className="text-xs">{th.Target.Port}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={th.TargetHealth.State === 'healthy'
                                                                ? 'bg-green-500 text-white text-[10px]'
                                                                : 'bg-red-500 text-white text-[10px]'}
                                                        >
                                                            {th.TargetHealth.State}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        Este Load Balancer no tiene Target Groups asociados.
                    </p>
                )}
            </div>
        </ScrollArea>
    );
};

export const ElbV2RecomendacionView = ({ data }: { data: LoadbalancerV2ConsumeInfoInstances }) => {
    const latest = getLatestHistory(data);
    if (!latest) return <p className="p-6 text-sm text-muted-foreground">Sin datos disponibles.</p>;

    let recomendacion = {
        titulo: "Load Balancer Eficiente",
        descripcion: "Este recurso está procesando un volumen de tráfico que justifica su costo fijo por hora.",
        icon: CheckCircle2,
        color: "border-green-500 bg-green-50 text-green-700 dark:bg-green-700 dark:text-green-200"
    };

    if (latest.is_idle) {
        recomendacion = {
            titulo: "⚠️ Load Balancer Idle",
            descripcion: "Se detecta tráfico mínimo sin conexiones activas ni requests significativos. El costo fijo por hora es un desperdicio neto.",
            icon: Trash2,
            color: "border-red-500 bg-red-50 text-red-700 dark:bg-red-700 dark:text-red-200"
        };
    } else if (latest.is_underutilized) {
        recomendacion = {
            titulo: "📉 Load Balancer Subutilizado",
            descripcion: "Bajo consumo de LCUs. El costo fijo por hora puede superar el valor del tráfico procesado.",
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
                                El Load Balancer no registra tráfico significativo. Elimínelo para ahorrar ~${(0.0225 * 24 * 30).toFixed(0)} USD al mes en costos fijos (ALB/NLB).
                            </p>
                            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded text-xs">
                                <strong>Nota:</strong> Verifique que no existan DNS records o servicios apuntando a este Load Balancer antes de eliminarlo.
                            </div>
                        </div>
                    )}

                    {latest.is_underutilized && !latest.is_idle && (
                        <div className="border dark:border-slate-800 rounded-lg p-4">
                            <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <Zap className="h-4 w-4 text-amber-500" />
                                Evaluar Consolidación
                            </h5>
                            <p className="text-xs text-muted-foreground mb-3">
                                El tráfico es bajo. Considere consolidar múltiples Load Balancers en uno solo utilizando reglas de enrutamiento basadas en host o path (ALB), reduciendo costos fijos.
                            </p>
                            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded text-xs">
                                <strong>Acción:</strong> Revise los Target Groups y las reglas de listener para identificar oportunidades de consolidación.
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
                                El rendimiento actual justifica la inversión. Mantenga el monitoreo de <strong>ConsumedLCUs</strong> y <strong>HTTPCode_Target_5XX_Count</strong> para detectar anomalías.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </ScrollArea>
    );
};