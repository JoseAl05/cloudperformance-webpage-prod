'use client'

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, Tag, Calendar, DollarSign, AlertTriangle, CheckCircle2, TrendingDown, Activity } from 'lucide-react';

interface InstanciaData {
    name: string;
    db_type: string;
    region_name: string;
    tier: string;
    databaseVersion: string;
    state: string;
    createTime: string;
    avg_cpu_utilization: number;
    max_cpu_utilization: number;
    avg_connections: number;
    max_connections: number;
    avg_memory_utilization: number;
    max_memory_utilization: number;
    storage_utilization_pct: number;
    avg_storage_used_gb: number;
    avg_storage_total_gb: number;
    is_idle: boolean;
    is_underutilized: boolean;
    storage_inefficient: boolean;
    costo_total_usd: number;
    tiene_billing: boolean;
    zone: string;
    project_id: string;
    userLabels?: Record<string, string>;
}

// Tab 1: Información General
export const CloudSQLInfoView = ({ data }: { data: InstanciaData }) => {
    const getEstadoColor = (estado: string) => {
        if (estado === 'RUNNABLE') return 'bg-green-100 text-green-700';
        if (estado === 'STOPPED') return 'bg-red-100 text-red-700';
        return 'bg-gray-100 text-gray-700';
    };

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
                {/* Estado de la instancia */}
                <div className={`rounded-lg border-l-4 p-4 shadow-sm flex items-start gap-3 ${
                    data.state === 'RUNNABLE' ? 'border-green-500 bg-green-50 text-green-700' : 
                    'border-gray-500 bg-gray-50 text-gray-700'
                }`}>
                    <div className="p-2 bg-white/60 dark:bg-black/20 rounded-full">
                        <Database className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">Estado: {data.state}</h4>
                        <p className="text-xs opacity-90 mt-1">
                            {data.state === 'RUNNABLE' ? 'Instancia activa y funcionando' : 'Instancia detenida'}
                        </p>
                    </div>
                </div>

                {/* KPIs principales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Database className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Tipo BD</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {data.db_type}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{data.databaseVersion}</p>
                    </div>
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Activity className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Tier</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {data.tier}
                        </p>
                    </div>
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Costo Mensual</span>
                        </div>
                        {data.tiene_billing ? (
                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                ${data.costo_total_usd.toFixed(2)} <span className="text-sm font-normal">USD</span>
                            </p>
                        ) : (
                            <Badge variant="outline" className="text-xs">Sin billing</Badge>
                        )}
                    </div>
                </div>

                {/* Detalles */}
                <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" /> Información
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-muted-foreground">Creación:</span>
                            <p className="font-medium">{new Date(data.createTime).toLocaleString('es-ES')}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Región:</span>
                            <p className="font-medium">{data.region_name}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Zona:</span>
                            <p className="font-medium">{data.zone}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Proyecto:</span>
                            <p className="font-medium font-mono text-xs">{data.project_id}</p>
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
};

// Tab 2: Métricas Detalladas
export const CloudSQLMetricasView = ({ data }: { data: InstanciaData }) => {
    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
                <h4 className="text-sm font-semibold mb-3">Métricas de Rendimiento</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* CPU */}
                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-500" /> CPU
                        </h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Promedio:</span>
                                <span className="font-bold">{data.avg_cpu_utilization.toFixed(2)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Máximo:</span>
                                <span className="font-bold text-red-600">{data.max_cpu_utilization.toFixed(2)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Memoria */}
                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-purple-500" /> Memoria
                        </h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Promedio:</span>
                                <span className="font-bold">{data.avg_memory_utilization.toFixed(2)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Máximo:</span>
                                <span className="font-bold text-red-600">{data.max_memory_utilization.toFixed(2)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Conexiones */}
                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-green-500" /> Conexiones
                        </h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Promedio:</span>
                                <span className="font-bold">{data.avg_connections.toFixed(1)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Máximo:</span>
                                <span className="font-bold text-red-600">{data.max_connections.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Storage */}
                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Database className="h-4 w-4 text-amber-500" /> Storage
                        </h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Utilización:</span>
                                <span className="font-bold">{data.storage_utilization_pct.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Usado:</span>
                                <span className="font-bold">{data.avg_storage_used_gb.toFixed(1)} GB</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total:</span>
                                <span className="font-bold">{data.avg_storage_total_gb.toFixed(1)} GB</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
};

// Tab 3: Labels (placeholder por ahora - necesitamos ver estructura de labels en JSON)
export const CloudSQLLabelsView = ({ data }: { data: InstanciaData }) => {
    const labelsArray = data.userLabels ? Object.entries(data.userLabels) : [];

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Tag className="h-4 w-4 text-slate-500" /> Labels de la Instancia ({labelsArray.length})
                </h4>
                {labelsArray.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden dark:border-slate-800">
                        <Table>
                            <TableHeader className="bg-slate-50 dark:bg-slate-900">
                                <TableRow>
                                    <TableHead>Key</TableHead>
                                    <TableHead>Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {labelsArray.map(([key, value]) => (
                                    <TableRow key={key}>
                                        <TableCell className="font-mono text-xs font-semibold">{key}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{value}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        Esta instancia no tiene labels configurados.
                    </p>
                )}
            </div>
        </ScrollArea>
    );
};

// Tab 4: Recomendación FinOps
export const CloudSQLRecomendacionView = ({ data }: { data: InstanciaData }) => {
    const ahorroAnual = data.costo_total_usd * 12;

    // Determinar recomendación principal
    let recomendacion = {
        titulo: "Instancia Óptima",
        descripcion: "Esta instancia está bien dimensionada y siendo utilizada eficientemente.",
        icon: CheckCircle2,
        color: "border-green-500 bg-green-50 text-green-700"
    };

    if (data.is_idle) {
        recomendacion = {
            titulo: "⚠️ Instancia IDLE Detectada",
            descripcion: "CPU < 5% y conexiones < 2. Considere detener o eliminar.",
            icon: AlertTriangle,
            color: "border-red-500 bg-red-50 text-red-700"
        };
    } else if (data.is_underutilized) {
        recomendacion = {
            titulo: "📉 Instancia Infrautilizada",
            descripcion: "CPU < 20% o conexiones < 5. Considere reducir el tier.",
            icon: TrendingDown,
            color: "border-amber-500 bg-amber-50 text-amber-700"
        };
    }

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
                <div className={`border-l-4 p-4 rounded-lg ${recomendacion.color}`}>
                    <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                        <recomendacion.icon className="h-5 w-5" />
                        {recomendacion.titulo}
                    </h4>
                    <p className="text-sm opacity-90">
                        {recomendacion.descripcion}
                    </p>
                </div>

                <div className="space-y-3">
                    {data.is_idle && (
                        <>
                            <div className="border dark:border-slate-800 rounded-lg p-4">
                                <h5 className="font-semibold text-sm mb-2">1. Detener Instancia</h5>
                                <p className="text-xs text-muted-foreground mb-3">
                                    Detenga la instancia para evitar costos de cómputo (mantiene costos de storage).
                                </p>
                                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded text-xs">
                                    <strong>Documentación GCP:</strong> Cloud SQL Stop Instance
                                </div>
                            </div>
                            <div className="border dark:border-slate-800 rounded-lg p-4">
                                <h5 className="font-semibold text-sm mb-2">2. Crear Backup y Eliminar</h5>
                                <p className="text-xs text-muted-foreground mb-3">
                                    Cree un snapshot antes de eliminar para recuperación futura.
                                </p>
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded text-xs">
                                    <strong>Ahorro estimado:</strong> ${data.costo_total_usd.toFixed(2)} USD/mes 
                                    (${ahorroAnual.toFixed(2)} USD/año)
                                </div>
                            </div>
                        </>
                    )}

                    {data.is_underutilized && !data.is_idle && (
                        <div className="border dark:border-slate-800 rounded-lg p-4">
                            <h5 className="font-semibold text-sm mb-2">Reducir Tier de la Instancia</h5>
                            <p className="text-xs text-muted-foreground mb-3">
                                Considere reducir vCPU y RAM para ajustar al uso real. Tier actual: <strong>{data.tier}</strong>
                            </p>
                            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded text-xs">
                                <strong>Documentación GCP:</strong> Cloud SQL Machine Types & Pricing
                            </div>
                        </div>
                    )}

                    {data.storage_inefficient && (
                        <div className="border dark:border-slate-800 rounded-lg p-4">
                            <h5 className="font-semibold text-sm mb-2">Optimizar Storage</h5>
                            <p className="text-xs text-muted-foreground mb-3">
                                Storage aprovisionado: {data.avg_storage_total_gb.toFixed(1)} GB | 
                                Usado: {data.avg_storage_used_gb.toFixed(1)} GB ({data.storage_utilization_pct.toFixed(1)}%)
                            </p>
                            <p className="text-xs text-muted-foreground mb-3">
                                • Reduzca el almacenamiento aprovisionado si es posible<br/>
                                • Active auto-resize en GCP para ajuste automático
                            </p>
                            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded text-xs">
                                <strong>Documentación GCP:</strong> Cloud SQL Storage Auto-increase
                            </div>
                        </div>
                    )}

                    {!data.is_idle && !data.is_underutilized && !data.storage_inefficient && (
                        <div className="border dark:border-slate-800 rounded-lg p-4">
                            <h5 className="font-semibold text-sm mb-2">✅ Sin recomendaciones</h5>
                            <p className="text-xs text-muted-foreground">
                                Esta instancia está bien dimensionada según las métricas analizadas.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </ScrollArea>
    );
};