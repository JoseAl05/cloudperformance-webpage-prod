'use client'

import { useState, useEffect, useMemo } from 'react';
import {
    AiRecommendationReport,
    AiRecommendationResource,
    RecommendationStatus,
    RecommendationStatusEvent,
    AssignExecutionStatusResponse
} from '@/interfaces/ai-recommendations/aiRecommendations';
import {
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    ShieldAlert,
    Activity,
    ListChecks,
    BookOpen,
    Lightbulb,
    Bot,
    ArrowUpDown,
    ClipboardCheck,
    CircleDashed,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    X,
    Loader2,
    History,
    Check,
    Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import useSWRMutation from 'swr/mutation';
import { AiRecommendationsStatusDialogComponent } from '@/components/AiRecommendationsStatusDialogComponent';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';

interface AiRecommendationsComponentProps {
    data: AiRecommendationReport[] | null;
    cloud: string;
}

type FetcherError = Error & { status?: number };

type StatusFeedback = {
    recommendation_updated: boolean;
    status_event_created: boolean;
    error?: string;
};

interface StatusFeedbackToastProps {
    feedback: StatusFeedback;
    onDismiss: () => void;
}

interface StatusSectionProps {
    resource: AiRecommendationResource;
    onSubmit: (newStatus: RecommendationStatus, comment: string) => Promise<void>;
    onOpenHistory: () => void;
}

interface ResourceCardProps {
    resource: AiRecommendationResource;
    onStatusChange: (newStatus: RecommendationStatus, comment: string) => Promise<void>;
    onOpenHistory: () => void;
}

type SortField = 'savings' | 'potential' | 'risk';

type PotentialConfidence = 'High' | 'Medium' | 'Low' | 'Not applicable';
type SortDirection = 'desc' | 'asc';
type StatusFilterValue = RecommendationStatus | 'unassigned';

interface FindingsSectionProps {
    resources: AiRecommendationResource[];
    onStatusChange: (resourceIndex: number, newStatus: RecommendationStatus, comment: string) => Promise<void>;
    onOpenHistory: (resourceIndex: number) => void;
}



const STATUS_OPTIONS: RecommendationStatus[] = ['En ejecución', 'Finalizada', 'Rechazada', 'Pospuesta'];

const STATUS_STYLES: Record<RecommendationStatus, string> = {
    'En ejecución': 'bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800',
    'Finalizada': 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800',
    'Rechazada': 'bg-red-100 text-red-900 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800',
    'Pospuesta': 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800',
};

const UNASSIGNED_BADGE = 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';

const RISK_ORDER: Record<string, number> = { high: 3, alto: 3, medium: 2, medio: 2, low: 1, bajo: 1 };

const CONFIDENCE_LABELS: Record<PotentialConfidence, string> = {
    'High': 'Alta',
    'Medium': 'Media',
    'Low': 'Baja',
    'Not applicable': 'No aplica',
};

const CONFIDENCE_STYLES: Record<PotentialConfidence, string> = {
    'High': 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800',
    'Medium': 'bg-sky-100 text-sky-900 border-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-800',
    'Low': 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800',
    'Not applicable': 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
};

const CONFIDENCE_HINTS: Record<PotentialConfidence, string> = {
    'High': 'El escenario optimista coincide con el conservador: no queda ningún supuesto por validar.',
    'Medium': 'La cifra está tarificada con exactitud. Lo único pendiente es una decisión comercial, como aceptar un plazo de compromiso mayor.',
    'Low': 'La cifra está tarificada con exactitud, pero depende de una premisa técnica que la evidencia no confirma. Es un techo a investigar.',
    'Not applicable': 'El motor no pudo cuantificar ningún ahorro para este hallazgo.',
};

const ITEMS_PER_PAGE = 10;

const ALL_STATUS_FILTERS: StatusFilterValue[] = ['En ejecución', 'Finalizada', 'Rechazada', 'Pospuesta', 'unassigned'];

const statusFetcher = async (
    url: string,
    { arg }: { arg: RecommendationStatusEvent }
): Promise<AssignExecutionStatusResponse> => {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg),
    });
    if (!response.ok) {
        const err: FetcherError = new Error(`Request failed with status ${response.status}`);
        err.status = response.status;
        throw err;
    }
    return response.json();
};

const formatCurrency = (amount: number, currency: string = 'USD') => {
    const value = new Intl.NumberFormat('es-CL', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
    return `${value} ${currency}`;
};

const formatRatio = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
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

const cleanText = (text: string) => {
    if (!text) return '';
    return text.replace(/\s*\(?\[[^\]]+\]\([^)]+\)\)?/g, '').trim();
};

const computeRecommendationGroupId = (resource: AiRecommendationResource, cloudProvider: string): string => {
    return resource.rec_group_id;
};

const getRiskWeight = (level: string): number => {
    return RISK_ORDER[level.toLowerCase()] ?? 0;
};

const normalizeConfidence = (value?: string): PotentialConfidence => {
    if (value === 'High' || value === 'Medium' || value === 'Low') return value;
    return 'Not applicable';
};

const ConfidenceBadge = ({ value, className = '' }: { value?: string; className?: string }) => {
    const level = normalizeConfidence(value);
    return (
        <span
            className={`text-xs font-semibold px-2 py-0.5 rounded border whitespace-nowrap ${CONFIDENCE_STYLES[level]} ${className}`}
            title={CONFIDENCE_HINTS[level]}
        >
            {CONFIDENCE_LABELS[level]}
        </span>
    );
};

const SavingsScenarioSummary = ({
    conservative,
    optimistic,
    confidence,
    syncTime,
}: {
    conservative: number;
    optimistic?: number | null;
    confidence?: string;
    syncTime?: string | Date | null;
}) => {
    const optimisticValue = typeof optimistic === 'number' ? optimistic : 0;
    const hasUpside = optimisticValue > conservative + 0.01;
    const upside = Math.max(optimisticValue - conservative, 0);
    const ratio = conservative > 0 ? optimisticValue / conservative : 0;
    const provenShare = optimisticValue > 0
        ? Math.min(100, Math.max(0, (conservative / optimisticValue) * 100))
        : 100;

    return (
        <div className="w-full bg-card border border-border rounded-xl p-5 shadow-sm">
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                Escenarios de ahorro mensual
            </span>

            <div className="flex items-baseline justify-between gap-4">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                    Conservador
                </span>
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 leading-none tabular-nums">
                    {formatCurrency(conservative)}
                </span>
            </div>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Demostrado con datos
            </span>

            {hasUpside && (
                <>
                    <div className="flex items-baseline justify-between gap-4 mt-4">
                        <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                            Optimista
                        </span>
                        <span className="text-2xl font-black text-amber-700 dark:text-amber-400 leading-none tabular-nums">
                            {formatCurrency(optimisticValue)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 mt-1">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {ratio > 0 ? `${formatRatio(ratio)}x el conservador` : 'Requiere validación'}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">Confianza</span>
                            <ConfidenceBadge value={confidence} />
                        </span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-amber-400 dark:bg-amber-600 overflow-hidden mt-4">
                        <div
                            className="h-full rounded-full bg-emerald-600 dark:bg-emerald-500"
                            style={{ width: `${provenShare}%` }}
                        />
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug mt-3">
                        El escenario optimista <strong>ya incluye</strong> el conservador. No son cifras sumables:
                        los {formatCurrency(upside)} restantes son la misma acción valorada con supuestos que el
                        cliente debe validar.
                    </p>
                </>
            )}

            {!hasUpside && (
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug mt-4">
                    No se identificó un escenario optimista distinto del conservador para este reporte.
                </p>
            )}

            {syncTime && (
                <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-border">
                    Fecha observación: {new Date(syncTime).toLocaleString()}
                </span>
            )}
        </div>
    );
};

const StatusFeedbackToast = ({ feedback, onDismiss }: StatusFeedbackToastProps) => {
    const { recommendation_updated, status_event_created, error } = feedback;
    const allOk = recommendation_updated && status_event_created;
    const allFailed = !recommendation_updated && !status_event_created;
    const partial = !allOk && !allFailed;

    const headerStyle = allOk
        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 border-b border-emerald-200 dark:border-emerald-900'
        : partial
            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100 border-b border-amber-200 dark:border-amber-900'
            : 'bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-100 border-b border-red-200 dark:border-red-900';

    const HeaderIcon = allOk ? CheckCircle2 : partial ? AlertTriangle : XCircle;

    const headerText = allOk
        ? 'Cambio de estado completado'
        : partial
            ? 'Cambio de estado parcial'
            : 'Error al cambiar el estado';

    const renderRow = (success: boolean, label: string) => (
        <div className="flex items-center gap-2 text-sm">
            {success ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            ) : (
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
            )}
            <span className={success ? 'text-slate-800 dark:text-slate-200' : 'text-slate-700 dark:text-slate-300'}>
                {label}
            </span>
        </div>
    );

    return (
        <div
            role="status"
            aria-live="polite"
            className="fixed top-4 right-4 left-4 sm:left-auto z-50 sm:max-w-sm bg-card border border-border rounded-lg shadow-lg overflow-hidden"
        >
            <div className={`flex items-center gap-2 px-4 py-3 ${headerStyle}`}>
                <HeaderIcon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-bold flex-1">{headerText}</span>
                <button
                    onClick={onDismiss}
                    aria-label="Cerrar notificación"
                    className="opacity-70 hover:opacity-100 transition-opacity"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
            <div className="p-4 space-y-2.5">
                {renderRow(recommendation_updated, 'Recomendación actualizada')}
                {renderRow(status_event_created, 'Evento registrado en histórico')}
                {error && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 pt-3 border-t border-border">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

const StatusSection = ({ resource, onSubmit, onOpenHistory }: StatusSectionProps) => {
    const currentStatus = resource.execution_status;
    const [selected, setSelected] = useState<RecommendationStatus | ''>('');
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selected || selected === currentStatus || submitting) return;
        setSubmitting(true);
        try {
            await onSubmit(selected, comment.trim());
            setSelected('');
            setComment('');
        } finally {
            setSubmitting(false);
        }
    };

    const canSubmit = selected !== '' && selected !== currentStatus && !submitting;

    return (
        <div className="border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                    <ClipboardCheck className="h-4 w-4 text-purple-500" />
                    Estado de ejecución
                </h4>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenHistory}
                    className="gap-1.5 text-xs cursor-pointer bg-sky-900 text-white hover:bg-sky-900/90 hover:text-white dark:bg-sky-300 dark:text-black dark:hover:bg-sky-300/90"
                >
                    <History className="h-3.5 w-3.5" />
                    Seguimiento recomendación
                </Button>
            </div>

            <div className="mb-4">
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 mb-1.5 block">
                    Estado actual
                </span>
                {currentStatus ? (
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded border ${STATUS_STYLES[currentStatus]}`}>
                        {currentStatus}
                    </span>
                ) : (
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded border ${UNASSIGNED_BADGE}`}>
                        <CircleDashed className="h-3 w-3" />
                        Sin estado asignado
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                        {currentStatus ? 'Cambiar a' : 'Asignar estado'}
                    </label>
                    <Select
                        value={selected}
                        onValueChange={(value) => setSelected(value as RecommendationStatus)}
                        disabled={submitting}
                    >
                        <SelectTrigger className="w-full text-sm cursor-pointer">
                            <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_OPTIONS.map((s) => (
                                <SelectItem key={s} value={s} disabled={s === currentStatus}>
                                    {s}{s === currentStatus ? ' (actual)' : ''}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                        Comentario (opcional)
                    </label>
                    <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={2}
                        disabled={submitting}
                        placeholder="Añade contexto o justificación..."
                        className="resize-none"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    size="sm"
                    disabled={!canSubmit}
                    onClick={handleSubmit}
                    className="gap-1.5 cursor-pointer"
                >
                    {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {submitting ? 'Guardando...' : 'Guardar estado'}
                </Button>
            </div>
        </div>
    );
};

const ResourceCard = ({ resource, onStatusChange, onOpenHistory }: ResourceCardProps) => {
    const [expanded, setExpanded] = useState(false);
    const { diagnosis, impact_matrix, action_plan, resource_name, resource_id, execution_status, resource_type } = resource;

    const isMultipleResources = resource_name[0] !== 'Sin recurso asociado' && resource_name.length > 1;
    const displayTitle = isMultipleResources
        ? `Múltiples recursos afectados (${resource_name.length})`
        : resource_type.toUpperCase();

    const potentialValue = impact_matrix.potential_savings_value ?? 0;
    const hasUpside = potentialValue > impact_matrix.savings_value + 0.01;

    return (
        <div className="border rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
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
                            {resource.provider === 'CloudPerformance' && (
                                <Image
                                    width={100}
                                    height={100}
                                    src="/firma-cloudperformance-h.png"
                                    alt="CloudPerformance"
                                    className="h-4 sm:h-8 object-contain ml-1"
                                    title="Hallazgo detectado por el motor de CloudPerformance"
                                />
                            )}
                        </div>
                        <p className="text-sm font-normal text-slate-600 dark:text-slate-400 line-clamp-1">
                            {cleanText(diagnosis.summary)}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-5 sm:ml-4 flex-shrink-0">
                    <div className="flex flex-col items-end min-w-[7.5rem]">
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400 mb-1">Conservador</span>
                        <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                            {formatCurrency(impact_matrix.savings_value, impact_matrix.currency || 'USD')}
                        </span>
                    </div>
                    <div
                        className="flex flex-col items-end min-w-[7.5rem]"
                        title={hasUpside
                            ? 'Valoración alternativa de la misma acción. Ya incluye el ahorro conservador, por lo que ambas cifras no se suman.'
                            : 'Sin escenario optimista distinto del conservador.'}
                    >
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400 mb-1">Optimista</span>
                        {hasUpside ? (
                            <span className="text-sm font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                                {formatCurrency(potentialValue, impact_matrix.currency || 'USD')}
                            </span>
                        ) : (
                            <span className="text-sm font-bold text-slate-400 dark:text-slate-500">—</span>
                        )}
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400 mb-1">Confianza</span>
                        <ConfidenceBadge value={impact_matrix.potential_savings_confidence} />
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
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400 mb-1">Estado</span>
                        {execution_status ? (
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${STATUS_STYLES[execution_status]}`}>
                                {execution_status}
                            </span>
                        ) : (
                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded border ${UNASSIGNED_BADGE}`}>
                                <CircleDashed className="h-3 w-3" />
                                Sin estado
                            </span>
                        )}
                    </div>
                    <div className="ml-2 text-slate-500">
                        {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                </div>
            </Button>

            {expanded && (
                <div className="border-t bg-muted/10 p-4 sm:p-6 space-y-6">

                    <StatusSection resource={resource} onSubmit={onStatusChange} onOpenHistory={onOpenHistory} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
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

                            <div className="border rounded-lg p-5">
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
                                                <td className="px-4 py-3 font-bold border-r border-border text-slate-900 dark:text-slate-200 align-top">Ahorro conservador</td>
                                                <td className="px-4 py-3 align-top font-medium text-slate-800 dark:text-slate-200">
                                                    {impact_matrix.estimated_savings}
                                                </td>
                                            </tr>
                                            {hasUpside && (
                                                <tr className="bg-background border-b border-border">
                                                    <td className="px-4 py-3 font-bold border-r border-border text-slate-900 dark:text-slate-200 align-top">
                                                        Ahorro optimista
                                                    </td>
                                                    <td className="px-4 py-3 align-top">
                                                        <span className="flex flex-wrap items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                                                            {formatCurrency(potentialValue, impact_matrix.currency || 'USD')}
                                                            <ConfidenceBadge value={impact_matrix.potential_savings_confidence} />
                                                        </span>
                                                        <span className="block text-sm text-slate-700 dark:text-slate-300 mt-1">
                                                            {CONFIDENCE_HINTS[normalizeConfidence(impact_matrix.potential_savings_confidence)]} Esta cifra
                                                            ya incluye el ahorro conservador, por lo que no se suman.
                                                        </span>
                                                    </td>
                                                </tr>
                                            )}
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
                </div>
            )}
        </div>
    );
};

const FindingsSection = ({ resources, onStatusChange, onOpenHistory }: FindingsSectionProps) => {
    const [activeTab, setActiveTab] = useState<'all' | 'top10'>('all');
    const [sortField, setSortField] = useState<SortField>('savings');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<Set<StatusFilterValue>>(new Set(ALL_STATUS_FILTERS));

    const indexedResources = useMemo(
        () => resources.map((resource, originalIndex) => ({ resource, originalIndex })),
        [resources]
    );

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
        setCurrentPage(1);
    };

    const handleTabChange = (tab: 'all' | 'top10') => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const toggleStatusFilter = (value: StatusFilterValue) => {
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

    const matchesStatusFilter = (resource: AiRecommendationResource) => {
        const key: StatusFilterValue = resource.execution_status ?? 'unassigned';
        return statusFilter.has(key);
    };

    const filtered = useMemo(
        () => indexedResources.filter(({ resource }) => matchesStatusFilter(resource)),
        [indexedResources, statusFilter]
    );

    const sorted = useMemo(() => {
        const dir = sortDirection === 'desc' ? 1 : -1;
        return [...filtered].sort((a, b) => {
            if (sortField === 'savings') {
                return (b.resource.impact_matrix.savings_value - a.resource.impact_matrix.savings_value) * dir;
            }
            if (sortField === 'potential') {
                return ((b.resource.impact_matrix.potential_savings_value ?? 0) - (a.resource.impact_matrix.potential_savings_value ?? 0)) * dir;
            }
            return (getRiskWeight(b.resource.impact_matrix.risk_level.level) - getRiskWeight(a.resource.impact_matrix.risk_level.level)) * dir;
        });
    }, [filtered, sortField, sortDirection]);

    const displayed = useMemo(() => {
        if (activeTab !== 'top10') return sorted;
        const top = [...filtered]
            .sort((a, b) => b.resource.impact_matrix.savings_value - a.resource.impact_matrix.savings_value)
            .slice(0, 10);
        const dir = sortDirection === 'desc' ? 1 : -1;
        return top.sort((a, b) => {
            if (sortField === 'savings') {
                return (b.resource.impact_matrix.savings_value - a.resource.impact_matrix.savings_value) * dir;
            }
            if (sortField === 'potential') {
                return ((b.resource.impact_matrix.potential_savings_value ?? 0) - (a.resource.impact_matrix.potential_savings_value ?? 0)) * dir;
            }
            return (getRiskWeight(b.resource.impact_matrix.risk_level.level) - getRiskWeight(a.resource.impact_matrix.risk_level.level)) * dir;
        });
    }, [activeTab, filtered, sorted, sortField, sortDirection]);

    const totalPages = activeTab === 'all' ? Math.ceil(displayed.length / ITEMS_PER_PAGE) : 1;
    const paginated = activeTab === 'all'
        ? displayed.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
        : displayed;

    const getPageNumbers = (): (number | 'ellipsis')[] => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages: (number | 'ellipsis')[] = [1];
        if (currentPage > 3) pages.push('ellipsis');
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push('ellipsis');
        pages.push(totalPages);
        return pages;
    };

    const statusFilterLabel = (value: StatusFilterValue) => value === 'unassigned' ? 'Sin estado' : value;

    return (
        <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 ml-1">
                <div className="flex items-center gap-1 rounded-lg p-1 dark:bg-slate-950">
                    <button
                        onClick={() => handleTabChange('all')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer transition-colors ${activeTab === 'all'
                            ? 'bg-slate-500 text-white dark:bg-slate-800 shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Todos ({resources.length})
                    </button>
                    <button
                        onClick={() => handleTabChange('top10')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer transition-colors ${activeTab === 'top10'
                            ? 'bg-slate-500 text-white dark:bg-slate-800 shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Top 10
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSort('risk')}
                        className={`gap-1.5 text-xs ${sortField === 'risk' ? 'border-blue-400 dark:border-blue-600' : ''}`}
                    >
                        <ShieldAlert className="h-3.5 w-3.5" />
                        Riesgo
                        {sortField === 'risk' && (
                            sortDirection === 'desc'
                                ? <ChevronDown className="h-3.5 w-3.5" />
                                : <ChevronUp className="h-3.5 w-3.5" />
                        )}
                        {sortField !== 'risk' && <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSort('savings')}
                        className={`gap-1.5 text-xs ${sortField === 'savings' ? 'border-blue-400 dark:border-blue-600' : ''}`}
                    >
                        <DollarSign className="h-3.5 w-3.5" />
                        Ahorro
                        {sortField === 'savings' && (
                            sortDirection === 'desc'
                                ? <ChevronDown className="h-3.5 w-3.5" />
                                : <ChevronUp className="h-3.5 w-3.5" />
                        )}
                        {sortField !== 'savings' && <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSort('potential')}
                        className={`gap-1.5 text-xs ${sortField === 'potential' ? 'border-blue-400 dark:border-blue-600' : ''}`}
                    >
                        <Lightbulb className="h-3.5 w-3.5" />
                        Optimista
                        {sortField === 'potential' && (
                            sortDirection === 'desc'
                                ? <ChevronDown className="h-3.5 w-3.5" />
                                : <ChevronUp className="h-3.5 w-3.5" />
                        )}
                        {sortField !== 'potential' && <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 ml-1">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mr-1">
                    Estado:
                </span>
                {ALL_STATUS_FILTERS.map((value) => {
                    const active = statusFilter.has(value);
                    const baseStyle = value === 'unassigned' ? UNASSIGNED_BADGE : STATUS_STYLES[value];
                    return (
                        <button
                            key={value}
                            onClick={() => toggleStatusFilter(value)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer transition-all ${active ? baseStyle : 'bg-transparent text-slate-400 border-slate-200 dark:border-slate-700 dark:text-slate-500 opacity-60 hover:opacity-100'}`}
                        >
                            {statusFilterLabel(value)}
                        </button>
                    );
                })}
            </div>

            <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">
                {activeTab === 'all'
                    ? `Hallazgos Detallados (${displayed.length}${displayed.length !== resources.length ? ` de ${resources.length}` : ''})`
                    : `Top 10 Hallazgos por Ahorro`}
            </h3>

            {paginated.length === 0 && (
                <div className="text-center py-10 text-sm text-slate-500 dark:text-slate-400 border rounded-xl bg-card">
                    No hay recomendaciones que coincidan con los filtros seleccionados.
                </div>
            )}

            {paginated.map(({ resource, originalIndex }) => {
                const resourceKey = Array.isArray(resource.resource_id)
                    ? resource.resource_id.join('-')
                    : resource.resource_id;
                return (
                    <ResourceCard
                        key={`${resourceKey}-${originalIndex}`}
                        resource={resource}
                        onStatusChange={(newStatus, comment) => onStatusChange(originalIndex, newStatus, comment)}
                        onOpenHistory={() => onOpenHistory(originalIndex)}
                    />
                );
            })}

            {activeTab === 'all' && totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {getPageNumbers().map((page, idx) =>
                        page === 'ellipsis' ? (
                            <span key={`ellipsis-${idx}`} className="px-1 text-sm text-muted-foreground">…</span>
                        ) : (
                            <Button
                                key={page}
                                variant={currentPage === page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="h-8 w-8 p-0 text-xs"
                            >
                                {page}
                            </Button>
                        )
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export const AiRecommendationsComponent = ({ data, cloud }: AiRecommendationsComponentProps) => {

    const [reports, setReports] = useState<AiRecommendationReport[]>(() => data ?? []);
    const [feedback, setFeedback] = useState<StatusFeedback | null>(null);
    const [historyDialog, setHistoryDialog] = useState<{ open: boolean; recGroupId: string | null }>({
        open: false,
        recGroupId: null,
    });

    let STATUS_ENDPOINT = '';

    switch (cloud) {
        case 'azure':
            STATUS_ENDPOINT = '/api/azure/bridge/azure/assign_recommendation_execution_status';
            break;
        case 'aws':
            STATUS_ENDPOINT = '/api/aws/bridge/advisor/assign_recommendation_execution_status';
            break;
        case 'gcp':
            STATUS_ENDPOINT = '/api/gcp/bridge/gcp/ai_recommendations/assign_recommendation_execution_status';
            break;
        default:
            break;
    }
    const { trigger: triggerStatusUpdate } = useSWRMutation(STATUS_ENDPOINT, statusFetcher);


    useEffect(() => {
        setReports(data ?? []);
    }, [data]);

    useEffect(() => {
        if (!feedback) return;
        const isFullSuccess = feedback.recommendation_updated && feedback.status_event_created;
        const timeoutMs = isFullSuccess ? 4500 : 8000;
        const timer = setTimeout(() => setFeedback(null), timeoutMs);
        return () => clearTimeout(timer);
    }, [feedback]);

    const handleStatusChange = async (
        reportId: string,
        resourceIndex: number,
        newStatus: RecommendationStatus,
        comment: string
    ): Promise<void> => {
        const report = reports.find((r) => r.report_id === reportId);
        const resource = report?.resources[resourceIndex];
        if (!report || !resource) return;

        const payload: RecommendationStatusEvent = {
            report_id: report.report_id,
            recommendation_group_id: computeRecommendationGroupId(resource, report.cloud_provider),
            cloud_provider: report.cloud_provider,
            resource_type: resource.resource_type,
            recommendation_subtype: resource.recommendation_subtype,
            resource_id: resource.resource_id,
            resource_name: resource.resource_name,
            recommendation_summary: resource.diagnosis.summary,
            action_plan: resource.action_plan,
            execution_status: newStatus,
            saving_value: resource.impact_matrix.savings_value,
            status_assigned_at: new Date().toISOString(),
            recommendation_created_at: report.sync_time,
            comment: comment.length > 0 ? comment : undefined,
        };

        try {
            const result = await triggerStatusUpdate(payload);

            setFeedback({
                recommendation_updated: result.recommendation_updated === true,
                status_event_created: result.status_event_created === true,
                error: result.error_detail ?? undefined,
            });

            if (result.recommendation_updated) {
                setReports((prev) =>
                    prev.map((r) => {
                        if (r.report_id !== reportId) return r;
                        return {
                            ...r,
                            resources: r.resources.map((res, idx) =>
                                idx === resourceIndex ? { ...res, execution_status: newStatus } : res
                            ),
                        };
                    })
                );
            }
        } catch (err) {
            const status = (err as FetcherError).status;
            const detail = status === 404
                ? 'No se encontró la recomendación o el reporte en la base de datos'
                : status
                    ? `Error en la solicitud (${status})`
                    : 'No fue posible contactar el servidor';
            setFeedback({
                recommendation_updated: false,
                status_event_created: false,
                error: detail,
            });
        }
    };

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
            {feedback && (
                <StatusFeedbackToast
                    feedback={feedback}
                    onDismiss={() => setFeedback(null)}
                />
            )}

            <AiRecommendationsStatusDialogComponent
                open={historyDialog.open}
                onOpenChange={(open) => setHistoryDialog((prev) => ({ ...prev, open }))}
                recGroupId={historyDialog.recGroupId}
                cloud={cloud}
            />

            {reports.map((report) => (
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

                            <div className="w-full lg:w-[24rem] lg:flex-shrink-0">
                                <SavingsScenarioSummary
                                    conservative={report.total_monthly_savings}
                                    optimistic={report.total_potential_monthly_savings}
                                    confidence={report.confidence_potential_monthly_savings}
                                    syncTime={report.sync_time}
                                />
                            </div>
                        </div>
                    </div>

                    <FindingsSection
                        resources={report.resources}
                        onStatusChange={(resourceIndex, newStatus, comment) =>
                            handleStatusChange(report.report_id, resourceIndex, newStatus, comment)
                        }
                        onOpenHistory={(resourceIndex) => {
                            const resource = report.resources[resourceIndex];
                            if (!resource) return;
                            const recGroupId = computeRecommendationGroupId(resource, report.cloud_provider);
                            setHistoryDialog({ open: true, recGroupId });
                        }}
                    />
                    <Separator className='bg-black' />
                </div>

            ))}
        </div>
    );
};