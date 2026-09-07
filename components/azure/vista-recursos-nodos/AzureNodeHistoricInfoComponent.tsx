'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Server } from 'lucide-react'

export interface VmStatus {
    code?: string;
    display_status?: string;
}

export interface VmDisk {
    name?: string;
    managed_disk?: { storage_account_type?: string };
    disk_size_gb?: number;
    os_type?: string;
}

export interface VmNic {
    id?: string;
}

export interface AzureInstance {
    hardware_profile?: { vm_size?: string };
    instance_view?: { 
        statuses?: VmStatus[]; 
        os_name?: string; 
        os_version?: string; 
    };
    storage_profile?: { 
        os_disk?: VmDisk; 
        data_disks?: VmDisk[]; 
    };
    network_profile?: { 
        network_interfaces?: VmNic[]; 
    };
    _cq_sync_time?: { $date?: string } | string;
    location?: string;
    tags?: Record<string, unknown>;
    time_created?: string | Date;
    [key: string]: unknown;
}

export const AzureVmHistoricInfoComponent = ({ instances }: { instances: AzureInstance[] }) => {
    return (
        <div className="space-y-4">
            {instances.map((instance, index) => {
                const type = instance?.hardware_profile?.vm_size || 'N/A';
                
                const statuses = instance?.instance_view?.statuses || [];
                const powerStatusObj = statuses.find((s: VmStatus) => s.code?.startsWith('PowerState/'));
                const status = powerStatusObj?.display_status || 'Unknown';
                const isRunning = status.toLowerCase().includes('running');
                
                const rawDate = instance._cq_sync_time?.$date || instance._cq_sync_time;
                const syncTime = rawDate ? new Date(rawDate as string | number | Date).toLocaleString() : 'N/A';

                return (
                    <Card key={index} className='shadow-sm'>
                        <CardHeader className="pb-2 bg-muted/20">
                            <CardTitle className="text-sm flex items-center justify-between">
                                <span className='flex items-center gap-2'>
                                    <Server className="h-4 w-4 text-blue-500" />
                                    Observación: {syncTime}
                                </span>
                                <Badge variant={isRunning ? "default" : "secondary"} className={isRunning ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : ""}>
                                    {status.replace('VM ', '')}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tamaño (SKU):</span>
                                <span className="font-medium">{type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Región:</span>
                                <span className="font-medium">{instance.location}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Etiquetas (Tags):</span>
                                <span className="font-medium">{Object.keys(instance.tags || {}).length} asignadas</span>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}