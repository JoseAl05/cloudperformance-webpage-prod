'use client'
import { Badge } from '@/components/ui/badge';
import { DynamicColumn } from '@/components/data-table/columns';
import { useSearchParams } from 'next/navigation';
import { UnusedVm, UnusedVmDiskDetails, UnusedVmDisksData, UnusedVmInterfaceData, UnusedVmInterfaceDetails } from '@/interfaces/vista-unused-resources/unusedVmInterfaces';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AlertCircle, CheckCircle2, Copy, Eye, Globe, HardDrive, Network } from 'lucide-react';

const DateParams = () => {
    const searchParams = useSearchParams();

    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    return { startDateParam: startDateParam, endDateParam: endDateParam }
}

const CopyBtn = ({ text, label = 'Copiado' }: { text: string; label?: string }) => (
    <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2"
        onClick={() => {
            navigator.clipboard.writeText(text)
            toast.success(label)
        }}
        aria-label="Copiar"
        title="Copiar"
    >
        <Copy className="h-3.5 w-3.5" />
    </Button>
)

const ShortenedId = ({ id }: { id: string }) => {
    const parts = id.split("/")
    const resourceName = parts[parts.length - 1]
    const resourceType = parts[parts.length - 3]

    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{resourceName}</div>
                <div className="text-xs text-muted-foreground">{resourceType}</div>
            </div>
            <CopyBtn text={id} label="ID copiado" />
        </div>
    )
}

const normalizeDisks = (details: UnusedVmDiskDetails[]): UnusedVmDisksData[] => {
    if (!details) return []

    if (Array.isArray(details) && details.length > 0 && "id" in (details[0] as unknown)) {
        return details as UnusedVmDisksData[]
    }
    if (Array.isArray(details) && details.length > 0 && "disks" in (details[0] as unknown)) {
        const first = details[0] as UnusedVmDiskDetails
        return Array.isArray(first.disks) ? first.disks : []
    }
    if (typeof details === "object" && "disks" in details!) {
        const obj = details as { disks?: UnusedVmDisksData[] }
        return Array.isArray(obj.disks) ? obj.disks : []
    }
    return []
}

const normalizeNics = (details: UnusedVmInterfaceDetails[]): UnusedVmInterfaceData[] => {
    if (!details) return []
    if (Array.isArray(details) && details.length > 0 && "id" in (details[0] as unknown)) {
        return details as UnusedVmInterfaceData[]
    }
    if (Array.isArray(details) && details.length > 0 && "interfaces" in (details[0] as unknown)) {
        const first = details[0] as UnusedVmInterfaceDetails
        return Array.isArray(first.interfaces) ? first.interfaces : []
    }
    if (typeof details === "object" && "interfaces" in details!) {
        const obj = details as { interfaces?: UnusedVmInterfaceData[] }
        return Array.isArray(obj.interfaces) ? obj.interfaces : []
    }
    return []
}

const DisksCell = ({ details }: { details?: UnusedVmDiskDetails[] }) => {
    const disks = normalizeDisks(details)
    const total = disks.length
    const totalSize = disks.reduce((sum, d) => sum + (d.disk_size_gb || 0), 0)
    const [open, setOpen] = useState(false)

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs font-medium">
                    {total} {total === 1 ? "disco" : "discos"}
                </Badge>
                {totalSize > 0 && <span className="text-xs text-muted-foreground">({totalSize} GB)</span>}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-accent">
                        <Eye className="h-3.5 w-3.5" />
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <HardDrive className="h-5 w-5" />
                            Discos de la VM
                        </DialogTitle>
                        <DialogDescription>
                            {total > 0 ? `${total} disco(s) con un total de ${totalSize} GB` : "No hay discos asociados a esta VM"}
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="max-h-[60vh] pr-4">
                        {total > 0 ? (
                            <div className="space-y-3">
                                {disks.map((d, i) => {
                                    const isOsDisk = d.name.toLowerCase().includes("osdisk")

                                    return (
                                        <div
                                            key={d.id ?? i}
                                            className="w-full rounded-lg border bg-card p-4 space-y-3 hover:shadow-sm transition-shadow"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0 space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className="text-sm font-semibold break-all">{d.name}</h4>
                                                        {isOsDisk && (
                                                            <Badge variant="default" className="text-xs shrink-0">
                                                                OS Disk
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {d.vm_name && <p className="text-xs text-muted-foreground">VM: {d.vm_name}</p>}
                                                </div>
                                                <Badge variant="outline" className="text-sm font-semibold shrink-0">
                                                    {d.disk_size_gb ?? "—"} GB
                                                </Badge>
                                            </div>

                                            {d.id && (
                                                <div className="pt-2 border-t">
                                                    <div className="flex items-start gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-xs text-muted-foreground mb-1">Resource ID</div>
                                                            <code className="block text-xs font-mono text-muted-foreground break-all">{d.id}</code>
                                                        </div>
                                                        <CopyBtn text={d.id} label="ID copiado" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <HardDrive className="h-12 w-12 text-muted-foreground/50 mb-3" />
                                <p className="text-sm text-muted-foreground">No hay discos para mostrar</p>
                            </div>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}

const InterfacesCell = ({ details }: { details?: UnusedVmInterfaceDetails }) => {
    const nics = normalizeNics(details)
    const total = nics.length
    const [open, setOpen] = useState(false)

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
                <Network className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs font-medium">
                    {total} {total === 1 ? "NIC" : "NICs"}
                </Badge>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-accent">
                        <Eye className="h-3.5 w-3.5" />
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Network className="h-5 w-5" />
                            Interfaces de Red
                        </DialogTitle>
                        <DialogDescription>
                            {total > 0 ? `${total} interfaz(es) de red configurada(s)` : "No hay interfaces de red asociadas"}
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="max-h-[65vh] pr-4">
                        {total > 0 ? (
                            <div className="space-y-4">
                                {nics.map((n, i) => {
                                    const statusColor =
                                        n.provisioning_state === "Succeeded"
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-yellow-600 dark:text-yellow-400"

                                    return (
                                        <div
                                            key={n.id ?? i}
                                            className="rounded-lg border bg-card p-4 space-y-4 hover:shadow-sm transition-shadow"
                                        >
                                            {/* NIC Header */}
                                            <div className="space-y-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h4 className="text-sm font-semibold truncate">{n.name}</h4>
                                                            {n.primary && (
                                                                <Badge variant="default" className="text-xs">
                                                                    Primary
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            <Badge variant="outline" className="text-xs">
                                                                {n.nic_type ?? "Standard"}
                                                            </Badge>
                                                            <Badge variant="outline" className={`text-xs ${statusColor}`}>
                                                                {n.provisioning_state === "Succeeded" ? (
                                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                ) : (
                                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                                )}
                                                                {n.provisioning_state ?? "Unknown"}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>

                                                {n.id && (
                                                    <div className="pt-2 border-t">
                                                        <ShortenedId id={n.id} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* IP Configurations */}
                                            {(n.ip_configurations ?? []).length > 0 && (
                                                <div className="space-y-2">
                                                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                        Configuraciones IP
                                                    </h5>
                                                    <div className="grid gap-3">
                                                        {n.ip_configurations.map((ip, k) => (
                                                            <div key={ip.id ?? k} className="rounded-md border bg-muted/30 p-3 space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-sm font-medium">{ip.name}</span>
                                                                    <div className="flex items-center gap-2">
                                                                        {ip.primary && (
                                                                            <Badge variant="secondary" className="text-xs">
                                                                                Primary
                                                                            </Badge>
                                                                        )}
                                                                        <Badge variant="outline" className="text-xs">
                                                                            {ip.private_ip_address_version ?? "IPv4"}
                                                                        </Badge>
                                                                    </div>
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                                                    <div className="space-y-1">
                                                                        <div className="text-muted-foreground">IP Privada</div>
                                                                        <code className="block px-2 py-1 rounded bg-background font-mono text-xs">
                                                                            {ip.private_ip_address ?? "—"}
                                                                        </code>
                                                                        <div className="text-muted-foreground text-2xs">
                                                                            {ip.private_ip_allocation_method ?? "Dynamic"}
                                                                        </div>
                                                                    </div>

                                                                    {ip.public_ip_address?.id && (
                                                                        <div className="space-y-1">
                                                                            <div className="text-muted-foreground flex items-center gap-1">
                                                                                <Globe className="h-3 w-3" />
                                                                                IP Pública
                                                                            </div>
                                                                            <div className="flex items-center gap-1">
                                                                                <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                                                                                <span className="text-xs">Configurada</span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {ip.subnet?.id && (
                                                                    <div className="pt-2 border-t space-y-1">
                                                                        <div className="text-muted-foreground text-2xs">Subred</div>
                                                                        <div className="flex items-center gap-2">
                                                                            <code className="flex-1 px-2 py-1 rounded bg-background font-mono text-2xs truncate">
                                                                                {ip.subnet.id.split("/").slice(-1)[0]}
                                                                            </code>
                                                                            <CopyBtn text={ip.subnet.id} label="Subred copiada" />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {(n.ip_configurations?.length ?? 0) === 0 && (
                                                <div className="text-xs text-muted-foreground italic">Sin configuraciones IP</div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Network className="h-12 w-12 text-muted-foreground/50 mb-3" />
                                <p className="text-sm text-muted-foreground">No hay interfaces de red para mostrar</p>
                            </div>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export const UnusedVmColumns: DynamicColumn<UnusedVm>[] = [
    {
        header: "Fecha Observación",
        accessorKey: "sync_time",
        cell: (info) => {
            const value = info.getValue() as string;
            return (
                <div className="text-sm text-muted-foreground font-mono">
                    {value}
                </div>
            );
        }
    },
    {
        header: "Nombre VM",
        accessorKey: "vm_name",
        cell: (info) => {
            const value = info.getValue() as string;
            const startDate = DateParams().startDateParam;
            const endDate = DateParams().endDateParam
            return (
                <div className="font-medium">
                    <Badge variant="secondary" className="ml-3 font-mono text-sm transition-all hover:scale-[1.02]">
                        {value}
                    </Badge>
                </div>
            );
        }
    },
    {
        header: "ID VM",
        accessorKey: "vm_id",
        cell: (info) => {
            const value = info.getValue() as string;
            const startDate = DateParams().startDateParam;
            const endDate = DateParams().endDateParam
            return (
                <div className="font-medium">
                    <Badge variant="secondary" className="ml-3 font-mono text-sm transition-all hover:scale-[1.02]">
                        {value}
                    </Badge>
                </div>
            );
        }
    },
    {
        header: "Suscripción",
        accessorKey: "subscription",
        cell: (info) => (
            <div className="text-sm text-muted-foreground">
                {info.getValue() as string}
            </div>
        )
    },
    {
        header: "Localización",
        accessorKey: "location",
        cell: (info) => (
            <div className="text-sm text-muted-foreground">
                {info.getValue() as string}
            </div>
        )
    },
    {
        accessorKey: "cpu_total",
        header: "CPUs",
        cell: (info) => (
            <div className="text-sm text-muted-foreground">
                {info.getValue() as number} vCores
            </div>
        ),
    },
    {
        accessorKey: "memory_total",
        header: "Memoria",
        cell: (info) => (
            <div className="text-sm text-muted-foreground">
                {info.getValue() as number} GB
            </div>
        ),
    },
    {
        id: "discos",
        header: "Discos",
        cell: ({ row }) => <DisksCell details={row.original?.disk_details as UnusedVmDiskDetails[] | undefined} />,
        size: 160,
    },
    {
        id: "interfaces",
        header: "Interfaces",
        cell: ({ row }) => (
            <InterfacesCell details={row.original?.interface_details as UnusedVmInterfaceDetails[] | undefined} />
        ),
        size: 170,
    },
    // --- NUEVO: columnas de métricas FinOps ---
    {
        id: "cpu_promedio",
        header: "CPU Prom %",
        cell: ({ row }) => {
            const series = row.original?.series ?? [];
            const cpuVals = series.filter(s => s.name === 'Percentage CPU').map(s => s.metric_value);
            const avg = cpuVals.length ? cpuVals.reduce((a, b) => a + b, 0) / cpuVals.length : null;
            return (
                <div className="text-sm text-muted-foreground">
                    {avg != null ? `${avg.toFixed(2)} %` : '—'}
                </div>
            );
        },
        size: 110,
    },
    {
        id: "cpu_max",
        header: "CPU Máx %",
        cell: ({ row }) => {
            const series = row.original?.series ?? [];
            const vals = series.filter(s => s.name === 'Percentage CPU' && s.metric_value_maximum != null).map(s => s.metric_value_maximum as number);
            const max = vals.length ? Math.max(...vals) : null;
            return (
                <div className="text-sm text-red-500">
                    {max != null ? `${max.toFixed(2)} %` : '—'}
                </div>
            );
        },
        size: 110,
    },
    {
        id: "cpu_min",
        header: "CPU Mín %",
        cell: ({ row }) => {
            const series = row.original?.series ?? [];
            const vals = series.filter(s => s.name === 'Percentage CPU' && s.metric_value_minimum != null).map(s => s.metric_value_minimum as number);
            const min = vals.length ? Math.min(...vals) : null;
            return (
                <div className="text-sm text-yellow-500">
                    {min != null ? `${min.toFixed(2)} %` : '—'}
                </div>
            );
        },
        size: 110,
    },
    {
        id: "mem_promedio",
        header: "Mem Prom GB",
        cell: ({ row }) => {
            const BYTES_TO_GB = 1_073_741_824;
            const series = row.original?.series ?? [];
            const vals = series.filter(s => s.name === 'Available Memory').map(s => s.metric_value / BYTES_TO_GB);
            const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
            return (
                <div className="text-sm text-muted-foreground">
                    {avg != null ? `${avg.toFixed(2)} GB` : '—'}
                </div>
            );
        },
        size: 120,
    },
    {
        id: "mem_max",
        header: "Mem Máx GB",
        cell: ({ row }) => {
            const BYTES_TO_GB = 1_073_741_824;
            const series = row.original?.series ?? [];
            const vals = series
                .filter(s => s.name === 'Available Memory' && s.metric_value_maximum != null)
                .map(s => (s.metric_value_maximum as number) / BYTES_TO_GB);
            const max = vals.length ? Math.max(...vals) : null;
            return (
                <div className="text-sm text-red-500">
                    {max != null ? `${max.toFixed(2)} GB` : '—'}
                </div>
            );
        },
        size: 120,
    },
    {
        id: "mem_min",
        header: "Mem Mín GB",
        cell: ({ row }) => {
            const BYTES_TO_GB = 1_073_741_824;
            const series = row.original?.series ?? [];
            const vals = series
                .filter(s => s.name === 'Available Memory' && s.metric_value_minimum != null)
                .map(s => (s.metric_value_minimum as number) / BYTES_TO_GB);
            const min = vals.length ? Math.min(...vals) : null;
            return (
                <div className="text-sm text-yellow-500">
                    {min != null ? `${min.toFixed(2)} GB` : '—'}
                </div>
            );
        },
        size: 120,
    },
    {
        id: "costo_estimado",
        header: "Costo Est. USD",
        cell: ({ row }) => {
            const costo = row.original?.costo_estimado_usd;
            return (
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {costo != null ? `$ ${costo.toFixed(6)}` : '—'}
                </div>
            );
        },
        size: 140,
    },
]