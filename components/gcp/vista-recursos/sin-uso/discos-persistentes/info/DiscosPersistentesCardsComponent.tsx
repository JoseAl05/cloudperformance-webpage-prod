'use client'

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HardDrive, Database, CircleDollarSign } from 'lucide-react';

// Interfaz exacta basada en tu JSON ("resumen")
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

interface DiscosPersistentesCardsProps {
    summary?: DiscosResumen; // Puede ser undefined mientras carga
    isLoading: boolean;
}

// Reutilizamos estilo AWS
const StatCard = ({ title, value, unit, icon: Icon, description, colorClass = "blue" }: any) => {
    
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
                            {value} <span className="text-sm font-normal text-slate-400">{unit}</span>
                        </h4>
                    </div>
                    <div className={`p-3 rounded-xl ${style.bgIcon}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
            </CardContent>
        </Card>
    )
}

export const DiscosPersistentesCardsComponent = ({ summary, isLoading }: DiscosPersistentesCardsProps) => {

    if (isLoading || !summary) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-40 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-slate-200"></div>
                ))}
            </div>
        );
    }

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
                description="Costo mensual estimado (Snapshot + Provisioning)."
                icon={CircleDollarSign}
                colorClass="green"
            />
        </div>
    );
};