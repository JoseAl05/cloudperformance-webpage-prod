'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Globe, Activity, History, Network, Users, ShieldCheck } from 'lucide-react';
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
import { AutoscalingGroupsResourceViewHistoricInfoComponent } from '@/components/aws/vista-autoscaling/autoscaling-groups/info/AutoscalingGroupsResourceViewHistoricInfoComponent';

interface AutoscalingGroupData {
    sync_time: { $date: string };
    AutoScalingGroupName: string;
    CreatedTime: { $date: string };
    DesiredCapacity: number;
    MaxSize: number;
    MinSize: number;
    DefaultCooldown: number;
    HealthCheckType: string;
    HealthCheckGracePeriod: number;
    LaunchConfigurationName?: string;
    LaunchTemplate?: {
        LaunchTemplateName: string;
        Version: string;
    };
    VPCZoneIdentifier: string[];
    AvailabilityZones: string[];
    Instances: Array<{
        InstanceId: string;
        InstanceType: string;
        AvailabilityZone: string;
        LifecycleState: string;
        HealthStatus: string;
        LaunchConfigurationName?: string;
        LaunchTemplate?: {
            LaunchTemplateName: string;
            Version: string;
        };
    }>;
    Tags: Array<{
        Key: string;
        Value: string;
        PropagateAtLaunch: boolean;
    }>;
    EnabledMetrics: Array<{
        Metric: string;
        Granularity: string;
    }>;
    SuspendedProcesses: Array<{
        ProcessName: string;
        SuspensionReason: string;
    }>;
    ServiceLinkedRoleARN: string;
    TargetGroupARNs: string[];
    LoadBalancerNames: string[];
    region: string;
}

interface AutoscalingGroupsResourceViewInfoComponentProps {
    data: AutoscalingGroupData[] | null;
}

const getUptime = (createTime: Date) => {
    const now = new Date();
    const diff = now.getTime() - createTime.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days} días, ${hours} horas`;
};

const getHealthStatusColor = (healthCheckType: string) => {
    switch (healthCheckType.toLowerCase()) {
        case 'ec2':
            return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        case 'elb':
            return 'bg-green-500/10 text-green-500 border-green-500/20';
        default:
            return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
};

export const AutoscalingGroupsResourceViewInfoComponent = ({ data }: AutoscalingGroupsResourceViewInfoComponentProps) => {
    const quickActions = [
        { icon: History, label: 'Ver Historial', color: 'orange' },
    ];

    if (!data || data.length === 0) {
        return (
            <div className='w-full xl:w-[22rem]'>
                <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                        No hay datos de Autoscaling Group disponibles
                    </CardContent>
                </Card>
            </div>
        );
    }

    const groupedAutoscalingGroups = data.reduce(
        (acc, group) => {
            if (!acc[group.AutoScalingGroupName]) {
                acc[group.AutoScalingGroupName] = []
            }
            acc[group.AutoScalingGroupName].push(group)
            return acc
        },
        {} as Record<string, AutoscalingGroupData[]>,
    )

    return (
        <div className='w-full xl:w-[22rem]'>
            <div className='space-y-8'>
                {Object.entries(groupedAutoscalingGroups).map(([groupName, groups]) => {
                    const latestGroup = groups.sort((a, b) => 
                        new Date(b.sync_time.$date).getTime() - new Date(a.sync_time.$date).getTime()
                    )[0];

                    const latestSyncTime = new Date(latestGroup.sync_time.$date);
                    const createTime = new Date(latestGroup.CreatedTime.$date);
                    const today = new Date();
                    
                    const isToday =
                        latestSyncTime.getDate() === today.getDate() &&
                        latestSyncTime.getMonth() === today.getMonth() &&
                        latestSyncTime.getFullYear() === today.getFullYear();
                    
                    const groupCardTitle = isToday
                        ? 'Autoscaling Group Actual'
                        : `Autoscaling Group a fecha de: ${latestSyncTime.toLocaleDateString()}`;

                    const uptime = getUptime(createTime);
                    const observationCount = groups.length;

                    return (
                        <div key={groupName} className="relative group">
                            <div className='absolute left-12 -top-10 text-sm font-medium text-muted-foreground bg-background px-2 py-1 rounded-md border border-border/30 shadow-sm z-0 transition-all duration-200 group-hover:border-orange-500/30 group-hover:text-orange-600'>
                                {observationCount} observaciones
                            </div>
                            <Card>
                                <CardHeader className='pb-3'>
                                    <CardTitle className='text-lg flex items-center gap-2'>
                                        <Settings className='h-5 w-5 text-orange-500' />
                                        {groupCardTitle}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <div>
                                        <div className='flex items-center justify-between gap-5'>
                                            <span className='font-semibold text-sm'>{groupName}</span>
                                            <Badge variant='default' className={getHealthStatusColor(latestGroup.region)}>
                                                {latestGroup.region}
                                            </Badge>
                                        </div>
                                    </div>
                                    
                                    <div className='space-y-2 text-sm'>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-500'>Capacidad Total:</span>
                                            <span className='font-medium'>{latestGroup.Capacidad_Total_ASG}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-500'>Rango Tamaño:</span>
                                            <span className='font-medium'>{latestGroup.Size_Range_Formatted}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-500'>Launch Template:</span>
                                            <span className='font-medium'>{latestGroup.Launch_Template_Info_Formatted || 'N/A'}</span>
                                        </div>                                        
                                        <div className='flex justify-between'>
                                            <span className='text-gray-500'>Min Size:</span>
                                            <span className='font-medium'>{latestGroup.MinSize}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-500'>Max Size:</span>
                                            <span className='font-medium'>{latestGroup.MaxSize}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-500'>Región:</span>
                                            <span className='font-medium flex items-center gap-1'>
                                                <Globe className='h-3 w-3' />
                                                {latestGroup.region}
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-500'>Uptime:</span>
                                            <span className='font-medium text-green-600'>{uptime}</span>
                                        </div>
                                        
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-muted/30'>
                                            <div className='flex items-center gap-2'>
                                                <Users className='h-4 w-4 text-muted-foreground' />
                                                <p className='text-xs text-muted-foreground'>Min Instancias</p>
                                                <p className='text-lg font-semibold'>{latestGroup.MinSize}</p>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Activity className='h-4 w-4 text-muted-foreground' />
                                                <p className='text-xs text-muted-foreground'>Max Instancias</p>
                                                <p className='text-lg font-semibold'>{latestGroup.MaxSize}</p>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Globe className='h-4 w-4 text-muted-foreground' />
                                                <p className='text-xs text-muted-foreground'>Capacidad</p>
                                                <p className='text-lg font-semibold'>{latestGroup.Capacidad_Total_ASG}</p>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Network className='h-4 w-4 text-muted-foreground' />
                                                <p className='text-xs text-muted-foreground'>Tags</p>
                                                <p className='text-lg font-semibold'>{latestGroup.Total_Tags_ASG}</p>
                                            </div>
                                        </div>

                                        {latestGroup.Tags_Key && latestGroup.Tags_Key.length > 0 && (
                                            <Accordion type='single' collapsible className='w-full'>
                                                <AccordionItem value={`tags-${groupName}`} className='border-none'>
                                                    <AccordionTrigger className='hover:no-underline py-2 px-0 cursor-pointer'>
                                                        <span className='flex items-center gap-2 text-sm font-medium'>
                                                            <Settings className='h-4 w-4' />
                                                            INFORMACIÓN TAGS
                                                        </span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className='pt-4'>
                                                        <div className='space-y-3 pl-6 border-l-2 border-border/30'>
                                                            {latestGroup.Tags_Key?.map((key, tagIndex) => (
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
                                                                        <p className='text-xs'>{latestGroup.Tags_Value[tagIndex] || 'N/A'}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        )}

                                        <Accordion type='single' collapsible className='w-full'>
                                            <AccordionItem value={`launch-template-${groupName}`} className='border-none'>
                                                <AccordionTrigger className='hover:no-underline py-2 px-0 cursor-pointer'>
                                                    <span className='flex items-center gap-2 text-sm font-medium'>
                                                        <Settings className='h-4 w-4' />
                                                        INFORMACIÓN LAUNCH TEMPLATE
                                                    </span>
                                                </AccordionTrigger>
                                                <AccordionContent className='pt-4'>
                                                    <div className='space-y-3 pl-6 border-l-2 border-border/30'>
                                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-3 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50'>
                                                            <div>
                                                                <p className='text-xs text-muted-foreground'>Template ID</p>
                                                                <p className='text-xs font-mono'>{latestGroup.LaunchTemplate_LaunchTemplateId || 'N/A'}</p>
                                                            </div>
                                                            <div>
                                                                <p className='text-xs text-muted-foreground'>Template Name</p>
                                                                <p className='text-xs font-semibold'>{latestGroup.LaunchTemplate_LaunchTemplateName || 'N/A'}</p>
                                                            </div>
                                                            <div>
                                                                <p className='text-xs text-muted-foreground'>Version</p>
                                                                <p className='text-xs'>{latestGroup.LaunchTemplate_Version || 'N/A'}</p>
                                                            </div>
                                                            <div>
                                                                <p className='text-xs text-muted-foreground'>Info Formatted</p>
                                                                <p className='text-xs'>{latestGroup.Launch_Template_Info_Formatted || 'N/A'}</p>
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
                                                <Dialog key={index}>
                                                    <DialogTrigger className='flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-110'>
                                                        <action.icon className={`h-4 w-4 text-${action.color}-500`} />
                                                        {action.label}
                                                    </DialogTrigger>
                                                    <DialogContent className='max-w-2xl max-h-[80vh] sm:max-w-4xl'>
                                                        <DialogHeader>
                                                            <DialogTitle>Historial Autoscaling Group {groupName}</DialogTitle>
                                                            <DialogDescription>Información histórica del Autoscaling Group</DialogDescription>
                                                        </DialogHeader>
                                                        <AutoscalingGroupsResourceViewHistoricInfoComponent groups={groups} />
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