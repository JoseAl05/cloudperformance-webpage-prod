import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, Clock, HardDrive, Server } from 'lucide-react';
import { useRef, useState } from 'react';

interface Ec2ConsumeViewStoppedInstancesHistoricComponentProps {
    instanceInfo: Ec2ConsumneViewInstance[];
}

export const Ec2ConsumeViewStoppedInstancesHistoricComponent = ({ instanceInfo }: Ec2ConsumeViewStoppedInstancesHistoricComponentProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToTop = () => {
        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const instanceMap = new Map<string, InstanceGrouped['syncs']>();
    instanceInfo.forEach(inst => {
        const ebsArray = Array.isArray(inst.ebs_devices) ? inst.ebs_devices : [];
        if (!instanceMap.has(inst.resource)) instanceMap.set(inst.resource, []);
        instanceMap.get(inst.resource)?.push({
            sync_time: inst.instance_sync_time,
            instanceEbs: ebsArray
        });
    });

    const groupedInstances: InstanceGrouped[] = Array.from(instanceMap.entries()).map(([instanceId, syncs]) => ({
        instanceId,
        syncs: syncs.sort((a, b) => new Date(a.sync_time).getTime() - new Date(b.sync_time).getTime())
    }));

    const filteredInstances = groupedInstances.filter(instance =>
        instance.instanceId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='relative'>
            <div className='mb-4'>
                <input
                    type='text'
                    placeholder='Buscar instancia...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full p-2 border rounded'
                />
            </div>
            <div ref={scrollRef} className='max-h-[60vh] overflow-auto'>
                {filteredInstances.length === 0 ? (
                    <p>No hay datos</p>
                ) : (
                    filteredInstances.map((instance, idx) => {
                        const countSyncTimes = instance.syncs.length;
                        return (
                            <Card key={`${instance.instanceId}-${idx}`} className='my-5'>
                                <CardHeader className='pb-3'>
                                    <CardTitle className='text-lg flex items-center gap-2'>
                                        <Server className='h-5 w-5 text-blue-500' />
                                        Instancia {instance.instanceId}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <Accordion type='single' collapsible className='w-full'>
                                        <AccordionItem value={instance.instanceId} className='border-none'>
                                            <AccordionTrigger className='hover:no-underline py-2 px-0 cursor-pointer'>
                                                <span className='flex items-center gap-2 text-sm font-medium'>
                                                    <Clock className='h-4 w-4' />
                                                    Observaciones ({countSyncTimes})
                                                </span>
                                            </AccordionTrigger>
                                            <AccordionContent className='pt-4'>
                                                <div className='space-y-3 pl-6 border-l-2 border-border/30'>
                                                    {instance.syncs.map((sync, sIdx) => {
                                                        const syncTimeFormatted = new Date(sync.sync_time).toLocaleString();
                                                        return (
                                                            <Card key={`${sync.sync_time}-${sIdx}`} className='border p-2 rounded mb-2'>
                                                                <CardHeader className='pb-1'>
                                                                    <CardTitle className='text-sm font-medium'>
                                                                        Fecha de observación: {syncTimeFormatted}
                                                                    </CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    <Accordion type='single' collapsible className='w-full'>
                                                                        <AccordionItem value={syncTimeFormatted} className='border-none'>
                                                                            <AccordionTrigger className='hover:no-underline py-2 px-0 cursor-pointer'>
                                                                                <span className='flex items-center gap-2 text-sm font-medium'>
                                                                                    <HardDrive className='h-4 w-4' />
                                                                                    Volumenes EBS
                                                                                </span>
                                                                            </AccordionTrigger>
                                                                            <AccordionContent className='pt-4'>
                                                                                <div className='space-y-3 pl-6 border-l-2 border-border/30'>
                                                                                    {sync.instanceEbs && sync.instanceEbs.length > 0 ? (
                                                                                        <div className='grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3'>
                                                                                            {sync.instanceEbs.map((ebs, index) => (
                                                                                                <div key={`${ebs.Ebs.VolumeId}-${index}`}>
                                                                                                    <div className='flex items-center gap-3'>
                                                                                                        <HardDrive />
                                                                                                        <p>{ebs.DeviceName}</p>
                                                                                                    </div>
                                                                                                    <div className='flex items-center gap-3'>
                                                                                                        <HardDrive />
                                                                                                        <p>{ebs.Ebs.VolumeId}</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <p>Sin Volúmenes</p>
                                                                                    )}
                                                                                </div>
                                                                            </AccordionContent>
                                                                        </AccordionItem>
                                                                    </Accordion>
                                                                </CardContent>
                                                            </Card>
                                                        );
                                                    })}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
            <Button
                onClick={scrollToTop}
                className='fixed bottom-5 right-5 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg z-50 flex items-center gap-2'
            >
                Arriba <ArrowUp className='w-5 h-5' />
            </Button>
        </div>
    )
}