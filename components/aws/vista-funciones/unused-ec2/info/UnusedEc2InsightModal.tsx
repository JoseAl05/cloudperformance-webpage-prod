'use client'

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ghost, Activity, HardDrive, CalendarClock, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';
import { bytesToMB } from '@/lib/bytesToMbs';
import { Ec2TableRow } from '@/interfaces/general-interfaces/ec2MetricsTableData';

export const UnusedEc2AnalysisView = ({ data }: { data: Ec2TableRow }) => {
    const getVal = (key: string) => data.metrics?.find(m => m.metric_name.includes(key))?.avg || 0;
    const cpuAvg = getVal("CPUUtilization");
    const netIn = getVal("NetworkIn");
    const netOut = getVal("NetworkOut");

    let diag = { color: "border-green-200 bg-green-50 text-green-700", icon: CheckCircle2, text: "Recurso Saludable" };
    if (cpuAvg < 5) diag = { color: "border-red-200 bg-red-50 text-red-700", icon: Ghost, text: "Posible Zombie" };
    else if (cpuAvg < 20) diag = { color: "border-orange-200 bg-orange-50 text-orange-700", icon: AlertTriangle, text: "Infrautilizado" };

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: "CPU Avg", val: `${cpuAvg.toFixed(2)}%`, icon: Cpu },
                        { label: "Net In", val: `${bytesToMB(netIn)} MB`, icon: Activity },
                        { label: "Net Out", val: `${bytesToMB(netOut)} MB`, icon: Activity }
                    ].map((kpi, i) => (
                        <div key={i} className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                                <kpi.icon className="h-4 w-4" /> <span className="text-xs font-bold uppercase">{kpi.label}</span>
                            </div>
                            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{kpi.val}</p>
                        </div>
                    ))}
                </div>
            </div>
        </ScrollArea>
    );
};

export const UnusedEc2ResourcesView = ({ data }: { data: Ec2TableRow }) => (
    <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
            <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-slate-500" /> Volúmenes EBS
                </h4>
                <div className="border rounded-lg overflow-hidden dark:border-slate-800">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900">
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>State</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.volumes.map(v => (
                                <TableRow key={v.volume_id}>
                                    <TableCell className="font-mono text-xs">{v.volume_id}</TableCell>
                                    <TableCell className="text-xs">{v.history[0]?.size} GB</TableCell>
                                    <TableCell><Badge variant="outline">{v.history[0]?.state}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    </ScrollArea>
);

export const UnusedEc2HistoryView = ({ data }: { data: Ec2TableRow }) => (
    <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
            {data.history.map((h, i) => (
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
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded border dark:border-slate-800 grid grid-cols-3 gap-4">
                            <div><span className="text-[10px] text-muted-foreground block">CPU</span><span className="font-bold text-xs">{h.metrics.cpu_avg.toFixed(2)}%</span></div>
                            <div><span className="text-[10px] text-muted-foreground block">Net In</span><span className="font-bold text-xs">{bytesToMB(h.metrics.net_in_avg)} MB</span></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </ScrollArea>
);