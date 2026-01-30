'use client'

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Server, Zap, TrendingDown, AlertTriangle } from 'lucide-react';

interface SpotResumen {
    total_vms: number;
    vms_standard: number;
    vms_spot: number;
    vms_preemptible: number;
    costo_total_standard: number;
    costo_total_spot: number;
    ahorro_potencial_total: number;
    candidatas_spot: number;
    precio_mensual_standard_total: number;
    precio_mensual_spot_total: number;
    currency: string;
}

interface VM {
    tiene_billing: boolean;
    cost_in_usd: number;
}

interface SpotVsStandardCardsProps {
    summary?: SpotResumen;
    vms?: VM[];
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
    subtitle
}: unknown) => {

    const colorStyles = {
        blue: { border: "border-l-blue-500", bgIcon: "bg-blue-100 text-blue-600" },
        purple: { border: "border-l-purple-500", bgIcon: "bg-purple-100 text-purple-600" },
        green: { border: "border-l-green-500", bgIcon: "bg-green-100 text-green-600" },
    };

    const style = colorStyles[colorClass as keyof typeof colorStyles] || colorStyles.blue;

    return (
        <Card className={`border-l-4 shadow-sm ${style.border}`}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <h4 className="text-3xl font-bold tracking-tight">
                            {value} {unit && <span className="text-sm font-normal text-slate-400">{unit}</span>}
                        </h4>
                        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
                    </div>
                    <div className={`p-3 rounded-xl ${style.bgIcon}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
                <div className="space-y-2">
                    {warning ? (
                        <div className="flex items-start gap-2 text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold">Datos de facturación en proceso</p>
                                <p className="text-[10px] mt-0.5">VMs recientes (24-48h de lag). Los costos aparecerán próximamente.</p>
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

export const SpotVsStandardCardsComponent = ({
    summary,
    vms = [],
    isLoading
}: SpotVsStandardCardsProps) => {

    const porcentajeSpot = useMemo(() => {
        if (!summary || summary.total_vms === 0) return 0;
        const spotTotal = (summary.vms_spot || 0) + (summary.vms_preemptible || 0);
        return (spotTotal / summary.total_vms) * 100;
    }, [summary]);

    const ahorroDescripcion = useMemo(() => {
        if (summary?.ahorro_potencial_total === 0) return "No hay oportunidades de ahorro identificadas.";
        return "Ahorro mensual estimado convirtiendo VMs Standard en Spot/Preemptible.";
    }, [summary]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-40 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-slate-200"></div>
                ))}
            </div>
        );
    }

    if (!summary) return null;

    const spotTotal = (summary.vms_spot || 0) + (summary.vms_preemptible || 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
                title="Total VMs"
                value={summary.total_vms}
                subtitle={`${summary.vms_standard} Standard | ${spotTotal} Spot/Preemptible`}
                description="Total de VMs monitoreadas en el período."
                icon={Server}
                colorClass="blue"
            />
            <StatCard
                title="% Spot VMs"
                value={porcentajeSpot.toFixed(1)}
                unit="%"
                description="Porcentaje de VMs optimizadas con Spot/Preemptible."
                icon={Zap}
                colorClass="purple"
            />
            <StatCard
                title="Costo Estimado Total"
                value={`$${(summary.precio_mensual_standard_total || 0).toFixed(2)}`}
                unit="USD/mes"
                description="Costo mensual estimado con configuración actual (Standard + Spot)."
                icon={Server}
                colorClass="blue"
            />
            <StatCard
                title="Ahorro Potencial"
                value={`$${(summary.ahorro_potencial_total || 0).toFixed(2)}`}
                unit="USD/mes"
                subtitle={summary.candidatas_spot > 0 ? `Migrando ${summary.candidatas_spot} candidatas a Spot` : undefined}
                description="Ahorro mensual estimado convirtiendo VMs Standard en Spot/Preemptible."
                icon={TrendingDown}
                colorClass="green"
            />
        </div>
    );
};