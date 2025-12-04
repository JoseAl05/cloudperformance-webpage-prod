'use client'

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LoadbalancerV2MetricsSummary } from '@/interfaces/vista-consumos/elbV2ConsumeViewInterfaces';
import { bytesToGB, bytesToMB } from '@/lib/bytesToMbs'; // Asumiendo que tienes esta utilidad, sino usa bytesToMB
import {
    Activity,
    AlertTriangle,
    ArrowRightLeft,
    BarChart3,
    Coins,
    Database,
    Globe,
    LucideIcon,
    Network,
    ServerCrash
} from 'lucide-react'; // Iconos sugeridos para mejor contexto
import { useMemo } from 'react';

interface ElbV2ConsumeCardsComponentProps {
    data: LoadbalancerV2MetricsSummary[]
}

type CardVariant = 'default' | 'destructive' | 'warning' | 'info' | 'success';

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: LucideIcon; // LucideIcon type
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
        <Card className={`border-l-4 shadow-sm hover:shadow-md transition-all duration-200 ${styles.border} flex flex-col justify-between h-full`}>
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
                    <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                        {description}
                    </p>
                    {actionLabel && (
                        <Badge variant="outline" className={`text-[10px] font-semibold px-2 py-0.5 h-auto ${styles.badge}`}>
                            {actionLabel}
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export const ElbV2ConsumeCardsComponent = ({ data }: ElbV2ConsumeCardsComponentProps) => {

    const kpis = useMemo(() => {
        const acc = {
            totalNewFlows: 0,
            totalActiveFlow: 0,
            totalProcessedBytes: 0,
            totalTcpClientReset: 0,
            totalConsumedLcu: 0,
            totalActiveConnections: 0,
            totalCode5xx: 0,
            totalNewConnections: 0,
            totalRequestCount: 0,
            totalRuleEvaluations: 0,
            resourceCount: data?.length || 0
        };

        if (!data || data.length === 0) return acc;

        data.forEach(resource => {
            resource.metrics.forEach(metric => {
                const name = metric.metric_name.toLowerCase();
                const val = metric.value || 0;

                if (name.includes('activeconnectioncount average')) {
                    acc.totalActiveConnections += val;
                } else if (name.includes('activeflowcount average')) {
                    acc.totalActiveFlow += val;
                } else if (name.includes('consumedlcus average')) {
                    acc.totalConsumedLcu += val;
                } else if (name.includes('httpcode_target_5xx_count average')) {
                    acc.totalCode5xx += val;
                } else if (name.includes('newconnectioncount average')) {
                    acc.totalNewConnections += val;
                } else if (name.includes('newflowcount average')) {
                    acc.totalNewFlows += val;
                } else if (name.includes('processedbytes average')) {
                    acc.totalProcessedBytes += val;
                } else if (name.includes('requestcount average')) {
                    acc.totalRequestCount += val;
                } else if (name.includes('ruleevaluations average')) {
                    acc.totalRuleEvaluations += val;
                } else if (name.includes('tcp_client_reset_count average')) {
                    acc.totalTcpClientReset += val;
                }
            });
        });

        return acc;
    }, [data]);

    const formatNumber = (num: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num);
    const formatDecimals = (num: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num);

    // Helper simple para bytes si no tienes la librería a mano, si la tienes usa la importada
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 GB';
        const gb = bytes / (1024 * 1024 * 1024);
        return `${gb.toFixed(2)} GB`;
    };

    return (
        <div className="space-y-6">

            {/* SECCIÓN 1: MÉTRICAS DE ALTO IMPACTO (Costo, Salud, Volumen) */}
            <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Impacto y Salud
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        title="LCUs Consumidos"
                        value={formatDecimals(kpis.totalConsumedLcu)}
                        description="Load Balancer Capacity Units totales consumidas. Impacto directo en facturación."
                        icon={Coins}
                        variant="default" // Neutro/Principal
                    />
                    <StatCard
                        title="Volumen Procesado"
                        value={`${bytesToMB(kpis.totalProcessedBytes)}`}
                        description="Total de datos procesados por los balanceadores seleccionados."
                        icon={Database}
                        variant="info"
                    />
                    <StatCard
                        title="Errores 5xx (Backend)"
                        value={formatNumber(kpis.totalCode5xx)}
                        description="Errores devueltos por las instancias/targets traseros. Indica problemas de aplicación."
                        icon={AlertTriangle}
                        variant={kpis.totalCode5xx > 0 ? 'destructive' : 'success'}
                        actionLabel={kpis.totalCode5xx > 0 ? "Revisar Targets" : "Saludable"}
                    />
                </div>
            </div>

            {/* SECCIÓN 2: DETALLE DE TRÁFICO (ALB vs NLB) */}
            <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Network className="h-4 w-4" />
                    Detalle de Tráfico
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Métricas ALB */}
                    <StatCard
                        title="Requests (ALB)"
                        value={formatNumber(kpis.totalRequestCount)}
                        description="Peticiones HTTP/HTTPS procesadas (Application Load Balancers)."
                        icon={Globe}
                    />
                    <StatCard
                        title="Conexiones Activas"
                        value={formatNumber(kpis.totalActiveConnections)}
                        description="Conexiones concurrentes mantenidas hacia los targets."
                        icon={ArrowRightLeft}
                    />

                    {/* Métricas NLB */}
                    <StatCard
                        title="Nuevos Flujos (NLB)"
                        value={formatNumber(kpis.totalNewFlows)}
                        description="Nuevas conexiones TCP/UDP establecidas (Network Load Balancers)."
                        icon={BarChart3}
                    />
                    <StatCard
                        title="Resets TCP"
                        value={formatNumber(kpis.totalTcpClientReset)}
                        description="Conexiones reiniciadas por el cliente. Puede indicar problemas de red."
                        icon={ServerCrash}
                        variant={kpis.totalTcpClientReset > 100 ? 'warning' : 'default'}
                    />
                </div>
            </div>
        </div>
    );
}