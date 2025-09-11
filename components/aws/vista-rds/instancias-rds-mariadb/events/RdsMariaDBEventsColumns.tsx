'use client'

import * as React from 'react'
import { MoreHorizontal, Eye, Copy, ExternalLink, FileText, Database } from 'lucide-react'
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

export type RdsMariaDBEvent = {
    _id: string
    EventName: string
    EventSource: string
    EventTime: string
    Username: string
    sync_time: string
    Resources_ResourceName: string[]
    Resources_ResourceType: string[]
    DBInstanceIdentifier?: string
    Engine?: string
    EngineVersion?: string
}

const getRdsConsoleUrl = (resourceType: string, resourceName: string, region = 'us-east-1') => {
    const baseUrl = `https://${region}.console.aws.amazon.com`

    switch (resourceType) {
        case 'AWS::RDS::DBInstance':
            return `${baseUrl}/rds/home?region=${region}#database:id=${resourceName}`
        case 'AWS::RDS::DBCluster':
            return `${baseUrl}/rds/home?region=${region}#cluster:id=${resourceName}`
        case 'AWS::RDS::DBSubnetGroup':
            return `${baseUrl}/rds/home?region=${region}#subnet-groups:id=${resourceName}`
        case 'AWS::RDS::DBParameterGroup':
            return `${baseUrl}/rds/home?region=${region}#parameter-groups:id=${resourceName}`
        case 'AWS::RDS::DBSecurityGroup':
            return `${baseUrl}/rds/home?region=${region}#security-groups:id=${resourceName}`
        case 'AWS::RDS::EventSubscription':
            return `${baseUrl}/rds/home?region=${region}#event-subscriptions:id=${resourceName}`
        case 'AWS::RDS::DBSnapshot':
            return `${baseUrl}/rds/home?region=${region}#snapshots:id=${resourceName}`
        default:
            return `${baseUrl}/rds/home?region=${region}#databases`
    }
}

const RdsMariaDBEventDetailsModal = ({ event }: { event: RdsMariaDBEvent }) => {
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
                        <Database className='h-5 w-5 text-amber-600' />
                        Detalle del Evento RDS
                    </DialogTitle>
                    <DialogDescription>Información completa sobre el evento de RDS MariaDB</DialogDescription>
                </DialogHeader>
                <ScrollArea className='max-h-[60vh]'>
                    <div className='space-y-4'>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>ID Evento</label>
                                <div className='flex items-center gap-2'>
                                    <code className='flex-1 p-2 bg-muted rounded text-sm'>{event._id}</code>
                                    <Button variant='ghost' size='sm' onClick={() => copyToClipboard(event._id, 'Event ID')}>
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
                                <label className='text-sm font-medium'>Nombre de Usuario</label>
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
                                    <code className='flex-1 p-2 bg-muted rounded text-sm'>{event.EventTime}</code>
                                    <Button variant='ghost' size='sm' onClick={() => copyToClipboard(event.EventTime, 'Event Time')}>
                                        <Copy className='h-3 w-3' />
                                    </Button>
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>Fecha de Observación</label>
                                <div className='flex items-center gap-2'>
                                    <code className='flex-1 p-2 bg-muted rounded text-sm'>{event.sync_time}</code>
                                    <Button variant='ghost' size='sm' onClick={() => copyToClipboard(event.sync_time, 'Sync Time')}>
                                        <Copy className='h-3 w-3' />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {(event.DBInstanceIdentifier || event.Engine) && (
                            <div className='border-t pt-4'>
                                <h4 className='text-sm font-medium mb-3 flex items-center gap-2'>
                                    <Database className='h-4 w-4 text-amber-600' />
                                    Información RDS MariaDB
                                </h4>
                                <div className='grid grid-cols-2 gap-4'>
                                    {event.DBInstanceIdentifier && (
                                        <div className='space-y-2'>
                                            <label className='text-sm font-medium'>DB Instance</label>
                                            <div className='flex items-center gap-2'>
                                                <code className='flex-1 p-2 bg-amber-50 rounded text-sm'>{event.DBInstanceIdentifier}</code>
                                                <Button variant='ghost' size='sm' onClick={() => copyToClipboard(event.DBInstanceIdentifier!, 'DB Instance')}>
                                                    <Copy className='h-3 w-3' />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                    {event.Engine && (
                                        <div className='space-y-2'>
                                            <label className='text-sm font-medium'>Engine</label>
                                            <Badge variant='outline' className='font-mono'>
                                                {event.Engine} {event.EngineVersion && `v${event.EngineVersion}`}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className='space-y-2'>
                            <label className='text-sm font-medium'>Recursos ({event.Resources_ResourceName?.length || 0})</label>
                            <div className='space-y-2'>
                                {(event.Resources_ResourceName || []).map((name, index) => (
                                    <div key={index} className='flex items-center justify-between p-3 rounded-lg border bg-amber-50/50'>
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
                                                    window.open(getRdsConsoleUrl(event.Resources_ResourceType?.[index] || '', name), '_blank')
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

const RdsResourcesCell = ({ resourceNames, resourceTypes }: { resourceNames: string[]; resourceTypes: string[] }) => {
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
                <Badge variant='secondary' className='text-xs bg-amber-100 text-amber-700'>
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
                                <Database className='h-5 w-5 text-amber-600' />
                                Recursos RDS asociados al evento
                            </DialogTitle>
                            <DialogDescription>Todos los recursos de RDS asociados a este evento.</DialogDescription>
                        </DialogHeader>
                        <ScrollArea className='max-h-96'>
                            <div className='space-y-2'>
                                {resources.map((resource, index) => (
                                    <div key={index} className='flex items-center justify-between p-3 rounded-lg border bg-amber-50/50'>
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
                                                onClick={() => window.open(getRdsConsoleUrl(resource.type, resource.name), '_blank')}
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
                <code className='bg-amber-50 px-1 py-0.5 rounded text-xs'>{resources[0]?.name || 'No resources'}</code>
                {resources.length > 1 && <span className='ml-1'>+{resources.length - 1} más</span>}
            </div>
        </div>
    )
}

export const rdsMariaDBEventColumns: ColumnDef<RdsMariaDBEvent>[] = [
    {
        header: 'Nombre Evento',
        accessorKey: 'EventName',
        cell: ({ getValue }) => (
            <div className='font-medium'>
                <Badge variant='outline' className='font-mono text-xs bg-amber-50 text-amber-700 border-amber-200'>
                    {String(getValue() || '')}
                </Badge>
            </div>
        ),
    },
    {
        header: 'Fuente del Evento',
        accessorKey: 'EventSource',
        cell: ({ getValue }) => (
            <div className='flex items-center gap-2'>
                <Database className='h-4 w-4 text-amber-500' />
                <div className='font-mono text-sm text-muted-foreground'>{String(getValue() || '')}</div>
            </div>
        ),
    },
    {
        header: 'Fecha Evento',
        accessorKey: 'EventTime',
        cell: ({ getValue }) => {
            const value = getValue();
            const date = new Date(String(value || ''));
            return (
                <div className='text-sm'>
                    <div className='font-medium'>{date.toLocaleDateString()}</div>
                    <div className='text-xs text-muted-foreground'>{date.toLocaleTimeString()}</div>
                </div>
            );
        },
    },
    {
        header: 'Usuario',
        accessorKey: 'Username',
        cell: ({ getValue }) => (
            <Badge variant='secondary' className='font-mono bg-amber-100 text-amber-700'>
                {String(getValue() || '')}
            </Badge>
        ),
    },
    {
        header: 'Recursos RDS',
        accessorKey: 'Resources_ResourceName',
        cell: ({ row }) => {
            if (!row || !row.original) {
                return <div>Error en datos</div>;
            }
            return (
                <RdsResourcesCell
                    resourceNames={row.original.Resources_ResourceName || []}
                    resourceTypes={row.original.Resources_ResourceType || []}
                />
            );
        },
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
                                navigator.clipboard.writeText(row.original._id)
                                toast.success('Event ID copiado al portapapeles')
                            }}
                        >
                            Copiar ID de Evento
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                const region = 'us-east-1'
                                const consoleUrl = `https://${region}.console.aws.amazon.com/rds/home?region=${region}#events:`
                                window.open(consoleUrl, '_blank')
                            }}
                        >
                            <ExternalLink className='mr-2 h-4 w-4' />
                            Ver en consola RDS
                        </DropdownMenuItem>
                        <RdsMariaDBEventDetailsModal event={row.original} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]