import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Activity,
    Target,
    ShieldAlert,
    Zap,
    Undo2,
    Info
} from 'lucide-react';
import {
    AiFinopsMetrics,
    AiFinopsMetricsTopAction,
    RiskLevel,
    OperationalImpact,
    Reversibility
} from '@/interfaces/ai-finops-metrics/aiFinopsMetricsInterfaces';

interface AnalyzedMetricsSummaryProps {
    data: AiFinopsMetrics;
}

export const AnalyzedMetricsSummary = ({ data }: AnalyzedMetricsSummaryProps) => {
    const { metrics_summary } = data;

    return (
        <div className="space-y-6">
            <MatrixLegendPlaceholder />
            {/* Grid de Tarjetas de Métricas */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
                {metrics_summary.metrics_analyzed.map((metric, index) => (
                    <Card key={index} className="flex flex-col overflow-hidden border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="bg-muted/20 pb-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-2 capitalize">
                                <Activity className="h-5 w-5 text-blue-500" />
                                {metric.metric_name.replace(/_/g, ' ')}
                            </CardTitle>
                            <CardDescription>
                                Acciones recomendadas
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border">
                                {metric.top_3_actions.map((actionItem, idx) => (
                                    <ActionItemRow key={idx} actionItem={actionItem} index={idx} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

// --- Sub-componentes ---

const MatrixLegendPlaceholder = () => {
    return (
        <div className="w-full border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-muted/5 transition-colors hover:bg-muted/10 cursor-help">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Info className="h-5 w-5" />
                <h4 className="font-semibold text-sm uppercase tracking-wide">Leyenda Matriz</h4>
            </div>
            <p className="text-xs text-muted-foreground max-w-lg">
                <span className="font-medium mx-1">Riesgo</span>,
                <span className="font-medium mx-1">Impacto Operacional</span> y
                <span className="font-medium mx-1">Reversibilidad</span>.
            </p>
        </div>
    );
};

const ActionItemRow = ({ actionItem, index }: { actionItem: AiFinopsMetricsTopAction, index: number }) => {
    return (
        <div className="p-4 hover:bg-muted/50 transition-colors group">
            <div className="flex items-start gap-3 mb-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0 mt-0.5 dark:bg-blue-900 dark:text-blue-300">
                    {index + 1}
                </span>
                <p className="text-sm font-medium leading-relaxed text-foreground">
                    {actionItem.action}
                </p>
            </div>

            {/* Contenedor de badges */}
            <div className="pl-9 flex flex-wrap gap-2">

                {/* 1. Target Professional */}
                <AttributeBadge
                    icon={<Target className="h-3 w-3 shrink-0" />}
                    title="Rol"
                    label={actionItem.target_professional}
                    colorClass="bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                />

                {/* 2. Risk Level */}
                <RiskBadge level={actionItem.risk_level} />

                {/* 3. Operational Impact */}
                <ImpactBadge impact={actionItem.operational_impact} />

                {/* 4. Reversibility */}
                <ReversibilityBadge reversibility={actionItem.reversibility} />

            </div>
        </div>
    );
};

// --- Helpers para Badges (Etiquetas) ---

interface AttributeBadgeProps {
    icon: React.ReactNode;
    title: string;
    label: string;
    colorClass: string;
}

const AttributeBadge = ({ icon, title, label, colorClass }: AttributeBadgeProps) => (
    <span className={`inline-flex items-start sm:items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] sm:text-xs border h-auto whitespace-normal ${colorClass}`}>
        <span className="mt-0.5 sm:mt-0">{icon}</span>
        <span className="flex flex-col sm:flex-row sm:gap-1">
            <span className="font-bold opacity-90 uppercase tracking-wider text-[9px] sm:text-[10px] sm:self-center">{title}:</span>
            <span className="font-medium">{label}</span>
        </span>
    </span>
);

const RiskBadge = ({ level }: { level: RiskLevel }) => {
    let color = "bg-gray-100 text-gray-800 border-gray-200"; // Default

    if (level.includes('LOW')) color = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800";
    else if (level.includes('MEDIUM')) color = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800";
    else if (level.includes('HIGH')) color = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800";

    return (
        <AttributeBadge
            icon={<ShieldAlert className="h-3 w-3 shrink-0" />}
            title="Riesgo"
            label={level}
            colorClass={color}
        />
    );
};

const ImpactBadge = ({ impact }: { impact: OperationalImpact }) => {
    let color = "bg-gray-100 text-gray-800 border-gray-200";

    if (impact.includes('NONE') || impact.includes('LOW')) color = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800";
    else if (impact.includes('MEDIUM')) color = "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800";
    else if (impact.includes('HIGH')) color = "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800";

    return (
        <AttributeBadge
            icon={<Zap className="h-3 w-3 shrink-0" />}
            title="Impacto"
            label={impact}
            colorClass={color}
        />
    );
};

const ReversibilityBadge = ({ reversibility }: { reversibility: Reversibility }) => {
    let color = "bg-gray-100 text-gray-800 border-gray-200";

    if (reversibility.includes('EASY')) color = "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/30 dark:text-teal-400 dark:border-teal-800";
    else if (reversibility.includes('MEDIUM')) color = "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800";
    else color = "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800";

    return (
        <AttributeBadge
            icon={<Undo2 className="h-3 w-3 shrink-0" />}
            title="Reversibilidad"
            label={reversibility}
            colorClass={color}
        />
    );
}