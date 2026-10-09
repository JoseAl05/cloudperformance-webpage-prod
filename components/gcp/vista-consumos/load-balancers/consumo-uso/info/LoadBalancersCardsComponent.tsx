'use client'

import { Activity, AlertTriangle, DollarSign, TrendingDown } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { formatCurrency } from '@/lib/format';
import type { ConsumptionSummary } from '@/interfaces/consumption';

export const LoadBalancersCardsComponent = ({ summary }: { summary: ConsumptionSummary }) => {
    const active = Number(summary.extra.con_trafico ?? summary.total_resources - summary.idle_resources);
    const requests = Number(summary.extra.requests_totales ?? 0);
    const savings = summary.potential_savings ?? 0;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            <StatCard
                title="Total Load Balancers"
                value={summary.total_resources}
                subtitle={`${active} activos | ${summary.idle_resources} zombies`}
                description="Load balancers totales monitoreados en el proyecto."
                icon={Activity}
                color="blue"
            />
            <StatCard
                title="Tráfico Procesado"
                value={requests.toLocaleString('es-CL')}
                unit="requests"
                description="Volumen de tráfico gestionado por todos los load balancers."
                icon={Activity}
                color="green"
            />
            <StatCard
                title="Zombies / Sin Tráfico"
                value={summary.idle_resources}
                description="LBs configurados pero sin procesar tráfico real."
                icon={AlertTriangle}
                color={summary.idle_resources > 0 ? 'amber' : 'green'}
            />
            <StatCard
                title="Costo Total"
                value={formatCurrency(summary.cost_total)}
                unit="USD/mes"
                description="Gasto de los balanceadores listados."
                icon={DollarSign}
                color="blue"
            />
            <StatCard
                title="Ahorro Potencial"
                value={formatCurrency(savings)}
                unit="USD/mes"
                subtitle="Limpieza recomendada por Higiene de Red y SecOps"
                description="Ahorro mensual eliminando load balancers sin tráfico."
                icon={TrendingDown}
                color={savings > 0 ? 'green' : 'blue'}
            />
        </div>
    );
};
