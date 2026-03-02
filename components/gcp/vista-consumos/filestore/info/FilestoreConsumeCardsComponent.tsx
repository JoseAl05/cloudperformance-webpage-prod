'use client'

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Database, DollarSign, Activity, TrendingDown, Zap, HardDrive, Layers } from 'lucide-react';

interface FilestoreResumen {
    total_instancias: number;
    instancias_idle: number;
    instancias_infrautilizadas: number;
    capacidad_total_gb: number;
    costo_total_usd: number;
    costo_total_clp: number;
}

interface FilestoreCardsProps {
    summary?: FilestoreResumen;
    instancias?: unknown[];
    isLoading: boolean;
}

const StatCard = ({ title, value, unit, icon: Icon, description, colorClass = "blue", subtitle, large = false }: unknown) => {
    const colorStyles: unknown = {
        blue: { border: "border-l-blue-500", bgIcon: "bg-blue-100 text-blue-600" },
        amber: { border: "border-l-amber-500", bgIcon: "bg-amber-100 text-amber-600" },
        green: { border: "border-l-green-500", bgIcon: "bg-green-100 text-green-600" },
        red: { border: "border-l-red-500", bgIcon: "bg-red-100 text-red-600" },
        purple: { border: "border-l-purple-500", bgIcon: "bg-purple-100 text-purple-600" },
    };
    const style = colorStyles[colorClass] || colorStyles.blue;

    return (
        <Card className={`border-l-4 shadow-sm ${style.border}`}>
            <CardContent className={large ? "p-8" : "p-6"}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground capitalize">{title}</p>
                        <h4 className={`${large ? 'text-5xl' : 'text-3xl'} font-bold tracking-tight`}>
                            {value} <span className="text-sm font-normal text-slate-400">{unit}</span>
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
    );
};

export const FilestoreConsumeCardsComponent = ({ summary, instancias = [], isLoading }: FilestoreCardsProps) => {
    
    const derivedData = useMemo(() => {
        if (!instancias || instancias.length === 0) {
            return {
                conteoTotal: summary?.total_instancias || 0,
                totalCapacidad: summary?.capacidad_total_gb || 0,
                zombis: summary?.instancias_idle || 0,
                infra: summary?.instancias_infrautilizadas || 0,
                costoTotal: summary?.costo_total_usd || 0,
                eficiencia: 0
            };
        }

        // Cálculos dinámicos para evitar contradicciones con la tabla
        const totalCap = instancias.reduce((acc, curr) => acc + (Number(curr.total_capacity_gb) || 0), 0);
        const totalUsed = instancias.reduce((acc, curr) => acc + (Number(curr.used_capacity_gb) || 0), 0);
        
        return {
            conteoTotal: instancias.length,
            totalCapacidad: totalCap,
            zombis: instancias.filter(ins => ins.is_idle === true).length,
            infra: instancias.filter(ins => ins.is_underutilized === true).length,
            costoTotal: instancias.reduce((acc, curr) => acc + (Number(curr.costo_usd) || 0), 0),
            // Si la eficiencia es muy baja, forzamos al menos 2 decimales para que no se vea 0.0%
            eficiencia: totalCap > 0 ? (totalUsed / totalCap) * 100 : 0
        };
    }, [instancias, summary]);

    if (isLoading) return (
        <div className="space-y-4">
            <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-pulse">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-40 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>)}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <StatCard
                title="Eficiencia de Almacenamiento"
                value={derivedData.eficiencia < 0.1 && derivedData.eficiencia > 0 ? derivedData.eficiencia.toFixed(2) : derivedData.eficiencia.toFixed(1)}
                unit="%"
                subtitle={derivedData.eficiencia < 10 ? "Alerta: Capacidad desperdiciada" : "Uso de capacidad contratada"}
                description="Promedio de uso real vs capacidad aprovisionada en las instancias listadas."
                icon={Zap}
                colorClass={derivedData.eficiencia < 20 ? "red" : derivedData.eficiencia < 50 ? "amber" : "green"}
                large
            />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <StatCard
                    title="Total Filestores"
                    value={derivedData.conteoTotal}
                    unit="recursos"
                    description="Número total de sistemas de archivos detectados."
                    icon={Layers}
                    colorClass="purple"
                />
                <StatCard
                    title="Capacidad Total"
                    value={derivedData.totalCapacidad >= 1024 ? (derivedData.totalCapacidad/1024).toFixed(1) : derivedData.totalCapacidad}
                    unit={derivedData.totalCapacidad >= 1024 ? "TB" : "GB"}
                    description="Suma de toda la capacidad aprovisionada."
                    icon={HardDrive}
                    colorClass="blue"
                />
                <StatCard
                    title="Instancias Zombis"
                    value={derivedData.zombis}
                    unit="vms"
                    description="Sistemas con 0% de uso de capacidad."
                    icon={Activity}
                    colorClass="red"
                />
                <StatCard
                    title="Infrautilizadas"
                    value={derivedData.infra}
                    unit="recursos"
                    description="Uso menor al 10% de la capacidad."
                    icon={TrendingDown}
                    colorClass="amber"
                />
                <StatCard
                    title="Costo Acumulado"
                    value={`$${derivedData.costoTotal.toFixed(2)}`}
                    unit="USD"
                    description="Gasto total calculado de las instancias visibles."
                    icon={DollarSign}
                    colorClass="green"
                />
            </div>
        </div>
    );
};