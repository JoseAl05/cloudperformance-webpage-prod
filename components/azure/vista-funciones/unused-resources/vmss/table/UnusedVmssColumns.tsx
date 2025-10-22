'use client'
import { Badge } from '@/components/ui/badge';
import { DynamicColumn } from '@/components/general/data-table/columns';
import { useSearchParams } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AlertCircle, CheckCircle2, Copy, Eye, Globe, HardDrive, Network, X } from 'lucide-react';
import { UnusedVmss, UnusedVmssDiskDetails, UnusedVmssDisksData, UnusedVmssInterfaceData, UnusedVmssInterfaceDetails } from '@/interfaces/vista-unused-resources/unusedVmssInterface';

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
    const resourceType = parts[parts.length - 2]

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

const normalizeDisks = (details: UnusedVmssDiskDetails[]): UnusedVmssDisksData[] => {
    if (!details) return []

    if (Array.isArray(details) && details.length > 0 && "id" in (details[0] as unknown)) {
        return details as UnusedVmssDisksData[]
    }
    if (Array.isArray(details) && details.length > 0 && "disks" in (details[0] as unknown)) {
        const first = details[0] as UnusedVmssDiskDetails
        return Array.isArray(first.disks) ? first.disks : []
    }
    if (typeof details === "object" && "disks" in details!) {
        const obj = details as { disks?: UnusedVmssDisksData[] }
        return Array.isArray(obj.disks) ? obj.disks : []
    }
    return []
}

const normalizeNics = (details: UnusedVmssInterfaceDetails[]): UnusedVmssInterfaceData[] => {
    if (!details) return []
    if (Array.isArray(details) && details.length > 0 && "id" in (details[0] as unknown)) {
        return details as UnusedVmssInterfaceData[]
    }
    if (Array.isArray(details) && details.length > 0 && "interfaces" in (details[0] as unknown)) {
        const first = details[0] as UnusedVmssInterfaceDetails
        return Array.isArray(first.interfaces) ? first.interfaces : []
    }
    if (typeof details === "object" && "interfaces" in details!) {
        const obj = details as { interfaces?: UnusedVmssInterfaceData[] }
        return Array.isArray(obj.interfaces) ? obj.interfaces : []
    }
    return []
}

const DisksCell = ({ details }: { details?: UnusedVmssDiskDetails[] }) => {
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
                            Disco del sistema operativo de la VMSS
                        </DialogTitle>
                        <DialogDescription>
                            {total > 0 ? `${total} disco(s) de SO con un total de ${totalSize} GB` : "No hay discos de SO asociados a esta VMSS"}
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="max-h-[60vh] pr-4">
                        {total > 0 ? (
                            <div className="space-y-3">
                                {disks.map((d, i) => {
                                    return (
                                        <div
                                            key={d.id ?? i}
                                            className="w-full rounded-lg border bg-card p-4 space-y-3 hover:shadow-sm transition-shadow"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0 space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className="text-sm font-semibold break-all">{d.storage_account_type}</h4>
                                                        <Badge variant="default" className="text-xs shrink-0">
                                                            OS Disk
                                                        </Badge>
                                                    </div>
                                                    {d.os_type && <p className="text-xs text-muted-foreground">SO: {d.os_type}</p>}
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
                                <p className="text-sm text-muted-foreground">No hay discos de SO para mostrar</p>
                            </div>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}

const InterfacesCell = ({ details }: { details?: UnusedVmssInterfaceDetails }) => {
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

                                                                    {
                                                                        ip.public_ip_address?.id ? (
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
                                                                        ) : (
                                                                            <div className="space-y-1">
                                                                                <div className="text-muted-foreground flex items-center gap-1">
                                                                                    <Globe className="h-3 w-3" />
                                                                                    IP Pública
                                                                                </div>
                                                                                <div className="flex items-center gap-1">
                                                                                    <X className="h-3 w-3 text-red-600 dark:text-red-400" />
                                                                                    <span className="text-xs">No Configurada</span>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }
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

export const UnusedVmssColumns: DynamicColumn<UnusedVmss>[] = [
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
        header: "Nombre VMSS",
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
        header: "ID VMSS",
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
        cell: ({ row }) => <DisksCell details={row.original?.disk_details as UnusedVmssDiskDetails[] | undefined} />,
        size: 160,
    },
    {
        id: "interfaces",
        header: "Interfaces",
        cell: ({ row }) => (
            <InterfacesCell details={row.original?.interface_details as UnusedVmssInterfaceDetails[] | undefined} />
        ),
        size: 170,
    },
]