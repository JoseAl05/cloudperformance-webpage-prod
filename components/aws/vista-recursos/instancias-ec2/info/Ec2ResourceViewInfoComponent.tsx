'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Earth, Globe, HardDrive, Laptop, MapPin, Network, Server, Settings } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Ec2ResourceViewHistoricInfoComponent } from './Ec2ResourceViewHistoricInfoComponent';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Ec2ResourceViewInfoComponentProps {
    data: unknown
}


export const Ec2ResourceViewInfoComponent = ({ data }: Ec2ResourceViewInfoComponentProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const statusColors = {
        running: "bg-green-500/10 text-green-500 border-green-500/20",
        stopped: "bg-red-500/10 text-red-500 border-red-500/20",
        pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    }

    const billingColors = {
        "on-demand": "bg-blue-500/10 text-blue-400 border-blue-500/20",
        spot: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        reserved: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    }
    const quickActions = [
        { icon: Settings, label: "Ver Historial", color: "blue" },
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
    const formatSyncTime = (syncTime: string) => {
        const cleanSyncTime = syncTime.replace(' ', 'T').replace(/\.\d+/, '')
        const date = new Date(cleanSyncTime)
        return date.toLocaleString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
    }
    const getPublicIpCount = (publicIps: (string | null)[]) => {
        return publicIps.filter((ip) => ip !== null).length
    }

    const getUptime = (launchTime: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - launchTime.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);
        return `${diffDays}d ${diffHours}h ${diffMinutes}m`;
    }
    return (
        <div className="w-[25rem] h-full">
            <div className="space-y-8">
                {Object.entries(groupedInstances).map(([instanceId, instances]) => {
                    // INSTANCE METADATA
                    const latestInstance = instances[0];
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

                    const uptimeInstance = getUptime(latestLaunchTime);


                    const observationCount = instances.length

                    return (
                        <div key={instanceId}>
                            <div className="absolute left-12 -top-10 text-sm font-medium text-muted-foreground bg-background px-2 py-1 rounded-md border border-border/30 shadow-sm z-0 transition-all duration-200 group-hover:border-blue-500/30 group-hover:text-blue-600">
                                {observationCount} observaciones
                            </div>
                            <div className=''>
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Server className="h-5 w-5 text-blue-500" />
                                            Instancia Actual
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between gap-5">
                                                <span className="font-semibold text-sm">{instanceId}</span>
                                                <Badge variant="default" className="bg-green-100 text-green-800">
                                                    {latestInstanceState}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Tipo:</span>
                                                <span className="font-medium">{latestInstanceType}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">SO:</span>
                                                <span className="font-medium">{latestInstanceSO}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Despliegue:</span>
                                                <span className="font-medium">{latestInstancePurchaseMethod}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Región:</span>
                                                <span className="font-medium flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {latestInstanceRegion}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Uptime:</span>
                                                <span className="font-medium text-green-600">{uptimeInstance}</span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-muted/30">
                                                <div className='flex items-center gap-2'>
                                                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                                                    <p className="text-xs text-muted-foreground">Volúmenes EBS</p>
                                                    <p className="text-lg font-semibold">{latestTotalEbsVolumes}</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                                                    <p className="text-xs text-muted-foreground">Volumenes Attached</p>
                                                    <p className="text-lg font-semibold">{latestTotalAttachments}</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <Network className="h-4 w-4 text-muted-foreground" />
                                                    <p className="text-xs text-muted-foreground">Interfaces</p>
                                                    <p className="text-lg font-semibold">
                                                        {latestTotalInterfaces.length}
                                                    </p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                                    <p className="text-xs text-muted-foreground">IPs Públicas</p>
                                                    <p className="text-lg font-semibold">
                                                        {getPublicIpCount(latestPublicIpCount)}
                                                    </p>
                                                </div>
                                            </div>
                                            <Accordion type="single" collapsible className="w-full">
                                                <AccordionItem
                                                    value={`ebs-${instanceId}`}
                                                    className="border-none"
                                                >
                                                    <AccordionTrigger className="hover:no-underline py-2 px-0">
                                                        <span className="flex items-center gap-2 text-sm font-medium">
                                                            <HardDrive className="h-4 w-4" />
                                                            INFORMACIÓN EBS
                                                        </span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="pt-4">
                                                        <div className="space-y-3 pl-6 border-l-2 border-border/30">
                                                            {latestInstanceEbs.map((volumeId, ebsIndex) => (
                                                                <div
                                                                    key={ebsIndex}
                                                                    className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 p-3 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50"
                                                                >
                                                                    <div>
                                                                        <p className="text-xs text-muted-foreground">Volume ID</p>
                                                                        <p className="text-xs font-mono">{volumeId}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-muted-foreground">Nombre Dispositivo</p>
                                                                        <p className="text-xs font-semibold">
                                                                            {latestInstanceEbsDeviceName[ebsIndex]}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-muted-foreground">Estado</p>
                                                                        <p className="text-xs">
                                                                            {latestInstanceEbsStatus[ebsIndex]}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-muted-foreground">Tamaño</p>
                                                                        <p className="text-xs">
                                                                            {latestInstanceEbsSize[ebsIndex]} GB
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-muted-foreground">Attach Time</p>
                                                                        <p className="text-xs font-mono">
                                                                            {new Date(latestInstanceEbsAttachTime[ebsIndex]).toLocaleString()}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                            <Accordion type="single" collapsible className="w-full">
                                                <AccordionItem
                                                    value={`interface-${instanceId}`}
                                                    className="border-none"
                                                >
                                                    <AccordionTrigger className="hover:no-underline py-2 px-0">
                                                        <span className="flex items-center gap-2 text-sm font-medium">
                                                            <Network className="h-4 w-4" />
                                                            INFORMACIÓN INTERFACES
                                                        </span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="pt-4">
                                                        <div className="space-y-3 pl-6 border-l-2 border-border/30">
                                                            {latestTotalInterfaces.map((netInterface, interfaceIndex) => (
                                                                <div
                                                                    key={interfaceIndex}
                                                                    className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50"
                                                                >
                                                                    <div>
                                                                        <p className="text-xs text-muted-foreground">Interface Attachment ID</p>
                                                                        <p className="text-xs font-mono">{netInterface}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-muted-foreground">IPs PÚBLICAS</p>
                                                                        <p className="text-xs font-semibold">
                                                                            {latestPublicIp[interfaceIndex]}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-muted-foreground">Nombre DNS Público</p>
                                                                        <p className="text-xs">
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
                                        <div className="pt-3 border-t">
                                            <div className="grid grid-cols-1 gap-2">
                                                {quickActions.map((action, index) => (
                                                    <Dialog
                                                        key={index}
                                                        // variant="outline"
                                                        // size="sm"
                                                        className="gap-2 justify-center"
                                                    >
                                                        <DialogTrigger>
                                                            <action.icon className={`h-4 w-4 text-${action.color}-500`} />
                                                            {action.label}
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-2xl max-h-[80vh] sm:max-w-4xl">
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
                                        {/* <Ec2ResourceViewHistoricInfoComponent
                                            instances={instances}
                                        /> */}
                                    </CardContent>
                                </Card>
                                {/* <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5">
                                        <CardHeader className="pb-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2 text-blue-400">
                                                        <Server className="h-4 w-4" />
                                                        <span className="font-mono text-sm">{instanceId}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Globe className="h-4 w-4" />
                                                        <span className="text-sm">{latestInstance.region}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <Accordion type="single" collapsible className="w-full">
                                                <AccordionItem value={`observations-${instanceId}`} className="border-none">
                                                    <AccordionTrigger className="hover:no-underline py-2 px-0">
                                                        <span className="flex items-center gap-2 text-sm font-medium">
                                                            <Clock className="h-4 w-4" />
                                                            OBSERVACIONES ({observationCount})
                                                        </span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="pt-4">
                                                        <div className="space-y-6">
                                                            {instances.map((instance, index) => (
                                                                <div
                                                                    key={`${instance.sync_time}-${index}`}
                                                                    className="border-2 rounded-md border-blue-500/30 p-4"
                                                                >
                                                                    <div className="flex items-center gap-2 mb-4">
                                                                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                                                        <span className="text-sm font-semibold text-blue-600">
                                                                            {formatSyncTime(instance.sync_time)}
                                                                        </span>
                                                                    </div>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                                                        <div className="space-y-1">
                                                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                                                Fecha Encendido
                                                                            </p>
                                                                            <p className="text-sm font-mono">{instance.LaunchTime}</p>
                                                                        </div>

                                                                        <div className="space-y-1">
                                                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                                                Tipo de Instancia
                                                                            </p>
                                                                            <p className="text-sm font-semibold">{instance.InstanceType}</p>
                                                                        </div>

                                                                        <div className="space-y-1">
                                                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                                                SO
                                                                            </p>
                                                                            <p className="text-sm">{instance.PlatformDetails}</p>
                                                                        </div>

                                                                        <div className="space-y-1">
                                                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                                                Estado
                                                                            </p>
                                                                            <Badge
                                                                                className={statusColors[instance.State_Name as keyof typeof statusColors]}
                                                                                variant="outline"
                                                                            >
                                                                                {instance.State_Name}
                                                                            </Badge>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                                                Metodo de Despliegue
                                                                            </p>
                                                                            <Badge
                                                                                className={
                                                                                    billingColors[latestInstance.InstancePurchaseMethod as keyof typeof billingColors]
                                                                                }
                                                                                variant='outline'
                                                                            >
                                                                                {latestInstance.InstancePurchaseMethod}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50 mb-4">
                                                                        <div className="flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-muted/30">
                                                                            <HardDrive className="h-4 w-4 text-muted-foreground" />
                                                                            <div>
                                                                                <p className="text-xs text-muted-foreground">Volúmenes EBS</p>
                                                                                <p className="text-lg font-semibold">{instance.Total_EBS_Volumes}</p>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-muted/30">
                                                                            <HardDrive className="h-4 w-4 text-muted-foreground" />
                                                                            <div>
                                                                                <p className="text-xs text-muted-foreground">Volumenes Attached</p>
                                                                                <p className="text-lg font-semibold">{instance.Total_Attachments}</p>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-muted/30">
                                                                            <Network className="h-4 w-4 text-muted-foreground" />
                                                                            <div>
                                                                                <p className="text-xs text-muted-foreground">Interfaces</p>
                                                                                <p className="text-lg font-semibold">
                                                                                    {instance.NetworkInterfaces_Attachment_AttachmentId.length}
                                                                                </p>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-muted/30">
                                                                            <Globe className="h-4 w-4 text-muted-foreground" />
                                                                            <div>
                                                                                <p className="text-xs text-muted-foreground">IPs Públicas</p>
                                                                                <p className="text-lg font-semibold">
                                                                                    {getPublicIpCount(instance.NetworkInterfaces_Association_PublicIp)}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {instance.BlockDeviceMappings_Ebs_VolumeId.length > 0 && (
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem
                                                                                value={`ebs-${instance.sync_time}-${index}`}
                                                                                className="border-none"
                                                                            >
                                                                                <AccordionTrigger className="hover:no-underline py-2 px-0">
                                                                                    <span className="flex items-center gap-2 text-sm font-medium">
                                                                                        <HardDrive className="h-4 w-4" />
                                                                                        INFORMACIÓN EBS
                                                                                    </span>
                                                                                </AccordionTrigger>
                                                                                <AccordionContent className="pt-4">
                                                                                    <div className="space-y-3 pl-6 border-l-2 border-border/30">
                                                                                        {instance.BlockDeviceMappings_Ebs_VolumeId.map((volumeId, ebsIndex) => (
                                                                                            <div
                                                                                                key={ebsIndex}
                                                                                                className="grid grid-cols-2 md:grid-cols-5 gap-4 p-3 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50"
                                                                                            >
                                                                                                <div>
                                                                                                    <p className="text-xs text-muted-foreground">Volume ID</p>
                                                                                                    <p className="text-sm font-mono">{volumeId}</p>
                                                                                                </div>
                                                                                                <div>
                                                                                                    <p className="text-xs text-muted-foreground">Nombre Dispositivo</p>
                                                                                                    <p className="text-sm font-semibold">
                                                                                                        {instance.BlockDeviceMappings_DeviceName[ebsIndex]}
                                                                                                    </p>
                                                                                                </div>
                                                                                                <div>
                                                                                                    <p className="text-xs text-muted-foreground">Estado</p>
                                                                                                    <p className="text-sm">
                                                                                                        {instance.BlockDeviceMappings_Ebs_Status[ebsIndex]}
                                                                                                    </p>
                                                                                                </div>
                                                                                                <div>
                                                                                                    <p className="text-xs text-muted-foreground">Tamaño</p>
                                                                                                    <p className="text-sm">
                                                                                                        {instance.BlockDeviceMappings_Ebs_Size[ebsIndex]} GB
                                                                                                    </p>
                                                                                                </div>
                                                                                                <div>
                                                                                                    <p className="text-xs text-muted-foreground">Attach Time</p>
                                                                                                    <p className="text-xs font-mono">
                                                                                                        {instance.BlockDeviceMappings_Ebs_AttachTime[ebsIndex]}
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                    )}
                                                                    {instance.NetworkInterfaces_Attachment_AttachmentId.length > 0 && (
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem
                                                                                value={`interface-${instance.sync_time}-${index}`}
                                                                                className="border-none"
                                                                            >
                                                                                <AccordionTrigger className="hover:no-underline py-2 px-0">
                                                                                    <span className="flex items-center gap-2 text-sm font-medium">
                                                                                        <Network className="h-4 w-4" />
                                                                                        INFORMACIÓN INTERFACES
                                                                                    </span>
                                                                                </AccordionTrigger>
                                                                                <AccordionContent className="pt-4">
                                                                                    <div className="space-y-3 pl-6 border-l-2 border-border/30">
                                                                                        {instance.NetworkInterfaces_Attachment_AttachmentId.map((netAttachId, netAttachIdIndex) => (
                                                                                            <div
                                                                                                key={netAttachIdIndex}
                                                                                                className="grid grid-cols-2 md:grid-cols-3 gap-4 p-3 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50"
                                                                                            >
                                                                                                <div>
                                                                                                    <p className="text-xs text-muted-foreground">Interface Attachment ID</p>
                                                                                                    <p className="text-sm font-mono">{netAttachId}</p>
                                                                                                </div>
                                                                                                <div>
                                                                                                    <p className="text-xs text-muted-foreground">IPs PÚBLICAS</p>
                                                                                                    <p className="text-sm font-semibold">
                                                                                                        {instance.NetworkInterfaces_Association_PublicIp[netAttachIdIndex]}
                                                                                                    </p>
                                                                                                </div>
                                                                                                <div>
                                                                                                    <p className="text-xs text-muted-foreground">Nombre DNS Público</p>
                                                                                                    <p className="text-sm">
                                                                                                        {instance.NetworkInterfaces_Association_PublicDnsName[netAttachIdIndex]}
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </CardContent>
                                    </Card> */}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}