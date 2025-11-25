'use client'

import { Badge } from '@/components/ui/badge';
import { DynamicColumn } from '@/components/general_aws/data-table/columns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Copy, Eye, Layers, ListTree } from 'lucide-react';
import { useState } from 'react';
import { UnusedLb, UnusedLbDetail } from '@/interfaces/vista-unused-resources/unusedLbInterfaces';

const CopyBtn = ({ text }: { text: string }) => (
    <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2"
        onClick={() => navigator.clipboard.writeText(text)}
    >
        <Copy className="h-3.5 w-3.5" />
    </Button>
)

const DetailsDialog = ({ details }: { details: UnusedLbDetail[] }) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-accent">
                    <Eye className="h-3.5 w-3.5" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-5xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Layers className="h-5 w-5" />
                        Historial del Load Balancer
                    </DialogTitle>
                    <DialogDescription>
                        {details.length} observaciones registradas
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh] pr-4">
                    <div className="space-y-6">

                        {details.map((d, i) => (
                            <div key={i} className="rounded-lg border bg-card p-4 space-y-4 hover:shadow-sm transition-shadow">
                                <div>
                                    <div className="text-xs text-muted-foreground">Fecha Observación</div>
                                    <Badge variant="secondary" className="mt-1">
                                        {new Date(d.sync_time).toLocaleString('es-CL')}
                                    </Badge>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">SKU</div>
                                    <Badge variant="outline" className="mt-1">
                                        {d.sku}
                                    </Badge>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Tags</div>
                                    {Object.keys(d.tags).length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(d.tags).map(([k, v]) => (
                                                <Badge key={k} variant="secondary" className="text-xs">
                                                    {k}: {v}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-xs italic text-muted-foreground">Sin tags</div>
                                    )}
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">Backend Instances</div>
                                    <Badge variant="outline" className="mt-1">
                                        {d.backend_instance_count}
                                    </Badge>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                                        <ListTree className="h-4 w-4" /> Backend Address Pools
                                    </div>
                                    {d.backend_address_pools && d.backend_address_pools.length > 0 ? (
                                        <div className="space-y-2">
                                            {d.backend_address_pools.map((b, idx) => (
                                                <div key={idx} className="rounded-md border p-3 space-y-1 bg-muted/30">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium text-sm">{b.name}</span>
                                                        <CopyBtn text={b.id} />
                                                    </div>
                                                    <code className="text-xs break-all">{b.id}</code>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-xs italic text-muted-foreground">Sin backend pools</div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                                        <ListTree className="h-4 w-4" /> Load Balancing Rules
                                    </div>

                                    {d.load_balancing_rules && d.load_balancing_rules.length > 0 ? (
                                        <div className="space-y-2">
                                            {d.load_balancing_rules.map((r, idx) => (
                                                <div key={idx} className="rounded-md border p-3 bg-muted/30 flex justify-between items-center">
                                                    <code className="text-xs break-all">{r.id}</code>
                                                    <CopyBtn text={r.id} />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-xs italic text-muted-foreground">Sin LB rules</div>
                                    )}
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Inbound NAT Rules</div>
                                    {d.inbound_nat_rules && d.inbound_nat_rules.length > 0 ? (
                                        <div className="space-y-2">
                                            {d.inbound_nat_rules.map((r, idx) => (
                                                <div key={idx} className="rounded-md border p-3 bg-muted/30 flex justify-between items-center">
                                                    <code className="text-xs break-all">{r.id}</code>
                                                    <CopyBtn text={r.id} />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-xs italic text-muted-foreground">Sin NAT rules</div>
                                    )}
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Inbound NAT Pools</div>

                                    {d.inbound_nat_pools && d.inbound_nat_pools.length > 0 ? (
                                        <div className="space-y-2">
                                            {d.inbound_nat_pools.map((p, idx) => (
                                                <div key={idx} className="rounded-md border p-3 bg-muted/30 flex justify-between items-center">
                                                    <code className="text-xs break-all">{p.id}</code>
                                                    <CopyBtn text={p.id} />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-xs italic text-muted-foreground">Sin NAT pools</div>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};


export const UnusedLoadbalancersColumns: DynamicColumn<UnusedLb>[] = [
    {
        header: "Nombre LB",
        accessorKey: "name",
        cell: (info) => (
            <Badge variant="secondary" className="font-mono text-sm">
                {info.getValue() as string}
            </Badge>
        )
    },
    {
        header: "ID LB",
        accessorKey: "resource_id",
        cell: (info) => (
            <div className="text-sm text-muted-foreground text-wrap">
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
        id: "details",
        header: "Detalles (Histórico)",
        cell: ({ row }) => <DetailsDialog details={row.original.details} />,
        size: 140
    }
];
