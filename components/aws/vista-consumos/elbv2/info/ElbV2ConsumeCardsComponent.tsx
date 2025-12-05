'use client'

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LoadbalancerV2CardsSummary } from '@/interfaces/vista-consumos/elbV2ConsumeViewInterfaces';
import { bytesToMB } from '@/lib/bytesToMbs';
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
} from 'lucide-react';
import { useMemo } from 'react';

interface ElbV2ConsumeCardsComponentProps {
    data: LoadbalancerV2CardsSummary[]
}

type CardVariant = 'default' | 'destructive' | 'warning' | 'info' | 'success';

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: LucideIcon;
    variant?: CardVariant;
    actionLabel?: string;
    footer?: string;
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

const StatCard = ({ title, value, description, icon: Icon, variant = 'default', actionLabel, footer }: StatCardProps) => {
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
                    <div className="flex items-center justify-between">
                        {actionLabel && (
                            <Badge variant="outline" className={`text-[10px] font-semibold px-2 py-0.5 h-auto ${styles.badge}`}>
                                {actionLabel}
                            </Badge>
                        )}
                        {footer && (
                            <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {footer}
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export const ElbV2ConsumeCardsComponent = ({ data }: ElbV2ConsumeCardsComponentProps) => {

    const kpis = useMemo(() => {
        const result = {
            totalNewFlows: { val: 0, peak: 0 },
            totalActiveFlow: { val: 0, peak: 0 },
            totalProcessedBytes: { val: 0, peak: 0 },
            totalTcpClientReset: { val: 0, peak: 0 },
            totalConsumedLcu: { val: 0, peak: 0 },
            totalActiveConnections: { val: 0, peak: 0 },
            totalCode5xx: { val: 0, peak: 0 },
            totalNewConnections: { val: 0, peak: 0 },
            totalRequestCount: { val: 0, peak: 0 },
            totalRuleEvaluations: { val: 0, peak: 0 },
        };

        if (!data || data.length === 0) return result;

        const findMetric = (namePart: string) => {
            return data.find(m => m.metric_name.toLowerCase().includes(namePart.toLowerCase()));
        };

        const activeConn = findMetric('activeconnectioncount');
        if (activeConn) result.totalActiveConnections = { val: activeConn.value, peak: activeConn.peak_value };

        const activeFlow = findMetric('activeflowcount');
        if (activeFlow) result.totalActiveFlow = { val: activeFlow.value, peak: activeFlow.peak_value };

        const lcus = findMetric('consumedlcus');
        if (lcus) result.totalConsumedLcu = { val: lcus.value, peak: lcus.peak_value };

        const code5xx = findMetric('5xx_count');
        if (code5xx) result.totalCode5xx = { val: code5xx.value, peak: code5xx.peak_value };

        const newConn = findMetric('newconnectioncount');
        if (newConn) result.totalNewConnections = { val: newConn.value, peak: newConn.peak_value };

        const newFlow = findMetric('newflowcount');
        if (newFlow) result.totalNewFlows = { val: newFlow.value, peak: newFlow.peak_value };

        const bytes = findMetric('processedbytes');
        if (bytes) result.totalProcessedBytes = { val: bytes.value, peak: bytes.peak_value };

        const reqCount = findMetric('requestcount');
        if (reqCount) result.totalRequestCount = { val: reqCount.value, peak: reqCount.peak_value };

        const rules = findMetric('ruleevaluations');
        if (rules) result.totalRuleEvaluations = { val: rules.value, peak: rules.peak_value };

        const tcpReset = findMetric('tcp_client_reset');
        if (tcpReset) result.totalTcpClientReset = { val: tcpReset.value, peak: tcpReset.peak_value };

        return result;
    }, [data]);

    const formatNumber = (num: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 5 }).format(num);
    const formatDecimals = (num: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num);

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 GB';
        const mb = bytesToMB(bytes);
        return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(mb)} MB`;
    };

    const formatBytesPeak = (bytes: number) => {
        if (bytes === 0) return '0 MB';
        const mb = bytesToMB(bytes);
        // if (mb < 1) return `${(mb * 1024).toFixed(0)} KB`;
        return mb;
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Impacto y Salud (Totales)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        title="Total LCUs"
                        value={formatDecimals(kpis.totalConsumedLcu.val)}
                        description="LCUs consumidas (Promedio global por hora/recurso)."
                        footer={`Peak: ${formatDecimals(kpis.totalConsumedLcu.peak)}`}
                        icon={Coins}
                        variant="default"
                    />
                    <StatCard
                        title="Volumen Total"
                        value={formatBytes(kpis.totalProcessedBytes.val)}
                        description="Promedio Datos procesados acumulados en el periodo."
                        footer={`Peak: ${formatBytesPeak(kpis.totalProcessedBytes.peak)}`}
                        icon={Database}
                        variant="info"
                    />
                    <StatCard
                        title="Total Errores 5xx"
                        value={formatNumber(kpis.totalCode5xx.val)}
                        description="Promedio Errores backend."
                        footer={`Peak: ${formatNumber(kpis.totalCode5xx.peak)}`}
                        icon={AlertTriangle}
                        variant={kpis.totalCode5xx.val > 0 ? 'destructive' : 'success'}
                        actionLabel={kpis.totalCode5xx.val > 0 ? "Incidentes" : "Estable"}
                    />
                </div>
            </div>
            <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Network className="h-4 w-4" />
                    Carga de Tráfico (Acumulado)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Requests (ALB)"
                        value={formatNumber(kpis.totalRequestCount.val)}
                        description="Promedio Peticiones HTTP/HTTPS totales."
                        footer={`Peak: ${formatNumber(kpis.totalRequestCount.peak)}`}
                        icon={Globe}
                    />
                    <StatCard
                        title="Conexiones Activas"
                        value={formatNumber(kpis.totalActiveConnections.val)}
                        description="Promedio de concurrencia."
                        footer={`Peak: ${formatNumber(kpis.totalActiveConnections.peak)}`}
                        icon={ArrowRightLeft}
                    />
                    <StatCard
                        title="Nuevos Flujos"
                        value={formatNumber(kpis.totalNewFlows.val)}
                        description="Promedio Flujos iniciados."
                        footer={`Peak: ${kpis.totalNewFlows.peak}`}
                        icon={BarChart3}
                    />
                    <StatCard
                        title="Flujos Activos"
                        value={formatNumber(kpis.totalActiveFlow.val)}
                        description="Promedio Flujos Activos."
                        footer={`Peak: ${formatNumber(kpis.totalActiveFlow.peak)}`}
                        icon={BarChart3}
                    />
                    <StatCard
                        title="Resets TCP"
                        value={formatNumber(kpis.totalTcpClientReset.val)}
                        description="Promedio Reinicios de conexión total."
                        footer={`Peak: ${formatNumber(kpis.totalTcpClientReset.peak)}`}
                        icon={ServerCrash}
                        variant={kpis.totalTcpClientReset.val > 100 ? 'warning' : 'default'}
                    />
                </div>
            </div>
        </div>
    );
}