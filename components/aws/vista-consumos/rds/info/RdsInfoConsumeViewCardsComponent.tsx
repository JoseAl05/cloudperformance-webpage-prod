'use client'

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Database, DollarSign, TrendingDown, Zap, Cpu, Network, HardDrive, MemoryStick } from 'lucide-react';
import { RdsConsumeViewEfficiencyData, RdsConsumeViewInfoInstances, RdsConsumeViewInfoInstanceHistory } from '@/interfaces/vista-consumos/rdsConsumeViewInterfaces';
import { formatBytes, formatGeneric } from '@/lib/bytesToMbs';

interface RdsResumen {
    total_instancias: number;
    instancias_idle: number;
    instancias_infrautilizadas: number;
    instancias_almacenamiento_ineficiente: number;
}

interface RdsInfoConsumeViewCardsComponentProps {
    summary?: RdsResumen;
    instancias?: RdsConsumeViewInfoInstances[] | null;
    efficiency?: RdsConsumeViewEfficiencyData | null;
    isLoading: boolean;
}

const StatCard = ({
    title,
    value,
    unit,
    icon: Icon,
    description,
    colorClass = "blue",
    subtitle,
    large = false
}: unknown) => {

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
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}

const getEfficiencyColor = (score: number): string => {
    if (score === "Infrautilizado") return "red";
    if (score === "Uso Bajo") return "amber";
    return "green";
};

export const RdsInfoConsumeViewCardsComponent = ({
    summary,
    instancias = [],
    efficiency,
    isLoading
}: RdsInfoConsumeViewCardsComponentProps) => {

    const allHistory = useMemo<RdsConsumeViewInfoInstanceHistory[]>(() => {
        if (!instancias?.length) return [];
        return instancias.flatMap(inst => inst.history);
    }, [instancias]);

    const costoTotal = useMemo(() => {
        return allHistory.reduce((sum, h) => sum + (h.costo_total_usd || 0), 0);
    }, [allHistory]);

    const metricas = useMemo(() => {
        if (!allHistory.length) return { cpu: 0, conexiones: 0, storage_free: 0, strg_pct_used: 0, memory_free: 0 };

        const total = allHistory.reduce((acc, h) => ({
            cpu: acc.cpu + (h.avg_cpu_utilization || 0),
            conexiones: acc.conexiones + (h.avg_connections || 0),
            storage_free: acc.storage_free + (h.avg_storage_free || 0),
            strg_pct_used: acc.strg_pct_used + (h.strg_pct_used || 0),
            strg_pct_free: acc.strg_pct_free + (h.strg_pct_free || 0),
            memory_free: acc.memory_free + (h.avg_memory_free || 0),
        }), { cpu: 0, conexiones: 0, storage_free: 0, strg_pct_used: 0,strg_pct_free:0, memory_free: 0 });

        const count = allHistory.length;
        const cpuCount = allHistory.filter(h => h.avg_cpu_utilization !== 0).length;
        return {
            cpu: total.cpu / count,
            conexiones: total.conexiones / count,
            storage_free: total.storage_free / count,
            strg_pct_used: total.strg_pct_used / count,
            strg_pct_free: total.strg_pct_free / count,
            memory_free: total.memory_free / count,
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
                    description={`Promedio ponderado de eficiencia de CPU basado en ${efficiency.metrics_detail[0].samples} muestras.`}
                    icon={Zap}
                    colorClass={getEfficiencyColor(efficiency.global_efficiency)}
                    large
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total Instancias"
                    value={summary.total_instancias}
                    unit="BD"
                    description="Total de instancias RDS monitoreadas."
                    icon={Database}
                    colorClass="blue"
                />
                <StatCard
                    title="Instancias Idle"
                    value={summary.instancias_idle}
                    unit="sin uso"
                    description="Instancias sin conexiones activas promedio."
                    icon={Activity}
                    colorClass="red"
                />
                <StatCard
                    title="Infrautilizadas"
                    value={summary.instancias_infrautilizadas}
                    unit="recursos"
                    description="CPU promedio < 5% y máximo < 15%."
                    icon={TrendingDown}
                    colorClass="amber"
                />
                <StatCard
                    title="Costo Total"
                    value={`$${formatGeneric(costoTotal)}`}
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
                    title="Promedio Conexiones"
                    value={formatGeneric(metricas.conexiones)}
                    unit="conn"
                    description="Conexiones activas promedio."
                    icon={Network}
                    colorClass="purple"
                />
                <StatCard
                    title="Storage Libre"
                    value={formatGeneric(metricas.strg_pct_free)}
                    unit="%"
                    description="Porcentaje promedio de almacenamiento usado."
                    icon={HardDrive}
                    colorClass="amber"
                />
                <StatCard
                    title="Storage Utilizado"
                    value={formatGeneric(metricas.strg_pct_used)}
                    unit="%"
                    description="Porcentaje promedio de almacenamiento usado."
                    icon={HardDrive}
                    colorClass="amber"
                />
                <StatCard
                    title="Promedio Memoria Libre"
                    value={formatBytes(metricas.memory_free)}
                    unit=""
                    description="Memoria libre promedio en el período."
                    icon={MemoryStick}
                    colorClass="green"
                />
            </div>
        </div>
    );
};