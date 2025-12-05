'use client'

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { NatGatewayCardsSummary } from '@/interfaces/vista-consumos/natGwConsumeViewInterfaces';
import { bytesToMB } from '@/lib/bytesToMbs';
import { Activity, AlertOctagon, ArrowDownToLine, ArrowUpFromLine, LucideIcon } from 'lucide-react';
import { useMemo } from 'react';

interface NatGatewaysConsumeCardsComponentProps {
    data: NatGatewayCardsSummary[]
}

type CardVariant = 'default' | 'destructive' | 'warning' | 'info' | 'success';

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: LucideIcon;
    variant?: CardVariant;
    actionLabel?: string;
    footer?: string; // Agregado para el Peak
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

export const NatGatewaysConsumeCardsComponent = ({ data }: NatGatewaysConsumeCardsComponentProps) => {

    const kpis = useMemo(() => {
        const result = {
            bytesIn: { val: 0, peak: 0 },
            bytesOut: { val: 0, peak: 0 },
            connections: { val: 0, peak: 0 },
            errors: { val: 0, peak: 0 },
        };

        if (!data || data.length === 0) return result;

        const findMetric = (namePart: string) => {
            return data.find(m => m.metric_name.toLowerCase().includes(namePart.toLowerCase()));
        };

        const mIn = findMetric('bytesinfromsource');
        if (mIn) result.bytesIn = { val: mIn.value, peak: mIn.peak_value };

        const mOut = findMetric('bytesouttodestination');
        if (mOut) result.bytesOut = { val: mOut.value, peak: mOut.peak_value };

        const mConn = findMetric('activeconnectioncount');
        if (mConn) result.connections = { val: mConn.value, peak: mConn.peak_value };

        const mErr = findMetric('errorportallocation');
        if (mErr) result.errors = { val: mErr.value, peak: mErr.peak_value };

        return result;
    }, [data]);

    const formatNumber = (num: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num);

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 MB';
        const mb = bytesToMB(bytes);
        return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(mb)} MB`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
                title="Tráfico Saliente (Internet)"
                value={formatBytes(kpis.bytesOut.val)}
                description="Promedio Volumen de datos procesados hacia internet."
                footer={`Peak: ${formatBytes(kpis.bytesOut.peak)}`}
                icon={ArrowUpFromLine}
                variant="info"
            />
            <StatCard
                title="Tráfico Entrante (VPC)"
                value={formatBytes(kpis.bytesIn.val)}
                description="Promedio Datos recibidos desde subnets privadas."
                footer={`Peak: ${formatBytes(kpis.bytesIn.peak)}`}
                icon={ArrowDownToLine}
                variant="default"
            />
            <StatCard
                title="Conexiones Concurrentes"
                value={formatNumber(kpis.connections.val)}
                description="Promedio Conexiones activas simultáneas."
                footer={`Peak: ${formatNumber(kpis.connections.peak)}`}
                icon={Activity}
                variant="success"
            />
            <StatCard
                title="Errores de Puerto (SNAT)"
                value={formatNumber(kpis.errors.val)}
                description="Promedio Fallos de asignación de puertos."
                footer={`Peak: ${formatNumber(kpis.errors.peak)}`}
                icon={AlertOctagon}
                variant={kpis.errors.val > 0 ? 'destructive' : 'default'}
                actionLabel={kpis.errors.val > 0 ? "ATENCIÓN" : "ESTABLE"}
            />
        </div>
    );
}