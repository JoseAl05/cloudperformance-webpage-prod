'use client'

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Database, DollarSign, AlertTriangle, TrendingDown, Zap, Cpu, Network, HardDrive, MemoryStick, LucideIcon, CheckCheck, Plug, X, Workflow, ArrowUpRight, ArrowDownLeft, ArrowUpDown } from 'lucide-react';
import { ConsumeViewEc2GlobalEfficiency, ConsumeViewEc2InfoInstances, ConsumeViewEc2InfoInstancesHistory } from '@/interfaces/vista-consumos/ec2ConsumeViewInterfaces';
import { formatBytes, formatGeneric } from '@/lib/bytesToMbs';
import { NatGatewayConsumeGlobalEfficiency, NatGatewayConsumeInfoInstances, NatGatewayConsumeInfoInstancesHistory } from '@/interfaces/vista-consumos/natGwConsumeViewInterfaces';

interface NatGatewaysConsumeCardsComponentProps {
    summary: {
        total_nat_gateways: number;
        nat_gateways_idle: number;
        nat_gateways_infrautilizadas: number;
    };
    instancias: NatGatewayConsumeInfoInstances[];
    efficiency: NatGatewayConsumeGlobalEfficiency;
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

// --- HELPER: Configuración visual según el nombre de la métrica ---
const getMetricConfig = (metricName: string) => {
    const name = metricName.toLowerCase();

    if (name.includes('activeconnectioncount')) {
        return { icon: Plug, color: 'blue', label: 'Conexiones Activas' };
    }
    if (name.includes('bytesinfromsource')) {
        return { icon: ArrowUpRight, color: 'blue', label: 'Datos Enviados a Internet' };
    }
    if (name.includes('bytesouttosource')) {
        return { icon: ArrowDownLeft, color: 'green', label: 'Datos Recibidos desde Internet' };
    }
    if (name.includes('errorportallocation')) {
        return { icon: X, color: 'red', label: 'Error de asignación de puertos' };
    }

    // Default
    return { icon: Activity, color: 'slate', label: metricName.replace(/_/g, ' ') };
};

const getEfficiencyColor = (score: number): string => {
    if (score === "Infrautilizado") return "red";
    if (score === "Uso Bajo") return "amber";
    return "green";
};

export const NatGatewaysConsumeCardsComponent = ({
    summary,
    instancias,
    efficiency,
    isLoading
}: NatGatewaysConsumeCardsComponentProps) => {
    const allHistory = useMemo<NatGatewayConsumeInfoInstancesHistory[]>(() => {
        if (!instancias?.length) return [];
        return instancias.flatMap(inst => inst.history);
    }, [instancias]);

    const costoTotal = useMemo(() => {
        return allHistory.reduce((sum, h) => sum + (h.costo_usd || 0), 0);
    }, [allHistory]);

    const metricas = useMemo(() => {
        if (!allHistory.length) return { active_connections: 0, bytes_in: 0, bytes_out: 0, error_port_allocation: 0 };

        const total = allHistory.reduce((acc, h) => ({
            active_connections: acc.active_connections + (h.avg_active_connections || 0),
            bytes_in: acc.bytes_in + (h.avg_bytes_in || 0),
            bytes_out: acc.bytes_out + (h.avg_bytes_out || 0),
            error_port_allocation: acc.error_port_allocation + (h.avg_error_port_allocation || 0),
        }), { active_connections: 0, bytes_in: 0, bytes_out: 0, error_port_allocation: 0 });

        const count = allHistory.length;
        return {
            active_connections: total.active_connections / count,
            bytes_in: total.bytes_in / count,
            bytes_out: total.bytes_out / count,
            error_port_allocation: total.error_port_allocation / count,
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

    const sortedMetricDetail = efficiency.metrics_detail.sort((a, b) => (b.metric === "ActiveConnectionCount") - (a.metric === "ActiveConnectionCount"));

    return (
        <div className="space-y-6">
            {efficiency && (
                <StatCard
                    title="Eficiencia Global"
                    value={`${efficiency.global_efficiency}`}
                    description={`Promedio ponderado de eficiencia de cantidad de datos de red enviados a VPC basado en ${efficiency.metrics_detail[0].samples} muestras.`}
                    icon={Zap}
                    colorClass={getEfficiencyColor(efficiency.global_efficiency_score)}
                    large
                />
            )}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total Nat Gateways"
                    value={summary.total_nat_gateways}
                    unit="Nat Gateways"
                    description="Total de Nat Gateways."
                    icon={Workflow}
                    colorClass="blue"
                />
                <StatCard
                    title="Nat Gateways Idle"
                    value={summary.nat_gateways_idle}
                    unit="sin uso"
                    description="Nat Gateways sin actividad."
                    icon={Activity}
                    colorClass="red"
                />
                <StatCard
                    title="Infrautilizadas"
                    value={summary.nat_gateways_infrautilizadas}
                    unit="recursos"
                    description="Con sobre-provisionamiento de recursos."
                    icon={TrendingDown}
                    colorClass="amber"
                />
                <StatCard
                    title="Costo Total"
                    value={`$ ${formatGeneric(costoTotal)}`}
                    unit="USD"
                    description="Costo total de todos los Nat Gateways en el período."
                    icon={DollarSign}
                    colorClass="green"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title="Promedio Conexiones Activas"
                    value={formatGeneric(metricas.active_connections)}
                    unit="Conexiones"
                    description="Conexiones activas promedio en el período."
                    icon={Plug}
                    colorClass="blue"
                />
                <StatCard
                    title="Promedio de Datos Enviados a Internet / Datos Entregados al Destino"
                    value={`${formatBytes(metricas.bytes_in)} / ${formatBytes(metricas.bytes_out)}`}
                    unit="B/s"
                    description="Flujo promedio de red de Nat Gateways"
                    icon={ArrowUpDown}
                    colorClass="purple"
                    large={false}
                />

            </div>
        </div>
    );
};