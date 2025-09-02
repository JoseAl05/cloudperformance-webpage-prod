import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, Clock, ExternalLink, Globe, MapPin, Network, Server, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';

interface Ec2ConsumeViewInUseInterfacesHistoricComponentProps {
    instanceInfo: Ec2ConsumneViewInstance[];
}

interface InstanceGrouped {
    instanceId: string;
    syncs: {
        sync_time: string;
        instanceEbs: unknown[];
    }[];
}
export const Ec2ConsumeViewInUseInterfacesHistoricComponent = ({ instanceInfo }: Ec2ConsumeViewInUseInterfacesHistoricComponentProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToTop = () => {
        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const instanceMap = new Map<string, InstanceGrouped['syncs']>();
    instanceInfo.forEach(inst => {
        const interfacesArray = Array.isArray(inst.network_interfaces) ? inst.network_interfaces : [];
        if (!instanceMap.has(inst.resource)) instanceMap.set(inst.resource, []);
        instanceMap.get(inst.resource)?.push({
            sync_time: inst.instance_sync_time,
            instanceInterfaces: interfacesArray
        });
    });

    const groupedInstances: InstanceGrouped[] = Array.from(instanceMap.entries()).map(([instanceId, syncs]) => ({
        instanceId,
        syncs: syncs.sort((a, b) => new Date(a.sync_time).getTime() - new Date(b.sync_time).getTime())
    }));

    const filteredInstances = groupedInstances.filter(instance =>
        instance.instanceId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "in-use":
                return "bg-green-100 text-green-800 border-green-200"
            case "available":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    return (
        <div className="relative">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar instancia..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div ref={scrollRef} className="max-h-[60vh] overflow-auto">
                {filteredInstances.length === 0 ? (
                    <p>No hay datos</p>
                ) : (
                    filteredInstances.map((instance, idx) => {
                        const countSyncTimes = instance.syncs.length
                        return (
                            <Card key={`${instance.instanceId}-${idx}`} className="my-5">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Server className="h-5 w-5 text-blue-500" />
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
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value={instance.instanceId} className="border-none">
                                            <AccordionTrigger className="hover:no-underline py-2 px-0 cursor-pointer">
                                                <span className="flex items-center gap-2 text-sm font-medium">
                                                    <Clock className="h-4 w-4" />
                                                    Observaciones ({countSyncTimes})
                                                </span>
                                            </AccordionTrigger>
                                            <AccordionContent className="pt-4">
                                                <div className="space-y-4 pl-6 border-l-2 border-border/30">
                                                    {instance.syncs.map((sync, syncIdx) => (
                                                        <div key={syncIdx} className="border rounded-lg bg-card shadow-sm">
                                                            <div className="bg-muted/50 px-4 py-3 rounded-t-lg border-b">
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                                    <span className="font-medium text-sm">
                                                                        Sincronización: {new Date(sync.sync_time).toLocaleString()}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="p-4">
                                                                {sync.instanceInterfaces.length === 0 ? (
                                                                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                                                                        <Shield className="h-4 w-4" />
                                                                        <span className="text-sm">
                                                                            No hay interfaces registradas en esta sincronización.
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="space-y-4">
                                                                        {sync.instanceInterfaces.map((iface: unknown, ifaceIdx: number) => (
                                                                            <div key={ifaceIdx} className="border rounded-lg p-4 bg-background">
                                                                                <div className="flex items-center justify-between mb-4 pb-2 border-b">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Network className="h-4 w-4 text-blue-500" />
                                                                                        <span className="font-medium text-sm">Interfaz {ifaceIdx + 1}</span>
                                                                                    </div>
                                                                                    <Badge className={getStatusColor(iface.Status)}>{iface.Status}</Badge>
                                                                                </div>

                                                                                <div className="grid gap-4 md:grid-cols-2">
                                                                                    <div className="space-y-2">
                                                                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                                                                            Información Básica
                                                                                        </h4>
                                                                                        <div className="space-y-1.5">
                                                                                            <div className="flex items-center gap-2 text-sm">
                                                                                                <span className="text-muted-foreground min-w-[60px]">ID:</span>
                                                                                                <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">
                                                                                                    {iface.NetworkInterfaceId}
                                                                                                </code>
                                                                                            </div>
                                                                                            <div className="flex items-center gap-2 text-sm">
                                                                                                <span className="text-muted-foreground min-w-[60px]">MAC:</span>
                                                                                                <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">
                                                                                                    {iface.MacAddress}
                                                                                                </code>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="space-y-2">
                                                                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                                                                                            <Globe className="h-3 w-3" />
                                                                                            Direcciones IP
                                                                                        </h4>
                                                                                        <div className="space-y-1.5">
                                                                                            <div className="flex items-center gap-2 text-sm">
                                                                                                <span className="text-muted-foreground min-w-[60px]">Privada:</span>
                                                                                                <Badge variant="outline" className="font-mono text-xs">
                                                                                                    {iface.PrivateIpAddress}
                                                                                                </Badge>
                                                                                            </div>
                                                                                            {iface.Association?.PublicIp && (
                                                                                                <div className="flex items-center gap-2 text-sm">
                                                                                                    <span className="text-muted-foreground min-w-[60px]">Pública:</span>
                                                                                                    <Badge
                                                                                                        variant="outline"
                                                                                                        className="font-mono text-xs bg-green-50 text-green-700 border-green-200"
                                                                                                    >
                                                                                                        {iface.Association.PublicIp}
                                                                                                    </Badge>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="space-y-2">
                                                                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                                                                                            <MapPin className="h-3 w-3" />
                                                                                            Infraestructura
                                                                                        </h4>
                                                                                        <div className="space-y-1.5">
                                                                                            <div className="flex items-center gap-2 text-sm">
                                                                                                <span className="text-muted-foreground min-w-[60px]">VPC:</span>
                                                                                                <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">
                                                                                                    {iface.VpcId}
                                                                                                </code>
                                                                                            </div>
                                                                                            <div className="flex items-center gap-2 text-sm">
                                                                                                <span className="text-muted-foreground min-w-[60px]">Subnet:</span>
                                                                                                <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">
                                                                                                    {iface.SubnetId}
                                                                                                </code>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {iface.Attachment && (
                                                                                        <div className="space-y-2">
                                                                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                                                                                Fecha Attachment
                                                                                            </h4>
                                                                                            <div className="flex items-center gap-2 text-sm">
                                                                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                                                                <span className="text-xs text-muted-foreground">
                                                                                                    {new Date(iface.Attachment.AttachTime).toLocaleString()}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
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
                className='fixed bottom-5 right-5 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg z-50 flex items-center gap-2'
            >
                Arriba <ArrowUp className='w-5 h-5' />
            </Button>
        </div>
    )
}