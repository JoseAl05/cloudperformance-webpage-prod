'use client'

import { useState, useMemo } from 'react';
import {
    RecommendationStatusGroup,
    RecommendationStatus
} from '@/interfaces/ai-recommendations/aiRecommendations';
import {
    ChevronDown,
    ChevronUp,
    History,
    Calendar,
    MessageSquare,
    ListChecks,
    BookOpen,
    Lightbulb,
    FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AiRecommendationStatusHistoryComponentProps {
    data: RecommendationStatusGroup[] | null;
}

const STATUS_STYLES: Record<RecommendationStatus, string> = {
    'En ejecución': 'bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800',
    'Finalizada': 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800',
    'Rechazada': 'bg-red-100 text-red-900 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800',
    'Pospuesta': 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800',
};

const STATUS_DOT_COLOR: Record<RecommendationStatus, string> = {
    'En ejecución': 'bg-blue-500 dark:bg-blue-400',
    'Finalizada': 'bg-emerald-500 dark:bg-emerald-400',
    'Rechazada': 'bg-red-500 dark:bg-red-400',
    'Pospuesta': 'bg-amber-500 dark:bg-amber-400',
};

const cleanText = (text: string) => {
    if (!text) return '';
    return text.replace(/\s*\(?\[[^\]]+\]\([^)]+\)\)?/g, '').trim();
};

const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('es', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
    }).format(new Date(dateStr));
};

interface StatusGroupCardProps {
    group: RecommendationStatusGroup;
}

const StatusGroupCard = ({ group }: StatusGroupCardProps) => {
    const [expanded, setExpanded] = useState(false);

    const sortedReports = useMemo(
        () => [...group.reports].sort(
            (a, b) => new Date(a.status_assigned_at).getTime() - new Date(b.status_assigned_at).getTime()
        ),
        [group.reports]
    );

    if (sortedReports.length === 0) return null;

    const latest = sortedReports[sortedReports.length - 1];
    const isMultipleResources = Array.isArray(latest.resource_name);
    const displayTitle = isMultipleResources
        ? `Múltiples recursos afectados (${latest.resource_name.length})`
        : latest.resource_name;

    return (
        <div className="border rounded-xl bg-card overflow-hidden shadow-sm transition-all hover:shadow-md">
            <Button
                onClick={() => setExpanded(!expanded)}
                variant="ghost"
                className="w-full h-auto whitespace-normal cursor-pointer flex flex-col items-stretch sm:flex-row sm:items-center justify-between p-4 text-left gap-4 hover:bg-muted/30 transition-colors"
            >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-1 flex-shrink-0 h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <History className="h-5 w-5 text-purple-700 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-base font-semibold truncate text-slate-900 dark:text-slate-100">
                                {displayTitle}
                            </h3>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                                {latest.cloud_provider}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                                {latest.resource_type}
                            </span>
                        </div>
                        <p className="text-sm font-normal text-slate-600 dark:text-slate-400 line-clamp-1">
                            {latest.recommendation_subtype}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 sm:ml-4 flex-shrink-0">
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400 mb-1">Cambios</span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 tabular-nums">
                            {sortedReports.length}
                        </span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400 mb-1">Estado actual</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${STATUS_STYLES[latest.execution_status]}`}>
                            {latest.execution_status}
                        </span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400 mb-1">Última actualización</span>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                            {formatDate(latest.status_assigned_at)}
                        </span>
                    </div>
                    <div className="ml-2 text-slate-500">
                        {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                </div>
            </Button>

            {expanded && (
                <div className="border-t bg-muted/10 p-4 sm:p-6 space-y-6">

                    <div className="bg-card border rounded-lg p-5">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                            <Lightbulb className="h-4 w-4 text-amber-500" />
                            Resumen de la recomendación
                        </h4>
                        <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                            {cleanText(latest.recommendation_summary)}
                        </p>
                        <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-600 dark:text-slate-400">
                            <div>
                                <strong className="text-slate-900 dark:text-slate-200 font-semibold block">Recomendación creada</strong>
                                <span className="tabular-nums">{formatDate(latest.recommendation_created_at)}</span>
                            </div>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-200 font-semibold block">ID Reporte de origen</strong>
                                <code className="text-xs font-mono break-all">{latest.report_id}</code>
                            </div>
                            <div className="sm:col-span-2">
                                <strong className="text-slate-900 dark:text-slate-200 font-semibold block">ID Grupo de recomendación</strong>
                                <code className="text-xs font-mono break-all">{group.recommendation_group_id}</code>
                            </div>
                        </div>
                    </div>

                    {isMultipleResources ? (
                        <div className="bg-card border rounded-lg p-5">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                                <ListChecks className="h-4 w-4 text-indigo-500" />
                                Recursos Afectados
                            </h4>
                            <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-800 dark:text-slate-200 max-h-48 overflow-y-auto">
                                {(latest.resource_name as string[]).map((name, idx) => (
                                    <li key={idx} className="truncate font-medium" title={name}>
                                        {name} - {Array.isArray(latest.resource_id) ? latest.resource_id[idx] : ''}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="bg-card border rounded-lg p-5">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                                <FileText className="h-4 w-4 text-indigo-500" />
                                Recurso
                            </h4>
                            <div className="text-sm text-slate-800 dark:text-slate-200 space-y-1">
                                <div>
                                    <strong className="text-slate-900 dark:text-white font-semibold">Nombre:</strong> {latest.resource_name as string}
                                </div>
                                <div className="break-all">
                                    <strong className="text-slate-900 dark:text-white font-semibold">ID:</strong> <code className="text-xs font-mono">{latest.resource_id as string}</code>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        <div>
                            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                                <ListChecks className="h-4 w-4 text-emerald-500" />
                                Plan de Acción
                            </h4>

                            {latest.action_plan.prerequisites && latest.action_plan.prerequisites.length > 0 && (
                                <div className="mb-5">
                                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Prerrequisitos:</span>
                                    <ul className="list-disc list-inside space-y-1.5 mt-2 text-sm text-slate-800 dark:text-slate-200">
                                        {latest.action_plan.prerequisites.map((req, idx) => (
                                            <li key={idx} className="leading-relaxed">
                                                <strong className="text-slate-900 dark:text-white font-semibold">{req.title}</strong>: {cleanText(req.description)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Pasos de Remediación:</span>
                            <ol className="list-decimal list-inside space-y-2.5 mt-2 text-sm text-slate-800 dark:text-slate-200 mb-4">
                                {latest.action_plan.remediation_steps.map((step, idx) => (
                                    <li key={idx} className="leading-relaxed">
                                        <strong className="text-slate-900 dark:text-white font-semibold">{step.title}</strong>: {cleanText(step.description)}
                                    </li>
                                ))}
                            </ol>

                            {latest.action_plan.references && latest.action_plan.references.length > 0 && (
                                <div className="mt-5 pt-5 border-t">
                                    <h5 className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100 mb-3 uppercase tracking-wider">
                                        <BookOpen className="h-4 w-4" />
                                        Referencias Técnicas
                                    </h5>
                                    <ul className="space-y-2">
                                        {latest.action_plan.references.map((ref, idx) => (
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

                        <div>
                            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                                <History className="h-4 w-4 text-purple-500" />
                                Línea de Tiempo de Estados ({sortedReports.length})
                            </h4>
                            <div className="relative">
                                {sortedReports.map((report, idx) => {
                                    const isLatest = idx === sortedReports.length - 1;
                                    return (
                                        <div key={`${report.status_assigned_at}-${idx}`} className="relative pb-6 last:pb-0">
                                            {!isLatest && (
                                                <div className="absolute left-[7px] top-5 bottom-0 w-px bg-border" aria-hidden="true" />
                                                )}
                                            <div className="flex gap-4">
                                                <div className="flex-shrink-0 mt-1.5">
                                                    <div className={`h-3.5 w-3.5 rounded-full ${STATUS_DOT_COLOR[report.execution_status]} ${isLatest ? 'ring-2 ring-offset-2 ring-offset-card ring-purple-300 dark:ring-purple-700' : ''}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${STATUS_STYLES[report.execution_status]}`}>
                                                            {report.execution_status}
                                                        </span>
                                                        {isLatest && (
                                                            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                                                                Actual
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                                        <Calendar className="h-3 w-3" />
                                                        <span className="tabular-nums">{formatDate(report.status_assigned_at)}</span>
                                                    </div>
                                                    {report.comment && report.comment.trim().length > 0 && (
                                                        <div className="mt-2 flex items-start gap-2 bg-muted/40 border rounded p-2.5 text-sm text-slate-700 dark:text-slate-300">
                                                            <MessageSquare className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-slate-500" />
                                                            <span className="leading-relaxed italic">{cleanText(report.comment)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const AiRecommendationStatusHistoryComponent = ({ data }: AiRecommendationStatusHistoryComponentProps) => {
    if (!data || data.length === 0) {
        return (
            <div className="w-full p-8 text-center bg-card border rounded-xl shadow-sm">
                <History className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Sin historial de estados</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Aún no se han asignado estados a recomendaciones de IA.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <History className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Historial de Recomendaciones Gestionadas ({data.length})
            </h2> */}
            {data.map((group) => (
                <StatusGroupCard key={group.recommendation_group_id} group={group} />
            ))}
        </div>
    );
};