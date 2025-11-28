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
import { UnusedTm, UnusedTmMetricValues } from '@/interfaces/vista-unused-resources/unusedTmInterfaces';

interface UnusedTrafficManagerInsightModalProps {
    tm: UnusedTm | null;
    isOpen: boolean;
    onClose: () => void;
}

export const UnusedTrafficManagerInsightModal = ({ tm, isOpen, onClose }: UnusedTrafficManagerInsightModalProps) => {

    if (!tm) return null;

    const sortedHistory = [...tm.details].sort((a, b) =>
        new Date(b.sync_time).getTime() - new Date(a.sync_time).getTime()
    );
    const latestDetail = sortedHistory[0];

    const metricsMap = new Map(tm.metrics.map(m => [m.metric_name, m.values]));
    const queriesByEndpointReturned = metricsMap.get('Queries by Endpoint Returned Units') || [];

    const getAverage = (vals: UnusedTmMetricValues[]) =>
        vals.length ? vals.reduce((acc, curr) => acc + curr.metric_value, 0) / vals.length : 0;

    const avgQueriesByEndpoint = getAverage(queriesByEndpointReturned);

    const hasNotQueriesByEndpoint = avgQueriesByEndpoint < 5;

    const isInactive = hasNotQueriesByEndpoint;


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl h-[85vh] flex flex-col">
                <DialogHeader>
                    <div className="flex items-start justify-between mr-4">
                        <div>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                {tm.name}
                            </DialogTitle>
                            <DialogDescription className="flex items-center gap-3 mt-1.5">
                                <span className="flex items-center gap-1 text-xs">
                                    <MapPin className="h-3 w-3" /> {tm.location}
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
                            {(isInactive) && (
                                <div className="rounded-lg border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20 p-4 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-white dark:bg-red-950 rounded-full shadow-sm">
                                            <Trash2 className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-red-900 dark:text-red-200">
                                                Recomendación: Eliminar perfil o configurar endpoints
                                            </h4>
                                            <p className="text-sm text-red-700 dark:text-red-300 mt-1 leading-relaxed">
                                                Este Traffic Manager ha sido identificado como <strong>Inactivo</strong>.
                                                {isInactive && " No tiene endpoints registrados y su promedio de queries procesadas es menor a 5 en el periodo seleccionado."}
                                                <br />
                                                Mantenerlo activo sin endpoints no genera costo.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground">Estado del Recurso</h4>
                                <div className="flex flex-wrap gap-2">
                                    {isInactive && <Badge variant="destructive" className="py-1 px-3"><PowerOff className="w-3 h-3 mr-2" /> INACTIVO (Sin Tráfico/Endpoints)</Badge>}
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
                                                    <span className="block font-medium text-foreground">Estado</span>
                                                    {detail.profile_status}
                                                </div>
                                                <div>
                                                    <span className="block font-medium text-foreground">Estado monitor</span>
                                                    {detail.monitor_config.profile_monitor_status}
                                                </div>
                                                <div>
                                                    <span className="block font-medium text-foreground">Ruta</span>
                                                    {detail.monitor_config.path}
                                                </div>
                                                <div>
                                                    <span className="block font-medium text-foreground">Intervalo en segundos</span>
                                                    {detail.monitor_config.interval_in_seconds}
                                                </div>
                                                <div>
                                                    <span className="block font-medium text-foreground">Protocolo</span>
                                                    {detail.monitor_config.protocol}
                                                </div>
                                                <div>
                                                    <span className="block font-medium text-foreground">Timeout en segundos</span>
                                                    {detail.monitor_config.timeout_in_seconds}
                                                </div>
                                                <div>
                                                    <span className="block font-medium text-foreground">Cantidad de fallos tolerados</span>
                                                    {detail.monitor_config.tolerated_number_of_failures}
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