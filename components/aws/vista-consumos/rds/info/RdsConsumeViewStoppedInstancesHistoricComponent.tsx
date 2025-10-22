'use client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RdsConsumeViewInstance } from '@/interfaces/vista-consumos/rdsPgConsumeViewInterfaces';
import { ArrowUp, Calendar, Clock, Database, ExternalLink, MapPin, Server, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';

interface RdsConsumeViewStoppedInstancesHistoricComponentProps {
    instanceInfo: RdsConsumeViewInstance[];
}

interface InstanceGrouped {
    instanceId: string;
    syncs: {
        sync_time: string;
        engine: string;
        engineVersion: string;
        creditEfficiency: string;
        createTime: string;
    }[];
}

export const RdsConsumeViewStoppedInstancesHistoricComponent = ({ instanceInfo }: RdsConsumeViewStoppedInstancesHistoricComponentProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToTop = () => {
        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const groupedInstances: InstanceGrouped[] = useMemo(() => {
        const map = new Map<string, InstanceGrouped['syncs']>();
        (instanceInfo || []).forEach(inst => {
            if (!map.has(inst.resource)) map.set(inst.resource, []);
            map.get(inst.resource)!.push({
                sync_time: inst.db_sync_time,
                engine: inst.engine,
                engineVersion: inst.engine_version,
                status: inst.resource_status,
                region: inst.region,
                creditEfficiency: inst.credit_efficiency,
                createTime: inst.resource_create_time
            });
        });

        return Array.from(map.entries()).map(([instanceId, syncs]) => ({
            instanceId,
            syncs: syncs.sort(
                (a, b) => new Date(a.sync_time).getTime() - new Date(b.sync_time).getTime()
            ),
        }));
    }, [instanceInfo]);

    const filteredInstances = useMemo(
        () =>
            groupedInstances.filter(i =>
                i.instanceId.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [groupedInstances, searchTerm]
    );

    return (
        <div className="relative">
            {/* Buscador */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar instancia..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>

            {/* Contenido scrollable */}
            <div ref={scrollRef} className="max-h-[60vh] overflow-auto space-y-4">
                {filteredInstances.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Database className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium">No hay datos disponibles</p>
                        <p className="text-sm">No se encontraron instancias que coincidan con la búsqueda</p>
                    </div>
                ) : (
                    filteredInstances.map((instance, idx) => {
                        const countSyncTimes = instance.syncs.length;
                        return (
                            <Card key={`${instance.instanceId}-${idx}`} className="my-5">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Server className="h-5 w-5 text-blue-500" />
                                        <Link
                                            href={{
                                                pathname: '/aws/recursos/instancias-rds-pg',
                                                query: { instance: instance.instanceId }
                                            }}
                                            rel="noopener noreferrer"
                                            target="_blank"
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
                                                    Historial ({countSyncTimes})
                                                </span>
                                            </AccordionTrigger>

                                            <AccordionContent className="pt-4">
                                                <div className="space-y-4 pl-6 border-l-2 border-border/30">
                                                    {instance.syncs.map((sync, sIdx) => (
                                                        <div key={`${sync.sync_time}-${sIdx}`} className="border rounded-lg bg-card shadow-sm">
                                                            <div className="bg-muted/50 px-4 py-3 rounded-t-lg border-b">
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                                    <span className="font-medium text-sm">
                                                                        Sincronización: {new Date(sync.sync_time).toLocaleString()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="p-4 space-y-4">
                                                                <div className="grid gap-4 md:grid-cols-2">
                                                                    <div className="space-y-2">
                                                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                                                            Información de Base de Datos
                                                                        </h4>
                                                                        <div className="flex items-center justify-between mb-3 pb-2 border-b">
                                                                            <div className="flex items-center gap-2">
                                                                                <Calendar className="h-4 w-4 text-emerald-600" />
                                                                                <span className="text-sm font-medium">Fecha Creación</span>
                                                                            </div>
                                                                            <Badge variant='outline'>
                                                                                {new Date(sync.createTime).toLocaleString()}
                                                                            </Badge>
                                                                        </div>
                                                                        <div className="flex items-center justify-between mb-3 pb-2 border-b">
                                                                            <div className="flex items-center gap-2">
                                                                                <Database className="h-4 w-4 text-orange-500" />
                                                                                <span className="text-sm font-medium">Motor</span>
                                                                            </div>
                                                                            <Badge variant="outline" className="font-mono text-xs">
                                                                                {sync.engine} {sync.engineVersion}
                                                                            </Badge>
                                                                        </div>

                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center gap-2">
                                                                                <Shield className="h-4 w-4 text-emerald-600" />
                                                                                <span className="text-sm font-medium">Estado</span>
                                                                            </div>
                                                                            <Badge variant={sync.status === 'available' ? 'secondary' : 'outline'}>
                                                                                {sync.status}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                                                            Ubicación y Eficiencia
                                                                        </h4>
                                                                        <div className="flex items-center justify-between mb-3 pb-2 border-b">
                                                                            <div className="flex items-center gap-2">
                                                                                <MapPin className="h-4 w-4 text-blue-600" />
                                                                                <span className="text-sm font-medium">Región</span>
                                                                            </div>
                                                                            <Badge variant="outline" className="font-mono text-xs">
                                                                                {sync.region}
                                                                            </Badge>
                                                                        </div>

                                                                        <div className="flex items-start justify-between gap-2">
                                                                            <div className="flex items-center gap-2">
                                                                                <Zap className="h-4 w-4 text-yellow-600" />
                                                                                <span className="text-sm font-medium">Eficiencia de créditos</span>
                                                                            </div>
                                                                            <span
                                                                                title={sync.creditEfficiency || '—'}
                                                                                className="inline-block rounded-full border px-5 py-1 text-xs font-medium bg-background max-w-[min(40ch,100%)] text-left whitespace-normal break-words"
                                                                            >
                                                                                {sync.creditEfficiency || '—'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
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
                className="fixed bottom-5 right-5 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg z-50 flex items-center gap-2"
            >
                Arriba <ArrowUp className="w-5 h-5" />
            </Button>
        </div>
    )
}