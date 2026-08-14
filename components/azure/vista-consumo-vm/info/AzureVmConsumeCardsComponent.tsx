'use client'

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Database, DollarSign, AlertTriangle, TrendingDown, Zap, Cpu, HardDrive, MemoryStick, LucideIcon } from 'lucide-react';

interface AzureVmResumen {
    total_instancias: number;
    instancias_idle: number;
    instancias_infrautilizadas: number;
    costo_total_usd: number;
    currency: string;
    tiene_billing: boolean;
}

interface AzureEfficiencyData {
    global_efficiency_score: number;
    metrics_detail: Array<{
        metric: string;
        avg_utilization: number;
        max_utilization: number;
        min_utilization: number;
        efficiency_score: number | null;
        samples: number;
    }>;
    interpretation: string;
}

interface AzureVmCardsProps {
    summary?: AzureVmResumen;
    efficiency?: AzureEfficiencyData;
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
        cyan: { border: "border-l-cyan-500", bgIcon: "bg-cyan-100 text-cyan-600" },
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
                                <p className="text-[10px] mt-0.5">La API de Azure no retornó costos para esta suscripción.</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground">{description}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const getMetricConfig = (metricName: string) => {
    const name = metricName.toLowerCase();

    if (name.includes('cpu')) {
        return { icon: Cpu, color: 'blue', label: 'CPU Usado' };
    }
    if (name.includes('memory') || name.includes('memoria')) {
        return { icon: MemoryStick, color: 'purple', label: 'Memoria Usada' };
    }
    if (name.includes('disk') || name.includes('iops')) {
        return { icon: HardDrive, color: 'cyan', label: 'Disco IOPS' };
    }
    
    return { icon: Activity, color: 'slate', label: metricName };
};

const getEfficiencyColor = (score: number): string => {
    if (score >= 70) return "green";
    if (score >= 40) return "amber";
    return "red";
};

export const AzureVmConsumeCardsComponent = ({
    summary,
    efficiency,
    isLoading
}: AzureVmCardsProps) => {

    const costoDescripcion = useMemo(() => {
        if (!summary?.tiene_billing) return null;
        if (summary?.costo_total_usd === 0) return "Instancias sin costo asociado detectado.";
        return "Costo mensual total estimado (Azure Billing).";
    }, [summary?.costo_total_usd, summary?.tiene_billing]);

    if (isLoading) {
        return (
            <div className="space-y-4 w-full min-w-0">
                <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse w-full"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse w-full">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-40 bg-slate-100 dark:bg-slate-800 rounded-lg w-full"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!summary) return null;

    return (
        <div className="space-y-6 w-full min-w-0">
            {efficiency && (
                <StatCard
                    title="Eficiencia Global"
                    value={`${efficiency.global_efficiency_score.toFixed(1)}%`}
                    subtitle={efficiency.interpretation}
                    description="Puntaje unificado de uso de CPU y recursos."
                    icon={Zap}
                    colorClass={getEfficiencyColor(efficiency.global_efficiency_score)}
                    large
                />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full min-w-0">
                <StatCard
                    title="Total VMs"
                    value={summary.total_instancias}
                    unit="Instancias"
                    description="Total de Máquinas Virtuales analizadas."
                    icon={Database}
                    colorClass="blue"
                />
                <StatCard
                    title="VMs Idle / Detenidas"
                    value={summary.instancias_idle}
                    unit="sin uso"
                    description="VMs con CPU < 4% o apagadas."
                    icon={Activity}
                    colorClass="red"
                />
                <StatCard
                    title="Infrautilizadas"
                    value={summary.instancias_infrautilizadas}
                    unit="recursos"
                    description="VMs con uso de CPU < 10%."
                    icon={TrendingDown}
                    colorClass="amber"
                />
                <StatCard
                    title="Costo Estimado"
                    value={`$${summary.costo_total_usd.toFixed(2)}`}
                    unit="USD/mes"
                    description={costoDescripcion ?? ''}
                    icon={DollarSign}
                    colorClass="green"
                    warning={!summary.tiene_billing}
                />
            </div>

            {efficiency?.metrics_detail && efficiency.metrics_detail.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full min-w-0">
                    {efficiency.metrics_detail.map((metricDetail, index) => {
                        const config = getMetricConfig(metricDetail.metric);
                        const isCpu = metricDetail.metric.includes('CPU');
                        
                        return (
                            <StatCard
                                key={`${metricDetail.metric}-${index}`}
                                title={config.label}
                                value={metricDetail.avg_utilization.toFixed(2)}
                                unit={isCpu ? "%" : ""}
                                description={`Máx observado: ${metricDetail.max_utilization.toFixed(1)}`}
                                subtitle={metricDetail.efficiency_score ? `Score Eficiencia: ${metricDetail.efficiency_score.toFixed(0)}/100` : undefined}
                                icon={config.icon}
                                colorClass={config.color}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};