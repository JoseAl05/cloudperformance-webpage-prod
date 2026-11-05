'use client'

import { AlertTriangle, DollarSign, Server, TrendingDown } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { formatCurrency } from '@/lib/format';
import type { ConsumptionSummary } from '@/interfaces/consumption';

export const ZonasDNSCardsComponent = ({ summary }: { summary: ConsumptionSummary }) => {
    const active = Number(summary.extra.zonas_con_uso ?? summary.total_resources - summary.idle_resources);
    const savings = summary.potential_savings ?? 0;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
                title="Total Zonas DNS"
                value={summary.total_resources}
                subtitle={`${active} activas | ${summary.idle_resources} zombies`}
                description="Zonas DNS totales monitoreadas en el proyecto."
                icon={Server}
                color="blue"
            />
            <StatCard
                title="Zonas Sin Uso"
                value={summary.idle_resources}
                subtitle="Zonas zombie (0 queries)"
                description="Zonas DNS sin tráfico que generan costos innecesarios."
                icon={AlertTriangle}
                color={summary.idle_resources > 0 ? 'amber' : 'green'}
            />
            <StatCard
                title="Costo Total"
                value={formatCurrency(summary.cost_total)}
                unit="USD/mes"
                description="Costo mensual actual de todas las zonas DNS."
                icon={DollarSign}
                color="blue"
            />
            <StatCard
                title="Ahorro Potencial"
                value={formatCurrency(savings)}
                unit="USD/mes"
                subtitle={savings > 0 ? 'Eliminando zonas zombie' : 'No hay ahorros identificados'}
                description="Ahorro mensual eliminando zonas DNS sin uso."
                icon={TrendingDown}
                color={savings > 0 ? 'green' : 'blue'}
            />
        </div>
    );
};
