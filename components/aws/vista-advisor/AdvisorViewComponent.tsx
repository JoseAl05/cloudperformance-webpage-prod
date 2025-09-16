'use client'

import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { LoaderComponent } from '@/components/general/LoaderComponent'
import { MessageCard } from '../cards/MessageCards'
import { AlertCircle, ChartBar, Info, Search, ChevronDown, ChevronRight, X } from 'lucide-react'
import type {
    AdvisorApiResponse,
    AdvisorCategoryGroup,
    AdvisorRecommendation,
} from '@/interfaces/vista-advisor/advisorViewInterfaces'

interface AdvisorViewComponentProps {
    advisorCategory: string
    advisorStatus: string
    startDate: Date
    endDate: Date
    region: string
}

const fetcher = (url: string) =>
    fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json())

const normalize = (s: string) =>
    s
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')

export const AdvisorViewComponent = ({
    advisorCategory,
    advisorStatus,
    startDate,
    endDate,
    region,
}: AdvisorViewComponentProps) => {
    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''
    const advisorCategoryFormatted = advisorCategory?.toLowerCase() ?? ''
    const advisorStatusFormatted = advisorStatus?.toLowerCase() ?? ''

    const { data, error, isLoading } = useSWR<AdvisorApiResponse | unknown>(
        advisorCategory || advisorStatus
            ? `${process.env.NEXT_PUBLIC_API_URL}/advisor/get_advisor_data?date_from=${startDateFormatted}&date_to=${endDateFormatted}&region=${region}&category=${advisorCategoryFormatted}&status=${advisorStatusFormatted}`
            : null,
        fetcher,
    )

    const allRecommendationsData: AdvisorCategoryGroup[] | null = useMemo(() => {
        if (!Array.isArray(data)) return null
        return (data as unknown[])
            .filter((g) => g && typeof g.category === 'string' && Array.isArray(g.recommendations))
            .map((g) => ({
                category: g.category as string,
                recommendations: (g.recommendations as unknown[]).filter(
                    (r) => r && typeof r.name === 'string' && typeof r.check_id !== 'undefined',
                ) as AdvisorRecommendation[],
            }))
    }, [data])

    const [query, setQuery] = useState('')
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})
    const [selectedCheckId, setSelectedCheckId] = useState<string | null>(null)

    const filteredGroups = useMemo(() => {
        if (!allRecommendationsData) return [] as AdvisorCategoryGroup[]

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
    }, [filteredGroups])

    const selectedRec: AdvisorRecommendation | null = useMemo(() => {
        if (!selectedCheckId) return null
        for (const g of filteredGroups) {
            const found = g.recommendations.find((r) => String(r.check_id) === String(selectedCheckId))
            if (found) return found
        }
        return null
    }, [filteredGroups, selectedCheckId])

    const totalGroups = allRecommendationsData?.length ?? 0
    const totalRecs = allRecommendationsData?.reduce((acc, g) => acc + (g.recommendations?.length ?? 0), 0) ?? 0
    const filteredRecs = filteredGroups.reduce((acc, g) => acc + g.recommendations.length, 0)

    const toggleExpand = (cat: string) => setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }))
    const expandAll = () => setExpanded(Object.fromEntries(filteredGroups.map((g) => [g.category, true])))
    const collapseAll = () => setExpanded({})

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

    if (isLoading) return <LoaderComponent />

    if (!advisorCategory || !advisorStatus) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-muted-foreground text-lg font-medium">
                    No se ha seleccionado ninguna categoría o status.
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
                <MessageCard
                    icon={AlertCircle}
                    title="Error al cargar datos"
                    description="Ocurrió un problema al obtener la información desde la API. Intenta nuevamente o ajusta el rango de fechas."
                    tone="error"
                />
            </div>
        )
    }

    if (!allRecommendationsData || allRecommendationsData.length === 0) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin datos para mostrar"
                    description="No encontramos información del advisor en el rango seleccionado."
                    tone="warn"
                />
            </div>
        )
    }

    return (
        <div className="w-full min-w-0 px-4 py-6">
            <div className="flex items-center gap-3 mb-6">
                <ChartBar className="h-7 w-7 text-blue-500" />
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Recomendaciones</h1>
            </div>
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
                            const isOpen = expanded[group.category] ?? true
                            return (
                                <div key={group.category} className="border-b last:border-b-0">
                                    <button
                                        type="button"
                                        onClick={() => toggleExpand(group.category)}
                                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/70"
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
                                                                isSelected ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-muted',
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
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
