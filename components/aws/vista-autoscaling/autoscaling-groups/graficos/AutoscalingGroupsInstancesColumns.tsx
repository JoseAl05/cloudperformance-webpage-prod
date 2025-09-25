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

export type AutoscalingGroupInstance = {
    sync_time: { $date: string }
    AutoScalingGroupName: string
    HealthStatus: string
    InstanceId: string
    InstanceType: string
    LaunchTemplate_LaunchTemplateId: string | null
    LaunchTemplate_LaunchTemplateName: string | null
    LaunchTemplate_Version: string | null
    LifecycleState: string
    Launch_Template_Info_Formatted: string | null
}

const getEc2ConsoleUrl = (instanceId: string, region = 'us-east-1') => {
    return `https://${region}.console.aws.amazon.com/ec2/home?region=${region}#InstanceDetails:instanceId=${instanceId}`
}

const AutoscalingInstanceDetailsModal = ({ instance }: { instance: AutoscalingGroupInstance }) => {
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
                        Detalle de la Instancia
                    </DialogTitle>
                    <DialogDescription>Información completa sobre la instancia del Autoscaling Group</DialogDescription>
                </DialogHeader>
                <ScrollArea className='max-h-[60vh]'>
                    <div className='space-y-4'>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>Instance ID</label>
                                <div className='flex items-center gap-2'>
                                    <code className='flex-1 p-2 bg-muted rounded text-sm'>{instance.InstanceId}</code>
                                    <Button variant='ghost' size='sm' onClick={() => copyToClipboard(instance.InstanceId, 'Instance ID')}>
                                        <Copy className='h-3 w-3' />
                                    </Button>
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>Tipo de Instancia</label>
                                <div className='flex items-center gap-2'>
                                    <code className='flex-1 p-2 bg-muted rounded text-sm'>{instance.InstanceType}</code>
                                    <Button variant='ghost' size='sm' onClick={() => copyToClipboard(instance.InstanceType, 'Instance Type')}>
                                        <Copy className='h-3 w-3' />
                                    </Button>
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>Estado del Ciclo de Vida</label>
                                <Badge variant='outline' className='font-mono'>
                                    {instance.LifecycleState}
                                </Badge>
                            </div>
                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>Estado de Salud</label>
                                <Badge variant='outline' className='font-mono'>
                                    {instance.HealthStatus}
                                </Badge>
                            </div>
                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>Autoscaling Group</label>
                                <div className='flex items-center gap-2'>
                                    <code className='flex-1 p-2 bg-muted rounded text-sm'>{instance.AutoScalingGroupName}</code>
                                    <Button variant='ghost' size='sm' onClick={() => copyToClipboard(instance.AutoScalingGroupName, 'ASG Name')}>
                                        <Copy className='h-3 w-3' />
                                    </Button>
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>Fecha de Observación</label>
                                <div className='flex items-center gap-2'>
                                    <code className='flex-1 p-2 bg-muted rounded text-sm'>{new Date(instance.sync_time.$date).toLocaleString()}</code>
                                    <Button variant='ghost' size='sm' onClick={() => copyToClipboard(new Date(instance.sync_time.$date).toLocaleString(), 'Sync Time')}>
                                        <Copy className='h-3 w-3' />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className='border-t pt-4'>
                            <h4 className='text-sm font-medium mb-3 flex items-center gap-2'>
                                <Settings className='h-4 w-4 text-orange-600' />
                                Información Launch Template
                            </h4>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium'>Template ID</label>
                                    <div className='flex items-center gap-2'>
                                        <code className='flex-1 p-2 bg-orange-50 rounded text-sm'>{instance.LaunchTemplate_LaunchTemplateId || 'N/A'}</code>
                                        {instance.LaunchTemplate_LaunchTemplateId && (
                                            <Button variant='ghost' size='sm' onClick={() => copyToClipboard(instance.LaunchTemplate_LaunchTemplateId!, 'Template ID')}>
                                                <Copy className='h-3 w-3' />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium'>Template Name</label>
                                    <div className='flex items-center gap-2'>
                                        <code className='flex-1 p-2 bg-orange-50 rounded text-sm'>{instance.LaunchTemplate_LaunchTemplateName || 'N/A'}</code>
                                        {instance.LaunchTemplate_LaunchTemplateName && (
                                            <Button variant='ghost' size='sm' onClick={() => copyToClipboard(instance.LaunchTemplate_LaunchTemplateName!, 'Template Name')}>
                                                <Copy className='h-3 w-3' />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium'>Version</label>
                                    <code className='p-2 bg-orange-50 rounded text-sm block'>{instance.LaunchTemplate_Version || 'N/A'}</code>
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium'>Info Formateada</label>
                                    <code className='p-2 bg-orange-50 rounded text-sm block'>{instance.Launch_Template_Info_Formatted || 'N/A'}</code>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export const autoscalingGroupInstanceColumns: ColumnDef<AutoscalingGroupInstance>[] = [
    {
        header: 'Instance ID',
        accessorKey: 'InstanceId',
        cell: ({ getValue }) => (
            <div className='font-medium'>
                <code className='bg-orange-50 px-2 py-1 rounded text-xs font-mono text-orange-700 border border-orange-200'>
                    {String(getValue() || '')}
                </code>
            </div>
        ),
    },
    {
        header: 'Tipo de Instancia',
        accessorKey: 'InstanceType',
        cell: ({ getValue }) => (
            <Badge variant='outline' className='font-mono bg-blue-50 text-blue-700 border-blue-200'>
                {String(getValue() || '')}
            </Badge>
        ),
    },
    {
        header: 'Estado del Ciclo de Vida',
        accessorKey: 'LifecycleState',
        cell: ({ getValue }) => {
            const state = String(getValue() || '');
            return (
                <Badge 
                    variant='outline' 
                    className={`font-mono ${
                        state.includes('En servicio') || state.includes('InService') 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}
                >
                    {state}
                </Badge>
            );
        },
    },
    {
        header: 'Estado de Salud',
        accessorKey: 'HealthStatus',
        cell: ({ getValue }) => {
            const status = String(getValue() || '');
            return (
                <Badge 
                    variant='outline' 
                    className={`font-mono ${
                        status.includes('Healthy') || status.includes('saludable')
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        header: 'Fecha Observación',
        accessorKey: 'sync_time',
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
        header: 'Launch Template ID',
        accessorKey: 'LaunchTemplate_LaunchTemplateId',
        cell: ({ getValue }) => {
            const value = getValue();
            return value ? (
                <code className='bg-amber-50 px-2 py-1 rounded text-xs font-mono text-amber-700 border border-amber-200'>
                    {String(value)}
                </code>
            ) : (
                <span className='text-gray-400 text-xs'>N/A</span>
            );
        }
    },

    {
        header: 'Nombre Launch Template',
        accessorKey: 'LaunchTemplate_LaunchTemplateName',
        cell: ({ getValue }) => {
            const value = getValue();
            return value ? (
                <code className='bg-green-50 px-2 py-1 rounded text-xs font-mono text-green-700 border border-green-200'>
                    {String(value)}
                </code>
            ) : (
                <span className='text-gray-400 text-xs'>N/A</span>
            );
        }
    },   
    {
        header: 'Version Launch Template',
        accessorKey: 'LaunchTemplate_Version',
        cell: ({ getValue }) => {
            const value = getValue();
            return value ? (
                <Badge variant='outline' className='font-mono bg-purple-50 text-purple-700 border-purple-200'>
                    {String(value)}
                </Badge>
            ) : (
                <span className='text-gray-400 text-xs'>N/A</span>
            );
        }
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
                                navigator.clipboard.writeText(row.original.InstanceId)
                                toast.success('Instance ID copiado al portapapeles')
                            }}
                        >
                            Copiar Instance ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                const consoleUrl = getEc2ConsoleUrl(row.original.InstanceId)
                                window.open(consoleUrl, '_blank')
                            }}
                        >
                            <ExternalLink className='mr-2 h-4 w-4' />
                            Ver en consola EC2
                        </DropdownMenuItem>
                        <AutoscalingInstanceDetailsModal instance={row.original} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]