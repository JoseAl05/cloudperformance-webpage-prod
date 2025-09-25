'use client'

import * as React from 'react'
import { MoreHorizontal, Eye, Copy, ExternalLink, FileText, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { ColumnDef } from '@tanstack/react-table'

export type AutoscalingGroupEvent = {
    _id: { $oid: string }
    sync_time: { $date: string }
    Resources_ResourceName: string[]
    EventName: string
    EventSource: string
    EventTime: { $date: string }
    Username: string
    Resources_ResourceType: string[]
}

const getAutoscalingConsoleUrl = (resourceType: string, resourceName: string, region = 'us-east-1') => {
    const baseUrl = `https://${region}.console.aws.amazon.com`

    switch (resourceType) {
        case 'AWS::AutoScaling::AutoScalingGroup':
            return `${baseUrl}/ec2/home?region=${region}#AutoScalingGroups:id=${resourceName}`
        case 'AWS::EC2::Instance':
            return `${baseUrl}/ec2/home?region=${region}#InstanceDetails:instanceId=${resourceName}`
        case 'AWS::AutoScaling::LaunchConfiguration':
            return `${baseUrl}/ec2/home?region=${region}#LaunchConfigurations:name=${resourceName}`
        default:
            return `${baseUrl}/ec2/home?region=${region}#AutoScalingGroups`
    }
}

const AutoscalingEventDetailsModal = ({ event }: { event: AutoscalingGroupEvent }) => {
    const [isOpen, setIsOpen] = React.useState(false)

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`${label} copiado al portapapeles`)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <FileText className='mr-2 h-4 w-4' />
                    Ver detalles
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className='max-w-4xl'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <Settings className='h-5 w-5 text-orange-600' />
                        Detalle del Evento Autoscaling
                    </DialogTitle>
                    <DialogDescription>Información completa sobre el evento de Autoscaling Group</DialogDescription>
                </DialogHeader>
                <ScrollArea className='max-h-[60vh]'>
                    <div className='space-y-4'>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>ID Evento</label>
                                <div className='flex items-center gap-2'>
                                    <code className='flex-1 p-2 bg-muted rounded text-sm'>{event._id.$oid}</code>
                                    <Button variant='ghost' size='sm' onClick={() => copyToClipboard(event._id.$oid, 'Event ID')}>
                                        <Copy className='h-3 w-3' />
                                    </Button>
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>Nombre del Evento</label>
                                <div className='flex items-center gap-2'>
                                    <code className='flex-1 p-2 bg-muted rounded text-sm'>{event.EventName}</code>
                                    <Button variant='ghost' size='sm' onClick={() => copyToClipboard(event.EventName, 'Event Name')}>
                                        <Copy className='h-3 w-3' />
                                    </Button>
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>Fuente del Evento</label>
                                <div className='flex items-center gap-2'>
                                    <code className='flex-1 p-2 bg-muted rounded text-sm'>{event.EventSource}</code>
                                    <Button variant='ghost' size='sm' onClick={() => copyToClipboard(event.EventSource, 'Event Source')}>
                                        <Copy className='h-3 w-3' />
                                    </Button>
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>Usuario</label>
                                <div className='flex items-center gap-2'>
                                    <code className='flex-1 p-2 bg-muted rounded text-sm'>{event.Username}</code>
                                    <Button variant='ghost' size='sm' onClick={() => copyToClipboard(event.Username, 'Username')}>
                                        <Copy className='h-3 w-3' />
                                    </Button>
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>Fecha Evento</label>
                                <div className='flex items-center gap-2'>
                                    <code className='flex-1 p-2 bg-muted rounded text-sm'>{new Date(event.EventTime.$date).toLocaleString()}</code>
                                    <Button variant='ghost' size='sm' onClick={() => copyToClipboard(new Date(event.EventTime.$date).toLocaleString(), 'Event Time')}>
                                        <Copy className='h-3 w-3' />
                                    </Button>
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>Fecha de Observación</label>
                                <div className='flex items-center gap-2'>
                                    <code className='flex-1 p-2 bg-muted rounded text-sm'>{new Date(event.sync_time.$date).toLocaleString()}</code>
                                    <Button variant='ghost' size='sm' onClick={() => copyToClipboard(new Date(event.sync_time.$date).toLocaleString(), 'Sync Time')}>
                                        <Copy className='h-3 w-3' />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <label className='text-sm font-medium'>Recursos ({event.Resources_ResourceName?.length || 0})</label>
                            <div className='space-y-2'>
                                {(event.Resources_ResourceName || []).map((name, index) => (
                                    <div key={index} className='flex items-center justify-between p-3 rounded-lg border bg-orange-50/50'>
                                        <div className='flex-1 mr-2'>
                                            <code className='text-sm font-mono block'>{name}</code>
                                            <Badge variant='outline' className='text-xs mt-1'>
                                                {event.Resources_ResourceType?.[index] || 'Unknown'}
                                            </Badge>
                                        </div>
                                        <div className='flex gap-1'>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={() => copyToClipboard(name, 'Resource name')}
                                                className='h-8 w-8 p-0'
                                            >
                                                <Copy className='h-3 w-3' />
                                            </Button>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={() =>
                                                    window.open(getAutoscalingConsoleUrl(event.Resources_ResourceType?.[index] || '', name), '_blank')
                                                }
                                                className='h-8 w-8 p-0'
                                            >
                                                <ExternalLink className='h-3 w-3' />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

const AutoscalingResourcesCell = ({ resourceNames, resourceTypes }: { resourceNames: string[]; resourceTypes: string[] }) => {
    const [isOpen, setIsOpen] = React.useState(false)

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success('Resource name copiado al portapapeles')
    }

    const safeResourceNames = resourceNames || []
    const safeResourceTypes = resourceTypes || []

    const resources = safeResourceNames.map((name, index) => ({
        name,
        type: safeResourceTypes[index] || 'Unknown',
    }))

    if (resources.length === 0) {
        return (
            <div className='text-xs text-muted-foreground'>
                <Badge variant='secondary' className='text-xs'>
                    Sin Recursos
                </Badge>
            </div>
        )
    }

    return (
        <div className='space-y-1'>
            <div className='flex items-center gap-2'>
                <Badge variant='secondary' className='text-xs bg-orange-100 text-orange-700'>
                    {resources.length} recursos
                </Badge>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button variant='ghost' size='sm' className='h-6 px-2'>
                            <Eye className='h-3 w-3' />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-4xl'>
                        <DialogHeader>
                            <DialogTitle className='flex items-center gap-2'>
                                <Settings className='h-5 w-5 text-orange-600' />
                                Recursos Autoscaling asociados al evento
                            </DialogTitle>
                            <DialogDescription>Todos los recursos de Autoscaling asociados a este evento.</DialogDescription>
                        </DialogHeader>
                        <ScrollArea className='max-h-96'>
                            <div className='space-y-2'>
                                {resources.map((resource, index) => (
                                    <div key={index} className='flex items-center justify-between p-3 rounded-lg border bg-orange-50/50'>
                                        <div className='flex-1 mr-2'>
                                            <code className='text-sm font-mono block'>{resource.name}</code>
                                            <Badge variant='outline' className='text-xs mt-1'>
                                                {resource.type}
                                            </Badge>
                                        </div>
                                        <div className='flex gap-1'>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={() => copyToClipboard(resource.name)}
                                                className='h-8 w-8 p-0'
                                            >
                                                <Copy className='h-3 w-3' />
                                            </Button>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={() => window.open(getAutoscalingConsoleUrl(resource.type, resource.name), '_blank')}
                                                className='h-8 w-8 p-0'
                                            >
                                                <ExternalLink className='h-3 w-3' />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </div>
            <div className='text-xs text-muted-foreground'>
                <code className='bg-orange-50 px-1 py-0.5 rounded text-xs'>{resources[0]?.name || 'No resources'}</code>
                {resources.length > 1 && <span className='ml-1'>+{resources.length - 1} más</span>}
            </div>
        </div>
    )
}

export const autoscalingGroupEventColumns: ColumnDef<AutoscalingGroupEvent>[] = [
    {
        header: 'Nombre Evento',
        accessorKey: 'EventName',
        cell: ({ getValue }) => (
            <div className='font-medium'>
                <Badge variant='outline' className='font-mono text-xs bg-orange-50 text-orange-700 border-orange-200'>
                    {String(getValue() || '')}
                </Badge>
            </div>
        ),
    },
    {
        header: 'Nombre del Recurso',
        accessorKey: 'Resources_ResourceName',
        cell: ({ row }) => {
            if (!row || !row.original) {
                return <div>Error en datos</div>;
            }
            return (
                <AutoscalingResourcesCell
                    resourceNames={row.original.Resources_ResourceName || []}
                    resourceTypes={row.original.Resources_ResourceType || []}
                />
            );
        },
    },
    {
        header: 'Tipo del Recurso',
        accessorKey: 'Resources_ResourceType',
        cell: ({ getValue }) => {
            const types = getValue() as string[] || [];
            const firstType = types[0] || '';
            return (
                <div className='flex items-center gap-2'>
                    <Settings className='h-4 w-4 text-orange-500' />
                    <Badge variant='secondary' className='font-mono text-xs bg-blue-50 text-blue-700'>
                        {firstType}
                    </Badge>
                    {types.length > 1 && (
                        <span className='text-xs text-muted-foreground'>+{types.length - 1}</span>
                    )}
                </div>
            );
        },
    },
    {
        header: 'Fecha Evento',
        accessorKey: 'EventTime',
        cell: ({ getValue }) => {
            const value = getValue() as { $date: string };
            const date = new Date(value?.$date || '');
            return (
                <div className='text-sm'>
                    <div className='font-medium'>{date.toLocaleDateString()}</div>
                    <div className='text-xs text-muted-foreground'>{date.toLocaleTimeString()}</div>
                </div>
            );
        },
    },
    {
        header: 'Fuente del Evento',
        accessorKey: 'EventSource',
        cell: ({ getValue }) => (
            <div className='flex items-center gap-2'>
                <Settings className='h-4 w-4 text-orange-500' />
                <div className='font-mono text-sm text-muted-foreground'>{String(getValue() || '')}</div>
            </div>
        ),
    },
    {
        header: 'Usuario',
        accessorKey: 'Username',
        cell: ({ getValue }) => (
            <div className='flex items-center gap-2'>
                <div className='h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center'>
                    <span className='text-xs font-semibold text-blue-700'>
                        {String(getValue() || '').charAt(0).toUpperCase()}
                    </span>
                </div>
                <span className='font-medium text-sm'>{String(getValue() || 'N/A')}</span>
            </div>
        ),
    },    
    {
        header: 'Acciones',
        accessorKey: 'actions',
        cell: ({ row }) => {
            if (!row || !row.original) {
                return <div>-</div>;
            }
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                            <span className='sr-only'>Abrir Menú</span>
                            <MoreHorizontal className='h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => {
                                navigator.clipboard.writeText(row.original._id.$oid)
                                toast.success('Event ID copiado al portapapeles')
                            }}
                        >
                            Copiar ID de Evento
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                const region = 'us-east-1'
                                const consoleUrl = `https://${region}.console.aws.amazon.com/ec2/home?region=${region}#AutoScalingGroups`
                                window.open(consoleUrl, '_blank')
                            }}
                        >
                            <ExternalLink className='mr-2 h-4 w-4' />
                            Ver en consola Autoscaling
                        </DropdownMenuItem>
                        <AutoscalingEventDetailsModal event={row.original} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]