'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Database, HardDrive, DollarSign, AlertTriangle } from 'lucide-react';

interface Resumen {
    total_filestores: number;
    sin_actividad: number;
    actividad_baja: number;
    en_uso: number;
    sin_metricas: number;
    capacidad_total_gb: number;
    capacidad_sin_actividad_gb: number;
    costo_total_usd: number;
    costo_sin_actividad_usd: number;
    ahorro_potencial_usd: number;
    currency: string;
}

interface FilestoreSinUsoCardsComponentProps {
    resumen: Resumen;
}

export const FilestoreSinUsoCardsComponent = ({
    resumen,
}: FilestoreSinUsoCardsComponentProps) => {
    if (!resumen) return null;

    const cards = [
        {
            title: 'Total Instancias',
            value: resumen.total_filestores,
            description: `${resumen.sin_metricas ?? 0} sin métricas disponibles`,
            icon: <Database className="h-5 w-5 text-blue-500" />,
            format: 'number',
        },
        {
            title: 'Sin Actividad (IOPS = 0)',
            value: resumen.sin_actividad,
            description: `${resumen.actividad_baja ?? 0} con actividad baja`,
            icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
            format: 'number',
            highlight: resumen.sin_actividad > 0,
        },
        {
            title: 'Capacidad Sin Actividad',
            value: resumen.capacidad_sin_actividad_gb,
            description: `de ${resumen.capacidad_total_gb.toLocaleString()} GB totales`,
            icon: <HardDrive className="h-5 w-5 text-orange-500" />,
            format: 'gb',
        },
        {
            title: 'Ahorro Potencial',
            value: resumen.ahorro_potencial_usd,
            description: `Costo del período · instancias sin actividad`,
            icon: <DollarSign className="h-5 w-5 text-green-500" />,
            format: 'usd',
            highlight: resumen.ahorro_potencial_usd > 0,
        },
    ];

    const formatValue = (value: number | undefined | null, format: string) => {
        const safe = value ?? 0;
        if (format === 'usd') return `$${safe.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (format === 'gb') return `${safe.toLocaleString()} GB`;
        return safe.toLocaleString();
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
                <Card
                    key={card.title}
                    className={card.highlight ? 'border-red-200 dark:border-red-900' : ''}
                >
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-muted-foreground">{card.title}</span>
                            {card.icon}
                        </div>
                        <div className={`text-2xl font-bold ${card.highlight ? 'text-red-500' : ''}`}>
                            {formatValue(card.value, card.format)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};