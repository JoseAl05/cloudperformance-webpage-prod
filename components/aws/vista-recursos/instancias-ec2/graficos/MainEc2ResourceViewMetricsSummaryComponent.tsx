'use client'

import { Card, CardContent } from '@/components/ui/card'
import { bytesToMB } from '@/lib/bytesToMbs'
import { Activity, ChevronDown, Cpu, Network, Percent, TrendingUp, Zap } from 'lucide-react'

interface MainEc2ResourceViewMetricsSummaryComponentProps {
    data: unknown
}

const CPU_THRESHOLD_LOW = 20;
const CPU_THRESHOLD_HIGH = 80;
const NETWORK_THRESHOLD_LOW = 5;

const getUsageStatus = (type: "cpu" | "network", value: number) => {
    if (type === "cpu") {
        if (value < CPU_THRESHOLD_LOW) {
            return {
                message: "Bajo uso de CPU",
                icon: ChevronDown,
                style: "text-xs text-red-600 font-bold pt-2"
            };
        } else if (value > CPU_THRESHOLD_HIGH) {
            return {
                message: "Alto uso de CPU",
                icon: ChevronUp,
                style: "text-xs text-green-600 font-bold pt-2"
            };
        }
        return {
            message: "Uso de CPU normal",
            icon: Minus,
            style: "text-xs text-gray-500 font-bold pt-2"
        };
    }

    if (type === "network") {
        if (value < NETWORK_THRESHOLD_LOW) {
            return {
                message: "Bajo tráfico de red",
                icon: ChevronDown,
                style: "text-xs text-red-600 font-bold pt-2"
            };
        }
        return {
            message: "Tráfico normal",
            icon: Minus,
            style: "text-xs text-gray-500 font-bold pt-2"
        };
    }

    return null;
}

export const MainEc2ResourceViewMetricsSummaryComponent = ({ data }: MainEc2ResourceViewMetricsSummaryComponentProps) => {
    if (!data || data.metrics_data.length === 0) {
        return (
            <div className="text-center text-gray-500 py-6">
                No hay métricas disponibles para mostrar.
            </div>
        );
    }

    const today = new Date();
    const sortedMetrics = [...data.metrics_data].sort((a, b) => {
        const dateA = new Date(a.sync_time).getTime();
        const dateB = new Date(b.sync_time).getTime();
        return dateB - dateA;
    });

    const latestMetric = sortedMetrics[0];
    const referenceDate = new Date(latestMetric.sync_time);
    const isToday =
        referenceDate.getDate() === today.getDate() &&
        referenceDate.getMonth() === today.getMonth() &&
        referenceDate.getFullYear() === today.getFullYear();

    const dateLabel = referenceDate.toLocaleDateString();
    // INFORMACIÓN CRÉDITOS
    const creditsBalanceTitle = "Créditos Disponibles"
    const creditsUsageTitle = "Créditos Utilizados"
    const percentageCreditsTitle = "Porcentaje Créditos Utilizados"
    const creditsEfficiencyTitle = "Eficiencia Instancia"
    const lastCpuCreditBalanceEc2 = data?.calculated_summary?.Last_CPU_Credit_Balance_EC2 ?? 0;
    const lastCpuCreditUsageEc2 = data?.calculated_summary?.Last_CPU_Credit_Usage_EC2 ?? 0;
    const percentageCreditsUsageEc2 = data?.calculated_summary?.Porcentaje_Uso_Créditos_CPU_EC2 ?? 0;
    const creditsEfficiencyEc2 = data?.calculated_summary?.Eficiencia_Creditos_CPU_EC2_Instancia ?? "";

    // PROMEDIO USO DE CPU
    const cpuMetrics = data.metrics_data.filter(
        (m: unknown) => m.MetricLabel === 'Uso de CPU (Promedio)'
    );
    const averageCpuUsage = cpuMetrics.length > 0
        ? cpuMetrics.reduce((sum: number, m: unknown) => sum + (m.Value ?? 0), 0) / cpuMetrics.length
        : 0;
    const usageCpuTitle = 'Promedio Uso de CPU';
    // PROMEDIO ENTRADA DE RED
    const inNetworkMetrics = data.metrics_data.filter(
        (m: unknown) => m.MetricLabel === 'Entrada de Red (Promedio)'
    );
    const averageinNetworkUsage = inNetworkMetrics.length > 0
        ? inNetworkMetrics.reduce((sum: number, m: unknown) => sum + (m.Value ?? 0), 0) / inNetworkMetrics.length
        : 0;
    const inNetworkTitle = 'Promedio Salida de Red';
    // PROMEDIO SALIDA DE RED
    const outNetworkMetrics = data.metrics_data.filter(
        (m: unknown) => m.MetricLabel === 'Salida de Red (Promedio)'
    );
    const averageOutNetworkUsage = outNetworkMetrics.length > 0
        ? outNetworkMetrics.reduce((sum: number, m: unknown) => sum + (m.Value ?? 0), 0) / outNetworkMetrics.length
        : 0;
    const outNetworkTitle = 'Promedio Entrada de Red';

    const cpuStatus = getUsageStatus("cpu", averageCpuUsage);
    const inNetworkStatus = getUsageStatus("network", bytesToMB(averageinNetworkUsage));
    const outNetworkStatus = getUsageStatus("network", bytesToMB(averageOutNetworkUsage));

    const metricsData = [
        {
            title: creditsBalanceTitle,
            value: lastCpuCreditBalanceEc2,
            icon: Zap,
            color: "blue",
            bgColor: "bg-blue-50 dark:bg-blue-950/20",
            iconColor: "text-blue-600 dark:text-blue-400",
            borderColor: "border-l-blue-500",
            subtitle: isToday ? "Actual" : `${dateLabel}`,
            valueStyle: 'text-xl font-bold text-foreground tracking-tight',
            format: (val: number) => val.toString(),
        },
        {
            title: creditsUsageTitle,
            value: lastCpuCreditUsageEc2,
            icon: Activity,
            color: "emerald",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
            iconColor: "text-emerald-600 dark:text-emerald-400",
            borderColor: "border-l-emerald-500",
            subtitle: isToday ? "Actual" : `${dateLabel}`,
            valueStyle: 'text-xl font-bold text-foreground tracking-tight',
            format: (val: number) => val.toFixed(2),
        },
        {
            title: percentageCreditsTitle,
            value: percentageCreditsUsageEc2,
            icon: Percent,
            color: "amber",
            bgColor: "bg-amber-50 dark:bg-amber-950/20",
            iconColor: "text-amber-600 dark:text-amber-400",
            borderColor: "border-l-amber-500",
            subtitle: isToday ? "Actual" : `${dateLabel}`,
            valueStyle: 'text-xl font-bold text-foreground tracking-tight',
            format: (val: number) => `${val.toFixed(1)}%`,
        },
        {
            title: creditsEfficiencyTitle,
            value: creditsEfficiencyEc2,
            icon: TrendingUp,
            color: "violet",
            bgColor: "bg-violet-50 dark:bg-violet-950/20",
            iconColor: "text-violet-600 dark:text-violet-400",
            borderColor: "border-l-violet-500",
            subtitle: isToday ? "Actual" : `${dateLabel}`,
            valueStyle: 'text-sm font-bold text-foreground tracking-tight',
            format: (val: string | number) => val.toString(),
        },
        {
            title: usageCpuTitle,
            value: `${averageCpuUsage.toFixed(2)} %`,
            icon: Cpu,
            color: "blue",
            bgColor: "bg-blue-50 dark:bg-blue-950/20",
            iconColor: "text-blue-600 dark:text-blue-400",
            borderColor: "border-l-blue-500",
            subtitle: isToday ? "Actual" : `${dateLabel}`,
            valueStyle: 'text-xl font-bold text-foreground tracking-tight',
            usage: cpuStatus?.message,
            usageIcon: cpuStatus?.icon,
            usageStyle: cpuStatus?.style,
            format: (val: number) => val.toString(),
        },
        {
            title: inNetworkTitle,
            value: `${bytesToMB(averageinNetworkUsage)} Mbs`,
            icon: Network,
            color: "blue",
            bgColor: "bg-blue-50 dark:bg-blue-950/20",
            iconColor: "text-blue-600 dark:text-blue-400",
            borderColor: "border-l-blue-500",
            subtitle: isToday ? "Actual" : `${dateLabel}`,
            valueStyle: 'text-xl font-bold text-foreground tracking-tight',
            usage: inNetworkStatus?.message,
            usageIcon: inNetworkStatus?.icon,
            usageStyle: inNetworkStatus?.style,
            format: (val: number) => val.toString(),
        },
        {
            title: outNetworkTitle,
            value: `${bytesToMB(averageOutNetworkUsage)} Mbs`,
            icon: Network,
            color: "blue",
            bgColor: "bg-blue-50 dark:bg-blue-950/20",
            iconColor: "text-blue-600 dark:text-blue-400",
            borderColor: "border-l-blue-500",
            subtitle: isToday ? "Actual" : `${dateLabel}`,
            valueStyle: 'text-xl font-bold text-foreground tracking-tight',
            usage: outNetworkStatus?.message,
            usageIcon: outNetworkStatus?.icon,
            usageStyle: outNetworkStatus?.style,
            format: (val: number) => val.toString(),
        }
    ]
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                {metricsData.map((metric, index) => {
                    const IconComponent = metric.icon
                    const UsageIconComponent = metric.usageIcon || null;
                    return (
                        <Card
                            key={index}
                            className={`${metric.borderColor} border-l-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group min-h-[5vh] max-h-[30vh]`}
                        >
                            <CardContent className="p-4 flex flex-col h-full">
                                <div className="flex items-center justify-between">
                                    <div
                                        className={`p-2 rounded-lg ${metric.bgColor} transition-colors duration-200 group-hover:scale-110`}
                                    >
                                        <IconComponent className={`h-4 w-4 ${metric.iconColor}`} />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground font-medium">{metric.subtitle}</p>
                                    </div>
                                </div>
                                <h3 className="text-sm font-medium text-muted-foreground leading-tight mt-2">{metric.title}</h3>
                                <div className="mt-auto">
                                    <p className={metric.valueStyle}>{metric.format(metric.value)}</p>
                                    {
                                        metric.usage && (
                                            <span className={metric.usageStyle}>
                                                {UsageIconComponent && <UsageIconComponent className="h-4 w-4 inline-block mr-1" />}
                                                {metric.usage}
                                            </span>
                                        )
                                    }
                                </div>

                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}