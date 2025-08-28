'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getUptime } from '@/lib/getUptimeInstance'
import { Accordion } from '@radix-ui/react-accordion'
import { Globe, HardDrive, MapPin, Network, Server } from 'lucide-react'


interface Ec2ResourceViewHistoricInfoComponentProps {
    instances: unknown[]
}

const getPublicIpCount = (publicIps: (string | null)[]) => {
    return publicIps.filter((ip) => ip !== null).length
}

export const Ec2ResourceViewHistoricInfoComponent = ({ instances }: Ec2ResourceViewHistoricInfoComponentProps) => {
    console.log(instances);
    return (
        <ScrollArea className="max-h-[60vh]">
            {
                instances && (
                    instances.map((instance, index) => {
                        const uptimeInstance = getUptime(new Date(instance.LaunchTime));
                        // EBS
                        const totalEbsVolumes = instance.Total_EBS_Volumes;
                        const totalAttachments = instance.Total_Attachments;
                        const instanceEbs = instance.BlockDeviceMappings_Ebs_VolumeId;
                        const instanceEbsDeviceName = instance.BlockDeviceMappings_DeviceName;
                        const instanceEbsStatus = instance.BlockDeviceMappings_Ebs_Status;
                        const instanceEbsSize = instance.BlockDeviceMappings_Ebs_Size;
                        const instanceEbsAttachTime = instance.BlockDeviceMappings_Ebs_AttachTime;
                        // NETWORK
                        const totalInterfaces = instance.NetworkInterfaces_Attachment_AttachmentId
                        const publicIpCount = instance.NetworkInterfaces_Association_PublicIp;
                        const publicIp = instance.NetworkInterfaces_Association_PublicIp;
                        const publicDnsName = instance.NetworkInterfaces_Association_PublicDnsName;
                        return (
                            <Card key={index} className='my-5'>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Server className="h-5 w-5 text-blue-500" />
                                        Instancia {instance.InstanceId}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between gap-5">
                                            <span></span>
                                            <Badge variant="default" className="bg-green-100 text-green-800">
                                                {instance.State_Name}
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
                                            <span className="font-medium">{instance.InstanceType}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Región:</span>
                                            <span className="font-medium flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {instance.region}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">SO:</span>
                                            <span className="font-medium">{instance.PlatformDetails}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Despliegue:</span>
                                            <span className="font-medium">{instance.InstancePurchaseMethod}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-500'>Uptime:</span>
                                            <span className='font-medium text-green-600'>{uptimeInstance}</span>
                                        </div>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-muted/30'>
                                            <div className='flex items-center gap-2'>
                                                <HardDrive className='h-4 w-4 text-muted-foreground' />
                                                <p className='text-xs text-muted-foreground'>Volúmenes EBS</p>
                                                <p className='text-lg font-semibold'>{instance.Total_EBS_Volumes}</p>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <HardDrive className='h-4 w-4 text-muted-foreground' />
                                                <p className='text-xs text-muted-foreground'>Volumenes Attached</p>
                                                <p className='text-lg font-semibold'>{instance.Total_Attachments}</p>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Network className='h-4 w-4 text-muted-foreground' />
                                                <p className='text-xs text-muted-foreground'>Interfaces</p>
                                                <p className='text-lg font-semibold'>
                                                    {instance.NetworkInterfaces_Attachment_AttachmentId.length}
                                                </p>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Globe className='h-4 w-4 text-muted-foreground' />
                                                <p className='text-xs text-muted-foreground'>IPs Públicas</p>
                                                <p className='text-lg font-semibold'>
                                                    {getPublicIpCount(instance.NetworkInterfaces_Association_PublicIp)}
                                                </p>
                                            </div>
                                        </div>
                                        <Accordion type='single' collapsible className='w-full'>
                                            <AccordionItem
                                                value={`ebs-${instance.InstanceId}`}
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
                                                        {instanceEbs.map((volumeId, ebsIndex) => (
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
                                                                        {instanceEbsDeviceName[ebsIndex]}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className='text-xs text-muted-foreground'>Estado</p>
                                                                    <p className='text-xs'>
                                                                        {instanceEbsStatus[ebsIndex]}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className='text-xs text-muted-foreground'>Tamaño</p>
                                                                    <p className='text-xs'>
                                                                        {instanceEbsSize[ebsIndex]} GB
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className='text-xs text-muted-foreground'>Attach Time</p>
                                                                    <p className='text-xs font-mono'>
                                                                        {new Date(instanceEbsAttachTime[ebsIndex]).toLocaleString()}
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
                                                value={`interface-${instance.InstanceId}`}
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
                                                                    <p className='text-xs text-muted-foreground'>Interface Attachment ID</p>
                                                                    <p className='text-xs font-mono'>{netInterface}</p>
                                                                </div>
                                                                <div>
                                                                    <p className='text-xs text-muted-foreground'>IPs PÚBLICAS</p>
                                                                    <p className='text-xs font-semibold'>
                                                                        {publicIp[interfaceIndex]}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className='text-xs text-muted-foreground'>Nombre DNS Público</p>
                                                                    <p className='text-xs'>
                                                                        {publicDnsName[interfaceIndex]}
                                                                    </p>
                                                                </div>
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