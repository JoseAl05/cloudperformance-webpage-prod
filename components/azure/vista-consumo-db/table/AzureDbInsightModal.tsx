'use client'

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { Database, DollarSign, AlertTriangle, CheckCircle2, TrendingDown, Activity } from 'lucide-react';

export interface AzureDbInstanciaData {
    name: string;
    project_id: string;
    region_name: string;
    db_type: string;
    state: string;
    avg_cpu_utilization: number;
    max_cpu_utilization: number;
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
    sync_time: string;
    userLabels?: Record<string, string>;
}

export const AzureDbInfoView = ({ data }: { data: AzureDbInstanciaData }) => {
    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
                <div className={`rounded-lg border-l-4 p-4 shadow-sm flex items-start gap-3 ${
                    data.state === 'RUNNING' ? 'border-green-500 bg-green-50 text-green-700' : 
                    'border-gray-500 bg-gray-50 text-gray-700'
                }`}>
                    <div className="p-2 bg-white/60 dark:bg-black/20 rounded-full">
                        <Database className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">Estado: {data.state}</h4>
                        <p className="text-xs opacity-90 mt-1">
                            {data.state === 'RUNNING' ? 'Base de datos activa' : 'Base de datos detenida/sin actividad'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 border dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Database className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Resource Group</span>
                        </div>
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">
                            {data.project_id}
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
            </div>
        </ScrollArea>
    );
};

export const AzureDbMetricasView = ({ data }: { data: AzureDbInstanciaData }) => {
    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
                <h4 className="text-sm font-semibold mb-3">Métricas de Rendimiento</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2"><Activity className="h-4 w-4 text-blue-500" /> CPU</h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">Promedio:</span><span className="font-bold">{data.avg_cpu_utilization.toFixed(2)}%</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Máximo:</span><span className="font-bold text-red-600">{data.max_cpu_utilization.toFixed(2)}%</span></div>
                        </div>
                    </div>
                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2"><Activity className="h-4 w-4 text-purple-500" /> Memoria</h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">Promedio:</span><span className="font-bold">{data.avg_memory_utilization.toFixed(2)}%</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Máximo:</span><span className="font-bold text-red-600">{data.max_memory_utilization.toFixed(2)}%</span></div>
                        </div>
                    </div>
                    <div className="border dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950 md:col-span-2">
                        <h5 className="font-semibold text-sm mb-3 flex items-center gap-2"><Database className="h-4 w-4 text-amber-500" /> Storage</h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">Utilización:</span><span className="font-bold">{data.storage_utilization_pct.toFixed(1)}%</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Usado vs Total:</span><span className="font-bold">{data.avg_storage_used_gb.toFixed(1)} GB / {data.avg_storage_total_gb.toFixed(1)} GB</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
};

export const AzureDbRecomendacionView = ({ data }: { data: AzureDbInstanciaData }) => {
    let recomendacion = { titulo: "Instancia Óptima", descripcion: "La base de datos se utiliza eficientemente.", icon: CheckCircle2, color: "border-green-500 bg-green-50 text-green-700" };
    
    if (data.is_idle) {
        recomendacion = { titulo: "⚠️ DB Zombi / Idle", descripcion: "CPU extremadamente bajo. Considere detenerla.", icon: AlertTriangle, color: "border-red-500 bg-red-50 text-red-700" };
    } else if (data.is_underutilized) {
        recomendacion = { titulo: "📉 DB Infrautilizada", descripcion: "Considere reducir los vCores aprovisionados.", icon: TrendingDown, color: "border-amber-500 bg-amber-50 text-amber-700" };
    }

    return (
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
                <div className={`border-l-4 p-4 rounded-lg ${recomendacion.color}`}>
                    <h4 className="text-sm font-bold mb-2 flex items-center gap-2"><recomendacion.icon className="h-5 w-5" />{recomendacion.titulo}</h4>
                    <p className="text-sm opacity-90">{recomendacion.descripcion}</p>
                </div>
            </div>
        </ScrollArea>
    );
};