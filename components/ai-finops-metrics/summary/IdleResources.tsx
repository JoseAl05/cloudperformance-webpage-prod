import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HardDrive, Globe, ShieldCheck, PauseCircle, Database, PiggyBank } from 'lucide-react';
import { AiFinopsMetrics, IdleDisk, IdlePublicIp } from '@/interfaces/ai-finops-metrics/aiFinopsMetricsInterfaces';

interface IdleResourcesProps {
    data: AiFinopsMetrics;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const REASON_META: Record<string, { label: string; className: string }> = {
    unattached: {
        label: 'Sin adjuntar',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800',
    },
    owner_vm_deallocated: {
        label: 'VM detenida',
        className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800',
    },
};

const ReasonBadge = ({ reason }: { reason: string }) => {
    const meta = REASON_META[reason] ?? {
        label: reason,
        className: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    };
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border whitespace-nowrap ${meta.className}`}>
            {reason === 'unattached' ? <ShieldCheck className="h-3 w-3" /> : <PauseCircle className="h-3 w-3" />}
            {meta.label}
        </span>
    );
};

export const IdleResources = ({ data }: IdleResourcesProps) => {
    const idle = data.idle_resources;
    console.log(data);

    const { diskTotal, ipTotal, diskCount, ipCount, hasItems } = useMemo(() => {
        const disks = idle?.idle_disks ?? [];
        const ips = idle?.idle_public_ips ?? [];
        return {
            diskTotal: disks.reduce((acc, d) => acc + (d.monthly_cost_in_usd || 0), 0),
            ipTotal: ips.reduce((acc, p) => acc + (p.monthly_cost_in_usd || 0), 0),
            diskCount: disks.length,
            ipCount: ips.length,
            hasItems: disks.length > 0 || ips.length > 0,
        };
    }, [idle]);

    if (!idle || !hasItems) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex items-center gap-3 py-6">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    <p className="text-sm text-muted-foreground">
                        No se detectaron recursos inactivos facturables en este período.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <Card className="relative overflow-hidden border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/30 shadow-sm">
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <span className="p-2 rounded-full bg-green-500/10">
                            <PiggyBank className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </span>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Ahorro por limpieza de recursos inactivos
                            </span>
                            <span className="text-3xl font-extrabold tracking-tight text-green-600 dark:text-green-400">
                                {formatCurrency(idle.total_savings_usd)}
                                <span className="text-sm font-medium text-muted-foreground"> / mes</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <div className="flex flex-col items-start sm:items-end">
                            <span className="text-xs text-muted-foreground">Discos ({diskCount})</span>
                            <span className="text-sm font-semibold">
                                {formatCurrency(diskTotal)}
                            </span>
                        </div>
                        <div className="flex flex-col items-start sm:items-end">
                            <span className="text-xs text-muted-foreground">IPs públicas ({ipCount})</span>
                            <span className="text-sm font-semibold">
                                {formatCurrency(ipTotal)}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card className="flex flex-col border-t-4 border-t-blue-500 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <Database className="h-5 w-5 text-blue-500" />
                            Discos inactivos
                        </CardTitle>
                        <CardDescription>Discos facturándose sin una VM activa asociada.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {diskCount === 0 ? (
                            <p className="px-4 pb-4 text-sm text-muted-foreground">Sin discos inactivos.</p>
                        ) : (
                            <div className="divide-y divide-border">
                                {idle.idle_disks.map((disk) => (
                                    <DiskRow key={disk.id} disk={disk} />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="flex flex-col border-t-4 border-t-indigo-500 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <Globe className="h-5 w-5 text-indigo-500" />
                            IPs públicas inactivas
                        </CardTitle>
                        <CardDescription>Direcciones IP facturándose sin asociación activa.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {ipCount === 0 ? (
                            <p className="px-4 pb-4 text-sm text-muted-foreground">Sin IPs públicas inactivas.</p>
                        ) : (
                            <div className="divide-y divide-border">
                                {idle.idle_public_ips.map((ip) => (
                                    <PublicIpRow key={ip.id} ip={ip} />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const DiskRow = ({ disk }: { disk: IdleDisk }) => (
    <div className="flex items-start justify-between gap-3 p-4 transition-colors hover:bg-muted/40">
        <div className="flex min-w-0 flex-col gap-1.5">
            <span className="truncate text-sm font-medium text-foreground" title={disk.name}>
                {disk.name}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
                <ReasonBadge reason={disk.reason} />
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                    <HardDrive className="h-3 w-3" />
                    {disk.disk_size_gb} GB
                </span>
                <span className="text-[10px] text-muted-foreground">{disk.disk_state}</span>
            </div>
        </div>
        <span className="shrink-0 whitespace-nowrap text-sm font-bold text-green-600 dark:text-green-400">
            {formatCurrency(disk.monthly_cost_in_usd)}
        </span>
    </div>
);

const PublicIpRow = ({ ip }: { ip: IdlePublicIp }) => (
    <div className="flex items-start justify-between gap-3 p-4 transition-colors hover:bg-muted/40">
        <div className="flex min-w-0 flex-col gap-1.5">
            <span className="truncate text-sm font-medium text-foreground" title={ip.name}>
                {ip.name}
            </span>
            {ip.allocation_method && (
                <span className="inline-flex w-fit items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                    {ip.allocation_method}
                </span>
            )}
        </div>
        <span className="shrink-0 whitespace-nowrap text-sm font-bold text-green-600 dark:text-green-400">
            {formatCurrency(ip.monthly_cost_in_usd)}
        </span>
    </div>
);