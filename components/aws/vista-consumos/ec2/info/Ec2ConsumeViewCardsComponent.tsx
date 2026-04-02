'use client'

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Database, DollarSign, AlertTriangle, TrendingDown, Zap, Cpu, Network, HardDrive, MemoryStick, LucideIcon, CheckCheck } from 'lucide-react';
import { ConsumeViewEc2GlobalEfficiency, ConsumeViewEc2InfoInstances, ConsumeViewEc2InfoInstancesHistory } from '@/interfaces/vista-consumos/ec2ConsumeViewInterfaces';
import { formatBytes, formatGeneric } from '@/lib/bytesToMbs';

interface Ec2ConsumeViewCardsComponentProps {
    summary: {
        total_instancias: number;
        instancias_idle: number;
        instancias_infrautilizadas: number;
        sync_time: string;
    };
    instancias: ConsumeViewEc2InfoInstances[];
    efficiency: ConsumeViewEc2GlobalEfficiency;
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

// --- HELPER: Configuración visual según el nombre de la métrica ---
const getMetricConfig = (metricName: string) => {
    const name = metricName.toLowerCase();

    if (name.includes('cpucreditbalance')) {
        return { icon: Cpu, color: 'blue', label: 'Créditos CPU Disponibles' };
    }
    if (name.includes('cpucreditusage')) {
        return { icon: Cpu, color: 'blue', label: 'Créditos CPU Usados' };
    }
    if (name.includes('cpuutilization')) {
        return { icon: Cpu, color: 'blue', label: 'Uso de CPU' };
    }
    if (name.includes('networkin')) {
        return { icon: Network, color: 'green', label: 'Transferencia de entrada de Red' };
    }
    if (name.includes('networkout')) {
        return { icon: Network, color: 'green', label: 'Transferencia de salida de Red' };
    }
    if (name.includes('statuscheckfailed')) {
        return { icon: CheckCheck, color: 'green', label: 'Check de fallos de instancia' };
    }

    // Default
    return { icon: Activity, color: 'slate', label: metricName.replace(/_/g, ' ') };
};

const getEfficiencyColor = (score: number): string => {
    if (score === "Infrautilizado") return "red";
    if (score === "Uso Bajo") return "amber";
    return "green";
};

export const Ec2ConsumeViewCardsComponent = ({
    summary,
    instancias,
    efficiency,
    isLoading
}: Ec2ConsumeViewCardsComponentProps) => {
    const allHistory = useMemo<ConsumeViewEc2InfoInstancesHistory[]>(() => {
        if (!instancias?.length) return [];
        return instancias.flatMap(inst => inst.history);
    }, [instancias]);

    const costoTotal = useMemo(() => {
        return allHistory.reduce((sum, h) => sum + (h.costo_usd || 0), 0);
    }, [allHistory]);

    const metricas = useMemo(() => {
        if (!allHistory.length) return { cpu: 0, network_in_out: 0, cpu_credit_usage: 0, cpu_credit_balance: 0 };

        const total = allHistory.reduce((acc, h) => ({
            cpu: acc.cpu + (h.avg_cpu_utilization || 0),
            network_in: acc.network_in + (h.avg_network_in || 0),
            network_out: acc.network_out + (h.avg_network_out || 0),
            cpu_credit_usage: acc.cpu_credit_usage + (h.avg_cpu_credit_usage || 0),
            cpu_credit_balance: acc.cpu_credit_balance + (h.avg_cpu_credit_balance || 0),
        }), { cpu: 0, network_in: 0, network_out: 0, cpu_credit_usage: 0, cpu_credit_balance: 0 });

        const count = allHistory.length;
        return {
            cpu: total.cpu / count,
            network_in: total.network_in / count,
            network_out: total.network_out / count,
            cpu_credit_usage: total.cpu_credit_usage / count,
            cpu_credit_balance: total.cpu_credit_balance / count,
        };
    }, [allHistory]);

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

    const sortedMetricDetail = efficiency.metrics_detail.sort((a, b) => (b.metric === "CPUUtilization") - (a.metric === "CPUUtilization"));

    return (
        <div className="space-y-6">
            {/* FILA 1: Eficiencia Global */}
            {efficiency && (
                <StatCard
                    title="Eficiencia Global"
                    value={`${efficiency.global_efficiency}`}
                    description={`Promedio ponderado de eficiencia de CPU basado en ${efficiency.metrics_detail[0].samples} muestras.`}
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
                    value={`$ ${formatGeneric(costoTotal)}`}
                    unit="USD"
                    description="Costo total de todas las instancias en el período."
                    icon={DollarSign}
                    colorClass="green"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title="Promedio CPU"
                    value={formatGeneric(metricas.cpu)}
                    unit="%"
                    description="Uso promedio de CPU en el período."
                    icon={Cpu}
                    colorClass="blue"
                />
                <StatCard
                    title="Promedio Créditos CPU Usados"
                    value={formatGeneric(metricas.cpu_credit_usage)}
                    unit="Créditos"
                    description="Promedio de créditos CPU consumidos."
                    icon={Cpu}
                    colorClass="amber"
                />
                <StatCard
                    title="Promedio Créditos CPU Disponibles"
                    value={formatGeneric(metricas.cpu_credit_balance)}
                    unit="Créditos"
                    description="Promedio de créditos CPU disponibles."
                    icon={Cpu}
                    colorClass="amber"
                />
                <StatCard
                    title="Promedio Entrada/Salida de Red"
                    value={`${formatBytes(metricas.network_in)} / ${formatBytes(metricas.network_out)}`}
                    unit="B/s"
                    description="Tasa promedio de tráfico de red."
                    icon={Network}
                    colorClass="purple"
                    large={false}
                />

            </div>
        </div>
    );
};