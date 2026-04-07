'use client'

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, DollarSign, AlertTriangle, TrendingDown, Zap, LucideIcon, Plug, X, Workflow, ArrowUpDown, Globe, RefreshCw, FileText, RotateCcw, Gauge } from 'lucide-react';
import { formatBytes, formatGeneric } from '@/lib/bytesToMbs';
import {
    LoadbalancerV2ConsumeGlobalEfficiency,
    LoadbalancerV2ConsumeInfoInstances,
    LoadbalancerV2ConsumeInfoInstancesHistory
} from '@/interfaces/vista-consumos/elbV2ConsumeViewInterfaces';

interface ElbV2ConsumeCardsComponentProps {
    summary: {
        total_loadbalancersv2: number;
        loadbalancersv2_idle: number;
        loadbalancersv2_infrautilizadas: number;
    };
    instancias: LoadbalancerV2ConsumeInfoInstances[];
    efficiency: LoadbalancerV2ConsumeGlobalEfficiency;
    isLoading: boolean;
}

const StatCard = ({
    title,
    value,
    unit,
    icon: Icon,
    description,
    colorClass = "blue",
    warning = false,
    subtitle,
    large = false
}: {
    title: string;
    value: string | number;
    unit?: string;
    icon: LucideIcon;
    description?: string;
    colorClass?: string;
    warning?: boolean;
    subtitle?: string;
    large?: boolean;
}) => {

    const colorStyles = {
        blue: { border: "border-l-blue-500", bgIcon: "bg-blue-100 text-blue-600" },
        amber: { border: "border-l-amber-500", bgIcon: "bg-amber-100 text-amber-600" },
        green: { border: "border-l-green-500", bgIcon: "bg-green-100 text-green-600" },
        red: { border: "border-l-red-500", bgIcon: "bg-red-100 text-red-600" },
        purple: { border: "border-l-purple-500", bgIcon: "bg-purple-100 text-purple-600" },
        slate: { border: "border-l-slate-500", bgIcon: "bg-slate-100 text-slate-600" },
    };

    const style = colorStyles[colorClass as keyof typeof colorStyles] || colorStyles.blue;

    return (
        <Card className={`border-l-4 shadow-sm ${style.border}`}>
            <CardContent className={large ? "p-8" : "p-6"}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground capitalize">{title}</p>
                        <h4 className={`${large ? 'text-5xl' : 'text-2xl'} font-bold tracking-tight`}>
                            {value} {unit && <span className="text-sm font-normal text-slate-400">{unit}</span>}
                        </h4>
                        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
                    </div>
                    <div className={`p-3 rounded-xl ${style.bgIcon}`}>
                        <Icon className={large ? "w-8 h-8" : "w-6 h-6"} />
                    </div>
                </div>
                <div className="space-y-2">
                    {warning ? (
                        <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold">Sin detalle de facturación</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground">{description}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

const getEfficiencyColor = (score: string): string => {
    if (score === "Infrautilizado") return "red";
    if (score === "Bajo Uso") return "amber";
    return "green";
};

export const ElbV2ConsumeCardsComponent = ({
    summary,
    instancias,
    efficiency,
    isLoading
}: ElbV2ConsumeCardsComponentProps) => {
    const allHistory = useMemo<LoadbalancerV2ConsumeInfoInstancesHistory[]>(() => {
        if (!instancias?.length) return [];
        return instancias.flatMap(inst => inst.history);
    }, [instancias]);

    const costoTotal = useMemo(() => {
        return allHistory.reduce((sum, h) => sum + (h.costo_usd || 0), 0);
    }, [allHistory]);

    const metricas = useMemo(() => {
        if (!allHistory.length) return {
            active_connection_count: 0,
            new_connection_count: 0,
            processed_bytes: 0,
            request_count: 0,
            consumed_lcus: 0,
            http_5xx_count: 0,
            tcp_client_reset_count: 0,
            rule_evaluations: 0,
        };

        const total = allHistory.reduce((acc, h) => ({
            active_connection_count: acc.active_connection_count + (h.avg_active_connection_count || 0),
            new_connection_count: acc.new_connection_count + (h.avg_new_connection_count || 0),
            processed_bytes: acc.processed_bytes + (h.avg_processed_bytes || 0),
            request_count: acc.request_count + (h.avg_request_count || 0),
            consumed_lcus: acc.consumed_lcus + (h.avg_consumed_lcus || 0),
            http_5xx_count: acc.http_5xx_count + (h.avg_http_5xx_count || 0),
            tcp_client_reset_count: acc.tcp_client_reset_count + (h.avg_tcp_client_reset_count || 0),
            rule_evaluations: acc.rule_evaluations + (h.avg_rule_evaluations || 0),
        }), {
            active_connection_count: 0,
            new_connection_count: 0,
            processed_bytes: 0,
            request_count: 0,
            consumed_lcus: 0,
            http_5xx_count: 0,
            tcp_client_reset_count: 0,
            rule_evaluations: 0,
        });

        const count = allHistory.length;
        return {
            active_connection_count: total.active_connection_count / count,
            new_connection_count: total.new_connection_count / count,
            processed_bytes: total.processed_bytes / count,
            request_count: total.request_count / count,
            consumed_lcus: total.consumed_lcus / count,
            http_5xx_count: total.http_5xx_count / count,
            tcp_client_reset_count: total.tcp_client_reset_count / count,
            rule_evaluations: total.rule_evaluations / count,
        };
    }, [allHistory]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-40 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                    ))}
                </div>
                <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-40 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!summary) return null;

    return (
        <div className="space-y-6">
            {efficiency && (
                <StatCard
                    title="Eficiencia Global"
                    value={`${efficiency.global_efficiency}`}
                    description={`Promedio ponderado de eficiencia basado en LCUs consumidos con ${efficiency.metrics_detail[0]?.samples ?? 0} muestras.`}
                    icon={Zap}
                    colorClass={getEfficiencyColor(efficiency.global_efficiency)}
                    large
                />
            )}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total Load Balancers"
                    value={summary.total_loadbalancersv2}
                    unit="Load Balancers"
                    description="Total de Load Balancers v2."
                    icon={Workflow}
                    colorClass="blue"
                />
                <StatCard
                    title="Load Balancers Idle"
                    value={summary.loadbalancersv2_idle}
                    unit="sin uso"
                    description="Load Balancers sin actividad."
                    icon={Activity}
                    colorClass="red"
                />
                <StatCard
                    title="Infrautilizadas"
                    value={summary.loadbalancersv2_infrautilizadas}
                    unit="recursos"
                    description="Con sobre-provisionamiento de recursos."
                    icon={TrendingDown}
                    colorClass="amber"
                />
                <StatCard
                    title="Costo Total"
                    value={`$ ${formatGeneric(costoTotal)}`}
                    unit="USD"
                    description="Costo total de todos los Load Balancers en el período."
                    icon={DollarSign}
                    colorClass="green"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title="Promedio Conexiones Activas"
                    value={formatGeneric(metricas.active_connection_count)}
                    unit="Conexiones"
                    description="Conexiones activas promedio en el período."
                    icon={Plug}
                    colorClass="blue"
                />
                <StatCard
                    title="Promedio Nuevas Conexiones"
                    value={formatGeneric(metricas.new_connection_count)}
                    unit="Conexiones"
                    description="Nuevas conexiones promedio en el período."
                    icon={RefreshCw}
                    colorClass="blue"
                />
                <StatCard
                    title="Promedio Datos Procesados"
                    value={formatBytes(metricas.processed_bytes)}
                    unit=""
                    description="Flujo promedio de datos procesados por los Load Balancers."
                    icon={ArrowUpDown}
                    colorClass="purple"
                />
                <StatCard
                    title="Promedio LCUs Consumidos"
                    value={formatGeneric(metricas.consumed_lcus)}
                    unit="LCUs"
                    description="Unidades de capacidad consumidas promedio en el período."
                    icon={Gauge}
                    colorClass="green"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title="Promedio Requests"
                    value={formatGeneric(metricas.request_count)}
                    unit="Requests"
                    description="Cantidad promedio de requests procesados en el período."
                    icon={Globe}
                    colorClass="blue"
                />
                <StatCard
                    title="Promedio Errores HTTP 5XX"
                    value={formatGeneric(metricas.http_5xx_count)}
                    unit="Errores"
                    description="Errores 5XX promedio generados por los targets."
                    icon={X}
                    colorClass="red"
                />
                <StatCard
                    title="Promedio TCP Client Resets"
                    value={formatGeneric(metricas.tcp_client_reset_count)}
                    unit="Resets"
                    description="Resets TCP iniciados por clientes promedio en el período."
                    icon={RotateCcw}
                    colorClass="amber"
                />
                <StatCard
                    title="Promedio Rule Evaluations"
                    value={formatGeneric(metricas.rule_evaluations)}
                    unit="Evaluaciones"
                    description="Evaluaciones de reglas promedio en el período (ALB)."
                    icon={FileText}
                    colorClass="slate"
                />
            </div>
        </div>
    );
};