'use client'

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Server, Tag, Calendar, DollarSign, AlertTriangle, CheckCircle2, TrendingDown, Activity, ArrowDown, ArrowUp, HardDrive, Network, Cpu } from 'lucide-react';
import { ConsumeViewEc2InfoInstances } from '@/interfaces/ec2ConsumeViewInterfaces';

const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const Ec2InfoView = ({ data }: { data: ConsumeViewEc2InfoInstances }) => {
    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
                <div className={`rounded-lg border-l-4 p-4 shadow-sm flex items-start gap-3 ${data.status === 'running' ? 'border-green-500 bg-green-50 text-green-700' :
                    data.status === 'stopped' || data.status === 'terminated' ? 'border-gray-500 bg-gray-50 text-gray-700' :
                        'border-yellow-500 bg-yellow-50 text-yellow-700'
                    }`}>
                    <div className="p-2 bg-white/60 dark:bg-black/20 rounded-full">
                        <Server className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">Estado: {data.status}</h4>
                        <p className="text-xs opacity-90 mt-1">
                            {data.status === 'running' ? 'Instancia activa y procesando' : 'Instancia detenida o en transición'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Server className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Instance Type</span>
                        </div>
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate" title={data.InstanceType}>
                            {data.InstanceType}
                        </p>
                    </div>
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Activity className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">CPU Avg</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {data.avg_cpu_utilization.toFixed(1)}%
                        </p>
                    </div>
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Costo Mensual</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            ${data.costo_usd.toFixed(2)} <span className="text-sm font-normal">USD</span>
                        </p>
                    </div>
                </div>

                <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" /> Información General
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-muted-foreground">Instance ID:</span>
                            <p className="font-medium font-mono text-xs">{data.InstanceId}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Región:</span>
                            <p className="font-medium">{data.region}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Zona de Disponibilidad:</span>
                            <p className="font-medium">{data.availability_zone}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Método de Compra:</span>
                            <p className="font-medium">{data.InstancePurchaseMethod}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">IP Pública:</span>
                            <p className="font-medium font-mono text-xs">{data.public_ip || '-'}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">IP Privada:</span>
                            <p className="font-medium font-mono text-xs">{data.private_ip || '-'}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">VPC:</span>
                            <p className="font-medium font-mono text-xs">{data.vpc_id}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Launch Time:</span>
                            <p className="font-medium">{new Date(data.LaunchTime).toLocaleString('es-ES')}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">EBS Devices:</span>
                            <p className="font-medium">{data.devices_attached} attached / {data.devices_not_attached} not attached</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Network Interfaces:</span>
                            <p className="font-medium">{data.interfaces_inuse_count} in-use / {data.interfaces_not_inuse_count} not in-use</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Última Sync:</span>
                            <p className="font-medium">{new Date(data.sync_time).toLocaleString('es-ES')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
};

export const Ec2MetricasView = ({ data }: { data: ConsumeViewEc2InfoInstances }) => {
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
                                <span className="font-bold">{data.avg_cpu_utilization.toFixed(2)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Máximo:</span>
                                <span className="font-bold text-red-600">{data.max_cpu_utilization.toFixed(2)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Mínimo:</span>
                                <span className="font-bold text-green-600">{data.min_cpu_utilization.toFixed(2)}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-orange-500" /> CPU Credits
                        </h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Avg Credit Usage:</span>
                                <span className="font-bold">{data.avg_cpu_credit_usage.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Avg Credit Balance:</span>
                                <span className="font-bold">{data.avg_cpu_credit_balance.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950 col-span-1 md:col-span-2">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Network className="h-4 w-4 text-purple-500" /> Red (Throughput)
                        </h5>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                                <p className="font-semibold text-xs text-muted-foreground uppercase">Network In (Entrada)</p>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Avg:</span>
                                    <span className="font-bold">{formatBytes(data.avg_network_in)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Max:</span>
                                    <span className="font-bold">{formatBytes(data.max_network_in)}</span>
                                </div>
                            </div>
                            <div className="space-y-2 border-l pl-4 dark:border-slate-800">
                                <p className="font-semibold text-xs text-muted-foreground uppercase">Network Out (Salida)</p>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Avg:</span>
                                    <span className="font-bold">{formatBytes(data.avg_network_out)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Max:</span>
                                    <span className="font-bold">{formatBytes(data.max_network_out)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
};

export const Ec2LabelsView = ({ data }: { data: ConsumeViewEc2InfoInstances }) => {
    const tagsArray = data.Tags
        ? data.Tags.flatMap(tagObj => Object.entries(tagObj))
        : [];

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Tag className="h-4 w-4 text-slate-500" /> Tags de la Instancia ({tagsArray.length})
                </h4>
                {tagsArray.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden dark:border-slate-800">
                        <Table>
                            <TableHeader className="bg-slate-50 dark:bg-slate-900">
                                <TableRow>
                                    <TableHead>Key</TableHead>
                                    <TableHead>Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tagsArray.map(([key, value]) => (
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
                        Esta instancia no tiene tags configurados.
                    </p>
                )}
            </div>
        </ScrollArea>
    );
};

export const Ec2RecomendacionView = ({ data }: { data: ConsumeViewEc2InfoInstances }) => {
    let recomendacion = {
        titulo: "Instancia Óptima",
        descripcion: "Esta instancia está bien dimensionada y siendo utilizada eficientemente.",
        icon: CheckCircle2,
        color: "border-green-500 bg-green-50 text-green-700"
    };

    if (data.is_idle) {
        recomendacion = {
            titulo: "⚠️ Instancia Zombi / Idle",
            descripcion: "Uso de CPU extremadamente bajo. Candidata para apagado.",
            icon: AlertTriangle,
            color: "border-red-500 bg-red-50 text-red-700"
        };
    } else if (data.is_underutilized) {
        recomendacion = {
            titulo: "📉 Instancia Infrautilizada",
            descripcion: "Uso bajo de recursos. Considere cambiar el Instance Type.",
            icon: TrendingDown,
            color: "border-amber-500 bg-amber-50 text-amber-700"
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
                    {data.is_idle && (
                        <>
                            <div className="border dark:border-slate-800 rounded-lg p-4">
                                <h5 className="font-semibold text-sm mb-2">1. Detener Instancia</h5>
                                <p className="text-xs text-muted-foreground mb-3">
                                    Si no es crítica, detenga la instancia para ahorrar costos de cómputo.
                                </p>
                                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded text-xs">
                                    <strong>Acción:</strong> EC2 &gt; Stop Instance
                                </div>
                            </div>
                        </>
                    )}

                    {data.is_underutilized && !data.is_idle && (
                        <div className="border dark:border-slate-800 rounded-lg p-4">
                            <h5 className="font-semibold text-sm mb-2">Right-sizing (Reducir Tamaño)</h5>
                            <p className="text-xs text-muted-foreground mb-3">
                                El tipo actual <strong>{data.InstanceType}</strong> parece excesivo.
                                Evalúe cambiar a una familia T3 o T3a si la carga es variable.
                            </p>
                        </div>
                    )}

                    {!data.is_idle && !data.is_underutilized && (
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