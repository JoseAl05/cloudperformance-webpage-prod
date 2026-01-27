'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Accordion } from '@/components/ui/accordion'
import { Server, Layers, Network, MapPin, Globe, Cpu, ShieldCheck } from 'lucide-react'
import { ClusterGkeInfo } from '@/interfaces/vista-gke/gkeInterfaces';

interface GkeHistoricInfoComponentProps {
    snapshots: ClusterGkeInfo[]
}

export const GkeHistoricInfoComponent = ({ snapshots }: GkeHistoricInfoComponentProps) => {
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

    return (
        <ScrollArea className="max-h-[60vh]">
            {
                snapshots && (
                    snapshots.map((snapshot, index) => {
                        const status = snapshot.status;
                        const regionName = snapshot.location || snapshot.zone || 'Global';
                        const masterVersion = snapshot.currentMasterVersion;
                        const totalNodes = snapshot.currentNodeCount;
                        const nodePoolsCount = snapshot.nodePools?.length || 0;
                        const endpoint = snapshot.endpoint;
                        const networkName = snapshot.networkConfig?.network?.split('/').pop() || 'default';
                        const displayId = snapshot.name ? snapshot.name : 'N/A';

                        return (
                            <Card key={index} className='my-5'>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Server className="h-5 w-5 text-blue-500" />
                                        Cluster {displayId}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between gap-5">
                                            <span className="font-semibold text-sm text-gray-500">{new Date(snapshot.sync_time).toLocaleString()}</span>
                                            <Badge variant="default" className={getStatusColor(status)}>
                                                {status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Versión:</span>
                                            <span className="font-medium truncate max-w-[200px]">{masterVersion}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Ubicación:</span>
                                            <span className="font-medium flex items-center gap-1">
                                                <Globe className="h-3 w-3" />
                                                {regionName}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Tier:</span>
                                            <span className="font-medium">{snapshot.enterpriseConfig?.clusterTier || 'STANDARD'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Creado:</span>
                                            <span className="font-medium">{new Date(snapshot.createTime).toLocaleDateString()}</span>
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
                                                <p className='text-xs text-muted-foreground'>VPC</p>
                                                <p className='text-xs font-semibold truncate max-w-[80px]' title={networkName}>
                                                    {networkName}
                                                </p>
                                            </div>
                                        </div>

                                        <Accordion type='single' collapsible className='w-full'>
                                            <AccordionItem
                                                value={`pools-hist-${snapshot.id}-${index}`}
                                                className='border-none'
                                            >
                                                <AccordionTrigger className='hover:no-underline py-2 px-0 cursor-pointer'>
                                                    <span className='flex items-center gap-2 text-sm font-medium'>
                                                        <Layers className='h-4 w-4' />
                                                        DETALLE POOLS
                                                    </span>
                                                </AccordionTrigger>
                                                <AccordionContent className='pt-4'>
                                                    <div className='space-y-3 pl-6 border-l-2 border-border/30'>
                                                        {snapshot.nodePools?.map((pool, idx) => (
                                                            <div key={idx} className='flex flex-col gap-1'>
                                                                <div className='flex items-center gap-2'>
                                                                    <div className='h-2 w-2 rounded-full bg-gray-400'></div>
                                                                    <p className='text-xs font-semibold'>{pool.name}</p>
                                                                </div>
                                                                <div className='pl-4 text-xs text-muted-foreground flex justify-between'>
                                                                    <span>{pool.version}</span>
                                                                    <span>{pool.initialNodeCount} nodos</span>
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