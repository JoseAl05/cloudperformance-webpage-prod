'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Accordion } from '@radix-ui/react-accordion'
import { Settings, Globe, Activity, Network, Users, ShieldCheck } from 'lucide-react'

interface AutoscalingGroupData {
    sync_time: { $date: string };
    region: string;
    AutoScalingGroupName: string;
    CreatedTime: { $date: string };
    LaunchTemplate_LaunchTemplateId: string | null;
    LaunchTemplate_LaunchTemplateName: string | null;
    LaunchTemplate_Version: string | null;
    MinSize: number;
    MaxSize: number;
    Tags_Key: string[];
    Tags_Value: string[];
    Capacidad_Total_ASG: number;
    Launch_Template_Info_Formatted: string | null;
    Size_Range_Formatted: string;
    Total_Tags_ASG: number;
}

interface AutoscalingGroupsResourceViewHistoricInfoComponentProps {
    groups: AutoscalingGroupData[]
}

const getUptime = (createTime: Date) => {
    const now = new Date();
    const diff = now.getTime() - createTime.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days} días, ${hours} horas`;
};

const getHealthStatusColor = (region: string) => {
    switch (region) {
        case 'us-east-1':
            return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        case 'us-west-2':
            return 'bg-green-500/10 text-green-500 border-green-500/20';
        default:
            return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
};

export const AutoscalingGroupsResourceViewHistoricInfoComponent = ({ groups }: AutoscalingGroupsResourceViewHistoricInfoComponentProps) => {
    const sortedGroups = [...groups].sort((a, b) => 
        new Date(b.sync_time.$date).getTime() - new Date(a.sync_time.$date).getTime()
    );

    return (
        <ScrollArea className="max-h-[60vh]">
            {sortedGroups.map((group, index) => {
                const uptime = getUptime(new Date(group.CreatedTime.$date));
                const syncTime = new Date(group.sync_time.$date);

                return (
                    <Card key={index} className='my-5'>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Settings className="h-5 w-5 text-orange-500" />
                                Autoscaling Group {group.AutoScalingGroupName}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between gap-5">
                                    <span></span>
                                    <Badge variant="default" className={getHealthStatusColor(group.region)}>
                                        {group.region}
                                    </Badge>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Fecha Observación:</span>
                                    <span className="font-medium text-green-600">{syncTime.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Capacidad Total:</span>
                                    <span className="font-medium">{group.Capacidad_Total_ASG}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Rango Tamaño:</span>
                                    <span className="font-medium">{group.Size_Range_Formatted}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Región:</span>
                                    <span className="font-medium flex items-center gap-1">
                                        <Globe className="h-3 w-3" />
                                        {group.region}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Launch Template:</span>
                                    <span className="font-medium">{group.Launch_Template_Info_Formatted || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Uptime:</span>
                                    <span className="font-medium text-green-600">{uptime}</span>
                                </div>
                                
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-muted/30'>
                                    <div className='flex items-center gap-2'>
                                        <Users className='h-4 w-4 text-muted-foreground' />
                                        <p className='text-xs text-muted-foreground'>Min Instancias</p>
                                        <p className='text-lg font-semibold'>{group.MinSize}</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Activity className='h-4 w-4 text-muted-foreground' />
                                        <p className='text-xs text-muted-foreground'>Max Instancias</p>
                                        <p className='text-lg font-semibold'>{group.MaxSize}</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Globe className='h-4 w-4 text-muted-foreground' />
                                        <p className='text-xs text-muted-foreground'>Capacidad</p>
                                        <p className='text-lg font-semibold'>{group.Capacidad_Total_ASG}</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <ShieldCheck className='h-4 w-4 text-muted-foreground' />
                                        <p className='text-xs text-muted-foreground'>Tags</p>
                                        <p className='text-lg font-semibold'>{group.Total_Tags_ASG}</p>
                                    </div>
                                </div>

                                {group.Tags_Key && group.Tags_Key.length > 0 && (
                                    <Accordion type='single' collapsible className='w-full'>
                                        <AccordionItem value={`tags-${group.AutoScalingGroupName}-${index}`} className='border-none'>
                                            <AccordionTrigger className='hover:no-underline py-2 px-0 cursor-pointer'>
                                                <span className='flex items-center gap-2 text-sm font-medium'>
                                                    <Settings className='h-4 w-4' />
                                                    INFORMACIÓN TAGS
                                                </span>
                                            </AccordionTrigger>
                                            <AccordionContent className='pt-4'>
                                                <div className='space-y-3 pl-6 border-l-2 border-border/30'>
                                                    {group.Tags_Key?.map((key, tagIndex) => (
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
                                                                <p className='text-xs'>{group.Tags_Value[tagIndex] || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                )}

                                <Accordion type='single' collapsible className='w-full'>
                                    <AccordionItem value={`launch-template-${group.AutoScalingGroupName}-${index}`} className='border-none'>
                                        <AccordionTrigger className='hover:no-underline py-2 px-0 cursor-pointer'>
                                            <span className='flex items-center gap-2 text-sm font-medium'>
                                                <Network className='h-4 w-4' />
                                                INFORMACIÓN LAUNCH TEMPLATE
                                            </span>
                                        </AccordionTrigger>
                                        <AccordionContent className='pt-4'>
                                            <div className='space-y-3 pl-6 border-l-2 border-border/30'>
                                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-3 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50'>
                                                    <div>
                                                        <p className='text-xs text-muted-foreground'>Template ID</p>
                                                        <p className='text-xs font-mono'>{group.LaunchTemplate_LaunchTemplateId || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className='text-xs text-muted-foreground'>Template Name</p>
                                                        <p className='text-xs font-semibold'>{group.LaunchTemplate_LaunchTemplateName || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className='text-xs text-muted-foreground'>Version</p>
                                                        <p className='text-xs'>{group.LaunchTemplate_Version || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className='text-xs text-muted-foreground'>Info Formatted</p>
                                                        <p className='text-xs'>{group.Launch_Template_Info_Formatted || 'N/A'}</p>
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
            })}
        </ScrollArea>
    )
}