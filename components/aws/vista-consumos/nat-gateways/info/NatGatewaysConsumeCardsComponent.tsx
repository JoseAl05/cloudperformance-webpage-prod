'use client'

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { NatGatewaysMetricsSummary } from '@/interfaces/vista-consumos/natGwConsumeViewInterfaces'
import { bytesToGB, bytesToMB } from '@/lib/bytesToMbs';
import { Activity, AlertOctagon, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { useMemo } from 'react';

interface NatGatewaysConsumeCardsComponentProps {
    data: NatGatewaysMetricsSummary[]
}

type CardVariant = 'default' | 'destructive' | 'warning' | 'info' | 'success';

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: LucideIcon;
    variant?: CardVariant;
    actionLabel?: string;
}

const getVariantStyles = (variant: CardVariant) => {
    switch (variant) {
        case 'destructive':
            return {
                border: 'border-l-red-500',
                bgIcon: 'bg-red-100 dark:bg-red-900/30',
                textIcon: 'text-red-600 dark:text-red-400',
                badge: 'bg-red-100 text-red-700 border-red-200'
            };
        case 'warning':
            return {
                border: 'border-l-amber-500',
                bgIcon: 'bg-amber-100 dark:bg-amber-900/30',
                textIcon: 'text-amber-600 dark:text-amber-400',
                badge: 'bg-amber-100 text-amber-700 border-amber-200'
            };
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
                border: 'border-l-slate-500',
                bgIcon: 'bg-slate-100 dark:bg-slate-800',
                textIcon: 'text-slate-600 dark:text-slate-400',
                badge: 'bg-slate-100 text-slate-700 border-slate-200'
            };
    }
};

const StatCard = ({ title, value, description, icon: Icon, variant = 'default', actionLabel }: StatCardProps) => {
    const styles = getVariantStyles(variant);

    return (
        <Card className={`border-l-4 shadow-sm hover:shadow-md transition-all duration-200 ${styles.border} flex flex-col justify-between`}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                        <h4 className="text-3xl font-bold tracking-tight">{value}</h4>
                    </div>
                    <div className={`p-3 rounded-xl ${styles.bgIcon}`}>
                        <Icon className={`w-6 h-6 ${styles.textIcon}`} />
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                    {actionLabel && (
                        <Badge variant="outline" className={`text-[10px] font-semibold ${styles.badge}`}>
                            {actionLabel}
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export const NatGatewaysConsumeCardsComponent = ({ data }: NatGatewaysConsumeCardsComponentProps) => {

    const kpis = useMemo(() => {
        const acc = {
            totalBytesIn: 0,
            totalBytesOut: 0,
            totalConnections: 0,
            totalErrors: 0,
            resourceCount: data?.length || 0
        };

        if (!data || data.length === 0) return acc;

        data.forEach(resource => {
            resource.metrics.forEach(metric => {
                const name = metric.metric_name.toLowerCase();
                const val = metric.value || 0;

                if (name.includes('bytesinfromsource maximum')) {
                    acc.totalBytesIn += val;
                } else if (name.includes('bytesouttodestination maximum')) {
                    acc.totalBytesOut += val;
                } else if (name.includes('activeconnectioncount maximum')) {
                    acc.totalConnections += val;
                } else if (name.includes('errorportallocation maximum')) {
                    acc.totalErrors += val;
                }
            });
        });

        return acc;
    }, [data]);

    const formatNumber = (num: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
                title="Tráfico Saliente (Internet)"
                value={`${bytesToMB(kpis.totalBytesOut)} MBs`}
                description="Volumen total de datos procesados hacia internet (Costo Variable)."
                icon={ArrowUpFromLine}
                variant="info"
            />
            <StatCard
                title="Tráfico Entrante (VPC)"
                value={`${bytesToMB(kpis.totalBytesIn)} MBs`}
                description="Datos recibidos desde las subnets privadas."
                icon={ArrowDownToLine}
                variant="default"
            />
            <StatCard
                title="Conexiones Concurrentes"
                value={formatNumber(kpis.totalConnections)}
                description={`Carga simultánea total soportada ${kpis.resourceCount > 1 ? `por los ${kpis.resourceCount} gateways seleccionados` : `por el gateway seleccionado.`}`}
                icon={Activity}
                variant="success"
                actionLabel="Acumulado de recursos seleccionados"
            />
            <StatCard
                title="Errores de Puerto (SNAT)"
                value={formatNumber(kpis.totalErrors)}
                description="Fallos de asignación de puertos. Indica saturación crítica."
                icon={AlertOctagon}
                variant={kpis.totalErrors > 0 ? 'destructive' : 'default'} // Rojo si hay errores
                actionLabel={kpis.totalErrors > 0 ? "ATENCIÓN REQUERIDA" : "ESTADO SALUDABLE"}
            />

        </div>
    );
}