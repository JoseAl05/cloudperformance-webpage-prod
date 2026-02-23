'use client'

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, AlertTriangle, DollarSign, TrendingDown } from 'lucide-react';

interface LoadBalancersResumen {
    total_load_balancers: number;
    con_trafico: number;
    sin_trafico: number;
    requests_totales: number;
    costo_total_usd: number;
    ahorro_potencial_total_usd: number;
}

interface LoadBalancersCardsProps {
    summary?: LoadBalancersResumen;
    loadBalancers?: any[];
    isLoading: boolean;
}

const StatCard = ({ title, value, unit, icon: Icon, description, subtitle, colorClass = "blue" }: any) => {
    const colorStyles: Record<string, { border: string; bgIcon: string }> = {
        blue:   { border: "border-l-blue-500",   bgIcon: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
        green:  { border: "border-l-green-500",  bgIcon: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
        orange: { border: "border-l-orange-500", bgIcon: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
        red:    { border: "border-l-red-500",    bgIcon: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
    };
    const style = colorStyles[colorClass] || colorStyles.blue;

    return (
        <Card className={`border-l-4 shadow-sm ${style.border}`}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <h4 className="text-3xl font-bold tracking-tight">
                            {value}{unit && <span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>}
                        </h4>
                        {subtitle && (
                            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                        )}
                    </div>
                    <div className={`p-3 rounded-xl ${style.bgIcon}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
};

export const LoadBalancersCardsComponent = ({ summary, loadBalancers = [], isLoading }: LoadBalancersCardsProps) => {

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-40 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-slate-200" />
                ))}
            </div>
        );
    }

    if (!summary) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
                title="Total Load Balancers"
                value={summary.total_load_balancers}
                subtitle={`${summary.con_trafico} activos | ${summary.sin_trafico} zombies`}
                description="Load balancers totales monitoreados en el proyecto."
                icon={Activity}
                colorClass="blue"
            />
            <StatCard
                title="Tráfico Procesado"
                value={summary.requests_totales.toLocaleString('es-ES')}
                unit="requests"
                subtitle="Requests totales procesados"
                description="Volumen de tráfico gestionado por todos los load balancers."
                icon={Activity}
                colorClass="green"
            />
            <StatCard
                title="Zombies / Sin Tráfico"
                value={summary.sin_trafico}
                subtitle="Load balancers sin uso"
                description="LBs configurados pero sin procesar tráfico real."
                icon={AlertTriangle}
                colorClass={summary.sin_trafico > 0 ? "orange" : "green"}
            />
            <StatCard
                title="Ahorro Potencial"
                value={`$${summary.ahorro_potencial_total_usd.toFixed(2)}`}
                unit="USD/mes"
                subtitle="Limpieza recomendada por Higiene de Red y SecOps"
                description="Ahorro mensual eliminando load balancers sin tráfico."
                icon={TrendingDown}
                colorClass={summary.ahorro_potencial_total_usd > 0 ? "green" : "blue"}
            />
        </div>
    );
};