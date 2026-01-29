'use client'

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ghost, Activity, HardDrive, CalendarClock, CheckCircle2, AlertTriangle, Cpu, Network, CreditCard, ArrowDown } from 'lucide-react';
import { bytesToMB } from '@/lib/bytesToMbs';
import { UnusedCeTableData } from '@/interfaces/vista-unused-resources/unusedComputeEngineInterfaces';

export const UnusedCeAnalysisView = ({ data }: { data: UnusedCeTableData }) => {
    const getVal = (key: string) => data.metrics?.find(m => m.metric_name.includes(key))?.avg || 0;

    const cpuAvg = getVal("cpu_utilization");
    const netInOutPps = getVal("network_egress_pps") + getVal("network_ingress_pps");
    const netInOutThroughput = getVal("network_egress_throughput") + getVal("network_ingress_throughput");
    // Métricas de disco calculadas
    const diskInOutIops = getVal("disk_read_iops") + getVal("disk_write_iops");
    const diskInOutThroughput = getVal("disk_read_throughput") + getVal("disk_write_throughput");

    let diag = { color: "border-green-200 bg-green-50 text-green-700", icon: CheckCircle2, text: "Recurso Saludable" };
    if (cpuAvg < 10) diag = { color: "border-red-200 bg-red-50 text-red-700", icon: ArrowDown, text: "Recurso Infrautilizado" };
    else if (cpuAvg < 30) diag = { color: "border-orange-200 bg-orange-50 text-orange-700", icon: AlertTriangle, text: "Bajo Uso" };

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 grid gap-6">
                <div className={`rounded-lg border-l-4 p-4 shadow-sm flex items-start gap-3 border ${diag.color} bg-opacity-20`}>
                    <div className="p-2 bg-white/60 dark:bg-black/20 rounded-full">
                        <diag.icon className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">Diagnóstico: {diag.text}</h4>
                        <p className="text-xs opacity-90 mt-1">Análisis basado en el comportamiento promedio.</p>
                    </div>
                </div>

                {/* Grid actualizado para incluir métricas de disco */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Cpu className="h-4 w-4" /> <span className="text-xs font-bold uppercase">CPU Avg</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{cpuAvg.toFixed(2)}%</p>
                    </div>

                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Activity className="h-4 w-4" /> <span className="text-xs font-bold uppercase">Net (I/O) PPS</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{netInOutPps.toLocaleString()}</p>
                    </div>

                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Network className="h-4 w-4" /> <span className="text-xs font-bold uppercase">Net (I/O) Throughput</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{bytesToMB(netInOutThroughput)} MB/s</p>
                    </div>

                    {/* Tarjetas de Disco agregadas */}
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <HardDrive className="h-4 w-4" /> <span className="text-xs font-bold uppercase">Disk (I/O) IOPS</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{diskInOutIops.toLocaleString()}</p>
                    </div>

                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <HardDrive className="h-4 w-4" /> <span className="text-xs font-bold uppercase">Disk (I/O) Throughput</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{bytesToMB(diskInOutThroughput)} MB/s</p>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
};

export const UnusedCeBillingView = ({ data }: { data: UnusedCeTableData }) => {
    const b = data.billing;

    return (
        <ScrollArea className="flex-1">
            <div className="p-6">
                <div className="border rounded-lg overflow-hidden dark:border-slate-800">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900">
                            <TableRow>
                                <TableHead>Recurso Global</TableHead>
                                <TableHead className="text-right">Costo (USD)</TableHead>
                                <TableHead className="text-right">Costo (CLP)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {b ? (
                                <TableRow>
                                    <TableCell className="font-medium text-xs">{b.resource_global_name}</TableCell>
                                    <TableCell className="text-xs text-right font-mono text-green-600 dark:text-green-400">
                                        ${b.total_cost_usd.toFixed(4)}
                                    </TableCell>
                                    <TableCell className="text-xs text-right font-mono text-slate-500">
                                        ${b.total_cost_clp.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-xs text-muted-foreground py-4">
                                        Sin datos de facturación
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </ScrollArea>
    );
};

export const UnusedCeResourcesView = ({ data }: { data: UnusedCeTableData }) => {
    const currentHistory = data.history && data.history.length > 0 ? data.history[0] : null;

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
                <div className="space-y-4">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <HardDrive className="h-4 w-4" /> Discos Asociados
                    </h3>
                    <div className="border rounded-lg overflow-hidden dark:border-slate-800">
                        <Table>
                            <TableHeader className="bg-slate-50 dark:bg-slate-900">
                                <TableRow>
                                    <TableHead>Device</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Boot</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentHistory?.disks?.map((d, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-mono text-xs">{d.deviceName}</TableCell>
                                        <TableCell className="text-xs">{d.type}</TableCell>
                                        <TableCell className="text-xs">{d.diskSizeGb} GB</TableCell>
                                        <TableCell className="text-xs">
                                            {d.boot ? <Badge variant="secondary">Boot</Badge> : <span className="text-muted-foreground">-</span>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <Network className="h-4 w-4" /> Interfaces de Red
                    </h3>
                    {currentHistory?.networkInterfaces?.map((ni, i) => (
                        <div key={i} className="border rounded-lg p-4 dark:border-slate-800">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="font-semibold text-sm">{ni.name}</span>
                                <Badge variant="outline" className="ml-auto">{ni.stackType}</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div><span className="text-muted-foreground">Network:</span> {ni.network}</div>
                                <div><span className="text-muted-foreground">IP:</span> <span className="font-mono">{ni.networkIP}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ScrollArea>
    );
};

export const UnusedCeHistoryView = ({ data }: { data: UnusedCeTableData }) => (
    <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
            {data.history?.map((h, i) => (
                <div key={i} className="flex gap-4 items-start group">
                    <div className="flex flex-col items-center mt-5">
                        <div className="w-2 h-2 rounded-full bg-slate-300 group-first:bg-blue-500 ring-4 ring-white dark:ring-slate-950 flex-shrink-0" />
                        {i !== data.history.length - 1 && <div className="w-px h-full bg-slate-200 my-1 min-h-[50px]" />}
                    </div>
                    <div className="flex-1 border rounded-lg p-4 text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors dark:border-slate-800">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <CalendarClock className="h-4 w-4" />
                                <span className="font-mono text-xs">{new Date(h.sync_time).toLocaleString()}</span>
                            </div>
                            {i === 0 && <Badge>Actual</Badge>}
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded border dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <span className="text-[10px] text-muted-foreground block">CPU Avg</span>
                                <span className="font-bold text-xs">{h.metrics.cpu_avg.toFixed(2)}%</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-muted-foreground block">Net In (Avg)</span>
                                <span className="font-bold text-xs">{bytesToMB(h.metrics.net_ingress_avg)} MB</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-muted-foreground block">Net Out (Avg)</span>
                                <span className="font-bold text-xs">{bytesToMB(h.metrics.net_egress_avg)} MB</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-muted-foreground block">Disk Read (Avg)</span>
                                <span className="font-bold text-xs">{bytesToMB(h.metrics.disk_read_avg)} MB</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </ScrollArea>
);