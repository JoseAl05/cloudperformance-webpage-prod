'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { LoaderComponent } from "@/components/general_aws/LoaderComponent";
import { UnusedElbV2Details } from "@/interfaces/vista-unused-resources/unusedElbV2Interfaces";
import { AsociatedElbV2Resources } from "@/interfaces/vista-unused-resources/asociatedElbV2ResourcesInterfaces";
import { GlobalMetricsSummary } from "../table/UnusedElbV2Columns";
import { Activity, CalendarDays, CheckCircle2, History, Network, Server, XCircle, BarChart3, Radio } from "lucide-react";
import { formatMetric } from '@/lib/metricUtils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface UnusedElbV2InsightModalProps {
    elbData: UnusedElbV2Details;
    asociatedResources: AsociatedElbV2Resources[] | undefined;
    globalMetrics?: GlobalMetricsSummary;
    isLoading: boolean;
    isOpen: boolean;
    onClose: () => void;
}

// Componente para filas de progreso con tag nativo <progress>
const MetricProgressRow = ({ label, value, globalAvg, unit }: { label: string, value: number, globalAvg: number, unit?: string }) => {
    const isAboveAvg = value > globalAvg;
    const percentageText = globalAvg > 0 ? ((value / globalAvg) * 100).toFixed(1) : '0.0';

    const progressColorClass = isAboveAvg
        ? '[&::-webkit-progress-value]:bg-orange-500 [&::-moz-progress-bar]:bg-orange-500'
        : '[&::-webkit-progress-value]:bg-blue-600 [&::-moz-progress-bar]:bg-blue-600';

    return (
        <div className="space-y-1.5 py-3">
            <div className="flex justify-between items-center text-sm">
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">{label}</span>
                    <span className="text-xs text-muted-foreground">Global Avg: {formatMetric(globalAvg)}</span>
                </div>
                <div className="text-right">
                    <span className="font-bold text-lg">{formatMetric(value)}</span> <span className="text-xs text-muted-foreground">{unit}</span>
                </div>
            </div>

            <progress
                value={value}
                // Ajuste de escala: si el valor local es mayor al promedio, el máximo de la barra es el valor local (para que se llene al 100%)
                // Si es menor, el máximo es el promedio (para mostrar qué fracción del promedio representa)
                max={globalAvg > 0 ? (value > globalAvg ? value : globalAvg) : 1}
                title={`Relación: ${percentageText}% del promedio`}
                className={`w-full h-2.5 rounded-full  appearance-none bg-secondary border border-secondary [&::-webkit-progress-bar]:bg-secondary [&::-webkit-progress-bar]:rounded-full ${progressColorClass}`}
            />
        </div>
    );
};

export const UnusedElbV2InsightModal = ({
    elbData,
    asociatedResources,
    globalMetrics,
    isLoading,
    isOpen,
    onClose,
}: UnusedElbV2InsightModalProps) => {

    const searchParams = useSearchParams();

    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const regionParam = searchParams.get('region');

    const latestHistory = elbData.history && elbData.history.length > 0 ? elbData.history[0] : null;
    const resources = asociatedResources && asociatedResources.length > 0 ? asociatedResources[0] : null;

    const flatHealthHistory = resources?.target_healths.flatMap(th =>
        th.details.map(detail => ({
            ...detail,
            target_id: th.target_id,
            target_group: th.target_group,
            tg_short_name: th.target_group.split('/').slice(1, 2)[0] || 'Unknown'
        }))
    ).sort((a, b) => new Date(b.sync_time).getTime() - new Date(a.sync_time).getTime()) || [];

    const sortedTargetGroupsHistory = resources?.target_groups
        ? [...resources.target_groups].sort((a, b) => new Date(b.sync_time).getTime() - new Date(a.sync_time).getTime())
        : [];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] md:max-w-6xl h-[90vh] flex flex-col p-0 gap-0 overflow-y-scroll">

                <DialogHeader className="px-6 py-4 border-b bg-background z-10 shrink-0">
                    <div className="flex items-center justify-between mr-8">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg">Análisis de Recurso ELBv2</DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground font-mono mt-1 break-all">
                                    {elbData.elb_arn}
                                </DialogDescription>
                            </div>
                        </div>
                        <Badge variant="outline" className="h-6 text-sm px-3">{elbData.region}</Badge>
                    </div>
                </DialogHeader>

                <div className="flex-1  flex flex-col bg-muted/5">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <LoaderComponent />
                        </div>
                    ) : (
                        <Tabs defaultValue="current" className="flex-1 flex flex-col ">
                            <div className="px-6 pt-4 shrink-0">
                                <TabsList className="grid w-full grid-cols-3 max-w-md">
                                    <TabsTrigger value="current">Resumen Actual</TabsTrigger>
                                    <TabsTrigger value="metrics_history">Historial Métricas</TabsTrigger>
                                    <TabsTrigger value="resources_history">Historial Recursos</TabsTrigger>
                                </TabsList>
                            </div>

                            <ScrollArea className="flex-1">
                                <div className="p-6 max-w-6xl mx-auto">
                                    {/* TAB 1: RESUMEN ACTUAL */}
                                    <TabsContent value="current" className="mt-0 space-y-8 animate-in fade-in-50 duration-300">

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Columna Izquierda: Configuración (Sin cambios) */}
                                            <div className="space-y-4">
                                                <h3 className="font-semibold text-base flex items-center gap-2 text-foreground/90">
                                                    <Network className="h-4 w-4 text-blue-500" /> Configuración Actual
                                                </h3>
                                                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm bg-card p-5 rounded-xl border shadow-sm">
                                                    <div>
                                                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide block mb-1">Tipo</span>
                                                        <Badge variant="secondary" className="capitalize px-3">{elbData.elb_type}</Badge>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide block mb-1">Estado</span>
                                                        <div className="flex items-center gap-2">
                                                            <div className={`h-2.5 w-2.5 rounded-full ${latestHistory?.State?.Code === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                                            <span className="font-medium text-foreground">{latestHistory?.State?.Code || 'Desconocido'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide block mb-1">DNS Name</span>
                                                        <div className="font-mono text-xs bg-muted/50 p-2 rounded border break-all select-all">
                                                            {latestHistory?.DNSName}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide block mb-1">VPC ID</span>
                                                        <span className="font-mono text-xs">{latestHistory?.VpcId}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide block mb-1">Fecha Sincronización</span>
                                                        <span className="text-xs">{latestHistory ? new Date(latestHistory.sync_time).toLocaleDateString() : '-'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Columna Derecha: Métricas con Barras */}
                                            <div className="space-y-4">
                                                <h3 className="font-semibold text-base flex items-center gap-2 text-foreground/90">
                                                    <BarChart3 className="h-4 w-4 text-orange-500" /> Rendimiento vs Promedio Global
                                                </h3>
                                                <div className="bg-card p-5 rounded-xl border shadow-sm space-y-1">
                                                    {elbData.elb_type === 'application' ? (
                                                        <>
                                                            <MetricProgressRow
                                                                label="Requests Average"
                                                                value={latestHistory?.metrics_summary?.request_count_avg || 0}
                                                                globalAvg={globalMetrics?.avg_requests || 0}
                                                                unit="Reqs"
                                                            />
                                                            <Separator className="my-2" />
                                                            <MetricProgressRow
                                                                label="Active Connections"
                                                                value={latestHistory?.metrics_summary?.active_connections_avg || 0}
                                                                globalAvg={globalMetrics?.avg_active_connections || 0}
                                                                unit="Conns"
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <MetricProgressRow
                                                                label="New Flows"
                                                                value={latestHistory?.metrics_summary?.new_flows_avg || 0}
                                                                // CORRECCIÓN: avg_new_flows
                                                                globalAvg={globalMetrics?.avg_new_flows || 0}
                                                                unit="Flows"
                                                            />
                                                            <Separator className="my-2" />
                                                            <MetricProgressRow
                                                                label="Active Flows"
                                                                value={latestHistory?.metrics_summary?.active_flows_avg || 0}
                                                                globalAvg={globalMetrics?.avg_active_flows || 0}
                                                                unit="Flows"
                                                            />
                                                        </>
                                                    )}
                                                    <Separator className="my-2" />
                                                    <MetricProgressRow
                                                        label="Consumed LCUs"
                                                        value={latestHistory?.metrics_summary?.consumed_lcus_avg || 0}
                                                        globalAvg={globalMetrics?.avg_consumed_lcus || 0}
                                                        unit="LCU"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* (Resto del contenido del modal igual que antes) */}
                                        {/* Target Groups, Tablas Históricas... */}
                                        <div className="space-y-4 pt-4">
                                            <h3 className="font-semibold text-base flex items-center gap-2">
                                                <Server className="h-4 w-4 text-purple-500" /> Target Groups (Configuración Reciente)
                                            </h3>

                                            {!sortedTargetGroupsHistory || sortedTargetGroupsHistory.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center p-8 bg-muted/20 rounded-xl border border-dashed">
                                                    <Server className="h-8 w-8 text-muted-foreground/30 mb-2" />
                                                    <span className="text-sm text-muted-foreground">No se encontraron Target Groups asociados.</span>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {Object.values(sortedTargetGroupsHistory.reduce((acc, curr) => {
                                                        if (!acc[curr.TargetGroupName]) acc[curr.TargetGroupName] = curr;
                                                        return acc;
                                                    }, {} as Record<string, typeof sortedTargetGroupsHistory[0]>)).map((tg, idx) => (
                                                        <div key={idx} className="flex flex-col p-4 bg-card border rounded-lg hover:shadow-sm transition-all">
                                                            <div className="flex items-start justify-between mb-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-md">
                                                                        <Radio className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-semibold text-sm">{tg.TargetGroupName}</p>
                                                                        <p className="text-xs text-muted-foreground">{tg.TargetType}</p>
                                                                    </div>
                                                                </div>
                                                                <Badge variant="outline">{tg.Protocol}:{tg.Port}</Badge>
                                                            </div>
                                                            <div className="mt-auto pt-3 border-t flex justify-between text-xs">
                                                                <span className="text-muted-foreground">Health Check Protocol</span>
                                                                <span className="font-mono">{tg.HealthCheckProtocol}:{tg.HealthCheckPort}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    {/* TABS DE HISTORIAL (Mantienen su lógica interna, solo usan el formatMetric ya añadido) */}
                                    <TabsContent value="metrics_history" className="mt-0">
                                        {/* ... Código de tabla histórica ... */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold flex items-center gap-2">
                                                    <History className="h-4 w-4 text-blue-500" /> Registro Histórico
                                                </h3>
                                                <Badge variant="secondary">{elbData.history?.length || 0} Data Points</Badge>
                                            </div>

                                            <div className="rounded-lg border ">
                                                <Table>
                                                    <TableHeader className="bg-muted/50">
                                                        <TableRow>
                                                            <TableHead className="w-[180px]">Fecha</TableHead>
                                                            <TableHead>Estado</TableHead>
                                                            <TableHead className="text-right">Requests/Flows</TableHead>
                                                            <TableHead className="text-right">Active Conns</TableHead>
                                                            <TableHead className="text-right">LCUs</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {elbData.history?.map((item, idx) => (
                                                            <TableRow key={idx} className="hover:bg-muted/5">
                                                                <TableCell className="font-mono text-xs">
                                                                    {new Date(item.sync_time).toLocaleString()}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge variant="outline" className={`text-[10px] ${item.State?.Code === 'active' ? 'text-green-600 border-green-200' : ''}`}>
                                                                        {item.State?.Code}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-right font-mono text-xs">
                                                                    {elbData.elb_type === 'application'
                                                                        ? formatMetric(item.metrics_summary.request_count_avg)
                                                                        : formatMetric(item.metrics_summary.new_flows_avg)}
                                                                </TableCell>
                                                                <TableCell className="text-right font-mono text-xs">
                                                                    {elbData.elb_type === 'application'
                                                                        ? formatMetric(item.metrics_summary.active_connections_avg)
                                                                        : formatMetric(item.metrics_summary.active_flows_avg)}
                                                                </TableCell>
                                                                <TableCell className="text-right font-mono text-xs text-muted-foreground">
                                                                    {formatMetric(item.metrics_summary.consumed_lcus_avg)}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="resources_history" className="mt-0 space-y-8">
                                        {/* ... Código de tablas de recursos ... (Sin cambios necesarios) */}
                                        {/* Historial de Salud */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold flex items-center gap-2">
                                                    <Activity className="h-4 w-4 text-green-500" /> Historial de Salud (Targets)
                                                </h3>
                                            </div>
                                            <div className="rounded-lg border ">
                                                <Table>
                                                    <TableHeader className="bg-muted/50">
                                                        <TableRow>
                                                            <TableHead className="w-[180px]">Fecha Sync</TableHead>
                                                            <TableHead>Target ID</TableHead>
                                                            <TableHead>Port</TableHead>
                                                            <TableHead>Estado</TableHead>
                                                            <TableHead>Target Group</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {flatHealthHistory.length === 0 ? (
                                                            <TableRow>
                                                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                                    No hay historial de health checks disponible.
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : (
                                                            flatHealthHistory.map((item, idx) => {
                                                                const isHealthy = item.TargetHealth?.State === 'healthy';
                                                                return (
                                                                    <TableRow key={idx}>
                                                                        <TableCell className="font-mono text-xs whitespace-nowrap text-muted-foreground">
                                                                            {new Date(item.sync_time).toLocaleString()}
                                                                        </TableCell>
                                                                        <TableCell className="font-mono text-xs font-medium">
                                                                            <Link
                                                                                href={{ pathname: '/aws/recursos/instancias-ec2', query: { startDate: startDateParam, endDate: endDateParam, instance: item.target_id, region: regionParam } }}
                                                                                className='text-blue-500 hover:text-blue-500/80'
                                                                                rel="noopener noreferrer"
                                                                                target="_blank"
                                                                            >
                                                                                {item.target_id}
                                                                            </Link>
                                                                        </TableCell>
                                                                        <TableCell className="text-xs">
                                                                            {item.Target?.Port}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Badge variant={isHealthy ? "default" : "destructive"} className={`text-[10px] h-5 w-fit flex gap-1 ${isHealthy ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200 shadow-none' : ''}`}>
                                                                                {isHealthy ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                                                {item.TargetHealth?.State}
                                                                            </Badge>
                                                                        </TableCell>
                                                                        <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate" title={item.target_group}>
                                                                            {item.tg_short_name}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            })
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>

                                        {/* Historial de Configuración */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold flex items-center gap-2">
                                                <CalendarDays className="h-4 w-4 text-purple-500" /> Historial de Cambios (TGs)
                                            </h3>
                                            <div className="rounded-lg border ">
                                                <Table>
                                                    <TableHeader className="bg-muted/50">
                                                        <TableRow>
                                                            <TableHead className="w-[180px]">Fecha Sync</TableHead>
                                                            <TableHead>Nombre Grupo</TableHead>
                                                            <TableHead>Protocolo</TableHead>
                                                            <TableHead>Tipo</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {sortedTargetGroupsHistory.length === 0 ? (
                                                            <TableRow>
                                                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                                    No hay historial de configuración.
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : (
                                                            sortedTargetGroupsHistory.map((tg, idx) => (
                                                                <TableRow key={idx}>
                                                                    <TableCell className="font-mono text-xs whitespace-nowrap text-muted-foreground">
                                                                        {new Date(tg.sync_time).toLocaleString()}
                                                                    </TableCell>
                                                                    <TableCell className="text-xs font-medium">
                                                                        {tg.TargetGroupName}
                                                                    </TableCell>
                                                                    <TableCell className="text-xs text-muted-foreground">
                                                                        {tg.Protocol}:{tg.Port}
                                                                    </TableCell>
                                                                    <TableCell className="text-xs">
                                                                        {tg.TargetType}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </div>
                            </ScrollArea>
                        </Tabs>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};