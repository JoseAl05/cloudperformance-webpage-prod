'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HardDrive, History, MapPin, Network, Server } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AzureVmHistoricInfoComponent, AzureInstance, VmStatus, VmDisk, VmNic } from './AzureVmHistoricInfoComponent';
import { getUptime } from '@/lib/getUptimeInstance';

export interface AzureGroupData {
    instance_name: string;
    history_data?: AzureInstance[];
    [key: string]: unknown;
}

export const AzureVmInfoComponent = ({ data }: { data: AzureGroupData[] | null }) => {
    
    if (!data || data.length === 0) return null;

    const group = data[0];
    const instances = group.history_data || [];
    const latestInstance = instances[0];
    const instanceId = group.instance_name;

    const type = latestInstance?.hardware_profile?.vm_size || 'N/A';
    const region = latestInstance?.location || 'N/A';
    
    const osName = latestInstance?.instance_view?.os_name;
    const osVersion = latestInstance?.instance_view?.os_version;
    const baseOsType = latestInstance?.storage_profile?.os_disk?.os_type || 'N/A';
    const finalOs = osName ? `${osName} ${osVersion || ''}` : baseOsType;
    
    const statuses = latestInstance?.instance_view?.statuses || [];
    const powerStatusObj = statuses.find((s: VmStatus) => s.code?.startsWith('PowerState/'));
    const status = powerStatusObj?.display_status || 'Unknown';
    
    const isRunning = status.toLowerCase().includes('running');
    const statusColor = isRunning ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20';

    const osDisk = latestInstance?.storage_profile?.os_disk ? [latestInstance.storage_profile.os_disk] : [];
    const dataDisks = latestInstance?.storage_profile?.data_disks || [];
    const allDisks = [...osDisk, ...dataDisks];
    
    const networkInterfaces = latestInstance?.network_profile?.network_interfaces || [];

    const creationDate = latestInstance?.time_created ? new Date(latestInstance.time_created as string | number | Date) : new Date();
    const uptime = getUptime(creationDate);

    return (
        <div className='w-full xl:w-[22rem] relative'>
            <div className='absolute left-8 -top-4 text-sm font-medium text-muted-foreground bg-background px-2 py-1 rounded-md border border-border/30 shadow-sm z-10'>
                {instances.length} observaciones
            </div>
            <Card>
                <CardHeader className='pb-3 pt-6'>
                    <CardTitle className='text-lg flex items-center gap-2'>
                        <Server className='h-5 w-5 text-blue-600' />
                        Detalle Máquina Virtual
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='flex items-center justify-between gap-5'>
                        <span className='font-semibold text-sm truncate max-w-[150px]' title={instanceId}>{instanceId}</span>
                        <Badge variant='default' className={statusColor}>
                            {status.replace('VM ', '')}
                        </Badge>
                    </div>
                    
                    <div className='space-y-2 text-sm'>
                        <div className='flex justify-between'>
                            <span className='text-gray-500'>Tamaño:</span>
                            <span className='font-medium truncate max-w-[150px]' title={type}>{type}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-gray-500'>Sistema Operativo:</span>
                            <span className='font-medium capitalize'>{finalOs}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-gray-500'>Región:</span>
                            <span className='font-medium flex items-center gap-1'>
                                <MapPin className='h-3 w-3' /> {region}
                            </span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-gray-500'>Uptime Estimado:</span>
                            <span className='font-medium text-green-600'>{uptime}</span>
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-2 p-2 rounded-lg bg-muted/30'>
                        <div className='flex items-center gap-2'>
                            <HardDrive className='h-4 w-4 text-muted-foreground' />
                            <div>
                                <p className='text-xs text-muted-foreground'>Discos</p>
                                <p className='text-sm font-semibold'>{allDisks.length}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Network className='h-4 w-4 text-muted-foreground' />
                            <div>
                                <p className='text-xs text-muted-foreground'>Interfaces Red</p>
                                <p className='text-sm font-semibold'>{networkInterfaces.length}</p>
                            </div>
                        </div>
                    </div>

                    <Accordion type='single' collapsible className='w-full'>
                        <AccordionItem value='disks' className='border-none'>
                            <AccordionTrigger className='hover:no-underline py-2 px-0'>
                                <span className='flex items-center gap-2 text-sm font-medium'>
                                    <HardDrive className='h-4 w-4' /> DISCOS ASIGNADOS
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className='pt-2 space-y-3'>
                                {allDisks.map((disk: VmDisk, idx: number) => (
                                    <div key={idx} className='p-3 rounded-lg bg-muted/30 text-xs'>
                                        <p className='font-semibold truncate' title={disk.name}>{disk.name}</p>
                                        <p className='text-muted-foreground mt-1'>Tipo: <span className="font-medium text-foreground">{disk.managed_disk?.storage_account_type || 'N/A'}</span></p>
                                        <p className='text-muted-foreground'>Tamaño: <span className="font-medium text-foreground">{disk.disk_size_gb || 0} GB</span></p>
                                    </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value='network' className='border-none'>
                            <AccordionTrigger className='hover:no-underline py-2 px-0'>
                                <span className='flex items-center gap-2 text-sm font-medium'>
                                    <Network className='h-4 w-4' /> INTERFACES DE RED
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className='pt-2 space-y-3'>
                                {networkInterfaces.map((nic: VmNic, idx: number) => {
                                    const nicName = nic.id?.split('/').pop() || 'Desconocido';
                                    return (
                                        <div key={idx} className='p-3 rounded-lg bg-muted/30 text-xs'>
                                            <p className='text-muted-foreground'>Nombre Interfaz</p>
                                            <p className='font-mono font-medium truncate' title={nicName}>{nicName}</p>
                                        </div>
                                    )
                                })}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <div className='pt-3 border-t'>
                        <Dialog>
                            <DialogTrigger className='flex w-full items-center justify-center gap-2 text-sm text-blue-600 hover:underline cursor-pointer'>
                                <History className='h-4 w-4' /> Ver Historial de Cambios
                            </DialogTrigger>
                            <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
                                <DialogHeader>
                                    <DialogTitle>Historial de {instanceId}</DialogTitle>
                                    <DialogDescription>Observaciones de metadatos a lo largo del tiempo</DialogDescription>
                                </DialogHeader>
                                <AzureVmHistoricInfoComponent instances={instances} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}