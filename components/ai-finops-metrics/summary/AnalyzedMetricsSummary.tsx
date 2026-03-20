import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Activity,
    Target,
    ShieldAlert,
    Zap,
    Undo2,
    Info,
    Filter,
    X,
    ChevronDown
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

const FILTER_OPTIONS: {
    category: string;
    icon: React.ReactNode;
    activeClass: string;
    borderAccent: string;
    values: string[];
}[] = [
    {
        category: 'Rol',
        icon: <Target className="h-3.5 w-3.5" />,
        activeClass: 'bg-slate-700 text-white border-slate-700 dark:bg-slate-300 dark:text-slate-900 dark:border-slate-300',
        borderAccent: 'border-l-slate-400 dark:border-l-slate-500',
        values: ['DevOps/SRE', 'Finance', 'Cloud Architect', 'Software Engineer'],
    },
    {
        category: 'Riesgo',
        icon: <ShieldAlert className="h-3.5 w-3.5" />,
        activeClass: 'bg-amber-500 text-white border-amber-500 dark:bg-amber-500 dark:text-white dark:border-amber-500',
        borderAccent: 'border-l-amber-400 dark:border-l-amber-500',
        values: [
            'LOW (Safe to Apply)',
            'MEDIUM (Testing Required)',
            'HIGH (Potential Downtime / Breaking Change / Difficult to Revert)',
        ],
    },
    {
        category: 'Impacto',
        icon: <Zap className="h-3.5 w-3.5" />,
        activeClass: 'bg-orange-500 text-white border-orange-500 dark:bg-orange-500 dark:text-white dark:border-orange-500',
        borderAccent: 'border-l-orange-400 dark:border-l-orange-500',
        values: [
            'NONE (Not affecting production operation)',
            'LOW (Might affect production operations)',
            'MEDIUM (Significant impact on production operations)',
            'HIGH (Critical impact on production operations)',
        ],
    },
    {
        category: 'Reversibilidad',
        icon: <Undo2 className="h-3.5 w-3.5" />,
        activeClass: 'bg-violet-500 text-white border-violet-500 dark:bg-violet-500 dark:text-white dark:border-violet-500',
        borderAccent: 'border-l-violet-400 dark:border-l-violet-500',
        values: [
            'EASY (Can be easily reversed if needed)',
            'MEDIUM (Requires careful planning to reverse)',
            'HARD (Very difficult or impossible to reverse)',
            'NOT REVERSIBLE (Cannot be reversed on any condition)',
        ],
    },
];

const getFilterLabel = (value: string): string => {
    const prefix = value.split('(')[0].trim();
    if (prefix === 'NOT REVERSIBLE') return 'Not Reversible';
    return prefix.charAt(0) + prefix.slice(1).toLowerCase();
};

const actionMatchesFilters = (action: AiFinopsMetricsTopAction, activeFilters: Set<string>): boolean => {
    if (activeFilters.size === 0) return true;
    return (
        activeFilters.has(action.target_professional) ||
        activeFilters.has(action.risk_level) ||
        activeFilters.has(action.operational_impact) ||
        activeFilters.has(action.reversibility)
    );
};

export const AnalyzedMetricsSummary = ({ data }: AnalyzedMetricsSummaryProps) => {
    const { metrics_summary } = data;
    const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

    const toggleFilter = (value: string) => {
        setActiveFilters((prev) => {
            const next = new Set(prev);
            if (next.has(value)) {
                next.delete(value);
            } else {
                next.add(value);
            }
            return next;
        });
    };

    const clearFilters = () => setActiveFilters(new Set());

    const filteredMetrics = useMemo(() => {
        return metrics_summary.metrics_analyzed
            .map((metric) => ({
                ...metric,
                filteredActions: metric.top_3_actions.filter((action) =>
                    actionMatchesFilters(action, activeFilters)
                ),
            }))
            .filter((metric) => metric.filteredActions.length > 0);
    }, [metrics_summary.metrics_analyzed, activeFilters]);

    return (
        <div className="space-y-6">
            <MatrixLegend />

            <FilterBar
                activeFilters={activeFilters}
                onToggle={toggleFilter}
                onClear={clearFilters}
            />

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
                {filteredMetrics.map((metric, index) => (
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
                                {metric.filteredActions.map((actionItem, idx) => (
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

const LEGEND_SECTIONS: {
    icon: React.ReactNode;
    title: string;
    description: string;
    borderClass: string;
    iconBgClass: string;
    items: { label: string; detail: string; dotClass: string }[];
}[] = [
    {
        icon: <Target className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />,
        title: 'Rol Objetivo',
        description: 'Perfil profesional responsable de ejecutar o aprobar la acción recomendada.',
        borderClass: 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20',
        iconBgClass: 'bg-slate-200/70 dark:bg-slate-700/50',
        items: [
            { label: 'DevOps/SRE', detail: '— Ingeniero de infraestructura y confiabilidad', dotClass: 'bg-slate-400 dark:bg-slate-500' },
            { label: 'Finance', detail: '— Responsable de presupuesto y control de costos', dotClass: 'bg-slate-400 dark:bg-slate-500' },
            { label: 'Cloud Architect', detail: '— Arquitecto de soluciones y gobernanza cloud', dotClass: 'bg-slate-400 dark:bg-slate-500' },
            { label: 'Software Engineer', detail: '— Desarrollador de aplicaciones y servicios', dotClass: 'bg-slate-400 dark:bg-slate-500' },
        ],
    },
    {
        icon: <ShieldAlert className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />,
        title: 'Nivel de Riesgo',
        description: 'Probabilidad de que la acción cause interrupciones, errores o efectos no deseados al aplicarse.',
        borderClass: 'border-amber-200 dark:border-amber-800/50 bg-amber-50/30 dark:bg-amber-950/10',
        iconBgClass: 'bg-amber-100 dark:bg-amber-900/40',
        items: [
            { label: 'Low', detail: '— Segura de aplicar sin pruebas previas', dotClass: 'bg-emerald-500' },
            { label: 'Medium', detail: '— Requiere validación en ambiente de pruebas', dotClass: 'bg-yellow-500' },
            { label: 'High', detail: '— Posible downtime, breaking change o difícil de revertir', dotClass: 'bg-red-500' },
        ],
    },
    {
        icon: <Zap className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />,
        title: 'Impacto Operacional',
        description: 'Grado en que la acción puede afectar la operación productiva mientras se implementa o después de aplicarse.',
        borderClass: 'border-orange-200 dark:border-orange-800/50 bg-orange-50/30 dark:bg-orange-950/10',
        iconBgClass: 'bg-orange-100 dark:bg-orange-900/40',
        items: [
            { label: 'None', detail: '— Sin efecto sobre la operación productiva', dotClass: 'bg-emerald-500' },
            { label: 'Low', detail: '— Podría afectar marginalmente la operación', dotClass: 'bg-emerald-400' },
            { label: 'Medium', detail: '— Impacto significativo en producción', dotClass: 'bg-yellow-500' },
            { label: 'High', detail: '— Impacto crítico en producción', dotClass: 'bg-red-500' },
        ],
    },
    {
        icon: <Undo2 className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />,
        title: 'Reversibilidad',
        description: 'Facilidad con la que se puede deshacer la acción y volver al estado anterior si el resultado no es el esperado.',
        borderClass: 'border-violet-200 dark:border-violet-800/50 bg-violet-50/30 dark:bg-violet-950/10',
        iconBgClass: 'bg-violet-100 dark:bg-violet-900/40',
        items: [
            { label: 'Easy', detail: '— Se puede revertir fácilmente si es necesario', dotClass: 'bg-emerald-500' },
            { label: 'Medium', detail: '— Requiere planificación cuidadosa para revertir', dotClass: 'bg-yellow-500' },
            { label: 'Hard', detail: '— Muy difícil o imposible de revertir', dotClass: 'bg-red-500' },
            { label: 'Not Reversible', detail: '— No se puede revertir bajo ninguna condición', dotClass: 'bg-red-700 dark:bg-red-600' },
        ],
    },
];

const MatrixLegend = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-muted/40 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-400/10">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </span>
                    <div className="text-left">
                        <h4 className="font-semibold text-sm text-foreground">Leyenda Matriz de Decisión</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Criterios de evaluación para cada acción recomendada</p>
                    </div>
                </div>
                <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isOpen && (
                <div className="border-t border-border px-5 pb-5 pt-4 grid gap-4 sm:grid-cols-2">
                    {LEGEND_SECTIONS.map((section) => (
                        <div
                            key={section.title}
                            className={`rounded-lg border p-4 space-y-3 ${section.borderClass}`}
                        >
                            <div className="flex items-center gap-2.5">
                                <span className={`flex items-center justify-center w-7 h-7 rounded-md ${section.iconBgClass}`}>
                                    {section.icon}
                                </span>
                                <span className="text-sm font-bold text-foreground">{section.title}</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{section.description}</p>
                            <div className="space-y-1.5">
                                {section.items.map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-start gap-2.5 group"
                                    >
                                        <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${item.dotClass}`} />
                                        <div>
                                            <span className="text-xs font-semibold text-foreground">{item.label}</span>
                                            <span className="text-xs text-muted-foreground ml-1.5">{item.detail}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface FilterBarProps {
    activeFilters: Set<string>;
    onToggle: (value: string) => void;
    onClear: () => void;
}

const FilterBar = ({ activeFilters, onToggle, onClear }: FilterBarProps) => {
    const activeCount = activeFilters.size;

    return (
        <div className="w-full rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/20">
                <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-400/10">
                        <Filter className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </span>
                    <div className="flex items-center gap-2.5">
                        <span className="text-sm font-semibold text-foreground">Filtros</span>
                        {activeCount > 0 && (
                            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-indigo-500 text-white text-[10px] font-bold">
                                {activeCount}
                            </span>
                        )}
                    </div>
                </div>
                {activeCount > 0 && (
                    <button
                        onClick={onClear}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
                    >
                        <X className="h-3 w-3" />
                        Limpiar
                    </button>
                )}
            </div>
            <div className="divide-y divide-border/50">
                {FILTER_OPTIONS.map((group) => (
                    <div key={group.category} className={`flex flex-wrap items-center gap-2.5 px-5 py-3 border-l-[3px] ${group.borderAccent}`}>
                        <div className="flex items-center gap-1.5 w-28 shrink-0 text-muted-foreground">
                            {group.icon}
                            <span className="text-xs font-bold uppercase tracking-wider">
                                {group.category}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {group.values.map((value) => {
                                const isActive = activeFilters.has(value);
                                return (
                                    <button
                                        key={value}
                                        onClick={() => onToggle(value)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                                            isActive
                                                ? `${group.activeClass} shadow-sm`
                                                : 'bg-background text-muted-foreground border-border hover:border-foreground/25 hover:text-foreground'
                                        }`}
                                    >
                                        {getFilterLabel(value)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
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
    else if (level.includes('MEDIUM')) color = "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800";
    else if (level.includes('HIGH')) color = "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800";

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

    if (impact.includes('NONE') || impact.includes('LOW')) color = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800";
    else if (impact.includes('MEDIUM')) color = "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800";
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

    if (reversibility.includes('EASY')) color = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800";
    else if (reversibility.includes('MEDIUM')) color = "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800";
    else color = "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800";

    return (
        <AttributeBadge
            icon={<Undo2 className="h-3 w-3 shrink-0" />}
            title="Reversibilidad"
            label={reversibility}
            colorClass={color}
        />
    );
}