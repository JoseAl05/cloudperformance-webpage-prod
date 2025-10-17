'use client'
import { Badge } from '@/components/ui/badge';
import { DynamicColumn } from '@/components/general/data-table/columns';
import { useSearchParams } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AlertCircle, CheckCircle2, Copy, Eye, Puzzle } from 'lucide-react';
import { UnusedVmssDiskDetails, UnusedVmssDisksData } from '@/interfaces/vista-unused-resources/unusedVmssInterface';
import { UnusedVmExtensions, UnusedVmExtensionsData } from '@/interfaces/vista-unused-resources/unusedVmExtensionsInterfaces';

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

const ExtensionsCell = ({ details }: { details?: UnusedVmExtensionsData[] }) => {
    const total = details?.length ?? 0;
    const [open, setOpen] = useState(false);

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
                <Puzzle className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs font-medium">
                    {total} {total === 1 ? "Extensión" : "Extensiones"}
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
                            <Puzzle className="h-5 w-5" />
                            Extensiones VM
                        </DialogTitle>
                        <DialogDescription>
                            {total > 0 ? `${total} extensiones instaladas` : "No hay extensiones instaladas"}
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="max-h-[65vh] pr-4">
                        {total > 0 ? (
                            <div className="space-y-4">
                                {details.map((n, i) => {
                                    const statusColor =
                                        n.provisioning_state === "Succeeded"
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-yellow-600 dark:text-yellow-400"
                                    const autoUpgradeColor =
                                        n.auto_upgrade_minor_version
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
                                                        </div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h4 className="text-sm font-semibold truncate">{n.type_properties_type}</h4>
                                                            <Badge variant="default" className="text-xs">
                                                                {n.publisher}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            <Badge variant="outline" className={`text-xs ${statusColor}`}>
                                                                {n.provisioning_state === "Succeeded" ? (
                                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                ) : (
                                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                                )}
                                                                {n.provisioning_state ?? "Unknown"}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            <Badge variant="outline" className={`text-xs ${autoUpgradeColor}`}>
                                                                {n.auto_upgrade_minor_version ? (
                                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                ) : (
                                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                                )}
                                                                Auto actualización: {n.auto_upgrade_minor_version ? "Habilitada" : "Deshabilitada"}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            <Badge variant="outline" className='text-xs text-blue-600 dark:text-blue-400'>
                                                                Versión: {n.type_handler_version}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>

                                                {n.id && (
                                                    <div className='flex flex-col gap-2'>
                                                        <h1 className="text-sm font-medium">ID Recurso</h1>
                                                        <span className="pt-2 border-t w-[25rem] text-nowrap overflow-x-scroll">
                                                            {n.id}
                                                            {/* <ShortenedId id={n.id} /> */}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Puzzle className="h-12 w-12 text-muted-foreground/50 mb-3" />
                                <p className="text-sm text-muted-foreground">No hay extensiones para mostrar</p>
                            </div>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}


export const UnusedVmExtensionsColumns: DynamicColumn<UnusedVmExtensions>[] = [
    {
        header: "Fecha Observación",
        accessorKey: "_cq_sync_time",
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
        id: "extensions",
        header: "Extensiones",
        cell: ({ row }) => (
            <ExtensionsCell details={row.original?.extensions as UnusedVmExtensionsData[] | undefined} />
        ),
        size: 170,
    },
]