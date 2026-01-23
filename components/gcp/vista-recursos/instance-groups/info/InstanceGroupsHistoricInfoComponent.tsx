'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Accordion } from '@radix-ui/react-accordion'
import { Activity, Boxes, Layers, LayoutTemplate, MapPin, RefreshCw, ShieldCheck } from 'lucide-react'
import { HistoryData } from '@/interfaces/iGInterfaces'

interface InstanceGroupsHistoricInfoComponentProps {
    snapshots: HistoryData[]
}

export const InstanceGroupsHistoricInfoComponent = ({ snapshots }: InstanceGroupsHistoricInfoComponentProps) => {
    const getStatusColor = (isStable: boolean) => {
        return isStable
            ? 'bg-green-500/10 text-green-500 border-green-500/20'
            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    };

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
        <ScrollArea className="max-h-[60vh]">
            {
                snapshots && (
                    snapshots.map((snapshot, index) => {
                        const isStable = snapshot.status.isStable;
                        const statusLabel = isStable ? 'STABLE' : 'UPDATING';

                        const templateName = snapshot.instanceTemplate
                            ? snapshot.instanceTemplate.split('/').pop()
                            : 'N/A';

                        const regionName = snapshot.region
                            ? snapshot.region.split('/').pop()
                            : snapshot.location?.split('/').pop() || 'Global';

                        const updatePolicyType = snapshot.updatePolicy?.type || 'N/A';

                        const targetSize = snapshot.targetSize;
                        const totalZones = snapshot.distributionPolicy?.zones?.length || 0;
                        const activeActions = getTotalActions(snapshot.currentActions);
                        const totalVersions = snapshot.versions?.length || 0;

                        return (
                            <Card key={index} className='my-5'>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Boxes className="h-5 w-5 text-blue-500" />
                                        Instance Group {snapshot.id.slice(0, 8)}...
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between gap-5">
                                            <span className="font-semibold text-sm text-gray-500">{new Date(snapshot.sync_time).toLocaleString()}</span>
                                            <Badge variant="default" className={getStatusColor(isStable)}>
                                                {statusLabel}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Template:</span>
                                            <span className="font-medium truncate max-w-[200px]" title={templateName}>{templateName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Región:</span>
                                            <span className="font-medium flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {regionName}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Política Act.:</span>
                                            <span className="font-medium">{updatePolicyType}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Base Name:</span>
                                            <span className="font-medium">{snapshot.baseInstanceName}</span>
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
                                                value={`zones-${snapshot.id}-${index}`}
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
                                                        {snapshot.distributionPolicy?.zones?.map((zoneObj, idx) => (
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
                                                value={`actions-${snapshot.id}-${index}`}
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
                                                        {snapshot.currentActions && Object.entries(snapshot.currentActions).map(([action, count]) => {
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
                                </CardContent>
                            </Card>
                        )
                    })
                )
            }
        </ScrollArea>
    )
}