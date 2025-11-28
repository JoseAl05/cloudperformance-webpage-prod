import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UnusedAppGw } from '@/interfaces/vista-unused-resources/unusedAppGInterfaces';
import {
    AlertTriangle,
    ShieldAlert,
    ShieldCheck,
    Server,
    CalendarX,
    Activity,
    LucideIcon,
    CheckCircle2,
    Clock // Importamos Clock para el ícono de la fecha
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UnusedAppsGwCardsComponentProps {
    data: UnusedAppGw[];
}

type CardVariant = 'default' | 'destructive' | 'warning' | 'info' | 'success';

interface StatCardProps {
    title: string;
    value: number;
    description: string;
    icon: LucideIcon;
    variant?: CardVariant;
    actionLabel?: string;
    dateLabel?: string; // Nueva prop para recibir el texto de la fecha
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

export const UnusedAppsGwCardsComponent = ({ data }: UnusedAppsGwCardsComponentProps) => {
    const metrics = useMemo(() => {
        const counts = {
            total: data?.length || 0,
            standard_v1: 0,
            waf_v1: 0,
            standard_v2: 0,
            waf_v2: 0,
            waf_disabled: 0,
            waf_detection: 0
        };

        if (!data || data.length === 0) return counts;

        data.forEach(appg => {
            if (!appg.details || appg.details.length === 0) return;

            const latestDetail = appg.details.reduce((latest, current) => {
                return new Date(current.sync_time).getTime() > new Date(latest.sync_time).getTime()
                    ? current
                    : latest;
            }, appg.details[0]);

            const { sku, waf_mode } = latestDetail;

            if (sku.includes('Standard') && !sku.includes('v2')) counts.standard_v1++;
            else if (sku.includes('WAF') && !sku.includes('v2')) counts.waf_v1++;
            else if (sku === 'Standard_v2') counts.standard_v2++;
            else if (sku === 'WAF_v2') counts.waf_v2++;

            if (waf_mode === 'Disabled') counts.waf_disabled++;
            if (waf_mode === 'Detection') counts.waf_detection++;
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

    if (metrics.total === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mb-4 text-emerald-500/50" />
                    <p className="text-lg font-medium">Todo en orden</p>
                    <p className="text-sm">No se detectaron Application Gateways infrautilizados.</p>
                    {dateLabelText && (
                        <p className="text-xs mt-2 font-mono bg-muted px-2 py-1 rounded">{dateLabelText}</p>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Infrautilizados"
                    value={metrics.total}
                    description="Recursos que no reciben tráfico o no tienen backend pools activos."
                    icon={Server}
                    variant="default"
                    dateLabel={dateLabelText || undefined}
                />
                <StatCard
                    title="WAF Desactivado"
                    value={metrics.waf_disabled}
                    description="Gateways vulnerables sin protección de firewall web activa."
                    icon={ShieldAlert}
                    variant={metrics.waf_disabled > 0 ? "destructive" : "success"}
                    actionLabel={metrics.waf_disabled > 0 ? "ACCIÓN REQUERIDA: ACTIVAR O CAMBIAR A STANDARD V2" : "ESTADO ÓPTIMO"}
                    dateLabel={dateLabelText || undefined}
                />
                <StatCard
                    title="WAF en Detección"
                    value={metrics.waf_detection}
                    description="El firewall solo monitorea amenazas sin bloquearlas."
                    icon={ShieldCheck}
                    variant={metrics.waf_detection > 0 ? "warning" : "default"}
                    actionLabel="CONSIDERAR MODO PREVENTION"
                    dateLabel={dateLabelText || undefined}
                />
                <StatCard
                    title="Recursos Legacy (V1)"
                    value={metrics.standard_v1 + metrics.waf_v1}
                    description="SKUs antiguos (Standard/WAF V1) próximos a depreciación."
                    icon={CalendarX}
                    variant={(metrics.standard_v1 + metrics.waf_v1) > 0 ? "destructive" : "info"}
                    actionLabel="PLANIFICAR MIGRACIÓN V2"
                    dateLabel={dateLabelText || undefined}
                />
            </div>
            {(metrics.standard_v1 > 0 || metrics.waf_v1 > 0) && (
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Detalle de Obsolescencia (SKU V1)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {metrics.standard_v1 > 0 && (
                            <StatCard
                                title="Standard V1 (Legacy)"
                                value={metrics.standard_v1}
                                description="Deprecación: 28 Abril 2026. Microsoft dejará de dar soporte."
                                icon={CalendarX}
                                variant="destructive"
                                dateLabel={dateLabelText || undefined}
                            />
                        )}
                        {metrics.waf_v1 > 0 && (
                            <StatCard
                                title="WAF V1 (Legacy)"
                                value={metrics.waf_v1}
                                description="Deprecado desde Abril 2023. Riesgo de seguridad alto."
                                icon={CalendarX}
                                variant="destructive"
                                dateLabel={dateLabelText || undefined}
                            />
                        )}
                    </div>
                </div>
            )}
            {(metrics.standard_v2 > 0 || metrics.waf_v2 > 0) && (
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Inventario Moderno (V2) Infrautilizado
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <StatCard
                            title="Standard V2"
                            value={metrics.standard_v2}
                            description="Infraestructura moderna pero sin uso detectado."
                            icon={Server}
                            variant="info"
                            dateLabel={dateLabelText || undefined}
                        />
                        <StatCard
                            title="WAF V2"
                            value={metrics.waf_v2}
                            description="Capacidad de WAF moderno ociosa."
                            icon={ShieldCheck}
                            variant="info"
                            dateLabel={dateLabelText || undefined}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};