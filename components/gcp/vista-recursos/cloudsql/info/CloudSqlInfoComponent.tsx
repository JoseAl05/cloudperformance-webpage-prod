'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, HardDrive, History, MapPin, Network, Database, ShieldCheck } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion'
import { CloudSqlHistoricInfoComponent } from './CloudSqlHistoricInfoComponent';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getUptime } from '@/lib/getUptimeInstance';
import { CloudSqlInfo, HistoryDatum } from '@/interfaces/sqlInterfaces';

interface CloudSqlInfoComponentProps {
    data: CloudSqlInfo[] | null
}

export const CloudSqlInfoComponent = ({ data }: CloudSqlInfoComponentProps) => {
    const statusColors: Record<string, string> = {
        RUNNABLE: 'bg-green-500/10 text-green-500 border-green-500/20',
        SUSPENDED: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        PENDING_CREATE: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        MAINTENANCE: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        FAILED: 'bg-red-500/10 text-red-500 border-red-500/20',
        UNKNOWN_STATE: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    }

    const quickActions = [
        { icon: History, label: 'Ver Historial', color: 'blue' },
    ];

    return (
        <div className='w-full xl:w-[22rem]'>
            <div className='space-y-8'>
                {data && data.map((group) => {
                    const instances = group.history_data;
                    const instanceId = group.instance_id;
                    const latestInstance = instances[0];

                    const latestInstanceState = latestInstance.state;
                    const latestInstanceType = latestInstance.settings.tier;
                    const latestInstanceRegion = latestInstance.gceZone;
                    const latestDatabaseVersion = latestInstance.databaseVersion;
                    const latestEdition = latestInstance.settings.edition;

                    const latestStorageSize = latestInstance.settings.dataDiskSizeGb;
                    const latestStorageType = latestInstance.settings.dataDiskType;

                    const latestIpAddresses = latestInstance.ipAddresses;

                    const latestLaunchTime = new Date(latestInstance.createTime);

                    const today = new Date();
                    const latestSyncTime = new Date(latestInstance.sync_time);
                    const isToday =
                        latestSyncTime.getDate() === today.getDate() &&
                        latestSyncTime.getMonth() === today.getMonth() &&
                        latestSyncTime.getFullYear() === today.getFullYear();
                    const instanceCardTitle = isToday
                        ? 'Instancia Actual'
                        : `Instancia a fecha de: ${latestSyncTime.toLocaleDateString()}`;

                    const uptimeInstance = getUptime(latestLaunchTime);

                    const observationCount = instances.length

                    return (
                        <div key={instanceId} className="relative group">
                            <div className=''>
                                <Card>
                                    <CardHeader className='pb-3'>
                                        <CardTitle className='text-lg flex items-center gap-2'>
                                            <Database className='h-5 w-5 text-blue-500' />
                                            {instanceCardTitle}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='space-y-4'>
                                        <div>
                                            <div className='flex items-center justify-between gap-5'>
                                                <span className='font-semibold text-sm truncate max-w-[150px]' title={instanceId}>{instanceId}</span>
                                                <Badge variant='default' className={statusColors[latestInstanceState] || 'bg-gray-500/10 text-gray-500'}>
                                                    {latestInstanceState}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className='space-y-2 text-sm'>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500'>Tier:</span>
                                                <span className='font-medium truncate max-w-[180px]' title={latestInstanceType}>{latestInstanceType}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500'>Versión DB:</span>
                                                <span className='font-medium truncate max-w-[180px]' title={latestDatabaseVersion}>{latestDatabaseVersion}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500'>Edición:</span>
                                                <span className='font-medium'>{latestEdition}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500'>Zona:</span>
                                                <span className='font-medium flex items-center gap-1'>
                                                    <MapPin className='h-3 w-3' />
                                                    {latestInstanceRegion}
                                                </span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500'>Uptime:</span>
                                                <span className='font-medium text-green-600'>{uptimeInstance}</span>
                                            </div>
                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-muted/30'>
                                                <div className='flex items-center gap-2'>
                                                    <HardDrive className='h-4 w-4 text-muted-foreground' />
                                                    <p className='text-xs text-muted-foreground'>Storage</p>
                                                    <p className='text-lg font-semibold'>{latestStorageSize} GB</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <ShieldCheck className='h-4 w-4 text-muted-foreground' />
                                                    <p className='text-xs text-muted-foreground'>Backups</p>
                                                    <p className='text-lg font-semibold'>{latestInstance.settings.backupConfiguration.enabled ? 'On' : 'Off'}</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <Network className='h-4 w-4 text-muted-foreground' />
                                                    <p className='text-xs text-muted-foreground'>HA Type</p>
                                                    <p className='text-sm font-semibold truncate'>
                                                        {latestInstance.settings.availabilityType}
                                                    </p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <Globe className='h-4 w-4 text-muted-foreground' />
                                                    <p className='text-xs text-muted-foreground'>IPs</p>
                                                    <p className='text-lg font-semibold'>
                                                        {latestIpAddresses.length}
                                                    </p>
                                                </div>
                                            </div>
                                            <Accordion type='single' collapsible className='w-full'>
                                                <AccordionItem
                                                    value={`storage-${instanceId}`}
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
                                                                    <p className='text-xs font-semibold'>
                                                                        {latestStorageType}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className='text-xs text-muted-foreground'>Tamaño</p>
                                                                    <p className='text-xs font-semibold'>
                                                                        {latestStorageSize} GB
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className='text-xs text-muted-foreground'>Auto-Resize</p>
                                                                    <p className='text-xs font-mono'>
                                                                        {latestInstance.settings.storageAutoResize ? 'Sí' : 'No'}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className='text-xs text-muted-foreground'>Límite Resize</p>
                                                                    <p className='text-xs'>
                                                                        {latestInstance.settings.storageAutoResizeLimit === '0' ? 'Sin límite' : `${latestInstance.settings.storageAutoResizeLimit} GB`}
                                                                    </p>
                                                                </div>
                                                                <div className='col-span-1 md:col-span-2'>
                                                                    <p className='text-xs text-muted-foreground'>Backup Retención</p>
                                                                    <p className='text-xs font-mono'>
                                                                        {latestInstance.settings.backupConfiguration.backupRetentionSettings.retainedBackups} {latestInstance.settings.backupConfiguration.backupRetentionSettings.retentionUnit}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                            <Accordion type='single' collapsible className='w-full'>
                                                <AccordionItem
                                                    value={`network-${instanceId}`}
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
                                                            {latestIpAddresses.map((ip, idx) => (
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
                                                                    <p className='text-xs font-mono'>{latestInstance.settings.ipConfiguration.sslMode}</p>
                                                                </div>
                                                                <div>
                                                                    <p className='text-xs text-muted-foreground'>Require SSL</p>
                                                                    <p className='text-xs font-semibold'>
                                                                        {latestInstance.settings.ipConfiguration.requireSsl ? 'Sí' : 'No'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </div>
                                        <div className='pt-3 border-t'>
                                            <div className='grid grid-cols-1 gap-2'>
                                                {quickActions.map((action, index) => (
                                                    <Dialog
                                                        key={index}
                                                        className='gap-2 justify-center'
                                                    >
                                                        <DialogTrigger className='flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-110'>
                                                            <action.icon className={`h-4 w-4 text-${action.color}-500`} />
                                                            {action.label}
                                                        </DialogTrigger>
                                                        <DialogContent className='max-w-2xl max-h-[80vh] sm:max-w-4xl'>
                                                            <DialogHeader>
                                                                <DialogTitle>Historial Instancia {instanceId}</DialogTitle>
                                                                <DialogDescription>Información histórica</DialogDescription>
                                                            </DialogHeader>
                                                            <CloudSqlHistoricInfoComponent
                                                                instances={instances}
                                                            />
                                                        </DialogContent>
                                                    </Dialog>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}