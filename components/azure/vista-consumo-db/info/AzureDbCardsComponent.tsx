'use client'

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Database, DollarSign, AlertTriangle, TrendingDown, Zap, Cpu, HardDrive, MemoryStick, LucideIcon } from 'lucide-react';

interface AzureDbResumen {
    total_instancias: number;
    instancias_idle: number;
    instancias_infrautilizadas: number;
    instancias_almacenamiento_ineficiente: number;
    costo_total_usd: number;
    currency: string;
    tiene_billing: boolean;
}

interface InstanciaDb {
    tiene_billing: boolean;
    costo_total_usd: number;
    avg_cpu_utilization: number;
    storage_utilization_pct: number;
    avg_memory_utilization: number;
}

interface EfficiencyData {
    global_efficiency_score: number;
    metrics_detail: Array<{
        metric: string;
        avg_utilization: number;
        max_utilization: number;
        min_utilization: number;
        efficiency_score: number;
    }>;
    interpretation: string;
}

interface AzureDbCardsProps {
    summary?: AzureDbResumen;
    instancias?: InstanciaDb[];
    efficiency?: EfficiencyData;
    isLoading: boolean;
}

interface StatCardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon: LucideIcon;
    description?: string | null;
    colorClass?: string;
    warning?: boolean;
    subtitle?: string;
    large?: boolean;
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
}: StatCardProps) => {

    const colorStyles = {
        blue: { border: "border-l-blue-500", bgIcon: "bg-blue-100 text-blue-600" },
        amber: { border: "border-l-amber-500", bgIcon: "bg-amber-100 text-amber-600" },
        green: { border: "border-l-green-500", bgIcon: "bg-green-100 text-green-600" },
        red: { border: "border-l-red-500", bgIcon: "bg-red-100 text-red-600" },
        purple: { border: "border-l-purple-500", bgIcon: "bg-purple-100 text-purple-600" },
    };

    const style = colorStyles[colorClass as keyof typeof colorStyles] || colorStyles.blue;

    return (
        <Card className={`border-l-4 shadow-sm ${style.border}`}>
            <CardContent className={large ? "p-8" : "p-6"}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
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
                                <p className="text-[10px] mt-0.5">La API no reportó costos para estos recursos</p>
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

const getEfficiencyColor = (score: number): string => {
    if (score >= 70) return "green";
    if (score >= 40) return "amber";
    return "red";
};

export const AzureDbCardsComponent = ({
    summary,
    instancias = [],
    efficiency,
    isLoading
}: AzureDbCardsProps) => {

    const sinBilling = useMemo(() => {
        return instancias.some(i => i.tiene_billing === false);
    }, [instancias]);

    const costoDescripcion = useMemo(() => {
        if (sinBilling) return null;
        if (summary?.costo_total_usd === 0) return "Bases de datos sin costo reportado.";
        return "Costo mensual total (Azure Billing).";
    }, [sinBilling, summary?.costo_total_usd]);

    const metricas = useMemo(() => {
        if (!instancias.length) return { cpu: 0, storage: 0, memoria: 0 };

        const total = instancias.reduce((acc, inst) => ({
            cpu: acc.cpu + (inst.avg_cpu_utilization || 0),
            storage: acc.storage + (inst.storage_utilization_pct || 0),
            memoria: acc.memoria + (inst.avg_memory_utilization || 0),
        }), { cpu: 0, storage: 0, memoria: 0 });

        return {
            cpu: total.cpu / instancias.length,
            storage: total.storage / instancias.length,
            memoria: total.memoria / instancias.length,
        };
    }, [instancias]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
                    {[1, 2, 3, 4].map((i) => <div key={i} className="h-40 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>)}
                </div>
                <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
            </div>
        );
    }

    if (!summary) return null;

    return (
        <div className="space-y-6">
            {efficiency && (
                <StatCard
                    title="Eficiencia Global"
                    value={`${efficiency.global_efficiency_score.toFixed(1)}%`}
                    subtitle={efficiency.interpretation}
                    description="Promedio ponderado de eficiencia de recursos en Azure."
                    icon={Zap}
                    colorClass={getEfficiencyColor(efficiency.global_efficiency_score)}
                    large
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Instancias" value={summary.total_instancias} unit="BD" description="Total de bases de datos Azure." icon={Database} colorClass="blue" />
                <StatCard title="Instancias Idle" value={summary.instancias_idle} unit="sin uso" description="BDs con CPU muy bajo." icon={Activity} colorClass="red" />
                <StatCard title="Infrautilizadas" value={summary.instancias_infrautilizadas} unit="recursos" description="CPU promedio inferior al 10%." icon={TrendingDown} colorClass="amber" />
                <StatCard title="Costo Total" value={`$${summary.costo_total_usd.toFixed(2)}`} unit="USD/mes" description={costoDescripcion} icon={DollarSign} colorClass="green" warning={sinBilling} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Promedio CPU" value={metricas.cpu.toFixed(2)} unit="%" description="Uso promedio de CPU." icon={Cpu} colorClass="blue" />
                <StatCard title="Storage Utilizado" value={metricas.storage.toFixed(1)} unit="%" description="Almacenamiento promedio usado." icon={HardDrive} colorClass="amber" />
                <StatCard title="Promedio Memoria" value={metricas.memoria.toFixed(2)} unit="%" description="Uso promedio de memoria." icon={MemoryStick} colorClass="green" />
            </div>
        </div>
    );
};