'use client'

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HardDrive, Database, CircleDollarSign, AlertTriangle } from 'lucide-react';

interface DiscosResumen {
    total_discos: number;
    discos_en_uso: number;
    discos_sin_uso: number;
    tamano_total_gb: number;
    tamano_sin_uso_gb: number;
    costo_total: number;
    costo_total_usd: number;
    currency: string;
}

interface Disco {
    tiene_billing: boolean;
    cost_in_usd: number;
}

interface DiscosPersistentesCardsProps {
    summary?: DiscosResumen;
    discos?: Disco[];
    isLoading: boolean;
}

const StatCard = ({ title, value, unit, icon: Icon, description, colorClass = "blue", warning = false }: any) => {
    
    const colorStyles = {
        blue:  { border: "border-l-blue-500",   bgIcon: "bg-blue-100 text-blue-600" },
        amber: { border: "border-l-amber-500",  bgIcon: "bg-amber-100 text-amber-600" },
        green: { border: "border-l-green-500",  bgIcon: "bg-green-100 text-green-600" },
    };

    const style = colorStyles[colorClass as keyof typeof colorStyles] || colorStyles.blue;

    return (
        <Card className={`border-l-4 shadow-sm ${style.border}`}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <h4 className="text-3xl font-bold tracking-tight">
                            {value} {unit && <span className="text-sm font-normal text-slate-400">{unit}</span>}
                        </h4>
                    </div>
                    <div className={`p-3 rounded-xl ${style.bgIcon}`}>
                        <Icon className="w-6 h-6" />
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

export const DiscosPersistentesCardsComponent = ({ summary, discos = [], isLoading }: DiscosPersistentesCardsProps) => {

    // Detectar si hay discos sin billing
    const sinBilling = useMemo(() => {
        return discos.some(d => d.tiene_billing === false);
    }, [discos]);

    // Determinar descripción del costo
    const costoDescripcion = useMemo(() => {
        if (sinBilling) return null; // Mostrará warning
        if (summary?.costo_total_usd === 0) return "Discos en Free Tier de GCP.";
        return "Costo mensual estimado eliminando estos discos.";
    }, [sinBilling, summary?.costo_total_usd]);

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

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
                title="Discos Sin Uso"
                value={summary.discos_sin_uso}
                unit="Volúmenes"
                description="Total de discos 'READY' sin instancias adjuntas."
                icon={HardDrive}
                colorClass="blue"
            />
            <StatCard
                title="Espacio Desperdiciado"
                value={summary.tamano_sin_uso_gb}
                unit="GB"
                description="Suma total de almacenamiento sin utilizar."
                icon={Database}
                colorClass="amber"
            />
            <StatCard
                title="Ahorro Estimado"
                value={`$${summary.costo_total_usd.toFixed(2)}`}
                unit="USD/mes"
                description={costoDescripcion}
                icon={CircleDollarSign}
                colorClass="green"
                warning={sinBilling}
            />
        </div>
    );
};