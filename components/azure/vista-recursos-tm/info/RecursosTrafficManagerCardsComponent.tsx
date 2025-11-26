'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TrafficManagerDataHistory } from '@/interfaces/vista-traffic-manager/trafficManagerInterfaces';
import { Activity, AlertCircle, BarChart3, Globe, List, Network, Server, ShieldAlert } from 'lucide-react';
import { RecursosTrafficManagerModalComponent } from '@/components/azure/vista-recursos-tm/info/RecursosTrafficManagerModalComponent';
import { Button } from '@/components/ui/button';

interface RecursosTrafficManagerCardsComponentProps {
    latestData: TrafficManagerDataHistory;
}

export const RecursosTrafficManagerCardsComponent = ({ latestData }: RecursosTrafficManagerCardsComponentProps) => {

    const today = new Date();
    const syncTime = new Date(latestData._cq_sync_time);
    const isToday =
        syncTime.getDate() === today.getDate() &&
        syncTime.getMonth() === today.getMonth() &&
        syncTime.getFullYear() === today.getFullYear();

    const cardTitle = isToday
        ? 'Actual del Recurso'
        : `registrado el: ${syncTime.toLocaleDateString()} ${syncTime.toLocaleTimeString()}`;

    const isEnabled = latestData.profile_status === 'Enabled';
    const monitorStatus = latestData.monitor_config.profile_monitor_status;
    const endpointCount = latestData.endpoints.length;
    const isMonitorInactive = monitorStatus === 'Inactive' || monitorStatus === 'Disabled';
    const isDegraded = monitorStatus === 'Degraded';

    const queriesValue = latestData.avg_queries_returned !== null && latestData.avg_queries_returned !== undefined
        ? latestData.avg_queries_returned.toLocaleString('es-CL', { maximumFractionDigits: 2 })
        : 'N/A';
    const isLowTraffic = (latestData.avg_queries_returned || 0) < 10;

    const statusColor = isEnabled ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-gray-500/10 text-gray-500';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Tarjeta Principal de Estado */}
            <Card className="col-span-1 lg:col-span-1 border-l-4 border-l-blue-500 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Server className="h-5 w-5 text-blue-500" />
                        Estado {cardTitle}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Estado del Perfil</span>
                        <Badge variant="outline" className={statusColor}>
                            {latestData.profile_status}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Método Enrutamiento</span>
                        <span className="font-medium text-sm">{latestData.traffic_routing_method}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">DNS TTL</span>
                        <span className="font-mono text-sm">{latestData.dns_config.ttl}s</span>
                    </div>

                    <div className="pt-2 border-t mt-2">
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <a
                                href={`http://${latestData.dns_config.fqdn}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-blue-600 hover:underline truncate"
                            >
                                {latestData.dns_config.fqdn}
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tarjeta de Métricas y Salud */}
            <Card className="col-span-1 lg:col-span-1 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="h-5 w-5 text-orange-500" />
                        Salud y Monitoreo {cardTitle}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-3 rounded-lg flex flex-col items-center justify-center text-center">
                            <span className="text-xs text-muted-foreground mb-1">Estado Monitor</span>
                            <span className={`font-bold text-sm ${isMonitorInactive ? 'text-gray-400' : isDegraded ? 'text-red-500' : 'text-green-600'}`}>
                                {monitorStatus}
                            </span>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-lg flex flex-col items-center justify-center text-center">
                            <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                <BarChart3 className="h-3 w-3" />
                                Consultas (Avg)
                            </span>
                            <span className={`font-bold text-xl ${isLowTraffic ? 'text-gray-500' : 'text-blue-600'}`}>
                                {queriesValue}
                            </span>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-lg flex flex-col items-center justify-center text-center relative group">
                            <span className="text-xs text-muted-foreground mb-1">Endpoints</span>
                            <span className="font-bold text-xl">{endpointCount}</span>

                            {endpointCount > 0 && (
                                <div className="mt-2 w-full">
                                    <RecursosTrafficManagerModalComponent
                                        endpoints={latestData.endpoints}
                                        titleSuffix="(Estado Actual)"
                                        trigger={
                                            <Button variant="ghost" size="sm" className="h-6 text-xs w-full text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                                                <List className="h-3 w-3 mr-1" />
                                                Ver lista
                                            </Button>
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-xs text-muted-foreground mt-2">
                        Protocolo: <span className="font-mono text-foreground">{latestData.monitor_config.protocol}</span> en puerto <span className="font-mono text-foreground">{latestData.monitor_config.port}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Tarjeta de Insights / Ahorro (Dinámica) */}
            <Card className="col-span-1 lg:col-span-1 bg-slate-50/50 dark:bg-slate-900/20 border-dashed">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-purple-500" />
                        Análisis de Uso {cardTitle}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                    {/* Insight 1: Sin Endpoints */}
                    {endpointCount === 0 && (
                        <Alert variant="destructive" className="py-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="text-sm font-semibold">Recurso Infrautilizado</AlertTitle>
                            <AlertDescription className="text-xs">
                                Este perfil está activo pero <strong>no tiene endpoints configurados</strong>.
                                <br />
                                <span className="opacity-80 mt-1 block border-t border-red-200/20 pt-1">
                                    Considere deshabilitar o eliminar si no está en uso para evitar costes base.
                                </span>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Insight 2: Monitor Inactivo en Perfil Activo */}
                    {endpointCount > 0 && isEnabled && isMonitorInactive && (
                        <Alert className="py-2 border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/10">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="text-sm font-semibold">Riesgo de Disponibilidad</AlertTitle>
                            <AlertDescription className="text-xs">
                                El perfil está habilitado pero el monitor está <strong>Inactivo</strong>.
                                El failover automático no funcionará.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Insight 3: Configuración Estándar */}
                    {endpointCount > 0 && isEnabled && !isMonitorInactive && (
                        <div className="flex items-start gap-3 p-3 rounded-md bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100">
                            <Network className="h-4 w-4 text-blue-500 mt-1" />
                            <div>
                                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Configuración Operativa</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    El enrutamiento está funcionando con {endpointCount} endpoints.
                                    <br />
                                    <strong>TTL ({latestData.dns_config.ttl}s):</strong> {latestData.dns_config.ttl < 60 ? "Alto volumen de consultas (Costo variable alto)" : "Volumen estándar de consultas"}.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};