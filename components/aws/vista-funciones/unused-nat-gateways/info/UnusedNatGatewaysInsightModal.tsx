'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Ghost,
    Activity,
    ArrowRightLeft,
    MapPin,
    Hash,
    Server,
    Database,
    AlertTriangle,
    CalendarClock,
    Link as LinkIcon,
    Link2,
    ExternalLink
} from 'lucide-react';
import { UnusedNatGateways } from '@/interfaces/vista-unused-resources/unusedNatGatewaysInterfaces';
import { AsociatedResourcesNatGw } from '@/interfaces/vista-unused-resources/asociatedNatGwResourcesInterfaces';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface UnusedNatGatewaysInsightModalProps {
    natGw: UnusedNatGateways | null;
    asociatedResources: AsociatedResourcesNatGw | null;
    isOpen: boolean;
    onClose: () => void;
}

const getParameters = () => {

}

export const UnusedNatGatewaysInsightModal = ({ natGw, asociatedResources, isOpen, onClose }: UnusedNatGatewaysInsightModalProps) => {
    const searchParams = useSearchParams();

    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const keyParam = searchParams.get('selectedKey');
    const valueParam = searchParams.get('selectedValue');
    const regionParam = searchParams.get('region');


    if (!natGw) return null;

    // Ordenar historial (Más reciente primero)
    const sortedHistory = [...natGw.details].sort((a, b) =>
        new Date(b.sync_time).getTime() - new Date(a.sync_time).getTime()
    );

    const latestDetail = sortedHistory[0];
    const diagnosis = natGw.diagnosis;
    const metrics = diagnosis.metrics_summary;

    // Totales de recursos
    const totalEc2 = asociatedResources?.resources?.ec2?.length || 0;
    const totalRds = (asociatedResources?.resources?.mysql?.length || 0) +
        (asociatedResources?.resources?.postgresql?.length || 0) +
        (asociatedResources?.resources?.sqlserver?.length || 0) +
        (asociatedResources?.resources?.oracle?.length || 0);

    const hasDependencies = totalEc2 > 0 || totalRds > 0;

    // Función auxiliar para filtrar recursos por fecha
    const getResourcesAtSyncTime = (targetTime: string) => {
        if (!asociatedResources) return { ec2: [], rds: [] };

        const ec2AtTime = asociatedResources.resources.ec2.filter(instance =>
            instance.details.some(d => d.sync_time === targetTime)
        ).map(inst => {
            const detail = inst.details.find(d => d.sync_time === targetTime);
            return {
                id: inst.instance_id,
                name: detail?.Tags?.Name || inst.instance_id,
                type: detail?.InstanceType
            };
        });

        const allRds = [
            ...(asociatedResources.resources.mysql || []),
            ...(asociatedResources.resources.postgresql || []),
            ...(asociatedResources.resources.sqlserver || []),
            ...(asociatedResources.resources.oracle || [])
        ];

        const rdsAtTime = allRds.filter(db =>
            db.details.some(d => d.sync_time === targetTime)
        ).map(db => {
            const detail = db.details.find(d => d.sync_time === targetTime);
            return {
                id: db.db_instance_identifier,
                engine: db.engine,
                status: detail?.DBInstanceStatus
            };
        });

        return { ec2: ec2AtTime, rds: rdsAtTime };
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">

                {/* HEADER (Fijo) */}
                <div className="px-6 py-4 border-b">
                    <DialogHeader>
                        <div className="flex items-start justify-between mr-4">
                            <div>
                                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                    {latestDetail.Tags?.Name || natGw.nat_gw_id}
                                </DialogTitle>
                                <DialogDescription className="flex items-center gap-3 mt-1.5">
                                    <span className="flex items-center gap-1 text-xs">
                                        <MapPin className="h-3 w-3" /> {natGw.region}
                                    </span>
                                    <span className="flex items-center gap-1 font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border">
                                        <Hash className="h-3 w-3" /> {natGw.nat_gw_id}
                                    </span>
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                {/* TABS (Cuerpo Flexible) */}
                <Tabs defaultValue="analysis" className="flex-1 flex flex-col min-h-0">
                    <div className="px-6 pt-2 pb-0">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="analysis">Diagnóstico</TabsTrigger>
                            <TabsTrigger value="dependencies">
                                Dependencias ({totalEc2 + totalRds})
                            </TabsTrigger>
                            <TabsTrigger value="history">
                                Historial ({sortedHistory.length})
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* --- TAB 1: ANÁLISIS --- */}
                    <TabsContent value="analysis" className="flex-1 min-h-0 data-[state=active]:flex flex-col">
                        <ScrollArea className="flex-1">
                            <div className="p-6 grid gap-6">
                                <div className="rounded-lg border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20 p-4 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-white dark:bg-red-950 rounded-full shadow-sm">
                                            <Ghost className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-red-900 dark:text-red-200">
                                                Diagnóstico: Posible Recurso Infrautilizado
                                            </h4>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                                            <Activity className="h-4 w-4" />
                                            <p className="text-sm font-medium">Conexiones Promedio</p>
                                        </div>
                                        <p className="text-2xl font-bold">{metrics.avg_active_connections.toFixed(2)}</p>
                                    </div>
                                    <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                                            <ArrowRightLeft className="h-4 w-4" />
                                            <p className="text-sm font-medium">Tráfico Saliente (Total)</p>
                                        </div>
                                        <p className="text-2xl font-bold">{(metrics.total_bytes_out / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                                        Análisis de Impacto si se elimina
                                    </h4>
                                    {hasDependencies ? (
                                        <div className="p-3 border border-orange-200 bg-orange-50 rounded-md text-sm text-orange-800">
                                            <strong>Precaución:</strong> Se detectaron {totalEc2 + totalRds} recursos en las subnets asociadas.
                                        </div>
                                    ) : (
                                        <div className="p-3 border border-green-200 bg-green-50 rounded-md text-sm text-green-800">
                                            <strong>Bajo Riesgo:</strong> No se detectaron instancias activas dependientes.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    {/* --- TAB 2: DEPENDENCIAS --- */}
                    <TabsContent value="dependencies" className="flex-1 min-h-0 data-[state=active]:flex flex-col overflow-y-auto">
                        <ScrollArea className="flex-1">
                            <div className="p-6 space-y-6">
                                <div>
                                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                        <Server className="h-4 w-4 text-slate-500" />
                                        Instancias EC2 ({totalEc2})
                                    </h4>
                                    {totalEc2 > 0 ? (
                                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                            {asociatedResources?.resources?.ec2.map((instance) => {
                                                const detail = instance.details[0];
                                                return (
                                                    <div key={instance.instance_id} className="p-3 border rounded-lg text-sm bg-white dark:bg-slate-950">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <Link
                                                                href={{ pathname: '/aws/recursos/instancias-ec2', query: { startDate: startDateParam, endDate: endDateParam, instance: instance.instance_id, region: regionParam, selectedKey: keyParam, selectedValue: valueParam } }}
                                                                className='text-blue-500 hover:text-blue-500/80'
                                                                rel="noopener noreferrer"
                                                                target="_blank"
                                                            >
                                                                <div className='flex items-center gap-2'>
                                                                    <ExternalLink className='w-4 h-4' />
                                                                    <span className="font-medium">{instance.instance_id}</span>
                                                                </div>
                                                            </Link>
                                                            <Badge variant={detail.State.Name === 'running' ? 'default' : 'secondary'} className="text-[10px]">
                                                                {detail.State.Name}
                                                            </Badge>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
                                                            <span>ID: {instance.instance_id}</span>
                                                            <span>Type: {detail.InstanceType}</span>
                                                            <span>IP: {detail.PrivateIpAddress}</span>
                                                            <span>VPC: {detail.VpcId}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No se encontraron instancias EC2.</p>
                                    )}
                                </div>
                                {/* RDS (Iteramos motores) */}
                                {['mysql', 'postgresql', 'sqlserver', 'oracle'].map((engineKey) => {
                                    const rdsList = (asociatedResources?.resources as unknown)?.[engineKey] || [];
                                    if (rdsList.length === 0) return null;
                                    let redirectUrl = '';
                                    switch (engineKey) {
                                        case 'mysql':
                                            redirectUrl = '/aws/recursos/instancias-rds-mysql';
                                            break;
                                        case 'postgresql':
                                            redirectUrl = '/aws/recursos/instancias-rds-pg';
                                            break;
                                        case 'sqlserver':
                                            redirectUrl = '/aws/recursos/instancias-rds-sqlserver';
                                            break;
                                        case 'oracle':
                                            redirectUrl = '/aws/recursos/instancias-rds-oracle';
                                            break;
                                        default:
                                            redirectUrl = '#';
                                            break;
                                    }
                                    return (
                                        <div key={engineKey} className="mt-4">
                                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 capitalize">
                                                <Database className="h-4 w-4 text-blue-500" />
                                                RDS {engineKey} ({rdsList.length})
                                            </h4>
                                            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                                {rdsList.map((db: unknown) => {
                                                    const detail = db.details[0];
                                                    return (
                                                        <div key={db.db_instance_identifier} className="p-3 border rounded-lg text-sm bg-white dark:bg-slate-950">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <Link
                                                                    href={{ pathname: redirectUrl, query: { startDate: startDateParam, endDate: endDateParam, instance: db.db_instance_identifier, region: regionParam, selectedKey: keyParam, selectedValue: valueParam } }}
                                                                    className='text-blue-500 hover:text-blue-500/80'
                                                                    rel="noopener noreferrer"
                                                                    target="_blank"
                                                                >
                                                                    <div className='flex items-center gap-2'>
                                                                        <ExternalLink className='w-4 h-4' />
                                                                        <span className="font-medium">{db.db_instance_identifier}</span>
                                                                    </div>
                                                                </Link>
                                                                <Badge variant="outline" className="text-[10px]">
                                                                    {detail.DBInstanceStatus}
                                                                </Badge>
                                                            </div>
                                                            <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
                                                                <span>Class: {detail.DBInstanceClass}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    {/* --- TAB 3: HISTORIAL --- */}
                    <TabsContent value="history" className="flex-1 min-h-0 data-[state=active]:flex flex-col">
                        <ScrollArea className="flex-1">
                            <div className="p-6 space-y-4">
                                {sortedHistory.map((detail, index) => {
                                    const resourcesAtDate = getResourcesAtSyncTime(detail.sync_time);
                                    const totalAtDate = resourcesAtDate.ec2.length + resourcesAtDate.rds.length;

                                    return (
                                        <div key={index} className="flex gap-4 items-start group">
                                            {/* Fix Visual: Alineación del timeline */}
                                            <div className="flex flex-col items-center mt-5">
                                                <div className="w-2 h-2 rounded-full bg-slate-300 group-first:bg-blue-500 ring-4 ring-white dark:ring-slate-950 flex-shrink-0" />
                                                {index !== sortedHistory.length - 1 && (
                                                    <div className="w-px h-full bg-slate-200 my-1" />
                                                )}
                                            </div>

                                            <div className="flex-1 border rounded-lg p-4 text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                                <div className="flex justify-between items-center mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-semibold text-xs">
                                                            {new Date(detail.sync_time).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    {index === 0 && <Badge className="text-[10px] h-5">Actual</Badge>}
                                                </div>

                                                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-muted-foreground mb-3">
                                                    <div>
                                                        <span className="block font-medium text-foreground">Estado</span>
                                                        <Badge variant={detail.State === 'available' ? 'outline' : 'secondary'} className="text-[10px] font-normal border-slate-300">
                                                            {detail.State}
                                                        </Badge>
                                                    </div>
                                                    <div>
                                                        <span className="block font-medium text-foreground">IP Pública</span>
                                                        {detail.NatGatewayAddresses?.[0]?.PublicIp || 'N/A'}
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className="block font-medium text-foreground">VPC / Subnet</span>
                                                        <span className="font-mono text-[10px] break-all">{detail.VpcId} / {detail.SubnetId}</span>
                                                    </div>
                                                </div>

                                                {/* Fix Visual: Scroll interno para lista larga */}
                                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <LinkIcon className="h-3 w-3 text-slate-400" />
                                                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                            Vinculados en esa fecha: {totalAtDate}
                                                        </span>
                                                    </div>

                                                    {totalAtDate > 0 ? (
                                                        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
                                                            {resourcesAtDate.ec2.map((ec2, i) => (
                                                                <div key={i} className="flex items-center justify-between text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                                    <div className="flex items-center gap-1.5 min-w-0">
                                                                        <Server className="h-3 w-3 text-slate-500 flex-shrink-0" />
                                                                        <span className="truncate max-w-[180px]" title={ec2.name}>{ec2.name}</span>
                                                                    </div>
                                                                    <span className="font-mono text-muted-foreground whitespace-nowrap ml-2">{ec2.type}</span>
                                                                </div>
                                                            ))}

                                                            {resourcesAtDate.rds.map((db, i) => (
                                                                <div key={i} className="flex items-center justify-between text-[10px] bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded border border-blue-100 dark:border-blue-900">
                                                                    <div className="flex items-center gap-1.5 min-w-0">
                                                                        <Database className="h-3 w-3 text-blue-500 flex-shrink-0" />
                                                                        <span className="truncate max-w-[180px]" title={db.id}>{db.id}</span>
                                                                    </div>
                                                                    <span className="text-blue-700 dark:text-blue-300 whitespace-nowrap ml-2">{db.status}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] text-muted-foreground italic">Sin recursos asociados registrados en este snapshot.</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};