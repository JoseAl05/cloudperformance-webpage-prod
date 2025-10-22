'use client'

import { Search, X, ExternalLink, ChevronDown, ChevronRight, Info } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
interface AzureAdvisorRecommendation {
    _cq_sync_time: { $date: string }
    impact: string
    high_impact: number
    medium_impact: number
    low_impact: number
    category: string
    impacted_value: string
    impacted_value_count: number
    last_updated: string
    problem: string
    total_recommendations: number
    visual_impact: string
    resource_type: string
}

interface AdvisorViewInfoComponentProps {
    data: AzureAdvisorRecommendation[] | null;
    startDate: Date;
    endDate: Date;
}

interface DetailResource {
    impacted_value: string
    last_updated: string
    solution: string
    subscription: string
}

interface GroupedRecommendation {
    problem: string
    impact: string
    visual_impact: string
    category: string
    resource_type: string
    last_updated: string
    impacted_values: string[]
    impacted_count: number
    first_impacted_value: string
}

interface CategoryGroup {
    category: string
    recommendations: GroupedRecommendation[]
}

const normalize = (s: string) =>
    s
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '');

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const AdvisorViewInfoComponent = ({ data, startDate, endDate }: AdvisorViewInfoComponentProps) => {

    const safeData = useMemo(() => {
        if (!Array.isArray(data)) return []
        return data.filter((rec) => rec && typeof rec.problem === 'string')
    }, [data])

    const [query, setQuery] = useState('')
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})
    const [selectedProblem, setSelectedProblem] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalImpactedValue, setModalImpactedValue] = useState<string | null>(null)

    // Agrupar primero por problem, luego por category
    const groupedByCategory = useMemo(() => {
        // Paso 1: Agrupar por problem
        const problemGroups = new Map<string, AzureAdvisorRecommendation[]>()

        for (const rec of safeData) {
            const key = rec.problem
            if (!problemGroups.has(key)) {
                problemGroups.set(key, [])
            }
            problemGroups.get(key)!.push(rec)
        }

        // Paso 2: Crear recomendaciones agrupadas
        const recommendations: GroupedRecommendation[] = Array.from(problemGroups.entries()).map(([problem, recs]) => ({
            problem,
            impact: recs[0].impact,
            visual_impact: recs[0].visual_impact,
            category: recs[0].category,
            resource_type: recs[0].resource_type,
            last_updated: recs[0].last_updated,
            impacted_values: recs.map(r => r.impacted_value),
            impacted_count: recs.length,
            first_impacted_value: recs[0].impacted_value,
        }))

        // Paso 3: Agrupar por categoría
        const categoryMap = new Map<string, GroupedRecommendation[]>()

        for (const rec of recommendations) {
            if (!categoryMap.has(rec.category)) {
                categoryMap.set(rec.category, [])
            }
            categoryMap.get(rec.category)!.push(rec)
        }

        // Paso 4: Convertir a array y ordenar
        return Array.from(categoryMap.entries())
            .map(([category, recommendations]) => ({
                category,
                recommendations: recommendations.sort((a, b) => b.impacted_count - a.impacted_count)
            }))
            .sort((a, b) => b.recommendations.length - a.recommendations.length)
    }, [safeData])

    const filteredGroups = useMemo(() => {
        const q = normalize(query)
        if (!q) return groupedByCategory

        return groupedByCategory
            .map((group) => {
                const catMatch = normalize(group.category).includes(q)
                const recs = catMatch
                    ? group.recommendations
                    : group.recommendations.filter((r) =>
                        normalize(r.problem).includes(q) ||
                        normalize(r.impact).includes(q) ||
                        normalize(r.resource_type || '').includes(q)
                    )
                return { ...group, recommendations: recs }
            })
            .filter((g) => g.recommendations.length > 0)
    }, [groupedByCategory, query])

    // Auto-select first recommendation
    useEffect(() => {
        if (!filteredGroups.length) {
            setSelectedProblem(null)
            return
        }
        const stillExists = filteredGroups.some((g) =>
            g.recommendations.some((r) => r.problem === selectedProblem)
        )
        if (!stillExists) {
            const first = filteredGroups[0]?.recommendations[0]
            setSelectedProblem(first?.problem ?? null)
        }
    }, [filteredGroups, selectedProblem])

    const selectedRec: GroupedRecommendation | null = useMemo(() => {
        if (!selectedProblem) return null
        for (const g of filteredGroups) {
            const found = g.recommendations.find((r) => r.problem === selectedProblem)
            if (found) return found
        }
        return null
    }, [filteredGroups, selectedProblem])

    const totalGroups = groupedByCategory.length
    const totalRecs = groupedByCategory.reduce((acc, g) => acc + g.recommendations.length, 0)
    const filteredRecs = filteredGroups.reduce((acc, g) => acc + g.recommendations.length, 0)

    const toggleExpand = (cat: string) =>
        setExpanded((prev) => ({ ...prev, [cat]: !(prev[cat] ?? false) }))

    const expandAll = () =>
        setExpanded(Object.fromEntries(filteredGroups.map((g) => [g.category, true])))

    const collapseAll = () =>
        setExpanded(Object.fromEntries(filteredGroups.map((g) => [g.category, false])))

    useEffect(() => {
        setExpanded((prev) => {
            const next: Record<string, boolean> = {}
            for (const g of filteredGroups) {
                next[g.category] = prev[g.category] ?? false
            }
            return next
        })
    }, [filteredGroups])

    const FilterMark = ({ text, q }: { text: string; q: string }) => {
        if (!q) return <>{text}</>
        const norm = normalize(text)
        const nq = normalize(q)
        const idx = norm.indexOf(nq)
        if (idx === -1) return <>{text}</>
        const before = text.slice(0, idx)
        const match = text.slice(idx, idx + q.length)
        const after = text.slice(idx + q.length)
        return (
            <>
                {before}
                <mark className="rounded-sm px-0.5 bg-yellow-200 dark:bg-yellow-800">{match}</mark>
                {after}
            </>
        )
    }

    const impactBadge = (visualImpact: string) => {
        const base = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium'

        if (visualImpact.includes('Alto') || visualImpact.includes('🟥')) {
            return <span className={`${base} bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/30`}>
                🟥 Alto
            </span>
        }
        if (visualImpact.includes('Medio') || visualImpact.includes('🟨')) {
            return <span className={`${base} bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 ring-1 ring-yellow-500/30`}>
                🟨 Medio
            </span>
        }
        if (visualImpact.includes('Bajo') || visualImpact.includes('🟩')) {
            return <span className={`${base} bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/30`}>
                🟩 Bajo
            </span>
        }
        return <span className={`${base} bg-muted text-muted-foreground`}>{visualImpact}</span>
    }

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr)
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return dateStr
        }
    }

    const openModal = (impactedValue: string) => {
        setModalImpactedValue(impactedValue)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setModalImpactedValue(null)
    }

    // Obtener todos los recursos del grupo seleccionado
    const getSelectedGroupResources = () => {
        if (!selectedRec) return []
        // Buscar en safeData todos los registros que tengan el mismo problem
        const recursos = safeData.filter(rec => rec.problem === selectedRec.problem)
        return recursos
    }

    return (
        <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar por categoría o nombre..."
                        className="w-full rounded-lg border bg-background pl-9 pr-9 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted"
                            aria-label="Limpiar búsqueda"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="hidden sm:inline">Categorías:</span>
                    <span className="font-medium text-foreground">{totalGroups}</span>
                    <span className="hidden sm:inline">• Recomendaciones:</span>
                    <span className="font-medium text-foreground">{filteredRecs} / {totalRecs}</span>
                    <div className="ml-2 flex gap-2">
                        <button
                            onClick={expandAll}
                            className="rounded-md border px-2 py-1 text-xs hover:bg-muted"
                        >
                            Expandir todo
                        </button>
                        <button
                            onClick={collapseAll}
                            className="rounded-md border px-2 py-1 text-xs hover:bg-muted"
                        >
                            Colapsar todo
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[60vh]">
                {/* Panel Izquierdo - Categorías y Recomendaciones */}
                <aside className="lg:col-span-5 xl:col-span-4 rounded-xl border bg-card">
                    <div className="p-3 border-b flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">Resultados</div>
                        <div className="text-sm">{filteredRecs} ítems</div>
                    </div>
                    <div className="max-h-[70vh] overflow-y-auto">
                        {filteredGroups.map((group) => {
                            const isOpen = expanded[group.category] ?? false
                            return (
                                <div key={group.category} className="border-b last:border-b-0">
                                    <button
                                        type="button"
                                        onClick={() => toggleExpand(group.category)}
                                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/70 cursor-pointer select-none"
                                        aria-expanded={isOpen}
                                    >
                                        <div className="flex items-center gap-2">
                                            {isOpen ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                            <span className="font-medium">
                                                <FilterMark text={group.category} q={query} />
                                            </span>
                                        </div>
                                        <span className="text-xs rounded-full bg-muted px-2 py-0.5">
                                            {group.recommendations.length}
                                        </span>
                                    </button>
                                    {isOpen && (
                                        <ul role="radiogroup" className="px-1 pb-2">
                                            {group.recommendations.map((rec) => {
                                                const isSelected = selectedProblem === rec.problem
                                                return (
                                                    <li key={rec.problem}>
                                                        <button
                                                            role="radio"
                                                            aria-checked={isSelected}
                                                            className={[
                                                                'w-full text-left rounded-md px-3 py-2 my-1',
                                                                isSelected ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-muted cursor-pointer',
                                                            ].join(' ')}
                                                            onClick={() => setSelectedProblem(rec.problem)}
                                                        >
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="text-sm flex-1">
                                                                    <FilterMark text={rec.problem} q={query} />
                                                                </span>
                                                                {impactBadge(rec.visual_impact)}
                                                            </div>
                                                        </button>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    )}
                                </div>
                            )
                        })}
                        {filteredGroups.length === 0 && (
                            <div className="p-6 text-center text-sm text-muted-foreground">Sin resultados.</div>
                        )}
                    </div>
                </aside>

                {/* Panel Derecho - Detalle de Recomendación */}
                <section className="lg:col-span-7 xl:col-span-8 rounded-xl border bg-card">
                    {!selectedRec ? (
                        <div className="h-full min-h-[50vh] grid place-items-center p-8 text-center">
                            <div className="max-w-md">
                                <Info className="mx-auto h-8 w-8 text-muted-foreground" />
                                <h2 className="mt-3 text-lg font-semibold">Selecciona una recomendación</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Haz clic en un nombre del panel izquierdo para ver el detalle aquí.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full max-h-[70vh]">
                            <div className="p-4 border-b space-y-1">
                                <div className="text-xs uppercase tracking-wide text-muted-foreground">Recomendación</div>
                                <h2 className="text-xl font-bold leading-tight">{selectedRec.problem}</h2>
                            </div>
                            <div className="p-4 overflow-y-auto space-y-4">
                                {/* Información Principal */}
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <div className="rounded-lg border p-3">
                                        <div className="text-xs text-muted-foreground mb-1">Categoría</div>
                                        <div className="font-medium">{selectedRec.category}</div>
                                    </div>
                                    <div className="rounded-lg border p-3">
                                        <div className="text-xs text-muted-foreground mb-1">Impacto</div>
                                        {impactBadge(selectedRec.visual_impact)}
                                    </div>
                                    <div className="rounded-lg border p-3">
                                        <div className="text-xs text-muted-foreground mb-1">Tipo de Recurso</div>
                                        <div className="font-mono text-xs">{selectedRec.resource_type || '—'}</div>
                                    </div>
                                    <div className="rounded-lg border p-3">
                                        <div className="text-xs text-muted-foreground mb-1">Última Actualización</div>
                                        <div className="text-sm">{formatDate(selectedRec.last_updated)}</div>
                                    </div>
                                </div>

                                {/* Recursos Afectados */}
                                <div className="rounded-lg border p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-sm font-medium">Recursos Afectados</div>
                                        <div className="text-xs text-muted-foreground">{selectedRec.impacted_count} recursos</div>
                                    </div>
                                    <button
                                        onClick={() => openModal(selectedRec.problem)}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm"
                                    >
                                        Ver Detalle de Recursos
                                        <ExternalLink className="h-4 w-4" />
                                    </button>
                                </div>
                                {/* 
                                //Información Adicional
                                <div className="rounded-lg border p-4 bg-muted/30">
                                    <div className="text-xs text-muted-foreground mb-2">Impacted Value (ID)</div>
                                    <div className="font-mono text-xs break-all bg-background p-2 rounded">
                                        {selectedRec.first_impacted_value}
                                    </div>
                                </div>*/}

                            </div>
                        </div>
                    )}
                </section>
            </div>

            {/* Modal de detalle */}
            {isModalOpen && modalImpactedValue && (
                <DetailModal
                    resources={getSelectedGroupResources()}
                    onClose={closeModal}
                />
            )}
        </>
    )
}

// Componente Modal de Detalle
interface DetailModalProps {
    resources: AzureAdvisorRecommendation[]
    onClose: () => void
}

const DetailModal = ({ resources, onClose }: DetailModalProps) => {
    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr)
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return dateStr
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div
                className="bg-background rounded-xl border shadow-lg w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-lg font-bold">Detalle de Recursos Afectados</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded hover:bg-muted"
                        aria-label="Cerrar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {resources.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No se encontraron recursos
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {resources.map((resource, idx) => (
                                <div key={idx} className="rounded-lg border p-4 space-y-3">
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">Recurso</div>
                                        <div className="font-mono text-sm font-medium bg-muted/50 p-2 rounded break-all">
                                            {resource.impacted_value}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">Acciones recomendadas</div>
                                        <div className="text-sm bg-blue-50 dark:bg-blue-950/30 p-3 rounded border border-blue-200 dark:border-blue-800">
                                            {resource.problem}
                                        </div>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        <div>
                                            <div className="text-xs text-muted-foreground mb-1">Suscripción</div>
                                            <div className="font-medium text-sm">
                                                {/* Necesitaríamos agregar subscription al registro, por ahora mostramos placeholder */}
                                                Azure subscription 1
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground mb-1">Última Actualización</div>
                                            <div className="text-sm">{formatDate(resource.last_updated)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}