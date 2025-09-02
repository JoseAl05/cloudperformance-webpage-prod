import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, Clock, Database, ExternalLink, HardDrive, Server } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';

interface Ec2ConsumeViewAttachedDiskHistoricComponentProps {
    instanceInfo: Ec2ConsumneViewInstance[];
}

interface InstanceGrouped {
    instanceId: string;
    syncs: {
        sync_time: string;
        instanceEbs: unknown[];
    }[];
}

export const Ec2ConsumeViewAttachedDiskHistoricComponent = ({ instanceInfo }: Ec2ConsumeViewAttachedDiskHistoricComponentProps) => {
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
        <div className="relative">
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Buscar instancia..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
            </div>
            <div ref={scrollRef} className="max-h-[60vh] overflow-auto space-y-4">
                {filteredInstances.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Database className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium">No hay datos disponibles</p>
                        <p className="text-sm">No se encontraron instancias que coincidan con la búsqueda</p>
                    </div>
                ) : (
                    filteredInstances.map((instance, idx) => {
                        const countSyncTimes = instance.syncs.length
                        return (
                            <Card key={`${instance.instanceId}-${idx}`} className="shadow-sm border-l-4 border-l-blue-500">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-xl flex items-center gap-3">
                                        <div className="p-2 rounded-lg">
                                            <Server className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <span className="text-gray-600 dark:text-blue-600">Instancia</span>
                                            <Link
                                                href={{
                                                    pathname: '/aws/recursos/instancias-ec2',
                                                    query: { instance: instance.instanceId }
                                                }}
                                                rel="noopener noreferrer" target="_blank"
                                            >
                                                <Badge variant="secondary" className="ml-3 font-mono text-sm transition-all hover:scale-[1.02]">
                                                    <ExternalLink />
                                                    {instance.instanceId}
                                                </Badge>
                                            </Link>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value={instance.instanceId} className="border-none">
                                            <AccordionTrigger className="hover:no-underline py-3 px-4 rounded-lg cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <Clock className="h-5 w-5 text-blue-600" />
                                                    <span className="font-semibold text-gray-600 dark:text-blue-600">Historial de Observaciones</span>
                                                    <Badge variant="outline" className="ml-2">
                                                        {countSyncTimes} registros
                                                    </Badge>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pt-6">
                                                <div className="space-y-4">
                                                    {instance.syncs.map((sync, sIdx) => {
                                                        const syncTimeFormatted = new Date(sync.sync_time).toLocaleString()
                                                        return (
                                                            <Card key={`${sync.sync_time}-${sIdx}`} className="border border-gray-200">
                                                                <CardHeader className="pb-3">
                                                                    <div className="bg-muted/50 px-4 py-3 rounded-t-lg border-b">
                                                                        <div className="flex items-center gap-2">
                                                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                                                            <span className="font-medium text-sm">
                                                                                Sincronización: {syncTimeFormatted}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </CardHeader>
                                                                <CardContent className="pt-4">
                                                                    <Accordion type="single" collapsible className="w-full">
                                                                        <AccordionItem value={syncTimeFormatted} className="border-none">
                                                                            <AccordionTrigger className="hover:no-underline py-2 px-3 rounded-md cursor-pointer">
                                                                                <div className="flex items-center gap-3">
                                                                                    <HardDrive className="h-5 w-5 text-orange-700" />
                                                                                    <span className="font-medium text-gray-600 dark:text-blue-600">Volúmenes EBS Adjuntos</span>
                                                                                    {sync.instanceEbs && sync.instanceEbs.length > 0 && (
                                                                                        <Badge variant="secondary" className="ml-2">
                                                                                            {
                                                                                                sync.instanceEbs.length === 1 ? (
                                                                                                    `${sync.instanceEbs.length} volúmen`
                                                                                                ) : (
                                                                                                    `${sync.instanceEbs.length} volúmenes`
                                                                                                )
                                                                                            }
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                            </AccordionTrigger>
                                                                            <AccordionContent className="pt-4">
                                                                                {sync.instanceEbs && sync.instanceEbs.length > 0 ? (
                                                                                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                                                                        {sync.instanceEbs.map((ebs, index) => (
                                                                                            <Card
                                                                                                key={`${ebs.Ebs.VolumeId}-${index}`}
                                                                                                className="border "
                                                                                            >
                                                                                                <CardContent className="p-4">
                                                                                                    <div className="space-y-3">
                                                                                                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                                                                                            <div className="p-1.5 bg-purple-300 rounded-full">
                                                                                                                <HardDrive className="h-4 w-4 text-purple-700" />
                                                                                                            </div>
                                                                                                            <span className="font-semibold text-gray-600 dark:text-blue-600 text-sm">
                                                                                                                Volumen EBS
                                                                                                            </span>
                                                                                                        </div>

                                                                                                        <div className="space-y-2">
                                                                                                            <div>
                                                                                                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                                                                                    Dispositivo
                                                                                                                </p>
                                                                                                                <Badge variant="outline" className="mt-1 font-mono text-sm">
                                                                                                                    {ebs.DeviceName}
                                                                                                                </Badge>
                                                                                                            </div>

                                                                                                            <div>
                                                                                                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                                                                                    Volume ID
                                                                                                                </p>
                                                                                                                <Badge variant="secondary" className="mt-1 font-mono text-sm">
                                                                                                                    {ebs.Ebs.VolumeId}
                                                                                                                </Badge>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </CardContent>
                                                                                            </Card>
                                                                                        ))}
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                                                                                        <HardDrive className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                                                                        <p className="font-medium">Sin Volúmenes EBS</p>
                                                                                        <p className="text-sm">No hay volúmenes adjuntos en esta observación</p>
                                                                                    </div>
                                                                                )}
                                                                            </AccordionContent>
                                                                        </AccordionItem>
                                                                    </Accordion>
                                                                </CardContent>
                                                            </Card>
                                                        )
                                                    })}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>
            <Button
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 flex items-center gap-2"
            >
                <ArrowUp className="w-5 h-5" />
                <span className="sr-only">Volver arriba</span>
            </Button>
        </div>
    );
};
