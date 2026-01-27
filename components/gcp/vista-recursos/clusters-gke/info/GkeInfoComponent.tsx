'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Server, History, Layers, Network, MapPin, Globe, ShieldCheck, AlertCircle, Cpu } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ClusterGkeResponse } from '@/interfaces/vista-gke/gkeInterfaces';
import { GkeHistoricInfoComponent } from '@/components/gcp/vista-recursos/clusters-gke/info/GkeHistoricInfoComponent';

interface GkeInfoComponentProps {
    data: ClusterGkeResponse[] | null
}

export const GkeInfoComponent = ({ data }: GkeInfoComponentProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'RUNNING':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'PROVISIONING':
            case 'RECONCILING':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'STOPPING':
            case 'DEGRADED':
                return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'ERROR':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            default:
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const quickActions = [
        { icon: History, label: 'Ver Historial', color: 'blue' },
    ];

    return (
        <div className='w-full xl:w-[25rem]'>
            <div className='space-y-8'>
                {data && data.map((group, index) => {
                    const latestSnapshot = group.history_data && group.history_data.length > 0
                        ? group.history_data[0]
                        : null;

                    if (!latestSnapshot) return null;

                    const clusterName = group.cluster_gke_name;
                    const clusterId = latestSnapshot.id;
                    const status = latestSnapshot.status;

                    const regionName = latestSnapshot.location || latestSnapshot.zone || 'Global';
                    const masterVersion = latestSnapshot.currentMasterVersion;
                    const endpoint = latestSnapshot.endpoint;
                    const totalNodes = latestSnapshot.currentNodeCount;
                    const nodePoolsCount = latestSnapshot.nodePools?.length || 0;

                    const networkName = latestSnapshot.networkConfig?.network?.split('/').pop() || 'default';
                    const subnetworkName = latestSnapshot.networkConfig?.subnetwork?.split('/').pop() || 'default';

                    const today = new Date();
                    const latestSyncTime = new Date(latestSnapshot.sync_time);
                    const isToday =
                        latestSyncTime.getDate() === today.getDate() &&
                        latestSyncTime.getMonth() === today.getMonth() &&
                        latestSyncTime.getFullYear() === today.getFullYear();

                    const cardTitle = isToday
                        ? 'Cluster Actual'
                        : `Cluster a fecha de: ${latestSyncTime.toLocaleDateString()}`;

                    const historyData = group.history_data;

                    return (
                        <div key={`${clusterId}-${index}`}>
                            <div className='absolute left-12 -top-10 text-sm font-medium text-muted-foreground bg-background px-2 py-1 rounded-md border border-border/30 shadow-sm z-0 transition-all duration-200 group-hover:border-blue-500/30 group-hover:text-blue-600'>
                                {historyData.length} observaciones
                            </div>
                            <div className=''>
                                <Card>
                                    <CardHeader className='pb-3'>
                                        <CardTitle className='text-lg flex items-center gap-2'>
                                            <Server className='h-5 w-5 text-blue-500' />
                                            {cardTitle}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='space-y-4'>
                                        <div>
                                            <div className='flex items-center justify-between gap-5'>
                                                <span className='font-semibold text-sm max-w-[150px]' title={clusterName}>{clusterName}</span>
                                                <Badge variant='default' className={getStatusColor(status)}>
                                                    {status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className='space-y-2 text-sm'>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500'>ID:</span>
                                                <span className='font-medium truncate max-w-[200px]' title={clusterId}>{clusterId}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500'>Versión Master:</span>
                                                <span className='font-medium truncate max-w-[200px]'>{masterVersion}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500'>Tier:</span>
                                                <span className='font-medium'>{latestSnapshot.enterpriseConfig?.clusterTier || 'STANDARD'}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500'>Ubicación:</span>
                                                <span className='font-medium flex items-center gap-1'>
                                                    <Globe className='h-3 w-3' />
                                                    {regionName}
                                                </span>
                                            </div>

                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-muted/30'>
                                                <div className='flex items-center gap-2'>
                                                    <Cpu className='h-4 w-4 text-muted-foreground' />
                                                    <p className='text-xs text-muted-foreground'>Nodos</p>
                                                    <p className='text-lg font-semibold'>{totalNodes}</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <Layers className='h-4 w-4 text-muted-foreground' />
                                                    <p className='text-xs text-muted-foreground'>Pools</p>
                                                    <p className='text-lg font-semibold'>{nodePoolsCount}</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <Network className='h-4 w-4 text-muted-foreground' />
                                                    <p className='text-xs text-muted-foreground'>IP Pub.</p>
                                                    <p className='text-xs font-semibold truncate max-w-[80px]' title={endpoint}>
                                                        {endpoint}
                                                    </p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <ShieldCheck className='h-4 w-4 text-muted-foreground' />
                                                    <p className='text-xs text-muted-foreground'>Shielded</p>
                                                    <p className='text-lg font-semibold'>
                                                        {latestSnapshot.shieldedNodes?.enabled ? 'Si' : 'No'}
                                                    </p>
                                                </div>
                                            </div>

                                            <Accordion type='single' collapsible className='w-full'>
                                                <AccordionItem
                                                    value={`pools-${clusterId}`}
                                                    className='border-none'
                                                >
                                                    <AccordionTrigger className='hover:no-underline py-2 px-0 cursor-pointer'>
                                                        <span className='flex items-center gap-2 text-sm font-medium'>
                                                            <Layers className='h-4 w-4' />
                                                            NODE POOLS
                                                        </span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className='pt-4'>
                                                        <div className='space-y-3 pl-6 border-l-2 border-border/30'>
                                                            {latestSnapshot.nodePools?.map((pool, idx) => (
                                                                <div key={idx} className='flex flex-col gap-1'>
                                                                    <div className='flex items-center gap-2'>
                                                                        <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                                                                        <p className='text-xs font-semibold'>{pool.name}</p>
                                                                    </div>
                                                                    <div className='pl-4 text-xs text-muted-foreground flex justify-between'>
                                                                        <span>{pool.config?.machineType || 'N/A'}</span>
                                                                        <span>{pool.initialNodeCount} nodos</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>

                                            <Accordion type='single' collapsible className='w-full'>
                                                <AccordionItem
                                                    value={`network-${clusterId}`}
                                                    className='border-none'
                                                >
                                                    <AccordionTrigger className='hover:no-underline py-2 px-0 cursor-pointer'>
                                                        <span className='flex items-center gap-2 text-sm font-medium'>
                                                            <Network className='h-4 w-4' />
                                                            RED & SEGURIDAD
                                                        </span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className='pt-4'>
                                                        <div className='grid grid-cols-1 gap-2 pl-6 border-l-2 border-border/30 text-xs'>
                                                            <div className='flex justify-between'>
                                                                <span className='text-muted-foreground'>Network:</span>
                                                                <span className='font-mono'>{networkName}</span>
                                                            </div>
                                                            <div className='flex justify-between'>
                                                                <span className='text-muted-foreground'>Subnet:</span>
                                                                <span className='font-mono'>{subnetworkName}</span>
                                                            </div>
                                                            <div className='flex justify-between'>
                                                                <span className='text-muted-foreground'>Pod CIDR:</span>
                                                                <span className='font-mono'>{latestSnapshot.clusterIpv4Cidr}</span>
                                                            </div>
                                                            <div className='flex justify-between'>
                                                                <span className='text-muted-foreground'>Svc CIDR:</span>
                                                                <span className='font-mono'>{latestSnapshot.servicesIpv4Cidr}</span>
                                                            </div>
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
                                                                <DialogTitle>Historial Cluster {clusterName}</DialogTitle>
                                                                <DialogDescription>Información historica y cambios de estado</DialogDescription>
                                                            </DialogHeader>
                                                            <GkeHistoricInfoComponent
                                                                snapshots={historyData}
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