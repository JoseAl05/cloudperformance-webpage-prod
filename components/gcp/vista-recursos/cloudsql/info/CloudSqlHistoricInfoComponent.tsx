'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getUptime } from '@/lib/getUptimeInstance'
import { Accordion } from '@/components/ui/accordion'
import { Globe, HardDrive, MapPin, Network, Database, ShieldCheck } from 'lucide-react'
import { HistoryDatum } from '@/interfaces/sqlInterfaces'

interface CloudSqlHistoricInfoComponentProps {
    instances: HistoryDatum[]
}

export const CloudSqlHistoricInfoComponent = ({ instances }: CloudSqlHistoricInfoComponentProps) => {
    const statusColors: Record<string, string> = {
        RUNNABLE: 'bg-green-500/10 text-green-500 border-green-500/20',
        SUSPENDED: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        PENDING_CREATE: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        MAINTENANCE: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        FAILED: 'bg-red-500/10 text-red-500 border-red-500/20',
        UNKNOWN_STATE: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    }

    return (
        <ScrollArea className="max-h-[60vh]">
            {
                instances && (
                    instances.map((instance, index) => {
                        const uptimeInstance = getUptime(new Date(instance.createTime));

                        return (
                            <Card key={index} className='my-5'>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Database className="h-5 w-5 text-blue-500" />
                                        Instancia {instance.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between gap-5">
                                            <span></span>
                                            <Badge variant="default" className={statusColors[instance.state] || 'bg-gray-500/10 text-gray-500'}>
                                                {instance.state}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Fecha Observación:</span>
                                            <span className="font-medium text-green-600">{new Date(instance.sync_time).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Tier:</span>
                                            <span className="font-medium truncate max-w-[200px]" title={instance.settings.tier}>{instance.settings.tier}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Zona:</span>
                                            <span className="font-medium flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {instance.gceZone.split('-').pop()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Versión DB:</span>
                                            <span className="font-medium">{instance.databaseVersion}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Edición:</span>
                                            <span className="font-medium">{instance.settings.edition}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-500'>Uptime:</span>
                                            <span className='font-medium text-green-600'>{uptimeInstance}</span>
                                        </div>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-muted/30'>
                                            <div className='flex items-center gap-2'>
                                                <HardDrive className='h-4 w-4 text-muted-foreground' />
                                                <p className='text-xs text-muted-foreground'>Storage</p>
                                                <p className='text-lg font-semibold'>{instance.settings.dataDiskSizeGb} GB</p>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <ShieldCheck className='h-4 w-4 text-muted-foreground' />
                                                <p className='text-xs text-muted-foreground'>Backups</p>
                                                <p className='text-lg font-semibold'>{instance.settings.backupConfiguration.enabled ? 'On' : 'Off'}</p>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Network className='h-4 w-4 text-muted-foreground' />
                                                <p className='text-xs text-muted-foreground'>HA Type</p>
                                                <p className='text-sm font-semibold truncate'>
                                                    {instance.settings.availabilityType}
                                                </p>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Globe className='h-4 w-4 text-muted-foreground' />
                                                <p className='text-xs text-muted-foreground'>IPs</p>
                                                <p className='text-lg font-semibold'>
                                                    {instance.ipAddresses.length}
                                                </p>
                                            </div>
                                        </div>
                                        <Accordion type='single' collapsible className='w-full'>
                                            <AccordionItem
                                                value={`storage-${instance.name}`}
                                                className='border-none'
                                            >
                                                <AccordionTrigger className='hover:no-underline py-2 px-0 cursor-pointer'>
                                                    <span className='flex items-center gap-2 text-sm font-medium'>
                                                        <HardDrive className='h-4 w-4' />
                                                        INFORMACIÓN ALMACENAMIENTO
                                                    </span>
                                                </AccordionTrigger>
                                                <AccordionContent className='pt-4'>
                                                    <div className='space-y-3 pl-6 border-l-2 border-border/30'>
                                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 p-3 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50'>
                                                            <div>
                                                                <p className='text-xs text-muted-foreground'>Tipo de Disco</p>
                                                                <p className='text-xs font-mono truncate max-w-[150px]'>{instance.settings.dataDiskType}</p>
                                                            </div>
                                                            <div>
                                                                <p className='text-xs text-muted-foreground'>Tamaño</p>
                                                                <p className='text-xs font-semibold'>
                                                                    {instance.settings.dataDiskSizeGb} GB
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className='text-xs text-muted-foreground'>Auto-Resize</p>
                                                                <p className='text-xs'>
                                                                    {instance.settings.storageAutoResize ? 'Sí' : 'No'}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className='text-xs text-muted-foreground'>Retención Backups</p>
                                                                <p className='text-xs'>
                                                                    {instance.settings.backupConfiguration.backupRetentionSettings.retainedBackups} {instance.settings.backupConfiguration.backupRetentionSettings.retentionUnit}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <Accordion type='single' collapsible className='w-full'>
                                            <AccordionItem
                                                value={`network-${instance.name}`}
                                                className='border-none'
                                            >
                                                <AccordionTrigger className='hover:no-underline py-2 px-0 cursor-pointer'>
                                                    <span className='flex items-center gap-2 text-sm font-medium'>
                                                        <Network className='h-4 w-4' />
                                                        INFORMACIÓN CONECTIVIDAD
                                                    </span>
                                                </AccordionTrigger>
                                                <AccordionContent className='pt-4'>
                                                    <div className='space-y-3 pl-6 border-l-2 border-border/30'>
                                                        {instance.ipAddresses.map((ip, idx) => (
                                                            <div
                                                                key={idx}
                                                                className='grid grid-cols-1 md:grid-cols-2 gap-4 p-3 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50'
                                                            >
                                                                <div>
                                                                    <p className='text-xs text-muted-foreground'>Dirección IP</p>
                                                                    <p className='text-xs font-mono'>{ip.ipAddress}</p>
                                                                </div>
                                                                <div>
                                                                    <p className='text-xs text-muted-foreground'>Tipo</p>
                                                                    <p className='text-xs font-semibold'>
                                                                        {ip.type}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-3 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50'>
                                                            <div>
                                                                <p className='text-xs text-muted-foreground'>SSL Mode</p>
                                                                <p className='text-xs font-mono'>{instance.settings.ipConfiguration.sslMode}</p>
                                                            </div>
                                                            <div>
                                                                <p className='text-xs text-muted-foreground'>Require SSL</p>
                                                                <p className='text-xs font-semibold'>
                                                                    {instance.settings.ipConfiguration.requireSsl ? 'Sí' : 'No'}
                                                                </p>
                                                            </div>
                                                        </div>
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