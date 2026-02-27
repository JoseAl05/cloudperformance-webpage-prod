'use client'

import { useState } from 'react';
import {
    AiRecommendationReport,
    AiRecommendationResource
} from '@/interfaces/ai-recommendations/aiRecommendations';
import {
    ChevronDown,
    ChevronUp,
    DollarSign,
    ShieldAlert,
    Activity,
    ListChecks,
    BookOpen,
    Lightbulb,
    Bot,
    Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AiRecommendationsPDF } from '@/components/AiRecommendationsPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';

interface AiRecommendationsComponentProps {
    data: AiRecommendationReport[] | null;
}

const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

const getRiskStyles = (risk: string) => {
    const r = risk.toLowerCase();
    if (r.includes('low') || r.includes('bajo')) {
        return 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800';
    }
    if (r.includes('medium') || r.includes('medio')) {
        return 'bg-yellow-100 text-yellow-900 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800';
    }
    if (r.includes('high') || r.includes('alto')) {
        return 'bg-red-100 text-red-900 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800';
    }
    return 'bg-slate-100 text-slate-900 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
};

// Función para limpiar los enlaces markdown tipo ([texto](url)) o [texto](url) de los strings
const cleanText = (text: string) => {
    if (!text) return '';
    return text.replace(/\s*\(?\[[^\]]+\]\([^)]+\)\)?/g, '').trim();
};

const ResourceCard = ({ resource }: { resource: AiRecommendationResource }) => {
    const [expanded, setExpanded] = useState(false);
    const { diagnosis, impact_matrix, action_plan, resource_name, resource_id } = resource;

    // Validación para saber si es un array de recursos
    const isMultipleResources = Array.isArray(resource_name);
    const displayTitle = isMultipleResources
        ? `Múltiples recursos afectados (${resource_name.length})`
        : resource_name;

    return (
        <div className="border rounded-xl bg-card overflow-hidden shadow-sm transition-all hover:shadow-md">
            {/* Header de la Tarjeta */}
            <Button
                onClick={() => setExpanded(!expanded)}
                variant="ghost"
                className="w-full h-auto whitespace-normal cursor-pointer flex flex-col items-stretch sm:flex-row sm:items-center justify-between p-4 text-left gap-4 hover:bg-muted/30 transition-colors"
            >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-1 flex-shrink-0 h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-base font-semibold truncate text-slate-900 dark:text-slate-100">
                                {displayTitle}
                            </h3>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                                {resource.resource_type}
                            </span>
                        </div>
                        <p className="text-sm font-normal text-slate-600 dark:text-slate-400 line-clamp-1">
                            {resource.recommendation_subtype} • {cleanText(diagnosis.summary)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 sm:ml-4 flex-shrink-0">
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400 mb-1">Ahorro Est.</span>
                        <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {formatCurrency(impact_matrix.savings_value, impact_matrix.currency)}
                        </span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400 mb-1">Riesgo</span>
                        <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded border ${getRiskStyles(impact_matrix.risk_level.level)}`}
                            title={impact_matrix.risk_level.description}
                        >
                            {impact_matrix.risk_level.level}
                        </span>
                    </div>
                    <div className="ml-2 text-slate-500">
                        {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                </div>
            </Button>

            {/* Cuerpo Expandible */}
            {expanded && (
                <div className="border-t bg-muted/10 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">

                    <div className="space-y-6">
                        {/* Nueva sección: Recursos Afectados (Solo visible si es array) */}
                        {isMultipleResources && (
                            <div>
                                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                                    <ListChecks className="h-4 w-4 text-indigo-500" />
                                    Recursos Afectados
                                </h4>
                                <div className="bg-card border rounded-lg p-4 max-h-48 overflow-y-auto shadow-inner">
                                    <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-800 dark:text-slate-200">
                                        {(resource_name as string[]).map((name, idx) => (
                                            <li key={idx} className="truncate font-medium text-slate-900 dark:text-slate-100" title={name}>
                                                {name} - {resource_id[idx]}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        <div>
                            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                                <Lightbulb className="h-4 w-4 text-amber-500" />
                                Diagnóstico y Justificación
                            </h4>
                            <div className="space-y-4 text-sm text-slate-800 dark:text-slate-200">
                                <p><strong className="text-slate-900 dark:text-white font-semibold">Resumen:</strong> {cleanText(diagnosis.summary)}</p>
                                <p><strong className="text-slate-900 dark:text-white font-semibold">Justificación Técnica:</strong> {cleanText(diagnosis.technical_justification)}</p>
                                <p><strong className="text-slate-900 dark:text-white font-semibold">Contraste de Contexto:</strong> {cleanText(diagnosis.context_contrast)}</p>
                            </div>
                        </div>

                        <div className="bg-card border rounded-lg p-5">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                                <Activity className="h-4 w-4 text-blue-500" />
                                Análisis de Facturación
                            </h4>
                            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                                {cleanText(diagnosis.billing_analysis)}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                                <ShieldAlert className="h-4 w-4 text-rose-500" />
                                Matriz de Impacto
                            </h4>

                            <div className="overflow-hidden border border-border rounded-lg shadow-sm">
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead className="bg-[#4472C4] dark:bg-blue-800 text-white">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold w-1/3 border-r border-blue-400 dark:border-blue-700">Dimensión</th>
                                            <th className="px-4 py-3 font-semibold w-2/3">Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-foreground">
                                        <tr className="bg-[#D9E1F2] dark:bg-slate-800/60 border-b border-border">
                                            <td className="px-4 py-3 font-bold border-r border-border text-slate-900 dark:text-slate-200 align-top">Ahorro</td>
                                            <td className="px-4 py-3 align-top font-medium text-slate-800 dark:text-slate-200">
                                                {impact_matrix.estimated_savings}
                                            </td>
                                        </tr>
                                        <tr className="bg-background border-b border-border">
                                            <td className="px-4 py-3 font-bold border-r border-border text-slate-900 dark:text-slate-200 align-top">Riesgo</td>
                                            <td className="px-4 py-3 align-top">
                                                <span className="block font-semibold text-slate-900 dark:text-slate-100">{impact_matrix.risk_level.level}</span>
                                                <span className="block text-sm text-slate-700 dark:text-slate-300 mt-1">{cleanText(impact_matrix.risk_level.description)}</span>
                                            </td>
                                        </tr>
                                        <tr className="bg-[#D9E1F2] dark:bg-slate-800/60 border-b border-border">
                                            <td className="px-4 py-3 font-bold border-r border-border text-slate-900 dark:text-slate-200 align-top">Impacto operativo</td>
                                            <td className="px-4 py-3 align-top">
                                                <span className="block font-semibold text-slate-900 dark:text-slate-100">{impact_matrix.operational_impact.level}</span>
                                                <span className="block text-sm text-slate-700 dark:text-slate-300 mt-1">{cleanText(impact_matrix.operational_impact.description)}</span>
                                            </td>
                                        </tr>
                                        <tr className="bg-background border-b border-border">
                                            <td className="px-4 py-3 font-bold border-r border-border text-slate-900 dark:text-slate-200 align-top">Reversibilidad</td>
                                            <td className="px-4 py-3 align-top">
                                                <span className="block font-semibold text-slate-900 dark:text-slate-100">{impact_matrix.reversibility.level}</span>
                                                <span className="block text-sm text-slate-700 dark:text-slate-300 mt-1">{cleanText(impact_matrix.reversibility.description)}</span>
                                            </td>
                                        </tr>
                                        <tr className="bg-[#D9E1F2] dark:bg-slate-800/60">
                                            <td className="px-4 py-3 font-bold border-r border-border text-slate-900 dark:text-slate-200 align-top">Tiempo de ejecución</td>
                                            <td className="px-4 py-3 align-top">
                                                <span className="block font-semibold text-slate-900 dark:text-slate-100">{impact_matrix.execution_time.estimated_time}</span>
                                                <span className="block text-sm text-slate-700 dark:text-slate-300 mt-1">{cleanText(impact_matrix.execution_time.description)}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div>
                            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                                <ListChecks className="h-4 w-4 text-emerald-500" />
                                Plan de Acción
                            </h4>

                            {action_plan.prerequisites && action_plan.prerequisites.length > 0 && (
                                <div className="mb-5">
                                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Prerrequisitos:</span>
                                    <ul className="list-disc list-inside space-y-1.5 mt-2 text-sm text-slate-800 dark:text-slate-200">
                                        {action_plan.prerequisites.map((req, idx) => (
                                            <li key={idx} className="leading-relaxed">
                                                <strong className="text-slate-900 dark:text-white font-semibold">{req.title}</strong>: {cleanText(req.description)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Pasos de Remediación:</span>
                            <ol className="list-decimal list-inside space-y-2.5 mt-2 text-sm text-slate-800 dark:text-slate-200 mb-4">
                                {action_plan.remediation_steps.map((step, idx) => (
                                    <li key={idx} className="leading-relaxed">
                                        <strong className="text-slate-900 dark:text-white font-semibold">{step.title}</strong>: {cleanText(step.description)}
                                    </li>
                                ))}
                            </ol>

                            {action_plan.references.length > 0 && (
                                <div className="mt-5 pt-5 border-t">
                                    <h5 className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100 mb-3 uppercase tracking-wider">
                                        <BookOpen className="h-4 w-4" />
                                        Referencias Técnicas
                                    </h5>
                                    <ul className="space-y-2">
                                        {action_plan.references.map((ref, idx) => (
                                            <li key={idx} className="text-sm">
                                                <a
                                                    href={ref.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 flex items-start gap-1 font-medium"
                                                >
                                                    <span className="truncate">{cleanText(ref.title)}</span>
                                                    <span className="text-xs text-slate-500 ml-2 font-normal">({ref.relevance})</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const AiRecommendationsComponent = ({ data }: AiRecommendationsComponentProps) => {

    if (!data || data.length === 0) {
        return (
            <div className="w-full p-8 text-center bg-card border rounded-xl shadow-sm">
                <Bot className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Sin recomendaciones de IA</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    El modelo no ha generado insights automáticos para este conjunto de datos o rango de fechas.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {data.map((report) => (
                <div key={report.report_id} className="space-y-4">
                    {/* Cabecera del Reporte */}
                    <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl p-5 sm:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h2 className="text-lg font-bold text-blue-950 dark:text-blue-100 mb-2 flex items-center gap-2">
                                        <Bot className="h-5 w-5" />
                                        Resumen Ejecutivo IA ({report.cloud_provider})
                                    </h2>
                                    <p className="text-sm text-blue-950/80 dark:text-blue-200/90 leading-relaxed font-medium">
                                        {cleanText(report.executive_summary)}
                                    </p>
                                </div>
                                <div className="bg-white/80 dark:bg-black/20 rounded-lg p-4 border border-blue-200/60 dark:border-blue-800/50">
                                    <span className="block text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider mb-3">
                                        Estrategias de Priorización
                                    </span>
                                    <ul className="space-y-2">
                                        {report.prioritization_strategy.map((strategy, idx) => (
                                            <li key={idx} className="text-sm text-slate-800 dark:text-slate-200">
                                                <strong className="text-slate-900 dark:text-white font-semibold">{strategy.strategy_name}: </strong>
                                                <span>{cleanText(strategy.description)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="flex-shrink-0 bg-white dark:bg-slate-900 border border-border rounded-xl p-5 min-w-[200px] text-center shadow-sm">
                                <span className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">
                                    Ahorro mensual total identificado
                                </span>
                                <span className="text-3xl font-black text-emerald-700 dark:text-emerald-400">
                                    {formatCurrency(report.total_monthly_savings)}
                                </span>
                                {report.sync_time && (
                                    <span className="block text-xs text-slate-400 mt-1">
                                        Fecha Observación: {new Date(report.sync_time).toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Lista de Recursos / Recomendaciones */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">
                            Hallazgos Detallados ({report.resources.length})
                        </h3>
                        {[...report.resources]
                            .sort((a, b) => b.impact_matrix.savings_value - a.impact_matrix.savings_value)
                            .map((resource, index) => {
                                const resourceKey = Array.isArray(resource.resource_id)
                                    ? resource.resource_id.join('-')
                                    : resource.resource_id;

                                return <ResourceCard key={`${resourceKey}-${index}`} resource={resource} />;
                            })}
                    </div>
                </div>
            ))}
        </div>
    );
};