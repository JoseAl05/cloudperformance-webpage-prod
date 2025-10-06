'use client'

import * as React from 'react'
import {
    StorageVariation,
    StorageVariationRanges,
} from '@/interfaces/vista-variacion-storage/variationStorageInterfaces'
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { bytesToGB } from '@/lib/bytesToMbs'

interface StorageVariationCardsComponentProps {
    strgVariationData: StorageVariation[]
}

const fmtNumber = (n: number | null | undefined) =>
    typeof n === 'number' && isFinite(n) ? new Intl.NumberFormat().format(n) : '—'

const fmtPercent = (n: number | null | undefined) =>
    typeof n === 'number' && isFinite(n) ? `${n.toFixed(2)}%` : '—'

const fmtGB = (n: number | null | undefined) => {
    if (typeof n !== 'number' || !isFinite(n)) return '—'
    const gb = Number(bytesToGB(n))
    return `${gb} GB`
    // return `${new Intl.NumberFormat().format(gb)} GB`
}

const esLabelMap: Record<string, string> = {
    month: 'Mes',
    year: 'Año',
}

const toEsLabel = (key: string) => esLabelMap[key] ?? titleCase(key)

const Trend = ({ value }: { value: number | null | undefined }) => {
    if (typeof value !== 'number' || !isFinite(value) || value === 0) {
        return (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
                <Minus className="h-4 w-4" />
                <span>Sin cambio</span>
            </div>
        )
    }
    const up = value > 0
    const Icon = up ? ArrowUpRight : ArrowDownRight
    const tone = up ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
    const bg = up ? 'bg-emerald-100 border-emerald-300 dark:bg-emerald-950/50 dark:border-emerald-800' : 'bg-rose-100 border-rose-300 dark:bg-rose-950/50 dark:border-rose-800'
    return (
        <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold ${bg} ${tone}`}>
            <Icon className="h-4 w-4 stroke-[2.5]" />
            <span>{up ? 'Aumentó' : 'Disminuyó'}</span>
        </div>
    )
}

const RangeExtras = ({ label, range }: { label: string; range?: StorageVariationRanges }) => {
    if (!range) return null

    const { metrics, average, ...rest } = range as unknown as Record<string, unknown>
    const preferredOrder = [
        'sum',
        'min',
        'max',
        'median',
        'p95',
        'count',
        'samples',
        'month',
        'year',
        'start_date',
        'end_date',
        'from',
        'to',
    ]

    const entries = Object.entries(rest)
        .filter(([_, v]) => v !== null && v !== undefined)
        .sort((a, b) => {
            const ia = preferredOrder.indexOf(a[0])
            const ib = preferredOrder.indexOf(b[0])
            if (ia === -1 && ib === -1) return a[0].localeCompare(b[0])
            if (ia === -1) return 1
            if (ib === -1) return -1
            return ia - ib
        })

    if (entries.length === 0 && !(metrics && Array.isArray(metrics))) return null

    return (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/50 p-5 dark:border-slate-800 dark:from-slate-900/50 dark:to-slate-900/20">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">{label}</div>
            <div className="space-y-2">
                {typeof average === "number" && (
                    <div className="flex items-center justify-between gap-4 rounded-lg border border-blue-200 bg-blue-50/80 px-4 py-2.5 dark:border-blue-900 dark:bg-blue-950/40">
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-200">Promedio</span>
                        <span className="text-sm font-bold tabular-nums text-blue-700 dark:text-blue-300">{fmtGB(average)}</span>
                    </div>
                )}
                {entries.map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-4 px-2 py-1.5">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{toEsLabel(k)}</span>
                        <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">{typeof v === "number" ? fmtNumber(v) : String(v)}</span>
                    </div>
                ))}
                {Array.isArray(metrics) && (
                    <div className="flex items-center justify-between gap-4 px-2 py-1.5">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Métricas analizadas</span>
                        <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">{metrics.length}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

const accentByService: Record<string, string> = {
    storage_account: 'border-l-4 border-emerald-500',
    blob_service: 'border-l-4 border-blue-500',
    file_service: 'border-l-4 border-amber-500',
    queue_service: 'border-l-4 border-cyan-500',
    table_service: 'border-l-4 border-pink-500',
}

export const StorageVariationCardsComponent = ({
    strgVariationData,
}: StorageVariationCardsComponentProps) => {
    const item = React.useMemo(
        () => (strgVariationData?.[0] as unknown as Record<string, unknown>) || undefined,
        [strgVariationData]
    )

    if (!item || Object.keys(item).length === 0) {
        return (
            <div className="grid gap-6">
                <Card className="border-2 border-dashed border-slate-300 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900/20">
                    <CardHeader className="pb-6 text-center">
                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">Variaciones de Storage</CardTitle>
                        <CardDescription className="text-base text-slate-600 dark:text-slate-400">No hay datos disponibles para mostrar</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-sm text-slate-500 dark:text-slate-500">
                        Los datos de variación aparecerán aquí cuando estén disponibles.
                    </CardContent>
                </Card>
            </div>
        )
    }

    const SERVICE_ORDER = ['storage_account', 'blob_service', 'file_service', 'queue_service', 'table_service']
    const keys = Object.keys(item)
    const mainKey = keys.includes('storage_account') ? 'storage_account' : keys[0]
    const otherKeys = SERVICE_ORDER.filter((k) => k !== mainKey && keys.includes(k))

    const renderServiceCard = (k: string, large = false) => {
        const sv = item[k] as {
            resource?: string | null
            metric?: string | null
            actual_range?: StorageVariationRanges
            prev_range?: StorageVariationRanges
            variation?: number | null
            variation_percent?: number | null
        }

        const title = serviceLabel(k)

        const actualAvgBytes = sv?.actual_range?.average
        const prevAvgBytes = sv?.prev_range?.average
        const varAbsBytes = sv?.variation
        const varPct = sv?.variation_percent

        const monthA = sv?.actual_range?.month;
        const monthB = sv?.prev_range?.month;

        const accent = accentByService[k] ?? 'border-l-4 border-border/80';

        const varAbsGB = typeof varAbsBytes === 'number' ? Number(varAbsBytes) : null;

        return (
            <Card
                key={k}
                className={`${large ? 'col-span-1 lg:col-span-2' : ''} ${accent} overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-lg transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-950`}
            >
                <CardHeader className="space-y-3 bg-gradient-to-br from-slate-50 to-white pb-6 dark:from-slate-900 dark:to-slate-950">
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2">
                            <CardTitle className={`${large ? 'text-3xl' : 'text-2xl'} font-bold text-slate-900 dark:text-slate-100`}>{title}</CardTitle>
                            {large && (
                                <CardDescription className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                    Comparación entre <span className="font-semibold">{monthB ?? 'Periodo previo'}</span> y <span className="font-semibold">{monthA ?? 'Periodo actual'}</span>
                                </CardDescription>
                            )}
                        </div>
                        <Badge variant="secondary" className="shrink-0 rounded-lg border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {sv?.metric ?? '—'}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 p-6">
                    <div className="space-y-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/50">
                        <div className="flex items-baseline justify-between gap-6">
                            <div className="space-y-2">
                                <div className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    {monthB ?? 'Periodo previo'}
                                </div>
                                <div className="text-3xl font-bold tabular-nums text-slate-900 dark:text-slate-100">{fmtGB(prevAvgBytes ?? null)}</div>
                            </div>
                            <div className="space-y-2 text-right">
                                <div className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    {monthA ?? 'Periodo actual'}
                                </div>
                                <div className="text-3xl font-bold tabular-nums text-slate-900 dark:text-slate-100">{fmtGB(actualAvgBytes ?? null)}</div>
                            </div>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                        <div className="space-y-3">
                            <div className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                                Variación detectada
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                                <Trend value={varAbsGB ?? undefined} />
                                <div className="flex items-baseline gap-2.5">
                                    {/* <span className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">{fmtGB(varAbsBytes ?? null)}</span> */}
                                    <span className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">{fmtGB(varAbsBytes)}</span>
                                    <span className="text-lg font-semibold text-slate-600 dark:text-slate-400">
                                        ({fmtPercent(varPct)})
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        <RangeExtras label="Mes Anterior" range={sv?.prev_range as StorageVariationRanges} />
                        <RangeExtras label="Mes Actual" range={sv?.actual_range as StorageVariationRanges} />
                    </div>
                </CardContent>

                {large && (
                    <CardFooter className="border-t border-slate-200 bg-slate-50/50 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                        Detalle de variación mensual y estadísticas del período seleccionado.
                    </CardFooter>
                )}
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {renderServiceCard(mainKey, true)}
            {otherKeys.map((k) => renderServiceCard(k))}
        </div>
    )
}

const serviceLabel = (key: string) => {
    switch (key) {
        case 'storage_account':
            return 'Storage Account'
        case 'blob_service':
            return 'Blob Service'
        case 'queue_service':
            return 'Queue Service'
        case 'file_service':
            return 'File Service'
        case 'table_service':
            return 'Table Service'
        default:
            return titleCase(key)
    }
}
