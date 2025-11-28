'use client'

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { UnusedTm } from '@/interfaces/vista-unused-resources/unusedTmInterfaces'
import { Clock, Server, ShieldAlert } from 'lucide-react';
import { useMemo } from 'react';

interface UnusedTrafficManagerCardsComponentProps {
    data: UnusedTm[];
}

type CardVariant = 'default' | 'destructive' | 'warning' | 'info' | 'success';

interface StatCardProps {
    title: string;
    value: number;
    description: string;
    icon: LucideIcon;
    variant?: CardVariant;
    actionLabel?: string;
    dateLabel?: string;
};

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
        case 'info':
            return {
                border: 'border-l-blue-500',
                bgIcon: 'bg-blue-100 dark:bg-blue-900/30',
                textIcon: 'text-blue-600 dark:text-blue-400',
                badge: 'bg-blue-100 text-blue-700 border-blue-200'
            };
        case 'success':
            return {
                border: 'border-l-emerald-500',
                bgIcon: 'bg-emerald-100 dark:bg-emerald-900/30',
                textIcon: 'text-emerald-600 dark:text-emerald-400',
                badge: 'bg-emerald-100 text-emerald-700 border-emerald-200'
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

const StatCard = ({ title, value, description, icon: Icon, variant = 'default', actionLabel, dateLabel }: StatCardProps) => {
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

                <div className="space-y-2 mb-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                    {actionLabel && (
                        <Badge variant="outline" className={`text-[10px] font-semibold ${styles.badge}`}>
                            {actionLabel}
                        </Badge>
                    )}
                </div>
                {dateLabel && (
                    <div className="pt-3 mt-2 border-t flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                        <Clock className="w-3 h-3" />
                        <span>{dateLabel}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export const UnusedTrafficManagerCardsComponent = ({ data }: UnusedTrafficManagerCardsComponentProps) => {
    const metrics = useMemo(() => {
        const counts = {
            total: data?.length || 0,
            trafficview_enabled: 0,
            trafficview_disabled: 0
        };

        if (!data || data.length === 0) return counts;

        data.forEach(tm => {
            if (!tm.details || tm.details.length === 0) return;

            const latestDetail = tm.details.reduce((latest, current) => {
                return new Date(current.sync_time).getTime() > new Date(latest.sync_time).getTime()
                    ? current
                    : latest;
            }, tm.details[0]);

            const { traffic_view_enrollment_status } = latestDetail;

            if (traffic_view_enrollment_status === 'Enabled') counts.trafficview_enabled++;
            else if (traffic_view_enrollment_status === 'Disabled') counts.trafficview_disabled++;
        });

        return counts;
    }, [data]);

    const dateLabelText = useMemo(() => {
        if (!data || data.length === 0) return null;

        const latestTimestamp = data.reduce((maxTime, item) => {
            const itemLatestTime = item.details?.reduce((dMax, detail) => {
                const t = new Date(detail.sync_time).getTime();
                return t > dMax ? t : dMax;
            }, 0) || 0;
            return itemLatestTime > maxTime ? itemLatestTime : maxTime;
        }, 0);

        if (latestTimestamp === 0) return null;

        const latestSyncTime = new Date(latestTimestamp);
        const today = new Date();

        const isToday =
            latestSyncTime.getDate() === today.getDate() &&
            latestSyncTime.getMonth() === today.getMonth() &&
            latestSyncTime.getFullYear() === today.getFullYear();

        return isToday
            ? 'Datos Actualizados: Hoy'
            : `Datos a fecha de: ${latestSyncTime.toLocaleDateString()}`;

    }, [data]);
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    title="Total Infrautilizados"
                    value={metrics.total}
                    description="Recursos que no reciben tráfico o no tienen endpoints configurados."
                    icon={Server}
                    variant="warning"
                    dateLabel={dateLabelText || undefined}
                />
                <StatCard
                    title="Traffic View Desactivado"
                    value={metrics.trafficview_disabled}
                    description="Traffic managers con Traffic View desactivado."
                    icon={ShieldAlert}
                    actionLabel="Aplicación de Pricing básico o estándar"
                    dateLabel={dateLabelText || undefined}
                />
                <StatCard
                    title="Traffic View Activado"
                    value={metrics.trafficview_enabled}
                    description="Traffic managers con Traffic View activado."
                    icon={ShieldAlert}
                    actionLabel="Aplicación de Pricing con traffic view (más costoso)"
                    dateLabel={dateLabelText || undefined}
                />
            </div>
        </div>
    )
}