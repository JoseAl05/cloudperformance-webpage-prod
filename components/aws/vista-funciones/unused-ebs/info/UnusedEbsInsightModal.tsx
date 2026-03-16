'use client'

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, HardDrive, CheckCircle2, AlertTriangle, ArrowDown, Wallet, LucideIcon, Clock, BookOpen, BookUp, ArrowDownToLine, ArrowUpFromLine, Zap, Layers, Link2 } from 'lucide-react';
import { bytesToMB } from '@/lib/bytesToMbs';
import { Separator } from "@/components/ui/separator";
import { UnusedEbsTableData } from '@/interfaces/vista-unused-resources/unusedEbsResourcesInterfaces';

export const UnusedEbsAnalysisView = ({ data }: { data: UnusedEbsTableData }) => {
    const getVal = (key: string) => data.metrics?.find(m => m.metric_name.includes(key))?.avg || 0;

    const volumeIdleTime = getVal("VolumeIdleTime");
    const volumeReadOps = getVal("VolumeReadOps");
    const volumeWriteOps = getVal("VolumeWriteOps");
    const volumeReadBytes = getVal("VolumeReadBytes");
    const volumeWriteBytes = getVal("VolumeWriteBytes");
    const burstBalance = getVal("BurstBalance");
    const volumeQueueLength = getVal("VolumeQueueLength");

    const billing = data.billing;

    let diag = { color: "border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900", icon: CheckCircle2, text: "Recurso Saludable" };
    if (volumeIdleTime > 50) diag = { color: "border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900", icon: ArrowDown, text: "Recurso Infrautilizado" };
    else if (volumeIdleTime > 30) diag = { color: "border-orange-200 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900", icon: AlertTriangle, text: "Bajo Uso" };

    return (
        <ScrollArea className="flex-1 h-full">
            <div className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`rounded-xl border p-5 flex items-start gap-4 ${diag.color} transition-all`}>
                        <div className="p-3 bg-white/80 dark:bg-black/20 rounded-full shadow-sm">
                            <diag.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="text-base font-bold">Diagnóstico: {diag.text}</h4>
                            <p className="text-sm opacity-90 mt-1 leading-relaxed">
                                Análisis basado en el comportamiento promedio de las métricas recolectadas.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-5 shadow-sm dark:border-slate-800 flex flex-col justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground mb-4">
                            <Wallet className="h-5 w-5 text-blue-500" />
                            <span className="text-sm font-semibold uppercase tracking-wider">Costo Estimado</span>
                        </div>
                        {billing ? (
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold tracking-tight">${billing.total_cost_usd.toFixed(2)}</span>
                                <span className="text-xs text-muted-foreground ml-1">USD</span>
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground italic">Información de facturación no disponible</div>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-muted-foreground" />
                        Métricas de Rendimiento
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <MetricCard
                            icon={Clock}
                            label="Volume Idle Time"
                            value={`${volumeIdleTime.toFixed(2)} seg`}
                            subtext="Tiempo promedio de inactividad"
                        />
                        <MetricCard
                            icon={BookOpen}
                            label="Volume Read Ops"
                            value={volumeReadOps.toFixed(2)}
                            subtext="Operaciones de lectura"
                        />
                        <MetricCard
                            icon={BookUp}
                            label="Volume Write Ops"
                            value={volumeWriteOps.toFixed(2)}
                            subtext="Operaciones de escritura"
                        />
                        <MetricCard
                            icon={ArrowDownToLine}
                            label="Volume Read Bytes"
                            value={`${bytesToMB(volumeReadBytes)} MB`}
                            subtext="Bytes de lectura"
                        />
                        <MetricCard
                            icon={ArrowUpFromLine}
                            label="Volume Write Bytes"
                            value={`${bytesToMB(volumeWriteBytes)} MB`}
                            subtext="Bytes de escritura"
                        />
                        <MetricCard
                            icon={Zap}
                            label="Burst Balance"
                            value={`${burstBalance.toFixed(2)}%`}
                            subtext="Reserva de rendimiento"
                        />
                        <MetricCard
                            icon={Layers}
                            label="Queue Length"
                            value={volumeQueueLength.toFixed(2)}
                            subtext="Operaciones en cola"
                        />
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
};

const MetricCard = ({ icon: Icon, label, value, subtext }: { icon: LucideIcon, label: string, value: string, subtext: string }) => (
    <div className="group relative overflow-hidden rounded-xl border bg-background p-5 hover:border-slate-400 dark:hover:border-slate-700 transition-colors">
        <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
            <Icon className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
        </div>
        <div className="space-y-1">
            <span className="text-2xl font-bold tracking-tight">{value}</span>
            <p className="text-xs text-muted-foreground">{subtext}</p>
        </div>
    </div>
);

export const UnusedEbsResourcesView = ({ data }: { data: UnusedEbsTableData }) => {
    const currentHistory = data.history && data.history.length > 0 ? data.history[0] : null;

    return (
        <ScrollArea className="flex-1 h-full">
            <div className="p-6 space-y-8">
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <HardDrive className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <h3 className="font-semibold text-lg">Información del Volumen</h3>
                    </div>

                    <div className="border rounded-xl p-4 bg-card shadow-sm dark:border-slate-800">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8">
                            <VolumeDetailItem label="Tipo" value={data.volume_type} />
                            <VolumeDetailItem label="Tamaño" value={`${data.size} GB`} />
                            <VolumeDetailItem label="IOPS" value={`${data.iops}`} />
                            <VolumeDetailItem label="Throughput" value={`${data.throughput} MB/s`} />
                            <VolumeDetailItem label="Estado" value={data.status} />
                            <VolumeDetailItem label="Región" value={data.region} />
                            <VolumeDetailItem label="Encriptado" value={data.encrypted ? "Sí" : "No"} />
                        </div>
                    </div>
                </section>

                <Separator />

                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <Link2 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <h3 className="font-semibold text-lg">Attachments</h3>
                    </div>

                    <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[25%]">Instance ID</TableHead>
                                    <TableHead>Device</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Attach Time</TableHead>
                                    <TableHead className="text-right">Delete on Termination</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentHistory?.attachments?.map((a, i) => (
                                    <TableRow key={i} className="hover:bg-muted/5">
                                        <TableCell className="font-mono text-xs text-slate-600 dark:text-slate-400">{a.InstanceId}</TableCell>
                                        <TableCell className="text-xs font-medium font-mono">{a.Device}</TableCell>
                                        <TableCell className="text-xs">{a.State}</TableCell>
                                        <TableCell className="text-xs font-mono">{a.AttachTime ? new Date(a.AttachTime).toLocaleString('es-CL') : '-'}</TableCell>
                                        <TableCell className="text-right">
                                            {a.DeleteOnTermination ?
                                                <Badge variant="default" className="text-[10px] h-5 px-2">Sí</Badge> :
                                                <Badge variant="outline" className="text-[10px] h-5 px-2">No</Badge>
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </section>
            </div>
        </ScrollArea>
    );
};

const VolumeDetailItem = ({ label, value }: { label: string, value: string }) => (
    <div className="flex flex-col">
        <span className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">{label}</span>
        <span className="text-sm font-medium font-mono">{value}</span>
    </div>
);

export const UnusedEbsHistoryView = ({ data }: { data: UnusedEbsTableData }) => {
    return (
        <ScrollArea className="flex-1 h-full">
            <div className="p-6">
                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-8 py-2">
                    {data.history?.map((h, i) => (
                        <div key={`${h.sync_time}-${i}`} className="relative pl-8">
                            <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-background transition-colors ${i === 0 ? 'bg-blue-500 ring-4 ring-blue-500/20' : 'bg-slate-300 dark:bg-slate-700'}`} />

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-foreground">
                                        {new Date(h.sync_time).toLocaleDateString()}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(h.sync_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                {i === 0 && <Badge variant="secondary" className="w-fit">Último Estado</Badge>}
                            </div>

                            <div className="rounded-xl border bg-card p-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                                <h2 className="text-lg font-semibold text-foreground mt-4 mb-2">Métricas del Volumen</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8">
                                    <HistoryMetricItem label="Idle Time Avg" value={`${h.metrics.volume_idle_time_avg.toFixed(2)} seg`} />
                                    <HistoryMetricItem label="Read Ops Avg" value={h.metrics.volume_read_ops_avg.toFixed(2)} />
                                    <HistoryMetricItem label="Write Ops Avg" value={h.metrics.volume_write_ops_avg.toFixed(2)} />
                                    <HistoryMetricItem label="Read Bytes Avg" value={`${bytesToMB(h.metrics.volume_read_bytes_avg)} MB`} />
                                    <HistoryMetricItem label="Write Bytes Avg" value={`${bytesToMB(h.metrics.volume_write_bytes_avg)} MB`} />
                                    <HistoryMetricItem label="Queue Length Avg" value={h.metrics.volume_queue_length_avg.toFixed(2)} />
                                    <HistoryMetricItem label="Burst Balance Avg" value={`${h.metrics.burst_balance_avg.toFixed(2)}%`} />
                                </div>
                                <h2 className="text-lg font-semibold text-foreground mt-4 mb-2">Metadata del Volumen</h2>
                                <div className='grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 my-5'>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Attachments</span>
                                        <span className="text-sm font-medium font-mono">{h.attachments ? h.attachments.length : 'Sin Attachments'}</span>
                                    </div>
                                    <div className="flex flex-col">

                                        <span className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Estado</span>
                                        <span className="text-sm font-medium font-mono">{h.status}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Throughput</span>
                                        <span className="text-sm font-medium font-mono">{h.throughput}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Tamaño</span>
                                        <span className="text-sm font-medium font-mono">{h.size}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Tipo</span>
                                        <span className="text-sm font-medium font-mono">{h.volume_type}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">IOPS</span>
                                        <span className="text-sm font-medium font-mono">{h.iops}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Encriptación</span>
                                        <span className="text-sm font-medium font-mono">{h.encrypted ? 'Encriptado' : 'No encriptado'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ScrollArea>
    )
};

const HistoryMetricItem = ({ label, value }: { label: string, value: string }) => (
    <div className="flex flex-col">
        <span className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">{label}</span>
        <span className="text-sm font-medium font-mono">{value}</span>
    </div>
);