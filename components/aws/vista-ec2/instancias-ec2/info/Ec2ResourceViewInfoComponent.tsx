'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Earth, Globe, HardDrive, History, Laptop, MapPin, Network, Server, Settings } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Ec2ResourceViewHistoricInfoComponent } from '@/components/aws/vista-ec2/instancias-ec2/info/Ec2ResourceViewHistoricInfoComponent';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getUptime } from '@/lib/getUptimeInstance';

interface Ec2ResourceViewInfoComponentProps {
    data: unknown
}


export const Ec2ResourceViewInfoComponent = ({ data }: Ec2ResourceViewInfoComponentProps) => {
    const statusColors = {
        running: 'bg-green-500/10 text-green-500 border-green-500/20',
        stopped: 'bg-red-500/10 text-red-500 border-red-500/20',
        pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    }

    const quickActions = [
        { icon: History, label: 'Ver Historial', color: 'blue' },
    ];
    const groupedInstances = data ? data.reduce(
        (acc, instance) => {
            if (!acc[instance.InstanceId]) {
                acc[instance.InstanceId] = []
            }
            acc[instance.InstanceId].push(instance)
            return acc
        },
        {} as Record<string, InstanceData[]>,
    ) : []

    const getPublicIpCount = (publicIps: (string | null)[]) => {
        return publicIps.filter((ip) => ip !== null).length
    }
    return (
        <div className='w-full xl:w-[22rem]'>
            <div className='space-y-8'>
                {Object.entries(groupedInstances).map(([instanceId, instances]) => {
                    // INSTANCE METADATA
                    const latestInstanceState = instances[0].State_Name;
                    const latestInstanceType = instances[0].InstanceType;
                    const latestInstanceRegion = instances[0].region;
                    const latestInstanceSO = instances[0].PlatformDetails;
                    const latestInstancePurchaseMethod = instances[0].InstancePurchaseMethod;
                    // INSTANCE EBS VOLUMES
                    const latestTotalEbsVolumes = instances[0].Total_EBS_Volumes;
                    const latestTotalAttachments = instances[0].Total_Attachments;
                    const latestInstanceEbs = instances[0].BlockDeviceMappings_Ebs_VolumeId;
                    const latestInstanceEbsDeviceName = instances[0].BlockDeviceMappings_DeviceName;
                    const latestInstanceEbsStatus = instances[0].BlockDeviceMappings_Ebs_Status;
                    const latestInstanceEbsSize = instances[0].BlockDeviceMappings_Ebs_Size;
                    const latestInstanceEbsAttachTime = instances[0].BlockDeviceMappings_Ebs_AttachTime;
                    // INSTANCE NETWORK
                    const latestTotalInterfaces = instances[0].NetworkInterfaces_Attachment_AttachmentId
                    const latestPublicIpCount = instances[0].NetworkInterfaces_Association_PublicIp;
                    const latestPublicIp = instances[0].NetworkInterfaces_Association_PublicIp;
                    const latestPublicDnsName = instances[0].NetworkInterfaces_Association_PublicDnsName;

                    const latestLaunchTime = new Date(instances[0].LaunchTime);

                    const today = new Date();
                    const latestSyncTime = new Date(instances[0].sync_time);
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
                                                <span className='font-semibold text-sm'>{instanceId}</span>
                                                <Badge variant='default' className={statusColors[latestInstanceState]}>
                                                    {latestInstanceState}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className='space-y-2 text-sm'>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500'>Tipo:</span>
                                                <span className='font-medium'>{latestInstanceType}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500'>SO:</span>
                                                <span className='font-medium'>{latestInstanceSO}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500'>Despliegue:</span>
                                                <span className='font-medium'>{latestInstancePurchaseMethod}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500'>Región:</span>
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
                                                    <p className='text-xs text-muted-foreground'>Volúmenes EBS</p>
                                                    <p className='text-lg font-semibold'>{latestTotalEbsVolumes}</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <HardDrive className='h-4 w-4 text-muted-foreground' />
                                                    <p className='text-xs text-muted-foreground'>Volumenes Attached</p>
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
                                                        {getPublicIpCount(latestPublicIpCount)}
                                                    </p>
                                                </div>
                                            </div>
                                            <Accordion type='single' collapsible className='w-full'>
                                                <AccordionItem
                                                    value={`ebs-${instanceId}`}
                                                    className='border-none'
                                                >
                                                    <AccordionTrigger className='hover:no-underline py-2 px-0 cursor-pointer'>
                                                        <span className='flex items-center gap-2 text-sm font-medium'>
                                                            <HardDrive className='h-4 w-4' />
                                                            INFORMACIÓN EBS
                                                        </span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className='pt-4'>
                                                        <div className='space-y-3 pl-6 border-l-2 border-border/30'>
                                                            {latestInstanceEbs.map((volumeId, ebsIndex) => (
                                                                <div
                                                                    key={ebsIndex}
                                                                    className='grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 p-3 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50'
                                                                >
                                                                    <div>
                                                                        <p className='text-xs text-muted-foreground'>Volume ID</p>
                                                                        <p className='text-xs font-mono'>{volumeId}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className='text-xs text-muted-foreground'>Nombre Dispositivo</p>
                                                                        <p className='text-xs font-semibold'>
                                                                            {latestInstanceEbsDeviceName[ebsIndex]}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p className='text-xs text-muted-foreground'>Estado</p>
                                                                        <p className='text-xs'>
                                                                            {latestInstanceEbsStatus[ebsIndex]}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p className='text-xs text-muted-foreground'>Tamaño</p>
                                                                        <p className='text-xs'>
                                                                            {latestInstanceEbsSize[ebsIndex]} GB
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p className='text-xs text-muted-foreground'>Attach Time</p>
                                                                        <p className='text-xs font-mono'>
                                                                            {new Date(latestInstanceEbsAttachTime[ebsIndex]).toLocaleString()}
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
                                                                        <p className='text-xs text-muted-foreground'>Interface Attachment ID</p>
                                                                        <p className='text-xs font-mono'>{netInterface}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className='text-xs text-muted-foreground'>IPs PÚBLICAS</p>
                                                                        <p className='text-xs font-semibold'>
                                                                            {latestPublicIp[interfaceIndex]}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p className='text-xs text-muted-foreground'>Nombre DNS Público</p>
                                                                        <p className='text-xs'>
                                                                            {latestPublicDnsName[interfaceIndex]}
                                                                        </p>
                                                                    </div>
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
                                                            <Ec2ResourceViewHistoricInfoComponent
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