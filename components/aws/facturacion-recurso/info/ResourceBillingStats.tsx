'use client'

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, DollarSign, TrendingUp, CalendarDays, Layers } from 'lucide-react';
import { useMemo } from 'react';

// Tipos basados en tu JSON
interface BillingItem {
    start_date: string;
    end_date: string;
    unblendedcost: number;
    netamortizedcost: number;
}

interface ResourceBillingData {
    service: string;
    resource: string;
    billing: BillingItem[];
}

interface ResourceBillingStatsProps {
    data: ResourceBillingData[];
}

type CardVariant = 'default' | 'destructive' | 'warning' | 'info' | 'success';

// --- Reutilizando tu lógica de diseño de StatCard ---
const getVariantStyles = (variant: CardVariant) => {
    switch (variant) {
        case 'success':
            return {
                border: 'border-l-emerald-500',
                bgIcon: 'bg-emerald-100 dark:bg-emerald-900/30',
                textIcon: 'text-emerald-600 dark:text-emerald-400',
                badge: 'bg-emerald-100 text-emerald-700 border-emerald-200'
            };
        case 'info':
            return {
                border: 'border-l-blue-500',
                bgIcon: 'bg-blue-100 dark:bg-blue-900/30',
                textIcon: 'text-blue-600 dark:text-blue-400',
                badge: 'bg-blue-100 text-blue-700 border-blue-200'
            };
        default:
            return {
                border: 'border-l-indigo-500',
                bgIcon: 'bg-indigo-100 dark:bg-indigo-900/30',
                textIcon: 'text-indigo-600 dark:text-indigo-400',
                badge: 'bg-indigo-100 text-indigo-700 border-indigo-200'
            };
    }
};

const StatCard = ({ title, value, description, icon: Icon, variant = 'default', footer }: {
    title: string; value: string; description: string; icon: LucideIcon; variant?: CardVariant; footer?: string
}) => {
    const styles = getVariantStyles(variant);
    return (
        <Card className={`border-l-4 shadow-sm ${styles.border} flex flex-col justify-between h-full`}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-tight">{title}</p>
                        <h4 className="text-2xl font-bold tracking-tight text-foreground">{value}</h4>
                    </div>
                    <div className={`p-2.5 rounded-xl ${styles.bgIcon}`}>
                        <Icon className={`w-5 h-5 ${styles.textIcon}`} />
                    </div>
                </div>
                <div className="space-y-3">
                    <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{description}</p>
                    {footer && (
                        <div className="flex items-center">
                            <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {footer}
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export const ResourceBillingStats = ({ data }: ResourceBillingStatsProps) => {
    const kpis = useMemo(() => {
        let totalCost = 0;
        let maxDailyCost = 0;
        let daysCount = 0;
        const dailyTotals: Record<string, number> = {};

        // Iterar sobre todos los servicios (ej: Compute, EC2-Other)
        data.forEach(serviceGroup => {
            serviceGroup.billing.forEach(day => {
                const cost = day.unblendedcost || 0;
                totalCost += cost;

                // Agrupar por fecha para encontrar el peak real del recurso completo
                const dateKey = day.start_date;
                dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + cost;
            });
        });

        const dailyValues = Object.values(dailyTotals);
        daysCount = dailyValues.length;
        maxDailyCost = Math.max(...dailyValues, 0);

        const avgDailyCost = daysCount > 0 ? totalCost / daysCount : 0;

        return {
            totalCost,
            avgDailyCost,
            maxDailyCost,
            servicesCount: data.length
        };
    }, [data]);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
                title="Costo Total"
                value={formatCurrency(kpis.totalCost)}
                description="Costo acumulado en el periodo seleccionado."
                icon={DollarSign}
                variant="default"
            />
            <StatCard
                title="Promedio Diario"
                value={formatCurrency(kpis.avgDailyCost)}
                description="Gasto promedio por día activo."
                icon={CalendarDays}
                variant="info"
            />
            <StatCard
                title="Peak Diario"
                value={formatCurrency(kpis.maxDailyCost)}
                description="El costo más alto registrado en un solo día."
                icon={TrendingUp}
                variant="warning" // Warning visual para peaks altos
                footer="Máximo histórico del periodo"
            />
            <StatCard
                title="Servicios Implicados"
                value={kpis.servicesCount.toString()}
                description="Componentes de facturación detectados."
                icon={Layers}
                variant="success"
                footer={data.map(d => d.service).join(', ')}
                // footer={data.map(d => d.service.split('-')[0].trim()).slice(0, 2).join(', ') + (data.length > 2 ? '...' : '')}
            />
        </div>
    );
};