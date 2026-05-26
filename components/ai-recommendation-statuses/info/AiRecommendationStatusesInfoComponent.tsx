'use client'

import { useState, useMemo, useEffect } from 'react';
import {
    RecommendationStatusGroup,
    RecommendationStatus,
    RecommendationStatusGroupReport,
    CreateJiraTicketResponse,
    BatchValidationResponse,
    TicketValidationResult
} from '@/interfaces/ai-recommendations/aiRecommendations';
import {
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    History,
    Calendar,
    MessageSquare,
    ListChecks,
    BookOpen,
    Lightbulb,
    FileText,
    Search,
    ArrowUpDown,
    Activity,
    Loader2,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    Ticket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useConnector } from '@/hooks/useConnectors';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface AiRecommendationStatusesInfoComponentProps {
    data: RecommendationStatusGroup[];
}

const CREATE_JIRA_TICKET_KEY = '/api/connector/bridge/connector/jira/create_ticket';
const VALIDATE_JIRA_TICKETS_KEY = '/api/connector/bridge/connector/jira/validate_tickets';


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

const ALL_STATUSES: RecommendationStatus[] = ['En ejecución', 'Finalizada', 'Rechazada', 'Pospuesta'];

const ITEMS_PER_PAGE = 15;
const COLLAPSED_TIMELINE_LIMIT = 4;

type SortField = 'latest_activity' | 'most_changes';
type SortDirection = 'asc' | 'desc';

export const createJiraTicketFetcher = async (
    url: string,
    { arg }: { arg: unknown }
): Promise<CreateJiraTicketResponse> => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const detail = typeof data?.detail === 'string' ? data.detail : response.statusText;
        throw new Error(`${detail} (${response.status})`);
    }

    return response.json() as Promise<CreateJiraTicketResponse>;
};

export const validateJiraTicketsBatchFetcher = async (
    [url, payload]: [string, string]
): Promise<BatchValidationResponse> => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const detail = typeof data?.detail === 'string' ? data.detail : response.statusText;
        throw new Error(`${detail} (${response.status})`);
    }

    return response.json() as Promise<BatchValidationResponse>;
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

interface GroupCardProps {
    group: RecommendationStatusGroup;
    sortedReports: RecommendationStatusGroupReport[];
    allExecutionStatuses: {
        execution_status: RecommendationStatus;
        status_assigned_at: string;
    }[];
    validationResult: TicketValidationResult | undefined;
    isValidatingBatch: boolean;
}

const GroupCard = ({ group, sortedReports, allExecutionStatuses, validationResult, isValidatingBatch }: GroupCardProps) => {
    const [expanded, setExpanded] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [createdTicket, setCreatedTicket] = useState<{ key: string; url: string } | null>(null);

    const { connectors } = useConnector();
    const hasConnectors = connectors && connectors.length > 0;

    const jiraConnector = useMemo(
        () => connectors?.find((conn) => conn.connector_type === 'jira'),
        [connectors]
    );

    useEffect(() => {
        if (!feedback) return;
        const id = setTimeout(() => setFeedback(null), 5000);
        return () => clearTimeout(id);
    }, [feedback]);


    const { trigger, isMutating } = useSWRMutation(
        CREATE_JIRA_TICKET_KEY,
        createJiraTicketFetcher
    );

    if (sortedReports.length === 0) return null;

    const latest = sortedReports[sortedReports.length - 1];
    const isMultipleResources = Array.isArray(latest.resource_name);
    const displayTitle = isMultipleResources
        ? `Múltiples recursos afectados (${latest.resource_name.length})`
        : latest.resource_name;
    const canCreateTicket = latest.execution_status === 'En ejecución';
    const jiraPayload = {
        report_id: latest.report_id,
        recommendation_group_id: group.recommendation_group_id,
        cloud_provider: latest.cloud_provider,
        resource_type: latest.resource_type,
        recommendation_subtype: latest.recommendation_subtype,
        resource_id: latest.resource_id,
        resource_name: latest.resource_name,
        recommendation_summary: latest.recommendation_summary,
        action_plan: latest.action_plan,
        actual_execution_status: latest.execution_status,
        execution_status_history: allExecutionStatuses,
        status_assigned_at: latest.status_assigned_at,
        recommendation_created_at: latest.recommendation_created_at,
        comment: latest.comment
    };

    const handleCreateTicket = async () => {
        if (isMutating) return;
        setFeedback(null);
        try {
            const response = await trigger(jiraPayload);
            const jiraBaseUrl = jiraConnector?.config?.jira_url;
            if (response?.key && jiraBaseUrl) {
                setCreatedTicket({
                    key: response.key,
                    url: `${jiraBaseUrl.replace(/\/$/, '')}/browse/${response.key}`,
                });
            }
            setFeedback({ type: 'success', message: 'Ticket creado correctamente en Jira' });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al crear el ticket en Jira';
            setFeedback({ type: 'error', message });
        }
    };

    return (
        <div className="border rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
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
                        <div className="mt-3 space-y-1.5" aria-label="Historial de estados">
                            {sortedReports.length > COLLAPSED_TIMELINE_LIMIT && (
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 italic">
                                    <span>+{sortedReports.length - COLLAPSED_TIMELINE_LIMIT} eventos anteriores</span>
                                </div>
                            )}
                            {sortedReports.slice(-COLLAPSED_TIMELINE_LIMIT).map((report, idx, arr) => {
                                const isLastInPreview = idx === arr.length - 1;
                                const isLatestOverall = isLastInPreview && arr.length === sortedReports.slice(-COLLAPSED_TIMELINE_LIMIT).length;
                                return (
                                    <div key={`preview-${idx}`} className="flex items-center gap-2 text-xs">
                                        <span className={`block h-2 w-2 rounded-full flex-shrink-0 ${STATUS_DOT_COLOR[report.execution_status]}`} />
                                        <span className={`font-semibold px-1.5 py-0.5 rounded border ${STATUS_STYLES[report.execution_status]}`}>
                                            {report.execution_status}
                                        </span>
                                        <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                                            {formatDate(report.status_assigned_at)}
                                        </span>
                                        {isLatestOverall && (
                                            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                                                Actual
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
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
                    {hasConnectors ? (
                        <div className='flex flex-col items-end gap-2'>
                            <div className='flex gap-2'>
                                {connectors.map(conn => {
                                    const connectorType = conn.connector_type;
                                    if (connectorType !== 'jira') return null;

                                    const activeTicket = createdTicket ?? latest.jira_ticket;
                                    const isFreshlyCreated = createdTicket?.key === activeTicket?.key;
                                    const isCheckingThisKey = !isFreshlyCreated && Boolean(activeTicket) && isValidatingBatch && !validationResult;
                                    const isInvalidTicket = !isFreshlyCreated && Boolean(activeTicket) && validationResult && !validationResult.exists;

                                    if (activeTicket && isCheckingThisKey) {
                                        return (
                                            <div
                                                key={activeTicket.key}
                                                className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-slate-300/50 bg-slate-100/50 dark:bg-slate-800/50 dark:border-slate-700/50 text-sm text-slate-600 dark:text-slate-400"
                                                aria-live="polite"
                                            >
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                                                <span className="font-mono tabular-nums text-xs">{activeTicket.key}</span>
                                                <span className="hidden sm:inline text-xs opacity-75">Verificando…</span>
                                            </div>
                                        );
                                    }

                                    if (activeTicket && !isInvalidTicket) {
                                        return (
                                            <Link
                                                key={activeTicket.key}
                                                href={activeTicket.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={cn(
                                                    'group inline-flex items-center gap-2.5 h-9 pl-2.5 pr-3 rounded-md',
                                                    'border border-emerald-500/30 bg-emerald-500/5',
                                                    'text-sm text-emerald-700 dark:text-emerald-300',
                                                    'transition-all duration-200',
                                                    'hover:bg-emerald-500/10 hover:border-emerald-500/50',
                                                    'hover:shadow-sm hover:shadow-emerald-500/10',
                                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40'
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        'flex items-center justify-center h-5 w-5 rounded',
                                                        'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
                                                        'group-hover:bg-emerald-500/25 transition-colors'
                                                    )}
                                                >
                                                    <Ticket className="h-3 w-3" aria-hidden="true" />
                                                </span>
                                                <span className="font-mono tabular-nums text-xs font-semibold tracking-tight">
                                                    {activeTicket.key}
                                                </span>
                                                <span className="hidden sm:inline text-xs opacity-75 group-hover:opacity-100 transition-opacity">
                                                    Ver ticket
                                                </span>
                                                <ExternalLink
                                                    className="h-3.5 w-3.5 flex-shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                                                    aria-hidden="true"
                                                />
                                            </Link>
                                        );
                                    }

                                    if (!canCreateTicket) {
                                        return null;
                                    }

                                    return (
                                        <Button
                                            key={conn.connector_type}
                                            variant='outline'
                                            size='sm'
                                            onClick={handleCreateTicket}
                                            disabled={isMutating}
                                            className='gap-2 border-blue-600/20 hover:bg-blue-600 hover:border-black/20 hover:text-white dark:hover:bg-blue-400 dark:hover:border-blue-white dark:hover:text-black dark:border-blue-400 transition-all transition-duration-500 disabled:opacity-70 disabled:cursor-not-allowed'
                                        >
                                            {isMutating ? (
                                                <>
                                                    <Loader2 className='h-4 w-4 animate-spin' />
                                                    Creando ticket...
                                                </>
                                            ) : (
                                                'Crear ticket en Jira'
                                            )}
                                        </Button>
                                    );
                                })}
                            </div>

                            {feedback && (
                                <div
                                    role={feedback.type === 'error' ? 'alert' : 'status'}
                                    className={cn(
                                        'flex items-center gap-2 text-sm px-3 py-2 rounded-md border animate-in fade-in slide-in-from-top-1 duration-200',
                                        feedback.type === 'success'
                                            ? 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800'
                                            : 'bg-red-50 text-red-900 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800'
                                    )}
                                >
                                    {feedback.type === 'success' ? (
                                        <CheckCircle2 className='h-4 w-4 flex-shrink-0' />
                                    ) : (
                                        <AlertCircle className='h-4 w-4 flex-shrink-0' />
                                    )}
                                    <span>{feedback.message}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <div className="flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-yellow-400" />
                                <p className="text-sm text-yellow-700">
                                    No hay conectores disponibles para crear tickets.
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="border rounded-lg p-5">
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
                        <div className="border rounded-lg p-5">
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
                        <div className="border rounded-lg p-5">
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
                                                            <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
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

export const AiRecommendationStatusesInfoComponent = ({ data }: AiRecommendationStatusesInfoComponentProps) => {
    const [statusFilter, setStatusFilter] = useState<Set<RecommendationStatus>>(new Set(ALL_STATUSES));
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('latest_activity');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [currentPage, setCurrentPage] = useState(1);

    const validationItems = useMemo<ValidationItem[]>(() => {
        if (!data || data.length === 0) return [];
        const items: ValidationItem[] = [];
        for (const group of data) {
            const latestReport = [...group.reports].sort(
                (a, b) => new Date(a.status_assigned_at).getTime() - new Date(b.status_assigned_at).getTime()
            ).at(-1);
            const ticketKey = latestReport?.jira_ticket?.key;
            if (ticketKey && latestReport) {
                items.push({
                    issue_key: ticketKey,
                    rec_group_id: group.recommendation_group_id,
                    cloud_provider: latestReport.cloud_provider,
                });
            }
        }
        return items;
    }, [data]);

    const stablePayload = useMemo(() => {
        const sortedItems = [...validationItems].sort((a, b) => a.issue_key.localeCompare(b.issue_key));
        return JSON.stringify({ items: sortedItems });
    }, [validationItems]);

    const { data: validationData, isLoading: isValidatingBatch } = useSWR<BatchValidationResponse>(
        validationItems.length > 0 ? [VALIDATE_JIRA_TICKETS_KEY, stablePayload] : null,
        validateJiraTicketsBatchFetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            shouldRetryOnError: false,
            dedupingInterval: 30_000,
        }
    );

    const validationResults = validationData?.results ?? {};

    const allExecutionStatuses = useMemo(
        () => data.flatMap(group => group.reports.map(report => ({
            execution_status: report.execution_status,
            status_assigned_at: report.status_assigned_at,
        }))),
        [data]
    );

    const enriched = useMemo(() => {
        return data.map((group) => {
            const sortedReports = [...group.reports].sort(
                (a, b) => new Date(a.status_assigned_at).getTime() - new Date(b.status_assigned_at).getTime()
            );
            const latest = sortedReports[sortedReports.length - 1];
            return {
                group,
                sortedReports,
                latest,
                latestTimestamp: latest ? new Date(latest.status_assigned_at).getTime() : 0,
                changesCount: sortedReports.length,
            };
        }).filter((entry) => entry.latest !== undefined);
    }, [data]);

    const stats = useMemo(() => {
        const counts: Record<RecommendationStatus, number> = {
            'En ejecución': 0,
            'Finalizada': 0,
            'Rechazada': 0,
            'Pospuesta': 0,
        };
        let totalEvents = 0;
        for (const entry of enriched) {
            counts[entry.latest.execution_status] += 1;
            totalEvents += entry.changesCount;
        }
        return { counts, totalEvents };
    }, [enriched]);

    const filtered = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return enriched.filter((entry) => {
            if (!statusFilter.has(entry.latest.execution_status)) return false;
            if (q.length === 0) return true;

            const names = Array.isArray(entry.latest.resource_name)
                ? entry.latest.resource_name.join(' ')
                : entry.latest.resource_name;
            const haystack = [
                names,
                entry.latest.recommendation_subtype,
                entry.latest.resource_type,
                entry.latest.recommendation_summary,
            ].join(' ').toLowerCase();
            return haystack.includes(q);
        });
    }, [enriched, statusFilter, searchQuery]);

    const sorted = useMemo(() => {
        const dir = sortDirection === 'desc' ? 1 : -1;
        return [...filtered].sort((a, b) => {
            if (sortField === 'latest_activity') {
                return (b.latestTimestamp - a.latestTimestamp) * dir;
            }
            return (b.changesCount - a.changesCount) * dir;
        });
    }, [filtered, sortField, sortDirection]);

    const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginated = sorted.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

    const toggleStatusFilter = (value: RecommendationStatus) => {
        setStatusFilter((prev) => {
            const next = new Set(prev);
            if (next.has(value)) {
                next.delete(value);
            } else {
                next.add(value);
            }
            return next;
        });
        setCurrentPage(1);
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const getPageNumbers = (): (number | 'ellipsis')[] => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages: (number | 'ellipsis')[] = [1];
        if (safePage > 3) pages.push('ellipsis');
        for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
            pages.push(i);
        }
        if (safePage < totalPages - 2) pages.push('ellipsis');
        pages.push(totalPages);
        return pages;
    };

    if (!data || data.length === 0) {
        return (
            <div className="w-full p-8 text-center bg-card border rounded-xl shadow-sm">
                <History className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Sin historial de estados</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    No se han registrado gestiones de estado en el rango seleccionado.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <div className="border border-blue-200 dark:border-blue-900 rounded-xl p-5">
                <h2 className="text-lg font-bold text-blue-950 dark:text-blue-100 mb-4 flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Resumen de Gestión de Recomendaciones
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="border rounded-lg p-3">
                        <span className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                            Total
                        </span>
                        <span className="text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
                            {enriched.length}
                        </span>
                    </div>
                    <div className="border rounded-lg p-3">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            Eventos
                        </span>
                        <span className="text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
                            {stats.totalEvents}
                        </span>
                    </div>
                    {ALL_STATUSES.map((status) => (
                        <div key={status} className="border rounded-lg p-3">
                            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border mb-1 ${STATUS_STYLES[status]}`}>
                                {status}
                            </span>
                            <span className="block text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
                                {stats.counts[status]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="relative flex-1 lg:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <Input
                            type="text"
                            placeholder="Buscar por nombre, tipo o resumen..."
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSort('latest_activity')}
                            className={`gap-1.5 text-xs cursor-pointer ${sortField === 'latest_activity' ? 'border-blue-400 dark:border-blue-600' : ''}`}
                        >
                            <Calendar className="h-3.5 w-3.5" />
                            Última actualización
                            {sortField === 'latest_activity' && (
                                sortDirection === 'desc'
                                    ? <ChevronDown className="h-3.5 w-3.5" />
                                    : <ChevronUp className="h-3.5 w-3.5" />
                            )}
                            {sortField !== 'latest_activity' && <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSort('most_changes')}
                            className={`gap-1.5 text-xs cursor-pointer ${sortField === 'most_changes' ? 'border-blue-400 dark:border-blue-600' : ''}`}
                        >
                            <Activity className="h-3.5 w-3.5" />
                            Más cambios
                            {sortField === 'most_changes' && (
                                sortDirection === 'desc'
                                    ? <ChevronDown className="h-3.5 w-3.5" />
                                    : <ChevronUp className="h-3.5 w-3.5" />
                            )}
                            {sortField !== 'most_changes' && <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mr-1">
                        Estado:
                    </span>
                    {ALL_STATUSES.map((status) => {
                        const active = statusFilter.has(status);
                        return (
                            <button
                                key={status}
                                onClick={() => toggleStatusFilter(status)}
                                className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${active ? STATUS_STYLES[status] : 'bg-transparent text-slate-400 border-slate-200 dark:border-slate-700 dark:text-slate-500 opacity-60 hover:opacity-100'}`}
                            >
                                {status}
                            </button>
                        );
                    })}
                </div>

                <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Recomendaciones Gestionadas ({sorted.length}{sorted.length !== enriched.length ? ` de ${enriched.length}` : ''})
                </h3>

                {paginated.length === 0 && (
                    <div className="text-center py-10 text-sm text-slate-500 dark:text-slate-400 border rounded-xl bg-card">
                        No hay recomendaciones que coincidan con los filtros seleccionados.
                    </div>
                )}

                {paginated.map((entry) => {
                    const latestReport = entry.sortedReports[entry.sortedReports.length - 1];
                    const ticketKey = latestReport?.jira_ticket?.key;
                    const validationResult = ticketKey ? validationResults[ticketKey] : undefined;

                    return (
                        <GroupCard
                            key={entry.group.recommendation_group_id}
                            group={entry.group}
                            sortedReports={entry.sortedReports}
                            allExecutionStatuses={allExecutionStatuses}
                            validationResult={validationResult}
                            isValidatingBatch={isValidatingBatch}
                        />
                    );
                })}

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1 pt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={safePage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="h-8 w-8 p-0 cursor-pointer"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {getPageNumbers().map((page, idx) =>
                            page === 'ellipsis' ? (
                                <span key={`ellipsis-${idx}`} className="px-1 text-sm text-muted-foreground">…</span>
                            ) : (
                                <Button
                                    key={page}
                                    variant={safePage === page ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    className="h-8 w-8 p-0 text-xs cursor-pointer"
                                >
                                    {page}
                                </Button>
                            )
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={safePage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="h-8 w-8 p-0 cursor-pointer"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};