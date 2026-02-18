'use client'

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Network, AlertTriangle, Globe, Shield } from 'lucide-react';

interface SubnetsResumen {
    total_subnets_sin_recursos: number;
    con_secondary_ranges: number;
    con_flow_logs_habilitados: number;
    por_network: Record<string, number>;
    por_region: Record<string, number>;
    por_purpose: Record<string, number>;
}

interface SubnetsSinRecursosCardsProps {
    summary?: SubnetsResumen;
    subnets?: any[];
    isLoading: boolean;
}

const StatCard = ({ title, value, unit, icon: Icon, description, subtitle, colorClass = "blue", warning = false }: any) => {
    const colorStyles: Record<string, { border: string; bgIcon: string }> = {
        blue:   { border: "border-l-blue-500",   bgIcon: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
        amber:  { border: "border-l-amber-500",  bgIcon: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
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
                {warning && (
                    <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded mb-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold">Red Default Detectada</p>
                            <p className="text-[10px] mt-0.5">Configuración insegura. Se recomienda usar VPC personalizada.</p>
                        </div>
                    </div>
                )}
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
};

export const SubnetsSinRecursosCardsComponent = ({ summary, subnets = [], isLoading }: SubnetsSinRecursosCardsProps) => {

    const calculatedData = useMemo(() => {
        if (!summary) return { ipsPrivadasBloqueadas: 0, regionesExpuestas: 0, esRedDefault: false };

        // Calcular IPs privadas bloqueadas (cada /20 tiene 4,096 IPs)
        const ipsPrivadasBloqueadas = summary.total_subnets_sin_recursos * 4096;
        
        // Contar regiones expuestas
        const regionesExpuestas = Object.keys(summary.por_region).length;
        
        // Detectar si usa red default
        const esRedDefault = summary.por_network.default > 0;

        return { ipsPrivadasBloqueadas, regionesExpuestas, esRedDefault };
    }, [summary]);

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
                title="Subnets Huérfanas"
                value={summary.total_subnets_sin_recursos}
                subtitle="Objetos lógicos sin tráfico"
                description="Subnets sin recursos asociados generando complejidad innecesaria."
                icon={Network}
                colorClass="amber"
            />
            <StatCard
                title="IPs Privadas Bloqueadas"
                value={calculatedData.ipsPrivadasBloqueadas.toLocaleString('es-ES')}
                subtitle="Capacidad bloqueada en /20 CIDRs"
                description="Direccionamiento IP reservado sin uso. Alto impacto en planificación de red."
                icon={AlertTriangle}
                colorClass="red"
            />
            <StatCard
                title="Regiones Expuestas"
                value={calculatedData.regionesExpuestas}
                unit="regiones"
                subtitle="Superficie de ataque innecesaria"
                description="Regiones con conectividad activa pero sin recursos productivos."
                icon={Globe}
                colorClass="orange"
            />
            <StatCard
                title="Configuración de Red"
                value={calculatedData.esRedDefault ? "DEFAULT" : "CUSTOM"}
                subtitle={calculatedData.esRedDefault ? "Configuración insegura" : "Configuración optimizada"}
                description="Estado de la arquitectura de red del proyecto."
                icon={Shield}
                colorClass={calculatedData.esRedDefault ? "red" : "blue"}
                warning={calculatedData.esRedDefault}
            />
        </div>
    );
};