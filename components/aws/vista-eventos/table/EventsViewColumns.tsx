'use client';

import * as React from 'react';
import { DynamicColumn } from '@/components/general/data-table/columns';
import type { FlatEventRow } from '@/components/aws/vista-eventos/table/EventsViewTableComponent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const getAwsConsoleUrl = (resourceType: string, resourceName: string, region = 'us-east-1') => {
    const baseUrl = `https://${region}.console.aws.amazon.com`;

    switch (resourceType) {
        case 'AWS::EC2::Instance':
            return `${baseUrl}/ec2/home?region=${region}#InstanceDetails:instanceId=${resourceName}`;
        case 'AWS::EC2::VPC':
            return `${baseUrl}/vpc/home?region=${region}#VpcDetails:VpcId=${resourceName}`;
        case 'AWS::EC2::SecurityGroup':
            return `${baseUrl}/ec2/home?region=${region}#SecurityGroup:groupId=${resourceName}`;
        case 'AWS::EC2::Subnet':
            return `${baseUrl}/vpc/home?region=${region}#SubnetDetails:subnetId=${resourceName}`;
        case 'AWS::EC2::NetworkInterface':
            return `${baseUrl}/ec2/home?region=${region}#NetworkInterface:networkInterfaceId=${resourceName}`;
        case 'AWS::IAM::InstanceProfile':
            return `https://console.aws.amazon.com/iam/home#/instance-profiles/${resourceName.split('/').pop()}`;
        default:
            return `https://console.aws.amazon.com/console/home?region=${region}`;
    }
};


function getNormalizedResources(row: FlatEventRow) {
    if (Array.isArray((row as unknown)?.Resources) && (row as unknown).Resources.length > 0) {
        const arr = (row as unknown).Resources as { ResourceName?: string; ResourceType?: string }[];
        return arr
            .map(r => ({
                name: r?.ResourceName ?? '',
                type: r?.ResourceType ?? 'Unknown',
            }))
            .filter(r => r.name);
    }
    const names = (row as unknown)?.Resources_ResourceName as string[] | undefined;
    const types = (row as unknown)?.Resources_ResourceType as string[] | undefined;
    if (Array.isArray(names) && names.length > 0) {
        return names.map((n, i) => ({
            name: n ?? '',
            type: types?.[i] ?? 'Unknown',
        })).filter(r => r.name);
    }

    return [];
}

const copyToClipboard = (text: string, label?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(label ? `${label} copiado al portapapeles` : 'Copiado al portapapeles');
};

const fmtDateTime = (v?: string) => {
    if (!v) return '—';
    const d = new Date(v);
    return isNaN(+d) ? v : `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
};

const truncateMiddle = (str: string, keep = 36) => {
    if (!str || str.length <= keep * 2) return str;
    return `${str.slice(0, keep)}…${str.slice(-keep)}`;
};

const ResourcesDialogCell = ({ row }: { row: FlatEventRow }) => {
    const resources = getNormalizedResources(row);
    const count = resources.length;

    if (count === 0) {
        return <Badge variant="secondary" className="text-xs">Sin Recursos</Badge>;
    }

    return (
        <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">{count} recursos</Badge>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Eye className="h-3 w-3" />
                        <span className="sr-only">Ver recursos</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-[92vw] max-h-[85vh] overflow-hidden">
                    <DialogHeader>
                        <DialogTitle>Recursos asociados al evento</DialogTitle>
                        <DialogDescription>
                            Todos los recursos asociados a este evento de AWS.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Evento</label>
                            <div className="rounded-md border p-3 bg-muted/50">
                                <div className="text-sm break-words">
                                    <span className="font-medium">Nombre:</span> {row.EventName || '—'}
                                </div>
                                <div className="text-sm break-words">
                                    <span className="font-medium">Fuente:</span> {row.EventSource || '—'}
                                </div>
                                <div className="text-sm break-words">
                                    <span className="font-medium">Usuario:</span> {row.Username || '—'}
                                </div>
                                <div className="text-sm">
                                    <span className="font-medium">Fecha:</span> {fmtDateTime(row.EventTime)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <ScrollArea className="max-h-[52vh] mt-4 pr-2">
                        <div className="space-y-2">
                            {resources.map((r, i) => {
                                const display = truncateMiddle(r.name ?? '');
                                return (
                                    <div
                                        key={`${r.type}-${r.name}-${i}`}
                                        className="flex items-start justify-between p-3 rounded-lg border bg-muted/50 gap-2"
                                    >
                                        <div className="flex-1 min-w-0 overflow-hidden">
                                            <code
                                                className="text-sm font-mono block break-words break-all whitespace-pre-wrap"
                                                title={r.name}
                                            >
                                                {display}
                                            </code>
                                            <Badge variant="outline" className="text-xs mt-1">
                                                {r.type || '—'}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard(r.name, 'Nombre de recurso')}
                                                className="h-8 w-8 p-0"
                                                title="Copiar"
                                            >
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => window.open(getAwsConsoleUrl(r.type, r.name), '_blank')}
                                                className="h-8 w-8 p-0"
                                                title="Abrir en AWS"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export const EventsViewColumns: DynamicColumn<FlatEventRow>[] = [
    {
        id: 'EventName',
        header: 'Evento',
        accessorKey: 'EventName',
        enableSorting: true,
    },
    {
        id: 'EventTime',
        header: 'Fecha/Hora',
        accessorKey: 'EventTime',
        enableSorting: true,
        cell: ({ row }) => fmtDateTime(row.original.EventTime),
    },
    {
        id: 'EventSource',
        header: 'Servicio',
        accessorKey: 'EventSource',
        enableSorting: true,
    },
    {
        id: 'Username',
        header: 'Usuario',
        accessorKey: 'Username',
        enableSorting: true,
    },
    {
        id: 'Resources',
        header: 'Recursos',
        accessorKey: 'Resources',
        enableSorting: false,
        cell: ({ row }) => <ResourcesDialogCell row={row.original} />,
    },
];
