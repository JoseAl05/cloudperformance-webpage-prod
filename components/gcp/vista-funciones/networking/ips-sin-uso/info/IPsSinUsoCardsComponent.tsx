'use client'

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Network, AlertTriangle, DollarSign, Clock } from 'lucide-react';

interface IPsResumen {
    total_ips_sin_uso: number;
    ips_orphaned: number;
    costo_total_periodo_usd: number;
    costo_mensual_estimado_total: number;
    ahorro_potencial_total_usd: number;
    currency: string;
}

interface IPsSinUsoCardsProps {
    summary?: IPsResumen;
    ips?: any[];
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

export const IPsSinUsoCardsComponent = ({ summary, ips = [], isLoading }: IPsSinUsoCardsProps) => {

    const diasPromedio = useMemo(() => {
        if (!ips.length) return 0;
        const total = ips.reduce((acc, ip) => acc + (ip.dias_reservada || 0), 0);
        return (total / ips.length).toFixed(1);
    }, [ips]);

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
                title="IPs sin Uso"
                value={summary.total_ips_sin_uso}
                subtitle={`${summary.ips_orphaned} orphaned (sin recurso asociado)`}
                description="IPs externas reservadas sin ningún recurso activo."
                icon={Network}
                colorClass="orange"
            />
            <StatCard
                title="Días Promedio Reservadas"
                value={diasPromedio}
                unit="días"
                description="Tiempo promedio que llevan reservadas sin uso."
                icon={Clock}
                colorClass="red"
            />
            <StatCard
                title="Costo Total Período"
                value={`$${summary.costo_total_periodo_usd.toFixed(4)}`}
                unit="USD"
                description="Costo acumulado de IPs sin uso en el período seleccionado."
                icon={DollarSign}
                colorClass="blue"
            />
            <StatCard
                title="Ahorro Potencial"
                value={`$${summary.ahorro_potencial_total_usd.toFixed(4)}`}
                unit="USD/mes"
                description="Ahorro mensual estimado liberando todas las IPs sin uso."
                icon={AlertTriangle}
                colorClass="green"
            />
        </div>
    );
};