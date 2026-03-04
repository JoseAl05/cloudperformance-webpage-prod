'use client'

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
    Server, Tag, Calendar, DollarSign, AlertTriangle, 
    CheckCircle2, TrendingDown, Activity, HardDrive, 
    ArrowDown, ArrowUp 
} from 'lucide-react';

export interface FilestoreInstanciaData {
    name: string;
    project_id: string;
    location: string;
    tier: string;
    status: string;
    total_capacity_gb: number;
    used_capacity_gb: number;
    usage_percentage: number;
    is_idle: boolean;
    is_underutilized: boolean;
    costo_usd: number;
    costo_clp: number;
    sync_time: string;
    labels: Record<string, string>;
}

// Reutilizamos el formateador de bytes para el throughput
const formatThroughput = (bytes: number) => {
    if (bytes === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 1. VISTA DE INFORMACIÓN GENERAL
export const FilestoreInfoView = ({ data }: { data: FilestoreInstanciaData }) => {
    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
                <div className={`rounded-lg border-l-4 p-4 shadow-sm flex items-start gap-3 ${
                    data.status === 'READY' ? 'border-green-500 bg-green-50 text-green-700' : 'border-yellow-500 bg-yellow-50 text-yellow-700'
                }`}>
                    <div className="p-2 bg-white/60 dark:bg-black/20 rounded-full">
                        <Server className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">Estado: {data.status}</h4>
                        <p className="text-xs opacity-90 mt-1">
                            {data.status === 'READY' ? 'Instancia operativa y disponible' : 'Instancia en proceso o con advertencias'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <HardDrive className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Tier / Nivel</span>
                        </div>
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase">
                            {data.tier}
                        </p>
                    </div>
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Activity className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Uso de Disco</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {data.usage_percentage.toFixed(1)}%
                        </p>
                    </div>
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Costo Diario</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            ${data.costo_usd.toFixed(2)} <span className="text-sm font-normal">USD</span>
                        </p>
                    </div>
                </div>

                <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" /> Detalles Técnicos
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-muted-foreground">Capacidad Total:</span>
                            <p className="font-medium">{data.total_capacity_gb} GB</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Capacidad Usada:</span>
                            <p className="font-medium">{data.used_capacity_gb.toFixed(2)} GB</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Ubicación:</span>
                            <p className="font-medium">{data.location}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Última Sync:</span>
                            <p className="font-medium">{new Date(data.sync_time).toLocaleString('es-ES')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
};

// 2. VISTA DE MÉTRICAS (Basada en la estructura del historial del JSON)
export const FilestoreMetricasView = ({ data }: { data: unknown }) => {
    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
                <h4 className="text-sm font-semibold mb-3">Último Rendimiento Observado</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2 text-blue-500">
                            <ArrowDown className="h-4 w-4" /> Lectura (Read)
                        </h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">IOPS:</span>
                                <span className="font-bold">{data.history?.ReadIOPS?.slice(-1)[0]?.value.toFixed(1) || 0}</span>
                            </div>
                        </div>
                    </div>
                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2 text-orange-500">
                            <ArrowUp className="h-4 w-4" /> Escritura (Write)
                        </h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">IOPS:</span>
                                <span className="font-bold">{data.history?.WriteIOPS?.slice(-1)[0]?.value.toFixed(1) || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-[10px] text-muted-foreground italic text-center">
                    Los valores corresponden al último punto de datos recolectado.
                </p>
            </div>
        </ScrollArea>
    );
};

// 3. VISTA DE ETIQUETAS
export const FilestoreLabelsView = ({ data }: { data: FilestoreInstanciaData }) => {
    const labelsArray = data.labels ? Object.entries(data.labels) : [];
    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Tag className="h-4 w-4 text-slate-500" /> Labels de Filestore ({labelsArray.length})
                </h4>
                {labelsArray.length > 0 ? (
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900">
                            <TableRow><TableHead>Key</TableHead><TableHead>Value</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                            {labelsArray.map(([key, value]) => (
                                <TableRow key={key}>
                                    <TableCell className="font-mono text-xs font-semibold">{key}</TableCell>
                                    <TableCell><Badge variant="secondary">{value}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">Sin labels configurados.</p>
                )}
            </div>
        </ScrollArea>
    );
};

// 4. VISTA DE RECOMENDACIONES FINOPS
export const FilestoreRecomendacionView = ({ data }: { data: FilestoreInstanciaData }) => {
    let recomendacion = {
        titulo: "Capacidad Adecuada",
        descripcion: "El uso del almacenamiento es eficiente para el tier seleccionado.",
        icon: CheckCircle2,
        color: "border-green-500 bg-green-50 text-green-700"
    };

    if (data.is_idle) {
        recomendacion = {
            titulo: "⚠️ Instancia Zombi detectada",
            descripcion: "Esta instancia no reporta uso. Considere eliminarla si no se requiere un respaldo.",
            icon: AlertTriangle,
            color: "border-red-500 bg-red-50 text-red-700"
        };
    } else if (data.is_underutilized) {
        recomendacion = {
            titulo: "📉 Subutilización Crítica",
            descripcion: "Uso menor al 10%. Evalúe si puede migrar esta data a Cloud Storage (GCSFuse).",
            icon: TrendingDown,
            color: "border-amber-500 bg-amber-50 text-amber-700"
        };
    }

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
                <div className={`border-l-4 p-4 rounded-lg ${recomendacion.color}`}>
                    <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                        <recomendacion.icon className="h-5 w-5" /> {recomendacion.titulo}
                    </h4>
                    <p className="text-sm opacity-90">{recomendacion.descripcion}</p>
                </div>
            </div>
        </ScrollArea>
    );
};