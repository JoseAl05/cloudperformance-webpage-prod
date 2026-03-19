'use client'

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, HardDrive, CheckCircle2, AlertTriangle, Cpu, Network, ArrowDown, Wallet, LucideIcon, Zap, ShieldAlert } from 'lucide-react';
import { bytesToMB } from '@/lib/bytesToMbs';
import { Separator } from "@/components/ui/separator";
import { UnusedEc2TableData } from '@/interfaces/vista-unused-resources/unusedEc2InstanceInterfaces';

export const UnusedEc2AnalysisView = ({ data }: { data: UnusedEc2TableData }) => {
    const getVal = (key: string) => data.metrics?.find(m => m.metric_name.includes(key))?.avg || 0;

    const cpuAvg = getVal("CPUUtilization");
    const netIn = getVal("NetworkIn");
    const netOut = getVal("NetworkOut");
    const cpuCreditUsage = getVal("CPUCreditUsage");
    const cpuCreditBalance = getVal("CPUCreditBalance");
    const statusCheckFailed = getVal("StatusCheckFailed");

    const billing = data.billing;

    let diag = { color: "border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900", icon: CheckCircle2, text: "Recurso Saludable" };
    if (cpuAvg < 10) diag = { color: "border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900", icon: ArrowDown, text: "Recurso Infrautilizado" };
    else if (cpuAvg < 30) diag = { color: "border-orange-200 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900", icon: AlertTriangle, text: "Bajo Uso" };

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
                            icon={Cpu}
                            label="CPU Promedio"
                            value={`${cpuAvg.toFixed(2)}%`}
                            subtext="Utilización general"
                        />
                        <MetricCard
                            icon={Network}
                            label="Network In"
                            value={`${bytesToMB(netIn)} MB/s`}
                            subtext="Tráfico entrante"
                        />
                        <MetricCard
                            icon={Network}
                            label="Network Out"
                            value={`${bytesToMB(netOut)} MB/s`}
                            subtext="Tráfico saliente"
                        />
                        <MetricCard
                            icon={Zap}
                            label="CPU Credit Usage"
                            value={cpuCreditUsage.toFixed(2)}
                            subtext="Créditos consumidos"
                        />
                        <MetricCard
                            icon={Zap}
                            label="CPU Credit Balance"
                            value={cpuCreditBalance.toFixed(2)}
                            subtext="Créditos acumulados"
                        />
                        <MetricCard
                            icon={ShieldAlert}
                            label="Status Check Failed"
                            value={statusCheckFailed.toFixed(2)}
                            subtext="Verificaciones fallidas"
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

export const UnusedEc2ResourcesView = ({ data }: { data: UnusedEc2TableData }) => {
    const currentHistory = data.history && data.history.length > 0 ? data.history[0] : null;

    return (
        <ScrollArea className="flex-1 h-full">
            <div className="p-6 space-y-8">
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <HardDrive className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <h3 className="font-semibold text-lg">Almacenamiento (EBS)</h3>
                    </div>

                    <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[30%]">Dispositivo</TableHead>
                                    <TableHead>Volume ID</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Delete on Termination</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentHistory?.disks?.map((d, i) => (
                                    <TableRow key={i} className="hover:bg-muted/5">
                                        <TableCell className="font-mono text-xs text-slate-600 dark:text-slate-400">{d.DeviceName}</TableCell>
                                        <TableCell className="text-xs font-medium font-mono">{d.Ebs.VolumeId}</TableCell>
                                        <TableCell className="text-xs">{d.Ebs.Status}</TableCell>
                                        <TableCell className="text-right">
                                            {d.Ebs.DeleteOnTermination ?
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

                <Separator />

                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <Network className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <h3 className="font-semibold text-lg">Red</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {currentHistory?.networkInterfaces?.map((ni, i) => (
                            <div key={i} className="border rounded-xl p-4 bg-card hover:shadow-md transition-shadow dark:border-slate-800">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-primary font-mono">{ni.NetworkInterfaceId}</span>
                                        <span className="text-xs text-muted-foreground mt-0.5">{ni.InterfaceType}</span>
                                    </div>
                                    <Badge variant="outline" className="bg-background">{ni.Status}</Badge>
                                </div>
                                <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">VPC</span>
                                        <span className="font-medium font-mono">{ni.VpcId}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Subnet</span>
                                        <span className="font-medium font-mono">{ni.SubnetId}</span>
                                    </div>
                                    <div className="flex justify-between text-xs items-center">
                                        <span className="text-muted-foreground">Private IP</span>
                                        <code className="bg-background px-1.5 py-0.5 rounded border text-[10px] font-mono">{ni.PrivateIpAddress}</code>
                                    </div>
                                    {ni.Association?.PublicIp && (
                                        <div className="flex justify-between text-xs items-center">
                                            <span className="text-muted-foreground">Public IP</span>
                                            <code className="bg-background px-1.5 py-0.5 rounded border text-[10px] font-mono">{ni.Association.PublicIp}</code>
                                        </div>
                                    )}
                                    {ni.Groups?.length > 0 && (
                                        <div className="flex justify-between text-xs items-start">
                                            <span className="text-muted-foreground">Security Groups</span>
                                            <div className="flex flex-col items-end gap-1">
                                                {ni.Groups.map((g, idx) => (
                                                    <span key={idx} className="font-medium text-[10px]">{g.GroupName}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </ScrollArea>
    );
};

export const UnusedEc2HistoryView = ({ data }: { data: UnusedEc2TableData }) => {
    return (
        <ScrollArea className="flex-1 h-full">
            <div className="p-6">
                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-8 py-2">
                    {data.history?.map((h, i) => (
                        <div key={i} className="relative pl-8">
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
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8">
                                    <HistoryMetricItem label="CPU Avg" value={`${h.metrics.cpu_avg.toFixed(2)}%`} />
                                    <HistoryMetricItem label="Net Ingress" value={`${bytesToMB(h.metrics.net_ingress_avg)} MB`} />
                                    <HistoryMetricItem label="Net Egress" value={`${bytesToMB(h.metrics.net_egress_avg)} MB`} />
                                    <HistoryMetricItem label="Credit Usage" value={h.metrics.cpu_credits_usage_avg.toFixed(2)} />
                                    <HistoryMetricItem label="Credit Balance" value={h.metrics.cpu_credits_balance_avg.toFixed(2)} />
                                    <HistoryMetricItem label="Status Check" value={h.metrics.status_check_failed_avg.toFixed(2)} />
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