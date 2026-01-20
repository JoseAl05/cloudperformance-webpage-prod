'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getUptime } from '@/lib/getUptimeInstance'
import { Accordion } from '@radix-ui/react-accordion'
import { Globe, HardDrive, MapPin, Network, Server } from 'lucide-react'
import { ComputeEngineInfoHistoryData } from '@/interfaces/cEInterfaces'

interface ComputeEngineHistoricInfoComponentProps {
    instances: ComputeEngineInfoHistoryData[]
}

export const ComputeEngineHistoricInfoComponent = ({ instances }: ComputeEngineHistoricInfoComponentProps) => {
    const statusColors: Record<string, string> = {
        RUNNING: 'bg-green-500/10 text-green-500 border-green-500/20',
        STOPPED: 'bg-red-500/10 text-red-500 border-red-500/20',
        SUSPENDED: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        PROVISIONING: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        STAGING: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        REPAIRING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        TERMINATED: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        STOPPING: 'bg-red-500/10 text-red-500 border-red-500/20',
    }

    const getPublicIpCount = (instance: ComputeEngineInfoHistoryData) => {
        let count = 0;
        instance.networkInterfaces.forEach(ni => {
            if (ni.accessConfigs && ni.accessConfigs.length > 0) {
                count += ni.accessConfigs.filter(ac => ac.name).length;
            }
        });
        return count;
    }

    return (
        <ScrollArea className="max-h-[60vh]">
            {
                instances && (
                    instances.map((instance, index) => {
                        const uptimeInstance = getUptime(new Date(instance.lastStartTimestamp || instance.creationTimestamp));

                        const totalEbsVolumes = instance.disks.length;
                        const totalAttachments = instance.disks.length;
                        const instanceEbs = instance.disks;

                        const totalInterfaces = instance.networkInterfaces;

                        return (
                            <Card key={index} className='my-5'>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Server className="h-5 w-5 text-blue-500" />
                                        Instancia {instance.id}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between gap-5">
                                            <span></span>
                                            <Badge variant="default" className={statusColors[instance.status] || 'bg-gray-500/10 text-gray-500'}>
                                                {instance.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Fecha Observación:</span>
                                            <span className="font-medium text-green-600">{new Date(instance.sync_time).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Tipo:</span>
                                            <span className="font-medium truncate max-w-[200px]" title={instance.machineType}>{instance.machineType.split('/').pop()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Zona:</span>
                                            <span className="font-medium flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {instance.zone.split('/').pop()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">CPU Platform:</span>
                                            <span className="font-medium">{instance.cpuPlatform}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Despliegue:</span>
                                            <span className="font-medium">{instance.scheduling.provisioningModel}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-500'>Uptime:</span>
                                            <span className='font-medium text-green-600'>{uptimeInstance}</span>
                                        </div>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-muted/30'>
                                            <div className='flex items-center gap-2'>
                                                <HardDrive className='h-4 w-4 text-muted-foreground' />
                                                <p className='text-xs text-muted-foreground'>Discos</p>
                                                <p className='text-lg font-semibold'>{totalEbsVolumes}</p>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <HardDrive className='h-4 w-4 text-muted-foreground' />
                                                <p className='text-xs text-muted-foreground'>Adjuntos</p>
                                                <p className='text-lg font-semibold'>{totalAttachments}</p>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Network className='h-4 w-4 text-muted-foreground' />
                                                <p className='text-xs text-muted-foreground'>Interfaces</p>
                                                <p className='text-lg font-semibold'>
                                                    {totalInterfaces.length}
                                                </p>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Globe className='h-4 w-4 text-muted-foreground' />
                                                <p className='text-xs text-muted-foreground'>IPs Públicas</p>
                                                <p className='text-lg font-semibold'>
                                                    {getPublicIpCount(instance)}
                                                </p>
                                            </div>
                                        </div>
                                        <Accordion type='single' collapsible className='w-full'>
                                            <AccordionItem
                                                value={`disk-${instance.id}`}
                                                className='border-none'
                                            >
                                                <AccordionTrigger className='hover:no-underline py-2 px-0 cursor-pointer'>
                                                    <span className='flex items-center gap-2 text-sm font-medium'>
                                                        <HardDrive className='h-4 w-4' />
                                                        INFORMACIÓN DISCOS
                                                    </span>
                                                </AccordionTrigger>
                                                <AccordionContent className='pt-4'>
                                                    <div className='space-y-3 pl-6 border-l-2 border-border/30'>
                                                        {instanceEbs.map((disk, diskIndex) => (
                                                            <div
                                                                key={diskIndex}
                                                                className='grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 p-3 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50'
                                                            >
                                                                <div>
                                                                    <p className='text-xs text-muted-foreground'>Source / ID</p>
                                                                    <p className='text-xs font-mono truncate max-w-[150px]' title={disk.source}>{disk.source.split('/').pop()}</p>
                                                                </div>
                                                                <div>
                                                                    <p className='text-xs text-muted-foreground'>Nombre Dispositivo</p>
                                                                    <p className='text-xs font-semibold'>
                                                                        {disk.deviceName}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className='text-xs text-muted-foreground'>Tipo</p>
                                                                    <p className='text-xs'>
                                                                        {disk.type}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className='text-xs text-muted-foreground'>Tamaño</p>
                                                                    <p className='text-xs'>
                                                                        {disk.diskSizeGb || 'N/A'} GB
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className='text-xs text-muted-foreground'>Boot</p>
                                                                    <p className='text-xs font-mono'>
                                                                        {disk.boot ? 'Sí' : 'No'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <Accordion type='single' collapsible className='w-full'>
                                            <AccordionItem
                                                value={`interface-${instance.id}`}
                                                className='border-none'
                                            >
                                                <AccordionTrigger className='hover:no-underline py-2 px-0 cursor-pointer'>
                                                    <span className='flex items-center gap-2 text-sm font-medium'>
                                                        <Network className='h-4 w-4' />
                                                        INFORMACIÓN INTERFACES
                                                    </span>
                                                </AccordionTrigger>
                                                <AccordionContent className='pt-4'>
                                                    <div className='space-y-3 pl-6 border-l-2 border-border/30'>
                                                        {totalInterfaces.map((netInterface, interfaceIndex) => (
                                                            <div
                                                                key={interfaceIndex}
                                                                className='grid grid-cols-1 md:grid-cols-2 gap-4 p-3 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50'
                                                            >
                                                                <div>
                                                                    <p className='text-xs text-muted-foreground'>Nombre Interfaz</p>
                                                                    <p className='text-xs font-mono'>{netInterface.name}</p>
                                                                </div>
                                                                <div>
                                                                    <p className='text-xs text-muted-foreground'>IP Interna</p>
                                                                    <p className='text-xs font-semibold'>
                                                                        {netInterface.networkIP}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className='text-xs text-muted-foreground'>Stack Type</p>
                                                                    <p className='text-xs'>
                                                                        {netInterface.stackType}
                                                                    </p>
                                                                </div>
                                                                {netInterface.accessConfigs && netInterface.accessConfigs.map((config, idx) => (
                                                                    <div key={idx} className="col-span-1 md:col-span-2">
                                                                        <p className='text-xs text-muted-foreground'>Config: {config.name}</p>
                                                                        <p className='text-xs font-mono'>{config.type} ({config.networkTier})</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )
            }
        </ScrollArea>
    )
}