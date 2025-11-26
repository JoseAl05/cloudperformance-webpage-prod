'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TrafficManagetDataEndpoints } from "@/interfaces/vista-traffic-manager/trafficManagerInterfaces"
import { ReactNode } from "react"
import {
    Layers,
    Globe,
    MapPin,
    Activity,
    Target,
    CheckCircle2,
    AlertTriangle,
    XCircle
} from "lucide-react"

interface RecursosTrafficManagerModalComponentProps {
    endpoints: TrafficManagetDataEndpoints[];
    trigger: ReactNode;
    titleSuffix?: string;
}

export const RecursosTrafficManagerModalComponent = ({ endpoints, trigger, titleSuffix = '' }: RecursosTrafficManagerModalComponentProps) => {

    const getMonitorStatusColor = (status: string) => {
        if (status === 'Online') return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200';
        if (status === 'Degraded') return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200';
        if (status === 'Inactive' || status === 'Disabled') return 'text-gray-500 bg-gray-50 dark:bg-gray-800 border-gray-200';
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200'; // CheckingEndpoint etc
    }

    const getMonitorIcon = (status: string) => {
        if (status === 'Online') return <CheckCircle2 className="h-3 w-3" />;
        if (status === 'Degraded') return <AlertTriangle className="h-3 w-3" />;
        if (status === 'Inactive' || status === 'Disabled') return <XCircle className="h-3 w-3" />;
        return <Activity className="h-3 w-3" />;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
                <DialogHeader className="pb-4 border-b">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Layers className="h-5 w-5 text-blue-500" />
                        Endpoints Configurados {titleSuffix}
                    </DialogTitle>
                    <DialogDescription>
                        {endpoints.length > 0
                            ? `Listado de ${endpoints.length} destinos configurados en este perfil.`
                            : "No hay endpoints configurados en este registro."
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 min-h-0 pt-4">
                    {endpoints.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/20 rounded-lg border-2 border-dashed">
                            <Layers className="h-10 w-10 mb-2 opacity-50" />
                            <p>Sin endpoints registrados</p>
                        </div>
                    ) : (
                        <ScrollArea className="h-full pr-4">
                            <div className="space-y-3">
                                {endpoints.map((endpoint, index) => (
                                    <div
                                        key={`${endpoint.id}-${index}`}
                                        className="border rounded-lg p-4 text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm"
                                    >
                                        {/* Cabecera de la tarjeta */}
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                                            <div className="flex items-center gap-2">
                                                <Target className="h-4 w-4 text-blue-500" />
                                                <span className="font-semibold text-base">{endpoint.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={endpoint.endpoint_status === 'Enabled' ? 'outline' : 'secondary'}
                                                    className={endpoint.endpoint_status === 'Enabled' ? 'border-green-500 text-green-700 font-normal' : ''}>
                                                    Config: {endpoint.endpoint_status}
                                                </Badge>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 font-medium ${getMonitorStatusColor(endpoint.endpoint_monitor_status)}`}>
                                                    {getMonitorIcon(endpoint.endpoint_monitor_status)}
                                                    {endpoint.endpoint_monitor_status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Grid de detalles similar a UnusedTrafficManagerInsightModal */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-xs bg-muted/30 p-3 rounded-md">
                                            <div className="col-span-1 sm:col-span-2">
                                                <span className="block font-medium text-foreground mb-1 flex items-center gap-1">
                                                    <Globe className="h-3 w-3 text-muted-foreground" />
                                                    Target (Destino)
                                                </span>
                                                <div className="font-mono text-muted-foreground bg-background px-2 py-1 rounded border break-all">
                                                    {endpoint.target}
                                                </div>
                                            </div>

                                            <div>
                                                <span className="block font-medium text-foreground mb-1 flex items-center gap-1">
                                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                                    Ubicación
                                                </span>
                                                <span className="text-muted-foreground">
                                                    {endpoint.endpoint_location || 'Global / No especificada'}
                                                </span>
                                            </div>

                                            <div>
                                                <span className="block font-medium text-foreground mb-1">
                                                    Tipo
                                                </span>
                                                <span className="text-muted-foreground truncate" title={endpoint.type}>
                                                    {endpoint.type.split('/').pop()}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 mt-1 pt-2 border-t col-span-1 sm:col-span-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground">Peso:</span>
                                                    <span className="font-mono font-bold">{endpoint.weight || '-'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground">Prioridad:</span>
                                                    <span className="font-mono font-bold">{endpoint.priority || '-'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}