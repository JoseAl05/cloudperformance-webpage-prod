'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, HardDrive, History, MapPin, Network, Server } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion'
import { ComputeEngineHistoricInfoComponent } from './ComputeEngineHistoricInfoComponent';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getUptime } from '@/lib/getUptimeInstance';
import { ComputeEngineInfoResponse, ComputeEngineInfoHistoryData } from '@/interfaces/cEInterfaces';

interface ComputeEngineInfoComponentProps {
    data: ComputeEngineInfoResponse | null
}

export const ComputeEngineInfoComponent = ({ data }: ComputeEngineInfoComponentProps) => {
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

    const quickActions = [
        { icon: History, label: 'Ver Historial', color: 'blue' },
    ];

    const getPublicIpCount = (instances: ComputeEngineInfoHistoryData) => {
        let count = 0;
        instances.networkInterfaces.forEach(ni => {
            if (ni.accessConfigs && ni.accessConfigs.length > 0) {
                count += ni.accessConfigs.filter(ac => ac.name).length;
            }
        });
        return count;
    }

    return (
        <div className='w-full xl:w-[22rem]'>
            <div className='space-y-8'>
                {data && data.map((group, groupIndex) => {
                    const instances = group.history_data;
                    const instanceId = group.instance_id;
                    const latestInstance = instances[0];

                    const latestInstanceState = latestInstance.status;
                    const latestInstanceType = latestInstance.machineType.split('/').pop() || latestInstance.machineType;
                    const latestInstanceRegion = latestInstance.zone.split('/').pop() || latestInstance.zone;
                    const latestInstanceSO = latestInstance.cpuPlatform; 
                    const latestInstancePurchaseMethod = latestInstance.scheduling.provisioningModel;

                    const latestTotalEbsVolumes = latestInstance.disks.length;
                    const latestTotalAttachments = latestInstance.disks.length;
                    const latestInstanceEbs = latestInstance.disks;

                    const latestTotalInterfaces = latestInstance.networkInterfaces;
                    
                    const latestLaunchTime = new Date(latestInstance.lastStartTimestamp || latestInstance.creationTimestamp);

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
                        <div key={instanceId}>
                            <div className='absolute left-12 -top-10 text-sm font-medium text-muted-foreground bg-background px-2 py-1 rounded-md border border-border/30 shadow-sm z-0 transition-all duration-200 group-hover:border-blue-500/30 group-hover:text-blue-600'>
                                {observationCount} observaciones
                            </div>
                            <div className=''>
                                <Card>
                                    <CardHeader className='pb-3'>
                                        <CardTitle className='text-lg flex items-center gap-2'>
                                            <Server className='h-5 w-5 text-blue-500' />
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
                                                <span className='text-gray-500'>Tipo:</span>
                                                <span className='font-medium truncate max-w-[180px]' title={latestInstanceType}>{latestInstanceType}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500'>CPU Platform:</span>
                                                <span className='font-medium'>{latestInstanceSO}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500'>Despliegue:</span>
                                                <span className='font-medium'>{latestInstancePurchaseMethod}</span>
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
                                                    <p className='text-xs text-muted-foreground'>Discos</p>
                                                    <p className='text-lg font-semibold'>{latestTotalEbsVolumes}</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <HardDrive className='h-4 w-4 text-muted-foreground' />
                                                    <p className='text-xs text-muted-foreground'>Adjuntos</p>
                                                    <p className='text-lg font-semibold'>{latestTotalAttachments}</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <Network className='h-4 w-4 text-muted-foreground' />
                                                    <p className='text-xs text-muted-foreground'>Interfaces</p>
                                                    <p className='text-lg font-semibold'>
                                                        {latestTotalInterfaces.length}
                                                    </p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <Globe className='h-4 w-4 text-muted-foreground' />
                                                    <p className='text-xs text-muted-foreground'>IPs Públicas</p>
                                                    <p className='text-lg font-semibold'>
                                                        {getPublicIpCount(latestInstance)}
                                                    </p>
                                                </div>
                                            </div>
                                            <Accordion type='single' collapsible className='w-full'>
                                                <AccordionItem
                                                    value={`disk-${instanceId}`}
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
                                                            {latestInstanceEbs.map((disk, diskIndex) => (
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
                                                    value={`interface-${instanceId}`}
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
                                                            {latestTotalInterfaces.map((netInterface, interfaceIndex) => (
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
                                                                <DialogDescription>Información historica</DialogDescription>
                                                            </DialogHeader>
                                                            <ComputeEngineHistoricInfoComponent
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