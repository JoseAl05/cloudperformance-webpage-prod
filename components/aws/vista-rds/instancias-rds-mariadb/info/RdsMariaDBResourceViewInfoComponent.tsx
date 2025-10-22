'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Globe, HardDrive, History, MapPin, Network, Settings } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { RdsMariaDBResourceViewHistoricInfoComponent } from '@/components/aws/vista-rds/instancias-rds-mariadb/info/RdsMariaDBResourceViewHistoricInfoComponent';

interface MariaDBInstanceData {
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
    Total_Subnets_RDS_MariaDB: number;
    EnginePlusVersion: string;
    Allocated_Storage_RDS_MariaDB_Formatted: string;
}

interface RdsMariaDBResourceViewInfoComponentProps {
    data: MariaDBInstanceData[] | null;
}

const getUptime = (createTime: Date) => {
    const now = new Date();
    const diff = now.getTime() - createTime.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days} días, ${hours} horas`;
};

export const RdsMariaDBResourceViewInfoComponent = ({ data }: RdsMariaDBResourceViewInfoComponentProps) => {
    const statusColors = {
        available: 'bg-green-500/10 text-green-500 border-green-500/20',
        stopped: 'bg-red-500/10 text-red-500 border-red-500/20',
        creating: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        modifying: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        'backing-up': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    }

    const quickActions = [
        { icon: History, label: 'Ver Historial', color: 'amber' },
    ];

    if (!data || data.length === 0) {
        return (
            <div className='w-full xl:w-[22rem]'>
                <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                        No hay datos de instancia disponibles
                    </CardContent>
                </Card>
            </div>
        );
    }

    const groupedInstances = data.reduce(
        (acc, instance) => {
            if (!acc[instance.DBInstanceIdentifier]) {
                acc[instance.DBInstanceIdentifier] = []
            }
            acc[instance.DBInstanceIdentifier].push(instance)
            return acc
        },
        {} as Record<string, MariaDBInstanceData[]>,
    )

    return (
        <div className='w-full xl:w-[22rem]'>
            <div className='space-y-8'>
                {Object.entries(groupedInstances).map(([instanceId, instances]) => {
                    const latestInstance = instances.sort((a, b) => 
                        new Date(b.sync_time.$date).getTime() - new Date(a.sync_time.$date).getTime()
                    )[0];

                    const latestSyncTime = new Date(latestInstance.sync_time.$date);
                    const createTime = new Date(latestInstance.InstanceCreateTime.$date);
                    const today = new Date();
                    
                    const isToday =
                        latestSyncTime.getDate() === today.getDate() &&
                        latestSyncTime.getMonth() === today.getMonth() &&
                        latestSyncTime.getFullYear() === today.getFullYear();
                    
                    const instanceCardTitle = isToday
                        ? 'Instancia Actual'
                        : `Instancia a fecha de: ${latestSyncTime.toLocaleDateString()}`;

                    const uptimeInstance = getUptime(createTime);
                    const observationCount = instances.length;

                    return (
                        <div key={instanceId}>
                            <div className='absolute left-12 -top-10 text-sm font-medium text-muted-foreground bg-background px-2 py-1 rounded-md border border-border/30 shadow-sm z-0 transition-all duration-200 group-hover:border-amber-500/30 group-hover:text-amber-600'>
                                {observationCount} observaciones
                            </div>
                            <Card>
                                <CardHeader className='pb-3'>
                                    <CardTitle className='text-lg flex items-center gap-2'>
                                        <Database className='h-5 w-5 text-amber-500' />
                                        {instanceCardTitle}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <div>
                                        <div className='flex items-center justify-between gap-5'>
                                            <span className='font-semibold text-sm'>{instanceId}</span>
                                            <Badge variant='default' className={statusColors[latestInstance.DBInstanceStatus] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'}>
                                                {latestInstance.DBInstanceStatus}
                                            </Badge>
                                        </div>
                                    </div>
                                    
                                    <div className='space-y-2 text-sm'>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-500'>Clase:</span>
                                            <span className='font-medium'>{latestInstance.DBInstanceClass}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-500'>Engine:</span>
                                            <span className='font-medium'>{latestInstance.EnginePlusVersion}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-500'>Licencia:</span>
                                            <span className='font-medium'>{latestInstance.LicenseModel || 'N/A'}</span>
                                        </div>                                        
                                        <div className='flex justify-between'>
                                            <span className='text-gray-500'>Storage:</span>
                                            <span className='font-medium'>{latestInstance.Allocated_Storage_RDS_MariaDB_Formatted}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-500'>Tipo Storage:</span>
                                            <span className='font-medium'>{latestInstance.StorageType.toUpperCase()}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-500'>Región:</span>
                                            <span className='font-medium flex items-center gap-1'>
                                                <MapPin className='h-3 w-3' />
                                                {latestInstance.region}
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-500'>Uptime:</span>
                                            <span className='font-medium text-green-600'>{uptimeInstance}</span>
                                        </div>
                                        
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-muted/30'>
                                            <div className='flex items-center gap-2'>
                                                <Network className='h-4 w-4 text-muted-foreground' />
                                                <p className='text-xs text-muted-foreground'>Subnets</p>
                                                <p className='text-lg font-semibold'>{latestInstance.Total_Subnets_RDS_MariaDB}</p>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <HardDrive className='h-4 w-4 text-muted-foreground' />
                                                <p className='text-xs text-muted-foreground'>Storage</p>
                                                <p className='text-lg font-semibold'>{latestInstance.AllocatedStorage}GB</p>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Globe className='h-4 w-4 text-muted-foreground' />
                                                <p className='text-xs text-muted-foreground'>Zonas AZ</p>
                                                <p className='text-lg font-semibold'>{latestInstance.DBSubnetGroup_Subnets_SubnetAvailabilityZone_Name.length}</p>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Database className='h-4 w-4 text-muted-foreground' />
                                                <p className='text-xs text-muted-foreground'>Engine</p>
                                                <p className='text-lg font-semibold'>{latestInstance.Engine}</p>
                                            </div>
                                        </div>

                                        {latestInstance.TagList_Key && latestInstance.TagList_Key.length > 0 && (
                                            <Accordion type='single' collapsible className='w-full'>
                                                <AccordionItem value={`tags-${instanceId}`} className='border-none'>
                                                    <AccordionTrigger className='hover:no-underline py-2 px-0 cursor-pointer'>
                                                        <span className='flex items-center gap-2 text-sm font-medium'>
                                                            <Settings className='h-4 w-4' />
                                                            INFORMACIÓN TAGS
                                                        </span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className='pt-4'>
                                                        <div className='space-y-3 pl-6 border-l-2 border-border/30'>
                                                            {latestInstance.TagList_Key.map((key, tagIndex) => (
                                                                <div
                                                                    key={tagIndex}
                                                                    className='grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2 p-3 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50'
                                                                >
                                                                    <div>
                                                                        <p className='text-xs text-muted-foreground'>Clave</p>
                                                                        <p className='text-xs font-semibold'>{key}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className='text-xs text-muted-foreground'>Valor</p>
                                                                        <p className='text-xs'>{latestInstance.TagList_Value[tagIndex] || 'N/A'}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        )}

                                        <Accordion type='single' collapsible className='w-full'>
                                            <AccordionItem value={`subnets-${instanceId}`} className='border-none'>
                                                <AccordionTrigger className='hover:no-underline py-2 px-0 cursor-pointer'>
                                                    <span className='flex items-center gap-2 text-sm font-medium'>
                                                        <Network className='h-4 w-4' />
                                                        INFORMACIÓN SUBNETS
                                                    </span>
                                                </AccordionTrigger>
                                                <AccordionContent className='pt-4'>
                                                    <div className='space-y-3 pl-6 border-l-2 border-border/30'>
                                                        {latestInstance.DBSubnetGroup_Subnets_SubnetIdentifier.map((subnetId, subnetIndex) => (
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
                                                                        {latestInstance.DBSubnetGroup_Subnets_SubnetAvailabilityZone_Name[subnetIndex]}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className='text-xs text-muted-foreground'>Estado</p>
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {latestInstance.DBSubnetGroup_Subnets_SubnetStatus[subnetIndex]}
                                                                    </Badge>
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
                                                <Dialog key={index}>
                                                    <DialogTrigger className='flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-110'>
                                                        <action.icon className={`h-4 w-4 text-${action.color}-500`} />
                                                        {action.label}
                                                    </DialogTrigger>
                                                    <DialogContent className='max-w-2xl max-h-[80vh] sm:max-w-4xl'>
                                                        <DialogHeader>
                                                            <DialogTitle>Historial Instancia {instanceId}</DialogTitle>
                                                            <DialogDescription>Información histórica de la instancia MariaDB</DialogDescription>
                                                        </DialogHeader>
                                                        <RdsMariaDBResourceViewHistoricInfoComponent instances={instances} />
                                                    </DialogContent>
                                                </Dialog>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}