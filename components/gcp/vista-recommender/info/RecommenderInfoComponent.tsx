'use client'

import { Search, X, ChevronDown, ChevronRight, Info, DollarSign, Target, Calendar } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { RecommenderGcp } from '@/interfaces/gcpRecommenderInterfaces';

// NOTA: Ajusta tu interfaz si es necesario, el JSON usa 'savings_estimate'

interface RecommenderInfoComponentProps {
    data: RecommenderGcp[] | null;
}

interface GroupedRecommender {
    description: string;
    category: string;
    recommender_subtype: string;
    priority: string;
    last_refresh_time: string;
    total_savings: number;
    currency: string;
    count: number;
    items: RecommenderGcp[];
}

const normalize = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

export const RecommenderInfoComponent = ({ data }: RecommenderInfoComponentProps) => {

    const safeData = useMemo(() => {
        if (!Array.isArray(data)) return [];
        return data.filter((rec) => rec && typeof rec.description === 'string');
    }, [data]);

    const [query, setQuery] = useState('');
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [selectedDescription, setSelectedDescription] = useState<string | null>(null);

    // Agrupar por Category -> Description
    const groupedByCategory = useMemo(() => {
        const descMap = new Map<string, GroupedRecommender>();

        for (const rec of safeData) {
            const key = rec.description;
            if (!descMap.has(key)) {
                descMap.set(key, {
                    description: rec.description,
                    category: rec.category,
                    recommender_subtype: rec.recommender_subtype,
                    priority: rec.priority,
                    last_refresh_time: rec.last_refresh_time,
                    total_savings: 0,
                    currency: rec.savings_estimate?.currency || 'USD',
                    count: 0,
                    items: []
                });
            }

            const group = descMap.get(key)!;
            group.items.push(rec);
            group.count++;

            // CAMBIO 1: Solo sumar si es categoría COST y usar Math.abs para quitar el negativo
            if (rec.category === 'COST' && rec.savings_estimate?.amount) {
                group.total_savings += Math.abs(rec.savings_estimate.amount);
            }
        }

        const catMap = new Map<string, GroupedRecommender[]>();

        Array.from(descMap.values()).forEach(group => {
            if (!catMap.has(group.category)) {
                catMap.set(group.category, []);
            }
            catMap.get(group.category)!.push(group);
        });

        return Array.from(catMap.entries())
            .map(([category, recommendations]) => ({
                category,
                recommendations: recommendations.sort((a, b) => {
                    if (b.total_savings !== a.total_savings) return b.total_savings - a.total_savings;
                    return b.count - a.count;
                })
            }))
            .sort((a, b) => b.recommendations.length - a.recommendations.length);
    }, [safeData]);

    const filteredGroups = useMemo(() => {
        const q = normalize(query);
        if (!q) return groupedByCategory;

        return groupedByCategory
            .map((group) => {
                const catMatch = normalize(group.category).includes(q);
                const recs = catMatch
                    ? group.recommendations
                    : group.recommendations.filter((r) =>
                        normalize(r.description).includes(q) ||
                        normalize(r.recommender_subtype).includes(q)
                    );
                return { ...group, recommendations: recs };
            })
            .filter((g) => g.recommendations.length > 0);
    }, [groupedByCategory, query]);

    useEffect(() => {
        if (!filteredGroups.length) {
            setSelectedDescription(null);
            return;
        }
        const stillExists = filteredGroups.some((g) =>
            g.recommendations.some((r) => r.description === selectedDescription)
        );
        if (!stillExists) {
            const first = filteredGroups[0]?.recommendations[0];
            setSelectedDescription(first?.description ?? null);
        }
    }, [filteredGroups, selectedDescription]);

    const selectedRec: GroupedRecommender | null = useMemo(() => {
        if (!selectedDescription) return null;
        for (const g of filteredGroups) {
            const found = g.recommendations.find((r) => r.description === selectedDescription);
            if (found) return found;
        }
        return null;
    }, [filteredGroups, selectedDescription]);

    const totalGroups = groupedByCategory.length;
    const totalRecs = groupedByCategory.reduce((acc, g) => acc + g.recommendations.length, 0);
    const filteredRecsCount = filteredGroups.reduce((acc, g) => acc + g.recommendations.length, 0);

    const toggleExpand = (cat: string) =>
        setExpanded((prev) => ({ ...prev, [cat]: !(prev[cat] ?? false) }));

    const expandAll = () =>
        setExpanded(Object.fromEntries(filteredGroups.map((g) => [g.category, true])));

    const collapseAll = () =>
        setExpanded(Object.fromEntries(filteredGroups.map((g) => [g.category, false])));

    useEffect(() => {
        setExpanded((prev) => {
            const next: Record<string, boolean> = {};
            for (const g of filteredGroups) {
                next[g.category] = prev[g.category] ?? (filteredGroups.length < 3);
            }
            return next;
        });
    }, [filteredGroups]);

    const FilterMark = ({ text, q }: { text: string; q: string }) => {
        if (!q) return <>{text}</>;
        const norm = normalize(text);
        const nq = normalize(q);
        const idx = norm.indexOf(nq);
        if (idx === -1) return <>{text}</>;
        const before = text.slice(0, idx);
        const match = text.slice(idx, idx + q.length);
        const after = text.slice(idx + q.length);
        return (
            <>
                {before}
                <mark className="rounded-sm px-0.5 bg-yellow-200 dark:bg-yellow-800">{match}</mark>
                {after}
            </>
        );
    };

    const priorityBadge = (priority: string) => {
        const base = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border';
        const p = priority?.toUpperCase() || 'P4';

        if (p === 'P1') return <span className={`${base} bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800`}>P1 Crítico</span>;
        if (p === 'P2') return <span className={`${base} bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800`}>P2 Alto</span>;
        if (p === 'P3') return <span className={`${base} bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800`}>P3 Medio</span>;
        return <span className={`${base} bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700`}>{p} Bajo</span>;
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar por categoría, descripción..."
                        className="w-full rounded-lg border bg-background pl-9 pr-9 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                    {query && (
                        <button onClick={() => setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted">
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="hidden sm:inline">Categorías:</span>
                    <span className="font-medium text-foreground">{totalGroups}</span>
                    <span className="hidden sm:inline">• Tipos:</span>
                    <span className="font-medium text-foreground">{filteredRecsCount} / {totalRecs}</span>
                    <div className="ml-2 flex gap-2">
                        <button onClick={expandAll} className="rounded-md border px-2 py-1 text-xs hover:bg-muted">Expandir</button>
                        <button onClick={collapseAll} className="rounded-md border px-2 py-1 text-xs hover:bg-muted">Colapsar</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[60vh]">
                <aside className="lg:col-span-5 xl:col-span-4 rounded-xl border bg-card flex flex-col">
                    <div className="p-3 border-b bg-muted/40 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Recomendaciones
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-[70vh]">
                        {filteredGroups.map((group) => {
                            const isOpen = expanded[group.category] ?? false;
                            return (
                                <div key={group.category} className="border-b last:border-b-0">
                                    <button
                                        type="button"
                                        onClick={() => toggleExpand(group.category)}
                                        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/70 cursor-pointer select-none bg-card"
                                    >
                                        <div className="flex items-center gap-2">
                                            {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                                            <span className="font-semibold text-sm">
                                                <FilterMark text={group.category} q={query} />
                                            </span>
                                        </div>
                                        <span className="text-xs rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground font-mono">
                                            {group.recommendations.length}
                                        </span>
                                    </button>

                                    {isOpen && (
                                        <ul className="bg-muted/10">
                                            {group.recommendations.map((rec) => {
                                                const isSelected = selectedDescription === rec.description;
                                                const showSavings = rec.category === 'COST' && rec.total_savings > 0;
                                                return (
                                                    <li key={rec.description} className="border-t border-border/40 first:border-t-0">
                                                        <button
                                                            className={`w-full text-left px-4 py-3 text-sm transition-colors ${isSelected
                                                                    ? 'bg-primary/5 border-l-4 border-l-primary'
                                                                    : 'hover:bg-muted/50 border-l-4 border-l-transparent'
                                                                }`}
                                                            onClick={() => setSelectedDescription(rec.description)}
                                                        >
                                                            <div className="font-medium line-clamp-2 mb-1.5">
                                                                <FilterMark text={rec.description} q={query} />
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    {priorityBadge(rec.priority)}
                                                                </div>
                                                                {/* CAMBIO 2: Condicional para mostrar badge de ahorro solo si es COST */}
                                                                {showSavings && (
                                                                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-900">
                                                                        {formatCurrency(rec.total_savings, rec.currency)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                        {filteredGroups.length === 0 && (
                            <div className="p-8 text-center text-sm text-muted-foreground">
                                No se encontraron recomendaciones.
                            </div>
                        )}
                    </div>
                </aside>

                <section className="lg:col-span-7 xl:col-span-8 rounded-xl border bg-card flex flex-col overflow-hidden">
                    {!selectedRec ? (
                        <div className="h-full min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-muted/5">
                            <Info className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <h2 className="text-lg font-semibold">Selecciona una recomendación</h2>
                            <p className="text-sm text-muted-foreground max-w-xs mt-2">
                                Explora las categorías en el panel izquierdo para ver los detalles y oportunidades.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full max-h-[75vh]">
                            <div className="p-5 border-b bg-card">
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                            {selectedRec.category}
                                            <span className="text-border">|</span>
                                            {selectedRec.recommender_subtype}
                                        </div>
                                        <h2 className="text-xl font-bold leading-snug">{selectedRec.description}</h2>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {priorityBadge(selectedRec.priority)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                                    {/* CAMBIO 3: Renderizado condicional de la tarjeta de Ahorro */}
                                    {selectedRec.category === 'COST' ? (
                                        <div className={`rounded-lg border p-3 flex flex-col justify-between bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800`}>
                                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
                                                <DollarSign className="h-3.5 w-3.5" />
                                                Ahorro mensual estimado
                                            </div>
                                            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                                {formatCurrency(selectedRec.total_savings, selectedRec.currency)}
                                            </div>
                                        </div>
                                    ) : (
                                        // Placeholder o Info cuando no es costo
                                        <div className="rounded-lg border p-3 bg-muted/20 flex flex-col justify-between">
                                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
                                                <Info className="h-3.5 w-3.5" />
                                                Tipo de Mejora
                                            </div>
                                            <div className="text-sm font-medium">
                                                Operacional / Fiabilidad
                                            </div>
                                        </div>
                                    )}

                                    <div className="rounded-lg border p-3 bg-muted/20 flex flex-col justify-between">
                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
                                            <Target className="h-3.5 w-3.5" />
                                            Recursos Afectados
                                        </div>
                                        <div className="text-xl font-bold">{selectedRec.count}</div>
                                    </div>

                                    <div className="rounded-lg border p-3 bg-muted/20 flex flex-col justify-between">
                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            Última Actualización
                                        </div>
                                        <div className="text-lg font-medium">
                                            {formatDate(selectedRec.last_refresh_time)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-0 bg-muted/5">
                                <div className="p-4 sm:p-5">
                                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                        Detalle de la recomendación ({selectedRec.count})
                                    </h3>
                                    <div className="rounded-lg border bg-card overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-muted/40 text-xs text-muted-foreground uppercase border-b">
                                                <tr>
                                                    <th className="px-4 py-3 font-medium">Proyecto</th>
                                                    <th className="px-4 py-3 font-medium">Ubicación</th>
                                                    {selectedRec.category === 'COST' && (
                                                        <th className="px-4 py-3 font-medium text-right">Ahorro mensual</th>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {selectedRec.items.map((item, idx) => {
                                                    const saving = item.savings_estimate?.amount ? Math.abs(item.savings_estimate.amount) : 0;
                                                    return (
                                                        <tr key={idx} className="hover:bg-muted/30">
                                                            <td className="px-4 py-3 font-medium text-foreground">
                                                                {item.project_id}
                                                            </td>
                                                            <td className="px-4 py-3 text-muted-foreground">
                                                                {item.location}
                                                            </td>
                                                            {/* CAMBIO 5: Ocultar celda de ahorro si no es COST */}
                                                            {selectedRec.category === 'COST' && (
                                                                <td className="px-4 py-3 text-right font-mono">
                                                                    <span className="text-emerald-600 dark:text-emerald-400">
                                                                        {formatCurrency(saving, item.savings_estimate?.currency || 'USD')}
                                                                    </span>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
};