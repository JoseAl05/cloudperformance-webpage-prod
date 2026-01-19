'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IntraCloudCompute, IntraCloudComputeMetricsSummary } from '@/interfaces/vista-intracloud/compute/intraCloudComputeInterfaces';
import { formatMetric } from '@/lib/metricUtils';
import { cn } from '@/lib/utils';
import { Server, CircuitBoard, AlertTriangle, CheckCircle2, TrendingUp, Info, LucideIcon, Zap, Gauge, HelpCircle } from 'lucide-react';
import { bytesToGB } from '@/lib/bytesToMbs';

interface IntraCloudComputeCardsComponentProps {
    data?: IntraCloudCompute[];
}

const gridColsMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4"
};

const getMetricUnit = (metricName: string): string => {
    const name = metricName.toLowerCase();
    if (name.includes('percent') || name.includes('percentage') || name.includes('cpuutilization')) return '%';
    if (name.includes('credits') || name.includes('credit')) return 'Créditos';
    if (name.includes('iops')) return 'IOPS';
    if (name.includes('bytes') || name.includes('storage used') || name.includes('memory') || name.includes('networkin') || name.includes('networkout') || name.includes('freestorage')) return 'GB';
    if (name.includes('connections')) return 'Conexiones';
    return '';
};

type ResourceStatus = 'underutilized' | 'overutilized' | 'healthy' | 'unknown';

interface ScenarioFactor {
    label: string;
    value: string;
    condition: string;
}

interface StatusAnalysis {
    status: ResourceStatus;
    label: string;
    colorClass: string;
    icon: LucideIcon;
    scenarioTitle?: string;
    factors: ScenarioFactor[];
}

const analyzeResourceStatus = (metrics: IntraCloudComputeMetricsSummary[]): StatusAnalysis => {
    const cpuMetric = metrics.find(m =>
        m.metric_name.toLowerCase().includes('percentage cpu') ||
        m.metric_name.toLowerCase().includes('cpuutilization')
    );
    const memPercentMetric = metrics.find(m =>
        m.metric_name.toLowerCase().includes('memory percent') ||
        m.metric_name.toLowerCase().includes('memory usage')
    );
    const memAvailableMetric = metrics.find(m =>
        m.metric_name.toLowerCase() === 'available memory' ||
        m.metric_name.toLowerCase().includes('available memory bytes')
    );

    if (!cpuMetric) {
        return {
            status: 'unknown',
            label: 'Sin Datos',
            colorClass: 'bg-slate-100 text-slate-500 border-slate-200',
            icon: HelpCircle,
            factors: []
        };
    }

    const cpuVal = cpuMetric.avg_value;

    const memPercentVal = memPercentMetric ? memPercentMetric.avg_value : 0;

    const memAvailableBytes = memAvailableMetric ? memAvailableMetric.avg_value : 0;

    const memAvailableGB_Numeric = memAvailableBytes / (1024 * 1024 * 1024);

    if (cpuVal === 0 && memAvailableBytes === 0) {
        return {
            status: 'unknown',
            label: 'Sin Datos',
            colorClass: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
            icon: HelpCircle,
            factors: []
        };
    }

    const highCpu = cpuVal > 85;
    const highMemPercent = memPercentMetric && memPercentVal > 90;

    const lowMemAvailable = memAvailableBytes > 0 && memAvailableGB_Numeric < 0.2;

    if (highCpu || highMemPercent || lowMemAvailable) {
        const factors: ScenarioFactor[] = [];

        if (highCpu) {
            factors.push({ label: "CPU Promedio", value: `${formatMetric(cpuVal)}%`, condition: "> 85%" });
        }
        if (highMemPercent) {
            factors.push({ label: "Uso Memoria", value: `${formatMetric(memPercentVal)}%`, condition: "> 90%" });
        }
        if (lowMemAvailable && memAvailableMetric) {
            factors.push({
                label: "Mem. Disponible",
                value: `${bytesToGB(memAvailableBytes)} GB`,
                condition: "< 0.2 GB"
            });
        }

        return {
            status: 'overutilized',
            label: 'Sobreutilizado',
            scenarioTitle: 'Sobrecarga de Recursos',
            colorClass: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400',
            icon: TrendingUp,
            factors
        };
    }

    const lowCpu = cpuVal < 10;
    let lowMem = true;
    if (memPercentMetric) {
        lowMem = memPercentVal < 30;
    }

    if (lowCpu && lowMem) {
        const factors: ScenarioFactor[] = [];
        factors.push({ label: "CPU Promedio", value: `${formatMetric(cpuVal)}%`, condition: "< 10%" });

        if (memPercentMetric) {
            factors.push({ label: "Uso Memoria", value: `${formatMetric(memPercentVal)}%`, condition: "< 30%" });
        } else if (memAvailableBytes > 0 && memAvailableGB_Numeric > 4) {
            factors.push({
                label: "Mem. Disponible",
                value: `${bytesToGB(memAvailableBytes)} GB`,
                condition: "> 4 GB"
            });
        }

        return {
            status: 'underutilized',
            label: 'Infrautilizado',
            scenarioTitle: 'Posible Sobredimensionamiento',
            colorClass: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400',
            icon: AlertTriangle,
            factors
        };
    }

    return {
        status: 'healthy',
        label: 'Saludable',
        colorClass: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400',
        icon: CheckCircle2,
        factors: []
    };
};

const ThresholdLegend = () => {
    return (
        <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-lg p-3 mb-6 text-xs text-muted-foreground shadow-sm">
            <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 shrink-0">
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>Criterios de Análisis:</span>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3">
                <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-slate-200 dark:bg-slate-800">
                        <HelpCircle className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-slate-600 dark:text-slate-400">Sin Datos</span>
                        <span className="text-[10px] leading-snug opacity-80">Métricas en 0</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-amber-100 dark:bg-amber-900/50">
                        <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-amber-700 dark:text-amber-400">Infrautilizado</span>
                        <span className="text-[10px] leading-snug opacity-80">
                            CPU &lt; 10% y (RAM &lt; 30% ó &gt; 4GB Disp.)
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-red-100 dark:bg-red-900/50">
                        <TrendingUp className="w-3 h-3 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-red-700 dark:text-red-400">Sobreutilizado</span>
                        <span className="text-[10px] leading-snug opacity-80">
                            CPU &gt; 85% ó RAM Crítica
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-emerald-100 dark:bg-emerald-900/50">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">Saludable</span>
                        <span className="text-[10px] leading-snug opacity-80">Valores normales</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const IntraCloudComputeCardsByTenantComponent = ({ data }: IntraCloudComputeCardsComponentProps) => {
    if (!data || data.length === 0) {
        return <div className="text-muted-foreground text-sm">No hay datos de cómputo para mostrar.</div>;
    }

    const colsClass = gridColsMap[data.length] ?? "grid-cols-3";

    return (
        <div className="w-full">
            <ThresholdLegend />
            <div className={cn("grid gap-6", colsClass)}>
                {data.map((tenant, index) => {
                    const sortedMetrics = [...tenant.metrics_summary].sort((a, b) =>
                        a.metric_name.localeCompare(b.metric_name)
                    );

                    const analysis = analyzeResourceStatus(tenant.metrics_summary);
                    const StatusIcon = analysis.icon;

                    return (
                        <Card
                            key={tenant.tenant_id}
                            className="border-l-4 shadow-sm duration-200 border-l-indigo-500 overflow-hidden flex flex-col"
                        >
                            <CardHeader className="pb-3 bg-slate-50/50 dark:bg-slate-900/20 border-b">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                                            <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                                Tenant {index + 1}
                                            </CardTitle>
                                        </div>
                                    </div>

                                    <Badge variant="outline" className={cn("flex items-center gap-1.5 font-semibold", analysis.colorClass)}>
                                        <StatusIcon className="w-3.5 h-3.5" />
                                        {analysis.label}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-4 flex-1 space-y-4">

                                {analysis.factors.length > 0 && (
                                    <div className={cn(
                                        "rounded-md p-3 border text-sm",
                                        analysis.status === 'overutilized'
                                            ? "bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/50"
                                            : "bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/50"
                                    )}>
                                        <div className="flex items-center gap-2 mb-2">
                                            {analysis.status === 'overutilized' ? (
                                                <Gauge className="w-4 h-4 text-red-600 dark:text-red-400" />
                                            ) : (
                                                <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                            )}
                                            <span className={cn(
                                                "font-semibold",
                                                analysis.status === 'overutilized' ? "text-red-800 dark:text-red-300" : "text-amber-800 dark:text-amber-300"
                                            )}>
                                                {analysis.scenarioTitle}
                                            </span>
                                        </div>

                                        <div className="space-y-1 pl-1">
                                            {analysis.factors.map((factor, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-xs">
                                                    <span className="text-muted-foreground">{factor.label}:</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono font-medium text-slate-700 dark:text-slate-200">
                                                            {factor.value}
                                                        </span>
                                                        <span className={cn(
                                                            "px-1.5 py-0.5 rounded text-[10px] font-medium",
                                                            analysis.status === 'overutilized'
                                                                ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                                                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                                                        )}>
                                                            {factor.condition}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {analysis.status === 'unknown' && (
                                    <div className="rounded-md p-3 border text-sm bg-slate-50 border-slate-100 text-slate-500 italic text-center">
                                        No se detectaron métricas de uso recientes.
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-2">
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <Info className="w-3 h-3" /> Métricas
                                    </h4>
                                    {sortedMetrics.length > 0 ? (
                                        sortedMetrics.map((metric, mIndex) => {
                                            const unit = getMetricUnit(metric.metric_name);
                                            let metricValue: string | number;

                                            if (
                                                (metric.metric_name.toLowerCase().includes("memory") && !metric.metric_name.toLowerCase().includes("percent")) ||
                                                metric.metric_name.toLowerCase().includes("storage used") || metric.metric_name.toLowerCase().includes("bytes") ||
                                                metric.metric_name.toLowerCase().includes("networkin") ||
                                                metric.metric_name.toLowerCase().includes("networkout") ||
                                                metric.metric_name.toLowerCase().includes("freestorage")
                                            ) {
                                                metricValue = bytesToGB(metric.avg_value);
                                            } else {
                                                metricValue = formatMetric(metric.avg_value);
                                            }

                                            return (
                                                <div
                                                    key={`${tenant.tenant_id}-${metric.metric_name}-${mIndex}`}
                                                    className="flex items-center justify-between p-2 rounded-md border border-transparent"
                                                >
                                                    <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                                                        <CircuitBoard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span className="text-sm text-slate-700 dark:text-slate-300 truncate" title={metric.metric_name}>
                                                            {metric.metric_name}
                                                        </span>
                                                    </div>

                                                    <div className="text-right whitespace-nowrap">
                                                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                                            {metricValue} <span className="text-xs font-normal text-muted-foreground">{unit}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-2 text-sm text-muted-foreground italic">
                                            Sin métricas
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    )
}