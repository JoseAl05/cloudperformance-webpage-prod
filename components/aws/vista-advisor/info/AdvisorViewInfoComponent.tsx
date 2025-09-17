'use client'

import { AllAdvisorRecommendations, AllAdvisorRecommendationsData } from '@/interfaces/vista-advisor/advisorViewInterfaces'
import { ChevronDown, ChevronRight, Info, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface AdvisorViewInfoComponentProps {
    data: AllAdvisorRecommendations[] | null;
}

type CheckDetail = {
    status?: string
    sync_time?: string
    categorySpecificSummary?: {
        costOptimizing?: {
            estimatedMonthlySavings?: number
            estimatedPercentMonthlySavings?: number
        }
        [k: string]: unknown
    }
    resourcesSummary?: {
        resourcesProcessed?: number
        resourcesFlagged?: number
        resourcesIgnored?: number
        resourcesSuppressed?: number
    }
    flaggedResources?: Array<{
        status?: string
        region?: string
        resourceId?: string
        isSuppressed?: boolean
        metadata?: unknown[]
    }>
}

type AdvisorRecMaybeDetails = AllAdvisorRecommendationsData & {
    check_details?: CheckDetail[]
}

const normalize = (s: string) =>
    s
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '');

const hasCheckDetails = (rec: unknown): rec is AdvisorRecMaybeDetails =>
    !!rec && typeof rec === 'object' && Array.isArray((rec as unknown).check_details)

const fmtCurrencyUSD = (n?: number) =>
    typeof n === 'number' ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n) : null

const fmtPct = (n?: number) =>
    typeof n === 'number' ? `${n}%` : null

const shortId = (id?: string, left = 6, right = 6) =>
    id && id.length > left + right + 3 ? `${id.slice(0, left)}...${id.slice(-right)}` : id ?? ''

export const AdvisorViewInfoComponent = ({ data }: AdvisorViewInfoComponentProps) => {

    const allRecommendationsData: AllAdvisorRecommendations[] | null = useMemo(() => {
        if (!Array.isArray(data)) return null
        return (data as AllAdvisorRecommendations[])
            .filter((g) => g && typeof (g as AllAdvisorRecommendations).category === 'string' && Array.isArray((g as AllAdvisorRecommendations).recommendations))
            .map((g: AllAdvisorRecommendations) => ({
                category: g.category as string,
                recommendations: (g.recommendations as AllAdvisorRecommendationsData[]).filter(
                    (r: AllAdvisorRecommendationsData) => r && typeof r.name === 'string' && typeof r.check_id !== 'undefined',
                ) as AllAdvisorRecommendationsData[],
            }))
    }, [data])

    const [query, setQuery] = useState('')
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})
    const [selectedCheckId, setSelectedCheckId] = useState<string | null>(null)

    const filteredGroups = useMemo(() => {
        if (!allRecommendationsData) return [] as AllAdvisorRecommendationsData[]

        const q = normalize(query)

        return allRecommendationsData
            .map((group) => {
                const catMatch = q ? normalize(group.category).includes(q) : true
                const recs = catMatch
                    ? group.recommendations
                    : group.recommendations.filter((r) => normalize(r.name).includes(q))
                return { ...group, recommendations: recs }
            })
            .filter((g) => g.recommendations.length > 0)
    }, [allRecommendationsData, query])

    useEffect(() => {
        if (!filteredGroups.length) {
            setSelectedCheckId(null)
            return
        }
        const stillExists = filteredGroups.some((g) => g.recommendations.some((r) => r.check_id === selectedCheckId))
        if (!stillExists) {
            const first = filteredGroups[0]?.recommendations[0]
            setSelectedCheckId(first ? String(first.check_id) : null)
        }
    }, [filteredGroups, selectedCheckId])

    const selectedRec: AllAdvisorRecommendationsData | null = useMemo(() => {
        if (!selectedCheckId) return null
        for (const g of filteredGroups) {
            const found = g.recommendations.find((r) => String(r.check_id) === String(selectedCheckId))
            if (found) return found
        }
        return null
    }, [filteredGroups, selectedCheckId])

    const totalGroups = allRecommendationsData?.length ?? 0;
    const totalRecs = allRecommendationsData?.reduce((acc, g) => acc + (g.recommendations?.length ?? 0), 0) ?? 0;
    const filteredRecs = filteredGroups.reduce((acc, g) => acc + g.recommendations.length, 0);

    const toggleExpand = (cat: string) =>
        setExpanded((prev) => ({ ...prev, [cat]: !(prev[cat] ?? false) }));

    const expandAll = () =>
        setExpanded(Object.fromEntries(filteredGroups.map((g) => [g.category, true])));

    const collapseAll = () =>
        setExpanded(Object.fromEntries(filteredGroups.map((g) => [g.category, false])));

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
                <mark className="rounded-sm px-0.5">{match}</mark>
                {after}
            </>
        )
    }

    const details: CheckDetail | null = useMemo(() => {
        if (!selectedRec) return null
        if (!hasCheckDetails(selectedRec)) return null
        return selectedRec.check_details?.[0] ?? null
    }, [selectedRec])

    const savingsUSD = details?.categorySpecificSummary && typeof details.categorySpecificSummary === 'object'
        ? (details.categorySpecificSummary as unknown)?.costOptimizing?.estimatedMonthlySavings
        : undefined

    const savingsPct = details?.categorySpecificSummary && typeof details.categorySpecificSummary === 'object'
        ? (details.categorySpecificSummary as unknown)?.costOptimizing?.estimatedPercentMonthlySavings
        : undefined

    const resSum = details?.resourcesSummary
    const flagged = details?.flaggedResources ?? []

    const statusBadge = (st?: string) => {
        const s = (st ?? '').toLowerCase()
        const base = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium'
        if (s === 'ok' || s === 'green') return <span className={`${base} bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/30`}>OK</span>
        if (s === 'warning' || s === 'yellow') return <span className={`${base} bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/30`}>Warning</span>
        if (s === 'error' || s === 'red') return <span className={`${base} bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/30`}>Error</span>
        return <span className={`${base} bg-muted text-muted-foreground`}>{st ?? '—'}</span>
    }

    return (
        <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar por categoría o nombre…"
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
                            className="rounded-md border px-2 py-1 hover:bg-muted"
                        >
                            Expandir todo
                        </button>
                        <button
                            onClick={collapseAll}
                            className="rounded-md border px-2 py-1 hover:bg-muted"
                        >
                            Colapsar todo
                        </button>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[60vh]">
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
                                                const isSelected = String(selectedCheckId) === String(rec.check_id)
                                                return (
                                                    <li key={rec.check_id}>
                                                        <button
                                                            role="radio"
                                                            aria-checked={isSelected}
                                                            className={[
                                                                'w-full text-left rounded-md px-3 py-2 my-1',
                                                                isSelected ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-muted cursor-pointer',
                                                            ].join(' ')}
                                                            onClick={() => setSelectedCheckId(String(rec.check_id))}
                                                        >
                                                            <span className="text-sm"><FilterMark text={rec.name} q={query} /></span>
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
                                <h2 className="text-xl font-bold leading-tight">{selectedRec.name}</h2>
                            </div>
                            <div className="p-4 overflow-y-auto">
                                <div
                                    className="[&_a]:text-blue-500 [&_a]:underline [&_h4]:text-xl [&_h4]:font-bold"
                                    dangerouslySetInnerHTML={{ __html: selectedRec.description }}
                                />
                                {details && (
                                    <div className="space-y-3 pt-5">
                                        <h3 className="text-xl font-bold">Detalle Recomendación</h3>

                                        {/* Estado + Ahorros */}
                                        <div className="grid sm:grid-cols-3 gap-3">
                                            <div className="rounded-lg border p-3">
                                                <div className="text-xs text-muted-foreground mb-1">Estado</div>
                                                {statusBadge(details.status)}
                                            </div>

                                            <div className="rounded-lg border p-3">
                                                <div className="text-xs text-muted-foreground mb-1">Ahorro mensual estimado</div>
                                                <div className="text-sm font-medium">
                                                    {fmtCurrencyUSD(savingsUSD) ?? '—'}
                                                </div>
                                            </div>

                                            <div className="rounded-lg border p-3">
                                                <div className="text-xs text-muted-foreground mb-1">% ahorro estimado</div>
                                                <div className="text-sm font-medium">
                                                    {fmtPct(savingsPct) ?? '—'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Resumen de recursos */}
                                        {resSum && (
                                            <div className="rounded-lg border p-3">
                                                <div className="text-xs text-muted-foreground mb-2">Resumen de recursos</div>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="px-2 py-1 text-xs rounded bg-muted">
                                                        Procesados: <strong>{resSum.resourcesProcessed ?? 0}</strong>
                                                    </span>
                                                    <span className="px-2 py-1 text-xs rounded bg-muted">
                                                        Marcados: <strong>{resSum.resourcesFlagged ?? 0}</strong>
                                                    </span>
                                                    <span className="px-2 py-1 text-xs rounded bg-muted">
                                                        Ignorados: <strong>{resSum.resourcesIgnored ?? 0}</strong>
                                                    </span>
                                                    <span className="px-2 py-1 text-xs rounded bg-muted">
                                                        Suprimidos: <strong>{resSum.resourcesSuppressed ?? 0}</strong>
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Flagged resources */}
                                        <div className="rounded-lg border">
                                            <div className="p-3 border-b flex items-center justify-between">
                                                <div className="text-sm font-medium">Recursos marcados</div>
                                                <div className="text-xs text-muted-foreground">{flagged.length} ítems</div>
                                            </div>

                                            {flagged.length === 0 ? (
                                                <div className="p-4 text-sm text-muted-foreground">
                                                    No hay recursos marcados para esta verificación.
                                                </div>
                                            ) : (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm text-wrap wrap-break-word">
                                                        <thead className="text-left text-muted-foreground border-b">
                                                            <tr>
                                                                <th className="px-3 py-2">Región</th>
                                                                <th className="px-3 py-2">Estado</th>
                                                                <th className="px-3 py-2">ResourceId</th>
                                                                <th className="px-3 py-2">Suprimido</th>
                                                                <th className="px-3 py-2">Metadata</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {flagged.map((fr, idx) => (
                                                                <tr key={`${fr.resourceId ?? idx}-${idx}`} className="border-b last:border-b-0">
                                                                    <td className="px-3 py-2">{fr.region ?? '—'}</td>
                                                                    <td className="px-3 py-2">{statusBadge(fr.status)}</td>
                                                                    <td className="px-3 py-2 font-mono text-xs">{fr.resourceId}</td>
                                                                    <td className="px-3 py-2">{fr.isSuppressed ? 'Sí' : 'No'}</td>
                                                                    <td className="px-3 py-2">
                                                                        {Array.isArray(fr.metadata) && fr.metadata.length > 0 ? (
                                                                            <div className="flex flex-wrap gap-1">
                                                                                {fr.metadata.map((m, i) => (
                                                                                    <span key={i} className="px-1.5 py-0.5 text-xs rounded bg-muted">
                                                                                        {String(m)}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-muted-foreground">—</span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </>
    )

}