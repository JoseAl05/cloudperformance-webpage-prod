'use client'

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HardDrive, Database, FileText, DollarSign } from 'lucide-react';

interface StorageResumen {
    total_buckets: number;
    total_size_gb: number;
    total_objects: number;
    costo_total_usd: number;
    ahorro_potencial_total: number;
    currency: string;
}

interface TopStorageBucketsCardsProps {
    summary?: StorageResumen;
    buckets?: unknown[];
    isLoading: boolean;
}

const StatCard = ({
    title,
    value,
    unit,
    icon: Icon,
    description,
    colorClass = "blue"
}: unknown) => {

    const colorStyles = {
        blue: { border: "border-l-blue-500", bgIcon: "bg-blue-100 text-blue-600" },
        green: { border: "border-l-green-500", bgIcon: "bg-green-100 text-green-600" },
        purple: { border: "border-l-purple-500", bgIcon: "bg-purple-100 text-purple-600" },
        amber: { border: "border-l-amber-500", bgIcon: "bg-amber-100 text-amber-600" },
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
                    </div>
                    <div className={`p-3 rounded-xl ${style.bgIcon}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}

export const TopStorageBucketsCardsComponent = ({
    summary,
    buckets = [],
    isLoading
}: TopStorageBucketsCardsProps) => {

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-40 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-slate-200"></div>
                ))}
            </div>
        );
    }

    if (!summary) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 1. TAMAÑO TOTAL */}
            <StatCard
                title="Tamaño Total"
                value={(summary.total_size_gb || 0).toFixed(2)}
                unit="GB"
                description="Espacio ocupado en Cloud Storage."
                icon={HardDrive}
                colorClass="blue"
            />

            {/* 2. TOTAL BUCKETS - Quitamos cualquier espacio extra */}
            <StatCard
                title="Total Buckets"
                value={Number(summary.total_buckets)}
                unit="" // Forzamos unit vacío para evitar el "22"
                description="Buckets únicos monitoreados."
                icon={Database}
                colorClass="purple"
            />

            {/* 3. TOTAL OBJETOS */}
            <StatCard
                title="Total Objetos"
                value={(summary.total_objects || 0).toLocaleString('es-ES')}
                description="Archivos almacenados en total."
                icon={FileText}
                colorClass="amber"
            />

            {/* 4. COSTO TOTAL - Usando el costo_total_usd del JSON */}
            <StatCard
                title="Costo Total"
                value={`$${(summary.costo_total_usd || 0).toFixed(8)}`} // Subimos a 8 decimales por tu JSON
                unit="USD"
                description="Costo mensual estimado."
                icon={DollarSign}
                colorClass="green"
            />
        </div>
    );
};