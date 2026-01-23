'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Boxes, History, Layers, LayoutTemplate, MapPin, RefreshCw, Settings, ShieldCheck, AlertCircle } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion'
import { InstanceGroupsHistoricInfoComponent } from './InstanceGroupsHistoricInfoComponent';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { InstanceGroupInfo, HistoryData } from '@/interfaces/iGInterfaces';

interface InstanceGroupsInfoComponentProps {
    data: InstanceGroupInfo[] | null
}

export const InstanceGroupsInfoComponent = ({ data }: InstanceGroupsInfoComponentProps) => {
    const getStatusColor = (isStable: boolean) => {
        return isStable
            ? 'bg-green-500/10 text-green-500 border-green-500/20'
            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    };

    const quickActions = [
        { icon: History, label: 'Ver Historial', color: 'blue' },
    ];

    const getTotalActions = (actions: HistoryData['currentActions']) => {
        if (!actions) return 0;
        const keys = Object.keys(actions) as Array<keyof typeof actions>;
        return keys.reduce((acc, key) => {
            if (key !== 'none') {
                return acc + (actions[key] || 0);
            }
            return acc;
        }, 0);
    };

    return (
        <div className='w-full xl:w-[25rem]'>
            <div className='space-y-8'>
                {data && data.map((group) => {
                    const history = group.history_data;
                    const groupId = group.nistance_group_id;
                    const groupName = group.instance_group_name;
                    const latestSnapshot = history[0];

                    const isStable = latestSnapshot.status.isStable;
                    const statusLabel = isStable ? 'STABLE' : 'UPDATING';

                    const templateName = latestSnapshot.instanceTemplate
                        ? latestSnapshot.instanceTemplate.split('/').pop()
                        : 'N/A';

                    const regionName = latestSnapshot.region
                        ? latestSnapshot.region.split('/').pop()
                        : latestSnapshot.location?.split('/').pop() || 'Global';

                    const updatePolicyType = latestSnapshot.updatePolicy?.type || 'N/A';

                    const targetSize = latestSnapshot.targetSize;
                    const totalZones = latestSnapshot.distributionPolicy?.zones?.length || 0;
                    const activeActions = getTotalActions(latestSnapshot.currentActions);
                    const totalVersions = latestSnapshot.versions?.length || 0;

                    const today = new Date();
                    const latestSyncTime = new Date(latestSnapshot.sync_time);
                    const isToday =
                        latestSyncTime.getDate() === today.getDate() &&
                        latestSyncTime.getMonth() === today.getMonth() &&
                        latestSyncTime.getFullYear() === today.getFullYear();

                    const cardTitle = isToday
                        ? 'Instance Group Actual'
                        : `Instance Group a fecha de: ${latestSyncTime.toLocaleDateString()}`;

                    const observationCount = history.length;

                    return (
                        <div key={groupId}>
                            <div className='absolute left-12 -top-10 text-sm font-medium text-muted-foreground bg-background px-2 py-1 rounded-md border border-border/30 shadow-sm z-0 transition-all duration-200 group-hover:border-blue-500/30 group-hover:text-blue-600'>
                                {observationCount} observaciones
                            </div>
                            <div className=''>
                                <Card>
                                    <CardHeader className='pb-3'>
                                        <CardTitle className='text-lg flex items-center gap-2'>
                                            <Boxes className='h-5 w-5 text-blue-500' />
                                            {cardTitle}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='space-y-4'>
                                        <div>
                                            <div className='flex items-center justify-between gap-5'>
                                                <span className='font-semibold text-sm truncate max-w-[150px]' title={groupName}>{groupName}</span>
                                                <Badge variant='default' className={getStatusColor(isStable)}>
                                                    {statusLabel}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className='space-y-2 text-sm'>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500'>ID:</span>
                                                <span className='font-medium truncate max-w-[200px]' title={latestSnapshot.id}>{latestSnapshot.id}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500'>Template:</span>
                                                <span className='font-medium truncate max-w-[200px]' title={templateName}>{templateName}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500'>Política Act.:</span>
                                                <span className='font-medium'>{updatePolicyType}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500'>Región:</span>
                                                <span className='font-medium flex items-center gap-1'>
                                                    <MapPin className='h-3 w-3' />
                                                    {regionName}
                                                </span>
                                            </div>

                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-muted/30'>
                                                <div className='flex items-center gap-2'>
                                                    <Layers className='h-4 w-4 text-muted-foreground' />
                                                    <p className='text-xs text-muted-foreground'>Target Size</p>
                                                    <p className='text-lg font-semibold'>{targetSize}</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <MapPin className='h-4 w-4 text-muted-foreground' />
                                                    <p className='text-xs text-muted-foreground'>Zonas</p>
                                                    <p className='text-lg font-semibold'>{totalZones}</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <Activity className='h-4 w-4 text-muted-foreground' />
                                                    <p className='text-xs text-muted-foreground'>Acciones</p>
                                                    <p className='text-lg font-semibold'>
                                                        {activeActions}
                                                    </p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <LayoutTemplate className='h-4 w-4 text-muted-foreground' />
                                                    <p className='text-xs text-muted-foreground'>Versiones</p>
                                                    <p className='text-lg font-semibold'>
                                                        {totalVersions}
                                                    </p>
                                                </div>
                                            </div>

                                            <Accordion type='single' collapsible className='w-full'>
                                                <AccordionItem
                                                    value={`zones-${groupId}`}
                                                    className='border-none'
                                                >
                                                    <AccordionTrigger className='hover:no-underline py-2 px-0 cursor-pointer'>
                                                        <span className='flex items-center gap-2 text-sm font-medium'>
                                                            <MapPin className='h-4 w-4' />
                                                            ZONAS DE DISTRIBUCIÓN
                                                        </span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className='pt-4'>
                                                        <div className='space-y-3 pl-6 border-l-2 border-border/30'>
                                                            {latestSnapshot.distributionPolicy?.zones?.map((zoneObj, idx) => (
                                                                <div key={idx} className='flex items-center gap-2'>
                                                                    <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                                                                    <p className='text-xs font-mono'>{zoneObj.zone.split('/').pop()}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>

                                            <Accordion type='single' collapsible className='w-full'>
                                                <AccordionItem
                                                    value={`actions-${groupId}`}
                                                    className='border-none'
                                                >
                                                    <AccordionTrigger className='hover:no-underline py-2 px-0 cursor-pointer'>
                                                        <span className='flex items-center gap-2 text-sm font-medium'>
                                                            <RefreshCw className='h-4 w-4' />
                                                            ACCIONES EN CURSO
                                                        </span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className='pt-4'>
                                                        <div className='grid grid-cols-2 gap-2 pl-6 border-l-2 border-border/30'>
                                                            {latestSnapshot.currentActions && Object.entries(latestSnapshot.currentActions).map(([action, count]) => {
                                                                if (count > 0 && action !== 'none') {
                                                                    return (
                                                                        <div key={action} className='bg-muted/30 p-2 rounded-md'>
                                                                            <p className='text-xs text-muted-foreground capitalize'>{action}</p>
                                                                            <p className='text-sm font-semibold'>{count}</p>
                                                                        </div>
                                                                    )
                                                                }
                                                                return null;
                                                            })}
                                                            {activeActions === 0 && (
                                                                <div className='col-span-2 text-xs text-muted-foreground flex items-center gap-2'>
                                                                    <ShieldCheck className='h-3 w-3' /> Sin acciones pendientes
                                                                </div>
                                                            )}
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
                                                                <DialogTitle>Historial Grupo {groupName}</DialogTitle>
                                                                <DialogDescription>Información historica</DialogDescription>
                                                            </DialogHeader>
                                                            <InstanceGroupsHistoricInfoComponent
                                                                snapshots={history}
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