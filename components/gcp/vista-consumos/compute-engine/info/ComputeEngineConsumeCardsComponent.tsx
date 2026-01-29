'use client'

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Database, DollarSign, AlertTriangle, TrendingDown, Zap, Cpu, Network, HardDrive, MemoryStick, LucideIcon } from 'lucide-react';

// --- INTERFACES (Sin cambios) ---
interface CloudSQLResumen {
    total_instancias: number;
    instancias_idle: number;
    instancias_infrautilizadas: number;
    costo_total_clp: number;
    costo_total_usd: number;
    currency: string;
    tiene_billing: boolean;
}

interface Instancia {
    name: string;
    project_id: string;
    location: string;
    status: string;
    machineType: string;
    avg_cpu_utilization: number;
    max_cpu_utilization: number;
    min_cpu_utilization: number;
    avg_disk_read_iops: number;
    max_disk_read_iops: number;
    avg_disk_write_iops: number;
    max_disk_write_iops: number;
    avg_network_egress_throughput: number;
    max_network_egress_throughput: number;
    avg_network_ingress_throughput: number;
    max_network_ingress_throughput: number;
    is_idle: boolean;
    is_underutilized: boolean;
    costo_total_clp: number;
    costo_total_usd: number;
    currency: string;
    tiene_billing: boolean;
    creationTimestamp: string;
    sync_time: string;
    labels: {
        [key: string]: string;
    }
}

interface EfficiencyData {
    global_efficiency_score: number;
    metrics_detail: Array<{
        metric: string;
        avg_utilization: number;
        max_utilization: number;
        min_utilization: number;
        efficiency_score: number;
        samples: number;
    }>;
    interpretation: string;
}

interface CloudSQLCardsProps {
    summary?: CloudSQLResumen;
    instancias?: Instancia[];
    efficiency?: EfficiencyData;
    isLoading: boolean;
}

// --- COMPONENTE STATCARD (Sin cambios estructurales, solo tipos) ---
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
                        <h4 className={`${large ? 'text-5xl' : 'text-3xl'} font-bold tracking-tight`}>
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
                                <p className="text-[10px] mt-0.5">Active export billing en GCP para ver costos</p>
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

// --- HELPER: Configuración visual según el nombre de la métrica ---
const getMetricConfig = (metricName: string) => {
    const name = metricName.toLowerCase();

    if (name.includes('cpu')) {
        return { icon: Cpu, color: 'blue', label: 'CPU Promedio' };
    }
    if (name.includes('memory') || name.includes('memoria') || name.includes('ram')) {
        return { icon: MemoryStick, color: 'green', label: 'Memoria Promedio' };
    }
    if (name.includes('disk') || name.includes('storage') || name.includes('almacenamiento')) {
        return { icon: HardDrive, color: 'amber', label: 'Disco IOPS/Uso' };
    }
    if (name.includes('network') || name.includes('red') || name.includes('conexiones')) {
        return { icon: Network, color: 'purple', label: 'Red / Conexiones' };
    }

    // Default
    return { icon: Activity, color: 'slate', label: metricName.replace(/_/g, ' ') };
};

const getEfficiencyColor = (score: number): string => {
    if (score >= 70) return "green";
    if (score >= 40) return "amber";
    return "red";
};

export const ComputeEngineConsumeCardsComponent = ({
    summary,
    instancias = [],
    efficiency,
    isLoading
}: CloudSQLCardsProps) => {
    const sinBilling = useMemo(() => {
        return instancias.filter(i => i.tiene_billing === false);
    }, [instancias]);

    const costoDescripcion = useMemo(() => {
        if (sinBilling.length === 0) return null;
        if (summary?.costo_total_usd === 0) return "Instancias en Free Tier de GCP.";
        return "Costo mensual total de todas las instancias.";
    }, [sinBilling, summary?.costo_total_usd]);

    // Loading State
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
            {/* FILA 1: Eficiencia Global */}
            {efficiency && (
                <StatCard
                    title="Eficiencia Global"
                    value={`${efficiency.global_efficiency_score.toFixed(1)}%`}
                    subtitle={efficiency.interpretation}
                    description="Puntaje unificado de eficiencia de recursos."
                    icon={Zap}
                    colorClass={getEfficiencyColor(efficiency.global_efficiency_score)}
                    large
                />
            )}

            {/* FILA 2: KPIs Principales (Resumen) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total Instancias"
                    value={summary.total_instancias}
                    unit="VMs"
                    description="Total de instancias Compute Engine."
                    icon={Database}
                    colorClass="blue"
                />
                <StatCard
                    title="Instancias Idle"
                    value={summary.instancias_idle}
                    unit="sin uso"
                    description="Instancias encendidas sin actividad."
                    icon={Activity}
                    colorClass="red"
                />
                <StatCard
                    title="Infrautilizadas"
                    value={summary.instancias_infrautilizadas}
                    unit="recursos"
                    description="Con sobre-provisionamiento de recursos."
                    icon={TrendingDown}
                    colorClass="amber"
                />
                <StatCard
                    title="Costo Total"
                    value={`$${summary.costo_total_usd.toPrecision(2)}`}
                    unit="USD/mes"
                    description={costoDescripcion ?? ''}
                    icon={DollarSign}
                    colorClass="green"
                    warning={sinBilling.length === 0}
                />
            </div>

            {/* FILA 3: Métricas Dinámicas (Iteración sobre metrics_detail) */}
            {efficiency?.metrics_detail && efficiency.metrics_detail.length > 0 && (
                <div className={`grid grid-cols-1 md:grid-cols-${Math.min(efficiency.metrics_detail.length, 4)} gap-4`}>
                    {efficiency.metrics_detail.map((metricDetail, index) => {
                        // Obtener icono y color basado en el nombre de la métrica
                        const config = getMetricConfig(metricDetail.metric);
                        if (metricDetail.metric === 'cpu_utilization') {
                            return (
                                <StatCard
                                    key={`${metricDetail.metric}-${index}`}
                                    title={config.label}
                                    value={metricDetail.avg_utilization.toFixed(2)}
                                    unit="%"
                                    description={`Máx observado: ${metricDetail.max_utilization.toFixed(1)}%`}
                                    subtitle={`Score Eficiencia: ${metricDetail.efficiency_score.toFixed(0)}/100`}
                                    icon={config.icon}
                                    colorClass={config.color}
                                />
                            );
                        } else {
                            return (
                                <StatCard
                                    key={`${metricDetail.metric}-${index}`}
                                    title={config.label}
                                    value={metricDetail.avg_utilization.toFixed(2)}
                                    unit="%"
                                    description={`Máx observado: ${metricDetail.max_utilization.toFixed(1)}%`}
                                    icon={config.icon}
                                    colorClass={config.color}
                                />
                            )
                        }
                    })}
                </div>
            )}
        </div>
    );
};