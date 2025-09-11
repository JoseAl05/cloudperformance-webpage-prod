'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Accordion } from '@radix-ui/react-accordion'
import { Database, Globe, HardDrive, MapPin, Network, Settings } from 'lucide-react'

interface SQLServerInstanceData {
    sync_time: { $date: string };
    TagList_Key: string[];
    TagList_Value: string[];
    region: string;
    DBInstanceIdentifier: string;
    InstanceCreateTime: { $date: string };
    DBInstanceStatus: string;
    DBInstanceClass: string;
    LicenseModel: string;
    DBSubnetGroup_Subnets_SubnetIdentifier: string[];
    Engine: string;
    EngineVersion: string;
    AllocatedStorage: number;
    StorageType: string;
    DBSubnetGroup_Subnets_SubnetAvailabilityZone_Name: string[];
    DBSubnetGroup_Subnets_SubnetStatus: string[];
    Total_Subnets_RDS_SQLServer: number;
    EnginePlusVersion: string;
    Allocated_Storage_RDS_SQLServer_Formatted: string;
}

interface SQLServerResourceViewHistoricInfoComponentProps {
    instances: SQLServerInstanceData[]
}

const getUptime = (createTime: Date) => {
    const now = new Date();
    const diff = now.getTime() - createTime.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days} días, ${hours} horas`;
};

export const RdsSQLServerResourceViewHistoricInfoComponent = ({ instances }: SQLServerResourceViewHistoricInfoComponentProps) => {
    const statusColors = {
        available: 'bg-green-500/10 text-green-500 border-green-500/20',
        stopped: 'bg-red-500/10 text-red-500 border-red-500/20',
        creating: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        modifying: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        'backing-up': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    }

    const sortedInstances = [...instances].sort((a, b) => 
        new Date(b.sync_time.$date).getTime() - new Date(a.sync_time.$date).getTime()
    );

    return (
        <ScrollArea className="max-h-[60vh]">
            {sortedInstances.map((instance, index) => {
                const uptimeInstance = getUptime(new Date(instance.InstanceCreateTime.$date));
                const syncTime = new Date(instance.sync_time.$date);

                return (
                    <Card key={index} className='my-5'>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Database className="h-5 w-5 text-blue-500" />
                                Instancia {instance.DBInstanceIdentifier}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between gap-5">
                                    <span></span>
                                    <Badge variant="default" className={statusColors[instance.DBInstanceStatus] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'}>
                                        {instance.DBInstanceStatus}
                                    </Badge>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Fecha Observación:</span>
                                    <span className="font-medium text-green-600">{syncTime.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Clase:</span>
                                    <span className="font-medium">{instance.DBInstanceClass}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Región:</span>
                                    <span className="font-medium flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {instance.region}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Engine:</span>
                                    <span className="font-medium">{instance.EnginePlusVersion}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>Licencia:</span>
                                    <span className='font-medium'>{instance.LicenseModel || 'N/A'}</span>
                                </div>                                
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Storage:</span>
                                    <span className="font-medium">{instance.Allocated_Storage_RDS_SQLServer_Formatted}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Tipo Storage:</span>
                                    <span className="font-medium">{instance.StorageType.toUpperCase()}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>Uptime:</span>
                                    <span className='font-medium text-green-600'>{uptimeInstance}</span>
                                </div>
                                
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-muted/30'>
                                    <div className='flex items-center gap-2'>
                                        <Network className='h-4 w-4 text-muted-foreground' />
                                        <p className='text-xs text-muted-foreground'>Subnets</p>
                                        <p className='text-lg font-semibold'>{instance.Total_Subnets_RDS_SQLServer}</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <HardDrive className='h-4 w-4 text-muted-foreground' />
                                        <p className='text-xs text-muted-foreground'>Storage</p>
                                        <p className='text-lg font-semibold'>{instance.AllocatedStorage} GB</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Globe className='h-4 w-4 text-muted-foreground' />
                                        <p className='text-xs text-muted-foreground'>Zonas AZ</p>
                                        <p className='text-lg font-semibold'>{instance.DBSubnetGroup_Subnets_SubnetAvailabilityZone_Name.length}</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Database className='h-4 w-4 text-muted-foreground' />
                                        <p className='text-xs text-muted-foreground'>Version</p>
                                        <p className='text-lg font-semibold'>{instance.EngineVersion}</p>
                                    </div>
                                </div>

                                {instance.TagList_Key && instance.TagList_Key.length > 0 && (
                                    <Accordion type='single' collapsible className='w-full'>
                                        <AccordionItem value={`tags-${instance.DBInstanceIdentifier}-${index}`} className='border-none'>
                                            <AccordionTrigger className='hover:no-underline py-2 px-0 cursor-pointer'>
                                                <span className='flex items-center gap-2 text-sm font-medium'>
                                                    <Settings className='h-4 w-4' />
                                                    INFORMACIÓN TAGS
                                                </span>
                                            </AccordionTrigger>
                                            <AccordionContent className='pt-4'>
                                                <div className='space-y-3 pl-6 border-l-2 border-border/30'>
                                                    {instance.TagList_Key.map((key, tagIndex) => (
                                                        <div
                                                            key={tagIndex}
                                                            className='grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 p-3 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50'
                                                        >
                                                            <div>
                                                                <p className='text-xs text-muted-foreground'>Clave</p>
                                                                <p className='text-xs font-semibold'>{key}</p>
                                                            </div>
                                                            <div>
                                                                <p className='text-xs text-muted-foreground'>Valor</p>
                                                                <p className='text-xs'>{instance.TagList_Value[tagIndex] || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                )}

                                <Accordion type='single' collapsible className='w-full'>
                                    <AccordionItem value={`subnets-${instance.DBInstanceIdentifier}-${index}`} className='border-none'>
                                        <AccordionTrigger className='hover:no-underline py-2 px-0 cursor-pointer'>
                                            <span className='flex items-center gap-2 text-sm font-medium'>
                                                <Network className='h-4 w-4' />
                                                INFORMACIÓN SUBNETS
                                            </span>
                                        </AccordionTrigger>
                                        <AccordionContent className='pt-4'>
                                            <div className='space-y-3 pl-6 border-l-2 border-border/30'>
                                                {instance.DBSubnetGroup_Subnets_SubnetIdentifier.map((subnetId, subnetIndex) => (
                                                    <div
                                                        key={subnetIndex}
                                                        className='grid grid-cols-1 md:grid-cols-2 gap-4 p-3 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50'
                                                    >
                                                        <div>
                                                            <p className='text-xs text-muted-foreground'>Subnet ID</p>
                                                            <p className='text-xs font-mono'>{subnetId}</p>
                                                        </div>
                                                        <div>
                                                            <p className='text-xs text-muted-foreground'>Zona Disponibilidad</p>
                                                            <p className='text-xs font-semibold'>
                                                                {instance.DBSubnetGroup_Subnets_SubnetAvailabilityZone_Name[subnetIndex]}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className='text-xs text-muted-foreground'>Estado</p>
                                                            <Badge variant="outline" className="text-xs">
                                                                {instance.DBSubnetGroup_Subnets_SubnetStatus[subnetIndex]}
                                                            </Badge>
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
            })}
        </ScrollArea>
    )
}