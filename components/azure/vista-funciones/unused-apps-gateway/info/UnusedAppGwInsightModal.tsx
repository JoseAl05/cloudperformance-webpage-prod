import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    AlertTriangle,
    PowerOff,
    ShieldAlert,
    Activity,
    ArrowRight,
    MapPin,
    Ticket,
    CalendarClock,
    Trash2
} from 'lucide-react';
import { UnusedAppGw, UnusedAppGwMetricValues } from '@/interfaces/vista-unused-resources/unusedAppGInterfaces';

interface UnusedAppGwInsightModalProps {
    appGw: UnusedAppGw | null;
    isOpen: boolean;
    onClose: () => void;
}

export const UnusedAppGwInsightModal = ({ appGw, isOpen, onClose }: UnusedAppGwInsightModalProps) => {

    if (!appGw) return null;

    const sortedHistory = [...appGw.details].sort((a, b) =>
        new Date(b.sync_time).getTime() - new Date(a.sync_time).getTime()
    );
    const latestDetail = sortedHistory[0];

    const metricsMap = new Map(appGw.metrics.map(m => [m.metric_name, m.values]));
    const capacityUnits = metricsMap.get('Capacity Units') || [];
    const fixedBillable = metricsMap.get('Fixed Billable Capacity Units') || [];
    const totalRequests = metricsMap.get('Total Requests') || [];

    const getAverage = (vals: UnusedAppGwMetricValues[]) =>
        vals.length ? vals.reduce((acc, curr) => acc + curr.metric_value, 0) / vals.length : 0;

    const avgUsage = getAverage(capacityUnits);
    const avgProvisioned = getAverage(fixedBillable);
    const totalReqCount = totalRequests.reduce((acc, curr) => acc + curr.metric_value, 0);

    const utilizationPct = avgProvisioned > 0 ? (avgUsage / avgProvisioned) * 100 : 0;
    const isV2 = latestDetail.sku.includes('v2');

    const hasNegligibleTraffic = totalReqCount < 10;
    const hasNoBackends = latestDetail.backend_instance_count === 0;

    const isInactive = hasNegligibleTraffic && hasNoBackends;
    const isAbandoned = hasNegligibleTraffic && !hasNoBackends;
    const isLegacy = latestDetail.sku.includes('v1');
    const isOverprovisioned = !isInactive && !isAbandoned && isV2 && (avgProvisioned > avgUsage * 1.5) && avgProvisioned > 2;
    const isWafInefficient = latestDetail.sku.includes('WAF') && latestDetail.waf_mode !== 'Prevention';
    const isEfficient = !isInactive && !isAbandoned && !isOverprovisioned && !isLegacy && !isWafInefficient;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl h-[85vh] flex flex-col">
                <DialogHeader>
                    <div className="flex items-start justify-between mr-4">
                        <div>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                {appGw.name}
                            </DialogTitle>
                            <DialogDescription className="flex items-center gap-3 mt-1.5">
                                <span className="flex items-center gap-1 text-xs">
                                    <MapPin className="h-3 w-3" /> {appGw.location}
                                </span>
                                <span className="flex items-center gap-1 font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border">
                                    <Ticket className="h-3 w-3" /> {latestDetail.sku}
                                </span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Tabs defaultValue="analysis" className="flex-1 flex flex-col min-h-0">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="analysis">Diagnóstico y Ahorro</TabsTrigger>
                        <TabsTrigger value="history">Historial de Configuración ({sortedHistory.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="analysis" className="flex-1 overflow-y-auto pr-2">
                        <div className="grid gap-6 py-4">
                            {(isInactive || isAbandoned) && (
                                <div className="rounded-lg border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20 p-4 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-white dark:bg-red-950 rounded-full shadow-sm">
                                            <Trash2 className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-red-900 dark:text-red-200">
                                                Recomendación: Desprovisionamiento del Recurso
                                            </h4>
                                            <p className="text-sm text-red-700 dark:text-red-300 mt-1 leading-relaxed">
                                                Este Application Gateway ha sido identificado como <strong>Inactivo</strong>.
                                                {isInactive
                                                    ? " No registra tráfico entrante significativo y no tiene servidores de backend (targets) configurados."
                                                    : " Aunque posee configuración de backend, el volumen de tráfico es despreciable (<10 req), indicando un entorno en desuso."}
                                                <br />
                                                Mantenerlo activo genera un costo fijo innecesario (aprox. {avgProvisioned.toFixed(1)} CUs constantes).
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                    <p className="text-sm text-muted-foreground font-medium">Tráfico Total (Periodo)</p>
                                    <p className="text-2xl font-bold">{Math.round(totalReqCount).toLocaleString()} Req</p>
                                    {hasNegligibleTraffic && <Badge variant="secondary" className="mt-1 text-[10px]">Sin Tráfico Significativo</Badge>}
                                </div>
                                <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                    <p className="text-sm text-muted-foreground font-medium">Backend Targets Activos</p>
                                    <p className="text-2xl font-bold">{latestDetail.backend_instance_count}</p>
                                    {hasNoBackends && <Badge variant="destructive" className="mt-1 text-[10px]">Sin Configuración</Badge>}
                                </div>
                            </div>
                            {isV2 && (
                                <div className={`space-y-3 border rounded-lg p-4 ${(isInactive || isAbandoned) ? 'opacity-80 ' : ''}`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-sm font-medium flex items-center gap-2">
                                            <Activity className="h-4 w-4 text-blue-500" /> Eficiencia de Capacidad
                                        </h4>
                                        <span className="text-xs font-bold text-slate-500">
                                            {utilizationPct.toFixed(1)}% Utilizado
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Uso Técnico: {avgUsage.toFixed(2)} CU</span>
                                            <span>Facturado (Min): {avgProvisioned.toFixed(2)} CU</span>
                                        </div>
                                        <Progress value={utilizationPct} className="h-2" />
                                    </div>

                                    {isOverprovisioned && (
                                        <div className="mt-3 text-xs bg-orange-50 text-orange-800 p-3 rounded border border-orange-200 flex gap-2 items-start">
                                            <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                            <span>
                                                <strong>Oportunidad de Rightsizing:</strong> La capacidad mínima configurada ({latestDetail.autoscale_configuration?.min_capacity}) excede la demanda real. Ajustar este valor reducirá el costo fijo mensual.
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                            {!isV2 && (
                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 items-start">
                                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-amber-800">Infraestructura Legacy (V1)</h4>
                                        <p className="text-xs text-amber-700 mt-1">
                                            El SKU V1 tiene costos fijos elevados y carece de autoescalado. Se recomienda planificar la migración a V2 para optimizar el gasto.
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground">Estado del Recurso</h4>
                                <div className="flex flex-wrap gap-2">
                                    {isInactive && <Badge variant="destructive" className="py-1 px-3"><PowerOff className="w-3 h-3 mr-2" /> INACTIVO (Sin Tráfico/Config)</Badge>}

                                    {isAbandoned && <Badge variant="destructive" className="py-1 px-3 bg-red-100 text-red-800 hover:bg-red-200"><PowerOff className="w-3 h-3 mr-2" /> ABANDONADO (Sin Tráfico)</Badge>}

                                    {isLegacy && <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200 py-1 px-3"><AlertTriangle className="w-3 h-3 mr-2" /> SKU LEGACY</Badge>}

                                    {isWafInefficient && <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50 py-1 px-3"><ShieldAlert className="w-3 h-3 mr-2" /> WAF SUBUTILIZADO</Badge>}

                                    {isEfficient && <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 py-1 px-3">Operativo y Eficiente</Badge>}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="flex-1 min-h-0">
                        <ScrollArea className="h-full pr-4">
                            <div className="space-y-4 py-4">
                                {sortedHistory.map((detail, index) => (
                                    <div key={index} className="flex gap-4 items-start group">
                                        <div className="flex flex-col items-center mt-1">
                                            <div className="w-2 h-2 rounded-full bg-slate-300 group-first:bg-blue-500 ring-4 ring-white dark:ring-slate-950" />
                                            {index !== sortedHistory.length - 1 && (
                                                <div className="w-px h-full bg-slate-200 my-1" />
                                            )}
                                        </div>
                                        <div className="flex-1 border rounded-lg p-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-semibold text-xs">
                                                        {new Date(detail.sync_time).toLocaleString()}
                                                    </span>
                                                </div>
                                                {index === 0 && <Badge className="text-[10px] h-5">Actual</Badge>}
                                            </div>
                                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-muted-foreground">
                                                <div>
                                                    <span className="block font-medium text-foreground">SKU</span>
                                                    {detail.sku}
                                                </div>
                                                <div>
                                                    <span className="block font-medium text-foreground">WAF Mode</span>
                                                    {detail.waf_mode}
                                                </div>
                                                <div>
                                                    <span className="block font-medium text-foreground">Capacidad</span>
                                                    {detail.autoscale_configuration
                                                        ? `Min: ${detail.autoscale_configuration.min_capacity} - Max: ${detail.autoscale_configuration.max_capacity}`
                                                        : "N/A"}
                                                </div>
                                                <div>
                                                    <span className="block font-medium text-foreground">Targets</span>
                                                    {detail.backend_instance_count}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};