'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Database, DollarSign, HardDrive, TrendingDown } from 'lucide-react';

interface Resumen {
    total_analizados: number;
    sub_utilizados: number;
    sin_metricas: number;
    costo_total_mensual: number;
    costo_desperdiciado: number;
    ahorro_potencial_top: number;
    capacidad_total_gb: number;
    capacidad_usada_gb: number;
    capacidad_desperdiciada_gb: number;
    porcentaje_uso_promedio: number;
    currency: string;
}

interface TopFilestoreSubUtilizadoCardsComponentProps {
    resumen: Resumen;
    isLoading: boolean;
}

export const TopFilestoreSubUtilizadoCardsComponent = ({
    resumen,
    isLoading,
}: TopFilestoreSubUtilizadoCardsComponentProps) => {
    if (isLoading || !resumen) return null;

    const cards = [
        {
            title: 'Instancias Analizadas',
            value: resumen.total_analizados,
            description: `${resumen.sin_metricas} sin métricas disponibles`,
            icon: <Database className="h-5 w-5 text-blue-500" />,
            format: 'number',
        },
        {
            title: 'Capacidad Provisionada',
            value: resumen.capacidad_total_gb,
            description: `${resumen.porcentaje_uso_promedio}% uso promedio`,
            icon: <HardDrive className="h-5 w-5 text-purple-500" />,
            format: 'gb',
        },
        {
            title: 'Costo Mensual Total',
            value: resumen.costo_total_mensual,
            description: `${resumen.currency} · capacidad provisionada`,
            icon: <DollarSign className="h-5 w-5 text-green-500" />,
            format: 'usd',
        },
        {
            title: 'Costo Desperdiciado',
            value: resumen.costo_desperdiciado,
            description: `${resumen.capacidad_desperdiciada_gb.toLocaleString()} GB sin uso`,
            icon: <TrendingDown className="h-5 w-5 text-red-500" />,
            format: 'usd',
            highlight: true,
        },
    ];

    const formatValue = (value: number, format: string) => {
        if (format === 'usd') return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (format === 'gb') return `${value.toLocaleString()} GB`;
        return value.toLocaleString();
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